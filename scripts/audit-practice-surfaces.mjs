// One-shot audit script: enumerate every reflection step across all
// pillars and report which ones have a practice surface (breathing
// pacer, image, GIF) and which are plain question-only. Run with:
//   node scripts/audit-practice-surfaces.mjs
import fs from "node:fs";

const FILES = {
  "pillar-detail-client.tsx": "src/app/(main)/pillars/[pillarId]/pillar-detail-client.tsx",
  "pillar-reflections.ts": "src/data/pillar-reflections.ts",
};

const STEP_ARRAYS = [
  { name: "MORNING_STEPS",       pillar: "Morning Initiation",     file: "pillar-detail-client.tsx" },
  { name: "NUTRITION_STEPS",     pillar: "Nutrition & Fasting",    file: "pillar-detail-client.tsx" },
  { name: "BREATHING_STEPS",     pillar: "Breathing & Meditation", file: "pillar-detail-client.tsx" },
  { name: "THOUGHTS_STEPS",      pillar: "Thoughts & Intention",   file: "pillar-reflections.ts" },
  { name: "MOVEMENT_STEPS",      pillar: "Movement",                file: "pillar-reflections.ts" },
  { name: "HEALING_STEPS",       pillar: "Healing Meditation",     file: "pillar-reflections.ts" },
  { name: "SANDHYA_STEPS",       pillar: "Sandhya Meditation",     file: "pillar-reflections.ts" },
  { name: "BRAHMAN_STEPS",       pillar: "Brahman Connection",     file: "pillar-reflections.ts" },
  { name: "MANIFESTATION_STEPS", pillar: "Divine Manifestation",   file: "pillar-reflections.ts" },
  { name: "SLEEP_STEPS",         pillar: "Sleep Optimization",     file: "pillar-reflections.ts" },
];

function extractStepsBlock(src, arrayName) {
  const re = new RegExp(arrayName + "\\s*:\\s*YesNoStep\\[\\]\\s*=\\s*\\[");
  const m = src.match(re);
  if (!m) return null;
  let depth = 1;
  let i = m.index + m[0].length;
  while (i < src.length && depth > 0) {
    if (src[i] === "[") depth++;
    if (src[i] === "]") depth--;
    i++;
  }
  return src.slice(m.index + m[0].length, i - 1);
}

function parseSteps(block) {
  const steps = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < block.length; i++) {
    if (block[i] === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (block[i] === "}") {
      depth--;
      if (depth === 0) steps.push(block.slice(start, i + 1));
    }
  }
  return steps;
}

function summarize(stepText) {
  const titleM = stepText.match(/title:\s*"([^"]+)"/);
  const title = titleM ? titleM[1] : "?";
  const hasPractice = /practice:\s*\{/.test(stepText);
  let kind = null;
  if (hasPractice) {
    const kM = stepText.match(/kind:\s*"([^"]+)"/);
    kind = kM ? kM[1] : "?";
  }
  const mandatory = /mandatory:\s*(true|\{)/.test(stepText);
  return { title, hasPractice, kind, mandatory };
}

const sources = {};
for (const [k, p] of Object.entries(FILES)) {
  sources[k] = fs.readFileSync(p, "utf8");
}

const rows = [];
for (const { name, pillar, file } of STEP_ARRAYS) {
  const block = extractStepsBlock(sources[file], name);
  if (!block) {
    rows.push({ pillar, step: "MISSING ARRAY " + name, kind: null, mandatory: false });
    continue;
  }
  for (const s of parseSteps(block).map(summarize)) {
    rows.push({ pillar, step: s.title, kind: s.kind, mandatory: s.mandatory });
  }
}

console.log(
  "Pillar".padEnd(28) +
    "Step".padEnd(34) +
    "Practice".padEnd(14) +
    "Gated",
);
console.log("-".repeat(86));
for (const r of rows) {
  console.log(
    r.pillar.padEnd(28) +
      r.step.padEnd(34) +
      (r.kind ?? "—").padEnd(14) +
      (r.mandatory ? "yes" : "—"),
  );
}

const total = rows.length;
const withPractice = rows.filter((r) => r.kind).length;
console.log("");
console.log(`Steps with practice: ${withPractice} / ${total}`);
