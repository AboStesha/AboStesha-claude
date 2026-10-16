"""QA for one delivered ident: streams, loudness, every frame on per-second sheets, held runs, and the last frame's
logo compared with the official file placed at the final position.
Usage: python3 qa.py video.mp4 ref/logo.webp outdir white|ink"""
import json, subprocess, sys, os
import numpy as np
from PIL import Image
vid, ref, out, mode = sys.argv[1:5]; os.makedirs(out, exist_ok=True); tag = os.path.splitext(os.path.basename(vid))[0]
S, OX, OY, W, H = 0.34, 200.0, 910 - 1453 / 2 * 0.34, 1080, 1920
def run(*a): return subprocess.run(a, capture_output=True, text=True)
pr = json.loads(run('ffprobe', '-v', 'error', '-count_frames', '-show_streams', '-show_format', '-of', 'json', vid).stdout)
v = [s for s in pr['streams'] if s['codec_type'] == 'video'][0]; a = [s for s in pr['streams'] if s['codec_type'] == 'audio'][0]
rep = {'file': os.path.basename(vid), 'size_mb': round(int(pr['format']['size']) / 1e6, 2), 'duration': float(pr['format']['duration']),
       'video': {k: v.get(k) for k in ('codec_name', 'profile', 'width', 'height', 'pix_fmt', 'r_frame_rate', 'avg_frame_rate', 'nb_read_frames', 'color_space', 'color_primaries', 'color_transfer', 'color_range')},
       'audio': {k: a.get(k) for k in ('codec_name', 'sample_rate', 'channels', 'bit_rate', 'duration')}}
eb = run('ffmpeg', '-hide_banner', '-nostats', '-i', vid, '-map', '0:a', '-af', 'ebur128=peak=true', '-f', 'null', '-').stderr
summ = eb[eb.rfind('Summary:'):]
def grab(key):
    for ln in summ.splitlines():
        if ln.strip().startswith(key): return float(ln.split(':')[1].split()[0])
rep['audio']['lufs_i'] = grab('I:'); rep['audio']['true_peak_dbtp'] = grab('Peak:'); rep['audio']['lra'] = grab('LRA:')
# every frame, small, for held runs and per-second sheets
w, h = 108, 192
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', vid, '-vf', f'scale={w}:{h}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3); n = len(fr)
d = np.abs(np.diff(fr.astype(np.int16), axis=0)).mean((1, 2, 3))
holds, rs = [], None
for i, x in enumerate(d):
    if x < 0.05 and rs is None: rs = i
    if x >= 0.05 and rs is not None: holds.append((rs, i)); rs = None
if rs is not None: holds.append((rs, n - 1))
rep['frames_decoded'] = n; rep['identical_runs'] = [hh for hh in holds if hh[1] - hh[0] >= 3]
for s in range((n + 59) // 60):
    Sh = Image.new('RGB', (w * 10, h * 6))
    for j in range(60):
        k = s * 60 + j
        if k >= n: break
        Sh.paste(Image.fromarray(fr[k]), ((j % 10) * w, (j // 10) * h))
    Sh.save(f'{out}/{tag}_s{s}.jpg', quality=85)
# the last frame's logo against the official file at the final placement
last = subprocess.run(['ffmpeg', '-v', 'error', '-sseof', '-0.02', '-i', vid, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
open(f'{out}/{tag}_last.png', 'wb').write(last)
Lf = np.asarray(Image.open(f'{out}/{tag}_last.png').convert('L')).astype(np.float64) / 255
A = Image.open(ref).convert('RGBA').split()[3].crop((0, 0, 2000, 1453))
lw, lh = round(2000 * S), round(1453 * S); x0, y0 = round(OX), round(OY)
R = np.asarray(A.resize((lw, lh), Image.LANCZOS)).astype(np.float64) / 255
box = Lf[y0:y0 + lh, x0:x0 + lw]
bg = np.median(np.concatenate([Lf[y0 - 40:y0 - 10, x0:x0 + lw].ravel(), Lf[y0 + lh + 10:y0 + lh + 40, x0:x0 + lw].ravel()]))
fg = 1.0 if mode == 'white' else np.percentile(box, 0.5)
cov = np.clip((box - bg) / (fg - bg), 0, 1)                    # estimated logo coverage per pixel
mR, mF = R > 0.5, cov > 0.5
rep['logo_vs_official'] = {'iou': round(float((mR & mF).sum() / (mR | mF).sum()), 4), 'mean_abs_coverage_diff': round(float(np.abs(cov - R).mean()), 4),
                           'bg_level': round(float(bg), 3), 'logo_level': round(float(fg), 3)}
json.dump(rep, open(f'{out}/{tag}_qa.json', 'w'), indent=1); print(json.dumps({k: rep[k] for k in ('size_mb', 'frames_decoded', 'identical_runs', 'logo_vs_official')}), rep['audio']['lufs_i'], rep['audio']['true_peak_dbtp'])
