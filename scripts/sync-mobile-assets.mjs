import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import ts from 'typescript';

const web = 'public/assets';
const mobile = 'vaktija_mobile/assets';
const core = 'src/app/core';

async function loadExports(path) {
  const source = await readFile(path, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}

const [{ BOSNIA_PRESET_CITIES }, { BS_LABELS }, { EN_LABELS }] = await Promise.all([
  loadExports(`${core}/constants/bosnia-preset-cities.constants.ts`),
  loadExports(`${core}/i18n/bs.ts`),
  loadExports(`${core}/i18n/en.ts`),
]);

const keys = [
  'themeDay', 'themeNight', 'methodGroupLabel', 'method146Label', 'methodIzLabel',
  'method146Tooltip', 'methodIzTooltip', 'method146HelpAria', 'methodIzHelpAria',
  'methodIntroTitle', 'methodIntroDescription', 'methodIntroConfirm', 'methodIntroLater',
  'method146Summary', 'methodIzSummary', 'countdownHours', 'countdownMinutes',
  'countdownSeconds', 'countdownProgressAria', 'expandCountdown', 'collapseCountdown',
  'nextTime', 'nextBadge', 'currentBadge', 'selectCity', 'searchCity', 'noCities',
  'dhuhrFridayName', 'loading', 'loadingSubtitle', 'errorTitle', 'errorHint',
  'errorGeneric', 'retryAction', 'prayerNames', 'dayNames', 'monthNames',
  'duasTitle', 'dhikrTitle', 'qiblaNavTitle',
];

function prayerLabels(labels) {
  return Object.fromEntries(keys.map((key) => {
    if (!(key in labels)) throw new Error(`Missing label ${key}`);
    return [key, labels[key]];
  }));
}

await mkdir(join(mobile, 'prayer_times'), { recursive: true });
await writeFile(join(mobile, 'prayer_times/catalog.json'), JSON.stringify({
  cities: BOSNIA_PRESET_CITIES,
  labels: { bs: prayerLabels(BS_LABELS), en: prayerLabels(EN_LABELS) },
  timetable: JSON.parse(await readFile(`${core}/data/iz-vaktija.json`, 'utf8')),
}) + '\n');

const assets = [
  'icons/bih.png', 'icons/uk.png', 'icons/day.png', 'icons/night.png',
  'icons/iz-logo.png', 'icons/14-6-prayer-method-icon.webp',
  'ornaments/dua-crescent-rosette.webp',
  'ornaments/mosque-horizon-dark.webp', 'ornaments/mosque-horizon-light.webp',
  'ornaments/mosque-horizon-mobile-dark.webp', 'ornaments/mosque-horizon-mobile-light.webp',
];

const header = await readFile('src/app/features/prayer-times/components/header/header.component.html', 'utf8');
const links = header.split('<!-- Mobile dropdown: pages + method -->')[1];
const menuIcons = [...links.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].slice(0, 3);

await Promise.all([
  copyFile(join(web, 'icons/logo.png'), join(mobile, 'branding/logo.png')),
  ...assets.map((path) => copyFile(join(web, path), join(mobile, 'prayer_times', path.split('/').at(-1)))),
  ...['duas', 'dhikr', 'qibla'].map(async (name, index) => {
    const svg = menuIcons[index][0].replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    await sharp(Buffer.from(svg), { density: 216 }).png()
      .toFile(join(mobile, `prayer_times/menu-${name}.png`));
  }),
  ...['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha', 'midnight', 'lastthird'].map(async (name) => {
    const svg = await readFile(join(web, `illustrations/${name}.svg`), 'utf8');
    // Match the web's small-icon media rule. Rasterize once for offline mobile use.
    const compact = svg.replace(/<style>[^<]*<\/style>/, '<style>.detail{display:none}.rim{stroke-width:2}</style>');
    await sharp(Buffer.from(compact), { density: 144 })
      .resize({ width: 156 }).png().toFile(join(mobile, `prayer_times/${name}.png`));
  }),
]);
