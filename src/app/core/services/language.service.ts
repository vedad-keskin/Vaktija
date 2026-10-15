import { Injectable, signal, computed } from '@angular/core';
import { BS_LABELS, EN_LABELS, type AppLabels } from '../i18n';

export type LangCode = 'bs' | 'en';

const STORAGE_KEY = 'vaktija_lang';
const BALKAN_LANGUAGES = new Set(['bs', 'hr', 'sr', 'cnr', 'sl', 'mk', 'sq', 'bg', 'el', 'ro', 'tr']);
const BALKAN_REGIONS = new Set(['BA', 'HR', 'RS', 'ME', 'SI', 'MK', 'AL', 'XK', 'BG', 'GR', 'RO', 'TR']);

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private static readonly LANGS: Record<LangCode, AppLabels> = {
    bs: BS_LABELS,
    en: EN_LABELS,
  };

  /** Current language code */
  readonly lang = signal<LangCode>(this.loadFromStorage());

  /** Reactive labels for the active language */
  readonly labels = computed<AppLabels>(() => LanguageService.LANGS[this.lang()]);

  constructor() {
    document.documentElement.lang = this.lang();
  }

  /** Switch to a given language and persist */
  setLanguage(code: LangCode): void {
    this.lang.set(code);
    document.documentElement.lang = code;
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // localStorage unavailable — silently ignore
    }
  }

  private loadFromStorage(): LangCode {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'bs') return stored;
    } catch {
      // localStorage unavailable
    }
    const locale = navigator.language;
    try {
      const device = new Intl.Locale(locale);
      return BALKAN_LANGUAGES.has(device.language) || BALKAN_REGIONS.has(device.region ?? '')
        ? 'bs'
        : 'en';
    } catch {
      return 'en';
    }
  }
}
