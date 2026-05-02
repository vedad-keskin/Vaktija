# Aladhan API Konfiguracija za Bosnu i Hercegovinu (Vaktija)

Ovaj vodič je namijenjen za pregled od strane stručnjaka iz islamskog prava (Fikha) kako bi se ispravno odabrale opcije koje će dovesti do najispravnijeg računanja namaskih vremena

---

## 1. Metoda računanja 

**Opis:** Identifikuje pravnu školu (mezheb) ili autoritet koji se koristi za izračunavanje vremena (specifično uglove za Zoru i Jaciju).

### Dostupne opcije:
*   `0` - Jafari / Shia Ithna-Ashari
*   `1` - University of Islamic Sciences, Karachi
*   `2` - Islamic Society of North America (ISNA)
*   `3` - Muslim World League (MWL)
*   `4` - Umm Al-Qura University, Makkah
*   `5` - Egyptian General Authority of Survey
*   `7` - Institute of Geophysics, University of Tehran
*   `8` - Gulf Region
*   `9` - Kuwait
*   `10` - Qatar
*   `11` - Majlis Ugama Islam Singapura, Singapore
*   `12` - Union Organization islamic de France
*   `13` - Diyanet İşleri Başkanlığı, Turkey
*   `14` - Spiritual Administration of Muslims of Russia
*   `15` - Moonsighting Committee Worldwide
*   `16` - Dubai (experimental)
*   `17` - Jabatan Kemajuan Islam Malaysia (JAKIM)
*   `18` - Tunisia
*   `19` - Algeria
*   `20` - KEMENAG - Kementerian Agama Republik Indonesia
*   `21` - Morocco
*   `22` - Comunidade Islamica de Lisboa
*   `23` - Ministry of Awqaf, Islamic Affairs and Holy Places, Jordan
*   `99` - Custom Method (allows specifying exact angles) 

### 🎯 Trenutni odabir: `99` (Custom) 
**Razlog:**  
Većina unaprijed definisanih metoda koristi ugao od 18° ili 15° za Zoru i Jaciju. Istraživanjem sam pronašao da korištenje ugla od 18° rezultira astronomskim sumrakom, što se često smatra "Lažnom zorom" što rezultira ranijim računanjem sabaha i jacije, dok sam istraživanjem uspio naći da ugao od 14.6° za zoru i jaciju daje ispravnije rezultate. Obzirom da sam daleko od ekperta za ovu oblast ovo je jedno od glavnih nedoumica kojih imam.

---

## 2. Škola za računanje Ikindije 

**Opis:** Određuje kako se početno vrijeme za Ikindija-namaz izračunava na osnovu dužine sjenke.

### Dostupne opcije:
*   `0` - Šafijski (ili standardni način): Ikindija počinje kada je sjenka objekta jednaka dužini samog objekta (plus dužina sjenke u solarno podne). Ovo također koriste malikijska i hanbelijska škola.
*   `1` - Hanefijski: Ikindija počinje kada je sjenka objekta dvostruko duža od samog objekta (plus dužina sjenke u solarno podne).

### 🎯 Trenutni odabir: `0` (Shafi / Standard)
**Razlog:**  
Iako muslimani u Bosni i Hercegovini pretežno slijede hanefijsku pravnu školu (mezheb), zvanični takvim po mom znanju također koristi šafijski. Odabir `1` (Hanefijski) bi rezultirao vremenima Ikindije koja bi bila otprilike 45-60 minuta kasnija od onoga što je napisano u zvaničnoj Vaktiji. To i neka dodatna istraživanja su razlozi ovog odabira.

---

## 3. Mod za računanje ponoći 

**Opis:** Određuje metodu za izračunavanje "Ponoći" (Polovina noći) i posljedično zadnje trećine noći.

### Dostupne opcije:
*   `0` - Standardno: Računa se od Akšama (zalazak sunca) do izlaska sunca.
*   `1` - Jafari: Računa se od Akšama (zalazak sunca) do zore (Fajr).

### 🎯 Trenutni odabir: `1` (Jafari)
**Razlog:**  
Kao i broj 2 našao sam na ovo objašenjenje kroz Hidaya akademiju, ali nije od viška dvaput provjeriti.

---

## 4. Sumrak (`shafaq`)

**Opis:** Određuje koji se sumrak (Šefek) koristi ako je parametar upita za metodu postavljen na 'Moonsighting Committee Worldwide' (15).

### Dostupne opcije:
*   `general` (Općenito)
*   `ahmer` (Crveni sumrak)
*   `abyad` (Bijeli sumrak)

### 🎯 Naš odabir: Ne koristi se (Podrazumijevano)
**Zašto smo ovo odabrali:**  
Ovaj parametar je usko vezan za metodu `15`. Pošto mi koristimo prilagođenu (custom) metodu (`99`) zasnovanu na specifičnim uglovima sunca (14.6°), ovaj parametar ne utiče na naša izračunavanja. Ovo sam našao kao AI objašenje za korištenje ovoga, ali nemam dovoljno znanja da bi procijenio tačnost.

---

## 5. Prilagođavanje za više geografske širine 

**Opis:** Metoda za prilagođavanje vremena na višim geografskim širinama gdje sunce možda ne zalazi ili ne izlazi u potpunosti, ili gdje se periodi sumraka preklapaju (npr. UK, Švedska, ljetni mjeseci).

### Dostupne opcije:
*   `1` - Sredina noći (Middle of the Night)
*   `2` - Jedna sedmina (One Seventh)
*   `3` - Na osnovu ugla (Angle Based)

### 🎯 Naš odabir: Podrazumijevano (API podrazumijevano obično koristi Angle Based)
**Zašto smo ovo odabrali:**  
Bosna i Hercegovina (geografska širina ~43° do 45° N) nije dovoljno daleko na sjeveru da bi doživjela ekstremne uslove poput ponoćnog sunca ili polarne noći. Depresioni ugao od 14.6° za Zoru i Jaciju se uvijek dostiže tokom cijele godine. Stoga, napredna prilagođavanja geografske širine generalno nisu pokrenuta niti potrebna po onome što sam uspio istražiti.

---

## 6. Metoda računanja kalendara 

**Opis:** Određuje metodu izračunavanja za datume hidžretskog kalendara.

### Dostupne opcije:
*   `HJCoSA` - Visoko sudsko vijeće Saudijske Arabije
*   `UAQ` - Umm al-Qura
*   `DIYANET` - Uprava za vjerske poslove (Diyanet), Turska
*   `MATHEMATICAL` - Matematički

### 🎯 Trenutno: Podrazumijevano / Nedefinisano (Koristi API podrazumijevano)
**Razlog:**  
Oslanjamo se na standardni vraćeni hidžretski datum. Međutim, budući da početak islamskih mjeseci ovisi o stvarnom viđenju mlađaka što može varirati za 1 dan, uobičajeno je da digitalne aplikacije ponekad imaju odstupanje od 1 dana u poređenju s lokalnim štampanim Takvimom. Nisam siguran da li u ovakvom slučaju ostaviti zadane postavke ili nešto mijenjati.

## 7. Dodatno pitanje

Da li bi bilo korisno uvesti 3 vremena kada je zabranjeno ili pokuđeno klanjati nafile u aplikaciju ?

Istraživanjem sa došao do ovih informacija:

1. Od izlaska sunca do njegovog potpunog izlaska

To je otprilike 15–20 minuta nakon izlaska sunca
Ne klanja se dok sunce ne “odskoči” iznad horizonta

2. Kada je sunce u zenitu (tačno na sredini neba)

Kratko vrijeme prije podne (prije podne podne namaza)
Traje samo nekoliko minuta

3. Od nakon ikindije do zalaska sunca

Nakon ikindije (Asr) pa sve dok sunce ne zađe
Posebno pred sam zalazak (kad sunce požuti)

Nemam puno znanja o ovome pa bi volio dobiti precinzije i provjerene informacije vezano za ovo, i savjet da li tako nešto uvesti u vaktiju ?

## 8. Dodatno pitanje 2

Da li bi bilo korisno dodati odabir mezheba prilikom aplikacije tako da korisnik može odabrati po kojem mezhebu želi prilagoditi vaktiju ?