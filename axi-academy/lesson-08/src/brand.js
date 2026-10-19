// Brand open (white Axi Iraq logo on the primary gradient → it shrinks into the red dot that starts the shot) and
// close (the shot collapses into the red dot → the dot grows back into the Axi Iraq logo → line → pill → risk strip).
// The Axi Iraq logo is the only end mark; the X mark is never used on its own.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT;
  const { W, H, C, clamp, lerp, eo, hexA, txt, logo, logoWidth } = A; G.CONTINUOUS = true;
  const primary = (ctx) => { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, C.frost); g.addColorStop(1, C.slate); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); };
  const paper = (ctx, a) => { ctx.save(); ctx.globalAlpha = a; const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#FBFBFB'); g.addColorStop(1, C.frost); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); };
  F.sfx(0.06, 'identity', 0.55); F.sfx(1.58, 'shutter', 0.2);
  F.scene({ name: 'open', t0: 0, t1: 2.05, ink: 'slate', noMarks: true, draw(ctx, t) {
    primary(ctx);
    const h = 250, lw = logoWidth(h); const m = A.eio(t, 1.55, 0.5);
    if (m > 0) paper(ctx, m);
    if (m < 0.98) { ctx.save(); ctx.translate(960, 545); ctx.scale(1 - m, 1 - m); ctx.translate(-960, -545); logo(ctx, 960 - lw / 2, 545 - h / 2, h, A.mixHex(C.white, C.ink, m), { axi: FX.springU(t - 0.12, 15, 0.5), iraq: FX.springU(t - 0.42, 15, 0.5) }); ctx.restore(); }
    if (m > 0.5) { ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(960, 540, 14 * clamp((m - 0.5) * 2), 0, 6.283); ctx.fill(); }
  } });
  F.addClose = function () {
    const t0 = F.CLOSE, t1 = F.TOTAL + 1;
    F.sfx(t0 - 0.42, 'whoosh', 0.18, { d: 0.45 }); F.sfx(t0 + 0.02, 'sting', 0.6); F.sfx(t0 + 1.05, 'whoosh', 0.14, { d: 0.4 }); F.sfx(t0 + 1.35, 'pop', 0.24, { f: 820 });
    F.scene({ name: 'close', t0, t1, ink: 'slate', noMarks: true, enter: { type: 'cut' }, draw(ctx, t) {
      primary(ctx);
      const lt = t - t0; const bm = 1 - A.eio(t, t0, 0.45); if (bm > 0) paper(ctx, bm);
      // the dot springs back into the Axi Iraq logo (the open, reversed)
      const gs = clamp(FX.springU(lt - 0.05, 11, 0.5), 0, 1.2); const h = 230, lw = logoWidth(h);
      if (lt < 0.3) { ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(960, 540, 14 * (1 - lt / 0.3), 0, 6.283); ctx.fill(); }
      if (gs > 0.01) {
        ctx.save(); ctx.translate(960, 470); ctx.scale(gs, gs); ctx.translate(-960, -470);
        logo(ctx, 960 - lw / 2, 470 - h / 2, h, A.mixHex(C.ink, C.white, clamp(lt * 2.5)), { axi: FX.springU(lt - 0.05, 15, 0.5), iraq: FX.springU(lt - 0.3, 15, 0.5) });
        ctx.restore();
      }
      const pc = FX.springU(lt - 1.1, 12, 0.6);
      if (pc > 0) {
        txt(ctx, 'تعلّم ثم تعلّم ثم تدرّب ثم تداول.', 960, 712 + (1 - Math.min(1, pc)) * 40, { size: 56, w: 'L', color: C.white, align: 'center', alpha: clamp((lt - 1.1) * 5) });
        K.pill(ctx, 'تعلّم مع Axi', 960, 812, { p: clamp(FX.springU(lt - 1.35, 14, 0.55), 0, 1.05), size: 30, h: 70 });
      }
      const pr = eo(t, F.TOTAL - 3.0, 0.3);
      if (pr > 0) {
        ctx.save(); ctx.globalAlpha = pr; ctx.fillStyle = 'rgba(9,10,13,0.78)'; ctx.fillRect(0, 930, W, 150);
        txt(ctx, 'تنطوي عقود الفروقات والمنتجات المشتقة خارج البورصة على مخاطر عالية قد تؤدي إلى خسارة رأس المال. المحتوى التعليمي والتحليلي لا يُعدّ نصيحة استثمارية.', 960, 990, { size: 22, w: 'R', color: C.white, align: 'center' });
        txt(ctx, 'قد لا يكون هذا المحتوى متاحاً في منطقتك. يُرجى الرجوع إلى شروط الخدمة.', 960, 1032, { size: 22, w: 'R', color: hexA(C.white, 0.8), align: 'center' });
        ctx.restore();
      }
    } });
  };
})(typeof window !== 'undefined' ? window : globalThis);
