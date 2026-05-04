/**
 * Tune Optimization Script
 * ========================================================
 * 
 * This script finds the optimal `tune` parameters for Aladhan Method 13
 * to achieve perfect parity with vaktija.ba
 * 
 * Run:  node scripts/optimize-tune.mjs
 */

import { readFileSync, writeFileSync } from 'fs';

const ALADHAN_BASE = 'https://api.aladhan.com/v1';
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
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
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

function computeError(vaktijaTimes, aladhanTimes) {
  const prayerNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const errors = {};
  let totalAbsError = 0;
  let count = 0;

  for (let i = 0; i < 6; i++) {
    const vMin = timeToMinutes(vaktijaTimes[i]);
    const aMin = timeToMinutes(aladhanTimes[prayerNames[i]]);
    if (isNaN(vMin) || isNaN(aMin)) continue;
    
    const diff = aMin - vMin; 
    errors[prayerNames[i]] = diff;
    totalAbsError += Math.abs(diff);
    count++;
  }

  return { perPrayer: errors, totalAbsError, count };
}

async function main() {
  console.log('Optimizing Dhuhr, Asr, and Isha tunes for Method 13...');
  
  // Base offset values based on our previous findings:
  // Fajr: 0, Sunrise: 1, Dhuhr: -4, Asr: -4, Maghrib: -1, Isha: -7
  // Let's test combinations around these values.
  const dhuhrTunes = [-3, -4, -5];
  const asrTunes = [-3, -4, -5, -6];
  const ishaTunes = [-5, -6, -7, -8];
  const sunriseTunes = [0, 1, 2];
  const maghribTunes = [0, -1, -2];
  
  // To avoid too many requests, we will just test the best combinations
  const configs = [];
  
  // We'll fix Fajr=0 since it was already 0.0 avg diff.
  for (const sr of sunriseTunes) {
    for (const dh of dhuhrTunes) {
      for (const as of asrTunes) {
        for (const ma of maghribTunes) {
          for (const is of ishaTunes) {
            // tune order: Imsak,Fajr,Sunrise,Dhuhr,Asr,Maghrib,Sunset,Isha,Midnight
            // We use same value for Maghrib and Sunset to be safe.
            const tuneStr = `0,0,${sr},${dh},${as},${ma},${ma},${is},0`;
            configs.push(tuneStr);
          }
        }
      }
    }
  }
  
  console.log(`Testing ${configs.length} tune combinations... this would be too many API calls.`);
  console.log('Actually, instead of brute-forcing via API, we can just fetch the RAW (tune=0) Method 13 times from Aladhan ONCE, and simulate the tunes locally!');
  
  // Fetch RAW method 13 data for the 24 sample dates
  console.log('\nFetching raw Method 13 data...');
  const rawAladhan = {};
  const dates = Object.keys(vaktijaSamples);
  
  for (const dateKey of dates) {
    const [y, m, d] = dateKey.split('-');
    const url = `${ALADHAN_BASE}/timings/${d}-${m}-${y}?latitude=${SARAJEVO.lat}&longitude=${SARAJEVO.lng}&method=13&school=0&midnightMode=0&timezonestring=Europe/Sarajevo`;
    const data = await fetchJson(url);
    if (data?.data?.timings) {
      rawAladhan[dateKey] = data.data.timings;
      process.stdout.write('.');
    }
    await sleep(200);
  }
  console.log('\nDone fetching raw data.');
  
  // Simulate tunes locally
  console.log('\nSimulating tunes locally to find the perfect match...');
  let bestScore = Infinity;
  let bestTune = null;
  let bestStats = null;
  
  for (const tuneStr of configs) {
    const [im, fj, sr, dh, as, ma, su, is, mi] = tuneStr.split(',').map(Number);
    let totalError = 0;
    
    for (const dateKey of dates) {
      const vaktija = vaktijaSamples[dateKey];
      const rawA = rawAladhan[dateKey];
      if (!vaktija || !rawA) continue;
      
      // Apply tune to raw Aladhan times
      const tunedA = {
        Fajr: addMinutes(rawA.Fajr, fj),
        Sunrise: addMinutes(rawA.Sunrise, sr),
        Dhuhr: addMinutes(rawA.Dhuhr, dh),
        Asr: addMinutes(rawA.Asr, as),
        Maghrib: addMinutes(rawA.Maghrib, ma),
        Isha: addMinutes(rawA.Isha, is)
      };
      
      const err = computeError(vaktija, tunedA);
      totalError += err.totalAbsError;
    }
    
    if (totalError < bestScore) {
      bestScore = totalError;
      bestTune = tuneStr;
    }
  }
  
  console.log(`\n🏆 BEST TUNE FOUND: ${bestTune}`);
  console.log(`Total Absolute Error across 24 dates (144 prayers): ${bestScore} minutes`);
  console.log(`Average Error: ${(bestScore / (24 * 6)).toFixed(2)} minutes per prayer`);
  
  // Calculate final stats for best tune
  const [im, fj, sr, dh, as, ma, su, is, mi] = bestTune.split(',').map(Number);
  console.log('\nDetailed Breakdown with Best Tune:');
  console.log('Date         | Fajr | Sunr | Dhuhr | Asr | Magh | Isha');
  console.log('-------------|------|------|-------|-----|------|------');
  
  let f_err=0, s_err=0, d_err=0, a_err=0, m_err=0, i_err=0;
  
  for (const dateKey of dates) {
    const vaktija = vaktijaSamples[dateKey];
    const rawA = rawAladhan[dateKey];
    if (!vaktija || !rawA) continue;
    
    const tunedA = {
        Fajr: addMinutes(rawA.Fajr, fj),
        Sunrise: addMinutes(rawA.Sunrise, sr),
        Dhuhr: addMinutes(rawA.Dhuhr, dh),
        Asr: addMinutes(rawA.Asr, as),
        Maghrib: addMinutes(rawA.Maghrib, ma),
        Isha: addMinutes(rawA.Isha, is)
    };
    
    const err = computeError(vaktija, tunedA).perPrayer;
    
    f_err += Math.abs(err.Fajr);
    s_err += Math.abs(err.Sunrise);
    d_err += Math.abs(err.Dhuhr);
    a_err += Math.abs(err.Asr);
    m_err += Math.abs(err.Maghrib);
    i_err += Math.abs(err.Isha);
    
    const fStr = err.Fajr.toString().padStart(4);
    const sStr = err.Sunrise.toString().padStart(4);
    const dStr = err.Dhuhr.toString().padStart(5);
    const aStr = err.Asr.toString().padStart(3);
    const mStr = err.Maghrib.toString().padStart(4);
    const iStr = err.Isha.toString().padStart(4);
    
    console.log(`${dateKey} |${fStr} |${sStr} |${dStr} |${aStr} |${mStr} |${iStr}`);
  }
  
  console.log('-------------|------|------|-------|-----|------|------');
  console.log(`AVG ABS ERR  | ${(f_err/24).toFixed(1)} | ${(s_err/24).toFixed(1)} | ${(d_err/24).toFixed(1)} | ${(a_err/24).toFixed(1)} | ${(m_err/24).toFixed(1)} | ${(i_err/24).toFixed(1)}`);
}

function addMinutes(timeStr, mins) {
  const t = timeToMinutes(timeStr);
  if (isNaN(t)) return timeStr;
  const newT = t + mins;
  const h = Math.floor(newT / 60) % 24;
  const m = newT % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

main().catch(console.error);
