// Gold series · Lesson 01 — «شلون تتداول الذهب» — ONE continuous take in the launch-film grammar, re-skinned glass + gold.
// File 1: the shot engine (grounds/floods, camera, layers) + ACT 1 ask → reply, ACT 2 title drop, ACT 3 agenda, ACT 4 what gold is.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT, GL = G.GL, GK = G.GK;
  const { W, H, C, clamp, lerp, eo, hexA, txt, lat, mixHex } = A;
  const { w, we, wl, ph, phe, sfx, ksfx } = F;
  const cio = (t, t0, d) => GL.cio(clamp((t - t0) / d));
  const sp = (t, t0, wv = 14, z = 0.5) => FX.springU(t - t0, wv, z);
  const floodE = (p) => 1 - Math.pow(1 - clamp(p), 3);

  // ---------------------------------------------------------------- shared shot state (all three scene files add to it)
  const SH = G.SHOT = { sec: [], cam: [], grounds: [], orbs: [], util: {} };
  G.HUD_STYLE = 'none';
  F.chapters.push({ t: F.OFF, label: 'شلون تتداول الذهب' });
  // music: 122 BPM, C minor (Cm9 · Abmaj7 · Ebmaj7 · Bb6/9), glass plucks, four-on-the-floor; the drop lands on the series title
  F.STYLE = { bpm: 122, chords: [[36, [60, 63, 67, 70, 74]], [44, [56, 60, 63, 67, 72]], [39, [58, 62, 63, 67, 70]], [46, [58, 60, 62, 65, 67]]], kit: 'four', pluck: 'glass', swing: 0.03, bass: [0, 1, 0, 1, 0, 1, 0, 1], arp: [0, 2, 4, 3, 2, 4, 1, 3], padcut: 2400, duck: 0.55 };
  const BEAT = 60 / 122;
  // energy map (L1 pads · L2 +hats/8th plucks · L3 +kick/clap/bass · L4 +16th arp): builds through the ask, drops on the series title,
  // lifts at every flood/drop, breathes under the dense explanations, last lift on the black summary page
  F.MUSIC = [
    { t: 0, lvl: 1 }, { t: 2.0, lvl: 2 }, { t: 9.2, lvl: 2 }, { t: w(4, 6) - 0.06, lvl: 4 }, { t: 21.0, lvl: 3 }, { t: 35.1, lvl: 3 }, { t: 49.6, lvl: 2 },
    { t: 69.1, lvl: 4 }, { t: 86.3, lvl: 3 }, { t: 108.15, lvl: 2 }, { t: 117.9, lvl: 3 }, { t: we(63, 7) + 0.12, lvl: 4 }, { t: 138.55, lvl: 3 }, { t: 153.6, lvl: 3 },
    { t: 177.85, lvl: 2 }, { t: 196.0, lvl: 3 }, { t: w(113, 0) + 0.45, lvl: 4 }, { t: w(116, 0) - 0.3, lvl: 3 }, { t: F.CLOSE, lvl: 1 },
  ];

  // ---------------------------------------------------------------- camera
  const camK = () => { if (!SH._camSorted) { SH.cam.sort((a, b) => a[0] - b[0]); SH._camSorted = true; } return SH.cam; };
  const camAt = (t) => GL.camAt(camK(), t);
  const tilt = (t) => { const k = 1 - cio(t, 2.05, 1.6); return { rot: -0.075 * k, skew: 0.14 * k }; };
  function camApply(ctx, cam, t) { const [z, x, y] = cam; const tl = tilt(t); ctx.translate(W / 2, H / 2); if (tl.rot) ctx.rotate(tl.rot); if (tl.skew) ctx.transform(1, 0, tl.skew, 1, 0, 0); ctx.scale(z, z); ctx.translate(-x, -y); }
  const toScreen = (cam, x, y) => [(x - cam[1]) * cam[0] + W / 2, (y - cam[2]) * cam[0] + H / 2];
  SH.util = { cio, sp, camAt, toScreen, BEAT };

  // ---------------------------------------------------------------- grounds: full-frame colour that floods out of an object and later shrinks into another
  // { t0, t1, paint(ctx,t), from: {x,y} world (flood circle, din s), to: {x,y,w,h,r} world (contract, dout s) }
  function ground(ctx, t, cam) {
    GL.bg(ctx, 'paper');
    for (const g of SH.grounds) {
      if (t < g.t0 || t >= g.t1) continue;
      const din = g.din || 0.35, dout = g.dout || 0.55;
      const pin = (g.from || g.fromRect) ? clamp((t - g.t0) / din) : 1, pout = g.to ? clamp((t - (g.t1 - dout)) / dout) : 0;
      ctx.save(); ctx.beginPath();
      if (pout > 0) {
        const e = GL.cio(pout); const [x0, y0] = toScreen(cam, g.to.x, g.to.y); const s = cam[0];
        A.roundRect(ctx, lerp(-2, x0, e), lerp(-2, y0, e), lerp(W + 4, g.to.w * s, e), lerp(H + 4, g.to.h * s, e), lerp(0, (g.to.r || 30) * s, e));
      } else if (pin < 1 && g.fromRect) { // a button/card expands into the page, staying pill-shaped as it passes the edges
        const e = GL.cio(pin); const R0 = g.fromRect; const [x0, y0] = toScreen(cam, R0.x, R0.y); const s = cam[0];
        const ex = 220; A.roundRect(ctx, lerp(x0, -ex, e), lerp(y0, -ex, e), lerp(R0.w * s, W + 2 * ex, e), lerp(R0.h * s, H + 2 * ex, e), lerp((R0.r || 28) * s, 420, e));
      } else if (pin < 1) {
        const [sx, sy] = toScreen(cam, g.from.x, g.from.y); const R = Math.hypot(Math.max(sx, W - sx), Math.max(sy, H - sy)) + 4;
        ctx.arc(sx, sy, Math.max(0.5, R * floodE(pin)), 0, 6.283);
      } else ctx.rect(0, 0, W, H);
      ctx.clip(); g.paint(ctx, t); ctx.restore();
    }
  }
  const paintGold = (ctx) => { ctx.fillStyle = GL.goldGrad(ctx, 0, H); ctx.fillRect(0, 0, W, H); };
  const paintSw = (name) => (ctx) => { ctx.fillStyle = GL.swatch(ctx, name); ctx.fillRect(0, 0, W, H); };
  const paintInk = (ctx) => { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#17181B'); g.addColorStop(1, '#0B0D0D'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); };
  SH.paint = { gold: paintGold, sw: paintSw, ink: paintInk };
  // colour orbs behind the glass (screen space, a little parallax)
  const ORBS = [{ x: 420, y: 330, r: 460, c: '#E9C46A', a: 0.5, p: 0 }, { x: 1500, y: 280, r: 480, c: '#B3B7EA', a: 0.45, p: 1.3 }, { x: 980, y: 900, r: 560, c: '#EFA9A4', a: 0.36, p: 2.1 }, { x: 1750, y: 880, r: 400, c: '#8FC3D2', a: 0.42, p: 3.4 }, { x: 160, y: 900, r: 380, c: '#C3C8DA', a: 0.4, p: 4.2 }];
  const orbAlpha = (t) => { let a = 1; for (const g of SH.grounds) if (t >= g.t0 && t < g.t1 && g.dim) a = Math.min(a, 1 - g.dim * clamp((t - g.t0) / 0.4) * (1 - clamp((t - (g.t1 - 0.5)) / 0.5))); return a; };

  // ---------------------------------------------------------------- text helpers
  // words rising from a mask line, centred (or right-aligned with o.x)
  const rise = (ctx, words, y, t, o = {}) => { const oo = Object.assign({ mode: 'rise', stagger: 0.018 }, o); if (o.cx != null) oo.x = o.cx + K.wordsWidth(words, { size: o.size || 56, w: o.w || 'R' }) / 2; return K.cap(ctx, words, y, t, oo); };
  const head = (ctx, words, y, t, o = {}) => K.head(ctx, words, y, t, Object.assign({ mode: 'rise', stagger: 0.03 }, o));
  // shimmer: a light band sweeping across words already drawn (redraw clipped in a lighter ink)
  function shimmer(ctx, words, y, t, o) {
    const cx = o.cx == null ? 960 : o.cx; const cw = K.wordsWidth(words, { size: o.size, w: o.w || 'R' }); const x0 = cx - cw / 2, x1 = cx + cw / 2; const bx = lerp(x1 + 120, x0 - 240, ((t * 0.55) % 1));
    ctx.save(); ctx.beginPath(); ctx.rect(bx, y - o.size * 1.6, 160, o.size * 2.2); ctx.clip(); K.cap(ctx, words, y, t, Object.assign({}, o, { color: o.hi || '#FFFFFF', mode: 'rise', stagger: 0.018, x: x1 })); ctx.restore();
  }
  // typed text schedule: every word types out inside its spoken window
  function typeSched(words) {
    const out = []; words.forEach((wd, k) => { const nxt = k + 1 < words.length ? words[k + 1].t : wd.t + 0.6; const ch = Array.from(wd.s); const dur = Math.min(0.85 * (nxt - wd.t), ch.length * 0.075 + 0.05); ch.forEach((c, i) => out.push({ c, t: wd.t + dur * (i / ch.length) })); out.push({ c: ' ', t: wd.t + dur }); });
    return out;
  }
  const typedStr = (sched, t) => { let s = ''; for (const e of sched) { if (e.t <= t) s += e.c; else break; } return s; };
  SH.text = { rise, head, shimmer, typeSched, typedStr };

  // ---------------------------------------------------------------- phone (glass screen, 11 px ink bezel)
  const PH = { x: 660, y: 0, w: 600, h: 1120, r: 72 };
  function phone(ctx, t, o = {}) {
    const a = o.alpha == null ? 1 : o.alpha; if (a <= 0) return; const { x, y, w: pw, h: phh, r } = PH;
    ctx.save(); ctx.globalAlpha *= a;
    ctx.save(); ctx.shadowColor = 'rgba(20,24,30,0.22)'; ctx.shadowBlur = 90; ctx.shadowOffsetY = 34; A.roundRect(ctx, x - 6, y - 6, pw + 12, phh + 12, r + 6); ctx.fillStyle = 'rgba(255,255,255,0.01)'; ctx.fill(); ctx.restore();
    GL.panel(ctx, x, y, pw, phh, r, { tint: 'rgba(250,250,248,0.72)', shadow: false });
    A.roundRect(ctx, x - 5.5, y - 5.5, pw + 11, phh + 11, r + 5.5); ctx.strokeStyle = C.ink; ctx.lineWidth = 11; ctx.stroke();
    lat(ctx, '9:41', x + 64, y + 62, { size: 26, w: 600, color: C.ink });
    ctx.fillStyle = C.ink; for (let i = 0; i < 4; i++) ctx.fillRect(x + pw - 142 + i * 9, y + 54 - i * 5, 6, 8 + i * 5);
    A.roundRect(ctx, x + pw - 96, y + 40, 44, 22, 6); ctx.lineWidth = 2; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.fillRect(x + pw - 92, y + 44, 32, 14); ctx.fillRect(x + pw - 50, y + 46, 3, 10);
    ctx.beginPath(); A.roundRect(ctx, x + pw / 2 - 70, y + 22, 140, 38, 19); ctx.fillStyle = C.ink; ctx.fill();
    ctx.restore();
  }
  SH.phone = { PH, draw: phone };

  // ================================================================ ACT 1 · ASK (02.05 → 09.25)
  const Q = { l1: wl(0, 0, 3, { keepQ: true }), l2: wl(0, 4, 9, { keepQ: true }) };
  const QS1 = typeSched(Q.l1), QS2 = typeSched(Q.l2);
  const CP = { x: 690, y: 140, w: 540, h: 156, r: 32 };   // composer, top of the phone screen
  const QSZ = 26, QR = CP.x + CP.w - 36, QY1 = CP.y + 52, QY2 = CP.y + 90;
  const SEND = { x: CP.x + 36, y: CP.y + CP.h - 30, r: 19 };
  const T1 = { send: w(1, 0), yes: w(2, 0), but: w(3, 0), risk: w(3, 2) };
  const T2go = 9.2;
  const BUB = { r: PH.x + PH.w - 34, y: 110, w: 430, h: 92 };  // the question's chat bubble (me)
  // camera: one eased push-out that follows the caret, a beat of stillness, then ONE pull-back that reveals the phone
  SH.cam.push([2.05, 4.3, QR - 4, QY1 - 6], [5.55, 2.35, 990, CP.y + 74], [6.15, 2.3, 985, CP.y + 78], [7.05, 1.5, 960, 330]);
  // sfx: keystrokes per word, send pop + ripple, bubble pops
  [...Q.l1, ...Q.l2].forEach((wd, k, arr) => { const nxt = k + 1 < arr.length ? arr[k + 1].t : wd.t + 0.6; const n = Array.from(wd.s).length; sfx(wd.t, 'type', 0.085, { d: Math.min(0.85 * (nxt - wd.t), n * 0.075 + 0.05), n }); });
  sfx(T1.send - 0.02, 'click', 0.2); sfx(T1.send + 0.02, 'pop', 0.22, { f: 980 }); sfx(T1.send + 0.04, 'ripple', 0.16); sfx(T1.send + 0.1, 'whoosh', 0.14, { d: 0.8, up: false });
  sfx(T1.yes, 'pop', 0.2, { f: 720 }); sfx(T1.but, 'pop', 0.16, { f: 600 }); sfx(T1.risk + 0.05, 'tick', 0.12, { f: 2400 });

  function act1(ctx, t) {
    if (t > 9.9) return;
    const morph = cio(t, T1.send + 0.08, 0.75);
    // the phone is there all along — the pull-back reveals it
    if (t > 5.0) phone(ctx, t, { alpha: 1 - cio(t, 9.25, 0.6) * 0 });
    // composer (glass + iridescent glow) → morphs into the dark chat bubble
    const bx = BUB.r - BUB.w; const rx = lerp(CP.x, bx, morph), ry = lerp(CP.y, BUB.y, morph), rw = lerp(CP.w, BUB.w, morph), rh = lerp(CP.h, BUB.h, morph), rr = lerp(CP.r, 30, morph);
    const reveal = cio(t, 2.05, 0.45); // the bar opens out of the caret
    if (morph < 1) {
      ctx.save(); const cx0 = QR, cw0 = lerp(0, 1, reveal); ctx.beginPath(); ctx.rect(lerp(cx0, rx - 80, cw0), ry - 120, lerp(0, rw + 160, cw0) + (cx0 - lerp(cx0, rx - 80, cw0)) * 0, rh + 240); ctx.clip();
      GL.glow(ctx, rx, ry, rw, rh, rr, t, { alpha: 1 - morph, width: 26, blur: 22, speed: 1.1 });
      GL.panel(ctx, rx, ry, rw, rh, rr, { tint: 'rgba(255,255,255,0.7)', alpha: 1 - morph * 0.0 });
      ctx.restore();
    }
    const inkP = clamp((t - T1.send - 0.02) / 0.32);
    if (inkP > 0) { ctx.save(); A.roundRect(ctx, rx, ry, rw, rh, [rr, rr, 8, rr]); ctx.clip(); const sx = lerp(SEND.x, rx + 30, morph), sy = lerp(SEND.y, ry + rh - 20, morph); ctx.beginPath(); ctx.arc(sx, sy, Math.max(0.5, 620 * floodE(inkP)), 0, 6.283); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore(); }
    // the typed request (two fixed lines) → flies into the bubble
    const s1 = typedStr(QS1, t), s2 = typedStr(QS2, t); const sz = lerp(QSZ, 21, morph);
    const tr = lerp(QR, BUB.r - 26, morph), ty1 = lerp(QY1, BUB.y + 38, morph), ty2 = lerp(QY2, BUB.y + 70, morph); const col = mixHex(C.ink, '#FFFFFF', clamp(inkP * 1.4));
    if (s1) txt(ctx, s1.trim(), tr, ty1, { size: sz, w: 'S', color: col });
    if (s2) txt(ctx, s2.trim(), tr, ty2, { size: sz, w: 'S', color: col });
    // caret + gradient trail while typing
    if (morph <= 0 && t < T1.send) {
      const onL2 = s2.length > 0; const s = onL2 ? s2 : s1; const wdt = s ? A.measure(ctx, s.replace(/\s+$/, ''), QSZ, 'S') : 0; const cx = QR - wdt - 3, cy = onL2 ? QY2 : QY1;
      const typing = QS2.length && t < QS2[QS2.length - 1].t + 0.1; if (typing && wdt > 0) GL.trail(ctx, cx + 3, cy, QSZ, Math.min(wdt, 70), { color: '#B3B7EA' });
      GL.caret(ctx, cx, cy, QSZ, t, { solid: typing });
    }
    // buttons row: «+» (right) and the red send (left); press on «الجواب»
    if (morph < 1) {
      ctx.save(); ctx.globalAlpha *= 1 - clamp(morph * 2.5);
      lat(ctx, '+', QR - 4, CP.y + CP.h - 20, { size: 30, w: 300, color: C.ink, align: 'center' });
      const press = 1 - 0.18 * Math.exp(-Math.pow((t - T1.send) / 0.08, 2)); ctx.translate(SEND.x, SEND.y); ctx.scale(press, press);
      ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, SEND.r, 0, 6.283); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(9, 0); ctx.lineTo(-9, 0); ctx.moveTo(-1, -8); ctx.lineTo(-9, 0); ctx.lineTo(-1, 8); ctx.stroke(); ctx.restore();
    }
    // gold ripple from the send button
    const rp = clamp((t - T1.send) / 0.9); if (rp > 0 && rp < 1) { ctx.save(); ctx.strokeStyle = hexA(GL.P.gold1, (1 - rp) * 0.9); ctx.lineWidth = lerp(10, 1, rp); ctx.beginPath(); ctx.arc(SEND.x, SEND.y, lerp(20, 520, floodE(rp)), 0, 6.283); ctx.stroke(); ctx.restore(); }
    // replies
    const yesP = sp(t, T1.yes - 0.05, 14, 0.55); if (yesP > 0 && t < T2go + 0.02) GK.bubble(ctx, ['نعم'], PH.x + 34, 240, { side: 'gold', size: 24, w: 'S', p: yesP });
    const butP = sp(t, T1.but - 0.05, 14, 0.55);
    if (butP > 0) {
      const b = GK.bubble(ctx, ['بس ويّا مخاطر'], PH.x + 34, 318, { side: 'them', size: 24, w: 'S', p: butP, colors: ['rgba(0,0,0,0)'] });
      if (b && b.x != null) { ctx.save(); ctx.globalAlpha *= clamp(butP * 3); K.words(ctx, wl(3, 0, 2, { map: { 2: { color: C.red } } }), b.x + b.w - 18, b.y + 41, t, { size: 24, w: 'S', color: C.ink, mode: 'rise', stagger: 0.015 }); ctx.restore(); }
    }
  }

  // ================================================================ ACT 2 · THINK → DROP: «أهلاً وسهلاً بيكم أعزائي المتداولين بسلسلة شلون تتداول الذهب من أكاديمية آكسي»
  const T2 = { go: 9.2, hi: w(4, 0), ser: w(4, 5), drop: w(4, 6) - 0.06, how: w(4, 6), trade: w(4, 7), gold: w(4, 8), from: w(5, 0), axi: w(5, 2) };
  const STAGE = { x: -560, y: 560 };   // the coin's stage, to the left (RTL forward) of the phone
  SH.cam.push([9.2, 1.5, 960, 330], [10.6, 1.0, STAGE.x, STAGE.y + 20], [12.25, 1.05, STAGE.x, STAGE.y + 10]);
  // gold ground floods out of the coin on the drop
  SH.grounds.push({ t0: T2.drop, t1: 21.05, from: { x: STAGE.x, y: STAGE.y + 50 }, din: 0.35, paint: paintGold, dim: 0.85, to: { x: 960 - 150, y: 300, w: 300, h: 340, r: 44 }, dout: 0.55 });
  const TOSS = [0, 1, 2, 3].map((i) => T2.go + 1.2 + i * BEAT * 2);
  sfx(T2.go, 'whoosh', 0.18, { d: 0.9 }); sfx(T2.go + 0.2, 'charge', 0.08, { d: 1.0 });
  TOSS.forEach((tt, i) => { sfx(tt, 'whoosh', 0.09, { d: 0.25, pan: [-0.3, 0.3, -0.15, 0.2][i] }); sfx(tt + 0.42, 'pop', 0.12, { f: 700 + i * 120 }); });
  sfx(T2.drop - 1.6, 'riser', 0.16, { d: 1.6 }); sfx(T2.drop, 'impact', 0.3); sfx(T2.drop + 0.02, 'whoosh', 0.2, { d: 0.5 }); ksfx(T2.how, 'rise', 0.2); ksfx(T2.trade, 'rise', 0.18); ksfx(T2.gold, 'rise', 0.22); sfx(T2.gold + 0.1, 'chime', 0.12);
  ksfx(T2.from, 'rise', 0.14);

  function coin(ctx, x, y, r, t, o = {}) {
    ctx.save(); ctx.translate(x, y); const spin = Math.cos((o.spin || 0)); ctx.scale(Math.max(0.08, Math.abs(spin)), 1);
    const g = ctx.createLinearGradient(0, -r, 0, r); g.addColorStop(0, GL.P.gold0); g.addColorStop(0.45, GL.P.gold1); g.addColorStop(1, GL.P.gold3);
    ctx.save(); ctx.shadowColor = 'rgba(80,60,10,0.35)'; ctx.shadowBlur = r * 0.5; ctx.shadowOffsetY = r * 0.18; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fillStyle = g; ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.arc(0, 0, r * 0.82, 0, 6.283); ctx.strokeStyle = hexA('#FFF6D8', 0.7); ctx.lineWidth = r * 0.035; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.strokeStyle = GL.P.gold3; ctx.lineWidth = r * 0.06; ctx.stroke();
    if (spin > 0) lat(ctx, 'Au', 0, r * 0.2, { size: Math.round(r * 0.62), w: 700, color: GL.P.goldInk, align: 'center' });
    const sx = lerp(-r, r, (t * 0.4) % 1); const sh = ctx.createLinearGradient(sx - r * 0.4, 0, sx + r * 0.4, 0); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(0.5, 'rgba(255,255,255,0.35)'); sh.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fillStyle = sh; ctx.fill();
    ctx.restore();
  }
  SH.coin = coin;
  // tossed things: a mini bar, a coin, a ring, an up-tick
  function tossItem(ctx, k, x, y, s, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    if (k === 0) GK.ingot(ctx, -38, -14, 76, 30, { shadow: false, depth: 10 });
    else if (k === 1) coin(ctx, 0, 0, 22, 0);
    else if (k === 2) { ctx.lineWidth = 7; ctx.strokeStyle = GL.goldGrad(ctx, -22, 22); ctx.beginPath(); ctx.arc(0, 0, 20, 0, 6.283); ctx.stroke(); ctx.fillStyle = '#E8F6FF'; ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(8, -22); ctx.lineTo(0, -15); ctx.lineTo(-8, -22); ctx.closePath(); ctx.fill(); }
    else { ctx.strokeStyle = C.mint; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-24, 14); ctx.lineTo(-6, -2); ctx.lineTo(6, 8); ctx.lineTo(24, -14); ctx.stroke(); }
    ctx.restore();
  }
  function act2(ctx, t) {
    if (t < T2.go - 0.05 || t > 21.2) return;
    // the gold «نعم» bubble lifts out of the phone and becomes the gold coin on the stage
    const fly = cio(t, T2.go, 1.4); const bx = PH.x + 70, by = 262;
    const cx = lerp(bx, STAGE.x, fly), cy = lerp(by, STAGE.y + 50, fly) - Math.sin(fly * Math.PI) * 120; const r = lerp(26, 128, fly);
    const live = t < T2.drop + 0.14; const burst = clamp((t - T2.drop) / 0.14);
    if (live) {
      // tosses on the beat
      TOSS.forEach((tt, i) => { const q = (t - tt) / 0.84; if (q <= 0 || q >= 1) return; const hgt = 120 + i * 18; const x = cx + (i % 2 ? 1 : -1) * (40 + i * 26) * q; const y = cy - 40 - hgt * 4 * q * (1 - q); tossItem(ctx, i, x, y, 1.1, q * (i % 2 ? 6 : -6)); });
      const sq = 1 + 0.06 * TOSS.reduce((m, tt) => m + Math.exp(-Math.pow((t - tt - 0.02) / 0.06, 2)), 0);
      ctx.save(); ctx.globalAlpha *= 1 - burst; coin(ctx, cx, cy, r * sq * (1 + burst * 0.6), t, { spin: 0 }); ctx.restore();
    }
    // shimmering welcome line + the kicker «بسلسلة»
    const wy = STAGE.y - 250;
    if (t < T2.drop + 0.2) {
      const ws = wl(4, 0, 4); rise(ctx, ws, wy, t, { size: 50, color: C.slate, w: 'R', cx: STAGE.x }); shimmer(ctx, ws, wy, t, { size: 50, w: 'R', hi: '#C9A54B', cx: STAGE.x });
    }
    // title on the gold flood: «سلسلة» kicker, «شلون تتداول الذهب», «من أكاديمية آكسي»
    const up = cio(t, 15.45, 0.8); const tY = lerp(STAGE.y + 40, STAGE.y - 120, up), tS = lerp(1, 0.62, up);
    ctx.save(); ctx.translate(STAGE.x, tY); ctx.scale(tS, tS); ctx.translate(-STAGE.x, -tY);
    K.cap(ctx, wl(4, 5, 5), tY - 168, t, { size: 40, color: t < T2.drop ? C.ink : '#3A2C08', w: 'S', mode: 'rise', x: STAGE.x + K.wordsWidth(wl(4, 5, 5), { size: 40, w: 'S' }) / 2 });
    head(ctx, wl(4, 6, 8, { map: { 8: { w: 'B' } } }), tY + 40, t, { size: 150, color: C.ink, w: 'M', x: STAGE.x + K.wordsWidth(wl(4, 6, 8), { size: 150, w: 'M' }) / 2 });
    K.cap(ctx, wl(5), tY + 130, t, { size: 40, color: '#3A2C08', w: 'S', x: STAGE.x + K.wordsWidth(wl(5), { size: 40, w: 'S' }) / 2 });
    ctx.restore();
  }

  // ================================================================ ACT 3 · AGENDA on gold: «بهذا الدرس راح نتعلّم شنو هو الذهب · وشلون نتداول سعره بدون ما نملكه»
  const T3 = { a: w(6, 0), q1: w(6, 4), q2: w(7, 0), out: 20.5 };
  SH.cam.push([15.3, 1.05, STAGE.x, STAGE.y + 10], [16.4, 1.0, STAGE.x, STAGE.y + 40]);
  sfx(T3.q1 - 0.05, 'pop', 0.16, { f: 820 }); sfx(T3.q2 - 0.05, 'pop', 0.16, { f: 920 });
  function act3(ctx, t) {
    if (t < T3.a - 0.3 || t > 21.2) return;
    const out = cio(t, T3.out, 0.5);
    ctx.save(); ctx.globalAlpha *= 1 - out;
    rise(ctx, wl(6, 0, 3), STAGE.y + 20, t, { size: 40, color: '#3A2C08', w: 'R', x: STAGE.x + K.wordsWidth(wl(6, 0, 3), { size: 40 }) / 2 });
    const chip = (n, words, y, t0) => {
      const p = sp(t, t0, 13, 0.55); if (p <= 0) return; const cw = K.wordsWidth(words, { size: 46, w: 'S' }) + 160, x = STAGE.x - cw / 2;
      ctx.save(); ctx.translate(STAGE.x, y); ctx.scale(Math.min(1.05, p), Math.min(1.05, p)); ctx.translate(-STAGE.x, -y);
      GL.panel(ctx, x, y - 54, cw, 108, 54, { tint: 'rgba(255,255,255,0.42)', edge: 'rgba(255,255,255,0.9)' });
      lat(ctx, n, x + cw - 40, y + 13, { size: 30, w: 700, color: C.red, align: 'right' });
      K.words(ctx, words, x + cw - 96, y + 16, t, { size: 46, w: 'S', color: C.ink, mode: 'rise', stagger: 0.015 });
      ctx.restore();
    };
    chip('01', wl(6, 4, 6, { keepQ: true }), STAGE.y + 130, T3.q1 - 0.12);
    chip('02', wl(7), STAGE.y + 262, T3.q2 - 0.12);
    ctx.restore();
  }

  // ================================================================ ACT 4 · WHAT GOLD IS (21.05 → 34.74)
  // the gold ground shrinks into the «Au» element tile; cards burst in for jewellery, electronics and bars; the strip lands on the price
  const T4 = { tile: 20.5, metal: w(8, 0), years: w(9, 0), jew: w(10, 1), elec: w(10, 2), bars: w(11, 2), we: w(12, 0), price: w(13, 0), not: w(14, 0), how: w(15, 0) };
  const TILE = { x: 960 - 150, y: 300, w: 300, h: 340, r: 44 };
  SH.cam.push([20.5, 1.0, STAGE.x, STAGE.y + 40], [21.3, 1.0, 960, 540], [25.2, 1.0, 960, 560], [26.4, 0.98, 960, 570], [29.45, 0.98, 960, 570], [30.75, 1.0, 430, 560]);
  sfx(T4.tile, 'whoosh', 0.16, { d: 0.55, up: false }); sfx(T4.tile + 0.55, 'pop', 0.16, { f: 640 });
  sfx(T4.years - 0.05, 'whoosh', 0.1, { d: 1.2 }); [T4.jew, T4.elec, T4.bars].forEach((tt, i) => { sfx(tt - 0.1, 'whoosh', 0.13, { d: 0.3, pan: 0.2 - i * 0.2 }); sfx(tt + 0.05, 'pop', 0.15, { f: 640 + i * 110 }); });
  sfx(T4.we - 0.1, 'whoosh', 0.14, { d: 1.0 }); sfx(T4.price, 'pop', 0.18, { f: 900 }); sfx(T4.price + 0.1, 'chime', 0.12); sfx(T4.not + 0.1, 'tick', 0.12, { f: 2200 });
  const CARDS = [
    { k: 'jew', title: 'مجوهرات', sub: 'زينة وقيمة', x: 960 + 380, t: T4.jew },
    { k: 'elec', title: 'إلكترونيات', sub: 'موصّل ممتاز', x: 960, t: T4.elec },
    { k: 'bars', title: 'سبائك', sub: 'استثمار وادّخار', x: 960 - 380, t: T4.bars },
  ];
  const CW = 330, CH = 440, CY = 600;
  function cardArt(ctx, k, x, y, w0, h0, t) {
    ctx.save(); A.roundRect(ctx, x, y, w0, h0, [28, 28, 0, 0]); ctx.clip();
    if (k === 'bars') GL.cover(ctx, 'bars3d', x, y, w0, h0, { fy: 0.3 });
    else if (k === 'jew') { const g = ctx.createLinearGradient(0, y, 0, y + h0); g.addColorStop(0, '#2A2C31'); g.addColorStop(1, '#141518'); ctx.fillStyle = g; ctx.fillRect(x, y, w0, h0); GK.chain(ctx, x + w0 - 30, y + 40, x + 30, y + 40, { link: 15, th: 3, sag: 150 }); }
    else if (k === 'elec') {
      const g = ctx.createLinearGradient(0, y, 0, y + h0); g.addColorStop(0, '#1F3A33'); g.addColorStop(1, '#0F1F1B'); ctx.fillStyle = g; ctx.fillRect(x, y, w0, h0);
      const cx = x + w0 / 2, cy = y + h0 / 2; ctx.fillStyle = '#222'; A.roundRect(ctx, cx - 60, cy - 60, 120, 120, 12); ctx.fill(); ctx.strokeStyle = GL.goldGrad(ctx, cy - 80, cy + 80); ctx.lineWidth = 5;
      for (let i = 0; i < 5; i++) { const d = -48 + i * 24; [[cx - 60, cy + d, cx - 110, cy + d], [cx + 60, cy + d, cx + 110, cy + d], [cx + d, cy - 60, cx + d, cy - 110], [cx + d, cy + 60, cx + d, cy + 110]].forEach(([a, b, c, e]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, e); ctx.stroke(); }); }
      ctx.fillStyle = GL.goldGrad(ctx, cy - 30, cy + 30); A.roundRect(ctx, cx - 34, cy - 34, 68, 68, 8); ctx.fill();
    }
    ctx.restore();
  }
  function dcard(ctx, c, x, y, s, t, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-CW / 2, -CH / 2);
    GL.darkCard(ctx, 0, 0, CW, CH, 28); cardArt(ctx, c.k, 0, 0, CW, 280, t);
    txt(ctx, c.title, CW - 26, 334, { size: 34, w: 'B', color: '#FFFFFF' }); txt(ctx, c.sub, CW - 26, 378, { size: 22, color: '#A9AEB4' });
    if (o.tag) { const tg = o.tag; ctx.save(); ctx.globalAlpha *= tg.p; A.roundRect(ctx, 20, 20, 150, 44, 22); ctx.fillStyle = 'rgba(14,15,18,0.72)'; ctx.fill(); txt(ctx, tg.s, 150, 50, { size: 22, w: 'S', color: tg.c || '#FFFFFF' }); ctx.restore(); }
    ctx.restore();
  }
  function act4(ctx, t) {
    if (t < T4.tile || t > T4.how + 1.8) return;
    // element tile (shared element with the shrinking gold ground)
    const tileIn = t >= T4.tile + 0.55; const tOut = cio(t, T4.jew - 0.6, 0.7);
    if (tileIn && tOut < 1) {
      const tx = lerp(TILE.x, TILE.x - 420, cio(t, T4.years - 0.1, 0.9)); const ty = TILE.y; const s = 1 - tOut * 0.0;
      ctx.save(); ctx.globalAlpha *= 1 - tOut; A.roundRect(ctx, tx, ty, TILE.w, TILE.h, TILE.r); ctx.fillStyle = GL.goldGrad(ctx, ty, ty + TILE.h); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2; ctx.stroke();
      lat(ctx, '79', tx + TILE.w - 30, ty + 56, { size: 30, w: 600, color: '#3A2C08', align: 'right' }); lat(ctx, 'Au', tx + TILE.w / 2, ty + 210, { size: 130, w: 700, color: '#2B2107', align: 'center' });
      txt(ctx, 'ذهب', tx + TILE.w / 2, ty + 290, { size: 34, w: 'S', color: '#3A2C08', align: 'center' }); ctx.restore();
      rise(ctx, wl(8, 0, 2, { map: { 2: { color: GL.P.gold3, w: 'B' } } }), 760, t, { size: 52, color: C.ink, w: 'S', x: tx + TILE.w / 2 + K.wordsWidth(wl(8), { size: 52, w: 'S' }) / 2, out: K.outAt(t, T4.jew - 0.6) });
      // thousands of years: a glass track, the knob travels right (ancient) → left (today)
      const yp = eo(t, T4.years - 0.1, 0.4) * (1 - tOut);
      if (yp > 0) {
        const x0 = 760, x1 = 1660, ty2 = 470; ctx.save(); ctx.globalAlpha *= yp; GL.panel(ctx, x0 - 30, ty2 - 60, x1 - x0 + 60, 150, 40, { tint: 'rgba(255,255,255,0.55)' });
        ctx.strokeStyle = hexA(C.slate, 0.45); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, ty2); ctx.lineTo(x1, ty2); ctx.stroke();
        for (let i = 0; i <= 10; i++) { const x = lerp(x1, x0, i / 10); ctx.beginPath(); ctx.moveTo(x, ty2 - (i % 5 ? 8 : 16)); ctx.lineTo(x, ty2 + (i % 5 ? 8 : 16)); ctx.stroke(); }
        const kx = lerp(x1, x0, cio(t, T4.years, 2.0)); ctx.fillStyle = GL.goldGrad(ctx, ty2 - 18, ty2 + 18); ctx.beginPath(); ctx.arc(kx, ty2, 18, 0, 6.283); ctx.fill();
        txt(ctx, 'قبل آلاف السنين', x1, ty2 + 62, { size: 24, w: 'S', color: C.slate }); txt(ctx, 'اليوم', x0 + 60, ty2 + 62, { size: 24, w: 'S', color: C.ink });
        ctx.restore();
        rise(ctx, wl(9), 300, t, { size: 46, color: C.ink, w: 'S', x: 1210 + K.wordsWidth(wl(9), { size: 46, w: 'S' }) / 2, out: K.outAt(t, T4.jew - 0.6) });
      }
    }
    // three cards burst in from the centre (01 = right)
    const strip = cio(t, T4.we - 0.1, 1.1);
    if (t > T4.jew - 0.3) {
      rise(ctx, wl(10).concat(wl(11)), 300, t, { size: 46, color: C.ink, w: 'S', x: 960 + 60 + K.wordsWidth(wl(10).concat(wl(11)), { size: 46, w: 'S' }) / 2, out: K.outAt(t, T4.we - 0.5) });
      CARDS.forEach((c, i) => {
        const p = sp(t, c.t - 0.12, 12, 0.55); if (p <= 0) return; const x = lerp(960, c.x, Math.min(1, p)); const s = Math.min(1.05, Math.max(0.2, p)) * lerp(1, 0.86, strip);
        const tag = c.k === 'bars' ? { p: eo(t, T4.not, 0.3), s: 'مو تخزين', c: '#FF8A8A' } : null;
        ctx.save(); ctx.globalAlpha *= lerp(1, 0.55, eo(t, T4.price, 0.4)); dcard(ctx, c, x, CY, s, t, { tag }); ctx.restore();
      });
      // the price card: lands at the end of the strip and lifts with «يهمّنا»
      const pp = sp(t, T4.price - 0.25, 12, 0.55);
      if (pp > 0) {
        const x = 960 - 760, lift = eo(t, T4.price + 0.2, 0.4) * 24; const s = Math.min(1.05, pp);
        ctx.save(); ctx.translate(x, CY - lift); ctx.scale(s, s); ctx.translate(-CW / 2, -CH / 2);
        GL.glow(ctx, 0, 0, CW, CH, 28, t, { alpha: eo(t, T4.price + 0.1, 0.4), width: 24, blur: 22 });
        GL.panel(ctx, 0, 0, CW, CH, 28, { tint: 'rgba(255,255,255,0.72)' });
        lat(ctx, 'XAU/USD', CW - 26, 70, { size: 30, w: 700, color: C.ink, align: 'right' }); txt(ctx, 'سعر الذهب', CW - 26, 112, { size: 24, w: 'S', color: C.slate });
        // live sparkline
        ctx.save(); ctx.beginPath(); for (let k = 0; k <= 60; k++) { const u = k / 60; const xx = lerp(26, CW - 26, u); const yy = 250 - u * 60 - Math.sin(u * 13 + t * 2.4) * 14 - Math.sin(u * 5 + t) * 10; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.strokeStyle = GL.P.gold2; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
        const v = 4000 + Math.round(Math.sin(t * 1.3) * 8 + Math.sin(t * 3.1) * 3); lat(ctx, '$' + v.toLocaleString('en-US') + '.' + String(Math.abs(Math.round(Math.sin(t * 7) * 50 + 50))).padStart(2, '0'), CW - 26, 360, { size: 44, w: 300, color: C.ink, align: 'right' });
        ctx.restore();
        GK.pill(ctx, 'يهمّنا', x, CY - lift - CH / 2 - 14, { style: 'gold', size: 24, p: sp(t, T4.price + 0.15, 14, 0.55) });
        rise(ctx, wl(12).concat(wl(13)).concat(wl(14)), 300, t, { size: 44, color: C.ink, w: 'S', x: 430 + K.wordsWidth(wl(12).concat(wl(13)).concat(wl(14)), { size: 44, w: 'S' }) / 2, out: K.outAt(t, T4.how - 0.2) });
      }
      if (t > T4.how - 0.3) head(ctx, wl(15, 0, 1, { keepQ: true }), 905, t, { size: 60, color: C.ink, w: 'S', x: 430 + K.wordsWidth(wl(15, 0, 1, { keepQ: true }), { size: 60, w: 'S' }) / 2 });
    }
  }

  // ---------------------------------------------------------------- the one shot
  SH.sec.push({ t0: 2.05, t1: 10.0, front: act1 }, { t0: 9.0, t1: 21.3, front: function act23(ctx, t) { act2(ctx, t); act3(ctx, t); }, shrinkWith: SH.grounds[0] }, { t0: 20.4, t1: 37, front: act4 });
  // brand marks re-ink white over the dark grounds (they follow the flood in and the contraction out)
  const darkness = (t) => { let d = 0; for (const g of SH.grounds) { if (!g.dark || t < g.t0 || t >= g.t1) continue; const pin = clamp((t - g.t0) / (g.din || 0.35)); const pout = g.to ? clamp((t - (g.t1 - (g.dout || 0.55))) / (g.dout || 0.55)) : 0; d = Math.max(d, pin * (1 - pout)); } return d; };
  F.scene({ name: 'shot', t0: 2.05, t1: F.CLOSE, ink: 'light', enter: { type: 'cut' },
    marksFn(ctx, t) { const c = mixHex(C.ink, '#FFFFFF', darkness(t)); A.logo(ctx, 1843 - A.logoWidth(80), 50, 80, c); A.xmark(ctx, 115, 984, 69, c, 0.6); },
    draw(ctx, t) {
      const cam = camAt(t);
      ground(ctx, t, cam);
      GL.orbs(ctx, t, ORBS, { alpha: orbAlpha(t) });
      ctx.save(); camApply(ctx, cam, t); for (const s of SH.sec) if (t >= s.t0 && t < s.t1 && s.back) s.back(ctx, t); ctx.restore();
      GL.captureBlur(ctx, 9);
      ctx.save(); camApply(ctx, cam, t); for (const s of SH.sec) if (t >= s.t0 && t < s.t1 && s.front) { const run = s.shrinkWith ? () => SH.shrunk(ctx, t, s.shrinkWith, cam, () => s.front(ctx, t)) : () => s.front(ctx, t); if (s.coverBy) SH.covered(ctx, t, s.coverBy, cam, run); else run(); } ctx.restore();
      for (const s of SH.sec) if (t >= s.t0 && t < s.t1 && s.screen) s.screen(ctx, t);
    } });
  // a section with .shrinkWith = ground is carried inside that ground while it contracts into its target object
  SH.shrunk = function (ctx, t, g, cam, fn) {
    const dout = g.dout || 0.55; const pout = clamp((t - (g.t1 - dout)) / dout); if (pout <= 0) { fn(); return; } if (pout >= 1) return;
    const e = GL.cio(pout); const [x0, y0] = toScreen(cam, g.to.x, g.to.y); const s = cam[0];
    ctx.save(); const m = ctx.getTransform(); ctx.setTransform(1, 0, 0, 1, 0, 0); A.roundRect(ctx, lerp(-2, x0, e), lerp(-2, y0, e), lerp(W + 4, g.to.w * s, e), lerp(H + 4, g.to.h * s, e), lerp(0, (g.to.r || 30) * s, e)); ctx.clip(); ctx.setTransform(m); fn(); ctx.restore();
  };
  // a section with .coverBy = ground is eaten by that ground's flood circle while it grows
  SH.covered = function (ctx, t, g, cam, fn) {
    const din = g.din || 0.35; const pin = clamp((t - g.t0) / din);
    if (t < g.t0) { fn(); return; } if (pin >= 1) return;
    ctx.save(); const m = ctx.getTransform(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(0, 0, W, H);
    if (g.fromRect) { const e = GL.cio(pin); const R0 = g.fromRect; const [x0, y0] = toScreen(cam, R0.x, R0.y); const s = cam[0]; const ex = 220; A.roundRect(ctx, lerp(x0, -ex, e), lerp(y0, -ex, e), lerp(R0.w * s, W + 2 * ex, e), lerp(R0.h * s, H + 2 * ex, e), lerp((R0.r || 28) * s, 420, e)); }
    else { const [sx, sy] = toScreen(cam, g.from.x, g.from.y); const R = (Math.hypot(Math.max(sx, W - sx), Math.max(sy, H - sy)) + 4) * floodE(pin); ctx.moveTo(sx + R, sy); ctx.arc(sx, sy, Math.max(0.5, R), 0, 6.283); }
    ctx.clip('evenodd'); ctx.setTransform(m); fn(); ctx.restore();
  };
})(typeof window !== 'undefined' ? window : globalThis);
