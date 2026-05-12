import { describe, expect, it } from 'vitest';
import { estimateMagneticDeclinationDeg } from './magnetic-declination';

describe('estimateMagneticDeclinationDeg', () => {
  it('returns eastward declination for Sarajevo (~5°E)', () => {
    const d = estimateMagneticDeclinationDeg(43.8486, 18.3564);
    // Balkans regional polynomial: 3.35 + 0.11*18.3564 - 0.04*43.8486 ≈ 3.61
    expect(d).toBeGreaterThan(3);
    expect(d).toBeLessThan(7);
  });

  it('returns similar values across Bosnia (consistent region)', () => {
    const sarajevo = estimateMagneticDeclinationDeg(43.85, 18.36);
    const tuzla = estimateMagneticDeclinationDeg(44.54, 18.67);
    const mostar = estimateMagneticDeclinationDeg(43.34, 17.81);
    // All should be within ~1° of each other
    expect(Math.abs(sarajevo - tuzla)).toBeLessThan(1);
    expect(Math.abs(sarajevo - mostar)).toBeLessThan(1);
  });

  it('returns a value for locations outside the Balkans', () => {
    // San Francisco — global grid fallback
    const d = estimateMagneticDeclinationDeg(37.77, -122.42);
    expect(typeof d).toBe('number');
    expect(Number.isFinite(d)).toBe(true);
  });

  it('handles edge coordinates without NaN', () => {
    expect(Number.isFinite(estimateMagneticDeclinationDeg(0, 0))).toBe(true);
    expect(Number.isFinite(estimateMagneticDeclinationDeg(90, 0))).toBe(true);
    expect(Number.isFinite(estimateMagneticDeclinationDeg(-90, 180))).toBe(true);
  });
});
