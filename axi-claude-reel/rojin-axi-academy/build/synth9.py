# Nolan-style layers synced to the Rojin / Axi Academy cut.
import sys, subprocess, numpy as np
S = sys.argv[1]; OUT = f'{S}/acad/work'
SR = 48000; DUR = 31.0; N = int(DUR * SR)
t = np.arange(N) / SR
rng = np.random.default_rng(11)

def save(name, x):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_f32le', f'{OUT}/{name}.wav'],
                   input=x.astype(np.float32).tobytes(), check=True)

def lp(x, fc):
    a = np.exp(-2 * np.pi * np.asarray(fc) / SR) * np.ones(len(x))
    y = np.empty_like(x); s = 0.0
    for i in range(len(x)):
        s = a[i] * s + (1 - a[i]) * x[i]; y[i] = s
    return y

def put(buf, x, t0):
    s = int(t0 * SR); e = min(len(buf), s + len(x)); buf[s:e] += x[:e - s]

# ticking clock while she is overwhelmed; doubles at the close-up, dead stop at the dim
tick = np.zeros((N, 2), np.float32)
def click(amp, pan):
    n = int(0.03 * SR); tt = np.arange(n) / SR
    y = (np.sin(2 * np.pi * 2300 * tt) * 0.6 + rng.standard_normal(n) * 0.5) * np.exp(-tt / 0.0045)
    y += np.sin(2 * np.pi * 900 * tt) * np.exp(-tt / 0.012) * 0.35
    return np.stack([y * (1 - pan), y * (1 + pan)], 1) * amp
for i, tc in enumerate(list(np.arange(0.6, 2.6, 0.5)) + list(np.arange(2.6, 4.15, 0.25))):
    put(tick, click(0.3 + 0.6 * (tc - 0.6) / 3.6, 0.15 if i % 2 else -0.15), tc)
save('syn_tick', tick)

# Shepard risers: act-1 tension, and the module montage climbing into the micro dim
def shepard(a0, a1, octs, amp):
    m = (t >= a0) & (t < a1); tt = t[m] - a0; L = a1 - a0; y = np.zeros(m.sum())
    for k in range(9):
        op = (k + tt / L * octs) % 9; f = 27.5 * 2 ** op
        y += np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-0.5 * ((op - 4.5) / 1.6) ** 2)
    out = np.zeros((N, 2)); out[m, 0] = y * (tt / L) ** 1.5 * amp; out[m, 1] = np.roll(out[m, 0], 240)
    return out
save('syn_shepard', shepard(0.6, 4.2, 1.2, .14) + shepard(10.0, 17.65, 2.0, .16))

# module hits: sub thump + tick on each module cut
hits = np.zeros((N, 2), np.float32)
def thump(amp):
    n = int(0.6 * SR); tt = np.arange(n) / SR
    f = 45 + 70 * np.exp(-tt * 30); y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 7) * amp
    y += rng.standard_normal(n) * np.exp(-tt * 120) * 0.15 * amp
    return np.stack([y, y], 1)
for i, tc in enumerate([10.0, 11.3, 12.6, 13.9, 15.2, 16.5]):
    put(hits, thump(0.55 + 0.08 * i), tc)
save('syn_hits', hits)

# drone under act 1
d = np.zeros(N)
for f, g in [(32.70, 1.0), (49.0, 0.5), (65.4, 0.45), (98.0, 0.2)]:
    d += g * np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) * (1 + 0.15 * np.sin(2 * np.pi * 0.17 * t))
env = np.clip((t - 0.3) / 1.5, 0, 1) * (t < 4.2)
save('syn_drone', np.stack([d, d], 1) * env[:, None] * 0.12)

# organ pad: A minor journey, C major lift on "from zero to pro", low A under the end card
def organ(freqs, t0, t1, att=1.0, rel=1.0, amp=0.1):
    mm = (t >= t0) & (t < t1 + rel); tt = t[mm] - t0; y = np.zeros(mm.sum())
    for f in freqs:
        for h, g in [(1, 1), (2, .5), (3, .18), (4, .25), (8, .08)]:
            y += g * np.sin(2 * np.pi * f * h * tt + rng.uniform(0, 6.28))
    e = np.clip(tt / att, 0, 1) ** 2 * np.clip((t1 + rel - t0 - tt) / rel, 0, 1)
    out = np.zeros(N); out[mm] = y * e * amp / len(freqs); return out
A1, A2, C3, E3, F2, G2, B2, D3, G3 = 55.0, 110.0, 130.81, 164.81, 87.31, 98.0, 123.47, 146.83, 196.0
pad = (organ([A2, C3, E3], 5.4, 10.0, 1.2, .8, .07) + organ([F2, A2, C3], 10.0, 17.65, .6, .1, .08) +
       organ([C3, E3, G3, 65.41], 18.3, 21.8, .3, 1.0, .13) + organ([G2, B2, D3, 49.0], 21.8, 24.8, .5, .4, .10) +
       organ([A1, A2, E3], 25.0, 29.5, .05, 1.5, .06))
save('syn_pad', np.stack([pad, np.roll(pad, 300)], 1))

# braam on the monument reveal
b0 = 7.6; mm = (t >= b0) & (t < b0 + 3.0); tt = t[mm] - b0; y = np.zeros(mm.sum())
for f in [A1, A1 * 1.004, 82.41, 110.0, 110.0 * .997]:
    y += 2 * ((f * tt) % 1) - 1
y = np.tanh(y * 0.8) * np.exp(-tt / 1.4) * np.clip(tt / 0.02, 0, 1)
y = lp(y, 180 + 1400 * np.exp(-tt / 0.5))
br = np.zeros(N); br[mm] = y * 0.35
save('syn_braam', np.stack([br, br], 1))

# sub booms on the big beats
def boom(dur, f0, f1, amp):
    n = int(dur * SR); tt = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-tt * 3.2)
    y = np.tanh(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 1.6) * amp * 1.6) / np.tanh(1.6)
    nz = rng.standard_normal(n) * np.exp(-tt * 40) * 0.25
    y = y + np.convolve(nz, np.ones(24) / 24, 'same')
    return np.stack([y, y], 1)
bm = np.zeros((N, 2), np.float32)
put(bm, boom(2.4, 62, 31, .8), 0.30); put(bm, boom(2.4, 66, 32, .8), 5.40)
put(bm, boom(2.8, 60, 30, 1.0), 18.30); put(bm, boom(3.4, 58, 28, 1.0), 25.00)
save('syn_booms', bm)
print('ok')
