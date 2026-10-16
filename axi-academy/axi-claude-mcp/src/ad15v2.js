// AD 15 v2 — «Claude ينقل تداولك إلى المستوى التالي». Dynamic glassmorphism: dark scenes lit by Claude's
// terracotta and Axi's steel, light scenes on Axi's steel gradient (the look of Axi's own campaign film).
// Hook → Claude switches on inside Axi → a super-smart assistant → the five things you can do (from mcp.axi.com:
// manage accounts, explore markets, monitor positions, manage trades, trading history) → CTA.
// No risk strip at the end (client request). 15 s, 9:16, 128 bpm.
(function () {
  const { W, H, B, clamp, lerp, inv, smooth, eo, co, sp, expoOut, ar, arW, lat, latW, mixLine, rr, disc } = K;
  const { AX, CL, glass, stage, dust, candles, snap, film, camera, swing, popWords, trackIn, LO, PO, STEEL } = GL;
  const T1 = B(6), T2 = B(10), T3 = B(14), T4 = B(25);
  const INK = '#141413';

  const WARM = [
    { x: 70, y: -260, w: 280, h: 1700, c: CL.orange, a: 0.9, sp: 0.5, amp: 40, ph: 0 },
    { x: 60, y: -100, w: 100, h: 1300, c: '#F4B79C', a: 0.55, sp: 0.5, amp: 40, ph: 0 },
    { x: 1010, y: 200, w: 300, h: 1800, c: CL.blue, a: 0.6, sp: 0.35, amp: 50, ph: 2 },
    { x: 560, y: 1250, w: 220, h: 1000, c: '#FFFFFF', a: 0.12, sp: 0.6, amp: 280, ph: 4 },
  ];
  const COOL = [
    { x: 1000, y: -300, w: 320, h: 1900, c: AX.steel2, a: 0.8, sp: 0.45, amp: 50, ph: 0.5 },
    { x: 1000, y: -100, w: 110, h: 1400, c: '#FFFFFF', a: 0.32, sp: 0.45, amp: 50, ph: 0.5 },
    { x: 80, y: 400, w: 280, h: 1600, c: CL.blue, a: 0.5, sp: 0.3, amp: 40, ph: 2.5 },
    { x: 540, y: 1300, w: 200, h: 900, c: CL.orange, a: 0.45, sp: 0.6, amp: 300, ph: 5 },
  ];
  const LIGHT = [
    { x: 160, y: -200, w: 360, h: 2000, c: '#F2B9A0', a: 0.5, sp: 0.3, amp: 60, ph: 0 },
    { x: 930, y: -100, w: 300, h: 2000, c: '#FFFFFF', a: 0.32, sp: 0.25, amp: 70, ph: 2 },
    { x: 560, y: 1200, w: 520, h: 900, c: '#E9A88C', a: 0.32, sp: 0.4, amp: 140, ph: 4 },
  ];
  const lightStage = (ctx, t, dx = 0) => stage(ctx, t, { grad: STEEL, pillars: LIGHT, blend: 'source-over', soft: 20, dx });

  // a tall glass shard crossing in the foreground, right → left
  function shard(ctx, t, t0, d, o = {}) {
    const u = (t - t0) / d; if (u <= 0 || u >= 1) return;
    snap(ctx.canvas, 5);
    ctx.save(); ctx.translate(lerp(W + 220, -420, u), H / 2); ctx.rotate(o.rot || 0.12);
    glass(ctx, -(o.w || 170) / 2, -H * 0.8, o.w || 170, H * 1.6, { tone: o.tone || 'light', r: 0, lift: 0.3, refract: 18, lw: 1.5 });
    ctx.restore();
  }

  // ---------------- 1 · hook ----------------
  const S1 = { t0: 0, t1: T1, render(ctx, t) {
    stage(ctx, t, { pillars: WARM, alpha: smooth(inv(-0.05, 0.4, t)), dx: -t * 30 });
    dust(ctx, t, { a: 0.5, dy: -t * 170 }); candles(ctx, t, { a: 0.09, y: 1740, speed: 44 });
    ctx.save(); camera(ctx, t, 0, T1, { s0: 1.0, s1: 1.09, drift: 8 });
    trackIn(ctx, LO, 'Claude', W / 2, 680, t, 0.06, { w: 600, size: 216, color: CL.light, from: 120, d: 0.9 });
    const lu = eo(t, 0.42, 0.55);
    if (lu > 0) { ctx.fillStyle = CL.orange; rr(ctx, W / 2 - 200 * lu, 742, 400 * lu, 10, 5); ctx.fill(); }
    popWords(ctx, 'ينقل تداولك', W / 2, 950, t, { t0: 0.55, size: 116, w: 700, color: '#FFFFFF', st: 0.09, from: 1.5 });
    popWords(ctx, 'إلى المستوى التالي', W / 2, 1100, t, { t0: 0.86, size: 116, w: 700, colors: ['#FFFFFF', '#FFFFFF', CL.orange2], st: 0.09, from: 1.5 });
    snap(ctx.canvas);
    [[290, 170], [540, 290], [790, 430]].forEach(([cx, h], i) => {
      const u = sp(t, 1.25 + i * 0.12, 2.6, 0.6); if (u <= 0) return; const hh = h * clamp(u, 0, 1.08);
      if (i === 2) { const gy = 1620 - hh / 2, g = ctx.createRadialGradient(cx, gy, 20, cx, gy, 340); g.addColorStop(0, 'rgba(217,119,87,0.42)'); g.addColorStop(1, 'rgba(217,119,87,0)'); ctx.save(); ctx.globalAlpha *= clamp(u); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(cx - 340, gy - 340, 680, 680); ctx.restore(); }
      glass(ctx, cx - 105, 1620 - hh, 210, hh, { tone: i === 2 ? 'clay' : 'light', r: 22, ch: i === 2 ? 34 : 0, corner: 'tr', glint: clamp((t - 1.5 - i * 0.1) / 0.6), alpha: clamp((t - 1.25 - i * 0.12) / 0.1) });
      if (i === 2 && u > 0.6) { ctx.save(); ctx.globalAlpha *= clamp((u - 0.6) * 2.5); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; const ty = 1620 - hh + 70; ctx.beginPath(); ctx.moveTo(cx - 26, ty + 16); ctx.lineTo(cx, ty - 12); ctx.lineTo(cx + 26, ty + 16); ctx.stroke(); ctx.restore(); }
    });
    ctx.restore();
    shard(ctx, t, 0.15, 0.55, { w: 150 }); shard(ctx, t, 2.0, 0.6, { w: 220, rot: -0.1 });
  } };

  // ---------------- 2 · Claude switches on inside Axi ----------------
  const S2 = { t0: T1, t1: T2, render(ctx, t) {
    lightStage(ctx, t, -(t - T1) * 40);
    ctx.save(); camera(ctx, t, T1, T2, { s0: 1.06, s1: 1.0, drift: 6 });
    popWords(ctx, 'جديد من آكسي العراق', W / 2, 520, t, { t0: T1 + 0.05, size: 76, w: 600, color: '#FFFFFF', st: 0.07, from: 1.3 });
    K.logoReveal(ctx, W / 2, 810, 500, t, T1 + 0.08);
    snap(ctx.canvas);
    const cu = sp(t, T1 + 0.35, 2.4, 0.6), on = smooth(inv(T1 + 0.85, T1 + 1.05, t)), CY = 1140, CW = 500, CH = 150;
    if (cu > 0) { ctx.save(); ctx.translate(W / 2, CY); ctx.scale(clamp(cu, 0, 1.1), clamp(cu, 0, 1.1)); ctx.translate(-W / 2, -CY); U3.toggleChip(ctx, W / 2, CY, on, { w: CW, h: CH, glint: clamp((t - T1 - 1.0) / 0.6) }); ctx.restore(); }
    K.ripple(ctx, W / 2 + CW / 2 - 68 * CH / 116, CY, t, T1 + 0.95, { r0: 30, r1: 300, w: 3, n: 2, a: 0.55, color: CL.orange });
    const tu = eo(t, T1 + 1.1, 0.5);
    if (tu > 0) mixLine(ctx, [{ t: 'حسابك في آكسي، الآن داخل' }, { t: 'Claude', lat: true, color: '#B4573A' }], W / 2, 1380 + (1 - tu) * 30, { size: 58, lsize: 56, w: 600, lw: 700, color: INK, alpha: tu, gap: 16 });
    ctx.restore();
  } };

  // ---------------- 3 · a super-smart assistant ----------------
  const S3 = { t0: T2, t1: T3, render(ctx, t) {
    stage(ctx, t, { pillars: WARM, dx: 50 - (t - T2) * 40 });
    dust(ctx, t, { a: 0.4, dy: -t * 110 });
    ctx.save(); camera(ctx, t, T2, T3, { s0: 1.0, s1: 1.05, drift: 6 });
    popWords(ctx, 'تداول مع مساعد', W / 2, 420, t, { t0: T2 + 0.05, size: 100, w: 700, color: '#FFFFFF', st: 0.08 });
    popWords(ctx, 'فائق الذكاء', W / 2, 565, t, { t0: T2 + 0.28, size: 124, w: 700, color: CL.orange2, st: 0.1, from: 1.6 });
    snap(ctx.canvas);
    const su = sp(t, T2 + 0.2, 1.9, 0.62), x = 90, y = 690, w = 900, h = 800;
    if (su > 0) {
      ctx.save(); ctx.globalAlpha *= clamp((t - T2 - 0.2) / 0.12); swing(ctx, W / 2, y + h / 2, (1 - clamp(su)) * 1.1); ctx.translate(0, (1 - clamp(su)) * 80);
      glass(ctx, x, y, w, h, { tone: 'ivory', r: 40, glint: clamp((t - T2 - 0.7) / 0.8) });
      LO.draw(ctx, 'Claude', x + 56, y + 92, { w: 600, size: 52, color: INK, align: 'left' });
      ctx.fillStyle = 'rgba(20,20,19,0.10)'; ctx.fillRect(x + 40, y + 132, w - 80, 2);
      const q = U2.typed('كم رصيدي والهامش المتاح؟', t, T2 + 0.4, 34);
      if (t > T2 + 0.35) U2.userBubble(ctx, q.s, x + w - 48, y + 168, { size: 44, caret: !q.done && U2.caret(t) });
      if (t > T2 + 1.05 && t < T2 + 1.3) U2.thinking(ctx, x + w - 120, y + 380, t);
      // Claude answers with the account at a glance
      const rows = [['الرصيد', '$12,480.50'], ['حقوق الملكية', '$12,584.05'], ['الهامش المتاح', '$11,344.05']];
      rows.forEach(([k, v], i) => {
        const ru = eo(t, T2 + 1.25 + i * 0.12, 0.4); if (ru <= 0) return; const ry = y + 330 + i * 112;
        ctx.save(); ctx.globalAlpha *= ru; ctx.translate(0, (1 - ru) * 20);
        rr(ctx, x + 48, ry, w - 96, 92, 18); ctx.fillStyle = 'rgba(20,20,19,0.05)'; ctx.fill();
        ar(ctx, k, x + w - 80, ry + 60, { w: 400, size: 34, color: '#3D3D3A', align: 'right' });
        lat(ctx, v, x + 80, ry + 62, { w: 700, size: 42, color: INK, align: 'left' });
        ctx.restore();
      });
      ar(ctx, 'أرقام توضيحية', x + w / 2, y + h - 40, { w: 400, size: 24, color: 'rgba(20,20,19,0.45)', alpha: eo(t, T2 + 1.6, 0.4) });
      ctx.restore();
    }
    ctx.restore();
  } };

  // ---------------- 4 · what you can do (mcp.axi.com: "What You Can Do with Claude") ----------------
  const ITEMS = [
    { t: 'أدِر حساباتك', d: 'الرصيد · حقوق الملكية · الهامش', viz: 'acct' },
    { t: 'استكشف الأسواق', d: 'أسعار لحظية وبيانات السوق', viz: 'mkts' },
    { t: 'راقب صفقاتك', d: 'الربح غير المحقق · وقف الخسارة · جني الأرباح', viz: 'pos' },
    { t: 'أدِر صفقاتك', d: 'افتح · عدّل · أغلق عبر المحادثة', viz: 'trade' },
    { t: 'سجل التداول', d: 'الصفقات المنفذة وأسعار الدخول والخروج', viz: 'hist' },
  ];
  const DT = (T4 - T3) / ITEMS.length;
  function viz(ctx, kind, x, y, w, t, t0) {
    const rin = (i) => eo(t, t0 + 0.16 + i * 0.07, 0.3), RH = 96, RS = 116;
    // one row: label on the right (Arabic, or Latin when `rl`), optional middle tag, value on the left
    const row = (i, r, m, l, o = {}) => {
      const u = rin(i); if (u <= 0) return; const ry = y + i * RS;
      ctx.save(); ctx.globalAlpha *= u; ctx.translate((1 - u) * -30, 0);
      rr(ctx, x, ry, w, RH, 22); ctx.fillStyle = 'rgba(255,255,255,0.09)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.16)'; ctx.lineWidth = 1.5; ctx.stroke();
      if (o.rl) lat(ctx, r, x + w - 34, ry + 61, { w: 700, size: 36, color: '#FFFFFF', align: 'right' }); else ar(ctx, r, x + w - 34, ry + 62, { w: 500, size: 36, color: '#FFFFFF', align: 'right' });
      if (m) ar(ctx, m, x + w * 0.5, ry + 61, { w: 400, size: 32, color: 'rgba(255,255,255,0.66)' });
      if (o.spark) { // a small price line drawing itself in
        const pts = o.spark, n = pts.length, sx = x + w * 0.36, sw = w * 0.26, d = clamp((t - t0 - 0.3 - i * 0.07) / 0.5);
        ctx.save(); ctx.beginPath(); ctx.rect(sx - 4, ry, sw * d + 8, RH); ctx.clip(); ctx.strokeStyle = AX.mint; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath();
        pts.forEach((v, k) => { const px = sx + (k / (n - 1)) * sw, py = ry + RH / 2 + 22 - v * 44; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.stroke(); ctx.restore();
      }
      lat(ctx, l, x + 34, ry + 61, { w: 700, size: 38, color: o.c || '#FFFFFF', align: 'left' });
      ctx.restore();
    };
    if (kind === 'acct') { row(0, 'الرصيد', '', '$12,480.50'); row(1, 'حقوق الملكية', '', '$12,584.05'); row(2, 'الهامش المستخدم', '', '$1,240.00'); }
    if (kind === 'mkts') {
      row(0, 'EUR/USD', '', '1.0874 ▲', { rl: true, c: AX.mint, spark: [0.1, 0.3, 0.2, 0.5, 0.4, 0.7, 0.6, 0.95] });
      row(1, 'XAU/USD', '', '2,412.60 ▲', { rl: true, c: AX.mint, spark: [0.2, 0.15, 0.4, 0.35, 0.6, 0.55, 0.8, 0.9] });
      row(2, 'US500', '', '5,236.6 ▲', { rl: true, c: AX.mint, spark: [0.05, 0.25, 0.3, 0.2, 0.5, 0.65, 0.6, 0.85] });
    }
    if (kind === 'pos') { row(0, 'EUR/USD', 'شراء', '+$84.20', { rl: true, c: AX.mint }); row(1, 'XAU/USD', 'بيع', '−$12.40', { rl: true, c: AX.red }); row(2, 'SL 1.0820', '', 'TP 1.0960', { rl: true }); }
    if (kind === 'hist') { row(0, 'GBP/USD', 'إغلاق', '+$31.75', { rl: true, c: AX.mint }); row(1, 'EUR/USD', 'إغلاق', '+$22.10', { rl: true, c: AX.mint }); row(2, 'XAU/USD', 'إغلاق', '−$9.30', { rl: true, c: AX.red }); }
    if (kind === 'trade') {
      const u = rin(0); if (u <= 0) return; ctx.save(); ctx.globalAlpha *= u; ctx.translate((1 - u) * -30, 0);
      const bh = 328; rr(ctx, x, y, w, bh, 26); ctx.fillStyle = 'rgba(255,255,255,0.09)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.16)'; ctx.lineWidth = 1.5; ctx.stroke();
      mixLine(ctx, [{ t: 'تعديل وقف الخسارة' }, { t: 'EUR/USD', lat: true }, { t: '←' }, { t: '1.0820', lat: true }], x + w - 36, y + 74, { size: 38, lsize: 34, w: 500, lw: 700, color: '#FFFFFF', align: 'right', gap: 12 });
      ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.fillRect(x + 36, y + 118, w - 72, 2);
      const pr = clamp(1 - Math.abs(t - (t0 + 0.6)) / 0.1), bw = 300, bhh = 78, bx = x + 36, by = y + 150, s = 1 - 0.07 * pr;
      ctx.save(); ctx.translate(bx + bw / 2, by + bhh / 2); ctx.scale(s, s); rr(ctx, -bw / 2, -bhh / 2, bw, bhh, bhh / 2); ctx.fillStyle = CL.light; ctx.fill(); PO.draw(ctx, 'Allow once', 0, 11, { w: 500, size: 32, color: INK }); ctx.restore();
      ctx.save(); rr(ctx, bx + bw + 24, by, 190, bhh, bhh / 2); ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2; ctx.stroke(); PO.draw(ctx, 'Deny', bx + bw + 24 + 95, by + 50, { w: 500, size: 30, color: 'rgba(255,255,255,0.85)' }); ctx.restore();
      const du = eo(t, t0 + 0.68, 0.25);
      if (du < 1) ar(ctx, 'بانتظار موافقتك', x + w - 36, y + 290, { w: 500, size: 34, color: 'rgba(255,255,255,0.72)', align: 'right', alpha: 1 - du });
      if (du > 0) { ctx.save(); ctx.globalAlpha *= du; U3.check(ctx, x + w - 56, y + 278, 1.3, CL.orange2, 5); ctx.restore(); ar(ctx, 'تم بعد موافقتك', x + w - 96, y + 290, { w: 600, size: 36, color: '#FFFFFF', align: 'right', alpha: du }); }
      ctx.restore();
    }
  }
  const S4 = { t0: T3, t1: T4, render(ctx, t) {
    stage(ctx, t, { pillars: COOL, dx: -(t - T3) * 60 });
    dust(ctx, t, { a: 0.45, dy: -t * 140 }); candles(ctx, t, { a: 0.08, y: 1760, speed: 36 });
    ctx.save(); camera(ctx, t, T3, T4, { s0: 1.0, s1: 1.05, drift: 6 });
    // progress: five segments, RTL
    for (let k = 0; k < 5; k++) { const sw = 120, sx = W / 2 + 2.5 * sw + 2 * 14 - (k + 1) * sw - k * 14 - 7; const on = t >= T3 + k * DT; rr(ctx, sx, 370, sw, 8, 4); ctx.fillStyle = on ? CL.orange2 : 'rgba(255,255,255,0.22)'; ctx.fill(); }
    snap(ctx.canvas);
    ITEMS.forEach((it, i) => {
      const t0 = T3 + i * DT, tin = sp(t, t0, 2.4, 0.66), tout = smooth(inv(t0 + DT - 0.16, t0 + DT + 0.06, t));
      if (t < t0 - 0.02 || t > t0 + DT + 0.08 || (i === ITEMS.length - 1 && false)) return;
      const x = 90, y = 470, w = 900, h = 960, ang = (1 - clamp(tin)) * -0.9 + tout * 0.9;
      ctx.save(); ctx.globalAlpha *= clamp((t - t0) / 0.1) * (1 - tout); swing(ctx, W / 2, y + h / 2, ang); ctx.translate((1 - clamp(tin)) * 160 - tout * 220, 0);
      glass(ctx, x, y, w, h, { tone: 'light', r: 44, ch: 52, corner: 'tl', glint: clamp((t - t0 - 0.15) / 0.55) });
      lat(ctx, String(i + 1).padStart(2, '0'), x + w - 60, y + 180, { w: 800, size: 140, color: 'rgba(255,255,255,0.95)', align: 'right' });
      ar(ctx, it.t, x + w - 60, y + 315, { w: 700, size: 92, color: '#FFFFFF', align: 'right' });
      ar(ctx, it.d, x + w - 60, y + 392, { w: 400, size: it.d.length > 30 ? 36 : 40, color: 'rgba(255,255,255,0.82)', align: 'right' });
      ctx.fillStyle = CL.orange; rr(ctx, x + w - 60 - 90, y + 430, 90, 8, 4); ctx.fill();
      viz(ctx, it.viz, x + 56, y + 494, w - 112, t, t0);
      ctx.restore();
    });
    ar(ctx, 'أرقام توضيحية', W / 2, 1500, { w: 400, size: 26, color: 'rgba(255,255,255,0.5)' });
    ctx.restore();
  } };

  // ---------------- 5 · CTA (no risk strip, by request) ----------------
  const S5 = { t0: T4, t1: 15.01, render(ctx, t) {
    lightStage(ctx, t, -(t - T4) * 30);
    ctx.save(); camera(ctx, t, T4, 15, { s0: 1.05, s1: 1.0, drift: 4 });
    K.logoReveal(ctx, W / 2, 570, 500, t, T4 + 0.02);
    snap(ctx.canvas);
    const cu = sp(t, T4 + 0.35, 2.4, 0.6);
    if (cu > 0) { ctx.save(); ctx.translate(W / 2, 880); ctx.scale(clamp(cu, 0, 1.1), clamp(cu, 0, 1.1)); ctx.translate(-W / 2, -880); U3.toggleChip(ctx, W / 2, 880, smooth(inv(T4 + 0.6, T4 + 0.8, t)), { w: 460, h: 136 }); ctx.restore(); }
    popWords(ctx, 'تداول بذكاء أكبر', W / 2, 1090, t, { t0: T4 + 0.55, size: 96, w: 700, color: INK, st: 0.07, shadow: false });
    K.ctaPill(ctx, W / 2, 1250, t, T4 + 0.8, 'اربط حسابك الآن', { tb: B(27), w: 660, h: 130, size: 58 });
    const uu = eo(t, T4 + 1.05, 0.45);
    if (uu > 0) {
      snap(ctx.canvas);
      glass(ctx, W / 2 - 270, 1378, 540, 100, { tone: 'white', r: 50, alpha: uu, lift: 0.5 });
      lat(ctx, 'mcp.axi.com', W / 2, 1443, { w: 700, size: 48, color: INK, alpha: uu });
      ar(ctx, 'تداول بميزتك', W / 2, 1580, { w: 600, size: 46, color: '#3C4549', alpha: eo(t, T4 + 1.4, 0.5) });
    }
    ctx.restore();
  } };

  const SCENES = [S1, S2, S3, S4, S5];
  const CUTS = [
    { at: T1, d: 0.42, kind: 'slab' }, { at: T2, d: 0.36, kind: 'zoom', cy: 900 }, { at: T3, d: 0.42, kind: 'slab', tone: 'clay' },
    { at: T4, d: 0.4, kind: 'slab' },
  ];
  window.FILM = {
    duration: 15,
    blur(t) {
      for (const c of CUTS) if (Math.abs(t - c.at) < c.d / 2 + 0.05) return c.kind === 'slab' ? 14 : 8;
      for (let i = 1; i < ITEMS.length; i++) if (Math.abs(t - (T3 + i * DT)) < 0.16) return 8;
      if (t < 0.9 || (t > 1.9 && t < 2.6)) return 6;
      return 2;
    },
    draw(ctx, t) {
      film(ctx, t, SCENES, CUTS);
      const light = t > T1 && t < T2;
      if (t < T4 - 0.1) K.watermark(ctx, light ? INK : '#FFFFFF', 0.6 * smooth(inv(0.2, 0.6, t)) * (1 - smooth(inv(T4 - 0.4, T4 - 0.1, t))) * (Math.abs(t - T1) < 0.25 || Math.abs(t - T2) < 0.2 ? 0 : 1));
      K.grain(ctx, t, 0.028, t > 14.6);
    },
  };
})();
