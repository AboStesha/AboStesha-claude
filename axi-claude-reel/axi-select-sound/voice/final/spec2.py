# stacked spectrograms: files x (t0,t1); usage spec2.py out.jpg t0 t1 file1 file2 ...
import sys; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
from scipy.signal import stft
from PIL import Image, ImageDraw
out=sys.argv[1]; t0=float(sys.argv[2]); t1=float(sys.argv[3]); fs=sys.argv[4:]
W=1400; Hh=200; imgs=[]
for k in fs:
    x=rd(k)[int(t0*SR):int(t1*SR)]
    hop=max(1,int(len(x)/W)); f,t,Z=stft(x,SR,nperseg=1024,noverlap=1024-hop,boundary=None,padded=False)
    S=20*np.log10(np.abs(Z)+1e-9); S=S[f<=12000][::-1]
    S=np.clip((S+115)/90,0,1); im=Image.fromarray((S*255).astype(np.uint8)).resize((W,Hh))
    im=im.convert('RGB'); d=ImageDraw.Draw(im)
    for tt in np.arange(np.ceil(t0*10)/10,t1,0.1):
        X=int((tt-t0)/(t1-t0)*W); d.line([(X,0),(X,6 if abs(tt*2-round(tt*2))>1e-6 else 14)],fill=(255,80,80))
        if abs(tt*2-round(tt*2))<1e-6: d.text((X+2,2),'%.1f'%tt,fill=(255,255,0))
    d.text((5,Hh-14),k.split('/')[-1],fill=(0,255,0)); imgs.append(im)
H=Image.new('RGB',(W,Hh*len(imgs)))
for i,im in enumerate(imgs): H.paste(im,(0,i*Hh))
H.save(out,quality=80); print(out)
