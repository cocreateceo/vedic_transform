# 10X Vedic Transform — Mobile

Native iOS + Android app built with [Expo](https://expo.dev) + React Native +
`expo-router`. Shares the same backend (`/data/*` API) as the web app at
`src/`. Modelled after the `Speakwell/mobile/` structure.

## What's scaffolded

- ✅ Auth flow (login, register, onboarding) using `expo-secure-store` for
  the JWT
- ✅ Auth gate in `app/_layout.tsx` (mirrors the web `(main)/(auth)` group
  pattern) + onboarding redirect
- ✅ Bottom-tab nav with 5 primary destinations: Home / Pillars / Sessions /
  Journal / More
- ✅ Dashboard pulling from `/data/reports`
- ✅ Pillars grid with check-in via `/data/checkin` (uses the same dedupe,
  badge-award, and karma-credit logic as the web)
- ✅ Journal: gratitude + intention upsert through `/data/journal`, with
  pillar check-in credit
- ✅ "More" tab listing the remaining menu items as stubs (Goals, Progress,
  Library, Wisdom, Dosha Quiz, Mood, Achievements, Insights, Reports,
  Reminders, Settings)
- ✅ Sign-out
- ✅ Theme matching the web brand (saffron + amber on cream)

## What's still stub-only (next-up ports)

- Sessions (5 timer flows: Morning Routine, Meditation, Breathing, Fasting,
  Movement). Each needs an `expo-av` replacement for the web's Web Audio API
  procedural drones, plus visualisations.
- All the "More" tab destinations
- Push notifications via `expo-notifications` (the backend crons already
  exist — `morning-push`, `evening-push`, `sandhya-push`, `streak-save-push`,
  `recovery-push`)
- Google Sign-In via `@react-native-google-signin/google-signin`
- App icon + splash PNGs (placeholder paths in `app.json`; drop real assets
  under `assets/`)

## Getting started

```bash
cd mobile
npm install
npx expo install --check          # make sure native deps are version-aligned

# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android

# Web preview (limited — most native APIs no-op)
npm run web
```

## Pointing at a non-prod API

By default the app calls the production API at
`https://sav5ro38xi.execute-api.us-east-1.amazonaws.com`. Override per-env:

```bash
# mobile/.env.local
EXPO_PUBLIC_API_URL=https://your-dev-api.example.com
```

Then restart `expo start --clear`.

## Producing store builds

Use [EAS Build](https://docs.expo.dev/build/introduction/) once you're
ready to publish:

```bash
npm install -g eas-cli
eas login
eas build --platform ios
eas build --platform android
```

App identifiers (set in `app.json`):
- iOS: `com.vedictransform.app`
- Android: `com.vedictransform.app`

## Repo layout

```
mobile/
├── app/                  expo-router file-based routes
│   ├── _layout.tsx       root: auth gate + theme + safe-area + nav stack
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── onboarding.tsx
│   └── (tabs)/
│       ├── _layout.tsx   bottom-tab nav
│       ├── index.tsx     Dashboard
│       ├── pillars.tsx
│       ├── sessions.tsx  (stub)
│       ├── journal.tsx
│       └── more.tsx
├── hooks/
│   ├── useAuth.ts        provider + login/register/logout via /auth/*
│   └── useApi.ts         auth-aware fetch wrapper
├── lib/
│   └── pillars.ts        mirror of src/constants/pillars.ts
├── theme/
│   └── index.ts          colors, spacing, radius, typography
├── assets/               icon + splash + adaptive-icon PNGs (TODO)
├── app.json              Expo config — name, bundle ids, splash, plugins
├── package.json
├── tsconfig.json
└── babel.config.js
```

## Backend contract notes

The mobile app is a thin native UI over the existing API. Key endpoints
already used:

| Endpoint | Used in |
|---|---|
| `POST /auth/register` | `useAuth.register` |
| `POST /auth/login` | `useAuth.login` |
| `GET /auth/me` | session restore |
| `PATCH /data/user` | onboarding completion |
| `GET /data/reports` | Dashboard hero stats |
| `GET /data/checkin` | Pillars page → `completedPillars` |
| `POST /data/checkin` | Pillars check-in (idempotent same-day) |
| `GET /data/journal` | Journal pre-fill (`todayGratitude`, `todayIntention`) |
| `POST /data/journal` | Journal save (accepts both `action` and `type`) |
| `POST /data/journey` | Onboarding starts the 48-day journey |

All contracts were exhaustively verified during the menu audit on the web
(see commits `feee0ad..b4fd5bf`). No backend changes needed for the mobile
app to function — it's purely a UI layer.
