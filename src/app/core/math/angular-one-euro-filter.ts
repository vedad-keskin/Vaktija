import { angleDeltaDeg } from './compass-heading';

// Degrees/seconds. Hardware tuning: lower MIN_CUTOFF for less rest jitter, raise BETA for faster turns.
const MIN_CUTOFF_HZ = 0.1;
const BETA = 0.04;
const DERIVATIVE_CUTOFF_HZ = 0.5;
export const COMPASS_STALE_MS = 1500;

/** Three-sample circular median followed by the 1€ filter (https://gery.casiez.net/1euro/). */
export class AngularOneEuroFilter {
  private samples: number[] = [];
  private previous = 0;
  private filtered = 0;
  private speed = 0;
  private timestamp: number | null = null;

  reset(): void {
    this.samples = [];
    this.speed = 0;
    this.timestamp = null;
  }

  /** Returns a continuous angle, including across 359°/0°. Timestamp is monotonic milliseconds. */
  update(heading: number, timestamp: number): number {
    if (this.timestamp === null || timestamp - this.timestamp > COMPASS_STALE_MS) {
      this.reset();
      this.previous = this.filtered = heading;
    } else if (timestamp <= this.timestamp) {
      return this.filtered;
    }
    this.samples.push(heading);
    if (this.samples.length > 3) this.samples.shift();
    // Only three samples: the circular medoid also handles a spike exactly 180° away.
    const deviation = (candidate: number) =>
      this.samples.reduce((sum, sample) => sum + Math.abs(angleDeltaDeg(sample, candidate)), 0);
    const median = this.samples.reduce((best, sample) =>
      deviation(sample) < deviation(best) ? sample : best,
    );
    const accepted = this.previous + angleDeltaDeg(median, this.previous);
    if (this.timestamp !== null) {
      const dt = (timestamp - this.timestamp) / 1000;
      const alpha = (cutoff: number) => 1 / (1 + 1 / (2 * Math.PI * cutoff * dt));
      this.speed += alpha(DERIVATIVE_CUTOFF_HZ) * ((accepted - this.previous) / dt - this.speed);
      this.filtered +=
        alpha(MIN_CUTOFF_HZ + BETA * Math.abs(this.speed)) * (accepted - this.filtered);
    }
    this.previous = accepted;
    this.timestamp = timestamp;
    return this.filtered;
  }
}
