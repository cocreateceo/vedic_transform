# Vedics Design System

> *Ancient wisdom · Modern living*

A design system derived from **the actual production codebase** of
[`cocreateceo/vedic_transform`](https://github.com/cocreateceo/vedic_transform)
— a Next.js 15 + Tailwind CSS v4 + SST (AWS) app for **10X Vedic Transform**,
the flagship product under the **Vedics.net** umbrella.

🪷 **The brand is warm, not somber.** Light cream canvases, saffron + gold
accents, generous goldenrod borders, friendly sans-serif type, gentle
illustrative pillar icons. It should feel like a **modern wellness app with
Vedic soul** — *not* a dark esoteric temple. Earlier iterations of this kit
got that wrong; the current files are aligned with the real product.

---

## The products

| Surface | URL | What it is | Brand accent |
|---|---|---|---|
| **10X Vedic Transform** | https://10x.vedics.net | 48-day guided transformation — 11 daily Vedic "pillars" with karma points, streaks, dosha quiz, AI guide, 6-language support. **This is the main product.** | Saffron `#FF9933` × Gold `#FFD700` |
| **Vedics.net** (umbrella) | https://vedics.net | Marketing landing that points to all three platforms. | Same warm palette |
| **Astro Vedics** | https://astro.vedics.net | AI-powered Vedic astrology (Kundli, Nakshatras, Dasha, Panchang). | Stays in saffron family |
| **AyurVeda Living** | https://wellnessstore.vedics.net | AI dosha consultation + curated Ayurvedic commerce. | Stays in saffron family |

---

## Sources used to build this system

- **GitHub — `cocreateceo/vedic_transform` (`main`)** — the production
  codebase. Confirmed structure: Next.js App Router (`src/app/`), Tailwind v4
  global CSS (`src/app/globals.css`), Lucide React icons, 19 DynamoDB tables
  via SST.
- **GitHub — `cocreateceo/Vedic_Landing` (`master`)** — the umbrella
  marketing site (vanilla HTML).
- **Live — `https://10x.vedics.net`** — public marketing pages.

The **`vedic_transform`** repo is the source of truth for tokens,
components, and navigation. All visual decisions in this design system trace
back to a specific file in that codebase.

---

## File index

```
.
├── README.md                  ← you are here
├── SKILL.md                   ← Agent-Skills frontmatter; load for Claude Code
├── colors_and_type.css        ← all CSS vars (mirrors src/app/globals.css)
├── assets/                    ← logos & brand imagery
│   ├── logo.jpg               ← the canonical 10X lotus mark
│   ├── 10x-logo.jpg
│   ├── astro-logo.png
│   └── store-logo.png
├── preview/                   ← Design System tab cards (registered, ~700×var)
└── ui_kits/
    ├── 10x_transform/         ← FLAGSHIP — Next.js app recreation
    │   ├── index.html         ← React + Babel + Lucide CDN
    │   ├── globals.css        ← canonical token file
    │   ├── styles.css         ← layout-specific
    │   ├── Sidebar.jsx        ← 16-item sidebar
    │   ├── Dashboard.jsx      ← phase banner + Mandala ring + Today's Practice
    │   ├── PillarsPage.jsx    ← 3-tier prioritization
    │   ├── ProgressPage.jsx   ← consistency / charts / heatmap / badges
    │   └── …
    └── vedics_landing/        ← umbrella marketing site recreation
        ├── index.html
        └── …
```

---

## Content fundamentals

The voice is **friendly, didactic, gently spiritual** — like a knowledgeable
wellness coach. It does **not** condescend, hype, or use clinical jargon. Every
copy line earns its weight.

### Tone

- **Authoritative but warm.** *"A scientific + spiritual journey to realign
  your body, mind &amp; energy through 11 Vedic transformation pillars."*
  Never *"Crush your goals!"*
- **Educational pairing.** Sanskrit terms get a one-line English description.
  *Brahma Muhurta* → "Activate clarity, discipline &amp; emotional balance."
  *Pranayama* → "Stabilize stress hormones, activate focus."
- **Numbers over adjectives.** "48 days · 11 pillars · 60 min/day · 1000+
  transformations." Specifics over superlatives.
- **Imperative CTAs.** "Begin Your Journey," "Mark Done," "Play morning
  greeting." Action verb first.

### Casing & punctuation

- **Title Case** for h1/h2 ("11 Transformation Pillars", "Your Focus Pillars").
- **Sentence case** for body and short descriptions.
- **Em-dash** (—) separates clauses; **center-dot** (·) separates inline
  metadata (`Day 12 of 48 · Pitta Path`).
- Pillar names always followed by the Sanskrit name as a *secondary line*,
  not parenthetical.

### Person

- **"You"** addresses the user directly: *"Start your 48-day Mandala journey
  today."* / *"Your focus pillars."*
- **"We"** is the product team's voice, used sparingly: *"We use AI to make
  5,000 years of Vedic knowledge accessible."*
- No "I". No founder voice.

### Phase + day framing

Every dashboard view reminds you of context:
> Good morning, Arjuna! &nbsp; **Phase 2: Cleansing** &nbsp; Day 12 of 48 ·
> Lighten the system — diet, pranayama, gratitude.

The 6 journey phases are: **Foundation → Cleansing → Integration → Expansion
→ Manifestation → Completion**, each with a distinct gradient palette so
"Phase 2" reads sky-cyan instead of the default amber.

### Emoji & symbols

- **🔥** flame for streak. **⭐** star for karma. **🪷** lotus on the brand mark.
- Sparing — emoji are decorative pellets next to numbers, never standalone.
- **No 🕉️ Om emoji** in the production app (the umbrella marketing site uses
  it, but the actual product does not). Sanskrit is rendered as Latin
  transliteration, not Devanagari, in 10X Transform.

---

## Visual foundations

### Colors

- **Canvas is light cream.** `--color-bg-primary: #FFFEF5`. The page is
  never pure white — there is always a faint warm undertone.
- **Surfaces** step UP from cream: `#ffffff` → `#FFF9F0` for elevated cards.
- **The brand pair is saffron + gold.** `#FF9933` (saffron, primary) and
  `#FFD700` (gold, secondary). The signature combination is the gradient
  `linear-gradient(to right, #f97316, #f59e0b)` — used on the active sidebar
  item, primary buttons, and gradient-text headlines.
- **Goldenrod `#DAA520`** is the signature card border — `2px solid` on
  every elevated card (`.vedic-card`, `.glass-card`, the welcome banner,
  Today's Practice). It's *the* visual element that says "this is a Vedics
  app." Never use a thin gray border where this should go.
- **11 pillar colors** (Tailwind tier 500 + `/20` alpha for the icon
  background tile):
  - Morning 🌅 `#FFD700` · Nutrition 🥗 `#4CAF50` · Thoughts 🧠 `#9C27B0`
  - Breathing 🌬️ `#00BCD4` · Movement 🏃 `#FF5722` · Healing 💗 `#E91E63`
  - Gratitude 🙏 `#8BC34A` · Sandhya ☀️ `#FFC107` · Brahman ♾️ `#673AB7`
  - Manifestation ✨ `#A855F7` · Sleep 🌙 `#3F51B5`
- **Text:** primary `#1a1a1a`, secondary `#64748b`, muted `#94a3b8`.
- **Dark + Sattva modes** exist in tokens but the app boots in light mode.
  Both are warm amber-tinted variants — `data-theme="dark"` uses
  `#0f0d08` base; `data-theme="sattva"` is a brown evening mode.

### Typography

- **Sans-serif system.** Production uses **Geist Sans** (Next.js default);
  this kit substitutes **Inter** as the closest free CDN match. Plus Jakarta
  Sans for hero displays.
- **Bold for emphasis.** Headings are `font-weight: 700–800`, body is `400–500`.
- **No tracked-out caps** except short eyebrows (`letter-spacing: 0.1em`,
  uppercase, 0.7rem). Don't track body or links — that was an earlier
  mistake based on the wrong reference.
- **Gradient text** is reserved for one phrase per page — usually the
  product name *10X Vedic* or a single hero clause like *"in 48 Days."*
  Apply via `linear-gradient(to right, #f97316, #f59e0b)` + `-webkit-background-clip: text`.

### Cards & elevation

- **Two card styles in the wild:**
  - **`.vedic-card` / `.glass-card` / `.golden-border-solid`** — 2px
    goldenrod border, semi-transparent white bg, 16px radius, soft outer
    shadow + faint gold glow. Used for prominent containers (today's
    practice, daily brief, stat cards, badges card).
  - **`.card-plain`** — 1px subtle border `rgba(255,153,51,0.15)`, 16px
    radius. Used for individual pillar tiles and quick actions.
- **Hover** lifts shadow + brightens border to `#FFD700`. No transform
  on most cards (only pillar tiles use `translateY(-2px)`).
- **Active pillar tile** = amber ring (`ring-2 ring-amber-300`); **done
  pillar** = green ring + green-tinted bg (`#F0FDF4`).

### Backgrounds

- **Phase-tinted gradients** for the dashboard welcome banner — six
  distinct duotones, one per journey phase. Phase 2 (Cleansing) is sky-cyan;
  Phase 4 (Expansion) is pink-rose; etc. *This is the single most important
  way to make the product feel alive across the 48 days.*
- **Radial-glow halo** behind the public hero — soft amber wash from
  top-center.
- **Cream gradient** (`#FFF7E0 → #FEF3C7`) for the Daily Wisdom card.
- No noise textures, no particles, no dark glows. The real app is clean and
  airy.

### Animation

- **Easing**: standard CSS `ease`. Nothing custom-tuned.
- **Durations**: 200ms hover/state, 400ms component, 500–800ms data-driven
  progress bars.
- **Pulse-glow** keyframe used only on the streak ring when the user is "at
  risk" of breaking their streak.
- **Golden shimmer** keyframe defined but used sparingly (animated
  `golden-border` variant — performance-aware, not on every card).
- **No floating particles or scroll reveals** in the real app — those were
  my earlier additions that don't match.

### Hover & press

- **Cards lift** subtly on hover: `transform: translateY(-2px)`,
  `box-shadow: 0 8px 24px rgba(0,0,0,0.08)`, border brightens to gold.
- **Buttons lift** with the same 1–2px transform + glow.
- **Sidebar items** highlight via `background: var(--color-card-bg)` on
  hover; active item gets the gradient + `shadow-orange-500/25`.
- Press states use the same hover + 1px translate down — they don't shrink.

### Borders & radii

- **Goldenrod 2px** for elevated containers; **`rgba(255,153,51,0.15)` 1px**
  for plain cards and inputs.
- **Radii ladder**: 8 (small) → 10 (input) → 12 (button, sidebar link) →
  14 (pillar tile) → 16 (card) → 18 (auth card) → 24 (large hero card).
- **Pills** = `border-radius: 999px` for badges, ghost buttons, the chat
  toggle.

### Shadows

- All shadows are **soft, warm-tinted, large-radius**:
  - Card: `0 4px 30px rgba(0,0,0,0.08), 0 0 12px rgba(255,215,0,0.08)`
  - Hover card: `0 8px 24px rgba(0,0,0,0.08)`
  - Active sidebar / primary CTA: `0 8px 20px rgba(249,115,22,0.25)`
  - Chat FAB: `0 8px 24px rgba(249,115,22,0.35)`
- **No inset shadows**, **no harsh blacks** anywhere.

### Iconography

See **ICONOGRAPHY** below — short version: the real app uses **Lucide
React** for everything. No emoji-as-icon. The earlier inclusion of 🕉️/🙏 as
UI icons was wrong.

---

## Iconography

**Lucide React** (`lucide-react@0.562.0` in the production `package.json`)
is the icon system. Every icon you see in the app is a Lucide name. The set
is consistent in stroke weight (2px default), feel, and metric.

### Icons used in navigation

```
Primary:    layout-dashboard · layers · timer · target · trending-up · book-open
Tools:      book-marked · image · leaf · quote · smile-plus · trophy · sparkles · file-text · bell · settings
Pillars:    sunrise · utensils · brain · wind · person-standing · heart · hand-heart · sun · infinity · sparkles · moon
Actions:    play · pause · check · x · log-out · user · menu · more-horizontal · send · headphones · award · compass · flame · star · shield · pen-line · medal
```

### How to use it

The real app uses ES imports from `lucide-react`:
```tsx
import { LayoutDashboard, Sparkles } from 'lucide-react';
<LayoutDashboard className="w-5 h-5" />
```

The standalone CDN equivalent — used in this design system's HTML kits —
loads UMD and renders SVG factories:
```html
<script src="https://unpkg.com/lucide@0.546.0/dist/umd/lucide.min.js"></script>
<span data-lucide="layout-dashboard" />
<script>lucide.createIcons()</script>
```

### Stroke weight

- **Default**: `stroke-width: 2` (Lucide default).
- **Inside pillar tiles** the color comes from the pillar's `color` field
  (e.g. `#00BCD4` for Pranayama). The icon sits inside a circular tile with
  the same color at 20% alpha.

### What's NOT icons

- **Emoji** — 🔥 streak and ⭐ karma appear in stat labels as **typographic
  pellets**, not in the sidebar or component icons.
- **Devanagari** — Sanskrit is rendered as Latin transliteration (Brahma
  Muhurta, Pranayama, Sankalpa). Devanagari does not appear in the product
  UI; only the marketing umbrella site uses it.
- **No custom SVGs** for pillar identity — the Lucide icon for each pillar
  serves as its visual mark.

---

## UI Kits

- **[`ui_kits/10x_transform/`](./ui_kits/10x_transform/)** — full Next.js
  recreation: 16-item sidebar + Dashboard + Pillars (3-tier) + Pillar detail
  + Progress (charts + heatmap + badges) + Sessions (5 timer tabs) + Login +
  Onboarding (4 steps) + 12 fully-built sidebar routes (Journal,
  Dosha Assessment, Goals, Library, Posters, Wisdom, Mood, Achievements,
  Insights, Reports, Reminders, Settings) + Command Palette + AI chatbot.
- **[`ui_kits/vedics_landing/`](./ui_kits/vedics_landing/)** — the umbrella
  marketing landing. **Note:** this kit is from the earlier (dark)
  exploration and visually does NOT match the warm light brand. It still
  represents the live `vedics.net` site (which IS dark/gilded) — that's a
  brand-direction tension between the umbrella site and the product app. Ask
  the team which direction is canonical.

---

## Caveats — read me

- **The earlier dark/Cinzel-serif direction was wrong.** That came from
  studying the umbrella `Vedic_Landing` repo and live `vedics.net`, both of
  which are dark + gilded. The actual product (`10x.vedics.net`, the app
  the user runs) is the opposite: light, cream, sans-serif. This is now
  corrected — the design system docs and `ui_kits/10x_transform/` are
  aligned with the **product**. The umbrella site kit is left as-is for
  reference but visually clashes.
- **Geist Sans → Inter** is a font substitution. Close metrics; not pixel
  identical. If you need exact, self-host Geist Sans via Vercel's package.
- **Charts are inline SVG**, not recharts. Visual parity, no bundle dep.
- **Lucide loaded via UMD CDN** instead of bundled `lucide-react`. Same
  icons, same look.
- **No real data** — UI kits ship mock state (`MOCK_USER` = Day 12 / Pitta
  / 248 karma / 12-day streak). Wire to real `apiFetch('/data/journey')`
  etc. when porting.
