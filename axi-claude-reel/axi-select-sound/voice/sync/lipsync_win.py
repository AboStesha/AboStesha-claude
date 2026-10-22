# lip-sync in 1.0 s windows (hop 0.5 s) inside every presenter shot: voice vs the clip's own audio at the EDL clip time
import sys, json
sys.path.insert(0,'/home/user/rr/sound3/voice/sync')
from slib import *
E=json.load(open('/home/user/rr/axi-select-ch2/comp/edl.json')); P=0.63; FPS=25
X=band(loadp(sys.argv[1])[:N],300,4000); res=[]
clips={}
for sh in E['shots']:
    if 'clip' not in sh: continue
    c=sh['clip']
    if c not in clips: clips[c]=band(loadp('/home/user/rr/sound3/voice/sync/clips/%s_aud.wav'%c),300,4000)
    vs=sh['f0']/FPS-P; ve=sh['f1']/FPS-P; o=int(round((sh['src']-vs)*SR))
    R=np.pad(clips[c],(0,20000))[o:o+N]
    for t in np.arange(vs,ve-0.99,0.5):
        a=int(t*SR); b=a+SR
        if np.sqrt((X[a:b]**2).mean())<1e-3: continue      # skip near-silent windows
        l,cc,_=lag_win(X,R,a,b,-7200,7200)
        res.append((sh['k_beat'],round(t,2),round(l/48,3),round(cc,3)))
L=np.array([r[2] for r in res]); C=np.array([r[3] for r in res])
print("windows %d: lag ms median %.3f, max|.| %.3f, corr median %.2f min %.2f"%(len(res),np.median(L),np.abs(L).max(),np.median(C),C.min()))
for r in res:
    if abs(r[2])>2 or r[3]<0.3: print("  check",r)
json.dump(res,open(sys.argv[2],'w'))
