// Headless click-through of every pillar reflection on production.
// Usage:
//   1. Log in to https://10x.vedics.net in a real browser.
//   2. DevTools → Application → Local Storage → https://10x.vedics.net
//      → copy the value of `vedic-token`.
//   3. Write .env.e2e at the repo root with:
//        VEDIC_TOKEN=...the token you copied...
//        BASE_URL=https://10x.vedics.net   # optional, this is the default
//   4. node scripts/e2e-pillars.mjs
//
// Output: per-pillar PASS/FAIL with a screenshot per pillar in test-results/.

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

// Minimal .env.e2e loader — no dotenv dep.
const envPath = path.resolve(".env.e2e");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
    }
  }
}

const BASE_URL = process.env.BASE_URL || "https://10x.vedics.net";
const API_URL =
  process.env.API_URL || "https://sav5ro38xi.execute-api.us-east-1.amazonaws.com";
const TOKEN = process.env.VEDIC_TOKEN;
if (!TOKEN) {
  console.error("Missing VEDIC_TOKEN. See header of this script.");
  process.exit(1);
}

// AuthContext requires BOTH `vedic-token` AND `vedic-user` in localStorage;
// either alone leaves user=null and AuthGuard redirects to /login. Fetch
// the full user object from /auth/me up front so we can inject both.
async function fetchUser() {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) {
    console.error(`/auth/me returned ${res.status}; token may be invalid.`);
    process.exit(2);
  }
  const data = await res.json();
  return data.user;
}

// Pillars and the surface each one shows. The four custom-surface pillars
// have their own intro elements; the rest go straight to the shared yes/no
// reflection. Gratitude is text-entry, handled separately below.
const YESNO_PILLARS = [
  "morning-initiation",
  "nutrition-fasting",
  "breathing-meditation",
  "thoughts-intention",
  "movement",
  "healing-meditation",
  "sandhya-meditation",
  "brahman-connection",
  "divine-manifestation",
  "sleep-optimization",
];

const OUT_DIR = path.resolve("test-results");
fs.mkdirSync(OUT_DIR, { recursive: true });

const results = [];

async function clearLocalStorageReflections(page) {
  // Wipe any prior day's answers so the test always sees the question card,
  // not a stale summary card.
  await page.evaluate(() => {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (
        k &&
        (k.startsWith("pillar-reflection-") ||
          k.startsWith("morning-checklist-") ||
          k.startsWith("nutrition-reflection-") ||
          k.startsWith("breathing-reflection-"))
      ) {
        localStorage.removeItem(k);
      }
    }
  });
}

async function runYesNoPillar(page, slug) {
  const url = `${BASE_URL}/pillars/${slug}/`;
  const startedAt = Date.now();
  const notes = [];
  let ok = false;

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await clearLocalStorageReflections(page);
    await page.reload({ waitUntil: "domcontentloaded" });

    // The pillar may take a moment to fetch /data/checkin + /data/journey.
    // Wait for the "Step 1 of N" header — distinctive to the reflection card.
    await page
      .locator('text=/Step \\d+ of \\d+/i')
      .first()
      .waitFor({ timeout: 15000 });

    // Walk through every step. For gated steps the Yes button stays
    // disabled until the practice completes — so we click "Not today"
    // (which always works) when Yes is disabled, and Yes otherwise.
    // Either path advances us; both prove the page renders, the gate
    // logic is wired correctly, and the answers persist.
    let yesCount = 0;
    let noCount = 0;
    for (let step = 0; step < 15; step++) {
      const yesBtn = page.getByRole("button", { name: /Yes, I did/i }).first();
      const noBtn = page.getByRole("button", { name: /Not today/i }).first();
      const yesVisible = await yesBtn.isVisible().catch(() => false);
      const noVisible = await noBtn.isVisible().catch(() => false);

      if (yesVisible || noVisible) {
        const yesDisabled = yesVisible
          ? await yesBtn.isDisabled().catch(() => false)
          : true;
        if (yesVisible && !yesDisabled) {
          await yesBtn.click();
          yesCount++;
        } else if (noVisible) {
          await noBtn.click();
          noCount++;
        }
        const next = page
          .getByRole("button", { name: /Next reflection|See today's summary/i })
          .first();
        await next.waitFor({ timeout: 5000 });
        await next.click();
      }

      const startOver = page
        .getByRole("button", { name: /Start over/i })
        .first();
      if (await startOver.isVisible().catch(() => false)) {
        ok = true;
        notes.push(
          `summary after ${step + 1} steps (${yesCount} yes, ${noCount} no)`,
        );
        break;
      }
    }
    if (!ok) notes.push("never reached summary card");
  } catch (e) {
    notes.push(`error: ${e.message?.split("\n")[0]}`);
  }

  const screenshotPath = path.join(OUT_DIR, `${slug}.png`);
  await page
    .screenshot({ path: screenshotPath, fullPage: true })
    .catch(() => {});

  results.push({
    slug,
    ok,
    elapsedMs: Date.now() - startedAt,
    notes: notes.join("; "),
    screenshot: screenshotPath,
  });
}

async function runGratitude(page) {
  const slug = "gratitude";
  const url = `${BASE_URL}/pillars/${slug}/`;
  const startedAt = Date.now();
  const notes = [];
  let ok = false;
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    // Gratitude uses text entry — Step 1 textarea then "Save reflection".
    await page
      .locator('text=/Step \\d+ of \\d+/i')
      .first()
      .waitFor({ timeout: 15000 });

    for (let step = 0; step < 5; step++) {
      const textarea = page.locator("textarea").first();
      if (await textarea.isVisible().catch(() => false)) {
        await textarea.fill(`E2E test entry for step ${step + 1}`);
        const save = page
          .getByRole("button", { name: /Save reflection/i })
          .first();
        await save.click();
        const next = page
          .getByRole("button", { name: /Next reflection|See today's reflection/i })
          .first();
        await next.waitFor({ timeout: 5000 });
        await next.click();
      }
      const startOver = page
        .getByRole("button", { name: /Start over/i })
        .first();
      if (await startOver.isVisible().catch(() => false)) {
        ok = true;
        notes.push(`reached summary after ${step + 1} steps`);
        break;
      }
    }
    if (!ok) notes.push("never reached gratitude summary");
  } catch (e) {
    notes.push(`error: ${e.message?.split("\n")[0]}`);
  }

  const screenshotPath = path.join(OUT_DIR, `${slug}.png`);
  await page
    .screenshot({ path: screenshotPath, fullPage: true })
    .catch(() => {});

  results.push({
    slug,
    ok,
    elapsedMs: Date.now() - startedAt,
    notes: notes.join("; "),
    screenshot: screenshotPath,
  });
}

(async () => {
  const user = await fetchUser();
  console.log(`Authed as ${user.email} (onboarded=${user.onboardingCompleted})`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

  // Inject both the bearer token AND the cached user object that the
  // AuthContext expects to find in localStorage. Without `vedic-user`
  // the context decides we're logged out before /auth/me even fires.
  await context.addInitScript(
    ({ token, user }) => {
      window.localStorage.setItem("vedic-token", token);
      window.localStorage.setItem("vedic-user", JSON.stringify(user));
    },
    { token: TOKEN, user },
  );

  const page = await context.newPage();

  // Sanity check: home should not redirect to /login.
  await page.goto(`${BASE_URL}/dashboard/`, { waitUntil: "domcontentloaded" });
  const url = page.url();
  if (url.includes("/login") || url.includes("/auth")) {
    console.error(`Token rejected — landed on ${url}. Re-grab vedic-token.`);
    await browser.close();
    process.exit(2);
  }

  for (const slug of YESNO_PILLARS) {
    process.stdout.write(`→ ${slug} … `);
    await runYesNoPillar(page, slug);
    const r = results[results.length - 1];
    console.log(`${r.ok ? "PASS" : "FAIL"} (${r.elapsedMs}ms) ${r.notes}`);
  }
  process.stdout.write(`→ gratitude … `);
  await runGratitude(page);
  const g = results[results.length - 1];
  console.log(`${g.ok ? "PASS" : "FAIL"} (${g.elapsedMs}ms) ${g.notes}`);

  await browser.close();

  console.log("\n=== summary ===");
  for (const r of results) {
    console.log(`  ${r.ok ? "✓" : "✗"} ${r.slug.padEnd(24)} ${r.notes}`);
  }
  const passed = results.filter((r) => r.ok).length;
  console.log(`\n${passed}/${results.length} pillars PASS`);
  console.log(`Screenshots: ${OUT_DIR}`);
  process.exit(passed === results.length ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(2);
});
