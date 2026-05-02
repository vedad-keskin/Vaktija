/**
 * English language labels.
 */
import { AppLabels } from './bs';

export const EN_LABELS: AppLabels = {
  /** Header */
  appTitle: 'Vaktija',

  /** Countdown */
  countdownHours: 'hrs',
  countdownMinutes: 'min',
  countdownSeconds: 'sec',
  countdownLabelSuffix: 'IN',

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
    Fajr:
      'True dawn (ar. fecr sadik) begins with the appearance of a clear, horizontal light spreading across the entire horizon.\n\n' +
      'It marks the beginning of Fajr time and is distinguished from false dawn (ar. fecr kazib) — a brief, vertical column of light that quickly fades and appears slightly earlier.\n\n',
    Midnight:
      'Midnight is calculated as the midpoint between Maghrib (sunset) and true dawn (Fajr).\n\n' +
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
