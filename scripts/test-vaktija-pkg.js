const vaktija = require('@kmaslesa/vaktija');
const moment = require('moment');

// Test for May 4, 2026, Sarajevo (id 77)
const date = moment('2026-05-04').format('YYYY-MM-DD');

const vakat = vaktija.getVakat('77', date);
console.log('--- OFFLINE VAKTIJA PACKAGE ---');
console.log(`May 4, 2026 for Sarajevo:`);
console.log(`Zora: ${vakat.zora}`);
console.log(`Izlazak: ${vakat.izlazakSunca}`);
console.log(`Podne: ${vakat.podne}`);
console.log(`Ikindija: ${vakat.ikindija}`);
console.log(`Aksam: ${vakat.aksam}`);
console.log(`Jacija: ${vakat.jacija}`);

// Also test another city, e.g. Banja Luka (id 1)
const vakatBL = vaktija.getVakat('1', date);
console.log(`\nMay 4, 2026 for Banja Luka:`);
console.log(vakatBL);
