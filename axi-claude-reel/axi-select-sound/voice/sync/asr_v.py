# full transcription of a voice file: chunked faster-whisper large-v3 (same chunking rule as voice3/chk/asr4.py)
# pass A: beam 5, default temperature fallback, no prompt; pass B: temperature 0, beam 5, initial prompt with terms
import json, sys, numpy as np, soundfile as sf
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
src=sys.argv[1]; tag=sys.argv[2]
import os
x, sr = sf.read(src); x = (x if x.ndim == 1 else x.mean(1)).astype(np.float32); assert sr==48000
xc = sf.read(os.environ['CUTSRC'])[0] if os.environ.get('CUTSRC') else x
xc = xc if xc.ndim == 1 else xc.mean(1)
hop = int(0.01 * sr); nf = len(xc) // hop
e = 20 * np.log10(np.sqrt((xc[:nf * hop].reshape(nf, hop).astype(np.float64) ** 2).mean(1)) + 1e-12)
cuts, last, i = [0.0], 0.0, 0
while i < nf:
    if e[i] < -45:
        j = i
        while j < nf and e[j] < -45: j += 1
        mid = (i + j) / 2 * 0.01
        if j - i >= 25 and mid - last >= 8: cuts.append(mid); last = mid
        i = j
    else: i += 1
cuts.append(len(x) / sr)
ch, a = [], cuts[0]
for k in range(1, len(cuts)):
    if cuts[k] - a > 22 and cuts[k - 1] > a: ch.append((a, cuts[k - 1])); a = cuts[k - 1]
ch.append((a, cuts[-1]))
print("chunks", [(round(a, 2), round(b, 2)) for a, b in ch], flush=True)
PROMPT = "Axi Select, Incubation, Edge Score, Acceleration, حساب التخصيص, حساب التداول"
m = WhisperModel("large-v3", device="cpu", compute_type="int8", cpu_threads=2)
for pas, kw in [("A", dict(beam_size=5)), ("B", dict(beam_size=5, temperature=0.0, initial_prompt=PROMPT))]:
    S = []
    for a, b in ch:
        seg = x[int(a * sr):int(b * sr)]
        segs, _ = m.transcribe(resample_poly(seg, 1, 3).astype(np.float32), language="ar", word_timestamps=True, vad_filter=False, condition_on_previous_text=False, **kw)
        for s in segs:
            S.append({"s": round(s.start + a, 2), "e": round(s.end + a, 2), "t": s.text.strip(), "lp": round(s.avg_logprob, 3),
                      "w": [{"w": w.word.strip(), "s": round(w.start + a, 2), "e": round(w.end + a, 2), "p": round(w.probability, 2)} for w in s.words]})
            print(tag, pas, "%6.2f-%6.2f %s" % (s.start + a, s.end + a, s.text.strip()), flush=True)
    json.dump({"src": src, "pass": pas, "chunks": ch, "segs": S}, open("asr_%s_%s.json" % (tag, pas), "w"), ensure_ascii=False, indent=1)
print("DONE", flush=True)
