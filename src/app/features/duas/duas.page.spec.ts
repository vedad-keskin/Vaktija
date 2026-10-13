import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { afterEach, vi } from 'vitest';
import { routes } from '../../app.routes';
import { LanguageService } from '../../core/services/language.service';
import { BS_LABELS, EN_LABELS } from '../../core/i18n';
import { DUAS } from './duas.data';
import { DuasPage } from './duas.page';

afterEach(() => {
  TestBed.resetTestingModule();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
});

it('routes the bilingual library, validates saved data and persists bookmark changes', async () => {
  localStorage.clear();
  localStorage.setItem('vaktija_saved_duas', '["knowledge","knowledge","missing",7,null]');
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
  expect(save('knowledge').getAttribute('aria-pressed')).toBe('true');

  const desktopLinks = element().querySelectorAll<HTMLAnchorElement>(
    '.header-desktop-controls > a',
  );
  expect([...desktopLinks].map((a) => a.getAttribute('href'))).toEqual(['/duas', '/qibla']);
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
      expect(card.querySelector('.dua-source a')?.getAttribute('href')).toBe(dua.sourceUrl);
    }
    expect(document.title).toBe(lang === 'bs' ? BS_LABELS.duasDocTitle : EN_LABELS.duasDocTitle);
  }

  save('after-adhan').click();
  harness.detectChanges();
  expect(JSON.parse(localStorage.getItem('vaktija_saved_duas')!)).toEqual([
    'knowledge',
    'after-adhan',
  ]);
  await harness.navigateByUrl('/duas?view=saved');
  expect(cards()).toHaveLength(2);
  save('knowledge').click();
  harness.detectChanges();
  save('after-adhan').click();
  harness.detectChanges();
  expect(cards()).toHaveLength(0);
  expect(element().querySelector('.duas-empty')?.textContent).toContain(EN_LABELS.duasEmptyTitle);
  expect(JSON.parse(localStorage.getItem('vaktija_saved_duas')!)).toEqual([]);

  const storageWrite = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('quota');
  });
  await harness.navigateByUrl('/duas');
  save('knowledge').click();
  harness.detectChanges();
  expect(save('knowledge').getAttribute('aria-pressed')).toBe('true');
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
  localStorage.setItem('vaktija_saved_duas', '["after-adhan"]');
  const reloaded = TestBed.createComponent(DuasPage);
  reloaded.detectChanges();
  expect(
    reloaded.nativeElement
      .querySelector('[data-dua-id="after-adhan"] .dua-bookmark')
      .getAttribute('aria-pressed'),
  ).toBe('true');
  reloaded.destroy();
});

it('uses an Arabic voice, ignores cancelled callbacks and stops playback when a card disappears or the page closes', async () => {
  localStorage.clear();
  let voices: SpeechSynthesisVoice[] = [
    { lang: 'en-US', localService: true } as SpeechSynthesisVoice,
  ];
  const speech = Object.assign(new EventTarget(), {
    getVoices: vi.fn(() => voices),
    speak: vi.fn(),
    cancel: vi.fn(),
  });
  class Utterance {
    lang = '';
    rate = 1;
    voice: SpeechSynthesisVoice | null = null;
    onend: (() => void) | null = null;
    onerror: (() => void) | null = null;
    constructor(public text: string) {}
  }
  vi.stubGlobal('speechSynthesis', speech);
  vi.stubGlobal('SpeechSynthesisUtterance', Utterance);
  await TestBed.configureTestingModule({
    imports: [DuasPage],
    providers: [provideRouter(routes)],
  }).compileComponents();
  const harness = await RouterTestingHarness.create('/duas');
  const element = () => harness.routeNativeElement!;
  const audio = (id: string) =>
    element().querySelector<HTMLButtonElement>(`[data-dua-id="${id}"] .dua-audio`)!;
  const bookmark = (id: string) =>
    element().querySelector<HTMLButtonElement>(`[data-dua-id="${id}"] .dua-bookmark`)!;
  const spoken = () => speech.speak.mock.calls.at(-1)![0] as Utterance;
  expect(audio('knowledge').disabled).toBe(true);
  expect(element().querySelector('.duas-audio-note')?.textContent).toContain(
    BS_LABELS.duasAudioUnavailable,
  );

  voices = [...voices, { lang: 'ar-SA', localService: true } as SpeechSynthesisVoice];
  speech.dispatchEvent(new Event('voiceschanged'));
  harness.detectChanges();
  expect(audio('knowledge').disabled).toBe(false);
  audio('knowledge').click();
  harness.detectChanges();
  const first = spoken();
  expect(first.text).toBe(DUAS[0].arabic);
  expect(first.lang).toBe('ar-SA');
  expect(first.voice).toBe(voices[1]);
  expect(audio('knowledge').getAttribute('aria-pressed')).toBe('true');
  audio('forgiveness').click();
  harness.detectChanges();
  const second = spoken();
  expect(speech.cancel).toHaveBeenCalledTimes(1);
  first.onerror!();
  first.onend!();
  harness.detectChanges();
  expect(audio('forgiveness').getAttribute('aria-pressed')).toBe('true');
  expect(element().querySelector('.duas-feedback')?.textContent.trim()).toBe('');
  second.onend!();
  harness.detectChanges();
  expect(audio('forgiveness').getAttribute('aria-pressed')).toBe('false');

  audio('knowledge').click();
  spoken().onerror!();
  harness.detectChanges();
  expect(element().querySelector('.duas-feedback')?.textContent).toContain(
    BS_LABELS.duasAudioError,
  );
  audio('knowledge').click();
  audio('knowledge').click();
  harness.detectChanges();
  expect(audio('knowledge').getAttribute('aria-pressed')).toBe('false');

  bookmark('knowledge').click();
  await harness.navigateByUrl('/duas?view=saved');
  audio('knowledge').click();
  const removed = spoken();
  bookmark('knowledge').click();
  harness.detectChanges();
  expect(element().querySelectorAll('.dua-card')).toHaveLength(0);
  expect(speech.cancel).toHaveBeenCalledTimes(3);
  removed.onerror!();
  harness.detectChanges();
  expect(element().querySelector('.duas-feedback')?.textContent.trim()).toBe('');

  await harness.navigateByUrl('/duas');
  audio('knowledge').click();
  const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
  document.dispatchEvent(new Event('visibilitychange'));
  harness.detectChanges();
  expect(audio('knowledge').getAttribute('aria-pressed')).toBe('false');
  hidden.mockRestore();
  audio('knowledge').click();
  const last = spoken();
  harness.fixture.destroy();
  expect(speech.cancel).toHaveBeenCalledTimes(5);
  last.onerror!();
});
