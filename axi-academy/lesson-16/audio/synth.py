"""Procedural score + SFX for Axi Academy lesson 16, mixed under the narration.

Music: 100 BPM, A-minor / F / C / G progression; layers enter per section intensity.
SFX: synthesized from the event list exported by the timeline (sfx.json).
The music is side-chained to the voice so the narration always sits on top.

Usage: python -I synth.py voice.wav sfx.json sections.json out.wav
"""
import json, sys
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

voice_path, sfx_path, sec_path, out_path = sys.argv[1:5]
SR = 48000
ev = json.load(open(sfx_path))
secs = json.load(open(sec_path))
OFF = secs['offset']; TOTAL = secs['total']
N = int(TOTAL * SR) + SR
rng = np.random.default_rng(16)

def t_arr(d): return np.arange(int(d * SR)) / SR
def env_adsr(n, a, d, s, r, sus_len=None):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    sl = n - a - d - r if sus_len is None else int(sus_len * SR)
    sl = max(0, sl)
    e = np.concatenate([np.linspace(0, 1, max(1, a)), np.linspace(1, s, max(1, d)), np.full(sl, s), np.linspace(s, 0, max(1, r))])
    return np.pad(e, (0, max(0, n - len(e))))[:n]
def bp(x, lo, hi, order=2): return sosfilt(butter(order, [lo, hi], btype='band', fs=SR, output='sos'), x)
def lp(x, f, order=2): return sosfilt(butter(order, f, btype='low', fs=SR, output='sos'), x)
def hp(x, f, order=2): return sosfilt(butter(order, f, btype='high', fs=SR, output='sos'), x)
def midi(m): return 440 * 2 ** ((m - 69) / 12)

L = np.zeros(N); R = np.zeros(N)
def add(sig, t0, gain=1.0, pan=0.0, left=None, right=None):
    i = int(t0 * SR)
    if i >= N: return
    if left is None:
        gl, gr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        left, right = sig * gl * gain, sig * gr * gain
    else:
        left, right = left * gain, right * gain
    n = min(len(left), N - i)
    L[i:i + n] += left[:n]; R[i:i + n] += right[:n]

# ---------------- music ----------------
BPM = 100; BEAT = 60 / BPM; BAR = 4 * BEAT
CHORDS = [  # (bass root, chord tones) — Am9, Fmaj7, Cmaj7(add9), G6
    (45, [57, 60, 64, 67, 71]),
    (41, [57, 60, 64, 65, 69]),
    (48, [55, 59, 62, 64, 67]),
    (43, [55, 59, 62, 64, 66]),
]
def intensity(t):
    lvl = 0
    for s in secs['music']:
        if t >= s['t']: lvl = s['lvl']
    return lvl

ML = np.zeros(N); MR = np.zeros(N)
def madd(sig, t0, gain, pan=0.0):
    i = int(t0 * SR)
    if i >= N or i < 0: return
    gl, gr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    n = min(len(sig), N - i); ML[i:i + n] += sig[:n] * gl * gain; MR[i:i + n] += sig[:n] * gr * gain

def pad_voice(f, dur):
    t = t_arr(dur); s = np.zeros_like(t)
    for det in (-0.12, 0.0, 0.11):
        ph = rng.random() * 2 * np.pi
        ff = f * 2 ** (det / 12)
        saw = 2 * ((ff * t + ph / (2 * np.pi)) % 1) - 1
        s += saw
    s = lp(s / 3, 1400)
    return s * env_adsr(len(t), 0.9, 0.5, 0.8, 1.2)

def pluck(f, dur=0.6):
    t = t_arr(dur)
    mod = np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 18) * 1.2
    s = np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 7.5)
    return s * np.minimum(1, t * 400)

def kick():
    t = t_arr(0.45); f = 48 + 70 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7) + 0.25 * hp(rng.standard_normal(len(t)), 2000) * np.exp(-t * 120)

def hat(open_=False):
    t = t_arr(0.18 if open_ else 0.06)
    return hp(rng.standard_normal(len(t)), 7000) * np.exp(-t * (25 if open_ else 70))

def sub(f, dur):
    t = t_arr(dur); return np.sin(2 * np.pi * f * t) * env_adsr(len(t), 0.01, 0.1, 0.8, 0.15)

start = OFF - 0.3
nbars = int((TOTAL - start) / BAR) + 1
for b in range(nbars):
    tb = start + b * BAR
    if tb > TOTAL - 0.5: break
    root, tones = CHORDS[(b // 2) % 4]
    lvl = intensity(tb + 0.01)
    if b % 2 == 0:  # pad sustains 2 bars
        for k, m in enumerate(tones[:4]):
            madd(pad_voice(midi(m), 2 * BAR + 0.6), tb, 0.055, pan=(-0.4 + 0.27 * k))
    if lvl >= 2:  # arp in 8ths
        pattern = [0, 2, 4, 1, 3, 2, 4, 1]
        for i, pi in enumerate(pattern):
            m = tones[pi] + (12 if (i % 4 == 2 and lvl >= 3) else 0)
            madd(pluck(midi(m)), tb + i * BEAT / 2, 0.06 if i % 2 == 0 else 0.042, pan=0.35 if i % 2 else -0.35)
    if lvl >= 3:
        for i in range(4):
            madd(hat(), tb + i * BEAT + BEAT / 2, 0.05, pan=0.2)
        madd(sub(midi(root), BAR * 0.95), tb, 0.16)
    if lvl >= 4:
        for i in range(4):
            madd(kick(), tb + i * BEAT, 0.34)
        madd(hat(True), tb + 3.5 * BEAT, 0.035, pan=-0.2)

# final resolve chord under the close
for k, m in enumerate([45, 57, 60, 64, 71]):
    madd(pad_voice(midi(m), 4.0), TOTAL - 4.6, 0.06, pan=-0.3 + 0.15 * k)

# reverb (synthetic IR) on music
ir_t = t_arr(2.2); ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 3.2); ir = lp(ir, 5000) * 0.012
ML = ML + fftconvolve(ML, ir)[:N]; MR = MR + fftconvolve(MR, ir[::-1] * 0.98)[:N]

# ---------------- voice + side-chain ----------------
import soundfile as sf
v, vsr = sf.read(voice_path, dtype='float64')
if v.ndim > 1: v = v.mean(axis=1)
assert vsr == SR
voice = np.zeros(N); vi = int(OFF * SR); voice[vi:vi + len(v)] = v[:N - vi]
# envelope follower
a = np.abs(voice); win = int(0.03 * SR)
envv = np.convolve(a, np.ones(win) / win, mode='same')
act = (envv > 0.012).astype(float)
# attack 40 ms, release 350 ms smoothing
alpha_a, alpha_r = np.exp(-1 / (0.04 * SR)), np.exp(-1 / (0.35 * SR))
g = np.zeros(N); cur = 0.0
step = 64
for i in range(0, N, step):
    tgt = act[i]
    al = alpha_a if tgt > cur else alpha_r
    cur = tgt + (cur - tgt) * (al ** step)
    g[i:i + step] = cur
duck = 1 - 0.62 * g  # ≈ -8.4 dB under speech
ML *= duck; MR *= duck

# ---------------- SFX ----------------
def whoosh(d=0.45, up=True):
    t = t_arr(d); n = rng.standard_normal(len(t)); out = np.zeros_like(t); seg = 1024
    for i in range(0, len(t), seg):
        u = i / len(t); fc = 300 * (12 ** (u if up else 1 - u))
        out[i:i + seg] = bp(n[i:i + seg + 2048], fc * 0.7, min(fc * 1.5, 16000))[:len(out[i:i + seg])]
    e = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.6
    return out * e * 2.2
def tick(f=3200):
    t = t_arr(0.03); return np.sin(2 * np.pi * f * t) * np.exp(-t * 220) + 0.4 * hp(rng.standard_normal(len(t)), 4000) * np.exp(-t * 600)
def pop(f0=700):
    t = t_arr(0.09); f = f0 * (0.55 + 0.45 * np.exp(-t * 40)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 45)
def thump():
    t = t_arr(0.35); f = 40 + 80 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11) + 0.3 * lp(rng.standard_normal(len(t)), 1200) * np.exp(-t * 60)
def scan(d=0.5):
    t = t_arr(d); f = 2400 * np.exp(-t * 5) + 180
    s = 0.5 * np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.6 * bp(rng.standard_normal(len(t)), 1500, 7000)
    return s * np.sin(np.pi * np.clip(t / d, 0, 1)) * 0.8
def pen(d=0.5):
    t = t_arr(d); n = bp(rng.standard_normal(len(t)), 2200, 7500)
    am = 0.55 + 0.45 * np.sin(2 * np.pi * (34 + 9 * np.sin(t * 7)) * t) ** 2
    e = np.minimum(1, t * 30) * np.minimum(1, (d - t) * 20)
    return n * am * e * 0.8
def riser(d=1.2):
    t = t_arr(d); n = bp(rng.standard_normal(len(t)), 600, 9000); f = 220 * 2 ** (2.5 * t / d)
    s = 0.6 * n * (t / d) ** 2 + 0.25 * np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / d) ** 1.5
    return s
def bell(freqs, d=2.5, decay=2.2):
    t = t_arr(d); s = np.zeros_like(t)
    for k, f in enumerate(freqs):
        mod = np.sin(2 * np.pi * f * 3.5 * t) * np.exp(-t * 6) * 1.5
        s += np.sin(2 * np.pi * f * t + mod) * np.exp(-t * (decay + k * 0.4)) / (k + 1) ** 0.4
    return s * np.minimum(1, t * 300)
def identity():
    th = thump(); return bell([midi(69), midi(76), midi(81)], 2.6) * 0.6 + np.pad(th, (0, int(2.6 * SR) - len(th)))
def sting():
    s = bell([midi(64), midi(71), midi(76), midi(83)], 2.4, 2.6) * 0.55
    s[:len(thump())] += thump() * 1.1
    s[:int(0.5 * SR)] += whoosh(0.5, False)[:int(0.5 * SR)] * 0.25
    return s
def click():
    a = tick(2600); b = tick(1800) * 0.7; out = np.zeros(int(0.08 * SR)); out[:len(a)] += a; out[int(0.035 * SR):int(0.035 * SR) + len(b)] += b; return out
def gear():
    t = t_arr(0.07); return bp(rng.standard_normal(len(t)), 1500, 4200, 3) * np.exp(-t * 90) * 1.6
def beep(f=1046):
    t = t_arr(0.12); return np.sin(2 * np.pi * f * t) * np.minimum(1, t * 400) * np.exp(-t * 18)
def rollup(d=0.8, n=14):
    out = np.zeros(int(d * SR) + SR // 10)
    for i in range(n):
        u = i / n; ti = d * (1 - (1 - u) ** 2); s = tick(2200 + 1400 * u) * (0.6 + 0.4 * u); j = int(ti * SR); out[j:j + len(s)] += s
    return out
def stamp():
    s = thump() * 1.2; n = len(s); s += hp(rng.standard_normal(n), 900) * np.exp(-t_arr(n / SR) * 45) * 0.5; return s
def type_(d=0.4, n=5):
    out = np.zeros(int(d * SR) + SR // 10)
    for i in range(n):
        s = tick(1500 + 300 * (i % 3)) * 0.8; j = int(i * d / n * SR); out[j:j + len(s)] += s
    return out
def swipe(d=0.25): return whoosh(d, True) * 0.8
def snap_():
    t = t_arr(0.05); return hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 140) * 1.4

GEN = {
    'whoosh': lambda e: whoosh(e.get('d', 0.45), e.get('up', True)), 'swipe': lambda e: swipe(e.get('d', 0.25)),
    'tick': lambda e: tick(e.get('f', 3200)), 'pop': lambda e: pop(e.get('f', 700)), 'thump': lambda e: thump(),
    'scan': lambda e: scan(e.get('d', 0.5)), 'pen': lambda e: pen(e.get('d', 0.5)), 'riser': lambda e: riser(e.get('d', 1.2)),
    'identity': lambda e: identity(), 'sting': lambda e: sting(), 'click': lambda e: click(), 'gear': lambda e: gear(),
    'beep': lambda e: beep(e.get('f', 1046)), 'rollup': lambda e: rollup(e.get('d', 0.8), e.get('n', 14)), 'stamp': lambda e: stamp(),
    'type': lambda e: type_(e.get('d', 0.4), e.get('n', 5)), 'snap': lambda e: snap_(),
}
TYPE_GAIN = {'snap': 0.4, 'identity': 0.5, 'sting': 0.5, 'thump': 0.75, 'scan': 0.8}  # tame transient-heavy sounds
SL = np.zeros(N); SRr = np.zeros(N)
for e in ev:
    sig = GEN[e['type']](e)
    gain = e.get('g', 0.3) * TYPE_GAIN.get(e['type'], 1.0); pan = e.get('pan', 0.0)
    i = int(e['t'] * SR)
    if i >= N: continue
    n = min(len(sig), N - i)
    gl, gr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    SL[i:i + n] += sig[:n] * gain * gl; SRr[i:i + n] += sig[:n] * gain * gr
# light room on sfx
ir2 = rng.standard_normal(int(0.8 * SR)) * np.exp(-t_arr(0.8) * 7) * 0.01
SL = SL + fftconvolve(SL, ir2)[:N]; SRr = SRr + fftconvolve(SRr, ir2)[:N]
# keep SFX a touch under speech too
sduck = 1 - 0.35 * g
SL *= sduck; SRr *= sduck

# ---------------- mix ----------------
import os
if os.environ.get('STEMS'):
    for nm, a, b in [('music', ML, MR), ('sfx', SL, SRr), ('voice', voice, voice)]:
        sf.write(out_path.replace('.wav', f'_{nm}.wav'), np.stack([a, b], axis=1)[:int(TOTAL * SR)].astype(np.float32), SR, subtype='FLOAT')
outL = voice * 1.0 + ML * 1.0 + SL
outR = voice * 1.0 + MR * 1.0 + SRr
out = np.stack([outL, outR], axis=1)[:int(TOTAL * SR)]
# fade tail
fade = int(0.6 * SR); out[-fade:] *= np.linspace(1, 0, fade)[:, None]
peak = np.abs(out).max(); out = out / max(peak, 1e-9) * 0.89
sf.write(out_path, out.astype(np.float32), SR, subtype='FLOAT')
print('wrote', out_path, round(len(out) / SR, 2), 's; peak was', round(float(peak), 3))
