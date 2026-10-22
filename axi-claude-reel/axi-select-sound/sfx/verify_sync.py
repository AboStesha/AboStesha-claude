#!/usr/bin/env python3
# Sync check of a cue sheet against the render: per-frame graphics-change signal (motion_signal.py npz: abs frame
# difference in 8x8-px cells of a 240x136 decode), presenter motion removed per shot (cell median x 2), restricted to
# the columns around each event's screen x. For each cue's visual time (t_vis, else t) it finds the first frame in
# [-0.20, +0.24] s whose change rises clearly above the local baseline and reports the offset.
#   python3 verify_sync.py ms.npz edl.json cues.json [out.json]
import sys, json, numpy as np
ms, edl, cues = sys.argv[1], sys.argv[2], sys.argv[3]
D = np.load(ms)["diff"]; F = len(D)
shots = json.load(open(edl))["shots"]
cut = np.zeros(F, bool)
ex = np.zeros_like(D)
for s in shots:
    a, b = s["f0"], min(s["f1"], F)
    seg = D[a + 1:b]
    if len(seg) == 0: continue
    med = np.median(seg, axis=0)
    ex[a + 1:b] = np.maximum(0, seg - 2.0 * med - 0.4)
    if a > 0: cut[a] = True
C = json.load(open(cues))
rows = []
for c in C:
    items = [dict(t=c.get("t_vis", c["t"]), x=c.get("x", 960), y=c.get("y"), file=c["file"], ev=c["event"], beat=c.get("beat"))]
    for m in c.get("merged", []):
        items.append(dict(t=m.get("t_vis", m["t"]), x=m.get("x") or c.get("x", 960), y=m.get("y"), file=m["file"], ev="(merged)", beat=c.get("beat")))
    for it in items:
        tv = it["t"]; f = int(round(tv * 25))
        fc = int(np.ceil(tv * 25 - 1e-6))
        if any(cut[max(0, f - 1):f + 2]) and abs(f - [s["f0"] for s in shots if abs(s["f0"] - f) <= 2][0]) <= 1 if any(abs(s["f0"] - f) <= 2 for s in shots) else False:
            rows.append(dict(t=tv, file=it["file"], beat=it["beat"], found=round(f / 25, 3), d=0.0, kind="cut", ev=it["ev"][:70])); continue
        x = it["x"]; y = it.get("y")
        c0 = max(0, int((x - 260) / 64)); c1 = min(30, int((x + 260) / 64) + 1)
        r0, r1 = (0, 17) if y is None else (max(0, int((y - 200) / 64)), min(17, int((y + 200) / 64) + 1))
        sig = ex[:, r0:r1, c0:c1].sum(axis=(1, 2))
        # a new motion = a jump in the change energy of the event's region
        a0, a1 = max(2, int(np.floor((tv - 0.12) * 25))), min(F - 1, int(np.ceil((tv + 0.20) * 25)))
        dsig = np.diff(sig, prepend=sig[0])
        loc = dsig[a0:a1 + 1]
        pk = loc.max() if len(loc) else 0
        if pk > 1.0:
            thr = max(1.0, 0.35 * pk)
            k = a0 + int(np.where(loc > thr)[0][0])
            rows.append(dict(t=tv, file=it["file"], beat=it["beat"], found=round(k / 25, 3), d=round(k / 25 - tv, 3), kind="motion", ev=it["ev"][:70]))
        else:
            rows.append(dict(t=tv, file=it["file"], beat=it["beat"], found=None, d=None, kind="none", ev=it["ev"][:70]))
ok = [r for r in rows if r["d"] is not None]
d = np.array([r["d"] for r in ok if r["kind"] == "motion"])
summ = dict(n=len(rows), found=len(ok), cut=sum(r["kind"] == "cut" for r in rows), none=sum(r["kind"] == "none" for r in rows),
            within_1f=int(np.sum(np.abs(d) <= 0.041)), within_2f=int(np.sum(np.abs(d) <= 0.081)),
            median_d=float(np.median(d)) if len(d) else None)
print(json.dumps(summ))
for r in rows:
    flag = "" if r["d"] is not None and abs(r["d"]) <= 0.081 else "  <<<"
    print("%7.3f %-6s %-18s %-7s %7s %s%s" % (r["t"], r["beat"], r["file"][:18], r["kind"], "" if r["d"] is None else "%+.2f" % r["d"], r["ev"], flag))
if len(sys.argv) > 4:
    json.dump(dict(summary=summ, rows=rows), open(sys.argv[4], "w"), indent=1, ensure_ascii=False)
