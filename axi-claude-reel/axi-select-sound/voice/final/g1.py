import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
res={}
for k in sys.argv[1:]:
    x=rd(k); wc=word_copy(x)
    res[k]=dict(regions=ac_regions(x),windows=ac_windows(x),words=summ_words(wc),wordrows=[(q[0],q[1],round(q[3],2),round(q[4],1)) for q in wc])
    print(k,json.dumps(res[k]['regions']),json.dumps(res[k]['words']),flush=True)
json.dump(res,open('/home/user/rr/sound3/voice/final/g1_%s.json'%'_'.join(sys.argv[1:]),'w'),ensure_ascii=False)
