import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const loaded = new Map();

// Compile the checked-in data files with the same TypeScript compiler as the web app.
function loadData(path) {
  const filename = resolve(root, path);
  if (loaded.has(filename)) return loaded.get(filename).exports;
  const module = { exports: {} };
  loaded.set(filename, module);
  const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const loadNearby = (name) => loadData(resolve(dirname(filename), `${name}.ts`));
  new Function('module', 'exports', 'require', outputText)(module, module.exports, loadNearby);
  return module.exports;
}

const { DUA_CATEGORIES } = loadData('src/app/features/duas/duas.data.ts');
const { BS_LABELS } = loadData('src/app/core/i18n/bs.ts');
const { EN_LABELS } = loadData('src/app/core/i18n/en.ts');
const labels = (copy) => Object.fromEntries(Object.entries(copy).filter(([key]) =>
  key.startsWith('duas') || key === 'showMore' || key === 'qiblaBackToTimes',
));

const categories = DUA_CATEGORIES.map(({ id, label, items }) => ({
  id,
  label,
  items: items.map(({
    id, title, sayings, arabic, instructions, transcription, translation,
    reference, sourceUrl, bosnianSourceUrl,
  }) => ({
    id,
    title,
    sayings: sayings ?? [{ arabic, instructions, transcription, translation }],
    source: sourceUrl ? { reference, sourceUrl, bosnianSourceUrl } : undefined,
  })),
}));
const categoryOrder = Object.fromEntries(['bs', 'en'].map((lang) => [
  lang,
  [...categories].sort((a, b) =>
    Number(b.id === 'general') - Number(a.id === 'general') ||
    a.label[lang].localeCompare(b.label[lang], lang),
  ).map(({ id }) => id),
]));

const folder = resolve(root, 'vaktija_mobile/assets/duas');
mkdirSync(folder, { recursive: true });
writeFileSync(resolve(folder, 'catalog.json'), JSON.stringify({
  categories, categoryOrder, labels: { bs: labels(BS_LABELS), en: labels(EN_LABELS) },
}) + '\n');
