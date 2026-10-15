// Gold 03 · reel 2 — part two: the contract symbol · CFD · Market Watch → Specification · the 3D lot stack (2D slices → 3D) ·
// 0.01 lot = 1 oz · P/L lanes per lot size.
(function (G) {
  const A = G.AX, F = G.FILM, R = G.REEL;
  const { W, H, C, clamp, lerp, hexA, txt, lat, mixHex } = A;
  const { w, sfx } = F;
  const { P, q8, beatAt, BEAT, GRID0, xo, xi, xio, E, EI, EIO, crit, outP, act, slat, slatRow, textW, shape, mixPts, fillPts, discs, chipF, tokF, popE, arrowF, roll, LABELS } = R;
  const Q = (p, k) => q8(w(p, k));
  const hit = (t, g = 0.22) => { sfx(t - 0.01, 'impact', g); sfx(t - 0.06, 'whoosh', g * 0.6, { d: 0.35 }); };
  const latW = (s, size, wgt = 800) => { const c = document.createElement('canvas').getContext('2d'); c.font = `${wgt} ${size}px IN`; return c.measureText(s).width; };
  const T1 = G.REEL.T1;

  // ================================================================ PART TWO · the symbol · GOLD · suffixes · CFD
  const T8 = { in: T1.T7.exit, part: Q(33, 0), title: Q(34, 0), title2: Q(34, 1), sym: Q(35, 0), xau: Q(36, 0), means: Q(37, 0), g: Q(37, 1), d: Q(37, 3), some: Q(38, 0), gold: Q(38, 4),
    suf: Q(39, 1), cfd0: Q(40, 0), cfd: Q(40, 2), diff: Q(41, 0), notb: Q(42, 0), exit: q8(w(43, 0) - 0.3) };
  LABELS.push([T8.in + 0.2, 'عقد الذهب']);
  hit(T8.in + 0.3, 0.3); sfx(T8.part, 'pop', 0.12, { f: 600 }); sfx(T8.title, 'slam', 0.18); sfx(T8.xau, 'slam', 0.16); sfx(T8.xau + 0.03, 'type', 0.08, { d: 0.35, n: 6 });
  sfx(T8.g, 'pop', 0.14, { f: 760 }); sfx(T8.d, 'pop', 0.14, { f: 900 }); sfx(T8.gold, 'slam', 0.16); for (let i = 0; i < 4; i++) sfx(T8.suf + 0.25 + i * BEAT, 'tick', 0.12, { f: 2200 + i * 200 });
  sfx(T8.cfd, 'slam', 0.18); sfx(T8.diff, 'pop', 0.12, { f: 700 }); sfx(T8.notb, 'buzz', 0.1); sfx(T8.notb + 0.3, 'snap', 0.14);
  const SUF = ['.a', 'm', '.', '.pro'];
  act({ name: 'contract', t0: T8.in, din: 0.55, enter: 'bars', n: 12, field: 'ink', t1: T8.exit + 0.7, draw(ctx, t) {
    slat(ctx, 'الجزء الثاني', 960, 380, 64, t, T8.part, { w: 'S', color: P.white, out: T8.sym - 0.1 });
    slatRow(ctx, [{ s: 'عقد', t: T8.title }, { s: 'الذهب', t: T8.title2 }], 960, 650, 210, t, { align: 'center', color: P.gold, out: T8.sym - 0.1 });
    // the symbol
    slat(ctx, 'الرمز', 960, 300, 52, t, T8.sym, { w: 'S', color: P.gold, out: T8.some - 0.1 });
    slat(ctx, 'عند بعض الوسطاء', 960, 300, 52, t, T8.some, { w: 'S', color: P.gold, out: T8.suf - 0.15 });
    const S = 240, wx = latW('XAUUSD', S), wxau = latW('XAU', S); const x0 = 960 - wx / 2;
    const xOut = T8.gold - 0.1;
    slat(ctx, 'XAUUSD', 960, 640, S, t, T8.xau, { w: 800, color: P.white, n: 7, out: xOut });
    // «يعني الذهب مقابل الدولار»: brackets under XAU / USD
    const b1 = E(t, T8.g, 0.35) * outP(t, xOut, 0.25), b2 = E(t, T8.d, 0.35) * outP(t, xOut, 0.25);
    if (b1 > 0) { ctx.fillStyle = P.gold; ctx.fillRect(x0 + 6, 690, (wxau - 20) * b1, 10); slat(ctx, 'الذهب', x0 + wxau / 2, 790, 60, t, T8.g, { w: 'S', color: P.gold, out: xOut }); }
    if (b2 > 0) { ctx.fillStyle = P.white; ctx.fillRect(x0 + wxau + 14, 690, (wx - wxau - 20) * b2, 10); slat(ctx, 'الدولار', x0 + wxau + (wx - wxau) / 2, 790, 60, t, T8.d, { w: 'S', color: P.white, out: xOut }); }
    slat(ctx, 'GOLD', 960, 640, S, t, T8.gold, { w: 800, color: P.gold, n: 7, out: T8.suf - 0.1 });
    // suffixes: one per beat
    if (t > T8.suf && t < T8.cfd0 + 0.4) {
      const k = Math.max(0, Math.min(SUF.length - 1, Math.floor((t - T8.suf - 0.25) / BEAT))); const s = SUF[k]; const ws = latW(s, S); const xx = 960 - (wx + ws) / 2;
      slat(ctx, 'XAUUSD', xx + wx / 2, 640, S, t, T8.suf, { w: 800, color: P.white, n: 7, out: T8.cfd0 });
      if (t > T8.suf + 0.25) { ctx.save(); const tk = T8.suf + 0.25 + k * BEAT; const e = E(t, tk, 0.2); ctx.globalAlpha *= outP(t, T8.cfd0, 0.2); lat(ctx, s, xx + wx + (1 - e) * 60, 640, { size: S, w: 800, color: P.gold }); ctx.restore(); }
      slat(ctx, 'حرف أو نقطة بآخر الرمز', 960, 820, 50, t, Q(39, 2), { w: 'S', color: P.white, out: T8.cfd0 });
    }
    // CFD
    slat(ctx, 'CFD', 960, 560, 280, t, T8.cfd, { w: 800, color: P.white, n: 7, out: T8.exit - 0.15 });
    slatRow(ctx, [{ s: 'عقد', t: Q(41, 1) }, { s: 'على', t: Q(41, 2) }, { s: 'فرق', t: Q(41, 3) }, { s: 'السعر', t: Q(41, 4) }], 960, 720, 72, t, { align: 'center', w: 'S', color: P.gold, out: T8.exit - 0.15 });
    // «مو شراء ذهب حقيقي»: a bar of gold, struck out
    const nb = E(t, T8.notb, 0.35) * outP(t, T8.exit - 0.15, 0.25);
    if (nb > 0) {
      ctx.save(); ctx.globalAlpha *= nb; const ix = 1250, iy = 850; ctx.beginPath(); ctx.moveTo(ix - 90, iy + 32); ctx.lineTo(ix + 90, iy + 32); ctx.lineTo(ix + 66, iy - 32); ctx.lineTo(ix - 66, iy - 32); ctx.closePath(); ctx.fillStyle = P.gold; ctx.fill();
      const sk = E(t, T8.notb + 0.3, 0.25); ctx.strokeStyle = P.red; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(ix - 120, iy + 50); ctx.lineTo(lerp(ix - 120, ix + 120, sk), lerp(iy + 50, iy - 50, sk)); ctx.stroke(); ctx.restore();
      slatRow(ctx, [{ s: 'مو', t: T8.notb, color: P.red }, { s: 'شراء', t: Q(42, 1) }, { s: 'ذهب', t: Q(42, 2) }, { s: 'حقيقي', t: Q(42, 3) }], 1080, 868, 50, t, { w: 'S', color: P.white, out: T8.exit - 0.15 });
    }
  } });

  // ================================================================ MARKET WATCH → right-click → Specification
  const T9 = { in: T8.exit, pc: Q(43, 0), click: Q(44, 1), sym: Q(44, 4), win: Q(44, 5), choose: Q(45, 0), spec: Q(45, 1), en: Q(46, 0), find: Q(47, 0),
    rows: [Q(48, 0), Q(49, 0), Q(50, 0), Q(51, 0), Q(52, 0), Q(53, 0)], exit: q8(w(54, 0) - 0.2) };
  LABELS.push([T9.in + 0.2, 'المواصفات']);
  hit(T9.in + 0.25, 0.22); sfx(T9.pc, 'pop', 0.12, { f: 600 }); sfx(T9.click, 'click', 0.2); sfx(T9.sym, 'tick', 0.12, { f: 2400 }); sfx(T9.choose + 0.3, 'tick', 0.1, { f: 2000 }); sfx(T9.spec, 'click', 0.2); sfx(T9.en, 'pop', 0.12, { f: 820 });
  T9.rows.forEach((tt, i) => sfx(tt, 'tick', 0.12, { f: 1800 + i * 160 }));
  const MW = { x: 260, y: 230, w: 860, h: 600 };
  const ROWS = [['XAUUSD', '4,012.35', '4,012.65'], ['EURUSD', '1.0842', '1.0843'], ['GBPUSD', '1.2718', '1.2720'], ['USDJPY', '151.32', '151.34'], ['XAGUSD', '31.05', '31.08']];
  const SPEC = [['حجم العقد', '100'], ['أقل حجم', '0.01'], ['عدد الخانات', '2'], ['السواب', '—'], ['الهامش', '—'], ['الجلسات', '—']];
  const SP = { x: 1180, y: 230, w: 600, h: 600 };
  G.REEL.SPEC100 = { x: SP.x + 110, y: SP.y + 128 + 0 * 74 + 10 };
  function cursor(ctx, x, y, press) { ctx.save(); ctx.translate(x, y); const s = 1 - 0.15 * press; ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 44); ctx.lineTo(11, 33); ctx.lineTo(20, 52); ctx.lineTo(28, 48); ctx.lineTo(19, 30); ctx.lineTo(34, 30); ctx.closePath(); ctx.fillStyle = P.ink; ctx.fill(); ctx.strokeStyle = P.white; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
  act({ name: 'mw', t0: T9.in, din: 0.5, enter: 'slats', field: 'paper', t1: T9.exit + 0.8, draw(ctx, t) {
    const ko = 1, gone = EI(t, T9.exit, 0.4);
    // the window (flat card, ink title bar) — it leaves by sliding up, the panel by sliding down
    const wk = E(t, T9.pc, 0.4); if (wk <= 0) return;
    ctx.save(); ctx.translate(0, -gone * 1000); const wy = MW.y + (1 - wk) * 60;
    ctx.fillStyle = P.white; ctx.fillRect(MW.x, wy, MW.w, MW.h * wk); ctx.fillStyle = P.ink; ctx.fillRect(MW.x, wy, MW.w, 64);
    const hl = E(t, T9.win, 0.2) * (1 - E(t, T9.win + 0.6, 0.3)); if (hl > 0) { ctx.fillStyle = hexA(P.gold, hl); ctx.fillRect(MW.x, wy, MW.w, 64); }
    txt(ctx, 'مراقبة السوق', MW.x + MW.w - 30, wy + 43, { size: 30, w: 'S', color: P.white });
    if (wk > 0.6) {
      const cols = [MW.x + MW.w - 30, MW.x + 470, MW.x + 220];
      txt(ctx, 'الرمز', cols[0], wy + 112, { size: 26, w: 'S', color: P.slate }); txt(ctx, 'سعر البيع', cols[1], wy + 112, { size: 26, w: 'S', color: P.slate }); txt(ctx, 'سعر الشراء', cols[2], wy + 112, { size: 26, w: 'S', color: P.slate });
      ROWS.forEach((r, i) => {
        const rk = E(t, T9.pc + 0.25 + i * 0.125, 0.3); if (rk <= 0) return; const ry = wy + 170 + i * 84;
        if (i === 0) { const sel = E(t, T9.click, 0.15); if (sel > 0) { ctx.fillStyle = hexA(P.gold, 0.9 * sel); ctx.fillRect(MW.x + 8, ry - 50, MW.w - 16, 76); } const sh = E(t, T9.sym, 0.2) * (1 - E(t, T9.sym + 0.5, 0.3)); if (sh > 0) { ctx.strokeStyle = P.ink; ctx.lineWidth = 4; ctx.strokeRect(cols[0] - 200, ry - 44, 210, 64); } }
        ctx.save(); ctx.globalAlpha *= rk; const tick = (beatAt(t) + i) % 3 === 0 ? 0.01 : 0;
        lat(ctx, r[0], cols[0], ry, { size: 30, w: 700, color: P.ink, align: 'right' }); lat(ctx, r[1], cols[1], ry, { size: 30, w: 600, color: P.ink, align: 'right' }); lat(ctx, r[2], cols[2], ry, { size: 30, w: 600, color: P.ink, align: 'right' });
        ctx.restore();
        ctx.fillStyle = hexA(P.ink, 0.08); ctx.fillRect(MW.x + 20, ry + 30, MW.w - 40, 2);
      });
    }
    ctx.restore();
    // context menu after the right-click
    const mk = E(t, T9.click + 0.1, 0.3) * outP(t, T9.spec + 0.35, 0.25); ctx.save(); ctx.translate(0, -gone * 1000);
    const MX = MW.x + MW.w - 330, MY = MW.y + 200;
    if (mk > 0) {
      ctx.save(); ctx.globalAlpha *= mk; ctx.fillStyle = P.white; ctx.fillRect(MX, MY, 300, 260 * mk); ctx.strokeStyle = P.ink; ctx.lineWidth = 3; ctx.strokeRect(MX, MY, 300, 260 * mk);
      ['أمر جديد', 'الرسم البياني', 'المواصفات', 'الأعمدة'].forEach((s, i) => { const iy = MY + 52 + i * 60; if (i === 2) { const h = E(t, T9.choose + 0.25, 0.2); if (h > 0) { ctx.fillStyle = hexA(P.gold, h); ctx.fillRect(MX + 6, iy - 40, 288, 56); } } txt(ctx, s, MX + 276, iy, { size: 28, w: i === 2 ? 'S' : 'R', color: P.ink }); });
      ctx.restore();
    }
    ctx.restore();
    // the cursor
    const path = [[T9.pc + 0.3, 1500, 980], [T9.click - 0.05, MW.x + MW.w - 140, MW.y + 200], [T9.choose, MW.x + MW.w - 140, MW.y + 200], [T9.choose + 0.3, MX + 150, MY + 52 + 2 * 60 - 14], [T9.spec + 0.5, MX + 150, MY + 52 + 2 * 60 - 14], [T9.en, 1700, 1000]];
    if (t > path[0][0] && t < T9.exit) { let p = path[0]; for (let i = 1; i < path.length; i++) if (t >= path[i - 1][0]) { const a = path[i - 1], b = path[i]; const e = EIO(t, a[0], Math.max(0.05, b[0] - a[0])); p = [0, lerp(a[1], b[1], e), lerp(a[2], b[2], e)]; } const press = Math.max(Math.exp(-Math.pow((t - T9.click) / 0.06, 2)), Math.exp(-Math.pow((t - T9.spec) / 0.06, 2))); cursor(ctx, p[1], p[2], press); }
    // the specification panel
    const sk = E(t, T9.spec + 0.1, 0.45) * ko; if (sk > 0) {
      const sx = SP.x + (1 - sk) * 120; ctx.save(); ctx.translate(0, EI(t, T9.exit + 0.1, 0.4) * 1000); ctx.globalAlpha *= clamp(sk * 2);
      ctx.fillStyle = P.white; ctx.fillRect(sx, SP.y, SP.w, SP.h); ctx.fillStyle = P.ink; ctx.fillRect(sx, SP.y, SP.w, 64);
      txt(ctx, 'المواصفات', sx + SP.w - 30, SP.y + 43, { size: 30, w: 'S', color: P.white });
      tokF(ctx, 'Specification', sx + 140, SP.y + 32, { size: 22, fill: P.gold, color: P.ink, p: popE(t, T9.en) });
      SPEC.forEach((r, i) => {
        const ry = SP.y + 128 + i * 74; const nxt = i + 1 < T9.rows.length ? T9.rows[i + 1] : T9.exit; const on = E(t, T9.rows[i], 0.2) * (1 - E(t, nxt, 0.2)); const done = E(t, T9.rows[i], 0.2); const rk = E(t, T9.find + i * 0.06, 0.3); if (rk <= 0) return;
        if (on > 0) { ctx.fillStyle = hexA(P.gold, on); ctx.fillRect(sx + 8, ry - 46, SP.w - 16, 66); }
        if (done > 0) { ctx.fillStyle = P.gold; ctx.fillRect(sx + SP.w - 16, ry - 40, 8, 54 * done); }
        txt(ctx, r[0], sx + SP.w - 30, ry, { size: 30, w: 'S', color: P.ink, alpha: rk });
        lat(ctx, r[1], sx + 40, ry, { size: 32, w: 800, color: P.ink, alpha: rk * (r[1] === '—' ? 0.4 : 1) });
      });
      ctx.restore();
    }
  } });

  // ================================================================ THE LOT · 100 oz as a stack of 100 coins: 2D slices → 3D → cone (≈ 622 mithqal) → one coin (0.01 lot)
  const T10 = { in: T9.exit, many: Q(54, 0), lot: Q(54, 4), n100: Q(54, 5), oz: Q(54, 6), varies: Q(55, 2), if100: Q(56, 1), n622: Q(57, 2), mq: Q(57, 3), pure: Q(57, 5), small: Q(58, 0), lot2: Q(58, 1), one: Q(58, 2), exit: q8(w(59, 0) - 0.3) };
  LABELS.push([T10.in + 0.2, 'اللوت']);
  hit(T10.in + 0.2, 0.26); sfx(T10.lot, 'slam', 0.14); sfx(T10.many + 0.25, 'charge', 0.08, { d: T10.n100 - T10.many - 0.25 }); sfx(T10.n100 + 0.35, 'impact', 0.2); sfx(T10.varies, 'pop', 0.12, { f: 640 });
  sfx(T10.if100, 'stretch', 0.14); sfx(T10.n622, 'type', 0.08, { d: 0.6, n: 8 }); sfx(T10.n622 + 0.65, 'slam', 0.14); sfx(T10.small - 0.05, 'whoosh', 0.16, { d: 0.5, up: false }); sfx(T10.lot2, 'pop', 0.16, { f: 900 });
  const SC = { x: 1310, y: 860, r: 168, n: 100, h: 3.0, gap: 1.6 };
  const coinT = (i) => T10.many + 0.25 + i * (T10.n100 - T10.many - 0.3) / 100;   // the coins land bottom → top; the 100th on «100»
  function stackList(t) {
    const cone = EIO(t, T10.if100, 1.0); const keep = EI(t, T10.small, 0.5); const out = [];
    for (let i = 0; i < SC.n; i++) {
      const land = E(t, coinT(i), 0.18); if (land <= 0) break;
      const rCone = SC.r * (1 - 0.86 * i / SC.n); const r = lerp(SC.r, rCone, cone) * (i === 0 ? 1 : 1 - keep);
      const mq = t > T10.n622 && i <= (t - T10.n622) * 140 ? 1 : 0;
      out.push({ r, h: SC.h * land * (i === 0 ? 1 : 1 - keep), top: i === 0 ? P.gold : i % 2 ? P.ink : (mq ? P.slate : P.gold), side: P.ink });
    }
    return out;
  }
  act({ name: 'lot', t0: T10.in, din: 0, enter: 'none', field: null, t1: T10.exit + 0.9, draw(ctx, t) {
    const tilt = lerp(0.0, 0.34, EIO(t, T10.n100 + 0.35, 0.8)); const ko = outP(t, T10.exit + 0.5, 0.3);
    const list = stackList(t);
    // 2D → 3D: side view slices first, then the stack tilts open
    if (list.length) discs(ctx, SC.x, SC.y, list.map((d) => Object.assign({}, d, { r: d.r * ko })), Math.max(0.0, tilt), { gap: SC.gap * (1 - EI(t, T10.small, 0.5)) });
    // the hero numbers (left column)
    slat(ctx, 'عند هواية من الوسطاء', 560, 300, 50, t, T10.many, { w: 'S', color: P.slate, out: T10.lot - 0.1 });
    slat(ctx, 'اللوت', 560, 300, 90, t, T10.lot, { color: P.ink, out: T10.small - 0.2 });
    slat(ctx, '100', 560, 560, 230, t, T10.n100, { w: 800, color: P.ink, n: 6, out: T10.n622 - 0.2 });
    slat(ctx, 'أونصة', 560, 690, 70, t, T10.oz, { w: 'S', color: P.ink, out: T10.n622 - 0.2 });
    chipF(ctx, 'يختلف حسب الوسيط ونوع الحساب', 560, 800, { size: 28, line: P.ink, color: P.ink, p: popE(t, T10.varies) * outP(t, T10.if100, 0.25) });
    const n = Math.round(roll(t, T10.n622, 0.6, 100, 622)); if (t > T10.n622 - 0.05) slat(ctx, '≈ ' + n, 560, 560, 200, t, T10.n622, { w: 800, color: P.ink, n: 6, out: T10.small - 0.2 });
    slat(ctx, 'مثقال ذهب نقي', 560, 690, 64, t, T10.mq, { w: 'S', color: P.ink, out: T10.small - 0.2 });
    slat(ctx, '0.01', 560, 560, 220, t, T10.small + 0.1, { w: 800, color: P.ink, n: 6, out: T10.exit + 0.3 });
    slat(ctx, 'لوت = أونصة وحدة', 560, 700, 64, t, T10.lot2, { w: 'S', color: P.ink, out: T10.exit + 0.3 });
  } });

  // ================================================================ P/L LANES · $1 move · 0.01 lot ≈ $1 · 1 lot ≈ $100 · losses grow like profits
  const T11 = { in: T10.exit + 0.4, chip: Q(59, 0), move: Q(60, 0), one: Q(60, 2), means: Q(61, 0), d1: Q(61, 5), l001: Q(62, 1), d100: Q(63, 0), full: Q(64, 1), loss: Q(65, 0), grow: Q(65, 1), like: Q(65, 5), exit: q8(w(66, 0) - 0.3) };
  LABELS.push([T11.in + 0.1, 'ربح وخسارة']);
  hit(T11.in, 0.18); sfx(T11.chip, 'pop', 0.12, { f: 660 }); sfx(T11.one, 'pop', 0.14, { f: 880 }); sfx(T11.d1, 'tick', 0.12, { f: 2600 }); sfx(T11.d100, 'slam', 0.16); sfx(T11.d100 + 0.02, 'whoosh', 0.12, { d: 0.4 }); sfx(T11.loss, 'buzz', 0.1); sfx(T11.grow, 'stretch', 0.12);
  const AX = 900, LY = [540, 650, 760], LN = ['0.01 لوت', '0.1 لوت', '1 لوت'], LV = [1, 10, 100], LT = [T11.d1, T11.loss + 0.5, T11.d100];
  act({ name: 'pl', t0: T11.in, din: 0, enter: 'none', field: null, t1: T11.exit + 0.7, draw(ctx, t) {
    const ko = outP(t, T11.exit, 0.3);
    chipF(ctx, 'مثال افتراضي', 960, 200, { size: 30, line: P.ink, color: P.ink, p: popE(t, T11.chip) * ko });
    // the coin seen from above, with its $1 move
    const cc = E(t, T11.in - 0.2, 0.5) * ko; if (cc > 0) { fillPts(ctx, shape('circle', lerp(SC.x, 420, cc), lerp(SC.y - 10, 400, cc), lerp(SC.r, 70, cc)), P.gold); }
    tokF(ctx, '+$1', 600, 400, { size: 30, p: popE(t, T11.one) * ko });
    slat(ctx, 'حركة دولار واحد بسعر الأونصة', 1180, 410, 44, t, T11.move, { w: 'S', color: P.ink, out: T11.exit });
    // lanes
    const ax = E(t, T11.means - 0.1, 0.4) * ko; if (ax > 0) { ctx.fillStyle = P.ink; ctx.fillRect(AX - 2, 480, 4, 330 * ax); }
    LY.forEach((y, i) => {
      const vis = t > (i === 0 ? T11.means : i === 1 ? T11.loss + 0.4 : T11.d100 - 0.2) ? 1 : 0; if (!vis) return;
      const g = E(t, LT[i], 0.5) * ko; const L = LV[i] * 5.2 * g; const pulse = 1 + 0.06 * Math.exp(-((t - GRID0) / BEAT % 1) * 6) * (t > T11.grow ? 1 : 0);
      ctx.fillStyle = P.mint; ctx.fillRect(AX + 2, y - 26, Math.max(2, L * pulse), 52);
      ctx.fillStyle = P.red; ctx.fillRect(AX - 2 - Math.max(2, L * pulse), y - 26, Math.max(2, L * pulse), 52);
      txt(ctx, LN[i], 1760, y + 12, { size: 36, w: 'S', color: P.ink, alpha: ko * E(t, i === 0 ? T11.l001 : LT[i] - 0.2, 0.3) });
      if (g > 0.2) { lat(ctx, '+$' + LV[i], AX + 14 + Math.max(L, 0) + 12, y + 12, { size: 30, w: 800, color: P.ink, alpha: ko }); lat(ctx, '−$' + LV[i], AX - 14 - Math.max(L, 0) - 12, y + 12, { size: 30, w: 800, color: P.ink, align: 'right', alpha: ko }); }
    });
    chipF(ctx, 'مثل الربح', 1240, 870, { size: 28, fill: '#2FA884', p: popE(t, T11.like) * ko });
    chipF(ctx, 'الخسارة تكبر مع حجم اللوت', 640, 870, { size: 28, fill: P.red, p: popE(t, T11.loss) * ko });
  } });
  G.REEL.T2 = { T8, T9, T10, T11 };
})(typeof window !== 'undefined' ? window : globalThis);
