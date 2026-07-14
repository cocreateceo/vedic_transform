"""Generate Introduction-experience artwork via shared visual_assets (SDXL-Turbo).

Phase 2 of the cinematic Introduction: five Dimension card illustrations,
the Alignment feature art, and the closing sunrise panorama. One consistent
art direction matching the chapter heroes in gen-training-media.py.
PNG staged to .media-stage, converted to sized WebP in public/training-media/.
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

# name -> (prompt, width, height)
ART = {
    # Five Dimensions cards (4:3)
    "intro-dim-consciousness": (
        f"person meditating in silhouette inside a glowing golden aura of concentric light rings, dark serene background, {BRAND}",
        800, 600),
    "intro-dim-health-energy": (
        f"morning sun rays streaming over a copper water vessel, fresh fruit and a folded yoga mat, vibrant healthy stillness, {BRAND}",
        800, 600),
    "intro-dim-relationships": (
        f"two hands gently passing a small lit diya oil lamp to another pair of hands at dusk, warm glow of giving, {BRAND}",
        800, 600),
    "intro-dim-leadership": (
        f"a lone lantern held high on a mountain ridge at dawn lighting the path for others below, {BRAND}",
        800, 600),
    "intro-dim-wealth-purpose": (
        f"brass bowl overflowing with golden grains and marigold petals beside a sprouting green seedling, abundance with growth, {BRAND}",
        800, 600),
    # Alignment feature card (portrait, sits beside the text)
    "intro-alignment": (
        f"a single lotus floating on perfectly still dark water, precisely aligned beneath a rising golden sun, symmetrical reflection, {BRAND}",
        800, 1000),
    # Closing panorama behind the sunrise CTA
    "intro-closing-sunrise": (
        f"vast golden sunrise panorama over Himalayan peaks with a small temple silhouette, light flooding the valley, hopeful new beginning, {BRAND}",
        1600, 900),
}

def gen(name, prompt, w, h):
    png = os.path.join(STAGE, f"{name}.png")
    r = get_visual(prompt, png, kind="image", width=1920, height=1080, style="cinematic")
    print(f"[gen] {name}: source={r.source}", flush=True)
    img = Image.open(png).convert("RGB")
    # center-crop to target aspect before resizing so portrait/landscape both work
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
    img.save(webp, "WEBP", quality=80 if w > 1000 else 75, method=6)
    kb = os.path.getsize(webp) // 1024
    print(f"[out] {name}.webp {kb}KB", flush=True)

for name, (prompt, w, h) in ART.items():
    gen(name, prompt, w, h)

print("ALL DONE", flush=True)
