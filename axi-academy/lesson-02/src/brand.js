// Brand open (white logo on the primary gradient, 1.5 s + identity sound) and close (X sting → CTA pill → risk strip).
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT;
  const { W, H, C, clamp, lerp, eo, ei, hexA, txt, logo, logoWidth, xmark } = A; G.CONTINUOUS = true;
  F.sfx(0.06, 'identity', 0.55); F.sfx(1.58, 'shutter', 0.2);
  F.scene({ name: 'open', t0: 0, t1: 2.05, ink: 'slate', noMarks: true, draw(ctx, t) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, C.frost); g.addColorStop(1, C.slate); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const h = 250, lw = logoWidth(h);
    const m = G.CONTINUOUS ? A.eio(t, 1.55, 0.5) : 0;
    if (m > 0) { ctx.save(); ctx.globalAlpha = m; const g2 = ctx.createLinearGradient(0, 0, 0, H); g2.addColorStop(0, '#FBFBFB'); g2.addColorStop(1, C.frost); ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    if (m < 0.98) { ctx.save(); ctx.translate(960, 545); ctx.scale(1 - m, 1 - m); ctx.translate(-960, -545); logo(ctx, 960 - lw / 2, 545 - h / 2, h, A.mixHex(C.white, C.ink, m), { axi: FX.springU(t - 0.12, 15, 0.5), iraq: FX.springU(t - 0.42, 15, 0.5) }); ctx.restore(); }
    if (m > 0.5) { ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(960, 540, 14 * clamp((m - 0.5) * 2), 0, 6.283); ctx.fill(); }
  } });
  F.addClose = function () {
    const CL = { t0: F.CLOSE, t1: F.TOTAL + 1 };
    F.sfx(CL.t0 - 0.42, 'whoosh', 0.18, { d: 0.45 }); F.sfx(CL.t0 + 0.02, 'sting', 0.6); F.sfx(CL.t0 + 1.05, 'whoosh', 0.14, { d: 0.4 }); F.sfx(CL.t0 + 1.35, 'pop', 0.24, { f: 820 });
    const x3d = (ctx, cx, cy, h, depth) => { for (let d = depth; d > 0; d -= 1.5) xmark(ctx, cx + d * 0.55, cy + d, h, C.slate, 1); xmark(ctx, cx, cy, h, C.white, 1); };
    F.scene({ name: 'close', t0: CL.t0, t1: CL.t1, ink: 'slate', noMarks: true, enter: { type: G.CONTINUOUS ? 'cut' : 'bars', dur: 0.42 }, draw(ctx, t) {
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, C.frost); g.addColorStop(0.72, C.slate); g.addColorStop(1, C.slate); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const lt = t - CL.t0; const drop = lt < 0 ? 0 : 1 - Math.exp(-7 * lt) * Math.cos(13 * lt); const seal = ei(t, CL.t0 + 0.95, 0.25);
      if (G.CONTINUOUS) {
        const bm = 1 - A.eio(t, CL.t0, 0.45); if (bm > 0) { ctx.save(); ctx.globalAlpha = bm; const g2 = ctx.createLinearGradient(0, 0, 0, H); g2.addColorStop(0, '#FBFBFB'); g2.addColorStop(1, C.frost); ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H); ctx.restore(); }
        if (seal < 1) { const gs = FX.springU(lt, 11, 0.45) * (1 - seal); ctx.save(); ctx.translate(960, 540); ctx.scale(gs, gs); x3d(ctx, 0, 0, 300, 26); ctx.restore(); if (lt < 0.25) { ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(960, 540, 14 * (1 - lt / 0.25), 0, 6.283); ctx.fill(); } }
      } else if (seal < 1) { const y = lerp(-260, 520, drop); const s = 1 - seal; ctx.save(); ctx.translate(960, y); ctx.scale(s, s); x3d(ctx, 0, 0, 300, 26); ctx.restore(); }
      const pc = FX.springU(t - (CL.t0 + 1.1), 12, 0.6);
      if (pc > 0) {
        txt(ctx, 'تعلّم ثم تعلّم ثم تدرّب ثم تداول.', 960, 520 + (1 - Math.min(1, pc)) * 40, { size: 80, w: 'L', color: C.white, align: 'center', alpha: clamp((t - CL.t0 - 1.1) * 5) });
        K.pill(ctx, 'تعلّم مع Axi', 960, 670, { p: clamp(FX.springU(t - (CL.t0 + 1.35), 14, 0.55), 0, 1.05), size: 32, h: 76 });
        logo(ctx, 1843 - logoWidth(84), 52, 84, C.ink, { alpha: clamp((t - CL.t0 - 1.1) * 5) });
      }
      const pr = eo(t, F.TOTAL - 3.0, 0.3);
      if (pr > 0) {
        ctx.save(); ctx.globalAlpha = pr; ctx.fillStyle = 'rgba(9,10,13,0.75)'; ctx.fillRect(0, 930, W, 150);
        txt(ctx, 'تنطوي عقود الفروقات والمنتجات المشتقة خارج البورصة على مخاطر عالية قد تؤدي إلى خسارة رأس المال. المحتوى التعليمي والتحليلي لا يُعدّ نصيحة استثمارية.', 960, 990, { size: 22, w: 'R', color: C.white, align: 'center' });
        txt(ctx, 'قد لا يكون هذا المحتوى متاحاً في منطقتك. يُرجى الرجوع إلى شروط الخدمة.', 960, 1032, { size: 22, w: 'R', color: hexA(C.white, 0.8), align: 'center' });
        ctx.restore();
      }
    } });
  };
})(typeof window !== 'undefined' ? window : globalThis);
