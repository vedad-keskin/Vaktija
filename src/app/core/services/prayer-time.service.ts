import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PrayerApiService } from './vaktija-api.service';
import { LanguageService } from './language.service';
import { PrayerTimeData, AladhanApiResponse } from '../models/prayer-time.model';

/** Keys for the 8 prayer/timing entries we display */
const TIMING_KEYS: { key: string; isCalculated: boolean }[] = [
  { key: 'Fajr', isCalculated: false },
  { key: 'Sunrise', isCalculated: false },
  { key: 'Dhuhr', isCalculated: false },
  { key: 'Asr', isCalculated: false },
  { key: 'Maghrib', isCalculated: false },
  { key: 'Isha', isCalculated: false },
  { key: 'Midnight', isCalculated: true },
  { key: 'Lastthird', isCalculated: true },
];

@Injectable({ providedIn: 'root' })
export class PrayerTimeService {
  private readonly api = inject(PrayerApiService);
  private readonly langService = inject(LanguageService);

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
    const labels = this.langService.labels();
    const fridayGregorian = this.isGregorianFriday(res);

    const times: PrayerTimeData[] = TIMING_KEYS.map((entry) => {
      const rawTime = timings[entry.key] ?? '00:00';
      const cleanTime = this.cleanTime(rawTime);
      const name =
        entry.key === 'Dhuhr' && fridayGregorian
          ? labels.dhuhrFridayName
          : labels.prayerNames[entry.key] ?? entry.key;
      const tooltip = labels.prayerTooltips[entry.key];
      return {
        name,
        time: cleanTime,
        minutes: this.timeToMinutes(cleanTime),
        isCalculated: entry.isCalculated,
        ...(tooltip ? { tooltip } : {}),
      };
    });

    return times.sort((a, b) => a.minutes - b.minutes);
  }

  /** Aladhan returns English weekday labels on `gregorian.weekday.en`. */
  private isGregorianFriday(res: AladhanApiResponse): boolean {
    const en = res.data.date?.gregorian?.weekday?.en?.toLowerCase()?.trim();
    if (en === 'friday') return true;
    // Fallback if API shape changes
    return new Date().getDay() === 5;
  }

  /**
   * Formats today's date using the active language labels.
   * Example BS: "petak, 1. maj 2026."
   * Example EN: "Friday, 1 May 2026"
   */
  buildDateLabel(): string {
    const labels = this.langService.labels();
    const now = new Date();
    const day = labels.dayNames[now.getDay()];
    const month = labels.monthNames[now.getMonth()];
    const lang = this.langService.lang();

    if (lang === 'en') {
      return `${day}, ${now.getDate()} ${month} ${now.getFullYear()}`;
    }
    return `${day}, ${now.getDate()}. ${month} ${now.getFullYear()}.`;
  }

  buildHijriDate(res: AladhanApiResponse): string {
    const labels = this.langService.labels();
    const h = res.data.date.hijri;
    const monthName = labels.hijriMonths[h.month.number - 1] ?? h.month.en;
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
