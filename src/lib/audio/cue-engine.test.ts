import { describe, expect, test } from "vitest";
import { cuesToFire, type Cue } from "./cue-engine";

const cues: Cue[] = [
  { id: "start", atSeconds: 0, src: "/audio/a/start.mp3" },
  { id: "mid", atSeconds: 150, src: "/audio/a/mid.mp3" },
  { id: "end", atSeconds: 300, src: "/audio/a/end.mp3" },
];

describe("cuesToFire", () => {
  test("fires a cue once its time has been reached", () => {
    const fired = new Set<string>();
    expect(cuesToFire(cues, 0, fired).map((c) => c.id)).toEqual(["start"]);
  });

  test("does not refire cues already in the fired set", () => {
    const fired = new Set<string>(["start"]);
    expect(cuesToFire(cues, 1, fired)).toEqual([]);
  });

  test("fires every newly-passed cue when time jumps", () => {
    const fired = new Set<string>(["start"]);
    expect(cuesToFire(cues, 151, fired).map((c) => c.id)).toEqual(["mid"]);
  });

  test("never fires a cue whose time is still in the future", () => {
    const fired = new Set<string>();
    expect(cuesToFire(cues, 149, fired).map((c) => c.id)).toEqual(["start"]);
  });
});
