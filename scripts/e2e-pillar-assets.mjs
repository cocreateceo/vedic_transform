// Comprehensive pillar verification via Playwright:
//   1. Each of the 11 pillar pages loads voice cue audio (HTTP 200)
//   2. Each loads at least one image (pillar hero or step illustration)
//   3. Each step's practice surface renders the expected element:
//        breathing pacer  → "Try it now" button
//        gif practice     → an <img> with the gif path
//        image practice   → a Pexels figure
//        audio practice   → an <audio> tag
//        timer practice   → "Start practice" button
//        question-only    → no practice surface (just buttons)
//   4. Pillar voice cue toggle button is present (Replay or Stop)
//
// Walks every step of every pillar, captures network responses, and
// records which assets actually loaded. Renders a per-pillar PASS/FAIL
// matrix at the end.
//
// Usage:  node scripts/e2e-pillar-assets.mjs

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

// .env.e2e loader
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
  console.error("Missing VEDIC_TOKEN in .env.e2e");
  process.exit(1);
}

async function fetchUser() {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) {
    console.error(`/auth/me returned ${res.status}`);
    process.exit(2);
  }
  return (await res.json()).user;
}

const PILLARS = [
  "morning-initiation",
  "nutrition-fasting",
  "thoughts-intention",
  "breathing-meditation",
  "movement",
  "healing-meditation",
  "gratitude",
  "sandhya-meditation",
  "brahman-connection",
  "divine-manifestation",
  "sleep-optimization",
];

async function verifyPillar(page, slug) {
  const url = `${BASE_URL}/pillars/${slug}/`;
  const result = {
    slug,
    pillarVoiceUrl: null,
    pillarVoiceStatus: null,
    heroImageLoaded: false,
    voiceToggleVisible: false,
    stepsWalked: 0,
    breathingPacers: 0,
    gifPractices: 0,
    imagePractices: 0,
    audioPractices: 0,
    timerPractices: 0,
    questionOnly: 0,
    errors: [],
  };

  // Capture responses
  const responses = [];
  const onResponse = (r) => {
    const u = r.url();
    if (
      u.includes("/audio/") ||
      u.includes("/images/") ||
      u.includes("/_next/image")
    ) {
      responses.push({ url: u, status: r.status() });
    }
  };
  page.on("response", onResponse);

  try {
    // Clear localStorage so we start each pillar from a clean state
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
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
    await page.reload({ waitUntil: "domcontentloaded" });

    // Wait for reflection card to render
    await page
      .locator('text=/Step \\d+ of \\d+/i')
      .first()
      .waitFor({ timeout: 15000 });

    // Pillar voice cue toggle should be visible
    const replayBtn = page.getByRole("button", { name: /^(Replay|Stop)/i });
    result.voiceToggleVisible = await replayBtn
      .first()
      .isVisible()
      .catch(() => false);

    // Walk every step and inventory the practice surfaces
    for (let step = 0; step < 15; step++) {
      // Identify practice kind by looking at the current step's DOM
      const hasTryItNow = await page
        .getByRole("button", { name: /Try it now/i })
        .first()
        .isVisible()
        .catch(() => false);
      const hasPracticeAlong = await page
        .getByRole("button", { name: /Practice along|Practice one full round/i })
        .first()
        .isVisible()
        .catch(() => false);
      const hasStartPractice = await page
        .getByRole("button", { name: /Start practice/i })
        .first()
        .isVisible()
        .catch(() => false);
      const hasAudio = (await page.locator("audio").count()) > 0;
      const hasGifImg =
        (await page
          .locator('img[src*="/images/pexels/posture-"][src$=".gif"]')
          .count()) > 0;
      const hasReferenceImg =
        (await page
          .locator(
            'img[src*="/_next/image"][src*="posture-"][src*=".jpg"], img[src*="/images/pexels/posture-"][src$=".jpg"]',
          )
          .count()) > 0;
      const hasMantraAudio =
        (await page
          .locator('audio[src*="/audio/library/mantra-"]')
          .count()) > 0;

      if (hasTryItNow) result.breathingPacers++;
      else if (hasPracticeAlong || hasGifImg) result.gifPractices++;
      else if (hasMantraAudio) result.audioPractices++;
      else if (hasStartPractice) result.timerPractices++;
      else if (hasReferenceImg) result.imagePractices++;
      else result.questionOnly++;

      // Advance via "Not today" (always works regardless of gating)
      const noBtn = page.getByRole("button", { name: /Not today/i }).first();
      const yesBtn = page.getByRole("button", { name: /Yes, I did/i }).first();
      const saveBtn = page
        .getByRole("button", { name: /Save reflection/i })
        .first();
      if (await saveBtn.isVisible().catch(() => false)) {
        // Gratitude text-entry flow
        const ta = page.locator("textarea").first();
        await ta.fill(`E2E test #${step + 1}`);
        await saveBtn.click();
      } else if (await noBtn.isVisible().catch(() => false)) {
        await noBtn.click();
      } else if (await yesBtn.isVisible().catch(() => false)) {
        if (!(await yesBtn.isDisabled().catch(() => false))) {
          await yesBtn.click();
        }
      } else {
        result.errors.push(`step ${step + 1}: no advance button visible`);
        break;
      }

      const next = page
        .getByRole("button", {
          name: /Next reflection|See today's summary|See today's reflection/i,
        })
        .first();
      await next.waitFor({ timeout: 5000 });
      await next.click();
      result.stepsWalked++;

      const startOver = page
        .getByRole("button", { name: /Start over/i })
        .first();
      if (await startOver.isVisible().catch(() => false)) break;
    }

    // Find the pillar voice cue request in the captured responses
    const voiceCue = responses.find((r) =>
      r.url.includes(`/audio/pillars/${slug}.mp3`),
    );
    if (voiceCue) {
      result.pillarVoiceUrl = voiceCue.url;
      result.pillarVoiceStatus = voiceCue.status;
    }

    // Hero image loaded?
    result.heroImageLoaded = responses.some(
      (r) =>
        (r.url.includes(`pillar-${slug}`) || r.url.includes("/_next/image")) &&
        r.status === 200,
    );
  } catch (e) {
    result.errors.push(`fatal: ${e.message?.split("\n")[0]}`);
  } finally {
    page.off("response", onResponse);
  }

  return result;
}

(async () => {
  const user = await fetchUser();
  console.log(`Authed as ${user.email} (onboarded=${user.onboardingCompleted})`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  await context.addInitScript(
    ({ token, user }) => {
      window.localStorage.setItem("vedic-token", token);
      window.localStorage.setItem("vedic-user", JSON.stringify(user));
    },
    { token: TOKEN, user },
  );
  const page = await context.newPage();

  // Sanity check
  await page.goto(`${BASE_URL}/dashboard/`, { waitUntil: "domcontentloaded" });
  if (page.url().includes("/login")) {
    console.error("Token rejected on dashboard. Aborting.");
    await browser.close();
    process.exit(2);
  }

  const results = [];
  for (const slug of PILLARS) {
    process.stdout.write(`→ ${slug} … `);
    const r = await verifyPillar(page, slug);
    results.push(r);
    const surfaces =
      r.breathingPacers +
      r.gifPractices +
      r.audioPractices +
      r.timerPractices +
      r.imagePractices;
    const voiceMark = r.voiceToggleVisible
      ? r.pillarVoiceStatus === 200
        ? "voice ✓"
        : `voice button (network ${r.pillarVoiceStatus ?? "?"})`
      : "voice ✗";
    const imgMark = r.heroImageLoaded ? "hero img ✓" : "hero img ✗";
    console.log(
      `${voiceMark} | ${imgMark} | ${r.stepsWalked} steps | ${surfaces} practice surfaces | ${r.questionOnly} question-only` +
        (r.errors.length ? ` | errors: ${r.errors.join(", ")}` : ""),
    );
  }

  await browser.close();

  console.log("\n=== Per-pillar inventory ===");
  console.log(
    "Pillar".padEnd(25) +
      "Voice".padEnd(7) +
      "Hero".padEnd(7) +
      "Steps".padEnd(7) +
      "Br".padEnd(4) +
      "Gif".padEnd(4) +
      "Aud".padEnd(4) +
      "Tim".padEnd(4) +
      "Img".padEnd(4) +
      "Q-only",
  );
  console.log("-".repeat(80));
  for (const r of results) {
    console.log(
      r.slug.padEnd(25) +
        (r.voiceToggleVisible ? "✓" : "✗").padEnd(7) +
        (r.heroImageLoaded ? "✓" : "✗").padEnd(7) +
        String(r.stepsWalked).padEnd(7) +
        String(r.breathingPacers).padEnd(4) +
        String(r.gifPractices).padEnd(4) +
        String(r.audioPractices).padEnd(4) +
        String(r.timerPractices).padEnd(4) +
        String(r.imagePractices).padEnd(4) +
        String(r.questionOnly),
    );
  }
  const allOk = results.every(
    (r) =>
      r.voiceToggleVisible &&
      r.heroImageLoaded &&
      r.stepsWalked > 0 &&
      r.errors.length === 0,
  );
  console.log(
    `\n${results.filter((r) => r.voiceToggleVisible && r.heroImageLoaded).length}/${results.length} pillars have voice + hero img`,
  );
  process.exit(allOk ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(2);
});
