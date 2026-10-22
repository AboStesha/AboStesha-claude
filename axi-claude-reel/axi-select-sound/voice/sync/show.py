from slib import *
import sys
r=np.load(sys.argv[1]); t0=float(sys.argv[2]); t1=float(sys.argv[3]); step=int(sys.argv[4]) if len(sys.argv)>4 else 2
F=load("final"); D=load("dry")
def lev(x,t,w=0.01):
    a=int(t*SR); b=a+int(w*SR); return 20*np.log10(np.sqrt((x[a:b]**2).mean())+1e-9)
tt=r[:,0]/SR
idx=np.where((tt>=t0)&(tt<=t1))[0][::step]
for i in idx:
    t=tt[i]; l=r[i]
    cl='E' if l[5]>l[3]+0.15 else ('T' if l[3]>l[5]+0.15 else '?')
    if l[1]<-62: cl='.'
    print("%.3f F%6.1f D%6.1f D+d%6.1f | b%6.1f %s l0=%5d c0=%.2f l1=%5d c1=%.2f"%(t,lev(F,t-0.005),lev(D,t-0.005),lev(D,t-0.005+4094/SR),l[1],cl,l[2],l[3],l[4],l[5]))
