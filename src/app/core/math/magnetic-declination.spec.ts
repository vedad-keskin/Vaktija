import { expect, it, vi } from 'vitest';
import { estimateMagneticDeclinationDeg } from './magnetic-declination';

it('matches dated NOAA WMM2025 test vectors and fails safely for invalid input or model expiry', () => {
  vi.useFakeTimers();
  try {
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
    // NOAA WMM2025_TEST_VALUES.txt, epoch 2025.0, sea level, rounded to .01 degree.
    for (const [lat, lng, expected] of [
      [80, 0, 1.28],
      [0, 120, -0.16],
      [-80, -120, 68.78],
    ]) {
      const actual = estimateMagneticDeclinationDeg(lat, lng);
      expect(actual).not.toBeNull();
      expect(Math.abs(actual! - expected)).toBeLessThan(0.005);
    }
    vi.setSystemTime(new Date('2026-10-13T12:00:00Z'));
    expect(estimateMagneticDeclinationDeg(43.8486, 18.3564)).toBeCloseTo(5.187561704753851, 8);
    expect(estimateMagneticDeclinationDeg(NaN, 0)).toBeNull();
    expect(estimateMagneticDeclinationDeg(91, 0)).toBeNull();
    vi.setSystemTime(new Date('2031-01-01T00:00:00Z'));
    expect(estimateMagneticDeclinationDeg(43.8486, 18.3564)).toBeNull();
  } finally {
    vi.useRealTimers();
  }
});
