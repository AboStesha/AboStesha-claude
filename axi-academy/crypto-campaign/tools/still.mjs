// Render single frames to PNG: [Q='mode=green'] node still.mjs <film> <out_prefix> t1 [t2 ...]
import { chromium } from '/opt/node-tools/node_modules/playwright-core/index.mjs';
import path from 'path'; import fs from 'fs';
const [,, film, prefix, ...ts] = process.argv;
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', (e) => console.error('pageerror', String(e))); p.on('console', (m) => { if (m.type() === 'error') console.error('console', m.text()); });
await p.goto('file://' + root + '/src/index.html?film=' + film + (process.env.Q ? '&' + process.env.Q : '')); await p.evaluate(() => window.ready);
for (const t of ts) {
  const url = await p.evaluate((tt) => { window.renderAt(tt); return document.getElementById('c').toDataURL('image/png'); }, +t);
  const out = `${prefix}_${(+t).toFixed(2)}.png`; fs.writeFileSync(out, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64')); console.log('wrote', out);
}
await br.close();
