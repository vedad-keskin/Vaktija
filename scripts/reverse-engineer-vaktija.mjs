/**
 * Reverse-Engineering vaktija.ba → Aladhan Configuration
 * ========================================================
 * 
 * This script:
 * 1. Fetches a full year (2025) of prayer times from vaktija.ba for Sarajevo (id=77)
 * 2. Fetches the same dates from Aladhan with many different method configurations
 * 3. Compares them to find which Aladhan config best matches vaktija.ba
 * 
 * Run:  node scripts/reverse-engineer-vaktija.mjs
 */

const VAKTIJA_BASE = 'https://api.vaktija.ba/vaktija/v1';
const ALADHAN_BASE = 'https://api.aladhan.com/v1';

// Sarajevo coordinates (matching bosnia-preset-cities.constants.ts)
const SARAJEVO = { lat: 43.8486, lng: 18.3564, vaktijaId: 77 };

// Year to compare
const YEAR = 2025;

// Sample dates: pick ~24 dates spread across the year (2 per month) 
// to avoid hammering the APIs with 365 requests
const SAMPLE_DATES = [];
for (let month = 1; month <= 12; month++) {
  SAMPLE_DATES.push({ month, day: 1 });
  SAMPLE_DATES.push({ month, day: 15 });
}

// Aladhan preset methods to test (0-15 + custom angles)
// Method IDs: https://aladhan.com/prayer-times-api
const ALADHAN_METHODS = [
  { id: 0, label: 'Shia Ithna-Ashari (Jafari)' },
  { id: 1, label: 'University of Islamic Sciences, Karachi' },
  { id: 2, label: 'Islamic Society of North America (ISNA)' },
  { id: 3, label: 'Muslim World League (MWL)' },
  { id: 4, label: 'Umm Al-Qura University, Makkah' },
  { id: 5, label: 'Egyptian General Authority of Survey' },
  { id: 7, label: 'Institute of Geophysics, University of Tehran' },
  { id: 8, label: 'Gulf Region' },
  { id: 9, label: 'Kuwait' },
  { id: 10, label: 'Qatar' },
  { id: 11, label: 'Majlis Ugama Islam Singapura, Singapore' },
  { id: 12, label: 'Union Organization islamic de France' },
  { id: 13, label: 'Diyanet İşleri Başkanlığı, Turkey' },
  { id: 14, label: 'Spiritual Administration of Muslims of Russia' },
  { id: 15, label: 'Moonsighting Committee Worldwide' },
  { id: 16, label: 'Dubai (unofficial)' },
];

// Custom method=99 configurations to test different Fajr/Isha angles
const CUSTOM_METHODS = [
  { fajr: 14.6, isha: 14.6, label: 'Custom 14.6/14.6 (current)' },
  { fajr: 15.0, isha: 15.0, label: 'Custom 15.0/15.0' },
  { fajr: 15.5, isha: 15.5, label: 'Custom 15.5/15.5' },
  { fajr: 16.0, isha: 16.0, label: 'Custom 16.0/16.0' },
  { fajr: 16.5, isha: 16.5, label: 'Custom 16.5/16.5' },
  { fajr: 17.0, isha: 17.0, label: 'Custom 17.0/17.0' },
  { fajr: 17.5, isha: 17.5, label: 'Custom 17.5/17.5' },
  { fajr: 18.0, isha: 18.0, label: 'Custom 18.0/18.0' },
  { fajr: 18.5, isha: 18.5, label: 'Custom 18.5/18.5' },
  { fajr: 14.0, isha: 14.0, label: 'Custom 14.0/14.0' },
  { fajr: 13.5, isha: 13.5, label: 'Custom 13.5/13.5' },
  { fajr: 13.0, isha: 13.0, label: 'Custom 13.0/13.0' },
  { fajr: 14.6, isha: 15.0, label: 'Custom 14.6/15.0' },
  { fajr: 15.0, isha: 14.6, label: 'Custom 15.0/14.6' },
  { fajr: 14.6, isha: 13.0, label: 'Custom 14.6/13.0' },
  { fajr: 15.0, isha: 14.0, label: 'Custom 15.0/14.0' },
  { fajr: 16.0, isha: 14.0, label: 'Custom 16.0/14.0' },
  { fajr: 18.0, isha: 17.0, label: 'Custom 18.0/17.0 (astronomical)' },
  // Try the Turkish Diyanet-like angles  
  { fajr: 18.0, isha: 17.0, label: 'Custom 18/17 (Diyanet-like)' },
  // Try ISNA-like
  { fajr: 15.0, isha: 15.0, label: 'Custom 15/15' },
];

// School options: 0 = Shafi (standard Asr), 1 = Hanafi
const SCHOOLS = [0, 1];

// Midnight modes: 0 = Standard (mid Sunset-Sunrise), 1 = Jafari (mid Sunset-Fajr)
const MIDNIGHT_MODES = [0, 1];

// ─── Helpers ────────────────────────────────────────────────────────

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
      console.log(`  ⚠ Retry ${i + 1} for ${url}: ${e.message}`);
      await sleep(1000 * (i + 1));
    }
  }
}

/** Parse "HH:MM" or "H:MM" to minutes since midnight */
function timeToMinutes(timeStr) {
  if (!timeStr) return NaN;
  // Strip timezone info like " (CEST)" or " (CET)" 
  const clean = timeStr.replace(/\s*\(.*\)/, '').trim();
  const parts = clean.split(':');
  if (parts.length < 2) return NaN;
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

/** Compute per-prayer and aggregate errors between two time sets */
function computeError(vaktijaTimes, aladhanTimes) {
  // vaktijaTimes: [Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha] in "H:MM" 
  // aladhanTimes: { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha } in "HH:MM (TZ)"
  const prayerNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const errors = {};
  let totalAbsError = 0;
  let count = 0;

  for (let i = 0; i < 6; i++) {
    const vMin = timeToMinutes(vaktijaTimes[i]);
    const aMin = timeToMinutes(aladhanTimes[prayerNames[i]]);
    if (isNaN(vMin) || isNaN(aMin)) {
      errors[prayerNames[i]] = NaN;
      continue;
    }
    const diff = aMin - vMin; // positive = Aladhan is later
    errors[prayerNames[i]] = diff;
    totalAbsError += Math.abs(diff);
    count++;
  }

  return {
    perPrayer: errors,
    totalAbsError,
    avgAbsError: count > 0 ? totalAbsError / count : Infinity,
    count,
  };
}

// ─── Step 1: Fetch vaktija.ba data ──────────────────────────────────

async function fetchVaktijaYear() {
  console.log(`\n📥 Fetching vaktija.ba data for Sarajevo (id=${SARAJEVO.vaktijaId}), year ${YEAR}...`);
  console.log(`   Using API: ${VAKTIJA_BASE}/${SARAJEVO.vaktijaId}/${YEAR}`);
  
  // vaktija.ba supports fetching an entire year at once!
  const url = `${VAKTIJA_BASE}/${SARAJEVO.vaktijaId}/${YEAR}`;
  
  try {
    const yearData = await fetchJson(url);
    console.log(`   ✅ Got year data. Type: ${typeof yearData}, isArray: ${Array.isArray(yearData)}`);
    
    // The year endpoint returns an array of months, each containing days
    // Let's inspect the structure
    if (Array.isArray(yearData)) {
      console.log(`   Structure: Array of ${yearData.length} items`);
      if (yearData.length > 0) {
        console.log(`   First item sample:`, JSON.stringify(yearData[0]).substring(0, 300));
      }
    } else if (yearData && typeof yearData === 'object') {
      console.log(`   Keys:`, Object.keys(yearData));
      if (yearData.vakat) {
        console.log(`   Has 'vakat' — might be single day. Trying month-by-month...`);
      }
    }
    
    return yearData;
  } catch (e) {
    console.log(`   ❌ Year fetch failed: ${e.message}. Falling back to month-by-month...`);
  }
  
  // Fallback: fetch month by month
  const allData = {};
  for (let month = 1; month <= 12; month++) {
    const monthUrl = `${VAKTIJA_BASE}/${SARAJEVO.vaktijaId}/${YEAR}/${month}`;
    console.log(`   Fetching month ${month}...`);
    try {
      const monthData = await fetchJson(monthUrl);
      allData[month] = monthData;
      await sleep(300);
    } catch (e) {
      console.log(`   ❌ Month ${month} failed: ${e.message}`);
    }
  }
  return allData;
}

// ─── Step 2: Fetch per-date vaktija.ba for our sample dates ─────────

async function fetchVaktijaSamples() {
  console.log(`\n📥 Fetching vaktija.ba sample dates...`);
  const samples = {};
  
  for (const { month, day } of SAMPLE_DATES) {
    const dateKey = `${YEAR}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const url = `${VAKTIJA_BASE}/${SARAJEVO.vaktijaId}/${YEAR}/${month}/${day}`;
    try {
      const data = await fetchJson(url);
      if (data && data.vakat) {
        samples[dateKey] = data.vakat;
        console.log(`   ✅ ${dateKey}: ${data.vakat.join(', ')}`);
      } else {
        console.log(`   ⚠ ${dateKey}: unexpected response`, JSON.stringify(data).substring(0, 200));
      }
    } catch (e) {
      console.log(`   ❌ ${dateKey}: ${e.message}`);
    }
    await sleep(400); // Be nice to vaktija.ba
  }
  
  return samples;
}

// ─── Step 3: Fetch Aladhan for each config × sample date ────────────

async function fetchAladhanForConfig(config, sampleDates) {
  const results = {};
  
  for (const dateKey of Object.keys(sampleDates)) {
    const [y, m, d] = dateKey.split('-');
    const dateParam = `${d}-${m}-${y}`;
    
    let url;
    if (config.method === 99) {
      url = `${ALADHAN_BASE}/timings/${dateParam}?latitude=${SARAJEVO.lat}&longitude=${SARAJEVO.lng}&method=99&methodSettings=${config.fajr},null,${config.isha}&school=${config.school}&midnightMode=${config.midnightMode}&timezonestring=Europe/Sarajevo`;
    } else {
      url = `${ALADHAN_BASE}/timings/${dateParam}?latitude=${SARAJEVO.lat}&longitude=${SARAJEVO.lng}&method=${config.method}&school=${config.school}&midnightMode=${config.midnightMode}&timezonestring=Europe/Sarajevo`;
    }
    
    try {
      const data = await fetchJson(url);
      if (data && data.data && data.data.timings) {
        results[dateKey] = data.data.timings;
      }
    } catch (e) {
      // skip
    }
    await sleep(200); // Rate limit
  }
  
  return results;
}

// ─── Step 4: Compare and score all configs ──────────────────────────

function scoreConfig(vaktijaSamples, aladhanResults) {
  let totalError = 0;
  let totalCount = 0;
  const perPrayerErrors = { Fajr: [], Sunrise: [], Dhuhr: [], Asr: [], Maghrib: [], Isha: [] };
  const dateErrors = [];
  
  for (const dateKey of Object.keys(vaktijaSamples)) {
    if (!aladhanResults[dateKey]) continue;
    
    const err = computeError(vaktijaSamples[dateKey], aladhanResults[dateKey]);
    totalError += err.totalAbsError;
    totalCount += err.count;
    
    for (const [prayer, diff] of Object.entries(err.perPrayer)) {
      if (!isNaN(diff)) {
        perPrayerErrors[prayer].push(diff);
      }
    }
    
    dateErrors.push({ date: dateKey, ...err.perPrayer, avgAbsError: err.avgAbsError });
  }
  
  const overallAvg = totalCount > 0 ? totalError / totalCount : Infinity;
  
  // Compute per-prayer stats
  const prayerStats = {};
  for (const [prayer, diffs] of Object.entries(perPrayerErrors)) {
    if (diffs.length === 0) continue;
    const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    const avgAbs = diffs.reduce((a, b) => a + Math.abs(b), 0) / diffs.length;
    const max = Math.max(...diffs.map(Math.abs));
    prayerStats[prayer] = { avgDiff: avg.toFixed(1), avgAbsDiff: avgAbs.toFixed(1), maxAbsDiff: max, samples: diffs.length };
  }
  
  return { overallAvg, totalError, totalCount, prayerStats, dateErrors };
}

// ─── Main ───────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  REVERSE ENGINEERING vaktija.ba → Aladhan API Configuration  ');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  City: Sarajevo (${SARAJEVO.lat}, ${SARAJEVO.lng})`);
  console.log(`  Year: ${YEAR}`);
  console.log(`  Sample dates: ${SAMPLE_DATES.length}`);
  
  // Step 1: Fetch vaktija.ba samples
  const vaktijaSamples = await fetchVaktijaSamples();
  const sampleCount = Object.keys(vaktijaSamples).length;
  
  if (sampleCount === 0) {
    console.log('\n❌ No vaktija.ba data retrieved. Exiting.');
    return;
  }
  
  console.log(`\n✅ Got ${sampleCount} sample dates from vaktija.ba`);
  
  // Step 2: Build all Aladhan configurations to test
  const configs = [];
  
  // Preset methods (test with both schools and midnight modes)
  for (const m of ALADHAN_METHODS) {
    for (const school of SCHOOLS) {
      for (const mm of MIDNIGHT_MODES) {
        configs.push({
          method: m.id,
          school,
          midnightMode: mm,
          label: `${m.label} | school=${school} | midnightMode=${mm}`,
        });
      }
    }
  }
  
  // Custom methods
  for (const c of CUSTOM_METHODS) {
    for (const school of SCHOOLS) {
      for (const mm of MIDNIGHT_MODES) {
        configs.push({
          method: 99,
          fajr: c.fajr,
          isha: c.isha,
          school,
          midnightMode: mm,
          label: `${c.label} | school=${school} | midnightMode=${mm}`,
        });
      }
    }
  }
  
  console.log(`\n🔧 Total configurations to test: ${configs.length}`);
  console.log('   (This will take a while due to API rate limits...)\n');
  
  // Step 3: Test each configuration
  const results = [];
  
  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    const pct = ((i / configs.length) * 100).toFixed(0);
    process.stdout.write(`\r   [${pct}%] Testing: ${config.label.substring(0, 60).padEnd(60)}...`);
    
    const aladhanResults = await fetchAladhanForConfig(config, vaktijaSamples);
    const score = scoreConfig(vaktijaSamples, aladhanResults);
    
    results.push({
      config,
      score: score.overallAvg,
      totalError: score.totalError,
      prayerStats: score.prayerStats,
      dateErrors: score.dateErrors,
    });
  }
  
  console.log('\n');
  
  // Step 4: Sort by score and display top results
  results.sort((a, b) => a.score - b.score);
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                     TOP 20 MATCHES');
  console.log('═══════════════════════════════════════════════════════════════');
  
  for (let i = 0; i < Math.min(20, results.length); i++) {
    const r = results[i];
    console.log(`\n${i + 1}. ${r.config.label}`);
    console.log(`   Average absolute error: ${r.score.toFixed(2)} minutes`);
    console.log(`   Total error: ${r.totalError} minutes`);
    console.log(`   Per-prayer breakdown:`);
    for (const [prayer, stats] of Object.entries(r.prayerStats)) {
      console.log(`     ${prayer.padEnd(10)}: avg=${stats.avgDiff}min, |avg|=${stats.avgAbsDiff}min, max|diff|=${stats.maxAbsDiff}min (${stats.samples} samples)`);
    }
  }
  
  // Step 5: Show the absolute best match in detail
  if (results.length > 0) {
    const best = results[0];
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                    BEST MATCH DETAILS');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`Config: ${best.config.label}`);
    if (best.config.method === 99) {
      console.log(`Fajr angle: ${best.config.fajr}°, Isha angle: ${best.config.isha}°`);
    }
    console.log(`School: ${best.config.school === 0 ? 'Shafi (standard)' : 'Hanafi'}`);
    console.log(`Midnight mode: ${best.config.midnightMode === 0 ? 'Standard' : 'Jafari'}`);
    console.log(`Average error: ${best.score.toFixed(2)} minutes`);
    
    console.log('\nDate-by-date comparison (Aladhan - vaktija.ba, in minutes):');
    console.log('Date         | Fajr | Sunr | Dhuhr | Asr | Magh | Isha | AvgAbs');
    console.log('-------------|------|------|-------|-----|------|------|-------');
    for (const de of best.dateErrors) {
      const f = (de.Fajr ?? '?').toString().padStart(4);
      const s = (de.Sunrise ?? '?').toString().padStart(4);
      const d = (de.Dhuhr ?? '?').toString().padStart(5);
      const a = (de.Asr ?? '?').toString().padStart(3);
      const m = (de.Maghrib ?? '?').toString().padStart(4);
      const i = (de.Isha ?? '?').toString().padStart(4);
      const avg = de.avgAbsError?.toFixed(1)?.padStart(5) ?? '?';
      console.log(`${de.date} |${f} |${s} |${d} |${a} |${m} |${i} | ${avg}`);
    }
  }
  
  // Write full results to JSON for further analysis
  const outputPath = './scripts/vaktija-comparison-results.json';
  const { writeFileSync } = await import('fs');
  writeFileSync(outputPath, JSON.stringify({
    metadata: {
      city: 'Sarajevo',
      coords: SARAJEVO,
      year: YEAR,
      sampleDates: Object.keys(vaktijaSamples),
      testedAt: new Date().toISOString(),
    },
    vaktijaSamples,
    top20: results.slice(0, 20).map(r => ({
      label: r.config.label,
      config: r.config,
      avgError: r.score,
      prayerStats: r.prayerStats,
      dateErrors: r.dateErrors,
    })),
  }, null, 2));
  
  console.log(`\n📁 Full results saved to ${outputPath}`);
}

main().catch(console.error);
