import type { Dua } from './duas.data';

// Bosnian transcriptions and meanings: reader's 2017 Hisnul-Muslimi photos (137–138, 140–142).
// HM-243 also follows the reader's 2017 photo (Bosnian 228); English and Arabic follow Sunnah.com.
export const ILLNESS_DUAS: readonly Dua[] = [
  {
    id: 'hisn-243',
    title: { bs: 'Dova pri tjelesnoj boli', en: 'For bodily pain' },
    arabic: 'بِسْمِ اللَّهِ. أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ',
    instructions: {
      bs: 'Stavi ruku na površinu tijela gdje osjećaš bol. Izgovori „Bismillāh” tri puta, zatim ostatak dove sedam puta.',
      en: 'Place your hand on the painful area. Say “Bismillāh” three times, then recite the rest seven times.',
    },
    transcription: {
      bs: 'Bismillāh. E‘ūḏu billāhi ve qudretihī min šerri mā edžidu ve uḥāḏiru.',
      en: 'Bismillāh. A`ūdhu billāhi wa qudratihi min sharri mā ajidu wa uḥādhir.',
    },
    translation: {
      bs: 'U ime Allaha. Tražim zaštitu od Allaha i Njegove svemoći protiv zla koga nalazim i koga se plašim.',
      en: 'With the Name of Allah. I seek refuge in Allah and in His Power from the evil of what I find and of what I guard against.',
    },
    reference: { bs: 'Hisnul-Muslimi, 228', en: 'Hisn al-Muslim, 243' },
    sourceUrl: 'https://sunnah.com/hisn:243',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=87',
  },
  {
    id: 'hisn-147',
    title: { bs: 'Dova pri posjeti bolesniku', en: 'Words when visiting the sick' },
    arabic: 'لا بأْسَ طَهـورٌ إِنْ شـاءَ الله',
    transcription: {
      bs: 'Lā be’se, ṭahūrun inšā’ Allāh.',
      en: "Lā ba'sa ṭahūrun in shā Allāh.",
    },
    translation: {
      bs: 'Ne bilo opasno. Allah ti s ovim grijehe očistio, ako Allah da.',
      en: 'Do not worry, it will be a purification (for you), Allah willing.',
    },
    reference: { bs: 'Hisnul-Muslimi, 137', en: 'Hisn al-Muslim, 147' },
    sourceUrl: 'https://sunnah.com/hisn:147',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=53',
  },
  {
    id: 'hisn-148',
    title: { bs: 'Dova za ozdravljenje bolesnika', en: 'For the sick person’s recovery' },
    arabic: 'أَسْـأَلُ اللهَ العَـظيـم، رَبَّ العَـرْشِ العَـظيـم أَنْ يَشْفـيك',
    instructions: {
      bs: 'Prilikom posjete bolesniku prouči ovu dovu sedam puta.',
      en: 'Recite seven times when visiting someone who is ill.',
    },
    transcription: {
      bs: 'Es’elullāhe-l-‘aẓīm Rabbe-l-‘Arši-l-‘aẓīmi en ješfijeke.',
      en: 'As’alullāha ‘l-`Aẓīma Rabba ‘l-`Arshil-`Aẓīmi an yashfiyak.',
    },
    translation: {
      bs: 'Molim Uzvišenog Allaha, Gospodara Prijestolja velikog, da ti da zdravlje.',
      en: 'I ask Almighty Allah, Lord of the Magnificent Throne, to make you well.',
    },
    reference: { bs: 'Hisnul-Muslimi, 138', en: 'Hisn al-Muslim, 148' },
    sourceUrl: 'https://sunnah.com/hisn:148',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=54',
  },
  {
    id: 'hisn-150',
    title: { bs: 'Dova bolesnika pred kraj života', en: 'Supplication near the end of life' },
    arabic: 'أللّهُـمَّ اغْفِـرْ لي وَارْحَمْـني وَأَلْحِقْـني بِالرَّفـيقِ الأّعْلـى',
    transcription: {
      bs: 'Allāhumma-gfir lī ve-rḥamnī ve elḥiqnī bi-r-refīqi-l-a‘lā.',
      en: "Allāhumma’ghfir lī warḥamnī wa alḥiqnī bir-rafīqi ‘l-'A`alā.",
    },
    translation: {
      bs: 'Allahu, oprosti mi i smiluj mi se. Pridruži me društvu najvišem.',
      en: 'O Allah, forgive me and have mercy upon me, and join me with the highest companions (in Paradise).',
    },
    reference: { bs: 'Hisnul-Muslimi, 140', en: 'Hisn al-Muslim, 150' },
    sourceUrl: 'https://sunnah.com/hisn:150',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=54',
  },
];
