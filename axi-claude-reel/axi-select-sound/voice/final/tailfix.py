# phrase-end treatment (mirror of res5.py): after each enhanced (E-timed) phrase end, the late copy runs alone until the original
# phrase end; give that window the natural release of the same words in the original take (vo2_dry advanced 85 ms): per-band gain
# that only attenuates, following the original's envelope, level-matched on the last 50 ms of the phrase. -> dtail.npy (delta)
import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
from scipy.ndimage import uniform_filter1d
IN=sys.argv[1]; x=rd(IN); dA=rd('dryA.wav'); d=rd('dry')
PZ=json.load(open(A+'/work/vo_pauses_vo.json')); dom=json.load(open('wdom.json'))
BANDS=[(0,1000),(1000,4000),(4000,24000)]
def env(z,w=5): k=np.ones(int(w*48))/int(w*48); return db(np.convolve(z**2,k,'same'))
xb=[bp(x,lo,hi) if lo>0 else bp(x,0,hi) for lo,hi in BANDS]; ab=[bp(dA,lo,hi) if lo>0 else bp(dA,0,hi) for lo,hi in BANDS]
ed=db(np.convolve(bp(d,300,6000)**2,np.ones(240)/240,'same')[::48])
D=np.zeros(N); log=[]
for a,b in PZ:
    if b-a<0.12 or not inZ(a-0.05): continue
    i0=int((a-0.25)*1000); ia=int((a+0.1)*1000); L=ed[i0:int(a*1000)].max(); idx=np.where(ed[i0:ia]>=L-20)[0]; tA=(i0+idx[-1])/1000; tE=tA-0.0853
    prev=[q for q in dom if q['s']<tE-0.02 and q['e']>tE-0.15]
    if not prev or prev[-1]['dom']!='E': continue
    w0=tE-0.010; w1=min(tA+0.080,b-0.0853-0.010)      # never reach the earliest possible E-timed onset of the next phrase
    nxt=[q for q in dom if tE-0.0<q['s']<w1]          # a word (any rendition) starting inside the window: stop before it
    if nxt: w1=min(w1,min(q['s'] for q in nxt)-0.005)
    if w1-w0<0.03: continue
    s0,s1=int(w0*SR),int(w1*SR); t=np.arange(s0,s1)/SR
    ramp=np.clip((t-w0)/0.010,0,1)*np.clip((w1-t)/0.008,0,1) if False else np.clip((t-w0)/0.010,0,1)
    tot=np.zeros(s1-s0); g_all=[]
    for k in range(len(BANDS)):
        ex=env(xb[k][s0-2400:s1+2400])[2400:-2400]; ea=env(ab[k][s0-2400:s1+2400])[2400:-2400]
        r0,r1=int((tE-0.06)*SR)-s0+2400,int((tE-0.01)*SR)-s0+2400
        exr=env(xb[k][int((tE-0.06)*SR):int((tE-0.01)*SR)]).mean(); ear=env(ab[k][int((tE-0.06)*SR):int((tE-0.01)*SR)]).mean()
        c=exr-ear
        g=np.clip((ea+c)-ex,-40,0); g=uniform_filter1d(g,240)
        g=g*ramp
        tot+=xb[k][s0:s1]*(10**(g/20)-1); g_all.append(float(np.percentile(g,10)))
    # the window end: if it runs into the next phrase/pause edge, fade the gain back to 0 dB over the last 8 ms
    fo=np.clip((w1-t)/0.010,0,1); tot*=fo
    D[s0:s1]+=tot
    log.append(dict(pause=[a,b],tE=round(tE,3),tA=round(tA,3),win=[round(w0,3),round(w1,3)],p10_gain_dB=[round(v,1) for v in g_all]))
np.save('/home/user/rr/sound3/voice/final/dtail.npy',D); json.dump(log,open('/home/user/rr/sound3/voice/final/dtail_log.json','w'),indent=0)
print('windows',len(log)); [print(q) for q in log]
