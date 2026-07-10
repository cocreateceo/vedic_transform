"""Generate Training course media via shared visual_assets (SDXL-Turbo, cinematic).

Heroes for all 12 chapters + section art for published chapters.
PNG staged to scratchpad, converted to sized WebP in public/training-media/.
"""
import sys, os
sys.path.insert(0, r"C:\Projects\shared_visual")
from visual_assets import get_visual
from PIL import Image

STAGE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".media-stage")
OUT = r"C:\Projects\Vedic_transform\public\training-media"
os.makedirs(STAGE, exist_ok=True)
os.makedirs(OUT, exist_ok=True)

BRAND = ("warm saffron and gold tones, deep amber shadows, cinematic lighting, "
         "serene, photorealistic, no text, no people's faces in closeup")

HEROES = {
    "introduction": f"sunrise golden light over a Himalayan temple silhouette, mist in valley, {BRAND}",
    "connect-to-the-universe": f"a single ocean wave rising at dawn under a vast starry-to-golden sky, {BRAND}",
    "consciousness-and-self-awareness": f"person meditating in silhouette beside a perfectly still lake reflecting golden dawn light, {BRAND}",
    "vedic-meditation-and-healing": f"brass oil lamp diya with steady flame beside a blooming lotus flower, soft golden glow in darkness, {BRAND}",
    "dharma-and-purpose": f"a winding forest path leading toward brilliant golden light between ancient trees, {BRAND}",
    "health-energy-and-balance": f"copper water vessel and fresh sattvic fruits on a wooden table in warm morning sunlight, {BRAND}",
    "relationships-family-and-community": f"many hands together lighting small diya oil lamps at dusk, warm communal glow, {BRAND}",
    "leadership-through-consciousness": f"a great banyan tree sheltering the ground beneath, golden evening light rays through branches, {BRAND}",
    "ai-innovation-and-human-evolution": f"an intricate golden mandala pattern glowing with points of light like a constellation network, dark amber background, {BRAND}",
    "wealth-abundance-and-conscious-business": f"brass bowl overflowing with golden grains and marigold flowers, abundant harvest still life, {BRAND}",
    "creation-manifestation-and-transformation": f"a young green seedling glowing in a beam of golden sunrise light breaking through dark clouds, {BRAND}",
    "living-the-10x-vedic-life": f"family walking toward a lakeside temple at golden dusk, peaceful harmonious scene, {BRAND}",
}

SECTION_ART = {
    "introduction-summary": f"an open ancient palm-leaf manuscript beside a small diya flame, {BRAND}",
    "connect-to-the-universe-exercises": f"meditation cushion, mala beads and journal in soft morning light near a window, {BRAND}",
    "connect-to-the-universe-reflections": f"an open blank journal with a brass pen in warm lamplight, {BRAND}",
    "connect-to-the-universe-summary": f"a wave dissolving back into a calm golden ocean at dusk, {BRAND}",
    "consciousness-and-self-awareness-exercises": f"incense smoke rising in a sunbeam over a meditation space, {BRAND}",
    "consciousness-and-self-awareness-reflections": f"a hand-held brass mirror reflecting warm candlelight on a dark table, {BRAND}",
    "consciousness-and-self-awareness-summary": f"a still mountain lake at dawn mirroring the sky perfectly, {BRAND}",
}

def gen(name, prompt, w, h):
    png = os.path.join(STAGE, f"{name}.png")
    r = get_visual(prompt, png, kind="image", width=1920, height=1080, style="cinematic")
    print(f"[gen] {name}: source={r.source}", flush=True)
    img = Image.open(png).convert("RGB")
    img.thumbnail((w * 2, h * 2))  # keep detail, cap size
    img = img.resize((w, h), Image.LANCZOS) if img.size != (w, h) else img
    webp = os.path.join(OUT, f"{name}.webp")
    img.save(webp, "WEBP", quality=80 if w > 1000 else 75, method=6)
    kb = os.path.getsize(webp) // 1024
    print(f"[out] {name}.webp {kb}KB", flush=True)

for slug, prompt in HEROES.items():
    gen(f"hero-{slug}", prompt, 1600, 900)

for name, prompt in SECTION_ART.items():
    gen(name, prompt, 800, 500)

print("ALL DONE", flush=True)
