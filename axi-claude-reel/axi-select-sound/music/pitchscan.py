# pitchscan.py - estimate the true pitch of each tonal VSCO sample (writes samples/pitchmap.json)
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
out = {}
pats = ["Strings/Cello Section/susvib/*.wav", "Strings/Cello Section/spic/*.wav", "Strings/Cello Section/trem/*.wav",
        "Strings/Solo Contrabass/SusNV/*.wav", "Strings/Solo Contrabass/Spic/*.wav", "Strings/Viola Section/susvib/*.wav",
        "Strings/Violin Section/susVib/*.wav", "Strings/Violin Section/Trem/*.wav", "Keys/Upright Piano/*.wav",
        "Percussion/Timpani/*.wav"]
for pat in pats:
    for p in sorted(glob.glob(os.path.join(ROOT, pat))):
        x = load(p)
        f = f0_est(x, 44100, lo=25 if "Contrabass" in p or "Piano" in p or "Timpani" in p else 50)
        m = 69 + 12 * np.log2(f / 440.0)
        out[os.path.relpath(p, ROOT)] = round(float(m), 2)
        print("%-70s %8.2f Hz  midi %.2f" % (os.path.relpath(p, ROOT)[-60:], f, m), flush=True)
json.dump(out, open("/home/user/rr/sound3/music/samples/pitchmap_raw.json", "w"), indent=0)
