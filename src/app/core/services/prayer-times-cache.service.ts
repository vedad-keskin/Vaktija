import { Injectable } from '@angular/core';
import { PrayerTimeData } from '../models/prayer-time.model';
import { Location } from '../models/location.model';
import type { CalculationMethod } from './calculation-method.service';
import type { LangCode } from './language.service';
import { sarajevoDayKey } from '../utils/sarajevo-date';

const PREFIX_PT = 'vaktija_daily_pt_v1';
const PREFIX_FETCH = 'vaktija_daily_fetch_v1';

/** Persisted prayer UI snapshot for one Sarajevo calendar day + location + method + language. */
export interface PrayerTimesDaySnapshot {
  sarajevoDay: string;
  savedAt?: string;
  prayerTimes: PrayerTimeData[];
  locationName: string;
  dateLabel: string;
  hijriDate: string;
}

@Injectable({ providedIn: 'root' })
export class PrayerTimesCacheService {
  /** Today's snapshot if valid for Sarajevo date and composite key; otherwise null. */
  read(location: Location, method: CalculationMethod, lang: LangCode): PrayerTimesDaySnapshot | null {
    const dayKey = sarajevoDayKey();
    const key = this.cacheKey(PREFIX_PT, dayKey, location, method, lang);
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PrayerTimesDaySnapshot;
      if (
        parsed.sarajevoDay !== dayKey ||
        !Array.isArray(parsed.prayerTimes) ||
        typeof parsed.locationName !== 'string'
      ) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  write(
    location: Location,
    method: CalculationMethod,
    lang: LangCode,
    snapshot: Omit<PrayerTimesDaySnapshot, 'sarajevoDay' | 'savedAt'> &
      Partial<Pick<PrayerTimesDaySnapshot, 'savedAt'>>,
  ): void {
    const dayKey = sarajevoDayKey();
    const key = this.cacheKey(PREFIX_PT, dayKey, location, method, lang);
    const full: PrayerTimesDaySnapshot = {
      sarajevoDay: dayKey,
      savedAt: snapshot.savedAt ?? new Date().toISOString(),
      prayerTimes: snapshot.prayerTimes,
      locationName: snapshot.locationName,
      dateLabel: snapshot.dateLabel,
      hijriDate: snapshot.hijriDate,
    };
    try {
      localStorage.setItem(key, JSON.stringify(full));
      localStorage.setItem(this.cacheKey(PREFIX_FETCH, dayKey, location, method, lang), '1');
    } catch {
      /* quota / private mode */
    }
  }

  /** True if we already completed a successful fetch today for this composite key. */
  hasFetchedToday(location: Location, method: CalculationMethod, lang: LangCode): boolean {
    const dayKey = sarajevoDayKey();
    try {
      return (
        localStorage.getItem(this.cacheKey(PREFIX_FETCH, dayKey, location, method, lang)) === '1'
      );
    } catch {
      return false;
    }
  }

  /** Drop orphaned fetch gate (e.g. user cleared snapshot only). */
  clearFetchGate(location: Location, method: CalculationMethod, lang: LangCode): void {
    const dayKey = sarajevoDayKey();
    try {
      localStorage.removeItem(this.cacheKey(PREFIX_FETCH, dayKey, location, method, lang));
    } catch {
      /* ignore */
    }
  }

  /**
   * Removes prayer-time cache entries not tied to today's Sarajevo date (limits stale keys).
   */
  pruneStale(): void {
    const today = sarajevoDayKey();
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) keys.push(k);
      }
      for (const k of keys) {
        if (
          !(k.startsWith(`${PREFIX_PT}|`) || k.startsWith(`${PREFIX_FETCH}|`))
        ) {
          continue;
        }
        const parts = k.split('|');
        if (parts.length < 5) continue;
        const day = parts[1];
        if (day !== today) {
          localStorage.removeItem(k);
        }
      }
    } catch {
      /* ignore */
    }
  }

  private cacheKey(
    prefix: string,
    dayKey: string,
    location: Location,
    method: CalculationMethod,
    lang: LangCode,
  ): string {
    const locSeg =
      typeof location.vaktijaId === 'number'
        ? String(location.vaktijaId)
        : `${location.lat.toFixed(5)},${location.lng.toFixed(5)}`;
    return `${prefix}|${dayKey}|${locSeg}|${method}|${lang}`;
  }
}
