import { LangCode } from '../../core/services/language.service';
import { ABLUTION_DUAS } from './ablution.data';
import { ADHAN_DUAS } from './adhan.data';
import { ANIMAL_DUAS } from './animals.data';
import { CHILDREN_DUAS } from './children.data';
import { CLOTHING_DUAS } from './clothing.data';
import { DEATH_DUAS } from './death.data';
import { DEBT_DUAS } from './debt.data';
import { FOOD_DUAS } from './food.data';
import { GATHERING_DUAS } from './gathering.data';
import { GENERAL_DUAS } from './general.data';
import { HAJJ_DUAS } from './hajj.data';
import { HOME_DUAS } from './home.data';
import { ILLNESS_DUAS } from './illness.data';
import { KURBAN_DUAS } from './kurban.data';
import { MARRIAGE_DUAS } from './marriage.data';
import { MOSQUE_DUAS } from './mosque.data';
import { OPROST_DUAS } from './oprost.data';
import { PROTECTION_DUAS } from './protection.data';
import { SLEEP_DUAS } from './sleep.data';
import { TOILET_DUAS } from './toilet.data';
import { TRAVEL_DUAS } from './travel.data';
import { WEATHER_DUAS } from './weather.data';

type DuaSaying = {
  arabic: string;
  instructions: Record<LangCode, string>;
  transcription: Record<LangCode, string>;
  translation: Record<LangCode, string>;
};

export type Dua = {
  id: string;
  title: Record<LangCode, string>;
  reference: Record<LangCode, string>;
  sourceUrl: string;
  bosnianSourceUrl?: string;
} & (
  | {
      arabic: string;
      instructions?: Record<LangCode, string>;
      transcription: Record<LangCode, string>;
      translation: Record<LangCode, string>;
      sayings?: never;
    }
  | {
      sayings: readonly DuaSaying[];
      arabic?: never;
      instructions?: never;
      transcription?: never;
      translation?: never;
    }
);

// Add each new category here; All is the combined list of its category files.
export const DUA_CATEGORIES = [
  { id: 'toilet', label: { bs: 'Toalet', en: 'Toilet' }, items: TOILET_DUAS },
  { id: 'ablution', label: { bs: 'Abdest', en: 'Ablution' }, items: ABLUTION_DUAS },
  { id: 'mosque', label: { bs: 'Džamija', en: 'Mosque' }, items: MOSQUE_DUAS },
  { id: 'adhan', label: { bs: 'Ezan', en: 'Adhan' }, items: ADHAN_DUAS },
  { id: 'fasting', label: { bs: 'Post i hrana', en: 'Fasting and food' }, items: FOOD_DUAS },
  { id: 'sleep', label: { bs: 'Spavanje i snovi', en: 'Sleep and dreams' }, items: SLEEP_DUAS },
  { id: 'illness', label: { bs: 'Bolest i bol', en: 'Illness and pain' }, items: ILLNESS_DUAS },
  { id: 'death', label: { bs: 'Smrt', en: 'Death' }, items: DEATH_DUAS },
  { id: 'protection', label: { bs: 'Zaštita', en: 'Protection' }, items: PROTECTION_DUAS },
  { id: 'children', label: { bs: 'Djeca', en: 'Children' }, items: CHILDREN_DUAS },
  { id: 'debt', label: { bs: 'Dug', en: 'Debt' }, items: DEBT_DUAS },
  { id: 'marriage', label: { bs: 'Brak', en: 'Marriage' }, items: MARRIAGE_DUAS },
  { id: 'clothing', label: { bs: 'Odjeća', en: 'Clothing' }, items: CLOTHING_DUAS },
  { id: 'gathering', label: { bs: 'Sijelo', en: 'Gathering' }, items: GATHERING_DUAS },
  { id: 'animals', label: { bs: 'Životinje', en: 'Animals' }, items: ANIMAL_DUAS },
  {
    id: 'weather',
    label: { bs: 'Priroda i vrijeme', en: 'Nature and weather' },
    items: WEATHER_DUAS,
  },
  { id: 'home', label: { bs: 'Kuća', en: 'Home' }, items: HOME_DUAS },
  { id: 'travel', label: { bs: 'Putovanje', en: 'Travel' }, items: TRAVEL_DUAS },
  { id: 'hajj', label: { bs: 'Hadž i umra', en: 'Hajj and Umrah' }, items: HAJJ_DUAS },
  { id: 'kurban', label: { bs: 'Kurban', en: 'Qurbani' }, items: KURBAN_DUAS },
  { id: 'oprost', label: { bs: 'Oprost', en: 'Forgiveness' }, items: OPROST_DUAS },
  { id: 'general', label: { bs: 'Opće', en: 'General' }, items: GENERAL_DUAS },
] as const;

export const DUAS: readonly Dua[] = DUA_CATEGORIES.flatMap((category) => category.items);
