import type { SunTimes } from "./sun-times";

export interface TimeWindow {
  start: Date;
  end: Date;
}

export interface Junction {
  id: "sunrise" | "noon" | "sunset";
  label: string;
  at: Date;
}

export interface WindDown {
  screensOff: Date;
  bedtime: Date;
}

const addMinutes = (d: Date, m: number) => new Date(d.getTime() + m * 60000);

/**
 * Brahma Muhurta: the 48-minute window that OPENS ~96 minutes before sunrise
 * (the 14th of 15 night muhurtas). Matches the corrected Morning pillar copy.
 */
export function brahmaMuhurta(sunrise: Date): TimeWindow {
  const start = addMinutes(sunrise, -96);
  return { start, end: addMinutes(start, 48) };
}

/** The three sandhis (junctions) of the day, in chronological order. */
export function sandhyaJunctions(sun: SunTimes): Junction[] {
  return [
    { id: "sunrise", label: "Sunrise sandhya", at: sun.sunrise },
    { id: "noon", label: "Noon sandhya", at: sun.solarNoon },
    { id: "sunset", label: "Sunset sandhya", at: sun.sunset },
  ];
}

/**
 * Circadian eating window: open ~1h after sunrise, length `hours` (default 10
 * for 14:10; pass 8 for a tighter 16:8). Matches the Nutrition pillar.
 */
export function eatingWindow(sunrise: Date, hours = 10): TimeWindow {
  const start = addMinutes(sunrise, 60);
  return { start, end: addMinutes(start, hours * 60) };
}

/** Evening wind-down anchors relative to sunset (Sleep pillar). */
export function windDown(sunset: Date): WindDown {
  return {
    screensOff: addMinutes(sunset, 120),
    bedtime: addMinutes(sunset, 180),
  };
}
