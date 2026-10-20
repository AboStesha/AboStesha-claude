#!/usr/bin/env python3
"""
analyze_music.py - beat-grid and structure analysis of candidate music tracks.

For each input file:
  * exact constant tempo + beat phase  (comb search on a 1.45 ms onset envelope)
  * bar phase (downbeat) from where energy jumps land, 8-bar phrase phase as well
  * per-bar features: RMS dB, sub (<120 Hz) dB, high (>4 kHz) dB, spectral centroid, onset density
  * drops (biggest bar-to-bar energy rises), stops/silence gaps (>= 40 ms below -45 dBFS)
  * kick times (low-band onsets on the 1/16 grid)
  * a spectrogram PNG with bars, sections, drops and the energy curve

Usage:  python3 -I analyze_music.py OUT_DIR file1.mp3 [file2.mp3 ...]
Writes  OUT_DIR/<stem>.analysis.json, OUT_DIR/<stem>.png and OUT_DIR/summary.json
"""
import json
import os
import sys
from concurrent.futures import ProcessPoolExecutor

import numpy as np
import librosa
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from scipy import signal

HOP = 64


def comb_tempo(env, fps, lo=60.0, hi=180.0):
    """Global tempo + phase by maximising the mean onset strength on a strict grid."""
    # coarse estimate first
    tg = librosa.autocorrelate(env, max_size=int(fps * 2.2))
    lags = np.arange(len(tg)) / fps
    best = []
    for bpm in np.arange(lo, hi, 0.25):
        lag = 60.0 / bpm * fps
        i = int(round(lag))
        if i < len(tg):
            best.append((tg[i], bpm))
    best.sort(reverse=True)
    cands = sorted({round(b, 2) for _, b in best[:6]})

    def score(bpm):
        per = 60.0 / bpm * fps
        n = int((len(env) - 1) / per)
        idx_base = np.arange(n) * per
        # phase search at 1-frame resolution
        phases = np.arange(0, per, 1.0)
        sc = np.array([env[np.clip(np.round(idx_base + p).astype(int), 0, len(env) - 1)].mean() for p in phases])
        k = int(np.argmax(sc))
        return sc[k], phases[k]

    results = []
    for c in cands:
        grid = np.arange(c - 0.6, c + 0.6, 0.02)
        scs = [(score(b), b) for b in grid]
        (s, ph), b = max(scs, key=lambda x: x[0][0])
        # fine
        grid = np.arange(b - 0.03, b + 0.03, 0.002)
        scs = [(score(bb), bb) for bb in grid]
        (s, ph), b = max(scs, key=lambda x: x[0][0])
        results.append((s, b, ph / fps))
    results.sort(reverse=True)
    return results


def analyse(path, out_dir):
    stem = os.path.splitext(os.path.basename(path))[0]
    y, sr = librosa.load(path, sr=44100, mono=False)
    if y.ndim == 1:
        y = np.stack([y, y])
    mono = y.mean(0)
    dur = len(mono) / sr
    fps = sr / HOP

    # onset envelopes: full band and kick band
    S = np.abs(librosa.stft(mono, n_fft=2048, hop_length=HOP))
    freqs = librosa.fft_frequencies(sr=sr, n_fft=2048)
    logS = np.log1p(100 * S)
    flux = np.maximum(0, np.diff(logS, axis=1, prepend=logS[:, :1]))
    env_full = flux.sum(0)
    kb = (freqs >= 30) & (freqs <= 150)
    env_kick = flux[kb].sum(0)
    env = env_full / (env_full.max() + 1e-9) + env_kick / (env_kick.max() + 1e-9)
    env = env - signal.medfilt(env, 31)
    env = np.maximum(env, 0)

    res = comb_tempo(env, fps)
    # prefer the 70-150 BPM octave for the beat
    s, bpm, phase = res[0]
    while bpm < 70:
        bpm *= 2
    while bpm > 150:
        bpm /= 2
    beat = 60.0 / bpm
    # re-fit phase at this bpm
    per = beat * fps
    n = int((len(env) - 1) / per)
    phases = np.arange(0, per, 1.0)
    sc = [env[np.clip(np.round(np.arange(n) * per + p).astype(int), 0, len(env) - 1)].mean() for p in phases]
    phase = phases[int(np.argmax(sc))] / fps
    beats = phase + np.arange(int((dur - phase) / beat) + 1) * beat
    beats = beats[beats < dur]

    # per-beat features
    rms = librosa.feature.rms(y=mono, frame_length=2048, hop_length=HOP)[0]
    P = S ** 2
    sub = np.sqrt(P[freqs < 120].sum(0) / P.shape[0])
    hi = np.sqrt(P[freqs > 4000].sum(0) / P.shape[0])
    cent = librosa.feature.spectral_centroid(S=S, sr=sr)[0]

    def seg_mean(x, t0, t1, db=True):
        a, b = int(t0 * fps), max(int(t0 * fps) + 1, int(t1 * fps))
        v = float(np.mean(x[a:b] ** 2)) if db else float(np.mean(x[a:b]))
        return 10 * np.log10(v + 1e-12) if db else v

    bt = np.append(beats, beats[-1] + beat)
    beat_db = np.array([seg_mean(rms, bt[i], bt[i + 1]) for i in range(len(beats))])
    beat_sub = np.array([seg_mean(sub, bt[i], bt[i + 1]) for i in range(len(beats))])
    # bar phase: energy rises land on downbeats
    jump = np.zeros(len(beats))
    for i in range(4, len(beats) - 4):
        jump[i] = (beat_db[i:i + 4].mean() - beat_db[i - 4:i].mean()) + 0.5 * (beat_sub[i:i + 4].mean() - beat_sub[i - 4:i].mean())
    jp = np.maximum(jump, 0)
    # also kick strength on each beat
    kick_at = np.array([env_kick[min(len(env_kick) - 1, int(round(b * fps)))] for b in beats])
    ph_score = [jp[k::4].sum() + 0.0 * kick_at[k::4].mean() for k in range(4)]
    bar_phase = int(np.argmax(ph_score))
    downbeats = beats[bar_phase::4]
    bar = 4 * beat

    # per-bar features
    bars = []
    for i, t0 in enumerate(downbeats):
        t1 = t0 + bar
        if t1 > dur:
            break
        bars.append({
            'i': i, 't': round(float(t0), 4),
            'db': round(seg_mean(rms, t0, t1), 2),
            'sub_db': round(seg_mean(sub, t0, t1), 2),
            'hi_db': round(seg_mean(hi, t0, t1), 2),
            'cent': int(seg_mean(cent, t0, t1, db=False)),
            'onsets': float(np.round(seg_mean(env, t0, t1, db=False), 4)),
        })
    db = np.array([b['db'] for b in bars])
    sdb = np.array([b['sub_db'] for b in bars])
    # drops: rise of bar energy vs the previous 2 bars, sub-weighted
    drops = []
    for i in range(1, len(bars)):
        prev = slice(max(0, i - 2), i)
        rise = (db[i] - db[prev].mean()) + 0.5 * (sdb[i] - sdb[prev].mean())
        drops.append((round(float(rise), 2), i, bars[i]['t']))
    drops.sort(reverse=True)
    top_drops = [d for d in drops if d[0] > 3.0][:6]
    # 8-bar phrase phase from drops
    if top_drops:
        ph8 = np.zeros(8)
        for r, i, t in drops:
            if r > 0:
                ph8[i % 8] += r
        phrase_phase = int(np.argmax(ph8))
    else:
        phrase_phase = 0

    # sections: novelty between consecutive bars on (db, sub, hi, cent)
    F = np.array([[b['db'], b['sub_db'], b['hi_db'], b['cent'] / 300.0, b['onsets'] * 20] for b in bars])
    nov = np.r_[0, np.linalg.norm(np.diff(F, axis=0), axis=1)]
    thr = np.median(nov) + 1.5 * np.std(nov)
    bounds = [0] + [i for i in range(1, len(bars)) if nov[i] > thr] + [len(bars)]
    sections = []
    for a, b2 in zip(bounds[:-1], bounds[1:]):
        if b2 <= a:
            continue
        lvl = float(db[a:b2].mean())
        sections.append({'bars': [a, b2], 't0': bars[a]['t'], 't1': round(bars[a]['t'] + (b2 - a) * bar, 3),
                         'db': round(lvl, 1), 'sub_db': round(float(sdb[a:b2].mean()), 1)})
    loud = np.percentile(db, 90)
    for s_ in sections:
        s_['level'] = 'full' if s_['db'] > loud - 3 else ('mid' if s_['db'] > loud - 9 else 'low')

    # silence / stop gaps
    rdb = 20 * np.log10(rms + 1e-9)
    quiet = rdb < -45
    gaps = []
    i = 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]:
                j += 1
            if (j - i) / fps >= 0.04:
                gaps.append([round(i / fps, 3), round(j / fps, 3)])
            i = j
        else:
            i += 1
    # relative dips (stops): beat energy 12 dB under the surrounding 2 bars
    stops = []
    for k in range(8, len(beats) - 1):
        ctx = np.r_[beat_db[k - 8:k]].mean()
        if beat_db[k] < ctx - 12:
            stops.append(round(float(beats[k]), 3))

    # kicks: low-band onset peaks
    kp, _ = signal.find_peaks(env_kick, height=np.percentile(env_kick, 97), distance=int(0.12 * fps))
    kicks = (kp / fps).round(4)

    # loudness
    peak = float(np.max(np.abs(y)))
    res_out = {
        'file': os.path.basename(path), 'dur': round(dur, 3), 'bpm': round(bpm, 3), 'beat': round(beat, 5),
        'beat_phase': round(float(phase), 4), 'bar_phase': bar_phase, 'first_downbeat': round(float(downbeats[0]), 4),
        'phrase_phase_bars': phrase_phase, 'tempo_candidates': [(round(float(a), 4), round(float(b), 3)) for a, b, c in res[:3]],
        'grid_fit': round(float(np.max(sc) / (env.mean() + 1e-9)), 2),
        'peak_dbfs': round(20 * np.log10(peak + 1e-12), 2),
        'loud_db': round(float(loud), 1), 'dyn_db': round(float(np.percentile(db, 95) - np.percentile(db, 10)), 1),
        'centroid_full': int(np.median([b['cent'] for b in bars if b['db'] > loud - 3] or [0])),
        'drops': top_drops, 'sections': sections, 'gaps': gaps[:40], 'stops': stops[:40],
        'bars': bars, 'n_kicks': int(len(kicks)), 'kicks': kicks.tolist(),
    }
    with open(os.path.join(out_dir, stem + '.analysis.json'), 'w') as f:
        json.dump(res_out, f, indent=1)

    # plot
    fig, ax = plt.subplots(2, 1, figsize=(22, 8), sharex=True, gridspec_kw={'height_ratios': [3, 1]})
    M = librosa.feature.melspectrogram(y=mono, sr=sr, n_fft=4096, hop_length=1024, n_mels=128, fmax=16000)
    librosa.display.specshow(librosa.power_to_db(M, ref=np.max), sr=sr, hop_length=1024, x_axis='time',
                             y_axis='mel', fmax=16000, ax=ax[0], cmap='magma')
    for b in bars:
        ax[0].axvline(b['t'], color='w', lw=0.4 if b['i'] % 8 != phrase_phase else 1.2, alpha=0.5)
    for r, i, t in top_drops:
        ax[0].axvline(t, color='cyan', lw=2)
        ax[0].text(t, 12000, f'+{r:.0f}', color='cyan', fontsize=9)
    for g in gaps:
        ax[0].axvspan(g[0], g[1], color='lime', alpha=0.6)
    ax[0].set_title(f"{os.path.basename(path)}  {bpm:.2f} BPM  bar {bar:.3f}s  downbeat {downbeats[0]:.3f}s  "
                    f"centroid(full) {res_out['centroid_full']} Hz  dyn {res_out['dyn_db']} dB")
    tb = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=HOP)
    ax[1].plot(tb[::8], rdb[::8], lw=0.5, color='k')
    ax[1].plot([b['t'] + bar / 2 for b in bars], db, 'o-', color='tab:red', ms=3, label='bar dB')
    ax[1].plot([b['t'] + bar / 2 for b in bars], sdb - sdb.max() + db.max(), 's-', color='tab:blue', ms=2, label='sub (rel)')
    for s_ in sections:
        ax[1].axvline(s_['t0'], color='tab:green', lw=1)
    ax[1].set_ylim(max(-60, db.min() - 15), 0)
    ax[1].legend(loc='lower right')
    ax[1].set_xticks(np.arange(0, dur, 5))
    plt.tight_layout()
    plt.savefig(os.path.join(out_dir, stem + '.png'), dpi=70)
    plt.close(fig)
    return {k: res_out[k] for k in ('file', 'dur', 'bpm', 'first_downbeat', 'phrase_phase_bars', 'grid_fit', 'peak_dbfs',
                                    'loud_db', 'dyn_db', 'centroid_full', 'drops', 'n_kicks')} | {
        'sections': [(s_['t0'], s_['t1'], s_['level'], s_['db']) for s_ in sections], 'gaps': gaps[:12]}


if __name__ == '__main__':
    import librosa.display  # noqa
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    files = sys.argv[2:]
    with ProcessPoolExecutor(4) as ex:
        summ = list(ex.map(analyse, files, [out] * len(files)))
    json.dump(summ, open(os.path.join(out, 'summary.json'), 'w'), indent=1)
    for s_ in summ:
        print(json.dumps(s_))
