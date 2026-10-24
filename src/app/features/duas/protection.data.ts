import type { Dua } from './duas.data';

// Bosnian transcriptions and meanings: reader's Hisnul-Muslimi photographs (116, 119, 121, 124, 130, 136).
// English and Arabic: the linked Sunnah.com entries; HM-133 recitation is printed in the Bosnian photo.
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
    id: 'hisn-146',
    title: { bs: 'Dova za zaštitu djece', en: 'Protection for children' },
    arabic:
      'أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
    transcription: {
      bs: 'U‘īdukumā bi kelimātillāhi-t-tāmmāti min kulli šejtānin ve hāmmetin, ve min kulli ‘ajnin lāmmetin.',
      en: 'U`īthukumā bikalimāti ‘llāhit-tāmmati min kulli shayṭānin wa hāmmah, wa min kulli `aynin lāmmah.',
    },
    translation: {
      bs: 'Zaštitu Allahovu molim za vas pomoću Allahovih savršenih riječi od svakog šejtana, zloslutnje i od zloga pogleda.',
      en: 'I seek protection for you in the Perfect Words of Allah from every devil and every beast, and from every envious blameworthy eye.',
    },
    reference: { bs: 'Hisnul-Muslimi, 136', en: 'Hisn al-Muslim, 146' },
    sourceUrl: 'https://sunnah.com/hisn:146',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=53',
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
];
