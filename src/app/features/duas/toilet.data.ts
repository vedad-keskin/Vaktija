import type { Dua } from './duas.data';

// Bosnian meanings: IslamHouse Hisnul-Muslimi, entries 10–11.
// English and Arabic: Sunnah.com Hisn al-Muslim, entries 10–11.
// Bosnian transcription uses the photographed 2017 letter key (see README-full).
export const TOILET_DUAS: readonly Dua[] = [
  {
    id: 'hisn-10',
    title: { bs: 'Dova prije ulaska u toalet', en: 'Before entering the bathroom' },
    arabic: 'بِسْمِ الله اللّهُـمَّ إِنِّـي أَعـوذُ بِـكَ مِـنَ الْخُـبْثِ وَالْخَبائِث',
    transcription: {
      bs: 'Bismillāhi, Allāhumme innī e‘ūḏu bike mine-l-ẖubṯi ve-l-ẖabā’iṯi.',
      en: "[Bismillāhi] Allāhumma 'innī 'a`ūdhu bika minal-khubthi walkhabā'ith.",
    },
    translation: {
      bs: 'U ime Allaha, Allahu moj, prizivam Te protiv zla muških i ženskih šejtana.',
      en: '[In the Name of Allah]. O Allah, I seek protection in You from evil and the evil ones (or, from the evil male and female Jinn).',
    },
    reference: { bs: 'Hisnul-Muslimi, 10', en: 'Hisn al-Muslim, 10' },
    sourceUrl: 'https://sunnah.com/hisn:10',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=14',
  },
  {
    id: 'hisn-11',
    title: { bs: 'Dova poslije izlaska iz toaleta', en: 'After leaving the bathroom' },
    arabic: 'غُفْـرانَك',
    transcription: {
      bs: 'Gufrāneke.',
      en: 'Ghufrānaka',
    },
    translation: {
      bs: 'Za oprost Te molim.',
      en: 'I seek Your forgiveness.',
    },
    reference: { bs: 'Hisnul-Muslimi, 11', en: 'Hisn al-Muslim, 11' },
    sourceUrl: 'https://sunnah.com/hisn:11',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=14',
  },
];
