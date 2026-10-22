# zone treble spans, v2: the enhanced (E) rendition was rebuilt from a band-limited copy, so its own input cannot be the reference;
# patch wherever its HF/mid balance is > THR dB below the ALIGNED original take and the original has real treble there
import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
dv=np.load('hfmap_dv.npy'); sp=np.load('hfmap_sp.npy'); T=np.load('hfmap_T.npy'); cl=np.load('hfmap_cl.npy')
THR=float(sys.argv[1]); OUT=sys.argv[2]
zf=np.zeros(len(T),bool)
for a,b in ZONE: zf|=(T>=a)&(T<=b+0.1)
m=sp&zf&(dv<THR)
idx=np.nonzero(m)[0]; spans=[]
s=idx[0]; p=idx[0]
for i in idx[1:]:
    if i>p+2: spans.append([s,p]); s=i
    p=i
spans.append([s,p])
sp2=[[T[a]-0.02,T[b]+0.03,int(np.median(cl[a:b+1]))] for a,b in spans if b-a+1>=2]
sp2.sort(); M=[]
for a,b,c in sp2:
    if M and a-M[-1][1]<0.06 and M[-1][2]==c: M[-1][1]=max(M[-1][1],b)
    else: M.append([a,b,c])
M=[[round(a,3),round(b,3),c] for a,b,c in M]
print(len(M),'total %.2f s'%sum(b-a for a,b,c in M)); print(M)
json.dump(M,open(OUT,'w'))
