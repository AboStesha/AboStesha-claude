// Lesson 18 · part 3 — the one-word-per-screen montage (four beginner mistakes), the summary (three checks), the series
// finale (18 tiles ✓ 100%), the leverage reminder, the farewell (next: the gold series), the collapse into the red caret →
// the close. Music: 122 BPM, E minor (Em9 · Cmaj9 · G6 · Dadd9), mallet plucks, off-beat stabs.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, Q = G.SAAS, L = G.L18;
  const { W, H, C, clamp, lerp, hexA, txt, lat, measure } = A;
  const { P, E, EI, EIO, sp, xo, outP, wheels, panel, cap, frameUI } = Q;
  const { chip, tick } = L;
  const w = F.w, sfx = F.sfx, wl = F.wl;
  const INK = '#090A0D';

  function field(ctx, kind) {
    if (kind === 'paper') { ctx.fillStyle = P.paper; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = 'rgba(9,10,13,0.05)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = 0; x <= W; x += 80) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); } for (let y = 0; y <= H; y += 80) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); } ctx.stroke(); }
    else if (kind === 'steel') { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#EEF0F1'); g.addColorStop(1, '#B5C8CD'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    else if (kind === 'black') { ctx.fillStyle = '#050506'; ctx.fillRect(0, 0, W, H); }
    else if (kind === 'slate') { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#6E8992'); g.addColorStop(1, '#33444A'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    else Q.bg(ctx);
  }
  const LIGHT = { paper: true, steel: true };
  const inkOf = (kind) => (LIGHT[kind] ? INK : '#FFFFFF');
  function slamText(ctx, s, x, y, size, t, t0, o = {}) {
    if (t < t0 - 0.02) return; const k = xo(clamp((t - t0) / (o.d || 0.32))); const dx = (1 - k) * (o.dist || 520);
    ctx.save(); ctx.translate(dx, 0); ctx.globalAlpha *= clamp((t - t0) / 0.08 + 0.2);
    if (o.outline) { ctx.font = A.font(size, o.w || 'S'); ctx.direction = 'rtl'; ctx.textAlign = o.align || 'center'; ctx.lineWidth = o.lw || 3; ctx.strokeStyle = o.color || '#FFFFFF'; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); }
    else txt(ctx, s, x, y, { size, w: o.w || 'S', color: o.color || '#FFFFFF', align: o.align || 'center' });
    ctx.restore();
  }
  function box(ctx, x, y, s, k, ink, o = {}) { // an unchecked box + label (RTL, x = right edge)
    if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k * 2); ctx.translate((1 - Math.min(1, k)) * 40, 0);
    A.roundRect(ctx, x - 46, y - 46, 46, 46, 8); ctx.strokeStyle = ink; ctx.lineWidth = 4; ctx.stroke();
    if (o.x) { ctx.strokeStyle = C.red; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 36, y - 36); ctx.lineTo(x - 10, y - 10); ctx.moveTo(x - 10, y - 36); ctx.lineTo(x - 36, y - 10); ctx.stroke(); }
    txt(ctx, s, x - 70, y - 10, { size: 48, w: 'S', color: ink }); ctx.restore();
  }

  // ================================================================ G · the montage: four beginner mistakes
  const TG = { four: w(43, 0), mist: w(43, 1), beg: w(43, 4), m1: w(44, 0), dep: w(45, 0), broker: w(45, 7), reg: w(45, 9), m2: w(46, 0), open2: w(47, 0), noTrain: w(48, 0), demo2: w(48, 5),
    m3: w(49, 0), open3: w(50, 0), specs: w(50, 5), size: w(51, 1), spread: w(52, 0), swap: w(52, 1), comm: w(53, 0), m4: w(54, 0), guar: w(55, 3), profit: w(55, 4), signals: w(56, 3), promises: w(56, 6), these: w(57, 0), signs: w(57, 2), fraud: w(57, 3) };
  const TJ = { sum: w(58, 0), before: w(59, 0), check: w(60, 2), c1: w(61, 0), c2: w(62, 0), c3: w(63, 0), done: w(64, 2), series: w(64, 3), learn: w(64, 4), beg: w(64, 6), from: w(64, 7), axi: w(64, 9),
    rem: w(65, 0), trading: w(66, 0), lev: w(66, 1), risk: w(66, 4), may: w(67, 0), part: w(67, 2), all: w(67, 7),
    bye: w(68, 0), next: w(69, 0), nextW: w(69, 1), teach: w(69, 5), how: w(69, 6), gold: w(69, 8), insh: w(70, 0) };
  const SCR = [{ t0: TG.four - 0.1, kind: 'intro' }, { t0: TG.m1, kind: 'paper', id: 1 }, { t0: TG.m2, kind: 'steel', id: 2 }, { t0: TG.m3, kind: 'black', id: 3 }, { t0: TG.m4, kind: 'slate', id: 4 }];
  SCR.forEach((s, i) => { s.t1 = i < SCR.length - 1 ? SCR[i + 1].t0 : TJ.sum - 0.05; });
  const SQ = (() => { const r = A.rng(4321); return Array.from({ length: 24 * 14 }, () => ({ p: r(), s: r() })); })();
  sfx(TG.four - 0.15, 'whoosh', 0.16, { d: 0.4 }); sfx(TG.four, 'slam', 0.22); sfx(TG.mist, 'whoosh', 0.1, { d: 0.25 }); sfx(TG.beg, 'pop', 0.12, { f: 760 });
  [TG.m1, TG.m2, TG.m3, TG.m4].forEach((tt) => { sfx(tt - 0.03, 'whip', 0.2); sfx(tt + 0.02, 'snap', 0.14); });
  sfx(TG.dep - 0.02, 'whoosh', 0.12, { d: 0.3 }); sfx(TG.broker, 'tick', 0.14, { f: 1800 }); sfx(TG.reg, 'tick', 0.14, { f: 1600 });
  sfx(TG.open2 - 0.02, 'whoosh', 0.12, { d: 0.3 }); sfx(TG.noTrain, 'pop', 0.12, { f: 640 });
  sfx(TG.open3 - 0.02, 'whoosh', 0.12, { d: 0.3 }); [TG.size, TG.spread, TG.swap, TG.comm].forEach((tt, i) => sfx(tt, 'pop', 0.14, { f: 700 + i * 90 }));
  sfx(TG.guar - 0.02, 'whoosh', 0.12, { d: 0.3 }); sfx(TG.signals, 'pop', 0.14, { f: 700 }); sfx(TG.these, 'scribble', 0.1, { d: 0.35 }); sfx(TG.signs - 0.02, 'slam', 0.2); sfx(TG.fraud, 'buzz', 0.08);
  Q.scn({ t0: TG.four - 0.1, t1: TJ.sum, light: true, lightAt: (t) => { const s = SCR.find((x) => t >= x.t0 && t < x.t1); return !!(s && LIGHT[s.kind]); }, draw(ctx, t) {
    const s = SCR.find((x) => t >= x.t0 && t < x.t1) || SCR[SCR.length - 1]; const lt = t - s.t0, ink = inkOf(s.kind);
    field(ctx, s.kind === 'intro' ? 'dark' : s.kind);
    if (s.kind === 'intro') {
      for (let i = 0; i < SQ.length; i++) { const q = SQ[i]; const on = Math.sin((t * 2.2 + q.p * 9) * Math.PI) > 0.55 + 0.4 * q.s; if (!on) continue; const cx = (i % 24) * 80, cy = Math.floor(i / 24) * 80; ctx.fillStyle = hexA(P.acc, 0.05 + 0.08 * q.s); ctx.fillRect(cx + 6, cy + 6, 68, 68); }
      const k = sp(t, TG.four, 12, 0.6); if (k > 0) { ctx.save(); ctx.translate(1180, 610); ctx.scale(Math.min(1.08, k), Math.min(1.08, k)); lat(ctx, '4', 0, 0, { size: 300, w: 800, color: P.acc, align: 'center' }); ctx.restore(); }
      slamText(ctx, 'أخطاء', 1000, 540, 120, t, TG.mist, { align: 'right' }); slamText(ctx, 'شائعة', 1000, 680, 120, t, TG.mist + 0.25, { align: 'right', color: P.dim });
      const bk = clamp((t - TG.beg) / 0.25); if (bk > 0) cap(ctx, 'عند المبتدئين', 960, 840, { size: 34, color: P.white, alpha: bk });
      return;
    }
    frameUI(ctx, s.id, 4, 'أخطاء المبتدئين', ink, clamp(lt / (s.t1 - s.t0)));
    slamText(ctx, ['', 'الأول', 'الثاني', 'الثالث', 'الرابع'][s.id], 960, 250, 46, t, s.t0 + 0.02, { color: hexA(ink === INK ? '#090A0D' : '#FFFFFF', 0.55), dist: 200 });
    if (s.id === 1) {
      slamText(ctx, 'الإيداع قبل التحقق.', 960, 470, 140, t, TG.dep, { color: ink });
      box(ctx, 1500, 730, 'الوسيط', sp(t, TG.broker, 15, 0.66), INK, { x: t > TG.broker + 0.3 }); box(ctx, 1010, 730, 'سجل الجهة التنظيمية', sp(t, TG.reg, 15, 0.66), INK, { x: t > TG.reg + 0.3 });
    } else if (s.id === 2) {
      slamText(ctx, 'حساب حقيقي من أول يوم.', 960, 470, 130, t, TG.open2, { color: ink });
      const k = sp(t, TG.noTrain, 14, 0.66); if (k > 0) { ctx.save(); ctx.globalAlpha *= clamp(k * 2); txt(ctx, 'دون تدريب على حساب تجريبي', 960, 640 + (1 - Math.min(1, k)) * 24, { size: 60, w: 'S', color: INK, align: 'center' }); ctx.restore(); }
    } else if (s.id === 3) {
      slamText(ctx, 'صفقة بلا مواصفات.', 960, 470, 150, t, TG.open3, { outline: true, lw: 3, color: '#FFFFFF' });
      [['حجم العقد', TG.size, 1440], ['فارق السعر (Spread)', TG.spread, 1090], ['التبييت (Swap)', TG.swap, 760], ['العمولة', TG.comm, 470]].forEach(([s2, tt, x]) => chip(ctx, s2, x, 690, sp(t, tt, 15, 0.66), { size: 30, stroke: '#FFFFFF', fill: 'rgba(5,5,6,0.9)' }));
    } else if (s.id === 4) {
      slamText(ctx, 'ربح مضمون؟', 960, 420, 150, t, TG.guar - 0.05, { color: '#FFFFFF' });
      const k = sp(t, TG.signals, 14, 0.66); if (k > 0) { ctx.save(); ctx.globalAlpha *= clamp(k * 2); txt(ctx, 'توصيات وإدارة محافظ بوعود مضمونة؟', 960, 580 + (1 - Math.min(1, k)) * 24, { size: 56, w: 'S', color: '#FFFFFF', align: 'center' }); ctx.restore(); }
      const st = EIO(t, TG.these, 0.35); if (st > 0) { ctx.save(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(1340, 384); ctx.lineTo(1340 - 760 * st, 384); ctx.stroke(); ctx.beginPath(); ctx.moveTo(1440, 560); ctx.lineTo(1440 - 960 * EIO(t, TG.these + 0.15, 0.35), 560); ctx.stroke(); ctx.restore(); }
      const sk = t >= TG.signs - 0.03 ? xo(clamp((t - TG.signs + 0.03) / 0.2)) : 0;
      if (sk > 0) { const s1 = 'علامات احتيال'; const ww = measure(ctx, s1, 54, 'S') + 90; ctx.save(); ctx.translate(960, 760); ctx.rotate(-0.05); ctx.scale(lerp(1.8, 1, sk), lerp(1.8, 1, sk)); A.roundRect(ctx, -ww / 2, -54, ww, 108, 54); ctx.fillStyle = C.red; ctx.fill(); txt(ctx, s1, 0, 18, { size: 54, w: 'S', color: '#FFFFFF', align: 'center' }); ctx.restore(); }
    }
  } });

  // ================================================================ H · the summary: three checks
  const SUM = [['الوسيط', TJ.c1, 'shield'], ['الحساب التجريبي', TJ.c2, 'screen'], ['الأخطاء الشائعة', TJ.c3, 'warn']];
  sfx(TJ.sum - 0.1, 'whoosh', 0.14, { d: 0.4 }); sfx(TJ.before, 'pop', 0.12, { f: 700 }); SUM.forEach(([_, tt], i) => { sfx(tt, 'pop', 0.16, { f: 760 + i * 100 }); sfx(tt + 0.3, 'tick', 0.14, { f: 2600 + i * 200 }); });
  function icon(ctx, kind, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.strokeStyle = P.acc; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (kind === 'shield') { ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * 0.8, -s * 0.7); ctx.lineTo(s * 0.8, 0); ctx.quadraticCurveTo(s * 0.8, s * 0.7, 0, s); ctx.quadraticCurveTo(-s * 0.8, s * 0.7, -s * 0.8, 0); ctx.lineTo(-s * 0.8, -s * 0.7); ctx.closePath(); ctx.stroke(); }
    else if (kind === 'screen') { A.roundRect(ctx, -s, -s * 0.7, s * 2, s * 1.3, 8); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s * 0.4, s * 0.9); ctx.lineTo(s * 0.4, s * 0.9); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s * 0.6, s * 0.2); ctx.lineTo(-s * 0.2, -s * 0.2); ctx.lineTo(s * 0.15, s * 0.05); ctx.lineTo(s * 0.6, -s * 0.35); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s, s * 0.8); ctx.lineTo(-s, s * 0.8); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -s * 0.3); ctx.lineTo(0, s * 0.25); ctx.stroke(); ctx.fillStyle = P.acc; ctx.beginPath(); ctx.arc(0, s * 0.52, 4, 0, 6.283); ctx.fill(); }
    ctx.restore();
  }
  Q.scn({ t0: TJ.sum - 0.05, t1: TJ.done + 0.6, draw(ctx, t) {
    const ex = EIO(t, TJ.done - 0.4, 0.6); if (ex >= 1) return; ctx.save(); ctx.globalAlpha = 1 - ex; ctx.translate(0, -100 * ex);
    cap(ctx, 'الخلاصة', 960, 170, { size: 30, color: P.dim, alpha: clamp((t - TJ.sum) / 0.25) });
    const hk = clamp((t - TJ.before) / 0.25); if (hk > 0) { txt(ctx, 'قبل أي قرار،', 1010, 290, { size: 64, w: 'S', color: P.white, alpha: hk }); txt(ctx, 'افحص:', 1010 - measure(ctx, 'قبل أي قرار، ', 64, 'S'), 290, { size: 64, w: 'S', color: P.acc, alpha: clamp((t - TJ.check) / 0.2) }); }
    SUM.forEach(([s, tt, kind], i) => { const k = sp(t, tt - 0.05, 13, 0.66); if (k <= 0) return; const cx = 1440 - i * 480, cy = 600; ctx.save(); ctx.globalAlpha *= clamp(k * 2); ctx.translate(0, (1 - Math.min(1, k)) * 60);
      panel(ctx, cx - 210, cy - 170, 420, 340, { r: 26, fill: 'rgba(20,21,25,0.96)', stroke: t >= tt + 0.3 ? hexA(P.acc, 0.7) : 'rgba(255,255,255,0.10)' });
      icon(ctx, kind, cx, cy - 50, 50); txt(ctx, s, cx, cy + 70, { size: 38, w: 'S', color: P.white, align: 'center' }); tick(ctx, cx, cy + 130, 22, EIO(t, tt + 0.3, 0.3)); ctx.restore(); });
    ctx.restore();
  } });

  // ================================================================ I · the series finale: 18 tiles
  sfx(TJ.done - 0.2, 'whoosh', 0.14, { d: 0.4 }); for (let i = 0; i < 18; i++) sfx(TJ.done + 0.1 + i * 0.045, 'tick', 0.06, { f: 1800 + i * 60 }); sfx(TJ.done + 0.95, 'chime', 0.16); sfx(TJ.axi, 'pop', 0.12, { f: 900 });
  Q.scn({ t0: TJ.done - 0.3, t1: TJ.rem + 0.5, draw(ctx, t) {
    const ex = EIO(t, TJ.rem - 0.3, 0.6); if (ex >= 1) return; ctx.save(); ctx.globalAlpha = 1 - ex; ctx.translate(0, -100 * ex);
    const ck = sp(t, TJ.done, 14, 0.7); if (ck > 0) { ctx.save(); ctx.globalAlpha *= clamp(ck * 2); const cw1 = measure(ctx, 'اكتملت السلسلة', 28, 'S'); txt(ctx, 'اكتملت السلسلة', 960 + (cw1 + 110) / 2, 170, { size: 28, w: 'S', color: P.dim }); lat(ctx, '18 / 18', 960 + (cw1 + 110) / 2 - cw1 - 18, 170, { size: 26, w: 700, color: P.acc, align: 'right', track: 2 }); ctx.restore(); }
    const head = [['سلسلة', TJ.series], ['تعلّم', TJ.learn], ['التداول', TJ.learn + 0.45], ['للمبتدئين', TJ.beg]]; const hs = 62; const sw = measure(ctx, ' ', hs, 'S'); const tw = head.reduce((a, [s]) => a + measure(ctx, s, hs, 'S'), 0) + sw * 3; let x = 960 + tw / 2;
    head.forEach(([s, tt]) => { const k = clamp((t - tt) / 0.18); if (k > 0) txt(ctx, s, x, 270 + (1 - k) * 16, { size: hs, w: 'S', color: s === 'للمبتدئين' ? P.acc : P.white, alpha: k }); x -= measure(ctx, s, hs, 'S') + sw; });
    for (let i = 0; i < 18; i++) {
      const col = i % 6, row = Math.floor(i / 6); const cx = 1500 - col * 216, cy = 420 + row * 150; const k = sp(t, TJ.done - 0.25 + i * 0.02, 14, 0.66); if (k <= 0) continue;
      ctx.save(); ctx.globalAlpha *= clamp(k * 2); ctx.translate(cx, cy + (1 - Math.min(1, k)) * 40);
      panel(ctx, -96, -60, 192, 120, { r: 18, fill: 'rgba(22,23,27,0.95)', stroke: i === 17 ? hexA(P.acc, 0.9) : 'rgba(255,255,255,0.10)' });
      lat(ctx, String(i + 1).padStart(2, '0'), 70, -14, { size: 30, w: 700, color: i === 17 ? P.acc : P.white, align: 'right' }); tick(ctx, -54, 22, 20, EIO(t, TJ.done + 0.1 + i * 0.045, 0.25));
      ctx.restore();
    }
    const pk = EIO(t, TJ.done + 0.1, 0.85); if (t > TJ.done) { ctx.fillStyle = 'rgba(255,255,255,0.08)'; A.roundRect(ctx, 312, 820, 1296, 10, 5); ctx.fill(); ctx.fillStyle = P.acc; A.roundRect(ctx, 1608 - 1296 * pk, 820, 1296 * pk, 10, 5); ctx.fill(); lat(ctx, Math.round(100 * pk) + '%', 312, 890, { size: 44, w: 700, color: pk >= 1 ? P.acc : P.white }); }
    const fk = clamp((t - TJ.from) / 0.3); if (fk > 0) { txt(ctx, 'من أكاديمية', 1608, 890, { size: 30, w: 'S', color: P.dim, alpha: fk }); txt(ctx, 'آكسي', 1608 - measure(ctx, 'من أكاديمية ', 30, 'S'), 890, { size: 30, w: 'S', color: P.white, alpha: clamp((t - TJ.axi) / 0.2) }); }
    ctx.restore();
  } });

  // ================================================================ J · the leverage reminder
  sfx(TJ.rem - 0.1, 'whoosh', 0.14, { d: 0.5 }); sfx(TJ.risk, 'pop', 0.12, { f: 520 }); sfx(TJ.part, 'glitch', 0.12); sfx(TJ.all, 'slam', 0.16);
  Q.scn({ t0: TJ.rem - 0.2, t1: TJ.bye + 0.5, draw(ctx, t) {
    const ex = EIO(t, TJ.bye - 0.3, 0.5); if (ex >= 1) return; ctx.save(); ctx.globalAlpha = 1 - ex;
    cap(ctx, 'وتذكّر دائماً', 960, 300, { size: 30, color: P.dim, alpha: clamp((t - TJ.rem) / 0.3) });
    const l1 = [['التداول', TJ.trading], ['بالرافعة', TJ.lev], ['المالية', TJ.lev + 0.3], ['ينطوي', TJ.risk - 0.3], ['على', TJ.risk - 0.15], ['مخاطر', TJ.risk]]; const hs = 70, sw = measure(ctx, ' ', hs, 'S'); const tw = l1.reduce((a, [s]) => a + measure(ctx, s, hs, 'S'), 0) + sw * (l1.length - 1); let x = 960 + tw / 2;
    l1.forEach(([s, tt]) => { const k = clamp((t - tt) / 0.18); if (k > 0) txt(ctx, s, x, 440 + (1 - k) * 16, { size: hs, w: 'S', color: s === 'مخاطر' ? C.red : P.white, alpha: k }); x -= measure(ctx, s, hs, 'S') + sw; });
    const bk = clamp((t - TJ.may) / 0.3);
    if (bk > 0) {
      ctx.save(); ctx.globalAlpha *= bk; txt(ctx, 'رأس مالك', 1560, 600, { size: 30, w: 'S', color: P.dim });
      const X0 = 360, X1 = 1560, y = 640, split = 0.6; const f1 = EI(t, TJ.part + 0.05, 0.5), f2 = EI(t, TJ.all + 0.05, 0.5); const red1 = clamp((t - TJ.part) / 0.15), red2 = clamp((t - TJ.all) / 0.15); const xs = lerp(X1, X0, split);
      ctx.save(); ctx.translate(0, 300 * f1 * f1); ctx.rotate(0.12 * f1); ctx.globalAlpha *= 1 - f1; A.roundRect(ctx, X0, y, xs - X0 - 6, 44, 10); ctx.fillStyle = A.mixHex('#FFFFFF', C.red, red1); ctx.fill(); if (red1 > 0) txt(ctx, 'جزء منه', (X0 + xs) / 2, y + 100, { size: 34, w: 'S', color: C.red, align: 'center', alpha: red1 * (1 - f1) }); ctx.restore();
      ctx.save(); ctx.translate(0, 300 * f2 * f2); ctx.rotate(-0.08 * f2); ctx.globalAlpha *= 1 - f2; A.roundRect(ctx, xs, y, X1 - xs, 44, 10); ctx.fillStyle = A.mixHex('#FFFFFF', C.red, red2); ctx.fill(); if (red2 > 0) txt(ctx, 'أو كلّه', (xs + X1) / 2, y + 100, { size: 34, w: 'S', color: C.red, align: 'center', alpha: red2 * (1 - f2) }); ctx.restore();
      ctx.restore();
    }
    ctx.restore();
  } });

  // ================================================================ K · the farewell + the next series (gold) → the caret
  sfx(TJ.bye - 0.1, 'whoosh', 0.14, { d: 0.45 }); sfx(TJ.next - 0.1, 'whoosh', 0.14, { d: 0.6 }); sfx(TJ.next + 0.6, 'impact', 0.1); sfx(TJ.how, 'pop', 0.14, { f: 820 }); sfx(TJ.gold, 'chime', 0.16);
  sfx(TJ.insh + 0.05, 'whoosh', 0.14, { d: 0.45, up: false }); sfx(F.CLOSE - 0.15, 'tick', 0.12, { f: 2400 });
  Q.scn({ t0: TJ.bye - 0.2, t1: F.CLOSE + 0.01, draw(ctx, t) {
    const sq = EIO(t, TJ.insh + 0.05, 0.4);
    ctx.save(); ctx.translate(960, 540); ctx.scale(lerp(1, 0.01, sq), lerp(1, 0.02, sq)); ctx.translate(-960, -540);
    const l1 = wl(68); const hs = 62, sw = measure(ctx, ' ', hs, 'S'); const tw = l1.reduce((a, x) => a + measure(ctx, x.s, hs, 'S'), 0) + sw * (l1.length - 1); let x = 960 + tw / 2;
    l1.forEach((wd) => { const k = clamp((t - wd.t) / 0.18); if (k > 0) txt(ctx, wd.s, x, 250 + (1 - k) * 16, { size: hs, w: 'S', color: wd.s.startsWith('والنجاح') ? P.acc : P.white, alpha: k }); x -= measure(ctx, wd.s, hs, 'S') + sw; });
    const k = xo(clamp((t - TJ.next + 0.1) / 0.9));
    if (k > 0) {
      const cy = lerp(1300, 600, k);
      Q.tiltCard(ctx, 'next18', 1160, 400, 960, cy, lerp(0.8, 0.12, k), 0.04, (c) => {
        c.fillStyle = '#141518'; c.fillRect(0, 0, 1160, 400); c.strokeStyle = hexA(P.au, 0.75); c.lineWidth = 3; c.strokeRect(1.5, 1.5, 1157, 397);
        Q.globe(c, 220, 470, 300, 30 + (t - TJ.next) * 8, -10, { rim: P.au, dot: '#F0CF84' });
        txt(c, 'السلسلة القادمة', 1100, 96, { size: 30, w: 'S', color: P.dim, alpha: clamp((t - TJ.nextW) / 0.25) });
        const hw = [['شلون', TJ.how], ['تتداول', TJ.how + 0.28], ['الذهب', TJ.gold]]; let xx = 1100; hw.forEach(([s, tt]) => { const kk = clamp((t - tt) / 0.2); if (kk > 0) txt(c, s, xx, 210, { size: 80, w: 'S', color: s === 'الذهب' ? P.au : P.white, alpha: kk }); xx -= measure(c, s + ' ', 80, 'S'); });
        const ak = clamp((t - TJ.teach) / 0.3); if (ak > 0) { txt(c, 'من أكاديمية آكسي', 1100, 300, { size: 28, w: 'R', color: P.dim, alpha: ak }); A.roundRect(c, 760, 330, 340, 48, 24); c.strokeStyle = hexA(P.au, ak); c.lineWidth = 2; c.stroke(); txt(c, 'قريباً', 930, 364, { size: 26, w: 'S', color: P.au, align: 'center', alpha: ak }); }
      }, { scale: 1 });
    }
    ctx.restore();
    if (sq > 0) { const half = lerp(640, 0, EIO(t, TJ.insh + 0.4, 0.35)); if (half > 1) { ctx.save(); ctx.beginPath(); ctx.moveTo(960 - half, 540); ctx.lineTo(960 + half, 540); Q.glowStroke(ctx, P.acc, 4); ctx.restore(); } }
    if (t > TJ.insh + 0.65) { ctx.fillStyle = C.red; ctx.fillRect(957, 510, 6, 60); }
  } });

  // ================================================================ music: 122 BPM, E minor — Em9 · Cmaj9 · G6 · Dadd9, mallet plucks, stabs, kick on every beat
  F.STYLE = { bpm: 122, chords: [[40, [55, 59, 62, 66, 69]], [36, [55, 59, 62, 64, 67]], [43, [55, 59, 62, 64, 69]], [38, [54, 57, 62, 64, 69]]], kit: 'four', pluck: 'mallet', swing: 0.04,
    bass: [0, 0, 1, 0, 0, 1, 0, 1], arp: [0, 3, 2, 4, 1, 4, 2, 3], padcut: 2000, duck: 0.6, stab: true };
  F.MUSIC = [
    { t: 0, lvl: 1 }, { t: 2.0, lvl: 2 }, { t: w(2, 2), lvl: 3 }, { t: w(11, 3), lvl: 4 }, { t: w(14, 0), lvl: 3 }, { t: w(23, 0), lvl: 4 }, { t: w(24, 0), lvl: 3 },
    { t: w(26, 0), lvl: 2 }, { t: w(28, 0), lvl: 3 }, { t: w(37, 0), lvl: 2 }, { t: w(40, 0), lvl: 3 }, { t: TG.four - 0.1, lvl: 4 }, { t: TJ.sum, lvl: 3 }, { t: TJ.done, lvl: 4 },
    { t: TJ.rem, lvl: 2 }, { t: TJ.bye, lvl: 3 }, { t: F.CLOSE, lvl: 1 },
  ];

  F.addCloseSaaS();
})(typeof window !== 'undefined' ? window : globalThis);
