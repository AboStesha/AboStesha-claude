# join metrics: spectral flux peak at the join (vs the original take at the same time), level & tilt step across the join (vs original)
import sys, json
from synclib import *
from scipy.signal import stft
D=rd(DRY)
def logmel(x,a,b):
    f,t,Z=stft(x[a:b],fs=SR,nperseg=960,noverlap=960-120)   # 20 ms, 2.5 ms hop
    S=np.abs(Z)**2; edges=np.geomspace(100,8000,41)
    M=np.stack([(f>=edges[i])&(f<edges[i+1]) for i in range(40)]).astype(float)
    return t+a/SR, 10*np.log10(M@S+1e-12)
def flux_peak(x,c):
    a=T(c-0.06); b=T(c+0.06); t,L=logmel(x,a,b)
    L=np.maximum(L,L.max()-60)        # 60 dB floor
    fl=np.sqrt(((L[:,4:]-L[:,:-4])**2).mean(0))   # 10 ms apart
    tm=t[2:-2]; m=np.abs(tm-c)<=0.015
    return fl[m].max()
def lt(x,a,b):
    a=T(a); b=T(b); f,t,Z=stft(x[a:b],fs=SR,nperseg=512,noverlap=384); P=(np.abs(Z)**2).mean(1)
    lo=P[(f>=150)&(f<1000)].sum(); hi=P[(f>=2000)&(f<6000)].sum(); tot=P[(f>=80)&(f<12000)].sum()
    return 10*np.log10(tot+1e-20), 10*np.log10(hi+1e-20)-10*np.log10(lo+1e-20)
def step(x,c,w=0.022,g=0.008):
    l1,t1=lt(x,c-g-w,c-g); l2,t2=lt(x,c+g,c+g+w); return l2-l1,t2-t1
def evaluate(X,cuts):
    rows=[]
    for c in cuts:
        fx=flux_peak(X,c); fd=flux_peak(D,c)
        sl,st=step(X,c); dl,dt=step(D,c)
        rows.append(dict(t=c,flux=round(fx,2),flux_dry=round(fd,2),dflux=round(fx-fd,2),dlev=round(sl-dl,1),dtilt=round(st-dt,1)))
    return rows
if __name__=="__main__":
    X=rd(sys.argv[1]); cuts=[float(v) for v in sys.argv[2].split(",")]
    for r in evaluate(X,cuts): print(r)
