import { getIzPrayerTimes } from './iz-timetable';

const officialFixtures = [
  { city: 'Sarajevo', id: 77, date: [2026, 1, 1], times: ['5:37', '7:15', '11:51', '14:01', '16:25', '17:52'] },
  { city: 'Sarajevo', id: 77, date: [2026, 3, 28], times: ['3:57', '5:31', '11:53', '15:23', '18:14', '19:34'] },
  { city: 'Sarajevo', id: 77, date: [2026, 3, 29], times: ['4:55', '6:29', '12:52', '16:23', '19:15', '20:36'] },
  { city: 'Sarajevo', id: 77, date: [2026, 10, 15], times: ['5:25', '6:54', '12:33', '15:33', '18:09', '19:28'] },
  { city: 'Sarajevo', id: 77, date: [2026, 10, 24], times: ['5:36', '7:06', '12:32', '15:22', '17:55', '19:14'] },
  { city: 'Sarajevo', id: 77, date: [2026, 10, 25], times: ['4:37', '6:07', '11:31', '14:21', '16:54', '18:13'] },
  { city: 'Banja Luka', id: 1, date: [2026, 10, 15], times: ['5:31', '7:00', '12:38', '15:37', '18:13', '19:32'] },
] as const;

for (const { city, id, date, times } of officialFixtures) {
  it(`matches vaktija.ba for ${city} on ${date.join('-')}`, () => {
    expect(getIzPrayerTimes(id, date[0], date[1], date[2])).toEqual([...times]);
  });
}

it('rejects invalid IZ dates and locations', () => {
  expect(() => getIzPrayerTimes(77, 2026, 2, 29)).toThrow(RangeError);
  expect(() => getIzPrayerTimes(999, 2026, 10, 15)).toThrow(RangeError);
});
