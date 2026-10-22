# ASR vs subtitles (SUBS of work/edl_build.py), line by line
import json,re,sys,ast
src=open('/home/user/rr/axi-select-ch2/work/edl_build.py').read()
m=re.search(r'SUBS = \[(.*?)\n\]',src,re.S); SUBS=ast.literal_eval('['+m.group(1)+']')
R={}
for f in sys.argv[1:]:
    R.update(json.load(open(f)))
def norm(s):
    s=re.sub('[ً-ْـ⁦-⁩]','',s); s=re.sub('[أإآ]','ا',s); s=s.replace('ى','ي').replace('ة','ه')
    s=s.replace('،',' ').replace('!',' ').replace('.',' ').replace(',','')
    for a,b in [('Axi Select','اكسي سيلكت'),('Incubation','انكيوبيشن'),('Edge Score','ادج سكور'),('Acceleration','اكسيليريشن'),('الـ ','ال')]: s=s.replace(a,b)
    return ' '.join(s.split())
W={k:[w for seg in v for w in seg['w']] for k,v in R.items()}
rows=[]
for i,(a,b,t) in enumerate(SUBS):
    nxt=SUBS[i+1][0] if i+1<len(SUBS) else 99
    out={}
    for k,ws in W.items():
        out[k]=' '.join(w['w'] for w in ws if a-0.12<=(w['s']+w['e'])/2<min(b+0.12,nxt-0.02))
    rows.append((i+1,a,b,t,out))
keys=list(W.keys())
for n,a,b,t,out in rows:
    flags=['=' if norm(out[k])==norm(t) else '≠' for k in keys]
    print('L%02d %5.2f-%5.2f SUB: %s'%(n,a,b,t)); 
    for k,fl in zip(keys,flags): print('      %s %-6s %s'%(fl,k,out[k]))
