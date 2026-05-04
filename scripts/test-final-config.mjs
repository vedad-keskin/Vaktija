import { readFileSync } from 'fs';

async function testFinalConfig() {
  const url = 'https://api.aladhan.com/v1/timings/04-05-2026?latitude=43.8486&longitude=18.3564&method=99&methodSettings=18.0,null,15.9&school=0&midnightMode=0&tune=0,0,-6,1,0,6,6,1,0&timezonestring=Europe/Sarajevo';
  
  const res = await fetch(url).then(r => r.json());

  console.log('--- METHOD 99 (FINAL CONFIG) ---');
  console.log(res.data.timings);

  console.log('--- VAKTIJA.BA EXPECTED (from picture) ---');
  console.log({
    Fajr: '03:39',
    Sunrise: '05:29',
    Dhuhr: '12:44',
    Asr: '16:39',
    Maghrib: '19:58',
    Isha: '21:32'
  });
}

testFinalConfig();
