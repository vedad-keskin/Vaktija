import type { Dua } from './duas.data';

// Bosnian wording: reader's Hisnul-Muslimi photographs (116, 119, 121, 124, 130–132, 135).
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
      bs: 'Nema boga osim Tebe. Neka si slavljen Ti, zaista sam ja bio među griješnicima.',
      en: 'There is none worthy of worship but You, glory is to You. Surely, I was among the wrongdoers.',
    },
    reference: { bs: 'Hisnul-Muslimi, 119', en: 'Hisn al-Muslim, 124' },
    sourceUrl: 'https://sunnah.com/hisn:124',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=49',
  },
  {
    id: 'hisn-121',
    title: { bs: 'Dova protiv zabrinutosti i žalosti', en: 'Against anxiety and sorrow' },
    arabic:
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحُزْنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    transcription: {
      bs: 'Allāhumme innī e‘ūdu bike mine-l-hemmi vel-hazeni ve-l-‘adžzi ve-l-keseli ve-l-buhli ve-l-džubni ve dal‘i-d-dejni ve galebeti-r-ridžāli.',
      en: "Allāhumma 'innī 'a`ūdhu bika mina ‘l-ḥammi wa ‘l-ḥuzn, wa ‘l-`ajzi wa ‘l-kasal, wa ‘l-bukhli wa ‘l-jubn, wa ḍala`id-dayn, wa ghalabatir-rijāl.",
    },
    translation: {
      bs: 'Allahu, tražim od Tebe zaštitu od brige i žalosti, od iznemoglosti i lijenosti, tvrdičluka i uspaničenosti te pred teretom dugovanja i ljudske nadmoći.',
      en: 'O Allah, I seek refuge in You from grief and sadness, from weakness and laziness, from miserliness and cowardice, from being overcome by debt and overpowered by others.',
    },
    reference: { bs: 'Hisnul-Muslimi, 116', en: 'Hisn al-Muslim, 121' },
    sourceUrl: 'https://sunnah.com/hisn:121',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=48',
  },

  {
    id: 'hisn-126',
    title: {
      bs: 'Dova pri susretu s neprijateljem ili osobom na vlasti',
      en: 'Facing an adversary or ruler',
    },
    arabic: 'اللَّهُمَّ إِنَّا نَجْعَلُكَ فِي نُحُورِهِمْ، وَنَعُوذُ بِكَ مِنْ شُرُورِهِمْ',
    transcription: {
      bs: 'Allāhumme innā nedž‘aluke fī nuḥūrihim ve ne‘ūdu bike min šurūrihim.',
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

    transcription: { bs: 'E‘ūdu billāhi.', en: 'A`ūdhu billāh.' },
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
      bs: 'Allāhumme lā sehle illā mā dže‘altehū sehlen ve Ente tedže‘alu-l-ḥazene, iḏā ši‘te sehlen.',
      en: "Allāhumma lā saḥla illā ma ja`altahu saḥla wa anta taj`alu ‘l-ḥazna idhā shi'ta saḥla.",
    },
    translation: {
      bs: 'Allahu moj, ne može biti lahkoće mimo onog što Ti ne učiniš. Ti, ako hoćeš, i teško učiniš lahkim.',
      en: 'O Allah, there is no ease other than what You make easy. If You please You ease sorrow.',
    },
    reference: { bs: 'Hisnul-Muslimi, 130', en: 'Hisn al-Muslim, 139' },
    sourceUrl: 'https://sunnah.com/hisn:139',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=52',
  },
  {
    id: 'hisn-140',
    title: { bs: 'Dova nakon počinjenog grijeha', en: 'After committing a sin' },
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    instructions: {
      bs: 'Svakome vjerniku koji počini grijeh, pa potom lijepo uzme abdest, klanja dva rekata i zatim zamoli Allaha za oprost ovim riječima, Allah mu oprosti počinjeni grijeh.',
      en: 'After committing a sin, perform ablution well, pray two rak‘ahs, then ask Allah for forgiveness.',
    },
    transcription: { bs: 'Estagfirullāh.', en: 'Astaghfirullāh.' },
    translation: { bs: 'Tražim oprost od Allaha.', en: 'I seek Allah’s forgiveness.' },
    reference: { bs: 'Hisnul-Muslimi, 131', en: 'Hisn al-Muslim, 140' },
    sourceUrl: 'https://sunnah.com/hisn:140',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=52',
  },
  {
    id: 'hisn-141',
    title: {
      bs: 'Dova za zaštitu od šejtana i njegovih došaptavanja',
      en: 'Protection from Satan and his whisperings',
    },
    arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    transcription: {
      bs: 'E‘ūdu billāhi mineš-šejṭānir-radžīm.',
      en: 'A`ūdhu billāhi minash-shayṭānir-rajīm.',
    },
    translation: {
      bs: 'Utječem se Allahu od prokletog šejtana.',
      en: 'I seek refuge in Allah from Satan the outcast.',
    },
    reference: { bs: 'Hisnul-Muslimi, 132', en: 'Hisn al-Muslim, 141' },
    sourceUrl: 'https://sunnah.com/hisn:141',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=52',
  },
  {
    id: 'hisn-144',
    title: { bs: 'Dova kada se dogodi nešto nepoželjno', en: 'When something unwelcome happens' },
    arabic: 'قَدَّرَ اللَّهُ وَمَا شَاءَ فَعَلَ',
    instructions: {
      bs: 'Kad te nešto zadesi, ne reci „Da učinih tako i tako”, nego prouči ovu dovu.',
      en: 'When a setback occurs, do not say “If only I had done such and such”, rather say this supplication.',
    },
    transcription: { bs: 'Qadderellāhu ve mā šāe fe‘al.', en: "Qaddarallāhu wa mā shā'a fa`al." },
    translation: {
      bs: 'Allah je to odredio i, što je htio, učinio je.',
      en: 'It is the Decree of Allah and He does whatever He wills.',
    },
    reference: { bs: 'Hisnul-Muslimi, 135', en: 'Hisn al-Muslim, 144' },
    sourceUrl: 'https://sunnah.com/hisn:144',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=53',
  },
  {
    id: 'hisn-193',
    title: { bs: 'Dova protiv izljeva srdžbe', en: 'When angry' },
    arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    transcription: {
      bs: 'E‘ūzu billāhi mine-š-šejtān-r-radžīm.',
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
      bs: 'El-ḥamdu lillāhi-l-leḏī ‘āfānī mimmab-telāke bihī ve feḍḍalenī ‘alā kešīrin mimmen ḫaleka tafḍīlā.',
      en: "Alhamdu lillāhi ‘l-ladhī `āfānī mimmab-talāka bihi wa faḍḍalanī `alā kathīrin mimman khalaqa tafḍīlā.",
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
      bs: 'E‘ūdu billāhi min fitnetil-mesīhi-d-dedždžāli.',
      en: "A`ūdhu billāhi min fitnati ‘l-masīḥid-dajjāl.",
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
];
