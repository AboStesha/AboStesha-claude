// Axi Academy YouTube thumbnails: generated art + exact Arabic type, the official lockup and the lesson tag.
// node compose.mjs <jobs.json> <assets_dir> [only_id]
// job: { id, bg, design: 'A'|'B', theme: 'light'|'dark', title: ['ما هو', '{الفوركس؟}'], term, lesson, course, vs, out }
//   {word} = Axi red · [word] = mint (gains only) · design A = title card on the right · design B = big type on the left
import fs from 'fs';
import path from 'path';

const PW = process.env.PW_MODULE || 'playwright';
const { chromium } = await import(PW);
const [, , jobsFile, assets, only] = process.argv;
const jobs = JSON.parse(fs.readFileSync(jobsFile, 'utf8')).filter((j) => !only || j.id === only);
const A = (f) => 'file://' + path.resolve(assets, f);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const marks = (s) => esc(s).replace(/\{([^}]+)\}/g, '<span class="red">$1</span>').replace(/\[([^\]]+)\]/g, '<span class="mint">$1</span>');

function html(j) {
  const lines = j.vs
    ? `<div class="ln">${marks(j.title[0])}</div><div class="vs"><span>VS</span></div><div class="ln">${marks(j.title[1])}</div>`
    : j.title.map((t) => `<div class="ln">${marks(t)}</div>`).join('');
  const term = j.term ? `<div class="term">${esc(j.term)}</div>` : '';
  const tag = `<div class="tag"><span class="pill red-pill">الدرس ${j.lesson}</span><span class="pill course">${esc(j.course)}</span></div>`;
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
  @font-face { font-family: AR; src: url(${A('ReadexPro.ttf')}); font-weight: 160 700; }
  @font-face { font-family: NUM; src: url(${A('Inter.ttf')}); font-weight: 100 900; unicode-range: U+0020-007E; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1920px; height: 1080px; overflow: hidden; background: #090A0D; }
  body { font-family: NUM, AR; position: relative; }
  #bg { position: absolute; inset: 0; width: 1920px; height: 1080px; object-fit: cover; }
  .red { color: #E4002E; }
  .mint { color: #5EE0BB; }
  .B.theme-light .mint { color: #090A0D; background: linear-gradient(transparent 24%, #5EE0BB 24%, #5EE0BB 93%, transparent 93%); padding: 0 .14em; box-decoration-break: clone; }
  .tag { display: flex; gap: 14px; align-items: center; direction: rtl; }
  .pill { font-family: NUM, AR; font-size: 36px; font-weight: 600; height: 66px; line-height: 66px; padding: 0 28px; border-radius: 33px; white-space: nowrap; }
  .red-pill { background: #E4002E; color: #fff; }
  .course { font-weight: 500; }
  .theme-dark .course { background: rgba(255,255,255,.12); color: #fff; box-shadow: inset 0 0 0 2px rgba(255,255,255,.28); backdrop-filter: blur(18px); }
  .theme-light .course { background: rgba(255,255,255,.78); color: #090A0D; box-shadow: inset 0 0 0 2px rgba(9,10,13,.10); backdrop-filter: blur(18px); }
  .title { font-family: NUM, AR; font-weight: 700; line-height: 1.24; letter-spacing: 0; white-space: nowrap; }
  .ln { display: block; }
  .term { font-family: NUM; font-weight: 600; letter-spacing: .02em; direction: ltr; text-align: right; margin-top: 10px; }
  .vs { margin: 4px 0 14px; }
  .vs span { display: inline-block; font-family: NUM; font-weight: 800; color: #fff; background: #E4002E; border-radius: 50%; width: 1.36em; height: 1.36em; line-height: 1.36em; text-align: center; font-size: .78em; letter-spacing: -.02em; }
  /* design A: dark glass title card on the right, the persona on the left */
  .A #col { position: absolute; right: 76px; top: 0; height: 1080px; display: flex; flex-direction: column; justify-content: center; align-items: flex-end; gap: 26px; padding-top: 70px; }
  .A .card { position: relative; background: rgba(20,22,26,.74); backdrop-filter: blur(22px); border-radius: 18px; box-shadow: inset 0 0 0 2px rgba(255,255,255,.22), 0 30px 80px rgba(0,0,0,.35); padding: 28px 50px 38px 46px; color: #fff; text-align: right; }
  .A .card::before { content: ''; position: absolute; right: 0; top: 30px; bottom: 30px; width: 10px; background: #E4002E; border-radius: 5px 0 0 5px; }
  .A .term { color: #C4C8CC; }
  .A #logo { position: absolute; top: 58px; right: 76px; width: 330px; }
  /* design B: big type on the left, the persona on the right */
  .B #col { position: absolute; left: 80px; top: 0; height: 1080px; display: flex; flex-direction: column; justify-content: center; align-items: flex-end; gap: 30px; padding-bottom: 40px; }
  .B .title { text-align: right; }
  .B.theme-dark .title { color: #fff; text-shadow: 0 6px 30px rgba(0,0,0,.55), 0 2px 6px rgba(0,0,0,.45); }
  .B.theme-light .title { color: #090A0D; text-shadow: 0 4px 26px rgba(255,255,255,.55); }
  .B.theme-dark .term { color: #C4C8CC; }
  .B.theme-light .term { color: #393B40; }
  .B #logo { position: absolute; left: 80px; bottom: 62px; width: 300px; }
  </style></head>
  <body class="${j.design} theme-${j.theme}">
    <img id="bg" src="${'file://' + path.resolve(j.bg)}">
    <div id="col">${tag}<div class="${j.design === 'A' ? 'card' : 'block'}"><div class="title" id="title" style="line-height: ${j.title.length >= 3 ? 1.32 : 1.24}">${lines}${term}</div></div></div>
    <img id="logo" src="${A(j.logo || (j.theme === 'light' ? 'lockup_ink.png' : 'lockup_white.png'))}">
  </body></html>`;
}

const br = await chromium.launch({ args: ['--allow-file-access-from-files'], ...(process.env.CHROME ? { executablePath: process.env.CHROME } : {}) });
const page = await br.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', (e) => console.error('pageerror', String(e)));
const tmp = path.resolve(assets, '_page.html');
for (const j of jobs) {
  fs.writeFileSync(tmp, html(j));
  await page.goto('file://' + tmp, { waitUntil: 'load' });
  await page.evaluate(async () => { await document.fonts.load('700 100px AR', 'ما'); await document.fonts.load('700 100px NUM', '7'); await document.fonts.ready; });
  // fit the headline: largest size (≤ max) whose widest line fits the column
  const fit = await page.evaluate(({ design, max, min, maxW }) => {
    const t = document.getElementById('title');
    let lo = min, hi = max, best = min;
    while (hi - lo > 1) {
      const mid = (lo + hi) / 2; t.style.fontSize = mid + 'px';
      const w = Math.max(...[...t.querySelectorAll('.ln')].map((e) => { const r = document.createRange(); r.selectNodeContents(e); return r.getBoundingClientRect().width; }));
      if (w <= maxW) { best = mid; lo = mid; } else hi = mid;
    }
    t.style.fontSize = Math.floor(best) + 'px';
    const term = t.querySelector('.term'); if (term) term.style.fontSize = Math.round(Math.max(40, best * 0.34)) + 'px';
    return Math.floor(best);
  }, { design: j.design, max: j.max || (j.design === 'A' ? 140 : (j.title.length >= 3 ? 160 : 178)), min: 70, maxW: j.maxW || (j.design === 'A' ? 640 : 660) });
  const out = j.out || `out/${j.id}.png`;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
  console.log('wrote', out, 'title', fit + 'px');
}
await br.close();
