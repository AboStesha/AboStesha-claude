// Gold 03 · reel 3 — costs (spread, points, commission) · swap · the summary (strongest moment) · next lesson · back to the gold bar.
(function (G) {
  const A = G.AX, F = G.FILM, R = G.REEL;
  const { W, H, C, clamp, lerp, hexA, txt, lat, mixHex } = A;
  const { w, sfx } = F;
  const { P, q8, beatAt, BEAT, GRID0, xo, xi, xio, E, EI, EIO, crit, outP, act, slat, slatRow, textW, shape, mixPts, fillPts, discs, chipF, tokF, popE, arrowF, roll, LABELS } = R;
  const Q = (p, k) => q8(w(p, k));
  const hit = (t, g = 0.22) => { sfx(t - 0.01, 'impact', g); sfx(t - 0.06, 'whoosh', g * 0.6, { d: 0.35 }); };
  const beatPulse = (t) => { const ph = (t - GRID0) / BEAT; return Math.exp(-(ph - Math.floor(ph)) * 7); };
  const sc = (t, t0) => E(t, t0, 0.38);
  const shp = (ctx, kind, cx, cy, r, col, k, o = {}) => { if (k <= 0) return; fillPts(ctx, shape(kind, cx, cy, r * k, o), col); };
  const T2 = G.REEL.T2;

  // ================================================================ COSTS · spread (varies, widens on news, «floating») · points · commission
  const T12 = { in: T2.T11.exit, title: Q(66, 0), sp: Q(67, 0), varies: Q(67, 1), news: Q(68, 2), spec: Q(69, 0), flt: Q(69, 4), mw: Q(70, 0), noCol: Q(71, 2), rc: Q(72, 2), cols: Q(72, 4), on: Q(72, 5),
    pts: Q(73, 1), pt: Q(74, 0), small: Q(74, 1), digits: Q(75, 1), dvar: Q(75, 2), ex: Q(76, 0), two: Q(77, 0), p30: Q(78, 0), c30: Q(78, 3), comm: Q(79, 3), site: Q(80, 1), exit: q8(w(81, 0) - 0.35) };
  LABELS.push([T12.in + 0.2, 'التكاليف']);
  hit(T12.in + 0.25, 0.24); sfx(T12.title, 'slam', 0.16); sfx(T12.sp, 'stretch', 0.12); for (let i = 0; i < 3; i++) sfx(T12.varies + i * BEAT, 'tick', 0.1, { f: 1800 + i * 300 }); sfx(T12.news - 0.05, 'glitch', 0.12); sfx(T12.news, 'slam', 0.12);
  sfx(T12.spec, 'pop', 0.12, { f: 640 }); sfx(T12.flt, 'pop', 0.14, { f: 900 }); sfx(T12.mw, 'whoosh', 0.1, { d: 0.35 }); sfx(T12.rc, 'click', 0.18); sfx(T12.cols, 'tick', 0.12, { f: 2000 }); sfx(T12.on, 'click', 0.18); sfx(T12.on + 0.2, 'pop', 0.12, { f: 820 });
  sfx(T12.pts, 'slam', 0.14); sfx(T12.small, 'pop', 0.14, { f: 980 }); for (let i = 0; i < 4; i++) sfx(T12.dvar + i * BEAT, 'tick', 0.1, { f: 2400 }); sfx(T12.ex, 'pop', 0.12, { f: 660 }); sfx(T12.p30, 'slam', 0.14); sfx(T12.c30, 'slam', 0.14); sfx(T12.comm, 'pop', 0.14, { f: 720 });
  // spread gap (px) — varies broker to broker on the beat, widens on news
  const GAPS = [70, 46, 92];
  const gapAt = (t) => { let g = 64; if (t > T12.varies) g = GAPS[Math.max(0, Math.min(2, Math.floor((t - T12.varies) / BEAT)))]; return lerp(g, 230, EIO(t, T12.news, 0.45)) * (1 - EIO(t, T12.spec - 0.2, 0.5)) + 64 * EIO(t, T12.spec - 0.2, 0.5); };
  const MWC = { x: 460, y: 300, w: 1000, h: 470 };
  act({ name: 'costs', t0: T12.in, din: 0.5, enter: 'slats', field: 'slate', t1: T12.exit + 0.7, draw(ctx, t) {
    const ko = 1 - EI(t, T12.exit, 0.35);
    slatRow(ctx, [{ s: 'تكاليف', t: T12.title }, { s: 'الذهب', t: Q(66, 1) }], 960, 600, 170, t, { align: 'center', color: P.white, out: T12.sp - 0.2 });
    // bid / ask lines and the spread between them
    const ln = E(t, T12.sp - 0.1, 0.5) * (1 - EI(t, T12.mw - 0.2, 0.4));
    if (ln > 0) {
      const g = gapAt(t); const yb = 600 + Math.sin(t * 2.1) * 10, ya = yb - g;
      ctx.fillStyle = P.white; ctx.fillRect(W * (1 - ln), yb - 3, W * ln, 6); ctx.fillStyle = P.gold; ctx.fillRect(0, ya - 3, W * ln, 6);
      txt(ctx, 'سعر البيع (Bid)', 1800, yb + 48, { size: 34, w: 'S', color: P.white, alpha: ln }); txt(ctx, 'سعر الشراء (Ask)', 1800, ya - 24, { size: 34, w: 'S', color: P.gold, alpha: ln });
      ctx.fillStyle = P.white; ctx.fillRect(958, ya + 8, 4, Math.max(0, g - 16)); ctx.fillRect(940, ya + 8, 40, 4); ctx.fillRect(940, yb - 12, 40, 4);
      slat(ctx, 'السبريد', 760, (ya + yb) / 2 + 22, 60, t, T12.sp, { w: 'S', color: P.white, out: T12.mw - 0.25 });
      chipF(ctx, 'وقت الأخبار', 1300, 860, { size: 32, fill: P.red, p: popE(t, T12.news) * (1 - EI(t, T12.spec - 0.25, 0.3)) });
      // the specification row: «السبريد · متغيّر»
      const sr = E(t, T12.spec, 0.35); if (sr > 0) { ctx.save(); ctx.translate(0, (1 - sr) * 60); ctx.fillStyle = P.white; ctx.fillRect(560, 800, 800, 96); txt(ctx, 'السبريد', 1320, 862, { size: 40, w: 'S', color: P.ink }); ctx.restore(); slat(ctx, 'متغيّر', 760, 864, 46, t, T12.flt, { w: 'X', color: P.gold }); }
    }
    // Market Watch: no spread column → right-click → Columns → Spread
    const mk = E(t, T12.mw, 0.4) * (1 - EI(t, T12.pts - 0.25, 0.4));
    if (mk > 0) {
      const x0 = MWC.x, y0 = MWC.y + (1 - mk) * 80; ctx.save(); ctx.translate(0, -EI(t, T12.pts - 0.25, 0.4) * 900);
      ctx.fillStyle = P.white; ctx.fillRect(x0, y0, MWC.w, MWC.h); ctx.fillStyle = P.ink; ctx.fillRect(x0, y0, MWC.w, 60); txt(ctx, 'مراقبة السوق', x0 + MWC.w - 28, y0 + 41, { size: 28, w: 'S', color: P.white });
      const col = E(t, T12.on + 0.1, 0.35); const cx = [x0 + MWC.w - 28, x0 + 620, x0 + 380, x0 + 150];
      txt(ctx, 'الرمز', cx[0], y0 + 108, { size: 26, w: 'S', color: P.slate }); txt(ctx, 'سعر البيع', cx[1], y0 + 108, { size: 26, w: 'S', color: P.slate }); txt(ctx, 'سعر الشراء', cx[2], y0 + 108, { size: 26, w: 'S', color: P.slate });
      if (col > 0) { ctx.save(); ctx.globalAlpha *= col; txt(ctx, 'السبريد', cx[3] + 40, y0 + 108, { size: 26, w: 'S', color: P.ink }); ctx.restore(); }
      [['XAUUSD', '4,012.35', '4,012.65', '30'], ['XAGUSD', '31.05', '31.08', '3'], ['EURUSD', '1.0842', '1.0843', '1']].forEach((r, i) => {
        const ry = y0 + 170 + i * 92; lat(ctx, r[0], cx[0], ry, { size: 30, w: 700, color: P.ink, align: 'right' }); lat(ctx, r[1], cx[1], ry, { size: 30, w: 600, color: P.ink, align: 'right' }); lat(ctx, r[2], cx[2], ry, { size: 30, w: 600, color: P.ink, align: 'right' });
        if (col > 0) { const e = E(t, T12.on + 0.15 + i * 0.06, 0.3); lat(ctx, r[3], cx[3] + 20 + (1 - e) * 60, ry, { size: 30, w: 800, color: i === 0 ? '#B07A12' : P.ink, align: 'right', alpha: e }); }
      });
      // context menu with the «الأعمدة» submenu
      const m1 = E(t, T12.rc + 0.05, 0.25) * outP(t, T12.on + 0.1, 0.25);
      if (m1 > 0) {
        ctx.save(); ctx.globalAlpha *= m1; const mx = x0 + 330, my = y0 + 150; ctx.fillStyle = P.white; ctx.fillRect(mx, my, 280, 190); ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.strokeRect(mx, my, 280, 190);
        ['أمر جديد', 'المواصفات', 'الأعمدة'].forEach((s, i) => { const iy = my + 50 + i * 60; if (i === 2) { const h = E(t, T12.cols, 0.2); if (h > 0) { ctx.fillStyle = hexA(P.gold, h); ctx.fillRect(mx + 6, iy - 38, 268, 54); } } txt(ctx, s, mx + 256, iy, { size: 27, w: i === 2 ? 'S' : 'R', color: P.ink }); });
        const sm = E(t, T12.cols + 0.1, 0.25); if (sm > 0) { const sx = mx - 240, sy = my + 120; ctx.fillStyle = P.white; ctx.fillRect(sx, sy, 230, 120 * sm); ctx.strokeRect(sx, sy, 230, 120 * sm); txt(ctx, 'السبريد', sx + 206, sy + 48, { size: 27, w: 'S', color: P.ink }); ctx.fillStyle = P.ink; const ck = E(t, T12.on, 0.2); if (ck > 0) { ctx.fillRect(sx + 26, sy + 30, 22, 22); } txt(ctx, 'الوقت', sx + 206, sy + 100, { size: 27, w: 'R', color: P.ink }); }
        ctx.restore();
      }
      ctx.restore();
    }
    // points: the smallest digit of the price
    const pk = E(t, T12.pts, 0.4) * ko;
    if (pk > 0 && t < T12.exit + 0.5) {
      const S = 200; const three = t > T12.dvar && t < T12.ex - 0.1 && (beatAt(t) % 2 === 1);
      const s = three ? '4,012.354' : '4,012.35'; const c = document.createElement('canvas').getContext('2d'); c.font = `800 ${S}px IN`; const wv = c.measureText(s).width, wl = c.measureText(s.slice(0, -1)).width;
      const x0 = 960 - wv / 2, y = 560;
      if (t < T12.two + 0.3) { slat(ctx, s, 960, y, S, t, T12.pts, { w: 800, color: P.white, n: 6, out: T12.two - 0.1 }); const bx = E(t, T12.small, 0.3) * outP(t, T12.two - 0.12, 0.15); if (bx > 0) { ctx.save(); ctx.globalAlpha *= bx; ctx.strokeStyle = P.gold; ctx.lineWidth = 8; ctx.strokeRect(x0 + wl - 10, y - S * 0.8, (wv - wl) + 20, S * 0.95); ctx.restore(); } }
      slatRow(ctx, [{ s: 'النقطة', t: T12.pt }, { s: 'أصغر', t: T12.small }, { s: 'خانة', t: Q(74, 2) }, { s: 'بالسعر', t: Q(74, 3) }], 960, 760, 60, t, { align: 'center', w: 'S', color: P.white, out: T12.two - 0.15 });
      chipF(ctx, 'عدد الخانات يختلف حسب الوسيط', 960, 870, { size: 30, fill: P.ink, p: popE(t, T12.digits) * outP(t, T12.two - 0.15, 0.25) });
      // example: 2 decimals → 30 points = $0.30 per ounce
      const exOut = Q(79, 0) - 0.15;
      chipF(ctx, 'مثال افتراضي', 960, 230, { size: 30, line: P.white, p: popE(t, T12.ex) * outP(t, exOut, 0.25) });
      slat(ctx, 'خانتين بعد الفاصلة', 960, 400, 64, t, T12.two, { w: 'S', color: P.white, out: exOut });
      slatRow(ctx, [{ s: '30 نقطة', t: T12.p30 }, { s: '=', t: Q(78, 2) }, { s: '$0.30', t: T12.c30, color: P.gold }], 960, 640, 130, t, { align: 'center', color: P.white, out: exOut });
      slat(ctx, 'للأونصة', 960, 780, 60, t, Q(78, 5), { w: 'S', color: P.white, out: exOut });
      // commission
      chipF(ctx, 'عمولة', 1180, 560, { size: 54, fill: P.gold, color: P.ink, p: popE(t, T12.comm) * ko });
      slat(ctx, 'وبعض الحسابات فيها', 1180, 440, 50, t, Q(79, 0), { w: 'S', color: P.white });
      slat(ctx, 'ومقدارها بموقع الوسيط', 700, 575, 52, t, T12.site, { w: 'S', color: P.white });
    }
  } });

  // ================================================================ SWAP · daily rollover · charged or credited · buy ≠ sell · swap-free (conditions) · ask scholars
  const T13 = { in: T12.exit, title: Q(81, 0), calc: Q(82, 0), open: Q(82, 2), roll: Q(82, 5), minus: Q(83, 1), plus: Q(83, 4), bs: Q(84, 0), buy: Q(84, 2), sell: Q(84, 3), free: Q(85, 3), cond: Q(86, 2), fees: Q(86, 4), q: Q(87, 0), ask: Q(88, 0), exit: q8(w(89, 0) - 0.35) };
  LABELS.push([T13.in + 0.2, 'السواب']);
  hit(T13.in + 0.25, 0.24); sfx(T13.title, 'slam', 0.16); sfx(T13.open, 'pop', 0.12, { f: 680 }); sfx(T13.roll, 'chime', 0.12); sfx(T13.minus, 'pop', 0.14, { f: 420 }); sfx(T13.plus, 'pop', 0.14, { f: 900 });
  sfx(T13.buy, 'tick', 0.12, { f: 2000 }); sfx(T13.sell, 'tick', 0.12, { f: 1600 }); sfx(T13.free, 'slam', 0.14); sfx(T13.cond, 'pop', 0.12, { f: 640 }); sfx(T13.fees, 'pop', 0.12, { f: 760 }); sfx(T13.q, 'whoosh', 0.12, { d: 0.4 }); sfx(T13.ask, 'pop', 0.12, { f: 600 });
  const DC = { x: 620, y: 600, r: 230 };
  act({ name: 'swap', t0: T13.in, din: 0.55, enter: 'bars', n: 12, field: 'ink', t1: T13.exit + 0.7, draw(ctx, t) {
    const ko = 1 - EI(t, T13.exit, 0.35), kd = 1 - EI(t, T13.q - 0.3, 0.4);
    slat(ctx, 'السواب', 960, 600, 220, t, T13.title, { color: P.gold, out: T13.calc - 0.25 });
    slat(ctx, 'السواب', 960, 220, 90, t, T13.calc - 0.1, { color: P.gold, out: T13.q - 0.3 });
    // the 24-hour dial: the hand steps on every beat; the broker's daily rollover is marked
    const dk = E(t, T13.calc, 0.45) * kd;
    if (dk > 0) {
      for (let i = 0; i < 24; i++) { const an = -Math.PI / 2 + i * Math.PI / 12; const r0 = DC.r * (i % 6 ? 0.86 : 0.78) * dk, r1 = DC.r * dk; ctx.strokeStyle = i === 0 ? P.gold : hexA(P.white, 0.75); ctx.lineWidth = i === 0 ? 8 : 4; ctx.beginPath(); ctx.moveTo(DC.x + Math.cos(an) * r0, DC.y + Math.sin(an) * r0); ctx.lineTo(DC.x + Math.cos(an) * r1, DC.y + Math.sin(an) * r1); ctx.stroke(); }
      const b = beatAt(t); const hand = t > T13.roll ? -Math.PI / 2 : -Math.PI / 2 + ((b % 24) + 1) * Math.PI / 12; // steps on every beat, lands on the rollover
      ctx.strokeStyle = P.white; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(DC.x, DC.y); ctx.lineTo(DC.x + Math.cos(hand) * DC.r * 0.7 * dk, DC.y + Math.sin(hand) * DC.r * 0.7 * dk); ctx.stroke();
      ctx.fillStyle = P.gold; ctx.beginPath(); ctx.arc(DC.x, DC.y, 14 * dk, 0, 6.283); ctx.fill();
      chipF(ctx, 'التجديد اليومي', DC.x, DC.y - DC.r - 60, { size: 30, fill: P.gold, color: P.ink, p: popE(t, T13.roll) * kd });
      chipF(ctx, 'صفقة مفتوحة', DC.x, DC.y + DC.r + 70, { size: 30, line: P.white, p: popE(t, T13.open) * kd });
    }
    // charged or credited · differs for buy and sell
    if (kd > 0) {
      ctx.save(); ctx.globalAlpha *= 1;
      chipF(ctx, 'ينخصم منك', 1460, 420, { size: 34, fill: P.red, p: popE(t, T13.minus) * kd });
      chipF(ctx, 'ينضاف لك', 1460, 520, { size: 34, fill: '#2FA884', p: popE(t, T13.plus) * kd });
      const rb = E(t, T13.buy, 0.35) * kd, rs = E(t, T13.sell, 0.35) * kd;
      if (rb > 0) { txt(ctx, 'شراء', 1760, 680, { size: 36, w: 'S', color: P.white, alpha: rb }); ctx.fillStyle = P.red; ctx.fillRect(1600 - 300 * rb, 650, 300 * rb, 40); }
      if (rs > 0) { txt(ctx, 'بيع', 1760, 760, { size: 36, w: 'S', color: P.white, alpha: rs }); ctx.fillStyle = P.mint; ctx.fillRect(1600 - 140 * rs, 730, 140 * rs, 40); }
      chipF(ctx, 'حساب بدون سواب', 1530, 860, { size: 34, fill: P.gold, color: P.ink, p: popE(t, T13.free) * kd });
      ctx.restore();
      // conditions or alternative fees
      chipF(ctx, 'بشروط', 1250, 860, { size: 30, line: P.white, p: popE(t, T13.cond) * kd });
      chipF(ctx, 'أو رسوم بديلة', 1020, 860, { size: 30, line: P.white, p: popE(t, T13.fees) * kd });
    }
    // religious questions → ask qualified scholars
    slatRow(ctx, [{ s: 'أي', t: T13.q }, { s: 'سؤال', t: Q(87, 1) }, { s: 'ديني؟', t: Q(87, 2) }], 960, 500, 110, t, { align: 'center', color: P.white, out: T13.exit - 0.1 });
    slatRow(ctx, [{ s: 'اسأل', t: T13.ask }, { s: 'العلماء', t: Q(88, 1) }, { s: 'المختصين', t: Q(88, 2) }], 960, 680, 80, t, { align: 'center', w: 'S', color: P.gold, out: T13.exit - 0.1 });
  } });

  // ================================================================ SUMMARY · the strongest moment: all four numbers together on gold
  const T14 = { in: T13.exit, sum: Q(89, 0), oz: Q(90, 0), troy: Q(90, 4), mq: Q(91, 0), iraq: Q(91, 2), five: Q(91, 3), lot: Q(92, 0), n100: Q(92, 4), spec: Q(93, 0), spec2: Q(93, 1), exit: q8(w(94, 0) - 0.3) };
  LABELS.push([T14.in + 0.2, 'الخلاصة']);
  sfx(T14.in - 1.9, 'riser', 0.16, { d: 1.9 }); hit(T14.in + 0.25, 0.36); sfx(T14.sum, 'slam', 0.18);
  [T14.oz, T14.mq, T14.lot, T14.spec].forEach((tt, i) => { sfx(tt, 'snap', 0.18, { pan: [0.4, 0.15, -0.15, -0.4][i] }); sfx(tt + 0.02, 'pop', 0.12, { f: 600 + i * 120 }); });
  sfx(T14.troy, 'tick', 0.12, { f: 2400 }); sfx(T14.five, 'tick', 0.12, { f: 2400 }); sfx(T14.n100, 'tick', 0.12, { f: 2400 });
  const CX = [1500, 1140, 780, 420], CY = 500;
  act({ name: 'summary', t0: T14.in, din: 0.55, enter: 'slats', field: 'gold', t1: T14.exit + 0.7, draw(ctx, t) {
    const ko = 1 - EI(t, T14.exit, 0.35); const bp = 1 + 0.04 * beatPulse(t);
    const ttl = EIO(t, T14.sum + 0.6, 0.5); const ts = lerp(220, 90, ttl), ty = lerp(600, 210, ttl);
    if (t > T14.sum - 0.05) { ctx.save(); slat(ctx, 'الخلاصة', 960, ty, ts, t, T14.sum, { color: P.ink, out: T14.exit - 0.1 }); ctx.restore(); }
    shp(ctx, 'circle', CX[0], CY, 120 * bp, P.ink, sc(t, T14.oz) * ko);
    shp(ctx, 'hex', CX[1], CY, 128 * bp, P.slate, sc(t, T14.mq) * ko);
    const lk = sc(t, T14.lot) * ko; if (lk > 0) discs(ctx, CX[2], CY + 80 * lk, Array.from({ length: 10 }, (_, i) => ({ r: 115 * lk * bp, h: 10 * lk, top: i % 2 ? P.ink : P.white, side: P.ink })), 0.3, { gap: 4 * lk });
    const uk = sc(t, T14.spec) * ko; if (uk > 0) { const w0 = 220 * uk, h0 = 230 * uk; ctx.fillStyle = P.white; ctx.fillRect(CX[3] - w0 / 2, CY - h0 / 2, w0, h0); ctx.fillStyle = P.ink; ctx.fillRect(CX[3] - w0 / 2, CY - h0 / 2, w0, 34 * uk); for (let k = 0; k < 4; k++) { ctx.fillStyle = k ? hexA(P.ink, 0.25) : P.gold; ctx.fillRect(CX[3] - w0 / 2 + 18 * uk, CY - h0 / 2 + (60 + k * 42) * uk, (k ? 150 : 184) * uk, 22 * uk); } }
    const lab = [['أونصة تروي', '31.1 g', T14.oz, T14.troy], ['مثقال عراقي', '5 g', T14.mq, T14.five], ['لوت', '100 oz', T14.lot, T14.n100], ['راجع المواصفات', 'عند وسيطك', T14.spec, T14.spec2]];
    lab.forEach((l, i) => { slat(ctx, l[0], CX[i], 720, 46, t, l[2], { w: 'S', color: P.ink, out: T14.exit - 0.1 }); slat(ctx, l[1], CX[i], 820, i === 3 ? 44 : 64, t, l[3], { w: i === 3 ? 'S' : 800, color: P.ink, out: T14.exit - 0.1 }); });
  } });

  // ================================================================ NEXT LESSON · gold trading hours in Baghdad time · the free written guide · back to the gold bar
  const T15 = { in: T14.exit, q: Q(94, 0), bgd: Q(94, 4), next: Q(95, 4), guide: Q(96, 0), free: Q(96, 4), below: Q(96, 5), end: F.CLOSE - 0.62 };
  LABELS.push([T15.in + 0.2, 'الدرس الجاي']);
  hit(T15.in + 0.25, 0.22); sfx(T15.bgd, 'pop', 0.14, { f: 760 }); sfx(T15.next, 'chime', 0.14); sfx(T15.guide, 'whoosh', 0.1, { d: 0.35 }); sfx(T15.free, 'pop', 0.14, { f: 900 }); sfx(T15.below, 'bloop', 0.12); sfx(T15.end, 'whoosh', 0.14, { d: 0.5, up: false });
  act({ name: 'next', t0: T15.in, din: 0.5, enter: 'slats', field: 'paper', t1: F.CLOSE, draw(ctx, t) {
    const gone = EI(t, T15.end, 0.3); const ko = 1 - gone;
    ctx.save();
    // a clock made of shapes, its hand stepping on the beat
    const ck = E(t, T15.q, 0.4) * (1 - EI(t, T15.guide - 0.2, 0.35));
    if (ck > 0) { shp(ctx, 'circle', 1350, 520, 190, P.ink, ck); const b = beatAt(t); const an = -Math.PI / 2 + b * Math.PI / 6; ctx.strokeStyle = P.gold; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(1350, 520); ctx.lineTo(1350 + Math.cos(an) * 150 * ck, 520 + Math.sin(an) * 150 * ck); ctx.stroke(); ctx.strokeStyle = P.white; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(1350, 520); ctx.lineTo(1350 + Math.cos(an / 12) * 95 * ck, 520 + Math.sin(an / 12) * 95 * ck); ctx.stroke(); }
    chipF(ctx, 'بتوقيت بغداد', 1350, 790, { size: 32, fill: P.gold, color: P.ink, p: popE(t, T15.bgd) * (1 - EI(t, T15.guide - 0.2, 0.3)) });
    slatRow(ctx, [{ s: 'شنو', t: T15.q }, { s: 'أوقات', t: Q(94, 1) }, { s: 'تداول', t: Q(94, 2) }, { s: 'الذهب؟', t: Q(94, 3) }], 620, 470, 76, t, { align: 'center', w: 'S', color: P.ink, out: T15.guide - 0.2 });
    chipF(ctx, 'الدرس الجاي', 620, 620, { size: 40, fill: P.gold, color: P.ink, p: popE(t, T15.next) * (1 - EI(t, T15.end, 0.25)) });
    // the free written guide, under the video
    const gk = E(t, T15.guide, 0.4) * ko;
    if (gk > 0) { const gx = 1350, gy = 470 + (1 - gk) * 80; ctx.fillStyle = P.white; ctx.fillRect(gx - 150, gy - 190, 300, 380); ctx.fillStyle = P.ink; ctx.fillRect(gx - 150, gy - 190, 300, 50); for (let k = 0; k < 6; k++) { ctx.fillStyle = k ? hexA(P.ink, 0.2) : P.gold; ctx.fillRect(gx - 120, gy - 100 + k * 46, k ? 240 - (k % 3) * 50 : 200, k ? 16 : 24); } }
    slat(ctx, 'الدليل المكتوب', 620, 470, 76, t, Q(96, 2), { w: 'S', color: P.ink, out: T15.end - 0.05 });
    chipF(ctx, 'مجاني', 1350, 230, { size: 32, fill: P.gold, color: P.ink, p: popE(t, T15.free) * ko });
    arrowF(ctx, 1350, 700, 1350, 860, E(t, T15.below, 0.3) * ko, { color: P.ink, w: 8, head: 30 });
    ctx.restore();
    // everything gives way to the gold bar the film started from (the frame at 00:02.05)
    const bar = E(t, T15.end + 0.18, 0.25); if (bar > 0) { const hh = lerp(0, 200, bar) * (1 - EI(t, F.CLOSE - 0.22, 0.2)); ctx.fillStyle = P.gold; ctx.fillRect(960 - 8, 540 - hh / 2, 16, hh); }
  } });

  // ================================================================ music: 120 BPM, G minor (Gm9 · Ebmaj9 · Bbmaj7 · F6/9), FM plucks + off-beat stabs,
  // a kick on every beat from the first word to the X; L4 (16th arps) on the big moments; riser into the summary
  F.STYLE = { bpm: 120, chords: [[43, [58, 62, 65, 69, 70]], [39, [58, 62, 63, 67, 70]], [46, [57, 62, 65, 69, 70]], [41, [57, 60, 62, 65, 67]]], kit: 'four', pluck: 'fm', swing: 0.0, bass: [0, 1, 0, 1, 0, 1, 0, 1], arp: [0, 3, 1, 4, 2, 4, 1, 3], padcut: 2200, duck: 0.6, stab: true };
  const T1 = G.REEL.T1;
  F.MUSIC = [
    { t: 0, lvl: 1 }, { t: 2.0, lvl: 3 }, { t: T1.H1.fill + 0.35, lvl: 4 }, { t: T1.T2.oz, lvl: 3 },
    { t: T2.T8.in + 0.3, lvl: 4 }, { t: T2.T8.sym, lvl: 3 }, { t: T2.T10.n100 + 0.35, lvl: 4 }, { t: T2.T10.varies + 0.5, lvl: 3 },
    { t: T14.in + 0.25, lvl: 4 }, { t: T14.exit, lvl: 3 }, { t: F.CLOSE, lvl: 1 },
  ];

  F.addClose();
})(typeof window !== 'undefined' ? window : globalThis);
