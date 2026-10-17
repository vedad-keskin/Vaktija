import type { Dua } from './duas.data';

// Bosnian meanings: IslamHouse Hisnul-Muslimi. HM-177 is not in that edition.
// English and Arabic: Sunnah.com Hisn al-Muslim, entries 176–186.
// Bosnian transcription uses the photographed 2017 letter key (see README-full).
export const FOOD_DUAS: readonly Dua[] = [
  {
    id: 'hisn-176',
    title: { bs: "Dova za prekid posta", en: "Upon breaking fast" },
    arabic: "ذَهَـبَ الظَّمَـأُ، وَابْتَلَّـتِ العُـروق، وَثَبَـتَ الأجْـرُ إِنْ شـاءَ الله",
    transcription: {
      bs: "Zehebe-ẓ-ẓama'u, vebtelleti-l-‘urūku, ve ṯebete-l-edžru, in šā'e-llāhu.",
      en: "Dhahabaẓ-ẓama', wabtallati ‘l-`urūq, wa thabata ‘l-'ajru in shā Allāh.",
    },
    translation: {
      bs: "Nestala je žeđ, natopile se žile, a nagrada je osigurana, ako Allah htjedne.",
      en: "The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills.",
    },
    reference: { bs: "Hisnul-Muslimi, 167", en: 'Hisn al-Muslim, 176' },
    sourceUrl: 'https://sunnah.com/hisn:176',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=68',
  },
  {
    id: 'hisn-178',
    title: { bs: "Dova prilikom početka jela", en: "When starting to eat" },
    arabic: "بِسْمِ اللَّهِ",
    transcription: {
      bs: "Bismillāhi.",
      en: "Bismillāhi.",
    },
    translation: {
      bs: "U ime Allaha.",
      en: "With the Name of Allah.",
    },
    reference: { bs: "Hisnul-Muslimi, 168", en: 'Hisn al-Muslim, 178' },
    sourceUrl: 'https://sunnah.com/hisn:178',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=68',
  },
  {
    id: 'hisn-178-forgot',
    title: { bs: "Dova kada se sjetimo da smo počeli jesti", en: "When we remember that we started eating" },
    arabic: "بسمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ",
    transcription: {
      bs: "Bismillāhi fī evvelihi ve āẖirihi.",
      en: "Bismillāhi fī awwalihi wa ākhirih.",
    },
    translation: {
      bs: "U ime Allaha u početku i kraju jela.",
      en: "With the Name of Allah, in the beginning, and in the end.",
    },
    reference: { bs: "Hisnul-Muslimi, 168", en: 'Hisn al-Muslim, 178' },
    sourceUrl: 'https://sunnah.com/hisn:178',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=68',
  },
  {
    id: 'hisn-180',
    title: { bs: "Dova poslije obroka", en: "Upon completing the meal" },
    arabic: "الْحَمْـدُ للهِ الَّذي أَطْعَمَنـي هـذا وَرَزَقَنـيهِ مِنْ غَـيْرِ حَوْلٍ مِنِّي وَلا قُوَّة",
    transcription: {
      bs: "El-ḥamdu li-llāhi-l-leḏī eṭ‘amenī hāḏā ve rezaqanīhi min gajri ḥavlin minnī ve lā quvvetin.",
      en: "Alhamdu lillāhi ‘l-ladhī aṭ`amanī hādhā, wa razaqanīhi min ghayri ḥawlin minnī wa lā quwwah.",
    },
    translation: {
      bs: "Hvala Allahu, Koji me nahrani i opskrbi bez moje snage i moći.",
      en: "Praise is to Allah Who has given me this food, and sustained me with it though I was unable to do it and powerless.",
    },
    reference: { bs: "Hisnul-Muslimi, 170", en: 'Hisn al-Muslim, 180' },
    sourceUrl: 'https://sunnah.com/hisn:180',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=69',
  },
  {
    id: 'hisn-182',
    title: { bs: "Dova gosta domaćinu", en: "Of the guest for the host" },
    arabic: "اللّهُـمَّ بارِكْ لَهُمْ فيما رَزَقْـتَهُم، وَاغْفِـرْ لَهُـمْ وَارْحَمْهُمْ",
    transcription: {
      bs: "Allāhumme bārik lehum fīmā rezaqtehum, vagfir lehum verḥamhum.",
      en: "Allāhumma bārik lahum fī mā razaqtahum, wagh’fir lahum warḥamhum.",
    },
    translation: {
      bs: "Allahu, blagoslovi im ono čime si ih opskrbio, oprosti im i smiluj im se.",
      en: "O Allah, bless them in what You have provided for them, and forgive them and have mercy on them.",
    },
    reference: { bs: "Hisnul-Muslimi, 172", en: 'Hisn al-Muslim, 182' },
    sourceUrl: 'https://sunnah.com/hisn:182',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=69',
  },
  {
    id: 'hisn-183',
    title: { bs: "Dova onome ko vas napoji", en: "To one who intends to give food or drink" },
    arabic: "اللّهُـمَّ أَطْعِمْ مَن أَطْعَمَني، وَاسْقِ مَن سقاني",
    transcription: {
      bs: "Allāhumme aṭ‘im men aṭ‘amenī ve-sqi men seqānī.",
      en: "Allāhumma aṭ`im man aṭ`amanī wasqi man saqānī.",
    },
    translation: {
      bs: "Allahu, nahrani onoga ko je mene nahranio i napoji onoga ko je mene napojio.",
      en: "O Allah, feed the one who has fed me, and give drink to the one who has given me drink.",
    },
    reference: { bs: "Hisnul-Muslimi, 173", en: 'Hisn al-Muslim, 183' },
    sourceUrl: 'https://sunnah.com/hisn:183',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=70',
  },
  {
    id: 'hisn-184',
    title: { bs: "Dova domaćinu za iftar", en: "When breaking fast in someone’s home" },
    arabic: "أَفْطَـرَ عِنْدَكُم الصّـائِمونَ وَأَكَلَ طَعامَـكُمُ الأبْـرار، وَصَلَّـتْ عَلَـيْكُمُ الملائِكَـة",
    transcription: {
      bs: "Efṭara ‘indekumu-ṣ-ṣā'imūne ve ekele ṭa‘āmekumu-l-ebrāru, ve ṣallet ‘alejkumu-l-melā'iketu.",
      en: "Afṭara `indakumuṣ-ṣā'imūn, wa akala ṭa`āmakumu ‘l-'abrār, wa ṣallat `alaykumu ‘l-malā'ikah.",
    },
    translation: {
      bs: "Postači kod vas iftarili, dobri jeli i meleki na vas salavate donosili.",
      en: "With you, those who are fasting have broken their fast, you have fed those who are righteous, and the angels recite their prayers upon you.",
    },
    reference: { bs: "Hisnul-Muslimi, 174", en: 'Hisn al-Muslim, 184' },
    sourceUrl: 'https://sunnah.com/hisn:184',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=70',
  },
  {
    id: 'hisn-186',
    title: { bs: "Dova kad postača neko grdi", en: "When insulted while fasting" },
    arabic: "إِنِّي صَائِمٌ، إِنِّي صَائِمٌ",
    transcription: {
      bs: "Innī ṣā'imun, innī ṣā'imun.",
      en: "Innī ṣā'im, innī ṣā'im.",
    },
    translation: {
      bs: "Ja postim, zaista, ja postim.",
      en: "I am fasting. I am fasting.",
    },
    reference: { bs: "Hisnul-Muslimi, 235", en: 'Hisn al-Muslim, 186' },
    sourceUrl: 'https://sunnah.com/hisn:186',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=93',
  },
];
