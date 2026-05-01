import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { CitySelectorComponent } from './components/city-selector/city-selector.component';
import { PrayerCardComponent } from './components/prayer-card/prayer-card.component';
import { PrayerTimeService } from '../../core/services/prayer-time.service';
import { LocationService } from '../../core/services/location.service';
import { PrayerTime } from '../../core/models/prayer-time.model';
import { Location } from '../../core/models/location.model';

@Component({
  selector: 'app-prayer-times',
  standalone: true,
  imports: [HeaderComponent, CitySelectorComponent, PrayerCardComponent],
  templateUrl: './prayer-times.page.html',
  styleUrl: './prayer-times.page.css',
})
export class PrayerTimesPage implements OnInit {
  private readonly prayerTimeService = inject(PrayerTimeService);
  private readonly locationService = inject(LocationService);

  protected readonly locations = signal<Location[]>([]);
  protected readonly selectedLocation = signal<Location | null>(null);
  protected readonly prayerTimes = signal<PrayerTime[]>([]);
  protected readonly locationName = signal('');
  protected readonly dateLabel = signal('');
  protected readonly isLoading = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadLocations();
    const saved = this.locationService.getSelectedLocation();
    this.selectedLocation.set(saved);
    this.loadPrayerTimes(saved.id);
  }

  protected onCityChange(location: Location): void {
    this.selectedLocation.set(location);
    this.locationService.setSelectedLocation(location);
    this.loadPrayerTimes(location.id);
  }

  private loadLocations(): void {
    this.locationService.getLocations().subscribe({
      next: (locs) => this.locations.set(locs),
      error: (err) => console.error('Failed to load locations:', err),
    });
  }

  private loadPrayerTimes(locationId: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.prayerTimeService.getTodayPrayerTimes(locationId).subscribe({
      next: ({ prayerTimes, locationName, dateLabel }) => {
        this.prayerTimes.set(prayerTimes);
        this.locationName.set(locationName);
        this.dateLabel.set(dateLabel);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load prayer times:', err);
        this.error.set('Greška pri učitavanju. Pokušajte ponovo.');
        this.isLoading.set(false);
      },
    });
  }
}
