// Act II — what a strategy contains · goals · entry rules (simple → complex) · think twice · exits (three ways, scenarios, resistance, trailing) · clarity.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT;
  const { W, H, C, clamp, lerp, inv, eo, ei, eio, hexA, txt, lat, measure, line } = A;
  const { w, we, wl, sfx, ksfx, scene, marks } = F;
  const SIL = C.silver, SUB = hexA(C.white, 0.72);
  // centred caption row
  const cap = (ctx, words, y, t, o = {}) => {
    const sz = o.size || 56, wt = o.w || 'R'; const cw = K.wordsWidth(words, { size: sz, w: wt });
    return K.words(ctx, words, o.x == null ? 960 + cw / 2 : o.x, y, t, { size: sz, w: wt, color: o.color || C.slate, mode: o.mode || 'rise', stagger: o.stagger == null ? 0.02 : o.stagger, out: o.out });
  };
  const outAt = (t, t0, d = 0.45) => clamp((t - t0) / d);
  // cursor path through waypoints [[t, x, y, press?]]
  function cursorAt(t, pts) {
    if (t <= pts[0][0]) return [pts[0][1], pts[0][2], 0];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i]; if (t <= b[0]) { const e = eio(t, a[0], b[0] - a[0]); return [lerp(a[1], b[1], e), lerp(a[2], b[2], e), 0]; }
    }
    const l = pts[pts.length - 1]; return [l[1], l[2], 0];
  }
  const press = (t, clicks) => clicks.reduce((m, c) => Math.max(m, Math.exp(-Math.pow((t - c) / 0.07, 2))), 0);

  // ================================================================ T1 — «ما الذي تتضمّنه استراتيجية التداول؟» → building blocks (dark)
  const T1 = { t0: F.S.ACT1_END, t1: 88.62 };
  const BLOCKS = ['الأهداف', 'الدخول', 'الخروج', 'الوقت', 'المخاطرة', 'الأسواق', 'التحليل'];
  const BT = w(37, 3) - 0.1; // «يدخل»
  sfx(T1.t0 - 0.4, 'whip', 0.2); F.SHUTTER.push([T1.t0 - 0.42, T1.t0, 1.6 / 60]);
  ksfx(w(35, 3), 'drop', 0.2); sfx(w(36, 5) + 0.05, 'scribble', 0.1, { d: 0.5 }); sfx(w(36, 5) + 0.1, 'tick', 0.1);
  BLOCKS.forEach((b, i) => sfx(BT + i * 0.11 + 0.2, 'pop', 0.11, { f: 600 + i * 70, pan: 0.5 - (i % 4) * 0.33 }));
  scene({ name: 'anatomy', t0: T1.t0, t1: T1.t1, ink: 'dark', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    cap(ctx, wl(35, 0, 2), 240, t, { color: SUB, out: outAt(t, w(36, 0) - 0.3) });
    cap(ctx, wl(36, 0, 2), 240, t, { color: SUB, out: outAt(t, w(37, 0) - 0.3) });
    cap(ctx, wl(37), 240, t, { color: SUB });
    // title, moves up when the blocks arrive
    const mv = eio(t, BT - 0.5, 0.6); const tw = K.wordsWidth(wl(35, 3, 4), { size: 140 });
    ctx.save(); ctx.translate(960, lerp(520, 410, mv)); ctx.scale(lerp(1, 0.72, mv), lerp(1, 0.72, mv)); ctx.translate(-960, 0);
    const L = K.words(ctx, wl(35, 3, 4), 960 + tw / 2, 0, t, { size: 140, color: C.white, stagger: 0.04 });
    K.under(ctx, 960 + tw / 2, 960 - tw / 2, 70, inv(w(36, 5), w(36, 5) + 0.45, t), { t, color: SIL });
    ctx.restore();
    FX.note(ctx, 'مهمة', 960 - tw / 2 - 24, lerp(520, 410, mv) - 70, { p: inv(w(36, 5), w(36, 5) + 0.5, t), size: 34, color: SIL, w: 'S', t, alpha: 1 - mv });
    // seven blocks (roadmap of the lesson)
    const bw = 300, bh = 104, g = 24;
    BLOCKS.forEach((b, i) => {
      const row = i < 4 ? 0 : 1; const n = row ? 3 : 4; const k = row ? i - 4 : i; const rowW = n * bw + (n - 1) * g;
      const x = 960 + rowW / 2 - k * (bw + g) - bw; const y = 560 + row * (bh + 26);
      const p = FX.springU(t - (BT + i * 0.11), 15, 0.5); if (p <= 0) return;
      ctx.save(); ctx.translate(x + bw / 2, y + bh / 2 - (1 - p) * 300); ctx.rotate((1 - Math.min(1, p)) * (i % 2 ? 0.3 : -0.25)); ctx.globalAlpha = clamp((t - BT - i * 0.11) * 6);
      ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(-bw / 2, -bh / 2, bw, bh); ctx.strokeStyle = hexA(C.white, 0.55); ctx.lineWidth = 1.6; ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);
      txt(ctx, b, bw / 2 - 26, 14, { size: 36, w: 'S', color: C.white }); lat(ctx, String(i + 1).padStart(2, '0'), -bw / 2 + 20, 10, { size: 20, w: 600, color: i < 3 ? C.red : SIL, align: 'left' });
      ctx.restore();
    });
    marks(ctx, 'dark');
  } });

  // ================================================================ T2 — goals: the easy part (target) vs the hard part (the path) (light)
  const T2 = { t0: T1.t1, t1: 98.62 };
  const TX = 520, TY = 600;
  const pathPts = (() => { const pts = []; const r = A.rng(5); for (let i = 0; i <= 120; i++) { const u = i / 120; const x = lerp(1560, TX + 40, u); const y = TY + 210 * Math.sin(u * Math.PI * 2.2) * (1 - u) + (i % 2 ? 16 : -16) * (1 - u * 0.8) + (r() - 0.5) * 10; pts.push([x, y]); } return pts; })();
  sfx(T2.t0 - 0.45, 'shutter', 0.18); ksfx(w(38, 1), 'drop', 0.16);
  sfx(w(39, 0) + 0.05, 'charge', 0.1, { d: 0.5 }); sfx(w(39, 1) + 0.15, 'impact', 0.2); ksfx(w(40, 2), 'drop', 0.18);
  sfx(w(41, 0), 'scribble', 0.12, { d: 2.6 }); sfx(w(42, 0), 'whoosh', 0.12, { d: 0.8 });
  scene({ name: 'goals', t0: T2.t0, t1: T2.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    const swap = outAt(t, w(40, 0) - 0.3);
    K.words(ctx, wl(38, 0, 1, { map: { 1: { color: C.ink } } }), 1780, 280, t, { size: 110, color: C.ink, out: swap });
    K.words(ctx, wl(40, 1, 2, { map: { 2: { color: C.red } } }), 1780, 280, t, { size: 110, color: C.ink });
    // target: rings spring in, arrow strikes the centre
    const tp = FX.springU(t - (w(39, 0) - 0.1), 12, 0.45);
    if (tp > 0) {
      ctx.save(); ctx.translate(TX, TY); const hit = t > w(39, 1) + 0.15 ? Math.exp(-(t - w(39, 1) - 0.15) * 9) * Math.sin((t - w(39, 1)) * 60) * 6 : 0; ctx.translate(hit, 0); ctx.scale(tp, tp);
      [150, 105, 60].forEach((r, i) => { ctx.strokeStyle = C.ink; ctx.lineWidth = i === 0 ? 3 : 2.4; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.stroke(); });
      ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, 22, 0, 6.283); ctx.fill(); ctx.restore();
      const ap = eio(t, w(39, 1) - 0.2, 0.35); if (ap > 0) { const ax = lerp(TX - 460, TX - 8, ap), ay = lerp(TY - 300, TY - 4, ap); const ang = Math.atan2(300, 452); ctx.save(); ctx.translate(ax, ay); ctx.rotate(ang); ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-170, 0); ctx.lineTo(0, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-170, 0); ctx.lineTo(-196, -14); ctx.moveTo(-170, 0); ctx.lineTo(-196, 14); ctx.stroke(); ctx.restore(); }
      txt(ctx, 'تحديد أهدافك', TX, TY + 220, { size: 40, w: 'S', color: C.ink, align: 'center', alpha: clamp((t - w(39, 0)) * 4) });
      FX.note(ctx, 'سهل', TX + 250, TY - 180, { p: inv(w(39, 1) + 0.2, w(39, 1) + 0.6, t), size: 32, color: C.slate, w: 'S', t, alpha: 1 - swap });
    }
    // the hard part: a long winding path that only reaches the target through your trading
    const pp = eio(t, w(41, 0), we(41, 5) - w(41, 0));
    if (pp > 0) { line(ctx, 'paper', pathPts, { reveal: pp, width: 3, color: C.slate, t, amp: 0.6 }); }
    const sp0 = w(41, 3), sp1 = we(42, 2) + 0.2;
    if (t > sp0) K.snake(ctx, (tt) => { const q = A.subPath(pathPts, 0, clamp(eio(tt, sp0, sp1 - sp0)) + 1e-4); return q[q.length - 1]; }, t, 12, 0.03, { r: 13, color: C.red });
    if (pp > 0) { ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(1560, TY, 12, 0, 6.283); ctx.fill(); txt(ctx, 'أنت الآن', 1560, TY + 52, { size: 28, w: 'R', color: C.slate, align: 'center', alpha: clamp(pp * 5) }); }
    FX.note(ctx, 'كيفية تحقيق الأهداف', 1560, 410, { p: inv(w(41, 2), w(41, 2) + 1.0, t), size: 34, color: C.slate, w: 'R', t });
    cap(ctx, wl(42), 880, t, { x: 1780, color: C.ink, size: 44, w: 'S' });
    marks(ctx, 'light');
  } });

  // ================================================================ T3 — «حول استراتيجية الدخول والخروج» (dark, SPIN + BOUNCE)
  const T3 = { t0: T2.t1, t1: 103.82 };
  sfx(T3.t0 - 0.42, 'ripple', 0.18); ksfx(w(44, 2), 'spin', 0.26, 1300); ksfx(w(44, 3), 'bounce', 0.24, 600);
  scene({ name: 'entryexit', t0: T3.t0, t1: T3.t1, ink: 'dark', enter: { type: 'ripple', dur: 0.42, x: TX, y: TY }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    cap(ctx, wl(43).concat(wl(44, 0, 1)), 270, t, { color: SUB });
    const a = 'الدخول', b = 'والخروج'; const sz = 190; const aw = FX.kwidth(a, sz), bw = FX.kwidth(b, sz); const gap = 80; const right = 960 + (aw + bw + gap) / 2;
    FX.kword(ctx, a, right, 610, { size: sz, color: C.white, lt: t - w(44, 2), mode: 'spin' });
    FX.kword(ctx, b, right - aw - gap, 610, { size: sz, color: C.white, lt: t - w(44, 3), mode: 'bounce' });
    lat(ctx, '(Entry)', right - aw / 2, 720, { size: 30, w: 600, color: SIL, align: 'center', alpha: clamp((t - w(44, 2) - 0.4) * 3) });
    lat(ctx, '(Exit)', right - aw - gap - bw / 2, 720, { size: 30, w: 600, color: SIL, align: 'center', alpha: clamp((t - w(44, 3) - 0.4) * 3) });
    K.dot(ctx, right - aw - gap / 2, 610 - 22, 18, t - (w(44, 3) + 0.45), { h0: 260 });
    marks(ctx, 'dark');
  } });

  // ================================================================ E1 — entry conditions card + locked «فتح صفقة» (light)
  const E1 = { t0: T3.t1, t1: 110.42 };
  const CARD1 = [230, 330, 760, 380]; const ROWS1 = [450, 545, 640];
  sfx(E1.t0 - 0.45, 'shutter', 0.18); ksfx(w(45, 3), 'drop', 0.2, 1500);
  ROWS1.forEach((y, i) => sfx(w(45, 4) + i * 0.35, 'pop', 0.1, { f: 700 + i * 60, pan: -0.4 }));
  sfx(w(46, 3) - 0.1, 'pop', 0.16, { f: 820, pan: -0.4 }); sfx(w(46, 4) + 0.1, 'click', 0.08, { pan: -0.4 });
  scene({ name: 'conditions', t0: E1.t0, t1: E1.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    K.words(ctx, wl(45, 0, 2), 1780, 300, t, { size: 56, w: 'R', color: C.slate, mode: 'rise' });
    FX.kword(ctx, 'الشروط', 1780, 520, { size: 170, color: C.ink, lt: t - w(45, 3), mode: 'drop', stagger: 0.05 });
    K.words(ctx, wl(45, 4, 6), 1780, 640, t, { size: 48, w: 'R', color: C.slate, mode: 'rise' });
    const [x, y, cw, ch] = CARD1; const yy = K.card(ctx, x, y, cw, ch, { p: eo(t, w(45, 3) + 0.1, 0.5) });
    if (yy != null) {
      txt(ctx, 'شروط الدخول', x + cw - 40, yy + 66, { size: 32, w: 'B', color: C.ink, alpha: clamp((t - w(45, 3)) * 3) });
      ROWS1.forEach((ry, i) => {
        const p = eo(t, w(45, 4) + i * 0.35, 0.4); if (p <= 0) return; const by = ry + (yy - y);
        ctx.save(); ctx.globalAlpha = p; ctx.strokeStyle = C.slate; ctx.lineWidth = 2; ctx.strokeRect(x + cw - 84, by - 22, 44, 44);
        txt(ctx, 'الشرط ' + (i + 1), x + cw - 110, by + 11, { size: 30, w: 'R', color: C.ink });
        ctx.fillStyle = hexA(C.slate, 0.18); A.roundRect(ctx, x + 60, by - 8, (cw - 300) * p, 16, 8); ctx.fill(); ctx.restore();
      });
    }
    const pp = eo(t, w(46, 3) - 0.15, 0.4);
    K.pill(ctx, 'فتح صفقة', x + cw / 2, 800, { p: pp, size: 32, h: 76 });
    if (pp > 0) { const [cx, cy] = cursorAt(t, [[w(46, 3), 1100, 1000], [w(46, 4) + 0.25, x + cw / 2 + 60, 812]]); FX.cursor(ctx, cx, cy, 0); FX.note(ctx, 'ليس قبل استيفاء الشروط', x + cw / 2 - 150, 890, { p: inv(w(46, 4) + 0.1, w(46, 4) + 0.7, t), size: 26, color: C.slate, t, align: 'right' }); }
    marks(ctx, 'light');
  } });

  // ================================================================ E2/E3 — simple entry (touch support) → complex (support + stochastic < 20 + channel) (light)
  const E2 = { t0: E1.t1, t1: 127.72 };
  const NE = 120, chLo = (i) => 100 + i * 0.32, chW = 16;
  const EP = (() => { const r = A.rng(31); const out = []; for (let i = 0; i < NE; i++) out.push(chLo(i) + chW * (0.5 - 0.44 * Math.cos(2 * Math.PI * (i - 118) / 31)) + (r() - 0.5) * 1.8); out[NE - 1] = chLo(NE - 1) + 0.3; return out; })();
  const SUP = chLo(NE - 1);
  const STK = Array.from({ length: NE }, (_, i) => clamp(50 - 42 * Math.cos(2 * Math.PI * (i - 116) / 31) + Math.sin(i * 1.7) * 2.5, 3, 97));
  const STD = STK.map((_, i) => (STK[Math.max(0, i - 2)] + STK[Math.max(0, i - 1)] + STK[i]) / 3);
  const CONDS = ['يلامس السعر مستوى دعم', 'الاستوكاستك تحت 20', 'داخل قناة صاعدة'];
  const CARD2 = [1230, 330, 612, 420]; const ROWS2 = [480, 575, 670];
  const CHK = [w(50, 4) + 0.35, w(52, 2) + 0.3, w(54, 2) + 0.3]; const ZOOM = w(49, 1) - 0.1;
  sfx(E2.t0 - 0.4, 'whip', 0.18); F.SHUTTER.push([E2.t0 - 0.42, E2.t0, 1.6 / 60]);
  sfx(w(48, 0), 'scribble', 0.08, { d: 0.5 }); sfx(w(48, 5) + 0.02, 'impact', 0.16); sfx(w(48, 5) + 0.2, 'chime', 0.12);
  ksfx(w(49, 1), 'bounce', 0.18, 1500); sfx(ZOOM, 'whoosh', 0.16, { d: 0.7, up: false });
  CHK.forEach((c, i) => { sfx(c - 0.02, 'click', 0.16, { pan: 0.6 }); sfx(c + 0.1, 'tick', 0.12, { f: 3200 + i * 300, pan: 0.6 }); });
  sfx(w(51, 0), 'scribble', 0.08, { d: 1.2 }); sfx(w(52, 2) - 0.05, 'scribble', 0.1, { d: 0.5 }); sfx(w(54, 1) - 0.2, 'scribble', 0.1, { d: 0.9 });
  sfx(CHK[2] + 0.45, 'pop', 0.18, { f: 900, pan: 0.6 });
  scene({ name: 'entrychart', t0: E2.t0, t1: E2.t1, ink: 'light', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    const z = eio(t, ZOOM, 0.9);
    const bx = lerp(300, 150, z), by = 330, bw = lerp(1320, 1020, z), bh = lerp(500, 320, z);
    const i0 = lerp(62, 0, z), lo = lerp(114, 96, z), hi = lerp(160, 160, z);
    const X = (i) => bx + (i - i0) / (NE - 1 - i0) * bw, Y = (v) => by + bh - (v - lo) / (hi - lo) * bh;
    K.axes(ctx, [bx, by, bw, bh], eo(t, E2.t0 - 0.2, 0.6), { t });
    // channel (complex)
    const cp = eo(t, w(54, 1) - 0.2, 0.8);
    if (cp > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(bx, by - 10, bw, bh + 20); ctx.clip();
      ctx.fillStyle = hexA(C.slate, 0.09 * cp); ctx.beginPath(); ctx.moveTo(X(0), Y(chLo(0))); ctx.lineTo(X(NE - 1), Y(chLo(NE - 1))); ctx.lineTo(X(NE - 1), Y(chLo(NE - 1) + chW)); ctx.lineTo(X(0), Y(chLo(0) + chW)); ctx.closePath(); ctx.fill();
      [0, chW].forEach((o) => line(ctx, 'paper', [[X(0), Y(chLo(0) + o)], [X(NE - 1), Y(chLo(NE - 1) + o)]], { reveal: cp, width: 2.4, color: C.slate, t, amp: 0.4 }));
      ctx.restore();
      txt(ctx, 'قناة صاعدة', X(NE * 0.45), Y(chLo(NE * 0.45) + chW) - 18, { size: 26, w: 'S', color: C.slate, align: 'center', alpha: clamp(cp * 2 - 1) });
    }
    // support
    const sp = eo(t, w(48, 1) - 0.2, 0.6);
    if (sp > 0) {
      ctx.save(); ctx.setLineDash([14, 10]); ctx.strokeStyle = C.slate; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(bx + bw, Y(SUP)); ctx.lineTo(bx + bw - bw * sp, Y(SUP)); ctx.stroke(); ctx.restore();
      txt(ctx, 'دعم', bx + bw - 8, Y(SUP) + 34, { size: 26, w: 'S', color: C.slate, alpha: sp }); lat(ctx, '(Support)', bx + bw - 64, Y(SUP) + 34, { size: 20, w: 600, color: C.slate, align: 'right', alpha: sp });
    }
    // price line: simple view draws the last leg down to support; complex view shows the whole history
    const pe = Math.max(eio(t, w(48, 0) - 0.1, w(48, 5) - w(48, 0) + 0.12), z > 0 ? 1 : 0);
    if (pe > 0) {
      const n = Math.round(lerp(i0, NE - 1, pe)); const pts = []; for (let i = Math.floor(i0); i <= n; i++) pts.push([X(i), Y(EP[i])]);
      ctx.save(); ctx.beginPath(); ctx.rect(bx, by - 30, bw + 4, bh + 40); ctx.clip(); ctx.strokeStyle = C.ink; ctx.lineWidth = 3.2; ctx.lineJoin = 'round'; A.tracePts(ctx, pts); ctx.stroke(); ctx.restore();
      const hd = pts[pts.length - 1]; ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(hd[0], hd[1], 7, 0, 6.283); ctx.fill();
    }
    // the touch → buy marker
    const tt = w(48, 5) + 0.02; if (t > tt) {
      const px = X(NE - 1), py = Y(SUP); const rp = clamp((t - tt) / 0.6); if (rp < 1) { ctx.strokeStyle = hexA(C.red, 1 - rp); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(px, py, 10 + 70 * rp, 0, 6.283); ctx.stroke(); }
      K.chip(ctx, 'شراء', px - 30, py + 70, { p: eo(t, tt + 0.05, 0.4) * (1 - z), size: 28, fill: C.ink, stroke: C.ink, color: C.white, align: 'right' });
      FX.check(ctx, px - 150, py + 70, 34, inv(tt + 0.25, tt + 0.55, t) * (1 - z), C.mint, t);
    }
    // stochastic panel
    const sp2 = eo(t, w(51, 0) - 0.1, 0.5);
    if (sp2 > 0) {
      const sx = bx, sy = by + bh + 50, sw = bw, sh = 150; const SY = (v) => sy + sh - v / 100 * sh; const SX = (i) => sx + i / (NE - 1) * sw;
      ctx.save(); ctx.globalAlpha = sp2; ctx.strokeStyle = hexA(C.ink, 0.5); ctx.lineWidth = 1.5; ctx.strokeRect(sx, sy, sw, sh);
      ctx.setLineDash([8, 7]); [20, 80].forEach((v) => { ctx.strokeStyle = v === 20 ? hexA(C.red, 0.7) : hexA(C.slate, 0.6); ctx.beginPath(); ctx.moveTo(sx, SY(v)); ctx.lineTo(sx + sw, SY(v)); ctx.stroke(); }); ctx.setLineDash([]);
      lat(ctx, '20', sx + sw + 10, SY(20) + 7, { size: 20, w: 700, color: C.red }); lat(ctx, '80', sx + sw + 10, SY(80) + 7, { size: 20, w: 600, color: C.slate });
      txt(ctx, 'مؤشر الاستوكاستك', sx + sw - 10, sy - 12, { size: 22, w: 'S', color: C.charcoal });
      const rv = clamp((t - w(51, 0)) / 1.6); const m = Math.max(2, Math.floor(NE * rv));
      ctx.lineWidth = 2.4; ctx.strokeStyle = C.ink; ctx.beginPath(); for (let i = 0; i < m; i++) (i ? ctx.lineTo : ctx.moveTo).call(ctx, SX(i), SY(STK[i])); ctx.stroke();
      ctx.strokeStyle = C.slate; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < m; i++) (i ? ctx.lineTo : ctx.moveTo).call(ctx, SX(i), SY(STD[i])); ctx.stroke();
      ctx.restore();
      FX.scribbleCircle(ctx, SX(117.5), SY(13), 46, 30, inv(w(52, 2) - 0.1, w(52, 2) + 0.4, t), C.red, t);
    }
    // checklist card (complex)
    const [x, y, cw, ch] = CARD2; const yy = K.card(ctx, x, y, cw, ch, { p: eo(t, ZOOM + 0.2, 0.6) });
    if (yy != null) {
      txt(ctx, 'شروط الدخول', x + cw - 40, yy + 66, { size: 30, w: 'B', color: C.ink, alpha: clamp((t - ZOOM - 0.2) * 3) });
      CONDS.forEach((c, i) => {
        const p = eo(t, ZOOM + 0.45 + i * 0.25, 0.4); if (p <= 0) return; const ry = ROWS2[i] + (yy - y);
        ctx.save(); ctx.globalAlpha = p; ctx.strokeStyle = C.slate; ctx.lineWidth = 2; ctx.strokeRect(x + cw - 82, ry - 21, 42, 42); ctx.restore();
        txt(ctx, c, x + cw - 104, ry + 10, { size: 28, w: 'R', color: C.ink, alpha: p });
        const ck = inv(CHK[i], CHK[i] + 0.25, t); if (ck > 0) { ctx.save(); ctx.fillStyle = C.mint; ctx.globalAlpha = 0.25 * ck; ctx.fillRect(x + cw - 82, ry - 21, 42, 42); ctx.restore(); FX.check(ctx, x + cw - 61, ry, 30, ck, C.ink, t); }
      });
      const all = eo(t, CHK[2] + 0.45, 0.4); K.pill(ctx, 'فتح صفقة', x + cw / 2, yy + ch + 70, { p: eo(t, ZOOM + 1.2, 0.4), size: 28, h: 68, fill: all > 0.5 ? C.red : '#C4C8CC', color: all > 0.5 ? C.white : C.charcoal });
      const pts = [[ZOOM + 0.8, 1500, 1000], [CHK[0] - 0.05, x + cw - 56, ROWS2[0] + 12], [CHK[1] - 0.05, x + cw - 56, ROWS2[1] + 12], [CHK[2] - 0.05, x + cw - 56, ROWS2[2] + 12], [CHK[2] + 0.6, x + cw / 2 + 40, yy + ch + 86]];
      if (t > ZOOM + 0.8) { const [cx, cy] = cursorAt(t, pts); FX.cursor(ctx, cx, cy, press(t, CHK)); }
    }
    // headlines
    const hs = outAt(t, ZOOM - 0.25);
    K.words(ctx, wl(47, 0, 3, { map: { 2: { color: C.ink, w: 'B' } } }), 1780, 250, t, { size: 56, w: 'R', color: C.slate, mode: 'rise', out: outAt(t, w(48, 0) - 0.3) });
    K.words(ctx, wl(48, 0, 5, { map: { 5: { color: C.ink, w: 'B' } } }), 1780, 250, t, { size: 56, w: 'R', color: C.slate, mode: 'rise', out: hs });
    K.words(ctx, wl(49, 0, 1, { map: { 1: { color: C.red, w: 'B', mode: 'bounce' } } }), 1780, 250, t, { size: 64, w: 'R', color: C.slate, mode: 'rise' });
    marks(ctx, 'light');
  } });

  // ================================================================ E4 — conditions not met → not your trade · «فكّر مرّتين» (dark)
  const E4 = { t0: E2.t1, t1: 136.42 };
  const RES4 = [1, 1, 0]; const R4T = [w(55, 1), w(55, 3), w(55, 4) + 0.05];
  sfx(E4.t0 - 0.42, 'ripple', 0.18);
  R4T.forEach((tt, i) => sfx(tt + 0.05, RES4[i] ? 'tick' : 'buzz', RES4[i] ? 0.12 : 0.14, { f: 3000 + i * 200 }));
  sfx(w(56, 1), 'glitch', 0.12); ksfx(w(56, 2), 'drop', 0.14); ksfx(w(57, 2), 'spin', 0.28); ksfx(w(57, 1), 'rise', 0.14);
  scene({ name: 'thinktwice', t0: E4.t0, t1: E4.t1, ink: 'dark', enter: { type: 'ripple', dur: 0.42, x: 1535, y: 820 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    const gone = eio(t, w(56, 1) - 0.1, 0.6); const tt = w(57, 0) - 0.3;
    // card with ✓ ✓ ✗
    if (gone < 1) {
      ctx.save(); ctx.translate(960, 520); ctx.rotate(gone * -0.25); ctx.scale(1 - gone * 0.5, 1 - gone * 0.5); ctx.translate(-960 - gone * 900, -520 + gone * 260);
      const x = 600, y = 300, cw = 720, ch = 420; const yy = K.card(ctx, x, y, cw, ch, { p: eo(t, E4.t0 - 0.3, 0.5), dark: true });
      if (yy != null) {
        txt(ctx, 'صفقة جديدة', x + cw - 40, yy + 66, { size: 32, w: 'B', color: C.white });
        CONDS.forEach((c, i) => {
          const ry = yy + 150 + i * 92; txt(ctx, c, x + cw - 110, ry + 10, { size: 28, color: SUB });
          ctx.strokeStyle = hexA(C.white, 0.5); ctx.lineWidth = 2; ctx.strokeRect(x + cw - 84, ry - 21, 42, 42);
          const p = inv(R4T[i], R4T[i] + 0.25, t); if (RES4[i]) FX.check(ctx, x + cw - 63, ry, 30, p, C.mint, t); else FX.cross(ctx, x + cw - 63, ry, 28, p, C.red, t);
          if (!RES4[i] && p > 0) { ctx.save(); ctx.globalAlpha = 0.18 * p; ctx.fillStyle = C.red; ctx.fillRect(x + 20, ry - 34, cw - 40, 68); ctx.restore(); }
        });
      }
      ctx.restore();
    }
    cap(ctx, wl(55), 230, t, { color: SUB, out: outAt(t, w(56, 0) - 0.3) });
    const l2 = wl(56, 0, 4, { map: { 1: { color: C.red } } }); const l2w = K.wordsWidth(l2, { size: 92 });
    K.words(ctx, l2, 960 + l2w / 2, 560, t, { size: 92, color: C.white, stagger: 0.03, out: outAt(t, tt) });
    // think twice: «مرّتين» spins two full turns
    FX.kword(ctx, 'التفكير', 960 + FX.kwidth('التفكير', 100) / 2, 400, { size: 100, color: SUB, lt: t - w(57, 1), mode: 'rise' });
    FX.kword(ctx, 'مرّتين', 960 + FX.kwidth('مرّتين', 270) / 2, 700, { size: 270, color: C.white, lt: t - w(57, 2), mode: 'spin', turns: 2 });
    lat(ctx, '×2', 960 - FX.kwidth('مرّتين', 270) / 2 - 40, 560, { size: 64, w: 700, color: SIL, align: 'right', alpha: clamp((t - w(57, 2) - 0.6) * 4) });
    cap(ctx, wl(58), 880, t, { color: SUB });
    marks(ctx, 'dark');
  } });

  // ================================================================ X1 — open the trade → the exit strategy takes over (light)
  const X1 = { t0: E4.t1, t1: 141.02 };
  const CLK = w(59, 2) + 0.02;
  const XP = K.path([[0, 100], [0.3, 104], [0.5, 101], [1, 108]], 90, 41, 1.0);
  sfx(X1.t0 - 0.45, 'shutter', 0.18); sfx(CLK, 'click', 0.24); sfx(CLK + 0.03, 'ripple', 0.12); ksfx(w(60, 2), 'drop', 0.2);
  scene({ name: 'opentrade', t0: X1.t0, t1: X1.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    cap(ctx, wl(59), 240, t, { out: outAt(t, w(60, 0) - 0.3) });
    const fly = eio(t, CLK + 0.35, 0.5);
    if (fly < 1) {
      const pr = press(t, [CLK]); ctx.save(); ctx.translate(960, lerp(520, 300, fly)); ctx.scale(1 - pr * 0.06 - fly * 0.6, 1 - pr * 0.06 - fly * 0.6); ctx.globalAlpha = 1 - fly;
      K.pill(ctx, 'فتح صفقة', 0, 0, { p: eo(t, X1.t0 - 0.2, 0.4), size: 44, h: 104 }); ctx.restore();
      const rp = clamp((t - CLK) / 0.7); if (rp > 0 && rp < 1) { ctx.strokeStyle = hexA(C.red, 1 - rp); ctx.lineWidth = 3; ctx.beginPath(); A.roundRect(ctx, 960 - 160 - 120 * rp, 520 - 52 - 60 * rp, 320 + 240 * rp, 104 + 120 * rp, 52 + 60 * rp); ctx.stroke(); }
      const [cx, cy] = cursorAt(t, [[X1.t0, 1500, 980], [CLK - 0.05, 1000, 540]]); FX.cursor(ctx, cx, cy, press(t, [CLK]));
    }
    // entry line + price leaving it
    const box = [300, 420, 1320, 400]; const fr = K.frame(box, 90, 114, XP.length);
    const ep = eo(t, CLK + 0.4, 0.5);
    if (ep > 0) {
      K.axes(ctx, box, ep, { t });
      K.level(ctx, fr, 100, ep, { color: C.ink, label: 'الدخول', lw: 'B', dash: [10, 8] });
      K.priceLine(ctx, fr, XP, clamp((t - CLK - 0.5) / 3.6), { color: C.ink, width: 3.2, head: 9, headColor: C.red });
    }
    K.words(ctx, wl(60, 2, 3, { map: { 3: { color: C.red } } }), 960 + K.wordsWidth(wl(60, 2, 3), { size: 120 }) / 2, 330, t, { size: 120, color: C.ink, stagger: 0.035 });
    cap(ctx, wl(60, 0, 1), 200, t, { size: 48 });
    marks(ctx, 'light');
  } });

  // ================================================================ X2 — three ways out: «بربح» · «بخسارة» · «التعادل» (dark, reference word trio)
  const X2 = { t0: X1.t1, t1: 148.18 };
  const W1 = w(62, 0), W2 = w(63, 1), W3 = w(64, 3);
  sfx(X2.t0 - 0.42, 'whip', 0.2); F.SHUTTER.push([X2.t0 - 0.42, X2.t0, 1.6 / 60]);
  sfx(w(61, 1) - 0.02, 'slam', 0.22); ksfx(W1, 'bounce', 0.26); sfx(W2 - 0.1, 'whoosh', 0.14, { d: 0.25 }); ksfx(W2, 'drop', 0.24); ksfx(W3, 'snap', 0.24);
  scene({ name: 'threeexits', t0: X2.t0, t1: X2.t1, ink: 'dark', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    // «3 طرق للخروج»
    const o1 = outAt(t, W1 - 0.25, 0.3);
    if (o1 < 1) {
      const k = FX.springU(t - w(61, 1), 14, 0.5); ctx.save(); ctx.globalAlpha = clamp((t - w(61, 1)) * 6) * (1 - o1); ctx.translate(1240, 560); ctx.scale(lerp(2.2, 1, Math.min(1, k)) * (1 - o1 * 0.3), lerp(2.2, 1, Math.min(1, k)) * (1 - o1 * 0.3));
      lat(ctx, '3', 0, 160, { size: 460, w: 300, color: C.white, align: 'center', track: -10 }); ctx.restore();
      K.words(ctx, wl(61, 2, 5), 1040, 560, t, { size: 84, color: C.white, stagger: 0.03, out: o1 });
      cap(ctx, wl(61, 0, 0), 300, t, { color: SUB, out: o1, x: 1040 });
    }
    // trio
    const word = (s, tc, tOut, col, mode, note, latn) => {
      if (t < tc - 0.2 || (tOut != null && t > tOut + 0.6)) return;
      const sz = 300; const ww = FX.kwidth(s, sz); const out = tOut == null ? 0 : clamp((t - tOut) / 0.35);
      FX.kword(ctx, s, 960 + ww / 2, 640, { size: sz, color: col, lt: t - tc, mode, out, outDir: -1 });
      const na = clamp((t - tc - 0.35) * 4) * (1 - out);
      if (na > 0) { txt(ctx, note, 960 + 10, 800, { size: 40, w: 'S', color: SUB, align: 'left', alpha: na }); lat(ctx, latn, 960 - 10, 800, { size: 30, w: 600, color: SIL, align: 'right', alpha: na }); }
      return ww;
    };
    word('بربح', W1, W2 - 0.25, C.mint, 'bounce', 'جني الأرباح', '(Take Profit)');
    word('بخسارة', W2, W3 - 0.3, C.red, 'drop', 'وقف الخسارة', '(Stop Loss)');
    const gp = eo(t, W3 - 0.12, 0.22); const tw = FX.kwidth('التعادل', 300);
    if (gp > 0) { ctx.save(); ctx.strokeStyle = hexA(C.white, 0.35); ctx.lineWidth = 1.5; [640, 640 - 220].forEach((y) => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W * gp, y); ctx.stroke(); }); [960 + tw / 2 + 16, 960 - tw / 2 - 16].forEach((x) => { ctx.beginPath(); ctx.moveTo(x, H); ctx.lineTo(x, H - H * gp); ctx.stroke(); }); ctx.restore(); }
    word('التعادل', W3, null, C.white, 'snap', 'نقطة التعادل', '(Breakeven)');
    cap(ctx, wl(64, 1, 2), 300, t, { color: SUB });
    marks(ctx, 'dark');
  } });

  // ================================================================ X3 — an exit plan for every scenario (light): three futures fan out from the entry
  const X3 = { t0: X2.t1, t1: 153.82 };
  const HIST = K.path([[0, 94], [0.5, 97], [1, 100]], 40, 51, 0.9);
  const FUT = [{ v: 112, col: C.mint, lab: 'جني الأرباح', seed: 61 }, { v: 100, col: C.slate, lab: 'التعادل', seed: 63 }, { v: 89, col: C.red, lab: 'وقف الخسارة', seed: 67 }]
    .map((f) => Object.assign(f, { p: K.path([[0, 100], [0.35, f.v > 100 ? 103 : 98], [0.7, f.v > 100 ? 106 : f.v < 100 ? 95 : 103], [1, f.v]], 60, f.seed, 1.0) }));
  sfx(X3.t0 - 0.45, 'shutter', 0.18);
  FUT.forEach((f, i) => sfx(w(65, 3) + i * 0.3, 'tick', 0.1, { f: 2400 + i * 300 }));
  sfx(w(66, 1), 'whoosh', 0.16, { d: 1.2 }); FUT.forEach((f, i) => sfx(w(66, 1) + 1.3 + i * 0.12, 'pop', 0.12, { f: [880, 660, 440][i] }));
  scene({ name: 'scenarios', t0: X3.t0, t1: X3.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    cap(ctx, wl(65), 240, t, { color: C.ink, size: 60, w: 'S', out: outAt(t, w(66, 0) - 0.3) });
    cap(ctx, wl(66), 240, t, { color: C.ink, size: 60, w: 'S' });
    const box = [300, 340, 1320, 480]; const x0 = box[0], xe = box[0] + box[2] * 0.36, x1 = box[0] + box[2];
    const Y = (v) => box[1] + box[3] - (v - 84) / (116 - 84) * box[3];
    K.axes(ctx, box, eo(t, X3.t0 - 0.2, 0.6), { t });
    // history up to the entry
    const hp = eo(t, X3.t0, 0.8); const hpts = HIST.slice(0, Math.max(2, Math.round(HIST.length * hp))).map((v, i) => [x0 + (i / (HIST.length - 1)) * (xe - x0), Y(v)]);
    ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 3.2; A.tracePts(ctx, hpts); ctx.stroke(); ctx.restore();
    // levels
    FUT.forEach((f, i) => {
      const lp = eo(t, w(65, 3) + i * 0.3, 0.6); if (lp <= 0) return;
      ctx.save(); if (i === 1) ctx.setLineDash([12, 9]); ctx.strokeStyle = f.col; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(x1, Y(f.v)); ctx.lineTo(x1 - (x1 - xe) * lp, Y(f.v)); ctx.stroke(); ctx.restore();
      txt(ctx, f.lab, x1 + 14, Y(f.v) + 9, { size: 26, w: 'S', color: i === 0 ? C.ink : f.col, align: 'left', dir: 'rtl', alpha: lp });
    });
    // three futures fan out (onion trail)
    const fp = eio(t, w(66, 1), 1.3);
    FUT.forEach((f, i) => {
      if (fp <= 0) return; const n = Math.max(2, Math.round(f.p.length * fp)); const pts = f.p.slice(0, n).map((v, k) => [xe + (k / (f.p.length - 1)) * (x1 - xe - 10), Y(v)]);
      ctx.save(); ctx.strokeStyle = f.col; ctx.globalAlpha = 0.9; ctx.lineWidth = 3; ctx.setLineDash(i === 1 ? [10, 8] : []); A.tracePts(ctx, pts); ctx.stroke(); ctx.restore();
      const hd = pts[pts.length - 1]; ctx.fillStyle = f.col; ctx.beginPath(); ctx.arc(hd[0], hd[1], 8, 0, 6.283); ctx.fill();
      const ep = eo(t, w(66, 1) + 1.3 + i * 0.12, 0.3); if (ep > 0) { ctx.save(); ctx.strokeStyle = hexA(f.col, 1 - ep); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(hd[0], hd[1], 8 + 34 * ep, 0, 6.283); ctx.stroke(); ctx.restore(); }
    });
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(xe, Y(100), 10 * eo(t, X3.t0 + 0.6, 0.3), 0, 6.283); ctx.fill();
    txt(ctx, 'الدخول', xe, Y(100) + 46, { size: 26, w: 'S', color: C.ink, align: 'center', alpha: eo(t, X3.t0 + 0.6, 0.3) });
    marks(ctx, 'light');
  } });

  // ================================================================ X4 — simple exit at resistance, complex = trailing stop (dark, candles)
  const X4 = { t0: X3.t1, t1: 163.92 };
  const XR = K.path([[0, 60], [0.25, 68], [0.4, 64], [0.7, 78], [0.82, 74], [1, 90]], 56, 71, 2.2); const XC = K.candles(XR, 9, 1.8); const RES = 90;
  const CT0 = w(68, 0), CT1 = w(69, 5) + 0.02;
  const TRAIL = [0.3, 0.45, 0.6, 0.75, 0.9].map((u) => ({ u, v: XR[Math.round(u * 55)] - 7 }));
  sfx(X4.t0 - 0.42, 'ripple', 0.18); sfx(w(69, 0) - 0.1, 'scribble', 0.08, { d: 0.6 }); sfx(CT1, 'impact', 0.16); sfx(CT1 + 0.15, 'chime', 0.14);
  ksfx(w(70, 1), 'bounce', 0.18, 1500); TRAIL.forEach((s, i) => sfx(w(70, 1) + 0.15 + i * 0.12, 'tick', 0.1, { f: 1800 + i * 250 }));
  scene({ name: 'resistance', t0: X4.t0, t1: X4.t1, ink: 'dark', enter: { type: 'ripple', dur: 0.42, x: 960, y: 540 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    cap(ctx, wl(67), 230, t, { color: SUB, out: outAt(t, w(68, 0) - 0.3) });
    cap(ctx, wl(68, 0, 5, { map: { 5: { color: C.white, w: 'B' } } }), 230, t, { color: SUB, out: outAt(t, w(69, 0) - 0.3) });
    cap(ctx, wl(69, 0, 5, { map: { 0: { color: C.mint, w: 'S' }, 1: { color: C.mint, w: 'S' } } }), 230, t, { color: SUB, out: outAt(t, w(70, 0) - 0.3) });
    cap(ctx, wl(70, 0, 1, { map: { 1: { color: C.white, w: 'B', mode: 'bounce' } } }), 230, t, { color: SUB, size: 64 });
    const box = [260, 340, 1340, 470]; const fr = K.frame(box, 54, 96, XR.length);
    K.drawCandles(ctx, fr, XC, 0.25 + 0.75 * inv(CT0, CT1, t), { body: 0.6 });
    const rp = eo(t, w(69, 0) - 0.1, 0.6);
    if (rp > 0) { ctx.save(); ctx.setLineDash([14, 10]); ctx.strokeStyle = hexA(C.white, 0.7); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(box[0] + box[2], fr.Y(RES)); ctx.lineTo(box[0] + box[2] - box[2] * rp, fr.Y(RES)); ctx.stroke(); ctx.restore();
      txt(ctx, 'مقاومة', box[0] + 120, fr.Y(RES) - 16, { size: 28, w: 'S', color: C.white, alpha: rp }); lat(ctx, '(Resistance)', box[0] + 130, fr.Y(RES) - 16, { size: 20, w: 600, color: SIL, align: 'left', alpha: rp }); }
    if (t > CT1) {
      const px = fr.X(XR.length - 1), py = fr.Y(RES); const q = clamp((t - CT1) / 0.6); if (q < 1) { ctx.strokeStyle = hexA(C.mint, 1 - q); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(px, py, 10 + 70 * q, 0, 6.283); ctx.stroke(); }
      K.chip(ctx, 'جني الأرباح', px - 60, py - 64, { p: eo(t, CT1 + 0.05, 0.4), size: 26, fill: C.mint, stroke: C.mint, color: C.ink, align: 'right' });
    }
    // trailing stop: steps ratchet upward (reference spacing frames)
    const tp = eo(t, w(70, 1), 0.2);
    if (tp > 0) {
      ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 3;
      TRAIL.forEach((s, i) => { const q = eo(t, w(70, 1) + 0.15 + i * 0.12, 0.25); if (q <= 0) return; const xA = fr.X(s.u * 55), xB = fr.X(Math.min(55, (s.u + 0.15) * 55)); const y = fr.Y(s.v); ctx.globalAlpha = q; ctx.beginPath(); ctx.moveTo(xA, y); ctx.lineTo(lerp(xA, xB, q), y); ctx.stroke(); if (i) { const yp = fr.Y(TRAIL[i - 1].v); ctx.beginPath(); ctx.moveTo(xA, yp); ctx.lineTo(xA, lerp(yp, y, q)); ctx.stroke(); } });
      ctx.restore();
      txt(ctx, 'وقف متحرك', fr.X(0.3 * 55) - 10, fr.Y(TRAIL[0].v) + 44, { size: 26, w: 'S', color: C.white, align: 'right', alpha: eo(t, w(70, 1) + 0.3, 0.3) });
      lat(ctx, '(Trailing Stop)', fr.X(0.3 * 55) - 140, fr.Y(TRAIL[0].v) + 44, { size: 20, w: 600, color: SIL, align: 'right', alpha: eo(t, w(70, 1) + 0.3, 0.3) });
    }
    marks(ctx, 'dark');
  } });

  // ================================================================ X5 — the planned exit differs with your goals (light): two tracks, short vs long target
  const X5 = { t0: X4.t1, t1: 169.58 };
  const TRK = [{ y: 500, xe: 1060, lab: 'هدف قصير المدى', t: w(73, 0) - 0.4 }, { y: 720, xe: 420, lab: 'هدف طويل المدى', t: w(73, 1) - 0.2 }];
  sfx(X5.t0 - 0.45, 'shutter', 0.18); TRK.forEach((k, i) => { sfx(k.t, 'whoosh', 0.14, { d: 0.6, pan: 0.3 - i * 0.5 }); sfx(k.t + (i ? 1.0 : 0.6), 'pop', 0.16, { f: 700 - i * 150, pan: -0.2 - i * 0.4 }); });
  scene({ name: 'goalsexit', t0: X5.t0, t1: X5.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    cap(ctx, wl(71).concat(wl(72)), 250, t, { color: C.ink, size: 58, w: 'S' });
    TRK.forEach((k, i) => {
      const ap = eo(t, X5.t0 + 0.1 + i * 0.25, 0.5); if (ap <= 0) return; const xs = 1620;
      ctx.save(); ctx.globalAlpha = ap; ctx.strokeStyle = hexA(C.ink, 0.6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xs, k.y); ctx.lineTo(xs - (xs - 300) * ap, k.y); ctx.stroke();
      for (let m = 0; m <= 10; m++) { const x = xs - m * 132; ctx.beginPath(); ctx.moveTo(x, k.y - 6); ctx.lineTo(x, k.y + 6); ctx.stroke(); } ctx.restore();
      txt(ctx, k.lab, xs, k.y - 40, { size: 30, w: 'S', color: C.charcoal, alpha: ap });
      ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(xs, k.y, 11 * ap, 0, 6.283); ctx.fill();
      // target at the planned exit
      ctx.save(); ctx.globalAlpha = ap; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; [30, 18].forEach((r) => { ctx.beginPath(); ctx.arc(k.xe, k.y, r, 0, 6.283); ctx.stroke(); }); ctx.restore();
      // the trade travels with spacing frames (reference onion boxes)
      const d = i ? 1.0 : 0.6; const u = eio(t, k.t, d);
      if (u > 0) {
        const xNow = lerp(xs, k.xe, u);
        for (let f = 1; f <= 6; f++) { const uf = eio(t - f * 0.07, k.t, d); if (uf <= 0 || uf >= u) continue; ctx.save(); ctx.strokeStyle = hexA(C.red, 0.5 * (1 - f / 7)); ctx.lineWidth = 2; ctx.strokeRect(lerp(xs, k.xe, uf) - 16, k.y - 16, 32, 32); ctx.restore(); }
        ctx.fillStyle = C.red; ctx.fillRect(xNow - 16, k.y - 16, 32, 32);
        K.chip(ctx, 'خروج', k.xe, k.y + 64, { p: eo(t, k.t + d, 0.35), size: 24, fill: C.ink, stroke: C.ink, color: C.white, align: 'center' });
      }
    });
    const l3 = wl(73, 0, 1, { map: { 1: { color: C.red } } }); const l3w = K.wordsWidth(l3, { size: 84 });
    K.words(ctx, l3, 960 + l3w / 2, 900, t, { size: 84, color: C.ink, stagger: 0.03 });
    marks(ctx, 'light');
  } });

  // ================================================================ X6 — total clarity (focus pull) · entry & exit hold up the strategy and your success (dark)
  const X6 = { t0: X5.t1, t1: 182.22 };
  const FOC = w(74, 4) + 0.1; const P1 = w(75, 2), P2 = w(75, 3), SLAB = w(76, 2) - 0.05, SUCC = w(77, 0);
  sfx(X6.t0 - 0.42, 'whip', 0.2); F.SHUTTER.push([X6.t0 - 0.42, X6.t0, 1.6 / 60]);
  sfx(FOC - 0.5, 'revswell', 0.18, { d: 0.5 }); sfx(FOC, 'snap', 0.26);
  sfx(P1 - 0.05, 'whoosh', 0.14, { d: 0.4, up: true, pan: 0.3 }); sfx(P2 - 0.05, 'whoosh', 0.14, { d: 0.4, up: true, pan: -0.3 });
  sfx(SLAB - 0.35, 'whoosh', 0.16, { d: 0.35, up: false }); sfx(SLAB, 'slam', 0.24); sfx(SUCC + 0.3, 'pop', 0.22, { f: 760 }); sfx(SUCC + 0.3, 'chime', 0.12);
  scene({ name: 'clarity', t0: X6.t0, t1: X6.t1, ink: 'dark', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    cap(ctx, wl(74, 0, 3), 250, t, { color: SUB, out: outAt(t, w(75, 0) - 0.2) });
    // focus pull: the words arrive blurred and snap sharp on «الوضوح»
    const s = 'الوضوح التام'; const sz = 170; const sw = FX.kwidth(s, sz); const sp = FX.sprite(s, sz, 'X', C.white);
    const a0 = eo(t, FOC - 0.9, 0.4); const mv = eio(t, w(75, 0) - 0.3, 0.7);
    if (a0 > 0 && mv < 1) {
      const b = (1 - eo(t, FOC, 0.12)) * 26; const x = 960 + sw / 2 - sp.w - sp.pad, y = 560 - sp.base;
      ctx.save(); ctx.globalAlpha = a0 * (1 - mv); ctx.translate(0, -mv * 200);
      if (b < 0.5) ctx.drawImage(sp.cv, x, y); else { const n = 22; for (let i = 0; i < n; i++) { const an = i * 2.39996; const rr = b * Math.sqrt((i + 0.5) / n); ctx.globalAlpha = a0 * (1 - mv) * 0.11; ctx.drawImage(sp.cv, x + Math.cos(an) * rr, y + Math.sin(an) * rr); } }
      ctx.restore();
      if (b < 0.5) { const fp = clamp((t - FOC) / 0.5); if (fp < 1) { ctx.save(); ctx.strokeStyle = hexA(C.white, 0.6 * (1 - fp)); ctx.lineWidth = 2; const m = 40 * (1 - fp); [[960 + sw / 2 + m, 400 - m], [960 - sw / 2 - m, 400 - m], [960 + sw / 2 + m, 620 + m], [960 - sw / 2 - m, 620 + m]].forEach(([cx, cy], k) => { const sx = k % 2 ? 1 : -1, sy = k < 2 ? 1 : -1; ctx.beginPath(); ctx.moveTo(cx, cy + sy * 40); ctx.lineTo(cx, cy); ctx.lineTo(cx + sx * 40, cy); ctx.stroke(); }); ctx.restore(); } }
    }
    cap(ctx, wl(75, 0, 1), 250, t, { color: SUB, out: outAt(t, w(76, 0) - 0.2) });
    cap(ctx, wl(76, 0, 1), 250, t, { color: SUB });
    // pillars
    const pil = (cx, label, tp) => {
      const p = FX.springU(t - tp, 13, 0.55); if (p <= 0) return; const ph = 300 * Math.min(1.08, p), base = 860;
      ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(cx - 110, base - ph, 220, ph); ctx.strokeStyle = hexA(C.white, 0.8); ctx.lineWidth = 2; ctx.strokeRect(cx - 110, base - ph, 220, ph);
      A.scanFill(ctx, (c) => { c.beginPath(); c.rect(cx - 110, base - ph, 220, ph); }, { box: [cx - 110, base - ph, 220, ph], lit: 0.18, alpha: 0.35 });
      ctx.restore(); txt(ctx, label, cx, base - ph / 2 + 16, { size: 40, w: 'B', color: C.white, align: 'center' });
    };
    pil(1240, 'الدخول', P1); pil(680, 'الخروج', P2);
    // slab drops onto the pillars
    const sl = K.bounce(t - (SLAB - 0.32), 600, 0.32, 0.18, 2);
    if (t > SLAB - 0.32) {
      const y = 860 - 300 - 46 - sl.y; const sq = sl.sq * 0.25;
      ctx.save(); ctx.translate(960, y + 46); ctx.scale(1 + sq * 0.3, 1 - sq); ctx.fillStyle = C.white; ctx.fillRect(-420, -92, 840, 92); ctx.restore();
      txt(ctx, 'استراتيجيتك', 960, y + 2, { size: 46, w: 'B', color: C.ink, align: 'center' });
      const dp = clamp((t - SLAB) / 0.8); if (dp > 0 && dp < 1) FX.swarm(ctx, 26, 5, t, (i, a, b) => { const sgn = i % 2 ? 1 : -1; return [960 + sgn * (420 + 180 * dp * a), 560 - 40 * dp * b + 60 * dp * dp, 3 * (1 - dp), C.white, 0.7 * (1 - dp)]; });
    }
    // success: the red dot lands on top
    K.dot(ctx, 960, 860 - 300 - 92 - 30, 30, t - SUCC, { h0: 420 });
    FX.note(ctx, 'نجاحك كمتداول', 1010, 380, { p: inv(w(77, 1) - 0.2, w(77, 1) + 0.5, t), size: 34, color: SIL, w: 'S', align: 'left', t });
    marks(ctx, 'dark');
  } });

  F.S.ACT2_END = X6.t1;
})(typeof window !== 'undefined' ? window : globalThis);
