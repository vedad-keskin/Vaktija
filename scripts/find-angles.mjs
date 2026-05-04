import { readFileSync, writeFileSync } from 'fs';

const SARAJEVO = { lat: 43.8486, lng: 18.3564 };

// Read the vaktija samples we already fetched
const data = JSON.parse(readFileSync('./scripts/vaktija-comparison-results.json', 'utf8'));
const vaktijaSamples = data.vaktijaSamples;

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

function timeToMinutes(timeStr) {
  if (!timeStr) return NaN;
  const clean = timeStr.replace(/\s*\(.*\)/, '').trim();
  const parts = clean.split(':');
  if (parts.length < 2) return NaN;
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

async function main() {
  console.log('Sweeping custom angles to find Vaktija.ba parity...');
  
  const dates = Object.keys(vaktijaSamples);
  
  // We only need to fetch Aladhan data for one method, but we can't!
  // We need the API to calculate the angles for us.
  // This would take too many API calls if we brute force 14.0 to 19.0 (50 * 50 = 2500 combinations * 24 dates = 60,000 calls).
  // INSTEAD: Fajr angle only affects Fajr/Sunrise(maybe). Isha only affects Isha.
  // So we can sweep Fajr angle independently from Isha angle!
  // Fajr: test 14.0 to 19.0 in 0.1 increments (51 calls per date = 1224 calls)
  // Isha: test 14.0 to 19.0 in 0.1 increments (51 calls per date = 1224 calls)
  
  const anglesToTest = [];
  for (let i = 14.0; i <= 19.0; i += 0.1) {
    anglesToTest.push(i.toFixed(1));
  }
  
  console.log(`Testing ${anglesToTest.length} angles for Fajr...`);
  
  let bestFajrAngle = null;
  let bestFajrError = Infinity;
  let bestFajrTune = 0;
  
  // To avoid hitting rate limits, let's just fetch Sunrise/Dhuhr/Asr/Maghrib with method 99 (15,null,15) 
  // since angles don't affect them.
  // Wait, angles don't affect Dhuhr/Asr/Maghrib.
  
  for (const angle of anglesToTest) {
    let totalError = 0;
    const diffs = [];
    
    for (const dateKey of dates) {
      const [y, m, d] = dateKey.split('-');
      // We use the API to calculate Fajr for this angle.
      // To save calls, maybe we can fetch just one angle?
      const url = `https://api.aladhan.com/v1/timings/${d}-${m}-${y}?latitude=${SARAJEVO.lat}&longitude=${SARAJEVO.lng}&method=99&methodSettings=${angle},null,15&school=0&midnightMode=0&timezonestring=Europe/Sarajevo`;
      
      const res = await fetchJson(url);
      const aMin = timeToMinutes(res.data.timings.Fajr);
      const vMin = timeToMinutes(vaktijaSamples[dateKey][0]); // Fajr
      
      diffs.push(aMin - vMin);
    }
    
    // Check if there's a constant offset
    const avgDiff = Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
    let absVariance = 0;
    for (const d of diffs) {
      absVariance += Math.abs(d - avgDiff);
    }
    
    if (absVariance < bestFajrError) {
      bestFajrError = absVariance;
      bestFajrAngle = angle;
      bestFajrTune = -avgDiff;
    }
    process.stdout.write('.');
  }
  
  console.log(`\nBest Fajr Angle: ${bestFajrAngle}° (Variance: ${bestFajrError} mins) with tune ${bestFajrTune}`);

  console.log(`\nTesting ${anglesToTest.length} angles for Isha...`);
  
  let bestIshaAngle = null;
  let bestIshaError = Infinity;
  let bestIshaTune = 0;
  
  for (const angle of anglesToTest) {
    let totalError = 0;
    const diffs = [];
    
    for (const dateKey of dates) {
      const [y, m, d] = dateKey.split('-');
      const url = `https://api.aladhan.com/v1/timings/${d}-${m}-${y}?latitude=${SARAJEVO.lat}&longitude=${SARAJEVO.lng}&method=99&methodSettings=15,null,${angle}&school=0&midnightMode=0&timezonestring=Europe/Sarajevo`;
      
      const res = await fetchJson(url);
      const aMin = timeToMinutes(res.data.timings.Isha);
      const vMin = timeToMinutes(vaktijaSamples[dateKey][5]); // Isha
      
      diffs.push(aMin - vMin);
    }
    
    const avgDiff = Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
    let absVariance = 0;
    for (const d of diffs) {
      absVariance += Math.abs(d - avgDiff);
    }
    
    if (absVariance < bestIshaError) {
      bestIshaError = absVariance;
      bestIshaAngle = angle;
      bestIshaTune = -avgDiff;
    }
    process.stdout.write('.');
  }
  
  console.log(`\nBest Isha Angle: ${bestIshaAngle}° (Variance: ${bestIshaError} mins) with tune ${bestIshaTune}`);
  
  // Now let's calculate the tune for Sunrise, Dhuhr, Asr, Maghrib
  console.log('\nCalculating offsets for other prayers...');
  const srDiffs = [], dhDiffs = [], asDiffs = [], mgDiffs = [];
  
  for (const dateKey of dates) {
    const [y, m, d] = dateKey.split('-');
    const url = `https://api.aladhan.com/v1/timings/${d}-${m}-${y}?latitude=${SARAJEVO.lat}&longitude=${SARAJEVO.lng}&method=99&methodSettings=${bestFajrAngle},null,${bestIshaAngle}&school=0&midnightMode=0&timezonestring=Europe/Sarajevo`;
    const res = await fetchJson(url);
    
    const vak = vaktijaSamples[dateKey];
    const timings = res.data.timings;
    
    srDiffs.push(timeToMinutes(timings.Sunrise) - timeToMinutes(vak[1]));
    dhDiffs.push(timeToMinutes(timings.Dhuhr) - timeToMinutes(vak[2]));
    asDiffs.push(timeToMinutes(timings.Asr) - timeToMinutes(vak[3]));
    mgDiffs.push(timeToMinutes(timings.Maghrib) - timeToMinutes(vak[4]));
  }
  
  const srTune = -Math.round(srDiffs.reduce((a, b) => a + b, 0) / srDiffs.length);
  const dhTune = -Math.round(dhDiffs.reduce((a, b) => a + b, 0) / dhDiffs.length);
  const asTune = -Math.round(asDiffs.reduce((a, b) => a + b, 0) / asDiffs.length);
  const mgTune = -Math.round(mgDiffs.reduce((a, b) => a + b, 0) / mgDiffs.length);
  
  console.log(`Optimal Tune String: ${bestFajrTune},${bestFajrTune},${srTune},${dhTune},${asTune},${mgTune},${mgTune},${bestIshaTune},0`);
}

main().catch(console.error);
