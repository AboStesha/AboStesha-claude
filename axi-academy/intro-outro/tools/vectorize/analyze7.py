import json
import numpy as np
from PIL import Image
im = np.asarray(Image.open('ref/final_frame.webp').convert('RGB')).astype(np.float64)
H, W, _ = im.shape
far = np.concatenate([im[:, 30:320], im[:, 1760:1970]], axis=1)
bg = np.median(far, axis=1)
for y in (20, 300, 560, 800, 1100):
    print('row', y, 'bg', bg[y].round(1), 'dev x=200,1000,1850', [(im[y, x] - bg[y]).round(1).tolist() for x in (200, 1000, 1850)])
den = 255.0 - bg; wts = den ** 2
a = np.clip(((im - bg[:, None, :]) / den[:, None, :] * wts[:, None, :]).sum(2) / wts.sum(1)[:, None], 0, 1)
np.save('vec/alpha7.npy', a.astype(np.float32)); np.save('vec/bg7.npy', bg.astype(np.float32))
red = (im[..., 0] > 150) & (im[..., 1] < 110) & (im[..., 2] < 120)
ys, xs = np.nonzero(red); print('red bbox', xs.min(), xs.max(), ys.min(), ys.max())
m = a > 0.5
def segs(v):
    idx = np.nonzero(v)[0]; out = []; s = idx[0]; p = idx[0]
    for i in idx[1:]:
        if i != p + 1: out.append((s, p)); s = i
        p = i
    out.append((s, p)); return out
cols = segs(m[300:800].any(0))
for c0, c1 in cols:
    rs = segs(m[300:800, c0:c1 + 1].any(1))
    print('col seg', c0, c1, 'rows', [(300 + r0, 300 + r1) for r0, r1 in rs])
stops = [[round(y / (H - 1), 4)] + bg[y].round(2).tolist() for y in range(0, H, 25)] + [[1.0] + bg[H - 1].round(2).tolist()]
json.dump(stops, open('vec/bg7_stops.json', 'w'))
# compare bg gradients of both images (normalized position)
bg6 = np.load('vec/bg.npy')
for f in (0, 0.25, 0.5, 0.75, 0.9, 1.0):
    print('grad', f, 'img7', bg[int(f * (H - 1))].round(1), 'img6', bg6[int(f * (len(bg6) - 1))].round(1))
