import type { Dua } from './duas.data';

// Published meanings: Islamic Encyclopedia (Bosnian) and Deenhub (English).
// The buying dua is Hisn 191, kept separate from the groom's card in Brak.
// Bosnian transcription adapts the published recitation with the photographed letter key.
export const ANIMAL_DUAS: readonly Dua[] = [
  {
    id: 'hisn-191-animal',
    title: { bs: 'Dova kad kupimo neku životinju', en: 'When buying an animal' },
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا، وَخَيْرَ مَا جَبَلْتَهَا عَلَيْهِ، وَأَعُوذُ بِكَ مِنْ شَرِّهَا، وَشَرِّ مَا جَبَلْتَهَا عَلَيْهِ',
    transcription: {
      bs: 'Allāhumme innī es’eluke ḫajrehā ve ḫajre mā džebeltehā ‘alejhi ve e‘ūḏu bike min šerrihā ve šerri mā džebeltehā ‘alejhi.',
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
    id: 'hisn-228',
    title: { bs: 'Dova kada čujemo pjevanje horoza', en: 'Upon hearing a rooster crow' },
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    transcription: {
      bs: 'Allāhumme innī es’eluke min faḍlike.',
      en: "Allahumma innee as'aluka min fadlik",
    },
    translation: {
      bs: 'Allahu moj, podari mi svako dobro od Tebe.',
      en: 'O Allah, I ask You from Your bounty.',
    },
    reference: { bs: 'Hisnul-Muslimi, 213', en: 'Hisn al-Muslim, 228 (rooster)' },
    sourceUrl: 'https://www.deenhub.ca/duas',
    bosnianSourceUrl: 'https://islamenc.com/bs/books/24',
  },

  {
    id: 'hisn-229',
    title: { bs: 'Dova kada noću čujemo zavijanje pasa ili revanje magaraca', en: 'Upon hearing dogs bark or donkeys bray at night' },
    arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    transcription: {
      bs: 'E‘ūḏu billāhi mineš-šejṭāni-r-radžīm.',
      en: "A'oodhu billahi minash-shaytanir-rajeem",
    },
    translation: {
      bs: 'Utječem se Allahu od prokletog šejtana.',
      en: 'I seek refuge in Allah from the accursed Satan.',
    },
    reference: { bs: 'Hisnul-Muslimi, 214', en: 'Hisn al-Muslim, 229' },
    sourceUrl: 'https://www.deenhub.ca/duas',
    bosnianSourceUrl: 'https://islamenc.com/bs/books/24',
  },
];
