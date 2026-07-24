# 10x Vedic — Transformation Academy Roadmap

Vision: don't position 10x Vedic as a website that hosts a book. Build it as a
digital transformation academy where every chapter follows the same learning
cycle — **Learn → Understand → Practice → Reflect → Validate → Transform** —
so users get a measurable journey instead of passive reading.

## Phase 1 — The Chapter Learning Cycle ✅ (shipped 2026-07-24)

Every published chapter now ends with an interactive **Learning Cycle** rail:

| Step | What it does | Persistence |
|---|---|---|
| Read the Chapter | Claimed after the ceremonial read-through | `training:<slug>:read` |
| Key Learnings | Distilled takeaway cards (`keyTakeaways` in training-book.ts) | `training:<slug>:takeaways` |
| Daily Practices | References the chapter's exercises; claim after practicing | `training:<slug>:practice` |
| Guided Meditation | Links to /sessions with the chapter's sit length | `training:<slug>:meditation` |
| Reflection Journal | Chapter questions + link into /journal | `training:<slug>:reflection` |
| Self-Assessment | Inline 5-question quiz with explanations + score | `training:<slug>:quiz` |
| Daily Challenge | One real-world action (`dailyChallenge`) | `training:<slug>:challenge` |

All steps persist through the existing generic `/data/content-progress` API —
no backend changes. Completing every step auto-marks the chapter complete
(same contentId as the ChapterActions button) and surfaces the
"next stage unlocked" CTA.

Authoring a new chapter's cycle = filling four optional fields in
`src/data/training-book.ts`: `keyTakeaways`, `quiz`, `dailyChallenge`,
`meditationMinutes`. Chapters without them degrade gracefully (steps are
omitted from the rail).

## Phase 2 — Media & Motivation (next)

- **Cinematic lessons**: 8–15 min documentary video per chapter (subtitles,
  speed, chapter markers, transcript). Needs video production; player can be
  the existing `PexelsVideo`/HTML5 stack + a `lessonVideo` field. Interim: a
  narrated audio version of each chapter (ElevenLabs or recorded) as
  "Audio Narration" in the reader.
- **Per-chapter meditation audio**: wire specific session tracks (not just
  /sessions) — `meditationTrackId` joining the sessions library. Morning /
  evening / deep / sleep variants per the vision.
- **Reading enhancements**: highlights, notes, bookmarks (localStorage first,
  Dynamo later), font-size control. "Exactly like Kindle."
- **Gamification depth**: chapter-specific badges (First Meditation, 7-Day
  Streak, Chapter Master, Reflection Champion) — achievements.ts exists;
  add training-triggered awards. 48-Day Journey completion trophy.
- **Journey view on dashboard**: "Day N of 48 · current chapter · today's
  practice / reflection / next milestone" hero card (data already available
  from content-progress + checkin).

## Phase 3 — Academy (backend-heavy)

- **Practical assignments**: multi-day observations with journal upload +
  teacher review queue. Needs `assignments` table + review states.
- **Certificates**: completion certificate (PDF via @react-pdf/renderer,
  already a dependency) + LinkedIn share URL. Trigger: all published chapters
  complete.
- **Teacher dashboard**: cohort metrics (students, completions today, average
  score, practice completion, hardest chapter), per-student profile,
  needs-attention flags (no practice in N days), announcements, journal
  replies, assignment grading, bonus-content unlocks, live-session schedule,
  reminders. Builds on admin-users.ts + cohort.ts.
- **Community**: per-chapter discussion ("What changed after today's
  practice?"). Needs `discussions` table + moderation.
- **Admin CMS**: manage chapters/lessons/videos/posters/practices/audio/
  questions/quizzes/certificates/notifications without code changes — move
  training-book.ts content into Dynamo + an admin editor. Largest lift; keep
  code-as-content until content team exists.
- **Structured 48-day calendar**: day-by-day plan (reading + meditation +
  reflection + challenge per day) mapping chapters onto the 48-day Mandala —
  joins the existing journey.ts/checkin.ts machinery.

## Design references

- Penpot file "Vedic Wellness — Site Redesign" (rename pending), pages
  01–04; training chapter experience boards on page 04.
- Chapter ceremony pattern: `src/components/features/training/chapter-experience.tsx`
  (+ `CEREMONY` config per chapter) and `chapter-journey.tsx` (learning cycle).
