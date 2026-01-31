# Self-Service Tracking & Measurement Plan

## Executive Summary

This document outlines a comprehensive plan to maximize self-service capabilities for end users to track and measure their progress throughout the 48-day Vedic transformation journey. The goal is to empower users with actionable insights, visual analytics, and automated feedback loops that keep them engaged and accountable.

---

## Current State Analysis

### What Exists Today

| Feature | Location | Capabilities |
|---------|----------|--------------|
| Dashboard | `/dashboard` | Current day, streak, karma, today's pillars |
| Progress Page | `/progress` | 48-day grid, pillar consistency bars, badges |
| Journal | `/journal` | Gratitude (3 items), intentions, manifestations |
| Pillar Check-ins | `/pillars/[id]` | Mark complete, optional notes, mood before/after |
| Mood Logging | Database | moodScore, energy, stress (1-5 scales) |

### Data Already Captured (Prisma Schema)

```
DailyCheckin: date, pillar, completed, duration, notes, moodBefore, moodAfter
MoodLog: moodScore, energy, stress, notes
GratitudeEntry: 3 gratitude items per day
Intention: daily intention text, completed status
Manifestation: title, description, achieved status
Streak: currentStreak, longestStreak
KarmaTransaction: points, reason, timestamp
```

### Gaps Identified

1. **No visual trends** - Users can't see how they're improving over time
2. **No weekly/monthly summaries** - No aggregated views
3. **No self-assessment tools** - No baseline or periodic check-ins
4. **No goal setting** - Users can't set personal targets
5. **No insights/patterns** - Data collected but not analyzed
6. **No exportable reports** - Can't download progress summaries
7. **No reminders** - No proactive nudges to complete pillars
8. **Limited mood correlation** - Mood data captured but not visualized

---

## Proposed Self-Service Features

### Phase 1: Enhanced Analytics Dashboard (Priority: HIGH)

#### 1.1 Progress Charts & Graphs

**Weekly Trend Line Chart**
- X-axis: Days of the week
- Y-axis: Number of pillars completed
- Shows 4-week rolling comparison

```
Week 4: ████████████ 67 pillars
Week 3: ██████████   58 pillars
Week 2: ████████     45 pillars
Week 1: ██████       32 pillars
```

**Pillar Strength Radar Chart**
- 11-point radar showing consistency per pillar
- Visual identification of strong/weak areas
- Color-coded by category (Body/Mind/Spirit)

**Category Balance Pie Chart**
- Body vs Mind vs Spirit distribution
- Shows if user is balanced or skewed

#### 1.2 Calendar Heat Map

**GitHub-style Activity Grid**
- 48 days displayed as colored squares
- Color intensity = completion percentage that day
- Hover shows details: "Day 15: 9/11 pillars (82%)"

```
███████  ███████  ███████  ███████  ███████  ███████  ██
Mon-Sun  Mon-Sun  Mon-Sun  Mon-Sun  Mon-Sun  Mon-Sun  Mo
Week 1   Week 2   Week 3   Week 4   Week 5   Week 6   W7
```

#### 1.3 Streak & Consistency Metrics

**Enhanced Streak Display**
- Current streak with fire animation
- Longest streak achievement
- Streak calendar showing all streaks
- "Streak at risk" warning after 6 PM

**Consistency Score**
- Calculated as: (Completed Pillars / Possible Pillars) × 100
- Daily, weekly, monthly, and journey-wide scores
- Trend indicator (↑ improving, ↓ declining, → stable)

---

### Phase 2: Self-Assessment & Wellness Tracking (Priority: HIGH)

#### 2.1 Baseline Assessment (Day 1)

**Initial Self-Assessment Survey**
Captured once at journey start:

| Question | Scale | Purpose |
|----------|-------|---------|
| Current stress level | 1-10 | Baseline stress |
| Sleep quality | 1-10 | Baseline sleep |
| Energy throughout day | 1-10 | Baseline energy |
| Mental clarity | 1-10 | Baseline focus |
| Physical fitness | 1-10 | Baseline fitness |
| Emotional stability | 1-10 | Baseline mood |
| Spiritual connection | 1-10 | Baseline spirit |
| Overall life satisfaction | 1-10 | Baseline happiness |

#### 2.2 Weekly Check-in Survey

**Every 7 days, prompt user:**

```
How was your week? (Quick 2-min check-in)

1. Energy levels this week: ○○○○○ (1-5)
2. Sleep quality: ○○○○○ (1-5)
3. Stress levels: ○○○○○ (1-5)
4. Which pillar helped most? [Dropdown]
5. Biggest challenge this week? [Text]
6. One word to describe this week: [Text]
```

#### 2.3 Mood & Energy Trends

**Visual Mood Graph**
- Line chart showing mood over time
- Overlay with pillar completion
- Identify patterns: "Your mood is 23% higher on days you complete morning routine"

**Energy Tracking**
- Morning/afternoon/evening energy levels
- Correlation with sleep pillar completion

#### 2.4 Before/After Comparison

**Journey Milestone Comparisons**
- Day 1 vs Day 14 vs Day 28 vs Day 48
- Visual side-by-side of all metrics
- Percentage improvement calculations

```
                    Day 1    Day 24    Change
Stress Level:         7        4       ↓ 43%
Sleep Quality:        5        7       ↑ 40%
Energy:               4        7       ↑ 75%
Mental Clarity:       5        8       ↑ 60%
```

---

### Phase 3: Goal Setting & Personal Targets (Priority: MEDIUM)

#### 3.1 Pillar-Specific Goals

**User can set personal targets:**

```
Morning Initiation:
  ☑ Wake by 5:30 AM
  ☑ Complete 6 days/week
  ○ Achieve 7-day streak

Breathing Meditation:
  ☑ 10 minutes minimum
  ○ Progress to 20 minutes
  ○ Complete every day
```

#### 3.2 Weekly Goals

**Set at start of each week:**
- "This week I will complete at least ___ pillars"
- "I will focus especially on ___________"
- "My one word intention is ___________"

#### 3.3 Focus Pillars

**Mark 3 priority pillars to emphasize:**
- Highlighted on dashboard
- Extra karma points for completing focus pillars
- Tracked separately in analytics

---

### Phase 4: Insights & Pattern Recognition (Priority: MEDIUM)

#### 4.1 Automated Insights Engine

**Pattern Detection:**
- "You're 3x more likely to complete all pillars on weekdays"
- "Your longest streaks start on Mondays"
- "Sleep Optimization is your most consistent pillar"
- "Healing Meditation needs more attention (42% completion)"

**Correlation Insights:**
- "Days with morning routine have 35% better mood scores"
- "Your energy peaks when you complete Movement + Breathing"
- "Skipping Nutrition pillar correlates with lower afternoon energy"

#### 4.2 Weekly Insight Summary

**Automated weekly email or in-app card:**

```
📊 Your Week 3 Insights

✅ Strengths: Morning Initiation (100%), Gratitude (100%)
⚠️ Needs Focus: Sleep Optimization (43%), Nutrition (57%)

🔥 Your streak is now 18 days - personal best!
📈 Mood improved 12% compared to last week
💡 Tip: Try setting a sleep reminder at 9:30 PM
```

#### 4.3 Personalized Recommendations

Based on data patterns:
- "Consider focusing on evening pillars this week"
- "Your consistency drops on Sundays - set a reminder?"
- "You're close to unlocking the '21-Day Warrior' badge!"

---

### Phase 5: Reports & Export (Priority: MEDIUM)

#### 5.1 Downloadable PDF Report

**Weekly Progress Report:**
- Summary statistics
- Pillar completion chart
- Mood/energy trends
- Achievements earned
- Personalized insights

**Journey Completion Certificate (Day 48):**
- Beautiful certificate design
- Total karma earned
- Consistency percentage
- Badges achieved
- Transformation metrics (before/after)

#### 5.2 Data Export

**CSV Export Options:**
- Daily check-in history
- Mood/energy logs
- Gratitude entries
- Complete journey data

#### 5.3 Social Sharing

**Shareable Milestone Cards:**
- "I completed 7 days of my Vedic journey! 🔥"
- "21-day streak achieved! 💪"
- "Finished my 48-day transformation! 🎉"

---

### Phase 6: Reminders & Accountability (Priority: HIGH)

#### 6.1 Smart Reminders

**Configurable Notification Times:**

| Reminder | Default Time | Purpose |
|----------|--------------|---------|
| Morning Routine | 5:00 AM | Wake up prompt |
| Sandhya Morning | 6:00 AM | Sunrise meditation |
| Midday Check-in | 12:00 PM | Progress check |
| Sandhya Evening | 6:00 PM | Sunset meditation |
| Sleep Prep | 9:00 PM | Wind down reminder |
| Streak Warning | 8:00 PM | If no pillars completed |

#### 6.2 Email Digests

**Daily Digest (Optional):**
- Yesterday's completion summary
- Today's focus pillars
- Current streak status
- Motivational quote

**Weekly Digest:**
- Week's statistics
- Progress vs last week
- Insights and patterns
- Upcoming milestones

#### 6.3 Streak Protection

**Streak-at-Risk Alerts:**
- Push notification at 6 PM if nothing completed
- "Your 15-day streak is at risk! Complete 1 pillar to protect it."
- Highlight in dashboard with warning color

---

### Phase 7: Advanced Features (Priority: LOW - Future)

#### 7.1 AI Coaching (Virtual Acharya)

- Personalized guidance based on progress
- Answer questions about practice
- Adjust recommendations based on struggles

#### 7.2 Community Features

**Accountability Partners:**
- Pair with another user
- See each other's streaks
- Send encouragement messages

**Leaderboards (Optional):**
- Weekly karma leaders
- Longest streaks
- Most consistent practitioners

#### 7.3 Wearable Integration

**Connect fitness trackers:**
- Auto-log Movement pillar from step count
- Import sleep data for Sleep Optimization
- Heart rate for meditation sessions

---

## Database Schema Additions

```prisma
// Add to User model
model User {
  // ... existing fields
  weeklyGoals        WeeklyGoal[]
  selfAssessments    SelfAssessment[]
  insights           UserInsight[]
  reminderSettings   ReminderSettings?
  focusPillars       FocusPillar[]
}

// Baseline and periodic self-assessment
model SelfAssessment {
  id              String   @id @default(cuid())
  userId          String
  assessmentDate  DateTime
  assessmentType  String   // "baseline", "weekly", "milestone"
  stressLevel     Int      // 1-10
  sleepQuality    Int      // 1-10
  energyLevel     Int      // 1-10
  mentalClarity   Int      // 1-10
  physicalFitness Int      // 1-10
  emotionalStability Int   // 1-10
  spiritualConnection Int  // 1-10
  lifeSatisfaction Int     // 1-10
  notes           String?
  createdAt       DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId])
}

// Weekly goals
model WeeklyGoal {
  id            String   @id @default(cuid())
  userId        String
  weekStartDate DateTime
  targetPillars Int      // Target number of pillars
  focusArea     String?  // "body", "mind", "spirit"
  intention     String?
  achieved      Boolean  @default(false)
  actualPillars Int?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, weekStartDate])
  @@index([userId])
}

// Focus pillars (user's top 3 priority)
model FocusPillar {
  id        String   @id @default(cuid())
  userId    String
  pillarId  Int
  priority  Int      // 1, 2, or 3
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, pillarId])
  @@index([userId])
}

// Automated insights
model UserInsight {
  id          String   @id @default(cuid())
  userId      String
  insightType String   // "pattern", "recommendation", "achievement"
  title       String
  description String
  data        String?  // JSON data for visualization
  isRead      Boolean  @default(false)
  isDismissed Boolean  @default(false)
  createdAt   DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId])
}

// Reminder settings
model ReminderSettings {
  id                    String   @id @default(cuid())
  userId                String   @unique
  morningReminderTime   String?  // "05:00"
  eveningReminderTime   String?  // "21:00"
  streakWarningEnabled  Boolean  @default(true)
  dailyDigestEnabled    Boolean  @default(false)
  weeklyDigestEnabled   Boolean  @default(true)
  emailNotifications    Boolean  @default(true)
  pushNotifications     Boolean  @default(false)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## Implementation Roadmap

### Sprint 1 (Week 1-2): Analytics Foundation
- [ ] Pillar strength radar chart component
- [ ] Weekly trend line chart
- [ ] Calendar heat map component
- [ ] Enhanced progress page layout

### Sprint 2 (Week 3-4): Self-Assessment
- [ ] Baseline assessment survey (Day 1)
- [ ] Weekly check-in survey
- [ ] Assessment database models
- [ ] Before/after comparison view

### Sprint 3 (Week 5-6): Goal Setting
- [ ] Weekly goal setting UI
- [ ] Focus pillar selection
- [ ] Goal tracking dashboard widget
- [ ] Goal completion celebrations

### Sprint 4 (Week 7-8): Insights Engine
- [ ] Pattern detection algorithms
- [ ] Insight generation service
- [ ] Insight cards on dashboard
- [ ] Weekly insight summary

### Sprint 5 (Week 9-10): Reminders & Reports
- [ ] Reminder settings page
- [ ] Email digest templates
- [ ] PDF report generation
- [ ] Streak protection alerts

### Sprint 6 (Week 11-12): Polish & Launch
- [ ] Social sharing cards
- [ ] Data export functionality
- [ ] Journey completion certificate
- [ ] Performance optimization

---

## UI/UX Mockup Concepts

### Enhanced Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Day 15 of Your Journey                    [Settings] [?]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 🔥 Streak   │  │ ⚡ Karma    │  │ 📊 Score    │         │
│  │   15 days   │  │   2,340     │  │   78%       │         │
│  │ Best: 15    │  │ +120 today  │  │ ↑ 5% week   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Today's Pillars (7/11 complete)              [View] │  │
│  │  ● ● ● ● ● ● ● ○ ○ ○ ○                              │  │
│  │  Focus: Morning Initiation, Breathing, Sleep         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────────────┐  │
│  │  Weekly Trend       │  │  Pillar Strengths           │  │
│  │  ▁▃▅▇█▇▅           │  │      Morning                │  │
│  │  M T W T F S S     │  │    ╱───●───╲   Breathing    │  │
│  │                     │  │   ●         ●              │  │
│  │  +12% vs last week │  │   Sleep    Movement        │  │
│  └─────────────────────┘  └─────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  💡 Insight: Your mood is 30% higher on days you    │  │
│  │     complete the morning routine. Keep it up!        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Progress Page Enhancements

```
┌─────────────────────────────────────────────────────────────┐
│  Your Progress                              [Export PDF]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Journey Calendar                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ██ ██ ██ ░░ ██ ██ ██  Week 1 (85%)                 │   │
│  │ ██ ██ ██ ██ ██ ░░ ██  Week 2 (91%)                 │   │
│  │ ██ ░░ ██ ██ ██ ██ ░░  Week 3 (78%)   ← You are here│   │
│  │ ░░ ░░ ░░ ░░ ░░ ░░ ░░  Week 4                       │   │
│  │ ░░ ░░ ░░ ░░ ░░ ░░ ░░  Week 5                       │   │
│  │ ░░ ░░ ░░ ░░ ░░ ░░ ░░  Week 6                       │   │
│  │ ░░ ░░ ░░                Week 7                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Transformation Metrics                                     │
│  ┌───────────────────┬───────────────────┬──────────────┐  │
│  │ Day 1 Baseline    │ Current (Day 15)  │ Change       │  │
│  ├───────────────────┼───────────────────┼──────────────┤  │
│  │ Stress: 7/10      │ Stress: 4/10      │ ↓ 43%        │  │
│  │ Energy: 4/10      │ Energy: 7/10      │ ↑ 75%        │  │
│  │ Sleep: 5/10       │ Sleep: 8/10       │ ↑ 60%        │  │
│  │ Clarity: 5/10     │ Clarity: 7/10     │ ↑ 40%        │  │
│  └───────────────────┴───────────────────┴──────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Success Metrics

### User Engagement
- Daily active users completing pillars
- Average pillars completed per day
- Weekly check-in completion rate
- Time spent on progress page

### Retention
- 7-day retention rate
- Journey completion rate (Day 48)
- Streak maintenance rate
- Return visits to analytics

### User Satisfaction
- NPS score from in-app survey
- Feature usage analytics
- Export/share frequency
- Support ticket reduction

---

## Technical Considerations

### Performance
- Aggregate calculations should be cached
- Use React Query for data fetching with stale-while-revalidate
- Pre-calculate weekly summaries in background job
- Lazy load charts on scroll

### Charts Library
- **Recharts** (already installed) for line/bar charts
- Add **react-chartjs-2** for radar charts
- Custom SVG for heat map

### PDF Generation
- **@react-pdf/renderer** for client-side PDF
- Or **puppeteer** for server-side generation

### Email Service
- Already have Resend/AWS SES/Azure
- Create digest email templates
- Schedule with cron or Vercel cron

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Prioritize features** based on user needs
3. **Design mockups** for key screens
4. **Start Sprint 1** with analytics foundation

---

*Document Created: December 24, 2024*
*Status: Ready for Review*
