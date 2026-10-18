# Package the composited thumbnails for delivery: 1280x720 (YouTube upload size) and 1920x1080 JPGs in one folder
# per course, an overview sheet per course (lessons as rows, design A left, design B right) and a zip.
# python3 package.py jobs.json out pkg
import json, os, re, sys, zipfile
from PIL import Image

FOLDERS = {
    'الفوركس من الصفر': '01 الفوركس من الصفر - الكورس الأول',
    'أساسيات التداول': '02 أساسيات التداول - الكورس الثاني',
    'كيف تصبح متداولاً محترفاً': '03 كيف تصبح متداولاً محترفاً - الكورس الثالث',
    'احترف تداول الذهب': '04 احترف تداول الذهب - كورس للمحترفين',
}
NAME = 'AxiAcademy_YouTube_Thumbnails'
jobs_file, out_dir, pkg = sys.argv[1:4]
root = os.path.join(pkg, NAME)

def label(j):  # the title as plain text for the file name: no colour marks, no question mark
    t = [re.sub(r'[{}\[\]؟]', '', s) for s in j['title']]
    return ' vs '.join(t) if j.get('vs') else ' '.join(t)

rows = {}
for j in json.load(open(jobs_file)):
    tag = f"G{j['lesson']}" if j['id'].startswith('G') else f"L{j['lesson']:02d}"
    folder = FOLDERS[j['course']]
    os.makedirs(os.path.join(root, folder, '1920x1080'), exist_ok=True)
    im = Image.open(os.path.join(out_dir, j['id'] + '.png')).convert('RGB')
    name = f"{tag}_{j['design']} - {label(j)}.jpg"
    im.save(os.path.join(root, folder, '1920x1080', name), quality=92, subsampling=0, optimize=True)
    im.resize((1280, 720), Image.LANCZOS).save(os.path.join(root, folder, name), quality=92, subsampling=0, optimize=True)
    rows.setdefault(folder, {}).setdefault(tag, {})[j['design']] = im

T, G = (960, 540), 16  # overview tile and gutter
for k, (folder, lessons) in enumerate(sorted(rows.items()), 1):
    sheet = Image.new('RGB', (2 * T[0] + 3 * G, len(lessons) * (T[1] + G) + G), '#090A0D')
    for r, tag in enumerate(sorted(lessons)):
        for c, d in enumerate('AB'):
            sheet.paste(lessons[tag][d].resize(T, Image.LANCZOS), (G + c * (T[0] + G), G + r * (T[1] + G)))
    sheet.save(os.path.join(root, folder, f'00 overview - {folder}.jpg'), quality=85, optimize=True)
    sheet.save(os.path.join(pkg, f'ov{k}.jpg'), quality=85, optimize=True)

with zipfile.ZipFile(os.path.join(pkg, NAME + '.zip'), 'w', zipfile.ZIP_STORED) as z:  # zipfile flags the Arabic names as UTF-8
    for d, _, files in sorted(os.walk(root)):
        for f in sorted(files):
            z.write(os.path.join(d, f), os.path.relpath(os.path.join(d, f), pkg))
print('wrote', os.path.join(pkg, NAME + '.zip'))
