# parametrised copy of /home/user/rr/voice3/ver/hfpatch.py (same maths): treble source selectable, lags can be forced, components saved
import sys,json,os; sys.path.insert(0,'/home/user/rr/voice3/ver'); from vv import *
from scipy.signal import stft, istft, butter, sosfiltfilt, correlate
SRC=sys.argv[1]; TS=sys.argv[2]; OUT=sys.argv[3]; spans=json.load(open(sys.argv[4])); FC=3500; FD=0.025
P['dry']=A+'/audio/vo/vo2_dry.wav'
KEEP=[tuple(map(float,q.split('-'))) for q in os.environ.get('KEEP','').split(',') if q]
FORCE=json.load(open(os.environ['LAGS'])) if os.environ.get('LAGS') else None
SWSRC=os.environ.get('SWSRC',TS)
v=rd(SRC); n=len(v); p=rd(TS)[:n]; b=rd('bl'); b=np.pad(b,(0,max(0,n-len(b))))[:n]
os.chdir('/home/user/rr/voice3/ver')
fq=np.load('eq2_f.npy'); Gv=np.load('eq2_vow.npy'); Gs=np.load('eq2_sib.npy')
NF=2048; HOP=512
f,t,Zp=stft(p,fs=SR,nperseg=NF,noverlap=NF-HOP)
Zs=Zp if SWSRC==TS else stft(rd(SWSRC)[:n],fs=SR,nperseg=NF,noverlap=NF-HOP)[2]
Pp=np.abs(Zs)**2
def band(lo,hi): m=(f>=lo)&(f<hi); return db(Pp[m].sum(0))
Hp=band(4000,12000)-band(1000,3500); sw=np.clip((Hp+15)/12,0,1)
from scipy.ndimage import uniform_filter1d as uf
sw=uf(sw,3)
Gf=np.interp(f,fq,Gv)[:,None]*(1-sw[None,:])+np.interp(f,fq,Gs)[:,None]*sw[None,:]
_,pe=istft(Zp*10**(Gf/20),fs=SR,nperseg=NF,noverlap=NF-HOP); pe=pe[:n]
sosH=butter(4,FC,'highpass',fs=SR,output='sos')
hpv=sosfiltfilt(sosH,v); hpp=sosfiltfilt(sosH,pe)
from scipy.ndimage import uniform_filter1d, minimum_filter1d
def lev(x): return db(uniform_filter1d(x**2,240)[::48])
Ggate=np.clip(lev(v)-lev(b)+0.9,-60,0)
Ggate=uniform_filter1d(minimum_filter1d(Ggate,5),5)
gg=10**(np.interp(np.arange(n),np.arange(len(Ggate))*48,Ggate)/20)
sosB=butter(4,[1000,3500],'bandpass',fs=SR,output='sos'); vb=sosfiltfilt(sosB,v); pb=sosfiltfilt(sosB,p)
y=v.copy(); W=np.zeros(n); S=np.zeros(n); log=[]
for si,(a,b_,*_) in enumerate(spans):
    i0,i1=int(a*SR),int(b_*SR); m=48
    if FORCE is None:
        c=correlate(pb[i0-m-2400:i1+m+2400],vb[i0-2400:i1+2400],mode='valid'); lag=int(np.argmax(c)-m)
        ncc=c[lag+m]/np.sqrt(np.sum(vb[i0-2400:i1+2400]**2)*np.sum(pb[i0-2400+lag:i1+2400+lag]**2))
        if ncc<0.3: lag=0
    else: lag=int(FORCE[si]['lag']); ncc=float('nan')
    seg=np.arange(int((a-FD)*SR),int((b_+FD)*SR)); tt=seg/SR
    w=np.clip((tt-(a-FD))/FD,0,1)*np.clip(((b_+FD)-tt)/FD,0,1); w=np.sin(0.5*np.pi*w)**2
    src=hpp[seg+lag]*gg[seg]
    for ka,kb in KEEP:
        kk=np.clip(np.minimum((tt-(ka-0.015))/0.015,((kb+0.015)-tt)/0.015),0,1); w=w*(1-np.sin(0.5*np.pi*kk)**2)
    y[seg]=y[seg]+w*(src-hpv[seg]); W[seg]=w; S[seg]=src
    log.append(dict(span=[a,b_],lag=lag,ncc=round(float(ncc),2)))
sf.write(OUT,y,SR,subtype='PCM_24'); json.dump(log,open(OUT.replace('.wav','_log.json'),'w'),indent=0)
np.save(OUT.replace('.wav','_W.npy'),W.astype(np.float64)); np.save(OUT.replace('.wav','_S.npy'),S); np.save(OUT.replace('.wav','_hpv.npy'),hpv)
print('ok',OUT)
