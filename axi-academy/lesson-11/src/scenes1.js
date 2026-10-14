// Lesson 11 — Buy & sell prices. Part 1: title · the question · two price levels · prepare → execute · Ask / Bid · up or down → buy or sell.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT;
  const { W, H, C, clamp, lerp, inv, eo, ei, eio, hexA, txt, lat, measure, line } = A;
  const { w, we, wl, ph, sfx, ksfx, scene } = F;
  const SIL = C.silver, SUB = hexA(C.white, 0.72);

  F.chapters.push(
    { t: F.OFF, label: 'سعر الشراء والبيع' }, { t: ph(3), label: 'تنفيذ الصفقة' }, { t: ph(7), label: 'العرض والطلب' }, { t: ph(14), label: 'شراء أم بيع؟' },
    { t: ph(21), label: 'مثال: شراء آبل' }, { t: ph(31), label: 'مثال: البيع' }, { t: ph(38), label: 'الخلاصة' },
  );
  // driving cinematic minor: 124 BPM half-time, F minor (Fm9 · Dbmaj7 · Ab · Eb), FM plucks
  F.STYLE = { bpm: 124, chords: [[41, [63, 65, 67, 68, 72]], [37, [60, 61, 65, 68, 72]], [44, [60, 63, 68, 72, 75]], [39, [58, 63, 67, 70, 75]]], kit: 'half', pluck: 'fm', swing: 0.05, bass: [0, 0, 0, 1, 0, 0, 1, 0], arp: [0, 2, 1, 3, 2, 4, 3, 1], padcut: 1300 };
  F.MUSIC = [
    { t: 0, lvl: 1 }, { t: F.OFF, lvl: 2 }, { t: ph(3) - 0.3, lvl: 3 }, { t: ph(7) - 0.3, lvl: 2 }, { t: ph(10) - 0.3, lvl: 3 }, { t: ph(14) - 0.3, lvl: 2 },
    { t: ph(16) - 0.3, lvl: 3 }, { t: ph(17) - 0.3, lvl: 4 }, { t: ph(21) - 0.3, lvl: 2 }, { t: ph(25) - 0.3, lvl: 3 }, { t: ph(28) - 0.3, lvl: 4 },
    { t: ph(31) - 0.3, lvl: 2 }, { t: ph(33) - 0.3, lvl: 3 }, { t: ph(35) - 0.3, lvl: 4 }, { t: ph(38) - 0.3, lvl: 2 }, { t: ph(39) - 0.4, lvl: 3 }, { t: F.CLOSE, lvl: 1 },
  ];

  // ---------------------------------------------------------------- lesson helpers
  // trading button: kind 'buy' | 'sell', shows a price
  function tradeBtn(ctx, kind, x, y, price, p, o = {}) {
    if (p <= 0) return; const buy = kind === 'buy'; const s = o.s || 1; const sc = Math.min(1.08, p) * s;
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(p * 2) * (o.alpha == null ? 1 : o.alpha);
    A.roundRect(ctx, -160, -70, 320, 140, 20); ctx.fillStyle = buy ? C.carbon : C.red; ctx.fill(); if (o.glow) { ctx.strokeStyle = buy ? C.mint : C.white; ctx.lineWidth = 4; ctx.stroke(); }
    txt(ctx, buy ? 'شراء' : 'بيع', 130, -20, { size: 32, w: 'B', color: C.white }); lat(ctx, buy ? 'BUY' : 'SELL', -136, -22, { size: 20, w: 700, color: buy ? C.mint : hexA(C.white, 0.8), track: 2 });
    if (price != null) lat(ctx, price, 0, 46, { size: 46, w: 600, color: buy ? C.mint : C.white, align: 'center' });
    ctx.restore();
  }
  // order ticket card (dark glass): rows of [label, value]
  function ticket(ctx, x, y, wd, rows, p, t, o = {}) {
    const hh = 110 + rows.length * 74; const yy = K.card(ctx, x, y, wd, hh, { p, dark: !o.light, chamfer: 36 }); if (yy == null) return null;
    txt(ctx, o.title || 'أمر جديد', x + wd - 40, yy + 62, { size: 32, w: 'B', color: o.light ? C.ink : C.white });
    rows.forEach(([lab, val, tv, col], i) => {
      const ry = yy + 140 + i * 74; const rp = eo(t, tv == null ? 0 : tv, 0.3);
      txt(ctx, lab, x + wd - 40, ry, { size: 28, w: 'R', color: o.light ? C.slate : SUB });
      ctx.save(); ctx.globalAlpha = rp; ctx.fillStyle = o.light ? '#FFFFFF' : 'rgba(255,255,255,0.07)'; A.roundRect(ctx, x + 30, ry - 40, wd * 0.48, 56, 10); ctx.fill(); ctx.restore();
      if (typeof val === 'function') val(x + 50, ry, rp); else lat(ctx, val, x + 50, ry, { size: 30, w: 700, color: col || (o.light ? C.ink : C.white), alpha: rp });
    });
    return yy;
  }
  // typed text (reveals characters over d seconds)
  const typed = (s, t, t0, d) => s.slice(0, Math.round(s.length * clamp((t - t0) / d)));
  F.L11 = { tradeBtn, ticket, typed };

  // ================================================================ S1 — title card (dark): ▲▼ orbit «11»
  const S1 = { t0: 2.05, t1: 5.66 };
  sfx(2.1, 'whoosh', 0.16, { d: 0.6 }); for (let i = 0; i < 12; i += 3) sfx(2.2 + i * 0.06, 'pop', 0.08, { f: 700 + i * 40, pan: i % 2 ? 0.4 : -0.4 }); sfx(2.62, 'slam', 0.22); sfx(3.15, 'pop', 0.18, { f: 760 });
  scene({ name: 'title', t0: S1.t0, t1: S1.t1, ink: 'dark', enter: { type: 'bars', dur: 0.47 }, draw(ctx, t) {
    FX.bg(ctx, 'dark'); const cx = 960, cy = 520;
    for (let i = 0; i < 12; i++) {
      const r = A.rng(90 + i * 3); r(); const R = 230 + 150 * r(), sp = (0.3 + 0.4 * r()) * (i % 2 ? 1 : -1), a0 = r() * 6.283; const app = FX.springU(t - (2.2 + i * 0.06), 13, 0.5); if (app <= 0) continue;
      const a = a0 + t * sp; const x = cx + Math.cos(a) * R * Math.min(1, app), y = cy + Math.sin(a) * R * 0.45 * Math.min(1, app); const d = 0.55 + 0.45 * (Math.sin(a) + 1) / 2; const up = i % 2 === 0; const s = 16 * d;
      ctx.save(); ctx.globalAlpha = clamp((t - 2.2 - i * 0.06) * 5) * (0.35 + 0.65 * d); ctx.fillStyle = up ? C.mint : C.red; ctx.beginPath(); if (up) { ctx.moveTo(x, y - s); ctx.lineTo(x - s, y + s * 0.7); ctx.lineTo(x + s, y + s * 0.7); } else { ctx.moveTo(x, y + s); ctx.lineTo(x - s, y - s * 0.7); ctx.lineTo(x + s, y - s * 0.7); } ctx.closePath(); ctx.fill(); ctx.restore();
    }
    const hp = FX.springU(t - 2.62, 14, 0.5); if (hp > 0) { ctx.save(); ctx.translate(cx, cy + 60); const s = lerp(1.9, 1, Math.min(1, hp)); ctx.scale(s, s); lat(ctx, '11', 0, 0, { size: 240, w: 300, color: C.white, align: 'center', track: -6, alpha: clamp((t - 2.62) * 6) }); ctx.restore(); }
    FX.kword(ctx, 'الدرس الحادي عشر', 960 + FX.kwidth('الدرس الحادي عشر', 60, 'S') / 2, cy + 150, { size: 60, w: 'S', color: SUB, lt: t - 3.1, mode: 'rise' });
    K.dot(ctx, cx + 130, cy + 38, 20, t - 3.3, { h0: 300 });
  } });

  // ================================================================ S2 — «ما هو سعر الشراء والبيع؟» · the two levels on a price ladder (light)
  const S2 = { t0: S1.t1, t1: 14.22 };
  const LADDER = w(1, 2) - 0.1;
  sfx(S2.t0 - 0.42, 'ripple', 0.2); ksfx(w(0, 6), 'drop', 0.2); ksfx(w(0, 7), 'drop', 0.2); ksfx(we(0, 7) - 0.15, 'bounce', 0.2, 600);
  sfx(LADDER, 'whoosh', 0.14, { d: 0.5 }); sfx(w(1, 4) + 0.1, 'pop', 0.16, { f: 880, pan: 0.4 }); sfx(w(1, 6) + 0.1, 'pop', 0.16, { f: 560, pan: -0.4 }); sfx(w(2, 1), 'tick', 0.12);
  scene({ name: 'question', t0: S2.t0, t1: S2.t1, ink: 'light', enter: { type: 'ripple', dur: 0.42, x: 960, y: 520 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    K.cap(ctx, wl(0, 0, 4), 260, t, { size: 60, out: K.outAt(t, w(1, 0) - 0.25) });
    const mv = eio(t, w(1, 0) - 0.2, 0.6);
    // headline «سعر الشراء والبيع ؟»
    const hw = K.wordsWidth(wl(0, 5, 7), { size: 150 }); const qw = FX.kwidth('؟', 150);
    ctx.save(); ctx.translate(960, lerp(560, 300, mv)); ctx.scale(lerp(1, 0.6, mv), lerp(1, 0.6, mv)); ctx.translate(-960, 0);
    const L = K.words(ctx, wl(0, 5, 7, { map: { 7: { color: C.red } } }), 960 + (hw + qw + 20) / 2, 0, t, { size: 150, color: C.ink, stagger: 0.04 });
    FX.kword(ctx, '؟', L.left + 20 - 20, 0, { size: 150, color: C.red, lt: t - (we(0, 7) - 0.15), mode: 'bounce' }); ctx.restore();
    // price ladder with two levels
    const lp = eo(t, LADDER, 0.5);
    if (lp > 0) {
      ctx.save(); ctx.globalAlpha = lp; ctx.strokeStyle = hexA(C.ink, 0.5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(960, 400); ctx.lineTo(960, 900); ctx.stroke();
      for (let i = 0; i <= 10; i++) { const y = 410 + i * 48; ctx.beginPath(); ctx.moveTo(950, y); ctx.lineTo(970, y); ctx.stroke(); lat(ctx, (1.0880 - i * 0.0006).toFixed(4), 990, y + 7, { size: 18, w: 600, color: C.concrete }); }
      ctx.restore();
      const lev = (y, lab, col, tt) => { const p = eo(t, tt, 0.45); if (p <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(960 - 360 * p, y); ctx.lineTo(960, y); ctx.stroke(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(960, y, 9, 0, 6.283); ctx.fill(); ctx.restore(); txt(ctx, lab, 940 - 360, y - 16, { size: 34, w: 'B', color: col, align: 'left', dir: 'rtl', alpha: p }); };
      lev(554, 'سعر الشراء', C.ink, w(1, 4)); lev(746, 'سعر البيع', C.red, w(1, 6));
      K.chip(ctx, 'EUR/USD', 1500, 470, { p: eo(t, w(2, 1), 0.35), size: 26, fill: C.ink, stroke: C.ink, color: C.white, align: 'right' });
      K.cap(ctx, wl(2, 0, 3), 540, t, { size: 40, x: 1700, color: C.slate });
    }
  } });

  // ================================================================ S3 — prepare your trade → market reaches your price → executed (dark)
  const S3 = { t0: S2.t1, t1: 23.0 };
  const P3 = K.path([[0, 1.0872], [0.3, 1.0866], [0.55, 1.0861], [0.8, 1.0856], [1, 1.0850]], 60, 13, 0.0003); const EXE = w(6, 0) - 0.05;
  sfx(S3.t0 - 0.42, 'whip', 0.2); F.SHUTTER.push([S3.t0 - 0.42, S3.t0, 1.6 / 60]); sfx(w(4, 0), 'type', 0.12, { d: 1.0, n: 9 }); sfx(w(5, 0), 'scribble', 0.1, { d: 3.6 });
  sfx(EXE, 'impact', 0.2); sfx(EXE + 0.1, 'chime', 0.16);
  scene({ name: 'execute', t0: S3.t0, t1: S3.t1, ink: 'dark', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    K.cap(ctx, wl(3).concat(wl(4)), 230, t, { color: SUB, size: 56, out: K.outAt(t, w(5, 0) - 0.25) });
    K.cap(ctx, wl(5, 0, 11, { map: { 6: { color: C.white, w: 'B' }, 8: { color: C.white, w: 'B' } } }), 230, t, { color: SUB, size: 46, out: K.outAt(t, w(6, 0) - 0.25) });
    K.head(ctx, wl(6), 250, t, { size: 96, color: C.white });
    // ticket
    ticket(ctx, 1140, 330, 600, [['الأداة', 'EUR/USD', w(4, 0)], ['النوع', (x, y, a) => txt(ctx, 'شراء', x + 230, y, { size: 30, w: 'B', color: C.mint, align: 'right', alpha: a }), w(4, 0) + 0.3], ['السعر', (x, y, a) => lat(ctx, typed('1.0850', t, w(4, 1), 0.6), x, y, { size: 30, w: 700, color: C.white, alpha: a }), w(4, 1)]], eo(t, w(3, 0), 0.5), t);
    // chart: market price drifts down to the set level
    const box = [200, 360, 820, 420]; const fr = K.frame(box, 1.0845, 1.0876, P3.length); const cp = eo(t, w(5, 0) - 0.2, 0.4);
    if (cp > 0) {
      ctx.save(); ctx.globalAlpha = cp; K.axes(ctx, box, cp, { t, color: hexA(C.white, 0.5) });
      ctx.setLineDash([12, 9]); ctx.strokeStyle = C.mint; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(box[0], fr.Y(1.0850)); ctx.lineTo(box[0] + box[2], fr.Y(1.0850)); ctx.stroke(); ctx.setLineDash([]);
      txt(ctx, 'سعرك', box[0] + box[2] - 6, fr.Y(1.0850) + 34, { size: 26, w: 'S', color: C.mint });
      const hd = K.priceLine(ctx, fr, P3, inv(w(5, 0), EXE, t), { color: C.white, width: 3.2, head: 9, headColor: C.white });
      ctx.restore();
      K.burst(ctx, hd[0], hd[1], t, EXE, C.mint, 10, 90);
      if (t > EXE) { K.chip(ctx, 'تم التنفيذ', hd[0] - 10, hd[1] + 70, { p: eo(t, EXE, 0.35), size: 26, fill: C.mint, stroke: C.mint, color: C.ink, w: 'B', align: 'right' }); FX.check(ctx, hd[0] - 230, hd[1] + 70, 30, inv(EXE + 0.1, EXE + 0.4, t), C.mint, t); }
    }
  } });

  // ================================================================ S4 — Ask & Bid: you buy at the Ask, sell at the Bid (light)
  const S4 = { t0: S3.t1, t1: 36.2 };
  const ASK = w(8, 7), BID = w(9, 1), LBUY = w(11, 4), LSELL = w(13, 2);
  sfx(S4.t0 - 0.45, 'shutter', 0.18); sfx(ASK, 'pop', 0.18, { f: 900, pan: 0.4 }); sfx(BID, 'pop', 0.18, { f: 700, pan: -0.4 });
  sfx(LBUY - 0.1, 'whoosh', 0.14, { d: 0.35, pan: 0.4 }); sfx(LBUY + 0.2, 'click', 0.14, { pan: 0.4 }); sfx(LSELL - 0.1, 'whoosh', 0.14, { d: 0.35, pan: -0.4 }); sfx(LSELL + 0.2, 'click', 0.14, { pan: -0.4 });
  scene({ name: 'askbid', t0: S4.t0, t1: S4.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    K.cap(ctx, wl(7).concat(wl(8, 0, 5)), 230, t, { size: 52, out: K.outAt(t, w(10, 0) - 0.25) });
    K.cap(ctx, wl(10), 230, t, { size: 56 });
    const tq = Math.floor(t * 8) / 8; const jit = Math.round(Math.sin(tq * 5) * 1.5) * 0.0001;
    const box = (x, lab, la, price, tt, col) => { const p = FX.springU(t - tt, 14, 0.5); if (p <= 0) return; ctx.save(); ctx.translate(x, 470); ctx.scale(Math.min(1.08, p), Math.min(1.08, p)); ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = col; ctx.lineWidth = 3; A.roundRect(ctx, -250, -120, 500, 240, 24); ctx.fill(); ctx.stroke();
      txt(ctx, lab, 210, -60, { size: 40, w: 'B', color: col }); lat(ctx, la, -210, -62, { size: 26, w: 700, color: C.slate, track: 2 }); lat(ctx, price, 0, 70, { size: 84, w: 300, color: C.ink, align: 'center' }); ctx.restore(); };
    box(1300, 'سعر العرض', 'ASK', (1.0852 + jit).toFixed(4), ASK, C.ink); box(620, 'سعر الطلب', 'BID', (1.0850 + jit).toFixed(4), BID, C.red);
    // buttons attach under the boxes
    tradeBtn(ctx, 'buy', 1300, 780, null, FX.springU(t - LBUY, 14, 0.5), { glow: true }); tradeBtn(ctx, 'sell', 620, 780, null, FX.springU(t - LSELL, 14, 0.5), { glow: true });
    if (t > LBUY) FX.arrow(ctx, [1300, 700], [1300, 610], { p: inv(LBUY + 0.1, LBUY + 0.4, t), color: C.ink, t, bend: 0 });
    if (t > LSELL) FX.arrow(ctx, [620, 700], [620, 610], { p: inv(LSELL + 0.1, LSELL + 0.4, t), color: C.red, t, bend: 0 });
    K.cap(ctx, wl(11, 2, 5), 900, t, { size: 42, x: 1540, color: C.ink });
    K.cap(ctx, wl(13), 900, t, { size: 42, x: 840, color: C.ink });
  } });

  // ================================================================ S5 — expect up → buy · expect down → sell (dark fork)
  const S5 = { t0: S4.t1, t1: 51.2 };
  const P5 = K.path([[0, 50], [0.5, 54], [1, 52]], 40, 61, 1.0); const FORK = w(16, 7) - 0.2, UPA = w(16, 7), DNA = w(16, 10), BUY = w(18, 2), SELL = w(20, 2);
  sfx(S5.t0 - 0.42, 'ripple', 0.2); sfx(UPA, 'whoosh', 0.16, { d: 0.4, up: true }); sfx(DNA, 'whoosh', 0.16, { d: 0.4, up: false });
  ksfx(BUY, 'bounce', 0.24, 1300); sfx(BUY + 0.05, 'pop', 0.16, { f: 900 }); ksfx(SELL, 'drop', 0.24, 700); sfx(SELL + 0.25, 'pop', 0.16, { f: 420 });
  scene({ name: 'decide', t0: S5.t0, t1: S5.t1, ink: 'dark', enter: { type: 'ripple', dur: 0.42, x: 1300, y: 780 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    K.cap(ctx, wl(14).concat(wl(15)), 230, t, { color: SUB, size: 56, out: K.outAt(t, w(16, 0) - 0.25) });
    K.cap(ctx, wl(16, 0, 10, { map: { 7: { color: C.mint, w: 'B' }, 10: { color: C.red, w: 'B' } } }), 230, t, { color: SUB, size: 46, out: K.outAt(t, w(17, 0) - 0.25) });
    K.cap(ctx, wl(17).concat(wl(18)), 230, t, { color: SUB, size: 50, out: K.outAt(t, w(19, 0) - 0.25) });
    K.cap(ctx, wl(19).concat(wl(20)), 230, t, { color: SUB, size: 50 });
    // price arrives at the decision point
    const box = [200, 440, 700, 260]; const fr = K.frame(box, 44, 60, P5.length); const pp = eo(t, w(15, 0) - 0.2, 0.4);
    if (pp > 0) { const hd = K.priceLine(ctx, fr, P5, inv(w(15, 0), FORK, t), { color: C.white, width: 3.4, head: 12, headColor: C.white });
      const ax = hd[0], ay = hd[1];
      const up = eio(t, UPA, 0.6), dn = eio(t, DNA, 0.6);
      if (up > 0) { ctx.save(); ctx.strokeStyle = C.mint; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo(ax + 180, ay - 20, lerp(ax, ax + 420, up), lerp(ay, ay - 220, up)); ctx.stroke(); ctx.restore(); }
      if (dn > 0) { ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo(ax + 180, ay + 20, lerp(ax, ax + 420, dn), lerp(ay, ay + 220, dn)); ctx.stroke(); ctx.restore(); }
      FX.kword(ctx, 'ارتفاع', ax + 640, ay - 230, { size: 70, w: 'B', color: C.mint, lt: t - UPA, mode: 'rise' });
      FX.kword(ctx, 'انخفاض', ax + 640, ay + 260, { size: 70, w: 'B', color: C.red, lt: t - DNA, mode: 'rise' });
      tradeBtn(ctx, 'buy', ax + 820, ay - 230, null, FX.springU(t - BUY, 14, 0.5), { glow: true, s: 0.9 }); tradeBtn(ctx, 'sell', ax + 820, ay + 230, null, FX.springU(t - SELL, 14, 0.5), { glow: true, s: 0.9 });
    }
  } });
})(typeof window !== 'undefined' ? window : globalThis);
