// AD 2 — the offer: «إذا تعبت تدوّر من وين تبدي تتعلّم… آكسي لگتلك الحل وسوّتلك أكاديمية تداول متكاملة،
// مع بونص إيداع $50 لأول 10 خريجين» (15 s, 9:16, 128 bpm grid).
// Endless search (dark) → the red tip drops like a pin → «آكسي لگتلك الحل» → the academy with its modules →
// the $50 counter and 10 graduation caps lighting up → X sting → CTA card with the offer, T&Cs and risk strip.
(function () {
  const { W, H, C, B, BEAT, clamp, lerp, inv, smooth, eo, ei, eio, co, cio, qo, sp, shake, backOut, rng, hash, noise } = K;
  const { ar, arW, lat, latW, arWords, glass, rr, disc, ring, ripple, sparks } = K;

  const T_TURN = B(6), T_ACAD = B(10), T_OFFER = B(16), T_X = B(24), T_END = B(25.6);
  const QUERY = 'تعلّم التداول للمبتدئين… من وين أبدي؟';
  const CHIPS = ['الأساسيات', 'الرسوم البيانية', 'التحليل الفني والأساسي', 'استراتيجية التداول', 'قبل أول إيداع', 'سلسلة الذهب'];
  const TAGS = ['فيديو', 'كورس', 'مقال', 'نصيحة', 'بث مباشر', 'قناة'];

  // ---------- 1 · the endless search ----------
  const ROWS = (() => { const r = rng(9), o = []; for (let i = 0; i < 22; i++) o.push({ w1: 0.45 + r() * 0.4, w2: 0.3 + r() * 0.45, tag: TAGS[i % TAGS.length], q: r() }); return o; })();
  const QMARKS = (() => { const r = rng(4), o = []; for (let i = 0; i < 26; i++) o.push({ x: 60 + r() * (W - 120), y0: 600 + r() * 1300, s: 40 + r() * 110, v: 60 + r() * 160, ph: r() * 6, t0: 0.6 + r() * 1.6 }); return o; })();
  function searchScene(ctx, t) {
    K.bgDark(ctx);
    const panic = smooth(inv(1.6, T_TURN - 0.1, t)), hs = shake(t, [2.35, 2.55], 9 * panic + 4, 0.1, 2);
    ctx.save(); ctx.translate(hs.x, hs.y);
    // results flood upward behind everything
    const off = 140 * t + 420 * Math.pow(Math.max(0, t - 0.9), 2), top = 860, pitch = 132;
    ctx.save(); ctx.beginPath(); ctx.rect(0, top - 10, W, 820); ctx.clip();
    const ru = eo(t, 0.55, 0.5);
    ROWS.forEach((r, i) => {
      const y = top + i * pitch - (off % (pitch * ROWS.length)) + (i * pitch < (off % (pitch * ROWS.length)) - 200 ? pitch * ROWS.length : 0);
      if (y < top - pitch || y > top + 820) return;
      ctx.save(); ctx.globalAlpha *= ru * 0.95; glass(ctx, 90, y, 900, 112, { r: 22, fill: 'rgba(36,37,40,0.92)', stroke: 'rgba(255,255,255,0.10)' });
      rr(ctx, 110, y + 16, 132, 80, 12); ctx.fillStyle = 'rgba(255,255,255,0.10)'; ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.55)'; rr(ctx, 960 - 600 * r.w1, y + 26, 600 * r.w1, 16, 8); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.22)'; rr(ctx, 960 - 600 * r.w2, y + 58, 600 * r.w2, 12, 6); ctx.fill();
      const tw = arW(ctx, r.tag, { w: 600, size: 24 }) + 28; rr(ctx, 960 - tw, y + 78, tw, 30, 15); ctx.fillStyle = 'rgba(255,255,255,0.10)'; ctx.fill();
      ar(ctx, r.tag, 960 - tw / 2, y + 102, { w: 600, size: 22, alpha: 0.75 });
      ctx.restore();
    });
    ctx.restore();
    // question marks rising
    QMARKS.forEach((q) => {
      const d = t - q.t0; if (d < 0) return; const a = clamp(d / 0.3) * (0.08 + 0.22 * panic);
      const y = q.y0 - d * q.v * (1 + panic), x = q.x + 18 * Math.sin(d * 2 + q.ph);
      ar(ctx, '؟', x, y, { w: 700, size: q.s, alpha: a });
    });
    // search bar with typing
    const bu = eo(t, 0.15, 0.45);
    ctx.save(); ctx.globalAlpha *= bu; ctx.translate(0, (1 - bu) * 40);
    glass(ctx, 80, 700, 920, 124, { r: 62, fill: 'rgba(28,30,34,0.96)', stroke: 'rgba(255,255,255,0.35)', lw: 3 });
    ring(ctx, 930, 755, 20, 5, C.white, 0.9); ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(916, 770); ctx.lineTo(902, 786); ctx.stroke(); ctx.restore();
    const chars = [...QUERY], n = Math.floor(clamp((t - 0.35) / 1.25) * chars.length), typed = chars.slice(0, n).join('');
    const tw = arW(ctx, typed, { w: 400, size: 42 }); ar(ctx, typed, 880, 776, { w: 400, size: 42, align: 'right' });
    if (Math.floor(t * 3.2) % 2 === 0 || n < chars.length) { ctx.fillStyle = C.white; ctx.fillRect(880 - tw - 10, 736, 4, 56); }
    ctx.restore();
    // headline (dialect)
    arWords(ctx, 'إذا تعبت تدوّر', W / 2, 430, t, { t0: 0.0, st: 0.1, d: 0.45, w: 700, size: 108 });
    arWords(ctx, 'من وين تبدي تتعلّم؟', W / 2, 570, t, { t0: 0.95, st: 0.1, d: 0.45, w: 700, size: 92, alpha: 0.92 });
    ctx.restore();
    // the red tip drops like a pin onto the search bar
    const pin = T_TURN - 0.3, pd = clamp((t - pin) / 0.22);
    if (t > pin) { K.nibGroup(ctx, W / 2, lerp(-140, 650, pd * pd), 2.2, { nib: 0, bars: 0 }); }
  }

  // ---------- mortarboard ----------
  function cap(ctx, x, y, lit, s = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(52, -6); ctx.lineTo(0, 14); ctx.lineTo(-52, -6); ctx.closePath();
    ctx.fillStyle = lit > 0 ? `rgba(255,255,255,${0.15 + 0.85 * lit})` : 'rgba(255,255,255,0.08)'; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = `rgba(255,255,255,${0.35 + 0.65 * lit})`; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-28, 6); ctx.lineTo(-28, 26); ctx.quadraticCurveTo(0, 40, 28, 26); ctx.lineTo(28, 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(40, 6); ctx.lineTo(40, 30); ctx.stroke();
    disc(ctx, 40, 34, 6, lit > 0.5 ? C.red : 'rgba(255,255,255,0.4)');
    ctx.restore();
  }

  function scene(ctx, t) {
    if (t < T_TURN) { searchScene(ctx, t); return; }
    // ---------- 2 · «آكسي لگتلك الحل» · 3 · the academy (light) ----------
    if (t < T_OFFER) {
      K.bgLight(ctx);
      const fl = Math.exp(-(t - T_TURN) / 0.09);
      const land = T_TURN + 0.05, outN = cio(t, T_ACAD - 0.3, 0.45);
      // the nib lands as the solution, then rises and grows into the full stacked logo
      const e = sp(t, land, 2.6, 0.45), s = lerp(1.5, 1.25, e), top = lerp(760, 820, e);
      const sTop = lerp(top, 700, outN), sS = lerp(s, 0.8, outN);
      ripple(ctx, W / 2, 1000, t, land, { r0: 60, r1: 700, w: 6, n: 3, a: 0.5 });
      K.stacked(ctx, W / 2, sTop, sS, { axi: eo(t, T_ACAD + 0.05, 0.45), acad: eo(t, T_ACAD + 0.15, 0.45) });
      // headline 2 (dialect): آكسي · لگتلك · الحل (red)
      const outH = ei(t, T_ACAD - 0.3, 0.3);
      if (outH < 1) {
        ctx.save(); ctx.translate(0, -outH * 300); ctx.globalAlpha *= 1 - outH;
        const words = [['آكسي', B(6.4), C.white], ['لگتلك', B(7), C.white], ['الحل', B(7.6), C.red]];
        const sz = 118, ws = words.map(([w]) => arW(ctx, w, { w: 700, size: sz })), gap = arW(ctx, ' ', { w: 700, size: sz }), tot = ws.reduce((a, b) => a + b) + gap * 2;
        let xr = W / 2 + tot / 2;
        words.forEach(([w, t0, col], i) => {
          const u = sp(t, t0, 3, 0.45); if (u > 0) { ctx.save(); ctx.translate(xr - ws[i] / 2, 470); ctx.scale(lerp(1.6, 1, u), lerp(1.6, 1, u)); ar(ctx, w, 0, 0, { w: 700, size: sz, color: col, alpha: clamp(u * 3) }); ctx.restore(); }
          xr -= ws[i] + gap;
        });
        sparks(ctx, W / 2 - tot / 2 + ws[2] / 2, 430, t, B(7.6) + 0.05, { color: C.red, n: 12, len: 140, r0: 70 });
        ctx.restore();
      }
      // 3 · «وسوّتلك» / «أكاديمية تداول متكاملة»
      if (t > T_ACAD - 0.1) {
        arWords(ctx, 'وسوّتلك', W / 2, 300, t, { t0: T_ACAD, st: 0.08, d: 0.4, w: 400, size: 64, alpha: 0.92 });
        arWords(ctx, 'أكاديمية تداول متكاملة', W / 2, 440, t, { t0: T_ACAD + 0.25, st: 0.12, d: 0.45, w: 700, size: 80 });
        // module chips fly in and snap into a 2 x 3 grid under the logo
        CHIPS.forEach((c, i) => {
          const t0 = T_ACAD + 0.75 + i * 0.12, u = eo(t, t0, 0.55); if (u <= 0) return;
          const col = i % 2, row = Math.floor(i / 2), w = 448, h = 84, x = col ? 92 : W - 92 - w, y = 1250 + row * 104;
          const a = hash(i * 7.7) * Math.PI * 2, fx = Math.cos(a) * 700 * (1 - u), fy = Math.sin(a) * 500 * (1 - u);
          ctx.save(); ctx.translate(fx, fy); ctx.globalAlpha *= clamp(u * 2);
          glass(ctx, x, y, w, h, { r: 42, fill: 'rgba(20,22,26,0.8)', stroke: 'rgba(255,255,255,0.3)' });
          disc(ctx, x + w - 42, y + h / 2, 17, C.red);
          ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 4.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x + w - 50, y + h / 2); ctx.lineTo(x + w - 44, y + h / 2 + 6); ctx.lineTo(x + w - 33, y + h / 2 - 7); ctx.stroke(); ctx.restore();
          ar(ctx, c, x + w - 76, y + h / 2 + 13, { w: 600, size: c.length > 14 ? 30 : 36, align: 'right' });
          ctx.restore();
        });
      }
      if (fl > 0.01) { ctx.save(); ctx.globalAlpha = 0.85 * fl; ctx.fillStyle = C.white; ctx.fillRect(0, 0, W, H); ctx.restore(); }
      // curtain to the dark offer scene
      const cu = eio(t, T_OFFER - 0.32, 0.36);
      if (cu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, cu * H); ctx.clip(); K.bgDark(ctx); ctx.restore(); ctx.save(); ctx.globalAlpha = 0.9 * (1 - cu); ctx.fillStyle = C.red; ctx.fillRect(0, cu * H - 3, W, 6); ctx.restore(); }
      return;
    }
    // ---------- 4 · the offer (dark) ----------
    if (t < T_X) {
      K.bgDark(ctx);
      // soft vertical light from the top behind the number
      const beam = smooth(inv(T_OFFER, T_OFFER + 0.6, t)) * (1 - inv(T_X - 0.3, T_X, t));
      if (beam > 0) { const g = ctx.createLinearGradient(0, 0, 0, 1300); g.addColorStop(0, 'rgba(255,255,255,0.16)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.save(); ctx.globalAlpha = beam; ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(W / 2 - 160, 0); ctx.lineTo(W / 2 + 160, 0); ctx.lineTo(W / 2 + 420, 1300); ctx.lineTo(W / 2 - 420, 1300); ctx.closePath(); ctx.fill(); ctx.restore(); }
      const out = ei(t, T_X - 0.28, 0.28), hs = shake(t, [B(17.5)], 12, 0.12, 5);
      ctx.save(); ctx.translate(W / 2 + hs.x, 900 + hs.y); ctx.scale(1 + out * 0.5, 1 + out * 0.5); ctx.translate(-W / 2, -900); ctx.globalAlpha *= 1 - out;
      arWords(ctx, 'بونص إيداع', W / 2, 430, t, { t0: T_OFFER + 0.05, st: 0.12, d: 0.45, w: 700, size: 96 });
      // hero $50: odometer 00 → 50, then lands with a flash
      const cnt = cio(t, B(16.6), B(1.6)) * 50, hu = eo(t, B(16.4), 0.4), landT = B(17.5);
      if (hu > 0) {
        ctx.save(); ctx.globalAlpha *= hu; ctx.translate(W / 2, 790); const k = 1 + 0.08 * Math.exp(-Math.max(0, t - landT) / 0.1) * (t > landT ? 1 : 0); ctx.scale(k, k);
        const dw = K.wheels(ctx, cnt, 70, 0, { digits: 2, size: 330, w: 800 });
        lat(ctx, '$', 70 - dw / 2 - 62, -10, { w: 700, size: 190 });
        ctx.restore();
        sparks(ctx, W / 2, 680, t, landT, { n: 14, len: 220, r0: 230, w: 5 });
      }
      arWords(ctx, 'لأول 10 خريجين', W / 2, 990, t, { t0: B(17.6), st: 0.1, d: 0.45, w: 700, size: 84 });
      // 10 caps light up on the 16ths
      for (let i = 0; i < 10; i++) {
        const row = Math.floor(i / 5), col = i % 5, x = W / 2 + (2 - col) * 176, y = 1170 + row * 150;
        const ap = eo(t, B(18.4) + i * 0.03, 0.4); if (ap <= 0) continue;
        const lit = clamp((t - (B(19) + i * BEAT / 4)) / 0.08);
        ctx.save(); ctx.globalAlpha *= ap; cap(ctx, x, y + (1 - ap) * 30, lit, 1.15 + 0.12 * Math.exp(-Math.max(0, t - (B(19) + i * BEAT / 4)) / 0.1) * (lit > 0 ? 1 : 0)); ctx.restore();
      }
      const tc = eo(t, B(20), 0.45); if (tc > 0) ar(ctx, 'تُطبّق الشروط والأحكام', W / 2, 1490, { w: 400, size: 34, alpha: 0.72 * tc });
      ctx.restore();
      return;
    }
    // ---------- 5 · X sting ----------
    if (t < T_END) { K.xSting(ctx, t, T_X, T_END - T_X); return; }
    // ---------- 6 · end card ----------
    K.bgLight(ctx);
    const e = sp(t, T_END, 2.6, 0.55);
    K.stacked(ctx, W / 2, 270 + (1 - e) * 50, 0.92 * lerp(0.82, 1, e), { nib: clamp(e * 2), tip: clamp(e * 2), bars: clamp(e * 2), axi: eo(t, T_END + 0.1, 0.45), acad: eo(t, T_END + 0.2, 0.45) });
    K.ctaPill(ctx, W / 2, 960, t, T_END + 0.35, 'سجّل الآن', { tb: B(27) });
    const uu = eo(t, T_END + 0.5, 0.5);
    if (uu > 0) {
      lat(ctx, 'axi.com/ar', W / 2, 1090 + (1 - uu) * 20, { w: 600, size: 46, color: C.ink, alpha: uu });
      K.mixLine(ctx, [{ t: 'بونص إيداع' }, { t: '$50', lat: true }, { t: 'لأول' }, { t: '10', lat: true }, { t: 'خريجين' }], W / 2, 1160, { w: 600, lw: 700, size: 36, gap: 11, color: C.ink, alpha: uu });
      ar(ctx, 'تُطبّق الشروط والأحكام', W / 2, 1206, { w: 400, size: 26, color: C.graphite, alpha: uu * 0.85 });
    }
    K.riskStrip(ctx, t, T_END, 1250);
  }

  window.FILM = {
    duration: 15,
    blur(t) {
      if (t > 1.6 && t < T_TURN + 0.5) return 10;
      if (t > T_ACAD - 0.35 && t < T_ACAD + 1.9) return 8;
      if (t > T_OFFER - 0.35 && t < T_OFFER + 0.6) return 10;
      if (t > B(16.4) && t < B(18) + 0.2) return 8;
      if (t > T_X - 0.3 && t < T_X + 0.35) return 10;
      if (t > T_END - 0.05 && t < T_END + 0.6) return 8;
      return 2;
    },
    draw(ctx, t) {
      scene(ctx, t);
      const dark = t < T_TURN || (t >= T_OFFER && t < T_END);
      K.watermark(ctx, dark ? C.white : C.ink, 0.6);
      K.grain(ctx, t, 0.03, t > 13.5);
    },
  };
})();
