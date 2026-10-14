"""Axi Academy score + SFX (parametric): each lesson passes its own style in sections.json
(bpm, chords, drum kit pattern, pluck/arp timbre, swing). Section energy follows the chapter map;
motion SFX come from the timeline. Music and SFX are side-chained under the narration.

Usage: python -I synth.py voice.wav sfx.json sections.json out.wav
  STEMS=1  also writes music/sfx/voice stems
  NOVOICE=1 writes the bed only (music + SFX, still ducked for the voice, same gain as the full mix)
            to out.wav and the full reference mix to out_full.wav
"""
import json, sys, os
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve, lfilter
import soundfile as sf

voice_path, sfx_path, sec_path, out_path = sys.argv[1:5]
SR = 48000
ev = json.load(open(sfx_path)); secs = json.load(open(sec_path))
OFF = secs['offset']; TOTAL = secs['total']; N = int(TOTAL * SR) + SR
rng = np.random.default_rng(17)

def T(d): return np.arange(int(d * SR)) / SR
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], btype='band', fs=SR, output='sos'), x)
def lp(x, f, o=2): return sosfilt(butter(o, f, btype='low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, btype='high', fs=SR, output='sos'), x)
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def env(n, a, d, s, r):
    a, d, r = max(1, int(a * SR)), max(1, int(d * SR)), max(1, int(r * SR)); sl = max(0, n - a - d - r)
    e = np.concatenate([np.linspace(0, 1, a), np.linspace(1, s, d), np.full(sl, s), np.linspace(s, 0, r)]); return np.pad(e, (0, max(0, n - len(e))))[:n]

ML = np.zeros(N); MR = np.zeros(N); KICKS = []
def madd(sig, t0, g, pan=0.0):
    i = int(t0 * SR)
    if i < 0 or i >= N: return
    gl, gr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4); n = min(len(sig), N - i)
    ML[i:i + n] += sig[:n] * g * gl; MR[i:i + n] += sig[:n] * g * gr

# ---------------- instruments ----------------
def kick():
    t = T(0.42); f = 46 + 110 * np.exp(-t * 32); s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5)
    s[:int(0.004 * SR)] += hp(rng.standard_normal(int(0.004 * SR)), 3000) * 0.6
    return np.tanh(s * 1.6)
def clap():
    t = T(0.22); n = bp(rng.standard_normal(len(t)), 900, 5200); e = np.zeros_like(t)
    for k, d in enumerate([0, 0.011, 0.022]): e += np.exp(-np.maximum(0, t - d) * (90 if k < 2 else 22)) * (t >= d)
    return n * e * 0.8
def hat(o=False):
    t = T(0.2 if o else 0.05); return hp(rng.standard_normal(len(t)), 8000) * np.exp(-t * (22 if o else 85))
def snap():
    t = T(0.08); return bp(rng.standard_normal(len(t)), 1800, 6000) * np.exp(-t * 70) * 1.2
def sub(f, d):
    t = T(d); return (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)) * env(len(t), 0.005, 0.08, 0.85, 0.06)
def bass(f, d):
    t = T(d); saw = 2 * ((f * t) % 1) - 1; lo, hi = lp(saw, 600), lp(saw, 1500); k = np.exp(-t * 18)  # filter envelope: bright attack → dark body
    return (lo + (hi - lo) * k) * env(len(t), 0.005, 0.1, 0.6, 0.05)
def pluck(f, d=0.35):
    t = T(d); mod = np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 22) * 1.4
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 9) * np.minimum(1, t * 500)
def pad(f, d):
    t = T(d); s = np.zeros_like(t)
    for det in (-0.1, 0.0, 0.09):
        s += 2 * ((f * 2 ** (det / 12) * t + rng.random()) % 1) - 1
    return lp(s / 3, 1600) * env(len(t), 0.6, 0.4, 0.75, 0.9)

ST = secs.get('style', {})
BPM = ST.get('bpm', 120); BEAT = 60 / BPM; BAR = 4 * BEAT
CHORDS = [tuple(c) for c in ST.get('chords', [(38, [62, 65, 69, 72, 76]), (34, [58, 62, 65, 69, 72]), (41, [60, 65, 69, 72, 76]), (36, [60, 64, 67, 69, 74])])]
KIT = ST.get('kit', 'four'); TIMBRE = ST.get('pluck', 'fm'); SWING = ST.get('swing', 0.0)
BASSPAT = ST.get('bass', [0, 0, 1, 0, 0, 1, 0, 1]); ARP = ST.get('arp', [0, 2, 4, 3, 1, 4, 2, 3]); PADCUT = ST.get('padcut', 1600)
CHORD_BARS = ST.get('chordBars', 2)
def mallet(f, d=0.5):
    t = T(d); s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 3.98 * t) * np.exp(-t * 28) + 0.12 * np.sin(2 * np.pi * f * 9.2 * t) * np.exp(-t * 60)
    return s * np.exp(-t * 7) * np.minimum(1, t * 800)
def glass(f, d=0.8):
    t = T(d); mod = np.sin(2 * np.pi * f * 3.5 * t) * np.exp(-t * 6) * 2.2
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 4.2) * np.minimum(1, t * 600) * 0.8
# Karplus–Strong plucked string (the «thread»): a noise burst circulating in a damped delay line
KS_CACHE = {}
def ks(f, d=1.4, bright=0.55, decay=0.9965, seed=0):
    k = (round(f, 2), d, bright, decay, seed)
    if k in KS_CACHE: return KS_CACHE[k]
    L = max(2, int(SR / f - 0.5)); n = int(d * SR); r = np.random.default_rng(100 + seed)
    exc = r.standard_normal(L) * np.hanning(L) ** 0.3
    exc = lp(np.concatenate([exc, np.zeros(64)]), 1500 + 9000 * bright)[:L]
    x = np.zeros(n); x[:L] = exc
    a = np.zeros(L + 2); a[0] = 1.0; a[L] = -decay * 0.5; a[L + 1] = -decay * 0.5
    y = lfilter([1.0], a, x)
    y = y / (np.abs(y).max() + 1e-9); fade = int(0.05 * SR); y[-fade:] *= np.linspace(1, 0, fade)
    KS_CACHE[k] = y; return y
def string(f, d=0.9):
    y = ks(f, d, 0.5, 0.996); t = T(len(y) / SR)
    return y * 0.8 + np.sin(2 * np.pi * f * t) * np.exp(-t * 9) * 0.25
def note(f, d=0.35):
    return mallet(f) if TIMBRE == 'mallet' else glass(f) if TIMBRE == 'glass' else string(f) if TIMBRE == 'string' else pluck(f, d)
def sw(i):  # swing on odd 16ths
    return SWING * BEAT / 4 if i % 2 else 0.0
def padv(f, d):
    t = T(d); s = np.zeros_like(t)
    for det in (-0.1, 0.0, 0.09):
        s += 2 * ((f * 2 ** (det / 12) * t + rng.random()) % 1) - 1
    return lp(s / 3, PADCUT) * env(len(t), 0.6, 0.4, 0.75, 0.9)
def level(t):
    lv = 0
    for s in secs['music']:
        if t >= s['t']: lv = s['lvl']
    return lv

start = OFF - BEAT * 2
nb = int((TOTAL - start) / BAR) + 1
for b in range(nb):
    tb = start + b * BAR
    if tb > TOTAL - 0.4: break
    root, tones = CHORDS[(b // CHORD_BARS) % len(CHORDS)]; lv = level(tb + 0.01)
    if b % CHORD_BARS == 0 and lv >= 1:
        for k, m in enumerate(tones[:4]): madd(padv(midi(m), CHORD_BARS * BAR + 0.5), tb, 0.045 if lv < 3 else 0.032, pan=-0.45 + 0.3 * k)
    if lv >= 2:
        for i in range(16):
            vel = [1, .45, .7, .45][i % 4]
            madd(hat(), tb + i * BEAT / 4 + sw(i), 0.045 * vel, pan=0.25)
        madd(hat(True), tb + 1.5 * BEAT, 0.03, pan=-0.2); madd(hat(True), tb + 3.5 * BEAT, 0.03, pan=-0.2)
    if lv >= 3:
        if KIT == 'half':
            kicks = [0, 2.5]; claps = [2]
        elif KIT == 'broken':
            kicks = [0, 1.5, 2.75]; claps = [1, 3]
        else:
            kicks = [0, 1, 2, 3]; claps = [1, 3]
        for k in kicks: madd(kick(), tb + k * BEAT, 0.42); KICKS.append(tb + k * BEAT)
        for c in claps: madd(clap(), tb + c * BEAT, 0.22)
        for i, oc in enumerate(BASSPAT): madd(bass(midi(root + 12 * oc), BAR / len(BASSPAT) * 0.9), tb + i * BAR / len(BASSPAT) + sw(i * 2), 0.11)
        madd(sub(midi(root), BAR * 0.98), tb, 0.16)
    if lv >= 4:
        for i in range(16):
            m = tones[ARP[i % len(ARP)] % len(tones)] + (12 if i % 8 in (2, 6) else 0)
            madd(note(midi(m)), tb + i * BEAT / 4 + sw(i), 0.05 if i % 2 == 0 else 0.032, pan=0.4 if i % 2 else -0.4)
    elif lv == 2:
        for i in range(8):
            m = tones[[0, 2, 4, 2][i % 4] % len(tones)]; madd(note(midi(m)), tb + i * BEAT / 2 + sw(i * 2), 0.04, pan=0.3 if i % 2 else -0.3)

# kick side-chain pumping on pads/bass
pump = np.ones(N)
for k in KICKS:
    i = int(k * SR); n = int(0.28 * SR); seg = 1 - 0.55 * np.exp(-np.arange(n) / SR * 14)
    pump[i:i + n] = np.minimum(pump[i:i + n], seg[:max(0, min(n, N - i))])
ML *= pump; MR *= pump

# room
ir_t = T(1.8); ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 3.6); ir = lp(ir, 6000) * 0.01
ML = ML + fftconvolve(ML, ir)[:N]; MR = MR + fftconvolve(MR, ir[::-1])[:N]

# ---------------- voice + ducking ----------------
v, vsr = sf.read(voice_path, dtype='float64')
if v.ndim > 1: v = v.mean(axis=1)
assert vsr == SR
voice = np.zeros(N); vi = int(OFF * SR); voice[vi:vi + len(v)] = v[:N - vi]
a = np.abs(voice); win = int(0.03 * SR); envv = np.convolve(a, np.ones(win) / win, mode='same'); act = (envv > 0.012).astype(float)
g = np.zeros(N); cur = 0.0; step = 64; aa, ar = np.exp(-1 / (0.03 * SR)), np.exp(-1 / (0.3 * SR))
for i in range(0, N, step):
    tg = act[i]; al = aa if tg > cur else ar; cur = tg + (cur - tg) * (al ** step); g[i:i + step] = cur
DUCK = ST.get('duck', 0.66); ML *= 1 - DUCK * g; MR *= 1 - DUCK * g

# ---------------- SFX ----------------
def whoosh(d=0.4, up=True, lo=250, hi=7000):
    t = T(d); n = rng.standard_normal(len(t)); out = np.zeros_like(t); seg = 1024
    for i in range(0, len(t), seg):
        u = i / len(t); u = u if up else 1 - u; fc = lo * (hi / lo) ** u
        out[i:i + seg] = bp(n[i:i + seg + 2048], fc * 0.7, min(fc * 1.45, 18000))[:len(out[i:i + seg])]
    return out * np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.4 * 2.2
def whip(): return whoosh(0.28, True, 400, 12000) * 1.1
def impact():
    t = T(1.2); f = 38 + 90 * np.exp(-t * 18); s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    s += lp(rng.standard_normal(len(t)), 2400) * np.exp(-t * 14) * 0.5
    return np.tanh(s * 1.4)
def slam():
    t = T(0.5); f = 52 + 140 * np.exp(-t * 30); s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
    s += bp(rng.standard_normal(len(t)), 600, 4000) * np.exp(-t * 40) * 0.7; return np.tanh(s * 1.5)
def tick(f=3000):
    t = T(0.03); return np.sin(2 * np.pi * f * t) * np.exp(-t * 230) + 0.35 * hp(rng.standard_normal(len(t)), 4000) * np.exp(-t * 600)
def click():
    o = np.zeros(int(0.07 * SR)); a = tick(2400); b = tick(1700) * 0.7; o[:len(a)] += a; j = int(0.03 * SR); o[j:j + len(b)] += b; return o
def pop(f=760):
    t = T(0.1); fr = f * (0.55 + 0.45 * np.exp(-t * 40)); return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 40)
def bloop(f0=520, f1=180):
    t = T(0.22); fr = f1 + (f0 - f1) * np.exp(-t * 16); return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 14)
def stretch():
    t = T(0.45); fr = 180 + 500 * (1 - np.exp(-t * 9)) + 30 * np.sin(t * 60); return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.sin(np.pi * t / 0.45) * 0.7
def spin():
    t = T(0.5); n = bp(rng.standard_normal(len(t)), 1200, 6000); am = 0.5 + 0.5 * np.sin(2 * np.pi * (14 + 18 * t) * t); return n * am * np.sin(np.pi * t / 0.5) * 1.2
def glitch():
    out = np.zeros(int(0.32 * SR)); p = 0
    for k in range(7):
        d = int((0.015 + 0.03 * rng.random()) * SR); f = 200 + 3000 * rng.random()
        seg = np.sign(np.sin(2 * np.pi * f * np.arange(d) / SR)) * 0.5 + bp(rng.standard_normal(d), 800, 8000) * 0.5
        out[p:p + d] += seg[:max(0, min(d, len(out) - p))] * np.exp(-np.arange(min(d, len(out) - p)) / SR * 30); p += int(d * 1.3)
        if p >= len(out): break
    return out * 0.7
def riser(d=1.5):
    t = T(d); n = bp(rng.standard_normal(len(t)), 500, 10000); fr = 200 * 2 ** (3 * t / d)
    return 0.55 * n * (t / d) ** 2.2 + 0.22 * np.sin(2 * np.pi * np.cumsum(fr) / SR) * (t / d) ** 1.6
def revswell(d=0.9):
    t = T(d); n = hp(rng.standard_normal(len(t)), 3000) * (t / d) ** 3; return n * 0.9
def chime():
    out = np.zeros(int(0.9 * SR))
    for k, (m, dt) in enumerate([(81, 0), (88, 0.09)]):
        t = T(0.8); s = np.sin(2 * np.pi * midi(m) * t + np.sin(2 * np.pi * midi(m) * 2 * t) * np.exp(-t * 10)) * np.exp(-t * 5); j = int(dt * SR); out[j:j + len(s)] += s[:len(out) - j]
    return out * 0.6
def buzz():
    t = T(0.28); s = np.sign(np.sin(2 * np.pi * 110 * t)) * 0.4 + np.sin(2 * np.pi * 220 * t) * 0.3; return lp(s, 1600) * np.exp(-t * 7)
def scribble(d=0.5):
    t = T(d); n = bp(rng.standard_normal(len(t)), 2500, 8000); am = 0.5 + 0.5 * np.abs(np.sin(2 * np.pi * (9 + 5 * np.sin(t * 5)) * t)); e = np.minimum(1, t * 40) * np.minimum(1, (d - t) * 30); return n * am * e * 0.7
def shutter():
    out = np.zeros(int(0.6 * SR))
    for k in range(9): s = tick(1500 + k * 180) * 0.8; j = int(k * 0.045 * SR); out[j:j + len(s)] += s
    out[:int(0.45 * SR)] += whoosh(0.45, True, 300, 6000)[:int(0.45 * SR)] * 0.5; return out
def ripple():
    t = T(1.0); f = 60 + 40 * np.exp(-t * 6); s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3) * 0.9
    s += bp(rng.standard_normal(len(t)), 300, 3000) * np.exp(-t * 5) * 0.3; return s
def typing(d=0.6, n=7):
    out = np.zeros(int(d * SR) + SR // 8)
    for k in range(n): s = tick(1300 + 400 * (k % 3)) * 0.8; j = int(k * d / n * SR); out[j:j + len(s)] += s
    return out
def charge(d=1.2):
    t = T(d); fr = 300 + 900 * t / d; s = np.sin(2 * np.pi * np.cumsum(fr) / SR) * 0.25 * (t / d)
    for k in range(int(d / 0.06)): j = int(k * 0.06 * SR); tk = tick(2200 + 30 * k) * 0.5; s[j:j + len(tk)] += tk[:max(0, len(s) - j)]
    return s
def identity():
    out = np.zeros(int(2.6 * SR)); im = impact()[:len(out)]; out[:len(im)] += im * 0.8
    out += np.pad(chime(), (0, len(out) - len(chime())))[:len(out)] * 0.8; return out
def sting():
    out = np.zeros(int(2.4 * SR)); im = impact(); out[:len(im)] += im; ch = chime(); j = int(0.05 * SR); out[j:j + len(ch)] += ch * 0.9
    w = whoosh(0.5, False); out[:len(w)] += w * 0.25; return out

def thread_pluck(f):  # the gold thread twangs: low plucked string + its octave, a soft finger noise
    y = ks(f, 1.8, 0.45, 0.9975, 1).copy(); o = ks(f * 2, 1.2, 0.6, 0.995, 2); y[:len(o)] += 0.35 * o
    fn = hp(rng.standard_normal(int(0.02 * SR)), 2500) * np.exp(-T(0.02) * 200) * 0.3; y[:len(fn)] += fn
    return y * 0.9

GEN = {'whoosh': lambda e: whoosh(e.get('d', 0.4), e.get('up', True)), 'whip': lambda e: whip(), 'impact': lambda e: impact(), 'slam': lambda e: slam(),
       'tick': lambda e: tick(e.get('f', 3000)), 'click': lambda e: click(), 'pop': lambda e: pop(e.get('f', 760)), 'bloop': lambda e: bloop(),
       'stretch': lambda e: stretch(), 'spin': lambda e: spin(), 'glitch': lambda e: glitch(), 'riser': lambda e: riser(e.get('d', 1.5)),
       'revswell': lambda e: revswell(e.get('d', 0.9)), 'chime': lambda e: chime(), 'buzz': lambda e: buzz(), 'scribble': lambda e: scribble(e.get('d', 0.5)),
       'shutter': lambda e: shutter(), 'ripple': lambda e: ripple(), 'type': lambda e: typing(e.get('d', 0.6), e.get('n', 7)), 'charge': lambda e: charge(e.get('d', 1.2)),
       'identity': lambda e: identity(), 'sting': lambda e: sting(), 'snap': lambda e: snap(),
       'pluck': lambda e: thread_pluck(e.get('f', 110))}
TYPE_GAIN = {'identity': 0.5, 'sting': 0.5, 'impact': 0.7, 'slam': 0.8, 'glitch': 0.6}
SL = np.zeros(N); SRr = np.zeros(N)
for e in ev:
    sig = GEN[e['type']](e); gain = e.get('g', 0.3) * TYPE_GAIN.get(e['type'], 1.0); pan = e.get('pan', 0.0); i = int(e['t'] * SR)
    if i >= N or i < 0: continue
    n = min(len(sig), N - i); gl, gr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    SL[i:i + n] += sig[:n] * gain * gl; SRr[i:i + n] += sig[:n] * gain * gr
ir2 = rng.standard_normal(int(0.7 * SR)) * np.exp(-T(0.7) * 8) * 0.008
SL = SL + fftconvolve(SL, ir2)[:N]; SRr = SRr + fftconvolve(SRr, ir2)[:N]
SL *= 1 - 0.3 * g; SRr *= 1 - 0.3 * g

if os.environ.get('STEMS'):
    for nm, l, r in [('music', ML, MR), ('sfx', SL, SRr), ('voice', voice, voice)]:
        sf.write(out_path.replace('.wav', f'_{nm}.wav'), np.stack([l, r], 1)[:int(TOTAL * SR)].astype(np.float32), SR, subtype='FLOAT')

full = np.stack([voice + ML + SL, voice + MR + SRr], axis=1)[:int(TOTAL * SR)]
bed = np.stack([ML + SL, MR + SRr], axis=1)[:int(TOTAL * SR)]
fade = int(0.6 * SR); ramp = np.linspace(1, 0, fade)[:, None]; full[-fade:] *= ramp; bed[-fade:] *= ramp
pk = np.abs(full).max(); k = 0.89 / max(pk, 1e-9); full *= k; bed *= k
if os.environ.get('NOVOICE'):
    sf.write(out_path, bed.astype(np.float32), SR, subtype='FLOAT')
    sf.write(out_path.replace('.wav', '_full.wav'), full.astype(np.float32), SR, subtype='FLOAT')
    print('wrote bed (no voice)', out_path, 'and reference', out_path.replace('.wav', '_full.wav'), round(len(bed) / SR, 2), 's; gain', round(float(k), 3))
else:
    sf.write(out_path, full.astype(np.float32), SR, subtype='FLOAT')
    print('wrote', out_path, round(len(full) / SR, 2), 's; peak was', round(float(pk), 3))
