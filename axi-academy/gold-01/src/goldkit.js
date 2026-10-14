// Gold series — objects: gold chains, ingots, coins, a balance scale, chat bubbles, pills, phone, price chip.
(function (G) {
  const A = G.AX, GL = G.GL, FX = G.FX;
  const { C, clamp, lerp, hexA, mixHex, txt, lat } = A;
  const P = GL.P;
  const GK = {};

  // ---------- gold chain hanging between two points (quadratic sag); links alternate face-on / edge-on ----------
  // o: link (px), th (stroke px), sag (px), reveal (0..1, from the right end — RTL), tone ('gold'|'silver')
  GK.chain = function (ctx, x0, y0, x1, y1, o = {}) {
    const L = o.link || 20, th = o.th || 4, sag = o.sag == null ? 120 : o.sag, rev = o.reveal == null ? 1 : o.reveal;
    const pt = (u) => [lerp(x0, x1, u), lerp(y0, y1, u) + sag * 4 * u * (1 - u)];
    let len = 0, prev = pt(0); const N = 200; const acc = [0];
    for (let i = 1; i <= N; i++) { const p = pt(i / N); len += Math.hypot(p[0] - prev[0], p[1] - prev[1]); acc.push(len); prev = p; }
    const n = Math.max(2, Math.floor(len / (L * 0.78)));
    const uAt = (d) => { let lo = 0, hi = N; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (acc[m] < d) lo = m; else hi = m; } return (lo + (d - acc[lo]) / Math.max(1e-6, acc[hi] - acc[lo])) / N; };
    const tone = o.tone === 'silver' ? ['#FFFFFF', '#D9DDE1', '#9AA2A8', '#6B7379'] : [P.gold0, P.gold1, P.gold2, P.gold3];
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let i = 0; i < n; i++) {
      if (i / n > rev) break; // reveal from the start (x0) — pass x0 = right end for RTL
      const u = uAt((i + 0.5) * len / n); const [x, y] = pt(u); const [xa, ya] = pt(Math.max(0, u - 0.01)), [xb, yb] = pt(Math.min(1, u + 0.01)); const an = Math.atan2(yb - ya, xb - xa);
      ctx.save(); ctx.translate(x, y); ctx.rotate(an);
      const g = ctx.createLinearGradient(0, -L * 0.4, 0, L * 0.4); g.addColorStop(0, tone[0]); g.addColorStop(0.35, tone[1]); g.addColorStop(0.7, tone[2]); g.addColorStop(1, tone[3]);
      ctx.strokeStyle = g; ctx.lineWidth = th;
      if (i % 2 === 0) { ctx.beginPath(); ctx.ellipse(0, 0, L * 0.5, L * 0.31, 0, 0, 6.283); ctx.stroke(); ctx.strokeStyle = hexA('#FFFFFF', 0.55); ctx.lineWidth = Math.max(1, th * 0.28); ctx.beginPath(); ctx.ellipse(0, 0, L * 0.5, L * 0.31, 0, 3.6, 4.9); ctx.stroke(); }
      else { ctx.beginPath(); ctx.moveTo(-L * 0.46, 0); ctx.lineTo(L * 0.46, 0); ctx.lineWidth = th * 1.25; ctx.stroke(); ctx.strokeStyle = hexA('#FFFFFF', 0.6); ctx.lineWidth = Math.max(1, th * 0.3); ctx.beginPath(); ctx.moveTo(-L * 0.36, -th * 0.25); ctx.lineTo(L * 0.2, -th * 0.25); ctx.stroke(); }
      ctx.restore();
    }
    ctx.restore();
    return pt;
  };

  // ---------- ingot (procedural): front face + top bevel, metallic vertical gradients ----------
  GK.ingot = function (ctx, x, y, w, h, o = {}) {
    const d = o.depth == null ? h * 0.32 : o.depth, inset = w * 0.12; const tone = o.tone || 'gold';
    const T = tone === 'silver' ? ['#F4F6F8', '#C9CED3', '#8E969C'] : tone === 'copper' ? ['#F6C9A8', '#C9835A', '#8C4F2E'] : [P.gold0, P.gold1, P.gold3];
    ctx.save();
    if (o.shadow !== false) { ctx.save(); ctx.shadowColor = 'rgba(30,24,10,0.25)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - inset, y); ctx.lineTo(x + inset, y); ctx.closePath(); ctx.fillStyle = T[2]; ctx.fill(); ctx.restore(); }
    // front
    let g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, T[1]); g.addColorStop(1, T[2]);
    ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - inset, y); ctx.lineTo(x + inset, y); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
    // top face
    g = ctx.createLinearGradient(0, y - d, 0, y); g.addColorStop(0, T[0]); g.addColorStop(1, T[1]);
    ctx.beginPath(); ctx.moveTo(x + inset, y); ctx.lineTo(x + w - inset, y); ctx.lineTo(x + w - inset * 1.6, y - d); ctx.lineTo(x + inset * 1.6, y - d); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
    // sheen band
    const sb = o.sheen == null ? 0.3 : o.sheen; ctx.save(); ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - inset, y); ctx.lineTo(x + inset, y); ctx.closePath(); ctx.clip();
    const sx = x + w * sb; const sg = ctx.createLinearGradient(sx - 60, 0, sx + 60, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.5, 'rgba(255,255,255,0.45)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = sg; ctx.fillRect(x, y - d, w, h + d); ctx.restore();
    if (o.label) { ctx.save(); ctx.globalAlpha *= 0.55; lat(ctx, o.label, x + w / 2, y + h * 0.62, { size: Math.round(h * 0.26), w: 700, color: tone === 'gold' ? P.goldInk : '#4B5257', align: 'center', track: 2 }); ctx.restore(); }
    ctx.restore();
  };

  // ---------- coin ----------
  GK.coin = function (ctx, x, y, r, o = {}) {
    ctx.save(); const g = ctx.createLinearGradient(0, y - r, 0, y + r); g.addColorStop(0, P.gold0); g.addColorStop(0.5, P.gold1); g.addColorStop(1, P.gold3);
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = r * 0.08; ctx.strokeStyle = P.gold3; ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, r * 0.78, 0, 6.283); ctx.strokeStyle = hexA('#FFFFFF', 0.45); ctx.lineWidth = r * 0.04; ctx.stroke();
    if (o.label) lat(ctx, o.label, x, y + r * 0.22, { size: Math.round(r * 0.62), w: 700, color: P.goldInk, align: 'center' });
    ctx.restore();
  };

  // ---------- balance scale: beam tilts by `tilt` (rad, + = right pan down) ----------
  GK.scale = function (ctx, x, y, s, tilt, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const ink = o.ink || C.ink;
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineCap = 'round'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(0, 260); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-90, 270); ctx.lineTo(90, 270); ctx.lineWidth = 10; ctx.stroke();
    ctx.save(); ctx.rotate(tilt); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-260, 0); ctx.lineTo(260, 0); ctx.stroke(); ctx.restore();
    const pan = (side) => { const ax = side * 260 * Math.cos(tilt), ay = side * 260 * Math.sin(tilt); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax - 80, ay + 150); ctx.moveTo(ax, ay); ctx.lineTo(ax + 80, ay + 150); ctx.stroke(); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ax - 100, ay + 150); ctx.quadraticCurveTo(ax, ay + 200, ax + 100, ay + 150); ctx.stroke(); return [ax, ay + 150]; };
    const L = pan(-1), R = pan(1); ctx.beginPath(); ctx.arc(0, -12, 12, 0, 6.283); ctx.fillStyle = C.red; ctx.fill();
    ctx.restore();
    return { L: [x + L[0] * s, y + L[1] * s], R: [x + R[0] * s, y + R[1] * s] };
  };

  // ---------- chat bubble (RTL) — side 'me' (right, ink) | 'them' (left, glass) | 'gold' ----------
  GK.bubble = function (ctx, lines, x, y, o = {}) {
    const size = o.size || 34, lh = size * 1.45, padX = size * 0.75, padY = size * 0.55; const ws = lines.map((s) => A.measure(ctx, s, size, o.w || 'R'));
    const bw = Math.max(...ws) + padX * 2, bh = lines.length * lh + padY * 2 - (lh - size * 1.1); const side = o.side || 'them';
    const bx = side === 'me' ? x - bw : x, by = y; const p = o.p == null ? 1 : o.p; if (p <= 0) return { w: bw, h: bh };
    ctx.save(); const ox = side === 'me' ? x : x; const k = Math.min(1.04, p); ctx.translate(ox, by + bh); ctx.scale(k, k); ctx.translate(-ox, -(by + bh)); ctx.globalAlpha *= clamp(p * 3);
    const r = Math.min(size * 0.9, bh / 2);
    if (side === 'me') { ctx.save(); ctx.shadowColor = 'rgba(10,12,16,0.18)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; A.roundRect(ctx, bx, by, bw, bh, [r, r, 6, r]); ctx.fillStyle = o.fill || C.ink; ctx.fill(); ctx.restore(); }
    else if (side === 'gold') { A.roundRect(ctx, bx, by, bw, bh, [r, r, r, 6]); ctx.fillStyle = GL.goldFlat(ctx, by, by + bh); ctx.fill(); }
    else GL.panel(ctx, bx, by, bw, bh, r, { tint: 'rgba(255,255,255,0.62)', shadow: 0.6 });
    const col = side === 'me' ? '#FFFFFF' : side === 'gold' ? '#2B2107' : C.ink;
    lines.forEach((s, i) => txt(ctx, s, bx + bw - padX, by + padY + size * 0.95 + i * lh, { size, w: o.w || 'R', color: (o.colors && o.colors[i]) || col }));
    ctx.restore(); return { w: bw, h: bh, x: bx, y: by };
  };

  // ---------- pills ----------
  GK.pill = function (ctx, label, cx, cy, o = {}) {
    const size = o.size || 28, w = (o.w || A.measure(ctx, label, size, 'S') + size * 1.6), h = o.h || size * 2.1; const p = o.p == null ? 1 : o.p; if (p <= 0) return w;
    ctx.save(); ctx.translate(cx, cy); const k = Math.min(1.06, p); ctx.scale(k, k); ctx.globalAlpha *= clamp(p * 3);
    A.roundRect(ctx, -w / 2, -h / 2, w, h, h / 2);
    if (o.style === 'outline') { ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fill(); ctx.strokeStyle = o.color || C.ink; ctx.lineWidth = 2; ctx.stroke(); }
    else if (o.style === 'gold') { ctx.fillStyle = GL.goldFlat(ctx, -h / 2, h / 2); ctx.fill(); }
    else if (o.style === 'red') { ctx.fillStyle = C.red; ctx.fill(); }
    else { ctx.fillStyle = o.fill || C.ink; ctx.fill(); }
    const col = o.style === 'outline' ? (o.color || C.ink) : o.style === 'gold' ? '#2B2107' : '#FFFFFF';
    if (o.latin) lat(ctx, label, 0, size * 0.36, { size, w: 600, color: col, align: 'center' }); else txt(ctx, label, 0, size * 0.36, { size, w: 'S', color: col, align: 'center' });
    ctx.restore(); return w;
  };

  // ---------- glass phone ----------
  GK.phone = function (ctx, x, y, w, h, t, o = {}) {
    const r = 64; ctx.save();
    ctx.save(); ctx.shadowColor = 'rgba(20,24,30,0.22)'; ctx.shadowBlur = 80; ctx.shadowOffsetY = 30; A.roundRect(ctx, x - 11, y - 11, w + 22, h + 22, r + 11); ctx.fillStyle = '#0E0F12'; ctx.fill(); ctx.restore();
    A.roundRect(ctx, x, y, w, h, r); ctx.fillStyle = o.screen || '#F8F8F6'; ctx.fill();
    lat(ctx, '9:41', x + 58, y + 58, { size: 26, w: 600, color: C.ink });
    ctx.fillStyle = C.ink; for (let i = 0; i < 4; i++) ctx.fillRect(x + w - 132 + i * 9, y + 50 - i * 5, 6, 8 + i * 5); A.roundRect(ctx, x + w - 86, y + 36, 46, 22, 6); ctx.lineWidth = 2; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.fillRect(x + w - 82, y + 40, 34, 14);
    ctx.restore();
  };

  // ---------- price chip (glass) ----------
  GK.price = function (ctx, label, value, x, y, o = {}) { // x = right edge
    const vs = o.size || 44; const vw = A.measure(ctx, value, vs, 300) || vs * value.length * 0.55; const w = Math.max(vw + 60, (o.minW || 220)), h = vs * 2.4;
    GL.panel(ctx, x - w, y, w, h, 26, { tint: 'rgba(255,255,255,0.6)' });
    txt(ctx, label, x - 28, y + vs * 0.9, { size: vs * 0.46, w: 'S', color: C.slate });
    lat(ctx, value, x - 28, y + vs * 1.95, { size: vs, w: 400, color: o.color || C.ink, align: 'right' });
    return w;
  };

  G.GK = GK;
})(typeof window !== 'undefined' ? window : globalThis);
