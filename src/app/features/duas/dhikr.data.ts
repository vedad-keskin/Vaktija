import { DUA_CATEGORIES, type Dua } from './duas.data';

type DhikrEntry = Dua & { categoryId: (typeof DUA_CATEGORIES)[number]['id'] };

// Reuse the dua's content and category; only its title can differ in Zikrovi.
function fromDua(id: string, title?: Dua['title']): DhikrEntry {
  for (const category of DUA_CATEGORIES) {
    const dua = category.items.find((item) => item.id === id);
    if (dua) return { ...dua, categoryId: category.id, title: title ?? dua.title };
  }
  throw new Error(`Unknown dua selected for Zikrovi: ${id}`);
}

// Bosnian: reader's Hisnul-Muslimi photographs, pages 148–156 (238, 240; chapter 128, 1–2, 5–10, 13–14).
// Book 238 maps to Hisn 248; book 240 maps to Hisn 250.
// For 240, Arabic/English follow Abu Dawud 1517 to match the book's Bosnian wording without al-'Azim.
export const DHIKR: readonly DhikrEntry[] = [
  // Zikr-only entries live here and choose an existing category with categoryId.
  {
    id: 'hisn-248',
    categoryId: 'forgiveness',
    title: { bs: 'Traženje oprosta i pokajanje', en: 'Seeking forgiveness and repentance' },
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    instructions: {
      bs: 'Poslanik ﷺ tražio je oprost od Allaha i kajao Mu se više od 70 puta dnevno.',
      en: 'The Prophet ﷺ sought Allah’s forgiveness and turned to Him in repentance more than 70 times a day.',
    },
    transcription: {
      bs: 'Estagfirullāhe ve etūbu ilejhi.',
      en: 'Astaghfirullāha wa atūbu ilayh.',
    },
    translation: {
      bs: 'Od Allaha tražim oprost i Njemu se kajem.',
      en: 'I seek Allah’s forgiveness and turn to Him in repentance.',
    },
    reference: { bs: 'Hisnul-Muslimi, 238', en: 'Hisn al-Muslim, 248' },
    sourceUrl: 'https://sunnah.com/hisn:248',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=91',
  },
  // Shared from Dove / Oprost. Omit the second argument to keep the dua's title.
  fromDua('hisn-250', { bs: 'Zikr za oprost grijeha', en: 'Dhikr for forgiveness' }),
  // Include more duas with fromDua('id') or fromDua('id', { bs: '...', en: '...' }).
  {
    id: 'bukhari-6403',
    categoryId: 'general',
    title: { bs: 'Tevhid', en: 'Declaration of Allah’s oneness' },
    arabic:
      'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    instructions: {
      bs: 'Proučiti ovo 100 puta dnevno. U hadisu se navode nagrada kao za oslobađanje 10 robova, upisivanje 100 dobrih djela, brisanje 100 grijeha i zaštita od šejtana do večeri.',
      en: 'This is recited 100 times a day. The hadith mentions a reward equivalent to freeing 10 slaves, 100 good deeds recorded, 100 sins erased, and protection from Satan until evening.',
    },
    transcription: {
      bs: 'Lā ilāhe illellāhu vaḥdehū lā šerīke leh, lehu-l-mulku ve lehu-l-ḥamdu ve Huve ‘alā kulli šej’in Qadīr.',
      en: 'Lā ilāha illallāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamd, wa huwa ‘alā kulli shay’in qadīr.',
    },
    translation: {
      bs: 'Nema boga osim Allaha, Jedinoga, Koji Sebi ravnoga nema. Njemu pripada sva vlast i zahvalnost, i On je iznad svega.',
      en: 'None is worthy of worship except Allah alone, without partner. His is all dominion and praise, and He has power over everything.',
    },
    reference: {
      bs: 'Hisnul-Muslimi, poglavlje 128, 1 · Buhari, 6403',
      en: 'Sahih al-Bukhari, 6403',
    },
    sourceUrl: 'https://sunnah.com/bukhari:6403',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=92',
  },
  {
    id: 'hisn-254',
    categoryId: 'forgiveness',
    title: { bs: 'Slavljenje Allaha i zahvala', en: 'Glorifying and praising Allah' },
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    instructions: {
      bs: 'Proučiti ovo 100 puta dnevno. U hadisu se navodi oprost grijeha, makar ih bilo poput morske pjene.',
      en: 'This is recited 100 times a day. The hadith describes forgiveness of sins, even if they are as abundant as sea foam.',
    },
    transcription: {
      bs: 'Subḥānallāhi ve bi ḥamdihī.',
      en: 'Subḥānallāhi wa biḥamdihi.',
    },
    translation: {
      bs: 'Neka je slavljen Allah i neka Mu je hvala.',
      en: 'Glory be to Allah, and all praise is His.',
    },
    reference: {
      bs: 'Hisnul-Muslimi, poglavlje 128, 2',
      en: 'Hisn al-Muslim, 254',
    },
    sourceUrl: 'https://sunnah.com/hisn:254',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=93',
  },
  {
    id: 'hisn-256',
    categoryId: 'general',
    title: { bs: 'Dvije lahke riječi', en: 'Two beloved phrases' },
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    instructions: {
      bs: 'Ove dvije riječi su lahke na jeziku, teške na Vagi i drage Svemilosnom.',
      en: 'These two phrases are easy to say, heavy on the Scale, and beloved to the Most Merciful.',
    },
    transcription: {
      bs: 'Subḥānallāhi ve bi ḥamdihī. Subḥānallāhi-l-‘Aẓīm.',
      en: 'Subḥānallāhi wa biḥamdihi, subḥānallāhil-‘Aẓīm.',
    },
    translation: {
      bs: 'Slavljen neka je Allah i hvaljen neka je. Slavljen da si Uzvišeni Allahu.',
      en: 'Glory and praise be to Allah. Glory be to Allah, the Most Great.',
    },
    reference: {
      bs: 'Hisnul-Muslimi, poglavlje 128, 5',
      en: 'Hisn al-Muslim, 256',
    },
    sourceUrl: 'https://sunnah.com/hisn:256',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=94',
  },
  {
    id: 'hisn-257',
    categoryId: 'general',
    title: { bs: 'Allahu najdraže četiri riječi', en: 'Four beloved phrases' },
    // Book entries 6 and 10 have the same recitation; keep one card with both sources.
    sayings: [
      {
        arabic:
          'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ',
        instructions: {
          bs: 'Ove četiri riječi Allahu su najdraže i može se početi bilo kojom od njih. Poslaniku ﷺ bile su draže od svega što sunce obasja.',
          en: 'These four phrases are the words most beloved to Allah, and recitation may begin with any of them. The Prophet ﷺ said they were dearer to him than everything the sun shines upon.',
        },
        transcription: {
          bs: 'Subḥānallāhi ve-l-ḥamdu lillāhi ve lā ilāhe illellāhu vallāhu ekber.',
          en: 'Subḥānallāh, wal-ḥamdu lillāh, wa lā ilāha illallāh, wallāhu akbar.',
        },
        translation: {
          bs: 'Slavljen neka je Allah i hvala Mu, nema boga osim Allaha, Allah je najveći.',
          en: 'Glory be to Allah, and praise be to Allah. None is worthy of worship except Allah, and Allah is the Greatest.',
        },
        sources: [
          {
            reference: {
              bs: 'Hisnul-Muslimi, poglavlje 128, 6',
              en: 'Hisn al-Muslim, 257',
            },
            sourceUrl: 'https://sunnah.com/hisn:257',
            bosnianSourceUrl:
              'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=94',
          },
          {
            reference: {
              bs: 'Hisnul-Muslimi, poglavlje 128, 10',
              en: 'Hisn al-Muslim, 261',
            },
            sourceUrl: 'https://sunnah.com/hisn:261',
            bosnianSourceUrl:
              'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=95',
          },
        ],
      },
    ],
  },
  {
    id: 'hisn-258',
    categoryId: 'forgiveness',
    title: { bs: 'Tesbih za brisanje grijeha', en: 'Tasbih for forgiveness' },
    arabic: 'سُبْحَانَ اللَّهِ',
    instructions: {
      bs: 'Proučiti ovo 100 puta dnevno. U hadisu se navodi da se za to upisuje 1.000 dobrih djela ili briše 1.000 grijeha.',
      en: 'This is recited 100 times a day. The hadith describes 1,000 good deeds being recorded or 1,000 sins being erased.',
    },
    transcription: { bs: 'Subḥānallāh.', en: 'Subḥānallāh.' },
    translation: {
      bs: 'Neka je slavljen Allah i neka Mu je hvala.',
      en: 'Glory be to Allah.',
    },
    reference: {
      bs: 'Hisnul-Muslimi, poglavlje 128, 7',
      en: 'Hisn al-Muslim, 258',
    },
    sourceUrl: 'https://sunnah.com/hisn:258',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=95',
  },
  {
    id: 'hisn-259',
    categoryId: 'general',
    title: { bs: 'Palma u Džennetu', en: 'A palm tree in Paradise' },
    arabic: 'سُبْحَانَ اللَّهِ الْعَظِيمِ وَبِحَمْدِهِ',
    instructions: {
      bs: 'U predaji se navodi da će onome ko izgovori ove riječi u Džennetu biti zasađena palma.',
      en: 'The narration mentions a date palm being planted in Paradise for whoever says these words.',
    },
    transcription: {
      bs: 'Subḥānallāhi-l-‘Aẓīm ve bi ḥamdihī.',
      en: 'Subḥānallāhil-‘Aẓīmi wa biḥamdihi.',
    },
    translation: {
      bs: 'Slavljen neka je Uzvišeni Allah i neka Mu je hvala.',
      en: 'Glory and praise be to Allah, the Most Great.',
    },
    reference: {
      bs: 'Hisnul-Muslimi, poglavlje 128, 8',
      en: 'Hisn al-Muslim, 259',
    },
    sourceUrl: 'https://sunnah.com/hisn:259',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=95',
  },
  {
    id: 'hisn-260',
    categoryId: 'general',
    title: { bs: 'Jedna od džennetskih riznica', en: 'A treasure of Paradise' },
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    instructions: {
      bs: 'Poslanik ﷺ nazvao je ove riječi jednom od džennetskih riznica.',
      en: 'The Prophet ﷺ described these words as one of the treasures of Paradise.',
    },
    transcription: {
      bs: 'Lā ḥavle ve lā quvvete illā billāhi.',
      en: 'Lā ḥawla wa lā quwwata illā billāh.',
    },
    translation: {
      bs: 'Nema snage niti moći mimo Allaha.',
      en: 'There is no strength or power except through Allah.',
    },
    reference: {
      bs: 'Hisnul-Muslimi, poglavlje 128, 9',
      en: 'Hisn al-Muslim, 260',
    },
    sourceUrl: 'https://sunnah.com/hisn:260',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=95',
  },
  {
    id: 'hisn-264',
    categoryId: 'general',
    title: { bs: 'Najbolja dova i najbolji zikr', en: 'The best supplication and remembrance' },
    sayings: [
      {
        arabic: 'الْحَمْدُ لِلَّهِ',
        instructions: {
          bs: 'U predaji se ove riječi navode kao najbolja dova.',
          en: 'The narration describes these words as the best supplication.',
        },
        transcription: { bs: 'El-ḥamdu lillāhi.', en: 'Alḥamdulillāh.' },
        translation: { bs: 'Hvala Allahu.', en: 'Praise be to Allah.' },
      },
      {
        arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
        instructions: {
          bs: 'U predaji se ove riječi navode kao najbolji spomen Allaha.',
          en: 'The narration describes these words as the best remembrance of Allah.',
        },
        transcription: { bs: 'Lā ilāhe illellāhu.', en: 'Lā ilāha illallāh.' },
        translation: {
          bs: 'Nema istinskoga boga osim Allaha.',
          en: 'None is worthy of worship except Allah.',
        },
      },
    ],
    reference: {
      bs: 'Hisnul-Muslimi, poglavlje 128, 13',
      en: 'Hisn al-Muslim, 264',
    },
    sourceUrl: 'https://sunnah.com/hisn:264',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=97',
  },
  {
    id: 'hisn-265',
    categoryId: 'general',
    title: { bs: 'Trajno vrijedne riječi', en: 'Enduring good deeds' },
    arabic:
      'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transcription: {
      bs: 'Subḥānallāhi ve-l-ḥamdu lillāhi ve lā ilāhe illallāhu, vallāhu ekber, ve lā ḥavle ve lā quvvete illā billāh.',
      en: 'Subḥānallāh, wal-ḥamdu lillāh, wa lā ilāha illallāh, wallāhu akbar, wa lā ḥawla wa lā quwwata illā billāh.',
    },
    translation: {
      bs: 'Neka je slavljen Allah, i neka Mu je hvala. Nema boga osim Allaha i On je najveći. Nema snage niti moći mimo Allaha.',
      en: 'Glory be to Allah, and praise be to Allah. None is worthy of worship except Allah, and Allah is the Greatest. There is no strength or power except through Allah.',
    },
    reference: {
      bs: 'Hisnul-Muslimi, poglavlje 128, 14',
      en: 'Hisn al-Muslim, 265',
    },
    sourceUrl: 'https://sunnah.com/hisn:265',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=97',
  },
  /* Previous entries retained for later review.

  {
    id: 'hawqala',
    title: { bs: 'Snaga je kod Allaha', en: 'Strength comes from Allah' },
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transcription: {
      bs: 'Lā ḥavle ve lā quvvete illā billāh.',
      en: 'Lā ḥawla wa lā quwwata illā billāh.',
    },
    translation: {
      bs: 'Nema moći ni snage osim uz Allaha.',
      en: 'There is no power or strength except through Allah.',
    },
    reference: { bs: 'Sahih el-Buhari, 6409', en: 'Sahih al-Bukhari, 6409' },
    sourceUrl: 'https://sunnah.com/bukhari:6409',
  },

  */
];

// Category names come from Dove; only categories containing selected zikrovi appear.
export const DHIKR_CATEGORIES = DUA_CATEGORIES.map(({ id, label }) => ({
  id,
  label,
  items: DHIKR.filter((item) => item.categoryId === id),
})).filter((category) => category.items.length > 0);
