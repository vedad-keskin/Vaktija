import type { Dua } from './duas.data';

// Bosnian wording: photographed Hisnul-Muslimi entry 22 and IslamHouse entry 25.
// English and Arabic: Sunnah.com Hisn al-Muslim, entries 22 and 25.
// Bosnian transcription uses the photographed 2017 letter key (see README-full).
export const ADHAN_DUAS: readonly Dua[] = [
  {
    id: 'hisn-22',
    title: { bs: 'Odgovor pri slušanju ezana', en: 'Responding to the adhan' },
    sayings: [
      {
        arabic: 'حَيَّ عَلَى الصَّلَاةِ، وَحَيَّ عَلَى الْفَلَاحِ',
        instructions: {
          bs: 'Ponavljaj za mujezinom sve riječi ezana osim ovih:',
          en: "Repeat the caller's words, except these:",
        },
        transcription: {
          bs: 'Hajje ‘ale-ṣ-ṣalāh, hajje ‘ale-l-felāḥ.',
          en: "Hayya 'alas-Salāh, hayya 'alal-Falāh.",
        },
        translation: {
          bs: 'Dođite na namaz, dođite na spas.',
          en: 'Hasten to prayer, hasten to salvation.',
        },
      },
      {
        arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
        instructions: {
          bs: 'Kada čuješ ove riječi, umjesto njih odgovori:',
          en: 'When you hear these words, reply instead:',
        },
        transcription: {
          bs: 'Lā ḥavle ve lā quvvete illā billāh.',
          en: "Lā ḥawla wa lā quwwata 'illā billāh.",
        },
        translation: {
          bs: 'Nema snage niti moći osim Allahove (pomoći i moći).',
          en: 'There is no might and no power except by Allah.',
        },
      },
    ],
    reference: { bs: 'Hisnul-Muslimi, 22', en: 'Hisn al-Muslim, 22' },
    sourceUrl: 'https://sunnah.com/hisn:22',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=14',
  },
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
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=14',
  },
];
