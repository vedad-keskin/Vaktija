import { readFileSync } from 'fs';

const SARAJEVO = { lat: 43.8486, lng: 18.3564 };
const data = JSON.parse(readFileSync('./scripts/vaktija-comparison-results.json', 'utf8'));
const vaktijaSamples = data.vaktijaSamples;

function timeToMinutes(timeStr) {
  if (!timeStr) return NaN;
  const clean = timeStr.replace(/\s*\(.*\)/, '').trim();
  const parts = clean.split(':');
  if (parts.length < 2) return NaN;
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchJson(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === retries - 1) throw e;
      await sleep(1000 * (i + 1));
    }
  }
}

async function main() {
  console.log('Fetching base solar times from Method 99 to calculate optimal tune...');
  
  const dates = Object.keys(vaktijaSamples);
  const diffs = { Fajr: [], Sunrise: [], Dhuhr: [], Asr: [], Maghrib: [], Isha: [] };
  
  // We'll use 18.0 for Fajr (since it was perfect) and 14.6 for Isha initially just to see solar offsets
  for (const dateKey of dates) {
    const [y, m, d] = dateKey.split('-');
    const url = `https://api.aladhan.com/v1/timings/${d}-${m}-${y}?latitude=${SARAJEVO.lat}&longitude=${SARAJEVO.lng}&method=99&methodSettings=18.0,null,14.6&school=0&midnightMode=0&timezonestring=Europe/Sarajevo`;
    const res = await fetchJson(url);
    const t = res.data.timings;
    const v = vaktijaSamples[dateKey];
    
    diffs.Fajr.push(timeToMinutes(v[0]) - timeToMinutes(t.Fajr));
    diffs.Sunrise.push(timeToMinutes(v[1]) - timeToMinutes(t.Sunrise));
    diffs.Dhuhr.push(timeToMinutes(v[2]) - timeToMinutes(t.Dhuhr));
    diffs.Asr.push(timeToMinutes(v[3]) - timeToMinutes(t.Asr));
    diffs.Maghrib.push(timeToMinutes(v[4]) - timeToMinutes(t.Maghrib));
    diffs.Isha.push(timeToMinutes(v[5]) - timeToMinutes(t.Isha));
    process.stdout.write('.');
  }
  
  console.log('\n\n--- Average Offsets (Vaktija - Raw Method 99) ---');
  for (const p of ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
    const arr = diffs[p];
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    console.log(`${p}: avg=${avg.toFixed(2)}, min=${min}, max=${max}`);
  }
}

main().catch(console.error);
