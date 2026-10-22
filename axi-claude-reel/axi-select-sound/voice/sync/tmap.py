# vo2_final (VO) time -> vo2_sync time: the moved (early-timed) stretches are delayed by 4094 samples; the on-time islands
# («قبل» 14.065-14.466, «في» 28.870-28.990) and everything outside the zone keep their time.
D_S=4094/48000
MOVED=[(3.690,14.065),(14.466,15.958),(18.700,28.870),(28.990,44.704)]
def f2s(t):
    for a,b in MOVED:
        if a<=t<b: return t+D_S
    return t
