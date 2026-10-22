# per-word lag of X vs vo2_dry (original take = lip timing). Band 1-4 kHz cross-correlation (search +-150 samples, and the
# best correlation found near -4094 / +4094 for diagnosis) and broadband envelope (300-4000 Hz Hilbert envelope, 1 kHz,
# search +-120 ms). lag>0 = X early. Word windows: v3_words.json (VO/final time) mapped to the file's time with tmap.f2s.
import sys, json
sys.path.insert(0,'/home/user/rr/sound3/voice/sync')
from slib import *
from tmap import f2s
from scipy.signal import hilbert, resample_poly
X=loadp(sys.argv[1])[:N]; mapped=sys.argv[2]=='sync'; out=sys.argv[3]
D=load("dry")
Xb=band(X,1000,4000); Db=band(D,1000,4000)
def env(x):
    e=np.abs(hilbert(band(x,300,4000))); return resample_poly(e,1,48)
EX=env(X); ED=env(D)
W=json.load(open('/home/user/rr/axi-select-ch2/work/asr/v3_words.json'))['words']
rows=[]
for w in W:
    s,e=(f2s(w['s']),f2s(w['e'])) if mapped else (w['s'],w['e'])
    a=int((s-0.03)*SR); b=int((e+0.03)*SR)
    l,c,_=lag_win(Xb,Db,a,b,-150,150)
    lm,cm,_=lag_win(Xb,Db,a,b,-4094-150,-4094+150,sub=False); lp,cp,_=lag_win(Xb,Db,a,b,4094-150,4094+150,sub=False)
    # envelope
    ea,eb=int((s-0.03)*1000),int((e+0.03)*1000); x=EX[ea:eb]-EX[ea:eb].mean()
    best=(-9,0)
    for L in range(-120,121):
        y=ED[ea+L:eb+L]-ED[ea+L:eb+L].mean(); cc=(x*y).sum()/np.sqrt((x*x).sum()*(y*y).sum()+1e-20)
        if cc>best[0]: best=(cc,L)
    rows.append(dict(i=w['i'],w=w['w'],s=round(s,3),e=round(e,3),lag_smp=round(l,1),lag_ms=round(l/48,3),corr=round(c,3),
                     corr_late=round(cm,3),corr_early=round(cp,3),env_lag_ms=best[1],env_corr=round(best[0],3)))
json.dump(rows,open(out,'w'),ensure_ascii=False,indent=0)
L=np.array([r['lag_ms'] for r in rows]); E=np.array([r['env_lag_ms'] for r in rows])
print("words",len(rows),"band lag ms: median %.3f max|.| %.3f  p95|.| %.3f"%(np.median(L),np.abs(L).max(),np.percentile(np.abs(L),95)))
print("env lag ms: median %.1f max|.| %d"%(np.median(E),np.abs(E).max()))
bad=[r for r in rows if abs(r['lag_ms'])>1.5 or r['corr_late']>r['corr']+0.05 or r['corr_early']>r['corr']+0.05]
for r in bad: print("CHECK",json.dumps(r,ensure_ascii=False))
