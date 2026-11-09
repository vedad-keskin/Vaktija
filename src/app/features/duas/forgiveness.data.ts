import type { Dua } from './duas.data';

// Bosnian 131 moved from Zaštita: it is the forgiveness said after a sin.
// Bosnian 240: the photographed Bosnian transcription omits al-'Azim.
// Its Arabic/English use the matching shorter variant in Abu Dawud 1517.
export const FORGIVENESS_DUAS: readonly Dua[] = [
  {
    id: 'hisn-140',
    title: { bs: 'Dova nakon počinjenog grijeha', en: 'After committing a sin' },
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    instructions: {
      bs: 'Nakon počinjenog grijeha lijepo uzeti abdest, klanjati 2 rekata, pa zamoliti Allaha za oprost. U hadisu se navodi da Allah tada oprašta počinjeni grijeh.',
      en: 'After committing a sin, ablution is performed well, 2 rak‘ahs are offered, and Allah’s forgiveness is sought. The hadith states that Allah then forgives the sin.',
    },
    transcription: { bs: 'Estagfirullāh.', en: 'Astaghfirullāh.' },
    translation: { bs: 'Tražim oprost od Allaha.', en: 'I seek Allah’s forgiveness.' },
    reference: { bs: 'Hisnul-Muslimi, 131', en: 'Hisn al-Muslim, 140' },
    sourceUrl: 'https://sunnah.com/hisn:140',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=52',
  },
  {
    id: 'hisn-250',
    title: { bs: 'Dova za oprost grijeha', en: 'Supplication for forgiveness' },
    arabic:
      'أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    instructions: {
      bs: 'Onome ko izgovori ovaj zikr Allah će oprostiti čak i ako je utekao sa bojnoga polja.',
      en: 'Whoever says this will be forgiven, even if they fled from the battlefield.',
    },
    transcription: {
      bs: 'Estagfirullāhe-l-leḏī lā ilāhe illā Huve-l-Ḥajju-l-Qajjūmu ve etūbu ilejhi.',
      en: 'Astaghfirullāha alladhī lā ilāha illā huwal-Ḥayyul-Qayyūmu wa atūbu ilayh.',
    },
    translation: {
      bs: 'Tražim oprosta od Allaha, osim Kojega drugoga boga nema, Živog i Postojanog Održavatelja, i Njemu se kajem.',
      en: 'I seek forgiveness from Allah, besides Whom none is worthy of worship, the Ever-Living, the Sustainer, and I turn to Him in repentance.',
    },
    reference: {
      bs: 'Hisnul-Muslimi, 240 · Ebu Davud, 1517',
      en: 'Hisn al-Muslim, 250 · Abu Dawud, 1517',
    },
    sourceUrl: 'https://sunnah.com/abudawud:1517',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=91',
  },
];
