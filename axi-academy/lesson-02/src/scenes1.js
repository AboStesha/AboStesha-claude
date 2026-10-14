// Lesson 02 — Why trade Forex? ONE continuous shot (no cuts, no fades to black):
// brand dot → «02» tile → the dot waits as the «؟» → fly-through → $7.5T + dot globe → four reason cards → push into card 01 →
// 01 liquidity (order-book depth, spread tightens) → bars collapse into a line → 02 volatility (the line waves) → the line curls
// into the 24 h ring while night grows out of it → the ring unrolls into the 04 leverage beam → day grows back with the recap
// cards → everything collapses into the red dot → the X (close).
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT;
  const { W, H, C, clamp, lerp, inv, eo, hexA, txt, lat, mixHex } = A;
  const { w, wl, ph, sfx, ksfx, scene } = F;
  const SIL = C.silver;
  // cubic in-out — cubic-bezier(0.65, 0, 0.35, 1); the house curve for every camera move and morph
  const cio = (t, t0, d) => { const p = clamp((t - t0) / d); return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  const sp = (t, t0, wv = 14, z = 0.5) => FX.springU(t - t0, wv, z);

  F.chapters.push(
    { t: F.OFF, label: 'لماذا الفوركس؟' }, { t: ph(1), label: 'أكبر سوق في العالم' }, { t: ph(5), label: 'السيولة العالية' }, { t: ph(11), label: 'التقلّبات' },
    { t: ph(16), label: '24 ساعة' }, { t: ph(22), label: 'الرافعة المالية' }, { t: ph(27), label: 'الخلاصة' },
  );
  // high-energy: 128 BPM, A minor (Am9 · Fmaj7 · C · G), bright FM plucks, four-on-the-floor; lighter ducking keeps the drive
  F.STYLE = { bpm: 128, chords: [[33, [60, 64, 67, 71, 72]], [41, [60, 64, 65, 69, 72]], [36, [60, 64, 67, 72, 76]], [43, [59, 62, 67, 71, 74]]], kit: 'four', pluck: 'fm', swing: 0, bass: [0, 1, 0, 1, 0, 1, 0, 1], arp: [0, 2, 4, 3, 2, 4, 1, 3], padcut: 2000, duck: 0.5 };
  F.MUSIC = [
    { t: 0, lvl: 1 }, { t: F.OFF, lvl: 3 }, { t: ph(1) - 0.3, lvl: 4 }, { t: ph(4) - 0.3, lvl: 3 }, { t: ph(5) - 0.2, lvl: 4 }, { t: ph(11) - 0.3, lvl: 3 }, { t: ph(13), lvl: 4 },
    { t: ph(16) - 0.3, lvl: 3 }, { t: ph(18), lvl: 4 }, { t: ph(22) - 0.3, lvl: 3 }, { t: ph(26), lvl: 4 }, { t: ph(27) - 0.3, lvl: 3 }, { t: ph(29) - 0.3, lvl: 4 }, { t: F.CLOSE, lvl: 1 },
  ];
  G.HUD_STYLE = 'bar';

  // ---------------------------------------------------------------- key times (video time)
  const T = {
    s0: 2.05, cap: w(0, 0), why: w(0, 6), fx: w(0, 8),
    big: w(1, 0), num: w(1, 9) - 0.15, tril: w(2, 0), glob: w(3, 0) - 0.3, world: w(3, 5), pop: w(4, 0),
    r1: w(5, 0), liq: w(6, 0), huge: w(6, 3), price: w(8, 4), low: w(9, 1), spread: w(10, 2), cost: w(10, 4), lowc: w(10, 6),
    r2: w(11, 0), vol: w(12, 0), liqUp: w(13, 2), volUp: w(13, 4), fxw: w(14, 1), stk: w(14, 7), opts: w(15, 2), moves: w(15, 7),
    r3: w(16, 0), open24: w(16, 3), h24: w(16, 6), days: w(17, 0), cmp: ph(18), eight: w(19, 3), jn: ph(20), john: w(20, 4), any: w(21, 3),
    r4: w(22, 0), capIn: ph(23), lev: w(23, 5), posIn: ph(26), grow: w(26, 3), cap2: w(26, 7), times: w(26, 9),
    end: w(27, 0), huge2: w(27, 6), q: w(28, 0), down: w(28, 4), see: w(29, 0), next: w(29, 2),
  };
  const PUSH = { t0: T.r1 + 0.25, d: 0.8 };            // camera push into card 01
  const FLAT = { t0: T.r4 - 0.6, d: 0.8 };             // the 24 h ring unrolls into the leverage beam
  F.SHUTTER.push([PUSH.t0, PUSH.t0 + PUSH.d, 1.0 / 60]);

  // ---------------------------------------------------------------- day / night: a disc grows from a point and carries the new world inside it
  const NIGHT = { t0: T.r3 + 0.3, d: 1.1, cx: 960, cy: 610, to: 1 };
  const DAY = { t0: T.end - 0.25, d: 1.0, cx: 960, cy: 600, to: 0 };
  const RMAX = 1300;
  const baseDark = (t) => (t >= NIGHT.t0 + NIGHT.d && t < DAY.t0 ? 1 : 0);
  const discAt = (t) => { for (const D of [NIGHT, DAY]) if (t >= D.t0 && t < D.t0 + D.d) return { D, r: RMAX * cio(t, D.t0, D.d) }; return null; };
  let DK = 0; // the world being drawn: 0 day (light), 1 night (dark)
  const ink = () => (DK ? C.white : C.ink);
  const sub = () => (DK ? SIL : C.slate);
  function twoWorlds(ctx, t, fn) {
    const d = discAt(t);
    if (!d) { DK = baseDark(t); fn(); return; }
    const { D, r } = d;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.moveTo(D.cx + r, D.cy); ctx.arc(D.cx, D.cy, r, 0, 6.283); ctx.clip('evenodd'); DK = 1 - D.to; fn(); ctx.restore();
    if (r > 0.5) { ctx.save(); ctx.beginPath(); ctx.arc(D.cx, D.cy, r, 0, 6.283); ctx.clip(); DK = D.to; fn(); ctx.restore(); }
    DK = baseDark(t);
  }
  G.HUD_INK = (t) => { const d = discAt(t); let dk = baseDark(t); if (d) dk = Math.hypot(1100 - d.D.cx, 1010 - d.D.cy) < d.r ? d.D.to : 1 - d.D.to; return dk ? C.white : C.ink; };

  // ---------------------------------------------------------------- shared geometry
  const CX = 960, CY = 560;
  const CARD = { w: 300, h: 360, y: 600 };
  const cardX = (i) => 960 + (1.5 - i) * 330; // 01 on the right (RTL)
  const REASONS = ['سيولة عالية', 'تقلّبات جيدة', '24 ساعة', 'الرافعة المالية'];
  const HS = 130, HY = 640;                      // the «لماذا تتداول الفوركس؟» headline
  const GLX = 720, GLY = 610, GLR = 270;         // dot globe
  const DB = { y0: 770, n: 11, bw: 28, step: 36 }; // order-book depth bars
  const WX0 = 520, WX1 = 1400;                   // the line (baseline → wave → ring → beam)
  const RC = { x: 960, y: 610, R: 200 };         // 24 h ring
  const BEAM = { fx: 840, fy: 790, ls: 300, ll: 560 };
  const GD = (() => { const pts = []; const gap = 48; for (let y = 120; y <= 960; y += gap) for (let x = (W % gap) / 2; x < W; x += gap) pts.push([x, y]); return pts; })();
  const GLOBE = (() => { const n = 420, out = []; for (let i = 0; i < n; i++) { const yy = 1 - (i + 0.5) / n * 2; const r = Math.sqrt(1 - yy * yy); const th = i * 2.39996; out.push([Math.cos(th) * r, yy, Math.sin(th) * r]); } return out; })();
  const GIDX = (() => { const r = A.rng(5); return GLOBE.map(() => Math.floor(r() * GD.length)); })();
  let HG = null; // headline geometry, measured once (the dot waits exactly where the «؟» lands)
  const headGeo = () => {
    if (HG) return HG; const hw = K.wordsWidth(wl(0, 6, 8), { size: HS }); const qw = FX.kwidth('؟', HS, 'X'); const gap = HS * 0.28;
    const right = 960 + (hw + gap + qw) / 2; const qR = right - hw - gap; HG = { right, qR, qx: qR - qw * 0.5, qy: HY - 11 }; return HG;
  };

  // ---------------------------------------------------------------- SFX (frame-accurate; the voice is added in the edit)
  sfx(T.s0 + 0.04, 'pop', 0.22, { f: 900 }); sfx(T.s0 + 0.2, 'whoosh', 0.16, { d: 0.6 }); sfx(T.s0 + 0.6, 'riser', 0.06, { d: 3.2 });
  sfx(T.cap - 0.35, 'whoosh', 0.18, { d: 0.6, up: false }); sfx(T.cap + 0.34, 'pop', 0.14, { f: 1100 });
  ksfx(T.why, 'drop', 0.2); ksfx(w(0, 7), 'drop', 0.15); ksfx(T.fx, 'drop', 0.2); sfx(T.fx + 0.4, 'snap', 0.26);
  sfx(T.big - 0.3, 'whip', 0.2); sfx(T.num - 0.5, 'riser', 0.12, { d: 0.5 }); sfx(T.num, 'slam', 0.26); ksfx(T.tril, 'rise', 0.2);
  sfx(T.glob, 'whoosh', 0.18, { d: 1.0 }); sfx(T.glob + 0.95, 'chime', 0.08); sfx(T.world, 'impact', 0.16); sfx(T.world + 0.04, 'pop', 0.16, { f: 700 });
  [0, 1, 2, 3].forEach((i) => sfx(T.pop + 0.45 + i * 0.12, 'pop', 0.14, { f: 600 + i * 90, pan: 0.45 - i * 0.3 }));
  sfx(T.r1 - 0.25, 'click', 0.18); ksfx(T.r1, 'drop', 0.2); sfx(PUSH.t0, 'whip', 0.24); sfx(PUSH.t0 + PUSH.d - 0.05, 'impact', 0.14);
  ksfx(T.liq, 'drop', 0.16); for (let i = 0; i < 8; i++) sfx(T.liq - 0.15 + i * 0.07, 'tick', 0.05, { f: 1700 + i * 140, pan: (i % 2 ? 0.35 : -0.35) }); sfx(T.huge, 'charge', 0.12, { d: 1.7 });
  sfx(T.price - 0.1, 'stretch', 0.16); sfx(T.low + 0.3, 'snap', 0.2); sfx(T.spread - 0.1, 'tick', 0.14, { f: 3200 }); sfx(T.cost - 0.15, 'whoosh', 0.12, { d: 0.9, up: false }); sfx(T.lowc, 'chime', 0.16);
  sfx(T.r2 - 0.55, 'whoosh', 0.16, { d: 0.45, up: false }); ksfx(T.r2, 'drop', 0.2); sfx(T.r2 - 0.1, 'bloop', 0.14); ksfx(T.vol, 'drop', 0.18); sfx(T.liqUp, 'riser', 0.12, { d: 1.4 }); sfx(T.volUp, 'bloop', 0.12);
  sfx(T.fxw - 0.25, 'whoosh', 0.14, { d: 0.6, pan: 0.3 }); sfx(T.stk, 'whoosh', 0.1, { d: 0.4, pan: -0.3 });
  for (let i = 0; i < 6; i++) sfx(T.opts + i * (T.moves + 0.3 - T.opts) / 6, i % 2 ? 'tick' : 'pop', 0.11, { f: i % 2 ? 2600 : 820, pan: 0.4 - i * 0.16 });
  sfx(T.r3 - 0.95, 'whoosh', 0.12, { d: 0.45, up: false }); sfx(T.r3 - 0.5, 'spin', 0.2); ksfx(T.r3, 'drop', 0.2); sfx(NIGHT.t0, 'revswell', 0.12, { d: 1.0 }); sfx(NIGHT.t0 + 0.55, 'impact', 0.12);
  sfx(T.open24 - 0.2, 'riser', 0.12, { d: 2.2 }); sfx(T.h24 + 0.1, 'impact', 0.2); for (let i = 0; i < 5; i++) sfx(T.days + i * 0.18, 'tick', 0.1, { f: 2200 + i * 200 });
  sfx(T.cmp - 0.1, 'whoosh', 0.16, { d: 0.7 }); sfx(T.eight - 0.3, 'stretch', 0.1); sfx(T.eight + 0.5, 'buzz', 0.06);
  sfx(T.jn - 0.2, 'whoosh', 0.12, { d: 0.6, up: false }); sfx(T.john - 0.25, 'pop', 0.18, { f: 760 }); sfx(T.any - 0.5, 'whoosh', 0.12, { d: 1.8 });
  [0.2, 0.45, 0.7, 0.95].forEach((u, i) => sfx(T.any - 0.5 + 1.9 * (0.15 + u * 0.7), 'tick', 0.1, { f: 2600 + i * 180 }));
  sfx(FLAT.t0, 'stretch', 0.2); ksfx(T.r4, 'drop', 0.2); sfx(T.r4 - 0.05, 'impact', 0.12); sfx(T.capIn + 0.22, 'slam', 0.16); sfx(T.capIn + 0.3, 'bloop', 0.12);
  sfx(T.lev, 'tick', 0.12, { f: 2400 }); sfx(T.lev + 0.6, 'buzz', 0.05); sfx(T.posIn + 0.05, 'pop', 0.16, { f: 700 }); sfx(T.grow, 'charge', 0.14, { d: 1.7 }); sfx(T.grow + 1.7, 'chime', 0.12);
  sfx(T.cap2, 'tick', 0.14, { f: 2000 }); sfx(T.times, 'slam', 0.24);
  sfx(DAY.t0, 'revswell', 0.12, { d: 0.9 }); [0, 1, 2, 3].forEach((i) => sfx(DAY.t0 + 0.2 + i * 0.12, 'pop', 0.14, { f: 650 + i * 80, pan: 0.45 - i * 0.3 })); sfx(T.huge2, 'chime', 0.14);
  [0, 1, 2].forEach((i) => sfx(T.down + i * 0.34, 'bloop', 0.1)); ksfx(T.next, 'drop', 0.18); sfx(F.CLOSE - 0.85, 'whoosh', 0.14, { d: 0.6, up: false }); sfx(F.CLOSE - 0.55, 'revswell', 0.16, { d: 0.55 });

  // ---------------------------------------------------------------- helpers
  // section label (top-left, the reference's «01 Concept»): chapter index on the right of its title (RTL), flips in on change
  function section(ctx, t) {
    let cur = 0; F.chapters.forEach((c, i) => { if (t >= c.t) cur = i; }); const c = F.chapters[cur]; const p = eo(t, c.t, 0.45);
    ctx.save(); ctx.beginPath(); ctx.rect(60, 50, 900, 60); ctx.clip();
    const lw = txt(ctx, c.label, 77, 92 + (1 - p) * 40, { size: 28, w: 'S', color: ink(), align: 'left', dir: 'rtl' });
    lat(ctx, String(cur + 1).padStart(2, '0'), 77 + lw + 12, 92 + (1 - p) * 40, { size: 20, w: 700, color: C.red });
    ctx.restore();
  }
  function reasonCard(ctx, i, x, y, s, t, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const act = o.active || 0, deco = o.deco == null ? 1 : o.deco, fa = o.fillA == null ? 1 : o.fillA, tp = o.title || 0;
    A.roundRect(ctx, -CARD.w / 2, -CARD.h / 2, CARD.w, CARD.h, 22);
    if (fa > 0) { ctx.save(); ctx.globalAlpha *= fa; ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.restore(); }
    if (deco > 0) {
      ctx.save(); ctx.globalAlpha *= deco; ctx.strokeStyle = mixHex('#C9D0D3', C.red, act); ctx.lineWidth = 1.6 + act * 2; ctx.stroke();
      lat(ctx, String(i + 1).padStart(2, '0'), CARD.w / 2 - 28, -CARD.h / 2 + 52, { size: 30, w: 700, color: C.red, align: 'right' });
      icon(ctx, i, 0, -10, 1);
      if (tp > 0) txt(ctx, REASONS[i], 0, CARD.h / 2 - 50, { size: 34, w: 'B', color: C.ink, align: 'center', alpha: tp });
      if (tp < 1) txt(ctx, '؟', 0, CARD.h / 2 - 46, { size: 40, w: 'B', color: hexA(C.slate, 0.5), align: 'center', alpha: 1 - tp });
      ctx.restore();
    }
    ctx.restore();
  }
  function icon(ctx, i, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = C.ink; ctx.fillStyle = C.ink; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (i === 0) { for (let k = 0; k < 4; k++) { const hh = [22, 46, 70, 94][k]; ctx.fillRect(-58 + k * 32, 40 - hh, 20, hh); } ctx.fillStyle = C.red; ctx.fillRect(-64, 46, 128, 5); }
    else if (i === 1) { ctx.beginPath(); for (let k = 0; k <= 40; k++) { const u = k / 40; const xx = -64 + u * 128, yy = Math.sin(u * 12) * 34 * (0.4 + u * 0.6); k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
    else if (i === 2) { ctx.beginPath(); ctx.arc(0, 0, 52, 0, 6.283); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -34); ctx.moveTo(0, 0); ctx.lineTo(26, 12); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(-70, 26); ctx.lineTo(70, -18); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-10, 20); ctx.lineTo(-26, 48); ctx.lineTo(6, 48); ctx.closePath(); ctx.fill(); ctx.fillRect(40, -52, 34, 30); ctx.fillStyle = C.red; ctx.fillRect(-72, 2, 18, 18); }
    ctx.restore();
  }
  const env = (u) => Math.pow(Math.sin(Math.PI * u), 0.6);
  const waveY = (u, t, amp) => amp * (Math.sin(u * 11 + t * 2.2) * 0.65 + Math.sin(u * 23 - t * 1.3) * 0.25 + Math.sin(u * 5 + t * 0.7) * 0.25) * env(u);
  const depthF = (i) => 0.16 + 0.84 * Math.pow((i + 1) / DB.n, 0.85) + 0.05 * Math.sin(i * 2.3);
  function tri(ctx, x, y, s, up, col) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); if (up) { ctx.moveTo(0, -s); ctx.lineTo(-s * 0.95, s * 0.45); ctx.lineTo(s * 0.95, s * 0.45); } else { ctx.moveTo(0, s); ctx.lineTo(-s * 0.95, -s * 0.45); ctx.lineTo(s * 0.95, -s * 0.45); } ctx.closePath(); ctx.fill(); ctx.restore(); }

  // ================================================================ 0 · the dot becomes the «02» tile, then waits where the «؟» will land
  function intro(ctx, t) {
    if (t > T.fx + 0.6) return;
    const tl = sp(t, T.s0 + 0.08, 13, 0.5); const tOut = cio(t, T.cap - 0.35, 0.7); const g = headGeo();
    const rg = eo(t, T.s0 + 0.5, 0.5) * (1 - cio(t, T.cap - 0.5, 0.3));
    if (rg > 0) {
      ctx.save(); ctx.globalAlpha *= rg; ctx.lineWidth = 3; ctx.strokeStyle = hexA(C.slate, 0.22); ctx.beginPath(); ctx.arc(960, 540, 165, 0, 6.283); ctx.stroke();
      ctx.strokeStyle = C.red; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(960, 540, 165, -Math.PI / 2, -Math.PI / 2 + 6.283 * cio(t, T.s0 + 0.6, T.cap - T.s0 - 1.2)); ctx.stroke(); ctx.restore();
    }
    const absorb = clamp((t - (T.fx + 0.4)) / 0.14);
    if (absorb < 1) {
      const sz = lerp(lerp(28, 220, Math.min(1, tl)), 26, tOut); const x = lerp(960, g.qx, tOut), y = lerp(540, g.qy, tOut);
      const breathe = 1 + 0.12 * Math.sin((t - T.cap) * 6) * cio(t, T.cap + 0.3, 0.4);
      ctx.save(); ctx.translate(x, y); ctx.scale(breathe * (1 - absorb), breathe * (1 - absorb)); ctx.fillStyle = C.red;
      A.roundRect(ctx, -sz / 2, -sz / 2, sz, sz, sz * (0.5 - 0.36 * Math.min(1, tl) * (1 - tOut))); ctx.fill();
      if (tl > 0.5 && tOut < 0.5) lat(ctx, '02', 0, 33, { size: 96, w: 700, color: C.white, align: 'center', alpha: clamp((tl - 0.5) * 2) * (1 - tOut * 2) });
      ctx.restore();
    }
    const lp = eo(t, T.s0 + 0.7, 0.5) * (1 - cio(t, T.cap - 0.5, 0.4));
    if (lp > 0) { txt(ctx, 'الدرس الثاني', 960, 768, { size: 44, w: 'S', color: C.ink, align: 'center', alpha: lp }); txt(ctx, 'أكاديمية آكسي', 960, 814, { size: 26, color: C.slate, align: 'center', alpha: lp }); }
  }

  // ================================================================ dot field → globe (and back)
  function field(ctx, t) {
    const fieldIn = clamp((t - T.s0) / 1.2); const fieldOut = cio(t, T.r1 - 0.3, 0.6); if (fieldIn <= 0 || fieldOut >= 1) return;
    const gm = cio(t, T.glob, 1.1) * (1 - cio(t, T.pop + 0.1, 0.8)); const ga = ctx.globalAlpha;
    ctx.save(); ctx.fillStyle = hexA(C.slate, 0.3 * (1 - fieldOut)); ctx.globalAlpha = ga * (1 - gm * 0.85);
    GD.forEach(([x, y]) => { const d = Math.hypot(x - CX, y - CY) / 1100; const rv = clamp((fieldIn - d) * 3); if (rv <= 0) return; ctx.beginPath(); ctx.arc(x, y, 1.9 * rv, 0, 6.283); ctx.fill(); });
    if (gm > 0) {
      const rot = t * 0.35, c = Math.cos(rot), s = Math.sin(rot);
      GLOBE.forEach(([px, py, pz], k) => {
        const x3 = px * c + pz * s, z3 = -px * s + pz * c; const [gx, gy] = GD[GIDX[k]]; const front = (z3 + 1) / 2;
        const x = lerp(gx, GLX + x3 * GLR, gm), y = lerp(gy, GLY + py * GLR, gm);
        ctx.globalAlpha = ga * (0.25 + 0.75 * front) * (1 - fieldOut) * clamp(gm * 4); ctx.fillStyle = k % 9 === 0 ? C.red : C.ink; ctx.beginPath(); ctx.arc(x, y, 1.6 + 2.6 * front * gm, 0, 6.283); ctx.fill();
      });
    }
    ctx.restore();
    const bp = sp(t, T.world, 14, 0.45) * clamp((gm - 0.5) * 2);
    if (bp > 0) { ctx.save(); ctx.translate(GLX + GLR * 0.72, GLY - GLR * 0.72); ctx.scale(Math.min(1.1, bp), Math.min(1.1, bp)); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, 58, 0, 6.283); ctx.fill(); lat(ctx, '#1', 0, 16, { size: 46, w: 800, color: C.white, align: 'center' }); ctx.restore(); }
  }

  // ================================================================ «في هذا الدرس سنجيب عن سؤال · لماذا تتداول الفوركس؟» → the camera flies through it
  function headline(ctx, t) {
    const hOut = cio(t, T.big - 0.3, 0.75); if (t < T.cap - 0.3 || hOut >= 1) return; const g = headGeo();
    const zs = Math.exp(Math.log(3.4) * hOut);
    ctx.save(); ctx.globalAlpha *= 1 - clamp(hOut * 1.7); ctx.translate(960, 560); ctx.scale(zs, zs); ctx.translate(-960, -560);
    K.cap(ctx, wl(0, 0, 5), 450, t, { size: 56, color: C.slate });
    K.words(ctx, wl(0, 6, 8), g.right, HY, t, { size: HS, color: C.ink, stagger: 0.04 });
    FX.kword(ctx, '؟', g.qR, HY, { size: HS, color: C.red, lt: t - (T.fx + 0.4), mode: 'snap' });
    ctx.restore();
  }

  // ================================================================ $7.5 trillion daily · the largest market in the world
  function number(ctx, t) {
    const nOut = cio(t, T.pop + 0.05, 0.6); if (t < T.big - 0.3 || nOut >= 1) return;
    K.cap(ctx, wl(1, 0, 8), 250, t, { size: 50, color: C.slate, out: K.outAt(t, T.glob - 0.25) });
    const mv = cio(t, T.glob, 1.0); const np = sp(t, T.num, 15, 0.5);
    const nx = lerp(960, 1330, mv), ny = lerp(580, 560, mv), ns = lerp(1, 0.62, mv);
    ctx.save(); ctx.globalAlpha *= 1 - nOut; ctx.translate(nx, ny); ctx.scale(ns, ns);
    if (np > 0) { ctx.save(); const k = Math.min(1.1, np); ctx.scale(k, k); lat(ctx, '$7.5', 0, 60, { size: 260, w: 300, color: C.ink, align: 'center', track: -6 }); ctx.restore(); }
    const tw = K.wordsWidth(wl(2), { size: 76, w: 'B' }); K.words(ctx, wl(2), tw / 2, 172, t, { size: 76, w: 'B', color: C.red, mode: 'rise', stagger: 0.03 });
    txt(ctx, 'يومياً', 0, 250, { size: 36, w: 'S', color: C.slate, align: 'center', alpha: eo(t, T.tril + 0.5, 0.4) });
    ctx.restore();
    K.cap(ctx, wl(3, 0, 5, { map: { 2: { color: C.ink, w: 'B' }, 3: { color: C.ink, w: 'B' } } }), 250, t, { size: 56, color: C.slate, out: K.outAt(t, T.pop - 0.25) });
  }

  // ================================================================ four reason cards fly out of the globe → the camera pushes into 01
  function cards(ctx, t) {
    const push = clamp((t - PUSH.t0) / PUSH.d); if (t < T.pop + 0.3 || push >= 1) return;
    K.cap(ctx, wl(4), 250, t, { size: 58, color: C.ink, w: 'S', out: K.outAt(t, T.r1 - 0.2) });
    const zx = cardX(0), zy = CARD.y; const c = cio(t, PUSH.t0, PUSH.d); const zs = Math.exp(Math.log(7.5) * c);
    ctx.save(); ctx.translate(lerp(zx, 960, c), lerp(zy, 540, c)); ctx.scale(zs, zs); ctx.translate(-zx, -zy);
    for (let i = 3; i >= 0; i--) {
      const p = sp(t, T.pop + 0.45 + i * 0.12, 13, 0.5); if (p <= 0) continue;
      const vis = i === 0 ? 1 : 1 - clamp(push / 0.35); if (vis <= 0) continue;
      const x = lerp(GLX, cardX(i), Math.min(1, p)), y = lerp(GLY, CARD.y, Math.min(1, p));
      ctx.save(); ctx.globalAlpha *= vis;
      reasonCard(ctx, i, x, y, Math.min(1.06, Math.max(0.2, p)), t, i === 0 ? { active: eo(t, T.r1 - 0.25, 0.3), deco: 1 - clamp(push / 0.45), fillA: 1 - clamp((push - 0.55) / 0.45) } : {});
      ctx.restore();
    }
    // the next scene is already alive inside card 01: drawn through the inverse of the final push, so at push = 1 it is exactly full-frame
    if (push > 0) {
      ctx.save(); A.roundRect(ctx, zx - CARD.w / 2, zy - CARD.h / 2, CARD.w, CARD.h, 22); ctx.clip(); ctx.globalAlpha *= clamp(push / 0.3);
      ctx.translate(zx, zy); ctx.scale(1 / 7.5, 1 / 7.5); ctx.translate(-960, -540); depth(ctx, t); ctx.restore();
    }
    ctx.restore();
  }

  // ================================================================ 01 · LIQUIDITY — order-book depth: walls of orders rise, the spread between them tightens
  function liquidity(ctx, t) {
    if (t > T.r1 - 0.3 && t < T.r2) K.head(ctx, wl(5, 0, 0, { map: { 0: { color: C.red } } }).concat(wl(6, 0, 1)), 270, t, { size: 120, color: C.ink, out: K.outAt(t, T.r2 - 0.4, 0.35) });
    if (t < T.r1 + 0.35 || t > T.r2 + 0.1) return;
    K.cap(ctx, wl(6, 2, 6), 350, t, { size: 44, color: C.slate, out: K.outAt(t, ph(7) - 0.25) });
    K.cap(ctx, wl(7).concat(wl(8, 0, 2)), 350, t, { size: 44, color: C.slate, out: K.outAt(t, w(8, 3) - 0.25) });
    K.cap(ctx, wl(8, 3, 7).concat(wl(9, 0, 1, { map: { 1: { color: C.ink, w: 'B' } } })), 350, t, { size: 44, color: C.slate, out: K.outAt(t, ph(10) - 0.25) });
    K.cap(ctx, wl(10, 0, 6, { map: { 6: { color: C.ink, w: 'B' } } }), 350, t, { size: 44, color: C.slate, out: K.outAt(t, T.r2 - 0.45) });
    if (t >= PUSH.t0 + PUSH.d) depth(ctx, t);
  }
  // the depth chart itself (drawn inside card 01 during the push, then full-frame)
  function depth(ctx, t) {
    const a = eo(t, T.r1 + 0.35, 0.4);
    const hs = lerp(0, 120, cio(t, T.liq - 0.25, 0.7)) + lerp(0, 190, cio(t, T.huge, 1.7));
    const g = lerp(120, 12, cio(t, T.price, T.low + 0.3 - T.price)); const span = DB.n * DB.step;
    const lab = a * (1 - cio(t, T.r2 - 0.6, 0.3));
    // baseline (it becomes the volatility line)
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = mixHex(hexA(C.slate, 0.5), C.ink, cio(t, T.r2 - 0.5, 0.4)); ctx.lineWidth = lerp(3, 5, cio(t, T.r2 - 0.5, 0.4)); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(WX0, DB.y0); ctx.lineTo(WX1, DB.y0); ctx.stroke(); ctx.restore();
    // bars: bids (ink) to the left of the price, asks (slate) to the right; outer bars collapse first at the end
    ctx.save(); ctx.globalAlpha *= a;
    for (let i = 0; i < DB.n; i++) {
      const gr = clamp(sp(t, T.liq - 0.2 + i * 0.04, 13, 0.55), 0, 1.15) * (1 - cio(t, T.r2 - 0.62 + (DB.n - 1 - i) * 0.02, 0.32));
      const h = hs * depthF(i) * gr * (1 + 0.035 * Math.sin(t * 2.6 + i * 1.3)); if (h <= 0.5) continue;
      const xb = 960 - g - i * DB.step - DB.bw, xa = 960 + g + i * DB.step;
      ctx.fillStyle = C.ink; ctx.fillRect(xb, DB.y0 - h, DB.bw, h);
      ctx.fillStyle = C.slate; ctx.fillRect(xa, DB.y0 - h * (0.94 + 0.06 * Math.sin(i * 1.7)), DB.bw, h * (0.94 + 0.06 * Math.sin(i * 1.7)));
    }
    ctx.restore();
    txt(ctx, 'طلبات الشراء', 960 - g - span / 2, DB.y0 + 46, { size: 26, w: 'S', color: C.ink, align: 'center', alpha: lab });
    txt(ctx, 'طلبات البيع', 960 + g + span / 2, DB.y0 + 46, { size: 26, w: 'S', color: C.slate, align: 'center', alpha: lab });
    // spread bracket (red) between the two walls + label on a leader
    const br = eo(t, T.price - 0.2, 0.4) * lab;
    if (br > 0) {
      const yb = DB.y0 - hs * depthF(0) - 22;
      ctx.save(); ctx.globalAlpha *= br; ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.beginPath();
      ctx.moveTo(960 - g, yb + 9); ctx.lineTo(960 - g, yb); ctx.lineTo(960 + g, yb); ctx.lineTo(960 + g, yb + 9); ctx.stroke(); ctx.restore();
      const lb = eo(t, T.spread - 0.15, 0.4) * lab;
      if (lb > 0) {
        ctx.save(); ctx.globalAlpha *= lb; ctx.strokeStyle = hexA(C.red, 0.7); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(960, yb); ctx.lineTo(960, 590); ctx.stroke(); ctx.restore();
        const m1 = A.measure(ctx, 'فرق سعر ضيّق', 30, 'B'), m2 = A.measure(ctx, '(Spread)', 22, 'S'); const x0 = 960 + (m1 + 12 + m2) / 2;
        txt(ctx, 'فرق سعر ضيّق', x0, 572, { size: 30, w: 'B', color: C.ink, alpha: lb }); lat(ctx, '(Spread)', x0 - m1 - 12, 572, { size: 22, w: 600, color: C.slate, align: 'right', alpha: lb });
      }
    }
    // trading-cost gauge (fills from the right, drops to low → mint ✓)
    const cg = eo(t, T.cost - 0.15, 0.4) * lab;
    if (cg > 0) {
      const lv = lerp(0.85, 0.16, cio(t, T.cost + 0.1, 1.0));
      ctx.save(); ctx.globalAlpha *= cg; ctx.fillStyle = hexA(C.slate, 0.16); A.roundRect(ctx, 1540, 560, 260, 20, 10); ctx.fill();
      ctx.fillStyle = mixHex(C.ink, C.mint, clamp((0.6 - lv) / 0.4)); A.roundRect(ctx, 1540 + 260 * (1 - lv), 560, 260 * lv, 20, 10); ctx.fill(); ctx.restore();
      txt(ctx, 'تكاليف التداول', 1800, 535, { size: 28, w: 'S', color: C.ink, alpha: cg }); FX.check(ctx, 1506, 570, 30, inv(T.lowc, T.lowc + 0.3, t) * cg, C.mint, t);
    }
  }

  // ================================================================ 02 · VOLATILITY — the baseline waves; more liquidity → bigger swings; forex vs stocks; chances on every swing
  function volatility(ctx, t) {
    if (t > T.r2 - 0.5 && t < T.r3) {
      K.head(ctx, wl(11, 0, 0, { map: { 0: { color: C.red } } }).concat(wl(12)), 270, t, { size: 120, color: C.ink, out: K.outAt(t, T.r3 - 0.55, 0.35) });
      K.cap(ctx, wl(13), 350, t, { size: 46, color: C.slate, out: K.outAt(t, ph(14) - 0.2) });
      K.cap(ctx, wl(14), 350, t, { size: 44, color: C.slate, out: K.outAt(t, ph(15) - 0.2) });
      K.cap(ctx, wl(15), 350, t, { size: 44, color: C.slate, out: K.outAt(t, T.r3 - 0.55) });
    }
    if (t < T.r2 - 0.1 || t >= T.r3 - 0.5) return;
    const flat = cio(t, T.r3 - 0.95, 0.45); const split = cio(t, T.fxw - 0.25, 0.7);
    const amp = lerp(0, 58, cio(t, T.r2 - 0.1, 0.8)) * lerp(1, 1.9, cio(t, T.liqUp, 1.4)) * (1 - flat);
    const yF = lerp(DB.y0, 640, split);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // stocks wave (smaller), appears with the split
    if (split > 0) {
      ctx.save(); ctx.globalAlpha *= split * (1 - flat); ctx.strokeStyle = C.slate; ctx.lineWidth = 4; ctx.beginPath();
      for (let j = 0; j <= 160; j++) { const u = j / 160; const x = lerp(WX0, WX1, u), y = 870 + waveY(u, t * 0.6 + 3, amp * 0.22); j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke(); ctx.restore();
    }
    ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.beginPath();
    for (let j = 0; j <= 160; j++) { const u = j / 160; const x = lerp(WX0, WX1, u), y = yF + waveY(u, t, amp); j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke(); ctx.restore();
    // labels at the start (right) of each line
    const l0 = eo(t, T.volUp - 0.2, 0.4) * (1 - split);
    if (l0 > 0) txt(ctx, 'التقلّبات', WX1 + 26, yF + 10, { size: 30, w: 'B', color: C.ink, align: 'left', dir: 'rtl', alpha: l0 });
    if (split > 0) {
      txt(ctx, 'الفوركس', WX1 + 26, yF + 10, { size: 32, w: 'B', color: C.ink, align: 'left', dir: 'rtl', alpha: split * (1 - flat) });
      txt(ctx, 'الأسهم', WX1 + 26, 880, { size: 32, w: 'B', color: C.slate, align: 'left', dir: 'rtl', alpha: split * (1 - flat) * eo(t, T.stk - 0.1, 0.3) });
    }
    // liquidity meter: rises with «السيولة», the wave's amplitude follows it
    const lm = eo(t, T.liqUp - 0.3, 0.4) * (1 - split);
    if (lm > 0) {
      const lv = lerp(0.3, 0.95, cio(t, T.liqUp, 1.4));
      ctx.save(); ctx.globalAlpha *= lm; ctx.fillStyle = hexA(C.slate, 0.16); A.roundRect(ctx, 1600, 480, 30, 300, 15); ctx.fill(); ctx.fillStyle = C.ink; A.roundRect(ctx, 1600, 480 + 300 * (1 - lv), 30, 300 * lv, 15); ctx.fill(); ctx.restore();
      txt(ctx, 'السيولة', 1615, 826, { size: 26, w: 'S', color: C.ink, align: 'center', alpha: lm });
    }
    // opportunities: ▲ under every trough, ▼ over every peak — revealed right→left while «خيارات أكبر للتداول على حركة الأسعار» is said
    const mk = eo(t, T.opts - 0.1, 0.3) * (1 - flat);
    if (mk > 0) {
      const front = lerp(WX1 + 40, WX0 - 40, cio(t, T.opts, T.moves + 0.3 - T.opts)); const N = 220; const ys = [];
      for (let j = 0; j <= N; j++) ys.push(yF + waveY(j / N, t, amp));
      for (let j = 4; j < N - 4; j++) {
        const y = ys[j]; const peak = y < ys[j - 1] && y <= ys[j + 1], trough = y > ys[j - 1] && y >= ys[j + 1];
        if ((!peak && !trough) || Math.abs(y - yF) < 18) continue;
        const x = lerp(WX0, WX1, j / N); const vis = clamp((x - front) / 70) * mk; if (vis <= 0) continue;
        ctx.save(); ctx.globalAlpha *= vis; tri(ctx, x, peak ? y - 36 : y + 36, 15, !peak, peak ? C.red : C.mint); ctx.restore();
      }
    }
  }

  // ================================================================ 03 · 24 HOURS — the line curls into the ring (night grows out of it); 5 days; forex 24 h vs stocks 8 h; John, any time
  function hours(ctx, t) {
    if (t < T.r3 - 0.5 || t >= FLAT.t0 + FLAT.d) return;
    const curl = cio(t, T.r3 - 0.5, 0.8); const flatB = cio(t, FLAT.t0, FLAT.d);
    const cmp = cio(t, T.cmp - 0.1, 0.8) * (1 - cio(t, T.jn - 0.2, 0.7));
    const cx = lerp(RC.x, 1240, cmp), cy = RC.y, R = RC.R; const c0 = ink(); const deco = 1 - clamp(flatB * 2.5);
    // the line itself: flat line → ring → beam
    const ringA = lerp(lerp(1, 0.25, cio(t, T.r3 + 0.35, 0.5)), 1, flatB);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 5; ctx.strokeStyle = hexA(c0, ringA); ctx.beginPath();
    for (let j = 0; j <= 180; j++) {
      const u = j / 180; const an = -Math.PI / 2 + u * 6.283; let x = cx + Math.cos(an) * R, y = cy + Math.sin(an) * R;
      if (curl < 1) { x = lerp(lerp(WX0, WX1, u), x, curl); y = lerp(640, y, curl); }
      if (flatB > 0) { x = lerp(x, lerp(BEAM.fx - BEAM.ls, BEAM.fx + BEAM.ll, u), flatB); y = lerp(y, BEAM.fy, flatB); }
      j ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke(); ctx.restore();
    if (curl >= 1 && deco > 0) {
      ctx.save(); ctx.globalAlpha *= deco;
      for (let k = 0; k < 24; k++) { const an = -Math.PI / 2 + k / 24 * 6.283; const r1 = R - 22, r2 = R - (k % 6 === 0 ? 42 : 32); ctx.strokeStyle = hexA(c0, k % 6 === 0 ? 0.8 : 0.35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * r1, cy + Math.sin(an) * r1); ctx.lineTo(cx + Math.cos(an) * r2, cy + Math.sin(an) * r2); ctx.stroke(); }
      const sw = cio(t, T.open24 - 0.2, T.h24 - T.open24 + 0.3);
      if (sw > 0) { ctx.strokeStyle = C.red; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + 6.283 * sw); ctx.stroke(); }
      const hp = sp(t, T.h24 + 0.1, 14, 0.5);
      if (hp > 0) { ctx.save(); ctx.translate(cx, cy); ctx.scale(Math.min(1.1, hp), Math.min(1.1, hp)); lat(ctx, '24', 0, 40, { size: 130, w: 300, color: c0, align: 'center', track: -3 }); txt(ctx, 'ساعة', 0, 92, { size: 30, w: 'S', color: sub(), align: 'center' }); ctx.restore(); }
      ctx.restore();
    }
    // five trading days
    const dp = eo(t, T.days - 0.1, 0.4) * (1 - cio(t, T.cmp - 0.4, 0.5));
    if (dp > 0) {
      const DAYS = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];
      DAYS.forEach((d, k) => { const x = 960 + (3 - k) * 170, y = 900; const on = k < 5 && t > T.days + k * 0.18; const pp = sp(t, T.days - 0.1 + k * 0.05, 15, 0.6);
        ctx.save(); ctx.globalAlpha *= dp; ctx.translate(x, y); ctx.scale(Math.min(1.08, pp), Math.min(1.08, pp)); A.roundRect(ctx, -75, -28, 150, 56, 28); if (on) { ctx.fillStyle = C.red; ctx.fill(); } ctx.strokeStyle = on ? C.red : hexA(SIL, 0.5); ctx.lineWidth = 1.6; ctx.stroke();
        txt(ctx, d, 0, 10, { size: 24, w: 'S', color: on ? C.white : SIL, align: 'center' }); ctx.restore(); });
    }
    // stocks ring (8 h) slides out to the left for the comparison; forex ring sits on the right (read first)
    if (cmp > 0) {
      const sx = lerp(960, 680, cmp), sy = cy; ctx.save(); ctx.globalAlpha *= cmp; ctx.strokeStyle = hexA(c0, 0.22); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(sx, sy, R, 0, 6.283); ctx.stroke();
      const s8 = cio(t, T.eight - 0.3, 0.8); if (s8 > 0) { ctx.strokeStyle = SIL; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(sx, sy, R, -Math.PI / 2 + 9 / 24 * 6.283, -Math.PI / 2 + (9 + 8 * s8) / 24 * 6.283); ctx.stroke(); }
      ctx.restore();
      const ep = cmp * eo(t, T.eight, 0.3); lat(ctx, '8', sx, sy + 40, { size: 130, w: 300, color: c0, align: 'center', alpha: ep }); txt(ctx, 'ساعات', sx, sy + 92, { size: 30, w: 'S', color: sub(), align: 'center', alpha: ep });
      txt(ctx, 'الفوركس', cx, cy + R + 70, { size: 34, w: 'B', color: c0, align: 'center', alpha: cmp }); txt(ctx, 'الأسهم', sx, sy + R + 70, { size: 34, w: 'B', color: SIL, align: 'center', alpha: cmp });
    }
    // John: an avatar rides the ring once — every hour is his — leaving ✓ behind
    const jp = eo(t, T.john - 0.25, 0.4) * deco;
    if (jp > 0) {
      const orbit = cio(t, T.any - 0.5, 1.9); const an = -Math.PI / 2 + orbit * 6.283; const ax = cx + Math.cos(an) * R, ay = cy + Math.sin(an) * R;
      [0.2, 0.45, 0.7, 0.95].forEach((u) => { const ck = clamp((orbit - u) / 0.08); if (ck <= 0) return; const a2 = -Math.PI / 2 + u * 6.283; FX.check(ctx, cx + Math.cos(a2) * (R + 48), cy + Math.sin(a2) * (R + 48), 34, ck * jp, C.mint, t); });
      const ps = Math.min(1.1, sp(t, T.john - 0.25, 15, 0.5));
      ctx.save(); ctx.globalAlpha *= jp; ctx.translate(ax, ay); ctx.scale(ps, ps); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, 26, 0, 6.283); ctx.fill();
      ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(0, -7, 7, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.moveTo(-13, 15); ctx.quadraticCurveTo(-13, 2, 0, 2); ctx.quadraticCurveTo(13, 2, 13, 15); ctx.closePath(); ctx.fill(); ctx.restore();
      txt(ctx, 'جون', cx, cy - R - 46, { size: 30, w: 'B', color: c0, align: 'center', alpha: jp * (1 - cio(t, T.any - 0.5, 0.3)) });
    }
    // words
    K.head(ctx, wl(16, 0, 3, { map: { 0: { color: C.red } } }), 270, t, { size: 84, color: c0, out: K.outAt(t, T.days - 0.35) });
    K.cap(ctx, wl(16, 4, 7, { map: { 6: { color: c0, w: 'B' } } }), 350, t, { size: 50, color: sub(), out: K.outAt(t, T.days - 0.35) });
    K.cap(ctx, wl(17), 270, t, { size: 64, color: c0, w: 'S', out: K.outAt(t, T.cmp - 0.25) });
    K.cap(ctx, wl(18).concat(wl(19, 0, 6, { map: { 3: { color: c0, w: 'B' }, 4: { color: c0, w: 'B' } } })), 270, t, { size: 40, color: sub(), out: K.outAt(t, T.jn - 0.25) });
    K.cap(ctx, wl(20).concat(wl(21)), 270, t, { size: 42, color: sub(), out: K.outAt(t, T.r4 - 0.55) });
  }

  // ================================================================ 04 · LEVERAGE — the beam on a red fulcrum: $1,000 of capital balances a $10,000 position
  function leverage(ctx, t) {
    if (t < FLAT.t0 || t > DAY.t0 + DAY.d) return;
    if (t >= DAY.t0 && !DK) return; // inside the day disc the recap owns the frame
    const c0 = ink(); const out = cio(t, T.end - 0.4, 0.8);
    const drop = Math.min(1, sp(t, T.capIn, 12, 0.6)); const growP = cio(t, T.grow, 1.7);
    const tilt = 0.17 * sp(t, T.capIn + 0.18, 9, 0.32) * (1 - growP) + 0.025 * Math.sin((t - T.grow - 1.7) * 9) * Math.exp(-Math.max(0, t - T.grow - 1.7) * 3) * (t > T.grow + 1.7 ? 1 : 0);
    const P = (lx, ly) => [BEAM.fx + lx * Math.cos(tilt) - ly * Math.sin(tilt), BEAM.fy + lx * Math.sin(tilt) + ly * Math.cos(tilt)];
    ctx.save(); ctx.globalAlpha *= 1 - out; ctx.translate(960, 600); ctx.scale(1 - out * 0.12, 1 - out * 0.12); ctx.translate(-960, -600);
    if (t >= FLAT.t0 + FLAT.d) { ctx.save(); ctx.translate(BEAM.fx, BEAM.fy); ctx.rotate(tilt); ctx.strokeStyle = c0; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-BEAM.ls, 0); ctx.lineTo(BEAM.ll, 0); ctx.stroke(); ctx.restore(); }
    // fulcrum (pulses on «الرافعة»)
    const fp = sp(t, T.r4 - 0.15, 14, 0.5); if (fp > 0) { const pu = 1 + 0.22 * Math.exp(-Math.pow((t - T.lev - 0.1) / 0.16, 2)); ctx.save(); ctx.translate(BEAM.fx, BEAM.fy + 6); ctx.scale(Math.min(1.1, fp) * pu, Math.min(1.1, fp) * pu); ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-40, 74); ctx.lineTo(40, 74); ctx.closePath(); ctx.fill(); ctx.restore(); }
    // capital: a small box drops onto the long arm
    if (t > T.capIn - 0.05) {
      const [bx, by] = P(BEAM.ll - 56, -3); const dy = -320 * (1 - drop); const pul = 1 + 0.16 * Math.exp(-Math.pow((t - T.cap2 - 0.05) / 0.13, 2));
      ctx.save(); ctx.translate(bx, by + dy); ctx.scale(pul, pul); ctx.fillStyle = C.white; A.roundRect(ctx, -46, -86, 92, 86, 10); ctx.fill(); lat(ctx, '$1,000', 0, -36, { size: 22, w: 700, color: C.ink, align: 'center' }); ctx.restore();
      txt(ctx, 'رأس مالك', bx, by + dy - 104, { size: 26, w: 'S', color: c0, align: 'center', alpha: eo(t, T.capIn + 0.1, 0.3) });
    }
    // position: appears on the short arm and grows ×10 while the beam levels out (balanced)
    const pp = sp(t, T.posIn, 14, 0.5);
    if (pp > 0) {
      const [bx, by] = P(-BEAM.ls + 80, -3); const bw = lerp(110, 300, growP), bh = lerp(92, 250, growP); const k = Math.min(1.08, pp);
      ctx.save(); ctx.translate(bx, by); ctx.scale(k, k); ctx.fillStyle = '#2A2F35'; A.roundRect(ctx, -bw / 2, -bh, bw, bh, 12); ctx.fill(); ctx.strokeStyle = C.white; ctx.lineWidth = 2; ctx.stroke();
      lat(ctx, '$' + Math.round(1000 * lerp(1, 10, growP)).toLocaleString('en-US'), 0, -bh / 2 + 12, { size: lerp(24, 50, growP), w: 700, color: C.white, align: 'center' }); ctx.restore();
      txt(ctx, 'حجم الصفقة', bx, by - bh * k - 24, { size: 26, w: 'S', color: c0, align: 'center', alpha: Math.min(1, pp) });
    }
    ctx.restore();
    const xp = sp(t, T.times, 15, 0.45);
    if (xp > 0 && out < 1) { ctx.save(); ctx.globalAlpha *= 1 - out; ctx.translate(1450, 500); ctx.scale(Math.min(1.1, xp), Math.min(1.1, xp)); lat(ctx, '×10', 0, 0, { size: 140, w: 300, color: c0, align: 'center' }); ctx.restore(); txt(ctx, 'مثال توضيحي', 1450, 546, { size: 22, color: SIL, align: 'center', alpha: (1 - out) * eo(t, T.times, 0.4) }); }
    txt(ctx, 'تنبيه: الرافعة المالية تضاعف الأرباح والخسائر معاً', 960, 936, { size: 26, w: 'S', color: C.red, align: 'center', alpha: eo(t, T.lev + 0.6, 0.5) * (1 - out) });
    K.head(ctx, wl(22, 0, 1, { map: { 0: { color: C.red } } }), 270, t, { size: 104, color: c0, out: K.outAt(t, T.end - 0.45) });
    K.cap(ctx, wl(23).concat(wl(24)), 350, t, { size: 42, color: sub(), out: K.outAt(t, ph(25) - 0.2) });
    K.cap(ctx, wl(25).concat(wl(26, 0, 9, { map: { 9: { color: c0, w: 'B' } } })), 350, t, { size: 42, color: sub(), out: K.outAt(t, T.end - 0.45) });
  }

  // ================================================================ RECAP — day grows back with the four answers → questions below → collapse into the red dot
  function recap(ctx, t) {
    if (t < DAY.t0) return;
    if (t < DAY.t0 + DAY.d && DK) return; // only inside the day disc while it grows
    const col = cio(t, F.CLOSE - 0.85, 0.8); const lift = cio(t, T.q - 0.2, 0.6);
    for (let i = 0; i < 4; i++) {
      const p = sp(t, DAY.t0 + 0.12 + i * 0.12, 13, 0.5); if (p <= 0) continue;
      const x = lerp(lerp(960, cardX(i), Math.min(1, p)), 960, col), y = lerp(lerp(600, CARD.y, Math.min(1, p)) - lift * 50, 540, col);
      reasonCard(ctx, i, x, y, Math.min(1.06, Math.max(0.15, p)) * lerp(1, 0.86, lift) * (1 - col * 0.98), t, { title: eo(t, DAY.t0 + 0.5 + i * 0.12, 0.4) });
    }
    K.cap(ctx, wl(27, 0, 10, { map: { 6: { color: ink(), w: 'B' } } }), 250, t, { size: 44, color: sub(), out: K.outAt(t, T.q - 0.3) });
    K.cap(ctx, wl(28), 250, t, { size: 52, color: ink(), w: 'S', out: K.outAt(t, T.see - 0.3) });
    K.cap(ctx, wl(29).concat(wl(30)), 250, t, { size: 56, color: ink(), w: 'S', out: K.outAt(t, F.CLOSE - 0.75) });
    const da = eo(t, T.down - 0.15, 0.3) * (1 - K.outAt(t, T.see - 0.2)) * (1 - col);
    if (da > 0) { const bb = Math.abs(Math.sin((t - T.down) * 6)) * 22; ctx.save(); ctx.globalAlpha *= da; ctx.translate(960, 862 + bb); ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.lineTo(0, 40); ctx.closePath(); ctx.fill(); ctx.fillRect(-8, -56, 16, 58); ctx.restore(); }
    if (col > 0) { ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(960, 540, 14 * clamp(col * 1.5), 0, 6.283); ctx.fill(); }
  }

  // ================================================================ THE SHOT
  function world(ctx, t) {
    FX.bg(ctx, DK ? 'dark' : 'light', { dots: false });
    // camera: slow drift + a small push at every chapter change
    const push = [T.big, T.r1, T.r2, T.r3, T.r4, T.end].reduce((s, tc) => s + 0.03 * Math.exp(-Math.pow((t - tc) / 0.35, 2)), 0);
    const zoom = 1 + 0.012 * Math.sin(t * 0.21) + push; ctx.save(); ctx.translate(CX, CY); ctx.scale(zoom, zoom); ctx.translate(-CX, -CY);
    field(ctx, t); intro(ctx, t); headline(ctx, t); number(ctx, t); cards(ctx, t);
    liquidity(ctx, t); volatility(ctx, t); hours(ctx, t); leverage(ctx, t); recap(ctx, t);
    ctx.restore();
    section(ctx, t);
  }
  scene({ name: 'shot', t0: T.s0, t1: F.CLOSE, ink: 'light', enter: { type: 'cut' },
    marksFn(ctx, t) { twoWorlds(ctx, t, () => { const c = ink(); A.logo(ctx, 1843 - A.logoWidth(80), 50, 80, c); A.xmark(ctx, 115, 984, 69, c, 0.6); }); },
    draw(ctx, t) {
      twoWorlds(ctx, t, () => world(ctx, t));
      const d = discAt(t); if (d && d.r > 1) { ctx.save(); ctx.strokeStyle = hexA(C.red, 0.85 * (1 - d.r / RMAX)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(d.D.cx, d.D.cy, d.r, 0, 6.283); ctx.stroke(); ctx.restore(); }
    } });

  F.addClose();
})(typeof window !== 'undefined' ? window : globalThis);
