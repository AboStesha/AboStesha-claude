// Act III — what is fundamental analysis: health check, decisions, the calendar; summary, quiz, close.
(function (G) {
  const A = G.AX, F = G.FILM;
  const { W, H, C, INK, clamp, lerp, inv, sp, spring, eo, ei, eio, hexA, background, line, rectPts, circPts, hatch, txt, lat, measure, wipeText, tri, roundRect, xmark, logo, logoWidth } = A;
  const { w, we, ph, phe, sfx, hud, rich, eyebrow, card, tag, pill, hero, scene } = F;

  // =====================================================================
  // S15 — opener: ما هو التحليل الأساسي؟
  // =====================================================================
  const S15 = { t0: ph(47), t1: ph(48) };
  sfx(S15.t0 - 1.2, 'riser', 0.18, { d: 1.2 }); sfx(S15.t0 - 0.4, 'scan', 0.24, { d: 0.45 });
  sfx(S15.t0 + 0.05, 'thump', 0.42); sfx(w(47, 2), 'swipe', 0.16, { d: 0.5 });
  scene({
    name: 'fund-open', t0: S15.t0, t1: S15.t1, enter: { type: 'scanUp', dur: 0.45, line: C.white },
    draw(ctx, t) { F.opener(ctx, t, '02', 'ما هو التحليل الأساسي؟', w(47, 0), we(47, 3), S15.t0); },
  });

  // =====================================================================
  // S16 — the analyst is like a doctor: heartbeat, vitals → economic vitals, diagnosis
  // =====================================================================
  const S16 = { t0: ph(48), t1: w(57, 5) };
  const k16 = { sub: w(49, 0), ecg: w(49, 1), bp: w(51, 3), chol: w(51, 6), f1: w(52, 5), f2: w(53, 0), rate: w(54, 0), econ: w(55, 0), diag: w(56, 4), good: w(57, 2), bad: w(57, 4) };
  sfx(S16.t0 - 0.35, 'scan', 0.2, { d: 0.4 });
  for (let i = 0; i < 9; i++) sfx(k16.ecg + 0.35 + i * 0.9, 'beep', 0.07 - i * 0.005, { f: 1046 });
  sfx(k16.bp - 0.05, 'pop', 0.24, { f: 820, pan: 0.5 }); sfx(k16.chol - 0.05, 'pop', 0.24, { f: 700 });
  sfx(k16.f1 - 0.2, 'swipe', 0.18, { d: 0.35, pan: 0.5 }); sfx(k16.f2 - 0.2, 'swipe', 0.18, { d: 0.35 }); sfx(k16.rate - 0.05, 'pop', 0.24, { f: 600, pan: -0.5 });
  sfx(k16.econ, 'tick', 0.2); sfx(k16.diag, 'whoosh', 0.18, { d: 0.5, up: false });
  sfx(k16.good - 0.05, 'click', 0.3); sfx(k16.bad - 0.05, 'click', 0.3, { pan: -0.3 });
  function pulse(tau) { // one heartbeat every 0.9 s
    const ph2 = ((tau % 0.9) + 0.9) % 0.9; const g = (c, wd, a) => a * Math.exp(-((ph2 - c) ** 2) / (2 * wd * wd));
    return g(0.12, 0.03, 0.12) - g(0.28, 0.012, 0.18) + g(0.31, 0.012, 1.0) - g(0.345, 0.014, 0.35) + g(0.55, 0.05, 0.22);
  }
  function ecg(ctx, t, y0, amp, o = {}) {
    const x0 = 1770, x1 = 150, speed = 620; const elapsed = Math.max(0, t - o.t0);
    const span = x0 - x1; const head = x0 - ((elapsed * speed) % span); const flat = o.flat || 0;
    const pts = []; const gap = 60;
    for (let x = x0; x >= x1; x -= 4) {
      let dist = x >= head ? x - head : x - head + span; // distance behind the head (sweep moves right→left)
      dist = head - x >= 0 ? head - x : head - x + span;
      if (dist < 0 || dist > span - gap) { pts.push(null); continue; }
      const covered = elapsed * speed; if (dist > covered) { pts.push(null); continue; }
      const tau = elapsed - dist / speed; pts.push([x, y0 - pulse(tau) * amp * (1 - flat)]);
    }
    // split into runs
    let run = [];
    const flush = () => { if (run.length > 1) line(ctx, 'paper', run, { t, width: 3 }); run = []; };
    pts.forEach((p) => { if (p) run.push(p); else flush(); }); flush();
    if (elapsed > 0) { const hy = y0 - pulse(elapsed) * amp * (1 - flat); ctx.beginPath(); ctx.arc(head, hy, 10, 0, 7); ctx.fillStyle = C.red; ctx.fill(); }
  }
  function vital(ctx, t, x, y, wd, hh, p, flip, a, b) {
    // a/b = {title, val, code}; flip ∈ [0,1] flips the card around its vertical axis
    if (p <= 0) return; const f = clamp(flip); const showB = f >= 0.5; const sx = Math.max(0.02, Math.abs(Math.cos(f * Math.PI)));
    const d = showB ? b : a;
    ctx.save(); ctx.translate(x + wd / 2, 0); ctx.scale(sx, 1); ctx.translate(-(x + wd / 2), 0);
    card(ctx, x, y, wd, hh, { p });
    ctx.save(); ctx.translate(0, (1 - p) * 60); ctx.globalAlpha = clamp(p * 1.6);
    txt(ctx, d.title, x + wd - 36, y + 62, { size: 32, w: 'R', color: C.ink });
    lat(ctx, d.val, x + 36, y + hh - 44, { size: 64, w: 300, color: C.ink });
    if (d.code) lat(ctx, d.code, x + wd - 36, y + hh - 46, { size: 20, w: 600, color: C.charcoal, align: 'right', track: 1 });
    if (d.icon === 'drop') { ctx.save(); ctx.translate(x + wd - 60, y + 120); ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(0, -22); ctx.bezierCurveTo(16, 0, 16, 14, 0, 16); ctx.bezierCurveTo(-16, 14, -16, 0, 0, -22); ctx.fill(); ctx.restore(); }
    ctx.restore(); ctx.restore();
  }
  scene({
    name: 'doctor', t0: S16.t0, t1: S16.t1, enter: { type: 'scanDown', dur: 0.4, line: C.ink },
    draw(ctx, t) {
      background(ctx, 'paper');
      const out = eio(t, k16.diag, 0.5);
      rich(ctx, [{ s: 'المحلّل' }, { s: 'الأساسي' }], 1770, 250, { size: 96, w: 'L', color: C.ink, p: eo(t, S16.t0 - 0.3, 0.5) });
      rich(ctx, [{ s: 'أشبه' }, { s: 'بطبيب', red: true, w: 'R' }, { s: 'يجري تقييماً صحياً عاماً' }], 1770, 325, { size: 40, w: 'R', color: C.charcoal, p: inv(k16.sub, we(49, 5), t) });
      ecg(ctx, t, 500, 150, { t0: k16.ecg, flat: 0 });
      const pe = eo(t, k16.econ, 0.4); if (pe > 0) tag(ctx, 'نبض الاقتصاد', 1770, 400, { p: pe });
      // vitals → economic vitals
      ctx.save(); ctx.translate(0, out * 340);
      vital(ctx, t, 1300, 650, 470, 220, sp(t, k16.bp - 0.1, 15), inv(k16.f1 - 0.3, k16.f1 + 0.1, t),
        { title: 'ضغط الدم', val: '120/80', icon: 'drop' }, { title: 'الناتج المحلي الإجمالي', val: '+2.4%', code: 'GDP' });
      vital(ctx, t, 800, 650, 470, 220, sp(t, k16.chol - 0.1, 15), inv(k16.f2 - 0.3, k16.f2 + 0.1, t),
        { title: 'الكوليسترول', val: '180', icon: 'drop' }, { title: 'مؤشر أسعار المستهلك', val: '3.1%', code: 'CPI' });
      vital(ctx, t, 300, 650, 470, 220, sp(t, k16.rate - 0.1, 15), 0, { title: 'أسعار الفائدة', val: '4.50%', code: 'Interest Rate' }, null);
      ctx.restore();
      // diagnosis toggle: good or not
      const pd = sp(t, k16.diag + 0.2, 14);
      if (pd > 0) {
        const cx = 960, cy = 760, tw = 360, th = 120; const knob = 0.5 + 0.5 * sp(t, k16.good, 18) - 1.0 * sp(t, k16.bad, 18);
        ctx.save(); ctx.globalAlpha = clamp(pd * 1.5); ctx.translate(cx, cy); ctx.scale(lerp(0.85, 1, pd), lerp(0.85, 1, pd));
        roundRect(ctx, -tw / 2, -th / 2, tw, th, th / 2); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = hexA(C.ink, 0.2); ctx.stroke();
        const kx = lerp(-tw / 2 + th / 2, tw / 2 - th / 2, knob); const good = knob > 0.5;
        ctx.beginPath(); ctx.arc(kx, 0, th / 2 - 10, 0, 7); ctx.fillStyle = knob > 0.55 ? C.mint : knob < 0.45 ? C.red : C.silver; ctx.fill();
        ctx.strokeStyle = good ? C.ink : C.white; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath();
        if (knob > 0.55) { ctx.moveTo(kx - 18, 2); ctx.lineTo(kx - 4, 16); ctx.lineTo(kx + 20, -14); } else if (knob < 0.45) { ctx.moveTo(kx - 14, -14); ctx.lineTo(kx + 14, 14); ctx.moveTo(kx + 14, -14); ctx.lineTo(kx - 14, 14); }
        ctx.stroke(); ctx.restore();
        txt(ctx, 'في حالة جيدة', cx + tw / 2 + 40, cy + 12, { size: 40, w: 'R', color: C.ink, align: 'left', alpha: clamp(pd * 1.5) * (knob > 0.55 ? 1 : 0.35) });
        txt(ctx, 'أم لا؟', cx - tw / 2 - 40, cy + 12, { size: 40, w: 'R', color: C.red, align: 'right', alpha: clamp(pd * 1.5) * (knob < 0.45 ? 1 : 0.35) });
      }
      hud(ctx, t, 'paper', '13|التحليل الأساسي');
    },
  });

  // =====================================================================
  // S17 — information guides decisions: strong economy → buy, weak → sell
  // =====================================================================
  const S17 = { t0: w(57, 5), t1: ph(61) };
  const k17 = { flat: w(57, 5), info: w(57, 7), guide: w(57, 10), country: w(58, 3), good: w(58, 6), buy: w(59, 0), bad: w(59, 6), sell: w(60, 0) };
  sfx(k17.flat, 'whoosh', 0.16, { d: 0.5, up: false }); for (let i = 0; i < 6; i++) sfx(k17.info + i * 0.6 + 0.55, 'tick', 0.12, { f: 2200 + (i % 3) * 300, pan: -0.2 }); sfx(k17.country - 0.05, 'pop', 0.24, { f: 700 }); sfx(k17.guide, 'swipe', 0.14, { d: 0.4 });
  sfx(k17.good - 0.05, 'pen', 0.22, { d: 0.6, pan: -0.4 }); sfx(k17.buy - 0.05, 'pop', 0.3, { f: 900, pan: -0.5 }); sfx(k17.buy + 0.05, 'whoosh', 0.16, { d: 0.6, pan: -0.5 });
  sfx(k17.bad - 0.05, 'pen', 0.22, { d: 0.6, pan: -0.4 }); sfx(k17.sell - 0.05, 'pop', 0.3, { f: 520, pan: -0.5 }); sfx(k17.sell + 0.05, 'whoosh', 0.16, { d: 0.6, up: false, pan: -0.5 });
  function coin(ctx, x, y, r, label, alpha = 1) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y);
    ctx.fillStyle = C.concrete; ctx.beginPath(); ctx.ellipse(0, 10, r, r * 0.98, 0, 0, 7); ctx.fill();
    const g = ctx.createLinearGradient(0, -r, 0, r); g.addColorStop(0, C.frost); g.addColorStop(1, C.silver);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
    ctx.strokeStyle = hexA(C.charcoal, 0.6); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, 7); ctx.stroke();
    lat(ctx, label, 0, r * 0.18, { size: r * 0.5, w: 600, color: C.charcoal, align: 'center' });
    ctx.restore();
  }
  scene({
    name: 'decision', t0: S17.t0, t1: S17.t1, enter: { type: 'cut' },
    draw(ctx, t) {
      background(ctx, 'paper');
      const fl = eio(t, k17.flat, 0.6);
      const prev = 1 - fl;
      if (prev > 0) { rich(ctx, [{ s: 'المحلّل' }, { s: 'الأساسي' }], 1770, 250, { size: 96, w: 'L', color: C.ink, alpha: prev }); }
      rich(ctx, [{ s: 'توجيه' }, { s: 'قراراتك', red: true }], 1770, 250, { size: 96, w: 'L', color: C.ink, p: inv(k17.guide - 0.3, we(57, 12), t) });
      // the line flattens to a stem flowing right→left into a decision node
      const node = [1100, 560];
      line(ctx, 'paper', [[1770, lerp(500, 560, fl)], [lerp(150, node[0], fl), lerp(500, 560, fl)]], { t, width: 3.2 });
      if (fl > 0.95) { ctx.beginPath(); ctx.arc(node[0], node[1], 14, 0, 7); ctx.fillStyle = C.ink; ctx.fill(); }
      // information packets flow along the stem into the decision node
      const codes = ['GDP', 'CPI', 'RATE'];
      for (let i = 0; i < 6; i++) {
        const t0p = k17.info + i * 0.6; const u = inv(t0p, t0p + 1.1, t); if (u <= 0 || u >= 1) continue;
        const x = lerp(1770, node[0] + 30, A.expoInOut(u)); const a = clamp(Math.min(u * 6, (1 - u) * 6));
        ctx.save(); ctx.globalAlpha = a; roundRect(ctx, x - 44, node[1] - 58, 88, 36, 8); ctx.fillStyle = C.white; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.stroke();
        lat(ctx, codes[i % 3], x, node[1] - 33, { size: 18, w: 600, color: C.ink, align: 'center', track: 1 }); ctx.restore();
      }
      const pk = sp(t, k17.country, 14) * (1 - eo(t, k17.buy - 0.1, 0.2));
      if (pk > 0) { coin(ctx, node[0], node[1] - 110 + (1 - pk) * 30, 46, 'EUR', clamp(pk * 1.5)); txt(ctx, 'اقتصاد الدولة', node[0] + 80, node[1] - 100, { size: 30, w: 'R', color: C.charcoal, align: 'left', alpha: clamp(pk * 1.5) }); }
      const up = []; const dn = [];
      for (let i = 0; i <= 50; i++) { const u = i / 50; up.push([lerp(node[0], 470, u), node[1] - Math.pow(u, 0.8) * 250 - Math.sin(u * 12) * 12 * u]); dn.push([lerp(node[0], 470, u), node[1] + Math.pow(u, 0.8) * 250 + Math.sin(u * 11) * 12 * u]); }
      const pu = eo(t, k17.good - 0.3, 0.9), pdn = eo(t, k17.bad - 0.3, 0.9);
      if (pu > 0) line(ctx, 'paper', up, { t, reveal: pu, width: 3.4, color: C.ink });
      if (pdn > 0) line(ctx, 'paper', dn, { t, reveal: pdn, width: 3.4, color: C.red });
      // condition labels along the branches
      const lg = eo(t, k17.good - 0.4, 0.4); if (lg > 0) { txt(ctx, 'أداء جيد', 960, 390, { size: 40, w: 'R', color: C.ink, alpha: lg }); tri(ctx, 990, 376, 22, 'u', C.mint, lg); }
      const lb = eo(t, k17.bad - 0.4, 0.4); if (lb > 0) { txt(ctx, 'أداء سيئ', 960, 760, { size: 40, w: 'R', color: C.ink, alpha: lb }); tri(ctx, 990, 746, 22, 'd', C.red, lb); }
      // outcomes
      const pb = sp(t, k17.buy, 16);
      if (pb > 0) { pill(ctx, 'شراء', 320, 300, { p: pb, fill: C.mint, color: C.ink }); }
      const ps = sp(t, k17.sell, 16);
      if (ps > 0) { pill(ctx, 'بيع', 320, 820, { p: ps }); }
      // the currency travels along the chosen branch
      const cu = eio(t, k17.buy, 0.8); if (cu > 0) { const q = A.subPath(up, 0, Math.max(0.01, cu * 0.92)).pop(); coin(ctx, q[0], q[1] - 70, 46, 'EUR', clamp(cu * 4) * (1 - eo(t, k17.sell - 0.4, 0.3) * 0.6)); }
      const cd = eio(t, k17.sell, 0.8); if (cd > 0) { const q = A.subPath(dn, 0, Math.max(0.01, cd * 0.92)).pop(); coin(ctx, q[0], q[1] + 70, 46, 'EUR', clamp(cd * 4)); }
      const pcu = eo(t, k17.buy + 0.3, 0.4); if (pcu > 0) txt(ctx, 'العملة المرتبطة به', 320, 230, { size: 28, w: 'R', color: C.charcoal, align: 'center', alpha: pcu });
      hud(ctx, t, 'paper', '14|القرار');
    },
  });

  // =====================================================================
  // S18 — the economic calendar: scheduled releases → a foundation for decisions
  // =====================================================================
  const S18 = { t0: ph(61), t1: ph(67) };
  const k18 = { q: ph(61), grid: w(62, 0), sched: w(62, 1), table: w(63, 2), rows: w(64, 1), gdp: w(65, 1), rate: w(65, 4), gather: w(66, 1), stack: w(66, 3), assess: w(66, 8), base: w(66, 12) };
  sfx(k18.q, 'swipe', 0.14, { d: 0.4 }); sfx(k18.grid, 'pen', 0.22, { d: 0.9 });
  for (let i = 0; i < 7; i++) sfx(k18.sched + 0.1 + i * 0.15, 'tick', 0.14, { f: 2000 + i * 180 });
  sfx(k18.table - 0.1, 'whoosh', 0.2, { d: 0.5 });
  for (let i = 0; i < 6; i++) sfx(k18.rows + i * 0.3, 'tick', 0.16, { f: 2600 - i * 120 });
  sfx(k18.gdp - 0.05, 'click', 0.28); sfx(k18.rate - 0.05, 'click', 0.28);
  for (let i = 0; i < 6; i++) sfx(k18.gather + 0.1 + i * 0.12, 'snap', 0.2, { pan: -0.3 + i * 0.12 });
  sfx(k18.assess, 'riser', 0.12, { d: 1.6 }); sfx(k18.base - 0.05, 'thump', 0.4);
  const ROWS = [
    ['15:30', 'USD', 'الناتج المحلي الإجمالي', 'GDP', 3, '2.6%', true],
    ['21:00', 'USD', 'قرار أسعار الفائدة', 'Rate', 3, '4.50%', false],
    ['12:00', 'EUR', 'مؤشر أسعار المستهلك', 'CPI', 2, '2.4%', false],
    ['15:30', 'USD', 'الوظائف غير الزراعية', 'NFP', 3, '175K', true],
    ['10:30', 'GBP', 'مؤشر مديري المشتريات', 'PMI', 2, '51.2', true],
    ['03:30', 'AUD', 'مبيعات التجزئة', 'Retail', 1, '0.4%', false],
  ];
  const DOTS = [3, 8, 11, 15, 19, 24, 29];
  scene({
    name: 'calendar', t0: S18.t0, t1: S18.t1, enter: { type: 'scanDown', dur: 0.45, line: C.ink },
    draw(ctx, t) {
      background(ctx, 'paper');
      const toTable = eio(t, k18.table - 0.2, 0.6); const gather = eio(t, k18.gather, 0.9);
      const hq = inv(k18.q, we(61, 5), t) * (1 - eo(t, k18.table - 0.3, 0.3));
      if (hq > 0) rich(ctx, [{ s: 'من' }, { s: 'أين', red: true }, { s: 'تحصل على المعلومات؟' }], 1770, 250, { size: 96, w: 'L', color: C.ink, p: hq });
      const ht = inv(k18.table - 0.2, we(63, 3), t) * (1 - eo(t, k18.gather, 0.3));
      if (ht > 0) rich(ctx, [{ s: 'التقويم' }, { s: 'الاقتصادي' }], 1770, 250, { size: 96, w: 'L', color: C.ink, p: ht });
      const ha = inv(k18.assess - 0.3, we(66, 14), t);
      if (ha > 0) rich(ctx, [{ s: 'يشكّل' }, { s: 'الأساس', red: true }, { s: 'لقراراتك' }], 1770, 250, { size: 96, w: 'L', color: C.ink, p: ha });
      // month grid (scheduled)
      const pg = eo(t, k18.grid, 0.9) * (1 - toTable);
      if (pg > 0) {
        const gx = 540, gy = 380, cw = 120, chh = 92;
        for (let r = 0; r <= 5; r++) line(ctx, 'paper', [[gx + 7 * cw, gy + r * chh], [gx, gy + r * chh]], { t, reveal: clamp(pg * 1.4 - r * 0.08), width: 2, seed: r, alpha: 1 - toTable });
        for (let c = 0; c <= 7; c++) line(ctx, 'paper', [[gx + c * cw, gy], [gx + c * cw, gy + 5 * chh]], { t, reveal: clamp(pg * 1.4 - c * 0.06), width: 2, seed: c + 9, alpha: 1 - toTable });
        for (let d = 0; d < 35; d++) {
          const c = 6 - (d % 7), r = Math.floor(d / 7); const pd = eo(t, k18.grid + 0.4 + d * 0.012, 0.3) * (1 - toTable);
          if (d < 31) lat(ctx, String(d + 1), gx + c * cw + 12, gy + r * chh + 28, { size: 18, w: 600, color: C.charcoal, alpha: pd });
          const di = DOTS.indexOf(d); if (di >= 0) { const pdot = sp(t, k18.sched + 0.1 + di * 0.15, 20) * (1 - toTable); if (pdot > 0) { ctx.beginPath(); ctx.arc(gx + c * cw + cw / 2, gy + r * chh + chh / 2 + 10, 12 * pdot, 0, 7); ctx.fillStyle = C.red; ctx.fill(); } }
        }
        txt(ctx, 'مُجدول', 1770, 600, { size: 48, w: 'R', color: C.ink, alpha: eo(t, k18.sched, 0.3) * (1 - toTable) });
      }
      // table
      if (toTable > 0) {
        const tx = 190, ty = 320, tw = 1580, th = 580;
        const tp = toTable * (1 - gather);
        if (tp > 0) {
          card(ctx, tx, ty, tw, th, { p: tp });
          ctx.save(); ctx.globalAlpha = clamp(tp * 1.4);
          const cols = { time: tx + tw - 40, cur: tx + tw - 200, ev: tx + tw - 360, imp: tx + 420, act: tx + 60 };
          const hy = ty + 62;
          txt(ctx, 'الوقت', cols.time, hy, { size: 24, w: 'R', color: C.charcoal }); txt(ctx, 'العملة', cols.cur, hy, { size: 24, w: 'R', color: C.charcoal });
          txt(ctx, 'الحدث', cols.ev, hy, { size: 24, w: 'R', color: C.charcoal }); txt(ctx, 'الأهمية', cols.imp, hy, { size: 24, w: 'R', color: C.charcoal });
          txt(ctx, 'الفعلي', cols.act, hy, { size: 24, w: 'R', color: C.charcoal, align: 'left' });
          ctx.fillStyle = hexA(C.ink, 0.12); ctx.fillRect(tx + 30, hy + 22, tw - 60, 1.5);
          ROWS.forEach((r, i) => {
            const pr = eo(t, k18.rows + i * 0.3, 0.35); if (pr <= 0) return; const y = ty + 140 + i * 76;
            const hl = (i === 0 ? eo(t, k18.gdp, 0.3) * (1 - eo(t, k18.rate, 0.3)) : i === 1 ? eo(t, k18.rate, 0.3) : 0);
            ctx.save(); ctx.globalAlpha *= pr; ctx.translate((1 - pr) * 40, 0);
            if (hl > 0) { ctx.fillStyle = hexA(C.frost, hl); ctx.fillRect(tx + 30, y - 46, tw - 60, 70); ctx.fillStyle = C.red; ctx.globalAlpha *= hl; ctx.fillRect(tx + tw - 34, y - 46, 4, 70); ctx.globalAlpha /= Math.max(hl, 0.001); }
            lat(ctx, r[0], cols.time, y, { size: 26, w: 400, color: C.ink, align: 'right' });
            lat(ctx, r[1], cols.cur, y, { size: 26, w: 600, color: C.ink, align: 'right', track: 1 });
            txt(ctx, r[2], cols.ev, y, { size: 30, w: hl > 0.5 ? 'B' : 'R', color: C.ink });
            for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(cols.imp - 14 - k * 30, y - 10, 9, 0, 7); if (k < r[4]) { ctx.fillStyle = r[4] === 3 ? C.red : C.ink; ctx.fill(); } else { ctx.strokeStyle = hexA(C.ink, 0.3); ctx.lineWidth = 1.5; ctx.stroke(); } }
            lat(ctx, r[5], cols.act, y, { size: 28, w: 600, color: C.ink });
            ctx.restore();
          });
          ctx.restore();
        }
      }
      // gather the events into a foundation, then the decision rises from it
      if (gather > 0) {
        const bw = 420, bh = 78, gap = 10; const base = [[0, 0], [1, 0], [2, 0], [0.5, 1], [1.5, 1], [1, 2]];
        ROWS.forEach((r, i) => {
          const from = [190 + 60, 320 + 140 + i * 76 - 50]; const [bx, by] = base[i];
          const to = [960 - 1.5 * (bw + gap) + bx * (bw + gap), 900 - bh - by * (bh + gap)];
          const p = eio(t, k18.gather + i * 0.12, 0.6);
          const x = lerp(from[0], to[0], p), y = lerp(from[1], to[1], p), wv = lerp(1520, bw, p), hv = lerp(64, bh, p);
          ctx.save(); roundRect(ctx, x, y, wv, hv, 10); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.ink; ctx.stroke();
          hatch(ctx, 'paper', (c) => { c.beginPath(); c.rect(x, y, wv, hv); }, { box: [x, y, wv, hv], gap: 12, alpha: 0.22 * p, t });
          txt(ctx, r[2], x + wv - 24, y + hv / 2 + 11, { size: 26, w: 'R', color: C.ink });
          ctx.restore();
        });
        const pil = eo(t, k18.assess, 1.4);
        if (pil > 0) {
          const top = lerp(650, 370, pil);
          ctx.save(); ctx.fillStyle = C.ink; ctx.fillRect(956, top, 8, 650 - top); ctx.restore();
          tri(ctx, 960, top - 8, 44, 'u', C.red);
          txt(ctx, 'تقييم شامل', 1000, top + 40, { size: 34, w: 'R', color: C.ink, align: 'left', alpha: clamp(pil * 2) });
        }
      }
      hud(ctx, t, 'paper', '15|التقويم الاقتصادي');
    },
  });

  // =====================================================================
  // S19 — summary: fundamental = what to buy · technical = when to buy
  // =====================================================================
  const S19 = { t0: ph(67), t1: ph(69) };
  const k19 = { split: ph(67), fa: w(67, 2), what: w(67, 5), buy1: w(67, 6), ta: w(68, 0), when: w(68, 3), buy2: w(68, 4) };
  sfx(k19.split, 'scan', 0.24, { d: 0.5, pan: -0.5 }); sfx(k19.fa, 'swipe', 0.14, { d: 0.4, pan: 0.5 });
  sfx(k19.what - 0.05, 'thump', 0.42, { pan: 0.4 }); sfx(k19.ta, 'swipe', 0.14, { d: 0.4, pan: -0.5 }); sfx(k19.when - 0.05, 'thump', 0.42, { pan: -0.4 });
  function summarySides(ctx, t, div) {
    // paper side (right)
    const r = (s, x, y, o, tt) => { const p = sp(t, tt, 16); if (p > 0) { ctx.save(); ctx.globalAlpha = clamp(p * 1.5); ctx.translate(0, (1 - p) * 40); txt(ctx, s, x, y, o); ctx.restore(); } };
    eyebrow(ctx, 'تذكّروا', 1770, 200, eo(t, k19.split, 0.4));
    r('التحليل الأساسي', 1440, 360, { size: 48, w: 'R', color: C.ink, align: 'center' }, k19.fa);
    r('يخبرك', 1440, 430, { size: 32, w: 'R', color: C.charcoal, align: 'center' }, k19.fa + 0.4);
    r('ماذا', 1440, 680, { size: 230, w: 'L', color: C.red, align: 'center' }, k19.what);
    r('تشتري؟', 1440, 830, { size: 96, w: 'L', color: C.ink, align: 'center' }, k19.buy1);
    // steel side (left)
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, div, H); ctx.clip();
    background(ctx, 'steel');
    r('التحليل الفني', 480, 360, { size: 48, w: 'R', color: C.white, align: 'center' }, k19.ta);
    r('يخبرك', 480, 430, { size: 32, w: 'R', color: INK.steel.sub, align: 'center' }, k19.ta + 0.4);
    r('متى', 480, 680, { size: 230, w: 'L', color: C.white, align: 'center' }, k19.when);
    const pu = eo(t, k19.when + 0.1, 0.4); if (pu > 0) { ctx.fillStyle = C.red; ctx.fillRect(480 - 150 * pu, 712, 300 * pu, 8); }
    r('تشتري؟', 480, 830, { size: 96, w: 'L', color: C.white, align: 'center' }, k19.buy2);
    hud(ctx, t, 'steel', '16|الخلاصة', { tr: false, br: false });
    ctx.restore();
    line(ctx, 'paper', [[div, 0], [div, H]], { t, width: 3, color: C.ink });
  }
  scene({
    name: 'summary', t0: S19.t0, t1: S19.t1, enter: { type: 'cut' },
    draw(ctx, t) {
      background(ctx, 'paper');
      hud(ctx, t, 'paper', '16|الخلاصة', { tl: false, bl: false });
      const div = 960 * eio(t, k19.split, 0.55);
      // the pillar from the calendar becomes the divider
      summarySides(ctx, t, div);
      if (div < 950) { ctx.fillStyle = C.ink; ctx.fillRect(956, 370, 8, 280); }
    },
  });

  // =====================================================================
  // S20 — outro: answer the questions below; see you in the next lesson
  // =====================================================================
  const S20 = { t0: ph(69), t1: F.CLOSE };
  const k20 = { close: ph(69), card: w(69, 0), qs: w(69, 2), below: w(69, 4), next: w(70, 0) };
  sfx(k20.close, 'whoosh', 0.2, { d: 0.5, up: false, pan: -0.5 }); sfx(k20.card, 'pop', 0.26, { f: 760 });
  for (let i = 0; i < 3; i++) sfx(k20.qs + i * 0.12, 'tick', 0.14, { f: 2400 + i * 200 });
  sfx(k20.below, 'pop', 0.22, { f: 600 }); sfx(k20.next, 'swipe', 0.14, { d: 0.4 });
  scene({
    name: 'outro', t0: S20.t0, t1: S20.t1, enter: { type: 'cut' },
    draw(ctx, t) {
      background(ctx, 'paper');
      const div = 960 * (1 - eio(t, k20.close, 0.5));
      if (div > 1) {
        ctx.save(); ctx.beginPath(); ctx.rect(div, 0, W - div, H); ctx.clip();
        ctx.translate((960 - div) * 0.6, 0); ctx.globalAlpha = div / 960;
        txt(ctx, 'ماذا', 1440, 680, { size: 230, w: 'L', color: C.red, align: 'center' }); ctx.restore();
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, div, H); ctx.clip(); background(ctx, 'steel'); ctx.restore();
        line(ctx, 'paper', [[div, 0], [div, H]], { t, width: 3, color: C.ink });
      }
      const pc = sp(t, k20.card, 14);
      if (pc > 0) {
        const x = 460, y = 300, wd = 1000, hh = 420; card(ctx, x, y, wd, hh, { p: pc });
        ctx.save(); ctx.translate(0, (1 - pc) * 60); ctx.globalAlpha = clamp(pc * 1.6);
        txt(ctx, 'امتحان الدرس', x + wd - 50, y + 92, { size: 52, w: 'R', color: C.ink });
        txt(ctx, '10 أسئلة · درجة الاجتياز 80%', x + 50, y + 92, { size: 28, w: 'R', color: C.charcoal, align: 'left' });
        [0, 1, 2].forEach((i) => { const p = eo(t, k20.qs + i * 0.12, 0.4); if (p <= 0) return; const lw = [720, 600, 660][i]; ctx.fillStyle = C.frost; roundRect(ctx, x + wd - 50 - lw * p, y + 150 + i * 46, lw * p, 18, 9); ctx.fill(); });
        pill(ctx, 'ابدأ الامتحان', x + 190, y + hh - 80, { p: eo(t, k20.qs + 0.4, 0.4) });
        ctx.restore();
      }
      const pb = sp(t, k20.below, 14);
      if (pb > 0) {
        const bob = Math.sin((t - k20.below) * Math.PI / 0.6) * 8;
        tri(ctx, 960, 790 + bob, 34 * pb, 'd', C.red);
        txt(ctx, 'أسفل الصفحة', 960, 860, { size: 32, w: 'R', color: C.ink, align: 'center', alpha: pb });
      }
      const pn = inv(k20.next, we(70, 3), t);
      if (pn > 0) wipeText(ctx, 'نراكم في الدرس القادم', 1770, 210, { size: 40, w: 'R', color: C.charcoal }, pn);
      hud(ctx, t, 'paper', '17|الختام');
    },
  });

  // =====================================================================
  // S21 — close: X sting (1 s) then the CTA screen with the red pill + risk strip
  // =====================================================================
  const S21 = { t0: F.CLOSE, t1: F.TOTAL + 1 };
  sfx(S21.t0 - 0.4, 'scan', 0.22, { d: 0.45 }); sfx(S21.t0 + 0.02, 'sting', 0.6);
  sfx(S21.t0 + 1.05, 'whoosh', 0.16, { d: 0.4 }); sfx(S21.t0 + 1.35, 'pop', 0.26, { f: 820 });
  function x3d(ctx, cx, cy, h, depth, alpha = 1) {
    const m = A; ctx.save(); ctx.globalAlpha = alpha;
    for (let d = depth; d > 0; d -= 1.5) xmark(ctx, cx + d * 0.55, cy + d, h, C.slate, 1);
    xmark(ctx, cx, cy, h, C.white, 1); ctx.restore();
  }
  scene({
    name: 'close', t0: S21.t0, t1: S21.t1, enter: { type: 'scanDown', dur: 0.45, line: C.white },
    draw(ctx, t) {
      // primary gradient (light top → slate)
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, C.frost); g.addColorStop(0.72, C.slate); g.addColorStop(1, C.slate);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const lt = t - S21.t0;
      // X: drop and settle with a slight bounce, hold, then seal
      const drop = lt < 0 ? 0 : 1 - Math.exp(-7 * lt) * Math.cos(13 * lt);
      const seal = ei(t, S21.t0 + 0.95, 0.25);
      if (seal < 1) {
        const y = lerp(-260, 520, drop); const s = 1 - seal;
        ctx.save(); ctx.translate(960, y); ctx.scale(s, s); x3d(ctx, 0, 0, 300, 26, 1); ctx.restore();
      }
      // CTA screen
      const pc = sp(t, S21.t0 + 1.1, 12);
      if (pc > 0) {
        txt(ctx, 'تعلّم ثم تعلّم ثم تدرّب ثم تداول.', 960, 560 + (1 - pc) * 40, { size: 84, w: 'L', color: C.white, align: 'center', alpha: clamp(pc * 1.5) });
        pill(ctx, 'تعلّم مع Axi', 960, 700, { p: sp(t, S21.t0 + 1.35, 14), size: 32, h: 76 });
        logo(ctx, 1843 - logoWidth(84), 52, 84, C.ink, { alpha: clamp(pc * 1.5) });
      }
      // risk strip — last 3 seconds
      const pr = eo(t, F.TOTAL - 3.0, 0.3);
      if (pr > 0) {
        ctx.save(); ctx.globalAlpha = pr; ctx.fillStyle = 'rgba(9,10,13,0.75)'; ctx.fillRect(0, 930, W, 150);
        txt(ctx, 'تنطوي عقود الفروقات والمنتجات المشتقة خارج البورصة على مخاطر عالية قد تؤدي إلى خسارة رأس المال. المحتوى التعليمي والتحليلي لا يُعدّ نصيحة استثمارية.', 960, 990, { size: 22, w: 'R', color: C.white, align: 'center' });
        txt(ctx, 'قد لا يكون هذا المحتوى متاحاً في منطقتك. يُرجى الرجوع إلى شروط الخدمة.', 960, 1032, { size: 22, w: 'R', color: hexA(C.white, 0.8), align: 'center' });
        ctx.restore();
      }
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
