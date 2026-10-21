#!/usr/bin/env python3
"""splice.py — replace selected frames of a rendered film with re-rendered PNGs, streaming (no frame dump).

  python3 tools/splice.py renders/explainer_silent.mp4 renders/exp2/_frames renders/explainer_silent_v2.mp4 [--crf 17]

Every frame NNNNN.png present in the frames dir (0-based, as render.py names them) replaces that frame of the film;
all other frames pass through. Video only (mux audio afterwards)."""
import argparse, glob, json, os, subprocess
import numpy as np
from PIL import Image

ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('frames'); ap.add_argument('out'); ap.add_argument('--crf', type=int, default=17)
a = ap.parse_args()
info = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate,nb_frames',
                                  '-of', 'json', a.src], capture_output=True, text=True).stdout)['streams'][0]
W, H, fps = info['width'], info['height'], info['r_frame_rate']
repl = {int(os.path.basename(p)[:5]): p for p in glob.glob(os.path.join(a.frames, '*.png')) if os.path.getsize(p) > 0}
dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', a.src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', fps, '-i', '-',
                        '-c:v', 'libx264', '-preset', 'medium', '-crf', str(a.crf), '-pix_fmt', 'yuv420p', '-profile:v', 'high',
                        '-movflags', '+faststart', a.out], stdin=subprocess.PIPE)
n = W * H * 3; i = 0; used = 0
while True:
    buf = dec.stdout.read(n)
    if len(buf) < n: break
    if i in repl:
        im = Image.open(repl[i]).convert('RGB')
        if im.size != (W, H): im = im.resize((W, H), Image.LANCZOS)
        buf = np.asarray(im).tobytes(); used += 1
    enc.stdin.write(buf); i += 1
enc.stdin.close(); enc.wait(); dec.wait()
print(f'{i} frames, {used} replaced of {len(repl)} supplied → {a.out}')
