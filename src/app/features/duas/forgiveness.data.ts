import type { Dua } from './duas.data';

// Bosnian 131 moved from Zaštita: it is the forgiveness said after a sin.
// Bosnian 240: reader's photograph of the repentance chapter. Its Arabic omits al-'Azim, as printed.
// English: Sunnah.com Hisn 140 and 250, with 250's "the Mighty" left out to match that printing.
export const FORGIVENESS_DUAS: readonly Dua[] = [
  {
    id: 'hisn-140',
    title: { bs: 'Dova nakon počinjenog grijeha', en: 'After committing a sin' },
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    instructions: {
      bs: 'Svakome vjerniku koji počini grijeh, pa potom lijepo uzme abdest, klanja dva rekata i zatim zamoli Allaha za oprost ovim riječima, Allah mu oprosti počinjeni grijeh.',
      en: 'After committing a sin, perform ablution well, pray two rak‘ahs, then ask Allah for forgiveness.',
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
    title: { bs: 'Traženje oprosta i pokajanje', en: 'Seeking forgiveness and repentance' },
    arabic: 'أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    instructions: {
      bs: 'Allah će mu oprostiti čak i ako je utekao sa bojnoga polja.',
      en: 'Allah will forgive him even if he has deserted the army’s ranks.',
    },
    transcription: {
      bs: 'Estagfirullāhe-l-leḏi lā ilāhe illā Huve-l-Hajju-l-Qajjūmu ve etūbu ilejhi.',
      en: "Astaghfirullāha ‘lladhī lā ilāha illā huwa ‘l-ḥayyul-Qayyūm wa atūbu ilayh.",
    },
    translation: {
      bs: 'Tražim oprosta od Allaha, osim Kojega drugoga boga nema, Živog i Postojanog, i Njemu se kajem.',
      en: 'I seek the forgiveness of Allah, Whom there is none worthy of worship except Him, the Living, the Eternal, and I repent to Him.',
    },
    reference: { bs: 'Hisnul-Muslimi, 240', en: 'Hisn al-Muslim, 250' },
    sourceUrl: 'https://sunnah.com/hisn:250',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=91',
  },
];
