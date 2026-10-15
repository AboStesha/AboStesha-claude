// Gold 04 · part 2 — the sessions dial (24 h, Baghdad time, overlap 4 h → 5 h), the on-screen table, the US news toasts
// with twin clocks, execution (slippage · spread · gap — the odometer that jumps), the summary orbit network.
(function (G) {
  const A = G.AX, F = G.FILM, Q = G.SAAS;
  const { W, H, clamp, lerp, hexA, txt, lat, measure } = A;
  const { P, E, EI, EIO, sp, xo, outP, wheels, wheelSeq, panel, cap, dialArc, hAng, toggle } = Q;
  const w = F.w, sfx = F.sfx;
  const PL = G.G4.PL;

  // ================================================================ E · the sessions dial
  const TE = { in: w(47, 0) - 0.35, s0: w(47, 0), common: w(47, 2), offic: w(47, 4), approx: w(48, 1), asia: w(49, 0), tokyo: w(50, 3), three: w(51, 1), twelve: w(51, 3),
    year: w(51, 7), lon: w(52, 0), ny: w(52, 1), eight: w(53, 3), five: w(53, 5), city: w(53, 8), ovl: w(54, 0), four: w(54, 1), from3: w(55, 1), summer: w(55, 7),
    w4: w(56, 1), winter: w(57, 3), mis: w(58, 0), differ: w(58, 2), longer: w(59, 1), table: w(60, 0), tbl: w(60, 5), guide: w(61, 1) };
  const DC = { x: 960, y: 560 }, RT = [262, 300, 338], RL = 398;
  // London / NY offsets (hours) on the dial: summer 0 → winter +1 → mismatch week (NY back to summer)
  const lonOff = (t) => EIO(t, TE.w4 - 0.1, 0.7);
  const nyOff = (t) => EIO(t, TE.w4 - 0.1, 0.7) - EIO(t, TE.differ, 0.7);
  const glonE = (t) => { let l = lerp(80, 139.7, EIO(t, TE.asia - 0.3, 0.9)); l = lerp(l, -36, EIO(t, TE.lon - 0.35, 1.0)); return l + (t - 100) * 0.6; };
  sfx(TE.in, 'whoosh', 0.14, { d: 0.5 }); sfx(TE.in + 0.2, 'charge', 0.08, { d: 0.6 }); sfx(TE.common, 'pop', 0.14, { f: 700 }); sfx(TE.approx, 'pop', 0.12, { f: 820 });
  sfx(TE.asia - 0.3, 'whoosh', 0.12, { d: 0.8 }); sfx(TE.tokyo, 'bloop', 0.15); sfx(TE.three, 'stretch', 0.1); sfx(TE.year, 'pop', 0.14, { f: 900 });
  sfx(TE.lon - 0.35, 'whoosh', 0.14, { d: 0.9 }); sfx(TE.lon + 0.1, 'bloop', 0.14, { pan: 0.2 }); sfx(TE.ny + 0.1, 'bloop', 0.14, { pan: -0.3 }); sfx(TE.eight, 'stretch', 0.1); sfx(TE.eight + 0.25, 'stretch', 0.08);
  sfx(TE.ovl, 'chime', 0.13); sfx(TE.four - 0.05, 'type', 0.1, { d: 0.3, n: 4 }); sfx(TE.from3, 'type', 0.1, { d: 0.5, n: 6 }); sfx(TE.summer, 'click', 0.16);
  sfx(TE.w4 - 0.1, 'click', 0.18); sfx(TE.w4, 'spin', 0.1); sfx(TE.w4 + 0.05, 'type', 0.1, { d: 0.6, n: 8 });
  sfx(TE.mis, 'tick', 0.12, { f: 2400 }); sfx(TE.differ, 'spin', 0.1); sfx(TE.longer - 0.04, 'type', 0.11, { d: 0.35, n: 4 }); sfx(TE.longer + 0.25, 'pop', 0.16, { f: 980 });

  function sessCard(ctx, x, y, name, sub, val, t, t0, o = {}) { // legend card (right column), RTL
    const k = sp(t, t0, 14, 0.66); if (k <= 0) return; const wv = 400, hv = 104;
    ctx.save(); ctx.globalAlpha *= clamp(k * 2) * (o.alpha == null ? 1 : o.alpha); ctx.translate((1 - Math.min(1, k)) * 80, 0);
    panel(ctx, x - wv, y, wv, hv, { r: 18, fill: 'rgba(22,23,27,0.94)', stroke: o.hot ? hexA(o.col, 0.9) : 'rgba(255,255,255,0.10)' });
    ctx.fillStyle = o.col; A.roundRect(ctx, x - 20, y + 22, 6, hv - 44, 3); ctx.fill();
    txt(ctx, name, x - 40, y + 44, { size: 30, w: 'S', color: P.white }); if (sub) txt(ctx, sub, x - 40, y + 82, { size: 20, w: 'R', color: P.dim });
    if (val) val(ctx, x - wv + 24, y + 74);
    if (o.badge > 0) { ctx.save(); ctx.globalAlpha *= clamp(o.badge * 2); const s = o.badgeS; const ww = measure(ctx, s, 18, 'S') + 26; A.roundRect(ctx, x - wv + 20, y + 10, ww, 28, 14); ctx.strokeStyle = P.gold; ctx.lineWidth = 1.5; ctx.stroke(); txt(ctx, s, x - wv + 20 + ww / 2, y + 30, { size: 18, w: 'S', color: P.gold, align: 'center' }); ctx.restore(); }
    ctx.restore();
  }
  const range = (a, b) => `${String(((a % 24) + 24) % 24).padStart(2, '0')}:00–${String(((b % 24) + 24) % 24).padStart(2, '0')}:00`;

  Q.scn({ t0: TE.in, t1: TE.tbl + 0.8, draw(ctx, t) {
    const out = EIO(t, TE.table - 0.1, 0.8); const sc = lerp(1, 0.4, out); const al = 1 - out;
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha = al; ctx.translate(DC.x, DC.y); ctx.scale(sc, sc); ctx.translate(-DC.x, -DC.y); ctx.translate(-700 * out, -260 * out);
    const k = EIO(t, TE.in, 0.8);
    // globe inside the dial
    const lon0 = glonE(t); Q.globe(ctx, DC.x, DC.y, 222 * lerp(0.6, 1, k), lon0, 20, { alpha: k });
    const pr = (pl) => Q.proj(pl[0], pl[1], lon0, 20, DC.x, DC.y, 222);
    const [tx, ty, tz] = pr(PL.tok); if (tz > 0.1) Q.ping(ctx, tx, ty, t, TE.tokyo, P.red, { R: 26 });
    const [lx, ly, lz] = pr(PL.lon); if (lz > 0.1) Q.ping(ctx, lx, ly, t, TE.lon + 0.1, P.red, { R: 26 });
    const [nx, ny, nz] = pr(PL.ny); if (nz > 0.1) Q.ping(ctx, nx, ny, t, TE.ny + 0.1, P.red, { R: 26 });
    const [bx, by, bz] = pr(PL.bag); if (bz > 0.1) Q.ping(ctx, bx, by, t, TE.in + 0.4, P.gold, { R: 20, r: 5 });
    // dial: track rings, ticks, hour labels (sweep in clockwise)
    const sw = EIO(t, TE.in + 0.1, 0.9);
    ctx.save(); for (const r of RT) { ctx.beginPath(); ctx.arc(DC.x, DC.y, r, hAng(0), hAng(24 * sw)); ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 26; ctx.stroke(); }
    for (let h = 0; h < 24 * sw; h++) { const a = hAng(h), r0 = 362, r1 = h % 3 === 0 ? 378 : 370; ctx.beginPath(); ctx.moveTo(DC.x + Math.cos(a) * r0, DC.y + Math.sin(a) * r0); ctx.lineTo(DC.x + Math.cos(a) * r1, DC.y + Math.sin(a) * r1); ctx.strokeStyle = h % 3 === 0 ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)'; ctx.lineWidth = 2; ctx.stroke();
      if (h % 3 === 0) lat(ctx, String(h).padStart(2, '0'), DC.x + Math.cos(a) * RL, DC.y + Math.sin(a) * RL + 8, { size: 22, w: 600, color: P.dim, align: 'center' }); }
    ctx.restore();
    // session arcs: Asia (inner), London (middle), New York (outer)
    dialArc(ctx, DC.x, DC.y, RT[0], 3, 12, hexA('#E9D29A', 0.95), 22, EIO(t, TE.three, TE.twelve - TE.three + 0.3), { glow: true });
    const lo = lonOff(t), no = nyOff(t);
    dialArc(ctx, DC.x, DC.y, RT[1], 10 + lo, 19 + lo, hexA('#C4C8CC', 0.95), 22, EIO(t, TE.eight - 0.1, 0.9), { glow: true });
    dialArc(ctx, DC.x, DC.y, RT[2], 15 + no, 24 + no, hexA('#8FA6AE', 0.95), 22, EIO(t, TE.eight + 0.2, 0.9), { glow: true });
    // overlap sector (over the arcs): gold tint + outline
    const wv = sp(t, TE.ovl, 12, 0.7);
    if (wv > 0) {
      const a0 = 15 + nyOff(t), a1 = 19 + lonOff(t), R1 = 236, R2 = 236 + 128 * Math.min(1, wv);
      ctx.save(); ctx.beginPath(); ctx.arc(DC.x, DC.y, R2, hAng(a0), hAng(a1)); ctx.arc(DC.x, DC.y, R1, hAng(a1), hAng(a0), true); ctx.closePath();
      ctx.fillStyle = hexA(P.gold, 0.26 * clamp(wv)); ctx.fill(); ctx.shadowColor = hexA(P.gold, 0.8); ctx.shadowBlur = 18; ctx.strokeStyle = P.gold; ctx.lineWidth = 3.5; ctx.stroke(); ctx.restore();
    }
    ctx.restore();
    // right column: session cards (RTL), left column: the overlap counter + the season switch
    ctx.save(); ctx.globalAlpha = al; ctx.translate(-260 * out, 0);
    cap(ctx, 'بتوقيت بغداد  ·  GMT+3', 960, 100, { size: 22, color: P.dim, alpha: k });
    const ck = sp(t, TE.common, 14, 0.7);
    if (ck > 0) { ctx.save(); ctx.globalAlpha *= clamp(ck * 2); const s = 'تقسيم شائع، غير رسمي'; const s2 = ' · أوقات تقريبية'; const a2 = clamp((t - TE.approx) / 0.25); const ww = measure(ctx, s, 24, 'S') + (a2 > 0 ? measure(ctx, s2, 24, 'S') * a2 : 0) + 44; A.roundRect(ctx, 1840 - ww, 168, ww, 50, 25); ctx.fillStyle = 'rgba(22,23,27,0.94)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 1.5; ctx.stroke(); txt(ctx, s, 1818, 202, { size: 24, w: 'S', color: P.white }); if (a2 > 0) txt(ctx, s2, 1818 - measure(ctx, s, 24, 'S'), 202, { size: 24, w: 'S', color: P.gold, alpha: a2 }); ctx.restore(); }
    const hot = (a, b) => t >= a && t < b;
    sessCard(ctx, 1840, 262, 'الآسيوية', 'دوام طوكيو', (c, x, y) => { if (t > TE.three - 0.1) wheels(c, '00:00–00:00', '03:00–12:00', t, TE.three - 0.1, x, y + 4, 28, { align: 'left', color: '#E9D29A', w: 700, stagger: 0.05 }); }, t, TE.asia, { col: '#E9D29A', hot: hot(TE.asia, TE.lon), badge: clamp((t - TE.year) / 0.2), badgeS: 'طوال السنة' });
    sessCard(ctx, 1840, 390, 'لندن', '8 ص – 5 م بالتوقيت المحلي', (c, x, y) => { if (t > TE.eight - 0.1) wheelSeq(c, [[0, '00:00–00:00'], [TE.eight - 0.1, '10:00–19:00'], [TE.w4 - 0.1, '11:00–20:00']], t, x, y + 4, 28, { align: 'left', color: '#C4C8CC', w: 700, stagger: 0.05 }); }, t, TE.lon, { col: '#C4C8CC', hot: hot(TE.lon, TE.ovl) });
    sessCard(ctx, 1840, 518, 'نيويورك', '8 ص – 5 م بالتوقيت المحلي', (c, x, y) => { if (t > TE.eight + 0.2) wheelSeq(c, [[0, '00:00–00:00'], [TE.eight + 0.2, '15:00–00:00'], [TE.w4, '16:00–01:00'], [TE.differ, '15:00–00:00']], t, x, y + 4, 28, { align: 'left', color: '#8FA6AE', w: 700, stagger: 0.05, dir: t > TE.differ ? -1 : 1 }); }, t, TE.ny, { col: '#8FA6AE', hot: hot(TE.ny, TE.ovl) });
    // overlap counter (left column)
    if (wv > 0) {
      ctx.save(); ctx.globalAlpha *= clamp(wv * 2);
      txt(ctx, 'التداخل: لندن + نيويورك', 520, 300, { size: 26, w: 'S', color: P.dim });
      const fk = sp(t, TE.four, 13, 0.7); if (fk > 0) { ctx.save(); ctx.globalAlpha *= clamp(fk * 2); wheels(ctx, '4', '5', t, TE.longer - 0.08, 470, 430, 130, { d: 0.45 }); txt(ctx, 'ساعات', 400, 424, { size: 54, w: 'S', color: P.white }); ctx.restore(); }
      const rk = clamp((t - TE.from3) / 0.25);
      if (rk > 0) { ctx.save(); ctx.globalAlpha *= rk; wheelSeq(ctx, [[0, '15:00–19:00'], [TE.w4, '16:00–20:00'], [TE.differ, '15:00–20:00']], t, 520, 500, 38, { align: 'right', color: P.gold, w: 700, stagger: 0.05, dir: t > TE.differ ? -1 : 1 }); ctx.restore(); }
      const tk = clamp((t - TE.summer + 0.1) / 0.3);
      if (tk > 0) { ctx.save(); ctx.globalAlpha *= tk; toggle(ctx, 300, 600, EIO(t, TE.w4 - 0.1, 0.4) * (1 - 0.5 * EIO(t, TE.mis, 0.4)), 'الصيفي', 'الشتوي', { w: 110, h: 50, size: 26 }); ctx.restore(); }
      const mk = sp(t, TE.mis, 14, 0.7);
      if (mk > 0) { ctx.save(); ctx.globalAlpha *= clamp(mk * 2); const s = 'أسابيع اختلاف التوقيت'; const ww = measure(ctx, s, 22, 'S') + 40; A.roundRect(ctx, 520 - ww, 660, ww, 46, 23); ctx.fillStyle = hexA(P.gold, 0.16); ctx.fill(); ctx.strokeStyle = P.gold; ctx.lineWidth = 1.5; ctx.stroke(); txt(ctx, s, 500, 691, { size: 22, w: 'S', color: P.gold }); ctx.restore(); }
      ctx.restore();
    }
    ctx.restore();
  } });

  // ================================================================ E2 · the table (sessions + news, Baghdad time) → F · the news
  const TF = { in: w(62, 0), cpi: w(62, 5), jobs: w(62, 8), et: w(63, 2), bag: w(64, 1), us: w(65, 0), fomc: w(66, 0), two: w(67, 2), nine: w(68, 1), late: w(69, 1), winter: w(70, 3), out: F.phe(70) + 0.25 };
  const ROWS = [['الجلسة الآسيوية', '03:00–12:00', '03:00–12:00'], ['لندن', '10:00–19:00', '11:00–20:00'], ['نيويورك', '15:00–00:00', '16:00–01:00'], ['التداخل (لندن + نيويورك)', '15:00–19:00', '16:00–20:00'],
    ['مؤشر الأسعار · الوظائف', '15:30', '16:30'], ['قرار الفدرالي', '21:00', '22:00']];
  const TBW = 1180, TBH = 640;
  sfx(TE.table + 0.15, 'whoosh', 0.14, { d: 0.45 }); ROWS.forEach((_, i) => sfx(TE.table + 0.5 + i * 0.22, 'tick', 0.08, { f: 1800 + i * 150 })); sfx(TE.guide, 'pop', 0.12, { f: 760 });
  sfx(TF.in - 0.1, 'whoosh', 0.12, { d: 0.5 }); sfx(TF.cpi, 'pop', 0.18, { f: 640, pan: 0.5 }); sfx(TF.jobs, 'pop', 0.18, { f: 720, pan: 0.5 });
  sfx(TF.et - 0.05, 'type', 0.1, { d: 0.45, n: 6 }); sfx(TF.bag - 0.05, 'type', 0.1, { d: 0.45, n: 6 }); sfx(TF.us, 'tick', 0.1, { f: 2600 });
  sfx(TF.fomc, 'pop', 0.18, { f: 800, pan: 0.5 }); sfx(TF.two - 0.05, 'type', 0.1, { d: 0.4, n: 5 }); sfx(TF.nine - 0.05, 'type', 0.1, { d: 0.4, n: 5 });
  sfx(TF.late - 0.05, 'click', 0.16); sfx(TF.late, 'type', 0.12, { d: 0.7, n: 10 }); sfx(TF.out - 0.1, 'whoosh', 0.14, { d: 0.5 });
  function table(ctx, t, x, y, s) { // x,y = top-right corner, scale s; highlights by time
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    panel(ctx, -TBW, 0, TBW, TBH, { r: 24, fill: 'rgba(19,20,24,0.97)' });
    txt(ctx, 'أوقات الذهب', -40, 62, { size: 36, w: 'S', color: P.white }); txt(ctx, 'بتوقيت بغداد', -40 - measure(ctx, 'أوقات الذهب ', 36, 'S'), 62, { size: 36, w: 'S', color: P.gold });
    const C1 = -TBW + 700, C2 = -TBW + 340; // column right edges: summer, winter
    const win = clamp((t - TF.late) / 0.3);
    [[C1, 'الصيفي', 1 - win], [C2, 'الشتوي', win]].forEach(([cx, s2, hi]) => { if (hi > 0) { ctx.save(); ctx.globalAlpha *= hi; A.roundRect(ctx, cx - 320, 92, 320, TBH - 150, 16); ctx.fillStyle = hexA(P.gold, 0.07); ctx.fill(); ctx.restore(); } txt(ctx, s2, cx - 160, 124, { size: 24, w: 'S', color: hi > 0.5 ? P.gold : P.dim, align: 'center' }); });
    txt(ctx, 'أمريكا وبريطانيا', -40, 124, { size: 20, w: 'R', color: P.faint });
    ROWS.forEach(([lab, a, b], i) => {
      const ry = 150 + i * 66; const k = clamp((t - TE.table - 0.5 - i * 0.22) / 0.3); if (k <= 0) return;
      ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 14);
      const hl = (i === 4 && t >= TF.cpi && t < TF.fomc) || (i === 5 && t >= TF.fomc && t < TF.out) || (i === 3 && t >= TE.tbl && t < TF.in);
      if (hl) { A.roundRect(ctx, -TBW + 18, ry - 4, TBW - 36, 62, 12); ctx.strokeStyle = hexA(P.gold, 0.85); ctx.lineWidth = 2; ctx.stroke(); }
      ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(-TBW + 30, ry + 61, TBW - 60, 1);
      txt(ctx, lab, -40, ry + 40, { size: 28, w: 'S', color: P.white });
      lat(ctx, a, C1 - 160, ry + 42, { size: 30, w: 600, color: win < 0.5 ? P.white : P.dim, align: 'center' }); lat(ctx, b, C2 - 160, ry + 42, { size: 30, w: 600, color: win >= 0.5 ? P.white : P.dim, align: 'center' });
      ctx.restore();
    });
    const fk = clamp((t - TE.guide) / 0.3);
    if (fk > 0) txt(ctx, 'في أسابيع اختلاف التوقيت يصبح التداخل 5 ساعات · الأوقات تقريبية · التفاصيل في الدليل المكتوب', -40, TBH - 26, { size: 20, w: 'R', color: P.dim, alpha: fk });
    ctx.restore();
  }
  function clockCard(ctx, x, y, label, seq, t, t0, o = {}) { // x = right edge
    const k = sp(t, t0, 14, 0.66); if (k <= 0) return; const wv = 360, hv = 150;
    ctx.save(); ctx.globalAlpha *= clamp(k * 2); ctx.translate(0, (1 - Math.min(1, k)) * 30);
    panel(ctx, x - wv, y, wv, hv, { r: 20, fill: 'rgba(22,23,27,0.95)', stroke: o.hot ? hexA(P.gold, 0.8) : 'rgba(255,255,255,0.10)' });
    txt(ctx, label, x - 28, y + 44, { size: 24, w: 'S', color: P.dim });
    wheelSeq(ctx, seq, t, x - wv / 2, y + 118, 64, { color: o.col || P.white, w: 600, stagger: 0.05 });
    ctx.restore();
  }
  Q.scn({ t0: TE.table + 0.2, t1: TF.out + 0.7, draw(ctx, t) {
    const k = E(t, TE.table + 0.2, 0.6); const mv = EIO(t, TF.in - 0.2, 0.8); const ex = EIO(t, TF.out - 0.2, 0.6);
    const s = lerp(1, 0.8, mv), x = lerp(960 + TBW / 2, 80 + TBW * 0.8, mv), y = lerp(200, 170, mv) + (1 - k) * 120;
    ctx.save(); ctx.globalAlpha = clamp(k * 1.5) * (1 - ex); ctx.translate(-300 * ex, 0); table(ctx, t, x, y, s); ctx.restore();
    if (t < TF.in - 0.3 || ex >= 1) return;
    ctx.save(); ctx.globalAlpha = 1 - ex; ctx.translate(300 * ex, 0);
    cap(ctx, 'بيانات أمريكية مهمة', 1650, 214, { size: 24, color: P.dim, alpha: clamp((t - TF.in) / 0.3) });
    clockCard(ctx, 1840, 250, 'نيويورك', [[0, '00:00'], [TF.et - 0.1, '08:30'], [TF.two - 0.1, '14:00']], t, TF.et - 0.3);
    clockCard(ctx, 1460, 250, 'بغداد', [[0, '00:00'], [TF.bag - 0.1, '15:30'], [TF.nine - 0.1, '21:00'], [TF.late, '22:00']], t, TF.bag - 0.3, { col: P.gold, hot: true });
    const tg = clamp((t - TF.us) / 0.25);
    if (tg > 0) { ctx.save(); ctx.globalAlpha *= tg; const s1 = t < TF.late ? 'صيف أمريكا' : 'شتاء أمريكا'; const ww = measure(ctx, s1, 20, 'S') + 32; A.roundRect(ctx, 1460 - 360 + 18, 262, ww, 34, 17); ctx.strokeStyle = t < TF.late ? P.gold : '#C4C8CC'; ctx.lineWidth = 1.5; ctx.stroke(); txt(ctx, s1, 1460 - 360 + 18 + ww / 2, 286, { size: 20, w: 'S', color: t < TF.late ? P.gold : '#C4C8CC', align: 'center' }); ctx.restore(); }
    // toasts (newest at the bottom, like a feed)
    const tf = (seq) => (c, x0, y0) => wheelSeq(c, seq, t, x0, y0, 30, { align: 'left', color: P.gold, w: 700, stagger: 0.05 });
    Q.toast(ctx, 1840, 470, 740, 'مؤشر أسعار المستهلك', '08:30 بتوقيت نيويورك · شهري', t, TF.cpi, { time: ' ', timeFn: tf([[0, '15:30'], [TF.late, '16:30']]) });
    Q.toast(ctx, 1840, 578, 740, 'تقرير الوظائف', '08:30 بتوقيت نيويورك · شهري', t, TF.jobs, { time: ' ', timeFn: tf([[0, '15:30'], [TF.late + 0.08, '16:30']]) });
    Q.toast(ctx, 1840, 686, 740, 'قرار الفدرالي', 'لجنة السوق المفتوحة · 14:00 بنيويورك', t, TF.fomc, { time: ' ', timeFn: tf([[0, '21:00'], [TF.late + 0.16, '22:00']]), dot: P.coral });
    const lk = sp(t, TF.late, 14, 0.7);
    if (lk > 0) { ctx.save(); ctx.globalAlpha *= clamp(lk * 2); const s1 = 'كلها تتأخر ساعة في التوقيت الشتوي'; txt(ctx, s1, 1840, 840, { size: 28, w: 'S', color: P.white }); lat(ctx, '+1h', 1840 - measure(ctx, s1, 28, 'S') - 16, 840, { size: 28, w: 800, color: P.gold, align: 'right' }); ctx.restore(); }
    ctx.restore();
  } });

  // ================================================================ G · execution: slippage, spread, gap
  const TG = { in: w(71, 0) - 0.2, fast: w(71, 3), thin: w(71, 5), price: w(72, 0), see: w(72, 2), exec: w(72, 7), slip: w(73, 1), vol: w(74, 2), spread: w(75, 1), widen: w(75, 2),
    gap: w(76, 2), jump: w(77, 2), without: w(77, 6), between: w(77, 10), news: w(79, 3), after: w(80, 1), hol: w(80, 4), wkend: w(81, 0), out: F.phe(81) + 0.12 };
  const PCW = 1400, PCH = 660;
  const pathAt = (() => { const r = A.rng(4242); const n = 400, v = []; let x = 0, m = 0; for (let i = 0; i < n; i++) { m = m * 0.86 + (r() - 0.5) * 0.9; x += m; v.push(x); } return (u) => { const f = clamp(u) * (n - 1), i = Math.floor(f), fr = f - i; return v[i] + (v[Math.min(n - 1, i + 1)] - v[i]) * fr; }; })();
  sfx(TG.in, 'whoosh', 0.16, { d: 0.55 }); sfx(TG.in + 0.7, 'impact', 0.1); sfx(TG.fast, 'pop', 0.12, { f: 700 }); sfx(TG.thin, 'pop', 0.12, { f: 620 });
  sfx(TG.see, 'tick', 0.12, { f: 2600 }); sfx(TG.exec, 'tick', 0.12, { f: 2100 }); sfx(TG.slip - 0.05, 'stretch', 0.12); sfx(TG.slip, 'click', 0.18);
  sfx(TG.vol, 'scribble', 0.08, { d: 0.6 }); sfx(TG.spread, 'click', 0.18); sfx(TG.widen, 'stretch', 0.14); sfx(TG.widen + 0.05, 'type', 0.09, { d: 0.4, n: 5 });
  sfx(TG.gap, 'click', 0.18); sfx(TG.gap + 0.1, 'glitch', 0.16); sfx(TG.jump, 'slam', 0.18); sfx(TG.without, 'scribble', 0.08, { d: 0.4 });
  sfx(TG.news, 'pop', 0.16, { f: 700, pan: 0.5 }); sfx(TG.hol, 'pop', 0.16, { f: 780, pan: 0.5 }); sfx(TG.wkend, 'pop', 0.16, { f: 860, pan: 0.5 }); sfx(TG.out, 'whoosh', 0.14, { d: 0.5, up: false });
  function execFace(c, t) {
    c.fillStyle = '#121316'; c.fillRect(0, 0, PCW, PCH); c.strokeStyle = 'rgba(255,255,255,0.10)'; c.lineWidth = 2; c.strokeRect(1, 1, PCW - 2, PCH - 2);
    const tab = t < TG.spread ? 0 : t < TG.gap ? 1 : 2; const acc = [P.gold, '#C4C8CC', '#E8EAEC'][tab];
    // header: XAU/USD + live dot; tabs (RTL)
    lat(c, 'XAU/USD', 44, 62, { size: 28, w: 700, color: P.white }); c.fillStyle = P.red; c.beginPath(); c.arc(196, 52, 6, 0, 6.283); c.fill();
    txt(c, 'مثال توضيحي', 44 + 300, 62, { size: 20, w: 'R', color: P.faint, align: 'left' });
    const tabs = ['انزلاق سعري', 'فارق السعر', 'فجوة سعرية']; let tx = PCW - 40; const pos = [];
    for (const s of tabs) { const ww = measure(c, s, 24, 'S') + 44; pos.push([tx - ww, ww]); tx -= ww + 12; }
    const tt = [TG.slip, TG.spread, TG.gap]; const on = t >= TG.slip - 0.05;
    if (on) { const m = tab === 0 ? 1 : EIO(t, tt[tab], 0.35); const from = Math.max(0, tab - 1); const hx = lerp(pos[from][0], pos[tab][0], m), hw = lerp(pos[from][1], pos[tab][1], m); A.roundRect(c, hx, 34, hw, 48, 24); c.fillStyle = hexA(acc, 0.2); c.fill(); c.strokeStyle = acc; c.lineWidth = 1.5; c.stroke(); }
    tabs.forEach((s, i) => txt(c, s, pos[i][0] + pos[i][1] / 2, 66, { size: 24, w: 'S', color: on && i === tab ? P.white : P.faint, align: 'center' }));
    // chart box
    const X0 = 60, X1 = PCW - 300, YT = 140, YB = PCH - 60;
    for (let i = 0; i <= 4; i++) { c.fillStyle = 'rgba(255,255,255,0.05)'; c.fillRect(X0, YT + i * (YB - YT) / 4, X1 - X0, 1); }
    const vol = 1 + 1.6 * EIO(t, TG.vol - 0.2, 0.8);
    const nowAt = (tt) => 0.55 + 0.4 * clamp((tt - TG.in) / (TG.out - TG.in)); const now = nowAt(t); const span = 0.42;
    const gapK = t >= TG.jump ? 1 : 0; const gapAt = nowAt(TG.jump) - 0.007; const gapH = 0.55;
    const val = (u) => { const base = pathAt(u) * 0.022 * vol; return base + (u >= gapAt ? gapK * gapH : 0); };
    const ymid = (YT + YB) / 2 + 40; const toY = (v) => ymid - v * 160;
    const N = 160, pts = []; for (let i = 0; i <= N; i++) { const uu = (i / N); const u = now - span + span * uu; const x = lerp(X0, X1, uu); const g = gapK && u >= gapAt - 0.0015 && u < gapAt + 0.0025; if (!g) pts.push([x, toY(val(u) - val(now - span)), u]); else pts.push(null); }
    const seg = []; let cur = []; for (const p of pts) { if (p) cur.push(p); else if (cur.length) { seg.push(cur); cur = []; } } if (cur.length) seg.push(cur);
    for (const sgm of seg) { c.save(); c.beginPath(); sgm.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.lineTo(sgm[sgm.length - 1][0], YB); c.lineTo(sgm[0][0], YB); c.closePath(); const g = c.createLinearGradient(0, YT, 0, YB); g.addColorStop(0, hexA(acc, 0.32)); g.addColorStop(1, hexA(acc, 0)); c.fillStyle = g; c.fill(); c.beginPath(); sgm.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.strokeStyle = acc; c.lineWidth = 3; c.lineJoin = 'round'; c.stroke(); c.restore(); }
    const last = seg[seg.length - 1][seg[seg.length - 1].length - 1]; c.fillStyle = '#FFFFFF'; c.beginPath(); c.arc(last[0], last[1], 6, 0, 6.283); c.fill();
    // spread band (bid/ask)
    const sk = EIO(t, TG.spread, 0.4) * (1 - EIO(t, TG.gap, 0.3)); const sw2 = lerp(6, 46, EIO(t, TG.widen - 0.1, 0.6));
    if (sk > 0) { c.save(); c.globalAlpha *= sk; for (const d of [-1, 1]) { c.beginPath(); pts.forEach((p, i) => { if (!p) return; i ? c.lineTo(p[0], p[1] + d * sw2) : c.moveTo(p[0], p[1] + d * sw2); }); c.strokeStyle = d < 0 ? '#C4C8CC' : '#8FA6AE'; c.lineWidth = 2; c.setLineDash([8, 6]); c.stroke(); c.setLineDash([]); }
      txt(c, 'Ask', last[0] + 14, last[1] - sw2 + 6, { size: 18, w: 'S', color: '#C4C8CC', align: 'left', dir: 'ltr' }); txt(c, 'Bid', last[0] + 14, last[1] + sw2 + 6, { size: 18, w: 'S', color: '#8FA6AE', align: 'left', dir: 'ltr' }); c.restore(); }
    // slippage: the price you see vs the fill
    const ok = clamp((t - TG.see) / 0.25) * (1 - EIO(t, TG.spread - 0.2, 0.3));
    if (ok > 0) {
      c.save(); c.globalAlpha *= ok; const yS = last[1], yF = last[1] - 54 * clamp((t - TG.exec) / 0.3);
      c.setLineDash([10, 8]); c.strokeStyle = P.white; c.lineWidth = 2; c.beginPath(); c.moveTo(X0, yS); c.lineTo(X1, yS); c.stroke();
      if (t > TG.exec) { c.strokeStyle = P.gold; c.beginPath(); c.moveTo(X0, yF); c.lineTo(X1, yF); c.stroke(); } c.setLineDash([]);
      txt(c, 'السعر المعروض', X0 + 10, yS + 30, { size: 22, w: 'S', color: P.white, align: 'left' });
      if (t > TG.exec) txt(c, 'سعر التنفيذ', X0 + 10, yF - 14, { size: 22, w: 'S', color: P.gold, align: 'left' });
      const bk = sp(t, TG.slip, 14, 0.7); if (bk > 0) { c.save(); c.globalAlpha *= clamp(bk * 2); const bx = X1 - 40; c.strokeStyle = P.gold; c.lineWidth = 3; c.beginPath(); c.moveTo(bx - 12, yS); c.lineTo(bx, yS); c.lineTo(bx, yF); c.lineTo(bx - 12, yF); c.stroke(); txt(c, 'انزلاق سعري', bx - 20, (yS + yF) / 2 + 9, { size: 26, w: 'S', color: P.gold }); c.restore(); }
      c.restore();
    }
    // gap bracket
    if (gapK) { const gx = lerp(X0, X1, (gapAt - (now - span)) / span); if (gx > X0 && gx < X1) { const k2 = clamp((t - TG.without) / 0.3); if (k2 > 0) { c.save(); c.globalAlpha *= k2; const yA = toY(val(gapAt - 0.0015) - val(now - span)), yB = toY(val(gapAt + 0.0025) - val(now - span)); c.fillStyle = hexA(P.coral, 0.12); c.fillRect(gx - 8, Math.min(yA, yB), 26, Math.abs(yA - yB)); c.strokeStyle = P.coral; c.setLineDash([6, 6]); c.lineWidth = 2; c.strokeRect(gx - 8, Math.min(yA, yB), 26, Math.abs(yA - yB)); c.setLineDash([]); txt(c, 'دون المرور بالأسعار بينهما', gx - 20, (yA + yB) / 2 + 8, { size: 22, w: 'S', color: P.coral }); c.restore(); } } }
    // right stats column
    c.fillStyle = 'rgba(255,255,255,0.07)'; c.fillRect(X1 + 30, 120, 1, PCH - 170);
    const SX = PCW - 40;
    txt(c, 'السعر', SX, 160, { size: 22, w: 'R', color: P.dim });
    wheelSeq(c, [[0, '4,012.40'], [TG.jump, '4,031.80']], t, SX, 214, 40, { align: 'right', w: 600, snap: true, stagger: 0, color: t >= TG.jump ? P.coral : P.white });
    if (t >= TG.jump && t < TG.jump + 1.6) { c.save(); c.globalAlpha *= 1 - clamp((t - TG.jump - 0.6) / 1.0); ['4,014', '4,019', '4,025', '4,028'].forEach((s, i) => { lat(c, s, SX - 10, 262 + i * 30, { size: 20, w: 600, color: P.faint, align: 'right' }); c.fillStyle = P.coral; c.fillRect(SX - 70, 254 + i * 30, 66, 2); }); c.restore(); }
    txt(c, 'فارق السعر (Spread)', SX, 420, { size: 22, w: 'R', color: P.dim, alpha: clamp((t - TG.spread) / 0.3) });
    if (t > TG.spread) wheelSeq(c, [[0, '0.20'], [TG.widen - 0.05, '1.80']], t, SX, 470, 40, { align: 'right', w: 600, color: '#C4C8CC', stagger: 0.06 });
  }
  Q.scn({ t0: TG.in, t1: TG.out + 0.7, draw(ctx, t) {
    const k = xo(clamp((t - TG.in) / 0.9)); const ex = EIO(t, TG.out - 0.1, 0.6); if (ex >= 1) return;
    const cy = lerp(1500, 520, k) + 700 * ex * ex; const rx = lerp(0.9, 0.16, k) + 0.4 * ex;
    Q.tiltCard(ctx, 'exec', PCW, PCH, 900, cy, rx, 0.06, (c) => execFace(c, t), { scale: 1 });
    // market-condition chips (top-left) and the «when» toasts (right)
    const ch = (s, x, y, t0) => { const kk = sp(t, t0, 14, 0.7); if (kk <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(kk * 2) * (1 - ex); const ww = measure(ctx, s, 22, 'S') + 40; A.roundRect(ctx, x, y + (1 - Math.min(1, kk)) * 20, ww, 46, 23); ctx.fillStyle = 'rgba(22,23,27,0.95)'; ctx.fill(); ctx.strokeStyle = hexA(P.gold, 0.7); ctx.lineWidth = 1.5; ctx.stroke(); txt(ctx, s, x + ww / 2, y + 31 + (1 - Math.min(1, kk)) * 20, { size: 22, w: 'S', color: P.white, align: 'center' }); ctx.restore(); };
    if (t < TG.slip + 0.6) { ch('حركة سريعة', 240, 120, TG.fast); ch('نشاط منخفض', 440, 120, TG.thin); }
    ctx.save(); ctx.globalAlpha = 1 - ex;
    Q.toast(ctx, 1860, 650, 460, 'وقت الأخبار الكبيرة', null, t, TG.news, { dot: P.coral });
    Q.toast(ctx, 1860, 750, 460, 'بعد إغلاق العطل', null, t, TG.hol, { dot: P.coral });
    Q.toast(ctx, 1860, 850, 460, 'نهاية الأسبوع', null, t, TG.wkend, { dot: P.coral });
    ctx.restore();
  } });

  // ================================================================ H · the summary: an orbit network around Baghdad
  const TH = { in: w(82, 0) - 0.15, bag: w(83, 0), fixed: w(83, 1), us: w(84, 0), uk: w(84, 1), change: w(84, 2), lon: w(85, 1), ny: w(85, 2), news: w(85, 3), sw: w(85, 5), su: w(85, 8), wi: w(85, 9),
    asia: w(86, 1), fixed2: w(87, 0), out: F.phe(87) + 0.25 };
  const NODES = [{ s: 'لندن', a: -0.35, r: 300, t: TH.uk, hot: TH.lon, var: true }, { s: 'نيويورك', a: 3.0, r: 300, t: TH.us, hot: TH.ny, var: true }, { s: 'الأخبار الأمريكية', a: 0.55, r: 420, t: TH.news, hot: TH.news, var: true }, { s: 'الجلسة الآسيوية', a: -2.1, r: 420, t: TH.asia, hot: TH.asia, var: false }];
  const STARS = (() => { const r = A.rng(77); return Array.from({ length: 70 }, () => ({ a: r() * 6.283, r: 160 + r() * 460, s: 1 + r() * 2, w: (r() - 0.5) * 0.12 })); })();
  sfx(TH.in, 'whoosh', 0.14, { d: 0.5 }); sfx(TH.bag, 'impact', 0.12); sfx(TH.fixed, 'pop', 0.16, { f: 900 });
  NODES.forEach((n, i) => { sfx(n.t, 'bloop', 0.14, { pan: Math.cos(n.a) * 0.4 }); });
  sfx(TH.change, 'tick', 0.12, { f: 2600 }); sfx(TH.su, 'click', 0.16); sfx(TH.wi, 'click', 0.16); sfx(TH.fixed2, 'pop', 0.16, { f: 900 }); sfx(TH.out, 'whoosh', 0.14, { d: 0.45 });
  Q.scn({ t0: TH.in, t1: TH.out + 0.6, draw(ctx, t) {
    const k = EIO(t, TH.in, 0.7), ex = EI(t, TH.out, 0.5); if (ex >= 1) return; const cx = 960, cy = 560;
    ctx.save(); ctx.globalAlpha = 1 - ex; ctx.translate(cx, cy); ctx.scale(1 + 0.3 * ex, 1 + 0.3 * ex); ctx.translate(-cx, -cy);
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 520); glow.addColorStop(0, hexA(P.gold, 0.16 * k)); glow.addColorStop(1, hexA(P.gold, 0)); ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    for (const r of [300, 420]) { ctx.beginPath(); ctx.ellipse(cx, cy, r * k, r * 0.62 * k, 0, 0, 6.283); ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1.5; ctx.stroke(); }
    for (const s of STARS) { const a = s.a + t * s.w; ctx.fillStyle = hexA(P.gold, 0.35 * k); ctx.fillRect(cx + Math.cos(a) * s.r - s.s / 2, cy + Math.sin(a) * s.r * 0.62 - s.s / 2, s.s, s.s); }
    // nodes
    const season = EIO(t, TH.wi - 0.05, 0.35) * 1 - 0; // 0 = summer, 1 = winter
    NODES.forEach((n) => {
      const kk = sp(t, n.t, 13, 0.66); if (kk <= 0) return; const a = n.a + (t - TH.in) * 0.02; const x = cx + Math.cos(a) * n.r, y = cy + Math.sin(a) * n.r * 0.62;
      const hot = Math.exp(-Math.pow((t - n.hot - 0.15) / 0.3, 2));
      ctx.save(); ctx.globalAlpha *= clamp(kk * 2); ctx.strokeStyle = hexA(P.gold, 0.25 + 0.5 * hot); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();
      const rr = 44 * Math.min(1, kk) * (1 + 0.12 * hot); ctx.beginPath(); ctx.arc(x, y, rr, 0, 6.283); ctx.fillStyle = '#17181B'; ctx.fill(); ctx.strokeStyle = n.var ? '#C4C8CC' : '#E9D29A'; ctx.lineWidth = 3; ctx.stroke();
      txt(ctx, n.s, x, y + rr + 40, { size: 28, w: 'S', color: P.white, align: 'center' });
      const ck = sp(t, n.var ? Math.max(n.t, TH.change) + 0.1 : TH.fixed2, 15, 0.66);
      if (ck > 0) { ctx.save(); ctx.globalAlpha *= clamp(ck * 2); const s = n.var ? (season < 0.5 ? '±1h' : '+1h') : 'ثابتة'; const ww = n.var ? 78 : measure(ctx, s, 20, 'S') + 30; A.roundRect(ctx, x - ww / 2, y - 18, ww, 36, 18); ctx.fillStyle = n.var ? hexA('#C4C8CC', 0.16) : hexA(P.gold, 0.18); ctx.fill(); if (n.var) lat(ctx, s, x, y + 7, { size: 20, w: 800, color: '#E8EAEC', align: 'center' }); else txt(ctx, s, x, y + 7, { size: 20, w: 'S', color: P.gold, align: 'center' }); ctx.restore(); }
      ctx.restore();
    });
    // the centre: Baghdad
    const bk = sp(t, TH.bag, 12, 0.6);
    if (bk > 0) { const r = 92 * Math.min(1.05, bk); ctx.save(); ctx.shadowColor = hexA(P.gold, 0.7); ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.fillStyle = '#16171A'; ctx.fill(); ctx.restore(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.strokeStyle = P.gold; ctx.lineWidth = 5; ctx.stroke(); txt(ctx, 'بغداد', cx, cy - 4, { size: 34, w: 'S', color: P.white, align: 'center' }); lat(ctx, 'GMT+3', cx, cy + 34, { size: 22, w: 700, color: P.gold, align: 'center', track: 1 }); }
    // headline
    cap(ctx, 'الخلاصة', 960, 110, { size: 26, color: P.dim, alpha: clamp((t - TH.in) / 0.3) });
    const hk = clamp((t - TH.bag) / 0.25); if (hk > 0) { const s1 = 'بغداد', s2 = 'ثابتة.'; const w1 = measure(ctx, s1 + ' ', 56, 'S'), w2 = measure(ctx, s2, 56, 'S'); const x0 = 960 + (w1 + w2) / 2; txt(ctx, s1, x0, 180, { size: 56, w: 'S', color: P.white, alpha: hk }); txt(ctx, s2, x0 - w1, 180, { size: 56, w: 'S', color: P.gold, alpha: clamp((t - TH.fixed) / 0.2) }); }
    const tk = clamp((t - TH.sw) / 0.3); if (tk > 0) { ctx.save(); ctx.globalAlpha *= tk; toggle(ctx, 960, 900, EIO(t, TH.wi - 0.05, 0.35), 'الصيف', 'الشتاء', { w: 110, h: 50, size: 28 }); ctx.restore(); }
    ctx.restore();
  } });
})(typeof window !== 'undefined' ? window : globalThis);
