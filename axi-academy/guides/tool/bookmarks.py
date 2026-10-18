# Add the PDF bookmarks and metadata. Chromium writes right-to-left bookmark titles in visual order
# (words reversed), so render.mjs passes the page of every section here instead.
# python3 tool/bookmarks.py <pdf> <marks.json>        marks.json = {"marks": [{"t": title, "p": page (1-based)}, ...], "meta": {...}}
import json, sys
from pypdf import PdfReader, PdfWriter

pdf, data = sys.argv[1], json.load(open(sys.argv[2], encoding='utf-8'))
w = PdfWriter(clone_from=PdfReader(pdf))
for m in data['marks']:
    w.add_outline_item(m['t'], m['p'] - 1)
w.page_mode = '/UseOutlines'
w.add_metadata(data['meta'])
w.write(pdf)
