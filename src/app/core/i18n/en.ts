/**
 * English language labels.
 */
import { AppLabels } from './bs';

export const EN_LABELS: AppLabels = {
  /** Header */
  appTitle: 'Vaktija',
  themeDay: 'Day',
  themeNight: 'Night',
  themeGroupLabel: 'Day or night',

  methodGroupLabel: 'Calculation method',
  method146Label: '14.6°',
  methodIzLabel: 'IZ',

  method146Tooltip:
    'Astronomical times from the Aladhan API using a custom method: the Sun is 14.6° below the horizon for Fajr (dawn) and for Isha.\n\n' +
    'That angle is commonly associated with true dawn (fecr sadik). Widespread 18° presets match astronomical twilight and usually give an earlier Fajr; in Islamic jurisprudence they are often distinguished from true dawn and linked to false dawn (fecr kazib).\n\n' +
    'For Bosnia-Herzegovina and similar mid-latitudes this aligns with public calculators such as vaktija.dev. Other settings here include the shar‘i midpoint for “midnight” and standard Shafi Asr.',

  methodIzTooltip:
    'Official prayer times published by the Islamic Community in Bosnia and Herzegovina (Islamska zajednica u BiH)',

  method146HelpAria: 'Explain the 14.6° method',
  methodIzHelpAria: 'Explain IZ (Islamic Community) times',

  /** Countdown */
  countdownHours: 'hrs',
  countdownMinutes: 'min',
  countdownSeconds: 'sec',
  countdownLabelSuffix: 'IN',
  countdownProgressAria: 'Elapsed share of the current prayer-time window until the next prayer',

  dhuhrFridayName: "Jumu'ah",

  /** Loading / Error */
  loading: 'Loading...',
  errorGeneric: 'Failed to load. Please try again.',

  /** Prayer names (keyed by Aladhan API key) */
  prayerNames: {
    Fajr: 'Fajr (Dawn)',
    Sunrise: 'Sunrise',
    Dhuhr: 'Dhuhr',
    Asr: 'Asr',
    Maghrib: 'Maghrib',
    Isha: 'Isha',
    Midnight: 'Midnight',
    Lastthird: 'Last Third',
  },

  /** Prayer tooltips (keyed by Aladhan API key) */
  prayerTooltips: {
    Midnight:
      'Midnight is calculated as the midpoint between Maghrib (sunset) and dawn (Fajr).\n\n' +
      'The time for Isha prayer ends at midnight. ' +
      'In cases of necessity, Isha may be performed up until the break of dawn (Fajr).',
    Lastthird:
      'Abu Hurayrah (may Allah be pleased with him) reported that the Messenger of Allah (peace be upon him) said:\n\n' +
      '"Our Lord descends every night to the lowest heaven when the last third of the night remains, and He says:\n' +
      "'Who calls upon Me that I may answer him?\n" +
      "Who asks of Me that I may give him?\n" +
      "Who seeks My forgiveness that I may forgive him?'\n" +
      '— and this continues until dawn."\n\n' +
      'Narrated by Bukhari and Muslim.',
  },

  /** Hijri months */
  hijriMonths: [
    'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
    'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', "Sha'ban",
    'Ramadan', 'Shawwal', "Dhul Qa'dah", 'Dhul Hijjah',
  ],

  /** Gregorian day names */
  dayNames: [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday',
  ],

  /** Gregorian month names */
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],

  /** Relative time */
  relativeNow: 'now',
  relativePast: 'ago',
  relativeFuture: 'in',
  hrSingular: 'hour',
  hrFew: 'hours',
  hrPlural: 'hours',
  minSingular: 'minute',
  minFew: 'minutes',
  minPlural: 'minutes',
};
