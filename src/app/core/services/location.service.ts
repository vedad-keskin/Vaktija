import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Location } from '../models/location.model';

const STORAGE_KEY = 'vaktija_selected_location';
const DEFAULT_LOCATION: Location = { name: 'Sarajevo', lat: 43.8486, lng: 18.3564 };

/**
 * Hardcoded list of major Bosnian cities with coordinates
 * for the coordinate-based aladhan.com API.
 */
const BOSNIAN_CITIES: Location[] = [
  { name: 'Sarajevo', lat: 43.8486, lng: 18.3564 },
  { name: 'Mostar', lat: 43.3438, lng: 17.8078 },
  { name: 'Tuzla', lat: 44.5384, lng: 18.6763 },
  { name: 'Zenica', lat: 44.2037, lng: 17.9078 },
  { name: 'Banja Luka', lat: 44.7722, lng: 17.1910 },
  { name: 'Bihać', lat: 44.8169, lng: 15.8697 },
  { name: 'Travnik', lat: 44.2264, lng: 17.6580 },
  { name: 'Goražde', lat: 43.6667, lng: 18.9764 },
  { name: 'Livno', lat: 43.8269, lng: 17.0075 },
  { name: 'Brčko', lat: 44.8726, lng: 18.8109 },
  { name: 'Cazin', lat: 44.9669, lng: 15.9431 },
  { name: 'Visoko', lat: 43.9889, lng: 18.1781 },
  { name: 'Kakanj', lat: 44.1264, lng: 18.1233 },
  { name: 'Gradačac', lat: 44.8814, lng: 18.4278 },
  { name: 'Bugojno', lat: 44.0572, lng: 17.4508 },
  { name: 'Konjic', lat: 43.6517, lng: 17.9606 },
  { name: 'Prijedor', lat: 44.9800, lng: 16.7136 },
  { name: 'Doboj', lat: 44.7319, lng: 18.0853 },
  { name: 'Trebinje', lat: 42.7117, lng: 18.3436 },
  { name: 'Bijeljina', lat: 44.7569, lng: 19.2144 },
];

@Injectable({ providedIn: 'root' })
export class LocationService {
  getLocations(): Observable<Location[]> {
    return of(BOSNIAN_CITIES);
  }

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

  setSelectedLocation(location: Location): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  }
}
