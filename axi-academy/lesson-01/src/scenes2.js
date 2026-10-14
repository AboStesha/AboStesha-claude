// Lesson 01 — Part 2: back to the exchange office · the surprise (1,100 AUD) · a mistake? · the dollar rose · John's loop · not that simple · questions · «مع آكسي تداول بثقة».
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT;
  const { W, H, C, clamp, lerp, inv, eo, ei, eio, hexA, txt, lat, measure, line } = A;
  const { w, we, wl, ph, sfx, ksfx, scene } = F;
  const SIL = C.silver, SUB = hexA(C.white, 0.72);
  const { coin, odometer, notes, person, plane } = F.L1;

  // ================================================================ S9 — back to the office: 700 USD → ? AUD (light)
  const S9 = { t0: 55.62, t1: 62.3 };
  sfx(S9.t0 - 0.45, 'shutter', 0.18); sfx(w(20, 1), 'whoosh', 0.14, { d: 0.5 }); sfx(w(20, 2), 'type', 0.1, { d: 2.4, n: 22 }); sfx(w(21, 2) + 0.2, 'riser', 0.1, { d: 0.9 });
  scene({ name: 'return', t0: S9.t0, t1: S9.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    K.cap(ctx, wl(19), 240, t, { out: K.outAt(t, w(20, 0) - 0.25) });
    K.cap(ctx, wl(20).concat(wl(21)), 240, t, {});
    const p = FX.springU(t - (S9.t0 + 0.2), 14, 0.5);
    if (p > 0) { odometer(ctx, 700, 1300, 600, { size: 200, digits: 4, align: 'center', snap: true, alpha: Math.min(1, p) }); K.chip(ctx, 'USD', 1300, 700, { p: Math.min(1, p), align: 'center', size: 30, fill: C.ink, stroke: C.ink, color: C.white }); }
    K.arrowH(ctx, 1010, 830, 540, eo(t, w(20, 1), 0.5), { color: C.slate, width: 5 });
    // spinning unknown amount
    const sp = eo(t, w(20, 2), 0.4);
    if (sp > 0) {
      const v = 1000 + ((t - w(20, 2)) * 140) % 900; odometer(ctx, v, 560, 600, { size: 200, digits: 4, align: 'center', alpha: sp, color: hexA(C.ink, 0.45) });
      K.chip(ctx, 'AUD', 560, 700, { p: eo(t, w(21, 2), 0.35), align: 'center', size: 30, fill: '#FFFFFF', stroke: C.ink, color: C.ink });
      FX.kword(ctx, '؟', 560 + 170, 470, { size: 120, color: C.red, lt: t - (w(21, 2) + 0.1), mode: 'bounce' });
    }
  } });

  // ================================================================ S10 — the surprise: 1,100 AUD, 100 more than expected (dark)
  const S10 = { t0: S9.t1, t1: 72.62 };
  const LAND = w(23, 3) + 0.05;
  sfx(S10.t0 - 0.42, 'ripple', 0.2); ksfx(w(22, 2), 'stretch', 0.26); sfx(LAND - 0.8, 'type', 0.12, { d: 0.75, n: 10 }); sfx(LAND, 'slam', 0.26); sfx(LAND + 0.1, 'chime', 0.14);
  ksfx(w(24, 2), 'bounce', 0.22, 700); sfx(w(25, 2), 'scribble', 0.1, { d: 0.4 });
  scene({ name: 'surprise', t0: S10.t0, t1: S10.t1, ink: 'dark', enter: { type: 'ripple', dur: 0.42, x: 560, y: 560 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    K.cap(ctx, wl(22, 0, 1), 250, t, { color: SUB, out: K.outAt(t, w(23, 0) - 0.25) });
    const up = eio(t, w(23, 0) - 0.1, 0.5); const sw = FX.kwidth('المفاجأة', 260);
    ctx.save(); ctx.translate(960, lerp(600, 290, up)); ctx.scale(lerp(1, 0.42, up), lerp(1, 0.42, up)); ctx.translate(-960, 0);
    FX.kword(ctx, 'المفاجأة', 960 + sw / 2, 0, { size: 260, color: C.white, lt: t - w(22, 2), mode: 'stretch' }); ctx.restore();
    // counter lands on 1,100
    const v = t < LAND - 0.8 ? 0 : lerp(1000, 1100, eo(t, LAND - 0.8, 0.8));
    if (t > w(23, 0)) {
      const sl = FX.springU(t - LAND, 16, 0.45); const s = t > LAND ? lerp(1.25, 1, Math.min(1, sl)) : 1;
      ctx.save(); ctx.translate(960, 600); ctx.scale(s, s); odometer(ctx, v, 0, 80, { size: 240, digits: 4, align: 'center', color: C.white, snap: t > LAND + 0.05 }); ctx.restore();
      K.chip(ctx, 'AUD', 960, 760, { p: eo(t, w(23, 4), 0.35), align: 'center', size: 32, fill: C.white, stroke: C.white, color: C.ink });
      K.cap(ctx, wl(23, 0, 2), 860, t, { color: SUB, size: 48, out: K.outAt(t, w(24, 0) - 0.25) });
    }
    // +100 (gain, mint)
    const gp = FX.springU(t - (w(24, 2) + 0.05), 14, 0.45);
    if (gp > 0) { ctx.save(); ctx.translate(1420, 470); ctx.scale(Math.min(1.1, gp), Math.min(1.1, gp)); A.roundRect(ctx, -110, -52, 220, 104, 52); ctx.fillStyle = C.mint; ctx.fill(); lat(ctx, '+100', 0, 18, { size: 54, w: 700, color: C.ink, align: 'center' }); ctx.restore(); }
    K.cap(ctx, wl(24), 860, t, { color: SUB, size: 48, out: K.outAt(t, w(25, 0) - 0.25) });
    // expected 1,000 — struck through
    const ep = eo(t, w(25, 0), 0.4);
    if (ep > 0) { lat(ctx, '1,000', 520, 500, { size: 72, w: 300, color: SIL, align: 'center', alpha: ep }); txt(ctx, 'المتوقَّع', 520, 420, { size: 28, w: 'S', color: SIL, align: 'center', alpha: ep }); if (t > w(25, 2)) line(ctx, 'paper', [[440, 478], [600, 470]], { reveal: inv(w(25, 2), w(25, 2) + 0.3, t), width: 5, color: C.red, t, amp: 0.4 }); }
    K.cap(ctx, wl(25), 860, t, { color: SUB, size: 48 });
  } });

  // ================================================================ S11 — a mistake? → the US dollar rose → 700 USD × 1.57 ≈ 1,100 AUD (light)
  const S11 = { t0: S10.t1, t1: 90.92 };
  const CH0 = w(28, 2) - 0.1, EQ = [w(29, 1), w(29, 1) + 0.6, w(30, 1), w(30, 3)];
  const RATE = K.path([[0, 1.43], [0.3, 1.46], [0.55, 1.5], [0.75, 1.53], [1, 1.57]], 80, 23, 0.012);
  sfx(S11.t0 - 0.45, 'shutter', 0.18); sfx(w(26, 7), 'buzz', 0.1); sfx(w(26, 7) + 0.1, 'scribble', 0.1, { d: 0.5 });
  sfx(w(27, 0), 'whoosh', 0.14, { d: 0.5 }); sfx(CH0, 'scribble', 0.1, { d: 1.6 }); sfx(w(28, 9), 'tick', 0.12);
  EQ.forEach((e, i) => sfx(e, i === 3 ? 'slam' : 'pop', i === 3 ? 0.2 : 0.14, { f: 700 + i * 80 })); sfx(EQ[3] + 0.1, 'chime', 0.12);
  scene({ name: 'explain', t0: S11.t0, t1: S11.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    K.cap(ctx, wl(26, 0, 2).concat(wl(26, 5, 8)), 240, t, { out: K.outAt(t, w(27, 0) - 0.25) });
    K.cap(ctx, wl(27).concat(wl(28, 1, 5, { map: { 2: { color: C.ink, w: 'B' } } })), 240, t, { size: 52, out: K.outAt(t, w(29, 0) - 0.25) });
    K.cap(ctx, wl(29).concat(wl(30)), 240, t, { size: 50 });
    // receipt with a question mark → slides away
    const rv = eo(t, S11.t0, 0.5) * (1 - eio(t, w(27, 0) + 0.2, 0.5));
    if (rv > 0) {
      ctx.save(); ctx.globalAlpha = rv; ctx.translate(960 + (1 - rv) * -600, 0); const x = 760, y = 330;
      ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = hexA(C.ink, 0.5); ctx.lineWidth = 2; ctx.fillRect(x - 960, y, 400, 470); ctx.strokeRect(x - 960, y, 400, 470);
      txt(ctx, 'إيصال الصرف', x - 960 + 370, y + 60, { size: 30, w: 'B', color: C.ink });
      [['700 USD', 130], ['× 1.57', 200], ['1,100 AUD', 300]].forEach(([s, yy], i) => lat(ctx, s, x - 960 + 40, y + yy, { size: i === 2 ? 46 : 34, w: i === 2 ? 700 : 400, color: C.ink }));
      ctx.fillStyle = hexA(C.ink, 0.2); ctx.fillRect(x - 960 + 40, y + 240, 320, 2);
      ctx.restore();
      FX.scribbleCircle(ctx, 960 + 160 - (1 - rv) * 600, 330 + 285, 170, 60, inv(w(26, 7), w(26, 7) + 0.5, t) * rv, C.red, t);
      FX.kword(ctx, 'خطأ؟', 1500, 520, { size: 110, color: C.red, lt: t - w(26, 6), mode: 'bounce', out: K.outAt(t, w(27, 0), 0.3) });
    }
    // chart: USD/AUD rises from the first conversion to today
    const cp = eo(t, CH0 - 0.3, 0.5); const box = [360, 380, 1200, 380]; const fr = K.frame(box, 1.38, 1.62, RATE.length);
    if (cp > 0 && t < EQ[0] + 0.2) {
      ctx.save(); ctx.globalAlpha = 1 - eo(t, EQ[0] - 0.4, 0.5);
      K.axes(ctx, box, cp, { t, yl: 'USD/AUD', xl: 'الوقت' });
      const lp = inv(CH0, w(28, 9), t); const hd = K.priceLine(ctx, fr, RATE, lp, { color: C.ink, width: 3.4, head: 9, headColor: C.red });
      const a0 = eo(t, CH0 + 0.2, 0.4); ctx.fillStyle = C.ink; ctx.globalAlpha *= a0; ctx.beginPath(); ctx.arc(fr.X(0), fr.Y(RATE[0]), 9, 0, 6.283); ctx.fill();
      lat(ctx, '1.43', fr.X(0) + 16, fr.Y(RATE[0]) + 40, { size: 30, w: 700, color: C.ink }); txt(ctx, 'التحويل الأول', fr.X(0) + 20, fr.Y(RATE[0]) + 84, { size: 26, w: 'S', color: C.slate, align: 'left', dir: 'rtl' });
      if (lp >= 1) { lat(ctx, '1.57', hd[0] - 16, hd[1] - 24, { size: 34, w: 700, color: C.ink, align: 'right' }); txt(ctx, 'اليوم', hd[0] - 16, hd[1] - 66, { size: 26, w: 'S', color: C.slate }); }
      ctx.restore();
      const ua = eo(t, w(28, 2), 0.4) * (1 - eo(t, EQ[0] - 0.4, 0.5));
      if (ua > 0) { ctx.save(); ctx.globalAlpha = ua; ctx.fillStyle = C.mint; const ax = 1640, ay = 520; ctx.beginPath(); ctx.moveTo(ax, ay - 70); ctx.lineTo(ax - 30, ay - 26); ctx.lineTo(ax + 30, ay - 26); ctx.closePath(); ctx.fill(); ctx.fillRect(ax - 8, ay - 28, 16, 80); ctx.restore(); txt(ctx, 'الدولار يرتفع', 1640, 640, { size: 26, w: 'S', color: C.ink, align: 'center', alpha: ua }); }
    }
    // equation (numbers read left → right)
    if (t > EQ[0] - 0.2) {
      const items = [['700 USD', C.ink, 0], ['×', C.slate, 1], ['1.57', C.ink, 1], ['=', C.slate, 2], ['1,100 AUD', C.ink, 3]];
      ctx.save(); ctx.font = '300 92px IN'; const ws = items.map(([s]) => ctx.measureText(s).width + 40); ctx.restore(); const tot = ws.reduce((a, b) => a + b, 0); let x = 960 - tot / 2;
      items.forEach(([s, col, k], i) => { const p = FX.springU(t - EQ[k], 15, 0.5); if (p > 0) { ctx.save(); ctx.translate(x + ws[i] / 2, 600); const sc = Math.min(1.1, p); ctx.scale(sc, sc); lat(ctx, s, 0, 30, { size: 92, w: i === 4 ? 700 : 300, color: col, align: 'center' }); ctx.restore(); } x += ws[i]; });
      K.under(ctx, 960 + tot / 2 - 10, 960 + tot / 2 - ws[4] + 20, 668, inv(EQ[3] + 0.2, EQ[3] + 0.6, t), { t, color: C.mint, width: 6 });
      FX.note(ctx, 'قيمة أكبر', 960 + tot / 2 - ws[4] / 2 + 80, 760, { p: inv(EQ[3] + 0.3, EQ[3] + 0.9, t), size: 32, color: C.slate, w: 'S', t });
    }
  } });

  // ================================================================ S12 — John's loop · «وأنت أيضاً» (dark)
  const S12 = { t0: S11.t1, t1: 101.6 };
  const NODES = [{ s: '1,000 AUD', a: -Math.PI / 2 }, { s: '700 USD', a: Math.PI / 6 }, { s: '1,100 AUD', a: Math.PI * 5 / 6 }];
  const LOOP0 = w(32, 2), LOOP1 = we(33, 1);
  sfx(S12.t0 - 0.42, 'whip', 0.2); F.SHUTTER.push([S12.t0 - 0.42, S12.t0, 1.6 / 60]);
  NODES.forEach((n, i) => sfx(LOOP0 + i * 0.25, 'pop', 0.14, { f: 650 + i * 90 })); sfx(LOOP0 + 0.6, 'whoosh', 0.14, { d: 1.6 }); ksfx(w(32, 6), 'bounce', 0.2);
  sfx(w(33, 1), 'chime', 0.14); ksfx(w(34, 0), 'drop', 0.22);
  scene({ name: 'loop', t0: S12.t0, t1: S12.t1, ink: 'dark', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    K.cap(ctx, wl(31), 240, t, { color: SUB, out: K.outAt(t, w(32, 0) - 0.25) });
    K.cap(ctx, wl(32, 0, 5), 240, t, { color: SUB, out: K.outAt(t, w(34, 0) - 0.25) });
    // sad plane (holiday cancelled)
    const sp = eo(t, S12.t0, 0.4) * (1 - eo(t, LOOP0 - 0.3, 0.4)); if (sp > 0) { ctx.save(); ctx.globalAlpha = sp; plane(ctx, 960, 580, 3, 0.5, SIL); ctx.restore(); FX.cross(ctx, 960, 580, 200, sp, C.red, t); }
    // loop of conversions
    const shr = eio(t, w(34, 0) - 0.2, 0.6); const cx = lerp(960, 1420, shr), cy = lerp(580, 560, shr), R = lerp(230, 150, shr), sc = lerp(1, 0.66, shr);
    if (t > LOOP0 - 0.1) {
      const ap = eio(t, LOOP0 + 0.5, LOOP1 - LOOP0 - 0.5);
      ctx.save(); ctx.strokeStyle = hexA(C.white, 0.35); ctx.lineWidth = 2; ctx.setLineDash([10, 9]); ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + 6.283 * ap); ctx.stroke(); ctx.restore();
      K.snake(ctx, (tt) => { const a = -Math.PI / 2 + 6.283 * eio(tt, LOOP0 + 0.5, LOOP1 - LOOP0 - 0.5); return [cx + Math.cos(a) * R, cy + Math.sin(a) * R]; }, t, 12, 0.03, { r: 10 * sc, color: C.red });
      NODES.forEach((n, i) => { const p = FX.springU(t - (LOOP0 + i * 0.25), 14, 0.5); if (p <= 0) return; const x = cx + Math.cos(n.a) * R, y = cy + Math.sin(n.a) * R; ctx.save(); ctx.translate(x, y); ctx.scale(Math.min(1.08, p) * sc, Math.min(1.08, p) * sc); A.roundRect(ctx, -130, -40, 260, 80, 40); ctx.fillStyle = i === 2 ? C.mint : '#1E2024'; ctx.fill(); ctx.strokeStyle = i === 2 ? C.mint : hexA(C.white, 0.4); ctx.lineWidth = 2; ctx.stroke(); lat(ctx, n.s, 0, 13, { size: 34, w: 700, color: i === 2 ? C.ink : C.white, align: 'center' }); ctx.restore(); });
      const gp = FX.springU(t - (w(33, 1) + 0.05), 14, 0.5); if (gp > 0) { ctx.save(); ctx.translate(cx, cy); ctx.scale(Math.min(1.1, gp) * sc, Math.min(1.1, gp) * sc); lat(ctx, '+100', 0, 22, { size: 70, w: 700, color: C.mint, align: 'center' }); ctx.restore(); }
    }
    const fw = FX.kwidth('الفوركس', 120); FX.kword(ctx, 'الفوركس', 960 + fw / 2, 900, { size: 120, color: C.white, lt: t - w(32, 6), mode: 'bounce', out: K.outAt(t, w(34, 0) - 0.3, 0.35) });
    // «وأنت أيضاً»
    K.head(ctx, wl(34, 0, 1), 560, t, { size: 170, color: C.white, x: 1120 });
    K.dot(ctx, 1120 - K.wordsWidth(wl(34, 0, 1), { size: 170 }) - 40, 532, 26, t - (w(34, 1) + 0.35), { h0: 300 });
    K.cap(ctx, wl(34, 5, 7), 720, t, { color: SUB, size: 52, x: 1120 });
  } });

  // ================================================================ S13 — «ولكن ليس بهذه البساطة» · finish the whole curriculum (light)
  const S13 = { t0: S12.t1, t1: 107.56 };
  const NB = 20;
  sfx(S13.t0 - 0.45, 'shutter', 0.18); ksfx(w(35, 0), 'rise', 0.16); ksfx(w(36, 0), 'slam', 0.24); sfx(w(36, 2) + 0.2, 'scribble', 0.1, { d: 0.4 });
  for (let i = 0; i < NB; i += 2) sfx(w(37, 2) + i * 0.09, 'tick', 0.05, { f: 1800 + i * 80 }); sfx(w(37, 5), 'chime', 0.14);
  scene({ name: 'notsimple', t0: S13.t0, t1: S13.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    FX.kword(ctx, 'ولكن', 960 + FX.kwidth('ولكن', 64, 'R') / 2, 260, { size: 64, w: 'R', color: C.slate, lt: t - w(35, 0), mode: 'rise' });
    const mv = eio(t, w(37, 0) - 0.2, 0.5); const hw = K.wordsWidth(wl(36), { size: 150 });
    ctx.save(); ctx.translate(960, lerp(500, 400, mv)); ctx.scale(lerp(1, 0.7, mv), lerp(1, 0.7, mv)); ctx.translate(-960, 0);
    FX.kword(ctx, 'ليس بهذه البساطة', 960 + hw / 2, 0, { size: 150, color: C.ink, lt: t - w(36, 0), mode: 'slam' });
    K.under(ctx, 960 + hw / 2, 960 - hw / 2, 60, inv(w(36, 2) + 0.2, w(36, 2) + 0.6, t), { t, color: C.red, width: 6 });
    ctx.restore();
    // curriculum: 20 lessons, lesson 1 lit, the bar fills to 100%
    const ap = eo(t, w(37, 0) - 0.1, 0.4);
    if (ap > 0) {
      const bw = 64, g = 12, rowW = NB * bw + (NB - 1) * g, xr = 960 + rowW / 2, y = 660; const fill = eio(t, w(37, 2), we(37, 5) - w(37, 2));
      for (let i = 0; i < NB; i++) { const x = xr - (i + 1) * bw - i * g; const p = eo(t, w(37, 0) + i * 0.02, 0.3); const on = i === 0 || fill * NB > i; ctx.save(); ctx.globalAlpha = p; ctx.fillStyle = i === 0 ? C.red : on ? C.ink : '#FFFFFF'; ctx.strokeStyle = i === 0 ? C.red : hexA(C.ink, 0.35); ctx.lineWidth = 2; A.roundRect(ctx, x, y - bw / 2, bw, bw, 8); ctx.fill(); ctx.stroke(); lat(ctx, String(i + 1).padStart(2, '0'), x + bw / 2, y + 8, { size: 20, w: 700, color: on ? C.white : C.concrete, align: 'center' }); ctx.restore(); }
      lat(ctx, Math.round(fill * 100) + '%', xr - rowW, y - 70, { size: 34, w: 700, color: C.ink, alpha: ap });
      txt(ctx, 'المنهاج التعليمي', xr, y - 70, { size: 30, w: 'S', color: C.charcoal, alpha: ap });
      FX.check(ctx, xr - rowW - 60, y, 40, inv(we(37, 5) - 0.2, we(37, 5) + 0.2, t), C.mint, t);
    }
    K.cap(ctx, wl(37), 860, t, { color: C.ink, size: 54, w: 'S' });
  } });

  // ================================================================ S14 — start now: answer the questions below → unlock the next lesson (dark)
  const S14 = { t0: S13.t1, t1: 116.5 };
  const PICK = w(38, 4) + 0.2, DOWN = w(39, 3), UNL = w(40, 5);
  sfx(S14.t0 - 0.42, 'ripple', 0.2); ksfx(w(38, 0), 'slam', 0.22); sfx(PICK, 'click', 0.2); sfx(PICK + 0.1, 'tick', 0.12);
  [0, 1, 2].forEach((i) => sfx(DOWN + i * 0.32, 'bloop', 0.1)); sfx(UNL - 0.1, 'click', 0.16); sfx(UNL + 0.1, 'chime', 0.16);
  scene({ name: 'quiz', t0: S14.t0, t1: S14.t1, ink: 'dark', enter: { type: 'ripple', dur: 0.42, x: 960, y: 660 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    K.head(ctx, wl(38, 0, 1, { map: { 1: { color: C.red } } }), 300, t, { size: 120, color: C.white, mode: 'slam', out: K.outAt(t, w(40, 0) - 0.3) });
    K.cap(ctx, wl(38, 2, 4), 390, t, { color: SUB, size: 50, out: K.outAt(t, w(40, 0) - 0.3) });
    // quiz card
    const qp = eo(t, w(38, 2), 0.5) * (1 - eio(t, w(40, 0) - 0.2, 0.5));
    if (qp > 0) {
      const x = 560, y = 450; const yy = K.card(ctx, x, y, 800, 330, { p: qp, dark: true, chamfer: 36 }); ctx.save(); ctx.globalAlpha = qp;
      txt(ctx, 'ما هو الفوركس؟', x + 760, yy + 62, { size: 32, w: 'B', color: C.white });
      ['سوق الصرف الأجنبي', 'سوق الأسهم', 'سوق السلع'].forEach((o, i) => { const ry = yy + 130 + i * 64; const sel = i === 0 && t > PICK; ctx.strokeStyle = sel ? C.mint : hexA(C.white, 0.5); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x + 740, ry - 10, 14, 0, 6.283); ctx.stroke(); if (sel) { ctx.fillStyle = C.mint; ctx.beginPath(); ctx.arc(x + 740, ry - 10, 7, 0, 6.283); ctx.fill(); } txt(ctx, o, x + 710, ry, { size: 28, color: sel ? C.white : SUB }); });
      ctx.restore();
      const [cx, cy] = K.cursorAt(t, [[w(38, 2), 1300, 980], [PICK - 0.05, x + 744, yy + 128]]); FX.cursor(ctx, cx, cy, K.press(t, [PICK]), C.white);
    }
    // down arrow: questions are below the page
    const dp = eo(t, DOWN - 0.15, 0.3) * (1 - eo(t, w(40, 0) - 0.2, 0.4));
    if (dp > 0) { const b = Math.abs(Math.sin((t - DOWN) * 6)) * 26 * Math.exp(-(t - DOWN) * 0.5); ctx.save(); ctx.globalAlpha = dp; ctx.translate(1560, 640 + b); ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(34, 0); ctx.lineTo(0, 46); ctx.closePath(); ctx.fill(); ctx.fillRect(-9, -80, 18, 82); ctx.restore(); txt(ctx, 'أسفل الصفحة', 1560, 790, { size: 30, w: 'S', color: C.white, align: 'center', alpha: dp }); }
    K.cap(ctx, wl(39), 880, t, { color: SUB, size: 48, out: K.outAt(t, w(40, 0) - 0.3) });
    // unlock lesson 02
    const lp = eo(t, w(40, 0), 0.5);
    if (lp > 0) {
      const op = eio(t, UNL - 0.15, 0.4); const x = 960, y = 560;
      ctx.save(); ctx.globalAlpha = lp; ctx.strokeStyle = C.white; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x - 230, y - 80 - op * 40, 46, Math.PI, 0); ctx.lineTo(x - 230 + 46, y - 80 - op * 40 + (op > 0.5 ? 0 : 40)); ctx.moveTo(x - 230 - 46, y - 80 - op * 40); ctx.lineTo(x - 230 - 46, y - 40 - op * 40); ctx.stroke();
      ctx.fillStyle = op > 0.5 ? C.mint : C.white; A.roundRect(ctx, x - 300, y - 50, 140, 120, 14); ctx.fill(); ctx.restore();
      const np = FX.springU(t - (UNL + 0.1), 14, 0.5); if (np > 0) { ctx.save(); ctx.translate(x + 120, y + 40); ctx.scale(Math.min(1.1, np), Math.min(1.1, np)); lat(ctx, '02', 0, 0, { size: 200, w: 300, color: C.white, align: 'center', track: -4 }); ctx.restore(); }
      K.cap(ctx, wl(40), 300, t, { color: SUB, size: 54 });
    }
  } });

  // ================================================================ S15 — «مع آكسي / تداول بثقة.» (light end card)
  const S15 = { t0: S14.t1, t1: F.CLOSE };
  sfx(S15.t0 - 0.42, 'whip', 0.2); F.SHUTTER.push([S15.t0 - 0.42, S15.t0, 1.6 / 60]);
  ksfx(w(41, 0), 'drop', 0.16); ksfx(w(42, 0), 'drop', 0.24); sfx(w(42, 1) + 0.55, 'pop', 0.24, { f: 700 });
  scene({ name: 'endcard', t0: S15.t0, t1: S15.t1, ink: 'light', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    const L2 = 'تداول بثقة', s2 = 220, w2 = FX.kwidth(L2, s2), right = 960 + w2 / 2 + 20;
    K.words(ctx, wl(41), right, 400, t, { size: 110, color: C.ink, stagger: 0.035 });
    FX.kword(ctx, L2, right, 660, { size: s2, color: C.ink, lt: t - w(42, 0), mode: 'drop', stagger: 0.05 });
    K.dot(ctx, right - w2 - 44, 630, 30, t - (w(42, 1) + 0.25), { h0: 380 });
    K.under(ctx, right, right - w2, 760, inv(w(42, 1) + 0.2, w(42, 1) + 0.7, t), { t });
  } });

  F.addClose();
})(typeof window !== 'undefined' ? window : globalThis);
