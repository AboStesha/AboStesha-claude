import json
import numpy as np
from PIL import Image
a = np.load('vec/alpha7.npy').astype(np.float64); bg = np.load('vec/bg7.npy').astype(np.float64)
im = np.asarray(Image.open('ref/final_frame.webp').convert('RGB')).astype(np.float64)
H, W = a.shape; XS = np.arange(W)
def cross_all(v, base, step=1.0):
    out = []
    for i in range(1, len(v)):
        if (v[i - 1] - 0.5) * (v[i] - 0.5) < 0:
            out.append(base + (i - 1 + (0.5 - v[i - 1]) / (v[i] - v[i - 1])) * step)
    return out
best = None
for X0 in np.arange(996.0, 1001.01, 0.05):
    err = 0
    for y in range(425, 684, 3):
        d = np.arange(0, 120, 0.5)
        L = np.interp(X0 - d, XS, a[y]); R = np.interp(X0 + d, XS, a[y]); err += ((L - R) ** 2).sum()
    if best is None or err < best[0]: best = (err, X0)
X0 = round(best[1], 3); print('axis', X0)
D = np.arange(0, 130, 0.25)
S = {y: (np.interp(X0 - D, XS, a[y]) + np.interp(X0 + D, XS, a[y])) / 2 for y in range(370, 760)}
outer, inner = {}, {}
for y in range(410, 700):
    v = S[y]; c = cross_all(v[::-1], 0, 0.25)
    if c: outer[y] = round(float(D[-1] - c[0]), 3)
    if v[0] < 0.5:
        c2 = cross_all(v, 0, 0.25)
        if c2: inner[y] = round(c2[0], 3)
oy = sorted(outer); print('outer rows', oy[0], oy[-1], 'max', max(outer.values()), 'at', max(outer, key=outer.get))
iy = sorted(inner); print('hole rows', iy[0], iy[-1])
prev = None
for y in iy:
    if prev is None or abs(inner[y] - prev) > 0.6 or y in (iy[0], iy[-1]): print('  hole', y, inner[y])
    prev = inner[y]
def vcol(arr, x, y0, y1): return np.array([np.interp(x, XS, arr[y]) for y in range(y0, y1)])
for dx in (-15, 15): print('body col', dx, [round(v, 2) for v in cross_all(vcol(a, X0 + dx, 480, 640), 480)])
print('axis col', [round(v, 2) for v in cross_all(vcol(a, X0, 400, 760), 400)])
for x in (950, 980, 1020, 1045): print('bars col', x, [round(v, 2) for v in cross_all(vcol(a, x, 680, 760), 680)])
for y in (700, 704, 708, 728, 731, 734):
    print('bar row', y, [round(v, 2) for v in cross_all(a[y, 900:1100], 900)])
for dx in (-12, 12): print('nib top col', dx, [round(v, 2) for v in cross_all(vcol(a, X0 + dx, 405, 430), 405)])
ra = np.clip((bg[:, None, 1] - im[..., 1]) / (bg[:, None, 1] - 31.0), 0, 1); ra[a > 0.5] = 0
print('tri axis col', [round(v, 2) for v in cross_all(vcol(ra, X0, 375, 425), 375)])
tri = {}
for y in range(388, 418):
    c = cross_all(ra[y, 960:1040], 960)
    if len(c) == 2: tri[y] = (round(c[0], 2), round(c[1], 2))
for y in (390, 395, 400, 405, 410, 414, 416, 417): print(' tri row', y, tri.get(y))
json.dump({'X0': X0, 'outer': outer, 'inner': inner, 'tri': tri}, open('vec/nib7_meas.json', 'w'))
