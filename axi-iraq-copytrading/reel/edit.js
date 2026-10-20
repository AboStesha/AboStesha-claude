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
  S(b(5), b(8), 'k16_glass', 0.2, 1.0, 1.0, 1.12, [0, 0, 0, 0], { zin: [0.3, 0.5], zout: [0.16, 0.7], filter: 'contrast(1.04) saturate(0.12) brightness(1.03)' }),
  // ── 04 traders from around the world ──
  S(b(8), b(12), 'k16_glass', 1.8, 0.9, 1.15, 1.02, [0, 0, -20, 0], { zin: [0.25, 0.35], whipOut: [0.13, -1], filter: 'contrast(1.04) saturate(0.12) brightness(1.03)' }),
  // ── 05 step 01: choose ──
  S(b(12), b(14), 'k04_noor_tablet', 0.3, 1.0, 1.04, 1.1, [0, 0, 0, 0], { whipIn: [0.13, -1], ay: 640 }),
  S(b(14), b(16), 'k04_noor_tablet', 2.4, 1.0, 1.28, 1.34, [0, 70, 0, 60], { ay: 640 }),
  // ── 06 step 02: size + risk ──
  S(b(16), b(18), 'k05_coin', 0.15, 1.15, 1.12, 1.0, [0, 120, 0, 120], { ease: 'snap' }),
  S(b(18), b(20), 'k05_coin', 2.1, 1.0, 1.18, 1.26, [0, 40, 0, 30]),
  // ── 07 step 03: split screen, the trade travels ──
  S(b(20), b(24), 'k06_saeed_tap', 2.0, 0.9, 1.0, 1.06, [0, 0, 0, 0], { ax: 600, ay: 1150, split: { h: true, clip: 'k07_noor_glow', src: 1.3, rate: 0.9, zz0: 1.0, zz1: 1.05, ox1: 210, ox2: -150, ax2: 540, ay2: 760, pulse2: [10.645] }, pulse: [10.16] }),
  // ── 08 no skills, no minimum ──
  S(b(24), b(26), 'k08_step', 0.2, 1.0, 1.02, 1.08, [0, 0, 0, 0], { ay: 700 }),
  S(b(26), STOP, 'k08_step', 2.5, 1.0, 1.32, 1.4, [0, 120, 0, 110], { ay: 700 }),
  // ── 09 BREAK: the lid shuts on the stop hit, tape-stop ramp, dark, dawn line ──
  S(STOP, DROPB, 'k09_laptop_close', 1.6, 1.0, 1.08, 1.2, [0, 0, 0, 0], { ramp: ramp(1.0, 0.2, 0.286), dim: u => 0.12 + 0.76 * sstep(1.25, 1.42, u) }),
  // ── 10 DROP B: holiday / family ──
  S(DROPB, b(33), 'k15_tigris', 1.2, 1.0, 1.0, 1.06, [0, 0, 0, 0], { zin: [0.22, 0.3] }),
  S(b(33), b(34), 'k10_marsh', 1.4, 1.0, 1.04, 1.1),
  S(b(34), b(36), 'k11_family', 2.55, 1.0, 1.0, 1.06, [0, 0, 0, 0], { zout: [0.3, 2.8], ax: 523, ay: 990 }),
  // ── 11 inside the phone ──
  S(b(36), b(40), 'k16_glass', 2.6, 0.9, 1.0, 1.1, [0, 0, 0, 0], { zin: [0.3, 0.9], filter: 'contrast(1.04) saturate(0.12) brightness(1.03)' }),
  // ── 12 control ──
  S(b(40), b(42), 'k12_noor_turn', 0.6, 1.0, 1.0, 1.05, [0, 0, 0, 0], { zin: [0.3, 0.35], ay: 640 }),
  S(b(42), b(44), 'k12_noor_turn', 2.7, 1.0, 1.26, 1.32, [0, 80, 0, 70], { ay: 640 }),
  // ── 13 proof ──
  S(b(44), b(46), 'k13_stack', 0.3, 1.0, 1.0, 1.08),
  S(b(46), b(48), 'k13_stack', 2.6, 1.0, 1.25, 1.32, [0, 40, 0, 40]),
  // ── 14 one app ──
  S(b(48), b(50), 'k14_phone3d', 0.4, 1.0, 1.12, 1.0, [0, 60, 0, 60], { ease: 'snap' }),
  S(b(50), b(52), 'k14_phone3d', 2.6, 1.0, 1.0, 1.06, [0, 90, 0, 100]),
  // ── 15 CTA ──
  S(b(52), b(54), 'k04_noor_tablet', 3.0, 1.0, 1.05, 1.1, [0, 0, 0, 0], { ay: 640 }),
  S(b(54), FINAL, 'k07_noor_glow', 3.3, 1.0, 1.2, 1.26, [0, 150, 0, 140], { ay: 640 }),
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
T(0, b(4), 540, 1390, 120, [[W('لا'), W('وقت؟')]], [-0.22, -0.15], { cls: 'ar gD pill', style: 'wipe', enter: 'pop', te: -0.12, dimAt: [b(2), 0.45],
  move: join(t => ({ dy: -128 * OM.spring(Math.max(0, t - b(2)), 0.7, 24) * (t >= b(2)) }), suck) });
T(b(2), b(4), 540, 1530, 120, [[W('لا'), W('خبرة؟', 'b')]], [b(2), b(2) + 0.06], { cls: 'ar gD pill', style: 'slam', enter: 'pop', move: suck });

// ═══ 03 drop A ═══
T(b(4), b(8), 540, 1170, 104, [words('انسخ صفقات').map((w, i) => i ? w : W(w[0], 'b ul')), words('أصحاب الخبرة')], steps(b(4) + 0.02, 4, 0.06),
  { cls: 'ar gD pad', style: 'rise', enter: 'rise', move: zoomThrough(b(8)) });
T(b(5), b(8), 540, 1415, 52, [words('Axi Copy Trading')], steps(b(5), 3, 0.05), { cls: 'lat gL pill', style: 'rise', enter: 'up', move: zoomThrough(b(8)) });

// ═══ 04 the best traders, from around the world ═══
const W4 = whip(b(12));
[['../assets/3d/forex_coin_EUR_rosegold.png', 905, 520, 210, 5, 18, -6], ['../assets/3d/commodities_silver_bar_macro.png', 150, 930, 260, 8, -14, 4],
 ['../assets/3d/red_chrome_plate_AVAX.png', 900, 1470, 190, 6, 10, -8]].forEach(([src, x, y, w, bl, vx, r], i) =>
  U(b(8), b(12), x, y, `<img src="${src}" style="width:${w}px;display:block;filter:blur(${bl}px)">`, { enter: 'pop', te: b(8) + 0.05 * i, move: join(drift(b(8), vx, -8, r), W4) }));
T(b(8), b(12), 540, 330, 98, [[W('أفضل'), W('المتداولين', 'b')], words('من حول العالم')], [b(8) + 0.03, b(8) + 0.09, b(9), b(9) + 0.06, b(9) + 0.12],
  { cls: 'ar ink', style: 'rise', enter: 'none', te: b(8), move: W4 });
const spark = (pts, w = 250, h = 74) => { const xs = pts.map((v, i) => [w - i * w / (pts.length - 1), h - v * h]); const d = 'M' + xs.map(p => p.map(n => n.toFixed(1)).join(' ')).join(' L');
  return `<svg width="${w}" height="${h + 6}" style="display:block;overflow:visible"><path d="${d}" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" data-len="700" stroke-dasharray="700" stroke-dashoffset="700"/></svg>`; };
const card = (av, tok, pts, extra = '') => `<div style="direction:rtl;display:flex;align-items:center;gap:26px;padding:26px 30px 34px;height:100%;box-sizing:border-box">
  ${av}<div style="flex:1"><div style="display:flex;gap:8px;margin-bottom:14px">${tok.map(s => `<span class="chip chipD lat" style="font-size:26px;margin:0">${s}</span>`).join('')}</div>${spark(pts)}</div></div>${extra}${TAG}`;
const mono = s => `<div style="width:120px;height:120px;border-radius:50%;flex:none;background:linear-gradient(135deg,#8f9ba3,#4c565d);display:flex;align-items:center;justify-content:center;
  font:500 44px Inter;color:#fff;filter:blur(2.5px)">${s}</div>`;
const CARDS = [
  [640, 760, card('<canvas class="ins" width="240" height="240" style="width:120px;height:120px;border-radius:50%;flex:none;display:block"></canvas>', ['XAU/USD', 'EUR/USD'],
    [.25, .4, .32, .55, .46, .7, .58, .78, .66, .88], '<div class="redpill ar" style="position:absolute;left:24px;top:22px;font-size:26px;padding:4px 22px 8px">انسخ</div>'),
    { clip: 'k03_saeed_turn', src: 0.6, rate: 1, z: 2.3, oy: 300 }],
  [540, 1040, card(mono('MR'), ['US500'], [.3, .22, .45, .38, .6, .5, .44, .66, .58, .72])],
  [440, 1320, card(mono('LK'), ['EUR/USD'], [.4, .5, .36, .52, .47, .64, .55, .5, .7, .76])],
];
CARDS.forEach(([x, y, html, ins], i) => { const te = b(8) + 0.12 + i * E8;
  U(b(8), b(12), x, y, html, { cls: 'gD', w: 600, h: 230, enter: 'rise', te, ins, fast: true,
    move: join(drift(b(8), -10 - 8 * i, -6), W4), upd: (t, el) => stroke(el, 'path', (t - te - 0.15) / 0.55) }); });
T(b(9), b(12), 540, 1560, 32, [[W('الأداء السابق لا يضمن النتائج المستقبلية', 'm')]], [b(9) + 0.1], { cls: 'ar ink', style: 'fade', enter: 'none', move: W4 });

// ═══ 05 step 01: choose your trader ═══
const glassWipe = tc => U(tc - 0.15, tc + 0.15, 540, 960, '', { layer: 'top', cls: 'gL', w: 1300, h: 2100, enter: 'none', te: tc - 0.15, still: true, fast: true,
  move: t => ({ dx: lerp(1350, -1350, OM.ease.cubicInOut(clamp((t - tc + 0.15) / 0.3))) }) });
NUM(b(12), b(16), 880, 905, '01');
T(b(12), b(16), 540, 1080, 100, [[W('اختر'), W('متداولك', 'b')], words('راجع أداءه السابق ورسومه', 'm', 'mask')], [b(12) + 0.08, b(12) + 0.14, ...steps(b(13), 4)],
  { cls: 'ar gD pad', lsize: [100, 50], enter: 'fold', omega: 30, zeta: 0.75, style: 'rise', caret: b(16) });
const chipsHTML = ['الربحية', 'نوع الأصل', 'مستوى المخاطر'].map((s, i) => `<span class="chip chipL" data-i="${i}" style="font-size:28px">${s}</span>`).join('');
const rowsHTML = ['سجل العوائد', 'الأسواق', 'رسوم الأداء'].map((s, i) => `<div style="display:flex;align-items:center;gap:22px;margin-top:16px"><div style="width:190px;font-size:30px">${s}</div>
  <div class="bar" data-i="${i}" style="flex:1;transform-origin:100% 50%"></div></div>`).join('');
U(b(12), b(16), 520, 1425, `<div dir="rtl" style="padding:22px 36px;font-size:34px;font-weight:500">اكتشف المتداولين<div style="margin:14px -6px 4px">${chipsHTML}</div>${rowsHTML}</div>${TAG}`,
  { cls: 'gL', w: 800, h: 330, enter: 'up', te: b(12) + 0.18, upd: (t, el) => {
    el.querySelectorAll('.chip').forEach(c => { const on = t >= b(13) + c.dataset.i * BT * 0.5; c.style.background = on ? '#242528' : ''; c.style.color = on ? '#fff' : ''; });
    el.querySelectorAll('.bar').forEach(r => { r.style.transform = `scaleX(${(1 - Math.pow(1 - clamp((t - b(12) - 0.4 - r.dataset.i * 0.12) / 0.4), 3)) * [0.9, 0.62, 0.4][r.dataset.i]})`; }); } });
glassWipe(b(16));

// ═══ 06 step 02: trade size + risk ═══
NUM(b(16), b(20), 880, 265, '02');
T(b(16), b(20), 540, 515, 92, [words('حدد حجم التداول'), [W('والمخاطرة', 'b')]], steps(b(16), 4), { cls: 'ar gD pad', style: 'pop', enter: 'rise' });
const ring = (r, pct, col = '#242528') => `<svg width="${2 * r + 16}" height="${2 * r + 16}" style="display:block"><circle cx="${r + 8}" cy="${r + 8}" r="${r}" fill="none" stroke="rgba(36,37,40,.14)" stroke-width="12"/>
  <circle class="rg" cx="${r + 8}" cy="${r + 8}" r="${r}" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" transform="rotate(-90 ${r + 8} ${r + 8})"
  stroke-dasharray="${(2 * Math.PI * r).toFixed(1)}" stroke-dashoffset="${(2 * Math.PI * r).toFixed(1)}" data-c="${(2 * Math.PI * r).toFixed(1)}" data-p="${pct}"/></svg>`;
const setRing = (el, k) => el.querySelectorAll('.rg').forEach(c => { c.setAttribute('stroke-dashoffset', (c.dataset.c * (1 - c.dataset.p * clamp(k))).toFixed(1)); });
U(b(16), b(20), 520, 1420, `<div dir="rtl" style="display:flex;align-items:center;gap:36px;padding:30px 40px 40px;height:100%;box-sizing:border-box">
   <div style="flex:1"><div style="font-size:34px;font-weight:500;margin-bottom:34px">حجم التداول</div>
     <div style="position:relative;height:12px;border-radius:6px;background:rgba(36,37,40,.16)"><div class="fill" style="position:absolute;right:0;top:0;bottom:0;border-radius:6px;background:#242528"></div>
     <div class="knob" style="position:absolute;top:-20px;width:52px;height:52px;border-radius:50%;background:#E4002E;box-shadow:0 4px 14px rgba(0,0,0,.25)"></div></div>
     <div style="display:flex;justify-content:space-between;margin-top:30px;font-size:24px;opacity:.6"><span>منخفض</span><span>مرتفع</span></div></div>
   <div style="text-align:center">${ring(62, 0.32)}<div class="lat" style="font-size:30px;font-weight:500;margin-top:6px">Max Drawdown</div></div></div>${TAG}`,
  { cls: 'gL', w: 800, h: 300, enter: 'up', te: b(16) + 0.2, upd: (t, el) => {
    const k = OM.spring(Math.max(0, t - b(17)), 0.7, 14), pos = lerp(0.7, 0.24, k);              // knob settles low as «والمخاطرة» lands (8.468)
    el.querySelector('.knob').style.right = `calc(${(pos * 100).toFixed(2)}% - 26px)`; el.querySelector('.fill').style.width = (pos * 100).toFixed(2) + '%';
    setRing(el, (t - b(17.5)) / 0.5); } });

// ═══ 07 step 03: your account copies automatically (split) ═══
const DEP = b(21), ARR = b(22);
const along = (a, c) => t => a + (c - a) * OM.ease.cubicInOut(clamp((t - DEP) / (ARR - DEP)));
NUM(b(20), b(24), 880, 265, '03');
T(b(20), b(24), 540, 470, 84, [[...words('حسابك ينسخ صفقاته'), W('تلقائيا', 'b')]], steps(b(20) + 0.03, 4, 0.06), { cls: 'ar gD pill', style: 'rise', enter: 'rise' });
U(b(20), b(24), 720, 1330, `<div dir="rtl" style="display:flex;align-items:center;gap:16px;padding:14px 28px 18px;font-size:36px;font-weight:500">
  <span style="width:18px;height:18px;border-radius:50%;background:#E4002E;display:inline-block"></span>صفقة جديدة<span class="chip chipL lat" style="margin:0;font-size:28px">XAU/USD</span></div>`,
  { cls: 'gL pill', enter: 'pop', te: DEP - 0.12, fast: true, move: t => ({ dx: along(0, -430)(t), dy: -40 * Math.sin(Math.PI * clamp((t - DEP) / (ARR - DEP))), sc: 1 - 0.08 * clamp((t - ARR) / 0.3) }) });

// ═══ 08 no advanced skills, no minimum deposit ═══
const check = `<svg width="64" height="64" viewBox="0 0 64 64" style="vertical-align:middle;margin-left:20px"><circle cx="32" cy="32" r="30" fill="#E4002E"/>
  <path d="M18 33 L28 43 L47 22" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" data-len="48" stroke-dasharray="48" stroke-dashoffset="48"/></svg>`;
const chk = te => (t, el) => stroke(el, 'path', (t - te - 0.1) / 0.25);
T(b(24), STOP, 520, 1150, 62, [[W(check, 'ic', 'pop'), ...words('بلا خبرة متقدمة')]], [b(24), b(24) + 0.06, b(24) + 0.12, b(24) + 0.18], { cls: 'ar gL pad', enter: 'slideL', te: b(24), upd: chk(b(24)), w: 800 });
T(b(25), STOP, 520, 1335, 62, [[W(check, 'ic', 'pop'), ...words('بلا حد أدنى للإيداع')], [W('تحتاج رصيدا يكفي لإدارة المخاطر', 'm', 'fade')]],
  [b(25), b(25) + 0.06, b(25) + 0.12, b(25) + 0.18, b(25) + 0.24, b(25) + 0.3], { cls: 'ar gL pad', lsize: [62, 34], enter: 'slideL', te: b(25), upd: chk(b(25)), w: 800 });

// ═══ 09 break ═══
T(13.834, DROPB, 540, 1240, 92, [words('ودع السهر'), words('على الشاشات')], steps(13.834, 4, 0.12), { cls: 'ar shadow', style: 'fade', enter: 'none', te: 13.834 });

// ═══ 10 holiday / family ═══
T(DROPB, b(34), 540, 560, 100, [[W('في'), W('إجازة؟', 'b')]], [DROPB, DROPB + 0.05], { cls: 'ar gD pill', style: 'pop', enter: 'pop', zeta: 0.45, omega: 26 });
T(b(34), b(36), 540, 640, 100, [[W('مع'), W('عائلتك؟', 'b')]], [b(34), b(34) + 0.05], { cls: 'ar gD pill', style: 'pop', enter: 'pop', zeta: 0.45, omega: 26, move: zoomThrough(b(36)) });

// ═══ 11 let the app handle the rest ═══
T(b(36), b(40), 540, 470, 96, [words('دع التطبيق'), [W('يتولى'), W('الباقي', 'b')]], steps(b(36) + 0.12, 4, 0.06), { cls: 'ar gD pad', style: 'rise', enter: 'rise', te: b(36) + 0.1 });
const NOTE = [['EUR/USD', b(36.5)], ['XAU/USD', b(37.5)], ['US500', b(38.5)]];
NOTE.forEach(([tok, te], i) => U(te, b(40), 520, 880, `<div dir="rtl" style="display:flex;align-items:center;gap:24px;padding:20px 28px;height:100%;box-sizing:border-box">
  <div style="width:84px;height:84px;border-radius:20px;background:#E4002E;flex:none;display:flex;align-items:center;justify-content:center"><img src="img/axi_white.png" style="width:58px"></div>
  <div style="flex:1"><div style="font-size:38px;font-weight:500">تم نسخ صفقة جديدة</div><div style="margin-top:8px;font-size:26px;opacity:.65"><span class="lat">${tok}</span> · الآن</div></div></div>`,
  { cls: 'gD', w: 800, h: 136, enter: 'drop', te, zeta: 0.55, omega: 24, fast: true,
    move: t => ({ dy: NOTE.slice(i + 1).reduce((s, [, t2]) => s + 158 * OM.spring(Math.max(0, t - t2), 0.62, 22) * (t >= t2), 0) }) }));

// ═══ 12 control stays with you ═══
T(b(40), b(44), 540, 1050, 100, [[W('التحكم'), W('بيدك', 'b')], words('أوقف النسخ متى شئت', 'm', 'mask')], [b(40), b(40) + 0.06, ...steps(b(41), 4)],
  { cls: 'ar gD pad', lsize: [100, 54], style: 'slam', enter: 'rise', caret: b(44) });
U(b(40), b(44), 520, 1390, `<div dir="rtl" style="display:flex;align-items:center;gap:30px;padding:28px 40px;height:100%;box-sizing:border-box">
  <div class="sw" style="position:relative;width:132px;height:72px;border-radius:36px;flex:none"><div class="kn" style="position:absolute;top:8px;width:56px;height:56px;border-radius:50%;background:#fff;box-shadow:0 3px 10px rgba(0,0,0,.25)"></div></div>
  <div style="flex:1;position:relative;height:60px;font-size:42px;font-weight:500"><span class="on" style="position:absolute;right:0;top:0">النسخ مفعل</span><span class="off" style="position:absolute;right:0;top:0">النسخ متوقف</span></div>
  <div style="text-align:center">${ring(46, 0.35)}<div class="lat" style="font-size:20px;margin-top:4px">Max Drawdown</div></div></div>`,
  { cls: 'gL', w: 800, h: 210, enter: 'pop', te: b(40), zeta: 0.5, omega: 26, upd: (t, el) => {
    const tf = b(42), k = OM.spring(Math.max(0, t - tf), 0.6, 30) * (t >= tf);
    el.querySelector('.sw').style.background = t >= tf ? 'rgba(36,37,40,.28)' : '#E4002E';
    el.querySelector('.kn').style.left = (8 + 60 * k).toFixed(1) + 'px';                     // RTL: on = knob left, off = knob right
    el.querySelector('.on').style.opacity = 1 - clamp((t - tf) / 0.1); el.querySelector('.on').style.transform = `translateY(${(-30 * clamp((t - tf) / 0.15)).toFixed(1)}px)`;
    el.querySelector('.off').style.opacity = clamp((t - tf) / 0.12); el.querySelector('.off').style.transform = `translateY(${(30 * (1 - clamp((t - tf) / 0.15))).toFixed(1)}px)`;
    setRing(el, (t - b(40) - 0.2) / 0.5); } });

// ═══ 13 proof ═══
T(b(44), b(48), 540, 1420, 78, [words('أفضل منصة لنسخ', '', 'mask').concat([W('الصفقات*', 'b', 'mask')]), [W('Global Forex Awards · MENA 2023', '', 'fade')], [W('*مجموعة شركات آكسي', 'm', 'none')]],
  [...steps(b(44) + 0.15, 4, 0.09), b(45), b(44)], { cls: 'ar gD pad', lsize: [78, 38, 28], lcls: ['', 'lat', ''], enter: 'rise', style: 'mask',
    after: '<div class="sheen" style="position:absolute;top:-20%;bottom:-20%;width:180px;background:linear-gradient(100deg,transparent,rgba(255,255,255,.28),transparent);pointer-events:none"></div>',
    upd: (t, el) => { const s = el.querySelector('.sheen'); const k = clamp((t - b(44) - 0.12) / 0.6), k2 = clamp((t - b(46)) / 0.6);
      s.style.right = (k2 > 0 ? lerp(-200, el.offsetWidth + 40, k2) : lerp(-200, el.offsetWidth + 40, k)).toFixed(0) + 'px'; } });
const sheenCls = document.createElement('style'); sheenCls.textContent = '.gD{overflow:hidden}'; document.head.appendChild(sheenCls);

// ═══ 14 all in one app ═══
T(b(48), b(52), 540, 330, 100, [words('كل هذا'), [W('في'), W('تطبيق'), W('واحد', 'b')]], steps(b(48), 5, 0.08), { cls: 'ar ink', style: 'xrot', enter: 'none', te: b(48) });
T(b(49), b(52), 540, 1440, 58, [words('Axi Copy Trading'), [W('App Store · Google Play', 'm', 'fade')]], [...steps(b(49), 3, 0.06), b(49) + 0.24],
  { cls: 'lat gL pad', lsize: [58, 32], style: 'rise', enter: 'up', te: b(49) - 0.05 });

// ═══ 15 CTA ═══
T(b(52), FINAL, 540, 1060, 112, [[W('حمل'), W('التطبيق'), W('الآن', 'b')]], [b(52), b(52) + 0.05, b(52) + 0.1], { cls: 'ar gD pad', style: 'slam', enter: 'pop', pulse: 0.04 });
T(b(52) + 0.12, FINAL, 540, 1240, 54, [words('الرابط في البايو')], steps(b(52) + 0.12, 3, 0.05), { cls: 'ar redpill', style: 'pop', enter: 'pop',
  move: t => ({ sc: 1 + [b(53), b(54)].reduce((s, p) => s + (t >= p ? 0.09 * Math.exp(-(t - p) * 9) : 0), 0) }) });
U(b(53), FINAL, 190, 1665, `<svg width="80" height="80" viewBox="0 0 80 80"><path d="M58 22 L22 58 M22 30 L22 58 L50 58" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  { enter: 'pop', move: t => { const k = Math.sin((t - b(53)) * Math.PI * 2 / BT) * 10; return { dx: -k * 0.7, dy: k * 0.7 }; } });

// ═══ risk strip (beat 55 to the last frame), red end card, CTA screen ═══
U(FINAL, CTA, 540, 960, '', { layer: 'top', w: 1080, h: 1920, enter: 'none', te: FINAL, still: true, upd: (t, el) => { el.style.background = '#E4002E'; } });
U(FINAL, CTA, 540, 900, '<img src="img/axi_white.png" style="width:600px;display:block">', { layer: 'top', enter: 'pop', te: FINAL, zeta: 0.55, omega: 24, still: true });
U(b(55), 30.01, 497, 1465, 'ينطوي التداول على مخاطر. قد تخسر أكثر مما تستثمر. الأداء السابق لا يضمن النتائج المستقبلية. تروج بواسطة شركة <span class="lat">AxiTrader LLC</span>.',
  { layer: 'top', cls: 'risk', w: 886, enter: 'up', te: b(55), zeta: 0.8, omega: 22, still: true });
T(CTA, 29.85, 540, 300, 58, [words('Axi Copy Trading')], steps(CTA, 3, 0.05), { cls: 'lat shadow', style: 'rise', enter: 'none', te: CTA, out: 0.25 });
T(CTA + 0.1, 29.85, 540, 420, 58, [words('حمل التطبيق')], [CTA + 0.1, CTA + 0.16], { cls: 'ar redpill', style: 'pop', enter: 'up', te: CTA + 0.1, out: 0.25 });
T(CTA + 0.3, 29.85, 540, 540, 40, [words('الرابط في البايو', 'm')], steps(CTA + 0.3, 3, 0.05), { cls: 'ar shadow', style: 'rise', enter: 'none', te: CTA + 0.3, out: 0.25 });
[[0, 0], [1, 1]].forEach(([i]) => U(CTA, 30.01, i ? 1000 : 80, 1840, `<img src="img/tri.png" style="width:150px;display:block;transform:scaleX(${i ? 1 : -1})">`, { enter: i ? 'slideL' : 'slideR', te: CTA + 0.05 * i, still: true }));

window.ITEMS = I;
window.KICKS = [...Array.from({ length: 24 }, (_, i) => b(4 + i)), ...Array.from({ length: 24 }, (_, i) => b(32 + i))];
window.HITS = [[b(4), 14, 7], [DROPB, 16, 7], [b(48), 9, 8]];
window.FLASH = [[b(4), '#fff', 0.85, 0.07], [b(5), '#fff', 0.55, 0.1], [b(8), '#fff', 0.3], [b(20), '#fff', 0.3], [b(24), '#fff', 0.22], [DROPB, '#fff', 0.75, 0.15],
  [b(36), '#fff', 0.65, 0.12], [b(40), '#fff', 0.25], [b(44), '#fff', 0.25], [b(48), '#fff', 0.6], [b(52), '#fff', 0.3]];
// canvas overlays: globe meridians (04), the trade's light streak (07), the dawn line (09)
window.OVL = [
  { t0: b(8), t1: b(12), draw: (g, t) => { const a = sstep(b(8), b(8) + 0.3, t) * (1 - sstep(b(12) - 0.15, b(12), t)); g.save(); g.translate(540, 330); g.strokeStyle = `rgba(255,255,255,${0.35 * a})`; g.lineWidth = 2;
      const R = 300, ph = (t - b(8)) * 0.6; for (let i = 0; i < 9; i++) { const rx = Math.abs(Math.cos(ph + i * Math.PI / 9)) * R; g.beginPath(); g.ellipse(0, 0, rx, R, 0, 0, Math.PI * 2); g.stroke(); }
      for (const f of [-0.6, -0.3, 0, 0.3, 0.6]) { g.beginPath(); g.ellipse(0, f * R, R * Math.sqrt(1 - f * f), 18, 0, 0, Math.PI * 2); g.stroke(); } g.restore(); } },
  { t0: DEP - 0.05, t1: ARR + 0.35, draw: (g, t) => { const x = along(720, 290)(t), a = 1 - clamp((t - ARR) / 0.35);
      const gr = g.createLinearGradient(730, 0, x, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, `rgba(255,255,255,${0.9 * a})`);
      g.fillStyle = gr; g.fillRect(x, 1327, Math.max(0, 730 - x), 6); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,255,255,${0.12 * a})`; g.fillRect(x, 1290, Math.max(0, 730 - x), 80); g.globalCompositeOperation = 'source-over'; } },
  { t0: 15.014, t1: DROPB, draw: (g, t) => { const k = sstep(15.014, DROPB, t), y = lerp(1920, 1560, k); const gr = g.createLinearGradient(0, y - 160, 0, y + 30);
      gr.addColorStop(0, 'rgba(190,214,228,0)'); gr.addColorStop(0.85, `rgba(200,222,234,${0.55 * k})`); gr.addColorStop(1, `rgba(235,244,250,${0.95 * k})`); g.fillStyle = gr; g.fillRect(0, y - 160, 1080, 190); } },
];

// ── SFX events ──
const ev = []; const add = (t, kind, v = 0.6, pan = 0) => ev.push({ t: +t.toFixed(3), kind, v, pan });
window.EDL.forEach(([t0], i) => { if (i && t0 !== b(5) && t0 !== FINAL && t0 !== CTA) add(t0 - 0.04, 'whoosh', 0.4, i % 2 ? -0.35 : 0.35); });
[[0, 'tick', 0.7], [b(2), 'tick', 0.8], [b(4), 'impact', 1.0], [b(5), 'glitch', 0.4], [b(16), 'whoosh', 0.6], [b(17), 'tick', 0.6], [DEP, 'whoosh', 0.6], [ARR, 'tick', 0.8],
 [b(24), 'tick', 0.6], [b(25), 'tick', 0.6], [STOP, 'impact', 0.7], [DROPB, 'impact', 1.0], [b(36), 'whoosh', 0.7], ...NOTE.map(([, t]) => [t, 'tick', 0.55]), [b(40), 'tick', 0.8], [b(42), 'tick', 0.8],
 [b(44) + 0.1, 'riser', 0.35], [b(48), 'impact', 0.8], [b(53), 'tick', 0.5], [b(54), 'tick', 0.5], [b(55), 'whoosh', 0.4], [FINAL, 'impact', 1.0]].forEach(([t, k, v]) => add(t, k, v));
window.EVENTS = { T: 30, events: ev.sort((a, c) => a.t - c.t) };
})();
