// Lesson 01 — What is Forex? Part 1: title · the question · FOREX = FOReign EXchange · swapping currencies · rates rise & fall · John's trip · 1,000 AUD · the exchange office · the pandemic.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT;
  const { W, H, C, clamp, lerp, inv, eo, ei, eio, hexA, txt, lat, measure, line } = A;
  const { w, we, wl, ph, sfx, ksfx, scene } = F;
  const SIL = C.silver, SUB = hexA(C.white, 0.72);

  // ---------------------------------------------------------------- chapters · music
  F.chapters.push(
    { t: F.OFF, label: 'ما هو الفوركس؟' }, { t: ph(2), label: 'سوق الصرف' }, { t: ph(7), label: 'قصة جون' }, { t: ph(16), label: 'الجائحة' },
    { t: ph(22), label: 'المفاجأة' }, { t: ph(31), label: 'الدرس المستفاد' }, { t: ph(35), label: 'ابدأ الآن' },
  );
  // bright travel-story groove: 104 BPM, C major (Cmaj7 · Am7 · Fmaj7 · G6), marimba plucks, broken beat, light swing
  F.STYLE = { bpm: 104, chords: [[36, [60, 64, 67, 71, 74]], [33, [57, 60, 64, 67, 72]], [41, [60, 65, 69, 72, 76]], [43, [59, 62, 64, 67, 71]]], kit: 'broken', pluck: 'mallet', swing: 0.12, bass: [0, 0, 1, 0, 0, 0, 1, 0], arp: [0, 2, 4, 2, 1, 3, 4, 3], padcut: 1900 };
  F.MUSIC = [
    { t: 0, lvl: 1 }, { t: F.OFF, lvl: 2 }, { t: ph(2) - 0.3, lvl: 3 }, { t: ph(7) - 0.3, lvl: 2 }, { t: ph(10) - 0.3, lvl: 3 },
    { t: ph(16) - 0.3, lvl: 1 }, { t: ph(19) - 0.3, lvl: 2 }, { t: ph(22) - 0.3, lvl: 4 }, { t: ph(26) - 0.3, lvl: 3 }, { t: ph(31) - 0.3, lvl: 2 },
    { t: ph(34) - 0.3, lvl: 3 }, { t: ph(35) - 0.2, lvl: 2 }, { t: ph(37) - 0.3, lvl: 3 }, { t: ph(41) - 0.3, lvl: 4 }, { t: F.CLOSE, lvl: 1 },
  ];

  // ---------------------------------------------------------------- lesson helpers
  // metal coin with a currency symbol
  function coin(ctx, x, y, r, sym, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(o.sx == null ? 1 : o.sx, 1); ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha);
    ctx.fillStyle = K.metal(ctx, -r, r); ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fill();
    ctx.strokeStyle = o.rim || C.ink; ctx.lineWidth = Math.max(2, r * 0.05); ctx.stroke(); ctx.lineWidth = Math.max(1.5, r * 0.03); ctx.beginPath(); ctx.arc(0, 0, r * 0.78, 0, 6.283); ctx.stroke();
    lat(ctx, sym, 0, r * 0.3, { size: r * (sym.length > 1 ? 0.62 : 0.86), w: 700, color: C.ink, align: 'center' });
    ctx.restore();
  }
  // odometer number (LTR digits roll vertically); v may be fractional while rolling
  function odometer(ctx, v, x, y, o = {}) {
    const size = o.size || 220, n = o.digits || 4, col = o.color || C.ink; const font = `${o.w || 300} ${size}px IN`;
    ctx.save(); ctx.font = font; const dw = ctx.measureText('0').width; const cw = ctx.measureText(',').width; ctx.restore();
    const commas = Math.floor((n - 1) / 3); const total = n * dw + commas * cw; let xr = (o.align === 'center' ? x + total / 2 : o.align === 'left' ? x + total : x);
    const hgt = size * 1.05; ctx.save(); ctx.beginPath(); ctx.rect(xr - total - 10, y - size * 0.92, total + 20, size * 1.08); ctx.clip(); ctx.fillStyle = col; ctx.font = font; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    for (let k = 0; k < n; k++) {
      if (k > 0 && k % 3 === 0) { xr -= cw; if (v >= Math.pow(10, k) - 0.5 || o.pad) ctx.fillText(',', xr, y); }
      xr -= dw; const colv = (Math.max(0, v) / Math.pow(10, k)) % 10; const d = Math.floor(colv); const f = o.snap ? 0 : colv - d;
      if (v < Math.pow(10, k) - 0.5 && k > 0 && !o.pad) continue;
      ctx.fillText(String(d), xr, y - f * hgt); ctx.fillText(String((d + 1) % 10), xr, y + (1 - f) * hgt);
    }
    ctx.restore(); return total;
  }
  // banknote stack
  function notes(ctx, x, y, s, n, p, col = C.ink) {
    for (let i = 0; i < n; i++) { const q = FX.springU(p - i * 0.06, 15, 0.5); if (q <= 0) continue; ctx.save(); ctx.translate(x + i * 6 * s, y - i * 10 * s - (1 - Math.min(1, q)) * 120); ctx.rotate(-0.05 + i * 0.02); ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = col; ctx.lineWidth = 2.4; A.roundRect(ctx, -90 * s, -46 * s, 180 * s, 92 * s, 8 * s); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 24 * s, 0, 6.283); ctx.stroke(); ctx.restore(); }
  }
  // simple person (head + shoulders), line style
  function person(ctx, x, y, s, col, p = 1) {
    if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s * Math.min(1.1, p), s * Math.min(1.1, p)); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, -46, 20, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.moveTo(-34, 14); ctx.quadraticCurveTo(-32, -20, 0, -20); ctx.quadraticCurveTo(32, -20, 34, 14); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  // plane glyph pointing along angle a
  function plane(ctx, x, y, s, a, col) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(s, s); ctx.fillStyle = col; ctx.beginPath();
    ctx.moveTo(26, 0); ctx.lineTo(8, -4); ctx.lineTo(-6, -22); ctx.lineTo(-12, -22); ctx.lineTo(-4, -4); ctx.lineTo(-16, -4); ctx.lineTo(-22, -11); ctx.lineTo(-26, -11); ctx.lineTo(-22, 0); ctx.lineTo(-26, 11); ctx.lineTo(-22, 11); ctx.lineTo(-16, 4); ctx.lineTo(-4, 4); ctx.lineTo(-12, 22); ctx.lineTo(-6, 22); ctx.lineTo(8, 4); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  F.L1 = { coin, odometer, notes, person, plane };

  // ================================================================ S1 — lesson title card (dark): currency symbols orbit the red dot
  const S1 = { t0: 2.05, t1: 5.66 };
  const SYMS = ['$', '€', '£', '¥', 'A$', '$', '€', '£', '¥', 'A$', '$', '€'];
  sfx(2.1, 'whoosh', 0.16, { d: 0.6 }); SYMS.forEach((s, i) => { if (i % 3 === 0) sfx(2.2 + i * 0.06, 'pop', 0.08, { f: 700 + i * 40, pan: (i % 2 ? 0.4 : -0.4) }); });
  sfx(2.62, 'slam', 0.22); sfx(3.15, 'pop', 0.18, { f: 760 });
  scene({ name: 'title', t0: S1.t0, t1: S1.t1, ink: 'dark', enter: { type: 'bars', dur: 0.47 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    const cx = 960, cy = 520;
    SYMS.forEach((s, i) => {
      const r = A.rng(50 + i * 7); r(); const R = 230 + 140 * r(), sp = (0.35 + 0.4 * r()) * (i % 2 ? 1 : -1), ph0 = r() * 6.283, tilt = 0.42 + 0.2 * r();
      const app = FX.springU(t - (2.2 + i * 0.06), 13, 0.5); if (app <= 0) return; const a = ph0 + t * sp; const x = cx + Math.cos(a) * R * Math.min(1, app), y = cy + Math.sin(a) * R * tilt * Math.min(1, app);
      const depth = 0.55 + 0.45 * (Math.sin(a) + 1) / 2; lat(ctx, s, x, y + 14, { size: 40 * depth, w: 700, color: i % 4 === 0 ? C.red : C.white, align: 'center', alpha: clamp((t - 2.2 - i * 0.06) * 5) * (0.35 + 0.65 * depth) });
    });
    const hp = FX.springU(t - 2.62, 14, 0.5);
    if (hp > 0) { ctx.save(); ctx.translate(cx, cy + 60); const s = lerp(1.9, 1, Math.min(1, hp)); ctx.scale(s, s); lat(ctx, '01', 0, 0, { size: 240, w: 300, color: C.white, align: 'center', track: -6, alpha: clamp((t - 2.62) * 6) }); ctx.restore(); }
    FX.kword(ctx, 'الدرس الأول', 960 + FX.kwidth('الدرس الأول', 60, 'S') / 2, cy + 150, { size: 60, w: 'S', color: SUB, lt: t - 3.1, mode: 'rise' });
    K.dot(ctx, cx + 150, cy + 38, 20, t - 3.3, { h0: 300 });
  } });

  // ================================================================ S2 — «إذن ما هو الفوركس بالتحديد؟» · FOREX = FOReign EXchange (light)
  const S2 = { t0: S1.t1, t1: 12.75 };
  const MV = w(2, 0) + 0.15, COL = we(2, 5) + 0.15; // headline moves up; acronym collapses
  sfx(S2.t0 - 0.42, 'ripple', 0.2); ksfx(w(1, 2), 'drop', 0.24); ksfx(we(1, 3) - 0.1, 'bounce', 0.2, 600);
  sfx(w(2, 2), 'type', 0.1, { d: 0.6, n: 8 }); ksfx(w(2, 3), 'drop', 0.16); sfx(COL, 'whoosh', 0.16, { d: 0.35 }); sfx(COL + 0.35, 'snap', 0.2);
  scene({ name: 'question', t0: S2.t0, t1: S2.t1, ink: 'light', enter: { type: 'ripple', dur: 0.42, x: 960, y: 520 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    K.cap(ctx, wl(0).concat(wl(1, 0, 1)), 300, t, { size: 62, out: K.outAt(t, MV - 0.2) });
    // «الفوركس» + red «؟», then it lifts to make room for the acronym
    const m = eio(t, MV, 0.6); const ww = FX.kwidth('الفوركس', 250), qw = FX.kwidth('؟', 250); const right = 960 + (ww + qw + 20) / 2;
    ctx.save(); ctx.translate(960, lerp(620, 380, m)); ctx.scale(lerp(1, 0.62, m), lerp(1, 0.62, m)); ctx.translate(-960, 0);
    FX.kword(ctx, 'الفوركس', right, 0, { size: 250, color: C.ink, lt: t - w(1, 2), mode: 'drop', stagger: 0.05 });
    FX.kword(ctx, '؟', right - ww - 20, 0, { size: 250, color: C.red, lt: t - (we(1, 3) - 0.1), mode: 'bounce', out: K.outAt(t, MV, 0.3) });
    ctx.restore();
    FX.note(ctx, 'بالتحديد', right - ww - 140, lerp(470, 280, m), { p: inv(w(1, 3), w(1, 3) + 0.6, t) * (1 - m), size: 30, color: C.slate, t });
    // FOReign EXchange → FOREX
    const ap = eo(t, w(2, 2), 0.5);
    if (ap > 0) {
      const parts = [['FOR', C.red], ['eign ', C.ink], ['EX', C.red], ['change', C.ink]]; const sz = 120; const c = eio(t, COL, 0.55);
      ctx.save(); ctx.font = `700 ${sz}px IN`; const ws = parts.map(([s]) => ctx.measureText(s).width); ctx.restore();
      const keep = [1, 1 - c, 1, 1 - c]; const tot = ws.reduce((s, v, i) => s + v * keep[i], 0); let x = 960 - tot / 2;
      parts.forEach(([s, col], i) => { const k = keep[i]; if (k > 0.01) { ctx.save(); ctx.beginPath(); ctx.rect(x, 520, ws[i] * k + 2, 160); ctx.clip(); lat(ctx, s, x, 640, { size: sz, w: 700, color: col, alpha: ap * (col === C.ink ? 1 - c * 0.5 : 1), track: -1 }); ctx.restore(); } x += ws[i] * k; });
      if (c >= 1) K.under(ctx, 960 + tot / 2, 960 - tot / 2, 676, inv(COL + 0.5, COL + 0.9, t), { t, color: C.red });
    }
    K.head(ctx, wl(2, 3, 5), 820, t, { size: 84, color: C.ink, stagger: 0.03, mode: 'drop' });
    K.cap(ctx, wl(2, 6, 7), 905, t, { size: 40, color: C.slate });
  } });

  // ================================================================ S3 — the means to exchange one currency for another (dark): coins swap
  const S3 = { t0: S2.t1, t1: 16.45 };
  const SW = w(3, 4) - 0.1;
  sfx(S3.t0 - 0.42, 'whip', 0.2); F.SHUTTER.push([S3.t0 - 0.42, S3.t0, 1.6 / 60]);
  sfx(S3.t0 + 0.2, 'pop', 0.16, { f: 820, pan: 0.4 }); sfx(S3.t0 + 0.35, 'pop', 0.16, { f: 680, pan: -0.4 }); sfx(SW, 'whoosh', 0.2, { d: 0.6 }); sfx(SW + 0.62, 'chime', 0.14);
  scene({ name: 'swap', t0: S3.t0, t1: S3.t1, ink: 'dark', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    K.cap(ctx, wl(3, 0, 2), 250, t, { color: SUB, size: 58 });
    const e = eio(t, SW, 0.7); const xA = lerp(1260, 660, e), xB = lerp(660, 1260, e); const yA = 560 - Math.sin(e * Math.PI) * 150, yB = 560 + Math.sin(e * Math.PI) * 150;
    // swap arrows (dashed circle halves)
    const ar = eo(t, SW - 0.3, 0.4);
    if (ar > 0) { ctx.save(); ctx.globalAlpha = ar * 0.7; ctx.strokeStyle = SIL; ctx.lineWidth = 2.4; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.ellipse(960, 560, 300, 150, 0, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke(); ctx.beginPath(); ctx.ellipse(960, 560, 300, 150, 0, Math.PI * 0.08, Math.PI * 0.92); ctx.stroke(); ctx.restore(); }
    const pa = FX.springU(t - (S3.t0 + 0.2), 14, 0.5), pb = FX.springU(t - (S3.t0 + 0.35), 14, 0.5);
    for (let g = 4; g >= 1; g--) { const eg = eio(t - g * 0.035, SW, 0.7); if (eg <= 0 || eg >= 1) continue; coin(ctx, lerp(1260, 660, eg), 560 - Math.sin(eg * Math.PI) * 150, 110, '€', { alpha: 0.12 * (5 - g) }); coin(ctx, lerp(660, 1260, eg), 560 + Math.sin(eg * Math.PI) * 150, 110, '$', { alpha: 0.12 * (5 - g) }); }
    if (pa > 0) coin(ctx, xA, yA, 110 * Math.min(1.08, pa), '€');
    if (pb > 0) coin(ctx, xB, yB, 110 * Math.min(1.08, pb), '$');
    K.head(ctx, wl(3, 3, 6, { map: { 4: { color: C.red } } }), 880, t, { size: 76, color: C.white, stagger: 0.03 });
  } });

  // ================================================================ S4 — rates change constantly: a see-saw of strength (light)
  const S4 = { t0: S3.t1, t1: 23.4 };
  const KEYS4 = [[w(4, 3), 0.12], [w(4, 3) + 0.45, -0.1], [w(5, 1), 0.2], [w(6, 1), -0.22], [we(6, 3), 0.04]];
  const ang = (t) => K.springs(t, 0, KEYS4, 9, 0.35);
  sfx(S4.t0 - 0.45, 'shutter', 0.18); KEYS4.forEach(([tk], i) => sfx(tk, i % 2 ? 'whoosh' : 'whoosh', 0.1, { d: 0.3, up: i % 2 === 0, pan: i % 2 ? -0.4 : 0.4 }));
  sfx(w(5, 1) + 0.1, 'tick', 0.12, { f: 3200, pan: 0.5 }); sfx(w(6, 1) + 0.1, 'buzz', 0.08, { pan: -0.5 });
  scene({ name: 'seesaw', t0: S4.t0, t1: S4.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    K.cap(ctx, wl(4, 0, 3, { map: { 1: { color: C.ink, w: 'B' }, 2: { color: C.ink, w: 'B' } } }), 250, t, { size: 60 });
    const a = ang(t); const cx = 960, cy = 690, L = 520;
    // live rate
    const tq = Math.floor(t * 12) / 12; const rate = 1.0842 + ang(tq) * 0.06 + Math.sin(tq * 7) * 0.0004 * eo(t, S4.t0, 0.5);
    K.chip(ctx, 'EUR/USD', 960, 350, { p: eo(t, S4.t0, 0.4), align: 'center', size: 22, stroke: hexA(C.slate, 0.6), color: C.charcoal });
    lat(ctx, rate.toFixed(4), 960, 480, { size: 110, w: 300, color: C.ink, align: 'center', track: -2, alpha: eo(t, S4.t0 + 0.1, 0.4) });
    // fulcrum + beam
    ctx.save(); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 46, cy + 120); ctx.lineTo(cx + 46, cy + 120); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-a); ctx.fillStyle = C.ink; ctx.fillRect(-L, -7, 2 * L, 14); ctx.restore();
    const ex = (sgn) => [cx + sgn * Math.cos(a) * (L - 60), cy - sgn * Math.sin(a) * (L - 60)];
    const [rx, ry] = ex(1), [lx, ly] = ex(-1); coin(ctx, rx, ry - 96, 86, '€'); coin(ctx, lx, ly - 96, 86, '$');
    // strength arrows
    const up = eo(t, w(5, 1), 0.3) * (1 - eo(t, w(6, 1) - 0.1, 0.3)), dn = eo(t, w(6, 1), 0.3);
    if (up > 0) { ctx.save(); ctx.globalAlpha = up; ctx.fillStyle = C.mint; ctx.beginPath(); ctx.moveTo(rx + 150, ry - 190); ctx.lineTo(rx + 124, ry - 150); ctx.lineTo(rx + 176, ry - 150); ctx.closePath(); ctx.fill(); ctx.fillRect(rx + 143, ry - 150, 14, 70); ctx.restore(); }
    if (dn > 0) { ctx.save(); ctx.globalAlpha = dn; ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(rx + 150, ry - 10); ctx.lineTo(rx + 124, ry - 50); ctx.lineTo(rx + 176, ry - 50); ctx.closePath(); ctx.fill(); ctx.fillRect(rx + 143, ry - 120, 14, 70); ctx.restore(); }
    FX.kword(ctx, 'ترتفع', 1780, 860, { size: 64, w: 'B', color: C.ink, lt: t - w(5, 1), mode: 'bounce', out: K.outAt(t, w(6, 0) - 0.2, 0.3) });
    FX.kword(ctx, 'تنخفض', 1780, 860, { size: 64, w: 'B', color: C.red, lt: t - w(6, 1), mode: 'drop' });
    K.cap(ctx, wl(5, 2, 4), 860, t, { size: 46, x: 1560, out: K.outAt(t, w(6, 0) - 0.2, 0.3) });
    K.cap(ctx, wl(6, 2, 3), 860, t, { size: 46, x: 1540 });
  } });

  // ================================================================ S5 — John lives in Australia, plans a holiday in the US (dark map)
  const S5 = { t0: S4.t1, t1: 30.72 };
  const AU = { u: 560, v: 220 }, US = { u: -600, v: -260 };
  const FLY0 = w(9, 3) - 0.1, FLY1 = we(9, 6);
  sfx(S5.t0 - 0.45, 'shutter', 0.2); sfx(S5.t0 + 0.1, 'whoosh', 0.14, { d: 0.9, up: false }); sfx(w(8, 2) + 0.1, 'pop', 0.2, { f: 820, pan: 0.4 });
  sfx(w(8, 5), 'pop', 0.14, { f: 700, pan: 0.4 }); sfx(w(9, 5), 'pop', 0.14, { f: 600, pan: -0.4 }); sfx(FLY0, 'whoosh', 0.18, { d: 1.6, up: true });
  scene({ name: 'johnmap', t0: S5.t0, t1: S5.t1, ink: 'dark', enter: { type: 'bars', dur: 0.5 }, draw(ctx, t) {
    FX.bg(ctx, 'dark', { dots: false });
    const tilt = lerp(0, 0.95, eio(t, S5.t0 + 0.05, 1.0)); const P = K.plane({ cx: 960, cy: 620, f: 1500, tilt, rot: lerp(-0.08, 0.1, inv(S5.t0, S5.t1, t)), scale: lerp(0.85, 1, eio(t, S5.t0, 1.2)) });
    K.planeDots(ctx, P, [-1150, 1150, -700, 600], 50, { alpha: 0.2, r: 2.3 });
    const pin = (q, lab, tok, tp) => {
      const p = FX.springU(t - tp, 14, 0.5); if (p <= 0) return; const [x, y, k] = P(q.u, q.v); const [x2, y2] = P(q.u, q.v, 110 * Math.min(1, p));
      ctx.save(); ctx.strokeStyle = hexA(C.white, 0.5); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2 + 20); ctx.stroke(); ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(x, y, 7 * k, 0, 6.283); ctx.fill(); ctx.restore();
      K.chip(ctx, lab, x2, y2, { p: Math.min(1, p), align: 'center', size: 26, fill: 'rgba(20,22,26,0.88)', stroke: hexA(C.white, 0.4), color: C.white, w: 'S' });
      K.chip(ctx, tok, x2, y2 + 52, { p: eo(t, tp + 0.3, 0.3), align: 'center', size: 18, fill: 'rgba(20,22,26,0.88)', stroke: hexA(C.white, 0.25), color: SIL });
    };
    pin(AU, 'أستراليا', 'AUD', w(8, 5)); pin(US, 'الولايات المتحدة', 'USD', w(9, 5));
    // John
    const [jx, jy, jk] = P(AU.u + 70, AU.v + 60); person(ctx, jx, jy, 0.9 * jk, C.red, FX.springU(t - w(8, 2), 14, 0.5)); K.chip(ctx, 'جون', jx, jy + 44, { p: eo(t, w(8, 2) + 0.2, 0.3), align: 'center', size: 22, fill: C.red, stroke: C.red, color: C.white, w: 'S' });
    // flight arc above the plane
    const fp = eio(t, FLY0, FLY1 - FLY0); if (fp > 0) {
      const pts = []; for (let i = 0; i <= 60; i++) { const q = i / 60; const [x, y] = P(lerp(AU.u, US.u, q), lerp(AU.v, US.v, q), Math.sin(q * Math.PI) * 260); pts.push([x, y]); }
      const sub = A.subPath(pts, 0, fp); ctx.save(); ctx.setLineDash([12, 10]); ctx.strokeStyle = C.white; ctx.lineWidth = 2.6; A.tracePts(ctx, sub); ctx.stroke(); ctx.restore();
      const e = sub[sub.length - 1], b = sub[Math.max(0, sub.length - 3)]; if (fp < 1) plane(ctx, e[0], e[1], 1.3, Math.atan2(e[1] - b[1], e[0] - b[0]), C.white);
    }
    K.cap(ctx, wl(7), 250, t, { color: SUB, out: K.outAt(t, w(8, 0) - 0.25) });
    K.cap(ctx, wl(8), 250, t, { color: SUB, out: K.outAt(t, w(9, 0) - 0.25), map: null });
    K.cap(ctx, wl(9, 0, 6, { map: { 3: { color: C.white, w: 'B' } } }), 250, t, { color: SUB });
  } });

  // ================================================================ S6 — 1,000 AUD spending money → needs USD before leaving (light)
  const S6 = { t0: S5.t1, t1: 39.62 };
  const C0 = w(10, 2) - 0.1;
  sfx(S6.t0 - 0.45, 'shutter', 0.18); sfx(C0, 'type', 0.12, { d: 0.7, n: 9 }); sfx(C0 + 0.75, 'slam', 0.2); sfx(w(10, 4) + 0.1, 'pop', 0.14, { f: 600 });
  sfx(w(11, 2), 'whoosh', 0.16, { d: 0.5, pan: -0.4 }); sfx(w(11, 4) + 0.1, 'pop', 0.16, { f: 820, pan: -0.5 }); sfx(w(12, 1), 'tick', 0.1);
  scene({ name: 'aud1000', t0: S6.t0, t1: S6.t1, ink: 'light', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'light');
    K.cap(ctx, wl(10, 0, 1).concat(wl(10, 5, 6)), 250, t, { out: K.outAt(t, w(11, 0) - 0.25) });
    K.cap(ctx, wl(11, 0, 2), 250, t, { out: K.outAt(t, w(12, 0) - 0.25) });
    K.cap(ctx, wl(12), 250, t, { color: C.ink, w: 'S' });
    const v = 1000 * eio(t, C0, 0.75); const sh = eio(t, w(11, 1), 0.6);
    const x0 = lerp(960, 1290, sh);
    if (t > C0 - 0.05) { odometer(ctx, v, x0, 600, { size: 210, digits: 4, align: 'center' }); K.chip(ctx, 'AUD', x0, 700, { p: eo(t, w(10, 4), 0.35), align: 'center', size: 30, fill: C.ink, stroke: C.ink, color: C.white }); }
    notes(ctx, x0 + 300, 360, 0.6, 3, t - (C0 + 0.3));
    FX.note(ctx, 'مصروف شخصي', x0 + 120, 790, { p: inv(w(10, 5), w(10, 5) + 0.7, t), size: 32, color: C.slate, align: 'center', t });
    // → USD ?
    if (sh > 0) {
      K.arrowH(ctx, 1000, 820, 560, eo(t, w(11, 2), 0.5), { color: C.slate, width: 5 });
      ctx.save(); ctx.globalAlpha = eo(t, w(11, 3), 0.4); ctx.setLineDash([12, 9]); ctx.strokeStyle = C.slate; ctx.lineWidth = 2.4; A.roundRect(ctx, 330, 430, 420, 230, 22); ctx.stroke(); ctx.restore();
      FX.kword(ctx, '؟', 540 + FX.kwidth('؟', 170) / 2, 610, { size: 170, color: C.red, lt: t - (w(11, 4) + 0.1), mode: 'bounce' });
      K.chip(ctx, 'USD', 540, 700, { p: eo(t, w(11, 4), 0.35), align: 'center', size: 30, fill: '#FFFFFF', stroke: C.ink, color: C.ink });
    }
    if (t > w(12, 1)) { const pp = eio(t, w(12, 1), 1.2); plane(ctx, lerp(400, 1500, pp), lerp(860, 800, pp) - Math.sin(pp * 3) * 10, 1.2, -0.06, hexA(C.ink, 0.85)); }
  } });

  // ================================================================ S7 — the exchange office: 1,000 AUD → 700 USD (dark)
  const S7 = { t0: S6.t1, t1: 47.2 };
  const CV0 = w(14, 1), CV1 = w(15, 1) + 0.3; const RATES = [['AUD/USD', '0.7000'], ['EUR/USD', '1.0842'], ['GBP/USD', '1.2650']];
  sfx(S7.t0 - 0.42, 'whip', 0.2); F.SHUTTER.push([S7.t0 - 0.42, S7.t0, 1.6 / 60]);
  RATES.forEach((r, i) => sfx(w(13, 2) + i * 0.15, 'tick', 0.1, { f: 2600 + i * 200 })); sfx(CV0, 'type', 0.14, { d: CV1 - CV0, n: 14 }); sfx(CV1, 'slam', 0.22); sfx(CV1 + 0.1, 'chime', 0.12);
  scene({ name: 'office', t0: S7.t0, t1: S7.t1, ink: 'dark', enter: { type: 'whip', dur: 0.42, dir: 1 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    K.cap(ctx, wl(13), 230, t, { color: SUB });
    // rates board
    const bp = eo(t, w(13, 2) - 0.2, 0.5);
    if (bp > 0) {
      const x = 1180, y = 330; const yy = K.card(ctx, x, y, 560, 300, { p: bp, dark: true, chamfer: 36 });
      txt(ctx, 'مكتب صرافة', x + 520, yy + 58, { size: 30, w: 'B', color: C.white });
      RATES.forEach(([pair, v], i) => { const rp = eo(t, w(13, 2) + i * 0.15, 0.3); const ry = yy + 126 + i * 58; if (i === 0) { ctx.save(); ctx.globalAlpha = rp * 0.18; ctx.fillStyle = C.red; ctx.fillRect(x + 16, ry - 38, 528, 54); ctx.restore(); } lat(ctx, pair, x + 520, ry, { size: 26, w: 600, color: SUB, align: 'right', alpha: rp }); lat(ctx, v, x + 40, ry, { size: 30, w: 700, color: C.white, alpha: rp }); });
    }
    // conversion: odometer rolls from 1,000 (AUD) to 700 (USD)
    const cp = eio(t, CV0, CV1 - CV0); const v = lerp(1000, 700, cp); const flip = cp > 0.5;
    if (t > w(14, 0) - 0.2) {
      odometer(ctx, v, 620, 600, { size: 220, digits: 4, align: 'center', color: C.white });
      const fl = Math.abs(Math.cos(clamp((cp - 0.35) / 0.3) * Math.PI));
      ctx.save(); ctx.translate(620, 712); ctx.scale(1, cp > 0.35 && cp < 0.65 ? fl : 1); K.chip(ctx, flip ? 'USD' : 'AUD', 0, 0, { p: 1, align: 'center', size: 32, fill: flip ? C.white : C.ink, stroke: C.white, color: flip ? C.ink : C.white }); ctx.restore();
      K.chip(ctx, '× 0.70', 620, 800, { p: eo(t, CV0 + 0.2, 0.3), align: 'center', size: 22, stroke: hexA(C.white, 0.4), color: SIL });
    }
    K.cap(ctx, wl(14).concat(wl(15)), 900, t, { color: SUB, size: 50 });
  } });

  // ================================================================ S8 — a sudden pandemic cancels every flight (dark): split-flap departures board
  const S8 = { t0: S7.t1, t1: 55.62 };
  const FLIGHTS = [['AX 101', 'LAX'], ['AX 205', 'JFK'], ['AX 317', 'SFO'], ['AX 422', 'ORD']];
  const CANCEL = w(17, 4); const XT = w(18, 3);
  sfx(S8.t0 - 0.45, 'shutter', 0.2); ksfx(w(17, 1), 'drop', 0.2); FLIGHTS.forEach((f, i) => { sfx(CANCEL + i * 0.22, 'type', 0.1, { d: 0.25, n: 5 }); sfx(CANCEL + i * 0.22 + 0.25, 'buzz', 0.06); });
  sfx(XT, 'slam', 0.18); sfx(XT + 0.05, 'buzz', 0.1);
  scene({ name: 'pandemic', t0: S8.t0, t1: S8.t1, ink: 'dark', enter: { type: 'bars', dur: 0.45 }, draw(ctx, t) {
    FX.bg(ctx, 'dark');
    K.cap(ctx, wl(16), 230, t, { color: SUB, out: K.outAt(t, w(17, 0) - 0.25) });
    K.head(ctx, wl(17, 1, 2, { map: { 1: { color: C.red } } }), 260, t, { size: 110, color: C.white, out: K.outAt(t, w(18, 0) - 0.2) });
    // board
    const bo = eo(t, w(17, 2), 0.5) * (1 - eio(t, XT - 0.6, 0.5));
    if (bo > 0) {
      const x = 380, y = 380, bw = 1160, rh = 92; ctx.save(); ctx.globalAlpha = bo;
      ctx.fillStyle = '#121316'; ctx.fillRect(x, y, bw, rh * (FLIGHTS.length + 1)); ctx.strokeStyle = hexA(C.white, 0.15); ctx.strokeRect(x, y, bw, rh * (FLIGHTS.length + 1));
      txt(ctx, 'المغادرة', x + bw - 30, y + 58, { size: 30, w: 'B', color: C.white }); lat(ctx, 'FLIGHT', x + 40, y + 56, { size: 20, w: 700, color: SIL, track: 3 }); lat(ctx, 'TO', x + 360, y + 56, { size: 20, w: 700, color: SIL, track: 3 });
      FLIGHTS.forEach(([fn, to], i) => {
        const ry = y + rh * (i + 1); ctx.fillStyle = hexA(C.white, 0.05); ctx.fillRect(x + 8, ry + 8, bw - 16, rh - 12);
        lat(ctx, fn, x + 40, ry + 62, { size: 34, w: 700, color: C.white }); lat(ctx, to, x + 360, ry + 62, { size: 34, w: 700, color: C.white });
        const ft = CANCEL + i * 0.22; const fp = clamp((t - ft) / 0.25); const done = t > ft + 0.25; const sx = Math.abs(Math.cos(fp * Math.PI));
        ctx.save(); ctx.translate(x + bw - 200, ry + rh / 2 + 2); ctx.scale(1, fp > 0 && fp < 1 ? Math.max(0.05, sx) : 1);
        const red = fp >= 0.5; ctx.fillStyle = red ? C.red : '#1E2024'; ctx.fillRect(-160, -32, 320, 64); txt(ctx, red ? 'ملغاة' : 'في الموعد', 0, 12, { size: 32, w: 'B', color: C.white, align: 'center' }); ctx.restore();
        void done;
      });
      ctx.restore();
    }
    // no travel: plane crossed out
    const xp = FX.springU(t - (XT - 0.35), 13, 0.5);
    if (xp > 0) { plane(ctx, 960, 600, 4 * Math.min(1.08, xp), -0.15, C.white); FX.cross(ctx, 960, 600, 300, inv(XT, XT + 0.35, t), C.red, t); }
    K.cap(ctx, wl(18), 880, t, { color: SUB, size: 54 });
  } });
})(typeof window !== 'undefined' ? window : globalThis);
