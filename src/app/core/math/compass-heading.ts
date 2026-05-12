/**
 * Compass heading from DeviceOrientation Tait–Bryan angles (degrees).
 * Non-normative reference: W3C Device Orientation § A.1 “Calculating compass heading” —
 * heading of the horizontal component of the vector normal to the screen (out the back),
 * i.e. suitable when the phone is held **upright** (typical Qibla use). When the device is
 * nearly flat, prefer {@link headingFromFlatAlpha} instead.
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

/** W3C “horizontal surface” compass heading: alpha is opposite sense to compass heading. */
export function headingFromFlatAlpha(alpha: number): number {
  return normalizeDeg(360 - alpha);
}

export function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Best-effort compass heading (degrees clockwise from true north to top of device),
 * matching {@link https://developer.apple.com/documentation/webkit/detecting_device_motion WebKit webkitCompassHeading} convention where applicable.
 */
export function headingFromDeviceOrientationEvent(e: DeviceOrientationEvent): number | null {
  const wk = (e as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
  if (wk != null && !Number.isNaN(wk)) {
    return normalizeDeg(wk);
  }

  if (e.alpha == null || Number.isNaN(e.alpha)) {
    return null;
  }

  const { alpha } = e;
  const beta = e.beta;
  const gamma = e.gamma;

  if (
    beta != null &&
    gamma != null &&
    !Number.isNaN(beta) &&
    !Number.isNaN(gamma)
  ) {
    const roughlyFlat = Math.abs(beta) < 30 && Math.abs(gamma) < 30;
    if (roughlyFlat) {
      return headingFromFlatAlpha(alpha);
    }
    return compassHeadingVerticalDeg(alpha, beta, gamma);
  }

  if (e.absolute) {
    return headingFromFlatAlpha(alpha);
  }

  return null;
}
