async function testAladhanTune0() {
  const urlRaw = 'https://api.aladhan.com/v1/timings/04-05-2026?latitude=43.8486&longitude=18.3564&method=13&school=0&midnightMode=0&timezonestring=Europe/Sarajevo';
  const urlTune0 = 'https://api.aladhan.com/v1/timings/04-05-2026?latitude=43.8486&longitude=18.3564&method=13&school=0&midnightMode=0&tune=0,0,0,0,0,0,0,0,0&timezonestring=Europe/Sarajevo';
  
  const [resRaw, resTune0] = await Promise.all([
    fetch(urlRaw).then(r => r.json()),
    fetch(urlTune0).then(r => r.json())
  ]);

  console.log('--- METHOD 13 (NO TUNE PARAM) ---');
  console.log(resRaw.data.timings);

  console.log('--- METHOD 13 (TUNE=0) ---');
  console.log(resTune0.data.timings);
}

testAladhanTune0();
