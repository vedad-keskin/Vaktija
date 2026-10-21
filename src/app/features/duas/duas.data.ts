import { LangCode } from '../../core/services/language.service';
import { ABLUTION_DUAS } from './ablution.data';
import { ADHAN_DUAS } from './adhan.data';
import { ANIMAL_DUAS } from './animals.data';
import { CLOTHING_DUAS } from './clothing.data';
import { FOOD_DUAS } from './food.data';
import { GATHERING_DUAS } from './gathering.data';
import { MARRIAGE_DUAS } from './marriage.data';
import { TOILET_DUAS } from './toilet.data';
import { WEATHER_DUAS } from './weather.data';

export type Dua = {
  id: string;
  title: Record<LangCode, string>;
  arabic: string;
  transcription: Record<LangCode, string>;
  translation: Record<LangCode, string>;
  reference: Record<LangCode, string>;
  sourceUrl: string;
  bosnianSourceUrl?: string;
};

// Add each new category here; All is the combined list of its category files.
export const DUA_CATEGORIES = [
  { id: 'toilet', label: { bs: 'Toalet', en: 'Toilet' }, items: TOILET_DUAS },
  { id: 'ablution', label: { bs: 'Abdest', en: 'Ablution' }, items: ABLUTION_DUAS },
  { id: 'adhan', label: { bs: 'Ezan', en: 'Adhan' }, items: ADHAN_DUAS },
  { id: 'fasting', label: { bs: 'Post i hrana', en: 'Fasting and food' }, items: FOOD_DUAS },
  { id: 'marriage', label: { bs: 'Brak', en: 'Marriage' }, items: MARRIAGE_DUAS },
  { id: 'clothing', label: { bs: 'Odjeća', en: 'Clothing' }, items: CLOTHING_DUAS },
  { id: 'gathering', label: { bs: 'Sijelo', en: 'Gathering' }, items: GATHERING_DUAS },
  { id: 'animals', label: { bs: 'Životinje', en: 'Animals' }, items: ANIMAL_DUAS },
  { id: 'weather', label: { bs: 'Vrijeme', en: 'Weather' }, items: WEATHER_DUAS },
] as const;

export const DUAS: readonly Dua[] = DUA_CATEGORIES.flatMap((category) => category.items);
