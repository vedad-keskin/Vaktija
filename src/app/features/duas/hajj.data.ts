import type { Dua } from './duas.data';

// Bosnian titles, transcriptions and meanings: reader's 2017 photographs, pages 136–141 and 144.
// English and Arabic: linked Sunnah.com entries.
export const HAJJ_DUAS: readonly Dua[] = [
  {
    id: 'hisn-233',
    title: {
      bs: 'Telbijja hadža ili umre',
      en: 'The Hajj or Umrah talbiyah',
    },
    arabic:
      'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ والنِّعْمَة لَكَ والمُلْكُ، لَا شَرِيكَ لَكَ',
    transcription: {
      bs: 'Lebbejke-llāhumme lebbejk, lebbejke lā šerīke leke lebbejke. Inne-l-ḥamde ven-ni‘mete leke ve-l-mulk, lā šerīke lek.',
      en: 'Labbayk-Allāhumma labbayk, labbayka lā sharīka laka labbayk, inna ‘l-ḥamda, wanni`mata, laka wa ‘l-mulk, lā sharīka lak.',
    },
    translation: {
      bs: 'Odazivam Ti se, Allahu moj, odazivam. Odazivam se Tebi, Koji ravnoga Sebi nemaš, odazivam. Doista, zahvalnost i sve blagodati pripadaju Tebi, kao i sva vlast. Ti Sebi nemaš ravnoga.',
      en: 'I am here at Your service, O Allah, I am here at Your service. I am here at Your service, You have no partner, I am here at Your service. Surely the praise, and blessings are Yours, and the dominion. You have no partner.',
    },
    reference: { bs: 'Hisnul-Muslimi, 231', en: 'Hisn al-Muslim, 233' },
    sourceUrl: 'https://sunnah.com/hisn:233',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=89',
  },
  {
    id: 'hisn-236',
    title: { bs: 'Dova prilikom boravka na Saffi i Mervi', en: 'At Safa and Marwah' },
    sayings: [
      {
        arabic: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ.',
        instructions: {
          bs: 'Kada se približiš Saffi, prouči ovaj ajet:',
          en: 'As you approach Safa, recite this verse:',
        },
        transcription: {
          bs: 'Inne-ṣ-Ṣafā ve-l-Mervete min še‘ā’irillāh.',
          en: 'Innaṣ-Ṣafā wal-Marwata min sha‘ā’irillāh.',
        },
        translation: {
          bs: 'Safa i Merva su Allahova časna mjesta.',
          en: 'Safa and Marwah are among the signs of Allah.',
        },
      },
      {
        arabic:
          'لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ وَنَصَرَ عَبْدَهُ وَهَزَمَ الْأَحْزَابَ وَحْدَهُ.',
        instructions: {
          bs: 'Na Saffi se okreni prema Kibli i prouči ovu dovu, i nakon nje uputi svoju dovu, tako učini tri puta. Isto učiniti i na Mervi.',
          en: 'At Safa, face the Qiblah and recite this dua, and after it make your own dua, do this three times. Do the same at Marwah.',
        },
        transcription: {
          bs: 'Lā ilāhe illellāhu vallāhu ekber, lā ilāhe illellāhu vaḥdehū lā šerīke leh, lehu-l-mulku ve lehu-l-ḥamdu ve huve ‘alā kulli šej’in qadīr, lā ilāhe illellāhu vaḥdehū, endžeze va‘dehū ve neṣare ‘abdehū, ve hezeme-l-aḥzābe vaḥdehū.',
          en: 'Lā ilāha illallāhu wallāhu akbar. Lā ilāha illallāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ‘alā kulli shay’in qadīr. Lā ilāha illallāhu waḥdahu, anjaza wa‘dahu wa naṣara ‘abdahu wa hazamal-aḥzāba waḥdah.',
        },
        translation: {
          bs: 'Nema boga osim Allaha i Allah je najveći. Nema boga osim Allaha, Jedinoga, Koji Sebi ravnoga nema. Njemu pripada sva vlast i zahvalnost i On je iznad svega. Nema boga osim Allaha, Jedinoga, Koji ispunjava Svoje obećanje i pomaže Svojem robu, i sve protivnike Sam porazi.',
          en: 'There is no god but Allah, and Allah is greatest. There is no god but Allah alone, without partner. All dominion and praise are His, and He has power over all things. There is no god but Allah alone: He fulfilled His promise, helped His servant, and defeated the allied forces by Himself.',
        },
      },
    ],
    reference: { bs: 'Hisnul-Muslimi, 218', en: 'Hisn al-Muslim, 236' },
    sourceUrl: 'https://sunnah.com/hisn:236',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=83',
  },
  {
    id: 'hisn-235',
    title: {
      bs: 'Dova koja se uči između Jemenskog ugla Kabe i Crnoga kamena',
      en: 'Between the Yemeni corner and the black stone',
    },
    arabic:
      'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transcription: {
      bs: 'Rabbenā ātinā fi-d-dun’jā ḥaseneten ve fi-l-āḫireti ḥaseneten ve qinā ‘aḏābe-n-nāri.',
      en: 'Rabbanā ātinā fid-dunyā ḥasanah wa fi ‘l-ākhirati ḥasanah wa qinā `adhāban-nār.',
    },
    translation: {
      bs: 'Gospodaru naš, daj nam dobro na ovome svijetu i dobro na drugome svijetu. Sačuvaj nas džehenemske vatre.',
      en: 'Our Lord, grant us the good things in this world, and the good things in the next life, and save us from the punishment of the Fire.',
    },
    reference: { bs: 'Hisnul-Muslimi, 107', en: 'Hisn al-Muslim, 235' },
    sourceUrl: 'https://sunnah.com/hisn:235',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=83',
  },

  {
    id: 'hisn-237',
    title: { bs: 'Dova na dan Arefata', en: "The Day of 'Arafah" },
    arabic:
      'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',

    transcription: {
      bs: 'Lā ilāhe illellāhu vaḥdehū lā šerīke leh, lehu-l-mulku ve lehu-l-ḥamdu ve huve ‘alā kulli šej’in qadīr.',
      en: "Lā ilāha illallāhu waḥdahu lā sharīka lahu, lahul-mulku wa lahul-ḥamdu wa huwa `alā kulli shay'in qadīr.",
    },
    translation: {
      bs: 'Nema boga osim Allaha, Jedinoga, Koji Sebi ravnoga nema. Njemu pripada sva vlast i zahvalnost. On nad svime ima moć.',
      en: 'None has the right to be worshipped but Allah Alone, Who has no partner. His is the dominion and His is the praise, and He is Able to do all things.',
    },
    reference: { bs: 'Hisnul-Muslimi, 109', en: 'Hisn al-Muslim, 237' },
    sourceUrl: 'https://sunnah.com/hisn:237',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=84',
  },
  {
    id: 'hisn-238',
    title: {
      bs: 'Dova koja se uči na Muzdelifi',
      en: 'Remembrance at Muzdalifah',
    },
    arabic:
      'اللَّهُ أَكْبَرُ. لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',

    transcription: {
      bs: 'Allāhu ekber. Lā ilāhe illellāhu vaḥdehū lā šerīke leh. Lehu-l-mulku ve lehu-l-ḥamdu ve Huve ‘alā kulli šej’in Qadīr.',
      en: "Allāhu Akbar. Lā ilāha illallāhu waḥdahu lā sharīka lahu, lahul-mulku wa lahul-ḥamdu wa huwa `alā kulli shay'in qadīr.",
    },
    translation: {
      bs: 'Allah je najveći. Nema boga osim Allaha, Jedinoga, Koji Sebi ravnoga nema. Njemu pripada sva vlast i zahvalnost. On nad svime ima moć.',
      en: 'Allah is the Most Great. None has the right to be worshipped but Allah Alone, Who has no partner. His is the dominion and His is the praise, and He is Able to do all things.',
    },
    reference: { bs: 'Hisnul-Muslimi, 110', en: 'Hisn al-Muslim, 237' },
    sourceUrl: 'https://sunnah.com/hisn:237',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=85',
  },
];
