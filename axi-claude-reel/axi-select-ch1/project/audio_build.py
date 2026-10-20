# audio_build.py — axi-select-ch1 soundtrack (run from W with python3 -I)
# 1. music: HeyGen library track f16f4a77 (110 BPM) re-cut on its beat grid: track 0 -> out 0.4214 so the drop (beat 32,
#    17.4586 s) lands on «وبمجرد» (VO 14.88 = out 17.88), section B (beat 160) on «بحساب التداول» (VO 84.70) and the
#    break/re-drop around «وأهمها» (VO 102.15); at out 113.88 a 16-beat-aligned splice jumps to the ending (beat 256) so its
#    final hit lands on the end card.
# 2. voice: Rabee's clean VO (audio/vo/vo1_clean.wav) unchanged except a gentle 2:1 level compressor, at out 3.0 s.
# 3. SFX: recorded CC0 sounds from the bundled library (sfx.py bed), cues below in VO time (+3.0).
# 4. mix: music under the voice with side-chain ducking, mastered to -14 LUFS / -1 dBTP -> audio/mix.wav + audio/mix.m4a
import json, subprocess, sys, os
import numpy as np

SR = 48000
DUR = 120.0
P = 3.0
RR = os.environ.get("HF_WORKFLOWS", "/home/user/.higgsfield/workflows") + "/katana/scripts"
N = int(DUR * SR)

def load(p, ch=2):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", str(ch), "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.float32).reshape(-1, ch).copy()

def save(p, a):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", str(a.shape[1]), "-i", "-", "-c:a", "pcm_s24le", p],
                   input=np.ascontiguousarray(a, np.float32).tobytes(), check=True)

def place(dst, src, at):
    i = int(round(at * SR))
    a, b = max(0, i), min(len(dst), i + len(src))
    if b > a: dst[a:b] += src[a - i:b - i]

def fade(x, fin=0.0, fout=0.0):
    x = x.copy(); n = len(x)
    if fin > 0: k = min(n, int(fin * SR)); x[:k] *= np.linspace(0, 1, k)[:, None]
    if fout > 0: k = min(n, int(fout * SR)); x[n - k:] *= np.linspace(1, 0, k)[:, None]
    return x

# ---------------------------------------------------------------- 1. music edit
M = load("inputs/music/f16f4a77.wav")
per = 60 / 110.0
b = lambda n: 0.0041 + n * per
OFF = 17.88 - b(32)
seg_a = M[: int(b(208) * SR)]
seg_b = M[int(b(256) * SR):]
mus = np.zeros((N, 2), np.float32)
place(mus, fade(seg_a, 0.0, 0.03), OFF)
place(mus, fade(seg_b, 0.03, 0.0), OFF + b(208) - 0.015)
t = np.arange(N) / SR
mus *= np.clip((120.0 - t) / 1.4, 0, 1)[:, None]          # tail fade into the last frame
save("audio/music_edit.wav", mus)

# ---------------------------------------------------------------- 2. voice
vo_src = "audio/vo/vo1_clean.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", vo_src, "-af",
                "acompressor=threshold=-22dB:ratio=2:attack=12:release=160:makeup=1,aresample=48000",
                "-ac", "1", "-c:a", "pcm_s24le", "audio/vo_comp.wav"], check=True)
V1 = load("audio/vo_comp.wav", 1)[:, 0]
vo = np.zeros((N, 2), np.float32)
place(vo, np.stack([V1, V1], 1), P)
save("audio/vo_out.wav", vo)

# ---------------------------------------------------------------- 3. SFX cues (VO times; title/end in output time)
C = []
def c(tv, cat, g=0.0, out=False): C.append({"t": round(tv if out else tv + P, 3), "cat": cat, "gain_db": g})
# title (output time)
c(0.12, "whoosh", -4, True); c(0.60, "boom", -3, True); c(0.88, "hit", -6, True); c(2.52, "whoosh", -6, True)
# camera moves: pull-outs / push-in (whoosh peaks just after the start)
for tv in [1.50, 27.08, 40.02, 69.22]: c(tv + 0.05, "whoosh", -2)
c(105.58, "whoosh", -4)
# A lockup
c(2.02, "flash", -6); c(2.10, "hit", -8)
# B tiles
c(4.54, "ui_blip", -2); c(5.30, "ui_blip", -2)
# C card + chart
c(9.70, "dataswish", -3); c(12.90, "scan", -4)
# D drop + gauge
c(14.88, "boom", -2); c(15.90, "ui_blip", -2); c(16.60, "scan", -2); c(18.02, "hit", -4); c(18.10, "ui_blip", 0)
# E conditions
c(18.50, "ui_blip", -2); c(19.10, "dataswish", -4); c(19.30, "type", 0)
# F1 / F2 accounts
c(22.70, "dataswish", -4); c(25.80, "poweron", -2); c(27.78, "dataswish", -4); c(28.05, "dataswish", -4); c(28.40, "scan", -4)
# G «مبروك»
c(31.92, "flash", -2); c(32.0, "hit", -6)
# H Seed + $5,000
c(33.80, "ui_blip", -2); c(33.90, "poweron", -3); c(38.62, "hit", -2); c(38.64, "type", 0); c(38.90, "flash", -6)
# I six stages
c(41.65, "hit", -4)
for k in range(6): c(42.42 + 0.2 * k, "ui_blip", -5)
c(44.18, "poweron", -4)
# J / K / L / M2 stages
c(44.85, "dataswish", -5); c(47.20, "ui_blip", -1); c(48.10, "dataswish", -5); c(49.40, "ui_blip", -1)
c(52.20, "ui_blip", -1); c(55.22, "ui_blip", -1); c(59.24, "hit", -3); c(59.26, "flash", -4)
# N1 / N2 funding, profit share
c(62.30, "dataswish", -4); c(63.12, "type", 0); c(65.70, "ui_blip", -2); c(66.62, "scan", -3)
# O simplify: your account + allocation account
c(69.90, "dataswish", -4); c(70.90, "scan", -5); c(72.70, "ui_blip", -2); c(73.58, "poweron", -3)
# P «ملاحظة مهمة»
c(77.88, "ui_error", -2); c(77.95, "hit", -6)
# Q lock, no direct trading, auto link
c(79.02, "dataswish", -4); c(80.14, "ui_blip", 0); c(80.54, "ui_error", -3); c(82.54, "dataswish", -5); c(83.16, "scan", -4)
# R drop 2: trades copied, ×10
c(84.70, "boom", -2); c(85.20, "scan", -5)
for tv in [86.66, 87.36, 87.88]: c(tv, "whoosh", -8); c(tv + 1.15, "ui_blip", -3)
c(88.56, "hit", -2)
# S «معامل الضرب»
c(91.66, "whoosh", -6); c(94.42, "ui_blip", -2)
# T rules checklist, red drawdown row
c(98.00, "dataswish", -4)
for tv in [98.6, 99.1, 99.6, 100.1, 100.6]: c(tv, "ui_blip", -4)
c(101.40, "ui_error", -2)
# U re-drop: red floor, drawdown, 10%
c(102.15, "boom", -2); c(102.20, "powerdown", -4); c(102.35, "glitch", -8); c(104.50, "hit", -2)
# V upcoming chapters
c(106.30, "dataswish", -4); c(108.16, "ui_blip", -2)
# end card (output time)
c(113.70, "longwhoosh", -2, True); c(114.03, "hit", -3, True); c(114.05, "flash", -5, True); c(114.70, "ui_blip", -4, True)
json.dump(C, open("audio/sfx_cues_plan.json", "w"), indent=0)
r = subprocess.run(["python3", RR + "/sfx.py", "bed", ".", "--cues", "audio/sfx_cues_plan.json", "--music", "audio/music_edit.wav",
                    "--dur", str(DUR), "--seed", "7", "--out", "audio/sfx_bed.wav"], capture_output=True, text=True)
print(r.stdout[-600:], r.stderr[-600:])
S = load("audio/sfx_bed.wav")
S = np.pad(S, ((0, max(0, N - len(S))), (0, 0)))[:N]

# ---------------------------------------------------------------- 4. mix: music automation + side-chain ducking
def env_db(x, win=0.05):
    k = int(win * SR); e = np.sqrt(np.convolve((x ** 2).mean(1) if x.ndim == 2 else x ** 2, np.ones(k) / k, mode="same") + 1e-12)
    return 20 * np.log10(e)
vo_db = env_db(vo)
# duck: up to 7 dB more when the voice is present, smoothed (attack ~30 ms, release ~350 ms)
want = np.clip((vo_db + 42) * 0.35, 0, 7)
duck = np.zeros_like(want); a_att = 1 - np.exp(-1 / (0.03 * SR)); a_rel = 1 - np.exp(-1 / (0.35 * SR))
d = 0.0
step = 48  # compute on a decimated grid for speed
idx = np.arange(0, N, step)
dd = np.zeros(len(idx))
for j, i in enumerate(idx):
    w = want[i]
    d += (w - d) * (1 - (1 - (a_att if w > d else a_rel)) ** step)
    dd[j] = d
duck = np.interp(np.arange(N), idx, dd)
base = np.interp(t, [0, 2.6, 3.0, 17.7, 17.9, 18.6, 113.4, 113.9, 120],
                 [-5, -5, -12, -12, -9, -12, -12, -3, -3])          # dB: title open, under the voice, a lift on the drop, end card up
for tc in [87.70, 105.15]:                                          # small lifts on drop 2 and the re-drop
    base += 3 * np.exp(-((t - tc - 0.25) / 0.35) ** 2)
mus_g = mus * (10 ** ((base - duck) / 20))[:, None]
mix = vo + mus_g + S * (10 ** (-6 / 20))
save("audio/mix_pre.wav", mix)
# master: two-pass loudnorm to -14 LUFS, true peak -1 dBTP
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", "audio/mix_pre.wav", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True)
js = r.stderr[r.stderr.rfind("{"):r.stderr.rfind("}") + 1]
m = json.loads(js)
af = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
      f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,alimiter=limit=0.84:attack=2:release=60:level=disabled")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio/mix_pre.wav", "-af", af, "-ar", "48000", "-c:a", "pcm_s24le", "audio/mix.wav"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio/mix.wav", "-c:a", "aac", "-b:a", "256k", "-t", str(DUR), "audio/mix.m4a"], check=True)
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", "audio/mix.m4a", "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
summ = r.stderr[r.stderr.rfind("Summary:"):]
print(summ)
print("cues", len(C))
