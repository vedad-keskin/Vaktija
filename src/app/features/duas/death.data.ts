import type { Dua } from './duas.data';

// Bosnian transcriptions and meanings: reader's Hisnul-Muslimi photographs (147–156)
// and the linked Bosnian edition (143–146). English and Arabic: linked Sunnah.com entries.
export const DEATH_DUAS: readonly Dua[] = [
  {
    id: 'hisn-162',
    title: { bs: 'Dova kao izraz saosjećanja', en: 'Words of condolence' },
    arabic:
      'إِنَّ لِلَّهِ مَا أَخَذَ وَلَهُ مَا أَعْطَى، وَكُلُّ شَيْءٍ عِنْدَهُ بِأَجَلٍ مُسَمًّى، فَلْتَصْبِرْ وَلْتَحْتَسِبْ',
    transcription: {
      bs: 'Inne lillāhi mā eḫaḏe, ve lehū mā e‘ṭā ve kullu šej’in ‘indehū bi edželin musemmā, fe-l-taṣbir ve-l-taḥtesib.',
      en: "Inna lillāhi mā akhadh, wa lahu mā a`tā, wa kullu shay'in `indahu bi ajalin musammā . . . faltaṣbir wa ‘l-taḥtasib.",
    },
    translation: {
      bs: 'Allahu pripada ono što je uzeo i Njegovo je ono što je On dao. Kod Njega sve ima određeni rok. Zato, strpi se i nadaj se nagradi.',
      en: 'Surely, Allah takes what is His, and what He gives is His, and to all things He has appointed a time... so have patience and be rewarded.',
    },
    reference: { bs: 'Hisnul-Muslimi, 152', en: 'Hisn al-Muslim, 162' },
    sourceUrl: 'https://sunnah.com/hisn:162',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=59',
  },
  {
    id: 'hisn-154',
    title: { bs: 'Dova pri smrti bliske osobe', en: 'When afflicted by a loss' },
    arabic:
      'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَاخْلُفْ لِي خَيْرًا مِنْهَا',
    transcription: {
      bs: 'Innā lillāhi ve innā ilejhi rādži‘ūn. Allāhumme’džurnī fī muṣībetī vaẖluf lī ẖajren minhā.',
      en: "Innā lillāhi wa innā ilayhi rāji`ūn, Allāhumma-jurni fī muṣībatī wa 'khluf lī khayran minhā.",
    },
    translation: {
      bs: 'Mi zaista pripadamo Allahu i svi Mu se, bez dvoumljenja, vraćamo. Allahu, daruj mi u ovome mom musibetu (nesreći) nagradu (za sabur) i nakon toga mi podari veće dobro.',
      en: 'We are from Allah and unto Him we return. O Allah take me out of my plight and bring to me after it something better.',
    },
    reference: { bs: 'Hisnul-Muslimi, 144', en: 'Hisn al-Muslim, 154' },
    sourceUrl: 'https://sunnah.com/hisn:154',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=56',
  },
  {
    id: 'hisn-156',
    title: { bs: 'Dženazetska dova za umrlog', en: 'Funeral prayer for the deceased' },
    // Amiri draws ")" as "(" in RTL. Isolates keep a real closing mark; joiners keep the pair on one line.
    arabic:
      'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ، وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ، وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِ مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الْأَبْيَضَ مِنَ الدَّنَسِ، وَأَبْدِلْهُ دَارًا خَيْرًا مِنْ دَارِهِ، وَأَهْلًا خَيْرًا مِنْ أَهْلِهِ، وَزَوْجًا خَيْرًا مِنْ زَوْجِهِ، وَأَدْخِلْهُ الْجَنَّةَ، وَأَعِذْهُ مِنْ عَذَابِ الْقَبْرِ \u2060\u2066)\u2069\u2060وَعَذَابِ\u00A0النَّارِ\u2060\u2066(\u2069\u2060',
    transcription: {
      bs: 'Allāhumma-gfir lehū ve-rḥamhū ve ‘āfihī va‘fu ‘anhū ve ekrim nuzulehū ve vessi‘ mudẖalehū vagsilhū bi-l-māi ve-s-ṯeldži ve-l-berdi ve neqqihī mine-l-ẖaṭājā kemā neqqajte-s-ṯevbe-l-ebjeda mine-d-denisi ve ebdilhū dāren ẖajren min dārihī ve ehlen ẖajren min ehlihī ve zevdžen ẖajren min zevdžihī ve edẖilhū-l-džennete ve e‘iḏhū min ‘aḏābi-l-qabri (ve ‘aḏābi-n-nāri).',
      en: "Allāhumma’ghfir lahu warḥamh, wa `āfihi, wa`fu `anh, wa akrim nuzulah, wa wassi` mudkhalah, wagh’silhu bi ‘lmā'i wath-thalji walbarad, wa naqqihi mina ‘l-khaṭāyā kamā naqqaytath-thawba ‘l-abyaḍa minad-danas, wa abdilhu dāran khayran min dārih, wa ahlan khayran min ahlih, wa zawjan khayran min zawjih, wa adkhilhu ‘l-jannah, wa a`idhhu min `adhābi ‘l-qabri [wa `adhābin-nār].",
    },
    translation: {
      bs: 'Allahu, oprosti mu i smiluj se, grijehe mu pobriši i sačuvaj ga, nagradi ga počasnim mjestom i učini širokim njegov ulaz (kabur), očisti ga vodom, snijegom i ledom, očisti ga od grijeha kao što bijelu odjeću čistiš od prljavštine. Zamijeni mu njegovu dunjalučku kuću za bolju od nje (ahiretsku), i njegovu porodicu za bolju, i njegovu suprugu za bolju od njegove dunjalučke. U Džennet ga uvedi i zaštiti ga od zagrobne kazne (i od džehenemske vatre).',
      en: 'O Allah, forgive him and have mercy on him, and give him strength and pardon him. Be generous to him, and cause his entrance to be wide, and wash him with water and snow and hail. Cleanse him of his transgressions as white cloth is cleansed of stains. Give him an abode better than his home, and a family better than his family, and a wife better than his wife. Take him into Paradise, and protect him from the punishment of the grave [and from the punishment of Hell-fire].',
    },
    reference: { bs: 'Hisnul-Muslimi, 146', en: 'Hisn al-Muslim, 156' },
    sourceUrl: 'https://sunnah.com/hisn:156',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=56',
  },
  {
    id: 'hisn-160',
    title: {
      bs: 'Dženazetska dova za maloljetno dijete',
      en: 'When the deceased is a child, during the funeral prayer',
    },
    arabic:
      'اللَّهُمَّ اجْعَلْهُ فَرَطًا وَذُخْرًا لِوَالِدَيْهِ، وَشَفِيعًا مُجَابًا. اللَّهُمَّ ثَقِّلْ بِهِ مَوَازِينَهُمَا وَأَعْظِمْ بِهِ أُجُورَهُمَا، وَأَلْحِقْهُ بِصَالِحِ الْمُؤْمِنِينَ، وَاجْعَلْهُ فِي كَفَالَةِ إِبْرَاهِيمَ، وَقِهِ بِرَحْمَتِكَ عَذَابَ الْجَحِيمِ',
    transcription: {
      bs: 'Allāhumme-dž‘alhu fereṭan ve ḏuhren li-vālidejhi ve šefi‘an mudžāben. Allāhumme ṯeqqil bihī mevāzīnehumā ve e‘ẓim bihī udžūrehumā ve elḥiqhu bi ṣāliḥi-l-mu’minīne ve-dž‘alhu fī kefāleti Ibrāhīme ve qihī bi Raḥmetike ‘aḏābe-l-džehīm.',
      en: "Allāhumma ‘j`alhu faraṭan wa dhukhran liwālidayh, wa shafī`an mujāban. Allāhumma thaqqil bihi mawāzīnahumā wa a`ẓim bihi ujūrahumā, wa alḥiqhu biṣāliḥi ‘l-mu'minīn, waj`alhu fī kafālati Ibrāhīm, wa qihi biraḥmatika `adhāba ‘l-jaḥīm.",
    },
    translation: {
      bs: 'Allahu, učini ovo maloljetno dijete predvodnikom i zalihom njegovim roditeljima i zagovornikom čijem će zagovaranju biti udovoljeno. Allahu, učini da, s njegovim zagovaranjem, dobra djela njegovih roditelja budu teža na vrijednosti te povećaj nagradu njegovim roditeljima radi njega. Sjedini ga s dobrim vjernicima i učini da bude u okrilju Ibrahima, a.s. Svojom milošću ga zaštiti od (džehenemske) vatre.',
      en: 'O Allah, make him a precursor, a forerunner and a treasure for his parents and an answered intercessor. O Allah, make him weigh heavily in their scales (of good) and magnify their reward. Make him join the righteous of the believers. Place him in the care of Ibrahim. Save him by Your mercy from the torment of Hell.',
    },
    reference: { bs: 'Hisnul-Muslimi, 150', en: 'Hisn al-Muslim, 160' },
    sourceUrl: 'https://sunnah.com/hisn:160',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=58',
  },
  {
    id: 'hisn-155',
    title: {
      bs: 'Dova pri sklapanju očiju umrlom',
      en: 'When closing the eyes of the deceased',
    },
    arabic:
      'اللَّهُمَّ اغْفِرْ لِفُلَانٍ وَارْفَعْ دَرَجَتَهُ فِي الْمَهْدِيِّينَ، وَاخْلُفْهُ فِي عَقِبِهِ فِي الْغَابِرِينَ، وَاغْفِرْ لَنَا وَلَهُ يَا رَبَّ الْعَالَمِينَ، وَافْسَحْ لَهُ فِي قَبْرِهِ وَنَوِّرْ لَهُ فِيهِ',
    transcription: {
      bs: 'Allāhumma-gfir li ..(spomenuti ime umrlog) ve-rfa‘ deredžetehū fī-l-mehdijjīne vaẖlufhu fī ‘aqibihī fī-l-gābirīne va-gfir lenā ve lehū, jā Rabbe-l-‘ālemīne, vefsaḥ lehū fī qabrihī ve nevvīr lehū fīhī.',
      en: 'Allāhumma’ghfir li (name of the person) warfa` darajatahu fi ‘l-mahdiyyīn, wakhlufhu fī `aqibihi fi ‘l-ghābirīn, wagh’fir-lanā wa lahu yā Rabba ‘l-`ālamīn, wafsaḥ lahu fī qabrihi wa nawwir lahu fīh.',
    },
    translation: {
      bs: 'Allahu, oprosti (tome i tome, po imenu), uzdigni njegovo mjesto među onima koji su zaradili Tvoju uputu (Džennet) i odredi mu nasljednika među onima koji ostaju (od njegovih potomaka). Oprosti nama i njemu, Gospodaru svjetova. Kabur mu učini širokim prostorom i udobnim i osvijetli mu ga.',
      en: 'O Allah, forgive [name of the person] and elevate his station among those who are guided. Send him along the path of those who came before, and forgive us and him, O Lord of the worlds. Enlarge for him his grave, and shed light upon him in it.',
    },
    reference: { bs: 'Hisnul-Muslimi, 145', en: 'Hisn al-Muslim, 155' },
    sourceUrl: 'https://sunnah.com/hisn:155',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=56',
  },
  {
    id: 'hisn-163',
    title: {
      bs: 'Dova prilikom spuštanja umrlog u kabur',
      en: 'When placing the deceased in the grave',
    },
    arabic: 'بِسْمِ اللَّهِ وَعَلَى سُنَّةِ رَسُولِ اللَّهِ',
    transcription: {
      bs: 'Bismillāhi ve ‘alā sunneti Resulillāhi.',
      en: 'Bismillāh wa `alā sunnati Rasūlillāh.',
    },
    translation: {
      bs: 'S Allahovim imenom i po sunnetu Allahova Poslanika (postupamo).',
      en: 'With the Name of Allah, and according to the Sunnah of the Messenger of Allah.',
    },
    reference: { bs: 'Hisnul-Muslimi, 154', en: 'Hisn al-Muslim, 163' },
    sourceUrl: 'https://sunnah.com/hisn:163',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=60',
  },
  {
    id: 'hisn-165',
    title: { bs: 'Dova prilikom posjete mezaristanima', en: 'Visiting the graves' },
    arabic:
      'السَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ، وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لَاحِقُونَ، [وَيَرْحَمُ اللَّهُ الْمُسْتَقْدِمِينَ مِنَّا وَالْمُسْتَأْخِرِينَ] نَسْأَلُ اللَّهَ لَنَا وَلَكُمُ الْعَافِيَةَ',
    // The photographed edition includes the mercy clause in Arabic/transcription but omits it in its Bosnian meaning.
    transcription: {
      bs: 'Es-selāmu ‘alejkum ehle-l-dijāri mine-l-mu’minīne ve-l-muslimīne ve innā, in šā’ Allāhu bikum lāḥiqune. Ve jerḥamullāhu el-mustaqdimīne minnā vel-muste’ḫirīne. Nes’elullāhe lenā ve lekumu-l-‘āfije.',
      en: "Assalāmu `alaykum ahlad-diyāri minal-mu'minīna wa ‘l-muslimīn, wa innā in shā' Allāhu bikum lāḥiqūn nas'alullāha lanā wa lakumul-`āfiyah.",
    },
    translation: {
      bs: 'Selam vama, stanovnici smrtničkih domova vjernika muslimana. Mi ćemo se, ako Allah da, priključiti vama. Allaha molimo da nama i vama oprost Svoj dadne.',
      en: 'Peace be upon you, people of this abode, from among the believers and those who are Muslims, and we, by the Will of Allah, shall be joining you. [May Allah have mercy on the first of us and the last of us] I ask Allah to grant us and you well-being.',
    },
    reference: { bs: 'Hisnul-Muslimi, 156', en: 'Hisn al-Muslim, 165' },
    sourceUrl: 'https://sunnah.com/hisn:165',
    bosnianSourceUrl:
      'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=60',
  },
];
