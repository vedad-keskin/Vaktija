/**
 * Maps aladhan.com API timing keys to Bosnian display names.
 * Order determines display order within the sorted list.
 *
 * Fajr from aladhan uses the -18° angle (MWL method) = prava zora (fecr sadik).
 * Midnight uses midnightMode=1 (Jafari) = mid Sunset→Fajr = šerijatska polovina noći.
 * Lastthird = start of the last third of the night (Sunset→Fajr).
 */
export const TIMING_DISPLAY_MAP: {
  key: string;
  name: string;
  isCalculated: boolean;
}[] = [
    { key: 'Fajr', name: 'Zora (sabah)', isCalculated: false },
    { key: 'Sunrise', name: 'Izlazak sunca', isCalculated: false },
    { key: 'Dhuhr', name: 'Podne', isCalculated: false },
    { key: 'Asr', name: 'Ikindija', isCalculated: false },
    { key: 'Maghrib', name: 'Akšam', isCalculated: false },
    { key: 'Isha', name: 'Jacija', isCalculated: false },
    { key: 'Midnight', name: 'Polovina noći', isCalculated: true },
    { key: 'Lastthird', name: 'Zadnja trećina', isCalculated: true },
  ];

/**
 * Tooltips for standard prayer times that require extra explanation.
 */
export const PRAYER_TOOLTIPS: Record<string, string> = {
  'Zora (sabah)':
    'Prava zora (ar. fecr sadik) nastupa pojavom jasne horizontalne svjetlosti koja se širi preko cijelog horizonta.\n\n' +
    'Ona najavljuje početak sabahskog vremena i razlikuje se od lažne zore (ar. fecr kazib) – prolaznog, vertikalnog stuba svjetlosti koji brzo nestaje i nastupa nešto ranije.\n\n',
  'Polovina noći':
    'Polovina noći se računa kao polovina vremena između akšama (zalaska sunca) i prave zore (sabaha).\n\n' +
    'Vrijeme jacijskog namaza završava završetkom polovine noći. ' +
    'Ako bi čovjek bio u nuždi i potrebi, može jaciju klanjati sve do nastupanja zore, tj. sabah-namaza.',
  'Zadnja trećina':
    'Prenosi Ebu Hurejra radijallahu anhu, da je Allahov Poslanik, sallallahu alejhi ve sellem rekao:\n\n' +
    '"Naš Uzvišeni Gospodar se spušta svake noći na najniže nebo kada ostane posljednja trećina noći, pa kaže:\n' +
    "'Ko Me doziva da mu se odazovem?\n" +
    "Ko od Mene traži da mu dam?\n" +
    "Ko od Mene traži oprost da mu oprostim?'\n" +
    '— i to traje sve dok ne nastupi zora."\n\n' +
    'Hadis bilježe Buharija i Muslim.',
} as const;

/**
 * Bosnian names for Hijri months.
 */
export const HIJRI_MONTHS: readonly string[] = [
  'Muharrem', 'Safer', "Rebi'u-l-evvel", "Rebi'u-l-ahir",
  "Džumade-l-ula", "Džumade-l-ahira", 'Redžeb', "Ša'ban",
  'Ramazan', 'Ševval', "Zu-l-ka'de", "Zu-l-hidždže",
] as const;
