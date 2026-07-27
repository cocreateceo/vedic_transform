# 10x Vedic Cohort Registration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A public registration page for the free 10x Vedic live cohort (starts Monday, Aug 17, 2026; 48 days, ends Oct 3, 2026), storing registrations in DynamoDB with an admin list + CSV export.

**Architecture:** Follows the existing newsletter pattern exactly: a pure validation lib (unit-tested), a thin anonymous Lambda POST handler with an idempotent conditional PutCommand, a DynamoDB table declared in `sst.config.ts` with a `cohortId` GSI for the admin list, an admin GET handler gated by `getAdminFromEvent`, and Next.js pages in the `(public)` and `(main)/admin` route groups.

**Tech Stack:** Next.js App Router, SST v3 (`sst.aws.Dynamo`, `api.route`), `@aws-sdk/lib-dynamodb`, vitest, Tailwind, lucide-react.

## Global Constraints

- Cohort ID for this cohort is the literal string `2026-08`.
- Start date copy: "Monday, August 17, 2026". End date copy: "October 3, 2026". Duration copy: "48 days".
- The cohort is free — no payment anywhere.
- Handlers must NOT emit `Access-Control-Allow-*` headers (API Gateway handles CORS — see `functions/lib/utils.ts` comment).
- The honeypot field is named `website`; a non-empty value returns a **fake success** (`ok({ registered: true })`), never an error.
- Public page styling matches `src/app/(public)/10x-vedic/page.tsx`: navy hero `#0F172A`→`#1E293B`, saffron accents (`#E8860D`, orange/amber gradients), `SERIF_CLASS` headings, `#FFF9F0`/`#FFFEF5` light bands.
- Region and referral-source values are bounded server-side sets — unknown values collapse to `'unknown'`, never rejected.

---

### Task 1: Validation lib (TDD)

**Files:**
- Create: `functions/lib/class-registration.ts`
- Test: `functions/lib/class-registration.test.ts`

**Interfaces:**
- Consumes: `normalizeEmail` from `functions/lib/newsletter.ts` (`(raw: unknown) => string | null`).
- Produces (used by Tasks 2 and 3):
  - `COHORT_ID: string` — `'2026-08'`
  - `ALLOWED_REGIONS: readonly string[]`, `ALLOWED_SOURCES: readonly string[]` (exported so the form options and server stay in sync conceptually; form hardcodes labels but values must be from these sets)
  - `isSpam(body: any): boolean` — true when honeypot `website` is a non-empty string
  - `normalizeRegistration(body: any): { item: RegistrationItem } | { error: string }` where `RegistrationItem = { email: string; cohortId: string; name: string; phone: string | null; region: string; referralSource: string; status: 'registered' }`

- [ ] **Step 1: Write the failing test**

Create `functions/lib/class-registration.test.ts`:

```typescript
import { describe, expect, test } from "vitest";
import {
  COHORT_ID,
  isSpam,
  normalizeRegistration,
} from "./class-registration";

const valid = {
  name: "Asha Rao",
  email: "Asha@Example.com",
  phone: " +91 98765 43210 ",
  region: "india",
  source: "friend",
};

describe("isSpam", () => {
  test("empty or missing honeypot is not spam", () => {
    expect(isSpam({})).toBe(false);
    expect(isSpam({ website: "" })).toBe(false);
  });

  test("filled honeypot is spam", () => {
    expect(isSpam({ website: "https://spam.example" })).toBe(true);
  });
});

describe("normalizeRegistration", () => {
  test("valid body produces a full item", () => {
    const res = normalizeRegistration(valid);
    expect(res).toEqual({
      item: {
        email: "asha@example.com",
        cohortId: COHORT_ID,
        name: "Asha Rao",
        phone: "+91 98765 43210",
        region: "india",
        referralSource: "friend",
        status: "registered",
      },
    });
  });

  test("phone is optional and null when blank", () => {
    const res = normalizeRegistration({ ...valid, phone: "  " });
    expect("item" in res && res.item.phone).toBeNull();
  });

  test("missing or short name errors", () => {
    expect(normalizeRegistration({ ...valid, name: "" })).toEqual({
      error: "Please enter your name",
    });
    expect(normalizeRegistration({ ...valid, name: undefined })).toEqual({
      error: "Please enter your name",
    });
  });

  test("name is trimmed and capped at 100 chars", () => {
    const res = normalizeRegistration({ ...valid, name: `  ${"x".repeat(150)}  ` });
    expect("item" in res && res.item.name).toBe("x".repeat(100));
  });

  test("invalid email errors", () => {
    expect(normalizeRegistration({ ...valid, email: "nope" })).toEqual({
      error: "Please enter a valid email address",
    });
  });

  test("overlong phone errors", () => {
    expect(
      normalizeRegistration({ ...valid, phone: "9".repeat(31) }),
    ).toEqual({ error: "Please enter a valid phone number" });
  });

  test("unknown region and source collapse to 'unknown'", () => {
    const res = normalizeRegistration({
      ...valid,
      region: "mars",
      source: 42,
    });
    expect("item" in res && res.item.region).toBe("unknown");
    expect("item" in res && res.item.referralSource).toBe("unknown");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run functions/lib/class-registration.test.ts`
Expected: FAIL — cannot resolve `./class-registration`.

- [ ] **Step 3: Write the implementation**

Create `functions/lib/class-registration.ts`:

```typescript
// Pure validation/normalization for live-cohort registrations — kept out of
// the handler so it can be unit-tested without SST resource bindings.

import { normalizeEmail } from './newsletter';

export const COHORT_ID = '2026-08';

// Single "where are you joining from" dropdown — region+timezone combined.
// Bounded so a hostile client can't mint arbitrary analytics buckets.
export const ALLOWED_REGIONS = [
  'india',
  'us-eastern',
  'us-central',
  'us-pacific',
  'uk-europe',
  'middle-east',
  'southeast-asia',
  'australia-nz',
  'other',
] as const;

export const ALLOWED_SOURCES = [
  'friend',
  'social',
  'search',
  'email',
  'other',
] as const;

export interface RegistrationItem {
  email: string;
  cohortId: string;
  name: string;
  phone: string | null;
  region: string;
  referralSource: string;
  status: 'registered';
}

export function isSpam(body: any): boolean {
  return typeof body?.website === 'string' && body.website.trim().length > 0;
}

const PHONE_RE = /^[+\d][\d\s\-().]{4,29}$/;

export function normalizeRegistration(
  body: any,
): { item: RegistrationItem } | { error: string } {
  const name =
    typeof body?.name === 'string' ? body.name.trim().slice(0, 100) : '';
  if (!name) return { error: 'Please enter your name' };

  const email = normalizeEmail(body?.email);
  if (!email) return { error: 'Please enter a valid email address' };

  let phone: string | null = null;
  if (typeof body?.phone === 'string' && body.phone.trim()) {
    const trimmed = body.phone.trim();
    if (!PHONE_RE.test(trimmed))
      return { error: 'Please enter a valid phone number' };
    phone = trimmed;
  }

  const region = (ALLOWED_REGIONS as readonly string[]).includes(body?.region)
    ? body.region
    : 'unknown';
  const referralSource = (ALLOWED_SOURCES as readonly string[]).includes(
    body?.source,
  )
    ? body.source
    : 'unknown';

  return {
    item: {
      email,
      cohortId: COHORT_ID,
      name,
      phone,
      region,
      referralSource,
      status: 'registered',
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run functions/lib/class-registration.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add functions/lib/class-registration.ts functions/lib/class-registration.test.ts
git commit -m "feat(cohort): validation lib for live-cohort registration"
```

---

### Task 2: Public POST handler + SST table/route

**Files:**
- Create: `functions/data/class-registration.ts`
- Modify: `sst.config.ts` — table after the `NewsletterSubscribers` block (~line 327), route after the newsletter route block (~line 641)

**Interfaces:**
- Consumes: `isSpam`, `normalizeRegistration` from Task 1; `db, ok, err, CORS_HEADERS, parseBody` from `functions/lib/utils.ts`.
- Produces: `POST /class-registration` accepting JSON `{ name, email, phone?, region, source, website? }`, responding `{ registered: true }` on success/duplicate/honeypot, `{ error }` with 400 on validation failure. Linked SST table `ClassRegistrations` (PK `email`, SK `cohortId`, GSI `cohortId-index`).

- [ ] **Step 1: Write the handler**

Create `functions/data/class-registration.ts`:

```typescript
// Public registration for the 10x Vedic live cohort (free, no auth).
// POST /class-registration — mirrors the newsletter.ts pattern.

import { Resource } from 'sst';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS, parseBody } from '../lib/utils';
import { isSpam, normalizeRegistration } from '../lib/class-registration';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  if (event.requestContext?.http?.method !== 'POST')
    return err(405, 'Method not allowed');

  const body = parseBody(event);

  // Honeypot: pretend success so bots don't learn they were caught.
  if (isSpam(body)) return ok({ registered: true });

  const res = normalizeRegistration(body);
  if ('error' in res) return err(400, res.error);

  // email+cohortId is the primary key, so a double-submit is naturally
  // idempotent; the condition keeps the original registeredAt/source.
  try {
    await db.send(new PutCommand({
      TableName: Resource.ClassRegistrations.name,
      Item: { ...res.item, registeredAt: new Date().toISOString() },
      ConditionExpression:
        'attribute_not_exists(email) AND attribute_not_exists(cohortId)',
    }));
  } catch (e: any) {
    if (e?.name === 'ConditionalCheckFailedException') {
      // Already registered — treat as success so the form never leaks
      // whether an address is on the list.
      return ok({ registered: true });
    }
    throw e;
  }

  return ok({ registered: true });
}
```

- [ ] **Step 2: Declare the table in `sst.config.ts`**

Insert directly after the `NewsletterSubscribers` table block (after its closing `});` around line 327):

```typescript
    // Live-cohort class registrations (10x Vedic). email+cohortId PK makes
    // re-registration idempotent; the GSI serves the admin roster list.
    const classRegistrations = new sst.aws.Dynamo("ClassRegistrations", {
      fields: { email: "string", cohortId: "string" },
      primaryIndex: { hashKey: "email", rangeKey: "cohortId" },
      globalIndexes: {
        "cohortId-index": { hashKey: "cohortId" },
      },
    });
```

- [ ] **Step 3: Add the route in `sst.config.ts`**

Insert directly after the newsletter route block (after `});` around line 641):

```typescript
    // ── Live-cohort registration (public, no auth) ──────────────
    api.route("POST /class-registration", {
      handler: "functions/data/class-registration.handler",
      link: [classRegistrations],
    });
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: exits 0 — note `Resource.ClassRegistrations` only typechecks after `sst-env.d.ts` regenerates on dev/deploy; if tsc complains ONLY about `Resource.ClassRegistrations`, that is expected pre-deploy and acceptable (same as every new table in this repo).

- [ ] **Step 5: Commit**

```bash
git add functions/data/class-registration.ts sst.config.ts
git commit -m "feat(cohort): public registration endpoint + ClassRegistrations table"
```

---

### Task 3: Public registration page

**Files:**
- Create: `src/app/(public)/10x-vedic/register/page.tsx`
- Create: `src/app/(public)/10x-vedic/register/registration-form.tsx`

**Interfaces:**
- Consumes: `apiFetch` from `src/lib/api.ts` (`(path, options) => Promise<any>`, throws `ApiError` with `.message`); `pageMetadata` from `src/lib/seo.ts`; `SERIF_CLASS` from `src/lib/fonts.ts`. POSTs to `/class-registration` (Task 2 contract).
- Produces: route `/10x-vedic/register`.

- [ ] **Step 1: Create the server page**

Create `src/app/(public)/10x-vedic/register/page.tsx`:

```tsx
import { CalendarDays, GraduationCap, Users, Sparkles } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { SERIF_CLASS } from "@/lib/fonts";
import { RegistrationForm } from "./registration-form";

export const metadata = pageMetadata({
  title: "Register — 10x Vedic Live Cohort",
  description:
    "Register free for the 10x Vedic live cohort — a guided 48-day, 11-chapter training starting Monday, August 17, 2026.",
  path: "/10x-vedic/register",
});

const HIGHLIGHTS = [
  {
    icon: CalendarDays,
    title: "48 days, live",
    text: "Monday, August 17 — October 3, 2026. A guided cohort, not a solo course.",
  },
  {
    icon: GraduationCap,
    title: "11 chapters",
    text: "The full 10x Vedic framework — consciousness, health, relationships, leadership, wealth.",
  },
  {
    icon: Users,
    title: "Community",
    text: "Walk the 48 days with fellow seekers and live Q&A along the way.",
  },
] as const;

export default function CohortRegisterPage() {
  return (
    <div className="text-[#1a1a1a]">
      {/* ═══ Hero (navy band, matches /10x-vedic) ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            Free live cohort — starts Monday, August 17, 2026
          </span>
          <h1 className={`mt-6 text-4xl sm:text-5xl font-semibold leading-tight text-white ${SERIF_CLASS}`}>
            Register for the{" "}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              10x Vedic
            </span>{" "}
            Live Cohort
          </h1>
          <p className="mt-4 text-lg text-[#94a3b8] max-w-xl mx-auto leading-relaxed">
            A guided 48-day, 11-chapter training on living and leading from
            higher awareness. Free — all you need is an email address.
          </p>
        </div>
      </section>

      {/* ═══ What you get ═══ */}
      <section className="py-14 bg-[#FFFEF5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-4">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm p-5"
            >
              <Icon className="w-5 h-5 text-[#E8860D]" />
              <h2 className="mt-3 text-sm font-semibold">{title}</h2>
              <p className="mt-1 text-xs text-[#64748b] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Registration form ═══ */}
      <section className="py-16 bg-[#FFF9F0]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-semibold text-center mb-2 ${SERIF_CLASS}`}>
            Reserve your <span className="text-[#E8860D]">seat</span>
          </h2>
          <p className="text-sm text-[#64748b] text-center mb-8">
            We&rsquo;ll email you joining details before the cohort begins.
          </p>
          <RegistrationForm />
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Create the client form**

Create `src/app/(public)/10x-vedic/register/registration-form.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

const REGIONS = [
  { value: "india", label: "India (IST)" },
  { value: "us-eastern", label: "US — Eastern" },
  { value: "us-central", label: "US — Central" },
  { value: "us-pacific", label: "US — Pacific / Mountain" },
  { value: "uk-europe", label: "UK / Europe" },
  { value: "middle-east", label: "Middle East (Gulf)" },
  { value: "southeast-asia", label: "Southeast Asia / Singapore" },
  { value: "australia-nz", label: "Australia / New Zealand" },
  { value: "other", label: "Other" },
];

const SOURCES = [
  { value: "friend", label: "A friend or colleague" },
  { value: "social", label: "Social media" },
  { value: "search", label: "Search engine" },
  { value: "email", label: "Email / newsletter" },
  { value: "other", label: "Other" },
];

const inputClass =
  "w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm";

export function RegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [source, setSource] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — humans never see it
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Please enter your name");
    if (!email.trim()) return setError("Please enter your email address");
    setSubmitting(true);
    try {
      await apiFetch("/class-registration", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, region, source, website }),
      });
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong — please try again");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm p-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
        <h3 className="mt-4 text-lg font-semibold">You&rsquo;re in!</h3>
        <p className="mt-2 text-sm text-[#64748b] leading-relaxed">
          The cohort starts Monday, August 17, 2026. We&rsquo;ll email you the
          joining details before we begin.
        </p>
        <p className="mt-4 text-sm text-[#64748b]">
          Meanwhile, you can start the free self-paced course today:
        </p>
        <Link
          href="/register"
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all"
        >
          Explore the course <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm p-6 sm:p-8 space-y-4"
    >
      <div>
        <label htmlFor="reg-name" className="block text-xs font-medium text-[#64748b] mb-1">
          Full name *
        </label>
        <input
          id="reg-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="reg-email" className="block text-xs font-medium text-[#64748b] mb-1">
          Email address *
        </label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="reg-phone" className="block text-xs font-medium text-[#64748b] mb-1">
          Phone (optional, with country code)
        </label>
        <input
          id="reg-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={30}
          placeholder="+91 98765 43210"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="reg-region" className="block text-xs font-medium text-[#64748b] mb-1">
          Where will you join from?
        </label>
        <select
          id="reg-region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className={inputClass}
        >
          <option value="">Select a region…</option>
          {REGIONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="reg-source" className="block text-xs font-medium text-[#64748b] mb-1">
          How did you hear about us?
        </label>
        <select
          id="reg-source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className={inputClass}
        >
          <option value="">Select one…</option>
          {SOURCES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Honeypot — hidden from humans, tempting to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="reg-website">Website</label>
        <input
          id="reg-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Registering…
          </>
        ) : (
          <>
            Register free <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
      <p className="text-[11px] text-[#94a3b8] text-center">
        Free forever. No payment details asked — ever.
      </p>
    </form>
  );
}
```

- [ ] **Step 3: Typecheck + lint**

Run: `npx tsc --noEmit` and `npx next lint --dir src/app/(public)/10x-vedic` (or `npx eslint "src/app/(public)/10x-vedic/**"` if `next lint` is not configured).
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(public)/10x-vedic/register"
git commit -m "feat(cohort): public registration page for the live cohort"
```

---

### Task 4: Admin endpoint + admin roster page with CSV export

**Files:**
- Create: `functions/data/admin-class-registrations.ts`
- Modify: `sst.config.ts` — add route after the two `GET /admin/users` routes (~line 407)
- Create: `src/app/(main)/admin/class-registrations/page.tsx`
- Modify: `src/app/(main)/admin/page.tsx` — add a nav link to the roster

**Interfaces:**
- Consumes: `getAdminFromEvent` from `functions/lib/admin.ts` (`(event) => Promise<AdminContext | null>`); `COHORT_ID` from Task 1; GSI `cohortId-index` from Task 2; `apiFetch`, `useAuth` on the frontend (same as `admin/page.tsx`).
- Produces: `GET /admin/class-registrations` → `{ registrations: RegistrationRow[], total: number }` where `RegistrationRow = { email, cohortId, name, phone, region, referralSource, registeredAt, status }`, sorted newest-first.

- [ ] **Step 1: Write the admin handler**

Create `functions/data/admin-class-registrations.ts`:

```typescript
// Admin roster for live-cohort registrations.
// GET /admin/class-registrations — list registrants for the current cohort.
// Auth: requires Users.role === 'admin'. See functions/lib/admin.ts.

import { Resource } from 'sst';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { db, ok, err, CORS_HEADERS } from '../lib/utils';
import { getAdminFromEvent } from '../lib/admin';
import { COHORT_ID } from '../lib/class-registration';

export async function handler(event: any) {
  if (event.requestContext?.http?.method === 'OPTIONS')
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };

  const admin = await getAdminFromEvent(event);
  if (!admin) return err(401, 'Unauthorized');

  if (event.requestContext?.http?.method !== 'GET')
    return err(405, 'Method not allowed');

  const cohortId = event.queryStringParameters?.cohortId || COHORT_ID;

  // Paginate the GSI query fully — a cohort roster is small (hundreds).
  const items: any[] = [];
  let lastKey: Record<string, any> | undefined;
  do {
    const page = await db.send(new QueryCommand({
      TableName: Resource.ClassRegistrations.name,
      IndexName: 'cohortId-index',
      KeyConditionExpression: 'cohortId = :c',
      ExpressionAttributeValues: { ':c': cohortId },
      ExclusiveStartKey: lastKey,
    }));
    items.push(...(page.Items || []));
    lastKey = page.LastEvaluatedKey;
  } while (lastKey);

  items.sort((a, b) =>
    String(b.registeredAt || '').localeCompare(String(a.registeredAt || '')),
  );

  return ok({ registrations: items, total: items.length });
}
```

- [ ] **Step 2: Add the route in `sst.config.ts`**

Insert after the `GET /admin/users/{userId}` route block (~line 407):

```typescript
    api.route("GET /admin/class-registrations", {
      handler: "functions/data/admin-class-registrations.handler",
      link: [users, jwtSecret, classRegistrations],
    });
```

Note: `classRegistrations` (Task 2) must be declared ABOVE this line in the file — table declarations sit in the tables section (~line 327), routes come later, so ordering is already satisfied.

- [ ] **Step 3: Create the admin roster page**

Create `src/app/(main)/admin/class-registrations/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Download, GraduationCap } from "lucide-react";

interface RegistrationRow {
  email: string;
  cohortId: string;
  name?: string;
  phone?: string | null;
  region?: string;
  referralSource?: string;
  registeredAt?: string;
  status?: string;
}

function toCsv(rows: RegistrationRow[]): string {
  const cols = ["name", "email", "phone", "region", "referralSource", "registeredAt"] as const;
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [
    cols.join(","),
    ...rows.map((r) => cols.map((c) => esc(r[c])).join(",")),
  ].join("\n");
}

export default function AdminClassRegistrationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Client-side gate. The Lambda also enforces this — this just avoids a
  // confusing 401 flash for non-admin users who somehow navigate here.
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if ((user as { role?: string }).role !== "admin") {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    let alive = true;
    apiFetch("/admin/class-registrations")
      .then((res) => {
        if (!alive) return;
        setRows(res?.registrations ?? []);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message ?? "Failed to load registrations");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  function exportCsv() {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "10x-vedic-cohort-2026-08-registrations.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Cohort registrations
            </h1>
            <p className="text-sm text-gray-500">
              10x Vedic live cohort — August 2026.{" "}
              {loading ? "Loading…" : `${rows.length} registered.`}
            </p>
          </div>
        </div>
        <button
          onClick={exportCsv}
          disabled={loading || rows.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {error && (
        <Card>
          <CardContent className="p-4 text-sm text-red-600">{error}</CardContent>
        </Card>
      )}

      {!error && !loading && rows.length === 0 && (
        <Card>
          <CardContent className="p-6 text-sm text-gray-500 text-center">
            No registrations yet.
          </CardContent>
        </Card>
      )}

      {rows.length > 0 && (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Region</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Registered</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={`${r.email}-${r.cohortId}`} className="border-b border-gray-50">
                    <td className="px-4 py-3 font-medium">{r.name || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{r.email}</td>
                    <td className="px-4 py-3 text-gray-600">{r.phone || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{r.region || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{r.referralSource || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {r.registeredAt ? new Date(r.registeredAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Link the roster from the admin landing page**

In `src/app/(main)/admin/page.tsx`, add below the search `Card` (after the closing `</Card>` of the search block, before the `<div>` holding the results heading):

```tsx
      <Link href="/admin/class-registrations" className="block">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-[var(--color-text-primary)]">
                Cohort registrations
              </p>
              <p className="text-xs text-gray-500">
                10x Vedic live cohort roster + CSV export
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
          </CardContent>
        </Card>
      </Link>
```

(`Link`, `Card`, `CardContent`, `ChevronRight` are already imported in that file.)

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors beyond the pre-deploy `Resource.ClassRegistrations` note from Task 2 Step 4.

- [ ] **Step 6: Commit**

```bash
git add functions/data/admin-class-registrations.ts sst.config.ts "src/app/(main)/admin"
git commit -m "feat(cohort): admin roster endpoint + page with CSV export"
```

---

### Task 5: Point 10x Vedic page CTAs at the cohort registration

**Files:**
- Modify: `src/app/(public)/10x-vedic/page.tsx:62` (hero CTA) and `:162` (closing CTA)

**Interfaces:**
- Consumes: route `/10x-vedic/register` from Task 3.

- [ ] **Step 1: Update the hero CTA**

In `src/app/(public)/10x-vedic/page.tsx`, change the hero primary CTA (currently `href="/register"` with text "Start the course") to:

```tsx
            <Link
              href="/10x-vedic/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all"
            >
              Join the live cohort <ArrowRight className="w-4 h-4" />
            </Link>
```

And change the hero sub-caption `Free with an account — all you need is an email address.` to:

```tsx
          <p className="mt-4 text-xs text-[#94a3b8]">
            Free live cohort starts Monday, August 17, 2026 — or start the{" "}
            <Link href="/register" className="underline hover:text-white">
              self-paced course
            </Link>{" "}
            anytime.
          </p>
```

- [ ] **Step 2: Update the closing CTA**

Change the closing-band CTA (currently `href="/register"`, text "Begin your journey") to `href="/10x-vedic/register"` with text `Join the live cohort` (keep the same className and `ArrowRight`).

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit` — expected clean (modulo the pre-deploy Resource note).

```bash
git add "src/app/(public)/10x-vedic/page.tsx"
git commit -m "feat(cohort): point 10x Vedic CTAs at live-cohort registration"
```

---

### Task 6: Full test run, build, and visual verification

**Files:** none new.

- [ ] **Step 1: Run the whole test suite**

Run: `npx vitest run`
Expected: all tests pass, including the 8 new class-registration tests.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds; `/10x-vedic/register` appears in the route list.

- [ ] **Step 3: Visual verification**

Use the project's `verify` skill to screenshot `/10x-vedic/register` (empty form, validation error, and — if the API isn't running locally, at least the form render) and `/10x-vedic` (updated CTAs). Confirm styling matches the program page.

- [ ] **Step 4: Commit any fixes surfaced by build/verify**

```bash
git add -A "src" "functions" "sst.config.ts"
git commit -m "fix(cohort): build/verify fixes for cohort registration"
```

(Skip if nothing changed.)

**Deploy note (user-run):** registrations only work in production after `npx sst deploy` (creates the `ClassRegistrations` table, the two routes, and regenerates `sst-env.d.ts`). If deploy hits the pulumi "Access is denied" error, delete `%APPDATA%\sst\bin\pulumi*.exe` and retry.
