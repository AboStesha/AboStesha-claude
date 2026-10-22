import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
dv=np.load('hfmap_dv.npy'); de=np.load('hfmap_de.npy'); sp=np.load('hfmap_sp.npy'); T=np.load('hfmap_T.npy'); cl=np.load('hfmap_cl.npy')
THR=float(sys.argv[1]) if len(sys.argv)>1 else -12; THE=float(sys.argv[2]) if len(sys.argv)>2 else -12
zf=np.zeros(len(T),bool)
for a,b in ZONE: zf|=(T>=a)&(T<=b+0.1)
m=sp&zf&(dv<THR)&(de<THE)
idx=np.nonzero(m)[0]; spans=[]
if len(idx):
    s=idx[0]; p=idx[0]
    for i in idx[1:]:
        if i>p+1: spans.append([s,p]); s=i
        p=i
    spans.append([s,p])
sp2=[[T[a]-0.02,T[b]+0.03,int(np.median(cl[a:b+1]))] for a,b in spans if b-a+1>=3]
sp2.sort(); M=[]
for a,b,c in sp2:
    if M and a-M[-1][1]<0.10 and M[-1][2]==c: M[-1][1]=max(M[-1][1],b)
    else: M.append([a,b,c])
M=[[round(a,3),round(b,3),c] for a,b,c in M]
print(len(M),'total %.2f s'%sum(b-a for a,b,c in M)); print(M)
json.dump(M,open('hfspans_new.json','w'))
old=json.load(open('/home/user/rr/voice3/ver/spansF.json'))
print('old spans in zone:',[s for s in old if inZ(s[0])], 'total %.2f'%sum(b-a for a,b in old if inZ(a)))
