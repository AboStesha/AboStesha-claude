# Reproducible build of the de-echoed VO for video 2.
#   input : /home/user/rr/axi-select-ch2/audio/vo/vo2_patched.wav  (48 kHz mono, VO time)
#   output: OUT (default cand/full_final.wav, float32) ; pass --write24 PATH to also write a 24-bit PCM copy
# Method: the voice in VO 3.78-16.04 s and 18.70-42.13 s carries a discrete copy of itself that LEADS the voice by 85.3 ms
#   (about -13 dB in 500-4000 Hz). We estimate that copy path h (4 ms FIR around 85.3 ms, least squares on speech frames),
#   predict the copy of every word from the voice itself, weight it per word and per band (<3 kHz / >3 kHz) by the copy gain
#   measured on that word, and subtract it in the STFT domain only where the voice is present (pauses untouched).
import sys, os, json; sys.path.insert(0,'/home/user/rr/sound3/voice/scripts')
import numpy as np, soundfile as sf, met
from echo_est import est_joint
from tfec import precopy
from echocancel import mask
from scipy.signal import butter, sosfiltfilt
import tfec7
SR=48000; V='/home/user/rr/sound3/voice'
out=sys.argv[1] if len(sys.argv)>1 and not sys.argv[1].startswith('--') else V+'/cand/full_final.wav'
x=met.full_input(); R=[(3.78,16.04),(18.70,42.13)]
D=int(round(0.0835*SR)); L=192
h0=est_joint(x,R,D,L)                                   # 1) unweighted joint LS (all of R)
c0=precopy(x,h0,D)*mask(len(x),R)
sos=butter(4,[300,6000],'bandpass',fs=SR,output='sos'); xb=sosfiltfilt(sos,x); cb=sosfiltfilt(sos,c0)
k=np.ones(480)/480; rho=10*np.log10(np.maximum(np.convolve(xb**2,k,'same'),1e-20)/(np.convolve(cb**2,k,'same')+1e-20))
w=np.zeros(len(x))
for a,b in R: w[int(a*SR):int(b*SR)]=1
w*=(rho>3)
os.environ['LOAD']='1.01'
import wls; h=wls.wls(x,w,D,L)                          # 2) weighted LS on speech frames only (pauses excluded)
os.environ['BMAX']='1.5'
y,glo,ghi=tfec7.run(x,h,3000.0,-6.0,-10.0)              # 3) per-word/per-band gated subtraction
assert len(y)==len(x)
sf.write(out,y.astype(np.float32),SR,subtype='FLOAT')
np.save(V+'/logs/h_final.npy',h)
json.dump({'h_energy_db':float(10*np.log10(np.sum(h**2))),'peak_lag_ms':float((D+np.argmax(np.abs(h)))/SR*1000),
           'gains_lo':[round(float(v),3) for v in glo],'gains_hi':[round(float(v),3) for v in ghi]},open(V+'/logs/final_params.json','w'))
if '--write24' in sys.argv:
    p=sys.argv[sys.argv.index('--write24')+1]; sf.write(p,y,SR,subtype='PCM_24'); print('wrote',p)
print('ok',out)
