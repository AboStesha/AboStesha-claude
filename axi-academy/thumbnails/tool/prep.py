# Prepare the art for each job: optional shift right (the left edge is extended, for vertical-gradient
# backdrops only) and the logo colour picked from the art under the logo box (ink on light, white on dark).
# python3 prep.py jobs.json
import json, os, sys
import numpy as np
from PIL import Image
jobs = json.load(open(sys.argv[1]))
BOX = {'A': (1514, 58, 1844, 146), 'B': (80, 938, 380, 1018)}  # logo rects on the 1920x1080 frame
for j in jobs:
    if not os.path.exists(j['bg']):
        print(j['id'], 'missing', j['bg']); continue
    im = Image.open(j['bg']).convert('RGB').resize((1920, 1080), Image.LANCZOS)
    s = j.get('shift', 0)
    if s:
        fill = im.crop((0, 0, 6, 1080)).resize((1, 1080), Image.BOX).resize((1920, 1080))
        mask = Image.new('L', (1920 - s, 1080), 255)
        mask.paste(Image.linear_gradient('L').rotate(90, expand=True).resize((60, 1080)), (0, 0))  # 60 px feather
        fill.paste(im.crop((0, 0, 1920 - s, 1080)), (s, 0), mask)
        im = fill
        j['bg'] = j['bg'].replace('.png', '_s.png'); im.save(j['bg'])
    for (x0, y0, x1, y1) in j.get('mint', []):  # repaint classic green to brand mint #5EE0BB inside these rects
        hsv = np.array(im.crop((x0, y0, x1, y1)).convert('HSV')).astype(int)
        m = (hsv[..., 0] > 66) & (hsv[..., 0] < 106) & (hsv[..., 1] > 80)
        hsv[..., 0][m] = 116; hsv[..., 1][m] = np.minimum(hsv[..., 1][m], 150)
        im.paste(Image.fromarray(hsv.astype('uint8'), 'HSV').convert('RGB'), (x0, y0))
        j['bg'] = j['bg'].replace('.png', '_m.png'); im.save(j['bg'])
    g = im.convert('L').crop(BOX[j['design']])
    l = sum(g.get_flattened_data()) / (g.width * g.height) / 255
    j.setdefault('logo', 'lockup_ink.png' if l > 0.48 else 'lockup_white.png')
    print(j['id'], round(l, 2), j['logo'], 'shift', s)
json.dump(jobs, open(sys.argv[1], 'w'), ensure_ascii=False, indent=1)
