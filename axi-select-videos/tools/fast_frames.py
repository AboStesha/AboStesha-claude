#!/usr/bin/env python3
"""fast_frames.py — frames whose shutter wants more captures than render.py's cap: far = __motion over the open shutter,
S = ceil(far / gap). Prints a JSON list of frame indices with S > cap (plus a 1-frame margin).
  python3 tools/fast_frames.py explainer/comp.html --width 1920 --height 1080 --gap 24 --cap 12 > fast.json"""
import argparse, asyncio, json, math, os, sys
from playwright.async_api import async_playwright
async def main():
    ap = argparse.ArgumentParser(); ap.add_argument('comp'); ap.add_argument('--width', type=int, default=1920); ap.add_argument('--height', type=int, default=1080)
    ap.add_argument('--fps', type=int, default=30); ap.add_argument('--shutter', type=float, default=180); ap.add_argument('--gap', type=float, default=24); ap.add_argument('--cap', type=int, default=12)
    a = ap.parse_args()
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': a.width, 'height': a.height})
        await pg.goto('file://' + os.path.abspath(a.comp)); await pg.evaluate('window.__ready')
        dur = await pg.evaluate('window.__meta.dur'); N = round(dur * a.fps); op = a.shutter / 360 / a.fps
        S = await pg.evaluate(f"""(() => {{ const out = []; for (let i = 0; i < {N}; i++) {{ const t = i / {a.fps};
            out.push(window.__motion(Math.max(t - {op}/2, 0), Math.min(t + {op}/2, {dur} - 1e-6))); }} return out; }})()""")
        await b.close()
    need = [math.ceil(f / a.gap) for f in S]; fast = sorted({j for i, s in enumerate(need) if s > a.cap for j in (i - 1, i, i + 1) if 0 <= j < N})
    print(json.dumps(fast)); print(f'{len(fast)} frames over cap {a.cap}; max S wanted {max(need)}', file=sys.stderr)
asyncio.run(main())
