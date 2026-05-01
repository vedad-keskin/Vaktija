import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { VaktijaApiService } from './vaktija-api.service';
import { Location } from '../models/location.model';

const STORAGE_KEY = 'vaktija_selected_location';
const DEFAULT_LOCATION: Location = { id: 77, name: 'Sarajevo' };

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly api = inject(VaktijaApiService);

  /**
   * Fetches all locations and maps them to Location objects.
   * The array index from the API becomes the location ID.
   */
  getLocations(): Observable<Location[]> {
    return this.api.getLocations().pipe(
      map((names) =>
        names.map((name, index) => ({ id: index, name }))
      )
    );
  }

  /**
   * Returns the currently selected location from localStorage.
   * Falls back to Sarajevo if nothing is saved.
   */
  getSelectedLocation(): Location {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as Location;
      }
    } catch {
      // Corrupted storage — fall back to default
    }
    return DEFAULT_LOCATION;
  }

  /**
   * Persists the selected location to localStorage.
   */
  setSelectedLocation(location: Location): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  }
}
