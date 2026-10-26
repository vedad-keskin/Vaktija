import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { QiblaPage } from './qibla.page';
import { routes } from '../../app.routes';
import { CitySelectorComponent } from '../prayer-times/components/city-selector/city-selector.component';
import { LanguageService } from '../../core/services/language.service';
import { LocationService } from '../../core/services/location.service';
import { BS_LABELS, EN_LABELS } from '../../core/i18n';
import { normalizeDeg } from '../../core/math/compass-heading';
import { quaternionFromDeviceOrientationDeg } from '../../core/math/orientation-quaternion-heading';

it('uses the navbar city, handles GPS denial and cancellation, and starts with an honest compass preview', async () => {
  localStorage.clear();
  localStorage.setItem('vaktija_lang', 'bs');
  vi.stubGlobal(
    'DeviceOrientationEvent',
    class extends Event {
      static requestPermission = vi.fn().mockResolvedValue('granted');
    },
  );
  const originalGeo = Object.getOwnPropertyDescriptor(navigator, 'geolocation');
  let position: PositionCallback;
  let failure: PositionErrorCallback;
  const clearWatch = vi.fn();
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: {
      watchPosition: vi.fn((success: PositionCallback, error: PositionErrorCallback) => {
        position = success;
        failure = error;
        return 42;
      }),
      clearWatch,
    },
  });
  const originalShowModal = HTMLDialogElement.prototype.showModal;
  const originalClose = HTMLDialogElement.prototype.close;
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };

  await TestBed.configureTestingModule({
    imports: [QiblaPage],
    providers: [provideRouter(routes)],
  }).compileComponents();
  const fixture = TestBed.createComponent(QiblaPage);
  try {
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const text = (selector: string) => element.querySelector(selector)?.textContent;
    const click = async (selector: string) => {
      element.querySelector<HTMLButtonElement>(selector)!.click();
      await fixture.whenStable();
    };
    expect(element.querySelectorAll('app-city-selector')).toHaveLength(1);
    expect(element.querySelector('app-header app-city-selector')).toBeTruthy();
    expect(text('#qibla-location-title')).toContain('Sarajevo');
    expect(text('.compass-status')).toContain(BS_LABELS.qiblaCompassIdle);
    expect(element.querySelector<HTMLElement>('.compass-rotor')!.style.transform).toBe(
      'rotate(0deg)',
    );
    expect(element.querySelector('.compass-stack.aligned')).toBeNull();

    await click('.qibla-gps');
    expect(text('.qibla-message')).toContain(BS_LABELS.qiblaGpsPending);
    expect(element.querySelector('.qibla-spoke')).toBeNull();
    failure!({ code: 1 } as GeolocationPositionError);
    await fixture.whenStable();
    expect(text('.qibla-message')).toContain(BS_LABELS.qiblaGpsDenied);
    TestBed.inject(LanguageService).setLanguage('en');
    await fixture.whenStable();
    expect(text('.qibla-message')).toContain(EN_LABELS.qiblaGpsDenied);
    position!({ coords: { latitude: 43.66, longitude: 17.76 } } as GeolocationPosition);
    await fixture.whenStable();
    expect(text('.qibla-coords')).toContain('43.6600');

    const citySelector = fixture.debugElement.query(By.directive(CitySelectorComponent))
      .componentInstance as CitySelectorComponent;
    TestBed.inject(LocationService)
      .getLocations()
      .subscribe((cities) => {
        citySelector.selectionChange.emit(cities.find((city) => city.name === 'Jablanica')!);
      });
    await fixture.whenStable();
    expect(clearWatch).toHaveBeenCalledWith(42);
    expect(text('#qibla-location-title')).toContain('Jablanica');
    expect(element.querySelector('.qibla-coords, .qibla-message')).toBeNull();
    expect(element.querySelector('.qibla-gps')!.getAttribute('aria-pressed')).toBe('false');
    expect(TestBed.inject(LocationService).getSelectedLocation().name).toBe('Jablanica');
    failure!({ code: 1 } as GeolocationPositionError);
    await fixture.whenStable();
    expect(element.querySelector('.qibla-message')).toBeNull();

    await click('.qibla-compass-section .qibla-start');
    const dialog = element.querySelector('dialog')!;
    expect(dialog.open).toBe(true);
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    await fixture.whenStable();
    expect(dialog.open).toBe(false);
    expect(text('.compass-status')).toContain(EN_LABELS.qiblaCompassIdle);
    await click('.qibla-compass-section .qibla-start');
    await click('.calibration-skip');
    expect(dialog.open).toBe(false);
    expect(text('.compass-status')).toContain(EN_LABELS.qiblaCompassWaiting);
    expect(element.querySelector('.compass-stack.aligned')).toBeNull();
    expect(element.querySelector<HTMLElement>('.compass-rotor')!.style.transform).toBe(
      'rotate(0deg)',
    );
    const bearing = fixture.componentInstance as unknown as {
      bearingDeg: () => number;
      declinationDeg: () => number;
    };
    const magneticBearing = bearing.bearingDeg() - bearing.declinationDeg();
    window.dispatchEvent(
      Object.assign(new Event('deviceorientation'), {
        webkitCompassHeading: magneticBearing,
        beta: 0,
        gamma: 0,
      }),
    );
    await new Promise((resolve) => setTimeout(resolve, 40));
    await fixture.whenStable();
    expect(element.querySelector('.compass-stack.aligned')).toBeNull();
    await new Promise((resolve) => setTimeout(resolve, 320));
    window.dispatchEvent(
      Object.assign(new Event('deviceorientation'), {
        webkitCompassHeading: magneticBearing,
        beta: 0,
        gamma: 0,
      }),
    );
    await new Promise((resolve) => setTimeout(resolve, 40));
    await fixture.whenStable();
    expect(element.querySelector('.compass-stack.aligned')).toBeTruthy();
    expect(text('.compass-status')).toContain(EN_LABELS.qiblaAlignedLabel);
    const permission = DeviceOrientationEvent as unknown as {
      requestPermission: ReturnType<typeof vi.fn>;
    };
    permission.requestPermission.mockResolvedValue('denied');
    await click('.qibla-compass-section .qibla-start');
    await click('.calibration-skip');
    expect(text('.compass-status')).toContain(EN_LABELS.qiblaPermissionDenied);
    expect(element.querySelector('.compass-stack.aligned')).toBeNull();
  } finally {
    fixture.destroy();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    if (originalShowModal) HTMLDialogElement.prototype.showModal = originalShowModal;
    else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
    if (originalClose) HTMLDialogElement.prototype.close = originalClose;
    else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
    if (originalGeo) Object.defineProperty(navigator, 'geolocation', originalGeo);
    else Reflect.deleteProperty(navigator, 'geolocation');
    localStorage.clear();
  }
});

it('requires sustained fresh alignment and cancels stale, tilted, rotated, hidden and retired sensor readings', async () => {
  localStorage.clear();
  vi.stubGlobal('DeviceOrientationEvent', class extends Event {});
  vi.stubGlobal('ondeviceorientationabsolute', null);
  vi.stubGlobal('isSecureContext', true);
  let hidden = false;
  vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden);
  const sensors: FakeSensor[] = [];
  class FakeSensor extends EventTarget {
    quaternion: number[] | null = null;
    start = vi.fn();
    stop = vi.fn();
    constructor() {
      super();
      sensors.push(this);
    }
  }
  vi.stubGlobal('AbsoluteOrientationSensor', FakeSensor);
  await TestBed.configureTestingModule({
    imports: [QiblaPage],
    providers: [provideRouter([])],
  }).compileComponents();
  const fixture = TestBed.createComponent(QiblaPage);
  await fixture.whenStable();
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) =>
    setTimeout(() => callback(performance.now()), 16),
  );
  vi.stubGlobal('cancelAnimationFrame', (handle: number) => clearTimeout(handle));
  const page = fixture.componentInstance as unknown as {
    enableCompass(): Promise<void>;
    teardownCompass(): void;
    bearingDeg(): number;
    declinationDeg(): number;
    qiblaAligned(): boolean;
    compassNoDataHint(): boolean;
    compassQualityHint(): string | null;
    smoothedHeading(): number | null;
  };
  const magneticBearing = page.bearingDeg() - page.declinationDeg();
  const send = (heading: number, beta = 0, accuracy?: number) =>
    window.dispatchEvent(
      Object.assign(new Event('deviceorientationabsolute'), {
        alpha: normalizeDeg(360 - heading),
        beta,
        gamma: 0,
        absolute: true,
        ...(accuracy === undefined ? {} : { webkitCompassAccuracy: accuracy }),
      }),
    );
  const hold = async (heading: number, duration: number) => {
    for (let t = 0; t < duration; t += 20) {
      send(heading);
      await vi.advanceTimersByTimeAsync(20);
    }
  };
  const sensorReading = (sensor: FakeSensor) => {
    const q = quaternionFromDeviceOrientationDeg(normalizeDeg(360 - magneticBearing), 0, 0);
    sensor.quaternion = [q.x, q.y, q.z, q.w];
    sensor.dispatchEvent(new Event('reading'));
  };
  try {
    await page.enableCompass();
    await hold(magneticBearing, 280);
    expect(page.qiblaAligned()).toBe(false);
    await hold(magneticBearing, 60);
    expect(page.qiblaAligned()).toBe(true);
    expect(page.smoothedHeading()).toBeCloseTo(page.bearingDeg(), 8);
    await hold(magneticBearing + 5.5, 1500); // Remains aligned between enter/exit thresholds.
    expect(page.qiblaAligned()).toBe(true);
    await hold(magneticBearing + 9, 1000);
    expect(page.qiblaAligned()).toBe(false);
    await hold(magneticBearing, 700);
    expect(page.qiblaAligned()).toBe(true);

    send(magneticBearing, 60);
    expect(page.qiblaAligned()).toBe(false);
    expect(page.compassQualityHint()).toBe('tilt');
    await hold(magneticBearing, 340);
    expect(page.qiblaAligned()).toBe(true);
    send(magneticBearing, 0, -1);
    expect(page.qiblaAligned()).toBe(false);
    expect(page.compassQualityHint()).toBe('accuracy');
    await hold(magneticBearing, 340);
    window.dispatchEvent(new Event('orientationchange'));
    expect(page.qiblaAligned()).toBe(false);
    expect(page.smoothedHeading()).toBeNull();

    await hold(magneticBearing, 340);
    await vi.advanceTimersByTimeAsync(1500);
    expect(page.qiblaAligned()).toBe(false);
    expect(page.smoothedHeading()).toBeNull();
    expect(sensors).toHaveLength(1);
    sensorReading(sensors[0]);
    await vi.advanceTimersByTimeAsync(20);
    expect(page.smoothedHeading()).toBeCloseTo(page.bearingDeg(), 8);
    send(magneticBearing + 90); // Event source was removed when the quaternion source became active.
    await vi.advanceTimersByTimeAsync(20);
    expect(page.smoothedHeading()).toBeCloseTo(page.bearingDeg(), 8);

    hidden = true;
    document.dispatchEvent(new Event('visibilitychange'));
    expect(sensors[0].stop).toHaveBeenCalledOnce();
    sensorReading(sensors[0]);
    expect(page.smoothedHeading()).toBeNull();
    hidden = false;
    document.dispatchEvent(new Event('visibilitychange'));
    await hold(magneticBearing, 340);
    expect(page.qiblaAligned()).toBe(true);

    await page.enableCompass();
    await vi.advanceTimersByTimeAsync(2000); // Silent event path falls back to the quaternion API.
    expect(sensors).toHaveLength(2);
    expect(page.smoothedHeading()).toBeNull(); // start() alone does not imply a live compass.
    await vi.advanceTimersByTimeAsync(2000); // Silent quaternion API falls back to events.
    expect(sensors[1].stop).toHaveBeenCalledOnce();
    sensorReading(sensors[1]);
    expect(page.smoothedHeading()).toBeNull();
    await hold(magneticBearing, 340);
    expect(page.qiblaAligned()).toBe(true);
    await page.enableCompass();
    await vi.advanceTimersByTimeAsync(2000);
    expect(sensors).toHaveLength(3);
    sensors[2].dispatchEvent(new Event('error'));
    expect(sensors[2].stop).toHaveBeenCalledOnce();
    await hold(magneticBearing, 340);
    expect(page.qiblaAligned()).toBe(true);
    sensorReading(sensors[2]);
    expect(page.qiblaAligned()).toBe(true);
    page.teardownCompass();
    send(magneticBearing);
    await vi.advanceTimersByTimeAsync(4000);
    expect(page.smoothedHeading()).toBeNull();
    expect(sensors).toHaveLength(3);
    let grant!: (value: 'granted') => void;
    vi.stubGlobal(
      'DeviceOrientationEvent',
      class extends Event {
        static requestPermission = () =>
          new Promise<'granted'>((resolve) => {
            grant = resolve;
          });
      },
    );
    const pendingPermission = page.enableCompass();
    page.teardownCompass();
    grant('granted');
    await pendingPermission;
    send(magneticBearing);
    await vi.advanceTimersByTimeAsync(4000);
    expect(page.smoothedHeading()).toBeNull();
    expect(sensors).toHaveLength(3);
  } finally {
    fixture.destroy();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    localStorage.clear();
  }
});
