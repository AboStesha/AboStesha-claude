#!/usr/bin/env python3
"""Assemble the deck into one self-contained HTML file.

Outputs:
  index.html            standalone page (works offline, from a USB stick or a browser)
  dist/artifact.html    the same page without the document skeleton, for the Artifact host
"""
import base64, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / 'src'
sys.path.insert(0, str(SRC))
import subprocess
subprocess.run([sys.executable, str(SRC / 'gen_data.py')], check=True)
from content import COPY  # noqa: E402

def b64(path, mime):
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()

def main():
    deck = (SRC / 'deck.html').read_text(encoding='utf-8')
    fonts = (SRC / 'fonts.css').read_text(encoding='utf-8')
    css = (SRC / 'style.css').read_text(encoding='utf-8')
    data = (SRC / 'data.js').read_text(encoding='utf-8')
    app = (SRC / 'app.js').read_text(encoding='utf-8')
    plan = (SRC / 'plan.svg').read_text(encoding='utf-8')

    used = set(re.findall(r'data-(?:img|bg)="([a-z_]+)"', deck))
    imgs = {p.stem: b64(p, 'image/webp') for p in sorted((ROOT / 'assets').glob('*.webp')) if p.stem in used}
    missing = used - set(imgs)
    if missing:
        sys.exit(f'missing images: {sorted(missing)}')

    out = deck.replace('{{PLAN_SVG}}', plan)
    for k, v in COPY.items():
        out = out.replace('{{' + k + '}}', v)
    out = (out.replace('{{FONTS}}', fonts).replace('{{CSS}}', css)
              .replace('{{DATA}}', data).replace('{{APP}}', app)
              .replace('{{IMGJSON}}', json.dumps(imgs)))
    left = sorted(set(re.findall(r'\{\{([A-Z0-9_]+)\}\}', out)))
    if left:
        sys.exit(f'unfilled placeholders: {left}')

    (ROOT / 'dist').mkdir(exist_ok=True)
    (ROOT / 'dist' / 'artifact.html').write_text(out, encoding='utf-8')

    head_end = out.index('</style>') + len('</style>')
    standalone = ('<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n<meta charset="utf-8">\n'
                  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
                  + out[:head_end] + '\n</head>\n<body>\n' + out[head_end:] + '\n</body>\n</html>\n')
    (ROOT / 'index.html').write_text(standalone, encoding='utf-8')
    print(f"index.html {len(standalone.encode()) / 1e6:.2f} MB, {len(imgs)} images")

if __name__ == '__main__':
    main()
