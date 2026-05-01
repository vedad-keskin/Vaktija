import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { VaktijaApiService } from './vaktija-api.service';
import { PrayerTime, VaktijaApiResponse } from '../models/prayer-time.model';
import { PRAYER_NAMES, CALCULATED_NAMES } from '../constants/prayer-names.constant';

@Injectable({ providedIn: 'root' })
export class PrayerTimeService {
  private readonly api = inject(VaktijaApiService);

  /**
   * Returns all 8 prayer times for today, sorted chronologically.
   * Fetches both today and tomorrow to precisely calculate night-based times.
   */
  getTodayPrayerTimes(locationId: number): Observable<{
    prayerTimes: PrayerTime[];
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
      map(({ today, tomorrow }) => {
        const prayerTimes = this.buildPrayerTimes(today, tomorrow);
        return {
          prayerTimes,
          locationName: today.lokacija,
          dateLabel: today.datum[1],
        };
      })
    );
  }

  /**
   * Builds the full list of 8 prayer times from today's and tomorrow's API data.
   */
  private buildPrayerTimes(
    today: VaktijaApiResponse,
    tomorrow: VaktijaApiResponse
  ): PrayerTime[] {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Parse the 6 standard times from today's API response
    const standardTimes: PrayerTime[] = today.vakat.map((timeStr, index) => ({
      name: PRAYER_NAMES[index],
      time: timeStr,
      minutes: this.timeToMinutes(timeStr),
      isCalculated: false,
      isActive: false,
      isPassed: false,
    }));

    // Calculate the two extra times using tomorrow's Zora for precision
    const jacijaMinutes = this.timeToMinutes(today.vakat[5]);
    const tomorrowZoraMinutes = this.timeToMinutes(tomorrow.vakat[0]);

    // Night duration spans midnight: from Jacija tonight to Zora tomorrow
    const nightDuration = (24 * 60 - jacijaMinutes) + tomorrowZoraMinutes;

    // Zadnja trećina noći: last third of the night
    const zadnjaTrecinaMinutes = (jacijaMinutes + Math.floor((2 / 3) * nightDuration)) % (24 * 60);
    const zadnjaTrecina: PrayerTime = {
      name: CALCULATED_NAMES.ZADNJA_TRECINA_NOCI,
      time: this.minutesToTime(zadnjaTrecinaMinutes),
      minutes: zadnjaTrecinaMinutes,
      isCalculated: true,
      isActive: false,
      isPassed: false,
    };

    // Kraj jacije: midpoint of the night (half night)
    const krajJacijeMinutes = (jacijaMinutes + Math.floor(nightDuration / 2)) % (24 * 60);
    const krajJacije: PrayerTime = {
      name: CALCULATED_NAMES.KRAJ_JACIJE,
      time: this.minutesToTime(krajJacijeMinutes),
      minutes: krajJacijeMinutes,
      isCalculated: true,
      isActive: false,
      isPassed: false,
    };

    // Combine all 8 times
    const allTimes = [...standardTimes, zadnjaTrecina, krajJacije];

    // Sort chronologically: times after Jacija (night times) should come after daytime times.
    // We use a smart sort that keeps the natural daily order starting from Zora.
    allTimes.sort((a, b) => {
      const aOrder = this.getSortOrder(a.minutes, jacijaMinutes);
      const bOrder = this.getSortOrder(b.minutes, jacijaMinutes);
      return aOrder - bOrder;
    });

    // Mark passed and active
    this.markActiveAndPassed(allTimes, currentMinutes);

    return allTimes;
  }

  /**
   * Creates a sort order that keeps times in the natural daily cycle:
   * Early morning times (before sunrise) through to late night (after Jacija).
   * Times after midnight (small minute values that are post-Jacija calculated times)
   * should sort AFTER Jacija.
   */
  private getSortOrder(minutes: number, jacijaMinutes: number): number {
    // If the time is in the small hours (before Zora) and clearly a night-time,
    // push it to after Jacija in sort order
    if (minutes < jacijaMinutes / 2) {
      return minutes + 24 * 60;
    }
    return minutes;
  }

  /**
   * Marks prayer times as passed or active based on the current time.
   */
  private markActiveAndPassed(times: PrayerTime[], currentMinutes: number): void {
    let activeSet = false;

    // Adjust current minutes for post-midnight comparison
    const adjustedCurrent = currentMinutes;

    for (let i = 0; i < times.length; i++) {
      const adjustedTime = times[i].minutes < times[0].minutes
        ? times[i].minutes + 24 * 60
        : times[i].minutes;

      const adjustedNow = adjustedCurrent < times[0].minutes
        ? adjustedCurrent + 24 * 60
        : adjustedCurrent;

      if (!activeSet && adjustedTime > adjustedNow) {
        times[i].isActive = true;
        activeSet = true;
      } else if (!activeSet) {
        times[i].isPassed = true;
      }
    }
  }

  /**
   * Converts "HH:mm" or "H:mm" string to total minutes from midnight.
   */
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Converts total minutes from midnight to "HH:mm" string.
   */
  private minutesToTime(totalMinutes: number): string {
    const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
    const hours = Math.floor(normalized / 60);
    const minutes = normalized % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }
}
