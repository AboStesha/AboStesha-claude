# zoom spectrograms (0-6 kHz), ticks every 20 ms, labels every 100 ms; usage spec3.py out t0 t1 files...
import sys; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
from scipy.signal import stft
from PIL import Image, ImageDraw
out=sys.argv[1]; t0=float(sys.argv[2]); t1=float(sys.argv[3]); fs=sys.argv[4:]
FM=float(__import__('os').environ.get('FMAX','6000'))
W=1400; Hh=170; imgs=[]
for k in fs:
    x=rd(k)[int(t0*SR):int(t1*SR)]
    hop=max(1,int(len(x)/W)); f,t,Z=stft(x,SR,nperseg=768,noverlap=768-hop,boundary=None,padded=False)
    S=20*np.log10(np.abs(Z)+1e-9); S=S[f<=FM][::-1]
    S=np.clip((S+110)/85,0,1); im=Image.fromarray((S*255).astype(np.uint8)).resize((W,Hh)).convert('RGB'); d=ImageDraw.Draw(im)
    for j,tt in enumerate(np.arange(np.ceil(t0*50)/50,t1,0.02)):
        X=int((tt-t0)/(t1-t0)*W); big=abs(tt*10-round(tt*10))<1e-6
        d.line([(X,0),(X,14 if big else 5)],fill=(255,60,60))
        if big: d.text((X+2,2),'%.1f'%tt,fill=(255,255,0))
    d.text((5,Hh-14),k.split('/')[-1],fill=(0,255,0)); imgs.append(im)
H=Image.new('RGB',(W,Hh*len(imgs)))
for i,im in enumerate(imgs): H.paste(im,(0,i*Hh))
H.save(out,quality=78); print(out)
