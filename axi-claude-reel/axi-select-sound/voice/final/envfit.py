import sys; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
def envp(x,w=10):
    k=np.ones(int(w*48))/int(w*48); return np.convolve(x**2,k,'same')[::48]   # 1 ms grid power
ref=envp(bp(rd('dry'),300,6000))
L=85  # ms
for k in sys.argv[1:]:
    e=envp(bp(rd(k),300,6000))
    for nm,(a,b) in [('R1',(3.9,16.0)),('R2',(18.8,42.0)),('out',(43,84))]:
        i=np.arange(int(a*1000),int(b*1000))
        M=np.stack([ref[i],ref[i+L],ref[i-L]],1); y=e[i]
        c,*_=np.linalg.lstsq(M,y,rcond=None)
        # also scan lags
        cc=[np.corrcoef(y,ref[i+l])[0,1] for l in (-85,-40,0,40,85)]
        print(k.split('/')[-1].ljust(10),nm,'fit: same-time %.3f  +85ms(content of dry 85ms later) %.3f  -85ms %.3f  -> ratio(+85/same) %.1f dB'%(c[0],c[1],c[2],10*np.log10(max(c[1],1e-9)/max(c[0],1e-9))),' env corr at lag -85,-40,0,40,85:',' '.join('%.2f'%v for v in cc))
