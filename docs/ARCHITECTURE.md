# Vedic Transform - Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              VEDIC TRANSFORM                                 │
│                     48-Day Personal Transformation Platform                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                 CLIENT LAYER                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         Next.js Frontend                             │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   React 19   │  │ Tailwind CSS │  │Framer Motion │              │   │
│  │  │  Components  │  │   Styling    │  │  Animations  │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Recharts   │  │ Lucide Icons │  │   Zustand    │              │   │
│  │  │    Charts    │  │              │  │    State     │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTP/JSON
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MIDDLEWARE LAYER                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Next.js Middleware                                │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐   │   │
│  │  │  JWT Validation  │  │  Route Protection │  │  Cookie Mgmt   │   │   │
│  │  │   (jose lib)     │  │   /dashboard/*    │  │  HTTP-only     │   │   │
│  │  └──────────────────┘  └──────────────────┘  └─────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               API LAYER                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Next.js API Routes                                │   │
│  │                                                                      │   │
│  │  /api/auth/*          /api/goals          /api/insights            │   │
│  │  ├─ register          ├─ GET (list)       ├─ GET (fetch)           │   │
│  │  ├─ login             ├─ POST (create)    ├─ POST (generate)       │   │
│  │  └─ logout            ├─ PATCH (update)   └─ PATCH (mark read)     │   │
│  │                       └─ DELETE                                      │   │
│  │                                                                      │   │
│  │  /api/assessment      /api/focus-pillars  /api/reports             │   │
│  │  ├─ GET (history)     ├─ GET (top 3)      └─ GET (json/csv)        │   │
│  │  └─ POST (submit)     └─ POST (set)                                 │   │
│  │                                                                      │   │
│  │  /api/reminders                                                      │   │
│  │  ├─ GET (settings)                                                   │   │
│  │  └─ PUT (update)                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ Prisma ORM
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE LAYER                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         SQLite Database                              │   │
│  │                        (prisma/dev.db)                               │   │
│  │                                                                      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │   │
│  │  │    User     │  │   Journey   │  │   Pillar    │                 │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                 │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │   │
│  │  │DailyCheckin │  │   Streak    │  │   Badge     │                 │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                 │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │   │
│  │  │ WeeklyGoal  │  │  GoalTask   │  │ FocusPillar │                 │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                 │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │   │
│  │  │UserInsight  │  │SelfAssessmt │  │ReminderSet  │                 │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ Async
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SERVICES                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      Email Service Factory                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │    Resend    │  │   AWS SES    │  │    Azure     │              │   │
│  │  │  (Primary)   │  │ (Enterprise) │  │  (Alt)       │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PRODUCTION DEPLOYMENT                             │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐         ┌───────────────┐         ┌──────────────────────┐
    │  User    │ ──────► │  CloudFront   │ ──────► │      EC2 Instance    │
    │ Browser  │  HTTPS  │    (CDN)      │  HTTP   │                      │
    └──────────┘         └───────────────┘         │  ┌────────────────┐  │
                                                    │  │     Nginx      │  │
                                                    │  │    (Port 80)   │  │
                                                    │  └───────┬────────┘  │
                                                    │          │           │
                                                    │          ▼           │
                                                    │  ┌────────────────┐  │
                                                    │  │    PM2         │  │
                                                    │  │  (Node.js)     │  │
                                                    │  └───────┬────────┘  │
                                                    │          │           │
                                                    │          ▼           │
                                                    │  ┌────────────────┐  │
                                                    │  │   Next.js App  │  │
                                                    │  │  (Port 3000)   │  │
                                                    │  └────────────────┘  │
                                                    └──────────────────────┘

    CloudFront URL: https://d2ygim4h37f5gc.cloudfront.net
    EC2 Instance:   i-0b2480c3c6600cbee (18.233.111.142)
```

---

## Application Route Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ROUTE HIERARCHY                                 │
└─────────────────────────────────────────────────────────────────────────────┘

src/app/
│
├── layout.tsx                 # Root layout (fonts, metadata)
├── page.tsx                   # Landing page (/)
│
├── (auth)/                    # Auth group (public)
│   ├── login/
│   │   └── page.tsx          # Login form
│   └── register/
│       └── page.tsx          # Registration form
│
├── (main)/                    # Protected routes group
│   ├── layout.tsx            # Sidebar + Header + MobileNav
│   │
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard
│   │
│   ├── pillars/
│   │   ├── page.tsx          # All 11 pillars grid
│   │   └── [pillarId]/
│   │       └── page.tsx      # Individual pillar detail
│   │
│   ├── goals/
│   │   └── page.tsx          # Weekly goals management
│   │
│   ├── progress/
│   │   └── page.tsx          # Analytics & progress charts
│   │
│   ├── journal/
│   │   └── page.tsx          # Gratitude & intentions
│   │
│   ├── insights/
│   │   ├── page.tsx          # Server component
│   │   └── insights-client.tsx
│   │
│   ├── reports/
│   │   ├── page.tsx          # Server component
│   │   └── reports-client.tsx
│   │
│   ├── reminders/
│   │   ├── page.tsx          # Server component
│   │   └── reminders-client.tsx
│   │
│   └── settings/
│       └── page.tsx          # User settings
│
└── api/                       # API Routes
    ├── auth/
    │   ├── register/route.ts
    │   ├── login/route.ts
    │   └── logout/route.ts
    ├── assessment/route.ts
    ├── goals/route.ts
    ├── focus-pillars/route.ts
    ├── insights/route.ts
    ├── reports/route.ts
    └── reminders/route.ts
```

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           COMPONENT HIERARCHY                                │
└─────────────────────────────────────────────────────────────────────────────┘

src/components/
│
├── ui/                        # Base UI Components (Design System)
│   ├── button.tsx            # Primary, secondary, outline variants
│   ├── card.tsx              # Card, CardHeader, CardContent, CardFooter
│   ├── input.tsx             # Form input with label support
│   └── progress.tsx          # Progress bar component
│
├── layout/                    # Layout Components
│   ├── header.tsx            # Top navigation bar
│   │   └── User avatar, logout button
│   ├── sidebar.tsx           # Desktop side navigation
│   │   └── Primary nav + Tools section
│   └── mobile-nav.tsx        # Bottom navigation for mobile
│       └── 5 main sections
│
└── features/                  # Feature-specific Components
    │
    ├── auth/
    │   ├── login-form.tsx
    │   └── register-form.tsx
    │
    ├── dashboard/
    │   ├── streak-counter.tsx       # Current streak + risk indicator
    │   ├── karma-points.tsx         # Total + today's karma
    │   └── pillar-grid.tsx          # Today's pillar checklist
    │
    ├── pillars/
    │   └── breathing-visualizer.tsx # Animated breathing guide
    │
    ├── goals/
    │   ├── weekly-goal-card.tsx     # Weekly goal display
    │   ├── goal-summary.tsx         # Stats overview
    │   └── focus-pillar-selector.tsx # Top 3 selector
    │
    ├── analytics/
    │   ├── pillar-radar-chart.tsx   # 11-pillar strength radar
    │   ├── weekly-trend-chart.tsx   # 7-day line chart
    │   ├── calendar-heatmap.tsx     # 48-day journey calendar
    │   └── consistency-score.tsx    # Overall score card
    │
    ├── assessment/
    │   ├── self-assessment-form.tsx # 8-metric wellness form
    │   ├── assessment-comparison.tsx # Before/after comparison
    │   └── assessment-prompt.tsx    # Weekly check-in prompt
    │
    ├── insights/
    │   ├── insights-feed.tsx        # Filterable insights list
    │   └── insight-detail-card.tsx  # Individual insight card
    │
    ├── reports/
    │   ├── report-card.tsx          # Summary stats card
    │   └── journey-certificate.tsx  # Printable certificate
    │
    ├── reminders/
    │   └── reminder-settings.tsx    # Time pickers & toggles
    │
    └── landing/
        └── youtube-intro.tsx        # Video embed component
```

---

## Database Schema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE MODELS                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│      User        │       │     Journey      │       │     Pillar       │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id: String (PK)  │◄──────│ userId: String   │       │ id: String (PK)  │
│ email: String    │       │ id: String (PK)  │       │ slug: String     │
│ password: String │       │ startDate: Date  │       │ name: String     │
│ name: String?    │       │ endDate: Date?   │       │ sanskritName: Str│
│ phone: String?   │       │ isActive: Bool   │       │ description: Str │
│ avatar: String?  │       │ isComplete: Bool │       │ icon: String     │
│ createdAt: Date  │       └────────┬─────────┘       │ category: String │
│ updatedAt: Date  │                │                 │ defaultDuration  │
└────────┬─────────┘                │                 │ karmaPoints: Int │
         │                          │                 └──────────────────┘
         │                          │
         │    ┌─────────────────────┴─────────────────────┐
         │    │                                           │
         ▼    ▼                                           ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│  DailyCheckin    │       │     Streak       │       │   WeeklyGoal     │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id: String (PK)  │       │ id: String (PK)  │       │ id: String (PK)  │
│ journeyId: Str   │       │ journeyId: Str   │       │ userId: String   │
│ pillarId: String │       │ currentStreak    │       │ weekNumber: Int  │
│ checkinDate: Date│       │ longestStreak    │       │ targetPillars    │
│ completed: Bool  │       │ lastCheckinDate  │       │ focusCategory    │
│ duration: Int?   │       └──────────────────┘       │ createdAt: Date  │
│ notes: String?   │                                  └──────────────────┘
│ moodBefore: Int? │
│ moodAfter: Int?  │
└──────────────────┘

┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│    GoalTask      │       │   FocusPillar    │       │  SelfAssessment  │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id: String (PK)  │       │ id: String (PK)  │       │ id: String (PK)  │
│ userId: String   │       │ userId: String   │       │ userId: String   │
│ weekNumber: Int  │       │ pillarId: String │       │ assessmentType   │
│ title: String    │       │ priority: Int    │       │ weekNumber: Int? │
│ completed: Bool  │       │ createdAt: Date  │       │ stressLevel: Int │
│ createdAt: Date  │       └──────────────────┘       │ sleepQuality: Int│
└──────────────────┘                                  │ energyLevel: Int │
                                                      │ mentalClarity:Int│
┌──────────────────┐       ┌──────────────────┐       │ physicalFitness  │
│   UserInsight    │       │ReminderSettings  │       │ emotionalStabil  │
├──────────────────┤       ├──────────────────┤       │ spiritualConnect │
│ id: String (PK)  │       │ id: String (PK)  │       │ lifeSatisfaction │
│ userId: String   │       │ userId: String   │       │ notes: String?   │
│ insightType: Str │       │ morningEnabled   │       │ createdAt: Date  │
│ category: String?│       │ morningTime: Str │       └──────────────────┘
│ title: String    │       │ eveningEnabled   │
│ description: Str │       │ eveningTime: Str │       ┌──────────────────┐
│ data: JSON?      │       │ sandhyaEnabled   │       │  WeeklySummary   │
│ priority: Int    │       │ sandhyaMorning   │       ├──────────────────┤
│ isRead: Boolean  │       │ sandhyaNoon      │       │ id: String (PK)  │
│ isDismissed: Bool│       │ sandhyaEvening   │       │ journeyId: String│
│ expiresAt: Date? │       │ streakWarning    │       │ weekNumber: Int  │
│ createdAt: Date  │       │ dailyDigest      │       │ avgCompletion:Flt│
│ updatedAt: Date  │       │ weeklyDigest     │       │ totalKarma: Int  │
└──────────────────┘       │ weeklyDigestDay  │       │ moodAvg: Float?  │
                           │ emailNotify: Bool│       │ topPillar: String│
┌──────────────────┐       │ pushNotify: Bool │       │ createdAt: Date  │
│     MoodLog      │       │ timezone: String │       └──────────────────┘
├──────────────────┤       └──────────────────┘
│ id: String (PK)  │                                  ┌──────────────────┐
│ userId: String   │       ┌──────────────────┐       │    UserBadge     │
│ mood: Int (1-5)  │       │      Badge       │       ├──────────────────┤
│ energy: Int (1-5)│       ├──────────────────┤       │ id: String (PK)  │
│ stress: Int (1-5)│       │ id: String (PK)  │       │ userId: String   │
│ notes: String?   │       │ name: String     │       │ badgeId: String  │
│ logDate: Date    │       │ description: Str │       │ earnedAt: Date   │
│ createdAt: Date  │       │ icon: String     │       └──────────────────┘
└──────────────────┘       │ requirement: Str │
                           │ karmaReward: Int │
┌──────────────────┐       └──────────────────┘       ┌──────────────────┐
│ GratitudeEntry   │                                  │  Manifestation   │
├──────────────────┤       ┌──────────────────┐       ├──────────────────┤
│ id: String (PK)  │       │    Intention     │       │ id: String (PK)  │
│ userId: String   │       ├──────────────────┤       │ userId: String   │
│ entry1: String   │       │ id: String (PK)  │       │ title: String    │
│ entry2: String   │       │ userId: String   │       │ description: Str?│
│ entry3: String   │       │ content: String  │       │ category: String?│
│ entryDate: Date  │       │ isCompleted: Bool│       │ imageUrl: String?│
│ createdAt: Date  │       │ intentionDate    │       │ isManifested:Bool│
└──────────────────┘       │ createdAt: Date  │       │ manifestedAt:Date│
                           └──────────────────┘       │ createdAt: Date  │
┌──────────────────┐                                  └──────────────────┘
│KarmaTransaction  │
├──────────────────┤
│ id: String (PK)  │
│ userId: String   │
│ amount: Int      │
│ type: String     │
│ description: Str?│
│ pillarId: String?│
│ createdAt: Date  │
└──────────────────┘
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AUTHENTICATION FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

                              REGISTRATION
┌──────────────┐    ┌───────────────┐    ┌───────────────┐    ┌─────────────┐
│   User       │    │  /register    │    │ /api/auth/    │    │  Database   │
│   Browser    │    │    Page       │    │   register    │    │  (Prisma)   │
└──────┬───────┘    └───────┬───────┘    └───────┬───────┘    └──────┬──────┘
       │                    │                    │                    │
       │  Fill form         │                    │                    │
       ├───────────────────►│                    │                    │
       │                    │  POST credentials  │                    │
       │                    ├───────────────────►│                    │
       │                    │                    │  Hash password     │
       │                    │                    │  (bcrypt 12)       │
       │                    │                    │                    │
       │                    │                    │  Create User       │
       │                    │                    ├───────────────────►│
       │                    │                    │                    │
       │                    │                    │  Generate JWT      │
       │                    │                    │  (jose, 7 days)    │
       │                    │                    │                    │
       │                    │  Set HTTP-only     │                    │
       │◄───────────────────┤  cookie            │                    │
       │                    │◄───────────────────┤                    │
       │                    │                    │                    │
       │                    │         ┌──────────┴──────────┐         │
       │                    │         │  ASYNC: Send        │         │
       │                    │         │  Welcome Email      │         │
       │                    │         │  + PDF Attachment   │         │
       │                    │         └─────────────────────┘         │
       │  Redirect to       │                                         │
       │  /dashboard        │                                         │
       ├───────────────────►│                                         │
       │                    │                                         │


                                 LOGIN
┌──────────────┐    ┌───────────────┐    ┌───────────────┐    ┌─────────────┐
│   User       │    │   /login      │    │ /api/auth/    │    │  Database   │
│   Browser    │    │    Page       │    │    login      │    │  (Prisma)   │
└──────┬───────┘    └───────┬───────┘    └───────┬───────┘    └──────┬──────┘
       │                    │                    │                    │
       │  Enter creds       │                    │                    │
       ├───────────────────►│                    │                    │
       │                    │  POST credentials  │                    │
       │                    ├───────────────────►│                    │
       │                    │                    │  Find user         │
       │                    │                    ├───────────────────►│
       │                    │                    │◄───────────────────┤
       │                    │                    │                    │
       │                    │                    │  Verify password   │
       │                    │                    │  (bcrypt compare)  │
       │                    │                    │                    │
       │                    │                    │  Generate JWT      │
       │                    │  Set cookie        │                    │
       │◄───────────────────┤◄───────────────────┤                    │
       │                    │                    │                    │
       │  Redirect to       │                    │                    │
       │  /dashboard        │                    │                    │


                          ROUTE PROTECTION
┌──────────────┐    ┌───────────────┐    ┌───────────────┐    ┌─────────────┐
│   User       │    │  Middleware   │    │  Protected    │    │  Page       │
│   Browser    │    │  (auth check) │    │    Route      │    │  Component  │
└──────┬───────┘    └───────┬───────┘    └───────┬───────┘    └──────┬──────┘
       │                    │                    │                    │
       │  Request           │                    │                    │
       │  /dashboard        │                    │                    │
       ├───────────────────►│                    │                    │
       │                    │                    │                    │
       │                    │  Verify JWT        │                    │
       │                    │  from cookie       │                    │
       │                    │                    │                    │
       │          ┌─────────┴─────────┐          │                    │
       │          │   Valid Token?    │          │                    │
       │          └─────────┬─────────┘          │                    │
       │                    │                    │                    │
       │         ┌──────────┼──────────┐         │                    │
       │         │ NO       │      YES │         │                    │
       │         ▼          │          ▼         │                    │
       │  ┌──────────┐      │    ┌──────────┐    │                    │
       │  │ Redirect │      │    │  Allow   │    │                    │
       │  │ to /login│      │    │  Access  ├────┼───────────────────►│
       │  └──────────┘      │    └──────────┘    │                    │
       │                    │                    │                    │
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             DATA FLOW PATTERNS                               │
└─────────────────────────────────────────────────────────────────────────────┘


    SERVER COMPONENT PATTERN (Dashboard, Insights, Reports, Reminders)
    ═══════════════════════════════════════════════════════════════════

    ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
    │   Server    │      │   Prisma    │      │   Client    │
    │  Component  │─────►│   Query     │─────►│  Component  │
    │  (page.tsx) │      │             │      │ (*-client)  │
    └─────────────┘      └─────────────┘      └─────────────┘
          │                                         │
          │  1. requireAuth()                       │
          │  2. Fetch data from DB                  │
          │  3. Transform data                      │
          │  4. Pass as props                       │
          │                                         │
          └─────────────────────────────────────────┘


    CLIENT-SIDE UPDATE PATTERN (Goals, Insights dismiss/refresh)
    ═══════════════════════════════════════════════════════════

    ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
    │   Client    │      │    API      │      │   Prisma    │
    │  Component  │─────►│   Route     │─────►│   Update    │
    │             │      │             │      │             │
    └─────────────┘      └─────────────┘      └─────────────┘
          │                    │                    │
          │  1. User action    │                    │
          │  2. fetch() API    │                    │
          │  3. Update state   │                    │
          │                    │  4. Validate user  │
          │                    │  5. Update DB      │
          │                    │  6. Return result  │
          │                    │                    │


    INSIGHTS GENERATION PATTERN
    ═══════════════════════════

    ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
    │   POST      │      │  Insights   │      │  Database   │
    │  /api/      │─────►│  Generator  │─────►│  UserInsight│
    │  insights   │      │  Engine     │      │  Table      │
    └─────────────┘      └─────────────┘      └─────────────┘
                               │
                               │ Analyzes:
                               ├─ Streak data
                               ├─ Pillar completion rates
                               ├─ Day patterns
                               ├─ Mood correlations
                               ├─ Journey milestones
                               └─ Assessment changes
```

---

## Email Service Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EMAIL SERVICE FACTORY                              │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌─────────────────────┐
                         │  getEmailProvider() │
                         │                     │
                         │  Reads ENV:         │
                         │  EMAIL_PROVIDER     │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
    ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
    │ ResendProvider  │   │ AWSSESProvider  │   │ AzureProvider   │
    │                 │   │                 │   │                 │
    │ RESEND_API_KEY  │   │ AWS_ACCESS_KEY  │   │ AZURE_CONN_STR  │
    │                 │   │ AWS_SECRET_KEY  │   │                 │
    │                 │   │ AWS_SES_REGION  │   │                 │
    └────────┬────────┘   └────────┬────────┘   └────────┬────────┘
             │                     │                     │
             └─────────────────────┼─────────────────────┘
                                   │
                                   ▼
                         ┌─────────────────────┐
                         │  EmailProvider      │
                         │  Interface          │
                         │                     │
                         │  sendEmail({        │
                         │    to: string       │
                         │    subject: string  │
                         │    html: string     │
                         │    text?: string    │
                         │    attachments?: [] │
                         │  })                 │
                         └─────────────────────┘


    WELCOME EMAIL FLOW
    ═══════════════════

    ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
    │ User       │    │ API Route  │    │ Email      │    │ Provider   │
    │ Registers  │───►│ /register  │───►│ Service    │───►│ (Resend)   │
    └────────────┘    └────────────┘    └────────────┘    └────────────┘
                                              │
                                              │ Includes:
                                              ├─ Welcome HTML template
                                              ├─ Plain text fallback
                                              └─ PDF: welcome-guide.pdf
                                                 (from /public/instructions/)
```

---

## The 11 Transformation Pillars

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          11 TRANSFORMATION PILLARS                           │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────────────┐
    │                              BODY                                    │
    │                          (4 Pillars)                                │
    └─────────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
    │ 1. 5 AM         │  │ 2. Vedic        │  │ 5. Movement     │
    │    Initiation   │  │    Nutrition    │  │    Everyday     │
    │                 │  │                 │  │                 │
    │ Brahma Muhurta  │  │ Ahara Vidhi     │  │ Vyayama         │
    │ ⏰ 10 min       │  │ ⏰ 0 min        │  │ ⏰ 30 min       │
    │ ⭐ 15 karma     │  │ ⭐ 10 karma     │  │ ⭐ 12 karma     │
    └─────────────────┘  └─────────────────┘  └─────────────────┘

    ┌─────────────────┐
    │ 11. Sleep       │
    │     Optimization│
    │                 │
    │ Nidra           │
    │ ⏰ 0 min        │
    │ ⭐ 10 karma     │
    └─────────────────┘


    ┌─────────────────────────────────────────────────────────────────────┐
    │                              MIND                                    │
    │                          (4 Pillars)                                │
    └─────────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
    │ 3. Thoughts &   │  │ 4. Breathing +  │  │ 6. Healing      │
    │    Intention    │  │    Meditation   │  │    Meditation   │
    │                 │  │                 │  │                 │
    │ Sankalpa        │  │ Pranayama       │  │ Dhyana          │
    │ ⏰ 5 min        │  │ ⏰ 15 min       │  │ ⏰ 20 min       │
    │ ⭐ 12 karma     │  │ ⭐ 15 karma     │  │ ⭐ 15 karma     │
    └─────────────────┘  └─────────────────┘  └─────────────────┘

    ┌─────────────────┐
    │ 8. Gratitude    │
    │    Practice     │
    │                 │
    │ Kritajnata      │
    │ ⏰ 5 min        │
    │ ⭐ 10 karma     │
    └─────────────────┘


    ┌─────────────────────────────────────────────────────────────────────┐
    │                             SPIRIT                                   │
    │                          (3 Pillars)                                │
    └─────────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
    │ 7. Sandhya      │  │ 9. Connection   │  │ 10. Divine      │
    │    Meditation   │  │    to Brahman   │  │     Manifest    │
    │                 │  │                 │  │                 │
    │ Sandhyavandana  │  │ Brahma Sambandha│  │ Sankalpa Shakti │
    │ ⏰ 15 min       │  │ ⏰ 10 min       │  │ ⏰ 10 min       │
    │ ⭐ 20 karma     │  │ ⭐ 15 karma     │  │ ⭐ 12 karma     │
    └─────────────────┘  └─────────────────┘  └─────────────────┘


    TOTAL: 11 Pillars | ~120 minutes/day | 146 karma points possible
```

---

## Navigation Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           NAVIGATION STRUCTURE                               │
└─────────────────────────────────────────────────────────────────────────────┘


    DESKTOP SIDEBAR                           MOBILE BOTTOM NAV
    ═══════════════                           ══════════════════

    ┌─────────────────────┐                   ┌─────────────────────────────┐
    │  🕉️ 10X Vedic       │                   │                             │
    ├─────────────────────┤                   │  ┌─────┬─────┬─────┬─────┬─────┐
    │                     │                   │  │Home │Pills│Goals│Prog │Jrnl │
    │  PRIMARY            │                   │  │  🏠 │  📊 │  🎯 │  📈 │  📔 │
    │  ─────────          │                   │  └─────┴─────┴─────┴─────┴─────┘
    │  📊 Dashboard       │                   │                             │
    │  📚 Pillars         │                   └─────────────────────────────┘
    │  🎯 Goals           │
    │  📈 Progress        │                   Tools accessible via:
    │  📔 Journal         │                   - Settings menu
    │                     │                   - Dashboard quick links
    ├─────────────────────┤
    │                     │
    │  TOOLS              │
    │  ─────────          │
    │  ✨ Insights        │
    │  📄 Reports         │
    │  🔔 Reminders       │
    │  ⚙️  Settings       │
    │                     │
    └─────────────────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SECURITY MEASURES                                  │
└─────────────────────────────────────────────────────────────────────────────┘

    AUTHENTICATION                    AUTHORIZATION
    ══════════════                    ═════════════

    ┌─────────────────┐              ┌─────────────────┐
    │  Password Hash  │              │  Route Guards   │
    │  ─────────────  │              │  ─────────────  │
    │  bcryptjs       │              │  Middleware     │
    │  12 salt rounds │              │  JWT verify     │
    └─────────────────┘              └─────────────────┘

    ┌─────────────────┐              ┌─────────────────┐
    │  JWT Tokens     │              │  User Isolation │
    │  ─────────────  │              │  ─────────────  │
    │  jose library   │              │  All queries    │
    │  HS256 algo     │              │  filtered by    │
    │  7-day expiry   │              │  userId         │
    └─────────────────┘              └─────────────────┘

    ┌─────────────────┐              ┌─────────────────┐
    │  Secure Cookies │              │  SQL Injection  │
    │  ─────────────  │              │  ─────────────  │
    │  HTTP-only: ✓   │              │  Prisma ORM     │
    │  Secure: ✓      │              │  Parameterized  │
    │  SameSite: lax  │              │  queries        │
    └─────────────────┘              └─────────────────┘
```

---

## File Structure Summary

```
vedic-transform/
├── docs/
│   ├── ARCHITECTURE.md          # This file
│   └── PROJECT_SUMMARY.md       # Feature documentation
│
├── prisma/
│   ├── schema.prisma            # Database schema (16 models)
│   ├── seed.ts                  # Initial pillar data
│   └── dev.db                   # SQLite database file
│
├── public/
│   └── instructions/
│       └── welcome-guide.pdf    # Email attachment
│
├── src/
│   ├── app/
│   │   ├── (auth)/              # Public auth routes
│   │   ├── (main)/              # Protected app routes
│   │   ├── api/                 # API endpoints
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Landing page
│   │
│   ├── components/
│   │   ├── features/            # Feature components
│   │   ├── layout/              # Layout components
│   │   └── ui/                  # Base UI components
│   │
│   ├── config/
│   │   └── site.config.ts       # App configuration
│   │
│   ├── constants/
│   │   └── pillars.ts           # 11 pillar definitions
│   │
│   ├── lib/
│   │   ├── auth.ts              # Authentication utilities
│   │   ├── db.ts                # Prisma client singleton
│   │   ├── email/               # Email service factory
│   │   ├── insights/            # Insight generation
│   │   ├── reports/             # Report generation
│   │   └── utils/               # Utility functions
│   │
│   └── middleware.ts            # Route protection
│
├── .env.local                   # Environment variables
├── package.json                 # Dependencies
├── tailwind.config.ts           # Tailwind configuration
└── tsconfig.json                # TypeScript configuration
```

---

## Tech Stack Summary

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16.1.1 |
| UI Library | React | 19.2.3 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Animation | Framer Motion | 12.23 |
| Charts | Recharts | 3.6.0 |
| Icons | Lucide React | 0.562 |
| Database | SQLite | via Prisma |
| ORM | Prisma | 5.22 |
| Auth | JWT (jose) | 6.1.3 |
| Password | bcryptjs | 3.0.3 |
| State | Zustand + React Query | 5.x |
| Date | date-fns | 4.1.0 |
| Email | Resend / AWS SES / Azure | Switchable |

---

*Last Updated: December 25, 2024*
