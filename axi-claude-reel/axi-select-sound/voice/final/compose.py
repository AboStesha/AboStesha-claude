# final = vo2_v3 outside the zone masks (bit-identical), zone construction inside; delta-quantised so untouched samples stay bit-identical
import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
ZIN=sys.argv[1]; OUT=sys.argv[2]; EXTRA=sys.argv[3:]   # extra delta npy files (float, full length) for steps 2-3
v3i=rdi('v3').astype(np.int64); v3=v3i/2**31
z=rd(ZIN)
MZ=[(3.60,16.45),(18.45,45.30)]
m=np.zeros(N,bool)
for a,b in MZ: m[int(a*SR):int(b*SR)]=True
for a,b in MZ:
    for tb in (a,b):
        i=int(tb*SR); print('boundary %.2f: |zone-v3| max over +-5 ms = %.2e (LSB=%.2e)'%(tb,np.abs(z[i-240:i+240]-v3[i-240:i+240]).max(),2**-23))
y=np.where(m,z,v3)
for p in EXTRA: y=y+np.load(p)
d=np.round((y-v3)*2**23).astype(np.int64)
out=v3i+d*256
assert out.max()<2**31 and out.min()>=-2**31
sf.write(OUT,out.astype(np.int32),SR,subtype='PCM_24')
ch=np.nonzero(d)[0]; print('changed samples',len(ch),'span %.3f-%.3f'%(ch[0]/SR,ch[-1]/SR) if len(ch) else '')
