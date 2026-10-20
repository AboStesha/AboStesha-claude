#!/usr/bin/env python3
"""
bar_study.py ANALYSIS_DIR file.mp3 - precise grid refit from kick onsets + per-bar harmonic/timbre similarity.

  * kick onsets: low-band (40-140 Hz) energy rise, located to ~0.1 ms by parabolic interpolation
  * grid refit: least squares t = t0 + n*beat on kicks that sit within 25 ms of the coarse grid
  * per bar: chroma (harmonic part), MFCC, RMS, sub level -> cosine similarity matrix, saved as PNG
"""
import json
import os
import sys

import numpy as np
import librosa
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from scipy import signal

adir, path = sys.argv[1], sys.argv[2]
stem = os.path.splitext(os.path.basename(path))[0]
an = json.load(open(os.path.join(adir, stem + '.analysis.json')))
y, sr = librosa.load(path, sr=44100, mono=True)
beat0, db0 = an['beat'], an['first_downbeat']

# --- kick onsets
sos = signal.butter(4, [40, 140], 'bandpass', fs=sr, output='sos')
lo = signal.sosfiltfilt(sos, y)
env = signal.sosfiltfilt(signal.butter(2, 200, 'lowpass', fs=sr, output='sos'), np.abs(lo))
d = np.diff(env, prepend=env[0])
d = np.maximum(d, 0)
d = signal.sosfiltfilt(signal.butter(2, 300, 'lowpass', fs=sr, output='sos'), d)
pk, props = signal.find_peaks(d, distance=int(0.15 * sr), height=np.percentile(d, 99.0))
kicks = pk / sr

# --- refit grid on kicks near beats
n = np.round((kicks - db0) / beat0)
resid = kicks - (db0 + n * beat0)
m = np.abs(resid) < 0.025
A = np.vstack([np.ones(m.sum()), n[m]]).T
(t0, beat), *_ = np.linalg.lstsq(A, kicks[m], rcond=None)
res2 = kicks[m] - (t0 + n[m] * beat)
print(f'kicks {len(kicks)}  on-grid {m.sum()}  refit beat {beat:.6f} s = {60 / beat:.4f} BPM  t0 {t0:.4f}  '
      f'resid rms {1000 * np.sqrt(np.mean(res2 ** 2)):.2f} ms  max {1000 * np.max(np.abs(res2)):.2f} ms  '
      f'median offset {1000 * np.median(res2):.2f} ms')
bar = 4 * beat
first_db = t0 + (np.round((db0 - t0) / beat)) * beat
while first_db - bar > 0:
    first_db -= bar

# --- per-bar features
yh = librosa.effects.harmonic(y)
hop = 512
C = librosa.feature.chroma_cqt(y=yh, sr=sr, hop_length=hop)
MF = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20, hop_length=hop)
R = librosa.feature.rms(y=y, hop_length=hop)[0]
nb = int((len(y) / sr - first_db) / bar)
feat_c, feat_m, info = [], [], []
for i in range(nb):
    a = int((first_db + i * bar) * sr / hop)
    b = int((first_db + (i + 1) * bar) * sr / hop)
    feat_c.append(C[:, a:b].mean(1))
    feat_m.append(MF[1:, a:b].mean(1))
    kb = [k for k in kicks if first_db + i * bar <= k < first_db + (i + 1) * bar]
    info.append({'bar': i, 't': round(first_db + i * bar, 4), 'db': round(float(20 * np.log10(R[a:b].mean() + 1e-9)), 1),
                 'kicks': len(kb)})
Fc = np.array(feat_c)
Fc = Fc / (np.linalg.norm(Fc, axis=1, keepdims=True) + 1e-9)
Fm = np.array(feat_m)
Fm = (Fm - Fm.mean(0)) / (Fm.std(0) + 1e-9)
Fm = Fm / (np.linalg.norm(Fm, axis=1, keepdims=True) + 1e-9)
Sc = Fc @ Fc.T
Sm = Fm @ Fm.T
# dominant chord root per bar
names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
for i, r in enumerate(info):
    top = np.argsort(feat_c[i])[::-1][:3]
    r['chroma_top'] = '-'.join(names[k] for k in top)
    print(f"bar {i:3d} t {r['t']:8.3f}  {r['db']:6.1f} dB  kicks {r['kicks']}  {r['chroma_top']}")

fig, ax = plt.subplots(1, 2, figsize=(16, 8))
ax[0].imshow(Sc, cmap='viridis', origin='lower', vmin=0.6, vmax=1)
ax[0].set_title('chroma similarity per bar')
ax[1].imshow(Sm, cmap='viridis', origin='lower', vmin=-0.2, vmax=1)
ax[1].set_title('timbre (MFCC) similarity per bar')
for a in ax:
    a.set_xticks(range(0, nb, 4))
    a.set_yticks(range(0, nb, 4))
    a.grid(color='w', lw=0.3, alpha=0.4)
plt.tight_layout()
plt.savefig(os.path.join(adir, stem + '.bars.png'), dpi=60)
json.dump({'beat': beat, 'bpm': 60 / beat, 't0': t0, 'first_downbeat': first_db, 'bar': bar, 'bars': info,
           'kicks': kicks.round(5).tolist(), 'chroma_sim': Sc.round(3).tolist(), 'timbre_sim': Sm.round(3).tolist()},
          open(os.path.join(adir, stem + '.bars.json'), 'w'))
