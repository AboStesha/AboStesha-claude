import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
P=[(3.6,16.45),(18.45,45.3)]
mp=[]; o=0.0
for a,b in P: mp.append([a,b,round(o,3)]); o+=b-a+1.0
json.dump(mp,open('sep2/map.json','w'))
for k,p in [('v3','v3'),('fin',sys.argv[1]),('dryA','dryA.wav')]:
    x=rd(p); seg=[]
    for a,b in P: seg+= [x[int(a*SR):int(b*SR)],np.zeros(SR)]
    y=np.concatenate(seg); sf.write('sep2/C_%s.wav'%k,np.stack([y,y],1),SR,subtype='PCM_24'); print(k,len(y)/SR)
