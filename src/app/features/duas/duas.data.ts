import { LangCode } from '../../core/services/language.service';

export type Dua = {
  id: string;
  title: Record<LangCode, string>;
  arabic: string;
  transcription: Record<LangCode, string>;
  translation: Record<LangCode, string>;
  reference: Record<LangCode, string>;
  sourceUrl: string;
};

// Arabic follows the linked sources; translations express the meaning of each supplication.
export const DUAS: readonly Dua[] = [
  {
    id: 'knowledge',
    title: { bs: 'Dova za znanje', en: 'Dua for knowledge' },
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    transcription: { bs: 'Rabbi zidnī ʿilmā.', en: 'Rabbī zidnī ʿilmā.' },
    translation: {
      bs: 'Gospodaru moj, povećaj mi znanje.',
      en: 'My Lord, increase me in knowledge.',
    },
    reference: { bs: 'Kur’an, Ta-Ha 20:114 (dio ajeta)', en: 'Qur’an, Ta-Ha 20:114 (excerpt)' },
    sourceUrl: 'https://quran.com/20/114',
  },
  {
    id: 'forgiveness',
    title: { bs: 'Dova za oprost i milost', en: 'Dua for forgiveness and mercy' },
    arabic: 'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي',
    transcription: {
      bs: 'Allāhumme-ġfir lī, verḥamnī, vehdinī, ve ʿāfinī, verzuqnī.',
      en: 'Allāhumma-ghfir lī, warḥamnī, wahdinī, wa ʿāfinī, warzuqnī.',
    },
    translation: {
      bs: 'Allahu, oprosti mi, smiluj mi se, uputi me, podari mi zdravlje i opskrbi me.',
      en: 'O Allah, forgive me, show me mercy, guide me, grant me wellbeing, and provide for me.',
    },
    reference: { bs: 'Sahih Muslim, 2697b', en: 'Sahih Muslim, 2697b' },
    sourceUrl: 'https://sunnah.com/muslim:2697b',
  },
  {
    id: 'after-adhan',
    title: { bs: 'Dova poslije ezana', en: 'Dua after the adhan' },
    arabic:
      'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
    transcription: {
      bs: 'Allāhumme Rabbe hāḏihid-daʿvetit-tāmmeti veṣ-ṣalātil-qāʾimeti, āti Muḥammedenil-vesīlete vel-faḍīlete, vebʿaṯhu meqāmen maḥmūdenilleḏī veʿadteh.',
      en: 'Allāhumma rabba hādhihid-daʿwatit-tāmmati waṣ-ṣalātil-qāʾimati, āti Muḥammadanil-wasīlata wal-faḍīlata, wabʿathhu maqāman maḥmūdan alladhī waʿadtah.',
    },
    translation: {
      bs: 'Allahu, Gospodaru ovog cjelovitog poziva, podari Muhammedu poseban stepen i Džennetu i svako dobro, te uzdigni ga na uzvišeno mjesto koje si mu obećao.',
      en: 'O Allah, Lord of this complete call and the prayer being established, grant Muhammad the highest station and distinction, and raise him to the praised position You have promised him.',
    },
    reference: { bs: 'Sahih el-Buhari, 614', en: 'Sahih al-Bukhari, 614' },
    sourceUrl: 'https://sunnah.com/bukhari:614',
  },
  {
    id: 'both-worlds',
    title: { bs: 'Dova za dobro na oba svijeta', en: 'Dua for good in both worlds' },
    arabic:
      'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transcription: {
      bs: 'Rabbenā ātinā fid-dunjā ḥaseneten ve fil-āḫireti ḥaseneten ve qinā ʿaḏāben-nār.',
      en: 'Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā ʿadhāban-nār.',
    },
    translation: {
      bs: 'Gospodaru naš, podari nam dobro na ovom i na budućem svijetu i sačuvaj nas patnje u Vatri.',
      en: 'Our Lord, give us good in this world and in the Hereafter, and shield us from the punishment of the Fire.',
    },
    reference: {
      bs: 'Kur’an, El-Bekare 2:201 (dio ajeta)',
      en: 'Qur’an, Al-Baqarah 2:201 (excerpt)',
    },
    sourceUrl: 'https://quran.com/2/201',
  },
  {
    id: 'before-sleep',
    title: { bs: 'Dova prije spavanja', en: 'Dua before sleeping' },
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transcription: {
      bs: 'Bismike Allāhumme emūtu ve aḥjā.',
      en: 'Bismika Allāhumma amūtu wa aḥyā.',
    },
    translation: {
      bs: 'U Tvoje ime, Allahu, umirem i živim.',
      en: 'In Your name, O Allah, I die and I live.',
    },
    reference: { bs: 'Sahih el-Buhari, 6324', en: 'Sahih al-Bukhari, 6324' },
    sourceUrl: 'https://sunnah.com/bukhari:6324',
  },
  {
    id: 'on-waking',
    title: { bs: 'Dova nakon buđenja', en: 'Dua on waking' },
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transcription: {
      bs: 'El-ḥamdu lillāhilleḏī aḥjānā baʿde mā emātenā ve ilejhin-nušūr.',
      en: 'Al-ḥamdu lillāhilladhī aḥyānā baʿda mā amātanā wa ilayhin-nushūr.',
    },
    translation: {
      bs: 'Hvala Allahu, koji nas je oživio nakon što nas je usmrtio, i Njemu ćemo biti proživljeni.',
      en: 'Praise belongs to Allah, who restored us to life after causing us to die; to Him is the resurrection.',
    },
    reference: { bs: 'Sahih el-Buhari, 6324', en: 'Sahih al-Bukhari, 6324' },
    sourceUrl: 'https://sunnah.com/bukhari:6324',
  },
];
