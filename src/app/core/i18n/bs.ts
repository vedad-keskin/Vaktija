/**
 * Shape of all translatable labels in the application.
 */
export interface AppLabels {
  /** Header */
  appTitle: string;

  /** Countdown */
  countdownHours: string;
  countdownMinutes: string;
  countdownSeconds: string;
  /** Shown after the next-prayer name in the countdown header */
  countdownLabelSuffix: string;

  /** Loading / Error */
  loading: string;
  errorGeneric: string;

  /** Prayer names (keyed by Aladhan API key) */
  prayerNames: Record<string, string>;

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

  countdownHours: 'sati',
  countdownMinutes: 'min',
  countdownSeconds: 'sek',
  countdownLabelSuffix: 'ZA',

  loading: 'Učitavanje...',
  errorGeneric: 'Greška pri učitavanju. Pokušajte ponovo.',

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
    Fajr:
      'Prava zora (ar. fecr sadik) nastupa pojavom jasne horizontalne svjetlosti koja se širi preko cijelog horizonta.\n\n' +
      'Ona najavljuje početak sabahskog vremena i razlikuje se od lažne zore (ar. fecr kazib) – prolaznog, vertikalnog stuba svjetlosti koji brzo nestaje i nastupa nešto ranije.\n\n',
    Midnight:
      'Polovina noći se računa kao polovina vremena između akšama (zalaska sunca) i prave zore (sabaha).\n\n' +
      'Vrijeme jacijskog namaza završava završetkom polovine noći. ' +
      'Ako bi čovjek bio u nuždi i potrebi, može jaciju klanjati sve do nastupanja zore, tj. sabah-namaza.',
    Lastthird:
      'Prenosi Ebu Hurejra radijallahu anhu, da je Allahov Poslanik, sallallahu alejhi ve sellem rekao:\n\n' +
      '"Naš Uzvišeni Gospodar se spušta svake noći na najniže nebo kada ostane posljednja trećina noći, pa kaže:\n' +
      "'Ko Me doziva da mu se odazovem?\n" +
      "Ko od Mene traži da mu dam?\n" +
      "Ko od Mene traži oprost da mu oprostim?'\n" +
      '— i to traje sve dok ne nastupi zora."\n\n' +
      'Hadis bilježe Buharija i Muslim.',
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
