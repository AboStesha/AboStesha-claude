import subprocess, sys, numpy as np
S = sys.argv[1]
NL = f'{S}/nl'
sys.path.insert(0, NL)
from edit import CUTS, VO, DUR
SR = 48000
N = int(round(DUR * SR))
OUT = f'{NL}/work'

def load(p, ss=None, t=None):
    cmd = ['ffmpeg', '-v', 'error']
    if ss is not None: cmd += ['-ss', f'{ss:.3f}']
    cmd += ['-i', p]
    if t is not None: cmd += ['-t', f'{t:.3f}']
    cmd += ['-vn', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-']
    b = subprocess.run(cmd, capture_output=True).stdout
    return np.frombuffer(b, np.float32).reshape(-1, 2).copy()

def lufs(x):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'],
                       input=x.astype(np.float32).tobytes(), capture_output=True).stderr.decode()
    return float(r[r.rfind('I:'):].split()[1])

def to_lufs(x, target): return x * 10 ** ((target - lufs(x)) / 20)

def ff(x, af):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', af, '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-'],
                       input=x.astype(np.float32).tobytes(), capture_output=True).stdout
    y = np.frombuffer(r, np.float32).reshape(-1, 2).copy()
    return np.pad(y, ((0, max(0, len(x) - len(y))), (0, 0)))[:len(x)]

def place(buf, x, t, fi=0.0, fo=0.0):
    x = x.copy()
    if fi > 0: n = min(len(x), int(fi * SR)); x[:n] *= np.linspace(0, 1, n)[:, None]
    if fo > 0: n = min(len(x), int(fo * SR)); x[-n:] *= np.linspace(1, 0, n)[:, None]
    s = int(round(t * SR)); e = min(len(buf), s + len(x))
    if e > s: buf[s:e] += x[:e - s]

def env_gain(on, depth_db, att=.25, rel=.03):
    k = SR // 100; o = on[::k]; g = np.zeros(len(o), np.float32); st = 0.0
    for i, v in enumerate(o):
        st += (v - st) * (att if v > st else rel); g[i] = st
    return 10 ** (-depth_db * np.repeat(g, k)[:len(on)] / 20)

t = np.arange(N) / SR
# ---------- voice-over ----------
src = load(f'{NL}/audio/vo_t1.mp3')
vo = np.zeros((N, 2), np.float32)
for a, b, st in VO:
    place(vo, src[int(a * SR):int(b * SR)], st, .012, .02)
vo = ff(vo, 'highpass=f=75,acompressor=threshold=-24dB:ratio=2.5:attack=6:release=120:makeup=1,'
            'equalizer=f=180:t=q:w=1:g=1.5,equalizer=f=3000:t=q:w=1.2:g=1.2,'
            'aecho=0.8:0.35:60|110:0.12|0.07,alimiter=limit=0.5:attack=2:release=40:level=disabled')
vo = to_lufs(vo, -16.5)
venv = np.abs(vo).mean(1)
k = SR // 100
r = np.repeat(np.sqrt((np.pad(venv, (0, (-len(venv)) % k)).reshape(-1, k) ** 2).mean(1)), k)[:N]
von = (20 * np.log10(r + 1e-9) > -44).astype(np.float32)

# ---------- native shot sound (SFX bed), cut exactly like the picture ----------
sfx = np.zeros((N, 2), np.float32)
for name, a, b, ip in CUTS:
    if name in (None, 'END'): continue
    x = load(f'{NL}/shots/{name}.mp4', ip, (b - a) + 0.06)
    place(sfx, x, a, .03, .06)
sfx = ff(sfx, 'highpass=f=40,lowpass=f=14000')
sfx = to_lufs(sfx, -29.0)

# ---------- score ----------
mus = np.zeros((N, 2), np.float32)
A = load(f'{OUT}/scoreA_st.wav'); B = load(f'{OUT}/scoreB_st.wav')   # time-stretched back to the cut length
place(mus, A[:int(10.15 * SR)], 0.0, 0.0, 0.12)        # part A ends at the dim
place(mus, B, 11.45, 0.25, 0.8)
mus = ff(mus, 'highpass=f=28,equalizer=f=2600:t=q:w=1.0:g=-3')
mus = to_lufs(mus, -20.5)
# Nolan-style layers synced to the cuts (synth.py): ticking clock, Shepard riser, drone, organ pad, braam
for nm, tgt in [('syn_tick', -27.5), ('syn_shepard', -31.0), ('syn_drone', -33.0), ('syn_pad', -30.0), ('syn_braam', -23.0)]:
    mus += to_lufs(load(f'{OUT}/{nm}.wav')[:N], tgt)

# ---------- designed hits (sub booms + tick) ----------
def boom(dur=2.4, f0=62, f1=31, amp=0.9):
    n = int(dur * SR); tt = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-tt * 3.2); ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * np.exp(-tt * 1.6) * amp
    y = np.tanh(y * 1.6) / np.tanh(1.6)
    nz = np.random.default_rng(1).standard_normal(n) * np.exp(-tt * 40) * 0.25
    y = y + np.convolve(nz, np.ones(24) / 24, 'same')
    return np.stack([y, y], 1).astype(np.float32)
hits = np.zeros((N, 2), np.float32)
place(hits, boom(2.6), 0.27)            # water drop impact (crown forms at the cut-in)
place(hits, boom(2.2, 70, 34, .7), 11.47)  # light returns after the dim
place(hits, boom(3.2, 58, 28, 1.0), 33.72)  # red axi logo
hits = to_lufs(hits, -24.0)

# ---------- ducking, dim, assemble ----------
duck_m = env_gain(von, 8.0); duck_s = env_gain(von, 5.0)
mus *= duck_m[:, None]; sfx *= duck_s[:, None]
dim = np.ones(N, np.float32)
dim[(t >= 10.15) & (t < 11.45)] = 0.0
ramp = (t >= 10.0) & (t < 10.15); dim[ramp] = np.linspace(1, 0, ramp.sum())
sfx *= dim[:, None]
endfade = np.clip((DUR - t) / 1.2, 0, 1)[:, None]
mix = (vo + mus + sfx + hits) * endfade
for nm, x in [('stem_vo', vo), ('stem_music', mus), ('stem_sfx', sfx), ('stem_hits', hits), ('mix_pre', mix)]:
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_f32le', f'{OUT}/{nm}.wav'],
                   input=x.astype(np.float32).tobytes(), check=True)

pre = f'{OUT}/mix_pre.wav'
def master(gain_db):
    af = f"volume={gain_db:.2f}dB,aresample=192000,alimiter=limit=0.84:attack=1.5:release=60:level=disabled:asc=1,aresample=48000"
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', pre, '-af', af, '-ar', '48000', '-c:a', 'pcm_s24le', f'{OUT}/mix_master.wav'], check=True)
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', f'{OUT}/mix_master.wav', '-af', 'ebur128=peak=true:framelog=quiet', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    return float(r[r.rfind('I:'):].split()[1]), float(r[r.rfind('Peak:'):].split()[1])
g = -14.0 - lufs(mix)
for _ in range(3):
    I, TP = master(g); print(f'gain {g:+.2f} -> I {I} TP {TP}')
    if abs(I + 14) < .15: break
    g += -14 - I
for nm, x in [('vo', vo), ('music', mus), ('sfx', sfx), ('hits', hits)]: print(nm, lufs(x))
