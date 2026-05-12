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
  /** Long help shown next to method switcher (tap “i”) */
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

  /** Prayer tooltips (keyed by Aladhan API key) */
  prayerTooltips: Record<string, string>;

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
  qiblaSectionSubtitle: string;
  qiblaLocationPreset: string;
  qiblaLocationGps: string;
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

  prayerTooltips: {
    Midnight:
      'Polovina noći se računa kao polovina vremena između akšama (zalaska sunca) i zore (sabaha).\n\n' +
      'Vrijeme jacijskog namaza završava završetkom polovine noći. ' +
      'Ako bi čovjek bio u nuždi i potrebi, može jaciju klanjati sve do nastupanja zore, tj. sabah-namaza.',
    Lastthird:
      'Zadnja trećina noći ima posebno mjesto u islamu jer se smatra jednim od najvrijednijih vremena za ibadet i dovu.\n\n' +
      'To je vrijeme kada je čovjek najbliži Allahu, jer se u vjerodostojnim predajama navodi da se Allahova milost tada posebno spušta i da se dove primaju.\n' +
      'Dova u ovom periodu ima veliku vrijednost – vjernik može tražiti oprost, pomoć i bilo kakvu potrebu.\n' +
      'To je vrijeme za noćni namaz (tahadžud) koji je među najvrjednijim dobrovoljnim ibadetima.\n' +
      'U tom periodu iskrenost dolazi do izražaja, jer se čovjek budi dok drugi spavaju, bez želje za pokazivanjem.\n' +
      'Traženje oprosta (istigfar) u zadnjoj trećini noći posebno se ističe u Kur’anu.',
  },

  hijriMonths: [
    'Muharrem', 'Safer', "Rebi'u-l-evvel", "Rebi'u-l-ahir",
    "Džumade-l-ula", "Džumade-l-ahira", 'Redžeb', "Ša'ban",
    'Ramazan', 'Ševval', "Zu-l-ka'de", "Zu-l-hidždže",
  ],

  dayNames: [
    'nedjelja', 'ponedjeljak', 'utorak', 'srijeda',
    'četvrtak', 'petak', 'subota',
  ],

  monthNames: [
    'januar', 'februar', 'mart', 'april', 'maj', 'juni',
    'juli', 'august', 'septembar', 'oktobar', 'novembar', 'decembar',
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
  qiblaSectionTitle: 'Kibla',
  qiblaSectionSubtitle: 'Poravnajte strelicu s vrhom telefona i lagano pomičite uređaj dok se ne uklopi.',
  qiblaLocationPreset: 'Grad s liste',
  qiblaLocationGps: 'Moja lokacija',
  qiblaGpsPending: 'Određujem lokaciju…',
  qiblaGpsError: 'Nije moguće dobiti lokaciju. Provjerite dozvole i GPS.',
  qiblaGpsDenied: 'Lokacija je odbijena. Uključite je u postavkama preglednika.',
  qiblaEnableCompass: 'Uključi kompas',
  qiblaCompassListening: 'Kompas aktivan',
  qiblaUnsupported:
    'Ovaj uređaj ili preglednik ne podržava orijentaciju (kompas). Pokušajte na mobilnom telefonu u Chromeu ili Safariju.',
  qiblaPermissionDenied: 'Pristup orijentaciji je odbijen. Dozvolite senzore u postavkama.',
  qiblaNoEventsHint:
    'Nema signala kompasa. Polako zakrećite telefon u obliku osmice za kalibraciju ili pokušajte ponovo.',
  qiblaCalibrationHint: 'Držite telefon podalje od metala i magneta radi tačnijeg smjera.',
  qiblaBearingLabel: 'Azimut',
  qiblaDistanceLabel: 'Udaljenost',
  qiblaKaabaCaption: 'Kaaba',
  qiblaFaceKaabaHint: 'Kada strelica na gornjem rubu pokazuje naprijed, licem ste okrenuti prema kibli.',
};
