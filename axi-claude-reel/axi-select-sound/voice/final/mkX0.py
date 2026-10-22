# X0 = the client's enhanced voice without any borrowed treble (eng0 = F_v3c x finalize gain), levelled exactly as vo2_v3 (gs, trim)
import sys; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
F='/home/user/rr/sound3/voice/final/'
c,_=sf.read('/home/user/rr/voice3/cand/F_v3c.wav'); sf.write(F+'eng0.wav',c*10**((-24.9-(-24.8))/20),SR,subtype='PCM_24')
gs=np.load(F+'rep_v3_gs.npy'); trim=float(open(F+'rep_v3_trim.txt').read())
x=rd(F+'eng0.wav'); x=x*10**(gs/20); x=x*10**(trim/20); sf.write(F+'X0.wav',x,SR,subtype='FLOAT'); print('ok')
