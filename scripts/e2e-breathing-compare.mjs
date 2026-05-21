// Capture screenshots of the three breathing UIs in the app so we can
// see them side by side:
//   1. /sessions/?practice=breathing     → BreathingPatterns (running session)
//   2. /pillars/breathing-meditation/    → BreathingVisualizer (5-min practice)
//   3. /pillars/breathing-meditation/    → MiniBreathingDemo inline in
//                                          step 1 (Daily Practice reflection)
//
// Output: three screenshots under test-results/breathing-compare/

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const envPath = path.resolve(".env.e2e");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
}

const BASE_URL = process.env.BASE_URL || "https://10x.vedics.net";
const API_URL = process.env.API_URL || "https://sav5ro38xi.execute-api.us-east-1.amazonaws.com";
const TOKEN = process.env.VEDIC_TOKEN;

const OUT_DIR = path.resolve("test-results/breathing-compare");
fs.mkdirSync(OUT_DIR, { recursive: true });

const user = await (async () => {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return (await res.json()).user;
})();

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 1600 } });
await context.addInitScript(({ token, user }) => {
  window.localStorage.setItem("vedic-token", token);
  window.localStorage.setItem("vedic-user", JSON.stringify(user));
}, { token: TOKEN, user });
const page = await context.newPage();

// 1) Sessions → Breathing
await page.goto(`${BASE_URL}/sessions/?practice=breathing`, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: path.join(OUT_DIR, "1-sessions-breathing.png"), fullPage: true });
console.log("✓ sessions/breathing screenshot");

// 2 + 3) Pillar breathing-meditation — has BreathingVisualizer at top, then reflection
await page.goto(`${BASE_URL}/pillars/breathing-meditation/`, { waitUntil: "networkidle", timeout: 30000 });
await page.evaluate(() => {
  // Clear reflection answers so we land on step 1 (which has the breathing pacer)
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const k = localStorage.key(i);
    if (k && k.startsWith("breathing-reflection-")) localStorage.removeItem(k);
  }
});
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(2000);
// Full page = both surfaces (BreathingVisualizer at top + MiniBreathingDemo in step 1)
await page.screenshot({ path: path.join(OUT_DIR, "2-pillar-full.png"), fullPage: true });
console.log("✓ pillars/breathing-meditation full-page screenshot");

// Just the reflection card area
const reflectionCard = page.locator('text=/Step 1 of 6/i').first();
await reflectionCard.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
await page.screenshot({
  path: path.join(OUT_DIR, "3-pillar-reflection-mini.png"),
  fullPage: false,
});
console.log("✓ pillar reflection mini-pacer screenshot");

await browser.close();
console.log(`\nScreenshots in: ${OUT_DIR}`);
