import type { Dua } from './duas.data';

// Bosnian: reader's Hisnul-Muslimi photographs, pages 50–53; HM-70 meanings adapted from Korkut.
// English and Arabic: Hisn al-Muslim 66–67, 69–70.
export const AFTER_PRAYER_DUAS: readonly Dua[] = [
  {
    id: 'hisn-66',
    title: {
      bs: 'Dove poslije namaza',
      en: 'Dua after prayer',
    },
    sayings: [
      {
        arabic: 'أَسْتَغْفِرُ اللَّهَ',
        instructions: {
          bs: 'Nakon predaje selama prouči tri puta.',
          en: 'After the salam, recite three times.',
        },
        transcription: { bs: 'Estagfirullāhe.', en: 'Astaghfirullāh.' },
        translation: { bs: 'Allaha za oprost molim.', en: 'I seek the forgiveness of Allah.' },
        sources: [
          {
            reference: { bs: 'Hisnul-Muslimi, 66', en: 'Hisn al-Muslim, 66' },
            sourceUrl: 'https://sunnah.com/hisn:66',
            bosnianSourceUrl:
              'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=29',
          },
        ],
      },
      {
        arabic:
          'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
        transcription: {
          bs: 'Allāhumme Ente-s-Selāmu ve minke-s-Selāmu, tebārekte jā ḏe-l-dželāli ve-l-ikrām.',
          en: "Allāhumma antas-salām, wa minkas-salām, tabārakta yā dhal-Jalāli wal-'Ikrām.",
        },
        translation: {
          bs: 'Allahu, Ti si Es-Selam i od Tebe je selam, blagodaran si Ti, Koji posjeduješ veličinu i plemenitost.',
          en: 'O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of majesty and honor.',
        },
        sources: [
          {
            reference: { bs: 'Hisnul-Muslimi, 66', en: 'Hisn al-Muslim, 66' },
            sourceUrl: 'https://sunnah.com/hisn:66',
            bosnianSourceUrl:
              'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=29',
          },
        ],
      },
      {
        arabic:
          'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ. اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
        transcription: {
          bs: 'Lā ilāhe illellāhu vaḥdehu lā šerīke leh, lehu-l-mulku ve lehu-l-ḥamdu ve huve ‘alā kulli šej’in qadīr. Allāhumme lā māni‘a limā e‘ṭajte ve lā mu‘ṭije limā mena‘te, ve lā jenfe‘u ḏe-l-džeddi minke-l-džeddu.',
          en: 'Lā ilāha illallāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ‘alā kulli shay’in qadīr. Allāhumma lā māni‘a limā a‘ṭayta, wa lā mu‘ṭiya limā mana‘ta, wa lā yanfa‘u dhal-jaddi minkal-jadd.',
        },
        translation: {
          bs: 'Nema boga osim Allaha, Jedinoga, Koji druga nema. Njemu pripada sva vlast i On nad svakom stvari ima moć. Allahu, niko ne može spriječiti ono što si Ti dao, a niti dati ono što Ti ne daješ. Nikome ko posjeduje moć (bogatstvo, porijeklo) neće protiv Tebe koristiti njegova moć.',
          en: 'None has the right to be worshipped but Allah alone. He has no partner. His is the dominion and His is the praise, and He is Able to do all things. O Allah, there is none who can withhold what You give, and none may give what You have withheld, and the might of the mighty person cannot benefit him against You.',
        },
        sources: [
          {
            reference: { bs: 'Hisnul-Muslimi, 67', en: 'Hisn al-Muslim, 67' },
            sourceUrl: 'https://sunnah.com/hisn:67',
            bosnianSourceUrl:
              'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=29',
          },
        ],
      },
      {
        arabic: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَاللَّهُ أَكْبَرُ',
        instructions: {
          bs: 'Svaka se ponavlja 33 puta.',
          en: 'Each is recited 33 times.',
        },
        transcription: {
          bs: 'Subḥānallāhi. Ve-l-ḥamdu lillāhi. Vallāhu ekber.',
          en: 'Subḥānallāh. Wal-ḥamdu lillāh. Wallāhu akbar.',
        },
        translation: {
          bs: 'Slava Allahu. Svaka Mu hvala. Allah je najveći.',
          en: 'Glory is to Allah. Praise is to Allah. Allah is the Most Great.',
        },
        sources: [
          {
            reference: { bs: 'Hisnul-Muslimi, 69', en: 'Hisn al-Muslim, 69' },
            sourceUrl: 'https://sunnah.com/hisn:69',
            bosnianSourceUrl:
              'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=30',
          },
        ],
      },
      {
        arabic:
          'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ هُوَ اللَّهُ أَحَدٌ. اللَّهُ الصَّمَدُ. لَمْ يَلِدْ وَلَمْ يُولَدْ. وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
        instructions: {
          bs: 'El-Ihlas: prouči jednom poslije podnevskog, ikindijskog i jacijskog namaza, a tri puta poslije sabahskog i akšamskog namaza.',
          en: 'Al-Ikhlas: recite once after Dhuhr, Asr and Isha, and three times after Fajr and Maghrib.',
        },
        transcription: {
          bs: 'Bismillāhi-r-Raḥmāni-r-Raḥīm. Qul huvallāhu eḥad. Allāhu-ṣ-Ṣamed. Lem jelid ve lem jūled. Ve lem jekun lehu kufuven eḥad.',
          en: 'Bismillāhir-Raḥmānir-Raḥīm. Qul huwallāhu aḥad. Allāhuṣ-ṣamad. Lam yalid wa lam yūlad. Wa lam yakun lahu kufuwan aḥad.',
        },
        translation: {
          bs: 'U ime Allaha, Milostivog, Samilosnog. Reci: On je Allah, Jedini. Allah je utočište svakom. Nije rodio niti je rođen, i niko Mu nije ravan.',
          en: 'In the name of Allah, the Most Merciful, the Most Compassionate. Say: He is Allah, the One. Allah is the One upon whom all depend. He neither begets nor was born, and none is equal to Him.',
        },
        sources: [
          {
            reference: { bs: 'Hisnul-Muslimi, 70', en: 'Hisn al-Muslim, 70' },
            sourceUrl: 'https://sunnah.com/hisn:70',
            bosnianSourceUrl:
              'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=30',
          },
          {
            reference: { bs: 'Kur’an, 112', en: 'Quran, 112' },
            sourceUrl: 'https://quran.com/112',
            bosnianSourceUrl: 'https://quranenc.com/bs/browse/bosnian_korkut/112',
          },
        ],
      },
      {
        arabic:
          'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ. مِنْ شَرِّ مَا خَلَقَ. وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ. وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ. وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        instructions: {
          bs: 'El-Felek: prouči jednom poslije podnevskog, ikindijskog i jacijskog namaza, a tri puta poslije sabahskog i akšamskog namaza.',
          en: 'Al-Falaq: recite once after Dhuhr, Asr and Isha, and three times after Fajr and Maghrib.',
        },
        transcription: {
          bs: 'Bismillāhi-r-Raḥmāni-r-Raḥīm. Qul e‘ūḏu bi Rabbi-l-feleq. Min šerri mā ḫaleq. Ve min šerri gāsiqin iḏā veqab. Ve min šerri-n-neffāṯāti fī-l-‘uqad. Ve min šerri ḥāsidin iḏā ḥased.',
          en: 'Bismillāhir-Raḥmānir-Raḥīm. Qul a‘ūdhu birabbil-falaq. Min sharri mā khalaq. Wa min sharri ghāsiqin idhā waqab. Wa min sharrin-naffāthāti fil-‘uqad. Wa min sharri ḥāsidin idhā ḥasad.',
        },
        translation: {
          bs: 'U ime Allaha, Milostivog, Samilosnog. Reci: Tražim zaštitu Gospodara svitanja od zla onoga što je stvorio, od zla noći kada se spusti, od zla onih koji pušu u čvorove i od zla zavidnika kada zavidi.',
          en: 'In the name of Allah, the Most Merciful, the Most Compassionate. Say: I seek refuge in the Lord of daybreak from the evil of what He created, from the evil of darkness as it settles, from the evil of those who blow on knots, and from the evil of an envier when he envies.',
        },
        sources: [
          {
            reference: { bs: 'Hisnul-Muslimi, 70', en: 'Hisn al-Muslim, 70' },
            sourceUrl: 'https://sunnah.com/hisn:70',
            bosnianSourceUrl:
              'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=30',
          },
          {
            reference: { bs: 'Kur’an, 113', en: 'Quran, 113' },
            sourceUrl: 'https://quran.com/113',
            bosnianSourceUrl: 'https://quranenc.com/bs/browse/bosnian_korkut/113',
          },
        ],
      },
      {
        arabic:
          'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ النَّاسِ. مَلِكِ النَّاسِ. إِلَٰهِ النَّاسِ. مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ. الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ. مِنَ الْجِنَّةِ وَالنَّاسِ',
        instructions: {
          bs: 'En-Nas: prouči jednom poslije podnevskog, ikindijskog i jacijskog namaza, a tri puta poslije sabahskog i akšamskog namaza.',
          en: 'An-Nas: recite once after Dhuhr, Asr and Isha, and three times after Fajr and Maghrib.',
        },
        transcription: {
          bs: 'Bismillāhi-r-Raḥmāni-r-Raḥīm. Qul e‘ūḏu bi Rabbi-n-nās. Meliki-n-nās. Ilāhi-n-nās. Min šerri-l-vesvāsi-l-ḫannās. Elleḏī juvesvisu fī ṣudūri-n-nās. Mine-l-džinneti ve-n-nās.',
          en: 'Bismillāhir-Raḥmānir-Raḥīm. Qul a‘ūdhu birabbin-nās. Malikin-nās. Ilāhin-nās. Min sharril-waswāsil-khannās. Alladhī yuwaswisu fī ṣudūrin-nās. Minal-jinnati wan-nās.',
        },
        translation: {
          bs: 'U ime Allaha, Milostivog, Samilosnog. Reci: Tražim zaštitu Gospodara ljudi, Vladara ljudi, Boga ljudi, od zla šejtana koji se prikrada i povlači, koji unosi zle misli u srca ljudi, bio on od džina ili od ljudi.',
          en: 'In the name of Allah, the Most Merciful, the Most Compassionate. Say: I seek refuge in the Lord of mankind, the King of mankind, the God of mankind, from the evil of the whisperer who withdraws, who whispers into the hearts of mankind, from among jinn and people.',
        },
        sources: [
          {
            reference: { bs: 'Hisnul-Muslimi, 70', en: 'Hisn al-Muslim, 70' },
            sourceUrl: 'https://sunnah.com/hisn:70',
            bosnianSourceUrl:
              'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=30',
          },
          {
            reference: { bs: 'Kur’an, 114', en: 'Quran, 114' },
            sourceUrl: 'https://quran.com/114',
            bosnianSourceUrl: 'https://quranenc.com/bs/browse/bosnian_korkut/114',
          },
        ],
      },
    ],
  },
];
