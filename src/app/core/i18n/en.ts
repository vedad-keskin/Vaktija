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
    'The 14.6° method uses the solar depression angle of 14.6° below the horizon to determine the beginning of dawn.\n\n' +
    'Hadith sources relate that Fajr begins with the appearance of true dawn — light spreading horizontally in the east, becoming visible on the horizon and gradually illuminating the surroundings.\n\n' +
    'This angle rests on contemporary research and observation suggesting that this phenomenon often occurs later than with 18° calculations, so values around 14–15° give a more precise Fajr start for regions such as Bosnia and Herzegovina.',

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
      'Seeking forgiveness (istighfar) in the last third of the night is especially highlighted in the Qur\u2019an.',
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

  qiblaPageDocTitle: 'Qibla compass — Vaktija',
  qiblaTileTitle: 'Qibla compass',
  qiblaTileSubtitle: 'Direction to the Kaaba in Makkah',
  qiblaBackToTimes: 'Back to prayer times',
  qiblaSectionTitle: 'Qibla',
  qiblaSectionSubtitle:
    'Align the marker with the top of your phone, then turn slowly until you are facing the Qibla.',
  qiblaLocationPreset: 'City from list',
  qiblaLocationGps: 'My location',
  qiblaGpsPending: 'Getting your location…',
  qiblaGpsError: 'Could not get location. Check permissions and GPS.',
  qiblaGpsDenied: 'Location was denied. Enable it in your browser settings.',
  qiblaEnableCompass: 'Enable compass',
  qiblaCompassListening: 'Compass active',
  qiblaUnsupported:
    'This device or browser does not support compass orientation. Try a phone with Chrome or Safari.',
  qiblaPermissionDenied: 'Orientation access was denied. Allow motion sensors in settings.',
  qiblaNoEventsHint: 'No compass signal yet. Move in a small figure-eight.',
  qiblaCalibrationHint: 'Keep away from metal or magnets for a steadier reading.',
  qiblaBearingLabel: 'Bearing',
  qiblaDistanceLabel: 'Distance',
  qiblaKaabaCaption: 'The Kaaba',
  qiblaFaceKaabaHint: 'When the top marker points ahead, you are facing the Qibla.',

  qiblaCalibrateTitle: 'Calibrate Your Compass',
  qiblaCalibrateBody: 'Slowly move your phone in a figure-eight pattern to improve compass accuracy.',
  qiblaCalibrateSkip: 'Skip',
  qiblaCalibrateDone: 'Done',

  qiblaFaqTitle: 'Frequently Asked Questions',
  qiblaFaq: [
    {
      q: 'Why does my compass need calibration?',
      a: 'Digital compasses rely on your device\'s built-in magnetometer, which is highly sensitive to magnetic interference. Device calibration is used for refreshing the device compass to show correct directions.',
    },
    {
      q: 'Why does the Qibla finder require my location?',
      a: 'The Qibla bearing is uniquely tied to your exact physical location. The tool requires temporary access to your device\'s GPS solely to calculate the precise mathematical angle between your current coordinates and the Kaaba. This location data is processed locally in your browser and is not stored or tracked.',
    },
    {
      q: 'How accurate is this Qibla Finder?',
      a: 'Our digital Qibla Finder uses the industry-standard Karney\'s method, providing professional-grade accuracy for Qibla direction. The provided precision is more than sufficient for prayer direction and matches the accuracy used by major Islamic standards worldwide.',
    },
    {
      q: 'How accurate is this digital compass?',
      a: 'Our compass achieves ±0.5° accuracy when properly calibrated. We combine 3-axis magnetometer data with real-time WMM declination models for precision unmatched by physical compasses.',
    },
    {
      q: 'What is the most accurate way to find the Qibla direction online?',
      a: 'The most accurate method is using a GPS-enabled digital Qibla Finder compass. By accessing your device\'s exact geolocation coordinates, the tool calculates the precise shortest distance (the Great Circle route using Karney\'s method) to the Kaaba in Makkah, ensuring professional-grade accuracy.',
    },
    {
      q: 'What if I pray slightly off the Qibla direction?',
      a: 'The classical scholars distinguish between someone who makes a genuine effort to determine the Qibla and someone who is careless. If you make a sincere effort, your prayer is valid even if there is a small degree of error. The obligation is to make a reasonable effort.',
    },
  ],
};
