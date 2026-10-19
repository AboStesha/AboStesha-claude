// Frame-accurate render: N headless Chromium workers draw t = i/fps, pipe JPEG frames into ffmpeg segments,
// then concat and mux with the mixed soundtrack.
// Usage: node render.mjs --fps 60 --workers 3 --audio mix.wav --out final.mp4 [--from 0 --to 252.1]
import { chromium } from 'playwright-core';
import { spawn, execFileSync } from 'child_process';
import path from 'path'; import fs from 'fs'; import vm from 'vm';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? a.concat([[v.slice(2), arr[i + 1]]]) : a), []));
const fps = +(args.fps || 60), workers = +(args.workers || 3);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const work = args.work || path.join(root, 'build'); fs.mkdirSync(work, { recursive: true });

// total duration from the timeline
const ctxv = { console }; ctxv.window = ctxv; ctxv.globalThis = ctxv; vm.createContext(ctxv);
for (const f of ['assets/brand_paths.js', 'src/engine.js', 'src/fx.js', 'src/words.js', 'src/film.js', 'src/kit.js', 'src/brand.js', 'src/l8core.js', 'src/l8shot.js'])
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctxv);
const T0 = +(args.from || 0), T1 = +(args.to || ctxv.FILM.TOTAL);
const f0 = Math.round(T0 * fps), f1 = Math.round(T1 * fps); const N = f1 - f0;
console.log(`render ${N} frames @${fps}fps (${T0}s → ${T1}s) with ${workers} workers`);

async function worker(k, a, b) {
  const seg = path.join(work, `seg_${k}.mp4`);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '15', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-g', String(fps * 2), '-r', String(fps), seg], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res(seg) : rej(new Error('ffmpeg ' + c)))));
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
  const p = await br.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', (e) => console.error('pageerror', k, String(e)));
  await p.goto('file://' + root + '/src/index.html'); await p.evaluate(() => window.ready);
  const t0 = Date.now();
  for (let i = a; i < b; i++) {
    const url = await p.evaluate((t) => { window.renderAt(t); return document.getElementById('c').toDataURL('image/jpeg', 0.96); }, i / fps);
    const buf = Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if ((i - a) % 600 === 0) console.log(`w${k}: ${i - a}/${b - a} frames, ${((Date.now() - t0) / Math.max(1, i - a)).toFixed(1)} ms/frame`);
  }
  ff.stdin.end(); await br.close(); return done;
}

const per = Math.ceil(N / workers); const jobs = [];
for (let k = 0; k < workers; k++) { const a = f0 + k * per, b = Math.min(f1, a + per); if (a < b) jobs.push(worker(k, a, b)); }
const segs = await Promise.all(jobs);
const list = path.join(work, 'segments.txt'); fs.writeFileSync(list, segs.map((s) => `file '${s}'`).join('\n'));
const out = args.out || path.join(work, 'final.mp4');
const ffArgs = ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list];
if (args.audio) ffArgs.push('-ss', String(T0), '-t', String(T1 - T0), '-i', args.audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '320k');
ffArgs.push('-c:v', 'copy', '-movflags', '+faststart', out);
execFileSync('ffmpeg', ffArgs, { stdio: 'inherit' });
console.log('wrote', out);
