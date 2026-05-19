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
