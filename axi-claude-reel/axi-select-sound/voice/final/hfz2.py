# zone treble repair v2: hfpatch.py maths with the original take ALIGNED (vo2_dry advanced ~85.3 ms, lag refined per span),
# borrowed treble scaled by the local mid-band level ratio (enhanced / original), gate = max(enhanced-voice gate, original-take activity)
# so that fricative onsets the old gate removed come back; onset spans (enhanced voice silent) also get the 2-3.5 kHz part.
# usage: hfz2.py IN OUT spans.json onsets.json
import sys,json,os; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
from scipy.signal import stft, istft, butter, sosfiltfilt, correlate
from scipy.ndimage import uniform_filter1d, minimum_filter1d, maximum_filter1d
IN,OUT=sys.argv[1],sys.argv[2]; spans=json.load(open(sys.argv[3])); ons=json.load(open(sys.argv[4])); FC=3500; FD=0.025
F='/home/user/rr/sound3/voice/final/'
v=rd(IN); p=rd('dry'); e0=rd(F+'eng0.wav'); b=rd('bl')
fq=np.load(F+'eqz_f.npy'); Gv=np.load(F+'eqz_vow.npy'); Gs=np.load(F+'eqz_sib.npy')
NF=2048; HOP=512
f,t,Zp=stft(p,fs=SR,nperseg=NF,noverlap=NF-HOP); Pp=np.abs(Zp)**2
def band(lo,hi): m=(f>=lo)&(f<hi); return db(Pp[m].sum(0))
from scipy.ndimage import uniform_filter1d as uf
sw=uf(np.clip((band(4000,12000)-band(1000,3500)+15)/12,0,1),3)
Gf=np.interp(f,fq,Gv)[:,None]*(1-sw[None,:])+np.interp(f,fq,Gs)[:,None]*sw[None,:]
_,pe=istft(Zp*10**(Gf/20),fs=SR,nperseg=NF,noverlap=NF-HOP); pe=pe[:N]
sosH=butter(4,FC,'highpass',fs=SR,output='sos'); hpv=sosfiltfilt(sosH,v); hpp=sosfiltfilt(sosH,pe)
sosM=butter(4,[2000,FC],'bandpass',fs=SR,output='sos'); bpv=sosfiltfilt(sosM,v); bpp=sosfiltfilt(sosM,pe)
def lev(x): return db(uniform_filter1d(x**2,240)[::48])
Ggate=np.clip(lev(e0)-lev(b)+0.9,-60,0); Ggate=uniform_filter1d(minimum_filter1d(Ggate,5),5)
gv=10**(np.interp(np.arange(N),np.arange(len(Ggate))*48,Ggate)/20)
# activity of the original take in 3.5-12 kHz (1 ms grid), aligned per span below
hb=sosfiltfilt(butter(4,[3500,12000],'bandpass',fs=SR,output='sos'),p); La=db(uniform_filter1d(hb**2,240)[::48])
ref=np.percentile(db(uniform_filter1d(sosfiltfilt(butter(4,[150,8000],'bandpass',fs=SR,output='sos'),p)**2,480)[::48]),95)
ga_ms=np.clip((La-(ref-42))/6,0,1); ga_ms=uniform_filter1d(maximum_filter1d(ga_ms,9),5)
sosB=butter(4,[1000,3500],'bandpass',fs=SR,output='sos'); vb=sosfiltfilt(sosB,v); pb=sosfiltfilt(sosB,p)
# split every item at E/L word boundaries (word dominance map), so each piece borrows treble at the right alignment
dom=json.load(open(F+'wdom.json')); WD=[(q['s'],q['e'],1 if (q['dom']=='E' and inZ(q['s'])) else 0) for q in dom]
def cls_at(t):
    best=None
    for a0,b0,c0 in WD:
        dd=0 if a0<=t<=b0 else min(abs(t-a0),abs(t-b0))
        if best is None or dd<best[0]: best=(dd,c0)
    return best[1]
raw=[(a,b_,'span') for a,b_,c in spans]+[(a,b_,'onset') for a,b_,_ in ons]
items=[]
for a,b_,kind in raw:
    ts=np.arange(a,b_,0.005); cs=[cls_at(t) for t in ts]; s0=0
    for i in range(1,len(ts)+1):
        if i==len(ts) or cs[i]!=cs[s0]:
            qa,qb=ts[s0],(ts[i] if i<len(ts) else b_)
            if qb-qa>=0.03 or (s0==0 and i==len(ts)): items.append((round(qa,3),round(qb,3),cs[s0],kind))
            elif items and items[-1][3]==kind and abs(items[-1][1]-qa)<1e-6: items[-1]=(items[-1][0],round(qb,3),items[-1][2],kind)
            s0=i
items.sort()
y=v.copy(); W=np.zeros(N); log=[]
for a,b_,c,kind in items:
    i0,i1=int(a*SR),int(b_*SR); m=48; pad=2400; seg_v=vb[i0-pad:i1+pad]; best=None
    for base in ((4094,) if c==1 else (0,)):
        cc=correlate(pb[i0-pad+base-m:i1+pad+base+m],seg_v,mode='valid'); k=int(np.argmax(cc)); lg=base+k-m
        nc=cc[k]/np.sqrt(np.sum(seg_v**2)*np.sum(pb[i0-pad+lg:i1+pad+lg]**2)+1e-30)
        if best is None or nc>best[1]: best=(lg,nc)
    lag,ncc=best
    if ncc<0.2 or kind=='onset' or (c==1 and abs(lag-4094)>48) or (c==0 and abs(lag)>48): lag=4094 if c==1 else 0
    # local level ratio enhanced/original in 1-3.5 kHz over the span +-60 ms (speech parts only)
    j0,j1=int((a-0.06)*SR),int((b_+0.06)*SR); ev=uniform_filter1d(vb[j0:j1]**2,480); ep=uniform_filter1d(pb[j0+lag:j1+lag]**2,480)
    msk=ev>np.max(ev)*10**(-2.5)
    klev=np.sqrt(np.sum(ev[msk])/max(np.sum(ep[msk]),1e-30)) if msk.sum()>480 else 10**(1.5/20)
    klev=float(np.clip(klev,10**(-3/20),10**(6/20)))
    seg=np.arange(int((a-FD)*SR),int((b_+FD)*SR)); tt=seg/SR
    w=np.clip((tt-(a-FD))/FD,0,1)*np.clip(((b_+FD)-tt)/FD,0,1); w=np.sin(0.5*np.pi*w)**2
    ga=np.interp(seg+lag,np.arange(len(ga_ms))*48,ga_ms)
    gate=np.maximum(gv[seg],ga)
    src=hpp[seg+lag]*gate*klev
    wn=np.maximum(W[seg],w); dw=wn-W[seg]      # overlapping items: only add the not-yet-replaced fraction
    y[seg]=y[seg]+dw*(src-hpv[seg])
    if kind=='onset':                           # enhanced voice silent: also bring the 2-3.5 kHz part of the fricative
        sil=np.clip((-(db(uniform_filter1d(v[seg]**2,240))-(ref-55)))/6,0,1)
        y[seg]=y[seg]+w*sil*(bpp[seg+lag]*ga*klev-bpv[seg]*0)
    W[seg]=wn
    log.append(dict(kind=kind,span=[a,b_],lag=lag,ncc=round(float(ncc),2),klev_dB=round(20*np.log10(klev),1),hf_before_db=round(float(db(np.mean(hpv[i0:i1]**2))),1),hf_after_db=round(float(db(np.mean(src[int(FD*SR):-int(FD*SR)]**2))),1)))
sf.write(F+OUT,y,SR,subtype='FLOAT'); np.save(F+OUT.replace('.wav','_delta.npy'),y-v); json.dump(log,open(F+OUT.replace('.wav','_log.json'),'w'),indent=0); np.save(F+OUT.replace('.wav','_W.npy'),W)
print('items',len(items),'total %.2f s'%sum(q[1]-q[0] for q in items),'klev dB median %.1f'%np.median([q['klev_dB'] for q in log]))
for q in log: print(q)
