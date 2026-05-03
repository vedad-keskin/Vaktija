import { Injectable, inject } from '@angular/core';
import { Observable, map, forkJoin } from 'rxjs';
import { PrayerApiService } from './vaktija-api.service';
import { VaktijaBaApiService, VaktijaBaResponse } from './vaktija-ba-api.service';
import { CalculationMethodService } from './calculation-method.service';
import { LanguageService } from './language.service';
import { PrayerTimeData, AladhanApiResponse } from '../models/prayer-time.model';
import { Location } from '../models/location.model';

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

/** vaktija.ba vakat array indices → Aladhan-style keys */
const VAKAT_KEY_MAP: string[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

@Injectable({ providedIn: 'root' })
export class PrayerTimeService {
  private readonly aladhanApi = inject(PrayerApiService);
  private readonly vaktijaApi = inject(VaktijaBaApiService);
  private readonly methodService = inject(CalculationMethodService);
  private readonly langService = inject(LanguageService);

  /**
   * Returns all 8 prayer times for today, sorted chronologically.
   * Dispatches to either Aladhan (14.6°) or vaktija.ba (IZ) based on the active method.
   * Always uses Aladhan for date info (Hijri, weekday).
   */
  getTodayPrayerTimes(location: Location): Observable<{
    prayerTimes: PrayerTimeData[];
    locationName: string;
    dateLabel: string;
    hijriDate: string;
  }> {
    const method = this.methodService.method();

    if (method === 'iz' && location.vaktijaId != null) {
      return this.getIzTimes(location);
    }
    return this.getAladhanTimes(location);
  }

  /** 14.6° method — current behaviour via Aladhan API */
  private getAladhanTimes(location: Location): Observable<{
    prayerTimes: PrayerTimeData[];
    locationName: string;
    dateLabel: string;
    hijriDate: string;
  }> {
    return this.aladhanApi.getPrayerTimes(location.lat, location.lng).pipe(
      map((res) => ({
        prayerTimes: this.buildAladhanPrayerTimes(res),
        locationName: location.name,
        dateLabel: this.buildDateLabel(),
        hijriDate: this.buildHijriDate(res),
      }))
    );
  }

  /**
   * IZ method — fetches today + tomorrow from vaktija.ba, plus Aladhan for Hijri date.
   * Tomorrow's Fajr is needed for accurate Midnight / Last Third calculation.
   */
  private getIzTimes(location: Location): Observable<{
    prayerTimes: PrayerTimeData[];
    locationName: string;
    dateLabel: string;
    hijriDate: string;
  }> {
    const cityId = location.vaktijaId!;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return forkJoin({
      today: this.vaktijaApi.getTimesToday(cityId),
      tomorrow: this.vaktijaApi.getTimesForDate(cityId, tomorrow),
      aladhan: this.aladhanApi.getPrayerTimes(location.lat, location.lng),
    }).pipe(
      map(({ today, tomorrow: tmrw, aladhan }) => ({
        prayerTimes: this.buildIzPrayerTimes(today, tmrw),
        locationName: location.name,
        dateLabel: this.buildDateLabel(),
        hijriDate: this.buildHijriDate(aladhan),
      }))
    );
  }

  /** Build 8 prayer times from Aladhan response (existing logic). */
  private buildAladhanPrayerTimes(res: AladhanApiResponse): PrayerTimeData[] {
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

  /**
   * Build 8 prayer times from vaktija.ba today + tomorrow responses.
   * Computes Midnight and Last Third locally:
   *   Midnight  = Maghrib + (nextFajr − Maghrib) / 2
   *   LastThird = Maghrib + 2 × (nextFajr − Maghrib) / 3
   */
  private buildIzPrayerTimes(today: VaktijaBaResponse, tomorrow: VaktijaBaResponse): PrayerTimeData[] {
    const labels = this.langService.labels();
    const isFriday = new Date().getDay() === 5;

    // Map the 6 vakat values to keyed timings
    const timings: Record<string, string> = {};
    today.vakat.forEach((time, i) => {
      timings[VAKAT_KEY_MAP[i]] = time;
    });

    // Calculate Midnight and Last Third using tomorrow's Fajr
    const maghribMin = this.timeToMinutes(timings['Maghrib']);
    const tomorrowFajrMin = this.timeToMinutes(tomorrow.vakat[0]) + 24 * 60; // next day
    const nightDuration = tomorrowFajrMin - maghribMin;

    const midnightMin = maghribMin + Math.round(nightDuration / 2);
    const lastThirdMin = maghribMin + Math.round((2 * nightDuration) / 3);

    // Normalise to 24h (wraps past midnight)
    timings['Midnight'] = this.minutesToTime(midnightMin % (24 * 60));
    timings['Lastthird'] = this.minutesToTime(lastThirdMin % (24 * 60));

    const times: PrayerTimeData[] = TIMING_KEYS.map((entry) => {
      const cleanTime = timings[entry.key] ?? '00:00';
      const name =
        entry.key === 'Dhuhr' && isFriday
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

  private minutesToTime(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}:${m.toString().padStart(2, '0')}`;
  }
}
