import timetable from '../data/iz-vaktija.json';

// vaktija.ba's published timetable and city corrections, compacted into data/iz-vaktija.json:
// https://github.com/vaktija/vaktija.ba/blob/2c85071f34dc30ea701a98b1ed44a702610ad427/src/data/vaktija.json
// ponytail: this pinned snapshot needs refreshing if vaktija.ba revises its timetable.
const sarajevoHour = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Sarajevo',
  hour: 'numeric',
  hourCycle: 'h23',
});

/** The six IZ times in the same order as vaktija.ba's `vakat` response. */
export function getIzPrayerTimes(
  locationId: number,
  year: number,
  month: number,
  day: number,
): string[] {
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    throw new RangeError('Invalid IZ date');
  }

  const base = timetable.months[month - 1]?.[day - 1];
  const adjustment = timetable.differences[locationId]?.[month - 1];
  if (!base || !adjustment || base.length !== 6 || adjustment.length !== 6) {
    throw new RangeError('Invalid IZ location or timetable');
  }

  const summerMinutes = Number(sarajevoHour.format(date)) === 14 ? 60 : 0;
  return base.map((seconds, i) => {
    const minutes = (seconds + adjustment[i]) / 60 + summerMinutes;
    return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
  });
}
