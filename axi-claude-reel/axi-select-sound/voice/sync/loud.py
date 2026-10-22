# ITU-R BS.1770-4 integrated loudness (48 kHz coefficients) + true peak (4x oversampled) + summary of ffmpeg ebur128
import sys, numpy as np, soundfile as sf, subprocess, re
from scipy.signal import lfilter, resample_poly
b1=[1.53512485958697,-2.69169618940638,1.19839281085285]; a1=[1.0,-1.69065929318241,0.73248077421585]
b2=[1.0,-2.0,1.0]; a2=[1.0,-1.99004745483398,0.99007225036621]
for p in sys.argv[1:]:
    x,sr=sf.read(p); y=lfilter(b2,a2,lfilter(b1,a1,x))
    blk=int(0.4*sr); hop=int(0.1*sr)
    z=np.array([np.mean(y[i:i+blk]**2) for i in range(0,len(y)-blk+1,hop)])
    L=-0.691+10*np.log10(z+1e-20); g=z[L>-70]; Lr=-0.691+10*np.log10(g.mean())-10
    I=-0.691+10*np.log10(z[(L>-70)&(L>Lr)].mean())
    tp=20*np.log10(np.abs(resample_poly(x,4,1)).max())
    ff=subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',p,'-af','ebur128=peak=true','-f','null','-'],capture_output=True,text=True).stderr
    s=ff[ff.rfind('Summary'):]; Ifm=re.search(r'I:\s+(-?[\d.]+) LUFS',s).group(1); TP=re.search(r'Peak:\s+(-?[\d.]+) dBFS',s).group(1)
    print("%s  I %.2f LUFS  truepeak %.2f dBTP  sample-peak %.2f dBFS | ffmpeg I %s LUFS TP %s dBTP"%(p.split('/')[-1],I,tp,20*np.log10(np.abs(x).max()),Ifm,TP))
