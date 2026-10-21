# build audio/vo/vo2_patched.wav = vo2_clean.wav with the HF band of 4 noise-burst spans replaced by a better separation.
# Below the crossover the clean (Mel-Roformer) signal is kept untouched; samples outside the patch ranges are copied bit-exactly.
import sys, json, struct; sys.path.insert(0,'/home/user/rr/axi-select-ch2/work/vofix2/scripts')
import numpy as np, soundfile as sf
from common import W2, V, SR, L, lp, hp, bp
CLEAN=W2+'/audio/vo/vo2_clean.wav'; OUT=W2+'/audio/vo/vo2_patched.wav'
OFF=32.0; FD=0.020; G=10**(3.0/20)     # stems are 3.0 dB below vo2_clean (measured on undamaged speech, all bands within 0.2 dB / 1.0 dB)
cur_i,sr=sf.read(CLEAN,dtype='int32',always_2d=True); info=sf.info(CLEAN)
assert sr==SR and cur_i.shape[1]==1 and info.subtype=='PCM_24'
cur_i=cur_i[:,0].copy(); N=len(cur_i); cur=cur_i.astype(np.float64)/2**31
BETA=L('raw_melband_roformer_big_beta5e__vocals')*G          # Mel-Roformer big beta5e on the raw
CAS =L('mdx_vocals_mel_band_roformer__vocals')*G             # MDX23C-8KFFT-InstVoc_HQ on the raw, then vocals_mel_band_roformer on that
n=len(BETA); t=OFF+np.arange(n)/SR
W25=0.75*BETA+0.25*CAS; W15=0.85*BETA+0.15*CAS
# window 1 source: BETA, with «هذا» (VO 35.67-35.93) from 0.5 BETA + 0.5 CAS (QA round 2: BETA alone left it ~8 dB dull at
# 6-12 kHz against «هذا» at VO 46.76); amplitude-complementary 20 ms crossfades (correlated signals)
u1=np.clip((t-(35.67-FD/2))/FD,0,1)*np.clip(((35.93+FD/2)-t)/FD,0,1); u1=np.sin(0.5*np.pi*u1)**2
S1=(1-u1)*BETA+u1*(0.5*BETA+0.5*CAS)
# window 3 source: CAS for the /s/ of «ستقوم», BETA for «تقوم»; amplitude-complementary 20 ms crossfade at 38.930 (correlated signals)
u=np.clip((t-(38.930-FD/2))/FD,0,1); u=np.sin(0.5*np.pi*u)**2
S3=(1-u)*CAS+u*BETA
# window 4 source: 0.85 BETA + 0.15 CAS for «عشرة آلا», CAS for the final /f/ of «آلاف» from 41.33 (same complementary 20 ms crossfade)
u4=np.clip((t-(41.330-FD/2))/FD,0,1); u4=np.sin(0.5*np.pi*u4)**2
S4=(1-u4)*W15+u4*CAS
PLAN=[ # (name, start, end, band lo, band hi, source, source name)
 ('S1 «أضعاف هذا المبلغ»',35.085,36.310,3000,None,S1,'big_beta5e; «هذا» 0.5 big_beta5e + 0.5 MDX23C>MBR'),
 ('S2 «ألف دولار»',       37.990,38.555,3500,None,W25,'0.75 big_beta5e + 0.25 MDX23C>MBR'),
 ('S3 «ستقوم»',           38.735,39.205,3500,None,S3,'MDX23C>MBR (/s/, to 38.93) then big_beta5e'),
 ('S4 «عشرة آلاف»',       40.620,41.465,3500,None,S4,'0.85 big_beta5e + 0.15 MDX23C>MBR, then MDX23C>MBR for the final /f/ from 41.33')]
s0x=int(round(OFF*SR)); c=cur[s0x:s0x+n].copy(); y=c.copy(); log=[]
def band(x,lo,hi): return hp(x,lo) if hi is None else bp(x,lo,hi)
for name,a,b,lo,hi,src,sname in PLAN:
    w=np.sin(0.5*np.pi*np.clip((t-(a-FD/2))/FD,0,1))*np.cos(0.5*np.pi*np.clip((t-(b-FD/2))/FD,0,1))
    wc=np.sqrt(1-w**2)                          # equal-power fades
    cb=band(c,lo,hi); xb=band(src,lo,hi)
    y=y+(wc-1)*cb+w*xb
    s_a=int(np.floor((a-FD/2)*SR)); s_b=int(np.ceil((b+FD/2)*SR))+1
    log.append(dict(name=name,vo_window=[a,b],fade_ms=FD*1000,band_hz=[lo,hi if hi else 24000],source=sname,samples=[s_a,s_b],times=[s_a/SR,s_b/SR]))
out_i=cur_i.copy()
mask=np.zeros(N,bool)
for p in log:
    s_a,s_b=p['samples']; mask[s_a:s_b]=True
seg=y[(np.arange(N)[mask])-s0x]
q=np.clip(np.round(seg*2**23),-2**23,2**23-1).astype(np.int64)
out_i[mask]=(q<<8).astype(np.int32)
# write by patching the data bytes of a copy of vo2_clean.wav (header/format chunks identical)
b=bytearray(open(CLEAN,'rb').read()); i=12; doff=None
while i<len(b)-8:
    cid=bytes(b[i:i+4]); sz=struct.unpack('<I',b[i+4:i+8])[0]
    if cid==b'data': doff=i+8; break
    i+=8+sz+(sz&1)
v24=(out_i>>8).astype('<i4')
for p in log:
    s_a,s_b=p['samples']; raw=v24[s_a:s_b].tobytes(); seg3=b''.join(raw[k:k+3] for k in range(0,len(raw),4))
    b[doff+3*s_a:doff+3*s_b]=seg3
open(OUT,'wb').write(bytes(b))
json.dump(dict(out=OUT,base=CLEAN,stem_gain_db=3.0,spans=log),open(V+'/build_patch.json','w'),indent=1,ensure_ascii=False)
for p in log: print(p['name'],p['samples'],[round(x,4) for x in p['times']],p['band_hz'],p['source'])
print('wrote',OUT)
