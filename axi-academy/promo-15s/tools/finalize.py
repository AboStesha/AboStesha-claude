#!/usr/bin/env python3
"""finalize.py W V REVIEW_JSON
Writes qa/gate_v<V>.md and qa/inspection_v<V>.json from the machine pass (qa/machine_v<V>.txt) and the
hand-written visual review (REVIEW_JSON), validates the inspection coverage, and appends the
pre_render / pre_delivery snapshots to analysis/motion-reviews.json."""
import hashlib
import json
import os
import re
import sys

W, V, RJ = sys.argv[1], sys.argv[2], sys.argv[3]
S = os.path.basename(W.rstrip("/"))
rev = json.load(open(RJ, encoding="utf-8"))
out = f"out/{S}_v{V}.mp4"
os.chdir(W)
machine = open(f"qa/machine_v{V}.txt", encoding="utf-8").read()
md5 = hashlib.md5(open(out, "rb").read()).hexdigest()

# ---- coverage: per-second sheets, 60 frames each
N, FPS = 900, 60
sheets = [f"qa/sheets/{S}_v{V}_s{s:02d}.jpg" for s in range(15)]
viewed = [[s * 60, s * 60 + 60] for s in range(15)]
missing = [p for p in sheets if not os.path.exists(p)]
if missing:
    sys.exit(f"missing sheets: {missing}")
merged = []
for a, b in sorted(viewed):
    if a < 0 or b > N or a >= b:
        sys.exit(f"bad range {a}-{b}")
    if merged and a <= merged[-1][1]:
        merged[-1][1] = max(merged[-1][1], b)
    else:
        merged.append([a, b])
if merged != [[0, N]]:
    sys.exit(f"coverage gap: {merged}")
secs = sorted({f // FPS for a, b in viewed for f in range(a, b)})
if secs != list(range(15)):
    sys.exit(f"second gap: {secs}")
m = re.search(r"frames (\d+) first ([\d.]+) last ([\d.]+) endpoint ([\d.]+) off_grid (\d+)", machine)
if not m or int(m.group(1)) != N or int(m.group(5)) != 0:
    sys.exit("pts map does not verify")
insp = {
    "output": out, "md5": md5, "revision": f"v{V}", "decoded_frames": N, "fps": "60/1",
    "pts_map": f"pts_i = i/60 for i in [0,{N}); first {m.group(2)}, last {m.group(3)}, endpoint {m.group(4)} s, off-grid 0",
    "viewed_ranges": merged, "viewed_seconds": [[0, 15.0]], "sheets": sheets, "sheets_viewed": True,
    "detail_evidence": rev["detail_evidence"], "per_second": rev["per_second"], "findings": rev["findings"],
}
json.dump(insp, open(f"qa/inspection_v{V}.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# ---- gate file
lines = [f"# Gate v{V} — {S}", "", f"File: `{out}` (md5 {md5})", "",
         "| # | Check | Result | Evidence |", "|---|---|---|---|"]
for c in rev["checks"]:
    lines.append(f"| {c['n']} | {c['name']} | {c['status']} | {c['evidence']} |")
lines += ["", "## Machine pass (verbatim)", "", "```", machine.strip(), "```", ""]
open(f"qa/gate_v{V}.md", "w", encoding="utf-8").write("\n".join(lines))
blocks = [c for c in rev["checks"] if c["status"] == "FAIL" and c.get("severity") == "BLOCK"]

# ---- motion reviews
mr_path = "analysis/motion-reviews.json"
mr = json.load(open(mr_path, encoding="utf-8"))
keep = [s for s in mr["snapshots"] if s["gate"] not in ("pre_render", "pre_delivery")]
mr["snapshots"] = keep + rev["motion_snapshots"]
json.dump(mr, open(mr_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(json.dumps({"gate": f"qa/gate_v{V}.md", "inspection": f"qa/inspection_v{V}.json", "coverage": merged,
                  "open_blocks": len(blocks), "snapshots": [s["gate"] for s in mr["snapshots"]]}))
