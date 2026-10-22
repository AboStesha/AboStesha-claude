# lip-sync check: for every presenter shot of comp/edl.json, the HeyGen clip's own audio (= the voice its lips were made
# from) decoded at the clip time the EDL uses (clip time = src + (VO - VO_cut)), cross-correlated with the voice file over
# the shot's VO span. lag>0 = voice EARLY vs lips. Band 300-4000 Hz, search +-150 ms, sub-sample peak.
import sys, json
sys.path.insert(0,'/home/user/rr/sound3/voice/sync')
from slib import *
E=json.load(open('/home/user/rr/axi-select-ch2/comp/edl.json'))
P=0.63; FPS=25
files=dict(a.split('=') for a in sys.argv[1:-1]); out=sys.argv[-1]
V={k:band(loadp(p)[:N],300,4000) for k,p in files.items()}
clips={}
res=[]
for sh in E['shots']:
    if 'clip' not in sh or sh.get('k_beat')=='COVER': continue
    c=sh['clip']
    if c not in clips: clips[c]=band(loadp('/home/user/rr/sound3/voice/sync/clips/%s_aud.wav'%c),300,4000)
    vs=sh['f0']/FPS-P; ve=sh['f1']/FPS-P; off=sh['src']-vs     # clip time = VO + off
    a=int(round(vs*SR)); b=int(round(ve*SR)); o=int(round(off*SR))
    C=clips[c]
    row=dict(beat=sh['k_beat'],clip=c,vo=[round(vs,3),round(ve,3)],out=[round(vs+P,2),round(ve+P,2)],clip_offset_s=round(off,3))
    for k,X in V.items():
        # X[n] vs C[n+o+l]: lag l>0 means the voice X is early
        l,cc,_=lag_win(X,np.pad(C,(0,max(0,len(X)+o+8000-len(C))))[o:o+len(X)+8000] if o>=0 else None,a,b,-7200,7200)
        row[k]=dict(lag_ms=round(l/48,3),corr=round(cc,3))
    res.append(row)
    print(json.dumps(row))
json.dump(res,open(out,'w'),indent=1)
