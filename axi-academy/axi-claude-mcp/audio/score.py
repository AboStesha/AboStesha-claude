"""Music + SFX for the Axi × Claude launch videos (128 bpm grid), synthesised and frame-synced to the films.

The client records the voice-over from VO_SCRIPT.md. The music is pre-ducked (-5 dB with a 1-3 kHz dip) inside
those voice windows, so the voice sits on top without further mixing. Each bed is band-limited to 17 kHz and
mastered to -17 LUFS (true peak <= -1.3 dBTP) to leave room for the voice and the AAC encode.

  ad15  — 15 s: a quiet arp under the hook, an impact as Axi and Claude connect, a bright groove through the three
          asks, a held breath and a "ding" when the trade is approved, a big chord on the CTA.
  exp60 — 60 s: the same palette, calmer; every on-screen action has its sound (typing, clicks, the paste, the
          dialog, the connection chime, the approval), the groove builds through the six steps and resolves on the CTA.

Usage: python -I score.py ad15|exp60 out.wav
"""
import os, sys
import numpy as np
import soundfile as sf
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import synthkit as sk
from synthkit import SR, T, lp, hp, bp, midi, Bus, env, saw, pad, mallet, bell, noise, sweep_noise, whoosh, click, sub_boom, ting, zip_up, blip, reverse_swell, kick, hat, bass_pluck, reverb_ir, reverb, lufs, true_peak

BPM = 128; BEAT = 60 / BPM
def Bt(b): return b * BEAT

# ---------------------------------------------------------------- instruments
def clap(seed=0):
    t = T(0.25); n = bp(noise(0.25, seed), 900, 5200)
    e = sum(np.exp(-np.maximum(0, t - d) * (90 if k < 2 else 20)) * (t >= d) for k, d in enumerate([0, 0.011, 0.022]))
    return n * e * 0.8
def pluck(f, d=0.45, bright=1.4):
    t = T(d); mod = np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 22) * bright
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 8) * np.minimum(1, t * 600)
def stab(notes, d=0.7, cut=3200):
    s = sum(saw(midi(m), d, 30, dt, m) for m in notes for dt in (-6, 6)) / (2 * len(notes))
    t = T(d); lo, hi = lp(s, 700), lp(s, cut); k = np.exp(-t * 9)
    return (lo + (hi - lo) * k) * env(len(t), 0.004, 0.2, 0.35, 0.35)
def pop(f=900, d=0.09):
    t = T(d); return np.sin(2 * np.pi * np.cumsum(f * (1 + 1.2 * np.exp(-t * 60))) / SR) * np.exp(-t * 45) * 0.9
def chime(f=midi(88)):
    out = np.zeros(int(1.4 * SR))
    for j, (ff, dt) in enumerate(((f, 0.0), (f * 1.4983, 0.08))):
        b = bell(ff, 1.3, 2.6); i = int(dt * SR); out[i:i + len(b)] += b[:len(out) - i]
    return out
def mouse(seed=0):
    t = T(0.05); return bp(noise(0.05, seed), 1800, 6500) * np.exp(-t * 260) * 1.3 + np.sin(2 * np.pi * 180 * t) * np.exp(-t * 120) * 0.3
def typing(bus, t0, n, cps, g=0.09, seed=0, pan=0.25):
    r = np.random.default_rng(seed)
    for i in range(n):
        tt = t0 + i / cps + r.uniform(-0.012, 0.012); bus.add(click(2600 + r.random() * 2400, 0.008, seed * 997 + i), tt, g * (0.7 + 0.5 * r.random()), r.uniform(-pan, pan))
def riser(d, seed=7):
    t = T(d); s = sweep_noise(d, 300, 7500, 1.5, seed, 2.0) * (t / d) ** 2.2 * 0.8
    s += saw(110 * 2 ** (1.5 * (t / d) ** 2), d, 18) * (t / d) ** 2 * 0.1
    return s

def drums(mus, b0, b1, kick_g=0.5, hat_g=0.1, clap_g=0.28, half=False):
    b = b0
    while b < b1 - 1e-6:
        bb = round(b) % 4
        if not half or bb == 0: mus.add(kick(), Bt(b), kick_g)
        if (bb in (1, 3) and not half) or (half and bb == 2): mus.add(clap(int(b)), Bt(b), clap_g, 0.05)
        mus.add(hat(0.05, int(b * 2)), Bt(b + 0.5), hat_g, 0.25)
        b += 1
def bassline(mus, b0, b1, roots, g=0.38, cut=900):
    b = b0
    while b < b1 - 1e-6:
        bar = int(b // 4); r = roots[bar % len(roots)]
        for p in (0, 0.75, 1.5, 2.5, 3.0, 3.5):
            if b0 <= bar * 4 + p < b1: mus.add(bass_pluck(midi(r + (12 if p in (1.5, 3.5) else 0)), BEAT * 0.45, cut), Bt(bar * 4 + p), g)
        b = (bar + 1) * 4
def arp(mus, b0, b1, chords, g=0.09, octave=12, pan=0.3):
    b = b0; k = 0
    while b < b1 - 1e-6:
        ch = chords[int(b // 4) % len(chords)]; m = ch[[0, 2, 1, 3, 2, 1, 3, 2][k % 8] % len(ch)] + octave
        mus.add(pluck(midi(m), 0.35), Bt(b), g, pan * (1 if k % 2 else -1)); b += 0.5; k += 1
def pads(mus, b0, b1, chords, g=0.36, cut=1500):
    b = b0
    while b < b1 - 1e-6:
        bar = int(b // 4); nb = min(b1, (bar + 1) * 4); d = Bt(nb - b) + 0.6
        mus.add(pad(chords[bar % len(chords)], d, cut, 0.08, 0.5, 11 + bar), Bt(b), g); b = nb

def duck_env(windows, depth_db=-5.0, ramp=0.06):
    t = np.arange(sk.N + SR) / SR; g = np.zeros_like(t)
    for a, b in windows: g = np.maximum(g, np.clip(np.minimum((t - a + ramp) / ramp, (b + ramp - t) / ramp), 0, 1))
    return 10 ** (depth_db * g / 20), g

Am, F, Cm, G = [57, 60, 64, 67], [53, 57, 60, 64], [48, 52, 55, 60], [55, 59, 62, 67]
PROG = [Am, F, Cm, G]; ROOTS = [33, 29, 36, 31]

# ---------------------------------------------------------------- ad 15
VO15 = [(0.25, 3.0), (3.4, 5.5), (5.7, 9.7), (9.9, 12.0), (12.3, 14.8)]
def design_ad15():
    sk.set_duration(15.0); sfx, mus = Bus(), Bus()
    # hook: pad + arp, typing, send, the balance counting up
    pads(mus, 0, 7, PROG, 0.3, 1300); arp(mus, 0, 7, PROG, 0.07)
    sfx.add(whoosh(0.35, 600, 5000, 1, (0.6, 0.4)), 0.0, 0.2)
    typing(sfx, 0.3, 14, 16, 0.1, 2)
    sfx.add(pop(1000), 1.2, 0.2); sfx.add(pop(1300, 0.07), 1.55, 0.25)
    for k in range(10): sfx.add(click(4200 + 120 * k, 0.006, 30 + k), 1.6 + 0.07 * k, 0.07)
    sfx.add(ting(3600, 0.9), 2.28, 0.06)
    # reveal: the connection lands on the downbeat
    sfx.add(riser(1.1, 3), Bt(7) - 1.1, 0.28); sfx.add(reverse_swell(0.3, 4, 1500), Bt(7) - 0.3, 0.3)
    sfx.add(sub_boom(58, 34, 1.4, 1.6), Bt(7), 0.55); mus.add(stab([57, 64, 69, 72]), Bt(7), 0.42); sfx.add(kick(0.35), Bt(7), 0.5)
    sfx.add(zip_up(0.25, 5), Bt(7) + 0.42, 0.18); sfx.add(chime(), Bt(7) + 0.82, 0.08)
    drums(mus, 8, 21, 0.48, 0.1, 0.26); bassline(mus, 8, 21, ROOTS, 0.36); pads(mus, 7, 21, PROG, 0.28, 1700); arp(mus, 8, 21, PROG, 0.06)
    # three asks: a swish between them, typing and a pop for each card
    for i, b in enumerate((12, 15, 18)):
        sfx.add(whoosh(0.28, 500, 6000, 10 + i, (0.7, 0.3)), Bt(b) - 0.2, 0.22, 0.4)
        typing(sfx, Bt(b) + 0.04, 18, 64, 0.06, 20 + i)
        sfx.add(pop(1100 + 120 * i, 0.08), Bt(b) + 0.34, 0.24)
    sfx.add(sk.plip(), Bt(18) + 0.74, 0.12)
    # trust: hold the breath, the approval click, the ding
    mus.add(pad([57, 60, 64, 71], Bt(5) + 0.6, 1100, 0.2, 0.6, 41), Bt(21), 0.32)
    sfx.add(whoosh(0.3, 3000, 400, 50, (0.4, 0.6)), Bt(21) - 0.15, 0.2)
    sfx.add(mouse(51), Bt(21) + 1.05, 0.5); sfx.add(chime(midi(84)), Bt(21) + 1.12, 0.14); sfx.add(pop(1500, 0.07), Bt(21) + 1.25, 0.18)
    # CTA: big chord, pumps
    sfx.add(riser(0.9, 60), Bt(26) - 0.9, 0.25); sfx.add(sub_boom(55, 34, 2.0, 1.4), Bt(26), 0.5); sfx.add(kick(0.35), Bt(26), 0.45)
    mus.add(stab([57, 64, 69, 72, 76], 1.0), Bt(26), 0.45); pads(mus, 26, 32, [[57, 64, 69, 72, 76]], 0.36, 2200)
    drums(mus, 27, 32, 0.35, 0.08, 0.0, half=True); arp(mus, 27, 31.5, [[57, 64, 69, 72]], 0.05)
    sfx.add(bell(midi(88), 1.6, 2.0), Bt(26) + 0.02, 0.08); sfx.add(pop(900, 0.1), Bt(26) + 0.55, 0.3)
    return sfx, mus, VO15

# ---------------------------------------------------------------- exp 60
VO60 = [(0.2, 3.6), (3.9, 7.3), (7.6, 12.9), (13.2, 16.7), (17.0, 21.0), (21.2, 25.2), (25.4, 29.4), (29.6, 33.6), (33.9, 37.8), (38.1, 42.0), (42.4, 51.4), (51.7, 56.0), (56.4, 59.6)]
def design_exp60():
    sk.set_duration(60.0); sfx, mus = Bus(), Bus()
    ST = lambda i: Bt(36) + i * Bt(9)
    # 1 hook
    pads(mus, 0, 8, PROG, 0.28, 1300); arp(mus, 0, 8, PROG, 0.06)
    sfx.add(whoosh(0.35, 600, 5000, 1, (0.6, 0.4)), 0.0, 0.18); typing(sfx, 0.55, 21, 18, 0.09, 2)
    sfx.add(pop(1000), 1.75, 0.18); sfx.add(pop(1300, 0.07), 2.1, 0.22)
    # 2 title: the connection
    sfx.add(riser(1.0, 3), Bt(8) - 1.0, 0.22); sfx.add(sub_boom(58, 34, 1.4, 1.5), Bt(8), 0.5); mus.add(stab([57, 64, 69, 72]), Bt(8), 0.4); sfx.add(kick(0.35), Bt(8), 0.45)
    sfx.add(chime(), Bt(8) + 0.7, 0.07)
    pads(mus, 8, 36, PROG, 0.26, 1500); arp(mus, 8, 36, PROG, 0.05); drums(mus, 16, 36, 0.32, 0.07, 0.0, half=True); bassline(mus, 16, 36, ROOTS, 0.26, 700)
    # 3 what: nodes and chips
    for k in range(3): sfx.add(pop(800 + 200 * k, 0.08), Bt(16) + 0.3 + 0.25 * k, 0.18)
    for k in range(5): sfx.add(pop(1200 + 90 * k, 0.07), Bt(16) + 1.6 + 0.22 * k, 0.14, (k % 2 - 0.5) * 0.6)
    # 4 need: two checks
    for k in range(2): sfx.add(pop(1400, 0.07), Bt(28) + 0.4 + 0.3 * k, 0.2); sfx.add(blip(1760, 0.05), Bt(28) + 0.45 + 0.3 * k, 0.08)
    # 5 the six steps: groove, a swish per step, and every action's sound
    drums(mus, 36, 90, 0.4, 0.085, 0.2); bassline(mus, 36, 90, ROOTS, 0.3, 850); pads(mus, 36, 90, PROG, 0.24, 1700); arp(mus, 36, 90, PROG, 0.045)
    for i in range(6): sfx.add(whoosh(0.3, 500, 6000, 100 + i, (0.7, 0.3)), ST(i) - 0.22, 0.18, 0.3)
    typing(sfx, ST(0) + 0.35, 30, 24, 0.08, 7); sfx.add(click(3800, 0.012, 8), ST(0) + 1.75, 0.25); sfx.add(whoosh(0.4, 300, 3000, 9, (0.3, 0.7)), ST(0) + 1.8, 0.14)
    sfx.add(mouse(10), ST(1) + 1.0, 0.45); sfx.add(pop(1200, 0.06), ST(1) + 1.05, 0.15); sfx.add(mouse(11), ST(1) + 1.75, 0.45); sfx.add(pop(900, 0.1), ST(1) + 1.88, 0.22)
    sfx.add(mouse(12), ST(2) + 0.55, 0.4); typing(sfx, ST(2) + 0.8, 3, 7, 0.1, 13)
    sfx.add(mouse(14), ST(3) + 0.55, 0.4); sfx.add(click(2400, 0.02, 15), ST(3) + 0.95, 0.35); sfx.add(sk.plip(), ST(3) + 1.0, 0.12); sfx.add(zip_up(0.22, 16), ST(3) + 1.15, 0.12)
    sfx.add(mouse(17), ST(4) + 0.7, 0.45); sfx.add(whoosh(0.25, 2000, 400, 18, (0.3, 0.7)), ST(4) + 0.75, 0.12); sfx.add(pop(1100, 0.08), ST(4) + 1.12, 0.2)
    sfx.add(mouse(19), ST(4) + 1.85, 0.45); sfx.add(whoosh(0.4, 400, 4000, 20, (0.5, 0.5)), ST(4) + 2.1, 0.16)
    sfx.add(mouse(25), ST(5) + 0.12, 0.4); typing(sfx, ST(5) + 0.2, 16, 24, 0.08, 21); typing(sfx, ST(5) + 1.0, 9, 20, 0.08, 22)
    sfx.add(mouse(23), ST(5) + 1.7, 0.45); sfx.add(pop(1000, 0.08), ST(5) + 1.85, 0.16)
    sfx.add(mouse(24), ST(5) + 2.6, 0.45); sfx.add(chime(midi(84)), ST(5) + 3.05, 0.16); sfx.add(sub_boom(60, 40, 1.0, 1.2), ST(5) + 3.05, 0.22)
    # 6 try it
    mus.add(stab([57, 64, 69, 72]), Bt(90), 0.3); sfx.add(kick(0.3), Bt(90), 0.35)
    drums(mus, 90, 110, 0.36, 0.08, 0.18); bassline(mus, 90, 110, ROOTS, 0.28, 800); pads(mus, 90, 110, PROG, 0.24, 1700)
    T_TRY = Bt(90); typing(sfx, T_TRY + 0.6, 14, 16, 0.09, 30); sfx.add(pop(1300, 0.07), T_TRY + 1.8, 0.2)
    for k in range(10): sfx.add(click(4200 + 120 * k, 0.006, 40 + k), T_TRY + 1.85 + 0.07 * k, 0.06)
    sfx.add(whoosh(0.5, 300, 2500, 31, (0.4, 0.6)), T_TRY + 3.0, 0.12); typing(sfx, T_TRY + 3.4, 34, 30, 0.08, 32)
    sfx.add(pop(1100, 0.08), T_TRY + 5.15, 0.2); sfx.add(mouse(33), T_TRY + 6.25, 0.5); sfx.add(chime(midi(84)), T_TRY + 6.33, 0.14)
    # 7 safe: three rows
    mus.add(pad([57, 60, 64, 71], Bt(10) + 0.6, 1200, 0.3, 0.6, 51), Bt(110), 0.3); drums(mus, 110, 120, 0.3, 0.07, 0.0, half=True)
    for k in range(3): sfx.add(pop(1000 + 150 * k, 0.08), Bt(110) + 0.45 + 0.35 * k, 0.18)
    # 8 CTA
    sfx.add(riser(1.0, 60), Bt(120) - 1.0, 0.24); sfx.add(sub_boom(55, 34, 2.2, 1.4), Bt(120), 0.5); sfx.add(kick(0.35), Bt(120), 0.45)
    mus.add(stab([57, 64, 69, 72, 76], 1.0), Bt(120), 0.42); pads(mus, 120, 128, [[57, 64, 69, 72, 76]], 0.34, 2200)
    drums(mus, 121, 128, 0.32, 0.07, 0.0, half=True); arp(mus, 121, 127.5, [[57, 64, 69, 72]], 0.045)
    sfx.add(bell(midi(88), 1.6, 2.0), Bt(120) + 0.02, 0.08); sfx.add(pop(900, 0.1), Bt(120) + 0.55, 0.28)
    return sfx, mus, VO60

if __name__ == '__main__':
    which, out = sys.argv[1], sys.argv[2]
    sfx, mus, vo = {'ad15': design_ad15, 'exp60': design_exp60}[which]()
    g, w = duck_env(vo, -5.0)
    M = mus.st(); vband = np.stack([bp(M[:, 0], 900, 3200), bp(M[:, 1], 900, 3200)], 1)
    M = (M - 0.45 * vband * w[:len(M), None]) * g[:len(M), None]
    S = reverb(sfx.st(), reverb_ir(1.4, 7), 0.14); M = reverb(M, reverb_ir(1.8, 8), 0.22)
    # band-limit below the AAC encoder's cutoff before the limiter, so the encode does not overshoot the true peak
    X = S + M * 0.85; X = np.stack([lp(X[:, 0], 17000, 4), lp(X[:, 1], 17000, 4)], 1)
    mix = sk.master(X, target=-17.0, tp=-1.3)
    sf.write(out, mix.astype(np.float32), SR, subtype='FLOAT')
    print(f'{which}: {out}  {len(mix) / SR:.2f}s  {lufs(mix):.2f} LUFS  TP {true_peak(mix):.2f} dBTP')
