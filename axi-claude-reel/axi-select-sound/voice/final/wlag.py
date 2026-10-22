# per-word timing map: for every v3 word, the lag (ms) at which the original take (dry) best matches the enhanced voice (pre-patch F_v3c)
import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
def envl(x,w=6):
    k=np.ones(int(w*48))/int(w*48); return np.log10(np.convolve(x**2,k,'same')[::48]+1e-10)
src=sys.argv[1] if len(sys.argv)>1 else '/home/user/rr/voice3/cand/F_v3c.wav'
ref=envl(bp(rd('dry'),300,3000)); e=envl(bp(rd(src),300,3000))
W=json.load(open(A+'/work/asr/v3_words.json'))['words']
rows=[]
for w in W:
    a=int((w['s']-0.03)*1000); b=int((w['e']+0.03)*1000); i=np.arange(a,b)
    cs=np.array([np.corrcoef(e[i],ref[i+L])[0,1] for L in range(-30,131)])
    L=int(np.argmax(cs))-30; c0=cs[30]; c85=cs[115]
    cls='E' if (L>=60 and c85-c0>0.05) else ('L' if (L<=25 and c0-c85>0.05) else '?')
    rows.append(dict(i=w['i'],w=w['w'],s=w['s'],e=w['e'],lag=L,r=round(float(cs.max()),2),r0=round(float(c0),2),r85=round(float(c85),2),cls=cls))
json.dump(rows,open('/home/user/rr/sound3/voice/final/wlag.json','w'),ensure_ascii=False,indent=0)
for r in rows:
    if 2<r['s']<47: print('%3d %6.2f-%6.2f %-14s lag %4d r %.2f r0 %.2f r85 %.2f %s'%(r['i'],r['s'],r['e'],r['w'],r['lag'],r['r'],r['r0'],r['r85'],r['cls']))
print('outside 47 s: classes',{c:sum(1 for r in rows if r['s']>=47 and r['cls']==c) for c in 'EL?'})
