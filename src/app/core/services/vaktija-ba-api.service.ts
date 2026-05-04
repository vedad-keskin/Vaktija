import { Injectable, inject, isDevMode } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, timer, throwError } from 'rxjs';
import { retry } from 'rxjs/operators';

/**
 * Development (`ng serve`): dev-server proxy → api.vaktija.ba (`proxy.conf.json`).
 * Production (Vercel): same-origin `/api/vaktija/...` serverless proxy — avoids CORS on upstream 503 and edge-caches responses.
 */
const BASE_URL = isDevMode()
  ? '/vaktija-ba-api/vaktija/v1'
  : '/api/vaktija/vaktija/v1';

/** Retry transient failures (network blips; proxy handles most upstream retries). */
function vaktijaRetry<T>() {
  return retry<T>({
    count: 4,
    delay: (error: unknown, retryCount: number) => {
      const status = error instanceof HttpErrorResponse ? error.status : 0;
      const retryable =
        status === 0 || status >= 500 || status === 429 || status === 408;
      if (!retryable) return throwError(() => error);
      return timer(Math.min(800 * 2 ** (retryCount - 1), 6000));
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
