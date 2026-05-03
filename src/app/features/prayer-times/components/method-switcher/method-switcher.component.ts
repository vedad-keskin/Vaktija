import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { CalculationMethodService, CalculationMethod } from '../../../../core/services/calculation-method.service';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-method-switcher',
  standalone: true,
  templateUrl: './method-switcher.component.html',
  styleUrl: './method-switcher.component.css',
})
export class MethodSwitcherComponent {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly methods = inject(CalculationMethodService);
  protected readonly labels = inject(LanguageService).labels;
  protected readonly method = this.methods.method;

  /** Which method’s explanation panel is open (tap “i” again or outside to close). */
  protected readonly helpOpen = signal<CalculationMethod | null>(null);

  /**
   * When true, individual buttons select their specific value (mobile dropdown).
   * When false, clicking anywhere on the control toggles (desktop).
   */
  readonly directSelect = input(false);

  readonly picked = output<void>();

  /** Desktop: click anywhere toggles */
  protected onContainerClick(): void {
    if (!this.directSelect()) {
      this.helpOpen.set(null);
      this.methods.toggle();
    }
  }

  /** Mobile: click specific row to select that method */
  protected onBtnClick(method: CalculationMethod, event: Event): void {
    this.helpOpen.set(null);
    if (this.directSelect()) {
      event.stopPropagation();
      this.methods.setMethod(method);
      this.picked.emit();
    }
  }

  protected toggleHelp(key: CalculationMethod, event: Event): void {
    event.stopPropagation();
    this.helpOpen.update((v) => (v === key ? null : key));
  }

  @HostListener('document:click', ['$event'])
  protected closeHelpFromOutside(event: Event): void {
    if (this.helpOpen() === null) return;
    const t = event.target;
    if (t instanceof Node && this.host.nativeElement.contains(t)) return;
    this.helpOpen.set(null);
  }

  @HostListener('document:keydown.escape')
  protected closeHelpOnEscape(): void {
    this.helpOpen.set(null);
  }
}
