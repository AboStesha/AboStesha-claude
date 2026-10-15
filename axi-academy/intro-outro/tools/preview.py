"""Key-moment preview sheet of the three stings: python3 preview.py out.jpg a.mp4 b.mp4 c.mp4"""
import subprocess, sys, io
from PIL import Image, ImageDraw
out, vids = sys.argv[1], sys.argv[2:]
TIMES = [[0.40, 0.75, 1.35, 2.25, 4.98], [0.45, 1.10, 1.52, 2.10, 4.98], [0.45, 1.05, 1.55, 2.45, 4.98]]
NAMES = ['A · Ink', 'B · Market', 'C · Light']
tw, th = 384, 216; S = Image.new('RGB', (tw * 5, th * 3)); d = ImageDraw.Draw(S)
for r, (v, ts) in enumerate(zip(vids, TIMES)):
    for c, t in enumerate(ts):
        png = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(t), '-i', v, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
        S.paste(Image.open(io.BytesIO(png)).convert('RGB').resize((tw, th), Image.LANCZOS), (c * tw, r * th))
        d.rectangle([c * tw, r * th, c * tw + 44, r * th + 15], fill=(0, 0, 0)); d.text((c * tw + 4, r * th + 2), f'{t:.2f}s', fill=(255, 255, 0))
    d.rectangle([0, r * th + th - 18, 92, r * th + th], fill=(0, 0, 0)); d.text((4, r * th + th - 15), NAMES[r], fill=(255, 255, 255))
S.save(out, quality=90); print('wrote', out)
