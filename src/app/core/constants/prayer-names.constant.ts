
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
  'Polovina noći':
    'Polovina noći se računa kao polovina vremena između akšama (zalaska sunca) i prave zore (sabaha).\n\n' +
    'Vrijeme jacijskog namaza završava završetkom polovine noći. ' +
    'Ako bi čovjek bio u nuždi i potrebi, može jaciju klanjati sve do nastupanja zore, tj. sabah-namaza.',
  'Zadnja trećina':
    'Zadnja trećina noći ima posebno mjesto u islamu jer se smatra jednim od najvrijednijih vremena za ibadet i dovu.\n\n' +
    'To je vrijeme kada je čovjek najbliži Allahu, jer se u vjerodostojnim predajama navodi da se Allahova milost tada posebno spušta i da se dove primaju.\n\n' +
    'Dova u ovom periodu ima veliku vrijednost – vjernik može tražiti oprost, pomoć i bilo kakvu potrebu.\n\n' +
    'To je vrijeme za noćni namaz (tahadžud) koji je među najvrjednijim dobrovoljnim ibadetima.\n\n' +
    'U tom periodu iskrenost dolazi do izražaja, jer se čovjek budi dok drugi spavaju, bez želje za pokazivanjem.\n\n' +
    'Traženje oprosta (istigfar) u zadnjoj trećini noći posebno se ističe u Kur’anu.',
} as const;

/**
 * Bosnian names for Hijri months.
 */
export const HIJRI_MONTHS: readonly string[] = [
  'Muharrem', 'Safer', "Rebi'u-l-evvel", "Rebi'u-l-ahir",
  "Džumade-l-ula", "Džumade-l-ahira", 'Redžeb', "Ša'ban",
  'Ramazan', 'Ševval', "Zu-l-ka'de", "Zu-l-hidždže",
] as const;
