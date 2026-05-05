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
    'Matematički proračun preko Aladhan API-ja s prilagođenom metodom (custom): Sunce je 14,6° ispod horizonta za početak zore (Fajr) i za jaciju (Isha).\n\n' +
    'U praksi se takav ugao često veže uz pravu zoru (fecr sadik). Široko korišteni proračuni s 18° tipično odgovaraju astronomskom sumraku i daju raniju zoru — u islamskom pravu (fikhu) često se razlikuju od prave zore i vezuju uz lažnu zoru (fecr kazib).\n\n' +
    'Za BiH i slične geografske širine ovaj model je usporediv s javnim proračunima poput vaktija.dev. Ostale postavke u ovom modu uključuju šerijatsku polovinu noći za „polovinu noći” i šafijsku ikindiju.',

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
};
