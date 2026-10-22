# frame-level timing map (10 ms hop, 160 ms windows): which lag (0 or 85 ms) explains the enhanced voice (eng0) better, from envelope correlation with dry
import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
def envl(x,w=6):
    k=np.ones(int(w*48))/int(w*48); return np.log10(np.convolve(x**2,k,'same')[::48]+1e-10)
ref=envl(bp(rd('dry'),300,3000)); e=envl(bp(rd('eng0.wav'),300,3000)); lv=e-np.percentile(e,95)
T=np.arange(2300,84300,10); out=[]
for t in T:
    i=np.arange(t-80,t+80)
    if lv[i].max()< -3.5: out.append((t,np.nan,np.nan,np.nan)); continue
    c0=np.corrcoef(e[i],ref[i])[0,1]; c85=np.corrcoef(e[i],ref[i+85])[0,1]
    cs=[np.corrcoef(e[i],ref[i+L])[0,1] for L in range(-20,111,5)]; L=(-20+5*int(np.argmax(cs)))
    out.append((t,c0,c85,L))
o=np.array(out,dtype=float); np.save('/home/user/rr/sound3/voice/final/flag.npy',o)
# summarise as runs of E (c85-c0>0.15), L (c0-c85>0.15), M (mixed)
cl=np.where(np.isnan(o[:,1]),'-',np.where(o[:,2]-o[:,1]>0.15,'E',np.where(o[:,1]-o[:,2]>0.15,'L','M')))
s=''.join(cl); runs=[]; st=0
for i in range(1,len(s)+1):
    if i==len(s) or s[i]!=s[st]: runs.append((s[st],T[st]/1000,T[i-1]/1000)); st=i
print(' '.join('%s%.2f-%.2f'%r for r in runs if r[0]!='-' and r[2]<46))
