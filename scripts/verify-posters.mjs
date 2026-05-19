// Loads src/data/posters.ts via tsx and asserts internal consistency:
//  - slugs are unique
//  - pillarSlug (when present) matches a known pillar
//  - dosha posters have kind set to yoga or pranayama
//  - referenced image files exist under public/posters/
//
// Run via: npm run verify-posters

import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const { POSTERS } = await import(pathToFileURL(resolve(ROOT, "src/data/posters.ts")).href);
const pillarsTs = readFileSync(resolve(ROOT, "src/constants/pillars.ts"), "utf8");
const knownSlugs = new Set([...pillarsTs.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]));
const errors = [];

const seen = new Set();
for (const p of POSTERS) {
  if (seen.has(p.slug)) errors.push(`duplicate slug: ${p.slug}`);
  seen.add(p.slug);
  if (p.pillarSlug && !knownSlugs.has(p.pillarSlug)) {
    errors.push(`${p.slug}: unknown pillarSlug "${p.pillarSlug}"`);
  }
  if (p.dosha && p.kind === "general") {
    errors.push(`${p.slug}: dosha set but kind is "general" — expected yoga/pranayama`);
  }
  for (const key of ["src", "src2x", "thumb"]) {
    const path = resolve(ROOT, "public" + p.image[key]);
    if (!existsSync(path)) errors.push(`${p.slug}: missing image ${p.image[key]}`);
  }
}

if (errors.length) {
  console.error("FAIL:\n  " + errors.join("\n  "));
  process.exit(1);
}
console.log(`OK: ${POSTERS.length} posters verified.`);
