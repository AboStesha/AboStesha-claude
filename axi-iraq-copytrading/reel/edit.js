// Axi Iraq · Copy Trading reel — the edit. Every cut and every word sits on the 124 BPM grid of Mixkit #1012
// (beat 0.483871 s, drop A 1.9355, stop hit 13.548, drop B 15.484, final hit 27.097). Beat numbers b(n) are absolute.
(() => {
const BT = 0.483871, E8 = BT / 2, b = n => +(n * BT).toFixed(4);
const { clamp, lerp, sstep } = OM;
// shot: [t0, t1, clip, src(s), rate, z0, z1, dx0, dy0, dx1, dy1, fx]
const S = (t0, t1, clip, src, rate, z0, z1, d = [0, 0, 0, 0], fx = {}) => [t0, t1, clip, src, rate, z0, z1, d[0], d[1], d[2], d[3], fx];
const ramp = (a, c, dur) => u => u <= dur ? a * u + (c - a) * u * u / (2 * dur) : a * dur + (c - a) * dur / 2 + c * (u - dur);   // rate a → c over dur
const STOP = b(28), DROPB = b(32), FINAL = 27.0968, CTA = 28.1;

window.EDL = [
  // ── 01–02 HOOK (intro bar, no kick) ──
  S(0, b(2), 'k01_hook', 0.0, 1.0, 1.0, 1.035, [0, 0, 0, -10], { ay: 760 }),
  S(b(2), b(4), 'k01_hook', 0.968, 1.0, 1.18, 1.21, [0, -30, 0, -40], { ay: 760, rot: -0.026, zout: [0.24, 0.14] }),
  // ── 03 DROP A: the tablet into the lens, red frames, match cut into the glass space ──
  S(b(4), b(5), 'k02_push', 3.0, 3.3, 1.0, 1.22, [0, 0, 0, 40], { ease: 'in', ay: 700 }),
  S(b(5), b(8), 'k16_glass', 0.2, 1.0, 1.0, 1.12, [0, 0, 0, 0], { zin: [0.3, 0.5], zout: [0.16, 0.7], filter: 'contrast(1.04) grayscale(1) brightness(1.03)' }),
  // ── 04 traders from around the world ──
  S(b(8), b(12), 'k16_glass', 1.8, 0.9, 1.15, 1.02, [0, 0, -20, 0], { zin: [0.25, 0.35], whipOut: [0.13, -1], filter: 'contrast(1.04) grayscale(1) brightness(1.03)' }),
  // ── 05 step 01: choose ──
  S(b(12), b(14), 'k04_noor_tablet', 0.3, 1.0, 1.04, 1.1, [0, 0, 0, 0], { whipIn: [0.13, -1], ay: 640 }),
  S(b(14), b(16), 'k04_noor_tablet', 2.4, 1.0, 1.28, 1.34, [0, 70, 0, 60], { ay: 640 }),
  // ── 06 step 02: size + risk ──
  S(b(16), b(18), 'k05_coin', 0.15, 1.15, 1.30, 1.15, [0, 120, 0, 120], { ease: 'snap', nearest: true }),
  S(b(18), b(20), 'k05_coin', 2.1, 1.0, 1.18, 1.26, [0, 40, 0, 30], { nearest: true }),
  // ── 07 step 03: split screen, the trade travels ──
  S(b(20), b(24), 'k06_saeed_tap', 1.5, 0.5, 1.0, 1.06, [0, 0, 0, 0], { ax: 600, ay: 1150, split: { h: true, clip: 'k07_noor_glow', src: 1.3, rate: 0.9, zz0: 1.0, zz1: 1.05, ox1: 210, ox2: -150, ax2: 540, ay2: 760, pulse2: [10.645] }, pulse: [10.16] }),
  // ── 08 no skills, no minimum ──
  S(b(24), b(26), 'k08_step', 0.2, 1.0, 1.02, 1.08, [0, 0, 0, 0], { ay: 700 }),
  S(b(26), STOP, 'k08_step', 2.5, 1.0, 1.2, 1.26, [0, 0, 0, 0], { ay: 0 }),
  // ── 09 BREAK: the lid shuts on the stop hit, tape-stop ramp, dark, dawn line ──
  S(STOP, DROPB, 'k09_laptop_close', 0.62, 1.0, 1.08, 1.25, [0, 0, 0, 0], { ramp: ramp(18, 0.2, 0.2), dim: u => 0.12 + 0.76 * sstep(1.25, 1.42, u) }),
  // ── 10 DROP B: holiday / family ──
  S(DROPB, b(33), 'k15_tigris', 1.2, 1.0, 1.0, 1.06, [0, 0, 0, 0], { zin: [0.22, 0.3] }),
  S(b(33), b(34), 'k10_marsh', 1.4, 1.0, 1.04, 1.1),
  S(b(34), b(36), 'k11_family', 2.55, 1.0, 1.0, 1.06, [0, 0, 0, 0], { zout: [0.3, 2.8], ax: 546, ay: 1040 }),
  // ── 11 inside the phone ──
  S(b(36), b(40), 'k16_glass', 3.6, 0.7, 1.0, 1.1, [0, 0, 0, 0], { zin: [0.3, 0.9], flip: true, filter: 'contrast(1.04) grayscale(1) brightness(1.03)' }),
  // ── 12 control ──
  S(b(40), b(42), 'k12_noor_turn', 0.6, 1.0, 1.0, 1.05, [0, 0, 0, 0], { zin: [0.3, 0.35], ay: 640 }),
  S(b(42), b(44), 'k12_noor_turn', 2.7, 1.0, 1.26, 1.32, [0, 80, 0, 70], { ay: 640 }),
  // ── 13 proof ──
  S(b(44), b(46), 'k13_stack', 0.3, 1.0, 1.0, 1.08),
  S(b(46), b(48), 'k13_stack', 2.6, 1.0, 1.25, 1.32, [0, 40, 0, 40]),
  // ── 14 one app ──
  S(b(48), b(50), 'k14_phone3d', 0.4, 1.0, 1.16, 1.09, [0, 60, 0, 60], { ease: 'snap' }),
  S(b(50), b(52), 'k14_phone3d', 3.6, 1.0, 1.17, 1.2, [0, 150, 0, 160]),
  // ── 15 CTA ──
  S(b(52), b(54), 'k04_noor_tablet', 3.0, 1.0, 1.05, 1.1, [0, 0, 0, 0], { ay: 640 }),
  S(b(54), FINAL, 'k07_noor_glow', 3.3, 1.0, 1.2, 1.26, [0, 120, 0, 115], { ay: 640 }),
  // ── 16 red end card (DOM), then the hook frame played backwards so the reel loops into frame 0 ──
  S(FINAL, CTA, 'k01_hook', 1.9, 0, 1.0, 1.0),
  S(CTA, 30.01, 'k01_hook', 1.9, -1.0, 1.0, 1.0, [0, 0, 0, 0], { ay: 760 }),
];

// ── DOM items: type (lines) and glass UI (html) ──
const I = [];
const T = (t0, t1, x, y, size, lines, wt, o = {}) => (I.push(Object.assign({ t0, t1, x, y, size, lines, wt, cls: 'ar' }, o)), I[I.length - 1]);
const U = (t0, t1, x, y, html, o = {}) => (I.push(Object.assign({ t0, t1, x, y, html }, o)), I[I.length - 1]);
const W = (s, c = '', st) => [s, c, st];                     // a word
const words = (str, c = '', st) => str.split(' ').map(s => W(s, c, st));
const steps = (t, n, d = E8) => Array.from({ length: n }, (_, i) => +(t + i * d).toFixed(4));
// exits shared by every item of a beat
const zoomThrough = tc => t => { const k = clamp((t - (tc - 0.16)) / 0.16); return { sc: 1 + 2.2 * k * k * k, op: 1 - k }; };
const whip = (tc, dir = -1) => t => { const k = clamp((t - (tc - 0.13)) / 0.13); return { dx: dir * 1500 * k * k }; };
const join = (...fs) => t => fs.reduce((m, f) => { const r = f(t); return { dx: (m.dx || 0) + (r.dx || 0), dy: (m.dy || 0) + (r.dy || 0), sc: (m.sc ?? 1) * (r.sc ?? 1), op: (m.op ?? 1) * (r.op ?? 1), rot: (m.rot || 0) + (r.rot || 0) }; }, {});
const drift = (t0, vx, vy, rot = 0) => t => ({ dx: (t - t0) * vx, dy: (t - t0) * vy, rot: (t - t0) * rot });
const stroke = (el, sel, k) => el.querySelectorAll(sel).forEach(p => { const L = +p.dataset.len; p.style.strokeDashoffset = (L * (1 - clamp(k))).toFixed(1); });

// step number: red Axi-font numerals drawn on as a stroke, then filled
const NUM = (t0, t1, x, y, n, move) => U(t0, t1, x, y,
  `<svg width="250" height="170" viewBox="0 0 250 170"><text x="125" y="140" text-anchor="middle" font-family="Inter" font-weight="400" font-size="170" letter-spacing="-6"
    fill="#E4002E" fill-opacity="0" stroke="#E4002E" stroke-width="3" stroke-dasharray="1400" stroke-dashoffset="1400">${n}</text></svg>`,
  { enter: 'none', te: t0, move, upd: (t, el) => { const k = clamp((t - t0) / 0.35), tx = el.querySelector('text');
      tx.setAttribute('stroke-dashoffset', (1400 * (1 - (1 - Math.pow(1 - k, 3)))).toFixed(0)); tx.setAttribute('fill-opacity', sstep(t0 + 0.25, t0 + 0.45, t).toFixed(3)); } });
const TAG = '<div class="tag" style="position:absolute;left:24px;bottom:14px">للتوضيح فقط</div>';

// ═══ persistent brand layers ═══
U(0, 1.5, 926, 272, '<img src="img/lockup_white.png" style="width:200px;display:block">', { layer: 'top', enter: 'none', te: -1, out: 0.2, still: true });
U(0, 30.01, 81, 1615, '<img src="img/wm.png" style="width:54px;display:block;opacity:.85">', { layer: 'top', enter: 'none', te: -1, still: true,
  upd: (t, el) => { if (t >= FINAL && t < CTA) el.style.opacity = 0; } });

// ═══ 01–02 hook ═══
const suck = t => { const k = clamp((t - (b(4) - E8)) / E8); return { sc: 1 - 0.22 * k * k, op: 1 - k * k }; };
T(0, b(4), 540, 1390, 120, [[W('لا'), W('وقت؟')]], [-0.15, -0.135], { cls: 'ar gD pill', style: 'wipe', enter: 'pop', te: -0.05, dimAt: [b(2), 0.45],
  move: join(t => ({ dy: -128 * OM.spring(Math.max(0, t - b(2)), 0.7, 24) * (t >= b(2)) }), suck) });
T(b(2), b(4), 540, 1550, 120, [[W('لا'), W('خبرة؟', 'b')]], [b(2), b(2) + 0.06], { cls: 'ar gD pill', style: 'slam', slamAmp: 0.2, enter: 'pop', move: suck });

// ═══ 03 drop A ═══
T(b(4), b(8), 540, 1170, 104, [words('انسخ صفقات').map((w, i) => i ? w : W(w[0], 'b ul')), words('أصحاب الخبرة')], steps(b(4) + 0.02, 4, 0.06),
  { cls: 'ar gD pad', style: 'rise', enter: 'rise', move: zoomThrough(b(8)) });
T(b(5), b(8), 540, 1415, 52, [words('Axi Copy Trading')], steps(b(5), 3, 0.05), { cls: 'lat gL pill', style: 'rise', enter: 'up', move: zoomThrough(b(8)) });

// ═══ 04 the best traders, from around the world ═══
const W4 = whip(b(12));
[['img/forex_coin_EUR_rosegold.png', 985, 720, 180, 5, 12, -6], ['img/commodities_silver_bar_macro.png', 900, 1040, 240, 8, -8, 4],
 ['img/red_chrome_plate_AVAX.png', 815, 1360, 180, 6, 6, -8]].forEach(([src, x, y, w, bl, vx, r], i) =>
  U(b(8), b(12), x, y, `<img src="${src}" style="width:${w}px;display:block;filter:blur(${bl}px)">`, { enter: 'pop', te: b(8) + 0.05 * i, move: join(drift(b(8), vx, -8, r), W4) }));
T(b(8), b(12), 540, 330, 98, [[W('أفضل'), W('المتداولين', 'b')], words('من حول العالم')], [b(8) + 0.03, b(8) + 0.09, b(9), b(9) + 0.06, b(9) + 0.12],
  { cls: 'ar ink', style: 'rise', enter: 'none', te: b(8), move: W4 });
// sparkline: time runs left → right, as in trading apps
const spark = (pts, w = 250, h = 74) => { const xs = pts.map((v, i) => [i * w / (pts.length - 1), h - v * h]); const d = 'M' + xs.map(p => p.map(n => n.toFixed(1)).join(' ')).join(' L');
  return `<svg width="${w}" height="${h + 6}" style="display:block;overflow:visible"><path d="${d}" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" data-len="700" stroke-dasharray="700" stroke-dashoffset="700"/></svg>`; };
const card = (av, tok, pts, extra = '') => `<div style="direction:rtl;display:flex;align-items:center;gap:26px;padding:26px 30px 34px;height:100%;box-sizing:border-box">
  ${av}<div style="flex:1"><div style="display:flex;gap:8px;margin-bottom:14px">${tok.map(s => `<span class="chip chipD lat" style="font-size:26px;margin:0">${s}</span>`).join('')}</div>${spark(pts)}</div></div>${extra}${TAG}`;
const mono = s => `<div style="width:120px;height:120px;border-radius:50%;flex:none;background:linear-gradient(135deg,#8f9ba3,#4c565d);display:flex;align-items:center;justify-content:center;
  font:500 44px Inter;color:#fff;filter:blur(2.5px)">${s}</div>`;
const CARDS = [
  [640, 760, card('<canvas class="ins" width="240" height="240" style="width:120px;height:120px;border-radius:50%;flex:none;display:block"></canvas>', ['XAU/USD'],
    [.5, .62, .4, .58, .35, .66, .45, .6, .42, .52], '<div class="redpill ar" style="position:absolute;left:24px;top:22px;font-size:26px;padding:4px 22px 8px">انسخ</div>'),
    { clip: 'k03_saeed_turn', src: 0.6, rate: 1, z: 1.8, oy: 330 }],
  [540, 1040, card(mono('MR'), ['US500'], [.45, .58, .4, .6, .38, .55, .42, .6, .44, .47])],
  [440, 1320, card(mono('LK'), ['EUR/USD'], [.45, .55, .4, .6, .42, .58, .4, .56, .44, .47])],
];
CARDS.forEach(([x, y, html, ins], i) => { const te = b(8) + 0.12 + i * E8;
  U(b(8), b(12), x, y, html, { cls: 'gD', w: 600, h: 230, enter: 'rise', te, ins, fast: true,
    move: join(drift(b(8), -10 - 8 * i, -6), W4), upd: (t, el) => stroke(el, 'path', (t - te - 0.15) / 0.55) }); });
T(b(8) + 0.25, b(12), 540, 1560, 36, [[W('الأداء السابق لا يضمن النتائج المستقبلية', 'm')]], [b(8) + 0.25], { cls: 'ar gD pill', style: 'rise', enter: 'none', te: b(8) + 0.25, move: W4 });

// ═══ 05 step 01: choose your trader ═══
const glassWipe = tc => U(tc - 0.15, tc + 0.15, 540, 960, '', { layer: 'top', cls: 'gL', w: 1300, h: 2100, enter: 'none', te: tc - 0.15, still: true, fast: true,
  move: t => ({ dx: lerp(1350, -1350, OM.ease.cubicInOut(clamp((t - tc + 0.15) / 0.3))) }) });
NUM(b(12), b(16), 880, 835, '01');
T(b(12), b(16), 540, 1010, 100, [[W('اختر'), W('متداولك', 'b')], words('راجع أداءه السابق ورسومه', 'm', 'mask')], [b(12) + 0.08, b(12) + 0.14, ...steps(b(13), 4, BT / 4)],
  { cls: 'ar gD pad', lsize: [100, 50], enter: 'fold', omega: 30, zeta: 0.75, style: 'rise', caret: b(16) });
const chipsHTML = ['الربحية', 'نوع الأصل', 'مستوى المخاطر'].map((s, i) => `<span class="chip chipD" data-i="${i}" style="font-size:28px">${s}</span>`).join('');
const rowsHTML = ['سجل العوائد', 'الأسواق', 'رسوم الأداء'].map((s, i) => `<div style="display:flex;align-items:center;gap:22px;margin-top:10px"><div style="width:190px;font-size:30px">${s}</div>
  <div class="bar" data-i="${i}" style="flex:1;transform-origin:100% 50%"></div></div>`).join('');
U(b(12), b(16), 520, 1420, `<div dir="rtl" style="padding:20px 36px 24px;font-size:34px;font-weight:500;line-height:1.25">اكتشف المتداولين<div style="margin:10px -6px 2px">${chipsHTML}</div>${rowsHTML}
  <div style="margin-top:14px;font-size:34px;font-weight:400;opacity:.92">الأداء السابق لا يضمن النتائج المستقبلية</div></div><div class="tag" style="position:absolute;left:28px;top:20px">للتوضيح فقط</div>`,
  { cls: 'gD', w: 800, enter: 'up', te: b(12) + 0.18, upd: (t, el) => {
    el.querySelectorAll('.chip').forEach(c => { const on = t >= b(13) + c.dataset.i * BT * 0.5; c.style.background = on ? '#fff' : ''; c.style.color = on ? '#242528' : ''; });
    el.querySelectorAll('.bar').forEach(r => { r.style.transform = `scaleX(${(1 - Math.pow(1 - clamp((t - b(12) - 0.4 - r.dataset.i * 0.12) / 0.4), 3)) * [0.9, 0.62, 0.4][r.dataset.i]})`; }); } });
glassWipe(b(16));

// ═══ 06 step 02: trade size + risk ═══
NUM(b(16), b(20), 880, 265, '02');
T(b(16), b(20), 540, 525, 96, [words('حدد حجم التداول'), [W('والمخاطرة', 'b')]], steps(b(16), 4), { cls: 'ar gD pad', style: 'pop', enter: 'rise' });
const ring = (r, pct, col = '#242528', track = 'rgba(36,37,40,.14)') => `<svg width="${2 * r + 16}" height="${2 * r + 16}" style="display:block"><circle cx="${r + 8}" cy="${r + 8}" r="${r}" fill="none" stroke="${track}" stroke-width="12"/>
  <circle class="rg" cx="${r + 8}" cy="${r + 8}" r="${r}" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" transform="rotate(-90 ${r + 8} ${r + 8})"
  stroke-dasharray="${(2 * Math.PI * r).toFixed(1)}" stroke-dashoffset="${(2 * Math.PI * r).toFixed(1)}" data-c="${(2 * Math.PI * r).toFixed(1)}" data-p="${pct}"/></svg>`;
const setRing = (el, k) => el.querySelectorAll('.rg').forEach(c => { c.setAttribute('stroke-dashoffset', (c.dataset.c * (1 - c.dataset.p * clamp(k))).toFixed(1)); });
U(b(16), b(20), 520, 1435, `<div dir="rtl" style="display:flex;align-items:center;gap:36px;padding:26px 40px 64px;height:100%;box-sizing:border-box">
   <div style="flex:1"><div style="font-size:34px;font-weight:500;margin-bottom:34px">حجم التداول</div>
     <div style="position:relative;height:12px;border-radius:6px;background:rgba(36,37,40,.16)"><div class="fill" style="position:absolute;right:0;top:0;bottom:0;border-radius:6px;background:#242528"></div>
     <div class="knob" style="position:absolute;top:-20px;width:52px;height:52px;border-radius:50%;background:#E4002E;box-shadow:0 4px 14px rgba(0,0,0,.25)"></div></div>
     <div style="display:flex;justify-content:space-between;margin-top:30px;font-size:32px;opacity:.8"><span>منخفض</span><span>مرتفع</span></div></div>
   <div style="text-align:center">${ring(62, 0.32)}<div class="lat" style="font-size:34px;font-weight:500;margin-top:6px">Max Drawdown</div></div></div>${TAG}`,
  { cls: 'gL', w: 800, h: 335, enter: 'up', te: b(16) + 0.2, upd: (t, el) => {
    const k = OM.spring(Math.max(0, t - b(17)), 0.7, 14), pos = lerp(0.7, 0.24, k);              // knob settles low as «والمخاطرة» lands (8.468)
    el.querySelector('.knob').style.right = `calc(${(pos * 100).toFixed(2)}% - 26px)`; el.querySelector('.fill').style.width = (pos * 100).toFixed(2) + '%';
    setRing(el, (t - b(17.5)) / 0.5); } });

// ═══ 07 step 03: your account copies automatically (split) ═══
const DEP = b(21), ARR = b(22);
const along = (a, c) => t => a + (c - a) * OM.ease.cubicInOut(clamp((t - DEP) / (ARR - DEP)));
NUM(b(20), b(24), 830, 1160, '03');
T(b(20), b(24), 540, 915, 96, [words('حسابك ينسخ'), [W('صفقاته'), W('تلقائيا', 'b')]], steps(b(20) + 0.03, 4, 0.06), { cls: 'ar gD pad', style: 'rise', enter: 'rise' });
U(b(20), b(24), 650, 1330, `<div dir="rtl" style="display:flex;align-items:center;gap:16px;padding:14px 28px 18px;font-size:36px;font-weight:500">
  <span style="width:18px;height:18px;border-radius:50%;background:#E4002E;display:inline-block"></span>صفقة جديدة<span class="chip chipL lat" style="margin:0;font-size:28px">XAU/USD</span></div>`,
  { cls: 'gL op pill', enter: 'pop', te: DEP - 0.12, fast: true, move: t => ({ dx: along(0, -310)(t), dy: -40 * Math.sin(Math.PI * clamp((t - DEP) / (ARR - DEP))), sc: 1 - 0.08 * clamp((t - ARR) / 0.3) }) });

// ═══ 08 no advanced skills, no minimum deposit ═══
const check = `<svg width="64" height="64" viewBox="0 0 64 64" style="vertical-align:middle;margin-left:20px"><circle cx="32" cy="32" r="30" fill="#E4002E"/>
  <path d="M18 33 L28 43 L47 22" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" data-len="48" stroke-dasharray="48" stroke-dashoffset="48"/></svg>`;
const chk = te => (t, el) => stroke(el, 'path', (t - te - 0.1) / 0.25);
T(b(24), STOP, 520, 1150, 56, [[W(check, 'ic', 'pop'), ...words('بلا خبرة متقدمة')]], [b(24), b(24) + 0.06, b(24) + 0.12, b(24) + 0.18], { cls: 'ar gD pad ra', enter: 'slideL', te: b(24), upd: chk(b(24)), w: 700 });
T(b(25), STOP, 520, 1345, 56, [[W(check, 'ic', 'pop'), ...words('بلا حد أدنى للإيداع')], [W('تحتاج رصيدا يكفي لإدارة المخاطر', 'm', 'rise')]],
  [b(25), b(25) + 0.06, b(25) + 0.12, b(25) + 0.18, b(25) + 0.24, b(25) + 0.06], { cls: 'ar gD pad ra', lsize: [56, 38], enter: 'slideL', te: b(25), upd: chk(b(25)), w: 700 });

// ═══ 09 break ═══
T(13.834, DROPB, 540, 1240, 96, [words('ودع السهر'), words('على الشاشات')], steps(13.834, 4, 0.12), { cls: 'ar shadow', style: 'fade', enter: 'none', te: 13.834 });

// ═══ 10 holiday / family ═══
T(DROPB, b(34), 540, 560, 100, [[W('في'), W('إجازة؟', 'b')]], [DROPB, DROPB + 0.05], { cls: 'ar gD pill', style: 'pop', enter: 'pop', zeta: 0.45, omega: 26 });
T(b(34), b(36), 540, 640, 100, [[W('مع'), W('عائلتك؟', 'b')]], [b(34), b(34) + 0.05], { cls: 'ar gD pill', style: 'pop', enter: 'pop', zeta: 0.45, omega: 26, move: zoomThrough(b(36)) });

// ═══ 11 let the app handle the rest ═══
T(b(36), b(40), 540, 470, 96, [words('دع التطبيق'), [W('يتولى'), W('الباقي', 'b')]], steps(b(36) + 0.12, 4, 0.06), { cls: 'ar gD pad', style: 'rise', enter: 'rise', te: b(36) + 0.1 });
const NOTE = [['EUR/USD', b(36.5)], ['XAU/USD', b(37.5)], ['US500', b(38.5)]];
NOTE.forEach(([tok, te], i) => U(te, b(40), 520, 880, `<div dir="rtl" style="display:flex;align-items:center;gap:24px;padding:20px 28px;height:100%;box-sizing:border-box">
  <div style="width:84px;height:84px;border-radius:20px;background:#E4002E;flex:none;display:flex;align-items:center;justify-content:center"><img src="img/axi_white.png" style="width:58px"></div>
  <div style="flex:1"><div style="font-size:38px;font-weight:500">تم نسخ صفقة جديدة</div><div style="margin-top:8px;font-size:28px;opacity:.75"><span class="lat">${tok}</span> · الآن</div></div></div>`,
  { cls: 'gD', w: 800, h: 136, enter: 'drop', te, zeta: 0.55, omega: 24, fast: true,
    move: t => ({ dy: NOTE.slice(i + 1).reduce((s, [, t2]) => s + 158 * OM.spring(Math.max(0, t - t2), 0.62, 22) * (t >= t2), 0) }) }));
T(b(36.5), b(40), 520, 1320, 34, [[W('للتوضيح فقط', 'm')]], [b(36.5)], { cls: 'ar shadow', style: 'rise', enter: 'none', te: b(36.5) });

// ═══ 12 control stays with you ═══
T(b(40), b(44), 540, 1050, 100, [[W('التحكم'), W('بيدك', 'b')], words('أوقف النسخ متى شئت', 'm', 'mask')], [b(40), b(40) + 0.06, ...steps(b(41), 4, BT / 4)],
  { cls: 'ar gD pad', lsize: [100, 54], style: 'slam', enter: 'rise', caret: b(44) });
U(b(40), b(44), 520, 1390, `<div dir="rtl" style="display:flex;align-items:center;gap:30px;padding:28px 40px;height:100%;box-sizing:border-box">
  <div class="sw" style="position:relative;width:132px;height:72px;border-radius:36px;flex:none"><div class="kn" style="position:absolute;top:8px;width:56px;height:56px;border-radius:50%;background:#fff;box-shadow:0 3px 10px rgba(0,0,0,.25)"></div></div>
  <div style="flex:1;position:relative;height:60px;font-size:42px;font-weight:500"><span class="on" style="position:absolute;right:0;top:0">النسخ مفعل</span><span class="off" style="position:absolute;right:0;top:0">النسخ متوقف</span></div>
  <div style="text-align:center">${ring(46, 0.35, '#fff', 'rgba(255,255,255,.2)')}<div class="lat" style="font-size:34px;margin-top:4px">Max Drawdown</div></div></div>`,
  { cls: 'gD', w: 800, h: 220, enter: 'pop', te: b(40), zeta: 0.5, omega: 26, upd: (t, el) => {
    const tf = b(42), k = OM.spring(Math.max(0, t - tf), 0.6, 30) * (t >= tf);
    el.querySelector('.sw').style.background = t >= tf ? 'rgba(255,255,255,.28)' : '#E4002E';
    el.querySelector('.kn').style.left = (8 + 60 * k).toFixed(1) + 'px';                     // RTL: on = knob left, off = knob right
    el.querySelector('.on').style.opacity = 1 - clamp((t - tf) / 0.1); el.querySelector('.on').style.transform = `translateY(${(-30 * clamp((t - tf) / 0.15)).toFixed(1)}px)`;
    el.querySelector('.off').style.opacity = clamp((t - tf) / 0.12); el.querySelector('.off').style.transform = `translateY(${(30 * (1 - clamp((t - tf) / 0.15))).toFixed(1)}px)`;
    setRing(el, (t - b(40) - 0.2) / 0.5); } });
T(b(40) + 0.2, b(44), 520, 1545, 34, [[W('للتوضيح فقط', 'm')]], [b(40) + 0.2], { cls: 'ar shadow', style: 'rise', enter: 'none', te: b(40) + 0.2 });

// ═══ 13 proof ═══
T(b(44), b(48), 497, 1390, 96, [words('أفضل منصة', '', 'mask'), [W('لنسخ', '', 'mask'), W('الصفقات*', 'b', 'mask')], [W('Global Forex Awards · MENA 2023', '', 'fade')], [W('*مجموعة شركات آكسي', 'm', 'none')]],
  [...steps(b(44) + 0.03, 4, 0.08), b(45), b(44) + 0.27], { cls: 'ar gD pad', lsize: [96, 96, 38, 34], lcls: ['', '', 'lat', ''], enter: 'rise', style: 'mask',
    after: '<div class="sheen" style="position:absolute;top:-20%;bottom:-20%;width:180px;background:linear-gradient(100deg,transparent,rgba(255,255,255,.28),transparent);pointer-events:none"></div>',
    upd: (t, el) => { const s = el.querySelector('.sheen'); const k = clamp((t - b(44) - 0.12) / 0.6), k2 = clamp((t - b(46)) / 0.6);
      s.style.right = (k2 > 0 ? lerp(-200, el.offsetWidth + 40, k2) : lerp(-200, el.offsetWidth + 40, k)).toFixed(0) + 'px'; } });
const sheenCls = document.createElement('style'); sheenCls.textContent = '.gD{overflow:hidden}.ra{text-align:right}'; document.head.appendChild(sheenCls);

// ═══ 14 all in one app ═══
// the 3D phone's blank screen carries the app: a flat UI tracked to the bezel measured in the clip (source px, 720×1280)
const PH = [[3.6, 203, 521, 262, 1010], [3.8, 193, 530, 254, 1021], [4.0, 184, 538, 245, 1031], [4.2, 177, 544, 234, 1039], [4.4, 171, 549, 228, 1046], [4.6, 168, 551, 224, 1050], [4.8, 166, 552, 222, 1052], [4.95, 165, 552, 221, 1053]];
const phoneRect = st => { let i = 0; while (i < PH.length - 2 && PH[i + 1][0] < st) i++; const a = PH[i], c = PH[i + 1], k = clamp((st - a[0]) / (c[0] - a[0]));
  return [1, 2, 3, 4].map(j => lerp(a[j], c[j], k)); };
const appRow = (mono, w, i) => `<div class="row" data-i="${i}" style="display:flex;align-items:center;gap:.4em;background:#fff;border-radius:.5em;padding:.4em .45em;margin-top:.3em;box-shadow:0 .08em .3em rgba(0,0,0,.08)">
  <div style="width:1.25em;height:1.25em;border-radius:50%;background:linear-gradient(135deg,#8f9ba3,#4c565d);flex:none;color:#fff;font:500 .5em Inter;display:flex;align-items:center;justify-content:center;filter:blur(.5px)">${mono}</div>
  <div style="flex:1"><div style="height:.32em;width:${w}%;border-radius:.16em;background:rgba(36,37,40,.2)"></div><div style="height:.24em;width:${w - 25}%;border-radius:.12em;background:rgba(36,37,40,.1);margin-top:.22em"></div></div>
  <div style="background:#E4002E;color:#fff;border-radius:1em;font-size:.4em;font-weight:600;padding:.2em .8em .35em">انسخ</div></div>`;
U(b(50), b(52), 540, 960, `<div dir="rtl" style="position:absolute;inset:0;background:#EEF0F1;border-radius:1.1em;padding:2.4em .55em 0;box-sizing:border-box;color:#242528;overflow:hidden">
  <div style="font-size:.5em;font-weight:600;margin-bottom:.35em">اكتشف المتداولين</div><div>${['الربحية', 'نوع الأصل', 'المخاطر'].map(c => `<span style="display:inline-block;font-size:.36em;padding:.15em .6em .25em;border-radius:1em;background:#fff;margin:0 .08em">${c}</span>`).join('')}</div>
  ${[['SE', 80], ['MR', 64], ['LK', 50]].map(([m, w], i) => appRow(m, w, i)).join('')}
  <div class="tag" style="font-size:.62em;text-align:center;margin-top:.6em">للتوضيح فقط</div></div>`,
  { layer: 'ui', enter: 'none', te: b(50), still: true, w: 100, h: 100, upd: (t, el) => {
    const sh = shotAt(t); if (!sh || sh[2] !== 'k14_phone3d') { el.style.display = 'none'; return; }
    const [x0, x1, y0, y1] = phoneRect(srcT(sh, t)), c = cam(sh, t), sk = shake(t);
    const X = xs => c[4] + sk.x + c[1] + (xs * 1.5 - c[4]) * c[0], Y = ys => c[5] + sk.y + c[2] + (ys * 1.5 - c[5]) * c[0];
    const L = X(x0 + 13), Rr = X(x1 - 17), Tp = Y(y0 + 13), Bt = Y(y1 - 13), w = Rr - L;
    Object.assign(el.style, { left: L.toFixed(1) + 'px', top: Tp.toFixed(1) + 'px', width: w.toFixed(1) + 'px', height: (Bt - Tp).toFixed(1) + 'px', fontSize: (w / 9.5).toFixed(2) + 'px',
      transform: 'none', opacity: 1 });
    el.querySelectorAll('.row').forEach(r => { const te = b(50.5) + r.dataset.i * BT / 2, k = OM.spring(Math.max(0, t - te), 0.55, 24) * (t >= te);
      r.style.opacity = clamp((t - te) / 0.06); r.style.transform = `translateY(${((1 - k) * -1.2).toFixed(3)}em) scale(${(0.9 + 0.1 * k).toFixed(3)})`; }); } });
T(b(48), b(52), 540, 1455, 100, [words('كل هذا'), [W('في'), W('تطبيق'), W('واحد', 'b')]], steps(b(48), 5, 0.08), { cls: 'ar gD pad', style: 'xrot', enter: 'rise', te: b(48) });
T(b(49), b(52), 540, 280, 56, [words('Axi Copy Trading'), [W('App Store · Google Play', 'm', 'fade')]], [...steps(b(49), 3, 0.06), b(49) + 0.24],
  { cls: 'lat gL pad', lsize: [56, 34], style: 'rise', enter: 'drop', te: b(49) - 0.05 });
// ═══ 15 CTA ═══
T(b(52), FINAL, 540, 1060, 112, [[W('حمل'), W('التطبيق'), W('الآن', 'b')]], [b(52), b(52) + 0.05, b(52) + 0.1], { cls: 'ar gD pad', style: 'slam', enter: 'pop', pulse: 0.04 });
T(b(52) + 0.12, FINAL, 540, 1240, 54, [words('الرابط في البايو')], steps(b(52) + 0.12, 3, 0.05), { cls: 'ar redpill', style: 'pop', enter: 'pop',
  move: t => ({ sc: 1 + [b(53), b(54)].reduce((s, p) => s + (t >= p ? 0.09 * Math.exp(-(t - p) * 9) : 0), 0) }) });
U(b(53), b(55), 190, 1590, `<svg width="80" height="80" viewBox="0 0 80 80"><path d="M58 22 L22 58 M22 30 L22 58 L50 58" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  { enter: 'pop', move: t => { const k = Math.sin((t - b(53)) * Math.PI * 2 / BT) * 10; return { dx: -k * 0.7, dy: k * 0.7 }; } });

// ═══ risk strip (beat 55 to the last frame), red end card, CTA screen ═══
U(FINAL, CTA, 540, 960, '', { layer: 'top', w: 1080, h: 1920, enter: 'none', te: FINAL - 0.05, still: true, upd: (t, el) => { el.style.background = '#E4002E'; } });
U(FINAL, CTA, 540, 900, '<img src="img/axi_white.png" style="width:600px;display:block">', { layer: 'top', enter: 'pop', te: FINAL - 0.05, zeta: 0.55, omega: 24, still: true });
U(b(55), 30.01, 497, 1465, 'ينطوي التداول على مخاطر. قد تخسر أكثر مما تستثمر. الأداء السابق لا يضمن النتائج المستقبلية.<br>تروج بواسطة شركة <span class="lat">AxiTrader LLC</span>.',
  { layer: 'top', cls: 'risk', w: 886, enter: 'up', te: b(55), zeta: 0.8, omega: 22, still: true });
T(CTA, 29.85, 540, 228, 56, [words('Axi Copy Trading')], steps(CTA, 3, 0.05), { cls: 'lat shadow', style: 'rise', enter: 'none', te: CTA, out: 0.25 });
T(CTA + 0.1, 29.85, 540, 322, 56, [words('حمل التطبيق')], [CTA + 0.1, CTA + 0.16], { cls: 'ar redpill', style: 'pop', enter: 'pop', te: CTA + 0.1, out: 0.25 });
T(CTA + 0.3, 29.85, 540, 414, 48, [words('الرابط في البايو', 'm')], steps(CTA + 0.3, 3, 0.05), { cls: 'ar gD pill', style: 'rise', enter: 'none', te: CTA + 0.3, out: 0.25 });
[0, 1].forEach(i => U(CTA, 29.85, i ? 926 : 68, 1548, `<img src="img/tri.png" style="width:26px;display:block;transform:scaleX(${i ? 1 : -1})">`, { layer: 'top', enter: 'pop', te: CTA + 0.05 * i, out: 0.25, still: true }));

window.ITEMS = I;
window.KICKS = [...Array.from({ length: 24 }, (_, i) => b(4 + i)), ...Array.from({ length: 24 }, (_, i) => b(32 + i))];
window.HITS = [[b(4), 14, 7], [DROPB, 16, 7], [b(48), 9, 8]];
window.FLASH = [[1.93, '#fff', 0.9, 0.14], [b(5), '#fff', 0.55, 0.1], [b(8), '#fff', 0.3], [b(20), '#fff', 0.3], [b(24), '#fff', 0.22], [DROPB, '#fff', 0.75, 0.15],
  [b(36), '#fff', 0.65, 0.12], [b(40), '#fff', 0.25], [b(44), '#fff', 0.25], [b(48), '#fff', 0.6], [b(52), '#fff', 0.3]];
// canvas overlays: globe meridians (04), the trade's light streak (07), the dawn line (09)
window.OVL = [
  { t0: b(8), t1: b(12), draw: (g, t) => { const a = sstep(b(8), b(8) + 0.3, t) * (1 - sstep(b(12) - 0.15, b(12), t)); g.save(); g.translate(540 + W4(t).dx, 330); g.strokeStyle = `rgba(255,255,255,${0.35 * a})`; g.lineWidth = 2;
      const R = 300, ph = (t - b(8)) * 0.6; for (let i = 0; i < 9; i++) { const rx = Math.abs(Math.cos(ph + i * Math.PI / 9)) * R; g.beginPath(); g.ellipse(0, 0, rx, R, 0, 0, Math.PI * 2); g.stroke(); }
      for (const f of [-0.6, -0.3, 0, 0.3, 0.6]) { g.beginPath(); g.ellipse(0, f * R, R * Math.sqrt(1 - f * f), 18, 0, 0, Math.PI * 2); g.stroke(); } g.restore(); } },
  { t0: DEP - 0.05, t1: ARR + 0.35, draw: (g, t) => {           // comet trail off the pill's trailing (right) edge, following its arc
      const x = along(650, 340)(t), a = 1 - clamp((t - ARR) / 0.35), xe = x + 215, len = Math.max(0, Math.min(320, 1000 - xe)), yy = 1330 - 40 * Math.sin(Math.PI * clamp((t - DEP) / (ARR - DEP)));
      if (len < 4 || a <= 0) return; g.save(); g.filter = 'blur(3px)'; const gr = g.createLinearGradient(xe, 0, xe + len, 0); gr.addColorStop(0, `rgba(255,255,255,${0.9 * a})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(xe, yy - 4, len, 8); g.restore(); } },
  { t0: STOP, t1: DROPB, draw: g => {                     // the monitor reads as faint grey candles, not a saturated blue chart
      g.save(); g.globalCompositeOperation = 'saturation'; const sg = g.createLinearGradient(0, 760, 0, 900); sg.addColorStop(0, 'rgba(128,128,128,.9)'); sg.addColorStop(1, 'rgba(128,128,128,0)');
      g.fillStyle = sg; g.fillRect(0, 0, 1080, 900); g.globalCompositeOperation = 'source-over'; const dg = g.createLinearGradient(0, 0, 0, 860); dg.addColorStop(0, 'rgba(4,6,10,.45)'); dg.addColorStop(0.85, 'rgba(4,6,10,.35)'); dg.addColorStop(1, 'rgba(4,6,10,0)');
      g.fillStyle = dg; g.fillRect(0, 0, 1080, 860); g.restore(); } },
  { t0: 15.014, t1: DROPB, draw: (g, t) => { const k = sstep(15.014, DROPB, t), y = lerp(1920, 1590, k); const gr = g.createLinearGradient(0, y - 110, 0, y + 110);
      gr.addColorStop(0, 'rgba(235,244,250,0)'); gr.addColorStop(0.5, `rgba(235,244,250,${(0.5 * k).toFixed(3)})`); gr.addColorStop(1, 'rgba(235,244,250,0)'); g.fillStyle = gr; g.fillRect(0, y - 110, 1080, 220);
      g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(235,244,250,${(0.8 * k).toFixed(3)})`; g.fillRect(0, y - 2, 1080, 4); g.globalCompositeOperation = 'source-over'; } },
];

// ── SFX events ──
const ev = []; const add = (t, kind, v = 0.6, pan = 0) => ev.push({ t: +t.toFixed(3), kind, v, pan });
window.EDL.forEach(([t0], i) => { if (i && t0 !== b(5) && t0 !== FINAL && t0 !== CTA) add(t0 - 0.04, 'whoosh', 0.4, i % 2 ? -0.35 : 0.35); });
[[0, 'tick', 0.7], [b(2), 'tick', 0.8], [b(4), 'impact', 1.0], [b(5), 'glitch', 0.4], [b(16), 'whoosh', 0.6], [b(17), 'tick', 0.6], [DEP, 'whoosh', 0.6], [ARR, 'tick', 0.8],
 [b(24), 'tick', 0.6], [b(25), 'tick', 0.6], [STOP, 'impact', 0.7], [DROPB, 'impact', 1.0], [b(36), 'whoosh', 0.7], ...NOTE.map(([, t]) => [t, 'tick', 0.55]), [b(40), 'tick', 0.8], [b(42), 'tick', 0.8],
 [b(44) + 0.1, 'riser', 0.35], [b(48), 'impact', 0.8], [b(53), 'tick', 0.5], [b(54), 'tick', 0.5], [b(55), 'whoosh', 0.4], [FINAL, 'impact', 1.0]].forEach(([t, k, v]) => add(t, k, v));
window.EVENTS = { T: 30, events: ev.sort((a, c) => a.t - c.t) };
})();
