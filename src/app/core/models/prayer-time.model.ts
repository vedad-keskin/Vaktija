export interface PrayerTime {
  name: string;
  time: string;
  minutes: number;
  isCalculated: boolean;
  isActive: boolean;
  isPassed: boolean;
}

export interface VaktijaApiResponse {
  id: number;
  lokacija: string;
  datum: [string, string];
  vakat: [string, string, string, string, string, string];
}
