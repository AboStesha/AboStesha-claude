# full transcript (asr_v.py JSON) vs the SUBS list of edl_build.py: normalised word sequences aligned with difflib over
# the whole text; every difference is reported with its subtitle line number.
import json, sys, re, difflib
src=open('/home/user/rr/axi-select-ch2/work/edl_build.py',encoding='utf-8').read()
SUBS=eval(src[src.index('SUBS = [')+7:src.index(']\n',src.index('SUBS = ['))+1])
def norm(s):
    s=re.sub('[ً-ْٰـ]','',s); s=s.replace('⁦','').replace('⁩','')
    s=re.sub('[إأآا]','ا',s); s=s.replace('ى','ي').replace('ة','ه'); s=re.sub(r'[!،,.؟?%]',' ',s)
    s=s.replace('1,000','1000').replace('2,000','2000').replace('10,000','10000').replace('20,000','20000')
    return s.split()
A=[];AL=[]
for i,(a,b,t) in enumerate(SUBS):
    for w in norm(t): A.append(w); AL.append(i+1)
res={}
for path in sys.argv[1:]:
    d=json.load(open(path)); B=norm(" ".join(s['t'] for s in d['segs']))
    sm=difflib.SequenceMatcher(a=A,b=B,autojunk=False); out=[]
    for op,i1,i2,j1,j2 in sm.get_opcodes():
        if op=='equal': continue
        ln=AL[i1] if i1<len(AL) else AL[-1]
        out.append(("L%02d"%ln," ".join(A[i1:i2])," ".join(B[j1:j2])))
    res[path]=out
    print(path.split('/')[-1],"differences: %d (SUBS %d words, ASR %d words)"%(len(out),len(A),len(B)))
    for o in out: print("  %s  sub «%s»  asr «%s»"%o)
