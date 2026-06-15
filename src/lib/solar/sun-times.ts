import SunCalc from "suncalc";

export interface SunTimes {
  /** Local Date of sunrise. */
  sunrise: Date;
  /** Local Date of sunset. */
  sunset: Date;
  /** Local Date of solar noon (sun highest). */
  solarNoon: Date;
}

/**
 * Raw astronomical sun times for a date + coordinates. Thin wrapper over
 * suncalc so the rest of the app never imports suncalc directly and so the
 * return shape is stable if we swap the math later.
 */
export function getSunTimes(date: Date, lat: number, lng: number): SunTimes {
  const t = SunCalc.getTimes(date, lat, lng);
  return { sunrise: t.sunrise, sunset: t.sunset, solarNoon: t.solarNoon };
}
