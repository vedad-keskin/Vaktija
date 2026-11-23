import { LangCode } from '../../core/services/language.service';
import { Dua } from './duas.data';

type CopySource = {
  reference: Record<LangCode, string>;
  sourceUrl: string;
  bosnianSourceUrl?: string;
};

type CopySaying = {
  arabic: string;
  instructions?: Record<LangCode, string>;
  transcription: Record<LangCode, string>;
  translation: Record<LangCode, string>;
  sources?: readonly CopySource[];
};

const join = (parts: (string | undefined)[]) => parts.filter((part) => !!part).join('\n\n');

export function sourceCopyText(source: CopySource, lang: LangCode): string {
  const url = lang === 'bs' ? (source.bosnianSourceUrl ?? source.sourceUrl) : source.sourceUrl;
  return `${source.reference[lang]}\n${url}`;
}

function sayingCopy(saying: CopySaying, lang: LangCode): string {
  return join([
    saying.arabic,
    saying.instructions?.[lang],
    saying.transcription[lang],
    saying.translation[lang],
    ...(saying.sources ?? []).map((source) => sourceCopyText(source, lang)),
  ]);
}

export function entryCopyText(dua: Dua, lang: LangCode): string {
  const sayings: readonly CopySaying[] = dua.sayings
    ? dua.sayings
    : [
        {
          arabic: dua.arabic,
          instructions: dua.instructions,
          transcription: dua.transcription,
          translation: dua.translation,
        },
      ];
  return join([
    dua.title[lang],
    ...sayings.map((saying) => sayingCopy(saying, lang)),
    dua.sourceUrl ? sourceCopyText(dua, lang) : undefined,
  ]);
}
