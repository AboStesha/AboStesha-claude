# local lag map: lag (ms) maximizing envelope correlation between file and dry (dry(t+lag) ~ file(t)), 300-3000 Hz, 0.6 s windows
import sys; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
def envl(x,w=8):
    k=np.ones(int(w*48))/int(w*48); e=np.convolve(x**2,k,'same')[::48]; return np.log10(e+1e-9)
ref=envl(bp(rd('dry'),300,3000)); e=envl(bp(rd(sys.argv[1]),300,3000))
W=int(float(sys.argv[2])*1000) if len(sys.argv)>2 else 600; HOP=100
out=[]
for t in range(2300,84300,HOP):
    i=np.arange(t,t+W)
    if np.percentile(ref[i],90)<-6.5: continue
    best=None
    cs={}
    for L in range(-150,151,1):
        c=np.corrcoef(e[i],ref[i+L])[0,1]; cs[L]=c
        if best is None or c>best[1]: best=(L,c)
    out.append((t/1000,best[0],best[1],cs[0],cs[85]))
for r in out: print('%6.2f lag %4d ms  r %.2f | r(0) %.2f r(85) %.2f'%r)
