import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { PrayerTimesPage } from './features/prayer-times/prayer-times.page';
import { LocationService } from './core/services/location.service';

const selectCityFromUrl: CanActivateFn = (route) => {
  const locations = inject(LocationService);
  const city = locations.getLocationBySlug(route.paramMap.get('city') ?? '');
  if (!city) return inject(Router).parseUrl('/');
  locations.setSelectedLocation(city);
  return true;
};

const savedCitySlug = (): string => {
  const locations = inject(LocationService);
  const slug = locations.citySlug(locations.getSelectedLocation());
  return locations.getLocationBySlug(slug) ? slug : 'sarajevo';
};

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: () => `/${savedCitySlug()}` },
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
    pathMatch: 'full',
    redirectTo: () => `/qibla/${savedCitySlug()}`,
  },
  {
    path: 'qibla/:city',
    canActivate: [selectCityFromUrl],
    loadComponent: () => import('./features/qibla/qibla.page').then((m) => m.QiblaPage),
  },
  { path: ':city', component: PrayerTimesPage, canActivate: [selectCityFromUrl] },
  { path: '**', redirectTo: '' },
];
