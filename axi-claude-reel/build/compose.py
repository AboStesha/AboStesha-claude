import sys, subprocess, numpy as np, cv2, math
W, H, FPS = 1080, 1920, 25
work = sys.argv[1]
N = 1084
SEG_STARTS = [0, 106, 188, 530, 644, 779, 858, 905, 962]
BOOM = 271
START = 106  # presenter enters at main 4.26s = 0:08 in the final cut

def dec(path, fmt, w, h, ch):
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', fmt, '-s', f'{w}x{h}', '-'],
                         stdout=subprocess.PIPE, bufsize=10**8)
    sz = w * h * ch
    def nxt(last=[None]):
        b = p.stdout.read(sz)
        if len(b) == sz:
            last[0] = np.frombuffer(b, np.uint8).reshape(h, w, ch) if ch > 1 else np.frombuffer(b, np.uint8).reshape(h, w)
        return last[0]
    return nxt

bg = dec(f'{work}/bg.mp4', 'rgb24', W, H, 3)
under = dec(f'{work}/gfx/under.mkv', 'rgba', W, H, 4)
top = dec(f'{work}/gfx/top.mkv', 'rgba', W, H, 4)
av = dec(f'{work}/../avatar/avatar.mp4', 'rgb24', W, H, 3)
mt = dec(f'{work}/matte.mp4', 'gray', 540, 960, 1)

enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-c:v', 'libx264', '-crf', '15', '-preset', 'medium', '-pix_fmt', 'yuv420p', f'{work}/main_video.mp4'], stdin=subprocess.PIPE)

def rrmask(x0, y0, x1, y1, r):
    m = np.zeros((H * 2, W * 2), np.uint8)
    X0, Y0, X1, Y1, R = x0 * 2, y0 * 2, x1 * 2, y1 * 2, r * 2
    cv2.rectangle(m, (X0 + R, Y0), (X1 - R, Y1), 255, -1)
    cv2.rectangle(m, (X0, Y0 + R), (X1, Y1 - R), 255, -1)
    for cx, cy in [(X0 + R, Y0 + R), (X1 - R, Y0 + R), (X0 + R, Y1 - R), (X1 - R, Y1 - R)]:
        cv2.circle(m, (cx, cy), R, 255, -1, cv2.LINE_AA)
    return cv2.resize(m, (W, H), interpolation=cv2.INTER_AREA).astype(np.float32) / 255

CARD = (240, 1380, 840, 1990, 56)
cardm = rrmask(*CARD)
yy = np.arange(H)[:, None]
above_card = (yy < CARD[1]).astype(np.float32)
S, OX, OY = 0.62, 224, 1267
AW, AH = int(W * S), int(H * S)

def eo(x): x = min(1, max(0, x)); return 1 - (1 - x) ** 3

def blend(dst, rgb, a):
    a = a[..., None]
    return dst * (1 - a) + rgb * a

def avatar_layer(f, frame, matte):
    t = f / FPS
    if 498 <= f < 530:  # full screen
        return frame.astype(np.float32), np.ones((H, W), np.float32)
    if f >= 962:  # CTA layout
        oy = 720
        rgb = np.zeros((H, W, 3), np.float32); a = np.zeros((H, W), np.float32)
        rgb[oy:] = frame[:H - oy]; m = cv2.resize(matte, (W, H)).astype(np.float32) / 255
        a[oy:] = m[:H - oy]
        a[760:] = 1
        p = eo((f - 962) / 8); shift = int((1 - p) * 300)
        if shift:
            rgb = np.roll(rgb, shift, 0); a = np.roll(a, shift, 0); a[:shift] = 0
        return rgb, a
    if f < START: return None, None
    fr = cv2.resize(frame, (AW, AH), interpolation=cv2.INTER_AREA).astype(np.float32)
    mm = cv2.resize(matte, (AW, AH), interpolation=cv2.INTER_LINEAR).astype(np.float32) / 255
    rgb = np.zeros((H, W, 3), np.float32); ma = np.zeros((H, W), np.float32)
    y0, y1 = OY, min(H, OY + AH); x0, x1 = OX, OX + AW
    rgb[y0:y1, x0:x1] = fr[:y1 - y0]; ma[y0:y1, x0:x1] = mm[:y1 - y0]
    a = np.maximum(cardm, ma * above_card)
    # card entrance at start, and punch at BOOM
    sc = 1.0; dy = 0
    if f < START + 10: dy = int((1 - eo((f - START) / 10)) * 700)
    if BOOM <= f < BOOM + 9: sc = 1 + 0.07 * (1 - eo((f - BOOM) / 9))
    if sc != 1 or dy:
        M = np.float32([[sc, 0, (1 - sc) * 540], [0, sc, (1 - sc) * 1650 + dy]])
        rgb = cv2.warpAffine(rgb, M, (W, H)); a = cv2.warpAffine(a, M, (W, H))
    return rgb, a

rng = np.random.default_rng(7)
for f in range(N):
    b = bg().astype(np.float32)
    # punch-in zoom at segment starts
    for s in SEG_STARTS:
        if s <= f < s + 7 and s != 0:
            z = 1 + 0.07 * (1 - eo((f - s) / 7))
            M = np.float32([[z, 0, (1 - z) * 540], [0, z, (1 - z) * 960]])
            b = cv2.warpAffine(b, M, (W, H), borderMode=cv2.BORDER_REPLICATE)
    u = under().astype(np.float32)
    out = blend(b, u[..., :3], u[..., 3] / 255)
    rgb, a = avatar_layer(f, av(), mt())
    if rgb is not None: out = blend(out, rgb, a)
    tp = top().astype(np.float32)
    out = blend(out, tp[..., :3], tp[..., 3] / 255)
    if BOOM <= f < BOOM + 8:
        k = (1 - (f - BOOM) / 8) * 16
        M = np.float32([[1.02, 0, -10.8 + rng.uniform(-k, k)], [0, 1.02, -19.2 + rng.uniform(-k, k)]])
        out = cv2.warpAffine(out, M, (W, H), borderMode=cv2.BORDER_REPLICATE)
    enc.stdin.write(np.clip(out, 0, 255).astype(np.uint8).tobytes())
    if f % 100 == 0: print(f, flush=True)
enc.stdin.close(); enc.wait(); print('done')
