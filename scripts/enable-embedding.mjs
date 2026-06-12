// One-off admin tool: enable "Allow embedding" on every video of the
// authenticated YouTube channel via the YouTube Data API v3.
//
// Needs a short-lived OAuth access token with the scope
//   https://www.googleapis.com/auth/youtube.force-ssl
// Get one from https://developers.google.com/oauthplayground (see chat steps).
//
// Usage (token stays on your machine):
//   YT_TOKEN=ya29.xxxx node scripts/enable-embedding.mjs
//   YT_TOKEN=ya29.xxxx node scripts/enable-embedding.mjs --dry   (preview only)

const TOKEN = process.env.YT_TOKEN;
const DRY = process.argv.includes("--dry");
const BASE = "https://www.googleapis.com/youtube/v3";

if (!TOKEN) {
  console.error("Missing YT_TOKEN env var. See instructions.");
  process.exit(1);
}

const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

async function api(path, init = {}) {
  const res = await fetch(BASE + path, { ...init, headers: { ...H, ...(init.headers || {}) } });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch {}
  if (!res.ok) {
    const msg = json?.error?.message || text;
    throw new Error(`${res.status} ${path.split("?")[0]} — ${msg}`);
  }
  return json;
}

// 1. Find the authenticated channel's uploads playlist
const ch = await api("/channels?part=contentDetails,snippet&mine=true");
const channel = ch.items?.[0];
if (!channel) { console.error("No channel for this token."); process.exit(1); }
const uploads = channel.contentDetails.relatedPlaylists.uploads;
console.log(`Channel: ${channel.snippet.title}  (uploads: ${uploads})`);

// 2. Page through all uploaded videos
const ids = [];
let pageToken = "";
do {
  const pl = await api(`/playlistItems?part=contentDetails&maxResults=50&playlistId=${uploads}${pageToken ? `&pageToken=${pageToken}` : ""}`);
  for (const it of pl.items || []) ids.push(it.contentDetails.videoId);
  pageToken = pl.nextPageToken || "";
} while (pageToken);
console.log(`Found ${ids.length} videos.\n`);

// 3. For each: read status, enable embedding if needed
let updated = 0, already = 0, failed = 0;
for (let i = 0; i < ids.length; i += 50) {
  const batch = ids.slice(i, i + 50);
  const list = await api(`/videos?part=status,snippet&id=${batch.join(",")}`);
  for (const v of list.items || []) {
    const title = (v.snippet?.title || "").slice(0, 60);
    if (v.status?.embeddable === true) { already++; console.log(`  ok    ${v.id}  ${title}`); continue; }
    if (DRY) { console.log(`  DRY   ${v.id}  ${title}  (would enable)`); continue; }
    try {
      await api("/videos?part=status", {
        method: "PUT",
        body: JSON.stringify({ id: v.id, status: { ...v.status, embeddable: true } }),
      });
      updated++;
      console.log(`  FIXED ${v.id}  ${title}`);
    } catch (e) {
      failed++;
      console.log(`  FAIL  ${v.id}  ${title}  — ${String(e.message).slice(0, 80)}`);
    }
  }
}

console.log(`\nDone. enabled=${updated}  already-on=${already}  failed=${failed}  total=${ids.length}`);
