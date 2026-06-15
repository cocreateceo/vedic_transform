import { describe, expect, test } from "vitest";
import {
  brahmaMuhurta,
  sandhyaJunctions,
  eatingWindow,
  windDown,
} from "./windows";

// Fixed reference day: sunrise 06:00, solar noon 12:00, sunset 18:00 local.
const sunrise = new Date("2026-06-14T06:00:00");
const solarNoon = new Date("2026-06-14T12:00:00");
const sunset = new Date("2026-06-14T18:00:00");
const sun = { sunrise, sunset, solarNoon };

const mins = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 60000);

describe("brahmaMuhurta", () => {
  test("opens 96 min before sunrise and lasts 48 min", () => {
    const w = brahmaMuhurta(sunrise);
    expect(mins(w.start, sunrise)).toBe(96);
    expect(mins(w.start, w.end)).toBe(48);
    expect(w.end.getTime()).toBeLessThan(sunrise.getTime());
  });
});

describe("sandhyaJunctions", () => {
  test("returns sunrise, noon, and sunset junctions in order", () => {
    const j = sandhyaJunctions(sun);
    expect(j.map((x) => x.id)).toEqual(["sunrise", "noon", "sunset"]);
    expect(j[0].at).toEqual(sunrise);
    expect(j[1].at).toEqual(solarNoon);
    expect(j[2].at).toEqual(sunset);
  });
});

describe("eatingWindow", () => {
  test("opens ~1h after sunrise and lasts 10 hours by default", () => {
    const w = eatingWindow(sunrise);
    expect(mins(sunrise, w.start)).toBe(60);
    expect(mins(w.start, w.end)).toBe(600);
  });

  test("respects a custom window length", () => {
    const w = eatingWindow(sunrise, 8);
    expect(mins(w.start, w.end)).toBe(480);
  });
});

describe("windDown", () => {
  test("suggests screens-off 2h after sunset and bed 3h after", () => {
    const w = windDown(sunset);
    expect(mins(sunset, w.screensOff)).toBe(120);
    expect(mins(sunset, w.bedtime)).toBe(180);
  });
});
