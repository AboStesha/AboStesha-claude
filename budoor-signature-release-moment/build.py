import sys, os
from playwright.sync_api import sync_playwright
src=os.path.abspath(sys.argv[1]); out=sys.argv[2]; exe=sys.argv[3] if len(sys.argv)>3 else None
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=exe) if exe else p.chromium.launch()
    pg=b.new_page(viewport={"width":1920,"height":1080})
    pg.goto("file://"+src, wait_until="networkidle"); pg.wait_for_timeout(1500)
    pg.emulate_media(media="print")
    pg.pdf(path=out, width="1920px", height="1080px", print_background=True, prefer_css_page_size=True, margin={"top":"0","bottom":"0","left":"0","right":"0"})
    n=pg.evaluate("document.querySelectorAll('.page').length")
    if len(sys.argv)>4:
        os.makedirs(sys.argv[4],exist_ok=True)
        for i in range(n):
            pg.evaluate(f"document.querySelectorAll('.page')[{i}].scrollIntoView()")
            pg.screenshot(path=f"{sys.argv[4]}/p{i+1:02d}.jpg", clip={"x":0,"y":0,"width":1920,"height":1080}, type="jpeg", quality=70)
    b.close(); print("pages",n)
