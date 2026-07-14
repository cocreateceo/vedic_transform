---
name: verify
description: How to build, run, and visually verify this Next.js app (auth-gated pages included) with Playwright screenshots
---

# Verifying Vedic_transform changes at runtime

## Build & run

```powershell
npm run build          # prod build (~2 min); training routes are SSG
npm start              # next start on http://localhost:3000
```

Direct HTTP probes return **308** (trailing-slash redirect) — normal; browsers follow it.

## Getting past AuthGuard without a backend

All `(main)` routes are auth-gated client-side. The auth context hydrates
optimistically from localStorage and **keeps the session on network errors**
(only a 401 from `/auth/me` clears it). So in Playwright:

1. `context.route(/^https?:\/\/(?!localhost)/, r => r.abort())` — abort external API calls
2. `addInitScript` to set localStorage before load:
   - `vedic-token`: any string
   - `vedic-user`: JSON with `{ id, email, name, onboardingCompleted: true }`
     (`onboardingCompleted: true` is required or the layout redirects to /onboarding)
   - optional `vedic-theme`: `dark` | `sattva` to test themes

With `NEXT_PUBLIC_API_URL` unset locally, API calls hit relative paths and 404 —
those console errors are environment noise; data-dependent UI (progress,
completion states) degrades gracefully by design.

## Playwright

Not a project dep. Globally installed (`@playwright/test` under
`C:\Users\patta\AppData\Roaming\npm\node_modules`, chromium browsers present).
Run scripts with:

```powershell
$env:NODE_PATH="C:\Users\patta\AppData\Roaming\npm\node_modules"; node script.js
```

and require via `require("playwright")` falling back to `require("@playwright/test")`.

## Flows worth driving

- `/training/introduction` — cinematic intro (scroll through; reveal animations need ~1s pauses between scroll stops)
- `/training/<chapter-slug>` — standard chapter reader
- Test `reducedMotion: "reduce"` context option — reveal wrappers must render static content
- Test mobile viewport 390x844 — sidebar collapses, single-column layouts
