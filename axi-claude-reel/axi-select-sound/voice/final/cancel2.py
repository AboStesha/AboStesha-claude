# trailing-copy canceller (stage-1 maths of make_dry.py/tfec7.py, mirrored in time: the copy FOLLOWS each word by 85.3 ms)
# run on X0 = levelled enhanced voice without any borrowed treble (eng0 * G); writes the subtraction signal sub2.npy (+ h, gains)
import sys, os, json; sys.path.insert(0,'/home/user/rr/sound3/voice/scripts'); sys.path.insert(0,'/home/user/rr/sound3/voice/final')
import numpy as np, soundfile as sf
from glib import rd as grd, SR, N, postcopy, V3W, ZONE, db
from scipy.signal import butter, sosfiltfilt, stft, istft, firwin, fftconvolve
from scipy.ndimage import uniform_filter, uniform_filter1d
from echocancel import mask
import wls
F='/home/user/rr/sound3/voice/final/'
gs=np.load(F+'rep_v3_gs.npy'); trim=float(open(F+'rep_v3_trim.txt').read())
x=grd(F+'eng0.wav'); x=x*10**(gs/20); x=x*10**(trim/20)
D=int(round(0.0835*SR)); L=192; DL=0.0853
SPLIT=float(os.environ.get('SPLIT','3000')); TR0=float(os.environ.get('TR0','-6')); R0=float(os.environ.get('R0','-10')); BMAX=float(os.environ.get('BMAX','1.5'))
# 1) path: weighted LS on speech frames of the zone (direction-agnostic second-order statistics), as make_dry.py
from echo_est import est_joint
h0=est_joint(x,ZONE,D,L)
c0=postcopy(x,h0,D)*mask(len(x),ZONE)
sos=butter(4,[300,6000],'bandpass',fs=SR,output='sos'); xb=sosfiltfilt(sos,x); cb=sosfiltfilt(sos,c0)
k=np.ones(480)/480; rho=10*np.log10(np.maximum(np.convolve(xb**2,k,'same'),1e-20)/(np.convolve(cb**2,k,'same')+1e-20))
w=np.zeros(len(x))
for a,b in ZONE: w[int(a*SR):int(b*SR)]=1
w*=(rho>3)
os.environ['LOAD']='1.01'; h=wls.wls(x,w,D,L); np.save(F+'h_post.npy',h)
print('h: E %.2f dB, peak %.3f ms'%(10*np.log10(np.sum(h**2)),(D+np.argmax(np.abs(h)))/SR*1000))
# 2) per-word, per-band gains of the trailing copy (copy of word [s,e] lands at [s+DL,e+DL])
def lp(z,fc,ntap=801): return fftconvolve(z,firwin(ntap,fc,fs=SR),'same')
xlo=lp(x,SPLIT); xhi=x-xlo
words=[(q['w'],q['s'],q['e']) for q in V3W]
def gains(band):
    xbnd=xlo if band=='lo' else xhi; lo,hi=(300,SPLIT) if band=='lo' else (SPLIT,8000)
    c=postcopy(xbnd,h,D); s2=butter(4,[lo,hi],'bandpass',fs=SR,output='sos'); s1=sosfiltfilt(s2,x); c1=sosfiltfilt(s2,c); g=[]
    for _,a,b in words:
        i0=int((a+DL)*SR); i1=int((b+DL)*SR); g.append(np.dot(s1[i0:i1],c1[i0:i1])/(np.dot(c1[i0:i1],c1[i0:i1])+1e-20))
    return np.array(g)
glo=gains('lo'); ghi=gains('hi')
# words eligible: inside the zone (by word start) and E-timed (copy exists); class from wlag.json
cls={r['i']:r for r in json.load(open(F+'wdom.json'))}
def eligible(i,a,b):
    if not any(A<=a and b<=B+0.05 for A,B in ZONE): return False
    r=cls.get(i)
    return r is not None and r['dom']=='E'
def wmask(g,ramp=0.010):
    m=np.zeros(N); t=np.arange(N)/SR
    for j,((_,a,b),gw) in enumerate(zip(words,g)):
        if not eligible(V3W[j]['i'],a,b): continue
        gw=float(np.clip(gw,0,BMAX))
        if gw<=0: continue
        sl=slice(max(0,int((a-ramp)*SR)),min(N,int((b+ramp)*SR)))
        e=np.clip(np.minimum((t[sl]-(a-ramp))/(2*ramp),((b+ramp)-t[sl])/(2*ramp)),0,1)
        m[sl]=np.maximum(m[sl],gw*e)
    return m
src=wmask(glo)*xlo+wmask(ghi)*xhi
c=postcopy(src,h,D)
n=1024; hop=256
fq,t,X=stft(x,SR,nperseg=n,noverlap=n-hop,window='hann'); _,_,C=stft(c,SR,nperseg=n,noverlap=n-hop,window='hann')
PX=np.maximum(uniform_filter(np.abs(X)**2,(3,3)),0); PC=np.maximum(uniform_filter(np.abs(C)**2,(3,3)),0)+1e-20
Wb=np.clip((10*np.log10(np.maximum(PX/PC,1e-20))-R0)/6,0,1)
fb=(fq>=300)&(fq<6000); rr=10*np.log10(np.maximum(uniform_filter1d(PX[fb].sum(0),3),1e-20)/uniform_filter1d(PC[fb].sum(0),3))
Wt=np.clip((rr-TR0)/6,0,1)
_,sub=istft(Wb*Wt[None,:]*C,SR,nperseg=n,noverlap=n-hop,window='hann'); sub=np.pad(sub[:N],(0,max(0,N-len(sub))))
np.save(F+os.environ.get('SUBOUT','sub2.npy'),sub)
el=[j for j,(_,a,b) in enumerate(words) if eligible(V3W[j]['i'],a,b)]
json.dump({'h_energy_db':float(10*np.log10(np.sum(h**2))),'eligible':el,'glo':[round(float(v),3) for v in glo],'ghi':[round(float(v),3) for v in ghi]},open(F+'cancel2_params.json','w'))
print('eligible words',len(el),'gain lo median %.2f hi %.2f'%(np.median(glo[el]),np.median(ghi[el])))
y=x-sub; sf.write(F+'X0c.wav',y,SR,subtype='FLOAT'); sf.write(F+'X0.wav',x,SR,subtype='FLOAT')
nz=np.nonzero(np.abs(sub)>2**-24)[0]; print('sub support %.3f-%.3f'%(nz[0]/SR,nz[-1]/SR))
