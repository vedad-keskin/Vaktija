/** Raw data from the service (static) */
export interface PrayerTimeData {
  name: string;
  time: string;
  minutes: number;
  isCalculated: boolean;
}

/** Display data with dynamic fields computed in the page */
export interface PrayerTime extends PrayerTimeData {
  isActive: boolean;
  isPassed: boolean;
  relativeText: string;
}

export interface VaktijaApiResponse {
  id: number;
  lokacija: string;
  datum: [string, string];
  vakat: [string, string, string, string, string, string];
}
