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
  methodIntroTitle: string;
  methodIntroDescription: string;
  methodIntroConfirm: string;
  methodIntroLater: string;
  method146Summary: string;
  methodIzSummary: string;

  /** Countdown */
  countdownHours: string;
  countdownMinutes: string;
  countdownSeconds: string;
  /** Shown after the next-prayer name in the countdown header */
  countdownLabelSuffix: string;
  /** aria-label for linear progress under countdown (same window as current-prayer ring) */
  countdownProgressAria: string;
  enterFullscreen: string;
  exitFullscreen: string;
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

  /** Duas */
  duasTitle: string;
  duasSubtitle: string;
  duasDocTitle: string;
  duasCollectionLabel: string;
  duasAll: string;
  duasSaved: string;
  duasSave: string;
  duasUnsave: string;
  duasEmptyTitle: string;
  duasEmptyBody: string;
  duasBrowse: string;
  duasSearch: string;
  duasSearchAll: string;
  duasCategories: string;
  duasClearSearch: string;
  duasResults: string;
  duasNoResultsTitle: string;
  duasNoResultsBody: string;
  showMore: string;
  duasStorageError: string;
  duasTranscription: string;
  duasInstructions: string;
  duasTranslation: string;
  duasSource: string;

  /** Dhikr */
  dhikrTitle: string;
  dhikrSubtitle: string;
  dhikrDocTitle: string;
  dhikrCollectionLabel: string;
  dhikrAll: string;
  dhikrSaved: string;
  dhikrSave: string;
  dhikrUnsave: string;
  dhikrEmptyTitle: string;
  dhikrEmptyBody: string;
  dhikrBrowse: string;
  dhikrSearch: string;
  dhikrSearchAll: string;

  /** Qibla compass */
  qiblaPageDocTitle: string;
  qiblaTileTitle: string;
  qiblaNavTitle: string;
  qiblaTileSubtitle: string;
  qiblaBackToTimes: string;
  qiblaSectionTitle: string;
  qiblaLocationPreset: string;
  qiblaLocationGps: string;
  qiblaLocationLabel: string;
  qiblaUseCity: string;
  qiblaCompassIdle: string;
  qiblaStartHint: string;
  qiblaCompassWaiting: string;
  qiblaWaitingHint: string;
  qiblaHoldFlat: string;
  qiblaHoldFlatHint: string;
  qiblaTurnLeft: string;
  qiblaTurnRight: string;
  qiblaUncalibrated: string;
  qiblaDirectionUnavailable: string;
  qiblaDirectionUnavailableHint: string;
  qiblaAlignedLabel: string;
  qiblaAlignedHint: string;
  qiblaRecalibrate: string;
  qiblaGpsPending: string;
  qiblaGpsError: string;
  qiblaGpsDenied: string;
  qiblaEnableCompass: string;
  qiblaUnsupported: string;
  qiblaUseBearing: string;
  qiblaChooseLocation: string;
  qiblaPermissionDenied: string;
  qiblaPermissionHint: string;
  qiblaNoReading: string;
  qiblaNoEventsHint: string;
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
  method146Label: 'Metoda ugla 14,6°',
  methodIzLabel: 'Islamska zajednica',

  method146Tooltip:
    'Metod 14,6° koristi ugao pri kojem se Sunce nalazi 14,6° ispod horizonta za određivanje početka zore.\n\n' +
    'U hadisima se navodi da sabah-namaz počinje pojavom stvarne zore – svjetlosti koja se širi vodoravno na istoku, postaje vidljiva na horizontu i postepeno osvjetljava okolinu.\n\n' +
    'Ovaj ugao temelji se na savremenim istraživanjima i opažanjima koja pokazuju da se ta pojava često javlja kasnije nego kod proračuna s 18°, pa vrijednosti oko 14–15° daju preciznije vrijeme početka sabaha u područjima poput BiH.',

  methodIzTooltip:
    'Službena vremena namaza koja objavljuje Islamska zajednica u Bosni i Hercegovini (IZ)',

  method146HelpAria: 'Objašnjenje metode 14,6°',
  methodIzHelpAria: 'Objašnjenje IZ vremena',
  methodIntroTitle: 'Metoda računanja',
  methodIntroDescription: 'Odaberite kako će se izračunavati namaska vremena.',
  methodIntroConfirm: 'Potvrdi izbor',
  methodIntroLater: 'Izbor možete promijeniti kasnije.',
  method146Summary: 'Koristi ugao od 14,6° za računanje sabaha i jacije.',
  methodIzSummary: 'Prati vaktiju Islamske zajednice u Bosni i Hercegovini.',

  countdownHours: 'sati',
  countdownMinutes: 'min',
  countdownSeconds: 'sek',
  countdownLabelSuffix: 'ZA',
  countdownProgressAria: 'Postotak proteklog vremena u intervalu do sljedećeg namaza',
  enterFullscreen: 'Cijeli ekran',
  exitFullscreen: 'Izađi iz cijelog ekrana',
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

  duasTitle: 'Dove',
  duasSubtitle: 'Dove za svaki dan',
  duasDocTitle: 'Dove — Vaktija',
  duasCollectionLabel: 'Zbirka dova',
  duasAll: 'Sve dove',
  duasSaved: 'Sačuvane',
  duasSave: 'Sačuvaj dovu',
  duasUnsave: 'Ukloni iz sačuvanih',
  duasEmptyTitle: 'Vaše dove, na jednom mjestu',
  duasEmptyBody: 'Dodirnite oznaku na kartici da sačuvate dovu za kasnije na ovom uređaju.',
  duasBrowse: 'Pogledaj sve dove',
  duasSearch: 'Pretraži dove…',
  duasSearchAll: 'Pretraži sve dove',
  duasCategories: 'Kategorije',
  duasClearSearch: 'Obriši pretragu',
  duasResults: 'Rezultati',
  duasNoResultsTitle: 'Nema rezultata za ovu pretragu',
  duasNoResultsBody: 'Pokušajte s drugim riječima ili obrišite pretragu.',
  showMore: 'Prikaži još',
  duasStorageError:
    'Promjena vrijedi samo na ovoj stranici. Preglednik je nije mogao trajno sačuvati.',
  duasTranscription: 'Transkripcija',
  duasInstructions: 'Uputa',
  duasTranslation: 'Prijevod značenja',
  duasSource: 'Izvor',

  dhikrTitle: 'Zikrovi',
  dhikrSubtitle: 'Zikr za svaki dan',
  dhikrDocTitle: 'Zikrovi — Vaktija',
  dhikrCollectionLabel: 'Zbirka zikrova',
  dhikrAll: 'Svi zikrovi',
  dhikrSaved: 'Sačuvani',
  dhikrSave: 'Sačuvaj zikr',
  dhikrUnsave: 'Ukloni iz sačuvanih',
  dhikrEmptyTitle: 'Vaši zikrovi, na jednom mjestu',
  dhikrEmptyBody: 'Dodirnite oznaku na kartici da sačuvate zikr za kasnije na ovom uređaju.',
  dhikrBrowse: 'Pogledaj sve zikrove',
  dhikrSearch: 'Pretraži zikrove…',
  dhikrSearchAll: 'Pretraži sve zikrove',

  qiblaPageDocTitle: 'Kibla kompas — Vaktija',
  qiblaTileTitle: 'Kibla kompas',
  qiblaNavTitle: 'Kibla',
  qiblaTileSubtitle: 'Smjer prema Kabi u Mekki',
  qiblaBackToTimes: 'Natrag na vremena namaza',
  qiblaSectionTitle: 'Smjer kible',
  qiblaLocationPreset: 'Grad s liste',
  qiblaLocationGps: 'Moja lokacija',
  qiblaLocationLabel: 'Lokacija za proračun',
  qiblaUseCity: 'Koristi odabrani grad',
  qiblaCompassIdle: 'Pokrenite i kalibrišite kompas',
  qiblaStartHint:
    'Držite telefon gotovo vodoravno, s ekranom prema gore, i okrenite se prema oznaci Kabe.',
  qiblaCompassWaiting: 'Čekamo signal kompasa',
  qiblaWaitingHint: 'Držite telefon mirno, gotovo vodoravno, s ekranom prema gore.',
  qiblaHoldFlat: 'Neispravna pozicija',
  qiblaHoldFlatHint: 'Držite telefon gotovo vodoravno, s ekranom prema gore.',
  qiblaTurnLeft: 'Okrenite se ulijevo',
  qiblaTurnRight: 'Okrenite se udesno',
  qiblaUncalibrated: 'Odmaknite se od metala i magneta pa telefonom napravite osmicu.',
  qiblaDirectionUnavailable: 'Smjer kible nije dostupan',
  qiblaDirectionUnavailableHint: 'Za ovu lokaciju nije moguće odrediti jedinstven smjer kible.',
  qiblaAlignedLabel: 'Okrenuti ste prema kibli',
  qiblaAlignedHint: 'Za namaz slijedite smjer koji pokazuje vrh telefona.',
  qiblaRecalibrate: 'Kalibrišite ponovo',
  qiblaGpsPending: 'Određujem lokaciju…',
  qiblaGpsError: 'Nije moguće dobiti lokaciju. Provjerite dozvole i GPS.',
  qiblaGpsDenied: 'Lokacija je odbijena. Uključite je u postavkama preglednika.',
  qiblaEnableCompass: 'Pokreni kompas',
  qiblaUnsupported: 'Kompas nije dostupan',
  qiblaUseBearing: 'Smjer odredite pomoću prikazanog ugla od pravog sjevera.',
  qiblaChooseLocation: 'Odaberite grad ili koristite svoju lokaciju za izračun smjera.',
  qiblaPermissionDenied: 'Pristup kompasu je odbijen',
  qiblaPermissionHint: 'Dozvolite pristup senzorima pokreta u postavkama preglednika.',
  qiblaNoReading: 'Nema signala kompasa',
  qiblaNoEventsHint: 'Držite telefon gotovo vodoravno ili dodirnite kalibrišite ponovo.',
  qiblaBearingLabel: 'Pravi sjever',
  qiblaDistanceLabel: 'Udaljenost',
  qiblaKaabaCaption: 'Kaaba',
  qiblaFaceKaabaHint: 'Pratite oznaku Kabe dok se ne poravna s vrhom kompasa.',

  qiblaCalibrateTitle: 'Kalibrišite kompas',
  qiblaCalibrateBody:
    'Odmaknite se od metala i magneta. Lagano pomičite telefon u obliku osmice, zatim ga držite ravno, s ekranom prema gore.',
  qiblaCalibrateSkip: 'Preskoči',
  qiblaCalibrateDone: 'Gotovo',

  qiblaFaqTitle: 'Pomoć za kiblu',
  qiblaFaq: [
    {
      q: 'Moram li uključiti lokaciju?',
      a: 'Za odabrani grad smjer se prikazuje bez dozvole za lokaciju. Ako ste izvan tog grada, odaberite „Moja lokacija“ i dozvolite pregledniku da koristi vašu trenutnu lokaciju. Proračun se obavlja u pregledniku bez pohrane koordinata.',
    },
    {
      q: 'Šta ako je kompas nestabilan ili se oznaka ne poravnava?',
      a: 'Odmaknite se od metala i magneta pa držite telefon ravno, s ekranom prema gore. Ako je očitanje i dalje nestabilno, dodirnite „Kalibrišite ponovo“ i pratite upute.',
    },
    {
      q: 'Šta znači zelena oznaka?',
      a: 'Oznaka postane zelena kada se smjer telefona razlikuje od izračunatog smjera kible za svega nekoliko stepeni. Tačnost očitanja zavisi od senzora telefona i okruženja.',
    },
    {
      q: 'Šta ako klanjam sa malim odstupanjem od smjera kible?',
      a: 'Islamski učenjaci razlikuju osobu koja ulaže iskren trud da odredi smjer kible od osobe koja je nemarna. Ako uložite iskren trud, vaš namaz je ispravan čak i uz mali stepen greške. Obaveza je uložiti razuman trud.',
    },
  ],
};
