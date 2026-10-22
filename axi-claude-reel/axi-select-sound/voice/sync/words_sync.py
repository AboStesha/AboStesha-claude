# sync_words.json (same method as /home/user/rr/voice3/chk/words3.py, applied to vo2_sync): pass-A words (full-context text), times from forced alignment per subtitle line (falign.json), edges cleaned with the v3 pause map
import json
import sys, hashlib
W = json.load(open("/home/user/rr/axi-select-ch2/work/asr/v3_words.json"))
SRC, FAJ, PJ, OUT = sys.argv[1:5]
FA = json.load(open(FAJ)); P = json.load(open(PJ))
old = {o["i"]: o for o in W["words"]}
SUBL = {L["line"]: L for L in W["lines"]}
out = []; n = 0
for r in FA:
    ws, we = r["win"]
    lw = [o for o in W["words"] if o["line"] == r["line"]]
    assert len(lw) == len(r["w"]), (r["line"], len(lw), len(r["w"]))
    for k, (o, a) in enumerate(zip(lw, r["w"])):
        s, e = a["s"], a["e"]
        split = False
        if k == 0 and r["pause_in"]: s = round(ws + 0.03, 2)
        elif k == 0 and r["line"] > 1: s = round((SUBL[r["line"] - 1]["sub_e"] + SUBL[r["line"]]["sub_s"]) / 2, 2); split = True
        if k == len(lw) - 1 and r["pause_out"]: e = round(we - 0.03, 2)
        elif k == len(lw) - 1 and r["line"] < len(FA): e = round((SUBL[r["line"]]["sub_e"] + SUBL[r["line"] + 1]["sub_s"]) / 2, 2)
        for p in P:
            if p[0] <= s < p[1] and p[1] < e - 0.03: s = p[1]
            if p[0] < e <= p[1] and p[0] > s + 0.03: e = p[0]
        out.append({"i": o["i"], "w": o["w"], "s": round(s, 2), "e": round(max(e, s + 0.04), 2), "p": o["p"], "line": r["line"],
                    "onset": "measured" if (k == 0 and r["pause_in"]) or any(abs(p[1] - s) < 0.006 for p in P) else ("sub_split" if split else "aligned")})
for k in range(1, len(out)):
    if out[k]["s"] < out[k - 1]["s"] + 0.02: out[k]["s"] = round(out[k - 1]["s"] + 0.02, 2)
    if out[k - 1]["e"] > out[k]["s"]: out[k - 1]["e"] = out[k]["s"]
for k in range(1, len(out) - 1):  # a line-initial word squeezed by the split: give it at least 0.10 s
    if out[k]["onset"] == "sub_split" and out[k + 1]["s"] - out[k]["s"] < 0.10 and out[k + 1]["line"] == out[k]["line"]:
        out[k]["s"] = round(max(out[k + 1]["s"] - 0.10, out[k - 1]["s"] + 0.05), 2); out[k]["e"] = out[k + 1]["s"]; out[k - 1]["e"] = out[k]["s"]
for k in range(len(out)):  # a word squeezed to < 0.06 s by the DTW next to a long one: share the pair's span by letters
    o = out[k]
    if o["e"] - o["s"] >= 0.06 or o["i"] == 8: continue
    for j in (k - 1, k + 1):
        if 0 <= j < len(out) and out[j]["line"] == o["line"] and out[j]["e"] - out[j]["s"] > 0.35:
            a_, b_ = (out[j], o) if j < k else (o, out[j])
            if any(a_["e"] - 0.02 <= p[0] and p[1] <= b_["s"] + 0.02 and p[1] - p[0] >= 0.08 for p in P): continue
            t0, t1 = a_["s"], b_["e"]; la, lb = len(a_["w"]), len(b_["w"])
            t1 = min([t1] + [p[0] for p in P if t0 + 0.1 < p[0] < t1 and p[1] - p[0] >= 0.12])
            b_["e"] = t1
            inner = [p for p in P if t0 + 0.08 < p[0] and p[1] < t1 - 0.05]
            if inner: a_["e"], b_["s"] = inner[0][0], inner[0][1]
            else:
                mid = round(t0 + (t1 - t0) * la / (la + lb), 2)
                a_["e"] = mid; b_["s"] = mid
            if b_["onset"] == "measured": b_["onset"] = "aligned"
            break
for o in out:
    if o["i"] == 8 and o["w"] == "في": o["note"] = "ASR insertion between Axi Select and مرحلة (in v3/final below -42 dBFS, gated), not a spoken word"
    if o["w"] == "صفة": o["note"] = "صفقة: the «ق» is weak in v3/enhanced (Whisper hears صفة; raw/patched have صفقة)"
lines = []
for L in W["lines"]:
    ws_ = [o for o in out if o["line"] == L["line"]]
    L["v3_s"], L["v3_e"] = ws_[0]["s"], ws_[-1]["e"]; L["asr"] = " ".join(o["w"] for o in ws_); lines.append(L)
W["words"] = out; W["lines"] = lines
W["asr"] = "words = the v3_words.json word list (faster-whisper large-v3 int8, ar, beam 5, chunked at pauses <= 22 s, pass A, no prompt, on vo2_v3; same speech), assigned to subtitle lines by text; times = Whisper forced alignment (find_alignment) of those words on each line window of vo2_sync, window cut at the adjacent vo2_sync pauses (work/vo_pauses_sync.json)"
W["accuracy"] = "onset = measured: s is the voice onset after a pause of work/vo_pauses_sync.json (+-0.01 s); onset = aligned: forced-alignment DTW inside the line (20 ms grid, about +-0.05 s); onset = sub_split: first word of a line that follows the previous one without a pause, placed at the midpoint of the subtitle split (no acoustic boundary to measure)"
W.pop("edge_rule", None)
W["note"] = "vo2_sync = vo2_final with the early-timed stretches moved 4094 samples later (original-take / lip-sync timing); lines[].v3_s / v3_e keep their key names for format compatibility and hold vo2_sync times"
W["src"] = SRC; W["md5"] = hashlib.md5(open(SRC, "rb").read()).hexdigest()
json.dump(W, open(OUT, "w"), ensure_ascii=False, indent=1)
for L in lines:
    d1 = L["v3_s"] - L["sub_s"]; d2 = L["v3_e"] - L["sub_e"]
    print("L%02d sub %5.2f-%5.2f  v3 %5.2f-%5.2f  (%+.2f %+.2f)%s" % (L["line"], L["sub_s"], L["sub_e"], L["v3_s"], L["v3_e"], d1, d2, "  <--" if abs(d1) >= 0.06 or abs(d2) >= 0.10 else ""))
print(len(out), sum(o["onset"] == "measured" for o in out))
