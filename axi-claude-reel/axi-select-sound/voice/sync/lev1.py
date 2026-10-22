from slib import *
import sys
F=load("final"); D=load("dry"); d=4094
def lv(x,c,w=0.004):
    a=int((c-w/2)*SR); b=int((c+w/2)*SR); return 20*np.log10(np.sqrt((x[a:b]**2).mean())+1e-12)
t0,t1,st=float(sys.argv[1]),float(sys.argv[2]),float(sys.argv[3])
print("sync_t  F0(t)   Fd(t)=F(t-d)   dry(t)")
for t in np.arange(t0,t1,st):
    print("%.4f %7.1f %7.1f %7.1f"%(t,lv(F,t),lv(F,t-d/SR),lv(D,t)))
