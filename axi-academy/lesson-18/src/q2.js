// Lesson 18 · part 2 — the demo account (a nervous cursor on the terminal → search → «free demo» → the demo/real switch),
// getting started (a 3-step stepper: find the symbol · add it to Market Watch · open the specification), demo ≠ real
// (a comparison card: news execution · weekend open · slippage · gaps · emotions).
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, Q = G.SAAS, L = G.L18;
  const { W, H, C, clamp, lerp, hexA, txt, lat, measure } = A;
  const { P, E, EI, EIO, sp, xo, outP, wheels, wheelSeq, panel, cap, toggle } = Q;
  const { chip, tick, avatar } = L;
  const w = F.w, sfx = F.sfx;

  // ================================================================ D · the demo account
  const TD = { john: w(26, 0), afraid: w(26, 1), mistake: w(26, 2), mt: w(26, 4), search: w(27, 0), demo: w(27, 2), found: w(28, 0), axi: w(28, 2), acct: w(28, 4), free: w(28, 6), mt2: w(28, 8),
    train: w(29, 0), money: w(30, 3), real: w(30, 4), out: w(31, 0) - 0.3 };
  const TW = 1400, TH = 660;
  const candles = (() => { const r = A.rng(77); let p = 0.5; return Array.from({ length: 34 }, () => { const o = p; p = clamp(p + (r() - 0.47) * 0.3, 0.1, 0.9); const hi = Math.max(o, p) + r() * 0.05, lo = Math.min(o, p) - r() * 0.05; return [o, p, hi, lo]; }); })();
  sfx(TD.john - 0.2, 'whoosh', 0.14, { d: 0.6 }); sfx(TD.john + 0.55, 'impact', 0.1); sfx(TD.afraid, 'tick', 0.1, { f: 1800 }); sfx(TD.mistake, 'buzz', 0.06);
  sfx(TD.search - 0.05, 'whoosh', 0.12, { d: 0.35 }); sfx(TD.demo - 0.05, 'type', 0.1, { d: 0.5, n: 7 }); sfx(TD.found, 'pop', 0.18, { f: 760 }); sfx(TD.axi, 'pop', 0.14, { f: 900 });
  sfx(TD.free, 'chime', 0.12); sfx(TD.mt2, 'pop', 0.12, { f: 700 }); sfx(TD.train - 0.05, 'click', 0.2); sfx(TD.money, 'tick', 0.12, { f: 2000 }); sfx(TD.out, 'whoosh', 0.14, { d: 0.45 });
  function terminal(c, t) {
    c.fillStyle = '#121316'; c.fillRect(0, 0, TW, TH); c.strokeStyle = 'rgba(255,255,255,0.10)'; c.lineWidth = 2; c.strokeRect(1, 1, TW - 2, TH - 2);
    c.fillStyle = '#1B1C20'; c.fillRect(2, 2, TW - 4, 64); lat(c, 'MetaTrader', 36, 44, { size: 24, w: 600, color: P.dim }); lat(c, 'EURUSD · H1', 220, 44, { size: 22, w: 600, color: P.white });
    // mode switch (demo / real)
    const sk = clamp((t - TD.train + 0.15) / 0.3);
    if (sk > 0) { c.save(); c.globalAlpha *= sk; const x0 = TW - 360; A.roundRect(c, x0, 14, 330, 40, 20); c.fillStyle = '#0E0F12'; c.fill(); c.strokeStyle = 'rgba(255,255,255,0.14)'; c.lineWidth = 1.5; c.stroke();
      A.roundRect(c, x0 + 168, 18, 158, 32, 16); c.fillStyle = hexA(P.acc, 0.25); c.fill(); c.strokeStyle = P.acc; c.stroke(); txt(c, 'تجريبي', x0 + 247, 42, { size: 20, w: 'S', color: P.white, align: 'center' });
      txt(c, 'حقيقي', x0 + 84, 42, { size: 20, w: 'S', color: P.faint, align: 'center' });
      const lk = clamp((t - TD.money) / 0.25); if (lk > 0) { c.save(); c.globalAlpha *= lk; c.translate(x0 + 30, 34); c.strokeStyle = P.dim; c.lineWidth = 2.5; c.beginPath(); c.arc(0, -4, 6, Math.PI, 0); c.stroke(); c.fillStyle = P.dim; c.fillRect(-8, -4, 16, 12); c.restore(); }
      c.restore(); }
    // candles
    const X0 = 40, X1 = TW - 380, Y0 = 110, Y1 = TH - 60; const bw = (X1 - X0) / candles.length;
    candles.forEach(([o, cl, hi, lo], i) => { const x = X0 + i * bw + bw / 2; const up = cl >= o; const col = up ? '#8FA6AE' : '#5A5F66'; c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.moveTo(x, lerp(Y1, Y0, hi)); c.lineTo(x, lerp(Y1, Y0, lo)); c.stroke(); c.fillStyle = col; const ya = lerp(Y1, Y0, Math.max(o, cl)), yb = lerp(Y1, Y0, Math.min(o, cl)); c.fillRect(x - bw * 0.3, ya, bw * 0.6, Math.max(2, yb - ya)); });
    // order panel
    c.fillStyle = 'rgba(255,255,255,0.07)'; c.fillRect(TW - 350, 90, 1, TH - 130);
    txt(c, 'أمر جديد', TW - 40, 130, { size: 26, w: 'S', color: P.white });
    A.roundRect(c, TW - 320, 170, 130, 70, 14); c.strokeStyle = hexA(P.coral, 0.9); c.lineWidth = 2; c.stroke(); txt(c, 'بيع', TW - 255, 214, { size: 28, w: 'S', color: P.coral, align: 'center' });
    A.roundRect(c, TW - 170, 170, 130, 70, 14); c.strokeStyle = hexA(P.acc, 0.9); c.lineWidth = 2; c.stroke(); txt(c, 'شراء', TW - 105, 214, { size: 28, w: 'S', color: P.acc, align: 'center' });
    for (let i = 0; i < 4; i++) { c.fillStyle = 'rgba(255,255,255,0.06)'; c.fillRect(TW - 320, 290 + i * 56, 280, 18); }
  }
  Q.scn({ t0: TD.john - 0.2, t1: TD.out + 0.7, draw(ctx, t) {
    const k = xo(clamp((t - TD.john + 0.2) / 0.9)), ex = EIO(t, TD.out, 0.6); if (ex >= 1) return;
    const cy = lerp(1400, 580, k) - 120 * ex; const rx = lerp(0.9, 0.1, k) + 0.6 * ex;
    ctx.save(); ctx.globalAlpha = 1 - ex; Q.tiltCard(ctx, 'term', TW, TH, 960, cy, rx, -0.05, (c) => terminal(c, t), { scale: 1 });
    // John's nervous cursor between «sell» and «buy» (+ a small avatar tag)
    const ck = clamp((t - TD.afraid + 0.3) / 0.3) * (1 - clamp((t - TD.search + 0.1) / 0.3));
    if (ck > 0) {
      const jit = Math.sin(t * 9) * 70 + Math.sin(t * 23) * 8; const x = 960 + 700 - 180 + jit, y = cy - 330 + 205 + Math.sin(t * 13) * 10;
      ctx.save(); ctx.globalAlpha *= ck; FX.cursor(ctx, x, y, 0, '#FFFFFF'); avatar(ctx, x + 46, y + 52, 18, { lw: 2 });
      const qk = sp(t, TD.mistake, 14, 0.6); if (qk > 0) { ctx.save(); ctx.translate(x - 30, y - 50); ctx.scale(Math.min(1, qk), Math.min(1, qk)); ctx.beginPath(); ctx.arc(0, 0, 26, 0, 6.283); ctx.fillStyle = 'rgba(22,23,27,0.95)'; ctx.fill(); ctx.strokeStyle = P.coral; ctx.lineWidth = 2; ctx.stroke(); lat(ctx, '?', 0, 11, { size: 30, w: 800, color: P.coral, align: 'center' }); ctx.restore(); }
      ctx.restore();
    }
    // search palette + the result
    const sk = sp(t, TD.search, 14, 0.7), sOut = EIO(t, TD.train - 0.35, 0.4);
    if (sk > 0 && sOut < 1) {
      ctx.save(); ctx.globalAlpha *= clamp(sk * 2) * (1 - sOut); ctx.translate(0, (1 - Math.min(1, sk)) * -40);
      panel(ctx, 520, 190, 880, 86, { r: 22, fill: 'rgba(14,15,18,0.98)', stroke: hexA(P.acc, 0.8) }); ctx.strokeStyle = P.dim; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(1350, 228, 13, 0, 6.283); ctx.moveTo(1340, 238); ctx.lineTo(1330, 250); ctx.stroke();
      const q = 'حساب تجريبي'; const n = Math.floor(clamp((t - TD.demo + 0.1) / 0.45) * q.length); if (n > 0) txt(ctx, q.slice(0, n), 1310, 246, { size: 34, w: 'S', color: P.white });
      const rk = sp(t, TD.found, 13, 0.66);
      if (rk > 0) {
        ctx.save(); ctx.globalAlpha *= clamp(rk * 2); ctx.translate(0, (1 - Math.min(1, rk)) * 30);
        panel(ctx, 520, 300, 880, 300, { r: 24, fill: 'rgba(18,19,23,0.98)' });
        const ak = clamp((t - TD.axi) / 0.25); if (ak > 0) { const lh = 64, lw = A.logoWidth(lh); A.logo(ctx, 1360 - lw, 334, lh, '#FFFFFF', { alpha: ak }); }
        const tk = clamp((t - TD.acct) / 0.25); if (tk > 0) { txt(ctx, 'حساب تجريبي', 1360, 470, { size: 54, w: 'S', color: P.white, alpha: tk }); const fk = clamp((t - TD.free) / 0.2); if (fk > 0) txt(ctx, 'مجاني', 1360 - measure(ctx, 'حساب تجريبي ', 54, 'S'), 470, { size: 54, w: 'S', color: P.acc, alpha: fk }); }
        const ck2 = sp(t, TD.free, 14, 0.66); if (ck2 > 0) { ctx.save(); ctx.globalAlpha *= clamp(ck2 * 2); A.roundRect(ctx, 560, 336, 120, 56, 28); ctx.strokeStyle = P.acc; ctx.lineWidth = 2; ctx.stroke(); lat(ctx, '$0', 620, 374, { size: 30, w: 800, color: P.acc, align: 'center' }); ctx.restore(); }
        const mk = sp(t, TD.mt2, 14, 0.66); if (mk > 0) { ctx.save(); ctx.globalAlpha *= clamp(mk * 2); txt(ctx, 'على', 1360, 545, { size: 28, w: 'R', color: P.dim }); lat(ctx, 'MetaTrader', 1360 - measure(ctx, 'على ', 28, 'R'), 547, { size: 28, w: 700, color: P.white, align: 'right' }); ctx.restore(); }
        ctx.restore();
      }
      ctx.restore();
    }
    // «قبل ما يستخدم فلوس حقيقية» → a caption under the terminal
    const lk = sp(t, TD.real - 0.1, 14, 0.7); if (lk > 0) { ctx.save(); ctx.globalAlpha *= clamp(lk * 2) * (1 - ex); txt(ctx, 'تدرّب أولاً، ثم المال الحقيقي', 960, 960, { size: 34, w: 'S', color: P.white, align: 'center' }); ctx.restore(); }
    ctx.restore();
  } });

  // ================================================================ E · getting started on the demo: a 3-step stepper
  const TE = { how: w(31, 0), demoA: w(31, 3), find: w(32, 0), sym: w(32, 2), want: w(32, 4), name: w(33, 0), differs: w(33, 1), broker: w(33, 3), add: w(34, 0), window: w(34, 1), mw: w(34, 2),
    open: w(35, 0), spec: w(35, 1), read: w(36, 0), size: w(36, 1), contract: w(36, 2), costs: w(36, 3), out: w(37, 0) - 0.3 };
  const STEPS = [['ابحث عن الرمز', TE.find], ['أضفه إلى Market Watch', TE.add], ['افتح المواصفات', TE.open]];
  sfx(TE.how - 0.1, 'whoosh', 0.14, { d: 0.45 }); STEPS.forEach(([_, tt], i) => sfx(tt, 'pop', 0.16, { f: 700 + i * 120 }));
  sfx(TE.sym, 'type', 0.1, { d: 0.45, n: 6 }); sfx(TE.differs, 'whoosh', 0.1, { d: 0.3 }); [0, 1, 2].forEach((i) => sfx(TE.differs + 0.05 + i * 0.12, 'tick', 0.1, { f: 2200 + i * 250 }));
  sfx(TE.mw - 0.1, 'whoosh', 0.14, { d: 0.4 }); sfx(TE.mw + 0.25, 'click', 0.16); sfx(TE.spec, 'whip', 0.14); sfx(TE.contract, 'tick', 0.14, { f: 2600 }); sfx(TE.costs, 'tick', 0.12, { f: 2200 }); sfx(TE.out, 'whoosh', 0.14, { d: 0.4 });
  const VAR = [['EURUSD', 'وسيط 1'], ['EURUSD.a', 'وسيط 2'], ['EURUSDm', 'وسيط 3']];
  const MW = [['GBPUSD', '1.34412', '1.34426'], ['USDJPY', '151.284', '151.297'], ['XAUUSD', '4012.40', '4012.65'], ['AUDUSD', '0.65812', '0.65826']];
  const SPECS = [['Contract size', '100,000'], ['Digits', '5'], ['Spread', 'floating'], ['Swap long', '−6.2'], ['Swap short', '+1.8'], ['Commission', 'حسب الحساب']];
  Q.scn({ t0: TE.how - 0.2, t1: TE.out + 0.7, draw(ctx, t) {
    const ex = EIO(t, TE.out, 0.6); if (ex >= 1) return; ctx.save(); ctx.globalAlpha = 1 - ex; ctx.translate(0, -80 * ex);
    // title + stepper
    const hk = clamp((t - TE.how) / 0.25); if (hk > 0) txt(ctx, 'كيف تبدأ بالحساب التجريبي؟', 960, 140, { size: 46, w: 'S', color: P.white, align: 'center', alpha: hk });
    const SX = [1460, 960, 460], SY = 236; const act = STEPS.reduce((a, [, tt], i) => (t >= tt ? i : a), -1);
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(SX[2], SY - 1.5, SX[0] - SX[2], 3);
    if (act >= 0) { const prog = act === 0 ? 0 : act === 1 ? EIO(t, TE.add, 0.5) * 0.5 : 0.5 + EIO(t, TE.open, 0.5) * 0.5; ctx.fillStyle = P.acc; ctx.fillRect(SX[0] - (SX[0] - SX[2]) * prog, SY - 1.5, (SX[0] - SX[2]) * prog, 3); }
    STEPS.forEach(([s, tt], i) => { const kk = clamp((t - TE.how - 0.2 - i * 0.1) / 0.3); if (kk <= 0) return; const on = t >= tt; ctx.save(); ctx.globalAlpha *= kk; ctx.beginPath(); ctx.arc(SX[i], SY, 24, 0, 6.283); ctx.fillStyle = on ? P.acc : '#16171A'; ctx.fill(); ctx.strokeStyle = on ? P.acc : 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2; ctx.stroke(); lat(ctx, String(i + 1), SX[i], SY + 8, { size: 22, w: 800, color: on ? '#090A0D' : P.dim, align: 'center' }); txt(ctx, s, SX[i], SY + 66, { size: 26, w: 'S', color: on ? P.white : P.faint, align: 'center' }); ctx.restore(); });
    // step 1: the search + the name variants
    const s1 = EIO(t, TE.find - 0.1, 0.5) * (1 - EIO(t, TE.add - 0.25, 0.4));
    if (s1 > 0.01) {
      ctx.save(); ctx.globalAlpha *= s1; ctx.translate(0, (1 - s1) * 40);
      panel(ctx, 560, 380, 800, 84, { r: 20, fill: 'rgba(14,15,18,0.98)', stroke: hexA(P.acc, 0.8) });
      const q = 'EURUSD'; const n = Math.floor(clamp((t - TE.sym) / 0.4) * q.length); if (n > 0) lat(ctx, q.slice(0, n), 600, 434, { size: 34, w: 600, color: P.white }); txt(ctx, 'الرمز', 1330, 434, { size: 26, w: 'R', color: P.faint });
      VAR.forEach(([v, b], i) => { const kk = sp(t, TE.differs + i * 0.12, 15, 0.66); if (kk <= 0) return; const y = 520 + i * 100; ctx.save(); ctx.globalAlpha *= clamp(kk * 2); ctx.translate((1 - Math.min(1, kk)) * 60, 0); panel(ctx, 560, y, 800, 84, { r: 18, fill: 'rgba(22,23,27,0.95)' }); lat(ctx, v, 600, y + 54, { size: 32, w: 700, color: i === 0 ? P.acc : P.white }); txt(ctx, b, 1330, y + 54, { size: 24, w: 'S', color: P.dim, alpha: clamp((t - TE.broker) / 0.25) }); ctx.restore(); });
      const ck = clamp((t - TE.differs) / 0.3); if (ck > 0) txt(ctx, 'اسم الرمز يختلف من وسيط لآخر · مثال', 960, 860, { size: 28, w: 'S', color: P.dim, align: 'center', alpha: ck });
      ctx.restore();
    }
    // step 2: Market Watch
    const s2 = EIO(t, TE.add - 0.2, 0.5) * (1 - EIO(t, TE.open - 0.25, 0.4));
    if (s2 > 0.01) {
      ctx.save(); ctx.globalAlpha *= s2; ctx.translate(0, (1 - s2) * 40);
      panel(ctx, 560, 360, 800, 520, { r: 20, fill: 'rgba(18,19,23,0.98)' }); lat(ctx, 'Market Watch', 600, 412, { size: 28, w: 700, color: P.white });
      [['Symbol', 600, 'left'], ['Bid', 1110, 'right'], ['Ask', 1320, 'right']].forEach(([s, x, al]) => lat(ctx, s, x, 466, { size: 18, w: 700, color: P.faint, align: al, track: 1 }));
      const ins = EIO(t, TE.mw + 0.1, 0.5);
      const rows = MW.map((r, i) => [r, 500 + (i + ins) * 70]);
      if (ins > 0) { const y = lerp(300, 500, ins); ctx.save(); ctx.globalAlpha *= clamp(ins * 2); A.roundRect(ctx, 580, y + 8, 760, 60, 12); ctx.fillStyle = hexA(P.acc, 0.16); ctx.fill(); ctx.strokeStyle = P.acc; ctx.lineWidth = 1.5; ctx.stroke(); lat(ctx, 'EURUSD', 600, y + 48, { size: 26, w: 700, color: P.acc }); lat(ctx, '1.16842', 1110, y + 48, { size: 24, w: 600, color: P.white, align: 'right' }); lat(ctx, '1.16855', 1320, y + 48, { size: 24, w: 600, color: P.white, align: 'right' }); ctx.restore(); }
      rows.forEach(([[s, b, a], y]) => { lat(ctx, s, 600, y + 48, { size: 24, w: 600, color: P.white }); lat(ctx, b, 1110, y + 48, { size: 24, w: 400, color: P.dim, align: 'right' }); lat(ctx, a, 1320, y + 48, { size: 24, w: 400, color: P.dim, align: 'right' }); });
      ctx.restore();
    }
    // step 3: the specification (contract size + costs)
    const s3 = EIO(t, TE.open - 0.2, 0.5);
    if (s3 > 0.01) {
      ctx.save(); ctx.globalAlpha *= s3; ctx.translate(0, (1 - s3) * 40);
      panel(ctx, 560, 340, 800, 560, { r: 20, fill: 'rgba(18,19,23,0.98)' }); const tw2 = lat(ctx, 'Specification', 600, 392, { size: 28, w: 700, color: P.white }); lat(ctx, '—  EURUSD', 600 + tw2 + 12, 392, { size: 28, w: 400, color: P.dim });
      SPECS.forEach(([a, b], i) => {
        const y = 450 + i * 68; const hot = (i === 0 && t >= TE.contract) || (i >= 2 && t >= TE.costs); const hk2 = i === 0 ? clamp((t - TE.contract) / 0.2) : clamp((t - TE.costs - (i - 2) * 0.08) / 0.2);
        if (hot) { ctx.save(); ctx.globalAlpha *= hk2; A.roundRect(ctx, 580, y - 6, 760, 58, 12); ctx.fillStyle = hexA(P.acc, 0.12); ctx.fill(); ctx.strokeStyle = hexA(P.acc, 0.8); ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore(); }
        lat(ctx, a, 600, y + 32, { size: 24, w: 400, color: hot ? P.white : P.dim }); if (/[؀-ۿ]/.test(b)) txt(ctx, b, 1320, y + 32, { size: 22, w: 'S', color: P.white, align: 'right' }); else lat(ctx, b, 1320, y + 32, { size: 24, w: 600, color: P.white, align: 'right' });
      });
      const bk = clamp((t - TE.costs) / 0.3); if (bk > 0) { ctx.save(); ctx.globalAlpha *= bk; ctx.strokeStyle = P.acc; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1380, 590); ctx.lineTo(1400, 590); ctx.lineTo(1400, 850); ctx.lineTo(1380, 850); ctx.stroke(); txt(ctx, 'التكاليف', 1420, 728, { size: 30, w: 'S', color: P.acc, align: 'left' }); ctx.restore(); }
      const ck = clamp((t - TE.contract) / 0.3); if (ck > 0) { ctx.save(); ctx.globalAlpha *= ck; ctx.strokeStyle = P.acc; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1380, 450); ctx.lineTo(1400, 450); ctx.lineTo(1400, 500); ctx.lineTo(1380, 500); ctx.stroke(); txt(ctx, 'حجم العقد', 1420, 486, { size: 30, w: 'S', color: P.acc, align: 'left' }); ctx.restore(); }
      ctx.restore();
    }
    ctx.restore();
  } });

  // ================================================================ F · demo ≠ real: the comparison card
  const TF = { but: w(37, 0), watch: w(37, 1), demo: w(38, 0), not: w(38, 2), exact: w(38, 4), exec: w(39, 0), news: w(39, 4), open: w(39, 5), weekend: w(39, 8), inDemo: w(40, 0), slip: w(40, 4), gaps: w(40, 6), real: w(40, 8),
    noMoney: w(41, 0), emo: w(42, 0), differ: w(42, 1), out: F.phe(42) + 0.25 };
  const RW = [['التنفيذ وقت الأخبار', TF.news, 'news'], ['فتح السوق بعد عطلة نهاية الأسبوع', TF.weekend, 'week'], ['الانزلاق السعري', TF.slip, 'slip'], ['الفجوات السعرية', TF.gaps, 'gap'], ['المال الحقيقي والمشاعر', TF.noMoney, 'emo']];
  sfx(TF.but - 0.05, 'whoosh', 0.12, { d: 0.35 }); sfx(TF.watch, 'pop', 0.18, { f: 540 }); sfx(TF.demo, 'whoosh', 0.14, { d: 0.5 }); sfx(TF.exact, 'slam', 0.14);
  RW.forEach(([_, tt], i) => { sfx(tt - 0.05, 'whoosh', 0.08, { d: 0.25 }); sfx(tt + 0.02, 'pop', 0.12, { f: 620 + i * 70 }); }); sfx(TF.emo, 'charge', 0.08, { d: 0.6 }); sfx(TF.out, 'whoosh', 0.14, { d: 0.45 });
  function glyph(ctx, kind, real, x, y, wv, hv, t, t0) { // a tiny animated illustration inside a cell (x,y = top-left)
    const p = EIO(t, t0 + 0.1, 0.8); const col = real ? '#E8EAEC' : P.acc; const N = 40;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, wv, hv); ctx.clip(); ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.strokeStyle = col;
    const yv = (u) => { let v = Math.sin(u * 7 + 1) * 0.12 + u * 0.1; if (kind === 'news' && real) v += (Math.sin(u * 61) * 0.18 + Math.sin(u * 37) * 0.14) * (u > 0.45 ? 1 : 0.2); if ((kind === 'week' || kind === 'gap') && real && u > 0.55) v += 0.42; if (kind === 'emo') v = real ? Math.max(0, Math.sin(u * 50)) * Math.exp(-((u * 12) % 1.2) * 3) * 0.9 : Math.max(0, Math.sin(u * 16)) * Math.exp(-((u * 4) % 1.6) * 3) * 0.5; return v; };
    ctx.beginPath(); let started = false;
    for (let i = 0; i <= N * p; i++) { const u = i / N; const xx = x + 20 + (wv - 40) * u, yy = y + hv * 0.62 - yv(u) * hv * 0.6; if ((kind === 'week' || kind === 'gap') && real && Math.abs(u - 0.55) < 0.012) { started = false; continue; } if (!started) { ctx.moveTo(xx, yy); started = true; } else ctx.lineTo(xx, yy); }
    ctx.stroke();
    if (kind === 'week' && p > 0.5) { ctx.setLineDash([5, 6]); ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 20 + (wv - 40) * 0.55, y + 6); ctx.lineTo(x + 20 + (wv - 40) * 0.55, y + hv - 6); ctx.stroke(); ctx.setLineDash([]); }
    if (kind === 'slip' && p > 0.6) { const xx = x + wv - 40, yT = y + hv * 0.62 - yv(1) * hv * 0.6; ctx.setLineDash([6, 6]); ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 20, yT); ctx.lineTo(x + wv - 20, yT); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(xx, real ? yT - 16 : yT, 7, 0, 6.283); ctx.fill(); }
    ctx.restore();
  }
  Q.scn({ t0: TF.but - 0.2, t1: TF.out + 0.7, draw(ctx, t) {
    const ex = EIO(t, TF.out, 0.6); if (ex >= 1) return; ctx.save(); ctx.globalAlpha = 1 - ex; ctx.translate(0, -80 * ex);
    const wk = sp(t, TF.watch - 0.05, 14, 0.6); if (wk > 0) { ctx.save(); ctx.globalAlpha *= clamp(wk * 2); const s = 'انتبه'; const ww = measure(ctx, s, 28, 'S') + 90; ctx.translate(960, 110); ctx.scale(Math.min(1, wk), Math.min(1, wk)); A.roundRect(ctx, -ww / 2, -28, ww, 56, 28); ctx.fillStyle = C.red; ctx.fill(); txt(ctx, s, ww / 2 - 22, 10, { size: 28, w: 'S', color: '#FFFFFF' }); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.moveTo(-ww / 2 + 34, -14); ctx.lineTo(-ww / 2 + 50, 14); ctx.lineTo(-ww / 2 + 18, 14); ctx.closePath(); ctx.fill(); ctx.restore(); }
    const hk = clamp((t - TF.demo) / 0.25); if (hk > 0) { const s1 = 'الحساب التجريبي ليس نسخة طبق الأصل'; txt(ctx, s1, 960, 214, { size: 46, w: 'S', color: P.white, align: 'center', alpha: hk }); }
    const ck = EIO(t, TF.exec - 0.25, 0.6);
    if (ck > 0) {
      ctx.save(); ctx.globalAlpha *= ck; ctx.translate(0, (1 - ck) * 60);
      const X0 = 230, X1 = 1690, Y0 = 270; panel(ctx, X0, Y0, X1 - X0, 640, { r: 26, fill: 'rgba(19,20,24,0.97)' });
      const CR = [1040, 640]; // column centres: demo (right), real (left)
      txt(ctx, 'تجريبي', CR[0], Y0 + 58, { size: 30, w: 'S', color: P.acc, align: 'center' }); txt(ctx, 'حقيقي', CR[1], Y0 + 58, { size: 30, w: 'S', color: '#E8EAEC', align: 'center' });
      lat(ctx, '≠', (CR[0] + CR[1]) / 2, Y0 + 62, { size: 40, w: 700, color: P.white, align: 'center', alpha: clamp((t - TF.exact) / 0.2) });
      RW.forEach(([s, tt, kind], i) => {
        const k2 = clamp((t - tt + 0.1) / 0.3); if (k2 <= 0) return; const y = Y0 + 96 + i * 106;
        ctx.save(); ctx.globalAlpha *= k2; ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(X0 + 30, y, X1 - X0 - 60, 1);
        txt(ctx, s, X1 - 40, y + 64, { size: 28, w: 'S', color: P.white });
        glyph(ctx, kind, false, CR[0] - 170, y + 12, 340, 86, t, tt); glyph(ctx, kind, true, CR[1] - 170, y + 12, 340, 86, t, kind === 'emo' ? TF.emo : tt);
        ctx.restore();
      });
      ctx.restore();
    }
    ctx.restore();
  } });
})(typeof window !== 'undefined' ? window : globalThis);
