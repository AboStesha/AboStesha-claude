// Axi · «بناها متداولون» brand film — the edit. Every cut and every word sits on the 128 BPM grid of Mixkit #543
// (beat 0.46875 s, bar 1.875 s). Breath 28.125–30.0, lift 30.0, arrival 52.5, music fade 58.5–60.0. Client-approved script (docs/SCRIPT_FINAL.md).
(() => {
const { clamp, lerp, sstep } = OM;
// shot: [t0, t1, clip, src(s), rate, z0, z1, dx0, dy0, dx1, dy1, fx]
const S = (t0, t1, clip, src, rate, z0, z1, d = [0, 0, 0, 0], fx = {}) => [t0, t1, clip, src, rate, z0, z1, d[0], d[1], d[2], d[3], fx];
// card boundaries (s): 13 feeling cards, 2 Axi cards, the brand line, the end card
const C = [0, 3.75, 6.5625, 9.375, 12.1875, 15.0, 17.8125, 21.5625, 25.3125, 30.0, 33.75, 37.5, 40.3125, 44.0625, 47.8125, 52.5, 55.3125, 60.0];
const LIFT = 30.0, ARRIVE = 52.5, END = 55.3125;
const XF = 0.32;                                   // soft crossfade into most shots
const NIGHT = 'contrast(1.12) saturate(0.72) brightness(0.92)', DAWN = 'contrast(1.08) saturate(0.80) brightness(0.98)';
const COOL = 'rgba(70,110,150,0.22)', WARM = 'rgba(255,214,170,0.14)';

window.EDL = [
  S(C[0], C[1], 'c01', 0.10, 0.95, 1.00, 1.06, [0, 0, 0, -20], { filter: NIGHT, tint: COOL, ay: 820 }),
  S(C[1], C[2], 'c02', 0.40, 0.95, 1.04, 1.00, [0, 0, 0, 0], { filter: NIGHT, tint: COOL, xf: XF }),
  S(C[2], C[3], 'c03', 0.60, 1.00, 1.00, 1.05, [0, 0, 0, -10], { filter: NIGHT, tint: COOL, xf: XF, ay: 1100 }),
  S(C[3], C[4], 'c04', 0.40, 1.00, 1.02, 1.07, [0, 0, 0, 0], { filter: NIGHT, tint: COOL, xf: XF }),
  S(C[4], C[5], 'c05', 0.50, 1.00, 1.00, 1.04, [0, 10, 0, -10], { filter: NIGHT, tint: COOL, xf: XF }),
  S(C[5], C[6], 'c06', 0.40, 0.95, 1.05, 1.00, [0, 0, 0, 0], { filter: NIGHT, tint: COOL, xf: XF }),
  S(C[6], C[7], 'c07', 0.30, 1.00, 1.00, 1.06, [0, 0, 0, 0], { filter: NIGHT, tint: COOL, xf: XF, ay: 900 }),
  S(C[7], C[8], 'c08', 0.30, 1.00, 1.02, 1.07, [0, 0, 0, 0], { filter: NIGHT, tint: COOL, xf: XF }),
  // the breath: the doubt card sinks to near black before the lift
  S(C[8], C[9], 'c09', 0.20, 0.95, 1.00, 1.05, [0, 0, 0, 0], { filter: NIGHT, tint: COOL, xf: XF, dim: u => 0.9 * sstep(2.6, 4.6, u) }),
  // LIFT: hard cut into the blue-hour terrace
  S(C[9], C[10], 'c10', 0.20, 1.00, 1.08, 1.02, [0, 0, 0, 0], { filter: DAWN, ease: 'out' }),
  S(C[10], C[11], 'c11', 0.40, 1.00, 1.00, 1.05, [0, 0, 0, 0], { filter: DAWN, tint: WARM, xf: XF }),
  S(C[11], C[12], 'c12', 0.40, 1.00, 1.02, 1.07, [0, 0, 0, 0], { filter: NIGHT, tint: COOL, xf: XF }),
  S(C[12], C[13], 'c13', 0.30, 1.00, 1.00, 1.05, [0, 0, 0, -10], { filter: DAWN, tint: WARM, xf: XF }),
  S(C[13], C[14], 'c14', 0.30, 1.00, 1.00, 1.04, [0, 0, 0, 0], { filter: DAWN, xf: XF }),
  S(C[14], C[15], 'c15', 0.20, 0.95, 1.00, 1.06, [0, 0, 0, 30], { filter: DAWN, tint: WARM, xf: XF, ay: 1400 }),
  // ARRIVAL: hard cut to the ziggurat for the brand line
  S(C[15], C[16], 'c16', 0.30, 1.00, 1.06, 1.00, [0, 0, 0, 0], { filter: DAWN, tint: WARM, ease: 'out' }),
  S(C[16], C[17] + 0.01, 'none', 0, 0, 1, 1, [0, 0, 0, 0], { card: true }),
];

// ── type ──
const I = [];
const T = (t0, t1, x, y, size, lines, wt, o = {}) => (I.push(Object.assign({ t0, t1, x, y, size, lines, wt, cls: 'ar shadow' }, o)), I[I.length - 1]);
const words = (s, c = '') => s.split(' ').map(w => [w, c]);
// two lines: line 1 word by word from t0+0.15, line 2 after a short breath
function card(i, l1, l2, y, o = {}) {
  const t0 = C[i - 1], t1 = C[i], a = words(l1), b = l2 ? words(l2, 'l2') : [];
  const wt = []; let t = t0 + 0.15; a.forEach(() => { wt.push(t); t += 0.13; }); t += 0.28; b.forEach(() => { wt.push(t); t += 0.13; });
  return T(t0, t1 - 0.02, 540, y, 66, b.length ? [a, b] : [a], wt, Object.assign({ out: 0.32, lsize: [76, 66], drift: 3 }, o));
}
const TOPY = 360, LOWY = 1430;
card(1, 'أول صفقة ناجحة', 'لا تنساها أبدا', TOPY);
card(2, 'يرتد السعر', 'من الخط الذي رسمته', TOPY);
card(3, 'تلتزم بخطتك', 'فتؤتي ثمارها', TOPY);
card(4, 'تشتري متأخرا', 'عند أعلى سعر', LOWY);
card(5, 'تدخل رغم الخوف', 'وتنجح الصفقة', LOWY);
card(6, 'صفقة مفتوحة', 'ولا تستطيع النوم', TOPY);
card(7, 'تراقب الخسارة تكبر', 'ولا تغلق الصفقة', LOWY);
card(8, 'تضغط زر الشراء', 'ويتحرك السعر معك فورا', TOPY);
card(9, 'خسارة بعد خسارة', 'وتشك في نفسك', TOPY, { out: 0, dimAt: [28.125, 29.7, 0] });
card(10, 'قررت ألا تدخل', 'وكنت على حق', TOPY);
card(11, 'تستيقظ', 'والصفقة وصلت إلى هدفها', TOPY);
card(12, 'خبر مفاجئ', 'يقلب السوق ضدك', TOPY);
card(13, 'تشعر أن شموعك', 'تحرك أحداث العالم', TOPY);
card(14, 'في آكسي', 'نحن متداولون مثلك', TOPY, { lsize: [72, 72], lcls: ['', 'b'] });
card(15, 'لذلك نفهم ما تمر به', 'في الأيام الصعبة والجيدة', TOPY);
// brand line at the arrival, Latin beneath on its own line
T(ARRIVE, END - 0.02, 540, 380, 80, [words('بناها متداولون', 'b'), words('من أجل المتداولين', 'b')],
  [ARRIVE + 0.06, ARRIVE + 0.2, ARRIVE + 0.62, ARRIVE + 0.76, ARRIVE + 0.9], { out: 0.25, lsize: [84, 84], lh: 1.32 });
T(53.4375, END - 0.02, 540, 560, 40, [words('Built by traders, for traders')], [53.4375, 53.52, 53.6, 53.68, 53.76], { cls: 'lat shadow', out: 0.25 });
// end card: red, white Axi logo, since 2007, the Latin line
I.push({ t0: END, t1: 60.01, x: 540, y: 860, html: '<img src="img/axi_white.png" style="width:560px;display:block">', layer: 'top', enter: 'pop', te: END + 0.05, zeta: 0.75, omega: 14 });
T(END + 0.55, 60.01, 540, 1150, 58, [words('منذ 2007')], [END + 0.55, END + 0.7], { layer: 'top', cls: 'ar' });
T(END + 0.9, 60.01, 540, 1250, 36, [words('Built by traders, for traders')], [END + 0.9, END + 0.96, END + 1.02, END + 1.08, END + 1.14], { layer: 'top', cls: 'lat' });

window.ITEMS = I;
window.FLASH = [[LIFT, 'rgba(255,246,232,1)', 0.38, 0.7], [ARRIVE, 'rgba(255,246,232,1)', 0.45, 0.8]];
window.OVL = [
  { t0: 0, t1: 0.7, draw: (g, t) => { g.fillStyle = `rgba(0,0,0,${(1 - sstep(0, 0.7, t)).toFixed(3)})`; g.fillRect(0, 0, 1080, 1920); } },          // open from black
  { t0: 0, t1: END, draw: (g, t) => {                                                                                                                // soft band behind the type
      const top = [4, 5, 7].indexOf(C.findIndex(c => c > t)) < 0;
      const y = top ? 0 : 1080, gr = g.createLinearGradient(0, y, 0, y + 840);
      if (top) { gr.addColorStop(0, 'rgba(2,4,8,0.55)'); gr.addColorStop(1, 'rgba(2,4,8,0)'); } else { gr.addColorStop(0, 'rgba(2,4,8,0)'); gr.addColorStop(1, 'rgba(2,4,8,0.6)'); }
      g.fillStyle = gr; g.fillRect(0, y, 1080, 840); } },
  { t0: END, t1: 60.01, draw: (g, t) => { g.fillStyle = '#E4002E'; g.fillRect(0, 0, 1080, 1920);
      g.fillStyle = `rgba(0,0,0,${(0.25 * (1 - sstep(END, END + 0.5, t))).toFixed(3)})`; g.fillRect(0, 0, 1080, 1920); } },
];

// ── SFX: music-led, only three accents ──
const ev = []; const add = (t, kind, v = 0.6, pan = 0) => ev.push({ t: +t.toFixed(3), kind, v, pan });
add(LIFT, 'impact', 0.55); add(ARRIVE, 'impact', 0.6); add(END - 0.12, 'whoosh', 0.35);
window.EVENTS = { T: 60, events: ev.sort((a, c) => a.t - c.t) };
})();
