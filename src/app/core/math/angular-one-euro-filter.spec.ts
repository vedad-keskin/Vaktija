import { expect, it } from 'vitest';
import { AngularOneEuroFilter } from './angular-one-euro-filter';
import { angleDeltaDeg } from './compass-heading';

it('rejects isolated spikes, follows real fast turns, unwraps seams and resets after gaps', () => {
  for (const dt of [10, 20, 40]) {
    const filter = new AngularOneEuroFilter();
    for (let t = 0; t <= 1000; t += dt) filter.update(0, t);
    let clock = 1000;
    for (const spike of [100, 180, -180, 300]) {
      expect(filter.update(spike, (clock += dt))).toBeCloseTo(0, 8);
      expect(filter.update(0, (clock += dt))).toBeCloseTo(0, 8);
      expect(filter.update(0, (clock += dt))).toBeCloseTo(0, 8);
    }
    filter.reset();
    let atEnd = 0;
    let settled = 0;
    for (let t = 0; t <= 2000; t += dt) {
      const heading = t < 1000 ? 0 : Math.min(90, (t - 1000) * 0.18);
      const out = filter.update(heading, t);
      if (t >= 1500 && t < 1500 + dt) atEnd = out;
      if (t >= 1900) settled = out;
    }
    expect(Math.abs(atEnd - 90)).toBeLessThan(15);
    expect(Math.abs(settled - 90)).toBeLessThan(1);
  }
  const seam = new AngularOneEuroFilter();
  seam.update(359, 0);
  let out = 359;
  for (let t = 20; t <= 1000; t += 20) {
    const previous = out;
    out = seam.update(1, t);
    expect(Math.abs(out - previous)).toBeLessThan(2);
  }
  expect(out).toBeGreaterThan(360);
  expect(Math.abs(angleDeltaDeg(out, 1))).toBeLessThan(1);
  expect(seam.update(180, 4000)).toBe(180);
  expect(seam.update(20, 4000)).toBe(180); // Non-increasing timestamp is ignored.
});

it('keeps seeded stationary jitter no worse than the previous 380ms filter', () => {
  const filter = new AngularOneEuroFilter();
  let seed = 42,
    previous = 0,
    baseline = 0,
    error = 0,
    baselineError = 0,
    count = 0;
  for (let t = 0; t <= 20000; t += 20) {
    seed = (1664525 * seed + 1013904223) >>> 0;
    const sample = 90 + (seed / 2 ** 32 - 0.5) * 6;
    const filtered = filter.update(sample, t);
    baseline = t === 0 ? sample : previous + (1 - Math.exp(-20 / 380)) * (sample - previous);
    previous = baseline;
    if (t >= 5000) {
      error += (filtered - 90) ** 2;
      baselineError += (baseline - 90) ** 2;
      count++;
    }
  }
  expect(Math.sqrt(error / count)).toBeLessThanOrEqual(Math.sqrt(baselineError / count));
});
