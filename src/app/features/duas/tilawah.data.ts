import type { Dua } from './duas.data';

// Bosnian: reader's Hisnul-Muslimi photograph, page 39 (entry 50).
// Arabic and English: Hisn al-Muslim 50.
export const TILAWAH_DUAS: readonly Dua[] = [
  {
    id: 'hisn-50',
    title: { bs: 'Dova na sedždi tilaveta', en: 'During the prostration of recitation' },
    arabic:
      'سَجَدَ وَجْهِيَ لِلَّذِي خَلَقَهُ، وَشَقَّ سَمْعَهُ وَبَصَرَهُ بِحَوْلِهِ وَقُوَّتِهِ، فَتَبَارَكَ اللَّهُ أَحْسَنُ الْخَالِقِينَ',

    transcription: {
      bs: 'Sedžede vedžhi li-l-leḏi ḫaleqahū ve šeqqa sem‘ahū ve beṣarehū, bi ḥavlihī ve quvvetihī. Fe tebārekellāhu aḥsenu-l-ḫāliqin.',
      en: 'Sajada wajhiya lilladhī khalaqahu, wa shaqqa sam‘ahu wa baṣarahu biḥawlihi wa quwwatihi. Fatabārakallāhu aḥsanul-khāliqīn.',
    },
    translation: {
      bs: 'Sedždu čini lice moje Onome Koji ga stvori i na njemu oblikova sluh i vid Svojom moći i snagom. Blagoslovljen neka je Allah, najbolji Stvaratelj.',
      en: 'I have prostrated my face to the One Who created it, and gave it hearing and sight by His might and His power. Glory is to Allah, the Best of creators.',
    },
    reference: { bs: 'Hisnul-Muslimi, 50', en: 'Hisn al-Muslim, 50' },
    sourceUrl: 'https://sunnah.com/hisn:50',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=23',
  },
];
