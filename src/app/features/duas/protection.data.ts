import type { Dua } from './duas.data';

// Bosnian wording: reader's Hisnul-Muslimi photographs (116, 119, 121, 124, 130–132, 135, 191, 223–224).
// English: linked Sunnah.com entries; HM-133, HM-140 and HM-141 include a recited phrase within an instruction.
export const PROTECTION_DUAS: readonly Dua[] = [
  {
    id: 'hisn-124',
    title: { bs: 'Junusova dova u nevolji', en: "Yunus's supplication in distress" },
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transcription: {
      bs: 'Lā ilāhe illā Ente, subḥāneke innī kuntu mine-ẓ-ẓālimīne.',
      en: 'Lā ilāha illā anta subḥānaka innī kuntu minaẓ-ẓālimīn.',
    },
    translation: {
      bs: 'Nema boga osim Tebe, slavljen neka si, ja sam se uistinu prema sebi ogriješio.',
      en: 'There is none worthy of worship but You, glory is to You. Surely, I was among the wrongdoers.',
    },
    reference: { bs: 'Hisnul-Muslimi, 119', en: 'Hisn al-Muslim, 124' },
    sourceUrl: 'https://sunnah.com/hisn:124',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=49',
  },

  {
    id: 'hisn-126',
    title: {
      bs: 'Dova pri susretu s neprijateljem ili osobom na vlasti',
      en: 'Facing an adversary or ruler',
    },
    arabic: 'اللَّهُمَّ إِنَّا نَجْعَلُكَ فِي نُحُورِهِمْ، وَنَعُوذُ بِكَ مِنْ شُرُورِهِمْ',
    transcription: {
      bs: 'Allāhumme innā nedž‘aluke fī nuḥūrihim ve ne‘ūḏu bike min šurūrihim.',
      en: 'Allāhumma innā naj`aluka fī nuḥūrihim wa na`ūdhu bika min shurūrihim.',
    },
    translation: {
      bs: 'Allahu, molimo Te da njihove spletke usmjeriš na njih i kod Tebe se sklanjamo pred njihovim zlima.',
      en: 'O Allah, we ask You to restrain them by their necks, and we seek refuge in You from their evil.',
    },
    reference: { bs: 'Hisnul-Muslimi, 121', en: 'Hisn al-Muslim, 126' },
    sourceUrl: 'https://sunnah.com/hisn:126',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=49',
  },
  {
    id: 'hisn-133',
    title: { bs: 'Dova pri sumnji u vjeri', en: 'When doubting one’s faith' },
    arabic: 'أَعُوذُ بِاللَّهِ',

    transcription: { bs: 'E‘ūḏu billāhi.', en: 'A`ūdhu billāh.' },
    translation: { bs: 'Utječem se Allahu.', en: 'I seek refuge in Allah.' },
    reference: { bs: 'Hisnul-Muslimi, 124', en: 'Hisn al-Muslim, 133' },
    sourceUrl: 'https://sunnah.com/hisn:133',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=50',
  },
  {
    id: 'hisn-139',
    title: { bs: 'Dova kada je nešto teško', en: 'When something is difficult' },
    arabic:
      'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    transcription: {
      bs: 'Allāhumme lā sehle illā mā dže‘altehū sehlen ve Ente tedže‘alu-l-ḥazene, iḏā ši’te sehlen.',
      en: 'Allāhumma lā sahla illā mā ja‘altahu sahlan, wa anta taj‘alu-l-ḥazna idhā shi’ta sahlan.',
    },
    translation: {
      bs: 'Allahu moj, ne može biti lahko osim onog što Ti učiniš lahkim, Ti, ako hoćeš, i teško učiniš lahkim!',
      en: 'O Allah! There is nothing easy except what You make easy, and You make the difficult easy if it is Your will.',
    },
    reference: { bs: 'Hisnul-Muslimi, 130', en: 'Hisn al-Muslim, 139' },
    sourceUrl: 'https://sunnah.com/hisn:139',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/doa-bs.pdf',
  },
  {
    id: 'hisn-193',
    title: { bs: 'Dova protiv izljeva srdžbe', en: 'When angry' },
    arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    transcription: {
      bs: 'E‘ūḏu billāhi mine-š-šejṭāni-r-radžīm.',
      en: 'A`ūdhu billāhi minash-Shayṭānir-rajīm.',
    },
    translation: {
      bs: 'Allaha prizivam protiv prokletog šejtana.',
      en: 'I seek refuge in Allah from Satan the outcast.',
    },
    reference: { bs: 'Hisnul-Muslimi, 181', en: 'Hisn al-Muslim, 193' },
    sourceUrl: 'https://sunnah.com/hisn:193',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=68',
  },
  {
    id: 'hisn-194',
    title: {
      bs: 'Dova kad ugledamo nesretnika',
      en: 'Upon seeing someone in trial or tribulation',
    },
    arabic:
      'الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي مِمَّا ابْتَلَاكَ بِهِ، وَفَضَّلَنِي عَلَى كَثِيرٍ مِمَّنْ خَلَقَ تَفْضِيلًا',
    transcription: {
      bs: 'El-ḥamdu lillāhi-l-leḏī ‘āfānī mimmab-telāke bihī ve feḍḍalenī ‘alā keṯīrin mimmen ḫaleqa tafḍīlā.',
      en: 'Alhamdu lillāhi ‘l-ladhī `āfānī mimmab-talāka bihi wa faḍḍalanī `alā kathīrin mimman khalaqa tafḍīlā.',
    },
    translation: {
      bs: 'Hvala Allahu, Koji me zaštiti od onoga što je tebe zadesilo i dade mi prednost nad mnogo čime što je stvorio.',
      en: 'Praise is to Allah Who has spared me what He has afflicted you with, and preferred me greatly above much of what He has created.',
    },
    reference: { bs: 'Hisnul-Muslimi, 182', en: 'Hisn al-Muslim, 194' },
    sourceUrl: 'https://sunnah.com/hisn:194',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=69',
  },
  {
    id: 'hisn-199',
    title: {
      bs: 'Dova kojom se moli Allahova zaštita od Dedžala',
      en: 'Protection from the Dajjal',
    },
    arabic: 'أَعُوذُ بِاللَّهِ مِنْ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',

    transcription: {
      bs: 'E‘ūḏu billāhi min fitnetil-mesīḥi-d-dedždžāli.',
      en: 'A`ūdhu billāhi min fitnati ‘l-masīḥid-dajjāl.',
    },
    translation: {
      bs: 'Allahu, prizivam Te da me sačuvaš od kušnji Mesiha Dedžala.',
      en: 'I seek refuge in You from the trial of the False Messiah.',
    },
    reference: { bs: 'Hisnul-Muslimi, 187', en: 'Hisn al-Muslim, 56' },
    sourceUrl: 'https://sunnah.com/hisn:56',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=71',
  },
  {
    id: 'hisn-203',
    title: {
      bs: 'Dova za zaštitu od straha pred širkom',
      en: 'Fear of associating partners with Allah',
    },
    arabic:
      'اللّهُـمَّ إِنّـي أَعـوذُبِكَ أَنْ أُشْـرِكَ بِكَ وَأَنا أَعْـلَمْ، وَأَسْتَـغْفِرُكَ لِما لا أَعْـلَم',
    transcription: {
      bs: 'Allāhumme innī e‘ūḏu bike en ušrike bike ve ene a‘lemu ve estagfiruke limā lā a‘lemu.',
      en: 'Allāhumma innī a`ūdhu bika an ushrika bika wa anā a`lam, wa astaghfiruka limā lā a`lam.',
    },
    translation: {
      bs: 'Allahu, zaštiti me da prema Tebi ne počinim svjesno širk i molim Te da mi oprostiš za ono što počinim nesvjesno.',
      en: 'O Allah, I seek refuge in You lest I associate anything with You knowingly, and I seek Your forgiveness for what I know not.',
    },
    reference: { bs: 'Hisnul-Muslimi, 191', en: 'Hisn al-Muslim, 203' },
    sourceUrl: 'https://sunnah.com/hisn:203',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=72',
  },
  {
    id: 'hisn-131',
    title: { bs: 'Dova protiv neprijatelja', en: 'Against an enemy' },
    arabic:
      'اللَّهُمَّ مُنْزِلَ الْكِتَاب سَرِيعَ الْحِسَاب اهْزِم الأَحْزَاب اللَّهُمَّ اهْزِمْهُمْ وَ زَلْزِلْهُم',
    transcription: {
      bs: 'Allāhumme Munzile-l-Kitābi, Serī‘a-l-ḥisābi ihzimi-l-aḥzābe. Allāhumme, ihzimhum ve zelzilhum.',
      en: 'Allāhumma munzila ‘l-kitāb, sarī`a ‘l-ḥisāb, ihzimi ‘l-aḥzāb, Allāhumma-hzimhum wa zalzilhum.',
    },
    translation: {
      bs: 'Allahu, Dostavitelju Knjige, Koji brzo svodiš račune, porazi protivnike. Allahu, porazi ih sve i uzdrmaj ih (razori ih).',
      en: 'O Allah, Revealer of the Book, Swift to account, defeat the groups (of disbelievers). O Allah, defeat them and shake them.',
    },
    reference: { bs: 'Hisnul-Muslimi, 223', en: 'Hisn al-Muslim, 131' },
    sourceUrl: 'https://sunnah.com/hisn:131',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=86',
  },
  {
    id: 'hisn-132',
    title: {
      bs: 'Dova prilikom straha od grupe ljudi',
      en: 'When afraid of a group of people',
    },
    arabic: 'اللَّهُمَّ اكْفِنِيهِم بمَا شِئْت',
    transcription: {
      bs: 'Allāhumme-kfinīhim bi mā ši’te.',
      en: "Allāhummak-finīhim bimā shi't.",
    },
    translation: {
      bs: 'Allahu, sačuvaj me od njih čime Ti je volja.',
      en: 'O Allah, suffice (i.e. protect) me against them however You wish.',
    },
    reference: { bs: 'Hisnul-Muslimi, 224', en: 'Hisn al-Muslim, 132' },
    sourceUrl: 'https://sunnah.com/hisn:132',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=86',
  },
  {
    id: 'hisn-86',
    title: { bs: 'Dova za zaštitu Allahovim imenom', en: "Protection through Allah's name" },
    arabic:
      'بِسـمِ اللهِ الذي لا يَضُـرُّ مَعَ اسمِـهِ شَيءٌ في الأرْضِ وَلا في السّمـاءِ وَهـوَ السّمـيعُ العَلـيم .',
    instructions: {
      bs: 'Ko ovu dovu prouči tri puta ujutro, neće ga zadesiti nikakva nedaća do večeri, a ko je prouči tri puta navečer, neće ga zadesiti nikakva nedaća do jutra.',
      en: 'Whoever recites this supplication three times in the morning will not face a calamity until evening, and whoever recites it three times in the evening will not face a calamity until morning.',
    },
    transcription: {
      bs: 'Bismillāhi-l-leḏī lā jeḍurru me‘a-smihi šej’un fī-l-erḍi ve lā fī-s-semā’i ve Huve-s-Semī‘u-l-‘Alīm.',
      en: "Bismillāhi ‘l-ladhī lā yaḍurru ma`a-smihi shay'un fil-'arḍi wa lā fis-samā' wa huwas-Samī `ul-`Alīm.",
    },
    translation: {
      bs: 'S Allahovim imenom, kad se Njegovo ime spomene, nikakvo zlo na Zemlji ni na nebesima ne može štetiti.',
      en: 'In the Name of Allah, Who with His Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.',
    },
    reference: { bs: 'Hisnul-Muslimi, 82', en: 'Hisn al-Muslim, 86' },
    sourceUrl: 'https://sunnah.com/hisn:86',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=36',
  },
];
