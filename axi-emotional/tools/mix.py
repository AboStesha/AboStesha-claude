#!/usr/bin/env python3
"""mix.py — comp events + music + SFX kit → mastered stereo WAV.

  python3 tools/mix.py reel/comp.html --music audio/reel_music.wav --w 1080 --h 1920 --lufs -14 --tp -1.5 --out audio/reel_mix.wav
  python3 tools/mix.py explainer/comp.html --music audio/bed_music.wav --w 1920 --h 1080 --lufs -20 --tp -3 --fade 3 --out audio/explainer_mix.wav

Reads window.__events() → {T, events:[{t, kind, pan, v}]} from the composition (Playwright), places one SFX per
event from audio/sfx/ (kinds: whoosh, impact, tick, roll, glitch, riser; unknown kinds are skipped), merges events
closer than 40 ms, ducks the music 3–5 dB around impacts, trims/fades the music to T, masters to the target LUFS with
a true-peak-safe limiter (4× oversampled peak)."""
import argparse, asyncio, json, os
import numpy as np, soundfile as sf, pyloudnorm as pyln
from scipy.signal import resample_poly
from scipy.ndimage import minimum_filter1d
from playwright.async_api import async_playwright

SR = 48000
H = os.path.dirname(os.path.abspath(__file__)); SFX = os.path.join(H, '..', 'audio', 'sfx')
KIT = {'whoosh': ['whoosh_short.wav', 'whoosh_long.wav'], 'impact': ['impact_hit.wav'], 'tick': ['tick.wav'],
       'roll': ['counter_roll.wav'], 'glitch': ['glitch.wav'], 'riser': ['riser_short.wav']}
GAIN = {'whoosh': -9, 'impact': -6, 'tick': -14, 'roll': -12, 'glitch': -12, 'riser': -10}
# the explainer's event kinds → a kit sound and a gain offset (dB)
ALIAS = {'land': ('impact', -8), 'x': ('glitch', -2), 'press': ('tick', 0), 'flip': ('whoosh', -6), 'coin': ('tick', 2),
         'unlock': ('tick', 2), 'fill': ('riser', -6), 'mirror': ('whoosh', -6)}


async def events(comp, w, h):
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': w, 'height': h})
        await pg.goto('file://' + os.path.abspath(comp)); await pg.evaluate('window.__ready')
        ev = await pg.evaluate('(() => { const e = window.__events ? window.__events() : []; return Array.isArray(e) ? {T: window.__meta.dur, events: e} : e; })()')
        await b.close(); return ev


def load(path):
    x, sr = sf.read(path, always_2d=True, dtype='float32')
    if sr != SR: x = resample_poly(x, SR, sr, axis=0).astype(np.float32)
    if x.shape[1] == 1: x = np.repeat(x, 2, 1)
    return x[:, :2]


def pan2(x, pan):
    a = (np.clip(pan, -1, 1) + 1) * np.pi / 4
    return np.stack([x[:, 0] * np.cos(a) * 1.414, x[:, 1] * np.sin(a) * 1.414], 1) * 0.707


def true_peak(x):
    return np.abs(resample_poly(x, 4, 1, axis=0)).max()


def limit(x, ceiling_db):
    """Look-ahead brickwall on the 4x-oversampled peak envelope, smoothed (attack ~3 ms, release ~60 ms)."""
    c = 10 ** (ceiling_db / 20) * 0.97
    for _ in range(6):
        up = np.abs(resample_poly(x, 4, 1, axis=0)).max(1)
        env = up[:len(up) // 4 * 4].reshape(-1, 4).max(1)
        env = np.pad(env, (0, len(x) - len(env)), mode='edge')
        g = np.minimum(1.0, c / np.maximum(env, 1e-9))
        k = int(SR * 0.003)
        gm = minimum_filter1d(g, size=k + 1, origin=-(k // 2))  # look-ahead min over the next k samples
        rel = np.exp(-1 / (SR * 0.06)); out = np.empty_like(gm); cur = 1.0
        for i in range(len(gm)):
            cur = gm[i] if gm[i] < cur else gm[i] + (cur - gm[i]) * rel
            out[i] = cur
        x = x * out[:, None]
        if true_peak(x) <= 10 ** (ceiling_db / 20): break
    return x


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('comp'); ap.add_argument('--music', required=True); ap.add_argument('--out', required=True)
    ap.add_argument('--w', type=int, default=1920); ap.add_argument('--h', type=int, default=1080)
    ap.add_argument('--lufs', type=float, default=-14); ap.add_argument('--tp', type=float, default=-1.5)
    ap.add_argument('--fade', type=float, default=0.0); ap.add_argument('--sfx-db', type=float, default=0.0)
    ap.add_argument('--duck-db', type=float, default=4.0); ap.add_argument('--stem', default=None, help='also write the SFX-only stem here')
    a = ap.parse_args()
    ev = asyncio.run(events(a.comp, a.w, a.h)); T = float(ev['T']); N = int(round(T * SR))
    music = load(a.music)[:N]
    if len(music) < N: music = np.pad(music, ((0, N - len(music)), (0, 0)))
    if a.fade > 0:
        k = int(a.fade * SR); music[-k:] *= np.linspace(1, 0, k)[:, None] ** 2
    sfx = np.zeros((N, 2), np.float32); duck = np.ones(N, np.float32)
    evs = sorted(ev['events'], key=lambda e: e['t']); last = {}; placed = 0
    for i, e in enumerate(evs):
        kind = e.get('kind') or e.get('type'); t = float(e['t']); off = 0
        if kind in ALIAS: kind, off = ALIAS[kind]
        if kind not in KIT or t < 0 or t >= T: continue
        if t - last.get(kind, -9) < 0.04: continue
        last[kind] = t
        files = KIT[kind]; f = files[i % len(files)] if kind != 'whoosh' else files[1 if e.get('v', 0.5) > 0.7 else 0]
        path = os.path.join(SFX, f)
        if not os.path.exists(path): continue
        s = load(path) * 10 ** ((GAIN[kind] + off + a.sfx_db) / 20) * float(np.clip(e.get('v', 0.6), 0.15, 1.0)) / 0.6
        s = pan2(s, float(e.get('pan', 0)) * 0.6)
        i0 = int(t * SR) - (int(0.08 * SR) if kind == 'whoosh' else 0); i0 = max(0, i0); i1 = min(N, i0 + len(s))
        sfx[i0:i1] += s[:i1 - i0]; placed += 1
        if kind == 'whoosh':
            d0 = max(0, int(t * SR) - int(0.1 * SR)); d1 = min(N, int(t * SR) + int(0.2 * SR))
            duck[d0:d1] = np.minimum(duck[d0:d1], 10 ** (-1.5 / 20))
        if kind == 'impact':
            d0 = max(0, int(t * SR) - int(0.01 * SR)); d1 = min(N, int(t * SR) + int(0.35 * SR))
            env = 10 ** (-a.duck_db / 20 * np.sin(np.linspace(0, np.pi, d1 - d0)) ** 0.5)
            duck[d0:d1] = np.minimum(duck[d0:d1], env)
    mix = music * duck[:, None] + sfx
    if a.stem: sf.write(a.stem, sfx, SR, subtype='PCM_24')
    meter = pyln.Meter(SR)
    l0 = meter.integrated_loudness(mix)
    mix = mix * 10 ** ((a.lufs - l0) / 20)
    mix = limit(mix, a.tp)
    l1 = meter.integrated_loudness(mix)
    sf.write(a.out, mix, SR, subtype='PCM_24')
    print(json.dumps({'events': len(evs), 'placed': placed, 'T': T, 'lufs_in': round(l0, 2), 'lufs_out': round(l1, 2),
                      'true_peak_db': round(20 * np.log10(true_peak(mix) + 1e-12), 2)}))


if __name__ == '__main__':
    main()
