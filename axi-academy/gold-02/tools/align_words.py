"""Estimate word timings inside each VAD phrase.

Words get time in proportion to their length (letters ≈ phonemes for Arabic), then each
boundary is snapped to the quietest 10 ms frame within ±0.18 s — micro-pauses between words.
Usage: python -I align_words.py audio16k.f32 transcript.json out_words.json
"""
import json, sys, re
import numpy as np

audio_path, tr_path, out_path = sys.argv[1:4]
x = np.fromfile(audio_path, dtype=np.float32)
SR, HOP, WIN = 16000, 160, 320
n = (len(x) - WIN) // HOP
frames = np.lib.stride_tricks.sliding_window_view(x, WIN)[::HOP][:n]
env = 20 * np.log10(np.sqrt((frames ** 2).mean(axis=1)) + 1e-9)
env = np.convolve(env, np.ones(3) / 3, mode='same')

def weight(w):
    core = re.sub(r'[ً-ْـ«»،.؟?!:()\-]', '', w)
    digits = re.sub(r'[^0-9]', '', core)
    if digits:  # numbers are spoken as words: «2025» → «ألفين وخمسة وعشرين», «70%» → «سبعين بالمية»
        n = int(digits); rest = len(re.sub(r'[0-9,%]', '', core))
        base = 3 if n == 1000 else 3.6 * len(digits)
        if '%' in core: base += 6
        return max(1.0, base + rest) + 0.6
    return max(1.0, len(core)) + 0.6  # small constant for word transitions

def snap(t, lo, hi):
    a, b = int(max(lo, t - 0.18) * 100), int(min(hi, t + 0.18) * 100)
    if b <= a: return t
    seg = env[a:b]
    # prefer quiet frames close to the estimate
    cost = seg + np.abs(np.arange(a, b) / 100 - t) * 25
    return (a + int(np.argmin(cost))) / 100

tr = json.load(open(tr_path))
words = []
for ph in tr:
    a, b = ph['a'], ph['b']
    ws = ph['text'].split()
    wts = np.array([weight(w) for w in ws]); cum = np.concatenate([[0], np.cumsum(wts)]) / wts.sum()
    bounds = [a + c * (b - a) for c in cum]
    for i in range(1, len(bounds) - 1):
        bounds[i] = snap(bounds[i], bounds[i - 1] + 0.08, b - 0.08)
    for i, w in enumerate(ws):
        words.append({'w': w, 's': round(bounds[i], 2), 'e': round(bounds[i + 1], 2), 'p': ph['id']})
json.dump(words, open(out_path, 'w'), ensure_ascii=False, indent=0)
print(len(words), 'words')
