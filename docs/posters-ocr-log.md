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

## Summary

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

