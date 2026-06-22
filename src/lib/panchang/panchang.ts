// Pure derivations of the five limbs (panchanga) from solar/lunar longitudes.
// No ephemeris or Date math here — every function takes plain numbers, so the
// whole calendar logic is deterministic and unit-testable. Tithi and karana use
// the Moon−Sun elongation (ayanamsha cancels); nakshatra and yoga need sidereal
// longitudes (tropical − ayanamsha), handled by computePanchanga.

import {
  TITHI_NAMES,
  NAKSHATRA_NAMES,
  YOGA_NAMES,
  KARANA_MOVABLE,
  VARA_NAMES,
} from "./constants";

export function norm360(d: number): number {
  return ((d % 360) + 360) % 360;
}

const UNIT = 360 / 27; // nakshatra / yoga unit ≈ 13.333°

export interface Tithi {
  index: number; // 0..29
  number: number; // 1..30
  name: string;
  paksha: "Shukla" | "Krishna";
  fraction: number; // 0..1 elapsed within the tithi
}

export function tithiFrom(sunLong: number, moonLong: number): Tithi {
  const diff = norm360(moonLong - sunLong);
  const index = Math.floor(diff / 12);
  return {
    index,
    number: index + 1,
    name: TITHI_NAMES[index],
    paksha: index < 15 ? "Shukla" : "Krishna",
    fraction: (diff % 12) / 12,
  };
}

export interface Nakshatra {
  index: number; // 0..26
  number: number; // 1..27
  name: string;
  pada: number; // 1..4
  fraction: number; // 0..1
}

export function nakshatraFrom(siderealMoonLong: number): Nakshatra {
  const lon = norm360(siderealMoonLong);
  const index = Math.floor(lon / UNIT);
  const within = lon - index * UNIT;
  return {
    index,
    number: index + 1,
    name: NAKSHATRA_NAMES[index],
    pada: Math.floor(within / (UNIT / 4)) + 1,
    fraction: within / UNIT,
  };
}

export interface Yoga {
  index: number;
  number: number;
  name: string;
  fraction: number;
}

export function yogaFrom(
  siderealSunLong: number,
  siderealMoonLong: number,
): Yoga {
  const sum = norm360(siderealSunLong + siderealMoonLong);
  const index = Math.floor(sum / UNIT);
  return {
    index,
    number: index + 1,
    name: YOGA_NAMES[index],
    fraction: (sum - index * UNIT) / UNIT,
  };
}

export interface Karana {
  index: number; // 0..59
  number: number; // 1..60
  name: string;
}

export function karanaFrom(sunLong: number, moonLong: number): Karana {
  const diff = norm360(moonLong - sunLong);
  const n = Math.floor(diff / 6); // 60 half-tithis per lunar month
  let name: string;
  if (n === 0) name = "Kimstughna";
  else if (n <= 56) name = KARANA_MOVABLE[(n - 1) % 7];
  else if (n === 57) name = "Shakuni";
  else if (n === 58) name = "Chatushpada";
  else name = "Naga";
  return { index: n, number: n + 1, name };
}

/** Vara (weekday) from a JS getDay() value (0 = Sunday). */
export function varaFrom(weekday: number): string {
  return VARA_NAMES[((weekday % 7) + 7) % 7];
}

export interface Panchanga {
  tithi: Tithi;
  nakshatra: Nakshatra;
  yoga: Yoga;
  karana: Karana;
  vara: string;
  ayanamsha: number;
}

/**
 * Assemble the full panchanga from *tropical* solar/lunar longitudes plus the
 * ayanamsha. Tithi/karana use the elongation directly; nakshatra/yoga are
 * computed from sidereal longitudes.
 */
export function computePanchanga(opts: {
  sunTropical: number;
  moonTropical: number;
  ayanamsha: number;
  weekday: number;
}): Panchanga {
  const { sunTropical, moonTropical, ayanamsha, weekday } = opts;
  const sunSid = norm360(sunTropical - ayanamsha);
  const moonSid = norm360(moonTropical - ayanamsha);
  return {
    tithi: tithiFrom(sunTropical, moonTropical),
    nakshatra: nakshatraFrom(moonSid),
    yoga: yogaFrom(sunSid, moonSid),
    karana: karanaFrom(sunTropical, moonTropical),
    vara: varaFrom(weekday),
    ayanamsha,
  };
}
