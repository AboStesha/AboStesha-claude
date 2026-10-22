# helper (estimator copied from pitchscan.py)
import json, os, glob, subprocess, sys
import numpy as np
ROOT = "/home/user/rr/sound3/music/samples/vsco"
def load(p, sr=44100):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"], capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.float32)
def f0_est(x, sr, lo=25, hi=1500):
    # pick the loudest 1.0 s region after the attack; YIN-style difference function
    n = len(x); w = int(sr * 0.8)
    e = np.convolve(x ** 2, np.ones(4410) / 4410, "same")
    st = int(sr * 0.3); c = st + int(np.argmax(e[st:max(st + 1, n - w)])) if n - w > st else st
    seg = x[c:c + w] if c + w <= n else x[-w:]
    seg = seg - seg.mean()
    N = len(seg); W = N // 2
    taumax = int(sr / lo); taumin = int(sr / hi)
    F = np.fft.rfft(seg, 2 * N); ac = np.fft.irfft(F * np.conj(F))[:taumax + 1]
    cs = np.concatenate([[0], np.cumsum(seg ** 2)])
    tau = np.arange(taumax + 1)
    d = cs[W] - cs[0] + (cs[tau + W] - cs[tau]) - 2 * np.array([np.dot(seg[:W], seg[t:t + W]) for t in tau]) if False else None
    # faster: use autocorr normalised
    r = ac / (ac[0] + 1e-12)
    # cumulative mean normalised difference approx from autocorr
    dd = 1 - r
    dd[1:] = dd[1:] * np.arange(1, len(dd)) / (np.cumsum(dd[1:]) + 1e-12)
    dd[0] = 1
    cand = np.flatnonzero((dd[taumin:taumax] < 0.15)) + taumin
    if len(cand):
        t0 = cand[0]
        while t0 + 1 < taumax and dd[t0 + 1] < dd[t0]: t0 += 1
    else:
        t0 = taumin + int(np.argmin(dd[taumin:taumax]))
    # parabolic interp
    if 1 <= t0 < len(dd) - 1:
        a, b, c_ = dd[t0 - 1], dd[t0], dd[t0 + 1]; den = a - 2 * b + c_
        t0f = t0 + (0.5 * (a - c_) / den if den != 0 else 0)
    else: t0f = t0
    return sr / t0f

# pitchscan_add.py - scan only the tonal samples missing from samples/pitchmap_raw.json and merge them in (same estimator)
P = "/home/user/rr/sound3/music/samples/pitchmap_raw.json"
out = json.load(open(P))
pats = ["Strings/Cello Section/spic/*.wav"]
for pat in pats:
    for p in sorted(glob.glob(os.path.join(ROOT, pat))):
        k = os.path.relpath(p, ROOT)
        if k in out: continue
        f = f0_est(load(p), 44100, lo=50)
        out[k] = round(float(69 + 12 * np.log2(f / 440.0)), 2)
        print("%-60s midi %.2f" % (k[-60:], out[k]), flush=True)
json.dump(out, open(P, "w"), indent=0)
