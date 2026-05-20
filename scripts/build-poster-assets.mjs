// Reads scripts/poster-manifest.json and converts each source JPEG into
// three WebP sizes under public/posters/. Idempotent — skips files that
// already exist unless --force is passed.

import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const MANIFEST = resolve(ROOT, "scripts/poster-manifest.json");
const SOURCE_DIR = resolve(ROOT, "Posters/Posters");
const OUT_DIR = resolve(ROOT, "public/poster-images");

const SIZES = [
  { suffix: "", maxWidth: 768, quality: 82 },
  { suffix: "@2x", maxWidth: 1536, quality: 82 },
  { suffix: ".thumb", maxWidth: 400, quality: 80 },
];

const force = process.argv.includes("--force");

async function exists(p) {
  try {
    await access(p, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function processOne(entry) {
  const sourcePath = join(SOURCE_DIR, entry.source);
  if (!(await exists(sourcePath))) {
    console.error(`  MISSING: ${sourcePath}`);
    return null;
  }
  const meta = { slug: entry.slug, sizes: {} };
  for (const { suffix, maxWidth, quality } of SIZES) {
    const outPath = join(OUT_DIR, `${entry.slug}${suffix}.webp`);
    if (!force && (await exists(outPath))) {
      const dims = await sharp(outPath).metadata();
      meta.sizes[suffix || "default"] = { width: dims.width, height: dims.height };
      continue;
    }
    const pipeline = sharp(sourcePath).resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality });
    const buf = await pipeline.toBuffer();
    const dims = await sharp(buf).metadata();
    await writeFile(outPath, buf);
    meta.sizes[suffix || "default"] = { width: dims.width, height: dims.height };
    console.log(`  wrote ${outPath} (${dims.width}x${dims.height})`);
  }
  return meta;
}

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
  await mkdir(OUT_DIR, { recursive: true });
  const results = [];
  for (const entry of manifest.posters) {
    console.log(`\n[${entry.slug}]`);
    const result = await processOne(entry);
    if (result) results.push(result);
  }
  const sidecarPath = join(OUT_DIR, "_dimensions.json");
  await writeFile(sidecarPath, JSON.stringify(results, null, 2));
  console.log(`\nWrote ${sidecarPath} with ${results.length} entries.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
