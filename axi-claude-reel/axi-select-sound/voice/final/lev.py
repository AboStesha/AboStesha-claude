# reproduce /home/user/rr/voice3/ver/level.py (GMAX=12) on v3p2 and save the exact per-sample gain G (incl. the loudness trim)
import sys,json,subprocess,re,os; sys.path.insert(0,'/home/user/rr/voice3/ver'); from vv import *
from scipy.signal import lfilter, butter, sosfiltfilt
from scipy.ndimage import uniform_filter1d
SRC=sys.argv[1]; OUT=sys.argv[2]; WIN=1.2; GMAX=12.0
x=rd(SRC); n=len(x); p=rd('pat')[:n]
b1=[1.53512485958697,-2.69169618940638,1.19839281085285]; a1=[1,-1.69065929318241,0.73248077421585]
b2=[1.0,-2.0,1.0]; a2=[1,-1.99004745483398,0.99007225036621]
def kw(z): return lfilter(b2,a2,lfilter(b1,a1,z))
H=480
def pw(z): z=kw(z); return (z[:n//H*H].reshape(-1,H)**2).mean(1)
Px=pw(x); Pp=pw(p)
sos=butter(4,[120,7000],'bandpass',fs=SR,output='sos')
def lv(z): z=sosfiltfilt(sos,z); L=db((z[:n//H*H].reshape(-1,H)**2).mean(1)); return L-np.percentile(L[L>-90],90)
m=((lv(p)>-25)&(lv(x)>-25)).astype(float)
w=int(WIN*100)|1
def sm(P): return db(uniform_filter1d(P*m,w)/np.maximum(uniform_filter1d(m,w),1e-6))
g=sm(Pp)-sm(Px); act=uniform_filter1d(m,w)>0.15
g0=np.median(g[act]); g=g-g0
idx=np.arange(len(g)); g=np.interp(idx,idx[act],g[act])
g=np.clip(g,-8,GMAX)
g=uniform_filter1d(uniform_filter1d(g,31),31)
gs=np.interp(np.arange(n),idx*H+H/2,g)
y=x*10**(gs/20)
tmp=OUT+'.tmp.wav'; sf.write(tmp,y,SR,subtype='FLOAT')
def lufs(path):
    r=subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',path,'-af','ebur128=peak=true','-f','null','-'],capture_output=True,text=True).stderr.split('Summary:')[1]
    return float(re.search(r'I:\s+(-?[\d.]+) LUFS',r).group(1))
Iref=lufs(P['pat']); I0=lufs(tmp); os.remove(tmp)
G=10**(gs/20)*10**((Iref-I0)/20)
y=x*10**(gs/20); y=y*10**((Iref-I0)/20)
sf.write(OUT,y,SR,subtype='PCM_24'); np.save(OUT.replace('.wav','_gs.npy'),gs); open(OUT.replace('.wav','_trim.txt'),'w').write(repr(Iref-I0))
print('trim',Iref-I0,'G range dB',20*np.log10(G.min()),20*np.log10(G.max()))
