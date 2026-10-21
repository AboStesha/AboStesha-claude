# build_void.py - static void masks for the L4 (virtual camera) and L5 (medium) plates.
# The HeyGen plates keep a lit backdrop behind Rabee (L4: a top-centre glow 8-21/255 above his head; L5: a glow right of
# his head 10-13/255) that survives the grade, so the void is not pure black there. For each angle:
#   presence = pixels brighter than THR (the backdrop never is) in >= MINF of the sampled frames (Rabee's whole range of
#   motion, plus the lit floor), holes filled, dilated by DIL px, feathered (Gaussian SIG px);
#   void alpha = 1 - presence, limited to the backdrop (L4: above the floor horizon, rows < 560 with a ramp to 620).
#   band alpha = 1 - (presence eroded 36 px, feathered): where fx.js also crushes dark pixels (luma <= 12/255 -> 0,
#   >= 22 kept), so the glow left between his silhouette and the envelope goes black while his own pixels stay
#   (L4 rows as above; L5 the whole frame).
# fx.js afterPlate draws the masks in plate px.
#   python3 -I build_void.py <plates_dir> <out_png> <L4|L5>   (writes <out>.png and <out>_band.png)
import sys, glob, numpy as np
from PIL import Image
from scipy import ndimage as nd
src, out, ang = sys.argv[1], sys.argv[2], sys.argv[3]
files = sorted(glob.glob(src + "/*.jpg"))
THR, STEP, MINF, DIL, SIG = 30, 3, 3, 26, 9
cnt = np.zeros((1080, 1920), np.int32); n = 0
for f in files[::STEP]:
    y = np.asarray(Image.open(f).convert("L"))
    cnt += y > THR; n += 1
pres = cnt >= MINF
pres = nd.binary_closing(pres, structure=np.ones((15, 15)), iterations=2)
pres = nd.binary_fill_holes(pres)
# keep only components touching the presenter / floor (drop isolated noise specks)
lab, k = nd.label(pres); sizes = nd.sum(pres, lab, range(1, k + 1))
keep = np.zeros(k + 1, bool); keep[1:] = sizes >= 4000
pres = keep[lab]
core = nd.binary_erosion(pres, structure=np.ones((3, 3)), iterations=36, border_value=1)  # his body runs off the bottom edge
pres = nd.binary_dilation(pres, structure=np.ones((3, 3)), iterations=DIL)
env = nd.gaussian_filter(pres.astype(np.float32), SIG)
va = 1.0 - np.clip(env, 0, 1)
if ang == "L4":
    rows = np.arange(1080, dtype=np.float32)[:, None]
    va *= np.clip((620 - rows) / 60.0, 0, 1)        # backdrop only: full above row 560, none below 620 (floor)
rows = np.arange(1080, dtype=np.float32)[:, None]
band = 1.0 - np.clip(nd.gaussian_filter(core.astype(np.float32), 8), 0, 1)
if ang == "L4": band *= np.clip((620 - rows) / 60.0, 0, 1)  # L4: backdrop only, never the floor
b8 = np.round(band * 255).astype(np.uint8)
rgba = np.zeros((1080, 1920, 4), np.uint8); rgba[..., :3] = 255; rgba[..., 3] = b8
Image.fromarray(rgba, "RGBA").save(out.replace(".png", "_band.png"), optimize=True)
a8 = np.round(va * 255).astype(np.uint8)
rgba = np.zeros((1080, 1920, 4), np.uint8); rgba[..., 3] = a8
Image.fromarray(rgba, "RGBA").save(out, optimize=True)
print(ang, "frames", n, "presence px", int(pres.sum()), "mask mean", round(float(va.mean()), 3))
# diagnostics: a frame with the mask applied, x6
f = np.asarray(Image.open(files[len(files) // 2]).convert("RGB")).astype(np.float32)
Yl = f.mean(-1, keepdims=True) / 255.0
K = np.clip((Yl - 12 / 255) / (10 / 255), 0, 1)
f = f * (1 - band[..., None] * (1 - K))
g = np.clip(f * (1 - va[..., None]) * 6, 0, 255).astype(np.uint8)
Image.fromarray(g).resize((960, 540)).save(out.replace(".png", "_chk.jpg"), quality=85)
Image.fromarray(np.concatenate([a8, b8], 1)).resize((960, 270)).save(out.replace(".png", "_a.jpg"), quality=85)
