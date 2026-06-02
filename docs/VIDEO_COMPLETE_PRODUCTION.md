# Video Complete Production — Site-Wide Plan

> **THE definitive video production document for 10x.vedics.net.**
> Supersedes `MASTER_VIDEO_PLAN.md`, `CONTENT_GENERATION_PROMPTS.md`,
> and `VIDEO_PRODUCTION_BRIEFS.md`. Every video, every slot, every
> prompt — in one place.
>
> **All videos 16:9. Every prompt includes Cultural Specificity
> Addendum. Process rule: never let any AI tool auto-generate scripts —
> always paste from this doc.**

---

## Site audit summary (29 May 2026)

| Route group | Routes | Video slots identified |
|---|---|---|
| Public marketing | `/`, `/about`, `/blog`, `/contact`, `/dosha-test`, `/faq`, `/how-it-works`, `/pillars-overview`, `/privacy`, `/terms`, `/testimonials` | Brand hero, landing section videos, App Store demos |
| Auth | `/login`, `/signup`, `/onboarding` | 3 onboarding intro videos |
| Main app | `/dashboard`, `/pillars/*`, `/sessions`, `/library`, `/wisdom`, `/journal`, `/mood`, `/goals`, `/insights`, `/reports`, `/reminders`, `/achievements`, `/posters`, `/settings`, `/progress`, `/dosha-assessment`, `/admin` | Pillar hero loops, session celebrations, daily wisdom, library shorts (✅ done), long-form library videos, dashboard phase backgrounds |
| Assets already in place | `public/videos/pexels/` — 9 stock Pexels backdrops (breathing-ambient, candle-flame, home-hero, meditation-ambient, morning-ambient, movement-ambient, nature-flow, starry-night) | Session backgrounds — DONE, do not regenerate |
| Components already wired for video | `pexels-video.tsx`, `pillar-hero.tsx`, session timers, `home-client.tsx` | Drop-in points for new videos |

**Net new video opportunities identified:** 8 new categories beyond the
original master plan, plus reconfirmation of the 7 existing groups.

---

## Total inventory — 168 videos planned

| Tier | Group | Count | Status |
|---|---|---|---|
| 1 — Brand-defining | A. Library shorts | 11 | ✅ DONE |
| 1 — Brand-defining | E. Brand hero (4 clips → 1 video) | 4 | 🟡 1/4 done |
| 1 — Brand-defining | F. Onboarding intros | 3 | Pending |
| 2 — Pillars | D. Pillar hero atmospheric loops | 11 | Pending |
| 2 — Pillars | B. Long-form library videos (V1–V7) | 7 | Pending |
| 2 — Pillars | G. B-roll clips for V1–V7 | 14 | Pending |
| 3 — Engagement | C. Daily wisdom shorts | 48 | Pending |
| 3 — Engagement | **NEW** H. Session completion celebrations | 9 | Pending |
| 3 — Engagement | **NEW** N. Pillar practice demos | 11 | Pending |
| 4 — Marketing | **NEW** K. Landing section videos | 5 | Pending |
| 4 — Marketing | **NEW** L. App Store feature demos | 5 | Pending |
| 4 — Marketing | **NEW** M. Share / social shorts | 10 | Pending |
| 5 — Polish | **NEW** P. Dashboard phase backgrounds | 6 | Pending |
| 5 — Polish | **NEW** Q. Achievement / streak celebrations | 6 | Pending |
| 5 — Polish | **NEW** R. 404 + empty state ambient | 3 | Pending |
| 5 — Polish | **NEW** S. Email + push notification videos | 5 | Pending |
| | **Total** | **168 videos** | |

---

## 🛡️ Universal Cultural Specificity Addendum (paste at end of every prompt)

```
CULTURAL SPECIFICITY: All people must be South Asian Indian — brown
skin, dark hair, traditional Hindu dress (saffron robes, dhoti, kurta,
sari). All visual symbols Hindu/Vedic only — diya, lotus, Om symbol,
mandala, rudraksha mala beads, tilak mark, sandalwood paste, brass
kalash, Sanskrit script. NO Christian symbols, NO crosses, NO Jesus
imagery, NO Buddha statues, NO generic Western yoga aesthetic, NO
white/European people. Setting is India — Himalayan foothills, Hindu
mandir temple, Ganges riverbank, traditional Indian home or garden.
```

---

## Standard settings (apply to ALL videos)

| Setting | Value |
|---|---|
| Aspect ratio | **16:9** (no exceptions) |
| Resolution | 1080p minimum, 4K for hero pieces |
| Voice | Indian English male — **Aarav** / **Karan** (CapCut), **Sanjay** (Pictory) |
| Voice speed | 1.0x for shorts, 0.9x for long-form |
| Captions | Always on; bottom center; white text + black outline |
| Music | Aakash Gandhi "Dhanam" / "Drone in D" (YouTube Audio Library, free) |
| Music volume | –20dB under voice |
| Color grade | CapCut "Warm Film" or "Cinematic" LUT |
| Frame rate | 30fps |
| Format | MP4 |
| Audio in Veo b-roll | OFF — toggle "Return silent videos" ON |

---

# Table of Contents

- [Tier 1 — Brand-Defining](#tier-1)
  - [A. Library Shorts (DONE — for reference)](#a-shorts)
  - [E. Brand Hero (4 clips)](#e-hero)
  - [F. Onboarding (3 videos)](#f-onboarding)
- [Tier 2 — Pillars](#tier-2)
  - [D. Pillar Hero Loops (11)](#d-loops)
  - [B. Long-form V1–V7 Scripts (7)](#b-longform)
  - [G. B-roll for V1–V7 (14)](#g-broll)
- [Tier 3 — Engagement](#tier-3)
  - [C. Daily Wisdom Shorts (48)](#c-wisdom)
  - [H. Session Completion Celebrations (9) — NEW](#h-celebrations)
  - [N. Pillar Practice Demos (11) — NEW](#n-demos)
- [Tier 4 — Marketing](#tier-4)
  - [K. Landing Section Videos (5) — NEW](#k-landing)
  - [L. App Store Feature Demos (5) — NEW](#l-appstore)
  - [M. Share / Social Shorts (10) — NEW](#m-share)
- [Tier 5 — Polish](#tier-5)
  - [P. Dashboard Phase Backgrounds (6) — NEW](#p-phase)
  - [Q. Achievement / Streak Celebrations (6) — NEW](#q-achievements)
  - [R. 404 + Empty State Ambient (3) — NEW](#r-404)
  - [S. Email + Push Notification Videos (5) — NEW](#s-email)
- [Production Order + Timeline](#production-order)
- [Codebase Wiring Map](#wiring)

---

# Tier 1 — Brand-Defining <a id="tier-1"></a>

## A. Library Shorts (✅ shipped — for reference) <a id="a-shorts"></a>

All 11 shipped in commit `43d8df9`. URLs in `src/data/content-library.ts`.

| # | Topic | Pillar | YouTube |
|---|---|---|---|
| A1 | Brahma Muhurta | Morning Initiation | FvreaYh00Sg (v2) |
| A2 | Bhramari Breath | Breathing | HR0HwIixHDY |
| A3 | Sankalpa | Manifestation | P84Ib24a3Ng |
| A4 | Sattvic Eating | Nutrition | RRxkLdgDegM |
| A5 | Surya Namaskar | Movement | qFhxKp9XfVY |
| A6 | Kritajnata | Gratitude | NkpWu1H904Q |
| A7 | Sandhya Vandana | Sandhya | sJ5BzJawHr4 |
| A8 | Yoga Nidra | Sleep | jzbePUfDQ1o |
| A9 | Tat Tvam Asi | Brahman | 29OKHUGj7dw |
| A10 | Mahamrityunjaya | Healing | MtfAgxcgveM |
| A11 | Vrittis | Thoughts | T4qK3HKwc7g |

For prompts, see `docs/MASTER_VIDEO_PLAN.md` Part A.

---

## E. Brand Hero — 4 clips, 5 sec each, assembled into one 20-sec video <a id="e-hero"></a>

**Tool:** Veo 3.1 Fast · **Aspect:** 16:9 · **Duration:** 5 sec each · **Audio:** OFF (Return silent videos ON) · **Output:** x1 per clip · **Total credits:** ~80 across the 4 clips

**Use:** plays as hero loop at top of `/library`, also on landing page hero.

### E1 — Oil Lamp Awakening (✅ generated earlier — `Oil_lamp_burning_in_temple_*.mp4`)

```
A single brass diya (traditional Indian oil lamp) burns alone on the polished dark stone floor of an empty Hindu mandir temple at pre-dawn. The flame is steady, warm-golden. Camera slowly zooms out and tilts upward over 5 seconds, revealing carved stone Hindu temple pillars with intricate traditional Indian carvings, a small Om symbol etched into the back wall, a wisp of sandalwood incense smoke curling upward, and cool deep blue pre-dawn light entering from a distant doorway. Anamorphic 35mm lens, shallow depth of field. Warm tungsten glow against cool blue ambient. Slow contemplative pace. No people, no text. Ambient: temple silence, faint flame crackle, distant temple bell. 5 seconds. 16:9.

CULTURAL SPECIFICITY: All visual symbols Hindu/Vedic only — diya, Om symbol, mandala, traditional Indian temple carvings. NO Christian symbols, NO crosses, NO Buddhist statues, NO Western religious iconography. Hindu mandir setting only.
```

### E2 — Meditator at Sunrise (REGENERATE)

```
Wide cinematic shot of a young South Asian Indian man, brown skin, long dark hair tied back, seated in padmasana (lotus position) on a rocky outcrop in the Himalayan foothills at sunrise. He wears traditional saffron-colored dhoti and shawl. A rudraksha mala bead necklace visible on his bare chest. A small red tilak mark on his forehead. Full silhouette against an orange and pink sky. Mist rising from the valley below. Sun edge just visible above the distant horizon. Loose saffron fabric moves gently in a soft breeze. The figure is completely still, centered in deep meditation. Camera slowly pushes in over 5 seconds. Anamorphic 35mm lens, cinematic golden hour color palette. Face in profile silhouette only. Ambient nature: faint birds, soft wind, distant temple bell. 5 seconds. 16:9.

CULTURAL SPECIFICITY: The person must be South Asian Indian — brown skin, traditional Hindu dress (saffron dhoti, rudraksha mala beads, tilak mark). NO Western appearance, NO European features, NO Christian symbols, NO Buddha statues, NO modern athleisure yoga wear. Purely Hindu Vedic aesthetic. Himalayan setting only.
```

### E3 — Hands Planting Seed

```
Macro slow-motion shot of careful weathered South Asian Indian hands (brown skin, mehndi henna pattern faintly visible on the back of one hand) placing a single small seed into rich dark soil. Soft natural light from above. Hands then gently cover the seed with soil and pat it down. Very shallow depth of field, photographic quality. Symbolic of Sankalpa intention setting. No face visible. Background gently blurred showing terracotta pots and a small brass diya. Silence with subtle soil sounds. 5 seconds. 16:9.

CULTURAL SPECIFICITY: Hands must be visibly South Asian Indian — brown skin, faint mehndi henna pattern. Background props Hindu/Vedic only — terracotta pots, brass diya. NO Western hands, NO modern manicures, NO Christian symbols. Pure Indian aesthetic.
```

### E4 — Himalayan Mountains with Saffron Flag

```
Wide aerial shot of mist-covered Himalayan mountains at golden hour, with a single saffron-colored prayer flag fluttering in the foreground. Below the flag, a small Hindu mandir temple perched on a ridge, slightly out of focus. Pink and gold clouds drift slowly. Camera slowly pans right over 5 seconds. Distant snow-capped peaks visible. Cinematic, dreamlike, sacred atmosphere. Anamorphic 35mm lens, professional color grade — warm saffron foreground against cool deep blue distant peaks. No people. No text. Ambient: distant temple bell, soft mountain wind. 5 seconds. 16:9.

CULTURAL SPECIFICITY: Saffron flag must be Hindu prayer flag style (not Tibetan Buddhist flags, not Western flags). Temple must be Hindu mandir architecture with shikhara tower. NO Buddhist stupas, NO Tibetan prayer flags, NO Christian symbols. Hindu Himalayan setting only.
```

### Assembly instructions (in CapCut after all 4 generated)

1. Drop E1, E2, E3, E4 onto a single video track in order (5 sec each = 20 sec total)
2. Add **0.5-second cross-dissolve** between each clip (Effects → Transitions → Cross Dissolve)
3. Add background music: Aakash Gandhi "Drone in D," volume –12dB
4. Add a single text overlay at 18-20 sec: **"10X Vedic · Begin Your 48-Day Journey"** — Inter font, white text on a soft brass-gold gradient
5. Export 1080p, 16:9, MP4 → save as `public/videos/brand-hero.mp4`

---

## F. Onboarding Intro Videos — 3 videos, 30 sec each <a id="f-onboarding"></a>

**Tool:** CapCut Script-to-Video · **Aspect:** 16:9 · **Voice:** Indian English male warm, 1.0x · **Music:** soft Indian flute · **Captions:** ON

### F1 — Welcome (plays on first onboarding screen)

```
30-second welcome video for the 10X Vedic Transform onboarding screen. Hook: in 48 days, ancient Vedic practice can transform how you think, feel, and live. Explain: 11 pillars covering body, mind, and spirit — morning rituals, breathwork, nutrition, movement, meditation, sleep. Mention 1000+ transformations have started here. CTA: pick your focus and begin. Tone: warm, inviting, confident but not hyped. Indian English male voice. 16:9 horizontal with captions. Background: soft Indian flute music.

CULTURAL SPECIFICITY: All visuals show South Asian Indian people in traditional Hindu dress, Hindu/Vedic symbols (diya, lotus, Om, mandala), Indian settings (Hindu mandir, Himalayan foothills, traditional Indian home). NO Western imagery, NO Christian symbols, NO European faces.
```

### F2 — Your 48-Day Journey Map

```
30-second video explaining the 48-day Mandala journey structure. Six phases: Foundation, Cleansing, Integration, Expansion, Manifestation, Completion. Each phase is 8 days. Each day you log one pillar. The app guides you. Built on Ayurvedic Mandala tradition — 48 days is the precise window the Rishis used for sustained spiritual practice, long enough for neural pathways to thicken. CTA: tomorrow is day 1 — open the app at 5 AM. Tone: structured, clear, motivating. Indian English male voice. 16:9 horizontal with captions.

CULTURAL SPECIFICITY: Visuals show Vedic Mandala patterns, Hindu sacred geometry, Sanskrit calligraphy on parchment, traditional Indian astrology charts. NO Western timeline imagery, NO modern infographics styled in Western corporate fashion. Vedic visual language throughout.
```

### F3 — Set Your Sankalpa

```
30-second video introducing Sankalpa intention setting at the end of onboarding. Hook: the 48-day journey begins not with a goal but with a Sankalpa — a one-line intention in present tense, identity-based. Examples: "I am steady." "I am present." "I am whole." The mind cannot act on future tense, so we phrase it as if it is already true. Write yours now. CTA: type one Sankalpa sentence and tap continue. Tone: contemplative, intimate. Indian English male voice. 16:9 horizontal with captions.

CULTURAL SPECIFICITY: Visuals show a hand writing in Devanagari Sanskrit script in a leather-bound journal, brass pen, oil lamp burning beside it. Indian household setting — wooden writing desk, sandalwood incense. NO Western desk setup, NO modern stationery, NO laptop computer.
```

**Wire into:** `src/components/features/onboarding/` — `OnboardingQuiz` component step transitions.

---

# Tier 2 — Pillars <a id="tier-2"></a>

## D. Pillar Hero Atmospheric Loops — 11 videos, 10 sec each <a id="d-loops"></a>

**Tool:** Veo 3.1 Fast x1 OR Pippit Seedance 2.0 · **Aspect:** 16:9 · **Duration:** 10 sec (loopable) · **Audio:** OFF · **No people, no text** · **Use:** background hero in each pillar detail page (340px hero zone)

### D1 — Morning Initiation

```
Slow-motion cinematic shot of a horizon at the exact moment of sunrise over the Himalayan foothills. The sun's upper edge appears above misty mountain silhouettes. Warm gold and pink hues fill the sky. Distant Hindu temple spires visible on a ridge. Camera holds steady, no movement. Soft, dreamlike, loopable. Silent. 10 seconds. 16:9.

CULTURAL SPECIFICITY: Hindu mandir architecture in distant silhouette. NO Buddhist stupas, NO churches, NO Western architecture.
```

### D2 — Nutrition + Fasting

```
Macro shot of fresh Indian ingredients on a wooden surface — turmeric powder in a brass bowl, fresh ginger root, mung dal grains, ghee in a small brass jar, fresh cilantro leaves, a few cumin and mustard seeds. Soft golden window light. Camera holds steady. Slow gentle steam from the ghee. Photographic, warm, appetizing. Silent. 10 seconds. 16:9.

CULTURAL SPECIFICITY: All ingredients distinctly South Asian Indian cuisine. NO Western ingredients (no bread, cheese, butter). Brass and copper cookware only.
```

### D3 — Thoughts + Intention

```
Abstract cinematic shot of slowly moving sandalwood incense smoke and golden particles drifting through warm soft light against a dark background. The smoke and particles swirl gently, suggesting thoughts arising and dissolving. Slow contemplative pace. Hypnotic, meditative. Silent. 10 seconds. 16:9.

CULTURAL SPECIFICITY: Sandalwood incense smoke (warm amber tones), not Western tobacco smoke or vape. Background can include faint Sanskrit calligraphy ghosted in.
```

### D4 — Breathing + Meditation

```
Slow-motion close-up of a single pink lotus flower floating on still water in a sacred Indian pond at sunrise. The petals catch warm golden hour light. Camera slowly orbits the lotus. Soft reflections in the water around it. A few small brass diya lamps float in the background, slightly out of focus. Hypnotic, breathable. Silent. 10 seconds. 16:9.

CULTURAL SPECIFICITY: Sacred Indian pond / temple tank setting. Diyas visible as floating lights. NO water lily (different flower from lotus). Pink Hindu sacred lotus only.
```

### D5 — Movement

```
Wide silhouette shot of a single South Asian Indian person holding warrior 2 yoga pose (virabhadrasana) on a rocky outcrop in the Himalayan foothills at sunrise. The figure wears traditional saffron-colored dhoti and shawl. Camera holds steady, the figure unmoving. Wind gently moves the saffron fabric. Orange and pink sky behind. No face visible (silhouette only). Silent. 10 seconds. 16:9.

CULTURAL SPECIFICITY: Person must be South Asian Indian in traditional saffron yoga attire. NO Western athleisure (leggings, sports bra). NO European silhouette features. Hindu Himalayan setting.
```

### D6 — Healing Meditation

```
Macro shot of warm afternoon sunlight passing through a single hanging clear quartz crystal sphere suspended above a brass plate with sandalwood paste and a small diya. The crystal creates soft rainbow refractions across a soft background of a traditional Indian wooden temple wall. The crystal slowly rotates. Dreamlike, calming. Silent. 10 seconds. 16:9.

CULTURAL SPECIFICITY: Indian wooden temple wall background. Brass plate, sandalwood paste, diya are explicit Hindu ritual items. NO Western crystal healing aesthetic with chakra prints or new-age elements.
```

### D7 — Gratitude

```
Slow cinematic shot of weathered cupped South Asian Indian hands (brown skin, faint mehndi) held open in soft afternoon sunlight, palms facing upward in a gesture of receiving (anjali mudra opening). Golden light. Soft warm out-of-focus background of an Indian garden with marigolds and a brass diya. Camera holds steady. No face visible. Silent. 10 seconds. 16:9.

CULTURAL SPECIFICITY: Hands must be visibly South Asian Indian — brown skin, faint mehndi pattern. Marigolds (Hindu sacred flower) in background. NO Western flowers, NO Christian prayer hand gestures.
```

### D8 — Sandhya Meditation

```
Slow cinematic shot of the moment of sunset over a calm Ganges-like river. Orange and purple reflections shimmer on the water. A small brass diya floats gently on the surface, lit. In the deep background, a Hindu mandir temple silhouette with shikhara tower. Camera holds steady. The flame flickers. Silent. 10 seconds. 16:9.

CULTURAL SPECIFICITY: Indian river setting (Ganges/Yamuna/Narmada style). Hindu mandir with shikhara only. Floating diyas (deep-dana ritual). NO Western river settings, NO Buddhist or Christian architecture.
```

### D9 — Brahman Connection

```
Wide cosmic shot of the night sky over the Himalayan mountains filled with stars and the soft band of the Milky Way. In the foreground, a small Hindu mandir spire silhouetted against the stars. Slow camera tilt upward revealing more depth of the cosmos. Dreamlike scale, infinite, contemplative. Silent. 10 seconds. 16:9.

CULTURAL SPECIFICITY: Hindu mandir architecture in silhouette. Himalayan setting. NO Western observatory aesthetic, NO Buddhist or other religious structures.
```

### D10 — Divine Manifestation

```
Macro time-lapse of a single small green tulsi (holy basil) plant growing upward from rich soil in a brass pot, slowly unfurling new leaves toward warm sunlight. Soft natural light. A small brass diya glows faintly in the background. Time-lapse smooth, not stuttery. Silent. 10 seconds. 16:9.

CULTURAL SPECIFICITY: Tulsi (Hindu sacred plant) grown in traditional brass pot (tulsi kund). Diya in background. NO Western herbs or pots. Tulsi specifically — recognizable as Ocimum sanctum with serrated leaves.
```

### D11 — Sleep Optimization

```
Wide cinematic shot of a single bedroom window in a traditional Indian home at night, with sheer white curtains gently moving in a soft breeze. Moonlight casts cool blue light onto a wooden floor with a small brass diya glowing faintly. Deep silence and stillness. Camera holds steady, no movement. Calming, sleepy. Silent. 10 seconds. 16:9.

CULTURAL SPECIFICITY: Traditional Indian home interior — wooden floor, carved window frame, brass diya. NO Western bedroom aesthetic, NO modern minimalist design.
```

**Wire into:** `public/videos/pillar-hero-<slug>.mp4` → already referenced by `src/components/features/pillars/pillar-hero.tsx` (drop in the files, the component picks them up).

---

## B. Long-form Library Videos V1–V7 (7 videos, 11–22 min) <a id="b-longform"></a>

Full scripts already in `docs/MASTER_VIDEO_PLAN.md` Part B. Each script
unchanged — just append the Cultural Specificity Addendum when pasting
into CapCut Script-to-Video or Pictory.

| ID | Title | Length | Pillar |
|---|---|---|---|
| V1 | Designing Your Sacred Morning Routine | 12 min | Morning |
| V2 | Introduction to Sattvic Eating | 18 min | Nutrition |
| V3 | Pranayama Fundamentals | 22 min | Breathing |
| V4 | Vedic Movement | 15 min | Movement |
| V5 | Sandhya Vandana | 16 min | Sandhya |
| V6 | Sankalpa: Vedic Manifestation | 13 min | Manifestation |
| V7 | Vedic Sleep Rituals | 11 min | Sleep |

**Append to every V1-V7 generation in CapCut/Pictory:**

```
CULTURAL SPECIFICITY: All visuals show South Asian Indian people in traditional Hindu dress, Hindu/Vedic symbols (diya, lotus, Om, mandala, rudraksha, tilak, sandalwood), Indian settings (Hindu mandir, Himalayan foothills, traditional Indian home/garden, Ganges riverbank). NO Western imagery, NO Christian symbols, NO European faces, NO modern Western yoga aesthetic.
```

---

## G. B-roll for V1–V7 — 14 clips, 8 sec each <a id="g-broll"></a>

All 14 prompts in `docs/MASTER_VIDEO_PLAN.md` Part G. Same prompts apply
— append the Cultural Specificity Addendum. Settings: Veo 3.1 Fast x1,
16:9, audio OFF, ~20 credits each, ~280 credits total across 4 accounts.

**Quick reference — clip → video mapping:**

| Clip | Use in | Description |
|---|---|---|
| G1 | V1 | Oil lamp in dark temple |
| G2 | V1 | Copper vessel water pour |
| G3 | V2 | Ghee melting with cumin |
| G4 | V2 | Steaming bowl of kichari |
| G5 | V3 | Lotus blooming at sunrise |
| G6 | V3 | Breath visible in cold air |
| G7 | V4 | Surya Namaskar silhouette |
| G8 | V4 | Slow walking feet on grass |
| G9 | V5 | Sage facing east at sunrise |
| G10 | V5 | Noon sun through banyan tree |
| G11 | V6 | Hands planting seed |
| G12 | V6 | Sprout time-lapse |
| G13 | V7 | Candle beside Ayurvedic text |
| G14 | V7 | Moonlight through window |

---

# Tier 3 — Engagement <a id="tier-3"></a>

## C. 48 Daily Wisdom Shorts <a id="c-wisdom"></a>

All 48 prompts in `docs/MASTER_VIDEO_PLAN.md` Part C, each with a
distinct Vedic source. Append Cultural Specificity Addendum to every
one. **Aspect: 16:9** (master plan was updated from 9:16).

**Wire into:** `src/data/daily-wisdom.ts` — add `videoUrl` field per day,
pointing to YouTube short URL.

---

## H. Session Completion Celebrations (9) — NEW <a id="h-celebrations"></a>

**Tool:** Veo 3.1 Fast x1 · **Aspect:** 16:9 · **Duration:** 4 sec each · **Audio:** OFF · **Use:** plays for ~3 sec after each session completes (top of completion screen, behind "Namaste · Session Complete" text)

### H1 — Morning Routine Complete

```
Brief cinematic shot of a brass diya being lit by an unseen hand, the flame leaping up and steadying with a warm golden glow. Background: faint Sanskrit script visible on a wooden surface, traditional Indian morning light. 4 seconds. 16:9. Silent.
```

### H2 — Fasting Session Complete

```
Brief cinematic shot of a small clear glass of warm water with a slice of lemon, sitting on a wooden surface in soft morning light. Steam rises gently. A wooden spoon of honey beside it. Photographic, satisfying, restful. 4 seconds. 16:9. Silent.
```

### H3 — Breathing Session Complete

```
Brief cinematic shot of a pink lotus flower fully open in still water, the petals slowly settling after a final ripple passes through. Warm golden light. Cinematic, peaceful, complete. 4 seconds. 16:9. Silent.
```

### H4 — Movement Session Complete

```
Brief cinematic shot of a South Asian Indian person in saffron dhoti seated in sukhasana (easy pose) on a brown yoga mat, eyes closed, hands resting in anjali mudra at heart. Soft golden afternoon light. Camera holds steady. The figure is breathing softly. 4 seconds. 16:9. Silent.

CULTURAL SPECIFICITY: Indian person in traditional saffron attire. NO Western yoga wear.
```

### H5 — Meditation Session Complete

```
Brief cinematic shot of a single sandalwood incense stick burning, the smoke rising in a perfect spiral upward, lit warmly from below. Dark blurred background. Cinematic, peaceful, complete. 4 seconds. 16:9. Silent.
```

### H6 — Sandhya Session Complete

```
Brief cinematic shot of the last sliver of sun disappearing below the horizon over a calm river, with a small brass diya floating in the foreground water, fully lit. Pink and purple sky. Cinematic, sacred, complete. 4 seconds. 16:9. Silent.
```

### H7 — Brahman Session Complete

```
Brief cinematic shot of the cosmos with thousands of stars, slow zoom outward revealing a galaxy spiral. Awe-inspiring, infinite. 4 seconds. 16:9. Silent.
```

### H8 — Manifestation Session Complete

```
Brief cinematic shot of a small green tulsi sprout in a brass pot, just visible above the soil, bathed in golden morning light. A drop of water falls on it from above in slow motion. Hopeful, beginning. 4 seconds. 16:9. Silent.
```

### H9 — Sleep Session Complete

```
Brief cinematic shot of a single white candle being gently blown out, the smoke curling upward in slow motion. Dark blue moonlit background. A soft brass kalash beside it. Peaceful, restful, closing. 4 seconds. 16:9. Silent.

CULTURAL SPECIFICITY: Brass kalash visible — traditional Hindu sacred vessel.
```

**Wire into:** session components in `src/components/features/sessions/*.tsx` — at the completion screen, layer the matching `H*` video behind the "Session Complete" text.

---

## N. Pillar Practice Demos (11) — NEW <a id="n-demos"></a>

**Tool:** Mix — Veo for atmospheric, CapCut Script-to-Video for narrated demos · **Aspect:** 16:9 · **Duration:** 90 seconds each · **Use:** plays inline on each pillar detail page in a "How to practice" section (new component to add)

Each demo shows the actual physical practice for the pillar so users
have a reference video to follow along with.

### N1 — Morning Initiation: Brahma Muhurta Wake-up Sequence

```
90-second demonstration video of the Brahma Muhurta morning wake-up sequence. South Asian Indian person, brown skin, traditional kurta, demonstrates each step in real time: (1) wake without checking phone, (2) tongue scraping with a copper tongue scraper, (3) drinking warm water from a copper kalash, (4) three rounds of Surya Namaskar. Voice-over narration explaining each step in calm Indian English. Indian household setting — wooden floor, brass diya in background, sunrise visible through window. 16:9 horizontal with captions.

CULTURAL SPECIFICITY: South Asian Indian person, traditional Hindu dress, Indian household. Copper kalash and tongue scraper, brass diya. NO Western bathroom or kitchen aesthetic.
```

### N2 — Nutrition: How to Make Sattvic Kichari (90 sec speed-cook)

```
90-second speed-cook demonstration of Sattvic kichari preparation. South Asian Indian hands (brown skin, faint mehndi) at a wooden kitchen counter. Steps in real time: heat ghee in brass tadka pan, add cumin seeds (sizzle), add turmeric and ginger, add soaked basmati rice and mung dal, pour water, simmer, garnish with cilantro and lime. Voice-over narration. Warm kitchen light. 16:9 horizontal with captions.

CULTURAL SPECIFICITY: Brass tadka pan, copper utensils, Indian kitchen setting. NO Western cookware, NO Western kitchen aesthetic.
```

### N3 — Thoughts: The 4-Step Thought Reset (demo)

```
90-second guided demonstration of the four-step thought reset. South Asian Indian person seated in sukhasana in a traditional Indian home, eyes softly closed. Voice-over walks through: (1) notice the thought, (2) name it in 3 words, (3) release on the exhale, (4) replace with a Sankalpa. Camera holds in close-up of face (calm, eyes closed). Captions show the 4 steps appearing in sequence. 16:9 horizontal.

CULTURAL SPECIFICITY: Indian person, traditional Indian home setting with brass diya and Sanskrit text visible in background.
```

### N4 — Breathing: Nadi Shodhana Step-by-Step

```
90-second step-by-step demonstration of Nadi Shodhana (alternate nostril breathing). South Asian Indian person seated in padmasana, brown skin, kurta. Camera close on the face and hand in Vishnu Mudra. Voice-over guides the practice with counts: inhale left 1-2-3-4, hold 1-2-3-4, exhale right 1-2-3-4. Five full rounds shown. 16:9 horizontal with captions.

CULTURAL SPECIFICITY: Indian person, traditional kurta, Hindu home setting. NO Western yoga studio.
```

### N5 — Movement: Surya Namaskar Full 12-Pose Flow

```
90-second demonstration of one complete round of Surya Namaskar. South Asian Indian person, brown skin, saffron dhoti, on a brown yoga mat outdoors at sunrise facing east. Each of the 12 poses named in Sanskrit + English as voice-over. Background: garden or rooftop in India, Himalayan foothills visible in distance. 16:9 horizontal with captions.

CULTURAL SPECIFICITY: Indian person, saffron dhoti, Indian outdoor setting, eastward orientation. NO Western yoga clothing or studio.
```

### N6 — Healing: Mahamrityunjaya Mantra Chanting (proper pronunciation)

```
90-second demonstration of proper Mahamrityunjaya mantra chanting. South Asian Indian person seated in padmasana in front of a small brass diya and a sandalwood-paste-marked stone Shiva lingam. Brown skin, traditional kurta, rudraksha mala. Slow careful pronunciation of "Om Tryambakam Yajamahe Sugandhim Pushtivardhanam Urvarukamiva Bandhanan Mrityormukshiya Maamritat." Sanskrit text shown on screen alongside English translation. Repeated 11 times. 16:9 horizontal.

CULTURAL SPECIFICITY: Hindu altar with Shiva lingam, brass diya, sandalwood paste, rudraksha. NO Buddhist or other religious symbols.
```

### N7 — Gratitude: Three-Person Gratitude Practice

```
90-second guided demonstration of the three-person gratitude practice. South Asian Indian person seated in front of a small wooden writing desk with leather-bound journal and brass pen, oil lamp burning. Voice-over guides: bring to mind one person, name one specific thing they did, hold the feeling for 10 seconds. Repeat for a moment in your day, and one thing about yourself. 16:9 horizontal with captions.

CULTURAL SPECIFICITY: Indian person, traditional writing setup with brass pen and oil lamp. NO Western journaling aesthetic.
```

### N8 — Sandhya: Simplified 2-Minute Sandhya Vandana

```
90-second demonstration of the simplified Sandhya Vandana practice. South Asian Indian person, brown skin, saffron shawl, standing facing east on a riverbank or rooftop at sunset. Voice-over guides: take three slow breaths, chant Gayatri mantra three times (audio includes the chanting), sit for thirty seconds in silence. Camera shows the practice from multiple angles. Distant temple bell. 16:9 horizontal with captions.

CULTURAL SPECIFICITY: Indian person, saffron shawl, Indian riverside or rooftop setting. Eastward orientation. NO Western religious gestures.
```

### N9 — Brahman: 5-Minute Witnessing Meditation (guided)

```
90-second guided witnessing meditation. South Asian Indian person seated in padmasana, kurta, rudraksha mala. Voice-over guides: close the eyes, notice you are aware, ask "who is the one watching", rest in the witness. Camera holds steady on the meditator. Slow ambient breath. Soft warm light. Captions display key phrases. 16:9 horizontal.

CULTURAL SPECIFICITY: Indian person, traditional kurta, simple Hindu home setting with brass diya. NO Western meditation aesthetic.
```

### N10 — Manifestation: Writing Your Sankalpa (demo)

```
90-second demonstration of writing a Sankalpa. South Asian Indian person at a wooden writing desk, brass pen in hand, leather journal open. Voice-over explains: write your Sankalpa in present tense, affirmative, identity-based. Camera close on the hand writing "I am steady" in English (or Devanagari Sanskrit if you prefer). Brass diya burning beside the journal. 16:9 horizontal with captions.

CULTURAL SPECIFICITY: Brass pen, leather journal, Indian writing desk, brass diya. NO Western office or stationery aesthetic.
```

### N11 — Sleep: Padabhyanga (Foot Massage) for Sleep

```
90-second demonstration of Padabhyanga, the Ayurvedic foot massage for sleep. South Asian Indian person seated on edge of bed, brown skin, simple kurta. A small brass bowl of warm sesame oil beside them. Voice-over guides them through massaging soles, toes, and ankles. Two-minute timer shown on screen. Soft evening lamplight. Indian bedroom setting. 16:9 horizontal with captions.

CULTURAL SPECIFICITY: Indian person, brass bowl of sesame oil, traditional Indian bedroom with wooden bed frame, brass diya. NO Western bedroom or spa aesthetic.
```

**Wire into:** add new "How to Practice" section component in
`src/components/features/pillars/pillar-content-panel.tsx` that surfaces
the matching `N*` video per pillar slug.

---

# Tier 4 — Marketing <a id="tier-4"></a>

## K. Landing Section Videos (5) — NEW <a id="k-landing"></a>

**Tool:** Veo 3.1 Fast OR CapCut Script-to-Video for narrated · **Aspect:** 16:9 · **Use:** placed within landing page sections

### K1 — Hero Section Background (15 sec loop)

```
15-second cinematic landing hero loop. Slow montage of three scenes: (1) brass diya glowing in dark Hindu temple, (2) South Asian Indian meditator at sunrise in Himalayan foothills, (3) hands holding a sapling growing toward light. Each scene 5 seconds with seamless cross-fade. Warm saffron-gold color palette. No text, no people's faces visible. 16:9. Silent or with soft Indian ambient drone.

CULTURAL SPECIFICITY: All scenes Hindu Vedic — Indian person, brass diya, Himalayan setting, Hindu temple. NO Western imagery.
```

### K2 — "11 Pillars" Section Intro (60 sec)

```
60-second narrated overview of the 11 Vedic pillars. South Asian Indian narrator voice (off-screen). Visuals: each pillar represented by one symbolic image (sunrise = morning, kichari = nutrition, lotus = breathing, etc.) with the Sanskrit name appearing as text overlay. End with: "11 pillars. 48 days. One transformation." 16:9 with captions. Soft Indian flute music.

CULTURAL SPECIFICITY: Every pillar visual must be Hindu/Vedic — diya, lotus, brass utensils, saffron robes, Sanskrit text. NO Western fitness/wellness imagery.
```

### K3 — "How It Works" Section (45 sec)

```
45-second explainer of the 48-day app journey. Voice-over walks through: (1) take the dosha quiz, (2) pick your focus pillars, (3) daily practice with audio guidance, (4) track your progress with the Mandala ring, (5) celebrate completion on day 48. Visuals: animated app screenshots interspersed with brief shots of South Asian Indian people doing the practices. 16:9 with captions.

CULTURAL SPECIFICITY: All people shown are South Asian Indian in traditional dress doing Hindu practices. NO Western users of the app shown.
```

### K4 — Testimonial Section Header (30 sec)

```
30-second montage of Vedic transformation imagery: a brass diya flame strengthening from small to bright, a tulsi sprout growing into a small plant, a sunrise over Himalayan peaks. Voice-over: "1000+ people have completed their 48-day Vedic transformation. Here are their stories." 16:9 with captions.

CULTURAL SPECIFICITY: All imagery Hindu Vedic — diya, tulsi, Himalayas. NO Western transformation visuals (no before/after gym shots).
```

### K5 — Closing CTA Section (20 sec)

```
20-second closing CTA. Slow cinematic shot of a single oil lamp being lit in a dark Hindu temple, the flame brightening to fill the frame. Voice-over: "Your 48-day Vedic journey begins with a single flame. Begin yours today." Text appears: "Start Your Journey · 10x.vedics.net". 16:9 with captions.

CULTURAL SPECIFICITY: Hindu temple setting, brass diya. NO Western religious or generic spiritual imagery.
```

**Wire into:** landing page route — `src/app/page.tsx` and home-client.

---

## L. App Store Feature Demos (5) — NEW <a id="l-appstore"></a>

**Tool:** CapCut + screen recording of the actual app (mix of demo and recorded gameplay) · **Aspect:** 16:9 for web App Store / Google Play web pages · **Duration:** 30 sec each

### L1 — Dashboard Tour
```
30-second screen recording demo of the 10X Vedic dashboard. Shows: phase-tinted welcome banner with Mandala ring progress, Today's Practice card, Streak + Karma stat cards, 11-pillar grid. Voice-over narrates each section. South Asian Indian male voice. 16:9 with captions.
```

### L2 — 11-Pillar Walkthrough
```
30-second feature demo of the Pillars page. Shows: 3-tier layout (Active Today / Recommended / Quietly Present), card hover effects, deep-link into a pillar detail page. Voice-over highlights "morning, nutrition, breathing, movement, and more." 16:9 with captions.
```

### L3 — Sessions Tab Demo
```
30-second feature demo of the Sessions page. Shows: tab switching between Morning Routine, Fasting, Breathing (lotus animation), Movement (yoga GIFs), Meditation (posture SVG). Voice-over: "Guided practices for every Vedic pillar — with timers, voice cues, and animations." 16:9 with captions.
```

### L4 — Progress & Reports Demo
```
30-second demo of the Progress page. Shows: Consistency Score with delta, Weekly Trend chart, 48-Day Heatmap, Pillar Consistency bars. Voice-over: "Track your transformation with daily metrics, weekly trends, and your full 48-day Mandala." 16:9 with captions.
```

### L5 — Library + Wisdom Demo
```
30-second demo of the Library and Wisdom pages. Shows: scrolling through library cards (videos, articles, audio mantras), playing a mantra in-app, daily wisdom card. Voice-over: "Audio mantras, in-app articles, daily Vedic wisdom — your spiritual library, always with you." 16:9 with captions.
```

**Use:** App Store + Google Play Store screenshots (export as MP4 then
also as static frames for the store listing).

---

## M. Share / Social Shorts (10) — NEW <a id="m-share"></a>

**Tool:** CapCut auto-clip of existing long-form content · **Aspect:** 16:9 (and 9:16 export for social platforms) · **Duration:** 30 sec each

These are auto-clipped highlights from the V1–V7 long-form videos for
social distribution. CapCut has an "AI highlight" feature that picks
the best 30 sec from a longer video.

| ID | Source | Highlight topic |
|---|---|---|
| M1 | V1 | "What is Brahma Muhurta?" hook |
| M2 | V2 | "The 3 gunas of food in 30 seconds" |
| M3 | V3 | "Bhramari demo with cortisol explanation" |
| M4 | V4 | "Surya Namaskar in 30 seconds" |
| M5 | V5 | "Gayatri pronunciation tutorial" |
| M6 | V6 | "Why most manifestation is wrong" |
| M7 | V7 | "The Vedic foot massage that knocks you out" |
| M8 | Mixed | "5 Sanskrit words that will change your life" |
| M9 | Mixed | "Modern science meets Vedic wisdom — 3 examples" |
| M10 | Mixed | "Your 48-day Mandala journey explained" |

No new prompts — these are produced AFTER V1–V7 ship by clipping them.

---

# Tier 5 — Polish <a id="tier-5"></a>

## P. Dashboard Phase Backgrounds (6) — NEW <a id="p-phase"></a>

**Tool:** Veo 3.1 Fast x1 · **Aspect:** 16:9 · **Duration:** 8 sec (loopable) · **Audio:** OFF · **Use:** background of the dashboard welcome banner, swaps based on current journey phase (currently uses gradient only)

### P1 — Foundation Phase (Days 1-8)
```
8-second loopable cinematic shot of a single seed being planted in fertile dark Indian soil by South Asian Indian hands, then the camera slowly orbits as the seed sits buried. Warm golden morning light. Symbolic of foundation. Silent. 16:9.

CULTURAL SPECIFICITY: Indian hands (brown skin), Indian soil setting, brass pot or terracotta. NO Western gardening aesthetic.
```

### P2 — Cleansing Phase (Days 9-16)
```
8-second loopable cinematic shot of clear water gently flowing over rounded river stones in a sacred Indian river (Ganges or Yamuna). Sunlight catches the ripples. Symbolic of cleansing. Silent. 16:9.

CULTURAL SPECIFICITY: Indian river setting, Hindu temple ghat steps visible in distant background.
```

### P3 — Integration Phase (Days 17-24)
```
8-second loopable cinematic shot of a young Indian sapling tulsi plant in a brass pot, leaves moving very gently in a soft breeze. Soft golden afternoon light. Symbolic of integration and growth. Silent. 16:9.

CULTURAL SPECIFICITY: Tulsi plant in traditional brass pot (tulsi kund). Indian home or garden setting.
```

### P4 — Expansion Phase (Days 25-32)
```
8-second loopable cinematic shot of a lotus flower fully blooming, slow camera push-in. Sacred Indian pond setting. Warm golden hour light. Symbolic of expansion. Silent. 16:9.

CULTURAL SPECIFICITY: Pink Hindu sacred lotus in Indian temple tank. NO water lily.
```

### P5 — Manifestation Phase (Days 33-40)
```
8-second loopable cinematic shot of a brass diya being lit and the flame growing tall and steady, golden glow filling the frame. Indian temple background. Symbolic of manifestation. Silent. 16:9.

CULTURAL SPECIFICITY: Brass diya, Hindu temple setting.
```

### P6 — Completion Phase (Days 41-48)
```
8-second loopable cinematic shot of a wide sunrise over the Himalayan peaks with a single Hindu mandir spire silhouetted in the foreground. Symbolic of completion and arrival. Silent. 16:9.

CULTURAL SPECIFICITY: Hindu mandir architecture, Himalayan setting.
```

**Wire into:** `src/components/features/dashboard/welcome-banner.tsx` (or
similar) — layer the `P*` video at low opacity (15-20%) behind the
existing gradient, swap based on `currentPhase`.

---

## Q. Achievement / Streak Celebrations (6) — NEW <a id="q-achievements"></a>

**Tool:** Veo 3.1 Fast x1 · **Aspect:** 16:9 · **Duration:** 3 sec · **Audio:** OFF · **Use:** popup celebration when user hits a milestone

### Q1 — First Day Complete
```
3-second celebration: a single brass diya is lit, the flame leaping up. Warm golden glow expands outward. Silent. 16:9.
```

### Q2 — 7-Day Streak
```
3-second celebration: seven brass diyas in a row are lit in sequence from left to right, each flame leaping up. Warm golden glow fills frame. Silent. 16:9.
```

### Q3 — 21-Day Streak
```
3-second celebration: a circle of brass diyas being lit in sequence around a Hindu Sanskrit Om symbol in the center. Warm golden glow. Silent. 16:9.
```

### Q4 — 48-Day Journey Complete
```
3-second celebration: a complete Mandala pattern in saffron and gold lights up segment by segment, completing the full circle. A small Om symbol appears at the center. Silent. 16:9.

CULTURAL SPECIFICITY: Vedic mandala pattern, Om symbol, saffron and gold colors.
```

### Q5 — Karma Milestone (1000+)
```
3-second celebration: a brass kalash overflows with golden coins and marigold petals, slow motion. Indian temple setting in background. Silent. 16:9.

CULTURAL SPECIFICITY: Brass kalash, marigolds (Hindu sacred flowers), Indian temple.
```

### Q6 — Shield Earned
```
3-second celebration: a circular brass shield embossed with a sacred mandala glows with warm golden light, rotating slowly. Soft Indian temple background. Silent. 16:9.

CULTURAL SPECIFICITY: Brass shield with Hindu mandala pattern. NO Western shield designs.
```

**Wire into:** `src/components/features/dashboard/streak-event-banner.tsx`
and `karma-points.tsx` celebration modals.

---

## R. 404 + Empty State Ambient (3) — NEW <a id="r-404"></a>

**Tool:** Veo 3.1 Fast x1 · **Aspect:** 16:9 · **Duration:** 10 sec loop · **Audio:** OFF

### R1 — 404 Not Found
```
10-second ambient loop: a wandering brass diya floats slowly through a misty Indian forest at dawn. Soft mystical atmosphere. Silent. 16:9.

CULTURAL SPECIFICITY: Brass diya, Indian forest setting (banyan trees, tropical), gentle mist.
```

### R2 — Empty Journal State
```
10-second ambient loop: an empty leather-bound journal sits open on a wooden desk next to a brass pen, oil lamp burning beside. Soft afternoon light. Pages flutter very gently. Silent. 16:9.

CULTURAL SPECIFICITY: Brass pen, leather journal, oil lamp, Indian writing desk.
```

### R3 — Empty Library State
```
10-second ambient loop: a wooden lectern with an open Ayurvedic Sanskrit manuscript, soft afternoon light, a single small brass diya burning beside. Silent. 16:9.

CULTURAL SPECIFICITY: Sanskrit manuscript, brass diya, Indian temple library aesthetic.
```

**Wire into:** `src/app/not-found.tsx`, journal/library empty states.

---

## S. Email + Push Notification Videos (5) — NEW <a id="s-email"></a>

**Tool:** CapCut animated GIFs or short MP4s · **Aspect:** 16:9 · **Duration:** 5-10 sec · **Use:** embedded in welcome emails, daily push notifications, reminder emails

### S1 — Welcome Email Header
```
8-second video for welcome email header. Shows: brass diya being lit in a Hindu temple, then text "Welcome to 10X Vedic" appearing in saffron-gold gradient. 16:9. Silent (emails usually muted).

CULTURAL SPECIFICITY: Hindu temple, brass diya, Sanskrit-style text.
```

### S2 — Daily Streak Reminder
```
5-second push video: a brass diya flame flickers, then strengthens to full bright. "Your streak is waiting." Silent. 16:9.
```

### S3 — Weekly Phase Transition Email
```
10-second video for phase transition email. Shows: current phase symbol fading out, new phase symbol fading in (e.g., seed → sprout, sprout → small plant, etc.). "You've entered Phase X." Silent. 16:9.
```

### S4 — At-Risk Streak Warning
```
5-second push video: a brass diya flame flickers worryingly, smoke wisps. "Your streak is at risk." Silent. 16:9.
```

### S5 — Journey Complete Celebration Email
```
10-second video for day-48 celebration email. Full Mandala pattern lights up segment by segment, Om symbol appears at center. "You completed your 48-day Vedic transformation." Soft Indian flute music. 16:9.
```

**Wire into:** transactional email templates + push notification asset
URLs.

---

# Production Order + Timeline <a id="production-order"></a>

Realistic order based on user-visible impact + dependencies:

| Week | Group | Count | Why this week |
|---|---|---|---|
| Week 1 (current) | E. Brand hero (4 clips) | 4 | High visibility on landing + library; quick to ship |
| Week 1 | F. Onboarding intros | 3 | First impression for new signups |
| Week 2 | D. Pillar hero loops | 11 | Transforms every pillar detail page |
| Week 2 | P. Dashboard phase backgrounds | 6 | Easy Veo gen, big dashboard upgrade |
| Week 3 | H. Session completion celebrations | 9 | Polish for the practice flow |
| Week 3 | Q. Achievement celebrations | 6 | Polish for the milestone flow |
| Week 4-5 | B. Long-form V1-V7 (record) | 7 | Biggest production effort, do after the polish wins |
| Week 4-5 | G. B-roll for V1-V7 | 14 | Generate in parallel with recording |
| Week 6 | N. Pillar practice demos | 11 | Adds inline "how to" video to every pillar |
| Week 7-9 | C. Daily wisdom shorts | 48 | Long batch, 5-7 per day |
| Week 10 | M. Social shorts (auto-clip from V1-V7) | 10 | Distribution multiplier |
| Week 11 | K. Landing section videos | 5 | Marketing polish |
| Week 11 | L. App Store demos | 5 | Marketing polish |
| Week 12 | R. 404 + empty states | 3 | Final polish |
| Week 12 | S. Email/push videos | 5 | Final polish |

**Total realistic timeline: ~12 weeks** to ship all 168 videos.

**Pacing per account per day (Google Flow free tier):**
- 50 credits / 20 per Veo 3.1 Fast clip = **2-3 clips/account/day**
- 4 accounts = **8-12 Veo clips/day** capacity
- CapCut Script-to-Video: unlimited (you can batch all script-based videos faster)

---

# Codebase Wiring Map <a id="wiring"></a>

When each video group ships, here's where the asset or URL goes:

| Group | Path / file |
|---|---|
| A. Library shorts | ✅ `src/data/content-library.ts` (already wired) |
| B. V1-V7 long-form | `src/data/content-library.ts` — update existing 11 entries' `url` field with YouTube URL |
| C. Daily wisdom | `src/data/daily-wisdom.ts` — add `videoUrl` field per day |
| D. Pillar hero loops | `public/videos/pillar-hero-<slug>.mp4` → `src/components/features/pillars/pillar-hero.tsx` |
| E. Brand hero | `public/videos/brand-hero.mp4` → library top banner + `home-client.tsx` |
| F. Onboarding | `public/videos/onboarding-{welcome,journey,sankalpa}.mp4` → `src/components/features/onboarding/` |
| G. B-roll for V1-V7 | Drop into CapCut timeline of V1-V7 videos before YouTube upload — never reaches the codebase |
| H. Session celebrations | `public/videos/session-complete-<key>.mp4` → session timer completion screens in `src/components/features/sessions/*.tsx` |
| K. Landing section | `public/videos/landing-<n>.mp4` → `src/app/home-client.tsx` |
| L. App Store demos | Export as MP4 → upload to App Store Connect / Google Play Console |
| M. Social shorts | YouTube Shorts + Instagram Reels + TikTok — no codebase wiring |
| N. Pillar practice demos | YouTube URLs in `src/constants/pillars.ts` as new `practiceDemoUrl` field → render in `pillar-content-panel.tsx` |
| P. Dashboard phase bgs | `public/videos/phase-bg-<phase>.mp4` → dashboard welcome banner |
| Q. Achievement celebrations | `public/videos/achievement-<type>.mp4` → streak/karma celebration modals |
| R. 404 + empty states | `public/videos/empty-{404,journal,library}.mp4` → `src/app/not-found.tsx` and respective empty states |
| S. Email/push videos | Upload to your transactional email asset CDN |

---

# Process Discipline (the rule that prevents bad videos)

1. **Open this doc** to pick the prompt you'll use today
2. **Copy the EXACT prompt** (don't summarize, don't paraphrase)
3. **Append the Cultural Specificity Addendum** (if not already in the prompt)
4. **Paste into the tool** (Veo / Pippit / CapCut / Pictory / InVideo)
5. **If the tool offers "AI improve" or "auto-write script"** → refuse. That's how you get "the camera zooms out, observe the brass diya stand."
6. **Generate, download, paste YouTube URL or upload path here in chat** — I'll wire it into the codebase

---

## File supersession

| Doc | Status |
|---|---|
| `docs/VIDEO_COMPLETE_PRODUCTION.md` (this file) | ⭐ **Canonical** |
| `docs/MASTER_VIDEO_PLAN.md` | Superseded — keep for V1-V7 full scripts and 48 wisdom prompts; this doc references them |
| `docs/CONTENT_GENERATION_PROMPTS.md` | Superseded — kept for archive only |
| `docs/VIDEO_PRODUCTION_BRIEFS.md` | Superseded — kept for camera/lighting setup notes |

When in doubt, this file wins.
