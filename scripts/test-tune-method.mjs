async function test() {
  const urlTune13 = 'https://api.aladhan.com/v1/timings/04-05-2026?latitude=43.8486&longitude=18.3564&method=13&school=0&midnightMode=0&tune=0,0,0,0,0,0,0,0,0&timezonestring=Europe/Sarajevo';
  const urlTune02 = 'https://api.aladhan.com/v1/timings/04-05-2026?latitude=43.8486&longitude=18.3564&method=2&school=0&midnightMode=0&tune=0,0,0,0,0,0,0,0,0&timezonestring=Europe/Sarajevo';
  
  const [res13, res2] = await Promise.all([
    fetch(urlTune13).then(r => r.json()),
    fetch(urlTune02).then(r => r.json())
  ]);

  console.log('--- TUNE=0 (METHOD 13) ---');
  console.log(res13.data.timings);

  console.log('--- TUNE=0 (METHOD 2) ---');
  console.log(res2.data.timings);
}

test();
