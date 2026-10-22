# bed QA: peak, integrated loudness (BS.1770 gated), short-term max, silence in protected windows, and a click
# detector (2nd-difference spikes that are not at a cue's own start = unintended discontinuities)
#   python3 bed_check.py bed.wav [protect "a-b,c-d"]
import sys, os, json, numpy as np
from scipy import signal
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsp import read_wav, SR, K_SOS
x = read_wav(sys.argv[1]); prot = sys.argv[2] if len(sys.argv) > 2 else ""
rep = json.load(open(os.path.splitext(sys.argv[1])[0] + ".json"))
k = signal.sosfilt(K_SOS, x, axis=0); e = np.sum(k ** 2, axis=1)
B, H = int(0.4 * SR), int(0.1 * SR)
c = np.concatenate([[0], np.cumsum(e)]); blocks = (c[B::H] - c[:-B:H][: len(c[B::H])]) / B
L = -0.691 + 10 * np.log10(blocks + 1e-20)
g1 = blocks[L > -70]; Lr = -0.691 + 10 * np.log10(g1.mean()) - 10
I = -0.691 + 10 * np.log10(blocks[(L > -70) & (L > Lr)].mean())
S3 = int(3 * SR); cs = (c[S3::H] - c[:-S3:H][: len(c[S3::H])]) / S3; ST = -0.691 + 10 * np.log10(cs.max() + 1e-20)
out = dict(file=sys.argv[1], dur=round(len(x) / SR, 3), peak_dbfs=round(20 * np.log10(np.abs(x).max()), 2),
           integrated_lufs=round(I, 2), short_term_max_lufs=round(ST, 2), momentary_max_lufs=round(L.max(), 2))
for w in [w for w in prot.split(",") if w]:
    a, b = [float(v) for v in w.split("-")]
    seg = x[int(a * SR):int(b * SR)]
    out["window_%s" % w] = round(20 * np.log10(np.abs(seg).max() + 1e-12), 1)
starts = np.array(sorted(p["start"] for p in rep["placements"]))
m = x.mean(1); d2 = np.abs(m[2:] - 2 * m[1:-1] + m[:-2])
med = signal.medfilt(d2[::8], 31); med = np.repeat(med, 8)[: len(d2)]
cand = np.where((d2 > 0.004) & (d2 > 40 * (med + 1e-7)))[0]
bad = []
for i in cand:
    t = (i + 1) / SR
    j = np.searchsorted(starts, t)
    near = any(abs(t - starts[q]) < 0.03 for q in (j - 1, j) if 0 <= q < len(starts))
    if not near: bad.append(round(t, 4))
# merge clusters
cl = []
for t in bad:
    if not cl or t - cl[-1] > 0.01: cl.append(t)
out["clicks_outside_cue_onsets"] = len(cl); out["click_times"] = cl[:20]
print(json.dumps(out))
