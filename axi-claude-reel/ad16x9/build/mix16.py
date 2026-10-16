import subprocess, json, sys, numpy as np
SR, DUR = 48000, 47.0
N = int(SR * DUR)
S = sys.argv[1]
A, A0, OUT = f'{S}/ad/audio', f'{S}/audio', f'{S}/ad/work'

def load(p):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(b, np.float32).reshape(-1, 2).copy()

def active_db(x):
    m = np.abs(x).mean(1)
    k = SR // 50
    fr = m[:len(m) // k * k].reshape(-1, k)
    r = np.sqrt((fr ** 2).mean(1))
    act = r[20 * np.log10(r + 1e-9) > -50]
    return 20 * np.log10(np.sqrt((act ** 2).mean()) + 1e-9) if len(act) else -90

def norm(x, target_db):
    return x * 10 ** ((target_db - active_db(x)) / 20)

def pk(x, target_db):  # peak-normalise (transient SFX)
    return x * 10 ** (target_db / 20) / (np.abs(x).max() + 1e-9)

def lufs(x):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'],
                       input=x.astype(np.float32).tobytes(), capture_output=True).stderr.decode()
    return float(r[r.rfind('I:'):].split()[1])

def to_lufs(x, target):
    return x * 10 ** ((target - lufs(x)) / 20)

def ff(x, af):  # run a stereo float buffer through an ffmpeg filter chain
    r = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', af, '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-'],
                       input=x.astype(np.float32).tobytes(), capture_output=True).stdout
    y = np.frombuffer(r, np.float32).reshape(-1, 2).copy()
    return np.pad(y, ((0, max(0, len(x) - len(y))), (0, 0)))[:len(x)]

def place(buf, x, t, fi=0.0, fo=0.0, src=(0, None)):
    x = x[int(src[0] * SR): (int(src[1] * SR) if src[1] else None)].copy()
    if fi > 0:
        n = min(len(x), int(fi * SR)); x[:n] *= np.linspace(0, 1, n)[:, None]
    if fo > 0:
        n = min(len(x), int(fo * SR)); x[-n:] *= np.linspace(1, 0, n)[:, None]
    s = int(round(t * SR)); e = min(len(buf), s + len(x))
    if e > s: buf[s:e] += x[:e - s]

# ---------- voice-over ----------
vo_src = load(f'{A}/vo2.mp3')
CH = [(0.00, 1.50, 1.00), (1.85, 2.95, 4.25), (3.25, 4.60, 6.20), (4.80, 5.90, 8.40), (6.40, 8.75, 9.80),
      (9.00, 12.75, 12.30), (13.20, 14.50, 16.35), (14.60, 15.78, 19.05), (15.85, 16.90, 21.75), (17.10, 18.90, 24.40),
      (19.20, 21.65, 28.50), (21.80, 23.90, 32.35), (24.08, 27.20, 35.70), (27.38, 29.65, 39.05), (29.80, 31.84, 42.70)]
vo = np.zeros((N, 2), np.float32)
for a, b, t in CH:
    place(vo, vo_src, t, .015, .015, (a, b))
vo = ff(vo, 'highpass=f=70,acompressor=threshold=-26dB:ratio=3:attack=4:release=90:makeup=1,equalizer=f=3200:t=q:w=1.2:g=1.5,alimiter=limit=0.5:attack=2:release=40:level=disabled')
vo = to_lufs(vo, -17.0)

# ---------- music with sidechain ducking ----------
mus = load(f'{A}/music.mp3')[:N]
mus = np.pad(mus, ((0, N - len(mus)), (0, 0)))
mus = to_lufs(mus, -21.0)
env = np.abs(vo).mean(1)
k = SR // 100
e = np.repeat(np.sqrt((np.pad(env, (0, (-len(env)) % k)).reshape(-1, k) ** 2).mean(1)), k)[:N]
on = (20 * np.log10(e + 1e-9) > -45).astype(np.float32)
# attack 40ms, release 450ms one-pole on the 10ms grid
g = np.zeros(N // k + 1, np.float32); st = 0.0
oc = on[::k]
for i, v in enumerate(oc):
    c = .22 if v > st else .022
    st += (v - st) * c; g[i] = st
gg = np.repeat(g, k)[:N]
duck = 10 ** (-6.0 * gg / 20)
mus *= duck[:, None]
t = np.arange(N) / SR
mus *= np.clip((47.0 - t) / 1.0, 0, 1)[:, None]  # fade 46-47

# ---------- sound design ----------
sfx = np.zeros((N, 2), np.float32)
L = lambda n: load(f'{A}/{n}.mp3')
L0 = lambda n: load(f'{A0}/{n}.mp3')
night, clock, morning = norm(L('night'), -34), norm(L('clock'), -36), norm(L('morning'), -32)
place(sfx, night, 0.0, .6, 1.0)
place(sfx, night, 9.0, 1.0, 1.5, (0, 3.5))
place(sfx, clock, 4.0, .05, .25)
place(sfx, clock, 9.95, .05, .4, (0, 2.05))
place(sfx, pk(L('heartbeat'), -15), 8.2, 0, .4)
sh = L('shimmer')
for tt, db in [(12.0, -13), (16.0, -19), (18.7, -21), (21.4, -21), (24.0, -20)]:
    place(sfx, pk(sh, db), tt, 0, .5)
place(sfx, pk(L('brush'), -20), 19.0, 0, .3)
pen = L('pen')
place(sfx, pk(pen, -20), 22.0, 0, .3)
place(sfx, pk(pen, -25), 28.6, 0, .3)
place(sfx, pk(L('ledger'), -20), 24.4, 0, .3)
place(sfx, pk(L('converge'), -9), 30.4, 0, .4)
place(sfx, pk(L0('pop'), -19), 32.2)
place(sfx, pk(L0('pop'), -21), 32.5)
place(sfx, pk(L0('typing'), -22), 32.8, .05, .3, (0, 1.8))
place(sfx, pk(L0('chime'), -17), 34.9, 0, .3)
place(sfx, morning, 35.6, .5, .9, (0, 6.4))
wh = L0('whoosh')
place(sfx, pk(wh, -22), 27.75, 0, .2)
place(sfx, pk(wh, -15), 41.25, 0, .2)
place(sfx, pk(L('logo_boom'), -9), 41.6, 0, 1.6, (0, 3.2))

sfx *= (10 ** (-6.0 * gg / 20))[:, None]  # keep SFX/ambience under the voice
mix = vo + mus + sfx
for name, x in [('stem_vo', vo), ('stem_music', mus), ('stem_sfx', sfx), ('mix_pre', mix)]:
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_f32le', f'{OUT}/{name}.wav'],
                   input=x.astype(np.float32).tobytes(), check=True)

# ---------- master: gain + 4x-oversampled peak limiter, iterate to -14 LUFS ----------
pre = f'{OUT}/mix_pre.wav'
def master(gain_db):
    af = f"volume={gain_db:.2f}dB,aresample=192000,alimiter=limit=0.84:attack=1.5:release=60:level=disabled:asc=1,aresample=48000"
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', pre, '-af', af, '-ar', '48000', '-c:a', 'pcm_s24le', f'{OUT}/mix_master.wav'], check=True)
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', f'{OUT}/mix_master.wav', '-af', 'ebur128=peak=true:framelog=quiet', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    I = float(r[r.rfind('I:'):].split()[1]); TP = float(r[r.rfind('Peak:'):].split()[1])
    return I, TP
g0 = -14.0 - lufs(mix)
for _ in range(3):
    I, TP = master(g0)
    print(f'gain {g0:+.2f} dB -> I {I} LUFS, TP {TP} dBTP')
    if abs(I + 14.0) < 0.15: break
    g0 += -14.0 - I
for nm, x in [('vo', vo), ('music', mus), ('sfx', sfx)]: print(nm, 'LUFS', lufs(x), 'peak', round(20 * np.log10(np.abs(x).max() + 1e-9), 1))
