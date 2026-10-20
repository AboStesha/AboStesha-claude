import os, json
fr='frames'; d={n: len(os.listdir(os.path.join(fr,n))) for n in sorted(os.listdir(fr))}
alias={'c14_eyes':'c01_man_phone','c16_walk':'c01_man_phone'}
for k,v in alias.items():
    if k not in d: d[k]=d[v]; os.symlink(v, os.path.join(fr,k)) if not os.path.exists(os.path.join(fr,k)) else None
open('clips.js','w').write('window.CLIPS = '+json.dumps(d)+';\n'); print(d)
