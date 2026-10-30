#!/usr/bin/env python3
"""sfx_forge.py - procedural sound effects for the AboStesha Film Pipeline (step 6.2).

Renders approved SFX from code only (numpy + scipy, no samples, no AI), masters every file to a
true-peak ceiling (default -1.0 dBTP, 8x oversampled) and writes 48 kHz / 24-bit PCM WAV, plus a
manifest CSV for the ledger and the Summit disclosure (origin: procedural code, non-AI).

Commands (run with `python3 -I` so nothing is imported from the working directory):
  python3 -I sfx_forge.py list
  python3 -I sfx_forge.py render SPEC.json --out DIR
  python3 -I sfx_forge.py one RECIPE --dur 1.2 --seed 7 --args '{"material": "glass"}' -o out.wav
  python3 -I sfx_forge.py analyze FILE.wav [FILE.wav ...]
  python3 -I sfx_forge.py master IN.wav -o OUT.wav --mode safe|peak|lufs [--target -30] [--ceiling -1]
      (conform an ElevenLabs/Suno/Seedance WAV: resample to 48 kHz, 24-bit, true-peak ceiling;
       safe = static gain down only if over the ceiling, never a limiter)
Outputs never overwrite existing files: raise the version, or pass --force for unheard test files.

SPEC.json:
  {"film": "SLA", "version": "v01", "ceiling_dbtp": -1.0,
   "items": [{"id": "S03-SH02_FX01", "name": "robot fist-bump contact", "recipe": "impact",
              "args": {"material": "metal_small", "size": 0.8}, "dur": 1.2, "seed": 101,
              "variants": 3},
             {"id": "SEQ4_BG01", "name": "room night tone", "recipe": "room_tone",
              "args": {"kind": "apartment_night"}, "dur": 30, "seed": 7, "loop": true,
              "master": {"mode": "lufs", "target": -38}}]}

Every render is deterministic: same spec, same bytes. Loudness: ITU-R BS.1770 K-weighting and gating
(48 kHz coefficients). Credit: the attack/body/tail layering, "measure, don't guess" QA, the helper
vocabulary (n_, env_ad, lp/hp/bp, fail with a fix hint) and the look-ahead true-peak limiter design follow
bianbianzhu/procedural-sfx (MIT License, Copyright (c) 2026 bianbianzhu); every function here is rewritten.
Requires Python >= 3.9, numpy, scipy. No network, no subprocess, no files read except the spec/WAVs.
"""
import argparse
import csv
import datetime
import difflib
import hashlib
import inspect
import json
import math
import os
import re
import sys
import wave

import numpy as np
from scipy.ndimage import minimum_filter1d, uniform_filter1d
from scipy.signal import butter, fftconvolve, istft, lfilter, resample_poly, sosfilt, stft

VERSION = "1.1.0"
SR = 48000
BITS = 24
_FULL = float(2 ** (BITS - 1))


def fail(msg, fix=None):
    print("error: " + msg + ("\n  fix: " + fix if fix else ""), file=sys.stderr)
    sys.exit(1)


# ---------------------------------------------------------------- basic DSP
def n_(d):
    return max(1, int(round(d * SR)))


def t_(d):
    return np.arange(n_(d)) / SR


def _f(f):
    return float(np.clip(f, 5.0, SR / 2 * 0.95))


def lp(x, f, o=2):
    return sosfilt(butter(o, _f(f), "low", fs=SR, output="sos"), x, axis=0)


def hp(x, f, o=2):
    return sosfilt(butter(o, _f(f), "high", fs=SR, output="sos"), x, axis=0)


def bp(x, lo, hi, o=2):
    lo, hi = _f(lo), _f(hi)
    hi = max(hi, lo * 1.05)
    return sosfilt(butter(o, [lo, min(hi, SR / 2 * 0.95)], "band", fs=SR, output="sos"), x, axis=0)


def norm(x, peak=1.0):
    m = float(np.max(np.abs(x))) if np.size(x) else 0.0
    return x * (peak / m) if m > 0 else x


def env_exp(n, tau):
    return np.exp(-np.arange(n) / SR / max(tau, 1e-5))


def env_ad(n, attack, tau):
    t = np.arange(n) / SR
    return np.minimum(1.0, t / max(attack, 1e-5)) * np.exp(-np.maximum(0.0, t - attack) / max(tau, 1e-5))


def fade(x, fi=0.0, fo=0.0):
    x = np.array(x, dtype=float)
    a, b = min(len(x), int(fi * SR)), min(len(x), int(fo * SR))
    if a:
        r = np.sin(np.linspace(0, np.pi / 2, a)) ** 2
        x[:a] *= r if x.ndim == 1 else r[:, None]
    if b:
        r = np.cos(np.linspace(0, np.pi / 2, b)) ** 2
        x[-b:] *= r if x.ndim == 1 else r[:, None]
    return x


def fit(x, n):
    """Pad with zeros or cut to exactly n samples (first axis)."""
    if len(x) >= n:
        return x[:n]
    pad = [(0, n - len(x))] + [(0, 0)] * (x.ndim - 1)
    return np.pad(x, pad)


def colored(n, rng, slope=-1.0):
    """Noise with power ~ f**slope: 0 white, -1 pink, -2 brown. Zero mean, unit peak."""
    spec = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    f[0] = f[1] if n > 1 else 1.0
    spec *= f ** (slope / 2.0)
    y = np.fft.irfft(spec, n)
    return norm(y - y.mean())


def sweep(f, phase0=0.0):
    """Sine whose instantaneous frequency follows the array f (Hz); phase-continuous, no clicks."""
    return np.sin(phase0 + 2 * np.pi * np.cumsum(f) / SR)


def modal(n, freqs, amps, taus, rng, attack=0.0005):
    """Sum of exponentially damped sines (modal resonator bank) with random phases."""
    t = np.arange(n) / SR
    y = np.zeros(n)
    for f, a, tau in zip(freqs, amps, taus):
        if f >= SR / 2 * 0.95:
            continue
        y += a * np.sin(2 * np.pi * f * t + rng.uniform(0, 2 * np.pi)) * np.exp(-t / tau)
    return y * np.minimum(1.0, t / attack)


def pan2(x, p):
    """Equal-power pan of mono x; p in -1..1; centre keeps unity per channel."""
    p = np.clip(p, -1, 1)
    ang = (p + 1) * np.pi / 4
    return np.stack([x * np.cos(ang) * np.sqrt(2), x * np.sin(ang) * np.sqrt(2)], axis=-1)


def as2d(x):
    x = np.asarray(x, dtype=float)
    return x[:, None] if x.ndim == 1 else x


def reverb(x, rng, rt60=0.6, size=1.0, damp=6000.0, pre=0.008, stereo=True):
    """Synthetic room: a few early reflections + decorrelated exponentially decaying noise tail whose
    highs decay faster (air and wall absorption). Returns the wet signal only, len(x) + IR."""
    nir = n_(min(4.5, max(0.08, rt60 * 1.25)))
    t = np.arange(nir) / SR
    tau = rt60 / 6.91
    out = []
    for _ in range(2 if stereo else 1):
        nz = rng.standard_normal(nir)
        tail = lp(nz, damp) * np.exp(-t / tau) + hp(nz, damp) * np.exp(-t / (tau * 0.4))
        tail *= np.minimum(1.0, t / 0.02)
        s0 = n_(pre) + n_(0.06 * size)
        ir = np.zeros(nir + s0)
        ir[s0:] += tail * 0.5
        for k in range(6):
            d = n_(pre + rng.uniform(0.004, 0.045) * size)
            ir[min(d, len(ir) - 1)] += rng.uniform(0.25, 0.6) * (0.8 ** k) * rng.choice([-1, 1])
        ir /= np.sqrt(np.sum(ir ** 2)) + 1e-12
        out.append(fftconvolve(x, ir))
    return np.stack(out, axis=-1) if stereo else out[0]


ROOMS = {"dry": None, "small": (0.35, 0.6, 7000), "booth": (0.25, 0.4, 5000), "apartment": (0.45, 0.8, 6000),
         "hall": (1.8, 1.6, 5000), "metro": (2.6, 2.0, 4500), "street": (0.9, 2.5, 4000)}
DISTANCES = {"close": (None, 0.0), "medium": (9000, 0.30), "far": (3200, 0.60)}


def place(x, rng, n, distance="close", room="dry"):
    """Apply distance (air absorption + direct/reverb ratio) and room. Mono in; mono or stereo out."""
    if distance not in DISTANCES:
        fail("distance must be one of " + ", ".join(DISTANCES), "pick close, medium or far")
    if room not in ROOMS:
        fail("room must be one of " + ", ".join(ROOMS), "pick a room from the list")
    cut, wet = DISTANCES[distance]
    if cut:
        x = lp(x, cut, 2)
    if ROOMS[room] is None:
        return fit(x, n)
    rt60, size, damp = ROOMS[room]
    w = reverb(x, rng, rt60, size, damp)
    dry = np.stack([x, x], axis=-1)
    mix = fit(dry, n) * (1 - wet * 0.6) + fit(w, n) * (0.18 + wet) * norm_gain(x, w)
    return mix


def norm_gain(x, w):
    rx, rw = np.sqrt(np.mean(x ** 2)) + 1e-12, np.sqrt(np.mean(w ** 2)) + 1e-12
    return rx / rw


def loopify(x, xf):
    """Seamless loop: x holds len+xf samples; the extra tail is cross-faded (equal power) onto the head."""
    x = np.array(x, dtype=float)
    k = n_(xf)
    body, tail = x[:-k].copy(), x[-k:]
    g = np.linspace(0, np.pi / 2, k)
    fi, fo = np.sin(g), np.cos(g)
    if body.ndim == 2:
        fi, fo = fi[:, None], fo[:, None]
    body[:k] = body[:k] * fi + tail * fo
    return body


def periodic(f, dur):
    """Nearest frequency that completes a whole number of cycles in dur (keeps tonal loops seamless)."""
    return max(1.0, round(f * dur)) / dur


# ---------------------------------------------------------------- recipes
MATERIALS = {
    # f0 (Hz at size 1), mode ratios, decay taus (s), mode amps, transient high-pass, transient tau,
    # contact-noise band, contact-noise tau, sub weight
    "metal_small": (1150, [1, 2.76, 5.40, 8.93], [0.45, 0.30, 0.18, 0.10], [1, .7, .45, .3], 3000, .0015, (2000, 9000), .02, 0.0),
    "metal_large": (180, [1, 1.19, 1.51, 2.0, 2.51, 2.67, 3.01], [1.8, 1.4, 1.1, .9, .7, .6, .5], [1, .8, .7, .6, .5, .4, .35], 1500, .003, (400, 5000), .05, 0.5),
    "wood": (260, [1, 2.57, 4.2], [.03, .02, .012], [1, .5, .3], 1800, .002, (300, 2500), .025, 0.0),
    "glass": (2600, [1, 2.32, 4.25, 6.63], [.5, .35, .2, .12], [1, .6, .4, .25], 5000, .0008, (4000, 14000), .006, 0.0),
    "concrete": (110, [1, 1.6], [.03, .02], [1, .4], 2500, .002, (150, 1800), .04, 0.6),
    "plastic": (1300, [1, 1.72, 3.1], [.012, .009, .006], [1, .6, .3], 2500, .0015, (1500, 6000), .01, 0.0),
    "soft": (90, [1], [.05], [.6], None, .008, (80, 900), .06, 0.3),
}


def impact(dur, rng, material="metal_small", size=1.0, force=0.8, distance="close", room="dry", pitch_var=0.06):
    """Contact impact from a modal model: transient + modal body + contact noise + optional sub."""
    if material not in MATERIALS:
        fail("material must be one of " + ", ".join(MATERIALS))
    f0, ratios, taus, amps, thp, ttau, band, ntau, sub = MATERIALS[material]
    n = n_(dur)
    size = float(np.clip(size, 0.2, 4.0))
    p = 1.0 + rng.uniform(-pitch_var, pitch_var)
    f0 = f0 / size * p
    body = modal(n, [f0 * r * (1 + rng.uniform(-.01, .01)) for r in ratios], amps,
                 [tc * size ** 0.5 for tc in taus], rng)
    noise = rng.standard_normal(n)
    contact = bp(noise, band[0], band[1]) * env_exp(n, ntau * size ** 0.5)
    trans = (hp(noise, thp, 4) if thp else lp(noise, 1000)) * env_ad(n, 0.0003 if thp else 0.006, ttau)
    x = 0.55 * norm(body) + 0.35 * norm(contact) + (0.25 + 0.5 * force) * norm(trans)
    if sub:
        f = np.linspace(75, 38, n) / size ** 0.3
        x += sub * norm(sweep(f) * env_ad(n, .003, .12 * size ** 0.5))
    if force > 0.85:
        x = np.tanh(norm(x) * (1 + 3 * (force - 0.85) * 4))
    return fade(place(norm(x), rng, n, distance, room), 0, 0.01)


def whoosh(dur, rng, f_lo=300.0, f_hi=3500.0, peak=0.55, pan_from=-0.6, pan_to=0.6, tone=0.0, weight=0.3):
    """Air pass-by: band of noise whose centre rises to the velocity peak then drops (Doppler-like)."""
    n = n_(dur)
    f_lo = max(20.0, float(f_lo))
    f_hi = max(f_lo * 1.5, float(f_hi))
    nper = 1024
    _, _, Z = stft(rng.standard_normal(n), fs=SR, nperseg=nper)
    nf, nt = Z.shape
    freqs = np.linspace(0, SR / 2, nf)
    u = np.linspace(0, 1, nt)
    pk = float(np.clip(peak, .1, .9))
    rise = np.clip(u / pk, 0, 1)
    fall = np.clip((u - pk) / (1 - pk), 0, 1)
    fc = np.where(u <= pk, f_lo * (f_hi / f_lo) ** rise, f_hi * ((f_lo * 1.3) / f_hi) ** fall)
    amp = np.where(u <= pk, np.sin(np.pi / 2 * rise) ** 2, np.cos(np.pi / 2 * fall) ** 1.5)
    oct_ = np.log2(np.maximum(freqs, 1)[:, None] / fc[None, :])
    Z = Z * np.exp(-0.5 * (oct_ / 0.55) ** 2) * amp[None, :]
    _, y = istft(Z, fs=SR, nperseg=nper)
    y = fit(norm(y), n)
    if weight:
        env = np.interp(np.arange(n), np.linspace(0, n, nt), amp)
        y += weight * norm(lp(rng.standard_normal(n), 220)) * env
    if tone:
        fct = np.interp(np.arange(n), np.linspace(0, n, nt), fc) * 0.25
        env = np.interp(np.arange(n), np.linspace(0, n, nt), amp)
        y += tone * 0.4 * sweep(fct) * env
    pan = np.linspace(pan_from, pan_to, n)
    ang = (np.clip(pan, -1, 1) + 1) * np.pi / 4
    out = np.stack([y * np.cos(ang), y * np.sin(ang)], axis=-1) * np.sqrt(2)
    return fade(out, 0.01, 0.02)


def ui_tone(dur, rng, kind="confirm", base_hz=880.0, brightness=0.5):
    """Interface tones: tick, confirm (rising fifth), deny (low beating pair), open/close glides."""
    n = n_(dur)
    t = np.arange(n) / SR
    harm = [1.0, 0.35 * brightness, 0.15 * brightness]

    def note(f, start, length, tau):
        y = np.zeros(n)
        s = int(round(start * SR))
        e = min(n, s + n_(length))
        if s >= n:  # note starts after the file ends (very short dur): leave it out
            return y
        tt = t[: e - s]
        tone = sum(a * np.sin(2 * np.pi * f * (k + 1) * tt) for k, a in enumerate(harm))
        y[s:e] = tone * env_ad(e - s, 0.003, tau)
        return y

    if kind == "tick":
        y = note(base_hz * 3.6, 0, 0.02, 0.006) + 0.3 * hp(rng.standard_normal(n), 4000) * env_exp(n, 0.002)
    elif kind == "confirm":
        y = note(base_hz, 0, dur, 0.09) + 0.9 * note(base_hz * 1.5, 0.07, dur, 0.14)
    elif kind == "deny":
        y = note(base_hz * 0.5, 0, 0.12, 0.05) + note(base_hz * 0.5 * 1.03, 0, 0.12, 0.05)
        y += 0.8 * (note(base_hz * 0.47, 0.13, 0.14, 0.06) + note(base_hz * 0.47 * 1.03, 0.13, 0.14, 0.06))
    elif kind in ("open", "close"):
        a, b = (0.75, 1.25) if kind == "open" else (1.25, 0.75)
        f = base_hz * (a * (b / a) ** np.linspace(0, 1, n))
        y = sum(h * sweep(f * (k + 1)) for k, h in enumerate(harm)) * env_ad(n, 0.01, dur * 0.45)
    else:
        fail("ui_tone kind must be tick, confirm, deny, open or close")
    return fade(lp(norm(y), 9000), 0, 0.01)


def hologram(dur, rng, base_hz=220.0, shimmer=0.5, glitch=0.1, open=True):
    """Holographic display bed: detuned partial cluster, slow tremolo, high sparkle grains, glitches."""
    n = n_(dur)
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    glide = np.ones(n)
    if open:
        k = min(n, n_(0.25))
        glide[:k] = 0.4 + 0.6 * np.sin(np.linspace(0, np.pi / 2, k))
    for ch, cents in enumerate((-3.0, 3.0)):
        det = 2 ** (cents / 1200)
        y = sum(a * sweep(base_hz * r * det * glide)
                for r, a in zip((1, 1.5, 2, 3, 4.01), (1, .5, .45, .25, .15)))
        trem = 1 - 0.15 * (0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(7, 11) * t))
        out[:, ch] = y * trem
    if shimmer:
        sp = np.zeros(n)
        for _ in range(int(dur * 40 * shimmer)):
            s = rng.integers(0, max(1, n - n_(0.03)))
            g = n_(rng.uniform(0.005, 0.03))
            sp[s:s + g] += np.hanning(g) * rng.uniform(.3, 1)
        spark = bp(rng.standard_normal(n), 6000, 12000) * sp
        out += np.stack([spark, np.roll(spark, n_(0.007))], axis=-1) * 0.6 * shimmer
    if glitch:
        for _ in range(int(dur * 3 * glitch)):
            s = rng.integers(0, max(1, n - n_(0.02)))
            g = n_(rng.uniform(0.005, 0.02))
            seg = out[s:s + g]
            step = int(rng.integers(8, 40))
            out[s:s + g] = np.repeat(seg[::step], step, axis=0)[: len(seg)]
    out = lp(out, 12000)
    return fade(norm(out), 0.03 if not open else 0.005, 0.15)


ROOM_TONES = ("apartment_night", "booth_shop_fluorescent", "metro_concourse", "office_hvac", "exterior_city_far", "dream_air")


def room_tone(dur, rng, kind="apartment_night", mains_hz=50.0, hum=0.3, loop=True):
    """Loopable stereo room tones. Real spaces carry mains hum (UAE grid 50 Hz; fluorescent ballasts
    buzz at twice mains); 'dream_air' is deliberately hum-free and too clean (02 DREAM variant)."""
    if kind not in ROOM_TONES:
        fail("room_tone kind must be one of " + ", ".join(ROOM_TONES))
    xf = 1.0 if loop else 0.0
    m = n_(dur + xf)
    n = n_(dur)

    def bed(slope, lo, hi, corr=0.6):
        c = colored(m, rng, slope)
        a, b = colored(m, rng, slope), colored(m, rng, slope)
        s = np.stack([corr * c + (1 - corr) * a, corr * c + (1 - corr) * b], axis=-1)
        return bp(s, lo, hi, 2)

    if kind == "apartment_night":
        x = 1.0 * bed(-2, 25, 400) + 0.25 * bed(-1, 200, 2500)
    elif kind == "booth_shop_fluorescent":
        x = 0.7 * bed(-1, 60, 4000) + 0.35 * bed(-2, 25, 300)
    elif kind == "metro_concourse":
        x = 0.8 * bed(-1, 80, 2200, 0.3) + 0.9 * bed(-2, 20, 90, 0.8)
    elif kind == "office_hvac":
        x = 1.0 * bed(-1.5, 40, 1200, 0.5)
    elif kind == "exterior_city_far":
        x = 1.0 * bed(-2, 25, 600, 0.4) + 0.4 * bed(-1, 200, 1500, 0.3)
        pts = rng.random(int(m / SR / 3) + 3)  # slow traffic swells, one random level every ~3 s
        sw = np.interp(np.arange(m), np.linspace(0, m, len(pts)), pts)
        sw = uniform_filter1d(sw, n_(1.0))
        x *= (0.6 + 0.4 * norm(sw - sw.min()))[:, None]
    else:  # dream_air
        x = 0.3 * bed(-1, 2500, 14000, 0.2) + 0.05 * bed(-2, 40, 200, 0.9)
    x = norm(x)
    x = fit(loopify(x, xf), n) if loop else x[:n]
    if kind != "dream_air" and hum > 0:
        t = np.arange(n) / SR
        tone = np.zeros(n)
        if kind == "booth_shop_fluorescent":
            parts = [(2, 1.0), (4, 0.5), (6, 0.35), (8, 0.2)]
        else:
            parts = [(1, 1.0), (2, 0.5), (3, 0.3)]
        for h, a in parts:
            tone += a * np.sin(2 * np.pi * periodic(mains_hz * h, dur) * t)
        if kind == "booth_shop_fluorescent":
            tone = np.tanh(2.5 * tone)
        tone *= 1 + 0.1 * np.sin(2 * np.pi * periodic(0.2, dur) * t)
        x = x + 0.12 * hum * norm(tone)[:, None]
    return norm(x)


def glass(dur, rng, kind="clink", size=1.0, distance="close", room="small"):
    """Glass: tap, clink (two glasses), crack (panel stress), shatter_small (crack + falling shards)."""
    n = n_(dur)
    f0 = 2600 / float(np.clip(size, 0.3, 3.0))
    ratios, taus = [1, 2.32, 4.25, 6.63], [.5, .35, .2, .12]
    noise = rng.standard_normal(n)

    def ping(f, tau, at=0, gain=1.0):
        y = np.zeros(n)
        s = n_(at) if at else 0
        if s >= n:
            return y
        k = n - s
        y[s:] = gain * modal(k, [f * r * (1 + rng.uniform(-.015, .015)) for r in ratios],
                             [1, .6, .4, .25], [tc * tau for tc in taus], rng, 0.0002)
        return y

    click = hp(noise, 5000, 4) * env_exp(n, 0.0008)
    if kind == "tap":
        x = ping(f0, 0.35) + 0.5 * click
    elif kind == "clink":
        x = ping(f0, 1.0) + 0.8 * ping(f0 * 1.07, 0.9, rng.uniform(0.0005, 0.003)) + 0.4 * click
    elif kind == "crack":
        x = 1.2 * hp(noise, 2000, 4) * env_exp(n, 0.002) + 0.4 * ping(f0 * 0.6, 0.3)
        for _ in range(12):
            x += ping(rng.uniform(3000, 9000), 0.05, rng.uniform(0.001, 0.06), rng.uniform(.1, .4))
    elif kind == "shatter_small":
        x = 1.2 * hp(noise, 1500, 4) * env_exp(n, 0.004) + 0.5 * lp(noise, 300) * env_exp(n, 0.05)
        count = int(60 * size)
        for i in range(count):
            at = min(dur * 0.85, rng.exponential(0.08) if i < count * 0.6 else rng.uniform(0.15, dur * 0.8))
            x += ping(rng.uniform(3000, 9500), rng.uniform(0.04, 0.25), at, rng.uniform(.05, .5) * np.exp(-at / dur))
    else:
        fail("glass kind must be tap, clink, crack or shatter_small")
    return fade(place(norm(x), rng, n, distance, room), 0, 0.02)


_VOWELS = [(730, 1090, 2440), (270, 2290, 3010), (300, 870, 2240), (530, 1840, 2480), (570, 840, 2410), (440, 1020, 2240)]


def crowd_bed(dur, rng, people=24, distance="medium", room="hall", energy=0.5, loop=True):
    """Wordless crowd murmur (walla): glottal-pulse voices through hopping vowel formants, syllabic
    envelopes and phrase pauses. Unintelligible by construction (no words can appear)."""
    cuts = {"close": 7000, "medium": 4500, "far": 2200}
    if distance not in cuts:
        fail("distance must be close, medium or far")
    if room not in ROOMS:
        fail("room must be one of " + ", ".join(ROOMS), "pick a room from the list")
    xf = 1.0 if loop else 0.0
    d = dur + xf
    sr2 = 16000
    m2 = int(d * sr2)
    t2 = np.arange(m2) / sr2
    mix = np.zeros((m2, 2))
    vsos = [[butter(1, [max(50, fc - bw), min(sr2 / 2 * 0.95, fc + bw)], "band", fs=sr2, output="sos")
             for fc, bw in zip(F, (90, 130, 180))] for F in _VOWELS]
    for v in range(int(np.clip(people, 1, 200))):
        f_base = rng.uniform(95, 230) * (1 + 0.15 * energy)
        f0 = f_base * (1 + 0.04 * np.sin(2 * np.pi * rng.uniform(0.1, 0.4) * t2 + rng.uniform(0, 6)))
        f0 *= 1 + 0.01 * rng.standard_normal(m2).cumsum() / np.sqrt(np.arange(1, m2 + 1))
        ph = np.cumsum(f0) / sr2
        src = (ph % 1.0) * 2 - 1 + 0.05 * rng.standard_normal(m2)
        voice = np.zeros(m2)
        pos = int(rng.uniform(0, 1.0) * sr2)
        while pos < m2:
            phrase_end = pos + int(rng.uniform(0.8, 3.0) * sr2)
            while pos < min(phrase_end, m2):
                L = int(rng.uniform(0.11, 0.28) / (0.8 + 0.4 * energy) * sr2)
                seg = src[pos:pos + L]
                if len(seg) < 16:
                    break
                sos3 = vsos[rng.integers(0, len(_VOWELS))]
                y = np.zeros(len(seg))
                for sos, a in zip(sos3, (1.0, 0.6, 0.3)):
                    y += a * sosfilt(sos, seg)
                if rng.random() < 0.35:
                    k = min(len(seg), int(0.03 * sr2))
                    y[:k] += 0.15 * rng.standard_normal(k) * np.hanning(2 * k)[:k]
                voice[pos:pos + len(seg)] += y * np.hanning(len(seg))
                pos += L
            pos = phrase_end + int(rng.uniform(0.3, 1.6) * sr2)
        near = rng.uniform(0.25, 1.0) ** 2
        mix += pan2(norm(voice) * near, rng.uniform(-0.8, 0.8))
    x = resample_poly(mix, SR, sr2, axis=0)
    x = fit(x, n_(d))
    x = lp(x, cuts[distance])
    if ROOMS[room]:
        rt60, size, damp = ROOMS[room]
        wet = np.stack([fit(reverb(x[:, c], rng, rt60, size, damp, stereo=False), len(x)) for c in (0, 1)], axis=-1)
        x = x + wet * norm_gain(x, wet) * {"close": 0.25, "medium": 0.5, "far": 0.9}[distance]
    x = norm(hp(x, 80))
    return fit(loopify(x, xf), n_(dur)) if loop else fade(fit(x, n_(dur)), 0.3, 0.5)


def servo(dur, rng, pitch_hz=180.0, travel=0.8, grit=0.3, clunk=False):
    """Robot actuator: motor whine + gear-mesh partial following a speed profile, friction grit,
    end-stop click; clunk=True adds an irregular low knock (a faulty joint) at 60% of the move."""
    n = n_(dur)
    u = np.linspace(0, 1, n)
    ramp = np.clip(np.minimum(u / 0.15, (1 - u) / 0.15), 0, 1)
    speed = (np.sin(np.pi / 2 * ramp) ** 2) * travel
    f = pitch_hz * (0.4 + 0.6 * speed)
    y = sweep(f) + 0.5 * sweep(2 * f) + 0.25 * sweep(3 * f) + 0.12 * sweep(12 * f)
    y = y * (0.2 + 0.8 * speed)
    y += grit * norm(bp(rng.standard_normal(n), 1500, 6000)) * speed * (1 + 0.5 * np.sin(2 * np.pi * 37 * u * dur))
    stop = np.zeros(n)
    s = int(n * 0.86)
    stop[s:] = modal(n - s, [1900, 3400, 5200], [1, .5, .3], [.03, .02, .01], rng) * 0.6
    x = norm(y) * 0.7 + stop
    if clunk:
        c0 = int(n * 0.6)
        k = n - c0
        thud = modal(k, [95, 180, 410], [1, .5, .3], [.08, .05, .03], rng) + 0.4 * lp(rng.standard_normal(k), 900) * env_exp(k, .02)
        x[c0:] += 0.9 * norm(thud)
    return fade(norm(x), 0.005, 0.02)


def sub_boom(dur, rng, f0=55.0, glide=0.4, air=0.3):
    """Low reveal hit (mild, G-rated): sine dropping from 1.6*f0 to f0, a soft air puff, gentle drive."""
    n = n_(dur)
    k = n_(min(glide, dur))
    f = np.full(n, f0)
    f[:k] = f0 * (1.6 - 0.6 * np.sin(np.linspace(0, np.pi / 2, k)))
    x = sweep(f) * env_ad(n, 0.005, dur * 0.25)
    x += air * norm(lp(rng.standard_normal(n), 220)) * env_ad(n, 0.004, 0.08)
    x = np.tanh(1.6 * norm(x))
    return fade(norm(hp(x, 22)), 0, 0.05)


def riser(dur, rng, f_lo=200.0, f_hi=4000.0, noise=0.6, tonal=0.4):
    """Tension riser that ends exactly at the file end: place its end 30-250 ms before the hit."""
    n = n_(dur)
    u = np.linspace(0, 1, n)
    f = f_lo * (f_hi / f_lo) ** (u ** 1.5)
    amp = u ** 2.2
    y = np.zeros(n)
    if tonal:
        y += tonal * (sweep(f * 0.5) + 0.5 * sweep(f * 0.5 * 1.006))
    if noise:
        nperseg = 1024
        _, _, Z = stft(rng.standard_normal(n), fs=SR, nperseg=nperseg)
        freqs = np.linspace(0, SR / 2, Z.shape[0])
        fc = np.interp(np.linspace(0, n, Z.shape[1]), np.arange(n), f)
        Z *= np.exp(-0.5 * (np.log2(np.maximum(freqs, 1)[:, None] / fc[None, :]) / 0.8) ** 2)
        _, z = istft(Z, fs=SR, nperseg=nperseg)
        y += noise * norm(fit(z, n))
    y *= amp
    out = np.stack([y, y], axis=-1)
    wide = norm(bp(rng.standard_normal(n), 3000, 9000)) * amp * 0.15
    out[:, 0] += wide
    out[:, 1] -= wide
    return fade(norm(out), 0.05, 0.03)


RECIPES = {
    "impact": (impact, "contact impact, modal model; materials " + ", ".join(MATERIALS)),
    "whoosh": (whoosh, "air pass-by / camera-move swish, stereo pan"),
    "ui_tone": (ui_tone, "interface tones: tick, confirm, deny, open, close"),
    "hologram": (hologram, "holographic display bed with sparkle and glitches (stereo)"),
    "room_tone": (room_tone, "loopable room tones: " + ", ".join(ROOM_TONES)),
    "glass": (glass, "glass tap, clink, crack, shatter_small"),
    "crowd_bed": (crowd_bed, "wordless crowd murmur (walla), loopable stereo"),
    "servo": (servo, "robot actuator move; clunk=True for a faulty joint"),
    "sub_boom": (sub_boom, "low reveal hit, mild"),
    "riser": (riser, "tension riser ending at file end"),
}


def recipe_args(name):
    fn = RECIPES[name][0]
    return {k: v.default for k, v in inspect.signature(fn).parameters.items() if k not in ("dur", "rng")}


def run_recipe(name, dur, seed, args):
    if name not in RECIPES:
        close = difflib.get_close_matches(name, RECIPES, n=3)
        fail("unknown recipe '%s'" % name, "use one of: " + ", ".join(close or RECIPES))
    allowed = recipe_args(name)
    bad = [k for k in args if k not in allowed]
    if bad:
        fail("recipe %s has no argument(s) %s" % (name, ", ".join(bad)), "allowed: " + json.dumps(allowed))
    for k, v in args.items():
        d = allowed[k]
        if isinstance(d, bool):
            ok = isinstance(v, bool)
        elif isinstance(d, (int, float)):
            ok = isinstance(v, (int, float)) and not isinstance(v, bool) and math.isfinite(v)
        else:
            ok = isinstance(v, str)
        if not ok:
            fail("recipe %s: argument %s=%r has the wrong type" % (name, k, v),
                 "use a %s like the default %s" % (type(d).__name__, json.dumps(d)))
    if not (0.05 <= dur <= 120):
        fail("dur %.3f s out of range" % dur, "use 0.05-120 s; split longer beds and loop them in Premiere")
    rng = np.random.default_rng(int(seed))
    x = RECIPES[name][0](float(dur), rng, **args)
    x = as2d(x)
    if not np.all(np.isfinite(x)):
        fail("recipe %s produced NaN/inf" % name, "lower extreme args (size, force) and re-render")
    return fit(x, n_(dur))


# ---------------------------------------------------------------- metering and mastering
def true_peak_env(x, os_=8, block=1 << 16, pad=64):
    """Per-sample true-peak envelope (max over channels), oversampled os_ times (BS.1770 asks >= 4x).
    Works in blocks with `pad` samples of context (the interpolation filter spans ~10 input samples),
    so a 6-minute music cue stays at a few hundred MB instead of several GB."""
    x = as2d(x)
    n = len(x)
    env = np.empty(n)
    for s in range(0, n, block):
        e = min(n, s + block)
        a, b = max(0, s - pad), min(n, e + pad)
        up = np.abs(resample_poly(x[a:b], os_, 1, axis=0))
        env[s:e] = up[(s - a) * os_:(e - a) * os_].reshape(e - s, os_, x.shape[1]).max(axis=(1, 2))
    return np.maximum(env, np.abs(x).max(axis=1))


def true_peak_db(x):
    m = float(true_peak_env(x).max()) if np.size(x) else 0.0
    return 20 * np.log10(m) if m > 0 else -np.inf


def lufs_i(x, sr=SR):
    """Integrated loudness, ITU-R BS.1770 (K-weighting at 48 kHz, 400 ms blocks, 75% overlap,
    -70 LUFS absolute and -10 LU relative gates). Returns None for files shorter than 0.4 s."""
    x = as2d(x)
    if sr != SR:
        x = resample_poly(x, SR, sr, axis=0)
    blk, hop = n_(0.4), n_(0.1)
    if len(x) < blk:
        return None
    y = lfilter([1.53512485958697, -2.69169618940638, 1.19839281085285],
                [1.0, -1.69065929318241, 0.73248077421585], x, axis=0)
    y = lfilter([1.0, -2.0, 1.0], [1.0, -1.99004745483398, 0.99007225036621], y, axis=0)
    cs = np.vstack([np.zeros((1, y.shape[1])), np.cumsum(y ** 2, axis=0)])
    starts = np.arange(0, len(y) - blk + 1, hop)
    z = ((cs[starts + blk] - cs[starts]) / blk).sum(axis=1)
    lk = -0.691 + 10 * np.log10(z + 1e-20)
    g1 = lk > -70
    if not g1.any():
        return -np.inf
    rel = -0.691 + 10 * np.log10(z[g1].mean()) - 10
    g2 = g1 & (lk > rel)
    return float(-0.691 + 10 * np.log10(z[g2].mean()))


def limit(x, ceiling_db=-1.0, look=0.005):
    """Linked look-ahead true-peak limiter; untouched where already under the ceiling."""
    x = as2d(x).copy()
    c = 10 ** (ceiling_db / 20)
    for _ in range(3):
        env = true_peak_env(x)
        if env.max() <= c:
            return x
        k = max(1, n_(look))
        held = minimum_filter1d(np.minimum(1.0, c / np.maximum(env, 1e-12)), 2 * k + 1)
        # averaging over k samples inside a 2k+1 hold can only lower the gain at each peak
        g = uniform_filter1d(held, k) if k > 1 else held
        x = x * g[:, None]
    tp = true_peak_env(x).max()
    return x * (c / tp) if tp > c else x


def quantize(x, rng):
    """24-bit with TPDF dither (+-1 LSB). Returns (int32 array, float view of the stored values)."""
    d = (rng.random(x.shape) - rng.random(x.shape))
    q = np.clip(np.round(x * _FULL + d), -_FULL, _FULL - 1).astype(np.int32)
    return q, q / _FULL


def master(x, rng, ceiling_db=-1.0, mode="peak", target=None, loop=False):
    """peak: one static gain so the true peak sits at the ceiling. lufs: static gain to `target`
    LUFS, then the true-peak limiter at the ceiling. safe (music and provider files): no change when
    the true peak is already under the ceiling, otherwise one static gain DOWN to it; never a limiter,
    so delivered dynamics and transients stay intact. DC removed except in safe mode; rendered
    one-shots get a 3 ms end guard."""
    x = as2d(x)
    c = 10 ** (ceiling_db / 20)
    if mode != "safe":
        x = x - x.mean(axis=0)
    if not loop and mode != "safe":
        x = fade(x, 0, 0.003)
    if mode == "safe":
        tp = true_peak_env(x).max()
        if tp > c:
            x = x * (c / tp)
    elif mode == "peak":
        tp = true_peak_env(x).max()
        x = x * (c / tp) if tp > 0 else x
    elif mode == "lufs":
        if target is None:
            fail("master mode 'lufs' needs a 'target' (e.g. -38 for a room tone)")
        L = lufs_i(x)
        if L is None or not np.isfinite(L):
            fail("cannot measure loudness (file < 0.4 s or silent)", "use master mode 'peak' for short one-shots")
        x = limit(x * 10 ** ((target - L) / 20), ceiling_db)
    else:
        fail("master mode must be 'safe', 'peak' or 'lufs'")
    for _ in range(8):
        q, qf = quantize(x, rng)
        tp = true_peak_env(qf).max()
        if tp <= c:
            return q, qf
        x = x * (c / tp) * 10 ** (-0.005 / 20)
    return q, qf


# ---------------------------------------------------------------- files
def write_wav24(path, q):
    """Write int32 samples (N, ch) holding 24-bit values as 48 kHz / 24-bit PCM WAV (stdlib wave)."""
    os.makedirs(os.path.dirname(os.path.abspath(path)) or ".", exist_ok=True)
    q = as2d(q).astype("<i4")
    raw = q.reshape(-1).view(np.uint8).reshape(-1, 4)[:, :3].tobytes()
    with wave.open(path, "wb") as w:
        w.setnchannels(q.shape[1])
        w.setsampwidth(3)
        w.setframerate(SR)
        w.writeframes(raw)


def read_wav(path):
    """Read 16/24/32-bit integer PCM or 32/64-bit float WAV -> (float array (N, ch), sr)."""
    from scipy.io import wavfile
    if not os.path.isfile(path):
        fail("file not found: " + path)
    try:
        sr, d = wavfile.read(path)
    except Exception as ex:  # noqa: BLE001
        fail("cannot read %s: %s" % (path, ex), "convert first: ffmpeg -i in -c:a pcm_s24le -ar 48000 out.wav")
    if d.dtype == np.int16:
        x = d / 32768.0
    elif d.dtype == np.int32:
        x = d / 2147483648.0
    elif d.dtype == np.uint8:
        x = (d.astype(float) - 128) / 128.0
    else:
        x = d.astype(float)
    return as2d(x), sr


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def metrics(x, sr=SR):
    x = as2d(x)
    mono = x.mean(axis=1)
    n = len(mono)
    k = max(1, int(0.001 * sr))
    env = uniform_filter1d(np.abs(mono), k)
    pk_i = int(np.argmax(env))
    pk = env[pk_i] + 1e-12
    first = int(np.argmax(env >= 0.1 * pk))
    above = np.nonzero(env >= 0.1 * pk)[0]
    t20 = (above[-1] - pk_i) / sr
    spec = np.abs(np.fft.rfft(mono * np.hanning(n))) if n > 1 else np.zeros(1)
    fr = np.fft.rfftfreq(n, 1 / sr)
    p = spec ** 2
    tot = p.sum() + 1e-20
    bands = {"sub": (0, 60), "low": (60, 250), "lowmid": (250, 1000), "mid": (1000, 4000),
             "high": (4000, 10000), "air": (10000, sr / 2 + 1)}
    sp = float(np.max(np.abs(x)))
    L = lufs_i(x, sr)
    return {
        "dur_s": round(n / sr, 3), "channels": x.shape[1], "sr": sr,
        "sample_peak_dbfs": round(20 * np.log10(sp), 2) if sp > 0 else float("-inf"),
        "true_peak_dbtp": round(true_peak_db(x if sr == SR else resample_poly(x, SR, sr, axis=0)), 2),
        "lufs_i": None if L is None else round(L, 1),
        "rms_db": round(10 * np.log10(np.mean(x ** 2) + 1e-20), 1),
        "attack_ms": round((pk_i - first) / sr * 1000, 1),
        "t20_ms": ">end" if above[-1] >= n - max(2, n // 100) else round(t20 * 1000, 1),
        "centroid_hz": int((fr * p).sum() / tot),
        "bands_pct": {b: round(100 * p[(fr >= lo) & (fr < hi)].sum() / tot, 1) for b, (lo, hi) in bands.items()},
        "dc": round(float(np.abs(x.mean(axis=0)).max()), 5),
        "clipped_samples": int((np.abs(x) >= 0.99999).sum()),
        "seam_jump": round(float(np.abs(x[0] - x[-1]).max() / (np.sqrt(np.mean(np.diff(x, axis=0) ** 2)) + 1e-12)), 2) if n > 2 else None,
    }


# ---------------------------------------------------------------- commands
def loop_flag(recipe, args, item_loop):
    """Resolve the loop setting: item 'loop' > args 'loop' > recipe default. Only looping recipes may loop."""
    defaults = recipe_args(recipe)
    loop = bool(item_loop if item_loop is not None else args.get("loop", defaults.get("loop", False)))
    if "loop" in defaults:
        return loop, dict(args, loop=loop)
    if loop:
        fail("recipe %s cannot loop" % recipe, "loop only room_tone or crowd_bed; one-shots never loop")
    return False, args


def slug(s):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s[:40] or "sfx"


def cmd_list(_):
    print("sfx_forge %s  (48 kHz / 24-bit, true-peak mastered)\n" % VERSION)
    for name, (_, desc) in RECIPES.items():
        print("%-10s %s" % (name, desc))
        print("           args: %s" % json.dumps(recipe_args(name)))


def check_item(item, film, version):
    """Validate one spec item; return its output file names (one per variant)."""
    for key in ("id", "recipe", "dur"):
        if key not in item:
            fail("item %s lacks '%s'" % (item.get("id", "?"), key))
    if not re.fullmatch(r"[A-Za-z0-9_-]+", str(item["id"])):
        fail("item id '%s' must be letters, digits, '-' or '_'" % item["id"])
    if item["recipe"] not in RECIPES:
        run_recipe(item["recipe"], 1.0, 1, {})  # prints the unknown-recipe error with suggestions
    try:
        variants = int(item.get("variants", 1))
    except (TypeError, ValueError):
        variants = 0
    if not 1 <= variants <= 12:
        fail("item %s: variants must be 1-12" % item["id"])
    stem = "%s_%s_%s_PROC_%s" % (film, item["id"], slug(item.get("name", item["recipe"])), version)
    return ["%s_t%d.wav" % (stem, k + 1) for k in range(variants)]


def render_item(item, film, version, ceiling, outdir, script_hash):
    rows = []
    names = check_item(item, film, version)
    args = item.get("args", {})
    seed = int(item.get("seed", 1))
    loop, args = loop_flag(item["recipe"], args, item.get("loop"))
    mcfg = item.get("master", {"mode": "peak"})
    if loop and mcfg.get("mode", "peak") == "peak":
        print("  CHECK: %s is a looped bed mastered to peak (very loud); give it "
              "\"master\": {\"mode\": \"lufs\", \"target\": -38}" % item["id"])
    for k, name in enumerate(names):
        x = run_recipe(item["recipe"], float(item["dur"]), seed + k, args)
        q, qf = master(x, np.random.default_rng(seed + 7919 + k), ceiling, mcfg.get("mode", "peak"),
                       mcfg.get("target"), loop)
        path = os.path.join(outdir, name)
        write_wav24(path, q)
        m = metrics(qf)
        rows.append({
            "file": name, "item_id": item["id"], "name": item.get("name", ""), "recipe": item["recipe"],
            "args_json": json.dumps(args, sort_keys=True), "seed": seed + k, "variant": k + 1,
            "dur_s": m["dur_s"], "channels": m["channels"], "sr": SR, "bits": BITS,
            "master_mode": mcfg.get("mode", "peak"), "master_target": mcfg.get("target", ""),
            "ceiling_dbtp": ceiling, "true_peak_dbtp": m["true_peak_dbtp"],
            "sample_peak_dbfs": m["sample_peak_dbfs"], "lufs_i": m["lufs_i"], "attack_ms": m["attack_ms"],
            "t20_ms": m["t20_ms"], "centroid_hz": m["centroid_hz"], "seam_jump": m["seam_jump"] if loop else "",
            "sha256": sha256(path), "script": "sfx_forge.py " + VERSION, "script_sha256": script_hash,
            "origin": "procedural code (non-AI)", "status": "NOT EAR-APPROVED",
            "created_utc": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        })
        print("%-60s TP %6.2f dBTP  LUFS %s  t20 %s  centroid %s Hz" % (
            name, m["true_peak_dbtp"], m["lufs_i"], m["t20_ms"], m["centroid_hz"]))
        tgt = mcfg.get("target")
        if mcfg.get("mode") == "lufs" and tgt is not None and m["lufs_i"] is not None and abs(m["lufs_i"] - tgt) > 0.5:
            print("  CHECK: target %.1f LUFS not reached (%.1f): the true-peak limiter cut it; lower the target "
                  "or accept the quieter file" % (tgt, m["lufs_i"]))
        if m["t20_ms"] == ">end" and not loop and item["recipe"] != "riser":
            print("  CHECK: still loud at the file end (t-20 >end); lengthen 'dur' so the tail can decay")
    return rows


def cmd_render(a):
    try:
        with open(a.spec, encoding="utf-8") as f:
            spec = json.load(f)
    except (OSError, ValueError) as ex:
        fail("cannot read spec %s: %s" % (a.spec, ex))
    items = spec.get("items", [])
    if not items:
        fail("spec has no items")
    ids = [i.get("id") for i in items]
    dup = sorted({i for i in ids if ids.count(i) > 1})
    if dup:
        fail("duplicate item ids: " + ", ".join(map(str, dup)))
    ceiling = float(spec.get("ceiling_dbtp", -1.0))
    if not -6.0 <= ceiling <= 0.0:
        fail("ceiling_dbtp must be between -6 and 0")
    film, version = spec.get("film", "SLA"), spec.get("version", "v01")
    man = os.path.join(a.out, "%s_FX_PROC_manifest_%s.csv" % (film, version))
    targets = [man] + [os.path.join(a.out, f) for it in items for f in check_item(it, film, version)]
    clash = [p for p in targets if os.path.exists(p)]
    if clash and not a.force:
        fail("%d output file(s) already exist, e.g. %s" % (len(clash), clash[0]),
             "raise \"version\" in the spec (v02) so earlier takes stay untouched; "
             "--force only for files nobody has auditioned")
    with open(os.path.abspath(__file__), "rb") as f:
        script_hash = hashlib.sha256(f.read()).hexdigest()
    rows = []
    for item in items:
        rows += render_item(item, film, version, ceiling, a.out, script_hash)
    with open(man, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    print("\n%d files, manifest: %s" % (len(rows), man))
    print("All files are NOT EAR-APPROVED until the user listens and approves each one.")


def check_out(a):
    """Refuse a bad ceiling or an existing output file (Hard rule 8: never overwrite)."""
    if not -6.0 <= a.ceiling <= 0.0:
        fail("--ceiling must be between -6 and 0 dBTP", "use the default -1")
    if os.path.exists(a.o) and not a.force:
        fail("output already exists: " + a.o, "write a new version (_v02 / _t2); --force only for unheard test files")


def cmd_one(a):
    check_out(a)
    try:
        args = json.loads(a.args) if a.args else {}
    except ValueError as ex:
        fail("--args is not valid JSON: %s" % ex, "example: --args '{\"material\": \"glass\"}'")
    if a.recipe not in RECIPES:
        run_recipe(a.recipe, 1.0, 1, {})
    loop, args = loop_flag(a.recipe, args, None)
    x = run_recipe(a.recipe, a.dur, a.seed, args)
    q, qf = master(x, np.random.default_rng(a.seed + 7919), a.ceiling, "peak", None, loop)
    write_wav24(a.o, q)
    print(json.dumps(dict(file=a.o, **metrics(qf)), indent=1))


def cmd_master(a):
    if os.path.realpath(a.input) == os.path.realpath(a.o):
        fail("output would overwrite the input", "write to a new file; raw provider files are never overwritten")
    check_out(a)
    x, sr = read_wav(a.input)
    if sr != SR:
        g = math.gcd(SR, sr)
        x = resample_poly(x, SR // g, sr // g, axis=0)
    if a.mode == "lufs" and a.target is None:
        fail("--mode lufs needs --target")
    q, qf = master(x, np.random.default_rng(a.seed), a.ceiling, a.mode, a.target, loop=True)
    write_wav24(a.o, q)
    m = metrics(qf)
    print(json.dumps(dict(file=a.o, source=a.input, source_sr=sr, mode=a.mode, sha256=sha256(a.o), **m), indent=1))


def cmd_analyze(a):
    for p in a.files:
        x, sr = read_wav(p)
        print(json.dumps(dict(file=p, **metrics(x, sr)), indent=1))


def main():
    ap = argparse.ArgumentParser(description="Procedural SFX: render, master (-1 dBTP), 48 kHz/24-bit WAV.")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("list", help="list recipes and their arguments").set_defaults(fn=cmd_list)
    r = sub.add_parser("render", help="render every item of a spec JSON")
    r.add_argument("spec")
    r.add_argument("--out", required=True)
    r.add_argument("--force", action="store_true", help="overwrite existing files (never for auditioned takes)")
    r.set_defaults(fn=cmd_render)
    o = sub.add_parser("one", help="render one recipe quickly (peak-mastered)")
    o.add_argument("recipe")
    o.add_argument("--dur", type=float, default=1.0)
    o.add_argument("--seed", type=int, default=1)
    o.add_argument("--args", default="")
    o.add_argument("--ceiling", type=float, default=-1.0)
    o.add_argument("-o", required=True)
    o.add_argument("--force", action="store_true", help="overwrite an existing output file")
    o.set_defaults(fn=cmd_one)
    mm = sub.add_parser("master", help="conform an existing WAV to 48 kHz / 24-bit with a true-peak ceiling")
    mm.add_argument("input")
    mm.add_argument("-o", required=True)
    mm.add_argument("--mode", choices=("safe", "peak", "lufs"), default="safe")
    mm.add_argument("--target", type=float)
    mm.add_argument("--ceiling", type=float, default=-1.0)
    mm.add_argument("--seed", type=int, default=1)
    mm.add_argument("--force", action="store_true", help="overwrite an existing output file (never the input)")
    mm.set_defaults(fn=cmd_master)
    z = sub.add_parser("analyze", help="metrics for WAV files (true peak, LUFS, attack, t-20, bands)")
    z.add_argument("files", nargs="+")
    z.set_defaults(fn=cmd_analyze)
    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
