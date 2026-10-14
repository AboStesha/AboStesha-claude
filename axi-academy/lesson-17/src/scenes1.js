// Act I — brand open · hook · the question · the commander (war map) · losses · confidence · plan B · survival · bigger picture.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT;
  const { W, H, C, clamp, lerp, inv, eo, ei, eio, hexA, txt, lat, measure, line, logo, logoWidth } = A;
  const { w, we, ph, phe, sfx, ksfx, scene, marks } = F;
  const SIL = C.silver, SUB = hexA(C.white, 0.72);

  // ---------------------------------------------------------------- chapters (timeline diamonds)
  F.chapters.push(
    { t: F.OFF, label: 'لماذا الاستراتيجية؟' }, { t: ph(4), label: 'القائد' }, { t: ph(11), label: 'تقبّل الخسارة' },
    { t: ph(24), label: 'خطة بديلة' }, { t: ph(35), label: 'مكوّنات الاستراتيجية' }, { t: ph(45), label: 'الدخول' },
    { t: ph(59), label: 'الخروج' }, { t: ph(78), label: 'بناء استراتيجيتك' }, { t: ph(87), label: 'المخاطرة' },
    { t: ph(97), label: 'الأسواق' }, { t: ph(110), label: 'التحليل' }, { t: ph(116), label: 'الكتاب' },
  );

  // ================================================================ S0 — brand open (white logo on the primary gradient)
  sfx(0.06, 'identity', 0.55);
  scene({ name: 'open', t0: 0, t1: 2.05, ink: 'slate', noMarks: true, draw(ctx, t) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, C.frost); g.addColorStop(1, C.slate); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const h = 250, lw = logoWidth(h);
    logo(ctx, 960 - lw / 2, 545 - h / 2, h, C.white, { axi: FX.springU(t - 0.12, 15, 0.5), iraq: FX.springU(t - 0.42, 15, 0.5) });
  } });

  // ================================================================ S1 — hook: «لكي تكون ناجحاً في التداول / استراتيجية.»
  sfx(1.58, 'shutter', 0.2);
  const L1 = [{ s: 'لكي', t: w(0, 0) }, { s: 'تكون', t: w(0, 1) }, { s: 'ناجحاً', t: w(0, 2), mode: 'bounce' }, { s: 'في', t: w(0, 3) }, { s: 'التداول', t: w(0, 4) }];
  const HW = 'استراتيجية', HS = 250, HY = 700, L1S = 100, L1Y = 372;
  let lay1 = null;
  const lay = () => {
    if (lay1) return lay1;
    const w1 = K.wordsWidth(L1, { size: L1S }), w2 = FX.kwidth(HW, HS); const right = 960 + (w2 + 70) / 2;
    return (lay1 = { right, w1, w2, left2: right - w2, dotX: right - w2 - 46, dotY: HY - 28, r: 28 });
  };
  const B0 = w(0, 9) - 0.2, B1 = B0 + 0.82; // ball travel
  const ballAt = (tt) => {
    const L = lay(); const u = clamp((tt - B0) / (B1 - B0));
    const x = lerp(1990, L.dotX, 1 - Math.pow(1 - u, 1.6)); const amp = 230 * Math.pow(1 - u, 1.1);
    const s = Math.abs(Math.sin(Math.PI * (u * 3 + 0.5))); const y = L.dotY - amp * s;
    let sq = Math.exp(-Math.pow(s / 0.16, 2)) * (1 - u) * 0.55; if (tt > B1) sq = Math.exp(-Math.pow((tt - B1) / 0.06, 2)) * 0.42;
    return [x, y, sq];
  };
  const ball = (ctx, tt, r) => { const [x, y, sq] = ballAt(tt); ctx.save(); ctx.fillStyle = C.red; ctx.translate(x, y + r); ctx.scale(1 + sq, 1 - sq * 0.75); ctx.beginPath(); ctx.arc(0, -r, r, 0, 6.283); ctx.fill(); ctx.restore(); };
  L1.forEach((x) => ksfx(x.t, x.mode || 'drop', 0.12));
  ksfx(w(0, 9), 'drop', 0.2);
  [1 / 6, 1 / 2, 5 / 6].forEach((u, i) => sfx(B0 + (B1 - B0) * u, 'pop', 0.16 - i * 0.035, { f: 980 - i * 90, pan: 0.4 - i * 0.35 }));
  sfx(B1, 'pop', 0.24, { f: 660, pan: -0.3 });
  sfx(w(0, 6) - 0.05, 'scribble', 0.08, { d: 0.5 }); sfx(B1 + 0.25, 'scribble', 0.07, { d: 0.4 });
  const S2 = { t0: 6.97, t1: 12.32 };
  scene({ name: 'hook', t0: 2.05, t1: S2.t0, ink: 'light', enter: { type: 'bars', dur: 0.47 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    const L = lay();
    K.words(ctx, L1, L.right, L1Y, t, { size: L1S, color: C.ink, stagger: 0.03 });
    FX.note(ctx, 'من الضروري أن تمتلك', L.right, L1Y + 96, { p: inv(w(0, 6), w(0, 6) + 1.1, t), size: 32, color: C.slate, t });
    FX.kword(ctx, HW, L.right, HY, { size: HS, color: C.ink, lt: t - w(0, 9), mode: 'drop', stagger: 0.05 });
    K.under(ctx, L.right, L.left2, HY + 112, inv(B1 + 0.2, B1 + 0.75, t), { t });
    if (t >= B0) FX.ghosts(ctx, 4, 0.03, t, (tt, k) => ball(ctx, tt, L.r * (1 - k * 0.06)), { alpha: 0.4 });
    marks(ctx, 'light');
  } });

  // ================================================================ S2 — the question (dark): «لماذا ؟»
  const C2 = [{ s: 'في', t: w(1, 0) }, { s: 'هذا', t: w(1, 1) }, { s: 'الدرس', t: w(1, 2) }, { s: 'سنجيب', t: w(2, 0) }, { s: 'عن', t: w(2, 1) }, { s: 'سؤال', t: w(2, 2) }];
  const Q2 = [{ s: 'تحتاج', t: w(3, 1) }, { s: 'إلى', t: w(3, 2) }, { s: 'استراتيجية', t: w(3, 3) }, { s: 'تداول', t: w(3, 4) }];
  sfx(S2.t0 - 0.42, 'ripple', 0.22, { pan: -0.4 });
  ksfx(w(3, 0), 'stretch', 0.24); ksfx(w(3, 4) + 0.32, 'bounce', 0.2, 600);
  Q2.forEach((x) => sfx(x.t + 0.18, 'tick', 0.06, { f: 2600 }));
  scene({ name: 'question', t0: S2.t0, t1: S2.t1, ink: 'dark', enter: { type: 'ripple', dur: 0.42, get x() { return lay().dotX; }, get y() { return lay().dotY; } }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    const cw = K.wordsWidth(C2, { size: 58, w: 'R' });
    K.words(ctx, C2, 960 + cw / 2, 285, t, { size: 58, w: 'R', color: SUB, mode: 'rise', stagger: 0.02 });
    const ww = FX.kwidth('لماذا', 300), qw = FX.kwidth('؟', 300); const right = 960 + (ww + qw + 26) / 2;
    FX.kword(ctx, 'لماذا', right, 655, { size: 300, color: C.white, lt: t - w(3, 0), mode: 'stretch' });
    FX.kword(ctx, '؟', right - ww - 26, 655, { size: 300, color: C.red, lt: t - (w(3, 4) + 0.32), mode: 'bounce' });
    const qw2 = K.wordsWidth(Q2, { size: 76 });
    K.words(ctx, Q2, 960 + qw2 / 2, 858, t, { size: 76, color: C.white, mode: 'drop', stagger: 0.025 });
    marks(ctx, 'dark');
  } });

  // ================================================================ S3 — «تخيّل نفسك قائداً عسكرياً يستعد للحرب» (light, red SNAP)
  const S3 = { t0: S2.t1, t1: 16.08 };
  sfx(S3.t0 - 0.3, 'whip', 0.22);
  ksfx(w(4, 2), 'drop', 0.2, 1200); ksfx(w(4, 3), 'slide', 0.2, 700); ksfx(w(5 - 1, 5), 'snap', 0.26, 700);
  F.SHUTTER.push([S3.t0 - 0.42, S3.t0, 1.6 / 60]);
  scene({ name: 'commander', t0: S3.t0, t1: S3.t1, ink: 'light', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    const cap = [{ s: 'تخيّل', t: w(4, 0) }, { s: 'نفسك', t: w(4, 1) }];
    const big = [{ s: 'قائداً', t: w(4, 2), mode: 'drop' }, { s: 'عسكرياً', t: w(4, 3), mode: 'slide' }];
    const bw = K.wordsWidth(big, { size: 190 }); const right = 960 + bw / 2;
    K.words(ctx, cap, right, 300, t, { size: 64, w: 'R', color: C.slate, mode: 'rise' });
    K.words(ctx, big, right, 570, t, { size: 190, color: C.ink, stagger: 0.04 });
    const ww = FX.kwidth('للحرب', 190);
    FX.kword(ctx, 'يستعد', right, 815, { size: 80, w: 'R', color: C.ink, lt: t - w(4, 4), mode: 'rise' });
    const xr = right - FX.kwidth('يستعد', 80, 'R') - 34;
    // SNAP guides: red construction lines through the frame, then the word appears with no easing
    const gp = eo(t, w(4, 5) - 0.12, 0.22);
    if (gp > 0) {
      ctx.save(); ctx.strokeStyle = hexA(C.red, 0.55); ctx.lineWidth = 1.5;
      const ys = [815, 815 - 140], xs = [xr + 14, xr - ww - 14];
      ys.forEach((y) => { ctx.beginPath(); ctx.moveTo(W, y); ctx.lineTo(W - W * gp, y); ctx.stroke(); });
      xs.forEach((x) => { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H * gp); ctx.stroke(); });
      ctx.restore();
    }
    FX.kword(ctx, 'للحرب', xr, 815, { size: 190, color: C.red, lt: t - w(4, 5), mode: 'snap' });
    FX.note(ctx, 'بلا تردّد', xr - ww - 40, 700, { p: inv(w(4, 5) + 0.3, w(4, 5) + 0.9, t), size: 28, color: C.slate, t });
    marks(ctx, 'light');
  } });

  // ================================================================ war map (shared by S4 and S9)
  const HQ = { u: 0, v: 250 };
  const TG = [{ u: -650, v: -300, s: 'EUR/USD' }, { u: -200, v: -520, s: 'XAU/USD' }, { u: 290, v: -470, s: 'US500' }, { u: 700, v: -230, s: 'BTC/USD' }];
  const BATTLES = (() => {
    const r = A.rng(17); const out = [];
    while (out.length < 46) {
      const u = (r() - 0.5) * 1900, v = -600 + r() * 930; const near = [HQ].concat(TG).some((q) => Math.hypot(q.u - u, q.v - v) < 150);
      if (near || out.some((b) => Math.hypot(b.u - u, b.v - v) < 120)) continue;
      out.push({ u, v, win: r() < 0.7, d: Math.hypot(u - HQ.u, v - HQ.v), j: r() });
    }
    const dm = Math.max(...out.map((b) => b.d)); out.forEach((b) => (b.q = b.d / dm)); return out;
  })();
  const ringPts = (P, u, v, r, n = 36) => Array.from({ length: n + 1 }, (_, i) => { const a = i / n * 6.283; const [x, y] = P(u + Math.cos(a) * r, v + Math.sin(a) * r); return [x, y]; });
  function mapBase(ctx, P, t, o = {}) {
    K.planeDots(ctx, P, [-1150, 1150, -760, 640], 50, { alpha: 0.2, r: 2.3 });
    // frame of the table
    const fr = [[-1100, -720], [1100, -720], [1100, 600], [-1100, 600], [-1100, -720]].map(([u, v]) => P(u, v));
    ctx.save(); ctx.strokeStyle = hexA(C.white, 0.12); ctx.lineWidth = 1.5; A.tracePts(ctx, fr); ctx.stroke(); ctx.restore();
    // HQ: you
    const [hx, hy, hk] = P(HQ.u, HQ.v); const pu = o.hq == null ? 1 : o.hq;
    if (pu > 0) {
      for (let i = 0; i < 2; i++) { const ph = ((t * 0.8 + i * 0.5) % 1); ctx.strokeStyle = hexA(C.red, 0.5 * (1 - ph) * pu); ctx.lineWidth = 2; ctx.beginPath(); A.tracePts(ctx, ringPts(P, HQ.u, HQ.v, 30 + ph * 90)); ctx.stroke(); }
      ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(hx, hy, 15 * hk * FX.springU(pu * 1.2, 12, 0.5), 0, 6.283); ctx.fill();
    }
  }
  function mapTargets(ctx, P, t, t0, o = {}) {
    TG.forEach((g, i) => {
      const p = eo(t, t0 + i * 0.12, 0.5); if (p <= 0) return;
      ctx.save(); ctx.globalAlpha = p; ctx.strokeStyle = hexA(C.white, 0.85); ctx.lineWidth = 2; A.tracePts(ctx, ringPts(P, g.u, g.v, 34)); ctx.stroke();
      A.tracePts(ctx, ringPts(P, g.u, g.v, 14)); ctx.stroke(); ctx.restore();
      if (o.labels !== false) {
        const lp = eo(t, (o.labelT || t0) + i * 0.14, 0.45); if (lp <= 0) return; const [x, y] = P(g.u, g.v, 120 * lp);
        const [x0, y0] = P(g.u, g.v); ctx.save(); ctx.strokeStyle = hexA(C.white, 0.5 * lp); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y + 18); ctx.stroke(); ctx.restore();
        K.chip(ctx, g.s, x, y, { p: lp, align: 'center', size: 22, fill: 'rgba(20,22,26,0.85)', stroke: hexA(C.white, 0.35), color: C.white });
      }
    });
  }
  function route(P, a, b, bend = 0.18, n = 40) {
    const mu = (a.u + b.u) / 2, mv = (a.v + b.v) / 2; const cu = mu - (b.v - a.v) * bend, cv = mv + (b.u - a.u) * bend; const pts = [];
    for (let i = 0; i <= n; i++) { const q = i / n; pts.push([(1 - q) * (1 - q) * a.u + 2 * (1 - q) * q * cu + q * q * b.u, (1 - q) * (1 - q) * a.v + 2 * (1 - q) * q * cv + q * q * b.v]); }
    return pts;
  }
  function drawRoute(ctx, P, pts, p, o = {}) {
    if (p <= 0) return; const q = pts.map(([u, v]) => P(u, v)).map(([x, y]) => [x, y]); const sub = A.subPath(q, 0, clamp(p)); if (sub.length < 2) return;
    ctx.save(); ctx.strokeStyle = o.color || C.white; ctx.lineWidth = o.width || 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (o.dash) ctx.setLineDash(o.dash); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    A.tracePts(ctx, sub); ctx.stroke(); ctx.setLineDash([]);
    if (p >= 0.98 && o.head !== false) { const e = sub[sub.length - 1], b = sub[Math.max(0, sub.length - 3)]; const ang = Math.atan2(e[1] - b[1], e[0] - b[0]); const L = 18; ctx.beginPath(); ctx.moveTo(e[0] - Math.cos(ang - 0.45) * L, e[1] - Math.sin(ang - 0.45) * L); ctx.lineTo(e[0], e[1]); ctx.lineTo(e[0] - Math.cos(ang + 0.45) * L, e[1] - Math.sin(ang + 0.45) * L); ctx.stroke(); }
    ctx.restore(); return sub[sub.length - 1];
  }
  function battles(ctx, P, t, o) {
    // o: tA (wave start), spread, res (resolve delay), shrink (time losses shrink), skip: {t, ids}
    BATTLES.forEach((b, i) => {
      const ta = o.tA + b.q * o.spread + b.j * 0.12; const p = eo(t, ta, 0.35); if (p <= 0) return;
      const [x, y, k] = P(b.u, b.v); const tr = ta + o.res; const rp = eo(t, tr, 0.3);
      let r = 11 * k * FX.springU(t - ta, 16, 0.45);
      const col = b.win ? C.mint : C.red;
      if (o.shrink != null && !b.win) r *= lerp(1, 0.45, eio(t, o.shrink + b.j * 0.25, 0.5));
      if (o.shrink != null && b.win) r *= 1 + 0.25 * eo(t, o.shrink + b.j * 0.25, 0.4) * (1 - eo(t, o.shrink + 0.6 + b.j * 0.25, 0.6));
      ctx.save();
      if (rp > 0 && rp < 1) { ctx.strokeStyle = hexA(col, 1 - rp); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r + 26 * k * rp, 0, 6.283); ctx.stroke(); }
      if (rp > 0) { ctx.fillStyle = col; ctx.globalAlpha = Math.min(1, 0.35 + rp); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }
      else { ctx.strokeStyle = hexA(C.white, 0.8); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.stroke(); }
      ctx.restore();
      if (o.skip && o.skip.ids.includes(i)) FX.cross(ctx, x, y, 34 * k, inv(o.skip.t + o.skip.ids.indexOf(i) * 0.09, o.skip.t + o.skip.ids.indexOf(i) * 0.09 + 0.3, t), SIL, t);
    });
  }
  // map titles (screen space, top-right block)
  function mapTitle(ctx, t, lines) {
    lines.forEach((ln) => { K.words(ctx, ln.words, 1780, ln.y, t, { size: ln.size, w: ln.w || 'X', color: ln.color || C.white, mode: ln.mode || 'drop', stagger: 0.03, out: ln.out != null ? clamp((t - ln.out) / 0.5) : undefined }); });
  }

  // ================================================================ S4 — the war map: plan · markets · many small battles · cut losses
  const S4 = { t0: S3.t1, t1: 28.5 };
  sfx(S4.t0 - 0.5, 'shutter', 0.2); sfx(S4.t0 + 0.1, 'whoosh', 0.14, { d: 0.9, up: false });
  ksfx(w(6, 1), 'drop', 0.18, 1500); TG.forEach((g, i) => sfx(w(6, 0) + 0.25 + i * 0.32, 'scribble', 0.07, { d: 0.35, pan: g.u / 1400 }));
  TG.forEach((g, i) => sfx(w(7, 2) + i * 0.14, 'pop', 0.12, { f: 900 + i * 80, pan: g.u / 1400 }));
  ksfx(w(8, 1), 'drop', 0.16, 1500); ksfx(w(9, 5), 'drop', 0.18, 1500); ksfx(w(10, 1), 'drop', 0.18, 1500);
  BATTLES.slice().sort((a, b) => a.q - b.q).forEach((b, i) => { if (i % 3 === 0) sfx(w(9, 1) + b.q * 2.2 + b.j * 0.12 + 0.55, b.win ? 'tick' : 'buzz', b.win ? 0.05 : 0.03, { f: 2400 + i * 15, pan: b.u / 1500 }); });
  sfx(w(10, 2) - 0.1, 'bloop', 0.14);
  scene({ name: 'warmap', t0: S4.t0, t1: S4.t1, ink: 'dark', enter: { type: 'bars', dur: 0.5 }, draw(ctx, t) {
    FX.bg(ctx, 'dark', { dots: false });
    const tilt = lerp(0.0, 0.98, eio(t, S4.t0 + 0.05, 1.0)); const rot = lerp(-0.12, 0.16, inv(S4.t0, S4.t1, t));
    const sc = lerp(0.82, 1.0, eio(t, S4.t0, 1.2)) * lerp(1, 1.08, eio(t, w(9, 0), 4));
    const P = K.plane({ cx: 960, cy: 600, f: 1500, tilt, rot, scale: sc, oy: -40 });
    mapBase(ctx, P, t, { hq: eo(t, S4.t0 + 0.3, 0.6) });
    // «أنت»
    const [hx, hy] = P(HQ.u, HQ.v);
    FX.note(ctx, 'أنت', hx - 60, hy + 8, { p: inv(S4.t0 + 0.5, S4.t0 + 1.1, t), size: 30, color: SIL, w: 'S', to: [hx - 22, hy + 2], from: [hx - 70, hy - 8], bend: 0.3, t, alpha: 1 - eo(t, w(9, 0), 0.4) });
    // plan: routes to every market
    TG.forEach((g, i) => drawRoute(ctx, P, route(P, HQ, g, i % 2 ? 0.16 : -0.16), eo(t, w(6, 0) + 0.25 + i * 0.32, 0.8), { dash: [12, 9], color: hexA(C.white, 0.75), width: 2.4 }));
    mapTargets(ctx, P, t, w(6, 0) + 0.1, { labelT: w(7, 2) });
    battles(ctx, P, t, { tA: w(9, 1), spread: 2.2, res: 0.55, shrink: w(10, 1) });
    // titles
    mapTitle(ctx, t, [
      { y: 250, size: 120, words: [{ s: 'خطة', t: w(6, 1) }, { s: 'شاملة', t: w(6, 2) }], out: w(8, 0) - 0.2 },
      { y: 345, size: 52, w: 'R', color: SUB, mode: 'rise', words: [{ s: 'للتفوّق', t: w(7, 0) }, { s: 'على', t: w(7, 1) }, { s: 'الأسواق', t: w(7, 2) }], out: w(8, 0) - 0.25 },
      { y: 250, size: 110, words: [{ s: 'نجاحك', t: w(8, 1) }, { s: 'النهائي', t: w(8, 2) }], out: w(9, 5) - 0.3 },
      { y: 250, size: 110, words: [{ s: 'المعارك', t: w(9, 5) }, { s: 'الصغيرة', t: w(9, 6) }], out: w(10, 0) - 0.15 },
      { y: 250, size: 110, words: [{ s: 'تقليل', t: w(10, 1) }, { s: 'الخسائر', t: w(10, 2), color: C.red }] },
    ]);
    // legend
    const lg = eo(t, w(9, 6), 0.5);
    if (lg > 0) {
      ctx.save(); ctx.globalAlpha = lg;
      ctx.fillStyle = C.mint; ctx.beginPath(); ctx.arc(1768, 330, 9, 0, 6.283); ctx.fill(); txt(ctx, 'معركة رابحة', 1744, 339, { size: 24, color: SUB });
      ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(1768, 372, 9 * lerp(1, 0.5, eio(t, w(10, 1), 0.5)), 0, 6.283); ctx.fill(); txt(ctx, 'خسارة صغيرة', 1744, 381, { size: 24, color: SUB });
      ctx.restore();
    }
    marks(ctx, 'dark');
  } });

  // ================================================================ S5 — «الخسائر ستحدث لا محالة» (light)
  const S5 = { t0: 28.5, t1: 32.9 };
  ksfx(w(11, 5), 'drop', 0.24); ksfx(w(12, 0), 'rise', 0.16); ksfx(w(12, 2), 'slam', 0.22);
  scene({ name: 'losses', t0: S5.t0, t1: S5.t1, ink: 'light', enter: { type: 'bars', dur: 0.5 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    const cap = [{ s: 'من', t: w(11, 0) }, { s: 'المهم', t: w(11, 1) }, { s: 'أن', t: w(11, 2) }, { s: 'تدرك', t: w(11, 3) }];
    const cw = K.wordsWidth(cap, { size: 58, w: 'R' }); K.words(ctx, cap, 960 + cw / 2, 290, t, { size: 58, w: 'R', color: C.slate, mode: 'rise' });
    const bw = FX.kwidth('الخسائر', 270); FX.kword(ctx, 'الخسائر', 960 + bw / 2, 610, { size: 270, color: C.red, lt: t - w(11, 5), mode: 'drop', stagger: 0.05 });
    const l2 = [{ s: 'ستحدث', t: w(12, 0), mode: 'rise' }, { s: 'لا محالة', t: w(12, 1), mode: 'slam' }];
    const l2w = K.wordsWidth(l2, { size: 110 }); K.words(ctx, l2, 960 + l2w / 2, 850, t, { size: 110, color: C.ink });
    FX.note(ctx, 'جزء طبيعي من التداول', 960 - bw / 2 - 30, 420, { p: inv(w(12, 0) + 0.2, w(12, 0) + 1.2, t), size: 30, color: C.slate, align: 'right', to: [960 - bw / 2 + 40, 520], from: [960 - bw / 2 - 150, 436], bend: 0.35, t });
    marks(ctx, 'light');
  } });

  // ================================================================ S6 — ring loader: even the best don't win every trade (dark)
  const S6 = { t0: S5.t1, t1: 36.72 };
  const RES = [1, 1, 0, 1, 1, 1, 0, 1, 0, 1]; const RT0 = w(13, 1) - 0.1, RDT = 0.27;
  sfx(S6.t0 - 0.45, 'shutter', 0.18);
  RES.forEach((r, i) => sfx(RT0 + i * RDT + 0.18, r ? 'tick' : 'buzz', r ? 0.09 : 0.05, { f: 2200 + i * 120 }));
  ksfx(w(14, 1), 'drop', 0.16);
  scene({ name: 'ring', t0: S6.t0, t1: S6.t1, ink: 'dark', enter: { type: 'slices', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    const cx = 960, cy = 560, R = 230;
    const cap = [{ s: 'حتى', t: w(13, 0) }, { s: 'أفضل', t: w(13, 1) }, { s: 'المتداولين', t: w(13, 2) }];
    const cw = K.wordsWidth(cap, { size: 64, w: 'S' }); K.words(ctx, cap, 960 + cw / 2, 230, t, { size: 64, w: 'S', color: C.white, mode: 'rise' });
    // inner tick ring rotating (texture), outer progress segments
    const app = eo(t, S6.t0 - 0.2, 0.6);
    ctx.save(); ctx.globalAlpha = app;
    for (let i = 0; i < 72; i++) { const a = i / 72 * 6.283 + t * 0.15; const r0 = R * 0.66, r1 = R * (i % 6 === 0 ? 0.74 : 0.7); ctx.strokeStyle = hexA(C.white, i % 6 === 0 ? 0.4 : 0.18); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.stroke(); }
    ctx.strokeStyle = hexA(C.white, 0.16); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
    ctx.restore();
    let wins = 0, done = 0; const seg = 6.283 / 10, gap = 0.06; const pulse = eo(t, w(14, 0), 0.3) * (1 - eo(t, w(14, 0) + 0.5, 0.6));
    RES.forEach((r, i) => {
      const p = eio(t, RT0 + i * RDT, 0.24); if (p <= 0) return; if (p >= 1) { done++; if (r) wins++; }
      const a0 = -Math.PI / 2 + i * seg + gap / 2; const col = r ? C.mint : C.red;
      const lw = r ? 10 : 10 + pulse * 10; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'butt';
      ctx.beginPath(); ctx.arc(cx, cy, R, a0, a0 + (seg - gap) * p); ctx.stroke(); ctx.restore();
      // orbit dot like the reference: rides the head of the newest segment
      if (p < 1) { const a = a0 + (seg - gap) * p; ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 8, 0, 6.283); ctx.fill(); }
    });
    // centre count
    if (app > 0) {
      const s = String(wins); const nw = lat(ctx, s, cx + 18, cy + 50, { size: 150, w: 300, color: C.white, align: 'right', alpha: app });
      lat(ctx, '/10', cx + 22, cy + 50, { size: 54, w: 300, color: SIL, align: 'left', alpha: app });
      txt(ctx, 'صفقات رابحة', cx, cy + 110, { size: 28, color: SUB, align: 'center', alpha: app });
    }
    const l2 = [{ s: 'لا', t: w(14, 0) }, { s: 'يربحون', t: w(14, 1) }, { s: 'في', t: w(14, 2) }, { s: 'كل', t: w(14, 3) }, { s: 'صفقة', t: w(14, 4) }];
    const l2w = K.wordsWidth(l2, { size: 70 }); K.words(ctx, l2, 960 + l2w / 2, 890, t, { size: 70, color: C.white, mode: 'drop', stagger: 0.02 });
    txt(ctx, 'مثال توضيحي', cx + R + 60, cy + R - 10, { size: 22, color: hexA(C.white, 0.45), align: 'left', dir: 'rtl', alpha: app });
    marks(ctx, 'dark');
  } });

  // ================================================================ S7 — «تتقبّل الخسارة · وتمضي قُدُماً» (light)
  const S7 = { t0: S6.t1, t1: 42.42 };
  sfx(S7.t0 - 0.45, 'shutter', 0.18);
  ksfx(w(16, 3), 'drop', 0.18); ksfx(w(16, 4), 'drop', 0.18); sfx(w(16, 4) + 0.45, 'pop', 0.16, { f: 420 }); sfx(w(17, 0) - 0.3, 'tick', 0.12);
  sfx(w(17, 0) - 0.05, 'whoosh', 0.22, { d: 0.9, pan: -0.3 }); ksfx(w(17, 1), 'slide', 0.2, 900);
  scene({ name: 'accept', t0: S7.t0, t1: S7.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    const cap = [{ s: 'وأحياناً', t: w(15, 0) }, { s: 'عليك', t: w(16, 0) }, { s: 'ببساطة', t: w(16, 1) }, { s: 'أن', t: w(16, 2) }];
    const cw = K.wordsWidth(cap, { size: 58, w: 'R' }); K.words(ctx, cap, 960 + cw / 2, 290, t, { size: 58, w: 'R', color: C.slate, mode: 'rise', out: clamp((t - (w(17, 0) - 0.2)) / 0.5) });
    const outA = clamp((t - (w(17, 0) - 0.25)) / 0.55);
    const l1 = [{ s: 'تتقبّل', t: w(16, 3) }, { s: 'الخسارة', t: w(16, 4) }]; const l1w = K.wordsWidth(l1, { size: 170 });
    const L = K.words(ctx, l1, 960 + l1w / 2, 580, t, { size: 170, color: C.ink, stagger: 0.04, out: outA });
    // loss ticket: drops in, gets a check (accepted), shrinks away
    const tp = FX.springU(t - (w(15, 0) + 0.15), 15, 0.5); const gone = ei(t, w(17, 0) - 0.3, 0.35); const dock = eio(t, w(16, 3) - 0.35, 0.5);
    if (tp > 0 && gone < 1) {
      const x = lerp(960, 960 - l1w / 2 - 150, dock), y = lerp(580, 470, dock); const sc = lerp(1.6, 1, dock) * (1 - gone);
      ctx.save(); ctx.translate(x, y + (1 - tp) * -160); ctx.rotate(-0.06 * (1 - gone)); ctx.scale(sc, sc);
      A.roundRect(ctx, -105, -46, 210, 92, 18); ctx.fillStyle = C.ink; ctx.fill();
      lat(ctx, '−1.2%', 0, 16, { size: 44, w: 700, color: C.red, align: 'center' }); ctx.restore();
      if (dock >= 1) FX.check(ctx, x + 90, y - 50, 44, inv(w(17, 0) - 0.55, w(17, 0) - 0.3, t), C.slate, t);
    }
    // move on: red follow-through snake leads «وتمضي قُدُماً» leftward (forward in RTL)
    const t0s = w(17, 0) - 0.05; const lead = (tt) => { const u = eio(tt, t0s, 1.15); return [lerp(1980, 330, u), 590 + Math.sin(u * 7.5) * 26 * (1 - u)]; };
    if (t > t0s) K.snake(ctx, lead, t, 12, 0.034, { r: 22, color: C.red });
    const l2 = [{ s: 'وتمضي', t: w(17, 0) + 0.1, size: 120, mode: 'slide' }, { s: 'قُدُماً', t: w(17, 1), size: 230, mode: 'slide' }];
    const l2w = K.wordsWidth(l2); K.words(ctx, l2, 960 + l2w / 2 + 20, 650, t, { color: C.ink, stagger: 0.03 });
    marks(ctx, 'light');
  } });

  // ================================================================ S8 — favorable conditions · «فلا تتردّد» (dark)
  const S8 = { t0: S7.t1, t1: 46.75 };
  const CONDS = ['اتجاه واضح', 'مستوى دعم', 'إشارة دخول'];
  sfx(S8.t0 - 0.42, 'whip', 0.2); F.SHUTTER.push([S8.t0 - 0.42, S8.t0, 1.6 / 60]);
  ksfx(w(19, 2), 'drop', 0.16); CONDS.forEach((c, i) => sfx(w(19, 3) + 0.35 + i * 0.28, 'tick', 0.14, { f: 3000 + i * 300 }));
  ksfx(w(20, 1), 'stretch', 0.26);
  scene({ name: 'favorable', t0: S8.t0, t1: S8.t1, ink: 'dark', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    const outA = clamp((t - (w(20, 0) - 0.15)) / 0.5);
    const cap = [{ s: 'وبالمثل', t: w(18, 0) }, { s: 'إذا', t: w(19, 0) }, { s: 'صادفت', t: w(19, 1) }];
    const cw = K.wordsWidth(cap, { size: 58, w: 'R' }); K.words(ctx, cap, 960 + cw / 2, 300, t, { size: 58, w: 'R', color: SUB, mode: 'rise', out: outA });
    const l1 = [{ s: 'الظروف', t: w(19, 2) }, { s: 'المواتية', t: w(19, 3) }]; const l1w = K.wordsWidth(l1, { size: 140 });
    K.words(ctx, l1, 960 + l1w / 2, 520, t, { size: 140, color: C.white, stagger: 0.035, out: outA });
    // three conditions pass (mint = passed state)
    const cws = CONDS.map((c) => measure(ctx, c, 30, 'S') + 110); let x = 960 + (cws.reduce((a, b) => a + b, 0) + 30 * (CONDS.length - 1)) / 2;
    CONDS.forEach((c, i) => {
      const p = eo(t, w(19, 3) + 0.35 + i * 0.28, 0.4) * (1 - outA); const cwid = cws[i];
      if (p > 0) {
        ctx.save(); ctx.globalAlpha = p; const y = 690 + (1 - p) * 30; A.roundRect(ctx, x - cwid, y - 36, cwid, 72, 36); ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fill(); ctx.strokeStyle = hexA(C.mint, 0.7); ctx.lineWidth = 2; ctx.stroke();
        txt(ctx, c, x - 26, y + 10, { size: 30, w: 'S', color: C.white }); ctx.restore();
        FX.check(ctx, x - cwid + 42, y - 2, 30, inv(w(19, 3) + 0.45 + i * 0.28, w(19, 3) + 0.75 + i * 0.28, t) * (1 - outA), C.mint, t);
      }
      x -= cwid + 30;
    });
    FX.kword(ctx, 'فلا', 960 + FX.kwidth('فلا', 90) / 2, 400, { size: 90, color: SUB, lt: t - w(20, 0), mode: 'rise' });
    FX.kword(ctx, 'تتردّد', 960 + FX.kwidth('تتردّد', 270) / 2, 700, { size: 270, color: C.white, lt: t - w(20, 1), mode: 'stretch' });
    marks(ctx, 'dark');
  } });

  // ================================================================ S9b — confidence to size up (light): spacing boxes = risk units
  const S9 = { t0: S8.t1, t1: 52.95 };
  sfx(S9.t0 - 0.45, 'shutter', 0.18);
  ksfx(w(22, 2), 'bounce', 0.2); ksfx(w(22, 3), 'drop', 0.14);
  for (let i = 0; i < 10; i++) sfx(w(23, 0) + 0.15 + (i < 4 ? i * 0.06 : 0.4 + (i - 4) * 0.09), 'tick', i < 4 ? 0.03 : 0.08, { f: 1800 + i * 160 });
  scene({ name: 'confidence', t0: S9.t0, t1: S9.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    const cap = [{ s: 'وهذا', t: w(21, 0) }, { s: 'يعني', t: w(21, 1) }, { s: 'في', t: w(21, 2) }, { s: 'لغة', t: w(21, 3) }, { s: 'التداول', t: w(21, 4) }];
    const cw = K.wordsWidth(cap, { size: 56, w: 'R' }); K.words(ctx, cap, 960 + cw / 2, 270, t, { size: 56, w: 'R', color: C.slate, mode: 'rise' });
    const l1 = [{ s: 'الثقة', t: w(22, 2), mode: 'bounce' }, { s: 'الكافية', t: w(22, 3) }]; const l1w = K.wordsWidth(l1, { size: 170 });
    K.words(ctx, l1, 960 + l1w / 2, 520, t, { size: 170, color: C.ink, stagger: 0.04 });
    // risk units row (reference spacing boxes): 10 outlined boxes, fill 4 → 8 at «لزيادة مخاطراتك»
    const n = 10, bs = 64, gap = 18, rowW = n * bs + (n - 1) * gap, xr = 960 + rowW / 2, y = 700;
    const app = eo(t, w(23, 0) - 0.5, 0.5);
    for (let i = 0; i < n; i++) {
      const x = xr - (i + 1) * bs - i * gap; const pa = eo(t, w(23, 0) - 0.5 + i * 0.03, 0.4); if (pa <= 0) continue;
      ctx.save(); ctx.globalAlpha = pa; ctx.strokeStyle = hexA(C.red, 0.55); ctx.lineWidth = 2; A.roundRect(ctx, x, y - bs / 2, bs, bs, 6); ctx.stroke();
      const ft = i < 4 ? w(23, 0) + 0.15 + i * 0.06 : w(23, 1) - 0.2 + (i - 4) * 0.09; const fp = FX.springU(t - ft, 18, 0.5);
      if (i < 8 && fp > 0) { const s = bs * clamp(fp, 0, 1.2); ctx.fillStyle = C.ink; A.roundRect(ctx, x + bs / 2 - s / 2, y - s / 2, s, s, 6); ctx.fill(); }
      ctx.restore();
    }
    if (app > 0) {
      txt(ctx, 'حجم المخاطرة', xr, y - 62, { size: 26, w: 'S', color: C.charcoal, alpha: app });
      const v = t < w(23, 1) - 0.2 ? 1 : lerp(1, 2, eo(t, w(23, 1) - 0.2, 0.7)); lat(ctx, v.toFixed(1) + '%', xr - rowW, y - 62, { size: 30, w: 700, color: C.ink, align: 'left', alpha: app });
      FX.note(ctx, 'مخاطرة محسوبة', xr - rowW - 34, y + 12, { p: inv(we(23, 1) - 0.3, we(23, 1) + 0.5, t), size: 30, color: C.slate, t });
    }
    const l2 = [{ s: 'لزيادة', t: w(23, 0) }, { s: 'مخاطراتك', t: w(23, 1) }]; const l2w = K.wordsWidth(l2, { size: 64, w: 'S' });
    K.words(ctx, l2, 960 + l2w / 2, 880, t, { size: 64, w: 'S', color: C.ink, mode: 'rise' });
    marks(ctx, 'light');
  } });

  // ================================================================ S9 — plan B, exit route, skip battles, retreat early (dark map)
  const S10 = { t0: S9.t1, t1: 67.12 };
  const TA = TG[1], TB = TG[3];
  sfx(S10.t0 - 0.5, 'shutter', 0.2); sfx(S10.t0 + 0.1, 'whoosh', 0.14, { d: 0.9, up: false });
  sfx(w(25, 1) + 0.1, 'scribble', 0.1, { d: 0.9 }); ksfx(w(26, 0), 'drop', 0.18, 1500); sfx(w(26, 0) + 0.1, 'scribble', 0.1, { d: 0.7 });
  ksfx(w(27, 1), 'snap', 0.2, 1500); sfx(w(27, 1) + 0.05, 'whoosh', 0.14, { d: 0.6 });
  [3, 8, 12, 19, 27, 33].forEach((id, i) => sfx(w(28, 4) + i * 0.09 + 0.1, 'tick', 0.06, { f: 1500 }));
  sfx(w(29, 3) - 0.1, 'whoosh', 0.16, { d: 0.5 }); sfx(w(29, 3) + 0.5, 'whip', 0.12); sfx(w(29, 5) + 0.05, 'pop', 0.14, { f: 380 });
  scene({ name: 'planB', t0: S10.t0, t1: S10.t1, ink: 'dark', enter: { type: 'bars', dur: 0.5 }, draw(ctx, t) {
    FX.bg(ctx, 'dark', { dots: false });
    const tilt = lerp(0.0, 0.98, eio(t, S10.t0 + 0.05, 1.0)); const rot = lerp(0.14, -0.1, inv(S10.t0, S10.t1, t));
    const sc = lerp(0.82, 1.0, eio(t, S10.t0, 1.2));
    const P = K.plane({ cx: 960, cy: 600, f: 1500, tilt, rot, scale: sc, oy: -40 });
    mapBase(ctx, P, t, { hq: eo(t, S10.t0 + 0.3, 0.6) });
    mapTargets(ctx, P, t, S10.t0 + 0.4, { labels: false });
    const [hx, hy] = P(HQ.u, HQ.v);
    FX.note(ctx, 'القائد الجيد', hx - 70, hy + 10, { p: inv(w(25, 1), w(25, 1) + 0.7, t), size: 28, color: SIL, w: 'S', t, alpha: 1 - eo(t, w(28, 0), 0.4) });
    // route A, branch B (from the midpoint), exit route (red) bending back to the edge
    const rA = route(P, HQ, TA, -0.14); const mid = rA[18];
    const pA = eo(t, w(25, 1) + 0.1, 1.0); drawRoute(ctx, P, rA, pA, { color: C.white, width: 3.2 });
    const rB = route(P, { u: mid[0], v: mid[1] }, TB, 0.2); const pB = eo(t, w(26, 0) + 0.1, 0.9); drawRoute(ctx, P, rB, pB, { color: SIL, width: 2.6, dash: [12, 10] });
    const rX = route(P, { u: mid[0], v: mid[1] }, { u: -1060, v: 520 }, 0.25); const pX = eo(t, w(27, 1) + 0.05, 0.8); drawRoute(ctx, P, rX, pX, { color: C.red, width: 3.2 });
    const chipAt = (pts, k, s, p, col, txtc) => { if (p <= 0) return; const [u, v] = pts[k]; const [x, y] = P(u, v, 60); K.chip(ctx, s, x, y, { p, align: 'center', size: 24, fill: col, stroke: col, color: txtc }); };
    const fade = 1 - eo(t, w(28, 0), 0.5);
    chipAt(rA, 30, 'A', eo(t, w(25, 1) + 0.6, 0.4) * fade, C.white, C.ink); chipAt(rB, 24, 'B', eo(t, w(26, 1), 0.4) * fade, C.silver, C.ink);
    chipAt(rX, 22, 'خروج', eo(t, w(27, 1) + 0.5, 0.4) * fade, C.red, C.white);
    // don't fight every battle: battles appear, some get crossed out
    battles(ctx, P, t, { tA: w(28, 0), spread: 1.2, res: 99, skip: { t: w(28, 4), ids: [3, 8, 12, 19, 27, 33] } });
    // early retreat: unit heads to a target, U-turns home; small loss marker at the turn
    const out = route(P, HQ, { u: 860, v: -60 }, -0.12); const T1 = w(29, 3) - 0.9, T2 = w(29, 3) + 0.15, T3 = w(29, 5) + 0.7;
    const sAt = (tt) => (tt < T2 ? 0.55 * eio(tt, T1, T2 - T1) : 0.55 * (1 - eio(tt, T2 + 0.1, T3 - T2 - 0.1)));
    const posAt = (tt) => { const s = sAt(tt); const i = Math.min(out.length - 1, Math.floor(s * (out.length - 1))); const [u, v] = out[i]; const side = tt > T2 + 0.05 ? 34 * Math.min(1, (tt - T2) * 4) : 0; const [x, y] = P(u + side, v + side * 0.4); return [x, y]; };
    if (t > T1 && t < T3 + 0.6) { ctx.save(); ctx.globalAlpha = 1 - eo(t, T3, 0.5); K.snake(ctx, posAt, t, 20, 0.022, { r: 15, color: C.white }); ctx.restore(); }
    const tp = out[Math.floor(0.55 * (out.length - 1))]; const [lx, ly] = P(tp[0], tp[1], 70);
    const [ux, uy] = P(tp[0], tp[1]); FX.arrow(ctx, [ux + 30, uy - 10], [ux + 70, uy + 90], { p: eo(t, T2 + 0.05, 0.5), color: SIL, bend: -0.9, width: 2.6, t });
    K.chip(ctx, '−0.5%', lx, ly, { p: eo(t, w(29, 5), 0.4), align: 'center', size: 24, fill: C.ink, stroke: hexA(C.red, 0.8), color: C.red });
    mapTitle(ctx, t, [
      { y: 245, size: 54, w: 'R', color: SUB, mode: 'rise', words: [{ s: 'في', t: w(24, 0) }, { s: 'جميع', t: w(24, 1) }, { s: 'الأحوال', t: w(24, 2) }], out: w(26, 0) - 0.3 },
      { y: 250, size: 120, words: [{ s: 'خطة', t: w(26, 0) }, { s: 'بديلة', t: w(26, 1) }], out: w(28, 0) - 0.3 },
      { y: 345, size: 64, w: 'S', words: [{ s: 'واستراتيجية', t: w(27, 0) }, { s: 'للخروج', t: w(27, 1), color: C.red }], out: w(28, 0) - 0.35 },
      { y: 240, size: 66, w: 'S', words: [{ s: 'ليس', t: w(28, 0) }, { s: 'عليك', t: w(28, 1) }, { s: 'أن', t: w(28, 2) }, { s: 'تخوض', t: w(28, 3) }, { s: 'كل', t: w(28, 4) }, { s: 'معركة', t: w(28, 5) }], out: w(29, 2) },
      { y: 250, size: 110, words: [{ s: 'تنسحب', t: w(29, 3) }, { s: 'مبكراً', t: w(29, 4) }] },
      { y: 340, size: 54, w: 'R', color: SUB, mode: 'rise', words: [{ s: 'بخسائر', t: w(29, 5) }, { s: 'صغيرة', t: w(29, 6) }] },
    ]);
    marks(ctx, 'dark');
  } });

  // ================================================================ S11 — survive to fight another day vs. wiped out (light)
  const S11 = { t0: S10.t1, t1: 74.62 };
  const EQ = K.path([[0, 100], [0.2, 95], [0.35, 101], [0.5, 97], [0.7, 106], [0.85, 102], [1, 112]], 140, 5, 1.1);
  const CR = K.path([[0, 100], [0.12, 97], [0.3, 70], [0.42, 78], [0.6, 30], [0.7, 0]], 100, 9, 1.5).map((v) => Math.max(0, v));
  sfx(S11.t0 - 0.45, 'shutter', 0.18); sfx(w(31, 0), 'scribble', 0.08, { d: 2.4 });
  sfx(w(32, 0) + 0.1, 'whoosh', 0.14, { d: 0.6, up: false }); ksfx(w(32, 3), 'snap', 0.22); sfx(w(32, 3) - 0.05, 'buzz', 0.08);
  sfx(w(32, 4), 'glitch', 0.16); sfx(w(32, 4) + 0.1, 'whoosh', 0.2, { d: 1.1 });
  scene({ name: 'survive', t0: S11.t0, t1: S11.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    const box = [380, 400, 1160, 380]; const fr = K.frame(box, 0, 125, EQ.length); const frC = K.frame([380, 400, 1160 * 0.72, 380], 0, 125, CR.length);
    K.axes(ctx, box, eo(t, S11.t0, 0.6), { yl: 'رأس المال', xl: 'الوقت', t });
    const pA = inv(w(31, 0), w(31, 6) + 0.4, t);
    if (pA > 0) { const hd = K.priceLine(ctx, fr, EQ, pA, { color: C.ink, width: 3.4, head: 9, headColor: C.ink }); K.chip(ctx, 'يوماً آخر', hd[0] + 10, hd[1] - 50, { p: eo(t, w(31, 5), 0.4), size: 24, fill: C.ink, stroke: C.ink, color: C.white, align: 'right' }); }
    const pC = inv(w(32, 0) + 0.1, w(32, 3), t);
    if (pC > 0) {
      ctx.save(); ctx.setLineDash([10, 8]); K.priceLine(ctx, frC, CR, pC, { color: C.red, width: 3 }); ctx.restore();
      const hit = [frC.X(CR.length - 1), frC.Y(0)]; if (pC >= 1) FX.cross(ctx, hit[0], hit[1] - 4, 40, inv(w(32, 3) - 0.05, w(32, 3) + 0.2, t), C.red, t);
    }
    // headline row
    const cap = [{ s: 'إذا', t: w(30, 0) }, { s: 'كان', t: w(30, 1) }, { s: 'ذلك', t: w(30, 2) }, { s: 'يعني', t: w(30, 3) }];
    const cw = K.wordsWidth(cap, { size: 54, w: 'R' }); K.words(ctx, cap, 960 + cw / 2, 250, t, { size: 54, w: 'R', color: C.slate, mode: 'rise', out: clamp((t - (w(31, 0) - 0.3)) / 0.4) });
    const l1 = [{ s: 'تبقى', t: w(31, 1) }, { s: 'قادراً', t: w(31, 2) }, { s: 'على', t: w(31, 3) }, { s: 'القتال', t: w(31, 4) }];
    const l1w = K.wordsWidth(l1, { size: 80 }); K.words(ctx, l1, 960 + l1w / 2, 270, t, { size: 80, color: C.ink, mode: 'rise', out: clamp((t - (w(32, 3) - 0.35)) / 0.4) });
    // «تُمحى» snaps in, then disintegrates on «تماماً»
    const dW = FX.kwidth('تُمحى', 210); const dp = inv(w(32, 4), w(32, 4) + 1.6, t);
    if (t >= w(32, 3)) K.dissolve(ctx, 'تُمحى', 960 + dW / 2, 330, { size: 210, color: C.red, p: dp, seed: 8 });
    const l3 = [{ s: 'من', t: w(32, 5) }, { s: 'السوق', t: w(32, 6) }]; const l3w = K.wordsWidth(l3, { size: 60, w: 'S' });
    K.words(ctx, l3, 960 + l3w / 2, 900, t, { size: 60, w: 'S', color: C.ink, mode: 'rise' });
    marks(ctx, 'light');
  } });

  // ================================================================ S12 — the bigger picture: zoom out from one candle (dark)
  const S12 = { t0: S11.t1, t1: 79.36 };
  const BIG = K.path([[0, 40], [0.2, 52], [0.3, 46], [0.5, 63], [0.62, 55], [0.8, 74], [1, 86]], 64, 21, 3.4); const BC = K.candles(BIG, 4, 2.4);
  sfx(S12.t0 - 0.45, 'ripple', 0.2); sfx(w(33, 0), 'revswell', 0.16, { d: 0.6 }); ksfx(w(33, 1) + 0.05, 'slam', 0.24);
  scene({ name: 'bigpicture', t0: S12.t0, t1: S12.t1, ink: 'dark', enter: { type: 'ripple', dur: 0.45, x: 960, y: 560 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    const box = [250, 450, 1420, 420]; const fr = K.frame(box, 28, 96, BIG.length);
    const fi = 42; const fx = fr.X(fi), fy = fr.Y((BC[fi].o + BC[fi].c) / 2);
    const e = eio(t, w(33, 0) - 0.1, 1.5); const s = lerp(11, 1, e);
    ctx.save(); ctx.translate(lerp(960, fx, e), lerp(620, fy, e)); ctx.scale(s, s); ctx.translate(-fx, -fy);
    K.drawCandles(ctx, fr, BC, 1, { body: 0.6, wick: 2 / Math.max(1, s * 0.6) });
    ctx.restore();
    const lp = eo(t, w(33, 0) + 1.2, 0.6);
    if (lp > 0) { ctx.save(); ctx.globalAlpha = lp; ctx.strokeStyle = hexA(C.white, 0.5); ctx.setLineDash([8, 8]); ctx.lineWidth = 1.5; ctx.strokeRect(box[0] - 30, box[1] - 30, box[2] + 60, box[3] + 60); ctx.restore(); }
    const cap = [{ s: 'فرؤية', t: w(33, 0) }]; K.words(ctx, cap, 960 + FX.kwidth('فرؤية', 56, 'R') / 2, 195, t, { size: 56, w: 'R', color: SUB, mode: 'rise', out: clamp((t - (w(34, 0) - 0.3)) / 0.4) });
    const l1 = 'الصورة الأكبر'; const lw = FX.kwidth(l1, 150); FX.kword(ctx, l1, 960 + lw / 2, 370, { size: 150, color: C.white, lt: t - (w(33, 1) + 0.05), mode: 'slam' });
    const l2 = [{ s: 'جزء', t: w(34, 0) }, { s: 'أساسي', t: w(34, 1) }, { s: 'من', t: w(34, 2) }, { s: 'خطة', t: w(34, 3) }, { s: 'التداول', t: w(34, 4) }];
    const l2w = K.wordsWidth(l2, { size: 56, w: 'R' }); K.words(ctx, l2, 960 + l2w / 2, 195, t, { size: 56, w: 'R', color: SUB, mode: 'rise' });
    marks(ctx, 'dark');
  } });

  F.S = Object.assign(F.S || {}, { mapBase, mapTargets, route, drawRoute, battles, HQ, TG, ACT1_END: S12.t1 });
})(typeof window !== 'undefined' ? window : globalThis);
