#!/usr/bin/env python3
# Axi Select · SFX PALETTE generator (videos 1 + 2). Every sound is synthesised here (no samples, no AI): filtered-noise
# sweeps with doppler / pan, modal (struck-object) resonators, FM / additive tones, layered transients, one shared
# synthetic dark "void" reverb, one family EQ, and loudness normalisation (max 100 ms K-weighted loudness).
# Tuned elements sit in D minor (the score's key). Deterministic: python3 -I gen_palette.py [out_dir]
import os, sys, json
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsp import *

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "palette")
os.makedirs(OUT, exist_ok=True)
TARGET_LKFS = -18.0   # max 100 ms K-weighted loudness of every file (cue gains are relative to this)
PEAK_MAX = -1.0       # dBFS sample-peak ceiling per file

# D minor pitches
D1, D2, A2, D3, F3, A3, D4, F4, A4, C5, D5, E5, F5, G5, A5, C6, D6, E6, F6, A6, D7 = (
    36.71, 73.42, 110.0, 146.83, 174.61, 220.0, 293.66, 349.23, 440.0, 523.25, 587.33, 659.26, 698.46, 783.99, 880.0,
    1046.5, 1174.66, 1318.51, 1396.91, 1760.0, 2349.32)


def R(seed):
    return np.random.default_rng(seed)


def family(x, kind="std"):
    """the family EQ: everything shares one tone (HPF, a soft 3 kHz pocket for the voice, a dark top)"""
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    x = hp(x, 24 if kind == "low" else 32)
    x = filt(x, bq_peak(3000, -2.0, 0.9))
    x = filt(x, bq_hshelf(10500, -3.0))
    x = lp(x, 17000)
    return x


# ================================================================ whooshes
def whoosh(d, peak, f0, f1, f2, bw=0.75, pan=(0.45, -0.45), width=0.35, air=0.25, body=0.0, seed=1, rel=3.2,
           att=1.8, tilt=-1.5, wet=0.18):
    """a passing filtered-noise whoosh: centre freq f0 -> f1 (at the peak) -> f2 (doppler), equal-power pan
    pan[0] -> pan[1] following the motion, a decorrelated side for width, an air band and an optional low body."""
    rng = R(seed); n = int(d * SR); t = np.arange(n) / SR; tp = peak
    up = np.clip(t / tp, 0, 1); dn = np.clip((t - tp) / (d - tp), 0, 1)
    e = np.where(t < tp, up ** att, np.exp(-dn * rel) * (1 - dn ** 4))
    def fc(tt):
        a = np.clip(tt / tp, 0, 1); b = np.clip((tt - tp) / (d - tp), 0, 1)
        return np.where(tt < tp, f0 * (f1 / f0) ** (a ** 0.8), f1 * (f2 / f1) ** (b ** 0.6))
    m = tv_band(rng.standard_normal(n), fc, bw, tilt=tilt)
    s = tv_band(rng.standard_normal(n), fc, bw * 1.1, tilt=tilt)
    a1 = tv_band(rng.standard_normal(n), lambda tt: 4.2 * fc(tt) + 3500, 0.6, tilt=-3)
    core = m / (np.std(m) + 1e-9)
    side = s / (np.std(s) + 1e-9)
    airm = a1 / (np.std(a1) + 1e-9)
    # pan follows the motion through the peak (fast near the peak, like a passing object)
    pp = pan[0] + (pan[1] - pan[0]) * (0.5 + 0.5 * np.tanh((t - tp) / (0.35 * d)))
    st = pan_eq(core * e, pp)
    st[:, 0] += width * side * e; st[:, 1] -= width * side * e
    ea = np.where(t < tp * 0.85, np.clip(t / (tp * 0.85), 0, 1) ** 2.2, np.exp(-np.clip((t - tp * 0.85) / (d - tp), 0, 1) * rel * 1.4))
    st += air * pan_eq(airm * ea, pp * 1.1)
    if body:
        b = lp(rng.standard_normal(n), 260) ; b = b / (np.std(b) + 1e-9)
        eb = np.where(t < tp, up ** 1.5, np.exp(-dn * rel * 1.3))
        st += body * pan_eq(b * eb, pp * 0.5)
    st = fade(st, 0.003, 0.03)
    return reverb(st, wet)


# ================================================================ transients / UI
def click_ui(seed=3, second=0.045, pitch=1.0):
    """a premium mouse / button click: press + release, each a short plastic / metal modal burst over a low body"""
    rng = R(seed); n = int(0.25 * SR)
    def one(scale, p):
        y = modal(int(0.06 * SR), [(2350 * p, 1.0, 0.0045), (4100 * p, 0.6, 0.003), (6300 * p, 0.35, 0.002),
                                   (1180 * p, 0.45, 0.007)], rng, strike=0.6)
        b, _ = sine_glide(int(0.06 * SR), 420 * p, 210 * p, tau=0.008); b *= np.exp(-np.arange(len(b)) / SR / 0.012)
        return scale * (y + 0.55 * b)
    x = np.zeros(n)
    a = one(1.0, pitch); x[: len(a)] += a
    if second:
        b = one(0.45, pitch * 1.12); k = int(second * SR); x[k: k + len(b)] += b[: n - k]
    st = pan_eq(hp(x, 300), 0.0)   # (review: no one-sided inter-channel delay: it pulled the image left and combed in mono)
    return reverb(st, 0.07)


def tick(modes, seed=4, low=0.35, wet=0.10, dur=0.12):
    """a crisp tick for pips / checks: a short struck metal tine over a tiny body"""
    rng = R(seed); n = int(dur * SR)
    y = modal(n, modes, rng, strike=0.35)
    b, _ = sine_glide(n, 900, 520, tau=0.006); b *= np.exp(-np.arange(n) / SR / 0.006)
    y = hp(y + low * b, 400)
    st = pan_eq(y, 0.0)   # (review: centred point source; the renderer pans it to the element)
    return reverb(fade(st, 0, 0.01), wet)


def pop(f, seed=5, wet=0.14):
    """a soft tuned pluck / tap for small elements popping in (felt-mallet sine with a quick pitch blip, D minor)"""
    rng = R(seed); n = int(0.35 * SR); t = np.arange(n) / SR
    s, _ = sine_glide(n, f * 1.5, f, tau=0.006)
    h, _ = sine_glide(n, f * 3.0, f * 2.0, tau=0.005)
    y = (s * np.exp(-t / 0.045) + 0.22 * h * np.exp(-t / 0.02))
    y += 0.25 * lp(rng.standard_normal(n), 5000) * np.exp(-t / 0.0025)
    y = lp(y, 7000)
    y = fade(y, 0.0008, 0.05)
    st = pan_eq(y, 0.0)   # (review: centred point source; the renderer pans it to the element)
    return reverb(st, wet)


def counter_roll(d, n_ticks, seed=6, wet=0.10):
    """a number counter landing at d s: soft ticks spaced like a quartOut count (dense first, slowing into the landing:
    the last tick IS the landing time d), pitch rising, over a faint whirr that follows the count speed"""
    rng = R(seed); n = int((d + 0.15) * SR); t = np.arange(n) / SR
    x = np.zeros(n)
    v = np.arange(n_ticks) / (n_ticks - 1) * 0.97      # value fraction of each tick (the count is quartOut)
    g = 1 - (1 - v) ** 0.25
    tk = d * g / g[-1]
    for i, ti in enumerate(tk):
        p = 1.0 + 0.18 * i / max(1, n_ticks - 1)
        g = 0.55 + 0.25 * (i / max(1, n_ticks - 1))
        y = modal(int(0.03 * SR), [(2700 * p, 1.0, 0.0035), (4300 * p, 0.45, 0.0022), (1550 * p, 0.35, 0.005)], rng,
                  strike=0.3)
        j = int(ti * SR); x[j: j + len(y)] += g * y[: n - j]
    vel = np.zeros(n)
    u = np.clip(t / d, 0, 1); vel = (1 - u) ** 3 * (t < d)  # quartOut velocity
    w = bp(rng.standard_normal(n), 1400, 3600) * vel * 0.12
    y = hp(x + w, 500)
    st = pan_eq(y, 0.0)   # (review: centred point source)
    return reverb(fade(st, 0.001, 0.03), wet)


def ping(f, ratios, taus, amps, seed=7, wet=0.30, dur=2.2):
    """a landing ping: struck glass / metal (modal), tuned in D minor, with a soft strike"""
    rng = R(seed); n = int(dur * SR)
    modes = [(f * r, a, tau) for r, a, tau in zip(ratios, amps, taus)]
    y = modal(n, modes, rng, strike=0.15)
    y = hp(y, 300)
    m = pan_eq(y, 0.0)
    s = modal(n, [(f * r * 1.0015, a * 0.3, tau) for r, a, tau in zip(ratios, amps, taus)], rng)
    m[:, 0] += s; m[:, 1] -= s
    return reverb(fade(m, 0.0005, 0.7), wet)


def glitch_swipe(seed=8, d=0.36, n_gr=13, pan=(-0.6, 0.6), wet=0.12):
    """a data swipe: a run of short, sample-held noise grains through comb resonances, sweeping across the stereo field"""
    rng = R(seed); n = int((d + 0.1) * SR); x = np.zeros((n, 2))
    times = np.sort(rng.uniform(0, d * 0.92, n_gr)); times[0] = 0
    for i, ti in enumerate(times):
        L = int(rng.uniform(0.008, 0.026) * SR)
        g = rng.standard_normal(L)
        hold = int(rng.choice([3, 4, 6, 8]))            # sample-and-hold = soft decimation (not 8-bit)
        g = np.repeat(g[::hold], hold)[:L]
        f0 = rng.uniform(700, 2600)
        g = bp(g, f0 * 0.7, f0 * 1.6)
        dl = int(SR / rng.uniform(300, 900))
        g2 = g.copy(); g2[dl:] += 0.6 * g[:-dl]           # comb
        e = np.hanning(L) ** 0.7
        p = pan[0] + (pan[1] - pan[0]) * (ti / d) + rng.uniform(-0.15, 0.15)
        amp = (0.6 + 0.4 * np.sin(np.pi * ti / d)) * rng.uniform(0.6, 1.0)
        j = int(ti * SR); seg = pan_eq(g2 * e * amp, p)
        x[j: j + L] += seg[: n - j]
    # a soft swish under the grains
    t = np.arange(n) / SR
    sw = tv_band(rng.standard_normal(n), lambda tt: 1200 + 2500 * np.clip(tt / d, 0, 1), 0.5)
    sw = sw / (np.std(sw) + 1e-9) * 0.18 * np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5
    x += pan_eq(sw, np.linspace(pan[0], pan[1], n))
    x = lp(x, 9000)
    return reverb(fade(x, 0.001, 0.03), wet)


def scan_draw(d, f0, f1, seed=9, wet=0.2, pan=(-0.3, 0.3)):
    """a line drawing on: a narrow resonant noise band gliding upward with a soft sine one octave below and a faint
    electric grain; follows an e4 draw (fast start, gentle end)"""
    rng = R(seed); n = int((d + 0.08) * SR); t = np.arange(n) / SR
    u = np.clip(t / d, 0, 1)
    fc = lambda tt: f0 * (f1 / f0) ** (1 - (1 - np.clip(tt / d, 0, 1)) ** 2.2)
    e = np.clip(t / 0.03, 0, 1) * (1 - u) ** 0.6 * (0.6 + 0.4 * np.sin(np.pi * u) ) * (t < d)
    nb = tv_band(rng.standard_normal(n), fc, 0.18)
    nb = nb / (np.std(nb) + 1e-9)
    fr = f0 * (f1 / f0) ** (1 - (1 - u) ** 2.2) / 2
    sn = np.sin(2 * np.pi * np.cumsum(fr) / SR)
    grain = 1 + 0.22 * np.tanh(2.5 * np.sin(2 * np.pi * 95 * t)) * lp(rng.uniform(0.5, 1, n), 400)  # smooth (no edges)
    y = (0.8 * nb * grain + 0.35 * sn) * e
    st = pan_eq(y, np.linspace(pan[0], pan[1], n))
    s2 = tv_band(rng.standard_normal(n), fc, 0.25); s2 = s2 / (np.std(s2) + 1e-9) * e * 0.3
    st[:, 0] += s2; st[:, 1] -= s2
    return reverb(fade(st, 0.002, 0.04), wet)


def shimmer(d=1.6, seed=10, wet=0.38, notes=(A5, D6, F6, A6, D7, E6, C6), sweep=(3500, 12000)):
    """a metallic sheen for logo builds: staggered high partials (D minor) with slow blooms, a sparkle of grains and an
    upward airy sweep"""
    rng = R(seed); n = int((d + 0.2) * SR); t = np.arange(n) / SR
    y = np.zeros((n, 2))
    for i, f in enumerate(notes):
        t0 = 0.05 + i * (d * 0.5 / len(notes)) + rng.uniform(-0.02, 0.02)
        k = int(t0 * SR); m = n - k; tt = np.arange(m) / SR
        env = np.clip(tt / 0.06, 0, 1) ** 2 * np.exp(-tt / (0.55 + 0.1 * rng.uniform()))
        for r, a in [(1.0, 1.0), (2.76, 0.18), (5.4, 0.06)]:
            ph = rng.uniform(0, 2 * np.pi)
            vib = 1 + 0.0015 * np.sin(2 * np.pi * 5.5 * tt + ph)
            s = a * env * np.sin(2 * np.pi * f * r * np.cumsum(vib) / SR + ph)
            p = rng.uniform(-0.6, 0.6)
            y[k:] += pan_eq(s * 0.25, p)
    # sparkle grains
    for g in range(26):
        t0 = rng.uniform(0.02, d * 0.85); L = int(rng.uniform(0.01, 0.03) * SR); k = int(t0 * SR)
        if k + L >= n: continue
        f = rng.choice([A6, D7, F6 * 2, A6 * 2]) * rng.uniform(0.995, 1.005)
        s = np.sin(2 * np.pi * f * np.arange(L) / SR) * np.hanning(L) * rng.uniform(0.05, 0.12)
        y[k:k + L] += pan_eq(s, rng.uniform(-0.8, 0.8))
    u = np.clip(t / d, 0, 1)
    sw = tv_band(rng.standard_normal(n), lambda tt: sweep[0] * (sweep[1] / sweep[0]) ** np.clip(tt / d, 0, 1), 0.45)
    sw = sw / (np.std(sw) + 1e-9) * 0.16 * np.sin(np.pi * u) ** 1.2
    sw2 = tv_band(rng.standard_normal(n), lambda tt: sweep[0] * (sweep[1] / sweep[0]) ** np.clip(tt / d, 0, 1), 0.5)
    sw2 = sw2 / (np.std(sw2) + 1e-9) * 0.16 * np.sin(np.pi * u) ** 1.2
    y[:, 0] += sw + 0.5 * sw2; y[:, 1] += sw - 0.5 * sw2
    return reverb(fade(y, 0.003, 0.1), wet)


# ================================================================ impacts / low end
def thud(f0=96, f1=52, tau=0.13, seed=11, click=0.35, wet=0.16, dur=0.9):
    rng = R(seed); n = int(dur * SR); t = np.arange(n) / SR
    s, _ = sine_glide(n, f0, f1, tau=0.035)
    y = s * np.exp(-t / tau) * np.clip(t / 0.002, 0, 1)
    body = lp(rng.standard_normal(n), 520) * np.exp(-t / 0.035)
    y += 0.9 * body / (np.std(body[: int(0.03 * SR)]) + 1e-9) * 0.25
    y += click * lp(hp(rng.standard_normal(n), 900), 3500) * np.exp(-t / 0.004) * 0.6
    y = sat(y / (np.max(np.abs(y)) + 1e-9), 1.4)
    st = pan_eq(y, 0.0)
    return reverb(fade(st, 0.0005, 0.08), wet)


def impact_deep(seed=12, wet=0.34):
    rng = R(seed); n = int(2.6 * SR); t = np.arange(n) / SR
    sub, _ = sine_glide(n, 64, 37, tau=0.14)
    y = sub * np.exp(-t / 0.55) * np.clip(t / 0.003, 0, 1)
    body = lp(rng.standard_normal(n), 700) * np.exp(-t / 0.09); body /= np.std(body[: int(0.05 * SR)]) + 1e-9
    y = y + 0.35 * body
    y = sat(y / np.max(np.abs(y)), 1.8)
    metal = modal(n, [(173, 0.5, 0.5), (251, 0.4, 0.42), (389, 0.35, 0.3), (617, 0.25, 0.22), (911, 0.18, 0.16),
                      (1373, 0.12, 0.1), (2210, 0.06, 0.05)], rng)
    crack = hp(rng.standard_normal(n), 2200) * np.exp(-t / 0.005)
    m = y + 0.18 * metal + 0.12 * crack
    st = pan_eq(m, 0.0)
    side = modal(n, [(176, 0.3, 0.5), (255, 0.25, 0.4), (395, 0.2, 0.3), (627, 0.15, 0.2)], rng) * 0.15
    st[:, 0] += side; st[:, 1] -= side
    return reverb(fade(st, 0.0005, 0.3), wet)


def boom(seed=13, wet=0.5, f0=58, f1=29, tau_a=0.75, dur=3.6, gong=0.0, gtau=1.0):
    rng = R(seed); n = int(dur * SR); t = np.arange(n) / SR
    sub, _ = sine_glide(n, f0, f1, tau=0.28)
    y = sub * np.exp(-t / tau_a) * np.clip(t / 0.004, 0, 1)
    thump, _ = sine_glide(n, 160, 70, tau=0.02); y += 0.5 * thump * np.exp(-t / 0.06)
    body = lp(rng.standard_normal(n), 1100) * np.exp(-t / 0.18); body /= np.std(body[: int(0.1 * SR)]) + 1e-9
    y = sat((y + 0.3 * body) / 1.4, 2.2)
    st = pan_eq(y, 0.0)
    sb = lp(rng.standard_normal(n), 900) * np.exp(-t / 0.22); sb /= np.std(sb[: int(0.1 * SR)]) + 1e-9
    st[:, 0] += 0.12 * sb; st[:, 1] -= 0.12 * sb
    if gong:
        g = modal(n, [(D2, 0.6, 2.6 * gtau), (D2 * 1.51, 0.4, 2.0 * gtau), (D2 * 2.02, 0.45, 1.8 * gtau),
                      (D2 * 2.73, 0.3, 1.3 * gtau), (D2 * 3.47, 0.22, 1.0 * gtau), (D2 * 4.2, 0.15, 0.8 * gtau),
                      (D2 * 5.43, 0.1, 0.6 * gtau), (D2 * 6.9, 0.07, 0.45 * gtau)], rng)
        g = lp(g, 3200) * np.clip(t / 0.03, 0, 1)
        gs = modal(n, [(D2 * 1.003, 0.5, 2.4 * gtau), (D2 * 2.03, 0.35, 1.7 * gtau), (D2 * 3.5, 0.2, 1.0 * gtau)], rng)
        st[:, 0] += gong * (g + 0.4 * gs); st[:, 1] += gong * (g - 0.4 * gs)
    return reverb(fade(st, 0.0005, 0.9), wet)


def riser(d, seed=14, wet=0.25, f0=280, f1=5200):
    """a riser that peaks at its end (sync 'peak' = the landing)"""
    rng = R(seed); n = int(d * SR); t = np.arange(n) / SR; u = t / d
    fc = lambda tt: f0 * (f1 / f0) ** (np.clip(tt / d, 0, 1) ** 1.3)
    e = u ** 2.2
    a = tv_band(rng.standard_normal(n), fc, lambda tt: 0.9 - 0.5 * np.clip(tt / d, 0, 1)); a /= np.std(a) + 1e-9
    b = tv_band(rng.standard_normal(n), fc, lambda tt: 0.9 - 0.5 * np.clip(tt / d, 0, 1)); b /= np.std(b) + 1e-9
    ton = np.zeros(n)
    for f, g in [(D3, 0.5), (A3, 0.35), (D4, 0.25)]:
        s, _ = sine_glide(n, f, f * 2, tau=None); ton += g * s
    ton *= u ** 3 * 0.35
    m = a * e + ton
    st = np.stack([m + 0.5 * b * e, m - 0.5 * b * e], 1)
    st = fade(st, 0.01, 0.012)
    return reverb(st, wet)


def sub_drop(seed=15, dur=2.6):
    rng = R(seed); n = int(dur * SR); t = np.arange(n) / SR
    s, _ = sine_glide(n, 72, 28, tau=0.45)
    y = s * np.clip(t / 0.012, 0, 1) * np.exp(-t / 0.45)
    y = sat(y, 1.6)
    st = pan_eq(y, 0.0)
    return reverb(fade(st, 0.001, 0.6), 0.12)


# ================================================================ mechanical / specials
def lock_snap(seed=16, wet=0.14):
    rng = R(seed); n = int(0.6 * SR); t = np.arange(n) / SR
    a = modal(n, [(2950, 1.0, 0.012), (4700, 0.6, 0.008), (6900, 0.3, 0.005), (1830, 0.25, 0.22)], rng, strike=0.5)
    b = modal(n, [(1450, 1.0, 0.03), (2300, 0.7, 0.022), (3700, 0.4, 0.015), (980, 0.4, 0.04)], rng, strike=0.8)
    kn, _ = sine_glide(n, 260, 160, tau=0.01); kn *= np.exp(-t / 0.022)
    k = int(0.034 * SR)
    y = 0.55 * a
    y[k:] += (b + 0.8 * kn)[: n - k]
    y = hp(y, 150)
    st = pan_eq(y, 0.0)   # (review: centred point source)
    return reverb(fade(st, 0, 0.05), wet)


def shutter(seed=17, wet=0.16):
    rng = R(seed); d = 0.34; n = int(0.7 * SR); t = np.arange(n) / SR
    tp = 0.05
    e = np.where(t < tp, (t / tp) ** 1.5, np.exp(-(t - tp) / 0.07)) * (t < d)
    nb = tv_band(rng.standard_normal(n), lambda tt: 3200 * (1100 / 3200) ** np.clip(tt / 0.2, 0, 1), 0.55)
    nb /= np.std(nb) + 1e-9
    grain = 1 + 0.5 * (0.5 + 0.5 * np.tanh(4 * (np.sin(2 * np.pi * 140 * t) - 0.6)))  # soft-edged mechanical grain
    y = pan_eq(nb * e * grain * 0.6, np.linspace(0.5, -0.6, n))
    k = int(0.17 * SR)
    cl = modal(n - k, [(820, 1.0, 0.025), (1310, 0.7, 0.018), (2150, 0.5, 0.012), (3400, 0.3, 0.007)], rng, strike=0.6)
    th, _ = sine_glide(n - k, 150, 85, tau=0.015); th *= np.exp(-np.arange(n - k) / SR / 0.03)
    c = np.concatenate([np.zeros(k), 0.5 * cl + 0.6 * th])
    y += pan_eq(c, -0.5)
    return reverb(fade(y, 0.002, 0.05), wet)


def stamp(seed=18, wet=0.16):
    rng = R(seed); n = int(0.6 * SR); t = np.arange(n) / SR
    th, _ = sine_glide(n, 130, 68, tau=0.025); th *= np.exp(-t / 0.07) * np.clip(t / 0.0015, 0, 1)
    sl = bp(rng.standard_normal(n), 350, 2600) * np.exp(-t / 0.012)
    sl /= np.std(sl[: int(0.01 * SR)]) + 1e-9
    rg = modal(n, [(620, 0.2, 0.05), (1180, 0.12, 0.03)], rng)
    y = sat(th + 0.35 * sl + rg, 1.3)
    st = pan_eq(y, 0.0)
    return reverb(fade(st, 0.0005, 0.06), wet)


def sonar(base, ping_f=None, seed=19, wet=0.5, dur=3.0, ripple_hz=7.0, band=(380, 260)):
    """a floor ripple / stage pulse: a soft low bloom (D minor chord tones, fundamental under the voice) with a rippling
    band, widening"""
    rng = R(seed); n = int(dur * SR); t = np.arange(n) / SR
    y = np.zeros(n)
    for f, a, tau in [(base, 1.0, 0.5), (base * 1.5, 0.45, 0.4), (base * 2, 0.25, 0.3), (base * 3, 0.08, 0.2)]:
        y += a * np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) * np.exp(-t / tau)
    y *= np.clip(t / 0.03, 0, 1) ** 1.5
    rip = tv_band(rng.standard_normal(n), lambda tt: band[0] + band[1] * np.exp(-tt / 0.5), 0.45)
    rip = rip / (np.std(rip) + 1e-9) * np.exp(-t / 0.42) * (0.5 + 0.5 * np.cos(2 * np.pi * ripple_hz * t * (1 - 0.3 * t)))
    rip *= np.clip(t / 0.05, 0, 1)
    m = y + 0.3 * rip
    if ping_f:
        p = modal(n, [(ping_f, 1.0, 0.35), (ping_f * 2.0, 0.25, 0.18), (ping_f * 2.76, 0.12, 0.1)], rng, strike=0.05)
        m += 0.45 * p
    m = lp(m, 4000)
    w = np.clip(t / 0.6, 0, 1)                         # the ring widens as it travels
    s = tv_band(rng.standard_normal(n), lambda tt: 420 + 0 * tt, 0.5); s = s / (np.std(s) + 1e-9) * np.exp(-t / 0.5) * 0.18
    st = np.stack([m + w * s, m - w * s], 1)
    return reverb(fade(st, 0.002, 0.6), wet)


def chime_glass(seed=20, wet=0.42):
    """«مبروك!»: a bright glass chime (D minor triad partials, slightly inharmonic) with micro sparkle"""
    rng = R(seed); n = int(3.8 * SR); t = np.arange(n) / SR
    st = np.zeros((n, 2))
    for f, a, tau, p, dly in [(D6, 1.0, 1.0, -0.25, 0.0), (F6, 0.55, 0.85, 0.3, 0.018), (A6, 0.7, 0.7, -0.05, 0.032),
                              (D7, 0.35, 0.5, 0.4, 0.05)]:
        k = int(dly * SR); m = n - k
        y = modal(m, [(f, a, tau), (f * 2.32, a * 0.25, tau * 0.4), (f * 4.25, a * 0.08, tau * 0.2)], rng, strike=0.08)
        st[k:] += pan_eq(y, p)
    for g in range(18):
        t0 = rng.uniform(0.0, 0.7); L = int(rng.uniform(0.008, 0.02) * SR); k = int(t0 * SR)
        f = rng.choice([D7, A6 * 2, F6 * 2, D7 * 2]) * rng.uniform(0.997, 1.003)
        s = np.sin(2 * np.pi * f * np.arange(L) / SR) * np.hanning(L) * rng.uniform(0.04, 0.1) * np.exp(-t0 / 0.4)
        st[k:k + L] += pan_eq(s, rng.uniform(-0.8, 0.8))
    st = hp(st, 500)
    return reverb(fade(st, 0.0005, 1.0), wet)


def flag_flutter(d=0.3, seed=21, tap=False, wet=0.12):
    rng = R(seed); n = int((d + 0.25) * SR); t = np.arange(n) / SR
    nb = bp(rng.standard_normal(n), 700, 3600); nb /= np.std(nb) + 1e-9
    f = np.zeros(n); tt = 0.0; i = 0
    while tt < d:
        L = int(0.022 * SR); k = int(tt * SR)
        if k + L < n:
            f[k:k + L] += np.hanning(L) * (1 - tt / d) ** 1.2 * rng.uniform(0.7, 1.0)
        tt += rng.uniform(0.026, 0.04); i += 1
    y = nb * f * 0.5
    wh = lp(rng.standard_normal(n), 300) * np.exp(-t / 0.05); y += 0.25 * wh / (np.std(wh[:2000]) + 1e-9) * 0.3
    if tap:
        k = int(d * SR)
        th, _ = sine_glide(n - k, 230, 140, tau=0.01); th *= np.exp(-np.arange(n - k) / SR / 0.025)
        c = lp(rng.standard_normal(n - k), 2800) * np.exp(-np.arange(n - k) / SR / 0.003)
        y[k:] += 0.55 * th + 0.25 * c
    st = pan_eq(y, np.linspace(0.2, -0.2, n))
    s = bp(rng.standard_normal(n), 900, 3000) * f * 0.12; st[:, 0] += s; st[:, 1] -= s
    return reverb(fade(st, 0.002, 0.05), wet)


def cam_move(kind, seed=22, wet=0.3):
    """camera pull-out (opens: falling, widening) or push-in (S-curve: rising, narrowing): low airy whooshes"""
    rng = R(seed)
    if kind == "pull":
        d, tp = 1.05, 0.12
    else:
        d, tp = 0.95, 0.38
    n = int(d * SR); t = np.arange(n) / SR
    up = np.clip(t / tp, 0, 1); dn = np.clip((t - tp) / (d - tp), 0, 1)
    if kind == "pull":
        e = np.where(t < tp, up ** 1.6, np.exp(-dn * 3.2) * (1 - dn ** 3))
        fc = lambda tt: 900 * (180 / 900) ** np.clip(tt / d, 0, 1) ** 0.7
        w = 0.15 + 0.65 * np.clip(t / (d * 0.6), 0, 1)
    else:
        e = np.sin(np.pi * np.clip(t / (2 * tp), 0, 1)) ** 2 * (t < 2 * tp) + np.where(t >= 2 * tp, 0, 0)
        e = np.where(t < tp, up ** 2.0, np.exp(-dn * 4.0) * (1 - dn ** 3))
        fc = lambda tt: 200 * (1100 / 200) ** np.clip(tt / (tp * 1.4), 0, 1) ** 1.2
        w = 0.8 - 0.6 * np.clip(t / d, 0, 1)
    m = tv_band(rng.standard_normal(n), fc, 0.9, tilt=-2); m /= np.std(m) + 1e-9
    s = tv_band(rng.standard_normal(n), fc, 0.9, tilt=-2); s /= np.std(s) + 1e-9
    a = tv_band(rng.standard_normal(n), lambda tt: 5.0 * fc(tt) + 2500, 0.6, tilt=-3); a /= np.std(a) + 1e-9
    lo = lp(rng.standard_normal(n), 180); lo /= np.std(lo) + 1e-9
    mm = (m + 0.25 * a + 0.35 * lo) * e
    ss = s * e * w
    st = np.stack([mm + ss, mm - ss], 1)
    return reverb(fade(st, 0.004, 0.05), wet)


def wipe_end(seed=23, wet=0.26):
    """the chamfer end wipe: a sweeping whoosh right -> left with a thin metallic zing riding the red edge"""
    w = whoosh(0.62, 0.24, 500, 2600, 600, bw=0.7, pan=(0.75, -0.75), width=0.3, air=0.35, body=0.25, seed=seed,
               rel=3.0, wet=0.0)
    rng = R(seed + 1); n = len(w); t = np.arange(n) / SR
    z = tv_band(rng.standard_normal(n), lambda tt: 5200 + 1800 * np.clip(tt / 0.5, 0, 1), 0.06)
    z = z / (np.std(z) + 1e-9) * np.sin(np.pi * np.clip(t / 0.52, 0, 1)) ** 2 * 0.12
    w += pan_eq(z, np.linspace(0.8, -0.8, n))
    return reverb(w, wet)


# ================================================================ the palette
PAL = []


def add(name, x, cat, desc, sync="onset", kind="std", peak_at=None):
    PAL.append(dict(name=name, x=x, cat=cat, desc=desc, sync=sync, kind=kind, peak_at=peak_at))


add("whoosh_soft_a", whoosh(0.46, 0.13, 420, 2100, 800, pan=(0.45, -0.45), seed=101), "whoosh",
    "soft short whoosh, right to left (cards / panels entering, RTL)", "peak")
add("whoosh_soft_b", whoosh(0.50, 0.15, 360, 1800, 650, pan=(-0.4, 0.4), seed=102, bw=0.8), "whoosh",
    "soft short whoosh, left to right (Latin / LTR moves)", "peak")
add("whoosh_soft_c", whoosh(0.42, 0.11, 520, 2500, 950, pan=(0.25, -0.25), seed=103, air=0.35), "whoosh",
    "soft short whoosh, brighter, narrow pan (small panels, chips)", "peak")
add("whoosh_hard_a", whoosh(0.62, 0.11, 300, 2600, 500, pan=(0.6, -0.6), seed=104, body=0.55, air=0.3, bw=0.85, rel=3.6),
    "whoosh", "hard short whoosh with a low body (B-roll cut-ins, big moves)", "peak")
add("whoosh_hard_b", whoosh(0.58, 0.10, 340, 2900, 560, pan=(-0.55, 0.55), seed=105, body=0.5, air=0.3, bw=0.8, rel=3.8),
    "whoosh", "hard short whoosh with a low body, left to right", "peak")
add("whoosh_long_rise", whoosh(1.30, 1.02, 180, 2400, 1500, pan=(-0.3, 0.3), seed=106, att=2.6, rel=4.0, body=0.25, wet=0.26),
    "whoosh", "long rising whoosh (1.3 s, peaks at 1.02 s)", "peak")
add("whoosh_long_fall", whoosh(1.30, 0.20, 900, 2200, 160, pan=(0.35, -0.35), seed=107, att=1.4, rel=2.4, body=0.3, wet=0.26),
    "whoosh", "long falling whoosh (1.3 s, peaks at 0.2 s, falls away)", "peak")
add("cam_pull", cam_move("pull", 108), "camera", "camera pull-out: low airy whoosh that falls and opens up (0.62 s expo)")
add("cam_push", cam_move("push", 109), "camera", "camera push-in: low whoosh rising through an S-curve, narrowing (0.7 s)")
add("slide_card_a", reverb(mix(whoosh(0.5, 0.05, 1500, 3200, 900, bw=0.55, pan=(0.35, 0.0), width=0.2, air=0.15, seed=110, att=1.2,
                               rel=3.6, wet=0.0) * 0.8, thud(170, 110, 0.03, 111, click=0.6, wet=0.0, dur=0.3) * 0.25), 0.12),
    "slide", "card / panel slide: a short friction swish with a soft felt tap at its start (expo 0.5 s entries)")
add("slide_card_b", reverb(mix(whoosh(0.5, 0.06, 1200, 2800, 800, bw=0.6, pan=(-0.3, 0.05), width=0.2, air=0.15, seed=112, att=1.2,
                               rel=3.4, wet=0.0) * 0.8, thud(150, 100, 0.03, 113, click=0.5, wet=0.0, dur=0.3) * 0.25), 0.12),
    "slide", "card / panel slide, variant (slightly lower, from the left)")
for nm, sd, p in [("reveal_air_a", 114, (0.4, -0.4)), ("reveal_air_b", 115, (0.3, -0.5)), ("reveal_air_c", 116, (-0.35, 0.35))]:
    add(nm, whoosh(0.36, 0.05, 3200, 7500, 4200, bw=0.5, pan=p, width=0.45, air=0.1, seed=sd, att=1.0, rel=3.0, tilt=-1, wet=0.14),
        "reveal", "text / headline reveal: an airy high swish (%s)" % ("RTL" if p[0] > p[1] else "LTR"), "onset")
add("wipe_end", wipe_end(117), "whoosh", "end wipe: chamfer swish right to left with a thin metallic zing on the red edge", "peak")
add("pop_a", pop(A4, 118), "pop", "soft pluck / tap, A4 (small elements popping in)")
add("pop_b", pop(D5, 119), "pop", "soft pluck / tap, D5")
add("pop_c", pop(F5, 120), "pop", "soft pluck / tap, F5")
add("click_ui_a", click_ui(121), "click", "UI click: cursor press + release")
add("click_ui_b", click_ui(122, second=0.0, pitch=0.9), "click", "UI click: single firm press (toggles, arrow taps)")
add("tick_a", tick([(3150, 1.0, 0.012), (4720, 0.55, 0.008), (7900, 0.25, 0.004)], 123), "tick", "crisp metal tick (pips, checks)")
add("tick_b", tick([(2650, 1.0, 0.014), (4100, 0.5, 0.009), (6800, 0.2, 0.005)], 124), "tick", "crisp metal tick, lower")
add("tick_c", tick([(3700, 1.0, 0.01), (5600, 0.45, 0.006), (2100, 0.3, 0.015)], 125), "tick", "crisp metal tick, brighter")
add("counter_roll_s", counter_roll(0.45, 10, 126), "counter", "number counter roll landing at 0.45 s (quartOut: dense -> sparse ticks; last tick = landing)")
add("counter_roll_m", counter_roll(0.68, 13, 127), "counter", "number counter roll landing at 0.68 s")
add("counter_roll_l", counter_roll(1.00, 17, 128), "counter", "number counter roll landing at 1.00 s")
add("ping_land_a", ping(A5, [1, 2.0, 2.98, 4.16, 5.43], [0.7, 0.4, 0.25, 0.15, 0.08], [1, 0.35, 0.15, 0.12, 0.05], 129, dur=2.6),
    "ping", "landing ping, glassy, A5 (a counter / figure lands)")
add("ping_land_b", ping(D6, [1, 2.76, 5.40, 8.93], [0.6, 0.3, 0.15, 0.08], [1, 0.3, 0.12, 0.05], 130, wet=0.32, dur=2.3),
    "ping", "landing ping, metallic bar, D6")
add("glitch_swipe_a", glitch_swipe(131), "glitch", "data swipe: sample-held noise grains through combs, left to right")
add("glitch_swipe_b", glitch_swipe(132, d=0.30, n_gr=11, pan=(0.6, -0.6)), "glitch", "data swipe, right to left, shorter")
add("scan_draw_a", scan_draw(0.55, 700, 2600, 133), "scan", "line draw-on: soft resonant upward sweep, 0.55 s (e4 draws)")
add("scan_draw_b", scan_draw(0.95, 500, 2200, 134, pan=(0.3, -0.3)), "scan", "line draw-on, long 0.95 s (stair lines, rings)")
add("shimmer_logo", shimmer(1.6, 135), "shimmer", "logo build shimmer: staggered high D-minor partials, sparkle, airy up-sweep")
add("shimmer_sheen", shimmer(0.65, 136, wet=0.3, notes=(D6, A6, D7, F6), sweep=(5000, 13000)), "shimmer",
    "short metallic sheen for numerals (0.65 s)")
add("thud_soft_a", thud(96, 52, 0.13, 137), "impact", "soft low thud (cards / chips landing, gentle accents)")
add("thud_soft_b", thud(120, 66, 0.10, 138, click=0.5), "impact", "soft low thud, tighter and higher")
add("impact_deep", impact_deep(139), "impact", "deep cinematic impact with a dark metallic body (hard cuts, key landings)", kind="low")
add("boom_drop", boom(140), "boom", "drop boom: sub drop + saturated body + long dark tail (the two music drops)", kind="low")
add("boom_end", boom(141, wet=0.5, f0=52, f1=D1, tau_a=0.95, dur=4.0, gong=0.22, gtau=0.62), "boom",
    "end-card boom: D1 sub + a low gong bloom (the end-card logo hit)", kind="low")
add("riser_short", riser(0.62, 142), "riser", "short riser, peaks at its end (0.62 s)", "peak")
add("riser_med", riser(1.40, 143, f0=200, f1=6000), "riser", "medium riser, peaks at its end (1.4 s)", "peak")
add("sub_drop", sub_drop(144), "sub", "sub drop 72 -> 28 Hz (weight under big landings)", kind="low")
add("lock_padlock", lock_snap(145), "mech", "padlock: shackle snap, latch click + metal clack + small ring")
add("shutter_close", shutter(146), "mech", "shutter close: a fast slide right to left ending in a soft clack at 0.17 s")
add("stamp", stamp(147), "mech", "stamp: low thump + slap (chips / tabs stamped into place)")
add("sonar_white", sonar(D2, None, 148, band=(900, 520), wet=0.5), "floor", "floor ripple: soft low D2 bloom under a rippling airy band, widening (white ring)")
add("sonar_red", sonar(D2 * 1.0, A4, 149, wet=0.45, dur=2.8, ripple_hz=5.0), "floor",
    "stage pulse from the pad: darker D2 bloom with a soft A4 ping (red pulse)")  # dur default
add("chime_glass", chime_glass(150), "chime", "«مبروك!»: bright glass chime (D-minor partials) with micro sparkle")
add("flag_flutter", flag_flutter(0.28, 151), "flag", "flag unfurl: a short fabric flutter")
add("flag_drop", flag_flutter(0.18, 152, tap=True), "flag", "flag marker drop: short flutter ending in a soft tap at 0.18 s")


def onset_peak(x):
    a = np.max(np.abs(x), axis=1)
    w = int(0.005 * SR)
    env = np.sqrt(np.convolve(a ** 2, np.ones(w) / w, mode="same"))
    pk = env.max()
    on = int(np.argmax(env > pk * 10 ** (-30 / 20)))
    # loudness peak (K-weighted, 20 ms)
    k = signal.sosfilt(K_SOS, x, axis=0); e = np.sum(k ** 2, axis=1)
    w2 = int(0.02 * SR); ee = np.convolve(e, np.ones(w2) / w2, mode="same")
    return on / SR, int(np.argmax(ee)) / SR


meta = {}
for p in PAL:
    x = family(p["x"], p["kind"])
    x = trim_tail(x, -70)
    x = x - np.mean(x, axis=0, keepdims=True) * 0  # (HPF already removes DC)
    L = loud_win(x, 0.1)
    x = x * 10 ** ((TARGET_LKFS - L) / 20)
    pk = 20 * np.log10(np.max(np.abs(x)) + 1e-12)
    if pk > PEAK_MAX:
        x = x * 10 ** ((PEAK_MAX - pk) / 20)
    L2 = loud_win(x, 0.1); pk2 = 20 * np.log10(np.max(np.abs(x)) + 1e-12); M = loud_win(x, 0.4)
    on, pt = onset_peak(x)
    if p["cat"] == "riser":
        pt = len(x) / SR if False else pt
    assert np.all(np.isfinite(x))
    write_wav(os.path.join(OUT, p["name"] + ".wav"), x)
    meta[p["name"]] = dict(file=p["name"] + ".wav", cat=p["cat"], desc=p["desc"], sync_default=p["sync"],
                           dur=round(len(x) / SR, 3), onset_s=round(on, 4), peak_s=round(pt, 4),
                           lkfs_100ms_max=round(L2, 2), lkfs_400ms_max=round(M, 2), peak_dbfs=round(pk2, 2))
    print("%-18s %5.2fs on %.3f pk %.3f  L100 %6.2f  M %6.2f  peak %6.2f" % (p["name"], len(x) / SR, on, pt, L2, M, pk2))
json.dump(dict(sr=SR, target_lkfs_100ms=TARGET_LKFS, peak_ceiling_dbfs=PEAK_MAX, sounds=meta),
          open(os.path.join(OUT, "palette.json"), "w"), indent=1, ensure_ascii=False)
print(len(meta), "files")
