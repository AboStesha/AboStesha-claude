# candidates for the joins that fall inside speech: dry bridges (EQ/level matched) vs no-dry (local WSOLA stretch / vowel reuse)
import sys, json
from synclib import *
from scipy.signal import resample_poly
d=4094
F=rd(FINAL); D=rd(DRY)
F0=F; Fd=shift(F,d)
def bridge(a,b,d0,d1,pairs,name):
    """EQ-matched dry for sync [a,b] (seconds), read at dry(s+delta) with delta going d0->d1 samples (linear warp)"""
    g=eq_curve([(F0s if k=='F0' else Fds, Ds) for (k,F0s,Fds,Ds) in pairs]) if False else None
    tg=[];src=[]
    for kind,x0,x1 in pairs:
        S=F0 if kind=='F0' else Fd
        tg.append(S[T(x0):T(x1)]); src.append(D[T(x0):T(x1)])
    g=eq_curve(list(zip(tg,src)))
    m=0.1; A=T(a-m); B=T(b+m)
    seg=apply_eq(D[A-200:B+200],g)          # EQ'd dry with margin
    up=8; U=resample_poly(seg,up,1)
    n=B-A; s=np.arange(n); delta=d0+(d1-d0)*np.clip((s-T(m))/(T(b)-T(a)),0,1)
    pos=(s+200+delta)*up
    y=np.interp(pos,np.arange(len(U)),U)
    out=np.zeros(N); out[A:B]=y
    return out,g
sig={'F0':F0,'Fd':Fd}
cand=sys.argv[1]
meta={}
if cand=='B':
    sig['B1'],g1=bridge(3.700,3.785,15,0,[('F0',3.30,3.69),('Fd',3.785,4.20)],'B1')
    sig['B3'],g3=bridge(14.447,14.553,0,0,[('F0',14.28,14.45),('Fd',14.555,14.90)],'B3')
    sig['B5'],g5=bridge(18.662,18.800,16,0,[('F0',18.40,18.66),('Fd',18.80,19.20)],'B5')
    meta['eq_db']={k:[round(float(v),1) for v in g] for k,g in [('B1',g1),('B3',g3),('B5',g5)]}
    cuts=[(3.700,12,'B1'),(3.785,12,'Fd'),(14.150,20,'F0'),(14.447,10,'B3'),(14.553,8,'Fd'),
          (16.046,10,'F0'),(18.662,10,'B5'),(18.799,6,'Fd'),(44.789,10,'F0')]
elif cand=='S':
    a,b,o=T(3.665),T(3.775),T(3.860)
    W1=np.zeros(N); W1[a:o]=wsola(F,a,b,o-a); sig['W1']=W1
    a,b,o=T(14.300),T(14.455),T(14.545)
    W3=np.zeros(N); W3[a:o]=wsola(F,a,b,o-a); sig['W3']=W3
    cuts=[(3.670,8,'W1'),(3.852,12,'Fd'),(14.150,20,'F0'),(14.303,6,'W3'),(14.546,8,'Fd'),
          (16.046,10,'F0'),(18.790,8,'Fd'),(44.789,10,'F0')]
    # J5 'vowel reuse': F0 runs through final's vowel (sits on V1), then Fd brings the same vowel at V2
out,info=compose(sig,'F0',cuts)
# S1 starts inside speech at J1: before J1 only F0 is used. Head/tail untouched.
sf.write('cand_%s.wav'%cand,out,SR,subtype='PCM_24')
meta['cuts']=info
json.dump(meta,open('cand_%s.json'%cand,'w'),indent=1)
print(json.dumps(info))
if 'eq_db' in meta: print(meta['eq_db'])
