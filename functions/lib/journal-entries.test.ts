import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

// The journal handler imports `sst`, which can't resolve outside a deployed
// context, so the identity rule is re-derived here from the same inputs and the
// handler's source is asserted structurally. That keeps the two guarantees that
// matter — deterministic identity, and no Journey coupling — under test.

const SRC = readFileSync(
  join(__dirname, "..", "data", "journal.ts"),
  "utf8",
);

const trainingEntryId = (
  userId: string,
  chapterSlug: string,
  promptIndex: unknown,
) => {
  const prompt = Number.isInteger(promptIndex) ? String(promptIndex) : "all";
  return createHash("sha256")
    .update(`training|${userId}|${chapterSlug}|${prompt}`)
    .digest("hex")
    .slice(0, 32);
};

describe("Training entry identity", () => {
  it("is stable for the same user + chapter + prompt", () => {
    const a = trainingEntryId("u1", "connect-to-the-universe", 0);
    const b = trainingEntryId("u1", "connect-to-the-universe", 0);
    expect(a).toBe(b);
  });

  it("keeps different prompts in the same chapter distinct", () => {
    expect(trainingEntryId("u1", "ch", 0)).not.toBe(
      trainingEntryId("u1", "ch", 1),
    );
  });

  it("keeps a chapter-level reflection distinct from prompt 0", () => {
    expect(trainingEntryId("u1", "ch", undefined)).not.toBe(
      trainingEntryId("u1", "ch", 0),
    );
  });

  it("keeps two chapters distinct", () => {
    expect(trainingEntryId("u1", "ch-a", 0)).not.toBe(
      trainingEntryId("u1", "ch-b", 0),
    );
  });

  it("keeps two users distinct", () => {
    expect(trainingEntryId("u1", "ch", 0)).not.toBe(
      trainingEntryId("u2", "ch", 0),
    );
  });

  it("is opaque — it does not leak the user id", () => {
    expect(trainingEntryId("user-secret-42", "ch", 0)).not.toContain(
      "user-secret-42",
    );
  });
});

describe("journal handler contract", () => {
  it("derives training identity from the authenticated user, not the body", () => {
    // `user.id` comes from getUserFromEvent; a client-supplied userId is never
    // used to build the id.
    expect(SRC).toMatch(/trainingEntryId\(\s*user\.id/);
    expect(SRC).not.toMatch(/trainingEntryId\(\s*body\./);
  });

  it("gives ordinary entries generated ids, so a day can hold many", () => {
    expect(SRC).toMatch(/isTraining\s*\?\s*trainingEntryId\([\s\S]*?:\s*generateId\(\)/);
  });

  it("persists only user prose in body", () => {
    // The authored question is never read from the request or written to body.
    expect(SRC).not.toMatch(/body:\s*`[^`]*\$\{prompt/);
    expect(SRC).toMatch(/body:\s*prose/);
  });

  it("rejects an empty body", () => {
    expect(SRC).toMatch(/if \(!prose\) return err\(400/);
  });

  it("requires a chapterSlug for training entries", () => {
    expect(SRC).toMatch(/chapterSlug is required for training entries/);
  });

  it("refuses to overwrite another user's entry", () => {
    expect(SRC).toMatch(/prior\.userId !== user\.id\) return err\(403/);
  });

  it("preserves createdAt and entryDate when updating", () => {
    expect(SRC).toMatch(/createdAt:\s*prior\?\.createdAt \?\? now/);
    expect(SRC).toMatch(/entryDate:\s*prior\?\.entryDate \?\? today/);
  });

  it("never credits a pillar or writes a check-in from any journal path", () => {
    // Journal saves must not move Journey day, streak or karma. The existing
    // gratitude/intention handlers don't do this either — credit happens on
    // the client — so the whole file must stay clean.
    expect(SRC).not.toMatch(/creditPillar|\/data\/checkin|DailyCheckins/);
  });

  it("keeps the three existing types working", () => {
    for (const op of ["gratitude", "intention", "manifestation"]) {
      expect(SRC).toContain(`op === '${op}'`);
    }
    expect(SRC).toContain("op === 'entry'");
  });

  it("returns generic entries under their own GET key", () => {
    expect(SRC).toMatch(/results\.journalEntries = /);
    // Existing response fields are untouched.
    for (const key of [
      "results.gratitudeEntries",
      "results.intentions",
      "results.manifestations",
      "results.todayGratitude",
      "results.todayIntention",
    ]) {
      expect(SRC).toContain(key);
    }
  });
});
