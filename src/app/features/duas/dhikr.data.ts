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

// Bosnian: reader's Hisnul-Muslimi photographs, pages 148–153 (238, 240; chapter 128, 1–2, 5–8).
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
      bs: 'Poslanik, sallallahu alejhi ve sellem, kazao je da više od sedamdeset puta dnevno traži oprost od Allaha i kaje Mu se.',
      en: 'The Prophet said that he sought Allah’s forgiveness and repented to Him more than seventy times each day.',
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
      bs: 'Prouči stotinu puta dnevno. U predaji se navodi nagrada kao za oslobađanje deset robova, upisivanje stotinu dobrih djela, brisanje stotinu loših djela i zaštita od šejtana toga dana sve dok noć ne nastupi. Niko ne može učiniti nešto vrednije od toga, osim onoga koji ove riječi izgovori više puta.',
      en: 'Recite one hundred times a day. The narration promises a reward equal to freeing ten slaves, one hundred good deeds recorded, one hundred misdeeds erased, and protection from Satan until evening. Only someone who does more can surpass this reward.',
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
      bs: 'Prouči stotinu puta na dan. Onome ko tako izgovori bit će skinuti (umanjeni) grijesi makar da su veličine morske pjene.',
      en: 'Recite one hundred times a day. The narration states that doing so brings forgiveness of sins, even if they are as abundant as sea foam.',
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
      bs: 'Ove dvije riječi lahke su na jeziku, teške na Vagi i drage Svemilosnom.',
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
    arabic: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ',
    instructions: {
      bs: 'Poslanik, sallallahu alejhi ve sellem, kazao je da mu je izgovaranje ovih riječi draže nego sve ono što sunce obasja.',
      en: 'The Prophet said that reciting these phrases was dearer to him than everything the sun shines upon.',
    },
    transcription: {
      bs: 'Subḥānallāhi ve-l-ḥamdu lillāhi ve lā ilāhe illellāhu vallāhu ekber.',
      en: 'Subḥānallāh, wal-ḥamdu lillāh, wa lā ilāha illallāh, wallāhu akbar.',
    },
    translation: {
      bs: 'Slavljen neka je Allah i hvala Mu, nema boga osim Allaha, Allah je najveći.',
      en: 'Glory be to Allah, and praise be to Allah. None is worthy of worship except Allah, and Allah is the Greatest.',
    },
    reference: {
      bs: 'Hisnul-Muslimi, poglavlje 128, 6',
      en: 'Hisn al-Muslim, 257',
    },
    sourceUrl: 'https://sunnah.com/hisn:257',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=94',
  },
  {
    id: 'hisn-258',
    categoryId: 'forgiveness',
    title: { bs: 'Tesbih za brisanje grijeha', en: 'Tasbih for forgiveness' },
    arabic: 'سُبْحَانَ اللَّهِ',
    instructions: {
      bs: 'Prouči stotinu puta dnevno. Bit će ti upisano hiljadu dobrih djela ili pobrisano hiljadu ružnih djela koja si počinio.',
      en: 'Recite one hundred times a day. The narration states that one thousand good deeds will be recorded, or one thousand sins erased.',
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
      bs: 'Onome ko izgovori ove riječi u Džennetu će biti zasađena palma.',
      en: 'The narration states that whoever says this will have a date palm planted for them in Paradise.',
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
  /* Previous entries retained for later review.
  {
    id: 'tawhid',
    title: { bs: 'Tevhid', en: 'Declaration of oneness' },
    arabic:
      'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transcription: {
      bs: 'Lā ilāhe illallāhu vaḥdehu lā šerīke leh, lehul-mulku ve lehul-ḥamdu, ve huve ‘alā kulli šej’in qadīr.',
      en: 'Lā ilāha illallāhu waḥdahu lā sharīka lahu, lahul-mulku wa lahul-ḥamdu, wa huwa ʿalā kulli shayʾin qadīr.',
    },
    translation: {
      bs: 'Nema boga osim Allaha, Jedinog, Koji nema sudruga. Njemu pripada vlast i zahvala, i On nad svim ima moć.',
      en: 'There is no god but Allah alone, with no partner. To Him belong dominion and praise, and He has power over all things.',
    },
    reference: { bs: 'Sahih el-Buhari, 6403', en: 'Sahih al-Bukhari, 6403' },
    sourceUrl: 'https://sunnah.com/bukhari:6403',
  },
  {
    id: 'two-phrases',
    title: { bs: 'Dvije lahke riječi', en: 'Two beloved phrases' },
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transcription: {
      bs: 'Subḥānallāhi ve biḥamdihi, subḥānallāhil-‘aẓīm.',
      en: 'Subḥānallāhi wa biḥamdihi, subḥānallāhil-ʿaẓīm.',
    },
    translation: {
      bs: 'Slavljen neka je Allah i Njemu pripada hvala; slavljen neka je Allah Veličanstveni.',
      en: 'Glory and praise be to Allah; glory be to Allah, the Magnificent.',
    },
    reference: { bs: 'Sahih el-Buhari, 6682', en: 'Sahih al-Bukhari, 6682' },
    sourceUrl: 'https://sunnah.com/bukhari:6682',
  },
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
  {
    id: 'four-phrases',
    title: { bs: 'Četiri drage riječi', en: 'Four beloved phrases' },
    arabic:
      'سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَٰهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ',
    transcription: {
      bs: 'Subḥānallāh, vel-ḥamdu lillāh, ve lā ilāhe illallāh, vallāhu ekber.',
      en: 'Subḥānallāh, wal-ḥamdu lillāh, wa lā ilāha illallāh, wallāhu akbar.',
    },
    translation: {
      bs: 'Slavljen neka je Allah. Hvala Allahu. Nema boga osim Allaha. Allah je najveći.',
      en: 'Glory be to Allah. Praise be to Allah. There is no god but Allah. Allah is the Greatest.',
    },
    reference: { bs: 'Sahih Muslim, 2137a', en: 'Sahih Muslim, 2137a' },
    sourceUrl: 'https://sunnah.com/muslim:2137a',
  },
  {
    id: 'istighfar',
    title: { bs: 'Istigfar', en: 'Seeking forgiveness' },
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transcription: {
      bs: 'Estagfirullāhe ve etūbu ilejhi.',
      en: 'Astaghfirullāha wa atūbu ilayh.',
    },
    translation: {
      bs: 'Od Allaha tražim oprost i Njemu se kajem.',
      en: 'I seek Allah’s forgiveness and turn to Him in repentance.',
    },
    reference: {
      bs: 'Sahih el-Buhari, 6307 (dio hadisa)',
      en: 'Sahih al-Bukhari, 6307 (excerpt)',
    },
    sourceUrl: 'https://sunnah.com/bukhari:6307',
  },
  */
];

// Category names come from Dove; only categories containing selected zikrovi appear.
export const DHIKR_CATEGORIES = DUA_CATEGORIES.map(({ id, label }) => ({
  id,
  label,
  items: DHIKR.filter((item) => item.categoryId === id),
})).filter((category) => category.items.length > 0);
