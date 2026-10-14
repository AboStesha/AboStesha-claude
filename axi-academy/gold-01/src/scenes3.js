// Gold series · Lesson 01 — File 3: ACT 9 the ways (composer callback → cards), ACT 10 CFD page, ACT 11 margin, ACT 12 leverage,
// ACT 13 sell first (the phone returns), ACT 14 summary on the black page → the red dot → the close.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT, GL = G.GL, GK = G.GK, SH = G.SHOT;
  const { W, H, C, clamp, lerp, eo, hexA, txt, lat, mixHex } = A;
  const { w, we, wl, ph, phe, sfx, ksfx } = F;
  const { cio, sp } = SH.util; const { rise, head, typeSched, typedStr } = SH.text; const { chat, roll, money, gcard, popAt, avatar } = SH.ui;
  const P = GL.P; const WHITE = '#FFFFFF', SILV = '#C9CED3';
  const findSec = (name) => SH.sec.find((s) => s.front && s.front.name === name);

  // ================================================================ ACT 9 · THE WAYS (117.9 → 138.6): the composer returns; four ways to hold gold; focus on CFD
  const T9 = { in: 117.9, look: w(63, 0), type: w(63, 3), send: we(63, 7) + 0.12, phys: w(64, 0), above: w(65, 3), prem: w(66, 2), store: w(67, 1), ins: w(67, 2),
    etf: w(68, 2), backed: w(69, 0), fut: w(69, 4), cfd: w(69, 7), costs: w(70, 2), risks: w(71, 0), focus: w(72, 0), cfd2: w(72, 3), out: 138.6 };
  const CPB = { x: 560, y: 470, w: 800, h: 150, r: 36 };          // composer (centre)
  // the beige ground of ACT 8 shrinks into the composer
  const gB = SH.grounds.find((g) => Math.abs(g.t0 - 108.15) < 0.01); if (gB) { gB.t1 = 118.55; gB.to = { x: CPB.x, y: CPB.y, w: CPB.w, h: CPB.h, r: CPB.r }; gB.dout = 0.6; }
  SH.cam.push([118.0, 1.04, 940, 540], [119.0, 1.25, 960, 545], [120.95, 1.25, 960, 545], [121.9, 1.0, 960, 560], [127.9, 1.0, 960, 560], [128.9, 1.0, 1000, 560], [136.6, 1.0, 1000, 560], [137.9, 1.03, 560, 560]);
  const QW = wl(63, 3, 7); const QSCH = typeSched(QW);
  QW.forEach((wd, k) => { const nxt = k + 1 < QW.length ? QW[k + 1].t : wd.t + 0.6; const n = Array.from(wd.s).length; sfx(wd.t, 'type', 0.08, { d: Math.min(0.85 * (nxt - wd.t), n * 0.075 + 0.05), n }); });
  sfx(T9.send - 0.02, 'click', 0.18); sfx(T9.send, 'pop', 0.2, { f: 980 }); sfx(T9.send + 0.02, 'ripple', 0.16); sfx(T9.send + 0.25, 'impact', 0.16); sfx(T9.send + 0.27, 'whoosh', 0.16, { d: 0.5 });
  sfx(T9.above, 'stretch', 0.12); sfx(T9.prem, 'tick', 0.14, { f: 2400 }); sfx(T9.store - 0.05, 'pop', 0.12, { f: 700 }); sfx(T9.ins - 0.05, 'pop', 0.12, { f: 820 });
  [T9.etf, T9.fut, T9.cfd].forEach((tt, i) => { sfx(tt - 0.12, 'whoosh', 0.12, { d: 0.3, pan: 0.2 - 0.2 * i }); sfx(tt + 0.03, 'pop', 0.15, { f: 640 + i * 110 }); });
  sfx(T9.costs, 'tick', 0.1, { f: 2200 }); sfx(T9.risks, 'tick', 0.1, { f: 2600 }); sfx(T9.focus - 0.05, 'whoosh', 0.14, { d: 1.0 }); sfx(T9.cfd2, 'chime', 0.14);
  const WAYS = [
    { k: 'phys', title: 'الذهب الفعلي', sub: 'سبائك ومجوهرات', t: T9.phys },
    { k: 'etf', title: 'صناديق متداولة', sub: 'بعضها وراها ذهب فعلي', t: T9.etf, subT: T9.backed },
    { k: 'fut', title: 'عقود مستقبلية', sub: 'عقود بتاريخ محدد', t: T9.fut },
    { k: 'cfd', title: 'CFD', sub: 'عقد على فرق السعر', t: T9.cfd },
  ];
  const WC = { w: 330, h: 430, y: 610 }; const wx = (i) => 1000 + (1.5 - i) * 360; // RTL strip
  function wayArt(ctx, k, x, y, w0, h0, t) {
    ctx.save(); A.roundRect(ctx, x, y, w0, h0, [28, 28, 0, 0]); ctx.clip();
    const bgd = ctx.createLinearGradient(0, y, 0, y + h0); bgd.addColorStop(0, '#2A2C31'); bgd.addColorStop(1, '#141518'); ctx.fillStyle = bgd; ctx.fillRect(x, y, w0, h0);
    const cx = x + w0 / 2, cy = y + h0 / 2;
    if (k === 'phys') GL.cover(ctx, 'bars_photo', x, y, w0, h0, { fx: 0.85, fy: 0.5 });
    else if (k === 'etf') { for (let i = 0; i < 4; i++) GK.ingot(ctx, cx - 70 + (i % 2) * 20, cy + 40 - i * 32, 140, 36, { shadow: false, depth: 10 }); ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 3; A.roundRect(ctx, cx - 100, cy - 100, 200, 180, 18); ctx.stroke(); lat(ctx, 'ETF', cx, cy - 66, { size: 26, w: 700, color: WHITE, align: 'center' }); }
    else if (k === 'fut') { ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 3; A.roundRect(ctx, cx - 80, cy - 70, 160, 150, 14); ctx.stroke(); ctx.fillStyle = P.gold1; ctx.fillRect(cx - 80, cy - 70, 160, 34); for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) { ctx.fillStyle = i === 1 && j === 2 ? C.red : 'rgba(255,255,255,0.5)'; ctx.fillRect(cx - 62 + j * 34, cy - 20 + i * 30, 22, 18); } }
    else { ctx.strokeStyle = P.gold1; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const u = i / 40; const xx = lerp(x + 30, x + w0 - 30, u), yy = cy + 40 - u * 70 - Math.sin(u * 11 + t * 2) * 22; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); lat(ctx, 'XAU/USD', x + w0 - 26, y + 50, { size: 24, w: 700, color: WHITE, align: 'right' }); }
    ctx.restore();
  }
  function wayCard(ctx, c, x, y, s, t, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-WC.w / 2, -WC.h / 2);
    GL.darkCard(ctx, 0, 0, WC.w, WC.h, 28); wayArt(ctx, c.k, 0, 0, WC.w, 250, t);
    if (c.k === 'cfd') lat(ctx, 'CFD', WC.w - 26, 306, { size: 38, w: 800, color: WHITE, align: 'right' }); else txt(ctx, c.title, WC.w - 26, 304, { size: 32, w: 'B', color: WHITE });
    txt(ctx, c.sub, WC.w - 26, 344, { size: 22, color: '#A9AEB4', alpha: c.subT ? eo(t, c.subT, 0.4) : 1 });
    const tg = o.tags || 0; if (tg > 0) { [['تكاليف', '#E8C46A'], ['مخاطر', '#FF8A8A']].forEach(([s, col], i) => { const q = clamp(tg * 2 - i * 0.6); if (q <= 0) return; const tw = A.measure(ctx, s, 20, 'S') + 30; const tx = WC.w - 26 - i * (tw + 10) - tw; ctx.save(); ctx.globalAlpha *= q; A.roundRect(ctx, tx, 372, tw, 36, 18); ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.stroke(); txt(ctx, s, tx + tw / 2, 397, { size: 20, w: 'S', color: col, align: 'center' }); ctx.restore(); }); }
    ctx.restore();
  }
  function act9(ctx, t) {
    if (t < T9.in || t > T9.out + 0.5) return;
    const sent = t >= T9.send; const ink = clamp((t - T9.send - 0.02) / 0.3);
    // «سعيد بدأ يدوّر»
    rise(ctx, wl(63, 0, 2), CPB.y - 50, t, { size: 40, color: C.slate, w: 'S', cx: 960, out: K.outAt(t, T9.send + 0.1) });
    // the composer (callback to the opening) — types what Saeed is looking for, then sends; the send ripple drops the cards
    const cOut = cio(t, T9.send + 0.25, 0.45);
    if (t >= 118.5 && cOut < 1) {
      const sc = 1 - cOut; ctx.save(); ctx.translate(960, CPB.y + CPB.h / 2); ctx.scale(sc, sc); ctx.translate(-960, -(CPB.y + CPB.h / 2));
      GL.glow(ctx, CPB.x, CPB.y, CPB.w, CPB.h, CPB.r, t, { width: 26, blur: 22, alpha: 1 - ink });
      GL.panel(ctx, CPB.x, CPB.y, CPB.w, CPB.h, CPB.r, { tint: 'rgba(255,255,255,0.72)' });
      if (ink > 0) { ctx.save(); A.roundRect(ctx, CPB.x, CPB.y, CPB.w, CPB.h, CPB.r); ctx.clip(); ctx.beginPath(); ctx.arc(CPB.x + 50, CPB.y + CPB.h - 40, 900 * (1 - Math.pow(1 - ink, 3)), 0, 6.283); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore(); }
      const s1 = typedStr(QSCH, t); const QX = CPB.x + CPB.w - 44, QYY = CPB.y + 66;
      if (s1) txt(ctx, s1.trim(), QX, QYY, { size: 36, w: 'S', color: mixHex(C.ink, WHITE, ink) });
      if (!sent) { const wdt = s1 ? A.measure(ctx, s1.replace(/\s+$/, ''), 36, 'S') : 0; const typing = t < QSCH[QSCH.length - 1].t + 0.1 && t > QW[0].t - 0.05; if (typing && wdt > 0) GL.trail(ctx, QX - wdt, QYY, 36, Math.min(wdt, 90)); GL.caret(ctx, QX - wdt - 3, QYY, 36, t, { solid: typing }); }
      const press = 1 - 0.18 * Math.exp(-Math.pow((t - T9.send) / 0.08, 2)); ctx.save(); ctx.translate(CPB.x + 50, CPB.y + CPB.h - 40); ctx.scale(press, press); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, 24, 0, 6.283); ctx.fill(); ctx.strokeStyle = WHITE; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(11, 0); ctx.lineTo(-11, 0); ctx.moveTo(-2, -9); ctx.lineTo(-11, 0); ctx.lineTo(-2, 9); ctx.stroke(); ctx.restore();
      lat(ctx, '+', CPB.x + CPB.w - 44, CPB.y + CPB.h - 28, { size: 34, w: 300, color: mixHex(C.ink, WHITE, ink), align: 'center' });
      ctx.restore();
    }
    const rp = clamp((t - T9.send) / 0.9); if (rp > 0 && rp < 1) { ctx.save(); ctx.strokeStyle = hexA(P.gold1, (1 - rp) * 0.9); ctx.lineWidth = lerp(12, 1, rp); ctx.beginPath(); ctx.arc(CPB.x + 50, CPB.y + CPB.h - 40, lerp(24, 900, 1 - Math.pow(1 - rp, 3)), 0, 6.283); ctx.stroke(); ctx.restore(); }
    // physical gold: the first card, opened in detail (premium · storage · insurance)
    const det = cio(t, T9.phys - 0.1, 0.6) * (1 - cio(t, T9.etf - 0.45, 0.6));
    const physP = sp(t, T9.phys - 0.15, 12, 0.55);
    if (physP > 0) {
      const strip = cio(t, T9.etf - 0.45, 0.6); const x = lerp(1340, wx(0), strip), s = lerp(1.15, 1, strip) * Math.min(1.05, physP);
      wayCard(ctx, WAYS[0], x, WC.y, s, t, { tags: cio(t, T9.costs, 0.5) });
      if (det > 0) {
        ctx.save(); ctx.globalAlpha *= det; const bx = 200, by = 320, bw = 860, bh = 520; GL.panel(ctx, bx, by, bw, bh, 36, { tint: 'rgba(255,255,255,0.66)' });
        K.words(ctx, wl(64), bx + bw - 40, by + 66, t, { size: 40, w: 'B', color: C.ink, mode: 'rise' });
        // market vs dealer price bars + «علاوة»
        const ap = cio(t, T9.above - 0.1, 0.7); const base = by + bh - 70, bar = 70, h1 = 210, h2 = 210 + 70 * ap;
        ctx.fillStyle = hexA(C.slate, 0.35); A.roundRect(ctx, bx + bw - 220, base - h1, bar, h1, 10); ctx.fill(); txt(ctx, 'سعر السوق', bx + bw - 185, base + 44, { size: 28, w: 'S', color: C.slate, align: 'center' });
        ctx.fillStyle = GL.goldGrad(ctx, base - h2, base); A.roundRect(ctx, bx + bw - 390, base - h2, bar, h2, 10); ctx.fill(); txt(ctx, 'سعر الشراء', bx + bw - 355, base + 44, { size: 28, w: 'S', color: C.ink, align: 'center' });
        const pp = eo(t, T9.prem - 0.05, 0.3); if (pp > 0) { ctx.save(); ctx.globalAlpha *= pp; ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx + bw - 300, base - h1); ctx.lineTo(bx + bw - 284, base - h1); ctx.lineTo(bx + bw - 284, base - h2); ctx.lineTo(bx + bw - 300, base - h2); ctx.stroke(); txt(ctx, 'علاوة', bx + bw - 410, base - h2 + 22 + (h2 - h1) / 2, { size: 34, w: 'B', color: C.red, align: 'right' }); ctx.restore(); }
        // storage + insurance tags
        [['تخزين', T9.store], ['تأمين', T9.ins]].forEach(([s2, tt], i) => { const q = sp(t, tt - 0.08, 14, 0.55); if (q <= 0) return; const cx = bx + 190, cy = by + 190 + i * 120; popAt(ctx, cx, cy, q, () => { GL.panel(ctx, cx - 130, cy - 46, 260, 92, 46, { tint: 'rgba(255,255,255,0.85)' }); txt(ctx, s2, cx + 24, cy + 13, { size: 36, w: 'B', color: C.ink, align: 'center' }); ctx.strokeStyle = P.gold3; ctx.lineWidth = 3.5; ctx.beginPath(); if (i === 0) { A.roundRect(ctx, cx - 86, cy - 16, 36, 30, 5); } else { ctx.moveTo(cx - 68, cy - 20); ctx.lineTo(cx - 52, cy - 14); ctx.lineTo(cx - 52, cy + 2); ctx.quadraticCurveTo(cx - 52, cy + 16, cx - 68, cy + 22); ctx.quadraticCurveTo(cx - 84, cy + 16, cx - 84, cy + 2); ctx.lineTo(cx - 84, cy - 14); ctx.closePath(); } ctx.stroke(); }); });
        ctx.restore();
        rise(ctx, wl(65).concat(wl(66)), 250, t, { size: 40, color: C.ink, w: 'S', cx: 960, out: K.outAt(t, ph(67) - 0.5) });
        rise(ctx, wl(67), 250, t, { size: 40, color: C.ink, w: 'S', cx: 960, out: K.outAt(t, ph(68) - 0.5) });
      }
    }
    // the other three ways burst in; costs + risks tag each; the strip lands on CFD
    WAYS.slice(1).forEach((c, j) => { const i = j + 1; const p = sp(t, c.t - 0.12, 12, 0.55); if (p <= 0) return; const x = lerp(1000, wx(i), Math.min(1, p)); const lift = c.k === 'cfd' ? eo(t, T9.cfd2, 0.4) * 26 : 0; const dim = c.k === 'cfd' ? 1 : lerp(1, 0.45, eo(t, T9.focus, 0.5));
      ctx.save(); ctx.globalAlpha *= dim; if (c.k === 'cfd') GL.glow(ctx, x - WC.w / 2, WC.y - lift - WC.h / 2, WC.w, WC.h, 28, t, { alpha: eo(t, T9.cfd2, 0.4), width: 24, blur: 22 }); wayCard(ctx, c, x, WC.y - lift, Math.min(1.05, Math.max(0.2, p)), t, { tags: cio(t, T9.costs + j * 0.12, 0.5) }); ctx.restore();
      if (c.k === 'cfd') GK.pill(ctx, 'نركّز عليه', x, WC.y - lift - WC.h / 2 - 12, { style: 'gold', size: 24, p: sp(t, T9.cfd2 + 0.05, 14, 0.55) });
    });
    rise(ctx, wl(68).concat(wl(69)), 250, t, { size: 40, color: C.ink, w: 'S', cx: 1000, out: K.outAt(t, ph(70) - 0.5) });
    rise(ctx, wl(70).concat(wl(71, 0, 0, { map: { 0: { color: C.red } } })), 250, t, { size: 42, color: C.ink, w: 'S', cx: 1000, out: K.outAt(t, ph(72) - 0.5) });
    rise(ctx, wl(72, 0, 2).concat([Object.assign({}, wl(72, 3, 3)[0], { w: 'X' })]), 250, t, { size: 44, color: C.ink, w: 'S', cx: 640 });
  }

  // ================================================================ ACT 10 · CFD — the card expands into the black page (138.6 → 153.6)
  const T10 = { page: 138.55, der: w(73, 0), move: w(74, 0), noOwn: w(74, 4), contract: w(75, 0), you: w(76, 1), broker: w(76, 3), pl: w(77, 0), diff: w(78, 2), entry: w(78, 5), exit: w(78, 7), spread: w(79, 1), costs: w(80, 0), out: 153.6 };
  const CFDR = { x: wx(3) - WC.w / 2, y: WC.y - 26 - WC.h / 2, w: WC.w, h: WC.h, r: 28 };
  const gInk = { t0: T10.page, t1: 153.85, fromRect: CFDR, din: 0.55, paint: SH.paint.ink, dim: 0.8, dark: true };
  SH.grounds.push(gInk);
  SH.cam.push([138.5, 1.03, 560, 560], [139.4, 1.0, 960, 540], [152.9, 1.05, 960, 550]);
  sfx(T10.page - 0.02, 'whoosh', 0.2, { d: 0.6 }); sfx(T10.page + 0.5, 'impact', 0.12); ksfx(T10.der, 'rise', 0.16); sfx(T10.move, 'whoosh', 0.12, { d: 1.2 }); sfx(T10.noOwn + 0.2, 'scribble', 0.1, { d: 0.3 });
  sfx(T10.you - 0.05, 'pop', 0.14, { f: 760 }); sfx(T10.broker - 0.05, 'pop', 0.14, { f: 600 }); sfx(T10.broker + 0.3, 'tick', 0.1, { f: 2000 }); sfx(T10.entry, 'pop', 0.14, { f: 900 }); sfx(T10.exit, 'pop', 0.14, { f: 1100 }); sfx(T10.diff, 'stretch', 0.12); sfx(T10.spread, 'tick', 0.12, { f: 2600 }); sfx(T10.costs, 'tick', 0.12, { f: 2200 });
  function act10(ctx, t) {
    if (t < T10.page + 0.3 || t > T10.out + 0.5) return;
    // header: «CFD · عقد مشتق على سعر الذهب»
    const hp = sp(t, T10.page + 0.35, 12, 0.6);
    popAt(ctx, 960, 210, hp, () => { lat(ctx, 'CFD', 960, 230, { size: 120, w: 800, color: P.gold1, align: 'center', track: 2 }); });
    rise(ctx, wl(73), 310, t, { size: 46, color: WHITE, w: 'S', cx: 960 });
    // the price line runs; «بدون ما تملك ذهب» — a struck ingot
    const lp = eo(t, T10.move - 0.2, 0.4);
    if (lp > 0) {
      const bx = 260, by = 400, bw = 1400, bh = 380; ctx.save(); ctx.globalAlpha *= lp; GL.panel(ctx, bx, by, bw, bh, 36, { tint: 'rgba(255,255,255,0.06)', edge: 'rgba(255,255,255,0.25)', shadow: false }); ctx.restore();
      const run = cio(t, T10.move, 2.4); const pt = (u) => [lerp(bx + bw - 60, bx + 60, u), by + 200 - Math.sin(u * 7 + 0.5) * 50 - Math.sin(u * 17) * 16 - u * 40];
      ctx.save(); ctx.beginPath(); for (let k = 0; k <= 120; k++) { const u = k / 120 * run; const [x, y] = pt(u); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.strokeStyle = P.gold1; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
      // entry → exit markers and the difference
      const en = sp(t, T10.entry - 0.05, 14, 0.5), ex = sp(t, T10.exit - 0.05, 14, 0.5); const ue = 0.28, ux = 0.78; const [ex0, ey0] = pt(ue), [ex1, ey1] = pt(ux);
      if (en > 0) popAt(ctx, ex0, ey0, en, () => { ctx.fillStyle = WHITE; ctx.beginPath(); ctx.arc(ex0, ey0, 12, 0, 6.283); ctx.fill(); txt(ctx, 'سعر الدخول', ex0, ey0 + 52, { size: 26, w: 'S', color: WHITE, align: 'center' }); });
      if (ex > 0) popAt(ctx, ex1, ey1, ex, () => { ctx.fillStyle = C.mint; ctx.beginPath(); ctx.arc(ex1, ey1, 12, 0, 6.283); ctx.fill(); txt(ctx, 'سعر الخروج', ex1, ey1 - 32, { size: 26, w: 'S', color: C.mint, align: 'center' }); });
      const dp = eo(t, T10.exit + 0.2, 0.4); if (dp > 0) { ctx.save(); ctx.globalAlpha *= dp; ctx.strokeStyle = hexA(WHITE, 0.6); ctx.setLineDash([8, 8]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ex0, ey0); ctx.lineTo(ex1 - 30, ey0); ctx.moveTo(ex1, ey1); ctx.lineTo(ex1, ey0 + 4); ctx.stroke(); ctx.setLineDash([]); ctx.strokeStyle = C.mint; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ex1 - 40, ey0); ctx.lineTo(ex1 - 40, ey1); ctx.stroke(); txt(ctx, 'الفرق', ex1 - 56, (ey0 + ey1) / 2 + 10, { size: 26, w: 'B', color: C.mint, align: 'right' }); ctx.restore(); }
      // spread sliver + costs chip
      const sp2 = eo(t, T10.spread - 0.05, 0.3); if (sp2 > 0) { ctx.save(); ctx.globalAlpha *= sp2; ctx.fillStyle = hexA(C.red, 0.6); ctx.fillRect(ex0 - 6, ey0 - 18, 12, 36); txt(ctx, 'سبريد', ex0 - 18, ey0 - 26, { size: 22, w: 'S', color: '#FF8A8A', align: 'right' }); ctx.restore(); }
      const cp = sp(t, T10.costs - 0.05, 14, 0.55); if (cp > 0) GK.pill(ctx, 'تكاليف', bx + 140, by + bh - 50, { style: 'outline', color: '#E8C46A', size: 24, p: cp });
      // no gold in your hands
      const np = sp(t, T10.noOwn - 0.1, 13, 0.55); if (np > 0 && t < T10.contract) popAt(ctx, bx + 170, by + 110, np, () => { GK.ingot(ctx, bx + 110, by + 90, 120, 44, { shadow: false, depth: 14 }); const st = cio(t, T10.noOwn + 0.2, 0.3); ctx.strokeStyle = C.red; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx + 100, by + 150); ctx.lineTo(lerp(bx + 100, bx + 245, st), lerp(by + 150, by + 60, st)); ctx.stroke(); });
    }
    rise(ctx, wl(74), 860, t, { size: 40, color: SILV, w: 'S', cx: 960, out: K.outAt(t, T10.contract - 0.3) });
    // the contract is between you and the broker
    const cp2 = eo(t, T10.contract - 0.1, 0.4) * (1 - cio(t, T10.pl - 0.3, 0.4));
    if (cp2 > 0) {
      ctx.save(); ctx.globalAlpha *= cp2; const y = 880; [[1240, 'أنت', T10.you], [680, 'الوسيط', T10.broker]].forEach(([x, s2, tt]) => { const q = sp(t, tt - 0.08, 14, 0.55); if (q <= 0) return; popAt(ctx, x, y, q, () => { GL.panel(ctx, x - 110, y - 46, 220, 92, 46, { tint: 'rgba(255,255,255,0.1)', edge: 'rgba(255,255,255,0.4)', shadow: false }); txt(ctx, s2, x, y + 12, { size: 34, w: 'B', color: WHITE, align: 'center' }); }); });
      const lk = cio(t, T10.broker + 0.1, 0.5); ctx.strokeStyle = P.gold1; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(1130, y); ctx.lineTo(lerp(1130, 790, lk), y); ctx.stroke(); ctx.setLineDash([]);
      if (lk > 0.5) { ctx.fillStyle = WHITE; A.roundRect(ctx, 930, y - 34, 60, 70, 6); ctx.fill(); ctx.fillStyle = '#9AA0A6'; for (let i = 0; i < 4; i++) ctx.fillRect(940, y - 20 + i * 13, 40 - (i === 3 ? 16 : 0), 4); }
      ctx.restore();
    }
    rise(ctx, wl(75).concat(wl(76)), 1000, t, { size: 36, color: SILV, w: 'S', cx: 960, out: K.outAt(t, T10.pl - 0.3) });
    rise(ctx, wl(77).concat(wl(78)), 860, t, { size: 38, color: WHITE, w: 'S', cx: 960, out: K.outAt(t, T10.out - 0.4) });
    rise(ctx, wl(79).concat(wl(80)), 940, t, { size: 34, color: SILV, w: 'S', cx: 960, out: K.outAt(t, T10.out - 0.4) });
  }

  // ================================================================ ACT 11 · MARGIN — set by the regulator (153.6 → 177.9)
  const T11 = { flood: 153.6, learn: w(81, 0), margin: w(82, 0), reg: w(83, 2), rules: w(84, 0), rec: w(84, 5), eu: w(85, 2), uk: w(85, 4), au: w(85, 5), retail: w(86, 2), five: w(87, 4), others: w(88, 0), lower: w(89, 2), less: w(90, 2), risk: w(91, 0), check: w(92, 0), out: 177.85 };
  const gSl = { t0: T11.flood, t1: 178.05, from: { x: 960, y: 940 }, din: 0.36, paint: SH.paint.sw('slateD'), dim: 0.6, dark: true };
  SH.grounds.push(gSl);
  SH.cam.push([153.6, 1.05, 960, 550], [154.6, 1.0, 960, 540], [177.6, 1.05, 960, 540]);
  sfx(T11.flood, 'whoosh', 0.18, { d: 0.5 }); sfx(T11.margin - 0.05, 'pop', 0.16, { f: 760 }); sfx(T11.reg, 'tick', 0.12, { f: 2200 }); [T11.eu, T11.uk, T11.au].forEach((tt, i) => sfx(tt - 0.05, 'pop', 0.13, { f: 620 + i * 100, pan: 0.4 - i * 0.4 }));
  sfx(T11.five, 'slam', 0.16); sfx(T11.others - 0.05, 'pop', 0.12, { f: 520 }); sfx(T11.less, 'stretch', 0.12); sfx(T11.risk, 'buzz', 0.07); sfx(T11.check + 0.2, 'chime', 0.12);
  function act11(ctx, t) {
    if (t < T11.flood || t > T11.out + 0.5) return;
    rise(ctx, wl(81).concat(wl(82)), 150, t, { size: 44, color: WHITE, w: 'S', cx: 960, out: K.outAt(t, T11.rules - 0.5) });
    rise(ctx, wl(83), 220, t, { size: 34, color: '#E6ECEE', w: 'S', cx: 960, out: K.outAt(t, T11.rules - 0.5) });
    rise(ctx, wl(84), 150, t, { size: 36, color: '#E6ECEE', w: 'S', cx: 960, out: K.outAt(t, T11.eu - 0.6) });
    // margin gauge card
    const gp = sp(t, T11.margin - 0.1, 12, 0.6);
    if (gp > 0 && t < T11.eu - 0.2) popAt(ctx, 960, 560, gp, () => { GL.panel(ctx, 640, 380, 640, 360, 40, { tint: 'rgba(255,255,255,0.14)', edge: 'rgba(255,255,255,0.5)' }); txt(ctx, 'الهامش المطلوب', 1240, 450, { size: 34, w: 'B', color: WHITE });
      const v = 0.5 + 0.18 * Math.sin(t * 1.3); ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.arc(960, 650, 150, Math.PI, 2 * Math.PI); ctx.stroke(); ctx.strokeStyle = P.gold1; ctx.beginPath(); ctx.arc(960, 650, 150, Math.PI, Math.PI + Math.PI * v); ctx.stroke();
      txt(ctx, '؟', 960, 640, { size: 64, w: 'B', color: WHITE, align: 'center' }); const rq = eo(t, T11.reg, 0.4); if (rq > 0) { ctx.save(); ctx.globalAlpha *= rq; txt(ctx, 'حسب الجهة التنظيمية', 960, 712, { size: 26, w: 'S', color: '#E6ECEE', align: 'center' }); ctx.restore(); } });
    // EU · UK · AU → retail traders: margin ≥ 5% for gold (max 1:20)
    const regs = [['الاتحاد الأوروبي', T11.eu, 1380], ['بريطانيا', T11.uk, 960], ['أستراليا', T11.au, 540]];
    regs.forEach(([s2, tt, x]) => { const q = sp(t, tt - 0.1, 13, 0.55); if (q <= 0 || t > T11.out) return; popAt(ctx, x, 300, q, () => { const cw = A.measure(ctx, s2, 32, 'B') + 80; GL.panel(ctx, x - cw / 2, 258, cw, 84, 42, { tint: 'rgba(255,255,255,0.16)', edge: 'rgba(255,255,255,0.55)' }); txt(ctx, s2, x, 312, { size: 32, w: 'B', color: WHITE, align: 'center' }); }); });
    rise(ctx, wl(85, 0, 1), 200, t, { size: 30, color: '#E6ECEE', w: 'S', cx: 960, out: K.outAt(t, T11.out - 0.4) });
    rise(ctx, wl(86), 430, t, { size: 34, color: '#E6ECEE', w: 'S', cx: 960 });
    const fp = sp(t, T11.five - 0.08, 14, 0.5);
    if (fp > 0) popAt(ctx, 960, 590, fp, () => { lat(ctx, '≥ 5%', 960, 640, { size: 150, w: 300, color: WHITE, align: 'center' }); txt(ctx, 'هامش للذهب', 960, 700, { size: 32, w: 'S', color: P.gold0, align: 'center' }); txt(ctx, '= رافعة قصوى 1:20', 960, 748, { size: 26, w: 'S', color: '#E6ECEE', align: 'center', alpha: eo(t, T11.five + 0.6, 0.4) }); });
    rise(ctx, wl(87, 0, 3), 520, t, { size: 34, color: '#E6ECEE', w: 'S', cx: 960, out: K.outAt(t, T11.five - 0.15) });
    // other regulators may allow less · the less margin, the more risk
    const op = sp(t, T11.others - 0.1, 13, 0.55);
    if (op > 0) popAt(ctx, 1500, 600, op, () => { GL.panel(ctx, 1360, 540, 280, 120, 36, { tint: 'rgba(255,255,255,0.12)', edge: 'rgba(255,255,255,0.45)' }); txt(ctx, 'جهات ثانية', 1500, 586, { size: 28, w: 'B', color: WHITE, align: 'center' }); lat(ctx, '< 5%', 1500, 640, { size: 40, w: 600, color: '#FFB3B3', align: 'center', alpha: eo(t, T11.lower, 0.4) }); });
    rise(ctx, wl(88).concat(wl(89)), 860, t, { size: 36, color: WHITE, w: 'S', cx: 960, out: K.outAt(t, ph(90) - 0.5) });
    const bp = eo(t, T11.less - 0.3, 0.4);
    if (bp > 0) { const k = cio(t, T11.less, 1.6); ctx.save(); ctx.globalAlpha *= bp; [[420, 'الهامش', lerp(0.8, 0.25, k), WHITE], [560, 'المخاطرة', lerp(0.25, 0.9, k), '#FF6B7D']].forEach(([x, s2, v, col]) => { ctx.fillStyle = 'rgba(255,255,255,0.14)'; A.roundRect(ctx, x - 30, 480, 60, 260, 16); ctx.fill(); ctx.fillStyle = col; A.roundRect(ctx, x - 30, 480 + 260 * (1 - v), 60, 260 * v, 16); ctx.fill(); txt(ctx, s2, x, 790, { size: 26, w: 'S', color: WHITE, align: 'center' }); }); ctx.restore(); }
    rise(ctx, wl(90).concat(wl(91, 0, 1, { map: { 1: { color: '#FF8A97' } } })), 860, t, { size: 38, color: WHITE, w: 'S', cx: 960, out: K.outAt(t, T11.check - 0.6) });
    const cpk = sp(t, T11.check - 0.1, 14, 0.55); if (cpk > 0) popAt(ctx, 960, 900, cpk, () => { const pw = K.wordsWidth(wl(92), { size: 32, w: 'S' }) + 120; A.roundRect(ctx, 960 - pw / 2, 860, pw, 80, 40); ctx.fillStyle = WHITE; ctx.fill(); K.words(ctx, wl(92), 960 + pw / 2 - 74, 911, t, { size: 32, w: 'S', color: C.ink, mode: 'rise' }); FX.check(ctx, 960 + pw / 2 - 40, 900, 26, cio(t, T11.check + 0.3, 0.3), '#2A9C7B', t); });
  }

  // ================================================================ ACT 12 · LEVERAGE CUTS BOTH WAYS (177.9 → 196.1)
  const T12 = { flood: 177.85, warn: w(93, 1), lev: w(94, 0), amp: w(95, 0), prof: w(95, 1), loss: w(95, 2), m5: w(96, 1), adv: w(97, 0), five: w(97, 2), whole: w(98, 3), broker: w(99, 0), close: w(100, 1), prot: w(101, 0), more: w(101, 3), varies: w(102, 0), out: 196.0 };
  const gRd = { t0: T12.flood, t1: 196.25, from: { x: 960, y: 900 }, din: 0.36, paint: SH.paint.sw('roseD'), dim: 0.6, dark: true };
  SH.grounds.push(gRd);
  SH.cam.push([177.85, 1.05, 960, 540], [178.9, 1.0, 960, 540], [195.6, 1.06, 960, 550]);
  sfx(T12.flood, 'whoosh', 0.18, { d: 0.5 }); sfx(T12.warn, 'buzz', 0.08); sfx(T12.lev - 0.05, 'pop', 0.16, { f: 700 }); sfx(T12.amp, 'stretch', 0.14); sfx(T12.prof, 'tick', 0.1, { f: 2600 }); sfx(T12.loss, 'tick', 0.1, { f: 1600 });
  sfx(T12.m5 - 0.05, 'pop', 0.14, { f: 900 }); sfx(T12.adv, 'whoosh', 0.14, { d: 1.2, up: false }); sfx(T12.whole, 'slam', 0.16); sfx(T12.close, 'shutter', 0.18); sfx(T12.prot - 0.05, 'pop', 0.14, { f: 760 }); sfx(T12.varies, 'tick', 0.12, { f: 2200 });
  function act12(ctx, t) {
    if (t < T12.flood || t > T12.out + 0.5) return;
    rise(ctx, wl(93, 0, 1, { map: { 1: { color: '#FFC7CF', w: 'B' } } }), 150, t, { size: 46, color: WHITE, w: 'S', cx: 960, out: K.outAt(t, ph(96) - 0.55) });
    // the lens magnifies both sides equally
    const lp = sp(t, T12.lev - 0.1, 12, 0.55);
    if (lp > 0 && t < T12.m5 - 0.2) popAt(ctx, 960, 520, lp, () => {
      const k = lerp(1, 2.1, cio(t, T12.amp, 1.3)); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(560, 505, 800, 30);
      ctx.fillStyle = C.mint; ctx.fillRect(960, 505, 150 * k, 30); ctx.fillStyle = '#FF6B7D'; ctx.fillRect(960 - 150 * k, 505, 150 * k, 30);
      txt(ctx, 'الأرباح', 960 + 75 * k, 590, { size: 28, w: 'B', color: C.mint, align: 'center', alpha: eo(t, T12.prof, 0.3) }); txt(ctx, 'والخسائر', 960 - 75 * k, 590, { size: 28, w: 'B', color: '#FFB3BD', align: 'center', alpha: eo(t, T12.loss, 0.3) });
      ctx.strokeStyle = WHITE; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(960, 520, 120, 0, 6.283); ctx.stroke(); ctx.beginPath(); ctx.moveTo(1045, 605); ctx.lineTo(1130, 690); ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.arc(960, 520, 116, 0, 6.283); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill(); ctx.restore();
      txt(ctx, 'الرافعة', 960, 340, { size: 44, w: 'B', color: WHITE, align: 'center' });
    });
    rise(ctx, wl(95, 0, 4), 860, t, { size: 40, color: WHITE, w: 'S', cx: 960, out: K.outAt(t, T12.m5 - 0.4) });
    // 5% margin: a 5% adverse move wipes the whole margin; the broker may close the trade first
    const bp = eo(t, T12.m5 - 0.2, 0.4);
    if (bp > 0) {
      ctx.save(); ctx.globalAlpha *= bp; const bx = 360, by = 380, bw = 1200, bh = 320; GL.panel(ctx, bx, by, bw, bh, 36, { tint: 'rgba(255,255,255,0.12)', edge: 'rgba(255,255,255,0.45)' });
      txt(ctx, 'حجم الصفقة', bx + bw - 40, by + 66, { size: 30, w: 'B', color: WHITE });
      const pos = { x: bx + 60, y: by + 110, w: bw - 120, h: 70 }; ctx.fillStyle = 'rgba(255,255,255,0.16)'; A.roundRect(ctx, pos.x, pos.y, pos.w, pos.h, 14); ctx.fill();
      const mw = pos.w * 0.05 * 4; const drain = cio(t, T12.adv, T12.whole - T12.adv + 0.3); const mx = pos.x + pos.w - mw;
      ctx.fillStyle = P.gold1; A.roundRect(ctx, mx, pos.y, mw * (1 - drain), pos.h, 14); ctx.fill(); ctx.strokeStyle = WHITE; ctx.lineWidth = 2; A.roundRect(ctx, mx, pos.y, mw, pos.h, 14); ctx.stroke();
      txt(ctx, 'الهامش 5%', mx + mw / 2, pos.y + pos.h + 46, { size: 28, w: 'B', color: P.gold0, align: 'center' });
      const mv = eo(t, T12.adv - 0.1, 0.3); if (mv > 0) { ctx.save(); ctx.globalAlpha *= mv; lat(ctx, '−' + (5 * clamp(drain * 1.02)).toFixed(1) + '%', bx + 220, by + 270, { size: 64, w: 300, color: '#FF8A97', align: 'center' }); txt(ctx, 'حركة عكسية', bx + 220, by + 300, { size: 24, w: 'S', color: '#FFC7CF', align: 'center' }); ctx.restore(); }
      const lw = eo(t, T12.whole, 0.3); if (lw > 0) { ctx.save(); ctx.globalAlpha *= lw; txt(ctx, 'خسارة = الهامش كله', mx + mw / 2 - 120, by + 270, { size: 36, w: 'B', color: WHITE, align: 'center' }); ctx.restore(); }
      ctx.restore();
      // the broker closes the trade before that — a stamp
      const cs = sp(t, T12.close - 0.05, 16, 0.5); if (cs > 0 && t < T12.prot - 0.2) { ctx.save(); ctx.translate(1300, 380); ctx.rotate(-0.12); const k = lerp(1.6, 1, Math.min(1, cs)); ctx.scale(k, k); ctx.globalAlpha *= clamp(cs * 3); ctx.strokeStyle = WHITE; ctx.lineWidth = 5; A.roundRect(ctx, -150, -46, 300, 92, 18); ctx.stroke(); txt(ctx, 'إغلاق الصفقة', 0, 14, { size: 38, w: 'B', color: WHITE, align: 'center' }); ctx.restore(); }
    }
    rise(ctx, wl(96).concat(wl(97)), 150, t, { size: 42, color: WHITE, w: 'S', cx: 960, out: K.outAt(t, ph(99) - 0.5) });
    rise(ctx, wl(98, 0, 4, { map: { 1: { color: '#FFC7CF', w: 'B' } } }), 860, t, { size: 38, color: WHITE, w: 'S', cx: 960, out: K.outAt(t, T12.broker - 0.3) });
    rise(ctx, wl(99).concat(wl(100)), 150, t, { size: 42, color: WHITE, w: 'S', cx: 960, out: K.outAt(t, T12.prot - 0.3) });
    // negative-balance protection varies by regulator
    const pp = sp(t, T12.prot - 0.1, 13, 0.55);
    if (pp > 0) popAt(ctx, 960, 860, pp, () => { const pw = 980; GL.panel(ctx, 960 - pw / 2, 800, pw, 120, 60, { tint: 'rgba(255,255,255,0.16)', edge: 'rgba(255,255,255,0.5)' });
      ctx.strokeStyle = P.gold0; ctx.lineWidth = 4; const sx = 960 + pw / 2 - 70, sy = 860; ctx.beginPath(); ctx.moveTo(sx, sy - 30); ctx.lineTo(sx + 24, sy - 20); ctx.lineTo(sx + 24, sy + 2); ctx.quadraticCurveTo(sx + 24, sy + 24, sx, sy + 34); ctx.quadraticCurveTo(sx - 24, sy + 24, sx - 24, sy + 2); ctx.lineTo(sx - 24, sy - 20); ctx.closePath(); ctx.stroke();
      K.words(ctx, wl(101), 960 + pw / 2 - 120, 852, t, { size: 32, w: 'S', color: WHITE, mode: 'rise' }); K.words(ctx, wl(102), 960 + pw / 2 - 120, 898, t, { size: 26, w: 'S', color: '#FFC7CF', mode: 'rise' }); });
  }

  // ================================================================ ACT 13 · SELL FIRST — the phone returns (196.0 → 213.6)
  const T13 = { in: 195.7, sell: w(103, 1), buy: w(104, 0), mt5: w(105, 1), open: w(106, 0), press: w(106, 2), noOwn: w(106, 5), acct: w(107, 0), win: w(108, 0), down: w(108, 2), loseT: w(109, 0), up: w(109, 2), cost: w(110, 0), theo: w(111, 0), sky: w(112, 1), out: 213.5 };
  const PH13 = { x: 1180, y: 160, w: 470, h: 860, r: 60 };
  const gRd2 = gRd; gRd2.to = { x: PH13.x, y: PH13.y, w: PH13.w, h: PH13.h, r: PH13.r }; gRd2.dout = 0.6; gRd2.t1 = 196.35;
  SH.cam.push([196.0, 1.06, 960, 550], [197.0, 1.0, 960, 560], [210.0, 1.0, 960, 560], [212.9, 1.06, 1080, 440]);
  sfx(T13.sell - 0.05, 'pop', 0.15, { f: 600 }); sfx(T13.buy - 0.05, 'pop', 0.15, { f: 900 }); sfx(T13.mt5 - 0.05, 'whoosh', 0.12, { d: 0.4 }); sfx(T13.press, 'click', 0.2); sfx(T13.press + 0.04, 'pop', 0.16, { f: 700 }); sfx(T13.press + 0.4, 'chime', 0.12);
  sfx(T13.down, 'whoosh', 0.12, { d: 0.8, up: false }); sfx(T13.down + 0.6, 'tick', 0.12, { f: 2600 }); sfx(T13.up, 'whoosh', 0.12, { d: 0.8 }); sfx(T13.up + 0.6, 'buzz', 0.07); sfx(T13.sky - 0.5, 'riser', 0.12, { d: 1.2 });
  function act13(ctx, t) {
    if (t < T13.in || t > T13.out + 0.5) return;
    const pz = PH13; const live = t > 196.3;
    // the phone (glass) with a MetaTrader-style ticket
    if (live) {
      ctx.save(); ctx.shadowColor = 'rgba(20,24,30,0.22)'; ctx.shadowBlur = 80; ctx.shadowOffsetY = 30; A.roundRect(ctx, pz.x, pz.y, pz.w, pz.h, pz.r); ctx.fillStyle = 'rgba(255,255,255,0.01)'; ctx.fill(); ctx.restore();
      GL.panel(ctx, pz.x, pz.y, pz.w, pz.h, pz.r, { tint: 'rgba(250,250,248,0.78)', shadow: false });
      A.roundRect(ctx, pz.x - 5.5, pz.y - 5.5, pz.w + 11, pz.h + 11, pz.r + 5.5); ctx.strokeStyle = C.ink; ctx.lineWidth = 11; ctx.stroke();
      lat(ctx, '9:41', pz.x + 52, pz.y + 52, { size: 22, w: 600, color: C.ink }); A.roundRect(ctx, pz.x + pz.w / 2 - 56, pz.y + 18, 112, 32, 16); ctx.fillStyle = C.ink; ctx.fill();
      const mp = eo(t, T13.mt5 - 0.1, 0.4); ctx.save(); ctx.globalAlpha *= mp; lat(ctx, 'MetaTrader 5', pz.x + pz.w / 2, pz.y + 116, { size: 26, w: 700, color: C.ink, align: 'center' }); ctx.restore();
      lat(ctx, 'XAU/USD', pz.x + pz.w - 40, pz.y + 186, { size: 34, w: 700, color: C.ink, align: 'right' });
      // live chart inside the phone: sideways, then the sell scenario (down = profit), then up = loss, then «no ceiling»
      const cx0 = pz.x + 30, cx1 = pz.x + pz.w - 30, cyb = pz.y + 420; const dn = cio(t, T13.down - 0.2, 1.1), up = cio(t, T13.up - 0.2, 1.1), sky = cio(t, T13.sky - 0.6, 1.4);
      const yAt = (u) => cyb - Math.sin(u * 9 + 1) * 18 - Math.sin(u * 23) * 6 + (u > 0.6 ? (u - 0.6) / 0.4 * (110 * dn - 220 * up - 520 * sky) : 0);
      ctx.save(); ctx.beginPath(); ctx.rect(cx0 - 20, pz.y - 2000, cx1 - cx0 + 40, pz.y + 2000 + 560 - 0); ctx.clip(); ctx.beginPath(); for (let k = 0; k <= 80; k++) { const u = k / 80; const x = lerp(cx1, cx0, u), y = yAt(u); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.strokeStyle = up > 0.05 ? mixHex(P.gold2, C.red, up) : mixHex(P.gold2, '#2A9C7B', dn); ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
      // entry line of the sell
      const ent = eo(t, T13.press + 0.1, 0.3); if (ent > 0) { ctx.save(); ctx.globalAlpha *= ent; ctx.strokeStyle = C.red; ctx.setLineDash([8, 6]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx0, yAt(0.6)); ctx.lineTo(cx1, yAt(0.6)); ctx.stroke(); ctx.setLineDash([]); txt(ctx, 'دخول بيع', cx1, yAt(0.6) - 12, { size: 20, w: 'S', color: C.red }); ctx.restore(); }
      // buttons: SELL (red) · BUY (gold)
      const by = pz.y + pz.h - 170; const press = 1 - 0.12 * Math.exp(-Math.pow((t - T13.press) / 0.08, 2));
      ctx.save(); ctx.translate(pz.x + pz.w * 0.73, by); ctx.scale(press, press); A.roundRect(ctx, -95, -40, 190, 80, 24); ctx.fillStyle = C.red; ctx.fill(); txt(ctx, 'بيع', 0, 12, { size: 34, w: 'B', color: WHITE, align: 'center' }); ctx.restore();
      A.roundRect(ctx, pz.x + pz.w * 0.27 - 95, by - 40, 190, 80, 24); ctx.fillStyle = GL.goldFlat(ctx, by - 40, by + 40); ctx.fill(); txt(ctx, 'شراء', pz.x + pz.w * 0.27, by + 12, { size: 34, w: 'B', color: '#2B2107', align: 'center' });
      const ok = eo(t, T13.press + 0.35, 0.3); if (ok > 0) { ctx.save(); ctx.globalAlpha *= ok; FX.check(ctx, pz.x + pz.w - 60, pz.y + pz.h - 70, 26, 1, '#2A9C7B', t); txt(ctx, 'صفقة بيع مفتوحة', pz.x + pz.w - 90, pz.y + pz.h - 60, { size: 24, w: 'S', color: C.ink }); ctx.restore(); }
      // P/L chip
      const pl = (dn > 0.02 && up < 0.02) ? 1 : 0; const pn = up > 0.02 ? 1 : 0;
      if (pl || pn) { const good = pl && !pn; const x = pz.x + pz.w / 2, y = pz.y + 520; A.roundRect(ctx, x - 120, y - 34, 240, 68, 34); ctx.fillStyle = good ? '#DFF7EF' : '#FFE1E5'; ctx.fill(); txt(ctx, good ? 'ربح' : 'خسارة', x, y + 11, { size: 30, w: 'B', color: good ? '#1F7A5F' : C.red, align: 'center' }); }
    }
    // left side: the words
    const ord = (n, s2, col, x, y, tt) => { const q = sp(t, tt - 0.08, 14, 0.55); if (q <= 0) return; popAt(ctx, x, y, q, () => { A.roundRect(ctx, x - 110, y - 44, 220, 88, 44); ctx.fillStyle = col; ctx.fill(); txt(ctx, s2, x + 20, y + 13, { size: 36, w: 'B', color: col === C.red ? WHITE : '#2B2107', align: 'center' }); lat(ctx, n, x - 66, y + 13, { size: 28, w: 800, color: col === C.red ? WHITE : '#2B2107', align: 'center' }); }); };
    if (t < T13.mt5 + 0.2) { ord('1', 'بيع', C.red, 760, 520, T13.sell); ord('2', 'شراء', P.gold1, 440, 520, T13.buy); const ar = eo(t, T13.buy, 0.3); if (ar > 0) { ctx.save(); ctx.globalAlpha *= ar; ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(640, 520); ctx.lineTo(565, 520); ctx.moveTo(580, 506); ctx.lineTo(565, 520); ctx.lineTo(580, 534); ctx.stroke(); ctx.restore(); } }
    rise(ctx, wl(103).concat(wl(104)), 380, t, { size: 46, color: C.ink, w: 'S', cx: 600, out: K.outAt(t, ph(105) - 0.5) });
    rise(ctx, wl(105, 0, 2).concat(wl(106)), 380, t, { size: 40, color: C.ink, w: 'S', cx: 600, out: K.outAt(t, ph(107) - 0.5) });
    rise(ctx, wl(107), 380, t, { size: 38, color: C.slate, w: 'S', cx: 600, out: K.outAt(t, ph(108) - 0.5) });
    rise(ctx, wl(108, 0, 3, { map: { 0: { color: '#1F7A5F', w: 'B' } } }), 380, t, { size: 44, color: C.ink, w: 'S', cx: 600, out: K.outAt(t, ph(111) - 0.5) });
    rise(ctx, wl(109, 0, 2, { map: { 0: { color: C.red, w: 'B' } } }), 470, t, { size: 44, color: C.ink, w: 'S', cx: 600, out: K.outAt(t, ph(111) - 0.5) });
    rise(ctx, wl(110), 560, t, { size: 32, color: C.slate, w: 'S', cx: 600, out: K.outAt(t, ph(111) - 0.5) });
    rise(ctx, wl(111).concat(wl(112, 0, 3, { map: { 2: { color: C.red, w: 'B' }, 3: { color: C.red, w: 'B' } } })), 380, t, { size: 44, color: C.ink, w: 'S', cx: 600 });
  }

  // ================================================================ ACT 14 · SUMMARY on the black page → the red dot (213.5 → CLOSE)
  const T14 = { btn: w(113, 0) - 0.45, page: w(113, 0) + 0.45, s1: w(114, 0), risk: w(115, 0), why: w(116, 0), next: w(117, 0), more: w(118, 0), guide: w(119, 0) };
  const BTN = { x: 960 - 190, y: 700, w: 380, h: 96, r: 48 };
  const gEnd = { t0: T14.page, t1: F.CLOSE - 0.05, fromRect: BTN, din: 0.6, paint: SH.paint.ink, dim: 0.9, dark: true, to: { x: 960 - 7, y: 540 - 7, w: 14, h: 14, r: 7 }, dout: 0.55 };
  SH.grounds.push(gEnd);
  SH.cam.push([213.5, 1.06, 1080, 440], [214.6, 1.0, 960, 560], [215.4, 1.0, 960, 540], [F.CLOSE - 0.6, 1.04, 960, 540], [F.CLOSE, 1.0, 960, 540]);
  sfx(T14.btn, 'pop', 0.18, { f: 820 }); sfx(T14.page - 0.02, 'whoosh', 0.22, { d: 0.7 }); sfx(T14.page + 0.55, 'impact', 0.14); sfx(T14.risk, 'buzz', 0.06); sfx(T14.why, 'whoosh', 0.1, { d: 1.2 }); sfx(T14.guide + 0.4, 'bloop', 0.1); sfx(T14.guide + 0.8, 'bloop', 0.1);
  function act14(ctx, t) {
    if (t < T14.btn - 0.1) return;
    // the black pill «خلاصة الدرس» — it expands into the page; its label grows to headline size, then slides away
    if (t < T14.page) { const p = sp(t, T14.btn, 14, 0.55); popAt(ctx, BTN.x + BTN.w / 2, BTN.y + BTN.h / 2, p, () => { A.roundRect(ctx, BTN.x, BTN.y, BTN.w, BTN.h, BTN.r); ctx.fillStyle = C.ink; ctx.fill(); }); }
    const grow = cio(t, T14.page, 0.7), away = cio(t, T14.s1 - 0.35, 0.4);
    if (t < T14.s1 + 0.2) { const y = lerp(BTN.y + BTN.h / 2 + 12, 560, grow) - away * 160; const sz = lerp(36, 110, grow); ctx.save(); ctx.globalAlpha *= 1 - away; ctx.translate(960, y); const k = sz / 36; ctx.scale(k, k); K.words(ctx, wl(113), K.wordsWidth(wl(113), { size: 36, w: 'S' }) / 2, 0, t, { size: 36, w: 'S', color: WHITE, mode: 'rise' }); ctx.restore(); }
    // the summary, word by word (white on black)
    rise(ctx, wl(114, 0, 5), 430, t, { size: 72, color: WHITE, w: 'S', cx: 960, out: K.outAt(t, ph(116) - 0.5) });
    rise(ctx, wl(114, 6, 10), 540, t, { size: 72, color: WHITE, w: 'S', cx: 960, out: K.outAt(t, ph(116) - 0.5) });
    rise(ctx, wl(115, 0, 2, { map: { 1: { color: '#FF5C70', w: 'B' }, 2: { color: '#FF5C70', w: 'B' } } }), 680, t, { size: 72, color: WHITE, w: 'S', cx: 960, out: K.outAt(t, ph(116) - 0.5) });
    // teaser: why does gold go up and down?
    const tz = eo(t, T14.why - 0.1, 0.4) * (1 - cio(t, T14.more - 0.5, 0.4));
    if (tz > 0) { ctx.save(); ctx.globalAlpha *= tz; ctx.beginPath(); for (let k = 0; k <= 120; k++) { const u = k / 120; const x = lerp(1560, 360, u), y = 640 - Math.sin(u * 10 + t * 2.2) * 60 * Math.sin(u * Math.PI); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.strokeStyle = P.gold1; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore(); }
    rise(ctx, wl(116, 0, 5, { keepQ: true, map: { 2: { color: P.gold0, w: 'B' } } }), 440, t, { size: 64, color: WHITE, w: 'S', cx: 960, out: K.outAt(t, T14.more - 0.5) });
    rise(ctx, wl(117), 820, t, { size: 46, color: SILV, w: 'S', cx: 960, out: K.outAt(t, T14.more - 0.5) });
    // the free written guide, below the video
    rise(ctx, wl(118).concat(wl(119)), 520, t, { size: 62, color: WHITE, w: 'S', cx: 960, out: K.outAt(t, F.CLOSE - 0.75) });
    const ga = eo(t, T14.guide + 0.3, 0.3) * (1 - cio(t, F.CLOSE - 0.75, 0.3)); if (ga > 0) { const bb = Math.abs(Math.sin((t - T14.guide) * 6)) * 18; ctx.save(); ctx.globalAlpha *= ga; ctx.translate(960, 700 + bb); ctx.fillStyle = P.gold1; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.lineTo(0, 40); ctx.closePath(); ctx.fill(); ctx.fillRect(-8, -56, 16, 58); ctx.restore(); }
    // the red dot the page collapses into (hands over to the X sting)
    const dp = cio(t, F.CLOSE - 0.5, 0.45); if (dp > 0) { ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(960, 540, 14 * dp, 0, 6.283); ctx.fill(); }
  }

  SH.sec.push({ t0: T9.in, t1: T9.out + 0.6, front: act9 }, { t0: T10.page, t1: T10.out + 0.6, front: act10 }, { t0: T11.flood, t1: T11.out + 0.6, front: act11 }, { t0: T12.flood, t1: T12.out + 0.6, front: act12 }, { t0: T13.in, t1: T13.out + 0.6, front: act13 }, { t0: T14.btn - 0.2, t1: F.CLOSE + 0.01, front: act14 });
  const n = SH.sec.length; SH.sec[n - 6].coverBy = gInk; SH.sec[n - 5].coverBy = gSl; SH.sec[n - 4].coverBy = gRd; SH.sec[n - 3].shrinkWith = gRd; SH.sec[n - 2].coverBy = gEnd; SH.sec[n - 1].shrinkWith = gEnd;
  F.addClose();
})(typeof window !== 'undefined' ? window : globalThis);
