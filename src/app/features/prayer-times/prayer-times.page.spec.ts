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

it('keeps one live countdown and restores the saved fullscreen choice on mobile', async () => {
  localStorage.clear();
  localStorage.setItem('vaktija_lang', 'en');
  localStorage.setItem('vaktija_countdown_collapsed', 'true');
  const snapshot = {
    prayerTimes: [{ name: 'Fajr', time: '06:00', minutes: 360, isCalculated: false }],
    locationName: 'Sarajevo',
    dateLabel: 'Today',
    hijriDate: '2 Jumada al-Thani 1448',
  };
  await TestBed.configureTestingModule({
    imports: [PrayerTimesPage],
    providers: [
      provideRouter([]),
      {
        provide: CalculationMethodService,
        useValue: { method: signal('iz'), hasChosen: signal(true) },
      },
      {
        provide: PrayerTimeService,
        useValue: { getTodayPrayerTimes: () => of({ snapshots: { bs: snapshot, en: snapshot } }) },
      },
    ],
  }).compileComponents();

  let mobileViewport = true;
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: mobileViewport && query.startsWith('(max-width: 599px)'),
  }));
  let fixture = TestBed.createComponent(PrayerTimesPage);
  try {
    await fixture.whenStable();
    const toggle = () =>
      fixture.nativeElement.querySelector('.countdown-toggle') as HTMLButtonElement;
    const page = () => fixture.nativeElement.querySelector('.prayer-times-page');
    const card = () => page().querySelector('.countdown-section');
    const toolbar = () => page().querySelector('.page-toolbar');
    expect(fixture.nativeElement.classList.contains('ios-standalone')).toBe(false);
    expect(page().classList.contains('is-fullscreen')).toBe(false);
    expect(page().querySelector('.date-hijri').textContent).toBe(snapshot.hijriDate);
    expect(toggle().getAttribute('aria-label')).toBe(EN_LABELS.enterFullscreen);

    const regularCard = card();
    const row = page().querySelector('.prayer-stop') as HTMLElement;
    const details = row.querySelector('.prayer-details') as HTMLElement;
    const animate = () => ({ cancel: () => {} });
    for (const element of [regularCard, toolbar(), row]) Object.assign(element, { animate });
    const detailMotion = vi.fn(animate);
    Object.assign(details, { animate: detailMotion });
    row.getBoundingClientRect = () => new DOMRect(12, 300, 360, 76);
    details.getBoundingClientRect = () =>
      new DOMRect(page().classList.contains('is-fullscreen') ? 90 : 110, 320, 100, 20);

    toggle().click();
    fixture.detectChanges();
    const holdInset = expect.objectContaining({ transform: 'translate(20px, 0px) scale(1, 1)' });
    expect(detailMotion).toHaveBeenCalledWith(
      [holdInset, holdInset, { transform: 'none' }],
      expect.objectContaining({ duration: 520 }),
    );
    expect(card()).toBe(regularCard);
    expect(page().classList.contains('is-fullscreen')).toBe(true);
    expect(localStorage.getItem('vaktija_fullscreen')).toBe('true');
    expect(toolbar().inert).toBe(true);
    expect(toggle().getAttribute('aria-label')).toBe(EN_LABELS.exitFullscreen);
    expect(page().querySelectorAll('[role="timer"]')).toHaveLength(1);
    expect(page().querySelector('.countdown-city-date').textContent).toContain('Sarajevo');

    const state = fixture.componentInstance as unknown as { now: ReturnType<typeof signal<Date>> };
    for (const [second, remaining] of [
      [58, '01:00:02'],
      [59, '01:00:01'],
    ] as const) {
      state.now.set(new Date(2026, 10, 12, 4, 59, second));
      fixture.detectChanges();
      expect(
        [...fixture.nativeElement.querySelectorAll('.countdown-value')]
          .map((el: Element) => el.textContent)
          .join(':'),
      ).toBe(remaining);
    }

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(card()).toBe(regularCard);
    expect(page().classList.contains('is-fullscreen')).toBe(false);
    expect(localStorage.getItem('vaktija_fullscreen')).toBe('false');
    expect(toolbar().inert).toBe(false);

    fixture.destroy();
    fixture = TestBed.createComponent(PrayerTimesPage);
    await fixture.whenStable();
    expect(page().classList.contains('is-fullscreen')).toBe(false);
    expect(toggle().getAttribute('aria-label')).toBe(EN_LABELS.enterFullscreen);

    toggle().click();
    fixture.destroy();
    Object.defineProperty(navigator, 'standalone', { configurable: true, value: true });
    fixture = TestBed.createComponent(PrayerTimesPage);
    await fixture.whenStable();
    expect(fixture.nativeElement.classList.contains('ios-standalone')).toBe(true);
    expect(page().classList.contains('is-fullscreen')).toBe(true);
    expect(toggle().getAttribute('aria-label')).toBe(EN_LABELS.exitFullscreen);

    fixture.destroy();
    Reflect.deleteProperty(navigator, 'standalone');
    mobileViewport = false;
    fixture = TestBed.createComponent(PrayerTimesPage);
    await fixture.whenStable();
    expect(page().classList.contains('is-fullscreen')).toBe(false);
    expect(localStorage.getItem('vaktija_fullscreen')).toBe('true');
  } finally {
    fixture.destroy();
    Reflect.deleteProperty(navigator, 'standalone');
    vi.unstubAllGlobals();
    localStorage.clear();
  }
});

it('restores cached Hijri dates in both languages and removes them when unavailable', async () => {
  localStorage.clear();
  localStorage.setItem('vaktija_lang', 'en');
  const snapshot = {
    prayerTimes: [{ name: 'Fajr', time: '06:00', minutes: 360, isCalculated: false }],
    locationName: 'Sarajevo', dateLabel: 'Today', hijriDate: '',
  };
  const method = signal<'14.6' | 'iz'>('14.6');
  const getTodayPrayerTimes = vi.fn(() => of({ snapshots: { bs: snapshot, en: snapshot } }));
  await TestBed.configureTestingModule({
    imports: [PrayerTimesPage],
    providers: [
      provideRouter([]),
      { provide: CalculationMethodService, useValue: { method, hasChosen: signal(true) } },
      { provide: PrayerTimeService, useValue: { getTodayPrayerTimes } },
    ],
  }).compileComponents();
  const location = TestBed.inject(LocationService).getSelectedLocation();
  const cache = TestBed.inject(PrayerTimesCacheService);
  const dates = { bs: '2. Džumade-l-uhra 1448.', en: '2. Jumada al-Thani 1448.' };
  for (const lang of ['bs', 'en'] as const) {
    cache.write(location, '14.6', lang, { ...snapshot, hijriDate: dates[lang] });
  }
  const fixture = TestBed.createComponent(PrayerTimesPage);
  try {
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.date-hijri').textContent).toBe(dates.en);
    TestBed.inject(LanguageService).setLanguage('bs');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.date-hijri').textContent).toBe(dates.bs);
    expect(getTodayPrayerTimes).not.toHaveBeenCalled();

    method.set('iz');
    await fixture.whenStable();
    expect(getTodayPrayerTimes).toHaveBeenCalledOnce();
    expect(fixture.nativeElement.querySelector('.date-hijri')).toBeNull();
  } finally {
    fixture.destroy();
    localStorage.clear();
  }
});

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
        { provide: CalculationMethodService, useValue: { method: signal('iz'), hasChosen: signal(true) } },
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

it('waits for the first method choice before loading prayer times', async () => {
  localStorage.clear();
  const snapshot = { prayerTimes: [], locationName: 'Sarajevo', dateLabel: 'Today', hijriDate: '' };
  const getTodayPrayerTimes = vi.fn(() => of({ snapshots: { bs: snapshot, en: snapshot } }));
  await TestBed.configureTestingModule({
    imports: [PrayerTimesPage],
    providers: [
      provideRouter([]),
      { provide: PrayerTimeService, useValue: { getTodayPrayerTimes } },
    ],
  }).compileComponents();
  const fixture = TestBed.createComponent(PrayerTimesPage);
  await fixture.whenStable();
  expect(getTodayPrayerTimes).not.toHaveBeenCalled();
  TestBed.inject(CalculationMethodService).setMethod('iz');
  await fixture.whenStable();
  expect(getTodayPrayerTimes).toHaveBeenCalledOnce();
  fixture.destroy();
  localStorage.clear();
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
        { provide: CalculationMethodService, useValue: { method: signal('iz'), hasChosen: signal(true) } },
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
  localStorage.setItem('vaktija_lang', 'bs');
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
  TestBed.inject(CalculationMethodService).setMethod('14.6');
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
