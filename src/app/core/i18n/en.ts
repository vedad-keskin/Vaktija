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
  method146Label: '14.6° Angle Method',
  methodIzLabel: 'Islamic Community',

  method146Tooltip:
    'The 14.6° method uses the solar depression angle of 14.6° below the horizon to determine the beginning of dawn.\n\n' +
    'Hadith sources relate that Fajr begins with the appearance of true dawn — light spreading horizontally in the east, becoming visible on the horizon and gradually illuminating the surroundings.\n\n' +
    'This angle rests on contemporary research and observation suggesting that this phenomenon often occurs later than with 18° calculations, so values around 14–15° give a more precise Fajr start for regions such as Bosnia and Herzegovina.',

  methodIzTooltip:
    'Official prayer times published by the Islamic Community in Bosnia and Herzegovina (Islamska zajednica u BiH)',

  method146HelpAria: 'Explain the 14.6° method',
  methodIzHelpAria: 'Explain IZ (Islamic Community) times',
  methodIntroTitle: 'Prayer Time Method',
  methodIntroDescription: 'Choose how your prayer times are calculated.',
  methodIntroConfirm: 'Confirm selection',
  methodIntroLater: 'You can change this later.',
  method146Summary: 'Uses a 14.6° angle to calculate Fajr and Isha.',
  methodIzSummary: 'Follows the prayer timetable for Bosnia and Herzegovina.',

  /** Countdown */
  countdownHours: 'hrs',
  countdownMinutes: 'min',
  countdownSeconds: 'sec',
  countdownLabelSuffix: 'IN',
  countdownProgressAria: 'Elapsed share of the current prayer-time window until the next prayer',
  enterFullscreen: 'Fullscreen',
  exitFullscreen: 'Exit fullscreen',
  nextTime: 'Up next',
  nextBadge: 'Next',
  currentBadge: 'Current',
  changeLocation: 'Change location',
  selectCity: 'Select a city',
  searchCity: 'Search cities…',
  noCities: 'No results',

  dhuhrFridayName: "Jumu'ah",

  /** Loading / Error */
  loading: 'Fetching schedule',
  loadingSubtitle: 'Loading prayer times for your selected city…',
  errorTitle: 'Could not load prayer times',
  errorHint:
    "Check your connection or wait a moment. Local memory times are available if you loaded today's times successfully before.",
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

  /** Hijri months */
  hijriMonths: [
    'Muharram',
    'Safar',
    "Rabi' al-Awwal",
    "Rabi' al-Thani",
    'Jumada al-Ula',
    'Jumada al-Thani',
    'Rajab',
    "Sha'ban",
    'Ramadan',
    'Shawwal',
    "Dhul Qa'dah",
    'Dhul Hijjah',
  ],

  /** Gregorian day names */
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

  /** Gregorian month names */
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
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

  duasTitle: 'Duas',
  duasSubtitle: 'Supplications for every day',
  duasDocTitle: 'Duas — Vaktija',
  duasCollectionLabel: 'Dua collection',
  duasAll: 'All duas',
  duasSaved: 'Saved',
  duasSave: 'Save dua',
  duasUnsave: 'Remove from saved',
  duasEmptyTitle: 'Your duas, together',
  duasEmptyBody: 'Tap the bookmark on a card to keep a dua for later on this device.',
  duasBrowse: 'Browse all duas',
  duasSearch: 'Search duas…',
  duasSearchAll: 'Search all duas',
  duasCategories: 'Categories',
  duasClearSearch: 'Clear search',
  duasResults: 'Results',
  duasNoResultsTitle: 'No results for this search',
  duasNoResultsBody: 'Try different words or clear the search.',
  showMore: 'Show more',
  duasStorageError:
    'This change applies to this page only. Your browser could not save it permanently.',
  duasTranscription: 'Transliteration',
  duasInstructions: 'Instruction',
  duasTranslation: 'Translation of the meaning',
  duasSource: 'Source',

  dhikrTitle: 'Dhikr',
  dhikrSubtitle: 'Remembrance for every day',
  dhikrDocTitle: 'Dhikr — Vaktija',
  dhikrCollectionLabel: 'Dhikr collection',
  dhikrAll: 'All dhikr',
  dhikrSaved: 'Saved',
  dhikrSave: 'Save dhikr',
  dhikrUnsave: 'Remove from saved',
  dhikrEmptyTitle: 'Your dhikr, together',
  dhikrEmptyBody: 'Tap the bookmark on a card to keep a remembrance for later on this device.',
  dhikrBrowse: 'Browse all dhikr',
  dhikrSearch: 'Search dhikr…',
  dhikrSearchAll: 'Search all dhikr',

  qiblaPageDocTitle: 'Qibla compass — Vaktija',
  qiblaTileTitle: 'Qibla compass',
  qiblaNavTitle: 'Qibla',
  qiblaTileSubtitle: 'Direction to the Kaaba in Makkah',
  qiblaBackToTimes: 'Back to prayer times',
  qiblaSectionTitle: 'Qibla direction',
  qiblaLocationPreset: 'City from list',
  qiblaLocationGps: 'My location',
  qiblaLocationLabel: 'Location for calculation',
  qiblaUseCity: 'Use selected city',
  qiblaCompassIdle: 'Direction preview · compass is off',
  qiblaCompassWaiting: 'Waiting for a compass reading…',
  qiblaHoldFlat: 'Hold your phone flatter, with the screen facing up.',
  qiblaUncalibrated:
    'Compass is uncalibrated. Move away from magnets and make a gentle figure-eight.',
  qiblaNorthUnavailable:
    'North correction is unavailable. The compass cannot confirm direction right now.',
  qiblaDirectionUnavailable: 'A unique Qibla direction cannot be determined at this location.',
  qiblaAlignedLabel: 'You are facing the Qibla',
  qiblaRecalibrate: 'Calibrate again',
  qiblaGpsPending: 'Getting your location…',
  qiblaGpsError: 'Could not get location. Check permissions and GPS.',
  qiblaGpsDenied: 'Location was denied. Enable it in your browser settings.',
  qiblaEnableCompass: 'Start compass',
  qiblaCompassListening: 'Compass active',
  qiblaUnsupported:
    'This device or browser does not support compass orientation. Try a phone with Chrome or Safari.',
  qiblaPermissionDenied: 'Orientation access was denied. Allow motion sensors in settings.',
  qiblaNoEventsHint:
    'Compass signal unavailable. Hold your phone flat and check sensor permissions.',
  qiblaCalibrationHint: 'Keep away from metal or magnets for a steadier reading.',
  qiblaBearingLabel: 'Bearing · true north',
  qiblaDistanceLabel: 'Distance',
  qiblaKaabaCaption: 'The Kaaba',
  qiblaFaceKaabaHint:
    'Hold your phone flat, screen facing up. Turn until the Kaaba marker aligns with the top of the screen.',

  qiblaCalibrateTitle: 'Calibrate Your Compass',
  qiblaCalibrateBody:
    'Move away from metal and magnets. Gently move your phone in a figure-eight, then hold it flat with the screen facing up.',
  qiblaCalibrateSkip: 'Skip',
  qiblaCalibrateDone: 'Done',

  qiblaFaqTitle: 'Qibla help',
  qiblaFaq: [
    {
      q: 'Do I need to enable location?',
      a: 'You can use the selected city without granting location access. If you’re away from that city, choose My location and allow your browser to use your current position. Your browser calculates the direction without saving your coordinates.',
    },
    {
      q: 'What if the compass jumps or won’t align?',
      a: 'Move away from metal or magnets and hold your phone flat with the screen facing up. If the reading is still unstable, tap Calibrate again and follow the guide.',
    },
    {
      q: 'What does the green checkmark mean?',
      a: 'The checkmark appears when you’re within a few degrees of the calculated direction. The reading depends on your phone’s sensors and surroundings.',
    },
    {
      q: 'What if I pray slightly off the Qibla direction?',
      a: 'The classical scholars distinguish between someone who makes a genuine effort to determine the Qibla and someone who is careless. If you make a sincere effort, your prayer is valid even if there is a small degree of error. The obligation is to make a reasonable effort.',
    },
  ],
};
