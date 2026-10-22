# shared DSP for the Axi Select SFX palette (numpy / scipy only). 48 kHz, float64, stereo = (n, 2)
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000


def tvec(d):
    return np.arange(int(round(d * SR))) / SR


def ms(x):
    return float(np.mean(np.square(x)))


# ---------------------------------------------------------------- filters (RBJ biquads, sos rows)
def _norm(b, a):
    b = np.asarray(b, float) / a[0]; a = np.asarray(a, float) / a[0]
    return np.concatenate([b, a])[None, :]


def bq_peak(f0, g, Q):
    A = 10 ** (g / 40); w = 2 * np.pi * f0 / SR; al = np.sin(w) / (2 * Q); c = np.cos(w)
    return _norm([1 + al * A, -2 * c, 1 - al * A], [1 + al / A, -2 * c, 1 - al / A])


def bq_hshelf(f0, g):
    A = 10 ** (g / 40); w = 2 * np.pi * f0 / SR; c = np.cos(w); al = np.sin(w) / 2 * np.sqrt(2); s = 2 * np.sqrt(A) * al
    return _norm([A * ((A + 1) + (A - 1) * c + s), -2 * A * ((A - 1) + (A + 1) * c), A * ((A + 1) + (A - 1) * c - s)],
                 [(A + 1) - (A - 1) * c + s, 2 * ((A - 1) - (A + 1) * c), (A + 1) - (A - 1) * c - s])


def bq_lshelf(f0, g):
    A = 10 ** (g / 40); w = 2 * np.pi * f0 / SR; c = np.cos(w); al = np.sin(w) / 2 * np.sqrt(2); s = 2 * np.sqrt(A) * al
    return _norm([A * ((A + 1) - (A - 1) * c + s), 2 * A * ((A - 1) - (A + 1) * c), A * ((A + 1) - (A - 1) * c - s)],
                 [(A + 1) + (A - 1) * c + s, -2 * ((A - 1) + (A + 1) * c), (A + 1) + (A - 1) * c - s])


def filt(x, sos):
    return signal.sosfilt(sos, x, axis=0)


def lp(x, fc, order=2):
    return filt(x, signal.butter(order, min(fc, SR * 0.45), "low", fs=SR, output="sos"))


def hp(x, fc, order=2):
    return filt(x, signal.butter(order, fc, "high", fs=SR, output="sos"))


def bp(x, f1, f2, order=2):
    return filt(x, signal.butter(order, [f1, min(f2, SR * 0.45)], "band", fs=SR, output="sos"))


# ---------------------------------------------------------------- time-varying spectral shaping of noise
NF, HOP = 1024, 256


def tv_band(x, fc, bw, tilt=0.0, floor=0.0):
    """x mono; fc(t) Hz and bw(t) octaves (gaussian sigma) may be callables of the STFT frame times or scalars.
    tilt: spectral slope in dB/oct relative to fc (negative = darker above)."""
    f, t, Z = signal.stft(x, SR, nperseg=NF, noverlap=NF - HOP, boundary="zeros", padded=True)
    t = t - (NF / 2) / SR * 0  # frame centre times (scipy pads so t[0] = 0)
    fcv = (fc(t) if callable(fc) else np.full_like(t, fc))[None, :]
    bwv = (bw(t) if callable(bw) else np.full_like(t, bw))[None, :]
    lf = np.log2(np.maximum(f, 10.0))[:, None] - np.log2(fcv)
    G = np.exp(-0.5 * (lf / bwv) ** 2) + floor
    if tilt:
        G = G * 10 ** (tilt * lf / 20)
    _, y = signal.istft(Z * G, SR, nperseg=NF, noverlap=NF - HOP, boundary=True)
    y = y[: len(x)]
    if len(y) < len(x):
        y = np.pad(y, (0, len(x) - len(y)))
    return y


# ---------------------------------------------------------------- envelopes
def env_pts(n, pts, curve=1.0):
    """piecewise envelope through (time_s, amp) points; curve > 1 bends each segment (ease-in)."""
    t = np.arange(n) / SR
    ts = np.array([p[0] for p in pts]); vs = np.array([p[1] for p in pts], float)
    e = np.interp(t, ts, vs)
    return e


def env_ar(n, att, dec_tau, hold=0.0, att_curve=2.0):
    t = np.arange(n) / SR
    a = np.clip(t / max(att, 1e-4), 0, 1) ** att_curve
    d = np.where(t < att + hold, 1.0, np.exp(-(t - att - hold) / dec_tau))
    return a * d


def fade(x, fin=0.002, fout=0.01):
    x = np.array(x, float, copy=True); n = len(x)
    a = int(fin * SR); b = int(fout * SR)
    if a > 0:
        x[:a] *= (np.sin(np.linspace(0, np.pi / 2, a)) ** 2)[:, None] if x.ndim == 2 else np.sin(np.linspace(0, np.pi / 2, a)) ** 2
    if b > 0:
        w = np.cos(np.linspace(0, np.pi / 2, b)) ** 2
        x[n - b:] *= w[:, None] if x.ndim == 2 else w
    return x


# ---------------------------------------------------------------- stereo
def pan_eq(m, p):
    """mono -> stereo, equal-power pan p in [-1, 1] (scalar or per-sample array)"""
    p = np.clip(p, -1, 1); th = (p + 1) * np.pi / 4
    return np.stack([m * np.cos(th), m * np.sin(th)], axis=1) * np.sqrt(2)


def ms_st(m, s, w=1.0):
    """mid/side -> L/R; s should be a decorrelated version of m; w (scalar or per-sample) = width"""
    return np.stack([m + w * s, m - w * s], axis=1) / np.sqrt(1 + 0.0)


def delay(x, d):
    k = int(round(d * SR))
    return np.concatenate([np.zeros(k), x])[: len(x)] if k > 0 else x


def pad_to(x, n):
    if len(x) >= n:
        return x[:n]
    shp = (n - len(x),) + x.shape[1:]
    return np.concatenate([x, np.zeros(shp)])


def mix(*parts):
    n = max(len(p) for p in parts)
    out = np.zeros((n, 2))
    for p in parts:
        if p.ndim == 1:
            p = np.stack([p, p], 1)
        out[: len(p)] += p
    return out


def at(x, t0, n_total=None):
    """place x at t0 seconds (pad front)"""
    k = int(round(t0 * SR))
    shp = (k,) + x.shape[1:]
    y = np.concatenate([np.zeros(shp), x])
    return pad_to(y, n_total) if n_total else y


# ---------------------------------------------------------------- oscillators / modal
def sine_glide(n, f0, f1, tau=None, phase=0.0):
    """frequency glides f0 -> f1 (exponential with time constant tau, or log-linear over n if tau is None)"""
    t = np.arange(n) / SR
    if tau is None:
        f = f0 * (f1 / f0) ** (t / max(t[-1], 1e-9))
    else:
        f = f1 + (f0 - f1) * np.exp(-t / tau)
    return np.sin(2 * np.pi * np.cumsum(f) / SR + phase), f


def modal(n, modes, rng=None, strike=0.0):
    """modes: list of (freq, amp, tau). returns mono; strike adds a 1 ms noise impulse through the modes"""
    t = np.arange(n) / SR
    y = np.zeros(n)
    rng = rng or np.random.default_rng(0)
    for f, a, tau in modes:
        if f >= SR * 0.45:
            continue
        y += a * np.exp(-t / tau) * np.sin(2 * np.pi * f * t + rng.uniform(0, 2 * np.pi))
    if strike:
        k = int(0.0012 * SR)
        y[:k] += strike * rng.standard_normal(k) * np.hanning(2 * k)[k:]
    # soften the very first samples (no click from the sine phase)
    a = int(0.0006 * SR)
    y[:a] *= np.linspace(0, 1, a)
    return y


def sat(x, drive=1.0):
    return np.tanh(drive * x) / np.tanh(drive)


# ---------------------------------------------------------------- reverb (one shared synthetic dark space)
_IR = {}


def space_ir(length=3.2, seed=11):
    """stereo IR of one dark, large, soft space: frequency-dependent T60 (2.2 s lows, 1.5 s mids, 0.5 s at 12 kHz),
    18 ms predelay, a few early reflections, diffuse onset"""
    if (length, seed) in _IR:
        return _IR[(length, seed)]
    rng = np.random.default_rng(seed)
    n = int(length * SR)
    ir = np.zeros((n, 2))
    for ch in range(2):
        x = rng.standard_normal(n)
        f, t, Z = signal.stft(x, SR, nperseg=1024, noverlap=768)
        lf = np.log10(np.maximum(f, 20))
        T60 = np.interp(lf, np.log10([20, 200, 800, 2500, 6000, 12000, 24000]), [2.4, 2.2, 1.6, 1.1, 0.75, 0.5, 0.35])
        dec = np.exp(-6.91 * t[None, :] / T60[:, None]) * (1 - np.exp(-t[None, :] / 0.02))
        _, y = signal.istft(Z * dec, SR, nperseg=1024, noverlap=768)
        y = pad_to(y, n)
        ir[:, ch] = y
    pre = int(0.018 * SR)
    ir = np.concatenate([np.zeros((pre, 2)), ir])[:n]
    for d, g, sgn in [(0.007, 0.5, 1), (0.011, 0.35, -1), (0.017, 0.3, 1), (0.023, 0.22, -1), (0.031, 0.18, 1)]:
        k = int(d * SR)
        ir[k, 0] += g * sgn * 0.08
        ir[int(k * 1.13), 1] += g * sgn * 0.08
    ir = hp(ir, 60)
    ir /= np.sqrt(np.sum(ir ** 2) / 2)
    _IR[(length, seed)] = ir
    return ir


def reverb(x, wet, length=3.2, pre_lp=9000):
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    ir = space_ir()
    if length < 3.2:
        k = int(length * SR); ir = ir[:k] * np.linspace(1, 0, k)[:, None] ** 2
    src = lp(x, pre_lp)
    y = np.zeros((len(x) + len(ir) - 1, 2))
    y[:, 0] = signal.fftconvolve(src[:, 0], ir[:, 0])
    y[:, 1] = signal.fftconvolve(src[:, 1], ir[:, 1])
    out = pad_to(x, len(y)) + wet * y
    return out


def trim_tail(x, thr_db=-72):
    a = np.max(np.abs(x), axis=1)
    pk = a.max() + 1e-12
    idx = np.where(a > pk * 10 ** (thr_db / 20))[0]
    end = min(len(x), (idx[-1] if len(idx) else len(x)) + int(0.01 * SR))
    y = x[:end]
    return fade(y, 0.0, min(0.05, end / SR * 0.2))


# ---------------------------------------------------------------- loudness (BS.1770 K-weighting at 48 kHz)
K_SOS = np.array([[1.53512485958697, -2.69169618940638, 1.19839281085285, 1.0, -1.69065929318241, 0.73248077421585],
                  [1.0, -2.0, 1.0, 1.0, -1.99004745483398, 0.99007225036621]])


def loud_win(x, win=0.1, hop=0.01):
    """max K-weighted loudness (LKFS) over sliding windows of `win` s"""
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    k = signal.sosfilt(K_SOS, x, axis=0)
    e = np.sum(k ** 2, axis=1)
    w = int(win * SR); h = int(hop * SR)
    c = np.concatenate([[0], np.cumsum(e)])
    if len(e) <= w:
        m = c[-1] / w
        return -0.691 + 10 * np.log10(m + 1e-20)
    s = (c[w::h] - c[:-w:h][: len(c[w::h])]) / w
    return -0.691 + 10 * np.log10(np.max(s) + 1e-20)


def write_wav(path, x):
    x = np.clip(x, -1, 1).astype(np.float32)
    wavfile.write(path, SR, x)


def read_wav(path):
    sr, x = wavfile.read(path)
    assert sr == SR, (path, sr)
    kind = x.dtype.kind; bits = x.dtype.itemsize * 8
    x = x.astype(np.float64)
    if kind == "i":
        x = x / float(2 ** (bits - 1))
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    return x
