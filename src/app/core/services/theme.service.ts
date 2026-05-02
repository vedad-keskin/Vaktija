import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'vaktija_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Current theme */
  readonly theme = signal<ThemeMode>(this.loadTheme());

  constructor() {
    // Apply theme to DOM whenever signal changes
    effect(() => {
      const t = this.theme();
      document.documentElement.setAttribute('data-theme', t);
    });

    // Apply initial theme immediately
    document.documentElement.setAttribute('data-theme', this.theme());
  }

  /** Toggle between light and dark */
  toggle(): void {
    const next: ThemeMode = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable
    }
  }

  setTheme(mode: ThemeMode): void {
    this.theme.set(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // localStorage unavailable
    }
  }

  private loadTheme(): ThemeMode {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      // localStorage unavailable
    }
    // Default to device preference
    if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }
}
