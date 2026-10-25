import type { Dua } from './duas.data';

// Bosnian transcription and meaning: reader's Hisnul-Muslimi photograph (236).
// English and Arabic: Hisn al-Muslim 246.
export const KURBAN_DUAS: readonly Dua[] = [
  {
    id: 'hisn-246',
    title: {
      bs: 'Dova prilikom klanja životinje ili kurbana',
      en: 'When slaughtering or offering a sacrifice',
    },
    arabic: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ [اللَّهُمَّ مِنْكَ وَلَكَ] اللَّهُمَّ تَقَبَّلْ مِنِّي',
    transcription: {
      bs: 'Bismillāhi vallāhu ekber. (Allāhumme minke ve leke.) Allāhumme teqabbel minni.',
      en: 'Bismillāh wallāhu Akbar [Allāhumma minka wa lak] Allāhumma taqabbal minnī.',
    },
    translation: {
      bs: 'U ime Allaha, Allah je najveći. (Allahu moj, ovo je od Tebe i Tebi ga darujem.) Allahu moj, primi ovo od mene.',
      en: 'With the Name of Allah, Allah is the Most Great! [O Allah, from You and to You.] O Allah, accept it from me.',
    },
    reference: { bs: 'Hisnul-Muslimi, 236', en: 'Hisn al-Muslim, 246' },
    sourceUrl: 'https://sunnah.com/hisn:246',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=90',
  },
];
