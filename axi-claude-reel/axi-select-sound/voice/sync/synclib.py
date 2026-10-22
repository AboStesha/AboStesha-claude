# synclib.py - helpers for the vo2_sync dialogue edit (moving early stretches, bridges, joins)
import numpy as np, soundfile as sf, json
from scipy.signal import butter, sosfiltfilt, welch
SR=48000; N=4129600
FINAL="/home/user/rr/axi-select-ch2/audio/vo/vo2_final.wav"
DRY="/home/user/rr/axi-select-ch2/audio/vo/vo2_dry.wav"
def rd(p):
    x,sr=sf.read(p,dtype='float64',always_2d=True); assert sr==SR; x=x.mean(1)
    return np.pad(x,(0,max(0,N-len(x))))[:N]
def shift(x,d):
    """y[s]=x[s-d] (d>0 moves material later)"""
    y=np.zeros_like(x)
    if d>=0: y[d:]=x[:len(x)-d]
    else: y[:d]=x[-d:]
    return y
def T(t): return int(round(t*SR))
# ---------- crossfade ----------
def xfade_gains(a,b,n):
    """correlation-compensated equal-power gains for fading a->b over n samples:
    cos/sin law normalised so that the expected power a^2+b^2+2*rho*g1*g2 stays 1 (rho = corr of a,b in the window)"""
    th=np.linspace(0,np.pi/2,n)
    g1=np.cos(th); g2=np.sin(th)
    ea=np.sqrt((a*a).mean()); eb=np.sqrt((b*b).mean())
    rho=float((a*b).mean()/(ea*eb+1e-20)) if ea>0 and eb>0 else 0.0
    rho=max(0.0,min(rho,1.0))
    nrm=np.sqrt(g1**2+g2**2+2*rho*g1*g2)
    return g1/nrm,g2/nrm,rho
def compose(signals,start,cuts):
    """signals: dict name->array (output timeline). start: name of first signal. cuts: list of (center_s, xfade_ms, name)
    output = start signal until first cut, then next, with crossfades centered at the cut times"""
    out=signals[start].copy(); cur=start; info=[]
    for c,ms,nm in cuts:
        n=max(2,int(round(ms*SR/1000))); a=T(c)-n//2; b=a+n
        A=signals[cur][a:b]; B=signals[nm][a:b]
        g1,g2,rho=xfade_gains(A,B,n)
        out[a:b]=A*g1+B*g2
        out[b:]=signals[nm][b:]
        info.append(dict(center=round(c,4),xfade_ms=ms,frm=cur,to=nm,rho=round(rho,3)))
        cur=nm
    return out,info
# ---------- EQ match ----------
def band_db(x,fc):
    f,P=welch(x,SR,nperseg=2048,noverlap=1536)
    out=[]
    for c in fc:
        lo,hi=c/2**(1/6),c*2**(1/6); m=(f>=lo)&(f<hi)
        out.append(10*np.log10(P[m].mean()+1e-20))
    return np.array(out)
FC=np.array([100*2**(k/3) for k in range(0,23)])   # 100 Hz .. ~16 kHz, 1/3 octave
def eq_curve(pairs):
    """pairs: list of (target_seg, source_seg) arrays (enhanced, dry) at matched content. returns dB gain per FC (smoothed)"""
    tg=np.concatenate([p[0] for p in pairs]); sr_=np.concatenate([p[1] for p in pairs])
    g=band_db(tg,FC)-band_db(sr_,FC)
    g=np.convolve(np.pad(g,1,mode='edge'),[0.25,0.5,0.25],'valid')   # light smoothing
    return np.clip(g,-24,24)
def apply_eq(x,gdb,ntap=2047):
    """zero-phase FIR from the 1/3-octave gain curve (frequency sampling, log-interpolated)"""
    nf=8192; f=np.fft.rfftfreq(nf,1/SR)
    lf=np.log2(np.maximum(f,1)); G=np.interp(lf,np.log2(FC),gdb,left=gdb[0],right=gdb[-1])
    H=10**(G/20); h=np.fft.irfft(H,nf); h=np.roll(h,ntap//2)[:ntap]*np.hanning(ntap)
    y=np.convolve(x,h,mode='same')
    return y
# ---------- WSOLA ----------
def wsola(x,in_a,in_b,out_len,frame=1152,tol=384):
    """stretch x[in_a:in_b] to out_len samples (pitch/formants kept), first frame locked to in_a"""
    H=frame//2; w=np.hanning(frame+1)[:frame]
    nfr=int(np.ceil(out_len/H))+1
    y=np.zeros(nfr*H+frame); ws=np.zeros_like(y)
    rate=(in_b-in_a)/out_len
    prev=None
    for k in range(nfr):
        nom=int(round(in_a+k*H*rate))
        if prev is None: pos=nom
        else:
            target=x[prev+H:prev+H+frame]   # natural continuation of previous frame
            best=-1e9; pos=nom
            for p in range(nom-tol,nom+tol+1,2):
                seg=x[p:p+frame]
                c=(seg*target*w).sum()/np.sqrt((seg*seg*w).sum()*(target*target*w).sum()+1e-20)
                if c>best: best=c; pos=p
            # refine +-1
            for p in (pos-1,pos+1):
                seg=x[p:p+frame]; c=(seg*target*w).sum()/np.sqrt((seg*seg*w).sum()*(target*target*w).sum()+1e-20)
                if c>best: best=c; pos=p
        y[k*H:k*H+frame]+=x[pos:pos+frame]*w; ws[k*H:k*H+frame]+=w
        prev=pos
    y=y/np.maximum(ws,1e-3)
    return y[:out_len]
def lev(x,a,b): a=T(a); b=T(b); return 20*np.log10(np.sqrt((x[a:b]**2).mean())+1e-12)
# ---------- anchored WSOLA (dynamic programming, both ends locked) ----------
def wsola_dp(x,in_a,in_b,out_a,out_b,lock_end_src,frame=1152,tol=288,step=2):
    """time-stretch x[in_a:in_b] onto output [out_a,out_b). First frame starts exactly at in_a (continuation of the
    unshifted signal), last frame starts exactly at lock_end_src (so the end is sample-coherent with the shifted signal).
    Frame positions in between chosen by DP to maximise waveform similarity of consecutive frames (natural continuation)."""
    H=frame//2; w=np.hanning(frame+1)[:frame]
    L=out_b-out_a; K=int(np.ceil((L-frame)/H))+1          # frames 0..K-1, frame k at output out_a+k*H
    rate=(in_b-in_a)/max(L-frame,1)
    nom=[in_a+int(round(k*H*(lock_end_src-in_a)/max((K-1)*H,1))) for k in range(K)]
    cands=[]
    for k in range(K):
        if k==0: cands.append(np.array([in_a]))
        elif k==K-1: cands.append(np.array([lock_end_src]))
        else: cands.append(np.arange(nom[k]-tol,nom[k]+tol+1,step))
    def nc(a,b):  # normalised correlation of windowed frames
        return (a*b*w).sum()/np.sqrt((a*a*w).sum()*(b*b*w).sum()+1e-20)
    cost=[np.zeros(1)]; back=[None]
    for k in range(1,K):
        P=cands[k-1]; Q=cands[k]; C=np.zeros((len(P),len(Q)))
        for i,p in enumerate(P):
            tgt=x[p+H:p+H+frame]
            for j,q in enumerate(Q):
                C[i,j]=1-nc(tgt,x[q:q+frame])
        tot=cost[-1][:,None]+C; back.append(tot.argmin(0)); cost.append(tot.min(0))
    j=0; pos=[0]*K; pos[K-1]=cands[K-1][0]; j=int(np.argmin(cost[-1]))
    for k in range(K-1,0,-1):
        pos[k]=cands[k][j]; j=back[k][j]
    pos[0]=in_a
    y=np.zeros(L+frame); ws=np.zeros(L+frame)
    for k in range(K):
        o=k*H; y[o:o+frame]+=x[pos[k]:pos[k]+frame]*w; ws[o:o+frame]+=w
    y=y/np.maximum(ws,1e-3)
    return y, pos, (K-1)*H     # y aligned to out_a; last frame starts at out_a+(K-1)*H
