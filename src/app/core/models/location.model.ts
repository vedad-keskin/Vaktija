export interface Location {
  name: string;
  lat: number;
  lng: number;
  /** Index in the vaktija.ba locations array (0-based). Required for IZ method. */
  vaktijaId?: number;
}
