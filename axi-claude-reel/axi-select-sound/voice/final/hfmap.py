# HF/mid balance of the enhanced voice vs the original take (aligned: dry advanced 85 ms for E-dominant words, lag 0 for L words / outside the zone)
import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
from scipy.signal import stft
from scipy.ndimage import uniform_filter1d, median_filter
X=rd(sys.argv[1]); d=rd('dry'); dA=np.zeros(N); dA[:-4094]=d[4094:]; e=rd('enh')
dom=json.load(open('wdom.json'))
def S(x): f,t,Z=stft(x[:4120000],fs=SR,nperseg=1024,noverlap=1024-480,boundary=None,padded=False); return f,t+0.0107,np.abs(Z)**2
f,T,Px=S(X); _,_,Pd=S(d); _,_,Pa=S(dA); _,_,Pe=S(e)
def band(P,lo,hi): m=(f>=lo)&(f<hi); return db(uniform_filter1d(P[m].sum(0),3))
def Hh(P): return band(P,4000,12000)-band(P,1000,3500)
tot=band(Px,150,8000); tot-=np.percentile(tot,90)
# lag class per frame from the word dominance map
cl=np.zeros(len(T),int)   # 0 = lag 0, 1 = E (advanced)
for q in dom:
    if q['dom']=='E' and inZ(q['s']): cl[(T>=q['s']-0.02)&(T<=q['e']+0.02)]=1
Hr=np.where(cl==1,Hh(Pa),Hh(Pd)); tr=np.where(cl==1,band(Pa,150,8000),band(Pd,150,8000)); tr-=np.percentile(tr,90)
sp=(tot>-30)&(tr>-28)
dv=median_filter(Hh(Px)-Hr,5); de=median_filter(Hh(Px)-Hh(Pe),5)
zf=np.zeros(len(T),bool)
for a,b in ZONE: zf|=(T>=a)&(T<=b)
for nm,m in [('zone E frames',sp&zf&(cl==1)),('outside zone',sp&~zf)]:
    print(nm,'n',int(m.sum()),'HF/mid vs original: median %.1f dB, p25 %.1f, p10 %.1f | vs enhanced input: median %.1f'%(np.median(dv[m]),np.percentile(dv[m],25),np.percentile(dv[m],10),np.median(de[m])))
# per-band level difference (vs aligned original), speech frames
for nm,m in [('zone E',sp&zf&(cl==1)),('outside',sp&~zf)]:
    R=np.where(cl[None,:]==1,Pa,Pd)
    print(nm,' '.join('%d-%d:%.1f'%(lo,hi,db(Px[(f>=lo)&(f<hi)][:,m].sum())-db(R[(f>=lo)&(f<hi)][:,m].sum())-(db(Px[(f>=1000)&(f<3500)][:,m].sum())-db(R[(f>=1000)&(f<3500)][:,m].sum()))) for lo,hi in [(100,300),(300,1000),(3500,5000),(5000,7000),(7000,10000),(10000,14000)]))
np.save('hfmap_dv.npy',dv); np.save('hfmap_de.npy',de); np.save('hfmap_sp.npy',sp); np.save('hfmap_T.npy',T); np.save('hfmap_cl.npy',cl)
