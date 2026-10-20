#!/usr/bin/env python3
"""stills.py — contact sheet of chosen times at any aspect (onetake's stills.py squashes to 16:9).
  python3 tools/stills.py comp.html --times 0.5,2,4 --width 1080 --height 1920 --out sheet.png [--tile 360] [--cols 4] [--frames dir/]
--frames also writes each full-size frame as dir/t_<t>.png for close inspection."""
import argparse, asyncio, io, os
from PIL import Image, ImageDraw
from playwright.async_api import async_playwright
async def main():
    ap = argparse.ArgumentParser(); ap.add_argument("comp"); ap.add_argument("--times", required=True); ap.add_argument("--out", default="stills.png")
    ap.add_argument("--width", type=int, default=1920); ap.add_argument("--height", type=int, default=1080); ap.add_argument("--cols", type=int, default=4)
    ap.add_argument("--tile", type=int, default=480, help="tile width px"); ap.add_argument("--frames", default=None)
    a = ap.parse_args(); ts = [float(x) for x in a.times.split(",")]
    tw = a.tile; th = round(tw * a.height / a.width)
    if a.frames: os.makedirs(a.frames, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={"width": a.width, "height": a.height})
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
        await pg.goto("file://" + os.path.abspath(a.comp)); await pg.evaluate("window.__ready")
        tiles = []
        for t in ts:
            await pg.evaluate(f"window.__seek({t})"); await pg.wait_for_timeout(30)
            png = await pg.screenshot(); im = Image.open(io.BytesIO(png)).convert("RGB")
            if a.frames: im.save(os.path.join(a.frames, f"t_{t:07.3f}.png"))
            im = im.resize((tw, th), Image.LANCZOS); ImageDraw.Draw(im).text((6, 6), f"t={t}", fill=(255, 255, 0)); tiles.append(im)
        await b.close()
    rows = (len(tiles) + a.cols - 1) // a.cols; sheet = Image.new("RGB", (tw * a.cols, th * rows), (40, 40, 40))
    for i, im in enumerate(tiles): sheet.paste(im, ((i % a.cols) * tw, (i // a.cols) * th))
    sheet.save(a.out); print("wrote", a.out, "| page errors:", errs[:5] or "none")
if __name__ == "__main__":
    asyncio.run(main())
