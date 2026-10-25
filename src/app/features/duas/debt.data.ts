import type { Dua } from './duas.data';

// Bosnian 127, 189 and 190: reader's photographs. 190's Latin line is the opening only;
// its second clause follows the printed Arabic. English and Arabic: Hisn 136, 201, 202.
export const DEBT_DUAS: readonly Dua[] = [
  {
    id: 'hisn-136',
    title: { bs: 'Dova za oslobađanje od duga', en: 'For relief from debt' },
    arabic:
      'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    transcription: {
      bs: 'Allāhumme-kfinī bi ḥalālike ‘an ḥarāmike, ve agninī bi faḍlike ‘ammen sivāke.',
      en: "Allāhummak-finī biḥalālika `an ḥarāmik, wa 'aghninī bi faḍlika `amman siwāk.",
    },
    translation: {
      bs: 'Allahu, zaštiti me Svojim halalom od Svoga harama i iz obilja Tvoga me učini bogatim (neovisnim) od svakoga drugog osim Tebe.',
      en: 'O Allah, suffice me with what You have allowed instead of what You have forbidden, and make me independent of all others besides You.',
    },
    reference: { bs: 'Hisnul-Muslimi, 127', en: 'Hisn al-Muslim, 136' },
    sourceUrl: 'https://sunnah.com/hisn:136',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=50',
  },
  {
    id: 'hisn-201',
    title: {
      bs: 'Dova prilikom vraćanja duga za onoga ko ti je posudio',
      en: 'To one who has offered you some of his wealth',
    },
    arabic: 'بارَكَ اللهُ لَكَ في أَهْلِكَ وَمالِك',
    transcription: {
      bs: 'Bārekellāhu leke fī ehlike ve mālike.',
      en: 'Bārakallāhu laka fī ahlika wa mālik.',
    },
    translation: {
      bs: 'Allah ti dao blagoslov u tvojoj porodici i tvojoj imovini.',
      en: 'May Allah bless you in your family and your property.',
    },
    reference: { bs: 'Hisnul-Muslimi, 189', en: 'Hisn al-Muslim, 201' },
    sourceUrl: 'https://sunnah.com/hisn:201',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=72',
  },
];
