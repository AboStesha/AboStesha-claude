# shared helpers for the vo2_final job (ghost metrics etc.)
import numpy as np, soundfile as sf, json
from scipy.signal import butter, sosfiltfilt, fftconvolve
SR=48000; N=4129600
A='/home/user/rr/axi-select-ch2'
P=dict(v3=A+'/audio/vo/vo2_v3.wav', enh=A+'/inputs/vo_v3/level2_rabee_enhanced.wav', pat=A+'/audio/vo/vo2_patched.wav',
       dry=A+'/audio/vo/vo2_dry.wav', raw=A+'/inputs/vo/vo2_raw.wav', eng='/home/user/rr/voice3/ver/vo2_v3_engineer_dff01915.wav',
       p2='/home/user/rr/voice3/ver/v3p2.wav', bl='/home/user/rr/voice3/cand/F_bl.wav')
WORDS=json.load(open(A+'/work/vofix2/words_qa.json'))
R=[(3.78,16.04),(18.70,42.13)]
OUTR=[(2.43,3.78),(16.04,18.70),(42.13,84.0)]
H=np.load('/home/user/rr/sound3/voice/logs/h_final.npy'); D=int(round(0.0835*SR)); DL=0.0853
def rd(k):
    x,sr=sf.read(P.get(k,k),dtype='float64',always_2d=True); assert sr==SR; x=x.mean(1)
    if len(x)<N: x=np.pad(x,(0,N-len(x)))
    return x[:N]
def rdi(k):
    x,sr=sf.read(P.get(k,k),dtype='int32',always_2d=True); return x[:,0]
def db(v): return 10*np.log10(np.maximum(v,1e-30))
def bp(x,lo,hi,o=4):
    if lo<=0: s=butter(o,hi,'lowpass',fs=SR,output='sos')
    elif hi>=SR/2: s=butter(o,lo,'highpass',fs=SR,output='sos')
    else: s=butter(o,[lo,hi],'bandpass',fs=SR,output='sos')
    return sosfiltfilt(s,x)
def precopy(x,h=H,d=D):
    xr=x[::-1]; cr=np.zeros_like(x); cr[d:]=fftconvolve(xr,h)[:len(x)-d]; return cr[::-1]
def inR(t): return any(a<=t<=b for a,b in R)
LAGS=range(4094-12,4094+13)
def ac85(sb,a,b):
    i0,i1=int(a*SR),int(b*SR); u=sb[i0:i1]; best=0.0
    for L in LAGS:
        w=sb[i0-L:i1-L]; c=np.dot(u,w)/np.sqrt(np.dot(u,u)*np.dot(w,w)+1e-30)
        if abs(c)>abs(best): best=c
    return float(best)
def ac_windows(x,t0=2.4,t1=84.0,win=4.0,hop=2.0,bands=((500,1500),(1500,4000))):
    out={}
    for lo,hi in bands:
        sb=bp(x,lo,hi); out[f'{lo}-{hi}']=[(round(t,1),round(ac85(sb,t,min(t+win,t1)),3)) for t in np.arange(t0,t1-1.0,hop)]
    return out
def ac_regions(x,bands=((500,1500),(1500,4000))):
    out={}
    for lo,hi in bands:
        sb=bp(x,lo,hi); out[f'{lo}-{hi}']={f'{a}-{b}':round(ac85(sb,a,b),3) for a,b in R+OUTR}
    return out
def word_copy(x,words=WORDS,ref=None):
    """per-word copy level (dB re the word, 300-6000 Hz): regression of the signal in the window where the word's ghost lands
       (85.3 ms earlier) on the copy predicted from the word itself; returns list of (word,a,b,gain,level_dB)"""
    src=x if ref is None else ref
    s1=bp(x,300,6000); c1=bp(precopy(src),300,6000); r1=bp(src,300,6000); out=[]
    for w,a,b in words:
        if b-a<0.08: continue
        i0=int((a-DL)*SR); i1=int((b-DL)*SR)
        g=np.dot(s1[i0:i1],c1[i0:i1])/(np.dot(c1[i0:i1],c1[i0:i1])+1e-30)
        lev=db(max(g,0.0)**2*np.sum(c1[i0:i1]**2)/(np.sum(r1[int(a*SR):int(b*SR)]**2)+1e-30))
        out.append((w,a,b,float(g),float(max(lev,-60))))
    return out
def summ_words(wc):
    r={}
    for nm,sel in [('R1',lambda a:3.78<=a<=16.04),('R2',lambda a:18.70<=a<=42.13),('out',lambda a:not inR(a))]:
        v=np.array([q[4] for q in wc if sel(q[1])]); g=np.array([q[3] for q in wc if sel(q[1])])
        r[nm]=dict(n=len(v),med_dB=round(float(np.median(v)),1),p90_dB=round(float(np.percentile(v,90)),1),max_dB=round(float(v.max()),1),med_gain=round(float(np.median(g)),3))
    return r
# ---- post-copy (trailing echo) helpers: the enhanced voice carries the copy AFTER each word
import json as _json
V3W=_json.load(open(A+'/work/asr/v3_words.json'))['words']
def postcopy(x,h=H,d=D):
    c=np.zeros_like(x); c[d:]=fftconvolve(x,h)[:len(x)-d]; return c
def word_copy_post(x,words=None,ref=None,h=H):
    """per-word trailing-copy level (dB re the word, 300-6000 Hz): regression of the signal in the window 85.3 ms AFTER the word
       on the copy predicted from the word itself; words = list of (w,s,e)"""
    if words is None: words=[(w['w'],w['s'],w['e']) for w in V3W]
    src=x if ref is None else ref
    s1=bp(x,300,6000); c1=bp(postcopy(src,h),300,6000); r1=bp(src,300,6000); out=[]
    for w,a,b in words:
        if b-a<0.08: continue
        i0=int((a+DL)*SR); i1=int((b+DL)*SR)
        g=np.dot(s1[i0:i1],c1[i0:i1])/(np.dot(c1[i0:i1],c1[i0:i1])+1e-30)
        lev=db(max(g,0.0)**2*np.sum(c1[i0:i1]**2)/(np.sum(r1[int(a*SR):int(b*SR)]**2)+1e-30))
        out.append((w,a,b,float(g),float(max(lev,-60))))
    return out
ZONE=[(3.70,16.25),(18.55,45.10)]
def inZ(t): return any(a<=t<=b for a,b in ZONE)
def summ_post(wc,cls=None):
    r={}
    for nm,sel in [('Z1',lambda a:3.70<=a<=16.25),('Z2',lambda a:18.55<=a<=45.10),('outside',lambda a:not inZ(a))]:
        v=np.array([q[4] for q in wc if sel(q[1])])
        r[nm]=dict(n=len(v),med_dB=round(float(np.median(v)),1),p75_dB=round(float(np.percentile(v,75)),1),p90_dB=round(float(np.percentile(v,90)),1))
    return r
def ac_zone(x,bands=((500,1500),(1500,4000))):
    out={}
    for lo,hi in bands:
        sb=bp(x,lo,hi); out[f'{lo}-{hi}']={f'{a}-{b}':round(ac85(sb,a,b),3) for a,b in ZONE+[(2.43,3.70),(16.25,18.55),(45.10,84.0)]}
    return out
