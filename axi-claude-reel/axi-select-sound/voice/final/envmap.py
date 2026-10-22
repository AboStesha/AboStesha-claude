import sys; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
def envp(x,w=10):
    k=np.ones(int(w*48))/int(w*48); return np.convolve(x**2,k,'same')[::48]
ref=envp(bp(rd('dry'),300,6000)); e=envp(bp(rd(sys.argv[1]),300,6000))
W=float(sys.argv[2]) if len(sys.argv)>2 else 0.8; HOP=0.2
rows=[]
for t in np.arange(2.3,84.5,HOP):
    i=np.arange(int(t*1000),int((t+W)*1000))
    if ref[i].max()<1e-7: continue
    M=np.stack([ref[i],ref[i+85]],1); c,*_=np.linalg.lstsq(M,e[i],rcond=None)
    tot=max(c[0],0)+max(c[1],0)+1e-12
    rows.append((t,c[0],c[1]))
    print('%5.1f  lag0 %6.3f  early(+85) %6.3f  %s'%(t,c[0],c[1],'A-dominant' if c[1]>c[0] else ''))
