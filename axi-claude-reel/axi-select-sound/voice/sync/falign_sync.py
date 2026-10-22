# forced word alignment of the v3_words.json word list on vo2_sync, one subtitle line at a time (window cut at the adjacent
# vo2_sync pauses) -- same method as /home/user/rr/voice3/chk/falign.py (only the audio and the pause map differ)
import json, sys, numpy as np, soundfile as sf
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
from faster_whisper.tokenizer import Tokenizer
SRC = sys.argv[1]; PAUSES = sys.argv[2]; OUT = sys.argv[3]
W = json.load(open("/home/user/rr/axi-select-ch2/work/asr/v3_words.json"))
words, lines = W["words"], W["lines"]
P = json.load(open(PAUSES))
x, sr = sf.read(SRC); x = resample_poly(x, 1, 3).astype(np.float32)
m = WhisperModel("large-v3", device="cpu", compute_type="int8", cpu_threads=1)
tok = Tokenizer(m.hf_tokenizer, m.model.is_multilingual, task="transcribe", language="ar")
res = []
for L in lines:
    a, b = L["sub_s"], L["sub_e"]
    pe = [p[1] for p in P if a - 0.30 <= p[1] <= a + 0.10]; ps = [p[0] for p in P if b - 0.10 <= p[0] <= b + 0.30]
    ps += [p[0] for p in P if p[1] - p[0] >= 0.12 and b - 0.70 <= p[0] <= b and p[1] >= b - 0.15]
    pe += [p[1] for p in P if p[1] - p[0] >= 0.12 and a <= p[1] <= a + 0.70 and p[0] <= a + 0.15]
    ws = (max(pe) - 0.03) if pe else a - 0.08
    we = (min(ps) + 0.03) if ps else b + 0.08
    lw = [w for w in words if w["line"] == L["line"]]
    text = " ".join(w["w"] for w in lw)
    seg = x[int(ws * 16000):int(we * 16000)]
    feat = m.feature_extractor(seg); nfr = feat.shape[-1]
    feat = np.pad(feat, ((0, 0), (0, 3000 - nfr)))
    enc = m.encode(feat)
    toks = tok.encode(" " + text)
    al = m.find_alignment(tok, [toks], enc, nfr)[0]
    out = [{"w": d["word"].strip(), "s": round(ws + d["start"], 2), "e": round(ws + d["end"], 2), "p": round(float(d["probability"]), 2)} for d in al]
    res.append({"line": L["line"], "win": [round(ws, 2), round(we, 2)], "pause_in": bool(pe), "pause_out": bool(ps), "w": out})
    print(L["line"], ws, we, " ".join("%s@%.2f" % (o["w"], o["s"]) for o in out), flush=True)
json.dump(res, open(OUT, "w"), ensure_ascii=False, indent=1)
print("DONE", flush=True)
