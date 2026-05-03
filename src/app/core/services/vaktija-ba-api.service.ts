import { Injectable, inject, isDevMode } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, timer, throwError } from 'rxjs';
import { retry } from 'rxjs/operators';

/**
 * Production: browser calls api.vaktija.ba directly (must send CORS headers).
 * Development (`ng serve`): same-origin proxy (`proxy.conf.json`) avoids flaky CORS on localhost when the API errors.
 */
const BASE_URL = isDevMode()
  ? '/vaktija-ba-api/vaktija/v1'
  : 'https://api.vaktija.ba/vaktija/v1';

/** Retry transient failures — api.vaktija.ba often returns 503; error bodies usually omit CORS headers so the browser reports both CORS and HTTP errors. */
function vaktijaRetry<T>() {
  return retry<T>({
    count: 3,
    delay: (error: unknown, retryCount: number) => {
      const status = error instanceof HttpErrorResponse ? error.status : 0;
      const retryable =
        status === 0 || status >= 500 || status === 429 || status === 408;
      if (!retryable) return throwError(() => error);
      return timer(Math.min(400 * 2 ** (retryCount - 1), 6000));
    },
  });
}

/**
 * Response shape from the vaktija.ba API.
 * `vakat` array order: [Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha]
 */
export interface VaktijaBaResponse {
  id: number;
  lokacija: string;
  datum: [string, string]; // [hijri (often empty), gregorian]
  vakat: [string, string, string, string, string, string];
}

@Injectable({ providedIn: 'root' })
export class VaktijaBaApiService {
  private readonly http = inject(HttpClient);

  /** Fetch prayer times for a given vaktija.ba city ID on today's date. */
  getTimesToday(cityId: number): Observable<VaktijaBaResponse> {
    return this.http
      .get<VaktijaBaResponse>(`${BASE_URL}/${cityId}`)
      .pipe(vaktijaRetry());
  }

  /** Fetch prayer times for a given vaktija.ba city ID on a specific date. */
  getTimesForDate(cityId: number, date: Date): Observable<VaktijaBaResponse> {
    return this.http
      .get<VaktijaBaResponse>(`${BASE_URL}/${cityId}`, {
        params: {
          d: date.getDate().toString(),
          m: (date.getMonth() + 1).toString(),
          y: date.getFullYear().toString(),
        },
      })
      .pipe(vaktijaRetry());
  }
}
