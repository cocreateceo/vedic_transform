import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { selectTraining, trainingCtaLabel } from "./training-selection";
import { trainingContentId, getPublishedChapters } from "@/data/training-book";
import { chapterStepKeys, stepContentId } from "./training-steps";

const published = getPublishedChapters();
const [intro, ch1, ch2] = published;

const sealed = (...slugs: string[]) =>
  new Set(slugs.map((s) => trainingContentId(s)));

describe("training selection — states", () => {
  it("not-started when nothing has been touched", () => {
    const s = selectTraining(new Set());
    expect(s.state).toBe("not-started");
    expect(s.chapter?.slug).toBe(intro.slug);
    expect(s.stepsComplete).toBe(0);
    expect(trainingCtaLabel(s)).toBe("Start Chapter");
  });

  it("claims no activities for the Introduction, which has no cycle", () => {
    // IntroductionExperience renders no step sections and no #step- anchors.
    // Counting activities for it would promise a page that doesn't exist.
    const s = selectTraining(new Set());
    expect(s.chapter?.slug).toBe(intro.slug);
    expect(s.stepKeys).toEqual([]);
    expect(s.nextStep).toBeUndefined();
    expect(s.href).toBe(`/training/${intro.slug}`);
    expect(s.href).not.toContain("#");
  });

  it("in-progress once an activity is done in the current chapter", () => {
    const keys = chapterStepKeys(ch1);
    const s = selectTraining(
      new Set([
        trainingContentId(intro.slug),
        stepContentId(ch1.slug, keys[0]),
      ]),
    );
    expect(s.state).toBe("in-progress");
    expect(s.chapter?.slug).toBe(ch1.slug);
    expect(s.stepsComplete).toBe(1);
    expect(s.nextStep).toBe(keys[1]);
    expect(trainingCtaLabel(s)).toBe("Continue");
  });

  it("resuming when a chapter is sealed and the next is untouched", () => {
    const s = selectTraining(sealed(intro.slug));
    expect(s.state).toBe("resuming");
    expect(s.chapter?.slug).toBe(ch1.slug);
    expect(s.chaptersSealed).toBe(1);
    expect(trainingCtaLabel(s)).toBe("Continue Training");
  });

  it("caught-up when every published chapter is sealed", () => {
    const s = selectTraining(sealed(intro.slug, ch1.slug, ch2.slug));
    expect(s.state).toBe("caught-up");
    expect(s.chaptersSealed).toBe(published.length);
    expect(s.percentComplete).toBe(100);
    expect(s.remainingMinutes).toBe(0);
    expect(trainingCtaLabel(s)).toBe("Review Training");
    // Caught up on the BOOK — it must not imply the 48-day journey is over.
    expect(s.href).toContain("/training/");
  });
});

describe("training selection — deep link", () => {
  it("points at the next incomplete activity, not the chapter top", () => {
    const keys = chapterStepKeys(ch1);
    const done = new Set([
      trainingContentId(intro.slug),
      stepContentId(ch1.slug, keys[0]),
      stepContentId(ch1.slug, keys[1]),
    ]);
    const s = selectTraining(done);
    expect(s.chapter?.slug).toBe(ch1.slug);
    expect(s.nextStep).toBe(keys[2]);
    expect(s.href).toBe(`/training/${ch1.slug}#step-${keys[2]}`);
    expect(s.nextStepStage).toBeTruthy();
  });

  it("falls back to the chapter top when no activity remains", () => {
    const s = selectTraining(sealed(intro.slug, ch1.slug, ch2.slug));
    expect(s.href).not.toContain("#");
  });
});

describe("training selection — pillar relationship", () => {
  it("omits the relationship when the book authors none", () => {
    // The Introduction has no pillar mapping — nothing may be manufactured.
    const s = selectTraining(new Set());
    expect(s.chapter?.slug).toBe(intro.slug);
    expect(s.link?.pillar).toBeUndefined();
  });

  it("surfaces the relationship when the book authors one", () => {
    const s = selectTraining(sealed(intro.slug));
    expect(s.chapter?.slug).toBe(ch1.slug);
    expect(s.link?.pillar?.slug).toBe("brahman-connection");
  });
});

describe("training never couples to the 48-day journey", () => {
  // The mechanical form of the rule: reading a chapter is not practising, so
  // no Training surface may write a journey/participation record.
  const ROOT = join(__dirname, "..");
  const TARGETS = [
    "components/features/training",
    "components/features/dashboard/todays-teaching-card.tsx",
    "lib/training-selection.ts",
    "lib/training-steps.ts",
    "lib/learning-map.ts",
    "lib/training-progress.ts",
    "lib/training-return-context.ts",
    "lib/hooks/use-chapter-progress.ts",
    "app/(main)/training",
  ];
  // NOTE: next-practice-cta.tsx is deliberately NOT listed. It legitimately
  // reads /data/checkin and /data/focus-pillars as part of Sessions' own
  // behaviour, which E2 leaves untouched. What matters is that the Training
  // WRITE path — training-progress.ts — never does.
  const FORBIDDEN = ["/data/checkin", "/data/journey", "/data/reports"];

  const filesUnder = (p: string): string[] => {
    const full = join(ROOT, p);
    if (!statSync(full).isDirectory()) return [full];
    return readdirSync(full).flatMap((entry) =>
      filesUnder(join(p, entry).replace(/\\/g, "/")),
    );
  };

  it("writes only to the content-progress store", () => {
    const offenders: string[] = [];
    for (const target of TARGETS) {
      for (const file of filesUnder(target)) {
        if (!/\.(ts|tsx)$/.test(file) || file.endsWith(".test.ts")) continue;
        const src = readFileSync(file, "utf8");
        for (const needle of FORBIDDEN) {
          if (src.includes(needle)) {
            offenders.push(`${file.replace(ROOT, "")} → ${needle}`);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
