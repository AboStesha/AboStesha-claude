#!/usr/bin/env python3
"""
build_emotional_60.py - Axi Iraq emotional brand ad: 60.000 s bar-aligned edit of Mixkit #543 "A New Life"
(Eugenio Mininni, Film Score / Orchestral Hybrid, Hopeful, Reflective, Strings, Synth).

The 45 s edit (build_emotional.py -> ad_music.wav / grid.json) is left untouched; this is a separate build.

Source grid: 128.000 BPM, beat 0.46875 s, bar 1.875 s, source bar 0 at t = 0.2627 s of the decoded preview.
60.000 s = 128 beats = 32 bars exactly = 8 phrases of 4 bars. The LIFT sits on bar 16 = 30.000 s, the exact
middle: 16 bars of darkness before it, 16 bars (four whole 4-bar phrases of the composer's) after it.

Harmony of the source (chroma per half bar): bars 0-3 E drone (V), 4-20 A minor, 21-28 F major, 29-34 D minor,
35-36 G (dominant, bar 36 = sub out + fill), 37-47 C major (the arrival, then the ostinato rings out alone).
Bars 5-8 and 9-12 are the same phrase twice (per-16th chroma 0.77-0.94 bar for bar; bar 8 plays the stab figure
softly, bar 12 plays it as the four swell stabs); 9-12 adds the shimmer, low strings and ostinato.

Timeline (bars of 1.875 s)            source bars      why
  0-4   intimate    0.000- 9.375      2-6    E drone -> A-minor pad, no pulse; ride +15 -> +12 dB
  5-10  tension     9.375-20.625      7-12   melody notes (src 7), soft stab figure (src 8), shimmer + low strings +
                                             ostinato (src 9, 13.125), four swell stabs (src 12, 18.75-20.156).
                                             Bars 0-10 = src 2-12 in one run, the same run and ride as the 45 s edit
  11-14 tension_2  20.625-28.125      9-12   the composer's tension phrase again, whole bars, +2 dB over the first
                                             wave: shimmer re-entry at 20.625, second stabs 26.25-27.656
  15    breath     28.125-30.000      1      near-silence: the E drone rising out of nothing (src bar 1, +9 dB)
  16-19 lift       30.000-37.500      13-16  the composer's main entrance: hit + sub boom, full strings, 128 BPM
                                             ostinato; crash 1 (src 16) at 35.625
  20-23 anthem     37.500-45.000      21-24  step-up into F major (src 21, the track's first major-key section);
                                             crash 2 (build bar src 24) at 43.125
  24-27 anthem_2   45.000-52.500      33-36  D-minor phrase start (fuller but soft-edged), G dominant at 48.75,
                                             sub out + fill 50.625
  28-31 resolve    52.500-60.000      37-40  C major arrival (sub boom), then the composer's diminuendo; fade only
                                             58.500-60.000. The edit ends exactly on the source bar-41 line

Harmonic path after the lift: Am (30.0) -> F (37.5) -> Dm (45.0) -> G (48.75) -> C (52.5) = vi-IV-ii-V-I in C,
the composer's own order of keys with the second half of each 8-bar group left out.

Splices (5), all on bar lines:
  T 20.625  src 24.6377 -> 17.1377  (end of the stab bar -> shimmer entry; the stab bar's tail matches the tail of
                                     src 8 that normally leads into src 9, splice jump 4.2 dB vs 6.2 dB natural)
  T 28.125  src 24.6377 ->  2.1377  (into the breath; same joint as the 45 s edit's T 20.625)
  T 30.000  src  4.0127 -> 24.6377  (breath -> LIFT; same joint as the 45 s edit's T 22.5)
  T 37.500  src 32.1377 -> 39.6377  (crash bar src 16 -> F major src 21; src 16 matches src 20, chroma 0.94)
  T 45.000  src 47.1377 -> 62.1377  (build bar src 24 -> D-minor phrase src 33; src 24 matches src 32)
Each is an equal-power crossfade that ends 1 ms before the earliest transient found at that bar line (either side:
>1 kHz attack, broadband 1 ms envelope attack or <150 Hz attack), so the incoming hit is never smeared and the
suppressed outgoing hit never leaks. 40 ms where the joint has no hit to hide under (both joins out of the stab bar),
10 ms elsewhere. The first 2 ms get a raised-cosine de-click ramp (the edit starts inside a sounding pad).

Processing besides the splices: the level ride on segments 1-3 (smooth, cosine-interpolated in dB), the start
de-click, the end fade, and one global gain to a -1.0 dBTP ceiling (no limiter, no EQ, no compression).

Usage: python3 -I -B build_emotional_60.py SRC_MP3 OUT_DIR [PLOT_DIR]
Writes OUT_DIR/ad_music_60.wav (48 kHz, 24-bit, stereo, 2,880,000 frames) and OUT_DIR/grid_60.json (grid, sections,
moments, lift, breath, accents, fade, splices, source map, ride and the full verification report);
PLOT_DIR/ad_music_60_spectrogram.png when PLOT_DIR is given.
"""
import json
import os
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf
from scipy import signal

SR = 48000
DUR = 60.0
N = int(round(SR * DUR))             # 2,880,000
BPM = 128.0
BEAT = 60.0 / BPM                    # 0.46875
BAR = 4 * BEAT                       # 1.875
SRC_T0 = 0.2627                      # source bar 0 (decoded preview time)
N_BARS = 32
XF = 0.010                           # default crossfade length (s)
XF_MARGIN = 0.001                    # crossfade ends this long before the earliest transient
DECLICK = 0.002                      # start ramp
FADE_T0 = 58.5                       # final fade window 58.5 -> 60.0
TP_TARGET = -1.0                     # dBTP ceiling, gain only
OUT_WAV = 'ad_music_60.wav'
OUT_GRID = 'grid_60.json'

LIFT_BAR = 16
BREATH_BAR = 15
ARRIVAL_BAR = 28

# ride: None, a constant in dB, or (timeline s, dB) points with cosine interpolation in dB (held outside)
# RIDE_1 is the 45 s edit's ride, unchanged (bars 0-10 are the same run of src 2-12).
RIDE_1 = [(0.0, 15.0), (3.75, 13.0), (7.5, 12.0), (13.125, 9.0), (18.75, 7.0), (20.625, 7.0)]
# second wave: the first wave's ride shifted by 4 bars and raised 2 dB, so the tension keeps climbing
RIDE_2 = [(20.625, 11.0), (26.25, 9.0), (28.125, 9.0)]
# (timeline start bar, timeline end bar, source start bar, level ride)
SEGMENTS = [
    (0, 11, 2, RIDE_1),    # intimate + tension wave 1: src bars 2-12 (contiguous)
    (11, 15, 9, RIDE_2),   # tension wave 2: src bars 9-12 again (whole bars)
    (15, 16, 1, 9.0),      # breath: src bar 1 (E drone rising out of the fade-in)
    (16, 20, 13, None),    # LIFT: src bars 13-16
    (20, 24, 21, None),    # anthem: src bars 21-24 (F major)
    (24, 32, 33, None),    # anthem_2 + resolve: src bars 33-40 (D minor -> G -> C)
]
# crossfade length per internal boundary (s): no hit to hide under at the two joins out of the stab bar
XF_PER_JOIN = [0.040, 0.040, XF, XF, XF]

SECTIONS = [
    ('intimate', 0, 5, 'dark and close: E drone, then the A-minor pad, no pulse (src 2-6, ride +15 -> +12 dB)'),
    ('tension', 5, 11, 'unease rising: melody notes from 9.375, the stab figure played softly at 11.25, shimmer + low '
                       'strings + ostinato at 13.125, four swell stabs on the beats of bar 10 (18.75-20.156)'),
    ('tension_2', 11, 15, 'the tension phrase again, 2 dB hotter: shimmer re-entry at 20.625, second four stabs on the '
                          'beats of bar 14 (26.25-27.656), then the music falls away into the breath'),
    ('breath', 15, 16, 'near-silence: E drone rising out of nothing (src bar 1, +9 dB ride), the empty moment'),
    ('lift', 16, 20, 'LIFT on 30.0: hit + sub boom, full strings, 128 BPM ostinato (src 13-16); crash 1 on 35.625'),
    ('anthem', 20, 24, 'step-up into F major on 37.5 (src 21-24), the track\'s first major-key section; crash 2 on 43.125'),
    ('anthem_2', 24, 28, 'D-minor phrase start on 45.0 (src 33-36, fuller, soft-edged), G dominant from 48.75, '
                         'sub out + fill from 50.625'),
    ('resolve', 28, 32, 'C major arrival on 52.5 (sub boom), then the composer\'s diminuendo; fade 58.5-60.0'),
]

NAMED_BEATS = {
    5 * 4: 'melody notes enter (src 7)',
    6 * 4: 'stab figure played softly (src 8)',
    7 * 4: 'shimmer + low strings + ostinato enter (wave 1)',
    10 * 4: 'stab 1 (wave 1)', 10 * 4 + 1: 'stab 2 (wave 1)', 10 * 4 + 2: 'stab 3 (wave 1)',
    10 * 4 + 3: 'stab 4 (wave 1)',
    11 * 4: 'shimmer re-entry, tension wave 2 (splice)',
    14 * 4: 'stab 1 (wave 2)', 14 * 4 + 1: 'stab 2 (wave 2)', 14 * 4 + 2: 'stab 3 (wave 2)',
    14 * 4 + 3: 'stab 4 (wave 2, last before the breath)',
    16 * 4: 'LIFT: hit + sub boom',
    19 * 4: 'crash 1 (src 16)',
    20 * 4: 'step-up into F major (splice)',
    23 * 4: 'crash 2 (build bar src 24)',
    24 * 4: 'D-minor phrase start, fuller but soft-edged (splice)',
    26 * 4: 'G dominant',
    27 * 4: 'fill starts, sub drops out (pre-arrival)',
    28 * 4: 'C major arrival: sub boom (logo hit)',
}
MAJOR_BEATS = {16 * 4, 19 * 4, 20 * 4, 23 * 4, 28 * 4}


def decode(mp3, wav):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp3, '-af', 'aresample=resampler=soxr:precision=28',
                    '-ar', str(SR), '-c:a', 'pcm_f32le', wav], check=True)
    x, sr = sf.read(wav, dtype='float64', always_2d=True)
    assert sr == SR
    return x


def true_peak(x):
    up = signal.resample_poly(x, 4, 1, axis=0)
    return float(np.max(np.abs(up)))


def _attack(m, t, f_lo=None, f_hi=None, smooth=24, k=3.0, search=0.03):
    """earliest attack near grid time t: first sample in [t-20 ms, t+search] where the smoothed envelope of the
    (optionally filtered) signal exceeds k x its median over [t-42 ms, t-22 ms]. Returns time or None."""
    a0, b0 = int((t - 0.08) * SR), int((t + 0.08) * SR)
    if a0 < 0 or b0 > len(m):
        return None
    seg = m[a0:b0]
    if f_lo and f_hi:
        seg = signal.sosfiltfilt(signal.butter(4, [f_lo, f_hi], 'bandpass', fs=SR, output='sos'), seg)
    elif f_lo:
        seg = signal.sosfiltfilt(signal.butter(4, f_lo, 'highpass', fs=SR, output='sos'), seg)
    elif f_hi:
        seg = signal.sosfiltfilt(signal.butter(4, f_hi, 'lowpass', fs=SR, output='sos'), seg)
    e = np.sqrt(np.convolve(seg ** 2, np.ones(smooth) / smooth, mode='same'))
    base = int(0.08 * SR)
    pre = np.median(e[base - int(0.042 * SR):base - int(0.022 * SR)]) + 1e-12
    a, b = base - int(0.020 * SR), base + int(search * SR)
    idx = np.where(e[a:b] > k * pre)[0]
    return (t - 0.020 + idx[0] / SR) if len(idx) else None


def attacks(m, t):
    """all three detectors at grid time t, as ms relative to t (None = nothing found)."""
    out = {}
    for name, kw in (('hf', dict(f_lo=1000, smooth=24, k=3.0)),
                     ('broadband', dict(smooth=48, k=2.0)),
                     ('low', dict(f_hi=150, smooth=96, k=2.0))):
        v = _attack(m, t, **kw)
        out[name] = None if v is None else round(1000 * (v - t), 2)
    return out


def ride_db(T, ride):
    T = np.asarray(T, dtype='float64')
    if ride is None:
        return np.zeros(T.shape)
    if np.isscalar(ride):
        return np.full(T.shape, float(ride))
    ts = np.array([p[0] for p in ride]); gs = np.array([p[1] for p in ride])
    g = np.full(T.shape, gs[0])
    for (t0, g0), (t1, g1) in zip(ride[:-1], ride[1:]):
        msk = (T >= t0) & (T < t1)
        ph = (T[msk] - t0) / (t1 - t0)
        g[msk] = g0 + (g1 - g0) * (0.5 - 0.5 * np.cos(np.pi * ph))
    g[T >= ts[-1]] = gs[-1]
    return g


def k_weight(x):
    import pyloudnorm as pyln
    meter = pyln.Meter(SR)
    z = x.copy()
    for flt in meter._filters.values():
        z = flt.apply_filter(z)
    return z


def short_term(z, t0, t1):
    a, b = int(t0 * SR), int(t1 * SR)
    ms = np.mean(z[a:b] ** 2, axis=0).sum()
    return -0.691 + 10 * np.log10(ms + 1e-15)


def level_jumps(m, thr=6.0):
    """strong onsets: mean 3 ms-level over the 30 ms after minus the mean over 5-45 ms before >= thr dB.
    Returns attack-start times."""
    from scipy.ndimage import uniform_filter1d
    w = int(0.003 * SR)
    e = np.sqrt(np.convolve(m ** 2, np.ones(w) / w, mode='same'))
    le = 20 * np.log10(e + 1e-9)
    pre = np.roll(uniform_filter1d(le, int(0.04 * SR)), int(0.025 * SR))
    post = np.roll(uniform_filter1d(le, int(0.03 * SR)), -int(0.015 * SR))
    jump = post - pre
    pk, _ = signal.find_peaks(jump, height=thr, distance=int(0.2 * SR))
    ts, js = [], []
    for p in pk:
        a = p - int(0.02 * SR)
        if a - int(0.03 * SR) < 0:
            continue
        base = np.median(le[a - int(0.03 * SR):a])
        idx = np.where(le[a:p + int(0.02 * SR)] > base + 3)[0]
        ts.append((a + idx[0]) / SR if len(idx) else p / SR)
        js.append(float(jump[p]))
    return np.array(ts), np.array(js)


def flux_curve(m, hop=240, nfft=2048, nb=64):
    """frame-to-frame spectral flux: mean absolute change (dB) over 64 log-spaced bands 40 Hz-16 kHz, 80 dB floor.
    Returns (flux, frame centre times)."""
    f, t, Z = signal.stft(m, fs=SR, window='hann', nperseg=nfft, noverlap=nfft - hop, boundary=None, padded=False)
    P = np.abs(Z) ** 2
    edges = np.geomspace(40.0, 16000.0, nb + 1)
    idx = np.digitize(f, edges) - 1
    B = np.stack([P[idx == k].sum(0) for k in range(nb)])
    D = 10 * np.log10(B + 1e-20)
    D = np.maximum(D, D.max() - 80.0)
    return np.mean(np.abs(np.diff(D, axis=1)), axis=0), t[1:]


def flux_max(fl, ft, t0, t1):
    s = (ft >= t0) & (ft <= t1)
    return float(fl[s].max())


def main():
    src_mp3, out = sys.argv[1], sys.argv[2]
    plot_dir = sys.argv[3] if len(sys.argv) > 3 else None
    os.makedirs(out, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        src = decode(src_mp3, os.path.join(td, 'src_48k.wav'))
    mono = src.mean(1)

    def sbar(b):
        return SRC_T0 + b * BAR

    # --- segment table in samples (timeline bar k at k*BAR; source bar b at SRC_T0 + b*BAR)
    segs = []
    for tb0, tb1, sb0, rd in SEGMENTS:
        t0 = int(round(tb0 * BAR * SR))
        t1 = N if tb1 == N_BARS else int(round(tb1 * BAR * SR))
        s0 = int(round(sbar(sb0) * SR))
        segs.append({'t0': t0, 't1': t1, 's0': s0, 'off': s0 - t0, 'ride': rd, 'tb': (tb0, tb1), 'sb0': sb0})
    assert segs[-1]['t1'] == N
    assert all(a['tb'][1] == b['tb'][0] for a, b in zip(segs[:-1], segs[1:])), 'segments must tile the timeline'
    assert len(XF_PER_JOIN) == len(segs) - 1

    # --- crossfade placement at each internal boundary
    joins = []
    for (a, b), xf in zip(zip(segs[:-1], segs[1:]), XF_PER_JOIN):
        tg = b['t0'] / SR                                  # timeline bar line
        s_in = b['s0'] / SR                                # incoming source bar line
        s_out = (a['t1'] + a['off']) / SR                  # where the outgoing would have continued
        at_in, at_out = attacks(mono, s_in), attacks(mono, s_out)
        cand = [v for v in list(at_in.values()) + list(at_out.values()) if v is not None and v < 25]
        rel = min(cand) / 1000 if cand else 0.0            # earliest transient relative to the bar line
        rel = min(rel, 0.0)                                # never let the crossfade run past the bar line
        end = tg + rel - XF_MARGIN
        joins.append({'bar_line': tg, 'xf_start': end - xf, 'xf_end': end, 'src_out': s_out, 'src_in': s_in,
                      'in_attacks_ms': at_in, 'out_attacks_ms': at_out, 'earliest_ms': round(1000 * rel, 2)})
    for j0, j1 in zip(joins[:-1], joins[1:]):
        assert j0['xf_end'] < j1['xf_start'], 'crossfades overlap'

    # --- gain envelopes per segment (equal-power crossfades) and the ride
    n = np.arange(N)
    T = n / SR
    y = np.zeros((N, 2))
    for i, sg in enumerate(segs):
        g = np.zeros(N)
        lo = 0 if i == 0 else int(round(joins[i - 1]['xf_start'] * SR))
        hi = N if i == len(segs) - 1 else int(round(joins[i]['xf_end'] * SR))
        g[lo:hi] = 1.0
        if i > 0:
            a_ = int(round(joins[i - 1]['xf_start'] * SR)); b_ = int(round(joins[i - 1]['xf_end'] * SR))
            ph = (n[a_:b_] - a_ + 0.5) / (b_ - a_)
            g[a_:b_] = np.sin(0.5 * np.pi * ph)
        if i < len(segs) - 1:
            a_ = int(round(joins[i]['xf_start'] * SR)); b_ = int(round(joins[i]['xf_end'] * SR))
            ph = (n[a_:b_] - a_ + 0.5) / (b_ - a_)
            g[a_:b_] = np.cos(0.5 * np.pi * ph)
        if sg['ride'] is not None:
            g[lo:hi] *= 10 ** (ride_db(T[lo:hi], sg['ride']) / 20)
        idx = n[lo:hi] + sg['off']
        assert idx.min() >= 0 and idx.max() < len(src), 'segment runs outside the source'
        y[lo:hi] += src[idx] * g[lo:hi, None]

    # --- start de-click and the final fade
    d = int(DECLICK * SR)
    y[:d] *= (0.5 - 0.5 * np.cos(np.pi * (np.arange(d) + 0.5) / d))[:, None]
    f0 = int(FADE_T0 * SR)
    ph = (np.arange(f0, N) - f0 + 1) / (N - f0)
    y[f0:] *= (0.5 + 0.5 * np.cos(np.pi * ph))[:, None]
    y[-1] = 0.0

    # --- gain to the true-peak ceiling
    tp = true_peak(y)
    gain_db = TP_TARGET - 20 * np.log10(tp)
    y *= 10 ** (gain_db / 20)
    assert len(y) == N
    wav = os.path.join(out, OUT_WAV)
    sf.write(wav, y.astype(np.float32), SR, subtype='PCM_24')

    # ------------------------------------------------------------------ verification (on the written file)
    yr, srr = sf.read(wav, dtype='float64', always_2d=True)
    info = sf.info(wav)
    m = yr.mean(1)
    rep = {'frames': len(yr), 'duration_s': len(yr) / srr, 'sample_rate': srr, 'channels': yr.shape[1],
           'subtype': info.subtype, 'gain_db': round(gain_db, 2),
           'true_peak_dbtp': round(20 * np.log10(true_peak(yr)), 2),
           'sample_peak_dbfs': round(20 * np.log10(np.max(np.abs(yr))), 2)}
    import pyloudnorm as pyln
    rep['integrated_lufs'] = round(pyln.Meter(SR).integrated_loudness(yr), 2)
    z = k_weight(yr)
    st_t = np.arange(0, DUR - 3.0 + 1e-9, 0.1)
    st = np.array([short_term(z, t, t + 3.0) for t in st_t])
    gate = st > -70
    rep['short_term_lufs_max'] = round(float(st.max()), 2)
    rep['short_term_lufs_max_at'] = round(float(st_t[np.argmax(st)] + 1.5), 2)
    lra_vals = st[gate & (st > rep['integrated_lufs'] - 20)]
    rep['loudness_range_lu'] = round(float(np.percentile(lra_vals, 95) - np.percentile(lra_vals, 10)), 2)
    rep['lufs_per_bar'] = [round(short_term(z, k * BAR, min((k + 1) * BAR, DUR)), 1) for k in range(N_BARS)]

    # grid: strong onsets on the final timeline and on the source, fitted to the 128 BPM grid
    from musiclib import fit_grid  # noqa: E402  (tools/music on sys.path below)
    ts_src, _ = level_jumps(mono)
    t0s, bs, _, ress, oks = fit_grid(ts_src - SRC_T0, BEAT, 0.0, tol=0.03)
    rep['source_grid_fit'] = {'onsets': int(len(ts_src)), 'on_grid': int(oks.sum()), 'bpm': round(60 / bs, 4),
                              't0_s': round(SRC_T0 + t0s, 4),
                              'resid_rms_ms': round(1000 * float(np.sqrt(np.mean(ress[oks] ** 2))), 2)}
    ts_out, js_out = level_jumps(m)
    t0f, bfit, nidx, res, ok = fit_grid(ts_out, BEAT, 0.0, tol=0.03)
    fixed = ts_out - np.round(ts_out / BEAT) * BEAT          # offsets from the fixed 128.000 BPM timeline grid
    okf = np.abs(fixed) < 0.03
    rep['grid_fit'] = {'onsets': int(len(ts_out)), 'on_grid': int(ok.sum()),
                       'free_fit_bpm': round(60 / bfit, 4), 'free_fit_t0_ms': round(1000 * t0f, 2),
                       'free_fit_resid_rms_ms': round(1000 * float(np.sqrt(np.mean(res[ok] ** 2))), 2),
                       'fixed_grid_on': int(okf.sum()),
                       'fixed_grid_mean_ms': round(1000 * float(np.mean(fixed[okf])), 2),
                       'fixed_grid_rms_ms': round(1000 * float(np.sqrt(np.mean(fixed[okf] ** 2))), 2),
                       'fixed_grid_max_ms': round(1000 * float(np.max(np.abs(fixed[okf]))), 2),
                       'off_grid_times': [round(float(t), 3) for t in ts_out[~okf]]}

    # splice checks
    dx = np.abs(np.diff(yr, axis=0)).max(1)
    hp = signal.sosfilt(signal.butter(4, 9000, 'highpass', fs=SR, output='sos'), m)
    e1 = np.sqrt(np.convolve(hp ** 2, np.ones(48) / 48, mode='same'))      # 1 ms HF envelope
    e10 = np.sqrt(np.convolve(m ** 2, np.ones(480) / 480, mode='same'))
    db10 = 20 * np.log10(e10 + 1e-9)
    checks = []
    for j in joins:
        a_ = int(round(j['xf_start'] * SR)); b_ = int(round(j['xf_end'] * SR))
        nb = slice(max(0, a_ - SR), min(N - 1, b_ + SR))
        local = dx[nb]
        jump_xf = float(dx[a_ - 2:b_ + 2].max())
        hf_ratio_db = 20 * np.log10(e1[a_:b_].max() / (np.median(e1[nb]) + 1e-12))
        hf_p99_db = 20 * np.log10(np.percentile(e1[nb], 99) / (np.median(e1[nb]) + 1e-12))
        # local test: HF inside the crossfade vs the 99th pct of the 100 ms just before and just after it
        # (a click is HF energy that neither side contains)
        hf_side = max(np.percentile(e1[a_ - int(0.1 * SR):a_], 99), np.percentile(e1[b_:b_ + int(0.1 * SR)], 99))
        hf_side_db = 20 * np.log10(e1[a_:b_].max() / (hf_side + 1e-12))
        near = ts_out[(ts_out > j['bar_line'] - 2.1 * BEAT) & (ts_out < j['bar_line'] + 2.1 * BEAT)]
        checks.append({
            'bar_line_s': round(j['bar_line'], 4), 'xfade_s': [round(j['xf_start'], 5), round(j['xf_end'], 5)],
            'xfade_ms': round(1000 * (j['xf_end'] - j['xf_start']), 2),
            'src_out_s': round(j['src_out'], 4), 'src_in_s': round(j['src_in'], 4),
            'earliest_transient_ms_rel_bar': j['earliest_ms'],
            'in_attacks_ms': j['in_attacks_ms'], 'out_attacks_ms': j['out_attacks_ms'],
            'level_before_dbfs_10ms': round(float(db10[max(0, a_ - int(0.02 * SR))]), 1),
            'level_after_dbfs_10ms': round(float(db10[min(N - 1, b_ + int(0.02 * SR))]), 1),
            'max_sample_jump_in_xfade': round(jump_xf, 5),
            'neighbourhood_p99_9_jump': round(float(np.percentile(local, 99.9)), 5),
            'jump_ok': bool(jump_xf <= np.percentile(local, 99.9)),
            'hf_peak_in_xfade_vs_median_db': round(float(hf_ratio_db), 2),
            'hf_p99_vs_median_db_neighbourhood': round(float(hf_p99_db), 2),
            'hf_ok_vs_neighbourhood': bool(hf_ratio_db <= hf_p99_db),
            'hf_peak_in_xfade_vs_sides_p99_db': round(float(hf_side_db), 2),
            'hf_peak_in_xfade_dbfs': round(float(20 * np.log10(e1[a_:b_].max() + 1e-12)), 1),
            'hf_ok': bool(hf_side_db <= 0.0 or e1[a_:b_].max() < 10 ** (-80 / 20)),
            'onsets_around': [round(float(k), 4) for k in near],
            'onset_offsets_from_grid_ms': [round(1000 * float(k - round(k / BEAT) * BEAT), 2) for k in near],
        })
    # timbre check: spectral flux in the 60 ms before each joint's bar line (where every crossfade sits) against the
    # composer's own phrase-line transitions in the source (bars 9-37, every 4 bars) and against the natural flux
    # into the same incoming bar. A joint passes when it changes the spectrum no faster than the composer's phrase
    # lines other than the main entrance (src 13), or within 0.5 dB of the natural transition into its incoming bar.
    fl_out, ft_out = flux_curve(m)
    fl_src, ft_src = flux_curve(mono)
    phrase_lines = {b: round(flux_max(fl_src, ft_src, sbar(b) - 0.06, sbar(b)), 2) for b in range(9, 38, 4)}
    ref_max = max(v for b, v in phrase_lines.items() if b != 13)
    for c, j in zip(checks, joins):
        jf = flux_max(fl_out, ft_out, j['bar_line'] - 0.06, j['bar_line'])
        nat_in = flux_max(fl_src, ft_src, j['src_in'] - 0.06, j['src_in'])
        nat_out = flux_max(fl_src, ft_src, j['src_out'] - 0.06, j['src_out'])
        c.update({'flux_joint_db': round(jf, 2), 'flux_natural_into_incoming_db': round(nat_in, 2),
                  'flux_natural_out_of_outgoing_db': round(nat_out, 2),
                  'flux_ok': bool(jf <= ref_max or jf <= nat_in + 0.5)})
    rep['flux_reference'] = {'window': 'bar line - 60 ms .. bar line', 'source_phrase_lines_db': phrase_lines,
                             'max_excluding_main_entrance_db': ref_max}
    rep['splices'] = checks
    rep['all_splices_ok'] = bool(all(c['jump_ok'] and c['hf_ok'] and c['flux_ok'] for c in checks))
    rep['start_declick_ms'] = DECLICK * 1000
    rep['fade'] = [FADE_T0, DUR]
    rep['first_sample'] = float(np.abs(yr[0]).max())
    rep['last_sample'] = float(np.abs(yr[-1]).max())

    # lift, breath, accents
    lift_t = LIFT_BAR * BAR
    la = attacks(m, lift_t)
    # lift attack: first sample after lift-60 ms where the 1 ms broadband envelope is 15 dB above the breath's
    # median level over [lift-100 ms, lift-50 ms]
    e1b = np.sqrt(np.convolve(m ** 2, np.ones(48) / 48, mode='same'))
    bmed = np.median(e1b[int((lift_t - 0.10) * SR):int((lift_t - 0.05) * SR)])
    a_ = int((lift_t - 0.06) * SR)
    lift_attack = (a_ + int(np.where(e1b[a_:a_ + int(0.1 * SR)] > bmed * 10 ** (15 / 20))[0][0])) / SR
    e50 = np.sqrt(np.convolve(m ** 2, np.ones(2400) / 2400, mode='same'))
    db50 = 20 * np.log10(e50 + 1e-9)
    anthem_med = float(np.median(db50[int(LIFT_BAR * BAR * SR):int(ARRIVAL_BAR * BAR * SR)]))
    thr = anthem_med - 15.0
    k0 = int((lift_attack - 0.060) * SR)           # 50 ms window fully before the hit
    k = k0
    while k > int((BREATH_BAR - 1) * BAR * SR) and db50[k] < thr:
        k -= 1
    breath = [round((k + 1) / SR, 3), round(lift_attack, 3)]
    breath_lvl = db50[k + 1:k0]
    rep['lift'] = {'t': lift_t, 'attack_s': round(lift_attack, 4), 'attacks_ms': la,
                   'breath_bar_rms_dbfs': round(float(20 * np.log10(np.sqrt(np.mean(m[int(BREATH_BAR * BAR * SR):int(lift_attack * SR)] ** 2)))), 1),
                   'lift_bar_rms_dbfs': round(float(20 * np.log10(np.sqrt(np.mean(m[int(lift_t * SR):int((LIFT_BAR + 1) * BAR * SR)] ** 2)))), 1)}
    rep['breath'] = {'window': breath, 'threshold_dbfs_50ms': round(thr, 1), 'anthem_median_dbfs_50ms': round(anthem_med, 1),
                     'breath_level_dbfs_50ms': [round(float(breath_lvl.min()), 1), round(float(np.median(breath_lvl)), 1),
                                                round(float(breath_lvl.max()), 1)],
                     'note': f'breath = 50 ms level more than 15 dB under the median of the lift+anthem bars '
                             f'({LIFT_BAR}-{ARRIVAL_BAR - 1}), running back from the lift attack; level given as '
                             f'min / median / max'}

    def jump_db(t, pre=0.2, post=0.08):
        a, b = int((t - 0.01) * SR), int((t + post) * SR)
        c = int((t - 0.01 - pre) * SR)
        return 20 * np.log10(np.sqrt(np.mean(m[a:b] ** 2)) / (np.sqrt(np.mean(m[c:a] ** 2)) + 1e-12) + 1e-12)

    lo_b = signal.sosfiltfilt(signal.butter(4, 150, 'lowpass', fs=SR, output='sos'), m)
    hi_b = signal.sosfiltfilt(signal.butter(4, 2000, 'highpass', fs=SR, output='sos'), m)

    def band_jump(x, t, pre=0.2, post=0.12):
        a, b = int((t - 0.01) * SR), int((t + post) * SR)
        c = int((t - 0.01 - pre) * SR)
        return 20 * np.log10(np.sqrt(np.mean(x[a:b] ** 2)) / (np.sqrt(np.mean(x[c:a] ** 2)) + 1e-12) + 1e-12)

    beats_all = []
    for bi in range(1, 4 * N_BARS):
        t = bi * BEAT
        if t > FADE_T0:
            break
        beats_all.append({'beat': bi, 'bar': bi // 4, 'beat_in_bar': bi % 4 + 1, 't': round(t, 5),
                          'jump_db': round(float(jump_db(t)), 1), 'low_jump_db': round(float(band_jump(lo_b, t)), 1),
                          'hf_jump_db': round(float(band_jump(hi_b, t)), 1)})
    acc = []
    for b in beats_all:
        score = max(b['jump_db'], b['low_jump_db'] - 6, b['hf_jump_db'] - 3)
        if score >= 4.0 or b['beat'] in NAMED_BEATS:
            tier = 'major' if b['beat'] in MAJOR_BEATS else ('medium' if score >= 6.0 or b['beat'] in NAMED_BEATS else 'minor')
            acc.append(dict(b, score=round(float(score), 1), tier=tier, label=NAMED_BEATS.get(b['beat'], '')))
    rep['accents'] = acc

    # section levels
    def lvl(t0, t1):
        s = m[int(t0 * SR):int(t1 * SR)]
        return round(float(20 * np.log10(np.sqrt(np.mean(s ** 2)) + 1e-12)), 2)
    sections = []
    for name, a, b, note in SECTIONS:
        t0, t1 = a * BAR, min(b * BAR, DUR)
        sections.append({'name': name, 'start': round(t0, 4), 'end': round(t1, 4), 'bars': [a, b],
                         'rms_dbfs': lvl(t0, t1), 'lufs_st_mean': round(short_term(z, t0, t1), 1), 'note': note})
    assert sections[0]['start'] == 0 and sections[-1]['end'] == DUR
    assert all(s0['bars'][1] == s1['bars'][0] for s0, s1 in zip(sections[:-1], sections[1:]))
    rep['sections'] = sections

    # key moments for the edit (grid times; measured attacks where they matter)
    def bt(bar, beat=0):
        return round(bar * BAR + beat * BEAT, 5)
    moments = {
        'melody_in': bt(5), 'stab_figure_soft': bt(6),
        'tension_wave_1': bt(7), 'stabs_1': [bt(10, i) for i in range(4)],
        'tension_wave_2': bt(11), 'stabs_2': [bt(14, i) for i in range(4)],
        'breath_bar': [bt(BREATH_BAR), bt(LIFT_BAR)], 'breath_measured': breath,
        'lift': lift_t, 'lift_attack': round(lift_attack, 4),
        'crash_1': bt(19), 'step_up_f_major': bt(20), 'crash_2': bt(23), 'phrase_d_minor': bt(24),
        'dominant_g': bt(26), 'fill_sub_out': bt(27), 'arrival_c_major': bt(ARRIVAL_BAR),
        'fade': [FADE_T0, DUR],
    }
    rep['moments'] = moments

    # ---------------------------------------------------------------- grid_60.json
    grid = {
        'track': {'source': 'Mixkit', 'id': 543, 'title': 'A New Life', 'artist': 'Eugenio Mininni',
                  'tags': ['Film Score', 'Orchestral Hybrid', 'Hopeful', 'Reflective', 'Strings', 'Synth', 'Documentary'],
                  'listed_on': ['https://mixkit.co/free-stock-music/orchestral-hybrid/',
                                'https://mixkit.co/free-stock-music/film-score/',
                                'https://mixkit.co/free-stock-music/mood/hopeful/'],
                  'download_mp3': 'https://assets.mixkit.co/music/543/543.mp3',
                  'download_note': 'Mixkit has no per-track music page; the card Download button serves this same 256 kbps mp3',
                  'license': 'Mixkit Stock Music Free License (https://mixkit.co/license/#musicFree)'},
        'file': OUT_WAV, 'sample_rate': SR, 'channels': 2, 'bit_depth': 24, 'duration': DUR, 'frames': N,
        'bpm': BPM, 'beat': BEAT, 'eighth': BEAT / 2, 'sixteenth': BEAT / 4, 'bar': BAR,
        'beats_total': 4 * N_BARS, 'bars_total': N_BARS,
        'grid_note': 'beat n sits at n*0.46875 s, bar k at k*1.875 s (bar 0 at 0.000 s). Orchestral attacks land '
                     'within about +-10 ms of the grid lines, so cut on the frame that contains the grid time.',
        'lift': lift_t, 'lift_attack': round(lift_attack, 4),
        'breath': breath,
        'breath_bar': [BREATH_BAR * BAR, LIFT_BAR * BAR],
        'arrival': ARRIVAL_BAR * BAR,
        'fade': [FADE_T0, DUR],
        'moments': moments,
        'sections': [{k_: s[k_] for k_ in ('name', 'start', 'end', 'bars', 'note')} for s in sections],
        'bars_t': [round(i * BAR, 4) for i in range(N_BARS)],
        'downbeats': [round(i * BAR, 4) for i in range(N_BARS)],
        'beats_t': [round(i * BEAT, 5) for i in range(4 * N_BARS)],
        'accents': [{'t': a_['t'], 'beat': a_['beat'], 'bar': a_['bar'], 'beat_in_bar': a_['beat_in_bar'],
                     'score_db': a_['score'], 'tier': a_['tier'], 'label': a_['label']} for a_ in acc],
        'splices': [{'t': c['bar_line_s'], 'xfade': c['xfade_s'], 'src_out': c['src_out_s'], 'src_in': c['src_in_s']}
                    for c in checks],
        'source_map': [{'timeline': [round(a * BAR, 4), round(min(b * BAR, DUR), 4)],
                        'source': [round(sbar(s), 4), round(sbar(s) + (b - a) * BAR, 4)], 'source_bars': [s, s + (b - a)],
                        'ride_db': rd} for a, b, s, rd in SEGMENTS],
        'onsets': [round(float(t), 4) for t in ts_out],
        'verification': rep,
    }
    with open(os.path.join(out, OUT_GRID), 'w') as f:
        json.dump(grid, f, indent=1)

    # ---------------------------------------------------------------- picture
    if plot_dir:
        os.makedirs(plot_dir, exist_ok=True)
        import librosa
        import librosa.display
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt
        fig, ax = plt.subplots(3, 1, figsize=(30, 11), sharex=True, gridspec_kw={'height_ratios': [3, 1.2, 1.2]})
        Mel = librosa.feature.melspectrogram(y=m.astype(np.float32), sr=SR, n_fft=4096, hop_length=480, n_mels=160, fmax=18000)
        librosa.display.specshow(librosa.power_to_db(Mel, ref=np.max), sr=SR, hop_length=480, x_axis='time', y_axis='mel',
                                 fmax=18000, ax=ax[0], cmap='magma')
        for s in sections:
            ax[0].axvline(s['start'], color='#e4002e' if s['name'] in ('lift', 'resolve') else 'w', lw=2)
            ax[0].text(s['start'] + 0.05, 14500, s['name'], color='w', fontsize=11, weight='bold')
        for c in checks:
            ax[0].axvline(c['bar_line_s'], color='lime', lw=1, ls='--')
        ax[0].set_title(f"{OUT_WAV}  Mixkit #543 'A New Life'  {BPM:.0f} BPM  bar {BAR}s  {N_BARS} bars = {DUR:.3f} s  "
                        f"{rep['integrated_lufs']} LUFS  {rep['true_peak_dbtp']} dBTP  (green dashed = splices)")
        tt = np.arange(N) / SR
        ax[1].plot(tt[::24], yr[::24, 0], lw=0.3, color='k')
        for i in range(4 * N_BARS + 1):
            ax[1].axvline(i * BEAT, color='0.8' if i % 4 else 'tab:red', lw=0.5 if i % 4 else 1.0, zorder=0)
        ax[1].plot(ts_out, np.full(len(ts_out), 0.9), 'v', color='tab:blue', ms=4)
        ax[1].axvspan(breath[0], breath[1], color='tab:cyan', alpha=0.25)
        ax[1].set_ylim(-1, 1)
        ax[1].set_ylabel('wave / beats / onsets')
        ax[2].plot(tt[::48], db10[::48], lw=0.6, label='10 ms dBFS')
        ax[2].plot(st_t + 1.5, st, lw=1.2, color='tab:red', label='short-term LUFS (3 s)')
        ax[2].set_ylim(-70, 0)
        ax[2].legend(loc='lower right')
        ticks = np.arange(0, DUR + 0.5, BAR)
        ax[2].set_xticks(ticks)
        ax[2].set_xticklabels([f'{v:.2f}' for v in ticks], rotation=60)
        ax[2].tick_params(axis='x', labelsize=7)
        for s in sections:
            ax[2].axvline(s['start'], color='tab:green', lw=1)
        plt.tight_layout()
        plt.savefig(os.path.join(plot_dir, 'ad_music_60_spectrogram.png'), dpi=60)

    print(json.dumps({k_: rep[k_] for k_ in ('frames', 'duration_s', 'subtype', 'gain_db', 'true_peak_dbtp', 'sample_peak_dbfs',
                                           'integrated_lufs', 'short_term_lufs_max', 'short_term_lufs_max_at',
                                           'loudness_range_lu', 'source_grid_fit', 'grid_fit', 'lift', 'breath', 'all_splices_ok', 'flux_reference',
                                           'first_sample', 'last_sample', 'lufs_per_bar')}, indent=1))
    for c in checks:
        print(json.dumps(c))
    for s in sections:
        print(json.dumps(s))
    for a_ in acc:
        print(json.dumps(a_))


if __name__ == '__main__':
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    main()
