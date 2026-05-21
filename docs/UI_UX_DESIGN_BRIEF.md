# 10X Vedic Transform — UI & UX Design Brief

> Hand this to a design-focused LLM (or human designer). It centers on **connectivity** — how screens link, how state flows, where the current wireframe falls apart. No code in this doc.
>
> Companion to `docs/UX_WIREFRAME_BLUEPRINT.md` (screen inventory + IA) and `docs/PROJECT_BLUEPRINT.md` (technical state). This brief assumes you've skimmed those.
>
> Live deployment: `https://10x.vedics.net`

---

## 1. The product in one breath

A 48-day Vedic transformation program. The user picks 1–3 wellness "pillars" out of 11, does them daily, earns karma points, builds a streak. Three quiet supporting habits: journal (gratitude/intention/manifestation), log mood, read daily wisdom. One AI guide. One dosha (Ayurvedic body type) test as a free top-of-funnel.

**The product is not new screens. It is a daily ritual.** The job of the UI is to make that ritual feel inevitable.

## 2. The customer in numbers

| Dimension | Number |
|---|---|
| Pillars total | 11 |
| Pillars picked as focus | 1–3 |
| Days in a journey | 48 |
| Required time per day | ~10–30 min |
| Times user opens app per day | ideally 1–3 (morning + maybe evening) |
| Time-to-value for new user | ~5 min from signup → first check-in |
| Critical conversion event | first 3 consecutive days of check-ins |

If a new user does not check in on Day 1, the program likely fails for them. **Day-1 design is more important than Day-30 design.**

## 3. The six user states

The UI MUST visibly differ across these. Today it doesn't.

| State | When | Visual tone | Primary message |
|---|---|---|---|
| **Visitor** | Public marketing, no account | Educational | "Discover your dosha" |
| **Anon dosha taker** | Took test, no account | Curious + result | "Sign up to apply your dosha" |
| **Registered** | Signed up, no journey | Welcoming, instructional | "Pick your focus and start Day 1" |
| **New** | Day 1–3, sparse data | Encouraging, simple | "Just this one thing today" |
| **Active** | Day 4–48, regular | Calm, confident | "Day 14. Your practice is Pranayama." |
| **At-risk** | 1–2 days since last check-in | Gentle amber, urgent | "Your 7-day streak is still yours" |
| **Dormant** | 3+ days since last check-in | Compassionate, low-friction | "Welcome back. Try 3 minutes." |
| **Completed** | Day 49+ | Celebratory, reflective | "You finished the mandala" |

## 4. Connectivity is the design problem

Most current UI problems are not "this screen is ugly." They are "I don't know where to go next" — connectivity gaps. Below: every gap, named.

### 4.1 The 7 connectivity gaps

| # | Gap | Where the user gets stuck |
|---|---|---|
| G1 | **Dashboard has no visual primary** | 8 sections compete equally; user has no idea which to tap |
| G2 | **Pillars vs Sessions vs Journal: which is "doing"?** | Three surfaces sound like "where I train"; users guess |
| G3 | **Onboarding → Dashboard is a cliff** | After picking pillars, user is dropped on dashboard with no guidance for tomorrow |
| G4 | **Timer completion ends in a dead end (mostly fixed)** | Was: "+15 karma" then nowhere to go. Now: "Next: <pillar>" CTA added (recent) |
| G5 | **Pillar detail page → mark complete = cheating** | Tapping "Mark complete" without doing the actual practice farms karma. (Recent fix routes timer-bearing pillars to /sessions instead) |
| G6 | **No "today complete" celebration** | When all focus pillars are done, no climactic moment. User just sees check icons. |
| G7 | **Public dosha test → signup flow is weak** | The free funnel doesn't strongly convert anon test-takers to accounts |

### 4.2 Recent fixes (so designer knows what's done)

- ✅ Dashboard `TodaysPractice` CTA now routes to the right Session timer (not pillar detail)
- ✅ 5 of 11 pillars have inline check-in via session timer completion
- ✅ Sessions tab order now matches pillar ID sequence
- ✅ "Next: <Pillar>" CTA appears after every timer completion
- ✅ Pillars page cards route via `practiceRouteForPillar()` — timer pillars open the timer, journal pillars open the journal tab, others open the detail page
- ✅ Pillars cards show a small chip indicating the action type (Timer / Journal / Mark done)
- ✅ Daily Brief card on dashboard (template + AI synthesis when data is rich)

What's still broken (this brief's main concern): the **first-day experience** and the **visual hierarchy of the dashboard**.

## 5. The 5 core user journeys (with full connectivity)

Each diagram = "every place a user can be → every place they can go next."

### Journey A — Visitor to Day-1 check-in (the conversion funnel)

```
[Landing /]
  ├─ "Take the free dosha test"     ──► [/dosha-test]
  │                                       ├─► [/dosha-test/quiz]
  │                                       │     ├─► [/dosha-test/result/{id}]   (anon, 90d TTL)
  │                                       │     │     ├─► "Sign up to apply"  ──► [/register]
  │                                       │     │     ├─► "Share my result"     (copy link)
  │                                       │     │     └─► "Take it again"        ──► restart
  │
  ├─ "Already know your dosha?"  ──► [/register]
  ├─ "Log in"                     ──► [/login]
  │
  ├─ "Learn more"      ──► [/how-it-works], [/pillars-overview], [/about]
  └─ "Read the blog"   ──► [/blog]
                              └─► [/blog/{slug}]    each post ends with CTA → /register

[/register]
  │  on success:
  ├─► claim anon dosha (if localStorage has anon id) → /onboarding
  └─► [/onboarding]
        ├─► Step 1: Welcome + your dosha (auto-claimed)
        ├─► Step 2: Pick your focus pillars (1–3 of 11)
        ├─► Step 3: Set your first reminder time
        └─► [/dashboard]   ◄── ⚠ G3: NO tooltip, no "your first practice tomorrow"
```

**Designer focus for Journey A:**
- Landing hero: make dosha test the primary CTA, signup secondary.
- Dosha result page: convert harder. Right now the share/CTA hierarchy is weak.
- Onboarding step 3 should culminate in a "Day 1 preview" — "Tomorrow at 6 AM your first practice will be Morning Initiation. We'll nudge you." Currently the user is dropped onto an empty-feeling dashboard.

### Journey B — Daily ritual (active user, the main loop)

```
[push notification 6 AM]
   "Day 14 — your practice today is Pranayama"
       │
       └─► tap → opens app
            │
            ▼
[/dashboard]
   ├─ Welcome banner ("Day 14 of 48, Tuesday May 21")
   ├─ DailyBriefCard ("Sleep was sparse this week. Lead with breathing tonight.")
   ├─ TodaysPractice ◄── ★ VISUAL ANCHOR
   │     │
   │     └─► [Start 10-minute breathing →]
   │             │
   │             ▼
   │       [/sessions?practice=breathing]
   │             │  user runs timer to completion
   │             ▼
   │       Completion view:
   │             ├─ "+15 karma earned"
   │             ├─ [Next: <next focus pillar> →]  ◄── routes to next timer
   │             ├─ [Restart breathing]            ◄── secondary
   │             │
   │             ▼ (if all focus done)
   │       "All practices done for today" + [Back to today →] → /dashboard
   │             │
   │             ▼
   │       [/dashboard]   ◄── ⚠ G6: no celebration moment
   │
   ├─ Streak / Karma / Pillar grid / Quick actions / Discover
   │      ◄── ⚠ G1: these 5 sections all compete with TodaysPractice
   │
   └─ Sidebar nav:
         Dashboard | Pillars | Sessions | Goals | Progress | Journal
         + Tools: Library, Posters, Dosha Quiz, Wisdom, Mood, Achievements,
                  Insights, Reports, Reminders, Settings
         (+ Admin if role=admin)
              ◄── ⚠ 16 sidebar destinations is too many
```

**Designer focus for Journey B:**
- Visual anchor for TodaysPractice must be unmistakable. Collapse Streak/Karma/Pillar grid into expandable widgets behind a "More for today" disclosure.
- Sidebar grouping needs work. See §10.
- The "Today complete" state needs design. Currently it's just check icons; it should feel like a small victory.

### Journey C — Pillar exploration (browse, not do)

```
[/pillars]   ← the catalog
   │
   ├─ Today's progress bar ("3 of 11 done — 27%")
   │
   ├─ Body section (4 cards: Morning, Fasting, Movement, Sleep)
   ├─ Mind section (4 cards: Thoughts/Intention, Breathing, Healing Med, Gratitude)
   ├─ Spirit section (3 cards: Sandhya, Brahman, Manifestation)
   │
   │  Each card shows: name, sanskrit, description (2 lines), karma value,
   │                   duration, chip [Timer / Journal / Mark done], ✓ if done today
   │
   └─ tap card → practiceRouteForPillar(slug)
                ├─► /sessions?practice=…       (5 timer pillars)
                ├─► /journal?action=…          (3 journal pillars: gratitude, intention, manifestation)
                └─► /pillars/{slug}             (3 mark-done pillars: sandhya, brahman, sleep)
                       │
                       └─► Detail page:
                            ├─ Long description / how to practice
                            ├─ [Mark complete] button
                            └─ Back to /pillars
```

**Designer focus for Journey C:**
- The Pillars catalog is now well-connected. Polish: make the section headers (Body/Mind/Spirit) more visually distinct. Consider a 3-tab layout instead of vertical stacking.
- Pillar detail page (only used by Sandhya, Brahman, Sleep now) should be redesigned as a **rich knowledge page** — not just a "Mark complete" button. Include scripture references, video/audio cues, when-to-do.

### Journey D — Reflection (the supporting habits)

```
[/journal]
   ├─ Tabs: Gratitude | Intention | Manifestation
   │   each tab: today's entry form + recent entries
   │
   └─ ?action=… url param pre-selects tab    ◄── ⚠ NOT YET WIRED (Journal page doesn't read this yet)

[/mood]
   ├─ Today's mood / energy / stress / sleep sliders
   └─ Past 30d chart

[/wisdom]
   ├─ Today's Vedic quote (Bhagavad Gita / Upanishads / etc)
   └─ Past 7 days

[/library]
   └─ Long-form audio + reading content with ContentProgress tracking
```

**Designer focus for Journey D:**
- Unify these four into a single "Reflect" surface with 4 tabs: Gratitude, Intention, Manifestation, Mood. (Wisdom moves to a daily card on the Today screen — see §6.) Library becomes a low-frequency exploration page.
- Wire the `?action=…` query param so the journal pre-selects the right tab — small but matters.

### Journey E — Progress & celebration

```
[/progress]
   ├─ Day 14 of 48 progress bar
   ├─ 4 KPI tiles: Streak / Karma / Avg mood / Pillars completed
   ├─ Bar chart: 7-day completion
   └─ Pillar leaderboard (most/least practiced)

[/insights]   ◄── live-computed from check-ins, no AI today
   └─ List of insights: strengths, weaknesses, milestones, recommendations

[/reports]
   └─ 48-day journey report with PDF certificate

[/achievements]
   └─ Badge grid + locked/unlocked

   ◄── ⚠ These 4 routes should collapse into ONE "Progress" hub with tabs.
```

**Designer focus for Journey E:**
- Merge Progress + Insights + Reports + Achievements into one screen. Tab structure: **Overview | Insights | Badges | Report**.

## 6. The Today screen — the most important wireframe

This is THE daily landing screen. Designer should spend the most time here. Five state variants required.

### 6.1 Active user (Day 14, on track)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🪷  10X Vedic              Day 14 / 48          🔥 7    ✨ 245      │ ← thin chrome
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Tuesday, May 21                                                    │
│   Good morning, Gopinath.                                            │ ← small heading
│                                                                      │
│   ┌─────────────────────────────────────────────────────────┐       │
│   │ ✨ Today's brief                                         │       │ ← Daily Brief
│   │ Your sleep was uneven this week. Lead with breathing    │       │   slim, indigo
│   │ tonight to ease into rest.                              │       │
│   └─────────────────────────────────────────────────────────┘       │
│                                                                      │
│   ╔═════════════════════════════════════════════════════════╗       │ ← THE ANCHOR
│   ║                                                          ║       │   Large card
│   ║    🌬  Today's practice                                  ║       │   3x weight of
│   ║                                                          ║       │   anything else
│   ║    Pranayama                                             ║       │
│   ║    Breathing + Meditation  •  10 min  •  +15 karma      ║       │
│   ║                                                          ║       │
│   ║    ┌──────────────────────────────────────────────┐    ║       │
│   ║    │   ▶  Start 10-minute breathing       →       │    ║       │
│   ║    └──────────────────────────────────────────────┘    ║       │
│   ║                                                          ║       │
│   ║         Too busy? Try 3 minutes instead                 ║       │
│   ╚═════════════════════════════════════════════════════════╝       │
│                                                                      │
│    Quick actions                                                     │
│    [ ✍ Journal ]   [ 😊 Mood ]   [ 📚 Wisdom ]                       │ ← chips
│                                                                      │
│   ▾ This week's progress    (collapsed)                              │
│   ▾ All 11 pillars          (collapsed)                              │
│   ▾ Discover                (collapsed)                              │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 New user (Day 1, 0 check-ins yet)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🪷  10X Vedic              Day 1 / 48           🔥 0    ✨ 0        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Welcome, Gopinath.                                                 │
│   Your 48-day mandala begins today.                                  │ ← welcoming tone
│                                                                      │
│   ┌─────────────────────────────────────────────────────────┐       │
│   │ 🪷 Your dosha: Vata-Pitta                                │       │ ← personalized
│   │ This practice is tailored to your constitution.         │       │   from onboarding
│   └─────────────────────────────────────────────────────────┘       │
│                                                                      │
│   ╔═════════════════════════════════════════════════════════╗       │
│   ║                                                          ║       │
│   ║    🌅  Your first practice                              ║       │
│   ║                                                          ║       │
│   ║    Morning Initiation                                    ║       │ ← Day 1 always
│   ║    Brahma Muhurta  •  5 AM rising routine               ║       │   starts here
│   ║                                                          ║       │
│   ║    Six gentle steps. ~15 minutes.                       ║       │
│   ║                                                          ║       │
│   ║    ┌──────────────────────────────────────────────┐    ║       │
│   ║    │   ▶  Begin your morning routine      →      │    ║       │
│   ║    └──────────────────────────────────────────────┘    ║       │
│   ║                                                          ║       │
│   ║    What to expect → (link, opens explainer)             ║       │
│   ╚═════════════════════════════════════════════════════════╝       │
│                                                                      │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│   Day 1 of 48. Just this one thing for today.                       │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.3 At-risk user (1 day off)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🪷  10X Vedic              Day 8 / 48           🔥 7    ✨ 89        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Welcome back, Gopinath.                                            │ ← gentle, no judgment
│                                                                      │
│   ┌─────────────────────────────────────────────────────────┐       │
│   │ ⚠ Your 7-day streak is still alive.                     │       │ ← amber, urgent
│   │ One practice today will save it.                        │       │
│   └─────────────────────────────────────────────────────────┘       │
│                                                                      │
│   ╔═════════════════════════════════════════════════════════╗       │
│   ║                                                          ║       │
│   ║    🌬  Lowest-friction practice                          ║       │
│   ║                                                          ║       │
│   ║    3-minute breathing                                    ║       │ ← suggest shortest
│   ║    Reset the rhythm, save the streak                    ║       │   timer available
│   ║                                                          ║       │
│   ║    ┌──────────────────────────────────────────────┐    ║       │
│   ║    │   ▶  Save my streak — 3 min          →      │    ║       │
│   ║    └──────────────────────────────────────────────┘    ║       │
│   ║                                                          ║       │
│   ║    Or pick a different pillar →                         ║       │
│   ╚═════════════════════════════════════════════════════════╝       │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.4 Dormant user (3+ days off)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🪷  10X Vedic              Day 12 / 48          🔥 0    ✨ 134       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Welcome back.                                                      │ ← compassionate
│                                                                      │
│   It's been 4 days. Your streak reset, but the path is               │
│   still yours. Begin again — small.                                  │
│                                                                      │
│   ╔═════════════════════════════════════════════════════════╗       │
│   ║                                                          ║       │
│   ║    🌬  Start with breath                                ║       │
│   ║                                                          ║       │
│   ║    3-minute Pranayama                                    ║       │
│   ║    Lowest-friction way back in                          ║       │
│   ║                                                          ║       │
│   ║    ┌──────────────────────────────────────────────┐    ║       │
│   ║    │   ▶  3 minutes                       →      │    ║       │
│   ║    └──────────────────────────────────────────────┘    ║       │
│   ║                                                          ║       │
│   ║    Want to start a fresh 48-day cycle? →                ║       │
│   ╚═════════════════════════════════════════════════════════╝       │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.5 Today complete (all focus pillars done)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🪷  10X Vedic              Day 14 / 48          🔥 8    ✨ 260       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                                                                      │
│                            🌸                                        │ ← celebratory
│                                                                      │   subtle animation
│                                                                      │   (lotus opens)
│                  Today's mandala complete.                           │
│                                                                      │
│              You honored all three focus pillars.                    │
│                  +52 karma earned today.                             │
│                                                                      │
│           ┌─────────────────────────────────────┐                   │
│           │  ✍  Capture today's reflection     │                   │ ← bonus journal
│           └─────────────────────────────────────┘                   │
│                                                                      │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                      │
│   Tomorrow's first practice: Movement                                │ ← preview                                                                       │
│   See you at 5 AM.                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.6 Completed (Day 49+)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                          ✨ ✨ ✨                                     │
│                                                                      │
│              48 days. Mandala complete.                              │
│                                                                      │
│            You walked the full transformation.                       │
│                                                                      │
│         [  See your journey report   ]   [  See achievements  ]      │
│                                                                      │
│         Begin a new 48-day cycle →                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 7. The Sessions screen (already half-good)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Back to today                                                      │
│                                                                      │
│   Practice                                                           │
│                                                                      │
│   ┌────────┬─────────┬───────────┬──────────┬────────────┐         │
│   │ Morning│ Fasting │ Breathing │ Movement │ Meditation │         │ ← pillar-ID order
│   └────────┴─────────┴───────────┴──────────┴────────────┘         │
│                                                                      │
│   ╔═════════════════════════════════════════════════════════╗       │
│   ║                                                          ║       │
│   ║                    [circular progress ring]              ║       │
│   ║                                                          ║       │
│   ║                          10:00                           ║       │
│   ║                       Breathe In · 4                     ║       │
│   ║                                                          ║       │
│   ║                 [▶ Start]  [↻ Reset]  [🔊]              ║       │
│   ╚═════════════════════════════════════════════════════════╝       │
│                                                                      │
│   The 4:6 pattern activates your parasympathetic nervous system.    │
└─────────────────────────────────────────────────────────────────────┘
```

**Completion state (after timer finishes):**

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                            🌸                                        │
│                          Namaste                                     │
│                      Session complete                                │
│                                                                      │
│                You meditated for 10 minutes.                         │
│                                                                      │
│           [ ✨ +15 karma earned ]   [ 🔥 8-day streak ]              │
│                                                                      │
│           ┌─────────────────────────────────────────────┐           │
│           │  Next: Movement                        →    │           │ ← primary
│           └─────────────────────────────────────────────┘           │
│                                                                      │
│           [ Restart breathing ]                                      │ ← secondary, small
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Designer note:** ✅ This is mostly built today. Polish: lotus animation on completion, smoother transition into next timer.

## 8. The Onboarding flow

Five screens. Each on its own page, progress dots at top.

```
[Step 1: Welcome]
   "Welcome to your 48-day mandala."
   Brief explainer (3 bullets): What it is. Why 48 days. What you'll do.
   [Continue →]

[Step 2: Dosha]
   If anon-dosha-claimed:
     "Your dosha: Vata-Pitta. Your practice will be tailored."
     [Continue →]
   Else:
     "Discover your Ayurvedic body type. Optional but recommended."
     [Take the 3-min dosha test  →]  [Skip for now]

[Step 3: Pick focus pillars]
   "Pick 1–3 pillars to focus on for this 48-day cycle."
   Grid of 11 pillar cards, multi-select with max=3
   Pre-recommend based on dosha (visual highlight on cards)
   [Continue with 2 selected →]

[Step 4: First reminder]
   "When should we nudge you?"
   Time picker (default 6 AM)
   Channel picker (push notification toggle, web push permission prompt)
   [Continue →]

[Step 5: Day 1 preview]   ◄── ⚠ G3: THIS IS WHAT'S MISSING
   ┌─────────────────────────────────────────┐
   │                                          │
   │   You're ready.                          │
   │                                          │
   │   Tomorrow at 6 AM, you'll get a nudge.  │
   │   Your first practice will be:           │
   │                                          │
   │      🌅 Morning Initiation               │
   │      Brahma Muhurta — 5 AM rising        │
   │                                          │
   │   It takes about 15 minutes.             │
   │                                          │
   │   [ Take me to my dashboard → ]          │
   │                                          │
   └─────────────────────────────────────────┘

   On dashboard, fire a one-time tooltip:
   "★ This is what you'll do each morning."
   pointing at TodaysPractice.
```

## 9. The public dosha funnel (the lead-gen)

```
[/ Landing]
   Hero copy:
     "Which Ayurvedic body type are you?"
     "Take the 3-minute dosha test to find out."
   Primary CTA: [Start the dosha test (free)]
   Secondary: "Already know your dosha? [Start the 48-day program]"
   Tertiary: Login link in top-right

[/dosha-test]
   Intro page explaining what dosha is (1 paragraph)
   Visual: 3 archetypes (Vata, Pitta, Kapha) with brief descriptions
   [Begin the quiz →]

[/dosha-test/quiz]
   12 questions, one at a time, large cards
   Progress bar at top (1 of 12 → 12 of 12)
   No "back" — forward-only to keep momentum
   On q12 [Submit →]

[/dosha-test/result/{id}]
   ┌──────────────────────────────────────┐
   │                                       │
   │            🪷 Your Dosha               │
   │                                       │
   │          Vata-Pitta dominant          │
   │                                       │
   │   ╔═════════════════════════════╗    │
   │   ║   Vata     ████████  60%    ║    │
   │   ║   Pitta    █████     35%    ║    │
   │   ║   Kapha    █          5%    ║    │
   │   ╚═════════════════════════════╝    │
   │                                       │
   │   You're a creative, fast-thinking,   │
   │   and intuitive type. Your practice   │
   │   should balance grounding (Vata)     │
   │   with cooling (Pitta).               │
   │                                       │
   │   ┌─────────────────────────────┐    │
   │   │  Apply this to a 48-day     │    │  ◄── PRIMARY CTA
   │   │  program tailored to your   │    │      tall, prominent
   │   │  dosha →                    │    │
   │   └─────────────────────────────┘    │
   │                                       │
   │   [📋 Copy link]   [📤 Share]         │
   │                                       │
   │   Want to take it again? →            │
   └──────────────────────────────────────┘
```

## 10. Information architecture — proposed nav

Collapse the current 16-route sidebar into this:

```
PRIMARY (always visible)
┌─────────────────┐
│  Today          │  ← replaces /dashboard
│  Pillars        │  ← unchanged (catalog of 11)
│  Sessions       │  ← unchanged (5 timers)
│  Reflect        │  ← NEW: merges /journal + /mood + /wisdom into 4 tabs
│  Progress       │  ← merges /progress + /insights + /reports + /achievements
└─────────────────┘

SECONDARY (under "More" or profile dropdown)
┌─────────────────┐
│  Library        │
│  Posters        │
│  Goals          │
│  Reminders      │
│  Settings       │
│  Dosha (retake) │
│  Logout         │
└─────────────────┘

ADMIN (only visible to role=admin)
┌─────────────────┐
│  Admin          │
└─────────────────┘
```

**Net result: 5 primary destinations instead of 16.** 3× cognitive load reduction.

## 11. Visual design system (already in place)

### Colors (tokens already in CSS)
- `--color-primary` orange/amber gradient (use sparingly, only for primary actions)
- `--color-secondary` golden accent
- `--color-bg-surface` page background
- `--color-card-bg` card surface
- `--color-border` muted golden
- `--color-text-primary / secondary / muted`

### Suggested palette additions
- **Streak amber** (warning/at-risk): `#F59E0B`
- **Success green** (complete state): `#10B981`
- **Indigo gradient** (AI/insight cards): `#6366F1 → #8B5CF6`
- **Soft lotus pink** (Day-1 / completion celebration): `#FCE7F3`

### Typography
- Currently: system sans-serif, no custom font
- Recommended: **Söhne** (or **Inter** as accessible substitute) for UI; **Cormorant Garamond** for headings to evoke traditional manuscripts. Single Sanskrit font: **Noto Sans Devanagari**.

### Iconography
- `lucide-react` is the icon set. Don't introduce a second.
- For sacred motifs (lotus, mandala, om), use bespoke SVGs — `lucide` doesn't carry them.

### Component vocabulary (already exists)
- `Card` (variants: default, elevated, golden)
- `Button` (variants: primary, secondary, outline, ghost, danger; sizes: sm, md, lg)
- `ShareButton`
- Pillar-specific visual components: `MeditationPosture`, `BreathingLotus`, `SunriseIllustration`

### Animation
- `framer-motion` available; currently sparse.
- Animation should communicate STATE CHANGE: check-in success (mini lotus bloom), streak milestone (gentle pulse), today-complete (the lotus blooms fully + petals scatter), at-risk (slow amber pulse).
- Never decorative motion — only state-driven.

## 12. The streak/karma visual language

A user's streak and karma are the gamification spine. Today they're shown as numeric tiles. Designer should consider richer treatments:

```
🔥 8-day streak       ── flame icon, color intensifies with streak length
                         11–20: orange
                         21–30: deep amber + glow
                         31+:   gold

🪷 Karma 245          ── small lotus, petals fill counter-clockwise as karma grows
                         every 100 karma = a "level" with a soft chime

🛡 1 Karma Shield     ── shield icon; appears when streak >=7, max 2 stored
                         pulses subtly when streak is at risk

Mandala progress      ── a circular 48-segment ring that fills daily
                         Day 14 → 14/48 segments lit, current segment shimmers
```

The mandala ring is the strongest visual metaphor — it makes the 48-day arc tangible. Designer should put one on the Today screen header.

## 13. Empty states matter more than full states

Design every screen for **Day 1 first, Day 30 second.**

| Screen | Empty state |
|---|---|
| Today | One CTA + soft welcome (see §6.2) |
| Pillars | All 11 cards visible, progress = 0%, "Today's first practice is highlighted" |
| Sessions | First tab pre-selected, "Run your first timer below" copy |
| Journal | "Three things you're grateful for today" pre-fill placeholders |
| Mood | "How are you feeling? Tap to log your first mood" |
| Progress | "Your progress will appear here after Day 1" + Day-1 hero card |
| Insights | "Insights appear after 3+ days of practice" |
| Achievements | All badges shown in locked state with hint copy |

## 14. Mobile experience

Web is responsive. Native mobile (Expo) is a separate codebase with 5 tabs.

**Convergence target:** web mobile + native mobile use the same 5-tab IA:

```
[Today] [Pillars] [Sessions] [Reflect] [More]
```

The web sidebar collapses to this hamburger on mobile. The native app already has 5 tabs (Home, Pillars, Sessions, Journal, More) — rename Home → Today, Journal → Reflect.

## 15. What I want from the receiving design LLM

Concrete deliverables, in priority order. The designer doesn't need to ship code — just polished mockups.

### Must-deliver
1. **Today screen, 6 state variants** (active, new, at-risk, dormant, today-complete, completed). Polished mockup, desktop + mobile.
2. **Onboarding flow, 5 steps** with the Day-1 preview screen explicitly designed.
3. **Sessions completion view** with lotus animation + Next CTA + Restart CTA.
4. **Public landing hero** with dosha test as primary CTA, signup secondary.
5. **Dosha result page** redesigned for stronger conversion.
6. **Sidebar nav** reduced from 16 → 5 primary destinations (see §10).
7. **Mandala progress ring** as a reusable component spec — used on Today header and on /progress.

### Should-deliver
8. **Reflect screen** (unified journal + mood + wisdom).
9. **Progress hub** (unified progress + insights + reports + achievements).
10. **Empty-state designs** for all 8 screens listed in §13.
11. **Streak / karma visual language** per §12 with state variations.

### Nice-to-have
12. Public marketing site redesign (blog list, single post, how-it-works).
13. Pillar detail page (rich knowledge page, not just a "Mark complete" button).
14. Native mobile redesign (Expo app at /mobile).

### Deliverable format
- Figma or PDF mockups
- Each screen at desktop (1280px) and mobile (375px)
- State variations clearly labeled
- Component callouts (which is reusable, which is one-off)
- Annotated transitions (when X happens, screen flips to Y)

## 16. Non-negotiables

The designer must respect these:

- **Vedic / Ayurvedic identity is core.** Sanskrit names alongside English. Subtle traditional motifs (lotus, mandala, sunrise). Do NOT redesign into a generic wellness app.
- **11-pillar structure is fixed.** Don't propose merging or removing pillars.
- **48-day length is fixed.** Don't propose changing the cycle.
- **Karma + streaks + Karma Shield are existing mechanics.** Don't propose alternative gamification.
- **Free today, monetization-ready.** Don't propose paywalls in V1.

## 17. Constraints the designer should know

- **Live deployment:** every screen must work on the deployed site. Major IA changes need a migration plan.
- **No native mobile-only patterns** (swipe gestures as primary nav, etc) — the web app comes first.
- **Accessibility:** WCAG AA color contrast, keyboard navigation, screen-reader-friendly. The orange/amber gradient often fails contrast on white — designer must address.
- **Performance:** keep first-load JS under 200KB. Heavy animation libraries are off-limits.

---

**Companions:**
- `docs/PROJECT_BLUEPRINT.md` — technical reality
- `docs/PROJECT_VISION.md` — roadmap
- `docs/UX_WIREFRAME_BLUEPRINT.md` — earlier UX brief (focused on IA)
- `docs/ARCHITECTURE.md` — system architecture
- This file — UI/UX design brief, focused on connectivity

**Live:** `https://10x.vedics.net`
