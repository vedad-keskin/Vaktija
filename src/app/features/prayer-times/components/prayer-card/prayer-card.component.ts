import {
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { PrayerTime } from '../../../../core/models/prayer-time.model';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-prayer-card',
  standalone: true,
  templateUrl: './prayer-card.component.html',
  styleUrl: './prayer-card.component.css',
})
export class PrayerCardComponent {
  readonly prayer = input.required<PrayerTime>();
  protected readonly labels = inject(LanguageService).labels;
  protected readonly illustrationSrc = computed(() => {
    const key = Object.entries(this.labels().prayerNames).find(
      ([, name]) => name === this.prayer().name,
    )?.[0];
    // Friday's Džuma/Jumu’ah retains the noon scene across both languages.
    return `/assets/illustrations/${(key ?? 'Dhuhr').toLowerCase()}.svg`;
  });
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly showTooltip = signal(false);

  private static readonly hoverMedia =
    typeof matchMedia !== 'undefined' ? matchMedia('(hover: hover) and (pointer: fine)') : null;

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

  @HostListener('keydown.escape')
  protected closeOnEscape(): void {
    this.showTooltip.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected closeTooltipFromOutside(event: Event): void {
    if (!this.showTooltip()) return;
    const t = event.target;
    if (t instanceof Node && this.host.nativeElement.contains(t)) return;
    this.showTooltip.set(false);
  }
}
