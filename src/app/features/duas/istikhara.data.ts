import type { Dua } from './duas.data';

// Bosnian wording: reader's Hisnul-Muslimi photographs, pages 55–56 (entry 74).
// Arabic and English: Hisn al-Muslim 74; the two-rakat instruction is in the narration.
export const ISTIKHARA_DUAS: readonly Dua[] = [
  {
    id: 'hisn-74',
    title: { bs: 'Dova istihare', en: 'Istikharah supplication' },
    arabic:
      'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي، فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي، ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي، فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ، ثُمَّ أَرْضِنِي بِهِ.',
    instructions: {
      bs: 'Kad te zaokupi odluka, klanjaj dva rekata neobaveznog namaza, zatim prouči dovu.',
      en: 'When deciding a matter, pray two rak‘ahs other than the obligatory prayer, then recite this supplication.',
    },
    transcription: {
      bs: 'Allāhumme innī este’ḫiruke bi ‘ilmike, ve estaqdiruke bi qudretike ve es’eluke min faḍlike-l-‘aẓīmi, fe inneke taqdiru ve lā aqdiru, ve ta‘lemu ve lā a‘lemu, ve Ente ‘Allāmu-l-gujūb. Allāhumme in kunte ta‘lemu enne hāḏe-l-emre (spomenuti o čemu se radi) ḫajrun lī fī dīnī ve me‘āšī ve ‘āqibeti emrī (ili je rekao: ‘ādžilihi ve ādžilihi), faqdirhu lī ve jessirhu lī, tumme bārik lī fīhi, ve in kunte ta‘lemu enne hāḏe-l-emre (spomenuti o čemu se radi) šerrun lī fī dīnī ve me‘āšī ve ‘āqibeti emrī (ili je rekao: ‘ādžilihi ve ādžilihi), faṣrifhu ‘annī, va-ṣrifnī ‘anhu va-qdir lije-l-ḫajre ḥajtu kāne, tumme erḍinī bihī.',
      en: 'Allāhumma innī astakhīruka bi ‘ilmik, wa astaqdiruka bi qudratik, wa as’aluka min faḍlika-l-‘aẓīm. Fa’innaka taqdiru wa lā aqdir, wa ta‘lamu wa lā a‘lam, wa anta ‘allāmu-l-ghuyūb. Allāhumma in kunta ta‘lamu anna hādha-l-amra (mention the matter) khayrun lī fī dīnī wa ma‘āshī wa ‘āqibati amrī (or: ‘ājilihi wa ājilihi), faqdurhu lī wa yassirhu lī, thumma bārik lī fīh. Wa in kunta ta‘lamu anna hādha-l-amra (mention the matter) sharrun lī fī dīnī wa ma‘āshī wa ‘āqibati amrī (or: ‘ājilihi wa ājilihi), faṣrifhu ‘annī waṣrifnī ‘anh, waqdur liya-l-khayra ḥaythu kān, thumma arḍinī bih.',
    },
    translation: {
      bs: 'Allahu, Tebe pitam za odgovor (rješenje) pomoću Tvoga znanja, i od Tebe pomoć tražim Tvojom moći. Molim Te za Tvoju veliku dobrotu, jer Ti to možeš, a ja ne mogu, i jer Ti to znaš, a ja ne znam. Ti si Jedini znalac tajnog. Allahu, ako je ovo (spomenuti o čemu se radi) dobro za mene, moju vjeru i moj život, i moju smrt (ili je rekao: za moj život na ovom i na onome svijetu), omogući da se dogodi, i olakšaj mi, zatim me blagoslovi tim. A ako znaš da će u ovome (djelu, događaju) (spomenuti o čemu se radi) biti zlo za mene, vjeru moju i život i moju smrt (ili je rekao: za moj život na ovom i na onome svijetu), otkloni ga od mene i mene sačuvaj od njega. Odredi mi u tome dobro gdjegod ono bilo, zatim me učini zadovoljnim s tim.',
      en: 'O Allah, I seek Your guidance through Your knowledge and Your help through Your power, and I ask for Your great bounty. You are able and I am not; You know and I do not, and You know all that is unseen. If You know this matter (mention the matter) is good for my faith, my livelihood and the outcome of my affairs (or: in this life and the afterlife), decree it for me, make it easy and bless it for me. If You know this matter (mention the matter) is bad for my faith, my livelihood and the outcome of my affairs (or: in this life and the afterlife), turn it away from me and turn me away from it. Decree good for me wherever it is, then make me content with it.',
    },
    reference: { bs: 'Hisnul-Muslimi, 74', en: 'Hisn al-Muslim, 74' },
    sourceUrl: 'https://sunnah.com/hisn:74',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=32',
  },
];
