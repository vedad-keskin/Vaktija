import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { afterEach, vi } from 'vitest';
import { routes } from '../../app.routes';
import { LanguageService } from '../../core/services/language.service';
import { BS_LABELS, EN_LABELS } from '../../core/i18n';
import { DUA_CATEGORIES, DUAS } from './duas.data';
import { DHIKR } from './dhikr.data';
import { DuasPage } from './duas.page';

afterEach(() => {
  TestBed.resetTestingModule();
  vi.restoreAllMocks();
  localStorage.clear();
});

it('routes the bilingual library, validates saved data and persists bookmark changes', async () => {
  localStorage.clear();
  localStorage.setItem('vaktija_saved_duas', '["hisn-190","hisn-190","knowledge",7,null]');
  expect(DUA_CATEGORIES.map((category) => category.id)).toEqual(['toilet', 'ablution', 'marriage']);
  expect(DUAS.map((dua) => dua.id)).toEqual([
    'hisn-10',
    'hisn-11',
    'hisn-12',
    'hisn-13',
    'hisn-192',
    'hisn-191',
    'hisn-190',
  ]);
  await TestBed.configureTestingModule({
    imports: [DuasPage],
    providers: [provideRouter(routes)],
  }).compileComponents();
  const harness = await RouterTestingHarness.create('/duas?view=saved');
  const element = () => harness.routeNativeElement!;
  const cards = () => element().querySelectorAll<HTMLElement>('.dua-card');
  const save = (id: string) =>
    element().querySelector<HTMLButtonElement>(`[data-dua-id="${id}"] .dua-bookmark`)!;
  expect(cards()).toHaveLength(1);
  expect(element().querySelector('.saved-count')?.textContent).toContain('1');
  expect(save('hisn-190').getAttribute('aria-pressed')).toBe('true');

  const desktopLinks = element().querySelectorAll<HTMLAnchorElement>(
    '.header-desktop-controls > a',
  );
  expect([...desktopLinks].map((a) => a.getAttribute('href'))).toEqual([
    '/duas',
    '/dhikr',
    '/qibla',
  ]);
  expect(
    [...element().querySelectorAll<HTMLAnchorElement>('.mobile-page-links > a')].map((a) =>
      a.getAttribute('href'),
    ),
  ).toEqual(['/duas', '/dhikr', '/qibla']);
  element().querySelector<HTMLButtonElement>('#nav-hamburger')!.click();
  harness.detectChanges();
  expect(element().querySelector('.mobile-dropdown')?.classList.contains('open')).toBe(true);
  const mobileDuasLink = element().querySelector<HTMLAnchorElement>(
    '.mobile-page-links .header-duas',
  )!;
  mobileDuasLink.click();
  await harness.fixture.whenStable();
  expect(element().querySelector('.mobile-dropdown')?.classList.contains('open')).toBe(false);
  expect(cards()).toHaveLength(DUAS.length);
  const marriage = DUA_CATEGORIES.find((category) => category.id === 'marriage')!;
  await harness.navigateByUrl('/duas?category=marriage');
  expect(cards()).toHaveLength(marriage.items.length);
  expect(element().querySelector('.duas-collections a.active')?.textContent?.trim()).toBe(
    marriage.label[TestBed.inject(LanguageService).lang()],
  );
  await harness.navigateByUrl('/duas?category=unknown');
  expect(cards()).toHaveLength(DUAS.length);

  for (const lang of ['bs', 'en'] as const) {
    TestBed.inject(LanguageService).setLanguage(lang);
    harness.detectChanges();
    for (const [index, card] of [...cards()].entries()) {
      const dua = DUAS[index];
      expect(card.querySelector('h2')?.textContent).toBe(dua.title[lang]);
      expect(card.querySelector('.dua-transcription')?.textContent?.trim()).toBe(
        dua.transcription[lang],
      );
      expect(card.querySelector('.dua-translation')?.textContent?.trim()).toBe(
        dua.translation[lang],
      );
      expect(card.querySelector('.dua-arabic')?.textContent).toBe(dua.arabic);
      expect(card.querySelector('.dua-arabic')?.getAttribute('dir')).toBe('rtl');
      expect(card.querySelector('.dua-source a')?.getAttribute('href')).toBe(
        lang === 'bs' ? (dua.bosnianSourceUrl ?? dua.sourceUrl) : dua.sourceUrl,
      );
      expect(card.querySelectorAll('.dua-source a')).toHaveLength(1);
    }
    expect(document.title).toBe(lang === 'bs' ? BS_LABELS.duasDocTitle : EN_LABELS.duasDocTitle);
  }

  save('hisn-191').click();
  harness.detectChanges();
  expect(JSON.parse(localStorage.getItem('vaktija_saved_duas')!)).toEqual(['hisn-190', 'hisn-191']);
  await harness.navigateByUrl('/duas?view=saved');
  expect(cards()).toHaveLength(2);
  save('hisn-190').click();
  harness.detectChanges();
  save('hisn-191').click();
  harness.detectChanges();
  expect(cards()).toHaveLength(0);
  expect(element().querySelector('.duas-empty')?.textContent).toContain(EN_LABELS.duasEmptyTitle);
  expect(JSON.parse(localStorage.getItem('vaktija_saved_duas')!)).toEqual([]);

  const storageWrite = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('quota');
  });
  await harness.navigateByUrl('/duas');
  save('hisn-190').click();
  harness.detectChanges();
  expect(save('hisn-190').getAttribute('aria-pressed')).toBe('true');
  expect(element().querySelector('.duas-feedback')?.textContent).toContain(
    EN_LABELS.duasStorageError,
  );
  storageWrite.mockRestore();
  harness.fixture.destroy();

  // Reload tolerates corrupted JSON; an ordinary saved ID is restored on the next load.
  localStorage.setItem('vaktija_saved_duas', '{bad');
  const corrupted = TestBed.createComponent(DuasPage);
  corrupted.detectChanges();
  expect(corrupted.nativeElement.querySelector('.saved-count').textContent).toContain('0');
  corrupted.destroy();
  localStorage.setItem('vaktija_saved_duas', '["hisn-191"]');
  const reloaded = TestBed.createComponent(DuasPage);
  reloaded.detectChanges();
  expect(
    reloaded.nativeElement
      .querySelector('[data-dua-id="hisn-191"] .dua-bookmark')
      .getAttribute('aria-pressed'),
  ).toBe('true');
  reloaded.destroy();
});

it('shows the sourced bilingual dhikr collection and keeps its saved items separate from duas', async () => {
  localStorage.clear();
  localStorage.setItem('vaktija_saved_duas', '["hisn-190"]');
  await TestBed.configureTestingModule({
    imports: [DuasPage],
    providers: [provideRouter(routes)],
  }).compileComponents();
  const harness = await RouterTestingHarness.create('/dhikr');
  const element = () => harness.routeNativeElement!;
  const cards = () => element().querySelectorAll<HTMLElement>('.dua-card');
  expect(cards()).toHaveLength(DHIKR.length);
  expect(cards()[0].querySelector('.dua-arabic')?.textContent).toBe(DHIKR[0].arabic);
  expect(cards()[1].querySelector('.dua-arabic')?.textContent).toBe(DHIKR[1].arabic);

  for (const lang of ['bs', 'en'] as const) {
    TestBed.inject(LanguageService).setLanguage(lang);
    harness.detectChanges();
    expect(element().querySelector('h1')?.textContent).toBe(lang === 'bs' ? 'Zikrovi' : 'Dhikr');
    expect(document.title).toBe(lang === 'bs' ? BS_LABELS.dhikrDocTitle : EN_LABELS.dhikrDocTitle);
    for (const [index, card] of [...cards()].entries()) {
      const item = DHIKR[index];
      expect(card.querySelector('h2')?.textContent).toBe(item.title[lang]);
      expect(card.querySelector('.dua-transcription')?.textContent?.trim()).toBe(
        item.transcription[lang],
      );
      expect(card.querySelector('.dua-translation')?.textContent?.trim()).toBe(
        item.translation[lang],
      );
      expect(card.querySelector('.dua-source a')?.getAttribute('href')).toBe(item.sourceUrl);
    }
  }

  cards()[0].querySelector<HTMLButtonElement>('.dua-bookmark')!.click();
  harness.detectChanges();
  expect(JSON.parse(localStorage.getItem('vaktija_saved_dhikr')!)).toEqual(['tawhid']);
  expect(JSON.parse(localStorage.getItem('vaktija_saved_duas')!)).toEqual(['hisn-190']);
  await harness.navigateByUrl('/dhikr?view=saved');
  expect(cards()).toHaveLength(1);
  expect(cards()[0].dataset['duaId']).toBe('tawhid');
  await harness.navigateByUrl('/duas?view=saved');
  expect(cards()).toHaveLength(1);
  expect(cards()[0].dataset['duaId']).toBe('hisn-190');
});
