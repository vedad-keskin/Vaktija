import geomagnetism from 'geomagnetism';
import { isValidCoordinates } from './qibla-bearing';

/**
 * Magnetic declination from the World Magnetic Model (full WMM coefficients).
 *
 * @returns Declination in degrees: positive = East, negative = West.
 *          Subtract from a true-north bearing to get a magnetic bearing,
 *          or add to a magnetic heading to get a true-north heading.
 */
export function estimateMagneticDeclinationDeg(latDeg: number, lngDeg: number): number | null {
  if (!isValidCoordinates(latDeg, lngDeg)) return null;
  try {
    const model = geomagnetism.model();
    const info = model.point([latDeg, lngDeg]);
    // Near a magnetic pole the horizontal field cannot support a useful compass heading.
    return Number.isFinite(info.decl) && info.h >= 2000 ? info.decl : null;
  } catch {
    // An expired model must not silently supply an uncorrected north reference.
    return null;
  }
}
