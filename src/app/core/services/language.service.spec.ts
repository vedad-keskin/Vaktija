import { LanguageService } from './language.service';

it('uses Balkan device locales on first visit and preserves a chosen language', () => {
  const original = Object.getOwnPropertyDescriptor(navigator, 'language');
  const deviceLanguage = (language: string) =>
    Object.defineProperty(navigator, 'language', { configurable: true, value: language });

  try {
    localStorage.clear();
    deviceLanguage('hr-HR');
    expect(new LanguageService().lang()).toBe('bs');
    deviceLanguage('en-BA');
    expect(new LanguageService().lang()).toBe('bs');
    deviceLanguage('en-US');
    expect(new LanguageService().lang()).toBe('en');

    const chosen = new LanguageService();
    chosen.setLanguage('bs');
    expect(localStorage.getItem('vaktija_lang')).toBe('bs');
    expect(new LanguageService().lang()).toBe('bs');
    chosen.setLanguage('en');
    deviceLanguage('bs-BA');
    expect(new LanguageService().lang()).toBe('en');
  } finally {
    localStorage.clear();
    if (original) Object.defineProperty(navigator, 'language', original);
    else Reflect.deleteProperty(navigator, 'language');
  }
});
