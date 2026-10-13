// Act I — open, title, two traders, fundamental/technical briefs, horizons, together, worked example.
(function (G) {
  const A = G.AX, F = G.FILM;
  const { W, H, C, INK, clamp, lerp, inv, sp, spring, eo, ei, eio, hexA, background, line, rectPts, circPts, hatch, txt, lat, measure, slotText, wipeText, logo, logoWidth, tri, roundRect, series, sma, subPath } = A;
  const { w, we, ph, phe, sfx, hud, rich, eyebrow, card, tag, pill, hero, candles, linePts, scene } = F;

  // ---------- small drawings ----------
  function docIcon(ctx, ink, cx, cy, s, t, p = 1) {
    const x = cx - s * 0.38, y = cy - s / 2; const col = INK[ink].line;
    line(ctx, ink, [[x, y], [x + s * 0.55, y], [x + s * 0.76, y + s * 0.2], [x + s * 0.76, y + s], [x, y + s], [x, y]], { t, reveal: p, width: 3 });
    for (let i = 0; i < 4; i++) line(ctx, ink, [[x + s * 0.14, y + s * (0.38 + i * 0.14)], [x + s * (0.62 - (i % 2) * 0.14), y + s * (0.38 + i * 0.14)]], { t, reveal: clamp(p * 1.4 - 0.3 - i * 0.08), width: 2, seed: i + 3 });
    const mx = cx + s * 0.32, my = cy + s * 0.18, r = s * 0.2;
    line(ctx, ink, circPts(mx, my, r, 40), { t, reveal: clamp(p * 1.5 - 0.4), width: 3.5, color: col });
    line(ctx, ink, [[mx + r * 0.7, my + r * 0.7], [mx + r * 1.6, my + r * 1.6]], { t, reveal: clamp(p * 2 - 0.9), width: 5, color: col });
  }
  function miniCandles(ctx, ink, cx, cy, s, t, p = 1) {
    const vals = [0.2, 0.35, 0.3, 0.5, 0.45, 0.65, 0.6, 0.82];
    const n = Math.floor(vals.length * p + 0.001); const col = INK[ink].line; const bw = s / 14;
    line(ctx, ink, [[cx - s / 2, cy + s / 2], [cx + s / 2, cy + s / 2]], { t, reveal: clamp(p * 3), width: 2.5 });
    for (let i = 0; i < n; i++) {
      const x = cx - s / 2 + (i + 0.6) * s / 8.6, v = vals[i], up = i % 3 !== 2;
      const yb = cy + s / 2 - v * s * 0.85, hgt = s * 0.16;
      ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, yb - hgt * 0.5); ctx.lineTo(x, yb + hgt * 1.5); ctx.stroke();
      if (up) ctx.strokeRect(x - bw / 2, yb, bw, hgt); else ctx.fillRect(x - bw / 2, yb, bw, hgt);
      ctx.restore();
    }
  }
  function gearPts(cx, cy, r, teeth, rot, depth = 0.13) {
    const pts = []; const n = teeth * 4;
    for (let i = 0; i <= n; i++) {
      const a = rot + i / n * Math.PI * 2; const ph = i % 4; const rr = ph === 0 || ph === 1 ? r * (1 + depth / 2) : r * (1 - depth / 2);
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
    }
    return pts;
  }
  F.gearPts = gearPts; F.docIcon = docIcon; F.miniCandles = miniCandles;

  // =====================================================================
  // S0 — brand open: white stacked logo on the primary gradient (1.5 s)
  // =====================================================================
  sfx(0.06, 'identity', 0.55);
  scene({
    name: 'open', t0: 0, t1: F.OFF,
    draw(ctx, t) {
      background(ctx, 'steel', { gradient: [C.frost, C.slate], grid: false });
      const h = 300, lw = logoWidth(h);
      logo(ctx, 960 - lw / 2, 540 - h / 2 - 10, h, C.white, { axi: sp(t, 0.18, 12), iraq: sp(t, 0.55, 12) });
    },
  });

  // =====================================================================
  // S1 — title on rails (paper)
  // =====================================================================
  const S1 = { t0: F.OFF, t1: w(3, 0) };
  const k1 = { open: w(0, 4) - 0.25, out1: w(1, 0), whip: w(1, 2), clap: w(1, 4), vs: w(1, 4) + 0.18, stretch: w(1, 5), crush: w(2, 0), ticks: w(2, 3) };
  sfx(S1.t0 - 0.4, 'scan', 0.22, { d: 0.5 });
  sfx(S1.t0 + 0.05, 'pen', 0.18, { d: 0.6 });
  sfx(k1.open, 'swipe', 0.16, { d: 0.3 });
  sfx(k1.out1 - 0.05, 'swipe', 0.12, { d: 0.25 });
  sfx(k1.whip - 0.1, 'whoosh', 0.3, { d: 0.32, pan: 0.5 });
  sfx(k1.clap, 'thump', 0.38); sfx(k1.vs, 'pop', 0.2, { f: 900 });
  sfx(k1.stretch, 'swipe', 0.16, { d: 0.3, pan: -0.5 });
  sfx(k1.crush, 'thump', 0.45);
  sfx(k1.ticks, 'rollup', 0.22, { d: 0.6, n: 16 });
  scene({
    name: 'title', t0: S1.t0, t1: S1.t1, enter: { type: 'scanDown', dur: 0.5, line: C.ink },
    draw(ctx, t) {
      background(ctx, 'paper');
      const X0 = 150, X1 = 1770, cy = 540;
      // slot height: opens, claps, reopens, crushes
      let hgt = 26 + 214 * sp(t, k1.open, 16) - 240 * sp(t, k1.clap - 0.06, 34) + 214 * sp(t, k1.clap + 0.16, 18) - 214 * sp(t, k1.crush, 26);
      hgt = Math.max(0, hgt);
      const yT = cy - hgt / 2, yB = cy + hgt / 2;
      const rev = eo(t, S1.t0, 0.55);
      line(ctx, 'paper', [[X1, yB], [X0, yB]], { t, reveal: rev, width: 3.2 });
      if (hgt > 0.5) line(ctx, 'paper', [[X1, yT], [X0, yT]], { t, reveal: eo(t, S1.t0 + 0.12, 0.55), width: 3.2, seed: 4 });
      // dimension marker on the right: live slot height
      if (hgt > 30 && t < k1.crush) {
        const dx = X1 + 34; ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(dx, yT); ctx.lineTo(dx, yB); ctx.moveTo(dx - 8, yT); ctx.lineTo(dx + 8, yT); ctx.moveTo(dx - 8, yB); ctx.lineTo(dx + 8, yB); ctx.stroke(); ctx.restore();
        lat(ctx, String(Math.round(hgt)), dx + 14, cy + 8, { size: 20, w: 600, color: C.red });
      }
      // lesson eyebrow + intro line above the rails
      eyebrow(ctx, 'الدرس 16', X1, 250, eo(t, S1.t0 + 0.2, 0.5));
      const introP = inv(w(0, 0), we(0, 3), t) * (1 - eo(t, k1.crush, 0.3));
      if (introP > 0) wipeText(ctx, 'في هذا الدرس سنتعلّم', X1, Math.min(yT, cy - 13) - 34, { size: 34, w: 'R', color: C.charcoal }, introP);
      // phrase 1: rises through the bottom rail, leaves through the top
      ctx.save(); ctx.beginPath(); ctx.rect(0, yT, W, Math.max(0, hgt)); ctx.clip();
      const p1 = sp(t, k1.open + 0.08, 14), q1 = ei(t, k1.out1, 0.3);
      if (p1 > 0 && q1 < 1) txt(ctx, 'كيف نحلّل الأسواق', X1, cy + 40 + (1 - p1) * 170 - q1 * 240, { size: 112, w: 'L', color: C.ink });
      // phrase 2: whips in from the right (1400 px in 0.2 s), squashes with the clap
      const sq = hgt / 240;
      const pw = eo(t, k1.whip - 0.05, 0.22);
      if (pw > 0) { ctx.save(); ctx.translate(0, cy); ctx.scale(1, clamp(sq, 0, 1)); txt(ctx, 'التحليل الأساسي', X1 + (1 - pw) * 1400, 40, { size: 104, w: 'L', color: C.ink }); ctx.restore(); }
      // phrase 3: stretches out of the line
      const ps = sp(t, k1.stretch, 16);
      if (ps > 0) { ctx.save(); ctx.translate(0, cy); ctx.scale(1, clamp(ps * sq, 0, 1)); txt(ctx, 'التحليل الفني', X0, 40, { size: 104, w: 'L', color: C.ink, align: 'left' }); ctx.restore(); }
      ctx.restore();
      // "مقابل" — the one red word
      const pv = sp(t, k1.vs, 20) * (1 - eo(t, k1.crush, 0.2));
      if (pv > 0) { ctx.save(); ctx.translate(960, cy + 12); ctx.scale(pv, pv); txt(ctx, 'مقابل', 0, 0, { size: 40, w: 'R', color: C.red, align: 'center' }); ctx.restore(); }
      // ruler ticks sweep right-to-left along the crushed line (price scale)
      if (t > k1.ticks - 0.1) {
        for (let i = 0; i <= 40; i++) {
          const x = X1 - i * (X1 - X0) / 40; const pi = eo(t, k1.ticks + i * 0.014, 0.25) * (1 - ei(t, S1.t1 - 0.25, 0.25));
          if (pi <= 0) continue; const len = (i % 5 === 0 ? 22 : 11) * pi;
          ctx.save(); ctx.strokeStyle = i % 5 === 0 ? C.ink : hexA(C.ink, 0.6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, cy - 2); ctx.lineTo(x, cy - 2 - len); ctx.stroke(); ctx.restore();
          if (i % 10 === 0) lat(ctx, (1.09 - i * 0.00025).toFixed(4), x, cy + 36, { size: 20, w: 400, color: C.charcoal, align: 'center', alpha: pi });
        }
      }
      hud(ctx, t, 'paper', '01|المقدّمة', { alpha: eo(t, S1.t0, 0.4) });
    },
  });

  // =====================================================================
  // S2 — two kinds of trader: the line stands up and splits the frame
  // =====================================================================
  const S2 = { t0: w(3, 0), t1: w(4, 0) };
  const k2 = { rot: w(3, 0), flood: w(3, 1) + 0.05, two: w(3, 1), labels: w(3, 2), traders: w(3, 4), exit: w(4, 0) - 0.45 };
  sfx(k2.rot, 'whoosh', 0.22, { d: 0.4 });
  sfx(k2.flood, 'scan', 0.2, { d: 0.45 });
  sfx(k2.two, 'thump', 0.4);
  sfx(k2.labels, 'pop', 0.22, { f: 760, pan: 0.5 }); sfx(k2.labels + 0.12, 'pop', 0.22, { f: 640, pan: -0.5 });
  sfx(k2.exit, 'whoosh', 0.22, { d: 0.45, up: false, pan: -0.6 });
  scene({
    name: 'two', t0: S2.t0, t1: S2.t1,
    draw(ctx, t) {
      const rot = sp(t, k2.rot, 14);
      const div = 960 * (1 - eio(t, k2.exit, 0.45));                  // steel retreats left at the end
      const fl = eo(t, k2.flood, 0.45);
      const steelL = lerp(div, 0, fl) * (fl > 0 ? 1 : 0);               // steel spans [steelL, div]
      background(ctx, 'paper');
      const paperHud = () => hud(ctx, t, 'paper', '01|المقدّمة');
      // steel half
      const drawSteel = () => {
        if (fl <= 0 || div <= steelL) return;
        ctx.save(); ctx.beginPath(); ctx.rect(steelL, 0, div - steelL, H); ctx.clip();
        background(ctx, 'steel');
        // left label + icon
        const pl = sp(t, k2.labels + 0.12, 16);
        if (pl > 0) {
          const cx = 480 - (960 - div) * 0.6;
          F.miniCandles(ctx, 'steel', cx, 420, 210, t, eo(t, k2.labels + 0.1, 0.6));
          txt(ctx, 'متداول', cx, 640 + (1 - pl) * 30, { size: 30, w: 'R', color: INK.steel.sub, align: 'center', alpha: pl });
          txt(ctx, 'فنّي', cx, 760 + (1 - pl) * 40, { size: 120, w: 'L', color: C.white, align: 'center', alpha: pl });
        }
        hud(ctx, t, 'steel', '01|المقدّمة', { tr: false, br: false });
        ctx.restore();
      };
      // right label + icon (paper)
      const pr = sp(t, k2.labels, 16) * (1 - ei(t, k2.exit + 0.1, 0.3));
      if (pr > 0) {
        F.docIcon(ctx, 'paper', 1440, 420, 200, t, eo(t, k2.labels, 0.6));
        txt(ctx, 'متداول', 1440, 640 + (1 - pr) * 30, { size: 30, w: 'R', color: C.charcoal, align: 'center', alpha: pr });
        txt(ctx, 'أساسي', 1440, 760 + (1 - pr) * 40, { size: 120, w: 'L', color: C.ink, align: 'center', alpha: pr });
      }
      paperHud();
      drawSteel();
      // the line: horizontal -> vertical divider
      const ang = rot * Math.PI / 2; const half = lerp(810, 620, rot);
      const cx = div, cy = 540;
      const dx = Math.cos(ang) * half, dy = Math.sin(ang) * half;
      if (div > 2) line(ctx, 'paper', [[cx + dx, cy - dy], [cx - dx, cy + dy]], { t, width: 3.2, color: C.ink });
      // the "2": ink on paper, white on steel
      const p2 = sp(t, k2.two, 18) * (1 - ei(t, k2.exit, 0.3));
      if (p2 > 0) {
        for (const side of ['paper', 'steel']) {
          ctx.save(); ctx.beginPath(); if (side === 'paper') ctx.rect(div, 0, W, H); else ctx.rect(0, 0, div, H); ctx.clip();
          ctx.translate(960, 600); ctx.scale(p2, p2); hero(ctx, '2', 0, 100, { size: 330, color: side === 'paper' ? C.ink : C.white }); ctx.restore();
        }
      }
      const pt = eo(t, k2.traders, 0.4) * (1 - ei(t, k2.exit, 0.25));
      if (pt > 0) {
        for (const side of ['paper', 'steel']) {
          ctx.save(); ctx.beginPath(); if (side === 'paper') ctx.rect(div, 0, W, H); else ctx.rect(0, 0, div, H); ctx.clip();
          txt(ctx, 'نوعان رئيسيان من المتداولين', 960, 905, { size: 34, w: 'R', color: side === 'paper' ? C.charcoal : C.white, align: 'center', alpha: pt }); ctx.restore();
        }
      }
    },
  });

  // =====================================================================
  // S3 — fundamental analysts study economic data (paper)
  // =====================================================================
  const S3 = { t0: w(4, 0), t1: w(11, 0) };
  const k3 = { brow: w(4, 0), head: w(5, 0), sub: w(6, 0), c1: w(7, 1), c2: w(8, 0), c3: w(9, 0), squash: w(10, 0), line: w(10, 1), fc: w(10, 2) };
  sfx(k3.brow, 'tick', 0.25); sfx(k3.head, 'swipe', 0.12, { d: 0.4 });
  sfx(k3.c1 - 0.05, 'pop', 0.26, { f: 820, pan: 0.5 }); sfx(k3.c1 + 0.2, 'rollup', 0.12, { d: 0.6, n: 10, pan: 0.5 });
  sfx(k3.c2 - 0.05, 'pop', 0.26, { f: 700 }); sfx(k3.c2 + 0.2, 'rollup', 0.12, { d: 0.6, n: 10 });
  sfx(k3.c3 - 0.05, 'pop', 0.26, { f: 600, pan: -0.5 }); sfx(k3.c3 + 0.2, 'rollup', 0.12, { d: 0.6, n: 10, pan: -0.5 });
  sfx(k3.squash, 'whoosh', 0.2, { d: 0.4, up: false }); sfx(k3.line, 'pen', 0.2, { d: 0.9 }); sfx(k3.fc, 'tick', 0.22);
  const fundSeries = series(46, 33, { start: 100, vol: 1.2, drift: (u) => 0.35 + Math.sin(u * 6) * 0.3 });
  scene({
    name: 'fund-brief', t0: S3.t0, t1: S3.t1, enter: { type: 'cut' },
    draw(ctx, t) {
      background(ctx, 'paper');
      eyebrow(ctx, 'أولاً', 1770, 200, eo(t, k3.brow, 0.4));
      rich(ctx, [{ s: 'المحلّلون' }, { s: 'الأساسيون', red: true }], 1770, 318, { size: 96, w: 'L', color: C.ink, p: inv(k3.head, we(5, 2), t) });
      wipeText(ctx, 'يدرسون البيانات الاقتصادية', 1770, 392, { size: 40, w: 'R', color: C.charcoal }, inv(k3.sub, we(6, 3), t));
      // three data cards
      const sq = eio(t, k3.squash, 0.55);
      const cards = [
        { t: k3.c1, x: 1300, title: 'التضخّم', code: 'CPI', val: 3.2, unit: '%', kind: 'steps' },
        { t: k3.c2, x: 800, title: 'الناتج المحلي الإجمالي', code: 'GDP', val: 2.4, unit: '%', kind: 'bars' },
        { t: k3.c3, x: 300, title: 'أسعار الفائدة', code: 'Interest Rate', val: 4.5, unit: '%', kind: 'dial' },
      ];
      cards.forEach((cd, i) => {
        const p = sp(t, cd.t - 0.1, 15); if (p <= 0) return;
        const y = lerp(450, 812, sq), hgt = lerp(340, 76, sq), wd = 470;
        card(ctx, cd.x, y, wd, hgt, { p });
        const dy = (1 - p) * 60; const a = clamp(p * 1.6);
        ctx.save(); ctx.translate(0, dy); ctx.globalAlpha = a;
        txt(ctx, cd.title, cd.x + wd - 36, y + lerp(64, 50, sq), { size: lerp(34, 28, sq), w: 'R', color: C.ink });
        if (sq < 0.98) {
          ctx.save(); ctx.globalAlpha = a * (1 - sq);
          const bx = cd.x + 40, by = y + 100, bw = wd - 80, bh = 140; const pv = eo(t, cd.t, 0.9);
          if (cd.kind === 'steps') {
            const pts = []; for (let j = 0; j <= 6; j++) { const yy = by + bh - (j / 6) * bh * 0.85; pts.push([bx + j * bw / 7, yy]); pts.push([bx + (j + 1) * bw / 7, yy]); }
            line(ctx, 'paper', pts, { t, reveal: pv, width: 3 });
            hatch(ctx, 'paper', (c) => { c.beginPath(); c.moveTo(bx, by + bh); pts.forEach(([px, py]) => c.lineTo(px, py)); c.lineTo(bx + bw, by + bh); c.closePath(); }, { box: [bx, by, bw, bh], progress: pv, gap: 12, t });
          } else if (cd.kind === 'bars') {
            for (let j = 0; j < 6; j++) {
              const hh = bh * (0.35 + j * 0.11) * eo(t, cd.t + j * 0.07, 0.5); const x = bx + j * (bw / 6) + 10, ww = bw / 6 - 20;
              line(ctx, 'paper', rectPts(x, by + bh - hh, ww, hh), { t, width: 2.4, seed: j });
              hatch(ctx, 'paper', (c) => { c.beginPath(); c.rect(x, by + bh - hh, ww, hh); }, { box: [x, by, ww, bh], gap: 9, t });
            }
          } else {
            const cx = bx + bw / 2, cy = by + bh, r = 120;
            const arc = []; for (let j = 0; j <= 40; j++) { const a2 = Math.PI + j / 40 * Math.PI; arc.push([cx + Math.cos(a2) * r, cy + Math.sin(a2) * r]); }
            line(ctx, 'paper', arc, { t, reveal: pv, width: 3 });
            for (let j = 0; j <= 8; j++) { const a2 = Math.PI + j / 8 * Math.PI; line(ctx, 'paper', [[cx + Math.cos(a2) * (r - 14), cy + Math.sin(a2) * (r - 14)], [cx + Math.cos(a2) * r, cy + Math.sin(a2) * r]], { t, width: 2, reveal: pv }); }
            const na = Math.PI + (0.15 + 0.55 * A.spring(t - cd.t - 0.1, 9)) * Math.PI;
            line(ctx, 'paper', [[cx, cy], [cx + Math.cos(na) * (r - 26), cy + Math.sin(na) * (r - 26)]], { t, width: 4, color: C.red, clean: true });
            ctx.beginPath(); ctx.arc(cx, cy, 8, 0, 7); ctx.fillStyle = C.ink; ctx.fill();
          }
          const v = cd.val * eo(t, cd.t + 0.15, 0.7);
          lat(ctx, v.toFixed(cd.val >= 4 ? 2 : 1) + cd.unit, cd.x + 40, y + hgt - 38, { size: 54, w: 300, color: C.ink });
          lat(ctx, cd.code, cd.x + wd - 36, y + hgt - 40, { size: 20, w: 600, color: C.charcoal, align: 'right', track: 1 });
          ctx.restore();
        }
        ctx.restore();
      });
      // forecast: a price line, then a dashed guess with a question mark
      if (t > k3.line - 0.2) {
        const box = [300, 470, 1100, 280]; const vals = fundSeries.map((d) => d.c); const lo = Math.min(...vals) - 2, hi = Math.max(...vals) + 6;
        const pts = linePts(vals, box, lo, hi); const pr = eo(t, k3.line, 1.0);
        line(ctx, 'paper', pts, { t, reveal: pr, width: 3.4 });
        const last = pts[pts.length - 1];
        if (pr > 0.98) {
          const pf = eo(t, k3.fc, 0.6);
          [-60, 0, 70].forEach((dyv, j) => line(ctx, 'paper', [last, [last[0] + 250, last[1] - 70 + dyv]], { t, reveal: pf, width: 2.4, dash: [10, 10], clean: true, alpha: j === 1 ? 1 : 0.5 }));
          ctx.beginPath(); ctx.arc(last[0], last[1], 9, 0, 7); ctx.fillStyle = C.red; ctx.fill();
          const pq = sp(t, k3.fc + 0.25, 16); if (pq > 0) { ctx.save(); ctx.translate(last[0] + 300, last[1] - 70); ctx.scale(pq, pq); txt(ctx, '؟', 0, 30, { size: 96, w: 'L', color: C.red, align: 'center' }); ctx.restore(); }
          tag(ctx, 'التنبّؤ بالأسعار', 1770, 600, { p: eo(t, k3.fc, 0.4) });
        }
      }
      hud(ctx, t, 'paper', '02|التحليل الأساسي');
    },
  });

  // =====================================================================
  // S4 — technical analysts study charts (steel)
  // =====================================================================
  const S4 = { t0: w(11, 0), t1: ph(16) };
  const k4 = { brow: w(11, 0), head: w(12, 0), sub: w(13, 0), candles: w(13, 2), fc: w(14, 0), draw: w(15, 1), ind: w(15, 2), tools: w(15, 3), press: ph(16) - 0.45 };
  sfx(S4.t0 - 0.45, 'scan', 0.24, { d: 0.45 });
  sfx(k4.head, 'swipe', 0.12, { d: 0.4 }); sfx(k4.candles, 'type', 0.18, { d: 1.6, n: 24 });
  sfx(k4.draw, 'pen', 0.18, { d: 0.5 }); sfx(k4.ind, 'swipe', 0.14, { d: 0.5 });
  for (let i = 0; i < 5; i++) sfx(k4.tools + i * 0.09, 'tick', 0.16, { f: 2600 + i * 200, pan: -0.4 });
  sfx(k4.press, 'thump', 0.35);
  const techSeries = series(52, 71, { start: 100, vol: 1.6, drift: (u) => (u < 0.35 ? -0.25 : 0.55) });
  scene({
    name: 'tech-brief', t0: S4.t0, t1: S4.t1, enter: { type: 'wipeRight', dur: 0.45, line: C.white },
    draw(ctx, t) {
      background(ctx, 'steel');
      eyebrow(ctx, 'ثانياً', 1770, 200, eo(t, k4.brow, 0.4), C.white);
      rich(ctx, [{ s: 'المحلّلون' }, { s: 'الفنيون' }], 1770, 318, { size: 96, w: 'L', color: C.white, p: inv(k4.head, we(12, 2), t) });
      wipeText(ctx, 'يدرسون الرسوم البيانية', 1770, 392, { size: 40, w: 'R', color: INK.steel.sub }, inv(k4.sub, we(13, 3), t));
      const press = eio(t, k4.press, 0.4);
      const box = [190, 470, 1300, 380];
      ctx.save(); ctx.translate(0, 660); ctx.scale(1, 1 - press * 0.995); ctx.translate(0, -660);
      const n = Math.floor(inv(k4.candles, k4.candles + 1.7, t) * techSeries.length);
      const rg = F.range(techSeries); const m = candles(ctx, 'steel', techSeries, box, { count: n, grow: true, range: rg });
      // forecast extension
      if (t > k4.fc) {
        const last = techSeries[techSeries.length - 1]; const x0 = m.X(techSeries.length - 1), y0 = m.Y(last.c);
        line(ctx, 'steel', [[x0, y0], [x0 + 200, y0 - 120]], { reveal: eo(t, k4.fc, 0.7), dash: [12, 10], width: 2.5, alpha: 0.85 });
      }
      // drawings: trend line under the lows, with pen handles
      if (t > k4.draw - 0.1) {
        const i0 = 16, i1 = 50; const p0 = [m.X(i0), m.Y(techSeries[i0].l) + 8], p1 = [m.X(i1), m.Y(techSeries[i1].l) + 8];
        const pr = eo(t, k4.draw, 0.5);
        line(ctx, 'steel', [p0, [lerp(p0[0], p1[0] + 120, pr), lerp(p0[1], p1[1] - (p0[1] - p1[1]) * 120 / (p1[0] - p0[0]), pr)]], { width: 3 });
        [p0, p1].forEach((q) => { ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 2; ctx.strokeRect(q[0] - 6, q[1] - 6, 12, 12); ctx.restore(); });
        tag(ctx, 'الرسومات', m.X(i1) + 110, m.Y(techSeries[i1].l) + 70, { p: eo(t, k4.draw + 0.1, 0.3), color: C.white });
      }
      // indicator: moving average
      if (t > k4.ind - 0.1) {
        const ma = sma(techSeries.map((d) => d.c), 8); const pts = ma.map((v, i) => [m.X(i), m.Y(v)]);
        line(ctx, 'steel', pts, { reveal: eo(t, k4.ind, 0.7), width: 2.6, alpha: 0.9, dash: [2, 7] });
        tag(ctx, 'المؤشرات', m.X(30) + 40, m.Y(ma[30]) - 70, { p: eo(t, k4.ind + 0.2, 0.3), color: C.white });
      }
      ctx.restore();
      // tool palette
      const icons = ['h', 'd', 'r', 'f', 'c'];
      icons.forEach((ic, i) => {
        const p = sp(t, k4.tools + i * 0.09, 18) * (1 - press); if (p <= 0) return;
        const x = 1560 + 0, y = 480 + i * 74; ctx.save(); ctx.translate(x + 90, y + 30); ctx.scale(p, p); ctx.translate(-30, -30);
        ctx.strokeStyle = C.white; ctx.lineWidth = 2; roundRect(ctx, 0, 0, 60, 60, 10); ctx.stroke();
        ctx.beginPath();
        if (ic === 'h') { ctx.moveTo(12, 30); ctx.lineTo(48, 30); }
        if (ic === 'd') { ctx.moveTo(12, 46); ctx.lineTo(48, 14); }
        if (ic === 'r') { ctx.rect(14, 18, 32, 24); }
        if (ic === 'f') { [16, 26, 36, 46].forEach((yy) => { ctx.moveTo(12, yy); ctx.lineTo(48, yy); }); }
        if (ic === 'c') { ctx.moveTo(12, 40); ctx.lineTo(48, 18); ctx.moveTo(12, 50); ctx.lineTo(48, 28); }
        ctx.stroke(); ctx.restore();
      });
      if (t > k4.tools) tag(ctx, 'أدوات أخرى', 1770, 440, { p: eo(t, k4.tools, 0.3) * (1 - press), color: C.white });
      if (press > 0) line(ctx, 'steel', [[190, 660], [1490, 660]], { width: 3, alpha: press });
      hud(ctx, t, 'steel', '03|التحليل الفني');
    },
  });

  // =====================================================================
  // S5 — time horizons (paper): fundamental = medium→long, technical = very short→long
  // =====================================================================
  const S5 = { t0: ph(16), t1: w(19, 4) };
  const k5 = { axis: ph(16), fundL: w(16, 2), fundA: w(16, 5), fundB: w(16, 7), techL: w(17, 3), techA: w(17, 8), techB: w(18, 1), split: w(19, 0), diff: w(19, 1), coll: w(19, 4) - 0.45 };
  sfx(k5.axis, 'pen', 0.2, { d: 0.6 }); sfx(k5.axis + 0.35, 'type', 0.14, { d: 0.6, n: 8 });
  sfx(k5.fundA, 'swipe', 0.2, { d: 0.6, pan: -0.3 }); sfx(k5.techA, 'swipe', 0.2, { d: 1.6, pan: -0.3 });
  sfx(k5.techB + 0.2, 'tick', 0.2);
  const TF = ['M1', 'M5', 'M15', 'H1', 'H4', 'D1', 'W1', 'MN'];
  const axX = (i) => 1440 - i * 172; // right = shortest
  F.axX = axX;
  scene({
    name: 'horizon', t0: S5.t0, t1: S5.t1, enter: { type: 'scanDown', dur: 0.45, line: C.ink },
    draw(ctx, t) {
      background(ctx, 'paper');
      eyebrow(ctx, 'المدى الزمني', 1770, 200, eo(t, k5.axis, 0.4));
      const ay = 720; const pa = eo(t, k5.axis, 0.7); const gone = 1 - ei(t, k5.diff, 0.4);
      line(ctx, 'paper', [[1500, ay], [170, ay]], { t, reveal: pa, from: 1 - gone, width: 3 });
      tri(ctx, 170 - 4, ay, 18, 'l', C.ink, pa * gone);
      TF.forEach((tf, i) => {
        const p = eo(t, k5.axis + 0.25 + i * 0.07, 0.3) * gone; if (p <= 0) return; const x = axX(i);
        line(ctx, 'paper', [[x, ay], [x, ay + 16 * p]], { t, width: 2.5 });
        lat(ctx, tf, x, ay + 48, { size: 22, w: 600, color: C.charcoal, align: 'center', alpha: p, track: 1 });
      });
      const bands = [['قصير جداً', 0, 2], ['قصير', 3, 4], ['متوسط', 5, 6], ['طويل', 7, 7.6]];
      bands.forEach(([s, a, b], i) => {
        const p = eo(t, k5.axis + 0.5 + i * 0.1, 0.4) * gone; const x = (axX(a) + axX(b)) / 2;
        txt(ctx, s, x, ay + 104, { size: 30, w: 'R', color: C.ink, align: 'center', alpha: p });
      });
      // rows
      const row = (y, label, ink, a0, a1, from, to, tLabel) => {
        const pl = eo(t, tLabel, 0.4); if (pl <= 0) return;
        txt(ctx, label, 1770, y + 14, { size: 40, w: 'R', color: C.ink, alpha: pl * gone });
        const xr = Math.min(axX(from) + 40, 1490), xl = axX(to) - 40; const pb = eio(t, a0, a1 - a0 + 0.25);
        if (pb <= 0) return; const xcur = lerp(xr, xl, pb);
        const bh = 64;
        if (ink === 'paper') {
          line(ctx, 'paper', rectPts(xcur, y - bh / 2, xr - xcur, bh), { t, width: 2.6 });
          hatch(ctx, 'paper', (c) => { c.beginPath(); c.rect(xcur, y - bh / 2, xr - xcur, bh); }, { box: [xcur, y - bh / 2, xr - xcur, bh], gap: 10, t });
        } else {
          ctx.save(); roundRect(ctx, xcur, y - bh / 2, xr - xcur, bh, 6); ctx.fillStyle = C.slate; ctx.fill(); ctx.restore();
          hatch(ctx, 'steel', (c) => { c.beginPath(); c.rect(xcur, y - bh / 2, xr - xcur, bh); }, { box: [xcur, y - bh / 2, xr - xcur, bh], gap: 10, color: C.white, alpha: 0.35 });
        }
        tri(ctx, xcur + 2, y, 14, 'l', C.red);
      };
      // bars part ("different"), then collapse into the centres of the two gears
      const spl = eio(t, k5.split - 0.2, 0.6); const col = ei(t, k5.coll, 0.45);
      const collapse = (bcx, bcy, gx, gy) => { ctx.translate(lerp(0, gx - bcx, col), lerp(0, gy - bcy, col)); ctx.translate(bcx, bcy); ctx.scale(1 - col * 0.98, 1 - col * 0.98); ctx.translate(-bcx, -bcy); };
      ctx.save(); collapse((axX(7.4) - 40 + Math.min(axX(5) + 40, 1490)) / 2, 470 - 60, 1080, 560); ctx.translate(0, -spl * 60);
      row(470, 'التحليل الأساسي', 'paper', k5.fundA, k5.fundB, 5, 7.4, k5.fundL);
      ctx.restore(); ctx.save(); collapse((axX(7.4) - 40 + 1490) / 2, 570 + 40, 754, 600); ctx.translate(0, spl * 40);
      row(570, 'التحليل الفني', 'steel', k5.techA, k5.techB, -0.4, 7.4, k5.techL);
      ctx.restore();
      hud(ctx, t, 'paper', '04|المدى الزمني');
    },
  });

  // =====================================================================
  // S6 — they work together: two gears mesh (paper + steel)
  // =====================================================================
  const S6 = { t0: w(19, 4), t1: w(21, 0) };
  const k6 = { diff: w(19, 1), gears: w(19, 4), together: w(19, 9), pros: w(20, 2), both: w(20, 8), exit: w(21, 0) - 0.4 };
  sfx(k6.gears, 'whoosh', 0.2, { d: 0.5 });
  for (let s = 0; s < 20; s++) sfx(k6.gears + 0.6 + s * 0.3, 'gear', 0.09 + (s % 2) * 0.03, { pan: (s % 2 ? 0.3 : -0.3) });
  sfx(k6.together, 'thump', 0.3); sfx(k6.pros, 'pen', 0.2, { d: 1.2 }); sfx(k6.both, 'pop', 0.22);
  scene({
    name: 'together', t0: S6.t0, t1: S6.t1, enter: { type: 'cut' },
    draw(ctx, t) {
      background(ctx, 'paper');
      const pg = sp(t, k6.gears, 10) * (1 - ei(t, k6.exit, 0.4));
      // stepping rotation: 45° per beat-eighth, sprung
      const steps = Math.max(0, (t - k6.gears - 0.6) / 0.3); const si = Math.floor(steps); const frac = A.spring((steps - si) * 0.3, 30);
      const rot = (si + frac) * Math.PI / 8;
      const c1 = [1080, 560], r1 = 190, c2 = [1080 - 190 - 142 + 6, 560 + 40], r2 = 142;
      if (pg > 0) {
        ctx.save(); ctx.translate(c1[0], c1[1]); ctx.scale(pg, pg); ctx.translate(-c1[0], -c1[1]);
        const g1 = F.gearPts(c1[0], c1[1], r1, 16, rot, 0.14);
        hatch(ctx, 'paper', (c) => { A.tracePts(c, g1); c.closePath(); }, { box: [c1[0] - r1 - 20, c1[1] - r1 - 20, 2 * r1 + 40, 2 * r1 + 40], gap: 12, t });
        line(ctx, 'paper', g1, { t, width: 3 });
        line(ctx, 'paper', circPts(c1[0], c1[1], r1 * 0.78, 80), { t, width: 1.6, dash: [8, 8], clean: true, alpha: 0.6 });
        ctx.beginPath(); ctx.arc(c1[0], c1[1], 64, 0, 7); ctx.fillStyle = C.off; ctx.fill(); line(ctx, 'paper', circPts(c1[0], c1[1], 64, 50), { t, width: 3 });
        txt(ctx, 'أساسي', c1[0], c1[1] + 12, { size: 34, w: 'R', color: C.ink, align: 'center' });
        ctx.restore();
        ctx.save(); ctx.translate(c2[0], c2[1]); ctx.scale(pg, pg); ctx.translate(-c2[0], -c2[1]);
        const g2 = F.gearPts(c2[0], c2[1], r2, 12, -rot * 16 / 12 + Math.PI / 12, 0.18);
        ctx.beginPath(); A.tracePts(ctx, g2); ctx.closePath(); ctx.fillStyle = C.slate; ctx.fill();
        hatch(ctx, 'steel', (c) => { A.tracePts(c, g2); c.closePath(); }, { box: [c2[0] - r2 - 20, c2[1] - r2 - 20, 2 * r2 + 40, 2 * r2 + 40], gap: 12, color: C.white, alpha: 0.3 });
        line(ctx, 'steel', g2, { width: 3, color: C.white });
        ctx.beginPath(); ctx.arc(c2[0], c2[1], 52, 0, 7); ctx.fillStyle = C.white; ctx.fill();
        txt(ctx, 'فنّي', c2[0], c2[1] + 11, { size: 30, w: 'R', color: C.ink, align: 'center' });
        ctx.restore();
      }
      rich(ctx, [{ s: 'يعملان' }, { s: 'معاً', red: true }], 1770, 270, { size: 96, w: 'L', color: C.ink, p: inv(k6.together - 0.4, k6.together + 0.3, t) * (1 - ei(t, k6.exit, 0.3)) });
      // successful traders use both: a rising curve drawn by the mesh
      const pc = eo(t, k6.pros, 2.2) * (1 - ei(t, k6.exit, 0.3));
      if (pc > 0) {
        const pts = []; for (let i = 0; i <= 60; i++) { const u = i / 60; pts.push([700 - u * 520, 820 - u * 260 - Math.sin(u * 14) * 18 * (1 - u)]); }
        line(ctx, 'paper', pts, { t, reveal: pc, width: 3.4 });
        if (pc > 0.95) { const e = pts[pts.length - 1]; tri(ctx, e[0], e[1] - 18, 22, 'u', C.mint); }
        txt(ctx, 'المتداولون الناجحون', 180, 900, { size: 32, w: 'R', color: C.charcoal, align: 'left', alpha: clamp(pc * 3) });
      }
      const pb = sp(t, k6.both, 18) * (1 - ei(t, k6.exit, 0.3));
      if (pb > 0) { tag(ctx, 'يستفيدون من كلتيهما', 700, 900, { p: pb }); }
      hud(ctx, t, 'paper', '05|معاً');
    },
  });

  // =====================================================================
  // S7 — worked example: economy first, then the chart, then agreement
  // =====================================================================
  const S7 = { t0: w(21, 0), t1: w(25, 0) };
  const k7 = { brow: w(21, 0), arrows: w(21, 4), pair: w(21, 7), step1: w(21, 13), r1: w(21, 14), r2: w(21, 15), r3: w(21, 16), res: w(21, 17),
    step2: w(22, 2), chart: w(22, 4), carry: w(22, 10), ok: w(22, 12), agree: w(23, 1), conf: w(24, 0), confN: w(24, 4) };
  sfx(k7.brow, 'tick', 0.24); sfx(k7.arrows, 'pop', 0.2, { f: 900 }); sfx(k7.pair, 'thump', 0.3);
  sfx(k7.step1, 'swipe', 0.16, { d: 0.4, pan: 0.5 }); [k7.r1, k7.r2, k7.r3].forEach((x, i) => sfx(x, 'tick', 0.18, { f: 2200 + i * 300, pan: 0.5 }));
  sfx(k7.res, 'pop', 0.24, { f: 820, pan: 0.5 });
  sfx(k7.step2 - 0.1, 'scan', 0.2, { d: 0.5, pan: -0.5 }); sfx(k7.chart, 'type', 0.16, { d: 1.2, n: 18, pan: -0.5 });
  sfx(k7.carry, 'whoosh', 0.2, { d: 0.6, pan: -0.3 }); sfx(k7.ok, 'pen', 0.2, { d: 0.35, pan: -0.5 });
  sfx(k7.agree, 'thump', 0.4); sfx(k7.conf, 'rollup', 0.2, { d: 1.6, n: 22 });
  const exSeries = series(34, 91, { start: 100, vol: 1.3, drift: (u) => 0.55 });
  scene({
    name: 'example', t0: S7.t0, t1: S7.t1, enter: { type: 'cut' },
    draw(ctx, t) {
      // geometry over time
      const s1 = eio(t, k7.step1 - 0.3, 0.6);               // pair moves up, step 1 opens on the right
      const s2 = eio(t, k7.step2 - 0.2, 0.55);              // steel half floods the left
      const merge = eio(t, k7.conf - 0.2, 0.6);             // steel recedes, both merge for the confidence meter
      const div = lerp(960, 0, merge);
      background(ctx, 'paper');
      eyebrow(ctx, 'مثال', 1770, 200, eo(t, k7.brow, 0.4) * (1 - s2));
      // the question: which way will the currency go?
      const pq = sp(t, k7.arrows, 14) * (1 - s1);
      if (pq > 0) {
        const bob = Math.sin((t - k7.arrows) * Math.PI / 0.6) * 10;
        tri(ctx, 960, 330 - bob, 70 * pq, 'u', C.mint); tri(ctx, 960, 770 + bob, 70 * pq, 'd', C.red);
      }
      const pp = sp(t, k7.pair, 14);
      if (pp > 0 && s2 < 1) {
        const y = lerp(590, 250, s1), size = lerp(170, 64, s1), x = lerp(960, 1360, s1);
        ctx.save(); ctx.globalAlpha = clamp(pp * 1.4) * (1 - s2); ctx.translate(x, y); ctx.scale(lerp(0.8, 1, pp), lerp(0.8, 1, pp));
        hero(ctx, 'EUR/USD', 0, size * 0.36, { size, color: C.ink }); ctx.restore();
      }
      // step 1 card (fundamental view)
      const c1 = sp(t, k7.step1, 14) * (1 - merge);
      if (c1 > 0) {
        const x = 1010, y = 330, wd = 760, hh = 520; card(ctx, x, y, wd, hh, { p: c1 });
        ctx.save(); ctx.translate(0, (1 - c1) * 60); ctx.globalAlpha = clamp(c1 * 1.6);
        hero(ctx, '1', x + wd - 60, y + 112, { size: 90, color: C.red, align: 'right' });
        txt(ctx, 'الوضع الاقتصادي', x + wd - 130, y + 98, { size: 44, w: 'R', color: C.ink });
        const rows = [[k7.r1, 'النمو', 'GDP', true], [k7.r2, 'الفائدة', 'Rate', true], [k7.r3, 'التضخّم', 'CPI', false]];
        rows.forEach(([tt, s, code, up], i) => {
          const p = eo(t, tt, 0.35); if (p <= 0) return; const yy = y + 190 + i * 76;
          ctx.save(); ctx.globalAlpha *= p;
          txt(ctx, s, x + wd - 60, yy, { size: 36, w: 'R', color: C.ink });
          lat(ctx, code, x + wd - 260, yy, { size: 22, w: 600, color: C.charcoal, align: 'right', track: 1 });
          tri(ctx, x + 90, yy - 12, 26, up ? 'u' : 'd', up ? C.mint : C.red);
          ctx.strokeStyle = hexA(C.ink, 0.1); ctx.beginPath(); ctx.moveTo(x + 50, yy + 26); ctx.lineTo(x + wd - 50, yy + 26); ctx.stroke();
          ctx.restore();
        });
        const pr = sp(t, k7.res, 16);
        if (pr > 0) { tag(ctx, 'تقييم أولي: صعود', x + wd - 60, y + hh - 62, { p: pr, size: 26 }); tri(ctx, x + 90, y + hh - 74, 34 * pr, 'u', C.mint); }
        ctx.restore();
      }
      // step 2: steel half with the chart
      if (s2 > 0) {
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, div * s2, H); ctx.clip();
        background(ctx, 'steel');
        const pp2 = clamp(s2 * 1.5) * (1 - merge);
        hero(ctx, '2', 860, 240, { size: 90, color: C.white, align: 'right', alpha: pp2 });
        txt(ctx, 'الرسم البياني', 760, 226, { size: 44, w: 'R', color: C.white, alpha: pp2 });
        const box = [130, 330, 780, 420]; const n = Math.floor(inv(k7.chart, k7.chart + 1.1, t) * exSeries.length);
        const m = candles(ctx, 'steel', exSeries, box, { count: n, grow: true, alpha: 1 - merge });
        if (t > k7.carry) {
          const p0 = [m.X(2), m.Y(exSeries[2].l) + 10], p1 = [m.X(33), m.Y(exSeries[33].l) + 10]; const pc = eo(t, k7.carry, 0.7);
          line(ctx, 'steel', [p0, [lerp(p0[0], p1[0], pc), lerp(p0[1], p1[1], pc)]], { width: 3, dash: [14, 10], alpha: 1 - merge });
          if (pc > 0.9) tri(ctx, p1[0] + 10, p1[1] - 4, 26, 'u', C.mint, 1 - merge);
        }
        const pk = eo(t, k7.ok, 0.4) * (1 - merge);
        if (pk > 0) {
          line(ctx, 'steel', [[640, 830], [670, 860], [730, 790]], { reveal: pk, width: 6, color: C.white });
          txt(ctx, 'مدعوم بالبيانات', 600, 845, { size: 32, w: 'R', color: C.white, alpha: pk });
        }
        hud(ctx, t, 'steel', '06|مثال', { tr: false, br: false });
        ctx.restore();
        if (div * s2 > 2) line(ctx, 'steel', [[div * s2, 0], [div * s2, H]], { width: 3, color: C.ink, clean: true });
      }
      // agreement: two arrows lock at the divider
      const pa = sp(t, k7.agree, 18) * (1 - merge);
      if (pa > 0) {
        const xl = lerp(520, 960 - 44, pa), xr = lerp(1400, 960 + 44, pa);
        tri(ctx, xr + 26, 140, 56, 'u', C.mint); tri(ctx, xl - 26, 140, 56, 'u', C.mint);
        ctx.save(); ctx.globalAlpha = pa; ctx.fillStyle = C.red; ctx.fillRect(960 - 16, 128, 32, 6); ctx.fillRect(960 - 16, 146, 32, 6); ctx.restore();
      }
      // confidence meter
      if (merge > 0) {
        const pm = merge; const bx = 300, bw = 1320, by = 610, bh = 70;
        rich(ctx, [{ s: 'أكثر' }, { s: 'ثقة', red: true }, { s: 'في تقييمك' }], 1620, 430, { size: 96, w: 'L', color: C.ink, p: inv(k7.conf, k7.confN + 0.3, t) });
        line(ctx, 'paper', rectPts(bx, by, bw, bh), { t, width: 2.6, alpha: pm });
        const fv = eo(t, k7.confN - 0.4, 1.4) * 0.86;
        if (fv > 0) {
          const xs = bx + bw - bw * fv;
          hatch(ctx, 'paper', (c) => { c.beginPath(); c.rect(xs, by, bw * fv, bh); }, { box: [bx, by, bw, bh], gap: 10, t });
          tri(ctx, xs, by - 18, 22, 'd', C.red);
        }
        hero(ctx, Math.round(fv * 100) + '%', bx, by + bh + 120, { size: 110, color: C.ink, align: 'left', alpha: pm });
        txt(ctx, 'الثقة', bx + bw, by + bh + 64, { size: 34, w: 'R', color: C.charcoal, alpha: pm });
      }
      if (s2 < 1 || merge > 0.5) hud(ctx, t, 'paper', '06|مثال', { tl: s2 < 0.5 || merge > 0.5 });
    },
  });

  // =====================================================================
  // S7b — entry & exit points on the trading screen (dark)
  // =====================================================================
  const S7b = { t0: w(25, 0), t1: ph(27) };
  const k7b = { chart: w(25, 0), entry: w(25, 3), exit: w(26, 0) };
  sfx(S7b.t0 - 0.45, 'scan', 0.26, { d: 0.5 });
  sfx(k7b.chart, 'type', 0.14, { d: 1.0, n: 16 }); sfx(k7b.entry - 0.05, 'click', 0.3); sfx(k7b.exit - 0.05, 'click', 0.3, { pan: 0.3 });
  const ddSeries = series(40, 404, { start: 100, vol: 1.4, drift: (u) => (u < 0.7 ? 0.05 : 0.9) });
  scene({
    name: 'entry-exit', t0: S7b.t0, t1: S7b.t1, enter: { type: 'scanDown', dur: 0.45, line: C.white },
    draw(ctx, t) {
      background(ctx, 'dark');
      const box = [190, 230, 1380, 600]; const n = Math.floor(inv(k7b.chart - 0.4, k7b.chart + 0.9, t) * 28);
      const sub = ddSeries.slice(0, 40); const rg = F.range(sub, 0.25);
      const m = candles(ctx, 'dark', sub, box, { count: Math.max(n, n >= 28 ? 28 + Math.floor(inv(k7b.exit, k7b.exit + 1.2, t) * 12) : n), grow: true, range: rg });
      const entryP = sub[27].c; const ye = m.Y(entryP); const pe = eo(t, k7b.entry, 0.4);
      if (pe > 0) {
        line(ctx, 'dark', [[m.X(27), ye], [lerp(m.X(27), 1600, pe), ye]], { width: 2.4, dash: [12, 9], color: C.white, clean: true });
        tri(ctx, m.X(27) - 22, ye, 22 * pe, 'r', C.white);
        tag(ctx, 'الدخول', 1730, ye, { p: pe, color: C.white });
      }
      const px = eo(t, k7b.exit, 0.4);
      if (px > 0) {
        const yx = m.Y(entryP + (rg[1] - rg[0]) * 0.32);
        line(ctx, 'dark', [[m.X(27), yx], [lerp(m.X(27), 1600, px), yx]], { width: 2.6, color: C.mint, dash: [12, 9] });
        tag(ctx, 'الخروج', 1730, yx, { p: px, color: C.mint });
        ctx.save(); ctx.globalAlpha = 0.12 * px; ctx.fillStyle = C.mint; ctx.fillRect(m.X(27), yx, 1600 - m.X(27), ye - yx); ctx.restore();
      }
      hud(ctx, t, 'dark', '06|مثال');
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
