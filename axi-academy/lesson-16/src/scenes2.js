// Act II — what is technical analysis: definition, indicators, hand drawing, candles, bigger picture, practice.
(function (G) {
  const A = G.AX, F = G.FILM;
  const { W, H, C, INK, clamp, lerp, inv, sp, spring, eo, ei, eio, hexA, background, line, rectPts, circPts, hatch, scanFill, txt, lat, measure, wipeText, tri, roundRect, series, sma, subPath } = A;
  const { w, we, ph, phe, sfx, hud, rich, eyebrow, card, tag, pill, hero, candles, linePts, scene } = F;

  // ---------- section opener (primary gradient) ----------
  function opener(ctx, t, num, title, tA, tB, t0) {
    background(ctx, 'steel', { gradient: [C.frost, C.slate], grid: false });
    const pn = sp(t, t0 + 0.05, 14);
    if (pn > 0) {
      ctx.save(); ctx.translate((1 - pn) * 120, 0);
      const nw = A.lat(ctx, num, 1775, 560, { size: 210, w: 300, color: C.white, align: 'right', track: -6 });
      tri(ctx, 1775 - nw - 40, 488, 34, 'r', C.red);
      ctx.restore();
    }
    wipeText(ctx, title, 1775, 850, { size: 150, w: 'L', color: C.white }, inv(tA, tB, t));
    hud(ctx, t, 'steel', '', { tl: false, logoColor: C.ink });
  }
  F.opener = opener;

  // =====================================================================
  // S8 — opener: ما هو التحليل الفني؟
  // =====================================================================
  const S8 = { t0: ph(27), t1: ph(28) };
  sfx(S8.t0 - 1.3, 'riser', 0.2, { d: 1.3 }); sfx(S8.t0 - 0.4, 'scan', 0.26, { d: 0.45 });
  sfx(S8.t0 + 0.05, 'thump', 0.42); sfx(w(27, 2), 'swipe', 0.16, { d: 0.5 });
  scene({
    name: 'tech-open', t0: S8.t0, t1: S8.t1, enter: { type: 'scanUp', dur: 0.45, line: C.white },
    draw(ctx, t) { opener(ctx, t, '01', 'ما هو التحليل الفني؟', w(27, 0), we(27, 3), S8.t0); },
  });

  // =====================================================================
  // S9 — definition: charts → the probable direction
  // =====================================================================
  const S9 = { t0: ph(28), t1: ph(30) };
  const k9 = { head: ph(28), sub: w(28, 2), chart: w(29, 1), fan: w(29, 4), prob: w(29, 5) };
  sfx(S9.t0 - 0.35, 'scan', 0.2, { d: 0.4 }); sfx(k9.chart, 'pen', 0.2, { d: 1.0 });
  sfx(k9.fan, 'whoosh', 0.2, { d: 0.5 }); sfx(k9.prob, 'pop', 0.24, { f: 820 });
  const defSeries = series(60, 515, { start: 100, vol: 1.1, drift: (u) => 0.18 + Math.sin(u * 9) * 0.35 });
  scene({
    name: 'tech-def', t0: S9.t0, t1: S9.t1, enter: { type: 'scanDown', dur: 0.4, line: C.white },
    draw(ctx, t) {
      background(ctx, 'steel');
      txt(ctx, 'التحليل الفني', 1770, 250, { size: 96, w: 'L', color: C.white, alpha: eo(t, k9.head - 0.3, 0.4) });
      wipeText(ctx, 'استخدام الرسوم البيانية لتفسير الاتجاه المحتمل للأسعار', 1770, 330, { size: 40, w: 'R', color: INK.steel.sub }, inv(k9.sub, we(29, 6), t));
      const box = [190, 420, 1080, 430]; const vals = defSeries.map((d) => d.c);
      const lo = Math.min(...vals) - 4, hi = Math.max(...vals) + 10; const pts = linePts(vals, box, lo, hi);
      const pr = eo(t, k9.chart, 1.1); line(ctx, 'steel', pts, { reveal: pr, width: 3.4 });
      const last = pts[pts.length - 1];
      if (pr > 0.05) { const head = A.subPath(pts, 0, pr).pop(); ctx.beginPath(); ctx.arc(head[0], head[1], 9, 0, 7); ctx.fillStyle = C.red; ctx.fill(); }
      const pf = eo(t, k9.fan, 0.5);
      if (pf > 0) {
        const angs = [-0.75, -0.42, -0.1, 0.25, 0.55]; const pp = eo(t, k9.prob, 0.4);
        angs.forEach((a, i) => {
          const L = 360; const end = [last[0] + Math.cos(a) * L, last[1] + Math.sin(a) * L * 0.75];
          const isP = i === 1;
          line(ctx, 'steel', [last, end], { reveal: pf, width: isP ? lerp(2, 4.5, pp) : 2, dash: isP && pp > 0.5 ? null : [10, 10], alpha: isP ? 1 : lerp(0.7, 0.3, pp) });
          if (isP && pp > 0.6) tri(ctx, end[0] + 4, end[1] - 4, 26, 'u', C.white);
        });
        tag(ctx, 'الاتجاه المحتمل', 1770, last[1] - 230, { p: pp, color: C.white });
      }
      hud(ctx, t, 'steel', '07|التحليل الفني');
    },
  });

  // =====================================================================
  // S10 — popular indicators: MA, RSI, Stochastic, Bollinger, and more
  // =====================================================================
  const S10 = { t0: ph(30), t1: ph(36) };
  const k10 = { head: w(31, 3), ma: w(32, 1), rsi: w(32, 3), sto: w(33, 0), bb: w(34, 0), more: w(35, 0) };
  sfx(S10.t0, 'whoosh', 0.16, { d: 0.5, up: false }); sfx(k10.head, 'swipe', 0.14, { d: 0.4 });
  [k10.ma, k10.rsi, k10.sto, k10.bb].forEach((x, i) => { sfx(x - 0.05, 'click', 0.28, { pan: 0.5 }); sfx(x + 0.05, 'pen', 0.14, { d: 0.6, pan: -0.2 }); });
  for (let i = 0; i < 4; i++) sfx(k10.more + i * 0.1, 'tick', 0.16, { f: 2400 + i * 250, pan: 0.5 });
  const indSeries = series(70, 2207, { start: 100, vol: 1.3, drift: (u) => Math.sin(u * 7.5) * 0.7 + 0.15 });
  F.indSeries = indSeries;
  function rsiVals(vals, n = 9) { const r = vals.map((_, i) => { let g = 0, l = 0; for (let j = Math.max(1, i - n + 1); j <= i; j++) { const d = vals[j] - vals[j - 1]; if (d > 0) g += d; else l -= d; } return l + g === 0 ? 50 : 100 * g / (g + l); }); return r.map((v, i) => (i < n ? r[n] : v)); }
  function stoch(data, n = 10) { return data.map((_, i) => { const s = data.slice(Math.max(0, i - n + 1), i + 1); const hi = Math.max(...s.map((d) => d.h)), lo = Math.min(...s.map((d) => d.l)); return hi === lo ? 50 : 100 * (data[i].c - lo) / (hi - lo); }); }
  const CL = indSeries.map((d) => d.c), MA = sma(CL, 10), RSI = rsiVals(CL), STK = stoch(indSeries), STD = sma(STK, 3);
  const BBu = CL.map((_, i) => { const s = CL.slice(Math.max(0, i - 9), i + 1); const m = s.reduce((a, b) => a + b, 0) / s.length; const sd = Math.sqrt(s.reduce((a, b) => a + (b - m) ** 2, 0) / s.length); return [m + 2 * sd + 0.6, m - 2 * sd - 0.6]; });
  const LIST = [
    { t: k10.ma, ar: 'المتوسط المتحرك', en: 'Moving Average' },
    { t: k10.rsi, ar: 'مؤشر القوة النسبية', en: 'RSI' },
    { t: k10.sto, ar: 'مذبذب الاستوكاستك', en: 'Stochastic' },
    { t: k10.bb, ar: 'حزم بولنجر', en: 'Bollinger Bands' },
  ];
  function indicatorChart(ctx, t, o) {
    const { box, retract = 0 } = o; const rg = F.range(indSeries, 0.22);
    const m = candles(ctx, 'steel', indSeries, box, { range: rg, alpha: 1 });
    const pMA = eo(t, k10.ma, 0.8) * (1 - retract);
    if (pMA > 0) line(ctx, 'steel', MA.map((v, i) => [m.X(i), m.Y(v)]), { reveal: pMA, width: 3, color: C.white });
    const pBB = eo(t, k10.bb, 0.8) * (1 - retract);
    if (pBB > 0) {
      const up = BBu.map((v, i) => [m.X(i), m.Y(v[0])]), dn = BBu.map((v, i) => [m.X(i), m.Y(v[1])]);
      hatch(ctx, 'steel', (c) => { c.beginPath(); up.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); dn.slice().reverse().forEach(([x, y]) => c.lineTo(x, y)); c.closePath(); },
        { box: [box[0], box[1], box[2] * pBB, box[3]], gap: 12, color: C.white, alpha: 0.18 });
      line(ctx, 'steel', up, { reveal: pBB, width: 2, dash: [8, 6] }); line(ctx, 'steel', dn, { reveal: pBB, width: 2, dash: [8, 6] });
    }
    return m;
  }
  function subPanels(ctx, t, m, box2, retract) {
    const pR = eo(t, k10.rsi, 0.5) * (1 - retract); if (pR <= 0) return;
    const split = eio(t, k10.sto - 0.1, 0.5);
    const [x, y, wd, hh] = box2;
    const rBox = [x, y, wd, lerp(hh, hh * 0.46, split)];
    const sBox = [x, y + hh * 0.54, wd, hh * 0.46];
    const drawOsc = (bx, vals, vals2, label, p) => {
      ctx.save(); ctx.globalAlpha = clamp(p * 1.5);
      ctx.strokeStyle = hexA(C.white, 0.6); ctx.lineWidth = 1.5; ctx.strokeRect(bx[0], bx[1], bx[2], bx[3]);
      [30, 70].forEach((lv) => line(ctx, 'steel', [[bx[0], bx[1] + bx[3] * (1 - lv / 100)], [bx[0] + bx[2], bx[1] + bx[3] * (1 - lv / 100)]], { width: 1.5, dash: [6, 8], alpha: 0.6 }));
      const pts = vals.map((v, i) => [m.X(i), bx[1] + bx[3] * (1 - v / 100)]);
      line(ctx, 'steel', pts, { reveal: p, width: 2.6 });
      if (vals2) line(ctx, 'steel', vals2.map((v, i) => [m.X(i), bx[1] + bx[3] * (1 - v / 100)]), { reveal: p, width: 2, dash: [5, 5], alpha: 0.8 });
      A.lat(ctx, label, bx[0] + 12, bx[1] + 26, { size: 18, w: 600, color: C.white, track: 1 });
      ctx.restore();
    };
    ctx.save(); ctx.beginPath(); ctx.rect(x - 4, y - 4, wd + 8, (hh + 8) * pR); ctx.clip();
    drawOsc(rBox, RSI, null, 'RSI', eo(t, k10.rsi, 0.9));
    if (split > 0) drawOsc(sBox, STK, STD, 'STOCHASTIC', eo(t, k10.sto, 0.9) * split);
    ctx.restore();
  }
  F.indicatorChart = indicatorChart;
  scene({
    name: 'indicators', t0: S10.t0, t1: S10.t1, enter: { type: 'cut' },
    draw(ctx, t) {
      background(ctx, 'steel');
      const pin = eio(t, S10.t0, 0.6);
      txt(ctx, 'التحليل الفني', 1770, 250, { size: 96, w: 'L', color: C.white, alpha: 1 - eo(t, k10.head - 0.6, 0.3) });
      rich(ctx, [{ s: 'مؤشرات' }, { s: 'شائعة' }], 1770, 250, { size: 96, w: 'L', color: C.white, p: inv(k10.head - 0.3, we(31, 4), t) });
      // price chart shrinks up as the sub-panel area opens
      const box = [190, 340, 1180, lerp(500, 330, pin)];
      const m = indicatorChart(ctx, t, { box });
      subPanels(ctx, t, m, [190, 700, 1180, 180], 0);
      // indicator list (right column)
      LIST.forEach((it, i) => {
        const p = sp(t, it.t - 0.05, 16); if (p <= 0) return; const y = 380 + i * 112;
        ctx.save(); ctx.translate((1 - p) * 80, 0); ctx.globalAlpha = clamp(p * 1.4);
        txt(ctx, it.ar, 1770, y, { size: 32, w: 'R', color: C.white });
        A.lat(ctx, it.en, 1770, y + 36, { size: 20, w: 600, color: INK.steel.muted, align: 'right', track: 1 });
        tri(ctx, 1430, y - 11, 14, 'l', C.red);
        ctx.restore();
      });
      ['MACD', 'ATR', 'ICHIMOKU', 'FIBONACCI'].forEach((s, i) => {
        const p = sp(t, k10.more + i * 0.1, 18); if (p <= 0) return; const y = 380 + 4 * 112 + Math.floor(i / 2) * 44, x = 1770 - (i % 2) * 170;
        ctx.save(); ctx.globalAlpha = clamp(p * 1.4); A.lat(ctx, s, x, y - 6 + (1 - p) * 20, { size: 18, w: 600, color: INK.steel.muted, align: 'right', track: 2 }); ctx.restore();
      });
      hud(ctx, t, 'steel', '08|المؤشرات');
    },
  });

  // =====================================================================
  // S11 — drawing by hand: horizontal, diagonal, triangles, rectangles, channels, spirals
  // =====================================================================
  const S11 = { t0: ph(36), t1: ph(40) };
  const k11 = { retract: ph(36), pen: w(36, 8), head: w(36, 10), hz: w(38, 1), dg: w(38, 2), tr: w(38, 3), rc: w(38, 4), ch: w(38, 5), sp: w(39, 2), on: w(39, 3), trend: w(39, 10) };
  sfx(k11.retract, 'whoosh', 0.22, { d: 0.5, up: false });
  sfx(k11.pen, 'tick', 0.2); sfx(k11.head, 'swipe', 0.14, { d: 0.4 });
  [[k11.hz, 0.6], [k11.dg, 0.5], [k11.tr, 0.7], [k11.rc, 0.6], [k11.ch, 0.7], [k11.sp, 1.2]].forEach(([x, d], i) => { sfx(x - 0.02, 'pen', 0.26, { d, pan: -0.4 + i * 0.15 }); sfx(x + d, 'tick', 0.12, { f: 3000 }); });
  sfx(k11.trend, 'pop', 0.22, { f: 760 });
  const drawSeries = series(64, 818, { start: 100, vol: 1.25, drift: (u) => (u < 0.3 ? 0.5 : u < 0.62 ? (u < 0.46 ? -0.25 : 0.22) : 0.55) });
  F.drawSeries = drawSeries;
  // hand-drawn analysis layer (shared with the 3D layering scene)
  function drawings(ctx, t, m, s, ink, o = {}) {
    const k = o.k || k11; const alpha = o.alpha == null ? 1 : o.alpha; const col = ink === 'dark' ? C.white : C.white;
    const P = (i, v) => [m.X(i), m.Y(v)];
    const handles = (pts, p) => { if (p <= 0) return; ctx.save(); ctx.globalAlpha = alpha * clamp(p * 2); ctx.strokeStyle = col; ctx.lineWidth = 2; pts.forEach(([x, y]) => ctx.strokeRect(x - 6, y - 6, 12, 12)); ctx.restore(); };
    let pen = null; const track = (pts, p) => { if (p > 0 && p < 1) pen = A.subPath(pts, 0, p).pop(); };
    const lab = (s2, x, y, tt) => { const p = eo(t, tt, 0.3) * (1 - ei(t, tt + 1.4, 0.3)); if (p > 0 && !o.noLabels) tag(ctx, s2, x, y, { p: p * alpha, color: C.white }); };
    // horizontal: resistance + support
    const pH = eo(t, k.hz, 0.45);
    if (pH > 0) {
      const res = Math.max(...s.slice(10, 22).map((d) => d.h)), sup = Math.min(...s.slice(20, 40).map((d) => d.l));
      const a1 = P(4, res), b1 = P(62, res), a2 = P(4, sup), b2 = P(62, sup);
      line(ctx, ink, [a1, b1], { reveal: pH, width: 2.6, alpha }); line(ctx, ink, [a2, b2], { reveal: eo(t, k.hz + 0.15, 0.45), width: 2.6, alpha });
      handles([a1, b1], pH); lab('أفقية', b1[0] + 10, b1[1] - 34, k.hz); track([a1, b1], pH); track([a2, b2], eo(t, k.hz + 0.15, 0.45));
    }
    // diagonal trend line
    const pD = eo(t, k.dg, 0.4);
    if (pD > 0) { const a = [m.X(28), m.Y(s[28].l) + 8], b = [m.X(63), m.Y(s[63].l) + 8]; const ext = [b[0] + (b[0] - a[0]) * 0.08, b[1] + (b[1] - a[1]) * 0.08]; line(ctx, ink, [a, ext], { reveal: pD, width: 3, alpha }); handles([a, b], pD); track([a, ext], pD); lab('قطرية', b[0] + 20, b[1] + 60, k.dg); }
    // triangle (converging) on the early leg
    const pT = eo(t, k.tr, 0.55);
    if (pT > 0) {
      const hi0 = Math.max(...s.slice(4, 9).map((d) => d.h)), lo0 = Math.min(...s.slice(4, 9).map((d) => d.l)); const mid = (s[22].h + s[22].l) / 2;
      const tri3 = [[m.X(5), m.Y(hi0) - 10], [m.X(24), m.Y(mid)], [m.X(5), m.Y(lo0) + 10]];
      line(ctx, ink, [...tri3, tri3[0]], { reveal: pT, width: 2.6, alpha }); handles(tri3, pT); lab('مثلثات', tri3[1][0] + 150, tri3[0][1] - 30, k.tr);
      track(tri3, pT);
    }
    // rectangle range in the middle consolidation
    const pR = eo(t, k.rc, 0.5);
    if (pR > 0) {
      const sl = s.slice(28, 40); const hi = Math.max(...sl.map((d) => d.h)), lo = Math.min(...sl.map((d) => d.l)); const x0 = m.X(28) - 10, x1 = m.X(40) + 10, y0 = m.Y(hi), y1 = m.Y(lo);
      line(ctx, ink, rectPts(x0, y0, x1 - x0, y1 - y0), { reveal: pR, width: 2.4, alpha });
      hatch(ctx, ink === 'dark' ? 'dark' : 'steel', (c) => { c.beginPath(); c.rect(x0, y0, x1 - x0, y1 - y0); }, { box: [x0, y0, (x1 - x0), y1 - y0], gap: 12, color: C.white, alpha: 0.16 * alpha, progress: pR });
      track(rectPts(x0, y0, x1 - x0, y1 - y0), pR); handles([[x0, y0], [x1, y1]], pR); lab('مستطيلات', x1 + 150, y0 - 20, k.rc);
    }
    // channel on the final leg
    const pC = eo(t, k.ch, 0.6);
    if (pC > 0) {
      const a = [m.X(42), m.Y(s[42].l)], b = [m.X(63), m.Y(s[63].l)]; const off = (m.Y(s[50].l) - m.Y(s[50].h)) * 2.1;
      line(ctx, ink, [[a[0], a[1] + 4], [b[0], b[1] + 4]], { reveal: pC, width: 2.2, dash: [3, 7], alpha });
      line(ctx, ink, [[a[0], a[1] - off], [b[0], b[1] - off]], { reveal: eo(t, k.ch + 0.15, 0.6), width: 2.2, dash: [3, 7], alpha });
      lab('قنوات', b[0] + 20, b[1] - off - 40, k.ch); track([[a[0], a[1] + 4], [b[0], b[1] + 4]], pC);
    }
    // golden spiral from the swing low
    const pS = eo(t, k.sp, 1.2);
    if (pS > 0) {
      const c = [m.X(34), m.Y(Math.min(...s.slice(28, 40).map((d) => d.l)))]; const pts = [];
      for (let i = 0; i <= 220; i++) { const th = i / 220 * Math.PI * 3.5; const r = 6 * Math.exp(0.3063 * th); pts.push([c[0] + Math.cos(th + Math.PI) * r, c[1] + Math.sin(th + Math.PI) * r * 0.9]); }
      ctx.save(); ctx.beginPath(); ctx.rect(m.X(0) - 30, 150, 1500, 760); ctx.clip();
      line(ctx, ink, pts, { reveal: pS, width: 2.2, alpha: 0.9 * alpha }); ctx.restore(); track(pts, pS);
      lab('حلزونية', c[0] + 330, c[1] + 150, k.sp);
    }
    return pen;
  }
  F.drawings = drawings;
  scene({
    name: 'drawings', t0: S11.t0, t1: S11.t1, enter: { type: 'cut' },
    draw(ctx, t) {
      background(ctx, 'steel');
      const rt = eio(t, k11.retract, 0.45);
      if (rt < 1) {
        ctx.save(); ctx.translate(0, 505); ctx.scale(1, 1 - rt); ctx.translate(0, -505);
        const m0 = indicatorChart(ctx, t, { box: [190, 340, 1180, 330], retract: rt });
        subPanels(ctx, t, m0, [190, 700, 1180, 180], rt);
        ctx.restore();
        txt(ctx, 'مؤشرات شائعة', 1770, 250 - rt * 40, { size: 96, w: 'L', color: C.white, alpha: 1 - rt });
        LIST.forEach((it, i) => { const y = 380 + i * 112; ctx.save(); ctx.translate(rt * 500, 0); txt(ctx, it.ar, 1770, y, { size: 32, w: 'R', color: C.white }); ctx.restore(); });
      }
      if (rt > 0.6 && rt < 1) line(ctx, 'steel', [[190, 505], [1370, 505]], { width: 3 });
      // full-width chart with hand drawings: grows out of the flattened line
      const pc = eo(t, k11.retract + 0.45, 0.6);
      let pen = null;
      if (pc > 0) {
        const box = [190, 340, 1580, 520];
        ctx.save(); ctx.translate(0, 600); ctx.scale(1, pc); ctx.translate(0, -600);
        const m = candles(ctx, 'steel', drawSeries, box, { range: F.range(drawSeries, 0.2), alpha: 0.95 });
        pen = drawings(ctx, t, m, drawSeries, 'steel');
        const pa = eo(t, k11.trend, 0.6);
        if (pa > 0) {
          const lo = Math.min(...drawSeries.slice(28, 40).map((d) => d.l)), hi = Math.max(...drawSeries.slice(55, 64).map((d) => d.h));
          const a = [m.X(30), m.Y(lo) + 90], b = [m.X(63) + 30, m.Y(hi) - 30];
          line(ctx, 'steel', [a, b], { reveal: pa, width: 6, color: C.white }); if (pa > 0.9) tri(ctx, b[0] + 6, b[1] - 6, 36, 'u', C.white);
          tag(ctx, 'تفسير الاتجاهات', 1770, 330, { p: pa, color: C.white });
        }
        ctx.restore();
      }
      // pen cursor rides the stroke being drawn
      const pp = sp(t, k11.pen, 14) * (1 - eo(t, k11.trend, 0.4));
      if (pp > 0) {
        const tgt = pen || [1380, 420];
        const x = tgt[0], y = tgt[1];
        ctx.save(); ctx.translate(x, y); ctx.rotate(0.55); ctx.scale(pp, pp);
        ctx.fillStyle = C.white; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-9, -24); ctx.lineTo(9, -24); ctx.closePath(); ctx.fill();
        ctx.fillRect(-9, -90, 18, 62); ctx.fillStyle = C.red; ctx.fillRect(-9, -102, 18, 12); ctx.restore();
      }
      rich(ctx, [{ s: 'الرسم' }, { s: 'اليدوي' }], 1770, 250, { size: 96, w: 'L', color: C.white, p: inv(k11.head - 0.2, we(36, 11), t) });
      hud(ctx, t, 'steel', '09|الرسم اليدوي');
    },
  });

  // =====================================================================
  // S12 — price action, then Japanese candlesticks (line → candles)
  // =====================================================================
  const S12 = { t0: ph(40), t1: w(41, 0) + 0.35 };
  const k12 = { clear: ph(40), pa: w(40, 6), candles: w(40, 9), anat: w(40, 10) };
  sfx(k12.clear, 'whoosh', 0.2, { d: 0.45, up: false }); sfx(k12.pa, 'swipe', 0.14, { d: 0.4 });
  sfx(k12.candles, 'type', 0.22, { d: 1.0, n: 20 }); sfx(k12.anat, 'pop', 0.22, { f: 700 });
  for (let i = 0; i < 4; i++) sfx(k12.anat + 0.25 + i * 0.15, 'tick', 0.15, { f: 2600 + i * 220 });
  const paSeries = series(44, 1212, { start: 100, vol: 1.5, drift: (u) => 0.25 + Math.sin(u * 8) * 0.6 });
  F.paSeries = paSeries;
  function anatomy(ctx, t, ink, x, y, p, tt) {
    if (p <= 0) return; const s = 1; const col = ink === 'dark' ? C.mint : C.white;
    ctx.save(); ctx.globalAlpha = clamp(p * 1.5); ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = col; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, -190); ctx.lineTo(0, -110); ctx.moveTo(0, 110); ctx.lineTo(0, 180); ctx.stroke();
    ctx.strokeRect(-46, -110, 92, 220);
    if (ink === 'dark') { ctx.fillStyle = col; for (let yy = -110; yy < 110; yy += 8) ctx.fillRect(-46, yy, 92, 3.6); }
    const labs = [['الأعلى', -190], ['الإغلاق', -110], ['الافتتاح', 110], ['الأدنى', 180]];
    labs.forEach(([s2, yy], i) => {
      const pi = eo(t, tt + 0.25 + i * 0.15, 0.3); if (pi <= 0) return;
      ctx.save(); ctx.globalAlpha = pi; ctx.strokeStyle = hexA(C.white, 0.7); ctx.lineWidth = 1.5; ctx.setLineDash([4, 5]);
      ctx.beginPath(); ctx.moveTo(-60, yy); ctx.lineTo(-150, yy); ctx.stroke(); ctx.restore();
      txt(ctx, s2, -165, yy + 10, { size: 28, w: 'R', color: C.white, alpha: pi });
    });
    ctx.restore();
  }
  F.anatomy = anatomy;
  scene({
    name: 'price-action', t0: S12.t0, t1: S12.t1, enter: { type: 'cut' },
    draw(ctx, t) {
      background(ctx, 'steel');
      const cl = ei(t, k12.clear, 0.35);
      if (cl < 1) {
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W * (1 - cl), H); ctx.clip();
        const m0 = candles(ctx, 'steel', drawSeries, [190, 340, 1580, 520], { range: F.range(drawSeries, 0.2), alpha: 0.95 });
        drawings(ctx, t, m0, drawSeries, 'steel', { noLabels: true });
        ctx.restore();
        txt(ctx, 'الرسم اليدوي', 1770, 250, { size: 96, w: 'L', color: C.white, alpha: 1 - cl });
      }
      const box = [190, 360, 1180, 480]; const rg = F.range(paSeries, 0.15);
      const vals = paSeries.map((d) => d.c); const m = F.mapSeries(paSeries, box, rg[0], rg[1]);
      const pts = vals.map((v, i) => [m.X(i), m.Y(v)]);
      const pl = eo(t, k12.clear + 0.25, 0.9); const pc = eo(t, k12.candles, 0.9);
      if (pl > 0 && pc < 1) line(ctx, 'steel', pts, { reveal: pl, width: lerp(4, 1, pc), alpha: 1 - pc * 0.6 });
      if (pc > 0) {
        // each candle grows out of its point on the line
        paSeries.forEach((d, i) => {
          const pi = clamp(pc * 1.6 - i / paSeries.length * 0.6); if (pi <= 0) return;
          const x = m.X(i), up = d.c >= d.o, bw = m.dx * 0.56;
          const y = (v) => lerp(m.Y(d.c), m.Y(v), pi);
          ctx.save(); ctx.strokeStyle = C.white; ctx.fillStyle = C.white; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x, y(d.h)); ctx.lineTo(x, y(d.l)); ctx.stroke();
          const top = Math.min(y(d.o), y(d.c)), bot = Math.max(y(d.o), y(d.c), top + 2);
          if (up) { ctx.fillStyle = C.slate; ctx.fillRect(x - bw / 2, top, bw, bot - top); ctx.strokeRect(x - bw / 2, top, bw, bot - top); } else ctx.fillRect(x - bw / 2, top, bw, bot - top);
          ctx.restore();
        });
      }
      const hA = inv(k12.pa - 0.2, we(40, 7), t) * (1 - eo(t, k12.candles - 0.3, 0.3));
      if (hA > 0) { rich(ctx, [{ s: 'حركة' }, { s: 'السعر' }], 1770, 250, { size: 96, w: 'L', color: C.white, p: hA }); A.lat(ctx, 'PRICE ACTION', 1770, 300, { size: 20, w: 600, color: INK.steel.muted, align: 'right', track: 3, alpha: hA }); }
      const hB = inv(k12.candles - 0.2, we(40, 10), t);
      if (hB > 0) rich(ctx, [{ s: 'الشموع' }, { s: 'اليابانية' }], 1770, 250, { size: 96, w: 'L', color: C.white, p: hB });
      anatomy(ctx, t, 'steel', 1640, 600, sp(t, k12.anat, 14), k12.anat);
      hud(ctx, t, 'steel', '10|الشموع اليابانية');
    },
  });

  // =====================================================================
  // S13 — light it up (dark): combine forms of analysis, then the bigger picture
  // =====================================================================
  const S13 = { t0: w(41, 0) + 0.35, t1: ph(43) };
  const k13 = { tilt: w(42, 0), split: w(42, 2), merge: w(42, 4), big: w(42, 8), bigW: w(42, 10) };
  sfx(S13.t0 - 0.5, 'scan', 0.3, { d: 0.5 });
  sfx(k13.tilt, 'whoosh', 0.18, { d: 0.5 }); sfx(k13.split, 'swipe', 0.16, { d: 0.5 }); sfx(k13.merge, 'thump', 0.38);
  sfx(k13.big, 'whoosh', 0.22, { d: 0.8, up: false }); sfx(k13.big + 0.6, 'type', 0.12, { d: 0.9, n: 12 });
  const bigSeries = series(150, 9090, { start: 92, vol: 1.2, drift: (u) => 0.12 + Math.sin(u * 5) * 0.4 });
  scene({
    name: 'combine', t0: S13.t0, t1: S13.t1, enter: { type: 'scanDown', dur: 0.5, line: C.mint },
    draw(ctx, t) {
      background(ctx, 'dark');
      const tilt = eio(t, k13.tilt, 0.6) * (1 - eio(t, k13.big - 0.2, 0.5));
      const sep = eio(t, k13.split - 0.2, 0.5) * (1 - eio(t, k13.merge - 0.1, 0.35));
      const zoom = eio(t, k13.big, 1.1);
      const box = [190, 360, 1180, 480]; const rg = F.range(paSeries, 0.15);
      // zoom-out: the whole stack shrinks into a window of a much bigger chart
      const sc = lerp(1, 0.36, zoom); const cx = lerp(0, 1150, zoom), cy = lerp(0, 205, zoom);
      if (zoom > 0) {
        const bb = [130, 260, 1660, 600]; const n = Math.floor(bigSeries.length * eo(t, k13.big + 0.4, 1.0));
        candles(ctx, 'dark', bigSeries, bb, { count: n, range: F.range(bigSeries, 0.1), alpha: 0.9 * zoom, body: 0.5 });
      }
      const layer = (idx, fn) => {
        ctx.save();
        ctx.translate(cx, cy); ctx.scale(sc, sc);
        // isometric tilt: planes lie back, separated vertically
        const lift = (idx - 1) * 150 * sep;
        ctx.translate(780, 600 - lift); ctx.transform(1, 0, lerp(0, -0.55, tilt), lerp(1, 0.52, tilt), 0, 0); ctx.translate(-780, -600);
        fn(); ctx.restore();
      };
      layer(0, () => { const m = candles(ctx, 'dark', paSeries, box, { range: rg }); });
      layer(1, () => {
        const m = F.mapSeries(paSeries, box, rg[0], rg[1]); const ma = sma(paSeries.map((d) => d.c), 8);
        line(ctx, 'dark', ma.map((v, i) => [m.X(i), m.Y(v)]), { width: 3, color: C.white, alpha: clamp(tilt * 2 + zoom) });
        if (sep > 0.3) { ctx.save(); ctx.strokeStyle = hexA(C.white, 0.35 * sep); ctx.lineWidth = 2; ctx.strokeRect(box[0], box[1], box[2], box[3]); ctx.restore(); }
      });
      layer(2, () => {
        const m = F.mapSeries(paSeries, box, rg[0], rg[1]); const a = [m.X(3), m.Y(paSeries[3].l) + 10], b = [m.X(43), m.Y(paSeries[43].l) + 10];
        line(ctx, 'dark', [a, b], { width: 3, color: C.mint, alpha: clamp(tilt * 2 + zoom) });
        const hi = Math.max(...paSeries.map((d) => d.h)); line(ctx, 'dark', [[m.X(0), m.Y(hi)], [m.X(43), m.Y(hi)]], { width: 2.4, color: C.red, dash: [10, 8], clean: true, alpha: clamp(tilt * 2 + zoom) });
        if (sep > 0.3) { ctx.save(); ctx.strokeStyle = hexA(C.white, 0.35 * sep); ctx.lineWidth = 2; ctx.strokeRect(box[0], box[1], box[2], box[3]); ctx.restore(); }
      });
      // layer labels
      if (sep > 0.05) ['الشموع', 'المؤشرات', 'الرسومات'].forEach((s, i) => txt(ctx, s, 1770, 690 - i * 78 * sep - 0, { size: 34, w: 'R', color: C.white, alpha: sep }));
      // window marker on the big chart
      if (zoom > 0.5) { ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 2.5; ctx.globalAlpha = (zoom - 0.5) * 2; ctx.strokeRect(cx + 190 * sc - 14, cy + 330 * sc, 1180 * sc + 28, 540 * sc); ctx.restore(); }
      const hd = inv(k13.tilt, we(42, 7), t) * (1 - eo(t, k13.big - 0.3, 0.3));
      if (hd > 0) rich(ctx, [{ s: 'الجمع' }, { s: 'بين' }, { s: 'عدة' }, { s: 'أشكال' }], 1770, 250, { size: 96, w: 'L', color: C.white, p: hd });
      const hb = inv(k13.bigW - 0.3, we(42, 11), t);
      if (hb > 0) rich(ctx, [{ s: 'الصورة' }, { s: 'الأكبر' }], 1770, 200, { size: 96, w: 'L', color: C.white, p: hb });
      hud(ctx, t, 'dark', '11|الصورة الأكبر');
    },
  });

  // =====================================================================
  // S14 — the right tool for the right trade; the only way is practice
  // =====================================================================
  const S14 = { t0: ph(43), t1: ph(47) };
  const k14 = { bar: ph(43), choose: w(43, 6), tool: w(44, 2), m1: w(44, 3), m2: w(44, 4), m3: w(44, 5), way: ph(45), prac: w(46, 1) };
  sfx(k14.bar, 'whoosh', 0.18, { d: 0.5 });
  for (let i = 0; i < 6; i++) sfx(k14.bar + 0.3 + i * 0.08, 'tick', 0.14, { f: 2400 + i * 160 });
  sfx(k14.choose, 'click', 0.26); [k14.m1, k14.m2, k14.m3].forEach((x, i) => { sfx(x - 0.05, 'click', 0.24, { pan: -0.3 }); sfx(x + 0.1, 'pen', 0.14, { d: 0.35 }); });
  sfx(k14.way, 'whoosh', 0.2, { d: 0.6, up: false }); sfx(k14.prac - 0.1, 'thump', 0.4); sfx(k14.prac, 'rollup', 0.22, { d: 1.6, n: 30 });
  const TOOLS = [['المتوسط المتحرك', 'MA'], ['القوة النسبية', 'RSI'], ['خطوط أفقية', 'S/R'], ['القنوات', 'CH'], ['الشموع', 'PA']];
  const TRADES = [['اتجاه صاعد', 'D1', 0], ['نطاق عرضي', 'H4', 2], ['ارتداد سريع', 'M15', 1]];
  function toolIcon(ctx, kind, x, y, s, col) {
    ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.beginPath();
    if (kind === 'MA') { for (let i = 0; i <= 20; i++) { const u = i / 20; const yy = Math.sin(u * 5) * s * 0.18 - u * s * 0.2; i ? ctx.lineTo(-s / 2 + u * s, yy) : ctx.moveTo(-s / 2, yy); } }
    if (kind === 'RSI') { ctx.rect(-s / 2, -s / 3, s, s * 0.66); ctx.moveTo(-s / 2, 0); for (let i = 0; i <= 16; i++) ctx.lineTo(-s / 2 + i / 16 * s, Math.sin(i * 0.9) * s * 0.22); }
    if (kind === 'S/R') { ctx.moveTo(-s / 2, -s / 4); ctx.lineTo(s / 2, -s / 4); ctx.moveTo(-s / 2, s / 4); ctx.lineTo(s / 2, s / 4); }
    if (kind === 'CH') { ctx.moveTo(-s / 2, s / 6); ctx.lineTo(s / 2, -s / 3); ctx.moveTo(-s / 2, s / 2.4); ctx.lineTo(s / 2, -s / 12); }
    if (kind === 'PA') { [-0.3, 0, 0.3].forEach((u, i) => { ctx.moveTo(u * s, -s * 0.38); ctx.lineTo(u * s, s * 0.38); ctx.rect(u * s - s * 0.08, -s * 0.18 + i * 4, s * 0.16, s * 0.3); }); }
    ctx.stroke(); ctx.restore();
  }
  scene({
    name: 'right-tool', t0: S14.t0, t1: S14.t1, enter: { type: 'cut' },
    draw(ctx, t) {
      background(ctx, 'dark');
      const out = eio(t, k14.way, 0.5);
      // carried over: shrinking big picture
      const prev = 1 - eo(t, S14.t0, 0.4);
      if (prev > 0) txt(ctx, 'الصورة الأكبر', 1770, 200, { size: 96, w: 'L', color: C.white, alpha: prev });
      const hd = inv(k14.choose - 0.6, we(44, 5), t) * (1 - out);
      if (hd > 0) rich(ctx, [{ s: 'الأداة' }, { s: 'المناسبة' }, { s: 'للصفقة' }, { s: 'المناسبة' }], 1770, 250, { size: 84, w: 'L', color: C.white, p: hd });
      // tool column (dark glass cards) on the right, trades on the left
      const cards = [];
      TOOLS.forEach((tl, i) => {
        const p = sp(t, k14.bar + 0.3 + i * 0.08, 16) * (1 - out); if (p <= 0) return;
        const x = 1200, y = 340 + i * 104, wd = 570, hh = 84;
        ctx.save(); ctx.globalAlpha = clamp(p * 1.4); ctx.translate((1 - p) * 120, 0);
        roundRect(ctx, x, y, wd, hh, 18); ctx.fillStyle = 'rgba(20,22,26,.72)'; ctx.fill(); ctx.strokeStyle = hexA(C.white, 0.25); ctx.lineWidth = 1.5; ctx.stroke();
        toolIcon(ctx, tl[1], x + 60, y + hh / 2, 48, C.white);
        txt(ctx, tl[0], x + wd - 30, y + 54, { size: 32, w: 'R', color: C.white });
        A.lat(ctx, tl[1], x + 110, y + 52, { size: 18, w: 600, color: INK.dark.muted, track: 2 });
        ctx.restore(); cards.push([x, y + hh / 2]);
      });
      TRADES.forEach((tr, i) => {
        const p = sp(t, k14.choose + i * 0.1, 16) * (1 - out); if (p <= 0) return;
        const x = 190, y = 380 + i * 150, wd = 520, hh = 110;
        ctx.save(); ctx.globalAlpha = clamp(p * 1.4); ctx.translate(-(1 - p) * 120, 0);
        roundRect(ctx, x, y, wd, hh, 18); ctx.fillStyle = 'rgba(20,22,26,.72)'; ctx.fill(); ctx.strokeStyle = hexA(C.white, 0.25); ctx.lineWidth = 1.5; ctx.stroke();
        txt(ctx, 'صفقة', x + wd - 30, y + 42, { size: 22, w: 'R', color: INK.dark.muted });
        txt(ctx, tr[0], x + wd - 30, y + 84, { size: 36, w: 'R', color: C.white });
        A.lat(ctx, tr[1], x + 30, y + 72, { size: 26, w: 600, color: C.mint, track: 1 });
        ctx.restore();
      });
      // matches
      [k14.m1, k14.m2, k14.m3].forEach((tm, i) => {
        const p = eo(t, tm, 0.4) * (1 - out); if (p <= 0) return;
        const tr = TRADES[i]; const from = [710, 380 + i * 150 + 55]; const to = [1200, 340 + tr[2] * 104 + 42];
        const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
        const pts = []; for (let j = 0; j <= 30; j++) { const u = j / 30; pts.push([lerp(from[0], to[0], u), lerp(from[1], to[1], u) + Math.sin(u * Math.PI) * -30]); }
        line(ctx, 'dark', pts, { reveal: p, width: 3, color: C.mint });
        if (p > 0.9) { ctx.beginPath(); ctx.arc(to[0], to[1], 7, 0, 7); ctx.fillStyle = C.mint; ctx.fill(); ctx.beginPath(); ctx.arc(from[0], from[1], 7, 0, 7); ctx.fill(); }
      });
      // practice ring
      const pr = eo(t, k14.way + 0.2, 0.6);
      if (pr > 0) {
        const cx = 960, cy = 560, R = 340; const fill = eo(t, k14.prac - 0.2, 1.8);
        for (let i = 0; i < 60; i++) {
          const a = -Math.PI / 2 + i / 60 * Math.PI * 2; const on = i / 60 < fill; const r0 = R - (i % 5 === 0 ? 34 : 20) * pr;
          ctx.save(); ctx.strokeStyle = on ? C.mint : hexA(C.white, 0.25); ctx.lineWidth = on ? 4 : 2; ctx.globalAlpha = pr;
          ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke(); ctx.restore();
        }
        const n = Math.round(fill * 100);
        A.lat(ctx, String(n).padStart(3, '0'), cx, cy - 110, { size: 34, w: 600, color: INK.dark.sub, align: 'center', track: 3, alpha: pr });
        const pw = inv(k14.prac - 0.25, we(46, 1), t);
        if (pw > 0) wipeText(ctx, 'الممارسة', cx, cy + 50, { size: 120, w: 'L', color: C.white, align: 'center' }, pw);
        wipeText(ctx, 'الطريقة الوحيدة', cx, cy + 150, { size: 36, w: 'R', color: INK.dark.sub, align: 'center' }, inv(k14.way, we(45, 3), t));
      }
      hud(ctx, t, 'dark', '12|الممارسة');
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
