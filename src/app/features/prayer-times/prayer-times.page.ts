import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { CitySelectorComponent } from './components/city-selector/city-selector.component';
import { PrayerCardComponent } from './components/prayer-card/prayer-card.component';
import { PrayerTimeService } from '../../core/services/prayer-time.service';
import { LocationService } from '../../core/services/location.service';
import { PrayerTimeData, PrayerTime } from '../../core/models/prayer-time.model';
import { Location } from '../../core/models/location.model';

@Component({
  selector: 'app-prayer-times',
  standalone: true,
  imports: [HeaderComponent, CitySelectorComponent, PrayerCardComponent],
  templateUrl: './prayer-times.page.html',
  styleUrl: './prayer-times.page.css',
})
export class PrayerTimesPage implements OnInit, OnDestroy {
  private readonly prayerTimeService = inject(PrayerTimeService);
  private readonly locationService = inject(LocationService);
  private tickInterval: ReturnType<typeof setInterval> | null = null;

  protected readonly locations = signal<Location[]>([]);
  protected readonly selectedLocation = signal<Location | null>(null);
  protected readonly rawTimes = signal<PrayerTimeData[]>([]);
  protected readonly locationName = signal('');
  protected readonly dateLabel = signal('');
  protected readonly isLoading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly now = signal(new Date());
  protected readonly hijriDate = signal('');

  /** All 8 prayer times with dynamic isPassed/isActive/relativeText */
  protected readonly displayTimes = computed<PrayerTime[]>(() => {
    const times = this.rawTimes();
    const current = this.now();
    const currentMin = current.getHours() * 60 + current.getMinutes();

    let activeFound = false;
    return times.map((t) => {
      const isPassed = !activeFound && t.minutes <= currentMin;
      const isActive = !activeFound && t.minutes > currentMin;
      if (isActive) activeFound = true;

      return {
        ...t,
        isPassed: isPassed && !isActive,
        isActive,
        relativeText: this.formatRelative(t.minutes - currentMin),
      };
    });
  });

  /** Countdown to the next upcoming prayer */
  protected readonly countdown = computed(() => {
    const times = this.rawTimes();
    const current = this.now();
    if (!times.length) return null;

    const currentTotalSec =
      current.getHours() * 3600 + current.getMinutes() * 60 + current.getSeconds();

    // Find next prayer (first whose minutes > current minutes)
    const currentMin = Math.floor(currentTotalSec / 60);
    let next = times.find((t) => t.minutes > currentMin);
    let diffSec: number;

    if (next) {
      diffSec = next.minutes * 60 - currentTotalSec;
    } else {
      // All passed — next is first prayer tomorrow
      next = times[0];
      diffSec = (next.minutes + 24 * 60) * 60 - currentTotalSec;
    }

    if (diffSec < 0) diffSec += 24 * 3600;

    return {
      name: next.name,
      hours: Math.floor(diffSec / 3600),
      minutes: Math.floor((diffSec % 3600) / 60),
      seconds: diffSec % 60,
    };
  });

  ngOnInit(): void {
    this.loadLocations();
    const saved = this.locationService.getSelectedLocation();
    this.selectedLocation.set(saved);
    this.loadPrayerTimes(saved);

    // Tick every second for countdown + relative times
    this.tickInterval = setInterval(() => this.now.set(new Date()), 1000);
  }

  ngOnDestroy(): void {
    if (this.tickInterval) clearInterval(this.tickInterval);
  }

  protected onCityChange(location: Location): void {
    this.selectedLocation.set(location);
    this.locationService.setSelectedLocation(location);
    this.loadPrayerTimes(location);
  }

  protected pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  private loadLocations(): void {
    this.locationService.getLocations().subscribe({
      next: (locs) => this.locations.set(locs),
      error: (err) => console.error('Failed to load locations:', err),
    });
  }

  private loadPrayerTimes(location: Location): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.prayerTimeService.getTodayPrayerTimes(location.lat, location.lng, location.name).subscribe({
      next: ({ prayerTimes, locationName, dateLabel, hijriDate }) => {
        this.rawTimes.set(prayerTimes);
        this.locationName.set(locationName);
        this.dateLabel.set(dateLabel);
        this.hijriDate.set(hijriDate);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Greška pri učitavanju. Pokušajte ponovo.');
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Formats a minute-difference as Bosnian relative time.
   * Negative = in the past, positive = in the future.
   */
  private formatRelative(diffMinutes: number): string {
    const abs = Math.abs(diffMinutes);
    const prefix = diffMinutes <= 0 ? 'prije' : 'za';

    if (abs < 1) return 'sada';

    const h = Math.floor(abs / 60);
    const m = abs % 60;

    if (h === 0) return `${prefix} ${m} ${this.minPlural(m)}`;
    if (m === 0) return `${prefix} ${h} ${this.hrPlural(h)}`;
    return `${prefix} ${h}h ${m}min`;
  }

  private hrPlural(n: number): string {
    if (n === 1) return 'sat';
    if (n >= 2 && n <= 4) return 'sata';
    return 'sati';
  }

  private minPlural(n: number): string {
    if (n === 1) return 'minutu';
    if (n >= 2 && n <= 4) return 'minute';
    return 'minuta';
  }
}
