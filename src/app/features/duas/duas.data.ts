import { LangCode } from '../../core/services/language.service';
import { ABLUTION_DUAS } from './ablution.data';
import { ADHAN_DUAS } from './adhan.data';
import { MARRIAGE_DUAS } from './marriage.data';
import { TOILET_DUAS } from './toilet.data';

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
  { id: 'marriage', label: { bs: 'Brak', en: 'Marriage' }, items: MARRIAGE_DUAS },
] as const;

export const DUAS: readonly Dua[] = DUA_CATEGORIES.flatMap((category) => category.items);
