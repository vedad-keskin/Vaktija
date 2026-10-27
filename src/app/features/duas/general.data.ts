import type { Dua } from './duas.data';

// Bosnian meanings: IslamHouse Hisnul-Muslimi, entries 77, 80, 82, 79, 177, 215, 225, 232, and 233.
// Bosnian 215, 225, 232, and 233 follow the reader's photographs; 215's Latin line is adapted from the Arabic.
// Bosnian 75/75a follow the reader's photographs of Hisnul-Muslimi, pages 57–59.
// English and Arabic: Sunnah.com Hisn al-Muslim, entries 77, 79, 84, 86, 97, 188, 189, 230, 240, and 245.
export const GENERAL_DUAS: readonly Dua[] = [
  {
    id: 'hisn-77-morning',
    title: { bs: 'Dova koja se uči ujutro', en: 'Morning supplication' },
    arabic:
      'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.',
    transcription: {
      bs: 'Aṣbaḥnā ve aṣbeḥa-l-mulku lillāhi, ve-l-ḥamdu lillāhi, lā ilāhe illellāhu vaḥdehu lā šerīke leh. Lehu-l-mulku ve lehu-l-ḥamdu ve huve ‘alā kulli šej’in qadīr. Rabbi es’eluke ḫajre mā fī hāḏe-l-jevmi ve ḫajre mā ba‘dehū, ve e‘ūḏu bike min šerri hāḏe-l-jevmi ve šerri mā ba‘dehū. Rabbi e‘ūḏu bike mine-l-keseli ve sūi-l-kiber. Rabbi e‘ūḏu bike min ‘aḏābin fī-n-nāri ve ‘aḏābin fī-l-qabri.',
      en: 'Aṣbaḥnā wa aṣbaḥal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahu lā sharīka lah. Lahul-mulku wa lahul-ḥamdu wa huwa ‘alā kulli shay’in qadīr. Rabbi as’aluka khayra mā fī hādhal-yawmi wa khayra mā ba‘dahu, wa a‘ūdhu bika min sharri mā fī hādhal-yawmi wa sharri mā ba‘dahu. Rabbi a‘ūdhu bika minal-kasali wa sū’il-kibar. Rabbi a‘ūdhu bika min ‘adhābin fin-nāri wa ‘adhābin fil-qabr.',
    },
    translation: {
      bs: 'Jutro dočekasmo i jutro dočeka svekolika vlast Allahova. Hvala Allahu i nema boga osim Njega Jedinog, Koji druga nema. Njemu pripada sva vlast i svaka pohvala i on nad svačim ima moć. Allahu, molim Te za sva dobra ovog jutra i za dobra poslije njega. Gospodaru moj, Tebi se sklanjam pred lijenošću i zlohudom ohološću. Tebi se sklanjam pred kaznom Džehennema i kaburskom kaznom.',
      en: 'We have entered the morning, and all sovereignty belongs to Allah; all praise is His. There is no god but Allah alone, with no partner. Sovereignty and praise belong to Him, and He has power over all things. My Lord, I ask You for the good of this day and what follows it, and I seek refuge in You from the evil of this day and what follows it. My Lord, I seek refuge in You from laziness and the evils of old age. My Lord, I seek refuge in You from punishment in the Fire and punishment in the grave.',
    },
    reference: { bs: 'Hisnul-Muslimi, 75', en: 'Hisn al-Muslim, 77 (morning)' },
    sourceUrl: 'https://sunnah.com/hisn:77',
  },
  {
    id: 'hisn-77-evening',
    title: { bs: 'Dova koja se uči navečer', en: 'Evening supplication' },
    arabic:
      'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ، وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ، وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.',
    transcription: {
      bs: 'Emsejnā ve emse-l-mulku lillāhi, ve-l-ḥamdu lillāhi, lā ilāhe illellāhu vaḥdehu lā šerīke leh. Lehu-l-mulku ve lehu-l-ḥamdu ve huve ‘alā kulli šej’in qadīr. Rabbi es’eluke ḫajre mā fī hāḏihi-l-lejleti ve ḫajre mā ba‘dehā, ve e‘ūḏu bike min šerri hāḏihi-l-lejleti ve šerri mā ba‘dehā. Rabbi e‘ūḏu bike mine-l-keseli ve sūi-l-kiber. Rabbi e‘ūḏu bike min ‘aḏābin fī-n-nāri ve ‘aḏābin fī-l-qabri.',
      en: 'Amsaynā wa amsal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahu lā sharīka lah. Lahul-mulku wa lahul-ḥamdu wa huwa ‘alā kulli shay’in qadīr. Rabbi as’aluka khayra mā fī hādhihil-laylati wa khayra mā ba‘dahā, wa a‘ūdhu bika min sharri mā fī hādhihil-laylati wa sharri mā ba‘dahā. Rabbi a‘ūdhu bika minal-kasali wa sū’il-kibar. Rabbi a‘ūdhu bika min ‘adhābin fin-nāri wa ‘adhābin fil-qabr.',
    },
    translation: {
      bs: 'U noć uđosmo i noć dočeka svekolika Allahova vlast. Hvala Allahu i nema boga osim Njega Jedinog, Koji druga nema. Njemu pripada sva vlast i svaka pohvala i on nad svačim ima moć. Allahu, molim Te za sva dobra ove noći i za dobra poslije nje. Gospodaru moj, Tebi se sklanjam pred lijenošću i zlohudom ohološću. Tebi se sklanjam pred kaznom Džehennema i kaburskom kaznom.',
      en: 'We have entered the evening, and all sovereignty belongs to Allah; all praise is His. There is no god but Allah alone, with no partner. Sovereignty and praise belong to Him, and He has power over all things. My Lord, I ask You for the good of this night and what follows it, and I seek refuge in You from the evil of this night and what follows it. My Lord, I seek refuge in You from laziness and the evils of old age. My Lord, I seek refuge in You from punishment in the Fire and punishment in the grave.',
    },
    reference: { bs: 'Hisnul-Muslimi, 75a', en: 'Hisn al-Muslim, 77 (evening)' },
    sourceUrl: 'https://sunnah.com/hisn:77',
  },
  {
    id: 'quran-28-24',
    title: { bs: 'Dova potrebe', en: 'Supplication of need' },
    arabic: 'رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ',
    transcription: {
      bs: 'Rabbi innī limā enzelte ilejje min ḫajrin faqīr.',
      en: 'Rabbi innī limā anzalta ilayya min khayrin faqīr.',
    },
    translation: {
      bs: 'Gospodaru moj, meni je zaista potrebno svako dobro koje mi Ti spustiš.',
      en: 'My Lord, I am truly in need of whatever good You send down to me.',
    },
    reference: { bs: 'Kur’an, 28:24', en: 'Quran, 28:24' },
    sourceUrl: 'https://quran.com/28/24',
    bosnianSourceUrl: 'https://quranenc.com/bs/browse/bosnian_korkut/28/24',
  },
  {
    id: 'quran-20-114',
    title: { bs: 'Dova za znanje', en: 'Supplication for knowledge' },
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    transcription: {
      bs: 'Rabbi zidnī ‘ilmā.',
      en: 'Rabbi zidnī `ilmā.',
    },
    translation: {
      bs: 'Gospodaru moj, Ti znanje moje proširi!',
      en: 'My Lord, increase me in knowledge.',
    },
    reference: { bs: 'Kur’an, 20:114', en: 'Quran, 20:114' },
    sourceUrl: 'https://quran.com/20/114',
    bosnianSourceUrl: 'https://quranenc.com/bs/browse/bosnian_korkut/20/114',
  },
  {
    id: 'quran-20-25',
    title: { bs: 'Dova za olakšanje govora', en: 'Supplication for ease of speech' },
    arabic:
      'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي',
    transcription: {
      bs: 'Rabbi-šraḥ lī ṣadrī, ve jessir lī emrī, vaḥlul ‘uqdeten min lisānī, jefqahū qavlī.',
      en: 'Rabbi-shraḥ lī ṣadrī, wa yassir lī amrī, waḥlul `uqdatan min lisānī, yafqahū qawlī.',
    },
    translation: {
      bs: 'Gospodaru moj, učini prostranim prsa moja, i olakšaj zadatak moj. Odriješi uzao s jezika mog, da bi razumjeli govor moj.',
      en: 'My Lord, expand for me my breast and ease for me my task and untie the knot from my tongue that they may understand my speech.',
    },
    reference: { bs: 'Kur’an, 20:25–28', en: 'Quran, 20:25–28' },
    sourceUrl: 'https://quran.com/20/25',
  },
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
          bs: 'Kada druga osoba čuje da neko kihne i zahvali Allahu, neka uzvrati:',
          en: 'When someone sneezes and praises Allah, reply:',
        },
        transcription: { bs: 'Jerḥamukellāhu.', en: 'Yarḥamukallāh.' },
        translation: { bs: 'Allah ti se smilovao.', en: 'May Allah have mercy upon you.' },
      },
      {
        arabic: 'يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ',
        instructions: {
          bs: 'Naposljetku osoba koja je kihnula neka uzvrati sa:',
          en: 'When someone responds to your sneeze with “Yarḥamukallāh”, say:',
        },
        transcription: {
          bs: 'Jehdīkumullāhu ve juṣliḥ bālekum.',
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
  {
    id: 'hisn-189',
    title: {
      bs: 'Šta se izgovara kad nevjernik kihne',
      en: 'Reply to a non-Muslim who sneezes and praises Allah',
    },
    arabic: 'يَهْـديكُـمُ اللهُ وَيُصْـلِحُ بالَـكُم',
    transcription: {
      bs: 'Jehdīkumullāhu ve juṣliḥu bālekum.',
      en: 'Yahdīkumullāhu wa yuṣliḥu bālakum.',
    },
    translation: {
      bs: 'Allah vas uputio i popravio vaše stanje.',
      en: 'May Allah guide you and set your affairs in order.',
    },
    reference: { bs: 'Hisnul-Muslimi, 233', en: 'Hisn al-Muslim, 189' },
    sourceUrl: 'https://sunnah.com/hisn:189',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=89',
  },

  {
    id: 'hisn-230',
    title: { bs: 'Dova za onoga koga si grdio', en: 'For someone you have spoken ill of' },
    arabic: 'اللَّهُم فأيما مؤمن سببته فاجعل ذلك له قربة إليك يوم القيامة',
    transcription: {
      bs: 'Allāhumme fe-ejjumā mu’minin sebebtuhū fedž‘al ḏālike lehū qurbeten ilejke jevme-l-qijāmeti.',
      en: "Allāhumma fa'ayyumā mu'minin sababtuhu faj`al dhālika lahu qurbatan ilayka yawma ‘l-qiyāmah.",
    },
    translation: {
      bs: 'Allahu, kojega god da sam vjernika grdio približi ga time Sebi na Sudnjem danu.',
      en: 'O Allah, whomever of the believers I have abused, give him the reward of a sacrificial slaughter for it on the Day of Resurrection.',
    },
    reference: { bs: 'Hisnul-Muslimi, 215', en: 'Hisn al-Muslim, 230' },
    sourceUrl: 'https://sunnah.com/hisn:230',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=82',
  },
  {
    id: 'hisn-240',
    title: {
      bs: 'Dova prilikom čuđenja ili radosnoga događaja',
      en: 'At amazement or a happy event',
    },
    arabic: 'سُـبْحانَ الله',
    transcription: { bs: 'Subḥānallāh.', en: 'Subḥānallāh.' },
    translation: { bs: 'Slavljen neka je Allah.', en: 'Glory is to Allah.' },
    reference: { bs: 'Hisnul-Muslimi, 225', en: 'Hisn al-Muslim, 240' },
    sourceUrl: 'https://sunnah.com/hisn:240',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=87',
  },
  {
    id: 'hisn-245',
    title: { bs: 'Dova prilikom jezovitoga događaja', en: 'When startled' },
    arabic: 'لا إلهَ إلاّ اللّهُ',
    transcription: { bs: 'Lā ilāhe illellāhu.', en: 'Lā ilāha illallāh.' },
    translation: {
      bs: 'Nema boga osim Allaha.',
      en: 'There is none worthy of worship but Allah.',
    },
    reference: { bs: 'Hisnul-Muslimi, 232', en: 'Hisn al-Muslim, 245' },
    sourceUrl: 'https://sunnah.com/hisn:245',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=89',
  },
  {
    id: 'hisn-144',
    title: { bs: 'Dova kada se dogodi nešto nepoželjno', en: 'When something unwelcome happens' },
    arabic: 'قَدَّرَ اللَّهُ وَمَا شَاءَ فَعَلَ',
    instructions: {
      bs: 'Kad te nešto zadesi, ne reci „Da učinih tako i tako”, nego prouči ovu dovu.',
      en: 'When a setback occurs, do not say “If only I had done such and such”, rather say this supplication.',
    },
    transcription: { bs: 'Qadderellāhu ve mā šā’e fe‘al.', en: "Qaddarallāhu wa mā shā'a fa`al." },
    translation: {
      bs: 'Allah je to odredio i, što je htio, učinio je.',
      en: 'It is the Decree of Allah and He does whatever He wills.',
    },
    reference: { bs: 'Hisnul-Muslimi, 135', en: 'Hisn al-Muslim, 144' },
    sourceUrl: 'https://sunnah.com/hisn:144',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=53',
  },
  // {
  //   id: 'hisn-79',
  //   title: { bs: 'Sejjidul-istigfar', en: 'Master supplication for forgiveness' },
  //   arabic:
  //     'اللّهـمَّ أَنْتَ رَبِّـي لا إلهَ إلاّ أَنْتَ خَلَقْتَنـي وَأَنا عَبْـدُك وَأَنا عَلـى عَهْـدِكَ وَوَعْـدِكَ ما اسْتَـطَعْـت أَعـوذُ بِكَ مِنْ شَـرِّ ما صَنَـعْت أَبـوءُ لَـكَ بِنِعْـمَتِـكَ عَلَـيَّ وَأَبـوءُ بِذَنْـبي فَاغْفـِرْ لي فَإِنَّـهُ لا يَغْـفِرُ الذُّنـوبَ إِلاّ أَنْتَ',
  //   transcription: {
  //     bs: 'Allāhumme Ente Rabbī, lā ilāhe illā Ente, ḫalaqtenī ve ene ‘abduke, ve ene ‘alā ‘ahdike ve va‘dike mesteṭa‘tu, e‘ūḏu bike min šerri mā ṣana‘tu, ebū’u leke bi ni‘metike ‘alejje, ve ebū’u bi ḏenbī, fagfir lī, fe innehu lā jagfiru-ḏ-ḏunūbe illā Ente.',
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
  //     bs: 'Allāhumme innī es’eluke-l-‘afve ve-l-‘āfijete fī-d-dunjā ve-l-āḫireti. Allāhumme innī es’eluke-l-‘afve ve-l-‘āfijete fī dīnī ve dunjāje ve ehlī ve mālī. Allāhumme-stur ‘avrātī ve āmin rev‘ātī. Allāhumme-ḥfaẓnī min bejni jedejje ve min ḫalfī ve ‘an jemīnī ve ‘an šimālī ve min fevqī ve e‘ūḏu bi ‘aẓametike en ugtāle min taḥtī.',
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
  //     bs: 'E‘ūḏu bi kelimāti-l-Lāhi-t-tāmmāti min šerri mā ḫaleqa.',
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
