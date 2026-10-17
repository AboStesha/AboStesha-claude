import sys, subprocess, numpy as np, cv2
from PIL import Image
S = sys.argv[1]
AC = f'{S}/acad'
sys.path.insert(0, AC)
from edit9 import CUTS, FADES, DUR, FPS, W, H
N = int(round(DUR * FPS))
MODE = sys.argv[2] if len(sys.argv) > 2 else 'full'   # full | rough | stills:t1,t2
fr = lambda t: int(round(t * FPS))

def frames():
    for name, a, b, ip in CUTS:
        n = fr(b) - fr(a)
        if name in (None, 'END'):
            for _ in range(n): yield None, 'black'
            continue
        p = subprocess.Popen(['ffmpeg', '-v', 'error', '-ss', f'{ip:.3f}', '-i', f'{AC}/shots/{name}.mp4', '-frames:v', str(n),
                              '-vf', f'scale={W}:{H}:flags=bicubic:in_color_matrix=bt709,format=rgb24', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                             stdout=subprocess.PIPE, bufsize=10 ** 8)
        last = None
        for _ in range(n):
            buf = p.stdout.read(W * H * 3)
            if len(buf) == W * H * 3: last = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
            yield last, 'shot'
        p.stdout.close(); p.wait()

def overlay(path):
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'], stdout=subprocess.PIPE, bufsize=10 ** 8)
    last = np.zeros((H, W, 4), np.uint8)
    while True:
        buf = p.stdout.read(W * H * 4)
        if len(buf) == W * H * 4: last = np.frombuffer(buf, np.uint8).reshape(H, W, 4)
        yield last

# ---- film look (same as the Saeed ad) ----
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
rr = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) / np.sqrt(2)
VIG = (1 - 0.24 * np.clip((rr - 0.40) / 0.60, 0, 1) ** 1.6)[..., None].astype(np.float32)
SH = np.array([-.006, .002, .014], np.float32); HI = np.array([.008, .003, -.006], np.float32)
HAL = np.array([1.0, .42, .22], np.float32)

def grade(img):
    x = img.astype(np.float32) * (1 / 255)
    x = cv2.GaussianBlur(x, (0, 0), 0.6)
    L = x[..., 0:1] * .2126 + x[..., 1:2] * .7152 + x[..., 2:3] * .0722
    x = L + (x - L) * 0.90
    s = x * x * (3 - 2 * x); x += (s - x) * 0.14
    x += (1 - L) ** 2 * SH + L ** 2 * HI
    q = cv2.resize(x, (W // 4, H // 4), interpolation=cv2.INTER_AREA)
    hl = np.clip((q - 0.72) / 0.28, 0, 1)
    hal = cv2.resize(cv2.GaussianBlur(hl.mean(2), (0, 0), 3.5), (W, H))[..., None] * HAL
    blm = cv2.resize(cv2.GaussianBlur(np.clip((q - 0.55) / 0.45, 0, 1), (0, 0), 9), (W, H))
    x = 1 - (1 - x) * (1 - hal * 0.16) * (1 - blm * 0.07)
    x = 0.010 + x * 0.985
    return x * VIG

rng = np.random.default_rng(5)
def grain(x, amt):
    n = cv2.resize(rng.standard_normal((H // 2, W // 2)).astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR)
    L = x.mean(2, keepdims=True)
    return x + n[..., None] * amt * (0.45 + 0.55 * (1 - np.abs(2 * L - 1)))

def bright(t):
    k = 1.0
    for t0, t1, a, b in FADES:
        if t0 <= t < t1:
            u = (t - t0) / (t1 - t0); k *= a + (b - a) * (u * u * (3 - 2 * u))
    return k

def enc(path, w=W, h=H, crf='16'):
    vf = 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p' if w == W else f'scale={w}:{h}:flags=bicubic:out_color_matrix=bt709:out_range=tv,format=yuv420p'
    return subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                             '-vf', vf, '-c:v', 'libx264', '-preset', 'slow', '-crf', crf, '-tune', 'grain', '-profile:v', 'high',
                             '-x264-params', 'keyint=48:min-keyint=24', '-colorspace', 'bt709', '-color_primaries', 'bt709',
                             '-color_trc', 'bt709', '-color_range', 'tv', path], stdin=subprocess.PIPE)

stills = [fr(float(v)) for v in MODE.split(':', 1)[1].split(',')] if MODE.startswith('stills') else None
if MODE == 'full':
    outs = [(enc(f'{AC}/work/v_main.mp4'), overlay(f'{AC}/work/over.mkv')), (enc(f'{AC}/work/v_clean.mp4'), overlay(f'{AC}/work/over_clean.mkv'))]
elif MODE == 'rough':
    outs = [(enc(f'{AC}/work/rough.mp4', 720, 1280, '20'), overlay(f'{AC}/work/over_clean.mkv'))]
else:
    outs = [(None, overlay(f'{AC}/work/over.mkv'))]
gen = frames()
for f in range(N):
    img, kind = next(gen)
    ovs = [next(o) for _, o in outs]
    if stills is not None:
        if f > max(stills): break
        if f not in stills: continue
    t = f / FPS
    if img is None:
        base = np.zeros((H, W, 3), np.float32)
    else:
        base = grade(img) if MODE != 'rough' else img.astype(np.float32) / 255
    base = base * bright(t)
    for (e, _), o in zip(outs, ovs):
        a = o[..., 3:4].astype(np.float32) * (1 / 255)
        x = base * (1 - a) + o[..., :3].astype(np.float32) * (1 / 255) * a
        if MODE != 'rough':
            x = grain(x, 0.016 * (1 - a) + 0.006 * a) if img is not None else grain(x, 0.006)
        u8 = (np.clip(x, 0, 1) * 255 + .5).astype(np.uint8)
        if stills is not None:
            Image.fromarray(u8).save(f'{AC}/work/st_{f:04d}.jpg', quality=90)
        else:
            e.stdin.write(u8.tobytes())
    if f % 96 == 0: print(f, flush=True)
if stills is None:
    for e, _ in outs: e.stdin.close(); e.wait()
print('done')
