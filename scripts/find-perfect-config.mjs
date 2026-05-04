/**
 * Find the EXACT Aladhan method=99 configuration that matches vaktija.ba
 * 
 * Strategy:
 * 1. Sweep Fajr angles (14.0-19.0, step 0.1) to find the one matching vaktija.ba Fajr
 * 2. Sweep Isha angles (14.0-19.0, step 0.1) to find the one matching vaktija.ba Isha
 * 3. Compute tune offsets for Sunrise, Dhuhr, Asr, Maghrib
 * 4. Validate final configuration across all 24 sample dates
 * 
 * Uses method=99 (custom) which has NO hidden internal offsets.
 */

import { readFileSync, writeFileSync } from 'fs';

const SARAJEVO = { lat: 43.8486, lng: 18.3564 };
const BASE = 'https://api.aladhan.com/v1/timings';
const data = JSON.parse(readFileSync('./scripts/vaktija-comparison-results.json', 'utf8'));
const vaktijaSamples = data.vaktijaSamples;
const dates = Object.keys(vaktijaSamples);

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchJson(url, retries = 4) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) { await sleep(2000 * (i + 1)); continue; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === retries - 1) throw e;
      await sleep(1000 * (i + 1));
    }
  }
}

function timeToMinutes(t) {
  if (!t) return NaN;
  const [h, m] = t.replace(/\s*\(.*\)/, '').trim().split(':').map(Number);
  return h * 60 + m;
}

function fmtDate(dk) { const [y, m, d] = dk.split('-'); return `${d}-${m}-${y}`; }

async function fetchAladhan(dateKey, fajr, isha) {
  const url = `${BASE}/${fmtDate(dateKey)}?latitude=${SARAJEVO.lat}&longitude=${SARAJEVO.lng}&method=99&methodSettings=${fajr},null,${isha}&school=0&midnightMode=0&timezonestring=Europe/Sarajevo`;
  return fetchJson(url);
}

// ─── PHASE 1: Sweep Fajr angle ───
async function sweepFajr() {
  console.log('\n═══ PHASE 1: Sweeping Fajr angle (14.0° → 19.0°, step 0.1°) ═══');
  const results = [];

  for (let a = 14.0; a <= 19.01; a += 0.1) {
    const angle = a.toFixed(1);
    const diffs = [];

    for (const dk of dates) {
      const res = await fetchAladhan(dk, angle, '15.0');
      const aMin = timeToMinutes(res.data.timings.Fajr);
      const vMin = timeToMinutes(vaktijaSamples[dk][0]);
      diffs.push(vMin - aMin);
      await sleep(150);
    }

    const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    const absAvg = diffs.reduce((a, b) => a + Math.abs(b), 0) / diffs.length;
    const maxAbs = Math.max(...diffs.map(Math.abs));
    results.push({ angle, avg, absAvg, maxAbs, diffs });
    process.stdout.write(`  ${angle}° → avgDiff=${avg.toFixed(2)}, absAvg=${absAvg.toFixed(2)}, max=${maxAbs}\n`);
  }

  results.sort((a, b) => a.absAvg - b.absAvg);
  console.log(`\n🏆 Best Fajr angle: ${results[0].angle}° (absAvg=${results[0].absAvg.toFixed(2)}, max=${results[0].maxAbs})`);
  return results[0].angle;
}

// ─── PHASE 2: Sweep Isha angle ───
async function sweepIsha(bestFajr) {
  console.log('\n═══ PHASE 2: Sweeping Isha angle (14.0° → 19.0°, step 0.1°) ═══');
  const results = [];

  for (let a = 14.0; a <= 19.01; a += 0.1) {
    const angle = a.toFixed(1);
    const diffs = [];

    for (const dk of dates) {
      const res = await fetchAladhan(dk, bestFajr, angle);
      const aMin = timeToMinutes(res.data.timings.Isha);
      const vMin = timeToMinutes(vaktijaSamples[dk][5]);
      diffs.push(vMin - aMin);
      await sleep(150);
    }

    const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    const absAvg = diffs.reduce((a, b) => a + Math.abs(b), 0) / diffs.length;
    const maxAbs = Math.max(...diffs.map(Math.abs));
    results.push({ angle, avg, absAvg, maxAbs, diffs });
    process.stdout.write(`  ${angle}° → avgDiff=${avg.toFixed(2)}, absAvg=${absAvg.toFixed(2)}, max=${maxAbs}\n`);
  }

  results.sort((a, b) => a.absAvg - b.absAvg);
  console.log(`\n🏆 Best Isha angle: ${results[0].angle}° (absAvg=${results[0].absAvg.toFixed(2)}, max=${results[0].maxAbs})`);
  return results[0].angle;
}

// ─── PHASE 3: Calculate tune offsets ───
async function calcTune(bestFajr, bestIsha) {
  console.log('\n═══ PHASE 3: Computing tune offsets for Sunrise/Dhuhr/Asr/Maghrib ═══');
  const keys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const allDiffs = { Fajr: [], Sunrise: [], Dhuhr: [], Asr: [], Maghrib: [], Isha: [] };

  for (const dk of dates) {
    const res = await fetchAladhan(dk, bestFajr, bestIsha);
    const t = res.data.timings;
    const v = vaktijaSamples[dk];
    for (let i = 0; i < 6; i++) {
      allDiffs[keys[i]].push(timeToMinutes(v[i]) - timeToMinutes(t[keys[i]]));
    }
    await sleep(150);
  }

  const tunes = {};
  for (const k of keys) {
    const arr = allDiffs[k];
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    const rounded = Math.round(avg);
    const maxAbs = Math.max(...arr.map(Math.abs));
    const variance = arr.reduce((a, b) => a + Math.abs(b - rounded), 0) / arr.length;
    tunes[k] = rounded;
    console.log(`  ${k.padEnd(8)}: avgDiff=${avg.toFixed(2)}, tune=${rounded}, residualVariance=${variance.toFixed(2)}, maxAbs=${maxAbs}`);
  }

  // tune order: Imsak,Fajr,Sunrise,Dhuhr,Asr,Maghrib,Sunset,Isha,Midnight
  const tuneStr = `0,${tunes.Fajr},${tunes.Sunrise},${tunes.Dhuhr},${tunes.Asr},${tunes.Maghrib},${tunes.Maghrib},${tunes.Isha},0`;
  console.log(`\n  Tune string: ${tuneStr}`);
  return { tunes, tuneStr };
}

// ─── PHASE 4: Validate ───
async function validate(bestFajr, bestIsha, tuneStr) {
  console.log('\n═══ PHASE 4: Validating final configuration ═══');
  console.log(`  method=99, methodSettings=${bestFajr},null,${bestIsha}, tune=${tuneStr}\n`);
  console.log('Date         | Fajr | Sunr | Dhuhr | Asr  | Magh | Isha');
  console.log('-------------|------|------|-------|------|------|------');

  const keys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const totals = [0, 0, 0, 0, 0, 0];
  let perfect = 0, total = 0;

  for (const dk of dates) {
    const [y, m, d] = dk.split('-');
    const url = `${BASE}/${d}-${m}-${y}?latitude=${SARAJEVO.lat}&longitude=${SARAJEVO.lng}&method=99&methodSettings=${bestFajr},null,${bestIsha}&school=0&midnightMode=0&timezonestring=Europe/Sarajevo&tune=${tuneStr}`;
    const res = await fetchJson(url);
    const t = res.data.timings;
    const v = vaktijaSamples[dk];

    const errs = [];
    for (let i = 0; i < 6; i++) {
      const diff = timeToMinutes(t[keys[i]]) - timeToMinutes(v[i]);
      errs.push(diff);
      totals[i] += Math.abs(diff);
      total++;
      if (diff === 0) perfect++;
    }

    console.log(`${dk} | ${errs.map(e => e.toString().padStart(4)).join(' | ')}`);
    await sleep(150);
  }

  console.log('-------------|------|------|-------|------|------|------');
  console.log(`AVG ABS ERR  | ${totals.map(t => (t / dates.length).toFixed(1).padStart(4)).join(' | ')}`);
  console.log(`\nPerfect matches: ${perfect}/${total} (${(100 * perfect / total).toFixed(1)}%)`);
  console.log(`Overall avg abs error: ${(totals.reduce((a, b) => a + b) / total).toFixed(2)} minutes`);
}

// ─── MAIN ───
async function main() {
  console.log(`Starting comprehensive angle sweep (${dates.length} sample dates)...`);
  console.log(`This will make ~2500 API calls. ETA: ~15 minutes.\n`);

  const bestFajr = await sweepFajr();
  const bestIsha = await sweepIsha(bestFajr);
  const { tuneStr } = await calcTune(bestFajr, bestIsha);
  await validate(bestFajr, bestIsha, tuneStr);

  console.log('\n═══ FINAL CONFIGURATION ═══');
  console.log(`method: 99`);
  console.log(`methodSettings: ${bestFajr},null,${bestIsha}`);
  console.log(`tune: ${tuneStr}`);
  console.log(`school: 0`);
  console.log(`midnightMode: 0`);
}

main().catch(console.error);
