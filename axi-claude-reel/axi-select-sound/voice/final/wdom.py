# per-word dominance: envelope power fit of the enhanced voice as a*dry(t) + b*dry(t+85ms) (a = rendition at the original timing L, b = rendition 85 ms early E)
import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
from scipy.optimize import nnls
def envp(x,w=8):
    k=np.ones(int(w*48))/int(w*48); return np.convolve(x**2,k,'same')[::48]
ref=envp(bp(rd('dry'),300,4000)); e=envp(bp(rd(sys.argv[1] if len(sys.argv)>1 else 'X0.wav'),300,4000))
rows=[]
for w in V3W:
    a0=int((w['s']-0.02)*1000); b0=int((w['e']+0.02)*1000); i=np.arange(a0,b0)
    M=np.stack([ref[i],ref[i+85]],1); sc=np.sqrt((M**2).mean(0))+1e-20
    c,_=nnls(M/sc,e[i]); c=c/sc
    pa=c[0]*np.mean(ref[i]); pb=c[1]*np.mean(ref[i+85])   # power contributed by each rendition
    dom='E' if pb>pa else 'L'; ratio=db((min(pa,pb)+1e-30)/(max(pa,pb)+1e-30))
    rows.append(dict(i=w['i'],w=w['w'],s=w['s'],e=w['e'],dom=dom,minor_dB=round(float(ratio),1)))
json.dump(rows,open('/home/user/rr/sound3/voice/final/wdom.json','w'),ensure_ascii=False,indent=0)
for r in rows:
    if 3.5<r['s']<46: print('%6.2f %-12s %s minor %6.1f dB'%(r['s'],r['w'],r['dom'],r['minor_dB']))
