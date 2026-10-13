import { expect, it } from 'vitest';
import { KAABA_LAT, KAABA_LNG } from '../constants/kaaba.constants';
import { computeDistanceToKaabaKm, computeQiblaBearingDeg } from './qibla-bearing';

it('matches independent GeographicLib WGS84 golden values and handles invalid/degenerate coordinates', () => {
  // GeographicLib GeodSolve inverse calculation, metres converted to km.
  expect(computeQiblaBearingDeg(43.8486, 18.3564)).toBeCloseTo(134.5331097433056, 9);
  expect(computeDistanceToKaabaKm(43.8486, 18.3564)).toBeCloseTo(3180.23573722199, 8);
  expect(computeQiblaBearingDeg(43.6603, 17.7617)).toBeCloseTo(133.3281206450339, 9);
  expect(computeQiblaBearingDeg(KAABA_LAT + 5, KAABA_LNG)).toBeCloseTo(180, 8);
  expect(computeQiblaBearingDeg(KAABA_LAT, KAABA_LNG)).toBeNull();
  expect(computeDistanceToKaabaKm(KAABA_LAT, KAABA_LNG)).toBe(0);
  expect(computeQiblaBearingDeg(-KAABA_LAT, KAABA_LNG - 180)).toBeNull();
  for (const [lat, lng] of [
    [NaN, 0],
    [0, Infinity],
    [91, 0],
    [0, 181],
  ]) {
    expect(computeQiblaBearingDeg(lat, lng)).toBeNull();
    expect(computeDistanceToKaabaKm(lat, lng)).toBeNull();
  }
});
