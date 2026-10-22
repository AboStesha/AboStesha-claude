# full-file checks of a candidate against vo2_v3.wav: format, lag, bit-identity, loudness, bands, words, pitch, pauses
import sys,json,hashlib,subprocess; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
sys.path.insert(0,'/home/user/rr/sound3/voice/verify'); from vlib import lufs, truepeak
from scipy.signal import stft, correlate, resample_poly
C=sys.argv[1]; R={}
info=sf.info(C); R['format']=[info.samplerate,info.channels,info.subtype,info.frames]
R['md5']=hashlib.md5(open(C,'rb').read()).hexdigest()
ci=rdi(C); vi=rdi('v3'); R['samples_differing_from_v3']=int(np.sum(ci!=vi))
x=ci/2**31; v=vi/2**31
# lag: global and per 4 s window
def lag(a,b,i0,i1,m=480):
    c=correlate(b[i0-m:i1+m],a[i0:i1],mode='valid'); k=int(np.argmax(c)); return k-m
R['lag_global']=lag(x,v,int(2.5*SR),int(84*SR),480)
R['lag_per4s']=[lag(x,v,int(t*SR),int((t+4)*SR),240) for t in np.arange(2.5,82,4)]
R['lufs']=[round(lufs(v),3),round(lufs(x),3)]; R['truepeak_dBTP']=[round(truepeak(v),2),round(truepeak(x),2)]
# bands in speech frames
f,t,Zv=stft(v,SR,nperseg=2048,noverlap=2048-480); _,_,Zx=stft(x,SR,nperseg=2048,noverlap=2048-480); Pv=np.abs(Zv)**2; Px=np.abs(Zx)**2
tot=db(Pv.sum(0)); sp=tot>np.percentile(tot,99)-30
zf=np.zeros(len(t),bool)
for a,b in ZONE: zf|=(t>=a)&(t<=b)
BE=[60,150,300,600,1200,2400,4800,9600,16000]
for nm,m in [('bands_all',sp),('bands_zone',sp&zf),('bands_outside',sp&~zf)]:
    R[nm]=[round(float(db(Px[(f>=lo)&(f<hi)][:,m].sum())-db(Pv[(f>=lo)&(f<hi)][:,m].sum())),2) for lo,hi in zip(BE[:-1],BE[1:])]
# words (v3 word list), 150-8000 Hz energy
xb=bp(x,150,8000); vb=bp(v,150,8000); wz=[];wo=[]
for w in V3W:
    if w['e']-w['s']<0.06: continue
    i0,i1=int(w['s']*SR),int(w['e']*SR); dd=db(np.mean(xb[i0:i1]**2))-db(np.mean(vb[i0:i1]**2))
    (wz if inZ(w['s']) else wo).append(dd)
for nm,dv in [('words_zone',wz),('words_outside',wo)]:
    dv=np.array(dv); R[nm]=dict(n=len(dv),median=round(float(np.median(dv)),2),p5=round(float(np.percentile(dv,5)),2),p95=round(float(np.percentile(dv,95)),2),min=round(float(dv.min()),2),max=round(float(dv.max()),2))
# pitch (pyin, 16 kHz)
import librosa
def f0(y):
    y16=resample_poly(y,1,3); fr,vv,_=librosa.pyin(y16,fmin=65,fmax=400,sr=16000,frame_length=1024,hop_length=160); return fr,vv
fx,vx=f0(x); fv,vv=f0(v); n=min(len(fx),len(fv)); tt=np.arange(n)*0.01
both=vx[:n]&vv[:n]; c=1200*np.log2(fx[:n][both]/fv[:n][both]); tb=tt[both]
for nm,m in [('pitch_zone',np.array([inZ(q) for q in tb])),('pitch_outside',np.array([not inZ(q) for q in tb]))]:
    cc=c[m]; R[nm]=dict(n=int(m.sum()),median_abs_cents=round(float(np.median(np.abs(cc))),1),p95_abs_cents=round(float(np.percentile(np.abs(cc),95)),1),pct_gt50=round(float(np.mean(np.abs(cc)>50)*100),2))
R['voiced_frames_v3_cand']=[int(vv[:n].sum()),int(vx[:n].sum())]
# pauses (v3 pause map): residual dB re speech p90 (150-8000 Hz, 10 ms)
PZ=json.load(open(A+'/work/vo_pauses_v3.json'))
H=480; Lx=db(np.convolve(xb**2,np.ones(H)/H,'same')[::H]); Lv=db(np.convolve(vb**2,np.ones(H)/H,'same')[::H]); ref=np.percentile(Lv[Lv>-90],90)
px=[];pv=[]
for a,b in PZ:
    if b-a<0.15 or a<2.4: continue
    i0,i1=int((a+0.05)*100),int((b-0.03)*100)
    if i1<=i0: continue
    px.append(np.max(Lx[i0:i1])-ref); pv.append(np.max(Lv[i0:i1])-ref)
R['pause_max_dB_re_speech_p90']=dict(v3_median=round(float(np.median(pv)),1),cand_median=round(float(np.median(px)),1),v3_max=round(float(np.max(pv)),1),cand_max=round(float(np.max(px)),1),n=len(px))
json.dump(R,open(C.replace('.wav','_meas.json'),'w'),indent=1); print(json.dumps(R))
