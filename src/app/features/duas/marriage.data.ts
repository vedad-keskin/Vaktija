import type { Dua } from './duas.data';

// Bosnian meanings: IslamHouse Hisnul-Muslimi, entries 178–180.
// English and Arabic: Sunnah.com Hisn al-Muslim, entries 190–192.
// Bosnian transcription uses the photographed 2017 letter key (see README-full).
// Entry 180's basmala follows that print; the rest adapts the Bosnian recitation.
export const MARRIAGE_DUAS: readonly Dua[] = [
  {
    id: 'hisn-192',
    title: { bs: 'Dova prije spolnog odnosa u braku', en: 'Before sexual intercourse with the wife' },
    arabic: 'بِسْمِ الله اللّهُـمَّ جَنِّبْنا الشَّيْـطانَ، وَجَنِّبِ الشَّـيْطانَ ما رَزَقْـتَنا',
    transcription: {
      bs: 'Bismillāh. Allāhumme džennibne-š-šejṭāne ve džennibi-š-šejṭāne mā rezaqtenā.',
      en: 'Bismillāh. Allāhumma jannibnash-Shayṭān, wa jannibish-Shayṭāna mā razaqtanā.',
    },
    translation: {
      bs: 'Allahu, skloni nas od šejtana i skloni šejtana od onoga čime si nas opskrbio.',
      en: 'With the Name of Allah. O Allah, keep the Devil away from us, and keep the Devil away from that which You provide for us.',
    },
    reference: { bs: 'Hisnul-Muslimi, 180', en: 'Hisn al-Muslim, 192' },
    sourceUrl: 'https://sunnah.com/hisn:192',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=68',
  },
  {
    id: 'hisn-191',
    title: {
      bs: 'Dova koju mladoženja uči sebi',
      en: 'On the wedding night or when buying an animal',
    },
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا، وَخَيْرَ مَا جَبَلْتَهَا عَلَيْهِ، وَأَعُوذُ بِكَ مِنْ شَرِّهَا، وَشَرِّ مَا جَبَلْتَهَا عَلَيْهِ',
    transcription: {
      bs: 'Allāhumme innī es’eluke ẖajrehā ve ẖajre mā džebeltehā ‘alejhi ve e‘ūḏu bike min šerrihā ve šerri mā džebeltehā ‘alejhi.',
      en: "Allāhumma innī as'aluka khayrahā wa khayra mā jabaltahā `alayh, wa a`ūdhu bika min sharrihā wa sharri mā jabaltahā `alayh.",
    },
    translation: {
      bs: 'Allahu, molim Te da mi u njoj (ili njemu) podariš dobro i da ono čemu je ona (ili on) po naravi sklon(a), bude dobro. I utičem Ti se od njenoga (njegovoga) zla i zla onoga čemu je po prirodi sklon(a).',
      en: 'O Allah, I ask You for the goodness of her, and the goodness upon which You have created her, and I seek refuge in You from the evil of her, and from the evil upon which You have created her.',
    },
    reference: { bs: 'Hisnul-Muslimi, 179', en: 'Hisn al-Muslim, 191' },
    sourceUrl: 'https://sunnah.com/hisn:191',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=68',
  },
  {
    id: 'hisn-190',
    title: { bs: 'Dova oženjenom-udatoj', en: 'To the newlywed' },
    arabic: 'بارَكَ اللّهُ لَك، وَبارَكَ عَلَـيْك، وَجَمَعَ بَيْـنَكُما في خَـيْر',
    transcription: {
      bs: 'Bārekallāhu leke ve bāreke ‘alejke ve džeme‘a bejnekumā fī ẖajrin.',
      en: 'Bārakallāhu lak, wa bāraka `alayk, wa jama`a baynakumā fī khayr.',
    },
    translation: {
      bs: 'Allah te blagoslovio i svakom te blagodati obasuo. Allah vas sjedinio u dobru.',
      en: 'May Allah bless you, and shower His blessings upon you, and join you together in goodness.',
    },
    reference: { bs: 'Hisnul-Muslimi, 178', en: 'Hisn al-Muslim, 190' },
    sourceUrl: 'https://sunnah.com/hisn:190',
    bosnianSourceUrl: 'https://d1.islamhouse.com/data/bs/ih_books/single1/bs_Hisnul_muslim.pdf#page=67',
  },
];
