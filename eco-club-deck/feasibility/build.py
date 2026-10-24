#!/usr/bin/env python3
"""Assemble the feasibility page: inlines the deck's font, the CSS, data.js, model.js and page.js.
Writes ../dist/feasibility.html (Artifact body) and index.html (full document, for local checks)."""
import pathlib

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent


def main():
    t = (HERE / 'template.html').read_text(encoding='utf-8')
    for key, path in [('{FONTS}', ROOT / 'src' / 'fonts.css'), ('{CSS}', HERE / 'style.css'),
                      ('{DATA}', HERE / 'data.js'), ('{MODEL}', HERE / 'model.js'), ('{PAGE}', HERE / 'page.js')]:
        t = t.replace(key, path.read_text(encoding='utf-8'))
    (ROOT / 'dist').mkdir(exist_ok=True)
    (ROOT / 'dist' / 'feasibility.html').write_text(t, encoding='utf-8')
    head_end = t.index('</style>') + len('</style>')
    full = ('<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            + t[:head_end] + '\n</head>\n<body>\n' + t[head_end:] + '\n</body>\n</html>\n')
    (HERE / 'index.html').write_text(full, encoding='utf-8')
    print(f'feasibility page {len(t.encode()) / 1e3:.0f} KB')


if __name__ == '__main__':
    main()
