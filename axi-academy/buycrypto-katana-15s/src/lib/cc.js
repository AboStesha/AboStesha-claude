// cc.js — the shared kit for the Axi Iraq «Buy Crypto» campaign (five 9:16 films).
// Builds on kit.js (type, logo, easing) and glass.js (frosted panels, stages, cuts).
//  • Crypto is shown as material objects in the brand's palette: silver/white 3D coins with an engraved ticker
//    (BTC, ETH …), never coin brand logos. One red element at most per object.
//  • The app screens are stylised Arabic mock-ups of buying crypto in the Axi app, not copies of it.
//  • Facts on screen come from Axi's Buy Crypto page and launch release (see ../SCRIPTS.md); prices are illustrative.
(function (G) {
  'use strict';
  const K = G.K, GL = G.GL;
  const { W, H, clamp, lerp, inv, smooth, eo, co, sp, expoOut, cubicInOut, ar, arW, lat, latW, rr, disc, noise } = K;
  const { AX, glass, shape, stage, rgba } = GL;
  const CC = {};
  const TAU = Math.PI * 2;
  CC.grid = (bpm) => (b) => (b * 60) / bpm;
  CC.INK = '#090A0D';
  CC.fmt = (v, d = 2) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

  // ---------------- stages ----------------
  // dark: the brand's tertiary gradient (#171819 → #0B0D0D) with cool light pillars
  CC.darkStage = (ctx, t, o = {}) => stage(ctx, t, {
    grad: [[0, '#1B1D20'], [1, '#0B0D0D']], dx: o.dx || 0, alpha: o.alpha,
    pillars: o.pillars || [
      { x: 120, y: -200, w: 300, h: 1900, c: '#95A8B1', a: 0.42, sp: 0.4, amp: 50, ph: 0 },
      { x: 980, y: 100, w: 260, h: 1900, c: '#FFFFFF', a: 0.16, sp: 0.3, amp: 60, ph: 2 },
      { x: 560, y: 1250, w: 520, h: 900, c: '#607880', a: 0.45, sp: 0.5, amp: 160, ph: 4 },
    ],
  });
  // steel: primary gradient, light top → steel bottom (vertical only)
  CC.steelStage = (ctx, t, o = {}) => stage(ctx, t, {
    grad: o.grad || [[0, '#EEF0F1'], [0.55, '#B5C8CD'], [1, '#607880']], blend: 'source-over', soft: 20, dx: o.dx || 0,
    pillars: o.pillars || [
      { x: 170, y: -200, w: 360, h: 2000, c: '#FFFFFF', a: 0.55, sp: 0.3, amp: 60, ph: 0 },
      { x: 940, y: -100, w: 280, h: 2000, c: '#FFFFFF', a: 0.35, sp: 0.25, amp: 70, ph: 2 },
      { x: 540, y: 1350, w: 620, h: 900, c: '#95A8B1', a: 0.35, sp: 0.4, amp: 140, ph: 4 },
    ],
  });
  // SaaS: off-white with a faint grid and a soft steel glow at the bottom
  CC.saasStage = (ctx, t, o = {}) => {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#F9F9F9'); g.addColorStop(0.7, '#EEF0F1'); g.addColorStop(1, '#C9D6DA');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const gs = o.grid || 90, ox = ((o.dx || 0) % gs + gs) % gs, oy = ((o.dy || 0) % gs + gs) % gs;
    ctx.strokeStyle = 'rgba(57,59,64,0.055)'; ctx.lineWidth = 1.5; ctx.beginPath();
    for (let x = ox - gs; x < W + gs; x += gs) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let y = oy - gs; y < H + gs; y += gs) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke(); ctx.restore();
    stage(ctx, t, { grad: [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0)']], blend: 'source-over', soft: 22, pillars: o.pillars || [
      { x: 540, y: 1500, w: 900, h: 700, c: '#B5C8CD', a: 0.45, sp: 0.3, amp: 120, ph: 1 },
      { x: 120, y: -300, w: 300, h: 1600, c: '#FFFFFF', a: 0.6, sp: 0.25, amp: 40, ph: 3 },
    ] });
  };

  // ---------------- 3D coin (silver/white material, engraved ticker) ----------------
  // o.a spin about the vertical axis (rad), o.sq vertical squash (tilt), o.ticker, o.light glint 0..1, o.red ring,
  // o.shadow alpha, o.alpha, o.thick
  CC.coin = (ctx, cx, cy, r, o = {}) => {
    const alpha = o.alpha == null ? 1 : o.alpha; if (alpha <= 0.003 || r < 1) return;
    const a = o.a || 0, c = Math.cos(a), s = Math.sin(a), ac = Math.abs(c), front = c >= 0;
    const ry = r * (o.sq == null ? 1 : o.sq), rx = Math.max(r * ac, 0.6), T = r * (o.thick || 0.16), dx = T * s;
    ctx.save(); ctx.globalAlpha *= alpha;
    if (o.shadow) {
      ctx.save(); ctx.filter = `blur(${Math.round(r * 0.22)}px)`; ctx.fillStyle = `rgba(0,0,0,${o.shadow})`;
      ctx.beginPath(); ctx.ellipse(cx, cy + ry + r * (o.sy == null ? 0.28 : o.sy), Math.max(rx, Math.abs(dx)) * 0.9 + r * 0.12, r * 0.14, 0, 0, TAU); ctx.fill(); ctx.restore();
    }
    // the edge: a stack of ellipses between the back and the front face
    const eg = ctx.createLinearGradient(0, cy - ry, 0, cy + ry);
    eg.addColorStop(0, '#F1F3F4'); eg.addColorStop(0.42, '#9AA2A8'); eg.addColorStop(0.5, '#C9CFD3'); eg.addColorStop(0.62, '#7D868C'); eg.addColorStop(1, '#4E565C');
    ctx.fillStyle = eg; const N = Math.max(2, Math.ceil(Math.abs(dx) / 1.2));
    for (let k = 0; k <= N; k++) { ctx.beginPath(); ctx.ellipse(cx - dx / 2 + dx * (k / N), cy, rx, ry, 0, 0, TAU); ctx.fill(); }
    // reeding on the visible edge
    if (Math.abs(dx) > 3) {
      ctx.save(); ctx.beginPath(); ctx.rect(Math.min(cx - dx / 2 - rx, cx + dx / 2 - rx) - 2, cy - ry - 2, rx * 2 + Math.abs(dx) + 4, ry * 2 + 4); ctx.clip();
      ctx.beginPath(); ctx.ellipse(cx + dx / 2, cy, rx, ry, 0, 0, TAU); ctx.rect(cx + 2000, cy - 2000, -4000, 4000); ctx.clip('evenodd');
      ctx.strokeStyle = 'rgba(40,46,52,0.35)'; ctx.lineWidth = Math.max(1, r * 0.012);
      for (let k = 0; k < 64; k++) { const th = (k / 64) * TAU, yy = cy + Math.sin(th) * ry, xx = Math.cos(th) * rx; ctx.beginPath(); ctx.moveTo(cx - dx / 2 + xx, yy); ctx.lineTo(cx + dx / 2 + xx, yy); ctx.stroke(); }
      ctx.restore();
    }
    // the face
    const fx = cx + dx / 2;
    const fg = ctx.createLinearGradient(0, cy - ry, 0, cy + ry);
    fg.addColorStop(0, '#FFFFFF'); fg.addColorStop(0.48, '#E1E5E8'); fg.addColorStop(1, '#A3ABB1');
    ctx.beginPath(); ctx.ellipse(fx, cy, rx, ry, 0, 0, TAU); ctx.fillStyle = fg; ctx.fill();
    ctx.fillStyle = `rgba(36,40,46,${0.38 * (1 - ac)})`; ctx.fill();
    ctx.save(); ctx.translate(fx, cy); ctx.scale(rx / r, ry / r);
    ctx.lineWidth = r * 0.04; ctx.strokeStyle = 'rgba(110,118,124,0.85)'; ctx.beginPath(); ctx.arc(0, r * 0.012, r * 0.8, 0, TAU); ctx.stroke();
    ctx.lineWidth = r * 0.018; ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.beginPath(); ctx.arc(0, -r * 0.012, r * 0.8, 0, TAU); ctx.stroke();
    if (o.red) { ctx.lineWidth = r * 0.03; ctx.strokeStyle = AX.red; ctx.beginPath(); ctx.arc(0, 0, r * 0.9, 0, TAU); ctx.stroke(); }
    if (front) {
      const tk = o.ticker || 'BTC', size = r * (tk.length > 3 ? 0.34 : 0.42);
      ctx.font = K.latFont(800, Math.round(size)); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'ltr';
      ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.fillText(tk, 0, -r * 0.018 + size * 0.04);
      ctx.fillStyle = 'rgba(60,66,72,0.75)'; ctx.fillText(tk, 0, r * 0.02 + size * 0.04);
      ctx.fillStyle = '#AEB5BA'; ctx.fillText(tk, 0, size * 0.04);
    } else {
      ctx.strokeStyle = 'rgba(110,118,124,0.55)'; ctx.lineWidth = r * 0.02;
      [0.6, 0.42, 0.24].forEach((k) => { ctx.beginPath(); ctx.arc(0, 0, r * k, 0, TAU); ctx.stroke(); });
    }
    ctx.restore();
    // a soft light sweep across the face
    const gl = o.light == null ? (0.5 + 0.5 * Math.sin(a * 1.3 + 0.8)) : o.light;
    ctx.save(); ctx.beginPath(); ctx.ellipse(fx, cy, rx, ry, 0, 0, TAU); ctx.clip();
    const bx = lerp(fx - rx * 1.6, fx + rx * 1.6, gl), g = ctx.createLinearGradient(bx - r * 0.5, cy - ry, bx + r * 0.5, cy + ry);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(fx - rx - 4, cy - ry - 4, rx * 2 + 8, ry * 2 + 8);
    ctx.restore();
    ctx.restore();
  };

  // ---------------- line icons ----------------
  CC.icon = (ctx, name, cx, cy, s, color = CC.INK, lw) => {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s / 48, s / 48); ctx.strokeStyle = color; ctx.fillStyle = color;
    ctx.lineWidth = lw || 3.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    const R = (x, y, w, h, r) => { ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
    switch (name) {
      case 'card': R(-20, -14, 40, 28, 5); ctx.moveTo(-20, -5); ctx.lineTo(20, -5); ctx.moveTo(-13, 7); ctx.lineTo(-4, 7); break;
      case 'bank': ctx.moveTo(-21, -8); ctx.lineTo(0, -20); ctx.lineTo(21, -8); ctx.closePath(); [-14, -5, 5, 14].forEach((x) => { ctx.moveTo(x, -4); ctx.lineTo(x, 12); }); ctx.moveTo(-22, 17); ctx.lineTo(22, 17); break;
      case 'wallet': R(-20, -14, 40, 30, 6); ctx.moveTo(-20, -6); ctx.lineTo(14, -6); ctx.moveTo(20, -1); ctx.lineTo(8, -1); ctx.arcTo(4, -1, 4, 5, 5); ctx.arcTo(4, 10, 9, 10, 5); ctx.lineTo(20, 10); break;
      case 'lock': R(-15, -4, 30, 24, 5); ctx.moveTo(-9, -4); ctx.lineTo(-9, -11); ctx.arc(0, -11, 9, Math.PI, 0); ctx.lineTo(9, -4); ctx.moveTo(0, 5); ctx.lineTo(0, 11); break;
      case 'clock': ctx.arc(0, 0, 19, 0, TAU); ctx.moveTo(0, -10); ctx.lineTo(0, 0); ctx.lineTo(8, 6); break;
      case 'check': ctx.moveTo(-14, 1); ctx.lineTo(-4, 11); ctx.lineTo(15, -10); break;
      case 'chart': ctx.moveTo(-20, 14); ctx.lineTo(-8, 1); ctx.lineTo(1, 8); ctx.lineTo(19, -12); ctx.moveTo(9, -12); ctx.lineTo(19, -12); ctx.lineTo(19, -2); break;
      case 'candles': [[-13, -6, 14], [0, -14, 6], [13, -2, 16]].forEach(([x, y0, y1]) => { ctx.moveTo(x, y0 - 6); ctx.lineTo(x, y1 + 6); R(x - 4.5, y0, 9, y1 - y0, 2); }); break;
      case 'infinity': ctx.moveTo(0, 0); ctx.bezierCurveTo(8, -13, 22, -13, 22, 0); ctx.bezierCurveTo(22, 13, 8, 13, 0, 0); ctx.bezierCurveTo(-8, -13, -22, -13, -22, 0); ctx.bezierCurveTo(-22, 13, -8, 13, 0, 0); break;
      case 'coin': ctx.arc(0, 0, 19, 0, TAU); ctx.moveTo(11, 0); ctx.arc(0, 0, 11, 0, TAU); break;
      case 'search': ctx.arc(-4, -4, 13, 0, TAU); ctx.moveTo(6, 6); ctx.lineTo(17, 17); break;
      case 'globe': ctx.arc(0, 0, 19, 0, TAU); ctx.moveTo(-19, 0); ctx.lineTo(19, 0); ctx.ellipse(0, 0, 8, 19, 0, 0, TAU); break;
      case 'phone': R(-12, -20, 24, 40, 5); ctx.moveTo(-4, -15); ctx.lineTo(4, -15); break;
      case 'desktop': R(-20, -15, 40, 26, 4); ctx.moveTo(-6, 17); ctx.lineTo(6, 17); ctx.moveTo(0, 11); ctx.lineTo(0, 17); break;
      case 'book': [-12, -4, 4, 12].forEach((y, i) => { ctx.moveTo(-18, y); ctx.lineTo(-18 + [30, 22, 34, 16][i], y); }); break;
      case 'shield': ctx.moveTo(0, -20); ctx.lineTo(17, -13); ctx.lineTo(17, 0); ctx.bezierCurveTo(17, 11, 9, 17, 0, 21); ctx.bezierCurveTo(-9, 17, -17, 11, -17, 0); ctx.lineTo(-17, -13); ctx.closePath(); ctx.moveTo(-7, 0); ctx.lineTo(-2, 6); ctx.lineTo(8, -5); break;
      case 'chat': R(-20, -16, 40, 28, 9); ctx.moveTo(-8, 12); ctx.lineTo(-12, 20); ctx.lineTo(-1, 12); break;
      case 'up': ctx.moveTo(0, 16); ctx.lineTo(0, -16); ctx.moveTo(-11, -5); ctx.lineTo(0, -16); ctx.lineTo(11, -5); break;
      case 'down': ctx.moveTo(0, -16); ctx.lineTo(0, 16); ctx.moveTo(-11, 5); ctx.lineTo(0, 16); ctx.lineTo(11, 5); break;
      case 'plus': ctx.moveTo(0, -16); ctx.lineTo(0, 16); ctx.moveTo(-16, 0); ctx.lineTo(16, 0); break;
      case 'swap': ctx.moveTo(-17, -7); ctx.lineTo(15, -7); ctx.moveTo(8, -14); ctx.lineTo(15, -7); ctx.lineTo(8, 0); ctx.moveTo(17, 8); ctx.lineTo(-15, 8); ctx.moveTo(-8, 1); ctx.lineTo(-15, 8); ctx.lineTo(-8, 15); break;
      case 'user': ctx.arc(0, -8, 9, 0, TAU); ctx.moveTo(-17, 19); ctx.bezierCurveTo(-15, 6, 15, 6, 17, 19); break;
      case 'bell': ctx.moveTo(-14, 10); ctx.lineTo(-11, 5); ctx.lineTo(-11, -4); ctx.bezierCurveTo(-11, -18, 11, -18, 11, -4); ctx.lineTo(11, 5); ctx.lineTo(14, 10); ctx.closePath(); ctx.moveTo(-4, 15); ctx.lineTo(4, 15); break;
      default: break;
    }
    ctx.stroke(); ctx.restore();
  };

  // ---------------- small pieces ----------------
  // a glass chip with an Arabic label and an optional icon on its right (RTL)
  CC.chip = (ctx, cx, cy, text, o = {}) => {
    const size = o.size || 36, padX = size * 0.75, ic = o.icon ? size * 1.15 : 0, gap = o.icon ? size * 0.45 : 0;
    const tw = o.lat ? latW(ctx, text, { w: o.w || 600, size }) : arW(ctx, text, { w: o.w || 600, size });
    const w = tw + padX * 2 + ic + gap, h = size * 2.1, x = cx - w / 2, y = cy - h / 2, a = o.alpha == null ? 1 : o.alpha;
    if (a <= 0) return w;
    if (o.solid) { ctx.save(); ctx.globalAlpha *= a; rr(ctx, x, y, w, h, h / 2); ctx.fillStyle = o.solid; ctx.fill(); ctx.restore(); }
    else glass(ctx, x, y, w, h, { tone: o.tone || 'white', r: h / 2, alpha: a, lift: o.lift == null ? 0.5 : o.lift, glint: o.glint });
    ctx.save(); ctx.globalAlpha *= a;
    const color = o.color || CC.INK;
    if (o.icon) CC.icon(ctx, o.icon, x + w - padX - ic / 2, cy, ic, o.iconColor || color, o.ilw);
    const tx = x + w - padX - ic - gap;
    if (o.lat) lat(ctx, text, tx, cy + size * 0.36, { w: o.w || 600, size, color, align: 'right' });
    else ar(ctx, text, tx, cy + size * 0.36, { w: o.w || 600, size, color, align: 'right' });
    ctx.restore(); return w;
  };
  // slam: a word or line that lands big (scale from o.from) — Arabic by default, o.lat for Latin, o.parts for mixLine
  CC.slam = (ctx, text, cx, y, t, t0, o = {}) => {
    const u = expoOut(clamp((t - t0) / (o.d || 0.3))); if (u <= 0) return;
    const k = lerp(o.from || 1.7, 1, u), a = clamp((t - t0) / 0.05) * (o.alpha == null ? 1 : o.alpha), size = o.size || 120;
    ctx.save(); ctx.translate(cx, y - size * 0.35); ctx.scale(k, k); ctx.translate(-cx, -(y - size * 0.35));
    if (o.shadow) { ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 8; }
    if (o.parts) K.mixLine(ctx, o.parts, cx, y, { size, lsize: o.lsize || size, w: o.w || 700, lw: o.lw || 800, color: o.color || '#FFFFFF', alpha: a, gap: o.gap });
    else if (o.lat) lat(ctx, text, cx, y, { w: o.w || 800, size, color: o.color || '#FFFFFF', alpha: a, track: o.track });
    else ar(ctx, text, cx, y, { w: o.w || 700, size, color: o.color || '#FFFFFF', alpha: a });
    ctx.restore();
  };
  // a tap: finger dot pressing, with a ripple
  CC.finger = (ctx, x, y, t, tc, o = {}) => {
    const d = t - tc; if (d < -0.35 || d > 0.55) return;
    const a = clamp((d + 0.35) / 0.15) * (1 - clamp((d - 0.35) / 0.2)), press = d > -0.06 && d < 0.14 ? Math.sin(Math.PI * clamp((d + 0.06) / 0.2)) : 0;
    ctx.save(); ctx.globalAlpha *= a;
    disc(ctx, x, y, 34 * (1 - 0.18 * press), o.dark ? 'rgba(255,255,255,0.32)' : 'rgba(9,10,13,0.22)');
    ctx.lineWidth = 3; ctx.strokeStyle = o.dark ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.95)'; ctx.beginPath(); ctx.arc(x, y, 34 * (1 - 0.18 * press), 0, TAU); ctx.stroke();
    ctx.restore();
    K.ripple(ctx, x, y, t, tc, { r0: 12, r1: 80, w: 3, n: 2, dur: 0.45, a: 0.7, color: o.ring || (o.dark ? '#FFFFFF' : '#393B40') });
  };
  // illustrative price path (deterministic), values 0..1
  CC.path = (n, seed = 1, drift = 0.5) => { const out = []; let v = 0.5; for (let i = 0; i < n; i++) { v += (noise(i * 0.35, seed) * 0.11) + (drift - 0.5) * 0.02; v = clamp(v, 0.06, 0.94); out.push(v); } return out; };
  CC.spark = (ctx, x, y, w, h, pts, o = {}) => {
    const n = pts.length, prog = o.prog == null ? 1 : clamp(o.prog); if (prog <= 0) return;
    const m = Math.max(2, Math.floor(n * prog));
    ctx.save(); ctx.beginPath();
    for (let i = 0; i < m; i++) { const px = x + (i / (n - 1)) * w, py = y + h - pts[i] * h; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    if (o.fill) {
      const lx = x + ((m - 1) / (n - 1)) * w; ctx.save(); ctx.lineTo(lx, y + h); ctx.lineTo(x, y + h); ctx.closePath();
      const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, rgba(o.color || AX.mint, o.fill)); g.addColorStop(1, rgba(o.color || AX.mint, 0)); ctx.fillStyle = g; ctx.fill(); ctx.restore();
      ctx.beginPath(); for (let i = 0; i < m; i++) { const px = x + (i / (n - 1)) * w, py = y + h - pts[i] * h; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    }
    ctx.strokeStyle = o.color || AX.mint; ctx.lineWidth = o.lw || 3; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();
    if (o.head) { const i = m - 1, px = x + (i / (n - 1)) * w, py = y + h - pts[i] * h; disc(ctx, px, py, (o.lw || 3) * 2.2, o.color || AX.mint); disc(ctx, px, py, (o.lw || 3) * 5, rgba(o.color || AX.mint, 0.18)); }
    ctx.restore();
  };

  // ---------------- phone + Axi app mock-up (Arabic, light theme) ----------------
  // draws the device and calls screen(ctx, S) inside the clipped screen rect S = {x, y, w, h}
  CC.phone = (ctx, x, y, w, h, screen, o = {}) => {
    const r = w * 0.14, b = w * 0.032, S = { x: x + b, y: y + b, w: w - b * 2, h: h - b * 2 };
    ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    // shadow
    ctx.save(); ctx.filter = 'blur(40px)'; ctx.fillStyle = `rgba(9,10,13,${o.shadow == null ? 0.32 : o.shadow})`; rr(ctx, x + w * 0.06, y + 60, w * 0.88, h * 0.98, r); ctx.fill(); ctx.restore();
    // body
    rr(ctx, x, y, w, h, r); const bg = ctx.createLinearGradient(0, y, 0, y + h); bg.addColorStop(0, '#3A3D42'); bg.addColorStop(0.5, '#1B1D20'); bg.addColorStop(1, '#2A2C30'); ctx.fillStyle = bg; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.stroke();
    rr(ctx, x + 4, y + 4, w - 8, h - 8, r - 4); ctx.fillStyle = '#060708'; ctx.fill();
    // screen
    ctx.save(); rr(ctx, S.x, S.y, S.w, S.h, r - b); ctx.clip(); screen(ctx, S); ctx.restore();
    // island
    rr(ctx, x + w / 2 - w * 0.15, S.y + 18, w * 0.3, 44, 22); ctx.fillStyle = '#060708'; ctx.fill();
    // reflection
    ctx.save(); rr(ctx, S.x, S.y, S.w, S.h, r - b); ctx.clip();
    const rg = ctx.createLinearGradient(x, y, x + w, y + h * 0.5); rg.addColorStop(0, 'rgba(255,255,255,0.10)'); rg.addColorStop(0.35, 'rgba(255,255,255,0.0)'); ctx.fillStyle = rg; ctx.fillRect(S.x, S.y, S.w, S.h);
    ctx.restore();
    ctx.restore();
    return S;
  };
  const UI = {};
  CC.UI = UI;
  UI.bg = '#F6F7F8'; UI.line = 'rgba(9,10,13,0.08)'; UI.sub = '#626466'; UI.ink = CC.INK;
  UI.status = (ctx, S, dark) => {
    const c = dark ? '#FFFFFF' : CC.INK;
    lat(ctx, '9:41', S.x + 56, S.y + 56, { w: 600, size: 26, color: c, align: 'left' });
    ctx.save(); ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 2; rr(ctx, S.x + S.w - 92, S.y + 38, 46, 22, 6); ctx.stroke(); rr(ctx, S.x + S.w - 88, S.y + 42, 32, 14, 3); ctx.fill(); ctx.restore();
  };
  // header: title (right), optional back arrow, small Axi Iraq logo (left)
  UI.header = (ctx, S, title, o = {}) => {
    const y = S.y + 150;
    if (o.back) { ctx.save(); ctx.strokeStyle = CC.INK; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(S.x + S.w - 50, y - 24); ctx.lineTo(S.x + S.w - 38, y - 12); ctx.lineTo(S.x + S.w - 50, y); ctx.stroke(); ctx.restore(); }
    ar(ctx, title, S.x + S.w - (o.back ? 72 : 40), y, { w: 700, size: o.size || 40, color: CC.INK, align: 'right' });
    if (o.logo !== false) K.logoIQ(ctx, S.x + 74, y - 12, 92, { color: CC.INK });
  };
  UI.card = (ctx, x, y, w, h, o = {}) => { ctx.save(); ctx.shadowColor = 'rgba(9,10,13,0.08)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 6; rr(ctx, x, y, w, h, o.r || 26); ctx.fillStyle = o.fill || '#FFFFFF'; ctx.fill(); ctx.restore(); if (o.stroke) { rr(ctx, x, y, w, h, o.r || 26); ctx.lineWidth = o.lw || 3; ctx.strokeStyle = o.stroke; ctx.stroke(); } };
  UI.button = (ctx, x, y, w, h, label, o = {}) => {
    const p = o.press || 0, s = 1 - 0.05 * p;
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(s, s); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = o.fill || AX.red; ctx.fill();
    if (o.glow) { ctx.shadowColor = rgba(AX.red, 0.6); ctx.shadowBlur = 30 * o.glow; ctx.fill(); }
    ar(ctx, label, 0, h * 0.16, { w: 700, size: o.size || 34, color: o.color || '#FFFFFF' });
    ctx.restore();
  };
  // a market row: coin disc (ticker initials), name (right), price + change (left), optional sparkline
  UI.coinRow = (ctx, x, y, w, row, o = {}) => {
    const h = o.h || 104, cy = y + h / 2;
    if (o.hi) { rr(ctx, x - 12, y + 4, w + 24, h - 8, 20); ctx.fillStyle = rgba('#E4002E', 0.06 * o.hi); ctx.fill(); }
    CC.coin(ctx, x + w - 40, cy, 34, { ticker: row.tk.length > 3 ? row.tk.slice(0, 4) : row.tk, light: 0.35 });
    lat(ctx, row.tk, x + w - 92, cy - 4, { w: 700, size: 30, color: CC.INK, align: 'right' });
    lat(ctx, row.name, x + w - 92, cy + 32, { w: 400, size: 22, color: UI.sub, align: 'right' });
    lat(ctx, '$' + row.p, x, cy - 4, { w: 700, size: 28, color: CC.INK, align: 'left' });
    // change as a pill: ink on mint for gains, white on red for losses (the brand's approved pairs)
    const up = row.c >= 0, ct = (up ? '+' : '−') + Math.abs(row.c).toFixed(2) + '%', cw = latW(ctx, ct, { w: 600, size: 21 }) + 22;
    rr(ctx, x, cy + 12, cw, 32, 16); ctx.fillStyle = up ? AX.mint : AX.red; ctx.fill();
    lat(ctx, ct, x + cw / 2, cy + 35, { w: 600, size: 21, color: up ? CC.INK : '#FFFFFF' });
    if (o.spark !== false) CC.spark(ctx, x + w * 0.36, cy - 22, w * 0.2, 44, CC.path(24, row.seed || 3, up ? 0.75 : 0.25), { color: up ? AX.mint : AX.red, lw: 3 });
    ctx.fillStyle = UI.line; ctx.fillRect(x, y + h - 1, w, 1.5);
  };
  // an amount readout with a blinking caret
  UI.amount = (ctx, cx, y, s, o = {}) => {
    const size = o.size || 96, wd = latW(ctx, s, { w: 700, size });
    lat(ctx, s, cx, y, { w: 700, size, color: CC.INK });
    if (o.caret) { ctx.fillStyle = AX.red; ctx.fillRect(cx + wd / 2 + 8, y - size * 0.78, 5, size * 0.86); }
  };
  UI.keypad = (ctx, x, y, w, h, pressed, o = {}) => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'], cw = w / 3, ch = h / 4;
    keys.forEach((k, i) => {
      const cx = x + (i % 3) * cw + cw / 2, cy = y + Math.floor(i / 3) * ch + ch / 2;
      if (pressed === k) { disc(ctx, cx, cy, Math.min(cw, ch) * 0.42, 'rgba(9,10,13,0.08)'); }
      lat(ctx, k, cx, cy + 14, { w: 500, size: 40, color: CC.INK });
    });
  };
  UI.toast = (ctx, x, y, w, text, u, o = {}) => {
    if (u <= 0) return; const h = 96;
    ctx.save(); ctx.globalAlpha *= clamp(u); ctx.translate(0, (1 - u) * -40);
    ctx.shadowColor = 'rgba(9,10,13,0.18)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; rr(ctx, x, y, w, h, 24); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.shadowColor = 'transparent';
    disc(ctx, x + w - 52, y + h / 2, 24, o.color || AX.mint); CC.icon(ctx, 'check', x + w - 52, y + h / 2, 30, CC.INK, 5);
    ar(ctx, text, x + w - 94, y + h / 2 + 12, { w: 600, size: 30, color: CC.INK, align: 'right' });
    ctx.restore();
  };
  UI.tabBar = (ctx, S, active) => {
    const y = S.y + S.h - 130, tabs = [['الرئيسية', 'chart'], ['الأسواق', 'candles'], ['المحفظة', 'wallet'], ['الحساب', 'user']];
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(S.x, y, S.w, 130); ctx.fillStyle = UI.line; ctx.fillRect(S.x, y, S.w, 1.5);
    tabs.forEach(([lb, ic], i) => {
      const cx = S.x + S.w - (i + 0.5) * (S.w / 4), on = i === active, c = on ? AX.red : '#939699';
      CC.icon(ctx, ic, cx, y + 44, 40, c, 3.4); ar(ctx, lb, cx, y + 98, { w: on ? 600 : 400, size: 20, color: c });
    });
  };

  // ---------------- presenter window (film 5) ----------------
  // the glass frame around a person filmed later; mode 'preview' shows a studio-grey stand-in, 'green' a key colour
  CC.presWin = (ctx, x, y, w, h, t, o = {}) => {
    const fr = 16, r = 40, mode = o.mode || 'preview';
    glass(ctx, x - fr, y - fr, w + fr * 2, h + fr * 2, { tone: 'white', r: r + fr, lift: 1, glint: o.glint, refract: 6 });
    ctx.save(); rr(ctx, x, y, w, h, r); ctx.clip();
    if (mode === 'green') { ctx.fillStyle = '#00B140'; ctx.fillRect(x, y, w, h); }
    else {
      const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#D3D7DA'); g.addColorStop(1, '#8E979C'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
      const cx = x + w / 2, hy = y + h * 0.36; ctx.fillStyle = 'rgba(255,255,255,0.34)';
      ctx.beginPath(); ctx.arc(cx, hy, w * 0.17, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx - w * 0.38, y + h); ctx.bezierCurveTo(cx - w * 0.36, hy + w * 0.26, cx + w * 0.36, hy + w * 0.26, cx + w * 0.38, y + h); ctx.closePath(); ctx.fill();
      ar(ctx, 'مكان المقدّم', cx, y + h - 60, { w: 400, size: 26, color: 'rgba(9,10,13,0.45)' });
    }
    ctx.restore();
    ctx.save(); rr(ctx, x, y, w, h, r); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.stroke(); ctx.restore();
  };

  // ---------------- end card ----------------
  // logo sting (centred), red CTA pill, a short line, and the tagline «تداول بميزتك»
  CC.endCard = (ctx, t, t0, o = {}) => {
    const cy = o.cy || 760, dark = !!o.dark, ink = dark ? '#FFFFFF' : CC.INK;
    K.logoReveal(ctx, W / 2, cy, o.lw || 520, t, t0, { color: ink });
    if (o.cta) K.ctaPill(ctx, W / 2, cy + (o.pillDy || 330), t, t0 + 0.55, o.cta, { tb: o.tb, beat: o.beat, w: o.pw || 640, h: 124, size: 52 });
    const su = eo(t, t0 + 0.85, 0.45);
    if (su > 0 && (o.sub || o.subParts)) { ctx.save(); ctx.globalAlpha *= su; ctx.translate(0, (1 - su) * 20); if (o.subParts) K.mixLine(ctx, o.subParts, W / 2, cy + 480, { size: 40, lsize: 38, w: 400, lw: 600, color: dark ? 'rgba(255,255,255,0.86)' : '#393B40', gap: 12 }); else ar(ctx, o.sub, W / 2, cy + 480, { w: 400, size: 40, color: dark ? 'rgba(255,255,255,0.86)' : '#393B40' }); ctx.restore(); }
    ar(ctx, 'تداول بميزتك', W / 2, cy + 590, { w: 600, size: 44, color: o.tagColor || (dark ? 'rgba(255,255,255,0.7)' : '#626466'), alpha: eo(t, t0 + 1.2, 0.5) });
  };

  G.CC = CC;
})(window);
