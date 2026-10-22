import sys,json; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
x=rd(sys.argv[1]); h=np.load('h_post.npy')
s1=bp(x,300,6000); cpost=bp(postcopy(x,h),300,6000); cpre=bp(precopy(x,h),300,6000)
cls={r['i']:r for r in json.load(open('wlag.json'))}
def g(c,i0,i1): return np.dot(s1[i0:i1],c[i0:i1])/(np.dot(c[i0:i1],c[i0:i1])+1e-30)
def lev(gv,c,i0,i1,a,b): return db(max(gv,0)**2*np.sum(c[i0:i1]**2)/(np.sum(s1[int(a*SR):int(b*SR)]**2)+1e-30))
for w in V3W:
    a,b=w['s'],w['e']
    if b-a<0.08 or not (3.5<a<45.2): continue
    ip0,ip1=int((a+DL)*SR),int((b+DL)*SR); iq0,iq1=int((a-DL)*SR),int((b-DL)*SR)
    gp=g(cpost,ip0,ip1); gq=g(cpre,iq0,iq1)
    r=cls[w['i']]
    print('%6.2f-%6.2f %-12s %s lag %4d | post %5.2f (%6.1f dB)  pre %5.2f (%6.1f dB)'%(a,b,w['w'],r['cls'],r['lag'],gp,lev(gp,cpost,ip0,ip1,a,b),gq,lev(gq,cpre,iq0,iq1,a,b)))
