"""Music + SFX beds for the two Axi Academy social ads (15 s, 128 bpm, 8 bars), synthesised and frame-synced.

The voice-over is added later by the client: the music is pre-ducked (-5 dB, with a 1-3 kHz dip) inside the
voice windows of VO_SCRIPT.md, so the voice sits on top without further mixing. The bed is mastered to -17 LUFS
(true peak <= -1 dBTP) to leave room for the voice.

  ad1 — bright A-major groove; a pluck climbs one step for every module card; payoff lift; X sting; outro chord.
  ad2 — tense D-minor ticking while the search floods; the pin drops into a bright D-major drop; chips pop;
        a half-time build into the $50 hit with a cash ring; ten rising notes light the ten caps; X sting; outro.

Usage: python -I score.py ad1|ad2 out.wav
"""
import os, sys
import numpy as np
import soundfile as sf
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import synthkit as sk
from synthkit import SR, T, lp, hp, bp, midi, Bus, env, saw, pad, mallet, bell, noise, sweep_noise, whoosh, click, sub_boom, slam, ting, zip_up, blip, reverse_swell, kick, hat, bass_pluck, reverb_ir, reverb, lufs, true_peak, limiter, scribble, plip

sk.set_duration(15.0)
N = sk.N
BPM = 128; BEAT = 60 / BPM
def Bt(b): return b * BEAT

# ---------------------------------------------------------------- extra instruments
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
def cash():
    out = np.zeros(int(1.3 * SR))
    for j, (f, dt) in enumerate(((2093, 0.0), (2637, 0.07))):
        b = bell(f, 1.2, 2.5); i = int(dt * SR); out[i:i + len(b)] += b[:len(out) - i]
    c = hp(noise(0.25, 5), 4000) * np.exp(-T(0.25) * 18) * 0.5; out[:len(c)] += c
    return out
def snare_roll(d, seed=3):
    t = T(d); out = np.zeros(len(t)); k = 0; tt = 0.0
    while tt < d:
        i = int(tt * SR); c = clap(seed + k) * (0.25 + 0.75 * (tt / d) ** 1.5); n = min(len(c), len(out) - i); out[i:i + n] += c[:n]
        k += 1; tt += BEAT / 4 if tt < d * 0.6 else BEAT / 8
    return out
def riser(d, seed=7):
    t = T(d); s = sweep_noise(d, 300, 7500, 1.5, seed, 2.0) * (t / d) ** 2.2 * 0.8
    s += saw(110 * 2 ** (1.5 * (t / d) ** 2), d, 18) * (t / d) ** 2 * 0.1
    return s

def drums(mus, b0, b1, kick_g=0.55, hat_g=0.12, clap_g=0.32, half=False):
    b = b0
    while b < b1 - 1e-6:
        beat_in_bar = round(b) % 4
        if not half or beat_in_bar in (0,): mus.add(kick(), Bt(b), kick_g)
        if beat_in_bar in (1, 3) and not half: mus.add(clap(int(b)), Bt(b), clap_g, 0.05)
        if half and beat_in_bar == 2: mus.add(clap(int(b)), Bt(b), clap_g, 0.05)
        mus.add(hat(0.05, int(b * 2)), Bt(b + 0.5), hat_g, 0.25)
        b += 1
def bassline(mus, b0, b1, roots, g=0.42, cut=900):
    b = b0
    while b < b1 - 1e-6:
        bar = int(b // 4); r = roots[bar % len(roots)]; pat = (0, 0.75, 1.5, 2.5, 3.0, 3.5)
        for p in pat:
            if b0 <= bar * 4 + p < b1: mus.add(bass_pluck(midi(r + (12 if p in (1.5, 3.5) else 0)), BEAT * 0.45, cut), Bt(bar * 4 + p), g)
        b = (bar + 1) * 4
def arp(mus, b0, b1, chords, g=0.1, octave=12, pan=0.3):
    b = b0; k = 0
    while b < b1 - 1e-6:
        ch = chords[int(b // 4) % len(chords)]; m = ch[[0, 2, 1, 3, 2, 1, 3, 2][k % 8] % len(ch)] + octave
        mus.add(pluck(midi(m), 0.35), Bt(b), g, pan * (1 if k % 2 else -1)); b += 0.5; k += 1
def pads(mus, b0, b1, chords, g=0.4, cut=1500):
    b = b0
    while b < b1 - 1e-6:
        bar = int(b // 4); nb = min(b1, (bar + 1) * 4); d = Bt(nb - b) + 0.6
        mus.add(pad(chords[bar % len(chords)], d, cut, 0.08, 0.5, 11 + bar), Bt(b), g); b = nb

def duck_env(windows, depth_db=-5.0, ramp=0.06):
    t = np.arange(N + SR) / SR; g = np.zeros_like(t)
    for a, b in windows: g = np.maximum(g, np.clip(np.minimum((t - a + ramp) / ramp, (b + ramp - t) / ramp), 0, 1))
    return 10 ** (depth_db * g / 20), g

# ---------------------------------------------------------------- ad 1 · benefits
VO1 = [(0.2, 2.0), (2.15, 3.0), (3.05, 10.0), (10.1, 11.2), (12.1, 14.7)]
def design_ad1():
    sfx, mus = Bus(), Bus()
    A, Fm, D, E = [57, 61, 64, 69], [54, 57, 61, 66], [50, 54, 57, 62], [52, 56, 59, 64]
    prog = [A, Fm, D, E]
    # intro: pad swell, slam hit, riser into the path
    mus.add(pad([45, 57, 61, 64], Bt(6.5) + 0.5, 900, 1.0, 0.6, 3), 0.0, 0.45)
    mus.add(riser(Bt(6.5) - 1.2, 21), 1.2, 0.35)
    # path groove (beats 6.5 → 21.5)
    drums(mus, 7, 21.5, 0.5, 0.11, 0.26); bassline(mus, 7, 21.5, [33, 30, 38, 40], 0.4)
    pads(mus, 6.5, 21.5, prog, 0.32, 1300); arp(mus, 8, 21.5, prog, 0.06, 12)
    # payoff lift + X sting
    sfx.add(snare_roll(Bt(2.4), 4), Bt(21.6), 0.3); mus.add(riser(Bt(2.5), 22), Bt(21.5), 0.35)
    # outro: chord stab + light groove + ring-out
    mus.add(stab([57, 61, 64, 69, 73]), Bt(25.6), 0.42); mus.add(sub_boom(55, 40, 2.0, 1.3), Bt(25.6), 0.5)
    pads(mus, 25.6, 32, [A, A], 0.36, 1700); drums(mus, 26, 32, 0.4, 0.09, 0.0, half=True); arp(mus, 26, 31, [A, E], 0.05, 12)
    # ---- SFX synced to the picture ----
    sfx.add(zip_up(0.12, 3)[::-1].copy(), 0.0, 0.3); sfx.add(plip(), 0.12, 0.45)              # tip drops in
    sfx.add(scribble(0.5, 31, 13), 0.1, 0.35, 0.2)                                              # pen writes «تريد تتعلّم»
    sfx.add(whoosh(0.14, 600, 6000, 32, (0.85, 0.15)), 0.36, 0.4); sfx.add(slam(), 0.5, 0.75)  # «التداول؟» slams
    sfx.add(whoosh(0.4, 900, 7000, 33, (0.3, 0.7)), 1.05, 0.18)                                 # words rise
    sfx.add(click(3000, 0.012, 34), 1.45, 0.25); sfx.add(click(2600, 0.012, 35), 1.6, 0.2)    # chevrons
    sfx.add(whoosh(0.4, 400, 6000, 36, (0.75, 0.25)), Bt(4.5) - 0.35, 0.45)                    # rise wipe
    sfx.add(sub_boom(60, 40, 1.2, 1.2), Bt(4.5), 0.45); sfx.add(bell(midi(81), 1.6, 2.2), Bt(4.5) + 0.02, 0.12)  # logo
    steps = [69, 71, 73, 76, 78, 81]
    for k in range(6):                                                                          # module cards
        t0 = Bt(6.5) + k * Bt(2.5)
        sfx.add(whoosh(0.3, 500, 5500, 40 + k, (0.4, 0.6)), t0 - 0.05, 0.28, 0.35)
        sfx.add(pop(1400, 0.07), t0 + 0.42, 0.3); sfx.add(ting(3200 + 120 * k, 0.6), t0 + 0.44, 0.1)
        mus.add(pluck(midi(steps[k]), 0.6, 1.0), t0 + 0.42, 0.22, -0.1)
    for k in range(6): sfx.add(blip(1800 + 220 * k, 0.04), Bt(20) + k * 0.08, 0.16, 0.4 - 0.15 * k)  # all-checked wave
    sfx.add(slam(), Bt(21.5), 0.45); sfx.add(kick(0.25), Bt(21.5) + 0.18, 0.35)                 # «من الصفر / إلى الاحتراف»
    sfx.add(plip(), Bt(21.5) + 0.42, 0.4)                                                      # the tip lands as the full stop
    sfx.add(whoosh(0.3, 300, 4000, 50, (0.85, 0.15)), Bt(24) - 0.3, 0.5); sfx.add(slam(), Bt(24) + 0.2, 0.9)  # X sting
    sfx.add(bell(midi(81), 1.8, 2.0), Bt(25.6) + 0.02, 0.12); sfx.add(pop(900, 0.1), Bt(25.6) + 0.35, 0.35)
    sfx.add(click(2200, 0.02, 51), Bt(25.6) + 0.5, 0.25); sfx.add(ting(4200, 1.2), Bt(25.6) + 0.95, 0.08)
    return sfx, mus, VO1

# ---------------------------------------------------------------- ad 2 · the offer
VO2 = [(0.1, 2.75), (2.85, 4.6), (4.7, 7.4), (7.55, 11.1), (12.1, 14.8)]
def design_ad2():
    sfx, mus = Bus(), Bus()
    Dm, Bb, Gm, A7 = [50, 53, 57, 62], [46, 50, 53, 58], [43, 50, 55, 58], [45, 49, 52, 55]
    D, Am, Bm, G = [50, 54, 57, 62], [45, 49, 52, 57], [47, 50, 54, 59], [43, 47, 50, 55]
    # hook: tense ticking + low drone; typing; panic riser; pin drop
    mus.add(pad([38, 50, 53, 57], Bt(6) + 0.3, 600, 0.3, 0.2, 5), 0.0, 0.5)
    for k in range(24): sfx.add(hat(0.03, k), Bt(k * 0.25), 0.07 + 0.05 * (k / 24))
    for b in (0, 2, 4): mus.add(kick(0.3), Bt(b), 0.35)
    rng = np.random.default_rng(3); tt = 0.36
    while tt < 1.6: sfx.add(click(2500 + rng.random() * 2500, 0.01, int(tt * 1000)), tt, 0.16 + 0.08 * rng.random(), -0.2 + 0.4 * rng.random()); tt += 0.07 + 0.05 * rng.random()
    for k in range(10): sfx.add(pop(500 + 90 * k, 0.06), 0.7 + k * 0.17, 0.08, (k % 3 - 1) * 0.5)  # question marks
    sfx.add(riser(1.25, 61), 1.55, 0.42)
    for k in range(8): sfx.add(blip(1100 + 140 * k, 0.03), 2.3 + k * 0.035, 0.12)            # glitchy stutter
    sfx.add(zip_up(0.22, 62)[::-1].copy(), Bt(6) - 0.3, 0.45)                                   # the pin falls
    # TURN: drop
    sfx.add(slam(), Bt(6), 0.9); mus.add(stab([62, 66, 69, 74]), Bt(6), 0.4)
    for b, g in ((6.4, 0.35), (7.0, 0.38), (7.6, 0.5)): sfx.add(kick(0.25), Bt(b), g); sfx.add(clap(int(b * 10)), Bt(b), g * 0.7)
    sfx.add(bell(midi(86), 1.5, 2.0), Bt(7.6) + 0.04, 0.12)
    drums(mus, 8, 15.5, 0.45, 0.1, 0.24); bassline(mus, 8, 15.5, [38, 33, 35, 31], 0.38)
    pads(mus, 6, 15.5, [D, Am, Bm, G], 0.32, 1400); arp(mus, 10, 15.5, [D, Am, Bm, G], 0.05, 12)
    sfx.add(bell(midi(81), 1.6, 2.2), Bt(10), 0.12); sfx.add(sub_boom(58, 40, 1.0, 1.2), Bt(10), 0.35)
    for i in range(6): sfx.add(pop(700 + 110 * i, 0.08), Bt(10) + 0.75 + i * 0.12 + 0.2, 0.28, (0.4 if i % 2 else -0.4))  # chips
    sfx.add(whoosh(0.36, 3000, 300, 63, (0.6, 0.4)), Bt(16) - 0.34, 0.4); sfx.add(reverse_swell(0.3, 64, 1800), Bt(16) - 0.3, 0.3)
    # OFFER: half-time build, counter ticks, $50 hit + cash ring, ten rising notes for the caps
    drums(mus, 16, 24, 0.5, 0.08, 0.3, half=True); bassline(mus, 16, 24, [38, 38, 35, 33], 0.34, 700)
    pads(mus, 16, 24, [D, G], 0.3, 1600)
    sfx.add(kick(0.3), Bt(16.1), 0.4); sfx.add(kick(0.3), Bt(16.4), 0.32)
    for k in range(14): sfx.add(click(3500 + 120 * k, 0.008, 70 + k), Bt(16.6) + Bt(1.6) * (k / 14) ** 0.8, 0.22)
    sfx.add(riser(Bt(1.5), 65), Bt(16), 0.3)
    sfx.add(slam(), Bt(17.5), 0.85); sfx.add(cash(), Bt(17.5) + 0.02, 0.32)
    sfx.add(whoosh(0.35, 800, 6000, 66, (0.3, 0.7)), Bt(17.6), 0.2); sfx.add(whoosh(0.3, 600, 5000, 67, (0.3, 0.7)), Bt(18.4), 0.16)
    scale = [74, 76, 78, 79, 81, 83, 85, 86, 88, 90]
    for i in range(10):
        tt = Bt(19) + i * BEAT / 4
        mus.add(pluck(midi(scale[i]), 0.5, 1.1), tt, 0.24, -0.5 + i / 9); sfx.add(pop(1200 + 80 * i, 0.05), tt, 0.14)
    mus.add(stab([62, 66, 69, 74, 78]), Bt(19) + 10 * BEAT / 4, 0.3)
    sfx.add(ting(5200, 0.9), Bt(21.6), 0.07)                                                     # glint on the $50
    sfx.add(whoosh(0.3, 300, 4000, 68, (0.85, 0.15)), Bt(24) - 0.3, 0.5); sfx.add(slam(), Bt(24) + 0.2, 0.9)  # X sting
    mus.add(stab([62, 66, 69, 74, 78]), Bt(25.6), 0.42); mus.add(sub_boom(55, 40, 2.0, 1.3), Bt(25.6), 0.5)
    pads(mus, 25.6, 32, [D, D], 0.36, 1700); drums(mus, 26, 32, 0.4, 0.09, 0.0, half=True); arp(mus, 26, 31, [D, Am], 0.05, 12)
    sfx.add(bell(midi(86), 1.8, 2.0), Bt(25.6) + 0.02, 0.12); sfx.add(pop(900, 0.1), Bt(25.6) + 0.35, 0.35)
    sfx.add(click(2200, 0.02, 69), Bt(25.6) + 0.5, 0.25); sfx.add(ting(4200, 1.2), Bt(25.6) + 0.95, 0.08)
    return sfx, mus, VO2

if __name__ == '__main__':
    which, out = sys.argv[1], sys.argv[2]
    sfx, mus, vo = {'ad1': design_ad1, 'ad2': design_ad2}[which]()
    # pre-duck the music under the voice windows (level + a 1-3 kHz dip)
    g, w = duck_env(vo, -5.0)
    M = mus.st(); vband = np.stack([bp(M[:, 0], 900, 3200), bp(M[:, 1], 900, 3200)], 1)
    M = (M - 0.45 * vband * w[:len(M), None]) * g[:len(M), None]
    S = reverb(sfx.st(), reverb_ir(1.4, 7), 0.14); M = reverb(M, reverb_ir(1.8, 8), 0.22)
    mix = sk.master(S + M * 0.85, target=-17.0, tp=-1.0)
    sf.write(out, mix.astype(np.float32), SR, subtype='FLOAT')
    print(f'{which}: {out}  {len(mix) / SR:.2f}s  {lufs(mix):.2f} LUFS  TP {true_peak(mix):.2f} dBTP')
