# check_windows.py ep1|ep2 - new note/hit onsets inside the protected windows + spectral flux there vs. the neighbourhood
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from scipy import signal
from lib import SR, ROOT, read_wav
EP = sys.argv[1]
W = {"ep1": [(3.00, 4.75), (41.55, 43.25)], "ep2": [(3.06, 4.80)]}[EP]
on = json.load(open(os.path.join(ROOT, "work", "onsets_%s.json" % EP)))
mix = read_wav(os.path.join(ROOT, EP, "mix.wav")).mean(1)
f, t, Z = signal.stft(mix, fs=SR, nperseg=2048, noverlap=2048 - 480)
L = np.log1p(1000 * np.abs(Z)); fl = np.maximum(0, np.diff(L, axis=1)).sum(0); tf = t[1:]
for a, b in W:
    inside = [o for o in on if a <= o[0] <= b]
    fin = fl[(tf >= a) & (tf <= b)].max(); fout = np.median(fl[(tf >= a - 6) & (tf <= b + 6)])
    print("window %.2f-%.2f: %d onsets inside %s; max flux inside / local median = %.2f" % (a, b, len(inside), inside[:8], fin / fout))
