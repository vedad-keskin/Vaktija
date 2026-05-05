import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AladhanApiResponse } from '../models/prayer-time.model';

const BASE_URL = 'https://api.aladhan.com/v1/timings';

/**
 * 14.6° Method:
 * Fajr angle 14.6° = prava zora (fecr sadik).
 * Isha angle 14.6°.
 *
 * IZ / vaktija.ba authority uses `VaktijaBaApiService` instead.
 */
const FAJR_ANGLE = 14.6;
const ISHA_ANGLE = 14.6;

@Injectable({ providedIn: 'root' })
export class AladhanPrayerApiService {
  private readonly http = inject(HttpClient);

  /**
   * Fetches prayer times for given coordinates on today's date (14.6° method).
   */
  getPrayerTimes(lat: number, lng: number): Observable<AladhanApiResponse> {
    const today = new Date();
    const date = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

    const params: Record<string, string> = {
      latitude: lat.toString(),
      longitude: lng.toString(),
      timezonestring: 'Europe/Sarajevo',
      method: '99',
      methodSettings: `${FAJR_ANGLE},null,${ISHA_ANGLE}`,
      school: '0',
      midnightMode: '1',
    };

    return this.http.get<AladhanApiResponse>(`${BASE_URL}/${date}`, { params });
  }
}
