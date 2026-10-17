import type { Dua } from './duas.data';

// Bosnian meanings: IslamHouse Hisnul-Muslimi, entries 183–184a.
// English and Arabic: Sunnah.com Hisn al-Muslim 195–196; Fath al-Rabbani 9520 for 184a.
// Bosnian transcription adapts the published recitation with the photographed letter key.
export const GATHERING_DUAS: readonly Dua[] = [
  {
    id: 'hisn-195',
    title: { bs: 'Dova na sijelu', en: 'During a gathering' },
    arabic: 'رب اغفر لي وتب علي إنك أنت التواب الغفور',
    transcription: {
      bs: 'Rabbi-gfir lī ve tub ‘alejje inneke Ente-t-Tevvābu-l-Gafūr.',
      en: 'Rabbigh’fir lī wa tub `alayy innaka antat-Tawwābu ‘l-Ghafūr.',
    },
    translation: {
      bs: 'Gospodaru moj, oprosti mi i primi moje pokajanje, jer Ti si, zaista, Onaj Koji primaš pokajanja i opraštaš grijehe.',
      en: 'My Lord, forgive me, and accept my repentance, You are the Ever-Relenting, the All-Forgiving.',
    },
    reference: { bs: 'Hisnul-Muslimi, 183', en: 'Hisn al-Muslim, 195' },
    sourceUrl: 'https://sunnah.com/hisn:195',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=69',
  },
  {
    id: 'bs-184a',
    title: { bs: 'Dova kojom se završavaju sva sijela', en: 'When leaving a gathering' },
    arabic: 'سُبْحَانَكَ وَبِحَمْدِكَ لَا إِلَهَ إِلَّا أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
    transcription: {
      bs: 'Subḥāneke ve biḥamdike, lā ilāhe illā Ente, estagfiruke ve etūbu ilejke.',
      en: 'Subhanaka wa bihamdika la ilaha illa anta astaghfiruka wa atubu ilayk',
    },
    translation: {
      bs: 'Neka si slavljen i hvaljen, Allahu moj. Nema Boga osim Tebe, Tebe ja molim za oprost grijeha i Tebi se iskreno kajem.',
      en: 'Glory is to You and with Your praise, there is no true deity except You, I seek Your forgiveness and turn to You',
    },
    reference: { bs: 'Hisnul-Muslimi, 184a', en: 'Fath al-Rabbani, 9520' },
    sourceUrl: 'https://en.tohed.com/hadith/al-fath-al-rabbani/9520/',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=70',
  },
  {
    id: 'hisn-196',
    title: { bs: 'Dova za iskupljenje grijeha na sijelu', en: 'At the end of a gathering' },
    arabic: 'سُبْحـانَكَ اللّهُـمَّ وَبِحَمدِك، أَشْهَـدُ أَنْ لا إِلهَ إِلاّ أَنْتَ أَسْتَغْفِرُكَ وَأَتوبُ إِلَـيْك',
    transcription: {
      bs: 'Subḥāneke Allāhumme ve biḥamdike, ešhedu en lā ilāhe illā Ente, estagfiruke ve etūbu ilejke.',
      en: 'Subhānaka Allāhumma wa biḥamdik, ash-hadu an lā ilāha illā ant, astaghfiruka wa atību ilayk.',
    },
    translation: {
      bs: 'Neka si slavljen, Allahu, i neka Ti je hvala. Svjedočim da nema boga osim Tebe. Od Tebe tražim oprost i Tebi se kajem.',
      en: 'Glory is to You, O Allah, and praise is to You. I bear witness that there is none worthy of worship but You. I seek Your forgiveness and repent to You.',
    },
    reference: { bs: 'Hisnul-Muslimi, 184', en: 'Hisn al-Muslim, 196' },
    sourceUrl: 'https://sunnah.com/hisn:196',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=69',
  },
];
