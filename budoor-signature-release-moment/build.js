// Usage: node build.js index.html out.pdf [shotsDir]
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
(async () => {
  const [,, src, out, shots] = process.argv;
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await pg.goto('file://' + path.resolve(src), { waitUntil: 'networkidle' });
  await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(2000);
  const fontsOk = await pg.evaluate(() => ['Inter','Cormorant Garamond','Michroma'].map(f => f + ':' + document.fonts.check('16px "' + f + '"')));
  console.log('fonts', fontsOk.join(' '));
  await pg.emulateMedia({ media: 'print' });
  await pg.pdf({ path: out, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  const n = await pg.evaluate(() => document.querySelectorAll('.page').length);
  if (shots) { fs.mkdirSync(shots, { recursive: true });
    for (let i = 0; i < n; i++) {
      await pg.evaluate(i => document.querySelectorAll('.page')[i].scrollIntoView(), i);
      await pg.screenshot({ path: `${shots}/p${String(i+1).padStart(2,'0')}.jpg`, clip: { x: 0, y: 0, width: 1920, height: 1080 }, type: 'jpeg', quality: 72 });
    } }
  await b.close(); console.log('pages', n);
})();
