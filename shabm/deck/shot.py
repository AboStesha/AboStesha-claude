import sys, os
from playwright.sync_api import sync_playwright
mode = sys.argv[1] if len(sys.argv)>1 else "light"
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None)
    ctx = b.new_context(viewport={"width":1440,"height":1000}, color_scheme="dark" if mode=="dark" else "light", reduced_motion="reduce")
    pg = ctx.new_page(); errs=[]
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://"+os.path.abspath("preview.html")); pg.wait_for_timeout(3200)
    print("hoverflow:", pg.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth"))
    print("js errors:", errs[:5]); total = pg.evaluate("document.body.scrollHeight"); print("height:", total)
    os.makedirs("shots", exist_ok=True); n=0
    for y in range(0, total, 1000):
        pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(170)
        pg.screenshot(path=f"shots/{mode}_{n:02d}.png"); n+=1
    b.close()
