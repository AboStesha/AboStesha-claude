# bed vs picture: spectrogram of the SFX bed (top), its level (cyan, 60 dB), cue sync points (green ticks), the
# render's graphics-change signal (blue bars) and shot cuts (red).  python3 overview.py bed.wav ms.npz edl.json cues.json t0 t1 out.png
import sys, os, json, numpy as np
from scipy import signal
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsp import read_wav, SR
bed, ms, edl, cues, t0, t1, out = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], float(sys.argv[5]), float(sys.argv[6]), sys.argv[7]
x = read_wav(bed); m = x.mean(1)
PX = 100  # px per second
W = int((t1 - t0) * PX); HS, HE, HM = 140, 60, 60
img = Image.new("RGB", (W + 40, HS + HE + HM + 40), (0, 0, 0)); dr = ImageDraw.Draw(img)
a, b = int(t0 * SR), int(t1 * SR)
f, t, Z = signal.stft(m[a:b], SR, nperseg=1024, noverlap=1024 - 480)
P = 20 * np.log10(np.abs(Z) + 1e-9)
fb = np.geomspace(40, 18000, HS); idx = np.searchsorted(f, fb).clip(0, len(f) - 1)
P = P[idx]; ti = np.searchsorted(t, np.arange(W) / PX).clip(0, len(t) - 1); P = P[:, ti]
g = np.clip((P + 95) / 65, 0, 1)
arr = np.zeros((HS, W, 3), np.uint8); arr[..., 0] = 255 * g ** 1.3; arr[..., 1] = 190 * g ** 2.2; arr[..., 2] = 80 * g
img.paste(Image.fromarray(arr[::-1]), (40, 0))
win = int(0.01 * SR); e = np.sqrt(np.convolve(np.max(x[a:b] ** 2, 1), np.ones(win) / win, "same")); E = 20 * np.log10(e + 1e-9)
pts = [(40 + i, HS + int(HE * (1 - np.clip((E[int(i / PX * SR)] + 60) / 60, 0, 1)))) for i in range(W) if int(i / PX * SR) < len(E)]
dr.line(pts, fill=(0, 255, 255)); dr.text((0, HS), "0dB", fill=(150, 150, 150)); dr.text((0, HS + HE - 10), "-60", fill=(150, 150, 150))
D = np.load(ms)["diff"]; shots = json.load(open(edl))["shots"]; ex = np.zeros(len(D))
for s in shots:
    sa, sb = s["f0"], min(s["f1"], len(D)); seg = D[sa + 1:sb]
    if len(seg): ex[sa + 1:sb] = np.maximum(0, seg - 2 * np.median(seg, 0) - 0.4).sum(axis=(1, 2))
mx = np.log1p(np.percentile(ex, 99.5))
for fr in range(int(t0 * 25), int(t1 * 25)):
    h = int(HM * min(1, np.log1p(ex[fr]) / mx)); xx = 40 + int((fr / 25 - t0) * PX)
    dr.rectangle([xx, HS + HE + HM - h, xx + 2, HS + HE + HM], fill=(70, 150, 255))
    if any(s["f0"] == fr for s in shots): dr.line([xx, 0, xx, HS + HE + HM], fill=(255, 0, 0))
for c in json.load(open(cues)):
    for l in [c] + c.get("layers", []):
        if t0 <= l["t"] < t1:
            xx = 40 + int((l["t"] - t0) * PX); col = (0, 255, 0) if l is c else (0, 140, 0)
            dr.line([xx, HS + HE + HM + 2, xx, HS + HE + HM + 14], fill=col, width=2)
for k in range(int(np.ceil(t0)), int(t1) + 1):
    xx = 40 + int((k - t0) * PX); dr.line([xx, HS + HE + HM + 16, xx, HS + HE + HM + 24], fill=(255, 255, 255)); dr.text((xx + 2, HS + HE + HM + 24), str(k), fill=(255, 255, 255))
img.save(out)
