"""Sound design for the three 5-second Axi Academy logo stings (synthesised, frame-synced to the films).

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
DUR = 5.0
N = int(DUR * SR)


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


# ---------------------------------------------------------------- the three designs
def design_a():
    sfx, mus = Bus(), Bus()
    # falling drop: airy descending whistle-whoosh
    d = 0.55; t = T(d)
    sfx.add(sweep_noise(d, 6500, 1600, 3.0, 11, 0.8) * (t / d) ** 1.4 * 0.5, 0.0, 0.5)
    sfx.add(sine_glide(1900, 820, d, 1.3) * (t / d) ** 2 * 0.12, 0.0, 0.5)
    # impact: plip + ripple shimmer
    sfx.add(plip(), 0.55, 0.9)
    sfx.add(bell(midi(86), 2.4, 1.6), 0.552, 0.16, 0.0)
    sfx.add(sweep_noise(0.9, 3000, 900, 2.0, 12) * np.exp(-T(0.9) * 4) * 0.4, 0.57, 0.35)
    # nib outline: two pens (L/R) + the slot pen (centre)
    sfx.add(scribble(0.82, 21, 12), 0.58, 0.5, -0.45)
    sfx.add(scribble(0.82, 22, 13), 0.58, 0.5, 0.45)
    sfx.add(scribble(0.72, 23, 16, (3500, 9000)), 0.68, 0.3, 0.0)
    # ink fill: liquid rise (rising tone + bubbles + soft swell)
    d = 0.62; t = T(d)
    nz = noise(d, 31); sfx.add((lp(nz, 600) * (1 - t / d) + lp(nz, 3600) * (t / d)) * np.sin(np.pi * t / d) * 0.35, 1.16, 0.6)
    rng = np.random.default_rng(32)
    for k in range(9):
        tt = 1.16 + rng.random() * 0.6; f0 = 380 + rng.random() * 700
        sfx.add(sine_glide(f0, f0 * 2.2, 0.05, 1.0) * np.exp(-T(0.05) * 60) * 0.5, tt, 0.18, rng.uniform(-0.4, 0.4))
    # bars underlined: two swipes + soft clicks
    for i, t0 in enumerate((1.60, 1.69)):
        sfx.add(whoosh(0.3, 900, 6000, 40 + i, (0.35, 0.65)), t0, 0.32, (-0.2, 0.2)[i])
        sfx.add(click(3200, 0.012, 41 + i), t0 + 0.24, 0.25)
    # axi handwriting (left side)
    sfx.add(scribble(0.42, 51, 14), 1.86, 0.45, -0.55)
    sfx.add(scribble(0.22, 52, 18), 2.16, 0.4, -0.5)
    sfx.add(scribble(0.36, 53, 15), 2.12, 0.42, -0.45)
    sfx.add(scribble(0.24, 54, 19), 2.36, 0.4, -0.35)
    sfx.add(click(2600, 0.02, 55) + np.pad(plip()[:int(0.08 * SR)] * 0.3, (0, 0))[:int(0.02 * SR)], 2.62, 0.5, -0.3)
    # ACADEMY in pen order (right side), part by part
    parts = {'A': 3, 'C': 1, 'D': 2, 'E': 4, 'M': 4, 'Y': 3}
    for i, k in enumerate('ACADEMY'):
        t0 = 2.32 + i * 0.13; dp = 0.3 if k == 'C' else 0.16
        for j in range(parts[k]):
            sfx.add(scribble(dp * 0.9, 60 + i * 7 + j, 20, (3000, 9000)), t0 + j * dp * 0.62, 0.22, 0.25 + i * 0.07)
    # glint
    sfx.add(ting(4200, 1.6), 3.53, 0.22, 0.0)
    sfx.add(bell(midi(98), 2.0, 1.5), 3.53, 0.12, 0.15)
    # music: warm D-major-9 pad + mallet motif that resolves on the finished lockup
    mus.add(pad([50, 57, 62, 66, 69, 73, 76], 4.6, 1500, 1.4, 1.4, 3), 0.45, 0.55)
    mus.add(pad([38, 45], 4.4, 400, 1.8, 1.4, 4), 0.6, 0.5)
    for tt, m, g in ((0.55, 74, 0.5), (1.16, 69, 0.35), (1.60, 78, 0.35), (1.86, 76, 0.38), (2.32, 81, 0.32), (2.82, 78, 0.3), (3.30, 74, 0.45)):
        mus.add(mallet(midi(m), 1.8), tt, g, 0.1)
    for m in (62, 66, 69, 74, 78):  # the resolving chord under the glint
        mus.add(mallet(midi(m), 2.0, 0.6), 3.52, 0.2, (m - 70) / 20)
    mus.add(sub_boom(55, 37, 1.6, 1.2), 3.30, 0.4)
    return sfx, mus, dict(rt=2.2, wet_s=0.22, wet_m=0.35)


def jsrng(seed):
    s = [seed & 0xFFFFFFFF or 1]
    def r():
        s[0] = (s[0] * 1664525 + 1013904223) & 0xFFFFFFFF; return s[0] / 4294967296
    return r


def design_b():
    sfx, mus = Bus(), Bus()
    # replicate the chart's bull/bear sequence (film_b.js, rng(5))
    r = jsrng(5); ups = {24: True}
    for i in range(23, -1, -1):
        up = r() < 0.7; r(); r(); r(); r(); ups[i] = up
    # driving bed: 16th bass + hats + kick, filter opening with the chart (130 bpm)
    sx = 60 / 130 / 4
    for k in range(int(1.46 / sx)):
        tt = k * sx; u = tt / 1.46
        mus.add(bass_pluck(midi(26 if k % 8 not in (3, 6) else 33), sx * 0.9, 500 + 2600 * u * u), tt, 0.36 + 0.2 * u)
        if k % 2: sfx.add(hat(0.04, k), tt, 0.10 + 0.08 * u, 0.3 * np.sin(k))
        if k % 4 == 0: mus.add(kick(), tt, 0.55)
    # candle ticks
    for i in range(10, 25):
        tt = 0.04 + (i - 10) * 0.06; f = 1700 + (i - 10) * 85 if ups[i] else 1150 + (i - 10) * 40
        bl = blip(f, 0.05); ck = click(5000, 0.008, i) * 0.4; bl[:len(ck)] += ck
        sfx.add(bl, tt, 0.26, -0.5 + (i - 10) / 14)
    # riser → whip zoom → halves rush in
    d = 1.3; t = T(d)
    sfx.add(sweep_noise(d, 300, 7000, 1.6, 71, 2.0) * (t / d) ** 2.4 * 0.7, 0.05, 0.42)
    sfx.add(saw(110 * 2 ** (1.6 * (t / d) ** 2), d, 20) * (t / d) ** 2.2 * 0.12, 0.05, 0.4)
    sfx.add(whoosh(0.4, 500, 8000, 72, (0.75, 0.25)), 0.92, 0.42)
    sfx.add(whoosh(0.32, 300, 3000, 73, (0.85, 0.15)), 1.20, 0.36, -0.6)
    sfx.add(whoosh(0.32, 320, 3200, 74, (0.85, 0.15)), 1.20, 0.36, 0.6)
    sfx.add(reverse_swell(0.2, 75, 1500), 1.30, 0.6)
    # THE SHUT
    sfx.add(slam(), 1.50, 1.0)
    sfx.add(click(6000, 0.015, 76) * 2, 1.50, 0.5)
    # tip launches and lands; bars; words
    sfx.add(zip_up(0.22, 77), 1.56, 0.45)
    sfx.add(ting(3100, 1.3), 1.75, 0.38)
    sfx.add(kick(0.2), 1.75, 0.3)
    for i, (t0, pan) in enumerate(((1.84, -0.7), (1.92, 0.7))):
        sfx.add(whoosh(0.3, 400, 5000, 80 + i, (0.7, 0.3)), t0, 0.42, pan)
        sfx.add(click(2500, 0.02, 82 + i) * 1.5, t0 + 0.27, 0.4, pan * 0.3)
    sfx.add(whoosh(0.55, 600, 9000, 84, (0.4, 0.6)), 2.00, 0.38, -0.6)
    sfx.add(whoosh(0.6, 700, 10000, 85, (0.4, 0.6)), 2.04, 0.38, 0.6)
    for k in range(7): sfx.add(blip(2600 + 140 * k, 0.03), 2.06 + 0.035 * k, 0.12, 0.35 + 0.08 * k)
    # final stab + bass + pad tail
    for m in (62, 66, 69, 73, 76): mus.add(saw(midi(m), 1.2, 30, (m % 3 - 1) * 6, m) * env(int(1.2 * SR), 0.004, 0.25, 0.25, 0.7), 2.36, 0.12, (m - 69) / 15)
    mus.add(sub_boom(55, 40, 1.8, 1.4), 2.36, 0.55)
    mus.add(pad([50, 57, 62, 66, 69, 76], 2.7, 2200, 0.15, 1.3, 9), 2.36, 0.45)
    mus.add(pad([50, 57, 62, 66, 69], 1.0, 900, 0.01, 0.4, 10), 1.50, 0.35)
    # a breath of near-silence right before the slam so it lands harder
    tt = np.arange(len(sfx.L)) / SR; duck = 1 - 0.75 * np.clip((tt - 1.40) / 0.05, 0, 1) * (tt < 1.50)
    for b in (sfx, mus): b.L *= duck; b.R *= duck
    return sfx, mus, dict(rt=1.5, wet_s=0.16, wet_m=0.22)


def design_c():
    sfx, mus = Bus(), Bus()
    # room tone
    sfx.add(lp(noise(5.0, 1), 300) * 0.06, 0.0, 1.0)
    # spark crackles synced to the flicker (on-edges)
    for k, tt in enumerate((0.12, 0.23, 0.34, 0.42)):
        sfx.add(crackle(0.07, 10 + k), tt, 0.5, (k - 1.5) * 0.15)
        sfx.add(bp(noise(0.05, 20 + k), 1500, 7000) * np.exp(-T(0.05) * 60), tt, 0.25)
    sfx.add(ting(3600, 0.9), 0.42, 0.14)
    # filament: draw (rising buzz) then flicker (gated buzz + crackles)
    d = 0.22; sfx.add(buzz(d, 95, 3) * np.minimum(1, T(d) / d * 2), 0.52, 0.22)
    gates = [(0.74, 0.78, 0.9), (0.78, 0.83, 0.08), (0.83, 0.90, 0.75), (0.90, 0.94, 0.05), (0.94, 0.98, 1.0), (0.98, 1.02, 0.3), (1.02, 1.10, 0.95), (1.10, 1.13, 0.45), (1.13, 1.95, 1.0)]
    for a, b, v in gates:
        dd = b - a; g = buzz(dd, 100, int(a * 100)) * v
        g *= np.minimum(1, np.minimum(T(dd), dd - T(dd)) / 0.004)
        if b > 1.5: g *= np.linspace(1, 0, len(g)) ** 1.5
        sfx.add(g, a, 0.2)
        if v > 0.5: sfx.add(crackle(0.05, int(a * 1000)), a, 0.28, 0.1)
    # glass ring
    t = T(1.0); sfx.add((np.sin(2 * np.pi * 1318 * t) + 0.5 * np.sin(2 * np.pi * 1975 * t)) * np.sin(np.pi * t / 1.0) * 0.12, 0.9, 0.5)
    # reverse swell → bloom
    sfx.add(reverse_swell(0.45, 30, 2000), 1.18, 0.55)
    sfx.add(sub_boom(48, 36, 2.2, 1.1), 1.60, 0.65)
    sfx.add(whoosh(1.0, 200, 1500, 31, (0.15, 0.85)), 1.58, 0.35)
    for k, m in enumerate((86, 90, 93, 98)): sfx.add(bell(midi(m), 2.0, 1.8), 1.62 + 0.03 * k, 0.08, (k - 1.5) * 0.3)
    # bars: two soft glints
    sfx.add(ting(5200, 0.7), 1.97, 0.12, -0.2); sfx.add(ting(5600, 0.7), 2.05, 0.1, 0.2)
    # beams: airy sweeps L and R + rising bell arpeggio
    sfx.add(sweep_noise(0.8, 1200, 9000, 2.0, 41, 1.2) * np.sin(np.pi * T(0.8) / 0.8) * 0.6, 2.2, 0.32, -0.6)
    sfx.add(sweep_noise(0.85, 1300, 9500, 2.0, 42, 1.2) * np.sin(np.pi * T(0.85) / 0.85) * 0.6, 2.26, 0.32, 0.6)
    for k, m in enumerate((74, 78, 81, 86, 90, 93)):
        sfx.add(bell(midi(m), 1.6, 2.4), 2.24 + 0.1 * k, 0.07, -0.6 + 0.24 * k)
    # the glint
    sfx.add(ting(4600, 2.0), 3.38, 0.3)
    sfx.add(bell(midi(98), 2.4, 1.2), 3.38, 0.13)
    # music: pad swells with the light, settles under the lockup
    mus.add(pad([50, 57, 62, 66, 69, 73], 4.1, 1300, 1.0, 1.2, 5), 0.9, 0.6)
    mus.add(pad([38, 45, 50], 3.8, 500, 1.2, 1.2, 6), 1.2, 0.55)
    for m in (62, 69, 74, 78): mus.add(mallet(midi(m), 2.2, 0.5), 3.38, 0.16, (m - 70) / 20)
    return sfx, mus, dict(rt=2.6, wet_s=0.26, wet_m=0.38)


if __name__ == '__main__':
    which, out = sys.argv[1], sys.argv[2]
    sfx, mus, fx = {'a': design_a, 'b': design_b, 'c': design_c}[which]()
    ir = reverb_ir(fx['rt'], 7)
    S = reverb(sfx.st(), ir, fx['wet_s']); M = reverb(mus.st(), reverb_ir(fx['rt'] * 1.2, 8), fx['wet_m'])
    mix = S + M * 0.8
    mix = master(mix)
    sf.write(out, mix.astype(np.float32), SR, subtype='FLOAT')
    print(f'{which}: {out}  {len(mix) / SR:.2f}s  {lufs(mix):.2f} LUFS  TP {true_peak(mix):.2f} dBTP')
