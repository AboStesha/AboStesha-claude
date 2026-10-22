import numpy as np, sys
r=np.load(sys.argv[1]); t=r[:,0]/48000; lv=r[:,1]; l0=r[:,2]; c0=r[:,3]; l1=r[:,4]; c1=r[:,5]
thr=float(sys.argv[2]) if len(sys.argv)>2 else -60
cls=np.where(lv<thr,'.',np.where(c1>c0+0.15,'E',np.where(c0>c1+0.15,'T','?')))
# runs
i=0; out=[]
while i<len(cls):
    j=i
    while j<len(cls) and cls[j]==cls[i]: j+=1
    out.append((cls[i],t[i],t[j-1],j-i, np.median(l0[i:j]), np.median(l1[i:j]), np.median(c0[i:j]), np.median(c1[i:j])))
    i=j
lo=float(sys.argv[3]) if len(sys.argv)>3 else 0; hi=float(sys.argv[4]) if len(sys.argv)>4 else 100
for o in out:
    if o[2]>=lo and o[1]<=hi and o[0]!='.': print("%s %7.3f-%7.3f n=%3d l0=%5d l1=%5d c0=%.2f c1=%.2f"%o)
