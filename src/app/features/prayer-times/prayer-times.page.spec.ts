import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { PrayerTimesPage } from './prayer-times.page';
import { PrayerCardComponent } from './components/prayer-card/prayer-card.component';
import { PrayerTimeService } from '../../core/services/prayer-time.service';
import { PrayerTimesCacheService } from '../../core/services/prayer-times-cache.service';
import { LocationService } from '../../core/services/location.service';
import { CalculationMethodService } from '../../core/services/calculation-method.service';
import { LanguageService } from '../../core/services/language.service';
import { BS_LABELS, EN_LABELS } from '../../core/i18n';

it('gives all eight times distinct illustrations across translations and Friday noon', async () => {
  localStorage.clear();
  await TestBed.configureTestingModule({ imports: [PrayerCardComponent] }).compileComponents();
  const fixture = TestBed.createComponent(PrayerCardComponent);
  const language = TestBed.inject(LanguageService);
  const paths = new Map<string, string>();
  for (const lang of ['bs', 'en'] as const) {
    language.setLanguage(lang);
    for (const [key, name] of Object.entries(language.labels().prayerNames)) {
      fixture.componentRef.setInput('prayer', { name, time: '12:00', minutes: 720 });
      fixture.detectChanges();
      const path = fixture.nativeElement.querySelector('.prayer-symbol img').getAttribute('src');
      expect(path).toBe(`/assets/illustrations/${key.toLowerCase()}.svg`);
      if (lang === 'bs') paths.set(key, path);
      else expect(path).toBe(paths.get(key));
    }
    fixture.componentRef.setInput('prayer', {
      name: language.labels().dhuhrFridayName,
      time: '12:00',
      minutes: 720,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.prayer-symbol img').getAttribute('src')).toBe(
      paths.get('Dhuhr'),
    );
  }
  expect(new Set(paths.values()).size).toBe(8);
  fixture.destroy();
  localStorage.clear();
});

it('loads fresh IZ times over a same-day cache while offline', async () => {
  localStorage.clear();
  const online = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
  const prayerTimes = ['Lastthird', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'].map(
    (key, i) => ({ name: BS_LABELS.prayerNames[key], time: `${i}:00`, minutes: i * 60, isCalculated: false }),
  );
  const snapshot = { prayerTimes, locationName: 'Sarajevo', dateLabel: 'Today', hijriDate: '' };
  const getTodayPrayerTimes = vi.fn(() => of({ snapshots: { bs: snapshot, en: snapshot } }));

  try {
    await TestBed.configureTestingModule({
      imports: [PrayerTimesPage],
      providers: [
        provideRouter([]),
        { provide: CalculationMethodService, useValue: { method: signal('iz') } },
        { provide: PrayerTimeService, useValue: { getTodayPrayerTimes } },
      ],
    }).compileComponents();
    const location = TestBed.inject(LocationService).getSelectedLocation();
    TestBed.inject(PrayerTimesCacheService).write(location, 'iz', 'bs', {
      ...snapshot,
      prayerTimes: prayerTimes.map((time) => ({ ...time, time: '23:59', minutes: 1439 })),
    });
    const fixture = TestBed.createComponent(PrayerTimesPage);
    await fixture.whenStable();
    expect(getTodayPrayerTimes).toHaveBeenCalledOnce();
    expect(fixture.nativeElement.querySelectorAll('.prayer-card')).toHaveLength(8);
    const displayedTimes = [...fixture.nativeElement.querySelectorAll('.prayer-time')].map(
      (element: Element) => element.textContent,
    );
    expect(displayedTimes).toContain('0:00');
    expect(displayedTimes).not.toContain('23:59');
    fixture.destroy();
  } finally {
    online.mockRestore();
    localStorage.clear();
  }
});

it('reloads IZ times when an open page reaches Sarajevo midnight', async () => {
  localStorage.clear();
  vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] });
  vi.setSystemTime(new Date('2026-10-15T21:59:59Z'));
  const snapshot = {
    prayerTimes: [{ name: 'Fajr', time: '5:00', minutes: 300, isCalculated: false }],
    locationName: 'Sarajevo', dateLabel: 'Today', hijriDate: '',
  };
  const getTodayPrayerTimes = vi.fn(() => of({ snapshots: { bs: snapshot, en: snapshot } }));

  try {
    await TestBed.configureTestingModule({
      imports: [PrayerTimesPage],
      providers: [
        provideRouter([]),
        { provide: CalculationMethodService, useValue: { method: signal('iz') } },
        { provide: PrayerTimeService, useValue: { getTodayPrayerTimes } },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(PrayerTimesPage);
    await fixture.whenStable();
    expect(getTodayPrayerTimes).toHaveBeenCalledOnce();
    vi.advanceTimersByTime(1000);
    await fixture.whenStable();
    expect(getTodayPrayerTimes).toHaveBeenCalledTimes(2);
    fixture.destroy();
  } finally {
    vi.useRealTimers();
    localStorage.clear();
  }
});

it('keeps all eight times, translated details and a future next-time label across midnight', async () => {
  localStorage.clear();
  const keys = ['Lastthird', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'];
  const minutes = [90, 330, 420, 750, 930, 1080, 1200, 1380];
  const snapshot = (labels: typeof EN_LABELS) => ({
    prayerTimes: keys.map((key, i) => ({
      name: labels.prayerNames[key],
      minutes: minutes[i],
      time: `${Math.floor(minutes[i] / 60)}:${String(minutes[i] % 60).padStart(2, '0')}`,
      isCalculated: key === 'Midnight' || key === 'Lastthird',
    })),
    locationName: 'Sarajevo',
    dateLabel: '13 October 2026',
    hijriDate: '',
  });
  await TestBed.configureTestingModule({
    imports: [PrayerTimesPage],
    providers: [
      provideRouter([]),
      {
        provide: PrayerTimeService,
        useValue: {
          getTodayPrayerTimes: () =>
            of({ snapshots: { bs: snapshot(BS_LABELS), en: snapshot(EN_LABELS) } }),
        },
      },
    ],
  }).compileComponents();
  const fixture = TestBed.createComponent(PrayerTimesPage);
  await fixture.whenStable();
  const state = fixture.componentInstance as unknown as { now: ReturnType<typeof signal<Date>> };
  state.now.set(new Date(2026, 9, 13, 23, 58));
  fixture.detectChanges();
  const element: HTMLElement = fixture.nativeElement;
  const horizon = () => element.querySelector<HTMLElement>('.countdown-horizon')!;
  expect(element.querySelectorAll('.trail-marker')).toHaveLength(8);
  expect(element.querySelector('.trail-return')).toBeTruthy();
  expect(
    (element.querySelector('.trail-return') as SVGElement).style.getPropertyValue(
      '--wrap-progress',
    ),
  ).toBe('38%');
  expect(element.querySelector('#schedule-title, .location-note')).toBeNull();
  expect(element.querySelector('.countdown-wrap')?.nextElementSibling?.className).toBe(
    'schedule-section',
  );
  expect(element.querySelectorAll('.prayer-card')).toHaveLength(8);
  expect(element.querySelectorAll('.prayer-card.next')).toHaveLength(1);
  expect(element.querySelector('.prayer-card.next')?.textContent).toContain('za 1h 32min');
  expect(element.querySelector('#next-prayer-name')?.textContent).toContain(
    BS_LABELS.prayerNames['Lastthird'],
  );
  expect(Number(horizon().getAttribute('aria-valuenow'))).toBeCloseTo((58 / 150) * 100);
  expect(element.querySelector('.countdown-section img')).toBeNull();
  expect(element.querySelector('.countdown-arc')).toBeNull();
  expect(element.querySelector('.countdown-label')?.textContent).toBe(BS_LABELS.nextTime);
  expect([...element.querySelectorAll('.countdown-value')].map((el) => el.textContent)).toEqual([
    '01',
    '32',
    '00',
  ]);

  TestBed.inject(LanguageService).setLanguage('en');
  await fixture.whenStable();
  expect(element.querySelector('.prayer-card.next')?.textContent).toContain('in 1h 32min');
  expect(element.querySelector('#next-prayer-name')?.textContent).toContain('Last Third');
  state.now.set(new Date(2026, 9, 14, 0, 15));
  fixture.detectChanges();
  expect(element.querySelector('.prayer-card.next')?.textContent).toContain('in 1h 15min');
  expect(element.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe('50');
  expect(horizon().style.getPropertyValue('--horizon-progress')).toBe('50%');
  expect(element.querySelectorAll('.prayer-stop.elapsed')).toHaveLength(0);
  expect(
    (element.querySelector('.trail-return') as SVGElement).style.getPropertyValue(
      '--wrap-progress',
    ),
  ).toBe('50%');
  expect(element.querySelector('.prayer-card.current')?.textContent).toContain('1h 15min ago');

  // The normal segment follows the current interval; the exact boundary advances the marker.
  state.now.set(new Date(2026, 9, 14, 13, 15));
  fixture.detectChanges();
  expect(horizon().style.getPropertyValue('--horizon-progress')).toBe('25%');
  state.now.set(new Date(2026, 9, 14, 14, 0));
  fixture.detectChanges();
  expect(element.querySelector('.trail-return')).toBeNull();
  expect(element.querySelectorAll('.prayer-stop.elapsed')).toHaveLength(4);
  expect(element.querySelector('.prayer-stop.current')?.textContent).toContain('Dhuhr');
  expect(
    (element.querySelector('.prayer-stop.current') as HTMLElement).style.getPropertyValue(
      '--trail-progress',
    ),
  ).toBe('50%');
  state.now.set(new Date(2026, 9, 14, 15, 29, 59));
  fixture.detectChanges();
  expect(Number(horizon().getAttribute('aria-valuenow'))).toBeCloseTo(99.99074, 4);
  expect(parseFloat(horizon().style.getPropertyValue('--horizon-progress'))).toBeCloseTo(
    99.99074,
    4,
  );
  expect([...element.querySelectorAll('.countdown-value')].map((el) => el.textContent)).toEqual([
    '00',
    '00',
    '01',
  ]);
  state.now.set(new Date(2026, 9, 14, 15, 30));
  fixture.detectChanges();
  expect(element.querySelector('.prayer-stop.current')?.textContent).toContain('Asr');
  expect(element.querySelector('.prayer-stop.next')?.textContent).toContain('Maghrib');
  expect(
    (element.querySelector('.prayer-stop.current') as HTMLElement).style.getPropertyValue(
      '--trail-progress',
    ),
  ).toBe('0%');
  expect(horizon().style.getPropertyValue('--horizon-progress')).toBe('0%');
  state.now.set(new Date(2026, 9, 14, 1, 30));
  fixture.detectChanges();
  expect(element.querySelector('.trail-return')).toBeNull();
  expect(element.querySelector('.prayer-stop.current')?.textContent).toContain('Last Third');
  expect(element.querySelector('.prayer-stop.next')?.textContent).toContain('Fajr');
  state.now.set(new Date(2026, 9, 14, 23, 0));
  fixture.detectChanges();
  expect(element.querySelector('.trail-return')).toBeTruthy();
  expect(element.querySelector('.trail-return.started')).toBeNull();
  fixture.destroy();
  localStorage.clear();
});
