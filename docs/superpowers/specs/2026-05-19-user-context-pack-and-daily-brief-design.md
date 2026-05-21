# User Context Pack + Daily Brief — Design

**Status:** Approved 2026-05-19
**Implements:** Phase 2 wedge from `docs/PROJECT_VISION.md` §3 step 1–2
**Companions:** `docs/PROJECT_BLUEPRINT.md` (current state), `docs/PROJECT_VISION.md` (aspirational target)

---

## 1. Goal

Build the **User Context Pack** — a reusable Lambda helper that fans out the per-user DynamoDB queries every AI feature is going to need (mood, journal, check-ins, dosha, journey, streak, karma, assessments) and returns one structured JSON snapshot.

Ship a thin V1 consumer of it: a **Daily Brief** endpoint that powers a new dashboard card. V1 is template-only (no AI calls). The AI swap-in is a one-function replacement in V2.

## 2. Non-goals

- **No AI in V1.** The brief is composed from a deterministic template + the top insight from existing `analyzeInsights()`. Reason: a brand-new user has almost no context for AI to synthesize; template wording is honest. AI lands once data is rich.
- **No new DynamoDB table.** Brief is live-computed on each GET, like `/data/insights`.
- **No cron.** Lazy on dashboard load.
- **No new analyzer.** Reuse `functions/lib/insights.ts`.

## 3. Architecture

```
Dashboard (client)
   │
   │ GET /data/daily-brief
   ▼
functions/data/daily-brief.ts      (thin Lambda handler)
   │
   ├─► functions/lib/user-context.ts        (NEW — the reusable artifact)
   │     parallel queries over 11 tables → UserContextPack
   │
   └─► functions/lib/insights.ts            (existing — reused, not duplicated)
         analyzeInsights() → ranked Insight[]
   │
   ▼
functions/lib/daily-brief.ts        (NEW — pure function)
   composeBrief(pack, insights) → DailyBrief
   │
   ▼
returns { brief, contextPack } (pack stripped of internal `_raw` field)
   │
   ▼
src/components/features/dashboard/daily-brief-card.tsx   (NEW)
   rendered above TodaysPractice on dashboard
```

**Future AI swap:** replace `composeBrief()` with `composeBriefAi(pack, insights)` that calls Claude with the pack as JSON in the prompt. No other change required.

## 4. UserContextPack contract

The load-bearing artifact for all future Phase 2 work. Bounded windows so it stays small enough to pass to an LLM later (~3–6 KB).

```ts
export type LifecycleState =
  | 'registered'   // Users row exists, no Journey
  | 'new'          // Active Journey, zero check-ins
  | 'active'       // Check-in within last 24h
  | 'at-risk'      // Last check-in 1–2 days ago
  | 'dormant'      // ≥3 days since last check-in
  | 'completed';   // Journey day ≥ 48

export interface UserContextPack {
  user: { id, name, email, dosha, doshaSecondary, createdAt, onboardingCompleted };
  journey: { isActive, day (1..48), totalDays: 48, startDate, status };
  streak: { current, longest, shieldsAvailable, lastCheckinDate, daysSinceLastCheckin };
  focusPillars: Array<{ pillarId, pillarSlug, pillarName, priority }>;
  pillarStats: {
    completedToday: string[],          // pillar slugs done today (UTC)
    weeklyCompletionPct: number,       // 0..100, over last 7d
    strongestPillarSlug, weakestPillarSlug, daysSinceWeakest
  };
  recentMood: {
    last7Avg: { moodScore, energy, stress, sleepQuality },  // all 1..5 averaged
    lastEntry: { date, notes } | null,
    count7d: number
  };
  recentJournal: {
    gratitude: Array<{ date, lines: string[] }>,  // last 3 entries, 3 lines each
    intentions: Array<{ date, text }>,            // last 3
    manifestations: Array<{ title, description, isAchieved }>  // last 3
  };
  lastAssessment: { date, type, overallWellbeing, ...8 dimension scores, oneWordFeeling } | null;
  karma: { total, todayEarned, last7Earned };
  lifecycleState: LifecycleState;
  generatedAt: ISO8601;
  todayUtcDate: 'YYYY-MM-DD';
  _raw: { checkins, checkins7d }   // internal-only, stripped before client response
}
```

**Derivation rules:**
- `lifecycleState` is computed at the end from all other fields. Single source of truth.
- All "last 7 days" windows use `now - 7*86400000` UTC.
- Numeric averages are rounded to 1 decimal place.
- `_raw.checkins` is exposed so `analyzeInsights()` (which expects the raw row shape) can run without re-querying. Stripped before HTTP response.

## 5. DailyBrief contract

```ts
export interface DailyBrief {
  greeting: string;     // "Day 14, Gopinath." — lifecycle-aware
  headline: string;     // top insight title OR lifecycle fallback
  body: string;         // 1–2 sentence description
  cta?: { label, href };// optional pillar deep-link
  source: 'template';   // future: 'ai' | 'hybrid'
  generatedAt: ISO8601;
}
```

**Composition rules:**
1. `greeting` is keyed off `lifecycleState` + `journey.day` + first name.
2. If `pack._raw.checkins.length >= 3` AND `insights[0]` exists → use top insight for headline + body.
3. Otherwise → use lifecycle-state fallback copy (handles the cold-start UX honestly).
4. `cta` = pillar deep-link if top insight has a pillar `category`; otherwise lifecycle CTA (start journey, pick pillars, see report).

## 6. Lambda handler

`functions/data/daily-brief.ts` — single GET route, ~20 lines:

```ts
1. OPTIONS short-circuit
2. getUserFromEvent → 401 on no JWT
3. getUserContextPack(userId)
4. analyzeInsights({ checkins, streakCurrent, journeyDay, totalKarma })
5. composeBrief(pack, insights)
6. Strip pack._raw, return { brief, contextPack }
```

No new errors, no retries, no caching — it's a fan-out + compose. P99 should match `/data/insights` (~200-400ms warm).

## 7. SST wiring

Add to `sst.config.ts`:

```ts
const dailyBriefLink = [
  users, journeys, streaks, focusPillars, dailyCheckins,
  moodLogs, gratitudeEntries, intentions, manifestations,
  selfAssessments, karmaTransactions, jwtSecret,
];
api.route("GET /data/daily-brief", {
  handler: "functions/data/daily-brief.handler",
  link: dailyBriefLink,
});
```

11 DynamoDB links + the JWT secret. This is the same fan-out the Vision doc described — it concentrates the per-user query surface in one place so future endpoints can ride the same pack.

## 8. UI

`DailyBriefCard` — placed on the dashboard between the welcome banner and `TodaysPractice`. Styled with an indigo/purple gradient (visually distinct from the existing orange/amber welcome banner). Sparkles icon. Optional CTA button.

States:
- **Loading** — animated skeleton matching the card height.
- **Loaded** — greeting (small label) + headline (bold) + body + optional CTA.
- **Error** — silent. Card hides. Brief is enhancement, not required to use the dashboard.

## 9. Lifecycle state machine (used by Context Pack + Brief)

| State        | Trigger                                                                 |
|--------------|-------------------------------------------------------------------------|
| `registered` | Users row exists, no active Journey                                     |
| `new`        | Active Journey, `_raw.checkins.length === 0`                            |
| `active`     | `daysSinceLastCheckin === 0`                                            |
| `at-risk`    | `daysSinceLastCheckin === 1 or 2`                                       |
| `dormant`    | `daysSinceLastCheckin >= 3` OR `daysSinceLastCheckin === null` w/ Journey |
| `completed`  | `journey.status === 'completed'` (day ≥ 48 or no active journey but a past one) |

Matches the blueprint's documented state machine. The 5 push crons (`MorningPush`, `EveningPush`, `SandhyaPush`, `StreakSavePush`, `RecoveryPush`) can later consume `getUserContextPack(userId).lifecycleState` instead of recomputing it.

## 10. Error handling

- Missing Users row → still return a pack with empty defaults; brief falls back to a welcome message. (Shouldn't happen in practice since JWT requires a Users row, but defensive.)
- Empty journey → pack returns `journey.status: 'not-started'`, `day: 0`, lifecycle `registered`.
- A failing sub-query throws → bubbles up to a 500 from the Lambda. Acceptable; brief is non-critical, the dashboard handles errors silently.

## 11. Testing

V1 ships without unit tests — matches existing codebase conventions (no test setup in `functions/`). Manual verification:

1. **Cold-start user:** new account, no journey, no check-ins. Expect: brief shows welcome greeting + "Start your 48-day journey" CTA.
2. **Day 1 user:** journey started, 0 check-ins. Expect: brief shows "your journey begins" + focus-pillar CTA.
3. **Active user:** 7-day streak, 30 check-ins. Expect: brief shows top insight from analyzeInsights.
4. **At-risk user:** 1 day since last check-in. Expect: streak-save framing.
5. **Completed user:** day 48+. Expect: completion brief + reports CTA.

## 12. Out of scope (future PRs)

- AI generation (Phase 2 step 2 in vision doc)
- Daily brief notifications (separate from in-app dashboard surface)
- `BehavioralSignals` nightly job (Phase 2 step 3)
- Caching the pack server-side (only worth it once AI generation makes it expensive)
- Mobile-app parity (mobile/app/(tabs)/index.tsx)

## 13. Files changed

**New:**
- `functions/lib/user-context.ts`
- `functions/lib/daily-brief.ts`
- `functions/data/daily-brief.ts`
- `src/components/features/dashboard/daily-brief-card.tsx`

**Modified:**
- `sst.config.ts` — add `GET /data/daily-brief` route
- `src/app/(main)/dashboard/page.tsx` — render `<DailyBriefCard />`

**No DB schema change.** No new table, no migration.
