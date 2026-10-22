from slib import *
import sys
import os
F=load(os.environ.get("SRC","final")); D=load("dry"); d=4094
t0,t1=float(sys.argv[1]),float(sys.argv[2]); W=int(float(sys.argv[3])*SR); lo,hi=int(sys.argv[4]),int(sys.argv[5])
Fb=band(F,lo,hi); Db=band(D,lo,hi)
def lev(x,a,b): return 20*np.log10(np.sqrt((x[a:b]**2).mean())+1e-9)
for t in np.arange(t0,t1,0.005):
    a=int(t*SR); b=a+W
    l0,c0,_=lag_win(Fb,Db,a,b,-60,60); l1,c1,_=lag_win(Fb,Db,a,b,d-60,d+60)
    print("%.3f F%6.1f D%6.1f D+d%6.1f  l0 %+6.1f c0 %.2f | l1 %7.1f c1 %.2f %s"%(t+W/2/SR,lev(F,a,b),lev(D,a,b),lev(D,a+d,b+d),l0,c0,l1,c1,'T' if c0>c1+0.1 else ('E' if c1>c0+0.1 else '?')))
