// AD 1 — «شنو راح تتعلّم؟» : what a student gets from Axi Academy (15 s, 9:16, 128 bpm grid).
// Hook in Iraqi dialect → the stacked logo → six module cards (taken from the real lesson series) tick on the beat →
// «من الصفر إلى الاحتراف» with the red tip as the full stop → X sting → CTA card with the risk strip.
(function () {
  const { W, H, C, B, BEAT, clamp, lerp, inv, smooth, eo, ei, eio, co, cio, qo, sp, spring, shake, backOut, cubicInOut, expoOut } = K;
  const { ar, arW, lat, latW, arWords, arUnits, glass, rr, disc, ring, ripple, sparks } = K;

  // ---- timeline ----
  const T_HOOK = 0, T_BRAND = B(4.5), T_PATH = B(6.5), CARD_DT = B(2.5), T_ALL = B(20), T_PAY = B(21.5), T_X = B(24), T_END = B(25.6);
  const MODULES = [
    { t: 'أساسيات الفوركس', s: 'ما هو الفوركس ولماذا نتداوله — من الصفر', icon: 'coins' },
    { t: 'قراءة الرسوم البيانية', s: 'الشموع وسعر الشراء والبيع', icon: 'candles' },
    { t: 'التحليل الفني والأساسي', s: 'قراءة السوق والأخبار', icon: 'trend' },
    { t: 'بناء استراتيجية تداول', s: 'خطة واضحة قبل كل صفقة', icon: 'target' },
    { t: 'قبل أول إيداع', s: 'تدرّب على حساب تجريبي وتجنّب الأخطاء', icon: 'shield' },
    { t: 'سلسلة الذهب', s: 'كيف تتداول الذهب وما يحرّك سعره', icon: 'gold' },
  ];
  const cardT = (k) => T_PATH + k * CARD_DT;
  const CARD_X = 100, CARD_W = 880, CARD_H = 172, CARD_Y0 = 420, CARD_P = 196;

  // ---- background life ----
  function candlesBg(ctx, t, a) {  // faint drifting candlesticks for the dark hook
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = C.white;
    for (let i = 0; i < 16; i++) {
      const x = ((i * 78 + t * 40) % (W + 160)) - 80, base = 1520 - i * 18 - 60 * Math.sin(i * 1.3), h = 60 + 70 * K.hash(i * 3.1);
      ctx.fillRect(x - 2, base - h - 40, 4, h + 80); ctx.fillRect(x - 14, base - h, 28, h);
    }
    ctx.restore();
  }
  function bigX(ctx, t, a) { if (a > 0) K.xmark(ctx, W * 0.5 + 120 * Math.sin(t * 0.3), 980 + 40 * Math.cos(t * 0.25), 1500, C.white, 0.06 * a); }

  // ---- icons (white line art, centred at x,y, size ~84) ----
  function icon(ctx, kind, x, y, u) {
    ctx.save(); ctx.translate(x, y); ctx.scale(lerp(0.6, 1, backOut(u, 2)), lerp(0.6, 1, backOut(u, 2))); ctx.globalAlpha *= clamp(u * 2);
    ctx.strokeStyle = C.white; ctx.fillStyle = C.white; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (kind === 'coins') {
      ring(ctx, -14, 4, 30, 5, C.white); ctx.save(); ctx.fillStyle = 'rgba(20,22,26,1)'; ctx.beginPath(); ctx.arc(14, -6, 30, 0, Math.PI * 2); ctx.fill(); ctx.restore(); ring(ctx, 14, -6, 30, 5, C.white);
      lat(ctx, '$', 14, 8, { w: 700, size: 36 }); lat(ctx, '€', -26, 18, { w: 700, size: 22, alpha: 0.8 });
    } else if (kind === 'candles') {
      [[-30, -10, 30, 0], [0, -26, 18, 1], [30, -36, 8, 0]].forEach(([cx, top, bot, red]) => {
        ctx.fillStyle = red ? C.red : C.white; ctx.fillRect(cx - 2, top - 14, 4, bot - top + 28); ctx.fillRect(cx - 10, top, 20, bot - top);
      });
    } else if (kind === 'trend') {
      ctx.beginPath(); ctx.moveTo(-40, 26); ctx.lineTo(-14, 2); ctx.lineTo(4, 14); ctx.lineTo(38, -24); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(22, -26); ctx.lineTo(40, -26); ctx.lineTo(40, -8); ctx.stroke();
      ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-42, 40); ctx.lineTo(42, 40); ctx.stroke();
    } else if (kind === 'target') {
      ring(ctx, 0, 0, 36, 5, C.white); ring(ctx, 0, 0, 20, 5, C.white); disc(ctx, 0, 0, 6, C.red);
      ctx.beginPath(); ctx.moveTo(0, -48); ctx.lineTo(0, -38); ctx.moveTo(0, 38); ctx.lineTo(0, 48); ctx.moveTo(-48, 0); ctx.lineTo(-38, 0); ctx.moveTo(38, 0); ctx.lineTo(48, 0); ctx.stroke();
    } else if (kind === 'shield') {
      ctx.beginPath(); ctx.moveTo(0, -42); ctx.lineTo(34, -28); ctx.quadraticCurveTo(34, 22, 0, 44); ctx.quadraticCurveTo(-34, 22, -34, -28); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-14, 2); ctx.lineTo(-3, 13); ctx.lineTo(16, -10); ctx.stroke();
    } else if (kind === 'gold') {
      ctx.beginPath(); ctx.moveTo(-40, 22); ctx.lineTo(-26, -14); ctx.lineTo(26, -14); ctx.lineTo(40, 22); ctx.closePath();
      ctx.fillStyle = K.hexA(C.gold, 0.9); ctx.fill(); ctx.stroke();
      ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-20, -4); ctx.lineTo(20, -4); ctx.stroke();
    }
    ctx.restore();
  }

  // ---- one module card (RTL): badge on the right, title + sub, icon on the left ----
  function card(ctx, k, t) {
    const t0 = cardT(k), u = eo(t, t0, 0.55); if (u <= 0) return;
    const y = CARD_Y0 + k * CARD_P, dx = (1 - u) * 380, active = t >= t0 && t < t0 + CARD_DT + 0.1;
    const done = clamp((t - (t0 + 0.42)) / 0.28), wave = Math.exp(-Math.pow((t - (T_ALL + k * 0.08)) / 0.09, 2));
    const out = co(t, T_PAY - 0.15 + (5 - k) * 0.025, 0.3);
    ctx.save(); ctx.translate(dx, -out * 900); ctx.globalAlpha *= clamp(u * 1.5) * (1 - out);
    const sc = 1 + (active ? 0.015 * Math.exp(-(t - t0 - 0.3) * 2) : 0) + 0.03 * wave;
    ctx.translate(W / 2, y + CARD_H / 2); ctx.scale(sc, sc); ctx.translate(-W / 2, -(y + CARD_H / 2));
    glass(ctx, CARD_X, y, CARD_W, CARD_H, { stroke: active || wave > 0.3 ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.2)' });
    // badge: number → red check
    const bx = CARD_X + CARD_W - 78, by = y + CARD_H / 2;
    ring(ctx, bx, by, 44, 3, C.white, 0.85);
    if (done > 0) { disc(ctx, bx, by, 44 * backOut(done, 2.2), C.red); }
    if (done < 1) lat(ctx, String(k + 1).padStart(2, '0'), bx, by + 16, { w: 700, size: 44, alpha: 1 - done });
    if (done > 0) {
      ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const p = clamp(done * 1.3); ctx.beginPath(); ctx.moveTo(bx - 18, by + 2);
      if (p < 0.4) ctx.lineTo(bx - 18 + 12 * p / 0.4, by + 2 + 12 * p / 0.4); else { ctx.lineTo(bx - 6, by + 14); ctx.lineTo(bx - 6 + 26 * (p - 0.4) / 0.6, by + 14 - 30 * (p - 0.4) / 0.6); }
      ctx.stroke(); ctx.restore();
    }
    const tx = bx - 72;
    ar(ctx, MODULES[k].t, tx, y + 76, { w: 700, size: 52, align: 'right' });
    ar(ctx, MODULES[k].s, tx, y + 128, { w: 300, size: 32, align: 'right', alpha: 0.78 });
    icon(ctx, MODULES[k].icon, CARD_X + 80, y + CARD_H / 2, eo(t, t0 + 0.15, 0.5));
    ctx.restore();
  }

  function scene(ctx, t) {
    // ---------- 1 · hook (dark) ----------
    if (t < T_BRAND + 0.1) {
      K.bgDark(ctx); candlesBg(ctx, t, 0.07);
      const hs = shake(t, [0.62], 14, 0.12, 3), out = ei(t, T_BRAND - 0.32, 0.32);
      ctx.save(); ctx.translate(hs.x, hs.y - out * 120); ctx.globalAlpha *= 1 - out;
      // «تريد تتعلّم» written by the red tip sliding along an underline (right → left)
      const L1 = 'تريد تتعلّم', y1 = 760, w1 = arW(ctx, L1, { w: 700, size: 132 }), xr = W / 2 + w1 / 2, xl = W / 2 - w1 / 2;
      const pw = cio(t, 0.1, 0.5), px = lerp(xr + 10, xl - 10, pw);
      if (pw > 0) {
        ctx.save(); ctx.beginPath(); ctx.rect(px, 0, W, H); ctx.clip(); ar(ctx, L1, W / 2, y1, { w: 700, size: 132 }); ctx.restore();
        ctx.save(); ctx.globalAlpha *= 0.9; ctx.fillStyle = C.white; ctx.fillRect(px, y1 + 34, xr + 10 - px, 5); ctx.restore();
      }
      // the tip: drops in, then rides the underline as the pen
      const drop = clamp(t / 0.12), ty = t < 0.12 ? lerp(380, y1 + 36, drop * drop) : y1 + 36;
      const tx = t < 0.12 ? xr + 10 : px, tipA = 1 - inv(1.0, 1.2, t);
      if (tipA > 0) K.nibGroup(ctx, tx, ty - 40, 1.05, { nib: 0, bars: 0, tip: tipA });
      // «التداول؟» slams in red (the one red word)
      const s2 = sp(t, 0.5, 3.2, 0.42);
      if (s2 > 0) {
        const k = lerp(1.7, 1, s2);
        ctx.save(); ctx.translate(W / 2, 950); ctx.scale(k, k); ar(ctx, 'التداول؟', 0, 0, { w: 700, size: 196, color: C.red, alpha: clamp(s2 * 3) }); ctx.restore();
        ripple(ctx, W / 2, 900, t, 0.62, { r0: 80, r1: 620, w: 5, n: 2, a: 0.35 });
      }
      arWords(ctx, 'هاي خطّتك الكاملة', W / 2, 1150, t, { t0: 1.05, st: 0.09, d: 0.5, w: 400, size: 66, alpha: 0.9 });
      // down chevrons
      const ch = eo(t, 1.45, 0.3);
      if (ch > 0) for (let i = 0; i < 2; i++) {
        const yy = 1290 + i * 34 + 14 * Math.sin((t - 1.45) * 9 - i * 0.8);
        ctx.save(); ctx.globalAlpha *= ch * (i ? 0.55 : 0.9); ctx.strokeStyle = C.white; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(W / 2 - 34, yy); ctx.lineTo(W / 2, yy + 26); ctx.lineTo(W / 2 + 34, yy); ctx.stroke(); ctx.restore();
      }
      ctx.restore();
      K.riseWipe(ctx, eio(t, T_BRAND - 0.3, 0.4));
      return;
    }
    // ---------- 2 · brand · 3 · path · 4 · payoff (light) ----------
    if (t < T_X) {
      K.bgLight(ctx); bigX(ctx, t, smooth(inv(T_BRAND, T_BRAND + 0.5, t)));
      // 2 · the stacked logo + tagline
      const inB = sp(t, T_BRAND, 2.4, 0.55), outB = ei(t, T_PATH - 0.25, 0.3);
      if (t < T_PATH + 0.1) {
        ctx.save(); ctx.translate(0, -outB * 520); ctx.globalAlpha *= 1 - outB;
        const s = 0.86 * lerp(0.7, 1, inB);
        K.stacked(ctx, W / 2, 540 + (1 - inB) * 60, s, { nib: clamp(inB * 2), tip: clamp(inB * 2), bars: clamp(inB * 2), axi: eo(t, T_BRAND + 0.12, 0.45), acad: eo(t, T_BRAND + 0.22, 0.45) });
        arWords(ctx, 'كل ما تحتاجه لتبدأ التداول بثقة', W / 2, 1170, t, { t0: T_BRAND + 0.3, st: 0.05, d: 0.45, w: 600, size: 54, color: C.ink });
        ctx.restore();
      }
      // 3 · header + module cards
      const hdr = eo(t, T_PATH - 0.05, 0.5) * (1 - co(t, T_PAY - 0.2, 0.3));
      if (hdr > 0) { ctx.save(); ctx.globalAlpha *= hdr; ctx.translate(0, (1 - hdr) * -40); ar(ctx, 'ماذا ستتعلّم؟', W / 2, 330, { w: 700, size: 84 }); ctx.restore(); }
      for (let k = 0; k < MODULES.length; k++) card(ctx, k, t);
      // 4 · payoff: «من الصفر / إلى الاحتراف.» — the tip lands as the full stop
      if (t >= T_PAY - 0.05) {
        const a1 = sp(t, T_PAY, 3, 0.5), a2 = sp(t, T_PAY + 0.18, 3, 0.5);
        ctx.save(); ctx.translate(W / 2, 700); ctx.scale(lerp(1.4, 1, a1), lerp(1.4, 1, a1)); ar(ctx, 'من الصفر', 0, 0, { w: 700, size: 150, alpha: clamp(a1 * 3) }); ctx.restore();
        const w2 = arW(ctx, 'إلى الاحتراف', { w: 700, size: 150 });
        ctx.save(); ctx.translate(W / 2, 900); ctx.scale(lerp(1.4, 1, a2), lerp(1.4, 1, a2)); ar(ctx, 'إلى الاحتراف', 0, 0, { w: 700, size: 150, alpha: clamp(a2 * 3) }); ctx.restore();
        const ld = T_PAY + 0.42, d = clamp((t - ld + 0.18) / 0.18), tipX = W / 2 - w2 / 2 - 34, tipY = lerp(560, 900 - 70, d * d);
        if (t > ld - 0.18) { K.nibGroup(ctx, tipX, tipY, 1.25, { nib: 0, bars: 0 }); ripple(ctx, tipX, 900 - 20, t, ld, { r0: 10, r1: 120, w: 3, n: 2, a: 0.6 }); }
        arWords(ctx, 'دروس بالعربية خطوة بخطوة', W / 2, 1150, t, { t0: T_PAY + 0.3, st: 0.07, d: 0.45, w: 600, size: 58, color: C.ink });
      }
      return;
    }
    // ---------- 5 · X sting ----------
    if (t < T_END) { K.xSting(ctx, t, T_X, T_END - T_X); return; }
    // ---------- 6 · end card ----------
    K.bgLight(ctx); bigX(ctx, t, 1);
    const e = sp(t, T_END, 2.6, 0.55);
    K.stacked(ctx, W / 2, 300 + (1 - e) * 50, 0.98 * lerp(0.82, 1, e), { nib: clamp(e * 2), tip: clamp(e * 2), bars: clamp(e * 2), axi: eo(t, T_END + 0.1, 0.45), acad: eo(t, T_END + 0.2, 0.45) });
    K.ctaPill(ctx, W / 2, 1010, t, T_END + 0.35, 'سجّل الآن', { tb: B(27) });
    const uu = eo(t, T_END + 0.5, 0.5); if (uu > 0) lat(ctx, 'axi.com/ar', W / 2, 1150 + (1 - uu) * 20, { w: 600, size: 46, color: C.ink, alpha: uu });
    K.riskStrip(ctx, t, T_END, 1235);
  }

  window.FILM = {
    duration: 15,
    blur(t) {
      if (t < 0.3) return 10;
      if (t > 0.45 && t < 0.9) return 10;
      if (t > T_BRAND - 0.35 && t < T_BRAND + 0.45) return 10;
      for (let k = 0; k < 6; k++) if (t > cardT(k) - 0.02 && t < cardT(k) + 0.5) return 8;
      if (t > T_PAY - 0.25 && t < T_PAY + 0.7) return 10;
      if (t > T_X - 0.05 && t < T_X + 0.35) return 10;
      if (t > T_END - 0.05 && t < T_END + 0.6) return 8;
      return 2;
    },
    draw(ctx, t) {
      scene(ctx, t);
      const dark = t < T_BRAND - 0.1 || (t >= T_X && t < T_END);
      K.watermark(ctx, dark ? C.white : C.ink, 0.6);
      K.grain(ctx, t, 0.03, t > 13.5);
    },
  };
})();
