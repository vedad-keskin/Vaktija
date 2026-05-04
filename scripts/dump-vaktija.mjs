import { writeFileSync } from 'fs';

async function fetchVaktijaYear() {
  console.log('Fetching full year from vaktija.ba...');
  const yearData = [];
  
  for (let m = 1; m <= 12; m++) {
    const res = await fetch(`https://api.vaktija.ba/vaktija/v1/77/2025/${m}`);
    const data = await res.json();
    
    for (let d = 0; d < data.mjeseci[0].dani.length; d++) {
      const vaktovi = data.mjeseci[0].dani[d].vaktovi;
      const mins = vaktovi.map(timeStr => {
        const [h, min] = timeStr.split(':').map(Number);
        return h * 60 + min;
      });
      yearData.push(mins);
    }
  }
  
  const compactJson = JSON.stringify(yearData);
  writeFileSync('./src/assets/data/vaktija.json', compactJson);
  
  console.log(`Successfully created vaktija.json! File size: ${(compactJson.length / 1024).toFixed(2)} KB`);
}

fetchVaktijaYear();
