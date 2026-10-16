// FILM 1 — «امتلكها» (Own it). 15 s teaser, 9:16, 140 bpm. Kinetic type and a 3D silver coin on the dark stage.
// Hook: «تتداول على سعرها… أم تملكها؟» — a price line collapses into a real coin. Then the reveal (Buy Crypto, new at
// Axi) and four fast facts: real ownership 1:1 · 200+ coins · 24/7 · kept in the Axi Wallet. CTA «امتلك أول عملة لك».
// Music-led: works with the sound off; no voice-over windows.
(function () {
  const { W, H, clamp, lerp, inv, smooth, eo, ei, co, sp, expoOut, cubicInOut, ar, arW, lat, latW, rr, disc, shake } = K;
  const { AX, glass, snap, film, camera, popWords } = GL;
  const b = CC.grid(140);
  const T_REV = b(8), T_F1 = b(12), T_F2 = b(15.5), T_F3 = b(19), T_F4 = b(22.5), T_END = b(26);
  const HITS = [b(4), T_REV, T_F1, T_F2, T_F3, T_F4, b(24.2), T_END];

  // the price line of the hook (LTR, as charts read)
  const PL = CC.path(60, 7, 0.62);
  function priceLine(ctx, t) {
    const draw = co(t, -0.45, 1.9), col = ei(t, b(4) - 0.22, 0.22);
    if (draw <= 0) return;
    const n = PL.length, m = Math.max(2, Math.floor(n * draw)), x0 = -40, x1 = W + 40, y0 = 820, hh = 460, cx = W / 2, cy = 1040;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 2;
    for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(0, y0 + k * 92); ctx.lineTo(W, y0 + k * 92); ctx.stroke(); }
    ctx.beginPath();
    for (let i = 0; i < m; i++) {
      let px = lerp(x0, x1, i / (n - 1)), py = y0 + hh - PL[i] * hh;
      px = lerp(px, cx, col); py = lerp(py, cy, col);
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.globalAlpha *= 1 - smooth(inv(0.75, 1, col));
    ctx.shadowColor = 'rgba(255,255,255,0.6)'; ctx.shadowBlur = 18; ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();
    const i = m - 1; let hx = lerp(lerp(x0, x1, i / (n - 1)), cx, col), hy = lerp(y0 + hh - PL[i] * hh, cy, col);
    disc(ctx, hx, hy, 12, '#FFFFFF'); disc(ctx, hx, hy, 34, 'rgba(255,255,255,0.18)');
    ctx.restore();
  }
  // the hero coin's spin: fast after the collapse, settling to a slow turn
  const spin = (t, t0) => { const d = Math.max(0, t - t0); return d * 2.2 + (1 - Math.exp(-d * 3)) * 9; };

  // ---------------- 1 · hook ----------------
  const S1 = { t0: 0, t1: T_REV, render(ctx, t) {
    CC.darkStage(ctx, t, { dx: -t * 20 });
    const sh = shake(t, [b(4)], 14, 0.12, 3);
    ctx.save(); ctx.translate(sh.x, sh.y); camera(ctx, t, 0, T_REV, { s0: 1, s1: 1.05, drift: 6 });
    priceLine(ctx, t);
    const dim = 1 - 0.45 * smooth(inv(b(4), b(4) + 0.3, t));
    popWords(ctx, 'تتداول على سعرها…', W / 2, 560, t, { t0: 0.0, st: 0.22, size: 90, w: 700, color: '#FFFFFF', from: 1.6, alpha: dim });
    const cu = sp(t, b(4), 2.2, 0.55);
    if (cu > 0) CC.coin(ctx, W / 2, 1040, 250 * clamp(cu, 0, 1.15), { a: spin(t, b(4)), ticker: 'BTC', shadow: 0.55, sq: 0.97 });
    if (t > b(4) - 0.02 && t < b(4) + 0.14) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 0.55 * (1 - clamp((t - b(4)) / 0.14)); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    popWords(ctx, 'أم تملكها؟', W / 2, 1520, t, { t0: b(4.25), st: 0.18, size: 140, w: 700, colors: ['#FFFFFF', AX.red], from: 1.8 });
    ctx.restore();
  } };

  // ---------------- 2 · reveal ----------------
  const S2 = { t0: T_REV, t1: T_F1, render(ctx, t) {
    CC.darkStage(ctx, t, { dx: 40 - (t - T_REV) * 30 });
    ctx.save(); camera(ctx, t, T_REV, T_F1, { s0: 1.06, s1: 1.0, drift: 6 });
    popWords(ctx, 'جديد في آكسي', W / 2, 600, t, { t0: T_REV + 0.08, st: 0.1, size: 64, w: 600, color: 'rgba(255,255,255,0.86)', from: 1.4 });
    const tu = eo(t, T_REV + 0.18, 0.7);
    if (tu > 0) lat(ctx, 'Buy Crypto', W / 2, 800, { w: 800, size: 156, color: '#FFFFFF', track: lerp(70, -3, tu), alpha: clamp(tu * 1.6) });
    const lu = eo(t, T_REV + 0.55, 0.4); if (lu > 0) { ctx.fillStyle = AX.red; rr(ctx, W / 2 - 160 * lu, 856, 320 * lu, 10, 5); ctx.fill(); }
    [['ETH', -300, 1300, 150, 0.15], ['SOL', 300, 1300, 150, 0.3], ['BTC', 0, 1240, 220, 0]].forEach(([tk, dx, y, r, dl]) => {
      const u = sp(t, T_REV + 0.25 + dl, 2.4, 0.6); if (u <= 0) return;
      const orbit = Math.sin((t - T_REV) * 1.6 + dx * 0.01) * 18;
      CC.coin(ctx, W / 2 + dx * clamp(u, 0, 1.1), y + orbit + (1 - clamp(u)) * 200, r * clamp(u, 0, 1.1), { a: Math.sin((t - T_REV) * 2.2 + dx * 0.01) * 0.75 + (1 - clamp(u)) * 4, ticker: tk, shadow: 0.5, alpha: clamp(u * 2) });
    });
    ctx.restore();
  } };

  // ---------------- 3 · four fast facts ----------------
  // each fact slides in from the right and leaves to the left (the reading direction)
  const slide = (t, t0, t1) => ({ x: (1 - eo(t, t0, 0.32)) * 640 - ei(t, t1 - 0.2, 0.2) * 760, a: clamp((t - t0) / 0.08) * (1 - smooth(inv(t1 - 0.12, t1, t))) });
  const RAIN = (() => { const r = K.rng(5), tk = ['BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'LINK', 'LTC', 'XLM', 'UNI', 'AAVE', 'DOGE', 'DOT'], o = []; for (let i = 0; i < 16; i++) o.push({ x: 70 + r() * 940, d: r() * 0.55, v: 1000 + r() * 700, rr: 34 + r() * 46, s: 3 + r() * 5, tk: tk[i % tk.length], ph: r() * 6 }); return o; })();
  const S3 = { t0: T_F1, t1: T_END, render(ctx, t) {
    CC.darkStage(ctx, t, { dx: -(t - T_F1) * 50 });
    const sh = shake(t, [T_F1, T_F2, T_F3, T_F4, b(24.2)], 10, 0.1, 5);
    ctx.save(); ctx.translate(sh.x, sh.y); camera(ctx, t, T_F1, T_END, { s0: 1.0, s1: 1.05, drift: 5 });
    // F1 · real ownership, 1:1
    if (t < T_F2 + 0.05) {
      const s = slide(t, T_F1, T_F2); ctx.save(); ctx.translate(s.x, 0); ctx.globalAlpha *= s.a;
      CC.coin(ctx, W / 2, 1000, 330, { a: (t - T_F1) * 1.6 + 2.2, ticker: 'BTC', alpha: 0.22, sq: 0.98 });
      CC.slam(ctx, 'ملكية حقيقية', W / 2, 640, t, T_F1 + 0.04, { size: 110, w: 700 });
      CC.slam(ctx, '1:1', W / 2, 1130, t, T_F1 + 0.12, { lat: true, size: 380, w: 800, from: 2.2, shadow: true });
      CC.slam(ctx, 'بدون رافعة مالية', W / 2, 1380, t, T_F1 + 0.3, { size: 56, w: 400, color: 'rgba(255,255,255,0.8)', from: 1.3 });
      ctx.restore();
    }
    // F2 · 200+ coins
    if (t > T_F2 - 0.05 && t < T_F3 + 0.05) {
      const s = slide(t, T_F2, T_F3); ctx.save(); ctx.translate(s.x, 0); ctx.globalAlpha *= s.a;
      RAIN.forEach((c) => { const tt = t - T_F2 - c.d; if (tt <= 0) return; const y = -120 + tt * c.v; if (y > H + 150) return; CC.coin(ctx, c.x, y, c.rr, { a: tt * c.s + c.ph, ticker: c.tk, alpha: 0.75, sq: 0.95 }); });
      const v = Math.round(200 * K.cubicOut(clamp((t - T_F2 - 0.04) / 0.7))), vs = String(v), vw = latW(ctx, vs, { w: 800, size: 330 });
      CC.slam(ctx, vs, W / 2 - 50, 1130, t, T_F2 + 0.02, { lat: true, size: 330, w: 800, from: 1.5, shadow: true });
      lat(ctx, '+', W / 2 - 50 + vw / 2 + 80, 1100, { w: 800, size: 240, color: '#FFFFFF', alpha: eo(t, T_F2 + 0.68, 0.2) });
      CC.slam(ctx, 'عملة رقمية', W / 2, 1360, t, T_F2 + 0.18, { size: 96, w: 700, from: 1.4 });
      ctx.restore();
    }
    // F3 · 24/7
    if (t > T_F3 - 0.05 && t < T_F4 + 0.05) {
      const s = slide(t, T_F3, T_F4); ctx.save(); ctx.translate(s.x, 0); ctx.globalAlpha *= s.a;
      const ru = co(t, T_F3 + 0.05, 1.2);
      ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = 14; ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.arc(W / 2, 1020, 330, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(W / 2, 1020, 330, -Math.PI / 2, -Math.PI / 2 + ru * Math.PI * 2); ctx.stroke();
      const ha = -Math.PI / 2 + ru * Math.PI * 2; disc(ctx, W / 2 + Math.cos(ha) * 330, 1020 + Math.sin(ha) * 330, 16, AX.red); ctx.restore();
      CC.slam(ctx, '24/7', W / 2, 1110, t, T_F3 + 0.06, { lat: true, size: 250, w: 800, from: 2, shadow: true });
      CC.slam(ctx, 'اشترِ وبِع في أي وقت', W / 2, 1520, t, T_F3 + 0.22, { size: 76, w: 600, from: 1.4 });
      ctx.restore();
    }
    // F4 · kept in the Axi Wallet
    if (t > T_F4 - 0.05) {
      const s = slide(t, T_F4, T_END + 0.3); ctx.save(); ctx.translate(s.x, 0); ctx.globalAlpha *= s.a;
      snap(ctx.canvas);
      const cu = sp(t, T_F4 + 0.08, 2.3, 0.62), x = 160, y = 760, w = 760, h = 640;
      if (cu > 0) {
        ctx.save(); ctx.translate(0, (1 - clamp(cu)) * 260); ctx.globalAlpha *= clamp(cu * 2);
        glass(ctx, x, y, w, h, { tone: 'dark', r: 40, ch: 44, corner: 'tr', glint: clamp((t - T_F4 - 0.3) / 0.7), lift: 1 });
        K.logoIQ(ctx, x + w - 110, y + 92, 130, { color: '#FFFFFF' });
        lat(ctx, 'Axi Wallet', x + 56, y + 108, { w: 700, size: 46, color: '#FFFFFF', align: 'left' });
        rr(ctx, x + 60, y + 190, w - 120, 250, 28); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 2; ctx.stroke();
        // the coin drops into the slot
        const du = clamp((t - T_F4 - 0.25) / 0.45), dy = lerp(-1300, 0, du * du), land = t > T_F4 + 0.7;
        CC.coin(ctx, W / 2, y + 315 + dy + (land ? Math.sin((t - T_F4 - 0.7) * 20) * Math.exp(-(t - T_F4 - 0.7) * 8) * 10 : 0), 96, { a: (t - T_F4) * (land ? 1.2 : 9), ticker: 'BTC', alpha: clamp(du * 4) });
        // the lock closes and the holding appears
        const lk = eo(t, T_F4 + 0.8, 0.3);
        ctx.save(); ctx.globalAlpha *= clamp(lk * 1.5); CC.icon(ctx, 'lock', x + w - 100, y + 540, 54, '#FFFFFF', 3.6); ctx.restore();
        if (lk > 0) { ar(ctx, 'رصيدك من العملات', x + w - 150, y + 552, { w: 400, size: 36, color: 'rgba(255,255,255,0.8)', align: 'right', alpha: lk }); lat(ctx, 'BTC 0.0061', x + 60, y + 554, { w: 700, size: 40, color: '#FFFFFF', align: 'left', alpha: lk }); }
        ctx.restore();
      }
      CC.slam(ctx, 'محفوظة في محفظة آكسي', W / 2, 560, t, T_F4 + 0.04, { size: 76, w: 700, from: 1.5, shadow: true });
      ctx.restore();
    }
    ctx.restore();
    if (t > T_F4 + 0.8 && t < T_END) ar(ctx, 'أرقام توضيحية', W / 2, 1520, { w: 400, size: 26, color: 'rgba(255,255,255,0.5)', alpha: eo(t, T_F4 + 0.8, 0.3) });
  } };

  // ---------------- 4 · end card ----------------
  const S4 = { t0: T_END, t1: 15.01, render(ctx, t) {
    CC.darkStage(ctx, t, { dx: -(t - T_END) * 20 });
    ctx.save(); camera(ctx, t, T_END, 15, { s0: 1.04, s1: 1.0, drift: 3 });
    CC.coin(ctx, W / 2, 470, 120 * clamp(sp(t, T_END + 0.1, 2.2, 0.6), 0, 1.1), { a: (t - T_END) * 1.4 + 1, ticker: 'BTC', shadow: 0.4 });
    CC.endCard(ctx, t, T_END + 0.15, { dark: true, cy: 870, cta: 'امتلك أول عملة لك', tb: b(28), beat: b(1), subParts: [{ t: 'Buy Crypto', lat: true }, { t: '· في تطبيق آكسي' }] });
    ctx.restore();
  } };

  const SCENES = [S1, S2, S3, S4];
  const CUTS = [{ at: T_REV, d: 0.34, kind: 'zoom', cy: 1040 }, { at: T_END, d: 0.42, kind: 'slab', tone: 'light' }];
  window.FILM = {
    duration: 15,
    blur(t) {
      for (const c of CUTS) if (Math.abs(t - c.at) < c.d / 2 + 0.05) return c.kind === 'slab' ? 14 : 10;
      if (t > T_F2 + 0.04 && t < T_F2 + 0.8) return 1;   // the count-up: no blur, so digits never double
      for (const h of HITS) if (t > h - 0.25 && t < h + 0.22) return 10;
      if (t < 1.6) return 6;
      return 3;
    },
    draw(ctx, t) {
      film(ctx, t, SCENES, CUTS);
      if (t < T_END - 0.1) K.watermark(ctx, '#FFFFFF', 0.6 * smooth(inv(0.3, 0.7, t)) * (1 - smooth(inv(T_END - 0.4, T_END - 0.1, t))));
      K.grain(ctx, t, 0.03, t > 14.6);
    },
  };
})();
