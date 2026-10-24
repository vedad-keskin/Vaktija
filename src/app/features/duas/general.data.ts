import type { Dua } from './duas.data';

// Bosnian meanings: IslamHouse Hisnul-Muslimi, entries 77, 80, 82, 79, and 177.
// Bosnian transcription adapts that edition using the reader's 2017 letter key.
// English and Arabic: Sunnah.com Hisn al-Muslim, entries 79, 84, 86, 97, and 188.
export const GENERAL_DUAS: readonly Dua[] = [
  {
    id: 'hisn-188',
    title: { bs: 'Dova prilikom kihanja', en: 'Upon sneezing' },
    sayings: [
      {
        arabic: 'الْحَمْدُ لِلَّهِ',
        instructions: { bs: 'Kad kihneš, reci:', en: 'When you sneeze, say:' },
        transcription: { bs: 'El-ḥamdu lillāhi.', en: 'Alḥamdulillāh.' },
        translation: { bs: 'Hvala Allahu.', en: 'All praises and thanks are to Allah.' },
      },
      {
        arabic: 'يَرْحَمُكَ اللَّهُ',
        instructions: {
          bs: 'Kad neko kihne i zahvali Allahu, reci:',
          en: 'When someone sneezes and praises Allah, reply:',
        },
        transcription: { bs: 'Jerḥamukellāhu.', en: 'Yarḥamukallāh.' },
        translation: { bs: 'Allah ti se smilovao.', en: 'May Allah have mercy upon you.' },
      },
      {
        arabic: 'يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ',
        instructions: {
          bs: 'Nakon neko to čuje neka uzvrati sa:',
          en: 'When someone responds to your sneeze with “Yarḥamukallāh”, say:',
        },
        transcription: {
          bs: 'Jehdikumullāhu ve juṣliḥ bālekum.',
          en: 'Yahdīkumu ‘llāhu wa yuṣliḥu bālakum.',
        },
        translation: {
          bs: 'Allah te uputio i popravio tvoje stanje.',
          en: 'May Allah guide you and set your affairs in order.',
        },
      },
    ],
    reference: { bs: 'Hisnul-Muslimi, 177', en: 'Hisn al-Muslim, 188' },
    sourceUrl: 'https://sunnah.com/hisn:188',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=67',
  },
  // {
  //   id: 'hisn-79',
  //   title: { bs: 'Sejjidul-istigfar', en: 'Master supplication for forgiveness' },
  //   arabic:
  //     'اللّهـمَّ أَنْتَ رَبِّـي لا إلهَ إلاّ أَنْتَ خَلَقْتَنـي وَأَنا عَبْـدُك وَأَنا عَلـى عَهْـدِكَ وَوَعْـدِكَ ما اسْتَـطَعْـت أَعـوذُ بِكَ مِنْ شَـرِّ ما صَنَـعْت أَبـوءُ لَـكَ بِنِعْـمَتِـكَ عَلَـيَّ وَأَبـوءُ بِذَنْـبي فَاغْفـِرْ لي فَإِنَّـهُ لا يَغْـفِرُ الذُّنـوبَ إِلاّ أَنْتَ',
  //   transcription: {
  //     bs: 'Allāhumme Ente Rabbī, lā ilāhe illā Ente, ẖalaqtenī ve ene ‘abduke, ve ene ‘alā ‘ahdike ve va‘dike mesteṭa‘tu, e‘ūḏu bike min šerri mā ṣana‘tu, ebū’u leke bi ni‘metike ‘alejje, ve ebū’u bi ḏenbī, fagfir lī, fe innehu lā jagfiru-ḏ-ḏunūbe illā Ente.',
  //     en: "Allāhumma anta Rabbī lā ilāha illā ant, khalaqtanī wa anā `abduk, wa anā `alā `ahdika wa wa`dika mastaṭa`t, a`ūdhu bika min sharri mā ṣana`t, abū'u laka bi ni`matika `alay, wa abū'u bidhanbī faghfir lī fa'innahu lā yaghfirudh-dhunūba illā ant.",
  //   },
  //   translation: {
  //     bs: 'Allahu, Ti si Gospodar moj, nema boga osim Tebe, stvorio si me i ja sam Tvoj rob, ja sam na tragu zavjeta Tebi datog, i obećanja Tvog u svojim granicama. Tebi se sklanjam pred zlom koje sam počinio, priznajem blagodati Tvoje prema meni, Tebi priznajem svoje grijehe. Stoga, oprosti mi, jer osim Tebe niko drugi grijehe ne oprašta.',
  //     en: 'O Allah, You are my Lord, there is none worthy of worship but You. You created me and I am your slave. I keep Your covenant, and my pledge to You so far as I am able. I seek refuge in You from the evil of what I have done. I admit to Your blessings upon me, and I admit to my misdeeds. Forgive me, for there is none who may forgive sins but You.',
  //   },
  //   reference: { bs: 'Hisnul-Muslimi, 77', en: 'Hisn al-Muslim, 79' },
  //   sourceUrl: 'https://sunnah.com/hisn:79',
  //   bosnianSourceUrl:
  //     'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=34',
  // },
  // {
  //   id: 'hisn-84',
  //   title: { bs: 'Dova za oprost i zaštitu', en: 'For forgiveness and protection' },
  //   arabic:
  //     'اللّهُـمَّ إِنِّـي أسْـأَلُـكَ العَـفْوَ وَالعـافِـيةَ في الدُّنْـيا وَالآخِـرَة ، اللّهُـمَّ إِنِّـي أسْـأَلُـكَ العَـفْوَ وَالعـافِـيةَ في ديني وَدُنْـيايَ وَأهْـلي وَمالـي ، اللّهُـمَّ اسْتُـرْ عـوْراتي وَآمِـنْ رَوْعاتـي ، اللّهُـمَّ احْفَظْـني مِن بَـينِ يَدَيَّ وَمِن خَلْفـي وَعَن يَمـيني وَعَن شِمـالي ، وَمِن فَوْقـي ، وَأَعـوذُ بِعَظَمَـتِكَ أَن أُغْـتالَ مِن تَحْتـي',
  //   transcription: {
  //     bs: 'Allāhumme innī es’eluke-l-‘afve ve-l-‘āfijete fī-d-dunjā ve-l-āẖireti. Allāhumme innī es’eluke-l-‘afve ve-l-‘āfijete fī dīnī ve dunjāje ve ehlī ve mālī. Allāhumme-stur ‘avrātī ve āmin rev‘ātī. Allāhumme-ḥfaẓnī min bejni jedejje ve min ẖalfī ve ‘an jemīnī ve ‘an šimālī ve min fevqī ve e‘ūḏu bi ‘aẓametike en ugtāle min taḥtī.',
  //     en: "Allāhumma innī as'aluka 'l-`afwa wal-`āfiyah fid-dunyā wal-ākhirah, Allāhumma innī as'aluka 'l-`afwa wal-`āfiyah fī dīnī wa dunyāya, wa ahlī, wa mālī, Allāhummastur `awrātī, wa āmin raw`ātī, Allāhummaḥfaẓnī min bayni yadayya, wa min khalfī, wa `an yamīnī, wa `an shimālī, wa min fawqī, wa a`ūdhu bi`aẓamatika an 'ughtāla min taḥtī.",
  //   },
  //   translation: {
  //     bs: 'Allahu, molim Te za oprost i Tvoju zaštitu na dunjaluku i na ahiretu. Allahu, molim Te za oprost i zaštitu Tvoju u vjeri, na dunjaluku, u porodici i mojoj imovini. Allahu, zakloni moja sramna djela, a umiri moju bojazan. Allahu, sačuvaj me sa moje prednje strane, te od svega što me može zadesiti sa leđa, zdesne ili lijeve strane i odozgo. Prizivam Tvoju Veličinu da ne budem ščepan odozdo.',
  //     en: 'O Allah, I seek Your forgiveness and Your protection in this world and the next. O Allah, I seek Your forgiveness and Your protection in my religion, in my worldly affairs, in my family and in my wealth. O Allah, conceal my secrets and preserve me from anguish. O Allah, guard me from what is in front of me and behind me, from my left, and from my right, and from above me. I seek refuge in Your Greatness from being struck down from beneath me.',
  //   },
  //   reference: { bs: 'Hisnul-Muslimi, 80', en: 'Hisn al-Muslim, 84' },
  //   sourceUrl: 'https://sunnah.com/hisn:84',
  //   bosnianSourceUrl:
  //     'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=35',
  // },
  // {
  //   id: 'hisn-86',
  //   title: { bs: 'Dova za zaštitu Allahovim imenom', en: "Protection through Allah's name" },
  //   arabic:
  //     'بِسـمِ اللهِ الذي لا يَضُـرُّ مَعَ اسمِـهِ شَيءٌ في الأرْضِ وَلا في السّمـاءِ وَهـوَ السّمـيعُ العَلـيم .',
  //   transcription: {
  //     bs: 'Bismillāhi-l-leḏī lā jeḍurru me‘a-smihi šej’un fī-l-erḍi ve lā fī-s-semā’i ve Huve-s-Semī‘u-l-‘Alīm.',
  //     en: "Bismillāhi ‘l-ladhī lā yaḍurru ma`a-smihi shay'un fil-'arḍi wa lā fis-samā' wa huwas-Samī `ul-`Alīm.",
  //   },
  //   translation: {
  //     bs: 'S Allahovim imenom; kad se Njegovo ime spomene, nikakvo zlo na Zemlji ni na nebesima ne može štetiti (3X).',
  //     en: 'In the Name of Allah, Who with His Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing. (Recite three times in Arabic).',
  //   },
  //   reference: { bs: 'Hisnul-Muslimi, 82', en: 'Hisn al-Muslim, 86' },
  //   sourceUrl: 'https://sunnah.com/hisn:86',
  //   bosnianSourceUrl:
  //     'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=36',
  // },
  // {
  //   id: 'hisn-97',
  //   title: { bs: 'Utočište u Allahovim riječima', en: "Refuge in Allah's perfect words" },
  //   arabic: 'أَعـوذُ بِكَلِمـاتِ اللّهِ التّـامّـاتِ مِنْ شَـرِّ ما خَلَـق',
  //   transcription: {
  //     bs: 'E‘ūḏu bi kelimāti-l-Lāhi-t-tāmmāti min šerri mā ẖaleqa.',
  //     en: 'A`ūdhu bikalimāti-llāhit-tāmmāti min sharri mā khalaq.',
  //   },
  //   translation: {
  //     bs: 'Pomoću savršenih Allahovih riječi, zaštićujem se od zla svega onoga što je On stvorio (3X).',
  //     en: 'I seek refuge in the Perfect Words of Allah from the evil of what He has created. (Recite three times in Arabic in the evening.)',
  //   },
  //   reference: { bs: 'Hisnul-Muslimi, 79', en: 'Hisn al-Muslim, 97' },
  //   sourceUrl: 'https://sunnah.com/hisn:97',
  //   bosnianSourceUrl:
  //     'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=35',
  // },
];
