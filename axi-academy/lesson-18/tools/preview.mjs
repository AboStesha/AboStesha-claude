// Render selected times to PNGs and a contact sheet. Usage: node preview.mjs out_dir t1 t2 ...
import { chromium } from 'playwright-core';
import path from 'path'; import fs from 'fs'; import { execFileSync } from 'child_process';
const [,, out, ...ts] = process.argv;
fs.mkdirSync(out, { recursive: true });
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = []; p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto('file://' + root + '/src/index.html'); await p.evaluate(() => window.ready);
const files = [];
for (const t of ts) {
  await p.evaluate((t) => window.renderAt(t), parseFloat(t));
  const f = `${out}/f_${String(t).padStart(7, '0')}.png`; await p.screenshot({ path: f }); files.push(f);
}
if (errs.length) console.log('ERRORS:\n' + errs.slice(0, 5).join('\n'));
await b.close();
if (files.length > 1) {
  const cols = Math.min(4, files.length);
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...files.flatMap((f) => ['-i', f]), '-filter_complex',
    files.map((_, i) => `[${i}:v]scale=640:-1[v${i}]`).join(';') + ';' + files.map((_, i) => `[v${i}]`).join('') + `xstack=inputs=${files.length}:layout=` +
    files.map((_, i) => `${(i % cols) * 640}_${Math.floor(i / cols) * 360}`).join('|') + `:fill=black`, `${out}/sheet.png`]);
}
console.log('ok', files.length);
