# timeline strips of the graphics-change signal: x = time (4 px / frame), y = screen column (x position, left at top)
# usage: python3 strip.py ms.npz edl.json t0 t1 out.png [cues.json]
import sys, json, numpy as np
from PIL import Image, ImageDraw
ms, edl, t0, t1, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), sys.argv[5]
cues = json.load(open(sys.argv[6])) if len(sys.argv) > 6 else []
D = np.load(ms)["diff"]; F = len(D)
shots = json.load(open(edl))["shots"]
ex = np.zeros_like(D)
for s in shots:
    a, b = s["f0"], s["f1"]
    seg = D[a + 1:b]
    if len(seg) == 0: continue
    med = np.median(seg, axis=0)
    ex[a + 1:b] = np.maximum(0, seg - 2.0 * med - 0.4)
    ex[a] = 0  # cut frame
col = ex.sum(axis=1)            # (F, 30)
tot = ex.sum(axis=(1, 2))
f0, f1 = int(round(t0 * 25)), min(F, int(round(t1 * 25)))
PX = 4; W = (f1 - f0) * PX; H1 = 30 * 5; H2 = 90; H = H1 + H2 + 40
img = Image.new("RGB", (W + 60, H), (0, 0, 0)); dr = ImageDraw.Draw(img)
seg = col[f0:f1]; g = np.clip(seg / (np.percentile(col, 99.5) + 1e-6), 0, 1) ** 0.6
for i in range(f1 - f0):
    for c in range(30):
        v = int(255 * g[i, c])
        if v: dr.rectangle([60 + i * PX, c * 5, 60 + i * PX + PX - 1, c * 5 + 4], fill=(v, v, int(v * 0.6)))
tt = np.log1p(tot[f0:f1]); mx = np.log1p(np.percentile(tot, 99.8)) + 1e-6
for i in range(f1 - f0):
    h = int(H2 * min(1, tt[i] / mx)); dr.rectangle([60 + i * PX, H1 + H2 - h, 60 + i * PX + PX - 2, H1 + H2], fill=(90, 200, 255))
for s in shots:
    if f0 <= s["f0"] < f1:
        x = 60 + (s["f0"] - f0) * PX; dr.line([x, 0, x, H1 + H2], fill=(255, 0, 0), width=1)
        dr.text((x + 2, H1 + 2), str(s.get("k_beat") or s.get("note", "")[:2]), fill=(255, 80, 80))
for k in range(int(np.ceil(t0 * 10)), int(t1 * 10) + 1):
    t = k / 10; x = 60 + int((t * 25 - f0) * PX)
    if k % 10 == 0: dr.line([x, H1 + H2, x, H1 + H2 + 10], fill=(255, 255, 255)); dr.text((x + 2, H1 + H2 + 10), "%g" % t, fill=(255, 255, 255))
    else: dr.line([x, H1 + H2, x, H1 + H2 + 4], fill=(150, 150, 150))
for q in cues:
    t = q["t"]
    if t0 <= t < t1:
        x = 60 + int((t * 25 - f0) * PX); dr.line([x, H1 + H2 + 20, x, H1 + H2 + 34], fill=(0, 255, 0), width=2)
dr.text((2, 2), "x=0", fill=(200, 200, 200)); dr.text((2, H1 - 12), "x=1920", fill=(200, 200, 200))
img.save(out)
