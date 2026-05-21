# 10X Vedic Transform — Audio Audit

Every place audio is, could be, or should be — across the whole app. Sorted by
status so it's clear what works now and what needs files.

---

## ✅ Already working (procedural — no files needed)

These play via the Web Audio API. No bandwidth, no files, works offline.

| Where | Sound | Detail |
|---|---|---|
| `/sessions/` Meditation | Tambura-like drone | 3 sine oscillators (A2 + E3 + A3) for the full session |
| `/sessions/` Meditation | Interval bell | 528 Hz chime every 60 seconds |
| `/sessions/` Meditation | Completion chime | 528 Hz, 2.5 s bell at end |
| `/sessions/` Breathing | Inhale tone | Rising glide 220 → 440 Hz |
| `/sessions/` Breathing | Exhale tone | Falling glide 440 → 220 Hz |
| `/sessions/` Breathing | Hold tick | Brief 330 Hz tone |

Volume toggle on both screens. These can be **kept as the default** even when you add real recordings — the user can opt for procedural or recorded.

---

## 🔧 Could be upgraded with free, copyright-cleared sound files

Files I can source from public-domain / CC0 libraries (Pixabay, Freesound CC0, archive.org). I'll fetch + drop into `public/audio/` and wire them in.

| File | Purpose | Best free source |
|---|---|---|
| `tibetan-bowl.mp3` | Higher-quality bell for meditation interval + completion | Freesound CC0, Pixabay free |
| `tambura-drone-loop.mp3` | Real tambura recording, loops seamlessly | Pixabay royalty-free, archive.org |
| `om-3x.mp3` | 3 long Om chants for meditation intro | archive.org public domain |
| `singing-bowl-deep.mp3` | Phase-transition bell for breathing | Freesound CC0 |
| `birds-ambient.mp3` | Morning routine background | YouTube Audio Library / Pixabay |
| `flowing-water.mp3` | Hydration / cleansing step audio | Freesound CC0 |
| `evening-crickets.mp3` | Evening sandhya / sleep ritual | Freesound CC0 |
| `gentle-wind.mp3` | Pranayama background | Pixabay |
| `gong-final.mp3` | Big completion gong (movement/morning routine end) | Freesound CC0 |
| `ui-bell-soft.mp3` | UI checkpoint bell (step complete in morning routine) | Freesound CC0 |

**If you say yes, I'll fetch these myself and add them. Estimated total size: ~10-15 MB.** All confirmed CC0 / public-domain — no attribution issue.

---

## 🎤 Needs your production (voice + music — content you own)

These need actual recording. Procedural drone covers the gap until you produce them.

### Voice-guided meditations (9 tracks · ~135 minutes total)

| Title | Duration | What's spoken |
|---|---|---|
| Guided Healing Meditation for Emotional Release | 20 min | Body scan, emotional acknowledgment, letting go |
| Om Chanting Meditation | 10 min | Slow guided Om chants with breath cues |
| Morning Mantra & Intention Setting | 8 min | Gayatri Mantra + Sankalpa visualization |
| Guided Pranayama: Nadi Shodhana | 15 min | Step-by-step alternate nostril breathing |
| Yoga Nidra: Yogic Sleep | 25 min | Progressive relaxation + visualization |
| Gratitude & Heart Opening Meditation | 12 min | Heart-chakra visualization |
| Evening Sandhya | 10 min | Calming sunset wind-down |
| 7 Chakra Healing Sound Bath | 20 min | Bowls + binaural + minimal voice |
| Sankalpa: Guided Manifestation | 15 min | Intention-planting visualization |

### Sanskrit mantra chant recordings (12 tracks · ~119 minutes total)

Clean chant recordings, slow + clear pronunciation, optional tambura drone layered behind.

| # | Mantra | Duration |
|---|---|---|
| 1 | Gayatri Mantra — Oṁ Bhūr Bhuvaḥ Svaḥ | 11 min |
| 2 | Om Namah Shivaya | 10 min |
| 3 | Om Mani Padme Hum | 10 min |
| 4 | Mahamrityunjaya Mantra | 12 min |
| 5 | Shanti Mantra — Oṁ Shāntiḥ Shāntiḥ Shāntiḥ | 8 min |
| 6 | Guru Mantra — Gurur Brahmā Gurur Viṣṇuḥ | 9 min |
| 7 | Lakshmi Mantra — Oṁ Śrīṁ Mahālakṣmyai Namaḥ | 10 min |
| 8 | Saraswati Mantra — Oṁ Aiṁ Saraswatyai Namaḥ | 10 min |
| 9 | Hanuman Chalisa Opening Doha | 11 min |
| 10 | Pavamana Mantra — Asato Mā Sad Gamaya | 9 min |
| 11 | Asato Ma Sadgamaya (extended) | 10 min |
| 12 | Om Purnamadah Purnamidam | 9 min |

### Long-form videos (7 tracks · ~107 minutes total)

Upload to YouTube channel. See `docs/CONTENT_TO_PRODUCE.md` for full list.

---

## 📍 Where each audio plays in the app

| Page / Screen | Currently | After files added |
|---|---|---|
| `/sessions/` Meditation | Procedural drone + bells | Same OR optional real tambura background |
| `/sessions/` Breathing | Procedural inhale/exhale tones | Same OR optional water/wind background |
| `/sessions/` Movement | Silent | Background music + interval bells |
| `/sessions/` Morning Routine | Silent | Step-completion bell + optional bird ambient |
| `/sessions/` Fasting | Silent | Silent (intentional) |
| `/library/` Audio cards (21 entries) | Placeholder URLs | Real `.mp3` files via in-app audio player |
| `/library/` Video cards (8 entries) | YouTube channel root | Specific YouTube URLs |
| Push notifications | System default | System default (browsers don't accept custom sounds in service workers without user setup) |

---

## ⚙️ Specs for files you produce

When recording your own audio:

- **Format:** MP3, 128 kbps (good balance of quality + file size)
- **Sample rate:** 44.1 kHz
- **Channels:** Mono is fine for voice-only; stereo only for music/ambient
- **File size target:** Keep guided meditations under 30 MB so they load quickly on mobile
- **Volume:** Normalize to -16 LUFS for consistent playback across the library

For the in-app audio player, just give me the **public HTTPS URL** of each file (S3, your own CDN, anywhere accessible). The web app handles streaming + playback.

---

## Want me to do the free-files batch now?

If you say yes:
1. I'll fetch the 10 CC0/public-domain files listed above (~10-15 MB total)
2. Add them to `public/audio/`
3. Wire them into the morning routine, breathing background, meditation real-tambura option, etc.
4. Add a "real audio" toggle on relevant pages

Estimated time: 30 min from green-light to deployed. Then your task narrows to just the voice recordings + mantra chants + videos.
