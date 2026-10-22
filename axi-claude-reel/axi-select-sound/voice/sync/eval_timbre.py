# timbre consistency of a fill: E(region) = cand 1/3-oct spectrum minus dry spectrum over the same sync window (the
# 'enhancer EQ' at that spot). A fill sounds like its neighbours when E(fill) ~ mean(E(pre), E(post)).
import sys, json
from synclib import *
D=rd(DRY)
def spec(x,a,b): return band_db(x[T(a):T(b)],FC)
def E(X,a,b): return spec(X,a,b)-spec(D,a,b)
def run(X,pre,fill,post):
    e0=E(X,*pre); e1=E(X,*fill); e2=E(X,*post); ref=(e0+e2)/2
    m=(FC>=200)&(FC<=8000)
    dev=e1-ref
    return dict(rms_dev_db=round(float(np.sqrt((dev[m]**2).mean())),2),level_dev_db=round(float(dev[m].mean()),2),
                tilt_dev_db=round(float(dev[(FC>=2000)&(FC<=8000)].mean()-dev[(FC>=200)&(FC<1000)].mean()),2),
                pre_vs_post_rms=round(float(np.sqrt(((e0-e2)[m]**2).mean())),2))
J={'J1':((3.60,3.665),(3.70,3.785),(3.80,3.855)),'J3':((14.395,14.445),(14.455,14.545),(14.56,14.64)),'J5':((18.56,18.655),(18.67,18.775),(18.805,18.86))}
for nm in sys.argv[1:]:
    X=rd(nm)
    for j,(p,f,q) in J.items(): print(nm,j,json.dumps(run(X,p,f,q)))
