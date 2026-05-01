import { Component, input } from '@angular/core';
import { PrayerTime } from '../../../../core/models/prayer-time.model';

@Component({
  selector: 'app-prayer-card',
  standalone: true,
  templateUrl: './prayer-card.component.html',
  styleUrl: './prayer-card.component.css',
})
export class PrayerCardComponent {
  readonly prayer = input.required<PrayerTime>();
}
