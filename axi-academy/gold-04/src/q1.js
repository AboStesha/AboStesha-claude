// Gold 04 · part 1 — the hook (a typed line → the 24 hours → the question → the pill → a click → the agenda), the Baghdad
// globe (GMT+3 · no DST · London/NY change · the 3–4 mismatch weeks · 5 h → 4 h), the COMEX schedule card, the MT5
// specification window.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, Q = G.SAAS;
  const { W, H, C, clamp, lerp, hexA, txt, lat, measure } = A;
  const { P, E, EI, EIO, sp, xo, outP, wheels, wheelSeq, typeLine, panel, cap } = Q;
  const w = F.w, sfx = F.sfx, wl = F.wl;
  const PL = { bag: [44.4, 33.3], lon: [-0.13, 51.5], ny: [-74.0, 40.7], tok: [139.7, 35.7] };
  G.G4 = { PL };
  const typeSfx = (p, g = 0.09) => wl(p).forEach((x) => sfx(x.t, 'type', g, { d: Math.min(0.36, 0.035 * x.s.length + 0.04), n: Math.max(2, Math.ceil(x.s.length * 0.6)) }));
  const latW = (s, size, wgt = 600) => { const c = document.createElement('canvas').getContext('2d'); c.font = `${wgt} ${size}px IN`; return c.measureText(s).width; };

  // ================================================================ A · the hook
  const TA = { l1: w(0, 0), l2: w(1, 0), b0: w(1, 1), b1: w(1, 5), q: w(2, 0), q0: w(3, 0), qEnd: F.phe(3),
    up: w(5, 0), a1: w(5, 4), a1b: w(5, 6), a2: w(6, 2), a3: w(7, 0), a3b: w(7, 2), out: w(8, 0) - 0.5 };
  TA.pop = TA.qEnd + 0.5; TA.click = w(4, 2);
  const L1 = wl(0, 0, 5, { map: { 1: { s: 'يُتداول' } } }), QW = [{ s: 'متى', t: w(3, 0) }, { s: 'يتحرك', t: w(3, 1) }, { s: 'الذهب', t: w(3, 2), col: P.gold }, { s: 'فعلاً؟', t: w(3, 3) }];
  const ACT = [0.30, 0.26, 0.2, 0.3, 0.34, 0.31, 0.29, 0.3, 0.33, 0.38, 0.56, 0.6, 0.57, 0.55, 0.63, 0.94, 1.0, 0.9, 0.84, 0.68, 0.55, 0.47, 0.4, 0.33];
  const PART = (() => { const r = A.rng(9001); return Array.from({ length: 56 }, () => ({ a: r() * 6.283, v: 380 + r() * 720, s: 2 + r() * 3, d: r() * 0.15 })); })();
  const AG = [{ n: '01', t: 'أوقات الذهب', s: 'بتوقيت بغداد', t0: TA.a1, t1: TA.a1b, x: 1440 }, { n: '02', t: 'الأخبار', s: 'مواعيد صدورها', t0: TA.a2, t1: TA.a2 + 0.3, x: 960 }, { n: '03', t: 'الأخطاء الشائعة', s: 'أربعة أخطاء', t0: TA.a3, t1: TA.a3b, x: 480 }];
  typeSfx(0); typeSfx(3, 0.1);
  sfx(TA.b0, 'charge', 0.08, { d: 0.9 }); sfx(TA.b1 + 0.05, 'pop', 0.14, { f: 900 });
  sfx(TA.q - 0.02, 'whoosh', 0.18, { d: 0.4, up: false }); sfx(TA.q + 0.6, 'tick', 0.12, { f: 2400 });
  sfx(TA.qEnd + 0.08, 'whoosh', 0.16, { d: 0.42 }); sfx(TA.pop - 0.02, 'pop', 0.3, { f: 980 }); sfx(TA.pop, 'chime', 0.12);
  sfx(TA.click - 1.25, 'riser', 0.14, { d: 1.25 }); sfx(TA.click, 'click', 0.3); sfx(TA.click + 0.01, 'ripple', 0.4); sfx(TA.click + 0.02, 'impact', 0.22);
  sfx(TA.up - 0.05, 'whoosh', 0.12, { d: 0.5 }); AG.forEach((g, i) => { sfx(g.t0 - 0.05, 'whoosh', 0.09, { d: 0.25, pan: (g.x - 960) / 1400 }); sfx(g.t0 + 0.04, 'pop', 0.16, { f: 700 + i * 90, pan: (g.x - 960) / 1400 }); });
  sfx(TA.out, 'whoosh', 0.14, { d: 0.4 });

  Q.scn({ t0: 2.05, t1: TA.out + 0.8, draw(ctx, t) {
    const ha = clamp((t - 2.05) / 0.3) * outP(t, TA.up, 0.3);
    if (ha > 0) cap(ctx, 'XAU/USD  ·  24H  ·  GMT+3', 960, 76, { alpha: ha, color: P.faint });
    // 1 · the typed line rises, the 24 hours grow under it; «إذن» squashes both into a streak that shrinks into the caret
    if (t < TA.q + 0.45) {
      const sq = EIO(t, TA.q, 0.4);
      ctx.save(); ctx.translate(960, 540); ctx.scale(lerp(1, 1.12, sq), lerp(1, 0.02, sq)); ctx.translate(-960, -540);
      const k = EIO(t, TA.l2, 0.55); const y = lerp(560, 310, k), s = lerp(1, 0.66, k);
      ctx.save(); ctx.translate(960, y); ctx.scale(s, s); typeLine(ctx, L1, 0, 0, 72, t, { caret: t < TA.l2 }); ctx.restore();
      if (t >= TA.b0 - 0.05) {
        const x0 = 420, x1 = 1500, bw = (x1 - x0) / 24, base = 800, hmax = 300;
        for (let i = 0; i < 24; i++) {
          const kk = Math.max(0, Math.min(1.08, sp(t, TA.b0 + i * 0.036, 16, 0.62))); const h = hmax * ACT[i] * kk; if (h <= 0.5) continue;
          const hot = ACT[i] > 0.8; const g = ctx.createLinearGradient(0, base - h, 0, base);
          g.addColorStop(0, hot ? P.gold : '#454850'); g.addColorStop(1, hot ? hexA(P.gold, 0.18) : 'rgba(69,72,80,0.2)');
          ctx.fillStyle = g; A.roundRect(ctx, x0 + i * bw + 5, base - h, bw - 10, h, 6); ctx.fill();
        }
        const la = clamp((t - TA.b0) / 0.4);
        for (const hh of [0, 6, 12, 18, 24]) lat(ctx, String(hh).padStart(2, '0'), x0 + hh * bw, base + 40, { size: 20, w: 600, color: P.faint, align: 'center', alpha: la });
        txt(ctx, 'نشاط السعر بتوقيت بغداد · توضيحي', x1, base - hmax - 34, { size: 22, w: 'R', color: P.dim, alpha: la });
      }
      ctx.restore();
      if (sq > 0) { const half = lerp(760, 0, EIO(t, TA.q + 0.28, 0.3)); if (half > 1) { ctx.save(); ctx.globalAlpha = clamp(sq * 2); ctx.beginPath(); ctx.moveTo(960 - half, 540); ctx.lineTo(960 + half, 540); Q.glowStroke(ctx, P.gold, 4); ctx.restore(); } }
    }
    // 2 · the question types out of the caret, then squashes into a glowing streak → flash → the pill
    if (t >= TA.q + 0.55 && t < TA.qEnd + 0.62) {
      const k = EIO(t, TA.qEnd + 0.1, 0.36);
      if (t < TA.q0) { ctx.fillStyle = P.red; if ((t * 2) % 1 < 0.6) ctx.fillRect(957, 540 - 46, 6, 70); }
      else { ctx.save(); ctx.translate(960, 540); ctx.scale(lerp(1, 0.02, k), lerp(1, 0.4, k)); ctx.translate(-960, -540); typeLine(ctx, QW, 960, 568, 84, t, { center: true, caret: k < 0.4 }); ctx.restore(); }
      if (k > 0) { const half = lerp(600, 24, k) * (1 - EI(t, TA.qEnd + 0.44, 0.14)); ctx.save(); ctx.globalAlpha = clamp(k * 3); ctx.beginPath(); ctx.moveTo(960 - half, 540); ctx.lineTo(960 + half, 540); Q.glowStroke(ctx, P.gold, 5); ctx.restore(); }
    }
    const fl = Math.exp(-Math.pow((t - (TA.pop - 0.03)) / 0.07, 2));
    if (fl > 0.01) { const g = ctx.createRadialGradient(960, 540, 0, 960, 540, 760); g.addColorStop(0, hexA('#FFF4D6', 0.8 * fl)); g.addColorStop(1, hexA('#FFF4D6', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    // 3 · the click: gold tint, radar rings, sparks
    const lc = t - TA.click;
    if (lc > 0 && lc < 2.4) {
      const tint = Math.exp(-lc * 2.2) * clamp(lc * 8); const g = ctx.createRadialGradient(960, 540, 0, 960, 540, 300 + lc * 1900);
      g.addColorStop(0, hexA(P.gold, 0.28 * tint)); g.addColorStop(0.7, hexA(P.gold2, 0.12 * tint)); g.addColorStop(1, hexA(P.gold2, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 4; i++) { const a = lc - i * 0.16; if (a <= 0 || a > 1.8) continue; ctx.save(); ctx.globalAlpha = (1 - a / 1.8) * 0.7; ctx.strokeStyle = i % 2 ? '#FFFFFF' : P.gold; ctx.lineWidth = i % 2 ? 1.5 : 2.5; ctx.beginPath(); ctx.arc(960, 540, 60 + 980 * xo(a / 1.8), 0, 6.283); ctx.stroke(); ctx.restore(); }
      for (const p of PART) { const a = lc - p.d; if (a <= 0 || a > 1.2) continue; const r = 70 + p.v * xo(a / 1.2) * 0.9; ctx.globalAlpha = (1 - a / 1.2); ctx.fillStyle = P.gold; ctx.beginPath(); ctx.arc(960 + Math.cos(p.a) * r, 540 + Math.sin(p.a) * r * 0.8, p.s, 0, 6.283); ctx.fill(); }
      ctx.globalAlpha = 1;
    }
    // 4 · the pill (rises to the top as the header), the «final lesson» badge
    const pk = sp(t, TA.pop, 13, 0.55);
    if (pk > 0) {
      const u = EIO(t, TA.up, 0.6), py = lerp(540, 112, u), ps = lerp(1.2, 0.78, u);
      const bump = 1 - 0.06 * Math.exp(-Math.pow((t - TA.click - 0.04) / 0.05, 2)); const ex = outP(t, TA.out + 0.1, 0.35);
      ctx.save(); ctx.globalAlpha = ex; ctx.translate(0, -60 * (1 - ex)); Q.pill(ctx, 960, py, 'أوقات', 'الذهب', { k: pk * ps * bump, glow: lerp(1, 0.45, u), size: 44 });
      const bk = sp(t, TA.click + 0.12, 14, 0.7);
      if (bk > 0) {
        const by = py + lerp(110, 80, u); const s1 = 'الدرس الأخير', s2 = '04 / 04', w1 = measure(ctx, s1, 24, 'S'), w2 = latW(s2, 20, 700) + 6; const tot = 18 + 14 + w1 + 30 + w2; let x = 960 + tot / 2;
        ctx.save(); ctx.globalAlpha *= clamp(bk * 2); ctx.translate(0, (1 - Math.min(1, bk)) * 16);
        ctx.fillStyle = P.red; ctx.beginPath(); ctx.arc(x - 8, by - 8, 7, 0, 6.283); ctx.fill(); x -= 30;
        txt(ctx, s1, x, by, { size: 24, w: 'S', color: P.white }); x -= w1 + 14; lat(ctx, '·', x - 4, by, { size: 22, w: 700, color: P.faint, align: 'right' }); x -= 22;
        lat(ctx, s2, x, by, { size: 20, w: 700, color: P.gold, align: 'right', track: 2 }); ctx.restore();
      }
      ctx.restore();
    }
    if (t > TA.pop + 0.15 && t < TA.click + 0.6) { // the cursor
      const m = EIO(t, TA.pop + 0.2, TA.click - TA.pop - 0.25); const x = lerp(1420, 1012, m), y = lerp(1000, 566, m) + Math.sin(m * 3.1) * -40;
      const pr = Math.exp(-Math.pow((t - TA.click) / 0.06, 2)); ctx.save(); ctx.globalAlpha = outP(t, TA.click + 0.3, 0.25); FX.cursor(ctx, x, y, pr, '#FFFFFF'); ctx.restore();
    }
    // 5 · the agenda (three tabs)
    for (const [i, g] of AG.entries()) {
      const k = sp(t, g.t0, 14, 0.62); if (k <= 0) continue; const o = EI(t, TA.out + i * 0.06, 0.35); if (o >= 1) continue;
      const cx = g.x, cy = 400; ctx.save(); ctx.globalAlpha = clamp(k * 2) * (1 - o); ctx.translate(0, (1 - Math.min(1, k)) * 60 - 90 * o);
      panel(ctx, cx - 210, cy - 80, 420, 160, { r: 20, fill: 'rgba(22,23,27,0.92)' });
      lat(ctx, g.n, cx - 180, cy - 34, { size: 20, w: 700, color: P.gold, track: 2 }); ctx.fillStyle = P.gold; ctx.fillRect(cx - 180, cy - 22, 26 * clamp((t - g.t0) / 0.3), 2);
      txt(ctx, g.t, cx + 180, cy + 6, { size: 38, w: 'S', color: P.white });
      txt(ctx, g.s, cx + 180, cy + 50, { size: 24, w: 'R', color: P.dim, alpha: clamp((t - g.t1) / 0.25) });
      ctx.restore();
    }
  } });

  // ================================================================ B · the Baghdad globe
  const TB = { rise0: w(5, 6), iraq: w(8, 0), gmt: w(8, 3), plus: w(8, 4), three: w(8, 5), year: w(8, 7), dst: w(9, 0), rot: w(10, 0) - 0.45,
    us: w(10, 1), uk: w(10, 2), change: w(10, 3), dates: w(11, 0), ours: w(12, 1), roll: w(13, 0), weeks: w(14, 0), wk34: w(14, 1), wkE: w(14, 3),
    one: w(15, 0), changed: w(15, 3), notyet: w(15, 6), diff: w(16, 0), lon: w(16, 2), ny: w(16, 3), four: w(17, 1), five: w(17, 4), out: w(18, 0) - 0.3 };
  const GR = 820, GLAT = -10;
  const gcy = (t) => { let y = lerp(2160, 1580, EIO(t, TB.rise0, 0.9)); y = lerp(y, 1270, EIO(t, TB.iraq - 0.55, 0.8)); return lerp(y, 2400, EIO(t, TB.out, 0.7)); };
  const glon = (t) => lerp(44, -30, EIO(t, TB.rot, 0.9)) + (t - 18) * 0.25;
  G.G4.globeAt = (t) => ({ cx: 960, cy: gcy(t), R: GR, lon0: glon(t), lat0: GLAT });
  const MON = (m) => 380 + m * (1040 / 12); // month axis of the DST panel (LTR)
  sfx(TB.rise0 - 0.05, 'whoosh', 0.1, { d: 0.7 }); sfx(TB.iraq - 0.55, 'whoosh', 0.14, { d: 0.7 }); sfx(TB.iraq + 0.02, 'bloop', 0.18);
  sfx(TB.gmt, 'pop', 0.14, { f: 760 }); sfx(TB.three - 0.05, 'type', 0.1, { d: 0.45, n: 6 }); sfx(TB.year, 'pop', 0.14, { f: 880 });
  sfx(TB.dst - 0.06, 'whoosh', 0.1, { d: 0.25, pan: 0.5 }); sfx(TB.dst + 0.04, 'pop', 0.18, { f: 640, pan: 0.5 });
  sfx(TB.rot, 'whoosh', 0.16, { d: 0.9 }); sfx(TB.us + 0.02, 'bloop', 0.16, { pan: -0.4 }); sfx(TB.uk + 0.02, 'bloop', 0.16, { pan: 0.2 });
  sfx(TB.change, 'tick', 0.14, { f: 2600 }); sfx(TB.change + 0.14, 'tick', 0.12, { f: 2900 }); sfx(TB.dates, 'pop', 0.12, { f: 720 }); sfx(TB.dates + 0.15, 'pop', 0.12, { f: 800 });
  sfx(TB.ours, 'pop', 0.14, { f: 880 }); sfx(TB.roll, 'type', 0.11, { d: 0.5, n: 6 });
  sfx(TB.weeks - 0.1, 'whoosh', 0.14, { d: 0.45 }); sfx(TB.weeks + 0.35, 'stretch', 0.08); sfx(TB.wkE - 0.1, 'chime', 0.12);
  sfx(TB.changed, 'pop', 0.16, { f: 900 }); sfx(TB.notyet, 'tick', 0.14, { f: 1700 });
  sfx(TB.diff - 0.1, 'whoosh', 0.14, { d: 0.4 }); sfx(TB.lon, 'stretch', 0.12); sfx(TB.four - 0.04, 'type', 0.12, { d: 0.35, n: 4 }); sfx(TB.four + 0.3, 'snap', 0.14); sfx(TB.five, 'scribble', 0.08, { d: 0.25 });
  sfx(TB.out, 'whoosh', 0.16, { d: 0.6, up: false });

  function cityChip(ctx, x, y, name, t, t0, o = {}) { // dark chip near a ping: name + a second line (dates → clock)
    const k = sp(t, t0, 14, 0.66); if (k <= 0) return; const wv = 270, hv = o.line ? 112 : 64;
    ctx.save(); ctx.globalAlpha *= clamp(k * 2) * (o.alpha == null ? 1 : o.alpha); ctx.translate(x, y); ctx.scale(lerp(0.7, 1, Math.min(1, k)), lerp(0.7, 1, Math.min(1, k)));
    panel(ctx, -wv / 2, -hv / 2, wv, hv, { r: 16, fill: 'rgba(23,24,28,0.94)', stroke: 'rgba(255,255,255,0.14)' });
    txt(ctx, name, wv / 2 - 22, -hv / 2 + 42, { size: 30, w: 'S', color: P.white });
    if (o.badge > 0) { ctx.save(); ctx.globalAlpha *= clamp(o.badge * 2); A.roundRect(ctx, -wv / 2 + 16, -hv / 2 + 14, 74, 34, 17); ctx.fillStyle = hexA(P.gold, 0.18); ctx.fill(); ctx.strokeStyle = P.gold; ctx.lineWidth = 1.5; ctx.stroke(); lat(ctx, '±1h', -wv / 2 + 53, -hv / 2 + 38, { size: 18, w: 700, color: P.gold, align: 'center' }); ctx.restore(); }
    if (o.line) o.line(ctx, wv, hv);
    ctx.restore();
  }

  Q.scn({ t0: TB.rise0 - 0.1, t1: TB.out + 0.75, draw(ctx, t) {
    const cy = gcy(t), lon0 = glon(t);
    Q.globe(ctx, 960, cy, GR, lon0, GLAT, { alpha: clamp((t - TB.rise0 + 0.1) / 0.4) });
    const pr = (pl) => Q.proj(pl[0], pl[1], lon0, GLAT, 960, cy, GR);
    const [bx, by, bz] = pr(PL.bag); if (bz > 0.05) Q.ping(ctx, bx, by, t, TB.iraq, P.red);
    const [nx, ny, nz] = pr(PL.ny), [lx, ly, lz] = pr(PL.lon);
    if (nz > 0.05) Q.ping(ctx, nx, ny, t, TB.us, P.red); if (lz > 0.05) Q.ping(ctx, lx, ly, t, TB.uk, P.red);
    const gone = EI(t, TB.out, 0.4);
    // GMT+3 hero counter (Baghdad), then it leaves for the London/NY part
    const hk = sp(t, TB.gmt, 13, 0.7), hOut = EI(t, TB.rot, 0.35);
    if (hk > 0 && hOut < 1) {
      ctx.save(); ctx.globalAlpha = clamp(hk * 2) * (1 - hOut); ctx.translate(0, (1 - Math.min(1, hk)) * 30 - 120 * hOut);
      ctx.fillStyle = P.red; ctx.beginPath(); ctx.arc(1046, 186, 6, 0, 6.283); ctx.fill(); txt(ctx, 'توقيت بغداد', 1030, 194, { size: 24, w: 'S', color: P.dim });
      wheelSeq(ctx, [[0, 'GMT  '], [TB.plus, 'GMT+0'], [TB.three - 0.1, 'GMT+3']], t, 960, 330, 150, { w: 600, stagger: 0, d: 0.5 });
      const yk = sp(t, TB.year, 14, 0.7);
      if (yk > 0) { ctx.save(); ctx.globalAlpha *= clamp(yk * 2); const s = 'ثابت طوال السنة', ww = measure(ctx, s, 26, 'S') + 56; A.roundRect(ctx, 960 - ww / 2, 376, ww, 46, 23); ctx.fillStyle = hexA(P.gold, 0.14); ctx.fill(); ctx.strokeStyle = hexA(P.gold, 0.8); ctx.lineWidth = 1.5; ctx.stroke(); txt(ctx, s, 960, 408, { size: 26, w: 'S', color: P.gold, align: 'center' }); ctx.restore(); }
      ctx.restore();
    }
    // DST toast
    if (t >= TB.dst - 0.1 && t < TB.rot + 0.6) { ctx.save(); const ex = EI(t, TB.rot, 0.35); ctx.translate(ex * 700, 0); Q.toast(ctx, 1840, 440, 600, 'التوقيت الصيفي', 'غير مطبّق في العراق بعد عام 2007', t, TB.dst, { time: 'GMT+3', dot: P.red }); ctx.restore(); }
    if (t > TB.diff - 0.1 && nz > 0.05 && lz > 0.05) { ctx.save(); ctx.globalAlpha = 1 - gone; Q.gcArc(ctx, PL.lon, PL.ny, lon0, GLAT, 960, cy, GR, EIO(t, TB.lon - 0.1, 0.7), P.gold, { lift: 0.1, lw: 3 }); ctx.restore(); }
    // London / New York chips
    const chOut = EI(t, TB.weeks - 0.2, 0.35) * (1 - EIO(t, TB.diff + 0.2, 0.5));
    const clock = (city) => (ctx2, wv, hv) => {
      const dk = clamp((t - TB.dates) / 0.25) * (1 - clamp((t - TB.ours + 0.25) / 0.2)), ck = clamp((t - TB.ours) / 0.25);
      if (dk > 0) txt(ctx2, city === 'ny' ? 'آذار ← تشرين الثاني' : 'آذار ← تشرين الأول', wv / 2 - 22, hv / 2 - 24, { size: 22, w: 'R', color: P.dim, alpha: dk });
      if (ck > 0) { ctx2.save(); ctx2.globalAlpha *= ck; wheelSeq(ctx2, city === 'ny' ? [[0, '15:00'], [TB.roll, '16:00']] : [[0, '10:00'], [TB.roll, '11:00']], t, wv / 2 - 22, hv / 2 - 20, 36, { align: 'right', color: P.gold, w: 700, stagger: 0.04 }); txt(ctx2, 'بتوقيت بغداد', -wv / 2 + 20, hv / 2 - 24, { size: 18, w: 'R', color: P.faint, align: 'left' }); ctx2.restore(); }
    };
    if (t > TB.us - 0.1 && t < TB.out + 0.5) {
      const al = (1 - chOut) * (1 - gone);
      if (nz > 0.05) cityChip(ctx, nx + 40, ny - 120, 'نيويورك', t, TB.us, { alpha: al, badge: clamp((t - TB.change) / 0.2), line: t > TB.dates - 0.05 ? clock('ny') : null });
      if (lz > 0.05) cityChip(ctx, lx + 10, ly - 120, 'لندن', t, TB.uk, { alpha: al, badge: clamp((t - TB.change - 0.14) / 0.2), line: t > TB.dates - 0.05 ? clock('lon') : null });
    }
    // the year panel: two DST lanes and the mismatch weeks
    const pk = sp(t, TB.weeks, 13, 0.7), pOut = EI(t, TB.diff - 0.1, 0.35);
    if (pk > 0 && pOut < 1) {
      ctx.save(); ctx.globalAlpha = clamp(pk * 2) * (1 - pOut); ctx.translate(0, (1 - Math.min(1, pk)) * 50 - 80 * pOut);
      panel(ctx, 330, 150, 1260, 262, { r: 22, fill: 'rgba(20,21,25,0.95)' });
      txt(ctx, 'التوقيت الصيفي خلال السنة', 1550, 200, { size: 26, w: 'S', color: P.white });
      const hk2 = clamp((t - TB.wk34) / 0.3); if (hk2 > 0) txt(ctx, '≈ 3–4 أسابيع بالسنة', 760, 200, { size: 26, w: 'S', color: P.gold, alpha: hk2 });
      for (let m = 0; m <= 12; m++) { ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(MON(m), 226, 1, 150); if (m < 12) lat(ctx, String(m + 1).padStart(2, '0'), MON(m + 0.5), 396, { size: 16, w: 600, color: P.faint, align: 'center' }); }
      const lanes = [['أمريكا', 262, 2.26, 10.1, '#8FA6AE'], ['بريطانيا', 330, 2.9, 9.85, '#C4C8CC']];
      lanes.forEach(([nm, y, a, b, col], i) => {
        txt(ctx, nm, 1550, y + 10, { size: 24, w: 'S', color: P.dim });
        const rv = EIO(t, TB.weeks + 0.25 + i * 0.25, 0.7); if (rv <= 0) return; const xa = MON(a), xb = lerp(xa, MON(b), rv);
        A.roundRect(ctx, xa, y - 13, Math.max(26, xb - xa), 26, 13); ctx.fillStyle = hexA(col, 0.85); ctx.fill();
      });
      const hw = clamp((t - TB.wkE + 0.15) / 0.3);
      if (hw > 0) for (const [a, b] of [[2.26, 2.9], [9.85, 10.1]]) { ctx.save(); ctx.globalAlpha *= hw; const x0 = MON(a) - 2, x1 = MON(b) + 2; ctx.shadowColor = hexA(P.gold, 0.8); ctx.shadowBlur = 24; ctx.fillStyle = hexA(P.gold, 0.2); ctx.fillRect(x0, 236, x1 - x0, 122); ctx.shadowBlur = 0; ctx.strokeStyle = P.gold; ctx.lineWidth = 2; ctx.strokeRect(x0, 236, x1 - x0, 122); ctx.restore(); }
      const c1 = sp(t, TB.changed, 15, 0.66), c2 = sp(t, TB.notyet, 15, 0.66);
      const chip = (x, y, s, k, col) => { if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k * 2); ctx.translate(x, y); ctx.scale(Math.min(1, k), Math.min(1, k)); const ww = measure(ctx, s, 20, 'S') + 28; A.roundRect(ctx, -ww / 2, -17, ww, 34, 17); ctx.fillStyle = '#0E0F12'; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.stroke(); txt(ctx, s, 0, 7, { size: 20, w: 'S', color: col, align: 'center' }); ctx.restore(); };
      chip(MON(2.58), 262 - 40, 'غيّرت', c1, P.gold); chip(MON(2.58), 330 + 40, 'لم تغيّر', c2, '#C4C8CC');
      ctx.restore();
    }
    // London ↔ New York: the arc and the 5 h → 4 h counter
    if (t > TB.diff - 0.1) {
      const al = 1 - gone; ctx.save(); ctx.globalAlpha = al;
      const k = sp(t, TB.diff, 13, 0.7);
      if (k > 0) {
        ctx.save(); ctx.globalAlpha *= clamp(k * 2); ctx.translate(0, (1 - Math.min(1, k)) * 30);
        txt(ctx, 'الفرق بين لندن ونيويورك', 960, 194, { size: 24, w: 'S', color: P.dim, align: 'center' });
        wheels(ctx, '5', '4', t, TB.four - 0.12, 1090, 336, 150, { dir: -1, d: 0.45 }); txt(ctx, 'ساعات', 1026, 330, { size: 64, w: 'S', color: P.white });
        const bk = sp(t, TB.five - 0.1, 14, 0.7);
        if (bk > 0) { ctx.save(); ctx.globalAlpha *= clamp(bk * 2) * 0.75; txt(ctx, 'بدلاً من', 806, 326, { size: 40, w: 'S', color: P.dim }); lat(ctx, '5', 806 - measure(ctx, 'بدلاً من ', 40, 'S'), 330, { size: 64, w: 600, color: P.dim, align: 'right' }); ctx.strokeStyle = P.red; ctx.lineWidth = 5; ctx.beginPath(); const sx0 = 806 - measure(ctx, 'بدلاً من ', 40, 'S') - 50; ctx.moveTo(sx0, 300); ctx.lineTo(sx0 + 56 * EIO(t, TB.five + 0.05, 0.25), 300 - 24 * EIO(t, TB.five + 0.05, 0.25)); ctx.stroke(); ctx.restore(); }
        ctx.restore();
      }
      ctx.restore();
    }
  } });

  // ================================================================ C · the COMEX card (tilted dashboard) → D · the MT5 specification window
  const TC = { in: w(18, 0) - 0.3, t0: w(18, 0), t1: w(18, 1), t2: w(18, 2), comex: w(18, 5), metals: w(18, 6), runs: w(19, 0), sun: w(19, 3), six: w(19, 4), ny: w(19, 6),
    fri: w(20, 1), five: w(20, 2), brk: w(21, 1), every: w(21, 3), hol: w(22, 0), hol2: w(23, 1), bag: w(24, 0), summer: w(24, 5),
    open: w(25, 0), mon: w(25, 3), one: w(25, 5), brk2: w(26, 0), twelve: w(27, 1), toOne: w(27, 3), close: w(28, 0), sat: w(29, 2), mid: w(30, 1),
    winter: w(31, 1), late: w(32, 2), open2: w(33, 0), brk3: w(34, 0), close2: w(35, 0), only: w(37, 1), bas: w(37, 3), flip: w(38, 0) - 0.35 };
  const TD = { cfd: w(38, 0), mt5: w(38, 3), five: w(38, 4), runs: w(39, 0), varies: w(40, 0), lw: w(41, 0), look: w(42, 0), sess: w(42, 2), spec: w(42, 4),
    times: w(43, 0), server: w(44, 1), notB: w(45, 0), conv: w(46, 0), conv2: w(46, 1), out: F.phe(46) + 0.3 };
  G.G4.TD = TD;
  const CW = 1500, CH = 680, CX = 960;
  const ACC = { ny: '#8FA6AE', su: P.gold, wi: '#C4C8CC' };
  const modeAt = (t) => (t < TC.bag ? 'ny' : t < TC.winter ? 'su' : 'wi');
  const shiftH = (t) => 7 * EIO(t, TC.bag, 0.8) + 1 * EIO(t, TC.late - 0.1, 0.6);
  const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  sfx(TC.in, 'whoosh', 0.16, { d: 0.6 }); sfx(TC.in + 0.75, 'impact', 0.12);
  typeSfx(18, 0.06); sfx(TC.comex, 'pop', 0.14, { f: 760 });
  sfx(TC.runs, 'stretch', 0.09); sfx(TC.six - 0.02, 'type', 0.1, { d: 0.4, n: 5 }); sfx(TC.five - 0.02, 'type', 0.1, { d: 0.4, n: 5 });
  for (let i = 0; i < 4; i++) sfx(TC.brk + i * 0.22, 'tick', 0.12, { f: 2000 + i * 200 });
  sfx(TC.hol - 0.05, 'whoosh', 0.1, { d: 0.25, pan: 0.5 }); sfx(TC.hol + 0.04, 'pop', 0.16, { f: 640, pan: 0.5 });
  sfx(TC.bag, 'click', 0.2); sfx(TC.bag + 0.05, 'whoosh', 0.12, { d: 0.6 });
  [[TC.one, 0.4], [TC.twelve, 0.9], [TC.mid, 0.4]].forEach(([tt, d]) => sfx(tt - 0.08, 'type', 0.1, { d, n: Math.round(d * 12) }));
  [TC.open, TC.brk2, TC.close, TC.open2, TC.brk3, TC.close2].forEach((tt) => sfx(tt, 'tick', 0.1, { f: 2800 }));
  sfx(TC.winter, 'click', 0.2); sfx(TC.late - 0.05, 'type', 0.13, { d: 0.7, n: 10 }); sfx(TC.late, 'whoosh', 0.1, { d: 0.5 });
  sfx(TC.only - 0.03, 'slam', 0.2); sfx(TC.bas, 'tick', 0.12, { f: 2400 }); sfx(TC.flip, 'whip', 0.2);

  // weekly schedule (display days from Sunday 00:00, LTR) for a shift of s hours from New York time; dips 0..1 per daily break
  function schedPts(s, dips, rev) {
    const S = 18 / 24 + s / 24, Ee = 5 + 17 / 24 + s / 24; const pts = [[0, 0], [S, 0], [S, 1]];
    for (let d = 1; d <= 4; d++) { const b0 = d + 17 / 24 + s / 24, b1 = b0 + 1 / 24; const k = dips[d - 1]; pts.push([b0, 1], [b0, 1 - k], [b1, 1 - k], [b1, 1]); }
    pts.push([Ee, 1], [Ee, 0], [7, 0]);
    const out = []; for (const p of pts) { if (p[0] > rev) { const last = out[out.length - 1]; if (last) out.push([rev, last[1]]); break; } out.push(p); }
    return out;
  }
  function comexFace(c, t) {
    c.fillStyle = '#121316'; c.fillRect(0, 0, CW, CH); c.strokeStyle = 'rgba(255,255,255,0.10)'; c.lineWidth = 2; c.strokeRect(1, 1, CW - 2, CH - 2);
    const mode = modeAt(t), acc = ACC[mode];
    // header
    c.beginPath(); c.arc(CW - 62, 64, 14, 0, 6.283); c.strokeStyle = P.gold; c.lineWidth = 4; c.stroke(); c.beginPath(); c.arc(CW - 62, 64, 4.5, 0, 6.283); c.fillStyle = P.gold; c.fill();
    let x = CW - 96; [['عقود', TC.t0], ['الذهب', TC.t1], ['المستقبلية', TC.t2]].forEach(([s, tt]) => { const a = clamp((t - tt) / 0.2); const ww = measure(c, s, 36, 'S'); if (a > 0) txt(c, s, x, 76 + (1 - a) * 10, { size: 36, w: 'S', color: s === 'الذهب' ? P.gold : P.white, alpha: a }); x -= ww + measure(c, ' ', 36, 'S'); });
    const ma = clamp((t - TC.metals) / 0.25); if (ma > 0) txt(c, 'بورصة المعادن الأمريكية', CW - 96, 118, { size: 22, w: 'R', color: P.dim, alpha: ma });
    const ca = clamp((t - TC.comex) / 0.2); if (ca > 0) { const xx = CW - 96 - (ma > 0 ? measure(c, 'بورصة المعادن الأمريكية', 22, 'R') + 18 : 0); lat(c, 'COMEX', xx, 118, { size: 20, w: 700, color: P.gold, align: 'right', track: 2, alpha: ca }); }
    // tabs (RTL group at the left of the header)
    const tabs = [['ny', 'نيويورك'], ['su', 'بغداد · صيفي'], ['wi', 'بغداد · شتوي']]; let tx = 640; const pos = {};
    const ta = clamp((t - TC.sun + 0.3) / 0.3);
    for (const [k, s] of tabs) { const ww = measure(c, s, 22, 'S') + 40; pos[k] = [tx - ww, ww]; tx -= ww + 10; }
    if (ta > 0) {
      const from = t < TC.bag ? 'ny' : t < TC.winter ? 'ny' : 'su', to = mode; const m = t < TC.bag ? 1 : t < TC.winter ? EIO(t, TC.bag, 0.4) : EIO(t, TC.winter, 0.4);
      const hx = lerp(pos[from][0], pos[to][0], m), hw = lerp(pos[from][1], pos[to][1], m);
      c.save(); c.globalAlpha *= ta; A.roundRect(c, hx, 46, hw, 44, 22); c.fillStyle = hexA(acc, 0.2); c.fill(); c.strokeStyle = acc; c.lineWidth = 1.5; c.stroke();
      for (const [k, s] of tabs) txt(c, s, pos[k][0] + pos[k][1] / 2, 75, { size: 22, w: 'S', color: k === mode ? P.white : P.faint, align: 'center' });
      c.restore();
    }
    c.fillStyle = 'rgba(255,255,255,0.07)'; c.fillRect(40, 146, CW - 80, 1);
    // stats
    const ST = [{ lab: 'الافتتاح الأسبوعي', x: CW - 60 }, { lab: 'الاستراحة اليومية', x: CW - 60 - 470 }, { lab: 'الإغلاق الأسبوعي', x: CW - 60 - 940 }];
    const sa = clamp((t - TC.t2) / 0.3);
    if (sa > 0) {
      c.save(); c.globalAlpha *= sa;
      ST.forEach((s) => txt(c, s.lab, s.x, 190, { size: 22, w: 'R', color: P.dim }));
      const dim = (tt) => (t >= TC.bag && t < tt ? 0.35 : 1);
      // open
      const d0 = t < TC.bag ? (t >= TC.sun ? 'الأحد' : '') : t >= TC.mon ? 'الاثنين' : 'الأحد'; const dw0 = d0 ? measure(c, d0, 38, 'S') : 0;
      if (d0) txt(c, d0, ST[0].x, 252, { size: 38, w: 'S', color: P.white, alpha: dim(TC.mon) });
      if (t >= TC.six - 0.05) { c.save(); c.globalAlpha *= clamp((t - TC.six + 0.05) / 0.15) * dim(TC.one); wheelSeq(c, [[0, '18:00'], [TC.one - 0.1, '01:00'], [TC.late - 0.06, '02:00']], t, ST[0].x - dw0 - 18, 254, 50, { align: 'right', w: 600 }); c.restore(); }
      // daily break
      if (t >= TC.brk - 0.05) { c.save(); c.globalAlpha *= clamp((t - TC.brk + 0.05) / 0.15) * dim(TC.twelve); wheelSeq(c, [[0, '17:00–18:00'], [TC.twelve - 0.12, '00:00–01:00'], [TC.late, '01:00–02:00']], t, ST[1].x, 254, 50, { align: 'right', w: 600, stagger: 0.07 }); c.restore(); }
      // close
      const d2 = t < TC.bag ? (t >= TC.fri ? 'الجمعة' : '') : t >= TC.sat ? 'السبت' : 'الجمعة'; const dw2 = d2 ? measure(c, d2, 38, 'S') : 0;
      if (d2) txt(c, d2, ST[2].x, 252, { size: 38, w: 'S', color: P.white, alpha: dim(TC.sat) });
      if (t >= TC.five - 0.05) { c.save(); c.globalAlpha *= clamp((t - TC.five + 0.05) / 0.15) * dim(TC.mid); wheelSeq(c, [[0, '17:00'], [TC.mid - 0.1, '00:00'], [TC.late + 0.06, '01:00']], t, ST[2].x - dw2 - 18, 254, 50, { align: 'right', w: 600 }); c.restore(); }
      // active underline
      const U = [[TC.sun, 0], [TC.fri, 2], [TC.brk, 1], [TC.hol, -1], [TC.open, 0], [TC.brk2, 1], [TC.close, 2], [TC.winter, -1], [TC.open2, 0], [TC.brk3, 1], [TC.close2, 2], [TC.only, -1]];
      let ui = -1, ut = 0, pu = -1; for (const [tt, k] of U) if (t >= tt) { pu = ui; ui = k; ut = tt; }
      if (ui >= 0) { const m = pu >= 0 ? EIO(t, ut, 0.35) : 1; const xr = lerp(ST[pu >= 0 ? pu : ui].x, ST[ui].x, m); c.fillStyle = acc; c.fillRect(xr - 420, 282, 420 * (pu >= 0 ? 1 : E(t, ut, 0.3)), 4); }
      c.restore();
    }
    // the week chart: an area chart whose plateau is «market open»
    const X0 = 60, X1 = CW - 60, DW = (X1 - X0) / 7, YT = 360, YB = 590;
    for (let d = 0; d <= 7; d++) { c.fillStyle = 'rgba(255,255,255,0.05)'; c.fillRect(X0 + d * DW, YT - 20, 1, YB - YT + 20); }
    DAYS.forEach((s, d) => txt(c, s, X0 + (d + 0.5) * DW, 636, { size: 22, w: 'R', color: P.faint, align: 'center', alpha: clamp((t - TC.t1 - d * 0.06) / 0.3) }));
    c.fillStyle = 'rgba(255,255,255,0.10)'; c.fillRect(X0, YB, (X1 - X0) * EIO(t, TC.t1, 0.8), 1.5);
    const rev = lerp(0.75, 7, EIO(t, TC.runs, TC.five + 0.3 - TC.runs));
    if (t >= TC.runs) {
      const dips = [0, 1, 2, 3].map((i) => clamp(sp(t, TC.brk + i * 0.22, 16, 0.7), 0, 1.06)); const s = shiftH(t);
      const pts = schedPts(s, dips, rev).map(([u, v]) => [X0 + u * DW, lerp(YB, YT, v)]);
      c.save(); c.beginPath(); pts.forEach(([x2, y2], i) => (i ? c.lineTo(x2, y2) : c.moveTo(x2, y2))); c.lineTo(pts[pts.length - 1][0], YB); c.closePath();
      const g = c.createLinearGradient(0, YT, 0, YB); g.addColorStop(0, hexA(acc, 0.42)); g.addColorStop(1, hexA(acc, 0.02)); c.fillStyle = g; c.fill();
      c.beginPath(); pts.forEach(([x2, y2], i) => (i ? c.lineTo(x2, y2) : c.moveTo(x2, y2))); c.strokeStyle = acc; c.lineWidth = 3; c.lineJoin = 'round'; c.stroke();
      const e = pts[pts.length - 1]; if (rev < 6.99) { c.fillStyle = '#FFFFFF'; c.beginPath(); c.arc(e[0], e[1], 6, 0, 6.283); c.fill(); }
      c.restore();
    }
  }
  // the MT5-style specification window (generic; no third-party marks)
  const SPROPS = [['Contract size', '100'], ['Digits', '2'], ['Spread', 'floating'], ['Margin currency', 'USD'], ['Trade', 'Full access'], ['Execution', 'Market']];
  const SDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const SX0 = 800, SX1 = 1440, SHW = (SX1 - SX0) / 24;
  function sessBars(c, t, y0, off, rev, col) { // daily 01:00–24:00 in server time (example: GMT+2, US winter), shifted by `off` hours
    for (let i = 0; i < 5; i++) {
      const y = y0 + i * 58; const segs = [[1 + off, 24 + off]]; if (i > 0 && off > 0) segs.push([0, off]);
      for (const [a, b] of segs) { const aa = Math.max(0, a), bb = Math.min(24, b); if (bb <= aa) continue; const xr = lerp(SX0 + aa * SHW, SX0 + bb * SHW, rev); A.roundRect(c, SX0 + aa * SHW, y - 12, Math.max(4, xr - SX0 - aa * SHW), 24, 6); c.fillStyle = col; c.fill(); }
    }
  }
  function specFace(c, t, o = {}) {
    c.fillStyle = '#121316'; c.fillRect(0, 0, CW, CH); c.strokeStyle = 'rgba(255,255,255,0.10)'; c.lineWidth = 2; c.strokeRect(1, 1, CW - 2, CH - 2);
    c.fillStyle = '#1B1C20'; c.fillRect(2, 2, CW - 4, 70);
    const sg = o.ghost ? 0 : clamp((t - TD.spec) / 0.2);
    if (sg > 0) { c.save(); c.globalAlpha *= sg; A.roundRect(c, 26, 16, 210, 42, 10); c.fillStyle = hexA(P.gold, 0.18); c.fill(); c.strokeStyle = P.gold; c.lineWidth = 1.5; c.stroke(); c.restore(); }
    const tw = lat(c, 'Specification', 40, 46, { size: 26, w: 600, color: sg > 0.5 ? P.gold : P.white }); lat(c, '—  XAUUSD', 40 + tw + 14, 46, { size: 26, w: 400, color: P.dim });
    if (!o.ghost) { const k5 = clamp((t - TD.mt5) / 0.25); if (k5 > 0) lat(c, 'MetaTrader 5', CW - 40, 46, { size: 20, w: 600, color: P.dim, align: 'right', alpha: k5 }); const kc = clamp((t - TD.cfd) / 0.2); if (kc > 0) { c.save(); c.globalAlpha *= kc; A.roundRect(c, CW - 250 - 76, 24, 64, 32, 8); c.strokeStyle = P.gold; c.lineWidth = 1.5; c.stroke(); lat(c, 'CFD', CW - 250 - 44, 46, { size: 17, w: 700, color: P.gold, align: 'center' }); c.restore(); } }
    if (o.label) txt(c, o.label, CW / 2 + 120, 46, { size: 24, w: 'S', color: P.white, align: 'center' });
    SPROPS.forEach(([a, b], i) => { const y = 132 + i * 56; lat(c, a, 40, y, { size: 21, w: 400, color: P.dim }); lat(c, b, 600, y, { size: 21, w: 600, color: P.white, align: 'right' }); c.fillStyle = 'rgba(255,255,255,0.05)'; c.fillRect(40, y + 20, 560, 1); });
    c.fillStyle = 'rgba(255,255,255,0.07)'; c.fillRect(650, 90, 1, CH - 120);
    const hs = o.ghost ? 0 : clamp((t - TD.sess) / 0.2);
    if (hs > 0) { c.save(); c.globalAlpha *= hs; A.roundRect(c, 676, 100, 142, 44, 10); c.fillStyle = hexA(P.gold, 0.18); c.fill(); c.strokeStyle = P.gold; c.lineWidth = 1.5; c.stroke(); c.restore(); }
    lat(c, 'Sessions', 690, 132, { size: 24, w: 600, color: hs > 0.5 ? P.gold : P.white });
    if (!o.ghost) txt(c, 'مثال', 1440, 132, { size: 20, w: 'S', color: P.faint });
    SDAYS.forEach((d, i) => { lat(c, d, 690, 196 + i * 58 + 7, { size: 19, w: 400, color: P.dim }); c.fillStyle = 'rgba(255,255,255,0.04)'; c.fillRect(SX0, 196 + i * 58 - 12, SX1 - SX0, 24); });
    const off = o.off != null ? o.off : EIO(t, TD.conv, 0.7);
    const rev = o.ghost ? 1 : EIO(t, TD.runs - 0.1, 1.2); if (rev > 0) sessBars(c, t, 196, off, rev, o.col || hexA(P.gold, 0.85));
    // axes: server time, then Baghdad
    const ax = o.ghost ? 1 : clamp((t - TD.runs) / 0.3);
    if (ax > 0) { for (const h of [0, 6, 12, 18, 24]) lat(c, String(h).padStart(2, '0'), SX0 + h * SHW, 500, { size: 17, w: 600, color: P.faint, align: 'center', alpha: ax }); }
    if (!o.ghost) {
      const sv = clamp((t - TD.server + 0.1) / 0.25);
      if (sv > 0) { c.save(); c.globalAlpha *= sv; txt(c, 'وقت السيرفر', 770, 492, { size: 18, w: 'S', color: P.dim, align: 'right' }); lat(c, 'GMT+2', 770, 516, { size: 15, w: 700, color: P.dim, align: 'right' }); c.restore(); }
      const bg2 = clamp((t - TD.notB) / 0.25);
      if (bg2 > 0) {
        c.save(); c.globalAlpha *= bg2; txt(c, 'بغداد', 770, 556, { size: 20, w: 'S', color: P.gold, align: 'right' }); lat(c, 'GMT+3', 770, 580, { size: 15, w: 700, color: P.gold, align: 'right' });
        [0, 6, 12, 18, 24].forEach((h, i) => wheels(c, String(h).padStart(2, '0'), String((h + 1) % 24).padStart(2, '0'), t, TD.conv + i * 0.06, SX0 + h * SHW, 560, 17, { color: P.gold, w: 700, d: 0.4, stagger: 0.04 }));
        const ck = clamp((t - TD.conv2) / 0.3); if (ck > 0) { lat(c, '+1h', SX1 + 10, 530, { size: 22, w: 800, color: P.gold, alpha: ck }); }
        c.restore();
      }
    }
  }

  Q.scn({ t0: TC.in, t1: TD.out + 0.75, draw(ctx, t) {
    const k = xo(clamp((t - TC.in) / 0.95)); const cy = lerp(1560, 560, k);
    const fl = EIO(t, TC.flip, 0.55), ang = fl * Math.PI; const fx = Math.abs(Math.cos(ang)); const spec = ang > Math.PI / 2;
    const rx = spec ? lerp(0.16, 0.035, EIO(t, TC.flip + 0.3, 0.6)) : lerp(1.0, 0.18, k) - 0.05 * EIO(t, TC.t0 + 2, 30);
    const ex = EIO(t, TD.out - 0.2, 0.6); const sc = lerp(1, 0.25, ex);
    if (ex >= 1) return;
    const zm = spec ? 0.18 * EIO(t, TD.look - 0.25, 0.8) : 0; ctx.save(); ctx.translate(1240, 520); ctx.scale(1 + zm, 1 + zm); ctx.translate(-1240, -520);
    // ghost windows: the schedule differs from broker to broker
    const gk = EIO(t, TD.varies - 0.05, 0.45) * (1 - EIO(t, TD.look - 0.3, 0.45));
    if (gk > 0.01 && spec) {
      ctx.save(); ctx.globalAlpha = 0.85 * gk;
      [[-1, 2, 'وسيط 2', '#8FA6AE'], [1, -1, 'وسيط 3', '#C4C8CC']].forEach(([dir, off, lb, col], i) => { const gx = CX + dir * 330 * gk, gy = cy - 40 * gk; Q.tiltCard(ctx, 'ghost' + i, CW, CH, gx, gy, 0.035, 0, (c) => { specFace(c, t, { ghost: true, off, label: lb, col: hexA(col, 0.8) }); c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(0, 0, CW, CH); }, { scale: 0.82, shadow: true }); });
      ctx.restore();
    }
    ctx.save(); ctx.translate(CX, cy); ctx.scale(Math.max(0.002, fx) * sc, sc); ctx.translate(-CX, -cy); ctx.globalAlpha = 1 - ex * 0.9;
    Q.tiltCard(ctx, 'main', CW, CH, CX, cy, rx, spec ? 0 : -0.1, (c) => { if (spec) { specFace(c, t); if (gk > 0.01) txt(c, 'وسيط 1', CW / 2 + 120, 46, { size: 24, w: 'S', color: P.white, alpha: gk, align: 'center' }); } else comexFace(c, t); const sh = Math.sin(ang); if (sh > 0.02) { c.fillStyle = `rgba(0,0,0,${0.5 * sh})`; c.fillRect(0, 0, CW, CH); } });
    ctx.restore();
    // holiday toast (over the card's corner)
    if (t > TC.hol - 0.1 && t < TC.bag + 0.8) { ctx.save(); ctx.translate(EI(t, TC.bag - 0.2, 0.35) * 700, 0); Q.toast(ctx, 1800, 800, 480, 'العطل الرسمية', 'الجدول يتغير', t, TC.hol, { dot: P.gold }); ctx.restore(); }
    // «futures only» stamp
    const sk = t >= TC.only - 0.05 ? xo(clamp((t - TC.only + 0.05) / 0.22)) : 0;
    if (sk > 0 && t < TC.flip + 0.3) {
      const s = 'للعقود المستقبلية فقط', ww = measure(ctx, s, 46, 'S') + 70; const pulse = 1 + 0.05 * Math.exp(-Math.pow((t - TC.bas) / 0.07, 2));
      ctx.save(); ctx.globalAlpha = clamp(sk * 1.5) * (1 - EI(t, TC.flip, 0.25)); ctx.translate(960, 660); ctx.rotate(-0.07); ctx.scale(lerp(1.7, 1, sk) * pulse, lerp(1.7, 1, sk) * pulse);
      A.roundRect(ctx, -ww / 2, -48, ww, 96, 16); ctx.fillStyle = 'rgba(14,15,18,0.9)'; ctx.fill(); ctx.strokeStyle = P.gold; ctx.lineWidth = 4; ctx.stroke();
      txt(ctx, s, 0, 16, { size: 46, w: 'S', color: P.gold, align: 'center' }); ctx.restore();
    }
    // the cursor finds «Sessions», then «Specification»
    if (t > TD.look - 0.4 && t < TD.spec + 0.9) {
      const m1 = EIO(t, TD.look - 0.35, TD.sess - TD.look + 0.3), m2 = EIO(t, TD.sess + 0.25, TD.spec - TD.sess - 0.3);
      const x = lerp(lerp(1500, 960 - 750 + 760, m1), 960 - 750 + 200, m2), y = lerp(lerp(980, cy - 340 + 130, m1), cy - 340 + 44, m2);
      const pr = Math.max(Math.exp(-Math.pow((t - TD.sess) / 0.06, 2)), Math.exp(-Math.pow((t - TD.spec) / 0.06, 2)));
      ctx.save(); ctx.globalAlpha = clamp((t - TD.look + 0.4) / 0.2) * outP(t, TD.spec + 0.5, 0.3); FX.cursor(ctx, x, y, pr, '#FFFFFF'); ctx.restore();
    }
    ctx.restore();
  } });
  sfx(TD.cfd, 'pop', 0.14, { f: 820 }); sfx(TD.mt5, 'pop', 0.12, { f: 700 }); sfx(TD.runs, 'scribble', 0.07, { d: 1.0 });
  sfx(TD.varies - 0.05, 'whoosh', 0.14, { d: 0.35, pan: -0.5 }); sfx(TD.varies, 'whoosh', 0.14, { d: 0.35, pan: 0.5 }); sfx(TD.look - 0.3, 'whoosh', 0.1, { d: 0.35 });
  sfx(TD.sess, 'click', 0.24); sfx(TD.spec, 'click', 0.24); sfx(TD.server - 0.1, 'pop', 0.12, { f: 760 }); sfx(TD.notB, 'pop', 0.12, { f: 880 });
  sfx(TD.conv - 0.02, 'type', 0.11, { d: 0.6, n: 8 }); sfx(TD.conv, 'whoosh', 0.1, { d: 0.5 }); sfx(TD.out - 0.2, 'whoosh', 0.14, { d: 0.5, up: false });
})(typeof window !== 'undefined' ? window : globalThis);
