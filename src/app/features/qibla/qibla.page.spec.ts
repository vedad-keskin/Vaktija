import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { QiblaPage } from './qibla.page';
import { CitySelectorComponent } from '../prayer-times/components/city-selector/city-selector.component';
import { LanguageService } from '../../core/services/language.service';
import { LocationService } from '../../core/services/location.service';
import { BS_LABELS, EN_LABELS } from '../../core/i18n';

it('uses the navbar city, handles GPS denial and cancellation, and starts with an honest compass preview', async () => {
  localStorage.clear();
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
    providers: [provideRouter([])],
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
    const bearing = (
      fixture.componentInstance as unknown as {
        magneticBearingDeg: () => number;
      }
    ).magneticBearingDeg();
    window.dispatchEvent(
      Object.assign(new Event('deviceorientation'), {
        webkitCompassHeading: bearing,
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
