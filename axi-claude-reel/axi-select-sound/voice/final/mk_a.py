import sys; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
gs=np.load('rep_v3_gs.npy'); trim=float(open('rep_v3_trim.txt').read())
x,_=sf.read('p2_dry.wav',dtype='float64'); y=x*10**(gs/20); y=y*10**(trim/20)
sf.write('v3a.wav',y,SR,subtype='PCM_24')
a=rdi('v3a.wav'); b=rdi('v3'); d=np.nonzero(a-b)[0]; print('changed samples',len(d),'first/last %.3f %.3f'%(d[0]/SR,d[-1]/SR))
import json; sp=json.load(open('/home/user/rr/voice3/ver/spansF.json'))
ins=np.zeros(N,bool)
for s,e in sp: ins[int((s-0.025)*SR):int((e+0.025)*SR)]=True
print('changed outside spans+-25ms:',int(np.sum(~ins[d])))
