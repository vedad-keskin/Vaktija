import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { LanguageService } from '../../core/services/language.service';

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
  expect(harness.routeNativeElement!.querySelector('a[href="/duas"]')).toBeNull();

  language.setLanguage('bs');
  harness.detectChanges();
  expect(harness.routeNativeElement!.querySelector('h1')!.textContent).toContain('Politika privatnosti');
  expect(text()).toContain('14,6°');
});
