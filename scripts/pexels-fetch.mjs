#!/usr/bin/env node
/**
 * Fetch a curated set of Pexels images AND videos for the app and cache
 * them locally under public/images/pexels/ and public/videos/pexels/.
 *
 * Reads two manifests:
 *   - scripts/pexels-manifest.json        (images, .jpg)
 *   - scripts/pexels-video-manifest.json  (videos, .mp4)
 *
 * Writes:
 *   - public/images/pexels/<slug>.jpg
 *   - public/images/pexels/manifest.json
 *   - public/videos/pexels/<slug>.mp4
 *   - public/videos/pexels/manifest.json
 *
 * Idempotent: an entry whose file already exists is skipped unless
 * --force is passed. The PEXELS_API_KEY env var must be set.
 *
 * Usage:
 *   PEXELS_API_KEY=xxxxxx node scripts/pexels-fetch.mjs
 *   PEXELS_API_KEY=xxxxxx node scripts/pexels-fetch.mjs --force
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import https from "node:https";
import url from "node:url";

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const IMAGE_MANIFEST_IN = path.join(ROOT, "scripts", "pexels-manifest.json");
const IMAGE_OUT_DIR = path.join(ROOT, "public", "images", "pexels");
const IMAGE_MANIFEST_OUT = path.join(IMAGE_OUT_DIR, "manifest.json");

const VIDEO_MANIFEST_IN = path.join(ROOT, "scripts", "pexels-video-manifest.json");
const VIDEO_OUT_DIR = path.join(ROOT, "public", "videos", "pexels");
const VIDEO_MANIFEST_OUT = path.join(VIDEO_OUT_DIR, "manifest.json");

const API_KEY = process.env.PEXELS_API_KEY;
const FORCE = process.argv.includes("--force");

if (!API_KEY) {
  console.error("FATAL: PEXELS_API_KEY env var is required.");
  console.error("Get a free key at https://www.pexels.com/api/");
  process.exit(2);
}

function fetchJson(reqUrl) {
  return new Promise((resolve, reject) => {
    https.get(reqUrl, { headers: { Authorization: API_KEY } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${reqUrl}`));
        return;
      }
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on("error", reject);
  });
}

function downloadBinary(reqUrl, outPath) {
  return new Promise((resolve, reject) => {
    https.get(reqUrl, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${reqUrl}`));
        return;
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", async () => {
        try {
          await fs.writeFile(outPath, Buffer.concat(chunks));
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

async function fetchImages() {
  await fs.mkdir(IMAGE_OUT_DIR, { recursive: true });
  const manifest = JSON.parse(await fs.readFile(IMAGE_MANIFEST_IN, "utf8"));
  const existing = await fs.readFile(IMAGE_MANIFEST_OUT, "utf8").catch(() => "{}");
  const cache = JSON.parse(existing);

  let fetched = 0, skipped = 0;
  for (const entry of manifest.entries) {
    const { slug, query, orientation = "landscape" } = entry;
    const outImg = path.join(IMAGE_OUT_DIR, `${slug}.jpg`);

    if (!FORCE && cache[slug]) {
      try { await fs.access(outImg); skipped++; continue; } catch {}
    }

    console.log(`→ img/${slug}  "${query}"`);
    const search = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=${orientation}`;
    const data = await fetchJson(search);
    const photo = data.photos?.[0];
    if (!photo) { console.warn(`  no image results for "${query}"`); continue; }
    await downloadBinary(photo.src.large, outImg);
    cache[slug] = {
      query, width: photo.width, height: photo.height,
      photographer: photo.photographer, photographer_url: photo.photographer_url,
      pexels_url: photo.url, alt: photo.alt || query,
    };
    fetched++;
    await new Promise((r) => setTimeout(r, 1000));
  }

  await fs.writeFile(IMAGE_MANIFEST_OUT, JSON.stringify(cache, null, 2));
  return { fetched, skipped };
}

async function fetchVideos() {
  // Optional — skip silently if the video manifest doesn't exist yet.
  try { await fs.access(VIDEO_MANIFEST_IN); } catch { return { fetched: 0, skipped: 0 }; }

  await fs.mkdir(VIDEO_OUT_DIR, { recursive: true });
  const manifest = JSON.parse(await fs.readFile(VIDEO_MANIFEST_IN, "utf8"));
  const existing = await fs.readFile(VIDEO_MANIFEST_OUT, "utf8").catch(() => "{}");
  const cache = JSON.parse(existing);

  let fetched = 0, skipped = 0;
  for (const entry of manifest.entries) {
    const { slug, query, orientation = "landscape", min_duration_sec = 6, max_duration_sec = 30 } = entry;
    const outVid = path.join(VIDEO_OUT_DIR, `${slug}.mp4`);

    if (!FORCE && cache[slug]) {
      try { await fs.access(outVid); skipped++; continue; } catch {}
    }

    console.log(`→ vid/${slug}  "${query}"`);
    const search = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=10&orientation=${orientation}`;
    const data = await fetchJson(search);
    // Pick the shortest clip in the duration window that has an HD file ≤ 1280px wide
    // (anything bigger bloats the public/ folder for a hero loop).
    const candidates = (data.videos || []).filter(
      (v) => v.duration >= min_duration_sec && v.duration <= max_duration_sec,
    );
    candidates.sort((a, b) => a.duration - b.duration);
    const vid = candidates[0] ?? data.videos?.[0];
    if (!vid) { console.warn(`  no video results for "${query}"`); continue; }

    // Pick the highest-quality file under 1280px wide (or smallest if none small enough)
    const files = (vid.video_files || []).filter((f) => f.file_type === "video/mp4");
    files.sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
    const file = files.find((f) => (f.width ?? 0) <= 1280) ?? files[0];
    if (!file?.link) { console.warn(`  no usable mp4 for "${query}"`); continue; }

    await downloadBinary(file.link, outVid);
    cache[slug] = {
      query, duration: vid.duration, width: vid.width, height: vid.height,
      file_width: file.width, file_height: file.height,
      photographer: vid.user?.name, photographer_url: vid.user?.url,
      pexels_url: vid.url, poster: vid.image,
    };
    fetched++;
    await new Promise((r) => setTimeout(r, 1500));
  }

  await fs.writeFile(VIDEO_MANIFEST_OUT, JSON.stringify(cache, null, 2));
  return { fetched, skipped };
}

async function main() {
  const img = await fetchImages();
  const vid = await fetchVideos();
  console.log(`\nImages: fetched ${img.fetched}, skipped ${img.skipped}.`);
  console.log(`Videos: fetched ${vid.fetched}, skipped ${vid.skipped}.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
