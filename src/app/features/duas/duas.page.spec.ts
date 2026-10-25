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

it('shows ten items at a time and resets on view changes', async () => {
  localStorage.setItem(
    'vaktija_saved_duas',
    JSON.stringify(DUAS.slice(0, 11).map((dua) => dua.id)),
  );
  await TestBed.configureTestingModule({
    imports: [DuasPage],
    providers: [provideRouter(routes)],
  }).compileComponents();
  const harness = await RouterTestingHarness.create('/duas');
  const element = () => harness.routeNativeElement!;
  const cards = () => element().querySelectorAll('.dua-card');
  const more = () => element().querySelector<HTMLButtonElement>('.duas-show-more');

  expect(cards()).toHaveLength(10);
  expect(more()?.textContent?.trim()).toBe(EN_LABELS.showMore);
  more()!.click();
  harness.detectChanges();
  expect(cards()).toHaveLength(20);
  expect(document.activeElement).toBe(cards()[10].querySelector('h2'));
  more()!.click();
  harness.detectChanges();
  expect(cards()).toHaveLength(30);
  more()!.click();
  harness.detectChanges();
  expect(cards()).toHaveLength(40);
  more()!.click();
  harness.detectChanges();
  expect(cards()).toHaveLength(50);
  while (more()) {
    more()!.click();
    harness.detectChanges();
  }
  expect(cards()).toHaveLength(DUAS.length);
  expect(more()).toBeNull();
  expect(document.activeElement).toBe(
    cards()[Math.floor((DUAS.length - 1) / 10) * 10].querySelector('h2'),
  );

  await harness.navigateByUrl('/duas?category=marriage');
  expect(cards()).toHaveLength(3);
  expect(more()).toBeNull();
  await harness.navigateByUrl('/duas?category=mosque');
  expect([...cards()].map((card) => card.getAttribute('data-dua-id'))).toEqual([
    'hisn-19',
    'hisn-20',
    'hisn-21',
  ]);
  await harness.navigateByUrl('/duas?category=general');
  expect([...cards()].map((card) => card.getAttribute('data-dua-id'))).toEqual([
    'hisn-188',
    'hisn-189',
    'hisn-230',
    'hisn-240',
    'hisn-245',
    'hisn-144',
  ]);
  expect(
    [...cards()[0].querySelectorAll('.dua-saying .dua-arabic')].map((phrase) =>
      phrase.textContent?.trim(),
    ),
  ).toEqual([
    'الْحَمْدُ لِلَّهِ',
    'يَرْحَمُكَ اللَّهُ',
    'يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ',
  ]);
  expect(cards()[0].querySelectorAll('.dua-saying .dua-instructions')).toHaveLength(3);
  await harness.navigateByUrl('/duas?category=home');
  expect([...cards()].map((card) => card.getAttribute('data-dua-id'))).toEqual([
    'hisn-16',
    'hisn-18',
  ]);
  expect(more()).toBeNull();
  expect(cards()[0].querySelector('h2')?.textContent).toBe('When leaving home');
  await harness.navigateByUrl('/duas?category=travel');
  expect([...cards()].map((card) => card.getAttribute('data-dua-id'))).toEqual([
    'hisn-207',
    'hisn-215',
    'hisn-217',
    'hisn-216',
    'hisn-206',
    'hisn-208',
    'hisn-209',
    'hisn-211',
    'hisn-212',
    'hisn-210',
  ]);
  expect(more()).toBeNull();
  await harness.navigateByUrl('/duas?category=sleep');
  expect([...cards()].map((card) => card.getAttribute('data-dua-id'))).toEqual([
    'hisn-111',
    'hisn-1',
    'hisn-114',
    'hisn-113',
    'hisn-112',
  ]);
  await harness.navigateByUrl('/duas?category=illness');
  expect([...cards()].map((card) => card.getAttribute('data-dua-id'))).toEqual([
    'hisn-243',
    'hisn-147',
    'hisn-148',
    'hisn-150',
    'hisn-153',
  ]);
  await harness.navigateByUrl('/duas?category=death');
  expect([...cards()].map((card) => card.getAttribute('data-dua-id'))).toEqual([
    'hisn-162',
    'hisn-154',
    'hisn-156',
    'hisn-160',
    'hisn-155',
    'hisn-163',
    'hisn-165',
  ]);
  expect(more()).toBeNull();
  await harness.navigateByUrl('/duas?category=protection');
  more()!.click();
  harness.detectChanges();
  expect([...cards()].map((card) => card.getAttribute('data-dua-id'))).toEqual([
    'hisn-124',
    'hisn-121',
    'hisn-126',
    'hisn-133',
    'hisn-139',
    'hisn-193',
    'hisn-194',
    'hisn-199',
    'hisn-203',
    'hisn-131',
    'hisn-132',
  ]);
  expect(more()).toBeNull();
  await harness.navigateByUrl('/duas?category=children');
  expect([...cards()].map((card) => card.getAttribute('data-dua-id'))).toEqual(['hisn-146']);
  expect(more()).toBeNull();
  await harness.navigateByUrl('/duas?category=debt');
  expect([...cards()].map((card) => card.getAttribute('data-dua-id'))).toEqual([
    'hisn-136',
    'hisn-201',
  ]);
  expect(more()).toBeNull();
  await harness.navigateByUrl('/duas?view=saved');
  expect(cards()).toHaveLength(10);
  more()!.click();
  harness.detectChanges();
  expect(cards()).toHaveLength(11);
  expect(more()).toBeNull();
  await harness.navigateByUrl('/duas');
  expect(cards()).toHaveLength(10);
});

it('routes the bilingual library, validates saved data and persists bookmark changes', async () => {
  localStorage.clear();
  localStorage.setItem('vaktija_saved_duas', '["hisn-190","hisn-190","knowledge",7,null]');
  expect(DUA_CATEGORIES.map((category) => category.id)).toEqual([
    'toilet',
    'ablution',
    'mosque',
    'adhan',
    'fasting',
    'sleep',
    'illness',
    'death',
    'protection',
    'children',
    'debt',
    'marriage',
    'clothing',
    'gathering',
    'animals',
    'weather',
    'home',
    'travel',
    'hajj',
    'kurban',
    'forgiveness',
    'general',
  ]);
  expect(DUAS.map((dua) => dua.id)).toEqual([
    'hisn-10',
    'hisn-11',
    'hisn-12',
    'hisn-13',
    'hisn-19',
    'hisn-20',
    'hisn-21',
    'hisn-25',
    'hisn-176',
    'hisn-178',
    'hisn-178-forgot',
    'hisn-180',
    'hisn-182',
    'hisn-183',
    'hisn-184',
    'hisn-186',
    'hisn-111',
    'hisn-1',
    'hisn-114',
    'hisn-113',
    'hisn-112',
    'hisn-243',
    'hisn-147',
    'hisn-148',
    'hisn-150',
    'hisn-153',
    'hisn-162',
    'hisn-154',
    'hisn-156',
    'hisn-160',
    'hisn-155',
    'hisn-163',
    'hisn-165',
    'hisn-124',
    'hisn-121',
    'hisn-126',
    'hisn-133',
    'hisn-139',
    'hisn-193',
    'hisn-194',
    'hisn-199',
    'hisn-203',
    'hisn-131',
    'hisn-132',
    'hisn-146',
    'hisn-136',
    'hisn-201',
    'hisn-192',
    'hisn-191',
    'hisn-190',
    'hisn-5',
    'hisn-9',
    'hisn-6',
    'hisn-7',
    'hisn-195',
    'bs-184a',
    'hisn-196',
    'hisn-191-animal',
    'hisn-228',
    'hisn-229',
    'hisn-166',
    'hisn-168',
    'hisn-169',
    'hisn-172',
    'hisn-173',
    'hisn-174',
    'hisn-175',
    'hisn-16',
    'hisn-18',
    'hisn-207',
    'hisn-215',
    'hisn-217',
    'hisn-216',
    'hisn-206',
    'hisn-208',
    'hisn-209',
    'hisn-211',
    'hisn-212',
    'hisn-210',
    'hisn-233',
    'hisn-235',
    'hisn-237',
    'hisn-238',
    'hisn-246',
    'hisn-140',
    'hisn-250',
    'hisn-188',
    'hisn-189',
    'hisn-230',
    'hisn-240',
    'hisn-245',
    'hisn-144',
  ]);
  await TestBed.configureTestingModule({
    imports: [DuasPage],
    providers: [provideRouter(routes)],
  }).compileComponents();
  const harness = await RouterTestingHarness.create('/duas?view=saved');
  const element = () => harness.routeNativeElement!;
  const cards = () => element().querySelectorAll<HTMLElement>('.dua-card');
  const showMore = () => element().querySelector<HTMLButtonElement>('.duas-show-more');
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
  while (showMore()) {
    showMore()!.click();
    harness.detectChanges();
  }
  expect(cards()).toHaveLength(DUAS.length);
  const marriage = DUA_CATEGORIES.find((category) => category.id === 'marriage')!;
  await harness.navigateByUrl('/duas?category=marriage');
  expect(cards()).toHaveLength(marriage.items.length);
  expect(element().querySelector('.duas-collections a.active')?.textContent?.trim()).toBe(
    marriage.label[TestBed.inject(LanguageService).lang()],
  );
  await harness.navigateByUrl('/duas?category=unknown');
  while (showMore()) {
    showMore()!.click();
    harness.detectChanges();
  }
  expect(cards()).toHaveLength(DUAS.length);

  for (const lang of ['bs', 'en'] as const) {
    TestBed.inject(LanguageService).setLanguage(lang);
    harness.detectChanges();
    const categoryLabels = [...element().querySelectorAll('.duas-collections a')]
      .slice(1, -1)
      .map((link) => link.textContent?.trim());
    expect(categoryLabels).toEqual(
      lang === 'bs'
        ? [
            'Abdest',
            'Bolest i bol',
            'Brak',
            'Djeca',
            'Dug',
            'Džamija',
            'Ezan',
            'Hadž i umra',
            'Kuća',
            'Kurban',
            'Odjeća',
            'Oprost',
            'Post i hrana',
            'Priroda i vrijeme',
            'Putovanje',
            'Sijelo',
            'Smrt',
            'Spavanje i snovi',
            'Toalet',
            'Zaštita',
            'Životinje',
            'Opće',
          ]
        : [
            'Ablution',
            'Adhan',
            'Animals',
            'Children',
            'Clothing',
            'Death',
            'Debt',
            'Fasting and food',
            'Forgiveness',
            'Gathering',
            'Hajj and Umrah',
            'Home',
            'Illness and pain',
            'Marriage',
            'Mosque',
            'Nature and weather',
            'Protection',
            'Qurbani',
            'Sleep and dreams',
            'Toilet',
            'Travel',
            'General',
          ],
    );
    for (const [index, card] of [...cards()].entries()) {
      const dua = DUAS[index];
      expect(card.querySelector('h2')?.textContent).toBe(dua.title[lang]);
      if (dua.sayings) {
        const rows = [...card.querySelectorAll('.dua-saying')];
        expect(rows).toHaveLength(dua.sayings.length);
        for (const [sayingIndex, row] of rows.entries()) {
          const saying = dua.sayings[sayingIndex];
          expect(row.querySelector('.dua-arabic')?.textContent).toBe(saying.arabic);
          expect(row.querySelector('.dua-transcription')?.textContent?.trim()).toBe(
            saying.transcription[lang],
          );
          expect(row.querySelector('.dua-translation')?.textContent?.trim()).toBe(
            saying.translation[lang],
          );
          expect(row.querySelector('.dua-instructions p')?.textContent?.trim()).toBe(
            saying.instructions[lang],
          );
        }
      } else {
        expect(card.querySelector('.dua-transcription')?.textContent?.trim() ?? '').toBe(
          dua.transcription[lang],
        );
        expect(card.querySelector('.dua-instructions p')?.textContent?.trim() ?? '').toBe(
          dua.instructions?.[lang] ?? '',
        );
        expect(card.querySelector('.dua-instructions-label')?.textContent?.trim() ?? '').toBe(
          dua.instructions
            ? lang === 'bs'
              ? BS_LABELS.duasInstructions
              : EN_LABELS.duasInstructions
            : '',
        );
        expect(card.querySelector('.dua-translation')?.textContent?.trim() ?? '').toBe(
          dua.translation[lang],
        );
        expect(card.querySelector('.dua-arabic')?.textContent).toBe(dua.arabic);
      }
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
  while (!element().querySelector('[data-dua-id="hisn-190"]') && showMore()) {
    showMore()!.click();
    harness.detectChanges();
  }
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
  while (
    !reloaded.nativeElement.querySelector('[data-dua-id="hisn-191"]') &&
    reloaded.nativeElement.querySelector('.duas-show-more')
  ) {
    reloaded.nativeElement.querySelector('.duas-show-more').click();
    reloaded.detectChanges();
  }
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
        item.transcription?.[lang],
      );
      expect(card.querySelector('.dua-translation')?.textContent?.trim()).toBe(
        item.translation?.[lang],
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
