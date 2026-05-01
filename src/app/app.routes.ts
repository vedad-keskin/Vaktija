import { Routes } from '@angular/router';
import { PrayerTimesPage } from './features/prayer-times/prayer-times.page';

export const routes: Routes = [
  { path: '', component: PrayerTimesPage },
  { path: '**', redirectTo: '' },
];
