import subprocess, sys, numpy as np
S = sys.argv[1]
AC = f'{S}/acad'
sys.path.insert(0, AC)
from edit9 import CUTS, DUR
SR = 48000
N = int(round(DUR * SR))
OUT = f'{AC}/work'

def load(p, ss=None, t=None, af=None):
    cmd = ['ffmpeg', '-v', 'error']
    if ss is not None: cmd += ['-ss', f'{ss:.3f}']
    cmd += ['-i', p]
    if t is not None: cmd += ['-t', f'{t:.3f}']
    if af: cmd += ['-af', af]
    cmd += ['-vn', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-']
    b = subprocess.run(cmd, capture_output=True).stdout
    return np.frombuffer(b, np.float32).reshape(-1, 2).copy()

def lufs(x):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'],
                       input=x.astype(np.float32).tobytes(), capture_output=True).stderr.decode()
    return float(r[r.rfind('I:'):].split()[1])

def to_lufs(x, target): return x * 10 ** ((target - lufs(x)) / 20)

def place(buf, x, t, fi=0.0, fo=0.0):
    x = x.copy()
    if fi > 0: n = min(len(x), int(fi * SR)); x[:n] *= np.linspace(0, 1, n)[:, None]
    if fo > 0: n = min(len(x), int(fo * SR)); x[-n:] *= np.linspace(1, 0, n)[:, None]
    s = int(round(t * SR)); e = min(len(buf), s + len(x))
    if e > s: buf[s:e] += x[:e - s]

def save(name, x, fmt='pcm_f32le'):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', fmt, f'{OUT}/{name}.wav'],
                   input=x.astype(np.float32).tobytes(), check=True)

t = np.arange(N) / SR
# ---------- score (Seedance, scored against this cut) ----------
mus = np.zeros((N, 2), np.float32)
A = load(f'{OUT}/scoreA.mp4', af=f'atempo={sys.argv[2]}')
B = load(f'{OUT}/scoreB.mp4', af=f'atempo={sys.argv[3]}')
place(mus, A[:int(17.65 * SR)], 0.0, 0.0, 0.10)
place(mus, B[int(0.45 * SR):], 17.8 + 0.45, 0.02, 1.0)
mus = to_lufs(mus, -18.5)
for nm, tgt in [('syn_tick', -26.0), ('syn_shepard', -30.0), ('syn_drone', -32.0), ('syn_pad', -29.0),
                ('syn_braam', -22.0), ('syn_hits', -24.0), ('syn_booms', -21.0)]:
    mus += to_lufs(load(f'{OUT}/{nm}.wav')[:N], tgt)

# ---------- native shot sound, cut like the picture ----------
sfx = np.zeros((N, 2), np.float32)
for name, a, b, ip in CUTS:
    if name in (None, 'END'): continue
    place(sfx, load(f'{AC}/shots/{name}.mp4', ip, (b - a) + 0.06), a, .03, .06)
sfx = to_lufs(sfx, -28.0)

# ---------- dims: real silence ----------
gate = np.ones(N, np.float32)
for a, b in [(4.20, 5.40), (17.70, 18.30)]:
    gate[(t >= a) & (t < b)] = 0.0
    r = (t >= a - .12) & (t < a); gate[r] = np.minimum(gate[r], np.linspace(1, 0, r.sum()))
sfx *= gate[:, None]
air = np.random.default_rng(3).standard_normal((N, 2)).astype(np.float32)
air = np.convolve(air[:, 0], np.ones(400) / 400, 'same')[:, None] * np.ones((1, 2), np.float32) * 0.004
mus += air * (1 - gate)[:, None] * ((t >= 4.2) & (t < 5.4))[:, None]   # a faint breath of air in the first dim
endfade = np.clip((DUR - t) / 1.2, 0, 1)[:, None]
mus *= endfade; sfx *= endfade
mix = mus + sfx
save('stem_music', mus); save('stem_sfx', sfx); save('mix_pre', mix)

pre = f'{OUT}/mix_pre.wav'
def master(src, dst, gain_db):
    af = f"volume={gain_db:.2f}dB,aresample=192000,alimiter=limit=0.84:attack=1.5:release=60:level=disabled:asc=1,aresample=48000"
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', af, '-ar', '48000', '-c:a', 'pcm_s24le', dst], check=True)
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', dst, '-af', 'ebur128=peak=true:framelog=quiet', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    return float(r[r.rfind('I:'):].split()[1]), float(r[r.rfind('Peak:'):].split()[1])
g = -14.0 - lufs(mix)
for _ in range(3):
    I, TP = master(pre, f'{OUT}/mix_master.wav', g); print(f'gain {g:+.2f} -> I {I} TP {TP}')
    if abs(I + 14) < .15: break
    g += -14 - I
# M&E stems for the voice-over session, same gain as the master (pre-limiter headroom kept)
for nm in ['stem_music', 'stem_sfx']:
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{OUT}/{nm}.wav', '-af', f'volume={g - 4:.2f}dB', '-c:a', 'pcm_s24le', f'{OUT}/{nm}_24.wav'], check=True)
print('music', lufs(mus), 'sfx', lufs(sfx))
