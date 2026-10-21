# audio_build.py — axi-select-ch2 soundtrack (run from W with python3 -I)
# 1. music: HeyGen library track f16f4a77 (110 BPM, sections A 0-32 | B 32-128 | A' 128-192 with a break bar 188-192 |
#    B' 192-256 | ending 256) re-cut on its beat grid into four bar-aligned segments, 70 ms linear crossfades:
#      A' from 132 for L1 beats (light intro under the title, welcome, withdrawal rule and conditions) -> A from beat
#      L1 - 28 (A' 160+ is A 0+ again, so the join is seamless) through the A->B break beat 31 -> DROP 1: B from beat 32 on the funding B-roll «ستقوم Axi بتمويلك» (out D1) -> B to beat X, jump to X+80 -> the
#      188-192 break bar under «في الفيديو القادم» (half-beat linear crossfade at that join) -> DROP 2: B' from beat 192 just before «مبروك!» (out D2 = D1 + 80
#      beats) -> B' for L3 beats, jump -> the track's own ending (beat 256) on the end card (out D2 + 16 beats).
#    X and L3 are picked by chroma match at the splices (all under the ducked voice). The tail is faded by out 90.8.
# 2. voice: Rabee's clean VO (VO_SRC: audio/vo/vo2_patched.wav for the final mix) with a gentle 2:1 level compressor and
#    a voice peak limiter, at out P. His first words get video 1's protection (no SFX, music a further 6 dB down).
# 3. SFX: recorded CC0 sounds from the bundled library (sfx.py bed); cues from work/sfx/*.json plus the two drops.
#    Placement uses the voice's own pause map (10 ms RMS < -42 dBFS for >= 80 ms): a transient (hit, flash, boom, crack,
#    glitch, ui_error, ui_blip, type) moves into the nearest pause within 0.25 s, else plays 12 dB lower.
# 4. mix: gate-style music duck (10 dB whenever the voice is above -45 dBFS, 150 ms look-ahead, 280 ms hold), SFX
#    side-chain duck; one static gain to -14 LUFS, then a latency-compensated limiter (true peak checked <= -1.0 dBTP)
#    -> audio/mix.wav + audio/mix.m4a
import json, subprocess, sys, os, glob
import numpy as np

SR = 48000
DUR = 91.0
P = 0.63
D1 = 33.00          # out: drop 1, in the pause before «ستقوم» (VO 31.95-32.40 = out 32.58-33.03); the B-roll cut sits here
RR = os.environ.get("HF_WORKFLOWS", "/home/user/.higgsfield/workflows") + "/katana/scripts"
N = int(DUR * SR)
t = np.arange(N) / SR

def load(p, ch=2):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", str(ch), "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.float32).reshape(-1, ch).copy()

def save(p, a, codec="pcm_s24le"):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", str(a.shape[1]), "-i", "-", "-c:a", codec, p],
                   input=np.ascontiguousarray(a, np.float32).tobytes(), check=True)

def place(dst, src, at):
    i = int(round(at * SR))
    a, b_ = max(0, i), min(len(dst), i + len(src))
    if b_ > a: dst[a:b_] += src[a - i:b_ - i]

def ramp_env(windows, depth_db, r=0.03):
    """gain curve (linear) that is depth_db inside each (t0, t1) window, with r s ramps"""
    g = np.zeros(N)
    for t0, t1 in windows:
        g = np.maximum(g, np.clip(np.minimum((t - (t0 - r)) / r, ((t1 + r) - t) / r), 0, 1))
    return 10 ** (depth_db * g / 20)

# ---------------------------------------------------------------- 1. music edit
M = load("inputs/music/f16f4a77.wav")
per = 60 / 110.0
b = lambda n: 0.0041 + n * per

def chroma(x):
    x = x * np.hanning(len(x)); X = np.abs(np.fft.rfft(x)) ** 2; f = np.fft.rfftfreq(len(x), 1 / SR)
    s = (f > 60) & (f < 4000); pc = (np.round(12 * np.log2(f[s] / 440.0)) % 12).astype(int)
    c = np.bincount(pc, weights=X[s], minlength=12); return c / (np.linalg.norm(c) + 1e-12)
mono = M.mean(1)
seg = lambda t0, d: mono[int(t0 * SR):int((t0 + d) * SR)]
sim = lambda a, c: float(chroma(seg(b(a), per * 2)) @ chroma(seg(b(c), per * 2)))  # the next two beats, either side

simb = lambda a, c: float(chroma(seg(b(a - 2), per * 2)) @ chroma(seg(b(c - 2), per * 2)))  # and the two beats before
# splice 1: A' from 132 for L1 beats, then A from beat L1 - 28 to the drop (A' 160+ repeats A 0+, so these all match)
s1 = {L1: min(sim(132 + L1, L1 - 28), simb(132 + L1, L1 - 28)) for L1 in (32, 36, 40, 44, 48, 52)}
L1 = max(s1, key=s1.get)
sX = {X: sim(X, X + 80) for X in (96, 100, 104, 108)}
X = max(sX, key=sX.get)
sL = {L3: sim(192 + L3, 256 - (16 - L3)) for L3 in (8, 12)}
L3 = max(sL, key=sL.get)
print("splice 1 candidates", {k: round(v, 3) for k, v in s1.items()}, "-> L1 =", L1)
print("splice 2 candidates", {k: round(v, 3) for k, v in sX.items()}, "-> X =", X)
print("splice 3 candidates", {k: round(v, 3) for k, v in sL.items()}, "-> L3 =", L3)
SEGS = [(132, 132 + L1), (L1 - 28, X), (X + 80, 192 + L3), (256 - (16 - L3), None)]   # beats [from, to); None = to the end
# crossfade half-widths per join (s), centred on the beat: 35 ms linear where both sides are near-identical (A'->A, the
# ending), a half-beat equal-power fade at the B -> A' join (out 72.27), where the arrangement thins mid-phrase (QA)
XFS = [None, (0.035, "lin"), (0.135, "lin"), (0.035, "lin")]   # linear: both sides share the kick (correlation .94)
def fade(n, kind, up):
    u = np.linspace(0, 1, n)
    g = u if kind == "lin" else np.sin(u * np.pi / 2)
    return (g if up else g[::-1])[:, None]
t0 = D1 - 60 * per
mus = np.zeros((N, 2), np.float32)
at = t0
for i, (s0, s1) in enumerate(SEGS):
    xi = XFS[i][0] if i else 0.0
    xo = XFS[i + 1][0] if s1 is not None else 0.0
    a_ = b(s0) - xi
    e_ = b(s1) + xo if s1 is not None else len(M) / SR
    x = M[int(a_ * SR):int(e_ * SR)].copy()
    if i: k_ = int(2 * xi * SR); x[:k_] *= fade(k_, XFS[i][1], True)
    if s1 is not None: k_ = int(2 * xo * SR); x[-k_:] *= fade(k_, XFS[i + 1][1], False)
    place(mus, x, at - xi)
    print("segment beats %s-%s at out %.3f" % (s0, s1, at))
    at += ((s1 if s1 is not None else 256) - s0) * per
D2 = D1 + 80 * per
END_HIT = D2 + 16 * per
print("drop 1 %.3f  drop 2 %.3f  ending (beat 256) %.3f" % (D1, D2, END_HIT))
mus *= np.clip((t - t0) / 0.25, 0, 1)[:, None]                                      # 0.25 s fade-in from the cut-in
# the ending's tail: the track has its own hard stop 4.38 s after the ending hit; fade it out before (END_HIT + 3.10 .. + 4.30)
mus *= (0.5 + 0.5 * np.cos(np.pi * np.clip((t - (END_HIT + 3.10)) / 1.2, 0, 1)))[:, None]
save("audio/music_edit.wav", mus, "pcm_f32le")
json.dump({"t0": round(t0, 3), "D1": D1, "D2": round(D2, 3), "END_HIT": round(END_HIT, 3), "segs": SEGS}, open("audio/music_plan.json", "w"))

# ---------------------------------------------------------------- 2. voice
# vo2_patched.wav = vo2_clean.wav with VO 35-42 s (the "$1,000" example, where the separation dulled his /s/ /f/ and
# «دولار» under noise bursts in the recording) restored from a second separation, verified band by band (work/vofix2/)
VO_SRC = os.environ.get("VO_SRC", "audio/vo/vo2_patched.wav")
vo_src = VO_SRC
print("voice", vo_src)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", vo_src, "-af",
                "acompressor=threshold=-22dB:ratio=2:attack=12:release=160:makeup=1,"
                "alimiter=limit=0.29:attack=1:release=50:level=disabled:latency=1,aresample=48000",  # voice peaks 3 dB down before the master
                "-ac", "1", "-c:a", "pcm_s24le", "audio/vo_comp.wav"], check=True)
V1 = load("audio/vo_comp.wav", 1)[:, 0]
# «دولار» in «20,000 دولار» (VO 50.45-50.66) is spoken ~15 dB under the words around it: +5 dB on that word only
# (level, not tone), 10 ms ramps
tv_ = np.arange(len(V1)) / SR
V1 *= (10 ** (5 * np.clip(np.minimum((tv_ - 50.43) / 0.01, (50.68 - tv_) / 0.01), 0, 1) / 20)).astype(np.float32)
vo = np.zeros((N, 2), np.float32)
place(vo, np.stack([V1, V1], 1), P)
save("audio/vo_out.wav", vo)

# pause map of the voice as placed (out seconds): 10 ms RMS below -42 dBFS for at least 80 ms
HOP = int(0.01 * SR)
nf = N // HOP
e10 = 20 * np.log10(np.sqrt((vo[: nf * HOP, 0].reshape(nf, HOP) ** 2).mean(1)) + 1e-9)
PAUSES, i = [], 0
while i < nf:
    if e10[i] < -42:
        j = i
        while j < nf and e10[j] < -42: j += 1
        if j - i >= 8: PAUSES.append((i * 0.01, j * 0.01))
        i = j
    else: i += 1
json.dump([[round(a, 2), round(c, 2)] for a, c in PAUSES], open("audio/pauses.json", "w"))
in_pause = lambda x: any(a <= x <= c - 0.03 for a, c in PAUSES)
def pause_at(x, lo=0.0, hi=0.4):
    """first pause starting within [x - lo, x + hi] (out s), else None"""
    c = [a for a, c_ in PAUSES if x - lo <= a <= x + hi]
    return min(c) if c else None

# ---------------------------------------------------------------- 3. SFX cues
C = []
def c(tv, cat, g=0.0, out=False, **kw): C.append({"t": round(tv if out else tv + P, 3), "cat": cat, "gain_db": g, **kw})
c(D1, "boom", -6, out=True, pin=True)                                    # drop 1 (hard cut into the funding B-roll)
d2 = pause_at(D2, 0.05, 0.2)
c(D2 - 0.02, "boom", -12, out=True, pin=True)  # drop 2 («مبروك!»): on the music's own downbeat (no 70 ms flam), soft enough
                                               # to sit under the tail of «القادم»; d2 = its pause
for fp in sorted(glob.glob("work/sfx/*.json")):
    for q in json.load(open(fp)):
        if q.get("cat") not in {"boom", "buzz", "corrupt", "crack", "dataswish", "flash", "glitch", "hit", "longwhoosh", "powerdown",
                                "poweron", "riser", "scan", "static", "type", "ui_blip", "ui_error", "whoosh"}:
            continue
        c(float(q["t"]), q["cat"], float(q.get("gain_db", -6)), bool(q.get("out")))
# QA overrides (output s of the group cue, category, action): None drops it; a dict moves it ("t"), names its file
# ("file") or sets its gain ("gain")
OVR = [(3.68, "whoosh", None),                     # A's pull whoosh sat under «بك في»: his first words stay clean
       (22.93, "whoosh", None), (24.43, "scan", None), (40.18, "whoosh", None), (73.47, "whoosh", None),  # inaudible under voice + music
       (68.03, "ui_blip", {"t": 68.13}),           # M: off the /ط/ release of «الشروط», still in the pause and before the cut
       (77.38, "flash", {"file": "flash/kint__glass_004.ogg", "gain": -12}),  # P chime: a short glass ping, done before «أصبح»
       (79.62, "riser", {"file": "riser/rs50__power_up_03.ogg", "t": 79.55}),  # Q sweep: crests in the gap before «40»
       (35.03, "riser", {"file": "riser/rs50__synth_misc_04.ogg", "gain": -20}),  # G: crests at «عشرة», well under «لغاية»
       (29.09, "whoosh", None), (62.55, "whoosh", None),  # too weak to hear in any file
       (86.21, "ui_blip", {"gain": -8})]           # end-card pill click was barely above the music
used = set()
for q in C:
    for k_, (to, cat, act) in enumerate(OVR):
        if k_ not in used and q["cat"] == cat and abs(q["t"] - to) <= 0.15:
            used.add(k_)
            if act is None: q["drop"] = True
            else:
                if "t" in act: q["t"] = act["t"]
                if "file" in act: q["file"] = act["file"]
                if "gain" in act: q["gain_db"] = act["gain"]
print("overrides matched", len(used), "of", len(OVR), "; unmatched:", [OVR[k_][:2] for k_ in range(len(OVR)) if k_ not in used])
# a pinned cue wins over group cues of the same category within 0.2 s
pins = [q for q in C if q.get("pin")]
for q in C:
    if not q.get("pin") and any(p_["cat"] == q["cat"] and abs(p_["t"] - q["t"]) <= 0.2 for p_ in pins): q["drop"] = True; print("dropped duplicate of pinned", q["cat"], q["t"])
TRANS = {"hit", "flash", "boom", "crack", "glitch", "ui_error", "ui_blip", "type"}
out, moved, quiet = [], 0, 0
for q in sorted(C, key=lambda q: q["t"]):
    if q.get("drop") or q["t"] >= DUR - 0.3:
        continue
    if q["cat"] in TRANS and not q.get("pin") and not in_pause(q["t"]):
        cands = []
        for a, b_ in PAUSES:
            lo, hi = a + 0.01, b_ - 0.04
            if hi < lo: continue
            x = min(max(q["t"], lo), hi)
            if abs(x - q["t"]) <= 0.25: cands.append(x)
        if cands: q["t"] = round(min(cands, key=lambda x: abs(x - q["t"])), 3); moved += 1
        else: q["gain_db"] -= 12; quiet += 1
    if out and out[-1]["cat"] == q["cat"] and abs(out[-1]["t"] - q["t"]) < 0.08:
        continue  # duplicate from two groups
    out.append({k_: q[k_] for k_ in ("t", "cat", "gain_db", "file") if k_ in q})
C = out
# every cue keeps the sound file it was approved with (work/sfx_lock.json: {t, cat, file}), so dropping or adding a cue
# never re-draws the seeded picks of the others
try:
    LOCK = json.load(open("work/sfx_lock.json"))
except OSError:
    LOCK = []
for q in C:
    m = [l_ for l_ in LOCK if l_["cat"] == q["cat"] and abs(l_["t"] - q["t"]) <= 0.05]
    if m and "file" not in q: q["file"] = m[0]["file"]
print("locked files", sum(1 for q in C if "file" in q), "of", len(C))
# ui_blip: name the files (in rotation) so the library's 10-23 ms stubs (kint__click_002-005, kint__tick_001/002) are
# never picked; sfx.py skips anything shorter than 20 ms
GOOD_BLIP = ["kui__click1", "kint__select_001", "kint__pluck_001", "kui__click3", "kint__toggle_004", "kint__back_003",
             "kint__click_001", "kui__click2"]
for k_, q in enumerate([q for q in C if q["cat"] == "ui_blip"]):
    q.setdefault("file", "ui_blip/%s.ogg" % GOOD_BLIP[k_ % len(GOOD_BLIP)])
print("cues", len(C), "transients moved into pauses", moved, "lowered 12 dB", quiet)
json.dump(C, open("audio/sfx_cues_plan.json", "w"), indent=0)
r = subprocess.run(["python3", RR + "/sfx.py", "bed", ".", "--cues", "audio/sfx_cues_plan.json", "--music", "audio/music_edit.wav",
                    "--dur", str(DUR), "--seed", "7", "--out", "audio/sfx_bed.wav"], capture_output=True, text=True)
print(r.stdout[-400:], r.stderr[-400:])
S = load("audio/sfx_bed.wav")
S = np.pad(S, ((0, max(0, N - len(S))), (0, 0)))[:N]
S *= ramp_env([(P + 2.23, P + 5.45)], -60, 0.05)[:, None]        # nothing under his first words (as video 1)

# ---------------------------------------------------------------- 4. mix
def env_db(x, win):
    k_ = int(win * SR); e = np.sqrt(np.convolve((x ** 2).mean(1) if x.ndim == 2 else x ** 2, np.ones(k_) / k_, mode="same") + 1e-12)
    return 20 * np.log10(e)
# music: gate-style duck on a 10 ms grid: 10 dB while the voice is above -45 dBFS, 150 ms look-ahead, 280 ms hold,
# attack 40 ms / release 250 ms; 3 dB only inside drop 2's pause (before «مبروك!») so that hit lands (drop 1's pause
# runs straight into «ستقوم», so it stays ducked there: the boom carries the cut)
act = e10 > -45
g = np.zeros(nf, bool)
for i in np.flatnonzero(act): g[max(0, i - 15): i + 29] = True
tgt = np.where(g, 10.0, 0.0)
tt = np.arange(nf) * 0.01
for a, c_ in PAUSES:
    if d2 is not None and a == d2: tgt[(tt >= a) & (tt < c_ - 0.10)] = 3.0
dd = np.zeros(nf); d = 0.0
for i in range(nf):
    w = tgt[i]; d += (w - d) * (1 - np.exp(-0.01 / (0.04 if w > d else 0.25))); dd[i] = d
duck = np.interp(t, tt, dd)
SPEECH0 = P + 2.43                      # his first word (VO 2.43)
LAST = P + 84.01                        # his last word ends (VO 84.01)
# dB: title open, under the voice (fully down before the first word; this voice is 2.4 dB quieter than video 1's, so
# the bed sits 2 dB lower than video 1's), drop 2's lift inside its pause, end card up
base = np.interp(t, [0, SPEECH0 - 0.75, SPEECH0 - 0.2, D2 - 0.05, D2 + 0.05, D2 + 0.25, LAST - 0.1, LAST + 0.5, DUR],
                 [-6, -6, -14, -14, -11, -14, -14, -5, -5])
mus_g = mus * (10 ** ((base - duck) / 20))[:, None]
mus_g *= ramp_env([(P + 2.23, P + 5.50)], -6, 0.25)[:, None]      # a further 6 dB under his first words (as video 1)
mus_g *= ramp_env([(P + 50.36, P + 50.66)], -10, 0.08)[:, None]   # the quiet «دولار» of 20,000 stays clear (the pause before keeps its bed)
mus_g *= ramp_env([(P + 49.92, P + 50.06)], -6, 0.04)[:, None]    # and «ألف» before it
# SFX side-chain duck under the voice: up to 6 dB, attack ~10 ms, release ~150 ms
vo_db = env_db(vo, 0.05)
sw = np.clip((vo_db + 40) * 0.3, 0, 6)
step = 48; idx = np.arange(0, N, step); sd = np.zeros(len(idx)); d = 0.0
a_a2 = 1 - np.exp(-1 / (0.01 * SR)); a_r2 = 1 - np.exp(-1 / (0.15 * SR))
for j, i in enumerate(idx):
    w = sw[i]; d += (w - d) * (1 - (1 - (a_a2 if w > d else a_r2)) ** step); sd[j] = d
sduck = np.interp(np.arange(N), idx, sd)
mix = vo + mus_g + S * (10 ** ((-6 - sduck) / 20))[:, None]
save("audio/mix_pre.wav", mix, "pcm_f32le")

# master: one static gain to -14 LUFS, then a latency-compensated limiter; true peak must stay <= -1.0 dBTP
def measure(p):
    r_ = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", p, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
    s_ = r_.stderr[r_.stderr.rfind("Summary:"):]
    I_ = float(s_.split("I:")[1].split("LUFS")[0]); tp = float(s_.split("Peak:")[1].split("dBFS")[0])
    return I_, tp, s_
I0, tp0, _ = measure("audio/mix_pre.wav")
gain, lim = -14.0 - I0, -1.6
for it in range(3):
    af = f"volume={gain:.3f}dB,alimiter=limit={10 ** (lim / 20):.4f}:attack=1:release=80:level=disabled:latency=1"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio/mix_pre.wav", "-af", af, "-ar", "48000", "-c:a", "pcm_s24le", "audio/mix.wav"], check=True)
    I1, tp1, _ = measure("audio/mix.wav")
    print("master pass", it, "gain %.2f limit %.2f -> I %.2f TP %.2f" % (gain, lim, I1, tp1))
    if abs(I1 + 14.0) <= 0.15 and tp1 <= -1.0: break
    gain += -14.0 - I1
    if tp1 > -1.0: lim -= tp1 + 1.0 + 0.1
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio/mix.wav", "-c:a", "aac", "-b:a", "256k", "-t", str(DUR), "audio/mix.m4a"], check=True)
I2, tp2, summ = measure("audio/mix.m4a")
print(summ)
print("cues", len(C))
