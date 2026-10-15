# Tile PNG stills into a labelled contact sheet: python3 sheet.py out.jpg cols tile_w file1 file2 ...
import sys
from PIL import Image, ImageDraw
out, cols, tw = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); files = sys.argv[4:]
ims = [Image.open(f).convert('RGB') for f in files]; th = int(tw * ims[0].height / ims[0].width)
rows = (len(ims) + cols - 1) // cols; S = Image.new('RGB', (cols * tw, rows * th), (0, 0, 0)); d = ImageDraw.Draw(S)
for i, (im, f) in enumerate(zip(ims, files)):
    x, y = (i % cols) * tw, (i // cols) * th; S.paste(im.resize((tw, th), Image.LANCZOS), (x, y))
    lab = f.rsplit('_', 1)[-1].replace('.png', 's'); d.rectangle([x, y, x + 52, y + 16], fill=(0, 0, 0)); d.text((x + 4, y + 3), lab, fill=(255, 255, 0))
S.save(out, quality=88); print('sheet', out, S.size)
