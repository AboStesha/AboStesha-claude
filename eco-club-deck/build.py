#!/usr/bin/env python3
"""Assemble the deck into one self-contained HTML file.

Slides are data (src/content.py); this file renders them, inlines the font, CSS, JS and the
WebP renders that are actually used, and writes:
  index.html            standalone page (works offline, from a USB stick or a browser)
  dist/artifact.html    the same page without the document skeleton, for the Artifact host
"""
import base64, html, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / 'src'
sys.path.insert(0, str(SRC))
import content as C  # noqa: E402

AR = '٠١٢٣٤٥٦٧٨٩'
def ar(s): return ''.join(AR[int(c)] if c.isdigit() else c for c in str(s))
def esc(s): return html.escape(s, quote=True)

def kicker(s, d=0):
    k, lat = s.get('kicker', ''), s.get('lat', '')
    return f'<div class="kicker" data-a style="--d:{d}">{k}<span class="lat">{lat}</span></div>' if k else ''

def chips(items, d=4):
    return f'<div class="chips" data-a style="--d:{d}">' + ''.join(f'<span class="chip">{c}</span>' for c in items) + '</div>' if items else ''

def copy_block(s, size='h-l'):
    t = f'<h2 class="{size}" data-a style="--d:1">{s["title"]}</h2>'
    ln = f'<p class="line" data-a style="--d:2">{s["line"]}</p>' if s.get('line') else ''
    return f'<div class="copy">{kicker(s)}{s.get("pre", "")}{t}{ln}{chips(s.get("chips", []))}{s.get("extra", "")}</div>'

def tile(img, title='', sub='', tag='', d=3, cls=''):
    cap = f'<div class="cap"><b>{title}</b>{f"<span>{sub}</span>" if sub else ""}</div>' if title else ''
    t = f'<span class="tag">{tag}</span>' if tag else ''
    return f'<div class="tile {cls}" data-tilt data-a style="--d:{d}"><img data-img="{img}" alt="{esc(title or img)}">{t}{cap}</div>'

def frame_tabs(s):
    fid = 'f-' + s['id']
    views = ''.join(f'<div class="view{" is-on" if i == 0 else ""}" data-k="{v["k"]}"><img data-img="{v["img"]}" alt="{esc(v["label"])}"></div>'
                    for i, v in enumerate(s['views']))
    btns = ''.join(f'<button type="button" data-k="{v["k"]}" aria-selected="{"true" if i == 0 else "false"}">{v["label"]}</button>'
                   for i, v in enumerate(s['views']))
    panes = ''.join(f'<p class="line pane{" is-on" if i == 0 else ""}" data-pane="{v["k"]}">{v["text"]}</p>' for i, v in enumerate(s['views']))
    frame = f'<div class="frame" id="{fid}" data-depth=".6" data-a style="--d:2">{views}</div>'
    copy = (f'<div class="copy">{kicker(s)}<h2 class="h-l" data-a style="--d:1">{s["title"]}</h2>'
            f'<div class="tabs" data-tabs="{fid}" data-a style="--d:2">{btns}</div><div data-a style="--d:3">{panes}</div>{chips(s.get("chips", []))}</div>')
    return f'<div class="split{" flip" if s.get("flip") else ""}">{copy}{frame}</div>'

def render(s):
    t = s['type']
    attrs = {'id': 's-' + s['id'], 'data-chapter': s['chapter'], 'data-title': s.get('short', re.sub('<[^>]+>', '', s['title']))}
    if s.get('bg'): attrs['data-bg'] = s['bg']
    if s.get('thumb'): attrs['data-thumb'] = s['thumb']
    attrs['data-veil'] = s.get('veil', 'side')
    if s.get('tone'): attrs['data-tone'] = s['tone']
    if s.get('particles'): attrs['data-particles'] = '1'
    cls = f'slide t-{t} s-{s["id"]} ' + ' '.join(s.get('cls', []))
    a = ' '.join(f'{k}="{esc(v)}"' for k, v in attrs.items())

    if t == 'cover':
        body = (f'<div class="cover-brand">{kicker(s)}<h1 class="h-xl" data-words>{s["title"]}</h1>'
                f'<p class="line" data-a style="--d:6">{s["line"]}</p>'
                f'<div class="cover-meta" data-a style="--d:8"><button class="btn" type="button" data-magnetic data-go="s-{s["next"]}">ابدأ الجولة'
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button>'
                f'<span class="small">{s.get("note", "")}</span></div></div>')
    elif t == 'full':
        body = copy_block(s, s.get('size', 'h-l'))
    elif t == 'pillars':
        body = copy_block(s, 'h-m') + '<div class="pillars">' + ''.join(tile(p['img'], p['title'], p['sub'], p.get('tag', ''), 3 + i) for i, p in enumerate(s['items'])) + '</div>'
    elif t == 'audience':
        tiles = ''.join(f'<div class="tile" data-tilt data-a style="--d:{3 + i}"><img data-img="{p["img"]}" alt="{esc(p["who"])}">'
                        f'<div class="cap"><b>{p["age"]}</b><span class="who">{p["who"]}</span><span>{p["sub"]}</span></div></div>' for i, p in enumerate(s['items']))
        body = copy_block(s, 'h-m') + f'<div class="aud">{tiles}</div>'
    elif t == 'plan':
        pins = ''.join(f'<button type="button" class="pin" data-z="{z["n"]}" style="right:{100 - z["x"]}%;top:{z["y"]}%;--zc:{z["c"]}" aria-label="{esc(z["name"])}">{ar(z["n"])}</button>' for z in s['zones'])
        rows = ''.join(f'<button type="button" class="zone-row" data-z="{z["n"]}" data-name="{esc(z["name"])}" data-note="{esc(z["note"])}" style="--zc:{z["c"]}"><i>{ar(z["n"])}</i><span>{z["name"]}</span></button>' for z in s['zones'])
        body = (f'<div class="plan-wrap"><div class="plan-pic" data-a style="--d:2"><img data-img="{s["img"]}" alt="المخطط من الأعلى">{pins}'
                f'<div class="zone-info" data-idle="{esc(s["idle"])}">{s["idle"]}</div></div>'
                f'<div class="copy">{kicker(s)}<h2 class="h-s plan-title" data-a style="--d:1">{s["title"]}</h2>'
                f'<div class="zone-list" data-a style="--d:3">{rows}</div></div></div>')
    elif t == 'tabs':
        body = frame_tabs(s)
    elif t == 'mosaic':
        tiles = ''.join(tile(p['img'], p.get('title', ''), p.get('sub', ''), p.get('tag', ''), 3 + i) for i, p in enumerate(s['items']))
        body = copy_block(s, s.get('size', 'h-m')) + f'<div class="mosaic {s.get("grid", "m2")}">{tiles}</div>'
    elif t == 'workshops':
        tiles = ''.join(tile(p['img'], p['title'], p.get('sub', ''), '', 3 + i) for i, p in enumerate(s['items']))
        cards = ''.join(f'<div class="card" data-tilt data-a style="--d:{5 + i // 3}"><b>{w["title"]}</b><span>{w["line"]}</span></div>' for i, w in enumerate(s['list']))
        body = copy_block(s, 'h-m') + f'<div class="ws">{tiles}</div><div class="ws-list">{cards}</div>'
    elif t == 'eco':
        pics = ''.join(tile(p['img'], p['title'], '', '', 2 + i) for i, p in enumerate(s['pics']))
        cards = ''.join(f'<div class="card" data-tilt data-a style="--d:{3 + i // 2}"><b>{w["title"]}</b><span>{w["line"]}</span></div>' for i, w in enumerate(s['list']))
        body = (f'<div class="copy" style="max-width:none">{kicker(s)}<h2 class="h-m" data-a style="--d:1">{s["title"]}</h2></div>'
                f'<div class="eco" style="margin-top:26px"><div class="eco-pics">{pics}</div><div class="cards">{cards}</div></div>')
    elif t == 'week':
        days = ''.join(f'<div class="day{" peak" if d.get("peak") else ""}" data-a style="--d:{3 + i}"><h4>{d["day"]}<small>{d["en"]}</small></h4>' + ''.join(f'<p>{x}</p>' for x in d['items']) + '</div>' for i, d in enumerate(s['days']))
        body = copy_block(s, 'h-m') + f'<div class="week">{days}</div>'
    elif t == 'members':
        cards = ''.join(f'<div class="card" data-tilt data-a style="--d:{3 + i}"><span class="ix">{ar(str(i + 1).zfill(2))}</span><b>{m["name"]}</b><span class="who">{m["who"]}</span><ul>' + ''.join(f'<li>{p}</li>' for p in m['perks']) + '</ul></div>' for i, m in enumerate(s['items']))
        body = copy_block(s, 'h-m') + f'<div class="cards c4 bottom">{cards}</div>'
    elif t == 'close':
        body = (f'<div class="copy">{kicker(s)}<h2 class="h-xl" data-words>{s["title"]}</h2><p class="line" data-a style="--d:5">{s["line"]}</p>'
                f'<div data-a style="--d:7"><button class="btn ghost" type="button" data-go="s-cover">العودة إلى البداية</button></div></div>')
    else:
        raise SystemExit('unknown slide type ' + t)
    return f'<section class="{cls.strip()}" {a}>{body}</section>'

SHELL = '''<title>نادي البيئة الثقافي</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="نادي البيئة الثقافي في بغداد: موسيقى، مغامرة، ثقافة، وبيئة لجيل الشباب.">
<style>
{FONTS}
{CSS}
</style>
<div class="bgs" aria-hidden="true"></div>
<canvas class="particles" aria-hidden="true"></canvas>
<div class="glow" aria-hidden="true"></div>
<main class="stage" aria-label="عرض نادي البيئة الثقافي">
{SLIDES}
</main>
<button class="brand" type="button" aria-label="العودة إلى الغلاف">{LOGO}<span>نادي البيئة الثقافي</span></button>
<div class="chapter" aria-hidden="true"></div>
<nav class="navbar" aria-label="التنقل">
  <button type="button" data-act="prev" aria-label="السابق"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg></button>
  <span class="count"></span>
  <button type="button" data-act="next" aria-label="التالي"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M15 6l-6 6 6 6"/></svg></button>
  <button type="button" data-act="toc" aria-label="فهرس الشرائح"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg></button>
</nav>
<div class="rail" aria-label="الشرائح"></div>
<div class="progress" aria-hidden="true"><i></i></div>
<div class="hint" aria-hidden="true"><span><kbd>←</kbd> <kbd>→</kbd> للتنقل</span><span><kbd>O</kbd> الفهرس</span><span><kbd>F</kbd> ملء الشاشة</span></div>
<div class="toc" role="dialog" aria-label="فهرس الشرائح"><div class="toc-head"><h3>كل الشرائح</h3><button type="button" data-act="toc-close" aria-label="إغلاق">×</button></div><div class="toc-grid"></div></div>
<div class="cursor" aria-hidden="true"></div><div class="cursor-dot" aria-hidden="true"></div>
<script>window.IMG = {IMGJSON};</script>
<script>
{APP}
</script>'''

LOGO = ('<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18.5" stroke="currentColor" stroke-opacity=".35"/>'
        '<path d="M8 26c4-7 8-10.5 12-10.5S28 19 32 26" stroke="#5B93FF" stroke-width="1.6" stroke-linecap="round"/>'
        '<path d="M12 29.5c2.6-3.6 5.3-5.4 8-5.4s5.4 1.8 8 5.4" stroke="#6FE3B5" stroke-width="1.6" stroke-linecap="round"/>'
        '<circle cx="20" cy="11" r="2.4" fill="#F5F3EF"/></svg>')

def main():
    slides_html = '\n'.join(render(s) for s in C.SLIDES)
    used = set(re.findall(r'data-(?:img|bg|thumb)="([a-z_0-9]+)"', slides_html))
    imgs = {p.stem: 'data:image/webp;base64,' + base64.b64encode(p.read_bytes()).decode()
            for p in sorted((ROOT / 'assets').glob('*.webp')) if p.stem in used}
    missing = used - set(imgs)
    if missing:
        sys.exit(f'missing images: {sorted(missing)}')
    out = (SHELL.replace('{FONTS}', (SRC / 'fonts.css').read_text(encoding='utf-8'))
                .replace('{CSS}', (SRC / 'style.css').read_text(encoding='utf-8'))
                .replace('{SLIDES}', slides_html).replace('{LOGO}', LOGO)
                .replace('{IMGJSON}', json.dumps(imgs))
                .replace('{APP}', (SRC / 'app.js').read_text(encoding='utf-8')))
    (ROOT / 'dist').mkdir(exist_ok=True)
    (ROOT / 'dist' / 'artifact.html').write_text(out, encoding='utf-8')
    head_end = out.index('</style>') + len('</style>')
    standalone = ('<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n<meta charset="utf-8">\n'
                  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
                  + out[:head_end] + '\n</head>\n<body>\n' + out[head_end:] + '\n</body>\n</html>\n')
    (ROOT / 'index.html').write_text(standalone, encoding='utf-8')
    unused = sorted(p.stem for p in (ROOT / 'assets').glob('*.webp') if p.stem not in used)
    print(f"index.html {len(standalone.encode()) / 1e6:.2f} MB, {len(C.SLIDES)} slides, {len(imgs)} images; unused: {unused}")

if __name__ == '__main__':
    main()
