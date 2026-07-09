import { describe, expect, test } from "vitest";
import {
  tithiFrom,
  nakshatraFrom,
  yogaFrom,
  karanaFrom,
  varaFrom,
  computePanchanga,
  norm360,
} from "./panchang";
import { lahiriAyanamsha } from "./ayanamsha";

describe("tithiFrom", () => {
  test("new moon elongation → Shukla Pratipada, half elapsed at 6°", () => {
    const t = tithiFrom(0, 6);
    expect(t.number).toBe(1);
    expect(t.name).toBe("Shukla Pratipada");
    expect(t.paksha).toBe("Shukla");
    expect(t.fraction).toBeCloseTo(0.5, 5);
  });

  test("opposition (180°) starts Krishna paksha", () => {
    const t = tithiFrom(0, 180);
    expect(t.number).toBe(16);
    expect(t.paksha).toBe("Krishna");
    expect(t.name).toBe("Krishna Pratipada");
  });

  test("full moon sits in Purnima (just before 180°)", () => {
    expect(tithiFrom(0, 174).name).toBe("Purnima");
  });

  test("just before conjunction → Amavasya (30th)", () => {
    const t = tithiFrom(10, 358); // elongation 348°
    expect(t.number).toBe(30);
    expect(t.name).toBe("Amavasya");
  });

  test("wraps across 0°", () => {
    expect(tithiFrom(350, 1).number).toBe(1); // elongation 11° → still tithi 1
    expect(tithiFrom(350, 2).number).toBe(2); // elongation 12° → boundary into tithi 2
  });
});

describe("nakshatraFrom", () => {
  test("0° sidereal → Ashwini pada 1", () => {
    const n = nakshatraFrom(0);
    expect(n.name).toBe("Ashwini");
    expect(n.pada).toBe(1);
  });

  test("just past one unit → Bharani", () => {
    expect(nakshatraFrom(13.5).name).toBe("Bharani");
  });

  test("end of the circle → Revati (27th)", () => {
    expect(nakshatraFrom(359.9).number).toBe(27);
    expect(nakshatraFrom(359.9).name).toBe("Revati");
  });

  test("padas split each nakshatra into four", () => {
    expect(nakshatraFrom(0).pada).toBe(1);
    expect(nakshatraFrom(360 / 27 / 4 + 0.01).pada).toBe(2);
  });
});

describe("yogaFrom", () => {
  test("sum 0 → Vishkambha", () => {
    expect(yogaFrom(0, 0).name).toBe("Vishkambha");
  });

  test("sum just over one unit → Priti", () => {
    expect(yogaFrom(10, 4).name).toBe("Priti"); // sum 14 > 13.33
  });
});

describe("karanaFrom", () => {
  test("first half-tithi is the fixed Kimstughna", () => {
    expect(karanaFrom(0, 3).name).toBe("Kimstughna");
  });

  test("second half-tithi begins the movable cycle (Bava)", () => {
    expect(karanaFrom(0, 9).name).toBe("Bava");
  });

  test("the three fixed karanas close the lunar month", () => {
    expect(karanaFrom(0, 6 * 57 + 1).name).toBe("Shakuni");
    expect(karanaFrom(0, 6 * 58 + 1).name).toBe("Chatushpada");
    expect(karanaFrom(0, 6 * 59 + 1).name).toBe("Naga");
  });
});

describe("varaFrom", () => {
  test("maps weekday index to Sanskrit vara", () => {
    expect(varaFrom(0)).toBe("Ravivara");
    expect(varaFrom(6)).toBe("Shanivara");
    expect(varaFrom(1)).toBe("Somavara");
  });
});

describe("computePanchanga", () => {
  test("subtracts ayanamsha for nakshatra/yoga but not tithi", () => {
    const p = computePanchanga({
      sunTropical: 24,
      moonTropical: 24,
      ayanamsha: 24,
      weekday: 0,
    });
    // sidereal both 0
    expect(p.nakshatra.name).toBe("Ashwini");
    expect(p.yoga.name).toBe("Vishkambha");
    // elongation 0 → very start of Shukla Pratipada
    expect(p.tithi.name).toBe("Shukla Pratipada");
    expect(p.vara).toBe("Ravivara");
    expect(p.ayanamsha).toBe(24);
  });
});

describe("norm360", () => {
  test("normalizes negatives and overflow", () => {
    expect(norm360(-10)).toBeCloseTo(350, 9);
    expect(norm360(370)).toBeCloseTo(10, 9);
  });
});

describe("lahiriAyanamsha", () => {
  test("≈23.85° at J2000 and ≈24.1–24.2° in the mid-2020s", () => {
    expect(lahiriAyanamsha(new Date("2000-01-01T12:00:00Z"))).toBeCloseTo(
      23.852,
      2,
    );
    const now = lahiriAyanamsha(new Date("2024-01-01T00:00:00Z"));
    expect(now).toBeGreaterThan(24.1);
    expect(now).toBeLessThan(24.25);
  });
});
