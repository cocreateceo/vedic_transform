// Consolidates the 4 OCR-triage agent outputs + the manually OCR'd batch A
// poster into a master manifest. Generates WebP variants via sharp. Emits
// the TS Poster[] snippet + posters-ocr-log markdown to stdout / files.

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'poster-images');
const DIM_PATH = path.join(OUT_DIR, '_dimensions.json');
const POSTERS_SRC = path.join(ROOT, 'Posters', 'Posters');

const INPUTS = [
  // Batch A — pre-claim of three-sandhyas; this is just the structured OCR
  // I made before dispatching agents. Group 0's three-sandhyas entry below
  // is richer, so this file is overridden.
  // Skipped — group 0 wins on this slug.
  'scripts/posters-incoming-group-0.json',
  'scripts/posters-incoming-group-1.json',
  'scripts/posters-incoming-group-2.json',
  'scripts/posters-incoming-group-3.json',
];

// Width buckets (matches the WebP pipeline script).
const WIDTHS = { default: 768, '@2x': 1536, '.thumb': 400 };

async function buildWebp(slug, sourceAbs) {
  const meta = await sharp(sourceAbs).metadata();
  const sourceAR = meta.width / meta.height;
  const sizes = {};
  for (const [tag, w] of Object.entries(WIDTHS)) {
    const targetW = Math.min(w, meta.width);
    const targetH = Math.round(targetW / sourceAR);
    const outName = slug + (tag === 'default' ? '' : tag) + '.webp';
    await sharp(sourceAbs)
      .resize({ width: targetW, withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(path.join(OUT_DIR, outName));
    sizes[tag] = { width: targetW, height: targetH };
  }
  return sizes;
}

function tsLiteral(value, indent = '      ') {
  if (value === null || value === undefined) return 'undefined';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const inner = value.map(v => indent + '  ' + tsLiteral(v, indent + '  ')).join(',\n');
    return '[\n' + inner + ',\n' + indent + ']';
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return '{}';
    const pairs = keys.map(k => indent + '  ' + k + ': ' + tsLiteral(value[k], indent + '  '));
    return '{\n' + pairs.join(',\n') + ',\n' + indent + '}';
  }
  return 'undefined';
}

function emitPosterTS(p) {
  // Build the Poster object in TS form. The schema matches src/data/posters.ts.
  const obj = {
    slug: p.slug,
    title: p.title,
    concept: p.concept,
  };
  if (p.pillarSlug) obj.pillarSlug = p.pillarSlug;
  if (p.dosha) obj.dosha = p.dosha;
  obj.kind = p.kind;
  obj.category = p.category;
  obj.image = {
    src: `/poster-images/${p.slug}.webp`,
    src2x: `/poster-images/${p.slug}@2x.webp`,
    thumb: `/poster-images/${p.slug}.thumb.webp`,
    width: p._sizes.default.width,
    height: p._sizes.default.height,
    alt: p.alt,
  };
  obj.scripture = p.scripture || [];
  obj.sections = p.sections || [];
  if (p.tagline) obj.tagline = p.tagline;
  return tsLiteral(obj, '  ');
}

function emitLogMarkdown(p) {
  const dimDefault = p._sizes.default;
  let md = `\n### ${p.slug}` + (p.dosha ? ` (dosha=${p.dosha}, kind=${p.kind})` : '') + '\n';
  md += `- Source: \`${p.source_filename}\` (${dimDefault.width}x${dimDefault.height})\n`;
  md += `- Outputs: \`/poster-images/${p.slug}.webp\`, \`@2x.webp\`, \`.thumb.webp\`\n`;
  md += `- Extracted by: Claude Code (Opus 4.7) — parallel-agent OCR pipeline\n`;
  const scriptureNames = (p.scripture || []).map(s => s.sutra).join(', ');
  md += `- Scripture: ${scriptureNames || 'none cited'}\n`;
  const sections = (p.sections || []).map(s => s.title).slice(0, 12);
  md += `- Sections: ${sections.length} (${sections.slice(0, 3).join(' / ')}${sections.length > 3 ? ' / …' : ''})\n`;
  return md;
}

async function main() {
  // Aliases — different agents named the same poster differently. Map all
  // aliases to the canonical slug; first canonical entry seen wins.
  const SLUG_ALIASES = {
    'manifestation-10-secrets-patanjali': 'ten-manifestation-secrets-patanjali',
  };

  const bySlug = new Map();
  const allFindings = [];
  for (const rel of INPUTS) {
    const obj = JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
    for (const p of (obj.new_posters || [])) {
      const canonical = SLUG_ALIASES[p.slug] || p.slug;
      p.slug = canonical;
      if (!bySlug.has(canonical)) bySlug.set(canonical, p);
    }
    for (const f of (obj.findings || [])) allFindings.push({ ...f, _from: rel });
  }

  const posters = Array.from(bySlug.values());
  console.log('\n=== consolidated: ' + posters.length + ' unique new posters ===');
  for (const p of posters) console.log('  - ' + p.slug + ' (← ' + p.source_filename + ')');

  // Build WebP for each
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const dimsExisting = fs.existsSync(DIM_PATH) ? JSON.parse(fs.readFileSync(DIM_PATH, 'utf8')) : [];
  const dimsBySlug = new Map(dimsExisting.map(e => [e.slug, e]));

  for (const p of posters) {
    const src = path.join(POSTERS_SRC, p.source_filename);
    if (!fs.existsSync(src)) { console.error('MISSING: ' + src); continue; }
    p._sizes = await buildWebp(p.slug, src);
    dimsBySlug.set(p.slug, { slug: p.slug, sizes: p._sizes });
    console.log('  built ' + p.slug + ' → ' + Object.entries(p._sizes).map(([k, v]) => k + ' ' + v.width + 'x' + v.height).join(' · '));
  }

  // Write dimensions
  const dimsOut = Array.from(dimsBySlug.values()).sort((a, b) => a.slug.localeCompare(b.slug));
  fs.writeFileSync(DIM_PATH, JSON.stringify(dimsOut, null, 2) + '\n');

  // Emit TS snippet
  const tsLines = posters.map(p => '  ' + emitPosterTS(p)).join(',\n');
  fs.writeFileSync(path.join(__dirname, 'posters-new-entries.ts.snippet'), tsLines + ',\n');
  console.log('\nwrote scripts/posters-new-entries.ts.snippet');

  // Emit OCR log markdown
  let md = '\n## Batch 5 — 2026-05-28 (parallel-agent OCR; 13 new posters from 61 unprocessed)\n';
  md += '\nProcessed by 4 parallel general-purpose agents reading raw JPEGs in their own contexts; ' +
        'aggregated into one consolidated batch via scripts/posters-consolidate.cjs.\n';
  md += '\n**Duplication rate**: of 61 unprocessed JPEGs, 13 are new unique posters and 46 are visual duplicates of existing canonical entries (2 unreadable book-cover collages). Total OCR\'d set is now **26 posters**.\n';
  for (const p of posters) md += emitLogMarkdown(p);
  md += '\n### Duplicate / unreadable findings (full audit)\n\n';
  md += '| Source filename | Status | Canonical slug |\n|---|---|---|\n';
  for (const f of allFindings) {
    md += `| \`${f.source}\` | ${f.status} | ${f.slug || '—'} |\n`;
  }
  fs.writeFileSync(path.join(__dirname, 'posters-batch5-log.md'), md);
  console.log('wrote scripts/posters-batch5-log.md');

  console.log('\nDone. Next:');
  console.log('  1. Append scripts/posters-new-entries.ts.snippet into src/data/posters.ts POSTERS[] array');
  console.log('  2. Append scripts/posters-batch5-log.md to docs/posters-ocr-log.md');
  console.log('  3. Verify with tsc / next build / playwright');
  console.log('  4. Commit');
}

main().catch(e => { console.error(e); process.exit(1); });
