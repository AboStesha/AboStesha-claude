#!/usr/bin/env python3
# compose.py - ORIGINAL score for the Axi Select series (video 1 "Seed", video 2 "Incubation").
# One theme for the series: D minor, ~82.5 BPM 4/4, the three-note motif D-F-E (1, b3, 2) answered by D-F-G,
# harmony i - bVI - iv - V (Dm(add9) Bb(add9) Gm(add9) Asus4/A), lifts on bVI - bVII (Bb - C), the end on Dm(add9).
# Sources: VSCO 2 Community Edition (CC0) strings, upright piano, timpani, bass drum, gong, suspended cymbal;
# everything else synthesised here (drone, heartbeat sub pulse, watch ticks, sub drops, noise risers, hall IRs).
# Deterministic: python3 -I compose.py ep2|ep1  -> ../ep2|ep1/{pads,bass,perc,motif,fx,mix}.wav + markers.json
# v2 (music-supervisor review, 2026-10-21; the composer's v1 is kept in ../v1/): a written spiccato ostinato with real
# round robins and phrase dynamics instead of a one-note loop; watch ticks only where the picture is about time;
# lighter low end (pulse body, no D1 doubles, shorter sub drops, high-passed reverb returns); retuned timpani;
# no programmed level drop at the start; the break rings out in the room; damped piano roots; a natural end tail
import sys, os, json, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *

EP = sys.argv[1] if len(sys.argv) > 1 else "ep2"
T_START = time.time()
OUTD = os.path.join(ROOT, EP)
os.makedirs(OUTD, exist_ok=True)

# ------------------------------------------------------------------ episode timing (output seconds, from the EDLs)
# ep2: bar 0 = 0.968; DROP 1 (bar 11) = 33.00 (frame 825); DROP 2 (bar 26) = 76.68 (frame 1917, the cut to «مبروك!»);
#      15 bars between the drops = 2.912 s/bar = 82.42 BPM; 3 bars of 2.8947 s (82.91 BPM) to the END hit (bar 29) = 85.364
# ep1: bar 0 = 0.43; DROP 1 (bar 6) = 17.88 (frame 447); DROP 2 (bar 30) = 87.68 (frame 2192, the cut to «بحساب التداول»);
#      24 bars between the drops = 2.90833 s/bar = 82.52 BPM; v2: 6 bars of 2.91333 s (82.38 BPM) to the U cut (bar 36 =
#      105.16, frame 2629, the red limit ring; v1 had it 13 ms early) and 3 bars of 2.90667 s (82.57 BPM) to the END hit = 113.88
CFG = {
    "ep2": dict(dur=91.0, segs=[(0, 0.968, 2.912), (26, 76.68, (85.364 - 76.68) / 3.0)], seed=2002,
                speech=(3.06, 84.64), end_bar=29, d1=11, d2=26, open_lift=(0.0, 0.8, 2.2), title_vel=(0.42, 0.36, 0.39), open_swell=2.5),
    "ep1": dict(dur=120.0, segs=[(0, 0.43, 69.80 / 24.0), (30, 87.68, (105.16 - 87.68) / 6.0), (36, 105.16, (113.88 - 105.16) / 3.0)],
                seed=1001, speech=(3.00, 113.88), end_bar=39, d1=6, d2=30, open_lift=(0.0, 0.6, 2.0), title_vel=(0.37, 0.32, 0.35), open_swell=2.5),
}[EP]
DUR = CFG["dur"]; N = int(round(DUR * SR)); TT = np.arange(N) / SR
RNG = np.random.default_rng(CFG["seed"])

def T(bar, beat=0.0):
    b = bar + beat / 4.0
    segs = CFG["segs"]
    s = segs[0]
    for q in segs:
        if b >= q[0]: s = q
    return s[1] + (b - s[0]) * s[2]
def BEAT(bar): return (T(bar + 1) - T(bar)) / 4.0

# ------------------------------------------------------------------ buses
STEMS = ["pads", "bass", "perc", "motif", "fx"]
DRY = {s: np.zeros((N, 2), np.float32) for s in STEMS}
IRS = {
    # v2: shorter low-band RT (it was 4.6 / 6.8 s below 250 Hz: every pulse and spiccato note turned into boom)
    "room": make_ir(1.3, (0.8, 0.9, 0.7, 0.45), predelay=0.008, seed=11, er_span=0.04),
    "hall": make_ir(6.0, (2.6, 3.4, 2.4, 1.2), predelay=0.028, seed=12),
    "void": make_ir(8.5, (3.8, 4.6, 3.0, 1.5), predelay=0.045, seed=13, er_gain=0.2, damp_hf=5000.0),
}
RET_HP = {"room": 110.0, "hall": 170.0, "void": 190.0}   # v2: the reverb returns are high-passed (2nd order) at these Hz
SEND = {s: {} for s in STEMS}                      # created on first use (memory)
POST = {s: np.zeros((N, 2), np.float32) for s in STEMS}       # added after the stem gates (the break's ticks and swell)
LOG = []
ONSETS = []

def add(stem, x, t, g=1.0, send=None, post=False, tag=None):
    if g == 0 or x is None: return
    x = stereo(x)
    if post:
        ONSETS.append((round(t, 3), stem, (tag or "") + " (post)"))
        place(POST[stem], x, t, g)
        for k, v in (send or {}).items(): place(POST[stem], convolve(np.pad(x, ((0, int(2 * SR)), (0, 0))) * v, IRS[k]), t, g)
        return
    place(DRY[stem], x, t, g)
    ONSETS.append((round(t, 3), stem, tag or ""))
    for k, v in (send or {}).items():
        if k not in SEND[stem]: SEND[stem][k] = np.zeros((N, 2), np.float32)
        place(SEND[stem][k], x, t, g * v)
    if tag: LOG.append(dict(t=round(t, 3), stem=stem, what=tag))

def jit(ms=6.0): return RNG.normal(0, ms / 1000.0)

# ------------------------------------------------------------------ harmony
CH = {
    "Dm":   dict(cb=[38], vc=[50, 57], va=[62, 65], vn=[69, 76]),     # D2 | D3 A3 | D4 F4 | A4 E5   Dm(add9)
    "Bb":   dict(cb=[34], vc=[46, 53], va=[62, 65], vn=[70, 72]),     # Bb1 | Bb2 F3 | D4 F4 | Bb4 C5  Bb(add9)
    "Gm":   dict(cb=[31], vc=[43, 50], va=[58, 62], vn=[67, 69]),     # G1 | G2 D3 | Bb3 D4 | G4 A4   Gm(add9)
    "Asus": dict(cb=[33], vc=[45, 52], va=[62, 64], vn=[69, 76]),     # A1 | A2 E3 | D4 E4 | A4 E5   Asus4
    "A":    dict(cb=[33], vc=[45, 52], va=[61, 64], vn=[69, 76]),     # ... C#4                      A
    "C":    dict(cb=[36], vc=[48, 55], va=[62, 64], vn=[67, 72]),     # C2 | C3 G3 | D4 E4 | G4 C5   Cadd9
    "Eb":   dict(cb=[39], vc=[51, 58], va=[63, 67], vn=[70, 74]),     # Eb2 | Eb3 Bb3 | Eb4 G4 | Bb4 D5  Ebmaj7 (bII)
    "Dm_end": dict(cb=[38], vc=[45, 50], va=[57, 65], vn=[69, 76]),   # D2 | A2 D3 | A3 F4 | A4 E5
}
# v1 ostinato roots (unused since v2, see OST_ROOT)
ROOT_O = {"Dm": 38, "Dm_end": 38, "Bb": 46, "Gm": 43, "Asus": 45, "A": 45, "C": 48, "Eb": 39}   # ostinato (cello) roots
SEC = dict(cb=("bass", "cb", 0.15, {"hall": 0.22}), vc=("pads", "vc", -0.35, {"hall": 0.42}),
           va=("pads", "va", 0.35, {"hall": 0.45}), vn=("pads", "vn", -0.15, {"hall": 0.55, "void": 0.15}))

def strings(chords, layer_fn):
    """chords: [(t_on, t_off, name)]; layer_fn(t) -> {section: (vel, forte_mix)}; a note common to consecutive chords
    is held (tied) instead of re-bowed; everything else changes legato (0.45 s bow attack, 1.1 s release overlap)"""
    notes = []                                   # [sec, midi, t_on, t_off, vel, fmix, k]
    for (ta, tb, name) in chords:
        if name is None: continue
        lay = layer_fn(ta)
        for sec, ms in CH[name].items():
            vel, fmix = lay.get(sec, (0, 0))
            if vel <= 0: continue
            for k, m in enumerate(ms):
                prev = [q for q in notes if q[0] == sec and q[1] == m and abs(q[3] - (ta + 0.3)) < 0.45
                        and abs(q[4] - vel) < 1e-6 and q[5] == fmix]
                if prev: prev[-1][3] = tb
                else: notes.append([sec, m, ta, tb, vel, fmix, k])
    starts = [c[0] for c in chords if c[2] is not None]
    for (sec, m, ta, tb, vel, fmix, k) in notes:
        stem, mp, pn, snd = SEC[sec]
        att = 0.45 if sec != "cb" else 0.35
        so = 0.0
        if ta <= 0.0: att, so = 0.12, 0.5           # pre-roll: start inside the sustain, at running level
        # v2: a section moving on to the next chord releases in 0.5 s (v1: 0.3 s overlap + 1.1 s release = ~1.4 s of
        # both chords at once, e.g. G1+A1 in the contrabass); the long release stays before a rest and at the end
        rl = 0.5 if any(0.0 < tb - c < 0.6 for c in starts if c > ta + 0.1) else 1.1
        x = sustain(mp, m, tb - ta, att=att, rel=rl, vel=vel * (1 - fmix), start_off=so)
        if fmix > 0 and (mp + "_f") in maps():
            x = x + sustain(mp + "_f", m, tb - ta, att=att, rel=rl, vel=vel * fmix, start_off=so)
        if ta <= 0.0 and CFG.get("open_swell"):
            # v2: the held opening chord swells by open_swell dB over 2.5-5.0 s as the title's piano decays, so the music
            # does not sag under his first words (no new attack: the chord just grows)
            sw = CFG["open_swell"]; tt_ = ta + np.arange(len(x)) / SR
            x = x * db(np.interp(tt_, [0, 2.0, 4.2, 1e9], [0, 0, sw, sw]))[:, None]
        x = pan(x, pn + (0.12 if k else -0.12))
        if sec in ("va", "vn"): x = lp(x, 5200)
        add(stem, x, ta + 0.004 * k, 1.0, snd)
    MARK.setdefault("string_notes", len(notes))

def piano(t, midi, vel, cut=1600.0, dyn="p", ring=7.0, send=None, stem="motif", pn=0.05, damp=None):
    # v2: damp = note-off (s after t); the low roots are damped at the next chord change instead of ringing 7 s into it
    x = pluck("pno" if dyn == "p" else "pno_m", midi, vel=vel, maxdur=ring, norm_win=0.4, damp=damp, rel=0.5)
    # felt: soften the hammer (5 ms) and roll the top off
    k = int(0.005 * SR); x[:k] *= np.linspace(0, 1, k)[:, None]
    x = lp(x, cut, 2)
    add(stem, pan(x, pn), t, 1.0, send if send is not None else {"hall": 0.55, "void": 0.2}, tag="piano %d" % midi)

def cello_line(t, midi, dur, vel, fmix=0.0, att=0.18, rel=0.9, stem="motif", pn=-0.1):
    x = sustain("vc", midi, dur, att=att, rel=rel, vel=vel * (1 - fmix))
    if fmix: x = x + sustain("vc_f", midi, dur, att=att, rel=rel, vel=vel * fmix)
    add(stem, pan(lp(x, 4500), pn), t, 1.0, {"hall": 0.5}, tag="cello %d" % midi)

def cello_phrase(seq, last_rel=0.9, **kw):
    """v2: a melodic line is monophonic: each note hands over to the next with a 0.22 s release and 50 ms of overlap
    (v1 released every note over 0.9 s, so D3 F3 E3 sounded as a cluster, like a sampler, not a cello section)"""
    for i, (t, m, dur, vel, fmix) in enumerate(seq):
        nxt = seq[i + 1][0] if i + 1 < len(seq) else None
        if nxt is not None and nxt - (t + dur) < 0.06: cello_line(t, m, nxt - t + 0.05, vel, fmix=fmix, rel=0.22, **kw)
        else: cello_line(t, m, dur, vel, fmix=fmix, rel=last_rel if nxt is None else 0.9, **kw)

def violin_line(t, midi, dur, vel, att=0.6, rel=1.5):
    x = sustain("vn", midi, dur, att=att, rel=rel, vel=vel)
    add("pads", pan(lp(x, 5000), 0.25), t, 1.0, {"hall": 0.6, "void": 0.2}, tag="violin %d" % midi)

# ------------------------------------------------------------------ the ostinato (v2)
# v1 hammered the chord root on every eighth (one pitch, fixed 3+3+2 accents, two transposed neighbour samples).
# v2 writes a figure per chord over a falling line D3 - Bb2 - G2 - A2, with the pick-up naming the chord, real round robins
# (RR1/RR2 x the two nearest sampled pitches), bow weight by position, phrase dynamics and correlated timing drift.
OST_ROOT = {"Dm": 50, "Dm_end": 50, "Bb": 46, "Gm": 43, "Asus": 45, "A": 45, "C": 48, "Eb": 51}
COLOUR = {"Dm": 3, "Dm_end": 3, "Bb": 4, "Gm": 3, "Asus": 5, "A": 4, "C": 4, "Eb": 4}   # b3 / 3 / 4 above the root
FIG = {"A": [0, 0, 7, 0, 0, 7, 0, "c"],                 # 3+3+2: D D A D D A D F | Bb Bb F Bb Bb F Bb D | G G D G G D G Bb
       "B": [0, None, None, 0, None, None, 0, None],     # the accents only: thin, under dense explanations
       "C": [0, 7, 12, 0, 7, 12, 0, 7],                  # rolling: the lifts
       "D": [0, 0, 0, 0, 0, 0, 0, 0]}                    # straight eighths: the bar before a hit (with a crescendo)
BEAT_W = [1.0, 0.56, 0.66, 0.86, 0.55, 0.66, 0.92, 0.62]
_RR = {}
_DRIFT = [0.0]
def ost_note(t, midi, vel, accent=False, double=False):
    mp = "vc_spic_f" if accent else "vc_spic"
    k = _RR.get((mp, midi), 0); _RR[(mp, midi)] = k + 1
    m1, m2 = maps()[mp], maps()[mp + "_rr2"]
    near = sorted(m1, key=lambda q: (abs(q - midi), q))[:2]
    key = near[(k // 2) % 2] if abs(near[1] - midi) <= 2 else near[0]
    p_, true_ = (m1 if k % 2 == 0 else m2)[key]
    x = pitched(p_, midi - true_, maxlen=0.5)[:int(0.45 * SR)].copy()
    x *= 0.1 / (np.sqrt((x[:int(0.12 * SR)] ** 2).mean()) + 1e-9) * vel * np.exp(RNG.normal(0, 0.05))
    k_ = int(0.16 * SR); x[-k_:] *= np.linspace(1, 0, k_)[:, None]
    x = lp(x, 3200 if accent else 2600)
    _DRIFT[0] = 0.7 * _DRIFT[0] + RNG.normal(0, 0.0024)          # a section drifts together, it does not jitter at random
    dt = _DRIFT[0] - (0.003 if accent else -0.0015)              # leans into the accents, the off-beats sit back
    add("bass", pan(x, -0.2), t + dt, 1.0, {"room": 0.25, "hall": 0.16})
    if double:                                                   # contrabass an octave below (D2 Bb1 G1 A1, never D1)
        y = pluck("cb_spic", midi - 12, vel=vel * 0.7, maxdur=0.55, rel=0.12, norm_win=0.15)
        add("bass", pan(lp(y, 1800), 0.15), t + dt + 0.004, 1.0, {"room": 0.2, "hall": 0.1})

def ost_bar(b, fig, scale, chord_of, skip=None, cresc=None):
    for k, d in enumerate(FIG[fig]):
        if d is None: continue
        tk = T(b, k / 2)
        if skip is not None and skip(tk): continue
        c = chord_of(T(b, k / 2 + 0.05))
        m = OST_ROOT[c] + (COLOUR[c] if d == "c" else d)
        w = BEAT_W[k] * (1.0 if cresc is None else cresc(k))
        ost_note(tk, m, 0.62 * w * scale, accent=k in (0, 3, 6), double=(k in (0, 6) and d == 0))

def chord_at(CHS):
    return lambda t: [q for q in CHS if q[0] <= t][-1][2]

def damp_for(ch, t, extra=0.25):
    nxt = [T(b, bt) for (b, bt, c) in ch if T(b, bt) > t + 0.05]
    return (min(nxt) - t + extra) if nxt else None

def pulse(t, vel):
    add("bass", heartbeat(RNG, vel), t, 0.5, None, tag="pulse")          # v2: 0.63 -> 0.5

def ticks(t0, t1, step, vel_fn, post=False, start_hi=True):
    k = 0; t = t0
    while t < t1 - 1e-6:
        hi = (k % 2 == 0) == start_hi
        x = tick(RNG, vel_fn(t) * (1.0 if hi else 0.72), hi=hi)
        add("perc", pan(lp(x, 6500), 0.22 if hi else -0.22), t + jit(2.5), 1.6, {"room": 0.35, "hall": 0.12}, post=post)  # v2: -4.9 dB, darker
        k += 1; t = t0 + k * step

def muted_bd(t, vel, soft=False):
    # v2: the pp take on weak beats, a slightly different head pitch / tone / level every hit (v1: one identical copy)
    st = round(float(RNG.uniform(-0.35, 0.35)), 2)
    f = "bdrum_muted_pp_1.wav" if soft else "bdrum_muted_mf_1.wav"
    x = one_shot("VSCO 1 Percussion/drums/bass/" + f, st, vel * np.exp(RNG.normal(0, 0.06)), maxdur=0.8)
    if soft: x = x * (0.1 / (np.sqrt((x[:int(0.1 * SR)] ** 2).mean()) + 1e-9)) * 0.9
    add("perc", lp(x, 1500 + 300 * RNG.random()), t + jit(3), 1.4, {"room": 0.3, "hall": 0.06})

def timp(t, pitch="D", vel=0.6, loud=False, stem="perc"):
    # v2: retuned on the measured principal (1,1) mode, 0.08-1.2 s after the attack: Timpani2 46.8, Timpani3 49.5,
    # Timpani4 52.42 (v1's YIN estimate put the Eb 0.5 st sharp and the A / Bb / G ~0.25 st sharp)
    f, st = {"D": ("Timpani3", 0.51), "A": ("Timpani2", -1.8), "C": ("Timpani3", -1.49), "Bb": ("Timpani2", -0.8),
             "G": ("Timpani2", -3.8), "Eb": ("Timpani4", -1.42)}[pitch]
    x = one_shot("Percussion/Timpani/%s_Hit_v%d_rr1_Sum.wav" % (f, 3 if loud else 1), st, vel, maxdur=4.0)
    add(stem, lp(x, 3500), t, 1.0, {"hall": 0.35, "void": 0.15}, tag="timp " + pitch)

def timp_roll(t_end, T_len, vel=0.5, pitch="A"):
    # v2: v1 played the Timpani1 roll untransposed = F#2 -0.18 st (91.5 Hz, out of the key) under C and Asus;
    # now Timpani2's roll (principal 126.5 Hz = 47.42) on A2, or Timpani1's on D2
    f, st = {"A": ("Timpani2", 45 - 47.42), "D": ("Timpani1", 38 - 41.82)}[pitch]
    x = one_shot("Percussion/Timpani/Rolls/%s_Roll_v3_rr1_Sum.wav" % f, st, 1.0)
    n = int(T_len * SR)
    if len(x) < n: x = np.pad(x, ((0, n - len(x)), (0, 0)))
    x = x[:n] * (np.linspace(0, 1, n) ** 2.2)[:, None] * vel
    k_ = int(0.015 * SR); x[-k_:] *= np.linspace(1, 0, k_)[:, None]   # no hard stop when the stem is soloed
    add("perc", lp(x, 3000), t_end - T_len, 1.0, {"hall": 0.35}, tag="timp roll")

def metal(t, kind, vel, st=-12.0):
    f = {"scrape1": "VSCO 1 Percussion/varMetal/Cymbals/susp/susp_FX_scrape_1.wav",
         "scrape2": "VSCO 1 Percussion/varMetal/Cymbals/susp/susp_FX_scrape_2.wav",
         "scrape3": "VSCO 1 Percussion/varMetal/Cymbals/susp/susp_FX_scrape_3.wav",
         "gscrape1": "VSCO 1 Percussion/varMetal/Gong/gong_scrape_1.wav",
         "gscrape2": "VSCO 1 Percussion/varMetal/Gong/gong_scrape_2.wav",
         "gscrape3": "VSCO 1 Percussion/varMetal/Gong/gong_scrape_3.wav"}[kind]
    x = one_shot(f, st, vel, maxdur=6.0)
    x = lp(hp(x, 120), 4200)
    k = int(0.15 * SR); x[:k] *= np.linspace(0, 1, k)[:, None]
    add("fx", width(x, 1.3), t, 0.6, {"void": 0.9}, tag="metal " + kind)

def cym_swell(t_end, T_len, vel):
    x = one_shot("VSCO 1 Percussion/varMetal/Cymbals/susp/susp_hit_softmall_roll2_cresc.wav", -2.0, 1.0)
    # use the crescendo part only, ending at its loudest point
    env = np.convolve(np.abs(x).mean(1), np.ones(2400) / 2400, "same")
    pk = int(np.argmax(env))
    n = int(T_len * SR)
    seg = x[max(0, pk - n):pk]
    seg = seg * (np.linspace(0, 1, len(seg)) ** 1.5)[:, None]
    seg = lp(seg, 5500)
    k_ = int(0.006 * SR); seg[-k_:] *= np.linspace(1, 0, k_)[:, None]
    add("fx", width(seg, 1.2), t_end - len(seg) / SR, vel, {"hall": 0.4}, tag="cymbal swell")

def rev_swell(t_end, notes, T_len, vel, dyn="m"):
    """reverse-reverb piano swell on the coming chord, ending exactly at t_end"""
    src = np.zeros((int(3 * SR), 2))
    for m in notes:
        place(src, pluck("pno_m" if dyn == "m" else "pno", m, vel=1.0, maxdur=3.0, norm_win=0.4), 0.0)
    wet = convolve(np.pad(src, ((0, int(5 * SR)), (0, 0))), IRS["void"])
    n = int(T_len * SR)
    seg = wet[:n][::-1].copy()
    seg *= (np.linspace(0, 1, n) ** 1.8)[:, None]
    seg = lp(seg, 3000)
    k_ = int(0.006 * SR); seg[-k_:] *= np.linspace(1, 0, k_)[:, None]
    add("fx", seg / (np.abs(seg).max() + 1e-9), t_end - T_len, vel, None, post=True, tag="reverse swell")

def impact(t, size=1.0, gong=None, timp_pitch="D", bd="v7"):
    x = one_shot("Percussion/BDrumNewhit_%s_rr1_Sum.wav" % bd, 0.0, 1.0, maxdur=4.0)
    x = x / (np.abs(x).max() + 1e-9)
    add("fx", lp(x, 2500), t, 0.42 * size, {"void": 0.25}, tag="impact bd")
    add("fx", sub_drop(1.0, T=2.2, dec=0.5), t, 0.2 * size, None, tag="impact sub")      # v2: the SFX bed layers a boom here
    timp(t, timp_pitch, 0.9 * size, loud=True, stem="fx")
    if gong:
        g = one_shot("VSCO 1 Percussion/varMetal/Gong/gong_hit_%s.wav" % gong, -2.0, 1.0, maxdur=9.0)
        g = g / (np.abs(g).max() + 1e-9)
        add("fx", lp(hp(g, 60), 3200), t, 0.3 * size, {"void": 0.28}, tag="impact gong")

def riser(t_end, T_len, vel):
    add("fx", noise_riser(RNG, T_len, vel=1.0), t_end - T_len, vel, {"hall": 0.3}, tag="noise riser")

# ------------------------------------------------------------------ the scores
MARK = dict(sections=[], drops={}, notes={
    "ep2": ["DROP 2 is placed on the picture cut to the «مبروك!» close-up: EDL shot P starts at frame 1917 = 76.68 s "
            "(the brief said 76.64, the old track's downbeat 76.636); DROP 1 = frame 825 = 33.00 s; END hit 85.364 "
            "(the end card's logo build, frame 2131 + 0.12 s). The SFX bed's booms are on the same frames.",
            "The break: the orchestra stops on beat 2 of bar 25 (74.50) and the hall rings out naturally (v2: the gate acts "
            "before the reverb); only soft watch ticks and a reverse swell play until DROP 2.",
            "The watch ticks play only in B-roll 1 (10.80-16.26, the withdrawal window) and stop before the padlock snaps "
            "(16.59), plus a few very soft ones in the break.",
            "His first words 3.06-4.80: no new note, hit or pulse (v2 removed v1's heartbeat at 3.88)."],
    "ep1": ["DROP 2 is placed on the picture cut to WIDE on «بحساب التداول»: EDL frame 2192 = 87.68 s (the brief said 87.70); "
            "DROP 1 = frame 447 = 17.88; the re-lift = bar 36 = 105.16 exactly (frame 2629; v1 was 13 ms early); END hit = "
            "113.88 (frame 2847).",
            "The client's two windows (3.00-4.75 «مرحبا بك في برنامج التمويل», 41.55-43.25 «خمسة آلاف دولار») contain no "
            "new note, hit or tick onset: the chords just sustain there (checked: src/check_windows.py).",
            "The watch ticks play only in B-roll 1 (12.06-16.43), soft.",
            "«خمسة آلاف دولار» (41.55-43.25), his softest line: the music also steps back 3.5 dB over 41.1-43.7 (0.4 s ramps)."],
}.get(EP, []))

def chords_from(changes, t_first=0.0):
    """[(bar, beat, name)] -> [(t_on, t_off, name)]: each chord starts 80 ms early and overlaps the next by 0.15 s (v1 0.3)"""
    out = []
    for i, (b, bt, name) in enumerate(changes[:-1]):
        ta = max(t_first, T(b, bt) - 0.08)
        nb, nbt, _ = changes[i + 1]
        tb = T(nb, nbt) + (0.15 if changes[i + 1][2] is not None else 0.0)
        out.append((ta, tb, name))
    return out

def end_hit(END):
    """the series' ending: one deep hit + the Dm(add9) chord, decaying by itself (v2: lighter, shorter void sends)"""
    impact(END, 0.95, gong="f")
    for m, v in [(26, 0.7), (38, 0.65), (45, 0.55), (50, 0.55), (57, 0.5), (62, 0.58), (65, 0.4)]:
        piano(END + 0.012 * (m % 5), m, v, cut=2600, dyn="m", ring=5.0, send={"hall": 0.45, "void": 0.2})
    cello_line(END, 50, 1.4, 0.6, fmix=0.5, rel=2.4)
    violin_line(END, 76, 1.2, 0.2, att=0.3, rel=2.6)

def score_ep2():
    E = CFG
    # chord changes (bar, beat, chord); None = the break
    ch = [(-1, 0, "Dm"), (2, 0, "Bb"), (4, 0, "Gm"), (6, 0, "Asus"), (8, 0, "Dm"), (9, 0, "Bb"), (10, 0, "Gm"), (10, 2, "A"),
          (11, 0, "Dm"), (12, 0, "Bb"), (13, 0, "Gm"), (14, 0, "Asus"), (14, 2, "A"), (15, 0, "Dm"), (16, 0, "Bb"),
          (17, 0, "Gm"), (18, 0, "Asus"), (18, 2, "A"), (19, 0, "Dm"), (20, 0, "Bb"), (21, 0, "Gm"), (22, 0, "Asus"),
          (22, 2, "A"), (23, 0, "Bb"), (24, 0, "C"), (25, 0, "Asus"), (25, 1, None), (26, 0, "Dm"), (27, 0, "Bb"),
          (28, 0, "C"), (29, 0, "Dm_end"), (29, 0, None)]
    CHS = chords_from(ch)
    CHS = [c for c in CHS if c[2] != "Dm_end"] + [(T(29) - 0.02, T(29) + 1.4, "Dm_end")]
    D1, D2, END = T(11), T(26), T(29)
    CA = chord_at(CHS)
    def lay(t):     # v2: the violins stay on (softly) through the intro: v1 dropped them at the first chord change
        if t < 3.2:   return dict(cb=(0.55, 0), vc=(0.6, 0), va=(0.32, 0), vn=(0.14, 0))
        if t < T(6) - 0.2: return dict(cb=(0.56, 0), vc=(0.57, 0), va=(0.32, 0), vn=(0.11, 0))
        if t < D1 - 0.2: return dict(cb=(0.58, 0), vc=(0.58, 0.1), va=(0.34, 0), vn=(0.12, 0))
        if t < T(17) - 0.2: return dict(cb=(0.66, 0.2), vc=(0.6, 0.25), va=(0.36, 0))
        if t < T(23) - 0.2: return dict(cb=(0.64, 0.15), vc=(0.6, 0.2), va=(0.38, 0), vn=(0.1, 0))
        if t < T(25, 1): return dict(cb=(0.74, 0.4), vc=(0.68, 0.45), va=(0.42, 0), vn=(0.2, 0))
        if t < END - 0.2: return dict(cb=(0.76, 0.5), vc=(0.7, 0.5), va=(0.42, 0), vn=(0.16, 0))
        return dict(cb=(0.8, 0.5), vc=(0.72, 0.5), va=(0.45, 0), vn=(0.22, 0))
    strings(CHS, lay)
    # the drone: a tonic pedal D2 + D3 (v1's A2 rubbed a semitone against every Bb chord in the bass register)
    add("pads", additive_drone(0.0, T(25, 1) - 0.0, [73.42, 146.83], RNG, level=1.0, cut=360, att=0.1, rel=0.35), 0.0, 0.035)
    add("pads", additive_drone(D2, END + 1.0, [73.42, 146.83], RNG, level=1.0, cut=420, att=0.08, rel=2.5), D2 - 0.02, 0.038)

    # --- title (bar 0): the theme's statement, D4 - F4 - E4 on the logo build, low D octave + soft hit
    tv = CFG["title_vel"]
    piano(T(0, 0), 62, tv[0], cut=3400, dyn="m"); piano(T(0, 1), 65, tv[1], cut=3400, dyn="m")
    piano(T(0, 2), 64, tv[2], cut=3400, dyn="m", ring=9.0)
    piano(T(0, 0), 38, 0.5, cut=1500, dyn="p", damp=damp_for(ch, T(0))); piano(T(0, 0), 50, 0.38, cut=1500, dyn="p", damp=damp_for(ch, T(0)))
    impact_soft = one_shot("Percussion/BDrumNewhit_v3_rr1_Sum.wav", 0.0, 1.0, maxdur=3.0)
    add("fx", lp(impact_soft / (np.abs(impact_soft).max() + 1e-9), 1800), T(0) - 0.005, 0.11, {"void": 0.3}, tag="title hit")
    add("fx", sub_drop(1.0, f0=50, f1=36.7, T=1.6, dec=0.4), T(0), 0.1, None)
    # --- intro under the welcome: sparse low piano roots (damped at each chord change), the heartbeat once per bar from bar 2
    for b, m in [(2, 46), (4, 43), (6, 45), (8, 50), (9, 46), (10, 43)]:
        piano(T(b, 0) + 0.01, m, 0.42, cut=1100, dyn="p", damp=damp_for(ch, T(b, 0) + 0.01))
    pulse(T(0, 0), 0.42)
    for b in range(2, 10): pulse(T(b, 0), 0.55 + 0.03 * b)
    pulse(T(10, 0), 0.85); pulse(T(10, 2), 0.85)
    # --- B-roll 1 (10.72-17.72), the withdrawal window: the watch ticks from the first 8th after the cut and STOPS before
    #     the padlock snaps shut (16.59): the clock is the window. (v1 ticked on, nearly non-stop, to 74.3 s.)
    t_tick0 = min(T(3, k / 2) for k in range(0, 16) if T(3, k / 2) >= 10.72)
    t_lock = 16.59
    ticks(t_tick0, t_lock + 0.01, BEAT(3) / 2, lambda t: 0.09 + 0.06 * (t - t_tick0) / (t_lock - t_tick0))
    cello_phrase([(T(4, 0), 50, BEAT(4), 0.5, 0), (T(4, 1), 53, BEAT(4), 0.5, 0), (T(4, 2), 52, BEAT(4) * 5.0, 0.52, 0)], last_rel=1.4)
    metal(10.72, "scrape1", 0.5); metal(T(5, 3), "gscrape1", 0.55, st=-5)        # 17.71: the cut to the staircase
    metal(22.48, "scrape2", 0.45)                                                  # the conditions
    # --- pre-drop: riser, cymbal swell, reverse piano swell into DROP 1 (33.00, in the pause before «ستقوم»)
    riser(D1 - 0.01, BEAT(10) * 4, 0.10); cym_swell(D1 - 0.01, BEAT(10) * 3.0, 0.22)
    rev_swell(D1 - 0.005, [26, 38, 45, 50], BEAT(10) * 2.2, 0.16)
    # --- DROP 1
    impact(D1, 1.0, gong="p"); piano(D1, 26, 0.7, cut=900, dyn="m", ring=5.0); piano(D1, 38, 0.6, cut=900, dyn="m", ring=5.0)
    MARK["drops"]["DROP1"] = round(D1, 3)
    # drive, phrased with the picture: 11-16 figure A (x10 announce + B-roll 2), 17-20 figure B (the four conditions: thin),
    # 21-22 A again (condition 4 + recap), 23-24 C rolling (the flag climbs); the pulse on beat 1 (beat 3 only in the lift)
    plan = {b: "A" for b in range(11, 17)}; plan.update({b: "B" for b in range(17, 21)}); plan.update({21: "A", 22: "A", 23: "C", 24: "C"})
    for b in range(11, 25):
        fig = plan[b]
        sc = {"A": 0.93 + 0.045 * ((b - 11) % 4), "B": 1.0, "C": 1.06 + 0.06 * (b - 23)}[fig]
        if b == 11: sc = 1.05                                   # the drop bar itself lands, the phrase then builds
        ost_bar(b, fig, sc, CA, cresc=(lambda k: 0.88 + 0.035 * k) if b == 24 else None)
        pulse(T(b, 0), 0.85 if fig != "B" else 0.7)
        if fig == "C" or b == 11: pulse(T(b, 2), 0.62)
        muted_bd(T(b, 0), 0.45 if fig != "B" else 0.34)
        if fig != "B": muted_bd(T(b, 2), 0.3, soft=True)
        if b in (11, 15, 21): timp(T(b, 0), "D", 0.45)
        if b == 23: timp(T(b, 0), "Bb", 0.5)
        if b == 24: timp(T(b, 0), "C", 0.55)
    # B-roll 2 (37.04-48.04): the motif on felt piano, then its answer (v2: brighter so it reads, shorter ring)
    for (b, bt, m, v) in [(12, 1, 62, 0.42), (12, 2, 65, 0.38), (12, 3, 64, 0.42), (14, 1, 62, 0.4), (14, 2, 65, 0.37),
                          (14, 3, 67, 0.42), (15, 1, 65, 0.34), (15, 2, 64, 0.36)]:
        piano(T(b, bt), m, v * 1.2, cut=2200, dyn="p", ring=4.5)
    metal(48.04, "gscrape2", 0.4, st=-5)                                            # the $20,000 cap
    # LIFT (the flag climbs, 68.16): cello rises F3 - G3 - A3, the violins enter, a swell crests on the cut
    cello_phrase([(T(23, 0), 53, BEAT(23) * 4, 0.55, 0.3), (T(24, 0), 55, BEAT(24) * 4, 0.58, 0.4), (T(25, 0), 57, BEAT(25) * 1, 0.6, 0.5)], last_rel=0.3)
    cym_swell(68.16, 1.6, 0.16); metal(68.16, "scrape3", 0.4)
    timp_roll(T(25, 0), BEAT(24) * 4, 0.35, pitch="A")
    # bar 25: the stop on beat 2 (74.50) -> the break: the hall rings out, the watch very soft, a reverse swell into DROP 2
    pulse(T(25, 0), 0.9); muted_bd(T(25, 0), 0.5); timp(T(25, 0), "A", 0.55)
    ost_note(T(25, 0), 45, 0.62, accent=True, double=True)
    ticks(T(25, 1.5), T(26, 0) - 0.2, BEAT(25) / 2, lambda t: 0.06, post=True)
    rev_swell(D2 - 0.005, [38, 45, 50, 53], 1.25, 0.15)
    riser(D2 - 0.01, 1.3, 0.05)
    # --- DROP 2 («مبروك!» close-up 76.68): resolving, warmer, still dark; the theme on cellos with the piano above
    impact(D2, 0.85, gong="mf"); piano(D2, 26, 0.6, cut=900, dyn="m", ring=5.0); piano(D2, 38, 0.5, cut=900, dyn="m", ring=5.0)
    MARK["drops"]["DROP2"] = round(D2, 3)
    for b in range(26, 29):
        fig = "A" if b < 28 else "D"
        ost_bar(b, fig, (1.02 if b == 26 else 0.95) if b < 28 else 0.9, CA, cresc=(lambda k: 0.84 + 0.045 * k) if b == 28 else None)
        pulse(T(b, 0), 0.9); muted_bd(T(b, 0), 0.45); muted_bd(T(b, 2), 0.32, soft=True)
        if b == 26: pulse(T(b, 2), 0.62)
    pulse(T(28, 3), 0.7)
    timp(T(26, 0), "D", 0.5); timp(T(28, 0), "C", 0.55)
    theme = [(26, 0, 50, 1), (26, 1, 53, 1), (26, 2, 52, 4), (27, 2, 50, 1), (27, 3, 53, 1), (28, 0, 55, 2), (28, 2, 53, 1),
             (28, 3, 52, 1)]
    cello_phrase([(T(b, bt), m, BEAT(b) * nb, 0.6, 0.4) for (b, bt, m, nb) in theme])
    for (b, bt, m, nb) in theme: piano(T(b, bt), m + 12, 0.3, cut=1600, dyn="p", ring=4.0)
    # rise into the END hit
    riser(END - 0.01, BEAT(28) * 4, 0.12); cym_swell(END - 0.01, BEAT(28) * 3.2, 0.24)
    timp_roll(END - 0.02, BEAT(28) * 3, 0.38, pitch="A")
    rev_swell(END - 0.005, [26, 38, 45, 50, 57], BEAT(28) * 2.2, 0.18)
    # --- END hit (85.364)
    end_hit(END)
    MARK["drops"]["END_HIT"] = round(END, 3)
    MARK["sections"] = [
        dict(name="title: theme statement (D4 F4 E4 on felt piano, low strings Dm with violins, soft low hit)", t0=0.0, t1=round(T(1), 3), bars=[0, 0]),
        dict(name="A: mysterious intro (Dm Bb Gm Asus, 2 bars each), the violins stay on softly, heartbeat once a bar from bar 2, damped low piano", t0=round(T(1), 3), t1=round(t_tick0, 3), bars=[1, 3]),
        dict(name="A': B-roll 1, the watch ticks with the withdrawal window and stops before the padlock (16.59); cello motif D3 F3 E3 (bar 4)", t0=round(t_tick0, 3), t1=round(T(10), 3), bars=[3, 9]),
        dict(name="pre-drop: Gm-A, heartbeat x2, riser + reverse swell, 0.5 s of air", t0=round(T(10), 3), t1=round(D1, 3), bars=[10, 10]),
        dict(name="B: DROP 1 drive: spiccato figure A (D D A D D A D F...), pulse + muted kick; motif on piano in B-roll 2", t0=round(D1, 3), t1=round(T(17), 3), bars=[11, 16]),
        dict(name="B': the four conditions: thin figure B (accents only), soft violins on top", t0=round(T(17), 3), t1=round(T(21), 3), bars=[17, 20]),
        dict(name="B'': condition 4 + recap: figure A again", t0=round(T(21), 3), t1=round(T(23), 3), bars=[21, 22]),
        dict(name="lift: Bb - C (bVI-bVII), rolling figure C, cello F3 G3 A3, violins, timpani roll on A", t0=round(T(23), 3), t1=round(T(25), 3), bars=[23, 24]),
        dict(name="stop on beat 2, the hall rings out; near-silent break (soft watch ticks, reverse swell)", t0=round(T(25), 3), t1=round(D2, 3), bars=[25, 25]),
        dict(name="C: DROP 2 resolve (Dm Bb C): theme on cellos + piano, figure A, straight eighths into the end", t0=round(D2, 3), t1=round(END, 3), bars=[26, 28]),
        dict(name="END: deep hit (bass drum, timpani D, gong, sub drop) + Dm(add9) chord, natural decay", t0=round(END, 3), t1=DUR, bars=[29, 29]),
    ]
    MARK["chords"] = [[b, bt, c] for (b, bt, c) in ch]
    # automation (dB): a small dip into each drop ("air") and the break stop act BEFORE the reverb (v2); the end fade after it
    gates = dict(
        breaks=[(T(25, 1), D2 - 0.02)],
        dips=[(D1 - BEAT(10) * 0.75, D1, -6.0), (END - BEAT(28) * 0.6, END, -4.0)],
        fade=(END + 3.6, DUR - 0.12),
    )
    return gates

def score_ep1():
    ch = [(-1, 0, "Dm"), (2, 0, "Bb"), (4, 0, "Gm"), (5, 2, "A"),
          (6, 0, "Dm"), (7, 0, "Bb"), (8, 0, "Gm"), (9, 0, "Asus"), (9, 2, "A"), (10, 0, "Dm"), (11, 0, "Bb"), (12, 0, "Gm"),
          (13, 0, "Asus"), (13, 2, "A"), (14, 0, "Dm"), (15, 0, "Bb"), (16, 0, "Gm"), (17, 0, "Asus"), (17, 2, "A"),
          (18, 0, "Dm"), (19, 0, "Bb"), (20, 0, "Gm"), (21, 0, "Asus"), (21, 2, "A"),
          (22, 0, "Dm"), (23, 0, "Bb"), (24, 0, "Gm"), (25, 0, "Asus"), (26, 0, "Dm"), (27, 0, "Bb"), (28, 0, "Gm"),
          (29, 0, "Asus"), (29, 2, "A"),
          (30, 0, "Dm"), (31, 0, "Bb"), (32, 0, "Gm"), (33, 0, "Asus"), (33, 2, "A"), (34, 0, "Dm"), (35, 0, "Gm"),
          (36, 0, "Eb"), (37, 0, "Bb"), (38, 0, "C"), (39, 0, "Dm_end"), (39, 0, None)]
    CHS = chords_from(ch)
    CHS = [c for c in CHS if c[2] != "Dm_end"] + [(T(39) - 0.02, T(39) + 1.4, "Dm_end")]
    D1, D2, U, END = T(6), T(30), T(36), T(39)
    CA = chord_at(CHS)
    QUIET = [(3.00, 4.75), (41.55, 43.25)]          # the client's two windows: no new attacks there
    def ok(t, pad=0.12): return not any(a - pad <= t <= b + pad for a, b in QUIET)
    def lay(t):
        if t < 3.2:   return dict(cb=(0.55, 0), vc=(0.6, 0), va=(0.32, 0), vn=(0.14, 0))
        if t < D1 - 0.2: return dict(cb=(0.56, 0), vc=(0.57, 0.05), va=(0.33, 0), vn=(0.11, 0))
        if t < T(14) - 0.2: return dict(cb=(0.66, 0.2), vc=(0.6, 0.25), va=(0.36, 0))
        if t < T(22) - 0.2: return dict(cb=(0.64, 0.15), vc=(0.6, 0.2), va=(0.38, 0), vn=(0.1, 0))
        if t < D2 - 0.2: return dict(cb=(0.58, 0.1), vc=(0.56, 0.1), va=(0.34, 0), vn=(0.09, 0))
        if t < U - 0.2: return dict(cb=(0.74, 0.4), vc=(0.68, 0.45), va=(0.42, 0))
        if t < END - 0.2: return dict(cb=(0.76, 0.5), vc=(0.7, 0.5), va=(0.42, 0), vn=(0.18, 0))
        return dict(cb=(0.8, 0.5), vc=(0.72, 0.5), va=(0.45, 0), vn=(0.22, 0))
    strings(CHS, lay)
    add("pads", additive_drone(0.0, END + 1.0, [73.42, 146.83], RNG, level=1.0, cut=380, att=0.1, rel=2.5), 0.0, 0.035)
    # --- title: the theme statement (same as video 2)
    tv = CFG["title_vel"]
    piano(T(0, 0), 62, tv[0], cut=3400, dyn="m"); piano(T(0, 1), 65, tv[1], cut=3400, dyn="m")
    piano(T(0, 2), 64, tv[2], cut=3400, dyn="m", ring=9.0)
    piano(T(0, 0), 38, 0.5, cut=1500, dyn="p", damp=damp_for(ch, T(0))); piano(T(0, 0), 50, 0.38, cut=1500, dyn="p", damp=damp_for(ch, T(0)))
    imp = one_shot("Percussion/BDrumNewhit_v3_rr1_Sum.wav", 0.0, 1.0, maxdur=3.0)
    add("fx", lp(imp / (np.abs(imp).max() + 1e-9), 1800), T(0) - 0.005, 0.11, {"void": 0.3}, tag="title hit")
    add("fx", sub_drop(1.0, f0=50, f1=36.7, T=1.6, dec=0.4), T(0), 0.1, None)
    # --- intro (his first words 3.00-4.75 stay clear: the Dm chord just sustains, the pulse starts at bar 2)
    for b, m in [(2, 46), (4, 43)]: piano(T(b, 0) + 0.01, m, 0.42, cut=1100, dyn="p", damp=damp_for(ch, T(b, 0) + 0.01))
    pulse(T(0, 0), 0.42)
    for b in range(2, 5): pulse(T(b, 0), 0.58 + 0.03 * b)
    pulse(T(5, 0), 0.85); pulse(T(5, 2), 0.7)
    # --- B-roll 1 (11.84-17.88): soft watch ticks from the downbeat after the cut (no 16th fill: the SFX bed has its own
    #     ticks at 17.40 and a riser at 17.76); the cello motif
    metal(11.84, "scrape1", 0.5)
    ticks(T(4, 0), T(5, 3), BEAT(4) / 2, lambda t: 0.08 + 0.05 * (t - T(4)) / (T(5, 3) - T(4)))
    cello_phrase([(T(4, 0), 50, BEAT(4), 0.5, 0), (T(4, 1), 53, BEAT(4), 0.5, 0), (T(4, 2), 52, BEAT(4) * 4.0, 0.52, 0)], last_rel=1.2)
    riser(D1 - 0.01, BEAT(5) * 4, 0.085); cym_swell(D1 - 0.01, BEAT(5) * 3.0, 0.18)    # v2: a little less, so DROP 1 lands
    rev_swell(D1 - 0.005, [26, 38, 45, 50], BEAT(5) * 2.2, 0.15)
    # --- DROP 1 (17.88, smash cut to WIDE on «وبمجرّد»)
    impact(D1, 1.0, gong="p"); piano(D1, 26, 0.85, cut=900, dyn="m", ring=5.0); piano(D1, 38, 0.7, cut=900, dyn="m", ring=5.0)
    MARK["drops"]["DROP1"] = round(D1, 3)
    def drive_bar(b, fig, scale=1.0, pulse2=False, cresc=None):
        if ok(T(b, 0)): pulse(T(b, 0), (0.85 if fig != "B" else 0.7) * scale)
        if pulse2 and ok(T(b, 2)): pulse(T(b, 2), 0.62 * scale)
        if ok(T(b, 0)): muted_bd(T(b, 0), (0.45 if fig != "B" else 0.34) * scale)
        if fig != "B" and ok(T(b, 2)): muted_bd(T(b, 2), 0.3 * scale, soft=True)
        ost_bar(b, fig, scale, CA, skip=lambda t: not ok(t, 0.05), cresc=cresc)
    # phrases: 6-13 figure A (DROP 1, «مبروك!» at 34.92), 14-17 figure B (the «5000$» explanation: thin), 18-21 A into the calm
    plan = {b: "A" for b in range(6, 14)}; plan.update({b: "B" for b in range(14, 18)}); plan.update({b: "A" for b in range(18, 22)})
    for b in range(6, 22):
        if b == 6: drive_bar(b, "A", 1.05, pulse2=True); continue      # the drop bar lands, then the phrase builds
        drive_bar(b, plan[b], (0.93 + 0.045 * ((b - 6) % 4)) if plan[b] == "A" else 1.0)
        if b in (6, 10, 18): timp(T(b, 0), "D", 0.45)
    # «مبروك! أنت الآن…» (34.92): the violins open softly on A4 / D5, a small swell crests on the word
    violin_line(34.92 - 0.35, 69, BEAT(11) * 5, 0.16, att=0.5); violin_line(34.92 - 0.35, 74, BEAT(11) * 5, 0.12, att=0.5)
    cym_swell(34.92, 1.2, 0.1)
    # --- calm part (64.41-87.68): no ostinato, a soft pulse once a bar, no ticks (v1 kept them); B-roll 2 carries the motif
    for b in range(22, 29):
        pulse(T(b, 0), 0.62)
        if b % 2 == 0: muted_bd(T(b, 0), 0.26, soft=True)
    for b, m in [(22, 50), (25, 45), (26, 50), (28, 43)]: piano(T(b, 0) + 0.01, m, 0.4, cut=1100, dyn="p", damp=damp_for(ch, T(b, 0) + 0.01))
    metal(67.60, "scrape2", 0.45)
    for (b, bt, m, v) in [(23, 1, 62, 0.44), (23, 2, 65, 0.4), (23, 3, 64, 0.44), (24, 1, 62, 0.42), (24, 2, 65, 0.38),
                          (24, 3, 67, 0.44), (25, 1, 65, 0.34), (25, 2, 64, 0.36)]:
        piano(T(b, bt), m, v, cut=2200, dyn="p", ring=4.5)
    cello_phrase([(T(23, 0), 46, BEAT(23) * 4, 0.3, 0), (T(24, 0), 43, BEAT(24) * 4, 0.3, 0)])
    timp(T(27, 0), "Bb", 0.3)                              # «ملاحظة مهمّة» comes 0.3 bar later
    # pre-drop 2: the heartbeat doubles, the spiccato returns in straight eighths with a crescendo
    pulse(T(29, 0), 0.85); pulse(T(29, 2), 0.85)
    ost_bar(29, "D", 0.72, CA, cresc=lambda k: 0.7 + 0.06 * k)
    riser(D2 - 0.01, BEAT(29) * 4, 0.11); cym_swell(D2 - 0.01, BEAT(29) * 3.0, 0.22)
    rev_swell(D2 - 0.005, [26, 38, 45, 50, 53], BEAT(29) * 2.2, 0.16)
    # --- DROP 2 (87.68, smash cut on «بحساب التداول»): the theme on cellos (+ piano above), figure A, rolling C into U
    impact(D2, 0.95, gong="mf"); piano(D2, 26, 0.75, cut=900, dyn="m", ring=5.0); piano(D2, 38, 0.6, cut=900, dyn="m", ring=5.0)
    MARK["drops"]["DROP2"] = round(D2, 3)
    for b in range(30, 36):
        fig = "A" if b < 34 else "C"
        drive_bar(b, fig, (1.04 if b == 30 else 0.95 + 0.03 * (b - 30)) if fig == "A" else 1.06 + 0.05 * (b - 34), pulse2=(fig == "C" or b == 30))
        if b in (30, 34): timp(T(b, 0), "D", 0.5)
    theme = [(30, 0, 50, 1), (30, 1, 53, 1), (30, 2, 52, 5), (31, 3, 50, 1), (32, 0, 50, 1), (32, 1, 53, 1), (32, 2, 55, 3),
             (33, 1, 53, 1), (33, 2, 52, 2), (34, 0, 50, 4)]
    cello_phrase([(T(b, bt), m, BEAT(b) * nb, 0.58, 0.4) for (b, bt, m, nb) in theme])
    for (b, bt, m, nb) in theme: piano(T(b, bt), m + 12, 0.28, cut=1600, dyn="p", ring=4.0)
    # --- U (105.16, the red limit ring, 10%): the re-lift on Eb (bII): a darker hit, cello tremolo, the drive goes on
    impact(U, 1.0, gong="p", timp_pitch="Eb", bd="v5")
    MARK["drops"]["RELIFT"] = round(U, 3)
    x = sustain("vc_trem", 51, BEAT(36) * 4, att=0.6, rel=0.8, vel=0.5) + sustain("vc_trem", 58, BEAT(36) * 4, att=0.6, rel=0.8, vel=0.4)
    add("pads", pan(lp(x, 4000), -0.2), U - 0.05, 1.0, {"hall": 0.45}, tag="cello tremolo")
    drive_bar(36, "A", 1.05); drive_bar(37, "C", 1.08, pulse2=True)
    drive_bar(38, "D", 0.95, pulse2=True, cresc=lambda k: 0.84 + 0.045 * k)
    metal(U + 0.25, "gscrape3", 0.5, st=-5)                 # v2: after the hit, so the hit itself stays clean
    # the rise to the end (push back HOME 108.58, end wipe 113.36): Bb - C, violins F4 -> G4, the theme closes G3 F3 E3
    violin_line(T(37, 0), 65, BEAT(37) * 4, 0.2); violin_line(T(38, 0), 67, BEAT(38) * 4, 0.24)
    cello_phrase([(T(37, 0), 53, BEAT(37) * 4, 0.55, 0.3)] + [(T(38, bt), m, BEAT(38) * nb, 0.6, 0.4) for (bt, m, nb) in [(0, 55, 2), (2, 53, 1), (3, 52, 1)]])
    for (bt, m, nb) in [(0, 55, 2), (2, 53, 1), (3, 52, 1)]: piano(T(38, bt), m + 12, 0.3, cut=1600, dyn="p", ring=4.0)
    timp(T(37, 0), "Bb", 0.5); timp(T(38, 0), "C", 0.55)
    riser(END - 0.01, BEAT(38) * 4, 0.12); cym_swell(END - 0.01, BEAT(38) * 3.2, 0.24)
    timp_roll(END - 0.02, BEAT(38) * 3, 0.38, pitch="A")
    rev_swell(END - 0.005, [26, 38, 45, 50, 57], BEAT(38) * 2.2, 0.18)
    # --- END hit (113.88): the same hit and chord as video 2
    end_hit(END)
    MARK["drops"]["END_HIT"] = round(END, 3)
    MARK["sections"] = [
        dict(name="title: theme statement (D4 F4 E4 on felt piano, low strings Dm with violins, soft low hit)", t0=0.0, t1=round(T(1), 3), bars=[0, 0]),
        dict(name="A: intro under the welcome (Dm Bb), the violins stay on softly, his first words 3.00-4.75 kept clear of new attacks", t0=round(T(1), 3), t1=round(T(4), 3), bars=[1, 3]),
        dict(name="A': B-roll 1, soft watch ticks + cello motif D3 F3 E3; pre-drop Gm-A, riser, reverse swell", t0=round(T(4), 3), t1=round(D1, 3), bars=[4, 5]),
        dict(name="B: DROP 1 drive, spiccato figure A, pulse + muted kick; violins open on «مبروك!» (34.92)", t0=round(D1, 3), t1=round(T(14), 3), bars=[6, 13]),
        dict(name="B': thin figure B under the «5000$» explanation (no attack inside 41.55-43.25)", t0=round(T(14), 3), t1=round(T(18), 3), bars=[14, 17]),
        dict(name="B'': figure A into the calm", t0=round(T(18), 3), t1=round(T(22), 3), bars=[18, 21]),
        dict(name="calm: no ostinato, a soft pulse, B-roll 2 carries the motif on piano; pre-drop 2 (straight eighths crescendo)", t0=round(T(22), 3), t1=round(D2, 3), bars=[22, 29]),
        dict(name="C: DROP 2 drive, the theme on cellos + piano; rolling figure C into the re-lift", t0=round(D2, 3), t1=round(U, 3), bars=[30, 35]),
        dict(name="C': re-lift on Eb (bII) at the 10% limit ring: dark hit, cello tremolo; Bb - C rise, straight eighths into the end", t0=round(U, 3), t1=round(END, 3), bars=[36, 38]),
        dict(name="END: deep hit + Dm(add9) chord, natural decay", t0=round(END, 3), t1=DUR, bars=[39, 39]),
    ]
    MARK["chords"] = [[b, bt, c] for (b, bt, c) in ch]
    MARK["quiet_windows_no_new_attacks"] = QUIET
    return dict(breaks=[], dips=[(D1 - BEAT(5) * 0.9, D1, -7.0), (D2 - BEAT(29) * 0.75, D2, -6.0), (U - BEAT(35) * 0.6, U, -5.0),
                                 (END - BEAT(38) * 0.6, END, -4.0)],
                holds=[(41.5, 43.3, -3.5, 0.4)],   # «خمسة آلاف دولار»: his voice is softest here (music only 6-10 dB under it)
                fade=(END + 3.8, DUR - 0.15))

SCORES = {"ep2": score_ep2, "ep1": score_ep1}

# ------------------------------------------------------------------ render
gates = SCORES[EP]()
import lib as _lib
_lib._PC.clear()
print("events placed %.1fs" % (time.time() - T_START), flush=True)
spk0, spk1 = CFG["speech"]
# speech band shaping: 1-4 kHz of every stem goes down while he speaks (full band in the title and the end card)
# v2: a 1.6 s ramp that starts before his first word and a shallower carve (v1: -9 dB in 0.5 s = an audible drop at 3 s)
band_g = np.interp(TT, [0, spk0 - 1.4, spk0 + 0.2, spk1, spk1 + 0.6, DUR], [0, 0, 1, 1, 0, 0])
DEPTH = dict(pads=6.0, bass=4.0, perc=4.0, motif=6.0, fx=4.0)
LOWMID = dict(pads=2.5, bass=2.0, perc=0.0, motif=1.5, fx=0.0)      # dB, 120-300 Hz, while he speaks
LMSOS = sos("bandpass", (120, 300), 2)
OL = CFG["open_lift"]
OPEN_LIFT = np.interp(TT, [0, OL[1], OL[2], DUR], [OL[0], OL[0], 0.0, 0.0])  # v2: 0 dB (v1's +2 / +1 dB title lift fell away at 0.8-2.2 s)
BANDSOS = sos("bandpass", (1000, 4000), 3)
SIDEHP = sos("highpass", 120, 3)
HPF = dict(pads=38, bass=30, perc=40, motif=45, fx=28)

def gate_curves():
    """v2: (pre, post). pre = the break stop and the dips into the drops, applied to the dry signal AND the reverb sends
    before the convolution, so the hall rings out naturally (v1 gated the reverb itself: a chopped tail at 74.50);
    post = the end fade (a plain raised cosine, later and longer than v1's cos^1.5)"""
    g = np.ones(N)
    for (a, b) in gates["breaks"]:
        m = (TT >= a) & (TT < b)
        g[m] = np.exp(-(TT[m] - a) / 0.16)
        m2 = (TT >= b) & (TT < b + 0.01)
        g[m2] = (TT[m2] - b) / 0.01
    for (a, b, d) in gates["dips"]:
        g *= db(np.interp(TT, [a - 0.3, a, b - 0.06, b], [0, d, d, 0]))
    for (a, b, d, r) in gates.get("holds", []):          # v2: gentle step-backs under a fragile line of the voice
        g *= db(np.interp(TT, [a - r, a, b, b + r], [0, d, d, 0]))
    f0, f1 = gates["fade"]
    u = np.clip((TT - f0) / (f1 - f0), 0, 1)
    return g.astype(np.float32), (0.5 + 0.5 * np.cos(np.pi * u)).astype(np.float32)

GPRE, GPOST = gate_curves()
OUT = {}
for s in STEMS:
    gp = (GPRE if s != "fx" else np.ones(N, np.float32))[:, None]
    x = DRY[s] * gp
    for k in list(SEND[s]):
        w = convolve(SEND[s][k] * gp, IRS[k].astype(np.float32))
        x += filt(w, sos("highpass", RET_HP[k], 2)).astype(np.float32)
        del SEND[s][k], w
    DRY[s] = None
    x = x * GPOST[:, None]
    x += POST[s] * GPOST[:, None]
    x = filt(x, sos("highpass", HPF[s], 2))
    # mono below 120 Hz
    m = (x[:, 0] + x[:, 1]) / 2; sd = (x[:, 0] - x[:, 1]) / 2
    sd = signal.sosfiltfilt(SIDEHP, sd)
    x = np.stack([m + sd, m - sd], 1)
    if s in ("pads", "motif", "fx"): x = shelf_hi(x, 7000, -4.0)
    mid = signal.sosfiltfilt(BANDSOS, x, axis=0)
    x = x + mid * (db(-DEPTH[s] * band_g) - 1)[:, None]
    if LOWMID[s] > 0:
        lm = signal.sosfiltfilt(LMSOS, x, axis=0)
        x = x + lm * (db(-LOWMID[s] * band_g) - 1)[:, None]
    if s == "pads" and OL[0]: x = x * db(OPEN_LIFT)[:, None]
    OUT[s] = x
    print("stem %-5s rendered %.1fs" % (s, time.time() - T_START), flush=True)

# balance (relative stem gains, dB) then one master gain to -18 LUFS integrated
BAL = dict(pads=0.0, bass=0.0, perc=0.0, motif=0.0, fx=0.0)
mix = sum(OUT[s] * db(BAL[s]) for s in STEMS)
I0 = integrated(mix)
gm = db(-18.0 - I0)
for s in STEMS: OUT[s] = OUT[s] * db(BAL[s]) * gm
mix = sum(OUT[s] for s in STEMS)
for it in range(4):
    GL = limiter_gain(mix, ceil_db=-3.4 - 0.4 * it)
    mixl = mix * GL[:, None]
    tp = true_peak_db(mixl)
    if tp <= -3.05: break
gr = 20 * np.log10(GL.min())
print("limiter: max gain reduction %.2f dB, %.2f%% of samples reduced > 0.5 dB" % (gr, 100 * (GL < db(-0.5)).mean()), flush=True)
for s in STEMS: OUT[s] = OUT[s] * GL[:, None]
mix = sum(OUT[s] for s in STEMS)
pk = 20 * np.log10(np.abs(mix).max() + 1e-12); tp = true_peak_db(mix)
print("mix: I %.2f LUFS  sample peak %.2f dBFS  true peak %.2f dBTP" % (integrated(mix), pk, tp), flush=True)
for s in STEMS: write_wav24(os.path.join(OUTD, s + ".wav"), OUT[s])
write_wav24(os.path.join(OUTD, "mix.wav"), mix)
MARK.update(dict(
    episode=EP, duration_s=DUR, sample_rate=SR, key="D minor (Aeolian; Asus4/A as V)", meter="4/4",
    tempo_map=[dict(from_bar=b, t=round(t0, 4), bar_s=round(bl, 5), bpm=round(240.0 / bl, 3)) for (b, t0, bl) in CFG["segs"]],
    bars=[dict(bar=b, t=round(T(b), 3)) for b in range(0, CFG["end_bar"] + 1)],
    speech_window=list(CFG["speech"]), speech_band_cut_db=DEPTH, speech_lowmid_120_300_cut_db=LOWMID,
    loudness=dict(integrated_lufs=round(integrated(mix), 2), sample_peak_dbfs=round(pk, 2), true_peak_dbtp=round(tp, 2), limiter_max_gr_db=round(gr, 2)),
    stems=dict(pads="cello/viola/violin section sustains, the D2+D3 drone; metallic textures are in fx",
               bass="contrabass sustains, heartbeat pulse (D1 with a D2/A2 body), cello spiccato ostinato + contrabass doubles",
               perc="watch ticks (B-roll 1 and the break only), muted kick, timpani", motif="felt piano and solo-line cello (the theme)",
               fx="impacts (bass drum + timpani + sub drop + gong), risers, reverse swells, bowed metal, the end-card hit"),
    mixing_notes=("Composed as underscore: the title is only ~2 LU above the music under speech, so play the music at one "
                  "constant gain under the voice (no big duck at his first word); the 1-4 kHz band is already carved "
                  "%.1f-%.1f s. Drops/hits are exact on the picture cuts listed in drops." % CFG["speech"]),
    events=LOG,
))
json.dump(MARK, open(os.path.join(OUTD, "markers.json"), "w"), indent=1, ensure_ascii=False)
json.dump(sorted(ONSETS), open(os.path.join(ROOT, "work", "onsets_%s.json" % EP), "w"))
print("done %.1fs" % (time.time() - T_START))
