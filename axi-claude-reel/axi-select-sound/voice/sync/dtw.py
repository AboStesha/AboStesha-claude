# DTW of X[t0,t1] against dry[t0+o0, t1+o1] with log-mel features; prints mapping x-time -> dry-time
from slib import *
import sys
from scipy.signal import stft
def feats(x):
    f,t,Z=stft(x,fs=SR,nperseg=960,noverlap=960-240)   # 20 ms, 5 ms hop
    S=np.abs(Z)**2
    # mel-ish bands 100-8000 Hz, 40 bands log-spaced
    edges=np.geomspace(100,8000,41); M=np.zeros((40,len(f)))
    for i in range(40): M[i]=(f>=edges[i])&(f<edges[i+1])
    E=np.log10(M@S+1e-10)
    lev=E.max(0)
    from scipy.fft import dct
    C=dct(E,axis=0,norm='ortho')[1:16]   # drop c0 (level)
    return C.T, 10*np.log10(S.sum(0)+1e-12)
X=load(sys.argv[1]); D=load("dry")
t0,t1=float(sys.argv[2]),float(sys.argv[3]); pad=float(sys.argv[4]) if len(sys.argv)>4 else 0.15
a=int(t0*SR); b=int(t1*SR)
FX,LX=feats(X[a:b]); FD,LD=feats(D[a-int(pad*SR):b+int(pad*SR)])
n,m=len(FX),len(FD)
C=((FX[:,None,:]-FD[None,:,:])**2).sum(2)
# weight by level so silence matters less
w=np.clip((LX-LX.max()+50)/50,0.05,1); C=C*w[:,None]
acc=np.full((n,m),np.inf); acc[0,:]=C[0,:]   # open start
bp=np.zeros((n,m),int)
for i in range(1,n):
    prev=acc[i-1]
    # steps: (i-1,j-1) diag, (i-1,j) vertical, (i-1,j-2) skip one (allows 2x speed)
    c1=prev; c2=np.concatenate([[np.inf],prev[:-1]]); c3=np.concatenate([[np.inf,np.inf],prev[:-2]])
    st=np.stack([c2,c1*1.0+0.5,c3+0.5]); k=st.argmin(0); acc[i]=st.min(0)+C[i]; bp[i]=k
j=int(np.argmin(acc[-1])); path=[]
for i in range(n-1,-1,-1):
    path.append((i,j)); k=bp[i,j]; j=j-[1,0,2][k]
path=path[::-1]
hop=240/SR
for i,j in path[::2]:
    tx=t0+i*hop; td=t0-pad+j*hop
    print("%.3f -> %.3f  off %+6.1f ms  lev %5.1f"%(tx,td,(td-tx)*1000,LX[i]-LX.max()))
