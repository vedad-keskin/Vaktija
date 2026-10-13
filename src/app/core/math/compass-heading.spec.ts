import { expect, it } from 'vitest';
import { headingFromDeviceOrientationEvent } from './compass-heading';
import {
  headingDegFromOrientationQuaternionTopAxis,
  quaternionFromDeviceOrientationDeg,
} from './orientation-quaternion-heading';

it('uses the same physical top edge when flat, pitched, rolled and screen-rotated on both sensor paths', () => {
  for (const alpha of [0, 90, 270]) {
    for (const beta of [-20, 0, 20]) {
      for (const gamma of [-35, 0, 35]) {
        const e = { alpha, beta, gamma, absolute: true } as DeviceOrientationEvent;
        const q = quaternionFromDeviceOrientationDeg(alpha, beta, gamma);
        const expected = (360 - alpha) % 360;
        expect(headingFromDeviceOrientationEvent(e)).toBeCloseTo(expected, 8);
        expect(headingDegFromOrientationQuaternionTopAxis(q.x, q.y, q.z, q.w)).toBeCloseTo(
          expected,
          8,
        );
      }
    }
  }
  // Independent projected vector for a pitched/rolled phone: +X has E=.819152, N=.196175.
  const landscape = (Math.atan2(0.8191520442889918, 0.19617469496901108) * 180) / Math.PI;
  const e = { alpha: 0, beta: 20, gamma: 35, absolute: true } as DeviceOrientationEvent;
  const q = quaternionFromDeviceOrientationDeg(0, 20, 35);
  for (const [screenAngle, expected] of [
    [0, 0],
    [90, landscape],
    [180, 180],
    [270, landscape + 180],
  ]) {
    expect(headingFromDeviceOrientationEvent(e, { screenAngleDeg: screenAngle })).toBeCloseTo(
      expected,
      8,
    );
    expect(headingDegFromOrientationQuaternionTopAxis(q.x, q.y, q.z, q.w, screenAngle)).toBeCloseTo(
      expected,
      8,
    );
  }
  for (const beta of [60, 90, 180]) {
    expect(headingFromDeviceOrientationEvent({ ...e, beta })).toBeNull();
    const tilted = quaternionFromDeviceOrientationDeg(0, beta, 0);
    expect(
      headingDegFromOrientationQuaternionTopAxis(tilted.x, tilted.y, tilted.z, tilted.w),
    ).toBeNull();
  }
});

it('rejects relative, missing, nonfinite and uncalibrated data; preserves calibrated Safari headings', () => {
  const flat = { alpha: 270, beta: 0, gamma: 0, absolute: true } as DeviceOrientationEvent;
  expect(headingFromDeviceOrientationEvent(flat)).toBe(90);
  for (const change of [
    { absolute: false },
    { alpha: null },
    { alpha: Infinity },
    { beta: null },
    { gamma: NaN },
  ]) {
    expect(headingFromDeviceOrientationEvent({ ...flat, ...change })).toBeNull();
  }
  const safari = { ...flat, absolute: false, webkitCompassHeading: 45, webkitCompassAccuracy: 5 };
  expect(headingFromDeviceOrientationEvent(safari)).toBe(45);
  expect(headingFromDeviceOrientationEvent(safari, { screenAngleDeg: 90 })).toBe(135);
  const uncalibrated = { ...safari, webkitCompassAccuracy: -1 };
  expect(headingFromDeviceOrientationEvent(uncalibrated)).toBeNull();
});
