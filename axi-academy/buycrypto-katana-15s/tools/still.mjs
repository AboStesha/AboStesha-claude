// Render single frames of src/index.html to PNG through its hfPage contract: node still.mjs <out_prefix> t1 [t2 ...]
import { chromium } from '/opt/node-tools/node_modules/playwright-core/index.mjs';
import path from 'path'; import fs from 'fs';
const [,, prefix, ...ts] = process.argv;
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', (e) => console.error('pageerror', String(e))); p.on('console', (m) => { if (m.type() === 'error') console.error('console', m.text()); });
await p.goto('file://' + root + '/src/index.html'); await p.evaluate(() => window.hfPage.ready);
for (const t of ts) {
  const t0 = Date.now();
  const url = await p.evaluate((tt) => { window.hfPage.render(tt, Math.round(tt * 60)); return document.getElementById('c').toDataURL('image/png'); }, +t);
  const out = `${prefix}_${(+t).toFixed(2)}.png`; fs.writeFileSync(out, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64')); console.log('wrote', out, Date.now() - t0, 'ms');
}
await br.close();
