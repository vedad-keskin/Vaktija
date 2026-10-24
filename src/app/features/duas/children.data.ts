import type { Dua } from './duas.data';

// Bosnian transcription and meaning: reader's Hisnul-Muslimi photograph (136).
// English and Arabic: Hisn al-Muslim 146.
export const CHILDREN_DUAS: readonly Dua[] = [
  {
    id: 'hisn-146',
    title: { bs: 'Dova za zaštitu djece', en: 'Protection for children' },
    arabic:
      'أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
    transcription: {
      bs: 'U‘īdukumā bi kelimātillāhi-t-tāmmāti min kulli šejtānin ve hāmmetin, ve min kulli ‘ajnin lāmmetin.',
      en: 'U`īthukumā bikalimāti ‘llāhit-tāmmati min kulli shayṭānin wa hāmmah, wa min kulli `aynin lāmmah.',
    },
    translation: {
      bs: 'Zaštitu Allahovu molim za vas pomoću Allahovih savršenih riječi od svakog šejtana, zloslutnje i od zloga pogleda.',
      en: 'I seek protection for you in the Perfect Words of Allah from every devil and every beast, and from every envious blameworthy eye.',
    },
    reference: { bs: 'Hisnul-Muslimi, 136', en: 'Hisn al-Muslim, 146' },
    sourceUrl: 'https://sunnah.com/hisn:146',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=53',
  },
];
