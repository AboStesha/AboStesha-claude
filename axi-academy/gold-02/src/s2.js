// Gold 02 · scenes 2 — 03 interest & inflation · 04 demand & supply.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT, GL = G.GL, GK = G.GK, TH = G.TH, SH = G.SHOT;
  const { W, H, C, clamp, lerp, eo, hexA, txt, lat, mixHex } = A;
  const { w, we, wl, sfx } = F;
  const { cio, sp, rise, head, fromLine, tok, chip, dash, roll, arrow, chev, card, latW, win } = SH.util;
  const Y0 = SH.Y0; const key = TH.key, stat = TH.stat, flat = TH.flat;
  const FLAT = (y) => TH.resample(flat(y));
  const F600 = FLAT(Y0);
  const outA = (t, t0, d = 0.35) => 1 - cio(t, t0, d);
  const popP = (t, t0) => Math.min(1.05, sp(t, t0, 15, 0.5));
  const gauss = (x, c, s) => Math.exp(-Math.pow((x - c) / s, 2));
  // a skyline: the thread climbs over every block {x (centre), w, h} standing on the line y
  const sky = (y, blocks) => { const pts = [[TH.XL, y]]; for (const b of blocks) { if (b.h < 0.5) continue; pts.push([b.x - b.w / 2, y], [b.x - b.w / 2, y - b.h], [b.x + b.w / 2, y - b.h], [b.x + b.w / 2, y]); } pts.push([TH.XR, y]); return TH.resample(pts); };

  // ================================================================ 03 · INTEREST & INFLATION
  const D3 = { t0: w(27, 0) - 0.06, t1: w(29, 0) - 0.42, y: Y0, sw: 'roseD', idx: '03', words: [{ s: 'الفائدة', t: w(28, 0) }, { s: 'والتضخم', t: w(28, 1) }] };
  SH.divs.push(D3); SH.labels.push([D3.t0 + 0.1, '03', 'الفائدة والتضخم']);
  key(D3.t0 - 0.04, 0, (t) => TH.twang(F600, t, D3.t0, 22));
  sfx(D3.t0, 'whoosh', 0.16, { d: 0.45 }); sfx(D3.t0 + 0.02, 'pluck', 0.2, { f: 110 }); sfx(D3.t1, 'whoosh', 0.12, { d: 0.45, up: false });
  const T3 = {
    fed: w(29, 0), cb: w(30, 1), short: w(31, 0), market: w(32, 0), real: w(32, 2), bonds: w(32, 5), cut: w(33, 2), infl: w(33, 3),
    gold0: w(34, 0), zero: w(34, 3), up: w(35, 1), miss: w(36, 0), press: w(37, 2), down: w(38, 1), rev: w(38, 2), brk: w(39, 4), wgc: w(40, 0),
    inflQ: w(41, 0), protect: w(42, 4), longrun: w(42, 7), notSure: w(43, 1), y22: w(44, 1), inf22: w(44, 2), high: w(44, 4), g22: w(45, 1), same: w(45, 6), usd: w(45, 7), wgc2: w(46, 0), ry: w(47, 2), dx: w(47, 4), end: w(48, 0) - 0.62,
  };
  // --- the Fed: the thread lifts into a pediment building
  const BK = { l: 740, r: 1180, top: 440, apex: 300, eave: 40 };
  const BANK = TH.join([[TH.XL, Y0], [BK.l, Y0], [BK.l, BK.top], [BK.l - BK.eave, BK.top], [960, BK.apex], [BK.r + BK.eave, BK.top], [BK.r, BK.top], [BK.r, Y0], [TH.XR, Y0]]);
  const TB = D3.t1 + 0.44;  // the building rises once the chapter panel has folded away
  key(TB, 0.8, stat(BANK), { mode: 'rise', y0: Y0, wave: 0.3, dir: 0, ease: TH.backE });
  sfx(TB, 'stretch', 0.14); sfx(TB + 0.5, 'pluck', 0.1, { f: 131 }); sfx(T3.fed, 'pop', 0.14, { f: 760 }); sfx(T3.short, 'click', 0.14); sfx(T3.short + 0.5, 'tick', 0.1, { f: 2200 });
  // --- yields: one bar on the thread; its top slice is expected inflation, the rest is the real yield
  const BX = 760, BW = 210;
  const realH = (t) => K.springs(t, 0, [[T3.real - 0.1, 190], [T3.up, 300], [T3.down, 110], [T3.brk + 0.35, 250], [T3.inflQ - 0.35, 0]], 11, 0.5);
  const inflH = (t) => 120 * (sp(t, T3.real - 0.1, 11, 0.55)) * (1 - cio(t, T3.cut, 0.45));
  const goldLift = (t) => K.springs(t, 0, [[T3.press, 64], [T3.rev, -70], [T3.brk + 0.35, -96], [T3.inflQ - 0.35, 0]], 10, 0.45);
  const GX = 1330;
  const TY = T3.market - 0.35;
  key(TY, 0.6, () => F600, { mode: 'settle', y: Y0, wave: 0.3, dir: 0 });
  key(TY + 0.62, 0, (t) => { const s = sky(Y0, [{ x: BX, w: BW, h: realH(t) + inflH(t) }]); const d = goldLift(t); return d === 0 ? s : s.map(([x, y]) => [x, y + d * gauss(x, GX, 230)]); });
  sfx(TY, 'whoosh', 0.1, { d: 0.5, up: false }); sfx(T3.market, 'pop', 0.12, { f: 640 }); sfx(T3.real - 0.1, 'stretch', 0.12); sfx(T3.bonds, 'pop', 0.12, { f: 820 });
  sfx(T3.cut - 0.02, 'snap', 0.16); sfx(T3.cut + 0.3, 'whoosh', 0.08, { d: 0.3 }); sfx(T3.zero, 'pop', 0.14, { f: 520 });
  sfx(T3.up, 'stretch', 0.12); sfx(T3.miss, 'whoosh', 0.1, { d: 0.6 }); sfx(T3.press, 'slam', 0.14); sfx(T3.down, 'bloop', 0.12); sfx(T3.rev, 'pluck', 0.14, { f: 147 });
  sfx(T3.brk - 0.02, 'glitch', 0.1); sfx(T3.brk, 'snap', 0.18);
  SH.src.push({ t0: T3.wgc, t1: T3.inflQ - 0.25, s: 'المصدر: مجلس الذهب العالمي' });

  function ratesBack(ctx, t, P) {
    if (!(t > TY + 0.5 && t < T3.inflQ + 0.3)) return;
    const a = outA(t, T3.inflQ - 0.4, 0.35); const rh = realH(t), ih = inflH(t); const yTop = Y0 - rh - ih;
    ctx.save(); ctx.globalAlpha *= a;
    if (rh > 1) { const g = ctx.createLinearGradient(0, Y0 - rh, 0, Y0); g.addColorStop(0, '#F3DFA2'); g.addColorStop(1, '#E3C26E'); ctx.fillStyle = g; ctx.fillRect(BX - BW / 2, Y0 - rh, BW, rh); }
    if (ih > 1) { ctx.fillStyle = GL.swatch(ctx, 'rose', { y0: yTop, y1: yTop + ih }); ctx.fillRect(BX - BW / 2, yTop, BW, ih); ctx.strokeStyle = hexA(C.ink, 0.25); ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(BX - BW / 2, yTop + ih); ctx.lineTo(BX + BW / 2, yTop + ih); ctx.stroke(); ctx.setLineDash([]); }
    ctx.restore();
  }
  function rates(ctx, t, P) {
    // the Fed building details: architrave + three columns in the thread's wire, «البنك المركزي» in the pediment
    const bk = cio(t, TB + 0.35, 0.4) * outA(t, TY - 0.05, 0.4);
    if (bk > 0) {
      ctx.save(); ctx.globalAlpha *= bk;
      TH.draw(ctx, [[BK.l, BK.top], [lerp(BK.l, BK.r, cio(t, TB + 0.35, 0.45)), BK.top]], { width: 5 });
      [850, 960, 1070].forEach((x, i) => { const g = cio(t, TB + 0.45 + i * 0.08, 0.35); if (g > 0) TH.draw(ctx, [[x, Y0], [x, lerp(Y0, BK.top + 10, g)]], { width: 5 }); });
      txt(ctx, 'البنك المركزي', 960, 418, { size: 26, w: 'S', color: C.slate, align: 'center', alpha: cio(t, T3.cb, 0.3) });
      ctx.restore();
      chip(ctx, 'الفدرالي الأمريكي', 960, 228, { size: 30, p: popP(t, T3.fed) * bk });
      // the short-term rate it sets: a slider
      const sl = popP(t, T3.short - 0.15) * bk;
      if (sl > 0) {
        ctx.save(); ctx.globalAlpha *= clamp(sl); const x = 1450, y0s = 560, y1s = 300;
        txt(ctx, 'الفائدة قصيرة الأجل', x, 262, { size: 28, w: 'S', color: C.ink, align: 'center' });
        A.roundRect(ctx, x - 6, y1s, 12, y0s - y1s, 6); ctx.fillStyle = hexA(C.ink, 0.1); ctx.fill();
        for (let k = 0; k <= 5; k++) { ctx.fillStyle = hexA(C.ink, 0.3); ctx.fillRect(x + 16, lerp(y0s, y1s, k / 5) - 1, 14, 2); }
        const ky = lerp(y0s - 40, y1s + 70, sp(t, T3.short + 0.35, 10, 0.6)); A.roundRect(ctx, x - 6, ky, 12, y0s - ky, 6); ctx.fillStyle = C.slate; ctx.fill();
        ctx.beginPath(); ctx.arc(x, ky, 20, 0, 6.283); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.stroke();
        lat(ctx, '%', x, ky + 8, { size: 20, w: 700, color: C.ink, align: 'center' });
        ctx.restore();
      }
    }
    // the yield bar
    if (t > TY + 0.5 && t < T3.inflQ + 0.3) {
      const a = outA(t, T3.inflQ - 0.4, 0.35); const rh = realH(t), ih = inflH(t); const yTop = Y0 - rh - ih;
      // the inflation slice lifts off and drifts aside: «بعد خصم التضخم المتوقع»
      const cut = cio(t, T3.cut, 0.6);
      if (cut > 0 && t < T3.up + 0.6) {
        const x = BX - BW / 2 - cut * 300, y = Y0 - 190 - 120 - cut * 40; const fa = outA(t, T3.up - 0.2, 0.4);
        ctx.save(); ctx.globalAlpha *= a * fa; ctx.fillStyle = GL.swatch(ctx, 'rose', { y0: y, y1: y + 120 }); A.roundRect(ctx, x, y, BW, 120, 4); ctx.fill(); ctx.restore();
        txt(ctx, 'التضخم المتوقع', x + BW / 2, y + 70, { size: 26, w: 'S', color: C.ink, align: 'center', alpha: a * fa * cio(t, T3.infl, 0.3) });
        lat(ctx, '−', x + BW + 34, y + 76, { size: 60, w: 300, color: C.ink, align: 'center', alpha: a * fa * cut });
      }
      // labels
      txt(ctx, 'العائد الحقيقي', BX, Y0 + 52, { size: 28, w: 'S', color: C.ink, align: 'center', alpha: a * cio(t, T3.real, 0.3) });
      txt(ctx, 'على السندات الأمريكية', BX, Y0 + 92, { size: 24, w: 'R', color: C.slate, align: 'center', alpha: a * cio(t, T3.bonds, 0.3) });
      chip(ctx, 'السوق', BX, yTop - 46, { size: 26, p: popP(t, T3.market) * a });
      tok(ctx, 'العائد الحقيقي = العائد − التضخم المتوقع', 960, 196, { size: 28, p: popP(t, T3.cut + 0.1) * outA(t, T3.up - 0.3, 0.3), latin: false });
      // gold pays no interest
      const ga = popP(t, T3.gold0 - 0.1) * a;
      if (ga > 0) {
        const yc = TH.yAt(P, GX); const rIn = Math.min(1, sp(t, T3.gold0 - 0.1, 12, 0.6));
        fromLine(ctx, yc + 2, () => GK.ingot(ctx, GX - 85, yc - 66 + (1 - rIn) * 90, 170, 64, { depth: 22, shadow: false }), { gap: 2 });
        tok(ctx, '0%', GX, yc - 150, { size: 30, p: popP(t, T3.zero) * a });
        txt(ctx, 'فائدة', GX + 64, yc - 140, { size: 28, w: 'S', color: C.slate, align: 'left', alpha: a * cio(t, T3.zero, 0.3) });
        // the seesaw link between the real yield and gold — until it snaps
        const lk = cio(t, T3.up - 0.2, 0.4); const br = cio(t, T3.brk, 0.5);
        if (lk > 0) {
          const ax = BX + BW / 2 + 20, ay = yTop + 10, bx = GX - 100, by = yc - 120; const mx = (ax + bx) / 2, my = (ay + by) / 2;
          ctx.save(); ctx.globalAlpha *= lk * a * (1 - br);
          ctx.setLineDash([9, 8]); ctx.strokeStyle = hexA(C.ink, 0.5); ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(mx - 10, my + br * 120); ctx.stroke(); ctx.beginPath(); ctx.moveTo(mx + 10, my + br * 120); ctx.lineTo(bx, by); ctx.stroke(); ctx.setLineDash([]);
          ctx.restore();
          if (br > 0) GK.pill(ctx, 'العلاقة مرات تنقطع', 960, 196, { style: 'red', size: 28, p: popP(t, T3.brk) * a });
        }
        chip(ctx, 'تفوتك فائدة', GX, 196, { size: 28, p: popP(t, T3.miss) * outA(t, T3.down - 0.3, 0.3) * a, dot: C.red });
        chev(ctx, GX + 150, yc - 40, 24, 1, C.red, a * cio(t, T3.press, 0.3) * outA(t, T3.down, 0.3));
        chev(ctx, GX + 150, yc - 40, 24, -1, '#2FA884', a * cio(t, T3.rev, 0.3) * outA(t, T3.brk, 0.3));
      }
    }
  }
  SH.st.push({ t0: D3.t1, t1: T3.inflQ + 0.4, back: ratesBack, front: rates });

  // --- «والتضخم؟» gold as long-run protection — a shield in the thread's wire, cracked by «بس مو مضمون»
  const SC = { x: 960, y: 270, w: 310, h: 326 };   // the tip just touches the thread
  const shieldPts = (() => { const { x, y, w: sw, h } = SC; const n = 60; const L = []; for (let i = 0; i <= n; i++) { const u = i / n; L.push([x - sw / 2 * (1 - Math.pow(u, 2.2)), y + h * u]); } const R = L.slice().reverse().map(([px, py]) => [2 * x - px, py]); const top = []; for (let i = 0; i <= 20; i++) { const u = i / 20; top.push([lerp(x + sw / 2, x - sw / 2, u), y - 18 * Math.sin(u * Math.PI)]); } return [...L, ...R, ...top]; })();
  const TS = T3.inflQ - 0.3;
  key(TS, 0.55, () => F600, { mode: 'settle', y: Y0, wave: 0.4, dir: 0 });
  sfx(T3.inflQ, 'pop', 0.12, { f: 600 }); sfx(T3.protect - 0.05, 'charge', 0.08, { d: 0.6 }); sfx(T3.protect + 0.5, 'chime', 0.12); sfx(T3.notSure, 'glitch', 0.1); sfx(T3.notSure + 0.08, 'snap', 0.14);
  // 2022: inflation bars behind, the gold line through the year ending where it began
  const G22 = [[0, 1800], [0.1, 1840], [0.19, 2050], [0.27, 1930], [0.34, 1870], [0.42, 1830], [0.5, 1780], [0.56, 1730], [0.63, 1720], [0.7, 1660], [0.74, 1630], [0.8, 1650], [0.86, 1750], [0.93, 1790], [1, 1812]];
  const CPI = [7.5, 7.9, 8.5, 8.3, 8.6, 9.1, 8.5, 8.3, 8.2, 7.7, 7.1, 6.5];
  const X22 = [430, 1490], v22 = (v) => lerp(760, 380, (v - 1550) / 600);
  const g22At = (u) => { for (let i = 1; i < G22.length; i++) if (u <= G22[i][0]) { const a = G22[i - 1], b = G22[i]; const k = (u - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * (0.5 - 0.5 * Math.cos(Math.PI * k)); } return G22[G22.length - 1][1]; };
  const S22 = Array.from({ length: 120 }, (_, i) => { const u = i / 119; return v22(g22At(u) + Math.sin(i * 1.7) * 9 + Math.sin(i * 0.63) * 14); });
  const L22 = TH.resample(TH.series(X22[0], X22[1], S22));
  const y22 = (x) => { const u = clamp((x - X22[0]) / (X22[1] - X22[0])) * 119; const i = Math.min(118, Math.floor(u)); return lerp(S22[i], S22[i + 1], u - i); };
  const P0 = T3.g22 - 0.1, PD = T3.same - P0 + 0.15;
  const pen22 = (t) => lerp(X22[0], X22[1], clamp((t - P0) / PD));
  key(T3.y22 - 0.45, 0.5, stat(flat(S22[0])), { wave: 0, dir: 1 });
  key(P0, 0, (t) => { const xf = pen22(t), yf = y22(xf); return L22.map(([x, y]) => (x <= xf ? [x, y] : [x, yf])); });
  sfx(T3.y22, 'pop', 0.12, { f: 700 }); sfx(T3.inf22, 'type', 0.06, { d: 0.6, n: 12 }); sfx(T3.high, 'pop', 0.12, { f: 520 }); sfx(P0, 'scribble', 0.08, { d: PD }); sfx(T3.same + 0.1, 'chime', 0.12);
  sfx(T3.ry, 'pop', 0.14, { f: 760 }); sfx(T3.dx, 'pop', 0.14, { f: 880 });
  SH.src.push({ t0: T3.wgc2, t1: T3.ry - 0.25, s: 'المصدر: مجلس الذهب العالمي' });
  key(T3.end, 0.55, () => F600, { mode: 'settle', y: Y0, wave: 0.8, dir: 1 });
  sfx(T3.end, 'whoosh', 0.1, { d: 0.5 });

  function inflBack(ctx, t, P) {
    if (t <= T3.y22 - 0.3) return; const a = cio(t, T3.y22 - 0.2, 0.4) * outA(t, T3.end - 0.15, 0.35);
    ctx.save(); ctx.globalAlpha *= a;
    CPI.forEach((v, i) => { const g = sp(t, T3.inf22 + i * 0.05, 12, 0.6); if (g <= 0) return; const bw = (X22[1] - X22[0]) / 12; const x = X22[0] + i * bw + 8; const h = v * 36 * Math.min(1, g); ctx.fillStyle = GL.swatch(ctx, 'rose', { y0: 820 - h, y1: 820 }); A.roundRect(ctx, x, 820 - h, bw - 16, h, 4); ctx.fill(); });
    ctx.strokeStyle = hexA(C.ink, 0.16); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X22[0], 820); ctx.lineTo(X22[1], 820); ctx.stroke();
    ctx.restore();
  }
  function infl(ctx, t, P) {
    // shield + ingot
    const sh = cio(t, T3.protect - 0.1, 0.7); const sa = outA(t, T3.y22 - 0.5, 0.35);
    if (t > T3.inflQ - 0.2 && sa > 0) {
      const ig = sp(t, T3.inflQ + 0.1, 12, 0.6); const lift = cio(t, T3.protect - 0.35, 0.55);
      ctx.save(); ctx.globalAlpha *= sa;
      fromLine(ctx, Y0 + 2, () => GK.ingot(ctx, 875, 532 + (1 - Math.min(1, ig)) * 90 - lift * 142, 170, 64, { depth: 22, shadow: false }), { gap: 2 });
      txt(ctx, 'والتضخم؟', 960, 196, { size: 44, w: 'S', color: C.ink, align: 'center', alpha: cio(t, T3.inflQ, 0.3) * outA(t, T3.protect - 0.3, 0.3) });
      if (sh > 0) {
        const crack = cio(t, T3.notSure, 0.3); const pts = shieldPts;
        const n = pts.length; const gapAt = 0.18;
        if (crack <= 0) TH.draw(ctx, pts, { b: sh, width: 6 });
        else { TH.draw(ctx, pts, { a: 0, b: gapAt - 0.02 * crack, width: 6 }); TH.draw(ctx, pts.map(([x, y]) => [x + crack * 14, y + crack * 10]), { a: gapAt + 0.02 * crack, b: 1, width: 6 }); }
        // inflation darts bouncing off
        for (let k = 0; k < 3; k++) { const t0 = T3.protect + 0.15 + k * 0.32; const q = clamp((t - t0) / 0.5); if (q <= 0 || q >= 1) continue; const side = k % 2 ? 1 : -1; const y = 360 + k * 70; const xr = 960 + side * (230 - 80 * Math.sin(q * Math.PI)); arrow(ctx, 960 + side * 420, y, xr, y, 1, { color: '#A6767A', w: 3, alpha: Math.sin(q * Math.PI) }); }
        GK.pill(ctx, 'حماية على المدى البعيد', 960, 196, { style: 'gold', size: 28, p: popP(t, T3.longrun - 0.2) * (1 - crack) });
        GK.pill(ctx, 'بس مو مضمون', 960, 196, { style: 'red', size: 28, p: popP(t, T3.notSure) });
      }
      ctx.restore();
    }
    // 2022
    if (t > T3.y22 - 0.3) {
      const a = cio(t, T3.y22 - 0.2, 0.4) * outA(t, T3.end - 0.15, 0.35);
      tok(ctx, '2022', 960, 196, { size: 30, p: popP(t, T3.y22) * a });
      chip(ctx, 'التضخم كان عالي', 470, 300, { size: 28, p: popP(t, T3.high) * a, dot: '#A6767A' });
      // the gold line ends where it began
      const lv = cio(t, T3.same - 0.1, 0.5) * a;
      if (lv > 0) { dash(ctx, X22[0], S22[0], X22[1], S22[0], { p: lv, color: hexA(C.ink, 0.5) }); tok(ctx, '≈ نفس المستوى', 1540, S22[0] - 60, { size: 26, p: popP(t, T3.same) * a, latin: false }); }
      if (t > P0 - 0.1 && t < P0 + PD + 0.3) { const x = pen22(t); TH.head(ctx, x, y22(x), t, { r: 8, alpha: a * cio(t, P0 - 0.1, 0.15) * outA(t, P0 + PD, 0.25) }); }
      // meanwhile real yields and the dollar rose
      const ra = a * outA(t, T3.end - 0.2, 0.3);
      if (t > T3.ry - 0.2) { ctx.save(); ctx.globalAlpha *= ra; chip(ctx, 'العوائد الحقيقية', 1180, 300, { size: 28, p: popP(t, T3.ry) }); chev(ctx, 1180 + 150, 300, 22, -1, C.ink, cio(t, T3.ry + 0.1, 0.3)); chip(ctx, 'الدولار', 1560, 300, { size: 28, p: popP(t, T3.dx) }); chev(ctx, 1560 + 86, 300, 22, -1, C.ink, cio(t, T3.dx + 0.1, 0.3)); ctx.restore(); }
    }
  }
  SH.st.push({ t0: T3.inflQ - 0.4, t1: T3.end + 0.6, back: inflBack, front: infl });

  // ================================================================ 04 · DEMAND & SUPPLY
  const D4 = { t0: w(48, 0) - 0.06, t1: w(50, 0) - 0.4, y: Y0, sw: 'taupeD', idx: '04', words: [{ s: 'الطلب', t: w(49, 0) }, { s: 'والعرض', t: w(49, 1) }] };
  SH.divs.push(D4); SH.labels.push([D4.t0 + 0.1, '04', 'الطلب والعرض']);
  key(D4.t0 - 0.04, 0, (t) => TH.twang(F600, t, D4.t0, 22));
  sfx(D4.t0, 'whoosh', 0.16, { d: 0.45 }); sfx(D4.t0 + 0.02, 'pluck', 0.2, { f: 123 }); sfx(D4.t1, 'whoosh', 0.12, { d: 0.45, up: false });
  const T4 = { est: w(50, 0), net: w(51, 1), cb: w(51, 2), k1: w(51, 7), y22: w(52, 1), y24: w(53, 1), n863: w(54, 1), y25: w(54, 4), inv: w(55, 0), bars: w(56, 1), coins: w(56, 2), funds: w(56, 4), rec: w(57, 0), y25b: w(57, 2), recW: w(57, 3), wgc: w(58, 0), mines: w(59, 0), add: w(59, 1), lt2: w(59, 2), above: w(59, 6), ground: w(59, 9), dem: w(60, 0), price: w(61, 1), end: w(62, 0) - 0.62 };
  SH.src.push({ t0: T4.est, t1: T4.inv - 0.3, s: 'تقديرات مجلس الذهب العالمي' });
  // central banks' net purchases (t): 2022–2024 above 1,000 t, 2025 ≈ 863 t
  const CBX = [560, 840, 1120, 1400], CBV = [1080, 1050, 1090, 863], CBT = [T4.k1 + 0.35, T4.k1 + 0.6, T4.k1 + 0.85, T4.n863], tY = (v) => v * 0.3;
  const cbH = (t, i) => tY(CBV[i]) * Math.min(1.06, sp(t, CBT[i], 11, 0.55)) * (1 - cio(t, T4.inv - 0.45, 0.45));
  key(D4.t1 + 0.4, 0, (t) => sky(Y0, CBX.map((x, i) => ({ x, w: 190, h: cbH(t, i) }))));
  CBT.forEach((tt, i) => { sfx(tt, 'stretch', 0.1, { pan: +(((CBX[i] - 960) / 960) * 0.4).toFixed(2) }); sfx(tt + 0.32, 'pluck', 0.08, { f: [131, 147, 165, 110][i] }); });
  sfx(T4.net, 'pop', 0.14, { f: 760 }); sfx(T4.k1, 'tick', 0.12, { f: 2400 }); sfx(T4.n863 + 0.2, 'pop', 0.14, { f: 600 });
  // investment: bars, coins, funds rise out of the thread; then the record (2020 → 2025)
  const IX = [1360, 960, 560];
  const RECX = [800, 1120], RECH = [1805 * 0.16, 2175 * 0.16];
  const recH = (t, i) => RECH[i] * Math.min(1.06, sp(t, i ? T4.y25b : T4.rec - 0.1, 11, 0.55)) * (1 - cio(t, T4.mines - 0.45, 0.45));
  key(T4.rec - 0.2, 0, (t) => sky(Y0, RECX.map((x, i) => ({ x, w: 200, h: recH(t, i) }))));
  sfx(T4.inv, 'whoosh', 0.1, { d: 0.4 }); [T4.bars, T4.coins, T4.funds].forEach((tt, i) => sfx(tt, 'pop', 0.14, { f: [700, 860, 620][i], pan: +(((IX[i] - 960) / 960) * 0.4).toFixed(2) }));
  sfx(T4.rec - 0.1, 'stretch', 0.1); sfx(T4.y25b, 'stretch', 0.12); sfx(T4.recW, 'chime', 0.16); sfx(T4.recW + 0.02, 'pop', 0.14, { f: 900 });
  // mines add < 2 % a year to the gold above ground — an isometric block on the thread (the ground)
  sfx(T4.mines, 'whoosh', 0.1, { d: 0.4 }); sfx(T4.mines + 0.3, 'slam', 0.12); sfx(T4.add + 0.2, 'pop', 0.14, { f: 980 }); sfx(T4.lt2, 'tick', 0.12, { f: 2600 });
  const DEM = (t) => 60 * Math.min(1.1, sp(t, T4.price, 10, 0.5)) * (1 - cio(t, T4.end - 0.25, 0.4));
  key(T4.dem - 0.1, 0, (t) => { const d = DEM(t); return d === 0 ? F600 : F600.map(([x, y]) => [x, y - d * clamp((x - 1240) / 260) * (1 - clamp((x - 1700) / 300))]); });
  sfx(T4.price, 'pluck', 0.12, { f: 165 }); sfx(T4.end, 'whoosh', 0.1, { d: 0.5 });

  // isometric block
  function iso(ctx, cx, by, wx, wz, h, o = {}) {
    const ax = 0.866, ay = 0.5; const A0 = [cx, by], L = [cx - wx * ax, by - wx * ay], R = [cx + wz * ax, by - wz * ay];
    const up = (p) => [p[0], p[1] - h]; const T0 = up(A0), TL = up(L), TR = up(R), TB = [L[0] + wz * ax, L[1] - wz * ay - h];
    const face = (pts, fill) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); if (o.edge) { ctx.strokeStyle = o.edge; ctx.lineWidth = 1.5; ctx.stroke(); } };
    const gl = ctx.createLinearGradient(0, by - h - wx * ay, 0, by); gl.addColorStop(0, o.l0 || '#E2BE62'); gl.addColorStop(1, o.l1 || '#B88A2E');
    const gr = ctx.createLinearGradient(0, by - h - wz * ay, 0, by); gr.addColorStop(0, o.r0 || '#D4AA4A'); gr.addColorStop(1, o.r1 || '#9C7426');
    face([A0, L, TL, T0], gl); face([A0, R, TR, T0], gr); face([T0, TL, TB, TR], o.top || '#F6E2A4');
    return { top: T0, TL, TR, TB };
  }
  function supplyBack(ctx, t, P) {
    if (t < T4.inv + 0.2) { const a = cio(t, D4.t1 + 0.3, 0.3) * outA(t, T4.inv - 0.4, 0.35); ctx.save(); ctx.globalAlpha *= a; CBX.forEach((x, i) => { const h = cbH(t, i); if (h < 1) return; ctx.fillStyle = GL.swatch(ctx, 'beige', { y0: Y0 - h, y1: Y0 }); ctx.fillRect(x - 95, Y0 - h, 190, h); }); ctx.restore(); }
    if (t > T4.inv - 0.3 && t < T4.mines + 0.2) { const a = cio(t, T4.inv - 0.2, 0.3) * outA(t, T4.mines - 0.4, 0.35); ctx.save(); ctx.globalAlpha *= a; RECX.forEach((x, i) => { const h = recH(t, i); if (h < 1) return; ctx.fillStyle = i ? GL.goldFlat(ctx, Y0 - h, Y0) : GL.swatch(ctx, 'beige', { y0: Y0 - h, y1: Y0 }); ctx.fillRect(x - 100, Y0 - h, 200, h); }); ctx.restore(); }
  }
  function supply(ctx, t, P) {
    // central banks
    if (t < T4.inv + 0.2) {
      const a = cio(t, D4.t1 + 0.3, 0.3) * outA(t, T4.inv - 0.4, 0.35);
      ctx.save(); ctx.globalAlpha *= a;
      const k1y = Y0 - tY(1000); dash(ctx, 400, k1y, 1560, k1y, { p: cio(t, T4.k1 - 0.1, 0.5), color: hexA(C.ink, 0.55) });
      tok(ctx, '1,000 t', 1640, k1y, { size: 22, p: popP(t, T4.k1) });
      ['2022', '2023', '2024', '2025'].forEach((y, i) => { const tt = [T4.y22, (T4.y22 + T4.y24) / 2, T4.y24, T4.y25][i]; lat(ctx, y, CBX[i], Y0 + 50, { size: 26, w: 600, color: C.ink, align: 'center', alpha: cio(t, tt - 0.05, 0.3) }); });
      txt(ctx, 'أكثر من 1,000 طن كل سنة', 840, k1y - 150, { size: 30, w: 'S', color: C.ink, align: 'center', alpha: cio(t, T4.k1 + 0.4, 0.3) * outA(t, T4.n863 - 0.3, 0.3) });
      const n = Math.round(roll(t, T4.n863, 0.8, 0, 863)); if (t > T4.n863 - 0.05) txt(ctx, 'حوالي ' + n + ' طن', 1400, Y0 - cbH(t, 3) - 26, { size: 30, w: 'S', color: C.ink, align: 'center' });
      ctx.restore();
      chip(ctx, 'صافي مشتريات البنوك المركزية', 960, 196, { size: 30, p: popP(t, T4.net) * a });
    }
    // investment
    if (t > T4.inv - 0.3 && t < T4.mines + 0.2) {
      const a = cio(t, T4.inv - 0.2, 0.3) * outA(t, T4.mines - 0.4, 0.35);
      const it = outA(t, T4.rec - 0.25, 0.35);
      ctx.save(); ctx.globalAlpha *= a;
      txt(ctx, 'الاستثمار', 960, 210, { size: 44, w: 'S', color: C.ink, align: 'center', alpha: cio(t, T4.inv, 0.3) * outA(t, T4.rec - 0.25, 0.3) });
      [T4.bars, T4.coins, T4.funds].forEach((tt, i) => {
        const p = sp(t, tt, 12, 0.6); if (p <= 0 || it <= 0) return; const x = IX[i]; const dy = (1 - Math.min(1, p)) * 110;
        ctx.save(); ctx.globalAlpha *= it;
        fromLine(ctx, Y0 + 2, () => {
          if (i === 0) GK.ingot(ctx, x - 90, Y0 - 70 + dy, 180, 66, { depth: 24, shadow: false });
          else if (i === 1) { GK.coin(ctx, x - 40, Y0 - 62 + dy, 58); GK.coin(ctx, x + 46, Y0 - 50 + dy, 46); }
          else { card(ctx, x - 80, Y0 - 190 + dy, 160, 186, { r: 14 }); ctx.save(); ctx.beginPath(); for (let k = 0; k <= 12; k++) { const u = k / 12; const yy = Y0 - 60 + dy - u * 70 - Math.sin(u * 9) * 10; k ? ctx.lineTo(x - 60 + u * 120, yy) : ctx.moveTo(x - 60, yy); } ctx.strokeStyle = '#C49A3A'; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); lat(ctx, 'ETF', x, Y0 - 150 + dy, { size: 26, w: 700, color: C.ink, align: 'center' }); }
        }, { gap: 2 });
        txt(ctx, ['سبائك', 'عملات ذهبية', 'صناديق الذهب'][i], x, Y0 + 56, { size: 28, w: 'S', color: C.ink, align: 'center', alpha: clamp(p) });
        ctx.restore();
      });
      // record: 2025 beats the 2020 record
      RECX.forEach((x, i) => { const h = recH(t, i); if (h < 1) return; lat(ctx, i ? '2025' : '2020', x, Y0 + 50, { size: 26, w: 600, color: C.ink, align: 'center', alpha: clamp(h / 40) }); });
      const ry = Y0 - RECH[0]; const rp = cio(t, T4.y25b + 0.2, 0.5) * outA(t, T4.mines - 0.45, 0.3); if (rp > 0) { dash(ctx, 640, ry, 1300, ry, { p: rp }); txt(ctx, 'الرقم القياسي السابق', 620, ry + 10, { size: 24, w: 'R', color: C.slate, align: 'right', alpha: rp }); }
      ctx.restore();
      GK.pill(ctx, 'رقم قياسي', RECX[1], Y0 - RECH[1] - 50, { style: 'gold', size: 28, p: popP(t, T4.recW) * a });
    }
    // mines: the block of all gold above ground + this year's thin new layer
    if (t > T4.mines - 0.2) {
      const a = cio(t, T4.mines - 0.1, 0.3) * outA(t, T4.end - 0.2, 0.35); const rs = sp(t, T4.mines, 11, 0.6);
      ctx.save(); ctx.globalAlpha *= a;
      fromLine(ctx, Y0 + 2, () => { iso(ctx, 900, Y0 + (1 - Math.min(1, rs)) * 300, 200, 200, 170); }, { gap: 2 });
      const sl = sp(t, T4.add, 13, 0.55); if (sl > 0) { const yy = Y0 - 170 - (1 - Math.min(1, sl)) * 160; iso(ctx, 900, yy, 200, 200, 7, { l0: '#FFF4C7', l1: '#F6DE8E', r0: '#F7E6A8', r1: '#E9CB72', top: '#FFF8DD', edge: 'rgba(156,116,38,0.6)' }); }
      txt(ctx, 'الذهب اللي فوق الأرض', 460, 440, { size: 30, w: 'S', color: C.ink, align: 'center', alpha: cio(t, T4.above, 0.3) });
      ctx.restore();
      chip(ctx, 'المناجم تضيف', 960, 196, { size: 28, p: popP(t, T4.add) * a });
      tok(ctx, 'أقل من 2% بالسنة', 1320, 290, { size: 26, p: popP(t, T4.lt2) * a, latin: false });
      arrow(ctx, 1200, 312, 990, 352, cio(t, T4.lt2 + 0.1, 0.35) * a, { dash: [7, 6], color: hexA(C.ink, 0.55), w: 2.5, head: 12 });
      // demand moves the price
      if (t > T4.dem - 0.1) { chip(ctx, 'تغيّر الطلب', 1470, 690, { size: 28, p: popP(t, T4.dem) * a }); chev(ctx, 1600, 450, 26, -1, C.ink, a * cio(t, T4.price, 0.3)); }
    }
  }
  SH.st.push({ t0: D4.t1, t1: T4.end + 0.6, back: supplyBack, front: supply });
})(typeof window !== 'undefined' ? window : globalThis);
