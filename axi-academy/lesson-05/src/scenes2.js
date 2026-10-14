// Lesson 05 — Part 2: live candles (green up / red down) · wicks · many candles → the picture · bar chart · line chart · popularity vs style · two traders · data never lies · file + questions · end card.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT;
  const { W, H, C, clamp, lerp, inv, eo, ei, eio, hexA, txt, lat, measure, line } = A;
  const { w, we, wl, ph, sfx, ksfx, scene } = F;
  const SIL = C.silver, SUB = hexA(C.white, 0.72);
  const { stick, obar, icon } = F.L5;

  // ================================================================ S7 — live candles: closes above open → green; below → red (dark)
  const S7 = { t0: 54.48, t1: 65.25 };
  const LA = { t0: w(16, 1) - 0.2, t1: we(16, 9), x: 1200, o: 640, c: 430, seed: 3 }, LB = { t0: w(18, 1) - 0.2, t1: we(18, 4), x: 720, o: 450, c: 690, seed: 9 };
  const pAt = (L, tt) => { const u = clamp((tt - L.t0) / (L.t1 - L.t0)); const r = A.rng(L.seed); const ph1 = r() * 6, ph2 = r() * 6; return lerp(L.o, L.c, eio(u, 0, 1)) + Math.sin(u * 13 + ph1) * 36 * (1 - u) * Math.min(1, u * 4) + Math.sin(u * 29 + ph2) * 14 * (1 - u); };
  const live = (ctx, L, t, dark) => {
    if (t < L.t0) return; let hi = L.o, lo = L.o; const tt = Math.min(t, L.t1); for (let k = 0; k <= 40; k++) { const v = pAt(L, L.t0 + (tt - L.t0) * k / 40); hi = Math.min(hi, v); lo = Math.max(lo, v); }
    const cur = pAt(L, tt); stick(ctx, L.x, L.o, cur, hi - 8, lo + 8, 120, { wick: 7 });
    ctx.save(); ctx.setLineDash([8, 7]); ctx.strokeStyle = dark ? hexA(C.white, 0.4) : hexA(C.ink, 0.4); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L.x - 150, L.o); ctx.lineTo(L.x + 150, L.o); ctx.stroke(); ctx.restore();
    txt(ctx, 'الافتتاح', L.x + 160, L.o + 9, { size: 22, w: 'S', color: dark ? SIL : C.slate, align: 'left', dir: 'rtl' });
    if (t < L.t1) { ctx.fillStyle = dark ? C.white : C.ink; ctx.beginPath(); ctx.arc(L.x + 80, cur, 9, 0, 6.283); ctx.fill(); lat(ctx, '◀', L.x + 96, cur + 8, { size: 20, w: 400, color: dark ? C.white : C.ink }); }
  };
  sfx(S7.t0 - 0.42, 'ripple', 0.2); sfx(LA.t0, 'riser', 0.1, { d: LA.t1 - LA.t0 }); sfx(LA.t1, 'pop', 0.18, { f: 900, pan: 0.4 }); ksfx(w(17, 3), 'bounce', 0.2, 1200);
  sfx(LB.t0, 'whoosh', 0.12, { d: LB.t1 - LB.t0, up: false }); sfx(LB.t1, 'pop', 0.18, { f: 420, pan: -0.4 }); ksfx(w(19, 2), 'drop', 0.2, 700);
  scene({ name: 'live', t0: S7.t0, t1: S7.t1, ink: 'dark', enter: { type: 'ripple', dur: 0.42, x: 960, y: 600 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    K.cap(ctx, wl(16, 0, 6, { map: { 3: { color: C.white, w: 'B' } } }), 230, t, { color: SUB, size: 52, out: K.outAt(t, w(17, 0) - 0.25) });
    K.cap(ctx, wl(17, 0, 3, { map: { 3: { color: C.mint, w: 'B' } } }), 230, t, { color: SUB, size: 56, out: K.outAt(t, w(18, 0) - 0.25) });
    K.cap(ctx, wl(18, 0, 4, { map: { 3: { color: C.white, w: 'B' } } }), 230, t, { color: SUB, size: 52, out: K.outAt(t, w(19, 0) - 0.25) });
    K.cap(ctx, wl(19, 0, 2, { map: { 2: { color: C.red, w: 'B' } } }), 230, t, { color: SUB, size: 56 });
    live(ctx, LA, t, true); live(ctx, LB, t, true);
    K.chip(ctx, 'صاعدة', LA.x, 900, { p: eo(t, w(17, 3), 0.35), align: 'center', size: 28, fill: C.mint, stroke: C.mint, color: C.ink, w: 'B' });
    K.chip(ctx, 'هابطة', LB.x, 900, { p: eo(t, w(19, 2), 0.35), align: 'center', size: 28, fill: C.red, stroke: C.red, color: C.white, w: 'B' });
  } });

  // ================================================================ S8 — wicks = high & low · many candles combine into a clear picture (light)
  const S8 = { t0: S7.t1, t1: 77.7 };
  const MC = K.candles(K.path([[0, 50], [0.25, 56], [0.4, 53], [0.65, 64], [0.8, 61], [1, 72]], 30, 51, 1.8), 21, 1.6); const DROP = w(21, 1) - 0.1;
  sfx(S8.t0 - 0.45, 'shutter', 0.18); sfx(w(20, 1), 'scribble', 0.1, { d: 0.4 }); sfx(w(20, 2), 'scribble', 0.1, { d: 0.4 }); ksfx(w(20, 8), 'bounce', 0.2);
  for (let i = 0; i < 30; i += 3) sfx(DROP + i * 0.045 + 0.2, 'tick', 0.05, { f: 1800 + i * 40, pan: -0.6 + i * 0.04 }); sfx(w(22, 1), 'scribble', 0.1, { d: 1.0 }); sfx(w(22, 7), 'pop', 0.14, { f: 800 });
  scene({ name: 'wicks', t0: S8.t0, t1: S8.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    K.cap(ctx, wl(20, 0, 8, { map: { 1: { color: C.ink, w: 'B' }, 2: { color: C.ink, w: 'B' } } }), 230, t, { size: 50, out: K.outAt(t, w(21, 0) - 0.25) });
    K.cap(ctx, wl(21), 230, t, { size: 54, out: K.outAt(t, w(22, 0) - 0.25) });
    K.cap(ctx, wl(22, 0, 8, { map: { 2: { color: C.ink, w: 'B' } } }), 230, t, { size: 50 });
    // the two candles, wick tips circled
    const g = 1 - eio(t, DROP - 0.3, 0.5);
    if (g > 0) {
      ctx.save(); ctx.globalAlpha = g; stick(ctx, 1200, 640, 430, 380, 700, 120, { wick: 7 }); stick(ctx, 720, 450, 690, 420, 740, 120, { wick: 7 }); ctx.restore();
      [[1200, 380, w(20, 1)], [720, 420, w(20, 1) + 0.15], [1200, 700, w(20, 2)], [720, 740, w(20, 2) + 0.15]].forEach(([x, y, tt]) => FX.scribbleCircle(ctx, x, y, 40, 32, inv(tt, tt + 0.4, t) * g, C.red, t));
      FX.kword(ctx, 'ذيول', 960 + FX.kwidth('ذيول', 120) / 2, 600, { size: 120, color: C.ink, lt: t - w(20, 8), mode: 'bounce', alpha: g });
      if (t > w(20, 8) + 0.2) { FX.arrow(ctx, [1040, 520], [1170, 400], { p: inv(w(20, 8) + 0.2, w(20, 8) + 0.6, t) * g, color: C.slate, t }); FX.arrow(ctx, [880, 640], [750, 720], { p: inv(w(20, 8) + 0.3, w(20, 8) + 0.7, t) * g, color: C.slate, t }); }
    }
    // many candles drop into a chart
    if (t > DROP - 0.1) {
      const box = [330, 330, 1260, 520]; const fr = K.frame(box, 44, 78, MC.length);
      MC.forEach((c, i) => { const p = FX.springU(t - (DROP + i * 0.045), 15, 0.5); if (p <= 0) return; const dy = (1 - Math.min(1, p)) * -500; stick(ctx, fr.X(i), fr.Y(c.o) + dy, fr.Y(c.c) + dy, fr.Y(c.h) + dy, fr.Y(c.l) + dy, 26, { wick: 3, alpha: clamp((t - DROP - i * 0.045) * 6) }); });
      const tp = inv(w(22, 1), w(22, 3) + 0.3, t); if (tp > 0) line(ctx, 'paper', [[fr.X(0), fr.Y(48)], [fr.X(29), fr.Y(70)]], { reveal: tp, width: 4, color: C.slate, t, amp: 0.5 });
      K.chip(ctx, 'EUR/USD', 1560, 360, { p: eo(t, w(22, 7), 0.35), size: 24, fill: C.ink, stroke: C.ink, color: C.white, align: 'right' });
    }
  } });

  // ================================================================ S9 — bar chart = a thinner candle · line chart = the closes joined (dark)
  const S9 = { t0: S8.t1, t1: 90.62 };
  const LC = K.candles(K.path([[0, 50], [0.3, 57], [0.5, 53], [0.75, 63], [1, 68]], 12, 77, 2.2), 31, 1.4); const DOTS = w(27, 3), JOIN = w(28, 1) - 0.2, FADE = w(28, 2);
  sfx(S9.t0 - 0.42, 'whip', 0.2); F.SHUTTER.push([S9.t0 - 0.42, S9.t0, 1.6 / 60]); sfx(w(23, 3), 'stretch', 0.2); sfx(w(25, 1), 'pop', 0.14, { f: 760 });
  sfx(w(26, 0) - 0.2, 'whoosh', 0.16, { d: 0.5 }); for (let i = 0; i < 12; i += 2) sfx(DOTS + i * 0.04, 'tick', 0.06, { f: 2600 + i * 60 }); sfx(JOIN, 'scribble', 0.12, { d: 0.8 }); sfx(FADE, 'chime', 0.12);
  scene({ name: 'barline', t0: S9.t0, t1: S9.t1, ink: 'dark', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    const part2 = eio(t, w(26, 0) - 0.4, 0.5);
    if (part2 < 1) {
      ctx.save(); ctx.globalAlpha = 1 - part2;
      K.cap(ctx, wl(23, 0, 3, { map: { 3: { color: C.white, w: 'B' } } }), 230, t, { color: SUB, size: 56, out: K.outAt(t, w(24, 0) - 0.25) });
      K.cap(ctx, wl(24).concat(wl(25, 0, 4, { map: { 1: { color: C.white, w: 'B' } } })), 230, t, { color: SUB, size: 52 });
      // candle (right) and its thinner twin, the bar (left, morphs out of a copy)
      stick(ctx, 1160, 700, 430, 360, 780, 140, { wick: 8 });
      const m = eio(t, w(23, 3) - 0.1, 0.8); const bw = lerp(140, 0, m);
      if (m < 1) stick(ctx, 760, 700, 430, 360, 780, Math.max(1, bw), { wick: 8, alpha: 1 });
      if (m > 0) obar(ctx, 760, 700, 430, 360, 780, 46 * m, C.mint, m);
      txt(ctx, 'شمعة', 1160, 870, { size: 36, w: 'S', color: C.white, align: 'center', alpha: eo(t, w(23, 3), 0.4) });
      txt(ctx, 'شريط', 760, 870, { size: 36, w: 'S', color: C.white, align: 'center', alpha: eo(t, w(23, 3) + 0.4, 0.4) });
      lat(ctx, 'OHLC', 760, 920, { size: 22, w: 600, color: SIL, align: 'center', alpha: eo(t, w(25, 1), 0.4) });
      FX.note(ctx, 'أنحف', 960 + 60, 560, { p: inv(w(25, 1), w(25, 1) + 0.5, t), size: 34, color: SIL, w: 'S', t, to: [800, 560], from: [930, 576], bend: 0.2 });
      ctx.restore();
    }
    if (part2 > 0) {
      ctx.save(); ctx.globalAlpha = part2;
      K.cap(ctx, wl(26).concat(wl(27, 0, 5, { map: { 3: { color: C.white, w: 'B' } } })), 230, t, { color: SUB, size: 50, out: K.outAt(t, w(28, 0) - 0.25) });
      K.head(ctx, wl(28), 230, t, { size: 76, color: C.white });
      const box = [360, 330, 1200, 480]; const fr = K.frame(box, 44, 74, LC.length); const fd = 1 - eo(t, FADE, 0.6) * 0.85;
      LC.forEach((c, i) => stick(ctx, fr.X(i), fr.Y(c.o), fr.Y(c.c), fr.Y(c.h), fr.Y(c.l), 44, { wick: 4, alpha: fd }));
      LC.forEach((c, i) => { const p = eo(t, DOTS + i * 0.04, 0.25); if (p > 0) { ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(fr.X(i), fr.Y(c.c), 9 * p, 0, 6.283); ctx.fill(); } });
      const jp = eio(t, JOIN, 0.9); if (jp > 0) { const pts = LC.map((c, i) => [fr.X(i), fr.Y(c.c)]); const sub = A.subPath(pts, 0, jp); ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 5; ctx.lineJoin = 'round'; A.tracePts(ctx, sub); ctx.stroke(); ctx.restore(); }
      FX.note(ctx, 'سعر الإغلاق', fr.X(11) + 40, fr.Y(LC[11].c) - 60, { p: inv(DOTS + 0.4, DOTS + 1.0, t), size: 30, color: SIL, w: 'S', t, to: [fr.X(11) + 6, fr.Y(LC[11].c) - 14], from: [fr.X(11) + 20, fr.Y(LC[11].c) - 50], bend: -0.3 });
      ctx.restore();
    }
  } });

  // ================================================================ S10 — some are more popular · none is guaranteed best · it depends on your style (light)
  const S10 = { t0: S9.t1, t1: 103.85 };
  const POP = [0.55, 0.32, 0.86]; const EQ = w(30, 4), STY = w(32, 4);
  sfx(S10.t0 - 0.45, 'shutter', 0.18); POP.forEach((v, i) => sfx(w(29, 6) + i * 0.12, 'tick', 0.1, { f: 2000 + v * 2000 })); sfx(EQ, 'whoosh', 0.14, { d: 0.4 }); sfx(EQ + 0.3, 'chime', 0.12);
  ksfx(STY, 'bounce', 0.24); sfx(STY + 0.5, 'pop', 0.2, { f: 700 });
  scene({ name: 'popular', t0: S10.t0, t1: S10.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    K.cap(ctx, wl(29, 0, 8, { map: { 6: { color: C.ink, w: 'B' } } }), 230, t, { size: 52, out: K.outAt(t, w(30, 0) - 0.25) });
    K.cap(ctx, wl(30).concat(wl(31, 0, 3, { map: { 1: { color: C.ink, w: 'B' } } })), 230, t, { size: 50, out: K.outAt(t, w(32, 0) - 0.25) });
    const up = eio(t, STY - 0.5, 0.6);
    ctx.save(); ctx.translate(0, lerp(0, -40, up)); const sc = lerp(1, 0.6, up); ctx.translate(960, 560); ctx.scale(sc, sc); ctx.translate(-960, -560);
    [['line', 'خطي'], ['bar', 'شريطي'], ['candle', 'شموع']].forEach(([k, lab], i) => {
      const x = 960 + (1 - i) * 380, y = 520; const p = eo(t, S10.t0 + i * 0.12, 0.4); if (p <= 0) return;
      ctx.save(); ctx.globalAlpha = p; ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = hexA(C.slate, 0.5); ctx.lineWidth = 1.6; A.roundRect(ctx, x - 160, y - 150, 320, 300, 20); ctx.fill(); ctx.stroke(); icon(ctx, k, x, y - 30, 1.4, C.ink); txt(ctx, lab, x, y + 110, { size: 38, w: 'S', color: C.ink, align: 'center' });
      // popularity bar → all equal on «واحد»
      const pv = lerp(POP[i] * eo(t, w(29, 6) + i * 0.12, 0.6), 0.6, eio(t, EQ, 0.5)); ctx.fillStyle = hexA(C.slate, 0.2); ctx.fillRect(x - 130, y + 180, 260, 14); ctx.fillStyle = i === 2 && t < EQ ? C.red : C.ink; ctx.fillRect(x + 130 - 260 * pv, y + 180, 260 * pv, 14); ctx.restore();
      if (i < 2) lat(ctx, '=', x - 190, y + 20, { size: 70, w: 300, color: C.ink, align: 'center', alpha: eo(t, EQ + 0.2, 0.3) });
    });
    ctx.restore();
    txt(ctx, 'الشعبية', 1480, 740, { size: 26, w: 'S', color: C.slate, alpha: eo(t, w(29, 6), 0.3) * (1 - up) });
    // it depends on YOUR style
    K.cap(ctx, wl(32, 0, 3), 700, t, { size: 56, color: C.slate });
    const sw = FX.kwidth('أسلوبك', 200); FX.kword(ctx, 'أسلوبك', 960 + sw / 2, 900, { size: 200, color: C.ink, lt: t - STY, mode: 'bounce' });
    K.dot(ctx, 960 - sw / 2 - 40, 872, 26, t - (STY + 0.45), { h0: 300 });
  } });

  // ================================================================ S11 — two traders: closes → line chart · price action → candles (dark split)
  const S11 = { t0: S10.t1, t1: 116.62 };
  sfx(S11.t0 - 0.42, 'ripple', 0.2); sfx(w(33, 0), 'pop', 0.16, { f: 760, pan: 0.5 }); sfx(w(34, 1), 'whoosh', 0.14, { d: 0.4, pan: 0.5 }); sfx(w(34, 3), 'pop', 0.16, { f: 900, pan: 0.5 });
  sfx(w(35, 1), 'pop', 0.16, { f: 700, pan: -0.5 }); sfx(w(36, 1), 'whoosh', 0.14, { d: 0.4, pan: -0.5 }); sfx(w(36, 2), 'pop', 0.16, { f: 900, pan: -0.5 });
  const person = (ctx, x, y, s, col, p) => { if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s * Math.min(1.1, p), s * Math.min(1.1, p)); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, -46, 20, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.moveTo(-34, 14); ctx.quadraticCurveTo(-32, -20, 0, -20); ctx.quadraticCurveTo(32, -20, 34, 14); ctx.closePath(); ctx.fill(); ctx.restore(); };
  scene({ name: 'traders', t0: S11.t0, t1: S11.t1, ink: 'dark', enter: { type: 'ripple', dur: 0.42, x: 960, y: 900 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    const side = (cx, tP, tA, tR, lab, kind, res) => {
      const p = FX.springU(t - tP, 14, 0.5); if (p <= 0) return;
      ctx.save(); ctx.globalAlpha = clamp((t - tP) * 5); ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.strokeStyle = hexA(C.white, 0.25); ctx.lineWidth = 1.5; A.roundRect(ctx, cx - 380, 300, 760, 600, 24); ctx.fill(); ctx.stroke(); ctx.restore();
      person(ctx, cx, 450, 1.6, C.white, p); txt(ctx, lab, cx, 540, { size: 34, w: 'S', color: C.white, align: 'center', alpha: clamp((t - tP - 0.2) * 4) });
      const ap = eo(t, tA, 0.4); if (ap > 0) { ctx.save(); ctx.globalAlpha = ap; ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(cx, 640); ctx.lineTo(cx - 18, 610); ctx.lineTo(cx + 18, 610); ctx.closePath(); ctx.fill(); ctx.fillRect(cx - 4, 570, 8, 42); ctx.restore(); }
      const rp = FX.springU(t - tR, 14, 0.5); if (rp > 0) { icon(ctx, kind, cx, 740, 1.5 * Math.min(1.08, rp), C.white); txt(ctx, res, cx, 860, { size: 38, w: 'B', color: C.white, align: 'center', alpha: clamp((t - tR) * 4) }); }
    };
    side(1400, w(33, 0), w(34, 1), w(34, 3), 'التركيز على أسعار الإغلاق', 'line', 'الرسم الخطي');
    side(520, w(35, 0), w(36, 1), w(36, 2), 'تحليل حركة السعر', 'candle', 'الشموع اليابانية');
    K.cap(ctx, wl(33, 0, 2), 230, t, { color: SUB, size: 52, out: K.outAt(t, w(35, 0) - 0.25) });
    K.cap(ctx, wl(35, 0, 2), 230, t, { color: SUB, size: 52 });
  } });

  // ================================================================ S12 — same data, any view · data never lies · it's how you read it (light)
  const S12 = { t0: S11.t1, t1: 128.5 };
  const DC = K.candles(K.path([[0, 50], [0.3, 58], [0.5, 54], [0.75, 64], [1, 69]], 18, 91, 2.0), 37, 1.4);
  const V1 = w(37, 3), V2 = w(37, 5), V3 = w(37, 7); const LIE = w(38, 1), INT = w(40, 2);
  sfx(S12.t0 - 0.45, 'shutter', 0.18); [V1, V2, V3].forEach((v) => sfx(v - 0.05, 'whoosh', 0.12, { d: 0.3 })); ksfx(LIE, 'slam', 0.24); sfx(INT - 0.2, 'whoosh', 0.14, { d: 0.6 });
  scene({ name: 'data', t0: S12.t0, t1: S12.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    K.cap(ctx, wl(37), 230, t, { size: 50, out: K.outAt(t, w(38, 0) - 0.25) });
    const box = [400, 380, 1120, 420]; const fr = K.frame(box, 44, 74, DC.length);
    // view: 0 candles → 1 bars → 2 line (morph between)
    const a = eio(t, V2, 0.35), b = eio(t, V3, 0.35);
    DC.forEach((c, i) => { const bw = 40 * (1 - a); if (b < 1) { if (a < 1) stick(ctx, fr.X(i), fr.Y(c.o), fr.Y(c.c), fr.Y(c.h), fr.Y(c.l), Math.max(1, bw), { wick: 4, alpha: 1 - b }); if (a > 0) obar(ctx, fr.X(i), fr.Y(c.o), fr.Y(c.c), fr.Y(c.h), fr.Y(c.l), 16 * a, c.c >= c.o ? C.mint : C.red, a * (1 - b)); } });
    if (b > 0) { const pts = DC.map((c, i) => [fr.X(i), fr.Y(c.c)]); ctx.save(); ctx.globalAlpha = b; ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.lineJoin = 'round'; A.tracePts(ctx, A.subPath(pts, 0, b)); ctx.stroke(); ctx.restore(); }
    const lab = t < V2 ? 'شموع' : t < V3 ? 'شريطي' : 'خطي'; K.chip(ctx, lab, 1520, 360, { p: eo(t, V1, 0.3), size: 26, fill: C.ink, stroke: C.ink, color: C.white, w: 'S', align: 'right' });
    lat(ctx, 'EUR/USD · H1', 400, 360, { size: 22, w: 600, color: C.slate, alpha: eo(t, V1, 0.3) });
    // «البيانات لا تكذب أبداً»
    const hw = K.wordsWidth(wl(38, 1, 4), { size: 110 }); ctx.save(); ctx.globalAlpha = 1 - eo(t, w(39, 0) - 0.2, 0.4) * 0.0; ctx.restore();
    K.head(ctx, wl(38, 1, 4, { map: { 3: { color: C.red } } }), 250, t, { size: 110, color: C.ink, mode: 'slam', out: K.outAt(t, w(39, 0) - 0.25) }); void hw;
    // interpretation: magnifier over the chart
    const mp = eo(t, INT - 0.3, 0.5);
    if (mp > 0) {
      const u = eio(t, INT, 2.2); const lx = lerp(520, 1400, u), ly = fr.Y(58) + Math.sin(u * 7) * 40; const R = 110 * mp;
      ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(lx, ly, R, 0, 6.283); ctx.stroke(); ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(lx + R * 0.72, ly + R * 0.72); ctx.lineTo(lx + R * 1.3, ly + R * 1.3); ctx.stroke(); ctx.restore();
      K.cap(ctx, wl(39).concat(wl(40, 0, 2, { map: { 1: { color: C.ink, w: 'B' }, 2: { color: C.ink, w: 'B' } } })), 250, t, { size: 56 });
      FX.note(ctx, 'التفسير', lx + R + 160, ly - R - 10, { p: inv(INT + 0.2, INT + 0.7, t), size: 34, color: C.red, w: 'S', t });
    }
  } });

  // ================================================================ S13 — review the attached file · answer the questions below (dark)
  const S13 = { t0: S12.t1, t1: 138.45 };
  const PICK = w(42, 4) + 0.15, DOWN = w(43, 1);
  sfx(S13.t0 - 0.42, 'whip', 0.2); F.SHUTTER.push([S13.t0 - 0.42, S13.t0, 1.6 / 60]); sfx(w(41, 2), 'whoosh', 0.14, { d: 0.4, up: false }); sfx(w(41, 2) + 0.3, 'impact', 0.12);
  [0, 1, 2].forEach((i) => sfx(w(41, 9) + i * 0.15, 'pop', 0.12, { f: 700 + i * 90 })); sfx(PICK, 'click', 0.18); sfx(PICK + 0.1, 'tick', 0.12); [0, 1, 2].forEach((i) => sfx(DOWN + i * 0.32, 'bloop', 0.1));
  scene({ name: 'file', t0: S13.t0, t1: S13.t1, ink: 'dark', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    K.cap(ctx, wl(41, 0, 4), 230, t, { color: SUB, size: 52, out: K.outAt(t, w(41, 5) - 0.25) });
    K.cap(ctx, wl(41, 5, 12, { map: { 9: { color: C.white, w: 'B' } } }), 230, t, { color: SUB, size: 50, out: K.outAt(t, w(42, 0) - 0.25) });
    // document
    const dp = FX.springU(t - (w(41, 2) - 0.1), 13, 0.5); const gone = eio(t, w(42, 0) - 0.3, 0.5);
    if (dp > 0 && gone < 1) {
      ctx.save(); ctx.translate(lerp(960, 420, gone), 560 - (1 - Math.min(1, dp)) * 500); ctx.scale(1 - gone * 0.4, 1 - gone * 0.4); ctx.globalAlpha = 1 - gone * 0.7;
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.moveTo(-200, -260); ctx.lineTo(140, -260); ctx.lineTo(200, -200); ctx.lineTo(200, 260); ctx.lineTo(-200, 260); ctx.closePath(); ctx.fill();
      ctx.fillStyle = C.red; A.roundRect(ctx, -170, -230, 90, 44, 8); ctx.fill(); lat(ctx, 'PDF', -125, -199, { size: 24, w: 800, color: C.white, align: 'center' });
      txt(ctx, 'أنواع الرسوم البيانية', 170, -140, { size: 30, w: 'B', color: C.ink });
      ['line', 'bar', 'candle'].forEach((k, i) => { const p = eo(t, w(41, 9) + i * 0.15, 0.3); if (p > 0) { ctx.save(); ctx.globalAlpha *= p; icon(ctx, k, 110 - i * 110, -40, 0.75, C.ink); ctx.restore(); } });
      for (let i = 0; i < 5; i++) { ctx.fillStyle = hexA(C.ink, 0.16); ctx.fillRect(170 - (300 - (i % 2) * 60), 50 + i * 36, 300 - (i % 2) * 60, 10); }
      ctx.restore();
    }
    // quiz card + down arrow
    const qp = eo(t, w(42, 0) - 0.1, 0.5);
    if (qp > 0) {
      const x = 700, y = 330; const yy = K.card(ctx, x, y, 860, 360, { p: qp, dark: true, chamfer: 36 });
      txt(ctx, 'أيّ رسم يعتمد على سعر الإغلاق فقط؟', x + 820, yy + 64, { size: 30, w: 'B', color: C.white });
      ['الشموع اليابانية', 'الرسم الخطي', 'الرسم الشريطي'].forEach((o, i) => { const ry = yy + 136 + i * 66; const sel = i === 1 && t > PICK; ctx.strokeStyle = sel ? C.mint : hexA(C.white, 0.5); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x + 800, ry - 10, 14, 0, 6.283); ctx.stroke(); if (sel) { ctx.fillStyle = C.mint; ctx.beginPath(); ctx.arc(x + 800, ry - 10, 7, 0, 6.283); ctx.fill(); } txt(ctx, o, x + 770, ry, { size: 28, color: sel ? C.white : SUB }); });
      const [cx, cy] = K.cursorAt(t, [[w(42, 0), 1500, 1000], [PICK - 0.05, x + 804, yy + 192]]); FX.cursor(ctx, cx, cy, K.press(t, [PICK]), C.white);
      K.cap(ctx, wl(42), 250, t, { color: SUB, size: 54 });
    }
    const da = eo(t, DOWN - 0.15, 0.3); if (da > 0) { const b = Math.abs(Math.sin((t - DOWN) * 6)) * 24; ctx.save(); ctx.globalAlpha = da; ctx.translate(1130, 790 + b); ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.lineTo(0, 40); ctx.closePath(); ctx.fill(); ctx.fillRect(-8, -60, 16, 62); ctx.restore(); }
    K.cap(ctx, wl(43), 900, t, { color: C.white, size: 50, w: 'S' });
  } });

  // ================================================================ S14 — «ونراكم في / الدرس القادم.» (light end card)
  const S14 = { t0: S13.t1, t1: F.CLOSE };
  sfx(S14.t0 - 0.42, 'whip', 0.2); F.SHUTTER.push([S14.t0 - 0.42, S14.t0, 1.6 / 60]); ksfx(w(44, 0), 'drop', 0.16); ksfx(w(44, 2), 'drop', 0.24); sfx(w(44, 3) + 0.62, 'pop', 0.24, { f: 700 }); sfx(w(45, 0), 'scribble', 0.1, { d: 0.7 });
  scene({ name: 'endcard', t0: S14.t0, t1: S14.t1, ink: 'light', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    const L2 = 'الدرس القادم', s2 = 230, w2 = FX.kwidth(L2, s2), right = 960 + w2 / 2 + 20;
    K.words(ctx, wl(44, 0, 1), right, 400, t, { size: 110, color: C.ink, stagger: 0.035 });
    FX.kword(ctx, L2, right, 660, { size: s2, color: C.ink, lt: t - w(44, 2), mode: 'drop', stagger: 0.05 });
    const dx = right - w2 - 44; K.dot(ctx, dx, 630, 30, t - (w(44, 3) + 0.3), { h0: 380 });
    FX.note(ctx, 'إن شاء الله', dx + 150, 820, { p: inv(w(45, 0), w(45, 2) + 0.3, t), size: 36, color: C.slate, w: 'S', align: 'right', to: [dx + 6, 676], from: [dx + 30, 790], bend: -0.4, t });
    K.under(ctx, right, right - w2, 760, inv(w(44, 3) + 0.2, w(44, 3) + 0.7, t), { t });
  } });

  F.addClose();
})(typeof window !== 'undefined' ? window : globalThis);
