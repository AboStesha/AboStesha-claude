# contact sheet of log-frequency spectrograms (+ dB envelope in cyan, L-R side energy in magenta) for palette files
# usage: python3 specsheet.py out.png tmax file1.wav file2.wav ...
import sys, os, numpy as np
from scipy import signal
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsp import read_wav, SR
out, tmax, files = sys.argv[1], float(sys.argv[2]), sys.argv[3:]
PW, PH, cols = 300, 130, 3
rows = (len(files) + cols - 1) // cols
img = Image.new("RGB", (cols * PW, rows * (PH + 14)), (0, 0, 0)); dr = ImageDraw.Draw(img)
fbins = np.geomspace(30, 20000, PH)
for i, fn in enumerate(files):
    x = read_wav(fn); m = x.mean(1); s = (x[:, 0] - x[:, 1]) / 2
    f, t, Z = signal.stft(m, SR, nperseg=1024, noverlap=1024 - 240)
    P = 20 * np.log10(np.abs(Z) + 1e-9)
    idx = np.searchsorted(f, fbins).clip(0, len(f) - 1)
    P = P[idx]  # (PH, T)
    T = int(PW * min(1, (len(m) / SR) / tmax))
    cols_t = np.linspace(0, min(len(m) / SR, tmax), PW)
    ti = np.searchsorted(t, cols_t).clip(0, len(t) - 1)
    P = P[:, ti]; mx = P.max()
    g = np.clip((P - (mx - 65)) / 65, 0, 1)
    ox, oy = (i % cols) * PW, (i // cols) * (PH + 14)
    arr = np.zeros((PH, PW, 3), np.uint8)
    arr[..., 0] = (255 * g ** 1.2).astype(np.uint8); arr[..., 1] = (200 * g ** 2).astype(np.uint8); arr[..., 2] = (90 * g).astype(np.uint8)
    arr = arr[::-1]
    img.paste(Image.fromarray(arr), (ox, oy + 14))
    # envelope (dB, 5 ms) over 60 dB
    w = int(0.005 * SR); a = np.sqrt(np.convolve(np.max(x ** 2, 1), np.ones(w) / w, "same")); A = 20 * np.log10(a + 1e-9)
    As = 20 * np.log10(np.sqrt(np.convolve(s ** 2, np.ones(w) / w, "same")) + 1e-9)
    pts = []; pts2 = []
    for c in range(PW):
        k = int(cols_t[c] * SR)
        if k >= len(A): break
        pts.append((ox + c, oy + 14 + int(PH * (1 - np.clip((A[k] + 60) / 60, 0, 1)))))
        pts2.append((ox + c, oy + 14 + int(PH * (1 - np.clip((As[k] + 60) / 60, 0, 1)))))
    if len(pts) > 1: dr.line(pts2, fill=(255, 0, 255), width=1); dr.line(pts, fill=(0, 255, 255), width=1)
    for fr in [100, 1000, 10000]:
        y = oy + 14 + PH - 1 - int(np.searchsorted(fbins, fr)); dr.line([ox, y, ox + 6, y], fill=(255, 255, 255))
    for tk in np.arange(0, tmax + 1e-9, 0.25):
        xx = ox + int(PW * tk / tmax); dr.line([xx, oy + PH + 10, xx, oy + PH + 13], fill=(200, 200, 200))
    dr.text((ox + 2, oy + 1), os.path.basename(fn)[:-4], fill=(255, 255, 255))
    dr.rectangle([ox, oy + 14, ox + PW - 1, oy + PH + 13], outline=(60, 60, 60))
img.save(out)
