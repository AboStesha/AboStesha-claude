#!/usr/bin/env python3
# qa.py - measurements + pictures for a rendered score: venv_music/bin/python -I qa.py ep2|ep1
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from scipy import signal
from lib import SR, ROOT, read_wav, loudness_series, integrated, true_peak_db, kweight, stereo
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

EP = sys.argv[1]
D = os.path.join(ROOT, EP); Q = os.path.join(ROOT, "qa", EP); os.makedirs(Q, exist_ok=True)
M = json.load(open(os.path.join(D, "markers.json")))
STEMS = ["pads", "bass", "perc", "motif", "fx"]
X = {s: read_wav(os.path.join(D, s + ".wav")) for s in STEMS}
mix = read_wav(os.path.join(D, "mix.wav"))
N = len(mix); DUR = N / SR
R = dict(episode=EP, duration=round(DUR, 4))
drops = M["drops"]; sp0, sp1 = M["speech_window"]

# 1. clipping, stems sum
R["peak_dbfs"] = round(20 * np.log10(np.abs(mix).max()), 2)
R["true_peak_dbtp"] = round(true_peak_db(mix), 2)
R["clipped_samples"] = int((np.abs(mix) >= 0.999).sum())
R["stems_sum_err_db"] = round(20 * np.log10(np.abs(sum(X.values()) - mix).max() + 1e-12), 1)
R["integrated_lufs"] = round(integrated(mix), 2)
R["stem_lufs"] = {s: round(integrated(X[s]), 1) for s in STEMS}

# 2. discontinuities: largest sample-to-sample jumps vs the local 5 ms RMS of the first difference
def jumps(x, name, top=4):
    m = x.mean(1)
    d = np.abs(np.diff(m))
    k = 240
    loc = np.sqrt(np.convolve(d ** 2, np.ones(k) / k, "same")) + 1e-9
    ratio = d / loc
    idx = np.argsort(ratio)[::-1]
    out = []; taken = []
    for i in idx:
        if any(abs(i - j) < SR * 0.05 for j in taken): continue
        if d[i] < 10 ** (-70 / 20): continue
        taken.append(i); out.append([round(i / SR, 3), round(float(ratio[i]), 1), round(20 * np.log10(d[i] + 1e-12), 1)])
        if len(out) >= top: break
    return out
R["jump_scan"] = {s: jumps(X[s], s) for s in STEMS + []}
R["jump_scan"]["mix"] = jumps(mix, "mix")
# a high-passed (>6 kHz) energy spike scan in the non-percussive stems (a click shows as a broadband spike)
def hf_spikes(x):
    h = signal.sosfilt(signal.butter(4, 6000, "highpass", fs=SR, output="sos"), x.mean(1))
    e = np.sqrt(np.convolve(h ** 2, np.ones(48) / 48, "same")) + 1e-12
    bg = np.sqrt(np.convolve(h ** 2, np.ones(4800) / 4800, "same")) + 1e-12
    r = 20 * np.log10(e / bg)
    i = np.argsort(r)[::-1][:1]
    return [round(float(i[0] / SR), 3), round(float(r[i[0]]), 1), round(float(20 * np.log10(e[i[0]])), 1)]
R["hf_spike_db_over_local"] = {s: hf_spikes(X[s]) for s in ["pads", "bass", "motif"]}

# 3. loudness curves
ts, st = loudness_series(mix, 3.0, 0.5)
tm, mo = loudness_series(mix, 0.4, 0.1)
R["short_term_lufs_0.5s"] = [[round(a, 1), round(b, 1)] for a, b in zip(ts, st)]
w = (ts >= 0.5) & (ts <= 6.0)
R["first6s_short_term_range_LU"] = round(float(st[w].max() - st[w].min()), 2)
R["first6s_short_term"] = [round(float(v), 1) for v in st[w]]
wm = (tm >= 0.5) & (tm <= 6.0)
R["first6s_momentary_range_LU"] = round(float(mo[wm].max() - mo[wm].min()), 2)

# 4. drops: spectral-flux onset strength and energy step
f, tt, Z = signal.stft(mix.mean(1), fs=SR, nperseg=2048, noverlap=2048 - 480)
S = np.abs(Z); L = np.log1p(1000 * S)
flux = np.maximum(0, np.diff(L, axis=1)).sum(0); tf = tt[1:]
med = np.median(flux)
R["drops"] = {}
for k, t0 in drops.items():
    w_ = (tf > t0 - 0.25) & (tf < t0 + 0.25)
    i = np.argmax(np.where(w_, flux, -1))
    pre = mo[(tm > t0 - 1.5) & (tm < t0 - 0.3)].mean(); post = mo[(tm > t0 + 0.1) & (tm < t0 + 1.3)].mean()
    R["drops"][k] = dict(t=t0, onset_peak_t=round(float(tf[i]), 3), onset_x_median=round(float(flux[i] / med), 1),
                         momentary_pre=round(float(pre), 1), momentary_post=round(float(post), 1), step_LU=round(float(post - pre), 1))

# 5. chroma (60-2000 Hz) per section, key fit (Krumhansl minor profile)
KMIN = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
KMAJ = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
fC, tC, ZC = signal.stft(mix.mean(1), fs=SR, nperseg=16384, noverlap=16384 - 2400)   # 2.9 Hz bins
SC = np.abs(ZC)
fsel = (fC > 90) & (fC < 2000)
pc = (np.round(12 * np.log2(fC[fsel] / 440.0)) + 9) % 12   # 0 = C
def chroma(t0, t1):
    w_ = (tC >= t0) & (tC < t1)
    P = (SC[fsel][:, w_] ** 2).sum(1)
    c = np.bincount(pc.astype(int), weights=P, minlength=12)
    return c / (c.sum() + 1e-12)
names = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]
def keyfit(c):
    best = []
    for r in range(12):
        best.append((np.corrcoef(c, np.roll(KMIN, r))[0, 1], names[r] + " minor"))
        best.append((np.corrcoef(c, np.roll(KMAJ, r))[0, 1], names[r] + " major"))
    best.sort(reverse=True)
    return [[b[1], round(float(b[0]), 3)] for b in best[:3]]
R["chroma_whole_top"] = [names[i] for i in np.argsort(chroma(0, DUR))[::-1][:6]]
R["key_fit_whole"] = keyfit(chroma(0, DUR))
R["key_fit_sections"] = []
for s_ in M["sections"]:
    c = chroma(s_["t0"], s_["t1"])
    R["key_fit_sections"].append([s_["name"][:28], round(s_["t0"], 2), keyfit(c)[0], [names[i] for i in np.argsort(c)[::-1][:4]]])

# 6. low end: L/R correlation below 120 Hz, the low band share
lo = signal.sosfiltfilt(signal.butter(4, 120, "lowpass", fs=SR, output="sos"), mix, axis=0)
R["lowband_LR_corr"] = round(float(np.corrcoef(lo[:, 0], lo[:, 1])[0, 1]), 4)
full = mix
R["LR_corr_full"] = round(float(np.corrcoef(full[:, 0], full[:, 1])[0, 1]), 3)
sd = (mix[:, 0] - mix[:, 1]) / 2; md = (mix[:, 0] + mix[:, 1]) / 2
R["side_to_mid_db"] = round(float(10 * np.log10((sd ** 2).mean() / (md ** 2).mean())), 1)
# windowed correlation (1 s)
cw = []
for i in range(0, N - SR, SR):
    a, b = mix[i:i + SR, 0], mix[i:i + SR, 1]
    if np.abs(a).max() > 1e-4: cw.append(np.corrcoef(a, b)[0, 1])
R["LR_corr_1s_min_median"] = [round(float(np.min(cw)), 3), round(float(np.median(cw)), 3)]

# 7. the 1-4 kHz band: title / end card vs under speech
bp = signal.sosfiltfilt(signal.butter(4, (1000, 4000), "bandpass", fs=SR, output="sos"), mix.mean(1))
def band_db(t0, t1):
    a, b = int(t0 * SR), int(t1 * SR); return float(10 * np.log10((bp[a:b] ** 2).mean() + 1e-20))
def full_db(t0, t1):
    a, b = int(t0 * SR), int(t1 * SR); return float(10 * np.log10((mix[a:b].mean(1) ** 2).mean() + 1e-20))
eh = drops["END_HIT"]
title = band_db(0.4, min(3.0, sp0)); endc = band_db(eh + 0.05, eh + 3.0)
sp_parts = [band_db(a, a + 1.0) for a in np.arange(sp0 + 0.5, sp1 - 1.0, 1.0)]
R["band_1_4k"] = dict(title_db=round(title, 1), endcard_db=round(endc, 1), speech_median_db=round(float(np.median(sp_parts)), 1),
                      speech_max_1s_db=round(float(np.max(sp_parts)), 1),
                      title_minus_speech_median=round(title - float(np.median(sp_parts)), 1),
                      endcard_minus_speech_median=round(endc - float(np.median(sp_parts)), 1),
                      ratio_band_to_full_speech_db=round(float(np.median([band_db(a, a + 1) - full_db(a, a + 1) for a in np.arange(sp0 + 0.5, sp1 - 1.0, 1.0)])), 1),
                      ratio_band_to_full_title_db=round(band_db(0.4, min(3.0, sp0)) - full_db(0.4, min(3.0, sp0)), 1))

# 8. spectral balance: centroid, octave band shares
Pm = (S ** 2).mean(1)
R["spectral_centroid_hz"] = round(float((f * Pm).sum() / Pm.sum()), 0)
octs = [(20, 60), (60, 120), (120, 250), (250, 500), (500, 1000), (1000, 2000), (2000, 4000), (4000, 8000), (8000, 16000)]
tot = Pm.sum()
R["octave_share_db"] = {"%d-%d" % o: round(float(10 * np.log10(Pm[(f >= o[0]) & (f < o[1])].sum() / tot + 1e-20)), 1) for o in octs}
cent_t = (f[:, None] * S ** 2).sum(0) / ((S ** 2).sum(0) + 1e-20)
R["centroid_median_hz"] = round(float(np.median(cent_t[(S ** 2).sum(0) > 1e-9])), 0)
# end: level of the last 0.5 s
R["tail_dbfs"] = {str(t): round(float(20 * np.log10(np.abs(mix[int(t * SR):int((t + 0.1) * SR)]).max() + 1e-12)), 1)
                  for t in [round(DUR - 2.0, 1), round(DUR - 1.0, 1), round(DUR - 0.5, 1), round(DUR - 0.12, 2)]}
json.dump(R, open(os.path.join(Q, "qa.json"), "w"), indent=1)
print(json.dumps({k: v for k, v in R.items() if k not in ("short_term_lufs_0.5s",)}, indent=None)[:6000])

# ------------------------------------------------------------------ pictures
def spec_img(x, t0, t1, path, title, w=14, h=5.0, marks=()):
    a, b = int(t0 * SR), int(t1 * SR)
    y = x[a:b].mean(1)
    nper = 4096 if (t1 - t0) > 20 else 2048
    ff, tq, Zq = signal.stft(y, fs=SR, nperseg=nper, noverlap=nper - nper // 8)
    P = 20 * np.log10(np.abs(Zq) + 1e-9)
    fig, ax = plt.subplots(2, 1, figsize=(w, h), dpi=72, gridspec_kw=dict(height_ratios=[3, 1]), sharex=True)
    ax[0].pcolormesh(tq + t0, ff, P, vmin=P.max() - 95, vmax=P.max() - 5, cmap="magma", shading="auto")
    ax[0].set_yscale("symlog", linthresh=200); ax[0].set_ylim(25, 16000)
    ax[0].set_yticks([50, 100, 200, 500, 1000, 2000, 4000, 8000, 16000]); ax[0].set_yticklabels(["50", "100", "200", "500", "1k", "2k", "4k", "8k", "16k"])
    ax[0].set_title(title, fontsize=10)
    tl, ml = loudness_series(x, 0.4, 0.05); tsl, sl = loudness_series(x, 3.0, 0.1)
    ax[1].plot(tl, ml, lw=0.7, color="#888"); ax[1].plot(tsl, sl, lw=1.4, color="#c00")
    ax[1].set_xlim(t0, t1); ax[1].set_ylim(-45, -5); ax[1].grid(alpha=0.3); ax[1].set_ylabel("LUFS M/S")
    for (tq_, lab) in marks:
        if t0 <= tq_ <= t1:
            for a_ in ax: a_.axvline(tq_, color="cyan", lw=0.8, alpha=0.8)
            ax[0].text(tq_, 13000, lab, color="cyan", fontsize=8)
    fig.tight_layout(); fig.savefig(path, pil_kwargs={"quality": 80}); plt.close(fig)

marks = [(v, k) for k, v in drops.items()] + [(sp0, "speech")]
spec_img(mix, 0, DUR, os.path.join(Q, "spec_whole.jpg"), "%s mix: spectrogram + momentary (grey) / short-term (red) loudness" % EP, marks=marks)
spec_img(mix, 0, 8, os.path.join(Q, "spec_start.jpg"), "start 0-8 s", w=10, h=4.6, marks=marks)
for k, v in drops.items():
    spec_img(mix, max(0, v - 4), min(DUR, v + 4), os.path.join(Q, "spec_%s.jpg" % k), "%s at %.3f" % (k, v), w=10, h=4.6, marks=marks)
spec_img(mix, drops["END_HIT"] - 3, DUR, os.path.join(Q, "spec_end.jpg"), "end card", w=10, h=4.6, marks=marks)
# stems overview: short-term loudness per stem
fig, ax = plt.subplots(figsize=(14, 4), dpi=72)
for s, c in zip(STEMS, ["#4a8", "#a64", "#68c", "#c6c", "#cc4"]):
    a, b = loudness_series(X[s], 3.0, 0.25); ax.plot(a, b, label=s, color=c)
a, b = loudness_series(mix, 3.0, 0.25); ax.plot(a, b, label="mix", color="k", lw=2)
for v, k in marks: ax.axvline(v, color="r", lw=0.6)
ax.set_ylim(-50, -8); ax.grid(alpha=0.3); ax.legend(ncol=6, fontsize=8); ax.set_title("short-term loudness per stem")
fig.tight_layout(); fig.savefig(os.path.join(Q, "stems_loudness.jpg")); plt.close(fig)
# chroma over time
fig, ax = plt.subplots(figsize=(14, 3), dpi=72)
hop = 1.0; cols = []
for t0 in np.arange(0, DUR - hop, hop): cols.append(chroma(t0, t0 + hop))
ax.imshow(np.array(cols).T, aspect="auto", origin="lower", extent=[0, DUR, -0.5, 11.5], cmap="viridis")
ax.set_yticks(range(12)); ax.set_yticklabels(names, fontsize=7); ax.set_title("chroma (60-2000 Hz), 1 s frames")
for v, k in marks: ax.axvline(v, color="r", lw=0.6)
fig.tight_layout(); fig.savefig(os.path.join(Q, "chroma.jpg")); plt.close(fig)
print("images in", Q)
