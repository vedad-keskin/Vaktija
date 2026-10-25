import type { Dua } from './duas.data';

// Bosnian transcriptions and meanings: reader's photographs of the 2017 Hisnul-Muslimi, pages 20-21.
// English and Arabic: linked Sunnah.com Hisn al-Muslim entries, except HM-18 Arabic uses the Bosnian PDF's complete final word.
export const HOME_DUAS: readonly Dua[] = [
  {
    id: 'hisn-16',
    title: { bs: 'Dova pri izlasku iz kuće', en: 'When leaving home' },
    arabic: 'بِسْمِ اللهِ ، تَوَكَّلْـتُ عَلى اللهِ وَلا حَوْلَ وَلا قُـوَّةَ إِلاّ بِالله',
    transcription: {
      bs: 'Bismillāhi, tevekkeltu ‘alellāhi, ve lā ḥavle ve lā quvvete illā billāhi.',
      en: 'Bismillāhi, tawakkaltu `alallāhi, wa lā ḥawla wa lā quwwata illā billāh.',
    },
    translation: {
      bs: 'U ime Allaha, u Allaha se pouzdavam, nema snage niti moći bez Allahove snage i moći.',
      en: 'In the Name of Allah, I have placed my trust in Allah, there is no might and no power except by Allah.',
    },
    reference: { bs: 'Hisnul-Muslimi, 16', en: 'Hisn al-Muslim, 16' },
    sourceUrl: 'https://sunnah.com/hisn:16',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=11',
  },
  {
    id: 'hisn-18',
    title: { bs: 'Dova pri ulasku u kuću', en: 'When entering home' },
    arabic: 'بِسْمِ اللهِ وَلَجْنَا، وَبِسْمِ اللهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا',
    transcription: {
      bs: 'Bismillāhi veledžnā ve bismillāhi ḫaredžnā ve ‘alā Rabbinā tevekkelnā.',
      en: 'Bismillāhi walajnā, wa bismillāhi kharajnā, wa `ala Rabbinā tawakkalnā',
    },
    translation: {
      bs: 'S Allahovim imenom ulazimo i s Allahovim imenom izlazimo. Na Gospodara našega se oslanjamo.',
      en: 'In the Name of Allah we enter , in the Name of Allah we leave , and upon our Lord we depend',
    },
    reference: { bs: 'Hisnul-Muslimi, 18', en: 'Hisn al-Muslim, 18' },
    sourceUrl: 'https://sunnah.com/hisn:18',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=12',
  },
];
