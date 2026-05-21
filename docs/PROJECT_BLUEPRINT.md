# 10X Vedic Transform — Project Blueprint

> A single-file handoff for any LLM/engineer that needs to understand WHAT exists, HOW it's wired, and WHY. This document describes **reality only** — what is built, deployed, and runnable today. For the roadmap of unbuilt subsystems (admin, analytics, AI orchestration, recommendation engine, community), see the companion `PROJECT_VISION.md`. If something is not in this document, assume it does not exist yet.

---

## 1. One-line summary

A 48-day Vedic transformation program delivered as a serverless web app (with an Expo mobile companion) — 11 wellness "pillars" tracked daily, an AI Vedic Guide chat assistant (Anthropic Claude), gamification (karma, streaks, badges), and a public dosha (Ayurvedic body type) test.

## 2. Product / domain context

- **Audience:** wellness seekers; users complete a 48-day journey combining Vedic practices and modern habit-tracking.
- **Core mental model:** 11 "pillars" grouped Body (4) / Mind (4) / Spirit (3). Each user picks 1–3 focus pillars and logs daily check-ins to earn karma and maintain streaks.
- **Gamification loop:** daily check-in → karma points → streak (with buyable "Karma Shield" to absorb one missed day) → badges → live-computed insights.
- **Public funnel:** marketing site + free anonymous **dosha test** (90-day TTL'd result link) → signup → onboarding → 48-day journey.
- **Three surfaces:**
  1. **Web app** (Next.js, deployed via SST `Nextjs` to CloudFront, primary surface).
  2. **Mobile app** (Expo / React Native, in `mobile/`, internal/EAS-build phase).
  3. **Landing page** (static HTML in `landing-page/`).

## 3. User lifecycle — state machine

The product is best understood as a state machine over each user. Five push crons in `functions/crons/` exist specifically to nudge transitions between these states.

```
   ┌──────────┐
   │ VISITOR  │  (public site, no account)
   └─────┬────┘
         │  takes dosha test
         ▼
   ┌──────────────────┐
   │ ANON DOSHA USER  │  AnonymousDoshaResults (90-day TTL)
   └─────┬────────────┘
         │  POST /auth/register  or  /auth/google
         ▼
   ┌────────────┐
   │ REGISTERED │  Users row exists, no Journey yet
   └─────┬──────┘
         │  /onboarding → POST /data/journey + POST /data/focus-pillars
         ▼
   ┌────────────┐    (no check-in 1d)    ┌──────────┐    (no check-in 3d+)   ┌──────────┐
   │   ACTIVE   │ ─────────────────────► │ AT-RISK  │ ──────────────────────►│ DORMANT  │
   │  (Journey  │ ◄───────────────────── │          │ ◄──────────────────────│          │
   │  in flight)│        check-in        └─────┬────┘     check-in           └────┬─────┘
   └─────┬──────┘                              │                                  │
         │  Day 48 complete                    │ StreakSavePush / RecoveryPush    │ RecoveryPush
         ▼                                     ▼                                  ▼
   ┌────────────┐                       (returns to ACTIVE)               (returns to ACTIVE)
   │ COMPLETED  │
   └────────────┘
```

**State signals** (derived live from DynamoDB, no `userState` column):
- `VISITOR` → no `Users` row.
- `ANON DOSHA USER` → row in `AnonymousDoshaResults`, no `Users` row.
- `REGISTERED` → `Users` row, no `Journeys` row.
- `ACTIVE` → `Journeys` row with `status != completed`, latest `DailyCheckins.createdAt < 24h`.
- `AT-RISK` → 24h–72h since last check-in. Targeted by `StreakSavePush`.
- `DORMANT` → >72h since last check-in. Targeted by `RecoveryPush`.
- `COMPLETED` → `Journeys.day >= 48`.

> The state machine is **derived**, not stored. Any handler can compute it from `Journeys` + last `DailyCheckins` row.

## 4. Architecture at a glance

```
┌─────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│ Next.js 15 site     │    │ Expo / RN mobile     │    │ Static landing page  │
│ (App Router, SSR    │    │  (mobile/)           │    │ (landing-page/)      │
│  via sst.aws.Nextjs)│    └─────────┬────────────┘    └──────────┬───────────┘
└──────────┬──────────┘              │                            │
           │  Bearer JWT (jose HS256, 7d, localStorage)           │
           ▼                         ▼                            ▼
                  ┌───────────────────────────────────┐
                  │  AWS API Gateway v2 (HTTP API)    │
                  │  - explicit CORS allowlist        │
                  │  - OPTIONS handled by API GW      │
                  └───────────────┬───────────────────┘
                                  │
                  ┌───────────────▼───────────────────┐
                  │  Lambda handlers (Node 20)        │
                  │  functions/{auth,data,chat,crons} │
                  │  - SST `Resource.<Table>.name`    │
                  │  - no ORM, in-memory joins        │
                  └───┬───────────────────────────┬───┘
                      │                           │
              ┌───────▼────────┐         ┌────────▼────────┐
              │ DynamoDB (20)  │         │ Anthropic Claude │
              │ userId-index   │         │ REST (chat only) │
              └────────────────┘         └─────────────────┘

   Scheduled side: 5 EventBridge crons (rate 15 min) fan out Web Push (VAPID) by user-local time.
```

### System layer view (what each "layer" actually is in this repo)

```
USER ECOSYSTEM
│
├── Public Funnel Layer            ── src/app/(public)/* + landing-page/
│   ├── Landing page
│   ├── Anonymous Dosha Test       ── /dosha-test, /dosha-test/quiz, /dosha-test/result/[id]
│   ├── Blog & SEO content         ── src/data/blog/*  (static MD/TSX content)
│   └── Public marketing pages
│
├── Identity Layer                 ── functions/auth/*
│   ├── Email/password (bcrypt)
│   ├── Google Sign-In (GIS)
│   ├── JWT (jose, HS256, 7d)
│   └── Users table (+ email-index)
│
├── Transformation Engine          ── functions/data/* + functions/lib/*
│   ├── Pillar definitions         ── Pillars table (seeded) + src/constants/
│   ├── Journey state              ── functions/data/journey.ts
│   ├── Karma ledger               ── functions/data/checkin.ts, buy-shield.ts
│   ├── Streak counter             ── Streaks table, updated in checkin
│   ├── Goals (weekly)             ── functions/data/goals.ts
│   ├── Self-assessment            ── functions/data/assessment.ts
│   └── Insights (computed live)   ── functions/data/insights.ts + functions/lib/insights.ts
│
├── AI Layer                       ── functions/chat/chat.ts ONLY
│   └── Vedic Guide chat           ── POST /chat → Claude REST, "Vedic Guide" system prompt
│      (Mood/journal/checkin data is NOT yet fed into AI. See PROJECT_VISION.md.)
│
├── Content Ecosystem              ── src/data/* + src/components/features/wisdom + audio
│   ├── Daily wisdom (static)
│   ├── Audio sessions             ── components/features/audio (player only)
│   ├── PDFs                       ── scripts/generate-pillar-pdfs.mjs + @react-pdf/renderer
│   └── ContentProgress table      ── tracks library/session completion
│
├── Engagement Engine              ── functions/crons/* + functions/data/push-*
│   ├── ReminderSettings (per-user)
│   ├── PushSubscriptions (per-device)
│   ├── 5 EventBridge crons (rate 15 min):
│   │     morning, evening, sandhya, streak-save, recovery
│   └── In-app Notifications table
│
└── Infrastructure Layer           ── sst.config.ts
    ├── SST v4 (single IaC file)
    ├── API Gateway v2 (HTTP API)
    ├── Lambda (Node 20)
    ├── DynamoDB (20 tables)
    ├── CloudFront + S3 (Nextjs construct)
    ├── EventBridge (5 crons)
    └── ACM + Route53 (10x.vedics.net, production only)
```

> Conspicuously absent layers (Analytics, Admin, Recommendation, Behavioral Intelligence, Community, Experimentation) → see `PROJECT_VISION.md`.

## 5. Daily-execution flow

What actually happens when an authenticated user opens the dashboard:

```
Web client (src/app/(main)/dashboard)
     │
     │  parallel React Query fetches:
     ├── GET /auth/me              → user profile
     ├── GET /data/journey         → current day, status
     ├── GET /data/focus-pillars   → 1–3 selected pillar IDs
     ├── GET /data/checkin         → today's checkin rows (one per pillar)
     ├── GET /data/insights        → computed live from above tables
     └── GET /data/notifications   → in-app feed
                │
                ▼
   User completes a pillar → POST /data/checkin
                │
                ▼
   functions/data/checkin.ts:
     1. Verify JWT (getUserFromEvent)
     2. Put DailyCheckins row
     3. Increment Streaks (or apply Karma Shield)
     4. Insert KarmaTransactions row
     5. Check badge thresholds → UserBadges
     6. Advance Journeys.day if all focus pillars done
     7. Return updated streak + karma to client
                │
                ▼
   React Query invalidates: journey, checkin, insights, achievements
```

Background loop (independent of client):
```
EventBridge → rate(15 min) → each cron Lambda:
  1. Scan ReminderSettings
  2. For each user, compute local time from tz
  3. If local time matches the cron's window (e.g. morning 5:30–6:00) AND
     the user's state matches (e.g. RecoveryPush requires DORMANT)
  4. Look up PushSubscriptions and send via web-push (VAPID)
  5. Insert a Notifications row
```

## 6. Repository layout

```
vedic-transform/
├── src/                          # Next.js web app
│   ├── app/
│   │   ├── (auth)/               # login, register, onboarding
│   │   ├── (main)/               # dashboard, pillars, pillars/[id], goals,
│   │   │                         # progress, journal, mood, insights,
│   │   │                         # reports, library, sessions, achievements,
│   │   │                         # settings, wisdom, reminders,
│   │   │                         # dosha-assessment
│   │   ├── (public)/             # about, blog, blog/[slug], faq,
│   │   │                         # how-it-works, pillars-overview,
│   │   │                         # testimonials, contact, privacy, terms,
│   │   │                         # dosha-test, dosha-test/quiz,
│   │   │                         # dosha-test/result/[id]
│   │   ├── home-client.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── features/             # analytics, assessment, audio, auth, chat,
│   │   │                         # daily, dashboard, dosha, goals, insights,
│   │   │                         # landing, notifications, onboarding,
│   │   │                         # pillars, reminders, reports, sessions,
│   │   │                         # wisdom
│   │   ├── layout/               # header, sidebar, mobile-nav, navbar
│   │   └── ui/                   # primitives
│   ├── context/                  # auth-context, audio-player-context
│   ├── constants/, data/, lib/, config/, types/
│
├── functions/                    # Lambdas (separate package.json)
│   ├── auth/                     # login, register, me, google
│   ├── chat/                     # chat.ts (Anthropic proxy)
│   ├── crons/                    # morning-push, evening-push,
│   │                             # sandhya-push, streak-save-push,
│   │                             # recovery-push (rate 15 min)
│   ├── data/                     # achievements, assessment, buy-shield,
│   │                             # checkin, content-progress,
│   │                             # dosha-test-anonymous, focus-pillars,
│   │                             # goals, insights, journal, journey, mood,
│   │                             # notifications, push-subscribe, push-test,
│   │                             # reminders, reports, user
│   └── lib/                      # utils (db/JWT/CORS), badges, insights,
│                                 # pillars, push, push-time
│
├── mobile/                       # Expo / React Native companion
├── landing-page/                 # Standalone marketing HTML
├── docs/                         # ARCHITECTURE, ROADMAP, etc. + this file
├── public/                       # Static assets, PWA manifest, SW
├── scripts/                      # icon gen, pillar PDF gen
├── sst.config.ts                 # Single source of truth for infra
├── next.config.ts
└── package.json
```

## 7. Tech stack

| Layer            | Choice                                                              |
|------------------|---------------------------------------------------------------------|
| Frontend         | Next.js **15.5** (App Router, SSR via `sst.aws.Nextjs`), React 18.3 |
| Language         | TypeScript 5                                                        |
| Styling          | Tailwind CSS v4                                                     |
| State / data     | Zustand, TanStack React Query                                       |
| Animation/charts | framer-motion, recharts                                             |
| Icons            | lucide-react                                                        |
| Auth             | `jose` (HS256 JWT), `bcryptjs`, Google Identity Services            |
| PDF              | `@react-pdf/renderer`                                               |
| API              | AWS API Gateway v2 HTTP API → Lambda (Node 20)                      |
| DB               | DynamoDB via `@aws-sdk/lib-dynamodb` (no ORM)                       |
| AI               | Anthropic Claude (Sonnet) via direct REST (chat only, today)        |
| Push             | Web Push (VAPID) via `web-push`, EventBridge crons                  |
| Infra            | SST v4 — `Nextjs`, `ApiGatewayV2`, `Dynamo`, `Secret`, `Cron`       |
| Mobile           | Expo (managed), `expo-router`, EAS Build                            |
| Cloud            | AWS only (us-east-1)                                                |

## 8. Data model — DynamoDB tables (20)

All "per-user" tables share the pattern: hash key `id`, plus a `userId-index` GSI.

**Identity & journey**
- `Users` — accounts, profile, dosha result (`email-index` GSI)
- `Journeys` — 48-day journey records
- `Streaks` — current/longest streak
- `Pillars` — 11 pillar definitions (seeded, no GSI)

**Daily activity**
- `DailyCheckins`, `GoalTasks`, `FocusPillars`, `KarmaTransactions`
- `GratitudeEntries`, `Intentions`, `Manifestations`
- `MoodLogs`, `SelfAssessments`, `ContentProgress`

**System**
- `Badges`, `UserBadges`
- `UserInsights` — **legacy**, no longer read or written; left linked for backwards compat
- `ReminderSettings` — hash key is `userId` (one row per user, no GSI)
- `Notifications`, `PushSubscriptions`
- `AnonymousDoshaResults` — **90-day TTL** on `ttl` attribute

> DynamoDB has no joins. Handlers query each table and join in memory.

## 9. System relationships matrix

Which Lambda reads/writes which tables, and what other subsystems each one depends on. This is the "what breaks what" map.

| Subsystem            | Handler(s)                                         | Reads                                                                 | Writes                                          | Depends on                                  |
|----------------------|----------------------------------------------------|-----------------------------------------------------------------------|-------------------------------------------------|---------------------------------------------|
| Auth                 | `auth/login`, `register`, `me`, `google`           | `Users`                                                               | `Users`                                         | `JwtSecret`, `GoogleClientId`               |
| User profile         | `data/user`                                        | `Users`                                                               | `Users`                                         | Auth                                        |
| Journey              | `data/journey`                                     | `Journeys`, `Streaks`                                                 | `Journeys`, `Streaks`                           | Auth                                        |
| Check-in (core loop) | `data/checkin`                                     | `DailyCheckins`, `Streaks`, `Journeys`                                | `DailyCheckins`, `Streaks`, `KarmaTransactions`, `UserBadges`, `Journeys` | Journey, Badges, Karma                      |
| Karma Shield         | `data/buy-shield`                                  | `KarmaTransactions`, `Streaks`                                        | `KarmaTransactions`, `Streaks`                  | Karma ledger, Streak engine                 |
| Goals                | `data/goals`                                       | `GoalTasks`                                                           | `GoalTasks`                                     | Auth                                        |
| Focus pillars        | `data/focus-pillars`                               | `FocusPillars`                                                        | `FocusPillars`                                  | Journey (must exist first)                  |
| Journal              | `data/journal`                                     | `GratitudeEntries`, `Intentions`, `Manifestations`                    | same three                                      | Auth                                        |
| Mood                 | `data/mood`                                        | `MoodLogs`                                                            | `MoodLogs`                                      | Auth                                        |
| Assessment           | `data/assessment`                                  | `SelfAssessments`                                                     | `SelfAssessments`                               | Auth                                        |
| Insights (live)      | `data/insights` + `lib/insights`                   | `DailyCheckins`, `Streaks`, `Journeys`, `KarmaTransactions`           | (nothing; `UserInsights` is legacy)             | Check-in, Streak, Karma, Journey            |
| Reminders            | `data/reminders`                                   | `ReminderSettings`                                                    | `ReminderSettings`                              | Auth                                        |
| Reports              | `data/reports`                                     | `Journeys`, `DailyCheckins`, `KarmaTransactions`, `Streaks`, `UserBadges` | —                                           | Most of the transformation engine           |
| Notifications        | `data/notifications`                               | `Notifications`                                                       | `Notifications`                                 | Push crons (writers)                        |
| Content progress     | `data/content-progress`                            | `ContentProgress`                                                     | `ContentProgress`                               | Auth                                        |
| Achievements         | `data/achievements`                                | `UserBadges`, `KarmaTransactions`                                     | —                                               | Karma, Badge engine                         |
| Web Push subscribe   | `data/push-subscribe`                              | `PushSubscriptions`                                                   | `PushSubscriptions`                             | Auth, `VapidPublicKey` (client)             |
| Web Push test        | `data/push-test`                                   | `PushSubscriptions`                                                   | —                                               | VAPID keys                                  |
| Push crons (5)       | `crons/morning-push`, `evening`, `sandhya`, `streak-save`, `recovery` | `ReminderSettings`, `PushSubscriptions`, `Journeys`, `Streaks`, `DailyCheckins` | `Notifications`                              | VAPID keys, user-local time logic           |
| Public dosha test    | `data/dosha-test-anonymous`                        | `AnonymousDoshaResults`                                               | `AnonymousDoshaResults` (90-day TTL)            | —                                           |
| AI chat              | `chat/chat`                                        | —                                                                     | —                                               | `AnthropicApiKey`, JWT                      |

**Reading this table:** if you change `Streaks` schema, you must update `data/checkin`, `data/journey`, `data/buy-shield`, `data/reports`, `data/insights`, and all 5 push crons. SST `link` arrays in `sst.config.ts` are the runtime expression of this matrix.

## 10. API surface (`sst.config.ts` is authoritative)

```
# Auth
POST /auth/register            POST /auth/login
GET  /auth/me                  POST /auth/google

# User
GET  /data/user                PATCH /data/user

# Journey & streaks
GET  /data/journey             POST /data/journey
POST /data/streaks/buy-shield

# Daily activity
GET  /data/checkin             POST /data/checkin
GET  /data/goals               POST/PATCH/DELETE /data/goals
GET  /data/focus-pillars       POST /data/focus-pillars
GET  /data/journal             POST/PATCH/DELETE /data/journal
GET  /data/mood                POST /data/mood
GET  /data/assessment          POST /data/assessment

# Insights / reports / content
GET  /data/insights            POST/PATCH /data/insights   (POST/PATCH effectively no-op)
GET  /data/reports
GET  /data/content-progress    POST /data/content-progress
GET  /data/achievements

# Reminders & notifications
GET  /data/reminders           PUT   /data/reminders
GET  /data/notifications       PATCH /data/notifications

# Web Push
POST /data/push/subscribe      DELETE /data/push/subscribe
POST /data/push/test

# Public dosha test (no auth)
POST /data/dosha-test/anonymous
GET  /data/dosha-test/anonymous

# AI
POST /chat
```

## 11. Scheduled jobs

All scheduled `rate(15 minutes)`; each handler fans out per user based on user-local time + reminder preferences + user state.

| Cron              | Handler                                       | Targets state    | Purpose                       |
|-------------------|-----------------------------------------------|------------------|-------------------------------|
| `MorningPush`     | `functions/crons/morning-push.handler`        | ACTIVE           | Brahma Muhurta morning nudge  |
| `EveningPush`     | `functions/crons/evening-push.handler`        | ACTIVE           | Evening check-in nudge        |
| `SandhyaPush`     | `functions/crons/sandhya-push.handler`        | ACTIVE           | Sandhya meditation (3x/day)   |
| `StreakSavePush`  | `functions/crons/streak-save-push.handler`    | AT-RISK          | Save streak before midnight   |
| `RecoveryPush`    | `functions/crons/recovery-push.handler`       | DORMANT          | Re-engage after >72h          |

## 12. Secrets (SST `Secret`)

| Secret              | Used by                                           |
|---------------------|---------------------------------------------------|
| `JwtSecret`         | All auth + data handlers                          |
| `AnthropicApiKey`   | `POST /chat`                                      |
| `VapidPublicKey`    | Web Push (also exposed to client as `NEXT_PUBLIC_*`) |
| `VapidPrivateKey`   | Web Push (server-side only)                       |
| `GoogleClientId`    | `POST /auth/google` + GIS button on client        |

## 13. Frontend route map

- **`(public)/`** SSR'd & crawlable: `about`, `blog`, `blog/[slug]`, `faq`, `how-it-works`, `pillars-overview`, `testimonials`, `contact`, `privacy`, `terms`, `dosha-test`, `dosha-test/quiz`, `dosha-test/result/[id]`.
- **`(auth)/`** `login`, `register`, `onboarding`.
- **`(main)/`** authenticated SPA shell: `dashboard`, `pillars`, `pillars/[pillarId]`, `goals`, `progress`, `journal`, `mood`, `insights`, `reports`, `library`, `sessions`, `achievements`, `settings`, `wisdom`, `reminders`, `dosha-assessment`.

> The repo migrated from `output: 'export'` static export to `sst.aws.Nextjs` (SSR) specifically so `(public)/` is crawlable. See `docs/MIGRATION_SUMMARY.md`.

## 14. Mobile app (`mobile/`)

Expo Router app with two route groups: `(auth)` (login/register/onboarding) and `(tabs)` (index/pillars/sessions/journal/more). Uses `react-native-reanimated` (with the worklets package — see `mobile_eas_build_gotchas` memory). EAS project IDs/owner in `mobile_eas_references` memory.

## 15. Documentation in `docs/`

- `ARCHITECTURE.md`, `API_DOCUMENTATION.md`
- `DEPLOYMENT.md`, `DEPLOYMENT_CHECKLIST.md`, `QUICK_START.md`
- `PROJECT_SUMMARY.md`, `PROJECT_FLOW.md` (+ PDF)
- `ROADMAP.md`, `COMPETITOR_GAP_ANALYSIS.md`
- `COST_ANALYSIS.md`, `TROUBLESHOOTING.md`
- `MIGRATION_SUMMARY.md` (static-export → SSR migration)
- `CONTENT_PRODUCTION_CHECKLIST.md`, `CONTENT_TO_PRODUCE.md`, `AUDIO_AUDIT.md`
- `SELF_SERVICE_TRACKING_PLAN.md`
- `PROJECT_VISION.md` ← **forward-looking subsystems (not yet built)**
- `PROJECT_BLUEPRINT.md` ← this file

## 16. Conventions / gotchas

- **Lambda handler pattern** — `functions/lib/utils.ts` exports `db`, `ok`, `err`, `getUserFromEvent`, `generateId`. Handlers call `getUserFromEvent` to validate JWT, then `Resource.<Table>.name` for table refs.
- **No `Access-Control-Allow-Origin` in Lambda** — API Gateway v2 handles CORS from the allowlist. Adding it in code causes duplicate headers.
- **In-memory joins** — when a route needs related data (e.g. checkin + pillar), it queries multiple tables in parallel and joins.
- **Insights are computed live** — `UserInsights` table is legacy; POST/PATCH on `/data/insights` are effectively no-ops.
- **Public dosha results expire** — `AnonymousDoshaResults` uses DynamoDB TTL (90 days).
- **Domain ownership** — only the `production` stage owns `10x.vedics.net`; other stages set `siteDomain = undefined`.
- **Removal policy** — production uses `removal: "retain"` so `sst remove` does NOT wipe DynamoDB data.
- **State is derived, not stored** — there is no `userState` column. Lifecycle state is computed on the fly from `Journeys` + last `DailyCheckins`.

## 17. Why these choices

Strategic decisions worth knowing for any LLM proposing changes.

**Why serverless (SST + Lambda + DynamoDB)?**
Single founder, unpredictable demand, want pay-per-use. SST gives one `sst.config.ts` for tables + routes + secrets + crons + the Next.js site — no Terraform sprawl.

**Why DynamoDB (over Postgres / RDS)?**
Per-user access patterns are simple key+GSI queries (`get my checkins`, `get my mood`, `get my journey`). No analytical queries on the hot path (those run in handlers, in memory). DynamoDB's $0 idle cost matters for an unlaunched product.

**Why one table per entity (vs single-table design)?**
Deliberately chose readability over query efficiency. The app does ~20 reads/writes per active user per day — single-table design's complexity isn't justified at this scale. Reconsider at 100k DAU.

**Why no ORM?**
Three reasons: smaller Lambda bundle, SST's `Resource.<Table>.name` already gives type-safe table names at build time, and joins happen in memory anyway. An ORM buys nothing here.

**Why JWT in localStorage (not httpOnly cookie)?**
The web client is a SPA hitting a separate API Gateway origin; cookies cross-origin require `allowCredentials: true` which forces a non-wildcard CORS allowlist (we have one anyway) AND blocks the static-export build. JWT in localStorage was the lowest-friction path. XSS surface is acknowledged.

**Why Anthropic Claude (vs OpenAI)?**
Better long-form, value-aligned outputs for the "Vedic Guide" persona. Direct REST call from Lambda — no SDK — keeps the bundle small.

**Why 48 days?**
Product/cultural choice — 6 weeks (42d) felt arbitrary; 48d = 8 weeks of 6 days, leaves one rest day per week, matches a "mandala" (cycle) framing. Not technical.

**Why event-driven (5 crons rate 15min)?**
Push timing must match each user's local time across timezones. A single nightly cron can't do this. 15-min granularity = 96 windows/day, each cron is idempotent and stateless.

**Why migrate from static export to SSR `Nextjs`?**
SEO. The dosha test and blog need to be crawlable, and `(public)/` couldn't be indexed under static export. Auth'd routes are still client-only — they hydrate from an SSR shell that's otherwise empty.

**Why a separate `functions/package.json`?**
Lambda cold-start cost. The web app pulls in `react`, `framer-motion`, `recharts` etc. — all useless in Lambda. A separate package keeps the Lambda bundle to AWS SDK + `jose` + `bcryptjs`.

## 18. Not built yet — known gaps

Documented honestly so an LLM doesn't hallucinate code that doesn't exist. Roadmap detail lives in `PROJECT_VISION.md` and `docs/ROADMAP.md`.

| Gap                       | Reality today                                                                                   |
|---------------------------|------------------------------------------------------------------------------------------------|
| **Admin / ops console**   | None. No `/admin` route, no admin Lambda, no role on `Users`. Operations are manual via AWS console + DynamoDB. |
| **Analytics**             | No event pipeline, no warehouse, no dashboards. CloudWatch logs only. No DAU/retention metrics defined. |
| **AI orchestration**      | AI = `POST /chat` only. Mood / journal / check-in data is **not** fed to the model. No insight generation, no recovery coaching, no dynamic reminder timing. |
| **Recommendation engine** | None. Pillar/content recommendations are static lists or based on the user's dosha string only. |
| **Behavioral intelligence** | None. No cross-pillar correlation (e.g. "your sleep predicts your meditation"). Insights are simple thresholds on a single metric. |
| **Community**             | None. No social, no leaderboard, no shared journeys, no comments. |
| **Experimentation / A-B** | None. No flagging system, no variant assignment. |
| **Content automation**    | Manual. Blog/wisdom content is hand-authored TSX/MD in `src/data/`. Audio assets uploaded manually. |
| **Mobile parity**         | Mobile app has 5 tabs; web has 16 authenticated routes. ~70% of features are web-only. |
| **i18n**                  | English only. No translation tooling. |
| **Payments / monetization** | None. App is free. No Stripe, no entitlements, no subscription table. |
| **Email**                 | No transactional email. No SES, no Postmark. Password reset is not implemented. |
| **Observability beyond logs** | No structured logging library, no tracing, no error aggregator (no Sentry). |
| **Background tasks beyond push** | EventBridge is used only for the 5 push crons. No SQS, no Step Functions, no async job queue. |

## 19. What an LLM should read next

For deeper digs:
1. **Route contracts** — `functions/data/<route>.ts` for request/response shapes.
2. **Pillar definitions** — `src/constants/` + the `Pillars` Dynamo table (seeded list).
3. **Karma + streak rules** — `functions/data/checkin.ts`, `functions/data/buy-shield.ts`, `functions/lib/badges.ts`.
4. **Live insight engine** — `functions/lib/insights.ts` + `functions/data/insights.ts`.
5. **Push fan-out** — `functions/lib/push.ts`, `functions/lib/push-time.ts`, `functions/crons/*`.
6. **Public dosha test** — `functions/data/dosha-test-anonymous.ts` + `src/app/(public)/dosha-test/**`.
7. **Auth flows** — `functions/auth/*.ts` + `src/context/auth-context.tsx`.
8. **Roadmap / planned work** — `PROJECT_VISION.md`, `docs/ROADMAP.md`, `docs/CONTENT_TO_PRODUCE.md`.

## 20. Production status

- Live web app: `https://10x.vedics.net` (also reachable via the CloudFront URLs in the CORS allowlist).
- Mobile: EAS internal-build phase, not on stores.
- All infra in AWS `us-east-1`, SST stage `production`.
- Stage `production` has `removal: "retain"` — data is safe from accidental `sst remove`.
