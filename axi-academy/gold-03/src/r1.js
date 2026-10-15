// Gold 03 · reel 1 — hook · the four shapes · the ounce · troy vs ordinary · karat ring · mithqal · the worked example.
(function (G) {
  const A = G.AX, F = G.FILM, R = G.REEL;
  const { W, H, C, clamp, lerp, hexA, txt, lat, mixHex } = A;
  const { w, sfx } = F;
  const { P, q8, beatAt, BEAT, GRID0, xo, xi, xio, E, EI, EIO, crit, outP, act, slat, slatRow, textW, shape, mixPts, fillPts, discs, chipF, tokF, popE, arrowF, roll, LABELS } = R;
  const Q = (p, k) => q8(w(p, k));
  const hit = (t, g = 0.22) => { sfx(t - 0.01, 'impact', g); sfx(t - 0.06, 'whoosh', g * 0.6, { d: 0.35 }); };
  const beatPulse = (t) => { const ph = (t - GRID0) / BEAT; return Math.exp(-(ph - Math.floor(ph)) * 7); };
  const sc = (t, t0) => E(t, t0, 0.38);                                  // scale-in progress (expo, no overshoot)
  // draw a shape at progress k (0 → 1) scaling from its centre
  const shp = (ctx, kind, cx, cy, r, col, k, o = {}) => { if (k <= 0) return; fillPts(ctx, shape(kind, cx, cy, r * k, o), col); };

  // ================================================================ HOOK · «شكد لوت واحد يساوي من الذهب؟»
  // the logo's gold bar turns flat, becomes a band carrying the question, a second band sweeps in, both flood the frame gold
  const H1 = { split: Q(0, 0), b2: q8(w(0, 3) - 0.3), fill: q8(w(1, 0) - 0.45) };
  LABELS.push([2.1, 'أرقام الذهب']);
  sfx(2.06, 'whoosh', 0.14, { d: 0.4 }); sfx(H1.split, 'pop', 0.16, { f: 700 }); sfx(H1.b2, 'whoosh', 0.14, { d: 0.35 }); hit(H1.fill + 0.35, 0.28);
  act({ name: 'hook', t0: 2.05, din: 0, enter: 'none', field: null, t1: H1.fill + 0.6, draw(ctx, t) {
    const ang = (Math.PI / 2) * (1 - EIO(t, 2.05, 0.5)); const L = lerp(200, W + 60, E(t, 2.12, 0.42));
    const grow = E(t, H1.split, 0.4); const y1 = lerp(540, 420, grow); const th1 = lerp(16, 210, grow);
    const fill = EIO(t, H1.fill, 0.5);
    ctx.save(); ctx.fillStyle = P.gold;
    if (grow <= 0) { ctx.translate(960, 540); ctx.rotate(ang); ctx.fillRect(-L / 2, -8, L, 16); ctx.restore(); return; }
    // band 1 (from the bar), band 2 sweeping in from the left; both grow until they meet the frame edges
    const top1 = lerp(y1 - th1 / 2, -10, fill), bot1 = lerp(y1 + th1 / 2, 545, fill);
    ctx.fillRect(-10, top1, W + 20, bot1 - top1);
    const sw = E(t, H1.b2, 0.42); if (sw > 0) { const top2 = lerp(555, 540, fill), bot2 = lerp(765, H + 10, fill); ctx.fillRect(-10, top2, (W + 20) * sw, bot2 - top2); }
    ctx.restore();
    const out = H1.fill - 0.05;
    slatRow(ctx, [{ s: 'شكد', t: Q(0, 0) }, { s: 'لوت', t: Q(0, 1) }, { s: 'واحد', t: Q(0, 2) }], 960, 466, 124, t, { align: 'center', color: P.ink, out });
    slatRow(ctx, [{ s: 'يساوي', t: Q(0, 3) }, { s: 'من', t: Q(0, 4) }, { s: 'الذهب؟', t: Q(0, 5) }], 960, 706, 124, t, { align: 'center', color: P.ink, out });
  } });

  // ================================================================ THE FOUR NUMBERS · ounce ○ gram □ mithqal ⬡ lot ≡
  const T2 = { kick: Q(1, 0), head: Q(1, 3), head2: Q(1, 4), oz: Q(2, 0), g: Q(3, 0), m: Q(4, 0), lot: Q(5, 0), contract: Q(6, 2), exit: q8(w(7, 0) - 0.55) };
  const SX = [1500, 1120, 740, 360], SY = 500, SN = ['أونصة', 'غرام', 'مثقال', 'لوت'], ST = [T2.oz, T2.g, T2.m, T2.lot];
  [T2.kick, T2.head, T2.head2].forEach((tt) => sfx(tt, 'pop', 0.1, { f: 620 }));
  ST.forEach((tt, i) => { sfx(tt, 'snap', 0.16, { pan: +((SX[i] - 960) / 960 * 0.5).toFixed(2) }); sfx(tt + 0.02, 'pop', 0.12, { f: 520 + i * 120 }); });
  sfx(T2.contract, 'pop', 0.14, { f: 900 });
  function lotIcon(ctx, cx, cy, k, t) { if (k <= 0) return; const list = Array.from({ length: 6 }, (_, i) => ({ r: 92 * k, h: 16 * k, top: i % 2 ? P.white : P.ink, side: P.ink })); discs(ctx, cx, cy + 60 * k, list, 0.28, { gap: 2 * k }); }
  act({ name: 'four', t0: H1.fill + 0.5, din: 0, enter: 'none', field: 'gold', t1: T2.exit + 0.9, draw(ctx, t) {
    slat(ctx, 'بهذا الدرس', 960, 350, 52, t, T2.kick, { w: 'S', color: P.ink, out: T2.oz - 0.3 });
    slatRow(ctx, [{ s: 'أرقام', t: T2.head }, { s: 'الذهب', t: T2.head2 }], 960, 590, 200, t, { align: 'center', color: P.ink, out: T2.oz - 0.3 });
    const ex = EIO(t, T2.exit, 0.55); const bp = 1 + 0.04 * beatPulse(t) * (t > T2.oz ? 1 : 0);
    // the ounce circle travels to the centre and grows; the others shrink away
    const cx0 = lerp(SX[0], 960, ex), r0 = lerp(130, 230, ex);
    shp(ctx, 'circle', cx0, lerp(SY, 540, ex), r0 * bp, P.ink, sc(t, ST[0]));
    const k = 1 - EI(t, T2.exit, 0.3);
    shp(ctx, 'square', SX[1], SY, 120 * bp, P.white, sc(t, ST[1]) * k, { rot: (1 - sc(t, ST[1])) * Math.PI / 4 });
    shp(ctx, 'hex', SX[2], SY, 135 * bp, P.slate, sc(t, ST[2]) * k);
    lotIcon(ctx, SX[3], SY - 10, sc(t, ST[3]) * k * bp, t);
    SN.forEach((s, i) => slat(ctx, s, SX[i], 720, 58, t, ST[i], { w: 'S', color: P.ink, out: T2.exit - 0.2 }));
    chipF(ctx, 'العقد', SX[3], 800, { size: 30, p: popE(t, T2.contract) * outP(t, T2.exit - 0.2, 0.25) });
  } });

  // ================================================================ THE OUNCE · «سعر الذهب العالمي بالدولار الأمريكي لكل أونصة»
  // the gold field contracts into a ring around the ounce, the ring tightens onto it
  const T3 = { in: T2.exit + 0.25, head: Q(7, 0), usd: Q(7, 3), am: Q(7, 4), per: Q(7, 5), oz: Q(7, 6), slice: Q(8, 0), exit: Q(8, 0) + 0.5 };
  hit(T3.in, 0.2); sfx(T3.usd, 'pop', 0.16, { f: 760 }); sfx(T3.per, 'tick', 0.1, { f: 2400 }); sfx(T3.oz, 'pop', 0.12, { f: 900 });
  act({ name: 'ounce', t0: T3.in, din: 0.6, enter: 'contract', ex: 960, ey: 540, r1: 300, field: 'paper', t1: T3.exit + 0.1, draw(ctx, t) {
    const ring = lerp(300, 230, E(t, T3.in + 0.55, 0.45)); if (ring > 231) shp(ctx, 'circle', 960, 540, ring, P.gold, 1);
    const sl = t > T3.slice ? 1 : 0; if (!sl) shp(ctx, 'circle', 960, 540, 230 * (1 + 0.03 * beatPulse(t)), P.ink, 1);
    // a gold marker steps round the ounce on every beat
    const b = beatAt(t); const an = -Math.PI / 2 + (b % 8) * Math.PI / 4; if (t > T3.in + 0.6 && !sl) { ctx.fillStyle = P.gold; ctx.fillRect(960 + Math.cos(an) * 262 - 9, 540 + Math.sin(an) * 262 - 9, 18, 18); }
    if (!sl) { slat(ctx, '$', 960, 610, 200, t, T3.usd, { w: 800, color: P.white, n: 5 }); }
    slatRow(ctx, [{ s: 'سعر', t: T3.head }, { s: 'الذهب', t: Q(7, 1) }, { s: 'العالمي', t: Q(7, 2) }], 960, 205, 78, t, { align: 'center', w: 'S', color: P.ink, out: T3.slice });
    slatRow(ctx, [{ s: 'دولار', t: T3.usd }, { s: 'لكل', t: T3.per }, { s: 'أونصة', t: T3.oz }], 960, 900, 64, t, { align: 'center', w: 'S', color: P.ink, out: T3.slice });
    tokF(ctx, 'USD', 960, 798, { size: 28, p: popE(t, T3.am) * outP(t, T3.slice, 0.2) });
  } });

  // ================================================================ TROY · 31.1 g vs 28.35 g · +10 % · dividing by the wrong ounce
  const T4 = { slice: T3.slice, used: Q(8, 1), name: Q(8, 4), troy: Q(8, 5), city: Q(9, 3), w: Q(10, 0), n311: Q(10, 1), g1: Q(10, 2), not: Q(11, 0), ord: Q(11, 2), n2835: Q(11, 5), g2: Q(11, 6),
    heavy: Q(12, 2), pct: Q(12, 4), div: Q(13, 1), price: Q(13, 2), w2: Q(13, 4), up: Q(14, 2), real: Q(14, 4), exit: q8(w(15, 0) - 0.4) };
  LABELS.push([T4.slice, 'أونصة تروي']);
  sfx(T4.slice, 'whoosh', 0.16, { d: 0.45 }); sfx(T4.slice + 0.02, 'stretch', 0.08); [T4.name, T4.troy].forEach((tt) => sfx(tt, 'slam', 0.12));
  sfx(T4.city, 'pop', 0.14, { f: 680 }); sfx(T4.w, 'pop', 0.16, { f: 700 }); sfx(T4.n311, 'slam', 0.14); sfx(T4.ord, 'pop', 0.16, { f: 600 }); sfx(T4.n2835, 'slam', 0.12);
  sfx(T4.heavy - 0.1, 'stretch', 0.14); sfx(T4.pct, 'pop', 0.18, { f: 980 }); sfx(T4.div, 'whoosh', 0.12, { d: 0.4 }); sfx(T4.up, 'buzz', 0.1); sfx(T4.real, 'pop', 0.14, { f: 520 });
  const RT = 196, RO = 196 * Math.sqrt(28.35 / 31.1);
  const BX = 1700, BLT = 31.1 * 40, BLO = 28.35 * 40; // bars, right-aligned (RTL)
  act({ name: 'troy', t0: T4.slice - 0.02, din: 0, enter: 'none', field: null, t1: T4.exit + 0.65, draw(ctx, t) {
    // the ounce, sliced into strips that fly off to both sides
    if (t < T4.slice + 0.8) { const n = 9; for (let k = 0; k < n; k++) { const y0 = 540 - 230 + k * 460 / n, y1 = y0 + 460 / n - 6; const mid = (y0 + y1) / 2 - 540; const half = Math.sqrt(Math.max(0, 230 * 230 - mid * mid)); const off = EI(t, T4.slice + k * 0.025, 0.5) * 1500 * (k % 2 ? 1 : -1); ctx.fillStyle = P.ink; ctx.fillRect(960 - half + off, y0, half * 2, y1 - y0); } }
    slatRow(ctx, [{ s: 'الأونصة', t: T4.slice + 0.1 }, { s: 'المستخدمة', t: T4.used }, { s: 'بالذهب', t: Q(8, 2) }], 960, 360, 58, t, { align: 'center', w: 'S', color: P.slate, out: T4.w - 0.3 });
    slatRow(ctx, [{ s: 'أونصة', t: T4.name }, { s: 'تروي', t: T4.troy }], 960, 600, 210, t, { align: 'center', color: P.ink, out: T4.w - 0.3 });
    // «تروا · فرنسا» with a pin made of a circle and a triangle
    const pin = E(t, T4.city, 0.35) * outP(t, T4.w - 0.3, 0.25); if (pin > 0) { const px = 1130, py = 770; fillPts(ctx, shape('tri', px, py - 4, 34 * pin, { rot: Math.PI }), P.gold); shp(ctx, 'circle', px, py - 26, 22, P.gold, pin); shp(ctx, 'circle', px, py - 26, 8, P.paper, pin); chipF(ctx, 'مدينة تروا · فرنسا', 900, 770, { size: 30, p: pin }); }
    // the two ounces → bars
    const bars = EIO(t, T4.heavy - 0.15, 0.6); const divP = EIO(t, T4.div, 0.6);
    const lenT = lerp(BLT, BLO, divP), lenO = lerp(BLO, BLT, divP); // dividing flips it: the lighter divisor gives the pricier gram
    const ct = sc(t, T4.w), co = sc(t, T4.ord);
    const ex = outP(t, T4.exit - 0.1, 0.3);
    if (ct > 0 && ex > 0) {
      ctx.save(); ctx.globalAlpha *= ex;
      // once the morph lands, the bars are exact rectangles (the sampled polygon would clip their corners)
      if (bars >= 0.999) { ctx.fillStyle = P.gold; ctx.fillRect(BX - lenT, 368, lenT, 124); ctx.fillStyle = P.slate; ctx.fillRect(BX - lenO, 578, lenO, 124); }
      else {
        const ptsT = mixPts(shape('circle', 1380, 520, RT * ct), shape('rect', BX - lenT / 2, 430, 1, { ax: lenT / 2, ay: 62 }), bars); fillPts(ctx, ptsT, P.gold);
        if (co > 0) { const ptsO = mixPts(shape('circle', 560, 520, RO * co), shape('rect', BX - lenO / 2, 640, 1, { ax: lenO / 2, ay: 62 }), bars); fillPts(ctx, ptsO, P.slate); }
      }
      ctx.restore();
      // labels: over the circles, then inside the bars
      const lc = 1 - bars;
      if (lc > 0) {
        slat(ctx, 'أونصة تروي', 1380, 250, 52, t, T4.w, { w: 'S', color: P.ink, out: T4.heavy - 0.2 });
        slat(ctx, '31.1', 1380, 570, 120, t, T4.n311, { w: 800, color: P.ink, out: T4.heavy - 0.2 }); slat(ctx, 'غرام', 1380, 830, 52, t, T4.g1, { w: 'S', color: P.ink, out: T4.heavy - 0.2 });
        slat(ctx, 'أونصة عادية', 560, 250, 52, t, T4.ord, { w: 'S', color: P.ink, out: T4.heavy - 0.2 });
        slat(ctx, '28.35', 560, 570, 120, t, T4.n2835, { w: 800, color: P.white, out: T4.heavy - 0.2 }); slat(ctx, 'غرام', 560, 830, 52, t, T4.g2, { w: 'S', color: P.ink, out: T4.heavy - 0.2 });
      }
      if (bars > 0.6) {
        const la = xo(clamp((bars - 0.6) / 0.4)) * ex;
        ctx.save(); ctx.globalAlpha *= la;
        txt(ctx, divP < 0.5 ? 'أونصة تروي · 31.1 g' : 'سعر الغرام ÷ 31.1', BX - 30, 448, { size: 40, w: 'S', color: P.ink });
        txt(ctx, divP < 0.5 ? 'أونصة عادية · 28.35 g' : 'سعر الغرام ÷ 28.35', BX - 30, 658, { size: 40, w: 'S', color: P.white });
        ctx.restore();
        // +10 % at the gold bar's extra length
        const pk = popE(t, T4.pct) * outP(t, T4.div, 0.25); if (pk > 0) { const xa = BX - BLT, xb = BX - BLO; ctx.save(); ctx.globalAlpha *= pk * ex; ctx.fillStyle = P.ink; ctx.fillRect(xa, 356, xb - xa, 6); ctx.fillRect(xa, 346, 6, 26); ctx.fillRect(xb - 6, 346, 6, 26); ctx.restore(); tokF(ctx, '≈ +10%', (xa + xb) / 2, 310, { size: 30, p: pk * ex }); }
        slat(ctx, 'أثقل', 960, 900, 64, t, T4.heavy, { w: 'X', color: P.ink, out: T4.div - 0.1 });
        // dividing by the ordinary ounce makes the gram look dearer
        chipF(ctx, 'أغلى من الحقيقة', BX - lenO - 170, 640, { size: 32, fill: P.red, p: popE(t, T4.up) * ex });
        chipF(ctx, 'الصحيح', BX - lenT - 110, 430, { size: 30, p: popE(t, T4.real) * ex });
      }
    }
  } });

  // ================================================================ KARAT · 24 parts · 24 ≈ pure · 21 = 87.5 %
  const T5 = { in: T4.exit, title: Q(15, 0), parts: Q(16, 2), gold: Q(16, 3), n24: Q(16, 5), k24: Q(17, 1), pure: Q(17, 3), k21: Q(18, 1), pct: Q(19, 0), g: Q(19, 1), exit: q8(w(20, 0) - 0.45) };
  LABELS.push([T5.in + 0.2, 'العيار']);
  hit(T5.in + 0.25, 0.24); sfx(T5.title, 'slam', 0.14); sfx(T5.parts, 'type', 0.08, { d: 0.6, n: 24 }); sfx(T5.gold, 'riser', 0.06, { d: 0.6 }); sfx(T5.n24, 'pop', 0.16, { f: 820 });
  sfx(T5.k24, 'slam', 0.12); sfx(T5.pure, 'chime', 0.12); sfx(T5.k21, 'tick', 0.12, { f: 1800 }); sfx(T5.k21 + 0.125, 'tick', 0.12, { f: 1600 }); sfx(T5.k21 + 0.25, 'tick', 0.12, { f: 1400 }); sfx(T5.pct, 'slam', 0.16);
  const RC = { x: 1310, y: 560, r0: 150, r1: 252 };
  function ring(ctx, t, nGold, k = 1) {
    for (let i = 0; i < 24; i++) {
      const vis = E(t, T5.parts + i * 0.018, 0.25) * k; if (vis <= 0) continue; const a0 = -Math.PI / 2 + i * Math.PI / 12 + 0.02, a1 = a0 + Math.PI / 12 - 0.04;
      const r0 = RC.r0, r1 = lerp(RC.r0, RC.r1, vis); ctx.beginPath(); ctx.arc(RC.x, RC.y, r1, a0, a1); ctx.arc(RC.x, RC.y, r0, a1, a0, true); ctx.closePath();
      const g = E(t, T5.gold + i * 0.022, 0.2) * (i < nGold(t, i) ? 1 : 0); ctx.fillStyle = g > 0.5 ? P.gold : hexA(P.white, 0.22); ctx.fill();
    }
  }
  const gold21 = (t, i) => (t > T5.k21 + (23 - i) * 0.125 && i >= 21 ? 0 : 24);
  act({ name: 'karat', t0: T5.in, din: 0.5, enter: 'slats', field: 'slate', t1: T5.exit + 0.7, draw(ctx, t) {
    const k = 1 - EI(t, T5.exit, 0.35);
    ring(ctx, t, gold21, k);
    const n = t < T5.k21 ? 24 : Math.round(roll(t, T5.k21, 0.4, 24, 21)); if (t > T5.n24 - 0.02) slat(ctx, String(n), RC.x, RC.y + 52, 150 * Math.max(0.01, k), t, T5.n24, { w: 800, color: P.white, n: 4 });
    slat(ctx, 'العيار', 600, 330, 150, t, T5.title, { color: P.white, out: T5.exit - 0.2 });
    slatRow(ctx, [{ s: 'جزء', t: T5.parts }, { s: 'ذهب', t: T5.gold }, { s: 'من', t: Q(16, 4) }, { s: '24', t: T5.n24 }], 600, 470, 56, t, { align: 'center', w: 'S', color: P.white, out: T5.k24 - 0.15 });
    slatRow(ctx, [{ s: 'عيار', t: T5.k24 }, { s: '24', t: T5.k24 + 0.25 }], 600, 620, 110, t, { align: 'center', color: P.white, out: T5.k21 - 0.2 });
    slat(ctx, '≈ ذهب نقي', 600, 760, 70, t, T5.pure, { w: 'S', color: P.gold, out: T5.k21 - 0.2 });
    slatRow(ctx, [{ s: 'عيار', t: T5.k21 }, { s: '21', t: T5.k21 + 0.25 }], 600, 620, 110, t, { align: 'center', color: P.white, out: T5.exit - 0.2 });
    slat(ctx, '87.5%', 600, 790, 140, t, T5.pct, { w: 800, color: P.gold, out: T5.exit - 0.2 });
    slat(ctx, 'ذهب', 320, 790, 60, t, T5.g, { w: 'S', color: P.white, out: T5.exit - 0.2 });
  } });

  // ================================================================ MITHQAL · 5 g in the Iraqi market · may differ elsewhere
  const T6 = { in: T5.exit + 0.1, title: Q(20, 0), iraq: Q(20, 5), five: Q(20, 6), grams: Q(20, 7), diff: Q(21, 2), exit: q8(w(22, 0) - 0.45) };
  LABELS.push([T6.in + 0.2, 'المثقال']);
  hit(T6.in + 0.3, 0.22); sfx(T6.title, 'slam', 0.12); sfx(T6.iraq, 'pop', 0.14, { f: 700 }); for (let i = 0; i < 5; i++) sfx(T6.five + i * 0.125, 'pop', 0.1, { f: 600 + i * 90 }); sfx(T6.diff, 'glitch', 0.08);
  act({ name: 'mithqal', t0: T6.in, din: 0.55, enter: 'hex', ex: RC.x, ey: RC.y, r0: 120, field: 'paper', t1: T6.exit + 0.7, draw(ctx, t) {
    const k = 1 - EI(t, T6.exit, 0.35);
    shp(ctx, 'hex', RC.x, RC.y, 230 * k * (1 + 0.03 * beatPulse(t)), P.gold, 1);
    for (let i = 0; i < 5; i++) { const g = E(t, T6.five + i * 0.125, 0.3) * k; if (g <= 0) continue; const flick = t > T6.diff && i === 4 ? (beatAt(t) % 2 ? 1 : 0.25) : 1; const x = RC.x + (i - 2) * 72, y = lerp(RC.y - 420, RC.y, g); ctx.save(); ctx.globalAlpha *= flick; ctx.fillStyle = P.ink; ctx.fillRect(x - 27, y - 27, 54, 54); ctx.restore(); }
    slat(ctx, 'المثقال', 600, 330, 150, t, T6.title, { color: P.ink, out: T6.exit - 0.2 });
    chipF(ctx, 'السوق العراقي', 600, 470, { size: 34, p: popE(t, T6.iraq) * outP(t, T6.exit - 0.2, 0.25) });
    slat(ctx, '5', 720, 700, 200, t, T6.five, { w: 800, color: P.ink, out: T6.exit - 0.2 });
    slat(ctx, 'غرامات', 520, 690, 80, t, T6.grams, { w: 'S', color: P.ink, out: T6.exit - 0.2 });
    chipF(ctx, 'وبدول ثانية ممكن يختلف', 600, 840, { size: 30, line: P.red, color: P.ink, p: popE(t, T6.diff) * outP(t, T6.exit - 0.2, 0.25) });
  } });

  // ================================================================ THE WORKED EXAMPLE · $4,000/oz → $128.60/g → ≈ $563 per 21k mithqal → the jeweller's price
  const T7 = { in: T6.exit + 0.05, chip: Q(22, 0), oz: Q(23, 1), p4k: Q(23, 3), g: Q(24, 0), p128: Q(24, 4), p60: Q(24, 6), m: Q(25, 0), p563: Q(26, 1), only: Q(27, 1), not: Q(28, 0),
    why: Q(29, 0), add: Q(30, 2), work: Q(30, 3), profit: Q(30, 4), type: Q(31, 1), fx: Q(32, 1), exit: q8(w(33, 0) - 0.4) };
  LABELS.push([T7.in + 0.2, 'مثال افتراضي']);
  hit(T7.in + 0.25, 0.22); sfx(T7.chip, 'pop', 0.12, { f: 660 }); sfx(T7.oz, 'snap', 0.14); sfx(T7.p4k, 'type', 0.08, { d: 0.4, n: 5 }); sfx(T7.g - 0.05, 'whoosh', 0.1, { d: 0.3 }); sfx(T7.g, 'snap', 0.14);
  sfx(T7.p128, 'type', 0.08, { d: 0.4, n: 4 }); sfx(T7.p60, 'tick', 0.12, { f: 2200 }); sfx(T7.m - 0.05, 'whoosh', 0.1, { d: 0.3 }); sfx(T7.m, 'snap', 0.14); sfx(T7.p563, 'type', 0.08, { d: 0.4, n: 4 });
  sfx(T7.only, 'stretch', 0.1); sfx(T7.not, 'buzz', 0.08); sfx(T7.why, 'whoosh', 0.12, { d: 0.4 }); sfx(T7.add, 'slam', 0.12); sfx(T7.work, 'slam', 0.12); sfx(T7.profit, 'slam', 0.12); sfx(T7.type, 'pop', 0.12, { f: 640 }); sfx(T7.fx, 'pop', 0.12, { f: 760 });
  const EX = [1450, 960, 470], EY = 520;
  act({ name: 'example', t0: T7.in, din: 0.5, enter: 'slats', field: 'gold', t1: T7.exit + 0.7, draw(ctx, t) {
    const k = 1 - EI(t, T7.why - 0.1, 0.35); const kk = 1 - EI(t, T7.exit, 0.3);
    chipF(ctx, 'مثال تعليمي افتراضي', 960, 200, { size: 30, line: P.ink, color: P.ink, p: popE(t, T7.chip) * k });
    // ounce → gram → mithqal
    if (k > 0) {
      shp(ctx, 'circle', EX[0], EY, 150, P.ink, sc(t, T7.oz) * k);
      shp(ctx, 'square', EX[1], EY, 112, P.white, sc(t, T7.g) * k);
      shp(ctx, 'hex', EX[2], EY, 155, P.slate, sc(t, T7.m) * k);
      ctx.save(); ctx.globalAlpha *= k;
      slat(ctx, '$4,000', EX[0], EY + 22, 62, t, T7.p4k, { w: 800, color: P.white, n: 4 });
      slat(ctx, '$' + (t < T7.p60 ? '128' : '128.60'), EX[1], EY + 20, 54, t, T7.p128, { w: 800, color: P.ink, n: 4 });
      slat(ctx, '≈ $563', EX[2], EY + 20, 54, t, T7.p563, { w: 800, color: P.white, n: 4 });
      arrowF(ctx, EX[0] - 175, EY, EX[1] + 140, EY, E(t, T7.g - 0.15, 0.3), { color: P.ink }); tokF(ctx, '÷ 31.1', (EX[0] + EX[1]) / 2, EY - 60, { size: 26, p: popE(t, T7.g) });
      arrowF(ctx, EX[1] - 140, EY, EX[2] + 175, EY, E(t, T7.m - 0.15, 0.3), { color: P.ink }); tokF(ctx, '× 5 × 87.5%', (EX[1] + EX[2]) / 2, EY - 60, { size: 24, p: popE(t, T7.m) });
      slat(ctx, 'أونصة', EX[0], 760, 50, t, T7.oz, { w: 'S', color: P.ink });
      slat(ctx, 'غرام نقي', EX[1], 760, 50, t, T7.g, { w: 'S', color: P.ink });
      slat(ctx, 'مثقال عيار 21', EX[2], 760, 50, t, T7.m, { w: 'S', color: P.ink });
      // «هاي قيمة الذهب نفسه بس، مو سعر المحل»
      const br = E(t, T7.only, 0.45); if (br > 0) { ctx.fillStyle = P.ink; const xa = EX[2] - 170, xb = lerp(xa, EX[0] + 170, br); ctx.fillRect(xa, 800, xb - xa, 5); ctx.fillRect(xa, 800, 5, -22); if (br > 0.98) ctx.fillRect(xb - 5, 800, 5, -22); }
      slat(ctx, 'قيمة الذهب نفسه بس', 960, 862, 46, t, T7.only, { w: 'S', color: P.ink });
      ctx.restore();
      chipF(ctx, 'مو سعر المحل', 1500, 862, { size: 30, fill: P.red, p: popE(t, T7.not) * k });
    }
    // the jeweller's price: gold value + workmanship + the merchant's profit
    if (t > T7.why - 0.2) {
      ctx.save(); ctx.globalAlpha *= kk;
      slatRow(ctx, [{ s: 'ليش', t: T7.why }, { s: 'سعر', t: Q(29, 1) }, { s: 'الصايغ', t: Q(29, 2) }, { s: 'يختلف؟', t: Q(29, 3) }], 600, 300, 76, t, { align: 'center', w: 'S', color: P.ink });
      const bx = 1300, bw = 260, base = 820; const h0 = 250 * E(t, T7.why + 0.1, 0.4), h1 = 120 * E(t, T7.work, 0.35), h2 = 90 * E(t, T7.profit, 0.35);
      ctx.fillStyle = P.white; ctx.fillRect(bx - bw / 2, base - h0, bw, h0);
      ctx.fillStyle = P.slate; ctx.fillRect(bx - bw / 2, base - h0 - h1, bw, h1);
      ctx.fillStyle = P.ink; ctx.fillRect(bx - bw / 2, base - h0 - h1 - h2, bw, h2);
      ctx.restore();
      ctx.save(); ctx.globalAlpha *= kk;
      slat(ctx, 'قيمة الذهب', 1300, 820 - 110, 40, t, T7.why + 0.2, { w: 'S', color: P.ink });
      slat(ctx, 'المصنعية', 1300, 820 - 250 - 45, 38, t, T7.work, { w: 'S', color: P.white });
      slat(ctx, 'ربح التاجر', 1300, 820 - 370 - 30, 36, t, T7.profit, { w: 'S', color: P.white });
      const tb = E(t, T7.profit + 0.3, 0.4); if (tb > 0) { ctx.fillStyle = P.ink; ctx.fillRect(1470, 820 - 460 * tb, 5, 460 * tb); }
      slat(ctx, 'سعر المحل', 1620, 600, 44, t, T7.profit + 0.35, { w: 'S', color: P.ink });
      ctx.restore();
      chipF(ctx, 'نوع الذهب', 600, 500, { size: 34, p: popE(t, T7.type) * kk });
      chipF(ctx, 'سعر صرف الدولار بالدينار', 600, 610, { size: 34, p: popE(t, T7.fx) * kk });
      tokF(ctx, 'USD/IQD', 600, 710, { size: 30, p: popE(t, T7.fx + 0.25) * kk });
    }
  } });
  G.REEL.T1 = { H1, T2, T3, T4, T5, T6, T7 };
})(typeof window !== 'undefined' ? window : globalThis);
