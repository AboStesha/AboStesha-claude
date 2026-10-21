import { chromium } from 'playwright';
const [,, mode = 'png', only = ''] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('console', m => console.log('console:', m.text())); p.on('pageerror', e => console.log('PAGEERR', e.message));
await p.goto('file://' + process.cwd() + '/index.html', { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(500);
// overflow check: elements spilling outside their slide or footer overlap
const issues = await p.evaluate(() => {
  const out = [];
  document.querySelectorAll('.slide').forEach((s, i) => {
    const sr = s.getBoundingClientRect();
    s.querySelectorAll('*').forEach(el => {
      if (el.closest('svg') && el.tagName !== 'svg') return;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      if (r.bottom > sr.bottom - 70 && !el.closest('.foot') && !el.closest('.src') && !el.closest('.cover-art') && el.className !== 'foot') out.push(`slide ${i + 1}: ${el.tagName}.${el.className} bottom=${Math.round(r.bottom - sr.top)}`);
      if (r.right > sr.right + 1 || r.left < sr.left - 1) out.push(`slide ${i + 1}: ${el.tagName}.${el.className} x-overflow ${Math.round(r.left - sr.left)}..${Math.round(r.right - sr.left)}`);
      if (el.scrollHeight > el.clientHeight + 2 && getComputedStyle(el).overflow === 'hidden' && !el.classList.contains('slide')) out.push(`slide ${i + 1}: ${el.tagName}.${el.className} clipped ${el.scrollHeight}>${el.clientHeight}`);
    });
  });
  return out;
});
console.log(issues.slice(0, 60).join('\n'));
if (mode === 'png' || mode === 'both') {
  const n = await p.locator('.slide').count();
  for (let i = 0; i < n; i++) {
    if (only && !only.split(',').includes(String(i + 1))) continue;
    await p.locator('.slide').nth(i).screenshot({ path: `out/s${String(i + 1).padStart(2, '0')}.png` });
  }
}
if (mode === 'pdf' || mode === 'both') {
  await p.pdf({ path: 'out/deck.pdf', width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
}
await b.close();
