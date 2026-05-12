import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
  computed,
  effect,
  untracked,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../prayer-times/components/header/header.component';
import { CitySelectorComponent } from '../prayer-times/components/city-selector/city-selector.component';
import { LocationService } from '../../core/services/location.service';
import { LanguageService } from '../../core/services/language.service';
import { Location } from '../../core/models/location.model';
import {
  computeDistanceToKaabaKm,
  computeQiblaBearingDeg,
} from '../../core/math/qibla-bearing';
import { headingFromDeviceOrientationEvent, normalizeDeg } from '../../core/math/compass-heading';
import { estimateMagneticDeclinationDeg } from '../../core/math/magnetic-declination';

type LocationSource = 'preset' | 'gps';

const ALIGN_THRESHOLD_DEG = 5;

/** Time constant for the exponential moving-average heading filter (ms). */
const SMOOTH_TIME_CONSTANT_MS = 120;

function lerpAngleDeg(from: number, to: number, t: number): number {
  const diff = ((to - from + 540) % 360) - 180;
  return (from + diff * t + 360) % 360;
}

@Component({
  selector: 'app-qibla-page',
  standalone: true,
  imports: [HeaderComponent, CitySelectorComponent, RouterLink],
  templateUrl: './qibla.page.html',
  styleUrl: './qibla.page.css',
})
export class QiblaPage implements OnInit {
  /** Every 10° around the dial (for SVG tick marks). */
  protected readonly tickMarks = Array.from({ length: 36 }, (_, i) => i);

  private readonly locationService = inject(LocationService);
  private readonly title = inject(Title);
  protected readonly langService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly labels = this.langService.labels;
  protected readonly locations = signal<Location[]>([]);
  protected readonly source = signal<LocationSource>('preset');
  protected readonly selectedPreset = signal<Location | null>(null);
  protected readonly gpsCoords = signal<{ lat: number; lng: number } | null>(null);
  protected readonly gpsMessage = signal<string | null>(null);
  protected readonly gpsLoading = signal(false);

  protected readonly orientationSupported = typeof DeviceOrientationEvent !== 'undefined';
  protected readonly compassListening = signal(false);
  protected readonly compassDenied = signal(false);
  protected readonly compassNoDataHint = signal(false);
  /** Show a one-time calibration hint when the compass first activates. */
  protected readonly showCalibrationHint = signal(false);
  protected readonly prefersReducedMotion =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  protected readonly rawHeading = signal<number | null>(null);
  protected readonly smoothedHeading = signal<number | null>(null);

  private geoWatchId: number | null = null;
  private orientationTimer: ReturnType<typeof setTimeout> | null = null;
  /** Timestamp of the last heading sample (for time-based smoothing). */
  private lastHeadingTs = 0;

  private readonly orientationListener = (e: DeviceOrientationEvent) => {
    const h = headingFromDeviceOrientationEvent(e);
    if (h === null) return;

    // Dismiss the calibration hint once real data arrives.
    if (this.showCalibrationHint()) {
      this.showCalibrationHint.set(false);
    }

    this.rawHeading.set(h);
    this.compassNoDataHint.set(false);

    // --- Time-based exponential moving average ---
    const now = performance.now();
    const dt = this.lastHeadingTs ? now - this.lastHeadingTs : 0;
    this.lastHeadingTs = now;

    const prev = this.smoothedHeading();
    if (prev === null || this.prefersReducedMotion || dt === 0) {
      this.smoothedHeading.set(h);
    } else {
      // alpha = 1 - e^(-dt/tau) → identical smoothing regardless of sensor Hz
      const alpha = 1 - Math.exp(-dt / SMOOTH_TIME_CONSTANT_MS);
      this.smoothedHeading.set(lerpAngleDeg(prev, h, alpha));
    }
  };

  constructor() {
    effect(() => {
      const docTitle = this.langService.labels().qiblaPageDocTitle;
      untracked(() => this.title.setTitle(docTitle));
    });

    this.destroyRef.onDestroy(() => {
      this.teardownCompass();
      this.clearGeoWatch();
      if (this.orientationTimer) clearTimeout(this.orientationTimer);
    });
  }

  protected readonly effectivePoint = computed(() => {
    if (this.source() === 'preset') {
      const p = this.selectedPreset();
      return p ? { lat: p.lat, lng: p.lng, label: p.name } : null;
    }
    const g = this.gpsCoords();
    return g ? { lat: g.lat, lng: g.lng, label: null as string | null } : null;
  });

  /** True-north bearing from user position toward the Kaaba [0, 360). */
  protected readonly bearingDeg = computed(() => {
    const pt = this.effectivePoint();
    if (!pt) return null;
    return computeQiblaBearingDeg(pt.lat, pt.lng);
  });

  /**
   * Magnetic bearing to the Kaaba (true bearing minus magnetic declination).
   * This is what we compare against the compass heading (which reads magnetic north).
   */
  protected readonly magneticBearingDeg = computed(() => {
    const b = this.bearingDeg();
    const pt = this.effectivePoint();
    if (b == null || !pt) return null;
    const decl = estimateMagneticDeclinationDeg(pt.lat, pt.lng);
    return normalizeDeg(b - decl);
  });

  protected readonly distanceKm = computed(() => {
    const pt = this.effectivePoint();
    if (!pt) return null;
    return computeDistanceToKaabaKm(pt.lat, pt.lng);
  });

  protected readonly dialRotateDeg = computed(() => {
    const b = this.magneticBearingDeg();
    if (b == null) return 0;
    const h = this.smoothedHeading();
    // No heading yet: orient dial so Qibla aligns with top marker (flat-phone fallback).
    if (h == null) return -b;
    return -h;
  });

  protected readonly qiblaAligned = computed(() => {
    const b = this.magneticBearingDeg();
    const h = this.smoothedHeading();
    if (b == null || h == null) return false;
    const diff = Math.abs(((b - h + 540) % 360) - 180);
    return diff <= ALIGN_THRESHOLD_DEG;
  });

  ngOnInit(): void {
    this.locationService.getLocations().subscribe((list) => this.locations.set(list));
    const sel = this.locationService.getSelectedLocation();
    this.selectedPreset.set(sel);
  }

  protected setSource(mode: LocationSource): void {
    this.source.set(mode);
    this.gpsMessage.set(null);
    if (mode === 'gps') {
      this.startGps();
    } else {
      this.clearGeoWatch();
      this.gpsCoords.set(null);
      this.gpsLoading.set(false);
    }
  }

  protected onPresetChange(loc: Location): void {
    this.selectedPreset.set(loc);
    this.locationService.setSelectedLocation(loc);
  }

  private startGps(): void {
    this.clearGeoWatch();
    this.gpsCoords.set(null);
    if (!navigator.geolocation) {
      this.gpsMessage.set(this.langService.labels().qiblaGpsError);
      return;
    }
    this.gpsLoading.set(true);
    const labels = this.langService.labels();
    this.geoWatchId = navigator.geolocation.watchPosition(
      (pos) => {
        this.gpsLoading.set(false);
        this.gpsMessage.set(null);
        this.gpsCoords.set({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err: GeolocationPositionError) => {
        this.gpsLoading.set(false);
        if (err.code === 1) {
          this.gpsMessage.set(labels.qiblaGpsDenied);
        } else {
          this.gpsMessage.set(labels.qiblaGpsError);
        }
      },
      { enableHighAccuracy: true, maximumAge: 20_000, timeout: 15_000 },
    );
  }

  private clearGeoWatch(): void {
    if (this.geoWatchId != null) {
      navigator.geolocation.clearWatch(this.geoWatchId);
      this.geoWatchId = null;
    }
  }

  private teardownCompass(): void {
    window.removeEventListener('deviceorientationabsolute', this.orientationListener, true);
    window.removeEventListener('deviceorientation', this.orientationListener, true);
    this.compassListening.set(false);
    this.rawHeading.set(null);
    this.smoothedHeading.set(null);
    this.lastHeadingTs = 0;
  }

  protected async enableCompass(): Promise<void> {
    if (!this.orientationSupported) return;
    this.compassDenied.set(false);
    this.compassNoDataHint.set(false);
    const DO = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
    };
    if (typeof DO.requestPermission === 'function') {
      try {
        const status = await DO.requestPermission();
        if (status !== 'granted') {
          this.compassDenied.set(true);
          return;
        }
      } catch {
        this.compassDenied.set(true);
        return;
      }
    }
    this.teardownCompass();

    // Show calibration hint until the first real heading event arrives.
    this.showCalibrationHint.set(true);

    // Prefer `deviceorientationabsolute` (Android) — alpha is magnetic-north-referenced.
    // Always also listen to `deviceorientation` for iOS (webkitCompassHeading path).
    // headingFromDeviceOrientationEvent() gates non-absolute standard events → returns null.
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', this.orientationListener, true);
    }
    window.addEventListener('deviceorientation', this.orientationListener, true);

    this.compassListening.set(true);
    if (this.orientationTimer) clearTimeout(this.orientationTimer);
    this.orientationTimer = setTimeout(() => {
      if (this.compassListening() && this.rawHeading() === null) {
        this.compassNoDataHint.set(true);
        this.showCalibrationHint.set(false);
      }
    }, 4000);
  }

  protected bearingFmt(): string {
    const b = this.bearingDeg();
    return b == null ? '—' : `${Math.round(b)}°`;
  }

  protected distanceFmt(): string {
    const d = this.distanceKm();
    if (d == null) return '—';
    if (d >= 100) return `${Math.round(d)} km`;
    if (d >= 10) return `${d.toFixed(1)} km`;
    return `${d.toFixed(2)} km`;
  }

  protected locationLine(): string {
    const pt = this.effectivePoint();
    if (!pt) {
      return this.source() === 'gps' && this.gpsLoading()
        ? this.langService.labels().qiblaGpsPending
        : '';
    }
    return pt.label ?? `${pt.lat.toFixed(4)}°, ${pt.lng.toFixed(4)}°`;
  }
}
