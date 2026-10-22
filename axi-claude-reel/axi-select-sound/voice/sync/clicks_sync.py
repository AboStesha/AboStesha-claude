# click / discontinuity scan (same detector as final_verify/clicks.py): 2nd difference of the 8 kHz-highpassed signal vs
# its local RMS (+-10 ms); event = |d2| > 8x local RMS and > -60 dBFS. Events of vo2_sync near the joins/stretches are
# compared with vo2_final at the source time of the same audio; plus the largest sample-to-sample step at every join.
import sys, json
sys.path.insert(0,'/home/user/rr/sound3/voice/final_verify'); sys.path.insert(0,'/home/user/rr/sound3/voice/sync')
from common import *
from scipy.ndimage import uniform_filter1d
from tmap import f2s
def scan(x):
    h=band(x,8000,None); d2=np.diff(h,2); a=np.abs(d2); loc=np.sqrt(uniform_filter1d(d2**2,960))+1e-9; sc=a/loc
    cand=np.where((sc>8)&(a>10**(-60/20)))[0]; ev=[]
    for i in cand:
        if ev and i-ev[-1][0]<240:
            if sc[i]>ev[-1][1]: ev[-1]=(i,sc[i],a[i])
        else: ev.append((i,sc[i],a[i]))
    return ev,sc
F=load("final"); S=load("/home/user/rr/axi-select-ch2/audio/vo/vo2_sync.wav")
eF,sF=scan(F); eS,sS=scan(S)
meta=json.load(open('/home/user/rr/sound3/voice/sync/vo2_sync_build.json'))
J=[c['center'] for c in meta['cuts']]+[3.665,3.845,14.33,14.57]
print("events: final %d, sync %d"%(len(eF),len(eS)))
d=4094
near=[e for e in eS if any(abs(e[0]/SR-j)<=0.05 for j in J)]
new=[]
for e in near:
    t=e[0]/SR
    # same audio in final: unshifted (F0) or shifted (Fd) source; accept if final has an event within 1 ms at either
    ok=any(sF[max(0,i-48):i+48].max()>=4 for i in (e[0],e[0]-d))
    if not ok: new.append(e)
print("sync events within 50 ms of a join/stretch edge: %d; without a counterpart in vo2_final: %d"%(len(near),len(new)))
for e in new: print("  NEW t=%.4f score %.1f |d2| %.1f dBFS"%(e[0]/SR,e[1],db(e[2])))
print("max |sample step| final %.4f sync %.4f"%(np.abs(np.diff(F)).max(),np.abs(np.diff(S)).max()))
for j in sorted(set(round(x,4) for x in J)):
    a=int((j-0.02)*SR); b=int((j+0.02)*SR)
    st=np.abs(np.diff(S[a:b])).max(); lv=np.sqrt((S[a:b]**2).mean())
    # reference: the same measure on the two sources around the same output time
    r0=np.abs(np.diff(F[a:b])).max(); r1=np.abs(np.diff(F[a-d:b-d])).max()
    print("join %.4f: max step %.4f (sources: unshifted %.4f, shifted %.4f), rms %.1f dBFS"%(j,st,r0,r1,db(lv)))
