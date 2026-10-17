# Nolan-style score layers synced to the edit: ticking clock, Shepard riser, organ pad, braam.
import sys, subprocess, numpy as np
S = sys.argv[1]; OUT = f'{S}/nl/work'
SR = 48000; DUR = 36.45; N = int(DUR * SR)
t = np.arange(N) / SR
rng = np.random.default_rng(9)

def save(name, x):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_f32le', f'{OUT}/{name}.wav'],
                   input=x.astype(np.float32).tobytes(), check=True)

def lp(x, fc):  # one-pole low-pass (per-sample cutoff allowed)
    fc = np.broadcast_to(fc, x.shape[:1]); a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x); s = np.zeros(x.shape[1:], np.float64)
    for i in range(len(x)):
        s = a[i] * s + (1 - a[i]) * x[i]; y[i] = s
    return y

# ---- ticking clock: 0.5 s from the eyes opening, doubles to 0.25 s at the eye close-up, stops at the dim ----
tick = np.zeros((N, 2), np.float32)
def click(amp, pan):
    n = int(0.03 * SR); tt = np.arange(n) / SR
    y = (np.sin(2 * np.pi * 2300 * tt) * 0.6 + rng.standard_normal(n) * 0.5) * np.exp(-tt / 0.0045)
    y += np.sin(2 * np.pi * 900 * tt) * np.exp(-tt / 0.012) * 0.35
    return np.stack([y * (1 - pan), y * (1 + pan)], 1) * amp
times = list(np.arange(1.85, 7.25, 0.5)) + list(np.arange(7.25, 10.10, 0.25))
for i, tc in enumerate(times):
    amp = 0.25 + 0.55 * (tc - 1.85) / (10.1 - 1.85)
    c = click(amp * (1.0 if i % 2 == 0 else 0.8), 0.15 if i % 2 else -0.15)
    s = int(tc * SR); tick[s:s + len(c)] += c
save('syn_tick', tick)

# ---- Shepard riser 5.15 -> 10.15, cut dead at the dim ----
a0, a1 = 5.15, 10.15
m = (t >= a0) & (t < a1); tt = t[m] - a0; L = a1 - a0
sh = np.zeros(m.sum())
for k in range(9):
    oct_pos = (k + tt / L * 1.6) % 9            # rises 1.6 octaves over the riser
    f = 27.5 * 2 ** oct_pos
    w = np.exp(-0.5 * ((oct_pos - 4.5) / 1.6) ** 2)
    ph = 2 * np.pi * np.cumsum(f) / SR
    sh += np.sin(ph) * w
sh *= (tt / L) ** 1.6 * 0.18
shep = np.zeros((N, 2), np.float32); shep[m, 0] = sh; shep[m, 1] = np.roll(sh, 240)
save('syn_shepard', shep)

# ---- low drone, act 1 ----
d = np.zeros(N)
for f, g in [(32.70, 1.0), (49.0, 0.5), (65.4, 0.45), (98.0, 0.2)]:
    d += g * np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) * (1 + 0.15 * np.sin(2 * np.pi * 0.17 * t))
env = np.clip((t - 0.3) / 2.0, 0, 1) * np.clip((10.15 - t) / 0.08, 0, 1) * (t < 10.15)
drone = np.stack([d, d], 1) * env[:, None] * 0.12
save('syn_drone', drone)

# ---- organ pad, act 2/3 (Interstellar-like): Am - F - C - G ----
def organ(freqs, t0, t1, att=1.2, rel=1.0, amp=0.1):
    mm = (t >= t0) & (t < t1 + rel); tt = t[mm] - t0
    y = np.zeros(mm.sum())
    for f in freqs:
        for h, g in [(1, 1), (2, .5), (3, .18), (4, .25), (8, .08)]:
            y += g * np.sin(2 * np.pi * f * h * tt + rng.uniform(0, 6.28))
    e = np.clip(tt / att, 0, 1) ** 2 * np.clip((t1 + rel - t0 - tt) / rel, 0, 1)
    out = np.zeros(N); out[mm] = y * e * amp / len(freqs)
    return out
A2, C3, E3, F2, G2, B2, D3, G3, A1, E2 = 110, 130.81, 164.81, 87.31, 98.0, 123.47, 146.83, 196.0, 55.0, 82.41
pad = (organ([A2, C3, E3], 11.45, 16.35, 1.8, 1.2, .07) + organ([F2, A2, C3], 16.35, 22.05, 1.0, 1.2, .09) +
       organ([C3, E3, G3, 65.41], 22.05, 27.35, .5, 1.4, .13) + organ([G2, B2, D3, 49.0], 27.35, 28.75, .3, .9, .12) +
       organ([A1], 28.75, 31.35, .2, .6, .10) + organ([A2, E3], 31.35, 33.6, 1.0, .4, .04) + organ([A1, A2, E3], 33.72, 35.4, .05, 1.0, .06))
pad = np.stack([pad, np.roll(pad, 300)], 1)
save('syn_pad', pad)

# ---- braam on the desert arch ----
b0 = 22.05; mm = (t >= b0) & (t < b0 + 3.0); tt = t[mm] - b0
y = np.zeros(mm.sum())
for f in [A1, A1 * 1.004, E2, 110.0, 110.0 * .997]:
    ph = 2 * np.pi * f * tt; y += (2 * ((ph / (2 * np.pi)) % 1) - 1)
y = np.tanh(y * 0.8)
seg = (y * np.exp(-tt / 1.4) * np.clip(tt / 0.02, 0, 1))[:, None]
seg = lp(seg, 180 + 1400 * np.exp(-tt / 0.5))[:, 0]
br = np.zeros(N); br[mm] = seg * 0.35
save('syn_braam', np.stack([br, br], 1))
print('ok')
