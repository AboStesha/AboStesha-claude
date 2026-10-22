# final = vo2_v3 + exact deltas (zone echo removal, zone treble re-done with the aligned original, sibilant-restore removal, steps 2-3);
# samples where no step acts stay bit-identical to vo2_v3.wav
import sys,json,os; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
F='/home/user/rr/sound3/voice/final/'
OUT=sys.argv[1]; EXTRA=sys.argv[2:]
v3i=rdi('v3').astype(np.int64)
gs=np.load(F+'rep_v3_gs.npy'); trim=float(open(F+'rep_v3_trim.txt').read())
def G(x): y=x*10**(gs/20); return y*10**(trim/20)
eng=rd('eng'); eng0=rd(F+'eng0.wav'); p2=rd('p2')
MZ=[(3.60,16.45),(18.45,45.30)]
mz=np.zeros(N)
for a,b in MZ: mz[int(a*SR):int(b*SR)]=1
D_sib=G(eng0)-G(eng)                       # undo the 8 mis-timed sibilant inserts (all inside the zone)
D_oldhf=-(G(p2)-G(eng))*mz                 # remove the old zone treble patches (mis-timed by 85 ms)
SUPP=os.environ.get('SUPP','X0s4_delta.npy'); HF=os.environ.get('HF','Y5_delta.npy')
D_echo=-np.load(F+'sub2.npy')+np.load(F+SUPP)
D_hf=np.load(F+HF)
D=D_sib+D_oldhf+D_echo+D_hf
for p in EXTRA: D=D+np.load(p)
MK=float(os.environ.get('MAKEUP_DB','0'))
if MK!=0:   # zone make-up for the energy of the removed copy; ramps sit in gaps: 3.70-3.78, 16.30-16.40, 18.50-18.58, 45.07-45.15
    tt=np.arange(N)/SR; mk=np.zeros(N)
    for a0,a1,b0,b1 in [(3.70,3.78,16.30,16.40),(18.50,18.58,45.07,45.15)]:
        mk=np.maximum(mk,np.clip((tt-a0)/(a1-a0),0,1)*np.clip((b1-tt)/(b1-b0),0,1))
    mk=np.sin(0.5*np.pi*mk)**2
    D=D+mk*(10**(MK/20)-1)*(v3i/2**31+D)
for p in [q for q in os.environ.get('POST','').split(',') if q]: D=D+np.load(F+p)     # deltas computed on the made-up signal
d=np.round(D*2**23).astype(np.int64)
out=v3i+d*256
assert out.max()<2**31 and out.min()>=-2**31
sf.write(F+OUT,out.astype(np.int32),SR,subtype='PCM_24')
ch=np.nonzero(d)[0]
# changed runs (gap > 20 ms splits)
runs=[]; s=ch[0]; pv=ch[0]
for i in ch[1:]:
    if i-pv>960: runs.append((s/SR,pv/SR)); s=i
    pv=i
runs.append((s/SR,pv/SR))
json.dump([[round(a,3),round(b,3)] for a,b in runs],open(F+OUT.replace('.wav','_changed_runs.json'),'w'))
print('changed samples',len(ch),'(%.2f s), %d runs; first %.3f last %.3f'%(len(ch)/SR,len(runs),ch[0]/SR,ch[-1]/SR))
