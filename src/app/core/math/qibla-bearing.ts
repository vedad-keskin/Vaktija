import { Geodesic } from 'geographiclib-geodesic';
import { KAABA_LAT, KAABA_LNG } from '../constants/kaaba.constants';

const geod = Geodesic.WGS84;

export function isValidCoordinates(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
  );
}

/**
 * Initial geodesic bearing from (lat, lng) toward the Kaaba on the WGS84 ellipsoid,
 * using Karney's method (professional-grade, ~15 nm accuracy).
 * Returns degrees clockwise from true north [0, 360).
 */
export function computeQiblaBearingDeg(lat: number, lng: number): number | null {
  if (!isValidCoordinates(lat, lng)) return null;
  // There is no unique pointing direction at the destination or its exact antipode.
  if (
    Math.abs(lat + KAABA_LAT) < 1e-10 &&
    Math.abs(Math.abs(((lng - KAABA_LNG + 540) % 360) - 180) - 180) < 1e-10
  )
    return null;
  const r = geod.Inverse(lat, lng, KAABA_LAT, KAABA_LNG);
  if (r.s12 == null || r.s12 < 0.001 || r.azi1 == null || !Number.isFinite(r.azi1)) return null;
  const azi = r.azi1;
  return ((azi % 360) + 360) % 360;
}

/**
 * Geodesic distance from (lat, lng) to the Kaaba in kilometres (WGS84 ellipsoid).
 */
export function computeDistanceToKaabaKm(lat: number, lng: number): number | null {
  if (!isValidCoordinates(lat, lng)) return null;
  const r = geod.Inverse(lat, lng, KAABA_LAT, KAABA_LNG);
  return r.s12 != null && Number.isFinite(r.s12) ? r.s12 / 1000 : null;
}
