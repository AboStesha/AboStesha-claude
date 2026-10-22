# joins of the treble patches: tilt (4-12 kHz re 1-3.5 kHz) and level step across each patch edge, final vs the aligned original take
import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
X=rd(sys.argv[1]); V=rd('v3'); dA=rd('dryA.wav'); d=rd('dry'); log=json.load(open('Y5_log.json'))
def pw(x,lo,hi,a,b):
    y=bp(x[int((a-0.05)*SR):int((b+0.05)*SR)],lo,hi); i0=int(0.05*SR); return db(np.mean(y[i0:i0+int((b-a)*SR)]**2))
rows=[]
for q in log:
    a,b=q['span']; ref=dA if q['lag']>2000 else d
    for edge,s in [('in',a-0.025),('out',b+0.025)]:   # the crossfade is centred on the span edge +-25 ms; compare 25 ms either side of it
        L=(s-0.05,s-0.02) if edge=='in' else (s+0.02,s+0.05); Rr=(s+0.02,s+0.05) if edge=='in' else (s-0.05,s-0.02)
        tx=(pw(X,4000,12000,*Rr)-pw(X,1000,3500,*Rr))-(pw(X,4000,12000,*L)-pw(X,1000,3500,*L))
        tr=(pw(ref,4000,12000,*Rr)-pw(ref,1000,3500,*Rr))-(pw(ref,4000,12000,*L)-pw(ref,1000,3500,*L))
        lx=pw(X,150,8000,*Rr)-pw(X,150,8000,*L); lr=pw(ref,150,8000,*Rr)-pw(ref,150,8000,*L)
        tv=(pw(V,4000,12000,*Rr)-pw(V,1000,3500,*Rr))-(pw(V,4000,12000,*L)-pw(V,1000,3500,*L))
        lv_=min(pw(X,150,8000,*L),pw(X,150,8000,*Rr)); lvr=min(pw(ref,150,8000,*L),pw(ref,150,8000,*Rr))
        if lv_<-55 or lvr<-55: continue          # edge touches silence in the final or in the original: not a join inside speech
        rows.append((a,b,edge,tx-tr,lx-lr,tv-tr))
t=np.array([r[3] for r in rows]); l=np.array([r[4] for r in rows])
print('edges',len(rows),'tilt-step excess (final minus original) |dB|: median %.1f p90 %.1f max %.1f ; level-step excess |dB|: median %.1f p90 %.1f max %.1f'%(np.median(np.abs(t)),np.percentile(np.abs(t),90),np.abs(t).max(),np.median(np.abs(l)),np.percentile(np.abs(l),90),np.abs(l).max()))
vv=np.array([r[5] for r in rows]); print('same edges in vo2_v3: tilt-step excess |dB| median %.1f p90 %.1f'%(np.median(np.abs(vv)),np.percentile(np.abs(vv),90)))
for r in sorted(rows,key=lambda r:-abs(r[3]))[:6]: print('  worst tilt: span %.3f-%.3f %s tilt %+.1f level %+.1f (v3 %+.1f)'%r)
