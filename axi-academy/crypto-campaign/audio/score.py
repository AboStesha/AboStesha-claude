"""Music + SFX for the Axi Iraq «Buy Crypto» campaign — five beds, five styles, every on-screen action synced.

  c1  «امتلكها»          15 s · 140 BPM dark trap: a filtered intro under the hook, the drop when the price line
                         collapses into the coin, an impact per fact, a coin «ching», a big chord on the CTA.
                         Music-led (no voice windows).
  c2  «أين تُحفظ عملاتك؟» 20 s · 96 BPM ambient glass: pads, a bell arpeggio and a soft pulse; glass clinks as the
                         coins land in the wallet, a slide and a lock for «منفصلة», pops for buy/sell/store.
  c3  «3 خطوات»          30 s · 122 BPM tech-house: four-on-the-floor, offbeat hats and shakers; every tap, key,
                         sheet, screen push, toast and the purchase chime has its sound.
  c4  «مستثمر أم متداول؟» 45 s · 105 BPM explainer bed: warm keys and a light beat; card deals and swings, a tick
                         per spec row, a chime for «حساب واحد».
  c5  «5 أسئلة»          40 s · 100 BPM light pop under the presenter: whooshes for the window moves, a pop per
                         question card and sticker, a typing-dots tick for the comments CTA.

Voice (or presenter) windows are pre-ducked (c2–c4: −5 dB, c5: −7 dB, with a 1–3 kHz dip). Each bed is
band-limited to 17 kHz and mastered to −17 LUFS, true peak ≤ −1.3 dBTP.

Usage: python -I score.py c1|c2|c3|c4|c5 out.wav
"""
import os, sys
import numpy as np
import soundfile as sf
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import synthkit as sk
from synthkit import SR, T, lp, hp, bp, midi, Bus, env, saw, pad, mallet, bell, noise, sweep_noise, whoosh, click, sub_boom, ting, zip_up, blip, reverse_swell, kick, hat, bass_pluck, reverb_ir, reverb, lufs, true_peak


# ---------------------------------------------------------------- instruments
def clap(seed=0, bright=5200):
    t = T(0.25); n = bp(noise(0.25, seed), 900, bright)
    e = sum(np.exp(-np.maximum(0, t - d) * (90 if k < 2 else 20)) * (t >= d) for k, d in enumerate([0, 0.011, 0.022]))
    return n * e * 0.8
def snare(seed=0):
    t = T(0.3); n = bp(noise(0.3, seed), 1500, 9000) * np.exp(-t * 18)
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.6
    return (n + body) * 0.8
def shaker(seed=0, g=1.0):
    t = T(0.08); return hp(noise(0.08, seed), 6000) * np.exp(-t * 55) * np.minimum(1, t * 900) * g
def rim(seed=0):
    t = T(0.06); return (bp(noise(0.06, seed), 1800, 5000) * 0.6 + np.sin(2 * np.pi * 1700 * t) * 0.5) * np.exp(-t * 90)
def bass808(f, d=0.9, slide=1.0):
    t = T(d); fr = f * (1 + 0.45 * np.exp(-t * 28)) * (slide + (1 - slide) * np.minimum(1, t / 0.12))
    s = np.sin(2 * np.pi * np.cumsum(fr) / SR); s = np.tanh(s * 1.8) / np.tanh(1.8)
    return s * np.exp(-t * (2.4 / d)) * np.minimum(1, t * 400)
def pluck(f, d=0.45, bright=1.4):
    t = T(d); mod = np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 22) * bright
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 8) * np.minimum(1, t * 600)
def keys(f, d=1.2):
    t = T(d); s = sum(np.sin(2 * np.pi * f * k * t) * a * np.exp(-t * (2.2 + k)) for k, a in ((1, 1), (2, 0.35), (3, 0.12), (4, 0.06)))
    return s * np.minimum(1, t * 300) * 0.7
def stab(notes, d=0.7, cut=3200):
    s = sum(saw(midi(m), d, 30, dt, m) for m in notes for dt in (-6, 6)) / (2 * len(notes))
    t = T(d); lo, hi = lp(s, 700), lp(s, cut); k = np.exp(-t * 9)
    return (lo + (hi - lo) * k) * env(len(t), 0.004, 0.2, 0.35, 0.35)
def pop(f=900, d=0.09):
    t = T(d); return np.sin(2 * np.pi * np.cumsum(f * (1 + 1.2 * np.exp(-t * 60))) / SR) * np.exp(-t * 45) * 0.9
def chime(f=midi(88)):
    out = np.zeros(int(1.4 * SR))
    for ff, dt in ((f, 0.0), (f * 1.4983, 0.08)):
        b = bell(ff, 1.3, 2.6); i = int(dt * SR); out[i:i + len(b)] += b[:len(out) - i]
    return out
def coin(f=2650, d=1.1, seed=0):
    """a metallic «ching»: inharmonic partials + a tiny transient"""
    t = T(d); r = np.random.default_rng(seed); s = np.zeros_like(t)
    for k, (m, a, dec) in enumerate(((1, 1, 5), (2.76, 0.6, 7), (5.40, 0.4, 10), (8.93, 0.25, 14), (13.3, 0.12, 20))):
        s += np.sin(2 * np.pi * f * m * (1 + r.uniform(-0.003, 0.003)) * t + r.uniform(0, 6)) * a * np.exp(-t * dec)
    s += hp(noise(d, seed), 5000) * np.exp(-t * 120) * 0.4
    return s * 0.45
def clink(f=3400, seed=0):
    t = T(0.5); s = sum(np.sin(2 * np.pi * f * m * t) * a * np.exp(-t * dc) for m, a, dc in ((1, 1, 14), (2.3, 0.5, 20), (4.1, 0.3, 30)))
    return (s + hp(noise(0.5, seed), 6000) * np.exp(-t * 200) * 0.5) * 0.5
def lock(seed=0):
    t = T(0.25); s = np.sin(2 * np.pi * 120 * t) * np.exp(-t * 40) * 0.8; c = click(3200, 0.012, seed)
    s[:len(c)] += c * 0.9
    return s
def tap(seed=0):
    t = T(0.05); return bp(noise(0.05, seed), 1800, 6500) * np.exp(-t * 260) * 1.3 + np.sin(2 * np.pi * 180 * t) * np.exp(-t * 120) * 0.3
def riser(d, seed=7):
    t = T(d); s = sweep_noise(d, 300, 7500, 1.5, seed, 2.0) * (t / d) ** 2.2 * 0.8
    s += saw(110 * 2 ** (1.5 * (t / d) ** 2), d, 18) * (t / d) ** 2 * 0.1
    return s
def impact(bus, t0, g=1.0, seed=0):
    bus.add(sub_boom(58, 34, 1.3, 1.6), t0, 0.5 * g); bus.add(kick(0.35), t0, 0.45 * g)
    n = lp(noise(0.6, seed), 3000) * np.exp(-T(0.6) * 7); bus.add(n, t0, 0.18 * g)
def typing(bus, t0, n, cps, g=0.08, seed=0, pan=0.25):
    r = np.random.default_rng(seed)
    for i in range(n):
        tt = t0 + i / cps + r.uniform(-0.01, 0.01); bus.add(click(2600 + r.random() * 2400, 0.008, seed * 997 + i), tt, g * (0.7 + 0.5 * r.random()), r.uniform(-pan, pan))

# ---------------------------------------------------------------- patterns
def grid(bpm): return lambda b: b * 60.0 / bpm
def pads(mus, B, b0, b1, chords, g=0.3, cut=1600, bars=4):
    b = b0
    while b < b1 - 1e-6:
        bar = int(b // bars); nb = min(b1, (bar + 1) * bars); d = B(nb - b) + 0.6
        mus.add(pad(chords[bar % len(chords)], d, cut, 0.08, 0.5, 11 + bar), B(b), g); b = nb
def arp(mus, B, b0, b1, chords, g=0.08, step=0.5, octave=12, pan=0.3, inst=pluck, bars=4):
    b = b0; k = 0
    while b < b1 - 1e-6:
        ch = chords[int(b // bars) % len(chords)]; m = ch[[0, 2, 1, 3, 2, 1, 3, 2][k % 8] % len(ch)] + octave
        mus.add(inst(midi(m)), B(b), g, pan * (1 if k % 2 else -1)); b += step; k += 1
def duck_env(n, windows, depth_db=-5.0, ramp=0.08):
    t = np.arange(n) / SR; g = np.zeros_like(t)
    for a, b in windows: g = np.maximum(g, np.clip(np.minimum((t - a + ramp) / ramp, (b + ramp - t) / ramp), 0, 1))
    return 10 ** (depth_db * g / 20), g


# ================================================================= c1 · trap 140
def design_c1():
    sk.set_duration(15.0); sfx, mus = Bus(), Bus(); B = grid(140)
    T_REV, T_F1, T_F2, T_F3, T_F4, T_END = B(8), B(12), B(15.5), B(19), B(22.5), B(26)
    Am, F, Dm, E = [57, 60, 64], [53, 57, 60], [50, 53, 57], [52, 56, 59]
    PROG = [Am, F, Dm, E]; ROOT = [33, 29, 26, 28]
    # intro: filtered pluck motif + hats, a riser into the collapse
    for k, m in enumerate([69, 72, 76, 74, 72, 69, 67, 69]): mus.add(lp(pluck(midi(m), 0.4), 2600), B(k * 0.5), 0.2, (k % 2 - 0.5) * 0.4)
    for k in range(8): mus.add(hat(0.035, 300 + k), B(k * 0.5 + 0.25), 0.08, 0.3)
    for k in range(4): mus.add(kick(0.25), B(k), 0.22 + 0.04 * k)   # a heartbeat under the hook
    mus.add(pad([45, 52, 57, 60], B(4) + 0.4, 1100, 0.05, 0.3, 3), 0, 0.3)
    sfx.add(riser(1.5, 3), B(4) - 1.5, 0.22); sfx.add(reverse_swell(0.4, 4, 1500), B(4) - 0.4, 0.24)
    for k, tt in enumerate((0.0, 0.22, 0.44)): sfx.add(pop(820 + 90 * k, 0.07), tt, 0.12)
    # the collapse: drop
    impact(sfx, B(4), 1.1, 1); sfx.add(coin(2650, 1.2, 1), B(4) + 0.02, 0.32); sfx.add(whoosh(0.3, 3000, 300, 2, (0.2, 0.8)), B(4) - 0.28, 0.2)
    for k, tt in enumerate((B(4.25), B(4.25) + 0.18)): sfx.add(pop(1100 + 200 * k, 0.08), tt, 0.16)
    def beat(b0, b1, rolls=()):
        b = b0
        while b < b1 - 1e-6:
            bb = round(b) % 4
            if bb == 0 or (bb == 2 and (b // 4) % 2 == 1): mus.add(kick(0.3), B(b), 0.5)
            if bb == 2: mus.add(clap(int(b * 3), 6200), B(b), 0.32, 0.05); mus.add(snare(int(b * 5)), B(b), 0.14)
            for h in (0, 0.5): mus.add(hat(0.035, int(b * 8 + h * 3)), B(b + h), 0.07, 0.25)
            b += 1
        for r0 in rolls:
            for k in range(8): mus.add(hat(0.025, 900 + k), B(r0 + k * 0.125), 0.05 + 0.006 * k, 0.25)
    def bass(b0, b1):
        b = b0
        while b < b1 - 1e-6:
            bar = int(b // 4); r = ROOT[bar % 4]
            for p, d in ((0, 1.4), (1.5, 0.5), (2.5, 0.9)):
                if b0 <= bar * 4 + p < b1: mus.add(bass808(midi(r + 12), B(d) + 0.1, 1.06 if p else 1.0), B(bar * 4 + p), 0.42)
            b = (bar + 1) * 4
    beat(4, 7.5, rolls=(7,)); bass(4, 8); pads(mus, B, 4, 26, PROG, 0.2, 1400)
    # reveal (zoom cut)
    sfx.add(whoosh(0.4, 400, 6000, 5, (0.6, 0.4)), T_REV - 0.2, 0.22); impact(sfx, T_REV, 0.8, 2)
    for k in range(3): sfx.add(pop(950 + 80 * k, 0.07), T_REV + 0.08 + 0.1 * k, 0.1)
    sfx.add(reverse_swell(0.3, 6, 2500), T_REV - 0.05, 0.1); sfx.add(zip_up(0.25, 7), T_REV + 0.55, 0.1)
    for k, dl in enumerate((0.25, 0.4, 0.55)): sfx.add(coin(2400 + 300 * k, 0.9, 10 + k), T_REV + dl + 0.12, 0.16, (k - 1) * 0.5)
    beat(8.5, 26, rolls=(11, 15, 18.5, 22)); bass(8, 26)
    for k, m in enumerate([76, 74, 72, 69] * 4): mus.add(pluck(midi(m), 0.3), B(12 + k), 0.05, (k % 2 - 0.5) * 0.6)
    # facts: an impact per slam, the count-up ticks, the clock sweep, the coin drop and the lock
    for tt in (T_F1, T_F2, T_F3, T_F4): sfx.add(whoosh(0.3, 500, 6000, int(tt * 10), (0.7, 0.3)), tt - 0.22, 0.18, 0.3); impact(sfx, tt, 0.55, int(tt * 7))
    sfx.add(pop(1300, 0.08), T_F1 + 0.12, 0.2); sfx.add(coin(2800, 1.0, 21), T_F1 + 0.14, 0.12)
    for k in range(18): sfx.add(click(3000 + 120 * k, 0.006, 40 + k), T_F2 + 0.04 + k * 0.038, 0.06 + 0.002 * k)
    sfx.add(pop(1500, 0.07), T_F2 + 0.7, 0.2)
    for k in range(9): sfx.add(clink(3000 + 260 * (k % 4), 60 + k), T_F2 + 0.15 + k * 0.11, 0.05, (k % 3 - 1) * 0.6)
    sfx.add(sweep_noise(1.2, 800, 5000, 2.0, 70, 1.0) * np.linspace(0.2, 1, int(1.2 * SR)) * 0.25, T_F3 + 0.05, 0.4); sfx.add(ting(3200, 0.9), T_F3 + 1.25, 0.05)
    sfx.add(whoosh(0.45, 4000, 400, 80, (0.3, 0.7)), T_F4 + 0.25, 0.16); sfx.add(coin(2200, 1.0, 81), T_F4 + 0.7, 0.3); sfx.add(lock(82), T_F4 + 0.8, 0.4)
    # end card
    sfx.add(riser(0.8, 90), T_END - 0.8, 0.22); sfx.add(whoosh(0.42, 300, 5200, 91, (0.5, 0.5)), T_END - 0.21, 0.2)
    impact(sfx, T_END, 1.0, 92); mus.add(stab([57, 64, 69, 72, 76], 1.0), T_END, 0.42); mus.add(bass808(midi(33), 2.4), T_END, 0.45)
    mus.add(pad([57, 64, 69, 72, 76], 4.4, 2200, 0.08, 1.4, 93), T_END, 0.3)
    b = 28
    while b < 34.5: mus.add(kick(0.3), B(b), 0.3); mus.add(clap(int(b), 6000), B(b + 1), 0.16); b += 2
    sfx.add(coin(2650, 1.4, 94), T_END + 0.12, 0.18); sfx.add(pop(900, 0.1), T_END + 0.72, 0.26); sfx.add(ting(3000, 1.0), T_END + 1.35, 0.04)
    return sfx, mus, [], 0.0


# ================================================================= c2 · ambient glass 96
VO_C2 = [(0.15, 2.4), (2.7, 6.0), (6.4, 11.0), (11.4, 15.3), (15.8, 19.6)]
def design_c2():
    sk.set_duration(20.0); sfx, mus = Bus(), Bus(); B = grid(96)
    T_W, T_SEP, T_ACT, T_END = B(4), B(10), B(18), B(25); ARR = [B(5), B(6), B(7)]
    D9, Bm9, G7, A6 = [50, 54, 57, 61, 64], [47, 50, 54, 57, 61], [43, 47, 50, 54, 57], [45, 49, 52, 54, 57]
    PROG = [D9, Bm9, G7, A6]
    pads(mus, B, 0, 32, PROG, 0.32, 1500)
    arp(mus, B, 0, 31, [[62, 66, 69, 73], [59, 62, 66, 69], [55, 59, 62, 66], [57, 61, 64, 66]], 0.06, 0.5, 12, 0.35, lambda f: mallet(f, 1.0, 1.0))
    b = 4
    while b < 31:
        mus.add(kick(0.3), B(b), 0.22); mus.add(shaker(int(b * 4)), B(b + 0.5), 0.05, 0.3)
        if int(b) % 2 == 0: mus.add(rim(int(b)), B(b + 1), 0.06, -0.2)
        b += 1
    b = 4
    while b < 31: mus.add(lp(bass_pluck(midi(PROG[int(b // 4) % 4][0] - 12), B(1.6), 500), 500), B(b), 0.3); b += 2
    # hook
    for k in range(4): sfx.add(pop(800 + 60 * k, 0.07), 0.0 + 0.1 * k, 0.08)
    for k in range(3): sfx.add(pop(1000 + 90 * k, 0.08), 0.45 + 0.14 * k, 0.12)
    sfx.add(reverse_swell(0.8, 2, 2600), T_W - 0.8, 0.14)
    # the wallet card rises; coins fly in and clink into their rows
    sfx.add(whoosh(0.7, 300, 3000, 3, (0.4, 0.6)), T_W - 0.1, 0.16); sfx.add(sub_boom(70, 45, 0.9, 1.2), T_W + 0.2, 0.18)
    for k, ta in enumerate(ARR): sfx.add(whoosh(0.5, 600, 4500, 10 + k, (0.6, 0.4)), ta - 0.25, 0.1, 0.3); sfx.add(clink(3000 + 300 * k, 11 + k), ta + 0.4, 0.22, 0.2); sfx.add(coin(2500 + 200 * k, 0.8, 14 + k), ta + 0.42, 0.08, 0.2)
    for k in range(3): sfx.add(pop(1000 + 80 * k, 0.07), T_W + 0.15 + 0.12 * k, 0.08)
    # move aside, the trading card, the divider and its lock
    sfx.add(whoosh(0.9, 1200, 300, 20, (0.5, 0.5)), T_SEP, 0.12, -0.3); sfx.add(whoosh(0.6, 400, 3500, 21, (0.6, 0.4)), T_SEP + 0.35, 0.12, 0.5)
    sfx.add(sweep_noise(0.6, 3000, 800, 2.0, 22, 1.0) * np.exp(-T(0.6) * 3) * 0.3, T_SEP + 0.9, 0.3); sfx.add(lock(23), T_SEP + 1.3, 0.38); sfx.add(chime(midi(86)), T_SEP + 1.35, 0.06)
    for k in range(2): sfx.add(pop(950 + 100 * k, 0.07), T_SEP + 0.2 + 0.35 * k, 0.08)
    # buy · sell · store, then the three ways to fund
    sfx.add(whoosh(0.9, 300, 1500, 30, (0.5, 0.5)), T_ACT, 0.1)
    for n in range(3): sfx.add(pop(1100 + 150 * n, 0.08), T_ACT + 0.6 + n * B(1), 0.2, (n - 1) * 0.4)
    for i in range(3): sfx.add(pop(900 + 120 * i, 0.08), T_ACT + B(4.2) + i * 0.12, 0.16, (1 - i) * 0.4)
    sfx.add(ting(2900, 0.9), T_ACT + B(5.2), 0.04)
    # end card
    sfx.add(sweep_noise(0.6, 1500, 6000, 1.5, 40, 1.0) * np.sin(np.linspace(0, np.pi, int(0.6 * SR))) * 0.25, T_END - 0.3, 0.3)
    mus.add(pad([50, 57, 62, 66, 69, 73], 4.8, 2200, 0.1, 1.5, 41), T_END, 0.28); sfx.add(bell(midi(86), 2.0, 2.0), T_END + 0.25, 0.08)
    sfx.add(pop(900, 0.1), T_END + 0.8, 0.24); sfx.add(ting(3000, 1.0), T_END + 1.45, 0.04)
    return sfx, mus, VO_C2, -5.0


# ================================================================= c3 · tech-house 122
VO_C3 = [(0.2, 2.3), (2.7, 8.9), (9.4, 16.0), (16.5, 23.3), (23.8, 26.3), (26.8, 29.6)]
def design_c3():
    sk.set_duration(30.0); sfx, mus = Bus(), Bus(); B = grid(122)
    T1, T2, T3, T4, T_END = B(5), B(18.5), B(33), B(48), B(54)
    C7, Am7, F7, G = [48, 52, 55, 59], [45, 48, 52, 55], [41, 45, 48, 52], [43, 47, 50, 55]
    PROG = [C7, Am7, F7, G]; ROOT = [36, 33, 29, 31]
    pads(mus, B, 0, 61, PROG, 0.2, 1700)
    b = 0
    while b < 54:
        if b >= 2: mus.add(kick(0.28), B(b), 0.36)
        mus.add(hat(0.05, int(b * 3) + 5), B(b + 0.5), 0.08, 0.25)
        if b >= 5 and round(b) % 2 == 1: mus.add(clap(int(b * 7), 5600), B(b), 0.18, 0.05)
        if b >= 5:
            for s in (0.25, 0.75): mus.add(shaker(int(b * 11 + s * 4), 0.9), B(b + s), 0.035, -0.3)
            mus.add(bass_pluck(midi(ROOT[int(b // 4) % 4] + 12), B(0.4), 900), B(b + 0.5), 0.28)
        b += 1
    for k in range(0, 54, 4): mus.add(stab([n + 12 for n in PROG[(k // 4) % 4]], 0.35, 2600), B(k + 2.5), 0.08)
    # hook
    for k, tt in enumerate((0.0, 0.12, 0.4, 0.5, 0.6, 0.7)): sfx.add(pop(850 + 60 * k, 0.07), tt, 0.09)
    sfx.add(pop(1300, 0.07), 0.9, 0.16); sfx.add(whoosh(0.8, 300, 2500, 1, (0.4, 0.6)), 0.15, 0.14)
    # step headers
    for tt in (T1, T2, T3): sfx.add(whoosh(0.35, 600, 5000, int(tt * 9), (0.6, 0.4)), tt - 0.15, 0.12, 0.4); sfx.add(blip(1320, 0.05), tt + 0.2, 0.06)
    # taps, keys, sheets, pushes
    taps = [B(7), B(10), B(11.8), B(12.6), B(13.4), B(15), B(26), B(33.6), B(39.5)]
    for k, tt in enumerate(taps): sfx.add(tap(100 + k), tt, 0.42); sfx.add(click(2600, 0.012, 200 + k), tt + 0.004, 0.1)
    for tt in (B(7.6), B(34.2)): sfx.add(whoosh(0.4, 2500, 600, int(tt * 5), (0.3, 0.7)), tt, 0.12)
    for tt in (B(10.6), B(19), B(26.6), B(44.5)): sfx.add(whoosh(0.3, 800, 4500, int(tt * 3), (0.5, 0.5)), tt - 0.05, 0.1, -0.4)
    sfx.add(whoosh(0.3, 4500, 800, int(B(17.5) * 3), (0.5, 0.5)), B(17.5) - 0.05, 0.08, 0.4)  # back to home
    sfx.add(chime(midi(84)), B(15.6), 0.08); sfx.add(pop(1200, 0.07), B(15.6) + 0.05, 0.12)
    # the market list scrolls
    for k in range(12): sfx.add(click(3600, 0.005, 300 + k), B(21) + k * 0.09, 0.04)
    for k in range(8): sfx.add(click(3400, 0.005, 320 + k), B(21) + 1.5 + k * 0.08, 0.035)
    # the purchase: loading, success chime, sub
    sfx.add(sweep_noise(0.5, 1500, 4000, 2.0, 400, 1.0) * np.linspace(0.3, 1, int(0.5 * SR)) * 0.15, B(39.5) + 0.12, 0.3)
    sfx.add(chime(midi(88)), B(41), 0.14); sfx.add(sub_boom(66, 44, 1.0, 1.2), B(41), 0.2); sfx.add(coin(2650, 1.1, 401), B(41) + 0.05, 0.12)
    # callouts
    for k, bb in enumerate((9, 12.5, 15.5, 19.5, 27.4, 35.2, 41.4)): sfx.add(pop(1000 + 70 * (k % 4), 0.08), B(bb), 0.16, (k % 2 - 0.5) * 0.4)
    # features
    sfx.add(whoosh(0.8, 1200, 300, 50, (0.5, 0.5)), T4 - 0.1, 0.12)
    for i in range(3): sfx.add(whoosh(0.25, 800, 5000, 51 + i, (0.6, 0.4)), T4 + 0.45 + i * B(1), 0.1, 0.4); sfx.add(pop(1100 + 120 * i, 0.08), T4 + 0.55 + i * B(1), 0.16)
    # end card
    sfx.add(riser(0.9, 60), T_END - 0.9, 0.18); impact(sfx, T_END, 0.8, 61); mus.add(stab([60, 64, 67, 71, 76], 0.9), T_END, 0.32)
    mus.add(pad([48, 55, 60, 64, 67, 71], 3.6, 2200, 0.08, 1.2, 62), T_END, 0.26)
    b = 56
    while b < 61: mus.add(kick(0.28), B(b), 0.26); mus.add(hat(0.05, int(b * 3)), B(b + 0.5), 0.06, 0.25); b += 1
    sfx.add(pop(900, 0.1), T_END + 0.75, 0.24); sfx.add(ting(3000, 1.0), T_END + 1.4, 0.04)
    return sfx, mus, VO_C3, -5.0


# ================================================================= c4 · explainer 105
VO_C4 = [(0.2, 3.8), (4.3, 12.6), (13.3, 21.6), (22.3, 30.6), (31.3, 38.2), (38.8, 44.5)]
def design_c4():
    sk.set_duration(45.0); sfx, mus = Bus(), Bus(); B = grid(105)
    T_DEAL, C1, C2, C3, T_CMP, T_ONE, T_END = B(3.5), B(7), B(22.75), B(38.5), B(54.25), B(61), B(67.4)
    Em7, C7, G6, D = [52, 55, 59, 62], [48, 52, 55, 59], [43, 47, 50, 52], [50, 54, 57, 61]
    PROG = [Em7, C7, G6, D]; ROOT = [40, 36, 43, 38]
    pads(mus, B, 0, 79, PROG, 0.24, 1500)
    arp(mus, B, 7, 66, [[64, 67, 71, 74], [60, 64, 67, 71], [55, 59, 62, 64], [62, 66, 69, 73]], 0.05, 1.0, 12, 0.3, lambda f: keys(f, 1.1))
    b = 3.5
    while b < 67:
        bb = int(b) % 4
        if bb in (0, 2): mus.add(kick(0.28), B(b), 0.26)
        if bb in (1, 3): mus.add(rim(int(b * 3)), B(b), 0.08, 0.1)
        mus.add(hat(0.04, int(b * 5)), B(b + 0.5), 0.045, 0.3)
        if bb == 0: mus.add(lp(bass_pluck(midi(ROOT[int(b // 4) % 4] - 12 + 12), B(2.0), 420), 420), B(b), 0.3)
        b += 1
    # hook: question pops, the two tiles, the divider
    sfx.add(pop(900, 0.08), 0.0, 0.12); sfx.add(pop(1050, 0.08), 0.55, 0.14); sfx.add(pop(1250, 0.08), 0.69, 0.16)
    for tt in (0.2, 0.75): sfx.add(whoosh(0.3, 600, 4500, int(tt * 10), (0.6, 0.4)), tt - 0.05, 0.1); sfx.add(pop(1100, 0.08), tt + 0.12, 0.14)
    sfx.add(zip_up(0.4, 3), 1.0, 0.06)
    # the deal
    for k in range(4): sfx.add(pop(950 + 70 * k, 0.07), T_DEAL + 0.1 * k, 0.08)
    for k in range(3): sfx.add(whoosh(0.3, 3000, 600, 20 + k, (0.4, 0.6)), T_DEAL + 0.25 + k * 0.18, 0.12, (1 - k) * 0.5); sfx.add(click(2200, 0.015, 30 + k), T_DEAL + 0.45 + k * 0.18, 0.18)
    # each card: swing in, a tick per row, the «best for» chip, swing out
    for c0, kind in ((C1, 'zoom'), (C2, 'slab'), (C3, 'slab')):
        sfx.add(whoosh(0.45, 400, 5000, int(c0 * 7), (0.6, 0.4)), c0 - 0.25, 0.16, 0.3); sfx.add(sub_boom(66, 42, 0.8, 1.2), c0, 0.16)
        for i in range(5): sfx.add(blip(1180 + 90 * i, 0.05), c0 + 0.9 + i * B(1.5), 0.06, -0.2); sfx.add(click(3000, 0.006, int(c0 * 100) + i), c0 + 0.9 + i * B(1.5), 0.05)
        sfx.add(pop(1300, 0.08), c0 + 0.9 + 5 * B(1.5) + 0.12, 0.18)
    # compare, then one account
    sfx.add(whoosh(0.45, 400, 5000, 80, (0.6, 0.4)), T_CMP - 0.25, 0.16)
    for i in range(3): sfx.add(pop(900 + 120 * i, 0.08), T_CMP + 0.25 + i * 0.15, 0.14, (1 - i) * 0.5)
    for k in range(3): sfx.add(blip(1320 + 120 * k, 0.05), T_CMP + 0.9 + k * B(1.5), 0.07)
    sfx.add(whoosh(0.9, 1500, 300, 90, (0.5, 0.5)), T_ONE, 0.14); sfx.add(chime(midi(86)), T_ONE + 0.5, 0.12); sfx.add(sub_boom(62, 40, 1.0, 1.2), T_ONE + 0.45, 0.2)
    for k in range(3): sfx.add(pop(1000 + 100 * k, 0.07), T_ONE + 0.3 + 0.12 * k, 0.08)
    sfx.add(pop(1400, 0.08), T_ONE + 0.9, 0.14)
    for i in range(3): sfx.add(pop(1100 + 120 * i, 0.07), T_ONE + 1.2 + i * 0.15, 0.12)
    # end card
    sfx.add(sweep_noise(0.6, 1500, 6000, 1.5, 95, 1.0) * np.sin(np.linspace(0, np.pi, int(0.6 * SR))) * 0.25, T_END - 0.3, 0.3)
    mus.add(stab([52, 59, 64, 67, 71], 1.0), T_END, 0.3); mus.add(pad([52, 59, 64, 67, 71, 74], 6.6, 2200, 0.1, 1.6, 96), T_END, 0.28)
    sfx.add(bell(midi(88), 1.8, 2.0), T_END + 0.2, 0.07); sfx.add(pop(900, 0.1), T_END + 0.75, 0.24); sfx.add(ting(3000, 1.0), T_END + 1.4, 0.04)
    return sfx, mus, VO_C4, -5.0


# ================================================================= c5 · light pop 100 under the presenter
VO_C5 = [(0.2, 2.9), (3.4, 8.6), (9.4, 14.6), (15.4, 20.6), (21.4, 26.6), (27.4, 32.6), (33.4, 36.4)]
def design_c5():
    sk.set_duration(40.0); sfx, mus = Bus(), Bus(); B = grid(100)
    Q0, QD, T_CTA, T_OUT, T_END = 3.0, 6.0, 33.0, 36.6, 36.8
    F7, Dm7, Bb7, C = [53, 57, 60, 64], [50, 53, 57, 60], [46, 50, 53, 57], [48, 52, 55, 60]
    PROG = [F7, Dm7, Bb7, C]; ROOT = [41, 38, 34, 36]
    pads(mus, B, 0, 67, PROG, 0.26, 1500)
    arp(mus, B, 4, 61, [[65, 69, 72, 76], [62, 65, 69, 72], [58, 62, 65, 69], [60, 64, 67, 72]], 0.05, 1.0, 12, 0.3)
    b = 4
    while b < 61:
        bb = int(b) % 4
        if bb in (0, 2): mus.add(kick(0.28), B(b), 0.24)
        if bb in (1, 3): mus.add(clap(int(b * 3), 5000), B(b), 0.1, 0.05)
        mus.add(hat(0.04, int(b * 7)), B(b + 0.5), 0.045, 0.3)
        if bb == 0: mus.add(lp(bass_pluck(midi(ROOT[int(b // 4) % 4]), B(1.8), 500), 500), B(b), 0.3); mus.add(lp(bass_pluck(midi(ROOT[int(b // 4) % 4]), B(0.8), 500), 500), B(b + 2.5), 0.2)
        b += 1
    # hook
    impact(sfx, 0.0, 0.5, 1); sfx.add(pop(1200, 0.08), 0.02, 0.16)
    for k in range(6): sfx.add(pop(900 + 50 * k, 0.07), 0.45 + 0.08 * k, 0.07)
    # window moves, question cards, stickers
    for i in range(5):
        t0 = Q0 + i * QD
        sfx.add(whoosh(0.6, 500, 3200, 10 + i, (0.5, 0.5)), t0, 0.1, 0.4 if i % 2 == 0 else -0.4)
        sfx.add(whoosh(0.35, 700, 5000, 20 + i, (0.6, 0.4)), t0 + 0.05, 0.1); sfx.add(pop(1000, 0.08), t0 + 0.2, 0.16); sfx.add(blip(1320 + 60 * i, 0.05), t0 + 0.3, 0.05)
        for k in range(3): sfx.add(pop(1100 + 150 * k, 0.08), t0 + 1.2 + k * 1.2, 0.18, -0.4 if i % 2 == 0 else 0.4)
        sfx.add(whoosh(0.3, 2500, 600, 30 + i, (0.4, 0.6)), t0 + QD - 0.35, 0.06)
    sfx.add(whoosh(0.6, 500, 3200, 40, (0.5, 0.5)), T_CTA, 0.1)
    # comments CTA: the bubble, typing-dot ticks
    sfx.add(pop(1100, 0.08), T_CTA + 0.4, 0.16); sfx.add(pop(950, 0.08), T_CTA + 0.2, 0.1)
    for k in range(10): sfx.add(click(3200 + 200 * (k % 3), 0.006, 50 + k), T_CTA + 0.6 + k * 0.25, 0.03)
    # end card
    sfx.add(sweep_noise(0.6, 1500, 6000, 1.5, 60, 1.0) * np.sin(np.linspace(0, np.pi, int(0.6 * SR))) * 0.25, T_END - 0.3, 0.3)
    mus.add(stab([53, 60, 65, 69, 72], 1.0), T_END, 0.3); mus.add(pad([53, 60, 65, 69, 72, 76], 3.6, 2200, 0.1, 1.4, 61), T_END, 0.28)
    sfx.add(bell(midi(89), 1.8, 2.0), T_END + 0.15, 0.07); sfx.add(pop(900, 0.1), T_END + 0.7, 0.24); sfx.add(ting(3000, 1.0), T_END + 1.35, 0.04)
    return sfx, mus, VO_C5, -7.0


if __name__ == '__main__':
    which, out = sys.argv[1], sys.argv[2]
    sfx, mus, vo, depth = {'c1': design_c1, 'c2': design_c2, 'c3': design_c3, 'c4': design_c4, 'c5': design_c5}[which]()
    M = mus.st()
    if vo:
        g, w = duck_env(len(M), vo, depth)
        vband = np.stack([bp(M[:, 0], 900, 3200), bp(M[:, 1], 900, 3200)], 1)
        M = (M - 0.45 * vband * w[:, None]) * g[:, None]
    S = reverb(sfx.st(), reverb_ir(1.4, 7), 0.14); M = reverb(M, reverb_ir(1.8, 8), 0.22)
    # band-limit below the AAC encoder's cutoff before the limiter, so the encode does not overshoot the true peak
    X = S + M * 0.85; X = np.stack([lp(X[:, 0], 17000, 4), lp(X[:, 1], 17000, 4)], 1)
    mix = sk.master(X, target=-17.0, tp=-1.3)
    sf.write(out, mix.astype(np.float32), SR, subtype='FLOAT')
    print(f'{which}: {out}  {len(mix) / SR:.2f}s  {lufs(mix):.2f} LUFS  TP {true_peak(mix):.2f} dBTP')
