# reference-based suppression of the residual trailing rendition (incoherent part): the late copy sits exactly at the ORIGINAL take's timing,
# so the de-ghosted original take (vo2_dry, lag 0) is its magnitude template. Spectral subtraction with floor, zone only.
import sys,os,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
from scipy.signal import stft, istft
from scipy.ndimage import uniform_filter, uniform_filter1d
F='/home/user/rr/sound3/voice/final/'
IN=sys.argv[1]; OUT=sys.argv[2]
KAP=float(os.environ.get('KAP','1.0')); GMIN=float(os.environ.get('GMIN','-14')); GMIN_T=float(os.environ.get('GMINT','-30')); NF=int(os.environ.get('NF','1024')); HOP=256
x=rd(IN); d=rd('dry'); dA=np.zeros(N); dA[:-4094]=d[4094:]
f,t,X=stft(x,SR,nperseg=NF,noverlap=NF-HOP); _,_,Dl=stft(d,SR,nperseg=NF,noverlap=NF-HOP); _,_,De=stft(dA,SR,nperseg=NF,noverlap=NF-HOP)
PX=np.abs(X)**2; PL=np.abs(Dl)**2; PE=np.abs(De)**2
# zone frame weight (E-dominant stretches): zone minus the L-dominant words, 40 ms ramps
wz=np.zeros(len(t))
for a,b in ZONE: wz=np.maximum(wz,np.clip((t-(a-0.02))/0.04,0,1)*np.clip(((b+0.1)-t)/0.04,0,1))
dom=json.load(open(F+'wdom.json'))
for r in dom:
    if r['dom']=='L' and inZ(r['s']): wz*=1-np.clip(np.minimum((t-(r['s']-0.04))/0.03,((r['e']+0.04)-t)/0.03),0,1)
# calibration of the template gain beta(f) on exposed tails (copy alone): zone pauses, window [tE+15ms, tA-10ms]
PZ=json.load(open(A+'/work/vo_pauses_vo.json'))
def envd(z,w=5): k=np.ones(int(w*48))/int(w*48); return db(np.convolve(z**2,k,'same')[::48])
ed=envd(bp(d,300,6000)); tl=np.zeros(len(t),bool)
for a,b in PZ:
    if b-a<0.12 or not inZ(a-0.05): continue
    i0=int((a-0.25)*1000); ia=int((a+0.1)*1000); L=ed[i0:int(a*1000)].max(); idx=np.where(ed[i0:ia]>=L-20)[0]; tA=(i0+idx[-1])/1000; tE=tA-0.0853
    tl|=(t>=tE+0.015)&(t<=tA-0.010)
beta=np.median(PX[:,tl]/(PL[:,tl]+1e-20),1)
beta=10**(uniform_filter1d(np.log10(beta+1e-20),9)) if True else beta
fb=lambda lo,hi:(f>=lo)&(f<hi)
print('tail frames',int(tl.sum()),'beta dB per band:',' '.join('%d-%d:%.1f'%(lo,hi,10*np.log10(np.mean(beta[fb(lo,hi)]))) for lo,hi in [(100,300),(300,1000),(1000,2000),(2000,4000),(4000,8000),(8000,16000)]))
# also a reference: E rendition template gain alpha(f) on E-dominant speech frames (zone, not tails)
sp=(wz>0.99)&~tl&(db(PX.sum(0))>np.percentile(db(PX.sum(0)),60))
alpha=np.median(PX[:,sp]/(PE[:,sp]+1e-20),1); alpha=10**(uniform_filter1d(np.log10(alpha+1e-20),9))
print('alpha dB per band:',' '.join('%d-%d:%.1f'%(lo,hi,10*np.log10(np.mean(alpha[fb(lo,hi)]))) for lo,hi in [(100,300),(300,1000),(1000,2000),(2000,4000),(4000,8000),(8000,16000)]))
np.save(F+'supp_beta.npy',beta); np.save(F+'supp_alpha.npy',alpha)
# smoothed powers; copy estimate; spectral subtraction gain with floor (lower floor where the E template is weak = exposed copy)
PXs=np.maximum(uniform_filter(PX,(3,3)),0); PLs=np.maximum(uniform_filter(PL,(3,3)),0)*beta[:,None]; PEs=np.maximum(uniform_filter(PE,(3,3)),0)*alpha[:,None]
expo=np.clip((10*np.log10((PLs+1e-20)/(PEs+1e-20))-0)/6,0,1)          # 1 where the copy template exceeds the E template by >6 dB
KAPT=float(os.environ.get('KAPT','2.5')); kap=KAP+(KAPT-KAP)*expo
G2=np.maximum(PXs-kap*PLs,0)/(PXs+1e-20)
if os.environ.get('WCAP','0')=='1': G2=np.maximum(G2,PEs/(PEs+kap*PLs+1e-20))      # never below the template Wiener gain (protects bins the E template also fills)
gmin=10**((GMIN+(GMIN_T-GMIN)*expo)/10)
G2=np.maximum(G2,gmin)
G=np.sqrt(G2); G=uniform_filter(G,(3,3))
G=1-(1-G)*wz[None,:]
_,y=istft(X*G,SR,nperseg=NF,noverlap=NF-HOP); y=np.pad(y[:N],(0,max(0,N-len(y))))
np.save(F+OUT.replace('.wav','_G.npy'),G.astype(np.float32))
# write only the change (zone), keep everything else exactly
dlt=y-x; m=np.zeros(N); tt=np.arange(N)/SR
for a,b in ZONE: m=np.maximum(m,np.clip((tt-(a-0.06))/0.03,0,1)*np.clip(((b+0.16)-tt)/0.03,0,1))
sf.write(F+OUT,x+m*dlt,SR,subtype='FLOAT'); np.save(F+OUT.replace('.wav','_delta.npy'),m*dlt)
print('ok',OUT,'mean gain in zone speech frames %.2f dB'%(20*np.log10(np.mean(G[:,sp]))))
