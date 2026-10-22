# fricative onsets lost to the gate: frames in the zone where the aligned original (dryA) has sibilant energy but the enhanced voice is (near) silent
import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
from scipy.signal import stft
from scipy.ndimage import uniform_filter1d
X=rd(sys.argv[1]); dA=rd('dryA.wav'); d=rd('dry')
def S(x): f,t,Z=stft(x[:4120000],fs=SR,nperseg=1024,noverlap=1024-240,boundary=None,padded=False); return f,t+0.0107,np.abs(Z)**2
f,T,Px=S(X); _,_,Pa=S(dA); _,_,Pd=S(d)
def band(P,lo,hi): m=(f>=lo)&(f<hi); return db(uniform_filter1d(P[m].sum(0),3))
ha=band(Pa,4000,12000); ma=band(Pa,1000,3500); hx=band(Px,4000,12000)
ref=np.percentile(band(Pd,150,8000),90)
zf=np.zeros(len(T),bool)
for a,b in ZONE: zf|=(T>=a)&(T<=b)
cand=zf&(ha>ref-38)&(ha>ma-3)&(hx<ha-15)      # original has a real fricative; enhanced >15 dB weaker in 4-12 kHz
idx=np.nonzero(cand)[0]; runs=[]
if len(idx):
    s=idx[0]; p=idx[0]
    for i in idx[1:]:
        if i>p+2: runs.append((s,p)); s=i
        p=i
    runs.append((s,p))
out=[]
for a,b in runs:
    if b-a<3: continue
    out.append([round(T[a]-0.01,3),round(T[b]+0.015,3),round(float(np.median(ha[a:b+1]-hx[a:b+1])),1)])
print(len(out),'total %.2f s'%sum(q[1]-q[0] for q in out)); print(out)
json.dump(out,open('onsfric.json','w'))
