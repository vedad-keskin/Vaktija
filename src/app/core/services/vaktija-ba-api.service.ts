import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, TimeoutError, timer, throwError } from 'rxjs';
import { retry, timeout } from 'rxjs/operators';
import { VaktijaBaApiResponse } from '../models/prayer-time.model';

const PROXY_BASE = '/api/vaktija-ba';

/** Calendar date parts in Europe/Sarajevo (BiH wall clock). */
export function sarajevoYmd(now = new Date()): { y: number; m: number; d: number } {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Sarajevo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const parts = fmt.formatToParts(now);
  const n = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? NaN);
  return { y: n('year'), m: n('month'), d: n('day') };
}

@Injectable({ providedIn: 'root' })
export class VaktijaBaApiService {
  private readonly http = inject(HttpClient);

  /** Today's times for location id using documented path `/vaktija/v1/:id/:y/:m/:d`. */
  getPrayerTimesForToday(locationId: number): Observable<VaktijaBaApiResponse> {
    const { y, m, d } = sarajevoYmd();
    const url = `${PROXY_BASE}/vaktija/v1/${locationId}/${y}/${m}/${d}`;
    return this.http.get<VaktijaBaApiResponse>(url).pipe(
      timeout(12000),
      retry({
        count: 5,
        delay: (error: unknown, retryCount: number) => {
          if (error instanceof HttpErrorResponse) {
            const s = error.status;
            const retryable =
              s === 0 || s === 503 || s === 502 || s === 504 || s === 429;
            if (!retryable) return throwError(() => error);
          } else if (!(error instanceof TimeoutError)) {
            return throwError(() => error);
          }
          const ms =
            Math.min(1500 * 2 ** (retryCount - 1), 10000) + Math.random() * 400;
          return timer(ms);
        },
      }),
    );
  }
}
