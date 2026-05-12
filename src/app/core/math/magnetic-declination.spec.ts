import { describe, expect, it } from 'vitest';
import { estimateMagneticDeclinationDeg } from './magnetic-declination';

describe('estimateMagneticDeclinationDeg (WMM)', () => {
  it('returns eastward declination for Sarajevo (~5°E)', () => {
    const d = estimateMagneticDeclinationDeg(43.8486, 18.3564);
    expect(d).toBeGreaterThan(3);
    expect(d).toBeLessThan(8);
  });

  it('returns consistent values across Bosnia', () => {
    const sarajevo = estimateMagneticDeclinationDeg(43.85, 18.36);
    const tuzla = estimateMagneticDeclinationDeg(44.54, 18.67);
    const mostar = estimateMagneticDeclinationDeg(43.34, 17.81);
    expect(Math.abs(sarajevo - tuzla)).toBeLessThan(1.5);
    expect(Math.abs(sarajevo - mostar)).toBeLessThan(1.5);
  });

  it('handles global coordinates without NaN', () => {
    expect(Number.isFinite(estimateMagneticDeclinationDeg(0, 0))).toBe(true);
    expect(Number.isFinite(estimateMagneticDeclinationDeg(37.77, -122.42))).toBe(true);
    expect(Number.isFinite(estimateMagneticDeclinationDeg(-33.87, 151.21))).toBe(true);
  });
});
