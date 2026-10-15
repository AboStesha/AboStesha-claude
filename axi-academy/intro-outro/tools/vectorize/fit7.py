import json
import numpy as np
M = json.load(open('vec/nib7_meas.json'))
o = {int(k): v for k, v in M['outer'].items() if 419 <= int(k) <= 686}
def fit(y0, y1, deg):
    ys = np.array([y for y in range(y0, y1 + 1) if y in o], float); xs = np.array([o[int(y)] for y in ys])
    c = np.polyfit(ys, xs, deg); r = xs - np.polyval(c, ys)
    return c, np.abs(r).max(), np.sqrt((r ** 2).mean())
for deg in (3, 4, 5):
    cu, mu, su = fit(420, 559, deg); cl, ml, sl = fit(565, 685, deg)
    print('deg', deg, 'upper', round(mu, 3), round(su, 3), 'lower', round(ml, 3), round(sl, 3))
cu, _, _ = fit(420, 559, 4); cl, _, _ = fit(565, 685, 3)
ys = np.linspace(556, 568, 12001); d = np.polyval(cu, ys) - np.polyval(cl, ys); i = np.argmin(np.abs(d))
ysh, xsh = ys[i], np.polyval(cu, ys[i])
print('shoulder', round(ysh, 3), round(xsh, 3), 'top hw at 418.65', round(np.polyval(cu, 418.65), 3), 'bottom hw at 686.1', round(np.polyval(cl, 686.1), 3))
# compare with image-6 shape scaled anisotropically
f6 = json.load(open('vec/nib_fit.json'))
cu6, cl6 = np.array(f6['cu']), np.array(f6['cl'])
best = None
for sx in np.arange(0.73, 0.76, 0.0005):
    for sy in np.arange(0.71, 0.73, 0.0005):
        err = []
        for y7, hw in o.items():
            y6 = 199.57 + (y7 - 418.65) / sy
            pred = sx * (np.polyval(cu6, y6) if y6 < f6['ysh'] else np.polyval(cl6, y6))
            err.append(pred - hw)
        e = np.array(err); s = np.sqrt((e ** 2).mean())
        if best is None or s < best[0]: best = (s, sx, sy, np.abs(e).max())
print('img6 shape scaled: rms', round(best[0], 3), 'sx', round(best[1], 4), 'sy', round(best[2], 4), 'max', round(best[3], 3))
json.dump({'cu': cu.tolist(), 'cl': cl.tolist(), 'ysh': ysh, 'xsh': xsh}, open('vec/nib7_fit.json', 'w'))
