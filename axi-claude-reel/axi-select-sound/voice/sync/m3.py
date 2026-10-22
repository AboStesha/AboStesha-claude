from slib import *
F=load("final"); D=load("dry"); E=load("enh"); V=load("v3")
for lo,hi in [(300,1000),(1000,4000),(4000,8000)]:
    Fb=band(F,lo,hi); Db=band(D,lo,hi); Eb=band(E,lo,hi)
    out=[]
    for a,b in [(3.75,6),(6,8.7),(8.9,11),(11,14.2),(14.47,15.85),(18.85,21),(21,24),(24,27),(27,30),(30,33),(33,36),(36,39),(39,42),(42,44.7)]:
        l,c,_=lag_win(Fb,Db,int(a*SR),int(b*SR),3900,4300); le,ce,_=lag_win(Eb,Db,int(a*SR),int(b*SR),3900,4300)
        out.append("%.1f-%.1f F%.2f/%.2f E%.2f/%.2f"%(a,b,l,c,le,ce))
    print(lo,hi); print("  "+"\n  ".join(out))
