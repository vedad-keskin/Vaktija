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
  console.log('Sweeping Isha angle (14.0 to 19.0) to find minimum variance...');
  const dates = Object.keys(vaktijaSamples);
  
  let bestAngle = null;
  let bestVariance = Infinity;
  let bestOffset = 0;
  
  for (let angle = 14.0; angle <= 19.0; angle += 0.1) {
    const angleStr = angle.toFixed(1);
    const diffs = [];
    
    for (const dateKey of dates) {
      const [y, m, d] = dateKey.split('-');
      const url = `https://api.aladhan.com/v1/timings/${d}-${m}-${y}?latitude=${SARAJEVO.lat}&longitude=${SARAJEVO.lng}&method=99&methodSettings=18.0,null,${angleStr}&school=0&midnightMode=0&timezonestring=Europe/Sarajevo`;
      
      const res = await fetchJson(url);
      const aMin = timeToMinutes(res.data.timings.Isha);
      const vMin = timeToMinutes(vaktijaSamples[dateKey][5]); // Isha
      
      // We want Vaktija - Aladhan to find what to add to Aladhan
      diffs.push(vMin - aMin);
    }
    
    const avgDiff = Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
    let variance = 0;
    for (const d of diffs) {
      variance += Math.abs(d - avgDiff);
    }
    
    if (variance < bestVariance) {
      bestVariance = variance;
      bestAngle = angleStr;
      bestOffset = avgDiff;
    }
    process.stdout.write('.');
  }
  
  console.log(`\n\nOptimal Isha Angle: ${bestAngle}°`);
  console.log(`Variance across 24 dates: ${bestVariance} minutes`);
  console.log(`Constant Offset to apply via tune: ${bestOffset} minutes`);
  
  // Now calculate tune for all prayers using 18.0 Fajr and optimal Isha
  const srDiffs = [], dhDiffs = [], asDiffs = [], mgDiffs = [];
  
  for (const dateKey of dates) {
    const [y, m, d] = dateKey.split('-');
    const url = `https://api.aladhan.com/v1/timings/${d}-${m}-${y}?latitude=${SARAJEVO.lat}&longitude=${SARAJEVO.lng}&method=99&methodSettings=18.0,null,${bestAngle}&school=0&midnightMode=0&timezonestring=Europe/Sarajevo`;
    const res = await fetchJson(url);
    const t = res.data.timings;
    const v = vaktijaSamples[dateKey];
    
    srDiffs.push(timeToMinutes(v[1]) - timeToMinutes(t.Sunrise));
    dhDiffs.push(timeToMinutes(v[2]) - timeToMinutes(t.Dhuhr));
    asDiffs.push(timeToMinutes(v[3]) - timeToMinutes(t.Asr));
    mgDiffs.push(timeToMinutes(v[4]) - timeToMinutes(t.Maghrib));
  }
  
  const srTune = Math.round(srDiffs.reduce((a, b) => a + b, 0) / srDiffs.length);
  const dhTune = Math.round(dhDiffs.reduce((a, b) => a + b, 0) / dhDiffs.length);
  const asTune = Math.round(asDiffs.reduce((a, b) => a + b, 0) / asDiffs.length);
  const mgTune = Math.round(mgDiffs.reduce((a, b) => a + b, 0) / mgDiffs.length);
  
  console.log('\n--- Final IZ Configuration ---');
  console.log(`method: 99`);
  console.log(`methodSettings: 18.0,null,${bestAngle}`);
  console.log(`tune: 0, 0, ${srTune}, ${dhTune}, ${asTune}, ${mgTune}, ${mgTune}, ${bestOffset}, 0`);
}

main().catch(console.error);
