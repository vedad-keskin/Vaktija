import { Geodesic } from 'geographiclib-geodesic';
import { KAABA_LAT, KAABA_LNG } from '../constants/kaaba.constants';

const geod = Geodesic.WGS84;

/**
 * Initial geodesic bearing from (lat, lng) toward the Kaaba on the WGS84 ellipsoid,
 * using Karney's method (professional-grade, ~15 nm accuracy).
 * Returns degrees clockwise from true north [0, 360).
 */
export function computeQiblaBearingDeg(lat: number, lng: number): number {
  const r = geod.Inverse(lat, lng, KAABA_LAT, KAABA_LNG);
  const azi = r.azi1 ?? 0;
  return ((azi % 360) + 360) % 360;
}

/**
 * Geodesic distance from (lat, lng) to the Kaaba in kilometres (WGS84 ellipsoid).
 */
export function computeDistanceToKaabaKm(lat: number, lng: number): number {
  const r = geod.Inverse(lat, lng, KAABA_LAT, KAABA_LNG);
  return (r.s12 ?? 0) / 1000;
}
