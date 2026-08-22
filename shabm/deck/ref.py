# Renders the agreed cube drawings to clean PNGs so they can be handed to the
# image model as a visual reference — the render must follow OUR design, not
# the model's idea of an ice cube.
import os, sys, art
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
JOBS = [("ref_exterior", art.cube_exterior(), 1600, 1100),
        ("ref_interior", art.cube_interior(), 1600, 1000)]
page_tpl = """<!doctype html><html><head><meta charset="utf-8">
<style>html,body{{margin:0;padding:0;background:#fff}}
 body{{width:{w}px;height:{h}px;display:flex;align-items:center;justify-content:center}}
 svg{{width:96%;height:96%}}
 svg *{{stroke:#111 !important}}
 text{{fill:#111 !important;stroke:none !important}}
</style></head><body>{svg}</body></html>"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium"
                          if os.path.exists("/opt/pw-browsers/chromium") else None)
    for name, svg, w, h in JOBS:
        pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=2)
        pg.set_content(page_tpl.format(svg=svg, w=w, h=h))
        pg.wait_for_timeout(400)
        out = os.path.join(HERE, name + ".png")
        pg.screenshot(path=out)
        print("wrote", out, os.path.getsize(out), "bytes")
        pg.close()
    b.close()
