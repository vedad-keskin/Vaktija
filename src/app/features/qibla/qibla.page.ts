import {
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  inject,
  signal,
  computed,
  effect,
  untracked,
  viewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../prayer-times/components/header/header.component';
import { CitySelectorComponent } from '../prayer-times/components/city-selector/city-selector.component';
import { LocationService } from '../../core/services/location.service';
import { LanguageService } from '../../core/services/language.service';
import { Location } from '../../core/models/location.model';
import {
  computeDistanceToKaabaKm,
  computeQiblaBearingDeg,
  isValidCoordinates,
} from '../../core/math/qibla-bearing';
import {
  angleDeltaDeg,
  headingFromDeviceOrientationEvent,
  isDeviceOrientationTiltUsable,
  normalizeDeg,
} from '../../core/math/compass-heading';
import {
  componentsFromOrientationQuaternion,
  headingDegFromOrientationQuaternionTopAxis,
} from '../../core/math/orientation-quaternion-heading';
import { estimateMagneticDeclinationDeg } from '../../core/math/magnetic-declination';
import { AngularOneEuroFilter, COMPASS_STALE_MS } from '../../core/math/angular-one-euro-filter';

type LocationSource = 'preset' | 'gps';

// UI tolerances, not a claim of sensor accuracy. Tune with phone traces.
const ALIGN_ENTER_DEG = 4;
const ALIGN_EXIT_DEG = 7;
const ALIGN_DWELL_MS = 300;
const DISPLAY_DEADBAND_DEG = 0.3;
const SOURCE_WAIT_MS = 2000;

/** Minimal typing — `AbsoluteOrientationSensor` is not in all TS lib targets. */
type AbsoluteOrientationSensorInstance = {
  quaternion: DOMPointReadOnly | ReadonlyArray<number> | null;
  start(): void;
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
  /** Every 5° around the dial (for SVG tick marks). */
  protected readonly tickMarks = Array.from({ length: 72 }, (_, i) => i);

  private readonly locationService = inject(LocationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  protected readonly langService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly labels = this.langService.labels;
  protected readonly locations = signal<Location[]>([]);
  protected readonly source = signal<LocationSource>('preset');
  protected readonly selectedPreset = signal<Location | null>(null);
  protected readonly timesPath = computed(() =>
    this.selectedPreset() ? `/${this.locationService.citySlug(this.selectedPreset()!)}` : '/',
  );
  protected readonly gpsCoords = signal<{ lat: number; lng: number } | null>(null);
  private readonly gpsError = signal<'qiblaGpsDenied' | 'qiblaGpsError' | null>(null);
  protected readonly gpsMessage = computed(() => {
    const key = this.gpsError();
    return key ? this.labels()[key] : null;
  });
  protected readonly gpsLoading = signal(false);

  protected readonly orientationSupported =
    typeof DeviceOrientationEvent !== 'undefined' || 'AbsoluteOrientationSensor' in globalThis;
  protected readonly compassListening = signal(false);
  protected readonly compassDenied = signal(false);
  protected readonly compassNoDataHint = signal(false);
  protected readonly compassQualityHint = signal<'tilt' | 'accuracy' | null>(null);
  protected readonly qiblaAligned = signal(false);
  /** Show calibration overlay before starting the compass. */
  protected readonly showCalibrationOverlay = signal(false);
  /** Show a transient calibration hint banner. */
  protected readonly showCalibrationHint = signal(false);

  protected readonly rawHeading = signal<number | null>(null);
  protected readonly smoothedHeading = signal<number | null>(null);

  private readonly calibrationDialog =
    viewChild<ElementRef<HTMLDialogElement>>('calibrationDialog');

  protected readonly compassStatus = computed(() => {
    const labels = this.labels();
    if (!this.orientationSupported) return labels.qiblaUnsupported;
    if (this.compassDenied()) return labels.qiblaPermissionDenied;
    if (this.bearingDeg() === null && this.effectivePoint())
      return labels.qiblaDirectionUnavailable;
    if (!this.compassListening()) return labels.qiblaCompassIdle;
    if (this.declinationDeg() === null && this.effectivePoint())
      return labels.qiblaNorthUnavailable;
    if (this.compassQualityHint() === 'tilt') return labels.qiblaHoldFlat;
    if (this.compassQualityHint() === 'accuracy') return labels.qiblaUncalibrated;
    if (this.compassNoDataHint()) return labels.qiblaNoEventsHint;
    if (this.smoothedHeading() === null) return labels.qiblaCompassWaiting;
    return this.qiblaAligned() ? labels.qiblaAlignedLabel : labels.qiblaCompassListening;
  });

  private geoWatchId: number | null = null;
  private sourceTimer: ReturnType<typeof setTimeout> | null = null;
  private staleTimer: ReturnType<typeof setTimeout> | null = null;
  private compassSession = 0;
  private activeSource: 'events' | 'sensor' | null = null;
  private orientationListener: ((e: DeviceOrientationEvent) => void) | null = null;
  private screenAngle = 0;
  private alignedSince: number | null = null;
  private readonly headingFilter = new AngularOneEuroFilter();

  private absoluteSensor: AbsoluteOrientationSensorInstance | null = null;

  /** Fusion state updated every sensor tick; signals flushed once per animation frame. */
  private internalSmoothed: number | null = null;
  private lastRawHeadingInternal: number | null = null;
  private lastHeadingTs: number | null = null;

  private rafFlushScheduled = false;
  private rafFlushHandle = 0;

  private readonly visibilityListener = () => {
    if (!this.compassListening()) return;
    if (document.hidden) {
      this.stopHeadingSources();
      this.resetHeading();
    } else {
      this.startHeadingSources();
    }
  };

  private readonly screenOrientationListener = () => {
    if (!this.compassListening()) return;
    this.screenAngle = this.getScreenAngleDeg();
    this.resetHeading();
  };

  constructor() {
    effect(() => {
      const dialog = this.calibrationDialog()?.nativeElement;
      if (!dialog) return;
      if (this.showCalibrationOverlay() && !dialog.open) dialog.showModal();
      else if (!this.showCalibrationOverlay() && dialog.open) dialog.close();
    });

    effect(() => {
      const docTitle = this.langService.labels().qiblaPageDocTitle;
      untracked(() => this.title.setTitle(docTitle));
    });

    document.addEventListener('visibilitychange', this.visibilityListener);
    screen.orientation?.addEventListener('change', this.screenOrientationListener);
    window.addEventListener('orientationchange', this.screenOrientationListener);

    this.destroyRef.onDestroy(() => {
      this.teardownCompass();
      this.clearGeoWatch();
      document.removeEventListener('visibilitychange', this.visibilityListener);
      screen.orientation?.removeEventListener('change', this.screenOrientationListener);
      window.removeEventListener('orientationchange', this.screenOrientationListener);
    });
  }

  /** iOS / iPadOS need `deviceorientation` (`webkitCompassHeading`); Android Chrome uses `deviceorientationabsolute`. */
  private isIosLike(): boolean {
    const ua = navigator.userAgent;
    if (/iP(ad|hone|od)/i.test(ua)) return true;
    return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  }

  private registerOrientationListeners(): void {
    const session = this.compassSession;
    this.activeSource = 'events';
    this.orientationListener = (event) => {
      if (session !== this.compassSession || this.activeSource !== 'events' || document.hidden)
        return;
      const accuracy = (event as DeviceOrientationEvent & { webkitCompassAccuracy?: number })
        .webkitCompassAccuracy;
      if (accuracy != null && (!Number.isFinite(accuracy) || accuracy < 0)) {
        this.markUnusable('accuracy');
        return;
      }
      const heading = headingFromDeviceOrientationEvent(event, {
        screenAngleDeg: this.getScreenAngleDeg(),
      });
      if (heading === null) {
        const earthReferenced =
          event.absolute ||
          Number.isFinite(
            (event as DeviceOrientationEvent & { webkitCompassHeading?: number })
              .webkitCompassHeading,
          );
        if (
          earthReferenced &&
          event.beta != null &&
          event.gamma != null &&
          Number.isFinite(event.beta) &&
          Number.isFinite(event.gamma) &&
          !isDeviceOrientationTiltUsable(event)
        ) {
          this.markUnusable('tilt');
        }
        return;
      }
      this.ingestHeadingSample(heading);
    };
    const type =
      'ondeviceorientationabsolute' in window && !this.isIosLike()
        ? 'deviceorientationabsolute'
        : 'deviceorientation';
    window.addEventListener(type, this.orientationListener, true);
  }

  private getScreenAngleDeg(): number {
    const raw =
      typeof screen.orientation?.angle === 'number'
        ? screen.orientation.angle
        : ((window as Window & { orientation?: number }).orientation ?? 0);
    return normalizeDeg(Number.isFinite(raw) ? raw : 0);
  }

  private resetHeading(): void {
    this.cancelHeadingFlush();
    if (this.staleTimer) clearTimeout(this.staleTimer);
    this.staleTimer = null;
    this.headingFilter.reset();
    this.lastHeadingTs = null;
    this.internalSmoothed = this.lastRawHeadingInternal = null;
    this.rawHeading.set(null);
    this.smoothedHeading.set(null);
    this.alignedSince = null;
    this.qiblaAligned.set(false);
    this.compassQualityHint.set(null);
    this.compassNoDataHint.set(false);
  }

  private markUnusable(reason: 'tilt' | 'accuracy'): void {
    this.resetHeading();
    this.compassQualityHint.set(reason);
    this.compassNoDataHint.set(false);
  }

  private ingestHeadingSample(magneticHeading: number): void {
    if (!Number.isFinite(magneticHeading)) return;
    const declination = this.declinationDeg();
    if (declination === null) return;
    const screenAngle = this.getScreenAngleDeg();
    if (screenAngle !== this.screenAngle) {
      this.resetHeading();
      this.screenAngle = screenAngle;
    }
    const now = performance.now();
    if (this.lastHeadingTs !== null && now - this.lastHeadingTs >= COMPASS_STALE_MS)
      this.resetHeading();
    this.lastHeadingTs = now;
    const heading = normalizeDeg(magneticHeading + declination);
    this.lastRawHeadingInternal = heading;
    this.internalSmoothed = this.headingFilter.update(heading, now);
    this.showCalibrationHint.set(false);
    this.compassNoDataHint.set(false);
    this.compassQualityHint.set(null);
    if (this.sourceTimer) clearTimeout(this.sourceTimer);
    this.sourceTimer = null;
    if (this.staleTimer) clearTimeout(this.staleTimer);
    const session = this.compassSession;
    this.staleTimer = setTimeout(() => {
      if (session !== this.compassSession) return;
      this.resetHeading();
      this.compassNoDataHint.set(true);
      if (this.activeSource === 'events') this.tryStartAbsoluteOrientationSensor();
      else if (this.activeSource === 'sensor') {
        this.startHeadingSources(false);
        this.compassNoDataHint.set(true);
      }
    }, COMPASS_STALE_MS);

    const bearing = this.bearingDeg();
    const error =
      bearing === null ? Infinity : Math.abs(angleDeltaDeg(bearing, this.internalSmoothed));
    if (error >= ALIGN_EXIT_DEG) {
      this.qiblaAligned.set(false);
      this.alignedSince = null;
    } else if (!this.qiblaAligned()) {
      if (error <= ALIGN_ENTER_DEG) {
        this.alignedSince ??= now;
        if (now - this.alignedSince >= ALIGN_DWELL_MS) this.qiblaAligned.set(true);
      } else {
        this.alignedSince = null;
      }
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
      const displayed = this.smoothedHeading();
      if (
        displayed === null ||
        this.internalSmoothed === null ||
        Math.abs(this.internalSmoothed - displayed) >= DISPLAY_DEADBAND_DEG
      ) {
        this.smoothedHeading.set(this.internalSmoothed);
      }
    });
  }

  private cancelHeadingFlush(): void {
    if (this.rafFlushHandle !== 0) cancelAnimationFrame(this.rafFlushHandle);
    this.rafFlushHandle = 0;
    this.rafFlushScheduled = false;
  }

  private stopHeadingSources(): void {
    ++this.compassSession;
    this.activeSource = null;
    if (this.sourceTimer) clearTimeout(this.sourceTimer);
    if (this.staleTimer) clearTimeout(this.staleTimer);
    this.sourceTimer = this.staleTimer = null;
    if (this.orientationListener) {
      window.removeEventListener('deviceorientationabsolute', this.orientationListener, true);
      window.removeEventListener('deviceorientation', this.orientationListener, true);
      this.orientationListener = null;
    }
    const sensor = this.absoluteSensor;
    this.absoluteSensor = null;
    try {
      sensor?.stop();
    } catch {
      /* Already stopped or disconnected. */
    }
  }

  private startHeadingSources(allowSensorFallback = true): void {
    this.stopHeadingSources();
    this.resetHeading();
    this.screenAngle = this.getScreenAngleDeg();
    if (document.hidden) return;
    if (typeof DeviceOrientationEvent === 'undefined') {
      if (!this.tryStartAbsoluteOrientationSensor()) this.compassNoDataHint.set(true);
      return;
    }
    this.registerOrientationListeners();
    const session = this.compassSession;
    this.sourceTimer = setTimeout(() => {
      if (session !== this.compassSession) return;
      this.sourceTimer = null;
      if (!allowSensorFallback || !this.tryStartAbsoluteOrientationSensor()) {
        this.compassNoDataHint.set(true);
        this.showCalibrationHint.set(false);
      }
    }, SOURCE_WAIT_MS);
  }

  private tryStartAbsoluteOrientationSensor(): boolean {
    if (!window.isSecureContext || this.isIosLike() || !this.compassListening() || document.hidden)
      return false;
    const ctor = (
      globalThis as unknown as {
        AbsoluteOrientationSensor?: AbsoluteOrientationSensorConstructor;
      }
    ).AbsoluteOrientationSensor;
    if (!ctor) return false;
    try {
      const sensor = new ctor({ frequency: 50, referenceFrame: 'device' });
      this.stopHeadingSources();
      this.resetHeading();
      this.absoluteSensor = sensor;
      this.activeSource = 'sensor';
      const session = this.compassSession;
      sensor.addEventListener('reading', () => {
        if (session !== this.compassSession || this.absoluteSensor !== sensor || document.hidden)
          return;
        const q = componentsFromOrientationQuaternion(sensor.quaternion);
        if (!q) return;
        const heading = headingDegFromOrientationQuaternionTopAxis(
          q.x,
          q.y,
          q.z,
          q.w,
          this.getScreenAngleDeg(),
        );
        if (heading === null) this.markUnusable('tilt');
        else this.ingestHeadingSample(heading);
      });
      sensor.addEventListener('error', () => {
        if (session !== this.compassSession || this.absoluteSensor !== sensor) return;
        // Retry events without a loop between two unavailable APIs.
        if (typeof DeviceOrientationEvent !== 'undefined') this.startHeadingSources(false);
        else {
          this.stopHeadingSources();
          this.resetHeading();
          this.compassNoDataHint.set(true);
        }
      });
      this.sourceTimer = setTimeout(() => {
        if (session !== this.compassSession) return;
        if (typeof DeviceOrientationEvent !== 'undefined') this.startHeadingSources(false);
        this.compassNoDataHint.set(true);
        this.showCalibrationHint.set(false);
      }, SOURCE_WAIT_MS);
      sensor.start(); // Activation is asynchronous; only a usable reading makes the compass live.
      return true;
    } catch {
      if (this.activeSource === 'sensor') {
        this.stopHeadingSources();
        this.resetHeading();
        if (typeof DeviceOrientationEvent !== 'undefined') this.startHeadingSources(false);
      }
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

  private readonly declinationDeg = computed(() => {
    const pt = this.effectivePoint();
    return pt ? estimateMagneticDeclinationDeg(pt.lat, pt.lng) : null;
  });

  protected readonly distanceKm = computed(() => {
    const pt = this.effectivePoint();
    if (!pt) return null;
    return computeDistanceToKaabaKm(pt.lat, pt.lng);
  });

  protected readonly dialRotateDeg = computed(() => -(this.smoothedHeading() ?? 0));

  ngOnInit(): void {
    this.locationService.getLocations().subscribe((list) => this.locations.set(list));
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const city = this.locationService.getSelectedLocation();
      if (params.has('city') && this.source() === 'gps') this.setSource('preset');
      if (this.selectedPreset()?.name !== city.name) {
        this.setSource('preset');
        this.selectedPreset.set(city);
      }
    });
  }

  protected setSource(mode: LocationSource): void {
    this.resetHeading();
    this.source.set(mode);
    this.gpsError.set(null);
    if (mode === 'gps') {
      this.startGps();
    } else {
      this.clearGeoWatch();
      this.gpsCoords.set(null);
      this.gpsLoading.set(false);
    }
  }

  protected toggleGps(): void {
    const mode = this.source() === 'gps' ? 'preset' : 'gps';
    this.setSource(mode);
    const city = this.selectedPreset();
    void this.router.navigateByUrl(
      mode === 'gps' || !city ? '/qibla' : `/qibla/${this.locationService.citySlug(city)}`,
    );
  }

  protected onPresetChange(loc: Location): void {
    this.setSource('preset');
    this.selectedPreset.set(loc);
    this.locationService.setSelectedLocation(loc);
    void this.router.navigateByUrl(`/qibla/${this.locationService.citySlug(loc)}`);
  }

  private startGps(): void {
    this.clearGeoWatch();
    this.gpsCoords.set(null);
    this.gpsLoading.set(false);
    if (!navigator.geolocation) {
      this.gpsError.set('qiblaGpsError');
      return;
    }
    this.gpsLoading.set(true);
    this.geoWatchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (this.source() !== 'gps') return;
        this.gpsLoading.set(false);
        this.gpsError.set(null);
        const { latitude: lat, longitude: lng } = pos.coords;
        if (!isValidCoordinates(lat, lng)) {
          this.gpsCoords.set(null);
          this.resetHeading();
          this.gpsError.set('qiblaGpsError');
          return;
        }
        this.gpsCoords.set({ lat, lng });
      },
      (err: GeolocationPositionError) => {
        if (this.source() !== 'gps') return;
        this.gpsLoading.set(false);
        this.gpsError.set(err.code === 1 ? 'qiblaGpsDenied' : 'qiblaGpsError');
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
    this.stopHeadingSources();
    this.resetHeading();
    this.compassListening.set(false);
    this.compassNoDataHint.set(false);
    this.showCalibrationHint.set(false);
  }

  /** Show the calibration overlay; actual compass starts after user dismisses it. */
  protected requestCompass(): void {
    if (!this.orientationSupported) return;
    this.showCalibrationOverlay.set(true);
  }

  protected cancelCalibration(event: Event): void {
    event.preventDefault();
    this.showCalibrationOverlay.set(false);
  }

  /** User dismissed the calibration overlay — now actually start the compass. */
  protected async dismissCalibration(): Promise<void> {
    this.showCalibrationOverlay.set(false);
    await this.enableCompass();
  }

  private async enableCompass(): Promise<void> {
    if (!this.orientationSupported) return;
    this.teardownCompass();
    this.compassDenied.set(false);
    const session = this.compassSession;
    const DO =
      typeof DeviceOrientationEvent === 'undefined'
        ? {}
        : (DeviceOrientationEvent as unknown as {
            requestPermission?: (absolute?: boolean) => Promise<'granted' | 'denied' | 'default'>;
          });
    if (typeof DO.requestPermission === 'function') {
      try {
        const status = await DO.requestPermission(true);
        if (session !== this.compassSession) return;
        if (status !== 'granted') {
          this.compassDenied.set(true);
          return;
        }
      } catch {
        if (session === this.compassSession) this.compassDenied.set(true);
        return;
      }
    }
    this.showCalibrationHint.set(true);
    this.compassListening.set(true);
    this.startHeadingSources();
  }

  protected bearingFmt(): string {
    const b = this.bearingDeg();
    return b == null
      ? '—'
      : `${new Intl.NumberFormat(this.langService.lang() === 'bs' ? 'bs-BA' : 'en-GB', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(b)}°`;
  }

  protected distanceFmt(): string {
    const d = this.distanceKm();
    if (d == null) return '—';
    return `${new Intl.NumberFormat(this.langService.lang() === 'bs' ? 'bs-BA' : 'en-GB', {
      maximumFractionDigits: d >= 100 ? 0 : d >= 10 ? 1 : 2,
    }).format(d)} km`;
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
