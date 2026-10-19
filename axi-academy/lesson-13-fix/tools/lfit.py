import numpy as np, json
src=open('pfit.py').read().split('p=np.array([1.0')[0]
src=src.replace('WY0,WY1,WX0,WX1=672,796,700,872','WY0,WY1,WX0,WX1=684,792,700,734')
exec(src)
prev=json.load(open('pfit.json'))
for n in range(155,161):
    tgt=ld(f'fr/{n:04d}.png')[Y0:Y1,X0:X1]
    p=np.array([1.0]+prev[str(n)]['p'][1:]); g0,_=err(np.array(prev[str(n)]['p']),tgt)
    best,coef=err(p,tgt); st=np.array([0,0.25,0.25,0.25,0.3])
    for it in range(80):
        improved=False
        for i in range(1,5):
            for sgn in (1,-1):
                q=p.copy(); q[i]=max(0,q[i]+sgn*st[i]) if i>=3 else q[i]+sgn*st[i]
                e,c=err(q,tgt)
                if e<best-1e-4: best,coef,p=e,c,q; improved=True; break
        if not improved:
            st*=0.5
            if st[1]<0.02: break
    print(n,'local: dx %.2f dy %.2f bx %.2f by %.2f'%tuple(p[1:]),'gain %.3f rms %.2f'%(coef[0],best),' (global params on this window: rms %.2f)'%g0)
    full=ld(f'fr/{n:04d}.png'); full[Y0:Y1,X0:X1]+=coef[0]*model(p,D)
    Image.fromarray(np.clip(full+0.5,0,255).astype(np.uint8)).save(f'out2/{n:04d}.png')
