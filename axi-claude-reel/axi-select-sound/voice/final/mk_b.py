import sys; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
from scipy.signal import butter, sosfiltfilt
sub=np.load('sub.npy'); W=np.load('p2_dry_W.npy')
dc=-sub; hp=sosfiltfilt(butter(4,3500,'highpass',fs=SR,output='sos'),dc)
de=dc-W*hp
a=rdi('v3a.wav').astype(np.int64)
q=np.round(de*2**23).astype(np.int64)*256
out=np.clip(a+q,-2**31,2**31-256).astype(np.int32)
sf.write(sys.argv[1] if len(sys.argv)>1 else 'v3b.wav',out,SR,subtype='PCM_24')
ch=np.nonzero(q)[0]; print('samples changed by canceller',len(ch),'%.3f-%.3f'%(ch[0]/SR,ch[-1]/SR))
