import type { Dua } from './duas.data';

const QUOTES = /['‘’`ʿʾ]/g;
// Preserve the two ambiguous consonants and the Bosnian dž digraph until matching.
const DH = '\uE000';
const TH = '\uE001';
const DZ = '\uE002';

function words(text: string): string {
  return text
    .normalize('NFC')
    .toLowerCase()
    .replace(QUOTES, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

export function normalizeDuaQuery(text: string): string {
  return words(text.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/gi, 'dj'));
}

function transcriptionKey(text: string): string {
  const aliases: Record<string, string> = {
    'ḏ': DH, dh: DH, 'ṯ': TH, th: TH, 'dž': DZ, dz: DZ,
    'ḫ': 'h', kh: 'h', gh: 'g', 'š': 's', sh: 's', q: 'k', w: 'v',
  };
  return text
    .normalize('NFC')
    .toLowerCase()
    .replace(/ḏ|dh|ṯ|th|dž|dz|ḫ|kh|gh|š|sh|q|w/g, (letter) => aliases[letter])
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/đ/g, 'dj')
    .replace(QUOTES, '')
    .replace(/a{2,}|i{2,}|u{2,}|e{2,}|o{2,}/g, (vowels) =>
      vowels[0] === 'e' ? 'i' : vowels[0] === 'o' ? 'u' : vowels[0],
    )
    .replace(/[\p{Pd}\u2212]/gu, '')
    .replace(/[^\p{L}\p{N}\uE000-\uE002]+/gu, ' ')
    .replace(/([bcdfghjklmnpqrstvwxyz\uE000-\uE002])\1+/g, '$1')
    .trim();
}

function transcriptionPattern(key: string): RegExp {
  const alternatives: Record<string, string> = {
    [DH]: `[dz${DH}]`, d: `[d${DH}]`, z: `[z${DH}]`,
    [TH]: `[ts${TH}]`, t: `[t${TH}]`, s: `[s${TH}]`,
  };
  return new RegExp(
    [...key].map((letter) => alternatives[letter] ?? letter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join(''),
    'u',
  );
}

export function createDuaSearch(items: readonly Dua[]): (scope: readonly Dua[], query: string) => readonly Dua[] {
  const index = new Map(items.map((dua) => {
    const sayings = dua.sayings ?? [dua];
    const titles = Object.values(dua.title).map(normalizeDuaQuery);
    const transcriptions = sayings.flatMap((saying) => Object.values(saying.transcription!));
    return [dua.id, {
      titles,
      ordinary: [
        ...titles,
        ...sayings.flatMap((saying) => Object.values(saying.translation!).map(normalizeDuaQuery)),
        ...transcriptions.map(normalizeDuaQuery),
      ],
      transcription: transcriptions.flatMap((text) => {
        const key = transcriptionKey(text);
        return [key, key.replace(/ /g, '')];
      }),
    }] as const;
  }));

  return (scope, query) => {
    const normalized = normalizeDuaQuery(query);
    if (!normalized) return scope;
    const terms = words(query).split(' ').map((term) => {
      const ordinary = normalizeDuaQuery(term);
      return {
        ordinary,
        relaxed: ordinary.length >= 3 ? transcriptionPattern(transcriptionKey(term)) : undefined,
      };
    });
    const phrase = normalized.replace(/ /g, '').length >= 3
      ? transcriptionPattern(transcriptionKey(query).replace(/ /g, ''))
      : undefined;
    const tiers: Dua[][] = [[], [], []];
    for (const dua of scope) {
      const entry = index.get(dua.id);
      if (!entry) continue;
      if (entry.titles.some((title) => title.includes(normalized))) {
        tiers[0].push(dua);
        continue;
      }
      const ordinary = terms.map((term) => entry.ordinary.some((field) => field.includes(term.ordinary)));
      if (ordinary.every(Boolean)) tiers[1].push(dua);
      else if (
        terms.every((term, i) => ordinary[i] || term.relaxed && entry.transcription.some((field) => term.relaxed!.test(field))) ||
        phrase && entry.transcription.some((field) => phrase.test(field.replace(/ /g, '')))
      ) tiers[2].push(dua);
    }
    return tiers.flat();
  };
}
