import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { LanguageService } from '../../core/services/language.service';
import { ThemeService } from '../../core/services/theme.service';
import { Title } from '@angular/platform-browser';

it('serves /privacy in both languages and does not treat it as a city', async () => {
  localStorage.clear();
  localStorage.setItem('vaktija_method', 'iz');
  await TestBed.configureTestingModule({
    providers: [provideRouter(routes)],
  }).compileComponents();

  const language = TestBed.inject(LanguageService);
  language.setLanguage('en');
  const harness = await RouterTestingHarness.create('/privacy');
  const text = () => harness.routeNativeElement!.textContent ?? '';

  expect(harness.routeNativeElement!.querySelector('h1')!.textContent).toContain('Privacy policy');
  expect(text()).toContain('api.aladhan.com');
  expect(text()).toContain('precise location');
  expect(text()).toContain('Google Play');
  expect(text()).toContain('Nightfall Studio');
  expect(text()).toContain('bookmarks');
  expect(text()).toContain('system backup');
  expect(text()).not.toMatch(/iOS|App Store|widget|Prayer reminders/);
  expect(
    harness.routeNativeElement!.querySelector('a[href="mailto:vedad.keskin98@gmail.com"]'),
  ).not.toBeNull();
  expect(harness.routeNativeElement!.querySelector('a[href="/duas"]')).toBeNull();

  const sectionIds = () => [...harness.routeNativeElement!.querySelectorAll('h2')].map((h) => h.id);
  const englishSections = sectionIds();
  const bosnian =
    harness.routeNativeElement!.querySelector<HTMLButtonElement>('button[lang="bs"]')!;
  bosnian.click();
  harness.detectChanges();
  expect(harness.routeNativeElement!.querySelector('h1')!.textContent).toContain(
    'Politika privatnosti',
  );
  expect(text()).toContain('14,6°');
  expect(text()).toContain('sigurnosnu kopiju');
  expect(bosnian.getAttribute('aria-pressed')).toBe('true');
  expect(document.documentElement.lang).toBe('bs');
  expect(TestBed.inject(Title).getTitle()).toBe('Politika privatnosti — Vaktija');
  expect(sectionIds()).toEqual(englishSections);

  harness
    .routeNativeElement!.querySelector<HTMLButtonElement>('app-theme-switcher button')!
    .click();
  harness.detectChanges();
  expect(TestBed.inject(ThemeService).theme()).toBe('light');
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  localStorage.clear();
});
