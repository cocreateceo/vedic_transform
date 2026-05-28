// Generates the 3 WebP variants for a curated poster set.
//
// Input: a manifest JSON like
//   [{ slug: "<slug>", source: "Posters/Posters/<filename>.jpeg" }, ...]
// Output (into public/poster-images/):
//   <slug>.webp        — default (max 768w, aspect-ratio preserved)
//   <slug>@2x.webp     — 2x (max 1536w)
//   <slug>.thumb.webp  — thumb (max 400w)
// Also appends/updates entries in public/poster-images/_dimensions.json.
//
// Usage:
//   node scripts/posters-build-webp.cjs scripts/posters-batch.json
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'poster-images');
const DIM_PATH = path.join(OUT_DIR, '_dimensions.json');

const WIDTHS = { default: 768, '@2x': 1536, '.thumb': 400 };

async function build(slug, sourceRel) {
  const src = path.join(ROOT, sourceRel);
  if (!fs.existsSync(src)) throw new Error('missing source: ' + src);
  const input = sharp(src);
  const meta = await input.metadata();
  const sourceAR = meta.width / meta.height;
  const sizes = {};

  for (const [tag, w] of Object.entries(WIDTHS)) {
    const targetW = Math.min(w, meta.width);
    const targetH = Math.round(targetW / sourceAR);
    const outName = slug + (tag === 'default' ? '' : tag) + '.webp';
    const outPath = path.join(OUT_DIR, outName);
    await sharp(src)
      .resize({ width: targetW, withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(outPath);
    sizes[tag] = { width: targetW, height: targetH };
  }
  return sizes;
}

async function main() {
  const manifestPath = process.argv[2];
  if (!manifestPath) { console.error('usage: node posters-build-webp.cjs <manifest.json>'); process.exit(1); }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const existing = fs.existsSync(DIM_PATH) ? JSON.parse(fs.readFileSync(DIM_PATH, 'utf8')) : [];
  const bySlug = new Map(existing.map(e => [e.slug, e]));

  for (const item of manifest) {
    console.log('-> ' + item.slug);
    const sizes = await build(item.slug, item.source);
    bySlug.set(item.slug, { slug: item.slug, sizes });
    console.log('   ' + Object.entries(sizes).map(([k, v]) => k + ' ' + v.width + 'x' + v.height).join(' · '));
  }

  const out = Array.from(bySlug.values()).sort((a, b) => a.slug.localeCompare(b.slug));
  fs.writeFileSync(DIM_PATH, JSON.stringify(out, null, 2) + '\n');
  console.log('\nupdated ' + DIM_PATH + ' (' + out.length + ' posters total)');
}

main().catch(e => { console.error(e); process.exit(1); });
