// Generates on-brand teaching posters for pillars that have no source
// scan in the WhatsApp set (brahman-connection, sleep-optimization).
// Renders a styled SVG from structured content, then rasterizes to the
// three WebP sizes the app expects (default 768w, @2x 1536w, thumb 400w)
// under public/poster-images/. Output contract matches
// scripts/posters-build-webp.cjs so src/data/posters.ts wires identically.
//
// Usage: node scripts/generate-pillar-poster.mjs

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/poster-images");

const W = 768;
const PAD = 56;
const CONTENT_W = W - PAD * 2;

// ---- layout helpers ---------------------------------------------------

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Approximate word-wrap: average glyph advance ~ factor * fontSize.
function wrap(text, fontSize, maxWidth, factor = 0.54) {
  const maxChars = Math.max(8, Math.floor(maxWidth / (factor * fontSize)));
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const trial = line ? `${line} ${w}` : w;
    if (trial.length > maxChars && line) {
      lines.push(line);
      line = w;
    } else {
      line = trial;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// ---- poster renderer --------------------------------------------------

function renderPoster(p) {
  const el = []; // foreground elements (absolute y)
  let y = 0;

  const accent = p.accent; // { from, to, dark, tint }
  const SERIF = "Georgia, 'Times New Roman', serif";
  const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

  // ---- header band ----
  const headerInnerW = CONTENT_W - 8;
  const titleLines = wrap(p.title, 46, headerInnerW, 0.6);
  const taglineLines = wrap(p.tagline, 17, headerInnerW, 0.52);
  const headerH =
    44 + titleLines.length * 52 + 14 + 26 + 18 + taglineLines.length * 24 + 40;

  el.push(
    `<rect x="${PAD}" y="0" width="${CONTENT_W}" height="${headerH}" rx="26" fill="url(#hdr)"/>`,
  );
  // faint decorative ring
  el.push(
    `<circle cx="${W - PAD - 46}" cy="46" r="30" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="2"/>`,
    `<circle cx="${W - PAD - 46}" cy="46" r="18" fill="none" stroke="#ffffff" stroke-opacity="0.14" stroke-width="2"/>`,
  );

  let hy = 64;
  for (const ln of titleLines) {
    el.push(
      `<text x="${PAD + 36}" y="${hy}" font-family="${SERIF}" font-size="46" font-weight="700" fill="#ffffff">${esc(ln)}</text>`,
    );
    hy += 52;
  }
  hy += 6;
  el.push(
    `<text x="${PAD + 36}" y="${hy + 18}" font-family="${SANS}" font-size="19" font-weight="600" letter-spacing="2" fill="#ffffff" fill-opacity="0.92">${esc(p.subtitle.toUpperCase())}</text>`,
  );
  hy += 18 + 30;
  for (const ln of taglineLines) {
    el.push(
      `<text x="${PAD + 36}" y="${hy}" font-family="${SERIF}" font-size="17" font-style="italic" fill="#ffffff" fill-opacity="0.92">${esc(ln)}</text>`,
    );
    hy += 24;
  }
  y = headerH + 34;

  // ---- scripture hero card ----
  const sc = p.hero;
  const transLines = wrap(sc.translation, 17, CONTENT_W - 64, 0.52);
  const cardH = 30 + 30 + 14 + transLines.length * 25 + 12 + 22 + 30;
  el.push(
    `<rect x="${PAD}" y="${y}" width="${CONTENT_W}" height="${cardH}" rx="18" fill="${accent.tint}"/>`,
    `<rect x="${PAD}" y="${y}" width="6" height="${cardH}" rx="3" fill="${accent.dark}"/>`,
  );
  let cy = y + 42;
  el.push(
    `<text x="${PAD + 34}" y="${cy}" font-family="${SERIF}" font-size="23" font-weight="700" font-style="italic" fill="${accent.dark}">${esc(sc.sanskrit)}</text>`,
  );
  cy += 32;
  for (const ln of transLines) {
    el.push(
      `<text x="${PAD + 34}" y="${cy}" font-family="${SERIF}" font-size="17" font-style="italic" fill="#374151">${esc(ln)}</text>`,
    );
    cy += 25;
  }
  cy += 10;
  el.push(
    `<text x="${PAD + 34}" y="${cy + 8}" font-family="${SANS}" font-size="13" font-weight="700" letter-spacing="1.5" fill="${accent.dark}">${esc(sc.sutra.toUpperCase())}</text>`,
  );
  y += cardH + 40;

  // ---- sections ----
  for (const sec of p.sections) {
    // title (with optional number badge)
    if (sec.number != null) {
      el.push(
        `<circle cx="${PAD + 16}" cy="${y - 6}" r="16" fill="url(#hdr)"/>`,
        `<text x="${PAD + 16}" y="${y - 1}" text-anchor="middle" font-family="${SANS}" font-size="16" font-weight="700" fill="#ffffff">${sec.number}</text>`,
      );
    }
    const titleX = sec.number != null ? PAD + 44 : PAD;
    el.push(
      `<text x="${titleX}" y="${y}" font-family="${SERIF}" font-size="22" font-weight="700" fill="#111827">${esc(sec.title)}</text>`,
    );
    y += 30;

    if (sec.body) {
      const lines = wrap(sec.body, 16.5, CONTENT_W, 0.535);
      for (const ln of lines) {
        el.push(
          `<text x="${PAD}" y="${y}" font-family="${SANS}" font-size="16.5" fill="#374151">${esc(ln)}</text>`,
        );
        y += 25;
      }
    }
    if (sec.bullets) {
      for (const b of sec.bullets) {
        const lines = wrap(b, 16.5, CONTENT_W - 26, 0.535);
        el.push(
          `<circle cx="${PAD + 5}" cy="${y - 5}" r="3.5" fill="${accent.dark}"/>`,
        );
        lines.forEach((ln, i) => {
          el.push(
            `<text x="${PAD + 22}" y="${y}" font-family="${SANS}" font-size="16.5" fill="#374151">${esc(ln)}</text>`,
          );
          y += 24;
          if (i < lines.length - 1) {
            // continuation already advanced
          }
        });
        y += 3;
      }
    }
    y += 26;
  }

  // ---- footer tagline ----
  const footLines = wrap(p.footer, 18, CONTENT_W - 40, 0.5);
  const footH = 24 + footLines.length * 26 + 24;
  el.push(
    `<rect x="${PAD}" y="${y}" width="${CONTENT_W}" height="${footH}" rx="18" fill="${accent.tint}"/>`,
  );
  let fy = y + 38;
  for (const ln of footLines) {
    el.push(
      `<text x="${W / 2}" y="${fy}" text-anchor="middle" font-family="${SERIF}" font-size="18" font-style="italic" fill="${accent.dark}">${esc(ln)}</text>`,
    );
    fy += 26;
  }
  y += footH;

  const H = Math.round(y + PAD);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="page" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFBF5"/>
      <stop offset="1" stop-color="#FFF6EC"/>
    </linearGradient>
    <linearGradient id="hdr" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accent.from}"/>
      <stop offset="1" stop-color="${accent.to}"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#page)"/>
  <rect x="14" y="14" width="${W - 28}" height="${H - 28}" rx="22" fill="none" stroke="${accent.dark}" stroke-opacity="0.12" stroke-width="2"/>
  ${el.join("\n  ")}
</svg>`;

  return { svg, width: W, height: H };
}

// ---- write the 3 webp variants from one SVG ---------------------------

async function emit(slug, svg, baseH) {
  // density 144 => SVG's 768px width rasterizes at 1536px (the @2x master)
  const master = sharp(Buffer.from(svg), { density: 144 });
  const variants = [
    { suffix: "", width: 768 },
    { suffix: "@2x", width: 1536 },
    { suffix: ".thumb", width: 400 },
  ];
  for (const v of variants) {
    const out = join(OUT_DIR, `${slug}${v.suffix}.webp`);
    await master
      .clone()
      .resize({ width: v.width, withoutEnlargement: false })
      .webp({ quality: 90 })
      .toFile(out);
    console.log(
      `  wrote ${out} (${v.width}x${Math.round((v.width / 768) * baseH)})`,
    );
  }
}

// ---- poster content ---------------------------------------------------

const POSTERS = [
  {
    slug: "connection-to-brahman",
    accent: { from: "#7C3AED", to: "#4338CA", dark: "#5B21B6", tint: "#F5F3FF" },
    title: "Connection to Brahman",
    subtitle: "Brahma Sambandha",
    tagline:
      "Daily contact with the field of universal consciousness — empirical, not religious, open to all.",
    hero: {
      sanskrit: "Aham Brahmāsmi",
      translation:
        "I am Brahman — individual consciousness is identical with the ultimate reality.",
      sutra: "Brihadaranyaka Upanishad 1.4.10",
    },
    sections: [
      {
        number: 1,
        title: "What It Is",
        body: "The practice of regularly entering the elevated state where the boundary between the individual self and the universal field dissolves. A practical philosophy for self-understanding — no religious affiliation, welcoming every background.",
      },
      {
        number: 2,
        title: "Why It Works",
        body: "In deep meditation, brain-wave states shift from beta (alert thinking) to alpha to theta to delta (deep stillness). The subconscious — which holds most stored memory and pattern — becomes available for healing and transformation in these states.",
      },
      {
        number: 3,
        title: "The Daily Practice",
        bullets: [
          "Sit upright in a quiet place where you won't be interrupted.",
          "Close the eyes, take 3 deep breaths, soften the body.",
          "Repeat the syllable 'Om' silently or aloud — 7 times.",
          "Drop into silence and observe what arises without engaging it.",
          "When the mind wanders, gently return to 'Om' or the breath.",
          "Hold the silence for 10 minutes — beginners: 5 is enough.",
          "Close with 'Purnam adah, purnam idam' — That is whole, this is whole.",
        ],
      },
      {
        number: 4,
        title: "Remember",
        body: "Most people expect drama. The real shift is subtle and shows up off the cushion — in patience, in how you greet strangers, in what you eat. Many feel meaningful shifts within the first week of sincere practice.",
      },
    ],
    footer: "Tat tvam asi — You are That.",
  },
  {
    slug: "sleep-optimization-nidra",
    accent: { from: "#4F46E5", to: "#312E81", dark: "#3730A3", tint: "#EEF2FF" },
    title: "Sleep Optimization",
    subtitle: "Nidra · The Third Pillar of Life",
    tagline:
      "Sleep is not the absence of activity — it is the deepest active practice of the day.",
    hero: {
      sanskrit: "Āhāra · Nidrā · Brahmacharya",
      translation:
        "Sleep, food, and brahmacharya are the three pillars of life. Practiced correctly they sustain the body; abused, they destroy it.",
      sutra: "Ashtanga Hridaya, Sutra Sthana 7",
    },
    sections: [
      {
        number: 1,
        title: "Why It Matters",
        body: "Memory consolidation, glymphatic clearance of brain waste, growth-hormone release, immune priming and emotional regulation all happen during sleep — and all degrade dramatically when sleep is short or fragmented.",
      },
      {
        number: 2,
        title: "Timing Beats Duration",
        body: "The first four hours hold the majority of deep, delta-wave sleep — the phase responsible for physical repair. Bed at 10 PM gives far more deep sleep than the same seven hours starting at 1 AM.",
      },
      {
        number: 3,
        title: "Tonight's Protocol",
        bullets: [
          "Aim for bed by 10 PM, asleep by 10:30 PM.",
          "No screens 60 minutes before bed — or use blue-light filters.",
          "Dim all lights after sunset: lamps, not overhead.",
          "Last meal 3 hours before sleep; last water 1 hour before.",
          "Cool the room to 65–68°F (18–20°C). Cool beats warm.",
          "5-minute wind-down: gentle yoga, warm bath, or 4:6 breathing.",
          "Wake at 3 AM with a racing mind? Sit up, breathe slow, no screens.",
        ],
      },
      {
        number: 4,
        title: "If Sleep Won't Come",
        body: "Wake at 5 AM regardless of bedtime. Within 5–7 days the body will demand earlier sleep. Fixing wake-time works; trying to fix bedtime first almost never does.",
      },
    ],
    footer: "Most people see measurable shifts within 3–7 days.",
  },
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const dims = [];
  for (const p of POSTERS) {
    console.log(`\n[${p.slug}]`);
    const { svg, width, height } = renderPoster(p);
    await emit(p.slug, svg, height);
    dims.push({ slug: p.slug, width, height });
  }
  console.log("\nDIMENSIONS:");
  console.log(JSON.stringify(dims, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
