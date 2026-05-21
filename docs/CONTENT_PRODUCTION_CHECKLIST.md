# 10X Vedic — Library Content Production Checklist

The library at `/library/` reads from `src/data/content-library.ts`. To make each
card functional, you need to produce the actual video / audio content and
provide a URL. Once you have a URL, send it to me with the card title and I'll
wire it in.

**URL formats accepted:**
- Videos → any YouTube URL (e.g. `https://www.youtube.com/watch?v=XXXX`)
- Audio → direct `.mp3` URL (upload to S3, Soundcloud, or any host that serves
  raw audio over HTTPS — NOT YouTube links, those won't play in the in-app
  audio player)

Total: **32 pieces** — 8 long-form videos, 21 audio meditations & mantras,
2 articles, 1 guide.

---

## 🎥 Long-form Videos (8) — upload to your @10xvedic YouTube channel

These play full-screen in a new tab. Format: educational/instructional videos.

| # | Title | Pillar | Target Duration | Topic |
|---|---|---|---|---|
| 1 | Designing Your Sacred Morning Routine | Morning Initiation | 12 min | Brahma Muhurta routine, cleansing rituals, intention-setting |
| 2 | Introduction to Sattvic Eating | Nutrition + Fasting | 18 min | Sattvic vs Rajasic vs Tamasic foods, meal guidelines, recipe demo |
| 3 | Pranayama Fundamentals: Breath as Medicine | Breathing + Meditation | 22 min | Nadi Shodhana, Kapalabhati, Bhramari — full demos for beginners |
| 4 | Vedic Movement: Beyond Modern Exercise | Movement | 15 min | Surya Namaskar walkthrough, mindful walking, body-breath union |
| 5 | Sandhya Vandana: The Twilight Meditation Practice | Sandhya Meditation | 16 min | Dawn/noon/dusk meditation, simplified modern version |
| 6 | Sankalpa: The Vedic Science of Manifestation | Divine Manifestation | 13 min | How to formulate + plant a Sankalpa during the 48-day cycle |
| 7 | Vedic Sleep Rituals for Deep Restoration | Sleep Optimization | 11 min | Ayurvedic sleep hygiene + short Yoga Nidra practice |

---

## 🎧 Audio Meditations (8) — guided in-app audio

These play inline in the website's audio player. Need `.mp3` files. Voiceover
+ optional ambient background music.

| # | Title | Pillar | Target Duration | What's guided |
|---|---|---|---|---|
| 1 | Guided Healing Meditation for Emotional Release | Healing Meditation | 20 min | Body scanning, emotional acknowledgment, letting go (Yoga Nidra style) |
| 2 | Om Chanting Meditation | Breathing + Meditation | 10 min | Slow Om chanting with pauses |
| 3 | Morning Mantra & Intention Setting | Morning Initiation | 8 min | Gayatri Mantra + Sankalpa visualization |
| 4 | Guided Pranayama: Nadi Shodhana | Breathing + Meditation | 15 min | Step-by-step alternate nostril breathing |
| 5 | Yoga Nidra: Yogic Sleep for Deep Rest | Sleep Optimization | 25 min | Progressive relaxation + body scan + visualization |
| 6 | Gratitude & Heart Opening Meditation | Gratitude | 12 min | Heart-chakra (Anahata) gratitude visualization |
| 7 | Evening Sandhya: Twilight Meditation | Sandhya Meditation | 10 min | Calming wind-down meditation for sunset |
| 8 | 7 Chakra Healing Sound Bath | Healing Meditation | 20 min | Tibetan/crystal bowls, binaural beats per chakra |
| 9 | Sankalpa: Guided Manifestation | Divine Manifestation | 15 min | Visualization for planting an intention |

---

## 🕉️ Mantras (13) — Sanskrit chant recordings

Just clean recordings of the mantras chanted slowly with proper pronunciation.
Voiceover + optional drone/tambura background. Need `.mp3` files.

| # | Title | Pillar | Target Duration | Source verse |
|---|---|---|---|---|
| 1 | Gayatri Mantra — Oṁ Bhūr Bhuvaḥ Svaḥ | Breathing + Meditation | 11 min | Rig Veda 3.62.10 |
| 2 | Om Namah Shivaya — Five-Syllable Mantra | Sandhya Meditation | 10 min | Shiva Purana / Yajur Veda |
| 3 | Om Mani Padme Hum — The Jewel in the Lotus | Gratitude | 10 min | Buddhist (Avalokiteshvara) |
| 4 | Mahamrityunjaya Mantra — Great Death-Conquering | Healing Meditation | 12 min | Rig Veda 7.59.12 |
| 5 | Shanti Mantra — Oṁ Shāntiḥ Shāntiḥ Shāntiḥ | Thoughts & Intention | 8 min | Vedic peace invocation |
| 6 | Guru Mantra — Gurur Brahmā Gurur Viṣṇuḥ | Gratitude | 9 min | Guru Stotram |
| 7 | Lakshmi Mantra — Oṁ Śrīṁ Mahālakṣmyai Namaḥ | Divine Manifestation | 10 min | Lakshmi bija mantra |
| 8 | Saraswati Mantra — Oṁ Aiṁ Saraswatyai Namaḥ | Thoughts & Intention | 10 min | Saraswati bija mantra |
| 9 | Hanuman Chalisa Opening Doha | Movement | 11 min | Tulsidas, Hanuman Chalisa |
| 10 | Pavamana Mantra — Asato Mā Sad Gamaya | Connection to Brahman | 9 min | Brihadaranyaka Upanishad 1.3.28 |
| 11 | Asato Ma Sadgamaya (Extended chant) | Sandhya Meditation | 10 min | Brihadaranyaka 1.3.28 (extended) |
| 12 | Om Purnamadah Purnamidam — Wholeness Mantra | Connection to Brahman | 9 min | Isha Upanishad Shanti Mantra |

---

## 📄 Articles + Guides (3) — written content

These don't need video/audio, just written content. Could be hosted as blog
posts on the site or external Medium/Substack articles.

| # | Title | Pillar | Target Duration | Topic |
|---|---|---|---|---|
| 1 | Mastering the Thought Reset Technique | Thoughts & Intention | 8 min read | Observing, interrupting, redirecting negative thought loops |
| 2 | The Neuroscience and Vedic Roots of Gratitude | Gratitude | 10 min read | How gratitude rewires neural pathways + Santosha principle |
| 3 | Understanding Brahman: The Universal Consciousness | Connection to Brahman | 14 min read | Accessible intro to Vedanta + Brahman concept |

---

## How to send me URLs

When you have a piece ready, send me a list like:

```
Gayatri Mantra → https://yourdomain.com/audio/gayatri.mp3
Designing Your Sacred Morning Routine → https://www.youtube.com/watch?v=ABC123
```

I'll then update `src/data/content-library.ts` and redeploy. Each card flips
from placeholder to working.

## Recording tips (optional)

- **Audio for the in-app player**: Record at 44.1 kHz, encode as 128 kbps MP3.
  Keep file size under 30 MB per piece for fast loading. Upload to S3 with
  public-read ACL, get the public URL.
- **Videos for YouTube**: Standard 1080p, 16:9. Set as Unlisted if you don't
  want them on your public channel browsing.
- **Mantras**: Single take with a clear voice. Optional tambura/shruti box
  drone in the background at low volume. Pronounce each syllable clearly with
  proper Sanskrit phonetics.
