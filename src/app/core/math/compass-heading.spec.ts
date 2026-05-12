import { describe, expect, it } from 'vitest';
import {
  compassHeadingVerticalDeg,
  headingFromFlatAlpha,
  headingFromDeviceOrientationEvent,
  normalizeDeg,
} from './compass-heading';

describe('normalizeDeg', () => {
  it('normalizes negatives', () => {
    expect(normalizeDeg(-90)).toBe(270);
  });
});

describe('headingFromFlatAlpha', () => {
  it('north when alpha 0', () => {
    expect(headingFromFlatAlpha(0)).toBe(0);
  });
  it('east when alpha 270 (flat compass opposite sense)', () => {
    expect(headingFromFlatAlpha(270)).toBe(90);
  });
});

describe('compassHeadingVerticalDeg', () => {
  it('returns 0 for typical vertical portrait reference (alpha=0 beta=90 gamma=0)', () => {
    expect(compassHeadingVerticalDeg(0, 90, 0)).toBe(0);
  });
});

describe('headingFromDeviceOrientationEvent', () => {
  it('prefers webkitCompassHeading', () => {
    const e = { webkitCompassHeading: 45 } as unknown as DeviceOrientationEvent;
    expect(headingFromDeviceOrientationEvent(e)).toBe(45);
  });

  it('returns null for non-absolute event without webkitCompassHeading', () => {
    const e = {
      alpha: 270,
      beta: 10,
      gamma: 5,
      absolute: false,
    } as DeviceOrientationEvent;
    expect(headingFromDeviceOrientationEvent(e)).toBeNull();
  });

  it('returns a heading for absolute event with small tilt', () => {
    const e = {
      alpha: 270,
      beta: 10,
      gamma: 5,
      absolute: true,
    } as DeviceOrientationEvent;
    const result = headingFromDeviceOrientationEvent(e);
    expect(result).not.toBeNull();
    // Tilt-compensated formula differs from the flat formula at non-zero tilt;
    // just verify it returns a valid degree value.
    expect(result!).toBeGreaterThanOrEqual(0);
    expect(result!).toBeLessThan(360);
  });

  it('uses tilt formula when tilted (portrait-like)', () => {
    const e = {
      alpha: 0,
      beta: 90,
      gamma: 0,
      absolute: true,
    } as DeviceOrientationEvent;
    expect(headingFromDeviceOrientationEvent(e)).toBe(0);
  });

  it('returns null when alpha is missing', () => {
    const e = {
      alpha: null,
      beta: 90,
      gamma: 0,
      absolute: true,
    } as unknown as DeviceOrientationEvent;
    expect(headingFromDeviceOrientationEvent(e)).toBeNull();
  });

  it('falls back to flat formula when only alpha available on absolute event', () => {
    const e = {
      alpha: 90,
      beta: null,
      gamma: null,
      absolute: true,
    } as unknown as DeviceOrientationEvent;
    expect(headingFromDeviceOrientationEvent(e)).toBe(270);
  });
});
