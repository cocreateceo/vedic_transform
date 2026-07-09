// Thin wrapper over astronomy-engine for the only two quantities the panchang
// needs: the apparent geocentric *tropical* ecliptic longitudes (of date) of
// the Sun and Moon. Keeping the dependency behind this one module means the
// rest of the engine stays pure and the library can be swapped if needed.

import { SunPosition, EclipticGeoMoon } from "astronomy-engine";

export interface SunMoonLongitudes {
  /** Sun tropical ecliptic longitude of date, degrees [0, 360). */
  sun: number;
  /** Moon tropical ecliptic longitude of date, degrees [0, 360). */
  moon: number;
}

export function sunMoonLongitudes(date: Date): SunMoonLongitudes {
  // Both are returned in ECT (true ecliptic of date), so they share a frame and
  // their difference/sum are physically meaningful.
  const sun = SunPosition(date).elon;
  const moon = EclipticGeoMoon(date).lon;
  return { sun: ((sun % 360) + 360) % 360, moon: ((moon % 360) + 360) % 360 };
}
