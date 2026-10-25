import type { Dua } from './duas.data';

// Bosnian meanings: IslamHouse Hisnul-Muslimi; transcriptions: reader's 2017 book photographs.
// English and Arabic: Sunnah.com Hisn al-Muslim.
export const SLEEP_DUAS: readonly Dua[] = [
  {
    id: 'hisn-111',
    title: { bs: 'Dova prije spavanja', en: 'Before sleeping' },
    arabic: 'اللّهُـمَّ أَسْـلَمْتُ نَفْـسي إِلَـيْكَ، وَفَوَّضْـتُ أَمْـري إِلَـيْكَ، وَوَجَّـهْتُ وَجْـهي إِلَـيْكَ، وَأَلْـجَـاْتُ ظَهـري إِلَـيْكَ، رَغْبَـةً وَرَهْـبَةً إِلَـيْكَ، لا مَلْجَـأَ وَلا مَنْـجـا مِنْـكَ إِلاّ إِلَـيْكَ، آمَنْـتُ بِكِتـابِكَ الّـذي أَنْزَلْـتَ وَبِنَبِـيِّـكَ الّـذي أَرْسَلْـت',
    instructions: {
      bs: 'Kad se odlučiš ići u postelju, prethodno uzmi abdest kao za namaz, potom lezi na desni bok i prouči dovu:',
      en: 'Before you go to bed perform ablutions as you would for prayer, then lie down on your right side and say. . .',
    },
    transcription: {
      bs: 'Allāhumme eslemtu nefsī ilejke ve fevvaḍtu emrī ilejke ve vedždžehtu vedžhī ilejke ve eldže’tu ẓahrī ilejke ragbeten ve rehbeten ilejke, lā meldže’e ve lā mendžā minke illā ilejke. Āmentu bi Kitābike-l-leḏī enzelte ve bi Nebijjike-l-leḏī erselte.',
      en: 'Allāhumma aslamtu nafsī ilayk, wa fawwaḍtu amrī ilayk, wa wajjahtu wajhī ilayk, wa alja\'tu ẓahrī ilayk, raghbatan wa rahbatan ilayk, lā malja\'a wa la manjā minka illā ilayk, āmantu bikitābika ‘l-ladhī anzalt, wa bi-nabiyyika ‘l-ladhī arsalt.',
    },
    translation: {
      bs: 'Allahu, Tebi predadoh svoju dušu, i oporučih svoje stanje, i upravih lice svoje, i prepustih (sklonih) svoja leđa iz želje i straha, jer nema skloništa ni spasilišta pred Tobom osim kod Tebe. Vjerujem u Tvoju Knjigu, koju si spustio, i u Tvoga Vjerovjesnika, koga si poslao.',
      en: "O Allah, I submit myself to You, entrust my affairs to You, turn my face to You, and lay myself down depending upon You, hoping in You and fearing You. There is no refuge, and no escape, except to You. I believe in Your Book (the Qur'an) that You revealed, and the Prophet whom You sent.",
    },
    reference: { bs: 'Hisnul-Muslimi, 103', en: 'Hisn al-Muslim, 111' },
    sourceUrl: 'https://sunnah.com/hisn:111',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=43',
  },
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
    id: 'hisn-114',
    title: { bs: 'Dova poslije ružnog snoviđenja', en: 'After a bad dream' },
    arabic: 'أعوذ بالله',
    instructions: {
      bs: 'Onaj ko sanja san koji mu nije drag neka ga ne priča nikome. Neka u lijevu stranu puhne tri puta, potom prouči ovu dovu tri puta i prevrne se na drugu stranu.',
      en: 'Whoever has a dream they dislike should not tell anyone about it. They should blow to their left three times, then recite this dua three times and turn onto their other side.',
    },
    transcription: {
      bs: 'E‘ūḏu billāhi.',
      en: "A'udhu billahi.",
    },
    translation: { bs: 'Utječem se Allahu.', en: 'I seek refuge in Allah.' },
    reference: { bs: 'Hisnul-Muslimi, 107–109', en: 'Hisn al-Muslim, 114' },
    sourceUrl: 'https://sunnah.com/hisn:114',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=45',
  },
  {
    id: 'hisn-113',
    title: { bs: 'Dova protiv nemira i straha u snu', en: 'When afraid during sleep' },
    arabic: 'أَعـوذُ بِكَلِمـاتِ اللّهِ التّـامّـاتِ مِن غَضَـبِهِ وَعِـقابِهِ وَشَـرِّ عِبـادِهِ وَمِنْ هَمَـزاتِ الشَّـياطينِ وَأَنْ يَحْضـرون',
    transcription: {
      bs: 'E‘ūḏu bi kelimātillāhi-t-tāmmāti min gaḍabihi ve ‘iqābihi ve šerri ‘ibādihi ve min hemezāti-š-šejāṭīni ve en jaḥḍurūn.',
      en: 'A`ūdhu bikalimāti ‘llāhit-tāmmāti min ghaḍabihi wa `iqābihi wa sharri `ibādih, wa min hamazātish-shayāṭīni wa an yaḥḍurūn.',
    },
    translation: {
      bs: 'Zaštitu tražim pomoću Allahovih savršenih Riječi pred Njegovom srdžbom i Njegovom kaznom, protiv zla robova Njegovih te protiv šejtanskih nagovaranja na zlo i njihova prisustva.',
      en: 'I seek refuge in the Perfect Words of Allah from His anger and His punishment, from the evil of His slaves, and from the taunts of devils and from their presence.',
    },
    reference: { bs: 'Hisnul-Muslimi, 105', en: 'Hisn al-Muslim, 113' },
    sourceUrl: 'https://sunnah.com/hisn:113',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=44',
  },
  {
    id: 'hisn-112',
    title: { bs: 'Dova pri prevrtanju u snu', en: 'When turning over during the night' },
    arabic: 'لا إِلـهَ إِلاّ اللهُ الـواحِدُ القَهّـار رَبُّ السَّـمواتِ وَالأرْضِ وَما بَيْـنَهـما العَزيـزُ الغَـفّار',
    transcription: {
      bs: 'Lā ilāhe illellāhu-l-Vāḥidu-l-Qahhāru Rabbi-s-semāvāti ve-l-erḍi ve mā bejnehume-l-‘Azīzu-l-Gaffār.',
      en: 'Lā ilāha illallāh al-Wāḥidul-Qahhār, Rabbus-samāwāti wa ‘l-arḍi wa mā baynahuma al-`Azīzul-Ghaffār.',
    },
    translation: {
      bs: 'Nema boga osim Allaha, Jednog i Silnog, Gospodara nebesa i Zemlje i prostora među njima, Silnog Oproštavatelja.',
      en: 'There is none worthy of worship but Allah, the One, the Victorious, Lord of the heavens and the earth and all that is between them, the All-Mighty, the All-Forgiving.',
    },
    reference: { bs: 'Hisnul-Muslimi, 104', en: 'Hisn al-Muslim, 112' },
    sourceUrl: 'https://sunnah.com/hisn:112',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=44',
  },
];
