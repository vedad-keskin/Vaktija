/** Calendar date parts in Europe/Sarajevo (BiH wall clock). */
export function sarajevoYmd(now = new Date()): { y: number; m: number; d: number } {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Sarajevo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const parts = fmt.formatToParts(now);
  const n = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? NaN);
  return { y: n('year'), m: n('month'), d: n('day') };
}

/** Stable cache key segment for “today” in Sarajevo (`yyyy-m-d`). */
export function sarajevoDayKey(now = new Date()): string {
  const { y, m, d } = sarajevoYmd(now);
  return `${y}-${m}-${d}`;
}
