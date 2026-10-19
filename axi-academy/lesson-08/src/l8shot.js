// Lesson 08 — Margin (الهامش). ONE continuous shot, cut to the narration word by word (video time = voice + 2 s).
// The account is a glass tank: the liquid is the equity, the dark padlocked band at the bottom is the used margin.
// The camera never cuts:
//   the brand dot falls into the tank → a trade reserves the band → the broker's vault becomes a rented house (deposit in,
//   deposit back) → the trade closes and the band melts back → the leverage slider thins the band → the formula is written
//   on the board above the tank → fly left to the currency station (€ coin → $, EUR/USD base and quote) → whip home:
//   $1,000 × 1:100 pulls back to a wall of 100 tanks → the order ticket, the lot bar, the worked example on the board → the
//   $100 drops into the tank → the platform panel → night grows out of the tank: margin call, the deposit, the rewind, the
//   stop out → day: the margin-level ruler and formula, 10,000 ÷ 5,000 × 100 = 200% → the whole journey in one pull-back →
//   the board splits into the recap cards → everything collapses into the red dot → the Axi Iraq logo (close).
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT, L8 = G.L8;
  const { C, clamp, lerp, inv, eo, hexA, txt, lat, roundRect } = A;
  const { w, wl, ph, sfx, ksfx, scene } = F;
  const { cio, pulse } = L8;

  // ---------------------------------------------------------------- key times (video time, from the word alignment)
  const T = {
    s0: 2.05, maHu: w(0, 4), huwa: w(0, 5), marjin: w(0, 6), ay: w(0, 7), hamesh: w(0, 8),
    def: w(1, 0), mal: w(1, 3), hisab: w(1, 7), fath: w(1, 10), safqa: w(1, 11),
    p2: w(2, 0), ashbah: w(2, 5), wadia: w(2, 6), yahtafiz: w(2, 7), wasit: w(2, 9),
    p3: w(3, 0), istijar: w(3, 2), manzil: w(3, 3), tadfa: w(3, 5), tamin: w(3, 6),
    p4: w(4, 0), darar: w(4, 4), intiha: w(4, 6), ijar: w(4, 8), tastarid: w(4, 9), taminak: w(4, 10),
    p5: w(5, 0), p6: w(6, 0), taghliq: w(6, 1), yuad: w(6, 3), hisab6: w(6, 6),
    p7: w(7, 0), tahsib: w(7, 2), q7: w(7, 3), p8: w(8, 0), hamesh8: w(8, 1), rafi: w(8, 5),
    p9: w(9, 0), irtafaat: w(9, 1), inkhafad: w(9, 3), hamesh9: w(9, 4), p10: w(10, 0), muadala: w(10, 6),
    e0: w(11, 0), e1: w(11, 1), e2: w(11, 2), e3: w(11, 4), e4: w(11, 6),
    p12: w(12, 0), p13: w(13, 0), hamesh13: w(13, 5), asas13: w(13, 8), asas13b: w(13, 9), p14: w(14, 0), hajm14: w(14, 1),
    p15: w(15, 0), yuhawwal: w(15, 1), hisab15: w(15, 5), p16: w(16, 0), euro16: w(16, 4),
    p17: w(17, 0), euro17: w(17, 1), asas17: w(17, 3), p18: w(18, 0), dollar18: w(18, 0), tasir: w(18, 3),
    p19: w(19, 0), tabadul: w(19, 5), euro19: w(19, 6), miqdar: w(19, 7), dollar19: w(19, 10),
    p20: w(20, 0), p21: w(21, 0), barasid: w(21, 5), k1000: w(21, 6), p22: w(22, 0), lev22: w(22, 4),
    p23: w(23, 0), k1000b: w(23, 3), mul23: w(23, 5), lev23: w(23, 8), p24: w(24, 0), k100k: w(24, 6),
    p25: w(25, 0), kam: w(25, 1), hameshan: w(25, 2), satahtaj: w(25, 3),
    p26: w(26, 0), lot01: w(26, 4), pair26: w(26, 8), p27: w(27, 0), k10k: w(27, 3),
    p28: w(28, 0), lot01b: w(28, 1), mul28: w(28, 2), k100kb: w(28, 4), p29: w(29, 0), qiyasi: w(29, 2),
    p30: w(30, 0), hamesh30: w(30, 4), safqa30: w(30, 8), p31: w(31, 0), k10kc: w(31, 1), div31: w(31, 3), lev31: w(31, 8),
    p32: w(32, 0), eq32: w(32, 1), r100: w(32, 2), p33: w(33, 0), yuhawwal33: w(33, 4), hisab33: w(33, 7),
    p34: w(34, 0), dollar34: w(34, 3), p35: w(35, 0), rate1: w(35, 6), p36: w(36, 0), usd100: w(36, 6),
    p37: w(37, 0), muhayyir: w(37, 6), fala: w(37, 9), p38: w(38, 0), tilqai: w(38, 3), minassa: w(38, 5),
    p39: w(39, 0), p40: w(40, 0), p41: w(41, 0), makhatir: w(41, 5), khafiya: w(41, 6),
    p42: w(42, 0), nida: w(42, 1), tasfiya: w(42, 3), p43: w(43, 0), tankhafid: w(43, 4), huquq: w(43, 5),
    p44: w(44, 0), p45: w(45, 0), takhsar: w(45, 4), p46: w(46, 0), p47: w(47, 0), idafa: w(47, 5), mal47: w(47, 8),
    p48: w(48, 0), maftuha48: w(48, 3), p49: w(49, 0), lam49: w(49, 1), tasfiya49: w(49, 9),
    p50: w(50, 0), dun: w(50, 7), had: w(50, 8), p51: w(51, 0), safaqat: w(51, 1), tilqai51: w(51, 2), p52: w(52, 0),
    p53: w(53, 0), p54: w(54, 0), mustawa54: w(54, 3), fath54: w(54, 6), ukhra: w(54, 9),
    p55: w(55, 0), aman: w(55, 4), khasair: w(55, 7), p56: w(56, 0), irtafaa: w(56, 1), abad: w(56, 5),
    p57: w(57, 0), p58: w(58, 0), f0: w(59, 0), f1: w(59, 2), f2: w(59, 4), f3: w(59, 6), f4: w(59, 8),
    p60: w(60, 0), nisba: w(60, 5), p61: w(61, 0), k10k61: w(61, 5), p62: w(62, 0), k5k: w(62, 1), kahamesh: w(62, 3),
    p63: w(63, 0), sb0: w(64, 0), sb1: w(64, 1), sb2: w(64, 3), sb3: w(64, 4), sb4: w(64, 6), p65: w(65, 0), pct200: w(65, 3),
    p66: w(66, 0), hamesh66: w(66, 1), rafi66: w(66, 2), p67: w(67, 0), p68: w(68, 0), p69: w(69, 0), lisalihak: w(69, 3),
    p70: w(70, 0), asila: w(70, 2), asfal: w(70, 4), p71: w(71, 0),
  };
  T.drop = T.hamesh + 0.35; T.splash = T.drop + 0.42;   // the dot falls into the tank and splashes on «الهامش هو»

  // ---------------------------------------------------------------- chapters, score, HUD
  F.chapters.push(
    { t: F.OFF, label: 'ما هو الهامش؟' }, { t: ph(7), label: 'المعادلة' }, { t: ph(12), label: 'عملة الهامش' },
    { t: ph(20), label: 'مثال الرافعة' }, { t: ph(25), label: 'مثال عملي' }, { t: ph(40), label: 'نداء الهامش والتصفية' },
    { t: ph(53), label: 'مستوى الهامش' }, { t: ph(66), label: 'الخلاصة' },
  );
  // new score: 112 BPM, F minor (Fm9 · Dbmaj7 · Ab · Eb), glass plucks for the glass tank, broken kit; it thins out at night
  F.STYLE = { bpm: 112, chords: [[41, [60, 63, 65, 68, 72]], [37, [60, 61, 65, 68, 72]], [44, [60, 63, 68, 72, 75]], [39, [58, 63, 67, 70, 75]]],
    kit: 'broken', pluck: 'glass', swing: 0.03, bass: [0, 0, 1, 0, 0, 1, 0, 1], arp: [0, 2, 4, 3, 1, 4, 2, 3], padcut: 1800, duck: 0.62, chordBars: 2 };
  F.MUSIC = [
    { t: 0, lvl: 1 }, { t: F.OFF, lvl: 2 }, { t: T.def, lvl: 3 }, { t: ph(7) - 0.3, lvl: 4 }, { t: T.p8 + 1.0, lvl: 3 },
    { t: ph(12) - 0.3, lvl: 4 }, { t: T.p13 + 0.8, lvl: 3 }, { t: ph(20) - 0.4, lvl: 4 }, { t: T.p21 + 0.6, lvl: 3 }, { t: T.p24 - 0.2, lvl: 4 },
    { t: T.p26 - 0.2, lvl: 3 }, { t: T.p37, lvl: 2 }, { t: T.p38, lvl: 3 }, { t: ph(40) - 0.2, lvl: 2 }, { t: T.p43, lvl: 3 },
    { t: T.p52, lvl: 2 }, { t: ph(53) - 0.2, lvl: 4 }, { t: T.p54 + 0.8, lvl: 3 }, { t: T.p65, lvl: 4 }, { t: T.p70, lvl: 3 }, { t: F.CLOSE, lvl: 1 },
  ];
  G.HUD_STYLE = 'bar';

  // ---------------------------------------------------------------- the world (world coordinates; the camera flies through it)
  const TK = { x: 960, y: 860, w: 340, h: 480 };                    // the tank: centre x, base y
  const FULL = 0.7, MC = 0.3, SO = 0.15;                              // equity level; margin call / stop out lines (ch6)
  const BD = { x: 110, y: -820, w: 1700, h: 660 }, ROW = { a: -668, b: -518, c: -370 }, BCY = -490; // the board above the tank
  const VX = -150, VY = 820;                                          // the broker's vault ↔ the rented house
  const CARD = { x: 395, y: 470 };                                    // the trade card (ch1)
  const COIN = { x: -700, y: -150 }, PAIR = { x: -1330, y: -40 };    // the currency station
  const TIX = { x: 200, y: 290, w: 520 };                            // the order ticket
  const LOT = { xr: 760, y: 740, w: 560, h: 56 };                    // the lot bar
  const PANEL = { x: 1480, y: 300, w: 560 };                          // the platform panel
  const RC = { x: 330, ys: [470, 620, 770] };                         // the open trades (ch6/7)
  const CHART = [250, 140, 450, 250];                                 // the price chart (ch6)
  const GRID = { dx: 420, dy: 600, n: 10 };                           // 100 tanks of $1,000 = $100,000 (cols left, rows down)
  const GCX = TK.x - (GRID.n - 1) * GRID.dx / 2, GCY = TK.y - TK.h / 2 + (GRID.n - 1) * GRID.dy / 2;
  const LEV = { in: 35.9, out: 41.7, s0: T.irtafaat - 0.1, s1: T.hamesh9 + 0.1 };
  const LS = [10, 30, 50, 100, 200, 500];
  const USD = { lift: T.usd100 + 0.45, land: T.usd100 + 1.55 };      // the $100 falls from the board into the tank
  const RK = {
    c1: T.p40 + 0.3, c2: T.p40 + 1.1, c3: T.p40 + 1.9,              // three trades open, the band grows
    d0: T.p43 + 0.7, d0d: 8.8, d1: T.p45, d1d: 5.6,                 // the equity drains to the margin-call line
    pour: T.idafa, rew: T.lam49, rewD: 1.3,                         // the deposit; the rewind («وإذا لم»)
    d2: T.lam49 + 1.75, soHit: T.dun, cut: T.safaqat - 0.08, refill: T.p53 + 1.15, newTrade: T.p53 + 1.6,
  };
  RK.mcHit = RK.d1 + RK.d1d; RK.d2d = RK.soHit - RK.d2;
  const REC = { in: T.p66 + 0.2, out: T.p67 + 3.4 };                 // ch8: the whole journey at once

  // ---------------------------------------------------------------- the camera (keys: arrival t, move duration d)
  const cam = (t, d, x, y, z, r = 0) => L8.CAM.push({ t, d, x, y, z, r });
  cam(T.s0, 0, 960, 540, 1.0);
  cam(T.splash + 0.9, 1.4, 960, 610, 0.98);          // follow the dot down into the tank
  cam(T.safqa + 0.3, 1.3, 830, 600, 0.96);           // the trade card enters from the left
  cam(T.wadia - 0.2, 1.9, 420, 590, 0.92);           // the broker's vault on the far left
  cam(T.manzil + 0.25, 1.5, -150, 560, 1.22);        // push into the house
  cam(T.p5 - 0.9, 5.4, -110, 575, 1.3);              // slow push while the lease runs
  cam(T.p5 + 1.45, 1.15, 860, 610, 1.0, 0);          // whip back to the trade
  cam(T.hisab6 - 0.2, 2.6, 930, 650, 1.14);          // push in as the margin comes back
  cam(T.p7 + 1.15, 1.1, 960, 470, 0.92);             // tilt up to the question
  cam(T.rafi + 0.1, 1.8, 930, 690, 0.8);             // pull back: tank, size block, slider
  cam(LEV.s1 + 0.4, 3.2, 930, 700, 0.86);            // creep in while the knob slides
  cam(T.muadala - 0.05, 1.7, 960, BCY, 0.98);         // rise to the board
  cam(T.e4 + 0.9, 5.0, 960, BCY + 10, 1.05);          // push while the formula writes
  cam(T.p13 + 1.3, 2.2, -760, -70, 1.0);             // fly left to the currency station
  cam(T.hisab15 - 0.2, 6.0, -760, -60, 1.08);        // slow push
  cam(T.p16 + 2.0, 1.7, -1330, -40, 1.0);            // pan to the pair
  cam(T.dollar19 - 0.3, 10.0, -1330, 20, 1.08);      // slow push over the exchange
  cam(T.p20 + 1.6, 1.35, 930, 600, 1.0);             // whip home
  cam(T.k1000 + 0.2, 3.4, 990, 610, 1.06);           // push to the $1,000
  cam(T.p22 + 2.3, 1.6, 960, 700, 0.84);             // pull back for the slider
  cam(T.k1000b - 0.3, 1.6, 960, 520, 0.84);          // tilt up to the multiplication
  cam(T.k100k + 0.65, 3.2, GCX, GCY + 200, 0.152);   // the big pull-back: 100 tanks (clear of the HUD band)
  cam(T.p25 + 2.15, 2.0, 900, 610, 0.96);            // dive back into our tank
  cam(T.p26 + 1.8, 1.6, 600, 580, 0.98);             // the order ticket on the left
  cam(T.k10k - 0.4, 2.0, 560, 560, 1.0);
  cam(T.lot01b + 1.1, 1.8, 540, 580, 0.94);          // the lot bar and the multiplication
  cam(T.p30 - 0.9, 6.0, 540, 580, 1.0);
  cam(T.hamesh30 - 0.25, 1.7, 960, BCY, 0.98);        // rise to the board
  cam(T.p33 - 0.3, 10.0, 960, BCY + 10, 1.03);
  cam(T.yuhawwal33 + 0.6, 2.2, 960, BCY + 40, 0.99);  // settle lower for the conversion row
  cam(USD.land + 0.25, 1.7, 930, 640, 1.0);          // follow the $100 down into the tank
  cam(T.muhayyir + 0.5, 2.4, 930, 640, 1.06, -2.5);  // dizzy roll
  cam(T.fala + 0.65, 1.0, 930, 630, 1.0, 0);         // calm
  cam(T.tilqai + 0.05, 1.5, 1420, 600, 0.95);        // the platform panel
  cam(T.p40 - 0.35, 4.0, 1260, 620, 0.86);           // ease out
  cam(T.p40 + 1.85, 1.8, 880, 620, 0.9);             // back on the tank: more trades
  cam(T.p42 - 0.2, 4.0, 900, 620, 0.96);             // creep in as night falls
  cam(T.p43 + 1.2, 1.6, 780, 600, 0.9);              // the chart on the left
  cam(RK.mcHit - 0.6, 12.0, 800, 610, 0.98, -1.4);   // slow push (a slight dutch angle) while the equity drains
  cam(RK.mcHit + 1.2, 1.3, 900, 560, 0.9, -1.4);     // the call card
  cam(T.idafa + 0.4, 1.6, 960, 520, 0.88, -0.6);     // tilt up for the deposit
  cam(RK.d2 - 0.1, 1.8, 880, 620, 0.95, -1.2);       // after the rewind
  cam(RK.soHit + 0.25, 7.0, 900, 700, 1.12, -2.0);   // push toward the stop-out line
  cam(T.safaqat + 0.45, 1.4, 780, 640, 0.98, -1.0);  // the cut
  cam(T.p53 - 0.35, 3.0, 900, 620, 0.92, -0.6);      // settle
  cam(T.p53 + 2.25, 2.0, 960, 610, 0.95, 0);          // day: level again
  cam(T.mustawa54 + 0.65, 2.0, 1060, 610, 0.95);     // the ruler on the right
  cam(T.p57 - 0.6, 12.0, 1060, 600, 1.03);
  cam(T.p57 + 2.4, 1.8, 960, BCY, 0.98);              // rise to the board
  cam(T.p61 - 0.8, 10.0, 960, BCY + 10, 1.04);
  cam(T.p61 + 2.0, 1.8, 1000, 610, 0.95);            // down to the tank
  cam(T.p63 + 1.95, 1.8, 980, 470, 0.86);            // up a little for the sum
  cam(T.pct200 + 0.9, 7.0, 980, 480, 0.9);
  cam(REC.in + 3.4, 3.4, 165, -60, 0.47);            // the whole journey
  cam(T.p67 + 2.4, 2.6, 960, BCY, 0.95);              // back to the board → the recap cards
  cam(T.asila + 0.2, 10.0, 960, BCY + 10, 1.0);
  cam(T.asfal + 0.95, 1.6, 960, BCY + 40, 0.95);      // lift for the arrow
  L8.PUSH.push(ph(7), ph(12), ph(25), ph(40), ph(53), ph(66));
  F.SHUTTER.push([T.p5 + 0.3, T.p5 + 1.45, 1 / 45], [T.p20 + 0.25, T.p20 + 1.6, 1 / 40], [T.p13 - 0.9, T.p13 + 1.3, 1 / 60]);

  // ---------------------------------------------------------------- night (the hidden risks) grows out of the tank; day grows back
  const NIGHT = { t0: T.makhatir - 0.45, d: 1.25, to: 1 }, DAY = { t0: T.p53 + 0.2, d: 1.1, to: 0 };
  [NIGHT, DAY].forEach((D) => { const s = L8.toScreen(L8.cam(D.t0), TK.x, TK.y - 230); D.cx = s[0]; D.cy = s[1]; L8.DISCS.push(D); });
  G.HUD_INK = (t) => { const d = L8.discAt(t); let dk = L8.baseDark(t); if (d) dk = Math.hypot(1100 - d.D.cx, 1010 - d.D.cy) < d.r ? d.D.to : 1 - d.D.to; return dk ? C.white : C.ink; };

  // ---------------------------------------------------------------- helpers
  const env = (t, a, b, din = 0.45, dout = 0.45) => (t <= a || t >= b ? 0 : Math.min(eo(t, a, din), 1 - cio(t, b - dout, dout)));
  const keys = (t, v0, ks) => { let v = v0; for (const [t0, d, vk] of ks) { if (t <= t0) break; v = lerp(v, vk, cio(t, t0, d)); } return v; };
  const ap = (t, t0, wv = 14, z = 0.55) => (t <= t0 ? 0 : Math.min(1.12, FX.springU(t - t0, wv, z)));
  const fade = (t, t0, d = 0.4) => 1 - cio(t, t0, d);
  const typed = (s, t, t0, d) => s.slice(0, Math.round(s.length * clamp((t - t0) / d)));
  const NOOUT = { slam: 1, stretch: 1, snap: 1 };
  // a centred row of timed words (world space); words that cannot animate out simply fade with it
  function head(ctx, words, cx, y, t, o = {}) {
    const sz = o.size || 120, wt = o.w || 'X', out = o.out || 0;
    const ws = words.map((x) => Object.assign({}, x, NOOUT[x.mode || o.mode] && out > 0 ? { alpha: (x.alpha == null ? 1 : x.alpha) * (1 - out) } : {}));
    const cw = K.wordsWidth(ws, { size: sz, w: wt });
    return K.words(ctx, ws, cx + cw / 2, y, t, { size: sz, w: wt, color: o.color || L8.ink(), mode: o.mode || 'drop', stagger: o.stagger == null ? 0.04 : o.stagger, out, outDir: o.outDir, alpha: o.alpha });
  }
  const capAt = (ctx, words, cx, y, t, o = {}) => head(ctx, words, cx, y, t, Object.assign({ size: 44, w: 'R', color: L8.sub(), mode: 'rise', stagger: 0.02 }, o));
  // vertical bracket beside the tank with a label and a value; side 'right' (label to the right) or 'left'
  function bracket(ctx, x, y0, y1, label, value, p, o = {}) {
    if (p <= 0 || y1 - y0 < 2) return; const q = eo(p, 0, 1); const s = o.side === 'left' ? -1 : 1; const col = o.color || L8.ink();
    const ym = (y0 + y1) / 2, h2 = (y1 - y0) / 2 * q;
    ctx.save(); ctx.globalAlpha *= clamp(p * 2); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(x, ym - h2); ctx.lineTo(x + 12 * s, ym - h2); ctx.lineTo(x + 12 * s, ym + h2); ctx.lineTo(x, ym + h2); ctx.moveTo(x + 12 * s, ym); ctx.lineTo(x + 26 * s, ym); ctx.stroke(); ctx.restore();
    const a = clamp((p - 0.35) * 2); if (a <= 0) return; const al = s > 0 ? 'left' : 'right', xt = x + 40 * s;
    const vs = o.vsize || 44;
    txt(ctx, label, xt, ym + (value ? -8 - (vs - 40) * 0.3 : 10), { size: o.size || 30, w: 'S', color: o.labelColor || L8.sub(), align: al, alpha: a });
    if (value) lat(ctx, value, xt, ym + vs * 0.92, { size: vs, w: 600, color: o.valueColor || L8.ink(), align: al, alpha: a });
  }
  // dashed tether (a trade holding its margin): quadratic from (x0,y0) to (x1,y1) sagging under both ends, dashes flow
  function tether(ctx, x0, y0, x1, y1, p, t, o = {}) {
    if (p <= 0) return; const cx = (x0 + x1) / 2, cy = Math.max(y0, y1) + (o.sag == null ? 60 : o.sag); const e = eo(p, 0, 1);
    ctx.save(); ctx.globalAlpha *= clamp(p * 2) * (o.alpha == null ? 1 : o.alpha); ctx.strokeStyle = o.color || L8.sub(); ctx.lineWidth = o.lw || 2.4; ctx.setLineDash([9, 8]); ctx.lineDashOffset = -t * 36;
    ctx.beginPath(); for (let i = 0; i <= 36; i++) { const u = i / 36 * e; const x = (1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * cx + u * u * x1, y = (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * cy + u * u * y1; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = o.color || L8.sub(); ctx.beginPath(); ctx.arc(x0, y0, 4.5, 0, 6.283); ctx.fill(); if (e > 0.98) { ctx.beginPath(); ctx.arc(x1, y1, 4.5, 0, 6.283); ctx.fill(); } ctx.restore();
  }
  // soft contact shadow (stacked ellipses, no gradients)
  function groundShadow(ctx, x, y, rx, a = 1) {
    if (a <= 0) return; ctx.save(); ctx.fillStyle = L8.DK ? 'rgba(0,0,0,0.12)' : 'rgba(40,55,60,0.035)';
    for (let k = 0; k < 7; k++) { const f = 1 - k * 0.1; ctx.globalAlpha = a; ctx.beginPath(); ctx.ellipse(x, y, rx * f, 22 * f, 0, 0, 6.283); ctx.fill(); }
    ctx.restore();
  }
  // spring-scaled latin value centred at (x, y)
  function pop(ctx, s, x, y, t, t0, o = {}) {
    const k = ap(t, t0, o.wv || 15, 0.5); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp((t - t0) * 8) * (o.alpha == null ? 1 : o.alpha); ctx.translate(x, y - (o.size || 72) * 0.35); ctx.scale(k, k);
    lat(ctx, s, 0, (o.size || 72) * 0.35, { size: o.size || 72, w: o.w || 300, color: o.color || L8.ink(), align: 'center' }); ctx.restore();
  }
  const levL = (v) => { const i = Math.min(LS.length - 2, Math.floor(v)), f = v - i; return Math.exp(lerp(Math.log(LS[i]), Math.log(LS[i + 1]), f)); };
  const levV = (t) => (t < 60 ? 5 * cio(t, LEV.s0, LEV.s1 - LEV.s0) : 3 * cio(t, T.lev22 - 0.95, 0.97));
  const pctTxt = (L) => { const p = 100 / L; return (p >= 9.95 ? Math.round(p) : Math.round(p * 10) / 10) + '%'; };

  // ---------------------------------------------------------------- the tank's state over the whole film
  function tankState(t) {
    let fill = keys(t, 0, [
      [T.splash, 0.5, 0.1], [T.mal - 0.12, 1.4, FULL],
      [RK.d0, RK.d0d, 0.46], [RK.d1, RK.d1d, MC + 0.012], [RK.pour, 2.3, 0.56], [RK.rew, RK.rewD, MC + 0.012], [RK.d2, RK.d2d, SO],
      [RK.refill, 1.5, FULL], [T.irtafaa - 0.1, 1.3, 0.84], [T.p61 - 1.4, 0.6, FULL],
    ]);
    let band = keys(t, 0, [
      [T.safqa - 0.08, 0.55, 0.12], [T.yuad + 0.45, 0.95, 0],
      [USD.land - 0.05, 0.5, 0.07], [RK.c1, 0.45, 0.15], [RK.c2, 0.45, 0.22], [RK.c3, 0.45, MC],
      [T.tilqai51 + 0.3, 0.8, 0], [RK.newTrade, 0.5, 0.175], [T.p61 - 1.4, 0.6, 0], [T.k5k - 0.1, 0.55, 0.35],
    ]);
    const ld = env(t, LEV.in, LEV.out, 0.5, 0.6);
    if (ld > 0) band = lerp(band, 0.5 * 10 / levL(levV(t)), ld);
    const unlock = Math.max(cio(t, T.yuad - 0.1, 0.45) * (t < T.p7 ? 1 : 0), t > T.p51 && t < T.p53 ? cio(t, T.tilqai51 - 0.1, 0.4) : 0);
    const lock = clamp((t - (T.safqa + 0.15)) * 3) * (t < T.p7 ? 1 : 0) + (t > USD.land ? clamp((t - USD.land) * 3) : 0) * (t > T.p7 ? 1 : 0);
    const wave = 5 + 12 * pulse(t, T.splash + 0.1, 0.5) + 7 * env(t, T.mal - 0.1, T.mal + 1.6) + 9 * env(t, RK.pour, RK.pour + 2.6) + 6 * env(t, RK.refill, RK.refill + 1.8) + 5 * env(t, T.irtafaa, T.irtafaa + 1.5);
    const bubbles = Math.max(env(t, T.mal - 0.1, T.mal + 2.0, 0.3, 0.8), env(t, T.yuad + 0.4, T.yuad + 2.0, 0.3, 0.8), env(t, RK.pour, RK.pour + 2.8, 0.3, 0.8), env(t, RK.refill, RK.refill + 2.0, 0.3, 0.8), 0.5 * env(t, T.irtafaa, T.irtafaa + 1.8));
    const bandGlow = 0.9 * pulse(t, RK.mcHit, 0.25) + (t > RK.soHit && t < T.tilqai51 ? 0.35 + 0.35 * Math.sin((t - RK.soHit) * 16) : 0);
    return { fill, band, lock: clamp(lock), unlock, wave, bubbles, bandGlow, hatch: 1 };
  }
  const tankNow = (t) => Object.assign({ x: TK.x, y: TK.y, w: TK.w, h: TK.h, t, glass: cio(t, T.splash - 0.02, 0.9) }, tankState(t));
  const surf = (o) => o.y - o.fill * o.h, bandTop = (o) => o.y - o.band * o.h;

  // ---------------------------------------------------------------- props written here
  // a position card: pair, side, size, a live sparkline, a status dot; o.close folds it shut, o.cut slashes it in two
  function tradeCard(ctx, x, y, t, p, o = {}) {
    if (p <= 0) return; const cw = 330, ch = 128; const fold = cio(o.close || 0, 0, 1), cut = o.cut || 0;
    if (fold >= 0.99 || cut >= 1) return;
    const body = () => {
      L8.glass(ctx, x, y, cw, ch, { p: 1, chamfer: 22 });
      lat(ctx, 'EUR/USD', x + cw - 26, y + 50, { size: 30, w: 600, color: L8.ink(), align: 'right' });
      ctx.save(); ctx.fillStyle = L8.ink(); roundRect(ctx, x + cw - 112, y + 70, 86, 36, 18); ctx.fill(); ctx.restore();
      txt(ctx, 'شراء', x + cw - 69, y + 96, { size: 22, w: 'B', color: L8.DK ? C.ink : C.white, align: 'center' });
      lat(ctx, o.lots || '0.10', x + cw - 128, y + 97, { size: 26, w: 600, color: L8.sub(), align: 'right' });
      // sparkline + status dot
      ctx.save(); ctx.strokeStyle = L8.sub(); ctx.lineWidth = 2.4; ctx.lineJoin = 'round'; ctx.beginPath();
      for (let i = 0; i <= 24; i++) { const u = i / 24; const yy = y + 66 + 18 * Math.sin(u * 7 + (o.n || 0) * 2 + t * 0.8) * (0.5 + 0.5 * u) - (o.trend || 0) * 26 * u; i ? ctx.lineTo(x + 26 + u * 108, yy) : ctx.moveTo(x + 26, yy); }
      ctx.stroke(); ctx.restore();
      const live = 0.55 + 0.45 * Math.sin(t * 5 + (o.n || 0));
      ctx.save(); ctx.fillStyle = o.ok ? C.mint : C.red; ctx.globalAlpha *= o.ok ? 1 : live; ctx.beginPath(); ctx.arc(x + 30, y + 30, 7, 0, 6.283); ctx.fill(); ctx.restore();
      if (o.ok) FX.check(ctx, x + 196, y + 64, 34, o.ok, C.mint, t);
    };
    const k = Math.min(1.06, p); const cx = x + cw / 2, cy = y + ch / 2;
    ctx.save(); ctx.globalAlpha *= clamp(p * 1.6) * (1 - fold);
    ctx.translate(cx, cy); ctx.scale(k, k * (1 - fold * 0.96)); ctx.translate(-cx, -cy);
    if (cut <= 0) body();
    else {
      // two halves along the slash, the lower one falls
      const sl = (u) => lerp(y + ch * 0.78, y + ch * 0.22, u);
      [0, 1].forEach((hf) => {
        ctx.save(); ctx.beginPath();
        if (hf === 0) { ctx.moveTo(x - 20, y - 30); ctx.lineTo(x + cw + 20, y - 30); ctx.lineTo(x + cw + 20, sl(1)); ctx.lineTo(x - 20, sl(0)); }
        else { ctx.moveTo(x - 20, sl(0)); ctx.lineTo(x + cw + 20, sl(1)); ctx.lineTo(x + cw + 20, y + ch + 30); ctx.lineTo(x - 20, y + ch + 30); }
        ctx.closePath(); ctx.clip();
        const dy = hf ? 420 * cut * cut : -30 * cut, rot = hf ? 0.35 * cut : -0.12 * cut, dx = hf ? -40 * cut : 20 * cut;
        ctx.globalAlpha *= 1 - clamp((cut - 0.35) / 0.65);
        ctx.translate(cx + dx, cy + dy); ctx.rotate(rot); ctx.translate(-cx, -cy); body(); ctx.restore();
      });
      if (cut < 0.35) { ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.globalAlpha *= 1 - cut / 0.35; const e = eo(cut, 0, 0.12); ctx.beginPath(); ctx.moveTo(x - 30, sl(0) + 8); ctx.lineTo(lerp(x - 30, x + cw + 30, e), lerp(sl(0) + 8, sl(1) - 8, e)); ctx.stroke(); ctx.restore(); }
    }
    ctx.restore();
  }
  // the trade card out of focus: blurred once per blur level into a small cached sprite (a live canvas blur is far too slow)
  const BLUR = {};
  function cardBlur(px) {
    if (BLUR[px]) return BLUR[px];
    const a = document.createElement('canvas'); a.width = 450; a.height = 250; const ca = a.getContext('2d'); L8.DK = 0; tradeCard(ca, 60, 60, 15, 1, { n: 0 });
    const b = document.createElement('canvas'); b.width = 450; b.height = 250; const cb = b.getContext('2d'); cb.filter = `blur(${px}px)`; cb.drawImage(a, 0, 0);
    return (BLUR[px] = b);
  }
  // a ghost tank of the 100-tank wall
  function ghostTank(ctx, x, yb, p, lit) {
    const w2 = TK.w / 2, hh = TK.h, rb = 34;
    ctx.save(); ctx.translate(x, yb); ctx.scale(p, p);
    ctx.beginPath(); ctx.moveTo(-w2, -hh); ctx.lineTo(-w2, -rb); ctx.arcTo(-w2, 0, -w2 + rb, 0, rb); ctx.lineTo(w2 - rb, 0); ctx.arcTo(w2, 0, w2, -rb, rb); ctx.lineTo(w2, -hh);
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fill();
    if (lit > 0) { ctx.save(); ctx.clip(); const lg = ctx.createLinearGradient(0, -hh * FULL, 0, 0); lg.addColorStop(0, '#93A8AE'); lg.addColorStop(1, '#5A7077'); ctx.fillStyle = lg; ctx.globalAlpha *= lit; ctx.fillRect(-w2, -hh * FULL * eo(lit, 0, 1), TK.w, hh); ctx.restore(); }
    ctx.strokeStyle = hexA(C.slate, 0.9); ctx.lineWidth = 7; ctx.stroke(); ctx.restore();
  }
  // a glass jug that pours (the deposit); pf 0..1 pour phase (1 = fully tilted and flowing)
  function jug(ctx, x, y, pf, p, yTo, t) {
    if (p <= 0) return; const tilt = -1.05 * cio(pf, 0, 0.45);
    ctx.save(); ctx.globalAlpha *= clamp(p * 2); ctx.translate(x, y); const k = Math.min(1.08, p); ctx.scale(k, k); ctx.rotate(tilt);
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 4;
    roundRect(ctx, -60, -80, 120, 150, 14); ctx.fill(); ctx.stroke();
    const lvl = lerp(0.8, 0.15, clamp((pf - 0.4) / 0.6)); ctx.fillStyle = '#7F959B'; ctx.fillRect(-56, 66 - 142 * lvl, 112, 142 * lvl);
    ctx.restore();
    txt(ctx, '+ إيداع', x + 20, y - 120, { size: 30, w: 'B', color: C.white, align: 'center', alpha: clamp(p * 2) });
    // the stream from the lip to the surface
    const flow = clamp((pf - 0.35) / 0.2) * (pf > 0.97 ? 1 : 1); if (flow <= 0 || p < 0.5) return;
    const lipX = x - 70, lipY = y - 40; const yEnd = lerp(lipY, yTo, clamp((pf - 0.35) / 0.25));
    ctx.save(); const lg = ctx.createLinearGradient(0, lipY, 0, yEnd); lg.addColorStop(0, '#A8BEC4'); lg.addColorStop(1, '#7F959B'); ctx.fillStyle = lg;
    ctx.beginPath(); for (let i = 0; i <= 20; i++) { const u = i / 20; const yy = lerp(lipY, yEnd, u); const xx = lipX - 12 * u * u + 2.5 * Math.sin(u * 14 + t * 22); i ? ctx.lineTo(xx + 7, yy) : ctx.moveTo(xx + 7, yy); }
    for (let i = 20; i >= 0; i--) { const u = i / 20; const yy = lerp(lipY, yEnd, u); const xx = lipX - 12 * u * u + 2.5 * Math.sin(u * 14 + t * 22); ctx.lineTo(xx - 7, yy); }
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  // ================================================================ 01 · what margin is: the dot, the splash, the trade, the deposit
  function intro(ctx, t) {
    if (t > T.p2 + 0.6) return;
    const qOut = K.outAt(t, T.ay - 0.06, 0.35);
    if (qOut < 1) head(ctx, [{ s: 'ما', t: T.maHu }, { s: 'هو', t: T.huwa }, { s: 'مارجن؟', t: T.marjin, mode: 'slam' }], 960, 290, t, { size: 118, out: qOut });
    const hOut = K.outAt(t, T.p2 - 0.15, 0.5);
    if (t > T.hamesh - 0.2 && hOut < 1) {
      head(ctx, [{ s: 'الهامش', t: T.hamesh, mode: 'slam' }], 960, 280, t, { size: 150, out: hOut });
      K.chip(ctx, 'Margin', 960, 336, { p: clamp((t - T.hamesh - 0.25) * 3) * (1 - hOut), size: 24, align: 'center', color: L8.sub(), stroke: hexA(C.slate, 0.5) });
    }
    // the brand dot: waits under the question, beats with each word, then falls into the tank
    if (t < T.splash) {
      const beat = 0.28 * (pulse(t, T.maHu + 0.05, 0.09) + pulse(t, T.marjin + 0.05, 0.09) + pulse(t, T.hamesh + 0.05, 0.1));
      let y = 540, sx = 1, sy = 1;
      if (t > T.drop) { const u = clamp((t - T.drop) / (T.splash - T.drop)); y = lerp(540, TK.y - 22, u * u); sy = 1 + 0.55 * u * u; sx = 1 - 0.22 * u * u; }
      ctx.save(); ctx.translate(960, y); ctx.scale(sx * (1 + beat), sy * (1 + beat)); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, 14, 0, 6.283); ctx.fill(); ctx.restore();
    }
    const sp = clamp((t - T.splash) / 0.9);
    if (sp > 0 && sp < 1) { // the red drop dissolves into the liquid; droplets jump out
      ctx.save(); ctx.fillStyle = C.red;
      for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.42; const r = 6 + 44 * eo(sp, 0, 1) * (0.6 + (i % 3) * 0.2); ctx.globalAlpha = (1 - sp) * 0.75; ctx.beginPath(); ctx.arc(960 + Math.cos(a) * r * 1.6, TK.y - 20 + Math.sin(a) * r * 0.6 - sp * 26, 9 * (1 - sp) + 3, 0, 6.283); ctx.fill(); }
      for (let i = 0; i < 5; i++) { const vx = (i - 2) * 95, vy = -420 - (i % 2) * 120; const tt = sp * 0.9; const x = 960 + vx * tt, y = TK.y - 30 + vy * tt + 900 * tt * tt; if (y > TK.y - 10) continue; ctx.globalAlpha = 1 - sp; ctx.beginPath(); ctx.arc(x, y, 5, 0, 6.283); ctx.fill(); }
      ctx.restore(); K.burst(ctx, 960, TK.y - 20, t, T.splash, C.red, 8, 130, 0.7);
    }
  }
  function ch1(ctx, t) {
    if (t < T.mal - 0.3 || t > T.p7 + 0.6) return;
    const o = tankNow(t); const g = L8.tankGeo(o); const ys = surf(o), yb = bandTop(o);
    // the trade card slides in from the left, opens, holds the band; it folds shut on «تغلق»
    const cp = ap(t, T.fath - 0.25, 13, 0.6);
    if (cp > 0) {
      const slide = -(1 - eo(t, T.fath - 0.25, 0.7)) * 320; const close = clamp((t - T.taghliq) / 0.6);
      const dof = 7 * env(t, T.p3 - 0.4, T.p5 + 0.45, 0.7, 0.4); // out of focus while the camera is at the house
      if (dof > 0.5) ctx.drawImage(cardBlur(Math.round(dof)), CARD.x + slide - 60, CARD.y - 60);
      else tradeCard(ctx, CARD.x + slide, CARD.y, t, cp, { close, n: 0 });
      tether(ctx, CARD.x + 330 + slide, CARD.y + 100, g.x0 + 8, (yb + g.yb) / 2, clamp((t - T.safqa - 0.1) * 1.8) * (1 - clamp((t - T.taghliq) * 2.5)), t, { sag: 70 });
      K.burst(ctx, CARD.x + 30, CARD.y + 30, t, T.taghliq - 0.08, C.red, 6, 46, 0.45);
    }
    // labels on the right of the tank
    const back = env(t, T.p6 - 0.4, T.p7 + 0.5, 0.5, 0.5);
    const la = Math.max(clamp((t - T.mal - 0.25) * 1.6) * fade(t, T.p3 - 0.2, 0.5), back);
    if (la > 0) {
      L8.leader(ctx, g.x1 - 40, lerp(ys, g.yb, 0.32), g.x1 + 70, ys + 4, 'المال في حسابك', la, { size: 30 });
      if (t > T.hisab6) FX.check(ctx, g.x1 + 335, ys - 6, 40, clamp((t - T.hisab6) * 2.5), C.mint, t);
    }
    const ba = clamp((t - T.safqa - 0.35) * 2) * fade(t, T.p3 - 0.2, 0.5) * (o.band > 0.02 ? 1 : 0);
    if (ba > 0) {
      const swap = cio(t, T.wadia - 0.1, 0.35); const ym = (yb + g.yb) / 2;
      L8.leader(ctx, g.x1 - 20, ym, g.x1 + 70, ym + 8, '', ba, {});
      ctx.save(); ctx.beginPath(); ctx.rect(g.x1 + 60, ym - 40, 520, 80); ctx.clip();
      txt(ctx, 'الهامش · محجوز', g.x1 + 82, ym + 18 - swap * 50, { size: 30, w: 'B', color: L8.ink(), align: 'left', alpha: ba * (1 - swap) });
      txt(ctx, 'الهامش = وديعة', g.x1 + 82, ym + 18 + (1 - swap) * 50, { size: 30, w: 'B', color: L8.ink(), align: 'left', alpha: ba * swap });
      ctx.restore();
    }
    // the band is held by the broker: a tether from the band to the vault
    const hp = clamp((t - T.yahtafiz + 0.05) * 1.6) * fade(t, T.istijar - 0.3, 0.5);
    if (hp > 0) tether(ctx, g.x0 + 8, g.yb - 14, VX + 135, VY - 60, hp, t, { sag: 150, color: L8.ink(), alpha: 0.85 });
  }
  function vault(ctx, t, rc = 0) {
    const a = Math.max(env(t, T.ashbah - 0.2, T.p6 + 0.6, 0.3, 0.8), rc); if (a <= 0) return;
    const m = rc > 0 && t > T.p60 ? 1 : clamp(cio(t, T.istijar - 0.3, 0.9) - cio(t, T.p5 - 0.1, 0.8));
    const p = rc > 0 && t > T.p60 ? 1 : ap(t, T.ashbah + 0.1, 13, 0.5);
    ctx.save(); ctx.globalAlpha *= a;
    groundShadow(ctx, VX, VY + 18, 190, clamp(p));
    L8.vaultHouse(ctx, VX, VY, 250, m, p, t);
    const lv = clamp((t - T.wasit + 0.1) * 3) * (1 - m) * (rc > 0 ? 0 : 1);
    if (lv > 0) { txt(ctx, 'الوسيط', VX, VY + 58, { size: 34, w: 'B', color: L8.ink(), align: 'center', alpha: lv }); lat(ctx, 'Broker', VX, VY + 92, { size: 22, w: 600, color: L8.sub(), align: 'center', alpha: lv }); }
    if (rc <= 0) {
      // the deposit envelope: paid in on «تدفع تأميناً», back out on «تسترد تأمينك»
      const door = [VX - 97, VY - 62], from = [560, 360];
      const inP = clamp((t - (T.tadfa - 0.05)) / 0.75), outP = clamp((t - (T.tastarid - 0.1)) / 0.8);
      if (inP > 0 && t < T.p5 + 0.6) {
        let u, pos; if (outP <= 0) { u = cio(inP, 0, 1); pos = [lerp(from[0], door[0], u), lerp(from[1], door[1], u) - Math.sin(u * Math.PI) * 170]; }
        else { u = cio(outP, 0, 1); pos = [lerp(door[0], from[0] - 40, u), lerp(door[1], from[1] + 40, u) - Math.sin(u * Math.PI) * 190]; }
        const sz = outP > 0 ? lerp(62, 96, u) : lerp(96, 62, u); const rot = outP > 0 ? -0.25 * Math.sin(u * Math.PI) : 0.3 * (1 - u);
        L8.envelope(ctx, pos[0], pos[1], sz, Math.min(1, inP * 4) * fade(t, T.p5 + 0.1, 0.4), { rot, label: outP > 0.6 || inP < 0.55 ? 'تأمين' : '', size: 24 });
        if (outP > 0) L8.stamp(ctx, pos[0] + sz * 0.55, pos[1] - sz * 0.32, 20, ap(t, T.taminak, 15, 0.5) * fade(t, T.p5 + 0.1, 0.4), true);
      }
      // «لا ضرر» stamp and the lease running out
      const sp = ap(t, T.darar - 0.05, 15, 0.45) * fade(t, T.p5 - 0.1, 0.4);
      if (sp > 0) { L8.stamp(ctx, VX + 178, VY - 335, 32, sp, true); txt(ctx, 'لا ضرر', VX + 222, VY - 323, { size: 32, w: 'B', color: L8.ink(), align: 'left', alpha: clamp(sp * 2 - 0.6) }); }
      const lp = env(t, T.intiha - 0.4, T.p5 + 0.3, 0.35, 0.4);
      if (lp > 0) {
        const xr = VX + 170, xl = VX - 170, y = VY + 84, q = cio(t, T.intiha - 0.2, T.ijar - T.intiha + 0.55);
        ctx.save(); ctx.globalAlpha *= lp; ctx.lineCap = 'round';
        ctx.strokeStyle = L8.muted(); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(xr, y); ctx.lineTo(xl, y); ctx.stroke();
        ctx.strokeStyle = L8.ink(); ctx.beginPath(); ctx.moveTo(xr, y); ctx.lineTo(lerp(xr, xl, q), y); ctx.stroke();
        for (let i = 0; i <= 12; i++) { const x = lerp(xr, xl, i / 12); ctx.fillStyle = i / 12 <= q ? L8.ink() : L8.muted(); ctx.fillRect(x - 1, y + 12, 2, i % 3 ? 8 : 14); }
        ctx.restore();
        txt(ctx, 'عقد الإيجار', xr, y - 22, { size: 26, w: 'S', color: L8.sub(), align: 'right', alpha: lp });
        if (q > 0.98) txt(ctx, 'انتهى', xl, y - 22, { size: 26, w: 'B', color: L8.ink(), align: 'left', alpha: lp * clamp((t - T.ijar - 0.3) * 3) });
      }
    }
    ctx.restore();
  }

  // ================================================================ 02 · the formula: leverage thins the band, the board
  function lever(ctx, t) {
    const a1 = env(t, LEV.in - 1.6, LEV.out, 0.5, 0.6), a2 = env(t, T.p22 + 0.5, T.p23 + 0.9, 0.5, 0.6);
    if (a1 <= 0 && a2 <= 0) return; const v = levV(t);
    if (a1 > 0) {
      const o = tankNow(t); const g = L8.tankGeo(o); const yb = bandTop(o);
      const bp = ap(t, T.hamesh8 - 0.1, 12, 0.6) * a1;
      L8.block(ctx, 470, 470, 250, 390, { p: bp, t, color: L8.sub() });
      txt(ctx, 'حجم الصفقة', 595, 446, { size: 30, w: 'B', color: L8.ink(), align: 'center', alpha: clamp(bp * 2 - 0.6) });
      txt(ctx, 'ثابت', 595, 680, { size: 26, w: 'R', color: L8.sub(), align: 'center', alpha: clamp(bp * 2 - 0.8) });
      // ÷ leverage → the band; the live share of the trade size on the band
      const la = clamp((t - (T.rafi + 0.3)) * 2) * a1;
      if (la > 0) {
        const ym = (yb + g.yb) / 2;
        lat(ctx, '÷', 755, 690, { size: 64, w: 300, color: C.red, align: 'center', alpha: la });
        bracket(ctx, g.x1 + 24, yb, g.yb, 'الهامش', pctTxt(LS[Math.round(v)]), la, { vsize: 46 });
        txt(ctx, 'من حجم الصفقة', g.x1 + 64, Math.max(ym + 78, yb + 96), { size: 22, w: 'R', color: L8.sub(), align: 'left', alpha: la });
      }
    }
    const sp = Math.max(ap(t, T.rafi - 0.15, 13, 0.6) * a1, ap(t, T.p22 + 0.5, 13, 0.6) * a2);
    L8.slider(ctx, 1270, 650, 1010, v, sp, { label: 'الرافعة المالية' });
  }
  const ITEMS_A = [
    { s: 'الهامش', t: T.e0, kind: 'ar', w: 'B' }, { s: '=', t: T.e1, kind: 'op' }, { s: 'حجم الصفقة', t: T.e2, kind: 'ar', w: 'B' },
    { s: '÷', t: T.e3, kind: 'op' }, { s: 'الرافعة المالية', t: T.e4, kind: 'ar', w: 'B' },
  ];
  const ITEMS_C = [
    { s: '€100', t: T.yuhawwal33 - 0.1, kind: 'lat' }, { s: '×', t: T.rate1 - 0.6, kind: 'op' }, { s: '1', t: T.rate1, kind: 'lat' },
    { s: '=', t: T.usd100 - 0.35, kind: 'op' }, { s: '$100', t: T.usd100, kind: 'lat', lw: 400 },
  ];
  const ITEMS_ML = [
    { s: 'حقوق الملكية', t: T.f0, kind: 'ar', w: 'B' }, { s: '÷', t: T.f1, kind: 'op' }, { s: 'الهامش المستخدم', t: T.f2, kind: 'ar', w: 'B' },
    { s: '×', t: T.f3, kind: 'op' }, { s: '100%', t: T.f4, kind: 'lat', alpha: 0 },
  ];
  const RECAP = [
    { title: 'الهامش', lines: ['حجم الصفقة ÷ الرافعة'] },
    { title: 'عملة الهامش', lines: ['بعملة الأساس أولاً', 'ثم بعملة حسابك'] },
    { title: 'المخاطر', lines: ['نداء الهامش', 'ثم التصفية الإجبارية'] },
    { title: 'مستوى الهامش', lines: ['حقوق الملكية ÷', 'الهامش المستخدم × 100%'] },
  ];
  function underline(ctx, x0, x1, y, p, col = C.red) { if (p <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.globalAlpha *= clamp(p * 3); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(lerp(x0, x1, eo(p, 0, 1)), y); ctx.stroke(); ctx.restore(); }
  function board(ctx, t) {
    const p = ap(t, T.muadala - 1.05, 12, 0.6); if (p <= 0) return;
    const split = cio(t, T.p67 + 2.75, 0.9);                       // ch8: the board splits into the four recap cards
    if (split < 1) { L8.glass(ctx, BD.x, BD.y, BD.w, BD.h, { p, chamfer: 46, alpha: 1 - split }); }
    ctx.save(); ctx.globalAlpha *= clamp(p * 1.6) * (1 - split);
    K.chip(ctx, 'المعادلة', BD.x + BD.w - 40, BD.y + 54, { p: clamp((t - T.muadala) * 2.5), size: 24, color: L8.sub(), stroke: hexA(C.slate, 0.45) });
    // ch2 + ch5 rows (wiped at the start of ch7)
    const wipe = cio(t, T.p57 + 0.45, 0.75);
    if (wipe < 1) {
      ctx.save(); ctx.translate(-340 * wipe, 0); ctx.globalAlpha *= 1 - wipe;
      // alone in ch2 the formula sits in the middle of the board; it moves up to make room for the worked example
      const ya = lerp(BCY + 24, ROW.a, cio(t, T.k10kc - 1.1, 0.8));
      const pos = L8.eq(ctx, ITEMS_A, 960, ya, t, { size: 80 });
      // ch5 highlights: «الهامش», then «حجم الصفقة»
      underline(ctx, pos[0][2], pos[0][3], ya + 26, clamp((t - T.hamesh30) * 2.5) * fade(t, T.p31 + 0.2, 0.4));
      underline(ctx, pos[2][2], pos[2][3], ya + 26, clamp((t - T.safqa30) * 2.5) * fade(t, T.p31 + 0.6, 0.4));
      // row B: the numbers under their terms
      const rowB = [['€100', T.r100, 0, 0], ['=', T.eq32, 1, 1], ['€10,000', T.k10kc, 2, 0], ['÷', T.div31, 3, 1], ['100', T.lev31, 4, 0]];
      rowB.forEach(([s, t0, i, op]) => pop(ctx, s, pos[i][0], ROW.b, t, t0, { size: op ? 70 : 76, color: op ? C.red : L8.ink(), w: i === 0 ? 400 : 300 }));
      if (t > T.r100) underline(ctx, pos[0][0] + 95, pos[0][0] - 95, ROW.b + 24, clamp((t - T.r100 - 0.2) * 2.5), L8.ink());
      // row C: the conversion to the account currency
      const lift = t > USD.lift;
      const items = ITEMS_C.map((it, i) => (i === 4 && lift ? Object.assign({}, it, { alpha: 0 }) : it));
      const posC = L8.eq(ctx, items, 960, ROW.c, t, { size: 72 });
      const cap = clamp((t - T.rate1 - 0.15) * 2.5);
      if (cap > 0) txt(ctx, 'سعر EUR/USD · مثال افتراضي', posC[2][0], ROW.c + 54, { size: 24, w: 'R', color: L8.sub(), align: 'center', alpha: cap });
      const cl = clamp((t - T.dollar34 + 0.1) * 2.5) * fade(t, T.p35 + 0.6, 0.4);
      if (cl > 0) K.chip(ctx, 'عملة حسابك: الدولار', BD.x + 40, ROW.c - 16, { p: cl, size: 24, align: 'left', color: L8.ink(), stroke: hexA(C.slate, 0.5) });
      if (lift && t < USD.land + 0.05) { // the $100 drops from the board into the tank
        const u = clamp((t - USD.lift) / (USD.land - USD.lift)); const x = lerp(posC[4][0], TK.x, u), y = lerp(ROW.c, TK.y - 40, u * u);
        lat(ctx, '$100', x, y, { size: lerp(72, 40, u), w: 400, color: L8.ink(), align: 'center' });
      }
      ctx.restore();
    }
    // ch7: the margin-level formula
    if (t > T.p57) {
      head(ctx, [{ s: 'مستوى', t: T.p58 + 0.3 }, { s: 'الهامش', t: T.p58 + 0.45 }, { s: '=', t: T.p58 + 0.6, w: 'R' }], 960, ROW.a, t, { size: 80 });
      const pos = L8.eq(ctx, ITEMS_ML, 960, ROW.b, t, { size: 70 });
      const [cx, cy] = pos[4]; const w100 = (ctx.font = '300 70px IN', ctx.measureText('100%').width), wp = ctx.measureText('%').width;
      const k = ap(t, T.f4, 15, 0.5); if (k > 0) { ctx.save(); ctx.translate(cx, cy); ctx.scale(Math.min(1.1, k), Math.min(1.1, k)); lat(ctx, '100', -w100 / 2, 70 * 0.35, { size: 70, w: 300, color: L8.ink(), align: 'left' }); ctx.restore(); }
      const kp = ap(t, T.nisba, 15, 0.45); if (kp > 0) { ctx.save(); ctx.translate(cx + w100 / 2 - wp / 2, cy); ctx.scale(Math.min(1.15, kp), Math.min(1.15, kp)); lat(ctx, '%', 0, 70 * 0.35, { size: 70, w: 400, color: C.red, align: 'center' }); ctx.restore(); }
      const na = clamp((t - T.nisba - 0.3) * 2);
      if (na > 0) txt(ctx, 'يُعرض كنسبة مئوية', 960, ROW.c, { size: 34, w: 'R', color: L8.sub(), align: 'center', alpha: na });
    }
    ctx.restore();
    if (split > 0) recapCards(ctx, t, split);
  }
  function recapIcon(ctx, i, x, y, t) {
    ctx.save(); ctx.translate(x, y); ctx.strokeStyle = L8.ink(); ctx.fillStyle = L8.ink(); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (i === 0) { ctx.beginPath(); ctx.moveTo(-42, -56); ctx.lineTo(-42, 34); ctx.arcTo(-42, 52, -24, 52, 18); ctx.lineTo(24, 52); ctx.arcTo(42, 52, 42, 34, 18); ctx.lineTo(42, -56); ctx.stroke(); ctx.fillStyle = '#7F959B'; ctx.fillRect(-37, -16, 74, 64); ctx.fillStyle = '#2A3036'; ctx.fillRect(-37, 26, 74, 22); }
    else if (i === 1) { L8.coin(ctx, -26, 0, 34, '€', '€', 0, {}); L8.coin(ctx, 30, 0, 34, '$', '$', 0, {}); }
    else if (i === 2) { ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, 46, 0, 6.283); ctx.fill(); L8.bell(ctx, 0, 2, 26, Math.sin(t * 9) * 0.12, C.white); }
    else { ctx.beginPath(); ctx.moveTo(0, -56); ctx.lineTo(0, 56); ctx.stroke(); for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(-8, -50 + k * 25); ctx.lineTo(k % 2 ? 10 : 20, -50 + k * 25); ctx.stroke(); } ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(-14, -14); ctx.lineTo(-38, -26); ctx.lineTo(-38, -2); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
  function recapCards(ctx, t, split) {
    const lift = cio(t, T.p70 + 0.2, 0.8) * 60;
    for (let i = 0; i < 4; i++) {
      const qw = BD.w / 4; const x0 = BD.x + BD.w - (i + 1) * qw; const gap = 20 * split; const cw = qw - 2 * gap;
      const hl = env(t, [T.p68 + 0.35, T.p68 + 2.2, T.p69 + 0.1, T.p69 + 1.9][i], [T.p68 + 2.2, T.p69 + 0.1, T.p69 + 1.9, T.p70 - 0.1][i], 0.25, 0.3);
      const x = x0 + gap, y = BD.y - lift * (i % 2 ? 0.6 : 1), h = BD.h;
      ctx.save(); const cx = x + cw / 2, cy = y + h / 2; const s = 1 + 0.035 * hl; ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy);
      L8.glass(ctx, x, y, cw, h, { p: 1, chamfer: 34, stroke: hl > 0.05 ? hexA(C.red, 0.4 + 0.5 * hl) : undefined, lw: 1.6 + 2 * hl });
      const ca = clamp((t - (T.p67 + 3.3 + i * 0.35)) * 2.5);
      if (ca > 0) {
        ctx.globalAlpha *= ca;
        lat(ctx, String(i + 1).padStart(2, '0'), x + cw - 30, y + 66, { size: 34, w: 700, color: C.red, align: 'right' });
        recapIcon(ctx, i, cx, y + 210, t);
        txt(ctx, RECAP[i].title, cx, y + 360, { size: 40, w: 'B', color: L8.ink(), align: 'center' });
        RECAP[i].lines.forEach((ln, j) => txt(ctx, ln, cx, y + 430 + j * 44, { size: 26, w: 'R', color: L8.sub(), align: 'center', alpha: clamp((t - (T.p67 + 3.6 + i * 0.35)) * 2.5) }));
      }
      ctx.restore();
    }
  }

  // ================================================================ 03 · the currency of margin: € coin → $, base and quote
  function currency(ctx, t, rc = 0) {
    const a = Math.max(env(t, T.p12 + 0.4, T.p20 + 1.5, 0.4, 0.6), rc); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    const done = rc > 0 && t > T.p60;
    if (!done) capAt(ctx, wl(13, 5, 9, { map: { 8: { color: L8.ink(), w: 'B' }, 9: { color: L8.ink(), w: 'B' } } }), COIN.x, COIN.y - 200, t, { size: 46, out: K.outAt(t, T.p16 + 0.4, 0.5) });
    const cp = done ? 1 : ap(t, T.asas13 - 0.1, 13, 0.5); const flip = done ? 1 : cio(t, T.yuhawwal - 0.05, 0.8);
    L8.coin(ctx, COIN.x, COIN.y, 120, '€', '$', flip, { p: cp });
    if (!done) {
      K.burst(ctx, COIN.x, COIN.y, t, T.asas13, C.red, 40, 210, 0.7);
      const l1 = clamp((t - T.asas13b) * 2.5) * (1 - flip), l2 = clamp((t - T.hisab15 + 0.1) * 2.5);
      txt(ctx, 'عملة الأساس', COIN.x, COIN.y + 178, { size: 34, w: 'B', color: L8.ink(), align: 'center', alpha: l1 });
      txt(ctx, 'عملة حسابك', COIN.x, COIN.y + 178, { size: 34, w: 'B', color: L8.ink(), align: 'center', alpha: l2 });
      K.chip(ctx, flip > 0.5 ? 'الهامش $' : 'الهامش €', COIN.x + 110, COIN.y + 250, { p: clamp((t - T.hamesh13) * 2.5), size: 26, align: 'center', color: L8.ink(), stroke: hexA(C.slate, 0.5) });
      K.chip(ctx, 'حجم الصفقة €', COIN.x - 110, COIN.y + 250, { p: clamp((t - T.hajm14) * 2.5), size: 26, align: 'center', color: L8.ink(), stroke: hexA(C.slate, 0.5) });
    }
    // the pair: EUR = base, USD = quote; then the exchange
    const pp = done ? 1 : ap(t, T.euro16 - 0.1, 12, 0.55);
    if (pp > 0) {
      const hb = done ? 1 : cio(t, T.euro17 - 0.1, 0.4);
      const geo = L8.pair(ctx, PAIR.x, PAIR.y, pp, { size: 190, base: hb });
      if (geo && !done) {
        const lb = clamp((t - T.asas17 + 0.05) * 2.5), lq = clamp((t - T.tasir + 0.05) * 2.5);
        const ul = (cx, wd, p, col) => { if (p <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx + wd / 2, PAIR.y + 34); ctx.lineTo(lerp(cx + wd / 2, cx - wd / 2, eo(p, 0, 1)), PAIR.y + 34); ctx.stroke(); ctx.restore(); };
        ul(geo.eur[0], geo.wE, lb, C.red); ul(geo.usd[0], geo.wU, lq, L8.ink());
        txt(ctx, 'عملة الأساس', geo.eur[0], PAIR.y + 88, { size: 32, w: 'B', color: L8.ink(), align: 'center', alpha: lb });
        txt(ctx, 'عملة التسعير', geo.usd[0], PAIR.y + 88, { size: 32, w: 'B', color: L8.ink(), align: 'center', alpha: lq });
        // the exchange: € travels to the dollar side, $ to the euro side
        const ex = cio(t, T.tabadul - 0.15, 1.0); const ca = clamp((t - (T.p19 + 0.4)) * 2) * fade(t, T.p20 + 0.6, 0.4);
        if (ca > 0) {
          const xa = geo.eur[0], xb = geo.usd[0], y = PAIR.y + 230;
          ctx.save(); ctx.globalAlpha *= ca;
          L8.coin(ctx, lerp(xa, xb, ex), y - Math.sin(ex * Math.PI) * 110, 54, '€', '€', 0, { p: 1 });
          L8.coin(ctx, lerp(xb, xa, ex), y + Math.sin(ex * Math.PI) * 60, 54, '$', '$', 0, { p: 1 });
          const am = clamp((t - T.miqdar) * 2);
          if (am > 0) { lat(ctx, '1 EUR = ? USD', (xa + xb) / 2, y + 120, { size: 34, w: 600, color: L8.sub(), align: 'center', alpha: am }); }
          ctx.restore();
        }
      }
    }
    ctx.restore();
  }

  // ================================================================ 04 · leverage in an example: $1,000 × 1:100 = 100 tanks
  function ch4(ctx, t) {
    if (t < T.p21 - 0.5 || t > T.p26) return;
    const o = tankNow(t); const g = L8.tankGeo(o); const ys = surf(o);
    const ba = clamp((t - T.barasid + 0.1) * 2) * fade(t, T.p24 + 0.8, 0.5);
    bracket(ctx, g.x1 + 24, ys, g.yb, 'رصيد الحساب', t > T.k1000 - 0.05 ? '$1,000' : '', ba, { vsize: 52 });
    const ea = fade(t, T.p25 + 0.3, 0.5);
    if (ea > 0) L8.eq(ctx, [
      { s: '$1,000', t: T.k1000b, kind: 'lat' }, { s: '×', t: T.mul23, kind: 'op' }, { s: '100', t: T.lev23, kind: 'lat' },
      { s: '=', t: T.k100k - 0.35, kind: 'op' }, { s: '$100,000', t: T.k100k, kind: 'lat', lw: 400 },
    ], 960, 270, t, { size: 92, out: 1 - ea });
    // the wall of 100 tanks (ours is the top-right one)
    const ga = env(t, T.p24 + 0.9, T.p25 + 2.4, 0.2, 1.1); if (ga <= 0) return;
    ctx.save(); ctx.globalAlpha *= ga;
    for (let r = 0; r < GRID.n; r++) for (let c = 0; c < GRID.n; c++) {
      if (!r && !c) continue; const d = r + c; const p = ap(t, T.p24 + 1.3 + d * 0.07, 16, 0.6); if (p <= 0) continue;
      ghostTank(ctx, TK.x - c * GRID.dx, TK.y + r * GRID.dy, Math.min(1, p), clamp((t - (T.k100k - 0.2 + d * 0.028)) / 0.35));
    }
    const k = ap(t, T.k100k, 13, 0.5);
    if (k > 0) {
      ctx.save(); ctx.translate(GCX, GCY); ctx.scale(Math.min(1.08, k), Math.min(1.08, k));
      ctx.font = '300 700px IN'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
      ctx.lineWidth = 90; ctx.strokeStyle = 'rgba(251,251,251,0.94)'; ctx.strokeText('$100,000', 0, -60);
      ctx.fillStyle = C.ink; ctx.fillText('$100,000', 0, -60);
      ctx.restore();
      const sa = clamp((t - T.k100k - 0.4) * 2);
      if (sa > 0) { ctx.save(); ctx.globalAlpha *= sa; ctx.font = A.font(190, 'B'); ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.lineJoin = 'round';
        ctx.lineWidth = 56; ctx.strokeStyle = 'rgba(251,251,251,0.94)'; ctx.strokeText('= 100 حساب مثل حسابك', GCX, GCY + 560); ctx.fillStyle = C.ink; ctx.fillText('= 100 حساب مثل حسابك', GCX, GCY + 560); ctx.restore(); }
    }
    ctx.restore();
  }

  // ================================================================ 05 · the worked example: ticket, lot bar, board, $100, platform
  function ch2Question(ctx, t) {
    const out = K.outAt(t, T.hamesh8 + 0.7, 0.45); if (t < T.p7 + 0.05 || out >= 1) return;
    head(ctx, [{ s: 'كيف', t: T.p7 + 0.25 }, { s: 'تحسب', t: T.tahsib }, { s: 'الهامش؟', t: T.q7 }], 960, 300, t, { size: 110, out });
  }
  function ch5Question(ctx, t) {
    const out = K.outAt(t, T.p26 + 0.1, 0.45); if (t < T.kam - 0.2 || out >= 1) return;
    head(ctx, [{ s: 'كم', t: T.kam }, { s: 'هامشاً', t: T.hameshan }, { s: 'ستحتاج؟', t: T.satahtaj }], 960, 300, t, { size: 104, out });
  }
  function ticket(ctx, t, rc = 0) {
    const a = Math.max(env(t, T.p26 + 0.1, T.p30 + 0.9, 0.3, 0.8), rc); if (a <= 0) return;
    const done = rc > 0 && t > T.p60; const tt = done ? 1e9 : t;
    const p = done ? 1 : ap(t, T.p26 + 0.2, 13, 0.6);
    const rows = [
      { k: 'الرمز', v: typed('EUR/USD', tt, T.pair26 - 0.3, 0.55), caret: !done && t > T.pair26 - 0.4 && t < T.pair26 + 0.5 },
      { k: 'الحجم (عقد)', v: typed('0.10', tt, T.lot01 - 0.2, 0.32), caret: !done && t > T.lot01 - 0.5 && t < T.lot01 + 0.6, hi: env(t, T.lot01b - 0.1, T.lot01b + 1.4, 0.2, 0.4) },
      { k: 'النوع', v: tt > T.pair26 + 0.7 ? 'شراء' : '' },
      { k: 'حجم الصفقة', v: tt > T.k10k - 0.05 ? '€10,000' : '', hi: env(t, T.k10k, T.p28 + 0.4, 0.2, 0.5), a: done ? 1 : clamp((t - T.p27) * 2) },
    ];
    ctx.save(); ctx.globalAlpha *= a;
    L8.ticket(ctx, TIX.x, TIX.y, TIX.w, rows, p, { t, title: 'أمر جديد' });
    // the lot bar: 1 standard lot = 100,000 units in ten 0.1 segments
    const lp = done ? 1 : ap(t, T.lot01b - 0.35, 13, 0.6); const lit = done ? 10 : (t < T.qiyasi - 0.3 ? clamp((t - T.lot01b) * 4) : 1 + 9 * clamp((t - (T.qiyasi - 0.3)) / 1.1));
    L8.lotBar(ctx, LOT.xr, LOT.y, LOT.w, LOT.h, lp, lit, { label: '0.1' });
    const la = done ? 1 : clamp((t - T.qiyasi) * 2);
    if (la > 0) {
      txt(ctx, 'عقد قياسي واحد = 100,000 وحدة', LOT.xr, LOT.y + LOT.h + 50, { size: 30, w: 'B', color: L8.ink(), align: 'right', alpha: la });
      txt(ctx, 'قد يختلف حسب الوسيط', LOT.xr, LOT.y + LOT.h + 88, { size: 22, w: 'R', color: L8.sub(), align: 'right', alpha: la });
    }
    if (!done) {
      const ea = fade(t, T.p30 + 0.3, 0.5);
      L8.eq(ctx, [
        { s: '0.1', t: T.lot01b, kind: 'lat' }, { s: '×', t: T.mul28, kind: 'op' }, { s: '100,000', t: T.k100kb, kind: 'lat' },
        { s: '=', t: T.k100kb + 0.45, kind: 'op' }, { s: '€10,000', t: T.k100kb + 0.65, kind: 'lat', lw: 400 },
      ], 470, 222, t, { size: 70, out: 1 - ea });
    }
    ctx.restore();
  }
  function ch5Tank(ctx, t) {
    if (t < USD.land - 0.2 || t > T.p40 + 0.5) return;
    const o = tankNow(t); const g = L8.tankGeo(o); const ys = surf(o), yb = bandTop(o);
    const a = clamp((t - USD.land - 0.25) * 2) * fade(t, T.p37 + 0.3, 0.4) + env(t, T.fala + 0.3, T.p40 + 0.2, 0.4, 0.5);
    bracket(ctx, g.x1 + 24, yb, g.yb, 'الهامش المستخدم', '$100', clamp(a), { vsize: 40, size: 28 });
    bracket(ctx, g.x1 + 24, ys, yb - 4, 'الهامش الحر', '$900', clamp(a * 1.2 - 0.2), { vsize: 40, size: 28 });
    // «محيّراً»: the numbers spin around the tank, «فلا تقلق» sends them away
    const sw = env(t, T.p37 + 0.2, T.fala + 0.5, 0.5, 0.45); if (sw <= 0) return;
    const nums = ['$100', '€100', '1:100', '÷', '0.1', '×', '100,000', '€10,000', '%'];
    nums.forEach((s, i) => {
      const ang = t * 1.5 + i / nums.length * 6.283; const r = 330 + 40 * Math.sin(i * 2.1 + t); const fly = cio(t, T.fala - 0.05, 0.5);
      const x = TK.x + Math.cos(ang) * r * (1 + fly * 2.2), y = 620 + Math.sin(ang) * r * 0.55 * (1 + fly * 2.2);
      lat(ctx, s, x, y, { size: 44, w: 600, color: i % 3 ? L8.sub() : L8.ink(), align: 'center', alpha: sw * (1 - fly) });
    });
  }
  function platform(ctx, t, rc = 0) {
    const a = Math.max(env(t, T.p38 + 0.2, T.p40 + 0.7, 0.3, 0.7), rc); if (a <= 0) return;
    const done = rc > 0 && t > T.p60; const p = done ? 1 : ap(t, T.p38 + 0.5, 13, 0.6);
    const ra = (k) => (done ? 1 : clamp((t - (T.tilqai + 0.1 + k * 0.32)) * 4));
    const rows = [
      { k: 'الرصيد', v: '$1,000', a: ra(0) }, { k: 'حقوق الملكية', v: '$1,000', a: ra(1) },
      { k: 'الهامش المستخدم', v: '$100', a: ra(2), hi: done ? 0 : env(t, T.tilqai + 0.9, T.p39 + 0.6, 0.3, 0.6) },
      { k: 'الهامش الحر', v: '$900', a: ra(3) }, { k: 'مستوى الهامش', v: '1,000%', a: ra(4) },
    ];
    ctx.save(); ctx.globalAlpha *= a;
    L8.panel(ctx, PANEL.x, PANEL.y, PANEL.w, rows, p, { title: 'حسابك على المنصة' });
    const gp = done ? 1 : ap(t, T.tilqai - 0.15, 14, 0.5);
    L8.gear(ctx, PANEL.x + 132, PANEL.y + 48, 15, (t - T.tilqai) * 3 * env(t, T.tilqai - 0.2, T.p39 + 0.3, 0.2, 0.8), gp * p);
    txt(ctx, 'تلقائياً', PANEL.x + 160, PANEL.y + 57, { size: 22, w: 'R', color: hexA(C.white, 0.7), align: 'left', alpha: clamp(gp * p * 2 - 1) });
    ctx.restore();
  }

  // ================================================================ 06 · margin call and stop out (night)
  function levelLine(ctx, g, o, frac, p, label, sub, col, flash = 0) {
    if (p <= 0) return; const y = g.yb - frac * o.h; const q = eo(p, 0, 1);
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3 + 3 * flash; ctx.setLineDash([12, 8]); ctx.globalAlpha *= clamp(p * 2);
    ctx.beginPath(); ctx.moveTo(g.x0 - 10, y); ctx.lineTo(lerp(g.x0 - 10, g.x1 + 60, q), y); ctx.stroke(); ctx.restore();
    txt(ctx, label, g.x1 + 76, y + 10, { size: 30, w: 'B', color: col, align: 'left', alpha: clamp((p - 0.4) * 2) });
    if (sub) txt(ctx, sub, g.x1 + 76, y + 44, { size: 22, w: 'R', color: L8.sub(), align: 'left', alpha: clamp((p - 0.5) * 2) });
  }
  const chartVals = K.path([[0, 1.085], [0.3, 1.0835], [0.55, 1.0788], [0.75, 1.0762], [1, 1.0702]], 120, 8, 0.0007);
  const chartP = (t) => keys(t, 0, [[T.p43 + 0.1, RK.mcHit - T.p43 - 0.1, 0.55], [RK.d2, RK.d2d, 1.0]]);
  const pourF = (t) => keys(t, 0, [[RK.pour - 0.35, 0.6, 0.4], [RK.pour + 0.25, 2.0, 1.0], [RK.pour + 2.4, 0.6, 0], [RK.rew, 0.25, 1.0], [RK.rew + 0.3, RK.rewD - 0.3, 0]]);
  function risk(ctx, t) {
    if (t < RK.c1 - 0.5 || t > RK.newTrade + 30) return;
    const o = tankNow(t); const g = L8.tankGeo(o); const ys = surf(o), yb = bandTop(o);
    // the open trades; their tethers hold the band; the stop out slashes them
    const gone = fade(t, T.p53 + 0.4, 0.5);
    for (let i = 0; i < 3; i++) {
      const t0 = [RK.c1, RK.c2, RK.c3][i]; const p = ap(t, t0 - 0.25, 14, 0.55) * gone; if (p <= 0) continue;
      const cut = clamp((t - (RK.cut + i * 0.2)) / 0.9); const ok = env(t, T.maftuha48 - 0.2, RK.rew + 0.1, 0.3, 0.2);
      tradeCard(ctx, RC.x, RC.ys[i], t, p, { cut, ok, n: i + 1, trend: t > T.p43 ? 1 : 0, lots: ['0.10', '0.10', '0.10'][i] });
      tether(ctx, RC.x + 330, RC.ys[i] + 64, g.x0 + 8, lerp(yb, g.yb, 0.5), clamp((t - t0 - 0.1) * 2) * (1 - clamp((t - RK.cut - i * 0.2) * 3)), t, { sag: 30 + i * 10 });
    }
    // the lines: margin call at the band's top (100%), stop out at half of it (50%)
    const la = env(t, T.nida - 0.1, T.p53 + 0.9, 0.5, 0.6); const lsub = 'قد يختلف حسب الوسيط';
    levelLine(ctx, g, o, MC, la * clamp((t - T.nida + 0.1) * 1.6), 'نداء الهامش', '', C.red, pulse(t, RK.mcHit, 0.3));
    levelLine(ctx, g, o, SO, la * clamp((t - T.tasfiya + 0.1) * 1.6), 'التصفية الإجبارية', lsub, C.red, t > RK.soHit && t < T.tilqai51 ? 0.5 + 0.5 * Math.sin((t - RK.soHit) * 16) : 0);
    // the hidden risks headline
    const hOut = K.outAt(t, T.p43 - 0.5, 0.45);
    if (t > T.makhatir - 0.2 && hOut < 1) head(ctx, wl(41, 5, 6), 960, 290, t, { size: 100, out: hOut });
    // equity label follows the surface
    const ea = clamp((t - T.huquq + 0.05) * 2) * fade(t, T.p52 + 0.6, 0.5);
    if (ea > 0) L8.leader(ctx, g.x1 - 30, ys + 16, g.x1 + 70, 452, 'حقوق الملكية', ea, { size: 30 });
    // the price falls (charts read left → right)
    const ca = env(t, T.p43 - 0.2, T.p52 + 1.0, 0.5, 0.6);
    if (ca > 0) {
      ctx.save(); ctx.globalAlpha *= ca;
      L8.glass(ctx, CHART[0] - 30, CHART[1] - 60, CHART[2] + 60, CHART[3] + 100, { p: 1, chamfer: 24, shadow: false });
      lat(ctx, 'EUR/USD', CHART[0] + CHART[2], CHART[1] - 18, { size: 26, w: 600, color: L8.sub(), align: 'right' });
      L8.chart(ctx, CHART, chartVals, 1.068, 1.087, Math.max(0.02, chartP(t)), { color: L8.ink(), entry: 1.085, entryLabel: 'سعر الدخول' });
      ctx.restore();
    }
    // «تخسر مالاً»: losses leave the surface
    const lo = env(t, T.takhsar - 0.3, T.p46 + 1.5, 0.3, 0.5);
    if (lo > 0) for (let i = 0; i < 6; i++) { const ph2 = ((t - T.takhsar) * 0.7 + i / 6) % 1; if (ph2 < 0) continue; lat(ctx, '−$', g.x0 + 50 + i * 48, ys - 20 - ph2 * 130, { size: 30, w: 700, color: C.red, align: 'center', alpha: lo * (1 - ph2) }); }
    // the margin call rings; the deposit dismisses it; the rewind brings it back
    const cIn = ap(t, RK.mcHit + 0.1, 14, 0.55), cOut = cio(t, RK.pour + 2.0, 0.5), cBack = cio(t, RK.rew + 0.2, 0.6), cEnd = cio(t, T.p50 + 0.4, 0.5);
    const cp = cIn * (1 - cOut + cBack) * (1 - cEnd);
    if (cp > 0) {
      const ring = Math.max(env(t, RK.mcHit + 0.15, T.p47 + 0.2, 0.1, 0.3), env(t, RK.rew + 0.5, RK.d2 + 0.8, 0.1, 0.3));
      const dx = (1 - Math.min(1, cp)) * 300;
      L8.call(ctx, 1180 + dx, 196, Math.min(1.06, cp), t, { ring });
      L8.stamp(ctx, 1600 + dx, 210, 26, ap(t, RK.pour + 1.7, 15, 0.5) * (1 - cio(t, RK.rew, 0.2)) * (1 - cOut), true);
    }
    // the deposit: a jug pours into the tank (and un-pours on the rewind)
    const pf = pourF(t); const ja = env(t, RK.pour - 0.6, RK.d2, 0.35, 0.4);
    if (ja > 0) jug(ctx, 1080, 150, pf, ja, ys, t);
  }
  // screen-space rewind marks (the «what if not» rewind)
  function rewindFx(ctx, t) {
    const a = env(t, RK.rew - 0.05, RK.rew + RK.rewD + 0.15, 0.1, 0.25); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(255,255,255,0.05)'; for (let y = (t * 900) % 9; y < 1080; y += 9) ctx.fillRect(0, y, 1920, 2);
    ctx.fillStyle = C.white; for (let k = 0; k < 2; k++) { const x = 960 - 6 + k * 40 - 20; ctx.beginPath(); ctx.moveTo(x + 18, 44); ctx.lineTo(x - 16, 66); ctx.lineTo(x + 18, 88); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }

  // ================================================================ 07 · margin level (day): the ruler, the formula, 200%
  function ch7(ctx, t) {
    if (t < DAY.t0 || t > REC.out) return;
    const o = tankNow(t); const g = L8.tankGeo(o); const ys = surf(o), yb = bandTop(o);
    // a single open trade again
    const tp = ap(t, RK.newTrade - 0.3, 14, 0.55) * fade(t, T.p57 + 0.6, 0.5);
    if (tp > 0) { tradeCard(ctx, RC.x, RC.ys[1], t, tp, { n: 4 }); tether(ctx, RC.x + 330, RC.ys[1] + 64, g.x0 + 8, lerp(yb, g.yb, 0.5), clamp((t - RK.newTrade) * 2) * fade(t, T.p57 + 0.6, 0.5), t, { sag: 40 }); }
    // the ruler: margin level = equity ÷ used margin × 100
    const ra = env(t, T.mustawa54 - 0.3, T.p57 + 1.0, 0.4, 0.6);
    if (ra > 0 && o.band > 0.05) {
      const xr = g.x1 + 46; const yOf = (pct) => g.yb - pct / 100 * o.band * o.h;
      ctx.save(); ctx.globalAlpha *= ra; ctx.fillStyle = hexA(C.red, 0.18); ctx.fillRect(xr - 6, yOf(100), 12, g.yb - yOf(100)); ctx.restore();
      L8.ruler(ctx, o, ra, [50, 100, 200, 300], t);
      txt(ctx, 'مستوى الهامش', xr, Math.min(yOf(300), ys) - 56, { size: 32, w: 'B', color: L8.ink(), align: 'left', alpha: ra });
      // the live marker at the surface
      const lvl = Math.round(o.fill / o.band * 100 / 10) * 10; const mx = xr + 150;
      ctx.save(); ctx.globalAlpha *= ra; ctx.strokeStyle = C.red; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(g.x1 - 4, ys); ctx.lineTo(mx - 60, ys); ctx.stroke();
      ctx.fillStyle = C.red; roundRect(ctx, mx - 60, ys - 28, 132, 56, 28); ctx.fill(); ctx.restore();
      lat(ctx, lvl + '%', mx + 6, ys + 11, { size: 30, w: 700, color: C.white, align: 'center', alpha: ra });
      // «أمان»: a check beside the level; «الخسائر» push it down
      L8.stamp(ctx, mx + 116, ys, 24, ap(t, T.aman - 0.05, 15, 0.5) * fade(t, T.p56 + 0.4, 0.4), true);
      const lz = env(t, T.khasair - 0.15, T.khasair + 0.75, 0.15, 0.3); if (lz > 0) { const bb = Math.abs(Math.sin((t - T.khasair) * 8)) * 18; ctx.save(); ctx.globalAlpha *= lz; ctx.fillStyle = C.red; ctx.translate(TK.x + 60, ys - 70 + bb); ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(20, 0); ctx.lineTo(0, 26); ctx.closePath(); ctx.fill(); ctx.fillRect(-6, -34, 12, 36); ctx.restore(); }
      // «أبعد»: the distance from the margin-call level grows
      const da = clamp((t - T.abad + 0.1) * 2) * fade(t, T.p57 + 0.4, 0.4);
      if (da > 0) { const x = xr + 250, y0 = yOf(100), y1 = ys + 34; ctx.save(); ctx.globalAlpha *= da; ctx.strokeStyle = L8.ink(); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, lerp(y0, y1, eo(da, 0, 1))); ctx.stroke();
        ctx.fillStyle = L8.ink(); [[y0, 1], [y1, -1]].forEach(([yy, s]) => { ctx.beginPath(); ctx.moveTo(x - 10, yy - 14 * s); ctx.lineTo(x, yy); ctx.lineTo(x + 10, yy - 14 * s); ctx.closePath(); ctx.fill(); }); ctx.restore();
        txt(ctx, 'أبعد عن نداء الهامش', x + 22, (y0 + y1) / 2 + 10, { size: 26, w: 'B', color: L8.ink(), align: 'left', alpha: da }); }
      // «قبل فتح أي صفقات أخرى»: a new trade waits, with a question
      const gq = env(t, T.fath54 - 0.2, T.p55 + 1.2, 0.3, 0.5);
      if (gq > 0) { ctx.save(); ctx.globalAlpha *= gq; ctx.strokeStyle = L8.sub(); ctx.lineWidth = 2.5; ctx.setLineDash([10, 8]); roundRect(ctx, RC.x, RC.ys[0] - 40, 330, 110, 14); ctx.stroke(); ctx.restore();
        txt(ctx, 'صفقة جديدة؟', RC.x + 165, RC.ys[0] + 26, { size: 32, w: 'B', color: L8.ink(), align: 'center', alpha: gq }); }
    }
    // 10,000 / 5,000: the example on the tank
    const ea = env(t, T.k10k61 - 0.3, REC.in + 0.8, 0.4, 0.6);
    if (ea > 0) {
      bracket(ctx, g.x0 - 24, ys, g.yb, 'حقوق الملكية', '$10,000', ea * clamp((t - T.k10k61 + 0.1) * 2), { side: 'left', vsize: 48 });
      bracket(ctx, g.x1 + 24, yb, g.yb, 'الهامش المستخدم', '$5,000', ea * clamp((t - T.k5k + 0.05) * 2) * (o.band > 0.05 ? 1 : 0), { vsize: 48 });
      const sa = fade(t, REC.in + 0.4, 0.5);
      if (sa > 0) L8.eq(ctx, [
        { s: '$10,000', t: T.sb0, kind: 'lat' }, { s: '÷', t: T.sb1, kind: 'op' }, { s: '$5,000', t: T.sb2, kind: 'lat' }, { s: '×', t: T.sb3, kind: 'op' },
        { s: '100', t: T.sb4, kind: 'lat' }, { s: '=', t: T.pct200 - 0.4, kind: 'op' }, { s: '200%', t: T.pct200, kind: 'lat', lw: 600, size: 104 },
      ], 980, 250, t, { size: 76, out: 1 - sa });
      // two bands fit in the equity → 200%
      const gb = clamp((t - T.pct200 - 0.25) * 2) * fade(t, REC.in + 0.4, 0.5);
      if (gb > 0 && o.band > 0.2) { const h2 = g.yb - yb; const y2 = lerp(yb, yb - h2, eo(gb, 0, 1)); ctx.save(); ctx.globalAlpha *= gb; ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.setLineDash([10, 7]); ctx.strokeRect(g.x0 + 10, y2, TK.w - 20, h2 - 4); ctx.restore();
        lat(ctx, '×2', TK.x, y2 + h2 / 2 + 14, { size: 44, w: 700, color: C.red, align: 'center', alpha: gb }); }
    }
  }

  // ================================================================ 08 · the recap: the whole journey, the cards, the arrow, the dot
  function journeyTitle(ctx, t) {
    const a = env(t, REC.in, T.p67 + 1.5, 0.4, 0.8); if (a <= 0) return;
    head(ctx, wl(66, 1, 3), 165, -895, t, { size: 200, alpha: a });
  }
  function arrowDown(ctx, t) {
    const a = env(t, T.asila - 0.2, T.p71 + 0.9, 0.3, 0.4); if (a <= 0) return;
    const bb = Math.abs(Math.sin((t - T.asfal) * 6)) * 22 * (t > T.asfal - 0.1 ? 1 : 0);
    K.chip(ctx, 'الأسئلة', 960, 790, { p: a, size: 26, align: 'center', color: L8.ink(), stroke: hexA(C.slate, 0.5) });
    ctx.save(); ctx.globalAlpha *= a * clamp((t - T.asfal + 0.2) * 3); ctx.translate(960, 880 + bb); ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.lineTo(0, 40); ctx.closePath(); ctx.fill(); ctx.fillRect(-8, -50, 16, 52); ctx.restore();
  }
  function section(ctx, t) {
    let cur = 0; F.chapters.forEach((c, i) => { if (t >= c.t) cur = i; }); const c = F.chapters[cur]; const p = eo(t, c.t, 0.45);
    ctx.save(); ctx.globalAlpha *= 1 - clamp(inv(F.CLOSE - 1.6, F.CLOSE - 0.9, t)); ctx.beginPath(); ctx.rect(60, 50, 900, 60); ctx.clip();
    const lw = txt(ctx, c.label, 77, 92 + (1 - p) * 40, { size: 28, w: 'S', color: L8.ink(), align: 'left', dir: 'rtl' });
    lat(ctx, String(cur + 1).padStart(2, '0'), 77 + lw + 12, 92 + (1 - p) * 40, { size: 20, w: 700, color: C.red });
    ctx.restore();
  }

  // ---------------------------------------------------------------- SFX (frame-accurate; the voice is added in the edit)
  sfx(T.s0 + 0.04, 'pop', 0.18, { f: 900 });
  ksfx(T.maHu, 'drop', 0.15); ksfx(T.huwa, 'drop', 0.12); sfx(T.marjin - 0.02, 'slam', 0.18); sfx(T.ay, 'whoosh', 0.1, { d: 0.3, up: false }); sfx(T.hamesh - 0.02, 'slam', 0.24); sfx(T.hamesh + 0.05, 'impact', 0.12);
  sfx(T.drop, 'whoosh', 0.16, { d: 0.42, up: false }); sfx(T.splash, 'bloop', 0.22); sfx(T.splash + 0.02, 'ripple', 0.14); sfx(T.splash + 0.3, 'chime', 0.07);
  sfx(T.mal - 0.1, 'charge', 0.1, { d: 1.4 }); [0, 0.35, 0.7].forEach((d, i) => sfx(T.mal + 0.2 + d, 'bloop', 0.05, { pan: i - 1 }));
  sfx(T.hisab - 0.2, 'tick', 0.1, { f: 2200, pan: 0.3 });
  sfx(T.fath - 0.3, 'whoosh', 0.16, { d: 0.5, pan: -0.4 }); sfx(T.safqa, 'click', 0.2); sfx(T.safqa + 0.05, 'stretch', 0.12); sfx(T.safqa + 0.2, 'snap', 0.16);
  sfx(T.wadia - 2.0, 'whoosh', 0.14, { d: 1.5, pan: -0.3 }); sfx(T.ashbah + 0.1, 'impact', 0.12); sfx(T.ashbah + 0.15, 'pop', 0.14, { f: 600 }); sfx(T.wadia, 'tick', 0.1, { f: 2600 });
  sfx(T.yahtafiz, 'scribble', 0.08, { d: 0.6 }); sfx(T.wasit, 'pop', 0.12, { f: 820, pan: -0.4 });
  sfx(T.istijar - 0.3, 'spin', 0.16); sfx(T.manzil, 'pop', 0.16, { f: 700 }); sfx(T.manzil - 1.2, 'whoosh', 0.12, { d: 1.2, pan: -0.3 });
  sfx(T.tadfa - 0.05, 'whoosh', 0.14, { d: 0.7, pan: 0.4 }); sfx(T.tadfa + 0.7, 'bloop', 0.12, { pan: -0.3 });
  sfx(T.darar - 0.03, 'slam', 0.16); sfx(T.darar + 0.1, 'chime', 0.08); for (let i = 0; i < 6; i++) sfx(T.intiha - 0.2 + i * 0.15, 'tick', 0.07, { f: 1800 + i * 160 }); sfx(T.ijar + 0.35, 'pop', 0.12);
  sfx(T.tastarid - 0.1, 'whoosh', 0.14, { d: 0.8, pan: 0.4, up: false }); sfx(T.taminak, 'chime', 0.14);
  sfx(T.p5 - 0.1, 'spin', 0.12); sfx(T.p5 + 0.3, 'whip', 0.24); sfx(T.p5 + 1.4, 'impact', 0.14);
  sfx(T.taghliq - 0.08, 'click', 0.2); sfx(T.taghliq + 0.05, 'whoosh', 0.1, { d: 0.4, up: false }); sfx(T.yuad - 0.1, 'snap', 0.2);
  [0, 0.3, 0.6, 0.9].forEach((d, i) => sfx(T.yuad + 0.5 + d, 'bloop', 0.06, { pan: (i % 2 ? 0.3 : -0.3) })); sfx(T.hisab6, 'chime', 0.14);
  sfx(T.p7 + 0.05, 'whoosh', 0.14, { d: 1.0 }); ksfx(T.p7 + 0.25, 'drop', 0.15); ksfx(T.tahsib, 'drop', 0.15); ksfx(T.q7, 'drop', 0.18);
  sfx(T.hamesh8 - 0.1, 'pop', 0.12, { f: 640, pan: -0.4 }); sfx(T.rafi - 0.15, 'click', 0.14); sfx(T.rafi, 'whoosh', 0.1, { d: 0.5 });
  for (let i = 1; i <= 5; i++) sfx(LEV.s0 + (LEV.s1 - LEV.s0) * (0.12 + 0.8 * i / 5), 'tick', 0.1, { f: 1600 + i * 300, pan: 0.3 - i * 0.12 });
  sfx(LEV.s0, 'stretch', 0.12); sfx(T.inkhafad, 'bloop', 0.1);
  sfx(T.muadala - 1.7, 'whoosh', 0.18, { d: 1.5 }); sfx(T.muadala - 1.0, 'impact', 0.12); sfx(T.muadala, 'pop', 0.12, { f: 900 });
  ksfx(T.e0, 'drop', 0.18); sfx(T.e1, 'tick', 0.14, { f: 2400 }); ksfx(T.e2, 'drop', 0.18); sfx(T.e3, 'tick', 0.14, { f: 2600 }); ksfx(T.e4, 'drop', 0.18); sfx(T.e4 + 0.9, 'chime', 0.12);
  sfx(T.p13 - 0.9, 'whoosh', 0.2, { d: 1.8, pan: -0.4 }); sfx(T.p13 + 1.2, 'impact', 0.1);
  sfx(T.asas13 - 0.05, 'pop', 0.2, { f: 700 }); sfx(T.asas13, 'chime', 0.08); sfx(T.hamesh13 + 0.05, 'pop', 0.1, { f: 900 }); sfx(T.hajm14, 'pop', 0.1, { f: 980 });
  sfx(T.yuhawwal - 0.05, 'spin', 0.2); sfx(T.hisab15, 'tick', 0.12, { f: 2400 });
  sfx(T.p16 + 0.3, 'whoosh', 0.14, { d: 1.4, pan: -0.4 }); sfx(T.euro16 - 0.05, 'slam', 0.18); sfx(T.euro17 - 0.1, 'pop', 0.12, { pan: -0.3 }); sfx(T.asas17, 'tick', 0.1, { pan: -0.3 });
  sfx(T.dollar18 + 0.1, 'pop', 0.12, { pan: 0.3 }); sfx(T.tasir, 'tick', 0.1, { pan: 0.3 });
  sfx(T.tabadul - 0.15, 'whoosh', 0.14, { d: 0.9, pan: 0.4 }); sfx(T.tabadul - 0.1, 'whoosh', 0.12, { d: 0.9, pan: -0.4, up: false }); sfx(T.tabadul + 0.85, 'bloop', 0.12); sfx(T.dollar19, 'pop', 0.1);
  sfx(T.p20 + 0.25, 'whip', 0.26); sfx(T.p20 + 1.55, 'impact', 0.16);
  sfx(T.k1000 - 0.03, 'slam', 0.16); sfx(T.p22 + 0.5, 'pop', 0.12); for (let i = 0; i < 3; i++) sfx(T.lev22 - 0.85 + i * 0.3, 'tick', 0.1, { f: 1800 + i * 300 }); sfx(T.lev22, 'snap', 0.2);
  sfx(T.k1000b, 'pop', 0.14); sfx(T.mul23, 'tick', 0.14, { f: 2400 }); sfx(T.lev23, 'pop', 0.14, { f: 900 });
  sfx(T.p24 + 1.2, 'riser', 0.14, { d: 2.4 }); sfx(T.p24 + 1.3, 'whoosh', 0.16, { d: 2.4 }); sfx(T.p24 + 1.6, 'ripple', 0.1); sfx(T.k100k - 0.03, 'slam', 0.26); sfx(T.k100k, 'impact', 0.2);
  sfx(T.p25 + 0.15, 'whoosh', 0.2, { d: 1.9, up: false }); ksfx(T.kam, 'drop', 0.12); ksfx(T.hameshan, 'drop', 0.14); ksfx(T.satahtaj, 'drop', 0.14);
  sfx(T.p26 + 0.2, 'pop', 0.14, { f: 600, pan: -0.4 }); sfx(T.lot01 - 0.2, 'type', 0.12, { d: 0.35, n: 3 }); sfx(T.pair26 - 0.3, 'type', 0.12, { d: 0.55, n: 6 }); sfx(T.pair26 + 0.7, 'click', 0.12);
  sfx(T.k10k - 0.05, 'pop', 0.16, { f: 820 }); sfx(T.lot01b - 0.35, 'pop', 0.12); sfx(T.lot01b, 'tick', 0.14, { f: 2200 }); sfx(T.mul28, 'tick', 0.12, { f: 2600 }); sfx(T.k100kb, 'pop', 0.14); sfx(T.k100kb + 0.65, 'chime', 0.12);
  for (let i = 0; i < 9; i++) sfx(T.qiyasi - 0.3 + 1.1 * (i + 1) / 9, 'tick', 0.07, { f: 1500 + i * 180, pan: 0.4 - i * 0.1 }); sfx(T.qiyasi, 'pop', 0.1);
  sfx(T.hamesh30 - 1.9, 'whoosh', 0.16, { d: 1.6 }); sfx(T.hamesh30, 'tick', 0.12); sfx(T.safqa30, 'tick', 0.12);
  sfx(T.k10kc, 'pop', 0.14); sfx(T.div31, 'tick', 0.14, { f: 2600 }); sfx(T.lev31, 'pop', 0.14, { f: 900 }); sfx(T.r100 - 0.03, 'slam', 0.2);
  sfx(T.yuhawwal33 - 0.15, 'whoosh', 0.12, { d: 0.5, up: false }); sfx(T.dollar34, 'tick', 0.1); sfx(T.rate1, 'pop', 0.14); sfx(T.usd100 - 0.03, 'slam', 0.18);
  sfx(USD.lift, 'whoosh', 0.16, { d: 1.0, up: false }); sfx(USD.land, 'bloop', 0.16); sfx(USD.land + 0.1, 'snap', 0.14); sfx(USD.land + 0.45, 'tick', 0.1, { pan: 0.4 }); sfx(USD.land + 0.7, 'tick', 0.1, { f: 2800, pan: 0.4 });
  sfx(T.p37 + 0.3, 'spin', 0.12); sfx(T.muhayyir, 'glitch', 0.06); sfx(T.fala - 0.05, 'whoosh', 0.14, { d: 0.5 }); sfx(T.fala + 0.4, 'chime', 0.12);
  sfx(T.tilqai - 1.4, 'whoosh', 0.14, { d: 1.3, pan: 0.4 }); sfx(T.p38 + 0.5, 'pop', 0.14, { pan: 0.4 }); sfx(T.tilqai - 0.1, 'charge', 0.08, { d: 1.6 });
  for (let k = 0; k < 5; k++) sfx(T.tilqai + 0.1 + k * 0.32, 'tick', 0.08, { f: 2000 + k * 200, pan: 0.4 });
  sfx(T.p40 - 0.1, 'whoosh', 0.14, { d: 1.6 }); [RK.c1, RK.c2, RK.c3].forEach((c, i) => { sfx(c - 0.25, 'pop', 0.14, { f: 600 + i * 120, pan: -0.4 }); sfx(c, 'stretch', 0.08); });
  sfx(NIGHT.t0, 'revswell', 0.14, { d: 1.2 }); sfx(NIGHT.t0 + 0.6, 'impact', 0.12); ksfx(T.makhatir, 'drop', 0.16); ksfx(T.khafiya, 'drop', 0.16);
  sfx(T.nida, 'buzz', 0.06); sfx(T.nida + 0.05, 'tick', 0.1); sfx(T.tasfiya, 'buzz', 0.06); sfx(T.tasfiya + 0.05, 'tick', 0.1);
  sfx(T.p43 + 0.1, 'whoosh', 0.1, { d: 0.6, pan: -0.4 }); for (let k = 0; k < 6; k++) sfx(RK.d0 + 1.5 + k * 2.4, 'bloop', 0.05, { pan: 0.2 });
  sfx(T.takhsar, 'glitch', 0.08); sfx(RK.mcHit, 'buzz', 0.14); [0, 0.65, 1.3, 1.95].forEach((d) => sfx(RK.mcHit + 0.2 + d, 'buzz', 0.08, { pan: 0.4 }));
  sfx(RK.pour - 0.5, 'whoosh', 0.12, { d: 0.6 }); sfx(RK.pour + 0.2, 'charge', 0.12, { d: 2.2 }); [0.4, 0.9, 1.4, 1.9].forEach((d, i) => sfx(RK.pour + d, 'bloop', 0.06, { pan: i % 2 ? 0.2 : -0.2 })); sfx(RK.pour + 1.75, 'chime', 0.12);
  [0, 1, 2].forEach((i) => sfx(T.maftuha48 - 0.15 + i * 0.12, 'pop', 0.08, { f: 900 + i * 100, pan: -0.4 }));
  sfx(RK.rew - 0.05, 'revswell', 0.16, { d: 1.3 }); sfx(RK.rew, 'glitch', 0.1); sfx(RK.rew + RK.rewD, 'snap', 0.14); [0, 0.65].forEach((d) => sfx(RK.rew + 0.6 + d, 'buzz', 0.08, { pan: 0.4 }));
  sfx(T.tasfiya49, 'buzz', 0.06); sfx(RK.soHit, 'slam', 0.2); sfx(RK.soHit + 0.05, 'buzz', 0.12); sfx(RK.soHit + 0.55, 'buzz', 0.1);
  [0, 1, 2].forEach((i) => { sfx(RK.cut + i * 0.2, 'whip', 0.14, { pan: -0.4 }); sfx(RK.cut + i * 0.2 + 0.08, 'impact', 0.06); }); sfx(T.tilqai51 - 0.1, 'snap', 0.16); sfx(T.tilqai51 + 0.3, 'whoosh', 0.1, { d: 0.6, up: false });
  sfx(DAY.t0, 'revswell', 0.14, { d: 1.1 }); sfx(RK.refill, 'charge', 0.08, { d: 1.5 }); sfx(RK.newTrade - 0.3, 'pop', 0.12, { pan: -0.4 });
  sfx(T.mustawa54 - 0.3, 'pop', 0.14, { pan: 0.4 }); for (let k = 0; k < 4; k++) sfx(T.mustawa54 - 0.2 + k * 0.12, 'tick', 0.08, { f: 1800 + k * 300, pan: 0.4 }); sfx(T.fath54 - 0.2, 'bloop', 0.1, { pan: -0.4 });
  sfx(T.aman, 'chime', 0.1); sfx(T.khasair - 0.1, 'bloop', 0.08); sfx(T.irtafaa - 0.1, 'charge', 0.08, { d: 1.3 }); sfx(T.abad, 'stretch', 0.1);
  sfx(T.p57 + 0.6, 'whoosh', 0.16, { d: 1.6 }); sfx(T.p57 + 0.45, 'scribble', 0.1, { d: 0.7 }); sfx(T.p58 + 0.3, 'pop', 0.12);
  ksfx(T.f0, 'drop', 0.16); sfx(T.f1, 'tick', 0.14, { f: 2400 }); ksfx(T.f2, 'drop', 0.16); sfx(T.f3, 'tick', 0.14, { f: 2600 }); sfx(T.f4, 'pop', 0.14, { f: 900 }); sfx(T.nisba, 'pop', 0.16, { f: 1100 });
  sfx(T.p61 + 0.2, 'whoosh', 0.14, { d: 1.6, up: false }); sfx(T.k10k61, 'pop', 0.14, { pan: -0.3 }); sfx(T.k5k - 0.1, 'stretch', 0.12); sfx(T.k5k + 0.2, 'snap', 0.14, { pan: 0.3 });
  sfx(T.p63 + 0.2, 'whoosh', 0.1, { d: 1.5 }); sfx(T.sb0, 'pop', 0.14); sfx(T.sb1, 'tick', 0.12, { f: 2600 }); sfx(T.sb2, 'pop', 0.14); sfx(T.sb3, 'tick', 0.12, { f: 2600 }); sfx(T.sb4, 'pop', 0.14, { f: 900 });
  sfx(T.pct200 - 0.03, 'slam', 0.24); sfx(T.pct200 + 0.1, 'chime', 0.12); sfx(T.pct200 + 0.3, 'whoosh', 0.08, { d: 0.5 });
  sfx(REC.in, 'whoosh', 0.2, { d: 3.0 }); sfx(REC.in + 0.2, 'riser', 0.1, { d: 3.0 }); ksfx(T.hamesh66, 'drop', 0.14); ksfx(T.rafi66, 'drop', 0.14); sfx(REC.in + 3.3, 'impact', 0.12);
  sfx(T.p67 - 0.2, 'whoosh', 0.18, { d: 2.4, up: false }); sfx(T.p67 + 2.75, 'shutter', 0.14); [0, 1, 2, 3].forEach((i) => sfx(T.p67 + 3.3 + i * 0.35, 'pop', 0.12, { f: 650 + i * 90, pan: 0.45 - i * 0.3 }));
  [T.p68 + 0.35, T.p68 + 2.2, T.p69 + 0.1, T.p69 + 1.9].forEach((x, i) => sfx(x, 'tick', 0.08, { f: 2000 + i * 200, pan: 0.45 - i * 0.3 }));
  sfx(T.p70 + 0.1, 'whoosh', 0.1, { d: 0.8 }); [0, 1, 2].forEach((i) => sfx(T.asfal + i * 0.52, 'bloop', 0.1)); sfx(T.p71 + 0.8, 'whoosh', 0.16, { d: 1.6, up: false }); sfx(F.CLOSE - 0.9, 'pop', 0.18, { f: 900 });

  // ================================================================ THE SHOT
  const COL = { t0: T.p71 + 0.75, d: 1.65 };                       // the collapse into the dot
  function world(ctx, t) {
    L8.background(ctx);
    const cm = L8.cam(t); const col = cio(t, COL.t0, COL.d);
    ctx.save();
    if (col > 0) { ctx.translate(960, 540); ctx.scale(1 - col, 1 - col); ctx.translate(-960, -540); }
    if (t > RK.rew && t < RK.rew + RK.rewD) ctx.translate(5 * Math.sin(t * 90), 0); // tape jitter
    L8.apply(ctx, cm);
    ctx.save(); ctx.globalAlpha *= 1 - col; L8.dots(ctx, cm); ctx.restore();
    const rc = env(t, REC.in - 0.2, REC.out, 0.8, 1.2);
    ctx.save(); ctx.globalAlpha *= 1 - col;
    board(ctx, t); journeyTitle(ctx, t);
    vault(ctx, t, rc); currency(ctx, t, rc); ticket(ctx, t, rc); platform(ctx, t, rc);
    ch4(ctx, t); lever(ctx, t);
    if (t < COL.t0 + COL.d) { groundShadow(ctx, TK.x, TK.y + 6, 210, cio(t, T.splash - 0.02, 0.9)); L8.tank(ctx, tankNow(t)); }
    intro(ctx, t); ch1(ctx, t); ch2Question(ctx, t); ch5Question(ctx, t); ch5Tank(ctx, t); risk(ctx, t); ch7(ctx, t);
    ctx.restore();
    ctx.restore();
    // screen space
    rewindFx(ctx, t); arrowDown(ctx, t); section(ctx, t);
    const dot = clamp((t - (COL.t0 + COL.d - 0.45)) / 0.3);
    if (dot > 0) { ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(960, 540, 14 * Math.min(1, FX.springU(dot * 0.3, 14, 0.5)), 0, 6.283); ctx.fill(); }
  }
  scene({ name: 'shot', t0: T.s0, t1: F.CLOSE, ink: 'light', enter: { type: 'cut' },
    marksFn(ctx, t) { L8.twoWorlds(ctx, t, () => A.logo(ctx, 1843 - A.logoWidth(80), 50, 80, L8.ink(), { alpha: 1 - clamp(inv(F.CLOSE - 1.6, F.CLOSE - 0.9, t)) })); },
    draw(ctx, t) { L8.twoWorlds(ctx, t, () => world(ctx, t)); L8.rim(ctx, t); } });

  L8.T = T; L8.RK = RK; L8.USD = USD; L8.REC = REC; // exposed for the docs (PROMPT.md timecodes)
  F.addClose();
})(typeof window !== 'undefined' ? window : globalThis);
