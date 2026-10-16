"""Key frames of the three idents on one sheet: python3 preview.py A.mp4 B.mp4 C.mp4 out.jpg"""
import subprocess, sys, io
from PIL import Image
KEYS = [[0.5, 1.15, 1.5, 2.3, 3.98], [0.5, 1.2, 1.6, 2.1, 3.98], [0.15, 0.6, 1.3, 2.3, 3.98]]
tw, th, g = 288, 512, 10
sheet = Image.new('RGB', (5 * tw + 6 * g, 3 * th + 4 * g), (14, 15, 18))
for r, (vid, keys) in enumerate(zip(sys.argv[1:4], KEYS)):
    for c, t in enumerate(keys):
        png = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(t), '-i', vid, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
        sheet.paste(Image.open(io.BytesIO(png)).convert('RGB').resize((tw, th), Image.LANCZOS), (g + c * (tw + g), g + r * (th + g)))
sheet.save(sys.argv[4], quality=90); print('wrote', sys.argv[4], sheet.size)
