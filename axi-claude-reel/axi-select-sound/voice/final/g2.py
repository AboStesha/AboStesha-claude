import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
res={}
for k in sys.argv[1:]:
    x=rd(k); wc=word_copy_post(x)
    res[k]=dict(ac=ac_zone(x),post=summ_post(wc),win=ac_windows(x),rows=[(q[0],q[1],round(q[3],2),round(q[4],1)) for q in wc])
    print(k.split('/')[-1],json.dumps(res[k]['ac']),json.dumps(res[k]['post']),flush=True)
json.dump(res,open('/home/user/rr/sound3/voice/final/g2_%s.json'%'_'.join(s.split('/')[-1].replace('.wav','') for s in sys.argv[1:]),'w'),ensure_ascii=False)
