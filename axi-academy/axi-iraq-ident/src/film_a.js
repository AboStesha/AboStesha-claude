// FILM A — «Ascend» (kinetic, market). A live price line rides up a dark trading screen with the camera on its
// head. It irons out into one straight rising line, the exact axis of the x, and inflates into the x's long
// stroke. Its leading tick leaps up and becomes the dot of the i, the i rises under it like a candle, the arm of
// the x and the a snap in, the market rises into the brand gradient and «العراق» writes in right to left.
// Ends on the white logo over the primary gradient.
(function () {
  const { W, H, clamp, lerp, inv, smooth, eo, ei, eio, co, cio, qo, sp, hash, noise, rng, shake, C, LW, LH, S, OX, OY, AR, PART, BB, LOGO_ALL, toLogo, scr, fillPart } = K;
  const MINT = '#5EE0BB';

  // the x's long stroke: centre line P0 (foot) → P1 (top), unit direction U, normal N
  const P0 = [1010, 1032], P1 = [1606.5, 278], LEN = Math.hypot(P1[0] - P0[0], P1[1] - P0[1]);
  const U = [(P1[0] - P0[0]) / LEN, (P1[1] - P0[1]) / LEN], N = [-U[1], U[0]];
  const LEG0 = [1336, 742], LEGV = [0.632, 0.775];                 // where the leg leaves the stroke, and its direction
  const DOT = [BB.i_dot.cx + 4, BB.i_dot.cy + 6];

  const T_LOCK = 1.1, S_MIN = -2500;
  // steady run-up already under way at frame 0, easing into the lock
  const sHead = (t) => lerp(S_MIN, LEN, 1 - Math.pow(1 - clamp((t + 0.14) / (T_LOCK + 0.14)), 1.7));
  const amp = (t) => 190 * (1 - smooth(inv(0.7, T_LOCK, t)));
  // chart-like zigzag: three octaves of straight steps between random knots (swings, moves, ticks)
  const oct = (s, P, seed) => { const k = s / P, i = Math.floor(k), f = k - i; return lerp(hash(i * 1.37 + seed) * 2 - 1, hash((i + 1) * 1.37 + seed) * 2 - 1, f); };
  const zig = (s) => oct(s, 520, 0) + 0.45 * oct(s, 150, 11) + 0.2 * oct(s, 48, 23);
  const at = (s, A) => [P0[0] + U[0] * s + N[0] * A * zig(s), P0[1] + U[1] * s + N[1] * A * zig(s)];

  // camera: screen = A + z (p - F), p in logo-screen space; follows the head, then settles on the final frame
  function camera(t) {
    const h = scr(P0[0] + U[0] * sHead(t), P0[1] + U[1] * sHead(t)), e = cio(t, 0.92, 1.0);
    // settles 1.8% wide, then a slow push lands exactly on the final placement
    const z = lerp(1.6, 0.982, e) * lerp(1, 1 / 0.982, smooth(inv(1.92, 3.9, t)));
    return { z, F: [lerp(h[0], W / 2, e), lerp(h[1], 910, e)], A: [W / 2, lerp(1160, 910, e)] };
  }
  const applyCam = (ctx, cm) => { ctx.translate(cm.A[0], cm.A[1]); ctx.scale(cm.z, cm.z); ctx.translate(-cm.F[0], -cm.F[1]); };

  // faint chart backdrop in logo-screen space
  const CANDLES = (() => { const r = rng(7), o = []; let y = 2350; for (let x = -620; x < 1500; x += 34) { const d = (r() - 0.62) * 70; o.push({ x, o: y, c: y + d, hi: Math.min(y, y + d) - 10 - r() * 40, lo: Math.max(y, y + d) + 10 + r() * 40 }); y += d - 22 * (r() * 0.7 + 0.5); } return o; })();
  function backdrop(ctx, t, cm, a) {
    if (a <= 0) return;
    ctx.save(); applyCam(ctx, cm); ctx.globalAlpha *= a;
    ctx.strokeStyle = 'rgba(255,255,255,0.055)'; ctx.lineWidth = 1.2 / cm.z; ctx.beginPath();
    for (let y = -400; y < 3000; y += 96) { ctx.moveTo(-900, y); ctx.lineTo(1900, y); }
    for (let x = -900; x < 1900; x += 96) { ctx.moveTo(x, -400); ctx.lineTo(x, 3000); }
    ctx.stroke();
    CANDLES.forEach((c) => {
      ctx.fillStyle = ctx.strokeStyle = 'rgba(255,255,255,0.075)'; ctx.lineWidth = 2 / cm.z;
      ctx.beginPath(); ctx.moveTo(c.x, c.hi); ctx.lineTo(c.x, c.lo); ctx.stroke(); ctx.fillRect(c.x - 8, Math.min(c.o, c.c), 16, Math.max(3, Math.abs(c.c - c.o)));
    });
    ctx.restore();
    // price axis on the right edge: one label per grid line
    ctx.save(); ctx.globalAlpha *= a * 0.9; ctx.font = '400 21px IN'; ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(255,255,255,0.32)';
    for (let y = -400; y < 3000; y += 96) { const sy = cm.A[1] + cm.z * (y - cm.F[1]); if (sy < 30 || sy > H - 30) continue; ctx.fillText((1.1 - (y - 960) * 0.00004).toFixed(4), W - 26, sy - 8); }
    ctx.restore();
  }

  // the price line (logo space), its head, the current-price line and tag
  function priceLine(ctx, t, cm) {
    const sh = sHead(t), A = amp(t), tail = lerp(S_MIN, 0, eio(t, T_LOCK, 0.28)), fade = 1 - inv(T_LOCK + 0.18, T_LOCK + 0.42, t);
    if (fade <= 0 || sh <= tail) return;
    const pts = []; for (let s = tail; s < sh; s += 14) pts.push(at(s, A)); pts.push(at(sh, A));
    ctx.save(); applyCam(ctx, cm); toLogo(ctx);
    const px = 1 / (S * cm.z), flash = Math.exp(-Math.max(0, t - T_LOCK) / 0.09) * (t > T_LOCK - 0.02 ? 1 : 0);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const seg = 24;                                                     // fade the old line toward the tail
    for (let i = 0; i < pts.length - 1; i += seg) {
      const a = (0.25 + 0.75 * Math.pow((i + seg) / pts.length, 1.5)) * fade;
      ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); for (let j = i + 1; j <= Math.min(pts.length - 1, i + seg); j++) ctx.lineTo(pts[j][0], pts[j][1]);
      ctx.strokeStyle = `rgba(255,255,255,${0.09 * a + 0.4 * flash})`; ctx.lineWidth = (12 + 46 * flash) * px; ctx.stroke();
      ctx.strokeStyle = `rgba(255,255,255,${0.96 * a})`; ctx.lineWidth = (3.4 + 3 * flash) * px; ctx.stroke();
    }
    ctx.restore();
    // head + current price (screen space)
    const hp = at(sh, A), hs = scr(hp[0], hp[1]), X = cm.A[0] + cm.z * (hs[0] - cm.F[0]), Y = cm.A[1] + cm.z * (hs[1] - cm.F[1]);
    const ha = 1 - inv(T_LOCK + 0.05, T_LOCK + 0.12, t);
    if (ha > 0) {
      ctx.save(); ctx.globalAlpha *= ha;
      ctx.setLineDash([7, 9]); ctx.strokeStyle = 'rgba(94,224,187,0.55)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X + 16, Y); ctx.lineTo(W - 150, Y); ctx.stroke(); ctx.setLineDash([]);
      // the live head: mint dot with a pulsing ring
      const ph = (t * 2.4) % 1; K.glow(ctx, X, Y, 70, 'rgba(94,224,187,0.8)', 0.5);
      ctx.strokeStyle = `rgba(94,224,187,${0.8 * (1 - ph)})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(X, Y, 9 + 26 * ph, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = MINT; ctx.beginPath(); ctx.arc(X, Y, 9, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(X, Y, 3.5, 0, Math.PI * 2); ctx.fill();
      const v = (1.0842 + 0.0123 * clamp((sh - S_MIN) / (LEN - S_MIN))).toFixed(4);
      ctx.fillStyle = MINT; ctx.beginPath(); ctx.roundRect(W - 146, Y - 21, 122, 42, 8); ctx.fill();
      ctx.font = '600 22px IN'; ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.fillText(v, W - 85, Y + 8);
      ctx.restore();
    }
    return [X, Y];
  }

  // the x: a band around its axis inflates into the long stroke, then the leg grows out of it
  function xBody(ctx, t) {
    const b = eo(t, T_LOCK, 0.3), l = eo(t, T_LOCK + 0.12, 0.34); if (b <= 0) return;
    const hw = lerp(8, 140, b), ext = 260;
    const clip = new Path2D();
    const q = (p, d, w, l0, l1) => { const [ux, uy] = d, nx = -uy, ny = ux; clip.moveTo(p[0] + ux * l0 + nx * w, p[1] + uy * l0 + ny * w); clip.lineTo(p[0] + ux * l1 + nx * w, p[1] + uy * l1 + ny * w); clip.lineTo(p[0] + ux * l1 - nx * w, p[1] + uy * l1 - ny * w); clip.lineTo(p[0] + ux * l0 - nx * w, p[1] + uy * l0 - ny * w); clip.closePath(); };
    q(P0, U, hw, -ext, LEN + ext);
    if (l > 0) q(LEG0, LEGV, 190, -160, lerp(0, 520, l));
    ctx.save(); ctx.clip(clip); fillPart(ctx, 'x_body', C.white); ctx.restore();
  }

  function scene(ctx, t) {
    const cm = camera(t);
    // background: dark market → primary gradient rising from the bottom
    K.bgDark(ctx);
    const wp = cio(t, 1.82, 0.62), edge = lerp(H + 150, -160, wp);
    if (wp > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(0, edge, W, H - edge + 10); ctx.clip(); K.bgPrimary(ctx); ctx.restore();
      if (wp < 1) {
        const g = ctx.createLinearGradient(0, edge - 140, 0, edge); g.addColorStop(0, 'rgba(94,118,128,0)'); g.addColorStop(1, 'rgba(94,118,128,0.55)');
        ctx.fillStyle = g; ctx.fillRect(0, edge - 140, W, 140); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(0, edge - 1.5, W, 3);
      }
    }
    backdrop(ctx, t, cm, 1 - inv(1.75, 2.35, t));

    priceLine(ctx, t, cm);

    // the logo under the camera
    const hit = shake(t, [T_LOCK, T_LOCK + 0.42, 1.62], 7, 0.09, 3);
    ctx.save(); ctx.translate(hit[0], hit[1]); applyCam(ctx, cm);
    toLogo(ctx);
    xBody(ctx, t);
    // the arm of the x snaps in along its own axis
    const ua = sp(t, 1.36, 3.4, 0.62);
    if (ua > 0) { ctx.save(); ctx.translate(-430 * (1 - ua), -540 * (1 - ua)); fillPart(ctx, 'x_arm', C.white, clamp((t - 1.36) / 0.08)); ctx.restore(); }
    // the head leaps to the i and becomes its dot; the i rises under it like a candle
    const jl = cio(t, T_LOCK + 0.06, 0.3), land = T_LOCK + 0.36;
    if (t > T_LOCK + 0.06 && t < land + 0.02) {
      const x = lerp(P1[0], DOT[0], jl), y = lerp(P1[1], DOT[1], jl) - Math.sin(Math.PI * jl) * 260;
      ctx.save(); ctx.translate(x, y); ctx.fillStyle = MINT; ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    if (t >= land) {
      const k = sp(t, land, 3.6, 0.42), col = K.mixHex(MINT, '#ffffff', inv(land + 0.04, land + 0.24, t));
      ctx.save(); ctx.translate(DOT[0], DOT[1]); ctx.scale(lerp(0.25, 1, k), lerp(0.25, 1, k)); ctx.translate(-DOT[0], -DOT[1]); fillPart(ctx, 'i_dot', col); ctx.restore();
      K.glow(ctx, DOT[0], DOT[1], 260, 'rgba(94,224,187,0.9)', 0.45 * Math.exp(-(t - land) / 0.14));
    }
    const ui = sp(t, 1.42, 3.0, 0.55);
    if (ui > 0) { ctx.save(); ctx.translate(0, 1032); ctx.scale(1, Math.max(0.001, ui)); ctx.translate(0, -1032); fillPart(ctx, 'i_stem', C.white); ctx.restore(); }
    // the a slides in from the left with a speed stretch
    const ua2 = eo(t, 1.5, 0.5);
    if (ua2 > 0) { const st = 1 + 0.35 * (1 - ua2) * ua2 * 4 * (1 - ua2); ctx.save(); ctx.translate(-1100 * (1 - ua2), 0); ctx.translate(818, 655); ctx.scale(st, 1 / Math.sqrt(st)); ctx.translate(-818, -655); fillPart(ctx, 'a', C.white, clamp((t - 1.5) / 0.06)); ctx.restore(); }
    // «العراق» writes in right to left, each part wiped from its right edge with a small rise
    AR.forEach((k, i) => {
      const u = qo(t, 2.22 + i * 0.08, 0.42); if (u <= 0) return; const b = BB[k];
      ctx.save(); ctx.beginPath(); ctx.rect(lerp(b.x1 + 4, b.x0 - 30, u), b.y0 - 60, b.x1 - b.x0 + 80, b.h + 140); ctx.clip();
      ctx.translate(0, 46 * (1 - u)); fillPart(ctx, k, C.white, clamp(u * 2)); ctx.restore();
    });
    ctx.restore();

    // a halo of light runs across the finished logo
    ctx.save(); applyCam(ctx, cm); K.edgeGlint(ctx, t, 2.86, 0.62, { a: 0.85, blur: 10, width: 460 }); ctx.restore();
  }

  window.FILM = {
    duration: 4,
    blur(t) { if (t < 2.05) return 10; if (t < 2.95) return 6; if (t < 3.5) return 3; return 1; },
    draw(ctx, t) { scene(ctx, t); K.grain(ctx, t, t < 2.2 ? 0.06 : 0.035, t > 3.9); },
  };
})();
