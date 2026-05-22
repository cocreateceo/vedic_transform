---
name: vedic-design
description: Use this skill to generate well-branded interfaces and assets for 10X Vedic Transform and the Vedics.net umbrella. Contains essential design guidelines, colors, typography, fonts, logos, and full UI-kit component code matching the actual production codebase (cocreateceo/vedic_transform — Next.js + Tailwind + Lucide). The brand is light cream, saffron + gold, with 2px goldenrod borders, Inter sans-serif, and Lucide icons. Use for landing pages, in-app dashboards, dosha quizzes, chatbots, pillar/program flows, and any throwaway prototype that should look like part of the product.
user-invocable: true
---

Read the `README.md` file within this skill first, then explore the other available files.

## Source of truth

This skill was rebuilt from the actual production code at
[`github.com/cocreateceo/vedic_transform`](https://github.com/cocreateceo/vedic_transform).
The visual language is **light cream + saffron/gold + Lucide React icons +
Inter sans-serif** — *not* the dark Cinzel-serif direction that was an
earlier wrong turn.

## What's available

- `colors_and_type.css` — single source of truth for all CSS vars
  (mirrors `src/app/globals.css`). Import or copy into any new artifact.
- `assets/` — product logos (10X lotus, Astro Vedics, AyurVeda Living).
- `preview/` — small specimen cards for every token + component in
  isolation. Useful to quickly remind yourself what the system looks like.
- `ui_kits/10x_transform/` — full hi-fi recreation of the 10X Vedic
  Transform product. Dashboard (with Mandala ring + Today's Practice +
  Streak/Karma stats + 11 pillar grid), Pillars page (3-tier
  prioritization), Progress (charts + heatmap + badges), Login, 13 stub
  routes for the long-tail. JSX components are modular (`Sidebar.jsx`,
  `Dashboard.jsx`, `PillarsPage.jsx`, `ProgressPage.jsx`, `Primitives.jsx`,
  `PillarData.jsx`, `ChatBot.jsx`).
- `ui_kits/vedics_landing/` — umbrella marketing landing recreation
  (note: still dark + gilded — represents the live `vedics.net` site,
  which has a different aesthetic from the actual product).

## How to use

If creating visual artifacts (slides, mocks, throwaway prototypes):
1. Copy `colors_and_type.css` and the relevant logo from `assets/` out.
2. Reuse JSX components from `ui_kits/10x_transform/` — they're designed to
   be lifted (Sidebar, Dashboard's MandalaRing, the PillarCardRich, etc.).
3. Output a static HTML file for the user to view.

If working on production code (Next.js + Tailwind), copy assets and read
the rules in `README.md` to become an expert in designing with this brand.
Pay special attention to:

- **Light cream canvas, never pure white.** `--color-bg-primary: #FFFEF5`.
- **Saffron gradient `from-orange-500 to-amber-500`** for active states,
  primary CTAs, and gradient-text headlines. Never flat saffron.
- **Goldenrod `#DAA520` 2px border** is THE brand signature on elevated
  cards. Apply liberally.
- **Inter sans-serif body** (or Geist if available). NOT a serif. NOT
  tracked-out. Bold (700–800) for headings, regular for body.
- **Lucide React icons** for everything. No emoji-as-icon (🔥 ⭐ are
  acceptable as typographic pellets next to numbers, nowhere else).
- **11 pillar colors** — each pillar has a fixed color used as both the
  Lucide icon color and the tile background at 20% alpha.
- **Phase-tinted welcome banner** — 6 distinct gradients across the 48-day
  journey (Foundation amber, Cleansing sky, Integration violet, Expansion
  pink, Manifestation emerald, Completion deep-amber). This is the key
  "feels alive" mechanism.
- **Sanskrit terms** are always paired with English explanations — but
  rendered in Latin transliteration, NOT Devanagari, in the product.
  Devanagari only appears on the marketing umbrella site.

If the user invokes this skill without any other guidance, ask them what
they want to build or design (a new pillar landing? a settings screen? a
deck introducing a new program?), ask some clarifying questions about
audience and fidelity, then act as an expert designer who outputs HTML
artifacts or production code, depending on the need.
