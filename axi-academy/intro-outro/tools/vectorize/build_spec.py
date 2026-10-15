import json, math, re
import numpy as np
fit = json.load(open('vec/nib7_fit.json'))
cu, cl = np.array(fit['cu']), np.array(fit['cl'])
AX = 998.15; YT = 418.65; YB = 686.1; HWT = 19.2
ysh = fit['ysh']; xsh = fit['xsh']
corr = HWT - np.polyval(cu, YT)
def up(y): return np.polyval(cu, y) + corr * (ysh - y) / (ysh - YT)
def lo(y): return np.polyval(cl, y)
def bez_fit(ys, xs):
    """cubic bezier through endpoints, least-squares inner controls (chord-length t, 3 refinement passes)"""
    P = np.stack([xs, ys], 1); P0, P3 = P[0], P[-1]
    d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(P, axis=0), axis=1))]; t = d / d[-1]
    for _ in range(6):
        b0 = (1 - t) ** 3; b1 = 3 * (1 - t) ** 2 * t; b2 = 3 * (1 - t) * t ** 2; b3 = t ** 3
        A = np.stack([b1, b2], 1); R = P - np.outer(b0, P0) - np.outer(b3, P3)
        C, *_ = np.linalg.lstsq(A, R, rcond=None); P1, P2 = C
        # reparametrize: nearest t by Newton step
        def B(tt): return np.outer((1 - tt) ** 3, P0) + np.outer(3 * (1 - tt) ** 2 * tt, P1) + np.outer(3 * (1 - tt) * tt ** 2, P2) + np.outer(tt ** 3, P3)
        def dB(tt): return np.outer(3 * (1 - tt) ** 2, P1 - P0) + np.outer(6 * (1 - tt) * tt, P2 - P1) + np.outer(3 * tt ** 2, P3 - P2)
        Q = B(t); dQ = dB(t); num = ((Q - P) * dQ).sum(1); den = (dQ * dQ).sum(1) + 1e-9
        t = np.clip(t - num / den, 0, 1); t[0], t[-1] = 0, 1
    err = np.linalg.norm(B(t) - P, axis=1)
    return [P0.tolist(), P1.tolist(), P2.tolist(), P3.tolist()], float(err.max())
yu = np.linspace(YT, ysh, 200); yl = np.linspace(ysh, YB, 200)
bu, eu = bez_fit(yu, up(yu)); bl, el = bez_fit(yl, lo(yl))
print('bezier fit err upper', round(eu, 3), 'lower', round(el, 3), 'top hw', round(up(YT), 3), 'shoulder', round(ysh, 2), round(up(ysh), 2), round(lo(ysh), 2), 'bottom hw', round(lo(YB), 3))
spec = {
  'space': [2000, 1125], 'axis': AX,
  'tri': {'apex_y': 381.2, 'base_y': YT, 'hw': HWT},
  'nib': {'top_y': YT, 'bot_y': YB, 'upper': bu, 'lower': bl},   # right half, in offsets from the axis (x = hw)
  'slot': {'hw': 6.58, 'body_y0': 524.5, 'body_y1': 617.3, 'body_hw': 24.75, 'body_r': 7.6, 'cap_cy': 651.05},
  'bars': [{'cy': 704.68, 'h': 20.02, 'hl': 66.0}, {'cy': 731.51, 'h': 16.02, 'hl': 62.9}],
}
# axi letters: official polygons with per-letter transforms (image-7 space)
s = open('/home/user/AboStesha-claude/axi-academy/promo-15s/src/assets/brand_paths.js').read()
d = json.loads(s[s.index('{'):s.rindex('}') + 1])
polys = []
for sp in re.split(r'(?=M)', d['logo_axi']['fills'][0]['d'].strip()):
    if sp.strip(): polys.append(np.array([float(v) for v in re.findall(r'-?\d+\.?\d*', sp)]).reshape(-1, 2))
T = json.load(open('vec/word7_T.json'))
groups = [('a', [0, 1]), ('x', [2, 3]), ('i', [4, 5])]
gT = {'a': {0: T['a'], 1: T['a']}, 'x': {2: T['x'], 3: T['x']}, 'i': {4: T['istem'], 5: T['idot']}}
axi = []
for name, ids in groups:
    L = {'name': name, 'polys': []}
    for i in ids:
        sx, tx, sy, ty = gT[name][i]
        q = [[round(x * sx + tx, 2), round(y * sy + ty, 2)] for x, y in polys[i]]
        L['polys'].append({'hole': i == 1, 'pts': q})
    axi.append(L)
spec['axi'] = {'grow': 0.25, 'letters': axi}
# ACADEMY (harmonized A shape)
F = json.load(open('vec/academy7_fit2.json'))
spec['academy'] = {'T': F['T'], 'B': F['B'], 'letters': [{'kind': r['kind'], 'p': r['p'], 'polys': r['polys']} for r in F['letters']]}
json.dump(spec, open('vec/lockup_spec.json', 'w'))
print('spec written')
