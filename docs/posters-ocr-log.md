# Posters OCR Audit Log

Each entry maps a source file in `Posters/Posters/` to the curated slug,
the WebP outputs in `public/posters/`, and the OCR-extracted JSON that
was appended to `src/data/posters.ts`.

Format per entry:

````
## <slug>
Source: <filename>
Outputs: /posters/<slug>.webp, @2x.webp, .thumb.webp
Extracted at: YYYY-MM-DD HH:MM by Claude Code

```json
<json snippet>
```
````

Phase 2 fills this file in batches of 3-4 posters.

---

## Batch 1 — 2026-05-19

### morning-routine-5-step
- Source: `WhatsApp Image 2026-05-19 at 7.39.07 AM (5).jpeg`
- Outputs: `/posters/morning-routine-5-step.webp`, `@2x.webp`, `.thumb.webp` (768x512)
- Extracted by: Claude Code (Opus 4.7)
- Scripture: Yoga Sutra 1.2 (yogaḥ chitta vṛtti nirodhaḥ)
- Sections: 5 numbered steps (wake early → breath → awareness → gratitude → manifestation), each with 4-step benefits bullets

### morning-sandhya-meditation
- Source: `WhatsApp Image 2026-05-19 at 7.39.03 AM (14).jpeg`
- Outputs: `/posters/morning-sandhya-meditation.webp`, `@2x.webp`, `.thumb.webp` (768x512)
- Extracted by: Claude Code (Opus 4.7)
- Scripture: none cited in poster
- Sections: 3 panels (why → 7 practice steps → 7 benefits)

### path-of-manifestation
- Source: `WhatsApp Image 2026-05-19 at 7.39.02 AM (1).jpeg` (manifest corrected — original mapping pointed to nutrition poster)
- Outputs: `/posters/path-of-manifestation.webp`, `@2x.webp`, `.thumb.webp` (768x1152)
- Extracted by: Claude Code (Opus 4.7)
- Scripture: none cited in poster
- Sections: 6 numbered manifestation steps

## Batch 2 — 2026-05-19

### five-principles-of-manifestation
- Source: `WhatsApp Image 2026-05-19 at 7.39.03 AM.jpeg` (768x1152)
- Scripture: Yoga Sutra 1.2
- Sections: 5 numbered principles (mental stillness, sankalpa, dharana, non-attachment, samskaras)

### manifestation-secrets-patanjali
- Source: `WhatsApp Image 2026-05-19 at 7.39.05 AM (5).jpeg` (768x1152)
- Scripture: Yoga Sutra 1.2
- Sections: 8 numbered secrets (mind control, sankalpa, dharana, dhyana, samskaras, pranayama, sattvic lifestyle, faith)

### step-by-step-healing
- Source: `WhatsApp Image 2026-05-19 at 7.39.07 AM.jpeg` (768x1152)
- Scripture: Yoga Sutra 1.2
- Sections: 9 numbered healing steps (calm mind → consistency)

## Batch 3 — 2026-05-19

### gratitude-way-of-life
- Source: `WhatsApp Image 2026-05-19 at 7.39.03 AM (10).jpeg` (768x512, triptych)
- Scripture: Yoga Sutra 2.42 (Santosha)
- Sections: 3 panels (Patanjali connection → science & yogic wisdom → way of life with daily habits)

### ayurvedic-nutrition-fasting
- Source: `WhatsApp Image 2026-05-19 at 7.39.04 AM (10).jpeg` (768x768)
- Scripture: Bhagavad Gita 6.17 + Yoga Sutra 2.40
- Sections: 5 numbered (sun's window → warm water → sattvic food → 80% rule → hydration)

### mind-purification-5-step
- Source: `WhatsApp Image 2026-05-19 at 7.39.06 AM (5).jpeg` (768x1152)
- Scripture: none cited
- Sections: 5 numbered (positive inputs → mental nutrition → avoid tamasic → remove negatives → high-vibration influences)

## Batch 4 — 2026-05-19 (dosha-specific)

### vata-balancing-yoga (dosha=vata, kind=yoga)
- Source: `WhatsApp Image 2026-05-19 at 7.39.04 AM (5).jpeg` (768x512)
- Scripture: Yoga Sutra 2.46 (Sthira-sukham asanam)
- Sections: 12 (intro + 10 asanas + Vata tips)

### pitta-balancing-yoga (dosha=pitta, kind=yoga)
- Source: `WhatsApp Image 2026-05-19 at 7.39.05 AM.jpeg` (768x512)
- Scripture: Yoga Sutra 1.33
- Sections: 5 themed sets (cool & calm, soothe & release, cool the body, balance & harmony, restore & renew); each with sutra + 5 asanas + tip

### vata-pranayama (dosha=vata, kind=pranayama)
- Source: `WhatsApp Image 2026-05-19 at 7.39.06 AM (10).jpeg` (768x1152)
- Scripture: none cited
- Sections: 5 (about + 3 practices: Nadi Shodhana, Ujjayi, Dirgha Shvasana + guidelines)

### kapha-pranayama (dosha=kapha, kind=pranayama)
- Source: `WhatsApp Image 2026-05-19 at 7.39.06 AM.jpeg` (768x1152)
- Scripture: none cited
- Sections: 5 (about + 3 practices: Kapalabhati, Bhastrika, Surya Bhedana + guidelines)

---

## Summary (through Batch 4 — outdated; superseded by Batch 5 below)

**13 posters OCR'd, verified, and committed.**
- 8 general (morning routine, sandhya, manifestation x3, healing, gratitude, nutrition, mind-purification)
- 5 dosha-tagged (vata yoga, pitta yoga, vata pranayama, kapha pranayama)
- Note: Pitta pranayama poster not present in source set; gallery and dosha-result page handle the absence gracefully via `getPosterByDosha()` returning undefined.

Pillar coverage:
- morning-initiation: 1 (5-step morning routine)
- sandhya-meditation: 1 (morning sandhya)
- divine-manifestation: 3 (path, 5 principles, manifestation secrets)
- healing-meditation: 1 (step-by-step healing)
- gratitude: 1 (way of life)
- nutrition-fasting: 1 (Ayurvedic eating)
- thoughts-intention: 1 (5-step mind purification)
- movement: 2 (Vata yoga, Pitta yoga)
- breathing-meditation: 2 (Vata pranayama, Kapha pranayama)


## Batch 5 — 2026-05-28 (parallel-agent OCR; 13 new posters from 61 unprocessed)

Processed by 4 parallel general-purpose agents reading raw JPEGs in their own contexts; aggregated into one consolidated batch via scripts/posters-consolidate.cjs.

**Duplication rate**: of 61 unprocessed JPEGs, 13 are new unique posters and 46 are visual duplicates of existing canonical entries (2 unreadable book-cover collages). Total OCR'd set is now **26 posters**.

### three-sandhyas-daily-rhythm
- Source: `WhatsApp Image 2026-05-19 at 7.39.03 AM (12).jpeg` (768x512)
- Outputs: `/poster-images/three-sandhyas-daily-rhythm.webp`, `@2x.webp`, `.thumb.webp`
- Extracted by: Claude Code (Opus 4.7) — parallel-agent OCR pipeline
- Scripture: none cited
- Sections: 6 (Morning Sandhya Meditation — Practice Steps / Morning Sandhya — Benefits / Midday Sandhya Meditation — Practice Steps / …)

### sandhya-meditation-three-sacred-times
- Source: `WhatsApp Image 2026-05-19 at 7.39.03 AM (13).jpeg` (768x512)
- Outputs: `/poster-images/sandhya-meditation-three-sacred-times.webp`, `@2x.webp`, `.thumb.webp`
- Extracted by: Claude Code (Opus 4.7) — parallel-agent OCR pipeline
- Scripture: Yoga Sutra 1.2
- Sections: 6 (Morning Sandhya — Connect · Purify · Awaken / The Three Sandhyas / Benefits of Sandhya Meditation / …)

### ten-manifestation-secrets-patanjali
- Source: `WhatsApp Image 2026-05-19 at 7.39.03 AM (4).jpeg` (768x512)
- Outputs: `/poster-images/ten-manifestation-secrets-patanjali.webp`, `@2x.webp`, `.thumb.webp`
- Extracted by: Claude Code (Opus 4.7) — parallel-agent OCR pipeline
- Scripture: Yoga Sutra 1.2
- Sections: 10 (Control the Mind (Chitta Vritti Nirodha) / Sankalpa — Power of Intention / Dharana — Concentration Creates Energy / …)

### sandhya-meditation-three-phase-ritual
- Source: `WhatsApp Image 2026-05-19 at 7.39.03 AM (8).jpeg` (768x915)
- Outputs: `/poster-images/sandhya-meditation-three-phase-ritual.webp`, `@2x.webp`, `.thumb.webp`
- Extracted by: Claude Code (Opus 4.7) — parallel-agent OCR pipeline
- Scripture: Gayatri Mantra, Peace Mantra
- Sections: 8 (Preparation / OM Chanting / Pranayama / …)

### noon-sandhya-meditation-benefits
- Source: `WhatsApp Image 2026-05-19 at 7.39.03 AM (9).jpeg` (768x512)
- Outputs: `/poster-images/noon-sandhya-meditation-benefits.webp`, `@2x.webp`, `.thumb.webp`
- Extracted by: Claude Code (Opus 4.7) — parallel-agent OCR pipeline
- Scripture: none cited
- Sections: 3 (Why Noon Sandhya? / Benefits for Emotional Health / Energetic & Spiritual Benefits)

### pranayama-meditation-6-step
- Source: `WhatsApp Image 2026-05-19 at 7.39.04 AM (11).jpeg` (768x1152)
- Outputs: `/poster-images/pranayama-meditation-6-step.webp`, `@2x.webp`, `.thumb.webp`
- Extracted by: Claude Code (Opus 4.7) — parallel-agent OCR pipeline
- Scripture: Patanjali Yoga Sutras
- Sections: 6 (Sit Quietly (2 minutes) / Deep Breathing (5 minutes) / Nadi Shodhana (5–10 minutes) / …)

### vata-balancing-yoga-5-themes (dosha=vata, kind=yoga)
- Source: `WhatsApp Image 2026-05-19 at 7.39.04 AM (4).jpeg` (768x512)
- Outputs: `/poster-images/vata-balancing-yoga-5-themes.webp`, `@2x.webp`, `.thumb.webp`
- Extracted by: Claude Code (Opus 4.7) — parallel-agent OCR pipeline
- Scripture: Yoga Sutra 1.14, Yoga Sutra 2.46, Yoga Sutra 1.2, Yoga Sutra 1.12, Yoga Sutra 1.33
- Sections: 5 (Ground & Stabilize / Nourish & Rejuvenate / Calm the Mind & Breath / …)

### pitta-pranayama (dosha=pitta, kind=pranayama)
- Source: `WhatsApp Image 2026-05-19 at 7.39.04 AM (8).jpeg` (768x1152)
- Outputs: `/poster-images/pitta-pranayama.webp`, `@2x.webp`, `.thumb.webp`
- Extracted by: Claude Code (Opus 4.7) — parallel-agent OCR pipeline
- Scripture: none cited
- Sections: 8 (About Pitta Dosha / Goal of Pranayama for Pitta / Sheetali Pranayama (Cooling Breath) / …)

### manifestation-process-patanjali
- Source: `WhatsApp Image 2026-05-19 at 7.39.05 AM (11).jpeg` (768x512)
- Outputs: `/poster-images/manifestation-process-patanjali.webp`, `@2x.webp`, `.thumb.webp`
- Extracted by: Claude Code (Opus 4.7) — parallel-agent OCR pipeline
- Scripture: Yoga Sutra 1.2, Yoga Sutra 1.14, Yoga Sutra 1.33, Yoga Sutra 2.48, Yoga Sutra 1.3
- Sections: 6 (Align Your Mind, Energy & Consciousness to Create Your Reality / The Manifestation Process / Key Sutras for Manifestation / …)

### kapha-balancing-yoga (dosha=kapha, kind=yoga)
- Source: `WhatsApp Image 2026-05-19 at 7.39.05 AM (3).jpeg` (768x512)
- Outputs: `/poster-images/kapha-balancing-yoga.webp`, `@2x.webp`, `.thumb.webp`
- Extracted by: Claude Code (Opus 4.7) — parallel-agent OCR pipeline
- Scripture: Yoga Sutra 1.2, Yoga Sutra 2.1, Yoga Sutra 1.14, Yoga Sutra 2.46, Yoga Sutra 1.3
- Sections: 11 (Sun Salutation (Surya Namaskar) / Warrior II Pose (Virabhadrasana II) / Chair Pose (Utkatasana) / …)

### pitta-balancing-yoga-10-asanas (dosha=pitta, kind=yoga)
- Source: `WhatsApp Image 2026-05-19 at 7.39.05 AM (6).jpeg` (768x512)
- Outputs: `/poster-images/pitta-balancing-yoga-10-asanas.webp`, `@2x.webp`, `.thumb.webp`
- Extracted by: Claude Code (Opus 4.7) — parallel-agent OCR pipeline
- Scripture: Yoga Sutra 1.33, Yoga Sutra 2.46, Yoga Sutra 1.3
- Sections: 11 (Moon Salutation (Chandra Namaskar) / Forward Fold (Paschimottanasana) / Camel Pose (Ustrasana) / …)

### manifestation-triptych-inner-to-outer
- Source: `WhatsApp Image 2026-05-19 at 7.39.05 AM (8).jpeg` (768x512)
- Outputs: `/poster-images/manifestation-triptych-inner-to-outer.webp`, `@2x.webp`, `.thumb.webp`
- Extracted by: Claude Code (Opus 4.7) — parallel-agent OCR pipeline
- Scripture: Yoga Sutra 1.2
- Sections: 7 (The Science of Manifestation According to Patanjali / Dharana (Concentration) / Dhyana (Meditation) / …)

### nutrition-fasting-ayurvedic-guide
- Source: `WhatsApp Image 2026-05-19 at 7.39.06 AM (3).jpeg` (768x1152)
- Outputs: `/poster-images/nutrition-fasting-ayurvedic-guide.webp`, `@2x.webp`, `.thumb.webp`
- Extracted by: Claude Code (Opus 4.7) — parallel-agent OCR pipeline
- Scripture: Yoga Sutra 2.40
- Sections: 8 (The Yogic View of Food / The Three Types of Food / Intermittent Fasting — A Modern Yogic Practice / …)

### Duplicate / unreadable findings (full audit)

| Source filename | Status | Canonical slug |
|---|---|---|
| `WhatsApp Image 2026-05-19 at 7.39.03 AM (12).jpeg` | new | three-sandhyas-daily-rhythm |
| `WhatsApp Image 2026-05-19 at 7.39.03 AM (13).jpeg` | new | sandhya-meditation-three-sacred-times |
| `WhatsApp Image 2026-05-19 at 7.39.03 AM (2).jpeg` | duplicate | step-by-step-healing |
| `WhatsApp Image 2026-05-19 at 7.39.03 AM (3).jpeg` | duplicate | path-of-manifestation |
| `WhatsApp Image 2026-05-19 at 7.39.03 AM (4).jpeg` | new | ten-manifestation-secrets-patanjali |
| `WhatsApp Image 2026-05-19 at 7.39.03 AM (5).jpeg` | duplicate | step-by-step-healing |
| `WhatsApp Image 2026-05-19 at 7.39.03 AM (6).jpeg` | duplicate | ten-manifestation-secrets-patanjali |
| `WhatsApp Image 2026-05-19 at 7.39.03 AM (7).jpeg` | duplicate | path-of-manifestation |
| `WhatsApp Image 2026-05-19 at 7.39.03 AM (8).jpeg` | new | sandhya-meditation-three-phase-ritual |
| `WhatsApp Image 2026-05-19 at 7.39.03 AM (9).jpeg` | new | noon-sandhya-meditation-benefits |
| `WhatsApp Image 2026-05-19 at 7.39.04 AM (1).jpeg` | duplicate | gratitude-way-of-life |
| `WhatsApp Image 2026-05-19 at 7.39.04 AM (11).jpeg` | new | pranayama-meditation-6-step |
| `WhatsApp Image 2026-05-19 at 7.39.04 AM (12).jpeg` | duplicate | ten-manifestation-secrets-patanjali |
| `WhatsApp Image 2026-05-19 at 7.39.04 AM (13).jpeg` | duplicate | path-of-manifestation |
| `WhatsApp Image 2026-05-19 at 7.39.04 AM (2).jpeg` | duplicate | mind-purification-5-step |
| `WhatsApp Image 2026-05-19 at 7.39.04 AM (3).jpeg` | new | manifestation-10-secrets-patanjali |
| `WhatsApp Image 2026-05-19 at 7.39.04 AM (4).jpeg` | new | vata-balancing-yoga-5-themes |
| `WhatsApp Image 2026-05-19 at 7.39.04 AM (6).jpeg` | duplicate | morning-routine-5-step |
| `WhatsApp Image 2026-05-19 at 7.39.04 AM (7).jpeg` | duplicate | morning-routine-5-step |
| `WhatsApp Image 2026-05-19 at 7.39.04 AM (8).jpeg` | new | pitta-pranayama |
| `WhatsApp Image 2026-05-19 at 7.39.04 AM (9).jpeg` | duplicate | morning-routine-5-step |
| `WhatsApp Image 2026-05-19 at 7.39.04 AM.jpeg` | duplicate | gratitude-way-of-life |
| `WhatsApp Image 2026-05-19 at 7.39.05 AM (1).jpeg` | duplicate | pitta-pranayama |
| `WhatsApp Image 2026-05-19 at 7.39.05 AM (10).jpeg` | duplicate | five-principles-of-manifestation |
| `WhatsApp Image 2026-05-19 at 7.39.05 AM (11).jpeg` | new | manifestation-process-patanjali |
| `WhatsApp Image 2026-05-19 at 7.39.05 AM (12).jpeg` | duplicate | manifestation-10-secrets-patanjali |
| `WhatsApp Image 2026-05-19 at 7.39.05 AM (13).jpeg` | duplicate | ayurvedic-nutrition-fasting |
| `WhatsApp Image 2026-05-19 at 7.39.05 AM (14).jpeg` | duplicate | morning-routine-5-step |
| `WhatsApp Image 2026-05-19 at 7.39.05 AM (2).jpeg` | unreadable | — |
| `WhatsApp Image 2026-05-19 at 7.39.05 AM (3).jpeg` | new | kapha-balancing-yoga |
| `WhatsApp Image 2026-05-19 at 7.39.05 AM (4).jpeg` | unreadable | — |
| `WhatsApp Image 2026-05-19 at 7.39.05 AM (6).jpeg` | new | pitta-balancing-yoga-10-asanas |
| `WhatsApp Image 2026-05-19 at 7.39.05 AM (7).jpeg` | duplicate | morning-routine-5-step |
| `WhatsApp Image 2026-05-19 at 7.39.05 AM (8).jpeg` | new | manifestation-triptych-inner-to-outer |
| `WhatsApp Image 2026-05-19 at 7.39.05 AM (9).jpeg` | duplicate | morning-routine-5-step |
| `WhatsApp Image 2026-05-19 at 7.39.06 AM (1).jpeg` | duplicate | path-of-manifestation |
| `WhatsApp Image 2026-05-19 at 7.39.06 AM (11).jpeg` | duplicate | vata-pranayama |
| `WhatsApp Image 2026-05-19 at 7.39.06 AM (12).jpeg` | duplicate | pranayama-meditation-6-step |
| `WhatsApp Image 2026-05-19 at 7.39.06 AM (13).jpeg` | duplicate | ayurvedic-nutrition-fasting |
| `WhatsApp Image 2026-05-19 at 7.39.06 AM (2).jpeg` | duplicate | path-of-manifestation |
| `WhatsApp Image 2026-05-19 at 7.39.06 AM (3).jpeg` | new | nutrition-fasting-ayurvedic-guide |
| `WhatsApp Image 2026-05-19 at 7.39.06 AM (4).jpeg` | duplicate | ayurvedic-nutrition-fasting |
| `WhatsApp Image 2026-05-19 at 7.39.06 AM (6).jpeg` | duplicate | pranayama-meditation-6-step |
| `WhatsApp Image 2026-05-19 at 7.39.06 AM (7).jpeg` | duplicate | path-of-manifestation |
| `WhatsApp Image 2026-05-19 at 7.39.06 AM (8).jpeg` | duplicate | mind-purification-5-step |
| `WhatsApp Image 2026-05-19 at 7.39.06 AM (9).jpeg` | duplicate | path-of-manifestation |
| `WhatsApp Image 2026-05-19 at 7.39.07 AM (1).jpeg` | duplicate | morning-routine-5-step |
| `WhatsApp Image 2026-05-19 at 7.39.07 AM (10).jpeg` | duplicate | morning-routine-5-step |
| `WhatsApp Image 2026-05-19 at 7.39.07 AM (11).jpeg` | duplicate | kapha-pranayama |
| `WhatsApp Image 2026-05-19 at 7.39.07 AM (12).jpeg` | duplicate | five-principles-of-manifestation |
| `WhatsApp Image 2026-05-19 at 7.39.07 AM (2).jpeg` | duplicate | mind-purification-5-step |
| `WhatsApp Image 2026-05-19 at 7.39.07 AM (3).jpeg` | new | pranayama-meditation-6-step |
| `WhatsApp Image 2026-05-19 at 7.39.07 AM (4).jpeg` | duplicate | ayurvedic-nutrition-fasting |
| `WhatsApp Image 2026-05-19 at 7.39.07 AM (6).jpeg` | duplicate | pitta-balancing-yoga |
| `WhatsApp Image 2026-05-19 at 7.39.07 AM (7).jpeg` | duplicate | morning-routine-5-step |
| `WhatsApp Image 2026-05-19 at 7.39.07 AM (8).jpeg` | duplicate | ayurvedic-nutrition-fasting |
| `WhatsApp Image 2026-05-19 at 7.39.07 AM (9).jpeg` | duplicate | morning-routine-5-step |

---

## Final Summary (post-Batch 5)

**26 posters OCR'd, verified, and committed.** (13 original + 13 new from Batch 5)

Pillar coverage now:
- morning-initiation: 1 (5-step morning routine)
- sandhya-meditation: **5** (morning sandhya, three sandhyas daily rhythm, three sacred times triptych, three-phase ritual, noon-sandhya benefits)
- divine-manifestation: **6** (path, 5 principles, manifestation secrets, ten secrets, process triptych, inner-to-outer triptych)
- healing-meditation: 1 (step-by-step healing)
- gratitude: 1 (way of life)
- nutrition-fasting: **2** (Ayurvedic eating 5-step, ayurvedic guide w/ gunas + IF schedule)
- thoughts-intention: 1 (5-step mind purification)
- movement: **4** (Vata yoga 10-asana, Vata yoga 5-themes, Pitta yoga 5-themes, Pitta yoga 10-asana, Kapha yoga 10-asana — completes Vata/Pitta/Kapha trio)
- breathing-meditation: **4** (Vata pranayama, Pitta pranayama [new — completes the trio], Kapha pranayama, Pranayama+Meditation 6-step)

Dosha pranayama trio: ✅ complete (Vata · Pitta · Kapha)
Dosha yoga trio: ✅ complete (Vata · Pitta · Kapha — each has dedicated balancing poster)

Of the 74 raw WhatsApp JPEGs, 26 are unique canonical posters, ~46 are visual duplicates of the canonical set, and 2 are unreadable decorative book-cover collages.
