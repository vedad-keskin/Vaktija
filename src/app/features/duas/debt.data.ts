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
    id: 'hisn-121',
    title: { bs: 'Dova protiv brige i dugova', en: 'Against sorrow and debt' },
    arabic:
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحُزْنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    transcription: {
      bs: 'Allāhumme innī e‘ūḏu bike mine-l-hemmi vel-ḥazeni ve-l-‘adžzi ve-l-keseli ve-l-buḫli ve-l-džubni ve ḍal‘i-d-dejni ve galebeti-r-ridžāli.',
      en: "Allāhumma 'innī 'a`ūdhu bika mina ‘l-ḥammi wa ‘l-ḥuzn, wa ‘l-`ajzi wa ‘l-kasal, wa ‘l-bukhli wa ‘l-jubn, wa ḍala`id-dayn, wa ghalabatir-rijāl.",
    },
    translation: {
      bs: 'Allahu, tražim od Tebe zaštitu od brige i žalosti, od iznemoglosti i lijenosti, tvrdičluka i uspaničenosti te pred teretom dugovanja i ljudske nadmoći.',
      en: 'O Allah, I seek refuge in You from grief and sadness, from weakness and laziness, from miserliness and cowardice, from being overcome by debt and overpowered by others.',
    },
    reference: { bs: 'Hisnul-Muslimi, 116', en: 'Hisn al-Muslim, 121' },
    sourceUrl: 'https://sunnah.com/hisn:121',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=48',
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
