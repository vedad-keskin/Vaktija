import { readFileSync } from 'fs';

async function checkVaktijaYears() {
  const SARAJEVO_ID = 77; // Sarajevo is ID 77
  
  // Fetch 2024
  const res2024 = await fetch(`https://api.vaktija.ba/vaktija/v1/${SARAJEVO_ID}/2024`);
  const data2024 = await res2024.json();
  
  // Fetch 2025
  const res2025 = await fetch(`https://api.vaktija.ba/vaktija/v1/${SARAJEVO_ID}/2025`);
  const data2025 = await res2025.json();

  let diffs = 0;
  for (let m = 0; m < 12; m++) {
    for (let d = 0; d < data2024.mjeseci[m].dani.length; d++) {
      // leap year check
      if (m === 1 && d === 28) continue;

      const v1 = data2024.mjeseci[m].dani[d].vaktovi;
      const v2 = data2025.mjeseci[m].dani[d].vaktovi;
      
      if (v1.join(',') !== v2.join(',')) {
        diffs++;
        if (diffs < 5) {
          console.log(`Diff on month ${m+1} day ${d+1}: 2024: ${v1} | 2025: ${v2}`);
        }
      }
    }
  }
  console.log(`Total differences between 2024 and 2025: ${diffs} out of 365 days`);
}

checkVaktijaYears();
