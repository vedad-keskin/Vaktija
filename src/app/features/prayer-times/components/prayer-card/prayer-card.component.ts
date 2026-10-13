import { Component, computed, inject, input } from '@angular/core';
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
}
