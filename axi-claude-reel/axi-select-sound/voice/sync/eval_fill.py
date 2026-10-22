# fill-region metrics vs the original take (dry): smoothness of the level and tilt relation (cand - dry), spectral flux peaks
import sys, json
from synclib import *
from scipy.signal import stft
D=rd(DRY)
def frames(x,a,b,hop=0.005,win=0.02):
    out=[]
    for t in np.arange(a,b,hop):
        i=T(t-win/2); seg=x[i:i+T(win)]*np.hanning(T(win))
        P=np.abs(np.fft.rfft(seg,2048))**2; f=np.fft.rfftfreq(2048,1/SR)
        tot=P[(f>80)&(f<12000)].sum(); lo=P[(f>=150)&(f<1000)].sum(); hi=P[(f>=2000)&(f<6000)].sum()
        edges=np.geomspace(100,8000,31); L=np.array([P[(f>=edges[k])&(f<edges[k+1])].sum() for k in range(30)])
        out.append((t,10*np.log10(tot+1e-20),10*np.log10(hi+1e-20)-10*np.log10(lo+1e-20),10*np.log10(L+1e-20)))
    return out
def metrics(X,a,b,joins):
    fx=frames(X,a,b); fd=frames(D,a,b)
    t=np.array([r[0] for r in fx]); lx=np.array([r[1] for r in fx]); ld=np.array([r[1] for r in fd])
    tx=np.array([r[2] for r in fx]); td=np.array([r[2] for r in fd])
    Lx=np.array([r[3] for r in fx]); Ld=np.array([r[3] for r in fd])
    act=(ld>ld.max()-30)&(lx>lx.max()-30)        # frames where both are active (avoid dips)
    dl=lx-ld; dt=tx-td
    # jumps of the cand-dry relation between frames 10 ms apart (active frames only)
    jl=np.abs(dl[2:]-dl[:-2])[act[2:]&act[:-2]]; jt=np.abs(dt[2:]-dt[:-2])[act[2:]&act[:-2]]
    # spectral flux 10 ms apart, 60 dB floor
    def flux(L):
        L=np.maximum(L,L.max()-60); return np.sqrt(((L[2:]-L[:-2])**2).mean(1))
    fxx=flux(Lx); fdd=flux(Ld); tm=t[1:-1]
    jr=[]
    for j in joins:
        m=np.abs(tm-j)<=0.012
        jr.append(dict(t=j,flux=round(float(fxx[m].max()),2),flux_dry=round(float(fdd[m].max()),2)))
    return dict(level_rel_std=round(float(np.std(dl[act])),2),level_rel_maxjump=round(float(jl.max()),2),
                tilt_rel_std=round(float(np.std(dt[act])),2),tilt_rel_maxjump=round(float(jt.max()),2),
                flux_excess_max=round(float((fxx-fdd).max()),2),joins=jr)
if __name__=="__main__":
    X=rd(sys.argv[1]); a,b=float(sys.argv[2]),float(sys.argv[3]); joins=[float(v) for v in sys.argv[4].split(",")] if len(sys.argv)>4 else []
    print(json.dumps(metrics(X,a,b,joins)))
