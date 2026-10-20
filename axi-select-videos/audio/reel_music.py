#!/usr/bin/env python3
"""
reel_music.py - Axi Select Instagram reel score, synthesized entirely from code.

30.000 s, 128 BPM (beat 0.46875 s, bar 1.875 s, 16 bars), D minor.
Dark hybrid trap / drift-phonk with cinematic impacts.

Nothing is sampled: every sound is built here from oscillators (polyBLEP saws, FM, sines),
filtered noise, envelopes, waveshaping, sidechain ducking, a synthetic-IR convolution
reverb (one shared "room"), ping-pong delay, M/S width, bus compression, an oversampled
soft clipper and a 4x-oversampled true-peak limiter. A fixed RNG seed makes it bit-exact
deterministic.

Outputs (next to this script):
  reel_music.wav                 48 kHz / 24-bit stereo, exactly 1,440,000 samples
  reel_beats.json                grid, sections, hits (sample-accurate times)
  reel_music_spectrogram.png     spectrogram + RMS/0.5 s strip with section markers
  reel_music_analysis.json       measurements (LUFS, dBTP, RMS/0.5 s, band balance, crest)
  sfx/*.wav                      SFX kit rendered through the same reverb room

Run:  python3 reel_music.py
"""
import json
import os
import sys
import time
import zlib

import numpy as np
import soundfile as sf
from scipy import signal
from scipy.ndimage import minimum_filter1d, uniform_filter1d

T_START = time.time()
OUT = os.path.dirname(os.path.abspath(__file__))
SFX_DIR = os.path.join(OUT, 'sfx')

# ----------------------------------------------------------------------------- grid
SR = 48000
DUR = 30.0
N = int(round(SR * DUR))                 # 1,440,000
BPM = 128.0
BEAT = 60.0 / BPM                        # 0.46875  (22500 samples)
BAR = 4 * BEAT                           # 1.875    (90000 samples)
STEP = BEAT / 4                          # 1/16     (5625 samples)
SEED = 20261020

GAP0 = 1 * BAR - STEP                    # 1.7578125 : start of the pre-drop silence
T_DROP_A = 1 * BAR                       # 1.875
T_BREAK = 7 * BAR                        # 13.125
T_RISE = T_BREAK + 3 * BEAT              # 14.53125
T_DROP_B = 8 * BAR                       # 15.0
T_STAB = 14 * BAR                        # 26.25
STABS = [T_STAB + k * BEAT for k in range(4)]   # 26.25, 26.71875, 27.1875, 27.65625
T_END = 15 * BAR                         # 28.125
T_SILENT = 29.9
STAB_LEN = 0.19
D32 = STEP / 2                           # 1/32 = 0.05859375 s
# pre-hit dropouts (digital silence) so the 2-bar cut points inside drop B and the first stab
# land out of silence instead of on top of a full mix: (hit time, dropout length)
DIPS = [(10 * BAR, D32), (12 * BAR, D32), (T_STAB, STEP)]


def smp(t):
    return int(round(t * SR))


def hz(m):
    return 440.0 * 2.0 ** ((np.asarray(m, dtype=float) - 69.0) / 12.0)


def db2a(d):
    return 10.0 ** (d / 20.0)


def a2db(a):
    return 20.0 * np.log10(np.maximum(a, 1e-12))


def st(bar, step):
    """time of a 1/16 step inside a bar (step may be fractional)"""
    return bar * BAR + step * STEP


# ----------------------------------------------------------------------------- filters
_SOS = {}


def _butter(kind, f, order):
    key = (kind, f, order)
    if key not in _SOS:
        bt = {'lp': 'lowpass', 'hp': 'highpass', 'bp': 'bandpass'}[kind]
        _SOS[key] = signal.butter(order, f, btype=bt, fs=SR, output='sos')
    return _SOS[key]


def lp(x, f, order=2):
    return signal.sosfilt(_butter('lp', float(f), order), x, axis=-1)


def hp(x, f, order=2):
    return signal.sosfilt(_butter('hp', float(f), order), x, axis=-1)


def bp(x, f1, f2, order=2):
    return signal.sosfilt(_butter('bp', (float(f1), float(f2)), order), x, axis=-1)


def rbj(kind, f0, q=0.707, gain_db=0.0):
    """RBJ cookbook biquad coefficients"""
    A = 10 ** (gain_db / 40.0)
    w0 = 2 * np.pi * f0 / SR
    cw, sw = np.cos(w0), np.sin(w0)
    al = sw / (2 * q)
    if kind == 'lp':
        b = [(1 - cw) / 2, 1 - cw, (1 - cw) / 2]; a = [1 + al, -2 * cw, 1 - al]
    elif kind == 'hp':
        b = [(1 + cw) / 2, -(1 + cw), (1 + cw) / 2]; a = [1 + al, -2 * cw, 1 - al]
    elif kind == 'bp':
        b = [al, 0.0, -al]; a = [1 + al, -2 * cw, 1 - al]
    elif kind == 'peak':
        b = [1 + al * A, -2 * cw, 1 - al * A]; a = [1 + al / A, -2 * cw, 1 - al / A]
    elif kind in ('lowshelf', 'highshelf'):
        sq = 2 * np.sqrt(A) * al
        if kind == 'lowshelf':
            b = [A * ((A + 1) - (A - 1) * cw + sq), 2 * A * ((A - 1) - (A + 1) * cw), A * ((A + 1) - (A - 1) * cw - sq)]
            a = [(A + 1) + (A - 1) * cw + sq, -2 * ((A - 1) + (A + 1) * cw), (A + 1) + (A - 1) * cw - sq]
        else:
            b = [A * ((A + 1) + (A - 1) * cw + sq), -2 * A * ((A - 1) + (A + 1) * cw), A * ((A + 1) + (A - 1) * cw - sq)]
            a = [(A + 1) - (A - 1) * cw + sq, 2 * ((A - 1) - (A + 1) * cw), (A + 1) - (A - 1) * cw - sq]
    else:
        raise ValueError(kind)
    b = np.array(b) / a[0]
    a = np.array(a) / a[0]
    return b, a


def eq(x, kind, f0, gain_db=0.0, q=0.707):
    b, a = rbj(kind, f0, q, gain_db)
    return signal.lfilter(b, a, x, axis=-1)


def tv_filter(x, fc, kind='lp', q=0.707, block=64):
    """time-varying biquad (block-wise coefficient updates, state carried across blocks)"""
    x = np.asarray(x, dtype=float)
    mono = x.ndim == 1
    X = np.atleast_2d(x)
    n = X.shape[-1]
    fc = np.broadcast_to(np.asarray(fc, dtype=float), (n,))
    Y = np.empty_like(X)
    zi = np.zeros((X.shape[0], 2))
    for i in range(0, n, block):
        j = min(n, i + block)
        f = float(np.clip(fc[(i + j) // 2], 20.0, 0.45 * SR))
        b, a = rbj(kind, f, q)
        Y[:, i:j], zi = signal.lfilter(b, a, X[:, i:j], axis=-1, zi=zi)
    return Y[0] if mono else Y


# ----------------------------------------------------------------------------- oscillators / utils
def pan2(x, pan=0.0):
    th = (np.clip(pan, -1, 1) + 1) * np.pi / 4
    return np.vstack([x * np.cos(th), x * np.sin(th)]) * np.sqrt(2.0)


def stereo(x):
    x = np.asarray(x, dtype=float)
    return x if x.ndim == 2 else np.vstack([x, x])


def saw_blep(f, ph0=0.0):
    """band-limited (polyBLEP) sawtooth; f may be scalar-broadcast array (Hz)"""
    f = np.asarray(f, dtype=float)
    dt = f / SR
    ph = np.mod(ph0 + np.cumsum(dt), 1.0)
    y = 2.0 * ph - 1.0
    m = ph < dt
    t = ph[m] / dt[m]
    y[m] -= t + t - t * t - 1.0
    m = ph > 1.0 - dt
    t = (ph[m] - 1.0) / dt[m]
    y[m] -= t * t + t + t + 1.0
    return y


def sine_sweep(f):
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def fade(x, fin=0.0, fout=0.0):
    x = np.array(x, dtype=float, copy=True)
    n = x.shape[-1]
    if fin > 0:
        k = min(n, max(1, smp(fin)))
        x[..., :k] *= np.sin(np.linspace(0, np.pi / 2, k)) ** 2
    if fout > 0:
        k = min(n, max(1, smp(fout)))
        x[..., n - k:] *= np.cos(np.linspace(0, np.pi / 2, k)) ** 2
    return x


def norm_peak(x, peak=1.0):
    m = np.max(np.abs(x))
    return x * (peak / m) if m > 0 else x


def softsat(x, drive=1.5):
    return np.tanh(drive * x) / np.tanh(drive)


def supersaw(midi, n, detune=0.16, voices=7, width=0.85, rng=None, drift=0.012):
    """7-voice detuned polyBLEP supersaw, stereo-spread; midi may be an array (glides)"""
    rng = rng if rng is not None else np.random.default_rng(1)
    offs = np.array([-1.0, -0.64, -0.3, 0.0, 0.3, 0.64, 1.0])[:voices] * detune
    gains = np.array([0.62, 0.78, 0.9, 1.0, 0.9, 0.78, 0.62])[:voices]
    pans = np.array([-1.0, 0.62, -0.35, 0.0, 0.35, -0.62, 1.0])[:voices] * width
    mid = np.broadcast_to(np.asarray(midi, dtype=float), (n,))
    t = np.arange(n) / SR
    out = np.zeros((2, n))
    for o, g, p in zip(offs, gains, pans):
        lfo = drift * np.sin(2 * np.pi * rng.uniform(0.15, 0.45) * t + rng.uniform(0, 2 * np.pi))
        y = saw_blep(hz(mid + o + lfo), rng.random())
        out += pan2(y * g, p)
    return out / np.sqrt(np.sum(gains ** 2))


# ----------------------------------------------------------------------------- the room (shared IR)
def make_ir(rt60=1.75, length=2.3, predelay=0.017, seed=SEED + 5):
    """synthetic stereo hall IR: band-split noise with frequency-dependent decay + early reflections"""
    r = np.random.default_rng(seed)
    n = smp(length)
    t = np.arange(n) / SR
    bands = [(20, 200, 1.05), (200, 800, 1.0), (800, 2500, 0.9), (2500, 6000, 0.68),
             (6000, 12000, 0.42), (12000, 20000, 0.24)]
    ir = np.zeros((2, n))
    for ch in range(2):
        noise = r.standard_normal(n)
        tail = np.zeros(n)
        for lo, hi, m in bands:
            tail += bp(noise, lo, hi, 3) * 10 ** (-3.0 * t / (rt60 * m))
        tail *= 1.0 - np.exp(-t / 0.012)                     # diffusion build-up
        tail /= np.sqrt(np.sum(tail ** 2))
        er = np.zeros(n)
        for tt in np.sort(r.uniform(0.003, 0.07, 16)):
            er[smp(tt)] += r.choice([-1.0, 1.0]) * np.exp(-tt / 0.045) * r.uniform(0.5, 1.0)
        er = lp(er, 8000)
        er /= np.sqrt(np.sum(er ** 2)) + 1e-12
        h = tail + 0.45 * er
        d = smp(predelay)
        h = np.concatenate([np.zeros(d), h[:n - d]])
        ir[ch] = h
    ir = lp(hp(ir, 190, 2), 10500, 2)
    ir = fade(ir, 0, 0.25)
    ir /= np.sqrt(np.mean(np.sum(ir ** 2, axis=1)))
    return ir


IR = make_ir()
# same room (same seed / reflections), longer decay: used only for the final hit's tail
IR_LONG = make_ir(rt60=3.0, length=3.4, predelay=0.024)


def reverb(x, ir=IR):
    x = stereo(x)
    n = x.shape[1]
    L = 0.78 * x[0] + 0.22 * x[1]
    R = 0.78 * x[1] + 0.22 * x[0]
    yl = signal.oaconvolve(L, ir[0])[:n]
    yr = signal.oaconvolve(R, ir[1])[:n]
    return np.vstack([yl, yr])


def pingpong(x, delay=STEP * 3, fb=0.36, taps=6):
    """dotted-1/8 ping-pong, each repeat darker"""
    n = len(x)
    d = smp(delay)
    out = np.zeros((2, n))
    y = lp(hp(x, 380), 6000)
    for k in range(1, taps + 1):
        sh = k * d
        if sh >= n:
            break
        out[(k - 1) % 2, sh:] += y[:n - sh] * fb ** (k - 1)
        y = lp(y, 4200, 1)
    return out


# ----------------------------------------------------------------------------- dynamics
def compress(x, thr=-18.0, ratio=4.0, att=0.005, rel=0.12, knee=6.0, makeup=0.0, key=None, block=16):
    """feed-forward peak compressor, block-rate gain computer, dB-domain attack/release"""
    x = np.asarray(x, dtype=float)
    det = np.abs(x if key is None else key)
    if det.ndim == 2:
        det = det.max(axis=0)
    n = det.shape[0]
    nb = -(-n // block)
    pad = np.zeros(nb * block)
    pad[:n] = det
    lvl = a2db(pad.reshape(nb, block).max(axis=1))
    over = lvl - thr
    gr = np.where(over <= -knee / 2, 0.0,
                  np.where(over >= knee / 2, over * (1 - 1 / ratio),
                           (1 - 1 / ratio) * (over + knee / 2) ** 2 / (2 * knee)))
    aa = np.exp(-block / (att * SR))
    ar = np.exp(-block / (rel * SR))
    sm = np.empty(nb)
    g = 0.0
    for i in range(nb):
        v = gr[i]
        g = aa * g + (1 - aa) * v if v > g else ar * g + (1 - ar) * v
        sm[i] = g
    gdb = np.interp(np.arange(n), np.arange(nb) * block + block / 2, sm)
    return x * db2a(makeup - gdb), gdb


def softclip(x, thr, ceil):
    """linear below thr, tanh knee approaching ceil"""
    y = np.array(x, copy=True)
    ax = np.abs(y)
    m = ax > thr
    k = ceil - thr
    y[m] = np.sign(y[m]) * (thr + k * np.tanh((ax[m] - thr) / k))
    return y


def true_peak(x, os_=4):
    up = signal.resample_poly(stereo(x), os_, 1, axis=1)
    return float(np.max(np.abs(up)))


def limiter(x, ceiling_db=-1.25, look=0.0015, rel=0.09, os_=4, block=16):
    """look-ahead brickwall on the 4x-oversampled peak envelope (true-peak aware)"""
    x = stereo(x)
    n = x.shape[1]
    c = db2a(ceiling_db)
    up = signal.resample_poly(x, os_, 1, axis=1)
    pk = np.max(np.abs(up), axis=0)[:n * os_].reshape(n, os_).max(axis=1)
    pk = np.maximum(pk, np.max(np.abs(x), axis=0))
    g_req = np.minimum(1.0, c / np.maximum(pk, 1e-9))
    L = max(2, smp(look))
    g = minimum_filter1d(g_req, size=2 * L + 1, mode='nearest')
    nb = -(-n // block)
    gp = np.ones(nb * block)
    gp[:n] = g
    gb = gp.reshape(nb, block).min(axis=1)
    ar = np.exp(-block / (rel * SR))
    out = np.empty(nb)
    cur = 1.0
    for i in range(nb):
        v = gb[i]
        cur = v if v < cur else ar * cur + (1 - ar) * v
        out[i] = cur
    gs = np.minimum(np.repeat(out, block)[:n], g)
    gs = uniform_filter1d(gs, size=L, mode='nearest')
    return x * gs, gs


# ----------------------------------------------------------------------------- loudness (ITU-R BS.1770-4)
def k_weight(x):
    # 48 kHz coefficients from BS.1770
    b1 = [1.53512485958697, -2.69169618940638, 1.19839281085285]
    a1 = [1.0, -1.69065929318241, 0.73248077421585]
    b2 = [1.0, -2.0, 1.0]
    a2 = [1.0, -1.99004745483398, 0.99007225036621]
    return signal.lfilter(b2, a2, signal.lfilter(b1, a1, x, axis=-1), axis=-1)


def lufs_integrated(x):
    y = k_weight(stereo(x))
    blk, hop = smp(0.4), smp(0.1)
    nblk = 1 + (y.shape[1] - blk) // hop
    z = np.array([np.sum(np.mean(y[:, i * hop:i * hop + blk] ** 2, axis=1)) for i in range(nblk)])
    Lb = -0.691 + 10 * np.log10(np.maximum(z, 1e-15))
    g1 = Lb > -70
    rel = -0.691 + 10 * np.log10(np.mean(z[g1])) - 10
    g2 = g1 & (Lb > rel)
    return float(-0.691 + 10 * np.log10(np.mean(z[g2])))


def lufs_window(x, t0, t1):
    """ungated K-weighted loudness over a window (short-term style)"""
    y = k_weight(stereo(x))[:, smp(t0):smp(t1)]
    return float(-0.691 + 10 * np.log10(max(np.sum(np.mean(y ** 2, axis=1)), 1e-15)))


def short_term_max(x):
    y = k_weight(stereo(x))
    blk, hop = smp(3.0), smp(0.1)
    vals = []
    for i in range(0, y.shape[1] - blk + 1, hop):
        vals.append(-0.691 + 10 * np.log10(max(np.sum(np.mean(y[:, i:i + blk] ** 2, axis=1)), 1e-15)))
    return float(np.max(vals))


# ============================================================================= instruments
def kick_punch(seed=0, f_hi=250.0, f_lo=50.0, tau_f=0.028, tau_a=0.07, dur=0.3, click=0.5):
    r = np.random.default_rng(SEED + 100 + seed)
    n = smp(dur)
    t = np.arange(n) / SR
    f = f_lo + (f_hi - f_lo) * np.exp(-t / tau_f)
    amp = np.where(t < 0.010, 1.0, np.exp(-(t - 0.010) / tau_a))
    body = softsat(sine_sweep(f) * amp, 2.4)
    cl = bp(r.standard_normal(n), 1800, 9500) * np.exp(-t / 0.0018) * click
    beat = np.sin(2 * np.pi * 1450 * t) * np.exp(-t / 0.0011) * 0.22
    y = hp(body + cl + beat, 30, 2)
    return fade(y, 0, 0.03)


def render_808(events, a0, n, drive=1.8, grit=0.22, punch=12.0, punch_tau=0.016, rel=0.03, decay=1.6, exciter=1.0,
               gap=0.0, post_sus=1.0, post_tau=0.15):
    """continuous mono 808 voice: retriggers with pitch-punch, legato glides, saturation.
    gap > 0: a note followed by a retrigger is released `gap` s early, so every retrigger starts
    from silence with a phase reset (articulated, punchy 808 instead of a constant sub wall).
    post_sus < 1: post-saturation transient shaper - the tanh flattens the decay to a wall, so the
    sustain is pulled down to post_sus (tau post_tau) after every retrigger to restore the bounce"""
    ev = sorted(events, key=lambda e: e[0])
    pitch = np.full(n, float(ev[0][2]))
    amp = np.zeros(n)
    resets = [0]
    trig = [0]
    cur_p, cur_a = float(ev[0][2]), 0.0
    for k, (t, dur, m, gl) in enumerate(ev):
        if gap > 0 and k + 1 < len(ev) and ev[k + 1][3] == 0:
            dur = min(dur, ev[k + 1][0] - t - gap)
        i0 = smp(t) - a0
        i1 = (smp(ev[k + 1][0]) - a0) if k + 1 < len(ev) else n
        i1 = min(i1, n)
        L = i1 - i0
        if L <= 0 or i0 < 0:
            continue
        tt = np.arange(L) / SR
        if gl > 0:
            u = np.clip(tt / gl, 0, 1)
            u = u * u * (3 - 2 * u)
            p = cur_p + (m - cur_p) * u
            a = cur_a * np.exp(-tt / decay)
        else:
            p = m + punch * np.exp(-tt / punch_tau)
            body = np.exp(-tt / decay) * (0.72 + 0.28 * np.exp(-tt / 0.08))
            atk = np.clip(tt / 0.0006, 0, 1)
            a = cur_a * (1 - atk) + atk * body
            trig.append(i0)
            if cur_a < 0.06:
                resets.append(i0)
        off = smp(dur)
        if off < L:
            a = a * np.clip(1 - (np.arange(L) - off) / smp(rel), 0, 1)
        pitch[i0:i1] = p
        amp[i0:i1] = a
        cur_p, cur_a = float(m), float(a[-1])
    dph = hz(pitch) / SR
    ph = np.cumsum(dph) - dph
    idx = np.zeros(n, dtype=int)
    idx[np.array(resets)] = np.array(resets)
    idx = np.maximum.accumulate(idx)
    ph = ph - ph[idx]
    x = (np.sin(2 * np.pi * ph) + 0.05 * np.sin(4 * np.pi * ph)) * amp
    # psychoacoustic-bass exciter: 2nd-4th partials so the line reads on phone speakers
    exc = (0.20 * np.sin(4 * np.pi * ph) + 0.20 * np.sin(6 * np.pi * ph + 0.6) + 0.12 * np.sin(8 * np.pi * ph + 1.1)) * amp ** 1.3
    core = softsat(x, drive)
    dirt = bp(np.tanh(5.0 * x + 0.25 * x * x), 180, 3000, 2) * grit     # odd + even harmonics for small speakers
    y = lp(core + dirt + hp(softsat(exc, 1.2), 180, 2) * exciter, 5200, 2)
    if post_sus < 1.0:
        last = np.zeros(n, dtype=int)
        last[np.array(trig)] = np.array(trig)
        ts = (np.arange(n) - np.maximum.accumulate(last)) / SR
        y = y * (post_sus + (1 - post_sus) * np.exp(-ts / post_tau))
    return hp(y, 24, 2)


def snare_clap(seed, tail=0.12):
    r = np.random.default_rng(SEED + 200 + seed)
    n = smp(0.6)
    t = np.arange(n) / SR
    env = np.zeros(n)
    offs = [0.0, 0.0085, 0.0172, 0.0265]
    for k, o in enumerate(offs):
        tt = t - o
        msk = tt >= 0
        env[msk] += np.exp(-tt[msk] / 0.0045) * (0.62 if k < 3 else 1.0)
    tl = np.where(t >= offs[-1], np.exp(-(t - offs[-1]) / tail), 0.0)
    body = (sine_sweep(182 + 70 * np.exp(-t / 0.008)) * np.exp(-t / 0.055)
            + 0.35 * sine_sweep(332 + 40 * np.exp(-t / 0.006)) * np.exp(-t / 0.035))
    body = np.tanh(1.6 * body)
    trans = hp(r.standard_normal(n), 3000) * np.exp(-t / 0.0015)
    out = np.zeros((2, n))
    for ch in range(2):
        clap = eq(bp(r.standard_normal(n), 950, 4800, 2), 'peak', 1500, 4.0, 1.0)
        sn = hp(r.standard_normal(n), 2300) * np.exp(-t / 0.09) * 0.33
        out[ch] = clap * (env * 0.9 + tl * 0.55) + sn + body * 0.55 + trans * 0.35
    out = softsat(lp(hp(out, 150, 2), 12500, 2), 1.3)
    return fade(norm_peak(out), 0, 0.05)


HAT_F = np.array([205.3, 304.4, 369.6, 522.7, 540.0, 800.0])
_HATS = {}


def hat(decay=0.035, pitch=1.0, seed=0):
    key = (round(decay, 4), round(pitch, 3), seed % 4)
    if key in _HATS:
        return _HATS[key]
    r = np.random.default_rng(SEED + 300 + seed % 4)
    n = smp(min(1.2, decay * 7 + 0.01))
    t = np.arange(n) / SR
    metal = np.zeros(n)
    for f in HAT_F * pitch:
        metal += np.sign(np.sin(2 * np.pi * f * t + r.uniform(0, 2 * np.pi)))
    metal = bp(metal, 7000 * min(pitch, 1.25), 14000, 2)
    noise = hp(r.standard_normal(n), 8000 * min(pitch, 1.2), 2)
    env = (1 - np.exp(-t / 0.0004)) * np.exp(-t / decay)
    y = (0.5 * metal / 6 * 4 + 0.6 * noise) * env
    y = lp(eq(y, 'highshelf', 10000, -5.0), 13000)
    y = fade(norm_peak(y), 0, min(0.02, decay))
    _HATS[key] = y
    return y


def rim(seed=0):
    r = np.random.default_rng(SEED + 400 + seed)
    n = smp(0.09)
    t = np.arange(n) / SR
    y = (np.sin(2 * np.pi * 820 * t) + 0.5 * np.sin(2 * np.pi * 1660 * t)) * np.exp(-t / 0.010)
    y += bp(r.standard_normal(n), 1800, 6500) * np.exp(-t / 0.004) * 0.7
    return fade(norm_peak(hp(y, 300)), 0, 0.02)


def knock(seed=0):
    n = smp(0.16)
    t = np.arange(n) / SR
    idx = 3.2 * np.exp(-t / 0.018)
    y = np.sin(2 * np.pi * 430 * t + idx * np.sin(2 * np.pi * 430 * 1.48 * t)) * np.exp(-t / 0.045)
    return fade(norm_peak(hp(y, 260)), 0, 0.03)


def shaker(seed=0):
    r = np.random.default_rng(SEED + 500 + seed)
    n = smp(0.08)
    t = np.arange(n) / SR
    env = (1 - np.exp(-t / 0.004)) * np.exp(-t / 0.02)
    return fade(norm_peak(bp(r.standard_normal(n), 4800, 12500) * env), 0, 0.02)


def bell_note(m, dur, seed, bright=1.0, det_c=4.5, pluck=0.33):
    """dark 2-operator FM bell (ratios 2 and 3.5) + polyBLEP pluck body + strike"""
    r = np.random.default_rng(SEED + 600 + seed)
    n = smp(dur + 0.16)
    t = np.arange(n) / SR
    f = float(hz(m))
    gate = np.where(t < dur, 1.0, np.exp(-(t - dur) / 0.045))
    out = np.zeros((2, n))
    I1 = bright * (2.1 * np.exp(-t / 0.05) + 0.28)
    I2 = bright * (1.15 * np.exp(-t / 0.018))
    env = (1 - np.exp(-t / 0.0007)) * np.exp(-t / 0.42) * gate
    for ch, sg in enumerate((-1, 1)):
        fc = f * 2 ** (sg * det_c / 1200)
        ph = r.uniform(0, 2 * np.pi)
        car = np.sin(2 * np.pi * fc * t + I1 * np.sin(2 * np.pi * 2 * fc * t)
                     + I2 * np.sin(2 * np.pi * 3.5 * fc * t + ph))
        out[ch] = car * env
    s = saw_blep(np.full(n, f * 2 ** (6 / 1200)), r.random()) + saw_blep(np.full(n, f * 2 ** (-6 / 1200)), r.random())
    pl = (lp(s, 5200) * np.exp(-t / 0.035) * 0.6 + lp(s, 1150) * np.exp(-t / 0.22) * 0.4)
    pl *= (1 - np.exp(-t / 0.0008)) * gate * pluck
    strike = hp(r.standard_normal(n), 3200) * np.exp(-t / 0.0022) * 0.10
    out += pl + strike
    return fade(out, 0, 0.01)


def boom(dur=2.2, f_hi=146.8, f_lo=36.7, tau_f=0.22, tau_a=0.75, drive=1.6, lpf=900):
    n = smp(dur)
    t = np.arange(n) / SR
    f = f_lo + (f_hi - f_lo) * np.exp(-t / tau_f)
    x = sine_sweep(f) * (1 - np.exp(-t / 0.0008)) * np.exp(-t / tau_a)
    x = softsat(x, drive)
    return fade(hp(lp(x, lpf, 2), 24), 0, 0.2)


def crack(dur=0.7, seed=0, lpf=7000, decay=0.05):
    r = np.random.default_rng(SEED + 700 + seed)
    n = smp(dur)
    t = np.arange(n) / SR
    out = np.zeros((2, n))
    for ch in range(2):
        nz = r.standard_normal(n)
        out[ch] = (lp(nz, lpf) * np.exp(-t / decay) + hp(nz, 2600) * np.exp(-t / 0.011) * 0.7)
    out *= 1 - np.exp(-t / 0.0003)
    return fade(norm_peak(hp(out, 120)), 0, 0.1)


def crash(dur=1.8, seed=0, decay=0.55):
    r = np.random.default_rng(SEED + 800 + seed)
    n = smp(dur)
    t = np.arange(n) / SR
    out = np.zeros((2, n))
    for ch in range(2):
        metal = np.zeros(n)
        for f in HAT_F * 1.62 * (1 + 0.004 * ch):
            metal += np.sign(np.sin(2 * np.pi * f * t + r.uniform(0, 2 * np.pi)))
        metal = bp(metal, 5200, 12500) * np.exp(-t / (decay * 0.6)) * 0.12
        nz = hp(r.standard_normal(n), 4200) * np.exp(-t / decay)
        out[ch] = nz + metal
    out *= 1 - np.exp(-t / 0.0015)
    out = eq(out, 'highshelf', 11000, -3.5)
    return fade(norm_peak(out), 0, 0.3)


def metal_hit(dur=2.4, seed=0):
    """inharmonic struck-metal impact (additive partials + FM clang + crack)"""
    r = np.random.default_rng(SEED + 900 + seed)
    n = smp(dur)
    t = np.arange(n) / SR
    f0 = float(hz(74))
    ratios = [1.0, 1.41, 1.83, 2.57, 3.16, 4.07, 5.29, 6.62, 8.1]
    out = np.zeros((2, n))
    for ch in range(2):
        y = np.zeros(n)
        for k, rr in enumerate(ratios):
            f = f0 * rr * (1 + (ch - 0.5) * 0.003 * (k + 1))
            y += np.sin(2 * np.pi * f * t + r.uniform(0, 6.28)) * np.exp(-t / (1.25 / (1 + 0.4 * k))) / (1 + 0.55 * k)
        idx = 5.0 * np.exp(-t / 0.10)
        y += 0.6 * np.sin(2 * np.pi * f0 * t + idx * np.sin(2 * np.pi * f0 * 1.414 * t)) * np.exp(-t / 0.5)
        out[ch] = y
    out *= 1 - np.exp(-t / 0.0005)
    out = hp(out, 300, 2)
    out = norm_peak(out) + 0.55 * crack(dur, seed + 3, 9000, 0.03)
    return fade(norm_peak(out), 0, 0.4)


def noise_riser(dur, f0, f1, q=1.4, seed=0, curve=2.2, tone=None, tone_gain=0.25):
    r = np.random.default_rng(SEED + 1000 + seed)
    n = smp(dur)
    t = np.arange(n) / SR
    u = t / dur
    fc = f0 * (f1 / f0) ** u
    out = np.zeros((2, n))
    for ch in range(2):
        out[ch] = tv_filter(r.standard_normal(n), fc, 'bp', q) + 0.25 * hp(r.standard_normal(n), 6000)
    if tone is not None:
        m0, m1 = tone
        out += tone_gain * lp(supersaw(m0 + (m1 - m0) * u ** 1.5, n, 0.25, rng=r), 7000, 1) * 1.4
    out *= u ** curve
    return hp(out, 160, 2)


def reverse_swell(dur, notes, seed=0):
    """reversed reverb of a noise burst + chord: grows into the hit, peaks at its end"""
    r = np.random.default_rng(SEED + 1100 + seed)
    n0 = smp(0.25)
    t = np.arange(n0) / SR
    src = np.zeros((2, n0))
    for ch in range(2):
        src[ch] = bp(r.standard_normal(n0), 400, 7000) * np.exp(-t / 0.06)
    ch_ = np.zeros((2, n0))
    for m in notes:
        ch_ += supersaw(m, n0, 0.2, rng=r)
    src += 0.5 * lp(ch_, 5000) * np.exp(-t / 0.15) / max(1, len(notes))
    n = smp(dur)
    wet = reverb(np.pad(src, ((0, 0), (0, max(0, n + smp(0.5) - n0)))))[:, :n]
    y = wet[:, ::-1] * np.linspace(0, 1, n) ** 1.3
    return norm_peak(hp(y, 200, 2))


def stab(notes, length, seed=0):
    """hard-gated supersaw + brass-saw chord"""
    r = np.random.default_rng(SEED + 1200 + seed)
    n = smp(length + 0.005)
    t = np.arange(n) / SR
    out = np.zeros((2, n))
    for m in notes:
        out += supersaw(m, n, 0.22, rng=r)
        s = saw_blep(np.full(n, float(hz(m))), r.random())
        br = lp(s, 6500) * np.exp(-t / 0.05) + lp(s, 1600) * 0.7
        out += pan2(br * 0.55, r.uniform(-0.2, 0.2))
    out /= len(notes)
    env = (1 - np.exp(-t / 0.0012)) * (0.78 + 0.22 * np.exp(-t / 0.05))
    env *= np.clip((length + 0.004 - t) / 0.004, 0, 1)
    out = softsat(eq(hp(out, 175, 2), 'peak', 2300, 2.0, 0.8) * env, 1.6)
    return out


def heartbeat(dur=0.3, f=52.0):
    n = smp(dur)
    t = np.arange(n) / SR
    x = sine_sweep(f + 30 * np.exp(-t / 0.02)) * (1 - np.exp(-t / 0.002)) * np.exp(-t / 0.07)
    return fade(lp(softsat(x, 1.3), 300), 0, 0.05)


# ============================================================================= arrangement data
CHORD = {'Dm': [65, 69, 74], 'Bb': [65, 70, 74], 'Gm': [67, 70, 74], 'A': [69, 73, 76]}
ROOT = {'Dm': 38, 'Bb': 34, 'Gm': 31, 'A': 33}           # D2, Bb1, G1, A1
BAR_CHORD = ['Dm', 'Dm', 'Bb', 'Gm', 'A', 'Dm', 'Bb', 'Gm',
             'Dm', 'Bb', 'Gm', 'A', 'Dm', 'A', None, 'Dm']
# 2-bar bell hook, (step, midi, length in steps).  F4..F5, octave layer in drop B.
MOTIF = [(0, 74, 3), (3, 69, 3), (6, 65, 2), (8, 69, 3), (11, 74, 3), (14, 76, 2),
         (16, 77, 3), (19, 76, 3), (22, 74, 2), (24, 69, 3), (27, 70, 3), (30, 69, 2)]
# 808 bar patterns (step, len steps, interval above root, glide seconds; 0 = retrigger)
PAT = {
    'A': [(0, 6, 0, 0), (6, 3, 0, 0), (10, 1, 0, 0), (11, 3, 0, 0), (14, 2, 12, 0)],
    'B': [(0, 6, 0, 0), (6, 2, 0, 0), (8, 2, 7, 0.06), (10, 2, 0, 0.07), (12, 3, 0, 0), (15, 1, 12, 0)],
    'F': [(0, 6, 0, 0), (6, 3, 0, 0), (10, 2, 0, 0), (12, 1, 12, 0), (13, 3, 0, 0.16)],
}
PAT_DROP_A = {1: 'A', 2: 'B', 3: 'F', 4: 'B', 5: 'F', 6: 'B'}
PAT_DROP_B = {8: 'A', 9: 'B', 10: 'A', 11: 'B', 12: 'A', 13: 'F'}
FILL_BARS_A = [3, 5]          # fills end at 7.5 and 11.25
FILL_BARS_B = [13]            # fill into the staccato bar


def bass_events(pmap):
    ev, kicks = [], []
    for b, p in pmap.items():
        r = ROOT[BAR_CHORD[b]]
        for (s_, ln, iv, gl) in PAT[p]:
            t = st(b, s_)
            ev.append((t, ln * STEP, r + iv, gl))
            if gl == 0 and iv == 0:
                kicks.append(t)
    return ev, kicks


def hat_pattern(variant):
    """returns list of (step, velocity, pitch)"""
    base = [(s_, 0.92 if s_ % 4 == 0 else 0.66, 1.0) for s_ in range(0, 16, 2)]
    if variant == 1:
        base += [(13, 0.45, 1.0), (15, 0.5, 1.06)] + [(14 + k * 0.5, 0.42 + 0.08 * k, 1.12) for k in range(1, 4)]
    elif variant == 2:
        base = [h for h in base if h[0] not in (4, 6)]
        base += [(4 + k * 4 / 6, 0.5 + 0.05 * k, 1.06) for k in range(6)]
    elif variant == 3:
        base += [(10 + k * 0.5, 0.35 + 0.1 * k, 1.0 + 0.06 * k) for k in range(1, 4)] + [(15, 0.5, 1.0)]
    elif variant == 'fill':
        base = [h for h in base if h[0] < 12] + [(12 + k * 0.5, 0.4 + 0.07 * k, 1.0 + 0.035 * k) for k in range(8)]
    return base


def motif_events(bar0, octave=0):
    return [(st(bar0, s_), m + octave, ln * STEP) for (s_, m, ln) in MOTIF]


# ============================================================================= mix engine
class Mix:
    BUSES = ('kick', 'bass', 'snare', 'hats', 'perc', 'pad', 'bell', 'stab', 'fx')

    def __init__(self, name, t0, t1, pre=1.0, tail=2.6):
        self.name = name
        self.a = max(0, smp(t0 - pre))
        self.b = min(N, smp(t1 + tail))
        self.n = self.b - self.a
        self.bus = {k: np.zeros((2, self.n)) for k in self.BUSES}
        self.verb = np.zeros((2, self.n))
        self.dly = np.zeros(self.n)
        self.rng = np.random.default_rng(SEED + zlib.crc32(name.encode()) % 100000)

    def place(self, bus, sig, t, gain=1.0, pan=0.0, verb=0.0, dly=0.0):
        sig = np.asarray(sig, dtype=float)
        s2 = pan2(sig, pan) if sig.ndim == 1 else sig
        i = smp(t) - self.a
        j0, j1 = max(0, i), min(self.n, i + s2.shape[1])
        if j1 <= j0:
            return
        seg = s2[:, j0 - i:j1 - i] * gain
        self.bus[bus][:, j0:j1] += seg
        if verb:
            self.verb[:, j0:j1] += seg * verb
        if dly:
            self.dly[j0:j1] += seg.mean(axis=0) * dly

    def t(self):
        return (self.a + np.arange(self.n)) / SR

    def render(self, duck, cfg):
        d = duck[self.a:self.b]
        drums = self.bus['kick'] + self.bus['snare'] + self.bus['hats'] + self.bus['perc']
        drums, _ = compress(drums, thr=cfg.get('drum_thr', -6.0), ratio=3.0, att=0.009, rel=0.11, knee=6)
        drums = softsat(drums * 0.9, 1.25) / 0.9
        bass = self.bus['bass']
        music = (self.bus['pad'] * (1 - cfg.get('duck_pad', 0.6) * d)
                 + self.bus['bell'] * (1 - cfg.get('duck_bell', 0.25) * d)
                 + self.bus['stab'])
        # width: M/S on the music bus, no side below 160 Hz
        mid = 0.5 * (music[0] + music[1])
        side = hp(0.5 * (music[0] - music[1]), 160, 2) * cfg.get('width', 1.25)
        music = np.vstack([mid + side, mid - side])
        air = cfg.get('air_db', 0.0)
        if air:                                   # section-level top-end lift (drop B opens up)
            drums = eq(drums, 'highshelf', 7000, air)
            music = eq(music, 'highshelf', 7000, air)
        wet = reverb(self.verb, cfg.get('ir', IR)) * (1 - cfg.get('duck_verb', 0.5) * d)
        dl = pingpong(self.dly) * (1 - 0.35 * d)
        self.stems = {'drums': drums, 'bass': bass, 'music': music, 'fx': self.bus['fx'], 'verb': wet + dl}
        # subsonic HP per group, BEFORE the arrangement gates: done on the master bus it rang past
        # every gate (a 55 Hz 808 cut at its crest left -18 dBFS of 22 Hz ringing after stab 4)
        return hp(drums + bass + music + self.bus['fx'] + wet + dl, 22, 2)


def seal(mx, out, w, gain_db=0.0):
    """apply the group's arrangement window (and level) to its output and stems"""
    w = w * db2a(gain_db)
    mx.last_out = out * w
    mx.stems = {k: v * w for k, v in mx.stems.items()}


def window(n_abs0, n, pts):
    tt = (n_abs0 + np.arange(n)) / SR
    ts, gs = zip(*pts)
    return np.interp(tt, ts, gs)


def duck_curve(times, att=0.003, rel=0.2):
    d = np.zeros(N)
    shape = np.concatenate([np.linspace(0, 1, smp(att), endpoint=False), (1 - np.linspace(0, 1, smp(rel))) ** 2])
    for t in times:
        i = smp(t)
        j = min(N, i + len(shape))
        d[i:j] = np.maximum(d[i:j], shape[:j - i])
    return d


# ============================================================================= sections
LV = dict(kick=0.62, b808=0.61, snare=1.0, hat=0.42, ohat=0.25, rim=0.24, knock=0.21, shaker=0.10,
          pad=0.34, bell=0.30, bell_oct=0.19, impact=0.60, crack=0.30, crash=0.13, riser=0.30)

SNARES = [[0, 1, 2], [3, 4, 5]]          # sample variants (A, B)
_SN = {}


def sn(i):
    if i not in _SN:
        _SN[i] = snare_clap(i, tail=0.085 if i < 3 else 0.1)
    return _SN[i]


def pitch_shift(x, ratio):
    x = stereo(x)
    n = int(x.shape[1] / ratio)
    src = np.arange(n) * ratio
    return np.vstack([np.interp(src, np.arange(x.shape[1]), x[c]) for c in range(2)])


def pad_part(mx, chords, cutoff_fn, gain, att=0.08, rel=0.3, detune=0.14, verb=0.25):
    """chords: list of (t0, t1, notes). cutoff_fn(t_abs) -> Hz"""
    buf = np.zeros((2, mx.n))
    for (t0, t1, notes) in chords:
        i0 = smp(t0) - mx.a
        hold = smp(t1 - t0)
        L = min(hold + smp(rel), mx.n - i0)
        tt = np.arange(L) / SR
        env = np.clip(tt / att, 0, 1) ** 2
        if hold < L:
            env[hold:] *= np.cos(np.clip(np.arange(L - hold) / smp(rel), 0, 1) * np.pi / 2) ** 2
        sig = np.zeros((2, L))
        for m in notes:
            sig += supersaw(m, L, detune, rng=mx.rng)
        buf[:, i0:i0 + L] += sig * env / len(notes)
    fc = cutoff_fn(mx.t())
    buf = tv_filter(buf, fc, 'lp', 0.8)
    buf = tv_filter(buf, fc * 1.0, 'lp', 0.6)
    buf = hp(buf, 165, 2)
    mx.place('pad', buf, mx.a / SR, gain, verb=verb)


def drums_bar(mx, b, variant, snare_set, ghost=False, fill=False, extra=False, hat_gain=1.0,
              fill_steps=(12, 13, 14, 14.5, 15, 15.5)):
    r = mx.rng
    # snare / clap on beat 3 (half time)
    k = snare_set[r.integers(0, 3)]
    mx.place('snare', sn(k), st(b, 8), LV['snare'], verb=0.20)
    if extra:      # drop B: stacked wide clap 7 ms late
        mx.place('snare', sn(snare_set[(k + 1) % 3]), st(b, 8) + 0.007, LV['snare'] * 0.45, verb=0.25)
    hp_ = hat_pattern('fill' if fill else variant)
    for (s_, v, p) in hp_:
        if extra and s_ in (6, 14):
            continue
        dec = 0.03 if v > 0.6 else 0.022
        mx.place('hats', hat(dec, p, int(s_ * 2)), st(b, s_), LV['hat'] * v * hat_gain * r.uniform(0.93, 1.05),
                 pan=0.18 + 0.05 * np.sin(s_), verb=0.04)
    if fill:
        nf = len(fill_steps)
        for j, s_ in enumerate(fill_steps):
            v = 0.32 + 0.55 * j / max(1, nf - 1)
            mx.place('snare', pitch_shift(sn(snare_set[j % 3]), 1.0 + 0.04 * j), st(b, s_),
                     LV['snare'] * v, pan=(-0.2 if j % 2 else 0.2), verb=0.22)
    if extra:
        for s_ in (6, 14):
            mx.place('hats', hat(0.21, 0.97, 7), st(b, s_), LV['ohat'], pan=-0.25, verb=0.08)
        for s_ in (3, 11):
            mx.place('perc', rim(int(s_)), st(b, s_), LV['rim'] * r.uniform(0.85, 1.0), pan=-0.35, verb=0.12)
        if b % 2 == 1:
            mx.place('perc', knock(), st(b, 13), LV['knock'], pan=0.4, verb=0.15)
        for s_ in range(16):
            mx.place('perc', shaker(s_ % 4), st(b, s_), LV['shaker'] * (0.55 if s_ % 2 == 0 else 1.0),
                     pan=0.55 if s_ % 2 else -0.55)


def bells(mx, bar0, octave=0, gain=0.3, bright=1.0, verb=0.22, dly=0.16, cut_after=None, filt=None, width=0.0):
    for i, (t, m, ln) in enumerate(motif_events(bar0, octave)):
        if cut_after is not None and t >= cut_after:
            continue
        x = bell_note(m, ln * 0.88, i + 31 * octave + bar0, bright=bright)
        if filt:
            x = lp(hp(x, filt[0]), filt[1])
        x = hp(x, 220, 2)
        if width:
            x = np.vstack([x[0] * (1 + width), x[1] * (1 - width)]) if i % 2 else np.vstack([x[0] * (1 - width), x[1] * (1 + width)])
        mx.place('bell', x, t, gain, verb=verb, dly=dly)


# ----------------------------------------------------------------------------- render all sections
def build():
    groups = []
    info = {'kicks': [], 'snares': [], 'bell_notes': [], 'fills': [], 'accents': [], 'risers': [], 'heartbeats': []}

    _, kA = bass_events(PAT_DROP_A)
    _, kB = bass_events(PAT_DROP_B)
    duck = duck_curve(kA + kB + [T_END] + STABS)

    # ---------------- bar 1 : hook intro -----------------------------------------------------
    mx = Mix('intro', 0.0, BAR, pre=0.0, tail=0.3)
    pad_part(mx, [(0.0, BAR, CHORD['Dm'])], lambda t: 520 * (2600 / 520) ** np.clip(t / GAP0, 0, 1),
             LV['pad'] * 1.05, att=0.02, rel=0.1, verb=0.35)
    n_in = smp(GAP0)
    tin = np.arange(n_in) / SR
    sw = (tin / GAP0) ** 1.5
    drone = (0.8 * np.sin(2 * np.pi * float(hz(38)) * tin)
             + tv_filter(saw_blep(np.full(n_in, float(hz(38)))), 140 + 260 * sw, 'lp', 0.9) * 0.6)
    drone *= (0.35 + 0.65 * sw) * (1 - np.exp(-tin / 0.01))
    mx.place('bass', fade(softsat(drone, 1.4), 0, 0.002), 0.0, 0.16)
    for s_ in range(15):                                          # 1/16 ticking, rising
        u = s_ / 14
        mx.place('hats', hat(0.014 + 0.01 * u, 1.18 - 0.1 * u, s_), st(0, s_),
                 LV['hat'] * (0.16 + 0.32 * u ** 1.4), pan=0.25 * np.sin(s_ * 1.3), verb=0.08)
    for s_ in (12.5, 13.5, 14.5):
        mx.place('hats', hat(0.014, 1.2, int(s_)), st(0, s_), LV['hat'] * 0.4, pan=-0.2, verb=0.08)
    bells(mx, 0, 0, gain=LV['bell'] * 0.8, bright=0.7, verb=0.45, dly=0.25, cut_after=GAP0, filt=(420, 1600))
    rr = reverse_swell(1.62, [74, 77, 81], seed=1)
    nr = noise_riser(1.62, 260, 9000, 1.3, seed=2, curve=2.6, tone=(65, 86), tone_gain=0.18)
    riser = norm_peak(0.65 * rr + 0.6 * nr)
    mx.place('fx', riser, GAP0 - 1.62, LV['riser'] * 1.25)
    out = mx.render(duck, dict(width=1.0))
    seal(mx, out, window(mx.a, mx.n, [(0, 1), (GAP0 - 0.005, 1), (GAP0, 0), (DUR, 0)]), 3.0)
    groups.append(mx)
    info['risers'].append([GAP0 - 1.62, GAP0])

    # ---------------- bars 2-7 : DROP A ------------------------------------------------------
    mx = Mix('dropA', T_DROP_A, T_BREAK, pre=0.0)
    evA, kicksA = bass_events(PAT_DROP_A)
    mx.place('bass', render_808(evA, mx.a, mx.n, drive=2.0, grit=0.42, gap=0.014, rel=0.012, post_sus=0.72), mx.a / SR, LV['b808'])
    for t in kicksA:
        mx.place('kick', kick_punch(0), t, LV['kick'])
    info['kicks'] += kicksA
    mx.place('fx', boom(2.4, 146.8, 36.7, 0.25, 0.8, 1.8), T_DROP_A, LV['impact'])
    mx.place('fx', crack(0.8, 1), T_DROP_A, LV['crack'], verb=0.5)
    mx.place('fx', crash(2.0, 1), T_DROP_A, LV['crash'] * 1.9, verb=0.3)
    variants = {1: 0, 2: 1, 3: 2, 4: 3, 5: 0, 6: 1}
    for b in range(1, 7):
        drums_bar(mx, b, variants[b], SNARES[0], fill=b in FILL_BARS_A)
        info['snares'].append(st(b, 8))
    for b in FILL_BARS_A:
        info['fills'].append([st(b, 12), st(b + 1, 0)])
        mx.place('fx', crash(1.6, 2 + b, 0.45), st(b + 1, 0), LV['crash'], verb=0.25)
        mx.place('fx', reverse_swell(BEAT, [69, 74], seed=10 + b), st(b + 1, 0) - BEAT, LV['riser'] * 0.35)
        info['accents'].append(st(b + 1, 0))
    for p0 in (1, 3, 5):
        bells(mx, p0, 0, gain=LV['bell'])
        info['bell_notes'] += [round(t, 6) for (t, _, _) in motif_events(p0)]
    chordsA = [(st(b, 0), st(b + 1, 0), CHORD[BAR_CHORD[b]]) for b in range(1, 7)]
    pad_part(mx, chordsA, lambda t: 1700 * 2 ** (0.75 * np.sin(2 * np.pi * (t - T_DROP_A) / (4 * BAR) - 1.2)),
             LV['pad'] * 0.85, verb=0.22)
    out = mx.render(duck, dict(width=1.25))
    seal(mx, out, window(mx.a, mx.n, [(0, 1), (T_BREAK - 0.0025, 1), (T_BREAK, 0), (DUR, 0)]), -1.6)
    groups.append(mx)

    # ---------------- bar 8 : breakdown / rest -----------------------------------------------
    mx = Mix('rest', T_BREAK, T_DROP_B, pre=0.0, tail=0.5)
    mx.place('fx', lp(boom(1.4, 98, 34, 0.16, 0.32, 1.3), 220), T_BREAK, LV['impact'] * 0.22, verb=0.12)
    mx.place('fx', lp(crack(0.6, 5, 1200, 0.06), 900), T_BREAK, LV['crack'] * 0.25, verb=0.4)
    pad_part(mx, [(T_BREAK, T_DROP_B, CHORD['Gm'])],
             lambda t: 700 * (1150 / 700) ** np.clip((t - T_BREAK) / (T_DROP_B - T_BREAK), 0, 1), LV['pad'] * 0.30,
             att=0.25, rel=0.05, verb=0.35)
    for tb in (T_BREAK + BEAT, T_BREAK + 2 * BEAT):
        mx.place('bass', heartbeat(0.3, 50), tb, 0.12)
        mx.place('bass', heartbeat(0.3, 47), tb + 0.15, 0.08)
        info['heartbeats'] += [tb, round(tb + 0.15, 6)]
    rs = noise_riser(T_DROP_B - T_RISE, 700, 12000, 1.6, seed=7, curve=1.8, tone=(74, 86), tone_gain=0.22)
    rl = len(rs[0])
    for k in range(8):                                           # 1/32 snare roll inside the riser
        tt = T_RISE + BEAT * 0.5 + k * STEP / 2
        if tt < T_DROP_B - 0.01:
            mx.place('snare', pitch_shift(sn(k % 3), 1.0 + 0.05 * k), tt, LV['snare'] * (0.05 + 0.03 * k), verb=0.2)
    mx.place('fx', fade(rs, 0, 0.002), T_RISE, LV['riser'] * 0.6, verb=0.1)
    info['risers'].append([T_RISE, T_DROP_B])
    out = mx.render(duck, dict(width=1.2, duck_pad=0.0))
    seal(mx, out, window(mx.a, mx.n, [(0, 1), (T_DROP_B - 0.0015, 1), (T_DROP_B, 0), (DUR, 0)]))
    groups.append(mx)

    # ---------------- bars 9-14 : DROP B -----------------------------------------------------
    mx = Mix('dropB', T_DROP_B, T_STAB, pre=1.0)
    evB, kicksB = bass_events(PAT_DROP_B)
    mx.place('bass', render_808(evB, mx.a, mx.n, drive=2.4, grit=0.5, gap=0.014, rel=0.012, post_sus=0.72), mx.a / SR,
             LV['b808'] * 0.92)
    for t in kicksB:
        mx.place('kick', kick_punch(1, click=0.6), t, LV['kick'])
    info['kicks'] += kicksB
    dip = dict(DIPS[:2])
    for hb, sw in ((T_DROP_B, BEAT), (st(10, 0), 2 * BEAT), (st(12, 0), 2 * BEAT)):
        mx.place('fx', boom(2.3, 146.8, 36.7, 0.25, 0.75, 2.0), hb, LV['impact'] * 1.05)
        mx.place('fx', crack(0.8, int(hb)), hb, LV['crack'] * (1.1 if hb == T_DROP_B else 1.5), verb=0.55)
        mx.place('fx', crash(2.0, int(hb) + 1), hb, LV['crash'] * 1.7, verb=0.3)
        bar_ = int(round(hb / BAR))
        dl = dip.get(hb, 0.0)                      # swell peaks where the dropout starts
        mx.place('fx', reverse_swell(sw, CHORD[BAR_CHORD[bar_]] + [86], seed=bar_), hb - dl - sw,
                 LV['riser'] * (0.5 if hb == T_DROP_B else 0.85))
    variants = {8: 0, 9: 1, 10: 2, 11: 3, 12: 0, 13: 1}
    for b in range(8, 14):
        drums_bar(mx, b, variants[b], SNARES[1], fill=b in FILL_BARS_B, extra=True, hat_gain=1.12,
                  fill_steps=(12, 12.5, 13, 13.5, 14, 14.25, 14.5, 14.75))
        info['snares'].append(st(b, 8))
    for b in FILL_BARS_B:
        info['fills'].append([st(b, 12), st(b + 1, 0) - STEP])
        mx.place('fx', noise_riser(BEAT - STEP, 900, 12000, 1.6, seed=21, curve=2.0), st(b, 12), LV['riser'] * 0.6)
    for p0 in (8, 10, 12):
        bells(mx, p0, 0, gain=LV['bell'], bright=1.1)
        bells(mx, p0, 12, gain=LV['bell_oct'], bright=0.8, verb=0.35, dly=0.3, width=0.35)
        info['bell_notes'] += [round(t, 6) for (t, _, _) in motif_events(p0)]
    chordsB = [(st(b, 0), st(b + 1, 0), CHORD[BAR_CHORD[b]]) for b in range(8, 14)]
    pad_part(mx, chordsB, lambda t: 2300 * 2 ** (0.8 * np.sin(2 * np.pi * (t - T_DROP_B) / (4 * BAR) - 1.2)),
             LV['pad'] * 1.0, verb=0.25, detune=0.17)
    out = mx.render(duck, dict(width=1.35, drum_thr=-7.0, air_db=1.0))
    pts = [(0, 0), (T_DROP_B - 1.0, 0), (T_DROP_B - 0.95, 1)]
    for hb, dl in DIPS[:2]:                        # 5 ms close, silence, 0.5 ms open on the hit
        pts += [(hb - dl - 0.005, 1), (hb - dl, 0), (hb, 0), (hb + 0.0005, 1)]
    pts += [(T_STAB - STEP - 0.005, 1), (T_STAB - STEP, 0), (DUR, 0)]
    seal(mx, out, window(mx.a, mx.n, pts))
    # the reverse swell into 15.0 starts at 14.53, keep it (window opens before)
    groups.append(mx)

    # ---------------- bar 15 : staccato stabs ------------------------------------------------
    mx = Mix('stabs', T_STAB, T_END, pre=0.0, tail=0.3)
    stab_ch = [[65, 69, 74, 77], [65, 69, 74, 77], [65, 70, 74, 77], [69, 73, 76, 81]]
    stab_root = [38, 38, 34, 33]
    ev = []
    for k, t in enumerate(STABS):
        mx.place('stab', stab(stab_ch[k], STAB_LEN, k), t, 0.62, verb=0.35)
        mx.place('kick', kick_punch(2, click=0.7), t, LV['kick'])
        mx.place('snare', sn(3 + k % 3), t, LV['snare'] * 0.55, verb=0.3)
        mx.place('fx', crack(0.25, 40 + k, 8000, 0.03), t, LV['crack'] * 0.5)
        ev.append((t, STAB_LEN, stab_root[k], 0))
    mx.place('bass', render_808(ev, mx.a, mx.n, drive=2.2, grit=0.3, decay=0.6), mx.a / SR, LV['b808'] * 0.95)
    out = mx.render(duck, dict(width=1.3))
    pts = [(0, 0)]
    for t in STABS:
        pts += [(t - 1e-6, 0), (t, 1), (t + STAB_LEN, 1), (t + STAB_LEN + 0.004, 0)]
    pts += [(DUR, 0)]
    seal(mx, out, window(mx.a, mx.n, pts))
    groups.append(mx)

    # ---------------- bar 16 : final hit ------------------------------------------------------
    mx = Mix('end', T_END, DUR, pre=0.0, tail=0.0)
    mx.place('bass', render_808([(T_END, 1.1, 26, 0)], mx.a, mx.n, drive=2.4, grit=0.32, punch=24.0,
                                punch_tau=0.03, decay=0.6, rel=0.35), mx.a / SR, LV['b808'] * 1.05)
    mx.place('kick', kick_punch(3, f_hi=280, f_lo=42, tau_a=0.1, click=0.8), T_END, LV['kick'] * 1.1)
    mx.place('fx', boom(1.8, 110, 30, 0.3, 0.6, 1.6), T_END, LV['impact'] * 0.7)
    mx.place('fx', metal_hit(1.875, 4), T_END, 0.55, verb=1.1)
    mx.place('fx', crash(1.875, 9, 0.7), T_END, LV['crash'] * 1.5, verb=0.6)
    # tonal bloom: one struck Dm chord (D5 F5 A5 D6), bell + gated saw, almost all reverb, so the
    # long tail is audible on phone speakers instead of being only sub rumble
    for i, m in enumerate([74, 77, 81, 86]):
        mx.place('bell', hp(bell_note(m, 0.7, 950 + i, bright=0.9), 220, 2), T_END, 0.13, verb=1.0, dly=0.12)
    mx.place('stab', stab([74, 77, 81], 0.28, 9), T_END, 0.30, verb=1.2)
    out = mx.render(duck, dict(width=1.3, ir=IR_LONG, duck_bell=0.0, duck_verb=0.15))
    tt = (mx.a + np.arange(mx.n)) / SR
    u = np.clip((tt - 29.0) / (T_SILENT - 29.0), 0, 1)
    seal(mx, out, np.cos(u * np.pi / 2) ** 2)
    groups.append(mx)

    return groups, info


def assemble(groups):
    mix = np.zeros((2, N))
    stems = {}
    for g in groups:
        mix[:, g.a:g.b] += g.last_out
        for k, v in g.stems.items():
            stems.setdefault(k, np.zeros((2, N)))[:, g.a:g.b] += v
    return mix, stems


# ============================================================================= master
def master_bus(x):
    # sub mono below 120 Hz, gentle tilt, glue compression
    mid = 0.5 * (x[0] + x[1])
    side = hp(0.5 * (x[0] - x[1]), 120, 2)
    x = np.vstack([mid + side, mid - side])
    x = eq(x, 'peak', 320, -1.5, 0.9)          # de-mud (subsonic HP is per group, before the gates)
    x, gr = compress(x, thr=-14.0, ratio=1.8, att=0.03, rel=0.2, knee=8)
    return x, gr


def finalize(x, pre_db, ceiling=-1.25):
    y = x * db2a(pre_db)
    up = signal.resample_poly(y, 4, 1, axis=1)
    up = softclip(up, db2a(ceiling - 1.5), db2a(ceiling + 1.2))
    y = signal.resample_poly(up, 1, 4, axis=1)[:, :N]
    y, g = limiter(y, ceiling)
    for _ in range(4):                          # guarantee the true-peak ceiling
        tp = true_peak(y)
        if a2db(tp) <= ceiling + 0.05:
            break
        y, g2 = limiter(y, ceiling - (a2db(tp) - ceiling) - 0.05)
        g = g * g2
    return y, g


SILENCE = ([(GAP0, T_DROP_A)]
           + [(hb - dl, hb) for hb, dl in DIPS]
           + [(STABS[k] + STAB_LEN + 0.006, STABS[k + 1] if k < 3 else T_END) for k in range(4)]
           + [(T_SILENT, DUR)])


def mute_regions(y):
    """digital silence where the edit expects silence. The master-bus HP/EQ ring a few ms past the
    group gates (up to -19 dBFS after the last stab), so each mute is entered with a 1.5 ms
    raised-cosine fade instead of a hard step to zero (no click into the silence)."""
    y = y.copy()
    fl = smp(0.0015)
    ramp = np.cos(np.linspace(0, np.pi / 2, fl)) ** 2
    for a_, b_ in SILENCE:
        a, b = smp(a_), smp(b_)
        y[:, a - fl:a] *= ramp
        y[:, a:b] = 0.0
    return y


# ============================================================================= analysis
SECTIONS = [('intro_hook', 0.0, T_DROP_A), ('drop_a', T_DROP_A, T_BREAK), ('breakdown', T_BREAK, T_DROP_B),
            ('drop_b', T_DROP_B, T_STAB), ('staccato_hits', T_STAB, T_END), ('end', T_END, DUR)]
BANDS = [('sub', 20, 60), ('bass', 60, 150), ('lowmid', 150, 500), ('mid', 500, 2000),
         ('presence', 2000, 6000), ('brilliance', 6000, 12000), ('air', 12000, 20000)]
# rough relative-band targets (dB re total) for a modern dark trap master, with tolerances
BAND_TARGET = {'sub': (-4.5, 4), 'bass': (-4.5, 4), 'lowmid': (-11.5, 4.5), 'mid': (-14, 5),
               'presence': (-19, 5), 'brilliance': (-24, 6), 'air': (-32, 8)}


def rms_db(x):
    return float(a2db(np.sqrt(np.mean(stereo(x) ** 2) + 1e-20)))


def band_balance(x):
    m = stereo(x).mean(axis=0)
    if len(m) < 8192:
        return {}
    f, p = signal.welch(m, SR, nperseg=8192)
    tot = np.sum(p[(f >= 20) & (f <= 20000)])
    return {name: float(10 * np.log10(np.sum(p[(f >= lo) & (f < hi)]) / tot + 1e-20)) for name, lo, hi in BANDS}


def analyze(y, stems=None):
    res = {}
    res['lufs_integrated'] = round(lufs_integrated(y), 2)
    res['true_peak_dbtp'] = round(float(a2db(true_peak(y))), 2)
    res['sample_peak_dbfs'] = round(float(a2db(np.max(np.abs(y)))), 2)
    res['short_term_max_lufs'] = round(short_term_max(y), 2)
    res['clipped_samples'] = int(np.sum(np.abs(y) >= 0.999))
    res['samples'] = int(y.shape[1])
    hop = smp(0.5)
    res['rms_0p5s_dbfs'] = [round(rms_db(y[:, i:i + hop]), 1) for i in range(0, N, hop)]
    sec = {}
    for name, t0, t1 in SECTIONS:
        seg = y[:, smp(t0):smp(t1)]
        r = rms_db(seg)
        pk = float(a2db(np.max(np.abs(seg))))
        sec[name] = dict(rms_dbfs=round(r, 2), peak_dbfs=round(pk, 2), crest_db=round(pk - r, 2),
                         lufs_ungated=round(lufs_window(y, t0, t1), 2),
                         bands=({k: round(v, 1) for k, v in band_balance(seg).items()}))
    res['sections'] = sec
    rA, rB, rR = sec['drop_a']['rms_dbfs'], sec['drop_b']['rms_dbfs'], sec['breakdown']['rms_dbfs']
    res['breakdown_vs_drops_db'] = round(min(rA, rB) - rR, 2)
    res['drop_b_minus_drop_a_db'] = round(rB - rA, 2)
    res['gap_max_abs'] = float(np.max(np.abs(y[:, smp(GAP0):smp(T_DROP_A)])))
    res['between_stabs_max_abs'] = float(max(np.max(np.abs(y[:, smp(STABS[k] + STAB_LEN + 0.006):smp(STABS[k + 1]) if k < 3 else smp(T_END)])) for k in range(4)))
    res['after_29p9_max_abs'] = float(np.max(np.abs(y[:, smp(T_SILENT):])))
    res['dropouts_max_abs'] = float(max(np.max(np.abs(y[:, smp(hb - dl):smp(hb)])) for hb, dl in DIPS))
    # cut-point definition: RMS 10 ms after each hit minus RMS 10 ms before (dB)
    w = smp(0.01)
    res['hit_onset_jump_db'] = {f'{h:.7g}': round(rms_db(y[:, smp(h):smp(h) + w]) - max(rms_db(y[:, smp(h) - w:smp(h)]), -120.0), 1)
                                for h in HITS}
    # transient crest: peak vs 50 ms RMS around each kick/snare in the drops
    cr = []
    for t in np.arange(T_DROP_A, T_BREAK, BEAT * 2):
        seg = y[:, smp(t):smp(t + BEAT)]
        cr.append(float(a2db(np.max(np.abs(seg))) - rms_db(seg)))
    res['beat_crest_db_mean'] = round(float(np.mean(cr)), 2)
    # mono compatibility
    mono = 0.5 * (y[0] + y[1])
    res['mono_fold_loss_db'] = round(rms_db(y) - rms_db(mono), 2)
    res['lr_correlation'] = round(float(np.corrcoef(y[0], y[1])[0, 1]), 3)
    if stems is not None:
        res['stem_rms_drop_a_dbfs'] = {k: round(rms_db(v[:, smp(T_DROP_A):smp(T_BREAK)]), 1) for k, v in stems.items()}
        res['stem_rms_drop_b_dbfs'] = {k: round(rms_db(v[:, smp(T_DROP_B):smp(T_STAB)]), 1) for k, v in stems.items()}
        b8 = stems['bass'][:, smp(T_DROP_A):smp(T_BREAK)]
        res['phone_808_presence_db'] = round(rms_db(hp(b8, 250, 4)) - rms_db(b8), 1)
        res['stem_peak_drop_a_dbfs'] = {k: round(float(a2db(np.max(np.abs(v[:, smp(T_DROP_A + 0.5):smp(T_BREAK)])))), 1) for k, v in stems.items()}
    # listening-proxy flags
    flags = []
    for name in ('drop_a', 'drop_b'):
        for bnd, v in sec[name]['bands'].items():
            tgt, tol = BAND_TARGET[bnd]
            if abs(v - tgt) > tol:
                flags.append(f'{name}:{bnd} {v:+.1f} dB (target {tgt:+.1f}+-{tol})')
    if res['breakdown_vs_drops_db'] < 14:
        flags.append('breakdown not quiet enough')
    if rB - rA < 0.3:
        flags.append('drop B not louder than drop A')
    if res['true_peak_dbtp'] > -1.0:
        flags.append('true peak above -1 dBTP')
    if abs(res['lufs_integrated'] + 11) > 0.3:
        flags.append('integrated loudness off target')
    if res['gap_max_abs'] > 0 or res['between_stabs_max_abs'] > 0 or res['after_29p9_max_abs'] > 0 \
            or res['dropouts_max_abs'] > 0:
        flags.append('silence windows not silent')
    weak = [h for h, v in res['hit_onset_jump_db'].items() if float(h) != T_BREAK and v < 10]
    if weak:
        flags.append(f'cut points without a clear onset (<10 dB jump): {weak}')
    res['flags'] = flags
    return res


def spectrogram_png(y, path, res):
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    m = y.mean(axis=0)
    f, t, Z = signal.stft(m, SR, nperseg=4096, noverlap=4096 - 480)
    S = 20 * np.log10(np.abs(Z) + 1e-9)
    S -= S.max()
    fig, ax = plt.subplots(2, 1, figsize=(16, 9), gridspec_kw={'height_ratios': [3, 1]}, sharex=True)
    ax[0].pcolormesh(t, f, S, shading='auto', cmap='magma', vmin=-90, vmax=0)
    ax[0].set_yscale('symlog', linthresh=200)
    ax[0].set_ylim(20, 20000)
    ax[0].set_ylabel('Hz')
    ax[0].set_title(f"reel_music.wav  |  {res['lufs_integrated']} LUFS-I  |  {res['true_peak_dbtp']} dBTP")
    rms = res['rms_0p5s_dbfs']
    ax[1].bar(np.arange(len(rms)) * 0.5 + 0.25, np.array(rms) + 60, bottom=-60, width=0.45, color='#d0021b')
    ax[1].set_ylim(-60, 0)
    ax[1].set_ylabel('RMS dBFS /0.5 s')
    ax[1].set_xlabel('s')
    for a in ax:
        for name, t0, t1 in SECTIONS:
            a.axvline(t0, color='w' if a is ax[0] else 'k', lw=0.8, alpha=0.7)
        for h in HITS:
            a.axvline(h, color='#00e5ff' if a is ax[0] else '#555', lw=0.5, ls='--', alpha=0.6)
    for name, t0, t1 in SECTIONS:
        ax[0].text(t0 + 0.05, 15000, name, color='w', fontsize=8)
    plt.tight_layout()
    plt.savefig(path, dpi=110)
    plt.close(fig)


HITS = [T_DROP_A, T_BREAK, T_DROP_B, st(10, 0), st(12, 0)] + STABS + [T_END]


# ============================================================================= SFX kit
def sfx_kit():
    os.makedirs(SFX_DIR, exist_ok=True)
    r = np.random.default_rng(SEED + 5000)
    out = {}

    def finish(name, x, dur, verb=0.15, fout=0.015):
        n = smp(dur)
        x = stereo(x)
        x = np.pad(x, ((0, 0), (0, max(0, n - x.shape[1]))))[:, :n]
        wet = reverb(np.pad(x, ((0, 0), (0, smp(0.1)))))[:, :n]
        y = fade(x + verb * wet, 0.0005, fout)
        y = norm_peak(y, db2a(-6.0))
        sf.write(os.path.join(SFX_DIR, name), y.T, SR, subtype='PCM_24')
        out[name] = dict(dur=round(y.shape[1] / SR, 4), peak_dbfs=round(float(a2db(np.max(np.abs(y)))), 2),
                         true_peak_dbtp=round(float(a2db(true_peak(y))), 2))

    def whoosh(dur, f0, fpk, f1, peak_at, seed, pan_from=-0.8, pan_to=0.8, q=1.1):
        rr = np.random.default_rng(SEED + 5100 + seed)
        n = smp(dur)
        t = np.arange(n) / SR
        u = t / dur
        fc = np.where(u < peak_at, f0 * (fpk / f0) ** (u / peak_at), fpk * (f1 / fpk) ** ((u - peak_at) / (1 - peak_at)))
        env = np.where(u < peak_at, (u / peak_at) ** 2.2, np.exp(-(u - peak_at) / (1 - peak_at) * 4.0))
        x = np.zeros((2, n))
        for ch in range(2):
            nz = rr.standard_normal(n)
            x[ch] = tv_filter(nz, fc, 'bp', q) + 0.4 * tv_filter(rr.standard_normal(n), fc * 0.45, 'lp', 0.7)
        pan = pan_from + (pan_to - pan_from) * u
        th = (pan + 1) * np.pi / 4
        x = np.vstack([x[0] * np.cos(th), x[1] * np.sin(th)]) * np.sqrt(2) * env
        return hp(x, 140, 2)

    finish('whoosh_short.wav', whoosh(0.35, 380, 5200, 2400, 0.62, 1), 0.35, 0.12, 0.02)
    finish('whoosh_long.wav', whoosh(0.8, 220, 6500, 1800, 0.58, 2, -0.9, 0.9, 0.9), 0.8, 0.18, 0.05)

    n = smp(0.9)
    t = np.arange(n) / SR
    imp = stereo(boom(0.9, 120, 38, 0.12, 0.32, 1.9, 1000)) + 0.55 * kick_punch(5, 300, 45, 0.02, 0.06, 0.9, 0.9)[None, :n]
    # phone-audible layers: low-mid thump, louder crack and a short metallic ring (the sub-only
    # version measured 90 % below 100 Hz and 0 % above 2 kHz, i.e. silent on a phone speaker)
    rt = np.random.default_rng(SEED + 5050)
    thump = np.vstack([bp(rt.standard_normal(n), 140, 900, 2) for _ in range(2)]) * np.exp(-t / 0.05) * (1 - np.exp(-t / 0.0006))
    imp = imp + 1.0 * norm_peak(np.tanh(2.0 * thump)) + 1.8 * crack(0.9, 77, 6500, 0.04) + 0.35 * metal_hit(0.9, 7)
    finish('impact_hit.wav', imp, 0.9, 0.22, 0.12)

    # glitch: FM squelch grains, repeated with shrinking lengths + bit/sample-rate crush
    n = smp(0.12)
    t = np.arange(n) / SR
    src = np.sin(2 * np.pi * 1250 * t + 7 * np.sin(2 * np.pi * 1250 * 3.3 * t)) * 0.7 + 0.3 * r.standard_normal(n)
    g = np.zeros((2, n))
    pos, k = 0, 0
    lens = [0.016, 0.016, 0.009, 0.009, 0.006, 0.006, 0.004, 0.004, 0.003, 0.003, 0.002, 0.002, 0.012, 0.02]
    for L in lens:
        ln = smp(L)
        if pos + ln > n:
            break
        grain = src[smp(0.004 * (k % 3)): smp(0.004 * (k % 3)) + ln]
        hold = [1, 2, 4, 8][k % 4]
        grain = np.repeat(grain[::hold], hold)[:ln]
        grain = np.round(grain * [64, 16, 8, 32][k % 4]) / [64, 16, 8, 32][k % 4]
        grain = grain * np.clip(np.minimum(np.arange(ln), ln - np.arange(ln)) / 12.0, 0, 1)
        p = [-0.8, 0.8, -0.3, 0.5][k % 4]
        g[:, pos:pos + ln] += pan2(grain * (1 if k % 5 else 0.6), p)
        pos += ln
        k += 1
    finish('glitch.wav', hp(g, 200, 2), 0.12, 0.08, 0.004)

    def tick_one(pitch=1.0, seed=0, bright=1.0):
        rr = np.random.default_rng(SEED + 5200 + seed)
        n = smp(0.05)
        t = np.arange(n) / SR
        y = np.zeros(n)
        for f, tau, a in ((3150, 0.006, 1.0), (4720, 0.004, 0.6), (6930, 0.003, 0.4 * bright), (9410, 0.0018, 0.25 * bright)):
            y += a * np.sin(2 * np.pi * f * pitch * t) * np.exp(-t / tau)
        y += hp(rr.standard_normal(n), 6000) * np.exp(-t / 0.0008) * 0.5
        return y * (1 - np.exp(-t / 0.0002))

    finish('tick.wav', pan2(tick_one(), 0.0), 0.05, 0.10, 0.01)

    n = smp(0.6)
    roll = np.zeros((2, n))
    tt, k = 0.0, 0
    while tt < 0.56:
        tk = tick_one(0.92 + 0.12 * tt / 0.56, k, 0.7 + 0.3 * (k % 2))
        i = smp(tt)
        j = min(n, i + len(tk))
        roll[:, i:j] += pan2(tk[:j - i] * (0.55 + 0.25 * (k % 2) + 0.2 * tt / 0.56), 0.15 * np.sin(k))
        tt += 0.03 - 0.012 * (tt / 0.56)
        k += 1
    tk = tick_one(1.12, 99, 1.3)
    i = smp(0.555)
    roll[:, i:i + len(tk)] += pan2(tk[:n - i], 0.0) * 1.2
    finish('counter_roll.wav', roll, 0.6, 0.10, 0.012)

    rs = noise_riser(0.5, 600, 11000, 1.5, seed=55, curve=2.0, tone=(74, 86), tone_gain=0.3)
    finish('riser_short.wav', fade(rs, 0, 0.003), 0.5, 0.18, 0.003)
    return out


# ============================================================================= main
def beats_json(info):
    def r6(v):
        # snap to the sample the render actually uses, so every time maps back to an exact sample
        # (1/32 boundaries fall on half samples: 18.69140625 s = sample 897187.5 -> 897188)
        return round(smp(float(v)) / SR, 9)
    d = {
        'bpm': BPM, 'beat': BEAT, 'bar': BAR, 'sr': SR, 'duration': DUR, 'samples': N, 'key': 'D minor',
        'downbeats': [r6(i * BAR) for i in range(16)],
        'sections': [{'name': n, 't0': r6(a), 't1': r6(b)} for n, a, b in SECTIONS],
        'hits': [r6(h) for h in HITS],
        'hit_kinds': {r6(T_DROP_A): 'drop_impact', r6(T_BREAK): 'low_impact', r6(T_DROP_B): 'cinematic_impact',
                      r6(st(10, 0)): 'cinematic_impact', r6(st(12, 0)): 'cinematic_impact',
                      **{r6(t): f'stab_{k + 1}' for k, t in enumerate(STABS)}, r6(T_END): 'final_hit'},
        'gap': [r6(GAP0), r6(T_DROP_A)],
        'silence': [[r6(a), r6(b)] for a, b in sorted(SILENCE)],
        'dropouts': [[r6(hb - dl), r6(hb)] for hb, dl in DIPS],
        'stabs': [r6(t) for t in STABS], 'stab_len': STAB_LEN,
        'accents': [r6(t) for t in info['accents']],
        'fills': [[r6(a), r6(b)] for a, b in info['fills']],
        'risers': [[r6(a), r6(b)] for a, b in info['risers']],
        'kicks': sorted(r6(t) for t in set(info['kicks'])),
        'snares': sorted(r6(t) for t in info['snares']),
        'bell_notes': sorted(set(r6(t) for t in info['bell_notes'])),
        'heartbeats': [r6(t) for t in info['heartbeats']],
        'beats': [r6(i * BEAT) for i in range(64)],
    }
    with open(os.path.join(OUT, 'reel_beats.json'), 'w') as f:
        json.dump(d, f, indent=1)
    return d


def main():
    groups, info = build()
    mix, stems = assemble(groups)
    t1 = time.time()
    print(f'[render] arrangement built in {t1 - T_START:.1f} s')
    # gain staging: drops sit at -17 dBFS RMS going into the master bus
    drops = np.concatenate([mix[:, smp(T_DROP_A):smp(T_BREAK)], mix[:, smp(T_DROP_B):smp(T_STAB)]], axis=1)
    stage = -17.0 - rms_db(drops)
    mix *= db2a(stage)
    stems = {k: v * db2a(stage) for k, v in stems.items()}
    pre_peak = float(a2db(np.max(np.abs(mix))))
    mb, comp_gr = master_bus(mix)
    target = -11.0
    pre = -8.0
    for it in range(8):
        y, lg = finalize(mb, pre)
        y = mute_regions(y)
        L = lufs_integrated(y)
        print(f'[master] iter {it}: pre {pre:+.2f} dB -> {L:.2f} LUFS, limiter GR max {a2db(lg.min()):.1f} dB')
        if abs(L - target) < 0.04:
            break
        pre += (target - L) * (1.0 if it < 3 else 0.8)
    assert y.shape == (2, N)
    sf.write(os.path.join(OUT, 'reel_music.wav'), y.T, SR, subtype='PCM_24')
    # re-read the file so measurements are of what is on disk (24-bit)
    yd, sr = sf.read(os.path.join(OUT, 'reel_music.wav'), always_2d=True)
    yd = yd.T
    assert sr == SR and yd.shape[1] == N
    res = analyze(yd, stems)
    res['pre_master_peak_dbfs'] = round(pre_peak, 2)
    res['master_comp_gr_max_db'] = round(float(comp_gr.max()), 2)
    res['master_comp_gr_mean_drops_db'] = round(float(np.mean(np.concatenate([comp_gr[smp(T_DROP_A):smp(T_BREAK)], comp_gr[smp(T_DROP_B):smp(T_STAB)]]))), 2)
    res['limiter_gr_max_db'] = round(float(a2db(lg.min())), 2)
    res['limiter_gr_mean_db_drops'] = round(float(np.mean(a2db(np.concatenate(
        [lg[smp(T_DROP_A):smp(T_BREAK)], lg[smp(T_DROP_B):smp(T_STAB)]])))), 2)
    beats_json(info)
    spectrogram_png(yd, os.path.join(OUT, 'reel_music_spectrogram.png'), res)
    res['sfx'] = sfx_kit()
    with open(os.path.join(OUT, 'reel_music_analysis.json'), 'w') as f:
        json.dump(res, f, indent=1)
    # ---- report
    print(f"\nIntegrated loudness : {res['lufs_integrated']} LUFS  (target -11)")
    print(f"True peak           : {res['true_peak_dbtp']} dBTP (ceiling -1.0) | sample peak {res['sample_peak_dbfs']} dBFS")
    print(f"Short-term max      : {res['short_term_max_lufs']} LUFS | clipped samples {res['clipped_samples']}")
    print(f"Limiter GR max/mean : {res['limiter_gr_max_db']} / {res['limiter_gr_mean_db_drops']} dB | bus comp GR max {res['master_comp_gr_max_db']} dB")
    print(f"Breakdown vs drops  : {res['breakdown_vs_drops_db']} dB quieter | drop B - drop A {res['drop_b_minus_drop_a_db']} dB")
    print(f"Silence checks      : gap {res['gap_max_abs']:.2e}, between stabs {res['between_stabs_max_abs']:.2e}, after 29.9 {res['after_29p9_max_abs']:.2e}")
    print(f"Beat crest (drops)  : {res['beat_crest_db_mean']} dB | L/R corr {res['lr_correlation']} | mono fold loss {res['mono_fold_loss_db']} dB")
    print('\nSection            RMS     peak   crest  LUFS(ungated) | ' + ' '.join(f'{b[0]:>9}' for b in BANDS))
    for name, v in res['sections'].items():
        bands = ' '.join(f"{v['bands'].get(b[0], float('nan')):9.1f}" for b in BANDS)
        print(f"{name:16s} {v['rms_dbfs']:6.1f} {v['peak_dbfs']:7.1f} {v['crest_db']:6.1f} {v['lufs_ungated']:9.1f}     | {bands}")
    print('\nStem RMS drop A:', res['stem_rms_drop_a_dbfs'])
    print('Stem RMS drop B:', res['stem_rms_drop_b_dbfs'])
    print('Stem peak drop A:', res['stem_peak_drop_a_dbfs'], '| 808 energy above 250 Hz:', res['phone_808_presence_db'], 'dB')
    print('pre-master peak', res['pre_master_peak_dbfs'], '| master comp GR mean in drops', res['master_comp_gr_mean_drops_db'])
    print('\nRMS per 0.5 s (dBFS):')
    r = res['rms_0p5s_dbfs']
    for i in range(0, len(r), 10):
        print(f'  {i * 0.5:5.1f}s ' + ' '.join(f'{v:6.1f}' for v in r[i:i + 10]))
    print('\nSFX:', json.dumps(res['sfx']))
    print('\nFLAGS:', res['flags'] if res['flags'] else 'none')
    print(f'\n[done] {time.time() - T_START:.1f} s')


if __name__ == '__main__':
    main()
