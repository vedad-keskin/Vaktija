import type { Dua } from './duas.data';

// Bosnian meanings and recitation: IslamHouse Hisnul-Muslimi, entries 5–7 and 9.
// English and Arabic: Sunnah.com Hisn al-Muslim, entries 5–7 and 9.
// Bosnian transcription adapts the published recitation with the photographed letter key.
export const CLOTHING_DUAS: readonly Dua[] = [
  {
    id: 'hisn-5',
    title: { bs: 'Dova pri odijevanju odjeće', en: 'When wearing a garment' },
    arabic: 'الحمدُ للهِ الّذي كَساني هذا الثّوب وَرَزَقَنيه مِنْ غَـيـْرِ حَولٍ مِنّي وَلا قـوّة',
    transcription: {
      bs: 'El-ḥamdu lillāhi-lleḏī kesānī hāḏā eṯ-ṯevbe ve rezaqanīhi min gajri ḥavlin minnī ve lā quvvetin.',
      en: 'Alḥamdu lillāhil-ladhī kasānī hādhā (aththawba) wa razaqanīhi min ghayri hawlim-minnī wa lā quwwah.',
    },
    translation: {
      bs: 'Hvala Allahu, Koji me odjenuo ovom odjećom i Koji me opskrbio bez moje snage i moći.',
      en: 'Praise is to Allah Who has clothed me with this (garment) and provided it for me, though I was powerless myself and incapable.',
    },
    reference: { bs: 'Hisnul-Muslimi, 5', en: 'Hisn al-Muslim, 5' },
    sourceUrl: 'https://sunnah.com/hisn:5',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=8',
  },
  {
    id: 'hisn-9',
    title: { bs: 'Dova pri odlaganju odjeće', en: 'Before undressing' },
    arabic: 'بِسْمِ الله',
    transcription: { bs: 'Bismillāh.', en: 'Bismillāhi' },
    translation: { bs: 'U ime Allaha.', en: 'In the Name of Allah.' },
    reference: { bs: 'Hisnul-Muslimi, 9', en: 'Hisn al-Muslim, 9' },
    sourceUrl: 'https://sunnah.com/hisn:9',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=9',
  },
  {
    id: 'hisn-6',
    title: { bs: 'Dova pri odijevanju nove odjeće', en: 'When wearing a new garment' },
    arabic: 'اللّهُـمَّ لَـكَ الحَـمْـدُ أنْـتَ كَسَـوْتَنيهِ، أََسْأََلُـكَ مِـنْ خَـيرِهِ وَخَـيْرِ مَا صُنِعَ لَـه، وَأَعوذُ بِكَ مِـنْ شَـرِّهِ وَشَـرِّ مـا صُنِعَ لَـهُ',
    transcription: {
      bs: 'Allāhumme leke-l-ḥamdu, Ente kesevtenīhi. Es’eluke min ḫajrihi ve ḫajri mā ṣuni‘a lehu. Ve e‘ūḏu bike min šerrihi ve šerri mā ṣuni‘a lehu.',
      en: "Allāhumma lakal-ḥamdu 'anta kasawtanīhi, 'as'aluka min khayrihi wa khayri mā ṣuni`a lahu, wa 'a`oothu bika min sharrihi wa sharri mā ṣuni`a lahu.",
    },
    translation: {
      bs: 'Allahu moj, Tebi hvala. Ti si me ovim odjenuo. Molim Te da mi u tome daš dobro i dobro u onom zbog čega je spravljena, a utječem Ti se od protiv zla njegova i zla onoga zbog čega je spravljena.',
      en: 'O Allah, praise is to You. You have clothed me. I ask You for its goodness and the goodness of what it has been made for, and I seek Your protection from the evil of it and the evil of what it has been made for.',
    },
    reference: { bs: 'Hisnul-Muslimi, 6', en: 'Hisn al-Muslim, 6' },
    sourceUrl: 'https://sunnah.com/hisn:6',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=9',
  },
  {
    id: 'hisn-7',
    title: { bs: 'Dova onome ko odjene novu odjeću', en: 'To someone wearing a new garment' },
    arabic: 'تُبْـلي وَيُـخْلِفُ اللهُ تَعَالى',
    transcription: {
      bs: 'Tublī ve juḫlifullāhu te‘ālā.',
      en: 'Tublī wa yukhliful-lāhu ta`ālā.',
    },
    translation: {
      bs: 'Iznosio je, a novom ti Allah nadomjestio.',
      en: 'May Allah replace it when it is worn out.',
    },
    reference: { bs: 'Hisnul-Muslimi, 7', en: 'Hisn al-Muslim, 7' },
    sourceUrl: 'https://sunnah.com/hisn:7',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=9',
  },
];
