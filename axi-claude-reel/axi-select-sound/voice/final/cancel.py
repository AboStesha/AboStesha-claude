# stage-1 ghost canceller (make_dry.py + tfec7.py maths) run on the client's enhanced voice (unpatched, levelled exactly as in v3)
# outputs the SUBTRACTION signal only (sub.npy) so it can be applied as a delta; plus h and per-word gains
import sys, os, json; sys.path.insert(0,'/home/user/rr/sound3/voice/scripts'); sys.path.insert(0,'/home/user/rr/sound3/voice/final')
import numpy as np, soundfile as sf
from glib import rd as grd, SR, N
from echo_est import est_joint
from tfec import precopy
from echocancel import mask
from scipy.signal import butter, sosfiltfilt, stft, istft
from scipy.ndimage import uniform_filter, uniform_filter1d
import tfec7
gs=np.load('/home/user/rr/sound3/voice/final/rep_v3_gs.npy'); trim=float(open('/home/user/rr/sound3/voice/final/rep_v3_trim.txt').read())
e=grd('eng'); x=e*10**(gs/20); x=x*10**(trim/20)
R=[(3.78,16.04),(18.70,42.13)]; D=int(round(0.0835*SR)); L=192
h0=est_joint(x,R,D,L)
c0=precopy(x,h0,D)*mask(len(x),R)
sos=butter(4,[300,6000],'bandpass',fs=SR,output='sos'); xb=sosfiltfilt(sos,x); cb=sosfiltfilt(sos,c0)
k=np.ones(480)/480; rho=10*np.log10(np.maximum(np.convolve(xb**2,k,'same'),1e-20)/(np.convolve(cb**2,k,'same')+1e-20))
w=np.zeros(len(x))
for a,b in R: w[int(a*SR):int(b*SR)]=1
w*=(rho>3)
os.environ['LOAD']='1.01'
import wls; h=wls.wls(x,w,D,L)
np.save('/home/user/rr/sound3/voice/final/h_v3.npy',h)
hold=np.load('/home/user/rr/sound3/voice/logs/h_final.npy')
f=np.fft.rfftfreq(8192,1/SR); Hf=np.fft.rfft(h,8192); Ho=np.fft.rfft(hold,8192)
print('h_v3: E %.2f dB, peak lag %.3f ms, corr with stage-1 h %.3f'%(10*np.log10(np.sum(h**2)),(D+np.argmax(np.abs(h)))/SR*1000,np.dot(h,hold)/np.sqrt(np.dot(h,h)*np.dot(hold,hold))))
print('|H| v3 / old per band',[(a,b,round(10*np.log10(np.mean(np.abs(Hf[(f>=a)&(f<b)])**2)),1),round(10*np.log10(np.mean(np.abs(Ho[(f>=a)&(f<b)])**2)),1)) for a,b in [(80,300),(300,1000),(1000,2000),(2000,4000),(4000,8000),(8000,16000)]])
# tfec7.run with BMAX 1.5, split 3000, TR0 -6, R0 -10, but return the subtraction signal
os.environ['BMAX']='1.5'
split=3000.0; TR0=-6.0; R0=-10.0; n=1024; hop=256
xlo=tfec7.lp(x,split); xhi=x-xlo
glo,ghi=tfec7.word_gains(x,h,[(0,split),(split,24000)])
src=tfec7.word_mask(len(x),glo)*xlo+tfec7.word_mask(len(x),ghi)*xhi
c=precopy(src,h,D)
fq,t,X=stft(x,SR,nperseg=n,noverlap=n-hop,window='hann'); _,_,C=stft(c,SR,nperseg=n,noverlap=n-hop,window='hann')
PX=np.maximum(uniform_filter(np.abs(X)**2,(3,3)),0); PC=np.maximum(uniform_filter(np.abs(C)**2,(3,3)),0)+1e-20
Wb=np.clip((10*np.log10(np.maximum(PX/PC,1e-20))-R0)/6,0,1)
fb=(fq>=300)&(fq<6000); rr=10*np.log10(np.maximum(uniform_filter1d(PX[fb].sum(0),3),1e-20)/uniform_filter1d(PC[fb].sum(0),3))
Wt=np.clip((rr-TR0)/6,0,1)
Dm=Wb*Wt[None,:]*C
_,sub=istft(Dm,SR,nperseg=n,noverlap=n-hop,window='hann'); sub=sub[:len(x)]
if len(sub)<len(x): sub=np.pad(sub,(0,len(x)-len(sub)))
np.save('/home/user/rr/sound3/voice/final/sub.npy',sub)
W=tfec7.WORDS
json.dump({'glo':[round(float(v),3) for v in glo],'ghi':[round(float(v),3) for v in ghi],'words':[[w_,a,b] for w_,a,b in W]},open('/home/user/rr/sound3/voice/final/cancel_gains.json','w'),ensure_ascii=False)
inr=[i for i,(w_,a,b) in enumerate(W) if any(A<=a and b<=B for A,B in tfec7.MREG)]
print('words in R',len(inr),'gain lo med %.2f hi med %.2f'%(np.median(np.array(glo)[inr]),np.median(np.array(ghi)[inr])))
nzf=np.nonzero(np.abs(sub)>2**-24)[0]; print('sub support %.3f-%.3f s, rms rel x in R %.1f dB'%(nzf[0]/SR,nzf[-1]/SR,10*np.log10(np.mean(sub[int(3.7*SR):int(42.2*SR)]**2)/np.mean(x[int(3.7*SR):int(42.2*SR)]**2))))
