# Brief: make every Pillar taught somewhere in Training

**Date:** 2026-07-30
**Status:** Proposal — not implemented. Hand to an implementer.
**Scope:** Data model + one lib function + six call sites. **No UI redesign. No new progress state.**

---

## 1. The problem, with evidence

Four of the eleven pillars have **no Training chapter at all** — not even an unpublished one:

| Pillar | Practice (exists today) | Training chapter |
|---|---|---|
| `morning-initiation` — 5 AM Initiation | Sessions · Morning Routine | **none** |
| `breathing-meditation` — Breathing + Meditation | Sessions · Breathing | **none** |
| `sandhya-meditation` — Sandhya Meditation | Sessions · Sandhya | **none** |
| `sleep-optimization` — Sleep Optimization | Sessions · Sleep | **none** |

> **Read this carefully: these pillars are not content-less.** Each already has a
> real, interactive Sessions practice. The gap is the **book teaching**, not the
> practice. All 11 pillars have a practice route (9 Sessions timers + 2 Journal);
> only 7 have a chapter, and only 2 of those are published.
>
> **Therefore:** a chapter written for one of these pillars should supply the
> *why* — philosophy, principles, preparation — and then hand the learner to the
> existing Session through the practice deep link. It must **not** duplicate the
> Session's interactive experience inside the chapter. The routing already
> exists: `linkForChapter()` → `/sessions?practice=<key>&from=training:<slug>&step=…`.
>
> Full matrix: §5a of `2026-07-30-app-surface-inventory.md`.

The Introduction does not cover them either. Its sections are *A 48-Day Journey Into Conscious Living · A Profound Shift · Five Dimensions of Evolution · Who This Book Is For · The 11 Chapters of 10x Vedic* — that last one enumerates the eleven **chapters**, not the pillars. The phrase "11 pillars" never appears. The only hits are incidental prose ("wake" ×1, "sleep" ×3); no mention of pranayama, breathing, or sandhya.

### Current mapping (verified against `src/data/training-book.ts`)

| Chapter | Status | `relatedPillarSlug` |
|---|---|---|
| Introduction | published | — |
| 1 Connect to the Self and the Universe | published | `brahman-connection` |
| 2 Consciousness & Self-Awareness | published | `thoughts-intention` |
| 3 Meditation & Healing | coming-soon | `healing-meditation` |
| 4 Dharma & Purpose | coming-soon | — |
| 5 Health, Energy & Balance | coming-soon | **—** |
| 6 Relationships, Family & Community | coming-soon | `gratitude` |
| 7 Healing, Service and Leadership | coming-soon | — |
| 8 Nutrition and Fasting | coming-soon | `nutrition-fasting` |
| 9 Movement, Exercise and **Sleep Optimization** | coming-soon | `movement` **only** |
| 10 Creation, Manifestation & Transformation | coming-soon | `divine-manifestation` |
| 11 Living the 10x Vedic Life | coming-soon | — |

**7 of 11 pillars mapped; 2 of those published.**

### Root cause

`relatedPillarSlug` is **single-valued**:

```ts
// src/data/training-book.ts:33
relatedPillarSlug?: string; // joins src/constants/pillars.ts
```

A chapter can therefore claim exactly one pillar. This is not a content gap — it is a schema limit:

- **Chapter 9 is literally titled "Movement, Exercise and Sleep Optimization"** yet `sleep-optimization` gets nothing, because `movement` already occupies the field.
- **Chapter 5 "Health, Energy & Balance"** is the natural home for `5 AM Initiation` and `Breathing + Meditation` and currently claims no pillar.
- **Chapter 3 "Meditation & Healing"** claims `healing-meditation`; `breathing-meditation` and `sandhya-meditation` are plausible siblings.

---

## 2. Options

| | Option A — patch the data | Option B — make the field plural (recommended) |
|---|---|---|
| Change | Add `relatedPillarSlug` to Chapters 5, 7, 11 | `relatedPillarSlug?: string` → `relatedPillarSlugs?: string[]` |
| Covers | 10 of 11 at best; two pillars still collide on Ch 9 | All 11 |
| Ch 9 sleep problem | **unsolved** — one field, two pillars | solved |
| Cost | ~3 data lines | ~1 data field + 1 filter + 6 call sites + test updates |
| Risk | Low | Low — `chaptersForPillar()` is already plural |

**Recommend B.** `src/lib/learning-map.ts` already exposes `chaptersForPillar(pillarSlug)` returning an array precisely so a one-to-one assumption wouldn't be baked into UI components. The data model is now the only thing enforcing one-to-one. Option A cannot express Chapter 9 truthfully at any price.

---

## 3. Design

### 3.1 Three relationships, not one

The current model collapses three distinct concepts into one field. Separating them is the point of this change:

| # | Relationship | Owned by | Nature |
|---|---|---|---|
| 1 | **Chapter *teaches* Pillar** | `training-book.ts` | Editorial. Can be many. |
| 2 | **Pillar *has* a Practice** | `practice-routes.ts` | Structural. Already 11/11. |
| 3 | **Chapter *launches* a Practice** | derived from 1 + 2 | **Product decision.** Exactly one. |

Today #3 is *derived* from #1 + #2, which works only while a chapter teaches exactly one pillar. Once #1 is plural, #3 must be stated, not inferred.

Chapter 9 makes this concrete:

```
teaches            → Movement Everyday, Sleep Optimization
practices exist    → Movement session, Sleep session
chapter launches   → Movement session      ← an editorial choice, not a consequence
```

### 3.2 Schema

```ts
/** Every pillar this chapter substantially teaches. */
relatedPillarSlugs?: string[];

/**
 * The pillar representing this chapter's principal PRACTICE relationship —
 * the single destination its Practice/Meditation CTA opens. Must appear in
 * relatedPillarSlugs. Not a claim that the other pillars are pedagogically
 * lesser; it only resolves "where does the button go".
 */
primaryPillarSlug?: string;
```

**Rejected: `relatedPillarSlugs[0]` as primary.** It makes array order an invisible behavioural contract — `["movement","sleep-optimization"]` and `["sleep-optimization","movement"]` express identical relationships but produce different product behaviour. Anyone alphabetising the array, reordering it during content editing, or treating it as a set would silently change the chapter's practice CTA. Naming it costs one field and removes the trap entirely.

**Naming matters:** call it the *primary **practice** pillar*. Sleep isn't pedagogically secondary in Chapter 9; it is secondary only for the purpose of the chapter's single CTA.

### 3.3 Longer term (not this change)

`primaryPillarSlug` is a pragmatic stand-in for "which practice does this chapter launch". It works because every pillar has a practice — but **Sessions is a superset of Pillars**: 15 tabs, only 9 owned by a pillar. A future chapter could legitimately teach *Yoga Nidra*, which is not a pillar at all and therefore cannot be expressed through any pillar field.

When that happens, introduce an explicit `primaryPractice` (a session key or journal action) rather than stretching the pillar field further. Do **not** pre-build it now.

### 3.4 Proposed editorial mappings — **approve separately from the schema**

The schema change is architecturally sound on its own. These pairings are content judgements and carry different confidence. **Approve the schema first; land the mappings as the author confirms them, against actual chapter content rather than titles.**

| Chapter | Proposed | Primary practice | Confidence |
|---|---|---|---|
| 9 Movement, Exercise and **Sleep Optimization** | `["movement","sleep-optimization"]` | `movement` | **Strong** — both pillars are named in the chapter's own title |
| 5 Health, Energy & Balance | `["morning-initiation","breathing-meditation"]` | *TBD* | **Plausible** — needs content confirmation; the title implies but does not establish it |
| 3 Meditation & Healing | `["healing-meditation","sandhya-meditation"]` | *TBD* | **Weakest** — "Sandhya is a meditation practice" does not establish that this chapter teaches Sandhya |

Chapters 1, 2, 6, 8, 10 keep their existing value as a one-element array with the same slug as primary. Introduction, 4, 7, 11 stay unmapped.

For 3 and 5 the primary is genuinely undecided: both candidate pillars have real, distinct sessions, so someone must choose which practice the chapter launches. That is a product decision, not a default.

### 3.5 Coverage is not the goal

**"11 of 11 pillars covered" is explicitly NOT a success criterion.** All 11 pillars already have working practice experiences; four simply lack book teaching. A pillar should gain a chapter only when there is genuine philosophy, principles, preparation or explanatory material worth teaching — never to complete a count.

The architecture must *support* 11/11. Editorial quality decides whether it ever becomes 11/11.

---

## 4. Implementation

### 4.1 Data — `src/data/training-book.ts`

1. Interface (line ~33): replace `relatedPillarSlug?: string` with **both** new fields from §3.2.
2. Update the 7 existing chapter entries: single slug → one-element `relatedPillarSlugs` **plus** the same slug as `primaryPillarSlug`.
3. Add the new mappings from §3.4 only as the author approves each.

Single atomic change — do **not** keep the old field.

### 4.2 The join — `src/lib/learning-map.ts`

- `chaptersForPillar()` (~line 106): `c.relatedPillarSlug === pillarSlug` → `c.relatedPillarSlugs?.includes(pillarSlug)`.
- `linkForChapter()` (~lines 58–59): resolve the pillar from `chapter.primaryPillarSlug`. **Everything downstream is unchanged** — same `sessionKey`, same `practiceHref`, same `practiceLabel`.
- Consider adding `pillarsForChapter(slug): Pillar[]` if the chapter page later wants to list all of them. Not required for this change.

### 4.3 Remaining call sites (2)

- `src/app/(main)/training/[slug]/page.tsx:85` — the plain-reader fallback does its own `PILLARS.find(p => p.slug === chapter.relatedPillarSlug)`. Point it at `linkForChapter(slug)?.pillar` so there is still **one** interpretation of the relationship. (`chapter-experience.tsx` was already changed to do this.)
- `src/data/training-book.test.ts:50` — "relatedPillarSlug values exist in PILLARS" must iterate the array.

No component changes. `pillars/page.tsx`, `pillar-detail-client.tsx` and `chapter-experience.tsx` all go through `chapterForPillar` / `linkForChapter` and need no edit.

### 4.4 Tests

Update:
- `src/lib/learning-map.test.ts` — `"only two pillars currently have a published chapter"` will still hold (the three new mappings are all on unpublished chapters), but the round-trip test iterating `chapter.relatedPillarSlug` must iterate the array.
- `src/data/training-book.test.ts:50` — as above.

Add:
- Every entry in every `relatedPillarSlugs` array resolves to a real pillar slug.
- No duplicate slug within one chapter's array.
- **`primaryPillarSlug` must be present in that chapter's `relatedPillarSlugs`.** This is the central invariant of the design.
- A chapter with `relatedPillarSlugs` must declare a `primaryPillarSlug` (and vice versa) — never one without the other.
- **No pillar is the `primaryPillarSlug` of more than one chapter** — otherwise two chapters claim the same practice destination.
- `linkForChapter()` returns the **primary** pillar, not the first array element.
- **Array order carries no behaviour:** reversing a chapter's `relatedPillarSlugs` must not change `linkForChapter()`'s result. This is the regression test for the design flaw being fixed — write it explicitly.
- `chaptersForPillar()` finds a chapter via a **non-primary** slug (e.g. `sleep-optimization` → Chapter 9).
- Coverage assertion: count pillars with ≥1 chapter (published or not) and assert the current number, so the count changes deliberately rather than drifting. **Do not assert that the number should reach 11** — see §3.5.

---

## 5. Constraints — do not break these

These were established across the Training integration work and are enforced by existing tests:

1. **Published-only in the UI.** `chaptersForPillar()` filters to `status === "published"` by default. A pillar mapped only to a coming-soon chapter must show **no** Training chip and **no** placeholder. After this change, the three new mappings are all on unpublished chapters, so **the visible UI does not change at all today** — it changes as chapters 3, 5 and 9 publish.
2. **No progress dependency.** Pillar surfaces must not fetch `/data/content-progress` for this relationship. It is authored metadata; the chip never varies with completion state.
3. **No Journey coupling.** Nothing here may write journey day, check-in, streak or karma.
4. **No Day N → Chapter N mapping.** The relationship is semantic, via pillar only.
5. **One practice destination per chapter.** The primary-pillar rule exists to guarantee this; E2's Sessions round trip depends on it.
6. **One interpretation of the relationship.** After 4.3 there must be no direct `relatedPillarSlugs` lookup in any component — all reads go through `learning-map.ts`.

---

## 6. Verification

```
npx tsc --noEmit          # must stay clean
npx next build            # must stay clean
npx vitest run            # currently 205 passing — must not regress
```

Then, at runtime:

1. `/pillars` — still exactly **two** chips (Ch 1, Ch 2). The new mappings are unpublished, so nothing new appears yet. **If more than two chips appear, the published-only filter has been broken.**
2. `/pillars/sleep-optimization` — still **no** Training section (Chapter 9 unpublished).
3. `/training/connect-to-the-universe` — Practice/Meditation still deep-link to the Brahman session with `&step=`; the pillar card still reads "Connection to Brahman".
4. `/training/consciousness-and-self-awareness` — meditation still runs the **inline timer** (its pillar is a journal practice, no session mapping).
5. Temporarily flip Chapter 9 to `status: "published"` in a scratch branch and confirm `sleep-optimization` and `movement` **both** show "Taught in Chapter 9", and Chapter 9's own practice link resolves to the Movement session, not Sleep. Revert.

---

## 7. Out of scope

- Writing chapters 3–11. This brief only makes the *relationship* expressible.
- Achievements, Goals, Posters integrations — deliberately deferred.
- Any change to Sessions, Journal, Dashboard or Progress.
- Displaying multiple pillars on the chapter page — the chapter shows its primary pillar; add `pillarsForChapter()` later if that's wanted.

---

## 8. One-paragraph summary for the implementer

`relatedPillarSlug` on `TrainingChapter` is single-valued, so a chapter can only be linked to one pillar — Chapter 9 is titled "Movement, Exercise and **Sleep Optimization**" yet only `movement` fits. Replace it with **two explicit fields**: `relatedPillarSlugs?: string[]` (every pillar the chapter teaches) and `primaryPillarSlug?: string` (the one pillar whose practice the chapter's CTA opens, which must appear in the array). Do **not** encode "primary" as array position — order must carry no behaviour, and there is a test for that. Update `chaptersForPillar()` to `.includes()`, `linkForChapter()` to read `primaryPillarSlug`, point the plain-reader fallback at `linkForChapter()`, and extend the tests with the primary-in-related invariant. No component changes and no UI change today: the new mappings are all on unpublished chapters and surface only as those chapters publish. Approve the schema separately from the editorial mappings — Chapter 9 is strong, Chapters 3 and 5 need confirmation against actual content. Coverage of 11/11 is explicitly not a goal.
