// Lesson 18 · part 1 — the hook (the first question types out of the caret → «هل هذا الوسيط مرخّص؟» → the pill → a click
// → the agenda), John's profile + the leverage widget (CFD · margin · magnified P/L · a small capital that drains), the
// due-diligence checklist, the register vs the broker's site, «licence ≠ no loss», protection by entity/residence (globe),
// the choice.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, Q = G.SAAS;
  const { W, H, C, clamp, lerp, hexA, txt, lat, measure } = A;
  const { P, E, EI, EIO, sp, xo, outP, wheels, wheelSeq, typeLine, panel, cap } = Q;
  const w = F.w, sfx = F.sfx, wl = F.wl;
  const latW = (s, size, wgt = 600) => { const c = document.createElement('canvas').getContext('2d'); c.font = `${wgt} ${size}px IN`; return c.measureText(s).width; };
  G.L18 = {};
  const typeSfx = (words, g = 0.09) => words.forEach((x) => sfx(x.t, 'type', g, { d: Math.min(0.36, 0.035 * x.s.length + 0.04), n: Math.max(2, Math.ceil(x.s.length * 0.6)) }));
  // small helpers shared by the parts
  function chip(ctx, s, x, y, k, o = {}) { // rounded label chip centred at x,y
    if (k <= 0) return 0; const size = o.size || 22; const ww = measure(ctx, s, size, 'S') + size * 1.6, hh = size * 2;
    ctx.save(); ctx.globalAlpha *= clamp(k * 2) * (o.alpha == null ? 1 : o.alpha); ctx.translate(x, y); const sc = lerp(0.7, 1, Math.min(1, k)); ctx.scale(sc, sc);
    A.roundRect(ctx, -ww / 2, -hh / 2, ww, hh, hh / 2); ctx.fillStyle = o.fill || 'rgba(22,23,27,0.95)'; ctx.fill(); ctx.strokeStyle = o.stroke || hexA(P.acc, 0.8); ctx.lineWidth = 1.5; ctx.stroke();
    txt(ctx, s, 0, size * 0.36, { size, w: 'S', color: o.color || P.white, align: 'center' }); ctx.restore(); return ww;
  }
  function tick(ctx, x, y, r, p, col = P.acc, ink = '#090A0D') { // a check in a circle (p 0..1)
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); if (p > 0) { ctx.fillStyle = hexA(col, 0.18 + 0.82 * Math.min(1, p)); ctx.fill(); } else { ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2; ctx.stroke(); }
    if (p > 0) { ctx.strokeStyle = ink; ctx.lineWidth = r * 0.22; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; const a = [x - r * 0.45, y + 0.02 * r], b = [x - r * 0.1, y + r * 0.35], c = [x + r * 0.5, y - r * 0.35]; ctx.beginPath(); ctx.moveTo(a[0], a[1]); if (p < 0.5) ctx.lineTo(lerp(a[0], b[0], p * 2), lerp(a[1], b[1], p * 2)); else { ctx.lineTo(b[0], b[1]); ctx.lineTo(lerp(b[0], c[0], Math.min(1, (p - 0.5) * 2)), lerp(b[1], c[1], Math.min(1, (p - 0.5) * 2))); } ctx.stroke(); }
    ctx.restore();
  }
  function avatar(ctx, x, y, r, o = {}) { // generic person mark (no likeness): head + shoulders inside a ring
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fillStyle = o.fill || '#1E2024'; ctx.fill(); ctx.clip();
    ctx.fillStyle = o.ink || '#8FA6AE'; ctx.beginPath(); ctx.arc(x, y - r * 0.18, r * 0.34, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.ellipse(x, y + r * 0.78, r * 0.68, r * 0.52, 0, 0, 6.283); ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.strokeStyle = o.ring || P.acc; ctx.lineWidth = o.lw || 3; ctx.stroke();
  }
  Object.assign(G.L18, { chip, tick, avatar, latW, typeSfx });

  // ================================================================ A · the hook
  const TA = { q0: w(0, 0), q1: w(1, 0), lic: w(1, 2), yes: w(1, 3), no: w(1, 4), qEnd: F.phe(1), click: w(2, 2), up: w(3, 0), a1: w(3, 3), a1b: w(3, 4), a2: w(4, 2), a2b: w(4, 3), a3: w(5, 1), a3b: w(5, 2), out: w(6, 0) - 0.45 };
  TA.pop = w(2, 0) - 0.12;
  const Q0 = [['ما', w(0, 0)], ['أول', w(0, 1)], ['سؤال', w(0, 2)], ['يجب', w(0, 3)], ['أن', w(0, 3) + 0.26], ['تسأله', w(0, 4)], ['قبل', w(0, 5)], ['أن', w(0, 6)], ['تودع', w(0, 7)], ['أول', w(0, 8)], ['دولار؟', w(0, 9)]].map(([s, t]) => ({ s, t }));
  const Q1 = [{ s: 'هل', t: w(1, 0) - 0.06 }, { s: 'هذا', t: w(1, 0) + 0.12 }, { s: 'الوسيط', t: w(1, 1) }, { s: 'مرخّص؟', t: w(1, 2), col: P.acc }];
  const PART = (() => { const r = A.rng(1818); return Array.from({ length: 56 }, () => ({ a: r() * 6.283, v: 380 + r() * 720, s: 2 + r() * 3, d: r() * 0.15 })); })();
  const AG = [{ n: '01', t: 'فحص الوسيط', s: 'الترخيص والجهة التنظيمية', t0: TA.a1, t1: TA.a1b, x: 1440 }, { n: '02', t: 'الحساب التجريبي', s: 'تدرّب أولاً', t0: TA.a2, t1: TA.a2b, x: 960 }, { n: '03', t: 'أخطاء المبتدئين', s: 'أربعة أخطاء شائعة', t0: TA.a3, t1: TA.a3b, x: 480 }];
  typeSfx(Q0); typeSfx(Q1, 0.1);
  sfx(TA.q1 - 0.1, 'whoosh', 0.12, { d: 0.35 }); sfx(TA.yes, 'pop', 0.14, { f: 900 }); sfx(TA.no, 'pop', 0.14, { f: 640 });
  sfx(TA.qEnd + 0.05, 'whoosh', 0.16, { d: 0.42, up: false }); sfx(TA.pop - 0.02, 'pop', 0.3, { f: 980 }); sfx(TA.pop, 'chime', 0.12);
  sfx(TA.click - 0.9, 'riser', 0.12, { d: 0.9 }); sfx(TA.click, 'click', 0.3); sfx(TA.click + 0.01, 'ripple', 0.4); sfx(TA.click + 0.02, 'impact', 0.22);
  sfx(TA.up - 0.05, 'whoosh', 0.12, { d: 0.5 }); AG.forEach((g, i) => { sfx(g.t0 - 0.05, 'whoosh', 0.09, { d: 0.25, pan: (g.x - 960) / 1400 }); sfx(g.t0 + 0.04, 'pop', 0.16, { f: 700 + i * 90, pan: (g.x - 960) / 1400 }); });
  sfx(TA.out, 'whoosh', 0.14, { d: 0.4 });

  Q.scn({ t0: 2.05, t1: TA.out + 0.8, draw(ctx, t) {
    const ha = clamp((t - 2.05) / 0.3) * outP(t, TA.up, 0.3);
    if (ha > 0) cap(ctx, 'AXI ACADEMY  ·  18 / 18', 960, 76, { alpha: ha, color: P.faint });
    // 1 · the first question, typed out of the caret; it rises when the second one starts
    const sq = EIO(t, TA.qEnd + 0.08, 0.38);
    if (t < TA.qEnd + 0.6) {
      ctx.save(); ctx.translate(960, 540); ctx.scale(lerp(1, 0.02, sq), lerp(1, 0.3, sq)); ctx.translate(-960, -540);
      const k = EIO(t, TA.q1 - 0.15, 0.5); const y = lerp(560, 360, k), s = lerp(1, 0.62, k);
      ctx.save(); ctx.translate(960, y); ctx.scale(s, s); ctx.globalAlpha = lerp(1, 0.6, k); typeLine(ctx, Q0, 0, 0, 64, t, { center: true, caret: t < TA.q1 - 0.1 }); ctx.restore();
      if (t >= TA.q1 - 0.1) typeLine(ctx, Q1, 960, 590, 92, t, { center: true, caret: true });
      const yk = sp(t, TA.yes, 15, 0.66), nk = sp(t, TA.no, 15, 0.66);
      if (yk > 0) { const blink = (t - TA.no) > 0 ? (Math.floor((t - TA.no) * 6) % 2) : 0; chip(ctx, 'نعم', 1040, 720, yk, { size: 30, stroke: blink ? hexA(P.acc, 0.3) : P.acc }); chip(ctx, 'لا', 880, 720, nk, { size: 30, stroke: blink ? P.acc : hexA(P.acc, 0.3) }); }
      ctx.restore();
      if (sq > 0) { const half = lerp(620, 24, sq) * (1 - EI(t, TA.qEnd + 0.42, 0.12)); ctx.save(); ctx.globalAlpha = clamp(sq * 3); ctx.beginPath(); ctx.moveTo(960 - half, 540); ctx.lineTo(960 + half, 540); Q.glowStroke(ctx, P.acc, 5); ctx.restore(); }
    }
    const fl = Math.exp(-Math.pow((t - (TA.pop - 0.03)) / 0.07, 2));
    if (fl > 0.01) { const g = ctx.createRadialGradient(960, 540, 0, 960, 540, 700); g.addColorStop(0, hexA('#EEF6F8', 0.8 * fl)); g.addColorStop(1, hexA('#EEF6F8', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    // 2 · the click: a steel tint, radar rings, sparks
    const lc = t - TA.click;
    if (lc > 0 && lc < 2.4) {
      const tint = Math.exp(-lc * 2.2) * clamp(lc * 8); const g = ctx.createRadialGradient(960, 540, 0, 960, 540, 300 + lc * 1900);
      g.addColorStop(0, hexA(P.acc, 0.24 * tint)); g.addColorStop(0.7, hexA(P.slate, 0.12 * tint)); g.addColorStop(1, hexA(P.slate, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 4; i++) { const a = lc - i * 0.16; if (a <= 0 || a > 1.8) continue; ctx.save(); ctx.globalAlpha = (1 - a / 1.8) * 0.7; ctx.strokeStyle = i % 2 ? '#FFFFFF' : P.coral; ctx.lineWidth = i % 2 ? 1.5 : 2.5; ctx.beginPath(); ctx.arc(960, 540, 60 + 980 * xo(a / 1.8), 0, 6.283); ctx.stroke(); ctx.restore(); }
      for (const p of PART) { const a = lc - p.d; if (a <= 0 || a > 1.2) continue; const r = 70 + p.v * xo(a / 1.2) * 0.9; ctx.globalAlpha = (1 - a / 1.2); ctx.fillStyle = P.acc; ctx.beginPath(); ctx.arc(960 + Math.cos(p.a) * r, 540 + Math.sin(p.a) * r * 0.8, p.s, 0, 6.283); ctx.fill(); }
      ctx.globalAlpha = 1;
    }
    // 3 · the pill: «قبل أول إيداع» (rises to the top), the «final lesson» badge
    const pk = sp(t, TA.pop, 13, 0.55);
    if (pk > 0) {
      const u = EIO(t, TA.up, 0.6), py = lerp(540, 112, u), ps = lerp(1.2, 0.78, u); const ex = outP(t, TA.out + 0.1, 0.35);
      const bump = 1 - 0.06 * Math.exp(-Math.pow((t - TA.click - 0.04) / 0.05, 2));
      ctx.save(); ctx.globalAlpha = ex; ctx.translate(0, -60 * (1 - ex)); Q.pill(ctx, 960, py, 'قبل', 'أول إيداع', { k: pk * ps * bump, glow: lerp(1, 0.45, u), size: 44 });
      const bk = sp(t, TA.click + 0.12, 14, 0.7);
      if (bk > 0) {
        const by = py + lerp(110, 80, u); const s1 = 'الدرس الأخير', s2 = '18 / 18', w1 = measure(ctx, s1, 24, 'S'), w2 = latW(s2, 20, 700) + 6; const tot = 18 + 14 + w1 + 30 + w2; let x = 960 + tot / 2;
        ctx.save(); ctx.globalAlpha *= clamp(bk * 2); ctx.translate(0, (1 - Math.min(1, bk)) * 16);
        ctx.fillStyle = P.red; ctx.beginPath(); ctx.arc(x - 8, by - 8, 7, 0, 6.283); ctx.fill(); x -= 30;
        txt(ctx, s1, x, by, { size: 24, w: 'S', color: P.white }); x -= w1 + 14; lat(ctx, '·', x - 4, by, { size: 22, w: 700, color: P.faint, align: 'right' }); x -= 22;
        lat(ctx, s2, x, by, { size: 20, w: 700, color: P.acc, align: 'right', track: 2 }); ctx.restore();
      }
      ctx.restore();
    }
    if (t > TA.pop + 0.1 && t < TA.click + 0.6) {
      const m = EIO(t, TA.pop + 0.12, TA.click - TA.pop - 0.17); const x = lerp(1420, 1012, m), y = lerp(1000, 566, m) + Math.sin(m * 3.1) * -40;
      const pr = Math.exp(-Math.pow((t - TA.click) / 0.06, 2)); ctx.save(); ctx.globalAlpha = outP(t, TA.click + 0.3, 0.25); FX.cursor(ctx, x, y, pr, '#FFFFFF'); ctx.restore();
    }
    // 4 · the agenda
    for (const [i, g] of AG.entries()) {
      const k = sp(t, g.t0, 14, 0.62); if (k <= 0) continue; const o = EI(t, TA.out + i * 0.06, 0.35); if (o >= 1) continue;
      const cx = g.x, cy = 420; ctx.save(); ctx.globalAlpha = clamp(k * 2) * (1 - o); ctx.translate(0, (1 - Math.min(1, k)) * 60 - 90 * o);
      panel(ctx, cx - 210, cy - 80, 420, 160, { r: 20, fill: 'rgba(22,23,27,0.92)' });
      lat(ctx, g.n, cx - 180, cy - 34, { size: 20, w: 700, color: P.acc, track: 2 }); ctx.fillStyle = P.acc; ctx.fillRect(cx - 180, cy - 22, 26 * clamp((t - g.t0) / 0.3), 2);
      txt(ctx, g.t, cx + 180, cy + 6, { size: 38, w: 'S', color: P.white });
      txt(ctx, g.s, cx + 180, cy + 50, { size: 23, w: 'R', color: P.dim, alpha: clamp((t - g.t1) / 0.25) });
      ctx.restore();
    }
  } });

  // ================================================================ B · John + leverage
  const TB = { john: w(6, 0), fict: w(7, 1), cap: w(8, 1), low: w(8, 2), saw: w(9, 0), cfd: w(9, 2), trade: w(9, 5), amt: w(9, 6), small: w(9, 7), value: w(9, 9), lev: w(10, 0),
    but: w(11, 0), mag: w(11, 3), loss: w(11, 4), profit: w(11, 6), capS: w(12, 0), drain: w(13, 1), fast: w(13, 2), care: w(14, 0), trait: w(14, 2), out: w(15, 0) - 0.3 };
  G.L18.TB = TB;
  sfx(TB.john - 0.1, 'whoosh', 0.14, { d: 0.45 }); sfx(TB.john + 0.05, 'pop', 0.2, { f: 760 }); sfx(TB.fict, 'tick', 0.12, { f: 2600 }); sfx(TB.low, 'pop', 0.14, { f: 600 });
  sfx(TB.cfd - 0.05, 'whoosh', 0.12, { d: 0.4, pan: -0.3 }); sfx(TB.cfd, 'pop', 0.14, { f: 820, pan: -0.3 }); sfx(TB.trade, 'stretch', 0.12); sfx(TB.trade + 0.1, 'type', 0.1, { d: 0.45, n: 6 });
  sfx(TB.small, 'stretch', 0.1); sfx(TB.lev, 'click', 0.18); sfx(TB.lev + 0.05, 'chime', 0.1);
  sfx(TB.mag, 'stretch', 0.14); sfx(TB.loss, 'pop', 0.14, { f: 520 }); sfx(TB.profit, 'pop', 0.14, { f: 880 }); sfx(TB.drain - 0.05, 'type', 0.1, { d: 0.9, n: 12 }); sfx(TB.fast, 'glitch', 0.12);
  sfx(TB.care, 'whoosh', 0.12, { d: 0.4 }); sfx(TB.trait, 'pop', 0.16, { f: 900 }); sfx(TB.out, 'whoosh', 0.14, { d: 0.45 });
  function profile(ctx, t, x, y, o = {}) { // John's card (right-anchored at x), compact when o.compact
    const k = sp(t, TB.john, 13, 0.66); if (k <= 0) return; const wv = 520, hv = 560;
    ctx.save(); ctx.globalAlpha *= clamp(k * 2) * (o.alpha == null ? 1 : o.alpha); ctx.translate(0, (1 - Math.min(1, k)) * 70);
    panel(ctx, x - wv, y, wv, hv, { r: 26, fill: 'rgba(20,21,25,0.96)' });
    avatar(ctx, x - wv / 2, y + 120, 74);
    txt(ctx, 'جون', x - wv / 2, y + 252, { size: 52, w: 'S', color: P.white, align: 'center' });
    const fk = sp(t, TB.fict, 14, 0.7); if (fk > 0) chip(ctx, 'شخصية خيالية', x - wv / 2, y + 302, fk, { size: 20, stroke: 'rgba(255,255,255,0.2)', color: P.dim });
    ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(x - wv + 36, y + 350, wv - 72, 1);
    // capital row
    const ck = clamp((t - TB.cap + 0.1) / 0.3);
    if (ck > 0) {
      ctx.save(); ctx.globalAlpha *= ck; txt(ctx, 'رأس المال', x - 40, y + 400, { size: 24, w: 'R', color: P.dim });
      const dr = EIO(t, TB.drain - 0.1, 1.1); const v = lerp(1000, 180, dr); const red = clamp((t - TB.drain + 0.1) / 0.3);
      lat(ctx, '$' + Math.round(v).toLocaleString('en-US'), x - wv + 40, y + 402, { size: 34, w: 700, color: A.mixHex('#FFFFFF', '#FF3745', red) });
      const lk = sp(t, TB.low, 15, 0.7); if (lk > 0) chip(ctx, 'قليل', x - 230, y + 392, lk, { size: 20 });
      A.roundRect(ctx, x - wv + 40, y + 430, wv - 80, 12, 6); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill();
      const bw = (wv - 80) * 0.24 * (1 - 0.82 * dr); A.roundRect(ctx, x - 40 - bw, y + 430, bw, 12, 6); ctx.fillStyle = A.mixHex(P.acc, C.red, red); ctx.fill();
      ctx.restore();
    }
    // temperament row
    const tk = clamp((t - TB.care + 0.1) / 0.3);
    if (tk > 0) { ctx.save(); ctx.globalAlpha *= tk; txt(ctx, 'الطبع', x - 40, y + 500, { size: 24, w: 'R', color: P.dim }); const k2 = sp(t, TB.trait, 15, 0.7); if (k2 > 0) chip(ctx, 'حذر جداً', x - wv + 130, y + 492, k2, { size: 22 }); ctx.restore(); }
    ctx.restore();
  }
  G.L18.profile = profile;
  Q.scn({ t0: TB.john - 0.2, t1: TB.out + 0.7, draw(ctx, t) {
    const ex = EIO(t, TB.out, 0.6); if (ex >= 1) return;
    // the profile card: centre stage first, slides right when the widget arrives, back to the centre for «حذر»
    const slide = EIO(t, TB.saw - 0.2, 0.7) * (1 - EIO(t, TB.care - 0.25, 0.7));
    ctx.save(); ctx.globalAlpha = 1 - ex; ctx.translate(-640 * ex, 0); profile(ctx, t, lerp(1220, 1830, slide), 250); ctx.restore();
    // the leverage widget (left)
    const wk = EIO(t, TB.saw - 0.1, 0.7) * (1 - EIO(t, TB.care - 0.3, 0.6)); if (wk <= 0.001) return;
    ctx.save(); ctx.globalAlpha = wk * (1 - ex); ctx.translate(-120 * (1 - wk), 0);
    const X1 = 1220, X0 = 160; panel(ctx, X0, 250, X1 - X0, 560, { r: 26, fill: 'rgba(20,21,25,0.96)' });
    const ck = sp(t, TB.cfd, 15, 0.7); if (ck > 0) { ctx.save(); ctx.globalAlpha *= clamp(ck * 2); A.roundRect(ctx, X1 - 140, 280, 100, 44, 12); ctx.strokeStyle = P.acc; ctx.lineWidth = 1.5; ctx.stroke(); lat(ctx, 'CFD', X1 - 90, 310, { size: 22, w: 800, color: P.acc, align: 'center' }); ctx.restore(); }
    txt(ctx, 'مثال توضيحي', X0 + 30, 310, { size: 20, w: 'R', color: P.faint, align: 'left', alpha: ck > 0 ? 1 : 0 });
    // trade value vs the amount you put up
    const tv = EIO(t, TB.trade - 0.05, 0.6), mv = EIO(t, TB.small - 0.1, 0.5); const BX0 = X0 + 40, BX1 = X1 - 40, BW = BX1 - BX0;
    if (tv > 0) { txt(ctx, 'قيمة الصفقة', BX1, 384, { size: 26, w: 'S', color: P.white }); lat(ctx, '$10,000', BX0, 386, { size: 30, w: 700, color: P.white, alpha: clamp(tv * 2) }); A.roundRect(ctx, BX1 - BW * tv, 402, BW * tv, 30, 8); ctx.fillStyle = hexA(P.acc, 0.5); ctx.fill(); }
    if (mv > 0) { txt(ctx, 'الهامش (Margin)', BX1, 478, { size: 26, w: 'S', color: P.white }); lat(ctx, '$500', BX0, 480, { size: 30, w: 700, color: P.acc, alpha: clamp(mv * 2) }); A.roundRect(ctx, BX1 - BW * 0.05 * mv, 496, Math.max(8, BW * 0.05 * mv), 30, 8); ctx.fillStyle = P.acc; ctx.fill(); }
    const lk = sp(t, TB.lev, 14, 0.66); if (lk > 0) { const s = 'الرافعة المالية'; ctx.save(); ctx.globalAlpha *= clamp(lk * 2); const ww = measure(ctx, s, 22, 'S') + 120; A.roundRect(ctx, BX1 - BW * 0.05 - 30 - ww, 492, ww, 40, 20); ctx.fillStyle = hexA(P.acc, 0.14); ctx.fill(); ctx.strokeStyle = P.acc; ctx.lineWidth = 1.5; ctx.stroke(); txt(ctx, s, BX1 - BW * 0.05 - 50, 519, { size: 22, w: 'S', color: P.white }); lat(ctx, '1:20', BX1 - BW * 0.05 - 30 - ww + 20, 520, { size: 22, w: 800, color: P.acc }); ctx.restore(); }
    // magnified P/L: loss (red) and profit (mint) from a centre line
    const pk = clamp((t - TB.but) / 0.3);
    if (pk > 0) {
      const cx = (X0 + X1) / 2, y = 640; ctx.save(); ctx.globalAlpha *= pk; ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(cx - 1, y - 40, 2, 120);
      txt(ctx, 'حركة 1% في السعر', cx, 600, { size: 22, w: 'R', color: P.dim, align: 'center' });
      const g1 = EIO(t, TB.mag, 0.6); const L = 380 * lerp(0.05, 1, g1);
      const lr = clamp((t - TB.loss) / 0.25), pr = clamp((t - TB.profit) / 0.25);
      A.roundRect(ctx, cx - L, y + 4, L, 34, 8); ctx.fillStyle = hexA(C.red, 0.35 + 0.65 * lr); ctx.fill(); A.roundRect(ctx, cx, y + 4, L, 34, 8); ctx.fillStyle = hexA(P.mint, 0.35 + 0.65 * pr); ctx.fill();
      if (lr > 0) { txt(ctx, 'خسارة', cx - L - 16, y + 32, { size: 24, w: 'S', color: C.coral || P.coral, align: 'right', alpha: lr }); lat(ctx, '−$100', cx - 20, y + 74, { size: 24, w: 700, color: P.coral, align: 'right', alpha: lr }); }
      if (pr > 0) { txt(ctx, 'ربح', cx + L + 16, y + 32, { size: 24, w: 'S', color: P.mint, align: 'left', alpha: pr }); lat(ctx, '+$100', cx + 20, y + 74, { size: 24, w: 700, color: P.mint, alpha: pr }); }
      const ek = clamp((t - TB.mag) / 0.3); if (ek > 0) txt(ctx, '= 20% من الهامش', cx, y + 120, { size: 24, w: 'S', color: P.white, align: 'center', alpha: ek });
      ctx.restore();
    }
    ctx.restore();
  } });

  // ================================================================ C · due diligence: the checklist → the register → licence ≠ no loss → protection (globe) → the choice
  const TC = { pre: w(15, 0), choose: w(15, 2), dd: w(15, 5), r1: w(16, 0), r1c: w(16, 3), r2: w(17, 0), r2c: w(18, 2), r3: w(19, 1), r3c: w(19, 2), r4: w(19, 3), r4c: w(19, 4),
    reg: w(20, 1), reg2: w(20, 2), body: w(20, 3), self: w(20, 5), notOnly: w(21, 0), site: w(21, 2), siteB: w(21, 3),
    lic: w(22, 0), notM: w(22, 1), noLoss: w(22, 3), loss: w(22, 4), prot: w(23, 0), varies: w(23, 2), entity: w(23, 4), country: w(23, 5), res: w(23, 6),
    after: w(24, 0), checked: w(24, 2), chose: w(25, 0), axi: w(25, 1), out: w(26, 0) - 0.35 };
  G.L18.TC = TC;
  const ROWS = [['هل الوسيط مرخّص؟', TC.r1, TC.r1c], ['هل الكيان الذي سيفتح حسابك خاضع لجهة تنظيمية؟', TC.r2, TC.r2c], ['ما مستوى حماية العملاء؟', TC.r3, TC.r3c], ['ما سمعة الوسيط؟', TC.r4, TC.r4c]];
  sfx(TC.pre - 0.05, 'whoosh', 0.14, { d: 0.6 }); sfx(TC.pre + 0.7, 'impact', 0.1); ROWS.forEach(([_, a, c], i) => { sfx(a, 'pop', 0.12, { f: 640 + i * 60 }); sfx(c, 'tick', 0.16, { f: 2400 + i * 200 }); });
  sfx(TC.reg - 0.1, 'whip', 0.16); sfx(TC.body, 'type', 0.1, { d: 0.7, n: 10 }); sfx(TC.self, 'chime', 0.12); sfx(TC.site, 'pop', 0.12, { f: 600 }); sfx(TC.siteB, 'tick', 0.12, { f: 1800 });
  sfx(TC.lic - 0.1, 'whoosh', 0.14, { d: 0.4 }); sfx(TC.notM, 'slam', 0.14); sfx(TC.loss, 'stretch', 0.1);
  sfx(TC.prot - 0.2, 'whoosh', 0.14, { d: 0.7 }); [TC.varies, TC.entity, TC.entity + 0.25].forEach((tt, i) => sfx(tt, 'bloop', 0.13, { pan: [-0.4, 0.3, 0.6][i] })); sfx(TC.res, 'bloop', 0.16);
  sfx(TC.after - 0.1, 'whoosh', 0.12, { d: 0.45 }); sfx(TC.checked, 'chime', 0.12); sfx(TC.axi - 0.05, 'pop', 0.22, { f: 980 }); sfx(TC.axi, 'impact', 0.12);
  const CW = 1340, CH = 640;
  function listFace(c, t) {
    c.fillStyle = '#121316'; c.fillRect(0, 0, CW, CH); c.strokeStyle = 'rgba(255,255,255,0.10)'; c.lineWidth = 2; c.strokeRect(1, 1, CW - 2, CH - 2);
    avatar(c, CW - 70, 66, 30, { lw: 2 }); txt(c, 'قائمة التحرّي', CW - 120, 78, { size: 36, w: 'S', color: P.white, alpha: clamp((t - TC.dd + 0.2) / 0.25) });
    const n = ROWS.filter(([, , cc]) => t >= cc).length; const pk = clamp((t - TC.dd) / 0.3);
    if (pk > 0) { lat(c, n + ' / 4', 50, 78, { size: 30, w: 700, color: n === 4 ? P.acc : P.white, alpha: pk }); c.fillStyle = 'rgba(255,255,255,0.08)'; c.fillRect(50, 104, 300, 6); c.fillStyle = P.acc; c.fillRect(50, 104, 300 * (n / 4), 6); }
    c.fillStyle = 'rgba(255,255,255,0.07)'; c.fillRect(40, 140, CW - 80, 1);
    ROWS.forEach(([s, a, cc], i) => {
      const k = clamp((t - a + 0.05) / 0.3); if (k <= 0) return; const y = 210 + i * 110;
      c.save(); c.globalAlpha *= k; c.translate(0, (1 - k) * 20);
      if (t >= cc && t < cc + 1.6) { A.roundRect(c, 30, y - 46, CW - 60, 92, 16); c.fillStyle = hexA(P.acc, 0.07 * (1 - clamp((t - cc - 0.8) / 0.8))); c.fill(); }
      tick(c, CW - 80, y, 26, EIO(t, cc, 0.35)); txt(c, s, CW - 130, y + 13, { size: 34, w: 'S', color: P.white });
      c.restore();
    });
  }
  function browser(ctx, x, y, w2, h2, title, o = {}) {
    panel(ctx, x, y, w2, h2, { r: 18, fill: 'rgba(20,21,25,0.97)', stroke: o.hot ? hexA(P.acc, 0.9) : 'rgba(255,255,255,0.12)' });
    ctx.fillStyle = '#1B1C20'; A.roundRect(ctx, x + 1, y + 1, w2 - 2, 56, 17); ctx.fill(); for (let i = 0; i < 3; i++) { ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.arc(x + 30 + i * 22, y + 28, 6, 0, 6.283); ctx.fill(); }
    txt(ctx, title, x + w2 - 26, y + 38, { size: 24, w: 'S', color: o.hot ? P.white : P.dim });
  }
  Q.scn({ t0: TC.pre - 0.2, t1: TC.out + 0.75, draw(ctx, t) {
    const ex = EIO(t, TC.out, 0.6); if (ex >= 1) return;
    // phase 1: the checklist card (tilted dashboard)
    const k = xo(clamp((t - TC.pre + 0.2) / 0.9)); const away = EIO(t, TC.reg - 0.25, 0.6), back = EIO(t, TC.after - 0.2, 0.7);
    const vis = (1 - away) + back * (1 - ex);
    if (vis > 0.01) {
      const cy = lerp(1400, 560, k) + 900 * away * (1 - back); const rx = lerp(0.9, 0.12, k) + 0.5 * away * (1 - back);
      const dimA = 1 - 0.75 * clamp(sp(t, TC.axi - 0.05, 12, 0.6));
      ctx.save(); ctx.globalAlpha = clamp(vis) * dimA; Q.tiltCard(ctx, 'check', CW, CH, 960, cy, rx, -0.06, (c) => listFace(c, t), { scale: lerp(1, 0.86, back) }); ctx.restore();
      // the choice: Axi selected (over the checklist, after «وبعد ما فحص»)
      const ak = sp(t, TC.axi - 0.05, 12, 0.6);
      if (ak > 0 && back > 0) {
        ctx.save(); ctx.globalAlpha *= clamp(ak * 2) * (1 - ex); ctx.translate(960, 560); ctx.scale(Math.min(1.04, ak), Math.min(1.04, ak));
        panel(ctx, -330, -150, 660, 300, { r: 28, fill: 'rgba(16,17,20,0.97)', stroke: hexA(P.acc, 0.8) });
        const lh = 96, lw = A.logoWidth(lh); A.logo(ctx, -lw / 2, -110, lh, '#FFFFFF');
        chip(ctx, 'تم الاختيار بعد الفحص', 0, 80, clamp((t - TC.axi) / 0.2) * 1.0, { size: 24 });
        ctx.restore();
      }
    }
    // phase 2: the register vs the broker's own site
    const rk = EIO(t, TC.reg - 0.2, 0.6) * (1 - EIO(t, TC.lic - 0.3, 0.5));
    if (rk > 0.01) {
      ctx.save(); ctx.globalAlpha = rk; ctx.translate(0, (1 - rk) * 80);
      const sk = clamp((t - TC.site + 0.1) / 0.3);
      ctx.save(); ctx.globalAlpha *= lerp(0.0, 0.55, sk); browser(ctx, 160, 300, 700, 470, 'موقع الوسيط'); for (let i = 0; i < 5; i++) { ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(200, 400 + i * 50, [520, 440, 560, 380, 480][i], 16); } ctx.restore();
      if (sk > 0) { const s2 = 'لا يكفي وحده'; chip(ctx, s2, 510, 820, sp(t, TC.siteB, 14, 0.66), { size: 24, stroke: hexA(P.coral, 0.9), color: '#FFFFFF' }); }
      browser(ctx, 960, 260, 800, 560, 'سجل الجهة التنظيمية', { hot: true });
      // search field typing a licence number, then the result row
      A.roundRect(ctx, 1000, 350, 720, 64, 14); ctx.fillStyle = '#0E0F12'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 1.5; ctx.stroke();
      const q = 'رقم الترخيص أو اسم الشركة'; const n = Math.floor(clamp((t - TC.body) / 0.9) * q.length); if (n > 0) txt(ctx, q.slice(0, n), 1690, 392, { size: 26, w: 'R', color: P.white }); if ((t * 2) % 1 < 0.6 && t > TC.reg2) { ctx.fillStyle = P.red; ctx.fillRect(1690 - (n > 0 ? measure(ctx, q.slice(0, n), 26, 'R') : 0) - 10, 368, 4, 30); }
      const rr = sp(t, TC.self, 14, 0.66);
      if (rr > 0) { ctx.save(); ctx.globalAlpha *= clamp(rr * 2); ctx.translate(0, (1 - Math.min(1, rr)) * 20); A.roundRect(ctx, 1000, 450, 720, 96, 16); ctx.fillStyle = hexA(P.acc, 0.1); ctx.fill(); ctx.strokeStyle = hexA(P.acc, 0.7); ctx.lineWidth = 1.5; ctx.stroke(); tick(ctx, 1670, 498, 24, EIO(t, TC.self + 0.15, 0.3)); txt(ctx, 'الترخيص ساري', 1625, 492, { size: 28, w: 'S', color: P.white }); txt(ctx, 'تحقّق من اسم الكيان ورقم الترخيص', 1625, 528, { size: 20, w: 'R', color: P.dim }); ctx.restore(); for (let i = 0; i < 3; i++) { ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(1000, 590 + i * 50, [640, 520, 600][i], 14); } }
      ctx.restore();
    }
    // phase 3: licence ≠ no loss
    const lk = EIO(t, TC.lic - 0.2, 0.5) * (1 - EIO(t, TC.prot - 0.35, 0.5));
    if (lk > 0.01) {
      ctx.save(); ctx.globalAlpha = lk; ctx.translate(0, (1 - lk) * 60);
      const b1 = sp(t, TC.lic, 13, 0.66); if (b1 > 0) { ctx.save(); ctx.translate(1300, 520); ctx.scale(Math.min(1, b1), Math.min(1, b1)); panel(ctx, -230, -150, 460, 300, { r: 24, fill: 'rgba(20,21,25,0.97)' }); ctx.strokeStyle = P.acc; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -95); ctx.lineTo(62, -70); ctx.lineTo(62, -10); ctx.quadraticCurveTo(62, 40, 0, 62); ctx.quadraticCurveTo(-62, 40, -62, -10); ctx.lineTo(-62, -70); ctx.closePath(); ctx.stroke(); tick(ctx, 0, -14, 24, 1); txt(ctx, 'الترخيص', 0, 118, { size: 38, w: 'S', color: P.white, align: 'center' }); ctx.restore(); }
      const nk = sp(t, TC.notM, 14, 0.6); if (nk > 0) { ctx.save(); ctx.globalAlpha *= clamp(nk * 2); ctx.translate(960, 520); ctx.scale(Math.min(1.1, nk), Math.min(1.1, nk)); lat(ctx, '≠', 0, 40, { size: 140, w: 700, color: P.white, align: 'center' }); ctx.restore(); }
      const b2 = sp(t, TC.noLoss, 13, 0.66); if (b2 > 0) { ctx.save(); ctx.translate(620, 520); ctx.scale(Math.min(1, b2), Math.min(1, b2)); panel(ctx, -230, -150, 460, 300, { r: 24, fill: 'rgba(20,21,25,0.97)' }); txt(ctx, 'لا خسارة', 0, 118, { size: 38, w: 'S', color: P.white, align: 'center' });
        const lp = EIO(t, TC.loss, 0.6); const pts = []; for (let i = 0; i <= 30; i++) { const u = i / 30; pts.push([-170 + 340 * u, -80 + 130 * u * u + Math.sin(u * 17) * 10]); } const m = Math.max(2, Math.ceil(31 * lp)); if (lp > 0) { ctx.beginPath(); for (let i = 0; i < m; i++) i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineJoin = 'round'; Q.glowStroke(ctx, C.red, 4); }
        ctx.restore(); }
      const ck = sp(t, TC.loss + 0.2, 14, 0.7); if (ck > 0) txt(ctx, 'الترخيص لا يعني عدم الخسارة', 960, 800, { size: 40, w: 'S', color: P.white, align: 'center', alpha: clamp(ck * 2) });
      ctx.restore();
    }
    // phase 4: protection differs by entity and by your country of residence (the globe)
    const gk = EIO(t, TC.prot - 0.3, 0.8) * (1 - EIO(t, TC.after - 0.3, 0.6));
    if (gk > 0.01) {
      ctx.save(); ctx.globalAlpha = gk; const cy = lerp(1500, 1180, gk), R = 700, lon0 = 20 + (t - TC.prot) * 3, lat0 = -12;
      Q.globe(ctx, 960, cy, R, lon0, lat0, { rim: P.acc });
      txt(ctx, 'الحماية تختلف حسب', 960, 200, { size: 44, w: 'S', color: P.white, align: 'center', alpha: clamp((t - TC.prot) / 0.3) });
      const PINGS = [[[8, 47], TC.varies, 'كيان 1', 1], [[128, -24], TC.entity, 'كيان 2', 2], [[98, 18], TC.entity + 0.25, 'كيان 3', 3], [[44.4, 33.3], TC.res, 'بلد إقامتك', 0]];
      for (const [pl, t0, lb, lvl] of PINGS) {
        const [x, y, z] = Q.proj(pl[0], pl[1], lon0, lat0, 960, cy, R); if (z < 0.05) continue; Q.ping(ctx, x, y, t, t0, lvl === 0 ? P.red : P.acc);
        const kk = sp(t, t0 + 0.05, 14, 0.66); if (kk <= 0) continue; ctx.save(); ctx.globalAlpha *= clamp(kk * 2); const ww = 200; A.roundRect(ctx, x - ww / 2, y - 110, ww, 70, 14); ctx.fillStyle = 'rgba(22,23,27,0.95)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 1.5; ctx.stroke(); txt(ctx, lb, x + ww / 2 - 18, y - 80, { size: 22, w: 'S', color: P.white });
        if (lvl > 0) { const gx = x - ww / 2 + 34, gy = y - 75; ctx.fillStyle = P.acc; ctx.beginPath(); if (lvl === 1) ctx.arc(gx, gy, 11, 0, 6.283); else if (lvl === 2) ctx.rect(gx - 10, gy - 10, 20, 20); else { ctx.moveTo(gx, gy - 13); ctx.lineTo(gx + 12, gy); ctx.lineTo(gx, gy + 13); ctx.lineTo(gx - 12, gy); ctx.closePath(); } ctx.fill(); txt(ctx, 'حماية مختلفة', x + ww / 2 - 18, y - 52, { size: 16, w: 'R', color: P.dim }); } else txt(ctx, 'العراق', x - ww / 2 + 18, y - 56, { size: 20, w: 'S', color: P.coral, align: 'left' });
        ctx.restore(); }
      const lg = clamp((t - TC.entity) / 0.3); if (lg > 0) { chip(ctx, 'الكيان', 1110, 280, lg, { size: 24 }); chip(ctx, 'بلد الإقامة', 830, 280, clamp((t - TC.country) / 0.3), { size: 24 }); }
      ctx.restore();
    }
  } });
})(typeof window !== 'undefined' ? window : globalThis);
