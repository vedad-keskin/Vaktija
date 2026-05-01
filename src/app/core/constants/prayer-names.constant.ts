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

export const CALCULATED_TOOLTIPS = {
  KRAJ_JACIJE:
    'Vrijeme jacijskog namaza završava završetkom polovine noći, a to je polovina između početka akšam-namaza i nastupanja sabah namaza. Ako bi čovjek bio u nuždi i potrebi, može jaciju klanjati sve do nastupanja zore, tj. sabah-namaza.',
  ZADNJA_TRECINA_NOCI:
    'Prenosi Ebu Hurejra radijallahu anhu, da je Allahov Poslanik, sallallahu alejhi ve sellem rekao:\n\n"Naš Uzvišeni Gospodar se spušta svake noći na najniže nebo kada ostane posljednja trećina noći, pa kaže:\n\'Ko Me doziva da mu se odazovem?\nKo od Mene traži da mu dam?\nKo od Mene traži oprost da mu oprostim?\'\n— i to traje sve dok ne nastupi zora."\n\nHadis bilježe Buharija i Muslim.',
} as const;
