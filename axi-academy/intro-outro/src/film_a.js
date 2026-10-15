// STYLE A — «Ink»: the pen writes its own name.
// A red ink drop falls and lands as the nib's tip; the nib is drawn in two hairlines and fills like ink;
// the bars are underlined; «axi» and «ACADEMY» are handwritten in pen order; the tip catches one glint.
(function () {
  const { clamp, lerp, inv, smooth, cubicInOut, sineInOut, backOut, spring, eo, co, cio, qo, hash, rng } = K;
  const { NIB, TRI, BARS, RIGHT_PTS, SLOT_PTS, AXI, ACAD, AX, YT, YB, LK } = K;
  const WHITE = K.WHITE, RED = K.RED;

  // ---- timeline (s) ----
  const T_DROP = 0.0, T_HIT = 0.55, T_OUT = 0.58, T_FILL = 1.16, T_BAR = 1.60, T_AXI = 1.86, T_ACAD = 2.32, T_GLINT = 3.52, T_END = 4.0;
  // camera: close on the falling drop → pull back over the nib → settle on the lockup
  const APX = LK.tri.apex_y, NIBC = (YT + YB) / 2;
  const CAM = [
    [0.00, 2.9, AX, YT - 24, 0, 60],
    [0.55, 2.55, AX, YT - 10, 0, 40],
    [1.20, 1.85, AX, NIBC - 30, 0, 10],
    [1.85, 1.30, AX - 60, NIBC - 10, 0, 0],
    [2.60, 1.06, K.CX, K.CY, 0, 0],
    [4.00, 1.0, K.CX, K.CY, 0, 0],
  ];

  // ---- outline polylines with arc lengths ----
  function withLen(pts) { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts, cum, L: cum[cum.length - 1] }; }
  const mirror = (pts) => pts.map(([x, y]) => [2 * AX - x, y]);
  const OUT_R = withLen(RIGHT_PTS.concat([[AX, YB]]));
  const OUT_L = withLen(mirror(RIGHT_PTS.concat([[AX, YB]])));
  const SL_L = withLen(SLOT_PTS), SL_R = withLen(mirror(SLOT_PTS));
  function strokeTo(ctx, P, p) {
    const L = P.L * clamp(p); if (L <= 0.01) return null;
    const { pts, cum } = P; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); let head = pts[0];
    for (let i = 1; i < pts.length; i++) {
      if (cum[i] <= L) { ctx.lineTo(pts[i][0], pts[i][1]); head = pts[i]; continue; }
      const f = (L - cum[i - 1]) / (cum[i] - cum[i - 1]); head = [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)];
      ctx.lineTo(head[0], head[1]); break;
    }
    ctx.stroke(); return head;
  }

  // ---- axi letter anatomy (lockup space) ----
  const boxOf = (pts) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; pts.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }); return [x0, y0, x1, y1]; };
  const aHole = AXI[0].polys.find((p) => p.hole).pts;
  const aC = aHole.reduce((s, [x, y]) => [s[0] + x / aHole.length, s[1] + y / aHole.length], [0, 0]);
  const aBox = AXI[0].box, aStemL = aBox[2] - 41.6;
  const xBox = AXI[1].box;
  const iStem = boxOf(AXI[2].polys[0].pts), iDot = boxOf(AXI[2].polys[1].pts);
  const iDotC = [(iDot[0] + iDot[2]) / 2, (iDot[1] + iDot[3]) / 2];

  // ---- splash droplets ----
  const DROPS = (() => { const r = rng(11), out = []; for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (r() - 0.5) * 2.4; out.push({ vx: Math.cos(a) * (120 + r() * 260), vy: Math.sin(a) * (160 + r() * 240), r: 1.4 + r() * 2.4, life: 0.32 + r() * 0.25 }); } return out; })();

  function teardrop(ctx, x, y, r, st) {
    ctx.save(); ctx.translate(x, y); ctx.scale(1 / Math.sqrt(st), st);
    ctx.beginPath(); ctx.moveTo(0, -r * 2.3); ctx.bezierCurveTo(r * 0.55, -r * 1.25, r, -r * 0.45, r, 0);
    ctx.arc(0, 0, r, 0, Math.PI, false); ctx.bezierCurveTo(-r, -r * 0.45, -r * 0.55, -r * 1.25, 0, -r * 2.3); ctx.fill(); ctx.restore();
  }

  // ---- the scene; sil = silhouette pass for the shadow (fills only) ----
  function scene(ctx, t, sil) {
    const col = (c) => (sil ? '#000' : c);
    // 1. ink drop
    if (t >= T_DROP && t < T_HIT) {
      const u = inv(T_DROP, T_HIT, t), y = lerp(YT - 150, YT - 20, 0.35 * u + 0.65 * u * u), v = 0.35 + 1.3 * u;
      ctx.fillStyle = col(RED); teardrop(ctx, AX, y, 8, 1 + 0.45 * v);
    }
    // 2. the tip: splat → spring into the triangle
    if (t >= T_HIT) {
      const s = spring(t - T_HIT, 3.4, 0.34), sx = 1 + 0.6 * (1 - s), sy = 1 - 0.7 * (1 - s);
      ctx.save(); ctx.translate(AX, YT); ctx.scale(sx, sy); ctx.translate(-AX, -YT); ctx.fillStyle = col(RED); ctx.fill(TRI); ctx.restore();
    }
    if (!sil && t >= T_HIT && t < T_HIT + 1.0) {  // ripples + splash
      for (let k = 0; k < 2; k++) {
        const t0 = T_HIT + k * 0.11, u = inv(t0, t0 + 0.9, t); if (u <= 0 || u >= 1) continue;
        const R = 14 + (k ? 120 : 175) * K.expoOut(u);
        ctx.save(); ctx.globalAlpha *= (k ? 0.35 : 0.55) * (1 - u) * (1 - u); ctx.strokeStyle = WHITE; ctx.lineWidth = 2.4 * (1 - 0.55 * u);
        ctx.beginPath(); ctx.ellipse(AX, YT - 2, R, R * 0.3, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      }
      DROPS.forEach((d) => {
        const dt = t - T_HIT; if (dt > d.life) return;
        const x = AX + d.vx * dt, y = YT - 6 + d.vy * dt + 0.5 * 1400 * dt * dt;
        ctx.save(); ctx.globalAlpha *= 1 - dt / d.life; ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(x, y, d.r * (1 - 0.4 * dt / d.life), 0, Math.PI * 2); ctx.fill(); ctx.restore();
      });
    }
    // 3. nib: hairline outline, then ink fill rising from the bottom
    const pOut = cio(t, T_OUT, 0.8), pSlot = cio(t, T_OUT + 0.1, 0.72);
    const fillU = cio(t, T_FILL, 0.62);
    if (fillU > 0) {
      const level = lerp(YB + 8, YT - 10, fillU), A = 5.5 * (1 - fillU);
      ctx.save(); ctx.clip(NIB); ctx.fillStyle = col(WHITE); ctx.beginPath(); ctx.moveTo(AX - 140, YB + 20);
      for (let x = AX - 140; x <= AX + 140; x += 6) ctx.lineTo(x, level + A * Math.sin(0.085 * x + 11 * t) + 0.5 * A * Math.sin(0.19 * x - 7 * t));
      ctx.lineTo(AX + 140, YB + 20); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    if (!sil && pOut > 0) {
      const a = 1 - inv(1.62, 1.95, t);
      if (a > 0) {
        ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = WHITE; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        const heads = [strokeTo(ctx, OUT_R, pOut), strokeTo(ctx, OUT_L, pOut), strokeTo(ctx, SL_L, pSlot), strokeTo(ctx, SL_R, pSlot)];
        // pen tips glow while drawing
        const glow = 1 - inv(1.3, 1.5, t);
        if (glow > 0) heads.forEach((h) => { if (!h) return; ctx.save(); ctx.globalAlpha *= glow; ctx.shadowColor = 'rgba(255,255,255,0.95)'; ctx.shadowBlur = 14; ctx.fillStyle = WHITE; ctx.beginPath(); ctx.arc(h[0], h[1], 3.4, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
        ctx.restore();
      }
    }
    // 4. bars: underlined from the centre out
    LK.bars.forEach((b, i) => {
      const u = qo(t, T_BAR + i * 0.09, 0.46); if (u <= 0) return;
      const hl = Math.max(b.h / 2, b.hl * u), h = b.h * clamp(0.35 + 0.65 * u * 1.6);
      ctx.fillStyle = col(WHITE); ctx.beginPath(); ctx.roundRect(AX - hl, b.cy - h / 2, hl * 2, h, h / 2); ctx.fill();
    });
    // 5. «axi» handwritten: a (bowl sweep + stem), x (slanted wipe), i (stem + dotted)
    {
      const uBowl = cio(t, T_AXI, 0.42), uStem = cio(t, T_AXI + 0.3, 0.22);
      if (uBowl > 0) { ctx.save(); K.clipRect(ctx, aBox[0] - 4, aBox[1] - 4, aStemL + 0.5, aBox[3] + 4); K.clipWedge(ctx, aC[0], aC[1], -0.2 * Math.PI, -0.2 * Math.PI - 2 * Math.PI * uBowl); K.fillAxi(ctx, 0, col(WHITE)); ctx.restore(); }
      if (uStem > 0) { ctx.save(); K.clipRect(ctx, aStemL, aBox[1] - 4, aBox[2] + 4, lerp(aBox[1], aBox[3] + 2, uStem)); K.fillAxi(ctx, 0, col(WHITE)); ctx.restore(); }
      const ux = cio(t, T_AXI + 0.26, 0.36);
      if (ux > 0) {
        const n = [0.33, 0.944], ext = (xBox[2] - xBox[0]) * n[0] + (xBox[3] - xBox[1]) * n[1];
        ctx.save(); K.clipHalf(ctx, xBox[0], xBox[1], n[0], n[1], ext * ux); K.fillAxi(ctx, 1, col(WHITE)); ctx.restore();
      }
      const ui = cio(t, T_AXI + 0.5, 0.24), ud = inv(T_AXI + 0.74, T_AXI + 0.94, t);
      if (ui > 0) { ctx.save(); K.clipRect(ctx, iStem[0] - 3, iStem[1] - 1, iStem[2] + 3, lerp(iStem[1], iStem[3] + 2, ui)); K.fillAxi(ctx, 2, col(WHITE)); ctx.restore(); }
      if (ud > 0) {
        const s = backOut(ud, 2.2);
        ctx.save(); K.clipRect(ctx, iDot[0] - 30, iDot[1] - 30, iDot[2] + 30, iStem[1] - 2);
        ctx.translate(iDotC[0], iDotC[1]); ctx.scale(s, s); ctx.translate(-iDotC[0], -iDotC[1]); K.fillAxi(ctx, 2, col(WHITE)); ctx.restore();
      }
    }
    // 6. ACADEMY in pen order, letter by letter
    ACAD.forEach((L, i) => {
      const t0 = T_ACAD + i * 0.13, n = L.parts.length, dp = L.k === 'C' ? 0.3 : 0.16;
      const u = L.parts.map((_, j) => cio(t, t0 + j * dp * 0.62, dp));
      if (u[0] > 0) K.fillAcad(ctx, i, u, col(WHITE));
    });
    // 7. one glint on the tip
    if (!sil) {
      const u = inv(T_GLINT, T_GLINT + 0.42, t);
      if (u > 0 && u < 1) {
        const k = Math.sin(Math.PI * u), x = AX, y = LK.tri.apex_y + 2;
        ctx.save(); ctx.globalAlpha *= 0.95 * k; ctx.fillStyle = WHITE; ctx.shadowColor = 'rgba(255,255,255,0.9)'; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.ellipse(x, y, 54 * k, 1.6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(x, y, 1.6, 30 * k, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 3.2 * k, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    }
  }

  window.FILM = {
    duration: 5,
    blur(t) {
      if (t < 0.75) return 12;
      if (t < 2.2) return 8;
      if (t < 3.55) return 5;
      if (t < 3.96) return 3;
      return 1;
    },
    draw(ctx, t) {
      K.bg(ctx);
      const cam = K.track(t, CAM);
      const m = K.stage(ctx, cam);
      const k = smooth(inv(1.25, 3.6, t));
      if (k > 0) K.shadow(ctx, m, (c) => scene(c, t, true), k);
      K.stage(ctx, cam);
      scene(ctx, t, false);
      K.grain(ctx, t, 0.035, t >= T_END);
    },
  };
})();
