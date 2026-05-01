import { Component, ElementRef, HostListener, inject, input, signal } from '@angular/core';
import { PrayerTime } from '../../../../core/models/prayer-time.model';

@Component({
  selector: 'app-prayer-card',
  standalone: true,
  templateUrl: './prayer-card.component.html',
  styleUrl: './prayer-card.component.css',
})
export class PrayerCardComponent {
  readonly prayer = input.required<PrayerTime>();
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly showTooltip = signal(false);

  private static readonly hoverMedia =
    typeof matchMedia !== 'undefined'
      ? matchMedia('(hover: hover) and (pointer: fine)')
      : null;

  protected onMouseEnter(): void {
    if (!PrayerCardComponent.hoverMedia?.matches || !this.prayer().tooltip) return;
    this.showTooltip.set(true);
  }

  protected onMouseLeave(): void {
    if (!PrayerCardComponent.hoverMedia?.matches) return;
    this.showTooltip.set(false);
  }

  protected toggleTooltip(): void {
    if (!this.prayer().tooltip) return;
    this.showTooltip.update((v) => !v);
  }

  @HostListener('document:click', ['$event'])
  protected closeTooltipFromOutside(event: Event): void {
    if (!this.showTooltip()) return;
    const t = event.target;
    if (t instanceof Node && this.host.nativeElement.contains(t)) return;
    this.showTooltip.set(false);
  }
}
