import json, re
import numpy as np
from PIL import Image, ImageDraw
a = np.load('vec/alpha7.npy').astype(np.float64)
s = open('/home/user/AboStesha-claude/axi-academy/promo-15s/src/assets/brand_paths.js').read()
d = json.loads(s[s.index('{'):s.rindex('}') + 1])
polys = []
for sp in re.split(r'(?=M)', d['logo_axi']['fills'][0]['d'].strip()):
    if sp.strip():
        polys.append(np.array([float(v) for v in re.findall(r'-?\d+\.?\d*', sp)]).reshape(-1, 2))
groups = {'a': [0, 1], 'x': [2, 3], 'istem': [4], 'idot': [5]}
holes = {1}
regions = {'a': (345, 533, 492, 670), 'x': (533, 727, 496, 668), 'istem': (727, 786, 498, 668), 'idot': (727, 786, 442, 498)}
def edges(v, base):
    idx = np.nonzero(v > 0.5)[0]; i = idx[0]; j = idx[-1]
    return base + i - 1 + (0.5 - v[i - 1]) / (v[i] - v[i - 1]), base + j + (v[j] - 0.5) / (v[j] - v[j + 1])
T = {}
for g, ids in groups.items():
    x0, x1, y0, y1 = regions[g]; sub = a[y0:y1, x0:x1]
    ix0, ix1 = edges(sub.max(0), x0); iy0, iy1 = edges(sub.max(1), y0)
    P = np.concatenate([polys[i] for i in ids]); ox0, oy0 = P.min(0); ox1, oy1 = P.max(0)
    sx = (ix1 - ix0) / (ox1 - ox0); sy = (iy1 - iy0) / (oy1 - oy0)
    T[g] = [sx, ix0 - ox0 * sx, sy, iy0 - oy0 * sy]
    print(g, 'bbox', [round(v, 2) for v in (ix0, ix1, iy0, iy1)], 'sx', round(sx, 4), 'sy', round(sy, 4))
SS = 4; X0, Y0, w, h = 340, 440, 460, 235
def raster(T, grow=0.0):
    img = Image.new('L', (w * SS, h * SS), 0); dr = ImageDraw.Draw(img)
    for g, ids in groups.items():
        sx, tx, sy, ty = T[g]
        for i in ids:
            p = polys[i]; q = [((x * sx + tx - X0) * SS, (y * sy + ty - Y0) * SS) for x, y in p]
            dr.polygon(q, fill=0 if i in holes else 255)
            if grow > 0: dr.line(q + [q[0]], fill=255, width=max(1, int(round(2 * grow * SS))))
    return np.asarray(img.resize((w, h), Image.BOX)).astype(np.float64) / 255
A = a[Y0:Y0 + h, X0:X0 + w]
for grow in (0.0, 0.25, 0.5, 0.75):
    R = raster(T, grow); dd = R - A
    print('grow', grow, 'mean|d|', round(np.abs(dd).mean(), 4), 'sum R-A', round(dd.sum(), 1), 'n>0.5', int((np.abs(dd) > 0.5).sum()))
R = raster(T)
Image.fromarray((np.clip(np.stack([A, R, np.abs(R - A) * 2], 2), 0, 1) * 255).astype(np.uint8)).resize((w * 2, h * 2), Image.NEAREST).save('vec/word7_overlay.png')
json.dump(T, open('vec/word7_T.json', 'w'))
