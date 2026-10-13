/**
 * Shape of all translatable labels in the application.
 */
export interface AppLabels {
  /** Header */
  appTitle: string;
  /** Theme segmented switch (paired with language control style) */
  themeDay: string;
  themeNight: string;
  themeGroupLabel: string;

  /** Method switcher */
  methodGroupLabel: string;
  method146Label: string;
  methodIzLabel: string;
  /** Long help shown next to method switcher (tap "i") */
  method146Tooltip: string;
  methodIzTooltip: string;
  method146HelpAria: string;
  methodIzHelpAria: string;

  /** Countdown */
  countdownHours: string;
  countdownMinutes: string;
  countdownSeconds: string;
  /** Shown after the next-prayer name in the countdown header */
  countdownLabelSuffix: string;
  /** aria-label for linear progress under countdown (same window as current-prayer ring) */
  countdownProgressAria: string;
  nextTime: string;
  nextBadge: string;
  currentBadge: string;
  changeLocation: string;
  selectCity: string;
  searchCity: string;
  noCities: string;

  /** Loading / Error */
  loading: string;
  /** Short line under loading title */
  loadingSubtitle: string;
  /** Empty/error panel headline */
  errorTitle: string;
  /** Supporting line under error body */
  errorHint: string;
  errorGeneric: string;
  /** Retry button label */
  retryAction: string;

  /** Prayer names (keyed by Aladhan API key) */
  prayerNames: Record<string, string>;

  /** Dhuhr (noon prayer) on Gregorian Fridays */
  dhuhrFridayName: string;

  /** Hijri months */
  hijriMonths: string[];

  /** Gregorian day names */
  dayNames: string[];

  /** Gregorian month names */
  monthNames: string[];

  /** Relative time */
  relativeNow: string;
  relativePast: string;
  relativeFuture: string;
  hrSingular: string;
  hrFew: string;
  hrPlural: string;
  minSingular: string;
  minFew: string;
  minPlural: string;

  /** Qibla compass */
  qiblaPageDocTitle: string;
  qiblaTileTitle: string;
  qiblaTileSubtitle: string;
  qiblaBackToTimes: string;
  qiblaSectionTitle: string;
  qiblaLocationPreset: string;
  qiblaLocationGps: string;
  qiblaLocationLabel: string;
  qiblaUseCity: string;
  qiblaCompassIdle: string;
  qiblaCompassWaiting: string;
  qiblaHoldFlat: string;
  qiblaUncalibrated: string;
  qiblaNorthUnavailable: string;
  qiblaDirectionUnavailable: string;
  qiblaAlignedLabel: string;
  qiblaRecalibrate: string;
  qiblaGpsPending: string;
  qiblaGpsError: string;
  qiblaGpsDenied: string;
  qiblaEnableCompass: string;
  qiblaCompassListening: string;
  qiblaUnsupported: string;
  qiblaPermissionDenied: string;
  qiblaNoEventsHint: string;
  qiblaCalibrationHint: string;
  qiblaBearingLabel: string;
  qiblaDistanceLabel: string;
  qiblaKaabaCaption: string;
  qiblaFaceKaabaHint: string;
  /** Calibration overlay */
  qiblaCalibrateTitle: string;
  qiblaCalibrateBody: string;
  qiblaCalibrateSkip: string;
  qiblaCalibrateDone: string;
  /** FAQ */
  qiblaFaqTitle: string;
  qiblaFaq: Array<{ q: string; a: string }>;
}

/**
 * Bosnian language labels — default language.
 */
export const BS_LABELS: AppLabels = {
  appTitle: 'Vaktija',
  themeDay: 'Dan',
  themeNight: 'Noć',
  themeGroupLabel: 'Dan ili noć',

  methodGroupLabel: 'Metoda proračuna',
  method146Label: '14.6°',
  methodIzLabel: 'IZ',

  method146Tooltip:
    'Metod 14,6° koristi ugao pri kojem se Sunce nalazi 14,6° ispod horizonta za određivanje početka zore.\n\n' +
    'U hadisima se navodi da sabah-namaz počinje pojavom stvarne zore – svjetlosti koja se širi vodoravno na istoku, postaje vidljiva na horizontu i postepeno osvjetljava okolinu.\n\n' +
    'Ovaj ugao temelji se na savremenim istraživanjima i opažanjima koja pokazuju da se ta pojava često javlja kasnije nego kod proračuna s 18°, pa vrijednosti oko 14–15° daju preciznije vrijeme početka sabaha u područjima poput BiH.',

  methodIzTooltip:
    'Službena vremena namaza koja objavljuje Islamska zajednica u Bosni i Hercegovini (IZ)',

  method146HelpAria: 'Objašnjenje metode 14,6°',
  methodIzHelpAria: 'Objašnjenje IZ vremena',

  countdownHours: 'sati',
  countdownMinutes: 'min',
  countdownSeconds: 'sek',
  countdownLabelSuffix: 'ZA',
  countdownProgressAria: 'Postotak proteklog vremena u intervalu do sljedećeg namaza',
  nextTime: 'Sljedeće vrijeme',
  nextBadge: 'Sljedeće',
  currentBadge: 'Trenutno',
  changeLocation: 'Promijeni lokaciju',
  selectCity: 'Odaberi grad',
  searchCity: 'Pretraži grad…',
  noCities: 'Nema rezultata',

  dhuhrFridayName: 'Džuma',

  loading: 'Učitavanje podataka',
  loadingSubtitle: 'Dohvatamo vremena namaza za odabrani grad…',
  errorTitle: 'Nismo mogli učitati vremena',
  errorHint:
    'Provjerite internet ili pričekajte trenutak. Lokalni prikaz iz memorije dostupan je ako ste ranije uspješno učitali dan.',
  errorGeneric: 'Greška pri učitavanju. Pokušajte ponovo.',
  retryAction: 'Pokušaj ponovo',

  prayerNames: {
    Fajr: 'Zora (sabah)',
    Sunrise: 'Izlazak sunca',
    Dhuhr: 'Podne',
    Asr: 'Ikindija',
    Maghrib: 'Akšam',
    Isha: 'Jacija',
    Midnight: 'Polovina noći',
    Lastthird: 'Zadnja trećina',
  },

  hijriMonths: [
    'Muharrem',
    'Safer',
    "Rebi'u-l-evvel",
    "Rebi'u-l-ahir",
    'Džumade-l-ula',
    'Džumade-l-ahira',
    'Redžeb',
    "Ša'ban",
    'Ramazan',
    'Ševval',
    "Zu-l-ka'de",
    'Zu-l-hidždže',
  ],

  dayNames: ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota'],

  monthNames: [
    'januar',
    'februar',
    'mart',
    'april',
    'maj',
    'juni',
    'juli',
    'august',
    'septembar',
    'oktobar',
    'novembar',
    'decembar',
  ],

  relativeNow: 'sada',
  relativePast: 'prije',
  relativeFuture: 'za',
  hrSingular: 'sat',
  hrFew: 'sata',
  hrPlural: 'sati',
  minSingular: 'minutu',
  minFew: 'minute',
  minPlural: 'minuta',

  qiblaPageDocTitle: 'Kibla kompas — Vaktija',
  qiblaTileTitle: 'Kibla kompas',
  qiblaTileSubtitle: 'Smjer prema Kabi u Mekki',
  qiblaBackToTimes: 'Natrag na vremena namaza',
  qiblaSectionTitle: 'Smjer kible',
  qiblaLocationPreset: 'Grad s liste',
  qiblaLocationGps: 'Moja lokacija',
  qiblaLocationLabel: 'Lokacija za proračun',
  qiblaUseCity: 'Koristi odabrani grad',
  qiblaCompassIdle: 'Pregled smjera · kompas nije uključen',
  qiblaCompassWaiting: 'Čekam signal kompasa…',
  qiblaHoldFlat: 'Držite telefon ravnije, s ekranom prema gore.',
  qiblaUncalibrated: 'Kompas nije kalibriran. Odmaknite se od magneta i lagano nacrtajte osmicu.',
  qiblaNorthUnavailable:
    'Korekcija sjevera nije dostupna. Kompas trenutno ne može potvrditi smjer.',
  qiblaDirectionUnavailable: 'Na ovoj lokaciji nije moguće odrediti jedinstven smjer kible.',
  qiblaAlignedLabel: 'Okrenuti ste prema kibli',
  qiblaRecalibrate: 'Kalibriši ponovo',
  qiblaGpsPending: 'Određujem lokaciju…',
  qiblaGpsError: 'Nije moguće dobiti lokaciju. Provjerite dozvole i GPS.',
  qiblaGpsDenied: 'Lokacija je odbijena. Uključite je u postavkama preglednika.',
  qiblaEnableCompass: 'Pokreni kompas',
  qiblaCompassListening: 'Kompas aktivan',
  qiblaUnsupported:
    'Ovaj uređaj ili preglednik ne podržava orijentaciju (kompas). Pokušajte na mobilnom telefonu u Chromeu ili Safariju.',
  qiblaPermissionDenied: 'Pristup orijentaciji je odbijen. Dozvolite senzore u postavkama.',
  qiblaNoEventsHint:
    'Signal kompasa nije dostupan. Držite telefon ravno i provjerite dozvole za senzore.',
  qiblaCalibrationHint: 'Držite telefon podalje od metala i magneta.',
  qiblaBearingLabel: 'Azimut · pravi sjever',
  qiblaDistanceLabel: 'Udaljenost',
  qiblaKaabaCaption: 'Kaaba',
  qiblaFaceKaabaHint:
    'Držite telefon ravno, s ekranom prema gore. Okrećite se dok se oznaka Kabe ne poravna s vrhom ekrana.',

  qiblaCalibrateTitle: 'Kalibrišite kompas',
  qiblaCalibrateBody:
    'Odmaknite se od metala i magneta. Lagano pomičite telefon u obliku osmice, zatim ga držite ravno, s ekranom prema gore.',
  qiblaCalibrateSkip: 'Preskoči',
  qiblaCalibrateDone: 'Gotovo',

  qiblaFaqTitle: 'Često postavljana pitanja',
  qiblaFaq: [
    {
      q: 'Zašto je potrebna kalibracija kompasa?',
      a: 'Digitalni kompas koristi magnetometar ugrađen u vaš uređaj, koji je veoma osjetljiv na magnetne smetnje. Kalibracijom osvježavate kompas kako bi pokazivao ispravan smjer.',
    },
    {
      q: 'Kako držati telefon pri očitavanju kompasa?',
      a: 'Držite telefon približno vodoravno, s ekranom prema gore, kao klasični kompas. Poravnajte oznaku Kabe s vrhom ekrana. Blagi nagib je u redu; kada je telefon previše uspravan ili okrenut ekranom prema dolje, potvrda smjera se zaustavlja. Izbjegavajte metalne površine, punjače i maske s magnetima.',
    },
    {
      q: 'Zašto je potrebna lokacija za pronalaženje kible?',
      a: 'Smjer kible zavisi od vaše tačne fizičke lokacije. Alat privremeno pristupa GPS-u samo kako bi izračunao precizan matematički ugao između vaših koordinata i Kabe. Podaci o lokaciji obrađuju se lokalno u pregledniku i nigdje se ne pohranjuju niti prate.',
    },
    {
      q: 'Koliko je tačan ovaj kiblemetar?',
      a: 'Azimut i udaljenost računamo geodetskom metodom Karney na WGS84 elipsoidu, uz WMM korekciju magnetne deklinacije za kompas. Tačnost prikazanog smjera zavisi i od odabrane lokacije, senzora telefona i magnetnih smetnji.',
    },
    {
      q: 'Koliko je tačan digitalni kompas?',
      a: 'Ne garantujemo fiksnu tačnost kompasa. Ona zavisi od senzora, kalibracije i okruženja. Mirna oznaka ne dokazuje tačnost. Korekcija deklinacije pretvara magnetni u pravi sjever; zeleno poravnanje označava toleranciju prikaza, a ne izmjerenu preciznost senzora.',
    },
    {
      q: 'Koji je najtačniji način za pronalaženje kible putem interneta?',
      a: 'Za proračun koristite svoju stvarnu lokaciju. Kalibrirajte telefon i udaljite ga od magneta. Kada je moguće, provjerite smjer prema poznatom pravcu ili karti orijentisanoj prema pravom sjeveru; poređenje s drugim kompasom samo po sebi ne potvrđuje tačnost.',
    },
    {
      q: 'Šta ako klanjam sa malim odstupanjem od smjera kible?',
      a: 'Islamski učenjaci razlikuju osobu koja ulaže iskren trud da odredi smjer kible od osobe koja je nemarna. Ako uložite iskren trud, vaš namaz je ispravan čak i uz mali stepen greške. Obaveza je uložiti razuman trud.',
    },
  ],
};
