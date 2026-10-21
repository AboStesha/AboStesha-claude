import numpy as np, soundfile as sf
from scipy.signal import stft, istft, firwin, fftconvolve, butter, sosfiltfilt
W2='/home/user/rr/axi-select-ch2'; V=W2+'/work/vofix2'; SR=48000
EX0=33.0   # excerpt start VO s
def load_raw():
    x,_=sf.read(W2+'/inputs/vo/vo2_raw.wav',always_2d=True); return x.mean(1)
def load_clean():
    x,_=sf.read(W2+'/audio/vo/vo2_clean.wav'); return x
def L(tag):
    x,_=sf.read(f'{V}/cand/{tag}.wav'); return x
def save(x,tag): sf.write(f'{V}/cand/{tag}.wav',np.asarray(x,np.float32),SR,subtype='FLOAT')
def lp(x,fc,ntap=1023): h=firwin(ntap,fc,fs=SR); return fftconvolve(x,h,'same')
def hp(x,fc,ntap=1023): return x-lp(x,fc,ntap)
def bp(x,f1,f2,ntap=1023): return lp(x,f2,ntap)-lp(x,f1,ntap)
def hpf55(x): return sosfiltfilt(butter(2,55,'highpass',fs=SR,output='sos'),x)
def S(x,n=2048,ov=1536): return stft(x,SR,nperseg=n,noverlap=ov)
def IS(Z,N,n=2048,ov=1536): return istft(Z,SR,nperseg=n,noverlap=ov)[1][:N]
def db(x): return 10*np.log10(np.maximum(x,1e-20))
def bandE(x,t0,t1,f0,f1,off=0.0,n=1024):
    """mean power (dB) of x in VO window [t0,t1) and band [f0,f1); x starts at VO time off"""
    s0=int(round((t0-off)*SR))-n//2; s1=int(round((t1-off)*SR))+n//2; seg=x[max(0,s0):s1]
    f,t,Z=stft(seg,SR,nperseg=n,noverlap=n-120,boundary=None,padded=False); P=np.abs(Z)**2
    fi=(f>=f0)&(f<f1); return float(db(P[fi].sum(0).mean()))
def spec_img(x,off,t0,t1,path,fmax=16000,dbr=(-110,-20),hpx=1200,vpx=360,label=None):
    from PIL import Image, ImageDraw
    s0=int((t0-off)*SR); s1=int((t1-off)*SR); seg=x[s0:s1]
    n=1024; hop=max(1,(s1-s0)//hpx)
    f,t,Z=stft(seg,SR,nperseg=n,noverlap=n-hop,boundary=None,padded=False)
    P=db(np.abs(Z)**2/ (n/2)); fi=f<=fmax; P=P[fi][::-1]
    a=np.clip((P-dbr[0])/(dbr[1]-dbr[0]),0,1)
    # simple colormap (black-blue-red-yellow-white)
    cm=np.array([[0,0,0],[20,0,90],[150,0,140],[240,60,30],[255,200,0],[255,255,255]],float)
    xi=a*(len(cm)-1); i0=np.floor(xi).astype(int); i1=np.minimum(i0+1,len(cm)-1); fr=(xi-i0)[...,None]
    rgb=(cm[i0]*(1-fr)+cm[i1]*fr).astype(np.uint8)
    im=Image.fromarray(rgb).resize((hpx,vpx),Image.BILINEAR); d=ImageDraw.Draw(im)
    for k in range(0,int(fmax)+1,2000):
        y=int(vpx*(1-k/fmax)); d.line([(0,y),(8,y)],fill=(255,255,255)); d.text((10,max(0,y-10)),f'{k//1000}k',fill=(255,255,255))
    tt=np.ceil(t0*4)/4
    while tt<t1:
        xx=int(hpx*(tt-t0)/(t1-t0)); d.line([(xx,vpx-8),(xx,vpx)],fill=(255,255,255))
        if abs(tt-round(tt))<1e-6 or abs(tt*2-round(tt*2))<1e-6: d.text((xx+2,vpx-20),f'{tt:.2f}',fill=(255,255,255))
        tt+=0.25
    if label: d.text((hpx//2-100,4),label,fill=(255,255,0))
    return im
def stack(ims,path,q=85):
    from PIL import Image
    w=max(i.width for i in ims); h=sum(i.height for i in ims)+4*(len(ims)-1); out=Image.new('RGB',(w,h),(60,60,60)); y=0
    for i in ims: out.paste(i,(0,y)); y+=i.height+4
    out.save(path,quality=q)
