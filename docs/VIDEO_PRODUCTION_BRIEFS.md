# Library Video Production Briefs — V1 through V7

Production briefs for the 7 broken video cards in the in-app Library
(`/library`). Each card currently points to a dead YouTube URL. After you
record + upload each video, paste the YouTube URL into the matching entry
in `src/data/content-library.ts` (instructions at the bottom of this doc).

> **Brand voice reminder:** friendly, didactic, gently spiritual. Pair every
> Sanskrit term with a one-line English explanation. Specifics over
> superlatives. Imperative CTAs ("Try this," "Sit for one minute"). No "I"
> as founder voice — use "we" sparingly, "you" liberally. Numbers over
> adjectives ("48 days · 11 pillars · 60 min/day"). No hype.

---

## Part 1 — Universal production setup

These elements stay constant across all 7 videos. Build the setup once and
batch-record. A weekend per pair of videos is realistic if you batch.

### Camera + audio
- **Camera:** any smartphone in 4K/30fps, landscape, locked focus + locked
  exposure. iPhone 13 or newer is plenty.
- **Tripod:** any cheap $30 tripod with a phone clamp. Eye level when seated.
- **Mic:** a $20 lavalier (Boya BY-M1) plugged into the phone. Built-in mic
  picks up too much room. If you record in the same room across all 7,
  the audio matches.
- **Backup:** record audio simultaneously on a second phone with the Voice
  Memos app, placed near you. Saves you if the lav fails on take 6.

### Lighting + framing
- **Time of day:** record before 10 AM or after 4 PM to catch warm window
  light. Avoid overhead noon light.
- **Position:** face the window at 45°, never directly into or away from it.
- **Frame:** waist-up, eyes one-third from the top of frame. Leave headroom.
- **Background:** soft-focus indoor — a wood-toned bookshelf, a single
  plant, a brass diya in soft focus behind you. Avoid pure white walls
  (boring) and visual clutter (distracting).

### Wardrobe + tone
- Wear what you'd wear to teach a class — kurta, simple plain shirt, or
  cream-colored linen. Avoid logos, busy patterns, pure white.
- Speak as if to one student sitting across the table. Not to an audience.

### Reusable assets you'll build once
You'll thank yourself if you batch-create these BEFORE recording the
voiceovers, then drop them into every edit:

- **5-second intro:** lotus logo animation + "10X Vedic" wordmark + the
  active pillar name appearing in saffron. Make this once in Canva or
  CapCut and reuse.
- **10-second outro:** "Continue inside the app" + lotus logo + URL
  10x.vedics.net + a "Subscribe" button overlay.
- **Lower-third name plate:** "Your name — 10X Vedic" appearing for 5
  seconds at 0:15 of every video.
- **B-roll vault folder:** save every Pexels clip you download into one
  folder organized by tag (`sunrise/`, `temple/`, `flame/`, `lotus/`,
  `yoga/`, `food/`). You'll reuse the same clips across multiple videos.

### Music
Default music bed: **Aakash Gandhi — "Dhanam"** or **"Drone in D"** from
the YouTube Audio Library (free, no attribution required). Soft Indian
flute + tambura drone, low volume (–18dB under voice). Avoid anything
percussive — kills the meditative tone.

### Editing rhythm
- Cut to b-roll every 8–12 seconds. Holding on a talking head longer than
  that loses retention.
- Use the lower-third name plate at 0:15 and never again.
- Add auto-captions in CapCut. 80% of YouTube watch time on educational
  content has captions on — without them you lose half the audience.
- Color-grade with a single LUT (CapCut's "Warm Film" or "Cinematic").
  Apply to every video for visual consistency.

---

## Part 2 — Per-video production briefs

### V1 — Designing Your Sacred Morning Routine (12 min)

**Pillar:** Morning Initiation · Brahma Muhurta
**Card duration:** 12 min
**Tone:** practical, didactic, the most "useful" of the 7 — viewers will
find this through search

**Opening hook (0:00–0:30, camera on you):**
> "The most powerful hour of your day is over before you wake up. The
> Vedic tradition calls it *Brahma Muhurta* — the Creator's hour, roughly
> 96 minutes before sunrise. What you do in it shapes the next sixteen.
> Today I'll walk you through the morning routine I use and the reasoning
> behind every step."

**Beat sheet:**
| Time | Beat | Visual |
|---|---|---|
| 0:00–0:30 | Hook | You on camera |
| 0:30–2:00 | What is Brahma Muhurta — Ashtanga Hridaya Sutra Sthana 2 reference (96 min before sunrise, when all three doshas rest in balance) | Sunrise b-roll + on-screen Sanskrit |
| 2:00–4:00 | Step 1: wake without phone reactivity. Tongue scraping (jihva nirlekhana). 4 oz warm water from a copper vessel (tamra patra) | Close-up b-roll: copper vessel, tongue scraper, water pour |
| 4:00–6:00 | Step 2: 5 min movement — 5 Surya Namaskar rounds or a 5-min outdoor walk | Demonstrate one Surya Namaskar round on camera in real time |
| 6:00–8:30 | Step 3: 5 min Pranayama — demonstrate Nadi Shodhana (alternate nostril). Talk through hand positions | You on camera, full demo |
| 8:30–10:30 | Step 4: Sankalpa — one-line written intention in present tense ("I am steady today"). Show the actual notebook | Close-up of pen writing a Sanskrit + English line |
| 10:30–11:30 | Tomorrow's smallest viable version: 10 minutes total. Wake → water → 3 breaths → one Sankalpa line | You on camera |
| 11:30–12:00 | CTA: "Open the Morning Routine session inside the app and try the seven-step guided version" | App screen recording |

**B-roll vault items needed:**
- Sunrise over mountains (Pexels: "sunrise mountain meditation")
- Hands pouring water from copper vessel (Pexels: "copper water india")
- Steam rising from a cup, slow-motion (Pexels: "tea steam")
- Tongue scraper on marble (you film this yourself, 15 sec)
- Open notebook with handwritten Sanskrit (you film this, 15 sec)

**AI b-roll prompt (for Runway Gen-3 / Sora / Luma):**
> Cinematic shot of a single oil lamp burning in a dark Indian temple at
> pre-dawn. Slow zoom out reveals a wooden floor, a brass diya, smoke
> rising slowly. Warm golden glow. 4K. Anamorphic lens. Shallow depth of
> field. 10 seconds.

**Music:** Aakash Gandhi "Dhanam," intro/outro stings only — keep voiceover
clean.

---

### V2 — Introduction to Sattvic Eating (18 min)

**Pillar:** Vedic Nutrition + Fasting · Ahara Vidhi
**Card duration:** 18 min — the longest of the seven; works as a deep-dive
**Tone:** educational + appetizing; this is the one with the most
home-screen-of-Instagram potential

**Opening hook (0:00–0:30):**
> "Three thousand years before nutrition labels existed, Ayurveda
> classified every food into one of three categories — *Sattvic*, *Rajasic*,
> *Tamasic*. The category determines not just what your body does with
> the food, but what your mind does with the day. In the next eighteen
> minutes I'll teach you the framework and give you one Sattvic recipe to
> start tomorrow."

**Beat sheet:**
| Time | Beat | Visual |
|---|---|---|
| 0:00–0:30 | Hook | You |
| 0:30–2:30 | The three gunas — Sattva (clarity), Rajas (activity), Tamas (dullness). One-line definition + one food example each | On-screen text overlay: 3 columns |
| 2:30–6:00 | Sattvic foods deep dive: fresh fruit, soaked nuts, whole grains, ghee, mung dal, milk (unhomogenized), honey, herbal tea | Close-up b-roll of each food in good light |
| 6:00–8:00 | Rajasic foods: onion, garlic, coffee, chocolate, refined sugar, very spicy food. Not "bad" — just stimulating | B-roll: street food, espresso |
| 8:00–9:30 | Tamasic foods: leftover food (older than 3 hours), deep-fried, processed, alcohol, meat (in classical Vedic view) | B-roll: fast food packaging, microwave |
| 9:30–11:00 | The 60-30-10 rule for transitioning: aim 60% Sattvic, 30% Rajasic, 10% Tamasic — no purity culture | On-screen pie chart |
| 11:00–13:00 | Eating mechanics from Ayurveda: largest meal at noon, sit while eating, no liquid 30 min before/after, eat to 75% full | You + b-roll of a clock, plate |
| 13:00–16:30 | Demo recipe: simple kichari (ghee, mung dal, basmati rice, cumin, turmeric, ginger, salt). Show every step in your kitchen | You cooking, ingredients shots |
| 16:30–17:30 | What to expect in the first week of Sattvic eating: lighter sleep, sharper mornings, mild detox headache day 2-3 | You on camera |
| 17:30–18:00 | CTA: "Track your meals in the Fasting + Nutrition pillar" | App screen recording |

**B-roll vault items needed:**
- Wooden cutting board with vegetables (Pexels: "indian vegetables wood")
- Ghee being poured in pan (Pexels: "ghee pouring")
- Steaming bowl of rice + dal (Pexels: "kichari basmati")
- Pestle + mortar with spices (Pexels: "indian spices mortar")

**AI b-roll prompt:**
> Top-down macro shot of golden ghee melting slowly in a brass pan over a
> low flame. Cumin seeds drop in and start to sizzle and crackle. Warm
> kitchen light. Steam rises. Shallow depth of field. 10 seconds.

**Music:** lighter than V1 — try Aakash Gandhi "Pendant of the Lord" or
similar warm-instrumental piece. This one's more "kitchen video" energy.

---

### V3 — Pranayama Fundamentals: Breath as Medicine (22 min)

**Pillar:** Breathing + Meditation · Pranayama
**Card duration:** 22 min — longest; includes a live practice-along
**Tone:** instructional + experiential. By the end the viewer has actually
done 5 minutes of pranayama with you.

**Opening hook (0:00–0:30):**
> "Stress is the defining illness of our age. The most powerful antidote
> is something you've done 25,000 times today already — you've just done
> it on autopilot. Today I'll teach you three Pranayama techniques the
> Rishis described 5,000 years ago, and that modern neuroscience now
> measures in cortisol drops and vagal-tone increases. By the end of
> this video you'll have practiced one with me."

**Beat sheet:**
| Time | Beat | Visual |
|---|---|---|
| 0:00–0:30 | Hook | You |
| 0:30–2:30 | What "Prana" + "Ayama" mean. Yoga Sutras 2.49–53 reference. The bridge between voluntary + involuntary nervous systems | On-screen Sanskrit + translation |
| 2:30–4:30 | The vagus nerve — modern bridge to the same claim. Cite 2017 Frontiers in Psychology study on 20-min pranayama cortisol drop | Anatomy diagram overlay |
| 4:30–7:00 | **Technique 1: Dirga Pranayama (3-part breath)** — explain the diaphragmatic / thoracic / clavicular layers | You demonstrate, hand on belly |
| 7:00–10:00 | **Technique 2: Nadi Shodhana (alternate nostril)** — full demo, hand position (Vishnu mudra), 4-count in / 4-count hold / 4-count out | You demonstrate full cycle |
| 10:00–12:30 | **Technique 3: Bhramari (humming bee)** — close ears, hum on exhale. Vibration calms vagus | You demonstrate, audio is the point |
| 12:30–14:00 | Common mistakes: holding breath too long, breathing through chest, practicing on a full stomach | Bullet overlay |
| 14:00–19:00 | **Live practice-along (5 min):** guide viewer through Nadi Shodhana with a timer on screen. This is the heart of the video | You + on-screen breath cue |
| 19:00–21:00 | When to use each: morning (Dirga), midday reset (Nadi Shodhana), anxious moment (Bhramari) | You |
| 21:00–22:00 | CTA: "Inside the app, open Breathing → the lotus blooms with each inhale. Try the 4:7:8 pattern next" | App screen recording of lotus |

**B-roll vault items needed:**
- Slow close-up of breath / steam visible in cold air (Pexels: "winter breath")
- Lotus flower opening time-lapse (Pexels: "lotus blooming")
- Tree leaves moving in slow wind (Pexels: "wind trees slow motion")
- Vagus nerve anatomy illustration (create in Canva from a free anatomy image)

**AI b-roll prompt:**
> Slow-motion cinematic shot of a single pink lotus flower opening in a
> still pond at sunrise. Camera slowly pushes in. Soft golden light.
> Reflections in water. 4K. 15 seconds. Looped.

**Music:** drop music entirely during the 5-min practice-along
(14:00–19:00). Pure voice + breath sounds is more effective than music
under instruction.

---

### V4 — Vedic Movement: Beyond Modern Exercise (15 min)

**Pillar:** Movement Everyday · Vyayama
**Card duration:** 15 min
**Tone:** energetic but grounded; the action video of the seven

**Opening hook (0:00–0:30):**
> "Modern exercise asks one question — how hard can you push? Vedic
> movement asks a different one — how present can you be while moving?
> The answer changes everything: what you do, for how long, and what it
> does for you. Today I'll show you the four pillars of Vedic movement
> and a 7-minute morning sequence you can start tomorrow."

**Beat sheet:**
| Time | Beat | Visual |
|---|---|---|
| 0:00–0:30 | Hook | You |
| 0:30–2:00 | Vyayama defined — the classical Ayurvedic injunction is to exercise to half your capacity (ardha-shakti), never to exhaustion | On-screen Sanskrit |
| 2:00–4:00 | **Pillar 1: Surya Namaskar (sun salutations)** — full 12-pose flow demonstrated slowly on camera, named in Sanskrit + English | You doing 1 round in full, 1.5 min |
| 4:00–6:00 | **Pillar 2: Mindful walking** — pace, where to look, breath rhythm. 20 min daily minimum | B-roll: walking trail + you walking |
| 6:00–8:00 | **Pillar 3: Strength flow** — bodyweight (squats, planks, push-ups) integrated with breath. Demo a 5-rep set | You demo set in real time |
| 8:00–9:30 | **Pillar 4: Standing breaks** — Ayurveda's prescription against prolonged sitting. Every 60 min: stand + 5 cat-cow stretches | You demo at a desk |
| 9:30–12:30 | **The 7-minute morning sequence:** Surya Namaskar (3 rounds) → 1 min plank → 10 squats → 2 min mindful walk → close with Tadasana (mountain pose) | You doing the full 7 min, real time |
| 12:30–14:00 | Why this beats a 60-min gym session for your nervous system (parasympathetic activation, no cortisol spike) | You |
| 14:00–15:00 | CTA: "Open Movement in the app. The Yoga Library has guided GIFs for every pose I just showed" | App screen recording |

**B-roll vault items needed:**
- Outdoor yoga / Surya Namaskar against a horizon (Pexels: "surya namaskar sunrise")
- Slow-motion walking feet on grass (Pexels: "walking grass")
- Tree pose silhouette (Pexels: "yoga silhouette")

**AI b-roll prompt:**
> Wide cinematic shot of a single person doing Surya Namaskar at sunrise
> on a wooden deck overlooking mountains. Silhouette against orange sky.
> 4K. Slow camera dolly left. 15 seconds.

**Music:** more rhythmic than V1-V3 — try Aakash Gandhi "Ascending the
Vibration" or Asher Fulero "Slow Lights" for the practice-along beats.

---

### V5 — Sandhya Vandana: The Twilight Meditation Practice (16 min)

**Pillar:** Sandhya Meditation · Sandhyavandana
**Card duration:** 16 min
**Tone:** the most ritualistic + reverent of the seven. Old-tradition feel.

**Opening hook (0:00–0:30):**
> "The Rig Veda's oldest practice happens three times a day, at the
> three junctions when the world changes — dawn, noon, and dusk. The
> Rishis called them *sandhi* — joints — and believed that what you do
> at these junctures shapes your relationship to time itself. Most
> modern practitioners have never been taught even a simplified version.
> Today I'll teach you one you can do in 2 minutes."

**Beat sheet:**
| Time | Beat | Visual |
|---|---|---|
| 0:00–0:30 | Hook | You |
| 0:30–2:30 | What sandhi means. The 3 sandhya: pratah (sunrise), madhyahna (noon), sayam (sunset) | Sun arc diagram overlay |
| 2:30–4:30 | Why junctures matter in Vedic cosmology — energy shifts at these moments, observable in animal behavior, plant heliotropism | Time-lapse of flowers tracking the sun |
| 4:30–7:00 | Traditional structure (3 components): achamana (water sip), pranayama (3 breaths), Gayatri mantra (108 or 11 reps) | You demonstrate achamana |
| 7:00–9:30 | The Gayatri mantra itself — pronunciation drill, word-by-word translation. From Rig Veda 3.62.10 | Sanskrit on screen, slowed pronunciation |
| 9:30–12:00 | **Demo: full pratah sandhya** (sunrise practice, 4 min) — you facing east, real-time | You doing it, real time |
| 12:00–13:30 | The 2-minute simplified version for busy practitioners: face east, 3 breaths, 3 Gayatris, sit 30 sec | You doing the short version |
| 13:30–15:00 | What changes after 30 days of consistent sandhya: better internal sense of time, calmer transitions, deeper sleep | You |
| 15:00–16:00 | CTA: "Inside the app, Sandhya is built in — face the direction the compass shows and follow the prompts" | App screen recording with compass |

**B-roll vault items needed:**
- Sunrise over water (Pexels: "sunrise ocean")
- Noon sun through trees (Pexels: "sun through leaves")
- Sunset / dusk over a temple (Pexels: "indian temple sunset")
- Brass kalash / water vessel (Pexels: "brass kalash")

**AI b-roll prompt:**
> Cinematic wide shot of an Indian sage facing east at sunrise, silhouette
> against orange-pink sky, brass kalash in hand, performing achamana
> (water ritual). Slow camera push in. 4K. 12 seconds.

**Music:** the most traditional palette — try a recorded Gayatri mantra
at very low volume (–22dB) as bed, only when you're not speaking. Public
domain recordings exist on Wikimedia Commons.

---

### V6 — Sankalpa: The Vedic Science of Manifestation (13 min)

**Pillar:** Divine Manifestation · Sankalpa Shakti
**Card duration:** 13 min
**Tone:** the most philosophical of the seven. This one positions the
brand as "not woo-woo manifestation."

**Opening hook (0:00–0:30):**
> "Most manifestation teaching is half-truth and the other half is what
> goes wrong. The Vedic tradition has a precise term for this work —
> *Sankalpa* — and the rules for using it are very different from what
> Instagram quotes will tell you. In thirteen minutes I'll teach you the
> three properties a real Sankalpa must have, the most common mistake,
> and how to plant one today."

**Beat sheet:**
| Time | Beat | Visual |
|---|---|---|
| 0:00–0:30 | Hook | You |
| 0:30–2:00 | Sankalpa defined — "the mental resolve formed at the level of identity, not desire." Not "I want X" but "I am the kind of person who X" | On-screen Sanskrit + definition |
| 2:00–3:30 | Why it differs from goal-setting: Sankalpa is *who you are becoming*, goals are *what you produce* | Side-by-side comparison overlay |
| 3:30–5:30 | **Property 1: Present tense.** Never "I will" or "I want." Always "I am." The mind cannot act on future tense | Examples on screen |
| 5:30–7:30 | **Property 2: Affirmative.** Never "I won't get angry." The unconscious deletes negations. Use "I am calm" | Examples on screen |
| 7:30–9:30 | **Property 3: Plausible to the believer.** A Sankalpa your gut rejects has no traction. Build belief progressively | Examples on screen |
| 9:30–11:00 | The common mistake: trying to manifest objects (cars, money). Vedic Sankalpa works at the level of identity, which then produces results. Reverse the order and it fails | You on camera, this is the key teaching |
| 11:00–12:30 | Planting the Sankalpa: write it, speak it aloud, repeat at the threshold of sleep (when the unconscious is most receptive), revisit at dawn | You demo with a notebook |
| 12:30–13:00 | CTA: "Inside the app, the Manifestation pillar walks you through Sankalpa-setting in three steps" | App screen recording |

**B-roll vault items needed:**
- Pen writing in notebook (Pexels: "writing journal")
- Hands cupped, palms open (Pexels: "open hands meditation")
- Seed being planted in soil — metaphor for Sankalpa (Pexels: "seed planting")

**AI b-roll prompt:**
> Macro slow-motion shot of a single seed being placed into rich dark
> soil by careful hands. Soft natural light. Shallow depth of field.
> Then time-lapse of a small green sprout breaking soil. 10 seconds.

**Music:** softest of the seven — try Asher Fulero "Eternity in an Hour"
or Aakash Gandhi "Sahara Skye." Don't overpower the intellectual content.

---

### V7 — Vedic Sleep Rituals for Deep Restoration (11 min)

**Pillar:** Sleep Optimization · Nidra
**Card duration:** 11 min — shortest; viewer is already tired
**Tone:** the most calming of the seven. Pace slower, lower vocal
register, longer pauses

**Opening hook (0:00–0:30):**
> "Bad sleep is the most expensive habit you have — it costs you the
> next day's clarity, your immune system, and your patience. Ayurveda
> mapped the rules of deep sleep three thousand years before sleep
> labs existed. Tonight I'll give you the four-step Vedic wind-down
> ritual, and a short Yoga Nidra practice you can do in bed."

**Beat sheet:**
| Time | Beat | Visual |
|---|---|---|
| 0:00–0:30 | Hook | You, dimmer lighting than other videos |
| 0:30–2:00 | The Ayurvedic frame: sleep before 10 PM. The Kapha-to-Pitta transition happens at 10 PM — past it, you get second-wind energy that delays sleep onset by hours | Dosha clock overlay |
| 2:00–4:00 | **Step 1: phone in another room by 9:30 PM.** Blue light suppresses melatonin for 90 min. Non-negotiable | B-roll: phone going on dresser in another room |
| 4:00–5:30 | **Step 2: warm milk + ghee + nutmeg** (or non-dairy equivalent). The classical Ayurvedic sleep tonic. Why nutmeg works (myristicin) | Kitchen b-roll: pouring warm milk, grating nutmeg |
| 5:30–7:00 | **Step 3: feet massage with sesame oil** (padabhyanga). Marma points on the feet trigger parasympathetic dominance | You demonstrate (briefly, modestly) |
| 7:00–8:30 | **Step 4: Yoga Nidra prep** — lie in savasana, body scan, conscious release of each body part | You lying down or sitting calmly |
| 8:30–10:30 | **Short Yoga Nidra (2 min)** — talk viewer through a body scan, head to toe | Black screen with soft star backdrop OR you in low light |
| 10:30–11:00 | CTA: "Inside the app, Sleep Optimization has a full 25-minute Yoga Nidra audio. Bookmark it on your nightstand" | App screen recording |

**B-roll vault items needed:**
- Moonlight through window (Pexels: "moonlight bedroom")
- Steam from warm milk in a brass tumbler (Pexels: "warm milk")
- Bedside candle being blown out (Pexels: "candle blow out")
- Starry sky time-lapse (Pexels: "night stars")

**AI b-roll prompt:**
> Cinematic shot of a single candle burning beside an open Ayurvedic
> text and a brass cup of warm milk on a wooden bedside table. Warm
> amber glow. Camera slowly orbits left. Background fades to dark blue
> moonlight. 12 seconds.

**Music:** the most ambient of the seven. Try Aakash Gandhi "Aakash
Gandhi — Aaroh" or Chris Zabriskie "Cylinder Five." Volume very low
(–22dB).

---

## Part 3 — Once you have the YouTube URLs

For each video, after you upload to YouTube and grab the share URL,
update `src/data/content-library.ts`:

```typescript
{
  id: "content-morning-routine",          // V1
  title: "Designing Your Sacred Morning Routine",
  // ...
  url: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_HERE",
  // ...
}
```

The seven cards to update, by id:

| Brief | content-library.ts id |
|---|---|
| V1 | `content-morning-routine` |
| V2 | `content-vedic-nutrition` |
| V3 | `content-breathing-meditation` |
| V4 | `content-movement` |
| V5 | `content-sandhya-meditation` |
| V6 | `content-manifestation` |
| V7 | `content-sleep-optimization` |

Also update `src/config/site.config.ts` line 41 to point `youtube:` at
your actual channel URL — that's the link the footer + share buttons use.

---

## Part 4 — Production order recommendation

If you have one weekend to start, batch in this order — easiest to film
to hardest:

1. **V6 Sankalpa (13 min)** — pure talking-head, almost no b-roll, lowest
   shot count. Get your camera + lighting + voice dialed in here.
2. **V7 Sleep (11 min)** — same talking-head setup, dim the lights, lower
   your voice. Reuse the V6 setup.
3. **V1 Morning Routine (12 min)** — needs the most b-roll but you've
   already lived this practice for years.
4. **V3 Pranayama (22 min)** — long but you can do the demo in your sleep.
5. **V4 Movement (15 min)** — needs you on a mat in athletic wear; change
   location.
6. **V5 Sandhya (16 min)** — requires sunrise or sunset shots; plan around
   weather.
7. **V2 Sattvic Eating (18 min)** — needs the most production (kitchen,
   ingredients, recipe demo). Save for last when you're confident.

A realistic pace: **2 videos per weekend → all 7 in ~4 weekends.**

---

## Part 5 — Future expansion (optional, after V1-V7)

When the seven shipped videos are live, the highest-leverage next
additions to the library would be:

1. **11 short pillar intros (60–90 sec each)** — one per pillar, plays
   as a hero video on each pillar detail page. Watch retention much
   higher than long-form for first-time visitors.
2. **Founder welcome (3 min)** — your "why I built this" video. Lives at
   the top of `/library` where the current banner sits empty.
3. **Daily wisdom shorts (48 of them, 1-2 min each)** — feed into the
   Wisdom page. One per day of the Mandala journey.
4. **Live session replays** — once a month, livestream a 30-min Q&A and
   archive it. Adds an "Events" tab to the library and a community feel.

These are not blocking. Ship V1-V7 first, then revisit this list.
