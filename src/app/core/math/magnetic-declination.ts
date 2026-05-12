import geomagnetism from 'geomagnetism';

/**
 * Magnetic declination from the World Magnetic Model (full WMM coefficients).
 *
 * @returns Declination in degrees: positive = East, negative = West.
 *          Subtract from a true-north bearing to get a magnetic bearing,
 *          or add to a magnetic heading to get a true-north heading.
 */
export function estimateMagneticDeclinationDeg(
  latDeg: number,
  lngDeg: number,
): number {
  const model = geomagnetism.model();
  const info = model.point([latDeg, lngDeg]);
  return info.decl;
}
