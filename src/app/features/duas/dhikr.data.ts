import type { Dua } from './duas.data';

// Arabic follows the linked hadith; translations express the meaning of each phrase.
export const DHIKR: readonly Dua[] = [
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
];
