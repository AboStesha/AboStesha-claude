"""Sound design for the three 4-second Axi Iraq idents, synthesised and synced to each film's timeline.
Usage: python ident.py a|b|c|all outdir   →  ident_a.wav … (48 kHz stereo, −14 LUFS, true peak ≤ −1 dBTP)"""
import sys, os
import numpy as np
import soundfile as sf
import synthkit as sk
from synthkit import SR, T, lp, hp, bp, midi, env, noise, sweep_noise, whoosh, click, scribble, sub_boom, ting, zip_up, blip, reverse_swell, kick, mallet, bell, pad, saw, sine_glide

DUR = 4.0
sk.set_duration(DUR)


def thock(f0=110, f1=58, d=0.5, body=900, weight=1.0, seed=0):
    """a heavy slab landing on a table: low thump, short woody body, contact click"""
    t = T(d)
    thump = np.sin(2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t * 30)) / SR) * np.exp(-t * 16)
    wood = lp(noise(d, seed), body) * np.exp(-t * 28) * 1.3
    c = np.zeros_like(t); ck = click(2600, 0.012, seed + 1); c[:len(ck)] = ck * 0.45
    return np.tanh((thump * 1.2 + wood * 0.8) * weight) * 0.9 + c


def mix_out(sfx, mus, wet, rt=1.6, seed=3):
    ir = sk.reverb_ir(rt, seed)
    room = sk.reverb(sfx.st() * 0.6 + mus.st(), ir, wet)
    return sk.master(room + sfx.st() * 0.4, -14.0, -1.0)


def cue_a():
    """Ascend: ticking market and a riser → the lock snap → leaps and snaps → the brand chord blooms."""
    sfx, mus = sk.Bus(), sk.Bus(); rng = np.random.default_rng(1)
    tt = 0.02
    while tt < 1.06:                                      # ticks accelerate with the price line
        sfx.add(click(2800 + rng.random() * 2600, 0.01, int(tt * 997)), tt, 0.1 + 0.12 * tt, rng.uniform(-0.5, 0.5))
        tt += 0.11 - 0.075 * min(1, tt / 1.0)
    f = 110 * 4 ** (T(1.1) / 1.1) ** 1.6                   # filtered saw riser into the lock
    r = saw(f, 1.1, 30); r = (lp(r, 600) * 0.5 + lp(r, 2600) * 0.5) * (T(1.1) / 1.1) ** 1.4
    mus.add(r, 0.0, 0.16); sfx.add(sweep_noise(0.8, 500, 7000, 1.6, 4, 1.6) * np.linspace(0, 1, int(0.8 * SR)) ** 2, 0.3, 0.1)
    sfx.add(reverse_swell(0.26, 6, 2000), 0.84, 0.35)
    # 1.10 the line locks and inflates into the stroke
    sfx.add(kick(0.35), 1.1, 0.55); sfx.add(sub_boom(64, 36, 1.2, 1.8), 1.1, 0.5); sfx.add(click(6500, 0.015, 7), 1.1, 0.5)
    sfx.add(hp(noise(0.08, 8), 3000) * np.exp(-T(0.08) * 45), 1.1, 0.35); sfx.add(whoosh(0.32, 300, 2400, 9, (0.2, 0.8)), 1.1, 0.3)
    # the head leaps to the i and lands; the i rises; the arm snaps; the a slides in
    g = sine_glide(620, 1500, 0.3, 0.8) * env(int(0.3 * SR), 0.01, 0.1, 0.6, 0.15); sfx.add(g, 1.16, 0.12, 0.3)
    sfx.add(ting(2900, 1.0), 1.46, 0.16, 0.45); sfx.add(blip(1760, 0.06), 1.46, 0.12, 0.45)
    sfx.add(zip_up(0.22, 11), 1.38, 0.22, 0.4)
    sfx.add(whoosh(0.16, 900, 6000, 12, (0.7, 0.3)), 1.34, 0.22, -0.2); sfx.add(click(4200, 0.012, 13), 1.5, 0.32, -0.2)
    sfx.add(whoosh(0.2, 400, 4000, 14, (0.7, 0.3)), 1.46, 0.3, -0.5); sfx.add(kick(0.25), 1.62, 0.3, -0.3); sfx.add(click(3000, 0.012, 15), 1.62, 0.25, -0.3)
    # 1.82 the market rises into the brand gradient: airy rise and a warm chord
    sfx.add(whoosh(0.66, 200, 4200, 16, (0.55, 0.45)), 1.8, 0.34); sfx.add(reverse_swell(0.25, 17, 1200), 1.82, 0.2)
    mus.add(pad([50, 54, 57, 64, 69], 2.0, 2600, 0.12, 1.4, 4, 1.0), 2.04, 0.62); sfx.add(sub_boom(55, 36, 1.4, 1.2), 2.04, 0.3)
    for i, m in enumerate([69, 71, 74, 76]):                 # «العراق» right to left
        mus.add(mallet(midi(m), 1.4, 0.8), 2.22 + i * 0.08, 0.13, 0.4 - i * 0.27)
    mus.add(bell(midi(86), 1.8, 2.0), 2.98, 0.06); sfx.add(ting(4300, 1.0), 3.06, 0.04, 0.2)
    return mix_out(sfx, mus, 0.2)


def cue_b():
    """Blueprint: a low drone, laser guides and ticks, plotter pens, fills that swell into a deep hit, a resolving chord."""
    sfx, mus = sk.Bus(), sk.Bus()
    mus.add(pad([45, 52, 57], 4.0, 900, 0.5, 1.0, 9, 0.8), 0.0, 0.42)
    for i, g0 in enumerate([-0.12, -0.04, 0.06, 0.02, 0.1, 0.15, 0.2, 0.24, 0.28]):   # guides shooting across
        s = whoosh(0.22, 2500, 9000, 30 + i, (0.15, 0.85)); g0 = max(0.0, g0)
        sfx.add(s, g0, 0.1, (-0.6, 0.6)[i % 2]); sfx.add(click(7000, 0.008, 40 + i), g0, 0.12, (-0.6, 0.6)[i % 2])
    sfx.add(sine_glide(220, 330, 0.7, 1.0) * env(int(0.7 * SR), 0.05, 0.2, 0.7, 0.3), 0.2, 0.05)
    sfx.add(whoosh(0.32, 1500, 7000, 50, (0.3, 0.7)), 0.42, 0.12, 0.3)
    sfx.add(blip(1320, 0.05), 0.72, 0.12, 0.3); sfx.add(blip(1760, 0.05), 0.86, 0.1, 0.3)
    sfx.add(scribble(0.88, 51, 24, (3200, 9400)), 0.34, 0.2)                          # plotter pens
    for k, ft in enumerate([1.16, 1.22, 1.25, 1.3, 1.36]):                            # fills swell
        sfx.add(sweep_noise(0.32, 220, 2200, 2.0, 60 + k, 1.2) * np.linspace(0.2, 1, int(0.32 * SR)), ft, 0.07, (k - 2) * 0.25)
    sfx.add(sub_boom(55, 32, 1.8, 1.6), 1.5, 0.55); sfx.add(kick(0.3), 1.5, 0.3)
    mus.add(pad([57, 60, 64, 67], 1.2, 2600, 0.04, 0.9, 12, 1.0), 1.5, 0.42); mus.add(mallet(midi(69), 1.6, 0.9), 1.5, 0.12)
    sfx.add(whoosh(0.36, 8000, 1800, 70, (0.3, 0.7)), 1.42, 0.08)                    # guides retract
    sfx.add(scribble(0.62, 71, 28, (3600, 9800)), 1.5, 0.13, 0.25)                   # «العراق» traced, then filled
    for k, ft in enumerate([1.98, 2.03, 2.09, 2.13]):
        sfx.add(sweep_noise(0.3, 300, 2600, 2.0, 80 + k, 1.2) * np.linspace(0.2, 1, int(0.3 * SR)), ft, 0.05, 0.4 - k * 0.27)
    mus.add(pad([48, 55, 60, 64, 67, 71], 1.6, 3000, 0.08, 1.2, 14, 1.0), 2.42, 0.5); sfx.add(sub_boom(52, 34, 1.4, 1.2), 2.42, 0.3)
    mus.add(bell(midi(84), 1.8, 1.8), 2.45, 0.06); sfx.add(ting(3600, 1.1), 2.9, 0.05, 0.2)
    return mix_out(sfx, mus, 0.26, 2.0, 5)


def cue_c():
    """Drop: air, heavy slab landings with marimba notes, light taps for «العراق», then the stamp and a chord."""
    sfx, mus = sk.Bus(), sk.Bus()
    mus.add(pad([50, 57, 61, 66], 3.8, 1500, 0.9, 1.2, 21, 0.9), 0.15, 0.26)
    lands = [(0.28, 62, 1.0), (0.5, 66, 1.0), (0.66, 69, 0.85), (0.8, 71, 0.8), (0.95, 74, 0.6)]
    for i, (tl, m, w) in enumerate(lands):
        sfx.add(whoosh(0.26, 500, 2600, 90 + i, (0.85, 0.15)), tl - 0.26, 0.16 * w, -0.3 + 0.15 * i)
        sfx.add(thock(110, 56, 0.5, 900, 1.0 + 0.6 * w, 100 + i), tl, 0.5 * w, -0.3 + 0.15 * i)
        sfx.add(click(3000, 0.01, 110 + i), tl + 0.06, 0.08 * w); mus.add(mallet(midi(m), 1.5, 0.9), tl, 0.13)
    for i, (tl, m) in enumerate([(1.24, 76), (1.33, 78), (1.4, 81), (1.49, 83)]):    # «العراق» right to left
        sfx.add(whoosh(0.18, 700, 3200, 120 + i, (0.85, 0.15)), tl - 0.18, 0.08, 0.35 - i * 0.23)
        sfx.add(thock(170, 90, 0.3, 1400, 0.9, 130 + i), tl, 0.26, 0.35 - i * 0.23); mus.add(mallet(midi(m), 1.2, 0.7), tl, 0.09, 0.35 - i * 0.23)
    sfx.add(reverse_swell(0.34, 140, 900), 2.12, 0.22)                                 # the press, then the stamp
    sfx.add(kick(0.4), 2.46, 0.55); sfx.add(sub_boom(60, 34, 1.3, 1.8), 2.46, 0.5); sfx.add(thock(90, 45, 0.7, 600, 2.0, 150), 2.46, 0.45)
    mus.add(pad([50, 54, 57, 62, 66], 1.5, 2800, 0.02, 1.2, 23, 1.0), 2.46, 0.42); mus.add(bell(midi(86), 1.6, 2.0), 2.48, 0.06)
    sfx.add(ting(5000, 0.9), 3.05, 0.035, 0.2)
    return mix_out(sfx, mus, 0.12, 1.2, 7)


if __name__ == '__main__':
    which, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
    for k in ('abc' if which == 'all' else which):
        x = {'a': cue_a, 'b': cue_b, 'c': cue_c}[k]()
        p = os.path.join(out, f'ident_{k}.wav'); sf.write(p, x.astype(np.float32), SR, subtype='PCM_24')
        print(f'{p}  {len(x) / SR:.2f}s  {sk.lufs(x):.2f} LUFS  TP {sk.true_peak(x):.2f} dBTP')
