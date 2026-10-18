# Contact sheet of composed thumbnails: python3 sheet.py out.jpg ID1 ID2 ...  (2 per row, 800x450 tiles)
import sys
from PIL import Image, ImageDraw
out, ids = sys.argv[1], sys.argv[2:]
rows = (len(ids) + 1) // 2
s = Image.new('RGB', (1600, 450 * rows), (20, 20, 20)); d = ImageDraw.Draw(s)
for i, n in enumerate(ids):
    x, y = (i % 2) * 800, (i // 2) * 450
    s.paste(Image.open(f'out/{n}.png').convert('RGB').resize((800, 450), Image.LANCZOS), (x, y))
    d.rectangle([x, y, x + 64, y + 22], fill=(0, 0, 0)); d.text((x + 5, y + 5), n, fill=(255, 255, 0))
s.save(out, quality=72)
