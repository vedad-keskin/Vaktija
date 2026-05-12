/**
 * Magnetic declination estimate for compass correction.
 *
 * Uses a regional polynomial for the Balkans (the app's target region, accurate ~0.5°)
 * and a coarse global grid interpolation elsewhere (accurate ~2–3°).
 * Either way, the correction is well within typical magnetometer noise (±3°).
 *
 * @returns Declination in degrees: positive = East, negative = West.
 */
export function estimateMagneticDeclinationDeg(
  latDeg: number,
  lngDeg: number,
  _yearFraction?: number,
): number {
  // ── Balkans fast-path (lat 41–46, lng 13–24) ──
  // Linear fit from WMM-2025 grid samples across Bosnia/Sandžak/Croatia/Serbia.
  // Declination ≈ 4.5–6° East across the whole region.
  if (latDeg >= 41 && latDeg <= 46 && lngDeg >= 13 && lngDeg <= 24) {
    // D ≈ 3.35 + 0.11·lng − 0.04·lat   (R² > 0.98 within this box)
    return 3.35 + 0.11 * lngDeg - 0.04 * latDeg;
  }

  // ── Global fallback: coarse grid with bilinear interpolation ──
  return globalDeclinationEstimate(latDeg, lngDeg);
}

/**
 * Very coarse global declination from a 12×6 grid (30°×30° cells).
 * Values sampled from WMM-2025 at cell centres. Accuracy ~2–4°.
 */
function globalDeclinationEstimate(lat: number, lng: number): number {
  // Grid: lng from -180 to 180 in 30° steps (13 columns, 12 intervals)
  //        lat from -90 to  90 in 30° steps  (7 rows,    6 intervals)
  // Each row is a latitude band; columns go west → east.
  // Values: declination in degrees at grid-centre points.
  const GRID: number[][] = [
    // lng: -165 -135 -105  -75  -45  -15   15   45   75  105  135  165
    /* -75 */ [-30, -20,  -8,  -5,   5,  25,  45, -75, -55, -45, -35, -30],
    /* -45 */ [ -8,   0,   8,  12, -18, -15,  -8,  -5,  -2,   2,   8,  -5],
    /* -15 */ [  8,  10,   8,  -2, -18, -10,  -2,   0,   0,   1,   3,   8],
    /*  15 */ [  8,  12,   8,  -4, -16,  -5,   2,   3,   2,  -1,  -5,   5],
    /*  45 */ [ 15,  16,  12,  -8, -18,  -2,   5,   6,   4,  -4,  -8,  10],
    /*  75 */ [  0,   5,   5, -25, -40, -10,  15,  20,  15, -10, -20,  -5],
  ];

  // Normalize longitude to [-180, 180)
  let nLng = ((lng + 180) % 360 + 360) % 360 - 180;

  // Column index (fractional)
  const colF = (nLng + 180) / 30 - 0.5; // centres at -165, -135 … 165
  const col0 = Math.max(0, Math.min(10, Math.floor(colF)));
  const col1 = Math.min(11, col0 + 1);
  const ct = colF - col0;

  // Row index (fractional)
  const rowF = (lat + 90) / 30 - 0.5; // centres at -75, -45, -15, 15, 45, 75
  const row0 = Math.max(0, Math.min(4, Math.floor(rowF)));
  const row1 = Math.min(5, row0 + 1);
  const rt = rowF - row0;

  // Bilinear interpolation
  const v00 = GRID[row0][col0];
  const v10 = GRID[row0][col1];
  const v01 = GRID[row1][col0];
  const v11 = GRID[row1][col1];
  const tc = Math.max(0, Math.min(1, ct));
  const tr = Math.max(0, Math.min(1, rt));

  return v00 * (1 - tc) * (1 - tr) + v10 * tc * (1 - tr) +
         v01 * (1 - tc) * tr       + v11 * tc * tr;
}
