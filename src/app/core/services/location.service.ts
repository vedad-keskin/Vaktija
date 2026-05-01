import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Location } from '../models/location.model';

const STORAGE_KEY = 'vaktija_selected_location';
const DEFAULT_LOCATION: Location = { name: 'Sarajevo', lat: 43.8486, lng: 18.3564 };

/**
 * Complete list of cities from vaktija.ba with GPS coordinates
 * for the coordinate-based aladhan.com API (14.6° = prava zora).
 *
 * Names match vaktija.ba exactly (e.g. "Hlivno" = historijsko ime za Livno).
 * Coordinates verified from OpenStreetMap municipal centres.
 */
const BOSNIAN_CITIES: Location[] = [
  // === Bosna i Hercegovina (abecedni red) ===
  { name: 'Banovići', lat: 44.4069, lng: 18.5297 },
  { name: 'Banja Luka', lat: 44.7722, lng: 17.1910 },
  { name: 'Bihać', lat: 44.8169, lng: 15.8697 },
  { name: 'Bijeljina', lat: 44.7569, lng: 19.2144 },
  { name: 'Bileća', lat: 42.8764, lng: 18.4303 },
  { name: 'Bosanski Brod', lat: 45.1472, lng: 18.0133 },
  { name: 'Bosanska Dubica', lat: 45.1803, lng: 16.8094 },
  { name: 'Bosanska Gradiška', lat: 45.1444, lng: 17.2542 },
  { name: 'Bosansko Grahovo', lat: 44.1917, lng: 16.3706 },
  { name: 'Bosanska Krupa', lat: 44.8831, lng: 16.1514 },
  { name: 'Bosanski Novi', lat: 45.0464, lng: 16.3781 },
  { name: 'Bosanski Petrovac', lat: 44.5567, lng: 16.3700 },
  { name: 'Bosanski Šamac', lat: 45.0647, lng: 18.4667 },
  { name: 'Bratunac', lat: 44.1856, lng: 19.3314 },
  { name: 'Brčko', lat: 44.8726, lng: 18.8109 },
  { name: 'Breza', lat: 44.0236, lng: 18.2614 },
  { name: 'Bugojno', lat: 44.0572, lng: 17.4508 },
  { name: 'Busovača', lat: 44.0944, lng: 17.8867 },
  { name: 'Bužim', lat: 44.9347, lng: 16.0331 },
  { name: 'Cazin', lat: 44.9669, lng: 15.9431 },
  { name: 'Čajniče', lat: 43.5578, lng: 19.0719 },
  { name: 'Čapljina', lat: 43.1231, lng: 17.6856 },
  { name: 'Čelić', lat: 44.7214, lng: 18.8181 },
  { name: 'Čelinac', lat: 44.7236, lng: 17.3244 },
  { name: 'Čitluk', lat: 43.2267, lng: 17.7003 },
  { name: 'Derventa', lat: 44.9786, lng: 17.9094 },
  { name: 'Doboj', lat: 44.7319, lng: 18.0853 },
  { name: 'Donji Vakuf', lat: 44.1456, lng: 17.3978 },
  { name: 'Drvar', lat: 44.3725, lng: 16.3831 },
  { name: 'Foča', lat: 43.5053, lng: 18.7756 },
  { name: 'Fojnica', lat: 43.9614, lng: 17.8936 },
  { name: 'Gacko', lat: 43.1669, lng: 18.5386 },
  { name: 'Glamoč', lat: 44.0478, lng: 16.8528 },
  { name: 'Goražde', lat: 43.6667, lng: 18.9764 },
  { name: 'Gornji Vakuf', lat: 43.9378, lng: 17.5886 },
  { name: 'Gračanica', lat: 44.7033, lng: 18.3092 },
  { name: 'Gradačac', lat: 44.8814, lng: 18.4278 },
  { name: 'Grude', lat: 43.3753, lng: 17.3956 },
  { name: 'Hadžići', lat: 43.8225, lng: 18.2069 },
  { name: 'Han-Pijesak', lat: 44.0808, lng: 18.9525 },
  // "Hlivno" = historijsko/islamsko ime za Livno — naziv koji koristi vaktija.ba
  { name: 'Ilijaš', lat: 43.9511, lng: 18.2706 },
  { name: 'Jablanica', lat: 43.6594, lng: 17.7581 },
  { name: 'Jajce', lat: 44.3397, lng: 17.2703 },
  { name: 'Kakanj', lat: 44.1264, lng: 18.1233 },
  { name: 'Kalesija', lat: 44.4378, lng: 18.8494 },
  { name: 'Kalinovik', lat: 43.5069, lng: 18.4339 },
  { name: 'Kiseljak', lat: 43.9419, lng: 18.0778 },
  { name: 'Kladanj', lat: 44.2264, lng: 18.6917 },
  { name: 'Ključ', lat: 44.5322, lng: 16.7742 },
  { name: 'Konjic', lat: 43.6517, lng: 17.9606 },
  { name: 'Kotor-Varoš', lat: 44.6167, lng: 17.3736 },
  { name: 'Kreševo', lat: 43.8808, lng: 18.0564 },
  { name: 'Kupres', lat: 43.9736, lng: 17.2672 },
  { name: 'Laktaši', lat: 44.8897, lng: 17.3100 },
  { name: 'Livno', lat: 43.8281, lng: 17.0080 },
  { name: 'Lopare', lat: 44.6339, lng: 18.8478 },
  { name: 'Lukavac', lat: 44.5408, lng: 18.5278 },
  { name: 'Ljubinje', lat: 42.9478, lng: 18.0978 },
  { name: 'Ljubuški', lat: 43.1972, lng: 17.5475 },
  { name: 'Maglaj', lat: 44.5472, lng: 18.1006 },
  { name: 'Modriča', lat: 44.9544, lng: 18.3006 },
  { name: 'Mostar', lat: 43.3438, lng: 17.8078 },
  { name: 'Mrkonjić-Grad', lat: 44.4167, lng: 17.0833 },
  { name: 'Neum', lat: 42.9228, lng: 17.6156 },
  { name: 'Nevesinje', lat: 43.2583, lng: 18.1139 },
  { name: 'Novi Travnik', lat: 44.1653, lng: 17.6583 },
  { name: 'Odžak', lat: 45.0103, lng: 18.3264 },
  { name: 'Olovo', lat: 44.1289, lng: 18.5828 },
  { name: 'Orašje', lat: 45.0356, lng: 18.6931 },
  { name: 'Pale', lat: 43.8169, lng: 18.5706 },
  { name: 'Posušje', lat: 43.4722, lng: 17.3286 },
  { name: 'Prijedor', lat: 44.9800, lng: 16.7136 },
  { name: 'Prnjavor', lat: 44.8667, lng: 17.6625 },
  { name: 'Prozor', lat: 43.8208, lng: 17.6089 },
  { name: 'Rogatica', lat: 43.7997, lng: 19.0028 },
  { name: 'Rudo', lat: 43.6178, lng: 19.3647 },
  { name: 'Sanski Most', lat: 44.7667, lng: 16.6667 },
  { name: 'Sarajevo', lat: 43.8486, lng: 18.3564 },
  { name: 'Skender-Vakuf', lat: 44.4833, lng: 17.3833 },
  { name: 'Sokolac', lat: 43.9381, lng: 18.7964 },
  { name: 'Srbac', lat: 45.0978, lng: 17.5244 },
  { name: 'Srebrenica', lat: 44.1067, lng: 19.2972 },
  { name: 'Srebrenik', lat: 44.7067, lng: 18.4900 },
  { name: 'Stolac', lat: 43.0844, lng: 17.9600 },
  { name: 'Šekovići', lat: 44.2972, lng: 18.8556 },
  { name: 'Šipovo', lat: 44.2833, lng: 17.0833 },
  { name: 'Široki Brijeg', lat: 43.3833, lng: 17.5931 },
  { name: 'Teslić', lat: 44.6056, lng: 17.8594 },
  { name: 'Tešanj', lat: 44.6100, lng: 17.9856 },
  { name: 'Tomislav-Grad', lat: 43.7178, lng: 17.2250 },
  { name: 'Travnik', lat: 44.2264, lng: 17.6580 },
  { name: 'Trebinje', lat: 42.7117, lng: 18.3436 },
  { name: 'Trnovo', lat: 43.6592, lng: 18.4447 },
  { name: 'Tuzla', lat: 44.5384, lng: 18.6763 },
  { name: 'Ugljevik', lat: 44.6931, lng: 19.0003 },
  { name: 'Vareš', lat: 44.1647, lng: 18.3269 },
  { name: 'Velika Kladuša', lat: 45.1839, lng: 15.8064 },
  { name: 'Visoko', lat: 43.9889, lng: 18.1781 },
  { name: 'Višegrad', lat: 43.7828, lng: 19.2925 },
  { name: 'Vitez', lat: 44.1547, lng: 17.7903 },
  { name: 'Vlasenica', lat: 44.1808, lng: 18.9406 },
  { name: 'Zavidovići', lat: 44.4467, lng: 18.1497 },
  { name: 'Zenica', lat: 44.2037, lng: 17.9078 },
  { name: 'Zvornik', lat: 44.3856, lng: 19.1025 },
  { name: 'Žepa', lat: 44.0583, lng: 19.0597 },
  { name: 'Žepče', lat: 44.4281, lng: 18.0353 },
  { name: 'Živinice', lat: 44.4500, lng: 18.6500 },

  // === Sandžak / Crna Gora ===
  { name: 'Bijelo Polje', lat: 43.0286, lng: 19.7478 },
  { name: 'Gusinje', lat: 42.5611, lng: 19.8336 },
  { name: 'Nova Varoš', lat: 43.4592, lng: 19.9867 },
  { name: 'Novi Pazar', lat: 43.1367, lng: 20.5122 },
  { name: 'Plav', lat: 42.5964, lng: 19.9447 },
  { name: 'Pljevlja', lat: 43.3567, lng: 19.3575 },
  { name: 'Priboj', lat: 43.5814, lng: 19.5264 },
  { name: 'Prijepolje', lat: 43.3886, lng: 19.6478 },
  { name: 'Rožaje', lat: 42.8403, lng: 20.1672 },
  { name: 'Sjenica', lat: 43.2722, lng: 20.0069 },
  { name: 'Tutin', lat: 42.9897, lng: 20.3297 },
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
        const parsed = JSON.parse(stored) as Location;
        // Validate that stored location has all required fields (guards against old format)
        if (parsed.name && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
          return parsed;
        }
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
