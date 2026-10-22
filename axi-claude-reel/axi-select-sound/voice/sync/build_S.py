# no-dry candidate: anchored DP-WSOLA local stretches at J1/J3 (both ends sample-identical to the unshifted / shifted
# signal, so the only joins are the WSOLA's own 12 ms Hann overlaps), J5 = re-use of his own vowel (one cut in the dip)
import sys, json
from synclib import *
d=4094; F=rd(FINAL); F0=F; Fd=shift(F,d)
S={'F0':F0,'Fd':Fd}
def stretch(in_a,in_b,out_a,o_last_target,frame=1152,tol=288):
    H=frame//2; oa=T(out_a); K=int(round((T(o_last_target)-oa)/H))+1; o_last=oa+(K-1)*H
    y,pos,_=wsola_dp(F,T(in_a),T(in_b),oa,o_last+frame,o_last-d,frame=frame,tol=tol,step=4)
    W=np.zeros(N); W[oa:oa+len(y)]=y
    return W,oa,o_last,pos
meta={}
W1,oa1,ol1,p1=stretch(3.665,3.745,3.665,3.821); S['W1']=W1
W3,oa3,ol3,p3=stretch(14.330,14.450,14.330,14.551); S['W3']=W3
H=576
cuts=[((oa1+H/2)/SR,6,'W1'),((ol1+H+H/2)/SR,6,'Fd'),(14.150,20,'F0'),((oa3+H/2)/SR,6,'W3'),((ol3+H+H/2)/SR,6,'Fd'),
      (16.046,10,'F0'),(18.7838,8,'Fd'),(44.789,10,'F0')]
out,info=compose(S,'F0',cuts)
meta['cuts']=info; meta['W1']=dict(src=[3.665,round((ol1-d)/SR,4)],out=[3.665,round((ol1+1152)/SR,4)],pos=[int(p) for p in p1])
meta['W3']=dict(src=[14.33,round((ol3-d)/SR,4)],out=[14.33,round((ol3+1152)/SR,4)],pos=[int(p) for p in p3])
sf.write('cand3_S.wav',out,SR,subtype='PCM_24'); json.dump(meta,open('cand3_S.json','w'),indent=1)
print(json.dumps(meta['cuts'])); print(meta['W1']['src'],meta['W1']['out'],meta['W3']['src'],meta['W3']['out'])
