"""Every frame of a video on per-second contact sheets (60 frames, 10 x 6), plus the frame-difference trace.
Usage: python3 sheets.py video.mp4 outdir [tile_w]"""
import subprocess, sys, os, json
import numpy as np
from PIL import Image
vid, out = sys.argv[1], sys.argv[2]; W = int(sys.argv[3]) if len(sys.argv) > 3 else 108; H = W * 16 // 9
os.makedirs(out, exist_ok=True); tag = os.path.splitext(os.path.basename(vid))[0]
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', vid, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3); n = len(fr)
d = np.abs(np.diff(fr.astype(np.int16), axis=0)).mean((1, 2, 3))
for s in range((n + 59) // 60):
    S = Image.new('RGB', (W * 10, H * 6))
    for j in range(60):
        k = s * 60 + j
        if k >= n: break
        S.paste(Image.fromarray(fr[k]), ((j % 10) * W, (j // 10) * H))
    S.save(f'{out}/{tag}_s{s}.jpg', quality=85)
json.dump({'frames': n, 'diff': [round(float(x), 2) for x in d]}, open(f'{out}/{tag}_diff.json', 'w'))
print(tag, 'frames', n, 'max diff', round(float(d.max()), 1), 'at', int(d.argmax()) + 1)
