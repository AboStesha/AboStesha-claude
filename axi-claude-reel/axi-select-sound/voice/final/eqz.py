# per-frequency enhanced/original EQ for the borrowed treble (vowel and sibilant frames), estimated OUTSIDE the zone where both takes are aligned (lag 0)
import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
from scipy.signal import stft
from scipy.ndimage import uniform_filter1d
v=rd('X0s3.wav')[:4120000]; p=rd('dry')[:4120000]
NF=2048; HOP=512
f,t,Zv=stft(v,fs=SR,nperseg=NF,noverlap=NF-HOP); _,_,Zp=stft(p,fs=SR,nperseg=NF,noverlap=NF-HOP)
Pv=np.abs(Zv)**2; Pp=np.abs(Zp)**2; T=t
def band(P,lo,hi): m=(f>=lo)&(f<hi); return db(P[m].sum(0))
tv=band(Pv,150,8000); tp=band(Pp,150,8000); tv-=np.percentile(tv,90); tp-=np.percentile(tp,90)
Hv=band(Pv,4000,12000)-band(Pv,1000,3500); Hp=band(Pp,4000,12000)-band(Pp,1000,3500)
ok=(tv>-28)&(tp>-28)&(np.abs(Hv-Hp)<8)
old=json.load(open('/home/user/rr/voice3/ver/spansF.json'))
EX=[(0,2.3),(3.5,16.5),(18.4,45.4),(76.3,78.4),(79.1,79.5),(84.0,90)]+[(a-0.1,b+0.1) for a,b in old]
for a,b in EX: ok&=~((T>=a)&(T<=b))
mid=(band(Pv,1000,3500)-band(Pp,1000,3500))
out={}
for name,sel in [('vow',ok&(Hp<-15)),('sib',ok&(Hp>-3))]:
    Dd=db(Pv[:,sel])-db(Pp[:,sel])-mid[sel][None,:]
    G=uniform_filter1d(np.median(Dd,1),25); out[name]=G
    print(name,'frames',int(sel.sum()),' '.join('%dk:%.1f'%(q/1000,G[np.argmin(abs(f-q))]) for q in [3000,4000,5000,6000,7000,8000,9000,10000,11000,12000,14000]))
np.save('eqz_f.npy',f); np.save('eqz_vow.npy',out['vow']); np.save('eqz_sib.npy',out['sib'])
o=np.load('/home/user/rr/voice3/ver/eq2_vow.npy'); s=np.load('/home/user/rr/voice3/ver/eq2_sib.npy')
print('old eq2 vow',' '.join('%dk:%.1f'%(q/1000,o[np.argmin(abs(f-q))]) for q in [3000,5000,7000,9000,11000]),' sib',' '.join('%dk:%.1f'%(q/1000,s[np.argmin(abs(f-q))]) for q in [3000,5000,7000,9000,11000]))
