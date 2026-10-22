import numpy as np, sys
r=np.load(sys.argv[1]); t=r[:,0]/48000
thr=float(sys.argv[2]); t0=float(sys.argv[3]); t1=float(sys.argv[4])
def cl(l):
    if l[1]<thr: return '.'
    if l[5]>l[3]+0.15: return 'E'
    if l[3]>l[5]+0.15: return 'T'
    return '?'
# one char per 10ms using nearest row
for s in np.arange(t0,t1,1.0):
    line=''
    for k in range(100):
        tc=s+k*0.01+0.005; i=np.argmin(abs(t-tc)); line+=cl(r[i])
    print("%5.1f %s"%(s,line))
