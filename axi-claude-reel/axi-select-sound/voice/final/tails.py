# exposed trailing copy at phrase ends: after the enhanced (E-timed) phrase ends at A-85ms, the L-timed copy runs alone until A (A = pause start in the original)
import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
PZ=json.load(open(A+'/work/vo_pauses_vo.json'))
def ms(x,a,b): return float(np.mean(x[int(a*SR):int(b*SR)]**2))+1e-30
def env(x,w=5): k=np.ones(int(w*48))/int(w*48); return np.convolve(x**2,k,'same')[::48]
rows={}
ed=db(env(bp(rd('dry'),300,6000)))
for k in sys.argv[1:]:
    xb=bp(rd(k),300,6000); ev=db(env(xb)); out=[]
    for a,b in PZ:
        if b-a<0.12 or not inZ(a-0.05): continue
        # refine the original offset: last ms where dry env >= peak(prev 250 ms)-20 dB
        i0=int((a-0.25)*1000); ia=int((a+0.1)*1000); L=ed[i0:int(a*1000)].max(); idx=np.where(ed[i0:ia]>=L-20)[0]; tA=(i0+idx[-1])/1000
        tE=tA-0.0853
        lv=db(ms(xb,tE+0.012,tA-0.005)/ms(xb,tE-0.08,tE))
        out.append((round(a,2),round(lv,1)))
    rows[k]=out
    v=[q[1] for q in out]; print(k.split('/')[-1].ljust(10),'n',len(v),'median %.1f p75 %.1f max %.1f'%(np.median(v),np.percentile(v,75),np.max(v)),' '.join('%.2f:%.0f'%q for q in out))
