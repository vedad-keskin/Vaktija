/**
 * Compass heading from DeviceOrientation Tait–Bryan angles (degrees).
 * W3C Device Orientation § A.1 "Calculating compass heading" —
 * heading of the horizontal component of the vector normal to the screen (out the back).
 * Works at any tilt angle; degrades gracefully near gimbal-lock (device perfectly flat
 * face-up) where it converges to the simpler `headingFromFlatAlpha` value.
 */
export function compassHeadingVerticalDeg(alpha: number, beta: number, gamma: number): number {
  const rad = Math.PI / 180;
  const x = beta * rad;
  const y = gamma * rad;
  const z = alpha * rad;
  const cX = Math.cos(x);
  const cY = Math.cos(y);
  const cZ = Math.cos(z);
  const sX = Math.sin(x);
  const sY = Math.sin(y);
  const sZ = Math.sin(z);

  const vx = -cZ * sY - sZ * sX * cY;
  const vy = -sZ * sY + cZ * sX * cY;

  let heading = Math.atan(vx / vy);
  if (vy < 0) {
    heading += Math.PI;
  } else if (vx < 0) {
    heading += 2 * Math.PI;
  }

  return normalizeDeg(heading * (180 / Math.PI));
}

/** W3C "horizontal surface" compass heading: alpha is opposite sense to compass heading. */
export function headingFromFlatAlpha(alpha: number): number {
  return normalizeDeg(360 - alpha);
}

export function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Best-effort **magnetic-north** compass heading (degrees CW from magnetic north
 * to the top of the device).
 *
 * Returns `null` when the event does not carry earth-referenced data:
 * - On iOS Safari, `webkitCompassHeading` is always magnetic-north → used directly.
 * - On Android Chrome, only `deviceorientationabsolute` events carry earth-referenced
 *   alpha; standard `deviceorientation` events have `absolute === false` and an
 *   arbitrary origin → rejected with `null`.
 */
export function headingFromDeviceOrientationEvent(e: DeviceOrientationEvent): number | null {
  // --- iOS path: webkitCompassHeading is always magnetic-north-referenced ---
  const wk = (e as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
  if (wk != null && !Number.isNaN(wk)) {
    return normalizeDeg(wk);
  }

  // --- Android / other: reject non-absolute events ---
  // A relative alpha (arbitrary starting point) is useless for compass heading.
  if (!e.absolute) {
    return null;
  }

  if (e.alpha == null || Number.isNaN(e.alpha)) {
    return null;
  }

  const { alpha } = e;
  const beta = e.beta;
  const gamma = e.gamma;

  // Always use the tilt-compensated formula — it handles every phone angle
  // continuously without the heading-jump that a flat/vertical threshold causes.
  if (
    beta != null &&
    gamma != null &&
    !Number.isNaN(beta) &&
    !Number.isNaN(gamma)
  ) {
    return compassHeadingVerticalDeg(alpha, beta, gamma);
  }

  // Fallback: only alpha available (rare; treat as flat).
  return headingFromFlatAlpha(alpha);
}
