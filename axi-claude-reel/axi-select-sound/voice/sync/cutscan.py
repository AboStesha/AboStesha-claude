import sys
from synclib import *
d=4094
F=rd(FINAL); D=rd(DRY)
sig={'F0':F,'Fd':shift(F,d),'D':D}
if len(sys.argv)>6:
    import soundfile as sf
    sig['X']=rd(sys.argv[6])
a_nm,b_nm=sys.argv[1],sys.argv[2]; lo,hi=float(sys.argv[3]),float(sys.argv[4]); ms=float(sys.argv[5])
n=int(ms*SR/1000)
A=sig[a_nm]; B=sig[b_nm]
rows=[]
for c in np.arange(lo,hi,0.0005):
    i=T(c)-n//2; x=A[i:i+n]; y=B[i:i+n]
    ex=np.sqrt((x*x).mean()); ey=np.sqrt((y*y).mean())
    r=(x*y).mean()/(ex*ey+1e-20)
    rows.append((c,r,20*np.log10(ex+1e-12),20*np.log10(ey+1e-12)))
rows=np.array(rows)
for r in rows[::4]: print("%.4f rho %+.2f  %s %6.1f  %s %6.1f"%(r[0],r[1],a_nm,r[2],b_nm,r[3]))
k=np.argmax(rows[:,1]); print("best rho at %.4f: %.2f (%.1f / %.1f)"%tuple(rows[k]))
