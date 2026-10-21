#!/usr/bin/env python3
"""
build_emotional.py - Axi Iraq emotional brand ad: 45.000 s bar-aligned edit of Mixkit #543 "A New Life"
(Eugenio Mininni, Film Score / Orchestral Hybrid, Hopeful, Reflective, Strings, Synth).

Source grid: 128.000 BPM, beat 0.46875 s, bar 1.875 s, source bar 0 at t = 0.2627 s of the decoded preview
(level-jump attacks of the string hits land within about +-10 ms of this grid; the sharp swell stabs of
bar 12 land at -1..-4 ms). 45.000 s = 96 beats = 24 bars exactly, so the edit starts and ends on bar lines.

Harmony of the source (chroma per half bar): bars 0-20 A minor (E pad at the start), 21-28 F major,
29-34 D minor, 35-36 G (dominant, bar 36 = sub out + fill), 37-47 C major (the arrival, then the
strings release and the ostinato rings out alone).

Timeline (bars of 1.875 s)          source bars        why
  0-3   intimate   0.000- 7.500     2-5     A-minor drone pad only, very sparse; level ride +15 -> +12 dB
  4-10  tension    7.500-20.625     6-12    arpeggio enters (src 8), shimmer + low strings + ostinato (src 9),
                                            four swell stabs on the beats of src 12, then the composer's own
                                            pre-impact decay in its last 50 ms; ride eases +12 -> +7 dB
  11    breath    20.625-22.500     1       near-silence: the drone pad rising out of nothing (source fade-in
                                            bar), +9 dB ride, about 26 dB under the anthem
  12-15 LIFT      22.500-30.000     13-16   the composer's main entrance: hit + sub boom + crash, full strings,
                                            steady 128 BPM ostinato; src 16 crash at 28.125
  16-19 anthem    30.000-37.500     33-36   D minor -> G dominant, src 36 = sub drops out + fill (pre-lift)
  20-23 resolve   37.500-45.000     37-40   C major arrival (sub boom) then the composer's diminuendo;
                                            fade only 43.500-45.000

Splices (3): T 20.625 (src 24.6377 -> 2.1377), T 22.5 (src 4.0127 -> 24.6377), T 30.0 (src 32.1377 -> 62.1377).
Each is an equal-power crossfade that ends 1 ms before the earliest transient found at that bar line (either
side: >1 kHz attack, broadband 1 ms envelope attack or <150 Hz attack), so the incoming hit is never smeared and
the joint sits under it. 10 ms at T 22.5 and T 30.0; 40 ms at T 20.625, where there is no incoming hit to hide
under (the outgoing side is the decay just before the suppressed bar-13 hit, the incoming side the quiet pad).
The first 2 ms get a raised-cosine de-click ramp (the edit starts inside a sounding pad); that is not a fade-in.

Processing besides the splices: the level ride on segments 1-2 (smooth, cosine-interpolated in dB, RIDE_1 and
the breath constant in SEGMENTS), the start de-click, the end fade, and one global gain to a -1.0 dBTP ceiling
(no limiter, no EQ, no compression).

Usage: python3 -I build_emotional.py SRC_MP3 OUT_DIR [PLOT_DIR]
Writes OUT_DIR/ad_music.wav (48 kHz, 24-bit, stereo, 2,160,000 frames) and OUT_DIR/grid.json (grid, sections,
lift, breath, accents, fade, splices, source map, ride and the full verification report);
PLOT_DIR/ad_music_spectrogram.png when PLOT_DIR is given.
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
DUR = 45.0
N = int(round(SR * DUR))             # 2,160,000
BPM = 128.0
BEAT = 60.0 / BPM                    # 0.46875
BAR = 4 * BEAT                       # 1.875
SRC_T0 = 0.2627                      # source bar 0 (decoded preview time)
N_BARS = 24
XF = 0.010                           # default crossfade length (s)
XF_MARGIN = 0.001                    # crossfade ends this long before the earliest transient
DECLICK = 0.002                      # start ramp
FADE_T0 = 43.5                       # final fade window 43.5 -> 45.0
TP_TARGET = -1.0                     # dBTP ceiling, gain only

# (timeline start bar, timeline end bar, source start bar, level ride)
# ride: None, a constant in dB, or (timeline s, dB) points with cosine interpolation in dB (held outside)
RIDE_1 = [(0.0, 15.0), (3.75, 13.0), (7.5, 12.0), (13.125, 9.0), (18.75, 7.0), (20.625, 7.0)]
SEGMENTS = [
    (0, 11, 2, RIDE_1),   # intimate + tension: src bars 2-12 (contiguous)
    (11, 12, 1, 9.0),     # breath: src bar 1 (drone pad rising out of the fade-in)
    (12, 16, 13, None),   # LIFT: src bars 13-16
    (16, 24, 33, None),   # anthem + resolve: src bars 33-40 (D minor -> G -> C)
]
# crossfade length per internal boundary (s). The breath entry has no incoming hit to hide under: the outgoing
# side is the composer's pre-impact decay, so it gets a 40 ms equal-power fade that ends before the suppressed hit.
XF_PER_JOIN = [0.040, XF, XF]

SECTIONS = [
    ('intimate', 0, 4, 'lonely: A-minor drone pad only, sparse, no pulse (src bars 2-5, ride +15 -> +12 dB)'),
    ('tension', 4, 11, 'rising: arpeggio enters at 11.25, shimmer + low strings + ostinato at 13.125, '
                       'four swell stabs on the beats of bar 10 (18.75-20.156), then the music falls away into the breath'),
    ('breath', 11, 12, 'near-silence: drone pad rising out of nothing (src bar 1, +9 dB ride), the weak moment'),
    ('lift', 12, 16, 'LIFT on 22.5: hit + sub boom + crash, full strings, 128 BPM ostinato (src 13-16); '
                     'crash on 28.125'),
    ('anthem', 16, 20, 'D minor -> G dominant (src 33-36); bar 19 (35.625) = sub out + fill into the arrival'),
    ('resolve', 20, 24, 'C major arrival on 37.5 (sub boom), then the composer\'s diminuendo; fade 43.5-45.0'),
]


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
    wav = os.path.join(out, 'ad_music.wav')
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
    rep['splices'] = checks
    rep['start_declick_ms'] = DECLICK * 1000
    rep['fade'] = [FADE_T0, DUR]
    rep['first_sample'] = float(np.abs(yr[0]).max())
    rep['last_sample'] = float(np.abs(yr[-1]).max())

    # lift, breath, accents
    lift_t = 12 * BAR
    la = attacks(m, lift_t)
    # lift attack: first sample after lift-60 ms where the 1 ms broadband envelope is 15 dB above the breath's
    # median level over [lift-100 ms, lift-50 ms]
    e1b = np.sqrt(np.convolve(m ** 2, np.ones(48) / 48, mode='same'))
    bmed = np.median(e1b[int((lift_t - 0.10) * SR):int((lift_t - 0.05) * SR)])
    a_ = int((lift_t - 0.06) * SR)
    lift_attack = (a_ + int(np.where(e1b[a_:a_ + int(0.1 * SR)] > bmed * 10 ** (15 / 20))[0][0])) / SR
    e50 = np.sqrt(np.convolve(m ** 2, np.ones(2400) / 2400, mode='same'))
    db50 = 20 * np.log10(e50 + 1e-9)
    anthem_med = float(np.median(db50[int(12 * BAR * SR):int(20 * BAR * SR)]))
    thr = anthem_med - 15.0
    k0 = int((lift_attack - 0.060) * SR)           # 50 ms window fully before the hit
    k = k0
    while k > int(10 * BAR * SR) and db50[k] < thr:
        k -= 1
    breath = [round((k + 1) / SR, 3), round(lift_attack, 3)]
    breath_lvl = db50[k + 1:k0]
    rep['lift'] = {'t': lift_t, 'attack_s': round(lift_attack, 4), 'attacks_ms': la,
                   'breath_bar_rms_dbfs': round(float(20 * np.log10(np.sqrt(np.mean(m[int(11 * BAR * SR):int(lift_attack * SR)] ** 2)))), 1),
                   'lift_bar_rms_dbfs': round(float(20 * np.log10(np.sqrt(np.mean(m[int(lift_t * SR):int(13 * BAR * SR)] ** 2)))), 1)}
    rep['breath'] = {'window': breath, 'threshold_dbfs_50ms': round(thr, 1), 'anthem_median_dbfs_50ms': round(anthem_med, 1),
                     'breath_level_dbfs_50ms': [round(float(breath_lvl.min()), 1), round(float(np.median(breath_lvl)), 1),
                                                round(float(breath_lvl.max()), 1)],
                     'note': 'breath = 50 ms level more than 15 dB under the median of the lift+anthem bars (12-19), '
                             'running back from the lift attack; level given as min / median / max'}

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
    named = {12 * 4: 'LIFT: hit + sub boom + crash', 15 * 4: 'crash (src 16)', 16 * 4: 'phrase start, D minor (splice)',
             19 * 4: 'fill starts, sub drops out (pre-arrival)', 20 * 4: 'C major arrival: sub boom (logo hit)',
             40: 'swell stab 1', 41: 'swell stab 2', 42: 'swell stab 3', 43: 'swell stab 4 (last before the breath)',
             7 * 4: 'shimmer + low strings + ostinato enter', 6 * 4: 'arpeggio enters', 18 * 4: 'G dominant'}
    major = {12 * 4, 15 * 4, 16 * 4, 20 * 4}
    acc = []
    for b in beats_all:
        score = max(b['jump_db'], b['low_jump_db'] - 6, b['hf_jump_db'] - 3)
        if score >= 4.0 or b['beat'] in named:
            tier = 'major' if b['beat'] in major else ('medium' if score >= 6.0 or b['beat'] in named else 'minor')
            acc.append(dict(b, score=round(float(score), 1), tier=tier, label=named.get(b['beat'], '')))
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
    rep['sections'] = sections

    # ---------------------------------------------------------------- grid.json
    grid = {
        'track': {'source': 'Mixkit', 'id': 543, 'title': 'A New Life', 'artist': 'Eugenio Mininni',
                  'tags': ['Film Score', 'Orchestral Hybrid', 'Hopeful', 'Reflective', 'Strings', 'Synth', 'Documentary'],
                  'listed_on': ['https://mixkit.co/free-stock-music/orchestral-hybrid/',
                                'https://mixkit.co/free-stock-music/film-score/',
                                'https://mixkit.co/free-stock-music/mood/hopeful/'],
                  'download_mp3': 'https://assets.mixkit.co/music/543/543.mp3',
                  'download_note': 'Mixkit has no per-track music page; the card Download button serves this same 256 kbps mp3',
                  'license': 'Mixkit Stock Music Free License (https://mixkit.co/license/#musicFree)'},
        'file': 'ad_music.wav', 'sample_rate': SR, 'channels': 2, 'bit_depth': 24, 'duration': DUR, 'frames': N,
        'bpm': BPM, 'beat': BEAT, 'eighth': BEAT / 2, 'sixteenth': BEAT / 4, 'bar': BAR,
        'beats_total': 4 * N_BARS, 'bars_total': N_BARS,
        'grid_note': 'beat n sits at n*0.46875 s, bar k at k*1.875 s (bar 0 at 0.000 s). Orchestral attacks land '
                     'within about +-10 ms of the grid lines, so cut on the frame that contains the grid time.',
        'lift': lift_t, 'lift_attack': round(lift_attack, 4),
        'breath': breath,
        'breath_bar': [11 * BAR, 12 * BAR],
        'arrival': 20 * BAR,
        'fade': [FADE_T0, DUR],
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
    with open(os.path.join(out, 'grid.json'), 'w') as f:
        json.dump(grid, f, indent=1)

    # ---------------------------------------------------------------- picture
    if plot_dir:
        os.makedirs(plot_dir, exist_ok=True)
        import librosa
        import librosa.display
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt
        fig, ax = plt.subplots(3, 1, figsize=(24, 11), sharex=True, gridspec_kw={'height_ratios': [3, 1.2, 1.2]})
        Mel = librosa.feature.melspectrogram(y=m.astype(np.float32), sr=SR, n_fft=4096, hop_length=480, n_mels=160, fmax=18000)
        librosa.display.specshow(librosa.power_to_db(Mel, ref=np.max), sr=SR, hop_length=480, x_axis='time', y_axis='mel',
                                 fmax=18000, ax=ax[0], cmap='magma')
        for s in sections:
            ax[0].axvline(s['start'], color='#e4002e' if s['name'] in ('lift', 'resolve') else 'w', lw=2)
            ax[0].text(s['start'] + 0.05, 14500, s['name'], color='w', fontsize=11, weight='bold')
        for c in checks:
            ax[0].axvline(c['bar_line_s'], color='lime', lw=1, ls='--')
        ax[0].set_title(f"ad_music.wav  Mixkit #543 'A New Life'  {BPM:.0f} BPM  bar {BAR}s  24 bars = 45.000 s  "
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
        ax[2].set_xticks(np.arange(0, 45.5, 1.875))
        ax[2].set_xticklabels([f'{v:.2f}' for v in np.arange(0, 45.5, 1.875)], rotation=60)
        ax[2].tick_params(axis='x', labelsize=7)
        for s in sections:
            ax[2].axvline(s['start'], color='tab:green', lw=1)
        plt.tight_layout()
        plt.savefig(os.path.join(plot_dir, 'ad_music_spectrogram.png'), dpi=65)

    print(json.dumps({k_: rep[k_] for k_ in ('frames', 'duration_s', 'subtype', 'gain_db', 'true_peak_dbtp', 'sample_peak_dbfs',
                                           'integrated_lufs', 'short_term_lufs_max', 'loudness_range_lu', 'source_grid_fit',
                                           'grid_fit', 'lift', 'breath', 'first_sample', 'last_sample', 'lufs_per_bar')}, indent=1))
    for c in checks:
        print(json.dumps(c))
    for s in sections:
        print(json.dumps(s))
    for a_ in acc:
        print(json.dumps(a_))


if __name__ == '__main__':
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    main()
