# helpers for the cue-sheet builders: cue(), layers, pans from screen x, merge check, JSON out
import json
import numpy as np

CUES = []


def px(x, k=0.75, lim=0.7):
    """screen x (0..1920) -> pan"""
    return round(max(-lim, min(lim, (x - 960) / 960 * k)), 2)


def L(t, file, g, pan=0.0, sync=None, **kw):
    """a layer (sub-cue of a merged event)"""
    d = dict(t=round(t, 3), file=file, gain_db=g, pan=pan)
    if sync: d["sync"] = sync
    d.update(kw)
    return d


def cue(t, file, g, pan=0.0, sync=None, beat="", ev="", x=None, tv=None, layers=None, y=None, **kw):
    d = dict(t=round(t, 3), file=file, gain_db=g, pan=pan, sync=sync or "onset", beat=beat, event=ev)
    if x is not None: d["x"] = x
    if y is not None: d["y"] = y
    if tv is not None: d["t_vis"] = round(tv, 3)
    if layers: d["layers"] = layers
    d.update(kw)
    CUES.append(d)
    return d


# tonal files sit in D minor: their rates are kept on D-minor scale tones (runs climb by scale degrees)
BASE = {"pop_a": 440.0, "pop_b": 587.33, "pop_c": 698.46, "ping_land_a": 880.0, "ping_land_b": 1174.66}
DMIN = [2, 4, 5, 7, 9, 10, 0]  # pitch classes of D natural minor (C = 0)
_SCALE = sorted(440.0 * 2 ** ((m - 69) / 12) for m in range(36, 110) if (m % 12) in DMIN)
RUN_CAP = 3  # max scale degrees a pitched run climbs (review)
NOISY = {"whoosh", "reveal", "slide", "glitch", "scan", "impact", "tick", "click", "flag", "camera", "mech", "riser"}


def _snap(f):
    return min(_SCALE, key=lambda s: abs(np.log(s / f)))


def _tonal(c):
    key = c["file"][:-4] if c["file"].endswith(".wav") else c["file"]
    if key not in BASE:
        return
    f0 = BASE[key]; r = float(c.get("rate", 1.0)); f = _snap(f0 * r)
    if "repeat" in c or "repeat_times" in c:
        n = int(c["repeat"][0]) if "repeat" in c else len(c["repeat_times"])
        st = c.pop("rate_step", 0.0)
        i0 = _SCALE.index(f); d = 1 if st > 0 else (-1 if st < 0 else 0)
        # (review) a run climbs at most RUN_CAP scale degrees, then holds: a 6- or 10-note diatonic run (up to C6 from A4)
        # read as a playful xylophone arpeggio, against the serious score
        seq = [_SCALE[max(0, min(len(_SCALE) - 1, i0 + d * min(k, RUN_CAP)))] / f0 for k in range(n)]
        c["rate_seq"] = [round(v, 5) for v in seq]
        c.pop("rate", None)
    elif abs(f / f0 - 1) > 1e-4:
        c["rate"] = round(f / f0, 5)
    else:
        c.pop("rate", None)


def finish(path, meta_path=None):
    CUES.sort(key=lambda c: c["t"])
    meta = json.load(open(meta_path))["sounds"] if meta_path else {}
    # small deterministic rate variation on repeated noise-based sounds (so repeats never sound identical)
    for i, c in enumerate(CUES):
        for j, l in enumerate([c] + c.get("layers", [])):
            key = l["file"]
            if meta and meta.get(key, {}).get("cat") in NOISY and "rate" not in l and "rate_step" not in l:
                h = ((i * 7 + j * 3) * 0.6180339) % 1.0
                l["rate"] = round(1 + 0.05 * (h - 0.5), 4)
            _tonal(l)
    # sync default from the palette when not forced
    if meta_path:
        meta = json.load(open(meta_path))["sounds"]
        for c in CUES:
            assert c["file"] in meta, c["file"]
            for l in c.get("layers", []):
                assert l["file"] in meta, l["file"]
    for c in CUES:
        c["file"] = c["file"] if c["file"].endswith(".wav") else c["file"] + ".wav"
        for l in c.get("layers", []):
            l["file"] = l["file"] if l["file"].endswith(".wav") else l["file"] + ".wav"
    # merge: separate events closer than 0.12 s become ONE richer cue (the later one rides as a layer of the earlier)
    merged = []; log = []
    for c in CUES:
        if merged and c["t"] - merged[-1]["t"] < 0.12:
            m = merged[-1]
            lay = {k: c[k] for k in ("t", "file", "gain_db", "pan", "sync") if k in c}
            for k in ("rate", "repeat", "repeat_times", "rate_step", "gain_step_db", "pan_to", "pan_dur", "dur", "fade"):
                if k in c: lay[k] = c[k]
            m.setdefault("layers", []).append(lay)
            for l in c.get("layers", []):
                m["layers"].append(l)
            m["event"] = m["event"] + " | + " + c["event"]
            m.setdefault("merged", []).append(dict(t=c["t"], file=c["file"], t_vis=c.get("t_vis", c["t"]), x=c.get("x"), y=c.get("y")))
            log.append((m["t"], m["file"], c["t"], c["file"]))
        else:
            merged.append(c)
    CUES[:] = merged
    close = [(a["t"], a["file"], b["t"], b["file"]) for a, b in zip(CUES, CUES[1:]) if b["t"] - a["t"] < 0.12]
    assert not close, close
    json.dump(CUES, open(path, "w"), indent=1, ensure_ascii=False)
    return log
