# forced-choice scorer (same maths as /home/user/rr/voice3/chk/fc.py): Whisper large-v3 teacher-forced log-prob of competing transcripts
# usage: fcx.py cases.json out.json label=path [label=path ...]   (env IDS=comma list of case ids to run)
import json, sys, os, numpy as np, soundfile as sf
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
from faster_whisper.tokenizer import Tokenizer
cases=json.load(open(sys.argv[1])); out=sys.argv[2]; SRC=dict(a.split('=',1) for a in sys.argv[3:])
IDS=[q for q in os.environ.get('IDS','').split(',') if q]
if IDS: cases=[c for c in cases if c['id'] in IDS]
X={}
for k,p in SRC.items():
    x,sr=sf.read(p); x=x if x.ndim==1 else x.mean(1); assert sr==48000
    x=np.pad(x,(0,max(0,4129600-len(x)))); X[k]=resample_poly(x,1,3).astype(np.float32)
m=WhisperModel("large-v3",device="cpu",compute_type="int8",cpu_threads=4)
tok=Tokenizer(m.hf_tokenizer,m.model.is_multilingual,task="transcribe",language="ar")
rows=[]
for c in cases:
    a,b=c["win"]
    for src in SRC:
        seg=X[src][int(a*16000):int(b*16000)]; feat=m.feature_extractor(seg); nfr=feat.shape[-1]
        feat=np.pad(feat,((0,0),(0,3000-nfr))) if nfr<3000 else feat[:,:3000]
        enc=m.encode(feat); toks=[tok.encode(" "+t.strip()) for t in c["cands"]]
        res=[m.model.align(enc,tok.sot_sequence,[t],min(nfr,3000))[0] for t in toks]
        sc=[float(np.log(np.maximum(np.array(r.text_token_probs,dtype=np.float64),1e-12)).sum()) for r in res]
        best=int(np.argmax(sc)); srt=sorted(sc)
        row={"id":c["id"],"src":src,"win":c["win"],"scores":{t:round(s,2) for t,s in zip(c["cands"],sc)},"best":c["cands"][best],"margin_correct":round(sc[0]-max(sc[1:]),2)}
        rows.append(row); print(c["id"],src,"correct-minus-best-other %.2f"%row["margin_correct"]," | ".join("%s: %.2f"%(t,s) for t,s in zip(c["cands"],sc)),flush=True)
json.dump(rows,open(out,"w"),ensure_ascii=False,indent=1); print("DONE",flush=True)
