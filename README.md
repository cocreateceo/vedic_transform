# 10X Vedic Transform

A 48-day transformation program combining ancient Vedic wisdom with modern technology. Transform your body, mind, and spirit through 11 comprehensive pillars covering physical health, mental clarity, and spiritual awakening.

## Architecture

**Serverless stack on AWS (deployed via SST v4):**

- **Frontend**: Next.js 15.5 (App Router) compiled to a **static export** in `out/`, served from S3 + CloudFront via `sst.aws.StaticSite`.
- **API**: AWS API Gateway v2 (HTTP API) fronting Lambda handlers in `functions/`.
- **Database**: AWS DynamoDB — 19 tables, one per entity, with `userId` GSIs for per-user queries.
- **AI**: `/chat` Lambda calls the Anthropic Claude API with the "Vedic Guide" system prompt.
- **Secrets**: `JwtSecret` and `AnthropicApiKey` provisioned as `sst.Secret` (set via `sst secret set`).
- **Infra-as-code**: `sst.config.ts` defines tables, API routes, secrets, and the static site.

The frontend is a fully client-side single-page app — there is **no server-side rendering**. Authenticated pages mount, then call the API at runtime using a JWT stored in `localStorage` (`vedic-token`).

## Features

### 11 Transformation Pillars

**Body:**
- Morning Initiation (5 AM Brahma Muhurta)
- Mindful Nutrition & Fasting
- Sacred Movement (Yoga / Exercise)
- Sleep Optimization

**Mind:**
- Thought Power & Intention Setting
- Pranayama (Breathwork)
- Healing Meditation
- Gratitude Practice

**Spirit:**
- Sandhya Meditation (3x daily)
- Connection to Brahman
- Divine Manifestation

### Application Features
- User authentication & 48-day journey tracking
- Daily check-ins for all 11 pillars
- Karma points & gamification, streak tracking, badges
- Weekly goal setting and progress reports
- Gratitude / intention / manifestation journal
- Mood logging and self-assessments
- Customizable reminders
- AI-generated insights and a Vedic Guide chat assistant (Anthropic Claude)

## Getting Started

### Prerequisites
- Node.js 20+
- AWS account with credentials configured (`aws configure`)
- An Anthropic API key (for the chat assistant)

### Environment Variables

Create `.env.local` for the Next.js dev server:

```bash
# URL of the deployed API Gateway (printed by `sst deploy`)
NEXT_PUBLIC_API_URL=https://<your-api-id>.execute-api.us-east-1.amazonaws.com
```

Backend secrets are stored in SST, not in `.env`:

```bash
npx sst secret set JwtSecret "<random-32-byte-string>"
npx sst secret set AnthropicApiKey "<your-anthropic-api-key>"
```

### Development

```bash
# Install dependencies (root + functions workspace)
npm install
(cd functions && npm install)

# Run the Next.js dev server
npm run dev
```

The app is available at [http://localhost:3000](http://localhost:3000) and talks to the deployed API. To iterate on Lambda code locally, use `npx sst dev`.

### CORS

The API Gateway has an explicit allowlist defined in `sst.config.ts`:

```ts
const allowedOrigins = [
  "http://localhost:3000",
  "https://d1wkrhl40vhx82.cloudfront.net",
];
```

Add any new deployed origin (custom domain, preview environment) here. Lambda handlers intentionally do **not** emit `Access-Control-Allow-Origin` themselves — API Gateway v2 echoes the matched origin from this allowlist into the response and handles OPTIONS preflight automatically.

## Database

### DynamoDB Tables (19)

All tables are provisioned in `sst.config.ts`. Per-user tables use a GSI named `userId-index`.

**Identity & journey**
- `Users` — accounts, profile, dosha results (`email-index` GSI)
- `Journeys` — 48-day journey records
- `Streaks` — current / longest streak per user
- `Pillars` — 11 pillar definitions (seeded)

**Daily activity**
- `DailyCheckins` — per-pillar daily completions
- `GoalTasks` — weekly goals
- `FocusPillars` — user's selected focus areas (1–3)
- `KarmaTransactions` — points earned
- `GratitudeEntries`, `Intentions`, `Manifestations` — journal entries
- `MoodLogs` — mood / energy / stress / sleep
- `SelfAssessments` — periodic wellbeing self-evals
- `ContentProgress` — library / session progress

**System**
- `Badges`, `UserBadges` — achievement definitions and earnings
- `UserInsights` — AI-generated insights
- `ReminderSettings` — per-user notification preferences (hash key: `userId`)
- `Notifications` — in-app notification feed

### Data access

Lambda handlers use the AWS SDK directly via a small helper in `functions/lib/utils.ts`:

```ts
import { Resource } from 'sst';
import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, getUserFromEvent, generateId } from '../lib/utils';

const user = await getUserFromEvent(event);
if (!user) return err(401, 'Unauthorized');

const result = await db.send(new QueryCommand({
  TableName: Resource.DailyCheckins.name,
  IndexName: 'userId-index',
  KeyConditionExpression: 'userId = :userId',
  ExpressionAttributeValues: { ':userId': user.id },
}));

return ok({ checkins: result.Items || [] });
```

There is no ORM — `Resource.<TableName>.name` resolves to the deployed table name through the SST link binding.

DynamoDB has no joins. When a handler needs related data (e.g. checkins with their pillar), it queries each table separately and joins in memory.

## API Routes

All routes are wired up in `sst.config.ts`:

```
POST   /auth/register          POST /auth/login
GET    /data/user              PATCH /data/user
GET    /data/journey           POST  /data/journey
GET    /data/checkin           POST  /data/checkin
GET    /data/goals             POST/PATCH/DELETE /data/goals
GET    /data/focus-pillars     POST  /data/focus-pillars
GET    /data/journal           POST  /data/journal     (gratitude | intention | manifestation)
GET    /data/mood              POST  /data/mood
GET    /data/assessment        POST  /data/assessment
GET    /data/insights          POST/PATCH /data/insights
GET    /data/reminders         PUT   /data/reminders
GET    /data/reports
GET    /data/notifications     PATCH /data/notifications
GET    /data/content-progress  POST  /data/content-progress
GET    /data/achievements
POST   /chat
```

Authentication is a `Bearer` JWT in the `Authorization` header, signed with `JwtSecret` via `jose` (HS256, 7-day expiry).

## Deployment

```bash
# Production
npx sst deploy --stage production

# Dev / personal stage
npx sst deploy --stage dev
```

After deploy, SST prints:
- The CloudFront URL of the static site
- The API Gateway base URL (use this for `NEXT_PUBLIC_API_URL`)

Set `NEXT_PUBLIC_API_URL` before re-running `sst deploy` so the static site is rebuilt with the API URL embedded.

```bash
# Tear down a stage
npx sst remove --stage dev
```

## Project Structure

```
vedic-transform/
├── src/
│   ├── app/
│   │   ├── (auth)/             # login, register, onboarding
│   │   ├── (main)/             # authenticated app: dashboard, pillars,
│   │   │                       # goals, journal, mood, insights, reports,
│   │   │                       # library, sessions, achievements, etc.
│   │   ├── (public)/           # marketing pages: about, blog, faq, ...
│   │   ├── layout.tsx
│   │   ├── home-client.tsx
│   │   └── page.tsx            # landing page entry
│   ├── components/
│   │   ├── features/           # feature components (chat, dashboard,
│   │   │                       # pillars, audio, dosha, ...)
│   │   ├── layout/             # header, sidebar, mobile-nav, navbar
│   │   └── ui/                 # shared primitives
│   ├── context/                # auth-context, audio-player-context
│   ├── constants/              # pillar definitions
│   ├── data/                   # static content: blog, daily-wisdom, faq, ...
│   ├── lib/                    # api client, theme, utils
│   └── types/                  # shared types
├── functions/
│   ├── auth/                   # login.ts, register.ts
│   ├── chat/                   # chat.ts (Anthropic proxy)
│   ├── data/                   # one handler per /data/* route
│   ├── lib/                    # utils.ts (db client, JWT, CORS, helpers)
│   └── package.json            # Lambda-only deps (smaller bundle)
├── docs/                       # architecture, deployment, API docs
├── public/                     # static assets, manifest, service worker
├── scripts/                    # tooling (icon generation, ...)
├── landing-page/               # standalone marketing HTML
├── sst.config.ts               # infra-as-code (tables, API, site, secrets)
├── next.config.ts              # next config (output: 'export')
└── package.json
```

## Build

```bash
npm run build     # next build → static export in out/
npm run lint
```

## Tech Stack

- **Framework**: Next.js 15.5 (App Router, static export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State / data**: Zustand, TanStack React Query
- **Animation / charts**: framer-motion, recharts
- **Icons**: lucide-react
- **Auth**: JWT via `jose` (HS256), `bcryptjs` for password hashing
- **API**: AWS API Gateway v2 + Lambda (Node 20)
- **Database**: DynamoDB via `@aws-sdk/lib-dynamodb`
- **AI**: Anthropic Claude (Sonnet) via direct REST call from Lambda
- **Infra**: SST v4 (`StaticSite`, `ApiGatewayV2`, `Dynamo`, `Secret`)
- **Cloud**: AWS (S3, CloudFront, API Gateway, Lambda, DynamoDB)

## Production URL

Current deployment: https://d1wkrhl40vhx82.cloudfront.net

## License

Proprietary — 10X Vedic

## Support

For issues or questions, contact the development team.
