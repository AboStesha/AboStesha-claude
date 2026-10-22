#!/bin/bash
# Rebuild of vo2_final.wav (video 2 voice) from the client's enhanced voice. Run from /home/user/rr/sound3/voice/final.
set -e
cd /home/user/rr/sound3/voice/final
# 0. reproduce the vo2_v3 chain exactly (proof + the level gain): hfpatch (KEEP 11.78-12.00) then level.py (GMAX 12)
KEEP=11.78-12.00 python3 hfp.py eng pat rep_pat.wav /home/user/rr/voice3/ver/spansF.json      # == v3p2.wav (md5 df6fd1f5...)
python3 lev.py rep_pat.wav rep_v3.wav                                                         # == vo2_v3.wav (md5 9550ae70...), writes rep_v3_gs.npy / rep_v3_trim.txt
# 1. base without the mis-timed sibilant inserts, levelled like v3; timing maps
python3 mkX0.py                                   # eng0.wav, X0.wav
python3 -c "import sys; sys.path.insert(0,'.'); from glib import *; d=rd('dry'); a=np.zeros(N); a[:-4094]=d[4094:]; sf.write('dryA.wav',a,SR,subtype='FLOAT')"
python3 wlag.py > /dev/null                       # per-word lag map (wlag.json)
python3 wdom.py X0.wav > /dev/null                # per-word dominance E/L (wdom.json)
# 2. trailing-copy removal: linear (coherent part) then reference-based suppression (incoherent part)
python3 cancel2.py                                # sub2.npy, X0c.wav
WCAP=1 KAPT=1.6 GMINT=-35 python3 supp.py X0c.wav X0s4.wav     # X0s4_delta.npy
# 3. treble repair with the original take aligned to the enhanced timing
python3 eqz.py
python3 hfmap.py X0s4.wav > /dev/null; python3 hfspans2.py -10 hfspans_v2.json
python3 onsfric.py X0s4.wav > /dev/null; cp onsfric.json onsfric_X0s4.json
python3 hfz2.py X0s4.wav Y6.wav hfspans_v2.json onsfric_X0s4.json > hfz2_Y6.log        # Y6_delta.npy
# 4. step-3 clean-ups (outside the zone)
python3 fix3.py                                   # d3.npy
# 5. compose (v3 + deltas, +0.4 dB zone make-up), then the phrase-end release treatment
HF=Y6_delta.npy MAKEUP_DB=0.4 python3 compose2.py cand7.wav d3.npy
python3 tailfix.py cand7.wav > /dev/null           # dtail.npy
HF=Y6_delta.npy MAKEUP_DB=0.4 POST=dtail.npy python3 compose2.py cand9.wav d3.npy
md5sum cand9.wav   # e21823edf7fcc70ff08a50aa5a5f92f8 -> copied to /home/user/rr/axi-select-ch2/audio/vo/vo2_final.wav
