// Lesson 05 — Charts. Part 1: title · what charts are · watchlist · current vs historical · three options · Japanese candles (wax candle → candlestick) · how / why · anatomy (O H L C).
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT;
  const { W, H, C, clamp, lerp, inv, eo, ei, eio, hexA, txt, lat, measure, line } = A;
  const { w, we, wl, ph, sfx, ksfx, scene } = F;
  const SIL = C.silver, SUB = hexA(C.white, 0.72);

  F.chapters.push(
    { t: F.OFF, label: 'الرسوم البيانية' }, { t: ph(4), label: 'الشموع اليابانية' }, { t: ph(9), label: 'تشريح الشمعة' }, { t: ph(16), label: 'صاعدة وهابطة' },
    { t: ph(23), label: 'الشريطي والخطي' }, { t: ph(29), label: 'أيّها أفضل؟' }, { t: ph(37), label: 'الخلاصة' },
  );
  // groovy minor: 112 BPM, E minor (Em9 · Cmaj7 · G6 · D/F#), glassy FM bells, four-on-the-floor
  F.STYLE = { bpm: 112, chords: [[40, [62, 64, 67, 71, 74]], [36, [60, 64, 67, 71, 74]], [43, [59, 62, 64, 67, 71]], [42, [57, 62, 66, 69, 74]]], kit: 'four', pluck: 'glass', swing: 0, bass: [0, 0, 1, 0, 1, 0, 0, 1], arp: [0, 1, 2, 4, 3, 2, 1, 4], padcut: 1500 };
  F.MUSIC = [
    { t: 0, lvl: 1 }, { t: F.OFF, lvl: 2 }, { t: ph(2) - 0.3, lvl: 3 }, { t: ph(4) - 0.3, lvl: 2 }, { t: ph(5) - 0.3, lvl: 3 }, { t: ph(7) - 0.2, lvl: 2 },
    { t: ph(9) - 0.3, lvl: 3 }, { t: ph(16) - 0.3, lvl: 4 }, { t: ph(20) - 0.3, lvl: 3 }, { t: ph(23) - 0.3, lvl: 2 }, { t: ph(26) - 0.3, lvl: 3 },
    { t: ph(29) - 0.3, lvl: 2 }, { t: ph(33) - 0.3, lvl: 3 }, { t: ph(37) - 0.3, lvl: 4 }, { t: ph(41) - 0.3, lvl: 2 }, { t: ph(44) - 0.4, lvl: 3 }, { t: F.CLOSE, lvl: 1 },
  ];

  // ---------------------------------------------------------------- lesson helpers
  // one candlestick: x centre, open/close/high/low in px (y), body width, colour (auto by direction)
  function stick(ctx, x, yo, yc, yh, yl, bw, o = {}) {
    const up = yc <= yo; const col = o.color || (up ? C.mint : C.red); const a = o.alpha == null ? 1 : o.alpha;
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = o.wickColor || col; ctx.fillStyle = col; ctx.lineWidth = o.wick || Math.max(2, bw * 0.12); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, yh); ctx.lineTo(x, Math.min(yo, yc)); ctx.moveTo(x, Math.max(yo, yc)); ctx.lineTo(x, yl); ctx.stroke();
    if (o.hollow) { ctx.lineWidth = o.wick || 3; ctx.strokeRect(x - bw / 2, Math.min(yo, yc), bw, Math.max(2, Math.abs(yc - yo))); } else ctx.fillRect(x - bw / 2, Math.min(yo, yc), bw, Math.max(2, Math.abs(yc - yo)));
    ctx.restore();
  }
  // OHLC bar
  function obar(ctx, x, yo, yc, yh, yl, tw, col, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, yh); ctx.lineTo(x, yl); ctx.moveTo(x - tw, yo); ctx.lineTo(x, yo); ctx.moveTo(x, yc); ctx.lineTo(x + tw, yc); ctx.stroke(); ctx.restore(); }
  // chart-type icons for option cards
  function icon(ctx, kind, cx, cy, s, col) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (kind === 'line') { ctx.beginPath(); [[-60, 30], [-30, 0], [-5, 14], [25, -26], [60, -14]].forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
    else if (kind === 'bar') { [[-40, 20, -10, 40, -20], [0, -5, -25, 15, -35], [40, -20, 5, -2, -38]].forEach(([x, o, c, l, h]) => { ctx.beginPath(); ctx.moveTo(x, h); ctx.lineTo(x, l); ctx.moveTo(x - 12, o); ctx.lineTo(x, o); ctx.moveTo(x, c); ctx.lineTo(x + 12, c); ctx.stroke(); }); }
    else { [[-40, 24, 0, 40, -10, C.mint], [0, 6, -26, 18, -38, C.mint], [40, -18, 4, 16, -30, C.red]].forEach(([x, o, c, l, h, cc]) => { ctx.strokeStyle = cc; ctx.fillStyle = cc; ctx.beginPath(); ctx.moveTo(x, h); ctx.lineTo(x, l); ctx.stroke(); ctx.fillRect(x - 10, Math.min(o, c), 20, Math.abs(c - o)); }); }
    ctx.restore();
  }
  F.L5 = { stick, obar, icon };

  // ================================================================ S1 — title card (dark): mini candles orbit «05»
  const S1 = { t0: 2.05, t1: 5.66 };
  sfx(2.1, 'whoosh', 0.16, { d: 0.6 }); for (let i = 0; i < 12; i += 3) sfx(2.2 + i * 0.06, 'pop', 0.08, { f: 700 + i * 40, pan: i % 2 ? 0.4 : -0.4 }); sfx(2.62, 'slam', 0.22); sfx(3.15, 'pop', 0.18, { f: 760 });
  scene({ name: 'title', t0: S1.t0, t1: S1.t1, ink: 'dark', enter: { type: 'bars', dur: 0.47 }, draw(ctx, t) {
    FX.bg(ctx, 'dark'); const cx = 960, cy = 520;
    for (let i = 0; i < 12; i++) {
      const r = A.rng(70 + i * 5); r(); const R = 230 + 150 * r(), sp = (0.3 + 0.4 * r()) * (i % 2 ? 1 : -1), a0 = r() * 6.283; const app = FX.springU(t - (2.2 + i * 0.06), 13, 0.5); if (app <= 0) continue;
      const a = a0 + t * sp; const x = cx + Math.cos(a) * R * Math.min(1, app), y = cy + Math.sin(a) * R * 0.45 * Math.min(1, app); const d = 0.55 + 0.45 * (Math.sin(a) + 1) / 2; const up = i % 3 !== 1;
      stick(ctx, x, y + (up ? 16 : -16) * d, y + (up ? -16 : 16) * d, y - 30 * d, y + 30 * d, 14 * d, { alpha: clamp((t - 2.2 - i * 0.06) * 5) * (0.35 + 0.65 * d) });
    }
    const hp = FX.springU(t - 2.62, 14, 0.5); if (hp > 0) { ctx.save(); ctx.translate(cx, cy + 60); const s = lerp(1.9, 1, Math.min(1, hp)); ctx.scale(s, s); lat(ctx, '05', 0, 0, { size: 240, w: 300, color: C.white, align: 'center', track: -6, alpha: clamp((t - 2.62) * 6) }); ctx.restore(); }
    FX.kword(ctx, 'الدرس الخامس', 960 + FX.kwidth('الدرس الخامس', 60, 'S') / 2, cy + 150, { size: 60, w: 'S', color: SUB, lt: t - 3.1, mode: 'rise' });
    K.dot(ctx, cx + 150, cy + 38, 20, t - 3.3, { h0: 300 });
  } });

  // ================================================================ S2 — «الرسوم البيانية» · watch currency pair prices (light)
  const S2 = { t0: S1.t1, t1: 14.32 };
  const WL = [['EUR/USD', 1.0842, 1], ['GBP/USD', 1.2650, -1], ['USD/JPY', 151.32, 1], ['AUD/USD', 0.6612, -1]];
  sfx(S2.t0 - 0.42, 'ripple', 0.2); ksfx(w(0, 6), 'drop', 0.24); sfx(w(0, 7) + 0.3, 'scribble', 0.1, { d: 0.7 });
  WL.forEach((r, i) => sfx(w(1, 4) + i * 0.15, 'tick', 0.1, { f: 2600 + i * 200 }));
  scene({ name: 'charts', t0: S2.t0, t1: S2.t1, ink: 'light', enter: { type: 'ripple', dur: 0.42, x: 960, y: 520 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    K.cap(ctx, wl(0, 0, 5), 280, t, { size: 62, out: K.outAt(t, w(1, 0) - 0.25) });
    const mv = eio(t, w(1, 0) - 0.2, 0.6); const tw = K.wordsWidth(wl(0, 6, 7), { size: 210 });
    ctx.save(); ctx.translate(960, lerp(560, 330, mv)); ctx.scale(lerp(1, 0.55, mv), lerp(1, 0.55, mv)); ctx.translate(-960, 0);
    K.words(ctx, wl(0, 6, 7), 960 + tw / 2, 0, t, { size: 210, color: C.ink, stagger: 0.045 }); ctx.restore();
    // a chart line sketches itself under the title
    const lp = inv(w(0, 7), w(0, 7) + 1.0, t) * (1 - mv);
    if (lp > 0) { const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; pts.push([lerp(560, 1360, u), 720 - Math.sin(u * 7) * 26 - u * 60 + Math.sin(u * 23) * 8]); } line(ctx, 'paper', pts, { reveal: lp, width: 4, color: C.slate, t, amp: 0.6 }); }
    // watchlist
    if (mv > 0) {
      K.cap(ctx, wl(1), 240, t, { size: 52 });
      WL.forEach(([pair, p0, dir], i) => {
        const p = eo(t, w(1, 4) + i * 0.15, 0.4); if (p <= 0) return; const y = 470 + i * 96; const tq = Math.floor(t * 10) / 10; const v = p0 * (1 + dir * 0.0006 * Math.sin(tq * 3 + i) + 0.0002 * Math.sin(tq * 11 + i * 2));
        ctx.save(); ctx.globalAlpha = p; ctx.translate(0, (1 - p) * 30); ctx.fillStyle = '#FFFFFF'; A.roundRect(ctx, 560, y - 40, 800, 80, 14); ctx.fill(); ctx.strokeStyle = hexA(C.slate, 0.3); ctx.lineWidth = 1.5; ctx.stroke();
        lat(ctx, pair, 1320, y + 11, { size: 30, w: 700, color: C.ink, align: 'right' }); lat(ctx, v.toFixed(pair.includes('JPY') ? 2 : 4), 600, y + 12, { size: 34, w: 600, color: C.ink });
        const up = Math.sin(tq * 3 + i) * dir > 0; ctx.fillStyle = up ? C.mint : C.red; ctx.beginPath(); if (up) { ctx.moveTo(870, y - 14); ctx.lineTo(856, y + 10); ctx.lineTo(884, y + 10); } else { ctx.moveTo(870, y + 14); ctx.lineTo(856, y - 10); ctx.lineTo(884, y - 10); } ctx.closePath(); ctx.fill();
        ctx.restore();
      });
    }
  } });

  // ================================================================ S3 — a chart shows current and historical prices · several options (dark)
  const S3 = { t0: S2.t1, t1: 25.3 };
  const P3 = K.path([[0, 50], [0.2, 58], [0.35, 52], [0.55, 66], [0.7, 60], [0.9, 72], [1, 70]], 120, 41, 1.6);
  const OPTS = [['line', 'خطي'], ['bar', 'شريطي'], ['candle', 'شموع']];
  sfx(S3.t0 - 0.42, 'whip', 0.2); F.SHUTTER.push([S3.t0 - 0.42, S3.t0, 1.6 / 60]); sfx(w(2, 7), 'scribble', 0.1, { d: 1.6 });
  sfx(w(2, 12), 'pop', 0.14, { f: 900, pan: 0.5 }); sfx(w(2, 13), 'pop', 0.14, { f: 700, pan: -0.5 }); OPTS.forEach((o, i) => sfx(w(3, 2) + i * 0.2, 'pop', 0.14, { f: 650 + i * 90 }));
  scene({ name: 'history', t0: S3.t0, t1: S3.t1, ink: 'dark', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    K.cap(ctx, wl(2, 0, 6), 230, t, { color: SUB, size: 52, out: K.outAt(t, w(2, 7) - 0.25) });
    K.cap(ctx, wl(2, 7, 13, { map: { 12: { color: C.white, w: 'B' }, 13: { color: C.white, w: 'B' } } }), 230, t, { color: SUB, size: 52, out: K.outAt(t, w(3, 0) - 0.25) });
    K.cap(ctx, wl(3), 230, t, { color: SUB, size: 56 });
    const op = eio(t, w(3, 0) - 0.2, 0.5); const box = [300, 330, 1320, 420]; const fr = K.frame(box, 44, 78, P3.length);
    if (op < 1) {
      ctx.save(); ctx.globalAlpha = 1 - op;
      const lp = inv(w(2, 7), w(2, 11) + 0.4, t); if (lp > 0) { K.axes(ctx, box, eo(t, w(2, 7) - 0.3, 0.4), { t, color: hexA(C.white, 0.5) }); const hd = K.priceLine(ctx, fr, P3, lp, { color: C.white, width: 3.4, head: 10, headColor: C.red });
        // historical (shaded) vs current (live dot)
        const hp = eo(t, w(2, 13), 0.5); if (hp > 0) { ctx.save(); ctx.fillStyle = hexA(C.white, 0.06 * hp); ctx.fillRect(box[0], box[1], (hd[0] - box[0]) * 0.92, box[3]); ctx.restore(); txt(ctx, 'الأسعار التاريخية', box[0] + (hd[0] - box[0]) * 0.46, box[1] + 40, { size: 30, w: 'S', color: SIL, align: 'center', alpha: hp }); }
        const cp = eo(t, w(2, 12), 0.4); if (cp > 0) { const pr = (Math.sin(t * 6) + 1) / 2; ctx.save(); ctx.strokeStyle = hexA(C.red, 0.7 * cp * (1 - pr)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(hd[0], hd[1], 14 + pr * 22, 0, 6.283); ctx.stroke(); ctx.restore(); K.chip(ctx, 'الحالية', hd[0] + 20, hd[1] - 60, { p: cp, size: 24, fill: C.red, stroke: C.red, color: C.white, w: 'S', align: 'right' }); } }
      ctx.restore();
    }
    // three options
    OPTS.forEach(([k, lab], i) => {
      const p = FX.springU(t - (w(3, 2) + i * 0.2), 14, 0.5); if (p <= 0) return; const x = 960 + (1 - i) * 380, y = 600;
      ctx.save(); ctx.translate(x, y + (1 - Math.min(1, p)) * 200); ctx.globalAlpha = clamp((t - w(3, 2) - i * 0.2) * 5);
      ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.strokeStyle = hexA(C.white, 0.5); ctx.lineWidth = 1.6; A.roundRect(ctx, -160, -150, 320, 300, 20); ctx.fill(); ctx.stroke();
      icon(ctx, k, 0, -30, 1.4, C.white); txt(ctx, lab, 0, 110, { size: 38, w: 'S', color: C.white, align: 'center' }); ctx.restore();
    });
  } });

  // ================================================================ S4 — the most common: Japanese candles · a wax candle becomes a candlestick (light)
  const S4 = { t0: S3.t1, t1: 37.42 };
  const PICK = w(4, 2) + 0.2, MORPH = w(6, 7) - 0.15;
  sfx(S4.t0 - 0.45, 'shutter', 0.18); sfx(PICK, 'click', 0.18); sfx(PICK + 0.1, 'pop', 0.16, { f: 820 }); ksfx(w(5, 1), 'drop', 0.24);
  sfx(w(6, 0), 'whoosh', 0.12, { d: 0.5 }); sfx(MORPH, 'stretch', 0.22); sfx(MORPH + 0.6, 'chime', 0.14);
  scene({ name: 'candles', t0: S4.t0, t1: S4.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    K.cap(ctx, wl(4, 0, 4), 230, t, { size: 54, out: K.outAt(t, w(4, 5) - 0.2) });
    K.cap(ctx, wl(4, 5, 8), 230, t, { size: 54, out: K.outAt(t, w(5, 0) - 0.2) });
    // option cards again: candles gets picked (popular)
    const cg = 1 - eio(t, w(5, 0) - 0.2, 0.5);
    if (cg > 0) {
      [['line', 'خطي'], ['bar', 'شريطي'], ['candle', 'شموع']].forEach(([k, lab], i) => {
        const x = 960 + (1 - i) * 380, y = 600; const sel = i === 2 && t > PICK; const sp = sel ? 1 + 0.08 * FX.springU(t - PICK, 14, 0.4) : 1;
        ctx.save(); ctx.globalAlpha = cg * eo(t, S4.t0 - 0.2, 0.3); ctx.translate(x, y); ctx.scale(sp, sp); ctx.fillStyle = sel ? '#FFFFFF' : 'rgba(255,255,255,0.6)'; ctx.strokeStyle = sel ? C.red : hexA(C.slate, 0.5); ctx.lineWidth = sel ? 3 : 1.6; A.roundRect(ctx, -160, -150, 320, 300, 20); ctx.fill(); ctx.stroke();
        icon(ctx, k, 0, -30, 1.4, C.ink); txt(ctx, lab, 0, 110, { size: 38, w: 'S', color: C.ink, align: 'center' }); ctx.restore();
      });
      const [cx, cy] = K.cursorAt(t, [[S4.t0, 1500, 980], [PICK - 0.05, 960 - 380 + 40, 640]]); ctx.save(); ctx.globalAlpha = cg; FX.cursor(ctx, cx, cy, K.press(t, [PICK])); ctx.restore();
    }
    // title
    K.head(ctx, wl(5, 1, 2), 300, t, { size: 140, color: C.ink, mode: 'drop' });
    // wax candle → candlestick
    const ap = eo(t, w(6, 0) - 0.2, 0.5) * (1 - cg * 0.9);
    if (ap > 0) {
      const m = eio(t, MORPH, 0.7); const x = 960, top = 470, bot = 840;
      ctx.save(); ctx.globalAlpha = ap;
      // wax body ↔ candle body
      const bw = lerp(130, 120, m), y0 = lerp(top, 540, m), y1 = lerp(bot, 760, m);
      ctx.fillStyle = A.mixHex('#F3EFE6', C.mint, m); ctx.strokeStyle = A.mixHex(C.ink, C.mint, m); ctx.lineWidth = 3; A.roundRect(ctx, x - bw / 2, y0, bw, y1 - y0, lerp(14, 2, m)); ctx.fill(); if (m < 1) ctx.stroke();
      // wick: string + flame (fades), then candlestick wicks
      ctx.strokeStyle = C.ink; ctx.lineWidth = lerp(4, 6, m); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, lerp(top - 40, 470, m)); ctx.stroke();
      if (m > 0) { ctx.strokeStyle = C.mint; ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y1 + 60 * m); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, 470); ctx.stroke(); }
      const fl = 1 - m; if (fl > 0) { const fk = Math.sin(t * 19) * 3 + Math.sin(t * 31) * 2; ctx.save(); ctx.globalAlpha *= fl; ctx.translate(x, top - 52); ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(0, -60 + fk); ctx.quadraticCurveTo(26, -10, 0, 18); ctx.quadraticCurveTo(-26, -10, 0, -60 + fk); ctx.fill(); ctx.fillStyle = '#FFD8A0'; ctx.beginPath(); ctx.moveTo(0, -24 + fk * 0.5); ctx.quadraticCurveTo(11, 0, 0, 12); ctx.quadraticCurveTo(-11, 0, 0, -24 + fk * 0.5); ctx.fill(); ctx.restore(); }
      ctx.restore();
      FX.note(ctx, 'شمعة', x + 260, 600, { p: inv(w(6, 1), w(6, 1) + 0.5, t) * (1 - m), size: 34, color: C.slate, w: 'S', t, align: 'right', to: [x + 90, 620], from: [x + 150, 610], bend: 0.2 });
      FX.note(ctx, 'شمعة يابانية', x + 300, 650, { p: inv(MORPH + 0.5, MORPH + 1.1, t), size: 34, color: C.ink, w: 'S', t, align: 'right', to: [x + 80, 650], from: [x + 100, 664], bend: 0.2 });
    }
    K.cap(ctx, wl(6), 950, t, { size: 40, color: C.slate, out: K.outAt(t, S4.t1 - 0.2) });
  } });

  // ================================================================ S5 — «كيف تعمل؟» · «لماذا؟» (dark kinetic questions)
  const S5 = { t0: S4.t1, t1: 42.0 };
  sfx(S5.t0 - 0.42, 'ripple', 0.2); ksfx(w(7, 1), 'spin', 0.26); ksfx(w(8, 0), 'stretch', 0.24); ksfx(we(8, 4) - 0.2, 'bounce', 0.2);
  scene({ name: 'howwhy', t0: S5.t0, t1: S5.t1, ink: 'dark', enter: { type: 'ripple', dur: 0.42, x: 960, y: 640 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    FX.kword(ctx, 'لكن', 960 + FX.kwidth('لكن', 64, 'R') / 2, 280, { size: 64, w: 'R', color: SUB, lt: t - w(7, 0), mode: 'rise', out: K.outAt(t, w(8, 0) - 0.25, 0.3) });
    const o1 = K.outAt(t, w(8, 0) - 0.15, 0.35);
    K.head(ctx, wl(7, 1, 2), 560, t, { size: 220, color: C.white, mode: 'spin', out: o1 });
    const q2 = 'ولماذا'; const qw = FX.kwidth(q2, 240), mw = FX.kwidth('؟', 240);
    FX.kword(ctx, q2, 960 + (qw + mw + 20) / 2, 600, { size: 240, color: C.white, lt: t - w(8, 0), mode: 'stretch' });
    FX.kword(ctx, '؟', 960 + (qw + mw + 20) / 2 - qw - 20, 600, { size: 240, color: C.red, lt: t - (we(8, 4) - 0.2), mode: 'bounce' });
    K.cap(ctx, wl(8, 1, 4), 830, t, { color: SUB, size: 58 });
  } });

  // ================================================================ S6 — anatomy: pick a timeframe → one candle shows O · H · L · C (light)
  const S6 = { t0: S5.t1, t1: 54.48 };
  const TF = ['M1', 'M5', 'M15', 'H1', 'H4', 'D1']; const TFP = w(9, 2);
  const PTS = [{ k: 12, ar: 'سعر الافتتاح', la: 'Open', y: 700, side: 1 }, { k: 13, ar: 'أعلى سعر', la: 'High', y: 330, side: -1 }, { k: 14, ar: 'أدنى سعر', la: 'Low', y: 860, side: -1 }, { k: 15, ar: 'سعر الإغلاق', la: 'Close', y: 470, side: 1 }];
  sfx(S6.t0 - 0.45, 'shutter', 0.18); TF.forEach((f, i) => sfx(w(9, 1) + i * 0.06, 'tick', 0.05, { f: 2200 + i * 150 })); sfx(TFP, 'click', 0.18);
  sfx(w(10, 1), 'stretch', 0.16); PTS.forEach((p) => { sfx(w(p.k, 0) - 0.05, 'pop', 0.16, { f: 900 - p.k * 20, pan: p.side * 0.4 }); sfx(w(p.k, 0), 'scribble', 0.06, { d: 0.3 }); });
  scene({ name: 'anatomy', t0: S6.t0, t1: S6.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    // timeframe selector
    const sp = eo(t, w(9, 1) - 0.2, 0.4);
    if (sp > 0) {
      const cw = 110, g = 14, tot = TF.length * cw + (TF.length - 1) * g; const mv = eio(t, w(10, 0) - 0.2, 0.5);
      ctx.save(); ctx.translate(0, lerp(0, -110, mv)); ctx.globalAlpha = sp;
      TF.forEach((f, i) => { const x = 960 + tot / 2 - (i + 1) * cw - i * g; const sel = i === 3 && t > TFP; ctx.fillStyle = sel ? C.ink : '#FFFFFF'; ctx.strokeStyle = sel ? C.ink : hexA(C.slate, 0.5); ctx.lineWidth = 1.6; A.roundRect(ctx, x, 330, cw, 60, 30); ctx.fill(); ctx.stroke(); lat(ctx, f, x + cw / 2, 370, { size: 24, w: 700, color: sel ? C.white : C.charcoal, align: 'center' }); });
      ctx.restore();
      K.cap(ctx, wl(9), 250, t, { size: 54, out: K.outAt(t, w(10, 0) - 0.25) });
    }
    K.cap(ctx, wl(10).concat(wl(11)), 230, t, { size: 54 });
    // the candle
    const cp = FX.springU(t - (w(10, 1) - 0.1), 13, 0.5);
    if (cp > 0) {
      const s = Math.min(1.06, cp); const x = 960, yo = 700, yc = 470, yh = 330, yl = 860;
      ctx.save(); ctx.translate(x, 600); ctx.scale(s, s); ctx.translate(-x, -600); stick(ctx, x, yo, yc, yh, yl, 150, { wick: 8 }); ctx.restore();
      // price axis
      ctx.save(); ctx.globalAlpha = eo(t, w(10, 3), 0.4); ctx.strokeStyle = hexA(C.ink, 0.4); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(1640, 310); ctx.lineTo(1640, 880); ctx.stroke(); ctx.restore();
      PTS.forEach((p) => {
        const q = eo(t, w(p.k, 0) - 0.1, 0.4); if (q <= 0) return; const lx = p.side > 0 ? x + 90 : x - 30; const ex = p.side > 0 ? x + 300 : x - 300;
        ctx.save(); ctx.globalAlpha = q; ctx.setLineDash([6, 6]); ctx.strokeStyle = C.slate; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.side > 0 ? x + 76 : x - 8, p.y); ctx.lineTo(lerp(lx, ex, q), p.y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(p.side > 0 ? x + 76 : x, p.y, 8, 0, 6.283); ctx.fill(); ctx.restore();
        if (p.side > 0) { txt(ctx, p.ar, ex + 250, p.y + 12, { size: 36, w: 'B', color: C.ink, alpha: q }); lat(ctx, p.la, ex + 260, p.y + 12, { size: 24, w: 600, color: C.slate, align: 'left', alpha: q }); }
        else { txt(ctx, p.ar, ex - 10, p.y + 12, { size: 36, w: 'B', color: C.ink, alpha: q }); lat(ctx, p.la, ex - 10 - measure(ctx, p.ar, 36, 'B') - 14, p.y + 12, { size: 24, w: 600, color: C.slate, align: 'right', alpha: q }); }
        ctx.save(); ctx.globalAlpha = q; ctx.fillStyle = C.ink; ctx.fillRect(1632, p.y - 1, 16, 2); ctx.restore();
      });
    }
  } });
})(typeof window !== 'undefined' ? window : globalThis);
