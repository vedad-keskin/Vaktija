import { Injectable, signal, computed } from '@angular/core';
import { BS_LABELS, EN_LABELS, type AppLabels } from '../i18n';

export type LangCode = 'bs' | 'en';

const STORAGE_KEY = 'vaktija_lang';

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

  /** Switch to a given language and persist */
  setLanguage(code: LangCode): void {
    this.lang.set(code);
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
    return 'bs'; // default
  }
}
