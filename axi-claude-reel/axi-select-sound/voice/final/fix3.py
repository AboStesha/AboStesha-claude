# step 3 clean-ups (outside the zone, both takes aligned at lag 0): deltas relative to vo2_v3 -> d3.npy
import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
v=rd('v3'); d=rd('dry'); D3=np.zeros(N); log={}
def env(x,w=5): k=np.ones(int(w*48))/int(w*48); return db(np.convolve(bp(x,150,8000)**2,k,'same'))
ev=env(v); ed=env(d)
from scipy.ndimage import uniform_filter1d
def match_level(a,b,ramp=0.008,maxcut=30.0):
    i0,i1=int(a*SR),int(b*SR); g=np.clip(ed[i0:i1]-ev[i0:i1],-maxcut,0.0)          # dB, never boost
    g=uniform_filter1d(g,480)                                                       # 10 ms smoothing
    t=np.arange(i0,i1)/SR; w=np.clip(np.minimum((t-a)/ramp,(b-t)/ramp),0,1); w=np.sin(0.5*np.pi*w)**2
    gl=10**(g*w/20); D3[i0:i1]+=v[i0:i1]*(gl-1)
    before=db(np.mean(v[i0:i1]**2)); after=db(np.mean((v[i0:i1]*gl)**2)); orig=db(np.mean(d[i0:i1]**2))
    return dict(span=[a,b],v3_dB=round(before,1),out_dB=round(after,1),original_dB=round(orig,1),max_cut_dB=round(float(-g.min()),1))
log['nonword_50.48']=match_level(50.445,50.655)
log['nonword_66.08']=match_level(66.050,66.170)
# «مبروك»: the gate cut the release of the final «ك» at 76.795; continue it with the original take's own release (level-matched in 1-8 kHz on the burst)
a,b=76.740,76.785
vb=bp(v,1000,8000); dbb=bp(d,1000,8000); g=10**((db(np.mean(vb[int(a*SR):int(b*SR)]**2))-db(np.mean(dbb[int(a*SR):int(b*SR)]**2)))/20)
tail=bp(d,150,12000)*g
t=np.arange(N)/SR; x0,x1,e1=76.785,76.797,76.930
wi=np.clip((t-x0)/(x1-x0),0,1); wi=np.sin(0.5*np.pi*wi)**2; wo=np.clip((e1-t)/0.02,0,1); m=(t>=x0)&(t<=e1)
D3[m]+=(wi*wo*(tail-v))[m]
log['mabrouk_tail']=dict(xfade=[x0,x1],end=e1,gain_dB=round(20*np.log10(g),1))
np.save('/home/user/rr/sound3/voice/final/d3.npy',D3); json.dump(log,open('/home/user/rr/sound3/voice/final/d3_log.json','w'),indent=1); print(json.dumps(log))
y=v+D3; e2=db(np.convolve(bp(y,150,8000)**2,np.ones(480)/480,'same')[::48]); e3=db(np.convolve(bp(v,150,8000)**2,np.ones(480)/480,'same')[::48]); e4=db(np.convolve(bp(d,150,8000)**2,np.ones(480)/480,'same')[::48])
print('mabrouk end (10ms env, dBFS):'); print('  t   ',' '.join('%6.2f'%q for q in np.arange(76.73,76.93,0.02)))
for nm,e in [('v3',e3),('out',e2),('orig',e4)]: print('  %-4s'%nm,' '.join('%6.1f'%e[int(q*1000)] for q in np.arange(76.73,76.93,0.02)))
