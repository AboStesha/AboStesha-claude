# phrase-start ghost: level in the window where the ghost of the first word lands (85 ms before the main onset), dB re the first 80 ms of the word, 300-6000 Hz
import sys; sys.path.insert(0,'/home/user/rr/sound3/voice/final'); from glib import *
def env(x,w=5,hp=1):
    k=np.ones(int(w*48))/int(w*48); return np.convolve(x**2,k,'same')[::int(hp*48)]
e0=db(env(bp(rd('dry'),300,6000)))
PZ=[(5.53,5.68),(8.7,8.98),(9.84,10.21),(15.09,15.31),(20.13,20.32),(20.9,21.17),(21.74,21.98),(23.6,23.8),(26.3,26.47),(27.63,27.73),(27.98,28.12),(28.92,29.15),(30.18,30.27),(31.61,31.7),(31.95,32.4),(32.9,32.99),(36.28,36.53),(37.48,37.56),(38.55,38.75),(40.01,40.15),(41.42,41.55)]
def ms(x,a,b): return float(np.mean(x[int(a*SR):int(b*SR)]**2))+1e-30
res={}
for k in sys.argv[1:]:
    xb=bp(rd(k),300,6000); row=[]
    for A,B in PZ:
        j0=int((A+0.02)*1000); seg=e0[j0:int((B+0.3)*1000)]; on=(j0+np.where(seg>=seg.max()-12)[0][0])/1000
        a=max(A+0.03,on-0.0853); b=on-0.005
        row.append(round(db(ms(xb,a,b)/ms(xb,on,on+0.08)),1))
    res[k]=row
    print(k.split('/')[-1].ljust(12),'median %.1f  max %.1f | '%(np.median(row),np.max(row))+' '.join('%.0f'%v for v in row))
