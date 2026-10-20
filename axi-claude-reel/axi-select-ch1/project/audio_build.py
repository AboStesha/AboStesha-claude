# audio_build.py — axi-select-ch1 soundtrack v3 (run from W with python3 -I)
# 1. music: HeyGen library track f16f4a77 (110 BPM) re-cut on its beat grid: track 0 -> out 0.4214 so the drop (beat 32,
#    17.4586 s) lands on «وبمجرد» (VO 14.88 = out 17.88) and section B (beat 160) on «بحساب التداول» (VO 84.70). One
#    bar-aligned 48-beat jump (beat A -> A + 48, A picked by chroma match among 196 / 200 / 204, under the ducked voice)
#    makes the track's own ending (beat 256) land on the end card at out 113.88; 70 ms equal-power crossfade. The
#    track's abrupt stop (out 118.24) is faded over 117.0-118.2.
# 2. voice: Rabee's clean VO (the newest of vo1_clean_v6 / v5 / v4) with a gentle 2:1 level compressor, at out 3.0 s.
# 3. SFX: recorded CC0 sounds from the bundled library (sfx.py bed); cues from work/sfx/*.json plus the camera moves.
#    Placement uses the voice's own pause map (10 ms RMS < -42 dBFS for >= 80 ms): a transient (hit, flash, boom, crack,
#    glitch, ui_error, ui_blip, type) moves into the nearest pause within 0.25 s, else plays 12 dB lower. Nothing in
#    the client's two windows (out 3.00-4.75 «مرحبا بك في برنامج التمويل», 41.55-43.25 «خمسة آلاف دولار»): cues there
#    are dropped and the bed is muted. Per-cue overrides below tame the loud events found in QA.
# 4. mix: gate-style music duck (10 dB whenever the voice is above -45 dBFS, 150 ms look-ahead, 280 ms hold), SFX
#    side-chain duck; one static gain to -14 LUFS, then a latency-compensated limiter (true peak checked <= -1.0 dBTP)
#    -> audio/mix.wav + audio/mix.m4a
import json, subprocess, sys, os, glob
import numpy as np

SR = 48000
DUR = 120.0
P = 3.0
RR = os.environ.get("HF_WORKFLOWS", "/home/user/.higgsfield/workflows") + "/katana/scripts"
N = int(DUR * SR)
t = np.arange(N) / SR

def load(p, ch=2):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", str(ch), "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.float32).reshape(-1, ch).copy()

def save(p, a):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", str(a.shape[1]), "-i", "-", "-c:a", "pcm_s24le", p],
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
OFF = 17.88 - b(32)

def chroma(x):
    x = x * np.hanning(len(x)); X = np.abs(np.fft.rfft(x)) ** 2; f = np.fft.rfftfreq(len(x), 1 / SR)
    s = (f > 60) & (f < 4000); pc = (np.round(12 * np.log2(f[s] / 440.0)) % 12).astype(int)
    c = np.bincount(pc, weights=X[s], minlength=12); return c / (np.linalg.norm(c) + 1e-12)
mono = M.mean(1)
seg = lambda t0, d: mono[int(t0 * SR):int((t0 + d) * SR)]
sims = {}
for A in (196, 200, 204):  # splice at out OFF + b(A) = 107.3 / 109.5 / 111.7 (all under the ducked voice)
    sims[A] = float(chroma(seg(b(A), per * 2)) @ chroma(seg(b(A + 48), per * 2)))  # the next two beats, either side
    print("splice candidate", A, "->", A + 48, "at out %.2f" % (OFF + b(A)), "chroma sim %.3f" % sims[A])
A = max(sims, key=sims.get)
if sims[204] >= sims[A] - 0.02: A = 204  # latest splice wins a near-tie (most of the cut stays untouched)
XF = 0.035                                   # half of the 70 ms equal-power crossfade
ta, tb = b(A), b(A + 48)
seg_a = M[: int((ta + XF) * SR)].copy()
seg_b = M[int((tb - XF) * SR):].copy()
k = int(2 * XF * SR); th = np.linspace(0, np.pi / 2, k)[:, None]
seg_a[-k:] *= np.cos(th); seg_b[:k] *= np.sin(th)
mus = np.zeros((N, 2), np.float32)
place(mus, seg_a, OFF)
place(mus, seg_b, OFF + ta - XF)
print("splice", A, "->", A + 48, "at out %.3f; ending (beat 256) at out %.3f" % (OFF + ta, OFF + ta + (b(256) - tb)))
mus *= (0.5 + 0.5 * np.cos(np.pi * np.clip((t - 117.0) / 1.2, 0, 1)))[:, None]   # over the track's own stop (118.24)
save("audio/music_edit.wav", mus)

# ---------------------------------------------------------------- 2. voice
vo_src = next(p_ for p_ in ("audio/vo/vo1_clean_v6.wav", "audio/vo/vo1_clean_v5.wav", "audio/vo/vo1_clean_v4.wav") if os.path.exists(p_))
print("voice", vo_src)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", vo_src, "-af",
                "acompressor=threshold=-22dB:ratio=2:attack=12:release=160:makeup=1,aresample=48000",
                "-ac", "1", "-c:a", "pcm_s24le", "audio/vo_comp.wav"], check=True)
V1 = load("audio/vo_comp.wav", 1)[:, 0]
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

# ---------------------------------------------------------------- 3. SFX cues
C = []
def c(tv, cat, g=0.0, out=False, **kw): C.append({"t": round(tv if out else tv + P, 3), "cat": cat, "gain_db": g, **kw})
# camera moves the groups do not cue themselves (A's pull sits on «التمويل» and I's pull on «دولار»: no cue there)
c(69.27, "whoosh", -8)                                    # O pull-out
c(14.88, "boom", -6, pin=True)                            # drop 1 (smash cut, in the pause 17.79-18.01)
c(84.70, "boom", -12, pin=True)                           # drop 2 (on the beat; «بحساب» runs through it: soft)
for fp in sorted(glob.glob("work/sfx/*.json")):
    for q in json.load(open(fp)):
        if q.get("cat") not in {"boom", "buzz", "corrupt", "crack", "dataswish", "flash", "glitch", "hit", "longwhoosh", "powerdown",
                                "poweron", "riser", "scan", "static", "type", "ui_blip", "ui_error", "whoosh"}:
            continue
        c(float(q["t"]), q["cat"], float(q.get("gain_db", -6)), bool(q.get("out")))
# QA overrides (out s, category, action): the loud events and transients inside words
OVR = [(11.81, "boom", -12), (17.70, "riser", -6), (29.14, "hit", -10), (62.40, "riser", -6), (63.00, "hit", -6),
       (67.63, "boom", -6), (84.02, "hit", -10), (107.01, "hit", None), (107.38, "hit", None), (107.57, "hit", -10)]
used = set()
for q in C:
    for k_, (to, cat, act) in enumerate(OVR):
        if k_ not in used and q["cat"] == cat and abs(q["t"] - to) <= 0.2:
            used.add(k_); q["drop"] = act is None
            if act is not None: q["gain_db"] += act
print("overrides matched", len(used), "of", len(OVR), "; unmatched:", [OVR[k_][:2] for k_ in range(len(OVR)) if k_ not in used])
PROTECT = [(3.00, 4.75), (41.55, 43.25)]
TRANS = {"hit", "flash", "boom", "crack", "glitch", "ui_error", "ui_blip", "type"}
out, moved, quiet = [], 0, 0
for q in sorted(C, key=lambda q: q["t"]):
    if q.get("drop") or any(a - 0.05 <= q["t"] <= b_ for a, b_ in PROTECT):
        continue
    if q["cat"] in TRANS and not q.get("pin") and not in_pause(q["t"]):
        cands = []
        for a, b_ in PAUSES:
            lo, hi = a + 0.01, b_ - 0.04
            if hi < lo: continue
            x = min(max(q["t"], lo), hi)
            if abs(x - q["t"]) <= 0.25 and not any(p0 - 0.05 <= x <= p1 for p0, p1 in PROTECT): cands.append(x)
        if cands: q["t"] = round(min(cands, key=lambda x: abs(x - q["t"])), 3); moved += 1
        else: q["gain_db"] -= 12; quiet += 1
    if out and out[-1]["cat"] == q["cat"] and abs(out[-1]["t"] - q["t"]) < 0.08:
        continue  # duplicate from two groups
    out.append({"t": q["t"], "cat": q["cat"], "gain_db": q["gain_db"]})
C = out
print("cues", len(C), "transients moved into pauses", moved, "lowered 12 dB", quiet)
json.dump(C, open("audio/sfx_cues_plan.json", "w"), indent=0)
r = subprocess.run(["python3", RR + "/sfx.py", "bed", ".", "--cues", "audio/sfx_cues_plan.json", "--music", "audio/music_edit.wav",
                    "--dur", str(DUR), "--seed", "7", "--out", "audio/sfx_bed.wav"], capture_output=True, text=True)
print(r.stdout[-400:], r.stderr[-400:])
S = load("audio/sfx_bed.wav")
S = np.pad(S, ((0, max(0, N - len(S))), (0, 0)))[:N]
S *= ramp_env(PROTECT, -120)[:, None]                                         # nothing on the client's words
S *= ramp_env([(12.10, 13.40)], -15, 0.2)[:, None]                            # B-roll 1 boom: shortened to ~0.4 s
S *= ramp_env([(18.00, 19.20)], -12, 0.12)[:, None]                           # drop-1 boom tail off «بمجرّد»

# ---------------------------------------------------------------- 4. mix
def env_db(x, win):
    k_ = int(win * SR); e = np.sqrt(np.convolve((x ** 2).mean(1) if x.ndim == 2 else x ** 2, np.ones(k_) / k_, mode="same") + 1e-12)
    return 20 * np.log10(e)
# music: gate-style duck on a 10 ms grid: 10 dB while the voice is above -45 dBFS, 150 ms look-ahead, 280 ms hold,
# attack 40 ms / release 250 ms; 3 dB only inside the drop-1 pause so the hit lands
act = e10 > -45
g = np.zeros(nf, bool)
for i in np.flatnonzero(act): g[max(0, i - 15): i + 29] = True
tgt = np.where(g, 10.0, 0.0)
tt = np.arange(nf) * 0.01
tgt[(tt >= 17.79) & (tt < 17.97)] = 3.0
dd = np.zeros(nf); d = 0.0
for i in range(nf):
    w = tgt[i]; d += (w - d) * (1 - np.exp(-0.01 / (0.04 if w > d else 0.25))); dd[i] = d
duck = np.interp(t, tt, dd)
base = np.interp(t, [0, 2.30, 2.85, 17.7, 17.9, 18.6, 113.4, 113.9, 120],
                 [-5, -5, -12, -12, -9, -12, -12, -3, -3])   # dB: title open, under the voice (fully down before the first word), drop-1 lift, end card up
mus_g = mus * (10 ** ((base - duck) / 20))[:, None]
mus_g *= ramp_env([(2.80, 4.80), (41.45, 43.30)], -6, 0.1)[:, None]          # a further 6 dB under the client's two spots
mus_g *= ramp_env([(2.85, 3.20)], -9, 0.05)[:, None]                          # and nearly out around the first word (the title's tail)
# SFX side-chain duck under the voice: up to 6 dB, attack ~10 ms, release ~150 ms
vo_db = env_db(vo, 0.05)
sw = np.clip((vo_db + 40) * 0.3, 0, 6)
step = 48; idx = np.arange(0, N, step); sd = np.zeros(len(idx)); d = 0.0
a_a2 = 1 - np.exp(-1 / (0.01 * SR)); a_r2 = 1 - np.exp(-1 / (0.15 * SR))
for j, i in enumerate(idx):
    w = sw[i]; d += (w - d) * (1 - (1 - (a_a2 if w > d else a_r2)) ** step); sd[j] = d
sduck = np.interp(np.arange(N), idx, sd)
mix = vo + mus_g + S * (10 ** ((-6 - sduck) / 20))[:, None]
save("audio/mix_pre.wav", mix)

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
