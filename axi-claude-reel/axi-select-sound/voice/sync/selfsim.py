from slib import *
D=load("dry"); Db=band(D,1000,5000); W=960
out=[]
for t in np.arange(2.4,84,0.005):
    a=int(t*SR); x=Db[a:a+W]; y=Db[a+4094:a+4094+W]
    e=np.sqrt((x*x).sum()*(y*y).sum())
    if e<1e-9: continue
    lv=20*np.log10(np.sqrt((x*x).mean())+1e-9)
    if lv<-50: continue
    c=(x*y).sum()/e
    if c>0.7: out.append((round(t,3),round(c,2),round(lv,1)))
print(len(out)); print(out[:200])
