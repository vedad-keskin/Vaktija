import { compassHeadingVerticalDeg, normalizeDeg } from './compass-heading';

/**
 * `OrientationSensor.quaternion` is a four-element list `[qx, qy, qz, qw]` per W3C Orientation Sensor.
 * Some browsers also expose `DOMPointReadOnly`-like `{ x, y, z, w }`.
 */
export function componentsFromOrientationQuaternion(
  q: DOMPointReadOnly | ReadonlyArray<number> | null | undefined,
): { x: number; y: number; z: number; w: number } | null {
  if (q == null) return null;
  const maybePoint = q as DOMPointReadOnly;
  if (
    typeof maybePoint.x === 'number' &&
    typeof maybePoint.y === 'number' &&
    typeof maybePoint.z === 'number' &&
    typeof maybePoint.w === 'number' &&
    Number.isFinite(maybePoint.x) &&
    Number.isFinite(maybePoint.w)
  ) {
    return { x: maybePoint.x, y: maybePoint.y, z: maybePoint.z, w: maybePoint.w };
  }
  const arr = q as ReadonlyArray<number>;
  if (
    arr.length >= 4 &&
    typeof arr[0] === 'number' &&
    typeof arr[3] === 'number' &&
    Number.isFinite(arr[0]) &&
    Number.isFinite(arr[3])
  ) {
    return { x: arr[0], y: arr[1], z: arr[2], w: arr[3] };
  }
  return null;
}

/**
 * Compass heading (degrees CW from magnetic north toward the top edge of the device)
 * from an `AbsoluteOrientationSensor` quaternion.
 *
 * The quaternion maps device coordinates into the sensor's Earth reference frame
 * (East–North–Up). We project the screen-normal (“out the back”) axis onto the
 * horizontal plane and take atan2(East, North), matching the intent of W3C Device
 * Orientation § A.1.
 *
 * @returns `null` when the horizontal projection vanishes (near gimbal lock).
 */
export function headingDegFromOrientationQuaternion(
  x: number,
  y: number,
  z: number,
  w: number,
): number | null {
  if ([x, y, z, w].some((n) => !Number.isFinite(n))) return null;

  // Unit quaternion → rotation matrix R maps device → Earth (ENU).
  // Screen normal out the back ≈ −Z_device; R * [0,0,-1]^T uses negative third column.
  const east = -2 * (x * z + y * w);
  const north = -2 * (y * z - x * w);
  const horizMagSq = east * east + north * north;
  if (!Number.isFinite(horizMagSq) || horizMagSq < 1e-10) return null;

  const heading = Math.atan2(east, north) * (180 / Math.PI);
  if (!Number.isFinite(heading)) return null;
  return normalizeDeg(heading);
}

/**
 * Unit quaternion for ZXY α/β/γ Device Orientation angles (degrees).
 * Matches the non-normative construction in W3C Device Orientation § A.2.
 */
export function quaternionFromDeviceOrientationDeg(
  alpha: number,
  beta: number,
  gamma: number,
): { x: number; y: number; z: number; w: number } {
  const degtorad = Math.PI / 180;
  const _x = beta ? beta * degtorad : 0;
  const _y = gamma ? gamma * degtorad : 0;
  const _z = alpha ? alpha * degtorad : 0;

  const cX = Math.cos(_x / 2);
  const cY = Math.cos(_y / 2);
  const cZ = Math.cos(_z / 2);
  const sX = Math.sin(_x / 2);
  const sY = Math.sin(_y / 2);
  const sZ = Math.sin(_z / 2);

  const w = cX * cY * cZ - sX * sY * sZ;
  const x = sX * cY * cZ - cX * sY * sZ;
  const y = cX * sY * cZ + sX * cY * sZ;
  const z = cX * cY * sZ + sX * sY * cZ;

  return { x, y, z, w };
}

/** @internal Tests: compare quaternion heading to W3C euler compass formula. */
export function headingMatchesVerticalEulerWithinTol(
  alpha: number,
  beta: number,
  gamma: number,
  tolDeg = 0.05,
): boolean {
  const euler = compassHeadingVerticalDeg(alpha, beta, gamma);
  const q = quaternionFromDeviceOrientationDeg(alpha, beta, gamma);
  const fromQ = headingDegFromOrientationQuaternion(q.x, q.y, q.z, q.w);
  if (fromQ === null) return false;
  const diff = Math.abs(((fromQ - euler + 540) % 360) - 180);
  return diff <= tolDeg;
}
