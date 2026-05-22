# Vedics.net Umbrella — UI Kit

Recreation of the umbrella landing at **https://vedics.net** — introduces all
three Vedic platforms (Transform / Astro / Wellness).

Source: `cocreateceo/Vedic_Landing@master/index.html`.

## What's inside

| Section | What you see |
|---|---|
| **Nav** | Fixed top bar, blurred dark background, Cinzel Decorative wordmark, 4 tracked links. |
| **Hero** | Pulsing 🕉️ Om, animated shimmer "Vedics" headline, Devanagari verse, primary CTA, plus the **3 platform cards** (10X / Astro / AyurVeda) that lift on hover and reveal a colored top-stripe. |
| **About** | Two-column "What is Vedics?" — body copy left, 4 stat tiles, 3 sciences pillars right (gold left-border treatment). |
| **Sciences** | 3-up bordered cards — Transformation / Astrology / Wellness — each with emoji icon, Sanskrit name, paragraph, ◈ bullet list. Per-card hover glow tint (saffron/blue/green). |
| **Why Vedics** | 4-up grid of glass-bordered cards. |
| **Footer** | 4-col with brand block + Platforms / Sciences / Connect. |
| **Vedic Wisdom Guide** | Same floating chatbot as the 10X kit. |

## Files

```
ui_kits/vedics_landing/
├── index.html       ← entry
├── styles.css       ← all styles
├── colors_and_type.css
├── Primitives.jsx   ← Ornament, GoldText, ShimmerText, PrimaryCTA, Tag, BrandTexture (from 10x kit)
├── Sections.jsx     ← VNav, VHero, PlatformCard, VAbout, VSciences, VWhy, VFooter
├── ChatBot.jsx      ← shared
└── assets/          ← 10x-logo.jpg · astro-logo.png
```

## Notes

The reconstruction is high-fidelity — copy, structure, colors, and hover
states match the live umbrella landing exactly. PlatformCard is a reusable
component you can drop into any new layout.
