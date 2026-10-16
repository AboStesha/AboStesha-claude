// FILM C — «Drop» (tactile, 3D). Seen from above, the letters of «axi» are thick matte slabs that drop out of the
// camera onto a light tabletop one after another, each landing with a small bounce, a contact shadow and a nudge
// of the camera. «العراق» follows right to left. The camera drifts so the slab sides shift in true perspective.
// Then the slabs press flat into the table like a stamp and the logo is printed in ink. Ends on the ink logo
// over the light gradient.
(function () {
  const { W, H, clamp, lerp, inv, smooth, eo, ei, eio, co, ci, cio, qo, sp, C, LW, LH, S, OX, OY, AXI, AR, PART, BB, toLogo, scr, fillPart, mixHex } = K;

  const F = 2600, D = 64;                               // camera height and slab thickness (px at table scale)
  // drop schedule: release time, fall duration, start height (× F)
  const DROP = {
    x_body: [-0.06, 0.34, 0.6], a: [0.16, 0.34, 0.6], i_stem: [0.34, 0.32, 0.58], x_arm: [0.5, 0.3, 0.56], i_dot: [0.68, 0.27, 0.5],
    ar_alef1: [1.0, 0.24, 0.36], ar_lam_ain_ra: [1.08, 0.25, 0.36], ar_alef2: [1.16, 0.24, 0.36], ar_qaf: [1.24, 0.25, 0.36],
  };
  const LAND = Object.fromEntries(Object.entries(DROP).map(([k, v]) => [k, v[0] + v[1]]));
  const T_PRESS = 2.12, T_STAMP = 2.46;
  function height(k, t) {
    const [t0, tf, z0] = DROP[k], Z0 = z0 * F, tl = t0 + tf;
    if (t < tl) { const u = clamp((t - t0) / tf); return Z0 * (1 - u * u); }
    const d = t - tl; return Z0 * 0.045 * Math.exp(-d / 0.09) * Math.abs(Math.sin(d * 26));
  }
  // slab thickness: full until the press, which lifts a hair and then flattens everything
  const thick = (t) => D * (1 - eio(t, T_PRESS + 0.1, T_STAMP - T_PRESS - 0.1));
  const lift = (t) => 18 * Math.sin(Math.PI * clamp((t - T_PRESS) / (T_STAMP - T_PRESS))) * (t < T_STAMP ? 1 : 0);

  // vanishing point = the camera's position over the table; it drifts, so the sides move in true perspective
  const vp = (t) => [lerp(470, W / 2, cio(t, 0.0, 2.4)), lerp(1180, 910, cio(t, 0.0, 2.4))];
  const kz = (h) => F / Math.max(1, F - h);

  function partShade(k, V) {
    const [cx, cy] = scr(BB[k].cx, BB[k].cy), dx = cx - V[0], dy = cy - V[1], n = Math.hypot(dx, dy) + 1e-6;
    return clamp(0.5 + 0.5 * (dx / n * 0.7 - dy / n * 0.7));   // sides facing the top-right light are lighter
  }
  function rmax(k, V) { const b = BB[k], c = [scr(b.x0, b.y0), scr(b.x1, b.y0), scr(b.x0, b.y1), scr(b.x1, b.y1)]; return Math.max(...c.map((p) => Math.hypot(p[0] - V[0], p[1] - V[1]))); }
  // draw part k as if lying at height h: perspective = uniform scale about the vanishing point
  function at(ctx, V, h) { const s = kz(h); ctx.translate(V[0], V[1]); ctx.scale(s, s); ctx.translate(-V[0], -V[1]); toLogo(ctx); }

  function scene(ctx, t) {
    K.bgLight(ctx);
    const V = vp(t), d = thick(t), L = lift(t), press = eio(t, T_PRESS + 0.1, T_STAMP - T_PRESS - 0.1);
    const hits = Object.values(LAND).map((x) => x).concat([T_STAMP]);
    const sh = K.shake(t, hits, 3.2, 0.07, 5);
    ctx.save(); ctx.translate(sh[0], sh[1]);
    const parts = AXI.concat(AR).filter((k) => t >= DROP[k][0]).map((k) => ({ k, z: height(k, t) + L }));
    // 1 · shadows on the table (light from the top right)
    parts.forEach(({ k, z }) => {
      const hm = z + d * 0.5, a = (0.2 + 0.1 * clamp(1 - z / 900)) * (1 - press) * clamp((t - DROP[k][0]) / 0.12);
      if (a <= 0.003) return;
      ctx.save(); ctx.translate(-0.3 * hm - 4, 0.38 * hm + 6); toLogo(ctx); ctx.filter = `blur(${(3 + hm * 0.045).toFixed(1)}px)`;
      ctx.globalAlpha = a; ctx.fillStyle = '#20262c'; ctx.fill(PART[k], 'evenodd'); ctx.restore();
      if (z < 30) { ctx.save(); ctx.translate(-2, 3); toLogo(ctx); ctx.filter = 'blur(3px)'; ctx.globalAlpha = 0.28 * (1 - z / 30) * (1 - press); ctx.fillStyle = '#111417'; ctx.fill(PART[k], 'evenodd'); ctx.restore(); }
    });
    // 2 · landing ripples on the table
    parts.forEach(({ k }) => {
      const dt = t - LAND[k]; if (dt < 0 || dt > 0.4) return; const [cx, cy] = scr(BB[k].cx, BB[k].cy), big = AXI.includes(k) ? 1 : 0.55;
      ctx.save(); ctx.globalAlpha = 0.06 * (1 - dt / 0.4) * big; ctx.strokeStyle = '#2a3036'; ctx.lineWidth = 5 * (1 - dt / 0.4) + 1; ctx.beginPath();
      ctx.ellipse(cx, cy, (BB[k].w * S / 2 + 30) + 260 * K.expoOut(dt / 0.4) * big, (BB[k].h * S / 2 + 30) + 200 * K.expoOut(dt / 0.4) * big, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    });
    if (t > T_STAMP && t < T_STAMP + 0.7) {
      const u = (t - T_STAMP) / 0.7; ctx.save(); ctx.globalAlpha = 0.07 * (1 - u); ctx.strokeStyle = '#2a3036'; ctx.lineWidth = 8 * (1 - u) + 1;
      ctx.beginPath(); ctx.ellipse(W / 2, 910, 420 + 520 * K.expoOut(u), 300 + 420 * K.expoOut(u), 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    }
    // 3 · slabs, lowest first: side layers from the bottom face up, then the top face with a lit rim
    parts.sort((p, q) => p.z - q.z).forEach(({ k, z }) => {
      const a = clamp((t - DROP[k][0]) / 0.1), shade = partShade(k, V);
      const side = mixHex('#24282d', '#5b626b', shade), side2 = mixHex('#30353b', '#6d757e', shade);
      ctx.save(); ctx.globalAlpha = a;
      if (d > 0.4) {
        const sidePx = (kz(z + d) - kz(z)) * rmax(k, V), n = Math.round(clamp(sidePx / 1.2, 3, 56));
        for (let i = 0; i <= n; i++) { ctx.save(); at(ctx, V, z + (d * i) / n); ctx.fillStyle = i < n * 0.6 ? side : side2; ctx.fill(PART[k], 'evenodd'); ctx.restore(); }
      }
      const top = mixHex('#15181c', C.ink, press);
      if (press < 1) { ctx.save(); ctx.translate(1.6 * (1 - press), -1.6 * (1 - press)); at(ctx, V, z + d); ctx.fillStyle = mixHex('#8d959e', C.ink, press); ctx.fill(PART[k], 'evenodd'); ctx.restore(); }
      ctx.save(); at(ctx, V, z + d); ctx.fillStyle = top; ctx.fill(PART[k], 'evenodd'); ctx.restore();
      ctx.restore();
    });
    ctx.restore();
    // 4 · a sheen runs across the printed logo
    K.sheen(ctx, t, 2.78, 0.62, { color: 'rgba(150,160,170,0.5)', width: 380 });
  }

  window.FILM = {
    duration: 4,
    blur(t) { if (t < 1.6) return 10; if (t < 2.7) return 4; if (t < 3.45) return 3; return 1; },
    draw(ctx, t) { scene(ctx, t); K.grain(ctx, t, 0.03, t > 3.45); },
  };
})();
