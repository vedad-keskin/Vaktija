import { expect, it } from 'vitest';
import { componentsFromOrientationQuaternion } from './orientation-quaternion-heading';

it('accepts and normalizes both browser quaternion representations, rejects all malformed components', () => {
  expect(componentsFromOrientationQuaternion([0, 0, 0, 2])).toEqual({ x: 0, y: 0, z: 0, w: 1 });
  expect(
    componentsFromOrientationQuaternion({ x: 0, y: 0, z: 0, w: 1 } as DOMPointReadOnly),
  ).toEqual({ x: 0, y: 0, z: 0, w: 1 });
  for (const q of [null, [], [0, 0, 0, 0], [0, NaN, 0, 1], [0, 0, Infinity, 1]]) {
    expect(componentsFromOrientationQuaternion(q)).toBeNull();
  }
});
