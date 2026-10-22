# pitch agreement with the clean original take advanced 85 ms (the same words), zone only: does the edit move the pitch track toward the original?
import sys; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
import librosa
from scipy.signal import resample_poly
def f0(y):
    y16=resample_poly(y[int(3.6*SR):int(45.3*SR)],1,3); fr,vv,_=librosa.pyin(y16,fmin=65,fmax=400,sr=16000,frame_length=1024,hop_length=160); return fr,vv
fa,va=f0(rd('dryA.wav'))
for k in sys.argv[1:]:
    fx,vx=f0(rd(k)); n=min(len(fx),len(fa)); b=vx[:n]&va[:n]; c=1200*np.log2(fx[:n][b]/fa[:n][b])
    print(k.ljust(10),'frames voiced in both',int(b.sum()),'median |cents| %.1f, frames within 50 cents of the original: %.1f%%'%(np.median(np.abs(c)),np.mean(np.abs(c)<50)*100))
