# 10x Vedic Live Cohort — Registration Page (Design)

Date: 2026-07-27
Status: Approved

## Goal

A public online registration page for the live cohort of the existing **10x Vedic**
48-day / 11-chapter training program. The cohort starts **Monday, Aug 17, 2026**
(ends Oct 3, 2026) and is **free**. Registrations are stored in the app's own
backend and visible in the admin area.

## Scope

### 1. Public registration page — `/10x-vedic/register`

`src/app/(public)/10x-vedic/register/page.tsx`, styled to match the existing
10x Vedic page (saffron palette, same layout language).

- Hero: "Register for the 10x Vedic Live Cohort" — starts Monday, Aug 17, 2026,
  48 days, 11 chapters, free.
- "What you get" strip reusing copy from the program page (live guided cohort,
  48-day framework, community).
- Registration form:
  - Name (required)
  - Email (required, validated)
  - Phone (optional)
  - Country/Timezone (dropdown)
  - "How did you hear about us?" (dropdown)
  - Hidden honeypot field for spam bots.
- On success, the form is replaced by a confirmation panel: "You're in — the
  cohort starts Aug 17. We'll email you joining details." with a link to the
  free course content.

### 2. Backend — anonymous endpoint + table

- `functions/data/class-registration.ts`, modeled on `functions/data/newsletter.ts`:
  POST-only, CORS/OPTIONS handling, normalizes email, validates fields,
  rejects submissions with a filled honeypot (return success to avoid tipping
  off bots).
- New DynamoDB table `ClassRegistrations` in `sst.config.ts`:
  - Partition key: `email`; sort key: `cohortId` (e.g. `"2026-08"`).
  - Double-submit is idempotent — first registration's `registeredAt` and
    `referralSource` are preserved (conditional put, same as newsletter).
  - Attributes: `name`, `phone`, `country`, `timezone`, `referralSource`,
    `registeredAt`, `status` (`registered`).
- API route wired in `sst.config.ts` (public POST; authenticated GET for admin).

### 3. Admin view — `/admin/class-registrations`

- Same auth gating as existing `/admin` pages.
- Table of registrants: name, email, phone, country, source, date.
- Total count and an **Export CSV** button.
- Backed by an authenticated GET handler querying by `cohortId`.

### 4. Wire-up

- The "Register" CTAs on `src/app/(public)/10x-vedic/page.tsx` change from
  `/register` to `/10x-vedic/register`.

### 5. Testing & verification

- Vitest unit tests for the Lambda handler: field validation, idempotency,
  honeypot rejection.
- Visual verification of the page via the project's `verify` skill.
- Deploy via SST when the user is ready.

## Out of scope (fast-follows)

- Confirmation email to the registrant.
- Seat caps / waitlist.
- Payment.
