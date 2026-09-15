// Renders deck.html to deck.pdf (1920x1080 pages) and per-slide PNG previews.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(here, 'deck.html'), { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

// Overflow audit: any slide whose content exceeds the 1080px canvas.
const audit = await page.evaluate(() => [...document.querySelectorAll('.slide')].map((s, i) => {
  const r = s.getBoundingClientRect();
  let maxBottom = 0, maxRight = 0;
  s.querySelectorAll('*').forEach(el => { const b = el.getBoundingClientRect(); if (b.width && b.height) { maxBottom = Math.max(maxBottom, b.bottom - r.top); maxRight = Math.max(maxRight, b.right - r.left); } });
  return { slide: i + 1, contentBottom: Math.round(maxBottom), contentRight: Math.round(maxRight) };
}));
console.log(JSON.stringify(audit));

const previews = process.argv.includes('--png');
if (previews) {
  const n = await page.locator('.slide').count();
  for (let i = 0; i < n; i++) {
    await page.locator('.slide').nth(i).screenshot({ path: path.join(here, 'preview', `slide-${i + 1}.png`) });
  }
}
await page.pdf({ path: path.join(here, 'URUK_LIFEHUB_Executive_Proposal_Apple.pdf'), width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log('done');
