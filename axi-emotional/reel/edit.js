// Axi · «بناها متداولون» brand film — the edit. Every cut and every word sits on the 128 BPM grid of Mixkit #543
// (beat 0.46875 s, bar 1.875 s). Breath 28.125–30.0, lift 30.0, arrival 52.5, music fade 58.5–60.0. Client-approved script (docs/SCRIPT_FINAL.md).
(() => {
const { clamp, lerp, sstep } = OM;
// shot: [t0, t1, clip, src(s), rate, z0, z1, dx0, dy0, dx1, dy1, fx]
const S = (t0, t1, clip, src, rate, z0, z1, d = [0, 0, 0, 0], fx = {}) => [t0, t1, clip, src, rate, z0, z1, d[0], d[1], d[2], d[3], fx];
// card boundaries (s): 13 feeling cards, 2 Axi cards, the brand line, the lockup over Noor
const C = [0, 3.75, 6.5625, 9.375, 12.1875, 15.0, 17.8125, 21.5625, 25.3125, 30.0, 33.75, 37.5, 40.3125, 44.0625, 47.8125, 52.5, 55.3125, 60.0];
const LIFT = 30.0, ARRIVE = 52.5, END = 55.3125;
const XF = 0.2;                                   // soft crossfade into most shots
const NIGHT = 'contrast(1.12) saturate(0.72) brightness(0.92)', DAWN = 'contrast(1.08) saturate(0.80) brightness(0.98)';
const COOL = 'rgba(70,110,150,0.22)', WARM = 'rgba(255,214,170,0.14)';

window.EDL = [
  S(C[0], C[1], 'c01', 0.10, 0.95, 1.00, 1.06, [0, 0, 0, -20], { filter: NIGHT, tint: COOL, ay: 820 }),
  S(C[1], C[2], 'c02', 0.40, 0.95, 1.04, 1.00, [0, 0, 0, 0], { filter: NIGHT, tint: COOL, xf: XF }),
  S(C[2], C[3], 'c03', 1.70, 1.00, 1.00, 1.05, [0, 0, 0, -10], { filter: NIGHT, tint: COOL, ay: 1100 }),
  S(C[3], C[4], 'c04', 0.40, 1.00, 1.02, 1.07, [0, 0, 0, 0], { filter: NIGHT, tint: COOL, xf: XF }),
  S(C[4], C[5], 'c05', 0.50, 1.00, 1.00, 1.04, [0, 10, 0, -10], { filter: NIGHT, tint: COOL, xf: XF }),
  S(C[5], C[6], 'c06', 0.40, 0.95, 1.05, 1.00, [0, 0, 0, 0], { filter: NIGHT, tint: COOL, xf: XF }),
  S(C[6], C[7], 'c07b', 0.20, 1.00, 1.00, 1.05, [0, 0, 0, 0], { filter: NIGHT, tint: COOL, xf: XF, ay: 900 }),   // Saeed, Tigris riverwalk, Baghdad
  S(C[7], C[8], 'c08', 0.30, 1.00, 1.02, 1.07, [0, 0, 0, 0], { filter: NIGHT, tint: COOL, xf: XF }),
  // the breath: the doubt card sinks to near black before the lift
  S(C[8], C[9], 'c09', 0.20, 0.95, 1.00, 1.05, [0, 0, 0, 0], { filter: NIGHT, tint: COOL, xf: XF, dim: u => 0.78 * sstep(2.6, 4.6, u) }),
  // LIFT: hard cut into the blue-hour terrace
  S(C[9], C[10], 'c10', 0.20, 1.00, 1.08, 1.02, [0, 0, 0, 0], { filter: DAWN, ease: 'out' }),
  S(C[10], C[11], 'c11', 0.40, 1.00, 1.00, 1.05, [0, 0, 0, 0], { filter: DAWN, tint: WARM, xf: XF }),
  S(C[11], C[12], 'c12', 0.40, 1.00, 1.02, 1.07, [0, 0, 0, 0], { filter: NIGHT, tint: COOL, xf: XF }),
  S(C[12], C[13], 'c13', 0.30, 1.00, 1.00, 1.05, [0, 0, 0, -10], { filter: DAWN, tint: WARM, xf: XF }),
  S(C[13], C[14], 'c14', 0.30, 1.00, 1.00, 1.04, [0, 0, 0, 0], { filter: DAWN }),
  S(C[14], C[15], 'c15', 0.20, 0.95, 1.00, 1.06, [0, 0, 0, 30], { filter: DAWN, tint: WARM, xf: XF, ay: 1400 }),
  // ARRIVAL: hard cut to the ziggurat for the brand line
  S(C[15], C[16], 'c16', 0.30, 1.00, 1.06, 1.00, [0, 0, 0, 0], { filter: 'contrast(1.08) saturate(0.62) brightness(0.86)', tint: COOL, ease: 'out' }),
  // END: Noor under the giant chart screen carries the lockup to the last frame
  S(C[16], C[17] + 0.01, 'c17', 0.15, 1.00, 1.00, 1.06, [0, 0, 0, 0], { filter: NIGHT, tint: COOL, xf: 0.35, ay: 760 }),
];

// ── type ──
// line 1 bold, revealed right to left out of a blur; line 2 light, rising out of its baseline; one key word per card
// pulses and draws a red underline; a white hairline opens above; the card pushes in slowly and leaves word by word.
const I = [];
const T = (t0, t1, x, y, size, lines, wt, o = {}) => (I.push(Object.assign({ t0, t1, x, y, size, lines, wt, cls: 'ar shadow' }, o)), I[I.length - 1]);
const mk = (s, c, st, key) => s.split(' ').map(w => [w, c + (w === key ? ' k' : ''), st]);
const rule = (t0, t1, y, w = 72, o = {}) => I.push(Object.assign({ t0, t1, x: 540, y, w, h: 2, enter: 'none', fadeIn: 0.01,
  html: '<div style="width:100%;height:100%;background:rgba(255,255,255,.78);border-radius:1px;box-shadow:0 0 10px rgba(0,0,0,.5)"></div>',
  upd: (t, el) => { const a = 1 - Math.pow(1 - clamp((t - t0) / 0.55), 3), b = sstep(t1 - 0.45, t1 - 0.12, t);
    el.firstChild.style.transform = `scaleX(${(a * (1 - b)).toFixed(3)})`; } }, o));
function card(i, l1, l2, y, key, o = {}) {
  const t0 = C[i - 1], t1 = C[i], a = mk(l1, 'l1', 'mask', key), b = l2 ? mk(l2, o.l2c || 'l2', 'rise', key) : [];
  const wt = []; let t = t0 + 0.12; a.forEach(() => { wt.push(t); t += 0.11; }); t += 0.22; b.forEach(() => { wt.push(t); t += 0.09; });
  rule(t0 + 0.02, t1 - 0.02, y - 124, 72, o.dimAt ? { dimAt: o.dimAt } : {});
  return T(t0, t1 - 0.02, 540, y, 66, b.length ? [a, b] : [a], wt, Object.assign({ xo: 0.42, push: 0.03, lsize: [80, 64] }, o));
}
const TOPY = 360, LOWY = 1430, SAEEDY = 360;
card(1, 'أول صفقة ناجحة', 'لا تنساها أبدا', TOPY, 'ناجحة');
card(2, 'يرتد السعر', 'من الخط الذي رسمته', TOPY, 'رسمته');
card(3, 'تلتزم بخطتك', 'فتؤتي ثمارها', TOPY, 'ثمارها');
card(4, 'تشتري متأخرا', 'عند أعلى سعر', LOWY, 'متأخرا');
card(5, 'تدخل رغم الخوف', 'وتنجح الصفقة', LOWY, 'الخوف');
card(6, 'صفقة مفتوحة', 'ولا تستطيع النوم', TOPY, 'النوم');
card(7, 'تراقب الخسارة تكبر', 'ولا تغلق الصفقة', SAEEDY, 'تكبر');
card(8, 'تضغط زر الشراء', 'ويتحرك السعر معك فورا', TOPY, 'فورا');
card(9, 'خسارة بعد خسارة', 'وتشك في نفسك', TOPY, 'نفسك', { xo: 0, dimAt: [28.125, 29.7, 0.15] });
card(10, 'قررت ألا تدخل', 'وكنت على حق', TOPY, 'حق');
card(11, 'تستيقظ', 'والصفقة وصلت إلى هدفها', TOPY, 'هدفها');
card(12, 'خبر مفاجئ', 'يقلب السوق ضدك', TOPY, 'مفاجئ');
card(13, 'تشعر أن شموعك', 'تحرك أحداث العالم', TOPY, 'شموعك');
card(14, 'في آكسي', 'نحن متداولون مثلك', TOPY, 'آكسي', { lsize: [80, 72], l2c: 'b' });
card(15, 'لذلك نفهم ما تمر به', 'في الأيام الصعبة والجيدة', TOPY, 'نفهم');
// brand line at the arrival: both «traders» underline in turn; the Latin line tracks in beneath
rule(ARRIVE + 0.02, END - 0.02, 252, 96);
T(ARRIVE, END - 0.02, 540, 380, 84, [mk('بناها متداولون', 'b', 'mask', 'متداولون'), mk('من أجل المتداولين', 'b', 'mask', 'المتداولين')],
  [ARRIVE + 0.06, ARRIVE + 0.2, ARRIVE + 0.62, ARRIVE + 0.74, ARRIVE + 0.86], { xo: 0.42, push: 0.025, lsize: [84, 84], lh: 1.32 });
T(53.4375, END - 0.02, 540, 572, 46, [[['Built by traders, for traders', '', 'track']]], [53.4375], { cls: 'lat shadow', xo: 0.3 });
// watermark: small white Axi logo, top-left, under the platform top bar, until the lockup
I.push({ t0: 0, t1: END, x: 118, y: 196, html: '<img src="img/axi_white.png" style="width:120px;display:block;opacity:.62">', layer: 'top', enter: 'none', fadeIn: 0.01, out: 0.3 });
// lockup over Noor: the logo wipes on left to right with a bloom that settles, a hairline opens, «منذ 2007», the Latin line
const LT = END + 0.3;
I.push({ t0: LT, t1: 60.01, x: 540, y: 318, w: 440, h: 247, layer: 'top', enter: 'pop', zeta: 0.8, omega: 9, fadeIn: 0.25,
  html: '<img src="img/axi_white.png" style="width:440px;display:block">',
  upd: (t, el) => { const u = t - LT, p = 115 * (1 - Math.pow(1 - clamp(u / 0.8), 3)), gl = clamp(u / 0.35) * Math.exp(-Math.max(0, u - 0.35) * 1.6), im = el.firstChild;
    im.style.webkitMaskImage = im.style.maskImage = p >= 114.9 ? 'none' : `linear-gradient(90deg,#000 ${(p - 15).toFixed(1)}%,transparent ${p.toFixed(1)}%)`;
    im.style.filter = `drop-shadow(0 0 ${(6 + 30 * gl).toFixed(1)}px rgba(255,255,255,${(0.22 + 0.5 * gl).toFixed(2)})) drop-shadow(0 2px 14px rgba(0,0,0,.55))`; } });
rule(END + 0.95, 60.01, 486, 120, { layer: 'top' });
T(END + 1.05, 60.01, 540, 562, 60, [[['منذ', 'l2', 'mask'], ['2007', 'l1 k', 'mask']]], [END + 1.05, END + 1.2], { layer: 'top' });
T(END + 1.6, 60.01, 540, 654, 42, [[['Built by traders, for traders', '', 'track']]], [END + 1.6], { layer: 'top', cls: 'lat shadow' });

window.ITEMS = I;
window.FLASH = [[LIFT, 'rgba(255,246,232,1)', 0.38, 0.7], [ARRIVE, 'rgba(255,246,232,1)', 0.45, 0.8]];
window.OVL = [
  { t0: 0, t1: 0.5, draw: (g, t) => { g.fillStyle = `rgba(0,0,0,${(0.45 * (1 - sstep(0, 0.5, t))).toFixed(3)})`; g.fillRect(0, 0, 1080, 1920); } },   // open on picture, lifting from half-dark
  { t0: 0, t1: END, draw: (g, t) => {                                                                                                                // soft band behind the type
      const top = [4, 5].indexOf(C.findIndex(c => c > t)) < 0;
      const y = top ? 0 : 1080, gr = g.createLinearGradient(0, y, 0, y + 840);
      if (top) { gr.addColorStop(0, 'rgba(2,4,8,0.55)'); gr.addColorStop(1, 'rgba(2,4,8,0)'); } else { gr.addColorStop(0, 'rgba(2,4,8,0)'); gr.addColorStop(1, 'rgba(2,4,8,0.6)'); }
      g.fillStyle = gr; g.fillRect(0, y, 1080, 840); } },
  { t0: END, t1: 60.01, draw: (g, t) => {                                                                                                            // the screen's sky darkens under the lockup
      const k = sstep(END, END + 0.8, t), gr = g.createLinearGradient(0, 0, 0, 900);
      gr.addColorStop(0, `rgba(2,4,8,${(0.72 * k).toFixed(3)})`); gr.addColorStop(0.62, `rgba(2,4,8,${(0.5 * k).toFixed(3)})`); gr.addColorStop(1, 'rgba(2,4,8,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 1080, 900);
      g.fillStyle = `rgba(0,0,0,${(0.35 * sstep(58.9, 60, t)).toFixed(3)})`; g.fillRect(0, 0, 1080, 1920); } },
];

// ── SFX: music-led, only three accents ──
const ev = []; const add = (t, kind, v = 0.6, pan = 0) => ev.push({ t: +t.toFixed(3), kind, v, pan });
add(LIFT, 'impact', 0.55); add(ARRIVE, 'impact', 0.6); add(LT, 'whoosh', 0.3);
window.EVENTS = { T: 60, events: ev.sort((a, c) => a.t - c.t) };
})();
