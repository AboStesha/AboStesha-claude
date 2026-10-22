#!/usr/bin/env python3
"""vo_mix.py — lay the five-voice relay VO (audio/vo/lines/NN_<name>.wav) over the film's music+SFX mix.

Each line is cleaned (high-pass, de-ess, gentle compression), its long internal pauses are tightened, it is
levelled to a common loudness, then placed under its text card: it starts with the card's first word, may lead
the cut by up to LEAD s or spill past it by up to SPILL s, and is sped up with Rubber Band (formants kept) only
as much as it needs to fit. Line 16 is the five voices together: each take is split into its two phrases and
stretched onto Noor's, Noor leads and the others sit lower and spread. The bed ducks under the voice, then the
whole is mastered to -14 LUFS / -1.5 dBTP.

  python3 tools/vo_mix.py --bed audio/emotional_mix.wav --out audio/emotional_mix_vo.wav
"""
import argparse, glob, os, subprocess, sys, numpy as np, soundfile as sf, pyloudnorm as pyln
from scipy.signal import fftconvolve
sys.argv, _argv = sys.argv[:1], sys.argv
from mix import true_peak, limit                                    # noqa: E402  (same mastering as the music mix)
sys.argv = _argv

SR = 48000
C = [0, 3.75, 6.5625, 9.375, 12.1875, 15.0, 17.8125, 21.5625, 25.3125, 30.0, 33.75, 37.5, 40.3125, 44.0625, 47.8125, 52.5, 55.3125, 60.0]
GAP, LEAD, SPILL, RMAX = 0.10, 0.40, 0.40, 1.16
TIGHT = range(1, 9)                                                 # the crowded opening: 2.8 s cards, 3–3.7 s lines
END_BY = {9: 29.2, 15: 52.42}                                       # 9 may sink into the breath; 15 clears the arrival
T16 = 52.66
CHORUS = {'noor': (0.0, 0.0, 0.000), 'rojin': (-7.0, -0.35, 0.011), 'aesha': (-7.5, 0.35, 0.019),
          'saeed': (-7.5, -0.6, 0.007), 'sarmad': (-7.0, 0.6, 0.015)}   # gain dB, pan, offset s
LINE_LUFS, RATIO, DUCK_MIN, DUCK_MAX = -16.0, 9.0, 1.0, 12.0     # voice sits RATIO LU over the ducked bed
meter = pyln.Meter(SR)


def ff(x, chain):
    p = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', chain,
                        '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-'], input=x.astype(np.float32).tobytes(), capture_output=True)
    return np.frombuffer(p.stdout, np.float32).copy()


def clean(x):
    return ff(x, 'highpass=f=85:poles=2,deesser=i=0.35:m=0.5:f=0.5,'
                 'acompressor=threshold=-21dB:ratio=2.2:attack=8:release=110:knee=4:makeup=1')


def stretch(x, r):
    return x if abs(r - 1) < 0.004 else ff(x, f'rubberband=tempo={r:.4f}:pitchq=quality:formant=preserved:transients=mixed')


def env_db(x, hop=0.01):
    n = int(SR * hop); k = len(x) // n
    return 20 * np.log10(np.sqrt((x[:k * n].reshape(k, n) ** 2).mean(1) + 1e-12))


def tighten(x, pmax):
    """Shorten every inner pause longer than pmax to pmax (cut from its middle, 15 ms crossfade)."""
    e = env_db(x); quiet = e < e.max() - 26; runs, i = [], 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]: j += 1
            if i > 0 and j < len(quiet) and (j - i) * 0.01 > pmax: runs.append((i, j))
            i = j
        else: i += 1
    out, last, xf = [], 0, int(0.015 * SR)
    for i, j in runs:
        keep = int(pmax / 2 * SR); a, b = int(i * 0.01 * SR) + keep, int(j * 0.01 * SR) - keep
        out.append(x[last:a + xf].copy()); last = b
    out.append(x[last:])
    y = out[0]
    for seg in out[1:]:
        r = np.linspace(0, 1, xf); y[-xf:] = y[-xf:] * (1 - r) + seg[:xf] * r; y = np.concatenate([y, seg[xf:]])
    return y


def level(x, lufs):
    l = meter.integrated_loudness(np.pad(x, (0, max(0, int(0.5 * SR) - len(x)))))
    return x * 10 ** ((lufs - l) / 20)


def split2(x):
    """Split a take of «بناها متداولون... من أجل المتداولين» at its deepest pause in the middle third."""
    e = np.convolve(env_db(x), np.ones(7) / 7, mode='same'); n = len(e)
    k = n // 3 + int(np.argmin(e[n // 3: 2 * n // 3])); s = int(k * 0.01 * SR)
    a, b = x[:s], x[s:]
    on = np.where(env_db(b) > env_db(b).max() - 36)[0][0]               # phrase 2 starts at its first sound
    return a, b[max(0, int((on * 0.01 - 0.02) * SR)):]


def put(bus, x, t, gain_db=0.0, pan=0.0):
    i = int(round(t * SR)); x = x[:max(0, len(bus) - i)] * 10 ** (gain_db / 20)
    a = (np.clip(pan, -1, 1) + 1) * np.pi / 4
    bus[i:i + len(x), 0] += x * np.cos(a) * 1.4142; bus[i:i + len(x), 1] += x * np.sin(a) * 1.4142


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--bed', required=True); ap.add_argument('--out', required=True)
    ap.add_argument('--lines', default='audio/vo/lines'); ap.add_argument('--vo-out', default='audio/vo/vo_bus.wav')
    a = ap.parse_args()
    bed, sr = sf.read(a.bed, dtype='float64'); assert sr == SR and bed.ndim == 2
    N = len(bed); vo = np.zeros((N, 2)); plan = []; plan_d = {}
    files = sorted(glob.glob(os.path.join(a.lines, '*.wav')))
    pick = lambda n: [f for f in files if os.path.basename(f).startswith(f'{n:02d}_')][0]
    X = {n: level(tighten(clean(sf.read(pick(n), dtype='float32')[0]), 0.22 if n in TIGHT else 0.6), LINE_LUFS) for n in range(1, 16)}
    end_by = lambda n: END_BY.get(n, C[n] + SPILL)

    def place(ns, r, s0):
        """Two passes: earliest starts (feasibility), then slide each line back toward its card's first word."""
        d = {n: len(X[n]) / SR / r for n in ns}; early, prev = {}, s0
        for n in ns:
            early[n] = max(prev + GAP, C[n - 1] - LEAD, 0.04)
            if early[n] + d[n] > end_by(n) + 1e-6: return None
            prev = early[n] + d[n]
        out, nxt = {}, 1e9
        for n in reversed(list(ns)):
            out[n] = max(early[n], min(C[n - 1] + 0.12, nxt - GAP - d[n], end_by(n) - d[n])); nxt = out[n]
        return [(n, out[n], r) for n in ns]
    # the opening (lines 1–8) shares one tempo: the smallest that fits every line inside its card window
    r = 1.0
    while place(TIGHT, r, 0.0) is None and r < 1.3: r += 0.005
    sched = place(TIGHT, r, 0.0)
    prev_end = sched[-1][1] + len(X[8]) / SR / sched[-1][2]
    for n in range(9, 16):                                            # the rest at natural speed unless a line must hurry
        d = len(X[n]) / SR; s = max(prev_end + GAP, C[n - 1] - LEAD, min(C[n - 1] + (0.32 if n == 10 else 0.12), end_by(n) - d))
        rr = min(RMAX, max(1.0, d / (end_by(n) - s))); sched.append((n, s, rr)); prev_end = s + d / rr
    for n, s, rr in sched:
        x = stretch(X[n], rr); put(vo, x, s)
        plan.append((n, os.path.basename(pick(n))[3:-4], s, s + len(x) / SR, rr, C[n - 1], C[n]))
    take = lambda p: level(tighten(clean(sf.read(p, dtype='float32')[0]), 0.6), LINE_LUFS)
    # line 16: five voices on Noor's phrasing
    takes = {os.path.basename(f)[3:-4]: take(f) for f in files if os.path.basename(f).startswith('16_')}
    lead1, lead2 = split2(takes['noor']); gap = (len(takes['noor']) - len(lead1) - len(lead2)) / SR
    p2 = T16 + len(lead1) / SR + max(gap, 0.18)
    for name, x in takes.items():
        g, pan, off = CHORUS.get(name, (-8.0, 0.0, 0.01)); ph1, ph2 = split2(x)
        print(f'   16 {name:7s} phrase 1 {len(ph1) / SR:.2f}s  phrase 2 {len(ph2) / SR:.2f}s')
        if name != 'noor':
            ph1 = stretch(ph1, float(np.clip(len(ph1) / len(lead1), 0.8, 1.25)))
            ph2 = stretch(ph2, float(np.clip(len(ph2) / len(lead2), 0.8, 1.25)))
        put(vo, ph1, T16 + off, g, pan); put(vo, ph2, p2 + off, g, pan)
    plan.append((16, 'all five', T16, p2 + len(lead2) / SR, 1.0, C[15], C[16]))
    # a touch of shared room so five different voices sit in one space
    ir = np.random.default_rng(7).standard_normal(int(0.32 * SR)) * np.exp(-np.arange(int(0.32 * SR)) / (0.07 * SR))
    ir[: int(0.012 * SR)] = 0; ir /= np.abs(ir).sum() ** 0.5 * 10
    vo += np.stack([fftconvolve(vo[:, 0], ir)[:N], fftconvolve(vo[:, 1], ir[::-1].copy())[:N]], 1) * 10 ** (-20 / 20)
    sf.write(a.vo_out, vo.astype(np.float32), SR)
    # duck the bed under each line just enough for the voice to sit RATIO LU above it (100 ms look-ahead,
    # 120 ms attack, 450 ms release): quiet passages barely move, the big music after the lift dips more
    depth = np.zeros(N)
    for n, who, s, e, *_ in plan:
        i, j = int(s * SR), int(e * SR); want = RATIO - (meter.integrated_loudness(vo[i:j]) - meter.integrated_loudness(bed[i:j]))
        depth[i:j] = float(np.clip(want, DUCK_MIN, DUCK_MAX)); plan_d[n] = depth[i]
    pl = sorted(plan, key=lambda q: q[2])
    for (_, _, _, e0, *_), (_, _, s1, *_) in zip(pl, pl[1:]):            # hold through short gaps: no pumping between lines
        if 0 < s1 - e0 < 0.7: depth[int(e0 * SR):int(s1 * SR)] = min(depth[int(e0 * SR) - 1], depth[int(s1 * SR)])
    k = int(0.02 * SR); key = depth[: N // k * k].reshape(-1, k).max(1); key = np.roll(key, -5); key[-5:] = 0
    env = np.zeros_like(key); cur = 0.0; at, rl = 1 - np.exp(-0.02 / 0.12), 1 - np.exp(-0.02 / 0.45)
    for i, v in enumerate(key): cur += (v - cur) * (at if v > cur else rl); env[i] = cur
    gain = 10 ** (-np.interp(np.arange(N) / SR, np.arange(len(env)) * 0.02, env) / 20)
    mix = bed * gain[:, None] + vo
    l0 = meter.integrated_loudness(mix); k0 = 10 ** ((-14.0 - l0) / 20); mix *= k0; mix = limit(mix, -1.5)
    l1 = meter.integrated_loudness(mix); k1 = 10 ** ((-14.0 - l1) / 20); mix *= k1; mix = limit(mix, -1.5)
    duck = bed * gain[:, None] * k0 * k1
    for n, who, s, e, *_ in plan:                                       # speech-to-bed ratio per line
        i, j = int(s * SR), int(e * SR)
        print(f'   {n:02d} duck {plan_d[n]:4.1f} dB  voice/bed {meter.integrated_loudness(vo[i:j] * k0 * k1) - meter.integrated_loudness(duck[i:j]):+5.1f} LU')
    sf.write(a.out, mix.astype(np.float32), SR, subtype='PCM_24')
    for n, who, s, e, r, a0, b0 in plan:
        flag = '' if n == 16 or (s >= a0 - LEAD - 1e-6 and e <= END_BY.get(n, b0 + SPILL) + 0.02) else '  <-- over'
        print(f'{n:02d} {who:9s} {s:6.2f}–{e:6.2f}  card {a0:6.2f}–{b0:6.2f}  tempo {r:.3f}{flag}')
    print({'lufs': round(meter.integrated_loudness(mix), 2), 'true_peak_db': round(20 * np.log10(true_peak(mix) + 1e-12), 2)})


if __name__ == '__main__':
    main()
