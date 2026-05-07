/*
 * Match vaktija.ba month data against Aladhan configurations.
 *
 * Usage examples:
 *   node scripts/match-vaktija-aladhan.mjs --year 2026 --month 5
 *   node scripts/match-vaktija-aladhan.mjs --year 2026 --month 5 --fast
 *   node scripts/match-vaktija-aladhan.mjs --year 2026 --month 5 --angleMin 14 --angleMax 19 --angleStep 0.1
 *
 * Output:
 *   - Console summary of top matches
 *   - JSON results file: scripts/vaktija-aladhan-match-results.json
 */

import { writeFileSync } from 'fs';

const VAKTIJA_BASE = 'https://api.vaktija.ba/vaktija/v1';
const ALADHAN_BASE = 'https://api.aladhan.com/v1/timings';
const TIMEZONE = 'Europe/Sarajevo';

const DEFAULTS = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  cityId: 77,
  lat: 43.8486,
  lng: 18.3564,
  angleMin: 14.0,
  angleMax: 19.0,
  angleStep: 0.1,
  topAngles: 5,
  fast: false,
  exhaustiveAngles: false,
  delayMs: 150,
  dayFallback: true,
  debug: false,
  dayConcurrency: 6,
};

const PRESET_METHODS = [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const SCHOOLS = [0, 1];
const MIDNIGHT_MODES = [0, 1];
const SHAFAQS = ['general', 'ahmer', 'abyad'];

function parseArgs(argv) {
  const args = { ...DEFAULTS };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const [key, rawValue] = a.includes('=') ? a.split('=') : [a, null];
    const value = rawValue ?? argv[i + 1];

    switch (key) {
      case '--year':
        args.year = Number(value);
        if (!rawValue) i++;
        break;
      case '--month':
        args.month = Number(value);
        if (!rawValue) i++;
        break;
      case '--cityId':
        args.cityId = Number(value);
        if (!rawValue) i++;
        break;
      case '--lat':
        args.lat = Number(value);
        if (!rawValue) i++;
        break;
      case '--lng':
        args.lng = Number(value);
        if (!rawValue) i++;
        break;
      case '--angleMin':
        args.angleMin = Number(value);
        if (!rawValue) i++;
        break;
      case '--angleMax':
        args.angleMax = Number(value);
        if (!rawValue) i++;
        break;
      case '--angleStep':
        args.angleStep = Number(value);
        if (!rawValue) i++;
        break;
      case '--topAngles':
        args.topAngles = Number(value);
        if (!rawValue) i++;
        break;
      case '--fast':
        args.fast = true;
        break;
      case '--exhaustiveAngles':
        args.exhaustiveAngles = true;
        break;
      case '--delayMs':
        args.delayMs = Number(value);
        if (!rawValue) i++;
        break;
      case '--dayFallback':
        args.dayFallback = true;
        break;
      case '--noDayFallback':
        args.dayFallback = false;
        break;
      case '--debug':
        args.debug = true;
        break;
      case '--dayConcurrency':
        args.dayConcurrency = Number(value);
        if (!rawValue) i++;
        break;
      default:
        break;
    }
  }
  return args;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url, retries = 4) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        await sleep(1500 * (i + 1));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === retries - 1) throw e;
      await sleep(1000 * (i + 1));
    }
  }
}

async function fetchJsonMaybe(url, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (res.status === 429) {
        await sleep(1200 * (i + 1));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === retries - 1) return null;
      await sleep(800 * (i + 1));
    }
  }
}

function timeToMinutes(t) {
  if (!t) return NaN;
  const clean = t.replace(/\s*\(.*\)/, '').trim();
  const [h, m] = clean.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(m) {
  const h = Math.floor(m / 60);
  const mm = Math.abs(m % 60).toString().padStart(2, '0');
  return `${h}:${mm}`;
}

function formatDateKey(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatAladhanDateKey(year, month, day) {
  return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
}

function normalizeVaktijaMonthData(raw, year, month) {
  // Accepts array of day entries or object keyed by day.
  const result = {};

  if (Array.isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const day = i + 1;
      const entry = raw[i];
      if (Array.isArray(entry) && entry.length >= 6) {
        result[formatDateKey(year, month, day)] = entry.slice(0, 6);
      } else if (entry && Array.isArray(entry.vakat)) {
        result[formatDateKey(year, month, day)] = entry.vakat.slice(0, 6);
      }
    }
    return result;
  }

  if (raw && typeof raw === 'object') {
    if (Array.isArray(raw.dani)) {
      const dayArray = raw.dani;
      for (let i = 0; i < dayArray.length; i++) {
        const day = i + 1;
        const entry = dayArray[i];
        if (Array.isArray(entry) && entry.length >= 6) {
          result[formatDateKey(year, month, day)] = entry.slice(0, 6);
        } else if (entry && Array.isArray(entry.vakat)) {
          result[formatDateKey(year, month, day)] = entry.vakat.slice(0, 6);
        }
      }
      return result;
    }

    for (const [key, value] of Object.entries(raw)) {
      const day = Number(key);
      if (!Number.isFinite(day)) continue;
      if (Array.isArray(value) && value.length >= 6) {
        result[formatDateKey(year, month, day)] = value.slice(0, 6);
      } else if (value && Array.isArray(value.vakat)) {
        result[formatDateKey(year, month, day)] = value.vakat.slice(0, 6);
      }
    }
  }

  return result;
}

async function fetchVaktijaMonthData(args) {
  const vaktijaUrl = `${VAKTIJA_BASE}/${args.cityId}/${args.year}/${args.month}`;
  console.log(`Fetching vaktija.ba month data: ${vaktijaUrl}`);
  const vaktijaRaw = await fetchJson(vaktijaUrl);
  if (args.debug) {
    const keys = vaktijaRaw && typeof vaktijaRaw === 'object' ? Object.keys(vaktijaRaw) : [];
    console.log(`vaktija raw type: ${Array.isArray(vaktijaRaw) ? 'array' : typeof vaktijaRaw}`);
    if (keys.length > 0) console.log(`vaktija raw keys: ${keys.slice(0, 10).join(', ')}`);
  }
  const vaktijaMonth = normalizeVaktijaMonthData(vaktijaRaw, args.year, args.month);
  if (Object.keys(vaktijaMonth).length > 0) return vaktijaMonth;

  if (!args.dayFallback) return vaktijaMonth;

  console.log('Month endpoint empty. Falling back to day-by-day fetch...');
  const daysInMonth = new Date(args.year, args.month, 0).getDate();
  const fallback = {};
  const concurrency = Math.max(1, args.dayConcurrency);
  let done = 0;
  for (let start = 1; start <= daysInMonth; start += concurrency) {
    const batch = [];
    for (let day = start; day < start + concurrency && day <= daysInMonth; day++) {
      const dayUrl = `${VAKTIJA_BASE}/${args.cityId}/${args.year}/${args.month}/${day}`;
      const task = fetchJsonMaybe(dayUrl).then((data) => ({ day, data }));
      batch.push(task);
    }

    const results = await Promise.all(batch);
    for (const { day, data } of results) {
      if (data && Array.isArray(data.vakat)) {
        fallback[formatDateKey(args.year, args.month, day)] = data.vakat.slice(0, 6);
      }
      done++;
    }

    if (args.delayMs > 0) await sleep(args.delayMs);
    process.stdout.write(`\rDay fallback: ${Math.min(done, daysInMonth)}/${daysInMonth}`);
  }
  process.stdout.write('\n');
  return fallback;
}

function pickSampleDates(allDates, fast) {
  if (!fast) return allDates;
  const count = Math.min(10, allDates.length);
  const step = Math.max(1, Math.floor(allDates.length / count));
  const sample = [];
  for (let i = 0; i < allDates.length; i += step) {
    sample.push(allDates[i]);
  }
  return sample.slice(0, count);
}

function computeErrors(vaktijaTimes, aladhanTimes) {
  const keys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const diffs = {};
  for (let i = 0; i < keys.length; i++) {
    const vMin = timeToMinutes(vaktijaTimes[i]);
    const aMin = timeToMinutes(aladhanTimes[keys[i]]);
    diffs[keys[i]] = aMin - vMin;
  }
  return diffs;
}

function scoreDiffs(diffsByDate) {
  const keys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const perPrayer = {};
  let totalAbs = 0;
  let count = 0;

  for (const k of keys) perPrayer[k] = [];
  for (const diffs of Object.values(diffsByDate)) {
    for (const k of keys) {
      if (!Number.isFinite(diffs[k])) continue;
      perPrayer[k].push(diffs[k]);
      totalAbs += Math.abs(diffs[k]);
      count++;
    }
  }

  const stats = {};
  for (const k of keys) {
    const arr = perPrayer[k];
    if (arr.length === 0) continue;
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    const avgAbs = arr.reduce((a, b) => a + Math.abs(b), 0) / arr.length;
    const maxAbs = Math.max(...arr.map((v) => Math.abs(v)));
    stats[k] = { avgDiff: avg, avgAbs, maxAbs, samples: arr.length };
  }

  return {
    avgAbsError: count === 0 ? Infinity : totalAbs / count,
    totalAbsError: totalAbs,
    count,
    perPrayerStats: stats,
  };
}

function computeTune(perPrayerStats) {
  // Tune values are minutes and integer.
  const tune = {
    Fajr: 0,
    Sunrise: 0,
    Dhuhr: 0,
    Asr: 0,
    Maghrib: 0,
    Isha: 0,
  };

  for (const [k, stats] of Object.entries(perPrayerStats)) {
    tune[k] = -Math.round(stats.avgDiff);
  }

  // tune order: Imsak,Fajr,Sunrise,Dhuhr,Asr,Maghrib,Sunset,Isha,Midnight
  const tuneStr = `0,${tune.Fajr},${tune.Sunrise},${tune.Dhuhr},${tune.Asr},${tune.Maghrib},${tune.Maghrib},${tune.Isha},0`;
  return { tune, tuneStr };
}

function applyTuneDiffs(diffsByDate, tune) {
  const tuned = {};
  for (const [dateKey, diffs] of Object.entries(diffsByDate)) {
    tuned[dateKey] = {
      Fajr: diffs.Fajr + tune.Fajr,
      Sunrise: diffs.Sunrise + tune.Sunrise,
      Dhuhr: diffs.Dhuhr + tune.Dhuhr,
      Asr: diffs.Asr + tune.Asr,
      Maghrib: diffs.Maghrib + tune.Maghrib,
      Isha: diffs.Isha + tune.Isha,
    };
  }
  return tuned;
}

function buildConfigList(topFajrAngles, topIshaAngles) {
  const configs = [];

  for (const method of PRESET_METHODS) {
    for (const school of SCHOOLS) {
      for (const midnightMode of MIDNIGHT_MODES) {
        if (method === 15) {
          for (const shafaq of SHAFAQS) {
            configs.push({ method, school, midnightMode, shafaq, label: `method=${method} shafaq=${shafaq} school=${school} midnight=${midnightMode}` });
          }
        } else {
          configs.push({ method, school, midnightMode, label: `method=${method} school=${school} midnight=${midnightMode}` });
        }
      }
    }
  }

  for (const fajr of topFajrAngles) {
    for (const isha of topIshaAngles) {
      for (const school of SCHOOLS) {
        for (const midnightMode of MIDNIGHT_MODES) {
          configs.push({
            method: 99,
            fajr,
            isha,
            school,
            midnightMode,
            label: `method=99 ${fajr}/${isha} school=${school} midnight=${midnightMode}`,
          });
        }
      }
    }
  }

  return configs;
}

async function fetchAladhanTimings(year, month, day, config, coords, delayMs) {
  const date = formatAladhanDateKey(year, month, day);
  const params = new URLSearchParams({
    latitude: coords.lat.toString(),
    longitude: coords.lng.toString(),
    timezonestring: TIMEZONE,
    method: config.method.toString(),
    school: config.school.toString(),
    midnightMode: config.midnightMode.toString(),
  });

  if (config.method === 99) {
    params.set('methodSettings', `${config.fajr},null,${config.isha}`);
  }
  if (config.method === 15 && config.shafaq) {
    params.set('shafaq', config.shafaq);
  }

  const url = `${ALADHAN_BASE}/${date}?${params.toString()}`;
  const res = await fetchJson(url);
  if (delayMs > 0) await sleep(delayMs);
  return res.data.timings;
}

async function fetchAngleScores(sampleDates, vaktijaMonth, coords, angleList, kind, delayMs) {
  const scores = [];
  const fixedAngle = 15.0;

  for (const angle of angleList) {
    const diffsByDate = {};
    for (const dateKey of sampleDates) {
      const [y, m, d] = dateKey.split('-').map(Number);
      const config = kind === 'fajr'
        ? { method: 99, fajr: angle, isha: fixedAngle, school: 0, midnightMode: 0 }
        : { method: 99, fajr: fixedAngle, isha: angle, school: 0, midnightMode: 0 };
      const timings = await fetchAladhanTimings(y, m, d, config, coords, delayMs);
      diffsByDate[dateKey] = computeErrors(vaktijaMonth[dateKey], timings);
    }

    const stats = scoreDiffs(diffsByDate);
    const key = kind === 'fajr' ? 'Fajr' : 'Isha';
    const avgAbs = stats.perPrayerStats[key]?.avgAbs ?? Infinity;
    scores.push({ angle, avgAbs });
  }

  scores.sort((a, b) => a.avgAbs - b.avgAbs);
  return scores;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const coords = { lat: args.lat, lng: args.lng };

  console.log('=== Vaktija.ba vs Aladhan matcher ===');
  console.log(`City: Sarajevo (id=${args.cityId})`);
  console.log(`Month: ${args.year}-${String(args.month).padStart(2, '0')}`);
  console.log(`Mode: ${args.fast ? 'fast (sample days)' : 'full month'}`);
  console.log(`Angle sweep: ${args.exhaustiveAngles ? 'exhaustive' : `top ${args.topAngles}`}`);
  console.log(`Request delay: ${args.delayMs} ms`);

  const vaktijaMonth = await fetchVaktijaMonthData(args);
  const allDates = Object.keys(vaktijaMonth).sort();

  if (allDates.length === 0) {
    console.log('No vaktija.ba data found for this month.');
    return;
  }

  const sampleDates = pickSampleDates(allDates, args.fast);
  const dateBundle = { vaktija: vaktijaMonth };

  console.log(`Using ${sampleDates.length} day(s).`);

  const angleList = [];
  for (let a = args.angleMin; a <= args.angleMax + 1e-9; a += args.angleStep) {
    angleList.push(Number(a.toFixed(1)));
  }

  console.log(`Sweeping Fajr angles (${angleList.length})...`);
  const fajrScores = await fetchAngleScores(sampleDates, vaktijaMonth, coords, angleList, 'fajr', args.delayMs);
  const topFajrAngles = args.exhaustiveAngles
    ? angleList
    : fajrScores.slice(0, args.topAngles).map((s) => s.angle);

  console.log(`Top Fajr angles: ${topFajrAngles.join(', ')}`);
  console.log(`Sweeping Isha angles (${angleList.length})...`);
  const ishaScores = await fetchAngleScores(sampleDates, vaktijaMonth, coords, angleList, 'isha', args.delayMs);
  const topIshaAngles = args.exhaustiveAngles
    ? angleList
    : ishaScores.slice(0, args.topAngles).map((s) => s.angle);
  console.log(`Top Isha angles: ${topIshaAngles.join(', ')}`);

  const configs = buildConfigList(topFajrAngles, topIshaAngles);
  console.log(`Total configurations to test: ${configs.length}`);

  const totalSteps = configs.length * sampleDates.length;
  let step = 0;

  const results = [];

  for (const config of configs) {
    const diffsByDate = {};

    for (const dateKey of sampleDates) {
      const [y, m, d] = dateKey.split('-').map(Number);
      const timings = await fetchAladhanTimings(y, m, d, config, coords, args.delayMs);
      diffsByDate[dateKey] = computeErrors(vaktijaMonth[dateKey], timings);

      step++;
      if (step % 5 === 0 || step === totalSteps) {
        const pct = Math.floor((step / totalSteps) * 100);
        process.stdout.write(`\rProgress: ${pct}% (${step}/${totalSteps})`);
      }
    }

    const rawScore = scoreDiffs(diffsByDate);
    const { tune, tuneStr } = computeTune(rawScore.perPrayerStats);
    const tunedScore = scoreDiffs(applyTuneDiffs(diffsByDate, tune));

    results.push({
      config,
      rawScore,
      tunedScore,
      tune,
      tuneStr,
    });
  }

  process.stdout.write('\n');
  results.sort((a, b) => a.tunedScore.avgAbsError - b.tunedScore.avgAbsError);

  const top = results.slice(0, 10);
  console.log('=== TOP 10 (tuned) ===');
  top.forEach((r, i) => {
    console.log(`${i + 1}. ${r.config.label}`);
    console.log(`   tuned avg |err|: ${r.tunedScore.avgAbsError.toFixed(2)} min`);
    console.log(`   raw avg |err|: ${r.rawScore.avgAbsError.toFixed(2)} min`);
    console.log(`   tune: ${r.tuneStr}`);
  });

  const out = {
    args,
    dates: sampleDates,
    results,
  };

  const outPath = './scripts/vaktija-aladhan-match-results.json';
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`Results written to ${outPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
});
