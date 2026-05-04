import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AladhanApiResponse } from '../models/prayer-time.model';
import { CalculationMethod } from './calculation-method.service';

const BASE_URL = 'https://api.aladhan.com/v1/timings';

/**
 * 14.6° Method:
 * Fajr angle 14.6° = prava zora (fecr sadik).
 * Isha angle 14.6°.
 * 
 * IZ Method (vaktija.ba parity):
 * Method 13 (Diyanet) with custom tuned offsets.
 * Imsak,Fajr,Sunrise,Dhuhr,Asr,Maghrib,Sunset,Isha,Midnight
 * tune: 0,0,0,-4,-4,-2,-2,-6,0
 */
const FAJR_ANGLE = 14.6;
const ISHA_ANGLE = 14.6;

@Injectable({ providedIn: 'root' })
export class PrayerApiService {
  private readonly http = inject(HttpClient);

  /**
   * Fetches prayer times for given coordinates on today's date.
   */
  getPrayerTimes(lat: number, lng: number, method: CalculationMethod): Observable<AladhanApiResponse> {
    const today = new Date();
    const date = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

    let params: Record<string, string> = {
      latitude: lat.toString(),
      longitude: lng.toString(),
      timezonestring: 'Europe/Sarajevo',
    };

    if (method === '14.6') {
      params = {
        ...params,
        method: '99',
        methodSettings: `${FAJR_ANGLE},null,${ISHA_ANGLE}`,
        school: '0',         // Shafi (standard)
        midnightMode: '1',   // Jafari: mid Sunset→Fajr
      };
    } else {
      // IZ / Vaktija.ba Parity
      params = {
        ...params,
        method: '13',        // Diyanet İşleri Başkanlığı, Turkey
        school: '0',         // Shafi (standard)
        midnightMode: '0',   // Standard (mid Sunset to Sunrise)
        tune: '0,0,0,-4,-4,-2,-2,-6,0', // Fine-tuned offsets for vaktija.ba parity
      };
    }

    return this.http.get<AladhanApiResponse>(`${BASE_URL}/${date}`, { params });
  }
}
