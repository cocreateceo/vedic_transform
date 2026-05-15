// One-shot Playwright walkthrough of the 17 main routes on production.
// Registers a throwaway account via API, logs in via the UI, visits each
// menu page, takes a screenshot, captures console errors, and runs targeted
// assertions against the fixes shipped during the menu audit.

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'walkthrough-out');
fs.mkdirSync(OUT, { recursive: true });

const API = 'https://sav5ro38xi.execute-api.us-east-1.amazonaws.com';
const SITE = 'https://d3l6jfw1mfhlf1.cloudfront.net';
const EMAIL = `audit-ui-${Date.now()}@example.com`;
const PASSWORD = 'TestUI-Pw-9182';

const report = [];
const record = (name, status, note = '') => {
  report.push({ name, status, note });
  const sym = status === 'PASS' ? '✓' : status === 'FAIL' ? '✗' : '·';
  console.log(`  ${sym} ${name}${note ? ` — ${note}` : ''}`);
};

async function api(method, ep, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${ep}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.ok ? res.json() : Promise.reject(new Error(`${method} ${ep} → ${res.status}`));
}

async function safe(fn, label, ms = 8000) {
  try {
    return await Promise.race([
      fn(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)),
    ]);
  } catch (e) {
    record(label, 'FAIL', `error: ${e.message.slice(0, 100)}`);
    return null;
  }
}

async function dumpDebug(page, label) {
  const url = page.url();
  const title = await page.title();
  const bodyText = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 200));
  const localStorageDump = await page.evaluate(() => {
    const keys = Object.keys(localStorage);
    const out = {};
    for (const k of keys) out[k] = (localStorage.getItem(k) || '').slice(0, 60);
    return out;
  });
  console.log(`  [debug:${label}] url=${url} title="${title}"`);
  console.log(`  [debug:${label}] localStorage=${JSON.stringify(localStorageDump)}`);
  console.log(`  [debug:${label}] body=${JSON.stringify(bodyText)}`);
}

async function main() {
  console.log('\n── Setup (API) ──');
  const reg = await api('POST', '/auth/register', { email: EMAIL, password: PASSWORD, name: 'UI Audit Probe' });
  const TOKEN = reg.token;
  const USERID = reg.user.id;
  console.log(`  Registered ${EMAIL} (${USERID})`);

  await api('POST', '/data/journey', { action: 'start' }, TOKEN);
  console.log('  Journey started');

  // Bypass onboarding so the main routes don't auto-redirect.
  await api('PATCH', '/data/user', {
    onboardingCompleted: true,
    onboardingData: { goal: 'wellness', dosha: 'vata' },
  }, TOKEN);
  // Refresh the cached user shape we hand to localStorage so the client
  // doesn't re-fire the gate from a stale cache.
  reg.user.onboardingCompleted = true;
  console.log('  Onboarding skipped (PATCH)');

  const checkin = await api('POST', '/data/checkin', { pillarSlug: 'breathing-meditation' }, TOKEN);
  console.log(`  First check-in: karma=${checkin.karmaAwarded}, newBadges=${checkin.newBadges?.map(b => b.name).join(',')}`);

  console.log('\n── Browser walkthrough ──');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    userAgent: 'Mozilla/5.0 (UI-Audit-Probe) Chrome/121',
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push({ url: page.url(), text: msg.text() });
  });
  page.on('pageerror', (err) => consoleErrors.push({ url: page.url(), text: `pageerror: ${err.message}` }));

  // PRIME localStorage with the token directly so we don't have to drive the
  // login form (which sometimes races against the redirect).
  await page.goto(`${SITE}/login`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ token, user }) => {
    localStorage.setItem('vedic-token', token);
    localStorage.setItem('vedic-user', JSON.stringify(user));
  }, { token: TOKEN, user: reg.user });
  console.log('  Primed localStorage with token + user');

  await page.goto(`${SITE}/dashboard`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500); // let auth context hydrate + initial fetches resolve
  await dumpDebug(page, 'dashboard-after-login');

  // 3) Visit every menu page; screenshot.
  const routes = [
    '/dashboard',
    '/pillars',
    '/sessions',
    '/goals',
    '/progress',
    '/journal',
    '/library',
    '/dosha-assessment',
    '/wisdom',
    '/mood',
    '/achievements',
    '/insights',
    '/reports',
    '/reminders',
    '/settings',
  ];

  for (const route of routes) {
    const before = consoleErrors.length;
    try {
      await page.goto(`${SITE}${route}`, { waitUntil: 'networkidle', timeout: 25000 });
      await page.waitForTimeout(1200);
      const slug = route.replace(/^\//, '').replace(/\//g, '-') || 'root';
      await page.screenshot({ path: path.join(OUT, `${slug}.png`), fullPage: true });
      const errs = consoleErrors.slice(before).map((e) => e.text).filter(t => !/favicon|manifest|404/i.test(t));
      const landed = new URL(page.url()).pathname.replace(/\/$/, '');
      const expected = route.replace(/\/$/, '');
      if (landed !== expected) {
        record(`Render ${route}`, 'FAIL', `redirected to ${landed}`);
      } else if (errs.length > 0) {
        record(`Render ${route}`, 'FAIL', `${errs.length}× e.g. ${errs[0].slice(0, 80)}`);
      } else {
        record(`Render ${route}`, 'PASS');
      }
    } catch (e) {
      record(`Render ${route}`, 'FAIL', `nav: ${e.message.slice(0, 80)}`);
    }
  }

  console.log('\n── Targeted fix verification ──');

  // Dashboard — greeting (full body, not just first 300 chars; sidebar text dominates the head)
  await page.goto(`${SITE}/dashboard`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const dashText = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
  const greetMatch = dashText.match(/(Good (morning|afternoon|evening|night)|Pre-dawn blessings)[^.!]{0,60}/i);
  if (greetMatch) {
    record('Dashboard greeting (time-of-day)', 'PASS', greetMatch[0].slice(0, 80));
  } else {
    record('Dashboard greeting (time-of-day)', 'FAIL', `no greeting match in ${dashText.length}-char body`);
  }

  // Reminders — Toggle icon swatches NOT all gray
  await page.goto(`${SITE}/reminders`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const swatchBgs = await page.evaluate(() => {
    const els = document.querySelectorAll('div.w-8.h-8.rounded-lg');
    return [...els].map((el) => getComputedStyle(el).backgroundColor);
  });
  const gray100 = /rgba?\(243,\s*244,\s*246/;
  const nonGray = swatchBgs.filter((bg) => bg && !gray100.test(bg) && !/rgba?\(0,\s*0,\s*0,\s*0\)/.test(bg));
  if (swatchBgs.length > 0 && nonGray.length > 0) {
    record('Reminders Toggle badges colored', 'PASS', `${nonGray.length}/${swatchBgs.length} non-gray (e.g. ${nonGray[0]})`);
  } else {
    record('Reminders Toggle badges colored', 'FAIL', `swatches=${swatchBgs.length} samples=${swatchBgs.slice(0, 3).join(' | ')}`);
  }

  const comingSoon = await page.locator('text=/Coming soon/i').count();
  record('Reminders email "Coming soon" gate', comingSoon > 0 ? 'PASS' : 'FAIL', `${comingSoon} occurrence(s)`);

  // Settings — pre-fill + save banner
  await page.goto(`${SITE}/settings`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await dumpDebug(page, 'settings');
  const nameVal = await page.locator('input[name="name"]').inputValue().catch(() => '<no input>');
  record('Settings name pre-fills', nameVal === 'UI Audit Probe' ? 'PASS' : 'FAIL', `value=${nameVal}`);

  if (nameVal !== '<no input>') {
    await page.fill('input[name="name"]', 'UI Audit Probe Renamed');
    await page.click('button[type="submit"]');
    const banner = await page
      .locator('text=/saved successfully/i')
      .first()
      .waitFor({ timeout: 5000 })
      .then(() => true).catch(() => false);
    record('Settings save banner', banner ? 'PASS' : 'FAIL');
  }

  // Achievements — First Step badge earned (wait longer for client fetch)
  await page.goto(`${SITE}/achievements`, { waitUntil: 'networkidle' });
  // Wait for the first badge h3 to appear so we know the GET /data/achievements call resolved
  await page.locator('h3').first().waitFor({ timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(1500);
  const firstStep = await page.evaluate(() => {
    const headings = [...document.querySelectorAll('h3, h4')];
    const fs = headings.find((h) => /First Step/i.test(h.textContent || ''));
    if (!fs) {
      const allH3 = headings.map(h => h.textContent?.trim()).slice(0, 15);
      return { found: false, sampleH3: allH3 };
    }
    let parent = fs.parentElement;
    while (parent && !/rounded-2xl/.test(parent.className || '')) parent = parent.parentElement;
    return {
      found: true,
      locked: parent ? /opacity-50|grayscale/.test(parent.className) : null,
    };
  });
  record(
    'Achievements: First Step shows earned',
    firstStep.found && firstStep.locked === false ? 'PASS' : 'FAIL',
    JSON.stringify(firstStep).slice(0, 200),
  );

  // Pillars — green ring on the breathing-meditation card
  await page.goto(`${SITE}/pillars`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const greenRings = await page.locator('[class*="ring-green-500"]').count();
  record('Pillars: completed pillar ring', greenRings > 0 ? 'PASS' : 'FAIL', `green rings=${greenRings}`);

  // Library — click Play, verify the global MiniPlayer appears with the
  // track title. The <audio> element is a detached JS object (new Audio())
  // so we can't query it; testing via the visible mini-player is reliable.
  await page.goto(`${SITE}/library`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const playBtn = page.locator('button:has-text("Play")').first();
  if (await playBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
    // Capture the card's title so we can verify the mini-player shows the same one.
    const cardTitle = await playBtn
      .locator('xpath=ancestor::*[contains(@class, "rounded")][1]//h3')
      .first()
      .textContent()
      .catch(() => null);
    await playBtn.click();
    // MiniPlayer is `fixed bottom-... border-t-2 border-[#DAA520]/40` — find it
    // by its track title appearing somewhere visible.
    const miniAppeared = cardTitle
      ? await page
          .locator(`.fixed >> text="${cardTitle.trim()}"`)
          .first()
          .waitFor({ timeout: 5000 })
          .then(() => true)
          .catch(() => false)
      : false;
    record(
      'Library: MiniPlayer appears with track title',
      miniAppeared ? 'PASS' : 'FAIL',
      cardTitle ? `track="${cardTitle.trim().slice(0, 40)}"` : 'no card title',
    );
  } else {
    record('Library: MiniPlayer appears with track title', 'SKIP', 'no Play button visible');
  }

  // Reports — currentDay value
  await page.goto(`${SITE}/reports`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const reportsText = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
  const dayMatch = reportsText.match(/Day\s*[:\n]?\s*(\d+)/);
  record(
    'Reports: Day stat is non-zero',
    dayMatch && Number(dayMatch[1]) > 0 ? 'PASS' : 'FAIL',
    `match=${dayMatch ? dayMatch[0] : '(none)'}`,
  );

  await browser.close();

  console.log('\n── Summary ──');
  const passes = report.filter((r) => r.status === 'PASS').length;
  const fails = report.filter((r) => r.status === 'FAIL').length;
  const skips = report.filter((r) => r.status === 'SKIP').length;
  console.log(`  ${passes} pass · ${fails} fail · ${skips} skip`);
  console.log(`  Screenshots: ${OUT}`);
  console.log(`  User to clean: ${USERID}`);
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ userId: USERID, email: EMAIL, report }, null, 2));
}

main().catch((e) => {
  console.error('Walkthrough fatal:', e);
  process.exit(2);
});
