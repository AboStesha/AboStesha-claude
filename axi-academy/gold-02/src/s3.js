// Gold 02 · scenes 3 — 05 known dates · tendencies, not laws (1980 → 2008) · summary · next lesson · the thread ties off into the X.
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

  // ================================================================ 05 · KNOWN DATES
  const D5 = { t0: w(62, 0) - 0.06, t1: w(64, 0) - 0.42, y: Y0, sw: 'ink', idx: '05', words: [{ s: 'مواعيد', t: w(63, 0) }, { s: 'معروفة', t: w(63, 1) }] };
  SH.divs.push(D5); SH.labels.push([D5.t0 + 0.1, '05', 'مواعيد معروفة']);
  key(D5.t0 - 0.04, 0, (t) => TH.twang(F600, t, D5.t0, 22));
  sfx(D5.t0, 'whoosh', 0.16, { d: 0.45 }); sfx(D5.t0 + 0.02, 'pluck', 0.2, { f: 131 }); sfx(D5.t1, 'whoosh', 0.12, { d: 0.45, up: false });
  const T5 = { month: w(64, 0), cpi: w(64, 3), infl: w(65, 1), jobs: w(66, 0), fomc: w(67, 0), eight: w(67, 5), mkt: w(68, 0), exp: w(68, 4), num: w(69, 1), news: w(70, 2), check: w(71, 0), fed: w(71, 3), bls: w(71, 4), change: w(72, 2), end: w(73, 0) - 0.5 };
  const MX = (m) => lerp(250, 1670, m / 12);                // month m (0..12) → x
  const FOMC = [0.9, 2.55, 3.95, 5.55, 6.95, 8.5, 9.9, 11.3]; // eight scheduled meetings across the year
  const reactions = (t) => cio(t, T5.exp, 0.6) * (1 - cio(t, T5.end - 0.3, 0.4)); // the line jumps around the meetings
  const spike = (t) => 150 * Math.exp(-Math.pow((t - T5.news - 0.05) / 0.32, 2));
  key(D5.t1 + 0.4, 0, (t) => {
    const ex = reactions(t); const sk = spike(t);
    if (ex === 0 && sk < 0.5) return F600;
    return F600.map(([x, y]) => { let d = 0; FOMC.forEach((m, i) => { d += (i % 2 ? 1 : -1) * (34 + (i * 17) % 26) * ex * Math.exp(-Math.pow((x - MX(m) - 18) / 26, 2)); }); d -= sk * Math.exp(-Math.pow((x - 1215) / 18, 2)) * (Math.sin((x - 1215) * 0.2) > 0 ? 1 : -0.6); return [x, y + d]; });
  });
  sfx(T5.month, 'type', 0.07, { d: 0.9, n: 12 }); sfx(T5.cpi, 'pop', 0.14, { f: 720 }); sfx(T5.jobs, 'type', 0.06, { d: 0.9, n: 12 }); sfx(T5.jobs + 0.1, 'pop', 0.12, { f: 600 });
  sfx(T5.fomc, 'pop', 0.14, { f: 820 }); FOMC.forEach((m, i) => sfx(T5.eight - 0.25 + i * 0.07, 'tick', 0.09, { f: 2000 + i * 120, pan: +(((MX(m) - 960) / 960) * 0.5).toFixed(2) }));
  sfx(T5.exp, 'stretch', 0.12); sfx(T5.num, 'pop', 0.1, { f: 500 }); sfx(T5.news - 0.08, 'glitch', 0.14); sfx(T5.news, 'slam', 0.1);
  sfx(T5.fed, 'pop', 0.14, { f: 760 }); sfx(T5.bls, 'pop', 0.14, { f: 680 }); sfx(T5.change, 'whoosh', 0.08, { d: 0.3 }); sfx(T5.change + 0.28, 'click', 0.14);

  function mini(ctx, x, y, t, o) { // a Lism calendar card with one highlighted day that can move
    card(ctx, x - 150, y - 120, 300, 230, { alpha: o.a });
    ctx.save(); ctx.globalAlpha *= o.a;
    txt(ctx, o.title, x + 128, y - 78, { size: 24, w: 'S', color: C.ink });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { const cx = x - 120 + c * 46, cy = y - 46 + r * 38; A.roundRect(ctx, cx, cy, 36, 28, 6); ctx.fillStyle = hexA(C.ink, 0.06); ctx.fill(); }
    const mv = cio(t, T5.change, 0.45); const c0 = o.c0, c1 = o.c1; const cx = lerp(x - 120 + c0[0] * 46, x - 120 + c1[0] * 46, mv), cy = lerp(y - 46 + c0[1] * 38, y - 46 + c1[1] * 38, mv) - Math.sin(mv * Math.PI) * 30;
    A.roundRect(ctx, cx, cy, 36, 28, 6); ctx.fillStyle = o.col; ctx.fill();
    ctx.restore();
  }
  function dates(ctx, t, P) {
    const a = cio(t, D5.t1 + 0.2, 0.3) * outA(t, T5.end - 0.1, 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    // month ticks under the thread
    for (let m = 0; m <= 12; m++) { const x = MX(m); ctx.fillStyle = hexA(C.ink, 0.25); ctx.fillRect(x - 1, Y0 + 14, 2, 14); if (m < 12) lat(ctx, String(m + 1), MX(m + 0.5), Y0 + 58, { size: 20, w: 600, color: hexA(C.ink, 0.4), align: 'center' }); }
    // monthly CPI and jobs reports (two rows of dots)
    for (let m = 0; m < 12; m++) {
      const pc = popP(t, T5.month + m * 0.08); if (pc > 0) { ctx.fillStyle = '#B07F84'; ctx.beginPath(); ctx.arc(MX(m + 0.42), 490, 9 * Math.min(1, pc), 0, 6.283); ctx.fill(); }
      const pj = popP(t, T5.jobs + m * 0.08); if (pj > 0) { ctx.fillStyle = C.slate; ctx.beginPath(); ctx.arc(MX(m + 0.12), 370, 9 * Math.min(1, pj), 0, 6.283); ctx.fill(); }
    }
    ctx.restore();
    // row headers (right-aligned above each row)
    const cw = txt(ctx, 'مؤشر أسعار المستهلك · كل شهر', 1670, 452, { size: 26, w: 'S', color: C.ink, alpha: a * cio(t, T5.cpi, 0.3) });
    tok(ctx, 'CPI', 1670 - cw - 44, 443, { size: 22, p: popP(t, T5.cpi) * a });
    txt(ctx, 'يعني التضخم', 1670 - cw - 90, 452, { size: 26, w: 'R', color: C.slate, alpha: a * cio(t, T5.infl, 0.3) });
    txt(ctx, 'تقرير الوظائف · كل شهر', 1670, 332, { size: 26, w: 'S', color: C.ink, alpha: a * cio(t, T5.jobs, 0.3) });
    // eight scheduled FOMC meetings: gold diamonds on the thread
    FOMC.forEach((m, i) => { const p = popP(t, T5.eight - 0.25 + i * 0.07); if (p <= 0) return; const x = MX(m), y = TH.yAt(P, x); ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); const s = 13 * Math.min(1, p); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(-s, -s, 2 * s, 2 * s); ctx.strokeStyle = '#A57B26'; ctx.lineWidth = 3; ctx.strokeRect(-s, -s, 2 * s, 2 * s); ctx.restore(); });
    const fa = a * outA(t, T5.check - 0.2, 0.3);
    chip(ctx, 'لجنة السوق المفتوحة', 1200, 760, { size: 26, p: popP(t, T5.fomc) * fa });
    tok(ctx, '× 8', 960, 760, { size: 26, p: popP(t, T5.eight) * fa });
    txt(ctx, 'اجتماعات مجدولة', 900 - 10, 770, { size: 26, w: 'R', color: C.slate, align: 'right', alpha: fa * cio(t, T5.eight + 0.1, 0.3) });
    // the market moves on changing rate expectations, not the number alone
    GK.pill(ctx, 'تغيّر توقعات الفائدة', 760, 196, { style: 'gold', size: 28, p: popP(t, T5.exp) * a });
    const nm = popP(t, T5.num) * a; if (nm > 0) { chip(ctx, 'الرقم لوحده', 1180, 196, { size: 26, p: nm, color: hexA(C.ink, 0.6) }); ctx.save(); ctx.globalAlpha *= clamp(nm); ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1100, 196); ctx.lineTo(lerp(1100, 1262, cio(t, T5.num + 0.15, 0.3)), 196); ctx.stroke(); ctx.restore(); }
    // breaking news: a spike off the calendar
    GK.pill(ctx, 'أخبار مفاجئة', 1215, 300, { style: 'red', size: 26, p: popP(t, T5.news) * a * outA(t, T5.check, 0.3) });
  }
  function datesTop(ctx, t, P) {
    const a = cio(t, T5.check - 0.1, 0.3) * outA(t, T5.end - 0.1, 0.4); if (a <= 0) return;
    // official calendars: Fed + BLS — dates can move
    const lift = (tt) => (1 - Math.min(1, sp(t, tt, 12, 0.6))) * 60;
    mini(ctx, 1240, 880 + lift(T5.fed), t, { a: a * cio(t, T5.fed, 0.25), title: 'الفدرالي', c0: [2, 1], c1: [4, 2], col: '#D2A746' });
    mini(ctx, 700, 880 + lift(T5.bls), t, { a: a * cio(t, T5.bls, 0.25), title: 'مكتب إحصاءات العمل', c0: [1, 2], c1: [3, 1], col: C.slate });
    tok(ctx, 'تتغيّر أحياناً', 970, 1010, { size: 24, p: popP(t, T5.change) * a, latin: false });
  }
  SH.st.push({ t0: D5.t1, t1: T5.end + 0.6, front: dates, top: datesTop });

  // ================================================================ TENDENCIES, NOT LAWS · 1980 → 2008
  const T6 = { all: w(73, 0), tend: w(73, 1), not: w(74, 0), laws: w(74, 1), weak: w(75, 0), after: w(76, 0), peak: w(76, 3), fell: w(77, 0), pct: w(77, 3), y99: w(77, 6), stay: w(78, 0), yrs: w(78, 7), nom: w(79, 0), noinf: w(80, 0), past: w(81, 0), guide: w(82, 1), end: w(83, 0) - 0.35 };
  SH.labels.push([T6.all - 0.1, '06', 'ميول، مو قوانين']);
  // the thread underlines «كلها ميول» and then rises to cross out «قوانين»
  const UY = 700, SY = 598;
  const strike = (t) => cio(t, T6.laws + 0.12, 0.35);
  key(T5.end, 0.5, stat(flat(UY)), { wave: 0.6, dir: 1 });
  key(T6.laws, 0, (t) => { const s = strike(t); return F600.map(([x]) => [x, lerp(UY, UY - (UY - SY) * s, 1 - clamp((x - 1040) / 80))]); });
  sfx(T6.tend, 'pop', 0.12, { f: 600 }); sfx(T6.not, 'pop', 0.1, { f: 520 }); sfx(T6.laws + 0.12, 'whoosh', 0.1, { d: 0.3 }); sfx(T6.laws + 0.4, 'pluck', 0.16, { f: 98 });
  // nominal gold 1975 → 2010 (illustrative path through the real landmarks: $850 peak Jan 1980, ≈ $253 low 1999, back above $850 in 2008)
  const LP = [[1975, 165], [1976, 128], [1977, 150], [1978, 210], [1979, 330], [1979.7, 420], [1980.05, 850], [1980.3, 560], [1980.8, 640], [1981.5, 420], [1982.5, 330], [1983.2, 480], [1985, 300], [1987.9, 480], [1989, 370], [1990.5, 400], [1993, 330], [1996, 410], [1997.5, 330], [1999.55, 253], [2000, 290], [2001.3, 260], [2002.5, 320], [2004, 410], [2005.8, 500], [2006.4, 700], [2007.2, 680], [2008.05, 900], [2008.8, 760], [2009.5, 980], [2010, 1100]];
  const LX = (yr) => lerp(240, 1660, (yr - 1975) / 35), LYv = (v) => lerp(820, 300, v / 1100);
  const lpAt = (yr) => { for (let i = 1; i < LP.length; i++) if (yr <= LP[i][0]) { const a = LP[i - 1], b = LP[i]; const k = (yr - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * k; } return LP[LP.length - 1][1]; };
  const LS = Array.from({ length: 360 }, (_, i) => { const yr = 1975 + 35 * i / 359; return LYv(lpAt(yr) * (1 + 0.035 * Math.sin(i * 1.9) + 0.025 * Math.sin(i * 0.77))); });
  const LONG = TH.resample(TH.series(LX(1975), LX(2010), LS));
  const ly = (x) => { const u = clamp((x - LX(1975)) / (LX(2010) - LX(1975))) * 359; const i = Math.min(358, Math.floor(u)); return lerp(LS[i], LS[i + 1], u - i); };
  // the pen: 1975 → 1980 peak by «1980», → 1999 low by «1999», → 2008 crossing, → 2010
  const PK = [[T6.after - 0.2, 1975], [T6.peak + 0.15, 1980.05], [T6.fell, 1980.05], [T6.y99 + 0.2, 1999.55], [T6.stay + 0.1, 1999.55], [T6.yrs + 0.1, 2008.05], [T6.yrs + 0.9, 2010]];
  const penYr = (t) => { if (t <= PK[0][0]) return PK[0][1]; for (let i = 1; i < PK.length; i++) if (t <= PK[i][0]) { const a = PK[i - 1], b = PK[i]; return lerp(a[1], b[1], clamp((t - a[0]) / (b[0] - a[0]))); } return PK[PK.length - 1][1]; };
  key(T6.weak + 0.2, 0.55, stat(flat(LS[0])), { wave: 0.5, dir: -1 });
  const KL = key(PK[0][0], 0, (t) => { const xf = LX(penYr(t)), yf = ly(xf); return LONG.map(([x, y]) => (x <= xf ? [x, y] : [x, yf])); });
  sfx(PK[0][0], 'scribble', 0.08, { d: 1.3 }); sfx(T6.peak + 0.15, 'chime', 0.12); sfx(T6.fell, 'whoosh', 0.1, { d: 2.4, up: false }); sfx(T6.pct, 'pop', 0.14, { f: 520 }); sfx(T6.y99 + 0.2, 'pluck', 0.12, { f: 73 });
  sfx(T6.stay + 0.1, 'scribble', 0.07, { d: 1.6 }); sfx(T6.yrs + 0.1, 'chime', 0.12); sfx(T6.nom, 'pop', 0.12, { f: 700 }); sfx(T6.past, 'whoosh', 0.08, { d: 0.5 }); sfx(T6.guide, 'pop', 0.12, { f: 600 });

  function laws(ctx, t, P) {
    const a = cio(t, T6.all - 0.15, 0.3) * outA(t, T6.weak - 0.1, 0.35); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    rise(ctx, [{ s: 'كلها', t: T6.all, color: C.slate }, { s: 'ميول', t: T6.tend }], 646, t, { size: 130, w: 'S', color: C.ink, x: 1560, stagger: 0.03 });
    rise(ctx, [{ s: 'مو', t: T6.not, color: C.slate }, { s: 'قوانين', t: T6.laws }], 646, t, { size: 130, w: 'S', color: C.ink, x: 940, stagger: 0.03 });
    ctx.restore();
  }
  function longRun(ctx, t, P) {
    if (t < PK[0][0] - 0.4) return; const a = cio(t, PK[0][0] - 0.3, 0.4) * outA(t, T6.end, 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    // decade axis
    ctx.strokeStyle = hexA(C.ink, 0.16); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(LX(1975), 880); ctx.lineTo(LX(2010), 880); ctx.stroke();
    [1980, 1990, 2000, 2010].forEach((yr) => { const x = LX(yr); ctx.beginPath(); ctx.moveTo(x, 872); ctx.lineTo(x, 888); ctx.stroke(); lat(ctx, String(yr), x, 922, { size: 22, w: 600, color: hexA(C.ink, 0.45), align: 'center' }); });
    // the 1980 peak level, carried right
    const pky = LYv(850); const pl = cio(t, T6.peak + 0.2, 0.9);
    if (pl > 0) { dash(ctx, LX(1980.05), pky, LX(2010) + 60, pky, { p: pl, color: hexA(C.ink, 0.5) }); }
    const pk = popP(t, T6.peak + 0.15); if (pk > 0) { tok(ctx, '1980', LX(1980.05), pky - 56, { size: 24, p: pk }); }
    // −70 % to 1999
    const dy = cio(t, T6.pct - 0.1, 0.5);
    if (dy > 0 && t > T6.pct - 0.2) { const x = LX(1999.55), y1 = LYv(253); arrow(ctx, x, pky + 10, x, y1 - 14, dy, { color: C.red, w: 3, head: 14 }); tok(ctx, '−70%', x - 90, (pky + y1) / 2, { size: 26, p: popP(t, T6.pct), fill: C.red }); }
    const p99 = popP(t, T6.y99 + 0.15); if (p99 > 0) tok(ctx, '1999', LX(1999.55), LYv(253) + 50, { size: 24, p: p99 });
    // more than 20 years under the peak (nominal)
    const br = cio(t, T6.yrs - 0.2, 0.6);
    if (br > 0) { const x0 = LX(1980.05), x1 = lerp(x0, LX(2008.05), br), y = pky - 24; ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, y + 10); ctx.lineTo(x0, y); ctx.lineTo(x1, y); ctx.lineTo(x1, y + 10); ctx.stroke(); }
    ctx.restore();
    if (br > 0) txt(ctx, 'أكثر من 20 سنة تحت القمة', (LX(1980.05) + LX(2008.05)) / 2, pky - 50, { size: 32, w: 'S', color: C.ink, align: 'center', alpha: a * cio(t, T6.yrs, 0.3) });
    tok(ctx, 'بالسعر الاسمي · بدون حساب التضخم', 960, 196, { size: 26, p: popP(t, T6.nom) * a, latin: false });
    if (t > PK[0][0] && t < PK[PK.length - 1][0] + 0.3) { const x = LX(penYr(t)); TH.head(ctx, x, ly(x), t, { r: 8, alpha: a * outA(t, PK[PK.length - 1][0], 0.25) }); }
    // the past is not a guide: faint futures fanning out past 2010
    const fu = cio(t, T6.past, 0.7);
    if (fu > 0) {
      const x0 = LX(2010), y0 = LS[359];
      ctx.save(); ctx.globalAlpha *= a * fu * 0.8; ctx.setLineDash([8, 8]); ctx.strokeStyle = '#C49A3A'; ctx.lineWidth = 3;
      [-150, -40, 90, 200].forEach((d, i) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0 + 60, y0, x0 + 120, y0 + d * 0.4, x0 + 200 * fu, y0 + d * fu); ctx.stroke(); });
      ctx.restore();
      GK.pill(ctx, 'مو دليل على المستقبل', 1560, 760, { style: 'red', size: 26, p: popP(t, T6.guide) * a });
    }
  }
  SH.st.push({ t0: T6.all - 0.3, t1: T6.end + 0.5, front: (ctx, t, P) => { laws(ctx, t, P); longRun(ctx, t, P); } });

  // ================================================================ SUMMARY · the five beads come back along the thread
  const T7 = { sum: w(83, 0), all: w(88, 0), notSure: w(89, 1), end: w(90, 0) - 0.3 };
  const NAMED = [w(84, 0), w(85, 0), w(86, 0), w(87, 0), w(87, 2)];
  SH.labels.push([T7.sum, '07', 'الخلاصة']);
  key(T6.end - 0.1, 0.6, () => F600, { mode: 'settle', y: Y0, wave: 0.8, dir: 1 });
  key(T7.all - 0.1, 0, (t) => TH.wobble(F600, t, 20 * cio(t, T7.all - 0.1, 0.4) * (1 - cio(t, T7.end - 0.4, 0.4)), { seed: 7 }));
  sfx(T7.sum - 0.2, 'whoosh', 0.14, { d: 0.6, up: false }); sfx(T7.sum, 'pop', 0.12, { f: 640 });
  NAMED.forEach((tt, i) => { sfx(tt, 'pluck', 0.12, { f: [131, 147, 165, 175, 196][i] }); sfx(tt + 0.02, 'pop', 0.1, { f: 700 + i * 60 }); });
  sfx(T7.all, 'stretch', 0.12); sfx(T7.notSure, 'pop', 0.14, { f: 480 });
  function summary(ctx, t, P, layer) {
    const { BX, NAMES } = SH.beads; const a = outA(t, T7.end - 0.1, 0.4);
    BX.forEach((bx, i) => {
      const inP = A.eo(t, T7.sum - 0.1 + (4 - i) * 0.06, 0.8); if (inP <= 0) return; const x = lerp(bx - 2300, bx, inP); const y = TH.yAt(P, x);
      const lit = cio(t, NAMED[i], 0.25); const pulse = 1 + 0.12 * Math.max(0, Math.sin((t - T7.all) * 8)) * cio(t, T7.all, 0.2) * a;
      ctx.save(); ctx.globalAlpha *= a;
      if (layer === 'back') {
        ctx.strokeStyle = hexA(C.ink, 0.25); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y + 20); ctx.lineTo(x, y + 62); ctx.stroke();
        if (lit > 0) GK.pill(ctx, NAMES[i], x, y + 96, { style: 'gold', size: 27, p: Math.min(1, 0.6 + lit * 0.45) }); else chip(ctx, NAMES[i], x, y + 96, { size: 27, p: clamp(inP * 1.4) });
        lat(ctx, '0' + (i + 1), x, y - 44, { size: 22, w: 600, color: hexA(C.ink, 0.45), align: 'center' });
      } else {
        if (lit > 0) { ctx.save(); ctx.globalAlpha *= lit * 0.5; ctx.fillStyle = '#F1C75B'; ctx.beginPath(); ctx.arc(x, y, 30 * pulse, 0, 6.283); ctx.fill(); ctx.restore(); }
        TH.bead(ctx, x, y, 17 * pulse);
      }
      ctx.restore();
    });
    if (layer !== 'back') {
      head(ctx, [{ s: 'الخلاصة', t: T7.sum }], 330, t, { size: 96, w: 'S', color: C.ink, out: K.outAt(t, T7.end - 0.1, 0.4) });
      GK.pill(ctx, 'بس مو بشكل مضمون', 960, 880, { style: 'red', size: 30, p: popP(t, T7.notSure) * a });
      txt(ctx, 'كلها ممكن تأثّر على السعر', 960, 806, { size: 40, w: 'S', color: C.slate, align: 'center', alpha: cio(t, T7.all, 0.3) * a });
    }
  }
  SH.st.push({ t0: T7.sum - 0.2, t1: T7.end + 0.6, back: (ctx, t, P) => summary(ctx, t, P, 'back'), front: (ctx, t, P) => summary(ctx, t, P, 'front') });

  // ================================================================ NEXT LESSON · a price on a screen — but per what unit?
  const T8 = { screen: w(90, 0), price: w(90, 2), unit: w(91, 2), oz: w(92, 0), g: w(92, 2), mithqal: w(92, 4), contract: w(93, 1), mt5: w(93, 4), next: w(94, 4), guide: w(95, 0), free: w(96, 2), below: w(96, 3) };
  SH.labels.push([T8.screen, '08', 'الدرس الجاي']);
  const SCR = { x: 520, y: 250, w: 880, h: 420 };
  // inside the screen the thread becomes a live price line
  const live = (t) => { const k = cio(t, T8.screen + 0.1, 0.6) * (1 - cio(t, F.CLOSE - 0.5, 0.3)); return F600.map(([x, y]) => { const wv = win(x, SCR.x + 30, SCR.x + SCR.w - 30, 30); return [x, y - k * wv * (110 + 46 * Math.sin(x * 0.013 + t * 1.4) + 22 * Math.sin(x * 0.041 - t * 2.2))]; }); };
  key(T8.screen - 0.05, 0, live);
  sfx(T8.screen, 'whoosh', 0.1, { d: 0.5 }); sfx(T8.screen + 0.2, 'pop', 0.14, { f: 760 }); sfx(T8.unit, 'pop', 0.12, { f: 600 });
  [T8.oz, T8.g, T8.mithqal].forEach((tt, i) => sfx(tt, 'pop', 0.14, { f: [700, 820, 940][i], pan: [0.35, 0, -0.35][i] }));
  sfx(T8.contract, 'pop', 0.12, { f: 660 }); sfx(T8.mt5, 'type', 0.08, { d: 0.5, n: 8 }); sfx(T8.next, 'chime', 0.14); sfx(T8.guide, 'pop', 0.12, { f: 720 }); sfx(T8.below, 'bloop', 0.12);
  // the thread ties off: both ends run into the centre — the X takes it from there
  const DOT = Array.from({ length: TH.N }, () => [960, 540]);
  key(F.CLOSE - 0.46, 0.46, () => DOT, { wave: 0.3, dir: 0, ease: (p) => A.expoIn(clamp(p)) });
  sfx(F.CLOSE - 0.5, 'whoosh', 0.14, { d: 0.5 });
  function nextL(ctx, t, P, layer) {
    const a = cio(t, T8.screen, 0.35) * outA(t, F.CLOSE - 0.45, 0.32); if (a <= 0) return;
    if (layer === 'back') {
      // screen window
      card(ctx, SCR.x, SCR.y, SCR.w, SCR.h, { alpha: a, r: 22 });
      ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = hexA(C.ink, 0.06); A.roundRect(ctx, SCR.x, SCR.y, SCR.w, 54, [22, 22, 0, 0]); ctx.fill();
      [0, 1, 2].forEach((k) => { ctx.fillStyle = hexA(C.ink, 0.22); ctx.beginPath(); ctx.arc(SCR.x + 30 + k * 22, SCR.y + 27, 6, 0, 6.283); ctx.fill(); });
      ctx.restore();
      return;
    }
    const tk = Math.floor(t * 3) / 3; const pv = 4000 + Math.round(Math.sin(tk * 1.1) * 14 + Math.sin(tk * 2.9) * 6); const pc = Math.abs(Math.round(Math.sin(tk * 5.3) * 49 + 50)) % 100; // ticks 3× a second
    ctx.save(); ctx.globalAlpha *= a;
    lat(ctx, 'XAU/USD', SCR.x + SCR.w - 30, SCR.y + 36, { size: 22, w: 700, color: C.ink, align: 'right' });
    lat(ctx, pv.toLocaleString('en-US') + '.' + String(pc).padStart(2, '0'), SCR.x + 40, SCR.y + 118, { size: 54, w: 600, color: C.ink, alpha: cio(t, T8.price, 0.3) });
    ctx.restore();
    // per what unit?
    chip(ctx, 'لأي وحدة؟', SCR.x + 420, SCR.y + 100, { size: 28, p: popP(t, T8.unit) * a, dot: '#D2A746' });
    [['أونصة', T8.oz, 1190], ['غرام', T8.g, 960], ['مثقال', T8.mithqal, 730]].forEach(([s, tt, x]) => GK.pill(ctx, s, x, 770, { style: 'outline', size: 30, p: popP(t, tt) * a }));
    // the gold contract on MetaTrader 5 (text only)
    const ca = popP(t, T8.contract) * a; if (ca > 0) { chip(ctx, 'عقد الذهب', 1110, 880, { size: 28, p: ca }); tok(ctx, 'MetaTrader 5', 850, 880, { size: 26, p: popP(t, T8.mt5) * a }); }
    GK.pill(ctx, 'الدرس الجاي', 960, 180, { style: 'gold', size: 30, p: popP(t, T8.next) * a });
    // the free written guide, under the video
    const ga = popP(t, T8.guide) * a; if (ga > 0) { ctx.save(); ctx.globalAlpha *= clamp(ga); card(ctx, 1500, 300, 260, 320, { r: 16 }); for (let k = 0; k < 6; k++) { ctx.fillStyle = hexA(C.ink, k ? 0.1 : 0.7); A.roundRect(ctx, 1530, 340 + k * 40, k ? 200 - (k % 3) * 40 : 150, k ? 12 : 18, 6); ctx.fill(); } txt(ctx, 'الدليل المكتوب', 1630, 660, { size: 28, w: 'S', color: C.ink, align: 'center' }); ctx.restore(); GK.pill(ctx, 'مجاني', 1630, 296, { style: 'gold', size: 22, p: popP(t, T8.free) * a }); arrow(ctx, 1630, 700, 1630, 820, cio(t, T8.below, 0.35) * a, { color: C.ink, w: 3.5, head: 16 }); }
  }
  SH.st.push({ t0: T8.screen - 0.2, t1: F.CLOSE, back: (ctx, t, P) => nextL(ctx, t, P, 'back'), front: (ctx, t, P) => nextL(ctx, t, P, 'front') });

  // ================================================================ music: 114 BPM, F minor (Fm9 · Dbmaj9 · Abmaj7 · Eb6/9), plucked-string timbre (the thread), broken kit
  F.STYLE = { bpm: 114, chords: [[41, [56, 60, 63, 65, 67]], [37, [56, 60, 61, 63, 65]], [44, [55, 60, 63, 67, 72]], [39, [55, 58, 60, 63, 65]]], kit: 'broken', pluck: 'string', swing: 0.04, bass: [0, 0, 1, 0, 0, 1, 0, 1], arp: [0, 2, 4, 1, 3, 2, 4, 1], padcut: 2000, duck: 0.55 };
  const DV = SH.divs; // energy lifts on every chapter panel, breathes under the explanations
  F.MUSIC = [
    { t: 0, lvl: 1 }, { t: 2.0, lvl: 2 }, { t: w(1, 0) + 0.1, lvl: 3 }, { t: w(1, 6), lvl: 4 }, { t: w(3, 0), lvl: 3 }, { t: w(4, 0) - 0.45, lvl: 2 },
    { t: DV[0].t0, lvl: 4 }, { t: DV[0].t1, lvl: 3 }, { t: w(13, 0) - 0.1, lvl: 2 },
    { t: DV[1].t0, lvl: 4 }, { t: DV[1].t1, lvl: 3 }, { t: w(21, 0), lvl: 2 },
    { t: DV[2].t0, lvl: 4 }, { t: DV[2].t1, lvl: 2 }, { t: w(35, 1), lvl: 3 }, { t: w(41, 0), lvl: 2 }, { t: w(44, 1), lvl: 3 },
    { t: DV[3].t0, lvl: 4 }, { t: DV[3].t1, lvl: 3 }, { t: w(55, 0), lvl: 2 }, { t: w(59, 0), lvl: 3 },
    { t: D5.t0, lvl: 4 }, { t: D5.t1, lvl: 2 }, { t: w(68, 0), lvl: 3 }, { t: T6.all, lvl: 2 }, { t: T6.after, lvl: 3 },
    { t: T7.sum, lvl: 4 }, { t: T8.screen, lvl: 3 }, { t: T8.next - 0.6, lvl: 2 }, { t: F.CLOSE, lvl: 1 },
  ];

  F.addClose();
})(typeof window !== 'undefined' ? window : globalThis);
