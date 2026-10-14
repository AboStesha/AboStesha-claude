// Act III — build your strategy: time (24 h dial) · risk (slider, night worry) · markets (instruments) · news & details · analysis (split) · the book · outro · close.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT;
  const { W, H, C, clamp, lerp, inv, eo, ei, eio, hexA, txt, lat, measure, line, logo, logoWidth, xmark } = A;
  const { w, we, wl, sfx, ksfx, scene, marks } = F;
  const SIL = C.silver, SUB = hexA(C.white, 0.72);
  const cap = (ctx, words, y, t, o = {}) => {
    const sz = o.size || 56, wt = o.w || 'R'; const cw = K.wordsWidth(words, { size: sz, w: wt });
    return K.words(ctx, words, o.x == null ? 960 + cw / 2 : o.x, y, t, { size: sz, w: wt, color: o.color || C.slate, mode: o.mode || 'rise', stagger: o.stagger == null ? 0.02 : o.stagger, out: o.out });
  };
  const outAt = (t, t0, d = 0.45) => clamp((t - t0) / d);
  // superposed springs: value starts at v0 and moves to each keyframe [t, v] with an underdamped spring
  const springs = (t, v0, keys, wv = 13, z = 0.5) => { let v = v0, prev = v0; for (const [tk, vk] of keys) { v += (vk - prev) * FX.springU(t - tk, wv, z); prev = vk; } return v; };
  const metal = (ctx, y0, y1) => { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#C4C8CC'); return g; };

  // ================================================================ B1 — «بناء استراتيجية تداولك» · the roadmap blocks (light)
  const B1 = { t0: F.S.ACT2_END, t1: 189.42 };
  const BLOCKS = ['الأهداف', 'الدخول', 'الخروج', 'الوقت', 'المخاطرة', 'الأسواق', 'التحليل'];
  sfx(B1.t0 - 0.45, 'shutter', 0.2); ksfx(w(78, 0), 'drop', 0.2);
  BLOCKS.forEach((b, i) => sfx(w(79, 0) + i * 0.1, 'pop', 0.09, { f: 600 + i * 60, pan: 0.6 - i * 0.2 }));
  [0, 1, 2].forEach((i) => sfx(w(79, 3) + i * 0.15, 'tick', 0.1, { f: 3000 + i * 250 }));
  sfx(w(80, 1) + 0.05, 'slam', 0.2);
  scene({ name: 'build', t0: B1.t0, t1: B1.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    const tw = K.wordsWidth(wl(78), { size: 130 });
    K.words(ctx, wl(78, 0, 2, { map: { 2: { color: C.red } } }), 960 + tw / 2, 340, t, { size: 130, color: C.ink, stagger: 0.04, out: outAt(t, w(80, 0) - 0.2) });
    cap(ctx, wl(79, 0, 3, { map: { 3: { color: C.ink, w: 'B' } } }), 220, t, { out: outAt(t, w(80, 0) - 0.2) });
    // roadmap row: first three done (mint check), «الوقت» next
    const bw = 210, bh = 92, g = 18, rowW = 7 * bw + 6 * g;
    BLOCKS.forEach((b, i) => {
      const x = 960 + rowW / 2 - i * (bw + g) - bw, y = 560; const p = FX.springU(t - (w(79, 0) + i * 0.1), 15, 0.5); if (p <= 0) return;
      const done = i < 3 ? inv(w(79, 3) + i * 0.15, w(79, 3) + i * 0.15 + 0.25, t) : 0; const next = i === 3 ? eo(t, w(80, 1), 0.3) : 0;
      ctx.save(); ctx.translate(x + bw / 2, y + bh / 2 - (1 - p) * 120); ctx.globalAlpha = clamp((t - w(79, 0) - i * 0.1) * 6);
      ctx.fillStyle = i < 3 ? hexA(C.mint, 0.18 * done) : 'rgba(255,255,255,0.6)'; ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
      ctx.strokeStyle = next > 0 ? C.red : hexA(C.slate, 0.6); ctx.lineWidth = next > 0 ? 3 : 1.6; ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);
      txt(ctx, b, bw / 2 - 18, 12, { size: 30, w: 'S', color: C.ink }); lat(ctx, String(i + 1).padStart(2, '0'), -bw / 2 + 14, 8, { size: 18, w: 600, color: next > 0 ? C.red : C.concrete, align: 'left' });
      ctx.restore();
      if (i < 3) FX.check(ctx, x + 28, y - 8, 26, done, C.ink, t);
    });
    // rule one: hero «01»
    const hp = FX.springU(t - (w(80, 1) + 0.05), 14, 0.5);
    if (hp > 0) { ctx.save(); ctx.globalAlpha = clamp((t - w(80, 1)) * 6); ctx.translate(960, 380); ctx.scale(lerp(1.8, 1, Math.min(1, hp)), lerp(1.8, 1, Math.min(1, hp))); lat(ctx, '01', 0, 0, { size: 230, w: 300, color: C.ink, align: 'center', track: -6 }); ctx.restore(); }
    cap(ctx, wl(80, 1, 2), 470, t, { color: C.ink, size: 54, w: 'S' });
    marks(ctx, 'light');
  } });

  // ================================================================ B2 — be realistic about your time: the 24 h dial (dark, reference ring loader)
  const B2 = { t0: B1.t1, t1: 206.42 };
  const RC = { x: 960, y: 610, R: 240 }; const ang = (h) => -Math.PI / 2 + (h / 24) * Math.PI * 2;
  const T30 = w(82, 3), T8 = w(84, 1), TX8 = w(85, 1), TOK = w(86, 2);
  sfx(B2.t0 - 0.42, 'ripple', 0.2); sfx(T30, 'charge', 0.12, { d: 0.4 }); sfx(T30 + 0.35, 'pop', 0.18, { f: 900 });
  sfx(T8 - 0.1, 'riser', 0.12, { d: 0.9 }); sfx(T8 + 0.85, 'impact', 0.18); sfx(TX8, 'buzz', 0.14); sfx(TOK, 'chime', 0.14);
  scene({ name: 'time', t0: B2.t0, t1: B2.t1, ink: 'dark', enter: { type: 'ripple', dur: 0.42, x: 960, y: 380 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    cap(ctx, wl(81, 0, 5, { map: { 3: { color: C.white, w: 'B' }, 5: { color: C.white, w: 'B' } } }), 225, t, { color: SUB, out: outAt(t, w(82, 0) - 0.3) });
    cap(ctx, wl(82, 0, 10, { map: { 3: { color: C.white, w: 'B' }, 4: { color: C.white, w: 'B' } } }), 225, t, { color: SUB, size: 50, out: outAt(t, w(83, 0) - 0.3) });
    cap(ctx, wl(83).concat(wl(84, 0, 2, { map: { 1: { color: C.red, w: 'B' }, 2: { color: C.red, w: 'B' } } })), 225, t, { color: SUB, out: outAt(t, w(86, 0) - 0.3) });
    cap(ctx, wl(85), 300, t, { color: SUB, size: 44, out: outAt(t, w(86, 0) - 0.3) });
    cap(ctx, wl(86), 225, t, { color: SUB });
    const { x, y, R } = RC; const ap = eo(t, B2.t0 - 0.2, 0.7);
    ctx.save(); ctx.globalAlpha = ap;
    for (let i = 0; i < 96; i++) { const a = ang(i / 4); const maj = i % 4 === 0, big = i % 24 === 0; const r0 = R * (big ? 0.8 : maj ? 0.84 : 0.87), r1 = R * 0.9; ctx.strokeStyle = hexA(C.white, big ? 0.7 : maj ? 0.4 : 0.16); ctx.lineWidth = big ? 2.4 : 1.4; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
    [0, 6, 12, 18].forEach((h) => { const a = ang(h); lat(ctx, String(h).padStart(2, '0') + ':00', x + Math.cos(a) * R * 0.66, y + Math.sin(a) * R * 0.66 + 7, { size: 18, w: 600, color: SIL, align: 'center' }); });
    ctx.strokeStyle = hexA(C.white, 0.14); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, R, 0, 6.283); ctx.stroke();
    // orbiting dots (texture)
    for (let i = 0; i < 18; i++) { const a = i / 18 * 6.283 + t * 0.12; ctx.fillStyle = hexA(C.white, 0.25); ctx.beginPath(); ctx.arc(x + Math.cos(a) * R * 1.1, y + Math.sin(a) * R * 1.1, 2.2, 0, 6.283); ctx.fill(); }
    ctx.restore();
    // «30 دقيقة» — a sliver of the evening
    const p30 = eo(t, T30, 0.5); const ok = eo(t, TOK, 0.4);
    if (p30 > 0) {
      ctx.save(); ctx.lineCap = 'butt'; ctx.strokeStyle = ok > 0 ? A.mixHex('#FFFFFF', C.mint, ok) : C.white; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(x, y, R, ang(20), ang(20 + 0.5 * p30)); ctx.stroke(); ctx.restore();
      const a = ang(20.25), lx = x + Math.cos(a) * (R + 90), ly = y + Math.sin(a) * (R + 60);
      ctx.save(); ctx.strokeStyle = hexA(C.white, 0.6 * p30); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * (R + 14), y + Math.sin(a) * (R + 14)); ctx.lineTo(lx, ly); ctx.lineTo(lx - 60, ly); ctx.stroke(); ctx.restore();
      txt(ctx, 'وقت الفراغ', lx - 70, ly + 9, { size: 26, w: 'S', color: C.white, alpha: p30 });
      if (ok > 0) FX.check(ctx, lx - 230, ly, 30, ok, C.mint, t);
    }
    // «ثماني ساعات» — a third of the day, struck out
    const p8 = eio(t, T8, 0.9); const fade8 = eo(t, TOK - 0.3, 0.5);
    if (p8 > 0 && fade8 < 1) { ctx.save(); ctx.globalAlpha = 1 - fade8; ctx.lineCap = 'butt'; ctx.strokeStyle = C.red; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(x, y, R, ang(9), ang(9 + 8 * p8)); ctx.stroke(); ctx.restore(); }
    // centre number
    const n30 = t < T8 + 0.3; const cp = n30 ? FX.springU(t - T30, 14, 0.5) : FX.springU(t - (T8 + 0.3), 14, 0.5); const back = t > TOK - 0.2;
    if (cp > 0) {
      const big = back ? '30' : n30 ? '30' : '8'; const unit = back || n30 ? 'دقيقة' : 'ساعات'; const col = back || n30 ? C.white : C.red;
      ctx.save(); ctx.translate(x, y); ctx.scale(Math.min(1.15, cp), Math.min(1.15, cp)); lat(ctx, big, 0, 50, { size: 170, w: 300, color: col, align: 'center', track: -4 }); txt(ctx, unit, 0, 110, { size: 34, w: 'S', color: SUB, align: 'center' }); ctx.restore();
      if (!n30 && !back) FX.cross(ctx, x, y + 10, 220, inv(TX8, TX8 + 0.35, t), C.red, t);
    }
    // rule badge
    ctx.save(); ctx.globalAlpha = ap; lat(ctx, '01', 300, 330, { size: 90, w: 300, color: C.white, align: 'left', track: -2 }); txt(ctx, 'القاعدة الأولى', 300, 380, { size: 26, w: 'S', color: SIL, align: 'left', dir: 'rtl' }); ctx.restore();
    marks(ctx, 'dark');
  } });

  // ================================================================ B3 — risk temperament: the slider (light)
  const B3 = { t0: B2.t1, t1: 223.12 };
  const SLR = { xr: 1520, xl: 400, y: 660 }; const SX = (u) => lerp(SLR.xr, SLR.xl, u);
  const KEYS3 = [[w(88, 3), 0.04], [w(89, 3), 0.96], [w(91, 0) + 0.1, 0.25], [w(91, 2), 0.62], [w(91, 3), 0.33], [w(92, 1), 0.4]];
  const knob3 = (t) => springs(t, 0.5, KEYS3, 11, 0.42);
  const BAND = [0.28, 0.5];
  sfx(B3.t0 - 0.45, 'shutter', 0.2); ksfx(w(87, 3), 'drop', 0.22);
  KEYS3.forEach(([tk], i) => sfx(tk - 0.04, i === 1 ? 'whoosh' : 'tick', i === 1 ? 0.18 : 0.1, i === 1 ? { d: 0.35, pan: -0.5 } : { f: 1800 + i * 200 }));
  ksfx(w(88, 3), 'snap', 0.16, 1500); ksfx(w(89, 3), 'bounce', 0.18, 400); sfx(w(92, 2), 'scribble', 0.08, { d: 0.6 }); sfx(w(93, 3), 'chime', 0.14);
  scene({ name: 'risk', t0: B3.t0, t1: B3.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    cap(ctx, wl(87, 0, 2), 230, t, { out: outAt(t, w(88, 0) - 0.3) });
    cap(ctx, wl(88, 0, 4, { map: { 3: { color: C.ink, w: 'B' } } }), 230, t, { out: outAt(t, w(89, 0) - 0.3) });
    cap(ctx, wl(89).concat(wl(90, 0, 2, { map: { 2: { color: C.ink, w: 'B' } } })), 230, t, { out: outAt(t, w(91, 0) - 0.3) });
    cap(ctx, wl(91, 0, 3, { map: { 3: { color: C.ink, w: 'B' } } }), 230, t, { out: outAt(t, w(92, 0) - 0.3) });
    cap(ctx, wl(92).concat(wl(93)), 230, t, { size: 50 });
    const tw = FX.kwidth('المخاطرة', 150); FX.kword(ctx, 'المخاطرة', 960 + tw / 2, 450, { size: 150, color: C.ink, lt: t - w(87, 3), mode: 'drop', stagger: 0.04 });
    // slider
    const sp = eo(t, w(87, 3) + 0.3, 0.6); if (sp <= 0) { marks(ctx, 'light'); return; }
    const u = clamp(knob3(t), -0.05, 1.05); const y = SLR.y;
    ctx.save(); ctx.globalAlpha = sp; ctx.strokeStyle = hexA(C.ink, 0.25); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(SLR.xr, y); ctx.lineTo(SLR.xl, y); ctx.stroke();
    for (let i = 0; i <= 10; i++) { const x = SX(i / 10); ctx.strokeStyle = hexA(C.ink, 0.35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y + 18); ctx.lineTo(x, y + (i % 5 ? 28 : 36)); ctx.stroke(); }
    ctx.strokeStyle = C.ink; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(SLR.xr, y); ctx.lineTo(SX(clamp(u)), y); ctx.stroke(); ctx.restore();
    // comfort band
    const bp = eo(t, w(92, 2) - 0.1, 0.6);
    if (bp > 0) { const x0 = SX(BAND[0]), x1 = SX(BAND[1]); ctx.save(); ctx.fillStyle = hexA(C.slate, 0.16 * bp); ctx.fillRect(x1, y - 46, (x0 - x1) * bp, 92); ctx.strokeStyle = hexA(C.slate, 0.7 * bp); ctx.lineWidth = 2; ctx.setLineDash([8, 6]); ctx.strokeRect(x1, y - 46, (x0 - x1) * bp, 92); ctx.restore();
      txt(ctx, 'منطقة الارتياح', (x0 + x1) / 2, y - 66, { size: 30, w: 'S', color: C.slate, align: 'center', alpha: eo(t, w(93, 2), 0.4) }); }
    // knob (red dot) with squash on fast moves
    const v = (knob3(t + 0.01) - knob3(t - 0.01)) / 0.02; const sq = clamp(Math.abs(v) * 0.04, 0, 0.35);
    ctx.save(); ctx.translate(SX(u), y); ctx.scale(1 + sq, 1 - sq * 0.6); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, 28 * sp, 0, 6.283); ctx.fill(); ctx.restore();
    FX.check(ctx, SX(0.39), y - 120, 34, inv(w(93, 3), w(93, 3) + 0.35, t), C.mint, t);
    // end labels
    FX.kword(ctx, 'حذر', SLR.xr + 40, y + 110, { size: 54, w: 'B', color: C.ink, lt: t - w(88, 3), mode: 'snap' });
    FX.kword(ctx, 'تجاهل الحذر', SLR.xl + FX.kwidth('تجاهل الحذر', 54, 'B') - 40, y + 110, { size: 54, w: 'B', color: C.ink, lt: t - w(89, 3), mode: 'bounce' });
    if (t > w(90, 2)) { FX.swarm(ctx, 10, 3, t, (i, a, b) => { const q = ((t - w(90, 2)) * 0.6 + a) % 1; return [SLR.xl - 60 + 120 * b, y - 40 - q * 160, 5, C.mint, 0.8 * (1 - q) * eo(t, w(90, 2), 0.3) * (1 - eo(t, w(91, 0), 0.4))]; }); }
    marks(ctx, 'light');
  } });

  // ================================================================ B4 — waking at night worried → risk set wrong (dark)
  const B4 = { t0: B3.t1, t1: 232.52 };
  const ROWS = [['XAU/USD', '−2.1%', C.red], ['BTC/USD', '−3.4%', C.red], ['EUR/USD', '+0.4%', C.mint]];
  const STARS = (() => { const r = A.rng(4242); return Array.from({ length: 46 }, () => [r() * W, 130 + r() * 480, 1 + r() * 2, 1.2 + r() * 1.6]).filter(([x, y]) => !(x > 380 && x < 760 && y > 400)); })();
  const WRONG = w(96, 1); const KEYS4 = [[w(95, 5), 0.92], [WRONG + 0.55, 0.4]];
  sfx(B4.t0 - 0.42, 'whip', 0.2); F.SHUTTER.push([B4.t0 - 0.42, B4.t0, 1.6 / 60]);
  ksfx(w(94, 3), 'drop', 0.18); sfx(w(94, 4), 'buzz', 0.1); sfx(w(94, 4) + 0.35, 'buzz', 0.08); ROWS.forEach((r, i) => sfx(w(94, 6) + i * 0.15, 'pop', 0.1, { f: 500 + i * 90 }));
  sfx(w(95, 0), 'whoosh', 0.14, { d: 0.5 }); sfx(w(95, 5) - 0.05, 'whoosh', 0.16, { d: 0.35, pan: -0.5 }); ksfx(WRONG, 'snap', 0.24); sfx(WRONG + 0.05, 'buzz', 0.14); sfx(WRONG + 0.55, 'whoosh', 0.14, { d: 0.35, pan: 0.2 });
  scene({ name: 'night', t0: B4.t0, t1: B4.t1, ink: 'dark', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    const p2 = eio(t, w(95, 0) - 0.2, 0.6);
    // night: moon + stars + clock + positions card, shaking with worry
    if (p2 < 1) {
      ctx.save(); ctx.translate(0, -p2 * 120); ctx.globalAlpha = 1 - p2;
      STARS.forEach(([sx, sy, sf, sr], i) => { const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * sf + i)); ctx.fillStyle = hexA(C.white, 0.5 * tw); ctx.beginPath(); ctx.arc(sx, sy, sr, 0, 6.283); ctx.fill(); });
      const mp = eo(t, B4.t0, 0.8); ctx.save(); ctx.translate(1520, 330); ctx.fillStyle = C.white; ctx.globalAlpha *= mp; ctx.beginPath(); ctx.arc(0, 0, 72, 0, 6.283); ctx.clip(); ctx.beginPath(); ctx.arc(0, 0, 72, 0, 6.283); ctx.moveTo(96, -22); ctx.arc(30, -22, 66, 0, Math.PI * 2, true); ctx.fill('evenodd'); ctx.restore();
      const [jx, jy] = K.shake(t, 5 * eo(t, w(94, 4), 0.2) * (1 - eo(t, w(95, 0) - 0.3, 0.3)));
      const cp = FX.springU(t - (w(94, 2) - 0.1), 13, 0.5);
      if (cp > 0) { ctx.save(); ctx.translate(560 + jx, 560 + jy); ctx.scale(Math.min(1.1, cp), Math.min(1.1, cp)); lat(ctx, '03:12', 0, 0, { size: 170, w: 300, color: C.white, align: 'center', track: -2 }); txt(ctx, 'ليلاً', 0, 70, { size: 40, w: 'S', color: SUB, align: 'center' }); ctx.restore(); }
      const kp = eo(t, w(94, 6) - 0.3, 0.5); if (kp > 0) {
        const x = 1040, y = 470; ctx.save(); ctx.translate(jx * 0.6, jy * 0.6); const yy = K.card(ctx, x, y, 620, 300, { p: kp, dark: true, chamfer: 36 });
        txt(ctx, 'صفقاتك المفتوحة', x + 580, yy + 56, { size: 28, w: 'B', color: C.white });
        ROWS.forEach((r, i) => { const rp = eo(t, w(94, 6) + i * 0.15, 0.3); const ry = yy + 120 + i * 64; lat(ctx, r[0], x + 40, ry, { size: 26, w: 600, color: SUB, alpha: rp }); lat(ctx, r[1], x + 580, ry, { size: 30, w: 700, color: r[2], align: 'right', alpha: rp }); });
        ctx.restore();
      }
      ctx.restore();
    }
    cap(ctx, wl(94, 0, 6, { map: { 3: { color: C.white, w: 'B' }, 4: { color: C.white, w: 'B' } } }), 225, t, { color: SUB, out: outAt(t, w(95, 0) - 0.3) });
    // the risk slider again: knob far to the bold side → wrong → back into the comfort band
    if (p2 > 0) {
      cap(ctx, wl(95, 0, 5, { map: { 5: { color: C.white, w: 'B' } } }), 300, t, { color: SUB });
      const y = 620; const u = clamp(springs(t, 0.5, KEYS4, 11, 0.45), -0.05, 1.05);
      ctx.save(); ctx.globalAlpha = p2; ctx.strokeStyle = hexA(C.white, 0.25); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(SLR.xr, y); ctx.lineTo(SLR.xl, y); ctx.stroke();
      const x0 = SX(BAND[0]), x1 = SX(BAND[1]); ctx.fillStyle = hexA(C.white, 0.08); ctx.fillRect(x1, y - 46, x0 - x1, 92); ctx.strokeStyle = hexA(C.white, 0.5); ctx.setLineDash([8, 6]); ctx.lineWidth = 2; ctx.strokeRect(x1, y - 46, x0 - x1, 92); ctx.setLineDash([]);
      ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(SX(u), y, 28, 0, 6.283); ctx.fill(); ctx.restore();
      txt(ctx, 'منطقة الارتياح', (x0 + x1) / 2, y - 66, { size: 28, w: 'S', color: SIL, align: 'center', alpha: p2 });
      FX.cross(ctx, SX(0.92), y - 110, 70, inv(WRONG, WRONG + 0.3, t) * (1 - eo(t, WRONG + 0.9, 0.4)), C.red, t);
      FX.kword(ctx, 'خاطئ', SX(0.92) + FX.kwidth('خاطئ', 120) / 2, y + 190, { size: 120, color: C.red, lt: t - WRONG, mode: 'snap' });
      cap(ctx, wl(96, 0, 0), y + 190, t, { color: SUB, x: SX(0.92) + FX.kwidth('خاطئ', 120) / 2 + FX.kwidth('بشكل', 56, 'R') + 26 });
    }
    marks(ctx, 'dark');
  } });

  // ================================================================ M1 — choose your markets: instruments (light)
  const M1 = { t0: B4.t1, t1: 248.42 };
  const INST = [{ k: 'fx', ar: 'الفوركس', tok: 'EUR/USD', t: w(99, 3) }, { k: 'oil', ar: 'النفط', tok: 'WTI', t: w(100, 1) }, { k: 'gold', ar: 'الذهب', tok: 'XAU/USD', t: w(101, 1) }, { k: 'crypto', ar: 'العملات الرقمية', tok: 'BTC/USD', t: w(102, 1) }, { k: 'more', ar: 'وغيرها', tok: 'US500', t: w(103, 1) }];
  const REASONS = [{ i: 0, s: 'سيولة عالية', t: w(105, 0) }, { i: 2, s: 'ملاذ آمن', t: w(105, 2) + 0.1 }, { i: 3, s: 'تقلّب كبير', t: w(105, 4) }];
  sfx(M1.t0 - 0.45, 'shutter', 0.2); ksfx(w(98, 3), 'drop', 0.2);
  INST.forEach((m, i) => { sfx(m.t - 0.05, 'whoosh', 0.1, { d: 0.2, up: false, pan: 0.6 - i * 0.3 }); sfx(m.t + 0.2, 'pop', 0.18, { f: 900 - i * 80, pan: 0.6 - i * 0.3 }); });
  REASONS.forEach((r, i) => sfx(r.t, 'scribble', 0.09, { d: 0.5, pan: 0.6 - r.i * 0.3 }));
  function drawInst(ctx, k, cx, cy, s) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.lineWidth = 3; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round';
    if (k === 'fx') { [[-28, 10, '$'], [30, -14, '€']].forEach(([x, y, sym]) => { ctx.fillStyle = metal(ctx, y - 70, y + 70); ctx.beginPath(); ctx.arc(x, y, 66, 0, 6.283); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, 50, 0, 6.283); ctx.stroke(); lat(ctx, sym, x, y + 22, { size: 60, w: 700, color: C.ink, align: 'center' }); }); }
    else if (k === 'oil') { ctx.fillStyle = metal(ctx, -90, 90); A.roundRect(ctx, -64, -86, 128, 172, 18); ctx.fill(); ctx.stroke(); [-40, 40].forEach((y) => { ctx.beginPath(); ctx.moveTo(-64, y); ctx.lineTo(64, y); ctx.stroke(); }); ctx.beginPath(); ctx.ellipse(0, -86, 64, 14, 0, 0, 6.283); ctx.stroke(); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(0, -18); ctx.quadraticCurveTo(18, 6, 0, 16); ctx.quadraticCurveTo(-18, 6, 0, -18); ctx.fill(); }
    else if (k === 'gold') { ctx.fillStyle = metal(ctx, -60, 60); ctx.beginPath(); ctx.moveTo(-96, 50); ctx.lineTo(96, 50); ctx.lineTo(66, -40); ctx.lineTo(-66, -40); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-66, -40); ctx.lineTo(-40, -62); ctx.lineTo(88, -62); ctx.lineTo(66, -40); ctx.moveTo(88, -62); ctx.lineTo(118, 28); ctx.lineTo(96, 50); ctx.stroke(); lat(ctx, 'Au', 0, 22, { size: 36, w: 700, color: C.ink, align: 'center' }); }
    else if (k === 'crypto') { ctx.fillStyle = metal(ctx, -76, 76); ctx.beginPath(); ctx.arc(0, 0, 74, 0, 6.283); ctx.fill(); ctx.stroke(); for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 62, Math.sin(a) * 62); ctx.lineTo(Math.cos(a) * 70, Math.sin(a) * 70); ctx.stroke(); } lat(ctx, 'B', 0, 26, { size: 76, w: 800, color: C.ink, align: 'center' }); ctx.lineWidth = 5; [-10, 10].forEach((x) => { ctx.beginPath(); ctx.moveTo(x, -44); ctx.lineTo(x, -30); ctx.moveTo(x, 30); ctx.lineTo(x, 44); ctx.stroke(); }); }
    else { ctx.fillStyle = metal(ctx, -80, 80); A.roundRect(ctx, -70, -80, 140, 160, 14); ctx.fill(); ctx.stroke(); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(0, 30); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.stroke(); }
    ctx.restore();
  }
  scene({ name: 'markets', t0: M1.t0, t1: M1.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    cap(ctx, wl(97).concat(wl(98, 0, 1)), 220, t, { out: outAt(t, w(104, 0) - 0.3) });
    const tw = K.wordsWidth(wl(98, 2, 3), { size: 120 }); K.words(ctx, wl(98, 2, 3, { map: { 3: { color: C.red } } }), 960 + tw / 2, 370, t, { size: 120, color: C.ink, stagger: 0.04, out: outAt(t, w(104, 0) - 0.3) });
    cap(ctx, wl(104).concat(wl(105, 0, 1)), 220, t, { size: 54, out: outAt(t, w(105, 2) - 0.3) });
    cap(ctx, wl(105, 2, 5), 220, t, { size: 54 });
    INST.forEach((m, i) => {
      const cx = 960 + (2 - i) * 330, cy = 600; const p = FX.springU(t - m.t, 14, 0.45); if (p <= 0) return;
      const yy = cy - (1 - Math.min(1, p)) * 380; ctx.save(); ctx.globalAlpha = clamp((t - m.t) * 6); drawInst(ctx, m.k, cx, yy, 1.25 * Math.min(1.08, Math.max(0.2, p))); ctx.restore();
      txt(ctx, m.ar, cx, cy + 165, { size: 34, w: 'S', color: C.ink, align: 'center', alpha: clamp((t - m.t - 0.15) * 4) });
      K.chip(ctx, m.tok, cx, cy + 215, { p: eo(t, m.t + 0.2, 0.35), size: 20, align: 'center', stroke: hexA(C.slate, 0.6), color: C.charcoal });
    });
    REASONS.forEach((r) => { const cx = 960 + (2 - r.i) * 330, cy = 600; const p = inv(r.t, r.t + 0.5, t); FX.scribbleCircle(ctx, cx, cy, 130, 120, p, C.red, t); FX.note(ctx, r.s, cx + 70, cy - 150, { p: inv(r.t + 0.2, r.t + 0.8, t), size: 28, color: C.red, w: 'S', t }); });
    marks(ctx, 'light');
  } });

  // ================================================================ M2 — the key: be interested, follow the news, learn every market's details (dark)
  const M2 = { t0: M1.t1, t1: 257.12 };
  const KEYP = (() => { const pts = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * 6.283; pts.push([1500 + Math.cos(a) * 54, 470 + Math.sin(a) * 54]); } return pts; })();
  const NEWS = ['قرار الفائدة', 'بيانات التضخم', 'مخزونات النفط', 'تقرير الوظائف', 'الناتج المحلي', 'مؤشر مديري المشتريات'];
  const MC = K.candles(K.path([[0, 50], [0.3, 58], [0.5, 54], [0.75, 66], [1, 62]], 70, 77, 2.4), 13, 1.8);
  const LENS0 = w(109, 1);
  sfx(M2.t0 - 0.42, 'ripple', 0.2); ksfx(w(106, 0), 'drop', 0.2); sfx(w(106, 0) + 0.1, 'scribble', 0.1, { d: 0.8 });
  ksfx(w(107, 3), 'bounce', 0.16); sfx(w(108, 1) - 0.1, 'whoosh', 0.16, { d: 0.6 }); sfx(w(108, 1), 'type', 0.08, { d: 1.2, n: 10 }); sfx(LENS0, 'whoosh', 0.14, { d: 0.8, up: false }); sfx(w(109, 5), 'tick', 0.1);
  scene({ name: 'news', t0: M2.t0, t1: M2.t1, ink: 'dark', enter: { type: 'ripple', dur: 0.42, x: 960, y: 600 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    const kOut = eio(t, LENS0 - 0.4, 0.6);
    // key (hand-drawn)
    if (kOut < 1) {
      ctx.save(); ctx.globalAlpha = 1 - kOut; ctx.translate(0, -kOut * 80);
      const kp = inv(w(106, 0) - 0.05, w(106, 0) + 0.7, t);
      line(ctx, 'paper', KEYP, { reveal: clamp(kp * 1.6), width: 6, color: C.white, t, amp: 0.5 });
      line(ctx, 'paper', [[1446, 470], [1200, 470], [1200, 510], [1170, 510], [1170, 470], [1140, 470], [1140, 520]], { reveal: clamp(kp * 1.6 - 0.6), width: 6, color: C.white, t, amp: 0.5 });
      FX.kword(ctx, 'والمفتاح', 1050, 500, { size: 150, color: C.white, lt: t - w(106, 0), mode: 'drop', stagger: 0.04 });
      const l2 = wl(107, 0, 3, { map: { 3: { color: C.white, w: 'B', mode: 'bounce' } } }); K.words(ctx, l2, 1050, 620, t, { size: 60, w: 'R', color: SUB, mode: 'rise' });
      ctx.restore();
    }
    // news ticker (scrolls left → right for RTL reading)
    const tp = eo(t, w(108, 0) - 0.2, 0.5);
    if (tp > 0) {
      const y = 760; ctx.save(); ctx.globalAlpha = tp; ctx.fillStyle = '#1F2125'; ctx.fillRect(0, y - 40, W * tp, 80); ctx.strokeStyle = hexA(C.white, 0.15); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, y - 40); ctx.lineTo(W, y - 40); ctx.moveTo(0, y + 40); ctx.lineTo(W, y + 40); ctx.stroke();
      ctx.beginPath(); ctx.rect(0, y - 40, W - 190, 80); ctx.clip();
      let x = -900 + (t - w(108, 0)) * 260; for (let r = 0; r < 3; r++) for (const n of NEWS) { const ww = measure(ctx, n, 30, 'R'); txt(ctx, n, x + ww, y + 11, { size: 30, color: C.white }); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(x + ww + 34, y, 5, 0, 6.283); ctx.fill(); x += ww + 70; if (x > W + 600) break; }
      ctx.restore();
      ctx.save(); ctx.globalAlpha = tp; ctx.fillStyle = C.red; ctx.fillRect(W - 190, y - 40, 190, 80); txt(ctx, 'الأخبار', W - 100, y + 12, { size: 32, w: 'B', color: C.white, align: 'center' }); ctx.restore();
      cap(ctx, wl(108), 880, t, { color: SUB, size: 46 });
    }
    // lens over a chart: details of every market
    const lp = eo(t, LENS0 - 0.3, 0.6);
    if (lp > 0) {
      const box = [300, 300, 1320, 380]; const fr = K.frame(box, 40, 74, MC.length);
      ctx.save(); ctx.globalAlpha = lp; K.drawCandles(ctx, fr, MC, 1, { body: 0.55, alpha: 0.75 }); ctx.restore();
      const u = eio(t, LENS0, we(109, 5) - LENS0); const lx = lerp(1450, 520, u), ly = fr.Y(58) + Math.sin(u * 9) * 40; const R = 120 * lp;
      ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, R, 0, 6.283); ctx.clip(); ctx.fillStyle = '#121316'; ctx.fillRect(lx - R, ly - R, 2 * R, 2 * R);
      ctx.translate(lx, ly); ctx.scale(2.6, 2.6); ctx.translate(-lx, -ly); K.drawCandles(ctx, fr, MC, 1, { body: 0.55, wick: 1 }); ctx.restore();
      ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(lx, ly, R, 0, 6.283); ctx.stroke(); ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(lx + R * 0.72, ly + R * 0.72); ctx.lineTo(lx + R * 1.3, ly + R * 1.3); ctx.stroke(); ctx.restore();
      cap(ctx, wl(109, 0, 5, { map: { 2: { color: C.white, w: 'B' }, 5: { color: C.white, w: 'B' } } }), 230, t, { color: SUB });
    }
    marks(ctx, 'dark');
  } });

  // ================================================================ A1 — analysis: fundamental (big picture) vs technical (dive into charts) → mix both (split)
  const A1 = { t0: M2.t1, t1: 274.0 };
  const SPLIT = w(111, 0) - 0.2, MIX = w(115, 3) - 0.1;
  const AC = K.path([[0, 50], [0.25, 58], [0.45, 52], [0.7, 64], [1, 70]], 46, 91, 2.2); const ACC = K.candles(AC, 17, 1.6); const AMA = A.sma(AC, 8);
  sfx(A1.t0 - 0.42, 'whip', 0.2); F.SHUTTER.push([A1.t0 - 0.42, A1.t0, 1.6 / 60]);
  ksfx(w(110, 3), 'slam', 0.24); sfx(SPLIT, 'whoosh', 0.18, { d: 0.6 }); sfx(SPLIT + 0.05, 'shutter', 0.12);
  [0, 1, 2].forEach((i) => sfx(w(111, 2) + i * 0.3, 'pop', 0.12, { f: 700 + i * 90, pan: 0.5 }));
  sfx(w(112, 2), 'revswell', 0.16, { d: 0.6 }); sfx(w(112, 2) + 0.6, 'whoosh', 0.14, { d: 0.6, pan: -0.5 });
  sfx(MIX - 0.3, 'whoosh', 0.2, { d: 0.5 }); sfx(MIX + 0.15, 'impact', 0.2); ksfx(w(115, 5), 'bounce', 0.2);
  function fundIcons(ctx, cx, cy, t, t0) {
    const items = [
      (x, y) => { ctx.fillStyle = C.white; A.roundRect(ctx, x - 70, y - 64, 140, 128, 12); ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = C.ink; ctx.fillRect(x - 70, y - 64, 140, 30); for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { ctx.fillStyle = r === 1 && c === 2 ? C.red : hexA(C.ink, 0.25); ctx.fillRect(x - 56 + c * 30, y - 22 + r * 26, 20, 18); } },
      (x, y) => { ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.fillStyle = C.white; ctx.beginPath(); ctx.moveTo(x - 80, y - 30); ctx.lineTo(x, y - 76); ctx.lineTo(x + 80, y - 30); ctx.closePath(); ctx.fill(); ctx.stroke(); for (let c = 0; c < 4; c++) { ctx.strokeRect(x - 62 + c * 36, y - 22, 16, 72); } ctx.beginPath(); ctx.moveTo(x - 86, y + 58); ctx.lineTo(x + 86, y + 58); ctx.stroke(); },
      (x, y) => { ctx.fillStyle = C.white; ctx.fillRect(x - 74, y - 60, 148, 120); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.strokeRect(x - 74, y - 60, 148, 120); ctx.fillStyle = C.ink; ctx.fillRect(x - 58, y - 44, 116, 18); for (let r = 0; r < 4; r++) { ctx.fillStyle = hexA(C.ink, 0.3); ctx.fillRect(x - 58 + (r % 2 ? 0 : 0), y - 12 + r * 16, r === 3 ? 70 : 116, 6); } },
    ];
    items.forEach((f, i) => { const p = FX.springU(t - (t0 + i * 0.3), 14, 0.5); if (p <= 0) return; ctx.save(); ctx.translate(cx + (1 - i) * 200, cy); ctx.scale(Math.min(1.08, p), Math.min(1.08, p)); ctx.translate(-(cx + (1 - i) * 200), -cy); f(cx + (1 - i) * 200, cy); ctx.restore(); });
  }
  scene({ name: 'analysis', t0: A1.t0, t1: A1.t1, ink: 'light', enter: { type: 'whip', dur: 0.42, dir: 1 },
    marksFn(ctx, t) { const sp = eio(t, SPLIT, 0.6); F.realMarks(ctx, 'light', { x: false }); xmark(ctx, 115, 984, 69, sp > 0.08 ? C.white : C.ink, 0.6); },
    draw(ctx, t) {
    const sp = eio(t, SPLIT, 0.6); const mx = eio(t, MIX - 0.3, 0.6); const half = lerp(W, 960, sp);
    // right (fundamental) light, left (technical) dark; divider sweeps in from the left
    FX.bg(ctx, 'light');
    if (sp > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W - half, H); ctx.clip(); FX.bg(ctx, 'dark'); ctx.restore(); }
    // title before the split
    const tw = FX.kwidth('التحليل', 220); if (sp < 1) { ctx.save(); ctx.globalAlpha = 1 - sp; FX.kword(ctx, 'التحليل', 960 + tw / 2, 600, { size: 220, color: C.ink, lt: t - w(110, 3), mode: 'slam' }); cap(ctx, wl(110, 0, 2), 300, t); ctx.restore(); }
    if (sp > 0) {
      // fundamental side
      ctx.save(); ctx.globalAlpha = sp; ctx.translate(lerp(0, -230, mx), 0);
      txt(ctx, 'التحليل الأساسي', 1440, 300, { size: 54, w: 'B', color: C.ink, align: 'center' });
      txt(ctx, 'النظرة العامة', 1440, 360, { size: 32, color: C.slate, align: 'center', alpha: eo(t, w(111, 2), 0.4) });
      fundIcons(ctx, 1440, 580, t, w(111, 2));
      ctx.restore();
      // technical side (dive: the chart scales up on «الغوص»)
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 960 + lerp(0, 0, mx), H); ctx.clip(); ctx.globalAlpha = sp; ctx.translate(lerp(0, 230, mx), 0);
      txt(ctx, 'التحليل الفني', 480, 300, { size: 54, w: 'B', color: C.white, align: 'center', alpha: eo(t, w(113, 1) - 0.2, 0.4) });
      txt(ctx, 'الغوص في الرسوم البيانية', 480, 360, { size: 32, color: SIL, align: 'center', alpha: eo(t, w(112, 2), 0.4) });
      const dive = eio(t, w(112, 2), 1.0) * (1 - eio(t, w(113, 0), 0.8)); const box = [140, 450, 680, 300]; const fr = K.frame(box, 44, 76, AC.length);
      ctx.save(); ctx.translate(480, 600); ctx.scale(1 + dive * 1.4, 1 + dive * 1.4); ctx.translate(-480, -600);
      K.drawCandles(ctx, fr, ACC, eo(t, SPLIT + 0.4, 1.4), { body: 0.6 });
      const mp = eo(t, w(113, 1), 0.8); if (mp > 0) { const m = Math.max(2, Math.round(AMA.length * mp)); ctx.strokeStyle = C.white; ctx.lineWidth = 2.4; ctx.beginPath(); for (let i = 0; i < m; i++) (i ? ctx.lineTo : ctx.moveTo).call(ctx, fr.X(i), fr.Y(AMA[i])); ctx.stroke(); }
      ctx.restore(); ctx.restore();
      // divider → «+»
      ctx.save(); ctx.strokeStyle = hexA(C.slate, 0.6 * (1 - mx)); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W - half, 120); ctx.lineTo(W - half, H - 160); ctx.stroke(); ctx.restore();
      const pp = FX.springU(t - (MIX + 0.1), 14, 0.5); if (pp > 0) { ctx.save(); ctx.translate(960, 580); ctx.scale(Math.min(1.1, pp), Math.min(1.1, pp)); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, 54, 0, 6.283); ctx.fill(); ctx.strokeStyle = C.white; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(22, 0); ctx.moveTo(0, -22); ctx.lineTo(0, 22); ctx.stroke(); ctx.restore(); }
    }
    // questions as caption pills
    const pill = (ws, y, t0o, light) => { const cw = K.wordsWidth(ws, { size: 42, w: 'R' }); const a = eo(t, ws[0].t - 0.2, 0.3) * (t0o == null ? 1 : 1 - outAt(t, t0o)); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; A.roundRect(ctx, 960 - cw / 2 - 34, y - 52, cw + 68, 76, 38); ctx.fillStyle = light ? 'rgba(255,255,255,0.92)' : 'rgba(20,22,26,0.88)'; ctx.fill(); ctx.restore(); K.words(ctx, ws, 960 + cw / 2, y, t, { size: 42, w: 'R', color: light ? C.ink : C.white, mode: 'rise', stagger: 0.02, out: t0o == null ? undefined : outAt(t, t0o) }); };
    pill(wl(111, 0, 7), 880, w(112, 0) - 0.3, true);
    pill(wl(112).concat(wl(113)), 880, w(114, 0) - 0.3, false);
    pill(wl(114), 880, w(115, 0) - 0.3, true);
    const mw = wl(115, 0, 5, { map: { 3: { color: C.red, w: 'B', mode: 'bounce' } } }); pill(mw, 880, null, true);
  } });

  // ================================================================ K1 — the book: read it, then answer the questions below (light)
  const K1 = { t0: A1.t1, t1: 284.82 };
  const OPEN = w(116, 3), FLIP = w(117, 1), ST1 = w(118, 0), ST2 = w(119, 1), DOWN = w(120, 1);
  sfx(K1.t0 - 0.45, 'shutter', 0.2); sfx(w(116, 2) - 0.1, 'whoosh', 0.14, { d: 0.4, up: false }); sfx(w(116, 2) + 0.25, 'impact', 0.14);
  sfx(OPEN, 'whoosh', 0.16, { d: 0.5 }); sfx(FLIP, 'whoosh', 0.1, { d: 0.25 }); sfx(FLIP + 0.3, 'whoosh', 0.1, { d: 0.25 });
  sfx(ST1, 'pop', 0.18, { f: 800 }); sfx(ST2, 'pop', 0.18, { f: 900 }); [0, 1, 2].forEach((i) => sfx(DOWN + i * 0.32, 'bloop', 0.1));
  scene({ name: 'book', t0: K1.t0, t1: K1.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    cap(ctx, wl(116, 0, 1).concat(wl(116, 2, 3, { map: { 2: { color: C.ink, w: 'B' } } })), 230, t, { out: outAt(t, w(116, 5) - 0.3) });
    cap(ctx, wl(116, 4, 7, { map: { 6: { color: C.ink, w: 'B' }, 7: { color: C.ink, w: 'B' } } }), 230, t, { out: outAt(t, w(117, 0) - 0.3) });
    cap(ctx, wl(117), 230, t, { out: outAt(t, ST1 - 0.3) });
    // book (Arabic binding: spine on the right, the cover swings open to the right)
    const bx = 1180, by = 560, bw = 340, bh = 460, hx = bx + bw / 2; const dp = FX.springU(t - (w(116, 2) - 0.1), 13, 0.5);
    if (dp > 0) {
      ctx.save(); ctx.translate(0, -(1 - Math.min(1, dp)) * 500); ctx.globalAlpha = clamp((t - w(116, 2) + 0.1) * 5);
      const op = eio(t, OPEN, 0.8);
      const page = (x0, k) => { ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = hexA(C.ink, 0.5); ctx.lineWidth = 2; ctx.fillRect(x0, by - bh / 2, bw, bh); ctx.strokeRect(x0, by - bh / 2, bw, bh);
        for (let i = 0; i < 9; i++) { const len = (i === 0 ? 0.55 : 0.88 - ((i + k) % 3) * 0.13) * (bw - 72); ctx.fillStyle = hexA(C.ink, i === 0 ? 0.6 : 0.16); ctx.fillRect(x0 + bw - 36 - len, by - bh / 2 + 60 + i * 40, len, i === 0 ? 14 : 8); } };
      page(bx - bw / 2, 0);
      [FLIP, FLIP + 0.3].forEach((ft) => { const fp = eio(t, ft, 0.45); if (fp <= 0 || fp >= 1) return; const sx = Math.cos(fp * Math.PI); ctx.save(); ctx.translate(hx, by); ctx.scale(sx, 1); ctx.fillStyle = A.mixHex('#FFFFFF', '#DDE1E3', Math.abs(Math.sin(fp * Math.PI)) * 0.8); ctx.fillRect(-bw, -bh / 2, bw, bh); ctx.strokeStyle = hexA(C.ink, 0.4); ctx.strokeRect(-bw, -bh / 2, bw, bh); ctx.restore(); });
      const cs = Math.cos(op * Math.PI); ctx.save(); ctx.translate(hx, by); ctx.scale(cs, 1);
      if (cs > 0) { ctx.fillStyle = C.carbon; ctx.fillRect(-bw, -bh / 2, bw, bh); ctx.fillStyle = C.red; ctx.fillRect(-bw + 40, -bh / 2 + 70, 10, 120);
        txt(ctx, 'استراتيجيات', -50, -70, { size: 46, w: 'B', color: C.white }); txt(ctx, 'التداول', -50, -12, { size: 46, w: 'B', color: C.white }); txt(ctx, 'أكاديمية آكسي', -50, bh / 2 - 46, { size: 24, w: 'R', color: SIL }); }
      else { ctx.fillStyle = '#E4E7E9'; ctx.fillRect(-bw, -bh / 2, bw, bh); ctx.strokeStyle = hexA(C.ink, 0.4); ctx.lineWidth = 2; ctx.strokeRect(-bw, -bh / 2, bw, bh); }
      ctx.restore();
      ctx.fillStyle = C.ink; ctx.fillRect(hx - 4, by - bh / 2, 8, bh);
      ctx.restore();
    }
    // steps: read the book → answer the questions below
    const s1 = eo(t, ST1, 0.4), s2 = eo(t, ST2, 0.4);
    if (s1 > 0) { ctx.save(); ctx.globalAlpha = s1; lat(ctx, '1', 900, 470, { size: 64, w: 300, color: C.red, align: 'right' }); txt(ctx, 'اقرأ الكتاب', 840, 466, { size: 46, w: 'S', color: C.ink, align: 'right' }); ctx.restore(); }
    if (s2 > 0) { ctx.save(); ctx.globalAlpha = s2; lat(ctx, '2', 900, 600, { size: 64, w: 300, color: C.red, align: 'right' }); txt(ctx, 'أجب عن الأسئلة', 840, 596, { size: 46, w: 'S', color: C.ink, align: 'right' }); ctx.restore(); }
    FX.check(ctx, 540, 450, 34, inv(ST2 - 0.3, ST2, t), C.mint, t);
    const dpA = eo(t, DOWN - 0.15, 0.3);
    if (dpA > 0) { const by2 = Math.abs(Math.sin((t - DOWN) * 6)) * 26 * Math.exp(-(t - DOWN) * 0.6); ctx.save(); ctx.globalAlpha = dpA; ctx.translate(690, 720 + by2); ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(34, 0); ctx.lineTo(0, 46); ctx.closePath(); ctx.fill(); ctx.fillRect(-9, -70, 18, 72); ctx.restore(); txt(ctx, 'أسفل الصفحة', 690, 860, { size: 34, w: 'S', color: C.ink, align: 'center', alpha: dpA }); }
    cap(ctx, wl(118).concat(wl(119)), 230, t, { color: C.slate, out: outAt(t, w(120, 0) - 0.3) });
    cap(ctx, wl(120), 230, t, { color: C.slate });
    marks(ctx, 'light');
  } });

  // ================================================================ K2 — outro headline: «نراكم في / الدرس القادم.» (light, reference end card)
  const K2 = { t0: K1.t1, t1: F.CLOSE };
  const L1 = wl(121, 0, 1), L2 = 'الدرس القادم';
  sfx(K2.t0 - 0.42, 'whip', 0.2); F.SHUTTER.push([K2.t0 - 0.42, K2.t0, 1.6 / 60]);
  ksfx(w(121, 0), 'drop', 0.16); ksfx(w(121, 2), 'drop', 0.24); sfx(w(121, 3) + 0.62, 'pop', 0.24, { f: 700 }); sfx(w(122, 0), 'scribble', 0.1, { d: 0.7 });
  scene({ name: 'outro', t0: K2.t0, t1: K2.t1, ink: 'light', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    const s2 = 230; const w2 = FX.kwidth(L2, s2); const right = 960 + w2 / 2 + 20;
    K.words(ctx, L1, right, 400, t, { size: 110, color: C.ink, stagger: 0.035 });
    FX.kword(ctx, L2, right, 660, { size: s2, color: C.ink, lt: t - w(121, 2), mode: 'drop', stagger: 0.05 });
    const dx = right - w2 - 44, dy = 660 - 30; K.dot(ctx, dx, dy, 30, t - (w(121, 3) + 0.3), { h0: 380 });
    FX.note(ctx, 'إن شاء الله', dx + 150, 820, { p: inv(w(122, 0), w(122, 2) + 0.3, t), size: 36, color: C.slate, w: 'S', align: 'right', to: [dx + 6, dy + 46], from: [dx + 30, 790], bend: -0.4, t });
    K.under(ctx, right, right - w2, 760, inv(w(121, 3) + 0.2, w(121, 3) + 0.7, t), { t });
    marks(ctx, 'light');
  } });

  // ================================================================ CLOSE — X sting (1 s) → CTA with red pill + risk strip (last 3 s)
  const CL = { t0: F.CLOSE, t1: F.TOTAL + 1 };
  sfx(CL.t0 - 0.42, 'whoosh', 0.18, { d: 0.45 }); sfx(CL.t0 + 0.02, 'sting', 0.6); sfx(CL.t0 + 1.05, 'whoosh', 0.14, { d: 0.4 }); sfx(CL.t0 + 1.35, 'pop', 0.24, { f: 820 });
  function x3d(ctx, cx, cy, h, depth) { for (let d = depth; d > 0; d -= 1.5) xmark(ctx, cx + d * 0.55, cy + d, h, C.slate, 1); xmark(ctx, cx, cy, h, C.white, 1); }
  scene({ name: 'close', t0: CL.t0, t1: CL.t1, ink: 'slate', noMarks: true, enter: { type: 'bars', dur: 0.42 }, draw(ctx, t) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, C.frost); g.addColorStop(0.72, C.slate); g.addColorStop(1, C.slate); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const lt = t - CL.t0; const drop = lt < 0 ? 0 : 1 - Math.exp(-7 * lt) * Math.cos(13 * lt); const seal = ei(t, CL.t0 + 0.95, 0.25);
    if (seal < 1) { const y = lerp(-260, 520, drop); const s = 1 - seal; ctx.save(); ctx.translate(960, y); ctx.scale(s, s); x3d(ctx, 0, 0, 300, 26); ctx.restore(); }
    const pc = FX.springU(t - (CL.t0 + 1.1), 12, 0.6);
    if (pc > 0) {
      txt(ctx, 'تعلّم ثم تعلّم ثم تدرّب ثم تداول.', 960, 520 + (1 - Math.min(1, pc)) * 40, { size: 80, w: 'L', color: C.white, align: 'center', alpha: clamp((t - CL.t0 - 1.1) * 5) });
      K.pill(ctx, 'تعلّم مع Axi', 960, 670, { p: clamp(FX.springU(t - (CL.t0 + 1.35), 14, 0.55), 0, 1.05), size: 32, h: 76 });
      logo(ctx, 1843 - logoWidth(84), 52, 84, C.ink, { alpha: clamp((t - CL.t0 - 1.1) * 5) });
    }
    const pr = eo(t, F.TOTAL - 3.0, 0.3);
    if (pr > 0) {
      ctx.save(); ctx.globalAlpha = pr; ctx.fillStyle = 'rgba(9,10,13,0.75)'; ctx.fillRect(0, 930, W, 150);
      txt(ctx, 'تنطوي عقود الفروقات والمنتجات المشتقة خارج البورصة على مخاطر عالية قد تؤدي إلى خسارة رأس المال. المحتوى التعليمي والتحليلي لا يُعدّ نصيحة استثمارية.', 960, 990, { size: 22, w: 'R', color: C.white, align: 'center' });
      txt(ctx, 'قد لا يكون هذا المحتوى متاحاً في منطقتك. يُرجى الرجوع إلى شروط الخدمة.', 960, 1032, { size: 22, w: 'R', color: hexA(C.white, 0.8), align: 'center' });
      ctx.restore();
    }
  } });
})(typeof window !== 'undefined' ? window : globalThis);
