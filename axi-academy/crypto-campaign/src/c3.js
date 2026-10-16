// FILM 3 — «3 خطوات» (Three steps). 30 s, 9:16, 122 bpm. SaaS product film: a phone with a stylised Arabic Axi app,
// clean off-white stage, step headers and annotation callouts.
// 01 fund (card · bank transfer · Axi balance; commission-free deposits; no extra KYC for existing clients)
// 02 pick your coin (200+, live prices, order book) · 03 buy (0.8% commission) → the coin lands in the Axi Wallet
// → 24/7 · web & mobile · trade history → CTA «حمّل تطبيق آكسي». Prices and amounts are illustrative.
(function () {
  const { W, H, clamp, lerp, inv, smooth, eo, ei, co, cio, sp, expoOut, cubicInOut, ar, arW, lat, latW, mixLine, rr, disc } = K;
  const { AX, glass, snap, film, camera, popWords } = GL;
  const UI = CC.UI, INK = CC.INK, b = CC.grid(122);
  const T1 = b(5), T2 = b(18.5), T3 = b(33), T4 = b(48), T_END = b(54);
  const PH = { x: 260, y: 520, w: 560, h: 1160 };

  // ---------------- the app's screens (screen space S) ----------------
  const MARKET = [
    { tk: 'BTC', name: 'Bitcoin', p: '81,240.50', c: 2.14, seed: 3 }, { tk: 'ETH', name: 'Ethereum', p: '3,912.80', c: 1.62, seed: 5 },
    { tk: 'SOL', name: 'Solana', p: '172.45', c: -0.84, seed: 7 }, { tk: 'XRP', name: 'XRP', p: '1.30', c: 0.92, seed: 9 },
    { tk: 'ADA', name: 'Cardano', p: '0.71', c: -1.25, seed: 11 }, { tk: 'LINK', name: 'Chainlink', p: '18.36', c: 3.05, seed: 13 },
    { tk: 'LTC', name: 'Litecoin', p: '96.40', c: 0.48, seed: 15 }, { tk: 'XLM', name: 'Stellar', p: '0.18', c: -2.17, seed: 17 },
    { tk: 'UNI', name: 'Uniswap', p: '7.24', c: 1.11, seed: 19 }, { tk: 'AAVE', name: 'Aave', p: '155.66', c: 0.37, seed: 21 },
  ];
  const BTCP = CC.path(70, 31, 0.68);
  const T_TAPDEP = b(7), T_SHEET = b(7.6), T_TAPCARD = b(10), T_AMT = b(10.6), KEYS = [b(11.8), b(12.6), b(13.4)], T_CONT = b(15), T_DONE = b(15.6);
  const T_MKT = b(19), T_SCROLL = b(21), T_TAPBTC = b(26), T_DET = b(26.6);
  const T_TAPBUY = b(33.6), T_BUYSHEET = b(34.2), T_TAPCONF = b(39.5), T_OK = b(41), T_WAL = b(44.5);

  function home(ctx, S, t, bal) {
    ctx.fillStyle = UI.bg; ctx.fillRect(S.x, S.y, S.w, S.h); UI.status(ctx, S); UI.header(ctx, S, 'الرئيسية');
    const x = S.x + 32, w = S.w - 64;
    UI.card(ctx, x, S.y + 200, w, 230);
    ar(ctx, 'رصيدك المتاح', x + w - 34, S.y + 262, { w: 400, size: 28, color: UI.sub, align: 'right' });
    lat(ctx, bal, x + w - 34, S.y + 352, { w: 700, size: 64, color: INK, align: 'right' });
    lat(ctx, 'USD', x + 34, S.y + 352, { w: 600, size: 26, color: UI.sub, align: 'left' });
    // promo: Buy Crypto
    rr(ctx, x, S.y + 460, w, 210, 26); ctx.fillStyle = '#16181B'; ctx.fill();
    CC.coin(ctx, x + 110, S.y + 565, 64, { ticker: 'BTC', a: Math.sin(t * 1.4) * 0.6 });
    rr(ctx, x + w - 122, S.y + 492, 92, 40, 20); ctx.fillStyle = AX.red; ctx.fill(); ar(ctx, 'جديد', x + w - 76, S.y + 521, { w: 600, size: 24, color: '#FFFFFF' });
    lat(ctx, 'Buy Crypto', x + w - 34, S.y + 590, { w: 700, size: 40, color: '#FFFFFF', align: 'right' });
    ar(ctx, 'اشترِ العملات الرقمية وامتلكها', x + w - 34, S.y + 638, { w: 400, size: 24, color: 'rgba(255,255,255,0.75)', align: 'right' });
    // quick actions
    [['إيداع', 'plus'], ['شراء', 'coin'], ['المحفظة', 'wallet']].forEach(([lb, ic], i) => {
      const cx = x + w - (i + 0.5) * (w / 3), cy = S.y + 760;
      disc(ctx, cx, cy, 52, '#FFFFFF'); ctx.save(); ctx.lineWidth = 2; ctx.strokeStyle = UI.line; ctx.beginPath(); ctx.arc(cx, cy, 52, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      CC.icon(ctx, ic, cx, cy, 40, INK, 3.4); ar(ctx, lb, cx, cy + 96, { w: 600, size: 26, color: INK });
    });
    UI.card(ctx, x, S.y + 900, w, 120); ar(ctx, 'آخر العمليات', x + w - 34, S.y + 972, { w: 600, size: 28, color: INK, align: 'right' });
    UI.tabBar(ctx, S, 0);
    return { dep: [x + w - 0.5 * (w / 3), S.y + 760] };
  }
  function fundSheet(ctx, S, t, u, sel) {
    if (u <= 0) return {};
    ctx.save(); ctx.globalAlpha *= clamp(u * 1.5); ctx.fillStyle = 'rgba(9,10,13,0.35)'; ctx.fillRect(S.x, S.y, S.w, S.h); ctx.restore();
    const sh = 640, y = S.y + S.h - sh * expoOut(u);
    ctx.save(); rr(ctx, S.x, y, S.w, sh + 60, 36); ctx.fillStyle = '#FFFFFF'; ctx.fill();
    rr(ctx, S.x + S.w / 2 - 40, y + 18, 80, 8, 4); ctx.fillStyle = 'rgba(9,10,13,0.15)'; ctx.fill();
    ar(ctx, 'إضافة أموال', S.x + S.w - 40, y + 96, { w: 700, size: 36, color: INK, align: 'right' });
    ar(ctx, 'اختر طريقة التمويل', S.x + S.w - 40, y + 140, { w: 400, size: 24, color: UI.sub, align: 'right' });
    const rows = [['بطاقة', 'card', 'بطاقة ائتمان أو خصم'], ['تحويل بنكي', 'bank', 'من حسابك البنكي'], ['رصيد آكسي', 'wallet', 'من رصيد حساب التداول']], pos = [];
    rows.forEach(([lb, ic, sub], i) => {
      const ry = y + 180 + i * 136, on = sel === i;
      UI.card(ctx, S.x + 28, ry, S.w - 56, 118, { stroke: on ? AX.red : 'rgba(9,10,13,0.08)', lw: on ? 3.5 : 2 });
      disc(ctx, S.x + S.w - 92, ry + 59, 36, '#EEF0F1'); CC.icon(ctx, ic, S.x + S.w - 92, ry + 59, 38, INK, 3.4);
      ar(ctx, lb, S.x + S.w - 146, ry + 54, { w: 600, size: 30, color: INK, align: 'right' });
      ar(ctx, sub, S.x + S.w - 146, ry + 92, { w: 400, size: 22, color: UI.sub, align: 'right' });
      pos.push([S.x + S.w / 2, ry + 59]);
    });
    ctx.restore(); return { rows: pos };
  }
  function amountScreen(ctx, S, t, digits, o = {}) {
    ctx.fillStyle = UI.bg; ctx.fillRect(S.x, S.y, S.w, S.h); UI.status(ctx, S); UI.header(ctx, S, 'إضافة أموال', { back: true, logo: false });
    const sel = o.method || 'بطاقة';
    CC.chip(ctx, S.x + S.w / 2, S.y + 236, sel, { size: 26, icon: 'card', solid: '#EEF0F1', w: 600 });
    UI.amount(ctx, S.x + S.w / 2, S.y + 460, '$' + (digits || '0'), { size: 112, caret: Math.floor(t * 2.4) % 2 === 0 && !o.done });
    ar(ctx, 'إيداع بدون عمولة', S.x + S.w / 2, S.y + 540, { w: 400, size: 26, color: UI.sub });
    UI.keypad(ctx, S.x + 40, S.y + 600, S.w - 80, 380, o.pressed);
    const by = S.y + S.h - 140; UI.button(ctx, S.x + 40, by - 20, S.w - 80, 96, 'متابعة', { press: o.press || 0, alpha: digits ? 1 : 0.4 });
    return { cont: [S.x + S.w / 2, by + 28], key: (k) => { const i = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].indexOf(k), cw = (S.w - 80) / 3, chh = 95; return [S.x + 40 + (i % 3) * cw + cw / 2, S.y + 600 + Math.floor(i / 3) * chh + chh / 2]; } };
  }
  function markets(ctx, S, t, scroll, hi) {
    ctx.fillStyle = UI.bg; ctx.fillRect(S.x, S.y, S.w, S.h); UI.status(ctx, S);
    const x = S.x + 32, w = S.w - 64;
    ctx.save(); ctx.beginPath(); ctx.rect(S.x, S.y + 330, S.w, S.h - 460); ctx.clip();
    MARKET.forEach((row, i) => { const y = S.y + 340 + i * 108 - scroll; if (y < S.y + 220 || y > S.y + S.h) return; UI.coinRow(ctx, x, y, w, row, { h: 108, hi: i === 0 ? hi : 0 }); });
    ctx.restore();
    UI.header(ctx, S, 'شراء العملات الرقمية', { size: 34 });
    rr(ctx, x, S.y + 210, w, 84, 42); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = UI.line; ctx.stroke();
    CC.icon(ctx, 'search', x + w - 46, S.y + 252, 34, UI.sub, 3.2); ar(ctx, 'ابحث عن عملة', x + w - 84, S.y + 262, { w: 400, size: 26, color: '#939699', align: 'right' });
    rr(ctx, x + 20, S.y + 228, 104, 48, 24); ctx.fillStyle = INK; ctx.fill(); lat(ctx, '200+', x + 72, S.y + 261, { w: 700, size: 24, color: '#FFFFFF' });
    UI.tabBar(ctx, S, 1);
    return { btc: [x + w / 2, S.y + 340 + 54 - scroll] };
  }
  function detail(ctx, S, t, t0, o = {}) {
    ctx.fillStyle = UI.bg; ctx.fillRect(S.x, S.y, S.w, S.h); UI.status(ctx, S); UI.header(ctx, S, 'Bitcoin', { back: true, size: 34 });
    const x = S.x + 32, w = S.w - 64;
    CC.coin(ctx, S.x + S.w - 80, S.y + 252, 40, { ticker: 'BTC', light: 0.35 });
    lat(ctx, '$81,240.50', S.x + S.w - 140, S.y + 258, { w: 700, size: 46, color: INK, align: 'right' });
    rr(ctx, S.x + S.w - 256, S.y + 274, 116, 38, 19); ctx.fillStyle = AX.mint; ctx.fill(); lat(ctx, '+2.14%', S.x + S.w - 198, S.y + 301, { w: 600, size: 22, color: INK });
    UI.card(ctx, x, S.y + 336, w, 360);
    CC.spark(ctx, x + 24, S.y + 372, w - 48, 228, BTCP, { prog: co(t, t0 + 0.1, 1.1), fill: 0.28, color: AX.mint, lw: 4, head: true });
    ['1D', '1W', '1M', '1Y'].forEach((s, i) => { const cx = x + w - 60 - i * 110, on = i === 0; if (on) { rr(ctx, cx - 40, S.y + 632, 80, 40, 20); ctx.fillStyle = INK; ctx.fill(); } lat(ctx, s, cx, S.y + 660, { w: 600, size: 22, color: on ? '#FFFFFF' : UI.sub }); });
    // live order book
    UI.card(ctx, x, S.y + 716, w, 240);
    ar(ctx, 'دفتر الأوامر', x + w - 26, S.y + 758, { w: 600, size: 26, color: INK, align: 'right' });
    for (let i = 0; i < 4; i++) {
      const y = S.y + 778 + i * 42, jb = 0.35 + 0.5 * Math.abs(Math.sin(t * 2.3 + i)), ja = 0.3 + 0.5 * Math.abs(Math.sin(t * 2.0 + i * 1.7));
      rr(ctx, x + w / 2 + 8, y, (w / 2 - 34) * jb, 32, 6); ctx.fillStyle = rgba(AX.mint, 0.45); ctx.fill();
      rr(ctx, x + 26 + (w / 2 - 34) * (1 - ja), y, (w / 2 - 34) * ja, 32, 6); ctx.fillStyle = rgba(AX.red, 0.22); ctx.fill();
      lat(ctx, (81240.5 - (i + 1) * 4.5).toFixed(1), x + w - 30, y + 24, { w: 600, size: 20, color: INK, align: 'right' });
      lat(ctx, (81240.5 + (i + 1) * 4.5).toFixed(1), x + 30, y + 24, { w: 600, size: 20, color: INK, align: 'left' });
    }
    const by = S.y + S.h - 150; UI.button(ctx, S.x + 40, by, S.w - 80, 96, 'شراء', { press: o.press || 0 });
    return { buy: [S.x + S.w / 2, by + 48] };
  }
  const rgba = GL.rgba;
  function buySheet(ctx, S, t, u, o = {}) {
    if (u <= 0) return {};
    ctx.save(); ctx.globalAlpha *= clamp(u * 1.5); ctx.fillStyle = 'rgba(9,10,13,0.35)'; ctx.fillRect(S.x, S.y, S.w, S.h); ctx.restore();
    const sh = 820, y = S.y + S.h - sh * expoOut(u);
    rr(ctx, S.x, y, S.w, sh + 60, 36); ctx.fillStyle = '#FFFFFF'; ctx.fill();
    rr(ctx, S.x + S.w / 2 - 40, y + 18, 80, 8, 4); ctx.fillStyle = 'rgba(9,10,13,0.15)'; ctx.fill();
    ar(ctx, 'شراء BTC', S.x + S.w - 40, y + 96, { w: 700, size: 36, color: INK, align: 'right' });
    UI.amount(ctx, S.x + S.w / 2, y + 240, '$500', { size: 104 });
    ['$100', '$250', '$500'].forEach((v, i) => { const cx = S.x + S.w / 2 + (i - 1) * 150, on = i === 2; rr(ctx, cx - 62, y + 284, 124, 52, 26); ctx.fillStyle = on ? INK : '#EEF0F1'; ctx.fill(); lat(ctx, v, cx, y + 319, { w: 600, size: 24, color: on ? '#FFFFFF' : INK }); });
    const line = (yy, k, v, bold) => { if (Array.isArray(k)) mixLine(ctx, k, S.x + S.w - 44, yy, { size: 27, lsize: 26, w: 400, lw: 600, color: UI.sub, align: 'right', gap: 8 }); else ar(ctx, k, S.x + S.w - 44, yy, { w: bold ? 600 : 400, size: 27, color: bold ? INK : UI.sub, align: 'right' }); lat(ctx, v, S.x + 44, yy, { w: bold ? 700 : 600, size: 27, color: INK, align: 'left' }); };
    ctx.fillStyle = UI.line; ctx.fillRect(S.x + 40, y + 380, S.w - 80, 2);
    line(y + 432, [{ t: 'العمولة' }, { t: '0.8%', lat: true }], '$4.00'); line(y + 490, 'ستحصل على', '≈ 0.00611 BTC', true);
    ctx.fillStyle = UI.line; ctx.fillRect(S.x + 40, y + 528, S.w - 80, 2);
    ar(ctx, 'تُحفظ في محفظة آكسي', S.x + S.w - 44, y + 580, { w: 400, size: 24, color: UI.sub, align: 'right' }); CC.icon(ctx, 'lock', S.x + 60, y + 572, 28, UI.sub, 3);
    const by = y + 640;
    if (o.loading) { UI.button(ctx, S.x + 40, by, S.w - 80, 96, '', { press: 0 }); ctx.save(); ctx.translate(S.x + S.w / 2, by + 48); ctx.rotate(t * 8); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 1.4); ctx.stroke(); ctx.restore(); }
    else UI.button(ctx, S.x + 40, by, S.w - 80, 96, 'شراء BTC', { press: o.press || 0, glow: o.glow || 0 });
    return { conf: [S.x + S.w / 2, by + 48] };
  }
  function done(ctx, S, t, t0) {
    ctx.fillStyle = UI.bg; ctx.fillRect(S.x, S.y, S.w, S.h); UI.status(ctx, S);
    const u = sp(t, t0, 2.4, 0.5), cx = S.x + S.w / 2;
    ctx.save(); ctx.translate(cx, S.y + 420); ctx.scale(clamp(u, 0, 1.15), clamp(u, 0, 1.15)); disc(ctx, 0, 0, 96, AX.mint); CC.icon(ctx, 'check', 0, 0, 110, INK, 5.5); ctx.restore();
    K.ripple(ctx, cx, S.y + 420, t, t0, { r0: 90, r1: 220, w: 3, n: 2, a: 0.5, color: AX.mint });
    const a = eo(t, t0 + 0.25, 0.4);
    ar(ctx, 'تمت عملية الشراء', cx, S.y + 620, { w: 700, size: 44, color: INK, alpha: a });
    lat(ctx, '0.00611 BTC', cx, S.y + 710, { w: 700, size: 56, color: INK, alpha: eo(t, t0 + 0.4, 0.4) });
    ar(ctx, 'محفوظة في محفظة آكسي', cx, S.y + 776, { w: 400, size: 28, color: UI.sub, alpha: eo(t, t0 + 0.55, 0.4) });
  }
  function wallet(ctx, S, t, t0) {
    ctx.fillStyle = UI.bg; ctx.fillRect(S.x, S.y, S.w, S.h); UI.status(ctx, S); UI.header(ctx, S, 'محفظة آكسي');
    const x = S.x + 32, w = S.w - 64;
    rr(ctx, x, S.y + 200, w, 250, 28); ctx.fillStyle = '#16181B'; ctx.fill();
    ar(ctx, 'قيمة محفظتك', x + w - 34, S.y + 262, { w: 400, size: 26, color: 'rgba(255,255,255,0.7)', align: 'right' });
    lat(ctx, '≈ $496.37', x + w - 34, S.y + 352, { w: 700, size: 60, color: '#FFFFFF', align: 'right' });
    CC.icon(ctx, 'lock', x + 60, S.y + 260, 34, 'rgba(255,255,255,0.7)', 3); ar(ctx, 'منفصلة عن حساب التداول', x + w - 34, S.y + 412, { w: 400, size: 22, color: 'rgba(255,255,255,0.6)', align: 'right' });
    const u = eo(t, t0 + 0.3, 0.5);
    ctx.save(); ctx.globalAlpha *= u; ctx.translate((1 - u) * -60, 0);
    UI.coinRow(ctx, x, S.y + 490, w, { tk: 'BTC', name: '0.00611 BTC', p: '496.37', c: 2.14, seed: 3 }, { h: 112, spark: false, hi: 1 - clamp((t - t0 - 0.8) / 0.8) });
    ctx.restore();
    UI.tabBar(ctx, S, 2);
  }

  // the phone's current screen, with RTL push transitions (new screens come in from the left)
  function screen(ctx, S, t) {
    const push = (tA, d = 0.35) => cio(t, tA, d);
    if (t < T_AMT) {
      const h = home(ctx, S, t, '$2,450.00'); const su = eo(t, T_SHEET, 0.45) * (1 - push(T_AMT - 0.05, 0.3));
      fundSheet(ctx, S, t, su, t > T_TAPCARD ? 0 : -1);
      return;
    }
    if (t < T_DONE + 0.9) {
      const n = KEYS.filter((k) => t > k).length, digits = '500'.slice(0, n), pk = KEYS.findIndex((k) => t > k - 0.05 && t < k + 0.12);
      const e = push(T_AMT, 0.35); ctx.save(); ctx.translate(-S.w * (1 - e), 0);
      amountScreen(ctx, S, t, digits, { pressed: pk >= 0 ? '500'[pk] : null, press: press(t, T_CONT), done: t > T_CONT });
      ctx.restore();
      if (t > T_AMT && e < 1) { ctx.save(); ctx.translate(S.w * e * 0.3, 0); ctx.globalAlpha *= 1 - e; home(ctx, S, t, '$2,450.00'); ctx.restore(); }
      UI.toast(ctx, S.x + 24, S.y + 96, S.w - 48, 'تم الإيداع بنجاح', eo(t, T_DONE, 0.35) * (1 - ei(t, T_DONE + 0.75, 0.2)));
      return;
    }
    if (t < T_MKT) { home(ctx, S, t, '$2,950.00'); return; }
    if (t < T_DET) {
      const e = push(T_MKT, 0.35), sc = 560 * cio(t, T_SCROLL, 1.2) * (1 - cio(t, T_SCROLL + 1.5, 0.7));
      ctx.save(); ctx.translate(-S.w * (1 - e), 0); markets(ctx, S, t, sc, smooth(inv(T_TAPBTC - 0.4, T_TAPBTC, t))); ctx.restore();
      if (e < 1) { ctx.save(); ctx.globalAlpha *= 1 - e; home(ctx, S, t, '$2,950.00'); ctx.restore(); }
      return;
    }
    if (t < T_OK) {
      const e = push(T_DET, 0.35); ctx.save(); ctx.translate(-S.w * (1 - e), 0); detail(ctx, S, t, T_DET, { press: press(t, T_TAPBUY) }); ctx.restore();
      buySheet(ctx, S, t, eo(t, T_BUYSHEET, 0.45), { press: press(t, T_TAPCONF), loading: t > T_TAPCONF + 0.12, glow: smooth(inv(T_TAPCONF - 1.2, T_TAPCONF - 0.9, t)) });
      return;
    }
    if (t < T_WAL) { done(ctx, S, t, T_OK); return; }
    const e = push(T_WAL, 0.35); ctx.save(); ctx.translate(-S.w * (1 - e), 0); wallet(ctx, S, t, T_WAL); ctx.restore();
    if (e < 1) { ctx.save(); ctx.globalAlpha *= 1 - e; done(ctx, S, t, T_OK); ctx.restore(); }
  }
  function press(t, tc) { const d = t - tc; return d > -0.04 && d < 0.18 ? Math.sin(Math.PI * clamp((d + 0.04) / 0.22)) : 0; }
  // where the finger taps (screen-space points computed from the layout of each screen)
  function taps(S) {
    const x = S.x + 32, w = S.w - 64;
    const dep = [x + w - 0.5 * (w / 3), S.y + 760], sh = S.y + S.h - 640;
    const key = (k) => { const i = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].indexOf(k), cw = (S.w - 80) / 3; return [S.x + 40 + (i % 3) * cw + cw / 2, S.y + 600 + Math.floor(i / 3) * 95 + 47]; };
    return [
      [T_TAPDEP, ...dep], [T_TAPCARD, S.x + S.w / 2, sh + 180 + 59], [KEYS[0], ...key('5')], [KEYS[1], ...key('0')], [KEYS[2], ...key('0')],
      [T_CONT, S.x + S.w / 2, S.y + S.h - 140 + 28], [T_TAPBTC, S.x + S.w / 2, S.y + 394], [T_TAPBUY, S.x + S.w / 2, S.y + S.h - 102],
      [T_TAPCONF, S.x + S.w / 2, S.y + S.h - 820 + 688],
    ];
  }

  // ---------------- callouts (SaaS annotation chips with a leader line to the phone) ----------------
  function callout(ctx, t, t0, t1, text, icon, cx, cy, ax, ay, o = {}) {
    const u = sp(t, t0, 2.6, 0.6), out = ei(t, t1 - 0.25, 0.25); if (u <= 0 || out >= 1) return;
    const a = clamp(u * 2) * (1 - out);
    ctx.save(); ctx.globalAlpha *= a;
    if (ax != null) { const lu = co(t, t0 + 0.15, 0.4); ctx.setLineDash([6, 8]); ctx.strokeStyle = 'rgba(9,10,13,0.35)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(lerp(cx, ax, lu), lerp(cy, ay, lu)); ctx.stroke(); ctx.setLineDash([]); if (lu > 0.95) { disc(ctx, ax, ay, 9, AX.red); disc(ctx, ax, ay, 18, rgba(AX.red, 0.18)); } }
    ctx.translate(cx, cy); const s = clamp(u, 0, 1.12); ctx.scale(s, s); ctx.translate(-cx, -cy);
    const size = o.size || 32, parts = Array.isArray(text) ? text : null;
    const tw = parts ? parts.reduce((a, p) => a + (p.lat ? latW(ctx, p.t, { w: 700, size }) : arW(ctx, p.t, { w: 600, size })), 0) + 10 * (parts.length - 1) : arW(ctx, text, { w: 600, size });
    const h = size * 2.4, w = tw + size * 3.6, x = cx - w / 2, y = cy - h / 2;
    ctx.shadowColor = 'rgba(9,10,13,0.14)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; rr(ctx, x, y, w, h, h / 2); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(9,10,13,0.06)'; ctx.stroke();
    disc(ctx, x + w - h / 2 - 4, cy, h * 0.36, o.dark ? INK : '#EEF0F1'); CC.icon(ctx, icon, x + w - h / 2 - 4, cy, size * 1.05, o.dark ? '#FFFFFF' : INK, 3.6);
    if (parts) mixLine(ctx, parts, x + w - h - 6, cy + size * 0.36, { size, lsize: size, w: 600, lw: 700, color: INK, align: 'right', gap: 10 });
    else ar(ctx, text, x + w - h - 6, cy + size * 0.36, { w: 600, size, color: INK, align: 'right' });
    ctx.restore();
  }
  function stepHead(ctx, t, t0, t1, num, title) {
    const u = eo(t, t0, 0.5), out = ei(t, t1 - 0.3, 0.3); if (u <= 0 || out >= 1) return;
    ctx.save(); ctx.globalAlpha *= clamp(u * 1.5) * (1 - out); ctx.translate(0, (1 - u) * 40 - out * 30);
    const nw = latW(ctx, num, { w: 800, size: 150 });
    lat(ctx, num, W - 90, 372, { w: 800, size: 140, color: INK, align: 'right' });
    ctx.fillStyle = AX.red; rr(ctx, W - 90 - nw, 394, nw * co(t, t0 + 0.2, 0.5), 10, 5); ctx.fill();
    ar(ctx, title, W - 90 - nw - 36, 356, { w: 700, size: 72, color: INK, align: 'right' });
    for (let k = 0; k < 3; k++) { const n = +num - 1; rr(ctx, 90 + (2 - k) * 76, 330, 64, 12, 6); ctx.fillStyle = k === n ? AX.red : k < n ? INK : 'rgba(9,10,13,0.15)'; ctx.fill(); }
    ctx.restore();
  }

  // ---------------- scene: one continuous product shot ----------------
  const SA = { t0: 0, t1: T_END, render(ctx, t) {
    CC.saasStage(ctx, t, { dx: -t * 14, dy: -t * 6 });
    // hook headline, then the step headers
    const hu = 1 - ei(t, T1 - 0.3, 0.3);
    if (hu > 0) {
      ctx.save(); ctx.globalAlpha *= hu;
      popWords(ctx, 'من رصيدك…', W / 2, 260, t, { t0: 0.0, st: 0.12, size: 92, w: 700, color: INK, from: 1.4, shadow: false });
      popWords(ctx, 'إلى أول عملة رقمية', W / 2, 380, t, { t0: 0.4, st: 0.1, size: 92, w: 700, color: INK, from: 1.4, shadow: false, colors: [INK, INK, AX.red] });
      const pu = eo(t, 0.9, 0.4); if (pu > 0) CC.chip(ctx, W / 2, 470, '3 خطوات', { size: 30, solid: INK, color: '#FFFFFF', alpha: pu, lift: 0 });
      ctx.restore();
    }
    stepHead(ctx, t, T1, T2, '01', 'موّل حسابك');
    stepHead(ctx, t, T2, T3, '02', 'اختر عملتك');
    stepHead(ctx, t, T3, T4, '03', 'اشترِ');
    // the phone: rises in, gentle float; leaves to make room for the features
    const pu = sp(t, 0.15, 1.8, 0.75), outF = cio(t, T4 - 0.1, 0.8);
    const fl = Math.sin(t * 1.3) * 6, py = PH.y + (1 - clamp(pu, 0, 1.15)) * 1300 + fl - outF * 260, sc = lerp(1, 0.58, outF), px = PH.x + outF * -230;
    ctx.save(); ctx.translate(px + PH.w / 2, py + PH.h / 2); ctx.scale(sc, sc); ctx.translate(-(PH.w / 2), -(PH.h / 2));
    let S = null;
    CC.phone(ctx, 0, 0, PH.w, PH.h, (c, s) => { S = s; screen(c, s, t); }, { shadow: 0.28 });
    if (S) taps(S).forEach(([tc, x, y]) => CC.finger(ctx, x, y, t, tc));
    ctx.restore();
    // phone → screen coordinates for the callout anchors
    const P = (x, y) => [px + PH.w / 2 + (x - PH.w / 2) * sc, py + PH.h / 2 + (y - PH.h / 2) * sc];
    // one fact at a time in the slot between the step header and the phone, with a pin on the UI it refers to
    callout(ctx, t, b(9), b(12.3), 'بطاقة · تحويل بنكي · رصيد آكسي', 'card', 540, 452, ...P(280, 741));
    callout(ctx, t, b(12.5), b(15.3), 'إيداع بدون عمولة', 'check', 540, 452, ...P(280, 548), { dark: true });
    callout(ctx, t, b(15.5), T2, 'بدون توثيق إضافي لعملاء آكسي', 'shield', 540, 452, null, null);
    callout(ctx, t, b(19.5), b(25.6), [{ t: '200+', lat: true }, { t: 'عملة رقمية' }], 'coin', 540, 452, ...P(122, 270), { dark: true });
    callout(ctx, t, b(27.4), T3, 'أسعار مباشرة ودفتر أوامر', 'book', 540, 452, ...P(280, 852));
    callout(ctx, t, b(35.2), b(40.8), [{ t: 'عمولة واضحة' }, { t: '0.8%', lat: true }], 'check', 540, 452, ...P(280, 744), { dark: true });
    callout(ctx, t, b(41.4), T4 + 0.3, 'عملتك في محفظة آكسي', 'lock', 540, 452, ...P(280, 790));
    if (t > T1 && t < T4) ar(ctx, 'أرقام توضيحية', W / 2, 1728, { w: 400, size: 24, color: 'rgba(9,10,13,0.45)' });
    // the features after the purchase
    if (t > T4) {
      popWords(ctx, 'كل هذا في تطبيق واحد', W / 2, 400, t, { t0: T4 + 0.2, st: 0.1, size: 80, w: 700, color: INK, from: 1.4, shadow: false });
      snap(ctx.canvas);
      [['24/7', 'clock', 'تداول في أي وقت', true], ['الويب والجوال', 'phone', 'من أي جهاز'], ['سجل الصفقات', 'book', 'كل عملياتك في مكان واحد']].forEach(([title, ic, sub, latT], i) => {
        const u = sp(t, T4 + 0.5 + i * b(1), 2.4, 0.62); if (u <= 0) return;
        const x = 500, y = 640 + i * 250, w = 520, h = 210;
        ctx.save(); ctx.translate((1 - clamp(u)) * 400, 0); ctx.globalAlpha *= clamp(u * 2);
        ctx.shadowColor = 'rgba(9,10,13,0.12)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14; rr(ctx, x, y, w, h, 34); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.shadowColor = 'transparent';
        disc(ctx, x + w - 80, y + h / 2, 48, i === 0 ? INK : '#EEF0F1'); CC.icon(ctx, ic, x + w - 80, y + h / 2, 52, i === 0 ? '#FFFFFF' : INK, 3.4);
        if (latT) lat(ctx, title, x + w - 150, y + 100, { w: 800, size: 64, color: INK, align: 'right' }); else ar(ctx, title, x + w - 150, y + 96, { w: 700, size: 46, color: INK, align: 'right' });
        ar(ctx, sub, x + w - 150, y + 158, { w: 400, size: 28, color: '#626466', align: 'right' });
        ctx.restore();
      });
    }
  } };

  // ---------------- end card ----------------
  const SB = { t0: T_END, t1: 30.01, render(ctx, t) {
    CC.saasStage(ctx, t, { dx: -t * 14, dy: -t * 6 });
    ctx.save(); camera(ctx, t, T_END, 30, { s0: 1.03, s1: 1.0, drift: 3 });
    const pu = sp(t, T_END + 0.1, 2.0, 0.7);
    if (pu > 0) { ctx.save(); ctx.translate(W / 2, 470 + (1 - clamp(pu)) * 200); ctx.scale(0.3, 0.3); ctx.translate(-PH.w / 2, -PH.h / 2); CC.phone(ctx, 0, 0, PH.w, PH.h, (c, s) => wallet(c, s, t, T_END - 2), { shadow: 0.25 }); ctx.restore(); }
    CC.endCard(ctx, t, T_END + 0.2, { cy: 900, cta: 'حمّل تطبيق آكسي', tb: b(56), subParts: [{ t: 'متاح على' }, { t: 'iOS', lat: true }, { t: 'و' }, { t: 'Android', lat: true }] });
    ctx.restore();
  } };

  const SCENES = [SA, SB];
  const CUTS = [{ at: T_END, d: 0.45, kind: 'zoom', cy: 960 }];
  window.FILM = {
    duration: 30,
    blur(t) {
      for (const c of CUTS) if (Math.abs(t - c.at) < c.d / 2 + 0.05) return 8;
      for (const tt of [T_AMT, T_MKT, T_DET, T_WAL, T1, T2, T3, T4]) if (Math.abs(t - tt - 0.15) < 0.3) return 5;
      if (t < 1.2) return 5;
      return 2;
    },
    draw(ctx, t) {
      film(ctx, t, SCENES, CUTS);
      if (t < T_END - 0.1) K.watermark(ctx, INK, 0.6 * smooth(inv(0.2, 0.6, t)) * (1 - smooth(inv(T_END - 0.4, T_END - 0.1, t))));
      K.grain(ctx, t, 0.018, t > 29.6);
    },
  };
})();
