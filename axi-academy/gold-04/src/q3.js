// Gold 04 · part 3 — the one-word-per-screen montage (four common mistakes), the series finale (four lessons ✓ 100%),
// the free guide + the readiness ring, the leverage reminder, the farewell (next series teaser), the recap montage that
// collapses into the red caret → the close. Music: 124 BPM, A minor (Am9 · Fmaj9 · Cadd9 · G6), glass plucks, stabs.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, Q = G.SAAS;
  const { W, H, C, clamp, lerp, hexA, txt, lat, measure } = A;
  const { P, E, EI, EIO, sp, xo, xi, outP, wheels, wheelSeq, panel, cap, frameUI } = Q;
  const w = F.w, sfx = F.sfx, wl = F.wl;
  const INK = '#090A0D';

  // ---------------------------------------------------------------- fields
  function field(ctx, kind) {
    if (kind === 'paper') { ctx.fillStyle = P.paper; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = 'rgba(9,10,13,0.05)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = 0; x <= W; x += 80) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); } for (let y = 0; y <= H; y += 80) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); } ctx.stroke(); }
    else if (kind === 'gold') { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#EDBE5B'); g.addColorStop(1, '#C98F25'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    else if (kind === 'black') { ctx.fillStyle = '#050506'; ctx.fillRect(0, 0, W, H); }
    else if (kind === 'slate') { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#6E8992'); g.addColorStop(1, '#33444A'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    else Q.bg(ctx);
  }
  const inkOf = (kind) => (kind === 'paper' || kind === 'gold' ? INK : '#FFFFFF');
  // headline that slams in from the right (RTL) — the shutter blur does the streak
  function slamText(ctx, s, x, y, size, t, t0, o = {}) {
    if (t < t0 - 0.02) return; const k = xo(clamp((t - t0) / (o.d || 0.32))); const dx = (1 - k) * (o.dist || 520);
    ctx.save(); ctx.translate(dx, 0); ctx.globalAlpha *= clamp((t - t0) / 0.08 + 0.2);
    if (o.outline) { ctx.font = A.font(size, o.w || 'S'); ctx.direction = 'rtl'; ctx.textAlign = o.align || 'center'; ctx.lineWidth = o.lw || 3; ctx.strokeStyle = o.color || '#FFFFFF'; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); }
    else txt(ctx, s, x, y, { size, w: o.w || 'S', color: o.color || '#FFFFFF', align: o.align || 'center' });
    ctx.restore();
  }

  // ================================================================ I · the montage: four common mistakes
  const TI = { in: w(88, 0), four: w(89, 0), mist: w(89, 1), m1: w(90, 0), mix: w(91, 0), units: w(91, 1), oz: w(92, 0), g: w(92, 1), mq: w(92, 2),
    m2: w(93, 0), forget: w(94, 0), size: w(94, 1), move: w(95, 1), one: w(95, 3), eq: w(96, 0), hund: w(96, 2), lot: w(96, 5), many: w(97, 1),
    m3: w(98, 0), belief: w(99, 0), haven: w(99, 2), means: w(100, 0), fall: w(100, 4), m4: w(101, 0), guar: w(102, 3), bars: w(102, 7), less: w(102, 9), because: w(103, 0), signs: w(103, 3), fraud: w(103, 4) };
  const TJ = { in: w(104, 0), done: w(104, 2), series: w(104, 3), how: w(104, 4), goldW: w(104, 6), from: w(104, 7), axi: w(104, 9),
    now: w(105, 0), read: w(106, 0), guide: w(106, 1), free: w(106, 2), full: w(106, 3), under: w(106, 5), answer: w(107, 0), allQ: w(107, 2), qs: w(107, 3), qEnd: w(107, 5), test: w(108, 1), ready: w(108, 3),
    rem: w(109, 0), trading: w(110, 0), lev: w(110, 1), risk: w(110, 4), may: w(111, 0), part: w(111, 2), cap: w(111, 4), all: w(112, 1),
    bye1: w(113, 0), succ: w(113, 4), see: w(114, 0), soon: w(114, 1), ser2: w(114, 2), newS: w(114, 3), pro: w(114, 4), acad: w(114, 6), axi2: w(114, 7), insh: w(115, 0),
    bye2: w(116, 0), tw: w(116, 3), see2: w(117, 0), ser3: w(117, 2), pro2: w(117, 4), insh2: w(118, 0) };
  const SCR = [{ t0: TI.in, kind: 'intro' }, { t0: TI.m1, kind: 'paper', id: 1 }, { t0: TI.m2, kind: 'gold', id: 2 }, { t0: TI.m3, kind: 'black', id: 3 }, { t0: TI.m4, kind: 'slate', id: 4 }];
  SCR.forEach((s, i) => { s.t1 = i < SCR.length - 1 ? SCR[i + 1].t0 : TJ.in; });
  const SQ = (() => { const r = A.rng(31337); return Array.from({ length: 24 * 14 }, () => ({ p: r(), s: r() })); })();
  sfx(TI.in - 0.1, 'whoosh', 0.16, { d: 0.4 }); sfx(TI.four - 0.02, 'slam', 0.22); sfx(TI.mist, 'whoosh', 0.1, { d: 0.25 });
  [TI.m1, TI.m2, TI.m3, TI.m4].forEach((tt) => { sfx(tt - 0.03, 'whip', 0.2); sfx(tt + 0.02, 'snap', 0.14); });
  sfx(TI.mix, 'whoosh', 0.12, { d: 0.3 }); [TI.oz, TI.g, TI.mq].forEach((tt, i) => sfx(tt + 0.02, 'pop', 0.16, { f: 700 + i * 110 })); sfx(TI.mq + 0.42, 'spin', 0.12);
  sfx(TI.size - 0.02, 'whoosh', 0.12, { d: 0.3 }); sfx(TI.one, 'pop', 0.16, { f: 760 }); sfx(TI.hund - 0.08, 'type', 0.12, { d: 0.45, n: 7 }); sfx(TI.hund + 0.4, 'chime', 0.12); sfx(TI.many, 'pop', 0.12, { f: 900 });
  sfx(TI.haven - 0.02, 'whoosh', 0.12, { d: 0.3 }); sfx(TI.means, 'pop', 0.14, { f: 640 }); sfx(TI.fall - 0.25, 'stretch', 0.12);
  sfx(TI.guar - 0.02, 'whoosh', 0.12, { d: 0.3 }); sfx(TI.bars, 'pop', 0.14, { f: 700 }); sfx(TI.because, 'scribble', 0.1, { d: 0.35 }); sfx(TI.signs - 0.02, 'slam', 0.2); sfx(TI.fraud, 'buzz', 0.08);

  const LIGHT = { paper: true, gold: true };
  Q.scn({ t0: TI.in, t1: TJ.in + 0.05, light: true, lightAt: (t) => { const s = SCR.find((x) => t >= x.t0 && t < x.t1); return !!(s && LIGHT[s.kind]); }, draw(ctx, t) {
    const s = SCR.find((x) => t >= x.t0 && t < x.t1) || SCR[SCR.length - 1]; const lt = t - s.t0, ink = inkOf(s.kind);
    field(ctx, s.kind === 'intro' ? 'dark' : s.kind);
    if (s.kind === 'intro') {
      for (let i = 0; i < SQ.length; i++) { const q = SQ[i]; const on = Math.sin((t * 2.2 + q.p * 9) * Math.PI) > 0.55 + 0.4 * q.s; if (!on) continue; const cx = (i % 24) * 80, cy = Math.floor(i / 24) * 80; ctx.fillStyle = hexA(P.gold, 0.06 + 0.1 * q.s); ctx.fillRect(cx + 6, cy + 6, 68, 68); }
      cap(ctx, 'قبل الختام', 960, 330, { size: 30, color: P.dim, alpha: clamp(lt / 0.3) });
      const k = sp(t, TI.four, 12, 0.6); if (k > 0) { ctx.save(); ctx.translate(1180, 610); ctx.scale(Math.min(1.08, k), Math.min(1.08, k)); lat(ctx, '4', 0, 0, { size: 300, w: 800, color: P.gold, align: 'center' }); ctx.restore(); }
      slamText(ctx, 'أخطاء', 1000, 540, 120, t, TI.mist, { align: 'right' }); slamText(ctx, 'شائعة', 1000, 680, 120, t, TI.mist + 0.25, { align: 'right', color: P.dim });
      return;
    }
    frameUI(ctx, s.id, 4, 'أخطاء شائعة', ink, clamp(lt / (s.t1 - s.t0)));
    slamText(ctx, ['', 'الأول', 'الثاني', 'الثالث', 'الرابع'][s.id], 960, 250, 46, t, s.t0 + 0.02, { color: hexA(ink === INK ? '#090A0D' : '#FFFFFF', 0.55), dist: 200 });
    if (s.id === 1) {
      slamText(ctx, 'خلط الوحدات.', 960, 470, 150, t, TI.mix, { color: ink });
      const U = [['أونصة', TI.oz], ['غرام', TI.g], ['مثقال', TI.mq]]; const X = [1290, 960, 630];
      const mixK = EIO(t, TI.mq + 0.42, 0.5), mix2 = EIO(t, TI.mq + 0.95, 0.4); const perm = [[0, 1, 2], [2, 0, 1], [1, 2, 0]];
      U.forEach(([u, tt], i) => { const k = sp(t, tt, 15, 0.62); if (k <= 0) return; const x = lerp(lerp(X[perm[0][i]], X[perm[1][i]], mixK), X[perm[2][i]], mix2); const y = 700 + Math.sin(Math.PI * mixK) * (i - 1) * 60 + Math.sin(Math.PI * mix2) * (1 - i) * 50; ctx.save(); ctx.translate(x, y); ctx.scale(Math.min(1, k), Math.min(1, k)); const ww = measure(ctx, u, 48, 'S') + 80; A.roundRect(ctx, -ww / 2, -48, ww, 96, 48); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(); txt(ctx, u, 0, 16, { size: 48, w: 'S', color: INK, align: 'center' }); ctx.restore(); });
      const ne = clamp((t - TI.mq - 0.2) / 0.2) * (1 - clamp((t - TI.mq - 0.4) / 0.1)); if (ne > 0) { lat(ctx, '≠', 1125, 718, { size: 56, w: 700, color: INK, align: 'center', alpha: ne }); lat(ctx, '≠', 795, 718, { size: 56, w: 700, color: INK, align: 'center', alpha: ne }); }
    } else if (s.id === 2) {
      slamText(ctx, 'حجم العقد.', 960, 430, 150, t, TI.size - 0.05, { color: ink });
      const k1 = sp(t, TI.move, 14, 0.66);
      if (k1 > 0) { ctx.save(); ctx.globalAlpha *= clamp(k1 * 2); txt(ctx, 'حركة', 1500, 668, { size: 56, w: 'S', color: INK }); lat(ctx, '$1', 1500 - measure(ctx, 'حركة ', 56, 'S'), 676, { size: 96, w: 800, color: INK, align: 'right' }); txt(ctx, 'بسعر الأونصة', 1500, 740, { size: 32, w: 'R', color: hexA(INK, 0.75), alpha: clamp((t - TI.one) / 0.3) }); ctx.restore(); }
      const k2 = sp(t, TI.eq, 14, 0.66);
      if (k2 > 0) { ctx.save(); ctx.globalAlpha *= clamp(k2 * 2); lat(ctx, '←', 980, 668, { size: 80, w: 700, color: INK, align: 'center' }); ctx.restore(); }
      const k3 = sp(t, TI.hund - 0.1, 14, 0.66);
      if (k3 > 0) { ctx.save(); ctx.globalAlpha *= clamp(k3 * 2); lat(ctx, '≈ $', 470, 676, { size: 96, w: 800, color: INK, align: 'right' }); wheels(ctx, '001', '100', t, TI.hund - 0.1, 470, 676, 96, { align: 'left', color: INK, w: 800, d: 0.5, stagger: 0.06 }); txt(ctx, 'على لوت كامل', 790, 740, { size: 32, w: 'R', color: hexA(INK, 0.75), alpha: clamp((t - TI.lot) / 0.3) }); ctx.restore(); }
      const k4 = sp(t, TI.many, 14, 0.7); if (k4 > 0) { ctx.save(); ctx.globalAlpha *= clamp(k4 * 2); const s4 = 'لدى كثير من الوسطاء'; const ww = measure(ctx, s4, 30, 'S') + 50; A.roundRect(ctx, 960 - ww / 2, 818, ww, 58, 29); ctx.fillStyle = INK; ctx.fill(); txt(ctx, s4, 960, 857, { size: 30, w: 'S', color: P.gold, align: 'center' }); ctx.restore(); }
    } else if (s.id === 3) {
      slamText(ctx, '«الملاذ الآمن»', 960, 480, 170, t, TI.haven - 0.1, { outline: true, lw: 3, color: '#FFFFFF' });
      const fk = EIO(t, TI.means + 0.1, 1.2);
      if (fk > 0) { const pts = []; const r = A.rng(5); for (let i = 0; i <= 40; i++) { const u = i / 40; pts.push([lerp(260, 1660, u), lerp(760, 900, u * u) + (r() - 0.5) * 30]); } const m = Math.max(2, Math.ceil(41 * fk)); ctx.save(); ctx.beginPath(); for (let i = 0; i < m; i++) i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineJoin = 'round'; Q.glowStroke(ctx, P.red, 5); ctx.restore(); }
      const k = sp(t, TI.means, 14, 0.66); if (k > 0) { ctx.save(); ctx.globalAlpha *= clamp(k * 2); txt(ctx, 'يعني أن الذهب لا ينخفض؟', 960, 680 + (1 - Math.min(1, k)) * 24, { size: 64, w: 'S', color: '#FFFFFF', align: 'center' }); ctx.restore(); }
    } else if (s.id === 4) {
      slamText(ctx, 'أرباح مضمونة؟', 960, 420, 140, t, TI.guar - 0.05, { color: '#FFFFFF' });
      const k = sp(t, TI.bars, 14, 0.66); if (k > 0) { ctx.save(); ctx.globalAlpha *= clamp(k * 2); txt(ctx, 'سبائك أرخص بكثير من السوق؟', 960, 580 + (1 - Math.min(1, k)) * 24, { size: 60, w: 'S', color: '#FFFFFF', align: 'center' }); ctx.restore(); }
      const st = EIO(t, TI.because, 0.35); if (st > 0) { ctx.save(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(1440, 384); ctx.lineTo(1440 - 960 * st, 384); ctx.stroke(); ctx.beginPath(); ctx.moveTo(1370, 560); ctx.lineTo(1370 - 820 * EIO(t, TI.because + 0.15, 0.35), 560); ctx.stroke(); ctx.restore(); }
      const sk = t >= TI.signs - 0.03 ? xo(clamp((t - TI.signs + 0.03) / 0.2)) : 0;
      if (sk > 0) { const s1 = 'علامات احتيال'; const ww = measure(ctx, s1, 54, 'S') + 90; ctx.save(); ctx.translate(960, 760); ctx.rotate(-0.05); ctx.scale(lerp(1.8, 1, sk), lerp(1.8, 1, sk)); A.roundRect(ctx, -ww / 2, -54, ww, 108, 54); ctx.fillStyle = C.red; ctx.fill(); txt(ctx, s1, 0, 18, { size: 54, w: 'S', color: '#FFFFFF', align: 'center' }); ctx.restore(); }
    }
  } });

  // ================================================================ J · the series finale
  const LESSONS = [['01', 'شلون تتداول الذهب'], ['02', 'شنو يحرّك سعر الذهب'], ['03', 'أرقام الذهب'], ['04', 'أوقات الذهب']];
  sfx(TJ.in - 0.05, 'whoosh', 0.14, { d: 0.4 }); LESSONS.forEach((_, i) => { sfx(TJ.in + i * 0.1, 'pop', 0.12, { f: 620 + i * 80 }); sfx(TJ.done + i * 0.12, 'tick', 0.12, { f: 2400 + i * 300 }); });
  sfx(TJ.done, 'charge', 0.1, { d: 0.6 }); sfx(TJ.done + 0.65, 'chime', 0.16); sfx(TJ.goldW, 'pop', 0.12, { f: 900 });
  sfx(TJ.now - 0.1, 'whoosh', 0.14, { d: 0.5 }); sfx(TJ.guide, 'pop', 0.14, { f: 700 }); sfx(TJ.under, 'whoosh', 0.12, { d: 0.35, up: false });
  [TJ.answer + 0.4, TJ.qs, TJ.qEnd].forEach((tt, i) => sfx(tt, 'tick', 0.14, { f: 2200 + i * 300 })); sfx(TJ.test - 0.05, 'charge', 0.1, { d: 0.8 }); sfx(TJ.ready, 'chime', 0.16);
  sfx(TJ.rem - 0.1, 'whoosh', 0.14, { d: 0.5 }); sfx(TJ.risk, 'pop', 0.12, { f: 520 }); sfx(TJ.part, 'glitch', 0.12); sfx(TJ.all, 'slam', 0.16);
  sfx(TJ.bye1 - 0.1, 'whoosh', 0.14, { d: 0.45 }); sfx(TJ.see, 'whoosh', 0.12, { d: 0.5 }); sfx(TJ.soon, 'pop', 0.14, { f: 880 }); sfx(TJ.pro, 'chime', 0.14); sfx(TJ.insh, 'tick', 0.1, { f: 2600 });
  function check(ctx, x, y, r, p, col) { ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fillStyle = hexA(col, 0.18 + 0.82 * p); ctx.fill(); if (p > 0) { ctx.strokeStyle = '#090A0D'; ctx.lineWidth = r * 0.22; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; const a = [x - r * 0.45, y + 0.02 * r], b = [x - r * 0.1, y + r * 0.35], c = [x + r * 0.5, y - r * 0.35]; ctx.beginPath(); ctx.moveTo(a[0], a[1]); if (p < 0.5) ctx.lineTo(lerp(a[0], b[0], p * 2), lerp(a[1], b[1], p * 2)); else { ctx.lineTo(b[0], b[1]); ctx.lineTo(lerp(b[0], c[0], (p - 0.5) * 2), lerp(b[1], c[1], (p - 0.5) * 2)); } ctx.stroke(); } ctx.restore(); }

  Q.scn({ t0: TJ.in, t1: TJ.now + 0.6, draw(ctx, t) {
    const ex = EIO(t, TJ.now - 0.2, 0.6); ctx.save(); ctx.globalAlpha = 1 - ex; ctx.translate(0, -120 * ex);
    const ck = sp(t, TJ.done, 14, 0.7); if (ck > 0) { ctx.save(); ctx.globalAlpha *= clamp(ck * 2); const cw1 = measure(ctx, 'اكتملت السلسلة', 28, 'S'); txt(ctx, 'اكتملت السلسلة', 960 + (cw1 + 90) / 2, 190, { size: 28, w: 'S', color: P.dim }); lat(ctx, '4 / 4', 960 + (cw1 + 90) / 2 - cw1 - 18, 190, { size: 26, w: 700, color: P.gold, align: 'right', track: 2 }); ctx.restore(); }
    const head = [['سلسلة', TJ.series], ['شلون', TJ.how], ['تتداول', TJ.how + 0.44], ['الذهب', TJ.goldW]]; const hs = 66; const sw = measure(ctx, ' ', hs, 'S'); const tw = head.reduce((a, [s]) => a + measure(ctx, s, hs, 'S'), 0) + sw * 3; let x = 960 + tw / 2;
    head.forEach(([s, tt]) => { const k = clamp((t - tt) / 0.18); if (k > 0) txt(ctx, s, x, 290 + (1 - k) * 16, { size: hs, w: 'S', color: s === 'الذهب' ? P.gold : P.white, alpha: k }); x -= measure(ctx, s, hs, 'S') + sw; });
    LESSONS.forEach(([n, s], i) => {
      const k = sp(t, TJ.in + i * 0.1, 14, 0.66); if (k <= 0) return; const cx = 1545 - i * 390, cy = 520;
      ctx.save(); ctx.globalAlpha *= clamp(k * 2); ctx.translate(0, (1 - Math.min(1, k)) * 60);
      panel(ctx, cx - 180, cy - 110, 360, 220, { r: 22, fill: 'rgba(22,23,27,0.95)', stroke: i === 3 ? hexA(P.gold, 0.8) : 'rgba(255,255,255,0.10)' });
      lat(ctx, n, cx + 150, cy - 56, { size: 26, w: 700, color: P.gold, align: 'right', track: 2 });
      txt(ctx, s, cx + 150, cy + 40, { size: 30, w: 'S', color: P.white });
      check(ctx, cx - 130, cy - 64, 22, EIO(t, TJ.done + i * 0.12, 0.3), P.gold);
      ctx.restore();
    });
    const pk = EIO(t, TJ.done, 0.8);
    if (t > TJ.in + 0.3) { ctx.fillStyle = 'rgba(255,255,255,0.08)'; A.roundRect(ctx, 195, 700, 1530, 10, 5); ctx.fill(); if (pk > 0) { ctx.fillStyle = P.gold; A.roundRect(ctx, 1725 - 1530 * pk, 700, 1530 * pk, 10, 5); ctx.fill(); }
      lat(ctx, Math.round(100 * pk) + '%', 195, 780, { size: 46, w: 700, color: pk >= 1 ? P.gold : P.white, alpha: clamp((t - TJ.in - 0.3) / 0.3) }); }
    const fk = clamp((t - TJ.from) / 0.3); if (fk > 0) { txt(ctx, 'من أكاديمية', 1725, 780, { size: 30, w: 'S', color: P.dim, alpha: fk }); txt(ctx, 'آكسي', 1725 - measure(ctx, 'من أكاديمية ', 30, 'S'), 780, { size: 30, w: 'S', color: P.white, alpha: clamp((t - TJ.axi) / 0.2) }); }
    ctx.restore();
  } });

  // the free guide · the questions · the readiness ring
  Q.scn({ t0: TJ.now - 0.2, t1: TJ.rem + 0.6, draw(ctx, t) {
    const ex = EIO(t, TJ.rem - 0.25, 0.6); if (ex >= 1) return; ctx.save(); ctx.globalAlpha = 1 - ex; ctx.translate(0, -100 * ex);
    const k = xo(clamp((t - TJ.now + 0.1) / 0.8)); const dy = (1 - k) * 700;
    Q.tiltCard(ctx, 'guide', 620, 720, 1260, 560 + dy, 0.12 * (1 - k) + 0.05, -0.05, (c) => {
      c.fillStyle = '#F7F7F4'; c.fillRect(0, 0, 620, 720); c.fillStyle = P.gold; c.fillRect(0, 0, 620, 12);
      A.xmark(c, 70, 70, 40, INK, 0.9); lat(c, 'PDF', 560, 76, { size: 20, w: 800, color: hexA(INK, 0.5), align: 'right', track: 2 });
      const tk = clamp((t - TJ.guide) / 0.25); if (tk > 0) { txt(c, 'الدليل المجاني', 570, 160, { size: 42, w: 'S', color: INK, alpha: tk }); txt(c, 'الكامل', 570, 214, { size: 42, w: 'S', color: P.gold2, alpha: clamp((t - TJ.full) / 0.2) }); }
      txt(c, 'شلون تتداول الذهب', 570, 262, { size: 24, w: 'R', color: hexA(INK, 0.6), alpha: tk });
      for (let i = 0; i < 4; i++) { c.fillStyle = 'rgba(9,10,13,0.10)'; c.fillRect(570 - [470, 420, 450, 300][i], 300 + i * 30, [470, 420, 450, 300][i], 12); }
      const qa = clamp((t - TJ.answer) / 0.3);
      if (qa > 0) { c.save(); c.globalAlpha *= qa; txt(c, 'أسئلة الدليل', 570, 470, { size: 28, w: 'S', color: INK });
        [TJ.answer + 0.4, TJ.qs, TJ.qEnd].forEach((tt, i) => { const y = 520 + i * 62; c.fillStyle = 'rgba(9,10,13,0.08)'; c.fillRect(110, y - 8, 380, 14); txt(c, 'س' + (i + 1), 570, y + 8, { size: 24, w: 'S', color: hexA(INK, 0.7) }); check(c, 70, y, 20, EIO(t, tt, 0.3), P.gold2); }); c.restore(); }
    }, { scale: 1 });
    // left: «under the video» arrow → the readiness ring
    const ak = sp(t, TJ.under, 13, 0.66), aOut = EIO(t, TJ.test - 0.3, 0.4);
    if (ak > 0 && aOut < 1) { ctx.save(); ctx.globalAlpha *= clamp(ak * 2) * (1 - aOut); const bob = Math.sin((t - TJ.under) * 6) * 12; txt(ctx, 'تحت الفيديو', 560, 420, { size: 44, w: 'S', color: P.white, align: 'center' }); ctx.translate(560, 560 + bob); ctx.strokeStyle = P.gold; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(0, -80); ctx.lineTo(0, 90); ctx.moveTo(-50, 40); ctx.lineTo(0, 90); ctx.lineTo(50, 40); ctx.stroke(); ctx.restore(); }
    const rk = sp(t, TJ.test, 13, 0.66);
    if (rk > 0) { const p = EIO(t, TJ.test + 0.1, TJ.ready - TJ.test + 0.2); ctx.save(); ctx.globalAlpha *= clamp(rk * 2); ctx.translate(560, 560); ctx.scale(Math.min(1, rk), Math.min(1, rk));
      ctx.beginPath(); ctx.arc(0, 0, 170, 0, 6.283); ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 22; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 170, -Math.PI / 2, -Math.PI / 2 + 6.283 * p); ctx.strokeStyle = P.gold; ctx.lineCap = 'round'; ctx.stroke();
      const v = String(Math.round(100 * p)); lat(ctx, v + '%', 0, 26, { size: 76, w: 700, color: P.white, align: 'center' }); txt(ctx, 'جاهزيتك', 0, 92, { size: 30, w: 'S', color: P.dim, align: 'center' }); ctx.restore(); }
    ctx.restore();
  } });

  // the leverage reminder
  Q.scn({ t0: TJ.rem - 0.2, t1: TJ.bye1 + 0.5, draw(ctx, t) {
    const ex = EIO(t, TJ.bye1 - 0.3, 0.5); if (ex >= 1) return; ctx.save(); ctx.globalAlpha = 1 - ex;
    cap(ctx, 'وتذكّر دائماً', 960, 300, { size: 30, color: P.dim, alpha: clamp((t - TJ.rem) / 0.3) });
    const l1 = [['التداول', TJ.trading], ['بالرافعة', TJ.lev], ['المالية', TJ.lev + 0.7], ['ينطوي', TJ.risk - 0.32], ['على', TJ.risk - 0.16], ['مخاطر', TJ.risk]]; const hs = 70, sw = measure(ctx, ' ', hs, 'S'); const tw = l1.reduce((a, [s]) => a + measure(ctx, s, hs, 'S'), 0) + sw * (l1.length - 1); let x = 960 + tw / 2;
    l1.forEach(([s, tt]) => { const k = clamp((t - tt) / 0.18); if (k > 0) txt(ctx, s, x, 440 + (1 - k) * 16, { size: hs, w: 'S', color: s === 'مخاطر' ? C.red : P.white, alpha: k }); x -= measure(ctx, s, hs, 'S') + sw; });
    const bk = clamp((t - TJ.may) / 0.3);
    if (bk > 0) {
      ctx.save(); ctx.globalAlpha *= bk; txt(ctx, 'رأس مالك', 1560, 600, { size: 30, w: 'S', color: P.dim });
      const X0 = 360, X1 = 1560, y = 640, split = 0.6; // the right part stays, the left part goes first
      const f1 = EI(t, TJ.part + 0.05, 0.5), f2 = EI(t, TJ.all + 0.05, 0.5); const red1 = clamp((t - TJ.part) / 0.15), red2 = clamp((t - TJ.all) / 0.15);
      const xs = lerp(X1, X0, split);
      ctx.save(); ctx.translate(0, 300 * f1 * f1); ctx.rotate(0.12 * f1); ctx.globalAlpha *= 1 - f1; A.roundRect(ctx, X0, y, xs - X0 - 6, 44, 10); ctx.fillStyle = A.mixHex('#FFFFFF', C.red, red1); ctx.fill(); if (red1 > 0) txt(ctx, 'جزء منه', (X0 + xs) / 2, y + 100, { size: 34, w: 'S', color: C.red, align: 'center', alpha: red1 * (1 - f1) }); ctx.restore();
      ctx.save(); ctx.translate(0, 300 * f2 * f2); ctx.rotate(-0.08 * f2); ctx.globalAlpha *= 1 - f2; A.roundRect(ctx, xs, y, X1 - xs, 44, 10); ctx.fillStyle = A.mixHex('#FFFFFF', C.red, red2); ctx.fill(); if (red2 > 0) txt(ctx, 'أو كله', (xs + X1) / 2, y + 100, { size: 34, w: 'S', color: C.red, align: 'center', alpha: red2 * (1 - f2) }); ctx.restore();
      ctx.restore();
    }
    ctx.restore();
  } });

  // the farewell: wishes + the next series (locked card)
  Q.scn({ t0: TJ.bye1 - 0.2, t1: TJ.bye2 + 0.05, draw(ctx, t) {
    const l1 = wl(113); const hs = 66, sw = measure(ctx, ' ', hs, 'S'); const tw = l1.reduce((a, x) => a + measure(ctx, x.s, hs, 'S'), 0) + sw * (l1.length - 1); let x = 960 + tw / 2;
    l1.forEach((wd) => { const k = clamp((t - wd.t) / 0.18); if (k > 0) txt(ctx, wd.s, x, 280 + (1 - k) * 16, { size: hs, w: 'S', color: wd.s.startsWith('والنجاح') ? P.gold : P.white, alpha: k }); x -= measure(ctx, wd.s, hs, 'S') + sw; });
    const k = xo(clamp((t - TJ.see) / 0.9)); if (k <= 0) return; const glow = Math.exp(-Math.pow((t - TJ.insh - 0.2) / 0.35, 2));
    Q.tiltCard(ctx, 'next', 1100, 340, 960, lerp(1300, 610, k), lerp(0.8, 0.14, k), 0.04, (c) => {
      c.fillStyle = '#141518'; c.fillRect(0, 0, 1100, 340); c.strokeStyle = hexA(P.gold, 0.5 + 0.5 * glow); c.lineWidth = 3; c.strokeRect(1.5, 1.5, 1097, 337);
      c.save(); c.translate(140, 170); c.strokeStyle = P.gold; c.lineWidth = 10; c.beginPath(); c.arc(0, -30, 40, Math.PI, 0); c.stroke(); A.roundRect(c, -62, -30, 124, 96, 14); c.fillStyle = P.gold; c.fill(); c.fillStyle = '#141518'; c.beginPath(); c.arc(0, 10, 12, 0, 6.283); c.fill(); c.fillRect(-5, 10, 10, 30); c.restore();
      const a1 = clamp((t - TJ.ser2) / 0.2), a2 = clamp((t - TJ.pro) / 0.2); txt(c, 'سلسلة جديدة', 1040, 140, { size: 56, w: 'S', color: P.white, alpha: a1 }); txt(c, 'للمحترفين', 1040, 220, { size: 56, w: 'S', color: P.gold, alpha: a2 });
      const a3 = clamp((t - TJ.acad) / 0.2); txt(c, 'من أكاديمية', 1040, 290, { size: 26, w: 'R', color: P.dim, alpha: a3 }); txt(c, 'آكسي', 1040 - measure(c, 'من أكاديمية ', 26, 'R'), 290, { size: 26, w: 'S', color: P.white, alpha: clamp((t - TJ.axi2) / 0.2) });
      const sk = clamp((t - TJ.soon) / 0.2); if (sk > 0) { c.save(); c.globalAlpha *= sk; A.roundRect(c, 250, 120, 170, 56, 28); c.strokeStyle = P.gold; c.lineWidth = 2; c.stroke(); txt(c, 'قريباً', 335, 157, { size: 28, w: 'S', color: P.gold, align: 'center' }); c.restore(); }
    }, { scale: 1 });
  } });

  // the recap montage: the four lessons, one per screen → «للمحترفين · قريباً» → collapse into the red caret
  const REC = [{ t0: TJ.bye2, kind: 'paper', n: '01', s: 'شلون تتداول الذهب' }, { t0: TJ.tw, kind: 'gold', n: '02', s: 'شنو يحرّك سعر الذهب' }, { t0: TJ.see2, kind: 'black', n: '03', s: 'أرقام الذهب' }, { t0: TJ.ser3, kind: 'slate', n: '04', s: 'أوقات الذهب' }, { t0: TJ.pro2, kind: 'dark', n: '', s: 'للمحترفين' }];
  REC.forEach((r, i) => { r.t1 = i < REC.length - 1 ? REC[i + 1].t0 : F.CLOSE; sfx(r.t0 - 0.03, 'whip', 0.18); sfx(r.t0 + 0.02, 'snap', 0.12); });
  sfx(TJ.insh2 + 0.1, 'whoosh', 0.14, { d: 0.45, up: false }); sfx(F.CLOSE - 0.15, 'tick', 0.12, { f: 2400 });
  Q.scn({ t0: TJ.bye2, t1: F.CLOSE + 0.01, light: true, lightAt: (t) => { const r = REC.find((x) => t >= x.t0 && t < x.t1); return !!(r && LIGHT[r.kind]); }, draw(ctx, t) {
    const r = REC.find((x) => t >= x.t0 && t < x.t1) || REC[REC.length - 1]; const ink = inkOf(r.kind); field(ctx, r.kind);
    const col = REC.indexOf(r); if (r.n) frameUI(ctx, col + 1, 4, 'سلسلة الذهب', ink, clamp((t - r.t0) / (r.t1 - r.t0)));
    if (r.n) { slamText(ctx, r.n, 960, 400, 120, t, r.t0, { color: r.kind === 'gold' ? INK : P.gold, w: 'S' }); slamText(ctx, r.s, 960, 600, 120, t, r.t0 + 0.06, { color: ink, outline: r.kind === 'black', lw: 3 }); return; }
    // last screen: «قريباً · للمحترفين» → collapse into the caret
    const sq = EIO(t, TJ.insh2 + 0.1, 0.45);
    ctx.save(); ctx.translate(960, 540); ctx.scale(lerp(1, 0.01, sq), lerp(1, 0.02, sq)); ctx.translate(-960, -540);
    cap(ctx, 'قريباً', 960, 380, { size: 34, color: P.dim }); slamText(ctx, 'للمحترفين', 960, 590, 150, t, r.t0, { color: P.gold });
    ctx.restore();
    if (sq > 0) { const half = lerp(640, 0, EIO(t, TJ.insh2 + 0.45, 0.35)); if (half > 1) { ctx.save(); ctx.beginPath(); ctx.moveTo(960 - half, 540); ctx.lineTo(960 + half, 540); Q.glowStroke(ctx, P.gold, 4); ctx.restore(); } }
    if (t > TJ.insh2 + 0.7) { ctx.fillStyle = C.red; ctx.fillRect(957, 510, 6, 60); }
  } });

  // ================================================================ music: 124 BPM, A minor — Am9 · Fmaj9 · Cadd9 · G6, glass plucks, stabs, kick on every beat
  F.STYLE = { bpm: 124, chords: [[45, [57, 60, 64, 67, 71]], [41, [57, 60, 64, 67, 69]], [36, [55, 60, 62, 64, 67]], [43, [55, 59, 62, 64, 67]]], kit: 'four', pluck: 'glass', swing: 0.0,
    bass: [0, 1, 0, 1, 0, 1, 0, 1], arp: [0, 2, 4, 1, 3, 4, 2, 1], padcut: 2400, duck: 0.6, stab: true };
  F.MUSIC = [
    { t: 0, lvl: 1 }, { t: 2.0, lvl: 2 }, { t: w(4, 2), lvl: 3 }, { t: w(8, 0), lvl: 4 }, { t: w(10, 0) - 0.45, lvl: 3 },
    { t: w(38, 0), lvl: 2 }, { t: w(47, 0), lvl: 3 }, { t: w(54, 0), lvl: 4 }, { t: w(60, 0), lvl: 3 },
    { t: w(74, 2), lvl: 4 }, { t: w(79, 3), lvl: 3 }, { t: TI.in, lvl: 4 }, { t: TJ.now, lvl: 3 }, { t: TJ.rem, lvl: 2 }, { t: TJ.bye1, lvl: 3 }, { t: TJ.bye2, lvl: 4 }, { t: F.CLOSE, lvl: 1 },
  ];

  F.addCloseSaaS();
})(typeof window !== 'undefined' ? window : globalThis);
