async function testAladhanTune() {
  const url = 'https://api.aladhan.com/v1/timings/04-05-2026?latitude=43.8486&longitude=18.3564&method=13&school=0&midnightMode=0&tune=0,0,0,-4,-4,-2,-2,-6,0&timezonestring=Europe/Sarajevo';
  
  const res = await fetch(url).then(r => r.json());

  console.log('--- METHOD 13 (WITH TUNE) ---');
  console.log(res.data.timings);
}

testAladhanTune();
