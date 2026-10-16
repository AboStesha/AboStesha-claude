// FILM 2 — «أين تُحفظ عملاتك؟» (Where is your crypto kept?). 20 s, 9:16, 96 bpm. Glassmorphism on Axi's steel.
// One continuous glass choreography: floating silver coins → they fly into the Axi Wallet card → the card moves aside
// next to the trading account, split by a locked divider («منفصلة») → buy · sell · store, and the three ways to fund
// (card, bank transfer, Axi balance) → end card «افتح محفظة آكسي». Voice-over windows: see SCRIPTS.md.
(function () {
  const { W, H, clamp, lerp, inv, smooth, eo, ei, co, cio, sp, expoOut, cubicInOut, ar, arW, lat, latW, mixLine, rr, disc } = K;
  const { AX, glass, snap, film, camera, popWords } = GL;
  const b = CC.grid(96), INK = CC.INK;
  const T_W = b(4), T_SEP = b(10), T_ACT = b(18), T_END = b(25);
  const CW = 840, CH = 720;   // wallet card at scale 1

  // floating coins of the hook, then their flight into the card rows
  const FLOAT = [
    { tk: 'BTC', x: 300, y: 1060, r: 150, z: 1, ph: 0.3 }, { tk: 'ETH', x: 800, y: 1250, r: 120, z: 0.85, ph: 1.7 },
    { tk: 'SOL', x: 760, y: 860, r: 90, z: 0.7, ph: 3.1 }, { tk: 'XRP', x: 190, y: 1450, r: 70, z: 0.55, ph: 4.2 }, { tk: 'ADA', x: 900, y: 1560, r: 56, z: 0.45, ph: 5.3 },
  ];
  const ROWS = [{ tk: 'BTC', amt: '0.0061' }, { tk: 'ETH', amt: '0.25' }, { tk: 'SOL', amt: '3.2' }];
  const ARRIVE = [b(5), b(6), b(7)];

  // the wallet card transform: centre and scale over time
  function walletT(t) {
    let cx = 540, cy = 1100, k = 1;
    const rise = sp(t, T_W, 2.0, 0.7); cy += (1 - clamp(rise, 0, 1.2)) * 900;
    const m1 = cio(t, T_SEP, 0.9), m2 = cio(t, T_ACT, 0.9);
    cx = lerp(cx, 268, m1); cy = lerp(cy, 1120, m1); k = lerp(k, 0.56, m1);
    cx = lerp(cx, 540, m2); cy = lerp(cy, 940, m2); k = lerp(k, 0.72, m2);
    return { cx, cy, k, a: clamp((t - T_W) / 0.15) };
  }
  const rowY = (i) => 300 + i * 132;   // row centres in card space (top = 0)
  function cardToScreen(T, x, y) { return [T.cx + (x - CW / 2) * T.k, T.cy + (y - CH / 2) * T.k]; }

  function walletCard(ctx, t, T) {
    ctx.save(); ctx.translate(T.cx, T.cy); ctx.scale(T.k, T.k); ctx.translate(-CW / 2, -CH / 2); ctx.globalAlpha *= T.a;
    glass(ctx, 0, 0, CW, CH, { tone: 'white', r: 48, ch: 52, corner: 'tr', lift: 1, glint: clamp((t - T_W - 0.3) / 0.9) });
    K.logoIQ(ctx, CW - 110, 92, 140, { color: INK });
    lat(ctx, 'Axi Wallet', 60, 108, { w: 700, size: 48, color: INK, align: 'left' });
    ar(ctx, 'رصيدك من العملات الرقمية', CW - 60, 210, { w: 400, size: 34, color: '#393B40', align: 'right' });
    ctx.fillStyle = 'rgba(9,10,13,0.10)'; ctx.fillRect(60, 236, CW - 120, 2);
    ROWS.forEach((r, i) => {
      const u = eo(t, ARRIVE[i] + 0.38, 0.35); if (u <= 0) return; const y = rowY(i);
      ctx.save(); ctx.globalAlpha *= u;
      CC.coin(ctx, CW - 100, y, 44, { ticker: r.tk, a: Math.sin(t * 1.2 + i) * 0.3, light: 0.4 });
      lat(ctx, r.tk, CW - 168, y + 14, { w: 700, size: 40, color: INK, align: 'right' });
      lat(ctx, r.amt, 60, y + 14, { w: 600, size: 40, color: INK, align: 'left' });
      ctx.fillStyle = 'rgba(9,10,13,0.07)'; ctx.fillRect(60, y + 64, CW - 120, 2);
      ctx.restore();
    });
    ar(ctx, 'أرقام توضيحية', CW / 2, CH - 34, { w: 400, size: 24, color: 'rgba(9,10,13,0.42)', alpha: eo(t, ARRIVE[0] + 0.6, 0.4) });
    ctx.restore();
  }
  function tradingCard(ctx, t) {
    const inU = sp(t, T_SEP + 0.35, 2.2, 0.7), out = ei(t, T_ACT, 0.5); if (inU <= 0 || out >= 1) return;
    const k = 0.56, cx = 812 + (1 - clamp(inU, 0, 1.1)) * 500 + out * 600, cy = 1120;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-CW / 2, -CH / 2); ctx.globalAlpha *= clamp(inU * 2) * (1 - out);
    glass(ctx, 0, 0, CW, CH, { tone: 'white', r: 48, lift: 1, glint: clamp((t - T_SEP - 0.6) / 0.9) });
    CC.icon(ctx, 'chart', CW - 110, 100, 72, INK, 3.6);
    ar(ctx, 'حساب التداول', CW - 60, 230, { w: 700, size: 58, color: INK, align: 'right' });
    lat(ctx, '$2,450.00', CW - 60, 420, { w: 700, size: 104, color: INK, align: 'right' });
    lat(ctx, 'USD', CW - 60, 500, { w: 600, size: 40, color: '#626466', align: 'right' });
    ar(ctx, 'أرقام توضيحية', CW / 2, CH - 34, { w: 400, size: 30, color: 'rgba(9,10,13,0.42)' });
    ctx.restore();
  }

  const SA = { t0: 0, t1: T_END, render(ctx, t) {
    CC.steelStage(ctx, t, { dx: -t * 18 });
    ctx.save(); camera(ctx, t, 0, T_END, { s0: 1.03, s1: 1.0, drift: 5 });
    // ---- hook copy (ink on the light half)
    const hookOut = smooth(inv(T_W - 0.2, T_W + 0.2, t));
    if (hookOut < 1) {
      ctx.save(); ctx.globalAlpha *= 1 - hookOut; ctx.translate(0, -hookOut * 60);
      popWords(ctx, 'سؤال قبل أن تشتري:', W / 2, 470, t, { t0: 0.0, st: 0.1, size: 56, w: 400, color: '#393B40', from: 1.3, shadow: false });
      popWords(ctx, 'أين تُحفظ عملاتك؟', W / 2, 630, t, { t0: 0.45, st: 0.14, size: 108, w: 700, color: INK, from: 1.5, shadow: false });
      ctx.restore();
    }
    // ---- floating coins (hook), each flies into its row when it arrives
    snap(ctx.canvas);
    const T = walletT(t);
    if (t >= T_W) walletCard(ctx, t, T);
    FLOAT.forEach((c, i) => {
      const fx = c.x + Math.sin(t * 0.7 + c.ph) * 30 * c.z, fy = c.y + Math.cos(t * 0.55 + c.ph) * 40 * c.z - t * 12 * c.z;
      const ang = t * (0.9 + c.z * 0.6) + c.ph;
      if (i < 3) {
        const ta = ARRIVE[i], f = cio(t, ta - 0.25, 0.65); if (f >= 1) return;
        const [tx, ty] = cardToScreen(walletT(ta + 0.4), CW - 100, rowY(i));
        const x = lerp(fx, tx, f), y = lerp(fy, ty, f) + Math.sin(Math.PI * f) * 90, r = lerp(c.r, 44 * walletT(ta + 0.4).k, f);
        CC.coin(ctx, x, y, r, { a: lerp(ang, Math.round(ang / (2 * Math.PI)) * 2 * Math.PI, f), ticker: c.tk, shadow: 0.3 * (1 - f), alpha: 1 });
      } else {
        const out = smooth(inv(T_W, T_W + 0.8, t)); if (out >= 1) return;
        CC.coin(ctx, fx + (i === 3 ? -1 : 1) * out * 400, fy, c.r, { a: ang, ticker: c.tk, alpha: (0.55 + 0.45 * c.z) * (1 - out) });
      }
    });
    // ---- «في محفظة آكسي»
    const s2 = clamp((t - T_W) / 0.2) * (1 - smooth(inv(T_SEP - 0.15, T_SEP + 0.25, t)));
    if (s2 > 0) popWords(ctx, 'في محفظة آكسي', W / 2, 560, t, { t0: T_W + 0.15, st: 0.12, size: 96, w: 700, color: INK, from: 1.4, shadow: false, alpha: s2 });
    // ---- separate from the trading account
    if (t > T_SEP) {
      tradingCard(ctx, t);
      const s3 = 1 - smooth(inv(T_ACT - 0.15, T_ACT + 0.25, t));
      popWords(ctx, 'أصولك الرقمية في حساب', W / 2, 500, t, { t0: T_SEP + 0.2, st: 0.1, size: 84, w: 700, color: INK, from: 1.35, shadow: false, alpha: s3 });
      popWords(ctx, 'منفصل عن حساب التداول', W / 2, 620, t, { t0: T_SEP + 0.55, st: 0.1, size: 84, w: 700, color: INK, from: 1.35, shadow: false, alpha: s3 });
      // the divider and its lock chip
      const du = co(t, T_SEP + 0.9, 0.6) * s3;
      if (du > 0) {
        ctx.save(); ctx.globalAlpha *= du; const gy0 = 830, gy1 = 1410, gy = lerp(1120, gy0, du), gh = lerp(0, gy1 - gy0, du);
        const g = ctx.createLinearGradient(0, gy0, 0, gy1); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.95)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.fillRect(W / 2 - 3, gy, 6, gh); ctx.restore();
        snap(ctx.canvas);
        CC.chip(ctx, W / 2, 1120, 'منفصلة', { size: 38, icon: 'lock', alpha: clamp(du * 1.4), glint: clamp((t - T_SEP - 1.3) / 0.6) });
      }
    }
    // ---- buy · sell · store, and the three ways to fund
    if (t > T_ACT) {
      popWords(ctx, 'اشترِ، بِع، واحفظ', W / 2, 470, t, { t0: T_ACT + 0.25, st: 0.14, size: 96, w: 700, color: INK, from: 1.4, shadow: false });
      snap(ctx.canvas);
      [['اشترِ', 'plus', 830, 600, 1], ['بِع', 'swap', 150, 930, 2], ['احفظ', 'lock', 870, 1236, 3]].forEach(([lb, ic, x, y, n]) => {
        const u = sp(t, T_ACT + 0.6 + (n - 1) * b(1), 2.6, 0.55); if (u <= 0) return;
        ctx.save(); ctx.translate(x, y); ctx.scale(clamp(u, 0, 1.15), clamp(u, 0, 1.15)); ctx.translate(-x, -y);
        CC.chip(ctx, x, y + Math.sin(t * 1.8 + n) * 6, lb, { size: 44, icon: ic, w: 700, glint: clamp((t - T_ACT - 0.8 - n * 0.3) / 0.6) });
        ctx.restore();
      });
      const fu = clamp((t - T_ACT - b(4.2)) / 0.2);
      if (fu > 0) {
        [['بطاقة', 'card', 810], ['تحويل بنكي', 'bank', 540], ['رصيد آكسي', 'wallet', 270]].forEach(([lb, ic, x], i) => {
          const u = sp(t, T_ACT + b(4.2) + i * 0.12, 2.4, 0.62); if (u <= 0) return;
          ctx.save(); ctx.translate(0, (1 - clamp(u)) * 120); ctx.globalAlpha *= clamp(u * 2);
          glass(ctx, x - 120, 1330, 240, 170, { tone: 'white', r: 32, lift: 0.6 });
          CC.icon(ctx, ic, x, 1390, 56, INK, 3.4); ar(ctx, lb, x, 1470, { w: 600, size: 32, color: INK });
          ctx.restore();
        });
        ar(ctx, 'موّل بالطريقة التي تناسبك', W / 2, 1580, { w: 400, size: 40, color: '#FFFFFF', alpha: eo(t, T_ACT + b(5.2), 0.4) });
      }
    }
    ctx.restore();
  } };

  // ---------------- end card ----------------
  const SB = { t0: T_END, t1: 20.01, render(ctx, t) {
    CC.steelStage(ctx, t, { dx: -t * 18 });
    ctx.save(); camera(ctx, t, T_END, 20, { s0: 1.04, s1: 1.0, drift: 3 });
    snap(ctx.canvas);
    const wu = sp(t, T_END + 0.05, 2.2, 0.65);
    if (wu > 0) {
      ctx.save(); ctx.translate(W / 2, 470); ctx.scale(clamp(wu, 0, 1.1) * 0.5, clamp(wu, 0, 1.1) * 0.5); ctx.translate(-CW / 2, -CH / 2 + 120);
      glass(ctx, 0, 0, CW, CH - 240, { tone: 'white', r: 48, ch: 52, corner: 'tr', lift: 1 });
      K.logoIQ(ctx, CW - 110, 92, 140, { color: INK }); lat(ctx, 'Axi Wallet', 60, 108, { w: 700, size: 48, color: INK, align: 'left' });
      CC.coin(ctx, CW / 2 - 140, 300, 90, { ticker: 'BTC', a: Math.sin(t * 1.5) * 0.5 }); CC.coin(ctx, CW / 2 + 140, 300, 90, { ticker: 'ETH', a: Math.sin(t * 1.5 + 1) * 0.5 });
      ctx.restore();
    }
    CC.endCard(ctx, t, T_END + 0.25, { cy: 900, cta: 'افتح محفظة آكسي', tb: b(27), sub: 'اشترِ، بِع، واحفظ عملاتك في مكان واحد', tagColor: '#242528' });
    ctx.restore();
  } };

  const SCENES = [SA, SB];
  const CUTS = [{ at: T_END, d: 0.5, kind: 'frost' }];
  window.FILM = {
    duration: 20,
    blur(t) {
      for (const c of CUTS) if (Math.abs(t - c.at) < c.d / 2 + 0.05) return 8;
      for (const a of ARRIVE) if (t > a - 0.3 && t < a + 0.45) return 6;
      if (Math.abs(t - T_SEP - 0.45) < 0.6 || Math.abs(t - T_ACT - 0.45) < 0.6) return 6;
      return 2;
    },
    draw(ctx, t) {
      film(ctx, t, SCENES, CUTS);
      if (t < T_END - 0.1) K.watermark(ctx, '#FFFFFF', 0.6 * smooth(inv(0.2, 0.6, t)) * (1 - smooth(inv(T_END - 0.4, T_END - 0.1, t))));
      K.grain(ctx, t, 0.022, t > 19.6);
    },
  };
})();
