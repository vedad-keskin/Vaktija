/**
 * Maps vakat array indices from the vaktija.ba API to Bosnian prayer names.
 * API returns: [Zora, Izlazak sunca, Podne, Ikindija, Akšam, Jacija]
 *
 * "Zora" from vaktija.ba API represents PRAVU ZORU (fecr sadik) — true dawn,
 * calculated when the Sun is approximately -18° below the horizon
 * (astronomical twilight), per the standard of the Islamic Community of BiH.
 */
export const PRAYER_NAMES: readonly string[] = [
  'Zora (sabah)',
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
  ZADNJA_TRECINA_NOCI: 'Zadnja trećina',
  KRAJ_JACIJE: 'Polovina noći',
} as const;

/**
 * Tooltips for standard prayer times that require extra explanation.
 */
export const PRAYER_TOOLTIPS: Record<string, string> = {
  'Zora (sabah)':
    'Ovo je PRAVA ZORA (ar. fecr sadik) — horizontalna svjetlost koja se širi cijelim horizontom.\n\n' +
    'Razlikuje se od LAŽNE ZORE (ar. fecr kazib) koja je vertikalna i kratkotrajna.\n\n'
} as const;

export const CALCULATED_TOOLTIPS = {
  KRAJ_JACIJE:
    'Polovina noći se računa kao polovina vremena između akšama (zalaska sunca) i prave zore (sabaha).\n\n' +
    'Vrijeme jacijskog namaza završava završetkom polovine noći. ' +
    'Ako bi čovjek bio u nuždi i potrebi, može jaciju klanjati sve do nastupanja zore, tj. sabah-namaza.',
  ZADNJA_TRECINA_NOCI:
    'Prenosi Ebu Hurejra radijallahu anhu, da je Allahov Poslanik, sallallahu alejhi ve sellem rekao:\n\n' +
    '"Naš Uzvišeni Gospodar se spušta svake noći na najniže nebo kada ostane posljednja trećina noći, pa kaže:\n' +
    "'Ko Me doziva da mu se odazovem?\n" +
    "Ko od Mene traži da mu dam?\n" +
    "Ko od Mene traži oprost da mu oprostim?'\n" +
    '— i to traje sve dok ne nastupi zora."\n\n' +
    'Hadis bilježe Buharija i Muslim.',
} as const;
