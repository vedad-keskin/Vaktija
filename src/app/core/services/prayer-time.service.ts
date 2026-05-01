import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PrayerApiService } from './vaktija-api.service';
import { PrayerTimeData, AladhanApiResponse } from '../models/prayer-time.model';
import { TIMING_DISPLAY_MAP, PRAYER_TOOLTIPS, HIJRI_MONTHS } from '../constants/prayer-names.constant';

@Injectable({ providedIn: 'root' })
export class PrayerTimeService {
  private readonly api = inject(PrayerApiService);

  /**
   * Returns all 8 prayer times for today, sorted chronologically.
   * Aladhan API with custom method (14.6° = prava zora) provides
   * Fajr, Midnight, and Lastthird directly.
   */
  getTodayPrayerTimes(lat: number, lng: number, cityName: string): Observable<{
    prayerTimes: PrayerTimeData[];
    locationName: string;
    dateLabel: string;
    hijriDate: string;
  }> {
    return this.api.getPrayerTimes(lat, lng).pipe(
      map((res) => ({
        prayerTimes: this.buildPrayerTimes(res),
        locationName: cityName,
        dateLabel: this.buildDateLabel(),
        hijriDate: this.buildHijriDate(res),
      }))
    );
  }

  private buildPrayerTimes(res: AladhanApiResponse): PrayerTimeData[] {
    const timings = res.data.timings;

    const times: PrayerTimeData[] = TIMING_DISPLAY_MAP.map((entry) => {
      const rawTime = timings[entry.key] ?? '00:00';
      const cleanTime = this.cleanTime(rawTime);
      return {
        name: entry.name,
        time: cleanTime,
        minutes: this.timeToMinutes(cleanTime),
        isCalculated: entry.isCalculated,
        ...(PRAYER_TOOLTIPS[entry.name] ? { tooltip: PRAYER_TOOLTIPS[entry.name] } : {}),
      };
    });

    return times.sort((a, b) => a.minutes - b.minutes);
  }

  private static readonly BOSNIAN_DAYS = [
    'nedjelja', 'ponedjeljak', 'utorak', 'srijeda',
    'četvrtak', 'petak', 'subota',
  ];

  private static readonly BOSNIAN_MONTHS = [
    'januar', 'februar', 'mart', 'april', 'maj', 'juni',
    'juli', 'august', 'septembar', 'oktobar', 'novembar', 'decembar',
  ];

  /**
   * Formats today's date in Bosnian (e.g. "petak, 1. maj 2026").
   * Uses explicit Bosnian names since Intl('bs-Latn-BA') isn't
   * reliably available on all platforms.
   */
  private buildDateLabel(): string {
    const now = new Date();
    const day = PrayerTimeService.BOSNIAN_DAYS[now.getDay()];
    const month = PrayerTimeService.BOSNIAN_MONTHS[now.getMonth()];
    return `${day}, ${now.getDate()}. ${month} ${now.getFullYear()}.`;
  }

  private buildHijriDate(res: AladhanApiResponse): string {
    const h = res.data.date.hijri;
    const monthName = HIJRI_MONTHS[h.month.number - 1] ?? h.month.en;
    return `${h.day}. ${monthName} ${h.year}.`;
  }

  private cleanTime(raw: string): string {
    return raw.replace(/\s*\(.*\)$/, '').trim();
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
