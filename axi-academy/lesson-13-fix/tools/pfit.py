import numpy as np, json
from PIL import Image
ld=lambda p:np.asarray(Image.open(p).convert('RGB'),dtype=np.float64)
Y0,Y1,X0,X1=600,860,640,940          # working crop
WY0,WY1,WX0,WX1=672,796,700,872      # error window: the whole "100$" (inside the crop)
f150=ld('fr/0150.png')[Y0:Y1,X0:X1]; o150=ld('out/0150.png')[Y0:Y1,X0:X1]
D=o150-f150
xs=np.arange(X0,X1); w=np.clip((735.5-xs)/3.0,0,1); w[xs<684]=0
D=D*w[None,:,None]; ys=np.arange(Y0,Y1); D[(ys<690)|(ys>782)]=0
CX,CY=780,735
yy,xx=np.mgrid[Y0:Y1,X0:X1].astype(np.float64)
def gk(s):
    if s<0.05: return np.array([1.0])
    r=int(np.ceil(3*s)); t=np.arange(-r,r+1); k=np.exp(-t*t/(2*s*s)); return k/k.sum()
def blur(img,sx,sy):
    out=img
    for ax,s in ((1,sx),(0,sy)):
        k=gk(s); r=len(k)//2
        if r==0: continue
        pad=[(0,0)]*out.ndim; pad[ax]=(r,r); p=np.pad(out,pad,mode='edge'); acc=np.zeros_like(out)
        for i,kv in enumerate(k):
            sl=[slice(None)]*out.ndim; sl[ax]=slice(i,i+out.shape[ax]); acc+=kv*p[tuple(sl)]
        out=acc
    return out
def warp(img,s,dx,dy):
    sx=(xx-CX-dx)/s+CX-X0; sy=(yy-CY-dy)/s+CY-Y0
    x0=np.floor(sx).astype(int); y0=np.floor(sy).astype(int); fx=sx-x0; fy=sy-y0
    x0=np.clip(x0,0,img.shape[1]-2); y0=np.clip(y0,0,img.shape[0]-2)
    if img.ndim==3: fx=fx[...,None]; fy=fy[...,None]
    a=img[y0,x0]; b=img[y0,x0+1]; c=img[y0+1,x0]; d=img[y0+1,x0+1]
    return (a*(1-fx)+b*fx)*(1-fy)+(c*(1-fx)+d*fx)*fy
def model(p,src):
    s,dx,dy,bx,by=p
    return blur(warp(src,s,dx,dy),bx,by)
win=(slice(WY0-Y0,WY1-Y0),slice(WX0-X0,WX1-X0))
def err(p,tgt):
    m=model(p,f150)[win].reshape(-1,3); t=tgt[win].reshape(-1,3)
    # per-channel gain + bias plane fitted linearly (shared gain across channels)
    X=np.stack([m.ravel(),np.repeat(np.ones(m.shape[0]),3),np.repeat((xx[win].ravel()-CX)/100,3),np.repeat((yy[win].ravel()-CY)/100,3)],1)
    coef,*_=np.linalg.lstsq(X,t.ravel(),rcond=None)
    r=t.ravel()-X@coef
    return np.sqrt((r*r).mean()),coef
p=np.array([1.0,0.0,0.0,0.0,0.0])
steps=np.array([0.004,0.5,0.5,0.4,0.6])
lo=np.array([0.95,-4,-14,0,0]); hi=np.array([1.08,4,4,6,12])
res={}
for n in range(155,161):
    tgt=ld(f'fr/{n:04d}.png')[Y0:Y1,X0:X1]
    best,coef=err(p,tgt); st=steps.copy()
    for it in range(60):
        improved=False
        for i in range(5):
            for sgn in (1,-1):
                q=p.copy(); q[i]=np.clip(q[i]+sgn*st[i],lo[i],hi[i])
                e,c=err(q,tgt)
                if e<best-1e-4: best,coef,p=e,c,q; improved=True; break
        if not improved:
            st*=0.5
            if st[1]<0.03: break
    res[n]=dict(p=p.tolist(),rms=best,gain=coef[0])
    print(n,'s %.4f dx %.2f dy %.2f bx %.2f by %.2f'%tuple(p),'gain %.3f rms %.2f'%(coef[0],best))
    full=ld(f'fr/{n:04d}.png'); add=coef[0]*model(p,D)
    full[Y0:Y1,X0:X1]+=add
    Image.fromarray(np.clip(full+0.5,0,255).astype(np.uint8)).save(f'out2/{n:04d}.png')
json.dump(res,open('pfit.json','w'),indent=1)
