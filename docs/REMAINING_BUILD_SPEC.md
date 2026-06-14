# Remaining Build Spec — Phases 3 & 4 (file-level, ready to execute)

**Date:** 2026-06-14
**Context:** The audit (`SITE_AUDIT_2026-06.md`) Phase-1/2 items are **shipped live**
(SEO quick wins, recovery ritual, per-dosha SEO pages, recharts split,
shareable milestone cards). This doc specs the remaining features at file
level so they can be built safely in focused PRs. Two of them need **your
external accounts** — flagged ⚠️.

DynamoDB convention in this repo: each table is `{ id: hashKey }` + a
`userId-index` GSI. Handlers use `db`, `ok`, `err`, `getUserFromEvent`,
`generateId`, `parseBody` from `functions/lib/utils.ts`. Routes are wired in
`sst.config.ts` via `api.route("METHOD /path", { handler, link: [...] })`.

---

## 1. Referral program (no external creds — buildable now)

**Design choice that avoids touching the Users table / new GSIs:** the
referral code **is the user's id** (already an opaque `generateId` string),
so `code → referrer` needs no lookup table.

**Schema** (`sst.config.ts`, add near the other tables):
```ts
const referrals = new sst.aws.Dynamo("Referrals", {
  fields: { id: "string", referrerUserId: "string" },
  primaryIndex: { hashKey: "id" },
  globalIndexes: { "referrerUserId-index": { hashKey: "referrerUserId" } },
});
```
- `registerLink = [users, jwtSecret, events, referrals, karmaTransactions]`
  (replace `authLink` on the **register** route only).
- `referralLink = [referrals, jwtSecret]` for the GET route.

**Backend:**
- `functions/data/referral.ts` — `GET /data/referral`: auth user → query
  `Referrals` by `referrerUserId-index = user.id`, return
  `{ code: user.id, count: items.length }`.
- `functions/auth/register.ts` — after the user `PutCommand`, if
  `body.refCode && body.refCode !== id`: write a `Referrals` row
  `{ id, referrerUserId: refCode, refereeUserId: id, createdAt }` and two
  `KarmaTransactions` rows (+100 each, `type: "referral"`). Wrap in
  try/catch so a referral failure never blocks signup.

**Frontend:**
- `src/app/(public)/refer/[code]/page.tsx` — client component: set
  `document.cookie = "vedic-ref=<code>; max-age=2592000; path=/"` then
  `router.replace("/register")`.
- Register form (`src/components/features/auth/login-form.tsx` register
  path) — read `vedic-ref` cookie, thread it through
  `auth-context.register(email, password, name, refCode?)` →
  `apiFetch("/auth/register", { body: { …, refCode } })`. Clear the cookie
  on success.
- "Invite friends" card on `src/app/(main)/settings/page.tsx`: `GET
  /data/referral`, show `https://10x.vedics.net/refer/<code>` + a
  `<ShareButton>` + "N friends joined · {N*100} karma earned".

**Abuse note:** v1 awards on signup. To harden, move the award to the
referee's first journey-start (in `journey.ts` POST `action:"start"`).

---

## 2. ⚠️ Email lifecycle (needs a verified SES sending domain)

**External step (you):** verify a domain in **AWS SES** (e.g. `mail.vedics.net`)
and request production access (SES starts in sandbox — can only send to
verified addresses until then).

**Schema/infra** (`sst.config.ts`):
```ts
const emailLog = new sst.aws.Dynamo("EmailLog", {
  fields: { id: "string", userId: "string" },
  primaryIndex: { hashKey: "id" },
  globalIndexes: { "userId-index": { hashKey: "userId" } },
});
// grant SES send to the email lambda link: add `sst.aws.permission` for ses:SendEmail
```
Add `"@aws-sdk/client-ses"` and `@react-email/components` to
`functions/package.json`.

**Backend:**
- `functions/lib/email.ts` — `sendEmail({to, subject, react})` via SES
  `SendEmailCommand`; render React Email to HTML; write an `EmailLog` row;
  include a signed unsubscribe token (`createToken({sub:userId, t:"unsub"})`).
- `functions/emails/*.tsx` — templates: `welcome`, `day3`, `day7`,
  `day14`, `day30`, `winback` (missed 3 days).
- Triggers: reuse the existing **SST crons** pattern (there are already
  `MorningPush`/`RecoveryPush` crons in `sst.config.ts`). Add an
  `EmailLifecycleCron` (daily) that scans journeys for users at day
  3/7/14/30 and sends the milestone email; and fold a win-back email into
  the existing `recovery-push.ts` logic.
- `GET /unsubscribe?token=…` public route → verify token, set
  `emailOptOut` on the user.

**Frontend:** an email-prefs toggle in `settings/page.tsx`.

---

## 3. ⚠️ Payments / subscription (needs a Razorpay account + keys)

**External step (you):** create a **Razorpay** account (India-first audience),
get `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET`, set them as SST secrets:
`npx sst secret set RazorpayKeyId …` / `RazorpayKeySecret …`.

**Product model (recommended default):** free 48-day core; **Premium**
(₹299/mo or ₹1,999/yr) unlocks: AI Vedic Guide unlimited, advanced
analytics/reports, the full mantra/poster library, and a karma-store
discount. Karma Shields already exist as a karma sink — keep them free-earned.

**Schema** (`sst.config.ts`):
```ts
const subscriptions = new sst.aws.Dynamo("Subscriptions", {
  fields: { id: "string", userId: "string" },
  primaryIndex: { hashKey: "id" },
  globalIndexes: { "userId-index": { hashKey: "userId" } },
});
const razorpayKeyId = new sst.Secret("RazorpayKeyId");
const razorpayKeySecret = new sst.Secret("RazorpayKeySecret");
```

**Backend:**
- `functions/data/billing-create-order.ts` — `POST /billing/order`: create a
  Razorpay subscription/order, return `orderId`.
- `functions/data/billing-webhook.ts` — `POST /billing/webhook` (public, no
  auth): verify Razorpay signature (HMAC of body with key secret), on
  `subscription.charged`/`activated` upsert a `Subscriptions` row
  `{ userId, status:"active", plan, currentPeriodEnd }`.
- `functions/lib/entitlement.ts` — `isPremium(userId)` helper used by gated
  routes.

**Frontend:**
- `src/app/(main)/upgrade/page.tsx` — pricing + Razorpay Checkout
  (`checkout.razorpay.com/v1/checkout.js`).
- Soft paywall component `src/components/features/billing/premium-gate.tsx`
  wrapping premium surfaces (AI guide beyond N msgs, advanced reports).
- "Buy shield with karma" already wired (`buy-shield.ts`); add a small karma
  **store** page listing shields + future cosmetic unlocks.

---

## 4. Cohorts / accountability (no external creds — medium)

**Schema:** `Cohorts` table `{ id, startDate }` + `CohortMembers`
`{ id, cohortId, userId }` with `cohortId-index` + `userId-index`.
- Onboarding step: "Join the next **New Moon cohort** (starts {date})" →
  assigns the user to the upcoming cohort.
- Dashboard banner: "412 yatris started Day 1 with you" (count cohort
  members). Reuse the existing **push** infra to send cohort-day pings.
- Later: opt-in **buddy match** (`FriendPairs` table) for daily check-in
  pressure (Duolingo Friend Streaks → +22% completion).

---

## 5. Authed-shell SSR refactor (no creds — large, do in isolation)

Currently `(main)/layout.tsx` is `"use client"` and gates the whole app on a
client `localStorage` check, so every authed route ships a ~1.4 MB client
shell and renders blank until hydration. **This is a high-regression-risk
refactor — give it its own PR + full manual QA pass.**

Plan: move auth to **Next.js middleware** (read the JWT from an httpOnly
cookie instead of localStorage), make `(main)/layout.tsx` a server
component, and convert the heaviest always-mounted widgets to RSC where
possible. Requires switching token storage from `localStorage` to an
httpOnly cookie set at login — touches `auth-context`, `api.ts`, and every
`apiFetch` caller, so it must be done deliberately, not rushed.

---

## Suggested order
1. **Referral** (buildable now, completes the viral loop).
2. **Cohorts** (completion lever; reuses push).
3. **Email** — once you verify the SES domain.
4. **Payments** — once you create Razorpay + set secrets.
5. **SSR refactor** — last, isolated, with QA.

Items 1–2 and 4–5 need no external input from anyone but the team; items 2-3
(email) and 4 (payments) need the two ⚠️ external accounts above.
