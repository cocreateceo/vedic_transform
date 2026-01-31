# 10X Vedic Transform

A 48-day transformation program combining ancient Vedic wisdom with modern technology. Transform your body, mind, and spirit through 11 comprehensive pillars covering physical health, mental clarity, and spiritual awakening.

## Architecture

**Modern Serverless Stack:**
- **Frontend**: Next.js 16.1.1 with App Router & Server-Side Rendering
- **Backend**: AWS Lambda (serverless functions)
- **Database**: AWS DynamoDB (19 tables)
- **CDN**: CloudFront
- **Storage**: S3 (static assets)
- **IaC**: SST (Serverless Stack) v3.17.25
- **Deployment**: Automated via SST

**Monthly Cost**: ~$1.60-2.00 (serverless pay-per-use)

## Features

### 11 Transformation Pillars

**Body:**
- Morning Initiation (5 AM Brahma Muhurta)
- Mindful Nutrition & Fasting
- Sacred Movement (Yoga/Exercise)
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
- User authentication & journey tracking
- Daily check-ins for all 11 pillars
- Karma points & gamification
- Streak tracking & badges
- Weekly goal setting
- Progress reports & insights
- Gratitude journal
- Mood logging & self-assessments
- Customizable reminders

## Getting Started

### Prerequisites
- Node.js 20+
- AWS Account with credentials configured
- AWS CLI installed

### Environment Variables

Create `.env.local`:

```bash
# JWT Secret
JWT_SECRET=your-secure-secret-key-change-in-production

# AWS Region (optional - defaults to us-east-1)
AWS_REGION=us-east-1

# Node Environment
NODE_ENV=development
```

### Development Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Run development server:**
```bash
npm run dev
```

3. **Open application:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Database

### DynamoDB Tables

The application uses 19 DynamoDB tables with the prefix `VedicTransform-`:

**Core Tables:**
- Users - User accounts & authentication
- Journeys - 48-day journey tracking
- Streaks - Daily completion streaks
- Pillars - 11 transformation pillars (seeded data)

**Activity Tables:**
- DailyCheckins - Daily pillar completions
- GoalTasks - Weekly goals
- FocusPillars - User's selected focus areas
- KarmaTransactions - Points earned
- GratitudeEntries - Daily gratitude journal
- Intentions - Daily intention setting
- Manifestations - Goals & manifestations
- MoodLogs - Mood tracking
- SelfAssessments - Self-evaluation responses

**System Tables:**
- Badges - Achievement definitions
- UserBadges - Earned achievements
- UserInsights - AI-generated insights
- WeeklyGoals - Week-by-week objectives
- WeeklySummaries - Progress summaries
- ReminderSettings - Notification preferences

### Database Layer

Custom DynamoDB abstraction (`src/lib/dynamodb.ts`) provides Prisma-like API:

```typescript
import { db } from '@/lib/dynamodb';

// Create
const user = await db.user.create({
  data: { email, passwordHash, name }
});

// Find
const user = await db.user.findUnique({
  where: { email }
});

// Update
await db.user.update({
  where: { id },
  data: { name: 'New Name' }
});
```

## Deployment

### Deploy to AWS

The application is deployed using SST (Serverless Stack):

```bash
# Deploy to production
npx sst deploy --stage production

# Deploy to development
npx sst deploy --stage dev
```

### Deployment Output

After deployment, SST provides:
- CloudFront URL (e.g., `https://d10e61fglnub0a.cloudfront.net`)
- Lambda function names
- S3 bucket names
- DynamoDB table references

### Infrastructure as Code

The `sst.config.ts` file defines all infrastructure:

```typescript
const site = new sst.aws.Nextjs("VedicTransformSite", {
  permissions: [
    {
      actions: ["dynamodb:*"],
      resources: ["arn:aws:dynamodb:us-east-1:*:table/VedicTransform-*"],
    },
  ],
});
```

### Remove Deployment

```bash
npx sst remove --stage production
```

## Project Structure

```
vedic-transform/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (main)/            # Protected routes
│   │   │   ├── dashboard/     # User dashboard
│   │   │   ├── goals/         # Weekly goals
│   │   │   ├── pillars/       # Pillar details
│   │   │   ├── journal/       # Gratitude journal
│   │   │   └── ...
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication
│   │   │   ├── goals/         # Goals CRUD
│   │   │   └── ...
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── features/          # Feature-specific
│   │   ├── layout/            # Layout components
│   │   └── ui/                # Reusable UI
│   └── lib/
│       ├── auth.ts            # Authentication logic
│       └── dynamodb.ts        # Database layer
├── public/                    # Static assets
├── sst.config.ts             # Infrastructure config
├── next.config.ts            # Next.js config
└── package.json              # Dependencies
```

## Build

```bash
# Build for production
npm run build

# Build with type checking
npm run build
```

## Tech Stack

- **Framework**: Next.js 16.1.1 (Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Authentication**: JWT (custom implementation)
- **Database ORM**: Custom DynamoDB abstraction
- **Deployment**: SST + OpenNext
- **Cloud**: AWS (Lambda, DynamoDB, S3, CloudFront)

## Development Notes

### Key Files Modified for DynamoDB Migration

- `src/lib/dynamodb.ts` - Database abstraction layer (NEW)
- `src/lib/auth.ts` - Updated to use DynamoDB
- All `src/app/(main)/*/page.tsx` - Updated database imports
- All `src/app/api/*/route.ts` - Updated database imports
- `sst.config.ts` - Added DynamoDB permissions
- `next.config.ts` - Configured for Lambda deployment
- `tsconfig.json` - Excluded build artifacts

### Manual Joins Required

DynamoDB doesn't support SQL-like joins. Use manual joining:

```typescript
// Get related data
const pillars = await db.pillar.findMany();
const checkins = await db.dailyCheckin.findMany({ where: { userId } });

// Manual join
const pillarMap = new Map(pillars.map(p => [p.id, p]));
const checkinsWithPillars = checkins.map(c => ({
  ...c,
  pillar: pillarMap.get(c.pillarId)
}));
```

## Production URL

Current deployment: https://d10e61fglnub0a.cloudfront.net

## License

Proprietary - 10X Vedic

## Support

For issues or questions, contact the development team.
