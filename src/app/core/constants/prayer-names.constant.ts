
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
 * Bosnian names for Hijri months.
 */
export const HIJRI_MONTHS: readonly string[] = [
  'Muharrem', 'Safer', "Rebi'u-l-evvel", "Rebi'u-l-ahir",
  "Džumade-l-ula", "Džumade-l-ahira", 'Redžeb', "Ša'ban",
  'Ramazan', 'Ševval', "Zu-l-ka'de", "Zu-l-hidždže",
] as const;
