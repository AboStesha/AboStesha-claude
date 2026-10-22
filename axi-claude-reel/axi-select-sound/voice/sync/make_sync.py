#!/usr/bin/env python3
# make_sync.py -- vo2_sync.wav = vo2_final.wav with every early-timed stretch of the client's voice moved D = 4094 samples
# (85.29 ms) later, so every word sits at the original take's timing (= the HeyGen lip-sync, the subtitles, the MG and SFX).
# Only moving audio and making joins: no EQ, no level change, no material from the original take. Two short local stretches
# (anchored DP-WSOLA, pitch and formants kept) fill the two places where the client's enhancer skipped 85 ms inside a word.
#   usage: make_sync.py OUT.wav [--meta OUT.json]
import sys, json, argparse, hashlib
sys.path.insert(0, '/home/user/rr/sound3/voice/sync')
from synclib import *
ap = argparse.ArgumentParser(); ap.add_argument('out'); ap.add_argument('--meta', default=None); A = ap.parse_args()
D_ = 4094                                  # measured lag of every early stretch vs vo2_dry, 1-4 kHz (4093.5-4094.8)
F = rd(FINAL)
S = {'F0': F, 'Fd': shift(F, D_)}          # F0 = vo2_final as is, Fd = vo2_final delayed by D_
FR = 1152; H = FR // 2
def stretch(in_a, in_b, out_a, o_last_target):
    """stretch vo2_final[in_a..] from out_a on: frame 0 = F0 itself, last frame = exactly what Fd plays there, frames in
    between chosen by DP for waveform continuity (pitch-synchronous), 24 ms Hann frames, 12 ms hop"""
    oa = T(out_a); K = int(round((T(o_last_target) - oa) / H)) + 1; o_last = oa + (K - 1) * H
    y, pos, _ = wsola_dp(F, T(in_a), T(in_b), oa, o_last + FR, o_last - D_, frame=FR, tol=288, step=4)
    W = np.zeros(N); W[oa:oa + len(y)] = y
    return W, oa, o_last
S['W1'], oa1, ol1 = stretch(3.665, 3.745, 3.665, 3.821)      # J1: vowel of «المرحلة الثانية», 80 ms -> 165 ms
S['W3'], oa3, ol3 = stretch(14.330, 14.450, 14.330, 14.551)  # J3: /b/-murmur + /l/ of «قبل», 120 ms -> 215 ms
# cuts (output time, crossfade ms, signal that follows); crossfades are equal-power, correlation-compensated
cuts = [((oa1 + H / 2) / SR, 6, 'W1'),      # J1a  start of the vowel stretch (W1 == F0 here)
        ((ol1 + H + H / 2) / SR, 6, 'Fd'),  # J1b  end of the vowel stretch (W1 == Fd here); zone 1 moved from here
        (14.150, 20, 'F0'),                 # J2   pause before «قبل» (both sides -80..-100 dBFS): pause 85 ms shorter
        ((oa3 + H / 2) / SR, 6, 'W3'),      # J3a  «قبل» stays in place (on-time island); its /l/ is stretched ...
        ((ol3 + H + H / 2) / SR, 6, 'Fd'),  # J3b  ... into «تنفيذ», moved
        (16.046, 10, 'F0'),                 # J4   zone-1 end: /d/ closure of «تداول»; the 85 ms duplicate is dropped
        (18.7838, 8, 'Fd'),                 # J5   zone-2 start: dip between the two alike vowels of «يتم تطبيقها»
        (28.960, 10, 'F0'),                 # J7   «في» (on-time island) kept in place, see overlay below
        (29.075, 10, 'Fd'),                 # J8   back to the moved stretch in the pause before «حساب»: pause 85 ms longer
        (44.789, 10, 'F0')]                 # J6   zone-2 end: closure between /k/ and /s/ of «Axi»; duplicate dropped
out, info = compose(S, 'F0', cuts)
# J7: his on-time «في» begins (/f/, 28.875) while the moved vowel of «مبلغ» still decays, as in the original take: «في» fades
# in over the vowel tail (10 ms sine); the moved stretch fades out (10 ms cosine) at 28.955-28.965, before its late «في».
a7, b7, c7, e7 = T(28.870), T(28.880), T(28.955), T(28.965)
gB = np.ones(e7 - a7); gB[:b7 - a7] = np.sin(np.linspace(0, np.pi / 2, b7 - a7))
gA = np.ones(e7 - a7); gA[c7 - a7:] = np.cos(np.linspace(0, np.pi / 2, e7 - c7))
out[a7:e7] = S['Fd'][a7:e7] * gA + S['F0'][a7:e7] * gB
info.insert(7, dict(center=28.875, xfade_ms=10, frm='Fd', to='Fd + F0 overlap («في» in place)', rho=None))
sf.write(A.out, out, SR, subtype='PCM_24')
meta = dict(source=FINAL, D_samples=D_, D_ms=round(D_ / 48, 3), cuts=info,
            stretches={'W1': dict(src_s=[3.665, round((ol1 - D_) / SR, 4)], out_s=[3.665, round((ol1 + FR) / SR, 4)]),
                       'W3': dict(src_s=[14.33, round((ol3 - D_) / SR, 4)], out_s=[14.33, round((ol3 + FR) / SR, 4)])},
            moved_stretches_final_time=[[3.690, 14.065], [14.466, 15.958], [18.700, 28.870], [28.990, 44.704]],
            md5=hashlib.md5(open(A.out, 'rb').read()).hexdigest())
if A.meta: json.dump(meta, open(A.meta, 'w'), indent=1, ensure_ascii=False)
print(meta['md5'])
