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
    title: { bs: 'Dova za znanje', en: 'For knowledge' },
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    transcription: { bs: 'Rabbi zidni ilma.', en: 'Rabbī zidnī ʿilmā.' },
    translation: {
      bs: 'Gospodaru moj, povećaj mi znanje.',
      en: 'My Lord, increase me in knowledge.',
    },
    reference: { bs: 'Kur’an, Ta-Ha 20:114 (dio ajeta)', en: 'Qur’an, Ta-Ha 20:114 (excerpt)' },
    sourceUrl: 'https://quran.com/20/114',
  },
  {
    id: 'forgiveness',
    title: { bs: 'Dova za oprost i milost', en: 'For forgiveness and mercy' },
    arabic: 'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي',
    transcription: {
      bs: 'Allahumme-gfir li, verhamni, vehdini, ve afini, verzukni.',
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
    title: { bs: 'Dova poslije ezana', en: 'After the adhan' },
    arabic:
      'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
    transcription: {
      bs: 'Allahumme Rabbe hazihid-da’vetit-tammeti ves-salatil-ka’imeti, ati Muhammedenil-vesilete vel-fadilete, veb’ashu mekamen mahmudenillezi ve’adteh.',
      en: 'Allāhumma rabba hādhihid-daʿwatit-tāmmati waṣ-ṣalātil-qāʾimati, āti Muḥammadanil-wasīlata wal-faḍīlata, wabʿathhu maqāman maḥmūdan alladhī waʿadtah.',
    },
    translation: {
      bs: 'Allahu, Gospodaru ovog potpunog poziva i namaza koji se uspostavlja, podari Muhammedu vesilu i odliku i uzdigni ga na hvale vrijedno mjesto koje si mu obećao.',
      en: 'O Allah, Lord of this complete call and the prayer being established, grant Muhammad the highest station and distinction, and raise him to the praised position You have promised him.',
    },
    reference: { bs: 'Sahih el-Buhari, 614', en: 'Sahih al-Bukhari, 614' },
    sourceUrl: 'https://sunnah.com/bukhari:614',
  },
  {
    id: 'both-worlds',
    title: { bs: 'Dobro na oba svijeta', en: 'Good in both worlds' },
    arabic:
      'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transcription: {
      bs: 'Rabbena atina fid-dunja haseneten ve fil-ahireti haseneten ve kina azaben-nar.',
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
    title: { bs: 'Prije spavanja', en: 'Before sleeping' },
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transcription: {
      bs: 'Bismike Allahumme emutu ve ahja.',
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
    title: { bs: 'Nakon buđenja', en: 'On waking' },
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transcription: {
      bs: 'El-hamdu lillahillezi ahjana ba’de ma ematena ve ilejhin-nušur.',
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
