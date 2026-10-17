import type { Dua } from './duas.data';

// Bosnian meaning: IslamHouse Hisnul-Muslimi, entry 25.
// English and Arabic: Sunnah.com Hisn al-Muslim, entry 25.
// Bosnian transcription uses the photographed 2017 letter key (see README-full).
export const ADHAN_DUAS: readonly Dua[] = [
  {
    id: 'hisn-25',
    title: { bs: 'Dova poslije ezana', en: 'Supplication after the adhan' },
    arabic:
      'اللّهُـمَّ رَبَّ هَذِهِ الدّعْـوَةِ التّـامَّة وَالصّلاةِ القَـائِمَة آتِ محَـمَّداً الوَسيـلةَ وَالْفَضـيلَة وَابْعَـثْه مَقـامـاً مَحـموداً الَّذي وَعَـدْتَه',
    transcription: {
      bs: 'Allāhumme rabbe hāḏihi-d-da‘veti-t-tāmmeti ve-ṣ-ṣalāti-l-qā’imeti āti Muḥammedeni-l-vesīlete ve-l-faḍīlete ve-b‘aṯhu meqāmen maḥmūdeni-l-leḏī ve‘adtehu.',
      en: "Allāhumma rabba hādhihi 'd-da'wati 't-tāmmah waṣ-ṣalāti 'l-qā'imah, 'āti Muhammadani 'l-wasīlata walfaḍīlata, wab 'ath-hu maqāma 'm-mahmūdani 'l-ladhī wa`adtahu.",
    },
    translation: {
      bs: 'Allahu moj, Gospodaru ovog cjelovitog poziva, podari Muhammedu poseban stepen u Džennetu i svako dobro, te uzdigni ga na uzvišeno mjesto koje si mu obećao.',
      en: 'O Allah , Lord of this perfect call and established prayer. Grant Muhammad the intercession and favor, and raise him to the honored station You have promised him.',
    },
    reference: { bs: 'Hisnul-Muslimi, 25', en: 'Hisn al-Muslim, 25' },
    sourceUrl: 'https://sunnah.com/hisn:25',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=18',
  },
];
