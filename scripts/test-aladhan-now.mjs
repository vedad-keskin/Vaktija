import { readFileSync } from 'fs';

async function testAladhan() {
  const url13 = 'https://api.aladhan.com/v1/timings/04-05-2026?latitude=43.8486&longitude=18.3564&method=13&school=0&midnightMode=0&timezonestring=Europe/Sarajevo';
  const url99 = 'https://api.aladhan.com/v1/timings/04-05-2026?latitude=43.8486&longitude=18.3564&method=99&methodSettings=14.6,null,14.6&school=0&midnightMode=0&timezonestring=Europe/Sarajevo';
  
  const [res13, res99] = await Promise.all([
    fetch(url13).then(r => r.json()),
    fetch(url99).then(r => r.json())
  ]);

  console.log('--- METHOD 13 (RAW) ---');
  console.log(res13.data.timings);

  console.log('--- METHOD 99 (14.6) ---');
  console.log(res99.data.timings);

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

testAladhan();
