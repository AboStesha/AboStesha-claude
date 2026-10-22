from slib import *
F=load("final"); D=load("dry"); d=4094
def lev(x,a,b): 
    a=int(a*SR); b=int(b*SR); return 20*np.log10(np.sqrt((x[a:b]**2).mean())+1e-9)
for nm,thr in [("lf_lo.npy",-55),("lf_1k4k.npy",-55)]:
    r=np.load(nm); t=r[:,0]/SR
    cls=np.where(r[:,1]<thr,'.',np.where(r[:,5]>r[:,3]+0.15,'E',np.where(r[:,3]>r[:,5]+0.15,'T','?')))
    print(nm)
    i=0
    while i<len(cls):
        if cls[i]=='T' and 3.6<t[i]<45.2:
            j=i
            while j<len(cls) and cls[j] in 'T': j+=1
            a,b=t[i]-0.02,t[j-1]+0.02   # approx window extent (40/60ms windows)
            if t[j-1]-t[i]>=0.015:
                print("  T %.3f-%.3f (%3dms) F%6.1f  D(t)%6.1f  D(t+d)%6.1f"%(t[i],t[j-1],(t[j-1]-t[i])*1000,lev(F,t[i],t[j-1]+0.005),lev(D,t[i],t[j-1]+0.005),lev(D,t[i]+d/SR,t[j-1]+0.005+d/SR)))
            i=j
        else: i+=1
