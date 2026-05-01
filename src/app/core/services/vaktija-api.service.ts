import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AladhanApiResponse } from '../models/prayer-time.model';

const BASE_URL = 'https://api.aladhan.com/v1/timings';

/**
 * Fajr angle 14.6° = prava zora (fecr sadik), as used by vaktija.dev
 * and consistent with observed true dawn at Balkan latitudes.
 * 18° = astronomical twilight = too early (closer to lažna zora / fecr kazib).
 */
const FAJR_ANGLE = 14.6;
const ISHA_ANGLE = 14.6;

@Injectable({ providedIn: 'root' })
export class PrayerApiService {
  private readonly http = inject(HttpClient);

  /**
   * Fetches prayer times for given coordinates on today's date.
   *
   * Configuration:
   * - method=99 (custom) with Fajr=14.6°, Isha=14.6° → prava zora
   * - school=0 (Shafi/standard Asr)
   * - midnightMode=1 (Jafari: mid Sunset→Fajr = šerijatska polovina noći)
   */
  getPrayerTimes(lat: number, lng: number): Observable<AladhanApiResponse> {
    const today = new Date();
    const date = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

    return this.http.get<AladhanApiResponse>(`${BASE_URL}/${date}`, {
      params: {
        latitude: lat.toString(),
        longitude: lng.toString(),
        method: '99',
        methodSettings: `${FAJR_ANGLE},null,${ISHA_ANGLE}`,
        school: '0',         // Shafi (standard)
        midnightMode: '1',   // Jafari: mid Sunset→Fajr
        timezonestring: 'Europe/Sarajevo',
      },
    });
  }
}
