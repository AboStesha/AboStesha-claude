// Render questions.json as the Axi Iraq branded question-bank PDF (A4, RTL).
// PW_MODULE=<path>/playwright/index.mjs node tool/render.mjs questions.json <fonts_dir> <logo.png> <out.pdf>
//   fonts_dir holds the static ReadexPro-<weight>.ttf (Arabic) and Inter-<weight>.ttf (Latin and digits) made by
//   tool/fonts.py; logo = brand/AxiIraq_Logo_Stacked_Ink.png
// The pages are laid out in the browser: blocks are dropped into fixed-height pages, a block that overflows moves to
// a new page, and the contents page gets its page numbers once everything is placed.
import fs from 'fs';
import path from 'path';

const PW = process.env.PW_MODULE || 'playwright';
const { chromium } = await import(PW);
const [, , dataFile, fontsDir, logoFile, outFile] = process.argv;
const url = (f) => 'file://' + path.resolve(f);
const data = fs.readFileSync(dataFile, 'utf8');

const face = (family, file, w, range = '') => `@font-face { font-family: ${family}; src: url(${url(path.join(fontsDir, `${file}-${w}.ttf`))}); font-weight: ${w}; ${range} }`;
const FONTS = [400, 500, 600, 700].map((w) => face('AR', 'ReadexPro', w))
  .concat([200, 300, 400, 500, 600, 700].map((w) => face('NUM', 'Inter', w, 'unicode-range: U+0020-007E, U+00D7, U+00F7;'))).join('\n');

const RISK ='تنطوي عقود الفروقات والمنتجات المشتقة خارج البورصة على مخاطر عالية قد تؤدي إلى خسارة رأس المال. المحتوى التعليمي والتحليلي لا يُعدّ نصيحة استثمارية. قد لا يكون هذا المحتوى متاحاً في منطقتك. يُرجى الرجوع إلى شروط الخدمة.';

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>بنك أسئلة الاختبارات · أكاديمية آكسي</title><style>
${FONTS}
@page { size: 210mm 297mm; margin: 0; }
:root { --ink: #090A0D; --red: #E4002E; --mint: #5EE0BB; --steel: #EEF0F1; --silver: #C4C8CC; --concrete: #939699;
        --slate: #626466; --graphite: #393B40; --off: #F9F9F9; --line: #E2E5E7; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: NUM, AR; color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 210mm; height: 297mm; position: relative; overflow: hidden; break-after: page; background: #fff; }
.lg { display: inline-block; overflow: hidden; aspect-ratio: 2000 / 1454; }
.lg img { width: 100%; display: block; }
.lg.white img { filter: brightness(0) invert(1); }
.pill { display: inline-block; font-size: 9pt; font-weight: 600; padding: 1.1mm 3.4mm; border-radius: 10mm; background: var(--steel); color: var(--graphite); }
.pill.red { background: var(--red); color: #fff; }
.tri { position: absolute; bottom: 10.5mm; width: 6.9mm; height: 6.9mm; background: var(--red); }
.tri.r { right: 10.5mm; clip-path: polygon(100% 0, 100% 100%, 0 100%); }
.tri.l { left: 10.5mm; clip-path: polygon(0 0, 100% 100%, 0 100%); }

/* cover and the closing page: the primary vertical gradient, ink on the light half, white on the dark half */
.grad { background: linear-gradient(180deg, #EEF0F1 0%, #607880 100%); }
.cover .top { position: absolute; top: 30mm; left: 0; right: 0; text-align: center; }
.cover .top .lg { height: 30mm; }
.cover .kick { margin-top: 14mm; font-size: 13pt; font-weight: 600; color: var(--red); }
.cover h1 { margin-top: 3mm; font-size: 40pt; font-weight: 700; line-height: 1.25; }
.cover .sub { margin-top: 4mm; font-size: 13pt; font-weight: 400; color: var(--graphite); }
.cover .stats { position: absolute; top: 150mm; left: 22mm; right: 22mm; display: flex; justify-content: center; gap: 16mm; color: #fff; }
.cover .stats div { text-align: center; }
.cover .stats b { display: block; font-family: NUM; font-size: 40pt; font-weight: 300; line-height: 1; letter-spacing: -0.015em; }
.cover .stats span { display: block; margin-top: 2mm; font-size: 11pt; font-weight: 500; }
.cover .cards { position: absolute; top: 192mm; left: 22mm; right: 22mm; display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
.glass { background: rgba(255,255,255,.22); border: 1px solid rgba(255,255,255,.55); color: #fff; padding: 4mm 5mm;
         clip-path: polygon(0 0, 100% 0, 100% 100%, 7mm 100%, 0 calc(100% - 7mm)); }
.glass .cl { font-size: 9pt; font-weight: 500; opacity: .9; }
.glass .cn { margin-top: 1mm; font-size: 13pt; font-weight: 700; }
.glass .cc { margin-top: 1.5mm; font-size: 9pt; font-weight: 400; opacity: .9; }
.cover .date { position: absolute; bottom: 12mm; left: 0; right: 0; text-align: center; color: #fff; font-size: 9.5pt; }

/* running pages */
.run .hd { position: absolute; top: 0; left: 16mm; right: 16mm; height: 21mm; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }
.run .hd .lg { height: 9mm; }
.run .hd .lbl { font-size: 9pt; font-weight: 500; color: var(--slate); }
.run .ct { position: absolute; top: 27mm; bottom: 19mm; left: 16mm; right: 16mm; overflow: hidden; }
.run .ft { position: absolute; bottom: 0; left: 16mm; right: 16mm; height: 14mm; display: flex; align-items: center; justify-content: space-between; font-size: 8.5pt; color: var(--concrete); border-top: 1px solid var(--line); }
.run .ft .pn { font-family: NUM; font-weight: 600; color: var(--graphite); font-size: 9pt; }

/* course divider */
.div { background: linear-gradient(180deg, #EEF0F1 0%, #95A8B1 100%); }
.div .lg { position: absolute; top: 14mm; right: 16mm; height: 12mm; }
.div .no { position: absolute; top: 40mm; right: 16mm; font-family: NUM; font-size: 150pt; font-weight: 200; line-height: 1; letter-spacing: -0.015em; color: var(--ink); }
.div .head { position: absolute; top: 108mm; right: 16mm; left: 16mm; }
.div h1 { margin-top: 3mm; font-size: 34pt; font-weight: 700; line-height: 1.25; }
.div .list { position: absolute; top: 150mm; right: 16mm; left: 16mm; display: grid; gap: 2.4mm; }
.div .row { display: flex; align-items: center; gap: 4mm; background: rgba(255,255,255,.72); border-radius: 2.5mm; padding: 2.6mm 4mm; font-size: 11pt; font-weight: 500; }
.div .row .n { font-family: NUM; font-weight: 600; min-width: 9mm; color: var(--red); }
.div .row .c { margin-inline-start: auto; font-size: 9pt; color: var(--slate); }
.div .row.ex { background: var(--ink); color: #fff; }
.div .row.ex .c { color: var(--silver); }

/* blocks */
h2.sec { font-size: 20pt; font-weight: 700; line-height: 1.3; }
.howto { display: grid; gap: 3mm; margin-top: 6mm; }
.howto .it { display: flex; gap: 4mm; align-items: flex-start; background: var(--off); border: 1px solid var(--line); border-radius: 3mm; padding: 4mm 5mm; font-size: 11pt; line-height: 1.75; }
.howto .it b.n { flex: none; width: 8mm; height: 8mm; border-radius: 2mm; background: var(--ink); color: #fff; font-family: NUM; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-top: .6mm; }
.howto .demo { display: inline-flex; align-items: center; gap: 2mm; background: #E3F9F2; border: 1px solid var(--mint); border-radius: 2mm; padding: .4mm 2.4mm; font-weight: 600; }
.note { margin-top: 6mm; font-size: 9.5pt; line-height: 1.7; color: var(--slate); }
.toc { margin-top: 5mm; }
.toc .tc { display: flex; align-items: baseline; gap: 3mm; border-bottom: 2px solid var(--ink); padding-bottom: 1.4mm; }
.toc .tc b { font-size: 12pt; }
.toc .tr { display: flex; align-items: baseline; gap: 3mm; padding: 1.25mm 0; border-bottom: 1px solid var(--line); font-size: 10pt; }
.toc .tr .n { font-family: NUM; font-weight: 600; min-width: 8mm; color: var(--red); }
.toc .tr .t { flex: 1; }
.toc .tr .c { font-size: 9pt; color: var(--slate); }
.toc .tr .p { font-family: NUM; font-weight: 600; min-width: 9mm; text-align: left; }
.toc .tr.ex .t { font-weight: 700; }

.lh { padding-bottom: 4mm; margin-bottom: 4mm; border-bottom: 1px solid var(--line); }
.lh .tags { display: flex; gap: 2mm; }
.lh h2 { margin-top: 2.6mm; font-size: 19pt; font-weight: 700; line-height: 1.35; }
.lh .meta { margin-top: 1mm; font-size: 9.5pt; color: var(--slate); }
.eh { background: var(--ink); color: #fff; border-radius: 3mm; padding: 6mm 7mm; margin-bottom: 5mm; }
.eh .tags { display: flex; gap: 2mm; }
.eh .pill:not(.red) { background: rgba(255,255,255,.14); color: #fff; }
.eh h2 { margin-top: 2.6mm; font-size: 19pt; font-weight: 700; line-height: 1.35; }
.eh .meta { margin-top: 1mm; font-size: 9.5pt; color: var(--silver); }

.q { border: 1px solid var(--line); border-radius: 3mm; padding: 3.2mm 4mm 3.6mm; margin-bottom: 3mm; }
.qh { display: flex; gap: 3mm; align-items: flex-start; }
.qn { flex: none; min-width: 7mm; height: 7mm; padding: 0 1.2mm; border-radius: 2mm; background: var(--ink); color: #fff; font-family: NUM; font-weight: 700; font-size: 9pt; display: flex; align-items: center; justify-content: center; margin-top: .5mm; }
.qt { font-size: 10.8pt; font-weight: 600; line-height: 1.65; }
.qt strong { color: var(--red); }
.opts { margin-top: 2.4mm; padding-inline-start: 10mm; display: grid; gap: 1.6mm; }
.opts.g2 { grid-template-columns: 1fr 1fr; }
.op { display: flex; align-items: center; gap: 2.4mm; background: var(--off); border: 1px solid var(--line); border-radius: 2mm; padding: 1.5mm 2.4mm; font-size: 9.8pt; line-height: 1.5; }
.ol { flex: none; width: 5.4mm; height: 5.4mm; border-radius: 50%; background: #fff; border: 1px solid var(--silver); display: flex; align-items: center; justify-content: center; font-size: 8.5pt; font-weight: 600; }
.op.ok { background: #E3F9F2; border-color: var(--mint); font-weight: 600; }
.op.ok .ol { background: var(--mint); border-color: var(--mint); }
.tk { flex: none; width: 4.4mm; height: 4.4mm; margin-inline-start: auto; }
.key { background: var(--steel); border-radius: 3mm; padding: 3.4mm 4mm 4mm; margin-top: 1mm; }
.key .kt { font-size: 9.5pt; font-weight: 700; margin-bottom: 2.2mm; }
.key .kg { display: grid; grid-template-columns: repeat(10, 1fr); gap: 1.4mm; }
.key .kg span { background: #fff; border-radius: 1.6mm; padding: 1.1mm 0; text-align: center; font-size: 9pt; font-weight: 600; }
.key .kg span i { font-style: normal; font-family: NUM; font-weight: 500; color: var(--slate); margin-inline-end: 1.2mm; }

/* closing page */
.close .mid { position: absolute; top: 70mm; left: 0; right: 0; text-align: center; }
.close .mid .lg { height: 34mm; }
.close .line { margin-top: 12mm; font-size: 18pt; font-weight: 600; }
.close .risk { position: absolute; left: 16mm; right: 16mm; bottom: 24mm; background: rgba(255,255,255,.92); border-radius: 3mm; padding: 5mm 6mm; font-size: 9pt; line-height: 1.8; color: var(--ink); }
.close .risk b { display: block; margin-bottom: 1mm; font-size: 9.5pt; }
</style></head><body><div id="root"></div>
<script type="application/json" id="data">${data.replace(/</g, '\\u003c')}</script>
<script>
(async () => {
// fonts first, so the layout measures the real text
await Promise.all(['400', '500', '600', '700'].map((w) => document.fonts.load(w + ' 12px AR', 'ما'))
  .concat(['200', '300', '400', '500', '600', '700'].map((w) => document.fonts.load(w + ' 12px NUM', '1'))));
await document.fonts.ready;
const D = JSON.parse(document.getElementById('data').textContent);
const LOGO = ${JSON.stringify(url(logoFile))};
const LETTERS = ['أ', 'ب', 'ج', 'د'];
const TICK = '<svg class="tk" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#090A0D"/><path d="M6.5 12.4l3.6 3.6 7.4-7.6" fill="none" stroke="#5EE0BB" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const root = document.getElementById('root');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rich = (s) => esc(s).replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');
const logo = (cls = '') => '<div class="lg ' + cls + '"><img src="' + LOGO + '"></div>';
const node = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstChild; };
const page = (cls, inner) => { const p = node('<div class="page ' + cls + '">' + inner + '</div>'); root.appendChild(p); return p; };
const count = (n, one, few, many) => n + ' ' + (n === 1 ? one : n <= 10 ? few : many);

// one running page, returns its content box
function run(label) {
  const p = page('run', '<div class="hd">' + logo() + '<div class="lbl">' + esc(label) + '</div></div><div class="ct"></div>' +
    '<div class="ft"><span>أكاديمية آكسي · بنك أسئلة الاختبارات</span><span class="pn"></span></div>');
  return p.querySelector('.ct');
}
const over = (ct) => ct.scrollHeight > ct.clientHeight + 1;
// lay blocks into running pages; a block marked keep stays on the same page as the block after it
function flow(label, blocks) {
  let ct = run(label);
  for (let i = 0; i < blocks.length; i++) {
    const group = blocks[i].dataset.keep && blocks[i + 1] ? [blocks[i], blocks[++i]] : [blocks[i]];
    group.forEach((b) => ct.appendChild(b));
    if (over(ct) && ct.children.length > group.length) {
      group.forEach((b) => b.remove());
      ct = run(label);
      group.forEach((b) => ct.appendChild(b));
    }
    if (over(ct)) console.error('does not fit on a page: ' + (group[0].id || group[0].className));
  }
}
function question(q, i) {
  const short = q.options.every((o) => o.length <= 34);
  const opts = q.options.map((o, k) => '<div class="op' + (k === q.answer ? ' ok' : '') + '"><span class="ol">' + LETTERS[k] + '</span><span>' + esc(o) + '</span>' + (k === q.answer ? TICK : '') + '</div>').join('');
  return node('<div class="q" id="' + q.id + '"><div class="qh"><span class="qn">' + (i + 1) + '</span><p class="qt">' + rich(q.q) + '</p></div><div class="opts ' + (short ? 'g2' : 'g1') + '">' + opts + '</div></div>');
}
function key(qs) {
  return node('<div class="key"><div class="kt">مفتاح الإجابات</div><div class="kg">' + qs.map((q, i) => '<span><i>' + (i + 1) + '</i>' + LETTERS[q.answer] + '</span>').join('') + '</div></div>');
}

const C = D.courses;
const nQ = C.reduce((a, c) => a + c.lessons.reduce((b, l) => b + l.questions.length, 0) + c.exam.questions.length, 0);
const nL = C.reduce((a, c) => a + c.lessons.length, 0);

// cover
page('cover grad', '<div class="top">' + logo() + '<div class="kick">أكاديمية آكسي</div><h1>بنك أسئلة الاختبارات</h1>' +
  '<p class="sub">أسئلة الدروس واختبارات نهاية الكورسات، مع الإجابات الصحيحة</p></div>' +
  '<div class="stats"><div><b>' + C.length + '</b><span>كورسات</span></div><div><b>' + nL + '</b><span>درساً</span></div><div><b>' + nQ + '</b><span>سؤالاً</span></div></div>' +
  '<div class="cards">' + C.map((c) => '<div class="glass"><div class="cl">' + esc(c.label) + '</div><div class="cn">' + esc(c.name) + '</div><div class="cc">' +
    c.lessons.length + ' دروس · ' + (c.lessons.length * 10 + c.exam.questions.length) + ' سؤالاً</div></div>').join('') + '</div>' +
  '<div class="date">تشرين الأول 2026</div><i class="tri r"></i><i class="tri l"></i>');

// how to use
const how = [
  'لكل درس <b>10 أسئلة</b>، ولكل كورس <b>40 سؤالاً</b> جديداً لاختبار نهاية الكورس.',
  'يظهر للطالب <b>5 أسئلة</b> في كل اختبار، تُختار من مجموعة الدرس أو الكورس.',
  'إذا أخطأ الطالب في سؤال، يُستبدل بسؤال آخر من المجموعة نفسها لم يظهر له من قبل.',
  'لكل سؤال 4 خيارات وإجابة صحيحة واحدة. الإجابة الصحيحة مظلّلة هكذا <span class="demo">' + TICK + 'الإجابة الصحيحة</span>، وفي نهاية كل مجموعة مفتاح للإجابات.',
  'الأسئلة مبنية على محتوى الفيديوهات نفسها، فلا تحتاج إلى أي معلومة من خارج الكورس.',
];
flow('طريقة الاستخدام', [
  node('<h2 class="sec">طريقة الاستخدام</h2>'),
  node('<div class="howto">' + how.map((t, i) => '<div class="it"><b class="n">' + (i + 1) + '</b><div>' + t + '</div></div>').join('') + '</div>'),
  node('<p class="note">الأسعار والأرقام في الأسئلة أمثلة افتراضية للتعليم فقط. ' + esc(${JSON.stringify(RISK)}) + '</p>'),
]);

// contents (page numbers are filled in at the end)
flow('المحتويات', [node('<h2 class="sec">المحتويات</h2>')].concat(C.map((c) => node('<div class="toc">' +
  '<div class="tc"><b>' + esc(c.label) + ' · ' + esc(c.name) + '</b></div>' +
  c.lessons.map((l) => '<div class="tr"><span class="n">' + l.no + '</span><span class="t">' + esc(l.title) + '</span><span class="c">10 أسئلة</span><span class="p" data-ref="' + l.id + '"></span></div>').join('') +
  '<div class="tr ex"><span class="n"></span><span class="t">اختبار نهاية الكورس</span><span class="c">40 سؤالاً</span><span class="p" data-ref="' + c.exam.id + '"></span></div></div>'))));

// courses
C.forEach((c, ci) => {
  page('div', logo() + '<div class="no">' + String(ci + 1).padStart(2, '0') + '</div><div class="head"><span class="pill red">' + esc(c.label) + '</span><h1>' + esc(c.name) + '</h1></div>' +
    '<div class="list">' + c.lessons.map((l) => '<div class="row"><span class="n">' + l.no + '</span><span>' + esc(l.title) + '</span><span class="c">10 أسئلة</span></div>').join('') +
    '<div class="row ex"><span class="n"></span><span>اختبار نهاية الكورس</span><span class="c">40 سؤالاً</span></div></div>');
  const label = c.label + ' · ' + c.name;
  const blocks = [];
  c.lessons.forEach((l) => {
    const h = node('<div class="lh" id="' + l.id + '"><div class="tags"><span class="pill red">الدرس ' + l.no + '</span><span class="pill">' + esc(c.label) + '</span></div><h2>' + esc(l.title) + '</h2><div class="meta">10 أسئلة</div></div>');
    h.dataset.keep = 1;
    blocks.push({ start: true, els: [h, ...l.questions.map(question), key(l.questions)] });
  });
  const eh = node('<div class="eh" id="' + c.exam.id + '"><div class="tags"><span class="pill red">اختبار نهاية الكورس</span><span class="pill">' + esc(c.label) + '</span></div><h2>' + esc(c.name) + '</h2><div class="meta">' + c.exam.questions.length + ' سؤالاً جديداً تغطي دروس الكورس كلها</div></div>');
  eh.dataset.keep = 1;
  blocks.push({ start: true, els: [eh, ...c.exam.questions.map(question), key(c.exam.questions)] });
  blocks.forEach((b) => flow(label, b.els));   // every lesson and the exam start on a new page
});

// closing page
page('close grad', '<div class="mid">' + logo() + '<div class="line">تعلّم ثم تعلّم ثم تدرّب ثم تداول.</div></div>' +
  '<div class="risk"><b>تحذير المخاطر</b>' + esc(${JSON.stringify(RISK)}) + '</div><i class="tri r"></i><i class="tri l"></i>');

// page numbers and contents
const all = [...root.children];
all.forEach((p, i) => { const pn = p.querySelector('.pn'); if (pn) pn.textContent = i + 1; });
document.querySelectorAll('[data-ref]').forEach((s) => { s.textContent = all.indexOf(document.getElementById(s.dataset.ref).closest('.page')) + 1; });
window.__pages = all.length;
})();
</script></body></html>`;

const tmp = path.resolve(path.dirname(outFile), '_bank.html');
fs.writeFileSync(tmp, html);
const br = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const pg = await br.newPage();
const problems = [];
pg.on('pageerror', (e) => problems.push('pageerror ' + String(e)));
pg.on('console', (m) => m.type() === 'error' && problems.push(m.text()));
await pg.goto('file://' + tmp, { waitUntil: 'load' });
const pages = await (await pg.waitForFunction(() => window.__pages, null, { timeout: 120000 })).jsonValue();
await pg.pdf({ path: outFile, width: '210mm', height: '297mm', printBackground: true, preferCSSPageSize: true, outline: true, tagged: !!process.env.TAGGED });
await br.close();
if (!process.env.KEEP_HTML) fs.unlinkSync(tmp);
console.log('wrote', outFile, pages, 'pages');
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
