// Gold series · Lesson 01 — File 2: ACT 5 the jewellery shop (Saeed), ACT 6 the maths, ACT 7 safe haven, ACT 8 not a guarantee.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT, GL = G.GL, GK = G.GK, SH = G.SHOT;
  const { W, H, C, clamp, lerp, eo, hexA, txt, lat, mixHex } = A;
  const { w, we, wl, ph, phe, sfx, ksfx } = F;
  const { cio, sp } = SH.util; const { rise, head } = SH.text;
  const P = GL.P;

  // ---------------------------------------------------------------- shared UI for files 2–3
  // chat column: bubbles stack upward like a real chat; older ones scroll out of a masked window
  function chat(ctx, t, items, box, o = {}) {
    const size = o.size || 32, gap = o.gap || 26, lh = size * 1.48, padX = size * 0.8, padY = size * 0.62;
    let Y = 0; const L = items.map((it) => {
      const lines = it.lines; const wmax = Math.max(...lines.map((ln) => K.wordsWidth(ln, { size, w: it.w || 'R' })));
      const bw = Math.min(box.w - 20, wmax + padX * 2), bh = lines.length * lh + padY * 2 - (lh - size * 1.12); const lab = it.label ? size * 1.2 : 0;
      const r = { it, bw, bh, lab, top: Y, t0: (it.label ? it.label[0].t : lines[0][0].t) - 0.1 }; Y += lab + bh + gap; return r;
    });
    // scroll: the newest bubble's bottom rests on the window's bottom line
    let cb = 0, prev = 0; for (const r of L) { const target = r.top + r.lab + r.bh; cb += (target - prev) * FX.springU(t - r.t0, 11, 0.62); prev = target; }
    ctx.save(); ctx.beginPath(); ctx.rect(box.x - 40, box.y, box.w + 80, box.h); ctx.clip();
    for (const r of L) {
      const p = sp(t, r.t0, 14, 0.55); if (p <= 0) continue; const y = box.y + box.h - (cb - r.top); if (y + r.lab + r.bh < box.y - 10 || y > box.y + box.h + 10) continue;
      const side = r.it.side; const bx = side === 'me' ? box.x + box.w - r.bw : box.x;
      if (r.lab) K.words(ctx, r.it.label, side === 'me' ? box.x + box.w - 8 : box.x + K.wordsWidth(r.it.label, { size: size * 0.62, w: 'S' }) + 8, y + size * 0.72, t, { size: Math.round(size * 0.62), w: 'S', color: r.it.labCol || C.slate, mode: 'rise', stagger: 0.01 });
      const by = y + r.lab; const k = Math.min(1.04, p); const ox = side === 'me' ? bx + r.bw : bx, oy = by + r.bh;
      ctx.save(); ctx.translate(ox, oy); ctx.scale(k, k); ctx.translate(-ox, -oy);
      const rr = Math.min(size * 0.9, r.bh / 2);
      if (side === 'me') { ctx.save(); ctx.shadowColor = 'rgba(10,12,16,0.2)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 10; A.roundRect(ctx, bx, by, r.bw, r.bh, [rr, rr, 8, rr]); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore(); }
      else if (side === 'gold') { A.roundRect(ctx, bx, by, r.bw, r.bh, [rr, rr, rr, 8]); ctx.fillStyle = GL.goldFlat(ctx, by, by + r.bh); ctx.fill(); }
      else GL.panel(ctx, bx, by, r.bw, r.bh, rr, { tint: 'rgba(255,255,255,0.66)', shadow: 0.7 });
      const col = side === 'me' ? '#FFFFFF' : side === 'gold' ? '#2B2107' : C.ink;
      r.it.lines.forEach((ln, i) => K.words(ctx, ln, bx + r.bw - padX, by + padY + size * 0.92 + i * lh, t, { size, w: r.it.w || 'R', color: col, mode: 'rise', stagger: 0.012 }));
      ctx.restore();
    }
    ctx.restore();
  }
  // number that rolls between keyframes [[t, v]]
  const roll = (t, keys, d = 0.9) => { t = Math.ceil(t * 60 - 1e-6) / 60; let v = keys[0][1]; for (let i = 1; i < keys.length; i++) v = lerp(v, keys[i][1], cio(t, keys[i][0], d)); return v; };
  const money = (v) => '$' + Math.round(v).toLocaleString('en-US');
  // glass card with a title row
  function gcard(ctx, x, y, w0, h0, o = {}) { GL.panel(ctx, x, y, w0, h0, o.r || 32, { tint: o.tint || 'rgba(255,255,255,0.62)', alpha: o.alpha }); }
  // pop-scale helper around a point
  function popAt(ctx, x, y, p, fn) { if (p <= 0) return; const k = Math.min(1.05, p); ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); fn(); ctx.restore(); }
  // avatar chip «سعيد»
  function avatar(ctx, x, y, s, label, t, o = {}) { // x = right edge
    const wv = A.measure(ctx, label, 30, 'B') + 110; GL.panel(ctx, x - wv, y - 36, wv, 72, 36, { tint: 'rgba(255,255,255,0.7)' });
    const ax = x - 38, ay = y; ctx.fillStyle = o.col ? o.col : GL.goldGrad(ctx, ay - 24, ay + 24); ctx.beginPath(); ctx.arc(ax, ay, 24, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(ax, ay - 6, 8, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.moveTo(ax - 14, ay + 16); ctx.quadraticCurveTo(ax - 14, ay + 3, ax, ay + 3); ctx.quadraticCurveTo(ax + 14, ay + 3, ax + 14, ay + 16); ctx.closePath(); ctx.fill();
    txt(ctx, label, x - 76, y + 11, { size: 30, w: 'B', color: C.ink });
  }
  // dark velvet product card with a chain
  function chainCard(ctx, x, y, w0, h0, kind, t, o = {}) {
    GL.darkCard(ctx, x, y, w0, h0, 30);
    ctx.save(); A.roundRect(ctx, x, y, w0, h0 * 0.58, [30, 30, 0, 0]); ctx.clip(); const g = ctx.createLinearGradient(0, y, 0, y + h0 * 0.58); g.addColorStop(0, '#2B2D33'); g.addColorStop(1, '#16171B'); ctx.fillStyle = g; ctx.fillRect(x, y, w0, h0 * 0.58);
    const sw = Math.sin(t * 1.4 + (kind === 'thin' ? 0 : 1.3)) * 6;
    if (kind === 'thin') GK.chain(ctx, x + w0 - 40, y + 50, x + 40, y + 50, { link: 13, th: 2.4, sag: h0 * 0.36 + sw });
    else GK.chain(ctx, x + w0 - 50, y + 60, x + 50, y + 60, { link: 46, th: 11, sag: h0 * 0.3 + sw });
    ctx.restore();
    if (o.title) txt(ctx, o.title, x + w0 - 28, y + h0 * 0.58 + 54, { size: 30, w: 'B', color: '#FFFFFF', alpha: o.titleA == null ? 1 : o.titleA });
    if (o.sub) txt(ctx, o.sub, x + w0 - 28, y + h0 * 0.58 + 96, { size: 23, color: '#A9AEB4', alpha: o.subA == null ? 1 : o.subA });
    if (o.price) lat(ctx, o.price, x + 28, y + h0 - 32, { size: 40, w: 600, color: P.gold1, alpha: o.priceA == null ? 1 : o.priceA });
  }
  SH.ui = { chat, roll, money, gcard, popAt, avatar, chainCard };

  // ================================================================ ACT 5 · THE SHOP (35.0 → 69.1)
  const T5 = { flood: 35.1, saeed: w(16, 0), fict: w(17, 0), shop: w(18, 0), thin: w(19, 0), p1000: w(20, 1), next: w(21, 0), thick: w(22, 0), oz: w(23, 1), p12k: w(24, 1),
    ask: w(25, 0), q: w(26, 0), ans: w(27, 0), weight: w(28, 3), back: w(29, 0), buy: w(31, 0), today: w(32, 0), hyp: w(33, 0), real: w(34, 0), karat: w(35, 2), work: w(35, 3), out: 69.0 };
  const gSlate = { t0: T5.flood, t1: 69.25, from: { x: 200, y: 560 }, din: 0.38, paint: SH.paint.sw('slate'), dim: 0.35, cover: true };
  SH.grounds.push(gSlate);
  const a4 = SH.sec.find((s) => s.front && s.front.name === 'act4'); if (a4) a4.coverBy = gSlate;
  SH.cam.push([35.0, 1.0, 430, 560], [36.2, 1.0, 960, 540], [49.4, 1.05, 1080, 540], [50.6, 1.05, 940, 540], [68.6, 1.1, 960, 560]);
  sfx(T5.flood, 'whoosh', 0.2, { d: 0.5 }); sfx(T5.flood + 0.05, 'impact', 0.12);
  sfx(T5.saeed - 0.05, 'pop', 0.18, { f: 760 }); sfx(T5.fict, 'tick', 0.12, { f: 2600 }); sfx(T5.shop - 0.1, 'whoosh', 0.14, { d: 0.6 }); sfx(T5.shop + 0.3, 'chime', 0.1);
  sfx(T5.thin - 0.05, 'whoosh', 0.12, { d: 0.35, pan: 0.3 }); sfx(T5.p1000, 'tick', 0.14, { f: 2200 }); sfx(T5.thick - 0.05, 'whoosh', 0.14, { d: 0.35, pan: -0.2 }); sfx(T5.oz, 'bloop', 0.12); sfx(T5.p12k, 'tick', 0.16, { f: 1800 });
  sfx(T5.ask - 0.1, 'pop', 0.16, { f: 880 }); sfx(T5.ans - 0.1, 'pop', 0.16, { f: 620 }); sfx(T5.weight - 0.1, 'stretch', 0.14); sfx(T5.weight + 0.5, 'bloop', 0.12);
  sfx(T5.back - 0.1, 'pop', 0.14, { f: 620 }); sfx(T5.today, 'tick', 0.12, { f: 2400 }); sfx(T5.hyp - 0.05, 'pop', 0.12, { f: 1000 }); sfx(T5.karat, 'tick', 0.1, { f: 2600 }); sfx(T5.work, 'tick', 0.1, { f: 2900 });
  const VIT = { x: 1000, y: 270, w: 820, h: 670 };   // glass vitrine (right half, read first)
  const CARD5 = { w: 360, h: 520 };
  const thinX = VIT.x + VIT.w - 30 - CARD5.w, thickX = VIT.x + 30, cardY = VIT.y + 120;
  const CHAT5 = { x: 110, y: 150, w: 790, h: 640 };
  function act5(ctx, t) {
    if (t < T5.flood - 0.1 || t > T5.out + 0.6) return;
    // Saeed + «شخصية خيالية»
    popAt(ctx, 1810, 200, sp(t, T5.saeed - 0.12, 13, 0.55), () => avatar(ctx, 1810, 200, 1, 'سعيد', t));
    const fp = sp(t, T5.fict - 0.08, 14, 0.6); if (fp > 0) { const wv = A.measure(ctx, 'شخصية خيالية', 24, 'S') + 50; popAt(ctx, 1810 - 190 - wv / 2, 200, fp, () => { A.roundRect(ctx, 1810 - 190 - wv, 178, wv, 44, 22); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6; ctx.stroke(); K.words(ctx, wl(17), 1810 - 190 - 25, 209, t, { size: 24, w: 'S', color: C.ink, mode: 'rise' }); }); }
    // the vitrine
    const vp = cio(t, T5.shop - 0.15, 0.6);
    if (vp > 0) {
      const vh = VIT.h * vp; GL.panel(ctx, VIT.x, VIT.y + VIT.h - vh, VIT.w, vh, 40, { tint: 'rgba(255,255,255,0.4)' });
      ctx.save(); ctx.globalAlpha *= clamp(vp * 2); K.words(ctx, wl(18), VIT.x + VIT.w - 36, VIT.y + 70, t, { size: 36, w: 'S', color: C.ink, mode: 'rise', out: K.outAt(t, T5.weight - 0.45) }); ctx.restore();
      // velvet shelf
      ctx.save(); ctx.globalAlpha *= vp; const sg = ctx.createLinearGradient(0, VIT.y + VIT.h - 70, 0, VIT.y + VIT.h); sg.addColorStop(0, 'rgba(30,32,38,0.0)'); sg.addColorStop(1, 'rgba(30,32,38,0.18)'); ctx.fillStyle = sg; ctx.fillRect(VIT.x + 20, VIT.y + VIT.h - 70, VIT.w - 40, 60); ctx.restore();
    }
    // the two chains (they move onto the scale when the owner explains weight)
    const toScale = cio(t, T5.weight - 0.3, 0.9);
    const thinP = sp(t, T5.thin - 0.1, 12, 0.6), thickP = sp(t, T5.thick - 0.1, 12, 0.6);
    const sc = 1 - toScale * 0.38;
    const SC = { x: VIT.x + VIT.w / 2, y: VIT.y + 250 }; const tilt = 0.16 * cio(t, T5.weight + 0.2, 0.8) + Math.sin((t - T5.weight - 1) * 7) * 0.012 * Math.exp(-Math.max(0, t - T5.weight - 1) * 2) * (t > T5.weight + 1 ? 1 : 0);
    // scale (fades in under the cards as they move)
    let pans = null;
    if (toScale > 0) { ctx.save(); ctx.globalAlpha *= clamp(toScale * 1.5); pans = GK.scale(ctx, SC.x, SC.y, 0.92, -tilt, { ink: C.ink }); ctx.restore(); }
    const panL = pans ? pans.L : [thickX + CARD5.w / 2, cardY], panR = pans ? pans.R : [thinX + CARD5.w / 2, cardY];
    const cx1 = lerp(thinX + CARD5.w / 2, panR[0], toScale), cy1 = lerp(cardY + CARD5.h / 2, panR[1] - CARD5.h * sc / 2 - 4, toScale);
    const cx2 = lerp(thickX + CARD5.w / 2, panL[0], toScale), cy2 = lerp(cardY + CARD5.h / 2, panL[1] - CARD5.h * sc / 2 - 4, toScale);
    popAt(ctx, cx1, cy1, thinP, () => { ctx.save(); ctx.translate(cx1, cy1); ctx.scale(sc, sc); chainCard(ctx, -CARD5.w / 2, -CARD5.h / 2, CARD5.w, CARD5.h, 'thin', t, { title: 'رفيعة ودقيقة', sub: 'الأحلى شكلاً', price: '$1,000', priceA: eo(t, T5.p1000, 0.3), subA: eo(t, T5.thin + 0.8, 0.4) }); ctx.restore(); });
    popAt(ctx, cx2, cy2, thickP, () => { ctx.save(); ctx.translate(cx2, cy2); ctx.scale(sc, sc); chainCard(ctx, -CARD5.w / 2, -CARD5.h / 2, CARD5.w, CARD5.h, 'thick', t, { title: 'أثخن وبسيطة', sub: '≈ 3 أونصات', subA: eo(t, T5.oz, 0.3), price: '$12,000', priceA: eo(t, T5.p12k, 0.3) }); ctx.restore(); });
    // captions that follow the voice (top of the vitrine)
    // the story, word by word (left half, read after the vitrine), cleared before the chat opens
    if (t < T5.ask) {
      const cx = 505;
      rise(ctx, wl(19), 470, t, { size: 46, color: C.ink, w: 'S', cx, out: K.outAt(t, T5.next - 0.5) });
      rise(ctx, wl(20, 0, 2, { map: { 1: { color: P.gold3, w: 'B' }, 2: { color: P.gold3, w: 'B' } } }), 550, t, { size: 46, color: C.slate, w: 'S', cx, out: K.outAt(t, T5.next - 0.5) });
      rise(ctx, wl(21).concat(wl(22)), 470, t, { size: 46, color: C.ink, w: 'S', cx, out: K.outAt(t, ph(23) - 0.5) });
      rise(ctx, wl(23), 470, t, { size: 46, color: C.ink, w: 'S', cx, out: K.outAt(t, T5.ask - 0.35) });
      rise(ctx, wl(24, 0, 3, { map: { 1: { color: P.gold3, w: 'B' }, 2: { color: P.gold3, w: 'B' }, 3: { color: P.gold3, w: 'B' } } }), 550, t, { size: 46, color: C.slate, w: 'S', cx, out: K.outAt(t, T5.ask - 0.35) });
    }
    // chat: Saeed asks, the owner answers
    if (t > T5.ask - 0.4) chat(ctx, t, [
      { side: 'me', label: wl(25), lines: [wl(26, 0, 4, { keepQ: true })] },
      { side: 'them', label: wl(27), lines: [wl(28)], labCol: C.slate },
      { side: 'them', lines: [wl(29).concat(wl(30)), wl(31).concat(wl(32))] },
    ], CHAT5, { size: 34 });
    // the value rule: weight × today's gold price
    const fx = eo(t, T5.buy + 0.2, 0.45);
    if (fx > 0) {
      const y = 860, cx = 505; ctx.save(); ctx.globalAlpha *= fx; GL.panel(ctx, cx - 360, y - 52, 720, 104, 52, { tint: 'rgba(255,255,255,0.6)' });
      txt(ctx, 'الوزن', cx + 250, y + 13, { size: 36, w: 'B', color: C.ink, align: 'center' }); lat(ctx, '×', cx + 150, y + 14, { size: 40, w: 300, color: P.gold3, align: 'center' });
      ctx.restore(); ctx.save(); ctx.globalAlpha *= eo(t, T5.today, 0.4); txt(ctx, 'سعر الذهب ذاك اليوم', cx - 70, y + 13, { size: 36, w: 'B', color: P.gold3, align: 'center' }); ctx.restore();
    }
    // the honest footnote: a hypothetical offer — in reality karat and workmanship matter
    const np = sp(t, T5.hyp - 0.12, 13, 0.6);
    if (np > 0 && t < T5.out) popAt(ctx, 1410, 1000, np, () => {
      const nw = 760; GL.panel(ctx, 1410 - nw / 2, 960, nw, 84, 42, { tint: 'rgba(255,255,255,0.72)' });
      ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(1410 + nw / 2 - 44, 1002, 18, 0, 6.283); ctx.fill(); lat(ctx, 'i', 1410 + nw / 2 - 44, 1010, { size: 22, w: 700, color: '#FFFFFF', align: 'center' });
      const real = cio(t, T5.real - 0.1, 0.35);
      ctx.save(); ctx.beginPath(); ctx.rect(1410 - nw / 2, 960, nw - 80, 84); ctx.clip();
      K.words(ctx, wl(33), 1410 + nw / 2 - 80, 1015 - real * 70, t, { size: 28, w: 'S', color: C.ink, mode: 'rise', stagger: 0.01 });
      K.words(ctx, wl(34).concat(wl(35, 0, 3, { map: { 2: { color: P.gold3, w: 'B' }, 3: { color: P.gold3, w: 'B' } } })), 1410 + nw / 2 - 80, 1015 + 70 - real * 70, t, { size: 28, w: 'S', color: C.ink, mode: 'rise', stagger: 0.01 });
      ctx.restore();
    });
  }

  // ================================================================ ACT 6 · THE MATHS (69.1 → 86.3): ounce $4,000 → 3 oz $12,000 → a month later $4,400 → $13,200, +$1,200 = +10%
  const T6 = { flood: 69.1, oz: w(36, 3), v4k: w(36, 4), three: w(37, 1), v12: w(37, 4), saeed: w(38, 0), bought: w(39, 0), month: w(40, 0), oz2: w(41, 2), v44: w(41, 3), chain: w(42, 0), v132: w(43, 2), diff: w(44, 0), v12d: w(45, 0), pct: w(46, 1), out: 86.3 };
  const gRose = { t0: T6.flood, t1: 86.55, from: { x: thickX + CARD5.w / 2 + 50, y: 600 }, din: 0.36, paint: SH.paint.sw('rose'), dim: 0.35 };
  SH.grounds.push(gRose);
  SH.cam.push([69.0, 1.1, 960, 560], [70.2, 1.1, 900, 540], [76.3, 1.1, 900, 540], [77.4, 1.1, 1020, 540], [86.2, 1.1, 1040, 540]);
  sfx(T6.flood, 'whoosh', 0.18, { d: 0.5 }); sfx(T6.v4k - 0.05, 'slam', 0.14); [0, 1, 2].forEach((i) => sfx(T6.three + i * 0.18, 'pop', 0.13, { f: 700 + i * 120 })); sfx(T6.v12, 'tick', 0.15, { f: 2000 });
  sfx(T6.saeed, 'click', 0.16); sfx(T6.bought + 0.4, 'chime', 0.14); sfx(T6.month - 0.05, 'whoosh', 0.14, { d: 0.6 }); sfx(T6.month + 0.3, 'tick', 0.12, { f: 2600 });
  sfx(T6.v44 - 0.6, 'riser', 0.1, { d: 0.6 }); sfx(T6.v44, 'chime', 0.14); sfx(T6.v132, 'chime', 0.12); sfx(T6.diff, 'pop', 0.16, { f: 900 }); sfx(T6.pct, 'impact', 0.12); sfx(T6.pct + 0.05, 'pop', 0.16, { f: 1100 });
  function act6(ctx, t) {
    if (t < T6.flood || t > T6.out + 0.6) return;
    // left: the ounce price card · right: Saeed's chain card · bottom: difference
    const pc = { x: 210, y: 300, w: 620, h: 360 };
    popAt(ctx, pc.x + pc.w / 2, pc.y + pc.h / 2, sp(t, T6.flood + 0.15, 12, 0.6), () => {
      gcard(ctx, pc.x, pc.y, pc.w, pc.h, { tint: 'rgba(255,255,255,0.66)' });
      K.words(ctx, wl(36, 0, 3), pc.x + pc.w - 40, pc.y + 72, t, { size: 34, w: 'S', color: C.slate, mode: 'rise' });
      const v = roll(t, [[0, 4000], [T6.v44 - 0.1, 4400]], 0.8); const up = cio(t, T6.v44 - 0.1, 0.8);
      { const vp = sp(t, T6.v4k - 0.12, 15, 0.5); if (vp > 0) { ctx.save(); ctx.translate(pc.x + pc.w - 40, pc.y + 220); const k = Math.min(1.08, vp); ctx.scale(k, k); lat(ctx, money(v), 0, 0, { size: 120, w: 300, color: C.ink, align: 'right' }); ctx.restore(); } }
      if (up > 0) { ctx.save(); ctx.globalAlpha *= up; ctx.fillStyle = C.mint; ctx.beginPath(); ctx.moveTo(pc.x + 70, pc.y + 150); ctx.lineTo(pc.x + 46, pc.y + 186); ctx.lineTo(pc.x + 94, pc.y + 186); ctx.closePath(); ctx.fill(); lat(ctx, '+10%', pc.x + 70, pc.y + 226, { size: 30, w: 700, color: '#2A9C7B', align: 'center' }); ctx.restore(); }
      // three coins = three ounces
      for (let i = 0; i < 3; i++) { const cp = sp(t, T6.three + i * 0.18, 14, 0.5); if (cp <= 0) continue; const x = pc.x + pc.w - 80 - i * 90; popAt(ctx, x, pc.y + 300, cp, () => SH.coin(ctx, x, pc.y + 300, 34, t, { spin: 0 })); }
      const tp = eo(t, T6.v12 - 0.1, 0.3); if (tp > 0) { ctx.save(); ctx.globalAlpha *= tp; txt(ctx, '= ' , pc.x + 330, pc.y + 316, { size: 36, w: 'S', color: C.ink }); lat(ctx, money(roll(t, [[0, 12000], [T6.v132 - 0.1, 13200]], 0.8)), pc.x + 300, pc.y + 316, { size: 40, w: 600, color: C.ink, align: 'right' }); ctx.restore(); }
    });
    rise(ctx, wl(37), 150, t, { size: 44, color: C.ink, w: 'S', cx: 960, out: K.outAt(t, T6.saeed - 0.5) });
    // Saeed's thick chain: «سعيد اشترى الثخينة» → ✓
    const cc = { x: 1180, y: 280, w: 380, h: 540 };
    popAt(ctx, cc.x + cc.w / 2, cc.y + cc.h / 2, sp(t, T6.saeed - 0.15, 12, 0.6), () => {
      const v = roll(t, [[0, 12000], [T6.v132 - 0.1, 13200]], 0.8);
      chainCard(ctx, cc.x, cc.y, cc.w, cc.h, 'thick', t, { title: 'أثخن وبسيطة', sub: '3 أونصات', price: money(v) });
      const bp = cio(t, T6.bought, 0.5); const pillW = 190; const px = cc.x + cc.w / 2, py = cc.y + cc.h + 50;
      A.roundRect(ctx, px - pillW / 2, py - 32, pillW, 64, 32); ctx.fillStyle = C.ink; ctx.fill();
      if (bp < 1) { ctx.save(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(px, py, 14, t * 9, t * 9 + 4.2); ctx.globalAlpha *= 1 - bp; ctx.stroke(); ctx.restore(); }
      else { FX.check(ctx, px + 52, py + 2, 24, 1, C.mint, t); txt(ctx, 'اشترى', px + 20, py + 11, { size: 28, w: 'S', color: '#FFFFFF' }); }
    });
    rise(ctx, wl(38).concat(wl(39)), 150, t, { size: 44, color: C.ink, w: 'S', cx: 960, out: K.outAt(t, T6.month - 0.5) });
    // «بعد شهر»: a calendar chip flips
    const mp = sp(t, T6.month - 0.1, 13, 0.55);
    if (mp > 0) popAt(ctx, 1005, 520, mp, () => { GL.panel(ctx, 905, 470, 200, 100, 30, { tint: 'rgba(255,255,255,0.75)' }); const flip = cio(t, T6.month + 0.15, 0.5); ctx.save(); ctx.translate(1005, 520); ctx.scale(1, Math.abs(Math.cos(flip * Math.PI))); txt(ctx, flip < 0.5 ? 'اليوم' : '+1 شهر', 0, 12, { size: 34, w: 'B', color: flip < 0.5 ? C.slate : C.ink, align: 'center' }); ctx.restore(); });
    rise(ctx, wl(40).concat(wl(41)), 150, t, { size: 44, color: C.ink, w: 'S', cx: 960, out: K.outAt(t, T6.chain - 0.5) });
    rise(ctx, wl(42).concat(wl(43)), 150, t, { size: 44, color: C.ink, w: 'S', cx: 960, out: K.outAt(t, T6.diff - 0.5) });
    // difference: +$1,200 = +10%
    const dp = sp(t, T6.diff - 0.1, 12, 0.55);
    if (dp > 0) popAt(ctx, 960, 930, dp, () => {
      const pw2 = 560; A.roundRect(ctx, 960 - pw2 / 2, 880, pw2, 100, 50); ctx.fillStyle = C.ink; ctx.fill();
      txt(ctx, 'الفرق', 960 + pw2 / 2 - 40, 943, { size: 30, w: 'S', color: '#B8BEC4' });
      lat(ctx, '+$1,200', 960 + 30, 946, { size: 44, w: 700, color: C.mint, align: 'center', alpha: eo(t, T6.v12d - 0.05, 0.25) });
      const pp = sp(t, T6.pct - 0.05, 15, 0.5); if (pp > 0) { ctx.save(); ctx.translate(960 - pw2 / 2 + 70, 930); ctx.scale(Math.min(1.1, pp), Math.min(1.1, pp)); A.roundRect(ctx, -56, -32, 112, 64, 32); ctx.fillStyle = C.mint; ctx.fill(); lat(ctx, '10%', 0, 12, { size: 32, w: 800, color: '#0B3B2E', align: 'center' }); ctx.restore(); }
    });
    rise(ctx, wl(44).concat(wl(45)).concat(wl(46)), 150, t, { size: 44, color: C.ink, w: 'S', cx: 960 });
  }

  // ================================================================ ACT 7 · SAFE HAVEN (86.3 → 108.2)
  const T7 = { flood: 86.3, ask: w(47, 0), ans: w(49, 0), haven: w(50, 2), notRisk: w(51, 0), risk: w(51, 3), tens: w(52, 2), wars: w(52, 4), fog: w(52, 5), people: w(53, 0), keep: w(54, 2), like: w(55, 0), reason: w(56, 0), next: w(57, 0), out: 108.15 };
  const gLav = { t0: T7.flood, t1: 108.4, from: { x: 960, y: 920 }, din: 0.36, paint: SH.paint.sw('lav'), dim: 0.35 };
  SH.grounds.push(gLav);
  SH.cam.push([86.3, 1.1, 1040, 540], [87.4, 1.0, 960, 540], [107.6, 1.06, 960, 560]);
  sfx(T7.flood, 'whoosh', 0.18, { d: 0.5 }); sfx(T7.ask - 0.1, 'pop', 0.16, { f: 880 }); sfx(T7.ans - 0.1, 'pop', 0.16, { f: 620 }); sfx(T7.haven, 'chime', 0.16); sfx(T7.risk, 'buzz', 0.07);
  [T7.tens, T7.wars, T7.fog].forEach((tt, i) => sfx(tt - 0.05, 'pop', 0.13, { f: 520 + i * 90, pan: [0.4, -0.4, 0.1][i] })); sfx(T7.people, 'whoosh', 0.14, { d: 1.6 }); sfx(T7.keep + 0.3, 'chime', 0.12); sfx(T7.next - 0.1, 'whoosh', 0.12, { d: 0.4 }); sfx(T7.next + 0.2, 'pop', 0.14, { f: 900 });
  function shield(ctx, x, y, s, t, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const path = () => { ctx.beginPath(); ctx.moveTo(0, -150); ctx.bezierCurveTo(70, -118, 110, -112, 128, -110); ctx.bezierCurveTo(128, 20, 90, 110, 0, 160); ctx.bezierCurveTo(-90, 110, -128, 20, -128, -110); ctx.bezierCurveTo(-110, -112, -70, -118, 0, -150); ctx.closePath(); };
    ctx.save(); ctx.shadowColor = 'rgba(40,40,80,0.18)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 20; path(); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fill(); ctx.restore();
    path(); ctx.save(); ctx.clip(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.restore(); ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 3; ctx.stroke();
    GK.ingot(ctx, -70, -6, 140, 54, { shadow: false, depth: 18, label: 'Au' });
    ctx.restore();
  }
  function act7(ctx, t) {
    if (t < T7.flood || t > T7.out + 0.5) return;
    chat(ctx, t, [
      { side: 'me', label: wl(47), lines: [wl(48, 0, 2, { keepQ: true })] },
      { side: 'them', label: wl(49), lines: [wl(50, 0, 3, { map: { 2: { color: P.gold3, w: 'B' }, 3: { color: P.gold3, w: 'B' } } }), wl(51, 0, 3, { map: { 3: { color: C.red } } })] },
    ], { x: 1060, y: 120, w: 740, h: 380 }, { size: 34 });
    // the shield: «ملاذ آمن»
    const sp7 = sp(t, T7.haven - 0.15, 12, 0.55); const sx = 560, sy = 430;
    if (sp7 > 0) { popAt(ctx, sx, sy, sp7, () => shield(ctx, sx, sy, 1, t)); ctx.save(); ctx.globalAlpha *= eo(t, T7.haven, 0.3); txt(ctx, 'ملاذ آمن', sx, sy + 230, { size: 40, w: 'B', color: C.ink, align: 'center' }); ctx.restore(); }
    // three forces push people towards gold
    const chips = [{ s: 'التوترات السياسية', t: T7.tens, x: 1480, y: 640 }, { s: 'والحروب', t: T7.wars, x: 1170, y: 760 }, { s: 'أو عدم وضوح السياسات الاقتصادية', t: w(52, 5), x: 1400, y: 880 }];
    const flow = cio(t, T7.people, 2.2);
    chips.forEach((c, i) => {
      const p = sp(t, c.t - 0.1, 13, 0.55); if (p <= 0) return; const cw = A.measure(ctx, c.s, 30, 'S') + 70;
      popAt(ctx, c.x, c.y, p, () => { GL.panel(ctx, c.x - cw / 2, c.y - 36, cw, 72, 36, { tint: 'rgba(255,255,255,0.62)' }); txt(ctx, c.s, c.x, c.y + 11, { size: 30, w: 'S', color: C.ink, align: 'center' }); });
      // flowing dots toward the shield
      if (flow > 0) for (let k = 0; k < 7; k++) { const u = ((t * 0.55 + k / 7 + i * 0.13) % 1); const x = lerp(c.x - cw / 2, sx + 140, u), y = lerp(c.y, sy + 40, u) - Math.sin(u * Math.PI) * 60; ctx.save(); ctx.globalAlpha *= flow * Math.sin(u * Math.PI); ctx.fillStyle = GL.P.gold2; ctx.beginPath(); ctx.arc(x, y, 6, 0, 6.283); ctx.fill(); ctx.restore(); }
    });
    rise(ctx, wl(52, 0, 1), 600, t, { size: 34, color: C.slate, w: 'S', cx: 1400, out: K.outAt(t, T7.people - 0.2) });
    rise(ctx, wl(53).concat(wl(54)).concat(wl(55, 0, 1, { map: { 1: { color: P.gold3, w: 'B' } } })), 1000, t, { size: 38, color: C.ink, w: 'S', cx: 960, out: K.outAt(t, T7.reason - 0.5) });
    rise(ctx, wl(56), 1000, t, { size: 38, color: C.ink, w: 'S', cx: 1250 });
    const np = sp(t, T7.next - 0.1, 13, 0.55);
    if (np > 0) popAt(ctx, 560, 990, np, () => { const pw = K.wordsWidth(wl(57), { size: 30, w: 'S' }) + 110; A.roundRect(ctx, 560 - pw / 2, 952, pw, 76, 38); ctx.fillStyle = C.ink; ctx.fill(); K.words(ctx, wl(57), 560 + pw / 2 - 34, 1001, t, { size: 30, w: 'S', color: '#FFFFFF', mode: 'rise' }); ctx.strokeStyle = P.gold1; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(560 - pw / 2 + 56, 990); ctx.lineTo(560 - pw / 2 + 30, 990); ctx.moveTo(560 - pw / 2 + 40, 980); ctx.lineTo(560 - pw / 2 + 30, 990); ctx.lineTo(560 - pw / 2 + 40, 1000); ctx.stroke(); });
  }

  // ================================================================ ACT 8 · A TENDENCY, NOT A GUARANTEE (108.2 → 118.0)
  const T8 = { flood: 108.15, tend: w(58, 2), not: w(58, 3), guar: w(58, 4), even: w(59, 0), down: w(59, 4), if10: w(60, 0), ten: w(60, 5), chain: w(61, 0), lose: w(62, 0), v12: w(62, 1), out: 117.9 };
  const gBeige = { t0: T8.flood, t1: 118.15, from: { x: 560, y: 1000 }, din: 0.36, paint: SH.paint.sw('beige'), dim: 0.3 };
  SH.grounds.push(gBeige);
  SH.cam.push([108.1, 1.06, 960, 560], [109.2, 1.0, 960, 540], [117.8, 1.04, 940, 540]);
  sfx(T8.flood, 'whoosh', 0.18, { d: 0.5 }); sfx(T8.tend - 0.05, 'pop', 0.14, { f: 820 }); sfx(T8.guar + 0.2, 'scribble', 0.12, { d: 0.35 }); sfx(T8.down, 'whoosh', 0.14, { d: 0.7, up: false });
  sfx(T8.ten, 'buzz', 0.08); sfx(T8.lose, 'buzz', 0.08); sfx(T8.v12, 'tick', 0.12, { f: 1600 });
  function act8(ctx, t) {
    if (t < T8.flood || t > T8.out + 0.5) return;
    // «ميل» ✓ vs «ضمان» ✗
    const tp = sp(t, T8.tend - 0.1, 13, 0.55), gp = sp(t, T8.guar - 0.1, 13, 0.55);
    popAt(ctx, 1300, 280, tp, () => { GL.panel(ctx, 1110, 180, 380, 200, 40, { tint: 'rgba(255,255,255,0.66)' }); txt(ctx, 'ميل', 1300, 310, { size: 96, w: 'B', color: C.ink, align: 'center' }); });
    popAt(ctx, 620, 280, gp, () => {
      GL.panel(ctx, 430, 180, 380, 200, 40, { tint: 'rgba(255,255,255,0.66)' }); txt(ctx, 'ضمان', 620, 310, { size: 96, w: 'B', color: C.ink, align: 'center' });
      const st = cio(t, T8.guar + 0.2, 0.35); ctx.strokeStyle = C.red; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(470, 280); ctx.lineTo(lerp(470, 770, st), 280 - 20 * st); ctx.stroke();
    });
    const ne = eo(t, T8.not - 0.05, 0.3); if (ne > 0) { ctx.save(); ctx.globalAlpha *= ne; lat(ctx, '≠', 960, 310, { size: 110, w: 300, color: C.red, align: 'center' }); ctx.restore(); }
    rise(ctx, wl(58), 120, t, { size: 40, color: C.ink, w: 'S', cx: 960, out: K.outAt(t, T8.even - 0.3) });
    // price line dips even in a crisis; then -10%: $4,000 → $3,600, the chain loses $1,200
    const lp = eo(t, T8.even - 0.2, 0.4);
    if (lp > 0) {
      const bx = 330, by = 470, bw = 1260, bh = 300; ctx.save(); ctx.globalAlpha *= lp; GL.panel(ctx, bx, by, bw, bh, 36, { tint: 'rgba(255,255,255,0.6)' }); ctx.restore();
      const dn = cio(t, T8.down - 0.2, 1.4); ctx.save(); ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.clip(); ctx.beginPath();
      const n = 90; for (let k = 0; k <= n; k++) { const u = k / n; const x = lerp(bx + bw - 40, bx + 40, u); const base = by + 110 + Math.sin(u * 9 + 1) * 14 + Math.sin(u * 23) * 6; const y = base + (u > 0.55 ? (u - 0.55) / 0.45 * 120 * dn : 0); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.strokeStyle = mixHex(GL.P.gold2, C.red, dn); ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
      rise(ctx, wl(59, 0, 4, { map: { 4: { color: C.red, w: 'B' } } }), by + bh - 40, t, { size: 36, color: C.ink, w: 'S', cx: bx + bw / 2 + 200, out: K.outAt(t, T8.if10 - 0.5) });
      const vp = eo(t, T8.ten - 0.1, 0.3);
      if (vp > 0) {
        ctx.save(); ctx.globalAlpha *= vp; const v = roll(t, [[0, 4000], [T8.ten, 3600]], 0.8); lat(ctx, money(v), bx + 120, by + 120, { size: 64, w: 300, color: C.ink }); A.roundRect(ctx, bx + 120, by + 150, 130, 50, 25); ctx.fillStyle = C.red; ctx.fill(); lat(ctx, '−10%', bx + 185, by + 186, { size: 28, w: 700, color: '#FFFFFF', align: 'center' }); ctx.restore();
      }
      rise(ctx, wl(60), by + bh - 40, t, { size: 36, color: C.ink, w: 'S', cx: bx + bw / 2 + 200, out: K.outAt(t, T8.chain - 0.25) });
    }
    const cp = sp(t, T8.chain - 0.12, 12, 0.6);
    if (cp > 0) popAt(ctx, 960, 900, cp, () => {
      const pw2 = 660; A.roundRect(ctx, 960 - pw2 / 2, 850, pw2, 100, 50); ctx.fillStyle = C.ink; ctx.fill();
      K.words(ctx, wl(61).concat(wl(62, 0, 0)), 960 + pw2 / 2 - 40, 912, t, { size: 30, w: 'S', color: '#C9CED3', mode: 'rise' });
      const v = roll(t, [[0, 12000], [T8.lose, 10800]], 0.8); lat(ctx, money(v), 960 - 40, 914, { size: 34, w: 600, color: '#FFFFFF', align: 'center' });
      const lp2 = sp(t, T8.v12 - 0.05, 15, 0.5); if (lp2 > 0) { ctx.save(); ctx.translate(960 - pw2 / 2 + 100, 900); ctx.scale(Math.min(1.1, lp2), Math.min(1.1, lp2)); A.roundRect(ctx, -78, -32, 156, 64, 32); ctx.fillStyle = C.red; ctx.fill(); lat(ctx, '−$1,200', 0, 11, { size: 28, w: 800, color: '#FFFFFF', align: 'center' }); ctx.restore(); }
    });
  }

  SH.sec.push({ t0: T5.flood - 0.1, t1: T5.out + 0.7, front: act5 }, { t0: T6.flood, t1: T6.out + 0.7, front: act6 }, { t0: T7.flood, t1: T7.out + 0.6, front: act7 }, { t0: T8.flood, t1: T8.out + 0.6, front: act8 });
  // each act is eaten by the next act's flood
  SH.sec[SH.sec.length - 4].coverBy = gRose; SH.sec[SH.sec.length - 3].coverBy = gLav; SH.sec[SH.sec.length - 2].coverBy = gBeige; SH.sec[SH.sec.length - 1].shrinkWith = gBeige;
})(typeof window !== 'undefined' ? window : globalThis);
