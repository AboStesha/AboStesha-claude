// AD 15 — the launch: «اسأل… وحسابك يجيب». A chat asks for the balance and the answer counts up; Axi and Claude
// connect through MCP; three quick asks show live prices, open positions and an order change; an approval prompt
// shows that nothing runs without the client's OK; CTA card with the URL and the risk strip.
// 15 s, 9:16, on the shared 128 bpm grid.
(function () {
  const { W, H, C, B, BEAT, clamp, lerp, inv, smooth, eo, ei, eio, co, cio, qo, sp, rng, hash, ar, arW, lat, latW, mixLine, arWords, rr, disc, ring, ripple, sparks, shake } = K;
  const T_REVEAL = B(7), T_CAPS = B(12), T_TRUST = B(21), T_CTA = B(26);
  const CAP = [B(12), B(15), B(18)];

  // ---------------- backdrop: the «Ascend» market motif, very faint ----------------
  const CANDLES = (() => { const r = rng(5), o = []; let y = 1500; for (let x = -40; x < W + 60; x += 46) { const d = (r() - 0.6) * 60; o.push({ x, o: y, c: y + d, hi: Math.min(y, y + d) - 8 - r() * 30, lo: Math.max(y, y + d) + 8 + r() * 30 }); y += d - 16 * (r() * 0.7 + 0.5); } return o; })();
  function backdrop(ctx, t, a) {
    if (a <= 0) return; const dy = -t * 26;
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(255,255,255,0.045)'; ctx.lineWidth = 1.2; ctx.beginPath();
    for (let y = ((dy % 96) + 96) % 96 - 96; y < H; y += 96) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    for (let x = 18; x < W; x += 96) { ctx.moveTo(x, 0); ctx.lineTo(x, H); } ctx.stroke();
    ctx.translate(0, dy); ctx.lineWidth = 2;
    CANDLES.forEach((c) => { const up = c.c < c.o, top = Math.min(c.o, c.c), h = Math.max(3, Math.abs(c.c - c.o)); ctx.strokeStyle = 'rgba(255,255,255,0.075)'; ctx.beginPath(); ctx.moveTo(c.x, c.hi); ctx.lineTo(c.x, c.lo); ctx.stroke(); if (up) ctx.strokeRect(c.x - 9, top, 18, h); else { ctx.fillStyle = 'rgba(255,255,255,0.065)'; ctx.fillRect(c.x - 9, top, 18, h); } });
    ctx.restore();
  }
  // whole-scene exit: rises and fades
  const exitUp = (ctx, t, t1, d = 0.28) => { const u = ei(t, t1 - d, d); ctx.translate(0, -u * 140); ctx.globalAlpha *= 1 - u; return u; };

  // ---------------- 1 · hook ----------------
  function hook(ctx, t) {
    ctx.save(); exitUp(ctx, t, T_REVEAL);
    arWords(ctx, 'اسأل…', W / 2, 400, t, { t0: -0.15, st: 0.1, d: 0.45, w: 700, size: 116 });
    arWords(ctx, 'وحسابك يجيب.', W / 2, 545, t, { t0: 0.05, st: 0.1, d: 0.45, w: 700, size: 116, colors: [C.white, C.red] });
    const q = UI.typed('كم رصيد حسابي؟', t, 0.3, 16), bu = sp(t, 0.22, 3, 0.6);
    if (bu > 0) { ctx.save(); ctx.globalAlpha *= clamp((t - 0.22) / 0.1); ctx.translate(0, (1 - bu) * 30); UI.userBubble(ctx, q.s, 1000, 760, { size: 56, caret: !q.done && UI.caretOn(t) }); ctx.restore(); }
    if (t > 1.2) UI.assistant(ctx, 1000, 990, t, { size: 32, thinking: t < 1.55, alpha: clamp((t - 1.2) / 0.1) });
    UI.scaled(ctx, 80, 1020, 920, 1.22, (x, y, w) => UI.balanceCard(ctx, x, y, w, t, 1.55, { value: 12480.5 }));
    ctx.restore();
  }

  // ---------------- 2 · Axi ⟷ Claude through MCP (stacked for 9:16) ----------------
  function reveal(ctx, t) {
    if (t < T_REVEAL - 0.05 || t > T_CAPS + 0.05) return;
    ctx.save(); exitUp(ctx, t, T_CAPS);
    arWords(ctx, 'جديد من آكسي', W / 2, 420, t, { t0: T_REVEAL + 0.05, st: 0.08, d: 0.45, w: 700, size: 88, colors: [C.red, C.white, C.white] });
    const X = W / 2, ly = 700, cyC = 1250, y0 = 875, y1 = 1120;
    K.logoReveal(ctx, X, ly, 430, t, T_REVEAL + 0.1);
    const cu = sp(t, T_REVEAL + 0.3, 2.8, 0.6);
    if (cu > 0) lat(ctx, 'Claude', X, cyC + 40 + (1 - cu) * 90, { w: 700, size: 120, color: C.white, alpha: clamp((t - T_REVEAL - 0.3) / 0.1) });
    // the connection draws from both ends to the middle, then pulses run both ways along it
    const lu = cio(t, T_REVEAL + 0.42, 0.42), mid = (y0 + y1) / 2;
    if (lu > 0) {
      ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 4; ctx.setLineDash([12, 12]); ctx.lineDashOffset = -t * 70;
      ctx.beginPath(); ctx.moveTo(X, mid - (mid - y0) * lu); ctx.lineTo(X, mid + (y1 - mid) * lu); ctx.stroke(); ctx.restore();
      if (lu >= 1) for (let i = 0; i < 4; i++) { const f = ((t - T_REVEAL) * 0.85 + i / 4) % 1, dn = i % 2 === 0, py = dn ? lerp(y0, y1, f) : lerp(y1, y0, f); disc(ctx, X, py, 8, C.white, 0.9 * Math.sin(Math.PI * f)); }
    }
    const mu = sp(t, T_REVEAL + 0.8, 3, 0.5);
    if (mu > 0) { ctx.save(); ctx.translate(X, mid); ctx.scale(mu, mu); rr(ctx, -86, -36, 172, 72, 36); ctx.fillStyle = '#202226'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.stroke(); lat(ctx, 'MCP', 0, 13, { w: 800, size: 36, color: C.white }); ctx.restore(); }
    ripple(ctx, X, mid, t, T_REVEAL + 0.85, { r0: 30, r1: 300, w: 3, n: 2, a: 0.25, color: C.white });
    const su = eo(t, T_REVEAL + 0.75, 0.5);
    if (su > 0) mixLine(ctx, [{ t: 'اربط حساب' }, { t: 'MT5', lat: true }, { t: 'مع' }, { t: 'Claude', lat: true }], W / 2, 1450 + (1 - su) * 40, { size: 64, lsize: 60, w: 600, lw: 700, color: C.white, alpha: su, gap: 18 });
    ctx.restore();
  }

  // ---------------- 3 · three asks ----------------
  const ASKS = [
    { label: 'أسعار لحظية', q: 'كم سعر EUR/USD الآن؟', card: (ctx, t, t0) => UI.scaled(ctx, 80, 900, 920, 1.18, (x, y, w) => UI.priceCard(ctx, x, y, w, t, t0, { sym: 'EUR/USD', price: 1.0874, chg: '+0.12%' })) },
    { label: 'تابع صفقاتك', q: 'ما صفقاتي المفتوحة؟', card: (ctx, t, t0) => UI.scaled(ctx, 80, 900, 920, 1.12, (x, y, w) => UI.positionsCard(ctx, x, y, w, t, t0, [{ sym: 'EUR/USD', side: 'شراء', vol: '0.50', pl: 84.2 }, { sym: 'XAU/USD', side: 'بيع', vol: '0.10', pl: -12.4 }, { sym: 'GBP/USD', side: 'شراء', vol: '0.25', pl: 31.75 }])) },
    { label: 'عدّل أوامرك', q: 'ضع وقف الخسارة عند 1.0820', card: (ctx, t, t0) => UI.scaled(ctx, 80, 900, 920, 1.18, (x, y, w) => UI.orderCard(ctx, x, y, w, t, t0, { sym: 'EUR/USD', old: '1.0790', val: '1.0820' })) },
  ];
  function asks(ctx, t) {
    if (t < T_CAPS - 0.05 || t > T_TRUST + 0.05) return;
    ASKS.forEach((A, i) => {
      const t0 = CAP[i], t1 = i < 2 ? CAP[i + 1] : T_TRUST; if (t < t0 - 0.02 || t > t1 + 0.02) return;
      const inn = eo(t, t0, 0.35), out = ei(t, t1 - 0.22, 0.22);
      ctx.save(); ctx.translate(-(1 - inn) * 240 + out * 240, 0); ctx.globalAlpha *= clamp(inn * 1.5) * (1 - out);
      ar(ctx, A.label, W / 2, 440, { w: 700, size: 100, color: C.white });
      ctx.fillStyle = C.red; rr(ctx, W / 2 - 40, 484, 80, 7, 3.5); ctx.fill();
      const q = UI.typed(A.q, t, t0 + 0.04, 64); UI.userBubble(ctx, q.s, 1000, 610, { size: 52, caret: !q.done && UI.caretOn(t) });
      if (t > t0 + 0.3) UI.assistant(ctx, 1000, 860, t, { size: 32, alpha: clamp((t - t0 - 0.3) / 0.1) });
      A.card(ctx, t, t0 + 0.34);
      ctx.restore();
    });
    const na = smooth(inv(T_CAPS + 0.4, T_CAPS + 0.7, t)) * (1 - smooth(inv(T_TRUST - 0.25, T_TRUST, t)));
    if (na > 0) ar(ctx, 'أرقام توضيحية', W / 2, 1560, { w: 400, size: 26, color: 'rgba(255,255,255,0.55)', alpha: na });
  }

  // ---------------- 4 · nothing runs without your OK ----------------
  function trust(ctx, t) {
    if (t < T_TRUST - 0.05 || t > T_CTA + 0.1) return;
    ctx.save(); exitUp(ctx, t, T_CTA + 0.05);
    arWords(ctx, 'لا تُنفَّذ أي صفقة', W / 2, 400, t, { t0: T_TRUST + 0.05, st: 0.07, d: 0.45, w: 700, size: 88 });
    arWords(ctx, 'بدون موافقتك', W / 2, 530, t, { t0: T_TRUST + 0.22, st: 0.07, d: 0.45, w: 700, size: 88, colors: [C.white, C.red] });
    const press = T_TRUST + 1.05;
    UI.approvalCard(ctx, 80, 760, 920, t, T_TRUST + 0.15, { press });
    const cp = UI.path([[T_TRUST + 0.45, 1120, 1500], [press - 0.05, 830, 1050, 0], [press, 830, 1050, 1], [T_CTA, 860, 1080]], t);
    if (t > T_TRUST + 0.45) { UI.cursor(ctx, cp.x, cp.y, { press: cp.press, alpha: clamp((t - T_TRUST - 0.45) / 0.12) }); UI.tap(ctx, 850, 1028, t, press); }
    UI.done(ctx, 'تم التنفيذ بعد موافقتك', 1000, 1230, t, press + 0.18, { size: 38 });
    ctx.restore();
  }

  // ---------------- 5 · CTA ----------------
  function cta(ctx, t) {
    if (t < T_CTA - 0.4) return;
    K.riseWipe(ctx, eio(t, T_CTA - 0.35, 0.45));
    if (t < T_CTA - 0.05) return;
    K.logoReveal(ctx, W / 2, 470, 560, t, T_CTA);
    const lu = eo(t, T_CTA + 0.4, 0.45);
    if (lu > 0) mixLine(ctx, [{ t: 'متصل الآن مع' }, { t: 'Claude', lat: true }], W / 2, 760 + (1 - lu) * 30, { size: 52, lsize: 50, w: 600, lw: 700, color: C.white, alpha: lu, gap: 16 });
    K.ctaPill(ctx, W / 2, 900, t, T_CTA + 0.55, 'اربط حسابك الآن', { tb: B(27), w: 620 });
    const uu = eo(t, T_CTA + 0.75, 0.45);
    if (uu > 0) {
      lat(ctx, 'mcp.axi.com', W / 2, 1040 + (1 - uu) * 20, { w: 700, size: 50, color: C.ink, alpha: uu });
      mixLine(ctx, [{ t: 'لحسابات' }, { t: 'MT5', lat: true }, { t: '· إصدار تجريبي' }, { t: '(Alpha)', lat: true }], W / 2, 1098, { size: 28, lsize: 26, w: 400, lw: 600, color: C.graphite, alpha: uu * 0.9, gap: 9 });
    }
    K.riskStrip(ctx, t, B(25.6), 1150);
  }

  function scene(ctx, t) {
    K.bgDark(ctx);
    backdrop(ctx, t, smooth(inv(-0.2, 0.4, t)));
    hook(ctx, t); reveal(ctx, t); asks(ctx, t); trust(ctx, t); cta(ctx, t);
  }

  window.FILM = {
    duration: 15,
    blur(t) {
      if (t < 0.6) return 4; if (t > 1.5 && t < 2.4) return 1; if (Math.abs(t - T_REVEAL) < 0.45) return 8;
      for (const c of CAP) if (Math.abs(t - c) < 0.35) return 8;
      if (Math.abs(t - T_TRUST) < 0.35 || Math.abs(t - T_CTA) < 0.5) return 8;
      return 1;                                    // counters and typing stay crisp
    },
    draw(ctx, t) {
      scene(ctx, t);
      if (t < T_CTA - 0.2) K.watermark(ctx, C.white, 0.6 * (1 - smooth(inv(T_CTA - 0.5, T_CTA - 0.2, t))));
      K.grain(ctx, t, 0.03, t > 14.2);
    },
  };
})();
