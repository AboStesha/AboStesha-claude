// EXPLAINER 60 v2 — how to connect an Axi MT5 account to Claude, following Axi's own walkthrough step by step:
// Axi client portal → Settings → MCP Management → copy the server URL → Connect next to Claude → Claude:
// Customize → Connectors → Add → name "Axi MCP", paste the URL → Continue → keep "Always required" and
// "Anthropic's hosted client metadata" → Add → Reconnect if the connection has expired → sign in to Axi →
// review the permissions → Accept → Connected, with tool permissions on the same page.
// Glassmorphism on Axi's steel gradient (the look of Axi's own campaign film); Claude moments in Claude's palette.
// No risk strip at the end (client request). 60 s, 9:16, 128 bpm.
(function () {
  const { W, H, B, clamp, lerp, inv, smooth, eo, ei, co, sp, ar, arW, lat, mixLine, rr, disc } = K;
  const { AX, CL, glass, stage, dust, snap, film, camera, popWords, trackIn, lockup, LO, PO, STEEL } = GL;
  const T_NEED = B(8), ST = [16, 30, 40, 50, 63, 77, 95, 112].map(B), T_END = ST[7];

  // ---------------- light pillars ----------------
  const WARM = [
    { x: 50, y: -240, w: 260, h: 1700, c: CL.orange, a: 0.9, sp: 0.45, amp: 30, ph: 0 },
    { x: 45, y: -80, w: 100, h: 1300, c: '#F4B79C', a: 0.55, sp: 0.45, amp: 30, ph: 0 },
    { x: 1030, y: 200, w: 280, h: 1800, c: CL.blue, a: 0.6, sp: 0.35, amp: 40, ph: 2 },
  ];
  // on the light steel stage: soft white light, with a warm (Claude) or cool (Axi) side glow
  const lightP = (warm) => [
    { x: 160, y: -200, w: 360, h: 2000, c: warm ? '#F2B9A0' : '#FFFFFF', a: warm ? 0.55 : 0.35, sp: 0.3, amp: 60, ph: 0 },
    { x: 930, y: -100, w: 300, h: 2000, c: '#FFFFFF', a: 0.3, sp: 0.25, amp: 70, ph: 2 },
    { x: 560, y: 1200, w: 500, h: 900, c: warm ? '#E9A88C' : '#DDE5E8', a: 0.35, sp: 0.4, amp: 120, ph: 4 },
  ];
  const lightStage = (ctx, t, warm, o = {}) => stage(ctx, t, { grad: STEEL, pillars: lightP(warm), blend: 'source-over', soft: 20, dx: o.dx || 0 });

  // ---------------- 1 · hook ----------------
  const S0 = { t0: 0, t1: T_NEED, render(ctx, t) {
    stage(ctx, t, { pillars: WARM, alpha: smooth(inv(-0.05, 0.4, t)), dx: -t * 30 }); dust(ctx, t, { a: 0.45, dy: -t * 120 });
    ctx.save(); camera(ctx, t, 0, T_NEED, { s0: 1.0, s1: 1.07, drift: 7 });
    popWords(ctx, 'حسابك في آكسي', W / 2, 640, t, { t0: 0.05, size: 110, w: 700, color: '#FFFFFF', st: 0.09, from: 1.5 });
    const u = eo(t, 0.45, 0.5);
    if (u > 0) mixLine(ctx, [{ t: 'الآن داخل' }, { t: 'Claude', lat: true, color: CL.orange2 }], W / 2, 785 + (1 - u) * 40, { size: 110, lsize: 104, w: 700, lw: 700, color: '#FFFFFF', alpha: clamp(u * 1.5), gap: 26 });
    snap(ctx.canvas);
    lockup(ctx, W / 2, 1200, t, 0.9, { tw: 410, th: 310, cs: 96, glint: clamp((t - 1.5) / 0.8) });
    ctx.restore();
  } };

  // ---------------- 2 · what you need ----------------
  const S1 = { t0: T_NEED, t1: ST[0], render(ctx, t) {
    lightStage(ctx, t, false, { dx: -(t - T_NEED) * 30 });
    ctx.save(); camera(ctx, t, T_NEED, ST[0], { s0: 1.04, s1: 1.0, drift: 5 });
    popWords(ctx, 'قبل أن تبدأ', W / 2, 560, t, { t0: T_NEED + 0.05, size: 100, w: 700, color: '#FFFFFF', st: 0.08 });
    snap(ctx.canvas);
    const a1 = sp(t, T_NEED + 0.35, 2.4, 0.6), a2 = sp(t, T_NEED + 0.75, 2.4, 0.6);
    if (a1 > 0) { ctx.save(); ctx.translate((1 - clamp(a1)) * 260, 0); U3.reqChip(ctx, W / 2, 900, 'axi', { w: 520, h: 150, alpha: clamp((t - T_NEED - 0.35) / 0.12), glint: clamp((t - T_NEED - 0.8) / 0.6) }); ctx.restore(); }
    if (a2 > 0) { ctx.save(); ctx.translate(-(1 - clamp(a2)) * 260, 0); U3.reqChip(ctx, W / 2, 1100, 'claude', { w: 520, h: 150, alpha: clamp((t - T_NEED - 0.75) / 0.12), glint: clamp((t - T_NEED - 1.2) / 0.6) }); ctx.restore(); }
    const cu = eo(t, T_NEED + 1.2, 0.5);
    if (cu > 0) {
      mixLine(ctx, [{ t: 'حساب' }, { t: 'MT5', lat: true }, { t: 'مؤهل في آكسي' }], W / 2, 1290 + (1 - cu) * 20, { size: 46, lsize: 42, w: 600, lw: 700, color: '#1D2326', alpha: cu, gap: 12 });
      mixLine(ctx, [{ t: 'وحساب فعّال في' }, { t: 'Claude', lat: true }], W / 2, 1366 + (1 - cu) * 20, { size: 46, lsize: 42, w: 600, lw: 700, color: '#1D2326', alpha: cu, gap: 12 });
    }
    ctx.restore();
  } };

  // ---------------- 3 · the steps ----------------
  const WIN = { x: 40, y: 430, w: 1000, h: 1190 };
  const R = { x: WIN.x + 14, y: WIN.y + 78, w: WIN.w - 28, h: WIN.h - 92 };
  const KZ = 1.12, RV = { x: 0, y: 0, w: R.w / KZ, h: R.h / KZ };   // screens are drawn 12% larger for phones
  const map = (p) => [R.x + p[0] * KZ, R.y + p[1] * KZ];
  // element positions, measured once from the screens themselves
  const OFF = GL.mk(W, H).getContext('2d');
  const P = {
    login: U3.axiLogin(OFF, RV, 0, {}), set: U3.axiSettings(OFF, RV, 0, { tab: 2 }), cus: U3.claudeCustomize(OFF, RV, 0, { tab: 1 }),
    d1: U3.addConnector1(OFF, RV, 1, 0, {}), d2: U3.addConnector2(OFF, RV, 1, 0, {}), con: U3.connector(OFF, RV, 0, { state: 'expired' }), cons: U3.axiConsent(OFF, RV, 0, {}),
  };
  const s = (i, x) => ST[i] + x;
  // page timeline inside the window (each page dips in and out)
  const PAGES = [
    { t0: s(0, -0.2), t1: s(0, 2.45), url: 'Axi · client portal', axi: true, draw: (ctx, t) => {
      const em = U2.typed('johndoe@email.com', t, s(0, 0.45), 26), pw = '•'.repeat(U2.typed('xxxxxxxxxx', t, s(0, 1.6), 28).n);
      U3.axiLogin(ctx, RV, t, { email: em.s, pass: pw, focus: t > s(0, 1.55) ? 'pass' : t > s(0, 0.35) ? 'email' : '', caret: U2.caret(t), press: press(t, s(0, 2.3)) });
    } },
    { t0: s(0, 2.45), t1: s(1, 3.0), url: 'Axi · client portal', axi: true, draw: (ctx, t) => {
      const tab = t > s(0, 3.7) ? 2 : 0;
      U3.axiSettings(ctx, RV, t, { tab, reveal: eo(t, s(0, 3.72), 0.4), tabHint: tab === 2 ? 0 : smooth(inv(s(0, 3.0), s(0, 3.3), t)), copied: t > s(1, 0.9) ? clamp(1 - smooth(inv(s(1, 2.4), s(1, 2.7), t))) : 0, connectPress: press(t, s(1, 2.6)), connectGlow: smooth(inv(s(1, 2.0), s(1, 2.3), t)) * (t < s(1, 2.7) ? 1 : 0) });
    } },
    { t0: s(1, 3.0), t1: s(4, 4.8), url: 'claude.ai/customize/connectors', draw: (ctx, t) => {
      U3.claudeCustomize(ctx, RV, t, { tab: t > s(2, 0.75) ? 1 : 0, tabHint: t < s(2, 0.75) ? smooth(inv(s(2, 0.1), s(2, 0.4), t)) : 0, addPress: press(t, s(2, 2.0)), addGlow: smooth(inv(s(2, 1.3), s(2, 1.6), t)) * (t < s(2, 2.1) ? 1 : 0) });
      const a1 = eo(t, s(2, 2.15), 0.35) * (1 - smooth(inv(s(3, 3.65), s(3, 3.8), t)));
      const name = U2.typed('Axi MCP', t, s(3, 0.45), 12).s, url = t > s(3, 2.0) ? 'https://mcp.axi.com/mcp' : '';
      U3.addConnector1(ctx, RV, a1, t, { name, url, focus: t > s(3, 1.6) ? 'url' : t > s(3, 0.3) ? 'name' : '', caret: U2.caret(t) && t < s(3, 2.0), flash: url ? Math.exp(-(t - s(3, 2.0)) / 0.25) : 0, press: press(t, s(3, 3.55)), glow: smooth(inv(s(3, 2.9), s(3, 3.2), t)) * (t < s(3, 3.6) ? 1 : 0) });
      const a2 = eo(t, s(3, 3.75), 0.35) * (1 - smooth(inv(s(4, 4.45), s(4, 4.7), t)));
      U3.addConnector2(ctx, RV, a2, t, { hiAuth: bump(t, s(4, 0.3), s(4, 1.7)), hiOauth: bump(t, s(4, 1.9), s(4, 3.3)), press: press(t, s(4, 4.35)), glow: smooth(inv(s(4, 3.7), s(4, 4.0), t)) * (t < s(4, 4.4) ? 1 : 0) });
    } },
    { t0: s(4, 4.8), t1: s(5, 1.8), url: 'claude.ai/customize/connectors', draw: (ctx, t) => {
      U3.connector(ctx, RV, t, { state: t < s(5, 0.4) ? 'checking' : 'expired', press: press(t, s(5, 1.5)), glow: smooth(inv(s(5, 0.9), s(5, 1.2), t)) * (t < s(5, 1.55) ? 1 : 0) });
    } },
    { t0: s(5, 1.8), t1: s(5, 3.45), url: 'Axi · sign in', axi: true, draw: (ctx, t) => {
      const pw = '•'.repeat(U2.typed('xxxxxxxxxx', t, s(5, 2.15), 26).n);
      U3.axiLogin(ctx, RV, t, { email: 'johndoe@email.com', pass: pw, focus: 'pass', caret: U2.caret(t), press: press(t, s(5, 3.1)) });
    } },
    { t0: s(5, 3.45), t1: s(5, 6.6), url: 'Axi · sign in', axi: true, draw: (ctx, t) => {
      U3.axiConsent(ctx, RV, t, { scopes: (t - s(5, 3.6)) / 0.25, press: press(t, s(5, 6.05)), glow: smooth(inv(s(5, 5.3), s(5, 5.6), t)) * (t < s(5, 6.1) ? 1 : 0) });
    } },
    { t0: s(5, 6.6), t1: T_END + 1, url: 'claude.ai/customize/connectors', draw: (ctx, t) => {
      U3.connector(ctx, RV, t, { state: 'connected', toast: eo(t, s(6, 0.2), 0.45), tools: eo(t, s(6, 1.1), 0.4), toolsT: (t - s(6, 1.1)) / 0.2 });
    } },
  ];
  function press(t, tc) { const d = t - tc; return d > -0.04 && d < 0.2 ? Math.sin(Math.PI * clamp((d + 0.04) / 0.24)) : 0; }
  function bump(t, a, b) { return smooth(inv(a, a + 0.3, t)) * (1 - smooth(inv(b - 0.3, b, t))); }
  const cur = (o, k) => o[k];
  // the cursor through every step: [t, x, y, click]
  const KEYS = [
    [s(0, 0.0), 860, 1500], [s(0, 0.25), ...map(P.login.email)], [s(0, 0.35), ...map(P.login.email), 1],
    [s(0, 1.35), ...map(P.login.email)], [s(0, 1.5), ...map(P.login.pass)], [s(0, 1.55), ...map(P.login.pass), 1],
    [s(0, 2.05), ...map(P.login.pass)], [s(0, 2.22), ...map(P.login.login)], [s(0, 2.3), ...map(P.login.login), 1],
    [s(0, 3.1), ...map(P.login.login)], [s(0, 3.55), ...map(P.set.tab2)], [s(0, 3.65), ...map(P.set.tab2), 1],
    [s(1, 0.4), ...map(P.set.tab2)], [s(1, 0.75), ...map(P.set.copy)], [s(1, 0.85), ...map(P.set.copy), 1],
    [s(1, 2.0), ...map(P.set.copy)], [s(1, 2.45), ...map(P.set.connect)], [s(1, 2.6), ...map(P.set.connect), 1],
    [s(2, 0.3), ...map(P.set.connect)], [s(2, 0.6), ...map(P.cus.tab1)], [s(2, 0.72), ...map(P.cus.tab1), 1],
    [s(2, 1.4), ...map(P.cus.tab1)], [s(2, 1.9), ...map(P.cus.add)], [s(2, 2.0), ...map(P.cus.add), 1],
    [s(3, 0.1), ...map(P.cus.add)], [s(3, 0.25), ...map(P.d1.name)], [s(3, 0.3), ...map(P.d1.name), 1],
    [s(3, 1.3), ...map(P.d1.name)], [s(3, 1.55), ...map(P.d1.url)], [s(3, 1.6), ...map(P.d1.url), 1],
    [s(3, 2.9), ...map(P.d1.url)], [s(3, 3.45), ...map(P.d1.cont)], [s(3, 3.55), ...map(P.d1.cont), 1],
    [s(4, 0.1), ...map(P.d1.cont)], [s(4, 0.45), ...map([P.d2.auth[0] + 30, P.d2.auth[1] + 6])],
    [s(4, 1.7), ...map([P.d2.auth[0] + 30, P.d2.auth[1] + 6])], [s(4, 2.1), ...map([P.d2.oauth[0] + 30, P.d2.oauth[1] + 6])], [s(4, 2.2), ...map([P.d2.oauth[0] + 30, P.d2.oauth[1] + 6]), 1],
    [s(4, 3.6), ...map([P.d2.oauth[0] + 30, P.d2.oauth[1] + 6])], [s(4, 4.25), ...map(P.d2.add)], [s(4, 4.35), ...map(P.d2.add), 1],
    [s(5, 0.6), ...map(P.d2.add)], [s(5, 1.4), ...map(P.con.reconnect)], [s(5, 1.5), ...map(P.con.reconnect), 1],
    [s(5, 2.6), ...map(P.con.reconnect)], [s(5, 2.95), ...map(P.login.login)], [s(5, 3.1), ...map(P.login.login), 1],
    [s(5, 5.4), ...map(P.login.login)], [s(5, 5.9), ...map(P.cons.accept)], [s(5, 6.05), ...map(P.cons.accept), 1],
    [s(6, 1.6), ...map(P.cons.accept)], [s(6, 2.6), 820, 1040], [T_END, 840, 1080],
  ];
  const CAPS = [
    [[{ t: 'سجّل الدخول إلى بوابة آكسي' }], [{ t: 'ثم الإعدادات ←' }, { t: 'MCP Management', lat: true }]],
    [[{ t: 'انسخ رابط خادم' }, { t: 'MCP', lat: true }], [{ t: 'ثم اضغط' }, { t: 'Connect', lat: true }, { t: 'بجانب' }, { t: 'Claude', lat: true }]],
    [[{ t: 'في' }, { t: 'Claude', lat: true, color: CL.orange2 }, { t: 'افتح' }, { t: 'Customize', lat: true }], [{ t: 'ثم' }, { t: 'Connectors', lat: true }, { t: 'واضغط' }, { t: 'Add', lat: true }]],
    [[{ t: 'سمِّ الموصل' }, { t: 'Axi MCP', lat: true }], [{ t: 'والصق الرابط ثم' }, { t: 'Continue', lat: true }]],
    [[{ t: 'اترك الخيارات المقترحة' }], [{ t: 'ثم اضغط' }, { t: 'Add', lat: true }]],
    [[{ t: 'سجّل الدخول إلى آكسي' }], [{ t: 'راجع الصلاحيات واضغط' }, { t: 'Accept', lat: true }]],
    [[{ t: 'تم الربط' }, { t: '✓', lat: true }], [{ t: 'وأدِر صلاحيات الأدوات من الصفحة نفسها' }]],
  ];
  function header(ctx, t) {
    const i = clamp(ST.findIndex((x, k) => t >= x && t < ST[k + 1]), 0, 6), t0 = ST[i], u = eo(t, t0, 0.45), out = i < 6 ? smooth(inv(ST[i + 1] - 0.2, ST[i + 1], t)) : 0;
    for (let k = 0; k < 7; k++) { const sw = (W - 160 - 6 * 12) / 7, sx = W - 80 - (k + 1) * sw - k * 12; rr(ctx, sx, 150, sw, 8, 4); ctx.fillStyle = k < i ? 'rgba(255,255,255,0.9)' : k === i ? `rgba(255,255,255,${0.3 + 0.6 * u})` : 'rgba(255,255,255,0.25)'; ctx.fill(); }
    ctx.save(); ctx.globalAlpha *= u * (1 - out); ctx.translate(0, (1 - u) * 30 - out * 20);
    const num = String(i + 1).padStart(2, '0'); lat(ctx, num, W - 80, 304, { w: 800, size: 104, color: '#FFFFFF', align: 'right' });
    const nw = K.latW(ctx, num, { w: 800, size: 104 });
    mixLine(ctx, CAPS[i][0], W - 80 - nw - 30, 268, { size: 50, lsize: 46, w: 600, lw: 700, color: '#FFFFFF', align: 'right', gap: 14 });
    mixLine(ctx, CAPS[i][1], W - 80 - nw - 30, 330, { size: 36, lsize: 34, w: 400, lw: 600, color: 'rgba(255,255,255,0.86)', align: 'right', gap: 10 });
    ctx.restore();
  }
  const S2 = { t0: ST[0], t1: T_END, render(ctx, t) {
    const pg = PAGES.find((p) => t >= p.t0 && t < p.t1) || PAGES[PAGES.length - 1];
    lightStage(ctx, t, !pg.axi, { dx: Math.sin(t * 0.2) * 40 });
    dust(ctx, t, { a: 0.25, dy: -t * 60 });
    header(ctx, t);
    snap(ctx.canvas);
    const wu = sp(t, ST[0] - 0.05, 2.2, 0.7);
    ctx.save(); ctx.globalAlpha *= clamp((t - ST[0] + 0.05) / 0.12); ctx.translate(0, (1 - clamp(wu, 0, 1.2)) * 120);
    U3.win(ctx, WIN.x, WIN.y, WIN.w, WIN.h, { url: pg.url, glint: clamp((t - ST[0] - 0.2) / 0.8) });
    ctx.save(); ctx.beginPath(); ctx.roundRect(R.x, R.y, R.w, R.h, [6, 6, 24, 24]); ctx.clip(); ctx.translate(R.x, R.y); ctx.scale(KZ, KZ);
    PAGES.forEach((p) => { if (t < p.t0 - 0.01 || t >= p.t1) return; const a = smooth(inv(p.t0, p.t0 + 0.2, t)) * (1 - smooth(inv(p.t1 - 0.15, p.t1, t))); if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; p.draw(ctx, t); ctx.restore(); });
    ctx.restore(); ctx.restore();
    // cursor + taps (dark ripples on the light UI)
    const c = UI.path(KEYS, t);
    if (t > ST[0]) { U2.cursor(ctx, c.x, c.y, { press: c.press, alpha: clamp((t - ST[0]) / 0.2) }); KEYS.forEach((k) => { if (k[3]) U2.tap(ctx, k[1], k[2], t, k[0], '#141413'); }); }
    // "Ctrl + V" cue when the URL is pasted
    const pc = eo(t, s(3, 1.75), 0.15) * (1 - smooth(inv(s(3, 2.4), s(3, 2.6), t))), PU = map(P.d1.url);
    if (pc > 0) { ctx.save(); ctx.globalAlpha *= pc; rr(ctx, PU[0] + 40, PU[1] + 50, 150, 54, 12); ctx.fillStyle = '#141413'; ctx.fill(); lat(ctx, 'Ctrl + V', PU[0] + 115, PU[1] + 86, { w: 600, size: 26, color: '#FFFFFF' }); ctx.restore(); }
  } };

  // ---------------- 4 · end card (no risk strip, by request) ----------------
  const S3 = { t0: T_END, t1: 60.01, render(ctx, t) {
    lightStage(ctx, t, true, { dx: -(t - T_END) * 20 });
    dust(ctx, t, { a: 0.3, dy: -t * 60 });
    ctx.save(); camera(ctx, t, T_END, 60, { s0: 1.04, s1: 1.0, drift: 4 });
    const lu = eo(t, T_END + 0.05, 0.6);
    K.logoReveal(ctx, W / 2, 510, 500, t, T_END + 0.05);
    snap(ctx.canvas);
    const cu = sp(t, T_END + 0.5, 2.4, 0.6);
    if (cu > 0) { ctx.save(); ctx.translate(W / 2, 790); ctx.scale(clamp(cu, 0, 1.1), clamp(cu, 0, 1.1)); ctx.translate(-W / 2, -790); U3.toggleChip(ctx, W / 2, 790, smooth(inv(T_END + 1.0, T_END + 1.25, t)), { w: 440, h: 132, glint: clamp((t - T_END - 1.3) / 0.7) }); ctx.restore(); }
    popWords(ctx, 'حسابك متصل وجاهز', W / 2, 1000, t, { t0: T_END + 1.3, size: 90, w: 700, color: '#141413', st: 0.08, shadow: false });
    mixLine(ctx, [{ t: 'للاستخدام مع' }, { t: 'Claude', lat: true, color: '#B4573A' }], W / 2, 1100, { size: 60, lsize: 58, w: 600, lw: 700, color: '#141413', alpha: eo(t, T_END + 1.7, 0.5), gap: 16 });
    K.ctaPill(ctx, W / 2, 1265, t, T_END + 2.1, 'ابدأ الآن', { tb: B(121), w: 540, h: 124, size: 56 });
    const uu = eo(t, T_END + 2.5, 0.45);
    if (uu > 0) {
      snap(ctx.canvas);
      glass(ctx, W / 2 - 260, 1384, 520, 96, { tone: 'white', r: 48, alpha: uu, lift: 0.5 });
      lat(ctx, 'mcp.axi.com', W / 2, 1448, { w: 700, size: 46, color: '#141413', alpha: uu });
      ar(ctx, 'تداول بميزتك', W / 2, 1580, { w: 600, size: 46, color: '#3C4549', alpha: eo(t, T_END + 2.9, 0.5) });
    }
    ctx.restore();
  } };

  const SCENES = [S0, S1, S2, S3];
  const CUTS = [{ at: T_NEED, d: 0.42, kind: 'slab' }, { at: ST[0], d: 0.36, kind: 'frost' }, { at: T_END, d: 0.4, kind: 'zoom', cy: 1000 }];
  window.FILM = {
    duration: 60,
    blur(t) {
      for (const c of CUTS) if (Math.abs(t - c.at) < c.d / 2 + 0.05) return c.kind === 'slab' ? 14 : 8;
      for (const p of PAGES) if (Math.abs(t - p.t0) < 0.2) return 4;
      return 2;
    },
    draw(ctx, t) {
      film(ctx, t, SCENES, CUTS);
      const light = t > T_NEED - 0.2;
      if (t < T_END - 0.1) K.watermark(ctx, light ? '#141413' : '#FFFFFF', 0.6 * smooth(inv(0.2, 0.6, t)) * (1 - smooth(inv(T_END - 0.4, T_END - 0.1, t))) * (Math.abs(t - T_NEED) < 0.25 ? 0 : 1));
      K.grain(ctx, t, 0.025, t > 59.6);
    },
  };
})();
