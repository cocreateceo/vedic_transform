import { describe, expect, test } from "vitest";
import { sunMoonLongitudes } from "./ephemeris";
import { getPanchang } from "./index";
import { VARA_NAMES } from "./constants";

// Ground-truth check: at an equinox/solstice the Sun's *tropical* longitude is
// 0/90/180/270 by definition. If the ephemeris is wired correctly these land
// within a fraction of a degree, proving real positions (not stubs).
describe("ephemeris ground truth", () => {
  test("March 2024 equinox → Sun tropical longitude ≈ 0°", () => {
    const { sun } = sunMoonLongitudes(new Date("2024-03-20T03:06:00Z"));
    const offFromZero = Math.min(sun, 360 - sun);
    expect(offFromZero).toBeLessThan(0.3);
  });

  test("June 2024 solstice → Sun tropical longitude ≈ 90°", () => {
    const { sun } = sunMoonLongitudes(new Date("2024-06-20T20:51:00Z"));
    expect(Math.abs(sun - 90)).toBeLessThan(0.3);
  });
});

describe("getPanchang", () => {
  test("returns every limb in a valid range", () => {
    const p = getPanchang(new Date("2025-01-14T01:00:00Z"));

    expect(p.tithi.number).toBeGreaterThanOrEqual(1);
    expect(p.tithi.number).toBeLessThanOrEqual(30);

    expect(p.nakshatra.number).toBeGreaterThanOrEqual(1);
    expect(p.nakshatra.number).toBeLessThanOrEqual(27);
    expect(p.nakshatra.pada).toBeGreaterThanOrEqual(1);
    expect(p.nakshatra.pada).toBeLessThanOrEqual(4);

    expect(p.yoga.number).toBeGreaterThanOrEqual(1);
    expect(p.yoga.number).toBeLessThanOrEqual(27);

    expect(p.karana.number).toBeGreaterThanOrEqual(1);
    expect(p.karana.number).toBeLessThanOrEqual(60);

    expect(VARA_NAMES).toContain(p.vara);
    expect(p.ayanamsha).toBeGreaterThan(24);
    expect(p.ayanamsha).toBeLessThan(24.3);
  });

  test("weekday override sets vara independent of UTC day", () => {
    // 2025-01-14 is a Tuesday (UTC). Force Sunday (0).
    expect(getPanchang(new Date("2025-01-14T01:00:00Z"), { weekday: 0 }).vara).toBe(
      "Ravivara",
    );
  });
});
