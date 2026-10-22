# zone evaluation: exposed tails re phrase peak, word level change vs a reference file, band change, AC
import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
from scipy.signal import stft
REF=sys.argv[1]; files=sys.argv[2:]
PZ=json.load(open(A+'/work/vo_pauses_vo.json')); dom=json.load(open('/home/user/rr/sound3/voice/final/wdom.json'))
def env(x,w=10): k=np.ones(int(w*48))/int(w*48); return db(np.convolve(x**2,k,'same')[::48])
d=rd('dry'); ed=env(bp(d,300,6000),5)
TA=[]
for a,b in PZ:
    if b-a<0.12 or not inZ(a-0.05): continue
    i0=int((a-0.25)*1000); ia=int((a+0.1)*1000); L=ed[i0:int(a*1000)].max(); idx=np.where(ed[i0:ia]>=L-20)[0]; TA.append((i0+idx[-1])/1000)
r=rd(REF); rb=bp(r,300,6000)
f,t,Zr=stft(r,SR,nperseg=2048,noverlap=2048-480); Pr=np.abs(Zr)**2
zf=np.zeros(len(t),bool)
for a,b in ZONE: zf|=(t>=a)&(t<=b)
spf=zf&(db(Pr.sum(0))>np.percentile(db(Pr.sum(0))[zf],40))
BE=[60,150,300,600,1200,2400,4800,9600,16000]
for k in [REF]+files:
    x=rd(k); xb=bp(x,300,6000); e=env(xb)
    tails=[]
    for tA in TA:
        pk=e[int((tA-0.4)*1000):int(tA*1000)].max(); tE=tA-0.0853
        tails.append(db(np.mean(10**(e[int((tE+0.015)*1000):int((tA-0.005)*1000)]/10)))-pk)
    wl=[]
    for q in dom:
        if q['dom']!='E' or not inZ(q['s']) or q['e']-q['s']<0.08: continue
        i0,i1=int(q['s']*SR),int(q['e']*SR); wl.append(db(np.mean(xb[i0:i1]**2)/np.mean(rb[i0:i1]**2)))
    _,_,Zx=stft(x,SR,nperseg=2048,noverlap=2048-480); Px=np.abs(Zx)**2
    bands=[db(Px[(f>=lo)&(f<hi)][:,spf].sum())-db(Pr[(f>=lo)&(f<hi)][:,spf].sum()) for lo,hi in zip(BE[:-1],BE[1:])]
    ac=ac_zone(x,((500,1500),(1500,4000)))
    print(k.split('/')[-1].ljust(10),'tails re peak: med %.1f p75 %.1f max %.1f | E-words dB vs ref: med %.2f p10 %.2f min %.2f | bands %s | AC %s'%(
        np.median(tails),np.percentile(tails,75),np.max(tails),np.median(wl),np.percentile(wl,10),np.min(wl),' '.join('%.2f'%b for b in bands),
        ' '.join('%.3f'%v for v in [ac['500-1500']['3.7-16.25'],ac['500-1500']['18.55-45.1'],ac['1500-4000']['3.7-16.25'],ac['1500-4000']['18.55-45.1']])),flush=True)
