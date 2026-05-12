import { describe, expect, it } from 'vitest';
import {
  componentsFromOrientationQuaternion,
  headingDegFromOrientationQuaternion,
  headingDegFromOrientationQuaternionBlended,
  headingDegFromOrientationQuaternionTopAxis,
  headingMatchesVerticalEulerWithinTol,
  quaternionFromDeviceOrientationDeg,
} from './orientation-quaternion-heading';

describe('componentsFromOrientationQuaternion', () => {
  it('parses W3C FrozenArray order [qx, qy, qz, qw]', () => {
    const q = quaternionFromDeviceOrientationDeg(120, 45, -10);
    const arr = [q.x, q.y, q.z, q.w] as const;
    const p = componentsFromOrientationQuaternion(arr);
    expect(p).toEqual({ x: q.x, y: q.y, z: q.z, w: q.w });
  });

  it('parses DOMPoint-like objects', () => {
    const q = quaternionFromDeviceOrientationDeg(45, 30, 10);
    const p = componentsFromOrientationQuaternion({
      x: q.x,
      y: q.y,
      z: q.z,
      w: q.w,
    } as DOMPointReadOnly);
    expect(p).toEqual({ x: q.x, y: q.y, z: q.z, w: q.w });
  });
});

describe('headingDegFromOrientationQuaternion', () => {
  it('returns null when horizontal projection vanishes (identity rotation)', () => {
    expect(headingDegFromOrientationQuaternion(0, 0, 0, 1)).toBeNull();
  });

  it('returns a normalized heading for a tilted orientation', () => {
    const q = quaternionFromDeviceOrientationDeg(120, 45, -10);
    const h = headingDegFromOrientationQuaternion(q.x, q.y, q.z, q.w);
    expect(h).not.toBeNull();
    expect(h!).toBeGreaterThanOrEqual(0);
    expect(h!).toBeLessThan(360);
  });

  it('matches W3C euler compass heading across varied angles', () => {
    const samples: [number, number, number][] = [
      [0, 90, 0],
      [270, 45, 30],
      [180, 80, -15],
      [45, 60, 20],
      [300, 70, -40],
    ];
    for (const [a, b, g] of samples) {
      expect(headingMatchesVerticalEulerWithinTol(a, b, g, 0.25)).toBe(true);
    }
  });
});

describe('headingDegFromOrientationQuaternionTopAxis', () => {
  it('matches flat alpha for pure z rotation', () => {
    const q = quaternionFromDeviceOrientationDeg(90, 0, 0);
    const h = headingDegFromOrientationQuaternionTopAxis(q.x, q.y, q.z, q.w);
    expect(h).toBe(270);
  });
});

describe('headingDegFromOrientationQuaternionBlended', () => {
  it('returns a stable heading when flat', () => {
    const h = headingDegFromOrientationQuaternionBlended(0, 0, 0, 1);
    expect(h).toBe(0);
  });
});
