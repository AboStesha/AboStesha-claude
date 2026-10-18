# Add the PDF bookmarks and metadata. Chromium writes right-to-left bookmark titles in visual order
# (words reversed), so render.mjs passes the page of every course, lesson and exam here instead.
# python3 tool/bookmarks.py <pdf> <marks.json>        marks = [{"t": title, "p": page (1-based), "lvl": 0|1}, ...]
import json, sys
from pypdf import PdfReader, PdfWriter

pdf, marks = sys.argv[1], json.load(open(sys.argv[2], encoding='utf-8'))
w = PdfWriter(clone_from=PdfReader(pdf))
parent = None
for m in marks:
    item = w.add_outline_item(m['t'], m['p'] - 1, parent=parent if m['lvl'] else None)
    if m['lvl'] == 0:
        parent = item
w.page_mode = '/UseOutlines'
w.add_metadata({'/Title': 'بنك أسئلة الاختبارات · أكاديمية آكسي', '/Author': 'Axi Iraq · أكاديمية آكسي',
                '/Subject': 'أسئلة الدروس واختبارات نهاية الكورسات مع الإجابات الصحيحة'})
w.write(pdf)
print('bookmarks', len(marks))
