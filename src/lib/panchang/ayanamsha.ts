// Lahiri (Chitrapaksha) ayanamsha — the offset between the tropical zodiac
// (what an ephemeris reports) and the sidereal zodiac (what Vedic astrology
// uses). Sidereal longitude = tropical longitude − ayanamsha.

/** Julian Day for a JS Date (UTC). */
export function julianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/**
 * Lahiri ayanamsha in degrees for the given date. Linear model anchored at
 * J2000.0 (≈23.852°) with the mean precession rate (~50.29"/yr). Accurate to
 * well under an arcminute over the decades around now — far finer than the
 * ~13.3° width of a nakshatra, so nakshatra/yoga assignment is unaffected.
 */
export function lahiriAyanamsha(date: Date): number {
  const T = (julianDay(date) - 2451545.0) / 36525; // Julian centuries since J2000
  return 23.8519 + 1.3970 * T;
}
