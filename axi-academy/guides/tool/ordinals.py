# Write cross-references as «دليل الدرس 12» everywhere (some writers used ordinal words).
# python3 tool/ordinals.py src/L01.md [...]
import re, sys

ORD = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر',
       'الحادي عشر', 'الثاني عشر', 'الثالث عشر', 'الرابع عشر', 'الخامس عشر', 'السادس عشر', 'السابع عشر', 'الثامن عشر']
NUM = {w: i + 1 for i, w in enumerate(ORD)}
pat = re.compile(r'دليل الدرس (' + '|'.join(sorted(ORD, key=len, reverse=True)) + r')(?![\w])')
for f in sys.argv[1:]:
    s = open(f, encoding='utf-8').read()
    t, n = pat.subn(lambda m: f'دليل الدرس {NUM[m.group(1)]}', s)
    if n:
        open(f, 'w', encoding='utf-8').write(t)
    print(f, n)
