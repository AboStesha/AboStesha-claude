#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Axi Select - explainer background music bed (Track 2)
=====================================================

Fully synthesized from code (numpy / scipy / soundfile only, no samples).
Deterministic: fixed RNG seed.

  * 330.000 s, 48 kHz, 24-bit stereo WAV
  * 100 BPM (beat 0.6 s, bar 2.4 s), D minor / F major
  * Built to sit UNDER an Arabic narrator:
      - no lead melody, pitched material voiced C4+ (arp / bells F4+)
      - nothing between ~120 and ~170 Hz except the sub's harmonics
      - static -3.5 dB master dip across 1-4 kHz (speech intelligibility band)
      - gentle -1.5 dB dip around 220-480 Hz (narrator chest)
  * Sections evolve every 8 bars (19.2 s) with a soft lift (reverse swell,
    noise air riser, filter / level swell, kick drop) into each new section.
  * Resolved ending (C sus -> F add9) in the last 12 s, fading to digital
    silence at exactly 330.0 s.
  * Mastered to about -20 LUFS integrated, true peak <= -3 dBTP.

Outputs (next to this script):
  bed_music.wav, bed_sections.json, bed_music_spectrogram.png,
  bed_music_rms_0p5s.csv
"""
import json
import math
import os
import sys
import time

import numpy as np
import scipy.fft as sfft
import soundfile as sf
from scipy import signal
from scipy.ndimage import minimum_filter1d, uniform_filter1d

T_START = time.time()


def log(*a):
    print(f"[{time.time() - T_START:6.1f}s]", *a, flush=True)


HERE = os.path.dirname(os.path.abspath(__file__))
OUT_WAV = os.path.join(HERE, "bed_music.wav")
OUT_JSON = os.path.join(HERE, "bed_sections.json")
OUT_PNG = os.path.join(HERE, "bed_music_spectrogram.png")
OUT_RMS = os.path.join(HERE, "bed_music_rms_0p5s.csv")

# --------------------------------------------------------------------------
# Global constants
# --------------------------------------------------------------------------
SR = 48000
DUR = 330.0
N = int(round(DUR * SR))            # 15,840,000 samples
PSR = 24000                         # pad render rate (pads are low-passed < 6k)
NP = int(round(DUR * PSR))
BPM = 100.0
BEAT = 60.0 / BPM                   # 0.6 s
BAR = 4 * BEAT                      # 2.4 s
STEP = BEAT / 4                     # 16th = 0.15 s
SEC = 8 * BAR                       # 19.2 s
CR = 200.0                          # control rate for automation
NC = int(round(DUR * CR)) + 1
TC = np.arange(NC) / CR

TARGET_LUFS = -20.0
TP_CEIL_DB = -3.3                   # limiter ceiling (spec: <= -3.0 dBTP)

SEED = 20261020
rng = np.random.default_rng(SEED)

T48 = np.arange(N) / SR
T24 = np.arange(NP) / PSR


def db(x):
    return 10.0 ** (np.asarray(x, dtype=float) / 20.0)


def mtof(m):
    return 440.0 * 2.0 ** ((m - 69) / 12.0)


def cos_ramp(x):
    x = np.clip(x, 0.0, 1.0)
    return 0.5 - 0.5 * np.cos(np.pi * x)


def pan_gains(p):
    a = (np.clip(p, -1, 1) + 1.0) * np.pi / 4.0
    return np.cos(a), np.sin(a)


def add_at(buf, start, sig):
    """Add sig into buf starting at sample index start (clipped)."""
    n = buf.shape[0]
    if start >= n:
        return
    s0 = max(start, 0)
    off = s0 - start
    e = min(n, start + sig.shape[0])
    if e <= s0:
        return
    buf[s0:e] += sig[off:off + (e - s0)]


def c2a(ctrl, t=T48):
    """Control-rate curve -> audio-rate curve."""
    return np.interp(t, TC, ctrl)


def sos(kind, fc, order=2, sr=SR):
    return signal.butter(order, fc, btype=kind, fs=sr, output="sos")


def rms(x):
    return float(np.sqrt(np.mean(np.square(x)) + 1e-30))


# --------------------------------------------------------------------------
# Harmony & arrangement
# --------------------------------------------------------------------------
# pad voicings start at C4 to keep the narrator's 120-260 Hz region clear;
# arp tones F4..A5 ; sub root in 55..100 Hz.
CHORDS = {
    "Dm9":    dict(root=38, pad=[62, 65, 69, 72, 76, 81], arp=[65, 69, 72, 74, 76, 81]),
    "Bbmaj9": dict(root=34, pad=[62, 65, 70, 72, 77, 81], arp=[65, 69, 70, 72, 74, 77]),
    "Fadd9":  dict(root=41, pad=[60, 65, 67, 69, 72, 77], arp=[65, 67, 69, 72, 77, 79]),
    "C69":    dict(root=36, pad=[60, 64, 67, 69, 74, 76], arp=[67, 69, 72, 74, 76, 79]),
    "Gm9":    dict(root=43, pad=[62, 65, 67, 70, 74, 81], arp=[65, 67, 70, 74, 77, 79]),
    "Csus4":  dict(root=36, pad=[60, 65, 67, 72, 74, 79], arp=[65, 67, 72, 74, 77, 79]),
    "Fend":   dict(root=41, pad=[60, 65, 67, 69, 72, 77, 81], arp=[65, 69, 72, 77, 81, 84]),
}

PROGS = {
    "A": ["Dm9", "Bbmaj9", "Fadd9", "C69"],     # i  VI  III VII
    "B": ["Bbmaj9", "Fadd9", "C69", "Dm9"],
    "C": ["Fadd9", "C69", "Dm9", "Bbmaj9"],     # I  V   vi  IV (F major)
    "D": ["Dm9", "Gm9", "Bbmaj9", "C69"],
}

# label, energy (0..1), progression, arp pattern, kick pattern, shaker level,
# pad brightness, shimmer level, bells, air level
PLAN = [
    dict(label="intro",     e=0.22, prog="A", arp=None,    kick=None, shk=0, bright=0.14, shim=0.40, bells="start",  air=1.00),
    dict(label="pulse",     e=0.36, prog="A", arp="p8",    kick="K1", shk=0, bright=0.22, shim=0.30, bells=None,     air=0.70),
    dict(label="motion",    e=0.46, prog="A", arp="p16a",  kick="K1", shk=1, bright=0.30, shim=0.35, bells=None,     air=0.70),
    dict(label="open",      e=0.52, prog="B", arp="p16a",  kick="K1", shk=1, bright=0.40, shim=0.45, bells="start",  air=0.75),
    dict(label="lift",      e=0.58, prog="C", arp="p16b",  kick="K2", shk=1, bright=0.47, shim=0.45, bells=None,     air=0.80),
    dict(label="glow",      e=0.63, prog="C", arp="p16b",  kick="K2", shk=2, bright=0.55, shim=0.55, bells="sparse", air=0.80),
    dict(label="breathe",   e=0.42, prog="A", arp="p8",    kick=None, shk=1, bright=0.36, shim=0.70, bells="start",  air=1.00),
    dict(label="rebuild",   e=0.55, prog="D", arp="p16a",  kick="K1", shk=1, bright=0.45, shim=0.50, bells=None,     air=0.75),
    dict(label="drive",     e=0.66, prog="C", arp="p16c",  kick="K3", shk=2, bright=0.58, shim=0.50, bells=None,     air=0.80),
    dict(label="horizon",   e=0.70, prog="D", arp="p16c",  kick="K3", shk=2, bright=0.63, shim=0.60, bells="start",  air=0.85),
    dict(label="focus",     e=0.54, prog="A", arp="p16a",  kick="K1", shk=1, bright=0.45, shim=0.45, bells=None,     air=0.75),
    dict(label="climb",     e=0.64, prog="B", arp="p16b",  kick="K2", shk=2, bright=0.56, shim=0.55, bells="sparse", air=0.80),
    dict(label="summit",    e=0.74, prog="C", arp="p16c",  kick="K3", shk=2, bright=0.68, shim=0.70, bells=None,     air=0.90),
    dict(label="summit-ii", e=0.78, prog="C", arp="p16c",  kick="K3", shk=2, bright=0.74, shim=0.80, bells="start",  air=0.95),
    dict(label="settle",    e=0.60, prog="A", arp="p16a",  kick="K2", shk=1, bright=0.52, shim=0.60, bells=None,     air=0.80),
    dict(label="land",      e=0.48, prog="B", arp="p8",    kick="K1", shk=1, bright=0.40, shim=0.60, bells=None,     air=0.80),
    dict(label="outro",     e=0.34, prog="E", arp="p8out", kick=None, shk=0, bright=0.30, shim=0.65, bells=None,     air=0.90),
    dict(label="ending",    e=0.18, prog="F", arp=None,    kick=None, shk=0, bright=0.26, shim=0.90, bells="final",  air=0.80),
]
NSEC = len(PLAN)
SEC_T0 = [k * SEC for k in range(17)] + [318.0]
SEC_T1 = SEC_T0[1:] + [DUR]
E = [p["e"] for p in PLAN]


def chord_events():
    ev = []
    for k, p in enumerate(PLAN):
        t0 = SEC_T0[k]
        if p["prog"] in PROGS:
            for i, c in enumerate(PROGS[p["prog"]]):
                ev.append((c, t0 + i * 2 * BAR, t0 + (i + 1) * 2 * BAR))
        elif p["prog"] == "E":
            ev.append(("Bbmaj9", 307.2, 312.0))
            ev.append(("Csus4", 312.0, 318.0))
        elif p["prog"] == "F":
            ev.append(("Fend", 318.0, DUR))
    return ev


CHORD_EV = chord_events()


def chord_at(t):
    for c, a, b in CHORD_EV:
        if a <= t < b:
            return c
    return CHORD_EV[-1][0]


def section_of(t):
    for k in range(NSEC):
        if SEC_T0[k] <= t < SEC_T1[k]:
            return k
    return NSEC - 1


def section_curve(values, rise_pre=BAR, fall_post=1.2):
    """Piecewise section values; rises anticipate the boundary (a lift),
    falls settle just after it."""
    y = np.full(NC, float(values[0]))
    for k in range(1, NSEC):
        T = SEC_T0[k]
        v0, v1 = float(values[k - 1]), float(values[k])
        if v1 >= v0:
            a, b = T - rise_pre, T
        else:
            a, b = T, T + fall_post
        w = cos_ramp((TC - a) / (b - a))
        m = TC >= a
        y[m] = (v0 + (v1 - v0) * w)[m]
    return y


LIFT_S = [0.0] + [float(np.clip(0.55 + 2.0 * max(0.0, E[k] - E[k - 1]), 0.45, 1.0))
                  for k in range(1, NSEC)]


def lift_bump(pre=BAR, post=0.9):
    y = np.zeros(NC)
    for k in range(1, NSEC):
        T = SEC_T0[k]
        s = LIFT_S[k]
        m = (TC >= T - pre) & (TC < T)
        x = (TC[m] - (T - pre)) / pre
        y[m] = np.maximum(y[m], s * x ** 2.2)
        m2 = (TC >= T) & (TC < T + 5 * post)
        y[m2] = np.maximum(y[m2], s * np.exp(-(TC[m2] - T) / post))
    return y


LIFT = lift_bump()

# slow, non-repeating modulators (periods not related to the 8-bar grid)
LFO_A = 0.5 * np.sin(2 * np.pi * TC / 37.3 + 0.7) + 0.5 * np.sin(2 * np.pi * TC / 14.4 + 2.1)
LFO_B = np.sin(2 * np.pi * TC / 23.9 + 1.3)
LFO_C = np.sin(2 * np.pi * TC / (13 * BAR) + 0.4)


# --------------------------------------------------------------------------
# DSP building blocks
# --------------------------------------------------------------------------
def rbj(kind, fc, q, sr):
    w0 = 2.0 * math.pi * fc / sr
    cw, sw = math.cos(w0), math.sin(w0)
    al = sw / (2.0 * q)
    if kind == "lp":
        b = ((1 - cw) / 2, 1 - cw, (1 - cw) / 2)
    elif kind == "hp":
        b = ((1 + cw) / 2, -(1 + cw), (1 + cw) / 2)
    else:  # band-pass, 0 dB peak
        b = (al, 0.0, -al)
    a0 = 1 + al
    return (np.array(b) / a0, np.array((1.0, -2 * cw / a0, (1 - al) / a0)))


def tv_filter(x, kind, fc_blocks, qs, sr, block):
    """Block-varying cascaded biquad (state carried across blocks)."""
    sq = x.ndim == 1
    if sq:
        x = x[:, None]
    n, ch = x.shape
    y = np.empty_like(x)
    zis = [np.zeros((2, ch)) for _ in qs]
    nb = (n + block - 1) // block
    for i in range(nb):
        s, e = i * block, min(n, (i + 1) * block)
        seg = x[s:e]
        fc = min(max(float(fc_blocks[min(i, len(fc_blocks) - 1)]), 20.0), 0.45 * sr)
        for j, q in enumerate(qs):
            b, a = rbj(kind, fc, q, sr)
            seg, zis[j] = signal.lfilter(b, a, seg, axis=0, zi=zis[j])
        y[s:e] = seg
    return y[:, 0] if sq else y


def saw_blep(phase, dt):
    t = phase % 1.0
    y = 2.0 * t - 1.0
    m1 = t < dt
    x = t[m1] / dt
    y[m1] -= x + x - x * x - 1.0
    m2 = t > 1.0 - dt
    x = (t[m2] - 1.0) / dt
    y[m2] -= x * x + x + x + 1.0
    return y


def make_ir(seconds, t60s, sr, seed, predelay=0.018, er_taps=12, xcorr=0.18):
    """Synthetic stereo hall IR: band-wise exponential decays of decorrelated
    noise + early reflections. Unit energy per channel."""
    r = np.random.default_rng(seed)
    L = int(seconds * sr)
    t = np.arange(L) / sr
    edges = [280.0, 1600.0, 5200.0]
    ir = np.zeros((L, 2))
    sos_lo = sos("lowpass", edges[0], 4, sr)
    sos_m1 = sos("bandpass", [edges[0], edges[1]], 3, sr)
    sos_m2 = sos("bandpass", [edges[1], edges[2]], 3, sr)
    sos_hi = sos("highpass", edges[2], 4, sr)
    for ch in range(2):
        nz = r.standard_normal(L)
        acc = np.zeros(L)
        for sfilt, t60 in zip((sos_lo, sos_m1, sos_m2, sos_hi), t60s):
            acc += signal.sosfiltfilt(sfilt, nz) * np.exp(-6.9078 * t / t60)
        acc *= 1.0 - np.exp(-t / 0.022)          # diffuse build-up
        # early reflections
        for _ in range(er_taps):
            d = r.uniform(0.006, 0.075)
            i = int(d * sr)
            acc[i] += r.choice([-1, 1]) * r.uniform(0.25, 0.6) * math.exp(-d / 0.05) * 6.0
        acc = np.concatenate([np.zeros(int(predelay * sr)), acc])[:L]
        ir[:, ch] = acc
    ir = np.stack([ir[:, 0] + xcorr * ir[:, 1], ir[:, 1] + xcorr * ir[:, 0]], axis=1)
    ir = signal.sosfilt(sos("lowpass", 9500, 2, sr), ir, axis=0)
    ir /= np.sqrt(np.sum(ir ** 2, axis=0, keepdims=True))
    fade = int(0.25 * sr)
    ir[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 2
    return ir


def convolve_stereo(x, ir):
    out = np.zeros_like(x)
    for c in range(2):
        out[:, c] = signal.oaconvolve(x[:, c], ir[:, c], mode="full")[:x.shape[0]]
    return out


# --------------------------------------------------------------------------
# Instruments
# --------------------------------------------------------------------------
def render_pads():
    """Supersaw + sine-body pad at 24 kHz, with slow 24 dB/oct filter motion.
    Returns (pad, shimmer) at 48 kHz stereo (pre-automation)."""
    pad = np.zeros((NP, 2))
    shim = np.zeros((NP, 2))
    NV = 5
    DET = 11.0  # cents spread
    r = np.random.default_rng(SEED + 1)
    for ci, (name, t0, t1) in enumerate(CHORD_EV):
        ch = CHORDS[name]
        first = ci == 0
        final = name == "Fend"
        att = 3.0 if first else (0.7 if final else 0.42)
        rel = 1.5 if not final else 0.5
        start = max(0.0, t0 - (0.0 if first else 0.03))
        end = min(DUR, t1 + rel)
        L = int(round((end - start) * PSR))
        tt = np.arange(L) / PSR
        hold = t1 - start
        env = cos_ramp(tt / att)
        if not final:
            rm = tt > hold
            env[rm] *= cos_ramp(1.0 - (tt[rm] - hold) / rel)
        else:
            env *= np.exp(-np.maximum(0.0, tt - 1.5) / 7.5)
        accL = np.zeros(L)
        accR = np.zeros(L)
        sL = np.zeros(L)
        sR = np.zeros(L)
        notes = ch["pad"]
        for ni, m in enumerate(notes):
            f = mtof(m)
            ng = 1.0 if ni < len(notes) - 1 else 0.85
            for v in range(NV):
                d = (v - (NV - 1) / 2) / ((NV - 1) / 2)          # -1..1
                fv = f * 2 ** (d * DET / 1200.0)
                drift = 1.0 + 0.0011 * np.sin(2 * np.pi * r.uniform(0.07, 0.19) * tt + r.uniform(0, 6.28))
                ph = r.random() + np.cumsum(fv * drift) / PSR
                s = saw_blep(ph, fv / PSR) * ng
                gl, gr = pan_gains(0.85 * d * (1 if (ni % 2 == 0) else -1))
                accL += s * gl
                accR += s * gr
            # sine body (centre-ish, gives warmth without buzz)
            phs = r.random() + np.cumsum(np.full(L, f)) / PSR
            body = 0.9 * np.sin(2 * np.pi * phs) * ng
            gl, gr = pan_gains(r.uniform(-0.25, 0.25))
            accL += body * gl
            accR += body * gr
        # shimmer: top three voicing notes one octave up, soft sines w/ tremolo
        for m in notes[-3:]:
            f = mtof(m + 12)
            ph = r.random() + np.cumsum(np.full(L, f)) / PSR
            trem = 0.6 + 0.4 * np.sin(2 * np.pi * r.uniform(0.18, 0.45) * tt + r.uniform(0, 6.28))
            s = (np.sin(2 * np.pi * ph) + 0.12 * np.sin(4 * np.pi * ph)) * trem
            gl, gr = pan_gains(r.uniform(-0.7, 0.7))
            sL += s * gl
            sR += s * gr
        i0 = int(round(start * PSR))
        add_at(pad, i0, np.stack([accL * env, accR * env], axis=1))
        senv = cos_ramp(tt / max(att, 1.6)) * env
        add_at(shim, i0, np.stack([sL * senv, sR * senv], axis=1))
    log("pads: oscillators done")

    # slow filter motion (24 dB/oct), cutoff from section brightness + LFOs + lifts
    bright = section_curve([p["bright"] for p in PLAN], rise_pre=BAR * 2, fall_post=2.4)
    fc_ctrl = 650.0 * 2 ** (bright * 2.6) * (1 + 0.18 * LFO_A) * (1 + 0.55 * LIFT)
    # ending: close the filter slowly
    fc_ctrl *= np.where(TC > 318.0, np.exp(-np.maximum(0, TC - 320.0) / 9.0), 1.0)
    block = 128
    tb = (np.arange((NP + block - 1) // block) * block + block / 2) / PSR
    fcb = np.interp(tb, TC, fc_ctrl)
    pad = tv_filter(pad, "lp", fcb, [0.54, 1.0], PSR, block)
    pad = signal.sosfilt(sos("highpass", 170, 2, PSR), pad, axis=0)
    shim = signal.sosfilt(sos("highpass", 600, 2, PSR), shim, axis=0)
    shim = signal.sosfilt(sos("lowpass", 5000, 2, PSR), shim, axis=0)
    log("pads: filtered")
    pad = signal.resample_poly(pad, 2, 1, axis=0)[:N]
    shim = signal.resample_poly(shim, 2, 1, axis=0)[:N]
    return pad, shim


def render_sub():
    """Continuous warm sub with glides between roots, light saturation."""
    lf = np.zeros(NC)
    for name, t0, t1 in CHORD_EV:
        lf[TC >= t0 - 0.06] = math.log2(mtof(CHORDS[name]["root"]))
    lf = uniform_filter1d(lf, size=int(0.16 * CR), mode="nearest")    # 160 ms glide
    f = 2.0 ** c2a(lf)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + 0.16 * np.sin(2 * ph + 0.4) + 0.05 * np.sin(3 * ph + 1.1)
    x = np.tanh(1.7 * x) / np.tanh(1.7)
    x = signal.sosfilt(sos("lowpass", 210, 2), x)
    x = signal.sosfilt(sos("highpass", 30, 2), x)
    # chord-change breath: tiny dip & re-swell at each change
    br = np.ones(NC)
    for name, t0, t1 in CHORD_EV:
        m = (TC >= t0) & (TC < t0 + 0.9)
        br[m] = 0.86 + 0.14 * cos_ramp((TC[m] - t0) / 0.9)
    return x * c2a(br)


ARP_PATTERNS = {
    "p8":    ([0, None, 2, None, 1, None, 3, None, 0, None, 2, None, 1, None, 4, None], 0.26),
    "p8out": ([0, None, 2, None, 1, None, 3, None, 0, None, 2, None, 1, None, 4, None], 0.22),
    "p16a":  ([0, 2, 4, 2, 1, 3, 5, 3, 0, 2, 4, 2, 1, 3, 4, 1], 0.12),
    "p16b":  ([0, 2, None, 4, 1, None, 3, 5, None, 2, 4, None, 3, 1, None, 4], 0.12),
    "p16c":  ([0, 1, 2, 3, 4, 5, 4, 3, 1, 2, 3, 4, 5, 4, 3, 2,
               0, 2, 1, 3, 2, 4, 3, 5, 4, 3, 2, 1, 2, 3, 4, 5], 0.11),
}

_ARP_CACHE = {}


def arp_note(midi, bq, vq, dq, var):
    key = (midi, bq, vq, dq, var)
    if key in _ARP_CACHE:
        return _ARP_CACHE[key]
    bright = bq / 20.0
    vel = vq / 8.0
    dur = dq / 100.0
    r = np.random.default_rng(hash(key) & 0xFFFFFFFF)
    f0 = mtof(midi)
    L = int((dur + 0.32) * SR)
    t = np.arange(L) / SR
    tau = 0.10 + 0.55 * dur
    env = (1.0 - np.exp(-t / 0.0018)) * np.exp(-t / tau)
    off = t > dur
    env[off] *= np.clip(1.0 - (t[off] - dur) / 0.07, 0, 1) ** 2
    fc = f0 * (1.35 + 4.2 * bright) * (1.0 + (0.5 + 0.9 * vel) * np.exp(-t / 0.055))
    Q = 1.15
    out = np.zeros(L)
    dets = (2 ** (-4.0 / 1200), 2 ** (4.5 / 1200))
    Kmax = int(14500 / f0)
    for k in range(1, Kmax + 1):
        rr = (k * f0) / fc
        H = 1.0 / np.sqrt((1 - rr * rr) ** 2 + (rr / Q) ** 2)
        H = H ** 1.5
        a = H / k
        if k > 3 and a.max() < 2e-4:
            break
        if k % 2 == 1:
            a = a * 1.25     # a touch of square: hollow, analog
        for d in dets:
            out += a * np.sin(2 * np.pi * k * f0 * d * t + r.uniform(0, 2 * np.pi))
    out *= env * vel
    _ARP_CACHE[key] = out
    return out


def render_arp():
    arp = np.zeros((N, 2))
    bright_c = section_curve([p["bright"] for p in PLAN], rise_pre=BAR * 2, fall_post=2.4)
    nnotes = 0
    r = np.random.default_rng(SEED + 2)
    for k, p in enumerate(PLAN):
        if p["arp"] is None:
            continue
        pat, gate = ARP_PATTERNS[p["arp"]]
        t0, t1 = SEC_T0[k], SEC_T1[k]
        if p["arp"] == "p8out":
            t1 = 316.8
        nsteps = int(round((t1 - t0) / STEP))
        for s in range(nsteps):
            t = t0 + s * STEP
            # pattern index relative to the chord (2 bars = 32 steps)
            cstart = None
            for c, a, b in CHORD_EV:
                if a <= t + 1e-6 < b:
                    cstart = a
                    cname = c
                    break
            ls = int(round((t - cstart) / STEP))
            idx = pat[ls % len(pat)]
            if idx is None:
                continue
            tones = CHORDS[cname]["arp"]
            midi = tones[idx % len(tones)]
            pos = s % 16
            vel = 1.0 if pos % 4 == 0 else (0.80 if pos % 2 == 0 else 0.64)
            vel *= r.uniform(0.92, 1.0)
            ci = int(round(t * CR))
            b = bright_c[ci] + 0.07 * LFO_C[ci] + 0.16 * LIFT[ci]
            if p["arp"] == "p8out":
                fade = cos_ramp(1.0 - (t - 307.2) / 9.6)
                vel *= 0.25 + 0.75 * fade
                b *= 0.55 + 0.45 * fade
            bq = int(np.clip(round(b * 20), 0, 20))
            vq = int(np.clip(round(vel * 8), 1, 8))
            dq = int(round(gate * 100))
            note = arp_note(midi, bq, vq, dq, int(r.integers(0, 2)))
            pn = 0.28 * math.sin(2 * math.pi * s / 11.3) + 0.06 * r.uniform(-1, 1)
            gl, gr = pan_gains(pn)
            add_at(arp, int(round(t * SR)), np.stack([note * gl, note * gr], axis=1))
            nnotes += 1
    log(f"arp: {nnotes} notes, {len(_ARP_CACHE)} unique renders")
    arp = signal.sosfilt(sos("highpass", 220, 2), arp, axis=0)
    return arp


def pingpong(x, delay_s, fb, taps, lp=3800.0, hp=380.0):
    mono = 0.5 * (x[:, 0] + x[:, 1])
    D = int(round(delay_s * SR))
    out = np.zeros_like(x)
    y = signal.sosfilt(sos("highpass", hp, 1), mono)
    slp = sos("lowpass", lp, 1)
    for i in range(1, taps + 1):
        y = signal.sosfilt(slp, y)
        g = fb ** (i - 1)
        ch = (i - 1) % 2
        sh = D * i
        out[sh:, ch] += g * y[:N - sh]
    return out


def make_kick(r):
    L = int(0.48 * SR)
    t = np.arange(L) / SR
    f = 47.0 + 92.0 * np.exp(-t / 0.030) + 30.0 * np.exp(-t / 0.005)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * (1 - np.exp(-t / 0.0007)) * (0.72 * np.exp(-t / 0.15) + 0.28 * np.exp(-t / 0.34))
    nz = signal.sosfilt(sos("bandpass", [600, 2600], 2), r.standard_normal(L)) * np.exp(-t / 0.0035)
    knock = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.011)
    y = body + 0.22 * nz + 0.16 * knock
    y = np.tanh(1.5 * y) / np.tanh(1.5)
    y = signal.sosfilt(sos("lowpass", 1700, 2), y)     # muted
    y[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))
    return y / np.max(np.abs(y))


def make_shaker(r):
    L = int(0.13 * SR)
    t = np.arange(L) / SR
    nz = r.standard_normal(L)
    nz = signal.sosfilt(sos("highpass", 5600, 4), nz)
    nz = signal.sosfilt(sos("lowpass", 13500, 2), nz)
    beads = 1.0 + 0.8 * (r.random(L) < 0.03)
    beads = signal.sosfilt(sos("lowpass", 900, 1), beads)
    env = (1 - np.exp(-t / 0.0045)) * np.exp(-t / 0.030)
    y = nz * env * (0.6 + beads)
    y[-int(0.01 * SR):] *= np.linspace(1, 0, int(0.01 * SR))
    return y / np.max(np.abs(y))


KICK_PATTERNS = {
    "K1": {0: 1.0, 8: 0.80},
    "K2": {0: 1.0, 8: 0.80, 10: 0.48},
    "K3": {0: 1.0, 4: 0.60, 8: 0.86, 12: 0.60},
}


def render_drums():
    r = np.random.default_rng(SEED + 3)
    kicks = [make_kick(r) for _ in range(4)]
    shakers = [make_shaker(r) for _ in range(8)]
    kick = np.zeros(N)
    shk = np.zeros((N, 2))
    ktimes = []
    for k, p in enumerate(PLAN):
        t0, t1 = SEC_T0[k], SEC_T1[k]
        nbars = int(round((t1 - t0) / BAR))
        nxt_rise = k + 1 < NSEC and E[k + 1] > E[k] and PLAN[k + 1]["kick"] is not None
        kscale = float(db(-1.5 + 5.0 * (p["e"] - 0.6)))
        sscale = float(db(-2.0 + 6.0 * (p["e"] - 0.6)))
        if p["kick"]:
            pat = dict(KICK_PATTERNS[p["kick"]])
            for b in range(nbars):
                last = b == nbars - 1
                steps = dict(pat)
                if last and nxt_rise:
                    steps = {s: v for s, v in steps.items() if s < 8}
                elif last and p["kick"] in ("K2", "K3"):
                    steps[14] = 0.42
                for s, v in sorted(steps.items()):
                    t = t0 + b * BAR + s * STEP
                    vel = v * kscale * r.uniform(0.95, 1.0)
                    add_at(kick, int(round(t * SR)), kicks[int(r.integers(0, 4))] * vel)
                    ktimes.append((t, v * r.uniform(0.95, 1.0)))
        if p["shk"]:
            for b in range(nbars):
                for s in range(16):
                    if p["shk"] == 1 and s % 2 == 1:
                        continue
                    if p["shk"] == 1:
                        v = 1.0 if s % 4 == 2 else 0.5
                    else:
                        v = [0.48, 0.30, 0.95, 0.36][s % 4]
                    if p["label"] == "breathe":
                        v *= 0.7
                    t = t0 + b * BAR + s * STEP + r.normal(0, 0.0035)
                    # crescendo into rising boundaries
                    if b == nbars - 1 and k + 1 < NSEC and E[k + 1] > E[k]:
                        v *= 0.85 + 0.35 * (s / 15.0)
                    vel = v * sscale * r.uniform(0.85, 1.0)
                    sh = shakers[int(r.integers(0, 8))] * vel
                    pnv = 0.22 if (s // 2) % 2 else -0.12
                    gl, gr = pan_gains(pnv + r.uniform(-0.05, 0.05))
                    add_at(shk, int(round(t * SR)), np.stack([sh * gl, sh * gr], axis=1))
    return kick, shk, ktimes


def sidechain_env(ktimes, depth):
    L = int(0.36 * SR)
    t = np.arange(L) / SR
    shape = np.where(t < 0.006, t / 0.006,
                     np.where(t < 0.03, 1.0, cos_ramp(1.0 - (t - 0.03) / 0.30)))
    acc = np.zeros(N)
    for tk, v in ktimes:
        add_at(acc, int(round(tk * SR)) - int(0.002 * SR), shape * v)
    return 1.0 - depth * np.minimum(acc, 1.0)


def fm_bell(f, vel, length, r):
    L = int(length * SR)
    t = np.arange(L) / SR
    I1 = 1.5 * np.exp(-t / 0.8) + 0.12
    I2 = 2.0 * np.exp(-t / 0.07)
    p1 = r.uniform(0, 6.28)
    car1 = np.sin(2 * np.pi * f * t + I1 * np.sin(2 * np.pi * 2.0 * f * t + p1))
    car2 = np.sin(2 * np.pi * f * t + I2 * np.sin(2 * np.pi * 3.5 * f * t))
    part = np.sin(2 * np.pi * 2.756 * f * t + p1)
    a = (1 - np.exp(-t / 0.0015))
    y = a * (0.8 * car1 * np.exp(-t / 1.5) + 0.32 * car2 * np.exp(-t / 0.10)
             + 0.10 * part * np.exp(-t / 0.45))
    y[-int(0.05 * SR):] *= np.linspace(1, 0, int(0.05 * SR))
    return y * vel


def render_bells():
    r = np.random.default_rng(SEED + 4)
    out = np.zeros((N, 2))
    events = []
    for k, p in enumerate(PLAN):
        t0 = SEC_T0[k]
        if p["bells"] == "start":
            c = chord_at(t0 + 0.01)
            tones = CHORDS[c]["arp"]
            ts = t0 + (0.3 if k == 0 else 0.0)
            events.append((ts, tones[-1] + 12 if tones[-1] + 12 <= 93 else tones[-1], 0.55))
            events.append((ts + 3 * BEAT, tones[-3] + 12, 0.32))
        elif p["bells"] == "sparse":
            for b in range(1, 8, 2):
                t = t0 + b * BAR + 6 * STEP
                c = chord_at(t)
                tones = CHORDS[c]["arp"]
                events.append((t, tones[int(r.integers(2, 6))] + 12, r.uniform(0.25, 0.36)))
        elif p["bells"] == "final":
            for i, m in enumerate([77, 81, 84]):
                events.append((318.0 + 0.045 * i, m, 0.5 - 0.06 * i))
            events.append((318.0 + 2 * BEAT, 89, 0.26))
            events.append((318.0 + 2 * BAR, 84, 0.18))
    for t, m, v in events:
        y = fm_bell(mtof(m), v, 4.5, r)
        gl, gr = pan_gains(r.uniform(-0.55, 0.55))
        add_at(out, int(round(t * SR)), np.stack([y * gl, y * gr], axis=1))
    out = signal.sosfilt(sos("highpass", 450, 2), out, axis=0)
    return out, len(events)


def render_air():
    r = np.random.default_rng(SEED + 5)
    nz = r.standard_normal((N, 2))
    nz = signal.sosfilt(sos("bandpass", [4800, 12500], 2), nz, axis=0)
    am = 0.72 + 0.28 * np.sin(2 * np.pi * TC / (5.3 * BAR) + 0.3) * (0.6 + 0.4 * LFO_B)
    lvl = db(section_curve([20 * math.log10(max(p["air"], 1e-3)) for p in PLAN], BAR * 2, 2.4))
    lvl = lvl * db(5.0 * LIFT) * am
    return nz * c2a(lvl)[:, None]


def render_lifts(ir_long):
    """Reverse-reverb swells + noise air risers into each section, soft impacts."""
    r = np.random.default_rng(SEED + 6)
    sw = np.zeros((N, 2))
    imp = np.zeros(N)
    wash = np.zeros((N, 2))
    for k in range(1, NSEC):
        T = SEC_T0[k]
        s = LIFT_S[k]
        nxt = chord_at(T + 0.01)
        # --- reverse swell: soft stab of the NEXT chord through a long IR, reversed
        Ls = int(0.35 * SR)
        ts = np.arange(Ls) / SR
        stab = np.zeros(Ls)
        for m in CHORDS[nxt]["arp"][1:5]:
            f = mtof(m)
            for h in range(1, 6):
                stab += np.sin(2 * np.pi * f * h * ts + r.uniform(0, 6.28)) / h ** 1.6
        stab *= np.exp(-ts / 0.09) * (1 - np.exp(-ts / 0.002))
        wet = np.stack([signal.oaconvolve(stab, ir_long[:, c]) for c in range(2)], axis=1)
        Lw = int(2.6 * SR)
        wet = wet[:Lw]
        rev = wet[::-1].copy()
        rev *= cos_ramp(np.arange(Lw) / (0.9 * SR))[:, None]
        rev[-int(0.025 * SR):] *= np.linspace(1, 0, int(0.025 * SR))[:, None]
        rev /= np.max(np.abs(rev)) + 1e-12
        add_at(sw, int(round((T - 0.015) * SR)) - Lw, rev * s)
        # --- noise air riser (band-pass sweep 500 Hz -> 7 kHz over one bar)
        Lr = int(BAR * SR)
        x = r.standard_normal((Lr, 2))
        tr = np.arange(Lr) / Lr
        blk = 256
        tb = (np.arange((Lr + blk - 1) // blk) * blk + blk / 2) / Lr
        fcb = 500.0 * (14.0 ** (tb ** 1.4))
        x = tv_filter(x, "bp", fcb, [0.9], SR, blk)
        x *= (tr ** 2.6)[:, None]
        x[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))[:, None]
        x /= np.max(np.abs(x)) + 1e-12
        add_at(sw, int(round((T - 0.01) * SR)) - Lr, 0.55 * x * s)
        # --- soft impact on rising boundaries (and the final landing)
        de = E[k] - E[k - 1]
        if de >= 0.05 or k == NSEC - 1:
            Li = int(2.4 * SR)
            ti = np.arange(Li) / SR
            f = 34.0 + 30.0 * np.exp(-ti / 0.10)
            ph = 2 * np.pi * np.cumsum(f) / SR
            boom = np.sin(ph) * np.exp(-ti / 0.65) * (1 - np.exp(-ti / 0.004))
            st = min(1.0, 0.45 + 3.0 * max(de, 0.08)) * (0.7 if k == NSEC - 1 else 1.0)
            add_at(imp, int(round(T * SR)), boom * st)
            nz = signal.sosfilt(sos("bandpass", [300, 2400], 2), r.standard_normal((Li, 2)), axis=0)
            nz *= (np.exp(-ti / 0.35) * (1 - np.exp(-ti / 0.01)))[:, None]
            add_at(wash, int(round(T * SR)), nz * 0.5 * st)
    imp = signal.sosfilt(sos("lowpass", 140, 2), imp)
    sw = signal.sosfilt(sos("highpass", 260, 2), sw, axis=0)
    return sw, imp, wash


# --------------------------------------------------------------------------
# Measurement (ITU-R BS.1770-4 / EBU R128)
# --------------------------------------------------------------------------
def k_weight(x, sr=SR):
    assert sr == 48000
    b1 = [1.53512485958697, -2.69169618940638, 1.19839281085285]
    a1 = [1.0, -1.69065929318241, 0.73248077421585]
    b2 = [1.0, -2.0, 1.0]
    a2 = [1.0, -1.99004745483398, 0.99007225036621]
    y = signal.lfilter(b1, a1, x, axis=0)
    return signal.lfilter(b2, a2, y, axis=0)


def _block_power(kw, win, hop):
    p = np.square(kw).sum(axis=1)
    cs = np.concatenate([[0.0], np.cumsum(p)])
    W, H = int(win * SR), int(hop * SR)
    st = np.arange(0, len(p) - W + 1, H)
    return (cs[st + W] - cs[st]) / W, st


def integrated_lufs(x, kw=None):
    kw = k_weight(x) if kw is None else kw
    z, _ = _block_power(kw, 0.4, 0.1)
    l = -0.691 + 10 * np.log10(z + 1e-30)
    g1 = l > -70.0
    if not np.any(g1):
        return -np.inf
    rel = -0.691 + 10 * np.log10(np.mean(z[g1])) - 10.0
    g2 = g1 & (l > rel)
    return -0.691 + 10 * np.log10(np.mean(z[g2]))


def loudness_range(kw):
    z, _ = _block_power(kw, 3.0, 0.1)
    l = -0.691 + 10 * np.log10(z + 1e-30)
    g1 = l > -70.0
    rel = -0.691 + 10 * np.log10(np.mean(z[g1])) - 20.0
    v = l[g1 & (l > rel)]
    return float(np.percentile(v, 95) - np.percentile(v, 10))


def oversampled_peak_env(x, os_=4, chunk=480000, pad=2048):
    """Per-sample max |x| over 4x oversampled points in [n, n+1), all channels."""
    n = x.shape[0]
    env = np.zeros(n)
    for s in range(0, n, chunk):
        e = min(n, s + chunk)
        a, b = max(0, s - pad), min(n, e + pad)
        up = signal.resample_poly(x[a:b], os_, 1, axis=0)
        o = (s - a) * os_
        seg = np.abs(up[o:o + (e - s) * os_]).max(axis=1)
        env[s:e] = seg.reshape(e - s, os_).max(axis=1)
    return env


def true_peak_db(x):
    return 20 * math.log10(float(oversampled_peak_env(x).max()) + 1e-30)


# --------------------------------------------------------------------------
# Master processing
# --------------------------------------------------------------------------
def master_eq_curve(f):
    lf = np.log2(np.maximum(f, 1.0))

    def band(lo0, lo1, hi0, hi1):
        w = np.zeros_like(lf)
        a0, a1, b0, b1 = map(math.log2, (lo0, lo1, hi0, hi1))
        w = np.where((lf >= a1) & (lf <= b0), 1.0, w)
        m = (lf > a0) & (lf < a1)
        w[m] = cos_ramp((lf[m] - a0) / (a1 - a0))
        m = (lf > b0) & (lf < b1)
        w[m] = cos_ramp(1 - (lf[m] - b0) / (b1 - b0))
        return w

    g = -3.5 * band(780, 1150, 3700, 5200)          # speech intelligibility dip
    g += -1.5 * band(170, 230, 460, 650)             # narrator chest / mud
    g += 1.0 * band(7500, 11000, 30000, 40000)       # a breath of air
    return g


def fft_eq(x, curve_fn):
    pad = SR
    n = x.shape[0] + 2 * pad
    nfft = sfft.next_fast_len(n, real=True)
    g = db(curve_fn(np.fft.rfftfreq(nfft, 1.0 / SR)))
    out = np.empty_like(x)
    for c in range(x.shape[1]):
        buf = np.zeros(nfft)
        buf[pad:pad + x.shape[0]] = x[:, c]
        X = sfft.rfft(buf, workers=4)
        X *= g
        out[:, c] = sfft.irfft(X, nfft, workers=4)[pad:pad + x.shape[0]]
    return out


def glue_comp(x, thr_db, ratio=1.8, knee=8.0, att=0.035, rel=0.40, hop=48):
    n = x.shape[0]
    nb = n // hop
    p = np.square(x[:nb * hop]).mean(axis=1).reshape(nb, hop).mean(axis=1)
    p = uniform_filter1d(p, size=12, mode="nearest")
    lev = 10 * np.log10(p + 1e-14)
    over = lev - thr_db
    sl = 1 - 1 / ratio
    gr = np.where(over <= -knee / 2, 0.0,
                  np.where(over >= knee / 2, over * sl, sl * (over + knee / 2) ** 2 / (2 * knee)))
    dt = hop / SR
    aa, ar = math.exp(-dt / att), math.exp(-dt / rel)
    g = np.empty(nb)
    s = 0.0
    for i in range(nb):
        tg = gr[i]
        s = aa * s + (1 - aa) * tg if tg > s else ar * s + (1 - ar) * tg
        g[i] = s
    tg = (np.arange(nb) + 0.5) * hop
    gain = np.interp(np.arange(n), tg, db(-g))
    return x * gain[:, None], g


def tp_limiter(x, ceil_db):
    ceil = float(db(ceil_db))
    pk = oversampled_peak_env(x)
    graw = np.minimum(1.0, ceil / np.maximum(pk, 1e-12))
    if graw.min() >= 1.0:
        return x, 0.0
    L1 = int(0.0025 * SR) * 2 + 1
    g = minimum_filter1d(graw, L1, mode="nearest")
    g = uniform_filter1d(g, L1, mode="nearest")
    L2 = int(0.06 * SR) | 1
    g = minimum_filter1d(g, L2, mode="nearest")
    g = uniform_filter1d(g, L2, mode="nearest")
    g = np.minimum(g, graw)
    return x * g[:, None], float(-20 * np.log10(g.min()))


# --------------------------------------------------------------------------
# Analysis helpers
# --------------------------------------------------------------------------
BANDS = [(20, 60), (60, 120), (120, 250), (250, 500), (500, 1000), (1000, 2000),
         (2000, 4000), (4000, 8000), (8000, 16000), (16000, 24000)]


def band_profile(x):
    mono = 0.5 * (x[:, 0] + x[:, 1])
    f, P = signal.welch(mono, SR, nperseg=8192)
    tot = P.sum() + 1e-30
    return [10 * math.log10(P[(f >= a) & (f < b)].sum() / tot + 1e-12) for a, b in BANDS], f, P


def analyse(y, kw):
    log("=== ANALYSIS ===")
    I = integrated_lufs(y, kw)
    tp = true_peak_db(y)
    sp = 20 * math.log10(np.max(np.abs(y)) + 1e-30)
    lra = loudness_range(kw)
    print(f"Integrated loudness : {I:7.2f} LUFS   (target {TARGET_LUFS})")
    print(f"True peak (4x)      : {tp:7.2f} dBTP  (limit -3.0)")
    print(f"Sample peak         : {sp:7.2f} dBFS")
    print(f"Loudness range (LRA): {lra:7.2f} LU")
    print(f"PLR                 : {tp - I:7.2f} dB")
    print(f"Samples >= 0 dBFS   : {int(np.sum(np.abs(y) >= 0.9999))}")
    print(f"DC offset L/R       : {np.mean(y[:, 0]):+.2e} {np.mean(y[:, 1]):+.2e}")
    tail = y[-int(0.02 * SR):]
    print(f"Last 20 ms peak     : {np.max(np.abs(tail)):.2e}   last sample: {y[-1, 0]:.1e} {y[-1, 1]:.1e}")
    print(f"Length              : {y.shape[0]} samples = {y.shape[0] / SR:.6f} s")

    # per-section stats
    print("\nSection stats: sec-LUFS | crest(dB) | transient-crest(dB, 10ms env p99/median) | L/R corr")
    print("        label     t0      t1   design  LUFS   crest  tcrest  corr  | band balance dB re total: "
          + " ".join(f"{a}-{b}" for a, b in BANDS))
    sec_lufs = []
    for k, p in enumerate(PLAN):
        a, b = int(SEC_T0[k] * SR), int(SEC_T1[k] * SR)
        seg, kseg = y[a:b], kw[a:b]
        L = -0.691 + 10 * math.log10(np.square(kseg).sum(axis=1).mean() + 1e-30)
        sec_lufs.append(L)
        mono = 0.5 * (seg[:, 0] + seg[:, 1])
        crest = 20 * math.log10(np.max(np.abs(seg)) / (rms(seg) + 1e-30) + 1e-30)
        env = np.sqrt(uniform_filter1d(mono ** 2, int(0.01 * SR)) + 1e-20)
        tcr = 20 * math.log10(np.percentile(env, 99) / (np.median(env) + 1e-20))
        corr = float(np.sum(seg[:, 0] * seg[:, 1]) / math.sqrt(np.sum(seg[:, 0] ** 2) * np.sum(seg[:, 1] ** 2) + 1e-30))
        bp, _, _ = band_profile(seg)
        print(f"  {p['label']:>11s} {SEC_T0[k]:6.1f} {SEC_T1[k]:7.1f}  {p['e']:5.2f} {L:6.1f}  {crest:5.1f}  {tcr:5.1f}  {corr:5.2f}  | "
              + " ".join(f"{v:6.1f}" for v in bp))
    cc = np.corrcoef(E, sec_lufs)[0, 1]
    print(f"\nCorrelation design-energy vs section loudness: {cc:.3f}")

    # boundary lifts: last bar before vs first bar after vs mid-section
    print("\nBoundary momentary check (LUFS 400ms): [-1 bar mean] -> [first bar mean]")
    zb, st = _block_power(kw, 0.4, 0.1)
    lb = -0.691 + 10 * np.log10(zb + 1e-30)
    tt = (st + 0.2 * SR) / SR
    row = []
    for k in range(1, NSEC):
        T = SEC_T0[k]
        pre = lb[(tt >= T - BAR) & (tt < T)].mean()
        post = lb[(tt >= T) & (tt < T + BAR)].mean()
        row.append(f"{T:5.1f}:{pre:5.1f}->{post:5.1f}")
    for i in range(0, len(row), 6):
        print("   " + "  ".join(row[i:i + 6]))

    # long-term spectrum around the speech band
    bp, f, P = band_profile(y)
    print("\nWhole-track band balance (dB re total):")
    print("   " + "  ".join(f"{a}-{b}:{v:5.1f}" for (a, b), v in zip(BANDS, bp)))
    Pd = 10 * np.log10(P + 1e-30)

    def avg(lo, hi):
        m = (f >= lo) & (f < hi)
        return float(np.mean(Pd[m]))
    print(f"   PSD mean dB/Hz: 500-1k {avg(500, 1000):.1f} | 1-2k {avg(1000, 2000):.1f} | "
          f"2-4k {avg(2000, 4000):.1f} | 4-8k {avg(4000, 8000):.1f}")

    # per-0.5 s RMS
    hop = SR // 2
    nb = y.shape[0] // hop
    r05 = 10 * np.log10(np.square(y[:nb * hop]).mean(axis=1).reshape(nb, hop).mean(axis=1) + 1e-30)
    with open(OUT_RMS, "w") as fh:
        fh.write("t_start_s,rms_dbfs\n")
        for i, v in enumerate(r05):
            fh.write(f"{i * 0.5:.1f},{v:.2f}\n")
    print("\nPer-0.5 s RMS (dBFS), one row per section:")
    for k in range(NSEC):
        a, b = int(SEC_T0[k] * 2), int(round(SEC_T1[k] * 2))
        vals = r05[a:b]
        print(f"  {PLAN[k]['label']:>10s} " + " ".join(f"{max(v, -99):3.0f}" for v in vals))
    return dict(I=I, tp=tp, sp=sp, lra=lra, sec_lufs=sec_lufs, r05=r05)


def plot_spectrogram(y, stats):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    mono = 0.5 * (y[:, 0] + y[:, 1])
    f, t, S = signal.stft(mono, SR, nperseg=4096, noverlap=4096 - 2400, boundary=None)
    P = 20 * np.log10(np.abs(S) + 1e-9)
    fl = np.geomspace(25, 20000, 300)
    Pl = np.array([np.interp(fl, f, P[:, i]) for i in range(P.shape[1])]).T
    fig, ax = plt.subplots(2, 1, figsize=(20, 9), sharex=True,
                           gridspec_kw=dict(height_ratios=[3, 1.2]))
    vmax = Pl.max()
    ax[0].imshow(Pl, aspect="auto", origin="lower", cmap="magma",
                 extent=[t[0], t[-1], 0, len(fl)], vmin=vmax - 90, vmax=vmax)
    ticks = [30, 60, 120, 250, 500, 1000, 2000, 4000, 8000, 16000]
    ax[0].set_yticks([np.searchsorted(fl, v) for v in ticks])
    ax[0].set_yticklabels([f"{v // 1000}k" if v >= 1000 else str(v) for v in ticks])
    ax[0].set_ylabel("Hz")
    ax[0].set_title(f"Axi Select bed - {stats['I']:.1f} LUFS int, {stats['tp']:.1f} dBTP, LRA {stats['lra']:.1f} LU")
    tr = np.arange(len(stats["r05"])) * 0.5 + 0.25
    ax[1].plot(tr, stats["r05"], color="#d0021b", lw=1.2, label="RMS 0.5 s (dBFS)")
    ax[1].set_ylim(-60, -5)
    ax[1].set_ylabel("dBFS")
    for k in range(NSEC):
        for a in ax:
            a.axvline(SEC_T0[k], color="white" if a is ax[0] else "k", lw=0.6, alpha=0.6)
        ax[1].text(SEC_T0[k] + 0.4, -12, PLAN[k]["label"], fontsize=7)
    ax[1].set_xlabel("time (s)")
    ax[1].legend(loc="lower center")
    fig.tight_layout()
    fig.savefig(OUT_PNG, dpi=90)
    plt.close(fig)


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------
def main():
    log("render pads/shimmer")
    pad, shim = render_pads()
    log("render sub")
    sub = render_sub()
    log("render arp")
    arp = render_arp()
    log("render drums")
    kick, shk, ktimes = render_drums()
    log("render bells")
    bells, nb = render_bells()
    log(f"bells: {nb} events; render air")
    air = render_air()
    log("reverbs (synthetic IRs)")
    ir_hall = make_ir(3.6, (2.4, 2.9, 2.3, 1.4), SR, SEED + 10)
    ir_long = make_ir(4.5, (3.2, 3.8, 3.0, 2.0), SR, SEED + 11, predelay=0.03)
    log("lifts / swells / impacts")
    swells, impacts, wash = render_lifts(ir_long)

    # ---- stem normalisation (raw RMS over active audio -> 1.0)
    def norm(x, thresh=1e-5):
        a = np.abs(x if x.ndim == 1 else x.mean(axis=1))
        env = uniform_filter1d(a, SR // 10)
        m = env > thresh * env.max() * 100
        return x / (rms(x[m]) + 1e-20)

    pad, shim, sub, arp = norm(pad), norm(shim), norm(sub), norm(arp)

    # ---- automation
    sc_soft = sidechain_env(ktimes, 0.20)
    sc_sub = sidechain_env(ktimes, 0.45)
    sc_arp = sidechain_env(ktimes, 0.12)

    pad_db = section_curve([-1.0 + 3.0 * (p["e"] - 0.5) for p in PLAN], BAR * 2, 2.4) + 1.6 * LIFT
    pad_db += np.where(TC < 0.0, 0, 0)
    sub_lin = db(section_curve([-1.5 + 6.0 * (p["e"] - 0.5) for p in PLAN], BAR * 2, 2.4))
    sub_lin *= cos_ramp(TC / 5.0)            # sub breathes in over the intro
    arp_db = section_curve([(-1.0 + 7.0 * (p["e"] - 0.5)) if p["arp"] else -40.0 for p in PLAN],
                           BAR, 1.2) + 1.0 * LIFT
    shim_lin = db(section_curve([20 * math.log10(p["shim"]) for p in PLAN], BAR * 2, 2.4)) * db(3.0 * LIFT)

    G_PAD, G_SUB, G_ARP, G_SHIM = db(-21.0), db(-19.5), db(-25.0), db(-31.0)
    G_KICK, G_SHK, G_BELL, G_AIR = db(-9.5), db(-25.0), db(-19.0), db(-46.0)
    G_SWELL, G_IMP, G_WASH = db(-27.0), db(-15.0), db(-34.0)

    pad *= (G_PAD * c2a(db(pad_db)) * sc_soft)[:, None]
    sub = G_SUB * c2a(sub_lin) * sc_sub * sub
    arp *= (G_ARP * c2a(db(arp_db)) * sc_arp)[:, None]
    shim *= (G_SHIM * c2a(shim_lin) * sc_soft)[:, None]
    kick *= G_KICK
    shk *= G_SHK
    bells *= G_BELL
    air *= (G_AIR * sc_soft)[:, None]
    swells *= G_SWELL
    impacts *= G_IMP
    wash *= G_WASH

    # light pad saturation (warmth, glues detuned voices)
    pk = np.max(np.abs(pad))
    drive = 0.9 / pk
    pad = np.tanh(drive * pad) / drive

    log("delay + reverb")
    arp_dly = pingpong(arp, 0.45, 0.38, 5) * db(-8.0)
    send = (0.20 * pad + 0.95 * shim + 0.24 * arp + 0.35 * arp_dly + 0.55 * bells
            + 0.45 * swells + 1.0 * wash + 0.10 * shk)
    send = signal.sosfilt(sos("highpass", 240, 2), send, axis=0)
    wet = convolve_stereo(send, ir_hall)
    wet = signal.sosfilt(sos("lowpass", 8500, 2), wet, axis=0)
    wet *= db(-1.0)

    def stem_db(x, k):
        a, b = int(SEC_T0[k] * SR), int(SEC_T1[k] * SR)
        return 20 * math.log10(rms(x[a:b]) + 1e-30)

    stems = dict(pad=pad, shimmer=0.3 * shim, sub=sub, arp=arp, arp_dly=arp_dly, kick=kick, shaker=shk,
                 bells=bells, air=air, swells=swells, impacts=impacts, reverb=wet)
    print("\nStem RMS dBFS (pre-master) in sections intro / motion / breathe / summit-ii / ending:")
    for nm, x in stems.items():
        print(f"   {nm:>8s} " + "  ".join(f"{stem_db(x, k):6.1f}" for k in (0, 2, 6, 13, 17)))

    mix = (pad + 0.3 * shim + arp + arp_dly + shk + bells + air + swells + wet)
    mono_low = sub + kick + impacts
    mix += mono_low[:, None]
    del pad, shim, arp, arp_dly, shk, bells, air, swells, wet, send, stems, sub, kick, impacts

    # ---- master
    log("master: HP, mono-low, width")
    mix = signal.sosfilt(sos("highpass", 24, 2), mix, axis=0)
    M = 0.5 * (mix[:, 0] + mix[:, 1])
    S = 0.5 * (mix[:, 0] - mix[:, 1])
    S = signal.sosfilt(sos("highpass", 140, 2), S) * 1.10
    mix = np.stack([M + S, M - S], axis=1)
    del M, S
    log("master: FFT EQ (1-4 kHz speech dip, mud dip, air)")
    mix = fft_eq(mix, master_eq_curve)

    # pre-normalise to -17 LUFS so the glue comp threshold is meaningful
    I0 = integrated_lufs(mix)
    mix *= db(-17.0 - I0)
    log(f"pre-master loudness {I0:.2f} LUFS -> -17.0")
    mix, gr = glue_comp(mix, thr_db=-21.0, ratio=1.7)
    print(f"Glue comp GR: max {gr.max():.2f} dB, mean {gr.mean():.2f} dB, p95 {np.percentile(gr, 95):.2f} dB")

    # final fade (silence at exactly 330.000 s) + tiny start fade
    fade = np.ones(N)
    a = int(321.5 * SR)
    x = (T48[a:] - 321.5) / (DUR - 321.5)
    fade[a:] = np.clip(1.0 - x * (N / (N - 1)), 0, 1) ** 2.2
    fade[:int(0.02 * SR)] = np.linspace(0, 1, int(0.02 * SR))
    fade[-1] = 0.0
    mix *= fade[:, None]

    # loudness + true-peak limiting, iterate to target
    gain_db = 0.0
    for it in range(4):
        I1 = integrated_lufs(mix)
        mix *= db(TARGET_LUFS - I1)
        lim, lgr = tp_limiter(mix, TP_CEIL_DB)
        I2 = integrated_lufs(lim)
        tp2 = true_peak_db(lim)
        log(f"iter {it}: pre {I1:.2f} -> limited {I2:.2f} LUFS, TP {tp2:.2f} dBTP, limiter max GR {lgr:.2f} dB")
        if abs(I2 - TARGET_LUFS) < 0.05 and tp2 <= -3.0:
            break
    y = lim
    tp = true_peak_db(y)
    if tp > -3.05:
        y *= db(-3.05 - tp)
    y[-1] = 0.0
    del mix, lim

    log("write wav")
    sf.write(OUT_WAV, y.astype(np.float32), SR, subtype="PCM_24")
    # re-read to measure exactly what was written (24-bit quantised)
    y, sr = sf.read(OUT_WAV, dtype="float64", always_2d=True)
    assert sr == SR and y.shape[0] == N, (sr, y.shape)
    kw = k_weight(y)
    stats = analyse(y, kw)
    log("spectrogram")
    plot_spectrogram(y, stats)

    sections = []
    for k, p in enumerate(PLAN):
        sections.append(dict(t0=round(SEC_T0[k], 3), t1=round(SEC_T1[k], 3), energy=p["e"],
                             label=p["label"], lufs=round(stats["sec_lufs"][k], 2)))
    meta = dict(bpm=BPM, bar=BAR, beat=BEAT, duration=DUR, key="D minor / F major",
                lufs_integrated=round(stats["I"], 2), true_peak_dbtp=round(stats["tp"], 2),
                lra=round(stats["lra"], 2),
                final_chord_t=318.0, silence_at=DUR,
                sections=sections)
    with open(OUT_JSON, "w") as fh:
        json.dump(meta, fh, indent=2)
    log(f"done -> {OUT_WAV}\n          {OUT_JSON}\n          {OUT_PNG}\n          {OUT_RMS}")


if __name__ == "__main__":
    main()
