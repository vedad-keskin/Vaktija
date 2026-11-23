import { expect, it } from 'vitest';
import { AFTER_PRAYER_DUAS } from './after-prayer.data';
import { entryCopyText } from './dua-copy';
import { GENERAL_DUAS } from './general.data';

it('copies a flat card and a multi-saying card like the mobile entry', () => {
  const flat = GENERAL_DUAS[0];
  expect(entryCopyText(flat, 'bs')).toBe(
    [
      'Dova potrebe',
      'رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ',
      'Rabbi innī limā enzelte ilejje min ḫajrin faqīr.',
      'Gospodaru moj, meni je zaista potrebno svako dobro koje mi Ti spustiš.',
      'Kur’an, 28:24\nhttps://quranenc.com/bs/browse/bosnian_korkut/28/24',
    ].join('\n\n'),
  );
  expect(entryCopyText(flat, 'en')).toContain('https://quran.com/28/24');
  expect(entryCopyText(flat, 'en')).not.toContain('quranenc.com');

  const card = AFTER_PRAYER_DUAS[0];
  if (!card.sayings) throw new Error('expected sayings');
  const text = entryCopyText(card, 'bs');
  const last = card.sayings[card.sayings.length - 1];
  expect(text.startsWith(card.title.bs)).toBe(true);
  expect(text).toContain(card.sayings[0].instructions?.bs);
  expect(text).toContain(last.arabic);
  expect(text).toContain(last.sources?.[0].bosnianSourceUrl);
});
