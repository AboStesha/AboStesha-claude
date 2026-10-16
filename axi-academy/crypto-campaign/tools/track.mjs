// Export film 5's presenter window, frame by frame: node track.mjs out.csv [fps]
// Columns: frame, time (s), x, y (top-left, px in the 1080×1920 frame), w, h, opacity. The window only translates.
import { chromium } from '/opt/node-tools/node_modules/playwright-core/index.mjs';
import path from 'path'; import fs from 'fs';
const [,, out, fpsArg] = process.argv; const fps = +(fpsArg || 60);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + root + '/src/index.html?film=c5'); await p.evaluate(() => window.ready);
const rows = await p.evaluate((fps) => { const r = []; const n = Math.round(FILM.duration * fps); for (let i = 0; i < n; i++) { const t = i / fps, w = window.WINDOW_TRACK(t); r.push([i, t.toFixed(4), w.x.toFixed(2), w.y.toFixed(2), 640, 880, w.a.toFixed(3)].join(',')); } return r; }, fps);
fs.writeFileSync(out, 'frame,time_s,x,y,w,h,opacity\n' + rows.join('\n') + '\n'); console.log('wrote', out, rows.length, 'rows');
await br.close();
