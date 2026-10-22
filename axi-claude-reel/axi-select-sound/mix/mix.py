#!/usr/bin/env python3
"""
Axi Select - final re-recording mix for video 2 (Incubation, 91 s) and video 1 (Seed, 120 s).

    python3 /home/user/rr/sound3/mix/mix.py ep2|ep1 [--no-mux]

Writes /home/user/rr/sound3/mix/<ep>/:
    mix.wav (48 kHz 24-bit stereo, exact length), mix.m4a (AAC-LC 256 kb/s, 48 kHz stereo, exact length),
    stems/voice.wav, stems/music.wav, stems/sfx.wav  (float32, as placed with every gain incl. the master gain, before the
        master limiter: voice + music + sfx = mix_pre; the limiter is the only difference to mix.wav),
    report.json (all measurements), sfx_cues_mixed.json (per cue: final gain, nudge, audibility, level vs the voice),
    curves.npz (the duck / band-dip / limiter gain curves for the QA plots),
and muxes the new audio into the existing renders (picture stream-copied, audio replaced, +faststart).

Signal flow (identical settings for both videos; only the timeline data in EPS differs):
  VOICE  approved dry voice -> 70 Hz high-pass (2nd order, DC + rumble only) -> phase rotator (four 2nd-order allpasses at
         150/300/600/1200 Hz, Q 0.5: magnitude exactly flat; it only un-aligns the peaky glottal pulses of the enhanced
         voices, -2.1 dB crest on vo2_final, so the peak limiter below works 1.3 s instead of 10.8 s) -> level to -20 LUFS -> 2:1 soft-knee level
         compressor (5 ms RMS detector, 10 ms attack, 150 ms release, threshold = his median syllable level + 2 dB)
         -> [de-esser: measured, not needed, off] -> the approved episode fixes (video 1: spot A +14 dB high shelf at
         4 kHz over VO 0.03-0.66 with 30 ms crossfades; video 2: «دولار» VO 50.43-50.65 +12.5 dB level ride on its gated
         island, measured: unridden it sits 15-19 dB under its neighbours and 2 dB over the music) -> transparent look-ahead
         true-peak limiter on the rare peaks only (ceiling = his loudness + 12.5 dB, 5 ms look-ahead, 100 ms release)
         -> placed centred at out = VO + P. At the master the voice's own peaks are fitted 0.25 dB under the master
         ceiling on the voice path (same limiter law), so the master limiter never squashes the voice with the bed.
  MUSIC  the five score stems summed at ONE static gain, chosen so the median voice-to-music ratio under speech
         (K-weighted, 1 s windows, over his speaking frames = 10 ms frames within 18 dB of his median syllable level) is 16 dB. Under the voice: a gentle broadband duck of 1 dB (attack 200 ms look-ahead,
         release 700 ms, gaps < 0.6 s bridged so it never pumps between words) plus a dynamic zero-phase 1-4 kHz dip
         of 3 dB on the same curve (on top of the composer's static speech-band carve), plus a level-aware extra duck
         (total never more than 6 dB) only where a 1 s window would fall under 11.5 dB voice-to-music. Before his first
         word the duck comes in as one raised-cosine ramp over 1.9 s (no cliff). End card: +2 dB over the end wipe.
  SFX    the cue sheet is rendered cue by cue here with exactly the placement law of sfx/src/render_bed.py (verified
         against the delivered bed), at one global offset, then per cue: raised until its own band (the octave band
         holding its peak energy) is >= 4 dB above voice + music at its peak (max +10 dB), kept inside a level window
         against the voice's peaks (UI sounds 8-14 dB under, hits / whooshes 2-12 dB under), and every transient that
         lands on a word onset with enough 1-8 kHz energy to mask it is nudged <= 1 frame (40 ms) off the onset or,
         if no nudge clears it, lowered (3 dB, up to 6 dB only while it stays audible). The protected windows stay
         digital silence. Where the master limiter would still take > 2 dB and the SFX carry the peak, the cues there
         are lowered 1 dB per pass (lower the culprit, do not squash). EPS cue_fix holds the few fixed decisions where
         no +-1 frame nudge clears a word onset (moved by hand against the picture frames; see the notes there).
  MASTER 15 Hz high-pass (DC) on music and SFX, sum, ONE static gain to -14.0 LUFS, look-ahead true-peak limiter
         (ceiling -1.5 dBTP, 4x oversampled detection, 3 ms look-ahead, 120 ms release), AAC re-checked <= -1.0 dBTP.
"""
import os, sys, json, subprocess, argparse, time
import numpy as np
from scipy import signal
from scipy.ndimage import minimum_filter1d, uniform_filter1d, maximum_filter1d

SR = 48000
S3 = "/home/user/rr/sound3"
W1, W2 = "/home/user/rr/axi-select-ch1", "/home/user/rr/axi-select-ch2"
PAL = S3 + "/sfx/palette"

EPS = {
    "ep2": dict(
        dur=91.0, P=0.63,
        vo=W2 + "/audio/vo/vo2_sync2.wav",                    # final voice + «يتم تطبيقها» doubled 120 ms replaced from the original take
        music=S3 + "/music/ep2", cues=S3 + "/sfx/cues_ep2.json", bed=S3 + "/sfx/bed_ep2.wav", sfx_master_db=2.0,
        protect=[],
        first_word=3.06, title_end=3.00,
        end_wipe=(84.72, 85.24), end_card=85.24,
        marks={"B-roll 1 cut": 10.72, "staircase cut": 17.72, "B-roll 3 cut": 22.48, "F cut": 28.68, "DROP 1": 33.00, "B-roll 2": 37.04, "N cut (stage 3)": 68.16,
               "break": 74.45, "DROP 2": 76.68, "camera push": 82.76, "end wipe": 84.72, "END hit": 85.364},
        exclude_even=[(32.6, 36.5), (73.9, 80.2), (84.6, 91.0)],     # designed drop 1, break + drop 2, end card
        cue_fix={   # cue index in cues_ep2.json: the mixer's fixed decisions (picture frames checked in pic_subs.mp4)
            41: dict(t=19.04, file="tick_a", shift=0.06, max_gain_db=-8.0,
                     why="tick + ping/flag sat on the onset of «يتم» (out 19.04) at every +-40 ms nudge (-1.2 dB after a 6 dB cut); "
                         "the picture event (flag drops, Seed red cut, Incubation rim) starts at frame 477 = 19.08, so +60 ms puts "
                         "the tick at 19.10 (+20 ms) and the ping/flag at 19.14, clear of both onsets (19.04, 19.17); capped at its "
                         "previous level so the ping's ring stays 6 dB under the /t/ of «يتم» at 19.17"),
            95: dict(t=48.83, file="pop_a", repeat_times=[0.02, 0.07, 0.17, 0.21], max_gain_db=-5.0,
                     why="the 4 equation pops (0.06 s stagger) always put one pop on «التمويل» (out 48.93); the elements fade in at "
                         "48.84 / 48.92 / 48.96 / 49.04, so the pops go to 48.85 / 48.90 / 49.00 / 49.04: two before the onset, two "
                         "in the pause 48.99-49.08; gain capped so pop 2's tail stays >= 6 dB under the onset's 1-8 kHz energy"),
            34: dict(t=16.22, file="whoosh_long_rise", max_gain_db=-7.85,
                     why="the playhead whoosh peaks, and its stamp + shutter land, on the /q/ burst of «صفقة» (out 16.20-16.26): "
                         "Whisper on voice + music reads «صفقة», with this cue «صفة»; 8 dB down restores «صفقة» (still 25 dB over "
                         "voice + music in its own band)"),
            123: dict(t=66.43, file="stamp", t_main=66.57,
                      why="the stamp sat on the /q/ burst of «صفقة» (out 66.43-66.48, 10-20 dB over the burst in 1-8 kHz; the mix "
                          "ASR read «صفحة»); the stamp alone moves to 66.57, right after the word, and the mixer's own nudge adds "
                          "+20 ms (stamp 66.59, track-fill sweep 66.50 with the fill; the chip shows 66.44-66.48, so the stamp "
                          "sounds 110-150 ms late). Whisper still misreads this «صفقة» under any bed (also with no SFX and the "
                          "music 6 dB down): the word itself is fragile in the enhanced voice"),
            137: dict(t=75.2, file="slide_card_b", shift=0.07, max_gain_db=-3.0,
                      why="the deck's slides sat on «في» (out 75.24) at every +-40 ms nudge, cut 3 dB and inaudible (1.0 dB); the cards "
                          "fan in over 75.20-75.36, so +70 ms (sound late, inside the delay tolerance) clears the onset and lets the "
                          "mixer level it; capped so its tail stays 6 dB under the next onset (75.63)"),
        },
        vo_rides=[(50.43, 50.65, 12.5, 0.01)],   # VO s: «دولار» in «20,000 دولار» (the voiced island 50.46-50.645, gated silence
                                                 # both sides, «في» starts 50.655): without a ride it sits 15-19 dB under its
                                                 # neighbours and 2 dB over the music; +12.5 dB brings it ~2.5 dB under «ألف»
        speech_guard=[],
        spotA=None,
        mux=[(W2 + "/out/v2/pic_subs.mp4", W2 + "/out/final4/AxiSelect_Ch2_Rabee_16x9.mp4")]),   # subtitled version only
    "ep1": dict(
        dur=120.0, P=3.0,
        vo=W1 + "/audio/vo/vo1_clean_v7.wav",   # v5 + «مرحبا بك في» rebuilt from his own recording (video 2); «5000» as in v5
        music=S3 + "/music/ep1", cues=S3 + "/sfx/cues_ep1.json", bed=S3 + "/sfx/bed_ep1.wav", sfx_master_db=2.0,
        protect=[(3.00, 4.75), (41.55, 43.25)],
        first_word=3.00, title_end=3.00,
        end_wipe=(113.36, 113.88), end_card=113.88,
        marks={"B-roll 1": 11.84, "DROP 1": 17.88, "B-roll 2": 67.62, "DROP 2": 87.68, "re-drop (10%)": 105.16,
               "push home": 108.6, "end wipe": 113.36, "END hit": 113.88},
        exclude_even=[(17.5, 21.0), (87.3, 91.0), (104.8, 108.3), (113.3, 120.0)],
        vo_rides=[],
        speech_guard=[(106.05, 106.62, -8.0, 0.0, "«انعكاس» under the 10%-limit cluster (candles print / limit line / step-down "
                                                   "ticks: their 2-8 kHz sum was 7.5 dB over the voice); the mix ASR read «إحكاس», "
                                                   "8 dB down restores «انعكاس»")],
        spotA=None,                                                # the old spot-A shelf is not needed: «مرحبا بك في» is now a clean take
        cue_fix={   # cue index in cues_ep1.json: the mixer's fixed decisions where no +-1 frame nudge clears a word onset
                    # (per-repeat check: a repeat is dropped when its own 1-8 kHz energy in the onset's first 60 ms is > -6 dB
                    # re the voice at the cue's unreduced level; picture frames checked in AxiSelect_Ch1_Rabee_16x9_v2.mp4)
            24: dict(t=13.1, file="reveal_air_b", shift=0.0, max_gain_db=-3.1,
                     layers={1: dict(repeat_times=[0, .035, .07, .105, .14, .175, .21, .245, .28, .315, .35, .385, .42, .525])},
                     why="candle-fill tick run: the 2 ticks on the onset 13.66 (-4.0 / -0.5 dB) dropped, 14 of 16 kept"),
            39: dict(t=18.35, file="tick_b", shift=0.0, repeat_times=[0, .042, .084, .126, .168, .21, .294, .42, .462],
                     why="gauge power-on tick run: the 3 ticks on the onsets 18.57 / 18.68 (-2.1 / -4.8 / -5.5 dB) dropped, 9 of 12 kept"),
            43: dict(t=21.18, file="tick_a", shift=-0.08,
                     why="the 6 unlight ticks (21.18-21.28) sat on the onset 21.21 at every +-40 ms nudge, cut 3 dB and inaudible "
                         "(1.0 dB); the picture unlights at 21.12-21.24 (frames 528-531), so -80 ms (21.10-21.20) is both in sync "
                         "and clear of the onset"),
            61: dict(t=31.6, file="tick_b", shift=0.0, repeat_times=[0, .05, .2, .25, .3, .35, .4, .45],
                     why="mini-chart tick run: the 2 ticks on the onset 31.70 (+2.0 / +0.9 dB) dropped, 8 of 10 kept"),
            64: dict(t=33.02, file="tick_c", shift=0.0, repeat_times=[0, .12, .18, .48, .54, .72, .78, .84, .90, .96, 1.02], max_gain_db=-10.5,
                     why="funding-pour tick run over speech: the 7 ticks on the onsets 33.06 / 33.24 / 33.34 / 33.44 / 33.62 dropped "
                         "(11 of 18 kept) and the run (with its track-fill sweep) held 6 dB under every onset it overlaps"),
            111: dict(t=62.45, file="scan_draw_b", shift=0.0, layers={0: dict(repeat_times=[0, .055, .22, .275])}, max_gain_db=-15.2,
                      why="comet rim ticks: the 2 ticks on the onset 62.58 dropped (4 of 6 kept); the comet sweep itself runs over "
                          "the onset, so it is held 6 dB under it (still 21 dB over voice + music in its own band)"),
            199: dict(t=111.3, file="slide_card_a", shift=0.0, repeat_times=[0, 0.08], max_gain_db=-10.4,
                      why="deck fan-in: the 3rd slide (111.46) sat on the onset 111.47 (+6.7 dB); the card moves 111.32-111.44 "
                          "(frames 2783-2786), so the first two slides carry it, held 6 dB under the onset their tails reach"),
        },
        mux=[(W1 + "/out/AxiSelect_Ch1_Rabee_16x9_v2.mp4", W1 + "/out/final4/AxiSelect_Ch1_Rabee_16x9.mp4")]),   # subtitled version only
}

VOICE = dict(hpf=70.0, lufs=-20.0, ratio=2.0, knee=6.0, thr_rel=2.0, det=0.005, att=0.010, rel=0.150,
             plr_ceiling=12.5, lim_la=0.005, lim_rel=0.100, dc_hpf=10.0,
             rot=(150.0, 300.0, 600.0, 1200.0), rot_q=0.5,    # phase rotator (2nd-order allpasses: magnitude exactly flat)
             peak_margin_db=0.25)                              # voice peaks after the master gain stay this far under the master ceiling
MUSIC = dict(vm_target=16.0, duck_db=1.0, band_db=3.0, band=(1000.0, 4000.0), cap_db=6.0, vm_floor=11.5,
             att=0.20, rel=0.70, bridge=0.60, first_ramp=1.9, end_lift_db=2.0, hpf=15.0, vm_gate_db=18.0)
SFX = dict(rel_voice_db=-10.0, snr_target=4.0, max_boost=10.0, ui_win=(-14.0, -8.0), hit_win=(-12.0, -2.0),
           nudges=(-0.02, -0.03, -0.04, 0.02, 0.03, 0.04), mask_margin=6.0, max_cut=3.0, max_cut_if_audible=6.0, hpf=15.0,
           own_band_within_db=10.0, peak_under_voice_tp_db=1.0, gr_fix_above_db=2.0)
MASTER = dict(lufs=-14.0, ceiling=-1.4, la=0.003, rel=0.12, aac_max_tp=-1.1, dc_hpf=10.0)

UI_CATS = {"pop", "click", "tick", "ping", "reveal", "slide", "flag", "counter", "shimmer", "scan", "glitch", "floor"}
TRANS_CATS = {"pop", "click", "tick", "ping", "counter", "impact", "boom", "mech", "flag", "chime", "slide"}


# =============================================================== I/O
def load(p, ch):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", str(ch), "-ar", str(SR), "-f", "f64le", "-acodec", "pcm_f64le", "-"],
                       capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.float64).reshape(-1, ch).copy()


def save(p, a, codec="pcm_s24le"):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f64le", "-ar", str(SR), "-ac", str(a.shape[1]), "-i", "-",
                    "-c:a", codec, p], input=np.ascontiguousarray(a, np.float64).tobytes(), check=True)


def fit(x, n):
    return np.pad(x, ((0, max(0, n - len(x))), (0, 0)))[:n]


# =============================================================== measurement (BS.1770-4)
KSOS = np.array([[1.53512485958697, -2.69169618940638, 1.19839281085285, 1.0, -1.69065929318241, 0.73248077421585],
                 [1.0, -2.0, 1.0, 1.0, -1.99004745483398, 0.99007225036621]])


def kpow(x):
    """per-sample K-weighted power summed over the channels (x: (n, ch))"""
    k = signal.sosfilt(KSOS, x, axis=0)
    return (k * k).sum(1)


def win_loud(pw, win, hop):
    """windowed loudness of a K-power series: (window centre times, LUFS)"""
    cs = np.r_[0.0, np.cumsum(pw)]
    W, H = int(round(win * SR)), int(round(hop * SR))
    st = np.arange(0, len(pw) - W + 1, H)
    ms = (cs[st + W] - cs[st]) / W
    return (st + W / 2) / SR, -0.691 + 10 * np.log10(ms + 1e-20)


def integrated(pw):
    _, l = win_loud(pw, 0.4, 0.1)
    ms = 10 ** ((l + 0.691) / 10)
    g = l > -70
    if not g.any():
        return -120.0
    i0 = -0.691 + 10 * np.log10(ms[g].mean())
    g2 = g & (l > i0 - 10)
    return float(-0.691 + 10 * np.log10(ms[g2].mean()))


def lra(pw):
    _, l = win_loud(pw, 3.0, 0.1)
    ms = 10 ** ((l + 0.691) / 10)
    g = l > -70
    i0 = -0.691 + 10 * np.log10(ms[g].mean())
    v = l[g & (l > i0 - 20)]
    return float(np.percentile(v, 95) - np.percentile(v, 10))


def tp_env(x):
    """per-sample true-peak envelope: max |x| over the 4x oversampled signal within each sample period, max over channels"""
    n = len(x)
    out = np.zeros(n)
    CH, PADS = SR * 4, 256
    for s in range(0, n, CH):
        a, b = max(0, s - PADS), min(n, s + CH + PADS)
        y = signal.resample_poly(x[a:b], 4, 1, axis=0)
        m = np.abs(y).max(1)
        m = np.maximum(m, np.roll(m, -1))  # include the sample period's right edge
        m = m[: (b - a) * 4].reshape(b - a, 4).max(1)
        e = min(n, s + CH)
        out[s:e] = m[s - a: s - a + (e - s)]
    return np.maximum(out, np.abs(x).max(1))


def db(v):
    return float(20 * np.log10(v + 1e-20))


# =============================================================== DSP
def limiter(x, ceil_db, la=0.003, rel=0.08, pk=None):
    """look-ahead true-peak limiter (offline, zero latency): gain never above c / peak, smooth attack over la, exponential
    release; returns (y, gain). pk: precomputed tp_env(x) (optional)"""
    c = 10 ** (ceil_db / 20)
    pk = tp_env(x) if pk is None else pk
    graw = np.minimum(1.0, c / np.maximum(pk, 1e-12))
    if graw.min() >= 1.0:
        return x.copy(), np.ones(len(x))
    L = max(1, int(la * SR))
    h = minimum_filter1d(graw, 2 * L + 1, mode="nearest")
    s = np.minimum(uniform_filter1d(h, L + 1, mode="nearest"), graw)
    B = 48
    nb = int(np.ceil(len(s) / B))
    sb = np.pad(s, (0, nb * B - len(s)), constant_values=1.0).reshape(nb, B).min(1)
    a = np.exp(-1.0 / (rel * 1000.0))
    rb = np.empty(nb)
    cur = 1.0
    for i in range(nb):
        v = sb[i]
        cur = v if v < cur else v + (cur - v) * a
        rb[i] = cur
    g = np.minimum(s, np.interp(np.arange(len(s)), np.arange(nb) * B + B / 2, rb))
    return x * g[:, None], g


def compressor(x, thr_db, ratio, knee, det, att, rel):
    """feed-forward RMS compressor on a 1 ms grid (x mono); returns (y, gain reduction dB per sample)"""
    B = 48
    nb = len(x) // B + 1
    pb = (np.pad(x, (0, nb * B - len(x))).reshape(nb, B) ** 2).mean(1)
    a = np.exp(-1.0 / (det * 1000.0))
    lev = 10 * np.log10(signal.lfilter([1 - a], [1, -a], pb) + 1e-20)
    o = lev - thr_db
    s = 1 - 1 / ratio
    gr = np.where(o <= -knee / 2, 0.0, np.where(o >= knee / 2, s * o, s * (o + knee / 2) ** 2 / (2 * knee)))
    aa, ar = np.exp(-1.0 / (att * 1000.0)), np.exp(-1.0 / (rel * 1000.0))
    g = np.empty(nb)
    cur = 0.0
    for i in range(nb):
        v = gr[i]
        cur = v + (cur - v) * (aa if v > cur else ar)
        g[i] = cur
    gdb = np.interp(np.arange(len(x)), np.arange(nb) * B + B / 2, g)
    return x * 10 ** (-gdb / 20), gdb


def allpass2(f0, Q):
    """RBJ 2nd-order allpass (|H| = 1 at every frequency) as one sos row"""
    w = 2 * np.pi * f0 / SR; al = np.sin(w) / (2 * Q); c = np.cos(w)
    b = np.array([1 - al, -2 * c, 1 + al]); a = np.array([1 + al, -2 * c, 1 - al])
    return np.r_[b / a[0], a / a[0]]


def hishelf(fc, gdb):
    A = 10 ** (gdb / 40); w0 = 2 * np.pi * fc / SR; al = np.sin(w0) / 2 * np.sqrt(2); c = np.cos(w0)
    b_ = [A * ((A + 1) + (A - 1) * c + 2 * np.sqrt(A) * al), -2 * A * ((A - 1) + (A + 1) * c), A * ((A + 1) + (A - 1) * c - 2 * np.sqrt(A) * al)]
    a_ = [(A + 1) - (A - 1) * c + 2 * np.sqrt(A) * al, 2 * ((A - 1) - (A + 1) * c), (A + 1) - (A - 1) * c - 2 * np.sqrt(A) * al]
    return np.array(b_) / a_[0], np.array(a_) / a_[0]


def frames_db(x, hop=480):
    n = len(x) // hop
    return 10 * np.log10((x[: n * hop].reshape(n, hop) ** 2).mean(1) + 1e-20)


def bridge(act, nmax):
    """fill False runs shorter than nmax frames that sit between True frames"""
    a = act.copy()
    idx = np.flatnonzero(act)
    if len(idx) == 0:
        return a
    gaps = np.flatnonzero(np.diff(idx) > 1)
    for gk in gaps:
        i0, i1 = idx[gk] + 1, idx[gk + 1]
        if i1 - i0 < nmax:
            a[i0:i1] = True
    return a


# =============================================================== SFX renderer (same law as sfx/src/render_bed.py)
_pal_cache = {}


def pal(name):
    key = name[:-4] if name.endswith(".wav") else name
    if key not in _pal_cache:
        _pal_cache[key] = load(os.path.join(PAL, key + ".wav"), 2)
    return key, _pal_cache[key]


def rs_lin(x, rate):
    if abs(rate - 1) < 1e-4:
        return x
    n = int(round(len(x) / rate))
    ti = np.arange(n) * rate
    i0 = np.floor(ti).astype(int); fr = ti - i0
    i0 = np.clip(i0, 0, len(x) - 2)
    return x[i0] * (1 - fr)[:, None] + x[i0 + 1] * fr[:, None]


def balance(x, p):
    p = np.clip(p, -1, 1); th = (p + 1) * np.pi / 4
    gl, gr = np.sqrt(2) * np.cos(th), np.sqrt(2) * np.sin(th)
    return np.stack([x[:, 0] * gl, x[:, 1] * gr], 1)


def render_part(c, meta, master_db):
    key, x = pal(c["file"])
    m = meta[key]
    rate = float(c.get("rate", 1.0))
    sync = c.get("sync", m["sync_default"])
    off = (m["onset_s"] if sync == "onset" else m["peak_s"]) / rate
    times = [0.0]
    if "repeat" in c:
        n, dt = c["repeat"]; times = [k * dt for k in range(int(n))]
    if "repeat_times" in c:
        times = list(c["repeat_times"])
    nrep = len(times)
    out = []
    for k, dtk in enumerate(times):
        f = k / max(1, nrep - 1)
        r = rate * (1 + c.get("rate_step", 0.0) * k)
        if "rate_seq" in c:
            r = float(c["rate_seq"][min(k, len(c["rate_seq"]) - 1)])
        y = rs_lin(x, r)
        if "dur" in c:
            L = int(c["dur"] * SR / 1.0)
            if L < len(y):
                y = y[:L].copy(); fl = min(int(float(c.get("fade", min(0.25, 0.6 * float(c["dur"])))) * SR), L)
                y[L - fl:] *= np.linspace(1, 0, fl)[:, None] ** 2
        g = 10 ** ((c.get("gain_db", 0.0) + c.get("gain_step_db", 0.0) * k + master_db) / 20)
        p = c.get("pan", 0.0); pt = c.get("pan_to")
        if pt is not None and nrep > 1:
            p = p + (pt - p) * f
        if pt is not None and nrep == 1:
            pd = float(c.get("pan_dur", min(0.8, len(y) / SR)))
            k0 = int(off * SR * rate / r)
            ramp = np.clip((np.arange(len(y)) - k0) / max(1, pd * SR), 0, 1)
            y = balance(y * g, p + (pt - p) * ramp)
        else:
            y = balance(y * g, p)
        t0 = c["t"] + dtk - (off * rate / r)
        out.append(dict(s=int(round(t0 * SR)), y=y, file=key, cat=m["cat"],
                        t_on=t0 + m["onset_s"] / r, t_pk=t0 + m["peak_s"] / r))
    return out


def protect_env(n, wins):
    g = np.ones(n)
    for a, b in wins:
        sa, sb = int(a * SR), int(b * SR)
        pre, post = int(0.06 * SR), int(0.03 * SR)
        g[sa - pre:sa] *= np.cos(np.linspace(0, np.pi / 2, pre)) ** 2
        g[sa:sb] = 0
        g[sb:sb + post] *= np.sin(np.linspace(0, np.pi / 2, post)) ** 2
    return g


def sum_events(evs, N, wins, gains=None, shifts=None):
    TAIL = 8 * SR
    bed = np.zeros((N + TAIL, 2))
    for k, ev in enumerate(evs):
        g = 10 ** ((gains[k] if gains is not None else 0.0) / 20)
        sh = int(round((shifts[k] if shifts is not None else 0.0) * SR))
        for pt in ev["parts"]:
            s, y = pt["s"] + sh, pt["y"]
            if s < 0:
                y = y[-s:]; s = 0
            e = min(len(bed), s + len(y))
            if e > s:
                bed[s:e] += y[: e - s] * g
    bed *= protect_env(len(bed), wins)[:, None]
    bed = bed[:N]
    fe = int(0.05 * SR)
    bed[N - fe:] *= np.linspace(1, 0, fe)[:, None] ** 2
    return bed


def event_signal(ev, s0, s1, gain_db=0.0, shift=0.0):
    """the event alone over samples [s0, s1)"""
    out = np.zeros((s1 - s0, 2))
    sh = int(round(shift * SR))
    g = 10 ** (gain_db / 20)
    for pt in ev["parts"]:
        s, y = pt["s"] + sh, pt["y"]
        a, b = max(s, s0), min(s + len(y), s1)
        if b > a:
            out[a - s0:b - s0] += y[a - s:b - s] * g
    return out


OCT = np.array([63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000], float)
NW, HF = 2400, 480
_win = np.hanning(NW)
_fb = np.fft.rfftfreq(NW, 1 / SR)
_bm = [(_fb >= f / np.sqrt(2)) & (_fb < min(f * np.sqrt(2), 23999)) for f in OCT]


def band_frames(x):
    """octave-band power per 50 ms frame (hop 10 ms), channels summed: (nframes, 9)"""
    if len(x) < NW:
        x = np.pad(x, ((0, NW - len(x)), (0, 0)))
    nf = 1 + (len(x) - NW) // HF
    P = 0
    for ch in range(x.shape[1]):
        fr = np.lib.stride_tricks.sliding_window_view(x[:, ch], NW)[::HF][:nf]
        P = P + np.abs(np.fft.rfft(fr * _win, axis=1)) ** 2
    return np.stack([P[:, m].sum(1) for m in _bm], 1)


# =============================================================== main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ep", choices=sorted(EPS))
    ap.add_argument("--no-mux", action="store_true")
    ap.add_argument("--set", action="append", default=[], help="test override, e.g. MUSIC.vm_floor=11")
    A = ap.parse_args()
    for kv in A.set:
        k_, v_ = kv.split("=")
        grp, key = k_.split(".")
        globals()[grp][key] = type(globals()[grp][key])(float(v_)) if not isinstance(globals()[grp][key], tuple) else globals()[grp][key]
    E = EPS[A.ep]
    T0 = time.time()
    OUT = os.path.join(S3, "mix", A.ep)
    os.makedirs(OUT + "/stems", exist_ok=True)
    N = int(round(E["dur"] * SR))
    P = E["P"]
    R = dict(episode=A.ep, duration_s=E["dur"], voice_offset_P=P, settings=dict(VOICE=VOICE, MUSIC=MUSIC, SFX=SFX, MASTER=MASTER))
    log = lambda *a: print("[%5.1fs]" % (time.time() - T0), *a, flush=True)

    # ------------------------------------------------------------------ 1. VOICE
    v = load(E["vo"], 1)[:, 0]
    v = signal.sosfilt(signal.butter(2, VOICE["hpf"], "high", fs=SR, output="sos"), v)
    dm = lambda x: np.stack([x, x], 1)
    rot_info = None
    if VOICE["rot"]:
        # phase rotator: the enhanced voices have phase-aligned (peaky) glottal pulses; an allpass chain lowers the waveform
        # peaks without touching the magnitude spectrum, so the peak limiter below has far less to do
        plr_a = db(tp_env(dm(v)).max()) - integrated(kpow(dm(v)))
        v = signal.sosfilt(np.vstack([allpass2(f, VOICE["rot_q"]) for f in VOICE["rot"]]), v)
        rot_info = dict(allpass_hz=list(VOICE["rot"]), q=VOICE["rot_q"], plr_before_db=round(plr_a, 2),
                        plr_after_db=round(db(tp_env(dm(v)).max()) - integrated(kpow(dm(v))), 2))
    g0 = VOICE["lufs"] - integrated(kpow(dm(v)))
    v *= 10 ** (g0 / 20)
    e = frames_db(v)
    med = float(np.median(e[e > -60]))
    thr = med + VOICE["thr_rel"]
    v, grc = compressor(v, thr, VOICE["ratio"], VOICE["knee"], VOICE["det"], VOICE["att"], VOICE["rel"])
    act_v = np.repeat(e > med - 28, 480)[: len(v)]
    gra = grc[: len(act_v)][act_v]
    R["voice"] = dict(source=E["vo"], phase_rotator=rot_info, input_gain_db=round(g0, 2), median_10ms_dbfs=round(med, 2), comp_threshold_dbfs=round(thr, 2),
                      comp_gr_db_speech=dict(p50=round(float(np.percentile(gra, 50)), 2), p90=round(float(np.percentile(gra, 90)), 2),
                                             p99=round(float(np.percentile(gra, 99)), 2), max=round(float(grc.max()), 2)))
    v *= 10 ** ((VOICE["lufs"] - integrated(kpow(dm(v)))) / 20)
    # sibilance check (de-esser only if needed): 5-10 kHz band level in 10 ms frames vs his median syllable level
    vs = signal.sosfiltfilt(signal.butter(4, [5000, 10000], "band", fs=SR, output="sos"), v)
    es, ev_ = frames_db(vs), frames_db(v)
    medv = float(np.median(ev_[ev_ > -60]))
    sib = es[ev_ > -60] - medv
    R["voice"]["sibilance_5_10k_vs_median_db"] = dict(p99=round(float(np.percentile(sib, 99)), 2), p999=round(float(np.percentile(sib, 99.9)), 2),
                                                      max=round(float(sib.max()), 2), deesser="off (not needed: sibilant band stays under his median syllable level)" if np.percentile(sib, 99.9) < 0 else "NEEDED")
    # approved episode fixes
    if E["spotA"]:
        a0, a1, fc, gs, xf = E["spotA"]
        i0, i1, X = int(a0 * SR), int(a1 * SR), int(xf * SR)
        hb, ha = hishelf(fc, gs)
        Vs = signal.lfilter(hb, ha, v[: i1 + X])
        wgt = np.ones(i1 + X); wgt[:i0] = 0; wgt[i0:i0 + X] = np.linspace(0, 1, X); wgt[i1:i1 + X] = np.linspace(1, 0, X)
        v[: i1 + X] = v[: i1 + X] * (1 - wgt) + Vs * wgt
        R["voice"]["spotA"] = "VO %.2f-%.2f: +%.0f dB RBJ high shelf at %.0f Hz, %.0f ms crossfades (kept from the approved mix)" % (a0, a1, gs, fc, xf * 1000)
    for a0, a1, gd, rr in E["vo_rides"]:
        tv = np.arange(len(v)) / SR
        v *= 10 ** (gd * np.clip(np.minimum((tv - a0) / rr, (a1 - tv) / rr), 0, 1) / 20)
        R["voice"].setdefault("rides", []).append("VO %.2f-%.2f %+.1f dB (level only)" % (a0, a1, gd))
    Iv = integrated(kpow(dm(v)))
    tp_before = db(tp_env(dm(v)).max())
    vl, glim = limiter(dm(v), Iv + VOICE["plr_ceiling"], VOICE["lim_la"], VOICE["lim_rel"])
    v = signal.sosfilt(signal.butter(2, VOICE["dc_hpf"], "high", fs=SR, output="sos"), vl[:, 0])   # DC from the gain modulation
    grl = -20 * np.log10(glim)
    R["voice"]["peak_limiter"] = dict(ceiling_rel_lufs_db=VOICE["plr_ceiling"], tp_before_rel_db=round(tp_before - Iv, 2),
                                      gr_max_db=round(float(grl.max()), 2), ms_over_1db=round(float((grl > 1).sum()) / SR * 1000, 1),
                                      ms_over_0p1db=round(float((grl > 0.1).sum()) / SR * 1000, 1),
                                      events_over_1db=int(((np.diff(np.r_[0, (grl > 1).astype(int)])) > 0).sum()))
    log("voice: gain %.1f dB, comp thr %.1f, GR p90 %.1f max %.1f, limiter GR max %.2f dB (%.0f ms > 1 dB)" % (
        g0, thr, R["voice"]["comp_gr_db_speech"]["p90"], grc.max(), grl.max(), R["voice"]["peak_limiter"]["ms_over_1db"]))
    V = np.zeros((N, 2))
    i0 = int(round(P * SR))
    V[i0:i0 + len(v)] = dm(v)[: N - i0]
    VTP_pre = db(np.abs(v).max())

    # voice map on the output timeline (10 ms frames)
    e10 = frames_db(V[:, 0])
    medo = float(np.median(e10[e10 > -60]))
    act = e10 > medo - 28
    nfr = len(e10)
    tt = np.arange(nfr) * 0.01
    ons = []
    for i in range(6, nfr):
        if e10[i] >= medo - 18 and np.all(e10[i - 6:i] < medo - 26):
            j = i
            while j > i - 6 and e10[j - 1] >= medo - 32:
                j -= 1
            ons.append(round(j * 0.01, 2))
        elif e10[i] >= medo - 10 and e10[i] - e10[i - 3] >= 12 and (not ons or i * 0.01 - ons[-1] > 0.08):
            ons.append(round((i - 1) * 0.01, 2))
    ons = sorted(set(ons))
    _, lv100 = win_loud(kpow(V), 0.1, 0.01)
    a100 = act[: len(lv100)] if len(lv100) <= nfr else np.r_[act, np.zeros(len(lv100) - nfr, bool)]
    Vref = float(np.percentile(lv100[a100[: len(lv100)]], 95))
    R["voice"]["n_word_onsets"] = len(ons)
    R["voice"]["peak_ref_lufs_100ms_p95"] = round(Vref, 2)

    # ------------------------------------------------------------------ 2. MUSIC
    names = ["pads", "bass", "perc", "motif", "fx"]
    st = {n: fit(load(os.path.join(E["music"], n + ".wav"), 2), N) for n in names}
    M = sum(st[n] for n in names)
    mref = fit(load(os.path.join(E["music"], "mix.wav"), 2), N)
    R["music"] = dict(stems_vs_mix_max_err_db=round(db(np.abs(M - mref).max()), 1))
    del st, mref
    M = signal.sosfilt(signal.butter(2, MUSIC["hpf"], "high", fs=SR, output="sos"), M, axis=0)
    first_i = int(round(E["first_word"] / 0.01))
    actb = bridge(act, int(MUSIC["bridge"] / 0.01))
    # duck activity curve a(t) in [0, 1] on the 10 ms grid
    k = np.exp(-0.01 / MUSIC["rel"])
    rel_c = np.zeros(nfr); cur = 0.0
    for i in range(nfr):
        cur = 1.0 if actb[i] else cur * k
        rel_c[i] = cur
    pre = np.zeros(nfr)
    onb = np.flatnonzero(np.diff(np.r_[0, actb.astype(int)]) > 0)
    for jn, j in enumerate(onb):
        L = int(round((MUSIC["first_ramp"] if jn == 0 else MUSIC["att"]) / 0.01))
        if jn == 0:
            pre[min(j, first_i):j] = 1.0      # the ramp is complete at the first-word mark and holds until his voice starts
            j = min(j, first_i)
        r_ = 0.5 - 0.5 * np.cos(np.pi * np.arange(1, L + 1) / L)
        idx = np.arange(j - L, j)
        mk = idx >= 0
        pre[idx[mk]] = np.maximum(pre[idx[mk]], r_[mk])
    acurve = np.maximum(rel_c, pre)
    acurve = uniform_filter1d(acurve, 7, mode="nearest")
    acurve[: max(0, first_i - int(MUSIC["first_ramp"] / 0.01) - 1)] = 0.0
    # band (zero-phase 1-4 kHz) for the dynamic dip
    Mb = signal.sosfiltfilt(signal.butter(2, list(MUSIC["band"]), "band", fs=SR, output="sos"), M, axis=0)
    tN = np.arange(N) / SR
    end_lift = MUSIC["end_lift_db"] * (0.5 - 0.5 * np.cos(np.pi * np.clip((tN - E["end_wipe"][0]) / (E["end_card"] - E["end_wipe"][0]), 0, 1)))
    # speech guard: fixed local dips of the SFX and / or the music under a few fragile words, where the differential ASR
    # (voice alone vs the mix, same chunks) showed the bed changing a word (EPS speech_guard; 50 ms raised-cosine ramps)
    SG = E.get("speech_guard", [])

    def guard_db(col):
        g = np.zeros(N)
        for w in SG:
            r = 0.05
            ww = np.clip(np.minimum((tN - (w[0] - r)) / r, ((w[1] + r) - tN) / r), 0, 1)
            g = np.minimum(g, w[col] * (0.5 - 0.5 * np.cos(np.pi * ww)))
        return g
    sg_mus_db, sg_sfx_db = guard_db(3), guard_db(2)
    R["speech_guard"] = [dict(t0=w[0], t1=w[1], sfx_db=w[2], music_db=w[3], why=w[4]) for w in SG]
    pwV = kpow(V)
    act_vm = e10 > medo - MUSIC["vm_gate_db"]           # his speaking frames (syllables), without word-final decays and breaths
    actS = np.zeros(N)
    actS[: min(N, nfr * 480)] = np.repeat(act_vm, 480)[:N]
    cV = np.r_[0.0, np.cumsum(pwV * actS)]
    cA = np.r_[0.0, np.cumsum(actS)]

    def build_music(gm_db, extra):
        duck = MUSIC["duck_db"] * acurve + extra
        duck = np.minimum(duck, MUSIC["cap_db"])
        gbb = 10 ** ((gm_db - np.interp(tN, tt, duck) + end_lift + sg_mus_db) / 20)
        gband = 10 ** (-MUSIC["band_db"] * np.interp(tN, tt, acurve) / 20)
        return (M + (gband - 1)[:, None] * Mb) * gbb[:, None], duck

    def vm_series(Mx):
        """1 s windows centred on the 10 ms grid: voice-to-music ratio (K-weighted) measured over the frames where he is
        speaking inside the window (so a window that ends a phrase is not counted as a low ratio), and that active fraction"""
        cM = np.r_[0.0, np.cumsum(kpow(Mx) * actS)]
        W = SR
        c = (np.arange(nfr) * 480 + 240).astype(int)
        a_, b_ = np.clip(c - W // 2, 0, N), np.clip(c + W // 2, 0, N)
        na = cA[b_] - cA[a_]
        lv_ = 10 * np.log10((cV[b_] - cV[a_]) / np.maximum(na, 1) + 1e-20)
        lm_ = 10 * np.log10((cM[b_] - cM[a_]) / np.maximum(na, 1) + 1e-20)
        return lv_ - lm_, na / W

    extra = np.zeros(nfr)
    gm = 0.0
    for it in range(4):
        Mx, duck = build_music(gm, extra)
        vm, fa = vm_series(Mx)
        sel = fa >= 0.6
        gm += float(np.median(vm[sel])) - MUSIC["vm_target"]
        Mx, duck = build_music(gm, extra)
        vm, fa = vm_series(Mx)
        need = np.where(fa >= 0.5, np.clip(MUSIC["vm_floor"] + 0.3 - vm, 0, None), 0.0)
        need = uniform_filter1d(maximum_filter1d(need, 50, mode="nearest"), 41, mode="nearest") * acurve
        extra = np.minimum(extra + need, MUSIC["cap_db"] - MUSIC["duck_db"])
    Mx, duck = build_music(gm, extra)
    vm, fa = vm_series(Mx)
    sel = fa >= 0.6
    log("music: static gain %.2f dB, V/M median %.2f p10 %.2f min %.2f, duck max %.2f dB" % (gm, np.median(vm[sel]), np.percentile(vm[sel], 10), vm[sel].min(), duck.max()))
    R["music"].update(static_gain_db=round(gm, 2), duck_db_broadband=MUSIC["duck_db"], band_dip_db=MUSIC["band_db"],
                      duck_total_max_db=round(float(duck.max()), 2), extra_duck_max_db=round(float(extra.max()), 2),
                      extra_duck_seconds=round(float((extra > 0.1).sum()) * 0.01, 2),
                      vm_1s_db=dict(median=round(float(np.median(vm[sel])), 2), p10=round(float(np.percentile(vm[sel], 10)), 2),
                                    p90=round(float(np.percentile(vm[sel], 90)), 2), min=round(float(vm[sel].min()), 2),
                                    min_at_s=round(float(tt[sel][np.argmin(vm[sel])]), 2)))

    # ------------------------------------------------------------------ 3. SFX
    meta = json.load(open(os.path.join(PAL, "palette.json")))["sounds"]
    cues = json.load(open(E["cues"]))
    if isinstance(cues, dict):
        cues = cues["cues"]
    evs = []
    for ci, c in enumerate(cues):
        parts = render_part(c, meta, E["sfx_master_db"])
        for l in c.get("layers", []):
            parts += render_part(l, meta, E["sfx_master_db"])
        evs.append(dict(i=ci, t=c["t"], file=c["file"][:-4] if c["file"].endswith(".wav") else c["file"], cat=parts[0]["cat"],
                        beat=c.get("beat"), event=(c.get("event") or "")[:80], parts=parts,
                        s0=min(p["s"] for p in parts), s1=max(p["s"] + len(p["y"]) for p in parts)))
    # self-test against the delivered bed (same cue sheet, same law)
    bed0 = sum_events(evs, N, E["protect"])
    bref = fit(load(E["bed"], 2), N)
    R["sfx"] = dict(cues=len(evs), placements=sum(len(e_["parts"]) for e_ in evs),
                    render_vs_delivered_bed_max_err_db=round(db(np.abs(bed0 - bref).max()), 1),
                    delivered_bed_peak_dbfs=round(db(np.abs(bref).max()), 2))
    del bed0, bref
    log("sfx: %d cues rendered, vs delivered bed max err %.1f dB" % (len(evs), R["sfx"]["render_vs_delivered_bed_max_err_db"]))
    # the mixer's own fixed decisions (after the self-test): a cue whose transient would still sit on a word onset after the
    # +-1 frame nudge search is moved off it by hand (checked against the picture), see EPS cue_fix
    FIX = E.get("cue_fix", {})
    for ci, fx in FIX.items():
        c = cues[ci]
        assert abs(c["t"] - fx["t"]) < 1e-6 and c["file"].startswith(fx["file"]), ("cue_fix does not match the sheet", ci, c["t"], c["file"])
        if any(k in fx for k in ("repeat_times", "layers", "t_main", "drop_main")):
            c = dict(c)
            if "repeat_times" in fx:
                c["repeat_times"] = list(fx["repeat_times"])
            if "t_main" in fx:                               # the main sound alone moves (its layers stay on their own t)
                c["t"] = fx["t_main"]
            ls = [dict(l) for l in c.get("layers", [])]
            for li, lfx in fx.get("layers", {}).items():
                ls[int(li)] = None if lfx is None else dict(ls[int(li)], **lfx)   # per-layer overrides (t, repeat_times) or drop
            c["layers"] = [l for l in ls if l is not None]
            parts = [] if fx.get("drop_main") else render_part(c, meta, E["sfx_master_db"])
            for l in c["layers"]:
                parts += render_part(l, meta, E["sfx_master_db"])
            evs[ci].update(parts=parts, s0=min(p["s"] for p in parts), s1=max(p["s"] + len(p["y"]) for p in parts))
    R["sfx"]["manual_fixes"] = {str(ci): fx for ci, fx in FIX.items()}
    MASK = V + Mx
    # voice 1-8 kHz energy for the onset-masking check
    sos18 = signal.butter(2, [1000, 8000], "band", fs=SR, output="sos")
    V18 = signal.sosfilt(sos18, V[:, 0]) ** 2 * 2
    cV18 = np.r_[0.0, np.cumsum(V18)]
    ons_a = np.array(ons)
    prot = E["protect"]
    PE = protect_env(N, prot) * 10 ** (sg_sfx_db / 20)       # protected windows + the speech guard

    def analyse(ev, gdb, sh):
        s0 = max(0, ev["s0"] + int(round(sh * SR))); s1 = min(N, ev["s1"] + int(round(sh * SR)), s0 + 4 * SR)
        if s1 - s0 < NW:
            s1 = min(N, s0 + NW)
            if s1 - s0 < NW:
                return None
        x = event_signal(ev, s0, s1, gdb, sh) * PE[s0:s1, None]
        if np.abs(x).max() < 1e-7:
            return dict(silent=True)
        Pc, Pm = band_frames(x), band_frames(MASK[s0:s1])
        pk = Pc.max(0)
        tfb = np.argmax(Pc, 0)
        snrb = 10 * np.log10(pk / (Pm[tfb, np.arange(9)] + 1e-20))
        bdom = int(np.argmax(pk))
        # its own band: among the bands that carry its sound (peak energy within 10 dB of its strongest band), the one where
        # it stands out most against voice + music at that band's peak
        qual = np.flatnonzero(pk >= pk[bdom] * 10 ** (-SFX["own_band_within_db"] / 10))
        b = int(qual[np.argmax(snrb[qual])])
        _, l100 = win_loud(kpow(x), 0.1, 0.01)
        return dict(silent=False, band_hz=int(OCT[b]), snr_db=float(snrb[b]), dom_band_hz=int(OCT[bdom]), dom_band_snr_db=float(snrb[bdom]),
                    best_band_snr_db=float(snrb.max()), t_peak=round((s0 + tfb[b] * HF + NW / 2) / SR, 3),
                    l100=float(l100.max()), rel_voice_db=float(l100.max() - Vref), peak_dbfs=db(np.abs(x).max()))

    def onset_conflicts(ev, gdb, sh):
        """transients of this cue that land on a word onset with enough 1-8 kHz energy to mask it"""
        out = []
        for pt in ev["parts"]:
            if pt["cat"] not in TRANS_CATS:
                continue
            for tr in (pt["t_on"] + sh, pt["t_pk"] + sh):
                if any(a - 0.06 <= tr <= b for a, b in prot):
                    continue
                near = ons_a[(ons_a >= tr - 0.06) & (ons_a <= tr + 0.015)]
                for w in near:
                    a, b = int(w * SR), int((w + 0.06) * SR)
                    if b > N:
                        continue
                    xs = event_signal(ev, a, b, gdb, sh)
                    es_ = (signal.sosfilt(sos18, xs, axis=0) ** 2).sum(1).mean()
                    ev_v = (cV18[b] - cV18[a]) / (b - a)
                    rel = 10 * np.log10(es_ / (ev_v + 1e-20) + 1e-20)
                    if rel > -SFX["mask_margin"]:
                        out.append((round(float(w), 2), round(float(tr), 3), round(float(rel), 1)))
        return out

    base = SFX["rel_voice_db"]
    rows = []
    first = [analyse(ev, 0.0, 0.0) for ev in evs]
    rv = np.array([f_["rel_voice_db"] for f_ in first if f_ and not f_.get("silent")])
    goff = base - float(np.median(rv))
    gains, shifts = np.full(len(evs), goff), np.zeros(len(evs))

    def worst_conflict(ev, gdb, sh):
        cf = onset_conflicts(ev, gdb, sh)
        return (max(c_[2] for c_ in cf) if cf else -99.0), cf

    def in_prot(ev, sh):
        return any(a_ - 0.06 <= pt["t_on"] + sh <= b_ for pt in ev["parts"] for a_, b_ in prot)

    for kx, ev in enumerate(evs):
        f_ = first[kx]
        row = dict(i=ev["i"], t=ev["t"], file=ev["file"], cat=ev["cat"], beat=ev["beat"], event=ev["event"], sheet_gain_db=cues[kx].get("gain_db", 0.0))
        if not f_ or f_.get("silent"):
            row.update(note="silent (protected window or empty)", final_gain_db=round(gains[kx], 2))
            rows.append(row); continue
        ui = ev["cat"] in UI_CATS
        lo, hi = SFX["ui_win"] if ui else SFX["hit_win"]
        a0 = analyse(ev, goff, 0.0)
        w0, cf0 = worst_conflict(ev, goff, 0.0)
        row["onset_conflicts_before"] = cf0
        # 1. timing: it stays on its sync point unless it masks a word onset or is masked by the word itself; then the
        #    best nudge within 1 frame (least onset masking first, then audibility, then the smallest shift, earlier first)
        best_sh = 0.0
        fx = FIX.get(kx, {})
        if fx:
            row["manual_fix"] = fx["why"]
        if "shift" in fx:
            best_sh = fx["shift"]
        elif w0 > -SFX["mask_margin"] or a0["snr_db"] < SFX["snr_target"]:
            cands = []
            for sh in (0.0,) + tuple(SFX["nudges"]):
                if sh and in_prot(ev, sh):
                    continue
                a_ = a0 if sh == 0 else analyse(ev, goff, sh)
                w_ = w0 if sh == 0 else worst_conflict(ev, goff, sh)[0]
                exc = max(0.0, w_ + SFX["mask_margin"])
                cands.append((round(exc * 2) / 2, -round(min(a_["snr_db"], SFX["snr_target"]), 1), abs(sh), sh))
            cands.sort()
            best_sh = cands[0][3]
        shifts[kx] = best_sh
        a1 = analyse(ev, goff, best_sh) if best_sh else a0
        # 2. level: audible in its own band, inside its class window against the voice's peaks, peak under the voice's
        need = SFX["snr_target"] - a1["snr_db"]                  # dB still needed for audibility (may be < 0)
        adj = min(max(0.0, need), SFX["max_boost"])
        L = a1["rel_voice_db"] + adj
        if L < lo:                                              # under its class window: up to the window floor
            adj = min(SFX["max_boost"], adj + lo - L)
        L = a1["rel_voice_db"] + adj
        if L > hi:                                              # over its class window: down to the ceiling, unless
            adj = max(adj - (L - hi), min(need, hi + 2.0 - a1["rel_voice_db"]))   # audibility needs it (max +2 dB over)
        pk_cap = VTP_pre - SFX["peak_under_voice_tp_db"]          # its sample peak stays under the voice's limited peaks
        if a1["peak_dbfs"] + adj > pk_cap:
            adj = pk_cap - a1["peak_dbfs"]; row["peak_capped"] = True
        gains[kx] = goff + adj
        if "max_gain_db" in fx and gains[kx] > fx["max_gain_db"]:
            gains[kx] = fx["max_gain_db"]; row["manual_gain_cap_db"] = fx["max_gain_db"]
        # 3. what still lands on a word onset too loud is lowered a little (3 dB; up to 6 dB only while it stays >= 4 dB
        #    above voice + music in its own band), never removed
        w2, _ = worst_conflict(ev, gains[kx], best_sh)
        if w2 > -SFX["mask_margin"]:
            room = analyse(ev, gains[kx], best_sh)["snr_db"] - SFX["snr_target"]
            cut = min(w2 + SFX["mask_margin"], max(SFX["max_cut"], min(SFX["max_cut_if_audible"], room)))
            gains[kx] -= cut; row["masking_cut_db"] = round(cut, 2)
        row.update(snr_before_db=round(a0["snr_db"], 2), rel_voice_before_db=round(a0["rel_voice_db"], 2))
        rows.append(row)
    hp_s = signal.butter(2, SFX["hpf"], "high", fs=SR, output="sos")

    def build_sfx():
        return signal.sosfilt(hp_s, sum_events(evs, N, prot, gains, shifts), axis=0) * PE[:, None]

    # ------------------------------------------------------------------ 4. MASTER (with the culprit loop)
    # one static gain to the target, then the limiter; wherever the limiter would take more than 2 dB and the SFX carry
    # the peak, the cues sounding there are lowered (lower the culprit, do not squash) and the master is redone
    dcs = signal.butter(2, MASTER["dc_hpf"], "high", fs=SR, output="sos")
    EDGE = np.ones(N)                                    # 10 ms fade-in at 0 (a title cue starts inside its file) and
    EDGE[:480] = np.sin(np.linspace(0, np.pi / 2, 480)) ** 2  # 30 ms fade-out at the last sample: no click at either edge
    EDGE[-1440:] = np.cos(np.linspace(0, np.pi / 2, 1440)) ** 2
    culprits = []
    VPK = tp_env(V[:, :1])                               # the voice's true-peak envelope (dual mono), computed once

    def voice_fit(G, ceil):
        """the voice's own peaks stay peak_margin under the master ceiling after the master gain: done here, on the voice
        path (same limiter law as the voice chain), so the master limiter never has to squash the voice (and the music and
        SFX with it); returns (voice, its gain reduction dB)"""
        c_rel = ceil - VOICE["peak_margin_db"] - G
        if db(VPK.max()) <= c_rel:
            return V, np.zeros(N)
        vl, g2 = limiter(V[:, :1], c_rel, VOICE["lim_la"], VOICE["lim_rel"], pk=VPK)
        return np.repeat(vl, 2, 1), -20 * np.log10(g2)

    def run_master(ceil, G):
        for fix_it in range(5):
            Sfx = build_sfx()
            if G is None:
                G = MASTER["lufs"] - integrated(kpow(signal.sosfilt(dcs, V + Mx + Sfx, axis=0) * EDGE[:, None]))
            for it in range(6):
                Vl, gv2 = voice_fit(G, ceil)
                pre_mix = signal.sosfilt(dcs, Vl + Mx + Sfx, axis=0) * EDGE[:, None]
                y, glm = limiter(pre_mix * 10 ** (G / 20), ceil, MASTER["la"], MASTER["rel"])
                I1 = integrated(kpow(y))
                tp1 = db(tp_env(y).max())
                log("master %d.%d: gain %.3f dB ceiling %.2f -> I %.2f LUFS, TP %.2f dBTP, GR max %.2f dB" % (fix_it, it, G, ceil, I1, tp1, -db(glm.min())))
                if abs(I1 - MASTER["lufs"]) <= 0.05 and tp1 <= ceil + 0.05:
                    break
                G += MASTER["lufs"] - I1
            grm = -20 * np.log10(glm)
            over = np.flatnonzero(grm > SFX["gr_fix_above_db"])
            if len(over) == 0:
                break
            regs = np.split(over, np.flatnonzero(np.diff(over) > int(0.01 * SR)) + 1)
            changed = False
            for reg in regs:
                k = int(reg[np.argmax(grm[reg])])
                a_, b_ = max(0, k - 240), min(N, k + 240)
                pv, pmu, ps = (db(np.abs(X[a_:b_]).max()) for X in (Vl, Mx, Sfx))
                ent = dict(pass_=fix_it, t=round(k / SR, 3), gr_db=round(float(grm[k]), 2), voice_pk_dbfs=round(pv + G, 1), music_pk_dbfs=round(pmu + G, 1),
                           sfx_pk_dbfs=round(ps + G, 1))
                contrib = db(np.abs(Vl[a_:b_] + Mx[a_:b_] + Sfx[a_:b_]).max()) - db(np.abs(Vl[a_:b_] + Mx[a_:b_]).max())
                ent["sfx_adds_db"] = round(contrib, 2)
                if contrib >= 0.5 or ps >= pv - 3:
                    pk_ev = []
                    for kx, ev in enumerate(evs):
                        sh = int(round(shifts[kx] * SR))
                        if ev["s0"] + sh <= b_ and ev["s1"] + sh >= a_:
                            pk_ev.append((db(np.abs(event_signal(ev, a_, b_, gains[kx], shifts[kx]) * PE[a_:b_, None]).max()), kx))
                    pk_ev.sort(reverse=True)
                    cut = float(np.clip(grm[k] - SFX["gr_fix_above_db"] + 0.5, 1.0, 3.0))
                    fixed = []
                    for pkv, kx in pk_ev:
                        if pkv >= pk_ev[0][0] - 6:
                            gains[kx] -= cut
                            rows[kx]["gr_fix_db"] = round(rows[kx].get("gr_fix_db", 0.0) + cut, 2)
                            fixed.append((evs[kx]["t"], evs[kx]["file"], round(cut, 2)))
                    ent["lowered_cues"] = fixed
                    changed = changed or bool(fixed)
                else:
                    ent["culprit"] = "voice" if pv >= pmu else "music"
                culprits.append(ent)
            if not changed:
                break
        return Sfx, pre_mix, y, glm, G, Vl, gv2

    ceil, G = MASTER["ceiling"], None
    for aac_it in range(4):
        Sfx, pre_mix, y, glm, G, Vl, gv2 = run_master(ceil, G)
        save(OUT + "/mix.wav", y)
        # AAC: re-check its true peak; if the codec overshoots, lower the ceiling and redo the master (gain re-trimmed)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", OUT + "/mix.wav", "-c:a", "aac", "-b:a", "256k", "-ar", str(SR), "-ac", "2",
                        "-t", "%.3f" % E["dur"], OUT + "/mix.m4a"], check=True)
        tpa = db(tp_env(fit(load(OUT + "/mix.m4a", 2), N)).max())
        log("aac pass %d: ceiling %.2f -> AAC TP %.2f dBTP" % (aac_it, ceil, tpa))
        if tpa <= MASTER["aac_max_tp"]:
            break
        ceil -= tpa - MASTER["aac_max_tp"] + 0.05
    grm = -20 * np.log10(glm)
    R["master_gr_culprits"] = culprits
    R["voice"]["peak_fit_to_master"] = dict(margin_db=VOICE["peak_margin_db"], ceiling_dbtp_after_master_gain=round(ceil - VOICE["peak_margin_db"], 2),
                                            gr_max_db=round(float(gv2.max()), 2), ms_over_0p5db=round(float((gv2 > 0.5).sum()) / SR * 1000, 1),
                                            ms_over_1db=round(float((gv2 > 1.0).sum()) / SR * 1000, 1))
    gcomb = np.r_[np.zeros(i0), grl][:N]
    gcomb = np.pad(gcomb, (0, N - len(gcomb))) + gv2
    R["voice"]["peak_limiting_total"] = dict(gr_max_db=round(float(gcomb.max()), 2), ms_over_1db=round(float((gcomb > 1).sum()) / SR * 1000, 1),
                                             ms_over_3db=round(float((gcomb > 3).sum()) / SR * 1000, 1))
    log("voice peak fit: GR max %.2f dB (%.0f ms > 1 dB); voice limiting total: GR max %.2f dB, %.0f ms > 1 dB, %.0f ms > 3 dB" % (
        gv2.max(), R["voice"]["peak_fit_to_master"]["ms_over_1db"], gcomb.max(), R["voice"]["peak_limiting_total"]["ms_over_1db"], R["voice"]["peak_limiting_total"]["ms_over_3db"]))
    V = Vl
    # final per-cue audibility, level and onset check with the final gains / nudges
    for kx, ev in enumerate(evs):
        row = rows[kx]
        if "snr_before_db" not in row:
            continue
        a1 = analyse(ev, gains[kx], shifts[kx])
        row.update(global_offset_db=round(goff, 2), auto_adj_db=round(gains[kx] - goff, 2), final_gain_db=round(gains[kx], 2),
                   band_hz=a1["band_hz"], snr_db=round(a1["snr_db"], 2), dom_band_hz=a1["dom_band_hz"], dom_band_snr_db=round(a1["dom_band_snr_db"], 2),
                   best_band_snr_db=round(a1["best_band_snr_db"], 2), rel_voice_peak_db=round(a1["rel_voice_db"], 2), t_peak=a1["t_peak"],
                   nudge_s=round(float(shifts[kx]), 3), onset_conflicts_after=onset_conflicts(ev, gains[kx], shifts[kx]))
    au = [r_ for r_ in rows if "snr_db" in r_]
    R["sfx"].update(global_offset_db=round(goff, 2), n_audible_ge3db=sum(r_["snr_db"] >= 3 for r_ in au), n_measured=len(au),
                    n_silent_protected=len(rows) - len(au),
                    snr_db=dict(min=round(min(r_["snr_db"] for r_ in au), 2), median=round(float(np.median([r_["snr_db"] for r_ in au])), 2)),
                    dominant_band_snr_db=dict(median=round(float(np.median([r_["dom_band_snr_db"] for r_ in au])), 2),
                                              n_ge3=sum(r_["dom_band_snr_db"] >= 3 for r_ in au)),
                    rel_voice_peak_db=dict(ui_median=round(float(np.median([r_["rel_voice_peak_db"] for r_ in au if r_["cat"] in UI_CATS])), 2),
                                           ui_range=[round(min(r_["rel_voice_peak_db"] for r_ in au if r_["cat"] in UI_CATS), 2), round(max(r_["rel_voice_peak_db"] for r_ in au if r_["cat"] in UI_CATS), 2)],
                                           hit_median=round(float(np.median([r_["rel_voice_peak_db"] for r_ in au if r_["cat"] not in UI_CATS])), 2),
                                           hit_range=[round(min(r_["rel_voice_peak_db"] for r_ in au if r_["cat"] not in UI_CATS), 2), round(max(r_["rel_voice_peak_db"] for r_ in au if r_["cat"] not in UI_CATS), 2)]),
                    nudged=sum(1 for r_ in au if abs(r_.get("nudge_s", 0)) > 1e-6), masking_cuts=sum(1 for r_ in rows if r_.get("masking_cut_db")),
                    gr_fixes=sum(1 for r_ in rows if r_.get("gr_fix_db")), peak_capped=sum(1 for r_ in rows if r_.get("peak_capped")),
                    boosted=sum(1 for r_ in au if r_["auto_adj_db"] > 0.05), lowered=sum(1 for r_ in au if r_["auto_adj_db"] < -0.05),
                    onset_conflicts_left=[(r_["t"], r_["file"], r_["onset_conflicts_after"]) for r_ in au if r_["onset_conflicts_after"]],
                    below_3db=[(r_["t"], r_["file"], r_["snr_db"]) for r_ in au if r_["snr_db"] < 3])
    if prot:
        R["sfx"]["protected_windows_peak_dbfs"] = [round(db(np.abs(Sfx[int(a * SR):int(b * SR)]).max()), 1) for a, b in prot]
    log("sfx: offset %.2f dB, audible %d/%d, nudged %d, masking cuts %d, GR fixes %d" % (goff, R["sfx"]["n_audible_ge3db"], len(au), R["sfx"]["nudged"],
                                                                                    R["sfx"]["masking_cuts"], R["sfx"]["gr_fixes"]))
    json.dump(rows, open(OUT + "/sfx_cues_mixed.json", "w"), indent=1, ensure_ascii=False)
    gm_ = 10 ** (G / 20)
    save(OUT + "/stems/voice.wav", V * gm_, "pcm_f32le")
    save(OUT + "/stems/music.wav", Mx * gm_, "pcm_f32le")
    save(OUT + "/stems/sfx.wav", Sfx * gm_, "pcm_f32le")
    np.savez_compressed(OUT + "/curves.npz", t10=tt, acurve=acurve, duck=duck, extra=extra, vm=vm, vm_frac=fa, act=act,
                        onsets=np.array(ons), lim_gr_db=grm[::48], voice_lim_gr_db=gcomb[::48], master_gain_db=G,
                        music_gain_db=gm)
    # ------------------------------------------------------------------ 5. MEASURE
    pw = {k_: kpow(x_ * gm_) for k_, x_ in (("voice", V), ("music", Mx), ("sfx", Sfx))}
    pw["mix"] = kpow(y)
    R["master"] = dict(static_gain_db=round(G, 3), limiter_ceiling_dbtp=round(ceil, 2), limiter_gr_max_db=round(float(grm.max()), 2),
                       limiter_gr_max_at_s=round(float(np.argmax(grm)) / SR, 3), limiter_ms_over_0p5db=round(float((grm > 0.5).sum()) / SR * 1000, 1),
                       limiter_ms_over_1db=round(float((grm > 1.0).sum()) / SR * 1000, 1), limiter_ms_over_2db=round(float((grm > 2.0).sum()) / SR * 1000, 1))
    ym = load(OUT + "/mix.wav", 2)
    R["final_wav"] = dict(samples=len(ym), duration_s=len(ym) / SR, integrated_lufs=round(integrated(kpow(ym)), 2), true_peak_dbtp=round(db(tp_env(ym).max()), 2),
                          sample_peak_dbfs=round(db(np.abs(ym).max()), 2), lra_lu=round(lra(kpow(ym)), 2),
                          clipped_samples=int((np.abs(ym) >= 0.9999).sum()), dc_offset=[float(ym[:, 0].mean()), float(ym[:, 1].mean())],
                          lr_correlation=round(float(np.corrcoef(ym[:, 0], ym[:, 1])[0, 1]), 3),
                          mono_fold_loss_lu=round(integrated(kpow(ym)) - integrated(kpow(np.repeat(ym.mean(1, keepdims=True), 2, 1))), 2),
                          lr_balance_db=round(10 * np.log10((ym[:, 0] ** 2).sum() / (ym[:, 1] ** 2).sum()), 2))
    ya = load(OUT + "/mix.m4a", 2)
    pr = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_name,sample_rate,channels,bit_rate,duration",
                         "-of", "json", OUT + "/mix.m4a"], capture_output=True, text=True).stdout
    R["final_m4a"] = dict(decoded_samples=len(ya), integrated_lufs=round(integrated(kpow(ya)), 2), true_peak_dbtp=round(db(tp_env(ya).max()), 2), ffprobe=json.loads(pr))
    R["stems_integrated_lufs"] = {k_: round(integrated(p_), 2) for k_, p_ in pw.items()}
    # loudness curves
    tm, Lm = {}, {}
    for k_, p_ in pw.items():
        tm[k_], Lm[k_] = win_loud(p_, 0.4, 0.05)
    ts, Ls = {}, {}
    for k_, p_ in pw.items():
        ts[k_], Ls[k_] = win_loud(p_, 3.0, 0.1)
    np.savez_compressed(OUT + "/loudness.npz", **{"tm_" + k_: tm[k_] for k_ in tm}, **{"Lm_" + k_: Lm[k_] for k_ in Lm},
                        **{"ts_" + k_: ts[k_] for k_ in ts}, **{"Ls_" + k_: Ls[k_] for k_ in Ls})
    fw = E["first_word"]
    R["start_curve"] = dict(
        momentary_400ms_every_0p25s={k_: [[round(float(a), 2), round(float(b), 1)] for a, b in zip(tm[k_], Lm[k_]) if a <= 8.0 and abs((a * 4) - round(a * 4)) < 1e-6]
                                     for k_ in ("music", "voice", "mix", "sfx")},
        music_title_0p5_to_ramp_start_lufs=round(float(10 * np.log10(np.mean(10 ** (Lm["music"][(tm["music"] >= 0.5) & (tm["music"] <= fw - MUSIC["first_ramp"])] / 10)))), 2),
        music_title_0p4_to_2p6_lufs=round(float(10 * np.log10(np.mean(10 ** (Lm["music"][(tm["music"] >= 0.4) & (tm["music"] <= 2.6)] / 10)))), 2),
        music_title_max_momentary_lufs=round(float(Lm["music"][(tm["music"] >= 0.2) & (tm["music"] <= fw)].max()), 2),
        music_under_first_words_lufs=round(float(10 * np.log10(np.mean(10 ** (Lm["music"][(tm["music"] >= fw + 0.3) & (tm["music"] <= fw + 4.0)] / 10)))), 2),
        music_under_speech_median_momentary_lufs=round(float(np.median(Lm["music"][np.interp(tm["music"], tt, act.astype(float)) > 0.5])), 2))
    sc = R["start_curve"]
    sc["title_minus_under_first_words_lu"] = round(sc["music_title_0p4_to_2p6_lufs"] - sc["music_under_first_words_lufs"], 2)
    sc["title_minus_under_speech_median_lu"] = round(sc["music_title_0p4_to_2p6_lufs"] - sc["music_under_speech_median_momentary_lufs"], 2)
    exc = E["exclude_even"]
    keep = np.array([not any(a - 1.5 <= x_ <= b + 1.5 for a, b in exc) for x_ in ts["music"]]) & (ts["music"] >= 1.5) & (ts["music"] <= E["dur"] - 1.5)
    Lsm = Ls["music"][keep]
    R["music_evenness"] = dict(short_term_3s_lufs=dict(min=round(float(Lsm.min()), 2), max=round(float(Lsm.max()), 2), range_lu=round(float(Lsm.max() - Lsm.min()), 2),
                                                       p5=round(float(np.percentile(Lsm, 5)), 2), p95=round(float(np.percentile(Lsm, 95)), 2),
                                                       min_at_s=round(float(ts["music"][keep][np.argmin(Lsm)]), 1), max_at_s=round(float(ts["music"][keep][np.argmax(Lsm)]), 1)),
                               excluded_windows=exc,
                               whole_video_incl_exceptions=dict(min=round(float(Ls["music"][(ts["music"] >= 1.5) & (ts["music"] <= E["dur"] - 1.5)].min()), 2),
                                                                max=round(float(Ls["music"].max()), 2)))
    R["marks_momentary_lufs"] = {k_: dict(t=t_, music=round(float(np.interp(t_, tm["music"], Lm["music"])), 1),
                                          sfx=round(float(np.interp(t_, tm["sfx"], Lm["sfx"])), 1), mix=round(float(np.interp(t_, tm["mix"], Lm["mix"])), 1))
                                 for k_, t_ in E["marks"].items()}
    json.dump(R, open(OUT + "/report.json", "w"), indent=1, ensure_ascii=False)
    log("final: I %.2f LUFS, TP %.2f dBTP (m4a %.2f), limiter GR max %.2f dB at %.2f s" % (
        R["final_wav"]["integrated_lufs"], R["final_wav"]["true_peak_dbtp"], R["final_m4a"]["true_peak_dbtp"], R["master"]["limiter_gr_max_db"], R["master"]["limiter_gr_max_at_s"]))

    # ------------------------------------------------------------------ 6. MUX
    if not A.no_mux:
        mx = []
        for src, dst in E["mux"]:
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-i", OUT + "/mix.m4a", "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "copy",
                            "-t", "%.3f" % E["dur"], "-movflags", "+faststart", dst], check=True)
            pj = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_type,codec_name,duration,nb_frames",
                                            "-of", "json", dst], capture_output=True, text=True).stdout)
            mx.append(dict(src=src, dst=dst, probe=pj))
            log("muxed", dst, pj["format"]["duration"], [(s_["codec_type"], s_.get("duration"), s_.get("nb_frames")) for s_ in pj["streams"]])
        R["mux"] = mx
        json.dump(R, open(OUT + "/report.json", "w"), indent=1, ensure_ascii=False)
    log("done")


if __name__ == "__main__":
    main()
