import { describe, expect, it } from 'vitest';
import { KAABA_LAT, KAABA_LNG } from '../constants/kaaba.constants';
import { computeDistanceToKaabaKm, computeQiblaBearingDeg } from './qibla-bearing';

describe('computeQiblaBearingDeg (Karney)', () => {
  it('returns expected bearing from Sarajevo (~136°)', () => {
    const b = computeQiblaBearingDeg(43.8486, 18.3564);
    expect(b).toBeGreaterThan(134);
    expect(b).toBeLessThan(138);
  });

  it('from a point north along the Kaaba meridian, bearing is south (~180)', () => {
    const b = computeQiblaBearingDeg(KAABA_LAT + 5, KAABA_LNG);
    expect(b).toBeGreaterThan(179);
    expect(b).toBeLessThan(181);
  });

  it('returns a value in [0, 360)', () => {
    const b = computeQiblaBearingDeg(-33.87, 151.21); // Sydney
    expect(b).toBeGreaterThanOrEqual(0);
    expect(b).toBeLessThan(360);
  });
});

describe('computeDistanceToKaabaKm (Karney)', () => {
  it('is near zero at Kaaba coordinates', () => {
    expect(computeDistanceToKaabaKm(KAABA_LAT, KAABA_LNG)).toBeLessThan(0.01);
  });

  it('Sarajevo is ~3400 km away', () => {
    const d = computeDistanceToKaabaKm(43.8486, 18.3564);
    expect(d).toBeGreaterThan(3100);
    expect(d).toBeLessThan(3300);
  });
});
