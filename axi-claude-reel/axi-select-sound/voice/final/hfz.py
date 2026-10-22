# zone treble repair (hfpatch.py maths) with the original take ALIGNED to the enhanced voice: vo2_dry advanced by ~85.3 ms (lag refined per span)
# usage: hfz.py IN(float, echo-removed zone) OUT spans.json
import sys,json,os; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
from scipy.signal import stft, istft, butter, sosfiltfilt, correlate
from scipy.ndimage import uniform_filter1d, minimum_filter1d
IN=sys.argv[1]; OUT=sys.argv[2]; spans=json.load(open(sys.argv[3])); FC=3500; FD=0.025
F='/home/user/rr/sound3/voice/final/'
v=rd(IN); p=rd('dry'); e0=rd(F+'eng0.wav'); b=rd('bl')
fq=np.load(F+'eqz_f.npy'); Gv=np.load(F+'eqz_vow.npy'); Gs=np.load(F+'eqz_sib.npy')
NF=2048; HOP=512
f,t,Zp=stft(p,fs=SR,nperseg=NF,noverlap=NF-HOP); Pp=np.abs(Zp)**2
def band(lo,hi): m=(f>=lo)&(f<hi); return db(Pp[m].sum(0))
Hp=band(4000,12000)-band(1000,3500); sw=uf=None
from scipy.ndimage import uniform_filter1d as uf
sw=uf(np.clip((Hp+15)/12,0,1),3)
Gf=np.interp(f,fq,Gv)[:,None]*(1-sw[None,:])+np.interp(f,fq,Gs)[:,None]*sw[None,:]
_,pe=istft(Zp*10**(Gf/20),fs=SR,nperseg=NF,noverlap=NF-HOP); pe=pe[:N]
sosH=butter(4,FC,'highpass',fs=SR,output='sos'); hpv=sosfiltfilt(sosH,v); hpp=sosfiltfilt(sosH,pe)
# gate gain of the enhanced voice (eng0 vs its pre-gate separation), as hfpatch.py; levelled like the voice (G)
gs=np.load(F+'rep_v3_gs.npy'); trim=float(open(F+'rep_v3_trim.txt').read()); Gl=10**(gs/20)*10**(trim/20)
def lev(x): return db(uniform_filter1d(x**2,240)[::48])
Ggate=np.clip(lev(e0)-lev(b)+0.9,-60,0); Ggate=uniform_filter1d(minimum_filter1d(Ggate,5),5)
gg=10**(np.interp(np.arange(N),np.arange(len(Ggate))*48,Ggate)/20)*Gl
sosB=butter(4,[1000,3500],'bandpass',fs=SR,output='sos'); vb=sosfiltfilt(sosB,v); pb=sosfiltfilt(sosB,p)
y=v.copy(); W=np.zeros(N); log=[]
for a,b_,c in spans:
    i0,i1=int(a*SR),int(b_*SR); m=48; pad=2400; seg_v=vb[i0-pad:i1+pad]; best=None
    for base in (4094,0):
        cc=correlate(pb[i0-pad+base-m:i1+pad+base+m],seg_v,mode='valid'); k=int(np.argmax(cc)); lg=base+k-m
        nc=cc[k]/np.sqrt(np.sum(seg_v**2)*np.sum(pb[i0-pad+lg:i1+pad+lg]**2))
        if best is None or nc>best[1]: best=(lg,nc)
    lag,ncc=best
    if ncc<0.2: lag=4094 if c==1 else 0
    seg=np.arange(int((a-FD)*SR),int((b_+FD)*SR)); tt=seg/SR
    w=np.clip((tt-(a-FD))/FD,0,1)*np.clip(((b_+FD)-tt)/FD,0,1); w=np.sin(0.5*np.pi*w)**2
    src=hpp[seg+lag]*gg[seg]
    y[seg]=y[seg]+w*(src-hpv[seg]); W[seg]=np.maximum(W[seg],w)
    e_old=db(np.mean(hpv[i0:i1]**2)); e_new=db(np.mean(src[int(FD*SR):-int(FD*SR)]**2))
    log.append(dict(span=[a,b_],lag=lag,lag_ms=round(lag/48,2),ncc=round(float(ncc),2),hf_before_db=round(float(e_old),1),hf_after_db=round(float(e_new),1)))
    print('%.3f-%.3f lag %5d (%.2f ms) ncc %.2f  HF(>3.5k) %.1f -> %.1f dB'%(a,b_,lag,lag/48,ncc,e_old,e_new))
sf.write(F+OUT,y,SR,subtype='FLOAT'); np.save(F+OUT.replace('.wav','_delta.npy'),y-v); json.dump(log,open(F+OUT.replace('.wav','_log.json'),'w'),indent=0); np.save(F+OUT.replace('.wav','_W.npy'),W)
print('ok',OUT)
