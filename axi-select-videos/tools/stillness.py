#!/usr/bin/env python3
"""stillness.py — approximate verify_promo's rest leg from the comp itself (no render): seek every frame, screenshot,
downscale to 320 px wide, mean abs diff to the previous frame < 0.5 → still. Prints the still ratio and the moving windows.
  python3 tools/stillness.py reel/comp.html --width 1080 --height 1920 [--from 8 --to 19]"""
import argparse, asyncio, io, os
import numpy as np
from PIL import Image
from playwright.async_api import async_playwright
async def main():
    ap = argparse.ArgumentParser(); ap.add_argument('comp'); ap.add_argument('--width', type=int, default=1920); ap.add_argument('--height', type=int, default=1080)
    ap.add_argument('--fps', type=int, default=30); ap.add_argument('--from', dest='t0', type=float, default=0); ap.add_argument('--to', dest='t1', type=float, default=None)
    a = ap.parse_args()
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': a.width, 'height': a.height})
        await pg.goto('file://' + os.path.abspath(a.comp)); await pg.evaluate('window.__ready')
        dur = await pg.evaluate('window.__meta.dur'); t1 = a.t1 or dur
        prev = None; still = []; ts = []
        for i in range(int(a.t0 * a.fps), int(t1 * a.fps)):
            t = i / a.fps; await pg.evaluate(f'window.__seek({t})')
            im = Image.open(io.BytesIO(await pg.screenshot(type='jpeg', quality=90))).convert('L')
            im = np.asarray(im.resize((320, round(320 * a.height / a.width)), Image.BILINEAR), np.float32)
            if prev is not None: still.append(np.abs(im - prev).mean() < 0.5); ts.append(t)
            prev = im
        await b.close()
    still = np.array(still); print(f'still ratio {still.mean():.3f} over {len(still)} frames')
    runs = []; s0 = None
    for t, s in zip(ts, still):
        if s and s0 is None: s0 = t
        if not s and s0 is not None: runs.append((s0, t)); s0 = None
    if s0 is not None: runs.append((s0, ts[-1]))
    print('still runs >= 0.2 s:', [(round(x, 2), round(y, 2)) for x, y in runs if y - x >= 0.2])
asyncio.run(main())
