/**
 * Maps vakat array indices from the vaktija.ba API to Bosnian prayer names.
 * API returns: [Zora, Izlazak sunca, Podne, Ikindija, Akšam, Jacija]
 */
export const PRAYER_NAMES: readonly string[] = [
  'Zora',
  'Izlazak sunca',
  'Podne',
  'Ikindija',
  'Akšam',
  'Jacija',
] as const;

/**
 * Names for the two calculated prayer-related times.
 */
export const CALCULATED_NAMES = {
  ZADNJA_TRECINA_NOCI: 'Zadnja trećina noći',
  KRAJ_JACIJE: 'Kraj jacije',
} as const;
