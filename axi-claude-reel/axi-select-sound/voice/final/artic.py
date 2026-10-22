# articulation fidelity: per E-word envelope correlation (log, 300-4000 Hz, 5 ms) with the original take advanced 85 ms (the same words, clean), and with lag 0 (the copy)
import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
def envl(x,w=5):
    k=np.ones(int(w*48))/int(w*48); return np.log10(np.convolve(x**2,k,'same')[::48]+1e-9)
ref=envl(bp(rd('dry'),300,4000)); dom=json.load(open('wdom.json'))
for k in sys.argv[1:]:
    e=envl(bp(rd(k),300,4000)); r85=[];r0=[]
    for q in dom:
        if q['dom']!='E' or not inZ(q['s']) or q['e']-q['s']<0.1: continue
        i=np.arange(int(q['s']*1000),int(q['e']*1000))
        r85.append(np.corrcoef(e[i],ref[i+85])[0,1]); r0.append(np.corrcoef(e[i],ref[i])[0,1])
    print(k.ljust(10),'n',len(r85),'corr with original@-85ms: median %.3f p25 %.3f | with original@0 (copy): median %.3f'%(np.median(r85),np.percentile(r85,25),np.median(r0)))
