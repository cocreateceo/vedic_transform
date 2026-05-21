# 10X Vedic Transform — Project Vision (Aspirational)

> **READ THIS FIRST:** Everything in this document is **NOT YET BUILT**. It describes the platform we want 10X Vedic Transform to become, not what runs today. For the current state of the codebase, see `PROJECT_BLUEPRINT.md`. Any LLM consuming this document must treat every subsystem below as a design target, not as code that exists.
>
> Each section is tagged with one of:
> - **`[GAP]`** — does not exist; this is the design.
> - **`[PARTIAL]`** — a primitive form exists today (called out explicitly); this section describes the mature form.
> - **`[ASPIRATION]`** — strategic direction, no implementation detail yet.

---

## 1. North-star framing

Today: a 48-day Vedic transformation web app.
Target: an **AI-powered Vedic transformation operating system** — personalized, intelligent, multi-surface, monetizable, operable at scale.

The shift is from *"track your habits"* to *"a system that understands you and adapts."*

## 2. Future system architecture

The current architecture (see `PROJECT_BLUEPRINT.md` §4) is a single layered stack: client → API → Lambda → DynamoDB, plus 5 push crons. The mature platform adds five missing layers.

```
USER ECOSYSTEM (today)                ECOSYSTEM ADDITIONS (target)
│                                     │
├── Public Funnel Layer ✓             ├── Behavioral Intelligence Layer    [GAP]
├── Identity Layer ✓                  │   ├── Cross-pillar correlation engine
├── Transformation Engine ✓           │   ├── Habit-causality model
├── AI Layer (chat only) [PARTIAL]    │   ├── Predictive drop-off model
├── Content Ecosystem ✓               │   └── Recovery-trigger detection
├── Engagement Engine ✓               │
└── Infrastructure Layer ✓            ├── Recommendation Engine            [GAP]
                                      │   ├── Pillar-of-the-day
                                      │   ├── Content recommendation
                                      │   ├── Session recommendation
                                      │   └── Dosha-aware personalization
                                      │
                                      ├── Analytics & Metrics Layer        [GAP]
                                      │   ├── Event pipeline
                                      │   ├── Warehouse + BI
                                      │   └── In-product metrics surface
                                      │
                                      ├── Admin / Operations Layer         [GAP]
                                      │   ├── User analytics console
                                      │   ├── Content management
                                      │   ├── Push campaign manager
                                      │   ├── AI prompt management
                                      │   ├── Experiment controls
                                      │   └── Moderation + support
                                      │
                                      └── Community & Monetization Layer   [ASPIRATION]
                                          ├── Social / cohort journeys
                                          ├── Marketplace
                                          ├── Subscriptions / entitlements
                                          └── Enterprise / institutional
```

## 3. AI Operating Layer `[PARTIAL]`

**Today:** `POST /chat` → Claude with a "Vedic Guide" system prompt. That's it. Mood, journal, check-in, and journey state are NOT fed into the model.

**Target:** AI becomes a layer the rest of the product consumes, not a single endpoint.

```
                       ┌─────────────────────────────────────┐
                       │     AI Operating Layer (target)     │
                       └───────────────────┬─────────────────┘
                                           │
   ┌────────────────────┬───────────────────┼───────────────────┬────────────────────┐
   │                    │                   │                   │                    │
┌──▼────────┐    ┌──────▼──────┐     ┌──────▼──────┐    ┌───────▼───────┐   ┌────────▼────────┐
│ Guide Chat│    │ Daily Brief │     │ Mood/Journal│    │ Smart Reminder│   │ Transformation  │
│ (LIVE)    │    │ Generation  │     │ Analysis    │    │ Timing        │   │ Scoring         │
└───────────┘    └─────────────┘     └─────────────┘    └───────────────┘   └─────────────────┘
                       │                   │                   │                    │
                       └───────────────────┼───────────────────┼────────────────────┘
                                           │                   │
                                  ┌────────▼──────────┐  ┌─────▼─────────────┐
                                  │ User Context Pack │  │ Behavioral Engine │
                                  │ (mood + journal + │  │ (cross-pillar +   │
                                  │  check-ins +      │  │  causality model) │
                                  │  dosha + journey) │  │                   │
                                  └───────────────────┘  └───────────────────┘
```

**Capability stack (proposed build order):**

1. **User Context Pack** — Lambda helper that, given a `userId`, returns a structured JSON snapshot: dosha, focus pillars, current day, last 7 days of check-ins, last 7 mood logs, last 3 journal entries, current streak, last assessment scores. Goes into every AI call. *Prerequisite for everything below.*
2. **Daily brief generator** — once per user per day, emit a personalized "today's intention" using the Context Pack. Stored in `Notifications` and shown on the dashboard.
3. **Recovery coach** — when a user enters `AT-RISK` or `DORMANT` state, generate a personalized re-engagement message instead of the current static cron copy.
4. **Mood/journal analysis** — periodic summarization of journal entries into themes ("you've written about sleep 4 times this week"). Returned by `GET /data/insights`.
5. **Smart reminder timing** — replace the 15-min cron fan-out with model-suggested times per user based on past check-in timestamps.
6. **Transformation Score** — single 0–100 metric per user, computed daily, combining streak, pillar coverage, mood trend, journal frequency, assessment delta.

**Required infrastructure:**
- Prompt registry (versioned, stored in DynamoDB or git).
- Per-user AI rate limits + cost ledger.
- Async invocation path (SQS + Lambda) for daily-brief generation — not in the request hot path.

## 4. Behavioral Intelligence layer `[GAP]`

The hypothesis the product is built on: **pillars are not independent.** Sleep affects mood. Mood affects meditation. Meditation affects stress. Stress affects everything. The data to validate this is already being collected; nothing reads it correlationally.

**Target flow:**

```
Inputs (already collected today)            Engine (does not exist)          Output (does not exist)
─────────────────────────────────           ──────────────────────           ──────────────────────
DailyCheckins (per pillar) ──┐
MoodLogs (energy/stress/sleep) ─┐
GratitudeEntries ──────────────┐ ──► Cross-pillar correlation ──► User-facing insights
Intentions ────────────────────┤      (rolling 14d window,         "Your meditation
Manifestations ────────────────┤       per-user, computed in        consistency drops
SelfAssessments ───────────────┘       a daily Lambda)              when sleep <6h"
                                                                    │
                                       Causality model ──────────────┤
                                       (predicts which pillar         ▼
                                        intervention has the          AI guide
                                        highest leverage this week)   recommendation
                                                                      ▼
                                       Drop-off predictor ───────►   Recovery cron
                                       (catches AT-RISK users         targeting
                                        24h earlier than the
                                        current 72h threshold)
```

**Implementation path:**
- Phase 1: a nightly Lambda computes correlations per user, writes to a new `BehavioralSignals` table.
- Phase 2: `GET /data/insights` consumes `BehavioralSignals` for richer text.
- Phase 3: the recovery cron and AI Guide consume `BehavioralSignals` to choose messaging.

## 5. Recommendation Engine `[GAP]`

**Today:** pillar recommendations are static (the same 11 for everyone, ordered by category). Content recommendations don't exist — the library shows all content.

**Target:**

```
Input:  user.dosha + focus_pillars + recent_checkins + last_assessment
        + content_progress + time_of_day
Engine: rules first → embeddings later
Output: ranked list of {pillar, session, wisdom_card, audio} for "now"
```

- **V1 (rules):** lookup tables per dosha (Vata/Pitta/Kapha) recommending pillars and content. Cold-start friendly. Owned by content team via the admin console.
- **V2 (embeddings):** content + user-context embeddings, cosine match, re-ranked by recency.
- **V3 (LLM-mediated):** Claude proposes the daily plan from the User Context Pack.

## 6. Analytics & Metrics layer `[GAP]`

**Today:** CloudWatch Lambda logs. Nothing else. No DAU, no retention curve, no funnel.

**North-star metrics (proposed):**

```
Top of funnel              In-product                       Retention
───────────────            ──────────────                   ──────────
Dosha-test starts          Daily Active Users               D1 / D7 / D30
Dosha-test completes       Check-in completion rate          Streak health
Signup conversion          Pillar coverage / user            48-day completion %
Onboarding completes       AI engagement %                   Reactivation rate
                           Session duration                  Push opt-in / CTR
                           Karma earned / user / week
```

**Build path:**
1. Add an `events` table or a Kinesis Firehose → S3 → Athena pipeline.
2. Emit events from every Lambda (`checkin.completed`, `journey.advanced`, `streak.broken`, `dosha.completed`, etc.).
3. Day-2 admin dashboards over Athena/QuickSight, or pipe to PostHog.

## 7. Admin / Operations layer `[GAP]`

This is the most operationally critical gap. The product cannot scale past a few hundred users without it.

```
/admin (gated by Users.role === 'admin')
├── Dashboard         — DAU, signups today, completion rate, AI cost
├── User search       — find a user by email; view profile, journey, streak, recent activity
├── Cohort analytics  — filter by signup date, dosha, focus pillar
├── Content manager   — CRUD wisdom, blog, audio metadata; without redeploying
├── Push campaigns    — broadcast to filtered cohorts; preview, schedule, cancel
├── Reminder windows  — adjust the per-cron time windows globally
├── AI prompts        — version + roll out system prompts and prompt templates
├── Badge editor      — define new badges, set thresholds
├── Experiments       — flag definitions, variant assignments, rollouts
├── Moderation        — view + remove journal entries reported by users
└── Support tools     — impersonate user (read-only), reset password, refund karma
```

**Build approach:** add a `role` field to `Users`, gate `/admin` Next.js routes by role-check Lambda, reuse existing handlers behind `?admin=true` lookups. Start with the top 3 rows; the rest is iterative.

## 8. Content Pipeline `[PARTIAL]`

**Today:** wisdom cards, blog posts, audio assets are all hand-authored files in `src/data/` and re-deployed. Pillar PDFs are generated by `scripts/generate-pillar-pdfs.mjs`.

**Target:**

```
Authoring sources                Pipeline                       Delivery
──────────────────              ──────────                      ─────────
Markdown (drafts)        ──┐
Audio recordings ───────┐  │
External wisdom sources ┤  │── Review queue ── Categorization ── Pillar mapping ── Dosha tags
Voice notes (CEO) ──────┘  │       │              │                  │              │
                           │       ▼              ▼                  ▼              ▼
                           │   Admin console approves    Content table         Recommendation
                           │                              (Dynamo or S3+         engine indexes
                           │                              CMS-backed)
                           │                                                       ▼
                           └─►                                              User feed / library
```

**Key change:** content becomes data, not code. New blog post = a row in `Content` table, not a Git commit.

## 9. Engagement Engine v2 `[PARTIAL]`

**Today:** 5 fixed crons, fixed time windows, same message for everyone in a state.

**Target:**
- Per-user reminder time (learned from check-in history).
- Per-cohort campaign manager (admin-defined).
- AI-personalized message body per user per send.
- Multi-channel: Web Push → Email → SMS → in-app, with channel preference per user.
- Quiet hours.

## 10. Future state machine — engagement extensions

The current state machine (Blueprint §3) covers lifecycle. Engagement adds an orthogonal axis:

```
HIGH ENGAGEMENT      ↔  POWER USER (eligible for advocacy program)
STEADY               ↔  default
LOW ENGAGEMENT       ↔  primary target of AI re-engagement
CHURNED              ↔  >30d dormant; win-back campaign + survey
ADVOCATE             ↔  completed 48 days + opted in to refer
```

A user has both a lifecycle state and an engagement state. The AI Guide message picker uses the cross-product.

## 11. Phased roadmap

> Indicative ordering — actual sequencing lives in `docs/ROADMAP.md`.

**Phase 1 — Foundation (today, mostly done)**
Web app, 48-day journey, 11 pillars, dosha test, push, basic chat. Ship to first users.

**Phase 2 — Intelligence**
User Context Pack → AI-personalized daily brief → live behavioral insights → smart reminder timing. AI stops being an isolated chat.

**Phase 3 — Operations**
Admin console MVP: user search, content manager, push campaigns. Unblocks scaling beyond a few hundred users.

**Phase 4 — Analytics**
Event pipeline + retention dashboards. Required before any growth experiments.

**Phase 5 — Community & Monetization**
Cohort journeys, leaderboards, paid tier (Stripe), entitlements.

**Phase 6 — Platform**
Marketplace (third-party teachers/content), enterprise / institutional tier, mobile parity, i18n.

## 12. Cross-cutting prerequisites

Things that need to land before any of the above is comfortable to build:

- **Event emission** in every Lambda (lightweight, even before a warehouse exists).
- **Structured logging** + Sentry or equivalent error aggregator.
- **`role` field on `Users`** + admin-gated route group.
- **Prompt versioning** before AI is consumed across the product.
- **Per-user feature flagging** to roll out V2 cron timing safely.

## 13. What this document is NOT

- Not a commitment timeline.
- Not a description of code that exists.
- Not a contract — any handler, table, or layer described here can be redesigned before it's built.

For reality, read `PROJECT_BLUEPRINT.md`. For sequencing, read `docs/ROADMAP.md`. This document is the bridge between them.
