import type { Dua } from './duas.data';

// Bosnian transcription and meaning: reader's Hisnul-Muslimi photograph (127).
// English and Arabic: Hisn al-Muslim 136.
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
];
