import type { Dua } from './duas.data';

// Bosnian meanings: IslamHouse Hisnul-Muslimi, entries 12–13.
// English and Arabic: Sunnah.com Hisn al-Muslim, entries 12–13.
// Bosnian transcription uses the photographed 2017 letter key (see README-full).
export const ABLUTION_DUAS: readonly Dua[] = [
  {
    id: 'hisn-12',
    title: { bs: 'Dova prije uzimanja abdesta', en: 'Before ablution' },
    arabic: 'بِسْمِ الله',
    transcription: {
      bs: 'Bismillāh.',
      en: 'Bismillāhi',
    },
    translation: {
      bs: 'U ime Allaha.',
      en: 'In the Name of Allah',
    },
    reference: { bs: 'Hisnul-Muslimi, 12', en: 'Hisn al-Muslim, 12' },
    sourceUrl: 'https://sunnah.com/hisn:12',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=14',
  },
  {
    id: 'hisn-13',
    title: { bs: 'Dova nakon uzimanja abdesta', en: 'Upon completing the ablution' },
    arabic:
      'أَشْهَدُ أَنْ لا إِلَـهَ إِلاّ اللهُ وَحْدَهُ لا شَريـكَ لَـهُ وَأَشْهَدُأَنَّ مُحَمّـداً عَبْـدُهُ وَرَسـولُـه',
    transcription: {
      bs: 'Ešhedu en lā ilāhe illellāhu vaḥdehu lā šerīke lehu ve ešhedu enne Muḥammeden ‘abduhu ve resūluhu.',
      en: "'Ash-hadu 'an lā 'ilāha 'illallāhu waḥdahu lā sharīka lahu wa 'ash-hadu 'anna Muḥammadan `abduhu wa Rasūluhu.",
    },
    translation: {
      bs: 'Svjedočim da nema boga osim Allaha i svjedočim da je Muhammed Njegov rob i Njegov Poslanik.',
      en: 'I bear witness that none has the right to be worshipped but Allah alone, Who has no partner; and I bear witness that Muhammad is His slave and His Messenger.',
    },
    reference: { bs: 'Hisnul-Muslimi, 13', en: 'Hisn al-Muslim, 13' },
    sourceUrl: 'https://sunnah.com/hisn:13',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=14',
  },
];
