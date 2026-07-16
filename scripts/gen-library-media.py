"""Generate Library artwork via shared visual_assets (SDXL-Turbo).

- 12 mantra-category yantra/symbol artworks (square) used as MantraCard
  heroes behind the Devanagari text.
- 20 audio-item posters (16:9) for content-library cards that have no
  thumbnail (videos already use their YouTube covers).

Same art direction as the training media. Output: public/library-media/.
"""
import sys, os
sys.path.insert(0, r"C:\Projects\shared_visual")
from visual_assets import get_visual
from PIL import Image

STAGE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".media-stage")
OUT = r"C:\Projects\Vedic_transform\public\library-media"
os.makedirs(STAGE, exist_ok=True)
os.makedirs(OUT, exist_ok=True)

BRAND = ("warm saffron and gold tones, deep amber shadows, cinematic lighting, "
         "serene, photorealistic, no text, no faces")

# Mantra card heroes — symbolic, deity-respectful (objects and light, not
# figures). Dark-leaning compositions so white Devanagari stays readable.
MANTRA_CATEGORY_ART = {
    "foundational": f"weathered stone Om symbol carved in temple rock lit by a single diya flame, dark background, {BRAND}",
    "solar": f"blazing sunrise over calm water, rays through morning mist, dark foreground, {BRAND}",
    "healing": f"healing herbs, water ripples in a copper bowl and soft candlelight on dark stone, {BRAND}",
    "invocation-devata": f"brass temple bell with marigold garland in soft darkness, warm glow, {BRAND}",
    "vishnu": f"conch shell and lotus resting on dark blue silk in golden light, {BRAND}",
    "knowledge": f"ancient veena beside an open palm-leaf manuscript and a white lotus, dark scholarly light, {BRAND}",
    "abundance": f"brass bowl overflowing with golden grains and marigold petals in dramatic dark light, {BRAND}",
    "protection": f"a steady oil lamp flame surrounded by a ring of soft golden light in deep darkness, {BRAND}",
    "courage": f"a mountain summit breaking through clouds at fiery dawn, dark valley below, {BRAND}",
    "universal-peace": f"a single lotus on perfectly still dark water at misty dawn, {BRAND}",
    "daily-ritual": f"morning puja tray with incense smoke curling in a sunbeam, dark room, {BRAND}",
    "brahman": f"cosmic starfield dissolving into golden sacred geometry light, deep indigo darkness, {BRAND}",
}

# Audio posters keyed by content-library item id.
AUDIO_ART = {
    "audio-om-chanting": f"sound ripples radiating across dark water from a glowing singing bowl, {BRAND}",
    "audio-morning-mantra": f"first sunlight entering a quiet meditation room with a mala on a cushion, {BRAND}",
    "audio-pranayama-guided": f"incense smoke drawing a slow S-curve through golden light against darkness, {BRAND}",
    "audio-yoga-nidra": f"moonlit bedroom with a person resting in savasana under soft indigo light, {BRAND}",
    "audio-gratitude-meditation": f"hands cupped around a small glowing diya offered forward, dark warm background, {BRAND}",
    "audio-sandhya-evening": f"twilight sky over a riverbank with floating diya lamps, {BRAND}",
    "audio-chakra-healing": f"seven singing bowls in a row with soft light rising from each, dark room, {BRAND}",
    "audio-manifestation-visualization": f"a seed of light held between two palms in darkness, golden particles rising, {BRAND}",
    "mantra-gayatri": f"sunrise blazing through temple pillars, rays across misty courtyard, {BRAND}",
    "mantra-om-namah-shivaya": f"himalayan peak under moonlight with a trident silhouette and drifting snow, {BRAND}",
    "mantra-om-mani-padme-hum": f"a jewel-like dewdrop glowing inside a lotus at night, {BRAND}",
    "mantra-mahamrityunjaya": f"ancient banyan tree with a single steady flame at its roots in deep darkness, {BRAND}",
    "mantra-shanti": f"perfectly still lake at dusk mirroring soft stars, one ripple ring, {BRAND}",
    "mantra-guru": f"oil lamp passing light to another lamp, chain of small flames in darkness, {BRAND}",
    "mantra-lakshmi": f"lotus floating on water strewn with gold coins and marigold petals, dark opulent light, {BRAND}",
    "mantra-saraswati": f"white swan gliding on dark water beside a floating veena in dawn mist, {BRAND}",
    "mantra-hanuman-chalisa": f"ocean leap at sunrise, silhouette of a mountain carried across a golden sky, {BRAND}",
    "mantra-pavamana": f"a torch flame leading up dark temple stairs toward brilliant light, {BRAND}",
    "mantra-asato-ma": f"a doorway of golden light opening in darkness, rays spilling onto stone floor, {BRAND}",
    "mantra-purnamadah": f"full moon reflected whole in a still dark bowl of water, {BRAND}",
}

def gen(name, prompt, w, h):
    png = os.path.join(STAGE, f"{name}.png")
    r = get_visual(prompt, png, kind="image", width=1920, height=1080, style="cinematic")
    print(f"[gen] {name}: source={r.source}", flush=True)
    img = Image.open(png).convert("RGB")
    target = w / h
    iw, ih = img.size
    if iw / ih > target:
        nw = int(ih * target)
        img = img.crop(((iw - nw) // 2, 0, (iw - nw) // 2 + nw, ih))
    else:
        nh = int(iw / target)
        img = img.crop((0, (ih - nh) // 2, iw, (ih - nh) // 2 + nh))
    img = img.resize((w, h), Image.LANCZOS)
    webp = os.path.join(OUT, f"{name}.webp")
    img.save(webp, "WEBP", quality=78, method=6)
    print(f"[out] {name}.webp {os.path.getsize(webp)//1024}KB", flush=True)

for cat, prompt in MANTRA_CATEGORY_ART.items():
    gen(f"mantra-cat-{cat}", prompt, 800, 800)

for item_id, prompt in AUDIO_ART.items():
    gen(f"poster-{item_id}", prompt, 1280, 720)

print("ALL DONE", flush=True)
