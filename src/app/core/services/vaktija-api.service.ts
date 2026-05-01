import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VaktijaApiResponse } from '../models/prayer-time.model';

const BASE_URL = 'https://api.vaktija.ba/vaktija/v1';

@Injectable({ providedIn: 'root' })
export class VaktijaApiService {
  private readonly http = inject(HttpClient);

  /**
   * Fetches the list of all available location names.
   * The array index corresponds to the location ID used in other endpoints.
   */
  getLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${BASE_URL}/lokacije`);
  }

  /**
   * Fetches today's prayer times for the given location ID.
   */
  getPrayerTimes(locationId: number): Observable<VaktijaApiResponse> {
    return this.http.get<VaktijaApiResponse>(`${BASE_URL}/${locationId}`);
  }

  /**
   * Fetches prayer times for a specific date and location.
   * @param locationId - The location index from the lokacije array.
   * @param year - Full year (e.g. 2026)
   * @param month - Month (1-12)
   * @param day - Day of month (1-31)
   */
  getPrayerTimesForDate(
    locationId: number,
    year: number,
    month: number,
    day: number
  ): Observable<VaktijaApiResponse> {
    return this.http.get<VaktijaApiResponse>(
      `${BASE_URL}/${locationId}/${year}/${month}/${day}`
    );
  }
}
