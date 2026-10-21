import type { Dua } from './duas.data';

// Bosnian meanings: IslamHouse Hisnul-Muslimi, entries 19–21.
// Bosnian transcriptions: reader's photographs of the 2017 edition, pages 21–23.
// English HM-19 uses the shorter published Hisnul Muslim wording matching that edition.
export const MOSQUE_DUAS: readonly Dua[] = [
  {
    id: 'hisn-19',
    title: { bs: 'Dova pri odlasku u džamiju', en: 'When going to the mosque' },
    arabic:
      'اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا، وَفِي لِسَانِي نُورًا، وَاجْعَلْ فِي سَمْعِي نُورًا، وَاجْعَلْ فِي بَصَرِي نُورًا، وَاجْعَلْ مِنْ خَلْفِي نُورًا، وَمِنْ أَمَامِي نُورًا، وَاجْعَلْ مِنْ فَوْقِي نُورًا، وَمِنْ تَحْتِي نُورًا، اللَّهُمَّ أَعْطِنِي نُورًا',
    transcription: {
      bs: 'Allāhumme-dž‘al fī qalbī nūren, ve fī lisānī nūren, ve-dž‘al fī sem‘ī nūren, ve-dž‘al fī besarī nūren, ve-dž‘al min halfī nūren ve min emāmī nūren, ve-dž‘al min fevqī nūren ve min tahtī nūren. Allāhumme ‘atinī nūren.',
      en: "Allahummaj'al fi qalbi nuran, wa fi lisani nuran waj'al fi sam'i nuran waj'al fi basari nuran waj'al min khalfi nuran wa min amami nuran waj'al min fawqi nuran wa min tahti nuran. Allahumma a'tini nura.",
    },
    translation: {
      bs: 'Allahu moj, podari mi u srce svjetlo i u jezik svjetlo, osvijetli mi sluh i vid, daruj mi svjetlo iza mene i ispred mene, podari mi iznad mene i ispod mene svjetlo. Allahu moj, svjetlo mi daruj.',
      en: 'O Allah, place within my heart light, and upon my tongue light, and within my ears light, and within my eyes light, and place behind me light and in front of me light and above me light and beneath me light. O Allah, bestow upon me light.',
    },
    reference: { bs: 'Hisnul-Muslimi, 19', en: 'Hisn al-Muslim, 19' },
    sourceUrl: 'https://ahadith.co.uk/permalink-hadith-27/hisnulmuslim-dua-12',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=12',
  },
  {
    id: 'hisn-20',
    title: { bs: 'Dova pri ulasku u džamiju', en: 'Upon entering the mosque' },
    arabic:
      'أَعُوذُ بِاللَّهِ الْعَظِيمِ وَبِوَجْهِهِ الْكَرِيمِ وَسُلْطَانِهِ الْقَدِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ. بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ. اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transcription: {
      bs: 'E‘ūḏu billāhi-l-‘azīmi ve bi vedžhihi-l-kerīmi ve sultānihi-l-qadīmi mine-š-šejtāni-r-radžīm. Bismillāh, ve-ṣ-ṣalātu ve-s-selāmu ‘alā Resūlillāh. Allāhumme-ftaḥ li ebvābe raḥmetike.',
      en: 'A‘ūdhu billāh-il ‘azhīm, wa bi-wajhihi-l-karīm, wa sultānihi-l-qadīm, min-ash-shaytān-ir-rajīm. Bismillāhi, was-salātu was-salāmu ‘ala rasūlillāh. Allāhumma iftah li abwāba rahmatik.',
    },
    translation: {
      bs: 'Sklanjam se u okrilje Velikog Allaha, pred Njegovo lice časno, Njegovu vlast pravječnu, pred prokletim šejtanom. U ime Allaha, blagoslovi i spas i mir Njegovu Poslaniku. Allahu moj, otvori mi vrata milosti Tvoje.',
      en: 'I take refuge with Allah, The Supreme and with His Noble Face, and His eternal authority from the accursed devil. In the name of Allah, and prayers and peace be upon the Messenger of Allah. O Allah, open the gates of Your mercy for me.',
    },
    reference: { bs: 'Hisnul-Muslimi, 20', en: 'Hisn al-Muslim, 20' },
    sourceUrl: 'https://ahadith.co.uk/permalink-hadith-27/hisnulmuslim-dua-13',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=13',
  },
  {
    id: 'hisn-21',
    title: { bs: 'Dova pri izlasku iz džamije', en: 'Upon leaving the mosque' },
    arabic:
      'بِسمِ الله وَالصّلاةُ وَالسّلامُ عَلى رَسولِ الله، اللّهُـمَّ إِنّـي أَسْأَلُكَ مِـنْ فَضْـلِك، اللّهُـمَّ اعصِمْنـي مِنَ الشَّيْـطانِ الرَّجـيم',
    transcription: {
      bs: 'Bismillāhi ve-s-salātu ve-s-selāmu ‘alā Resūlillāhi, Allāhumme innī es’eluke min faḍlike, Allāhumme-‘ṣimnī mine-š-šejtāni-r-radžīm.',
      en: "Bismillāhi waṣṣalātu wassalāmu 'alā Rasūlillāhi, Allāhumma 'innī 'as'aluka min faḍlika, Allāhumma`ṣimnī min ash-shaytānir-rajīm.",
    },
    translation: {
      bs: 'U ime Allaha, blagoslov i mir i spas Allahovu Poslaniku. Allahu moj, molim Ti se da me obaspeš dobrom. Allahu moj, zaštiti me od prokletog šejtana.',
      en: 'In the name of Allah, and prayers and peace be upon the Messenger of Allah. O Allah, I ask You from Your favour. O Allah, guard me from the accursed devil.',
    },
    reference: { bs: 'Hisnul-Muslimi, 21', en: 'Hisn al-Muslim, 21' },
    sourceUrl: 'https://ahadith.co.uk/hisnulmuslim-dua-14',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=13',
  },
];
