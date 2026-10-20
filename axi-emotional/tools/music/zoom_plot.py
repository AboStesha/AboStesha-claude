#!/usr/bin/env python3
"""zoom_plot.py ANALYSIS_DIR OUT.png file.mp3 t0 t1 [t0 t1 ...] - zoomed spectrogram + waveform with the beat grid."""
import json
import os
import sys

import numpy as np
import librosa
import librosa.display
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

adir, out, path = sys.argv[1:4]
spans = [(float(a), float(b)) for a, b in zip(sys.argv[4::2], sys.argv[5::2])]
an = json.load(open(os.path.join(adir, os.path.splitext(os.path.basename(path))[0] + '.analysis.json')))
y, sr = librosa.load(path, sr=44100, mono=True)
beat = an['beat']
db0 = an['first_downbeat']
fig, axes = plt.subplots(2, len(spans), figsize=(7 * len(spans), 7), squeeze=False,
                         gridspec_kw={'height_ratios': [3, 1]})
for k, (t0, t1) in enumerate(spans):
    seg = y[int(t0 * sr):int(t1 * sr)]
    M = librosa.feature.melspectrogram(y=seg, sr=sr, n_fft=2048, hop_length=256, n_mels=128, fmax=16000)
    ax = axes[0, k]
    librosa.display.specshow(librosa.power_to_db(M, ref=np.max), sr=sr, hop_length=256, x_axis='time', y_axis='mel',
                             fmax=16000, ax=ax, cmap='magma')
    nb0 = int(np.floor((t0 - db0) / beat))
    for n in range(nb0, nb0 + int((t1 - t0) / beat) + 2):
        tb = db0 + n * beat - t0
        if 0 <= tb <= t1 - t0:
            down = n % 4 == 0
            ax.axvline(tb, color='cyan' if down else 'w', lw=1.4 if down else 0.4, alpha=0.8)
            if down:
                ax.text(tb, 14000, f'{t0 + tb:.2f}', color='cyan', fontsize=7, rotation=90)
    ax.set_title(f'{os.path.basename(path)}  {t0:.2f}-{t1:.2f}s')
    tt = np.arange(len(seg)) / sr
    axes[1, k].plot(tt, seg, lw=0.3)
    axes[1, k].set_xlim(0, t1 - t0)
plt.tight_layout()
plt.savefig(out, dpi=60)
