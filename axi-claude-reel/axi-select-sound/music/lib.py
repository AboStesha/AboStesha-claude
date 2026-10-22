# lib.py - sampler, synthesis, reverb, loudness and file helpers for compose.py / qa.py (numpy + scipy only)
import os, re, glob, json, subprocess, math
import numpy as np
from scipy import signal

SR = 48000
ROOT = "/home/user/rr/sound3/music"
SMP = ROOT + "/samples/vsco"
CACHE = ROOT + "/work/cache"
os.makedirs(CACHE, exist_ok=True)

# ------------------------------------------------------------------ file io
def decode(path, sr=44100):
    """decode any sample file to float32 stereo at sr (cached as .npy)"""
    key = re.sub(r"[^A-Za-z0-9_.-]", "_", os.path.relpath(path, SMP)) + ".%d.npy" % sr
    c = os.path.join(CACHE, key)
    if os.path.exists(c):
        return np.load(c)
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "2", "-ar", str(sr), "-f", "f32le", "-"],
                       capture_output=True, check=True)
    x = np.frombuffer(r.stdout, np.float32).reshape(-1, 2).copy()
    np.save(c, x)
    return x

def write_wav24(path, x):
    """stereo float -> 24-bit PCM WAV (48 kHz)"""
    x = np.asarray(x, np.float64)
    if x.ndim == 1: x = np.stack([x, x], 1)
    q = np.clip(np.round(x * 8388607.0), -8388608, 8388607).astype(np.int32)
    b = q.astype("<i4").view(np.uint8).reshape(-1, 4)[:, :3].reshape(-1)
    nb = len(b)
    with open(path, "wb") as f:
        f.write(b"RIFF"); f.write((36 + nb).to_bytes(4, "little")); f.write(b"WAVE")
        f.write(b"fmt "); f.write((16).to_bytes(4, "little")); f.write((1).to_bytes(2, "little"))
        f.write((2).to_bytes(2, "little")); f.write(SR.to_bytes(4, "little")); f.write((SR * 6).to_bytes(4, "little"))
        f.write((6).to_bytes(2, "little")); f.write((24).to_bytes(2, "little"))
        f.write(b"data"); f.write(nb.to_bytes(4, "little")); f.write(b.tobytes())

def read_wav(path):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                       capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.float32).reshape(-1, 2).astype(np.float64)

# ------------------------------------------------------------------ pitch-shifted samples
_PC = {}
def pitched(path, st=0.0, maxlen=None):
    """sample at 48 kHz, transposed by st semitones (band-limited FFT resampling, varispeed like a sampler)"""
    k = (path, round(float(st), 4), maxlen)
    if k in _PC: return _PC[k]
    x = decode(path).astype(np.float64)
    # skip leading silence (below -60 dBFS)
    a = np.abs(x).max(1)
    nz = np.flatnonzero(a > 1e-3)
    if len(nz): x = x[max(0, nz[0] - 64):]
    ratio = SR / 44100.0 * 2 ** (-st / 12.0)
    if maxlen: x = x[:int(maxlen * 44100 / 2 ** (-st / 12.0)) + 1024]
    pad = 2048
    xp = np.pad(x, ((pad, pad), (0, 0)))
    n_out = int(round(len(xp) * ratio))
    y = signal.resample(xp, n_out, axis=0)
    p2 = int(round(pad * ratio))
    y = y[p2:n_out - p2]
    # 2 ms fade-in to remove any resampling pre-ring
    f = min(len(y), 96); y[:f] *= np.linspace(0, 1, f)[:, None]
    _PC[k] = y
    return y

NOTE = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
def nm(name, octv): return 12 * (octv + 1) + NOTE[name]
_PM = None
def pm():
    global _PM
    if _PM is None:
        _PM = json.load(open(ROOT + "/samples/pitchmap_raw.json"))
    return _PM

def build_map(globpat, rx, offset=12, idxmap=None):
    """{nominal midi: (path, true midi)}; VSCO names its strings one octave low (C3 = middle C), so offset=12;
    the measured tuning (pitchscan.py) is used when it is within 0.4 st of the nominal note"""
    m = {}
    for p in sorted(glob.glob(os.path.join(SMP, globpat))):
        mt = re.search(rx, os.path.basename(p))
        if not mt: continue
        nom = idxmap(int(mt.group(1))) if idxmap else nm(mt.group(1), int(mt.group(2))) + offset
        meas = pm().get(os.path.relpath(p, SMP))
        true = meas if (meas is not None and abs(meas - nom) < 0.4) else float(nom)
        m.setdefault(nom, (p, true))
    return m

def pick(m, midi):
    k = min(m, key=lambda q: (abs(q - midi), q))
    p, true = m[k]
    return p, midi - true

MAPS = {}
def maps():
    if MAPS: return MAPS
    S = "Strings/"
    MAPS["vc"] = build_map(S + "Cello Section/susvib/susvib_*_v1_1.wav", r"susvib_([A-G]#?)(\d)_v1_1")
    MAPS["vc_f"] = build_map(S + "Cello Section/susvib/susvib_*_v3_1.wav", r"susvib_([A-G]#?)(\d)_v3_1")
    MAPS["vc_trem"] = build_map(S + "Cello Section/trem/trem_*_v1_1.wav", r"trem_([A-G]#?)(\d)_v1_1")
    MAPS["vc_spic"] = build_map(S + "Cello Section/spic/spic_*_v1_RR1.wav", r"spic_([A-G]#?)(\d)_v1_RR1")
    MAPS["vc_spic_f"] = build_map(S + "Cello Section/spic/spic_*_v2_RR1.wav", r"spic_([A-G]#?)(\d)_v2_RR1")
    # v2 review: the second round-robin takes of the spiccato (fetched from the same CC0 repository)
    MAPS["vc_spic_rr2"] = build_map(S + "Cello Section/spic/spic_*_v1_RR2.wav", r"spic_([A-G]#?)(\d)_v1_RR2")
    MAPS["vc_spic_f_rr2"] = build_map(S + "Cello Section/spic/spic_*_v2_RR2.wav", r"spic_([A-G]#?)(\d)_v2_RR2")
    MAPS["cb"] = build_map(S + "Solo Contrabass/SusNV/BKCtbss_SusNV_*_v1_rr1.wav", r"SusNV_([A-G]#?)(\d)_v1")
    MAPS["cb_f"] = build_map(S + "Solo Contrabass/SusNV/BKCtbss_SusNV_*_v3_rr1.wav", r"SusNV_([A-G]#?)(\d)_v3")
    MAPS["cb_spic"] = build_map(S + "Solo Contrabass/Spic/BKCtbss_Spic_*_v1_rr1.wav", r"Spic_([A-G]#?)(\d)_v1")
    MAPS["va"] = build_map(S + "Viola Section/susvib/ViolaEns_susvib_*_v1_1.wav", r"susvib_([A-G]#?)(\d)_v1_1")
    MAPS["vn"] = build_map(S + "Violin Section/susVib/VlnEns_susVib_*_v1.wav", r"susVib_([A-G]#?)(\d)_v1")
    MAPS["vn_trem"] = build_map(S + "Violin Section/Trem/VlnEns_Trem_*_v1.wav", r"Trem_([A-G]#?)(\d)_v1")
    MAPS["pno"] = build_map("Keys/Upright Piano/Player_dyn1_rr1_*.wav", r"dyn1_rr1_(\d+)", idxmap=lambda i: 21 + 2 * i)
    MAPS["pno_m"] = build_map("Keys/Upright Piano/Player_dyn2_rr1_*.wav", r"dyn2_rr1_(\d+)", idxmap=lambda i: 21 + 2 * i)
    # the contrabass spic G0 sample was mis-detected by the scan (nominal kept); drop the cello's tremolo E1/G1 (noisy)
    return MAPS

def P(rel): return os.path.join(SMP, rel)

# ------------------------------------------------------------------ dsp helpers
def sos(kind, f, order=2):
    return signal.butter(order, f, btype=kind, fs=SR, output="sos")
def filt(x, s): return signal.sosfilt(s, x, axis=0)
def filt0(x, s): return signal.sosfiltfilt(s, x, axis=0)
def lp(x, f, o=2): return filt(x, sos("lowpass", f, o))
def hp(x, f, o=2): return filt(x, sos("highpass", f, o))
def db(x): return 10 ** (x / 20.0)

def shelf_hi(x, f0, gain_db):
    """RBJ high shelf (causal)"""
    A = 10 ** (gain_db / 40); w0 = 2 * np.pi * f0 / SR; al = np.sin(w0) / 2 * np.sqrt(2)
    cw = np.cos(w0)
    b0 = A * ((A + 1) + (A - 1) * cw + 2 * np.sqrt(A) * al); b1 = -2 * A * ((A - 1) + (A + 1) * cw)
    b2 = A * ((A + 1) + (A - 1) * cw - 2 * np.sqrt(A) * al); a0 = (A + 1) - (A - 1) * cw + 2 * np.sqrt(A) * al
    a1 = 2 * ((A - 1) - (A + 1) * cw); a2 = (A + 1) - (A - 1) * cw - 2 * np.sqrt(A) * al
    return signal.lfilter([b0 / a0, b1 / a0, b2 / a0], [1, a1 / a0, a2 / a0], x, axis=0)

def peak_eq(x, f0, gain_db, q=1.0):
    A = 10 ** (gain_db / 40); w0 = 2 * np.pi * f0 / SR; al = np.sin(w0) / (2 * q); cw = np.cos(w0)
    b = [1 + al * A, -2 * cw, 1 - al * A]; a = [1 + al / A, -2 * cw, 1 - al / A]
    return signal.lfilter(np.array(b) / a[0], np.array(a) / a[0], x, axis=0)

def stereo(x):
    return np.stack([x, x], 1) if x.ndim == 1 else x

def pan(x, p):
    """equal-power balance for a stereo (or mono) signal, p in [-1, 1]"""
    x = stereo(x)
    th = (p + 1) * np.pi / 4
    g = np.array([np.cos(th), np.sin(th)]) * np.sqrt(2)
    return x * g[None, :]

def width(x, w):
    m = (x[:, 0] + x[:, 1]) / 2; s = (x[:, 0] - x[:, 1]) / 2 * w
    return np.stack([m + s, m - s], 1)

def place(buf, x, t, g=1.0):
    i = int(round(t * SR))
    x = stereo(x)
    a, b = max(0, i), min(len(buf), i + len(x))
    if b > a: buf[a:b] += g * x[a - i:b - i]

def fade_env(n, att, rel, hold):
    """attack (raised cosine) / hold / release envelope of length n samples (att, rel, hold in samples)"""
    e = np.ones(n)
    if att > 0:
        k = min(att, n); e[:k] = 0.5 - 0.5 * np.cos(np.pi * np.arange(k) / att)
    if rel > 0 and hold < n:
        k = n - hold; r = np.arange(k)
        e[hold:] *= np.where(r < rel, 0.5 + 0.5 * np.cos(np.pi * np.minimum(r, rel) / rel), 0.0)
    return e

def curve(t, pts):
    """piecewise-linear automation in dB: pts [(time, dB)]"""
    tt = np.array([p[0] for p in pts]); vv = np.array([p[1] for p in pts])
    return db(np.interp(t, tt, vv))

# ------------------------------------------------------------------ sampled instruments
def sustain_leveller(s, a, b, win=0.8, strength=0.85, lim_db=6.0):
    """v2 review: the VSCO sustains swell and sag by 3-9 dB over their length (e.g. viola D3 drops 6 dB after 5 s), so long
    chords sagged and every loop crossfade jumped back up. This gain curve flattens the slow (0.8 s) loudness envelope of the
    sustain part a..b by `strength` (vibrato and bow life stay); before a and after b it holds the edge values"""
    p = (s ** 2).mean(1)
    W = int(win * SR)
    cs = np.concatenate([[0.0], np.cumsum(p)])
    i = np.arange(len(p)); lo = np.clip(i - W // 2, 0, len(p)); hi = np.clip(i + W // 2, 0, len(p))
    e = np.sqrt((cs[hi] - cs[lo]) / np.maximum(hi - lo, 1) + 1e-12)
    ref = np.sqrt(p[a:b].mean() + 1e-12)
    g = np.clip((ref / e) ** strength, db(-lim_db), db(lim_db))
    g[:a] = g[a]; g[b:] = g[b - 1]
    return g

def sustain(mapname, midi, dur, att=0.35, rel=1.2, vel=1.0, loop_from=2.0, xf=1.5, start_off=0.0):
    """bowed sustain held for dur s (loops the sample's steady part with equal-power crossfades), then released"""
    p, st = pick(maps()[mapname], midi)
    s = pitched(p, st)
    n_s = len(s)
    steady_end = n_s - int(2.2 * SR)   # the recordings end with their own release (~2 s)
    seg_ = s[int(0.6 * SR):max(int(0.6 * SR) + 4800, steady_end)]
    s = s * (0.1 / (np.sqrt((seg_ ** 2).mean()) + 1e-9))   # every note at -20 dBFS RMS (even voicing)
    s = s * sustain_leveller(s, int(0.6 * SR), max(int(0.6 * SR) + 4800, steady_end))[:, None]
    if start_off > 0:
        s = s[int(start_off * SR):]; n_s = len(s); steady_end = n_s - int(2.2 * SR)
    L, R = int(dur * SR), int(rel * SR)
    need = L + R
    if need <= steady_end:
        out = s[:need].copy()
    else:
        a = int(loop_from * SR); X = int(xf * SR)
        seg = s[a:steady_end]
        out = s[:steady_end].copy()
        k = 0
        while len(out) < need:
            # crossfade the next copy over the last X samples
            th = np.linspace(0, np.pi / 2, X)[:, None]
            tail = out[-X:] * np.cos(th) + seg[:X] * np.sin(th)
            out = np.concatenate([out[:-X], tail, seg[X:]])
            k += 1
        out = out[:need]
    e = fade_env(len(out), int(att * SR), R, L)
    return out * e[:, None] * vel

def pluck(mapname, midi, vel=1.0, maxdur=None, rel=0.25, damp=None, norm_win=0.5):
    """struck/plucked sample (piano, spiccato); damp = note-off time in s (damper)"""
    p, st = pick(maps()[mapname], midi)
    s = pitched(p, st, maxlen=maxdur)
    if maxdur: s = s[:int(maxdur * SR)]
    s = s * (0.1 / (np.sqrt((s[:int(norm_win * SR)] ** 2).mean()) + 1e-9))
    if damp is not None and damp * SR < len(s):
        h = int(damp * SR); r = int(rel * SR)
        s = s[:h + r] * fade_env(min(len(s), h + r), 0, r, h)[:, None]
    else:
        r = min(len(s), int(0.3 * SR)); s[-r:] *= np.linspace(1, 0, r)[:, None]
    return s * vel

def one_shot(rel, st=0.0, vel=1.0, maxdur=None):
    s = pitched(P(rel), st, maxlen=maxdur)
    if maxdur:
        s = s[:int(maxdur * SR)].copy()
        r = min(len(s), int(0.25 * SR)); s[-r:] *= np.linspace(1, 0, r)[:, None]
    return s * vel

# ------------------------------------------------------------------ synthesis
def heartbeat(rng, vel=1.0, f_end=36.71, f_start=70.0, gap=0.21):
    """'lub-dub' pulse tuned to D1 with a stronger D2/A2 body (it reads on small speakers and leaves less sub boom);
    v2 review: every beat differs a little (gap, decay, sweep, body), it was a bit-identical copy before"""
    T = 1.0; n = int(T * SR); t = np.arange(n) / SR
    gap = gap * rng.uniform(0.94, 1.06); dk = rng.uniform(0.9, 1.1); fs0 = f_start * rng.uniform(0.95, 1.05)
    body = rng.uniform(0.42, 0.52)
    def lub(a, dec, fs, fe):
        f = fe + (fs - fe) * np.exp(-t / 0.045)
        ph = 2 * np.pi * np.cumsum(f) / SR
        env = (1 - np.exp(-t / 0.011)) * np.exp(-t / (dec * dk))
        return a * (0.8 * np.sin(ph) + body * np.sin(2 * ph + 0.3) + 0.12 * np.sin(3 * ph + 0.7)) * env
    x = lub(1.0, 0.12, fs0, f_end)
    d = int(gap * SR)
    x[d:] += lub(rng.uniform(0.5, 0.62), 0.10, fs0 * 0.92, f_end)[:n - d]
    x = np.tanh(1.4 * x) / np.tanh(1.4)
    x *= np.minimum(1, (n - np.arange(n)) / (0.1 * SR))
    return vel * x

def tick(rng, vel=1.0, hi=True):
    """a small mechanical watch tick: two very short resonant clicks (band 2.5-9 kHz) and a tiny wooden body"""
    # v2 review: the fixed 5.2 kHz / 7.6 kHz sine pings made every tick identical (a +7 dB LTAS spike at 5.2 kHz);
    # the band, decays and partials now vary per tick and the tonal ping is half as loud
    n = int(0.06 * SR); t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    lo_, hi_ = (3000, 9000) if hi else (2200, 7000)
    b = signal.sosfilt(sos("bandpass", (lo_ * rng.uniform(0.9, 1.1), hi_ * rng.uniform(0.9, 1.04)), 2), nz)
    x = b * np.exp(-t / (0.0022 * rng.uniform(0.8, 1.25)))
    f1 = (5200 if hi else 3900) * rng.uniform(0.95, 1.05)
    x += 0.18 * np.sin(2 * np.pi * f1 * t) * np.exp(-t / 0.003)
    x += 0.12 * np.sin(2 * np.pi * (f1 * rng.uniform(1.42, 1.52)) * t) * np.exp(-t / 0.0025)
    d = int(0.0065 * rng.uniform(0.85, 1.15) * SR)
    x[d:] += 0.45 * (b[:n - d] * np.exp(-t[:n - d] / 0.0016))
    x += 0.22 * np.sin(2 * np.pi * 820 * rng.uniform(0.93, 1.07) * t) * np.exp(-t / 0.006)
    x /= np.abs(x).max() + 1e-9
    return vel * x

def sub_drop(vel=1.0, f0=58.0, f1=29.0, T=2.2, dec=0.7):
    n = int(T * SR); t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.35)
    ph = 2 * np.pi * np.cumsum(f) / SR
    env = (1 - np.exp(-t / 0.004)) * np.exp(-t / dec)
    x = np.sin(ph) * env
    x = np.tanh(1.3 * x) / np.tanh(1.3)
    x *= np.minimum(1, (n - np.arange(n)) / (0.2 * SR))
    return vel * x

def additive_drone(t0, t1, freqs, rng, level=1.0, cut=380.0, lfo=0.045, det=(0.0, -0.11, 0.09), att=0.25, rel=2.0):
    """dark 'low strings' synth: band-limited detuned saw stacks shaped by a slow-moving 2-pole low-pass"""
    n = int((t1 - t0 + rel) * SR); t = np.arange(n) / SR
    L = np.zeros(n); R = np.zeros(n)
    cmod = cut * (1 + 0.35 * np.sin(2 * np.pi * lfo * t + rng.uniform(0, 6.28)))
    for f in freqs:
        for vi, dc in enumerate(det):
            fv = f * 2 ** (dc / 12)
            K = int(min(2500 / fv, 40))
            ph0 = rng.uniform(0, 2 * np.pi, K + 1)
            sig = np.zeros(n)
            for k in range(1, K + 1):
                fk = k * fv
                w = 1.0 / np.sqrt(1 + (fk / cmod) ** 4)   # 2-pole low-pass magnitude
                sig += w * np.sin(2 * np.pi * fk * t + ph0[k]) / k
            pn = (vi - 1) * 0.6
            L += sig * np.cos((pn + 1) * np.pi / 4); R += sig * np.sin((pn + 1) * np.pi / 4)
    x = np.stack([L, R], 1)
    x /= (np.abs(x).max() + 1e-9)
    e = fade_env(n, int(att * SR), int(rel * SR), int((t1 - t0) * SR))
    breath = 1 + 0.12 * np.sin(2 * np.pi * 0.07 * t + 1.3)
    return x * (e * breath)[:, None] * level

def noise_riser(rng, T, f_lo=180.0, f_hi=2600.0, vel=1.0, shape=2.2):
    """pink-ish noise through a band-pass that rises over T s (STFT mask), gain rising to the end"""
    n = int(T * SR)
    nz = rng.standard_normal((n, 2))
    f, tt, Z = signal.stft(nz, fs=SR, nperseg=2048, axis=0)
    # Z shape (freq, ch, frames)
    fr = np.linspace(0, 1, Z.shape[-1]) ** shape
    fc = f_lo * (f_hi / f_lo) ** fr
    ff = f[:, None]
    mask = np.exp(-0.5 * (np.log2((ff + 1) / fc[None, :]) / 0.55) ** 2) / np.sqrt(ff + 20)
    Z = Z * mask[:, None, :]
    _, y = signal.istft(Z, fs=SR, nperseg=2048, time_axis=-1, freq_axis=0)
    y = np.asarray(y)
    if y.shape[0] == 2: y = y.T
    y = y[:n]
    g = np.linspace(0, 1, len(y)) ** 2.5
    y = y * g[:, None]
    y /= np.abs(y).max() + 1e-9
    k = int(0.006 * SR); y[-k:] *= np.linspace(1, 0, k)[:, None]   # ends into the hit without a step
    return vel * y

# ------------------------------------------------------------------ reverb
def make_ir(T, rt, predelay=0.025, seed=1, er_n=18, er_span=0.09, er_gain=0.35, damp_hf=6500.0):
    """synthetic stereo hall IR. rt = dict band-edge -> RT60 (s), bands split at 250/1000/4000 Hz"""
    rng = np.random.default_rng(seed)
    n = int(T * SR); t = np.arange(n) / SR
    ir = np.zeros((n, 2))
    edges = [(0, 250), (250, 1000), (1000, 4000), (4000, 20000)]
    for ch in range(2):
        nz = rng.standard_normal(n)
        acc = np.zeros(n)
        for (lo, hi), r60 in zip(edges, rt):
            if lo == 0: b = signal.sosfiltfilt(sos("lowpass", hi, 4), nz)
            elif hi >= 20000: b = signal.sosfiltfilt(sos("highpass", lo, 4), nz)
            else: b = signal.sosfiltfilt(sos("bandpass", (lo, hi), 4), nz)
            acc += b * np.exp(-6.9078 * t / r60)
        # soft onset of the diffuse tail
        acc *= 1 - np.exp(-t / 0.03)
        ir[:, ch] = acc
    ir = signal.sosfilt(sos("lowpass", damp_hf, 2), ir, axis=0)
    ir /= np.sqrt((ir ** 2).sum(0, keepdims=True).mean())
    # early reflections
    er = np.zeros((n, 2))
    for k in range(er_n):
        d = rng.uniform(0.008, er_span); g = er_gain * (1 - d / (er_span * 1.3)) * rng.uniform(0.5, 1.0)
        ch = rng.integers(0, 2); i = int(d * SR)
        er[i, ch] += g * (1 if rng.random() > 0.3 else -1)
    er = signal.sosfilt(sos("lowpass", 5000, 2), er, axis=0)
    ir = ir * 0.9 + er
    pd = int(predelay * SR)
    ir = np.concatenate([np.zeros((pd, 2)), ir])[:n]
    return ir

def convolve(x, ir):
    return np.stack([signal.oaconvolve(x[:, c], ir[:, c])[:len(x)] for c in range(2)], 1)

# ------------------------------------------------------------------ loudness (ITU-R BS.1770-4)
_KB1 = ([1.53512485958697, -2.69169618940638, 1.19839281085285], [1.0, -1.69065929318241, 0.73248077421585])
_KB2 = ([1.0, -2.0, 1.0], [1.0, -1.99004745483398, 0.99007225036621])
def kweight(x):
    y = signal.lfilter(*_KB1, x, axis=0)
    return signal.lfilter(*_KB2, y, axis=0)

def loudness_series(x, win=3.0, hop=0.1):
    """short-term (win=3) or momentary (win=0.4) loudness every hop s; window truncated at the start"""
    y = kweight(stereo(x)); p = (y ** 2).sum(1)
    cs = np.concatenate([[0], np.cumsum(p)])
    ts = np.arange(hop, len(p) / SR + 1e-9, hop)
    out = []
    W = int(win * SR)
    for t in ts:
        e = int(t * SR); s = max(0, e - W)
        m = (cs[e] - cs[s]) / max(1, e - s)
        out.append(-0.691 + 10 * np.log10(m + 1e-20))
    return ts, np.array(out)

def integrated(x):
    y = kweight(stereo(x)); p = (y ** 2).sum(1)
    W, H = int(0.4 * SR), int(0.1 * SR)
    cs = np.concatenate([[0], np.cumsum(p)])
    z = np.array([(cs[i + W] - cs[i]) / W for i in range(0, len(p) - W, H)])
    l = -0.691 + 10 * np.log10(z + 1e-20)
    z1 = z[l > -70]
    if not len(z1): return -99.0
    lr = -0.691 + 10 * np.log10(z1.mean()) - 10
    z2 = z[(l > -70) & (l > lr)]
    return float(-0.691 + 10 * np.log10(z2.mean()))

def true_peak_db(x):
    y = signal.resample_poly(stereo(x), 4, 1, axis=0)
    return 20 * np.log10(np.abs(y).max() + 1e-12)

def limiter_gain(x, ceil_db=-3.4, look=0.006, rel=0.15, blk=16):
    """look-ahead peak limiter gain curve (per sample) for signal x; block-rate control, linear interpolation"""
    a = np.abs(stereo(x)).max(1)
    nb = int(np.ceil(len(a) / blk))
    a = np.pad(a, (0, nb * blk - len(a))).reshape(nb, blk).max(1)
    g = np.minimum(1.0, db(ceil_db) / (a + 1e-12))
    L = int(np.ceil(look * SR / blk))
    from scipy.ndimage import minimum_filter1d
    g = minimum_filter1d(g, size=2 * L + 1, mode="nearest")
    k = np.exp(-blk / (rel * SR))
    out = np.empty_like(g); y = 1.0
    for i in range(nb):
        v = g[i]
        y = v if v < y else (y * k + (1 - k) * v)
        out[i] = y
    tb = (np.arange(nb) + 0.5) * blk
    return np.interp(np.arange(len(x)), tb, out)
