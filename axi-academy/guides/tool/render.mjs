// Render lesson companion guides (src/<id>.md, format in SPEC.md) as Axi Iraq branded A4 PDFs (RTL).
// PW_MODULE=<path>/playwright/index.mjs node tool/render.mjs <fonts_dir> <logo.png> <out_dir> src/L01.md [src/L02.md ...]
//   fonts_dir holds the static ReadexPro-<weight>.ttf and Inter-<weight>.ttf made by ../quizzes/tool/fonts.py;
//   logo = ../brand/AxiIraq_Logo_Stacked_Ink.png. Writes <out_dir>/AxiAcademy_Guide_<id>.pdf for each source.
// The source is turned into HTML blocks here; the browser lays them into fixed-height pages: a block that overflows
// moves to a new page, tables split between rows and repeat their header, headings stay with the block after them.
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const PW = process.env.PW_MODULE || 'playwright';
const { chromium } = await import(PW);
const [, , fontsDir, logoFile, outDir, ...srcFiles] = process.argv;
const url = (f) => 'file://' + path.resolve(f);
const HERE = path.dirname(new URL(import.meta.url).pathname);

const COURSES = [
  { label: 'الكورس الأول', name: 'الفوركس من الصفر', ids: ['L01', 'L02', 'L03', 'L04', 'L05'] },
  { label: 'الكورس الثاني', name: 'أساسيات التداول', ids: ['L06', 'L07', 'L08', 'L09', 'L10', 'L11', 'L12', 'L13'] },
  { label: 'الكورس الثالث', name: 'كيف تصبح متداولاً محترفاً', ids: ['L14', 'L15', 'L16', 'L17', 'L18'] },
  { label: 'كورس للمحترفين', name: 'احترف تداول الذهب', ids: ['G1', 'G2', 'G3', 'G4'] },
];
const RISK = 'تنطوي عقود الفروقات والمنتجات المشتقة خارج البورصة على مخاطر عالية قد تؤدي إلى خسارة رأس المال. المحتوى التعليمي والتحليلي لا يُعدّ نصيحة استثمارية. قد لا يكون هذا المحتوى متاحاً في منطقتك. يُرجى الرجوع إلى شروط الخدمة.';

// ---- source -> blocks
function parse(text) {
  const lines = text.replace(/\r/g, '').split('\n');
  const cut = lines.indexOf('---');
  const head = {};
  lines.slice(0, cut).forEach((l) => { const i = l.indexOf(':'); if (i > 0) head[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
  return { ...head, blocks: parseBlocks(lines.slice(cut + 1)) };
}
const START = /^(#{2,3} |\||- |\d+\. |:::)/;
function parseBlocks(lines) {
  const out = [];
  let i = 0;
  const take = (re) => { const items = []; while (i < lines.length && re.test(lines[i].trim())) items.push(lines[i++].trim().replace(re, '')); return items; };
  while (i < lines.length) {
    const l = lines[i].trim();
    if (!l) { i++; continue; }
    if (l.startsWith(':::')) {
      const [, kind, title] = l.match(/^:::(\w+)\s*(.*)$/);
      const body = [];
      for (i++; i < lines.length && lines[i].trim() !== ':::'; i++) body.push(lines[i]);
      i++;
      out.push({ t: 'box', kind, title, body: kind === 'formula' ? body.map((s) => s.trim()).filter(Boolean) : parseBlocks(body) });
    } else if (l.startsWith('## ')) { out.push({ t: 'h2', text: l.slice(3).trim() }); i++; }
    else if (l.startsWith('### ')) { out.push({ t: 'h3', text: l.slice(4).trim() }); i++; }
    else if (l.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(lines[i++].trim());
      const cells = (r) => r.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
      out.push({ t: 'table', head: cells(rows[0]), rows: rows.slice(2).map(cells) });
    } else if (/^- /.test(l)) out.push({ t: 'ul', items: take(/^- /) });
    else if (/^\d+\. /.test(l)) out.push({ t: 'ol', items: take(/^\d+\. /) });
    else {
      const para = [];
      while (i < lines.length && lines[i].trim() && !START.test(lines[i].trim())) para.push(lines[i++].trim());
      out.push({ t: 'p', text: para.join(' ') });
    }
  }
  return out;
}

// ---- blocks -> HTML
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return '\u0000' + (codes.length - 1) + '\u0000'; });
  s = esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, n) => '<code dir="' + (ARABIC.test(codes[n]) ? 'rtl' : 'ltr') + '">' + esc(codes[n]) + '</code>');
}
const ARABIC = /[\u0600-\u06FF]/;
const ICON = {
  note: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#090A0D"/><rect x="10.8" y="10" width="2.4" height="8" rx="1.2" fill="#fff"/><circle cx="12" cy="6.8" r="1.5" fill="#fff"/></svg>',
  tip: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#090A0D"/><path d="M12 5.2l1.9 4.6 4.9.4-3.7 3.2 1.1 4.8L12 15.6l-4.2 2.6 1.1-4.8-3.7-3.2 4.9-.4z" fill="#5EE0BB"/></svg>',
  warning: '<svg viewBox="0 0 24 24"><path d="M12 1.8l11 19.6H1z" fill="#E4002E"/><rect x="10.8" y="8.4" width="2.4" height="7" rx="1.2" fill="#fff"/><circle cx="12" cy="18.2" r="1.4" fill="#fff"/></svg>',
  example: '<svg viewBox="0 0 24 24"><rect x="1" y="1" width="22" height="22" rx="5" fill="#E4002E"/><path d="M7 9.2h10M7 14.8h10" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>',
  formula: '<svg viewBox="0 0 24 24"><rect x="1" y="1" width="22" height="22" rx="5" fill="#5EE0BB"/><path d="M15.5 6.2c-1.8-.6-3.1.2-3.5 2l-1.9 9c-.4 1.8-1.7 2.6-3.5 2M8.6 11h6.6" fill="none" stroke="#090A0D" stroke-width="2" stroke-linecap="round"/></svg>',
  key: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#5EE0BB"/><path d="M6.5 12.4l3.6 3.6 7.4-7.6" fill="none" stroke="#090A0D" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
const CHECK = '<svg class="ck" viewBox="0 0 24 24"><path d="M5 12.6l4.4 4.4L19 7.4" fill="none" stroke="#5EE0BB" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const table = (b) => '<table class="tb"><thead><tr>' + b.head.map((h) => '<th>' + inline(h) + '</th>').join('') + '</tr></thead><tbody>' +
  b.rows.map((r) => '<tr>' + r.map((c) => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
const isResult = (p) => /^\*\*(النتيجة|الجواب|الخلاصة)/.test(p.text);
// a block inside a callout
function inner(b, kind) {
  if (b.t === 'p') return '<p class="' + (isResult(b) ? 'res' : 'bp') + '">' + inline(b.text) + '</p>';
  if (b.t === 'ul') return '<ul class="bl">' + b.items.map((x) => '<li>' + (kind === 'key' ? CHECK : '') + '<span>' + inline(x) + '</span></li>').join('') + '</ul>';
  if (b.t === 'ol') return '<ol class="bo">' + b.items.map((x, k) => '<li><b class="n">' + (k + 1) + '</b><span>' + inline(x) + '</span></li>').join('') + '</ol>';
  if (b.t === 'table') return table(b);
  return '<p class="bp">' + inline(b.text || '') + '</p>';
}
function box(b) {
  const body = b.kind === 'formula'
    ? b.body.map((f) => { const s = f.replace(/^`|`$/g, ''); return '<div class="fl" dir="' + (ARABIC.test(s) ? 'rtl' : 'ltr') + '">' + inline(s) + '</div>'; }).join('')
    : b.body.map((x) => inner(x, b.kind)).join('');
  return '<div class="box ' + b.kind + '"><div class="bt">' + (ICON[b.kind] || '') + '<span>' + inline(b.title || '') + '</span></div><div class="bb">' + body + '</div></div>';
}
// top-level blocks for the paginator: {h, keep, table}
function blocks(doc, logo) {
  const out = [];
  const secs = [];
  let n = 0;
  doc.blocks.forEach((b, i) => {
    if (b.t === 'h2') {
      const gl = b.text === 'مصطلحات هذا الدليل';
      const id = 's' + secs.length;
      secs.push({ id, no: gl ? '' : String(++n).padStart(2, '0'), text: b.text });
      out.push({ h: '<h2 class="sec' + (gl ? ' gl' : '') + '" id="' + id + '">' + (gl ? '' : '<span class="no">' + secs.at(-1).no + '</span>') + '<span class="tx">' + inline(b.text) + '</span></h2>', keep: 1 });
    } else if (b.t === 'h3') out.push({ h: '<h3 class="sub">' + inline(b.text) + '</h3>', keep: 1 });
    else if (b.t === 'p') out.push({ h: '<p class="tp">' + inline(b.text) + '</p>', keep: /[:：]$/.test(b.text) || doc.blocks[i + 1]?.t === 'table' ? 1 : 0 });
    else if (b.t === 'ul') b.items.forEach((x, k) => out.push({ h: '<div class="li' + (k ? ' cont' : '') + '"><span>' + inline(x) + '</span></div>' }));
    else if (b.t === 'ol') b.items.forEach((x, k) => out.push({ h: '<div class="oi' + (k ? ' cont' : '') + '"><b class="n">' + (k + 1) + '</b><span>' + inline(x) + '</span></div>' }));
    else if (b.t === 'table') out.push({ h: table(b), table: 1 });
    else if (b.t === 'box') out.push({ h: box(b) });
  });
  out.push({ h: '<div class="end"><div class="lg"><img src="' + logo + '"></div><div class="et"><div class="motto">تعلّم ثم تعلّم ثم تدرّب ثم تداول.</div><div class="risk"><b>تحذير المخاطر</b> ' + esc(RISK) + '</div></div></div>' });
  return { out, secs };
}

const face = (family, file, w, range = '') => `@font-face { font-family: ${family}; src: url(${url(path.join(fontsDir, `${file}-${w}.ttf`))}); font-weight: ${w}; ${range} }`;
const FONTS = [400, 500, 600, 700].map((w) => face('AR', 'ReadexPro', w))
  .concat([300, 400, 500, 600, 700].map((w) => face('NUM', 'Inter', w, 'unicode-range: U+0020-007E, U+00B1, U+00D7, U+00F7, U+2212;'))).join('\n');

const CSS = `
${FONTS}
@page { size: 210mm 297mm; margin: 0; }
:root { --ink: #090A0D; --red: #E4002E; --mint: #5EE0BB; --steel: #EEF0F1; --silver: #C4C8CC; --concrete: #939699;
        --slate: #626466; --graphite: #393B40; --off: #F9F9F9; --line: #E2E5E7; --mintbg: #E3F9F2; --redbg: #FDEDF0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: NUM, AR; color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 210mm; height: 297mm; position: relative; overflow: hidden; break-after: page; background: #fff; }
.lg { display: inline-block; overflow: hidden; aspect-ratio: 2000 / 1454; }
.lg img { width: 100%; display: block; }
.pill { display: inline-block; font-size: 9.5pt; font-weight: 600; padding: 1.2mm 3.6mm; border-radius: 10mm; background: rgba(255,255,255,.8); color: var(--graphite); }
.pill.red { background: var(--red); color: #fff; }
.tri { position: absolute; bottom: 10.5mm; width: 6.9mm; height: 6.9mm; background: var(--red); }
.tri.r { right: 10.5mm; clip-path: polygon(100% 0, 100% 100%, 0 100%); }
.tri.l { left: 10.5mm; clip-path: polygon(0 0, 100% 100%, 0 100%); }
code { font-family: NUM, AR; font-size: .92em; font-weight: 500; background: var(--steel); border-radius: 1.2mm; padding: .1mm 1.2mm; white-space: nowrap; }
strong { font-weight: 700; }

/* cover: the primary vertical gradient, ink on the light half, white on the dark half */
.grad { background: linear-gradient(180deg, #EEF0F1 0%, #607880 100%); }
.cover .top { position: absolute; top: 20mm; left: 20mm; right: 20mm; text-align: center; }
.cover .top .lg { height: 24mm; }
.cover .tags { margin-top: 9mm; display: flex; gap: 2mm; justify-content: center; }
.cover .kick { margin-top: 7mm; font-size: 12.5pt; font-weight: 600; color: var(--red); }
.cover h1 { margin-top: 2mm; font-size: 33pt; font-weight: 700; line-height: 1.3; }
.cover .lead { margin: 4mm auto 0; max-width: 152mm; font-size: 11.5pt; line-height: 1.85; color: var(--graphite); }
.cover .toc { position: absolute; left: 20mm; right: 20mm; bottom: 27mm; color: #fff; background: rgba(255,255,255,.16); border: 1px solid rgba(255,255,255,.5);
              padding: 5mm 6mm 4mm; clip-path: polygon(0 0, 100% 0, 100% 100%, 8mm 100%, 0 calc(100% - 8mm)); }
.cover .toc .tt { font-size: 10pt; font-weight: 600; opacity: .9; margin-bottom: 1.5mm; }
.cover .toc a { color: inherit; text-decoration: none; display: flex; align-items: baseline; gap: 3.5mm; padding: 1.7mm 0; border-top: 1px solid rgba(255,255,255,.28); font-size: 10.5pt; font-weight: 500; }
.cover .toc a .n { font-family: NUM; font-weight: 600; min-width: 7mm; color: #fff; opacity: .75; }
.cover .toc a .t { flex: 1; }
.cover .toc a .p { font-family: NUM; font-weight: 600; min-width: 7mm; text-align: left; }
.cover .date { position: absolute; bottom: 12mm; left: 0; right: 0; text-align: center; color: #fff; font-size: 9.5pt; }

/* running pages */
.run .hd { position: absolute; top: 0; left: 17mm; right: 17mm; height: 20mm; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }
.run .hd .lg { height: 8.5mm; }
.run .hd .lbl { font-size: 9pt; font-weight: 500; color: var(--slate); }
.run .ct { position: absolute; top: 26mm; bottom: 19mm; left: 17mm; right: 17mm; overflow: hidden; }
.run .ft { position: absolute; bottom: 0; left: 17mm; right: 17mm; height: 13mm; display: flex; align-items: center; justify-content: space-between; font-size: 8.5pt; color: var(--concrete); border-top: 1px solid var(--line); }
.run .ft .pn { font-family: NUM; font-weight: 600; color: var(--graphite); font-size: 9pt; }

/* flowed blocks */
.ct > * + * { margin-top: 2.5mm; }
.sec { display: flex; align-items: baseline; gap: 3mm; font-size: 15.5pt; font-weight: 700; line-height: 1.4; padding-bottom: 2.2mm; border-bottom: 1.5px solid var(--ink); }
.ct > * + .sec { margin-top: 7mm; }
.sec .no { font-family: NUM; font-weight: 300; font-size: 19pt; color: var(--red); letter-spacing: -0.01em; }
.sec.gl { border-bottom-color: var(--red); }
.sub { font-size: 12pt; font-weight: 700; line-height: 1.5; display: flex; align-items: center; gap: 2.2mm; }
.sub::before { content: ''; flex: none; width: 2mm; height: 2mm; background: var(--red); }
.ct > * + .sub { margin-top: 5mm; }
.tp { font-size: 10.2pt; line-height: 1.8; }
.li, .oi { display: flex; gap: 2.6mm; font-size: 10.2pt; line-height: 1.75; }
.ct > .li.cont, .ct > .oi.cont { margin-top: 1.2mm; }
.li::before { content: ''; flex: none; width: 1.7mm; height: 1.7mm; margin-top: 2.3mm; background: var(--red); border-radius: .3mm; }
.oi .n, .bo .n { flex: none; width: 5.6mm; height: 5.6mm; margin-top: .5mm; border-radius: 1.6mm; background: var(--ink); color: #fff; font-family: NUM; font-size: 8.5pt; font-weight: 700; display: flex; align-items: center; justify-content: center; }

.tb { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 9pt; line-height: 1.5; border: 1px solid var(--line); border-radius: 2.4mm; overflow: hidden; }
.tb.fixed { table-layout: fixed; }
.tb th { background: var(--ink); color: #fff; font-weight: 600; text-align: start; padding: 1.8mm 2.4mm; vertical-align: bottom; }
.tb td { padding: 1.45mm 2.4mm; border-top: 1px solid var(--line); vertical-align: top; }
.tb tbody tr:nth-child(even) td { background: var(--off); }
.tb td code { background: #fff; border: 1px solid var(--line); }

.box { border-radius: 3mm; padding: 3.2mm 4.4mm 3.6mm; }
.box .bt { display: flex; align-items: center; gap: 2.2mm; font-size: 10.6pt; font-weight: 700; line-height: 1.45; margin-bottom: 1.8mm; }
.box .bt svg { flex: none; width: 5.2mm; height: 5.2mm; }
.box .bb > * + * { margin-top: 2mm; }
.box .bp, .box .res { font-size: 9.9pt; line-height: 1.75; }
.box .bl, .box .bo { list-style: none; display: grid; gap: 1.3mm; }
.box .bl li, .box .bo li { display: flex; gap: 2.4mm; font-size: 9.9pt; line-height: 1.7; }
.box .bl li::before { content: ''; flex: none; width: 1.6mm; height: 1.6mm; margin-top: 2.4mm; background: var(--red); border-radius: .3mm; }
.box .tb { font-size: 9pt; background: #fff; }
.box.note { background: var(--steel); }
.box.tip { background: var(--mintbg); border-inline-start: 1.3mm solid var(--mint); }
.box.warning { background: var(--redbg); border-inline-start: 1.3mm solid var(--red); }
.box.warning .bt { color: #B80025; }
.box.example { padding: 0; border: 1px solid var(--line); overflow: hidden; }
.box.example .bt { margin: 0; padding: 2.3mm 4.4mm; background: var(--steel); }
.box.example .bb { padding: 2.8mm 4.4mm 3.4mm; }
.box .res { background: var(--mintbg); border: 1px solid var(--mint); border-radius: 2mm; padding: 1.8mm 3mm; }
.box.formula { background: var(--ink); color: #fff; }
.box.formula .fl { font-size: 11pt; font-weight: 500; line-height: 1.6; text-align: center; padding: 1.4mm 2mm; background: rgba(255,255,255,.07); border-radius: 1.6mm; }
.box.formula .fl + .fl { margin-top: 1.6mm; }
.box.formula code { background: none; padding: 0; }
.box.key { background: var(--ink); color: #fff; padding: 4.4mm 5mm 4.8mm; }
.box.key .bt { font-size: 11.5pt; margin-bottom: 2.6mm; }
.box.key .bl li::before { display: none; }
.box.key .ck { flex: none; width: 4.4mm; height: 4.4mm; margin-top: 1.2mm; }
.box.key code { background: rgba(255,255,255,.14); }

.end { display: flex; gap: 6mm; align-items: center; background: var(--steel); border-radius: 3mm; padding: 4.6mm 5.4mm; }
.ct > * + .end { margin-top: 7mm; }
.end .lg { flex: none; height: 15mm; }
.end .motto { font-size: 11pt; font-weight: 700; }
.end .risk { margin-top: 1.4mm; font-size: 8.4pt; line-height: 1.75; color: var(--graphite); }
`;

const SCRIPT = `
(async () => {
await Promise.all(['400', '500', '600', '700'].map((w) => document.fonts.load(w + ' 12px AR', 'ما'))
  .concat(['300', '400', '500', '600', '700'].map((w) => document.fonts.load(w + ' 12px NUM', '1'))));
await document.fonts.ready;
const D = JSON.parse(document.getElementById('data').textContent);
const root = document.getElementById('root');
const node = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstChild; };
const page = (cls, inner) => { const p = node('<div class="page ' + cls + '">' + inner + '</div>'); root.appendChild(p); return p; };
const logo = '<div class="lg"><img src="' + D.logo + '"></div>';
const problems = [];

page('cover grad', '<div class="top">' + logo + '<div class="tags"><span class="pill">' + D.course + '</span><span class="pill red">' + D.lesson + '</span></div>' +
  '<div class="kick">الدليل المرافق للدرس</div><h1>' + D.title + '</h1><p class="lead">' + D.lead + '</p></div>' +
  '<div class="toc"><div class="tt">في هذا الدليل</div>' + D.secs.map((s) => '<a href="#' + s.id + '"><span class="n">' + s.no + '</span><span class="t">' + s.text + '</span><span class="p" data-ref="' + s.id + '"></span></a>').join('') + '</div>' +
  '<div class="date">تشرين الأول 2026</div><i class="tri r"></i><i class="tri l"></i>');
const cover = root.lastChild;
if (cover.querySelector('.top').getBoundingClientRect().bottom > cover.querySelector('.toc').getBoundingClientRect().top - 8) problems.push('cover: the title block runs into the contents');

let ct;
const run = () => {
  const p = page('run', '<div class="hd">' + logo + '<div class="lbl">' + D.label + '</div></div><div class="ct"></div><div class="ft"><span>' + D.foot + '</span><span class="pn"></span></div>');
  ct = p.querySelector('.ct');
};
const over = () => ct.scrollHeight > ct.clientHeight + 1;
// fix the column widths once, so the parts of a split table line up
function fixCols(t) {
  if (t.classList.contains('fixed')) return;
  const ws = [...t.querySelectorAll('thead th')].map((th) => th.getBoundingClientRect().width);
  const sum = ws.reduce((a, b) => a + b, 0);
  t.insertAdjacentHTML('afterbegin', '<colgroup>' + ws.map((w) => '<col style="width:' + (100 * w / sum).toFixed(2) + '%">').join('') + '</colgroup>');
  t.classList.add('fixed');
}
// move rows from the end of table t to a new table until the page fits; null if fewer than min rows would stay
function split(t, min) {
  const rows = [...t.tBodies[0].rows];
  const moved = [];
  while (over() && rows.length > min) { const r = rows.pop(); moved.unshift(r); r.remove(); }
  if (over() || !moved.length) { moved.forEach((r) => t.tBodies[0].appendChild(r)); return null; }
  // no single row alone at the top of the next page
  if (moved.length === 1 && rows.length > min) { const r = rows.pop(); moved.unshift(r); r.remove(); }
  const rest = t.cloneNode(true);
  rest.tBodies[0].replaceChildren(...moved);
  return rest;
}
function place(group) {
  group.forEach((b) => ct.appendChild(b));
  group.forEach((b) => b.tagName === 'TABLE' && fixCols(b));
  if (!over()) return;
  const fresh = ct.children.length === group.length;
  const last = group[group.length - 1];
  if (last.tagName === 'TABLE') {
    const rest = split(last, fresh ? 1 : 3);
    if (rest) { run(); place([rest]); return; }
  }
  if (!fresh) { group.forEach((b) => b.remove()); run(); place(group); return; }
  problems.push('does not fit on a page: ' + last.textContent.slice(0, 60));
}
run();
const B = D.blocks.map((b) => { const el = node(b.h); if (b.keep) el.dataset.keep = 1; return el; });
for (let i = 0; i < B.length; i++) {
  const group = [B[i]];
  while (group[group.length - 1].dataset.keep && i + 1 < B.length) group.push(B[++i]);
  place(group);
}

const all = [...root.children];
all.forEach((p, i) => { const pn = p.querySelector('.pn'); if (pn) pn.textContent = i + 1; });
const at = (id) => all.indexOf(document.getElementById(id).closest('.page')) + 1;
document.querySelectorAll('[data-ref]').forEach((s) => { s.textContent = at(s.dataset.ref); });
const lastCt = all[all.length - 1].querySelector('.ct');
const end = lastCt && lastCt.lastElementChild;
window.__info = { pages: all.length, fill: end ? Math.round(100 * (end.offsetTop + end.offsetHeight) / lastCt.clientHeight) : 0, problems,
  marks: [{ t: 'الغلاف والمحتويات', p: 1 }].concat(D.secs.map((s) => ({ t: (s.no ? s.no + ' · ' : '') + s.text.replace(/<[^>]+>/g, ''), p: at(s.id) }))) };
})();
`;

function html(doc, logo) {
  const course = COURSES.find((c) => c.ids.includes(doc.id));
  const no = parseInt(doc.id.slice(1), 10);
  const { out, secs } = blocks(doc, logo);
  const data = {
    logo, title: inline(doc.title), lead: inline(doc.lead), course: esc(course.label + ' · ' + course.name), lesson: 'الدرس ' + no,
    label: esc('الدرس ' + no + ' · ' + doc.title), foot: esc('أكاديمية آكسي · الدليل المرافق · ' + course.name),
    secs: secs.map((s) => ({ ...s, text: inline(s.text) })), blocks: out,
  };
  return { course, no, page: `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${esc(doc.title)}</title><style>${CSS}</style></head><body><div id="root"></div>` +
    `<script type="application/json" id="data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script><script>${SCRIPT}</script></body></html>` };
}

fs.mkdirSync(outDir, { recursive: true });
// the logo is shown at most 33 mm wide, so a 700 px copy is plenty and keeps each PDF small
const smallLogo = path.join(outDir, '_logo.png');
execFileSync('python3', ['-c', 'import sys; from PIL import Image; im = Image.open(sys.argv[1]); im.resize((700, round(700 * im.height / im.width)), Image.LANCZOS).save(sys.argv[2], optimize=True)', logoFile, smallLogo]);
const br = await chromium.launch({ args: ['--allow-file-access-from-files'] });
let bad = false;
for (const src of srcFiles) {
  const doc = parse(fs.readFileSync(src, 'utf8'));
  const { course, no, page } = html(doc, url(smallLogo));
  const out = path.join(outDir, `AxiAcademy_Guide_${doc.id}.pdf`);
  const tmp = path.join(outDir, `_${doc.id}.html`);
  fs.writeFileSync(tmp, page);
  const pg = await br.newPage();
  const errs = [];
  pg.on('pageerror', (e) => errs.push('pageerror ' + String(e)));
  pg.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await pg.goto('file://' + tmp, { waitUntil: 'load' });
  const info = await (await pg.waitForFunction(() => window.__info, null, { timeout: 120000 })).jsonValue();
  await pg.pdf({ path: out, width: '210mm', height: '297mm', printBackground: true, preferCSSPageSize: true });
  await pg.close();
  if (!process.env.KEEP_HTML) fs.unlinkSync(tmp);
  const mf = out + '.marks.json';
  fs.writeFileSync(mf, JSON.stringify({ marks: info.marks, meta: {
    '/Title': `${doc.title} · الدليل المرافق للدرس ${no} · أكاديمية آكسي`, '/Author': 'Axi Iraq · أكاديمية آكسي',
    '/Subject': `${course.label} · ${course.name}: ${doc.lead}` } }));
  execFileSync('python3', [path.join(HERE, 'bookmarks.py'), out, mf], { stdio: 'inherit' });
  fs.unlinkSync(mf);
  const issues = info.problems.concat(errs);
  console.log(`${doc.id}\t${info.pages} pages\tlast page ${info.fill}% full\t${path.basename(out)}` + (issues.length ? '\n  ' + issues.join('\n  ') : ''));
  bad ||= issues.length > 0 || info.pages < 6 || info.pages > 10;
}
await br.close();
fs.unlinkSync(smallLogo);
if (bad) process.exitCode = 1;
