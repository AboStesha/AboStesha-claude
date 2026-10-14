// Gold 02 · scenes 1 — HOOK (2025: 53 new highs) · the lesson question + five beads · 01 uncertainty · 02 the dollar.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT, GL = G.GL, GK = G.GK, TH = G.TH, SH = G.SHOT;
  const { W, H, C, clamp, lerp, eo, hexA, txt, lat, mixHex } = A;
  const { w, we, wl, sfx } = F;
  const { cio, sp, rise, head, fromLine, tok, chip, dash, roll, arrow, chev, card, latW, win } = SH.util;
  const Y0 = SH.Y0; const key = TH.key, stat = TH.stat, flat = TH.flat;
  const FLAT = (y) => TH.resample(flat(y));
  const F600 = FLAT(Y0);
  const DOT = Array.from({ length: TH.N }, () => [960, 540]);
  const outA = (t, t0, d = 0.35) => 1 - cio(t, t0, d);
  const popP = (t, t0) => Math.min(1.05, sp(t, t0, 15, 0.5));

  // ================================================================ HOOK · «بعام 2025 وصل سعر الذهب لمستوى قياسي جديد 53 مرة»
  key(0, 0, () => DOT);
  key(2.05, 0.62, stat(flat(540)), { dir: 0, wave: 0.25 });
  sfx(2.06, 'whoosh', 0.12, { d: 0.55 }); sfx(2.1, 'pluck', 0.16, { f: 98 });
  // stylised 2025 path (the shape is illustrative; the count of 53 new highs is the World Gold Council's)
  const rng = (seed) => { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let q = s; q = Math.imul(q ^ (q >>> 15), q | 1); q ^= q + Math.imul(q ^ (q >>> 7), q | 61); return ((q ^ (q >>> 14)) >>> 0) / 4294967296; }; };
  const AN = [[0, 2630], [0.08, 2760], [0.16, 2930], [0.22, 2900], [0.25, 3050], [0.30, 3420], [0.32, 3320], [0.36, 3230], [0.42, 3360], [0.48, 3300], [0.55, 3350], [0.62, 3330], [0.66, 3440], [0.70, 3640], [0.75, 3860], [0.79, 4300], [0.81, 4050], [0.85, 4000], [0.89, 4120], [0.93, 4230], [0.97, 4470], [1.0, 4360]];
  const base = (u) => { for (let i = 1; i < AN.length; i++) if (u <= AN[i][0]) { const a = AN[i - 1], b = AN[i]; const k = (u - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * (0.5 - 0.5 * Math.cos(Math.PI * k)); } return AN[AN.length - 1][1]; };
  const V = (() => { const r = rng(34); let wk = 0; const v = []; for (let i = 0; i < 250; i++) { wk = wk * 0.82 + (r() - 0.5) * 80; v.push(base(i / 249) + wk); } return v; })();
  const REC = (() => { let m = V[0]; const out = []; for (let i = 1; i < V.length; i++) if (V[i] > m) { m = V[i]; out.push(i); } return out; })(); // 53
  const CH = { x0: 170, x1: 1750, lo: 2550, hi: 4560, y0: 880, y1: 330 };
  const vy = (v) => lerp(CH.y0, CH.y1, (v - CH.lo) / (CH.hi - CH.lo));
  const vx = (i) => lerp(CH.x0, CH.x1, i / (V.length - 1));
  const CHART = TH.series(CH.x0, CH.x1, V.map(vy));
  const TC = w(1, 0);                                         // the line starts forming on «وصل»
  // the pen drags the thread: behind it the year's path, ahead of it the rest of the thread at the pen's height
  const CHR = TH.resample(CHART);
  const chartY = (x) => { const u = clamp((x - CH.x0) / (CH.x1 - CH.x0)) * (V.length - 1); const i = Math.min(V.length - 2, Math.floor(u)); return vy(lerp(V[i], V[i + 1], u - i)); };
  const TD0 = TC + 0.12, TD = (w(1, 6) - TD0) / ((vx(REC[REC.length - 1]) - CH.x0) / (CH.x1 - CH.x0)); // the 53rd lands on «53»
  const xPen = (t) => lerp(CH.x0, CH.x1, clamp((t - TD0) / TD));
  key(TC - 0.55, 0.55, stat(flat(vy(V[0]))), { wave: 0, dir: 1 });
  const KC = key(TD0, 0, (t) => { const xf = xPen(t); const yf = chartY(xf); return CHR.map(([x, y]) => (x <= xf ? [x, y] : [x, yf])); });
  KC.sx = [CH.x0, CH.x1];
  const recT = REC.map((i) => TD0 + TD * (vx(i) - CH.x0) / (CH.x1 - CH.x0));
  sfx(TD0 - 0.05, 'scribble', 0.08, { d: TD }); sfx(TD0, 'riser', 0.07, { d: TD });
  recT.forEach((tt, k) => sfx(tt, 'tick', 0.045, { f: 1700 + k * 32, pan: +(((vx(REC[k]) - 960) / 960) * 0.4).toFixed(2) }));
  sfx(w(1, 6), 'chime', 0.2); sfx(w(1, 6) + 0.02, 'pop', 0.16, { f: 880 });
  SH.labels.push([2.15, '00', 'قمم 2025']);
  SH.src.push({ t0: w(2, 0), t1: w(3, 0) + 0.9, s: 'المصدر: مجلس الذهب العالمي' });
  const Q = [{ s: 'شنو', t: w(3, 0) }, { s: 'اللي', t: w(3, 1) }, { s: 'حرّك', t: w(3, 2), color: C.red }, { s: 'سعره؟', t: w(3, 3) }];
  sfx(w(3, 0) - 0.05, 'whoosh', 0.1, { d: 0.35 });
  const TF = w(4, 0) - 0.45;                                   // the year folds flat into the lesson line
  SH.cam.push([2.05, 1.14, 960, 560], [TD0 + TD, 1.0, 960, 540]);

  function hook(ctx, t, P) {
    // quarter axis (hairline)
    const ax = cio(t, TC - 0.2, 0.5) * outA(t, TF, 0.4);
    if (ax > 0) {
      ctx.save(); ctx.globalAlpha *= ax; ctx.strokeStyle = hexA(C.ink, 0.16); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(CH.x0, 930); ctx.lineTo(CH.x1, 930); ctx.stroke();
      for (let q = 0; q <= 4; q++) { const x = lerp(CH.x0, CH.x1, q / 4); ctx.beginPath(); ctx.moveTo(x, 922); ctx.lineTo(x, 938); ctx.stroke(); if (q < 4) lat(ctx, 'Q' + (q + 1), lerp(CH.x0, CH.x1, (q + 0.5) / 4), 968, { size: 22, w: 600, color: hexA(C.ink, 0.4), align: 'center' }); }
      ctx.restore();
    }
  }
  // record knots ride on the thread (drawn over it)
  function knots(ctx, t, P) {
    const mo = outA(t, TF, 0.45);
    if (mo > 0) REC.forEach((i, k) => { const p = popP(t, recT[k] - 0.02); if (p <= 0) return; const x = vx(i), y = vy(V[i]); ctx.save(); ctx.globalAlpha *= mo; ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = '#A57B26'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x, y, 6 * p, 0, 6.283); ctx.fill(); ctx.stroke(); ctx.restore(); });
    // the pen while the year draws, then the «now» point pulsing
    if (t >= TD0 - 0.1 && t < TD0 + TD + 0.3) { const x = xPen(t); TH.head(ctx, x, chartY(x), t, { r: 9, alpha: cio(t, TD0 - 0.1, 0.15) * outA(t, TD0 + TD, 0.25) }); }
    if (t > TD0 + TD - 0.1 && t < TF + 0.3) TH.head(ctx, CH.x1, vy(V[249]), t, { r: 8, alpha: cio(t, TD0 + TD - 0.1, 0.3) * outA(t, TF, 0.3) });
  }
  function hookTop(ctx, t, P) {
    knots(ctx, t, P);
    // «2025» rises out of the line, then docks top-left over the counter
    const yr = cio(t, w(0, 1) - 0.15, 0.4), dock = cio(t, TC - 0.15, 0.7), fade = outA(t, w(3, 0) - 0.5, 0.4);
    if (yr > 0 && fade > 0) {
      const size = lerp(230, 66, dock); const wd = latW(ctx, '2025', size, 700); const cx = lerp(960, 170 + latW(ctx, '2025', 66, 700) / 2, dock), cy = lerp(520, 236, dock);
      ctx.save(); ctx.globalAlpha *= fade;
      const draw = () => lat(ctx, '2025', cx - wd / 2, cy + (1 - yr) * 200, { size, w: 700, color: C.ink, track: -2 });
      if (dock <= 0) fromLine(ctx, 540, draw, { gap: 8 }); else draw();
      ctx.restore();
    }
    // counter: new highs so far
    const cp = cio(t, TC + 0.1, 0.4) * fade;
    if (cp > 0) {
      const tq = Math.ceil(t * 60 - 1e-6) / 60; let n = 0; for (const tt of recT) if (tt <= tq) n++;
      ctx.save(); ctx.globalAlpha *= cp; lat(ctx, String(n), 166, 392, { size: 150, w: 700, color: '#B4892F', track: -4 });
      txt(ctx, 'قمة قياسية جديدة', 172, 452, { size: 36, w: 'S', color: C.slate, align: 'left' }); ctx.restore();
    }
    head(ctx, Q, 205, t, { size: 84, w: 'S', color: C.ink, out: K.outAt(t, TF - 0.05, 0.4) });
  }
  SH.st.push({ t0: 2.05, t1: TF + 0.6, back: hook, front: hookTop });

  // ================================================================ THE QUESTION + five beads · «بهذا الدرس سنتعلم ما يحرّك سعر الذهب…»
  key(TF, 0.95, () => F600, { mode: 'settle', y: Y0, wave: 1.3, sx: [CH.x0, CH.x1] });
  sfx(TF - 0.05, 'whoosh', 0.14, { d: 0.9, up: false }); sfx(TF + 0.9, 'pluck', 0.12, { f: 110 });
  SH.labels.push([TF + 0.3, '00', 'خريطة الدرس']);
  const TITLE = [{ s: 'شنو', t: w(4, 3) }, { s: 'يحرّك', t: w(4, 4) }, { s: 'سعر', t: w(4, 5) }, { s: 'الذهب؟', t: w(4, 6) }];
  TITLE.forEach((x) => sfx(x.t, 'pop', 0.08, { f: 640 }));
  const BX = [1560, 1260, 960, 660, 360];
  const NAMES = ['عدم اليقين', 'الدولار', 'الفائدة والتضخم', 'الطلب والعرض', 'مواعيد معروفة'];
  const BT = BX.map((_, i) => w(5, 1) + i * 0.31);
  BT.forEach((tt, i) => { sfx(tt, 'bloop', 0.13, { pan: +(((BX[i] - 960) / 960) * 0.4).toFixed(2) }); });
  const WOB0 = w(6, 0) - 0.1, WOB1 = w(7, 0) - 0.35;
  key(WOB0, 0, (t) => TH.wobble(F600, t, 26 * cio(t, WOB0, 0.45) * (1 - cio(t, WOB1 - 0.45, 0.45)), { seed: 2 }));
  sfx(WOB0 + 0.05, 'stretch', 0.13);
  const EXIT = w(7, 0) - 0.42;
  sfx(EXIT, 'whoosh', 0.14, { d: 0.5, up: false });
  SH.beads = { BX, NAMES };  // the summary brings them back

  function beads(ctx, t, P, o) {
    BX.forEach((bx, i) => {
      const p = popP(t, BT[i]); if (p <= 0) return;
      const slide = A.ei(t, EXIT + i * 0.05, 0.55); const x = bx - slide * 2300; const y = TH.yAt(P, x);
      if (o === 'chips') {
        const ca = clamp(p * 2) * outA(t, EXIT - 0.05, 0.3); if (ca <= 0) return;
        ctx.save(); ctx.globalAlpha *= ca; ctx.strokeStyle = hexA(C.ink, 0.25); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y + 20); ctx.lineTo(x, y + 62); ctx.stroke(); ctx.restore();
        chip(ctx, NAMES[i], x, y + 96, { size: 27, p: ca });
        lat(ctx, '0' + (i + 1), x, y - 40, { size: 22, w: 600, color: hexA(C.ink, 0.45 * ca), align: 'center' });
      } else TH.bead(ctx, x, y, 17 * Math.min(1, p));
    });
  }
  function quest(ctx, t, P) {
    if (t < w(4, 0) - 0.2) return;
    const ko = outA(t, EXIT - 0.1, 0.4);
    txt(ctx, 'بهذا الدرس', 960, 262 - (1 - cio(t, w(4, 0), 0.35)) * 20, { size: 34, w: 'S', color: C.slate, align: 'center', alpha: cio(t, w(4, 0), 0.35) * ko });
    head(ctx, TITLE, 380, t, { size: 96, w: 'S', color: C.ink, out: K.outAt(t, EXIT - 0.1, 0.4) });
    rise(ctx, [{ s: 'مو', t: w(6, 0) }, { s: 'بطريقة', t: w(6, 1) }, { s: 'متوقّعة', t: w(6, 2), color: C.red }], 900, t, { size: 48, w: 'S', color: C.slate, out: K.outAt(t, EXIT - 0.05, 0.35) });
  }
  SH.st.push({ t0: w(4, 0) - 0.3, t1: EXIT + 1.0, back: (ctx, t, P) => beads(ctx, t, P, 'chips'), front: (ctx, t, P) => { beads(ctx, t, P, 'beads'); quest(ctx, t, P); } });

  // ================================================================ 01 · UNCERTAINTY
  const D1 = { t0: w(7, 0) - 0.06, t1: w(9, 0) - 0.4, y: Y0, sw: 'slateD', idx: '01', words: [{ s: 'عدم', t: w(8, 0) }, { s: 'اليقين', t: w(8, 1) }] };
  SH.divs.push(D1); SH.labels.push([D1.t0 + 0.1, '01', 'عدم اليقين']);
  key(D1.t0 - 0.04, 0, (t) => TH.twang(F600, t, D1.t0, 22));
  sfx(D1.t0, 'whoosh', 0.16, { d: 0.45 }); sfx(D1.t0 + 0.02, 'pluck', 0.2, { f: 87 }); sfx(D1.t1, 'whoosh', 0.12, { d: 0.45, up: false });
  // the shelter: the thread lifts into a house around the gold
  const HS = { l: 790, r: 1130, top: 440, apex: 290 };
  const HOUSE = TH.join([[TH.XL, Y0], [HS.l, Y0], [HS.l, HS.top], [960, HS.apex], [HS.r, HS.top], [HS.r, Y0], [TH.XR, Y0]]);
  const TH1 = D1.t1 + 0.42;  // the shelter rises once the chapter panel has folded away
  key(TH1, 0.85, stat(HOUSE), { mode: 'rise', y0: Y0, wave: 0.3, dir: 0, ease: TH.backE });
  sfx(TH1, 'stretch', 0.14); sfx(TH1 + 0.55, 'pluck', 0.1, { f: 131 });
  const T1 = { gold: w(9, 3), haven: w(9, 4), worry: w(10, 3), wars: w(11, 1), crises: w(11, 2), notAlways: w(12, 1), fall: w(12, 2), march: w(13, 0) - 0.1, sold: w(14, 2), others: w(14, 4), cash: w(14, 8) };
  sfx(T1.gold - 0.05, 'whoosh', 0.1, { d: 0.3 }); sfx(T1.gold + 0.2, 'chime', 0.12); sfx(T1.haven, 'pop', 0.16, { f: 760 });
  const STORM = [{ s: 'القلق', x: 470, y: 380, t: T1.worry }, { s: 'الحروب', x: 1450, y: 320, t: T1.wars }, { s: 'الأزمات', x: 1500, y: 470, t: T1.crises }];
  STORM.forEach((c) => { sfx(c.t, 'pop', 0.14, { f: 520, pan: +(((c.x - 960) / 960) * 0.5).toFixed(2) }); });
  key(T1.fall, 0.42, () => F600, { mode: 'settle', y: Y0, wave: 0.15, dir: 0, ease: (p) => p * p });
  sfx(T1.notAlways, 'glitch', 0.08); sfx(T1.fall + 0.38, 'slam', 0.18); sfx(T1.fall + 0.4, 'pluck', 0.12, { f: 73 });
  // March 2020: the dash for cash — a sharp V in the gold line
  const MY = [430, 412, 400, 394, 402, 418, 440, 470, 520, 600, 690, 732, 690, 626, 566, 534, 512, 522, 506, 500];
  const MX0 = 330, MX1 = 1170;
  const MARCH = TH.series(MX0, MX1, TH.smooth(MY.map((y, i) => [i, y]), 6).map((p) => p[1]));
  const KM = key(T1.march, 1.3, stat(MARCH), { mode: 'rise', y0: Y0, wave: 4, sx: [MX0, MX1] });
  sfx(T1.march, 'scribble', 0.09, { d: 1.2 });
  const ASSETS = [{ s: 'ذهب', y: 640, t: T1.sold, gold: true }, { s: 'أسهم', y: 730, t: T1.others }, { s: 'سندات', y: 820, t: T1.others + 0.18 }];
  ASSETS.forEach((a) => sfx(a.t, 'pop', 0.13, { f: 600, pan: 0.3 }));
  sfx(T1.cash - 0.3, 'whoosh', 0.1, { d: 0.35 }); sfx(T1.cash, 'pop', 0.18, { f: 900, pan: 0.3 });
  SH.src.push({ t0: w(15, 0), t1: w(16, 0) - 0.3, s: 'المصدر: مجلس الذهب العالمي' });
  const S1 = w(16, 0) - 0.62;
  key(S1, 0.5, () => F600, { mode: 'settle', y: Y0, wave: 0.8, dir: 1 });

  function unc(ctx, t, P) {
    // inside the shelter: a warm glow that grows with every worry
    const hv = cio(t, TH1 + 0.3, 0.5) * outA(t, T1.fall - 0.05, 0.25);
    if (hv > 0) {
      const g = 0.06 + 0.05 * STORM.filter((c) => t > c.t).length;
      ctx.save(); ctx.globalAlpha *= hv; ctx.beginPath(); ctx.moveTo(HS.l, Y0); ctx.lineTo(HS.l, HS.top); ctx.lineTo(960, HS.apex); ctx.lineTo(HS.r, HS.top); ctx.lineTo(HS.r, Y0); ctx.closePath();
      const gg = ctx.createLinearGradient(0, HS.apex, 0, Y0); gg.addColorStop(0, hexA('#E2BE62', g * 0.6)); gg.addColorStop(1, hexA('#E2BE62', g * 1.8)); ctx.fillStyle = gg; ctx.fill(); ctx.restore();
    }
    // the ingot rises out of the thread into the shelter, and falls through it when the shelter collapses
    const ig = sp(t, T1.gold, 12, 0.6); const fall = clamp((t - T1.fall - 0.05) / 0.5);
    if (ig > 0 && fall < 1) {
      const y = 532 + (1 - Math.min(1, ig)) * 90 + fall * fall * 260;
      fromLine(ctx, Y0 + 2 - 0, () => GK.ingot(ctx, 875, y, 170, 64, { depth: 22, shadow: false }), { gap: 2 });
    }
    // worries outside, arrows toward the shelter
    STORM.forEach((c) => {
      const p = popP(t, c.t); if (p <= 0) return; const a = outA(t, T1.notAlways - 0.1, 0.3);
      ctx.save(); ctx.globalAlpha *= a; chip(ctx, c.s, c.x, c.y, { size: 28, p, dot: C.red });
      const tx = c.x < 960 ? HS.l - 30 : HS.r + 30; arrow(ctx, c.x + (c.x < 960 ? 70 : -80), c.y + 30, tx, lerp(c.y, 470, 0.7), cio(t, c.t + 0.1, 0.4), { dash: [8, 7], color: hexA(C.ink, 0.55), w: 2.5, head: 12 });
      ctx.restore();
    });
    // March 2020
    if (t > T1.march - 0.1) {
      const a = cio(t, T1.march, 0.4) * outA(t, S1 - 0.1, 0.35);
      ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = hexA(C.ink, 0.16); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(MX0, 840); ctx.lineTo(MX1, 840); ctx.stroke();
      for (let k = 0; k <= 4; k++) { const x = lerp(MX0, MX1, k / 4); ctx.beginPath(); ctx.moveTo(x, 832); ctx.lineTo(x, 848); ctx.stroke(); } ctx.restore();
      tok(ctx, 'آذار 2020', 750, 896, { size: 24, p: popP(t, T1.march + 0.05) * a });
      chip(ctx, 'كورونا', 1010, 770, { size: 26, p: popP(t, w(13, 3)) * a, dot: C.red });
      if (t < KM.t + KM.d + 0.1) { const x = TH.frontX(KM, t); TH.head(ctx, x, TH.yAt(P, x), t, { r: 8, alpha: outA(t, KM.t + KM.d - 0.1, 0.15) }); }
      // investors sold gold with everything else → cash
      const merge = cio(t, T1.cash - 0.35, 0.45);
      ASSETS.forEach((as) => {
        const p = popP(t, as.t) * a; if (p <= 0) return; const y = lerp(as.y, 930, merge), x = 1560; const k = 1 - merge * 0.7;
        ctx.save(); ctx.globalAlpha *= 1 - merge * merge; ctx.translate(x, y); ctx.scale(k, k);
        if (as.gold) GK.pill(ctx, as.s, 0, 0, { style: 'gold', size: 26, p }); else chip(ctx, as.s, 0, 0, { size: 26, p });
        chev(ctx, 92, 2, 16, 1, C.red, clamp(p));
        ctx.restore();
      });
      tok(ctx, 'سيولة  $', 1560, 930, { size: 28, p: popP(t, T1.cash) * a, latin: false });
    }
  }
  function uncTop(ctx, t, P) {
    // the shelter's tag: «ملاذ آمن» → «مو دايماً»
    const flip = cio(t, T1.notAlways - 0.08, 0.2);
    GK.pill(ctx, 'ملاذ آمن', 960, 222, { style: 'gold', size: 30, p: popP(t, T1.haven) * (1 - flip) });
    GK.pill(ctx, 'مو دايماً', 960, 222, { style: 'red', size: 30, p: popP(t, T1.notAlways) * outA(t, T1.march + 0.5, 0.3) });
    rise(ctx, wl(9), 806, t, { size: 46, w: 'R', color: C.slate, out: K.outAt(t, w(10, 0) - 0.3, 0.3) });
    rise(ctx, wl(10).concat(wl(11)), 806, t, { size: 46, w: 'R', color: C.slate, out: K.outAt(t, T1.notAlways - 0.15, 0.3) });
    rise(ctx, wl(14), 186, t, { size: 46, w: 'R', color: C.ink, out: K.outAt(t, S1 - 0.15, 0.3) });
  }
  SH.st.push({ t0: D1.t1, t1: S1 + 0.6, back: unc, front: uncTop });

  // ================================================================ 02 · THE DOLLAR
  const D2 = { t0: w(16, 0) - 0.06, t1: w(18, 0) - 0.42, y: Y0, sw: 'lavD', idx: '02', words: [{ s: 'الدولار', t: w(17, 0) }, { s: 'الأمريكي', t: w(17, 1) }] };
  SH.divs.push(D2); SH.labels.push([D2.t0 + 0.1, '02', 'الدولار الأمريكي']);
  key(D2.t0 - 0.04, 0, (t) => TH.twang(F600, t, D2.t0, 22));
  sfx(D2.t0, 'whoosh', 0.16, { d: 0.45 }); sfx(D2.t0 + 0.02, 'pluck', 0.2, { f: 98 }); sfx(D2.t1, 'whoosh', 0.12, { d: 0.45, up: false });
  const T2 = { xau: w(18, 0), usd: w(18, 3), strong: w(19, 1), press: w(19, 3), weak: w(20, 0), lift: w(20, 1), ex: w(21, 0), up5: w(22, 1), pct: w(22, 3), other: w(22, 6), oz: w(23, 1), dear: w(23, 2), same: w(24, 4), demand: w(25, 2), fixed: w(26, 1), end: w(27, 0) - 0.62 };
  const land = T2.usd + 0.24;
  // the dollar presses on the gold line; when it weakens the line springs up
  const DIP = (t) => K.springs(t, 0, [[land, 34], [T2.strong, 72], [T2.press, 132], [T2.weak, 58], [T2.lift, -74], [T2.ex - 0.05, 0]], 11, 0.42);
  key(D2.t1 + 0.2, 0, (t) => { const d = DIP(t); return d === 0 ? F600 : F600.map(([x, y]) => [x, y + d * Math.exp(-Math.pow((x - 960) / 250, 2))]); });
  const bScale = (t) => K.springs(t, 1, [[T2.strong, 1.32], [T2.weak, 0.72]], 12, 0.5);
  sfx(T2.xau, 'pop', 0.14, { f: 820 }); sfx(T2.usd + 0.02, 'whoosh', 0.1, { d: 0.22 }); sfx(land, 'slam', 0.22); sfx(land + 0.02, 'pluck', 0.12, { f: 65 });
  sfx(T2.strong, 'stretch', 0.12); sfx(T2.press, 'slam', 0.12); sfx(T2.weak, 'bloop', 0.12); sfx(T2.lift, 'pluck', 0.16, { f: 131 }); sfx(T2.ex - 0.15, 'whoosh', 0.14, { d: 0.5 });
  // the worked example: two Lism cards standing on the thread; the other-currency card is lifted 5 %
  const SHELF = 770; const LIFT = (t) => 34 * Math.min(1.08, sp(t, T2.dear, 12, 0.55));
  const SHF = FLAT(SHELF);
  const wob2 = (t) => 18 * cio(t, T2.fixed - 0.1, 0.4) * (1 - cio(t, T2.end - 0.35, 0.3));
  key(T2.ex + 0.95, 0.7, (t) => TH.wobble(SHF.map(([x, y]) => [x, y - LIFT(t) * win(x, 330, 890, 46)]), t, wob2(t), { seed: 5 }), { wave: 0.4, dir: 1 });
  sfx(T2.ex, 'pop', 0.14, { f: 700 }); sfx(T2.ex + 1.0, 'whoosh', 0.1, { d: 0.6, up: false });
  sfx(T2.up5, 'pop', 0.14, { f: 760 }); sfx(T2.pct, 'pop', 0.16, { f: 980 }); sfx(T2.other, 'pop', 0.12, { f: 620 });
  sfx(T2.dear - 0.02, 'type', 0.08, { d: 0.5, n: 6 }); sfx(T2.dear + 0.1, 'pluck', 0.12, { f: 147 }); sfx(T2.same, 'tick', 0.14, { f: 2600 }); sfx(T2.demand, 'bloop', 0.12); sfx(T2.fixed, 'stretch', 0.12);
  key(T2.end, 0.55, stat(flat(Y0)), { wave: 0.5, dir: 1 });
  sfx(T2.end, 'whoosh', 0.1, { d: 0.5 });

  function dollarBack(ctx, t, P) {
    // XAU/USD token
    const xa = popP(t, T2.xau) * outA(t, T2.ex - 0.2, 0.3);
    if (xa > 0) { tok(ctx, 'XAU/USD', 960, 300, { size: 34, p: xa }); txt(ctx, 'سعر الذهب العالمي بالدولار', 960, 378, { size: 30, w: 'R', color: C.slate, align: 'center', alpha: clamp(xa) }); }
  }
  function dollarFront(ctx, t, P) {
    // the dollar weight
    if (t > T2.usd - 0.05 && t < T2.ex + 1.0) {
      const drop = clamp((t - T2.usd) / (land - T2.usd)); const away = A.ei(t, T2.ex - 0.1, 0.6);
      const yc = TH.yAt(P, 960); const s = 140 * bScale(t); const yb = drop < 1 ? lerp(-260, yc - 4, drop * drop) : yc - 4;
      const y = yb - away * 900;
      ctx.save(); ctx.translate(960, y); A.roundRect(ctx, -s / 2, -s, s, s, 22 * s / 140); ctx.fillStyle = C.ink; ctx.fill();
      lat(ctx, '$', 0, -s * 0.28, { size: 92 * s / 140, w: 700, color: '#FFFFFF', align: 'center' }); ctx.restore();
      const la = outA(t, T2.ex - 0.2, 0.3);
      if (t > T2.strong - 0.1) { ctx.save(); ctx.globalAlpha *= la; chip(ctx, 'قوة الدولار', 560, 380, { size: 28, p: popP(t, T2.strong) }); chev(ctx, 560, 440, 26, 1, C.ink, cio(t, T2.press, 0.3)); txt(ctx, 'تضغط على الذهب', 560, 505, { size: 28, w: 'R', color: C.slate, align: 'center', alpha: cio(t, T2.press, 0.3) }); ctx.restore(); }
      if (t > T2.weak - 0.1) { ctx.save(); ctx.globalAlpha *= la; chip(ctx, 'ضعف الدولار', 1360, 380, { size: 28, p: popP(t, T2.weak) }); chev(ctx, 1360, 440, 26, -1, C.ink, cio(t, T2.lift, 0.3)); txt(ctx, 'يدعم الذهب', 1360, 505, { size: 28, w: 'R', color: C.slate, align: 'center', alpha: cio(t, T2.lift, 0.3) }); ctx.restore(); }
    }
    if (t < T2.ex - 0.1) return;
    const fa = outA(t, T2.end - 0.15, 0.35);
    ctx.save(); ctx.globalAlpha *= fa;
    chip(ctx, 'مثال تعليمي افتراضي', 960, 200, { size: 26, p: popP(t, T2.ex) });
    // the move: «الدولار +5% مقابل عملة ثانية»
    chip(ctx, 'الدولار', 1250, 318, { size: 30, p: popP(t, T2.up5) }); tok(ctx, '+5%', 1112, 318, { size: 30, p: popP(t, T2.pct) });
    txt(ctx, 'مقابل عملة ثانية', 1030, 329, { size: 32, w: 'S', color: C.ink, alpha: cio(t, T2.other - 0.1, 0.3) });
    // cards on the shelf
    const ca = cio(t, T2.ex + 1.1, 0.4); if (ca > 0) {
      const yR = TH.yAt(P, 1310) - 4, yL = TH.yAt(P, 610) - 4; const Hc = 270;
      card(ctx, 1030, yR - Hc, 560, Hc, { alpha: ca }); card(ctx, 330, yL - Hc, 560, Hc, { alpha: ca });
      ctx.save(); ctx.globalAlpha *= ca;
      txt(ctx, 'سعر الأونصة بالدولار', 1560, yR - Hc + 56, { size: 28, w: 'S', color: C.slate });
      txt(ctx, 'سعر الأونصة بالعملة الثانية', 860, yL - Hc + 56, { size: 28, w: 'S', color: C.slate });
      lat(ctx, '$4,000', 1310, yR - 100, { size: 88, w: 600, color: C.ink, align: 'center' });
      const v = Math.round(roll(t, T2.dear, 0.5, 4000, 4200)); lat(ctx, v.toLocaleString('en-US'), 610, yL - 100, { size: 88, w: 600, color: C.ink, align: 'center' });
      tok(ctx, '+5%', 820, yL - Hc + 120, { size: 26, p: popP(t, T2.dear + 0.15) });
      GK.pill(ctx, 'ما تغيّر', 1310, yR - Hc - 34, { style: 'gold', size: 24, p: popP(t, T2.same) });
      // demand gauge on the dearer side
      const dm = popP(t, T2.demand - 0.25); if (dm > 0) { const bw = lerp(300, 200, cio(t, T2.demand, 0.6)); const bx = 600 - 190; const gy = yL - 48; ctx.save(); ctx.globalAlpha *= clamp(dm); txt(ctx, 'الطلب', 862, gy + 18, { size: 26, w: 'S', color: C.ink }); A.roundRect(ctx, bx, gy, 300, 20, 10); ctx.fillStyle = hexA(C.ink, 0.08); ctx.fill(); A.roundRect(ctx, bx, gy, bw, 20, 10); ctx.fillStyle = C.slate; ctx.fill(); chev(ctx, bx + bw + 24, gy + 10, 18, 1, C.red, cio(t, T2.demand, 0.3)); ctx.restore(); }
      ctx.restore();
    }
    GK.pill(ctx, 'العلاقة مو ثابتة', 960, 940, { style: 'red', size: 28, p: popP(t, T2.fixed) });
    ctx.restore();
  }
  SH.st.push({ t0: D2.t1, t1: T2.end + 0.6, back: dollarBack, front: dollarFront });
})(typeof window !== 'undefined' ? window : globalThis);
