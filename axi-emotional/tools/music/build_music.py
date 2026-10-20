#!/usr/bin/env python3
"""
build_music.py - Axi Iraq Copy Trading reel: 30.000 s bar-aligned edit of Mixkit #1012 "Take this Higher".

Source grid: 124.000 BPM, beat 0.483871 s, bar 1.935484 s, bar 0 at t = 0.000 s of the decoded preview
(kick attack-starts measured at grid +0.7..+6.9 ms; least-squares fit over 141 kicks: 123.995 BPM, t0 -0.4 ms).
30.000 s = 62 beats = 15.5 bars exactly.

Timeline (bars of 1.935484 s)          source bars                     why
  0      intro hook   0.000- 1.935     26      pre-drop bar, sub out   composer's own lead-in to the main drop
  1-6    DROP A       1.935-13.548     27-32   main drop               contiguous with the intro (no splice)
  7      BREAK/stop  13.548-15.484     14      hit, tape-stop, near-silence, vocal-stutter fill, soft pre-drop
  8-13   DROP B      15.484-27.097     15-20   re-entry after the stop contiguous with the break (no splice)
  14-15.5 END HIT    27.097-30.000     47-48.5 final hit + ring; fade 28.800-30.000 only

Splices (2): T 13.548 (src 63.871 -> 27.097) and T 27.097 (src 40.645 -> 90.968). Each is an equal-power
crossfade of 10 ms that ends 1 ms before the earlier of the two kick attacks at that bar line, so both kick
transients stay intact and the joint sits under the incoming kick.
The very first 2 ms get a raised-cosine de-click ramp (the edit starts inside a sounding bar); that is not a fade.

Usage: python3 -I build_music.py SRC_MP3 OUT_DIR
Writes OUT_DIR/reel_music.wav (48 kHz, 24-bit, stereo, 1,440,000 frames), OUT_DIR/grid.json,
OUT_DIR/build_report.json, OUT_DIR/reel_music_spectrogram.png
"""
import json
import os
import subprocess
import sys

import numpy as np
import soundfile as sf
from scipy import signal

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from musiclib import detect_kicks, fit_grid, kick_template, matched_kicks  # noqa: E402

SR = 48000
DUR = 30.0
N = int(round(SR * DUR))             # 1,440,000
BPM = 124.0
BEAT = 60.0 / BPM                    # 0.48387097
BAR = 4 * BEAT                       # 1.93548387
XF = 0.010                           # crossfade length (s), <= 15 ms
XF_MARGIN = 0.001                    # crossfade ends this long before the earlier kick attack
DECLICK = 0.002                      # start ramp
FADE_T0 = 28.8                       # final fade window 28.8 -> 30.0 (1.2 s)
TP_TARGET = -1.0                     # dBTP ceiling, gain only (no limiter)

# (timeline start bar, timeline end bar, source start bar)
SEGMENTS = [
    (0.0, 7.0, 26.0),    # intro bar 26 + drop A 27-32
    (7.0, 14.0, 14.0),   # stop bar 14 + drop B 15-20
    (14.0, 15.5, 47.0),  # final hit 47 + ring
]
SECTIONS = [
    ('intro_hook', 0.0, 1.0, 'pre-drop bar of the breakdown: claps, vocal-chop plucks, no sub; leads straight into the drop'),
    ('drop_a', 1.0, 7.0, 'main drop: four-on-the-floor kick + sub, bright vocal-chop hook'),
    ('break', 7.0, 8.0, 'stop bar: kick hit on 1, tape-stop fall, near-silence through beat 2, vocal-stutter fill on beat 3, short gap, soft pre-drop on beat 4'),
    ('drop_b', 8.0, 14.0, 'second drop (the composer\'s re-entry after the stop): kick + sub + sustained lead, slightly louder than drop A (+0.6 dB rms)'),
    ('end_hit', 14.0, 15.5, 'final hit on the downbeat, natural ring-out; fade only over 28.8-30.0'),
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


def hf_attack(m, t, search=0.012):
    """earliest transient (beater click / any hit) near bar line t: first sample in [t-2ms, t+search] where the
    0.5 ms envelope of the >1 kHz band exceeds 3x its median over the preceding 20 ms."""
    hp = signal.sosfiltfilt(signal.butter(4, 1000, 'highpass', fs=SR, output='sos'), m[int((t - 0.05) * SR):int((t + 0.05) * SR)])
    e = np.sqrt(np.convolve(hp ** 2, np.ones(24) / 24, mode='same'))
    base = int(0.05 * SR)
    pre = np.median(e[base - int(0.022 * SR):base - int(0.002 * SR)]) + 1e-12
    a, b = base - int(0.002 * SR), base + int(search * SR)
    idx = np.where(e[a:b] > 3 * pre)[0]
    return (t - 0.002 + idx[0] / SR) if len(idx) else None


def main():
    src_mp3, out = sys.argv[1], sys.argv[2]
    os.makedirs(os.path.join(out, 'work'), exist_ok=True)
    src = decode(src_mp3, os.path.join(out, 'work', 'src_48k.wav'))
    mono = src.mean(1)
    kin, _ = detect_kicks(mono, SR, min_gap=0.35)

    def kick_near(t, tol=0.012):
        i = np.argmin(np.abs(kin - t))
        return float(kin[i]) if abs(kin[i] - t) < tol else None

    # --- segment table in samples
    segs = []
    for tb0, tb1, sb0 in SEGMENTS:
        t0 = int(round(tb0 * BAR * SR))
        t1 = N if tb1 == 15.5 else int(round(tb1 * BAR * SR))
        s0 = int(round(sb0 * BAR * SR))
        segs.append({'t0': t0, 't1': t1, 's0': s0, 'off': s0 - t0})
    assert segs[-1]['t1'] == N

    # --- crossfade placement at each internal boundary
    joins = []
    for a, b in zip(segs[:-1], segs[1:]):
        tg = b['t0'] / SR                                  # timeline bar line
        in_k = kick_near(b['s0'] / SR)                     # incoming kick attack (source time)
        out_k = kick_near((a['t1'] + a['off']) / SR)       # outgoing next kick attack (source time)
        in_h = hf_attack(mono, b['s0'] / SR)               # incoming HF transient
        out_h = hf_attack(mono, (a['t1'] + a['off']) / SR) # outgoing HF transient
        cand = [k - b['s0'] / SR for k in (in_k, in_h) if k] + \
               [k - (a['t1'] + a['off']) / SR for k in (out_k, out_h) if k]
        rel = min(cand) if cand else 0.0                   # earliest transient relative to the bar line
        end = tg + rel - XF_MARGIN
        joins.append({'bar_line': tg, 'xf_start': end - XF, 'xf_end': end,
                      'in_kick_rel_ms': None if in_k is None else 1000 * (in_k - b['s0'] / SR),
                      'out_kick_rel_ms': None if out_k is None else 1000 * (out_k - (a['t1'] + a['off']) / SR),
                      'in_hf_rel_ms': None if in_h is None else 1000 * (in_h - b['s0'] / SR),
                      'out_hf_rel_ms': None if out_h is None else 1000 * (out_h - (a['t1'] + a['off']) / SR),
                      'src_out': (a['t1'] + a['off']) / SR, 'src_in': b['s0'] / SR})

    # --- gain envelopes per segment (equal-power crossfades)
    n = np.arange(N)
    y = np.zeros((N, 2))
    for i, sg in enumerate(segs):
        g = np.zeros(N)
        lo = 0 if i == 0 else int(round(joins[i - 1]['xf_start'] * SR))
        hi = N if i == len(segs) - 1 else int(round(joins[i]['xf_end'] * SR))
        g[lo:hi] = 1.0
        if i > 0:                                          # fade in over previous join
            a_ = int(round(joins[i - 1]['xf_start'] * SR)); b_ = int(round(joins[i - 1]['xf_end'] * SR))
            ph = (n[a_:b_] - a_ + 0.5) / (b_ - a_)
            g[a_:b_] = np.sin(0.5 * np.pi * ph)
        if i < len(segs) - 1:                              # fade out over next join
            a_ = int(round(joins[i]['xf_start'] * SR)); b_ = int(round(joins[i]['xf_end'] * SR))
            ph = (n[a_:b_] - a_ + 0.5) / (b_ - a_)
            g[a_:b_] = np.cos(0.5 * np.pi * ph)
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
    sf.write(os.path.join(out, 'reel_music.wav'), y.astype(np.float32), SR, subtype='PCM_24')

    # ------------------------------------------------------------------ verification
    yr, _ = sf.read(os.path.join(out, 'reel_music.wav'), dtype='float64', always_2d=True)
    m = yr.mean(1)
    rep = {'frames': len(yr), 'duration_s': len(yr) / SR, 'sample_rate': SR, 'channels': yr.shape[1],
           'gain_db': round(gain_db, 2), 'true_peak_dbtp': round(20 * np.log10(true_peak(yr)), 2),
           'sample_peak_dbfs': round(20 * np.log10(np.max(np.abs(yr))), 2)}
    try:
        import pyloudnorm as pyln
        rep['integrated_lufs'] = round(pyln.Meter(SR).integrated_loudness(yr), 2)
    except Exception as e:  # pragma: no cover
        rep['integrated_lufs'] = f'n/a ({e})'

    # kicks on the final timeline: matched filter with the source's own kick (first kick of the main drop)
    tk = kick_near(27 * BAR)
    tpl, pre = kick_template(mono, SR, tk)
    ksrc, _ = matched_kicks(mono, SR, tpl, pre, thr=0.85)
    t0s, bs, _, ress, oks = fit_grid(ksrc, BEAT, 0.0)
    rep['source_grid_fit'] = {'bpm': round(60 / bs, 4), 't0_ms': round(1000 * t0s, 2), 'kicks': int(len(ksrc)),
                              'on_grid': int(oks.sum()), 'resid_rms_ms': round(1000 * float(np.sqrt(np.mean(ress[oks] ** 2))), 2)}
    kout, klev = matched_kicks(m, SR, tpl, pre, thr=0.85)
    t0f, bfit, nidx, res, ok = fit_grid(kout, BEAT, 0.0)
    rep['grid_fit'] = {'t0_ms': round(1000 * t0f, 2), 'bpm': round(60 / bfit, 4), 'kicks': int(len(kout)),
                       'on_grid': int(ok.sum()), 'resid_rms_ms': round(1000 * float(np.sqrt(np.mean(res[ok] ** 2))), 2),
                       'resid_max_ms': round(1000 * float(np.max(np.abs(res[ok]))), 2)}
    # the final hit is a different sound (crash + low hit): low-band attack detector
    kh, _ = detect_kicks(m, SR, min_gap=0.35)
    fh = kh[np.argmin(np.abs(kh - 14 * BAR))]
    rep['final_hit_attack'] = round(float(fh), 4)

    # splice checks
    dx = np.abs(np.diff(yr, axis=0)).max(1)
    hp = signal.sosfilt(signal.butter(4, 9000, 'highpass', fs=SR, output='sos'), m)
    e1 = np.sqrt(np.convolve(hp ** 2, np.ones(48) / 48, mode='same'))      # 1 ms HF envelope
    checks = []
    for j in joins:
        a_ = int(round(j['xf_start'] * SR)); b_ = int(round(j['xf_end'] * SR))
        nb = slice(max(0, a_ - SR), min(N - 1, b_ + SR))                       # +-1 s neighbourhood
        local = dx[nb]
        jump_xf = float(dx[a_ - 2:b_ + 2].max())
        # HF click detector: max 1 ms HF level inside the crossfade vs median HF level of the neighbourhood
        hf_ratio_db = 20 * np.log10(e1[a_:b_].max() / (np.median(e1[nb]) + 1e-12))
        hf_p99_db = 20 * np.log10(np.percentile(e1[nb], 99) / (np.median(e1[nb]) + 1e-12))
        # onsets across the splice: kicks within 2 beats either side
        allk = np.sort(np.r_[kout, fh])
        near = allk[(allk > j['bar_line'] - 2.1 * BEAT) & (allk < j['bar_line'] + 2.1 * BEAT)]
        ioi = np.diff(near)
        checks.append({
            'bar_line_s': round(j['bar_line'], 4), 'xfade_s': [round(j['xf_start'], 4), round(j['xf_end'], 4)],
            'xfade_ms': round(1000 * (j['xf_end'] - j['xf_start']), 2),
            'src_out_s': round(j['src_out'], 4), 'src_in_s': round(j['src_in'], 4),
            'in_kick_attack_ms_after_bar': None if j['in_kick_rel_ms'] is None else round(j['in_kick_rel_ms'], 2),
            'out_kick_attack_ms_after_bar': None if j['out_kick_rel_ms'] is None else round(j['out_kick_rel_ms'], 2),
            'in_hf_attack_ms_after_bar': None if j['in_hf_rel_ms'] is None else round(j['in_hf_rel_ms'], 2),
            'out_hf_attack_ms_after_bar': None if j['out_hf_rel_ms'] is None else round(j['out_hf_rel_ms'], 2),
            'max_sample_jump_in_xfade': round(jump_xf, 5),
            'neighbourhood_p99_9_jump': round(float(np.percentile(local, 99.9)), 5),
            'neighbourhood_max_jump': round(float(local.max()), 5),
            'jump_ok': bool(jump_xf <= np.percentile(local, 99.9)),
            'hf_peak_in_xfade_vs_median_db': round(float(hf_ratio_db), 2),
            'hf_p99_vs_median_db_neighbourhood': round(float(hf_p99_db), 2),
            'hf_ok': bool(hf_ratio_db <= hf_p99_db),
            'kicks_around': [round(float(k), 4) for k in near],
            'kick_offsets_from_grid_ms': [round(1000 * float(k - round(k / BEAT) * BEAT), 2) for k in near],
            'iois_ms': [round(1000 * float(v), 2) for v in ioi],
            'iois_in_beats': [round(float(v / BEAT), 3) for v in ioi],
        })
    rep['splices'] = checks
    rep['start_declick_ms'] = DECLICK * 1000
    rep['fade'] = [FADE_T0, DUR]
    rep['first_sample'] = float(np.abs(yr[0]).max())
    rep['last_sample'] = float(np.abs(yr[-1]).max())

    # the break: find the near-silence and the fill inside the stop bar
    b0, b1 = 7 * BAR, 8 * BAR
    e10 = np.sqrt(np.convolve(m ** 2, np.ones(480) / 480, mode='same'))
    db10 = 20 * np.log10(e10 + 1e-9)
    seg = db10[int(b0 * SR):int(b1 * SR)]
    loud_ref = np.percentile(db10[int(2 * BAR * SR):int(7 * BAR * SR)], 50)
    quiet = seg < loud_ref - 10
    runs, i = [], 0
    while i < len(quiet):
        if quiet[i]:
            k = i
            while k < len(quiet) and quiet[k]:
                k += 1
            if (k - i) / SR > 0.08:
                runs.append([round(b0 + i / SR, 3), round(b0 + k / SR, 3)])
            i = k
        else:
            i += 1
    rep['break_quiet_runs'] = runs
    rep['drop_ref_level_db'] = round(float(loud_ref), 1)

    # section levels
    def lvl(t0, t1):
        s = m[int(t0 * SR):int(t1 * SR)]
        return round(float(20 * np.log10(np.sqrt(np.mean(s ** 2)) + 1e-12)), 2)
    sub = signal.sosfilt(signal.butter(4, 120, 'lowpass', fs=SR, output='sos'), m)

    def sublvl(t0, t1):
        s = sub[int(t0 * SR):int(t1 * SR)]
        return round(float(20 * np.log10(np.sqrt(np.mean(s ** 2)) + 1e-12)), 2)
    sections = []
    for name, a, b, note in SECTIONS:
        t0, t1 = a * BAR, min(b * BAR, DUR)
        sections.append({'name': name, 'start': round(t0, 4), 'end': round(t1, 4), 'bars': [a, b],
                         'rms_dbfs': lvl(t0, t1), 'sub_dbfs': sublvl(t0, t1), 'note': note})

    # ---------------------------------------------------------------- grid.json
    beats = [round(i * BEAT, 4) for i in range(62)]
    kicks = []
    for t, lv in zip(kout, klev):
        bi = int(round(t / BEAT))
        kicks.append({'t': round(float(t), 4), 'beat': bi, 'bar': bi // 4, 'beat_in_bar': bi % 4 + 1,
                      'offset_ms': round(1000 * float(t - bi * BEAT), 2), 'ncc': round(float(lv), 3), 'kind': 'kick'})
    bi = int(round(fh / BEAT))
    kicks.append({'t': round(float(fh), 4), 'beat': bi, 'bar': bi // 4, 'beat_in_bar': bi % 4 + 1,
                  'offset_ms': round(1000 * float(fh - bi * BEAT), 2), 'ncc': None, 'kind': 'final_hit'})
    kicks.sort(key=lambda k: k['t'])
    grid = {
        'track': {'source': 'Mixkit', 'id': 1012, 'title': 'Take this Higher', 'artist': 'Michael Ramir C.',
                  'tags': ['EDM', 'Pop', 'Confident', 'Powerful', 'Bass', 'Drums', 'Fashion', 'Parties'],
                  'listed_on': ['https://mixkit.co/free-stock-music/pop/', 'https://mixkit.co/free-stock-music/mood/confident/',
                                'https://mixkit.co/free-stock-music/tag/fashion/?page=2'],
                  'download_mp3': 'https://assets.mixkit.co/music/1012/1012.mp3',
                  'download_note': 'Mixkit has no per-track music page; the card Download button serves this same 256 kbps mp3',
                  'license': 'Mixkit Stock Music Free License (https://mixkit.co/license/#musicFree)'},
        'file': 'reel_music.wav', 'sample_rate': SR, 'channels': 2, 'duration': DUR, 'frames': N,
        'bpm': BPM, 'beat': round(BEAT, 6), 'eighth': round(BEAT / 2, 6), 'sixteenth': round(BEAT / 4, 6),
        'bar': round(BAR, 6), 'beats_total': 62, 'bars_total': 15.5,
        'grid_note': 'beat n sits at n*beat (bar 0 at 0.000 s); kick attacks land 0-7 ms after the grid line, '
                     'so cut video on the grid frame (a cut 1 frame early also reads as on-beat).',
        'drop_a': round(1 * BAR, 4), 'drop_b': round(8 * BAR, 4), 'final_hit': round(14 * BAR, 4),
        'drops': [{'name': 'drop_a', 't': round(1 * BAR, 4)}, {'name': 'drop_b', 't': round(8 * BAR, 4)},
                  {'name': 'final_hit', 't': round(14 * BAR, 4)}],
        'break': [round(7 * BAR, 4), round(8 * BAR, 4)],
        'break_detail': {'stop_hit': round(7 * BAR, 4),
                         'tape_stop_fall': [round(7 * BAR, 4), runs[0][0]] if runs else None,
                         'near_silence': runs[0] if runs else None,
                         'vocal_stutter_fill': [runs[0][1], runs[1][0]] if len(runs) > 1 else None,
                         'gap': runs[1] if len(runs) > 1 else None,
                         'soft_pre_drop': [runs[1][1], round(8 * BAR, 4)] if len(runs) > 1 else None,
                         'note': 'quiet = 10 ms level more than 10 dB under the drop-A median, >= 80 ms'},
        'fade': [FADE_T0, DUR],
        'splices': [{'t': c['bar_line_s'], 'xfade': c['xfade_s'], 'src_out': c['src_out_s'], 'src_in': c['src_in_s']}
                    for c in checks],
        'source_map': [{'timeline': [round(a * BAR, 4), round(min(b * BAR, DUR), 4)],
                        'source': [round(s * BAR, 4), round(s * BAR + (min(b * BAR, DUR) - a * BAR), 4)],
                        'source_bars': [s, s + (b - a)]} for a, b, s in SEGMENTS],
        'sections': sections,
        'bars_t': [round(i * BAR, 4) for i in range(16)],
        'beats_t': beats,
        'kicks': [k['t'] for k in kicks],
        'kicks_detail': kicks,
    }
    with open(os.path.join(out, 'grid.json'), 'w') as f:
        json.dump(grid, f, indent=1)
    rep['sections'] = sections
    rep['kick_count'] = len(kicks)
    rep['kicks_per_section'] = {s['name']: int(sum(1 for k in kicks if s['start'] - 0.01 <= k['t'] < s['end'] - 0.01)) for s in sections}
    with open(os.path.join(out, 'build_report.json'), 'w') as f:
        json.dump(rep, f, indent=1)

    # ---------------------------------------------------------------- picture
    import librosa
    import librosa.display
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots(3, 1, figsize=(22, 11), sharex=True, gridspec_kw={'height_ratios': [3, 1.2, 1]})
    Mel = librosa.feature.melspectrogram(y=m.astype(np.float32), sr=SR, n_fft=4096, hop_length=480, n_mels=160, fmax=18000)
    librosa.display.specshow(librosa.power_to_db(Mel, ref=np.max), sr=SR, hop_length=480, x_axis='time', y_axis='mel',
                             fmax=18000, ax=ax[0], cmap='magma')
    cols = {'intro_hook': '#9ad', 'drop_a': '#e4002e', 'break': '#fff', 'drop_b': '#e4002e', 'end_hit': '#9ad'}
    for s in sections:
        ax[0].axvline(s['start'], color=cols[s['name']], lw=2)
        ax[0].text(s['start'] + 0.05, 14500, s['name'], color='w', fontsize=11, weight='bold')
    for c in checks:
        ax[0].axvline(c['bar_line_s'], color='lime', lw=1, ls='--')
    ax[0].set_title(f"reel_music.wav  Mixkit #1012 'Take this Higher'  {BPM:.0f} BPM  bar {BAR:.4f}s  15.5 bars = 30.000 s  "
                    f"{rep['integrated_lufs']} LUFS  {rep['true_peak_dbtp']} dBTP   (green dashed = splices)")
    tt = np.arange(N) / SR
    ax[1].plot(tt[::24], yr[::24, 0], lw=0.3, color='k')
    for i in range(63):
        ax[1].axvline(i * BEAT, color='0.8' if i % 4 else 'tab:red', lw=0.5 if i % 4 else 1.0, zorder=0)
    ax[1].plot([k['t'] for k in kicks], np.full(len(kicks), 0.9), 'v', color='tab:blue', ms=4)
    ax[1].set_ylim(-1, 1)
    ax[1].set_ylabel('wave / beats / kicks')
    ax[2].plot(tt[::48], db10[::48], lw=0.6)
    ax[2].set_ylim(-60, 0)
    ax[2].set_ylabel('10 ms dBFS')
    ax[2].set_xticks(np.arange(0, 30.5, 1))
    for s in sections:
        ax[2].axvline(s['start'], color='tab:green', lw=1)
    plt.tight_layout()
    plt.savefig(os.path.join(out, 'reel_music_spectrogram.png'), dpi=65)
    print(json.dumps({k: rep[k] for k in ('frames', 'duration_s', 'gain_db', 'true_peak_dbtp', 'sample_peak_dbfs',
                                          'integrated_lufs', 'source_grid_fit', 'grid_fit', 'final_hit_attack', 'break_quiet_runs', 'kick_count',
                                          'kicks_per_section', 'first_sample', 'last_sample')}, indent=1))
    for c in checks:
        print(json.dumps(c))


if __name__ == '__main__':
    main()
