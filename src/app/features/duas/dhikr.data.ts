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

// Bosnian: reader's Hisnul-Muslimi photograph, pages 148–149 (238, 240).
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
      bs: 'Estagfirullāhe ve etūbuilejhi.',
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
