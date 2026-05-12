import { describe, expect, it } from 'vitest';
import { KAABA_LAT, KAABA_LNG } from '../constants/kaaba.constants';
import { computeDistanceToKaabaKm, computeQiblaBearingDeg } from './qibla-bearing';

describe('computeQiblaBearingDeg', () => {
  it('returns expected bearing from Sarajevo (approx)', () => {
    const b = computeQiblaBearingDeg(43.8486, 18.3564);
    expect(b).toBeGreaterThan(130);
    expect(b).toBeLessThan(150);
  });

  it('from a point north along the Kaaba meridian, bearing is south (~180)', () => {
    const b = computeQiblaBearingDeg(KAABA_LAT + 5, KAABA_LNG);
    expect(b).toBeGreaterThan(175);
    expect(b).toBeLessThan(185);
  });
});

describe('computeDistanceToKaabaKm', () => {
  it('is near zero at Kaaba coordinates', () => {
    expect(computeDistanceToKaabaKm(KAABA_LAT, KAABA_LNG)).toBeLessThan(1);
  });

  it('Sarajevo is thousands of km away', () => {
    const d = computeDistanceToKaabaKm(43.8486, 18.3564);
    expect(d).toBeGreaterThan(3000);
    expect(d).toBeLessThan(4500);
  });
});
