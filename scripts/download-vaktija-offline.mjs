import { writeFileSync } from 'fs';

async function downloadAllVaktija() {
  console.log('Downloading all 116 cities from vaktija.ba API...');
  
  // Create an array to hold all cities
  const allCitiesData = [];
  
  for (let id = 0; id <= 115; id++) {
    try {
      const res = await fetch(`https://api.vaktija.ba/vaktija/v1/${id}/2025`);
      const data = await res.json();
      
      const cityYearData = [];
      for (let m = 0; m < 12; m++) {
        for (let d = 0; d < data[m].dani.length; d++) {
          const vaktovi = data[m].dani[d].vaktovi;
          const mins = vaktovi.map(timeStr => {
            const [h, min] = timeStr.split(':').map(Number);
            return h * 60 + min;
          });
          cityYearData.push(mins);
        }
      }
      
      allCitiesData.push(cityYearData);
      process.stdout.write('.');
    } catch (e) {
      console.log(`\nError downloading city ${id}: ${e.message}`);
    }
    
    // Add small delay to not hammer the API
    await new Promise(r => setTimeout(r, 100));
  }
  
  const compactJson = JSON.stringify(allCitiesData);
  writeFileSync('./scripts/vaktija-all-cities.json', compactJson);
  
  console.log(`\n\n✅ Downloaded all 116 cities!`);
  console.log(`File size: ${(compactJson.length / 1024).toFixed(2)} KB`);
}

downloadAllVaktija();
