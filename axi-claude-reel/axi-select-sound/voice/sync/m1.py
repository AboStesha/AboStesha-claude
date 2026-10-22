from slib import *
D=load("dry"); Pt=load("patched"); F=load("final")
Db=band(D,300,4000); Pb=band(Pt,300,4000); Fb=band(F,300,4000)
print("patched vs dry (l>0: patched early)")
for a in range(2,84,4):
    l,c,_=lag_win(Pb,Db,a*SR,(a+4)*SR,-200,200); print(" %d-%d %+.2f %.3f"%(a,a+4,l,c), end=";")
print()
for nm in "L1 L2 L3 L4 L5".split():
    H=loadp('clips/%s_aud.wav'%nm)[:N]; Hb=band(H,300,4000)
    s1=[];s2=[]
    for a in range(2,84,4):
        l,c,_=lag_win(Hb,Db,a*SR,(a+4)*SR,-1500,300); l2,c2,_=lag_win(Hb,Pb,a*SR,(a+4)*SR,-1500,300)
        s1.append("%+.1f/%.2f"%(l,c)); s2.append("%+.1f/%.2f"%(l2,c2))
    print(nm,"vs dry:"," ".join(s1)); print(nm,"vs pat:"," ".join(s2))
