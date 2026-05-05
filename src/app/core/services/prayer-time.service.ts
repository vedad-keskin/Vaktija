import { Injectable, inject } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';
import { BS_LABELS, EN_LABELS, type AppLabels } from '../i18n';
import { AladhanPrayerApiService } from './aladhan-api.service';
import { VaktijaBaApiService } from './vaktija-ba-api.service';
import { CalculationMethodService } from './calculation-method.service';
import { LanguageService, type LangCode } from './language.service';
import {
  PrayerTimeData,
  AladhanApiResponse,
  VaktijaBaApiResponse,
} from '../models/prayer-time.model';
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

/** vaktija.ba `vakat` indices → canonical keys */
const VAKAT_KEY_MAP = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

/** Cached prayer UI slice for one language */
export interface PrayerTimesLangSnapshot {
  prayerTimes: PrayerTimeData[];
  locationName: string;
  dateLabel: string;
  hijriDate: string;
}

export interface PrayerTimesDualLoadResult {
  snapshots: Record<LangCode, PrayerTimesLangSnapshot>;
}

@Injectable({ providedIn: 'root' })
export class PrayerTimeService {
  private readonly aladhanApi = inject(AladhanPrayerApiService);
  private readonly vaktijaBaApi = inject(VaktijaBaApiService);
  private readonly methodService = inject(CalculationMethodService);
  private readonly langService = inject(LanguageService);

  /**
   * Returns localized snapshots for both languages from one HTTP response.
   * `14.6` → Aladhan; `iz` → api.vaktija.ba (same-origin proxy).
   */
  getTodayPrayerTimes(location: Location): Observable<PrayerTimesDualLoadResult> {
    const method = this.methodService.method();

    if (method === '14.6') {
      return this.aladhanApi.getPrayerTimes(location.lat, location.lng).pipe(
        map((res) => ({
          snapshots: this.dualSnapshotsFromAladhan(res, location.name),
        })),
      );
    }

    const id = location.vaktijaId;
    if (id === undefined || id === null) {
      return throwError(
        () => new Error('Missing vaktija location id for IZ mode'),
      );
    }

    return this.vaktijaBaApi.getPrayerTimesForToday(id).pipe(
      map((res) => ({
        snapshots: this.dualSnapshotsFromVaktija(res, location.name),
      })),
    );
  }

  private dualSnapshotsFromAladhan(
    res: AladhanApiResponse,
    locationName: string,
  ): Record<LangCode, PrayerTimesLangSnapshot> {
    return {
      bs: {
        prayerTimes: this.buildAladhanPrayerTimes(res, BS_LABELS),
        locationName,
        dateLabel: this.buildDateLabelFor(BS_LABELS, 'bs'),
        hijriDate: this.buildHijriDateFor(res, BS_LABELS),
      },
      en: {
        prayerTimes: this.buildAladhanPrayerTimes(res, EN_LABELS),
        locationName,
        dateLabel: this.buildDateLabelFor(EN_LABELS, 'en'),
        hijriDate: this.buildHijriDateFor(res, EN_LABELS),
      },
    };
  }

  private dualSnapshotsFromVaktija(
    res: VaktijaBaApiResponse,
    fallbackLocationName: string,
  ): Record<LangCode, PrayerTimesLangSnapshot> {
    const locationName = res.lokacija?.trim() || fallbackLocationName;
    return {
      bs: {
        prayerTimes: this.buildVaktijaPrayerTimes(res, BS_LABELS),
        locationName,
        dateLabel: this.buildVaktijaDateLabel(res, BS_LABELS, 'bs'),
        hijriDate: '',
      },
      en: {
        prayerTimes: this.buildVaktijaPrayerTimes(res, EN_LABELS),
        locationName,
        dateLabel: this.buildVaktijaDateLabel(res, EN_LABELS, 'en'),
        hijriDate: '',
      },
    };
  }

  /** Build 8 prayer times from Aladhan response (existing logic). */
  private buildAladhanPrayerTimes(res: AladhanApiResponse, labels: AppLabels): PrayerTimeData[] {
    const timings = res.data.timings;
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

  /** Six salat times from vakat[] plus Midnight / Lastthird derived from Maghrib→Fajr night window. */
  private buildVaktijaPrayerTimes(res: VaktijaBaApiResponse, labels: AppLabels): PrayerTimeData[] {
    const vakat = res.vakat;
    if (!Array.isArray(vakat) || vakat.length < 6) {
      throw new Error('Invalid vaktija.ba vakat payload');
    }

    const friday = this.isFridaySarajevo();

    const baseTimes: PrayerTimeData[] = VAKAT_KEY_MAP.map((key, i) => {
      const cleanTime = this.cleanTime(vakat[i]);
      const name =
        key === 'Dhuhr' && friday
          ? labels.dhuhrFridayName
          : labels.prayerNames[key] ?? key;
      const tooltip = labels.prayerTooltips[key];
      return {
        name,
        time: cleanTime,
        minutes: this.timeToMinutes(cleanTime),
        isCalculated: false,
        ...(tooltip ? { tooltip } : {}),
      };
    });

    const fajrMin = this.timeToMinutes(this.cleanTime(vakat[0]));
    const maghribMin = this.timeToMinutes(this.cleanTime(vakat[4]));

    /* Islamic midnight / last-third use night length Maghrib→next Fajr. Same approximation as countdown wrap:
       tomorrow’s Fajr ≈ today’s listed Fajr (single API response). */
    const nightMinutes = 24 * 60 - maghribMin + fajrMin;
    const midnightMin =
      Math.round(maghribMin + nightMinutes / 2) % (24 * 60);
    const lastThirdMin =
      Math.round(maghribMin + (2 * nightMinutes) / 3) % (24 * 60);

    const midnightTime = this.minutesToTime(midnightMin);
    const lastThirdTime = this.minutesToTime(lastThirdMin);

    const midnightEntry: PrayerTimeData = {
      name: labels.prayerNames['Midnight'] ?? 'Midnight',
      time: midnightTime,
      minutes: midnightMin,
      isCalculated: true,
      ...(labels.prayerTooltips['Midnight']
        ? { tooltip: labels.prayerTooltips['Midnight'] }
        : {}),
    };

    const lastThirdEntry: PrayerTimeData = {
      name: labels.prayerNames['Lastthird'] ?? 'Lastthird',
      time: lastThirdTime,
      minutes: lastThirdMin,
      isCalculated: true,
      ...(labels.prayerTooltips['Lastthird']
        ? { tooltip: labels.prayerTooltips['Lastthird'] }
        : {}),
    };

    return [...baseTimes, midnightEntry, lastThirdEntry].sort(
      (a, b) => a.minutes - b.minutes,
    );
  }

  private buildVaktijaDateLabel(
    res: VaktijaBaApiResponse,
    labels: AppLabels,
    lang: LangCode,
  ): string {
    const d = res.datum;
    if (!Array.isArray(d)) return this.buildDateLabelFor(labels, lang);
    const text = d.map(String).find((s) => s.trim().length > 0);
    return text?.trim() ?? this.buildDateLabelFor(labels, lang);
  }

  /** Friday in Europe/Sarajevo (Podne vs Jumu'a label). */
  private isFridaySarajevo(now = new Date()): boolean {
    const wd = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      timeZone: 'Europe/Sarajevo',
    }).format(now);
    return wd.startsWith('Fri');
  }

  /** Aladhan returns English weekday labels on `gregorian.weekday.en`. */
  private isGregorianFriday(res: AladhanApiResponse): boolean {
    const en = res.data.date?.gregorian?.weekday?.en?.toLowerCase()?.trim();
    if (en === 'friday') return true;
    return new Date().getDay() === 5;
  }

  /**
   * Formats today's date using the active language labels.
   * Example BS: "petak, 1. maj 2026."
   * Example EN: "Friday, 1 May 2026"
   */
  buildDateLabel(): string {
    return this.buildDateLabelFor(this.langService.labels(), this.langService.lang());
  }

  private buildDateLabelFor(labels: AppLabels, lang: LangCode): string {
    const now = new Date();
    const day = labels.dayNames[now.getDay()];
    const month = labels.monthNames[now.getMonth()];

    if (lang === 'en') {
      return `${day}, ${now.getDate()} ${month} ${now.getFullYear()}`;
    }
    return `${day}, ${now.getDate()}. ${month} ${now.getFullYear()}.`;
  }

  buildHijriDate(res: AladhanApiResponse): string {
    return this.buildHijriDateFor(res, this.langService.labels());
  }

  private buildHijriDateFor(res: AladhanApiResponse, labels: AppLabels): string {
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
    const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
    const h = Math.floor(normalized / 60);
    const m = normalized % 60;
    return `${h}:${m.toString().padStart(2, '0')}`;
  }
}
