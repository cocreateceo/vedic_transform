# Vedic Transform (10X Vedic) - Project Summary

## Overview

**Vedic Transform** is a 48-day personal transformation web application that combines ancient Vedic wisdom with modern technology. It helps users develop discipline, emotional stability, physical health, and spiritual growth through structured daily practices.

The 48-day duration is rooted in the Vedic concept of a "Mandala" - a natural cycle of human physiology that aligns with research on habit formation.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.1.1 + React 19.2.3 + TypeScript 5 |
| Styling | Tailwind CSS 4 + Framer Motion 12.23 |
| Database | SQLite via Prisma 5.22 ORM |
| Authentication | JWT (jose 6.1.3) + bcryptjs 3.0.3 |
| State Management | Zustand 5.0 + TanStack React Query 5.90 |
| Email | Resend / AWS SES / Azure (switchable) |
| Icons | Lucide React 0.562 |
| Charts | Recharts 3.6.0 |
| Date Handling | date-fns 4.1.0 |

---

## The 11 Transformation Pillars

| # | Pillar | Sanskrit Name | Category | Description |
|---|--------|---------------|----------|-------------|
| 1 | 5 AM Initiation | Brahma Muhurta | Body | Early morning routine for clarity and discipline |
| 2 | Vedic Nutrition + Fasting | Ahara Vidhi | Body | Plant-forward meals aligned to circadian rhythm |
| 3 | Thoughts & Intention Reset | Sankalpa | Mind | Replace negative patterns, build mental strength |
| 4 | Breathing + Meditation | Pranayama | Mind | Stabilize stress hormones, activate focus |
| 5 | Movement Everyday | Vyayama | Body | Yoga, walking, strength training |
| 6 | Healing Meditation | Dhyana | Spirit | Create space between stimulus and response |
| 7 | Sandhya Meditation | Sandhyavandana | Spirit | 3x daily alignment with nature's rhythms |
| 8 | Gratitude Practice | Kritajnata | Mind | Strengthen positive neural pathways |
| 9 | Connection to Brahman | Brahma Sambandha | Spirit | Dissolve ego, expand consciousness |
| 10 | Manifestation & Downloads | Sankalpa Shakti | Spirit | Set intentions, receive guidance |
| 11 | Sleep Optimization | Nidra | Body | Deep rest for cellular repair |

---

## Application Structure

### Navigation

**Desktop Sidebar:**
- Dashboard
- Pillars
- Goals
- Progress
- Journal
- **Tools Section:**
  - Insights
  - Reports
  - Reminders
  - Settings

**Mobile Bottom Navigation:**
- Home
- Pillars
- Goals
- Progress
- Journal

---

## Project Structure

```
vedic-transform/
├── src/
│   ├── app/
│   │   ├── (auth)/                   # Auth routes (login/register)
│   │   ├── (main)/                   # Protected main app routes
│   │   │   ├── dashboard/            # Main dashboard
│   │   │   ├── pillars/              # Pillar tracking
│   │   │   ├── goals/                # Goal setting & tracking
│   │   │   ├── progress/             # Analytics dashboard
│   │   │   ├── journal/              # Gratitude & intentions
│   │   │   ├── insights/             # Personalized insights
│   │   │   ├── reports/              # Reports & export
│   │   │   └── reminders/            # Notification settings
│   │   ├── api/
│   │   │   ├── auth/                 # Auth API routes
│   │   │   ├── assessment/           # Self-assessment API
│   │   │   ├── goals/                # Goals API
│   │   │   ├── focus-pillars/        # Focus pillars API
│   │   │   ├── insights/             # Insights API
│   │   │   ├── reports/              # Reports API
│   │   │   └── reminders/            # Reminders API
│   │   └── page.tsx                  # Landing page
│   ├── components/
│   │   ├── features/
│   │   │   ├── analytics/            # Charts, heatmap, radar
│   │   │   ├── assessment/           # Self-assessment forms
│   │   │   ├── goals/                # Goal cards, focus pillars
│   │   │   ├── insights/             # Insight cards, feed
│   │   │   ├── reports/              # Report cards, certificate
│   │   │   ├── reminders/            # Reminder settings
│   │   │   ├── dashboard/            # Dashboard widgets
│   │   │   ├── landing/              # Landing page components
│   │   │   └── pillars/              # Pillar components
│   │   ├── layout/
│   │   │   ├── sidebar.tsx           # Desktop navigation
│   │   │   └── mobile-nav.tsx        # Mobile bottom navigation
│   │   └── ui/                       # Reusable UI components
│   ├── config/
│   │   └── site.config.ts            # Centralized site configuration
│   ├── lib/
│   │   ├── auth.ts                   # JWT & password utilities
│   │   ├── db.ts                     # Prisma client singleton
│   │   ├── email/                    # Multi-provider email service
│   │   ├── insights/
│   │   │   └── generator.ts          # Insight generation engine
│   │   ├── reports/
│   │   │   └── generator.ts          # Report generation
│   │   └── utils/cn.ts               # Class name utility
│   ├── constants/pillars.ts          # 11 pillar definitions
│   └── middleware.ts                 # Route protection
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Initial data seeding
├── public/
│   └── instructions/                 # PDF attachments folder
└── docs/                             # Documentation
```

---

## Database Models

### Core Models
| Model | Purpose |
|-------|---------|
| User | Email, password, name, phone, avatar |
| Pillar | 11 transformation pillars (seeded) |
| Journey | User's 48-day transformation journey |
| DailyCheckin | Track daily pillar completions |
| KarmaTransaction | Karma points earned/spent |
| Streak | Current and longest streaks |
| Badge | Achievement definitions |
| UserBadge | Badges earned by users |
| GratitudeEntry | Daily gratitude (3 items) |
| Intention | Daily intention setting |
| Manifestation | Vision board items |
| MoodLog | Daily mood, energy, stress tracking |

### Self-Service Tracking Models
| Model | Purpose |
|-------|---------|
| SelfAssessment | Baseline and periodic wellness assessments (8 metrics) |
| GoalTask | Individual goal tasks per week |
| WeeklyGoal | Weekly goal settings and targets |
| FocusPillar | User's top 3 priority pillars |
| UserInsight | Auto-generated personalized insights |
| ReminderSettings | Notification preferences |
| WeeklySummary | Historical weekly snapshots |

---

## Core Features

### 1. Authentication
- User registration with email/password
- JWT-based login with 7-day expiration
- HTTP-only secure cookies
- Protected route middleware
- Welcome email with PDF attachment on registration

### 2. Dashboard
- Today's progress overview
- Karma points display
- Streak counter (current & longest)
- Quick actions for daily tasks
- Pillar completion checklist

### 3. Pillar Tracking
- All 11 pillars with visual grid
- Category filtering (Body/Mind/Spirit)
- Daily check-in system
- Progress percentage per pillar
- Breathing visualizer component

### 4. Goals (NEW)
- **Weekly Goal Cards** - Set and track goals per week
- **Focus Pillar Selector** - Choose up to 3 priority pillars
- **Goal Summary** - Stats with weekly completion charts
- **Progress Tracking** - Visual completion indicators

### 5. Progress & Analytics (ENHANCED)
- **Pillar Radar Chart** - Visual strength across all 11 pillars
- **Weekly Trend Chart** - 7-day progress with week-over-week comparison
- **Calendar Heatmap** - 48-day journey view with color-coded completion
- **Consistency Score** - Overall score with streak, karma, daily progress
- **Pillar Breakdown** - Detailed stats per pillar

### 6. Self-Assessment (NEW)
- **Baseline Assessment** - Capture starting point (8 wellness metrics)
- **Weekly Check-ins** - Track progress over time
- **Assessment Comparison** - Before/after visualization
- **Metrics Tracked:**
  - Stress Level
  - Sleep Quality
  - Energy Level
  - Mental Clarity
  - Physical Fitness
  - Emotional Stability
  - Spiritual Connection
  - Life Satisfaction

### 7. Insights Engine (NEW)
- **Pattern Detection** - Identifies trends in user behavior
- **Strength Recognition** - Highlights top-performing pillars
- **Weakness Alerts** - Flags areas needing attention
- **Recommendations** - Personalized tips based on data
- **Milestone Celebrations** - Streak and journey milestones
- **Filterable Feed** - Browse by insight type

### 8. Reports & Export (NEW)
- **Journey Progress Report** - Comprehensive progress data
- **CSV Export** - Download data for analysis
- **Journey Certificate** - Printable completion certificate
- **Weekly Summaries** - Week-by-week breakdown

### 9. Reminders & Notifications (NEW)
- **Morning Reminders** - Configurable wake-up time
- **Evening Reminders** - End-of-day reflection
- **Sandhya Vandana** - 3x daily spiritual practice alerts
- **Streak Protection** - Warning before losing streak
- **Email Digests** - Daily and weekly summaries
- **Notification Channels** - Email and push options

### 10. Journal
- Daily gratitude entries (3 items)
- Intention setting
- Manifestation tracking
- Vision board functionality

### 11. Gamification
- Karma points for completed pillars
- Streak tracking and rewards
- Badge system for milestones

---

## API Endpoints

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |
| `/api/assessment` | GET, POST | Self-assessments |
| `/api/goals` | GET, POST, PATCH, DELETE | Goal tasks |
| `/api/focus-pillars` | GET, POST | Focus pillar selection |
| `/api/insights` | GET, POST, PATCH | Personalized insights |
| `/api/reports` | GET | Report generation (JSON/CSV) |
| `/api/reminders` | GET, PUT | Reminder settings |

---

## Configuration

### Site Configuration (`src/config/site.config.ts`)

```typescript
export const siteConfig = {
  name: "10X Vedic",
  description: "48-Day Vedic Transformation Program",

  // YouTube Intro Video
  introVideo: {
    enabled: true,
    youtubeVideoId: "YOUR_VIDEO_ID",
    title: "Welcome to 10X Vedic Transformation",
    autoplay: false,
  },

  // Welcome Email PDF
  welcomePdf: {
    enabled: true,
    path: "/instructions/welcome-guide.pdf",
    attachmentName: "10X-Vedic-Transformation-Guide.pdf",
  },

  // Email Provider
  email: {
    provider: "resend",  // "resend" | "aws-ses" | "azure"
    fromAddress: "welcome@10xvedic.com",
    fromName: "10X Vedic",
  },
};
```

---

## Environment Variables

Required in `.env.local`:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your-secret-key-here

# Email (choose one provider)
EMAIL_PROVIDER=resend
EMAIL_FROM=welcome@yourdomain.com

# Resend (recommended)
RESEND_API_KEY=re_your_api_key

# OR AWS SES
# AWS_ACCESS_KEY_ID=your_key
# AWS_SECRET_ACCESS_KEY=your_secret
# AWS_SES_REGION=us-east-1

# OR Azure Communication Services
# AZURE_COMMUNICATION_CONNECTION_STRING=endpoint=...
```

---

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push Prisma schema changes
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio GUI
```

---

## Mobile Responsiveness

The application is fully responsive with:
- **Mobile Navigation** - Bottom nav with 5 key sections
- **Safe Area Support** - iOS notch handling
- **Touch-Friendly** - Min 44px tap targets
- **Responsive Layouts** - Stack on mobile, grid on desktop
- **Adaptive Components** - All charts and cards resize appropriately

---

## Deployment

### Architecture
```
User → CloudFront (HTTPS) → EC2 (Nginx:80 → Next.js:3000 via PM2)
```

### Resources

| Resource | Value |
|----------|-------|
| GitHub Repo | https://github.com/GopiSunware/vedic-transformation |
| CloudFront URL | https://d2ygim4h37f5gc.cloudfront.net |
| EC2 Instance ID | i-0b2480c3c6600cbee |
| EC2 Public IP | 18.233.111.142 |

### Deployment Commands

```bash
# SSH into EC2
ssh -i /path/to/sunware-hr-key.pem ec2-user@18.233.111.142

# Rebuild after changes
cd /opt/vedic-transform
git pull
npm install
npx prisma db push
npm run build
pm2 restart vedic-transform
```

---

## Project Vision

The platform aims to be a comprehensive "Scientific + Spiritual Journey" that:

1. **Rewires habits** through the 48-day Mandala cycle
2. **Strengthens mental focus** via daily intention and gratitude practices
3. **Balances hormones** through circadian-aligned nutrition and sleep
4. **Builds a permanent lifestyle** rooted in Vedic wisdom and modern biology
5. **Enables self-tracking** with comprehensive analytics and insights

### User Commitment
- 30 minutes for Mind (meditation, breathing, gratitude)
- 30 minutes for Body (movement, nutrition awareness)
- Daily consistency with an open mind

### Expected Outcomes
- Strong discipline
- High emotional stability
- Better digestion & metabolism
- Clear mind & sharp decision-making
- Rapid spiritual + material growth
- Activated success energy

---

## Changelog

### December 24, 2024 - Self-Service Tracking Release
- **Phase 1: Analytics Dashboard**
  - Pillar radar chart
  - Weekly trend chart
  - Calendar heatmap
  - Consistency score card
  - Insight cards

- **Phase 2: Self-Assessment System**
  - Multi-step assessment form (8 metrics)
  - Baseline and weekly assessments
  - Before/after comparison view
  - Assessment prompts

- **Phase 3: Goal Setting**
  - Weekly goal cards with progress tracking
  - Focus pillar selector (top 3)
  - Goal summary stats
  - Goals page with full management

- **Phase 4: Insights Engine**
  - Pattern detection algorithm
  - Auto-generated personalized insights
  - Filterable insights feed
  - Insight detail cards

- **Phase 5: Reports & Export**
  - Journey report generator
  - CSV export functionality
  - Printable completion certificate
  - Report cards UI

- **Phase 6: Reminders & Notifications**
  - Comprehensive reminder settings
  - Morning/evening/Sandhya reminders
  - Streak protection alerts
  - Email digest options

- **Mobile Enhancements**
  - Updated mobile bottom navigation
  - Updated desktop sidebar navigation
  - Responsive layouts for all new pages

### December 23, 2024
- Initial deployment to AWS EC2 + CloudFront
- Core app features complete
- YouTube intro video embed
- Welcome email with PDF attachment

---

*Last Updated: December 24, 2024*
