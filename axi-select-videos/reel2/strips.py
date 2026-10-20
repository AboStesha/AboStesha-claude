import subprocess, sys, glob, os
from PIL import Image, ImageDraw
out=sys.argv[1]; files=sys.argv[2:]
rows=[]
for f in files:
    ims=[]
    for t in [0,0.8,1.6,2.4,3.2,4.0,4.8]:
        p='/tmp/claude-0/-home-user-AboStesha-claude/22772119-7996-5fa2-836d-7b4be829514f/scratchpad/_s.png'
        subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',f,'-frames:v','1','-vf','scale=180:-1',p]); ims.append(Image.open(p).copy())
    r=Image.new('RGB',(180*7,ims[0].height+16),(30,30,30)); [r.paste(im,(i*180,16)) for i,im in enumerate(ims)]
    ImageDraw.Draw(r).text((4,2),os.path.basename(f),fill=(255,255,0)); rows.append(r)
sh=Image.new('RGB',(rows[0].width,sum(r.height for r in rows))); y=0
for r in rows: sh.paste(r,(0,y)); y+=r.height
sh.save(out)
