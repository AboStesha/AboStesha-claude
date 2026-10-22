# refined candidates. B: EQ-matched dry bridges (local vowel/sonorant EQ, end-matched gain ramp, linear micro-warp to each side's lag)
#                    S: no dry (local WSOLA stretch of the adjacent stationary segment; J5 = re-use of his own vowel)
import sys, json
from synclib import *
from scipy.signal import resample_poly
d=4094
F=rd(FINAL); D=rd(DRY); F0=F; Fd=shift(F,d)
S={'F0':F0,'Fd':Fd}
def best_cut(A,B,lo,hi,ms):
    n=int(ms*SR/1000); best=(-9,lo)
    for c in np.arange(lo,hi,0.00025):
        i=T(c)-n//2; x=A[i:i+n]; y=B[i:i+n]
        r=(x*y).sum()/np.sqrt((x*x).sum()*(y*y).sum()+1e-20)
        if r>best[0]: best=(r,c)
    return round(best[1],5),round(best[0],3)
def bridge(a,b,d0,d1,eqpairs,lvA,lvB):
    g=eq_curve([( (F0 if k=='F0' else Fd)[T(x0):T(x1)], D[T(x0):T(x1)]) for k,x0,x1 in eqpairs])
    m=0.06; A=T(a-m); B=T(b+m)
    seg=apply_eq(D[A-300:B+300],g)
    U=resample_poly(seg,8,1); n=B-A; s=np.arange(n)
    delta=d0+(d1-d0)*np.clip((s-T(m))/(T(b)-T(a)),0,1)
    y=np.interp((s+300+delta)*8,np.arange(len(U)),U)
    out=np.zeros(N); out[A:B]=y
    # end-matched level ramp (dB), measured on the given windows (side signal vs EQ'd bridge)
    def gl(k,x0,x1): 
        X=(F0 if k=='F0' else Fd); return lev(X,x0,x1)-lev(out,x0,x1)
    g0=gl(*lvA); g1=gl(*lvB)
    ramp=np.interp(np.arange(A,B),[T(a),T(b)],[g0,g1])
    out[A:B]*=10**(ramp/20)
    return out,[round(float(v),1) for v in g],(round(g0,1),round(g1,1))
cand=sys.argv[1]; meta={'cand':cand}
if cand=='B':
    S['B1'],e1,r1=bridge(3.690,3.795,15,0,[('F0',3.665,3.700),('Fd',3.785,3.850)],('F0',3.672,3.698),('Fd',3.790,3.850))
    S['B3'],e3,r3=bridge(14.440,14.560,0,0,[('F0',14.395,14.447),('Fd',14.553,14.635)],('F0',14.40,14.445),('Fd',14.556,14.635))
    S['B5'],e5,r5=bridge(18.655,18.805,16,0,[('F0',18.565,18.660),('Fd',18.806,18.860)],('F0',18.600,18.655),('Fd',18.806,18.860))
    meta['eq']={'B1':e1,'B3':e3,'B5':e5}; meta['gain_ramp_db']={'B1':r1,'B3':r3,'B5':r5}
    c1=best_cut(F0,S['B1'],3.695,3.705,12); c2=best_cut(S['B1'],Fd,3.780,3.790,12)
    c3=best_cut(F0,S['B3'],14.443,14.451,10); c4=best_cut(S['B3'],Fd,14.549,14.556,8)
    c5=best_cut(F0,S['B5'],18.658,18.666,10); c6=best_cut(S['B5'],Fd,18.796,18.802,6)
    cuts=[(c1[0],12,'B1'),(c2[0],12,'Fd'),(14.150,20,'F0'),(c3[0],10,'B3'),(c4[0],8,'Fd'),
          (16.046,10,'F0'),(c5[0],10,'B5'),(c6[0],6,'Fd'),(44.789,10,'F0')]
elif cand=='S':
    a,b,o=T(3.665),T(3.745),T(3.830); W1=np.zeros(N); W1[a:o+600]=wsola(F,a,b+600,o-a+600) ; S['W1']=W1
    a,b,o=T(14.330),T(14.450),T(14.545); W3=np.zeros(N); W3[a:o+600]=wsola(F,a,b+600,o-a+600); S['W3']=W3
    c2=best_cut(W1,Fd,3.815,3.832,12); c4=best_cut(W3,Fd,14.538,14.552,8); c6=best_cut(F0,Fd,18.778,18.792,8)
    cuts=[(3.668,6,'W1'),(c2[0],12,'Fd'),(14.150,20,'F0'),(14.3325,5,'W3'),(c4[0],8,'Fd'),
          (16.046,10,'F0'),(c6[0],8,'Fd'),(44.789,10,'F0')]
out,info=compose(S,'F0',cuts)
sf.write('cand2_%s.wav'%cand,out,SR,subtype='PCM_24')
meta['cuts']=info; json.dump(meta,open('cand2_%s.json'%cand,'w'),indent=1)
print(json.dumps(meta))
