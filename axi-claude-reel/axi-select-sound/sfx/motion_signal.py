# per-frame graphics-change signal from a render: gray 240x135, abs frame difference per 8x8-px cell (30x17 grid)
# usage: python3 motion_signal.py in.mp4 out.npz
import sys, subprocess, numpy as np
src, out = sys.argv[1], sys.argv[2]
W, H = 240, 136
p = subprocess.Popen(["ffmpeg", "-v", "error", "-threads", "1", "-i", src, "-vf", "scale=%d:%d,format=gray" % (W, H),
                      "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
prev = None; D = []; M = []
while True:
    b = p.stdout.read(W * H)
    if len(b) < W * H: break
    f = np.frombuffer(b, np.uint8).reshape(H, W).astype(np.float32)
    M.append(f.reshape(17, 8, 30, 8).mean(axis=(1, 3)))
    if prev is None: D.append(np.zeros((17, 30), np.float32))
    else: D.append(np.abs(f - prev).reshape(17, 8, 30, 8).mean(axis=(1, 3)))
    prev = f
np.savez_compressed(out, diff=np.array(D), mean=np.array(M))
print("frames", len(D))
