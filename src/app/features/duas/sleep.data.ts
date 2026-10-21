import type { Dua } from './duas.data';

// Bosnian meaning: IslamHouse Hisnul-Muslimi, entries 1–2.
// English and Arabic: Sunnah.com Hisn al-Muslim, entries 1–2.
// Bosnian transcriptions follow the reader's photograph of the 2017 edition.
// HM-2 ends with Allahumma-gfir li there; the English/Arabic Sunnah.com edition uses rabbighfir li.
export const SLEEP_DUAS: readonly Dua[] = [
  {
    id: 'hisn-1',
    title: { bs: 'Dova pri buđenju iz sna', en: 'Upon waking up' },
    arabic: 'الحَمْـدُ لِلّهِ الّذي أَحْـيانا بَعْـدَ ما أَماتَـنا وَإليه النُّـشور',
    transcription: {
      bs: 'El-ḥamdu lillāhi-lleḏī aḥjānā ba‘de mā emātenā ve ilejhi-n-nušūr.',
      en: "Alḥamdu lillāhil-ladhī 'aḥyānā ba`da mā 'amātanā wa 'ilayhin-nushūr.",
    },
    translation: {
      bs: 'Hvala Allahu, Koji nas oživi nakon što nas usmrti, i Njemu se, konačno, sve vraća.',
      en: 'Praise is to Allah Who gives us life after He has caused us to die and to Him is the return.',
    },
    reference: { bs: 'Hisnul-Muslimi, 1', en: 'Hisn al-Muslim, 1' },
    sourceUrl: 'https://sunnah.com/hisn:1',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=7',
  },
  {
    id: 'hisn-2',
    title: { bs: 'Dova pri buđenju tokom noći', en: 'Upon waking during the night' },
    arabic: 'لا إلهَ إلاّ اللّهُ وَحْـدَهُ لا شَـريكَ له، لهُ المُلـكُ ولهُ الحَمـد، وهوَ على كلّ شيءٍ قدير، سُـبْحانَ اللهِ، والحمْـدُ لله، ولا إلهَ إلاّ اللهُ واللهُ أكبَر، وَلا حَولَ وَلا قوّة إلاّ باللّهِ العليّ العظيم، رَبِّ اغْفرْ لي',
    transcription: {
      bs: 'Lā ilāhe illellāhu vaḥdehū lā šerīke leh, lehu-l-mulku ve lehu-l-ḥamdu, ve huve ‘alā kulli šej’in qadīr. Subḥānallāhi ve-l-ḥamdu lillāhi ve lā ilāhe illellāhu vallāhu ekber, ve lā ḥavle ve lā quvvete illā billāhi-l-‘Alijji-l-‘Aẓīm. Allahumma-gfir li.',
      en: "Lā 'ilāha 'illallāhu waḥdahu la sharīka lahu, lahul-mulku wa lahul-ḥamdu, wa huwa 'alā kulli shay'in qadīr Subḥānallāhi, walḥamdu lillāhi, wa lā 'ilāha 'illallāhu, wallāhu 'akbar, wa lā ḥaula wa lā quwwata 'illā billāhil-`aliyyil-`aẓīm, rabbighfir lī.",
    },
    translation: {
      bs: 'Nema boga osim Allaha, Jedinoga, Koji Sebi ravnoga nema. Njemu vlast pripada i Njemu pripada svaka zahvalnost. Njegova je moć iznad svake druge moći, neka je slavljen Allah i neka Mu je hvala; nema boga osim Allaha. Allah je najveći. Nema moći i sile osim Allahove, Moćnog i Velikog. Gospodaru moj, oprosti mi.',
      en: "There is none worthy of worship but Allah alone, Who has no partner, His is the dominion and to Him belongs all praise, and He is able to do all things. Glory is to Allah. Praise is to Allah. There is none worthy of worship but Allah. Allah is the Most Great. There is no might and no power except by Allah's leave, the Exalted, the Mighty. My Lord, forgive me.",
    },
    reference: { bs: 'Hisnul-Muslimi, 2', en: 'Hisn al-Muslim, 2' },
    sourceUrl: 'https://sunnah.com/hisn:2',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=7',
  },
];
