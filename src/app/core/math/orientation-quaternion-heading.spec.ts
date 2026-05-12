import { describe, expect, it } from 'vitest';
import {
  headingDegFromOrientationQuaternion,
  headingMatchesVerticalEulerWithinTol,
  quaternionFromDeviceOrientationDeg,
} from './orientation-quaternion-heading';

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
