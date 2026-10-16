// EXPLAINER 60 — how to connect Claude to an Axi MT5 account, following Axi's own six steps
// (claude.ai/customize/connectors → Add → Name: Axi → URL: https://mcp.axi.com/mcp → Connect → log in & approve).
// Hook, title, what the link is, what you need, the six steps on stylised screens, a live try with the approval
// prompt, who is in control, CTA + risk strip. 60 s, 9:16, 128 bpm grid (32 bars).
(function () {
  const { W, H, C, B, clamp, lerp, inv, smooth, eo, ei, eio, co, cio, qo, sp, rng, ar, arW, lat, latW, mixLine, arWords, rr, disc, ripple } = K;
  const T_TITLE = B(8), T_WHAT = B(16), T_NEED = B(28), T_STEPS = B(36), STEP = B(9), T_TRY = B(90), T_SAFE = B(110), T_CTA = B(120);
  const ST = (i) => T_STEPS + i * STEP;
  const URL = 'https://mcp.axi.com/mcp';

  // ---------------- backdrop: the «Ascend» market motif, very faint ----------------
  const CANDLES = (() => { const r = rng(9), o = []; let y = 1500; for (let x = -40; x < W + 60; x += 46) { const d = (r() - 0.6) * 60; o.push({ x, o: y, c: y + d, hi: Math.min(y, y + d) - 8 - r() * 30, lo: Math.max(y, y + d) + 8 + r() * 30 }); y += d - 16 * (r() * 0.7 + 0.5); } return o; })();
  function backdrop(ctx, t, a) {
    if (a <= 0) return; const dy = -((t * 22) % 1400);
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(255,255,255,0.045)'; ctx.lineWidth = 1.2; ctx.beginPath();
    for (let y = ((dy % 96) + 96) % 96 - 96; y < H; y += 96) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    for (let x = 18; x < W; x += 96) { ctx.moveTo(x, 0); ctx.lineTo(x, H); } ctx.stroke();
    ctx.lineWidth = 2;
    [0, 1400].forEach((oy) => { ctx.save(); ctx.translate(0, dy + oy); CANDLES.forEach((c) => { const up = c.c < c.o, top = Math.min(c.o, c.c), h = Math.max(3, Math.abs(c.c - c.o)); ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.beginPath(); ctx.moveTo(c.x, c.hi); ctx.lineTo(c.x, c.lo); ctx.stroke(); if (up) ctx.strokeRect(c.x - 9, top, 18, h); else { ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(c.x - 9, top, 18, h); } }); ctx.restore(); });
    ctx.restore();
  }
  const exitUp = (ctx, t, t1, d = 0.28) => { const u = ei(t, t1 - d, d); ctx.translate(0, -u * 140); ctx.globalAlpha *= 1 - u; return u; };
  const live = (t, a, b) => t > a - 0.05 && t < b + 0.05;

  // ---------------- 1 · hook ----------------
  function hook(ctx, t) {
    if (!live(t, 0, T_TITLE)) return;
    ctx.save(); exitUp(ctx, t, T_TITLE);
    arWords(ctx, 'حسابك في آكسي', W / 2, 380, t, { t0: -0.15, st: 0.09, d: 0.45, w: 700, size: 104 });
    const u = eo(t, 0.25, 0.5);
    if (u > 0) mixLine(ctx, [{ t: 'الآن', color: C.red }, { t: 'داخل' }, { t: 'Claude', lat: true }], W / 2, 520 + (1 - u) * 50, { size: 104, lsize: 98, w: 700, lw: 700, color: C.white, alpha: clamp(u * 1.6), gap: 26 });
    const q = UI.typed('اعرض صفقاتي المفتوحة', t, 0.55, 18);
    if (t > 0.45) UI.userBubble(ctx, q.s, 1000, 740, { size: 54, caret: !q.done && UI.caretOn(t), alpha: clamp((t - 0.45) / 0.1) });
    if (t > 1.85) UI.assistant(ctx, 1000, 960, t, { size: 32, thinking: t < 2.1, alpha: clamp((t - 1.85) / 0.1) });
    UI.scaled(ctx, 80, 990, 920, 1.14, (x, y, w) => UI.positionsCard(ctx, x, y, w, t, 2.1, [{ sym: 'EUR/USD', side: 'شراء', vol: '0.50', pl: 84.2 }, { sym: 'XAU/USD', side: 'بيع', vol: '0.10', pl: -12.4 }, { sym: 'GBP/USD', side: 'شراء', vol: '0.25', pl: 31.75 }]));
    ctx.restore();
  }

  // ---------------- 2 · title: Axi ⟷ MCP ⟷ Claude ----------------
  function link(ctx, t, t0, X, ly, cyC, y0, y1, o = {}) {
    K.logoReveal(ctx, X, ly, o.lw || 380, t, t0);
    const cu = sp(t, t0 + 0.2, 2.8, 0.6);
    if (cu > 0) lat(ctx, 'Claude', X, cyC + 38 + (1 - cu) * 80, { w: 700, size: o.cs || 108, color: C.white, alpha: clamp((t - t0 - 0.2) / 0.1) });
    const lu = cio(t, t0 + 0.32, 0.4), mid = (y0 + y1) / 2;
    if (lu > 0) {
      ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 4; ctx.setLineDash([12, 12]); ctx.lineDashOffset = -t * 70;
      ctx.beginPath(); ctx.moveTo(X, mid - (mid - y0) * lu); ctx.lineTo(X, mid + (y1 - mid) * lu); ctx.stroke(); ctx.restore();
      if (lu >= 1) for (let i = 0; i < 4; i++) { const f = ((t - t0) * 0.85 + i / 4) % 1, py = i % 2 === 0 ? lerp(y0, y1, f) : lerp(y1, y0, f); disc(ctx, X, py, 8, C.white, 0.9 * Math.sin(Math.PI * f)); }
    }
    const mu = sp(t, t0 + 0.65, 3, 0.5);
    if (mu > 0) { ctx.save(); ctx.translate(X, mid); ctx.scale(mu, mu); rr(ctx, -86, -36, 172, 72, 36); ctx.fillStyle = '#202226'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.stroke(); lat(ctx, 'MCP', 0, 13, { w: 800, size: 36, color: C.white }); ctx.restore(); }
    ripple(ctx, X, mid, t, t0 + 0.7, { r0: 30, r1: 300, w: 3, n: 2, a: 0.22, color: C.white });
  }
  function title(ctx, t) {
    if (!live(t, T_TITLE, T_WHAT)) return;
    ctx.save(); exitUp(ctx, t, T_WHAT);
    link(ctx, t, T_TITLE + 0.05, W / 2, 560, 1080, 740, 960);
    const u = eo(t, T_TITLE + 0.6, 0.5), v = eo(t, T_TITLE + 0.8, 0.5);
    if (u > 0) mixLine(ctx, [{ t: 'كيف تربط' }, { t: 'Claude', lat: true }, { t: 'بحسابك في آكسي؟' }], W / 2, 1320 + (1 - u) * 40, { size: 60, lsize: 56, w: 700, lw: 700, color: C.white, alpha: u, gap: 16 });
    if (v > 0) mixLine(ctx, [{ t: '6', lat: true }, { t: 'خطوات · أقل من دقيقة' }], W / 2, 1410 + (1 - v) * 30, { size: 44, lsize: 44, w: 400, lw: 700, color: 'rgba(255,255,255,0.7)', alpha: v, gap: 12 });
    ctx.restore();
  }

  // ---------------- 3 · what the link is ----------------
  const CHIPS = [['أسعار لحظية', 'chart'], ['صفقاتك المفتوحة', 'list'], ['تنفيذ الأوامر', 'bolt'], ['وقف الخسارة وجني الأرباح', 'sliders'], ['سجل التداول', 'clock']];
  function what(ctx, t) {
    if (!live(t, T_WHAT, T_NEED)) return;
    ctx.save(); exitUp(ctx, t, T_NEED);
    arWords(ctx, 'ما هو هذا الربط؟', W / 2, 330, t, { t0: T_WHAT + 0.05, st: 0.08, d: 0.45, w: 700, size: 84 });
    // three nodes stacked: Claude · MCP · your MT5 account
    const X = W / 2, nA = 520, nB = 760, nC = 1000, a1 = eo(t, T_WHAT + 0.3, 0.45), a2 = eo(t, T_WHAT + 0.55, 0.45), a3 = eo(t, T_WHAT + 0.8, 0.45);
    const box = (y, a, fn, bw = 480) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(0, (1 - a) * 40); UI.card(ctx, X - bw / 2, y - 70, bw, 140, { r: 34 }); fn(); ctx.restore(); };
    box(nA, a1, () => lat(ctx, 'Claude', X, nA + 22, { w: 700, size: 64 }));
    if (a2 > 0) { ctx.save(); ctx.globalAlpha *= a2; ctx.translate(0, (1 - a2) * 40); rr(ctx, X - 120, nB - 46, 240, 92, 46); ctx.fillStyle = '#202226'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.stroke(); lat(ctx, 'MCP', X, nB + 16, { w: 800, size: 44, color: C.white }); ctx.restore(); }
    box(nC, a3, () => { K.logoIQ(ctx, X - 175, nC, 140); ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.fillRect(X - 82, nC - 40, 2, 80); mixLine(ctx, [{ t: 'حسابك' }, { t: 'MT5', lat: true }], X + 255, nC + 16, { size: 42, lsize: 40, w: 600, lw: 700, color: C.white, gap: 12, align: 'right' }); }, 600);
    const lu = cio(t, T_WHAT + 0.9, 0.4);
    if (lu > 0) [[nA + 70, nB - 46], [nB + 46, nC - 70]].forEach(([y0, y1], k) => {
      ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 4; ctx.setLineDash([10, 10]); ctx.lineDashOffset = -t * 60; ctx.beginPath(); ctx.moveTo(X, y0); ctx.lineTo(X, lerp(y0, y1, lu)); ctx.stroke(); ctx.restore();
      if (lu >= 1) for (let i = 0; i < 2; i++) { const f = ((t - T_WHAT) * 1.1 + i / 2 + k * 0.25) % 1, py = i ? lerp(y1, y0, f) : lerp(y0, y1, f); disc(ctx, X, py, 7, C.white, 0.9 * Math.sin(Math.PI * f)); }
    });
    const cu = eo(t, T_WHAT + 1.1, 0.5);
    if (cu > 0) ar(ctx, 'معيار مفتوح يربط Claude بحسابك بأمان', W / 2, 1150 + (1 - cu) * 30, { w: 400, size: 40, color: 'rgba(255,255,255,0.78)', alpha: cu });
    // what Claude can do with it
    CHIPS.forEach(([label, ic], i) => {
      const t0 = T_WHAT + 1.6 + i * 0.22, u = sp(t, t0, 2.8, 0.6); if (u <= 0) return;
      const col = i % 2, row = Math.floor(i / 2), last = i === CHIPS.length - 1, w = last ? 560 : 450, h = 96;
      const x = last ? W / 2 - w / 2 : col === 0 ? W - 80 - w : 80, y = 1250 + row * 116;
      ctx.save(); ctx.globalAlpha *= clamp((t - t0) / 0.1); ctx.translate(x + w / 2, y + h / 2 + (1 - u) * 50); ctx.scale(lerp(0.85, 1, u), lerp(0.85, 1, u)); ctx.translate(-(x + w / 2), -(y + h / 2));
      UI.card(ctx, x, y, w, h, { r: 48 }); UI[ic](ctx, x + w - 52, y + h / 2, 1.05, UI.colors.TXT);
      ar(ctx, label, x + w - 92, y + h / 2 + 12, { w: 600, size: label.length > 16 ? 27 : 36, color: C.white, align: 'right' });
      ctx.restore();
    });
    ctx.restore();
  }

  // ---------------- 4 · what you need ----------------
  function need(ctx, t) {
    if (!live(t, T_NEED, T_STEPS)) return;
    ctx.save(); exitUp(ctx, t, T_STEPS);
    arWords(ctx, 'ستحتاج إلى:', W / 2, 600, t, { t0: T_NEED + 0.05, st: 0.08, d: 0.45, w: 700, size: 92 });
    [[[{ t: 'حساب' }, { t: 'MT5', lat: true }, { t: 'فعّال في آكسي' }], 820], [[{ t: 'حساب في' }, { t: 'Claude', lat: true }], 1010]].forEach(([parts, y], i) => {
      const t0 = T_NEED + 0.4 + i * 0.3, u = sp(t, t0, 2.8, 0.6); if (u <= 0) return;
      ctx.save(); ctx.globalAlpha *= clamp((t - t0) / 0.1); ctx.translate(-(1 - u) * 120, 0);
      UI.card(ctx, 80, y - 80, 920, 150, { r: 34 }); disc(ctx, 1000 - 70, y - 5, 34, C.white); UI.check(ctx, 1000 - 70, y - 5, 1.4, '#0B0D0D');
      mixLine(ctx, parts, 1000 - 130, y + 12, { size: 50, lsize: 48, w: 600, lw: 700, color: C.white, align: 'right', gap: 14 });
      ctx.restore();
    });
    const nu = eo(t, T_NEED + 1.3, 0.5);
    if (nu > 0) mixLine(ctx, [{ t: 'الربط متاح حاليًا لحسابات' }, { t: 'MT5', lat: true }, { t: 'فقط' }], W / 2, 1220 + (1 - nu) * 20, { size: 38, lsize: 36, w: 400, lw: 600, color: 'rgba(255,255,255,0.7)', alpha: nu, gap: 10 });
    ctx.restore();
  }

  // ---------------- 5 · the six steps on stylised screens ----------------
  const WIN = { x: 60, y: 440, w: 960, h: 1080 };
  const CAPS = [
    [[{ t: 'افتح صفحة الموصلات في' }, { t: 'Claude', lat: true }], [{ t: 'claude.ai/customize/connectors', lat: true }]],
    [[{ t: 'اضغط' }, { t: 'Add', lat: true }], [{ t: 'ثم' }, { t: 'Add custom connector', lat: true }]],
    [[{ t: 'اكتب الاسم:' }, { t: 'Axi', lat: true }], null],
    ['الصق رابط الموصل', null],
    [[{ t: 'اضغط' }, { t: 'Add', lat: true }, { t: 'ثم' }, { t: 'Connect', lat: true }], 'اترك الخيارات الافتراضية كما هي'],
    ['سجّل الدخول إلى حسابك في آكسي', 'ووافق على الربط'],
  ];
  function steps(ctx, t) {
    if (!live(t, T_STEPS, T_TRY)) return;
    ctx.save(); exitUp(ctx, t, T_TRY);
    const i = clamp(Math.floor((t - T_STEPS) / STEP), 0, 5), t0 = ST(i), k = (x) => t0 + x;
    // header: the caption crossfades between steps
    const hin = eo(t, t0, 0.4), hout = i < 5 ? ei(t, ST(i + 1) - 0.18, 0.18) : 0;
    ctx.save(); ctx.globalAlpha *= 1 - hout; UI.stepHeader(ctx, i, 6, CAPS[i][0], t, t0, { y: 320, size: i === 5 ? 46 : 50, sub: CAPS[i][1] }); ctx.restore();
    // the window
    const wu = sp(t, T_STEPS, 2.4, 0.7); if (wu <= 0) { ctx.restore(); return; }
    ctx.save(); ctx.globalAlpha *= clamp((t - T_STEPS) / 0.12); ctx.translate(0, (1 - wu) * 80);
    const AXI0 = ST(4) + 2.2, AXI1 = ST(5) + 2.95;   // the Axi sign-in page is open between these two times
    const urlT = UI.typed('claude.ai/customize/connectors', t, ST(0) + 0.35, 24), onAxi = t > AXI0 && t < AXI1;
    const url = onAxi ? 'Axi' : urlT.s;
    const R = UI.window(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { url, caret: t < ST(0) + 1.75 && UI.caretOn(t) });
    ctx.save(); rr(ctx, R.x, R.y, R.w, R.h, 0); ctx.clip();
    const ADD = [R.x + R.w - 124, R.y + 80], ITEM = [R.x + R.w - 44 - 180, R.y + 168], NAME = [R.x + 260, R.y + 322], URLF = [R.x + 470, R.y + 462], DADD = [R.x + R.w - 155, R.y + 670], CONN = [R.x + R.w - 134, R.y + 568], LOGIN = [R.x + R.w / 2, R.y + 720], EMAIL = [R.x + 380, R.y + 440];
    // the Connectors page fades out before the Axi page opens, and back in after it closes
    const page = smooth(inv(ST(0) + 1.8, ST(0) + 2.2, t)) * (t <= AXI0 ? 1 - smooth(inv(AXI0 - 0.2, AXI0, t)) : smooth(inv(AXI1, AXI1 + 0.18, t)));
    if (!onAxi && page > 0) {
      const axiState = t < ST(4) + 1.1 ? 0 : t < AXI1 ? 1 : 2;
      ctx.save(); ctx.globalAlpha *= page;
      UI.connectorsPage(ctx, R, t, { addPress: pressAt(t, ST(1) + 1.0), axi: axiState, axiIn: eo(t, ST(4) + 1.1, 0.35), connectPress: pressAt(t, ST(4) + 1.85) });
      UI.addMenu(ctx, R, eo(t, ST(1) + 1.05, 0.2) * (1 - ei(t, ST(1) + 1.8, 0.12)), t > ST(1) + 1.45);
      const dlg = eo(t, ST(1) + 1.85, 0.35) * (1 - ei(t, ST(4) + 0.75, 0.25));
      const name = t < ST(2) + 0.8 ? '' : UI.typed('Axi', t, ST(2) + 0.8, 7).s, pasted = t > ST(3) + 1.0;
      UI.addDialog(ctx, R, dlg, t, { name, url: pasted ? URL : '', focus: t > ST(3) + 0.55 ? 'url' : t > ST(2) + 0.55 ? 'name' : '', nameCaret: t > ST(2) + 0.55 && t < ST(3) + 0.55 && UI.caretOn(t), urlCaret: t > ST(3) + 0.55 && UI.caretOn(t), flash: pasted ? Math.exp(-(t - ST(3) - 1.0) / 0.25) : 0, addPress: pressAt(t, ST(4) + 0.7) });
      if (axiState === 2) { const g = Math.exp(-(t - ST(5) - 3.0) / 0.35); ripple(ctx, CONN[0] - 16, CONN[1], t, ST(5) + 3.05, { r0: 10, r1: 120, w: 3, n: 2, a: 0.6, color: C.white }); K.sparks && g > 0.02 && K.sparks(ctx, CONN[0] - 16, CONN[1], t, ST(5) + 3.05, { color: C.white, n: 10, len: 70, r0: 26, w: 3 }); }
      ctx.restore();
    }
    if (onAxi) {
      const f = smooth(inv(AXI0, AXI0 + 0.25, t)) * (1 - smooth(inv(AXI1 - 0.2, AXI1, t)));
      ctx.save(); ctx.globalAlpha *= f;
      const em = UI.typed('name@example.com', t, ST(5) + 0.2, 24).s, pw = '•'.repeat(UI.typed('xxxxxxxxx', t, ST(5) + 1.0, 20).n);
      UI.axiLogin(ctx, R, t, { mix: inv(ST(5) + 1.9, ST(5) + 2.15, t), email: em, pass: pw, focus: t < ST(5) + 0.12 ? '' : t < ST(5) + 1.0 ? 'email' : 'pass', pressLogin: pressAt(t, ST(5) + 1.7), pressApprove: pressAt(t, ST(5) + 2.6) });
      ctx.restore();
    }
    ctx.restore();
    // the cursor through all steps
    const P = [
      [ST(1) + 0.15, 1000, 1480], [ST(1) + 0.9, ADD[0], ADD[1] + 10], [ST(1) + 1.0, ADD[0], ADD[1] + 10, 1], [ST(1) + 1.6, ITEM[0], ITEM[1]], [ST(1) + 1.75, ITEM[0], ITEM[1], 1],
      [ST(2) + 0.1, ITEM[0], ITEM[1]], [ST(2) + 0.45, NAME[0], NAME[1]], [ST(2) + 0.55, NAME[0], NAME[1], 1],
      [ST(3) + 0.1, NAME[0], NAME[1]], [ST(3) + 0.45, URLF[0], URLF[1]], [ST(3) + 0.55, URLF[0], URLF[1], 1],
      [ST(4) + 0.25, URLF[0], URLF[1]], [ST(4) + 0.6, DADD[0], DADD[1]], [ST(4) + 0.7, DADD[0], DADD[1], 1],
      [ST(4) + 1.35, DADD[0], DADD[1]], [ST(4) + 1.7, CONN[0], CONN[1]], [ST(4) + 1.85, CONN[0], CONN[1], 1],
      [ST(5) - 0.3, CONN[0], CONN[1]], [ST(5) + 0.05, EMAIL[0], EMAIL[1]], [ST(5) + 0.12, EMAIL[0], EMAIL[1], 1],
      [ST(5) + 1.2, EMAIL[0], EMAIL[1]], [ST(5) + 1.55, LOGIN[0], LOGIN[1]], [ST(5) + 1.7, LOGIN[0], LOGIN[1], 1],
      [ST(5) + 2.3, LOGIN[0], LOGIN[1]], [ST(5) + 2.5, LOGIN[0] + 30, LOGIN[1]], [ST(5) + 2.6, LOGIN[0] + 30, LOGIN[1], 1], [ST(5) + 3.4, LOGIN[0] + 200, LOGIN[1] + 260],
    ];
    if (t > ST(1) + 0.15) {
      const c = UI.path(P, t); UI.cursor(ctx, c.x, c.y, { press: c.press, alpha: clamp((t - ST(1) - 0.15) / 0.15) });
      P.forEach((p) => { if (p[3]) UI.tap(ctx, p[1], p[2], t, p[0]); });
    }
    // paste cue and the URL called out large under the window
    const pc = eo(t, ST(3) + 0.8, 0.2) * (1 - ei(t, ST(3) + 1.5, 0.2));
    if (pc > 0) { ctx.save(); ctx.globalAlpha *= pc; rr(ctx, URLF[0] + 40, URLF[1] + 50, 150, 54, 12); ctx.fillStyle = '#2B2D31'; ctx.fill(); lat(ctx, 'Ctrl + V', URLF[0] + 115, URLF[1] + 86, { w: 600, size: 26, color: '#ECEDEF' }); ctx.restore(); }
    const cu = sp(t, ST(3) + 1.2, 2.6, 0.6) * (1 - ei(t, ST(4) + 0.4, 0.25));
    if (cu > 0) { ctx.save(); ctx.globalAlpha *= clamp((t - ST(3) - 1.2) / 0.1); ctx.translate(W / 2, 1600); ctx.scale(lerp(0.85, 1, cu), lerp(0.85, 1, cu)); rr(ctx, -430, -48, 860, 96, 48); ctx.fillStyle = C.off; ctx.fill(); lat(ctx, URL, 0, 15, { w: 700, size: 44, color: C.ink }); ctx.restore(); }
    UI.done(ctx, 'تم الربط بنجاح', W / 2 + 150, 1600, t, ST(5) + 3.2, { size: 44 });
    ctx.restore();
  }
  function pressAt(t, tc) { const d = t - tc; return d > -0.04 && d < 0.2 ? Math.sin(Math.PI * clamp((d + 0.04) / 0.24)) : 0; }

  // ---------------- 6 · try it ----------------
  function tryIt(ctx, t) {
    if (!live(t, T_TRY, T_SAFE)) return;
    ctx.save(); exitUp(ctx, t, T_SAFE);
    arWords(ctx, 'جرّبه الآن', W / 2, 330, t, { t0: T_TRY + 0.05, st: 0.08, d: 0.45, w: 700, size: 92 });
    const wu = sp(t, T_TRY + 0.15, 2.4, 0.7); if (wu <= 0) { ctx.restore(); return; }
    ctx.save(); ctx.globalAlpha *= clamp((t - T_TRY - 0.15) / 0.12); ctx.translate(0, (1 - wu) * 80);
    const R = UI.window(ctx, 60, 430, 960, 1110, {});
    // the connector is on in this chat
    rr(ctx, R.x + R.w - 250, R.y + 26, 214, 64, 32); ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fill();
    K.logoIQ(ctx, R.x + R.w - 200, R.y + 58, 54); UI.text(ctx, 'Axi', R.x + R.w - 158, R.y + 68, { size: 28, w: 700 }); disc(ctx, R.x + R.w - 66, R.y + 58, 9, 'rgba(255,255,255,0.85)');
    ctx.fillStyle = UI.colors.LINE; ctx.fillRect(R.x, R.y + 112, R.w, 2);
    ctx.save(); rr(ctx, R.x, R.y + 114, R.w, R.h - 114, 0); ctx.clip();
    const sc = cio(t, T_TRY + 3.0, 0.55) * 600, xr = R.x + R.w - 50;
    ctx.translate(0, -sc);
    const q1 = UI.typed('ما رصيد حسابي؟', t, T_TRY + 0.6, 16);
    if (t > T_TRY + 0.5) UI.userBubble(ctx, q1.s, xr, R.y + 160, { size: 48, caret: !q1.done && UI.caretOn(t) });
    if (t > T_TRY + 1.5) UI.assistant(ctx, xr, R.y + 360, t, { size: 30, thinking: t < T_TRY + 1.8, alpha: clamp((t - T_TRY - 1.5) / 0.1) });
    UI.balanceCard(ctx, R.x + 50, R.y + 390, R.w - 100, t, T_TRY + 1.8, { value: 12480.5 });
    const q2 = UI.typed('ضع وقف الخسارة لصفقة EUR/USD عند 1.0820', t, T_TRY + 3.4, 30);
    if (t > T_TRY + 3.3) UI.userBubble(ctx, q2.s, xr, R.y + 760, { size: 40, caret: !q2.done && UI.caretOn(t) });
    if (t > T_TRY + 4.9) UI.assistant(ctx, xr, R.y + 950, t, { size: 30, thinking: t < T_TRY + 5.15, alpha: clamp((t - T_TRY - 4.9) / 0.1) });
    const press = T_TRY + 6.25;
    UI.approvalCard(ctx, R.x + 50, R.y + 980, R.w - 100, t, T_TRY + 5.15, { press });
    UI.done(ctx, 'تم تعديل وقف الخسارة', xr, R.y + 1430, t, press + 0.2, { size: 38 });
    ctx.restore(); ctx.restore();
    const cp = UI.path([[T_TRY + 5.5, 1060, 1700], [press - 0.05, 780, 1082], [press, 780, 1082, 1], [T_SAFE, 820, 1130]], t);
    if (t > T_TRY + 5.5) { UI.cursor(ctx, cp.x, cp.y, { press: cp.press, alpha: clamp((t - T_TRY - 5.5) / 0.15) }); UI.tap(ctx, 780, 1078, t, press); }
    const nu = eo(t, T_TRY + 6.6, 0.5);
    if (nu > 0) mixLine(ctx, [{ t: 'Claude', lat: true }, { t: 'يعرض الطلب… ولا ينفّذه إلا بموافقتك' }], W / 2, 1610 + (1 - nu) * 20, { size: 40, lsize: 38, w: 600, lw: 700, color: C.white, alpha: nu, gap: 12 });
    ctx.restore();
  }

  // ---------------- 7 · you stay in control ----------------
  const SAFE = [['shield', [{ t: 'كل صفقة أو أمر يحتاج موافقتك' }]], ['lock', [{ t: 'بيانات دخولك لا تُشارك مع' }, { t: 'Claude', lat: true }]], ['plug', [{ t: 'يمكنك فصل الربط في أي وقت' }]]];
  function safe(ctx, t) {
    if (!live(t, T_SAFE, T_CTA)) return;
    ctx.save(); exitUp(ctx, t, T_CTA - 0.1);
    arWords(ctx, 'أنت المتحكم دائمًا', W / 2, 600, t, { t0: T_SAFE + 0.05, st: 0.08, d: 0.45, w: 700, size: 92, colors: [C.white, C.white, C.red] });
    SAFE.forEach(([ic, parts], i) => {
      const t0 = T_SAFE + 0.45 + i * 0.35, u = sp(t, t0, 2.8, 0.62), y = 800 + i * 190; if (u <= 0) return;
      ctx.save(); ctx.globalAlpha *= clamp((t - t0) / 0.1); ctx.translate(-(1 - u) * 140, 0);
      UI.card(ctx, 80, y - 80, 920, 160, { r: 34 }); UI[ic](ctx, 1000 - 72, y, 1.6, UI.colors.TXT);
      mixLine(ctx, parts, 1000 - 132, y + 14, { size: 40, lsize: 38, w: 600, lw: 700, color: C.white, align: 'right', gap: 12 });
      ctx.restore();
    });
    ctx.restore();
  }

  // ---------------- 8 · CTA ----------------
  function cta(ctx, t) {
    if (t < T_CTA - 0.4) return;
    K.riseWipe(ctx, eio(t, T_CTA - 0.35, 0.45));
    if (t < T_CTA - 0.05) return;
    K.logoReveal(ctx, W / 2, 470, 560, t, T_CTA);
    const lu = eo(t, T_CTA + 0.4, 0.45);
    if (lu > 0) mixLine(ctx, [{ t: 'متصل الآن مع' }, { t: 'Claude', lat: true }], W / 2, 760 + (1 - lu) * 30, { size: 52, lsize: 50, w: 600, lw: 700, color: C.white, alpha: lu, gap: 16 });
    K.ctaPill(ctx, W / 2, 900, t, T_CTA + 0.55, 'ابدأ الآن', { tb: B(121), w: 520 });
    const uu = eo(t, T_CTA + 0.75, 0.45);
    if (uu > 0) {
      lat(ctx, 'mcp.axi.com', W / 2, 1040 + (1 - uu) * 20, { w: 700, size: 50, color: C.ink, alpha: uu });
      mixLine(ctx, [{ t: 'لحسابات' }, { t: 'MT5', lat: true }, { t: '· إصدار تجريبي' }, { t: '(Alpha)', lat: true }], W / 2, 1098, { size: 28, lsize: 26, w: 400, lw: 600, color: C.graphite, alpha: uu * 0.9, gap: 9 });
    }
    K.riskStrip(ctx, t, 57.0, 1150);
  }

  function scene(ctx, t) {
    K.bgDark(ctx);
    backdrop(ctx, t, smooth(inv(-0.2, 0.4, t)));
    hook(ctx, t); title(ctx, t); what(ctx, t); need(ctx, t); steps(ctx, t); tryIt(ctx, t); safe(ctx, t); cta(ctx, t);
  }
  const CUTS = [T_TITLE, T_WHAT, T_NEED, T_STEPS, T_TRY, T_SAFE, T_CTA];
  window.FILM = {
    duration: 60,
    blur(t) {
      if (t < 0.6) return 4;
      for (const c of CUTS) if (Math.abs(t - c) < 0.4) return 8;
      for (let i = 1; i < 6; i++) if (Math.abs(t - ST(i)) < 0.3) return 6;
      return 1;
    },
    draw(ctx, t) {
      scene(ctx, t);
      if (t < T_CTA - 0.2) K.watermark(ctx, C.white, 0.6 * (1 - smooth(inv(T_CTA - 0.5, T_CTA - 0.2, t))));
      K.grain(ctx, t, 0.03, t > 59.2);
    },
  };
})();
