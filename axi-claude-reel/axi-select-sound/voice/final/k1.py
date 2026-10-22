import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
e=rdi('eng'); p2=rdi('p2'); v3=rdi('v3')
d=(p2-e)
nz=np.nonzero(d)[0]
# group nonzero runs (gap > 2 ms -> new run)
runs=[]; s=nz[0]; prev=nz[0]
for i in nz[1:]:
    if i-prev>96: runs.append((s,prev)); s=i
    prev=i
runs.append((s,prev))
print('nonzero runs of p2-eng:',len(runs))
print([(round(a/SR,3),round(b/SR,3)) for a,b in runs])
sp=json.load(open('/home/user/rr/voice3/ver/spansF.json'))
print('spans',len(sp))
# ratio v3/p2
m=np.abs(p2)>2**8*1000
r=v3[m]/p2[m]; print('v3/p2 ratio range',np.percentile(r,[0,1,50,99,100]))
