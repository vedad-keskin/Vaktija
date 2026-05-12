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

  it('uses flat formula when beta and gamma small', () => {
    const e = {
      alpha: 270,
      beta: 10,
      gamma: 5,
      absolute: true,
    } as DeviceOrientationEvent;
    expect(headingFromDeviceOrientationEvent(e)).toBe(90);
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
});
