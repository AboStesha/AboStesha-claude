#!/usr/bin/env python3
"""vo_cut.py — split each character's ElevenLabs take (audio/vo/raw/<name>.wav) into its script lines.

Line starts come from the word timestamps in audio/vo/words.json (faster-whisper); the cut lands on the quietest
10 ms frame near each boundary, then every line is trimmed to its speech with a short pre-roll and fade.
Writes audio/vo/lines/NN_<name>.wav (48 kHz mono) and prints each line's duration."""
import json, os, numpy as np, soundfile as sf

ROOT = os.path.join(os.path.dirname(__file__), '..', 'audio', 'vo')
# film line numbers in the order each character recorded them, and the first word of every line after the first
LINES = {
    'rojin':  ([1, 3, 10, 13, 15, 16], ['تلتزم', 'قررت', 'تشعر', 'لذلك', 'بناها']),
    'noor':   ([5, 14, 16, 17],        ['في', 'بناها', 'أكسي']),          # 17 («منذ 2007») is dropped below
    'aesha':  ([4, 8, 16],             ['تضغط', 'بناها']),
    'saeed':  ([7, 9, 12, 16],         ['خسارة', 'خبر', 'بناها']),
    'sarmad': ([2, 6, 11, 16],         ['صفقة', 'تستيقظ', 'بناها']),
}
SKIP = {17}
words = json.load(open(os.path.join(ROOT, 'words.json')))
os.makedirs(os.path.join(ROOT, 'lines'), exist_ok=True)

def env_db(x, sr, hop=0.01):
    n = int(sr * hop); k = len(x) // n
    r = np.sqrt((x[:k * n].reshape(k, n) ** 2).mean(1) + 1e-12)
    return 20 * np.log10(r), n

for name, (nums, firsts) in LINES.items():
    x, sr = sf.read(os.path.join(ROOT, 'raw', name + '.wav'), dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    e, hop = env_db(x, sr)
    es = np.convolve(e, np.ones(5) / 5, mode='same')                 # 50 ms smoothing for the cut search
    ws = words[name]; bounds = [0.0]; i = 0
    for fw in firsts:                                                 # boundary = start of the next line's first word
        while ws[i][0] != fw: i += 1
        b = ws[i][1]; i += 1
        lo, hi = int((b - 0.55) / 0.01), int((b + 0.25) / 0.01)
        bounds.append((lo + int(np.argmin(es[lo:hi]))) * 0.01)
    bounds.append(len(x) / sr)
    floor = e.max() - 42                                              # speech gate: 42 dB under the take's loudest frame
    for n, a, b in zip(nums, bounds[:-1], bounds[1:]):
        if n in SKIP: continue
        fa, fb = int(a / 0.01), int(b / 0.01)
        on = np.where(e[fa:fb] > floor)[0]
        s = max(0, (fa + on[0]) * hop - int(0.04 * sr)); t = min(len(x), (fa + on[-1] + 1) * hop + int(0.14 * sr))
        y = x[s:t].copy(); fi, fo = int(0.008 * sr), int(0.06 * sr)
        y[:fi] *= np.linspace(0, 1, fi); y[-fo:] *= np.linspace(1, 0, fo) ** 2
        sf.write(os.path.join(ROOT, 'lines', f'{n:02d}_{name}.wav'), y, sr, subtype='PCM_24')
        print(f'{n:02d}_{name:7s} {s / sr:6.2f}-{t / sr:6.2f}  {len(y) / sr:5.2f}s')
