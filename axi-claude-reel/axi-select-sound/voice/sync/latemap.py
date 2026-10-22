# sync vs dry: per window, best corr near lag 0 vs near lag -4094 (content 85 ms late) and +4094 (85 ms early)
import sys
from slib import *
X=loadp(sys.argv[1])[:N]; D=load("dry"); lo,hi=int(sys.argv[2]),int(sys.argv[3]); W=int(sys.argv[4])
Xb=band(X,lo,hi); Db=band(D,lo,hi); H=240; w=np.hanning(W)
rows=[]
for s in range(5000, N-W-5000, H):
    x=Xb[s:s+W]*w; ex=np.sqrt((x*x).sum())
    lv=20*np.log10(ex/np.sqrt((w*w).sum())+1e-12)
    if lv<-55: continue
    res=[]
    for c in (-4094,0,4094):
        l,cc,_=lag_win(Xb*1.0,Db,s,s+W,c-120,c+120,sub=False)
        res.append(cc)
    rows.append((s/SR,lv,*res))
r=np.array(rows); np.save(sys.argv[5],r)
late=r[(r[:,2]>r[:,3]+0.15)&(r[:,2]>0.5)]; early=r[(r[:,4]>r[:,3]+0.15)&(r[:,4]>0.5)]
def runs(a):
    out=[]; 
    for t in a[:,0]:
        if out and t-out[-1][1]<=0.011: out[-1][1]=t
        else: out.append([t,t])
    return out
print("LATE runs:",[(round(a,3),round(b,3)) for a,b in runs(late) if b-a>=0.015])
print("EARLY runs:",[(round(a,3),round(b,3)) for a,b in runs(early) if b-a>=0.015])
