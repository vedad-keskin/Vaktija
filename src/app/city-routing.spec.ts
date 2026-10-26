import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from './app.routes';
import { BOSNIA_PRESET_CITIES } from './core/constants/bosnia-preset-cities.constants';
import { CalculationMethodService } from './core/services/calculation-method.service';
import { LocationService } from './core/services/location.service';
import { PrayerTimeService } from './core/services/prayer-time.service';
import { CitySelectorComponent } from './features/prayer-times/components/city-selector/city-selector.component';

it('keeps city URLs, saved selection, prayer times, and Qibla in sync', async () => {
  localStorage.clear();
  const snapshots = {
    bs: { prayerTimes: [], locationName: 'Jablanica', dateLabel: 'Today', hijriDate: '' },
    en: { prayerTimes: [], locationName: 'Jablanica', dateLabel: 'Today', hijriDate: '' },
  };
  const getTodayPrayerTimes = vi.fn(() => of({ snapshots }));

  try {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: CalculationMethodService, useValue: { method: signal('iz'), hasChosen: signal(true) } },
        { provide: PrayerTimeService, useValue: { getTodayPrayerTimes } },
      ],
    }).compileComponents();
    const locations = TestBed.inject(LocationService);
    expect(new Set(BOSNIA_PRESET_CITIES.map((city) => locations.citySlug(city))).size)
      .toBe(BOSNIA_PRESET_CITIES.length);

    const harness = await RouterTestingHarness.create('/');
    expect(TestBed.inject(Router).url).toBe('/sarajevo');
    await harness.navigateByUrl('/jablanica');
    expect(locations.getSelectedLocation().name).toBe('Jablanica');
    expect(getTodayPrayerTimes).toHaveBeenCalledWith(expect.objectContaining({ name: 'Jablanica' }));
    expect(harness.routeNativeElement!.querySelector('app-city-selector')!.textContent)
      .toContain('Jablanica');
    expect(harness.routeNativeElement!.querySelector('a[href="/qibla/jablanica"]')).toBeTruthy();

    const selector = harness.routeDebugElement!.query(By.directive(CitySelectorComponent))
      .componentInstance as CitySelectorComponent;
    selector.selectionChange.emit(BOSNIA_PRESET_CITIES.find((city) => city.name === 'Sarajevo')!);
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/sarajevo');
    expect(locations.getSelectedLocation().name).toBe('Sarajevo');
    await harness.navigateByUrl('/jablanica');
    expect(locations.getSelectedLocation().name).toBe('Jablanica');
    await harness.navigateByUrl('/');
    expect(TestBed.inject(Router).url).toBe('/jablanica');

    await harness.navigateByUrl('/qibla');
    expect(TestBed.inject(Router).url).toBe('/qibla/jablanica');
    expect(harness.routeNativeElement!.querySelector('#qibla-location-title')!.textContent)
      .toContain('Jablanica');
    expect(harness.routeNativeElement!.querySelector('a.qibla-back')!.getAttribute('href'))
      .toBe('/jablanica');

    const qiblaSelector = harness.routeDebugElement!.query(By.directive(CitySelectorComponent))
      .componentInstance as CitySelectorComponent;
    qiblaSelector.selectionChange.emit(BOSNIA_PRESET_CITIES.find((city) => city.name === 'Sarajevo')!);
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/qibla/sarajevo');
    expect(locations.getSelectedLocation().name).toBe('Sarajevo');
    expect(harness.routeNativeElement!.querySelector('#qibla-location-title')!.textContent)
      .toContain('Sarajevo');
    await harness.navigateByUrl('/jablanica');
    expect(locations.getSelectedLocation().name).toBe('Jablanica');
    expect(harness.routeNativeElement!.querySelector('a[href="/qibla/jablanica"]')).toBeTruthy();

    await harness.navigateByUrl('/not-a-city');
    expect(TestBed.inject(Router).url).toBe('/jablanica');
    expect(locations.getSelectedLocation().name).toBe('Jablanica');
  } finally {
    localStorage.clear();
  }
});
