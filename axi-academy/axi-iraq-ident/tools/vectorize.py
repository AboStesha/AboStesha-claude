# Trace the official Axi Iraq logo (ink on transparent, 2000x1667) into per-part SVG paths.
# Usage: python vectorize.py ref/logo.webp assets/logo.js
import sys, json
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
import potrace

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGBA'); A = np.array(im)[..., 3].astype(np.float32) / 255
H, W = A.shape
mask = A > 0.5
lab, n = ndimage.label(mask)
objs = ndimage.find_objects(lab)
comps = []
for i, sl in enumerate(objs):
    ys, xs = sl; area = int((lab[sl] == i + 1).sum())
    if area < 50: continue
    comps.append(dict(id=i + 1, x0=xs.start, x1=xs.stop, y0=ys.start, y1=ys.stop, area=area))

# name the parts from their position
def name(c):
    cx, cy = (c['x0'] + c['x1']) / 2, (c['y0'] + c['y1']) / 2
    if c['y1'] <= 1070:                       # the axi wordmark
        if c['x1'] < 840: return 'a'
        if c['x0'] > 1790: return 'i_dot' if c['y1'] < 240 else 'i_stem'
        return 'x_arm' if c['x1'] < 1300 and c['y1'] < 640 else 'x_body'
    if c['x0'] > 1930: return 'ar_alef1'          # العراق, right to left
    if c['x0'] > 1290 and c['x1'] > 1800: return 'ar_lam_ain_ra'
    if c['x0'] > 1250 and c['x1'] < 1360: return 'ar_alef2'
    if c['y1'] < 1190: return 'ar_qaf_dots'
    return 'ar_qaf'
for c in comps: c['name'] = name(c)
names = [c['name'] for c in comps]
assert len(set(names)) == len(names), names

def fmt(p): return f'{p.x:.1f} {p.y:.1f}'

# Corner-preserving smoothing. Potrace marks the true corners; every smooth run between corners is resampled
# every STEP px and Gaussian-smoothed along its arc length with its end points pinned. Straight runs stay
# straight. The faceting of the source (an old polygon trace) and its small jaggies go away.
STEP = 1.5
SIGMA = {'a': 20.0}                       # px in image space; everything else gets the default
def bez(p0, c1, c2, p3, t):
    u = 1 - t
    return (u**3 * p0[0] + 3*u*u*t * c1[0] + 3*u*t*t * c2[0] + t**3 * p3[0], u**3 * p0[1] + 3*u*u*t * c1[1] + 3*u*t*t * c2[1] + t**3 * p3[1])
def runs_of(curve):
    # returns a list of runs; each run is a dense list of points between two corners (or one closed run)
    pts, corner = [], []                 # dense points with a flag marking corners
    p0 = (curve.start_point.x, curve.start_point.y)
    for s in curve.segments:
        if s.is_corner:
            c = (s.c.x, s.c.y); e = (s.end_point.x, s.end_point.y)
            for q, isc in ((c, True), (e, False)):
                L = np.hypot(q[0] - p0[0], q[1] - p0[1]); n = max(1, int(L / STEP))
                for j in range(1, n + 1): pts.append((p0[0] + (q[0] - p0[0]) * j / n, p0[1] + (q[1] - p0[1]) * j / n)); corner.append(isc and j == n)
                p0 = q
        else:
            c1, c2, e = (s.c1.x, s.c1.y), (s.c2.x, s.c2.y), (s.end_point.x, s.end_point.y)
            fine = [bez(p0, c1, c2, e, k / 64) for k in range(65)]
            L = sum(np.hypot(fine[k+1][0] - fine[k][0], fine[k+1][1] - fine[k][1]) for k in range(64)); n = max(2, int(L / STEP))
            for j in range(1, n + 1): pts.append(bez(p0, c1, c2, e, j / n)); corner.append(False)
            p0 = e
    return np.array(pts), np.array(corner)
CORNER_DEG, NOTCH_PX = 28.0, 7.0
def real_corners(P, C):
    # keep a potrace corner only if the outline really turns there (facet vertices of the old trace turn ~10 deg),
    # and drop pairs of corners closer than NOTCH_PX (pixel jaggies)
    n = len(P); k = max(2, int(5 / STEP)); keep = np.zeros(n, bool)
    for i in np.nonzero(C)[0]:
        v1 = P[i] - P[(i - k) % n]; v2 = P[(i + k) % n] - P[i]
        cosang = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-9)
        keep[i] = np.degrees(np.arccos(np.clip(cosang, -1, 1))) > CORNER_DEG
    idx = np.nonzero(keep)[0]
    if len(idx) > 1:
        gaps = np.diff(np.concatenate([idx, [idx[0] + n]])) * STEP
        for j, g in enumerate(gaps):
            if g < NOTCH_PX: keep[idx[j]] = keep[idx[(j + 1) % len(idx)]] = False
    return keep
def smooth_closed(P, C, sigma):
    C = real_corners(P, C)
    n = len(P); out = P.copy()
    if sigma <= 0 or n < 8: return out
    r = int(3 * sigma / STEP); w = np.exp(-0.5 * (np.arange(-r, r + 1) * STEP / sigma) ** 2)
    idx = np.nonzero(C)[0]
    if len(idx) == 0:                    # one closed smooth loop: periodic convolution
        for d in (0, 1): out[:, d] = np.convolve(np.concatenate([P[-r:, d], P[:, d], P[:r, d]]), w / w.sum(), 'valid')
        return out
    for k in range(len(idx)):            # runs between consecutive corners, ends pinned
        i0, i1 = idx[k], idx[(k + 1) % len(idx)]
        run = [(i0 + j) % n for j in range((i1 - i0) % n + 1)]
        R = P[run]; m = len(R)
        if m < 5: continue
        # reflect around the pinned ends so the end points stay put and the tangents continue
        ext = np.concatenate([2 * R[0] - R[r:0:-1] if m > r else np.repeat(R[:1], r, 0), R, 2 * R[-1] - R[-2:-r-2:-1] if m > r + 1 else np.repeat(R[-1:], r, 0)])
        sm = np.stack([np.convolve(ext[:, d], w / w.sum(), 'valid') for d in (0, 1)], 1)
        out[run[1:-1]] = sm[1:-1]
    return out
def smooth_path(path, sigma):
    d = []
    for curve in path.curves:
        P, C = runs_of(curve); Q = smooth_closed(P, C, sigma)
        d.append('M ' + ' L '.join(f'{x:.2f} {y:.2f}' for x, y in Q) + ' Z')
    return ' '.join(d)
parts = {}
for c in comps:
    m = lab == c['id']
    # fill holes of this part only (holes come back from potrace as inner curves)
    bm = potrace.Bitmap(~m)   # potracer traces the dark (False) pixels
    path = bm.trace(turdsize=2, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0, opticurve=True, opttolerance=0.2)
    d = []
    for curve in path.curves:
        d.append('M ' + fmt(curve.start_point))
        for s in curve.segments:
            if s.is_corner: d.append('L ' + fmt(s.c) + ' L ' + fmt(s.end_point))
            else: d.append('C ' + fmt(s.c1) + ' ' + fmt(s.c2) + ' ' + fmt(s.end_point))
        d.append('Z')
    parts[c['name']] = dict(d=smooth_path(path, SIGMA.get(c['name'], 2.5)), bbox=[c['x0'], c['y0'], c['x1'], c['y1']], area=c['area'])

# verify: rasterize the traced curves (flattened) and compare with the mask
def flatten(curve, k=24):
    pts = [(curve.start_point.x, curve.start_point.y)]; p0 = curve.start_point
    for s in curve.segments:
        if s.is_corner: pts += [(s.c.x, s.c.y), (s.end_point.x, s.end_point.y)]
        else:
            for j in range(1, k + 1):
                t = j / k; u = 1 - t
                pts.append((u**3 * p0.x + 3*u*u*t * s.c1.x + 3*u*t*t * s.c2.x + t**3 * s.end_point.x,
                            u**3 * p0.y + 3*u*u*t * s.c1.y + 3*u*t*t * s.c2.y + t**3 * s.end_point.y))
        p0 = s.end_point
    return pts
SS = 2
acc = np.zeros((H * SS, W * SS), np.int32)
for nm, part in parts.items():
    for sub in part['d'].split('Z'):
        sub = sub.replace('M', '').strip()
        if not sub: continue
        pts = [tuple(float(v) * SS for v in q.split()) for q in sub.split(' L ')]
        layer = Image.new('L', (W * SS, H * SS), 0); ImageDraw.Draw(layer).polygon(pts, fill=1)
        acc ^= np.array(layer, np.int32)          # even-odd
R = np.array(Image.fromarray((acc * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR)) / 255
err = np.abs(R - A)
xor = ((R > 0.5) != mask).sum(); inter = ((R > 0.5) & mask).sum(); union = ((R > 0.5) | mask).sum()
print('parts', sorted(parts), 'IoU %.4f' % (inter / union), 'xor px', int(xor), 'mean|d| %.4f' % err.mean())
ys, xs = np.nonzero(mask); bb = [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]
Image.fromarray((np.clip(err * 4, 0, 1) * 255).astype(np.uint8)).save(out.replace('.js', '_err.png'))
js = '// Axi Iraq stacked logo (axi / العراق), traced from the official file. Image space %dx%d.\nwindow.AXIQ = ' % (W, H) + json.dumps(dict(w=W, h=H, bbox=bb, parts=parts), ensure_ascii=False, indent=1) + ';\n'
open(out, 'w').write(js); print('wrote', out, 'bbox', bb, 'bytes', len(js))
