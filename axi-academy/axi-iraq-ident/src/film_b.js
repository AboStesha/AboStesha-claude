// FILM B — «Blueprint» (precise, premium). On a black drafting grid, construction guides shoot across the frame:
// baseline, x-height, the a's circle and the 51.7° axis of the x. Plotter heads trace every outline of «axi»,
// the letters flood solid white, the guides retract, and «العراق» is traced and filled right to left. The camera
// pulls back from the a to the full mark. Ends on the white logo over the tertiary dark gradient.
(function () {
  const { W, H, clamp, lerp, inv, smooth, eo, ei, eio, co, cio, qo, sp, C, LW, LH, S, OX, OY, AXI, AR, PART, BB, toLogo, scr, fillPart, strokePart, contourAt } = K;

  // camera: pull back from the a to the final frame
  function camera(t) { const e = cio(t, 0.0, 2.7); return { z: lerp(1.24, 1, e), fx: lerp(scr(409, 655)[0], W / 2, e), fy: lerp(scr(409, 655)[1] - 40, 910, e) }; }
  const applyCam = (ctx, cm) => { ctx.translate(W / 2, 910); ctx.scale(cm.z, cm.z); ctx.translate(-cm.fx, -cm.fy); };

  // drafting dot grid (screen space, fixed)
  const DOTS = (() => { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.fillStyle = '#fff';
    for (let y = 24; y < H; y += 48) for (let i = 24; i < W; i += 48) { x.beginPath(); x.arc(i, y, 1.5, 0, Math.PI * 2); x.fill(); } return c; })();

  // guides in logo space: [kind, value, start time]
  const GUIDES = [['h', 1032, -0.12], ['h', 278, -0.04], ['h', 0, 0.06], ['v', 0, 0.02], ['v', 818, 0.1], ['v', 889, 0.15], ['v', 1733, 0.2], ['v', 1806, 0.24], ['v', 1998, 0.28], ['h', 1099, 1.42], ['h', 1390, 1.48]];
  const P0 = [1010, 1032], P1 = [1606.5, 278], ANG = Math.atan2(P1[1] - P0[1], P1[0] - P0[0]);
  function guides(ctx, t, cm) {
    const out = (g) => (g[1] > 1050 ? ei(t, 2.05, 0.35) : ei(t, 1.42, 0.38));
    ctx.save(); ctx.lineWidth = 1.8 / (S * cm.z); ctx.strokeStyle = 'rgba(255,255,255,0.42)';
    GUIDES.forEach((g) => {
      const u = eo(t, g[2], 0.55), o = out(g); if (u <= 0 || o >= 1) return;
      ctx.globalAlpha = 1 - o; ctx.beginPath();
      let tip;
      if (g[0] === 'h') { const x0 = -1300, x1 = lerp(x0, 3300, u); ctx.moveTo(lerp(x0, x1, o), g[1]); ctx.lineTo(x1, g[1]); tip = [x1, g[1]]; }
      else { const y0 = -1500, y1 = lerp(y0, 2800, u); ctx.moveTo(g[1], lerp(y0, y1, o)); ctx.lineTo(g[1], y1); tip = [g[1], y1]; }
      ctx.stroke();
      if (u < 0.995) { const r = 26 / (S * cm.z); K.glow(ctx, tip[0], tip[1], r * 3, 'rgba(255,255,255,0.9)', 0.55 * (1 - u)); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(tip[0], tip[1], r * 0.16, 0, Math.PI * 2); ctx.fill(); }
    });
    // the a's construction circle with its centre cross
    const cu = eo(t, 0.2, 0.7), co2 = ei(t, 1.42, 0.38);
    if (cu > 0 && co2 < 1) {
      ctx.globalAlpha = 1 - co2; ctx.beginPath(); ctx.arc(409, 655, 398, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * cu * (1 - co2)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(379, 655); ctx.lineTo(439, 655); ctx.moveTo(409, 625); ctx.lineTo(409, 685); ctx.stroke();
    }
    // the axis of the x and its angle
    const au = eo(t, 0.42, 0.6), ao = ei(t, 1.42, 0.38);
    if (au > 0 && ao < 1) {
      ctx.globalAlpha = 1 - ao; const L0 = -700, L1 = lerp(L0, 1900, au), ux = Math.cos(ANG), uy = Math.sin(ANG);
      ctx.beginPath(); ctx.moveTo(P0[0] + ux * L0, P0[1] + uy * L0); ctx.lineTo(P0[0] + ux * L1, P0[1] + uy * L1); ctx.stroke();
      const ar = eo(t, 0.7, 0.45);
      ctx.strokeStyle = C.red; ctx.lineWidth = 2.6 / (S * cm.z); ctx.beginPath(); ctx.arc(P0[0], P0[1], 230, 0, ANG * ar, true); ctx.stroke();
      if (ar > 0.3) {
        ctx.save(); ctx.translate(P0[0] + 300 * Math.cos(ANG / 2), P0[1] + 300 * Math.sin(ANG / 2) + 14); ctx.scale(1 / (S * cm.z), 1 / (S * cm.z));
        ctx.globalAlpha = (1 - ao) * clamp((ar - 0.3) * 2.5); ctx.font = '600 20px IN'; ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillText('51.7°', 0, 0); ctx.restore();
      }
    }
    ctx.restore();
  }

  // outline tracing with anchor heads; fill flood from the bottom with a bright front
  const TRACE = { a: [0.34, 0.78], x_body: [0.42, 0.72], x_arm: [0.62, 0.42], i_stem: [0.54, 0.5], i_dot: [0.8, 0.34], ar_alef1: [1.5, 0.34], ar_lam_ain_ra: [1.55, 0.5], ar_alef2: [1.64, 0.3], ar_qaf: [1.7, 0.46] };
  const FILL = { a: 1.16, x_body: 1.22, x_arm: 1.3, i_stem: 1.25, i_dot: 1.36, ar_alef1: 1.98, ar_lam_ain_ra: 2.03, ar_alef2: 2.09, ar_qaf: 2.13 };
  function part(ctx, t, k, cm) {
    const [t0, d] = TRACE[k], u = cio(t, t0, d), f = qo(t, FILL[k], 0.34), fade = 1 - inv(FILL[k] + 0.12, FILL[k] + 0.42, t), b = BB[k];
    if (u <= 0) return;
    if (f > 0) {
      const top = lerp(b.y1 + 20, b.y0 - 30, f);
      ctx.save(); ctx.beginPath(); ctx.rect(b.x0 - 40, top, b.w + 80, b.y1 - top + 60); ctx.clip(); fillPart(ctx, k, C.white); ctx.restore();
      if (f < 1) { ctx.save(); ctx.clip(PART[k], 'evenodd'); ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.filter = 'blur(6px)'; ctx.fillRect(b.x0 - 40, top - 16, b.w + 80, 32); ctx.restore(); }
    }
    if (fade > 0) strokePart(ctx, k, u, 2.7 / cm.z, '#ffffff', 0.95 * fade);
    // anchor heads riding the tracing front
    if (u > 0 && u < 1) {
      K.CONT[k].forEach((c, ci) => {
        const [x, y, a] = contourAt(k, ci, u), hs = 1 / (S * cm.z), red = k === 'x_body' && ci === 0;
        ctx.save(); ctx.translate(x, y); ctx.scale(hs, hs); ctx.rotate(a);
        ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(22, 0); ctx.stroke();
        ctx.fillStyle = '#fff'; [-22, 22].forEach((h) => { ctx.beginPath(); ctx.arc(h, 0, 2.6, 0, Math.PI * 2); ctx.fill(); });
        ctx.rotate(-a); if (red) { ctx.fillStyle = C.red; ctx.fillRect(-6, -6, 12, 12); } else { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.6; ctx.strokeRect(-5, -5, 10, 10); }
        ctx.restore();
      });
    }
  }

  function scene(ctx, t) {
    K.bgDark(ctx);
    const ga = smooth(inv(-0.25, 0.3, t)) * (1 - smooth(inv(2.1, 2.9, t)));
    if (ga > 0) { ctx.save(); ctx.globalAlpha = 0.075 * ga; ctx.drawImage(DOTS, 0, 0); ctx.restore(); }
    const cm = camera(t);
    ctx.save(); applyCam(ctx, cm); toLogo(ctx);
    guides(ctx, t, cm);
    // a soft bloom when «axi» is solid
    const bl = Math.exp(-Math.max(0, t - 1.62) / 0.35) * (t > 1.52 ? clamp((t - 1.52) / 0.1) : 0);
    if (bl > 0.01) { ctx.save(); ctx.globalAlpha = 0.22 * bl; ctx.filter = 'blur(40px)'; ctx.fillStyle = '#fff'; ctx.fill(K.AXI_ALL, 'evenodd'); ctx.restore(); }
    AXI.concat(AR).forEach((k) => part(ctx, t, k, cm));
    ctx.restore();
    ctx.save(); applyCam(ctx, cm); K.edgeGlint(ctx, t, 2.62, 0.6, { a: 0.9, blur: 9, width: 440 }); ctx.restore();
  }

  window.FILM = {
    duration: 4,
    blur(t) { if (t < 2.4) return 4; if (t < 3.3) return 3; return 1; },
    draw(ctx, t) { scene(ctx, t); K.grain(ctx, t, 0.05, t > 3.3); },
  };
})();
