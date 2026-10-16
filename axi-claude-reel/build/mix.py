import subprocess,sys
S=sys.argv[1]; A=f'{S}/audio'
ev=[(0.0,'whoosh',.35)]+[(t,'whoosh',.45) for t in [4.20,7.46,19.88,21.16,25.70,31.10,34.28,36.14,38.44]]
ev+=[(1.85,'pop',.6),(4.45,'pop',.4),(21.30,'pop',.5),(25.84,'pop',.5),(31.24,'pop',.5),(34.42,'pop',.5),(39.0,'pop',.6),(9.90,'pop',.35),(15.55,'pop',.35),(40.5,'pop',.35)]
ev+=[(10.84,'boom',.85),(15.86,'chime',.45),(34.55,'chime',.55)]
typ=[(7.75,1.8),(14.30,1.0)]
inp=['-i',f'{S}/avatar/avatar.mp4','-i',f'{A}/music.mp3']; fc=[]; labels=[]
fc.append('[0:a]aresample=48000,highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,loudnorm=I=-15:TP=-1.5:LRA=7,apad=whole_dur=43.36,asplit=2[vo][sc]')
fc.append('[1:a]aresample=48000,atrim=0:43.36,volume=0.30,afade=t=in:d=0.4,afade=t=out:st=41.8:d=1.5[mu0]')
fc.append('[mu0][sc]sidechaincompress=threshold=0.05:ratio=4:attack=20:release=300[mu]')
i=2
for t,n,v in ev:
    inp+=['-i',f'{A}/{n}.mp3']; d=int(t*1000)
    fc.append(f'[{i}:a]aresample=48000,volume={v},adelay={d}|{d}[e{i}]'); labels.append(f'[e{i}]'); i+=1
for t,du in typ:
    inp+=['-i',f'{A}/typing.mp3']; d=int(t*1000)
    fc.append(f'[{i}:a]aresample=48000,atrim=0:{du},afade=t=out:st={du-0.2}:d=0.2,volume=0.35,adelay={d}|{d}[e{i}]'); labels.append(f'[e{i}]'); i+=1
fc.append(f'[vo][mu]{"".join(labels)}amix=inputs={2+len(labels)}:normalize=0:duration=longest,alimiter=limit=0.89,atrim=0:43.36[out]')
cmd=['ffmpeg','-v','error','-y',*inp,'-filter_complex',';'.join(fc),'-map','[out]','-ac','2','-c:a','pcm_s16le',f'{S}/work/main_audio.wav']
subprocess.run(cmd,check=True); print('ok')
