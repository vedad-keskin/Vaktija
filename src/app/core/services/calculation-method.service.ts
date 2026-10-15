import { Injectable, signal } from '@angular/core';

export type CalculationMethod = '14.6' | 'iz';

const STORAGE_KEY = 'vaktija_method';

@Injectable({ providedIn: 'root' })
export class CalculationMethodService {
  private readonly savedMethod = this.loadMethod();
  readonly hasChosen = signal(this.savedMethod !== null);

  /** Current calculation method */
  readonly method = signal<CalculationMethod>(this.savedMethod ?? '14.6');

  /** Switch method and persist */
  setMethod(method: CalculationMethod): void {
    this.method.set(method);
    this.hasChosen.set(true);
    try {
      localStorage.setItem(STORAGE_KEY, method);
    } catch {
      // localStorage unavailable
    }
  }

  /** Toggle between 14.6° and IZ */
  toggle(): void {
    this.setMethod(this.method() === '14.6' ? 'iz' : '14.6');
  }

  private loadMethod(): CalculationMethod | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === '14.6' || stored === 'iz') return stored;
    } catch {
      // localStorage unavailable
    }
    return null;
  }
}
