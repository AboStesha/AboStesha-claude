from slib import *
D=load("dry"); 
for nm in ["final","v3","enh"]:
    X=load(nm)
    for lo,hi in [(300,1000),(1000,4000),(4000,8000)]:
        Db=band(D,lo,hi); Xb=band(X,lo,hi); s=[]
        for a in [2,46,50,54,58,62,66,70,74,78,82]:
            l,c,_=lag_win(Xb,Db,a*SR,(a+4)*SR,-200,200); s.append("%d:%+.1f/%.2f"%(a,l,c))
        print(nm,lo,hi," ".join(s))
