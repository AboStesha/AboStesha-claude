import json, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
S = json.load(open('vec/lockup_spec.json'))
AX = S['axis']
def bez(P, n=60):
    P = np.array(P); t = np.linspace(0, 1, n)[:, None]
    return ((1 - t) ** 3 * P[0] + 3 * (1 - t) ** 2 * t * P[1] + 3 * (1 - t) * t ** 2 * P[2] + t ** 3 * P[3]).tolist()
def nib_poly():
    n = S['nib']; s = S['slot']; YT = n['top_y']; YB = n['bot_y']
    hw, by0, by1, bhw, r, cy = s['hw'], s['body_y0'], s['body_y1'], s['body_hw'], s['body_r'], s['cap_cy']
    right = [(AX + x, y) for x, y in bez(n['upper']) + bez(n['lower'])[1:]]
    left = [(2 * AX - x, y) for x, y in right[::-1]]
    def arc(cx, cy, rr, a0, a1, k=16): return [(cx + rr * math.cos(t), cy + rr * math.sin(t)) for t in np.linspace(a0, a1, k)]
    slot = [(AX - hw, YT), (AX - hw, by0)]
    slot += arc(AX - bhw + r, by0 + r, r, -math.pi / 2, -math.pi)  # top-left corner (going left/down)
    slot += arc(AX - bhw + r, by1 - r, r, math.pi, math.pi / 2)
    slot += [(AX - hw, by1), (AX - hw, cy)]
    slot += arc(AX, cy, hw, math.pi, 0, 24)[1:-1]  # round cap (bottom), y down: angles pi->0 through +pi/2 (bottom)
    slot += [(AX + hw, cy), (AX + hw, by1)]
    slot += arc(AX + bhw - r, by1 - r, r, math.pi / 2, 0)
    slot += arc(AX + bhw - r, by0 + r, r, 0, -math.pi / 2)
    slot += [(AX + hw, by0), (AX + hw, YT)]
    top_r = (AX + S['tri']['hw'], YT); top_l = (AX - S['tri']['hw'], YT)
    return slot + [top_r] + right[1:] + left[:-1] + [top_l]
def tri_poly():
    t = S['tri']; return [(AX - t['hw'], t['base_y']), (AX, t['apex_y']), (AX + t['hw'], t['base_y'])]
def bar_poly(b):
    r = b['h'] / 2; pts = []
    for cx, a0, a1 in ((AX + b['hl'] - r, -math.pi / 2, math.pi / 2), (AX - b['hl'] + r, math.pi / 2, 3 * math.pi / 2)):
        pts += [(cx + r * math.cos(t), b['cy'] + r * math.sin(t)) for t in np.linspace(a0, a1, 24)]
    return pts
def render(SS=4, box=(0, 0, 2000, 1125), red=False):
    x0, y0, x1, y1 = box; w, h = x1 - x0, y1 - y0
    img = Image.new('L', (w * SS, h * SS), 0); dr = ImageDraw.Draw(img)
    T = lambda pts: [((x - x0) * SS, (y - y0) * SS) for x, y in pts]
    if red:
        dr.polygon(T(tri_poly()), fill=255)
    else:
        dr.polygon(T(nib_poly()), fill=255)
        for b in S['bars']: dr.polygon(T(bar_poly(b)), fill=255)
        for L in S['axi']['letters']:
            for p in L['polys']:
                if not p['hole']:
                    dr.polygon(T(p['pts']), fill=255); dr.line(T(p['pts'] + [p['pts'][0]]), fill=255, width=int(round(2 * S['axi']['grow'] * SS)))
            for p in L['polys']:
                if p['hole']:
                    dr.polygon(T(p['pts']), fill=0); dr.line(T(p['pts'] + [p['pts'][0]]), fill=255, width=int(round(2 * S['axi']['grow'] * SS)))
        for L in S['academy']['letters']:
            for fill, poly in L['polys']: dr.polygon(T(poly), fill=fill)
    return np.asarray(img.resize((w, h), Image.BOX)).astype(np.float64) / 255
if __name__ == '__main__':
    a = np.load('vec/alpha7.npy').astype(np.float64)
    R = render()
    ra = render(red=True)
    for name, box in (('axi', (340, 440, 790, 670)), ('nib', (870, 410, 1130, 750)), ('academy', (1180, 555, 1720, 612))):
        x0, y0, x1, y1 = box; d = R[y0:y1, x0:x1] - a[y0:y1, x0:x1]
        print(name, 'mean|d|', round(np.abs(d).mean(), 4), 'n|d|>0.5', int((np.abs(d) > 0.5).sum()))
    np.save('vec/R7.npy', R.astype(np.float32)); np.save('vec/R7red.npy', ra.astype(np.float32))
    x0, y0, x1, y1 = 870, 375, 1130, 750
    A = a[y0:y1, x0:x1]; Rr = R[y0:y1, x0:x1]
    Image.fromarray((np.clip(np.stack([A, Rr, np.abs(Rr - A) * 2], 2), 0, 1) * 255).astype(np.uint8)).resize(((x1 - x0) * 3, (y1 - y0) * 3), Image.NEAREST).save('vec/nib7_overlay.png')
