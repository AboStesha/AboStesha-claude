# fine lag map X vs dry: windows W samples (hann), hop H; returns per window: center, level dB (band), best lag near 0 & corr, best lag near 4094 & corr
from slib import *
def lagmap(X,D,lo=1000,hi=4000,W=1920,H=240,t0=0,t1=None,c1=4094):
    Xb=band(X,lo,hi); Db=band(D,lo,hi)
    w=np.hanning(W); L0=-200; L1=c1+200; NF=1<<int(np.ceil(np.log2(W+L1-L0+W)))
    t1=t1 or N/SR
    rows=[]
    for s in range(max(int(t0*SR),-L0), min(int(t1*SR),N-W-L1), H):
        x=Xb[s:s+W]*w; ex=np.sqrt((x*x).sum())
        seg=Db[s+L0:s+W+L1]
        c=np.fft.irfft(np.conj(np.fft.rfft(x,NF))*np.fft.rfft(seg,NF),NF)[:L1-L0+1]
        e2=np.convolve(seg**2,(w**2)[::-1],'valid')[:L1-L0+1]   # energy of hann-weighted dry window
        # proper weighted normalisation: corr between x (=X*w) and seg*w approximated: use sum x*seg / sqrt(ex^2 * sum (seg^2 w^2))... bounded ~1 for matching signals
        cn=c/(ex*np.sqrt(e2)+1e-20)
        lags=np.arange(L0,L1+1)
        m0=(lags>=-150)&(lags<=150); m1=(lags>=c1-150)&(lags<=c1+150)
        i0=np.argmax(np.where(m0,cn,-9)); i1=np.argmax(np.where(m1,cn,-9))
        rows.append((s+W//2, 20*np.log10(ex/np.sqrt((w*w).sum())+1e-12), lags[i0], cn[i0], lags[i1], cn[i1]))
    return np.array(rows)
if __name__=="__main__":
    X=load(sys.argv[1]); D=load("dry")
    r=lagmap(X,D,int(sys.argv[3]),int(sys.argv[4]),int(sys.argv[5]),int(sys.argv[6]))
    np.save(sys.argv[2],r); print(r.shape)
