# chunked faster-whisper large-v3 transcription (same chunking/settings as /home/user/rr/voice3/chk/asr4.py pass A)
# usage: asrx.py out.json label=path [label=path ...]
import json, sys, numpy as np, soundfile as sf
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
out=sys.argv[1]; SRC=dict(a.split('=',1) for a in sys.argv[2:])
def load(p):
    x,sr=sf.read(p); x=x if x.ndim==1 else x.mean(1); return x.astype(np.float32),sr
x3,sr=load('/home/user/rr/axi-select-ch2/audio/vo/vo2_v3.wav')
hop=int(0.01*sr); nf=len(x3)//hop
e=20*np.log10(np.sqrt((x3[:nf*hop].reshape(nf,hop).astype(np.float64)**2).mean(1))+1e-12)
cuts,last,i=[0.0],0.0,0
while i<nf:
    if e[i]<-45:
        j=i
        while j<nf and e[j]<-45: j+=1
        mid=(i+j)/2*0.01
        if j-i>=25 and mid-last>=8: cuts.append(mid); last=mid
        i=j
    else: i+=1
cuts.append(len(x3)/sr)
ch,a=[],cuts[0]
for k in range(1,len(cuts)):
    if cuts[k]-a>22 and cuts[k-1]>a: ch.append((a,cuts[k-1])); a=cuts[k-1]
ch.append((a,cuts[-1]))
print('chunks',[(round(a,2),round(b,2)) for a,b in ch],flush=True)
m=WhisperModel("large-v3",device="cpu",compute_type="int8",cpu_threads=4)
R={}
for name,p in SRC.items():
    x,srp=load(p); assert srp==48000; S=[]
    for a,b in ch:
        seg=x[int(a*sr):int(b*sr)]
        segs,_=m.transcribe(resample_poly(seg,1,3).astype(np.float32),language="ar",word_timestamps=True,vad_filter=False,condition_on_previous_text=False,beam_size=5)
        for s in segs:
            S.append({"s":round(s.start+a,2),"e":round(s.end+a,2),"t":s.text.strip(),"w":[{"w":w.word.strip(),"s":round(w.start+a,2),"e":round(w.end+a,2),"p":round(w.probability,2)} for w in s.words]})
            print(name,"%6.2f-%6.2f %s"%(s.start+a,s.end+a,s.text.strip()),flush=True)
    R[name]=S
json.dump(R,open(out,'w'),ensure_ascii=False,indent=1); print("DONE",flush=True)
