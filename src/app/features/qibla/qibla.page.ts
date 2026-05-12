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
import { headingFromDeviceOrientationEvent } from '../../core/math/compass-heading';

type LocationSource = 'preset' | 'gps';

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
  protected readonly prefersReducedMotion =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  protected readonly rawHeading = signal<number | null>(null);
  protected readonly smoothedHeading = signal<number | null>(null);

  private geoWatchId: number | null = null;
  private orientationTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly orientationListener = (e: DeviceOrientationEvent) => {
    const h = headingFromDeviceOrientationEvent(e);
    if (h === null) return;
    this.rawHeading.set(h);
    this.compassNoDataHint.set(false);
    const prev = this.smoothedHeading();
    const next =
      prev === null || this.prefersReducedMotion
        ? h
        : lerpAngleDeg(prev, h, this.compassListening() ? 0.22 : 1);
    this.smoothedHeading.set(next);
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

  protected readonly bearingDeg = computed(() => {
    const pt = this.effectivePoint();
    if (!pt) return null;
    return computeQiblaBearingDeg(pt.lat, pt.lng);
  });

  protected readonly distanceKm = computed(() => {
    const pt = this.effectivePoint();
    if (!pt) return null;
    return computeDistanceToKaabaKm(pt.lat, pt.lng);
  });

  protected readonly dialRotateDeg = computed(() => {
    const b = this.bearingDeg();
    if (b == null) return 0;
    const h = this.smoothedHeading();
    // No heading yet: orient dial so Qibla aligns with top marker (flat-phone fallback).
    if (h == null) return -b;
    return -h;
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
    window.addEventListener('deviceorientationabsolute', this.orientationListener, true);
    window.addEventListener('deviceorientation', this.orientationListener, true);
    this.compassListening.set(true);
    if (this.orientationTimer) clearTimeout(this.orientationTimer);
    this.orientationTimer = setTimeout(() => {
      if (this.compassListening() && this.rawHeading() === null) {
        this.compassNoDataHint.set(true);
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
