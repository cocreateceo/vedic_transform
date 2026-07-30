# Training Integration — Final Integration & Deployment Review

**Date:** 2026-07-30
**Scope:** Training internal UX, Phase D navigation, Phase E1–E5 cross-surface integration, `JournalEntries` infrastructure.
**Status:** Feature-complete and **DEPLOYED TO PRODUCTION** on 2026-07-30.
**Recommendation:** ~~GO WITH CONDITIONS~~ → **SHIPPED. Production gate passed.**

> **Deployment record — 2026-07-30**
>
> | | |
> |---|---|
> | Dev deploy | `npx sst deploy --stage dev` → `✓ Complete` |
> | Dev gate | 40/40 real-infrastructure checks passed (§9.0-R); test rows deleted |
> | Production deploy | `npx sst deploy --stage production` → `✓ Complete` |
> | Production API | `https://sav5ro38xi.execute-api.us-east-1.amazonaws.com` |
> | Production site | `https://10x.vedics.net` |
> | New table | `vedic-transform-production-JournalEntriesTable-sfcbsunm` |
> | Production gate | **PASSED** — see §9.0-P-R |
> | Rollback point | `54846b7` on `main`, plus the uncommitted changes listed in §9.A |
> | Shipped alongside | The pre-existing live-cohort registration work (`10x-vedic` pages, `class-registration`), deployed deliberately at the user's instruction |
>
> Test data created by the production gate was **fully removed**: the
> `JournalEntries` row, the `ContentProgress` row and the throwaway `Users` row
> are all deleted (verified: 0 rows, `Users.id` → `None`).

This review is written from the implementation that exists, verified by fresh commands run on 2026-07-30, not from the original plan.

---

## 1. Executive status

| Area | Implemented | Verified | Production dependency | Remaining risk |
|---|---|---|---|---|
| Training internal UX | Yes | Runtime + unit | None (app code) | Low |
| Phase D navigation | Yes | Runtime + unit | None | Low |
| E1 Dashboard → Training | Yes | Runtime + unit | None | Low |
| E2 Training ↔ Sessions | Yes | Runtime (real session driven to completion) + unit | None | Low |
| E3 Training ↔ Journal | Yes | UI runtime (mocked API) + unit + source-pattern + **real dev-stage round trip** | `JournalEntries` table must be deployed to production | Low |
| E4 Progress → Training | Yes | Runtime + unit | None | Low |
| E5 Pillars ↔ Training | Yes | Runtime + unit | None | Low |
| `JournalEntries` infrastructure | Declared, linked, Lambda branch written | **Deployed and exercised on dev** | Requires `sst deploy --stage production` | Low |
| Production deployment | Not performed | — | — | — |

### 1.1 The gap that existed — now closed

Until 2026-07-30 the `JournalEntries` Lambda had **never run**: E3's runtime verification drove the real UI, but `/data/journal` was fulfilled by an in-memory fake that *mirrored* the identity rule rather than executing it.

**That gap is closed.** The dev stage was deployed and the full round trip run against real API Gateway, Lambda and DynamoDB — 40 checks, all passing (§9.0-R). The Lambda bundles, DynamoDB accepts the item, `GetCommand` behaves as assumed on a cold table, and the deterministic id prevents duplicates in practice, not just in theory.

Residual risk is now ordinary deployment risk: production has different data and scale, but the same code path is proven.

### 1.2 Explicitly out of scope / not introduced

- **Achievements integration — out of scope.** Not implemented.
- **Goals integration — out of scope.** Not implemented.
- **Posters integration — out of scope.** Not implemented.
- **No Day N → Chapter N mapping was introduced anywhere.** Connections are semantic, via `relatedPillarSlug`.
- **Training does not modify Journey streak, karma, or check-in.** Enforced by a source guard test over `components/features/training/**`, `todays-teaching-card.tsx`, `training-selection.ts`, `training-steps.ts`, `learning-map.ts`, `training-progress.ts`, `training-return-context.ts`, `use-chapter-progress.ts`, `app/(main)/training/**`, asserting none contains `/data/checkin`, `/data/journey` or `/data/reports`; and by runtime request recording on every E1/E2/E3/E4/E5 case.

---

## 2. Final user flow

Terminology is fixed (see §7.1): **Journey** = the 48-day programme; **Training** = the book.

### Primary path

```
Dashboard
 ├─ Today's Practice          ← the daily action, unchanged, still first
 └─ Today's Teaching          ← E1, compact, below Practice
      → Training chapter (resumes at the next incomplete activity)
          ├─ Understand   Watch · Read
          ├─ Explore      Key Learnings
          ├─ Practice     Daily Practices ──┐
          │               Guided Meditation ─┤
          │                                  ├─ mapped pillar → Sessions (E2)
          │                                  │    → complete → marks ONLY the
          │                                  │      launching activity
          │                                  │    → "Back to Chapter N"
          │                                  └─ no mapping → inline timer,
          │                                       stays in the chapter
          ├─ Reflect      Reflection → Journal (E3)
          │                 → prose saves to JournalEntries
          │                 → then Training reflection marked
          │                 → "Back to Chapter N"
          │               Self-Assessment · Daily Challenge
          └─ Complete     seal → next chapter
 Progress → Training card (E4, read-only summary)
```

**Not every activity leaves the chapter.** Chapter 2's meditation has no Sessions mapping (its pillar is a journal practice), so it runs a self-guided timer inline. That is deliberate, not a gap.

### Semantic pillar round trip (E5)

```
Training Chapter ──"practiced as"──▶ Related Pillar
Related Pillar ──"taught in Chapter N"──▶ Training Chapter
```

Both directions resolve through one map. No progress dependency in either direction.

---

## 3. Training UX result

| Change | Result |
|---|---|
| One-spine chapter experience | `chapter-journey.tsx` deleted; each activity is the section that delivers it |
| 5-stage presentation over 8 tracked activities | Understand → Explore → Practice → Reflect → Complete; stages appear as eyebrows and in the outline rail |
| Repeated "Step N of 8" removed | Gone from every section; the count appears once, in the outline |
| Compact returning-user hero | Compact is the server-rendered default → returning readers see no layout shift |
| Cinematic zero-progress treatment | Expands to ~50vh only for a reader with no progress in that chapter |
| One primary CTA per activity | Filled buttons reserved for actions that go somewhere; completion is a quiet text control |
| Sequential quiz | One question at a time, then a score card with per-question review; explanations retained |
| Completed Read review state | Movements collapse on return; every title, preview and duration still visible |
| Exercises artwork restored | `sectionArt.exercises` was authored, tested, and rendered nowhere reachable — now rendered once, above the practice cards |
| Mobile Outline treatment | Edge tab is desktop-only; mobile gets a pill + bottom sheet, raised above the assistant FAB |
| Collapsed non-current Parts | Current Part expanded; others collapse to a summary row, expandable in place |
| One landing Resume CTA | Hero carries status; the current-chapter card owns the action |
| Training terminology separated | "Phase" → "Part"; the landing h1 is "Your Training" |

### Measured heights

| Surface | Before | After | |
|---|---|---|---|
| Chapter 2, partial progress | 10,275px | **7,469px** | −27.3% |
| Chapter 1, zero progress | 10,619px | **8,784px** | −17.3% |
| /training desktop | 2,570px | **2,156px** | −16.1% |
| /training mobile | 3,302px | **2,765px** | −16.3% |

**This is not content reduction.** Every authored field still renders: sections, gallery, study cards, key takeaways, exercises, meditation minutes, reflection questions, quiz items *including explanations*, daily challenge, summary, and all three `sectionArt` images — one of which was previously unreachable and is now visible for the first time. The reduction came from removing duplicated blocks, collapsing the hero for returning readers, making the quiz sequential, and cutting inter-section padding.

### Height cost of the integrations

| Surface | Before | After | Delta |
|---|---|---|---|
| Dashboard (E1) | 3,335px | 3,481px | +146px (+4.4%); the card itself is 123px — shorter than every other dashboard card (min 130, median 178) |
| /progress (E4) | 2,859px | 3,035px | +176px (+6.2%) |
| /pillars (E5) | 1,940px | 1,962px | +22px (+1.1%), one wrapped line on one of eleven cards |

---

## 4. Architectural ownership

| Module | Owns |
|---|---|
| `src/lib/training-selection.ts` | Current chapter selection; next incomplete activity and its deep link; whole-course counts (`summarizeTraining`). Pure — no I/O (unit-asserted). |
| `src/lib/learning-map.ts` | Chapter ↔ pillar relationship in both directions; **published-only filtering**; chapter → session-key relationship; the `training:<slug>` source marker. |
| `src/lib/training-progress.ts` | **The only writer of Training activity progress, and the only chapter-sealing authority.** |
| `src/lib/training-steps.ts` | The step and stage model; `hasLearningCycle`; anchor and content-id conventions. |
| `src/lib/training-return-context.ts` | Training ↔ Sessions URL contract: builds the outbound link and validates the return context. |
| `src/lib/journal-context.ts` | Training ↔ Journal context; precedence against `?action=gratitude\|intention`; resolving a stored entry's prompt for display. |
| `JournalEntries` (table) | Generic user-authored prose. Training context is optional metadata (`source`, `chapterSlug`, `promptIndex`), never the entry's type. |
| `src/constants/navigation.ts` | The one navigation model for desktop and mobile. |

**No duplicate chapter-completion authority remains.** `use-chapter-progress.ts` delegates to `markTrainingActivity`; Sessions calls the same function; Journal calls the same function. `ChapterActions`' manual "mark complete" button — the second writer that caused the original contradiction — exists only on pages with no learning cycle (the Introduction and the unreachable plain-reader fallback), so it can never race the derived seal.

---

## 5. Progress model

- **The Introduction is completable content** — sealed by its own explicit control — **but has no 8-activity learning cycle.** `hasLearningCycle(chapter)` (`number >= 1`) gates this, because the Introduction routes to `IntroductionExperience`, which renders no step sections and no `#step-` anchors.
- **Numbered published chapters currently expose 8 tracked activities** each.
- **Only published content contributes to totals.** Coming-soon chapters never inflate them.
- **Stale or malformed progress ids cannot inflate totals** — unit-tested with junk keys.
- **Training completion is independent of Journey participation.**

**Current data (not a permanent product rule):** 3 published Training items (Introduction + Ch1 + Ch2) and 16 learning-cycle activities (8 + 8). Sealing only the Introduction correctly reads "1 of 3 available chapters complete · 0 of 16 activities".

---

## 6. Cross-surface write matrix

| Surface | May write | Never writes |
|---|---|---|
| Training chapter | `training:<slug>:<activity>`; chapter seal (derived) | Journey day, streak, karma, check-in |
| Sessions **opened with valid Training context** | Exactly the activity named by `step=` — practice **or** meditation, never both | The other activity; chapter seal directly |
| Sessions, ordinary visit | Its own existing `/data/checkin` (unchanged pre-existing behaviour) | Any Training progress |
| Journal, Training reflection save | `JournalEntries` **first**, then `training:<slug>:reflection` | Journey day, streak, karma, check-in |
| Journal, ordinary use | Gratitude/intention/manifestation + their pre-existing `creditPillar` | Any Training progress |
| Progress | Nothing | Everything |
| Pillars | Nothing | Everything |
| Dashboard teaching card | Nothing | Everything |

**No Training integration path writes Journey day, streak, karma or check-in.** Sessions' own check-in on completion is pre-existing behaviour that E2 left untouched — the session still counts as daily practice, and the Training activity is a separate record. One action, two independent ledgers, neither derived from the other.

---

## 7. Navigation

**Desktop** — one model in `src/constants/navigation.ts`:

| Group | Items |
|---|---|
| TODAY | Dashboard · Sessions · Journal |
| JOURNEY | Training · Pillars · Goals |
| PROGRESS | Progress · Achievements · Insights · Reports · Mood |
| EXPLORE | Library · Posters · Wisdom · Dosha Quiz |
| Footer (icon row) | Reminders · Settings · Admin (role-gated) |

**Mobile:** `Today | Practice | Learn | Progress | More`. The More sheet renders the same groups minus what the bar already covers, so nothing appears twice on one screen.

Both navs derive from the same model, and a test pins the old desktop and mobile route lists so regrouping cannot silently drop a route. All 17 previous routes remain reachable, verified in the rendered DOM on both widths.

### 7.1 Terminology rule

| Term | Means |
|---|---|
| **Journey** | The overall 48-day programme |
| **Training** | The educational / book experience |
| **Parts** | Training curriculum grouping |
| **Pillars** | Practice domains |
| **Sessions** | The practices themselves |

"Journey" is never a heading for Training. The JOURNEY nav group is the umbrella containing Training, Pillars and Goals — Training is an item inside it, not a synonym for it.

---

## 8. Verification summary

**Fresh run, 2026-07-30:**

```
npx tsc --noEmit -p tsconfig.json     exit 0
npx next build                        exit 0 — compiled, 90/90 static pages
npx vitest run                        20 files, 205 tests, all passing
```

### ⚠ Scope limit of `tsc` — stated explicitly

| Layer | Typecheck status |
|---|---|
| **Next application** (`src/**`) | `tsc --noEmit` — **clean**. |
| **Lambda / `functions/**`** | **Not covered by the root `tsconfig.json`** — it excludes `functions/`, `sst.config.ts`, `scripts/` and `mobile/`. |
| **Direct check of `functions/data/journal.ts`** | Only the repo's known/generated SST `Resource` typing diagnostics, which affect **existing and new resources alike** (`GratitudeEntries`, `Intentions`, `Manifestations`, `JwtSecret` fail identically to `JournalEntries`). `sst-env.d.ts` is regenerated by SST on dev/deploy. **No other type errors. Not a regression from this work.** |
| **Actual Lambda runtime** | **Deployment-gated — see §9.0.** |

### Verification level by claim

| Claim | Level |
|---|---|
| Chapter content preservation (every authored field renders) | Runtime + data unit tests |
| Training progress persists across reload | Runtime (mocked API) |
| Sessions practice/meditation distinction | **Runtime, real session driven to completion**, writes recorded |
| Ordinary Sessions isolation (no Training write) | **Runtime**, after real completion |
| Invalid Sessions return-context rejection | Runtime (5 of 6 after real completion; the mismatched-session case opens a different tab and was asserted on load) + 21 unit tests |
| Journal save ordering (prose first, progress second) | Runtime **against a mocked `/data/journal`** |
| Journal progress-sync failure recovery + retry | Runtime (mocked) |
| Journal idempotency (edit / double-submit / retry) | Runtime (mocked) + unit tests of the id function |
| **The journal Lambda `entry` branch itself** | **Source-pattern assertions only — never executed** |
| Progress cross-surface agreement | Runtime, three surfaces compared in one session |
| Pillar published-only filtering | Runtime + unit |
| Desktop/mobile route preservation | Runtime DOM + unit |
| No Training → Journey coupling | Runtime request recording + source guard tests |

---

## 9. Production deployment plan

**Do not deploy as part of this review.** This is the sequence for when the decision is made.

### 9.0 PRE-PRODUCTION GATE — **SATISFIED on the dev stage, 2026-07-30**

> **Result: PASSED.** `npx sst deploy --stage dev` completed (`✓ Complete`), creating
> `vedic-transform-dev-JournalEntriesTable-rvnemkfn`. A throwaway user then drove the
> full round trip against the **real** API Gateway → Lambda → DynamoDB — nothing mocked —
> and **all 40 checks passed**. Test rows were deleted afterwards (0 remaining).
>
> This retires the "never executed" risk in §1.1. The Lambda's `entry` branch has now
> run in a real AWS environment on the same code that would ship.
>
> - Dev API: `https://qibh9ko05c.execute-api.us-east-1.amazonaws.com`
> - Dev site: `https://d1yh6dvtm1f8n4.cloudfront.net`
>
> Evidence recorded in §9.0-R below. The production fallback path is retained for
> reference but is no longer the primary gate.

### 9.0-R Dev-stage round-trip result

| Check | Result |
|---|---|
| Exactly one `JournalEntries` item per user + chapter + prompt | ✅ |
| `body` contains only the user's prose | ✅ (authored questions absent) |
| `source = "training"` | ✅ |
| `chapterSlug` correct; `promptIndex` null for a chapter-level reflection | ✅ |
| `userId` is the server-authenticated identity | ✅ — a client-supplied `userId` was **ignored**, and the request updated the caller's own entry rather than writing under the spoofed id |
| `createdAt` / `entryDate` survive an edit | ✅ |
| `updatedAt` changes on edit | ✅ |
| No check-in / karma / streak side effect | ✅ — karma, streak and completedPillars all unchanged across the whole run |
| Re-save updates rather than duplicates | ✅ — same deterministic id, `updated: true`, still one entry |
| Distinct `promptIndex` yields a distinct entry | ✅ |
| Ordinary entries append (two on the same day) | ✅ |
| Empty body / training-without-chapterSlug / unknown type | ✅ all rejected 400 |
| Backwards-compatible GET | ✅ `journalEntries` added; `gratitudeEntries`, `intentions`, `manifestations`, `todayIntention` all still present |
| Gratitude + intention regression | ✅ save and read back unchanged |
| Training progress recorded, chapter **not** sealed early | ✅ |

Cleanup: the four `JournalEntries` rows created by the test user were deleted; the query now returns 0. The throwaway `Users`, `ContentProgress`, `GratitudeEntries` and `Intentions` rows remain on the disposable dev stage.

### 9.0-P-R PRODUCTION GATE RESULT — **PASSED, 2026-07-30**

Run against the live production API immediately after deploy, with a throwaway account, gated to stop on first failure.

| Gate check | Result |
|---|---|
| Backwards-compatible GET (`journalEntries` added; `gratitudeEntries`, `intentions`, `manifestations` intact) | ✅ |
| Reflection save — first production execution of the `entry` branch | ✅ created, `updated: false` |
| Exactly one training entry | ✅ |
| `body` is exactly the user's prose | ✅ |
| Server-authenticated `userId` | ✅ |
| Training metadata (`source`, `chapterSlug`) correct | ✅ |
| `createdAt` / `entryDate` set | ✅ |
| Training progress recorded and reads back | ✅ |
| Edit → same deterministic id, `updated: true`, **still one entry** | ✅ |
| `createdAt` / `entryDate` preserved; `updatedAt` changed | ✅ |
| karma / streak / completedPillars unchanged | ✅ |
| Exactly one Training key written | ✅ |

**Cleanup completed:** `JournalEntries` row, `ContentProgress` row and the throwaway `Users` row all deleted and verified absent.

### 9.0-P PRODUCTION FALLBACK (historical — superseded by 9.0-R and 9.0-P-R)

`JournalEntries` is the only new infrastructure/persistence path in the whole D/E scope, and **the actual Lambda → DynamoDB write has never executed.** It has been structurally tested, unit-tested, and exercised through the real UI against a *fake* `/data/journal`. This gate exists because that is a materially different level of assurance from the rest of the work.

#### Preferred: verify on a non-production stage first

If a usable non-production SST stage with the required secrets and resources already exists, deploy the current build there and run one **real** round trip:

```
Training Reflection → Journal → save
  → real /data/journal Lambda
  → real JournalEntries DynamoDB write
  → Training reflection completion
  → reload  (existing prose loads)
  → edit + re-save  (same deterministic entry updates, no duplicate)
```

Then confirm directly in DynamoDB and CloudWatch logs:

| # | Check |
|---|---|
| 1 | Exactly **one** `JournalEntries` item exists for that user + chapter + prompt |
| 2 | `body` contains **only** the user's prose — no authored question text |
| 3 | `source === "training"` |
| 4 | `chapterSlug` and `promptIndex` are correct (`promptIndex` null for a chapter-level reflection) |
| 5 | `userId` is the **server-authenticated** identity, not anything client-supplied |
| 6 | `createdAt` and `entryDate` survive the edit unchanged |
| 7 | `updatedAt` changes on the edit |
| 8 | **No** check-in / `creditPillar` side effect — no new `DailyCheckins` row, no streak or karma movement |

Delete the test `JournalEntry` afterwards if appropriate.

**Do NOT create a new staging architecture solely for this test.**

#### Stage availability — CONFIRMED

`npx sst secret list --stage dev` (read-only, run 2026-07-30) returns **all five required secrets present** on `vedic-transform/dev`: `JwtSecret`, `AnthropicApiKey`, `GoogleClientId`, `VapidPublicKey`, `VapidPrivateKey`.

**A usable non-production stage exists. The preferred branch of this gate applies; the fallback below is not needed unless the dev deploy itself fails.**

Supporting detail:

- `.sst/stage` is **`cocreatepatta`** — a personal stage, the default target of a bare `sst deploy`, and known to lack secrets. Not the stage to use.
- The `dev` stage site is already CORS-allow-listed in `sst.config.ts` (`d1uhicw265qo0d.cloudfront.net`), so a dev deploy's site can call the dev API without a config change.
- `removal: input?.stage === "production" ? "retain" : "remove"` — the dev stage and its tables are destroy-on-remove, so a dev `JournalEntries` table is disposable.

> **Two operational notes, outside this review's scope but worth acting on separately.**
> 1. `sst secret list` prints secret **values** in plaintext. Anywhere that output is captured (CI logs, transcripts, shared terminals) now contains live credentials.
> 2. **The dev `JwtSecret` value is self-describing in a way that suggests it may
>    be shared with production** (its literal value names the production stage).
>    If both stages hold the same value, JWTs are valid across them — a dev token
>    would authenticate against production. **The value has been written into a
>    working transcript, so treat it as exposed and rotate it rather than relying
>    on redaction.** Confirm with `npx sst secret list --stage production`,
>    compare, and set a distinct dev value with
>    `npx sst secret set JwtSecret <new> --stage dev`.
>    *Rotating invalidates existing sessions on that stage — expect users to be
>    logged out.* Pre-existing and unrelated to the Training work.

#### Fallback: if no usable non-production stage exists

Retain **GO WITH CONDITIONS** and treat the production reflection smoke steps as a **HARD deployment gate**, in this order:

1. Deploy with the explicit production stage.
2. Confirm the `JournalEntries` table exists.
3. Use a **designated test account**.
4. Immediately execute the real reflection save.
5. Verify the DynamoDB item and Lambda logs against checks 1–8 above.
6. Reload and edit the reflection.
7. Confirm the deterministic id prevented duplication (still exactly one item).
8. Confirm Training reflection progress synchronised.
9. Confirm Journey day, check-in, streak and karma were untouched.

**Only after those pass, continue the remaining smoke suite (§10).**

#### If any JournalEntries/Lambda verification fails

**STOP the rollout.** Do not continue the remaining smoke tests as though deployment succeeded.

Prefer **application rollback while retaining the `JournalEntries` table and any prose already written successfully** (§11). **Do not drop the table as part of normal rollback.**

### A. Pre-deploy checks

1. `git status` — the working tree contains **unrelated pre-existing changes** (`10x-vedic` cohort pages, `class-registration`, `sst-env.d.ts`) that predate this work. Decide deliberately whether they ship together; this review covers only the Training work.
2. `npx tsc --noEmit && npx next build && npx vitest run` — all green.
3. Confirm the target stage. **`npx sst deploy` without `--stage production` deploys to a personal stage and fails on missing secrets.**
4. Note the current deployment for rollback (git SHA and, if available, the previous SST app version).
5. Confirm no other deploy is in flight.

### B. Infrastructure + application deployment

SST deploys infrastructure and the Next app together:

```
npx sst deploy --stage production
```

There is no separate application build step — the SST `Nextjs` construct builds and uploads as part of the deploy.

### C. Expected infrastructure change

- **One new DynamoDB table: `JournalEntries`** — PK `id`, GSI `userId-index`, on-demand billing per the project's existing table convention.
- The four `/data/journal` routes' Lambda gains `JournalEntries` in its link set (new IAM grants + `Resource` binding).
- `sst-env.d.ts` regenerates to include `JournalEntries`.
- **No change to any existing table.** No migration. No reinterpretation of existing rows.

### D. Immediate smoke tests

Run §10 in order. The first three journal items are the highest-value: they are the first real execution of the Lambda branch.

### E. Rollback

See §11 — application rollback and data rollback are deliberately separated.

---

## 10. Production smoke tests

Ordered; stop and assess on any failure.

1. Log in as a real authenticated user.
2. **Dashboard loads**; existing cards render.
3. **Today's Teaching** appears below Today's Practice, names the correct chapter, one CTA.
4. **/training** loads; hero status, current-chapter card, Parts (current expanded).
5. **Introduction** opens; no activity counts claimed for it.
6. **Chapter 1** opens; cinematic hero at zero progress.
7. Complete one activity → **reload** → progress persisted; hero shows compact resume.
8. **Chapter resume deep link** from Dashboard lands on the right `#step-` anchor.
9. **Mapped Sessions round trip:** Chapter 1 → Practice → Brahman session → complete → only `…:practice` marked → "Back to Chapter 1".
10. Repeat for **Meditation**; confirm it marks `…:meditation` and **not** practice.
11. **Ordinary Sessions isolation:** open `/sessions?practice=brahman` directly, complete → **no Training progress written**.
12. **Self-guided meditation:** Chapter 2 → Meditate → inline timer, no `/sessions` link.
13. **Training reflection → Journal:** Chapter 1 → Reflect → Journal opens with prompts, empty editor → write → Save.
14. **`JournalEntries` persistence:** reload `/journal` → the entry appears under Written Entries with its chapter label; the body contains **only** the user's words.
15. Re-open the same reflection → prior text loads → edit → save → **still one entry**, not two.
16. **Progress-sync retry:** only if it can be induced safely — otherwise skip and rely on the mocked verification. Do not fabricate a failure in production.
17. **Ordinary gratitude** save works and still credits its pillar.
18. **Ordinary intention** save works and still credits its pillar.
19. **`/journal?action=gratitude`** focuses the gratitude card with its practice context; same for `?action=intention`.
20. **/progress** Training card shows counts matching /training.
21. **Mapped pillar detail** (Connection to Brahman) shows "Taught in Chapter 1" and links to the chapter.
22. **Unmapped pillar** (Healing Meditation) shows **no** Training UI.
23. **Mobile navigation:** bottom bar Today/Practice/Learn/Progress/More; More sheet groups.
24. **Mobile Training chapter:** outline pill opens the bottom sheet, clear of the nav and the assistant FAB.

### Cleanup after smoke testing

Steps 13–15 and 17–18 create **real rows under a real user**:

- `JournalEntries` — the reflection entry (deterministic id `sha256("training|<userId>|connect-to-the-universe|all")[:32]`).
- `GratitudeEntries` / `Intentions` — today's rows for the test user, plus their `DailyCheckins` credit.
- `ContentProgress` — `training:connect-to-the-universe:*` rows and possibly `training-connect-to-the-universe`.

Prefer a dedicated test account so no cleanup is needed. If a real account is used, delete those rows afterwards — and note that removing the `ContentProgress` rows is what resets the Training state; deleting the journal entry alone leaves the activity marked complete.

---

## 11. Rollback plan

### Application rollback (first resort)

Redeploy the previous application version:

```
git checkout <previous-sha>
npx sst deploy --stage production
```

This restores the previous UI and Lambda behaviour. Consequences:

- Training integration UI disappears; navigation reverts.
- `ContentProgress` rows written in the meantime remain and are harmless — the old Training UI reads the same keys and simply shows fewer of them.
- **`JournalEntries` rows are untouched and remain safe.**

### Compatibility: old app code with the new table still deployed

Safe. The old `journal.ts` rejects `type: "entry"` with a 400 and never queries `JournalEntries`; the old GET simply omits `journalEntries` from its response, and the old client never read that field. The table sits idle. **Old code + new table is a compatible combination.**

The reverse — new app code without the table — is **not** safe: the reflection save would fail at the Lambda. That is why infrastructure and application deploy together via SST.

### Infrastructure / data rollback (last resort, deliberate only)

**Do not drop `JournalEntries` as a rollback step.** Once a user has saved a reflection, that table holds user-authored prose that exists nowhere else — deleting it is unrecoverable data loss, and the table is inert under old application code.

If the Journal reflection feature must be disabled:

1. Roll the **application** back (above). The table remains, costs effectively nothing on-demand, and retains user data.
2. Only if the table itself must go — after confirming it holds no user rows worth keeping — remove the resource from `sst.config.ts`, take an on-demand backup or export first, and deploy. Treat this as a separate, explicitly-approved operation, never an incident reflex.

---

## 12. Known limitations / accepted scope

1. Only currently published chapters participate in the live Training connections (Introduction, Ch1, Ch2).
2. Only pillars with a **published** related chapter show a Training relationship — 2 of 11 today.
3. Not every meditation maps to a Sessions practice; self-guided inline mode is intentional, not a gap.
4. Generic `JournalEntries` are deliberately **not** in the AI context pack (`user-context.ts` untouched) — that is a separate product/privacy decision.
5. Achievements, Goals and Posters Training integrations are intentionally deferred.
6. No numerical Day/Phase → Chapter mapping exists; connections are semantic via pillar.
7. Production Journal reflection requires the `JournalEntries` infrastructure deployment.
8. `tsc` does not cover `functions/` or `sst.config.ts` (§8) — mitigated by the dev-stage execution in §9.0-R.
9. The dev stage retains a throwaway test user and its `Users`/`ContentProgress`/`GratitudeEntries`/`Intentions` rows (`e3-gate-1785421917868@example.com`). Harmless on a disposable stage; delete if dev data cleanliness matters.

---

## 13. GO / NO-GO

### **GO WITH CONDITIONS**

The work is feature-complete, typecheck/build/tests are clean, and every cross-surface rule is enforced by tests rather than convention. There are no known defects.

**Conditions to satisfy at deploy time:**

1. ~~Satisfy the §9.0 pre-production gate.~~ **DONE** — verified on the dev stage 2026-07-30, 40/40 checks passed (§9.0-R). No longer a condition.
2. **Deploy with `--stage production`.** A bare `sst deploy` targets the personal stage `cocreatepatta` and dies on missing secrets.
3. **Deploy infrastructure and application together.** New app code without `JournalEntries` breaks the reflection save.
4. **Decide deliberately about the unrelated working-tree changes** (`10x-vedic` cohort pages, `class-registration`) — they are not part of this review.
5. **Use a designated test account**, or plan the row cleanup in §10.

**Blockers:** none.

**Risk position after the dev gate:** the previously-accepted risk — a first real Lambda execution in production — **no longer applies.** The persistence path has been exercised end to end on real AWS infrastructure with the shipping code, and the application-rollback path preserves user prose regardless.
