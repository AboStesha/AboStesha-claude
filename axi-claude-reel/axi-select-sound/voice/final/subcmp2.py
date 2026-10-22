# ASR vs subtitles: global word alignment (difflib) of the whole transcript against SUBS; prints every non-matching stretch with its line
import json,re,sys,ast,difflib
src=open('/home/user/rr/axi-select-ch2/work/edl_build.py').read()
m=re.search(r'SUBS = \[(.*?)\n\]',src,re.S); SUBS=ast.literal_eval('['+m.group(1)+']')
def norm(s):
    s=re.sub('[ً-ْـ⁦-⁩]','',s); s=re.sub('[أإآ]','ا',s); s=s.replace('ى','ي').replace('ة','ه')
    for a,b in [('،',' '),('!',' '),('.',' '),('%',' %'),(',',''),('الـ ','ال')]: s=s.replace(a,b)
    return s.split()
NUM={'1000':['الف'],'10000':['عشره','الاف'],'2000':['الفين'],'20000':['عشرين','الف'],'40':['اربعين'],'60':['ستين'],'7':['سبعه'],'10':['عشره']}
sub=[]
for i,(a,b,t) in enumerate(SUBS):
    for w in norm(t): sub.append((w,i+1))
for f in sys.argv[1:]:
    R=json.load(open(f))
    for k,segs in R.items():
        asr=[]
        for s in segs: asr+=norm(s['t'])
        A=[w for w,_ in sub]; sm=difflib.SequenceMatcher(a=A,b=asr,autojunk=False)
        print('==',k,'match ratio %.3f'%sm.ratio())
        for op,i1,i2,j1,j2 in sm.get_opcodes():
            if op=='equal': continue
            lines=sorted({sub[i][1] for i in range(i1,i2)}) or [sub[min(i1,len(sub)-1)][1]]
            print('  L%s  SUB: %-28s  ASR: %s'%(','.join('%02d'%l for l in lines),' '.join(A[i1:i2]),' '.join(asr[j1:j2])))
