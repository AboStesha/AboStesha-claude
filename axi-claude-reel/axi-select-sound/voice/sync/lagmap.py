# fine lag map: final (or X) vs dry, 1-4 kHz, 100 ms Hann windows every 10 ms; lag l>0 means X is EARLY by l samples (X[n] ~ D[n+l])
import sys; sys.path.insert(0,'/home/user/rr/sound3/voice/final_verify')
from common import *
X=load(sys.argv[1]); D=load("dry"); out=sys.argv[2]
lo,hi=(int(sys.argv[3]),int(sys.argv[4])) if len(sys.argv)>4 else (1000,4000)
Xb=band(X,lo,hi); Db=band(D,lo,hi)
W=4800; H=480; L0=-300; L1=4400; NF=16384
w=np.hanning(W)
rows=[]
for s in range(L1, N-W-L1, H):  # skip edges (silent)
    x=Xb[s:s+W]*w
    ex=np.sqrt((x*x).sum())
    seg=Db[s+L0:s+W+L1]
    c=np.fft.irfft(np.conj(np.fft.rfft(x,NF))*np.fft.rfft(seg,NF),NF)[:L1-L0+1]  # c[k] = sum x[n] seg[n+k], lag = k+L0
    # local norm of dry at each lag (unwindowed energy under hann^2)
    e2=np.convolve(seg**2, (w**2)[::-1], 'valid')[:L1-L0+1]
    cn=c/(ex*np.sqrt(e2)+1e-20)
    lags=np.arange(L0,L1+1)
    m0=(lags>=-150)&(lags<=150); m1=(lags>=4094-150)&(lags<=4094+150)
    i0=np.argmax(np.where(m0,cn,-9)); i1=np.argmax(np.where(m1,cn,-9))
    rows.append((s+W//2, 20*np.log10(ex/np.sqrt((w*w).sum())+1e-12), int(lags[i0]), float(cn[i0]), int(lags[i1]), float(cn[i1])))
np.save(out, np.array(rows))
print(len(rows))
