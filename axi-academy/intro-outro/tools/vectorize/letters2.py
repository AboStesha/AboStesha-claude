import json, math
import numpy as np
from PIL import Image, ImageDraw
a = np.load('vec/alpha7.npy').astype(np.float64)
H, W = a.shape; XS = np.arange(W)
def cross_all(v, base):
    out = []
    for i in range(1, len(v)):
        if (v[i - 1] - 0.5) * (v[i] - 0.5) < 0: out.append(base + i - 1 + (0.5 - v[i - 1]) / (v[i] - v[i - 1]))
    return out
# cap top / baseline from flat letters (E arms, D, M stems)
tops, bots = [], []
for x in list(range(1516, 1540, 3)) + [1436, 1438, 1590, 1592, 1624, 1626]:
    c = cross_all(a[555:612, x], 555)
    tops.append(c[0]); bots.append(c[-1])
T, B = float(np.median(tops)), float(np.median(bots))
core = float(np.median([a[583, x] for x in range(1514, 1520)]))
print('cap top', round(T, 3), 'baseline', round(B, 3), 'cap', round(B - T, 3), 'core alpha', round(core, 3))
def ell(cx, cy, rx, ry, a0, a1, n=72):
    return [(cx + rx * math.cos(t), cy - ry * math.sin(t)) for t in np.linspace(a0, a1, n)]
def shapes(kind, p):
    t, b = T, B
    if kind == 'A':
        cx, hb, wl, ft, yc, wh = p
        def xo(y, s):  # outer edge x at y
            u = (y - t) / (b - t); return cx + s * (ft / 2 + (hb - ft / 2) * u)
        y1, y2 = yc - wh / 2, yc + wh / 2
        return [(255, [(cx - ft / 2, t), (cx - ft / 2 + wl, t), (cx - hb + wl, b), (cx - hb, b)]),
                (255, [(cx + ft / 2, t), (cx + ft / 2 - wl, t), (cx + hb - wl, b), (cx + hb, b)]),
                (255, [(xo(y1, -1), y1), (xo(y1, 1), y1), (xo(y2, 1), y2), (xo(y2, -1), y2)])]
    if kind == 'C':
        cx, cy, rx, ry, w, a1, a2 = p
        outer = ell(cx, cy, rx, ry, a1, 2 * math.pi - a2, 120)
        inner = ell(cx, cy, rx - w, ry - w, 2 * math.pi - a2, a1, 120)
        return [(255, outer + inner)]
    if kind == 'D':
        xl, ws, xb, rx, wh, wc = p
        cy, ry = (t + b) / 2, (b - t) / 2
        outer = [(xl, b), (xl, t)] + ell(xb, cy, rx, ry, math.pi / 2, -math.pi / 2, 90)
        inner = [(xl + ws, b - wh), (xl + ws, t + wh)] + ell(xb, cy, max(1, rx - wc), ry - wh, math.pi / 2, -math.pi / 2, 90)
        return [(255, outer), (0, inner)]
    if kind == 'E':
        xl, ws, wt, wm, wb, Lt, Lm, Lb, ym = p
        R = lambda x0, x1, y0, y1: [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
        return [(255, R(xl, xl + ws, t, b)), (255, R(xl, xl + Lt, t, t + wt)), (255, R(xl, xl + Lm, ym - wm / 2, ym + wm / 2)), (255, R(xl, xl + Lb, b - wb, b))]
    if kind == 'M':
        xl, xr, ws, wd, yv, fv, ds = p
        cx = (xl + xr) / 2
        R = lambda x0, x1, y0, y1: [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
        return [(255, R(xl, xl + ws, t, b)), (255, R(xr - ws, xr, t, b)),
                (255, [(xl + ds, t), (xl + ds + wd, t), (cx + fv / 2, yv), (cx - fv / 2, yv)]),
                (255, [(xr - ds, t), (xr - ds - wd, t), (cx - fv / 2, yv), (cx + fv / 2, yv)])]
    if kind == 'Y':
        cx, hw, wd, yj, ws = p
        return [(255, [(cx - hw, t), (cx - hw + wd, t), (cx + ws / 2, yj), (cx - ws / 2, yj)]),
                (255, [(cx + hw, t), (cx + hw - wd, t), (cx - ws / 2, yj), (cx + ws / 2, yj)]),
                (255, [(cx - ws / 2, yj), (cx + ws / 2, yj), (cx + ws / 2, b), (cx - ws / 2, b)])]
SS = 4
def render(kind, p, box):
    x0, y0, x1, y1 = box; w, h = x1 - x0, y1 - y0
    img = Image.new('L', (w * SS, h * SS), 0); dr = ImageDraw.Draw(img)
    for fill, poly in shapes(kind, p):
        dr.polygon([((x - x0) * SS, (y - y0) * SS) for x, y in poly], fill=fill)
    return np.asarray(img.resize((w, h), Image.BOX)).astype(np.float64) / 255
def nm(f, x0, step, iters=900):
    n = len(x0); pts = [np.array(x0, float)] + [np.array(x0, float) + np.eye(n)[i] * step[i] for i in range(n)]
    vals = [f(p) for p in pts]
    for _ in range(iters):
        o = np.argsort(vals); pts = [pts[i] for i in o]; vals = [vals[i] for i in o]
        c = np.mean(pts[:-1], 0); xr = c + (c - pts[-1]); fr = f(xr)
        if fr < vals[0]:
            xe = c + 2 * (c - pts[-1]); fe = f(xe)
            pts[-1], vals[-1] = (xe, fe) if fe < fr else (xr, fr)
        elif fr < vals[-2]: pts[-1], vals[-1] = xr, fr
        else:
            xc = c + 0.5 * (pts[-1] - c); fc = f(xc)
            if fc < vals[-1]: pts[-1], vals[-1] = xc, fc
            else:
                pts = [pts[0]] + [pts[0] + 0.5 * (q - pts[0]) for q in pts[1:]]; vals = [vals[0]] + [f(q) for q in pts[1:]]
    i = int(np.argmin(vals)); return pts[i], vals[i]
cap = B - T
letters = [
    ('A', (1186, 559, 1243, 608), [1214.1, 21.541, 8.681, 8.666, 590.865, 7.64]),
    ('C', (1267, 559, 1317, 609), [1293.0, (T + B) / 2, 19.5, 20.0, 7.6, 0.75, 0.75]),
    ('A', (1341, 559, 1398, 608), [1369.9, 21.4, 8.6, 1.5, T + 0.66 * cap, 6.0]),
    ('D', (1426, 559, 1477, 608), [1433.1, 7.6, 1451.0, 19.5, 7.0, 7.6]),
    ('E', (1507, 559, 1550, 608), [1513.47, 8.28, 6.9, 6.9, 6.9, 30.1, 27.9, 30.4, 583.9]),
    ('M', (1580, 559, 1635, 608), [1586.7, 1628.7, 8.06, 9.8, 593.3, 2.6, 0.0]),
    ('Y', (1660, 559, 1714, 608), [1686.9, 20.2, 9.5, T + 0.5 * cap, 7.6]),
]
res = []
for kind, box, p0 in letters:
    x0, y0, x1, y1 = box; tgt = np.clip(a[y0:y1, x0:x1] / core, 0, 1)
    f = lambda p: ((render(kind, p, box) - tgt) ** 2).sum()
    step = [0.6] * len(p0)
    if kind == 'C': step = [0.5, 0.5, 0.5, 0.5, 0.4, 0.05, 0.05]
    p, v = nm(f, p0, step)
    p, v = nm(f, p, [s * 0.4 for s in step], 600)
    R = render(kind, p, box)
    print(kind, 'loss', round(v, 3), 'mean|d|', round(np.abs(R - tgt).mean(), 4), 'params', [round(float(q), 3) for q in p])
    res.append({'kind': kind, 'box': box, 'p': [float(q) for q in p], 'polys': [(fl, [(round(x, 3), round(y, 3)) for x, y in poly]) for fl, poly in shapes(kind, p)]})
json.dump({'T': T, 'B': B, 'letters': res}, open('vec/academy7_fit2.json', 'w'))
# overlay
x0, y0, x1, y1 = 1186, 557, 1716, 610
img = Image.new('L', ((x1 - x0) * SS, (y1 - y0) * SS), 0); dr = ImageDraw.Draw(img)
for r in res:
    for fill, poly in r['polys']: dr.polygon([((x - x0) * SS, (y - y0) * SS) for x, y in poly], fill=fill)
R = np.asarray(img.resize((x1 - x0, y1 - y0), Image.BOX)).astype(np.float64) / 255
A = np.clip(a[y0:y1, x0:x1] / core, 0, 1)
print('total mean|d|', round(np.abs(R - A).mean(), 4))
Image.fromarray((np.clip(np.stack([A, R, np.abs(R - A) * 2], 2), 0, 1) * 255).astype(np.uint8)).resize(((x1 - x0) * 3, (y1 - y0) * 3), Image.NEAREST).save('vec/academy7_fit2_overlay.png')
big = Image.new('L', ((x1 - x0) * 6, (y1 - y0) * 6), 0); dr = ImageDraw.Draw(big)
for r in res:
    for fill, poly in r['polys']: dr.polygon([((x - x0) * 6, (y - y0) * 6) for x, y in poly], fill=fill)
big.crop((0, 0, 1600, (y1 - y0) * 6)).save('vec/academy7_clean2_1.png'); big.crop((1500, 0, (x1 - x0) * 6, (y1 - y0) * 6)).save('vec/academy7_clean2_2.png')
