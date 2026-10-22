# frames around an event, cropped and tiled with their frame times: python3 framestrip.py video.mp4 t box out.jpg [n] [step_frames]
# box = x0,y0,x1,y1 in 1920x1080 px; frames start 3 frames before t
import sys, subprocess, numpy as np
from PIL import Image, ImageDraw
vid, t, box, out = sys.argv[1], float(sys.argv[2]), [int(v) for v in sys.argv[3].split(",")], sys.argv[4]
n = int(sys.argv[5]) if len(sys.argv) > 5 else 8
st = int(sys.argv[6]) if len(sys.argv) > 6 else 1
f0 = int(round(t * 25)) - 3 * st
x0, y0, x1, y1 = box; w, h = x1 - x0, y1 - y0
sc = min(1.0, 300 / w)
tw, th = int(w * sc), int(h * sc)
img = Image.new("RGB", (tw * 4, (th + 14) * ((n + 3) // 4)), (30, 30, 30)); dr = ImageDraw.Draw(img)
for i in range(n):
    f = f0 + i * st
    cmd = ["ffmpeg", "-v", "error", "-ss", "%.4f" % (f / 25 - 0.001), "-i", vid, "-frames:v", "1", "-vf",
           "crop=%d:%d:%d:%d,scale=%d:%d" % (w, h, x0, y0, tw, th), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    b = subprocess.run(cmd, capture_output=True).stdout
    a = np.frombuffer(b[: tw * th * 3], np.uint8).reshape(th, tw, 3)
    ox, oy = (i % 4) * tw, (i // 4) * (th + 14)
    img.paste(Image.fromarray(a), (ox, oy + 14))
    dr.text((ox + 3, oy + 1), "f%d %.2fs%s" % (f, f / 25, "  <- t" if f == int(round(t * 25)) else ""), fill=(255, 255, 0) if f == int(round(t * 25)) else (220, 220, 220))
img.save(out, quality=85)
