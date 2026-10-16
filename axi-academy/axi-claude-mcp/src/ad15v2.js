// AD 15 v2 — «Claude ينقل تداولك إلى المستوى التالي». Dynamic glassmorphism with Claude's palette on the Claude
// moments and Axi's glass on the Axi moments. Hook → the two brands lock together → a super-smart assistant →
// what you can do (from the client's screen recording) → you decide → CTA. No risk strip at the end (client request).
// 15 s, 9:16, 128 bpm grid.
(function () {
  const { W, H, B, clamp, lerp, inv, smooth, eo, co, sp, expoOut, ar, arW, lat, mixLine, rr, disc } = K;
  const { AX, CL, glass, stage, dust, candles, snap, film, camera, swing, popWords, trackIn, lockup, LO, PO, shape } = GL;
  const T1 = B(6), T2 = B(10), T3 = B(14), T4 = B(25), T5 = B(28);

  // light pillars per mood: warm = Claude, cool = Axi
  // pillars keep to the sides so the centre stays dark enough for white and terracotta type
  const WARM = [
    { x: 120, y: -260, w: 300, h: 1700, c: CL.orange, a: 0.9, sp: 0.5, amp: 50, ph: 0 },
    { x: 110, y: -100, w: 110, h: 1300, c: '#F4B79C', a: 0.55, sp: 0.5, amp: 50, ph: 0 },
    { x: 980, y: 200, w: 320, h: 1800, c: CL.blue, a: 0.6, sp: 0.35, amp: 60, ph: 2 },
    { x: 560, y: 1150, w: 220, h: 1100, c: '#FFFFFF', a: 0.12, sp: 0.6, amp: 260, ph: 4 },
  ];
  const DUO = [
    { x: 110, y: -200, w: 300, h: 1800, c: CL.orange, a: 0.85, sp: 0.4, amp: 40, ph: 1 },
    { x: 110, y: 0, w: 110, h: 1300, c: '#F4B79C', a: 0.5, sp: 0.4, amp: 40, ph: 1 },
    { x: 970, y: -100, w: 320, h: 1900, c: AX.steel2, a: 0.75, sp: 0.35, amp: 50, ph: 3 },
    { x: 970, y: 200, w: 120, h: 1300, c: '#FFFFFF', a: 0.3, sp: 0.35, amp: 50, ph: 3 },
  ];
  const COOL = [
    { x: 960, y: -300, w: 340, h: 1900, c: AX.steel2, a: 0.8, sp: 0.45, amp: 60, ph: 0.5 },
    { x: 960, y: -100, w: 120, h: 1400, c: '#FFFFFF', a: 0.32, sp: 0.45, amp: 60, ph: 0.5 },
    { x: 120, y: 400, w: 300, h: 1600, c: CL.blue, a: 0.5, sp: 0.3, amp: 50, ph: 2.5 },
    { x: 540, y: 1250, w: 200, h: 900, c: CL.orange, a: 0.4, sp: 0.6, amp: 280, ph: 5 },
  ];

  // a tall glass shard crossing the frame in the foreground (parallax), right → left
  function shard(ctx, t, t0, d, o = {}) {
    const u = (t - t0) / d; if (u <= 0 || u >= 1) return;
    const x = lerp(W + 200, -400, u), w = o.w || 170;
    snap(ctx.canvas, 5);
    ctx.save(); ctx.translate(x, H / 2); ctx.rotate(o.rot || 0.12); glass(ctx, -w / 2, -H * 0.8, w, H * 1.6, { tone: o.tone || 'light', r: 0, lift: 0.3, refract: 18, glint: 0.5, glintA: 0.18 }); ctx.restore();
  }

  // ---------------- 1 · hook ----------------
  const S1 = { t0: 0, t1: T1, render(ctx, t) {
    stage(ctx, t, { pillars: WARM, alpha: smooth(inv(-0.05, 0.4, t)), dx: -t * 30 });
    dust(ctx, t, { a: 0.5, dy: -t * 160 }); candles(ctx, t, { a: 0.09, y: 1720, speed: 40 });
    ctx.save(); camera(ctx, t, 0, T1, { s0: 1.0, s1: 1.08, drift: 8 });
    trackIn(ctx, LO, 'Claude', W / 2, 700, t, 0.06, { w: 600, size: 210, color: CL.light, from: 110, d: 0.9 });
    const lu = eo(t, 0.42, 0.55);
    if (lu > 0) { ctx.fillStyle = CL.orange; rr(ctx, W / 2 - 190 * lu, 760, 380 * lu, 10, 5); ctx.fill(); }
    popWords(ctx, 'ينقل تداولك', W / 2, 960, t, { t0: 0.55, size: 112, w: 700, color: '#FFFFFF', st: 0.09, from: 1.5 });
    popWords(ctx, 'إلى المستوى التالي', W / 2, 1110, t, { t0: 0.86, size: 112, w: 700, colors: ['#FFFFFF', '#FFFFFF', CL.orange], st: 0.09, from: 1.5 });
    // the next level: three glass steps rise, the last one warm
    snap(ctx.canvas);
    [[260, 170], [540, 290], [820, 430]].forEach(([cx, h], i) => {
      const u = sp(t, 1.25 + i * 0.12, 2.6, 0.6); if (u <= 0) return; const hh = h * clamp(u, 0, 1.08);
      glass(ctx, cx - 115, 1600 - hh, 230, hh, { tone: i === 2 ? 'clay' : 'light', r: 22, ch: i === 2 ? 34 : 0, corner: 'tr', glint: clamp((t - 1.5 - i * 0.1) / 0.6), alpha: clamp((t - 1.25 - i * 0.12) / 0.1) });
    });
    ctx.restore();
    shard(ctx, t, 0.15, 0.55, { w: 150 }); shard(ctx, t, 1.95, 0.6, { w: 220, rot: -0.1 });
  } };

  // ---------------- 2 · the two brands lock together ----------------
  const S2 = { t0: T1, t1: T2, render(ctx, t) {
    stage(ctx, t, { pillars: DUO, dx: (t - T1) * -40 });
    dust(ctx, t, { a: 0.45, dy: -t * 120 });
    ctx.save(); camera(ctx, t, T1, T2, { s0: 1.06, s1: 1.0, drift: 6 });
    popWords(ctx, 'جديد من آكسي العراق', W / 2, 560, t, { t0: T1 + 0.08, size: 76, w: 600, color: '#FFFFFF', st: 0.07, from: 1.3 });
    snap(ctx.canvas);
    lockup(ctx, W / 2, 880, t, T1 + 0.12, { tw: 430, th: 330, cs: 100, glint: clamp((t - T1 - 0.55) / 0.7) });
    const cu = eo(t, T1 + 0.75, 0.5);
    if (cu > 0) mixLine(ctx, [{ t: 'اربط حسابك' }, { t: 'MT5', lat: true }, { t: 'مع' }, { t: 'Claude', lat: true, color: CL.orange2 }], W / 2, 1240 + (1 - cu) * 30, { size: 64, lsize: 60, w: 600, lw: 700, color: '#FFFFFF', alpha: cu, gap: 18 });
    ctx.restore();
  } };

  // ---------------- 3 · a super-smart assistant ----------------
  const S3 = { t0: T2, t1: T3, render(ctx, t) {
    stage(ctx, t, { pillars: WARM, dx: 60 - (t - T2) * 40 });
    dust(ctx, t, { a: 0.4, dy: -t * 100 });
    ctx.save(); camera(ctx, t, T2, T3, { s0: 1.0, s1: 1.05, drift: 6 });
    popWords(ctx, 'تداول مع مساعد', W / 2, 330, t, { t0: T2 + 0.05, size: 100, w: 700, color: '#FFFFFF', st: 0.08 });
    popWords(ctx, 'فائق الذكاء', W / 2, 470, t, { t0: T2 + 0.3, size: 120, w: 700, color: CL.orange, st: 0.1, from: 1.6 });
    snap(ctx.canvas);
    const su = sp(t, T2 + 0.2, 1.9, 0.62), x = 90, y = 600, w = 900, h = 820;
    if (su > 0) {
      ctx.save(); ctx.globalAlpha *= clamp((t - T2 - 0.2) / 0.12); GL.swing(ctx, W / 2, y + h / 2, (1 - clamp(su)) * 1.1); ctx.translate(0, (1 - clamp(su)) * 80);
      glass(ctx, x, y, w, h, { tone: 'ivory', r: 40, glint: clamp((t - T2 - 0.7) / 0.8) });
      LO.draw(ctx, 'Claude', x + 56, y + 92, { w: 600, size: 52, color: CL.dark, align: 'left' });
      ctx.fillStyle = 'rgba(20,20,19,0.10)'; ctx.fillRect(x + 40, y + 132, w - 80, 2);
      const q = U2.typed('حلّل صفقاتي المفتوحة', t, T2 + 0.45, 30);
      if (t > T2 + 0.4) U2.userBubble(ctx, q.s, x + w - 48, y + 170, { size: 40, caret: !q.done && U2.caret(t) });
      if (t > T2 + 1.25 && t < T2 + 1.55) U2.thinking(ctx, x + w - 120, y + 400, t);
      U2.reply(ctx, [[{ t: 'لديك' }, { t: '3', lat: true }, { t: 'صفقات مفتوحة.' }], [{ t: 'الإجمالي:' }, { t: '+$103.55', lat: true, color: '#2F7D5E' }], 'أكبرها على EUR/USD شراء.'], x + w - 56, y + 410, t, T2 + 1.5, { size: 38 });
      ctx.restore();
    }
    ctx.restore();
  } };

  // ---------------- 4 · what you can do (to be replaced by the list in the client's recording) ----------------
  const CAPS = [
    { label: 'أسعار لحظية', card: (ctx, t, t0) => U2.price(ctx, 110, 720, 860, t, t0, { glint: clamp((t - t0 - 0.3) / 0.6) }) },
    { label: 'صفقاتك المفتوحة', card: (ctx, t, t0) => U2.positions(ctx, 110, 700, 860, t, t0, [{ sym: 'EUR/USD', side: 'شراء', pl: 84.2 }, { sym: 'XAU/USD', side: 'بيع', pl: -12.4 }, { sym: 'GBP/USD', side: 'شراء', pl: 31.75 }], { glint: clamp((t - t0 - 0.3) / 0.6) }) },
    { label: 'رصيدك فوراً', card: (ctx, t, t0) => U2.balance(ctx, 110, 740, 860, t, t0, { glint: clamp((t - t0 - 0.3) / 0.6) }) },
    { label: 'عدّل أوامرك', card: (ctx, t, t0) => U2.price(ctx, 110, 720, 860, t, t0, { sym: 'XAU/USD', price: 2412.6, chg: '+0.4%' }) },
  ];
  const CT = CAPS.map((_, i) => T3 + i * ((T4 - T3) / CAPS.length));
  const S4 = { t0: T3, t1: T4, render(ctx, t) {
    stage(ctx, t, { pillars: COOL, dx: -(t - T3) * 50 });
    dust(ctx, t, { a: 0.4, dy: -t * 120 }); candles(ctx, t, { a: 0.1, y: 1700, speed: 30 });
    const i = clamp(Math.floor((t - T3) / ((T4 - T3) / CAPS.length)), 0, CAPS.length - 1), t0 = CT[i], A = CAPS[i];
    ctx.save(); camera(ctx, t, T3, T4, { s0: 1.0, s1: 1.04, drift: 6 });
    const nu = eo(t, t0, 0.35);
    lat(ctx, String(i + 1).padStart(2, '0'), W - 110, 420, { w: 800, size: 64, color: CL.orange2, align: 'right', alpha: nu });
    popWords(ctx, A.label, W - 110 - 110, 430, t, { t0: t0 + 0.02, size: 96, w: 700, color: '#FFFFFF', st: 0.06, align: 'right' });
    snap(ctx.canvas);
    A.card(ctx, t, t0 + 0.12);
    ctx.restore();
  } };

  // ---------------- 5 · you decide ----------------
  const S5 = { t0: T4, t1: T5, render(ctx, t) {
    stage(ctx, t, { pillars: WARM, dx: (t - T4) * 40 });
    dust(ctx, t, { a: 0.4, dy: -t * 100 });
    ctx.save(); camera(ctx, t, T4, T5, { s0: 1.02, s1: 1.07, drift: 5 });
    popWords(ctx, 'والقرار دائماً لك', W / 2, 520, t, { t0: T4 + 0.05, size: 108, w: 700, colors: ['#FFFFFF', '#FFFFFF', CL.orange], st: 0.08, from: 1.5 });
    snap(ctx.canvas);
    const press = T4 + 0.95;
    U2.permission(ctx, 90, 700, 900, t, T4 + 0.15, { press, glint: clamp((t - T4 - 0.4) / 0.6) });
    const cp = { x: lerp(1000, 860, smooth(inv(T4 + 0.4, press - 0.05, t))), y: lerp(1500, 990, smooth(inv(T4 + 0.4, press - 0.05, t))) };
    if (t > T4 + 0.35) { U2.cursor(ctx, cp.x, cp.y, { press: clamp(1 - Math.abs(t - press) / 0.12), alpha: clamp((t - T4 - 0.35) / 0.12) }); U2.tap(ctx, 856, 962, t, press, CL.dark); }
    ctx.restore();
  } };

  // ---------------- 6 · CTA (no risk strip, by request) ----------------
  const S6 = { t0: T5, t1: 15.01, render(ctx, t) {
    stage(ctx, t, { pillars: DUO, dx: -(t - T5) * 30 });
    dust(ctx, t, { a: 0.4, dy: -t * 90 });
    ctx.save(); camera(ctx, t, T5, 15, { s0: 1.05, s1: 1.0, drift: 4 });
    snap(ctx.canvas);
    lockup(ctx, W / 2, 640, t, T5 + 0.02, { tw: 400, th: 300, cs: 92, glint: clamp((t - T5 - 0.5) / 0.7) });
    popWords(ctx, 'تداول بذكاء أكبر', W / 2, 960, t, { t0: T5 + 0.25, size: 92, w: 700, color: '#FFFFFF', st: 0.07 });
    K.ctaPill(ctx, W / 2, 1140, t, T5 + 0.45, 'اربط حسابك الآن', { tb: B(29), w: 640, h: 124, size: 54 });
    const uu = eo(t, T5 + 0.7, 0.45);
    if (uu > 0) {
      snap(ctx.canvas);
      glass(ctx, W / 2 - 260, 1260, 520, 96, { tone: 'light', r: 48, alpha: uu, lift: 0.4 });
      lat(ctx, 'mcp.axi.com', W / 2, 1323, { w: 700, size: 46, color: '#FFFFFF', alpha: uu });
      mixLine(ctx, [{ t: 'لحسابات' }, { t: 'MT5', lat: true }, { t: '· إصدار تجريبي' }, { t: '(Alpha)', lat: true }], W / 2, 1420, { size: 28, lsize: 26, w: 400, lw: 600, color: 'rgba(255,255,255,0.7)', alpha: uu * 0.9, gap: 9 });
    }
    ctx.restore();
  } };

  const SCENES = [S1, S2, S3, S4, S5, S6];
  const CUTS = [
    { at: T1, d: 0.42, kind: 'slab' }, { at: T2, d: 0.36, kind: 'zoom', cy: 900 }, { at: T3, d: 0.42, kind: 'slab' },
    { at: T4, d: 0.36, kind: 'frost' }, { at: T5, d: 0.42, kind: 'slab', tone: 'clay' },
  ];
  window.FILM = {
    duration: 15,
    blur(t) {
      for (const c of CUTS) if (Math.abs(t - c.at) < c.d / 2 + 0.05) return c.kind === 'slab' ? 14 : 8;
      if (t < 0.9 || (t > 1.9 && t < 2.6)) return 6;
      return 2;
    },
    draw(ctx, t) {
      film(ctx, t, SCENES, CUTS);
      if (t < T5 - 0.1) K.watermark(ctx, '#FFFFFF', 0.6 * smooth(inv(0.2, 0.6, t)) * (1 - smooth(inv(T5 - 0.4, T5 - 0.1, t))));
      K.grain(ctx, t, 0.03, t > 14.6);
    },
  };
})();
