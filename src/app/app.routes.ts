import { Routes } from '@angular/router';
import { PrayerTimesPage } from './features/prayer-times/prayer-times.page';

export const routes: Routes = [
  { path: '', component: PrayerTimesPage },
  {
    path: 'duas',
    loadComponent: () => import('./features/duas/duas.page').then((m) => m.DuasPage),
  },
  {
    path: 'dhikr',
    data: { collection: 'dhikr' },
    loadComponent: () => import('./features/duas/duas.page').then((m) => m.DuasPage),
  },
  {
    path: 'qibla',
    loadComponent: () => import('./features/qibla/qibla.page').then((m) => m.QiblaPage),
  },
  { path: '**', redirectTo: '' },
];
