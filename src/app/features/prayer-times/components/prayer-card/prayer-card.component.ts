import { Component, input, signal } from '@angular/core';
import { PrayerTime } from '../../../../core/models/prayer-time.model';

@Component({
  selector: 'app-prayer-card',
  standalone: true,
  templateUrl: './prayer-card.component.html',
  styleUrl: './prayer-card.component.css',
})
export class PrayerCardComponent {
  readonly prayer = input.required<PrayerTime>();
  protected readonly showTooltip = signal(false);

  protected onMouseEnter(): void {
    if (this.prayer().tooltip) this.showTooltip.set(true);
  }

  protected onMouseLeave(): void {
    this.showTooltip.set(false);
  }

  protected toggleTooltip(): void {
    if (this.prayer().tooltip) this.showTooltip.update((v) => !v);
  }
}
