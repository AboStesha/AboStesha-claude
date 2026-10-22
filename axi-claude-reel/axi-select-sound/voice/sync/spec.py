# spec.py t0 t1 out.jpg src1,src2,... [fmax]  src = name|path[@shift_samples] (shift>0 advances: shows x[t+shift])
import sys, os
from slib import *
from scipy.signal import stft
from PIL import Image, ImageDraw
t0,t1=float(sys.argv[1]),float(sys.argv[2]); out=sys.argv[3]
srcs=sys.argv[4].split(","); fmax=float(sys.argv[5]) if len(sys.argv)>5 else 8000
Wd=int(os.environ.get("WD","1000")); Hp=int(os.environ.get("HP","150"))
nps=int(os.environ.get("NPS","1024")); hop=int(os.environ.get("HOPS","48"))
panels=[]; cache={}
for k in srcs:
    nm,sh=(k.split("@")+["0"])[:2]; sh=int(sh)
    if nm not in cache: cache[nm]=load(nm) if nm in P else loadp(nm)
    x=cache[nm]
    a=int(t0*SR)-nps+sh; b=int(t1*SR)+nps+sh
    seg=x[max(a,0):b]
    if a<0: seg=np.concatenate([np.zeros(-a),seg])
    f,t,Z=stft(seg,fs=SR,nperseg=nps,noverlap=nps-hop)
    S=20*np.log10(np.abs(Z)+1e-9); m=f<=fmax; S=S[m][::-1]
    S=S[:,(t>=nps/SR)&(t<=(len(seg)-nps)/SR)]
    hi=float(os.environ.get('SHI','-10')); lo=hi-float(os.environ.get('SDR','75'))
    im=np.clip((S-lo)/(hi-lo),0,1)
    rgb=(np.stack([im**1.0,im**2.0,im**4.0],2)*255).astype(np.uint8)
    I=Image.fromarray(rgb).resize((Wd,Hp)); d=ImageDraw.Draw(I); d.text((4,2),os.path.basename(k),fill=(255,255,255))
    step=0.05 if t1-t0<=1.6 else 0.1
    for g in np.arange(np.ceil(t0/step)*step,t1,step):
        X=int((g-t0)/(t1-t0)*Wd); big=abs(g*10-round(g*10))<1e-6
        d.line([(X,0),(X,8 if big else 4)],fill=(0,255,0))
        if big: d.text((X+1,Hp-12),"%.1f"%g,fill=(0,255,0))
    panels.append(I)
W=Image.new("RGB",(Wd,(Hp+2)*len(panels)))
for i,p in enumerate(panels): W.paste(p,(0,(Hp+2)*i))
W.save(out,quality=75); print(out, os.path.getsize(out))
