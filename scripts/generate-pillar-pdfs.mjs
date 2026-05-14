// Generate static per-pillar PDFs into public/pillars/[slug].pdf.
//
// Run with:  node scripts/generate-pillar-pdfs.mjs
//
// We pre-generate at build time (not on-demand in a Lambda) because
// @react-pdf/renderer's reconciler does not survive Next.js's server
// bundling — see commits da510ab and 53f2f3a for the failed attempts.
// Static files also CDN-cache forever, which is what we want for these.

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

// ── Pillar metadata (no icons / colors — those don't render in PDF) ──
const PILLARS = [
  { id: 1, slug: "morning-initiation", name: "5 AM Initiation", sanskritName: "Brahma Muhurta", category: "body", defaultDurationMinutes: 10, karmaPointsBase: 15 },
  { id: 2, slug: "nutrition-fasting", name: "Vedic Nutrition + Fasting", sanskritName: "Ahara Vidhi", category: "body", defaultDurationMinutes: 0, karmaPointsBase: 10 },
  { id: 3, slug: "thoughts-intention", name: "Thoughts & Intention Reset", sanskritName: "Sankalpa", category: "mind", defaultDurationMinutes: 5, karmaPointsBase: 12 },
  { id: 4, slug: "breathing-meditation", name: "Breathing + Meditation", sanskritName: "Pranayama", category: "mind", defaultDurationMinutes: 15, karmaPointsBase: 15 },
  { id: 5, slug: "movement", name: "Movement Everyday", sanskritName: "Vyayama", category: "body", defaultDurationMinutes: 30, karmaPointsBase: 12 },
  { id: 6, slug: "healing-meditation", name: "Healing Meditation", sanskritName: "Dhyana", category: "mind", defaultDurationMinutes: 20, karmaPointsBase: 15 },
  { id: 7, slug: "gratitude", name: "Gratitude Practice", sanskritName: "Kritajnata", category: "mind", defaultDurationMinutes: 5, karmaPointsBase: 10 },
  { id: 8, slug: "sandhya-meditation", name: "Sandhya Meditation", sanskritName: "Sandhyavandana", category: "spirit", defaultDurationMinutes: 15, karmaPointsBase: 20 },
  { id: 9, slug: "brahman-connection", name: "Connection to Brahman", sanskritName: "Brahma Sambandha", category: "spirit", defaultDurationMinutes: 10, karmaPointsBase: 15 },
  { id: 10, slug: "divine-manifestation", name: "Divine Manifestation", sanskritName: "Sankalpa Shakti", category: "spirit", defaultDurationMinutes: 10, karmaPointsBase: 12 },
  { id: 11, slug: "sleep-optimization", name: "Sleep Optimization", sanskritName: "Nidra", category: "body", defaultDurationMinutes: 0, karmaPointsBase: 10 },
];

// ── Pillar content: import via dynamic loader against the TS source ──
// We can't import a .ts file directly from Node — instead, read the file
// as text and extract the export via a small eval. Brittle if the format
// changes, but the format is dictated by us, so we control it.
async function loadPillarContent() {
  const { readFile } = await import("node:fs/promises");
  const tsSource = await readFile(
    path.join(projectRoot, "src", "data", "pillar-content.ts"),
    "utf8",
  );

  // Strip the type-only declarations and the `export` keywords. What's
  // left is plain JS object literal assignments we can eval safely.
  const stripped = tsSource
    .replace(/export interface [\s\S]*?^}$/gm, "")
    .replace(/export const PILLAR_CONTENT: [^=]+ =/, "globalThis.__PC =")
    .replace(/^export /gm, "");

  // eslint-disable-next-line no-new-func
  new Function(stripped)();
  // @ts-expect-error — assigned via Function above
  return globalThis.__PC;
}

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 11, lineHeight: 1.55, color: "#1a1a1a", padding: 56, backgroundColor: "#fffdf9" },
  cover: { flexDirection: "column", justifyContent: "center", height: "100%", paddingHorizontal: 24 },
  brand: { fontSize: 9, color: "#b45309", letterSpacing: 2, marginBottom: 32, fontFamily: "Helvetica-Bold" },
  pillarNumber: { fontSize: 14, color: "#92400e", marginBottom: 8 },
  pillarName: { fontSize: 36, fontFamily: "Helvetica-Bold", color: "#1c1917", marginBottom: 6, lineHeight: 1.15 },
  sanskrit: { fontSize: 20, color: "#b45309", fontFamily: "Helvetica-Oblique", marginBottom: 24 },
  meta: { fontSize: 10, color: "#57534e", marginBottom: 32 },
  tagline: { fontSize: 14, color: "#44403c", lineHeight: 1.65, paddingTop: 24, borderTopWidth: 1, borderTopColor: "#e7e5e4", marginTop: 16 },
  pageHeader: { flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: "#a8a29e", marginBottom: 32, paddingBottom: 8, borderBottomWidth: 0.5, borderBottomColor: "#e7e5e4" },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#1c1917", marginBottom: 12 },
  sectionTitleAccent: { fontSize: 9, color: "#b45309", letterSpacing: 1.5, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  paragraph: { fontSize: 11, color: "#292524", marginBottom: 10, lineHeight: 1.6 },
  step: { flexDirection: "row", marginBottom: 8 },
  stepNumber: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#b45309", width: 18 },
  stepText: { fontSize: 11, color: "#292524", flex: 1, lineHeight: 1.5 },
  scriptureBlock: { marginBottom: 14, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: "#f59e0b" },
  scriptureText: { fontSize: 11, color: "#292524", fontFamily: "Helvetica-Oblique", marginBottom: 4, lineHeight: 1.5 },
  scriptureCite: { fontSize: 9, color: "#78716c" },
  obstacle: { marginBottom: 14 },
  obstacleQ: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#1c1917", marginBottom: 3 },
  obstacleA: { fontSize: 11, color: "#44403c", lineHeight: 1.5 },
  closing: { fontSize: 11, color: "#44403c", lineHeight: 1.6, backgroundColor: "#fef3c7", padding: 16, borderRadius: 4, marginTop: 12 },
  footer: { position: "absolute", bottom: 32, left: 56, right: 56, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: "#a8a29e", paddingTop: 8, borderTopWidth: 0.5, borderTopColor: "#e7e5e4" },
});

// ── Shorthand element factories (avoid JSX so we can run as plain .mjs) ──
const h = React.createElement;
const t = (style, text) => h(Text, { style }, text);

function PillarPDF({ pillar, content }) {
  const cat = pillar.category.charAt(0).toUpperCase() + pillar.category.slice(1);
  const metaLine =
    pillar.defaultDurationMinutes > 0
      ? `Category: ${cat}  ·  ${pillar.defaultDurationMinutes} min/day  ·  ${pillar.karmaPointsBase} karma points`
      : `Category: ${cat}  ·  ${pillar.karmaPointsBase} karma points`;
  const header = `${pillar.name} · ${pillar.sanskritName}`;

  return h(
    Document,
    {
      title: `${pillar.name} — 10X Vedic Transform`,
      author: "10X Vedic Transform",
      subject: `Pillar ${pillar.id}: ${pillar.name}`,
    },
    // Cover
    h(Page, { size: "A4", style: styles.page },
      h(View, { style: styles.cover },
        t(styles.brand, "10X VEDIC TRANSFORM · OFFLINE GUIDE"),
        t(styles.pillarNumber, `Pillar ${pillar.id} of 11`),
        t(styles.pillarName, pillar.name),
        t(styles.sanskrit, pillar.sanskritName),
        h(View, { style: styles.meta }, t(null, metaLine)),
        t(styles.tagline, content.tagline),
      ),
      h(View, { style: styles.footer }, t(null, "10xvedictransform.com"), t(null, "Cover")),
    ),
    // Overview + Why
    h(Page, { size: "A4", style: styles.page },
      h(View, { style: styles.pageHeader }, t(null, header), t(null, "10X Vedic Transform")),
      h(View, { style: styles.section },
        t(styles.sectionTitleAccent, "OVERVIEW"),
        t(styles.sectionTitle, "What is this practice?"),
        ...content.overview.map((p, i) => h(Text, { key: `o${i}`, style: styles.paragraph }, p)),
      ),
      h(View, { style: styles.section },
        t(styles.sectionTitleAccent, "SCIENCE + TRADITION"),
        t(styles.sectionTitle, "Why it works"),
        ...content.whyItWorks.map((p, i) => h(Text, { key: `w${i}`, style: styles.paragraph }, p)),
      ),
      h(View, { style: styles.footer }, t(null, "10xvedictransform.com"), t(null, "Page 2")),
    ),
    // Daily + Scripture
    h(Page, { size: "A4", style: styles.page },
      h(View, { style: styles.pageHeader }, t(null, header), t(null, "10X Vedic Transform")),
      h(View, { style: styles.section },
        t(styles.sectionTitleAccent, "DAILY GUIDE"),
        t(styles.sectionTitle, "How to practice this today"),
        ...content.dailyPractice.map((step, i) => h(View, { key: `d${i}`, style: styles.step },
          h(Text, { style: styles.stepNumber }, `${i + 1}.`),
          h(Text, { style: styles.stepText }, step),
        )),
      ),
      h(View, { style: styles.section },
        t(styles.sectionTitleAccent, "SCRIPTURE"),
        t(styles.sectionTitle, "What the tradition says"),
        ...content.scripture.map((s, i) => h(View, { key: `s${i}`, style: styles.scriptureBlock },
          h(Text, { style: styles.scriptureText }, `“${s.text}”`),
          h(Text, { style: styles.scriptureCite }, `— ${s.verse}`),
        )),
      ),
      h(View, { style: styles.footer }, t(null, "10xvedictransform.com"), t(null, "Page 3")),
    ),
    // Obstacles + Closing
    h(Page, { size: "A4", style: styles.page },
      h(View, { style: styles.pageHeader }, t(null, header), t(null, "10X Vedic Transform")),
      h(View, { style: styles.section },
        t(styles.sectionTitleAccent, "TROUBLESHOOTING"),
        t(styles.sectionTitle, "Common obstacles"),
        ...content.obstacles.map((o, i) => h(View, { key: `b${i}`, style: styles.obstacle },
          h(Text, { style: styles.obstacleQ }, o.obstacle),
          h(Text, { style: styles.obstacleA }, o.remedy),
        )),
      ),
      h(View, { style: styles.section },
        t(styles.sectionTitleAccent, "FOR YOUR DOSHA"),
        t(styles.sectionTitle, "A note on constitution"),
        h(Text, { style: styles.closing }, content.closing),
      ),
      h(View, { style: styles.footer }, t(null, "10xvedictransform.com"), t(null, "Page 4 · End")),
    ),
  );
}

async function main() {
  const PILLAR_CONTENT = await loadPillarContent();
  // Output to public/guides/ — NOT public/pillars/. Static files in
  // public/pillars/ shadowed the dynamic Next.js route /pillars/[slug]/
  // because CloudFront preferred the S3 bucket for any path under
  // /pillars/, returning 403 for actual dynamic-route hits.
  const outDir = path.join(projectRoot, "public", "guides");
  if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

  for (const pillar of PILLARS) {
    const content = PILLAR_CONTENT[pillar.slug];
    if (!content) {
      console.error(`✘  No content for pillar: ${pillar.slug}`);
      continue;
    }
    const buffer = await renderToBuffer(h(PillarPDF, { pillar, content }));
    const filename = `pillar-${pillar.id}-${pillar.slug}.pdf`;
    const outPath = path.join(outDir, filename);
    await writeFile(outPath, buffer);
    console.log(`✓  ${filename}  (${Math.round(buffer.length / 1024)} KB)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
