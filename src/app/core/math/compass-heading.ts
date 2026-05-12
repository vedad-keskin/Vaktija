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

export type HeadingBlendOptions = {
  screenAngleDeg?: number;
  flatBlendStartDeg?: number;
  flatBlendEndDeg?: number;
};

const DEFAULT_FLAT_BLEND_START_DEG = 10;
const DEFAULT_FLAT_BLEND_END_DEG = 35;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function lerpAngleDeg(from: number, to: number, t: number): number {
  const diff = ((to - from + 540) % 360) - 180;
  return normalizeDeg(from + diff * t);
}

function applyScreenAngle(heading: number, screenAngleDeg: number): number {
  return normalizeDeg(heading + screenAngleDeg);
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
export function headingFromDeviceOrientationEvent(
  e: DeviceOrientationEvent,
  options: HeadingBlendOptions = {},
): number | null {
  const screenAngleDeg =
    typeof options.screenAngleDeg === 'number' && Number.isFinite(options.screenAngleDeg)
      ? options.screenAngleDeg
      : 0;
  // --- iOS path: webkitCompassHeading is always magnetic-north-referenced ---
  const wk = (e as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
  if (wk != null && !Number.isNaN(wk)) {
    return applyScreenAngle(normalizeDeg(wk), screenAngleDeg);
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

  const flatHeading = headingFromFlatAlpha(alpha);

  // Blend flat and tilt-compensated headings based on device tilt.
  if (
    beta != null &&
    gamma != null &&
    !Number.isNaN(beta) &&
    !Number.isNaN(gamma)
  ) {
    const tiltDeg = Math.min(90, Math.hypot(beta, gamma));
    const start = options.flatBlendStartDeg ?? DEFAULT_FLAT_BLEND_START_DEG;
    const end = options.flatBlendEndDeg ?? DEFAULT_FLAT_BLEND_END_DEG;
    const t = smoothstep(Math.min(start, end), Math.max(start, end), tiltDeg);
    const blended = lerpAngleDeg(flatHeading, compassHeadingVerticalDeg(alpha, beta, gamma), t);
    return applyScreenAngle(blended, screenAngleDeg);
  }

  // Fallback: only alpha available (rare; treat as flat).
  return applyScreenAngle(flatHeading, screenAngleDeg);
}
