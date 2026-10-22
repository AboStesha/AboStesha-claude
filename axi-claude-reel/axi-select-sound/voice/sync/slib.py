import sys; sys.path.insert(0,'/home/user/rr/sound3/voice/final_verify')
from common import *
import soundfile as sf
def loadp(p):
    x,sr=sf.read(p,dtype='float64',always_2d=True); x=x.mean(1); assert sr==SR
    return x
def lag_win(X,R,a,b,lmin,lmax,sub=True):
    """best lag l in [lmin,lmax] (samples) maximizing corr of X[a:b] with R[a+l:b+l]; l>0: X is EARLY vs R. returns (l, c)"""
    x=X[a:b]; n=b-a
    lo=a+lmin; hi=b+lmax
    pad0=max(0,-lo); lo2=max(lo,0); seg=R[lo2:hi]
    if pad0: seg=np.concatenate([np.zeros(pad0),seg])
    if len(seg)<n+lmax-lmin: seg=np.pad(seg,(0,n+lmax-lmin-len(seg)))
    NF=1<<int(np.ceil(np.log2(len(seg)+n)))
    c=np.fft.irfft(np.conj(np.fft.rfft(x,NF))*np.fft.rfft(seg,NF),NF)[:lmax-lmin+1]
    cs=np.concatenate([[0],np.cumsum(seg**2)]); e=cs[n:n+lmax-lmin+1]-cs[:lmax-lmin+1]
    cn=c/(np.sqrt((x*x).sum()*e)+1e-20)
    k=int(np.argmax(cn)); l=float(k+lmin)
    if sub and 0<k<len(cn)-1:
        y0,y1,y2=cn[k-1],cn[k],cn[k+1]; den=y0-2*y1+y2
        if den<0: l+=0.5*(y0-y2)/den
    return l,float(cn[k]),cn
