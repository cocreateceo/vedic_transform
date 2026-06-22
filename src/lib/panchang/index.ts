// Public entry point for the panchang engine. `getPanchang` resolves the Sun
// and Moon positions for an instant, applies the Lahiri ayanamsha, and returns
// the full panchanga. This is the foundation for the festival/vrat calendar
// (V2), nakshatra-tailored insights (V5), and panchang SEO pages (AQ11).

import { sunMoonLongitudes } from "./ephemeris";
import { lahiriAyanamsha } from "./ayanamsha";
import { computePanchanga, type Panchanga } from "./panchang";

export type { Panchanga, Tithi, Nakshatra, Yoga, Karana } from "./panchang";
export { lahiriAyanamsha } from "./ayanamsha";

/**
 * Full panchanga for a specific instant.
 *
 * Tithi/nakshatra/yoga/karana depend only on absolute time (timezone-free).
 * Vara (weekday) is a civil-calendar quantity: it defaults to the instant's UTC
 * weekday — pass `weekday` (0=Sunday) for the target location's local civil day
 * when you need it location-correct. For a daily panchang, pass the local
 * sunrise instant as `date`.
 */
export function getPanchang(
  date: Date,
  opts: { weekday?: number } = {},
): Panchanga {
  const { sun, moon } = sunMoonLongitudes(date);
  return computePanchanga({
    sunTropical: sun,
    moonTropical: moon,
    ayanamsha: lahiriAyanamsha(date),
    weekday: opts.weekday ?? date.getUTCDay(),
  });
}
