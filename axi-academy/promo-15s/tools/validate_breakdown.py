python3 - analysis/breakdown.json <<'PY'
import json, os, sys
bd = json.load(open(sys.argv[1])); err = []; warn = []
ROUTES = {"KEEP", "CODE", "USER-FOOTAGE", "LIBRARY", "FOOTAGE", "REPERFORM", "GENERATE", "STILL"}
IDV = {"face_clear", "face_partial", "body_only", "none"}
MEDIA = {"2d_cel", "2d_flat", "2d_painterly", "2d_ink", "3d_cel", "3d_cg", "live_action", "title_card", "graphic", "environment"}
DRAWN = {"2d_cel", "2d_flat", "2d_painterly", "2d_ink", "3d_cel", "3d_cg"}
N = bd["ref"]["nb_frames"]
if not str(bd.get("trick", "")).lower().startswith("the trick of this ref is"):
    err.append("trick line missing or not in the form 'The trick of this ref is ...'")
for k in ("family", "format_lock", "look", "palette", "fonts", "audio", "cuts"):
    if k not in bd: err.append(f"missing top-level '{k}'")
cuts = bd.get("cuts", []); prev = -1
for c in cuts:
    cid = c.get("id", "?")
    for k in ("f0", "f1", "content", "hero_present", "identity_visible", "medium", "shot_size", "camera", "cadence",
              "effects", "transition_in", "transition_out", "layers", "text_events", "route_suggestion", "notes"):
        if k not in c: err.append(f"{cid}: missing '{k}'")
    if c.get("f0") != prev + 1: err.append(f"{cid}: f0={c.get('f0')} but previous cut ended at {prev}")
    if c.get("f1", -1) < c.get("f0", 0): err.append(f"{cid}: f1 < f0")
    prev = c.get("f1", prev)
    if c.get("identity_visible") not in IDV: err.append(f"{cid}: identity_visible not in {sorted(IDV)}")
    if c.get("medium") not in MEDIA: err.append(f"{cid}: medium not in {sorted(MEDIA)} (§5.5)")
    r = (c.get("route_suggestion") or {}).get("route")
    if r not in ROUTES: err.append(f"{cid}: route '{r}' not in {sorted(ROUTES)}")
    if r == "KEEP" and bd.get("family") == "F3":
        warn.append(f"{cid}: KEEP in an F3 montage reuses another editor's pixels -> record the reuse reason; preserve watermark and source attribution (§2)")
    for t in c.get("text_events", []):
        if not (t.get("f_in", -1) <= t.get("f_full", -1) <= t.get("f_out", -2)):
            err.append(f"{cid}/{t.get('id')}: need f_in <= f_full <= f_out")
        if not t.get("crosses_cut") and not (c["f0"] <= t.get("f_in", -1) and t.get("f_out", N) <= c["f1"]):
            err.append(f"{cid}/{t.get('id')}: outside the cut but crosses_cut is false")
    for e in c.get("effects", []) + c.get("layers", []):
        if "f0" in e and not (0 <= e["f0"] <= e.get("f1", e["f0"]) < N):
            err.append(f"{cid}: {e.get('type')} frames {e.get('f0')}-{e.get('f1')} out of range")
if cuts and prev != N - 1: err.append(f"last cut ends at {prev}; reference last frame is {N-1}")
if any(c.get("medium") in DRAWN for c in cuts) and not os.path.exists(os.path.join(os.path.dirname(os.path.abspath(sys.argv[1])), "style.json")):
    err.append("drawn cuts but no analysis/style.json: run style.py census, read its pages and write it (§5.5)")
fl = bd.get("format_lock", {})
if fl and fl.get("frames") != N and fl.get("source") != "user":
    err.append(f"format_lock.frames={fl.get('frames')} != ref nb_frames={N}")
print(json.dumps({"ok": not err, "cuts": len(cuts), "errors": err, "warnings": warn}, indent=1))
sys.exit(1 if err else 0)
PY
