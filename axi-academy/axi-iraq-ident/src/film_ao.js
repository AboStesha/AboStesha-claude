// FILM A · OUTRO — «Ascend» in reverse. Opens on the intro's last frame: the white logo over the primary gradient.
// «العراق» un-writes left to right, the dark trading screen falls over the gradient, and the logo comes apart:
// the a slides away, the arm of the x lifts off, the i sinks like a candle, and its dot turns mint and leaps back
// onto the top of the x. The x deflates into one straight rising line that comes alive as the live price. It
// rides on up through the Japanese candles while the camera pulls back, and everything fades to black.
(function () {
  const { W, H, clamp, lerp, inv, smooth, eo, ei, eio, co, cio, qo, sp, hash, rng, shake, C, S, AR, BB, toLogo, scr, fillPart } = K;
  const MINT = '#5EE0BB';

  // the x's long stroke: centre line P0 (foot) → P1 (top), unit direction U, normal N (same as the intro)
  const P0 = [1010, 1032], P1 = [1606.5, 278], LEN = Math.hypot(P1[0] - P0[0], P1[1] - P0[1]);
  const U = [(P1[0] - P0[0]) / LEN, (P1[1] - P0[1]) / LEN], N = [-U[1], U[0]];
  const LEG0 = [1336, 742], LEGV = [0.632, 0.775];
  const DOT = [BB.i_dot.cx + 4, BB.i_dot.cy + 6];

  const T_LAND = 1.16, T_LIVE = 1.32, T_DARK = 2.75;
  // after the dot lands, the head rides on along the same rising axis, gathering speed
  const sHead = (t) => (t < T_LIVE ? LEN : LEN + 1500 * Math.pow(t - T_LIVE, 1.2));
  // the old axis stays straight; the new line wiggles more the further it gets from the logo
  const oct = (s, P, seed) => { const k = s / P, i = Math.floor(k), f = k - i; return lerp(hash(i * 1.37 + seed) * 2 - 1, hash((i + 1) * 1.37 + seed) * 2 - 1, f); };
  const zig = (s) => oct(s, 520, 0) + 0.45 * oct(s, 150, 11) + 0.2 * oct(s, 48, 23);
  const amp = (s, t) => 190 * smooth(inv(LEN, LEN + 650, s)) * smooth(inv(T_LIVE, T_LIVE + 0.5, t));
  const at = (s, t) => { const A = amp(s, t); return [P0[0] + U[0] * s + N[0] * A * zig(s), P0[1] + U[1] * s + N[1] * A * zig(s)]; };

  // camera: screen = A + z (p - F), p in logo-screen space; starts exactly on the final frame,
  // closes in on the head as it lands, follows it, then pulls back as the picture fades out
  function camera(t) {
    const h = scr(P0[0] + U[0] * sHead(t), P0[1] + U[1] * sHead(t)), e = cio(t, 0.95, 0.85);
    const z = lerp(1, 1.55, e) * lerp(1, 0.62, cio(t, 2.5, 1.2));
    return { z, F: [lerp(W / 2, h[0], e), lerp(910, h[1], e)], A: [lerp(W / 2, 520, e), lerp(910, 1060, e)] };
  }
  const applyCam = (ctx, cm) => { ctx.translate(cm.A[0], cm.A[1]); ctx.scale(cm.z, cm.z); ctx.translate(-cm.F[0], -cm.F[1]); };

  // Japanese candles along the rising trend (logo-screen space): hollow = up, filled = down
  const [Q0x, Q0y] = scr(P0[0], P0[1]), SLOPE = U[1] / U[0];
  const CANDLES = (() => { const r = rng(17), o = []; let p = 0;
    for (let x = -400; x < 2600; x += 30) { const base = Q0y + SLOPE * (x - Q0x) + 70, d = (r() - 0.6) * 64, op = base + p, cl = op + d;
      o.push({ x, o: op, c: cl, hi: Math.min(op, cl) - 8 - r() * 34, lo: Math.max(op, cl) + 8 + r() * 34 }); p = 0.6 * p + (r() - 0.5) * 50; }
    return o; })();
  function backdrop(ctx, t, cm, a) {
    if (a <= 0) return;
    ctx.save(); applyCam(ctx, cm); ctx.globalAlpha *= a;
    ctx.strokeStyle = 'rgba(255,255,255,0.055)'; ctx.lineWidth = 1.2 / cm.z; ctx.beginPath();
    for (let y = -2400; y < 3000; y += 96) { ctx.moveTo(-900, y); ctx.lineTo(3200, y); }
    for (let x = -900; x < 3200; x += 96) { ctx.moveTo(x, -2400); ctx.lineTo(x, 3000); }
    ctx.stroke();
    ctx.lineWidth = 2 / cm.z;
    CANDLES.forEach((c) => {
      const up = c.c < c.o, top = Math.min(c.o, c.c), hgt = Math.max(3, Math.abs(c.c - c.o));
      ctx.strokeStyle = 'rgba(255,255,255,0.17)'; ctx.beginPath(); ctx.moveTo(c.x, c.hi); ctx.lineTo(c.x, top); ctx.moveTo(c.x, top + hgt); ctx.lineTo(c.x, c.lo); ctx.stroke();
      if (up) ctx.strokeRect(c.x - 8, top, 16, hgt); else { ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(c.x - 8, top, 16, hgt); }
    });
    ctx.restore();
    ctx.save(); ctx.globalAlpha *= a * 0.9; ctx.font = '400 21px IN'; ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(255,255,255,0.32)';
    for (let y = -2400; y < 3000; y += 96) { const sy = cm.A[1] + cm.z * (y - cm.F[1]); if (sy < 30 || sy > H - 30) continue; ctx.fillText((1.1 - (y - 960) * 0.00004).toFixed(4), W - 26, sy - 8); }
    ctx.restore();
  }

  // the price line from the foot of the old x to the head, with the live head, current-price line and tag
  function priceLine(ctx, t, cm) {
    const la = smooth(inv(1.04, 1.2, t)); if (la <= 0) return;
    const sh = sHead(t), pts = []; for (let s = 0; s < sh; s += 14) pts.push(at(s, t)); pts.push(at(sh, t));
    ctx.save(); applyCam(ctx, cm); toLogo(ctx);
    const px = 1 / (S * cm.z), seg = 24; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    for (let i = 0; i < pts.length - 1; i += seg) {
      const a = (0.3 + 0.7 * Math.pow((i + seg) / pts.length, 1.2)) * la;
      ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); for (let j = i + 1; j <= Math.min(pts.length - 1, i + seg); j++) ctx.lineTo(pts[j][0], pts[j][1]);
      ctx.strokeStyle = `rgba(255,255,255,${0.09 * a})`; ctx.lineWidth = 12 * px; ctx.stroke();
      ctx.strokeStyle = `rgba(255,255,255,${0.96 * a})`; ctx.lineWidth = 3.4 * px; ctx.stroke();
    }
    ctx.restore();
  }
  function head(ctx, t, cm, a) {
    if (t < T_LAND || a <= 0) return;
    const hp = at(sHead(t), t), hs = scr(hp[0], hp[1]), X = cm.A[0] + cm.z * (hs[0] - cm.F[0]), Y = cm.A[1] + cm.z * (hs[1] - cm.F[1]);
    const ta = a * smooth(inv(T_LAND + 0.04, T_LAND + 0.22, t));
    ctx.save();
    K.glow(ctx, X, Y, 70 + 160 * Math.exp(-(t - T_LAND) / 0.12), 'rgba(94,224,187,0.8)', 0.5 * a + 0.4 * Math.exp(-(t - T_LAND) / 0.12));
    ctx.globalAlpha = ta;
    ctx.setLineDash([7, 9]); ctx.strokeStyle = 'rgba(94,224,187,0.55)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X + 16, Y); ctx.lineTo(W - 150, Y); ctx.stroke(); ctx.setLineDash([]);
    const ph = (t * 2.4) % 1; ctx.strokeStyle = `rgba(94,224,187,${0.8 * (1 - ph)})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(X, Y, 9 + 26 * ph, 0, Math.PI * 2); ctx.stroke();
    const v = (1.0965 + 0.0000042 * (sHead(t) - LEN)).toFixed(4);
    ctx.fillStyle = MINT; ctx.beginPath(); ctx.roundRect(W - 146, Y - 21, 122, 42, 8); ctx.fill();
    ctx.font = '600 22px IN'; ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.fillText(v, W - 85, Y + 8);
    ctx.globalAlpha = a; ctx.fillStyle = MINT; ctx.beginPath(); ctx.arc(X, Y, 9, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(X, Y, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // the x: the leg retracts into the long stroke, then the stroke deflates onto its axis
  function xBody(ctx, t) {
    const b = 1 - ei(t, 1.08, 0.28), l = 1 - ei(t, 0.9, 0.3); if (b <= 0) return;
    const hw = lerp(8, 140, b), ext = 260, clip = new Path2D();
    const q = (p, d, w, l0, l1) => { const [ux, uy] = d, nx = -uy, ny = ux; clip.moveTo(p[0] + ux * l0 + nx * w, p[1] + uy * l0 + ny * w); clip.lineTo(p[0] + ux * l1 + nx * w, p[1] + uy * l1 + ny * w); clip.lineTo(p[0] + ux * l1 - nx * w, p[1] + uy * l1 - ny * w); clip.lineTo(p[0] + ux * l0 - nx * w, p[1] + uy * l0 - ny * w); clip.closePath(); };
    q(P0, U, hw, -ext, LEN + ext);
    if (l > 0) q(LEG0, LEGV, 190, -160, lerp(0, 520, l));
    ctx.save(); ctx.clip(clip); fillPart(ctx, 'x_body', C.white); ctx.restore();
  }

  function scene(ctx, t) {
    const cm = camera(t);
    // background: the dark trading screen falls over the primary gradient from the top
    const wp = cio(t, 0.42, 0.6), edge = lerp(-160, H + 150, wp);
    if (wp < 1) K.bgPrimary(ctx);
    if (wp > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, Math.max(0, edge)); ctx.clip(); K.bgDark(ctx); ctx.restore();
      if (wp < 1) {
        const g = ctx.createLinearGradient(0, edge, 0, edge + 140); g.addColorStop(0, 'rgba(23,24,25,0.55)'); g.addColorStop(1, 'rgba(23,24,25,0)');
        ctx.fillStyle = g; ctx.fillRect(0, edge, W, 140); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(0, edge - 1.5, W, 3);
      }
    }
    backdrop(ctx, t, cm, smooth(inv(0.55, 1.2, t)));
    priceLine(ctx, t, cm);

    // the logo comes apart under the camera
    const hit = shake(t, [T_LAND, 1.36], 6, 0.09, 4);
    ctx.save(); ctx.translate(hit[0], hit[1]); applyCam(ctx, cm); toLogo(ctx);
    xBody(ctx, t);
    // the arm lifts off along its own axis
    const ua = ei(t, 0.7, 0.36);
    if (ua < 1) { ctx.save(); ctx.translate(-430 * ua, -540 * ua); fillPart(ctx, 'x_arm', C.white, 1 - inv(0.98, 1.06, t)); ctx.restore(); }
    // the i sinks like a candle; its dot turns mint, shrinks and leaps back onto the top of the x
    const ui = 1 - ei(t, 0.76, 0.32);
    if (ui > 0) { ctx.save(); ctx.translate(0, 1032); ctx.scale(1, Math.max(0.001, ui)); ctx.translate(0, -1032); fillPart(ctx, 'i_stem', C.white); ctx.restore(); }
    if (t < 0.88) {
      const k = lerp(1, 0.3, cio(t, 0.66, 0.22)), col = K.mixHex('#ffffff', MINT, inv(0.62, 0.8, t));
      ctx.save(); ctx.translate(DOT[0], DOT[1]); ctx.scale(k, k); ctx.translate(-DOT[0], -DOT[1]); fillPart(ctx, 'i_dot', col); ctx.restore();
    } else if (t < T_LAND + 0.01) {
      const jl = cio(t, 0.86, T_LAND - 0.86), x = lerp(DOT[0], P1[0], jl), y = lerp(DOT[1], P1[1], jl) - Math.sin(Math.PI * jl) * 260;
      ctx.save(); ctx.translate(x, y); ctx.fillStyle = MINT; ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    // the a slides away to the left with a speed stretch
    const ua2 = ei(t, 0.62, 0.42);
    if (ua2 < 1) { const st = 1 + 0.35 * ua2 * (1 - ua2) * 4 * ua2; ctx.save(); ctx.translate(-1100 * ua2, 0); ctx.translate(818, 655); ctx.scale(st, 1 / Math.sqrt(st)); ctx.translate(-818, -655); fillPart(ctx, 'a', C.white, 1 - inv(0.98, 1.04, t)); ctx.restore(); }
    // «العراق» un-writes: the last part written leaves first, each wiped from its left edge with a small drop
    [...AR].reverse().forEach((k, i) => {
      const u = 1 - ei(t, 0.26 + i * 0.07, 0.36); if (u <= 0) return; const b = BB[k];
      ctx.save(); ctx.beginPath(); ctx.rect(lerp(b.x1 + 4, b.x0 - 30, u), b.y0 - 60, b.x1 - b.x0 + 80, b.h + 140); ctx.clip();
      ctx.translate(0, 46 * (1 - u)); fillPart(ctx, k, C.white, clamp(u * 2)); ctx.restore();
    });
    ctx.restore();

    // a last halo across the logo before it opens
    ctx.save(); applyCam(ctx, cm); K.edgeGlint(ctx, t, -0.02, 0.5, { a: 0.8, blur: 10, width: 460 }); ctx.restore();

    // fade to black: the chart dims first, the live head last
    const dk = smooth(inv(T_DARK, 3.45, t));
    if (dk > 0) { ctx.save(); ctx.globalAlpha = dk; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    head(ctx, t, cm, 1 - smooth(inv(3.18, 3.6, t)));
  }

  window.FILM = {
    duration: 4,
    blur(t) { if (t < 0.5) return 3; if (t < 1.6) return 10; if (t < 3.65) return 6; return 1; },
    draw(ctx, t) {
      if (t >= 3.64) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); return; }
      scene(ctx, t); K.grain(ctx, t, t < 0.45 ? 0.035 : 0.06 * (1 - smooth(inv(T_DARK, 3.45, t))), false);
    },
  };
})();
