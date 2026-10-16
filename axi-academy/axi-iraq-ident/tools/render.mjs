// Frame-accurate render of one ident: N headless Chromium workers draw t = i/fps (lossless PNG frames),
// pipe them into ffmpeg segments, then concat and mux the soundtrack.
// Usage: node render.mjs --film a --audio audio/ident_a.wav --out out.mp4 [--fps 60 --workers 4 --frames 240 --work dir --crf 12]
import { chromium } from '/opt/node-tools/node_modules/playwright-core/index.mjs';
import { spawn, execFileSync } from 'child_process';
import path from 'path'; import fs from 'fs';
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? a.concat([[v.slice(2), arr[i + 1]]]) : a), []));
const fps = +(args.fps || 60), workers = +(args.workers || 4), frames = +(args.frames || 240), film = args.film || 'a', crf = String(args.crf || 14);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const work = args.work || path.join(root, 'build', film); fs.mkdirSync(work, { recursive: true });
console.log(`render film ${film}: ${frames} frames @${fps}fps with ${workers} workers`);
async function worker(k, a, b) {
  const seg = path.join(work, `seg_${k}.mp4`);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
    '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', crf, '-tune', 'film',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', '-g', String(fps), '-r', String(fps), seg], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res(seg) : rej(new Error('ffmpeg ' + c)))));
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
  const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', (e) => console.error('pageerror', k, String(e)));
  await p.goto('file://' + root + '/src/index.html?film=' + film); await p.evaluate(() => window.ready);
  const t0 = Date.now();
  for (let i = a; i < b; i++) {
    const url = await p.evaluate((t) => { window.renderAt(t); return document.getElementById('c').toDataURL('image/png'); }, i / fps);
    const buf = Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if ((i - a) % 25 === 0) console.log(`w${k}: ${i - a}/${b - a} frames, ${((Date.now() - t0) / Math.max(1, i - a)).toFixed(0)} ms/frame`);
  }
  ff.stdin.end(); await br.close(); return done;
}
const per = Math.ceil(frames / workers); const jobs = [];
for (let k = 0; k < workers; k++) { const a = k * per, b = Math.min(frames, a + per); if (a < b) jobs.push(worker(k, a, b)); }
const segs = await Promise.all(jobs);
const list = path.join(work, 'segments.txt'); fs.writeFileSync(list, segs.map((s) => `file '${s}'`).join('\n'));
const out = args.out || path.join(work, 'final.mp4');
const ffArgs = ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list];
if (args.audio) ffArgs.push('-i', args.audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-t', String(frames / fps));
ffArgs.push('-c:v', 'copy', '-movflags', '+faststart', out);
execFileSync('ffmpeg', ffArgs, { stdio: 'inherit' });
console.log('wrote', out);
