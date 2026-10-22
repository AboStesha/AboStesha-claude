#!/usr/bin/env python3
# Axi Select · SFX BED renderer: a cue sheet -> one stereo 48 kHz SFX bed of exact length.
#   python3 -I render_bed.py cues.json out.wav --dur 91.0 [--protect 3.00-4.75,41.55-43.25] [--ceiling -3]
# Cue fields: t (output s of the sync point), file (palette wav), gain_db, pan (-1..1, balance with a constant-power
# law), sync ("onset" = the file's onset lands on t, "peak" = its loudness peak lands on t; default: the palette's),
# optional: rate (playback-rate pitch/speed variation, e.g. 0.97), dur (truncate after this many s, `fade` s fade; default
# min(0.25, 0.6 * dur) so a shortened sound decays instead of being chopped: review fix, was 40 ms),
# repeat [n, dt] or repeat_times [offsets] (one cue fired as a run, e.g. staggered pips), gain_step_db / rate_step /
# pan_to / rate_seq (applied across the run), layers [sub-cues with their own absolute t] (a merged, richer event).
# Protected windows are kept silent (60 ms fade-out before, 30 ms fade-in after; anything that would sound inside is
# reported). A transparent peak limiter (1.5 ms look-ahead, 80 ms release) keeps the bed at or under the ceiling and
# reports its gain reduction. Writes out.wav (float32) and out.json (report).
import os, sys, json, argparse
import numpy as np
from scipy import signal
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsp import SR, read_wav, write_wav, loud_win

ap = argparse.ArgumentParser()
ap.add_argument("cues"); ap.add_argument("out")
ap.add_argument("--dur", type=float, required=True)
ap.add_argument("--palette", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "palette"))
ap.add_argument("--protect", default="")
ap.add_argument("--ceiling", type=float, default=-3.0)
ap.add_argument("--master_db", type=float, default=0.0)
A = ap.parse_args()

meta = json.load(open(os.path.join(A.palette, "palette.json")))["sounds"]
cues = json.load(open(A.cues))
if isinstance(cues, dict):
    cues = cues["cues"]
N = int(round(A.dur * SR))
TAIL = 8 * SR
bed = np.zeros((N + TAIL, 2))
_cache = {}


def load(name):
    key = name[:-4] if name.endswith(".wav") else name
    if key not in _cache:
        _cache[key] = read_wav(os.path.join(A.palette, key + ".wav"))
    return key, _cache[key]


def resample(x, rate):
    if abs(rate - 1) < 1e-4:
        return x
    n = int(round(len(x) / rate))
    ti = np.arange(n) * rate
    i0 = np.floor(ti).astype(int); fr = ti - i0
    i0 = np.clip(i0, 0, len(x) - 2)
    return x[i0] * (1 - fr)[:, None] + x[i0 + 1] * fr[:, None]


def balance(x, p):
    p = np.clip(p, -1, 1); th = (p + 1) * np.pi / 4
    gl, gr = np.sqrt(2) * np.cos(th), np.sqrt(2) * np.sin(th)
    return np.stack([x[:, 0] * gl, x[:, 1] * gr], 1)


placed = []


def place(c, parent=None):
    key, x = load(c["file"])
    m = meta[key]
    rate = float(c.get("rate", 1.0))
    sync = c.get("sync", m["sync_default"])
    off = (m["onset_s"] if sync == "onset" else m["peak_s"]) / rate
    times = [0.0]
    if "repeat" in c:
        n, dt = c["repeat"]; times = [k * dt for k in range(int(n))]
    if "repeat_times" in c:
        times = list(c["repeat_times"])
    nrep = len(times)
    for k, dtk in enumerate(times):
        f = k / max(1, nrep - 1)
        r = rate * (1 + c.get("rate_step", 0.0) * k)
        if "rate_seq" in c:
            r = float(c["rate_seq"][min(k, len(c["rate_seq"]) - 1)])
        y = resample(x, r)
        if "dur" in c:
            L = int(c["dur"] * SR / 1.0)
            if L < len(y):
                y = y[:L].copy(); fl = min(int(float(c.get("fade", min(0.25, 0.6 * float(c["dur"])))) * SR), L)
                y[L - fl:] *= np.linspace(1, 0, fl)[:, None] ** 2
        g = 10 ** ((c.get("gain_db", 0.0) + c.get("gain_step_db", 0.0) * k + A.master_db) / 20)
        p = c.get("pan", 0.0); pt = c.get("pan_to")
        if pt is not None and nrep > 1:
            p = p + (pt - p) * f
        if pt is not None and nrep == 1:
            # one moving sound: the pan travels from pan to pan_to over pan_dur s from its onset
            pd = float(c.get("pan_dur", min(0.8, len(y) / SR)))
            k0 = int(off * SR * rate / r)
            ramp = np.clip((np.arange(len(y)) - k0) / max(1, pd * SR), 0, 1)
            y = balance(y * g, p + (pt - p) * ramp)
        else:
            y = balance(y * g, p)
        t0 = c["t"] + dtk - (off * rate / r)
        s = int(round(t0 * SR))
        if s < 0:
            y = y[-s:]; s = 0
        e = min(len(bed), s + len(y))
        bed[s:e] += y[: e - s]
        placed.append(dict(t=round(c["t"] + dtk, 3), start=round(t0, 3), end=round(t0 + len(y) / SR, 3), file=key,
                           gain_db=c.get("gain_db", 0.0), pan=round(float(p), 2), beat=c.get("beat", parent and parent.get("beat")),
                           event=(c.get("event") or (parent or {}).get("event", ""))[:90]))


for c in cues:
    place(c)
    for l in c.get("layers", []):
        place(l, c)

# protected windows
wins = []
for w in [w for w in A.protect.split(",") if w.strip()]:
    a, b = [float(v) for v in w.split("-")]
    wins.append((a, b))
report_prot = []
for a, b in wins:
    sa, sb = int(a * SR), int(b * SR)
    pre = int(0.06 * SR); post = int(0.03 * SR)
    inside = bed[sa:sb]
    lvl = 20 * np.log10(np.max(np.abs(inside)) + 1e-12)
    hit = [p for p in placed if p["start"] < b and p["end"] > a]
    report_prot.append(dict(window=[a, b], level_before_mute_dbfs=round(lvl, 1), overlapping=[(p["file"], p["t"]) for p in hit]))
    g = np.ones(len(bed))
    g[sa - pre:sa] = np.cos(np.linspace(0, np.pi / 2, pre)) ** 2
    g[sa:sb] = 0
    g[sb:sb + post] = np.sin(np.linspace(0, np.pi / 2, post)) ** 2
    bed *= g[:, None]

bed = bed[:N]
fe = int(0.05 * SR); bed[N - fe:] *= np.linspace(1, 0, fe)[:, None] ** 2

# transparent peak limiter
ceil = 10 ** (A.ceiling / 20)
pk_before = float(np.max(np.abs(bed)))
gr_max = 0.0
if pk_before > ceil:
    a = np.max(np.abs(bed), axis=1)
    la = int(0.0015 * SR)
    need = np.minimum(1.0, ceil / np.maximum(a, 1e-12))
    from scipy.ndimage import minimum_filter1d
    need = minimum_filter1d(need, size=2 * la + 1)          # the gain is already down la samples before a peak
    # release smoothing (one-pole, instant attack), run only around the regions that need gain reduction
    rel = np.exp(-1 / (0.08 * SR))
    g = np.ones_like(need)
    idx = np.where(need < 1.0)[0]
    i = 0; n = len(need)
    while i < len(idx):
        s0 = idx[i]; cur = 1.0; j = s0; last_red = s0
        while j < n and (j - last_red) < int(0.6 * SR):
            v = need[j]
            if v < 1.0: last_red = j
            cur = v if v < cur else v + (cur - v) * rel
            g[j] = cur; j += 1
        i = np.searchsorted(idx, j)
    bed *= g[:, None] * 0.999
    gr_max = float(-20 * np.log10(np.min(g)))

pk = 20 * np.log10(np.max(np.abs(bed)) + 1e-12)
write_wav(A.out, bed)
# overlaps / clutter check: separate cue starts closer than 0.12 s
starts = sorted([(c["t"], c["file"], c.get("beat")) for c in cues])
close = [(round(a[0], 3), a[1], round(b[0], 3), b[1]) for a, b in zip(starts, starts[1:]) if b[0] - a[0] < 0.12]
rep = dict(out=A.out, dur=A.dur, n_cues=len(cues), n_placements=len(placed), peak_dbfs=round(pk, 2),
           peak_before_limiter_dbfs=round(20 * np.log10(pk_before + 1e-12), 2), limiter_max_gr_db=round(gr_max, 2),
           lkfs_400ms_max=round(loud_win(bed, 0.4), 2), protect=report_prot, cue_starts_closer_than_0_12s=close,
           placements=placed)
json.dump(rep, open(os.path.splitext(A.out)[0] + ".json", "w"), indent=1, ensure_ascii=False)
print("cues %d placements %d peak %.2f dBFS (before limiter %.2f, GR %.2f dB) M-max %.2f" % (
    len(cues), len(placed), pk, rep["peak_before_limiter_dbfs"], gr_max, rep["lkfs_400ms_max"]))
for r in report_prot:
    print("protect", r)
if close:
    print("close starts:", close)
