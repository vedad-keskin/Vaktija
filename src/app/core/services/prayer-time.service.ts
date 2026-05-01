import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { VaktijaApiService } from './vaktija-api.service';
import { PrayerTimeData, VaktijaApiResponse } from '../models/prayer-time.model';
import { PRAYER_NAMES, CALCULATED_NAMES, CALCULATED_TOOLTIPS, PRAYER_TOOLTIPS } from '../constants/prayer-names.constant';

@Injectable({ providedIn: 'root' })
export class PrayerTimeService {
  private readonly api = inject(VaktijaApiService);

  /**
   * Returns all 8 prayer times for today, sorted chronologically by minutes.
   * Fetches both today and tomorrow for precise night calculations.
   */
  getTodayPrayerTimes(locationId: number): Observable<{
    prayerTimes: PrayerTimeData[];
    locationName: string;
    dateLabel: string;
  }> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return forkJoin({
      today: this.api.getPrayerTimes(locationId),
      tomorrow: this.api.getPrayerTimesForDate(
        locationId,
        tomorrow.getFullYear(),
        tomorrow.getMonth() + 1,
        tomorrow.getDate()
      ),
    }).pipe(
      map(({ today, tomorrow }) => ({
        prayerTimes: this.buildPrayerTimes(today, tomorrow),
        locationName: today.lokacija,
        dateLabel: today.datum[1],
      }))
    );
  }

  private buildPrayerTimes(
    today: VaktijaApiResponse,
    tomorrow: VaktijaApiResponse
  ): PrayerTimeData[] {
    // Map 6 standard times, attaching tooltips from PRAYER_TOOLTIPS if available
    const standardTimes: PrayerTimeData[] = today.vakat.map((timeStr, index) => {
      const name = PRAYER_NAMES[index];
      return {
        name,
        time: timeStr,
        minutes: this.timeToMinutes(timeStr),
        isCalculated: false,
        ...(PRAYER_TOOLTIPS[name] ? { tooltip: PRAYER_TOOLTIPS[name] } : {}),
      };
    });

    // Night = akšam (sunset) → tomorrow's prava zora (true dawn / Fajr)
    // This is the correct Islamic definition of "night" (layl)
    const aksamMinutes = this.timeToMinutes(today.vakat[4]);
    const tomorrowZoraMinutes = this.timeToMinutes(tomorrow.vakat[0]);
    const nightDuration = (24 * 60 - aksamMinutes) + tomorrowZoraMinutes;

    const krajJacijeMin = (aksamMinutes + Math.floor(nightDuration / 2)) % (24 * 60);
    const zadnjaTrecinaMin = (aksamMinutes + Math.floor((2 / 3) * nightDuration)) % (24 * 60);

    const calculated: PrayerTimeData[] = [
      {
        name: CALCULATED_NAMES.KRAJ_JACIJE,
        time: this.minutesToTime(krajJacijeMin),
        minutes: krajJacijeMin,
        isCalculated: true,
        tooltip: CALCULATED_TOOLTIPS.KRAJ_JACIJE,
      },
      {
        name: CALCULATED_NAMES.ZADNJA_TRECINA_NOCI,
        time: this.minutesToTime(zadnjaTrecinaMin),
        minutes: zadnjaTrecinaMin,
        isCalculated: true,
        tooltip: CALCULATED_TOOLTIPS.ZADNJA_TRECINA_NOCI,
      },
    ];

    // Sort all 8 times by minutes ascending (chronological from midnight)
    return [...standardTimes, ...calculated].sort((a, b) => a.minutes - b.minutes);
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(totalMinutes: number): string {
    const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
    const hours = Math.floor(normalized / 60);
    const minutes = normalized % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }
}
