// Tune on hardware: beyond this face-up tilt, pause rather than change the pointing axis.
export const MAX_COMPASS_TILT_DEG = 50;

export function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function angleDeltaDeg(to: number, from: number): number {
  return normalizeDeg(to - from + 180) - 180;
}

export function isCompassFaceUp(zUp: number): boolean {
  return Number.isFinite(zUp) && zUp >= Math.cos((MAX_COMPASS_TILT_DEG * Math.PI) / 180);
}

export function isDeviceOrientationTiltUsable(e: DeviceOrientationEvent): boolean {
  return (
    e.beta !== null &&
    e.gamma !== null &&
    Number.isFinite(e.beta) &&
    Number.isFinite(e.gamma) &&
    isCompassFaceUp(Math.cos((e.beta * Math.PI) / 180) * Math.cos((e.gamma * Math.PI) / 180))
  );
}

/** Project the display's top edge, remapping screen rotation BEFORE horizontal projection. */
export function headingFromScreenAxes(
  eastX: number,
  northX: number,
  eastY: number,
  northY: number,
  screenAngleDeg = 0,
): number | null {
  if (![eastX, northX, eastY, northY, screenAngleDeg].every(Number.isFinite)) return null;
  const screenAngle = (screenAngleDeg * Math.PI) / 180;
  const east = Math.sin(screenAngle) * eastX + Math.cos(screenAngle) * eastY;
  const north = Math.sin(screenAngle) * northX + Math.cos(screenAngle) * northY;
  if (Math.hypot(east, north) < 1e-6) return null;
  return normalizeDeg((Math.atan2(east, north) * 180) / Math.PI);
}

/** Magnetic heading of the display's top edge. Relative/uncalibrated/unusable data is rejected. */
export function headingFromDeviceOrientationEvent(
  e: DeviceOrientationEvent,
  options: { screenAngleDeg?: number } = {},
): number | null {
  if (!isDeviceOrientationTiltUsable(e)) return null;
  const beta = (e.beta! * Math.PI) / 180;
  const gamma = (e.gamma! * Math.PI) / 180;
  const wk = e as DeviceOrientationEvent & {
    webkitCompassHeading?: number;
    webkitCompassAccuracy?: number;
  };
  const hasWebkitHeading = Number.isFinite(wk.webkitCompassHeading);
  if (
    wk.webkitCompassAccuracy != null &&
    (!Number.isFinite(wk.webkitCompassAccuracy) || wk.webkitCompassAccuracy < 0)
  )
    return null;
  if (!hasWebkitHeading && (!e.absolute || e.alpha === null || !Number.isFinite(e.alpha)))
    return null;

  // Safari supplies the portrait top-edge heading separately; alpha can have an arbitrary origin.
  const alpha = hasWebkitHeading ? 0 : (e.alpha! * Math.PI) / 180;
  const cZ = Math.cos(alpha),
    sZ = Math.sin(alpha);
  const cX = Math.cos(beta),
    sX = Math.sin(beta);
  const cY = Math.cos(gamma),
    sY = Math.sin(gamma);
  const projected = headingFromScreenAxes(
    cZ * cY - sZ * sX * sY,
    sZ * cY + cZ * sX * sY,
    -sZ * cX,
    cZ * cX,
    options.screenAngleDeg ?? 0,
  );
  return projected === null
    ? null
    : hasWebkitHeading
      ? normalizeDeg(wk.webkitCompassHeading! + projected)
      : projected;
}
