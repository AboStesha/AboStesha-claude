// Lesson 11 — Part 2: Apple example (set a buy price at $150 → executed) · the reverse for selling (→ executed) · questions · end card.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT;
  const { W, H, C, clamp, lerp, inv, eo, ei, eio, hexA, txt, lat, measure, line } = A;
  const { w, we, wl, ph, sfx, ksfx, scene } = F;
  const SIL = C.silver, SUB = hexA(C.white, 0.72);
  const { tradeBtn, ticket, typed } = F.L11;

  // stock card (light or dark)
  function stockCard(ctx, x, y, p, t, o = {}) {
    if (p <= 0) return; const dark = o.dark; ctx.save(); ctx.translate(x, y + (1 - Math.min(1, p)) * 60); ctx.scale(Math.min(1.06, p), Math.min(1.06, p)); ctx.globalAlpha = clamp(p * 2);
    A.roundRect(ctx, -260, -130, 520, 260, 24); ctx.fillStyle = dark ? 'rgba(20,22,26,0.85)' : '#FFFFFF'; ctx.fill(); ctx.strokeStyle = dark ? hexA(C.white, 0.3) : hexA(C.slate, 0.4); ctx.lineWidth = 1.6; ctx.stroke();
    lat(ctx, 'AAPL', -220, -60, { size: 54, w: 800, color: dark ? C.white : C.ink }); txt(ctx, 'أسهم آبل', 220, -62, { size: 36, w: 'B', color: dark ? C.white : C.ink });
    const tq = Math.floor(t * 6) / 6; lat(ctx, '$' + (152.4 + Math.sin(tq * 2) * 0.3).toFixed(2), -220, 40, { size: 48, w: 300, color: dark ? C.white : C.ink });
    ctx.strokeStyle = dark ? C.white : C.ink; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i <= 30; i++) { const u = i / 30; const xx = 40 + u * 190, yy = 40 - Math.sin(u * 5 + 1) * 18 - u * 22; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();
    ctx.restore();
  }
  // AAPL chart with a level at $150
  const PB = K.path([[0, 156], [0.3, 154], [0.55, 155], [0.8, 151.5], [1, 150]], 70, 5, 0.6);   // falls to 150 (buy)
  const PS = K.path([[0, 144], [0.3, 146], [0.55, 145], [0.8, 148.5], [1, 150]], 70, 8, 0.6);   // rises to 150 (sell)
  function chart150(ctx, P, t, t0, t1, o) {
    const box = o.box; const fr = K.frame(box, 142, 158, P.length); const dark = o.dark;
    K.axes(ctx, box, eo(t, o.appear, 0.4), { t, color: dark ? hexA(C.white, 0.5) : hexA(C.ink, 0.6) });
    const lv = eo(t, o.levelT, 0.5);
    if (lv > 0) { ctx.save(); ctx.setLineDash([12, 9]); ctx.strokeStyle = o.col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(box[0] + box[2], fr.Y(150)); ctx.lineTo(box[0] + box[2] - box[2] * lv, fr.Y(150)); ctx.stroke(); ctx.restore();
      lat(ctx, '$150', box[0] + box[2] + 14, fr.Y(150) + 9, { size: 26, w: 700, color: o.col, alpha: lv }); }
    const hd = K.priceLine(ctx, fr, P, inv(t0, t1, t), { color: dark ? C.white : C.ink, width: 3.4, head: 10, headColor: dark ? C.white : C.ink });
    return hd;
  }

  // ================================================================ S6 — decide to buy Apple shares · set your buy price (light)
  const S6 = { t0: 51.2, t1: 61.0 };
  const DRAG0 = w(23, 1), DRAG1 = w(23, 5) + 0.1;
  sfx(S6.t0 - 0.45, 'shutter', 0.18); sfx(w(21, 4), 'pop', 0.18, { f: 820 }); sfx(DRAG0, 'click', 0.14); sfx(DRAG0 + 0.1, 'whoosh', 0.12, { d: DRAG1 - DRAG0 }); sfx(DRAG1, 'click', 0.16); sfx(w(24, 3), 'pop', 0.16, { f: 760 });
  scene({ name: 'apple', t0: S6.t0, t1: S6.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    K.cap(ctx, wl(21, 0, 3, { map: { 3: { color: C.ink, w: 'B' } } }), 230, t, { size: 56, out: K.outAt(t, w(22, 0) - 0.25) });
    K.cap(ctx, wl(22).concat(wl(23, 0, 2)), 230, t, { size: 52, out: K.outAt(t, w(24, 0) - 0.25) });
    K.cap(ctx, wl(24, 0, 5, { map: { 2: { color: C.ink, w: 'B' }, 3: { color: C.ink, w: 'B' } } }), 230, t, { size: 56 });
    const mv = eio(t, w(22, 0) - 0.2, 0.6);
    ctx.save(); ctx.translate(lerp(0, 380, mv), lerp(0, -60, mv)); stockCard(ctx, 960, 560, FX.springU(t - (w(21, 4) - 0.1), 14, 0.5), t); ctx.restore();
    // chart + dragged level
    if (mv > 0) {
      const box = [180, 360, 760, 460]; const fr = K.frame(box, 142, 158, PB.length);
      ctx.save(); ctx.globalAlpha = mv; K.axes(ctx, box, mv, { t }); K.priceLine(ctx, fr, PB.slice(0, 30), 1, { color: C.ink, width: 3.2 }); ctx.restore();
      const yl = lerp(fr.Y(156.5), fr.Y(150), eio(t, DRAG0 + 0.1, DRAG1 - DRAG0 - 0.1)); const lp = eo(t, DRAG0 - 0.3, 0.3);
      if (lp > 0) { ctx.save(); ctx.globalAlpha = lp; ctx.setLineDash([12, 9]); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(box[0], yl); ctx.lineTo(box[0] + box[2], yl); ctx.stroke(); ctx.restore();
        lat(ctx, '$' + (158 - (yl - box[1]) / box[3] * 16).toFixed(2), box[0] + box[2] + 12, yl + 9, { size: 26, w: 700, color: C.ink, alpha: lp }); }
      const [cx, cy] = K.cursorAt(t, [[DRAG0 - 0.6, 900, 900], [DRAG0, box[0] + box[2] - 60, fr.Y(156.5)], [DRAG1, box[0] + box[2] - 60, fr.Y(150)], [DRAG1 + 1, box[0] + box[2] + 40, fr.Y(150) + 80]]);
      if (t > DRAG0 - 0.6) FX.cursor(ctx, cx, cy, t > DRAG0 && t < DRAG1 ? 0.6 : K.press(t, [DRAG0, DRAG1]));
      K.chip(ctx, 'سعر الشراء الخاص بك', box[0] + box[2] - 20, fr.Y(150) + 60, { p: eo(t, w(24, 3), 0.35), size: 26, fill: C.ink, stroke: C.ink, color: C.white, w: 'S', align: 'right' });
    }
  } });

  // ================================================================ S7 — buy at $150: set the price · market reaches it · buy order executed (dark)
  const S7 = { t0: S6.t1, t1: 75.8 };
  const CONF = w(27, 3), TOUCH = w(28, 8) + 0.1, EXB = w(30, 0);
  sfx(S7.t0 - 0.42, 'whip', 0.2); F.SHUTTER.push([S7.t0 - 0.42, S7.t0, 1.6 / 60]); sfx(w(25, 4) - 0.02, 'slam', 0.22); sfx(w(26, 4), 'type', 0.12, { d: 0.6, n: 6 });
  sfx(CONF, 'click', 0.2); sfx(w(28, 0), 'scribble', 0.1, { d: 3.2 }); sfx(TOUCH, 'impact', 0.2); sfx(EXB, 'chime', 0.16);
  scene({ name: 'buy150', t0: S7.t0, t1: S7.t1, ink: 'dark', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    K.cap(ctx, wl(25, 0, 3), 230, t, { color: SUB, size: 56, out: K.outAt(t, w(26, 0) - 0.25) });
    K.cap(ctx, wl(26).concat(wl(27, 0, 1)), 230, t, { color: SUB, size: 52, out: K.outAt(t, w(28, 0) - 0.25) });
    K.cap(ctx, wl(28, 0, 8), 230, t, { color: SUB, size: 46, out: K.outAt(t, w(29, 0) - 0.25) });
    K.head(ctx, wl(29).concat(wl(30, 0, 0, { map: { 0: { color: C.mint } } })), 250, t, { size: 90, color: C.white });
    // hero $150
    const hp = FX.springU(t - w(25, 4), 15, 0.5); const hgo = eio(t, w(26, 0) - 0.2, 0.5);
    if (hp > 0 && hgo < 1) { ctx.save(); ctx.globalAlpha = 1 - hgo; ctx.translate(lerp(960, 1440, hgo), lerp(600, 420, hgo)); const s = lerp(2, 1, Math.min(1, hp)) * lerp(1, 0.4, hgo); ctx.scale(s, s); lat(ctx, '$150', 0, 60, { size: 220, w: 300, color: C.white, align: 'center', track: -4 }); ctx.restore(); }
    // ticket (right)
    if (hgo > 0) {
      const tp = eo(t, w(26, 0), 0.5) * (1 - eio(t, w(28, 0) - 0.3, 0.5) * 0.0);
      const yy = ticket(ctx, 1120, 330, 620, [['الأداة', 'AAPL', w(26, 0)], ['النوع', (x, y, a) => txt(ctx, 'شراء', x + 230, y, { size: 30, w: 'B', color: C.mint, align: 'right', alpha: a }), w(26, 0) + 0.2], ['السعر', (x, y, a) => lat(ctx, '$' + typed('150.00', t, w(26, 4), 0.6), x, y, { size: 30, w: 700, color: C.white, alpha: a }), w(26, 3)]], tp, t);
      if (yy != null) { K.pill(ctx, 'تأكيد الشراء', 1430, yy + 430, { p: eo(t, w(27, 0), 0.35), size: 28, h: 68, fill: C.carbon, stroke: C.mint }); const [cx, cy] = K.cursorAt(t, [[w(27, 0), 1600, 1000], [CONF - 0.05, 1450, yy + 440]]); if (t > w(27, 0)) FX.cursor(ctx, cx, cy, K.press(t, [CONF]), C.white); K.burst(ctx, 1430, yy + 430, t, CONF, C.mint, 30, 150); }
    }
    // chart: price falls to $150 → executed
    if (t > w(28, 0) - 0.3) {
      const hd = chart150(ctx, PB, t, w(28, 0), TOUCH, { box: [200, 360, 820, 440], dark: true, col: C.mint, appear: w(28, 0) - 0.3, levelT: w(28, 0) - 0.2 });
      K.burst(ctx, hd[0], hd[1], t, TOUCH, C.mint, 10, 100);
      if (t > EXB - 0.2) { K.chip(ctx, 'تم تنفيذ أمر الشراء', hd[0] - 10, hd[1] + 80, { p: eo(t, EXB - 0.2, 0.35), size: 26, fill: C.mint, stroke: C.mint, color: C.ink, w: 'B', align: 'right' }); }
    }
  } });

  // ================================================================ S8 — the reverse for selling: buy flips to sell · set the sell price at $150 (light)
  const S8 = { t0: S7.t1, t1: 88.6 };
  const FLIP = w(31, 1) - 0.1;
  sfx(S8.t0 - 0.45, 'shutter', 0.18); ksfx(FLIP, 'spin', 0.24); sfx(w(32, 2), 'pop', 0.16, { f: 820 }); sfx(w(33, 6) - 0.02, 'slam', 0.2); sfx(w(34, 4), 'type', 0.12, { d: 0.6, n: 6 });
  scene({ name: 'sellflip', t0: S8.t0, t1: S8.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    K.cap(ctx, wl(31, 0, 3, { map: { 3: { color: C.red, w: 'B' } } }), 230, t, { size: 58, out: K.outAt(t, w(32, 0) - 0.25) });
    K.cap(ctx, wl(32), 230, t, { size: 54, out: K.outAt(t, w(33, 0) - 0.25) });
    K.cap(ctx, wl(33, 0, 7, { map: { 2: { color: C.red, w: 'B' } } }), 230, t, { size: 52, out: K.outAt(t, w(34, 0) - 0.25) });
    K.cap(ctx, wl(34, 0, 5, { map: { 2: { color: C.red, w: 'B' } } }), 230, t, { size: 54 });
    // flip: buy → sell
    const f = eio(t, FLIP, 0.7); const sx = Math.cos(f * Math.PI); const go = eio(t, w(32, 0) - 0.2, 0.5);
    if (go < 1) { ctx.save(); ctx.globalAlpha = 1 - go; ctx.translate(960, 560); ctx.scale(Math.abs(sx) * 1.5, 1.5); ctx.translate(-960, -560); tradeBtn(ctx, sx >= 0 ? 'buy' : 'sell', 960, 560, '$150', eo(t, S8.t0 - 0.2, 0.3), { glow: true }); ctx.restore(); }
    // apple card + sell ticket
    if (go > 0) {
      stockCard(ctx, 1300, 560, FX.springU(t - (w(32, 2) - 0.1), 14, 0.5) * go, t);
      const tp = eo(t, w(33, 0), 0.5);
      ticket(ctx, 240, 330, 620, [['الأداة', 'AAPL', w(33, 4)], ['النوع', (x, y, a) => txt(ctx, 'بيع', x + 230, y, { size: 30, w: 'B', color: C.red, align: 'right', alpha: a }), w(33, 2)], ['السعر', (x, y, a) => lat(ctx, '$' + typed('150.00', t, w(34, 4), 0.6), x, y, { size: 30, w: 700, color: C.ink, alpha: a }), w(33, 6)]], tp, t, { light: true, title: 'أمر بيع' });
    }
  } });

  // ================================================================ S9 — market rises to $150 · matches your sell price · sell order executed (dark)
  const S9 = { t0: S8.t1, t1: 97.5 };
  const TOUCH2 = w(36, 0) + 0.1, EXS = w(37, 2);
  sfx(S9.t0 - 0.42, 'ripple', 0.2); sfx(w(35, 3), 'scribble', 0.1, { d: 2.4 }); sfx(TOUCH2, 'impact', 0.22); sfx(EXS, 'chime', 0.16);
  scene({ name: 'sell150', t0: S9.t0, t1: S9.t1, ink: 'dark', enter: { type: 'ripple', dur: 0.42, x: 960, y: 560 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    K.cap(ctx, wl(35), 230, t, { color: SUB, size: 50, out: K.outAt(t, w(36, 0) - 0.25) });
    K.cap(ctx, wl(36, 0, 5, { map: { 0: { color: C.white, w: 'B' } } }), 230, t, { color: SUB, size: 54, out: K.outAt(t, w(37, 0) - 0.25) });
    K.head(ctx, wl(37, 0, 2, { map: { 2: { color: C.red } } }), 250, t, { size: 96, color: C.white });
    const hd = chart150(ctx, PS, t, w(35, 0), TOUCH2, { box: [320, 360, 1180, 460], dark: true, col: C.red, appear: S9.t0 - 0.2, levelT: S9.t0 });
    K.burst(ctx, hd[0], hd[1], t, TOUCH2, C.red, 10, 110);
    FX.kword(ctx, 'يتطابق', hd[0] + 40, hd[1] - 60, { size: 54, w: 'B', color: C.white, lt: t - TOUCH2, mode: 'snap', out: K.outAt(t, EXS - 0.3, 0.3) });
    if (t > EXS - 0.2) K.chip(ctx, 'تم تنفيذ أمر البيع', hd[0] - 10, hd[1] + 80, { p: eo(t, EXS - 0.2, 0.35), size: 26, fill: C.red, stroke: C.red, color: C.white, w: 'B', align: 'right' });
  } });

  // ================================================================ S10 — answer the questions below (dark)
  const S10 = { t0: S9.t1, t1: 100.3 };
  const PICK2 = w(38, 2) + 0.1, DOWN2 = w(38, 4);
  sfx(S10.t0 - 0.42, 'whip', 0.2); F.SHUTTER.push([S10.t0 - 0.42, S10.t0, 1.6 / 60]); sfx(PICK2, 'click', 0.18); [0, 1, 2].forEach((i) => sfx(DOWN2 + i * 0.32, 'bloop', 0.1));
  scene({ name: 'quiz', t0: S10.t0, t1: S10.t1, ink: 'dark', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    K.head(ctx, wl(38, 0, 2), 260, t, { size: 100, color: C.white });
    const x = 560, y = 360; const yy = K.card(ctx, x, y, 800, 330, { p: eo(t, S10.t0 - 0.2, 0.4), dark: true, chamfer: 36 });
    if (yy != null) { txt(ctx, 'بأيّ سعر تشتري؟', x + 760, yy + 62, { size: 32, w: 'B', color: C.white });
      ['سعر العرض (Ask)', 'سعر الطلب (Bid)'].forEach((o, i) => { const ry = yy + 140 + i * 70; const sel = i === 0 && t > PICK2; ctx.strokeStyle = sel ? C.mint : hexA(C.white, 0.5); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x + 740, ry - 10, 14, 0, 6.283); ctx.stroke(); if (sel) { ctx.fillStyle = C.mint; ctx.beginPath(); ctx.arc(x + 740, ry - 10, 7, 0, 6.283); ctx.fill(); } txt(ctx, o, x + 710, ry, { size: 28, color: sel ? C.white : SUB }); });
      const [cx, cy] = K.cursorAt(t, [[S10.t0, 1400, 1000], [PICK2 - 0.05, x + 744, yy + 132]]); FX.cursor(ctx, cx, cy, K.press(t, [PICK2]), C.white); }
    const da = eo(t, DOWN2 - 0.15, 0.3); if (da > 0) { const b = Math.abs(Math.sin((t - DOWN2) * 6)) * 24; ctx.save(); ctx.globalAlpha = da; ctx.translate(960, 790 + b); ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.lineTo(0, 40); ctx.closePath(); ctx.fill(); ctx.fillRect(-8, -60, 16, 62); ctx.restore(); }
    K.cap(ctx, wl(38, 3, 5), 900, t, { color: C.white, size: 50, w: 'S' });
  } });

  // ================================================================ S11 — «ونراكم في / الدرس القادم.» (light end card)
  const S11 = { t0: S10.t1, t1: F.CLOSE };
  sfx(S11.t0 - 0.45, 'shutter', 0.2); ksfx(w(39, 0), 'drop', 0.16); ksfx(w(39, 2), 'drop', 0.24); sfx(w(39, 3) + 0.6, 'pop', 0.24, { f: 700 }); sfx(w(39, 4), 'scribble', 0.1, { d: 0.6 });
  scene({ name: 'endcard', t0: S11.t0, t1: S11.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    const L2 = 'الدرس القادم', s2 = 230, w2 = FX.kwidth(L2, s2), right = 960 + w2 / 2 + 20;
    K.words(ctx, wl(39, 0, 1), right, 400, t, { size: 110, color: C.ink, stagger: 0.035 });
    FX.kword(ctx, L2, right, 660, { size: s2, color: C.ink, lt: t - w(39, 2), mode: 'drop', stagger: 0.05 });
    const dx = right - w2 - 44; K.dot(ctx, dx, 630, 30, t - (w(39, 3) + 0.3), { h0: 380 });
    FX.note(ctx, 'إن شاء الله', dx + 150, 820, { p: inv(w(39, 4), w(39, 6) + 0.3, t), size: 36, color: C.slate, w: 'S', align: 'right', to: [dx + 6, 676], from: [dx + 30, 790], bend: -0.4, t });
    K.under(ctx, right, right - w2, 760, inv(w(39, 3) + 0.2, w(39, 3) + 0.7, t), { t });
  } });

  F.addClose();
})(typeof window !== 'undefined' ? window : globalThis);
