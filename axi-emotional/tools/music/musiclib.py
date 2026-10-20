"""musiclib.py - shared helpers: kick attack detection and grid fitting."""
import numpy as np
from scipy import signal


def lowband(y, sr, f=150.0):
    return signal.sosfiltfilt(signal.butter(4, f, 'lowpass', fs=sr, output='sos'), y)


def detect_kicks(y, sr, min_gap=0.2, rel_height=0.25, f=150.0):
    """Kick attack-start times (s).

    1. low band (<150 Hz) Hilbert envelope (smoothed, zero-phase), its positive slope
    2. slope peaks above rel_height x the 99.5th percentile, at least min_gap apart
    3. each peak is walked back to the attack start: the last sample, within 45 ms before the slope peak,
       where the envelope sat below 12% of the local peak level (the kick body max within 60 ms after).
    """
    lo = lowband(y, sr, f)
    env = np.abs(signal.hilbert(lo))
    env = signal.sosfiltfilt(signal.butter(2, 120, 'lowpass', fs=sr, output='sos'), env)
    d = np.maximum(np.diff(env, prepend=env[0]), 0)
    d = signal.sosfiltfilt(signal.butter(2, 250, 'lowpass', fs=sr, output='sos'), d)
    thr = rel_height * np.percentile(d, 99.5)
    pk, _ = signal.find_peaks(d, distance=int(min_gap * sr), height=thr)
    starts, levels = [], []
    for p in pk:
        a = max(0, p - int(0.045 * sr))
        b = min(len(env), p + int(0.06 * sr))
        peak = env[p:b].max()
        floor_ = env[a:p]
        below = np.where(floor_ < 0.12 * peak)[0]
        s = a + below[-1] if len(below) else a
        starts.append(s / sr)
        levels.append(float(peak))
    return np.array(starts), np.array(levels)


def fit_grid(times, beat, phase, tol=0.03):
    """Least-squares t = t0 + n*beat over the times within tol of the guessed grid. Returns t0, beat, n, residuals, mask."""
    n = np.round((times - phase) / beat)
    r = times - (phase + n * beat)
    m = np.abs(r) < tol
    A = np.vstack([np.ones(m.sum()), n[m]]).T
    (t0, b), *_ = np.linalg.lstsq(A, times[m], rcond=None)
    res = times - (t0 + n * b)
    return t0, b, n, res, m


def kick_template(y, sr, t_attack, pre=0.002, length=0.045, f=200.0):
    """Low-passed kick waveform starting `pre` before a known attack (for matched filtering)."""
    lo = lowband(y, sr, f)
    a = int(round((t_attack - pre) * sr))
    return lo[a:a + int(length * sr)].copy(), pre


def matched_kicks(y, sr, template, pre, thr=0.6, min_gap=0.2, f=200.0):
    """Kick attack times from the normalised cross-correlation of the low band with a kick template.

    Returns (times, ncc_peak). A time is the template's attack position at the best lag, refined to
    sub-sample precision by a parabola through the three samples around each NCC peak.
    """
    lo = lowband(y, sr, f)
    L = len(template)
    tpl = (template - template.mean()) / (np.linalg.norm(template - template.mean()) + 1e-12)
    num = signal.fftconvolve(lo, tpl[::-1], mode='valid')                     # sum lo[n+k]*tpl[k]
    c1 = np.cumsum(np.r_[0.0, lo])
    c2 = np.cumsum(np.r_[0.0, lo ** 2])
    s1 = c1[L:] - c1[:-L]
    s2 = c2[L:] - c2[:-L]
    den = np.sqrt(np.maximum(s2 - s1 ** 2 / L, 1e-12))
    ncc = num / den
    pk, props = signal.find_peaks(ncc, height=thr, distance=int(min_gap * sr))
    times = []
    for p in pk:
        if 0 < p < len(ncc) - 1:
            a, b, c = ncc[p - 1], ncc[p], ncc[p + 1]
            dlt = 0.5 * (a - c) / (a - 2 * b + c) if (a - 2 * b + c) != 0 else 0.0
        else:
            dlt = 0.0
        times.append((p + dlt) / sr + pre)
    return np.array(times), ncc[pk]
