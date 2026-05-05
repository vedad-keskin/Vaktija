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
  loading: 'Fetching schedule',
  loadingSubtitle: 'Loading prayer times for your selected city…',
  errorTitle: 'Could not load prayer times',
  errorHint:
    'Check your connection or wait a moment. Local memory times are available if you loaded today\'s times successfully before.',
  errorGeneric: 'Failed to load. Please try again.',
  retryAction: 'Try again',

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
      'The last third of the night has a special place in Islam: it is regarded as one of the most virtuous times for worship and supplication.\n\n' +
      'It is a time when a person is especially close to Allah; authentic narrations describe His mercy descending then and prayers being answered.\n' +
      'Supplication in this period carries great weight—a believer may ask forgiveness, help, and for any genuine need.\n' +
      'It is the hour of the night prayer (tahajjud), among the most rewarding voluntary acts of worship.\n' +
      'Then sincerity shows plainly: one rises while others sleep, without seeking display.\n' +
      'Seeking forgiveness (istighfar) in the last third of the night is especially highlighted in the Qur’an.',
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
