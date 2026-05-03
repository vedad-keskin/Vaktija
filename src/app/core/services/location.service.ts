import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BOSNIA_PRESET_CITIES } from '../constants/bosnia-preset-cities.constants';
import { Location } from '../models/location.model';

const STORAGE_KEY = 'vaktija_selected_location';
const DEFAULT_LOCATION: Location = { name: 'Sarajevo', lat: 43.8486, lng: 18.3564, vaktijaId: 77 };

@Injectable({ providedIn: 'root' })
export class LocationService {
  getLocations(): Observable<Location[]> {
    return of([...BOSNIA_PRESET_CITIES]);
  }

  getSelectedLocation(): Location {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Location;
        if (parsed.name && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
          // Upgrade old stored locations that lack vaktijaId
          if (parsed.vaktijaId === undefined) {
            const preset = BOSNIA_PRESET_CITIES.find(c => c.name === parsed.name);
            if (preset && preset.vaktijaId !== undefined) {
              parsed.vaktijaId = preset.vaktijaId;
            }
          }
          return parsed;
        }
      }
    } catch {
      /* corrupted storage */
    }
    return DEFAULT_LOCATION;
  }

  setSelectedLocation(location: Location): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  }
}
