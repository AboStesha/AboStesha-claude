"""Synth kit shared by the Axi Academy sound designs (instruments, reverb, loudness, limiter).
Derived from intro-outro/audio/sting.py.

  A  «Ink»    — a falling drop, a water «plip», nib-on-paper scribbles, a liquid rise, pen taps;
                a warm D-major-9 pad and a mallet motif that resolves on the glint.
  B  «Market» — a driving 16th bass and ticking candles, a riser into a whip-zoom, a heavy slam when the
                nib shuts, a price-arrow zip and a metal ting, lateral swishes and a bright final stab.
  C  «Light»  — room tone, electric crackles, a buzzing filament that flickers, a glass ring, a reverse
                swell into a warm bloom, airy beams with a rising bell arpeggio and a crystal glint.

Usage: python -I sting.py a|b|c out.wav     (48 kHz stereo float; mastered to -14 LUFS, true peak <= -1 dBTP)
"""
import sys
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve, resample_poly, lfilter
from scipy.ndimage import minimum_filter1d
import soundfile as sf

SR = 48000
DUR = 15.0
N = int(DUR * SR)


def set_duration(d):
    global DUR, N
    DUR = d; N = int(d * SR)


def T(d): return np.arange(int(d * SR)) / SR
def sos(kind, f, o=2): return butter(o, f, btype=kind, fs=SR, output='sos')
def lp(x, f, o=2): return sosfilt(sos('low', f, o), x)
def hp(x, f, o=2): return sosfilt(sos('high', f, o), x)
def bp(x, lo, hi, o=2): return sosfilt(sos('band', [lo, hi], o), x)
def midi(m): return 440.0 * 2 ** ((m - 69) / 12)


class Bus:
    """stereo bus with per-event placement"""
    def __init__(self): self.L = np.zeros(N + SR); self.R = np.zeros(N + SR)
    def add(self, sig, t0, g=1.0, pan=0.0):
        i = int(round(t0 * SR))
        if i >= len(self.L): return
        if i < 0: sig = sig[-i:]; i = 0
        n = min(len(sig), len(self.L) - i)
        gl, gr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        if sig.ndim == 2:
            self.L[i:i + n] += sig[:n, 0] * g; self.R[i:i + n] += sig[:n, 1] * g
        else:
            self.L[i:i + n] += sig[:n] * g * gl * 1.4142; self.R[i:i + n] += sig[:n] * g * gr * 1.4142
    def st(self): return np.stack([self.L, self.R], 1)


def env(n, a, d, s, r):
    a, d, r = max(1, int(a * SR)), max(1, int(d * SR)), max(1, int(r * SR)); sl = max(0, n - a - d - r)
    e = np.concatenate([np.linspace(0, 1, a), np.linspace(1, s, d), np.full(sl, s), np.linspace(s, 0, r)])
    return np.pad(e, (0, max(0, n - len(e))))[:n]


def reverb_ir(rt60, seed, pre=0.012, bright=7000, er=True):
    rng = np.random.default_rng(seed); d = rt60 * 1.1; t = T(d)
    out = []
    for ch in range(2):
        n = rng.standard_normal(len(t)) * np.exp(-t * 6.91 / rt60)
        n = lp(n, bright) * 0.6 + lp(n, bright * 0.35) * 0.4      # darker tail mix
        n *= np.minimum(1, t / 0.02)
        ir = np.zeros(int(pre * SR) + len(n)); ir[int(pre * SR):] = n
        if er:
            for k in range(7):
                j = int((0.007 + 0.011 * k + rng.random() * 0.006) * SR); ir[j] += (0.5 - 0.06 * k) * (1 if rng.random() > 0.5 else -1)
        out.append(ir / np.sqrt((ir ** 2).sum()))
    return np.stack(out, 1)


def reverb(x, ir, wet):
    L = fftconvolve(x[:, 0], ir[:, 0])[:len(x)]; R = fftconvolve(x[:, 1], ir[:, 1])[:len(x)]
    return x + wet * np.stack([L, R], 1)


# ---------------------------------------------------------------- instruments
def sine_glide(f0, f1, d, curve=1.0):
    t = T(d); u = (t / d) ** curve; f = f0 * (f1 / f0) ** u
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def saw(f, d, nh=40, detune=0.0, seed=0):
    t = T(d); rng = np.random.default_rng(seed); s = np.zeros_like(t); f = np.broadcast_to(f, t.shape)
    ph = 2 * np.pi * np.cumsum(f * 2 ** (detune / 1200)) / SR + rng.random() * 6.28
    fmax = np.max(f)
    for k in range(1, nh + 1):
        if k * fmax > 18000: break
        s += np.sin(k * ph) / k
    return s * 0.55


def pad(notes, d, cut=1800, att=0.8, rel=1.2, seed=1, width=1.0):
    """detuned saw pad, stereo; notes = midi list"""
    L = np.zeros(int(d * SR)); R = np.zeros(int(d * SR))
    for i, m in enumerate(notes):
        for j, dt in enumerate((-7, 0, 6)):
            s = saw(midi(m), d, 24, dt, seed + i * 7 + j)
            pan = (j - 1) * 0.6 * width
            L += s * np.cos((pan + 1) * np.pi / 4); R += s * np.sin((pan + 1) * np.pi / 4)
    e = env(len(L), att, 0.4, 0.85, rel)
    out = np.stack([lp(L, cut), lp(R, cut)], 1) * e[:, None] / (len(notes) * 2.2)
    return out


def mallet(f, d=1.6, bright=1.0):
    t = T(d)
    s = np.sin(2 * np.pi * f * t) + 0.42 * bright * np.sin(2 * np.pi * f * 3.99 * t) * np.exp(-t * 18) + 0.15 * bright * np.sin(2 * np.pi * f * 9.3 * t) * np.exp(-t * 40)
    return s * np.exp(-t * 2.8) * np.minimum(1, t * 900)


def bell(f, d=2.5, decay=2.2):
    t = T(d); s = np.zeros_like(t)
    for ratio, amp, dk in ((1, 1, 1), (2.76, 0.45, 1.8), (5.4, 0.25, 3), (8.93, 0.12, 4.5), (0.5, 0.18, 0.8)):
        s += amp * np.sin(2 * np.pi * f * ratio * t + np.random.default_rng(int(f)).random()) * np.exp(-t * decay * dk)
    return s * np.minimum(1, t * 1500) * 0.5


def noise(d, seed=0): return np.random.default_rng(seed).standard_normal(int(d * SR))


def sweep_noise(d, f0, f1, q=1.2, seed=0, curve=1.0):
    """band-passed noise whose centre glides f0 → f1 (per-sample state-variable filter)"""
    x = noise(d, seed); n = len(x); u = (np.arange(n) / n) ** curve; fc = f0 * (f1 / f0) ** u
    F = 2 * np.sin(np.pi * np.minimum(fc, SR / 6) / SR); Q = 1 / q
    low = band = 0.0; out = np.empty(n)
    for i in range(n):
        high = x[i] - low - Q * band; band += F[i] * high; low += F[i] * band; out[i] = band
    return out


def whoosh(d, f0=400, f1=5000, seed=0, shape=(0.6, 0.4)):
    s = sweep_noise(d, f0, f1, 1.4, seed); t = T(d); a, r = shape
    e = np.where(t < a * d, (t / (a * d)) ** 2, np.exp(-(t - a * d) / (r * d / 3)))
    return s * e * 0.9


def click(f=4000, d=0.012, seed=0):
    t = T(d); return bp(noise(d, seed), f * 0.5, min(f * 1.8, 20000)) * np.exp(-t * 600) * 1.6


def scribble(d, seed=0, rate=11, f=(2400, 7600)):
    """nib on paper: band noise gated by irregular stroke pulses with a resonant scratch"""
    rng = np.random.default_rng(seed); t = T(d); x = noise(d, seed + 1)
    s = bp(x, *f) * 0.7 + bp(x, 3000, 3600, 2) * 1.4
    ph = np.cumsum(rate * (1 + 0.5 * np.sin(2 * np.pi * 1.7 * t + rng.random() * 6))) / SR
    am = 0.35 + 0.65 * np.abs(np.sin(np.pi * ph)) ** 0.6
    grit = (rng.random(len(t)) < 0.002).astype(float); grit = lfilter([1], [1, -0.97], grit) * 0.4
    e = np.minimum(1, t / 0.015) * np.minimum(1, (d - t) / 0.03)
    return (s * am + bp(grit, 2000, 9000)) * e * 0.55


def plip():
    """water drop: rising resonant bubble + tick + soft low thump"""
    t = T(0.25)
    bub = np.sin(2 * np.pi * np.cumsum(650 + 950 * (1 - np.exp(-t * 90))) / SR) * np.exp(-t * 38)
    thump = np.sin(2 * np.pi * np.cumsum(95 * np.exp(-t * 8) + 55) / SR) * np.exp(-t * 16) * 0.8
    tk = np.zeros_like(t); c = click(5200, 0.01, 3); tk[:len(c)] = c * 0.5
    return bub * 0.7 + thump + tk


def sub_boom(f0=58, f1=34, d=1.4, drive=1.5):
    t = T(d); f = f1 + (f0 - f1) * np.exp(-t * 7)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.6) * np.minimum(1, t * 400)
    return np.tanh(s * drive) / np.tanh(drive)


def slam():
    t = T(1.6)
    body = sub_boom(62, 32, 1.6, 2.2)
    punch = np.tanh(bp(noise(1.6, 9), 90, 900) * np.exp(-t * 22) * 3) * 0.6
    crack = hp(noise(1.6, 10), 1800) * np.exp(-t * 30) * 0.9
    metal = np.zeros_like(t)
    for r, a in ((1, 1), (2.41, 0.6), (3.97, 0.4), (5.83, 0.25)):
        metal += a * np.sin(2 * np.pi * 410 * r * t) * np.exp(-t * (9 + 3 * r))
    return body + punch + crack * 0.8 + metal * 0.18


def ting(f=2900, d=1.2):
    t = T(d); s = np.zeros_like(t)
    for r, a, k in ((1, 1, 5), (2.32, 0.5, 9), (4.13, 0.3, 14), (6.8, 0.15, 22)):
        s += a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * k)
    return s * np.minimum(1, t * 3000) * 0.5


def zip_up(d=0.22, seed=4):
    t = T(d); s = sweep_noise(d, 700, 9000, 2.5, seed, 1.5); return s * np.sin(np.pi * t / d) ** 0.7 * 1.2


def blip(f, d=0.05):
    t = T(d); return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 70) * np.minimum(1, t * 2000)


def reverse_swell(d, seed=5, lo=2500):
    t = T(d); s = hp(noise(d, seed), lo) * (t / d) ** 3.2; return s


def crackle(d=0.06, seed=0):
    rng = np.random.default_rng(seed); x = np.zeros(int(d * SR)); k = rng.integers(3, 9)
    for _ in range(k): j = rng.integers(0, len(x) - 50); x[j:j + 40] += rng.standard_normal(40) * np.exp(-np.arange(40) / 8)
    return hp(x, 1500) * 1.2


def buzz(d, f=100, seed=0):
    t = T(d); s = saw(f, d, 60, 0, seed) + 0.3 * np.sin(2 * np.pi * 2 * f * t)
    return bp(s, 120, 4200) * 0.6


def kick(d=0.32):
    t = T(d); f = 48 + 120 * np.exp(-t * 35); s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
    s[:int(0.003 * SR)] += hp(noise(0.003, 2), 3000) * 0.5
    return np.tanh(s * 1.4)


def hat(d=0.04, seed=0):
    t = T(d); return hp(noise(d, seed), 8000) * np.exp(-t * 90)


def bass_pluck(f, d=0.12, cut=900):
    t = T(d); s = saw(f, d, 30); lo, hi = lp(s, cut * 0.5), lp(s, cut * 2.2); k = np.exp(-t * 30)
    return (lo + (hi - lo) * k) * env(len(t), 0.003, 0.05, 0.6, 0.03)


# ---------------------------------------------------------------- mastering
def kweight(x):
    b1, a1 = [1.53512485958697, -2.69169618940638, 1.19839281085285], [1.0, -1.69065929318241, 0.73248077421585]
    b2, a2 = [1.0, -2.0, 1.0], [1.0, -1.99004745483398, 0.99007225036621]
    return lfilter(b2, a2, lfilter(b1, a1, x, axis=0), axis=0)


def lufs(x):
    y = kweight(x); blk, hop = int(0.4 * SR), int(0.1 * SR)
    pw = np.array([(y[i:i + blk] ** 2).mean(0).sum() for i in range(0, len(y) - blk + 1, hop)])
    ld = -0.691 + 10 * np.log10(pw + 1e-12); g = pw[ld > -70]
    if len(g) == 0: return -99.0
    rel = -0.691 + 10 * np.log10(g.mean()) - 10; g2 = pw[(ld > -70) & (ld > rel)]
    return -0.691 + 10 * np.log10(g2.mean())


def true_peak(x): return 20 * np.log10(np.abs(resample_poly(x, 4, 1, axis=0)).max() + 1e-12)


def limiter(x, ceiling_db=-1.3, look=0.004, rel=0.08):
    c = 10 ** (ceiling_db / 20); pk = np.abs(x).max(1); need = np.minimum(1, c / np.maximum(pk, 1e-9))
    w = int(look * SR); g = minimum_filter1d(need, 2 * w + 1)
    a = np.exp(-1 / (rel * SR)); out = np.empty_like(g); cur = 1.0
    for i in range(len(g)):
        cur = g[i] if g[i] < cur else a * cur + (1 - a) * g[i]; out[i] = cur
    out = np.convolve(out, np.ones(w) / w, mode='same')  # centred min-filter + smoothing = lookahead without delay
    return x * out[:, None]


def master(x, target=-14.0, tp=-1.0):
    x = x[:N].copy(); ceil = tp - 0.5
    for _ in range(12):
        x *= 10 ** ((target - lufs(x)) / 20)
        x = limiter(x, ceil)
        over = true_peak(x) - tp
        if over > 0: ceil -= over + 0.1
        elif abs(lufs(x) - target) < 0.15: break
    over = true_peak(x) - (tp - 0.05)
    if over > 0: x *= 10 ** (-over / 20)  # never exceed the true-peak ceiling, even at a small loudness cost
    fade = int(0.25 * SR); x[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 1.5
    x[:int(0.003 * SR)] *= np.linspace(0, 1, int(0.003 * SR))[:, None]
    return x


