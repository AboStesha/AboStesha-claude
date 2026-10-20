#!/usr/bin/env python3
"""drop_metrics.py ANALYSIS_DIR file.mp3:t0:t1 [...] - punch / brightness / mode metrics inside a chosen drop section."""
import json
import os
import sys

import numpy as np
import librosa
from scipy import signal

MAJ = np.array([5.0, 2.0, 3.5, 2.0, 4.5, 4.0, 2.0, 4.5, 2.0, 3.5, 1.5, 4.0])   # Temperley
MIN = np.array([5.0, 2.0, 3.5, 4.5, 2.0, 4.0, 2.0, 4.5, 3.5, 2.0, 1.5, 4.0])
NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

adir = sys.argv[1]
for arg in sys.argv[2:]:
    path, t0, t1 = arg.rsplit(':', 2)
    t0, t1 = float(t0), float(t1)
    an = json.load(open(os.path.join(adir, os.path.splitext(os.path.basename(path))[0] + '.analysis.json')))
    y, sr = librosa.load(path, sr=44100, mono=True, offset=t0, duration=t1 - t0)
    beat = an['beat']
    # punch: per-beat crest (peak / rms) of the low band and of the full band
    sos = signal.butter(4, 150, 'lowpass', fs=sr, output='sos')
    lo = signal.sosfilt(sos, y)
    nb = int(len(y) / (beat * sr))
    cre_lo, cre_full = [], []
    for i in range(nb):
        a, b = int(i * beat * sr), int((i + 1) * beat * sr)
        cre_lo.append(20 * np.log10(np.max(np.abs(lo[a:b])) / (np.sqrt(np.mean(lo[a:b] ** 2)) + 1e-9)))
        cre_full.append(20 * np.log10(np.max(np.abs(y[a:b])) / (np.sqrt(np.mean(y[a:b] ** 2)) + 1e-9)))
    # kick attack: low-band envelope rise time 10%->90% around strongest low peaks
    env = np.abs(signal.hilbert(lo))
    env = signal.sosfilt(signal.butter(2, 60, 'lowpass', fs=sr, output='sos'), env)
    pk, _ = signal.find_peaks(env, distance=int(0.2 * sr), height=np.percentile(env, 95))
    lo_share = float(np.mean(lo ** 2) / np.mean(y ** 2))
    S = np.abs(librosa.stft(y, n_fft=4096, hop_length=1024))
    cent = float(np.median(librosa.feature.spectral_centroid(S=S, sr=sr)))
    flat = float(np.median(librosa.feature.spectral_flatness(S=S)))
    yh = librosa.effects.harmonic(y)
    ch = librosa.feature.chroma_cqt(y=yh, sr=sr, bins_per_octave=36).mean(1)
    best = {}
    for k in range(12):
        for prof, m in ((MAJ, 'maj'), (MIN, 'min')):
            c = float(np.corrcoef(np.roll(prof, k), ch)[0, 1])
            if c > best.get(m, (-9,))[0]:
                best[m] = (c, NAMES[k])
    rms_db = 20 * np.log10(np.sqrt(np.mean(y ** 2)) + 1e-9)
    print(json.dumps({
        'file': os.path.basename(path), 'span': [t0, t1], 'bpm': an['bpm'], 'rms_db': round(float(rms_db), 1),
        'crest_full_db': round(float(np.median(cre_full)), 1), 'crest_low_db': round(float(np.median(cre_lo)), 1),
        'low_share': round(lo_share, 2), 'centroid': int(cent), 'flatness': round(flat, 4),
        'kicks_per_beat': round(len(pk) / max(nb, 1), 2),
        'key_major': [round(best['maj'][0], 3), best['maj'][1]], 'key_minor': [round(best['min'][0], 3), best['min'][1]],
        'mode': 'major' if best['maj'][0] > best['min'][0] else 'minor',
    }))
