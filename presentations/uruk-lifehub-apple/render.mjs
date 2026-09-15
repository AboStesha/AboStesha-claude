// Renders a deck HTML file to a 1920x1080 PDF plus per-slide PNG previews.
// usage: node render.mjs <input.html> <output.pdf> <previewDir> [--png]
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const [input = 'deck.html', output = 'deck.pdf', previewDir = 'preview'] = process.argv.slice(2).filter(a => !a.startsWith('--'));
const previews = process.argv.includes('--png');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(here, input), { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

const audit = await page.evaluate(() => [...document.querySelectorAll('.slide')].map((s, i) => {
  const r = s.getBoundingClientRect();
  let maxBottom = 0;
  s.querySelectorAll('*').forEach(el => { const b = el.getBoundingClientRect(); if (b.width && b.height && !el.closest('.bg') && !el.closest('.glow')) maxBottom = Math.max(maxBottom, b.bottom - r.top); });
  return `${i + 1}:${Math.round(maxBottom)}`;
}));
console.log('content bottoms (limit 1040):', audit.join(' '));

if (previews) {
  fs.mkdirSync(path.join(here, previewDir), { recursive: true });
  const n = await page.locator('.slide').count();
  for (let i = 0; i < n; i++) await page.locator('.slide').nth(i).screenshot({ path: path.join(here, previewDir, `slide-${i + 1}.png`) });
}
await page.pdf({ path: path.join(here, output), width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log('done', output);
