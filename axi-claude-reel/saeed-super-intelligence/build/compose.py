import sys, subprocess, numpy as np, cv2
from PIL import Image
S = sys.argv[1]
NL = f'{S}/nl'
sys.path.insert(0, NL)
from edit import CUTS, FADES, SUBS, DUR, FPS
W, H = 1920, 1080
N = int(round(DUR * FPS))
MODE = sys.argv[2] if len(sys.argv) > 2 else 'full'   # full | rough | stills:t1,t2
fr = lambda t: int(round(t * FPS))

def frames():
    for name, a, b, ip in CUTS:
        n = fr(b) - fr(a)
        if name is None:
            for _ in range(n): yield None, 'black'
            continue
        src = f'{NL}/gfx/end.mkv' if name == 'END' else f'{NL}/shots/{name}.mp4'
        vf = 'format=rgb24' if name == 'END' else 'scale=1920:1080:flags=bicubic:in_color_matrix=bt709,format=rgb24'
        cmd = ['ffmpeg', '-v', 'error']
        if name != 'END': cmd += ['-ss', f'{ip:.3f}']
        cmd += ['-i', src, '-frames:v', str(n), '-vf', vf, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']
        p = subprocess.Popen(cmd, stdout=subprocess.PIPE, bufsize=10 ** 8)
        last = None
        for _ in range(n):
            buf = p.stdout.read(W * H * 3)
            if len(buf) == W * H * 3: last = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
            yield last, ('end' if name == 'END' else 'shot')
        p.stdout.close(); p.wait()

# ---- film look ----
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
rr = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) / np.sqrt(2)
VIG = (1 - 0.24 * np.clip((rr - 0.40) / 0.60, 0, 1) ** 1.6)[..., None].astype(np.float32)
SH = np.array([-.006, .002, .014], np.float32); HI = np.array([.008, .003, -.006], np.float32)
HAL = np.array([1.0, .42, .22], np.float32)

def grade(img):
    x = img.astype(np.float32) * (1 / 255)
    x = cv2.GaussianBlur(x, (0, 0), 0.6)                     # no digital sharpness
    L = x[..., 0:1] * .2126 + x[..., 1:2] * .7152 + x[..., 2:3] * .0722
    x = L + (x - L) * 0.90
    s = x * x * (3 - 2 * x); x += (s - x) * 0.14
    x += (1 - L) ** 2 * SH + L ** 2 * HI
    q = cv2.resize(x, (W // 4, H // 4), interpolation=cv2.INTER_AREA)
    hl = np.clip((q - 0.72) / 0.28, 0, 1)
    hal = cv2.resize(cv2.GaussianBlur(hl.mean(2, keepdims=False), (0, 0), 3.5), (W, H))[..., None] * HAL
    blm = cv2.resize(cv2.GaussianBlur(np.clip((q - 0.55) / 0.45, 0, 1), (0, 0), 9), (W, H))
    x = 1 - (1 - x) * (1 - hal * 0.16) * (1 - blm * 0.07)
    x = 0.010 + x * 0.985                                     # film base, soft blacks
    return x * VIG

rng = np.random.default_rng(5)
def grain(x, amt):
    n = cv2.resize(rng.standard_normal((H // 2, W // 2)).astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR)
    L = x.mean(2, keepdims=True)
    return x + n[..., None] * amt * (0.45 + 0.55 * (1 - np.abs(2 * L - 1)))

def eo(v): v = min(1, max(0, v)); return 1 - (1 - v) ** 3
def bright(t):
    k = 1.0
    for t0, t1, a, b in FADES:
        if t0 <= t < t1:
            u = (t - t0) / (t1 - t0); k *= a + (b - a) * (u * u * (3 - 2 * u))
    return k

subs = []
for i, (a, b, _) in enumerate(SUBS):
    im = np.array(Image.open(f'{NL}/gfx/subs/s_{i:02d}.png').convert('RGBA')).astype(np.float32) / 255
    subs.append((a, b, im[..., :3], im[..., 3:4]))
def sub_alpha(t, a, b): return min(eo((t - a) / .15), 1 - min(1, max(0, (t - (b - .18)) / .18)))

def enc(path, w=W, h=H, crf='16'):
    vf = 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p' if w == W else f'scale={w}:{h}:flags=bicubic:out_color_matrix=bt709:out_range=tv,format=yuv420p'
    return subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                             '-vf', vf, '-c:v', 'libx264', '-preset', 'slow', '-crf', crf, '-tune', 'grain', '-profile:v', 'high',
                             '-x264-params', 'keyint=48:min-keyint=24', '-colorspace', 'bt709', '-color_primaries', 'bt709',
                             '-color_trc', 'bt709', '-color_range', 'tv', path], stdin=subprocess.PIPE)

stills = [fr(float(v)) for v in MODE.split(':', 1)[1].split(',')] if MODE.startswith('stills') else None
if MODE == 'full':
    ec, es = enc(f'{NL}/work/v_clean.mp4'), enc(f'{NL}/work/v_subs.mp4')
elif MODE == 'rough':
    ec, es = enc(f'{NL}/work/rough720.mp4', 1280, 720, '20'), None
gen = frames()
for f in range(N):
    img, kind = next(gen)
    if stills is not None:
        if f > max(stills): break
        if f not in stills: continue
    t = f / FPS
    if kind == 'black' or img is None:
        x = np.zeros((H, W, 3), np.float32)
    elif kind == 'end':
        x = img.astype(np.float32) / 255
    else:
        x = grade(img) if MODE != 'rough' else img.astype(np.float32) / 255
    x = x * bright(t)
    if MODE != 'rough':
        x = grain(x, 0.016 if kind == 'shot' else 0.007)
    clean = x
    m = x
    for a, b, srgb, sal in subs:
        if a <= t < b:
            k = sal * sub_alpha(t, a, b); m = x * (1 - k) + srgb * k
    cu = (np.clip(clean, 0, 1) * 255 + .5).astype(np.uint8)
    if stills is not None:
        mu = (np.clip(m, 0, 1) * 255 + .5).astype(np.uint8)
        Image.fromarray(mu).save(f'{NL}/work/st_{f:04d}.jpg', quality=90); continue
    ec.stdin.write(cu.tobytes())
    if es: es.stdin.write((np.clip(m, 0, 1) * 255 + .5).astype(np.uint8).tobytes())
    if f % 96 == 0: print(f, flush=True)
if stills is None:
    ec.stdin.close(); ec.wait()
    if es: es.stdin.close(); es.wait()
print('done')
