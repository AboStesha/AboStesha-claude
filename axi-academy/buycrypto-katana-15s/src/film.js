// «امتلكها» — a 15 s hyper-edit ad for Axi Iraq's Buy Crypto feature, made with the Higgsfield Katana workflow.
// It remixes the visual grammar of the reference "Loud chrome type showreel": every beat turns one object into the
// next shot (a bouncing coin → a punch-in → a word, weight-morphing type in a selection box, a zoom through a dot,
// a decode glitch, a CRT power-off, a dot matrix that becomes a 3D field, a marquee wall, a word that crumbles into
// particles and a galaxy dive, a recap collage, and a logo build with a falling object as the payoff).
// 1080×1920, 60 fps, 900 frames, 140 BPM grid (music: Mixkit "Need for Speed", the drop lands on beat 3).
// Every frame is a pure function of t. Facts come from Axi's Buy Crypto page and launch coverage
// (../crypto-campaign/SCRIPTS.md); the price line and chart are illustrative. Brand: ../BRAND.md.
(function (G) {
  'use strict';
  const K = G.K, CC = G.CC;
  const { W, H, clamp, lerp, inv, smooth, eo, ei, eio, co, cio, sp, expoOut, expoIn, cubicOut, rng, hash, noise, shake, arWords, mixLine, logoReveal, watermark, rr, disc, sparks, shimmer, grain } = K;
  const TAU = Math.PI * 2;
  const BPM = 140, BEAT = 60 / BPM, b = (n) => n * BEAT;
  const INK = '#090A0D', RED = '#E4002E', MINT = '#5EE0BB', SLATE = '#5E7680', CARBON = '#242528';
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const BUF = mk(W, H), BX = BUF.getContext('2d');

  // ---------------- copy (Arabic MSA; tickers and numbers in Latin) ----------------
  const KICK = 'كل يوم تراقب السعر…', OWN = 'امتلكها', REAL = 'فعلاً';
  const R1 = 'ملكية حقيقية لعملتك', R2 = 'بدون رافعة مالية', NEW = 'جديد في آكسي', COINS = 'عملة رقمية';
  const WAL = 'محفظة آكسي', SAFE1 = 'محفوظة في محفظة آكسي', SAFE2 = 'منفصلة عن حساب التداول';
  const CTA = 'امتلك أول عملة لك', TAG = 'تداول بميزتك';

  // ---------------- timeline (beats of 140 BPM; b(3) is the drop) ----------------
  const T_B1 = b(1), T_B2 = b(2), T_DROP = b(3), T_REAL = b(5), T_RATIO = b(6), T_FLIP = b(7), T_DEC = b(8), T_GRID = b(10),
    T_RIP = b(11), T_PLUS = b(13), T_MAR = b(15), T_PART = b(19), T_COL = b(23), T_WAL = b(27), T_END = b(29);
  const DUR = 15;

  // ---------------- helpers ----------------
  const fA = (w, s) => `${Math.round(w)} ${Math.round(s)}px AR, IN`;
  const fL = (w, s) => `${Math.round(w)} ${Math.round(s)}px IN`;
  function T(ctx, s, x, y, o) {
    ctx.save(); ctx.font = o.font; ctx.direction = o.dir || 'rtl'; ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.base || 'alphabetic';
    ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha; ctx.fillStyle = o.color || '#FFFFFF'; ctx.fillText(s, x, y); ctx.restore();
  }
  function TW(ctx, s, font, dir = 'rtl') { ctx.save(); ctx.font = font; ctx.direction = dir; const m = ctx.measureText(s).width; ctx.restore(); return m; }
  const fitSize = (ctx, s, ff, w, maxW, maxS, dir) => Math.min(maxS, (maxS * maxW) / Math.max(1, TW(ctx, s, ff(w, maxS), dir)));
  function bgInk(ctx) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#171819'); g.addColorStop(1, '#0B0D0D'); ctx.fillStyle = g; ctx.fillRect(-60, -60, W + 120, H + 120); }
  function bgFrost(ctx) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#F9F9F9'); g.addColorStop(1, '#E2E6E8'); ctx.fillStyle = g; ctx.fillRect(-60, -60, W + 120, H + 120); }
  const solid = (ctx, c) => { ctx.fillStyle = c; ctx.fillRect(-60, -60, W + 120, H + 120); };
  function flash(ctx, a, color = '#FFFFFF') { if (a <= 0.002) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(a); ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const zoomAt = (ctx, x, y, k) => { ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y); };
  const kick = (t, tb, amt = 0.04, d = 0.1) => { const x = t - tb; return x >= 0 && x < d * 6 ? 1 + amt * Math.exp(-x / d) : 1; };

  // ---------------- S1 · hook: a coin bounces on a live price line, then launches at the camera ----------------
  const FLOOR = 1250, CR = 140, LAUNCH = T_B2 + 0.2;
  const CHART = (() => { const r = rng(23), a = []; let v = 0; for (let i = 0; i < 400; i++) { v = (v + (r() - 0.5) * 16) * 0.95; a.push(v); } return a; })();
  const wob = (t) => 0.45 * Math.sin(t * 6.5);
  function hookCoin(t) {
    const yl = FLOOR - CR;
    if (t < T_B1) { const u = inv(-0.2, T_B1, t); return { x: 540, y: lerp(250, yl, u * u), r: CR, sq: 1 + 0.1 * u, a: wob(t) }; }
    if (t < T_B2) {
      const d = t - T_B1, u = d / (T_B2 - T_B1), sq = 1 - 0.3 * Math.exp(-d / 0.035);
      return { x: 540, y: yl - 380 * 4 * u * (1 - u) + (1 - sq) * CR * 0.5, r: CR * (1 + (1 - sq) * 0.3), sq, a: wob(t) };
    }
    if (t < LAUNCH) { const d = t - T_B2, sq = lerp(0.72, 0.6, inv(0, 0.2, d)); return { x: 540, y: yl + CR * (1 - sq) * 0.5, r: CR * (1 + (1 - sq) * 0.3), sq, a: wob(t) }; }
    const u = inv(LAUNCH, T_DROP, t), e = expoIn(u);
    return { x: 540, y: lerp(yl - 30, 940, cubicOut(u)), r: lerp(CR, 1750, e), sq: lerp(1.12, 1, u), a: wob(LAUNCH) * (1 - u) + TAU * cubicOut(u) };
  }
  function hookLine(ctx, t) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 2;
    for (let k = 0; k < 6; k++) { const y = 900 + k * 120; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    const off = t * 140, pts = [];
    for (let x = -24; x <= W + 24; x += 12) {
      const idx = (x + off) / 12, i0 = Math.floor(idx), f = idx - i0, m = 1 - Math.exp(-Math.pow((x - 540) / 110, 2));
      let y = FLOOR + 4 + lerp(CHART[((i0 % 400) + 400) % 400], CHART[(((i0 + 1) % 400) + 400) % 400], f) * 0.9 * m;
      for (const tc of [T_B1, T_B2]) { const d = t - tc; if (d > 0) y += 52 * Math.exp(-d / 0.2) * Math.sin(d * TAU * 3.1) * Math.exp(-Math.pow((x - 540) / 150, 2)); }
      pts.push([x, y]);
    }
    const line = () => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); };
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    line(); ctx.lineTo(W + 24, FLOOR + 340); ctx.lineTo(-24, FLOOR + 340); ctx.closePath();
    const ga = ctx.createLinearGradient(0, FLOOR - 40, 0, FLOOR + 340); ga.addColorStop(0, 'rgba(255,255,255,0.11)'); ga.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = ga; ctx.fill();
    line(); ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.stroke();
    // each bounce reads as an up-tick: the line right of the coin lights up in mint (a gain)
    const up = Math.max(eo(t, T_B1, 0.25) * (1 - eo(t, T_B1 + 0.3, 0.2)), eo(t, T_B2, 0.25));
    if (up > 0) { ctx.save(); ctx.beginPath(); ctx.rect(540, 0, W, H); ctx.clip(); line(); ctx.lineWidth = 6; ctx.strokeStyle = MINT; ctx.globalAlpha = up; ctx.stroke(); ctx.restore(); }
    ctx.restore();
    // price tag at the right end
    const ta = eo(t, -0.2, 0.4);
    ctx.save(); ctx.globalAlpha *= ta; const tx = 840, ty = FLOOR - 120;
    rr(ctx, tx, ty, 190, 64, 32); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.stroke();
    T(ctx, 'BTC', tx + 68, ty + 43, { font: fL(700, 30), dir: 'ltr' });
    ctx.beginPath(); ctx.moveTo(tx + 132, ty + 42); ctx.lineTo(tx + 150, ty + 20); ctx.lineTo(tx + 168, ty + 42); ctx.closePath(); ctx.fillStyle = up > 0.2 ? MINT : 'rgba(255,255,255,0.45)'; ctx.fill();
    ctx.restore();
  }
  function sHook(ctx, t) {
    bgInk(ctx);
    ctx.save(); zoomAt(ctx, 540, FLOOR, (1 + 0.06 * smooth(inv(-0.2, LAUNCH, t))) * kick(t, T_B1, 0.05, 0.07) * kick(t, T_B2, 0.07, 0.07));
    const kA = 1 - smooth(inv(T_B2 + 0.05, T_B2 + 0.28, t));
    if (kA > 0) arWords(ctx, KICK, 540, 1480, t, { t0: -0.3, st: 0.08, d: 0.45, w: 300, size: 74, color: '#FFFFFF', alpha: kA * 0.94 });
    const la = 1 - smooth(inv(LAUNCH, LAUNCH + 0.12, t));
    if (la > 0) { ctx.save(); ctx.globalAlpha *= la; hookLine(ctx, t); ctx.restore(); }
    const c = hookCoin(t);
    CC.coin(ctx, c.x, c.y, c.r, { a: c.a, sq: c.sq, ticker: 'BTC', shadow: t < LAUNCH ? 0.45 : 0, sy: 0.12 });
    ctx.restore();
  }

  // ---------------- S2 · red slam: «امتلكها» rises out of the flash ----------------
  function sRed(ctx, t) {
    solid(ctx, RED);
    const k = (1 + 0.06 * smooth(inv(T_DROP, T_REAL, t))) * kick(t, b(4), 0.07, 0.08);
    const u = clamp(sp(t, T_DROP + 0.03, 3.0, 0.62), 0, 1.25), size = fitSize(ctx, OWN, fA, 700, 880, 300);
    ctx.save(); zoomAt(ctx, 540, 990, k); ctx.translate(540, 990); ctx.rotate(-0.06 * (1 - clamp(u))); ctx.translate(-540, -990);
    const d4 = t - b(4);
    for (let e = 0; e < 3; e++) {
      const ue = clamp((d4 - e * 0.05) / 0.36); if (ue <= 0 || ue >= 1) continue;
      ctx.save(); zoomAt(ctx, 540, 990, 1 + expoOut(ue) * (0.3 + e * 0.18)); ctx.globalAlpha *= (1 - ue) * 0.6;
      ctx.font = fA(700, size); ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 3; ctx.strokeStyle = '#FFFFFF'; ctx.strokeText(OWN, 540, 990); ctx.restore();
    }
    T(ctx, OWN, 540, lerp(H + 320, 990, u), { font: fA(700, size), base: 'middle' });
    ctx.restore();
  }

  // ---------------- S3 · «فعلاً» grows from thin to heavy inside a design-tool selection box ----------------
  function selBox(ctx, x, y, w, h, a) {
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(149,168,177,0.95)'; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
    const hs = 16;
    [[x, y], [x + w / 2, y], [x + w, y], [x, y + h / 2], [x + w, y + h / 2], [x, y + h], [x + w / 2, y + h], [x + w, y + h]].forEach(([px, py]) => {
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(px - hs / 2, py - hs / 2, hs, hs); ctx.strokeRect(px - hs / 2, py - hs / 2, hs, hs);
    });
    ctx.restore();
  }
  function sReal(ctx, t) {
    bgInk(ctx);
    const u = eo(t, T_REAL + 0.02, 0.3), wg = lerp(160, 700, u);
    ctx.save(); zoomAt(ctx, 540, 960, 1 + 0.26 * (t - T_REAL));
    const font = fA(wg, 330), tw = TW(ctx, REAL, font);
    T(ctx, REAL, 540, 960, { font, base: 'middle' });
    const bw = tw + 100, bh = 400, bx = 540 - bw / 2, by = 960 - bh / 2;
    selBox(ctx, bx, by, bw, bh, clamp((t - T_REAL) / 0.04));
    const tag = 'wght ' + Math.round(wg), tg = TW(ctx, tag, fL(600, 26), 'ltr');
    rr(ctx, bx, by - 52, tg + 30, 38, 6); ctx.fillStyle = RED; ctx.fill();
    T(ctx, tag, bx + 15, by - 24, { font: fL(600, 26), align: 'left', dir: 'ltr' });
    ctx.restore();
  }

  // ---------------- S4 · "1:1" — a beat flips the weight, then the camera dives through the colon's dot ----------------
  const RS = 430;
  function ratioLayout(ctx, wg) {
    const f = fL(wg, RS), w1 = TW(ctx, '1', f, 'ltr'), dr = lerp(21, 38, (wg - 300) / 500), gap = RS * 0.09;
    const total = w1 * 2 + gap * 2 + dr * 2, x0 = 540 - total / 2, base = 1120;
    return { f, dr, x1: x0 + w1 / 2, xc: x0 + w1 + gap + dr, x2: x0 + w1 * 1.5 + gap * 2 + dr * 2, base, yTop: base - RS * 0.5, yBot: base - dr };
  }
  function sRatio(ctx, t) {
    bgFrost(ctx);
    const wg = t < T_FLIP ? 800 : 300, L = ratioLayout(ctx, wg);
    const z = expoIn(inv(T_FLIP + 0.08, T_DEC - 0.035, t)), k = Math.pow(95, z) * kick(t, T_FLIP, 0.05) * (1 + 0.07 * smooth(inv(T_RATIO, T_FLIP + 0.08, t)));
    const si = 1 - eo(t, T_RATIO, 0.22), dp = clamp(sp(t, T_RATIO + 0.1, 3.2, 0.5), 0, 1.3);
    ctx.save(); zoomAt(ctx, L.xc, L.yTop, k);
    T(ctx, '1', L.x1 - 760 * si, L.base, { font: L.f, color: INK, dir: 'ltr' });
    T(ctx, '1', L.x2 + 760 * si, L.base, { font: L.f, color: INK, dir: 'ltr' });
    disc(ctx, L.xc, L.yTop, L.dr * dp, INK); disc(ctx, L.xc, L.yBot, L.dr * dp, INK);
    const first = t < T_FLIP, la = eo(t, first ? T_RATIO + 0.04 : T_FLIP + 0.01, 0.28);
    T(ctx, first ? R1 : R2, 540, 1330 + (1 - la) * 34, { font: fA(600, 66), color: INK, alpha: la });
    ctx.restore();
  }

  // ---------------- S5 · "Buy Crypto" decodes out of scrambled glyphs, then the screen powers off ----------------
  const DEC = 'Buy Crypto', GLY = '#%&@$*+=<>/[]{}?!ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  const glitchOn = (t) => (t >= b(9) && t < b(9) + 0.05) || (t >= b(9) + 0.1 && t < b(9) + 0.13);
  function decodeText(ctx, t) {
    const size = 168, y = 1000, f = fL(800, size), T0 = T_DEC;
    ctx.save(); ctx.font = f; ctx.direction = 'ltr';
    const chars = [...DEC], ws = chars.map((c) => ctx.measureText(c).width), full = ctx.measureText(DEC).width;
    ctx.restore();
    const x0 = 540 - full / 2, fr = Math.round(t * 60), lockT = (i) => T0 + 0.07 + i * 0.03, done = t > lockT(chars.length) + 0.04;
    const split = 16 * Math.exp(-Math.max(0, t - T0) / 0.22) + (glitchOn(t) ? 22 : 0);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.font = f; ctx.direction = 'ltr'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    for (const [col, dx] of [['#FF2020', -split], ['#20FF60', 0], ['#2060FF', split]]) {
      ctx.fillStyle = col;
      if (done) { ctx.fillText(DEC, x0 + dx, y); continue; }
      let xx = x0;
      chars.forEach((c, i) => {
        if (t >= T0 + i * 0.012 && c !== ' ') ctx.fillText(t < lockT(i) ? GLY[Math.floor(hash(fr * 7.31 + i * 13.7) * GLY.length)] : c, xx + dx, y);
        xx += ws[i];
      });
    }
    ctx.restore();
    if (done && Math.floor((t - T0) * 5) % 2 === 0) { ctx.fillStyle = RED; ctx.fillRect(x0 + full + 22, y - size * 0.72, 16, size * 0.78); }
    arWords(ctx, NEW, 540, 1160, t, { t0: T0 + 0.36, st: 0.07, d: 0.4, w: 600, size: 64, color: '#FFFFFF' });
  }
  function glitchSlices(ctx, seed, amt) {
    BX.setTransform(1, 0, 0, 1, 0, 0); BX.globalAlpha = 1; BX.globalCompositeOperation = 'copy'; BX.drawImage(ctx.canvas, 0, 0); BX.globalCompositeOperation = 'source-over';
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const r = rng(seed); let y = 0;
    while (y < H) { const h = 20 + Math.floor(r() * 140), dx = (r() - 0.5) * 2 * amt * (r() < 0.45 ? 1 : 0.15); ctx.drawImage(BUF, 0, y, W, h, dx, y, W, h); y += h; }
    ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.35; ctx.drawImage(BUF, amt * 0.22, 0); ctx.restore();
  }
  function sDecode(ctx, t) {
    const crt0 = T_GRID - 0.22;
    if (t < crt0) { bgInk(ctx); decodeText(ctx, t); return; }
    BX.setTransform(1, 0, 0, 1, 0, 0); BX.globalAlpha = 1; BX.globalCompositeOperation = 'source-over'; bgInk(BX); decodeText(BX, t);
    solid(ctx, '#000000');
    const u = inv(crt0, crt0 + 0.1, t), v = inv(crt0 + 0.1, T_GRID - 0.03, t);
    const sy = Math.max(0.004, Math.pow(1 - u, 3)), sx = Math.max(0.002, Math.pow(1 - v, 2.2));
    ctx.save(); ctx.translate(540, 960); ctx.scale(sx, sy); ctx.translate(-540, -960); ctx.drawImage(BUF, 0, 0);
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.8 * Math.sqrt(u); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H); ctx.restore();
    if (v > 0.6) disc(ctx, 540, 960, lerp(7, 0, inv(T_GRID - 0.05, T_GRID, t)), '#FFFFFF');
  }

  // ---------------- S6/S7 · a dot matrix (coin tops seen from above) ripples red, tilts into a 3D field of coin stacks ----------------
  const GI = 15, GJ = 28;
  const COLS = (() => { const r = rng(41), a = []; for (let j = -GJ; j <= GJ; j++) for (let i = -GI; i <= GI; i++) a.push({ i, j, h0: 0.3 + 0.7 * r(), ph: r() * TAU, red: r() < 0.08 }); return a; })();
  const colAt = (i, j) => COLS[(j + GJ) * (2 * GI + 1) + (i + GI)];
  function fieldCam(t) {
    const push = eo(t, T_GRID, 0.42), tilt = cio(t, T_RIP + 0.02, 0.5), whip = expoIn(inv(T_MAR - 0.22, T_MAR, t));
    let D = lerp(150, 30, push); D = lerp(D, 13, tilt); D = lerp(D, 10.5, smooth(inv(T_RIP + 0.5, T_MAR - 0.22, t))); D = lerp(D, 1.6, whip);
    const e = lerp(lerp(Math.PI / 2, 0.64, tilt), 0.42, whip);
    const yaw = lerp(-0.7, 0, eo(t, T_GRID, 0.6)) + lerp(0, -0.38, tilt) + 0.5 * smooth(inv(T_RIP + 0.5, T_MAR, t));
    return { D, e, yaw, F: 1320, cy: lerp(960, 1180, tilt), reveal: lerp(3, 60, eo(t, T_GRID + 0.02, 0.5)) };
  }
  function proj(X, Y, Z, c) {
    const cyw = Math.cos(c.yaw), syw = Math.sin(c.yaw), x1 = X * cyw - Z * syw, z1 = X * syw + Z * cyw;
    const ce = Math.cos(c.e), se = Math.sin(c.e), vy = Y * ce + z1 * se, vz = -Y * se + z1 * ce + c.D;
    if (vz < 0.25) return null;
    return { x: 540 + (c.F * x1) / vz, y: c.cy - (c.F * vy) / vz, s: c.F / vz, z: vz };
  }
  function colH(c, t) {
    const grow = cio(t, T_RIP + 0.08, 0.55); if (grow <= 0) return 0;
    let p = 0.55 + 0.45 * Math.sin(t * 5.4 + c.ph + c.i * 0.35);
    for (const n of [12, 13, 14]) { const d = t - b(n); if (d >= 0 && d < 0.6) p += 1.1 * Math.exp(-d / 0.12) * hash(c.i * 3.1 + c.j * 7.7 + n); }
    return grow * c.h0 * 1.9 * p;
  }
  const HOPS = [{ t: b(12), i: 0, j: -3 }, { t: b(13), i: 2, j: 0 }, { t: b(14), i: -1, j: 2 }];
  function hero(t) {
    const top = (hp) => colH(colAt(hp.i, hp.j), t) + 0.55;
    if (t < HOPS[0].t) { const u = inv(HOPS[0].t - 0.4, HOPS[0].t, t); return { X: HOPS[0].i, Z: HOPS[0].j, Y: top(HOPS[0]) + lerp(9, 0, u * u), on: t > HOPS[0].t - 0.4 }; }
    for (let n = 0; n < HOPS.length - 1; n++) {
      const A = HOPS[n], B = HOPS[n + 1];
      if (t < B.t) { const u = inv(A.t, B.t, t); return { X: lerp(A.i, B.i, u), Z: lerp(A.j, B.j, u), Y: lerp(top(A), top(B), u) + 2.6 * 4 * u * (1 - u), on: true }; }
    }
    const L = HOPS[HOPS.length - 1], d = t - L.t;
    return { X: L.i, Z: L.j, Y: top(L) + Math.abs(Math.sin(d * 7)) * 1.2 * Math.exp(-d / 0.35), on: true };
  }
  const fogc = (c, f) => { const r = (c >> 16) & 255, g = (c >> 8) & 255, b2 = c & 255; return `rgb(${Math.round(lerp(r, 17, f))},${Math.round(lerp(g, 19, f))},${Math.round(lerp(b2, 20, f))})`; };
  function sField(ctx, t) {
    bgInk(ctx);
    const cam = fieldCam(t), items = [], ripR = (t - T_RIP) * 26;
    for (const c of COLS) {
      const dist = Math.hypot(c.i, c.j); if (dist > cam.reveal) continue;
      const pb = proj(c.i, 0, c.j, cam); if (!pb || pb.x < -160 || pb.x > W + 160 || pb.y < -500 || pb.y > H + 200) continue;
      const h = colH(c, t), pt = h > 0.002 ? proj(c.i, h, c.j, cam) : pb; if (!pt) continue;
      const rip = t >= T_RIP ? clamp(1 - Math.abs(dist - ripR) / 1.6) : 0;
      items.push({ c, pb, pt, h, rip, edge: clamp((cam.reveal - dist) / 2.5) });
    }
    items.sort((a, b2) => b2.pb.z - a.pb.z);
    const se = Math.max(0.18, Math.sin(cam.e)), zf = cam.D * 1.15;
    for (const it of items) {
      const rad = 0.34 * it.pb.s, ry = rad * se, top = it.c.red && it.h > 0.05 ? RED : null;
      const fog = clamp((it.pb.z - zf) / (zf * 1.6)) * 0.82;   // far stacks sink into the dark
      ctx.globalAlpha = it.edge;
      if (it.h > 0.002 && Math.abs(it.pt.y - it.pb.y) > 1) {
        ctx.fillStyle = fogc(0x7F888E, fog); ctx.beginPath(); ctx.ellipse(it.pb.x, it.pb.y, rad, ry, 0, 0, TAU); ctx.fill();
        ctx.fillRect(it.pb.x - rad, it.pt.y, rad * 2, it.pb.y - it.pt.y);
        ctx.fillStyle = fogc(0xB4BCC1, fog); ctx.fillRect(it.pb.x - rad, it.pt.y, rad * 0.75, it.pb.y - it.pt.y);
        ctx.fillStyle = fogc(0x5A6268, fog); ctx.fillRect(it.pb.x + rad * 0.55, it.pt.y, rad * 0.45, it.pb.y - it.pt.y);
        if (rad > 9) { ctx.strokeStyle = 'rgba(40,46,52,0.35)'; ctx.lineWidth = 1.2; const n = Math.min(10, Math.floor((it.pb.y - it.pt.y) / Math.max(5, ry * 0.5))); for (let k = 1; k < n; k++) { const yy = lerp(it.pt.y, it.pb.y, k / n); ctx.beginPath(); ctx.moveTo(it.pb.x - rad, yy); ctx.lineTo(it.pb.x + rad, yy); ctx.stroke(); } }
      }
      ctx.fillStyle = fogc(it.h > 0.002 ? 0xE8ECEE : 0xC4C8CC, fog); ctx.beginPath(); ctx.ellipse(it.pt.x, it.pt.y, rad, ry, 0, 0, TAU); ctx.fill();
      if (it.rip > 0.02) { ctx.fillStyle = `rgba(228,0,46,${(0.35 + 0.65 * it.rip) * (1 - fog)})`; ctx.fill(); }
      if (rad > 7) { ctx.lineWidth = Math.max(1, rad * 0.1); ctx.strokeStyle = top && fog < 0.5 ? RED : fogc(0x788086, fog); ctx.beginPath(); ctx.ellipse(it.pt.x, it.pt.y, rad * 0.74, ry * 0.74, 0, 0, TAU); ctx.stroke(); }
    }
    ctx.globalAlpha = 1;
    const hp = hero(t);
    if (hp.on) { const p = proj(hp.X, hp.Y, hp.Z, cam); if (p) CC.coin(ctx, p.x, p.y, 0.85 * p.s, { a: 0.5 * Math.sin(t * 5), ticker: 'BTC', red: true }); }
    // the counter: 0 → 200, the "+" lands on beat 13
    const a = eo(t, T_RIP + 0.25, 0.3) * (1 - smooth(inv(T_MAR - 0.16, T_MAR - 0.02, t)));
    if (a > 0) {
      const tq = Math.round(t * 60) / 60, n = Math.min(200, Math.round(200 * expoOut(inv(T_RIP + 0.3, T_PLUS - 0.03, tq)))), s = n + (tq >= T_PLUS ? '+' : ''), kp = kick(t, T_PLUS, 0.16, 0.08);
      ctx.save(); ctx.globalAlpha *= a;
      rr(ctx, 170, 230, 740, 340, 36); ctx.fillStyle = 'rgba(9,10,13,0.7)'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.stroke();
      ctx.save(); zoomAt(ctx, 540, 370, kp); T(ctx, s, 540, 450, { font: fL(800, 220), dir: 'ltr' }); ctx.restore();
      T(ctx, COINS, 540, 530, { font: fA(600, 64) });
      ctx.restore();
    }
  }

  // ---------------- S8 · marquee wall of tickers; the red anchor row carries «محفظة آكسي» ----------------
  const ROWH = 160, NR = 13, ANCHOR = 6;
  const TK = ['BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'LINK', 'LTC', 'DOT', 'AVAX', 'DOGE', 'TRX', 'XLM', 'UNI', 'AAVE', 'ATOM', 'NEAR', 'BCH', 'ALGO'];
  const MROWS = (() => { const r = rng(57), a = []; for (let k = 0; k < NR; k++) { const w = []; for (let n = 0; n < 7; n++) w.push(TK[Math.floor(r() * TK.length)]); a.push({ s: w.join('  ·  ') + '  ·  ', dir: k % 2 ? 1 : -1, sp: 380 + r() * 380, off: r() * 900, st: k % 3 }); } return a; })();
  const STY = [{ bg: '#16181B', fg: '#FFFFFF' }, { bg: '#FFFFFF', fg: INK }, { bg: SLATE, fg: '#FFFFFF' }];
  function marqueeRow(ctx, s, y, font, dir, scroll, fg, rtl) {
    const uw = TW(ctx, s, font, rtl ? 'rtl' : 'ltr'); if (uw < 10) return;
    let x = ((scroll % uw) + uw) % uw - uw;
    ctx.save(); ctx.font = font; ctx.direction = rtl ? 'rtl' : 'ltr'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = fg;
    if (rtl) ctx.textAlign = 'right';
    for (; x < W + uw; x += uw) ctx.fillText(s, rtl ? x + uw : x, y);
    ctx.restore();
  }
  function sMarquee(ctx, t) {
    bgInk(ctx);
    const lt = t - T_MAR, flips = [b(16), b(17), b(18)].filter((x) => t >= x).length, T_EX = T_PART - 0.3;
    for (let k = 0; k < NR; k++) {
      const R = MROWS[k], y = k * ROWH - 80, inU = eo(t, T_MAR + k * 0.01, 0.18);
      const out = expoIn(inv(T_EX + Math.abs(k - ANCHOR) * 0.012, T_EX + Math.abs(k - ANCHOR) * 0.012 + 0.2, t));
      if (k === ANCHOR) continue;
      const dx = (1 - inU) * 640 * (k % 2 ? -1 : 1) + out * 1500 * (k % 2 ? 1 : -1);
      if (Math.abs(dx) > W + 20) continue;
      const st = STY[(R.st + flips) % 3];
      ctx.save(); ctx.translate(dx, 0);
      ctx.fillStyle = st.bg; ctx.fillRect(-20, y + 4, W + 40, ROWH - 8);
      if (flips % 2 === 1) { ctx.translate(0, y + ROWH / 2); ctx.transform(1, 0, -0.2, 1, 0, 0); ctx.translate(0, -(y + ROWH / 2)); }
      marqueeRow(ctx, R.s, y + ROWH / 2 + 4, fL(flips === 2 ? 500 : 800, 104), R.dir, R.off + R.dir * R.sp * lt, st.fg, false);
      ctx.restore();
    }
    // the anchor row: red bar with the Arabic phrase; on the way out only the centred phrase stays, on black
    const y = ANCHOR * ROWH - 80, inU = eo(t, T_MAR + 0.02, 0.18), ex = smooth(inv(T_EX, T_EX + 0.18, t));
    const barH = (ROWH - 8) * (1 - ex), dx = (1 - inU) * 640;
    ctx.save(); ctx.translate(dx, 0);
    if (barH > 0.5) { ctx.fillStyle = RED; ctx.fillRect(-20, y + ROWH / 2 - barH / 2, W + 40, barH); }
    if (ex < 1) { ctx.save(); ctx.globalAlpha *= 1 - ex; marqueeRow(ctx, WAL + '  ·  ', y + ROWH / 2 + 2, fA(700, 92), -1, 300 + 260 * lt, '#FFFFFF', true); ctx.restore(); }
    if (ex > 0) { const sz = lerp(92, 150, smooth(inv(T_EX + 0.05, T_PART, t))); T(ctx, WAL, 540, 960, { font: fA(700, sz), base: 'middle', alpha: ex }); }
    ctx.restore();
  }

  // ---------------- S9 · the phrase crumbles into particles → a spinning coin of dust → a galaxy → a dive ----------------
  let PS = null;
  function initParticles() {
    const c = mk(W, 300), g = c.getContext('2d');
    g.font = fA(700, 150); g.direction = 'rtl'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#FFFFFF'; g.fillText(WAL, 540, 150);
    const d = g.getImageData(0, 0, W, 300).data, r = rng(91); PS = [];
    for (let y = 0; y < 300; y += 4) for (let x = 0; x < W; x += 4) if (d[(y * W + x) * 4 + 3] > 140) PS.push({ x, y: y - 150 + 960, vx: -40 - r() * 260, vy: -60 - r() * 240, th: r() * TAU, rad: Math.sqrt(r()), arm: r() < 0.5 ? 0 : 1, red: r() < 0.1, sz: 2 + r() * 2.4, ph: r() * 10 });
  }
  function sParticles(ctx, t) {
    if (!PS) initParticles();
    bgInk(ctx);
    const T0 = T_PART, rel = (x) => T0 + 0.2 + ((W - x) / W) * 0.3, tg = T0 + 0.6, tsp = T0 + 0.98, tdv = T0 + 1.3;
    const sweepX = W - clamp((t - T0 - 0.2) / 0.3) * W;
    if (sweepX > 0) { ctx.save(); ctx.beginPath(); ctx.rect(-60, 0, sweepX + 60, H); ctx.clip(); T(ctx, WAL, 540, 960, { font: fA(700, 150), base: 'middle' }); ctx.restore(); }
    const gu = cio(t, tg, 0.36), su = cio(t, tsp, 0.3), dv = expoIn(inv(tdv, T_COL, t)), kz = 1 + 16 * dv;
    const passes = [[RED, true], ['#E9EDEF', false]];
    ctx.save(); ctx.lineCap = 'square';   // a streak of zero length is still the particle's square, so the dive starts seamlessly
    for (const [col, wantRed] of passes) {
      ctx.fillStyle = col; ctx.strokeStyle = col;
      for (const p of PS) {
        if ((p.red && su > 0.3) !== wantRed) continue;
        const tr = rel(p.x); if (t < tr) continue;
        const l = t - tr;
        let x = p.x + p.vx * l * 0.9 + noise(l * 2 + p.ph, 3) * 40, y = p.y + p.vy * l * 0.6 - 30 * l * l;
        if (gu > 0) { const ang = p.th + (t - tg) * 3.4, R = 300 * (0.22 + 0.78 * p.rad); x = lerp(x, 540 + Math.cos(ang) * R, gu); y = lerp(y, 960 + Math.sin(ang) * R * 0.93, gu); }
        if (su > 0) {
          const r2 = 40 + 440 * Math.pow(p.rad, 0.8), spin = (t - tsp) * (3.4 - 1.8 * p.rad);
          const a2 = hash(p.ph * 5.3) < 0.3 ? p.th + spin : p.arm * Math.PI + Math.log(r2 / 40) * 1.7 + spin + (hash(p.ph * 3.7) - 0.5) * 0.7;
          x = lerp(x, 540 + Math.cos(a2) * r2, su); y = lerp(y, 960 + Math.sin(a2) * r2 * 0.62, su);
        }
        const s = p.sz * (1 + 0.5 * gu + 0.35 * su);
        if (dv > 0) {
          const px = 540 + (x - 540) * kz, py = 960 + (y - 960) * kz, qx = 540 + (x - 540) * (1 + 16 * Math.max(0, dv - 0.08)), qy = 960 + (y - 960) * (1 + 16 * Math.max(0, dv - 0.08));
          const k2 = smooth(clamp(dv * 4)); ctx.globalAlpha = lerp(1, 0.5, k2) * (1 - 0.4 * dv); ctx.lineWidth = lerp(s, Math.min(3.2, s * 0.6), k2); ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(px, py); ctx.stroke(); ctx.globalAlpha = 1; continue;
        }
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
    }
    ctx.restore();
    flash(ctx, ei(t, T_COL - 0.13, 0.13) * 0.95);
  }

  // ---------------- S10 · recap collage: six facts in panels that reshuffle on the beat ----------------
  const PM = 36, PG = 16, PTOP = 150, PBOT = 1610, PW = (W - PM * 2 - PG) / 2, PH = (PBOT - PTOP - PG * 2) / 3;
  const slot = (k) => ({ x: PM + (k % 2) * (PW + PG), y: PTOP + Math.floor(k / 2) * (PH + PG), w: PW, h: PH });
  const RING = [0, 1, 3, 5, 4, 2];   // slots in clockwise order
  const permAt = (n) => [0, 1, 2, 3, 4, 5].map((p) => RING[(RING.indexOf(p) + n) % 6]);
  function panelBody(ctx, p, w, h, t) {
    const cx = w / 2, cy = h / 2;
    if (p === 0) {   // the app: tap «شراء BTC»
      solid(ctx, '#E2E6E8');
      const pw = 226, ph = 384, px = cx - pw / 2, py = cy - ph / 2 + 4;
      rr(ctx, px - 10, py - 10, pw + 20, ph + 20, 40); ctx.fillStyle = '#16181B'; ctx.fill();
      rr(ctx, px, py, pw, ph, 32); ctx.fillStyle = '#F9F9F9'; ctx.fill();
      CC.coin(ctx, cx, py + 108, 50, { a: 0.5 + 0.35 * Math.sin(t * 2.4), ticker: 'BTC' });
      T(ctx, 'BTC', cx, py + 204, { font: fL(800, 34), color: INK, dir: 'ltr' });
      const tp = [b(24), b(25), b(26)].some((x) => t >= x && t < x + 0.12) ? 0.94 : 1;
      ctx.save(); ctx.translate(cx, py + ph - 62); ctx.scale(tp, tp); rr(ctx, -95, -32, 190, 64, 32); ctx.fillStyle = RED; ctx.fill();
      T(ctx, 'شراء BTC', 0, 12, { font: fA(700, 30) }); ctx.restore();
    } else if (p === 1) {   // commission
      solid(ctx, CARBON);
      T(ctx, '0.8%', cx, cy + 30, { font: fL(800, 150), dir: 'ltr' });
      T(ctx, 'عمولة واضحة', cx, cy + 116, { font: fA(600, 46), color: 'rgba(255,255,255,0.85)' });
    } else if (p === 2) {   // the coin, on red
      solid(ctx, INK);
      disc(ctx, cx, cy, 176, RED);
      CC.coin(ctx, cx, cy, 138, { a: t * 3.1, ticker: 'BTC', shadow: 0.3 });
    } else if (p === 3) {   // funding
      solid(ctx, '#F9F9F9');
      T(ctx, 'موّل بـ', w - 66, 96, { font: fA(600, 40), color: 'rgba(9,10,13,0.6)', align: 'right' });
      [['card', 'بطاقة'], ['bank', 'تحويل بنكي'], ['wallet', 'رصيد آكسي']].forEach(([ic, lb], i) => {
        const yy = 186 + i * 102;
        CC.icon(ctx, ic, w - 90, yy, 52, INK, 3.4);
        T(ctx, lb, w - 140, yy + 13, { font: fA(600, 38), align: 'right', color: INK });
      });
    } else if (p === 4) {   // 24/7
      solid(ctx, SLATE);
      T(ctx, '24/7', cx, cy + 30, { font: fL(800, 150), dir: 'ltr' });
      T(ctx, 'على مدار الساعة', cx, cy + 118, { font: fA(600, 44) });
    } else {   // the wallet, separate
      solid(ctx, INK);
      CC.icon(ctx, 'lock', cx, cy - 74, 96, '#FFFFFF', 5);
      T(ctx, 'Axi Wallet', cx, cy + 44, { font: fL(700, 40), dir: 'ltr', color: 'rgba(255,255,255,0.8)' });
      T(ctx, SAFE2, cx, cy + 112, { font: fA(600, 36) });
    }
  }
  function sCollage(ctx, t) {
    solid(ctx, '#000000');
    const beats = [b(24), b(25), b(26)], n = beats.filter((x) => t >= x).length, T_EXP = b(26) + 0.2;
    const last = n > 0 ? beats[n - 1] : T_COL, mv = n > 0 ? cio(t, last, 0.16) : 1, P0 = permAt(Math.max(0, n - 1)), P1 = permAt(n);
    const zu = expoIn(inv(T_EXP, T_WAL, t)), S5 = slot(permAt(3)[5]), c5x = S5.x + PW / 2, c5y = S5.y + PH / 2, kz = lerp(1, (H / PH) * 1.06, zu);
    ctx.save(); ctx.translate(lerp(c5x, 540, zu), lerp(c5y, 960, zu)); ctx.scale(kz, kz); ctx.translate(-c5x, -c5y);
    for (let p = 0; p < 6; p++) {
      const A = slot(n > 0 ? P0[p] : P1[p]), B = slot(P1[p]);
      const x = lerp(A.x, B.x, mv), y = lerp(A.y, B.y, mv), w = PW, h = PH;
      const ent = eo(t, T_COL + 0.02 + p * 0.025, 0.3), ks = lerp(1.35, 1, ent);
      const alpha = clamp(ent * 1.8);
      if (alpha <= 0.01) continue;
      ctx.save(); ctx.globalAlpha *= alpha;
      ctx.translate(x + w / 2, y + h / 2); ctx.scale(ks, ks); ctx.translate(-w / 2, -h / 2);
      rr(ctx, 0, 0, w, h, 26); ctx.clip();
      panelBody(ctx, p, PW, PH, t);
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------------- S11 · the coin drops into the Axi Wallet; the lock closes ----------------
  function sWallet(ctx, t) {
    bgInk(ctx);
    const ent = eo(t, T_WAL, 0.3), k = lerp(1.22, 1, ent) * kick(t, b(28), 0.04) * (1 + 0.05 * smooth(inv(b(28), T_END, t)));
    ctx.save(); zoomAt(ctx, 540, 900, k);
    const cw = 820, ch = 470, x = 540 - cw / 2, y = 900 - ch / 2, cham = 44;
    ctx.beginPath(); ctx.moveTo(x + 26, y); ctx.lineTo(x + cw - cham, y); ctx.lineTo(x + cw, y + cham); ctx.lineTo(x + cw, y + ch - 26); ctx.quadraticCurveTo(x + cw, y + ch, x + cw - 26, y + ch);
    ctx.lineTo(x + 26, y + ch); ctx.quadraticCurveTo(x, y + ch, x, y + ch - 26); ctx.lineTo(x, y + 26); ctx.quadraticCurveTo(x, y, x + 26, y); ctx.closePath();
    ctx.fillStyle = 'rgba(32,35,40,0.96)'; ctx.fill();
    const gh = ctx.createLinearGradient(0, y, 0, y + ch * 0.7); gh.addColorStop(0, 'rgba(255,255,255,0.12)'); gh.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gh; ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(255,255,255,0.42)'; ctx.stroke();
    ctx.save(); ctx.clip(); const sw = lerp(-300, cw + 300, ((t - T_WAL) / 0.9) % 1), g = ctx.createLinearGradient(x + sw - 160, 0, x + sw + 160, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.08)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x, y, cw, ch); ctx.restore();
    T(ctx, 'Axi Wallet', x + cw - 56, y + 78, { font: fL(700, 42), dir: 'ltr', align: 'right' });
    K.logoIQ(ctx, x + 110, y + 66, 120, { color: '#FFFFFF', alpha: 0.9 });
    const sx = 540, sy = y + ch / 2 + 40;
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.arc(sx, sy, 112, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    const land = b(28), u = inv(T_WAL + 0.05, land, t), sq = t > land ? 1 - 0.22 * Math.exp(-(t - land) / 0.05) : 1;
    if (t > T_WAL + 0.05) CC.coin(ctx, sx, lerp(-260, sy, u * u) + (1 - sq) * 40, 100, { a: t < land ? t * 6 : 0.15 * Math.sin((t - land) * 4), sq, ticker: 'BTC', red: true });
    const lk = eo(t, land + 0.05, 0.2);
    if (lk > 0) { ctx.save(); ctx.globalAlpha *= lk; ctx.translate(x + cw - 92, y + ch - 82); ctx.scale(lerp(1.4, 1, lk), lerp(1.4, 1, lk)); disc(ctx, 0, 0, 40, MINT); CC.icon(ctx, 'lock', 0, 0, 40, INK, 3.4); ctx.restore(); }
    ctx.restore();
    arWords(ctx, SAFE1, 540, 1280, t, { t0: T_WAL + 0.12, st: 0.06, d: 0.4, w: 700, size: 64, color: '#FFFFFF' });
    arWords(ctx, SAFE2, 540, 1370, t, { t0: T_WAL + 0.3, st: 0.05, d: 0.4, w: 400, size: 46, color: 'rgba(255,255,255,0.8)' });
  }

  // ---------------- S12 · end card: the logo builds; the coin falls into the CTA button ----------------
  const PIL = { cx: 540, cy: 1180, w: 780, h: 140 };
  function sEnd(ctx, t) {
    bgInk(ctx);
    ctx.save(); zoomAt(ctx, 540, 1000, 1 + 0.035 * smooth(inv(T_END, DUR, t)));
    logoReveal(ctx, 540, 760, 560, t, T_END + 0.04, { color: '#FFFFFF' });
    const pu = clamp(sp(t, b(30), 2.6, 0.5), 0, 1.2), land = b(31);
    const pump = t > land ? 1 + 0.035 * Math.exp(-(((t - land) % (2 * BEAT)) / 0.12)) : 1;
    const slotX = PIL.cx - PIL.w / 2 + 82;
    if (pu > 0) {
      ctx.save(); ctx.translate(PIL.cx, PIL.cy); ctx.scale(pu * pump, pu * pump);
      rr(ctx, -PIL.w / 2, -PIL.h / 2, PIL.w, PIL.h, PIL.h / 2); ctx.fillStyle = RED; ctx.fill();
      T(ctx, CTA, PIL.w / 2 - 58, 19, { font: fA(700, fitSize(ctx, CTA, fA, 700, PIL.w - 240, 56)), align: 'right' });
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.beginPath(); ctx.arc(-PIL.w / 2 + 82, 0, 50, 0, TAU); ctx.stroke();
      shimmer(ctx, t, land + 0.3, PIL.w, PIL.h, 1.7, 0.5);
      ctx.restore();
    }
    const d0 = b(30) + 0.12;
    if (t > d0) {
      const u = inv(d0, land, t), sq = t > land ? 1 - 0.25 * Math.exp(-(t - land) / 0.05) : 1, bounce = t > land ? Math.abs(Math.sin((t - land) * 9)) * 26 * Math.exp(-(t - land) / 0.16) : 0;
      const x = lerp(980, slotX, cubicOut(u)), y = lerp(-180, PIL.cy, u * u) - bounce;
      CC.coin(ctx, x, y, 46 * (t > land ? pump : 1), { a: t < land ? t * 7 : 0.25 * Math.sin((t - land) * 3), sq, ticker: 'BTC' });
      if (t > land) sparks(ctx, slotX, PIL.cy, t, land, { n: 12, len: 120, color: '#FFFFFF', w: 4, seed: 9 });
    }
    const sa = eo(t, land + 0.08, 0.4);
    if (sa > 0) { ctx.save(); ctx.globalAlpha *= sa; mixLine(ctx, [{ t: 'Buy Crypto', lat: true }, { t: '· في تطبيق آكسي' }], 540, 1366 + (1 - sa) * 24, { size: 46, lsize: 44, w: 400, lw: 600, color: 'rgba(255,255,255,0.88)' }); ctx.restore(); }
    T(ctx, TAG, 540, 1470, { font: fA(600, 46), color: 'rgba(255,255,255,0.7)', alpha: eo(t, b(32), 0.45) });
    ctx.restore();
  }

  // ---------------- frame chrome: corner labels like a design-tool canvas ----------------
  const SHOTS = [T_DROP, T_REAL, T_RATIO, T_DEC, T_GRID, T_MAR, T_PART, T_COL, T_WAL, T_END];
  function chrome(ctx, t, light) {
    if (t < T_DROP || t >= T_END || (t >= T_GRID && t < T_PART) || (t >= T_COL && t < T_WAL)) return;
    const n = SHOTS.filter((x) => t >= x).length, col = light ? 'rgba(9,10,13,0.45)' : 'rgba(255,255,255,0.42)';
    T(ctx, 'AXI · BUY CRYPTO', 60, 132, { font: fL(600, 22), color: col, align: 'left', dir: 'ltr' });
    T(ctx, String(n).padStart(2, '0') + ' / 09', W - 60, 132, { font: fL(600, 22), color: col, align: 'right', dir: 'ltr' });
    ctx.fillStyle = col; ctx.fillRect(60, 148, W - 120, 1.5);
  }

  // ---------------- the film ----------------
  const BIG = [T_DROP, T_PLUS, T_COL, b(31)], MED = [b(5), b(6), b(8), T_RIP, b(12), b(14), T_MAR, T_PART, b(24), b(25), b(26), T_WAL, b(28), T_END];
  function draw(ctx, t) {
    t = clamp(t, 0, DUR - 1e-6);
    const s1 = shake(t, BIG, 26, 0.11, 3), s2 = shake(t, MED, 9, 0.09, 7);
    ctx.save(); ctx.translate(540 + s1.x + s2.x, 960 + s1.y + s2.y); ctx.rotate(s1.r + s2.r); ctx.translate(-540, -960);
    let light = false;
    if (t < T_DROP) sHook(ctx, t);
    else if (t < T_REAL) sRed(ctx, t);
    else if (t < T_RATIO) sReal(ctx, t);
    else if (t < T_DEC) { sRatio(ctx, t); light = t < T_DEC - 0.12; }
    else if (t < T_GRID) sDecode(ctx, t);
    else if (t < T_MAR) sField(ctx, t);
    else if (t < T_PART) sMarquee(ctx, t);
    else if (t < T_COL) sParticles(ctx, t);
    else if (t < T_WAL) sCollage(ctx, t);
    else if (t < T_END) sWallet(ctx, t);
    else sEnd(ctx, t);
    ctx.restore();
    if (glitchOn(t)) glitchSlices(ctx, 11 + Math.floor(t * 60), 70);
    for (const tb of [b(24), b(25), b(26)]) if (t >= tb && t < tb + 0.04) glitchSlices(ctx, 31 + Math.floor(t * 60), 90);
    // flashes that hide the hard joins
    flash(ctx, t >= T_DROP ? 1 - (t - T_DROP) / 0.1 : 0);
    flash(ctx, t >= T_GRID ? 0.5 * (1 - (t - T_GRID) / 0.06) : 0);
    flash(ctx, t >= T_COL ? 1 - (t - T_COL) / 0.12 : 0);
    flash(ctx, t >= T_WAL ? 0.45 * (1 - (t - T_WAL) / 0.08) : 0);
    flash(ctx, t >= T_END ? 0.85 * (1 - (t - T_END) / 0.08) : 0);
    chrome(ctx, t, light);
    const wmA = t < T_END - 0.05 ? 0.6 : 0;
    if (wmA > 0) watermark(ctx, light ? INK : '#FFFFFF', wmA);
  }
  // sub-samples per frame for motion blur: dense where things move fast
  const FAST = [[0.38, 0.5], [0.8, 0.94], [1.0, 1.46], [1.7, 1.92], [2.55, 2.8], [2.14, 2.22], [3.05, 3.47], [3.9, 4.32], [4.66, 5.3], [6.15, 6.75], [7.8, 8.25], [8.35, 8.8], [9.4, 9.95], [10.27, 10.48], [10.7, 10.9], [11.13, 11.62], [11.95, 12.1], [12.4, 12.56], [12.95, 13.45]];
  const fast = (t) => FAST.some(([a, c]) => t >= a && t <= c);
  // hard joins: the shutter never reaches across one, so every cut stays clean
  const CUTS = [T_DROP, T_REAL, T_RATIO, T_FLIP, T_DEC, T_GRID, T_MAR, b(16), b(17), b(18), T_PART, T_COL, T_WAL, T_END];
  G.FILM = {
    duration: DUR, draw, init: initParticles, cuts: CUTS,
    blur: (t) => (fast(t) ? 12 : 3), shutter: (t) => (fast(t) ? 1.0 : 0.6) / 60,
    post: (ctx, t) => grain(ctx, t, 0.035),   // once per frame, after the motion-blur samples are averaged
  };
})(window);
