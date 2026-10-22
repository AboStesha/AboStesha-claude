# forced-choice (same method as /home/user/rr/voice3/chk/fc.py): teacher-forced Whisper large-v3 log-prob of competing
# transcripts; score = correct minus best alternative. Windows are given in vo2_final (VO) time and mapped to sync time
# for sources whose name starts with 'sync' or 'cand' (moved stretches +4094 samples).
import json, sys, os, numpy as np, soundfile as sf
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
from faster_whisper.tokenizer import Tokenizer
sys.path.insert(0,'/home/user/rr/sound3/voice/sync'); from tmap import f2s
SRC=json.loads(sys.argv[3]); rows_path=sys.argv[4]
X={}
for k,p in SRC.items():
    x,sr=sf.read(p); x=x if x.ndim==1 else x.mean(1); assert sr==48000
    x=np.pad(x,(0,max(0,4129600-len(x)))); X[k]=resample_poly(x,1,3).astype(np.float32)
m=WhisperModel("large-v3",device="cpu",compute_type="int8",cpu_threads=1)
tok=Tokenizer(m.hf_tokenizer,m.model.is_multilingual,task="transcribe",language="ar")
cases=json.load(open(sys.argv[1])); srcs=sys.argv[2].split(",")
done=set()
if os.path.exists(rows_path):
    for l in open(rows_path): r=json.loads(l); done.add((r["id"],r["src"]))
for c in cases:
    for src in srcs:
        if (c["id"],src) in done: continue
        a,b=c["win"]
        if src.startswith("sync") or src.startswith("cand"): a,b=f2s(a),f2s(b)
        seg=X[src][int(a*16000):int(b*16000)]
        feat=m.feature_extractor(seg); nfr=feat.shape[-1]
        feat=np.pad(feat,((0,0),(0,3000-nfr))) if nfr<3000 else feat[:,:3000]
        enc=m.encode(feat)
        toks=[tok.encode(" "+t.strip()) for t in c["cands"]]
        res=[m.model.align(enc,tok.sot_sequence,[t],min(nfr,3000))[0] for t in toks]
        sc=[float(np.log(np.maximum(np.array(r.text_token_probs,dtype=np.float64),1e-12)).sum()) for r in res]
        row={"id":c["id"],"src":src,"win":[round(a,3),round(b,3)],"scores":dict(zip(c["cands"],[round(s,2) for s in sc])),
             "best":c["cands"][int(np.argmax(sc))],"correct_minus_best_alt":round(sc[0]-max(sc[1:]),2)}
        open(rows_path,"a").write(json.dumps(row,ensure_ascii=False)+"\n")
        print(c["id"],src,"margin=%.2f"%row["correct_minus_best_alt"],flush=True)
print("DONE",flush=True)
