"""QA for one delivered sting: streams, loudness, every frame on per-second sheets, holds, final frame vs the client image.
Usage: python3 qa.py video.mp4 ref_final_frame.(webp|png) outdir"""
import json, subprocess, sys, os
import numpy as np
from PIL import Image
vid, ref, out = sys.argv[1:4]; os.makedirs(out, exist_ok=True); tag = os.path.splitext(os.path.basename(vid))[0]
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
# decode all frames small (gray) for holds + per-second sheets
W, H = 192, 108
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', vid, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3); n = len(fr)
d = np.abs(np.diff(fr.astype(np.int16), axis=0)).mean((1, 2, 3))
holds, run_s = [], None
for i, x in enumerate(d):
    if x < 0.05 and run_s is None: run_s = i
    if x >= 0.05 and run_s is not None: holds.append((run_s, i)); run_s = None
if run_s is not None: holds.append((run_s, n - 1))
rep['frames_decoded'] = n; rep['identical_runs'] = [h for h in holds if h[1] - h[0] >= 3]
for s in range((n + 59) // 60):
    S = Image.new('RGB', (W * 10, H * 6))
    for j in range(60):
        k = s * 60 + j
        if k >= n: break
        S.paste(Image.fromarray(fr[k]), ((j % 10) * W, (j // 10) * H))
    S.save(f'{out}/{tag}_s{s}.jpg', quality=85)
# final frame vs the client image
last = subprocess.run(['ffmpeg', '-v', 'error', '-sseof', '-0.02', '-i', vid, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True).stdout
open(f'{out}/{tag}_last.png', 'wb').write(last)
L = np.asarray(Image.open(f'{out}/{tag}_last.png').convert('RGB')).astype(np.float64)
R = np.asarray(Image.open(ref).convert('RGB').resize((1920, 1080), Image.LANCZOS)).astype(np.float64)
dd = np.abs(L - R).mean(2)
rep['final_vs_client'] = {'mean_abs': round(float(dd.mean()), 2), 'p99': round(float(np.percentile(dd, 99)), 1), 'logo_band_mean_abs': round(float(dd[340:740, 300:1720].mean()), 2)}
json.dump(rep, open(f'{out}/{tag}_qa.json', 'w'), indent=1); print(json.dumps(rep, indent=1))
