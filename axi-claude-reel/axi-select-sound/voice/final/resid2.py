# second-separation check (Kim Mel-Roformer on the zone composites): what the separator calls "other" (music/SFX residue) in
# speech, inside the treble-patched spans, and in pauses; dB re the input's speech p90 (10 ms frames)
import sys,json,glob; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
from scipy.signal import resample_poly
mp=json.load(open('sep2/map.json')); items=json.load(open('Y6_log.json'))
def ld(p):
    x,sr=sf.read(p,always_2d=True); x=x.mean(1); return resample_poly(x,160,147) if sr==44100 else x
def L(x,H=480): return db(np.convolve(x**2,np.ones(H)/H,'same')[H//2::H])
def tmap(t):
    for a,b,o in mp:
        if a<=t<=b: return o+t-a
    return None
res={}
for k in sys.argv[1:]:
    inp=ld(f'sep2/C_{k}.wav'); oth=ld(glob.glob(f'sep2/kim_{k}/*other*')[0]); n=min(len(inp),len(oth)); inp,oth=inp[:n],oth[:n]
    Li=L(inp); ref=np.percentile(Li[Li>-90],90); Lo=L(oth)-ref; Lin=Li-ref
    sp=Lin>-25; pa=(Lin<-50)&(Lin>-150)
    pm=np.zeros(len(Lo),bool)
    for q in items:
        a,b=q['span']; A=tmap(a); B=tmap(b)
        if A is None or B is None: continue
        pm[int(A*100):int(B*100)]=True
    r=dict(other_in_speech_median=round(float(np.median(Lo[sp])),1),other_in_speech_p90=round(float(np.percentile(Lo[sp],90)),1),
           other_in_patched_speech_median=round(float(np.median(Lo[sp&pm])),1),other_in_patched_speech_p90=round(float(np.percentile(Lo[sp&pm],90)),1),
           other_in_pauses_median=round(float(np.median(Lo[pa])),1) if pa.sum() else None, n_pause_frames=int(pa.sum()))
    # tonal check in pauses/speech: strongest narrow peak of the other stem spectrum
    res[k]=r; print(k,json.dumps(r),flush=True)
json.dump(res,open('sep2/resid2.json','w'),indent=1)
