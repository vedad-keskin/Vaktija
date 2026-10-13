import { headingFromScreenAxes, isCompassFaceUp } from './compass-heading';

/** W3C [qx, qy, qz, qw], also accepting DOMPoint-like browser implementations. */
export function componentsFromOrientationQuaternion(
  q: DOMPointReadOnly | ReadonlyArray<number> | null | undefined,
): { x: number; y: number; z: number; w: number } | null {
  if (q == null) return null;
  const point = q as DOMPointReadOnly;
  const arr = q as ReadonlyArray<number>;
  const values =
    typeof point.x === 'number'
      ? [point.x, point.y, point.z, point.w]
      : [arr[0], arr[1], arr[2], arr[3]];
  if (!values.every(Number.isFinite)) return null;
  const norm = Math.hypot(...values);
  if (!Number.isFinite(norm) || norm < 1e-6) return null;
  const [x, y, z, w] = values.map((n) => n / norm);
  return { x, y, z, w };
}

/** Magnetic heading from a unit device-to-ENU quaternion; face-up display top edge only. */
export function headingDegFromOrientationQuaternionTopAxis(
  x: number,
  y: number,
  z: number,
  w: number,
  screenAngleDeg = 0,
): number | null {
  if (![x, y, z, w].every(Number.isFinite) || !isCompassFaceUp(1 - 2 * (x * x + y * y)))
    return null;
  return headingFromScreenAxes(
    1 - 2 * (y * y + z * z),
    2 * (x * y + z * w),
    2 * (x * y - z * w),
    1 - 2 * (x * x + z * z),
    screenAngleDeg,
  );
}

/** Unit quaternion for W3C intrinsic ZXY Device Orientation angles (degrees). */
export function quaternionFromDeviceOrientationDeg(
  alpha: number,
  beta: number,
  gamma: number,
): { x: number; y: number; z: number; w: number } {
  const halfRad = Math.PI / 360;
  const cX = Math.cos(beta * halfRad),
    sX = Math.sin(beta * halfRad);
  const cY = Math.cos(gamma * halfRad),
    sY = Math.sin(gamma * halfRad);
  const cZ = Math.cos(alpha * halfRad),
    sZ = Math.sin(alpha * halfRad);
  return {
    x: sX * cY * cZ - cX * sY * sZ,
    y: cX * sY * cZ + sX * cY * sZ,
    z: cX * cY * sZ + sX * sY * cZ,
    w: cX * cY * cZ - sX * sY * sZ,
  };
}
