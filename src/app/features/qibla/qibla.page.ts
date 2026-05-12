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
import {
  componentsFromOrientationQuaternion,
  headingDegFromOrientationQuaternionBlended,
} from '../../core/math/orientation-quaternion-heading';
import { estimateMagneticDeclinationDeg } from '../../core/math/magnetic-declination';

type LocationSource = 'preset' | 'gps';

const ALIGN_THRESHOLD_DEG = 5;

/** EMA time constant for compass heading (ms); larger → steadier needle. */
const SMOOTH_TIME_CONSTANT_MS = 380;

/** Ignore magnetometer spikes: jumps larger than this within {@link SPIKE_FAST_DT_MS}. */
const SPIKE_JUMP_DEG = 42;

const SPIKE_DAMP_ALPHA = 0.12;

const SPIKE_FAST_DT_MS = 90;

const FLAT_BLEND_START_DEG = 10;
const FLAT_BLEND_END_DEG = 35;

function lerpAngleDeg(from: number, to: number, t: number): number {
  const diff = ((to - from + 540) % 360) - 180;
  return (from + diff * t + 360) % 360;
}

/** Minimal typing — `AbsoluteOrientationSensor` is not in all TS lib targets. */
type AbsoluteOrientationSensorInstance = {
  quaternion: DOMPointReadOnly | ReadonlyArray<number> | null;
  start(): Promise<void>;
  stop(): void;
  addEventListener(
    type: 'reading' | 'error',
    listener: (this: AbsoluteOrientationSensorInstance, ev: Event) => void,
  ): void;
};

type AbsoluteOrientationSensorConstructor = new (options?: {
  frequency?: number;
  referenceFrame?: 'device' | 'screen';
}) => AbsoluteOrientationSensorInstance;

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
  /** Show calibration overlay before starting the compass. */
  protected readonly showCalibrationOverlay = signal(false);
  /** Show a transient calibration hint banner. */
  protected readonly showCalibrationHint = signal(false);

  protected readonly rawHeading = signal<number | null>(null);
  protected readonly smoothedHeading = signal<number | null>(null);

  /** FAQ open/close state by index. */
  protected readonly faqOpen = signal<Set<number>>(new Set());

  private geoWatchId: number | null = null;
  private orientationTimer: ReturnType<typeof setTimeout> | null = null;

  private absoluteSensor: AbsoluteOrientationSensorInstance | null = null;

  /** Fusion state updated every sensor tick; signals flushed once per animation frame. */
  private internalSmoothed: number | null = null;
  private lastRawHeadingInternal: number | null = null;
  private lastHeadingTs = 0;

  private rafFlushScheduled = false;
  private rafFlushHandle = 0;

  private readonly orientationListener = (e: DeviceOrientationEvent) => {
    const heading = headingFromDeviceOrientationEvent(e, {
      screenAngleDeg: this.getScreenAngleDeg(),
      flatBlendStartDeg: FLAT_BLEND_START_DEG,
      flatBlendEndDeg: FLAT_BLEND_END_DEG,
    });
    if (heading === null) return;
    this.ingestHeadingSample(heading);
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

  /** iOS / iPadOS need `deviceorientation` (`webkitCompassHeading`); Android Chrome uses `deviceorientationabsolute`. */
  private isIosLike(): boolean {
    const ua = navigator.userAgent;
    if (/iP(ad|hone|od)/i.test(ua)) return true;
    return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  }

  private registerOrientationListeners(): void {
    const ios = this.isIosLike();
    if ('ondeviceorientationabsolute' in window && !ios) {
      window.addEventListener('deviceorientationabsolute', this.orientationListener, true);
    } else {
      window.addEventListener('deviceorientation', this.orientationListener, true);
    }
  }

  private getScreenAngleDeg(): number {
    if (typeof window === 'undefined') return 0;
    const raw =
      typeof screen !== 'undefined' && typeof screen.orientation?.angle === 'number'
        ? screen.orientation.angle
        : (window as Window & { orientation?: number }).orientation ?? 0;
    return normalizeDeg(typeof raw === 'number' ? raw : 0);
  }

  private ingestHeadingSample(heading: number): void {
    if (!Number.isFinite(heading)) return;

    if (this.showCalibrationHint()) {
      this.showCalibrationHint.set(false);
    }

    this.lastRawHeadingInternal = heading;
    this.compassNoDataHint.set(false);

    const now = performance.now();
    const dt = this.lastHeadingTs > 0 ? now - this.lastHeadingTs : 0;
    this.lastHeadingTs = now;

    let target = heading;
    if (this.internalSmoothed !== null && dt > 0 && dt < SPIKE_FAST_DT_MS) {
      const jump = Math.abs(((heading - this.internalSmoothed + 540) % 360) - 180);
      if (jump > SPIKE_JUMP_DEG) {
        target = lerpAngleDeg(this.internalSmoothed, heading, SPIKE_DAMP_ALPHA);
      }
    }

    const prev = this.internalSmoothed;
    if (prev === null || dt === 0) {
      this.internalSmoothed = target;
    } else {
      const alpha = 1 - Math.exp(-dt / SMOOTH_TIME_CONSTANT_MS);
      this.internalSmoothed = lerpAngleDeg(prev, target, alpha);
    }

    this.scheduleHeadingFlush();
  }

  private scheduleHeadingFlush(): void {
    if (this.rafFlushScheduled) return;
    this.rafFlushScheduled = true;
    this.rafFlushHandle = requestAnimationFrame(() => {
      this.rafFlushScheduled = false;
      this.rafFlushHandle = 0;
      this.rawHeading.set(this.lastRawHeadingInternal);
      this.smoothedHeading.set(this.internalSmoothed);
    });
  }

  private cancelHeadingFlush(): void {
    if (this.rafFlushHandle !== 0) {
      cancelAnimationFrame(this.rafFlushHandle);
      this.rafFlushHandle = 0;
    }
    this.rafFlushScheduled = false;
  }

  private stopAbsoluteSensor(): void {
    if (!this.absoluteSensor) return;
    try {
      this.absoluteSensor.stop();
    } catch {
      /* ignore */
    }
    this.absoluteSensor = null;
  }

  private async tryStartAbsoluteOrientationSensor(): Promise<boolean> {
    if (typeof window === 'undefined' || !window.isSecureContext) return false;
    // iOS/iPadOS: rely on `deviceorientation` + `webkitCompassHeading`; fused sensor path is unreliable.
    if (this.isIosLike()) return false;

    const ctor = (globalThis as unknown as { AbsoluteOrientationSensor?: AbsoluteOrientationSensorConstructor })
      .AbsoluteOrientationSensor;
    if (!ctor) return false;

    try {
      const sensor = new ctor({ frequency: 50, referenceFrame: 'device' });

      sensor.addEventListener('reading', () => {
        const parsed = componentsFromOrientationQuaternion(sensor.quaternion);
        if (!parsed) return;
        const h = headingDegFromOrientationQuaternionBlended(parsed.x, parsed.y, parsed.z, parsed.w, {
          screenAngleDeg: this.getScreenAngleDeg(),
          flatBlendStartDeg: FLAT_BLEND_START_DEG,
          flatBlendEndDeg: FLAT_BLEND_END_DEG,
        });
        if (h === null) return;
        this.ingestHeadingSample(h);
      });

      sensor.addEventListener('error', () => {
        if (this.absoluteSensor !== sensor) return;
        this.stopAbsoluteSensor();
        if (this.compassListening()) {
          this.registerOrientationListeners();
        }
      });

      await sensor.start();
      this.absoluteSensor = sensor;
      return true;
    } catch {
      return false;
    }
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
    this.cancelHeadingFlush();
    this.stopAbsoluteSensor();
    window.removeEventListener('deviceorientationabsolute', this.orientationListener, true);
    window.removeEventListener('deviceorientation', this.orientationListener, true);
    this.compassListening.set(false);
    this.rawHeading.set(null);
    this.smoothedHeading.set(null);
    this.internalSmoothed = null;
    this.lastRawHeadingInternal = null;
    this.lastHeadingTs = 0;
  }

  /** Show the calibration overlay; actual compass starts after user dismisses it. */
  protected requestCompass(): void {
    if (!this.orientationSupported) return;
    this.showCalibrationOverlay.set(true);
  }

  /** User dismissed the calibration overlay — now actually start the compass. */
  protected async dismissCalibration(): Promise<void> {
    this.showCalibrationOverlay.set(false);
    await this.enableCompass();
  }

  private async enableCompass(): Promise<void> {
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

    const sensorStarted = await this.tryStartAbsoluteOrientationSensor();
    if (!sensorStarted) {
      this.registerOrientationListeners();
    }

    this.compassListening.set(true);
    if (this.orientationTimer) clearTimeout(this.orientationTimer);
    this.orientationTimer = setTimeout(() => {
      if (this.compassListening() && this.rawHeading() === null) {
        this.compassNoDataHint.set(true);
        this.showCalibrationHint.set(false);
      }
    }, 4000);
  }

  protected toggleFaq(index: number): void {
    const current = new Set(this.faqOpen());
    if (current.has(index)) {
      current.delete(index);
    } else {
      current.add(index);
    }
    this.faqOpen.set(current);
  }

  protected isFaqOpen(index: number): boolean {
    return this.faqOpen().has(index);
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
