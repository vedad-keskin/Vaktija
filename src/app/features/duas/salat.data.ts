import type { Dua } from './duas.data';

// Bosnian: reader's Hisnul-Muslimi photographs, pages 27, 33–36, 39 and 40–43.
// Arabic and English: Hisn al-Muslim 28, 33, 38–39, 41, 49, 52–53, 55.
export const SALAT_DUAS: readonly Dua[] = [
  {
    id: 'hisn-28',
    title: { bs: 'Početna dova u namazu', en: 'Opening supplication in prayer' },
    arabic:
      'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ',
    instructions: {
      bs: 'Prouči nakon početnog tekbira, prije učenja Kur’ana u namazu.',
      en: 'Recite after the opening takbir, before reciting the Quran in prayer.',
    },
    transcription: {
      bs: 'Subḥāneke-llāhumme ve bi ḥamdike ve tebāreke-smuke ve te‘ālā džedduke ve lā ilāhe gajruke.',
      en: "Subḥānaka Allāhumma wa biḥamdika, wa tabāraka 'smuka, wa ta'ālā jadduka, wa lā 'ilāha ghayruk.",
    },
    translation: {
      bs: 'Tebi pripada slava, Allahu moj, i uvijek si hvaljen. Blagoslovljeno je Tvoje Ime, uzvišena je Tvoja veličina i nema boga osim Tebe.',
      en: 'Glory is to You O Allah, and praise. Blessed is Your Name and Exalted is Your Majesty. There is none worthy of worship but You.',
    },
    reference: { bs: 'Hisnul-Muslimi, 28', en: 'Hisn al-Muslim, 28' },
    sourceUrl: 'https://sunnah.com/hisn:28',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=15',
  },
  {
    id: 'hisn-33',
    title: { bs: 'Dova na rukūu', en: 'Remembrance while bowing' },
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    instructions: {
      bs: 'Proučiti tri puta na pregibanju u namazu.',
      en: 'Recite three times while bowing in prayer.',
    },
    transcription: {
      bs: 'Subḥāne Rabije-l-‘aẓīm.',
      en: 'Subḥāna Rabbiyal-‘Aẓīm.',
    },
    translation: {
      bs: 'Neka si slavljen, Gospodaru moj Veliki.',
      en: 'Glory to my Lord the Exalted.',
    },
    reference: { bs: 'Hisnul-Muslimi, 33', en: 'Hisn al-Muslim, 33' },
    sourceUrl: 'https://sunnah.com/hisn:33',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=19',
  },
  {
    id: 'hisn-38-39',
    title: { bs: 'Dove nakon povratka s rukūa', en: 'Upon rising from bowing' },
    sayings: [
      {
        arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ',
        transcription: { bs: 'Semi‘allāhu limen ḥamideh.', en: 'Sami‘allāhu liman ḥamidah.' },
        translation: { bs: 'Čuo Allah onoga ko Ga hvali.', en: 'Allah hears whoever praises Him.' },
      },
      {
        arabic: 'رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
        transcription: {
          bs: 'Rabbenā ve leke-l-ḥamdu ḥamden keṯīren, ṭajjiben, mubāreken fīhi.',
          en: 'Rabbanā wa lakal-ḥamd, ḥamdan kathīran ṭayyiban mubārakan fīh.',
        },
        translation: {
          bs: 'Gospodaru naš, Tebi hvala, beskonačna hvala, lijepa hvala, u kojoj je svaki blagoslov.',
          en: 'Our Lord, praise is Yours, abundant, good and blessed praise.',
        },
      },
    ],
    reference: { bs: 'Hisnul-Muslimi, 38–39', en: 'Hisn al-Muslim, 38–39' },
    sourceUrl: 'https://sunnah.com/hisn:38',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=20',
  },
  {
    id: 'hisn-41',
    title: { bs: 'Dova na sedždi', en: 'Remembrance while prostrating' },
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    instructions: {
      bs: 'Proučiti tri puta na sedždi.',
      en: 'Recite three times while prostrating in prayer.',
    },
    transcription: {
      bs: 'Subḥāne Rabbije-l-‘alā.',
      en: 'Subḥāna Rabbiya ‘l-a‘lā.',
    },
    translation: {
      bs: 'Neka si slavljen, moj najviši Gospodaru.',
      en: 'Glory is to my Lord, the Most High.',
    },
    reference: { bs: 'Hisnul-Muslimi, 41', en: 'Hisn al-Muslim, 41' },
    sourceUrl: 'https://sunnah.com/hisn:41',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=21',
  },
  {
    id: 'hisn-49',
    title: { bs: 'Dova između dvije sedžde', en: 'Between the two prostrations' },
    arabic:
      'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَاجْبُرْنِي وَعَافِنِي وَارْزُقْنِي وَارْفَعْنِي',
    transcription: {
      bs: 'Allāhumme-gfir lī, verḥamnī vehdinī vedžburnī, ve ‘āfinī verzuqnī verfa‘nī.',
      en: 'Allāhumma’ghfir lī, war’ḥamnī, wahdinī, wajburnī, wa ‘āfinī, warzuqnī, warfa‘nī.',
    },
    translation: {
      bs: 'Allahu moj, oprosti mi i smiluj se, uputi me i učini zadovoljnim (bogatim), sačuvaj me, nafaku mi daj i uzdigni me.',
      en: 'O Allah forgive me, have mercy on me, guide me, support me, protect me, provide for me, and elevate me.',
    },
    reference: { bs: 'Hisnul-Muslimi, 49', en: 'Hisn al-Muslim, 49' },
    sourceUrl: 'https://sunnah.com/hisn:49',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=22',
  },
  {
    id: 'hisn-52',
    title: {
      bs: 'Dova na sjedenju u namazu (tešehhud)',
      en: 'Dua on sitting in prayer (tashahhud)',
    },
    arabic:
      'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ. أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    transcription: {
      bs: 'Etteḥijjātu lillāhi ve-ṣ-ṣalevātu ve-ṭ-ṭajjibātu, es-selāmu ‘alejke ejjuhe-n-nebijju ve raḥmetullāhi ve berekātuhu, es-selāmu ‘alejnā ve ‘alā ‘ibādillāhi-ṣ-ṣāliḥīn. Ešhedu en lā ilāhe illellāhu ve ešhedu enne Muḥammeden ‘abduhu ve Resūluhu.',
      en: 'Attaḥiyyātu lillāhi waṣṣalawātu, waṭṭayyibāt, assalāmu ‘alayka ayyuhan-Nabiyyu wa raḥmatullāhi wa barakātuh, assalāmu ‘alaynā wa ‘alā ‘ibādillāhiṣ-ṣāliḥīn. Ash-hadu an lā ilāha illallāh wa ash-hadu anna Muḥammadan ‘abduhu wa rasūluh.',
    },
    translation: {
      bs: 'Najljepši selami, salavati i pohvale Allahu; selam tebi, Vjerovjesniče, i Allahova milost i Njegov blagoslov; selam nama i dobrim Allahovim robovima. Svjedočim da nema boga osim Allaha i svjedočim da je Muhammed Njegov rob i Njegov Poslanik.',
      en: 'All greetings of humility are for Allah, and all prayers and goodness. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous slaves of Allah. I bear witness that there is none worthy of worship but Allah, and I bear witness that Muhammad is His slave and His Messenger.',
    },
    reference: { bs: 'Hisnul-Muslimi, 52', en: 'Hisn al-Muslim, 52' },
    sourceUrl: 'https://sunnah.com/hisn:52',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=24',
  },
  {
    id: 'hisn-53',
    title: { bs: 'Salavati poslije tešehhuda', en: 'Blessings upon the Prophet after tashahhud' },
    arabic:
      'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transcription: {
      bs: 'Allāhumme ṣalli ‘alā Muḥammedin ve ‘alā āli Muḥammed, kemā ṣallejte ‘alā Ibrāhīme ve ‘alā āli Ibrāhīme, inneke ḥamīdun medžīd. Allāhumme bārik ‘alā Muḥammedin ve ‘alā āli Muḥammed kemā bārekte ‘alā Ibrāhīme ve ‘alā āli Ibrāhīme inneke ḥamīdun medžīd.',
      en: 'Allāhumma ṣalli ‘alā Muḥammadin wa ‘alā āli Muḥammadin, kamā ṣallayta ‘alā Ibrāhīma wa ‘alā āli Ibrāhīma, innaka ḥamīdum-majīd. Allāhumma bārik ‘alā Muḥammadin wa ‘alā āli Muḥammadin, kamā bārakta ‘alā Ibrāhīma wa ‘alā āli Ibrāhīma, innaka ḥamīdum-majīd.',
    },
    translation: {
      bs: 'Allahu moj, smiluj se (donesi salavat) Muhammedu, sallallahu alejhi ve sellem, i njegovom potomstvu kao što si se smilovao Ibrahimu, alejhis-selam, i njegovom potomstvu. Zaista si Ti hvaljen i slavljen. Allahu moj, blagoslovi Muhammeda, sallallahu alejhi ve sellem, i njegovo potomstvo kao što si blagoslovio Ibrahima, a.s., i njegovo potomstvo. Doista si Ti hvaljen i slavljen.',
      en: 'O Allah, bestow Your favor on Muhammad and on the family of Muhammad as You have bestowed Your favor on Ibrahim and on the family of Ibrahim, You are Praiseworthy, Most Glorious. O Allah, bless Muhammad and the family of Muhammad as You have blessed Ibrahim and the family of Ibrahim, You are Praiseworthy, Most Glorious.',
    },
    reference: { bs: 'Hisnul-Muslimi, 53', en: 'Hisn al-Muslim, 53' },
    sourceUrl: 'https://sunnah.com/hisn:53',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=24',
  },
  {
    id: 'hisn-56',
    title: {
      bs: 'Dova poslije završnog tešehhuda, prije selama',
      en: 'After the final tashahhud, before salam',
    },
    arabic:
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْمَأْثَمِ وَالْمَغْرَمِ',
    transcription: {
      bs: 'Allāhumme innī e‘ūḏu bike min ‘aḏābi-l-qabri ve e‘ūḏu bike min fitneti-l-mesīḥi-d-dedždžāli, ve e‘ūḏu bike min fitneti-l-maḥjā ve-l-memāt. Allāhumme innī e‘ūḏu bike mine-l-me’ṯemi ve-l-magrem.',
      en: 'Allāhumma innī a‘ūdhu bika min ‘adhābi ‘l-qabr, wa a‘ūdhu bika min fitnati ‘l-masīḥid-dajjāl, wa a‘ūdhu bika min fitnati ‘l-maḥyā wa ‘l-mamāt. Allāhumma innī a‘ūdhu bika mina ‘l-ma’thami wa ‘l-maghram.',
    },
    translation: {
      bs: 'Allahu, sklanjam se u okrilje Tvoje pred kaburskom kaznom i pred fitnelukom Mesiha Dedžala, te pred fitnelukom ovog i budućeg svijeta. Allahu, utječem Ti se od grijeha i duga koji se ne može vratiti.',
      en: 'O Allah, I seek refuge in You from the punishment of the grave, and I seek refuge in You from the trial of the False Messiah, and I seek refuge in You from the trials of life and death. O Allah, I seek refuge in You from sin and from debt.',
    },
    reference: { bs: 'Hisnul-Muslimi, 56', en: 'Hisn al-Muslim, 56' },
    sourceUrl: 'https://sunnah.com/hisn:56',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=25',
  },
];
