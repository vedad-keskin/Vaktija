/** Raw data from the service (static) */
export interface PrayerTimeData {
  name: string;
  time: string;
  minutes: number;
  isCalculated: boolean;
  tooltip?: string;
}

/** Display data with dynamic fields computed in the page */
export interface PrayerTime extends PrayerTimeData {
  isActive: boolean;
  isPassed: boolean;
  isCurrent: boolean;
  isNext: boolean;
  /** 0–100: how much of the current prayer window has elapsed (only for isCurrent) */
  progress: number;
  relativeText: string;
}

/** api.vaktija.ba JSON (`/vaktija/v1/:lokacija/...`) */
export interface VaktijaBaApiResponse {
  lokacija: string;
  datum: string[];
  vakat: string[];
}

/** Aladhan.com API response */
export interface AladhanApiResponse {
  code: number;
  status: string;
  data: {
    timings: Record<string, string>;
    date: {
      readable: string;
      hijri: {
        date: string;
        day: string;
        month: { number: number; en: string; ar: string };
        year: string;
      };
      gregorian: {
        date: string;
        day: string;
        weekday: { en: string };
        month: { number: number; en: string };
        year: string;
      };
    };
    meta: {
      method: { id: number; name: string; params: Record<string, number> };
      midnightMode: string;
      school: string;
    };
  };
}
