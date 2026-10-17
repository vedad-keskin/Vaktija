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
    title: { bs: "Dova pred početak obroka", en: "Before eating" },
    arabic: "إِذَا أَكَلَ أَحَدُكُمْ طَعَاماً فَلْيَقُلْ بِسْمِ اللَّهِ، فَإِنْ نَسِيَ فِي أَوَّلِهِ فَلْيَقُلْ بسمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ",
    transcription: {
      bs: "Bismillāhi. Bismillāhi fī evvelihi ve āẖirihi.",
      en: "Bismillāhi. Bismillāhi fī awwalihi wa ākhirih.",
    },
    translation: {
      bs: "Prije početka obroka, proučiti: Bismi-l-Lahi, a ako zaboravi proučiti prije početka obroka, neka prouči kad se sjeti: Bismi-l-Lahi fi evvelihi ve ahirihi; Bismi-l-Lahi – za početak i za kraj.",
      en: "When anyone of you begins eating, say: With the Name of Allah. And if you forget then, when you remember, say: With the Name of Allah, in the beginning, and in the end.",
    },
    reference: { bs: "Hisnul-Muslimi, 168", en: 'Hisn al-Muslim, 178' },
    sourceUrl: 'https://sunnah.com/hisn:178',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=68',
  },
  {
    id: 'hisn-179',
    title: { bs: "Dova pred početak obroka", en: "Before eating" },
    arabic: "مَنْ أَطْعَمَهُ اللَّهُ الطَّعَامَ فَلْيَقُلْ: \"اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَأَطْعِمْنَا خَيْراً مِنْهُ\"، وَمَنْ سَقَاهُ اللَّهُ لَبَناً فَلْيَقُلْ \"اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ\"",
    transcription: {
      bs: "Allāhumme bārik lenā fīhi ve aṭ‘imnā ẖajren minhu. Allāhumme bārik lenā fīhi ve zidnā minhu.",
      en: "Allāhumma bārik lanā fīhi wa aṭ`imnā khayran minhu. Allāhumma bārik lanā fīhi wa zidnā minhu.",
    },
    translation: {
      bs: "Onaj koga Allah opskrbi hranom, neka se zahvali riječima: Allahumme barik lena fihi, ve at'imna hajren minhu. Allahu, blagoslov nam daj u hrani i hrani nas boljom od nje. A onaj koga Allah napoji mlijekom, neka se zahvali riječima: Allahumme barik lena fihi ve zidna minhu. Allahu moj, blagoslovi ovo mlijeko i povećaj nam njegovu količinu.",
      en: "Whomever Allah has given food, should say: O Allah, bless us in it and provide us with better than it. Whomever Allah has given milk to drink, should say : O Allah, bless us in it and give us more of it.",
    },
    reference: { bs: "Hisnul-Muslimi, 169", en: 'Hisn al-Muslim, 179' },
    sourceUrl: 'https://sunnah.com/hisn:179',
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
    id: 'hisn-181',
    title: { bs: "Dova poslije obroka", en: "Upon completing the meal" },
    arabic: "الْحَمْـدُ للهِ حَمْـداً كَثـيراً طَيِّـباً مُبـارَكاً فيه، غَيْرَ مَكْفِيٍّ وَلا مُوَدَّعٍ وَلا مُسْتَغْـنىً عَنْـهُ رَبَّـنا",
    transcription: {
      bs: "El-ḥamdu li-llāhi ḥamden keṯīren ṭajjiben mubāreken fīhi, gajre mekfijjin ve lā muvadda‘in, ve lā mustagnen ‘anhu rabbenā.",
      en: "Alhamdu lillāhi ḥamdan kathīran tayyiban mubārakan fīh, ghayra makfiyyin wa lā muwadda`in, wa lā mustaghnan `anhu Rabbanā.",
    },
    translation: {
      bs: "Allahu pripada velika, lijepa i blagoslovljena zahvalnost na ovoj nafaki. Časti nas redovno i ne učini nam ovu nafaku posljednjom. Gospodaru naš, mi ne možemo opstati bez hrane.",
      en: "All praise is to Allah, praise in abundance, good and blessed. It cannot [be compensated for, nor can it] be left, nor can it be done without, our Lord.",
    },
    reference: { bs: "Hisnul-Muslimi, 171", en: 'Hisn al-Muslim, 181' },
    sourceUrl: 'https://sunnah.com/hisn:181',
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
    id: 'hisn-185',
    title: { bs: "Dova postača koji ne prekine post", en: "By one fasting when presented with food and does not break his fast" },
    arabic: "(إِذَا دُعِيَ أَحَدُكُمْ فَلْيُجِبْ، فَإِنْ كَانَ صَائِماً فَلْيُصَلِّ، وَإِنْ كَانَ مُفْطِراً فَلْيَطْعَمْ) ، وَمَعْنَى فَلْيُصَلِّ أَيْ فَلْيَدْعُ.",
    transcription: {
      bs: "",
      en: "",
    },
    translation: {
      bs: "Kad bilo ko od vas bude pozvan (na neku gozbu), neka se odazove. Ako posti, onda neka uči dove domaćinu, a ako ne bude postio, neka sjede za sofru. Fel-jusalli znači: fel-jed'u, to jest, neka uči dove.",
      en: "When you are invited (to eat) then reply to the invitation. If you are fasting then invoke Allah's blessings (on your host), and if you are not fasting then eat.",
    },
    reference: { bs: "Hisnul-Muslimi, 175", en: 'Hisn al-Muslim, 185' },
    sourceUrl: 'https://sunnah.com/hisn:185',
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
