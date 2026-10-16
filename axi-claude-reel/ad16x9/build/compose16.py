import sys, subprocess, numpy as np, cv2
from PIL import Image
S = sys.argv[1]
AD = f'{S}/ad'; WK = f'{AD}/work'
W, H, FPS, N = 1920, 1080, 24, 1128
ONLY = sys.argv[2] if len(sys.argv) > 2 else None  # comma-separated times (s) for still previews

# shot, timeline start, timeline end, source in-point (s)
CUTS = [('S01', 0, 4, .3), ('S02', 4, 6, .5), ('S03', 6, 8, .5), ('S04', 8, 12, .5), ('S05', 12, 16, .5),
        ('S06', 16, 18.7, .6), ('S07', 18.7, 21.4, .8), ('S08', 21.4, 24, .6), ('S09', 24, 28, .6), ('S10', 28, 32, .7),
        (None, 32, 35.6, 0), ('S12', 35.6, 38.4, 1.0), ('S13', 38.4, 41.95, 1.0), (None, 41.95, 47, 0)]
SUBS = [(1.00, 2.75, 1.9), (4.25, 5.60, 4.9), (6.20, 7.80, 6.9), (8.40, 9.70, 8.9), (9.80, 12.15, 10.9),
        (12.30, 16.00, 14.1), (28.50, 31.20, 29.8), (35.70, 38.85, 37.2)]
fr = lambda t: int(round(t * FPS))

def footage():
    for name, a, b, ip in CUTS:
        n = fr(b) - fr(a)
        if name is None:
            for _ in range(n): yield None
            continue
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-ss', f'{ip:.3f}', '-i', f'{AD}/shots/{name}.mp4', '-frames:v', str(n),
                              '-vf', 'scale=-2:1080:flags=lanczos:in_color_matrix=bt709,format=rgb24,crop=1920:1080',
                              '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE, bufsize=10 ** 8)
        last = None
        z1 = {'S02': 1.07, 'S04': 1.035}.get(name, 1.0)
        for i in range(n):
            buf = p.stdout.read(W * H * 3)
            if len(buf) == W * H * 3: last = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
            if z1 != 1.0 and last is not None:
                z = 1 + (z1 - 1) * (i / max(1, n - 1))
                M = np.float32([[z, 0, (1 - z) * W / 2], [0, z, (1 - z) * H / 2]])
                yield cv2.warpAffine(last, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
            else:
                yield last
        p.stdout.close(); p.wait()

def overlay():
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', f'{WK}/over.mkv', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'],
                         stdout=subprocess.PIPE, bufsize=10 ** 8)
    while True:
        buf = p.stdout.read(W * H * 4)
        if len(buf) < W * H * 4: break
        yield np.frombuffer(buf, np.uint8).reshape(H, W, 4)

def enc(path):
    return subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                             '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
                             '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-tune', 'film', '-profile:v', 'high',
                             '-x264-params', 'keyint=48:min-keyint=24', '-maxrate', '45M', '-bufsize', '90M',
                             '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
                             path], stdin=subprocess.PIPE)

# ---- look ----
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
rr = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) / np.sqrt(2)
VIG = (1 - 0.30 * np.clip((rr - 0.42) / 0.58, 0, 1) ** 1.5)[..., None].astype(np.float32)
VIG *= (1 - 0.36 * np.clip((yy - 0.64 * H) / (0.36 * H), 0, 1) ** 1.25)[..., None]  # bottom scrim for type
SH = np.array([-.012, .004, .018], np.float32); HI = np.array([.016, .004, -.014], np.float32)
HAL = np.array([1.0, .78, .55], np.float32)

def grade(img):
    x = img.astype(np.float32) * (1 / 255)
    s = x * x * (3 - 2 * x); x += (s - x) * 0.22
    L = x[..., 0:1] * .2126 + x[..., 1:2] * .7152 + x[..., 2:3] * .0722
    x = L + (x - L) * 0.94
    x += (1 - L) ** 2 * SH + L ** 2 * HI
    sm = cv2.resize(x, (W // 4, H // 4), interpolation=cv2.INTER_AREA)
    bl = cv2.GaussianBlur(np.clip((sm - 0.72) / 0.28, 0, 1), (0, 0), 9)
    bl = cv2.resize(bl, (W, H), interpolation=cv2.INTER_LINEAR) * HAL
    x = 1 - (1 - x) * (1 - bl * 0.22)
    return x * VIG

rng = np.random.default_rng(11)
def grain(x, amt):
    n = cv2.resize(rng.standard_normal((H // 2, W // 2)).astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR)
    L = x.mean(2, keepdims=True)
    return x + n[..., None] * amt * (0.55 + 0.45 * (1 - np.abs(2 * L - 1)))

def eo(v): v = min(1, max(0, v)); return 1 - (1 - v) ** 3
def screen(x, col, k): return 1 - (1 - x) * (1 - np.array(col, np.float32) * k)

F12, F32 = fr(12.0), fr(32.0)
def fx(x, f):
    if F12 <= f < F12 + 4: x = screen(x, (1, .80, .48), [.55, .30, .14, .05][f - F12])
    if F32 - 3 <= f < F32 + 6: x = screen(x, (1, .93, .78), [.08, .18, .36, .88, .62, .40, .22, .10, .03][f - F32 + 3])
    for tc, pkk in [(16.0, .30), (18.7, .16), (21.4, .16), (24.0, .18)]:
        c0 = fr(tc)
        if c0 <= f < c0 + 4: x = screen(x, (1, .82, .52), pkk * [1, .55, .25, .08][f - c0])
    if f < 12: x = x * eo(f / 12)
    if f >= N - 10: x = x * ((N - 1 - f) / 10)
    return x

subs = []
for a, b, tm in SUBS:
    im = np.array(Image.open(f'{WK}/subs/o_{tm}.png').convert('RGBA')).astype(np.float32) / 255
    subs.append((a, b, im[..., :3], im[..., 3:4]))
def sub_alpha(t, a, b): return min(eo((t - a) / .18), 1 - min(1, max(0, (t - (b - .2)) / .2)))

PF = sorted(int(round(float(v) * FPS)) for v in ONLY.split(',')) if ONLY else None
if ONLY:
    outs = None
else:
    em, ec = enc(f'{WK}/v_master.mp4'), enc(f'{WK}/v_clean.mp4')
fo, ov = footage(), overlay()
for f in range(N):
    img, o = next(fo), next(ov)
    if PF is not None:
        if f > PF[-1]: break
        if f not in PF: continue
    t = f / FPS
    x = grade(img) if img is not None else np.zeros((H, W, 3), np.float32)
    a = o[..., 3:4].astype(np.float32) * (1 / 255)
    x = x * (1 - a) + o[..., :3].astype(np.float32) * (1 / 255) * a
    x = grain(x, 0.020 * (1 - a) + 0.009 * a)
    clean = fx(x, f)
    m = x
    for sa, sb, srgb, salpha in subs:
        if sa <= t < sb:
            k = salpha * sub_alpha(t, sa, sb)
            m = x * (1 - k) + srgb * k
    master = fx(m, f) if m is not x else clean
    cu8 = (np.clip(clean, 0, 1) * 255 + .5).astype(np.uint8)
    mu8 = (np.clip(master, 0, 1) * 255 + .5).astype(np.uint8)
    if ONLY:
        Image.fromarray(mu8).save(f'{WK}/prev_{f:04d}.jpg', quality=90)
    else:
        em.stdin.write(mu8.tobytes()); ec.stdin.write(cu8.tobytes())
    if f % 48 == 0: print(f, flush=True)
if not ONLY:
    em.stdin.close(); ec.stdin.close(); em.wait(); ec.wait()
print('done')
