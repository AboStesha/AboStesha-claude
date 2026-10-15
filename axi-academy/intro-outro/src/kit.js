// Shared kit for the three Axi Academy logo stings: math, easing, the lockup geometry as paths,
// reveal clips (pen-order write-on), background, grain and the soft lockup shadow.
// Logo drawing works in the measured 2000x1125 space; the stage scales it by LOCKUP.scale (0.96) to 1920x1080.
(function (G) {
  'use strict';
  const W = 1920, H = 1080;
  const LK = G.LOCKUP, SC = LK.scale, AX = LK.axis, YT = LK.nib.top_y, YB = LK.nib.bot_y;
  const TAU = Math.PI * 2;

  // ---------------- math & easing ----------------
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const inv = (a, b, x) => clamp((x - a) / (b - a));
  const smooth = (u) => { u = clamp(u); return u * u * (3 - 2 * u); };
  const expoOut = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : 1 - Math.pow(2, -10 * u));
  const expoIn = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : Math.pow(2, 10 * (u - 1)));
  const expoInOut = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u < 0.5 ? Math.pow(2, 20 * u - 10) / 2 : (2 - Math.pow(2, -20 * u + 10)) / 2);
  const cubicOut = (u) => 1 - Math.pow(1 - clamp(u), 3);
  const cubicIn = (u) => Math.pow(clamp(u), 3);
  const cubicInOut = (u) => { u = clamp(u); return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  const quartOut = (u) => 1 - Math.pow(1 - clamp(u), 4);
  const quintOut = (u) => 1 - Math.pow(1 - clamp(u), 5);
  const quintInOut = (u) => { u = clamp(u); return u < 0.5 ? 16 * Math.pow(u, 5) : 1 - Math.pow(-2 * u + 2, 5) / 2; };
  const sineInOut = (u) => -(Math.cos(Math.PI * clamp(u)) - 1) / 2;
  const backOut = (u, s = 1.70158) => { u = clamp(u) - 1; return u * u * ((s + 1) * u + s) + 1; };
  // damped spring step response (0 → 1), t in seconds since start
  function spring(t, f = 3, z = 0.45) {
    if (t <= 0) return 0;
    const w = TAU * f, wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t));
  }
  const E = (fn) => (t, t0, d) => fn(inv(t0, t0 + d, t));
  const eo = E(expoOut), ei = E(expoIn), eio = E(expoInOut), co = E(cubicOut), cio = E(cubicInOut), qo = E(quintOut), qio = E(quintInOut), so = E(sineInOut);
  const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const noise = (x, seed = 0) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i + seed * 97.3), hash(i + 1 + seed * 97.3), u) * 2 - 1; };
  function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  // shake: decaying noise offsets after each hit time
  function shake(t, hits, amp, decay = 0.18, seed = 1) {
    let x = 0, y = 0;
    hits.forEach((h, i) => {
      const d = t - h; if (d < 0 || d > decay * 5) return;
      const k = amp * Math.exp(-d / decay);
      x += noise(d * 38 + i * 13, seed) * k; y += noise(d * 41 + i * 7, seed + 3) * k;
    });
    return [x, y];
  }

  // ---------------- lockup geometry (2000x1125 space) ----------------
  const bz = (P, t) => { const u = 1 - t; return [u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0], u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1]]; };
  const UP = LK.nib.upper, LO = LK.nib.lower, HWT = LK.tri.hw;
  // the nib outline as a single simple contour that dives into the slot from the top (fill = finished nib)
  function slotInto(p) {
    const s = LK.slot, hw = s.hw, y0 = s.body_y0, y1 = s.body_y1, bh = s.body_hw, r = s.body_r, cy = s.cap_cy;
    p.moveTo(AX - hw, YT); p.lineTo(AX - hw, y0); p.lineTo(AX - bh + r, y0); p.arcTo(AX - bh, y0, AX - bh, y0 + r, r);
    p.lineTo(AX - bh, y1 - r); p.arcTo(AX - bh, y1, AX - bh + r, y1, r); p.lineTo(AX - hw, y1); p.lineTo(AX - hw, cy);
    p.arc(AX, cy, hw, Math.PI, 0, true);
    p.lineTo(AX + hw, y1); p.lineTo(AX + bh - r, y1); p.arcTo(AX + bh, y1, AX + bh, y1 - r, r);
    p.lineTo(AX + bh, y0 + r); p.arcTo(AX + bh, y0, AX + bh - r, y0, r); p.lineTo(AX + hw, y0); p.lineTo(AX + hw, YT);
  }
  function outerRight(p) {
    p.lineTo(AX + UP[0][0], UP[0][1]);
    p.bezierCurveTo(AX + UP[1][0], UP[1][1], AX + UP[2][0], UP[2][1], AX + UP[3][0], UP[3][1]);
    p.bezierCurveTo(AX + LO[1][0], LO[1][1], AX + LO[2][0], LO[2][1], AX + LO[3][0], LO[3][1]);
  }
  function outerLeftUp(p) {
    p.lineTo(AX - LO[3][0], LO[3][1]);
    p.bezierCurveTo(AX - LO[2][0], LO[2][1], AX - LO[1][0], LO[1][1], AX - LO[0][0], LO[0][1]);
    p.bezierCurveTo(AX - UP[2][0], UP[2][1], AX - UP[1][0], UP[1][1], AX - UP[0][0], UP[0][1]);
  }
  const NIB = (() => { const p = new Path2D(); slotInto(p); outerRight(p); outerLeftUp(p); p.closePath(); return p; })();
  const NIB_OUTER = (() => { const p = new Path2D(); p.moveTo(AX - HWT, YT); p.lineTo(AX + HWT, YT); outerRight(p); outerLeftUp(p); p.closePath(); return p; })();
  const SLOT = (() => { const p = new Path2D(); slotInto(p); p.closePath(); return p; })();
  const TRI = (() => { const p = new Path2D(); p.moveTo(AX - HWT, YT); p.lineTo(AX, LK.tri.apex_y); p.lineTo(AX + HWT, YT); p.closePath(); return p; })();
  const BARS = LK.bars.map((b) => { const p = new Path2D(); p.roundRect(AX - b.hl, b.cy - b.h / 2, b.hl * 2, b.h, b.h / 2); return p; });
  // sampled outline points (right half, top → bottom) for draw-on strokes and particles
  const RIGHT_PTS = (() => { const pts = []; for (let i = 0; i <= 60; i++) pts.push(bz(UP, i / 60)); for (let i = 1; i <= 60; i++) pts.push(bz(LO, i / 60)); return pts.map(([hw, y]) => [AX + hw, y]); })();
  const SLOT_PTS = (() => {  // left side of the slot from the top down to the cap bottom (mirror for the right)
    const s = LK.slot, pts = [];
    pts.push([AX - s.hw, YT], [AX - s.hw, s.body_y0], [AX - s.body_hw, s.body_y0 + 2], [AX - s.body_hw, s.body_y1 - 2], [AX - s.hw, s.body_y1], [AX - s.hw, s.cap_cy]);
    for (let i = 1; i <= 8; i++) { const a = Math.PI - (i / 8) * (Math.PI / 2); pts.push([AX + s.hw * Math.cos(a), s.cap_cy + s.hw * Math.sin(a)]); }
    return pts;
  })();
  // official axi letters (polygons; holes use even-odd)
  const AXI = LK.axi.letters.map((L) => {
    const p = new Path2D(); let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    L.polys.forEach((poly) => { poly.pts.forEach(([x, y], i) => { (i ? p.lineTo(x, y) : p.moveTo(x, y)); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }); p.closePath(); });
    return { name: L.name, path: p, box: [x0, y0, x1, y1], polys: L.polys };
  });
  const AXI_BOX = [AXI[0].box[0], AXI[2].box[1], AXI[2].box[2], AXI[0].box[3]];
  // ACADEMY: geometric letters rebuilt from fitted params; each part = polygon + pen direction for write-on
  const AT = LK.academy.T, AB = LK.academy.B;
  function ellPts(cx, cy, rx, ry, a0, a1, n) { const out = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; out.push([cx + rx * Math.cos(a), cy - ry * Math.sin(a)]); } return out; }
  function quad(p0, p1, p2, p3) { return { kind: 'quad', q: [p0, p1, p2, p3] }; }  // pen runs from edge p0-p1 to edge p3-p2
  function academyParts(k, p) {
    const t = AT, b = AB;
    if (k === 'A') {
      const [cx, hb, wl, ft, yc, wh] = p, y1 = yc - wh / 2, y2 = yc + wh / 2;
      const xo = (y, s) => cx + s * (ft / 2 + (hb - ft / 2) * (y - t) / (b - t));
      return [quad([cx - ft / 2, t], [cx - ft / 2 + wl, t], [cx - hb + wl, b], [cx - hb, b]),
              quad([cx + ft / 2 - wl, t], [cx + ft / 2, t], [cx + hb, b], [cx + hb - wl, b]),
              quad([xo(y1, -1), y1], [xo(y2, -1), y2], [xo(y2, 1), y2], [xo(y1, 1), y1])];
    }
    if (k === 'C') {
      const [cx, cy, rx, ry, w, a1, a2] = p;
      return [{ kind: 'ring', cx, cy, rx, ry, w, a0: a1, a1: TAU - a2 }];
    }
    if (k === 'D') {
      const [xl, ws, xb, rx, wh, wc] = p, cy = (t + b) / 2, ry = (b - t) / 2;
      return [quad([xl, t], [xl + ws, t], [xl + ws, b], [xl, b]), { kind: 'bowl', xl, ws, xb, rx, ry, cy, wh, wc }];
    }
    if (k === 'E') {
      const [xl, ws, wt, wm, wb, Lt, Lm, Lb, ym] = p;
      return [quad([xl, t], [xl + ws, t], [xl + ws, b], [xl, b]),
              quad([xl, t], [xl, t + wt], [xl + Lt, t + wt], [xl + Lt, t]),
              quad([xl, ym - wm / 2], [xl, ym + wm / 2], [xl + Lm, ym + wm / 2], [xl + Lm, ym - wm / 2]),
              quad([xl, b - wb], [xl, b], [xl + Lb, b], [xl + Lb, b - wb])];
    }
    if (k === 'M') {
      const [xl, xr, ws, wd, yv, fv, ds] = p, cx = (xl + xr) / 2;
      return [quad([xl, b], [xl + ws, b], [xl + ws, t], [xl, t]),
              quad([xl + ds, t], [xl + ds + wd, t], [cx + fv / 2, yv], [cx - fv / 2, yv]),
              quad([cx - fv / 2, yv], [cx + fv / 2, yv], [xr - ds, t], [xr - ds - wd, t]),
              quad([xr - ws, t], [xr, t], [xr, b], [xr - ws, b])];
    }
    if (k === 'Y') {
      const [cx, hw, wd, yj, ws] = p;
      return [quad([cx - hw, t], [cx - hw + wd, t], [cx + ws / 2, yj], [cx - ws / 2, yj]),
              quad([cx + hw - wd, t], [cx + hw, t], [cx + ws / 2, yj], [cx - ws / 2, yj]),
              quad([cx - ws / 2, yj - 1], [cx + ws / 2, yj - 1], [cx + ws / 2, b], [cx - ws / 2, b])];
    }
    return [];
  }
  const ACAD = LK.academy.letters.map((L) => {
    const parts = academyParts(L.k, L.p);
    let x0 = 1e9, x1 = -1e9;
    parts.forEach((pt) => { const pts = partPoly(pt, 1); pts.forEach(([x]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }); });
    return { k: L.k, parts, box: [x0, AT, x1, AB], cx: (x0 + x1) / 2 };
  });
  const ACAD_BOX = [ACAD[0].box[0], AT, ACAD[ACAD.length - 1].box[2], AB];
  // polygon of a part revealed up to u (pen order)
  function partPoly(pt, u) {
    u = clamp(u);
    if (pt.kind === 'quad') {
      const [p0, p1, p2, p3] = pt.q;
      return [p0, p1, [lerp(p1[0], p2[0], u), lerp(p1[1], p2[1], u)], [lerp(p0[0], p3[0], u), lerp(p0[1], p3[1], u)]];
    }
    if (pt.kind === 'ring') {
      const a1 = pt.a0 + (pt.a1 - pt.a0) * u, n = Math.max(2, Math.ceil(90 * u));
      return ellPts(pt.cx, pt.cy, pt.rx, pt.ry, pt.a0, a1, n).concat(ellPts(pt.cx, pt.cy, pt.rx - pt.w, pt.ry - pt.w, a1, pt.a0, n));
    }
    if (pt.kind === 'bowl') {  // top bar → round bowl → bottom bar, as one band of thickness wh / wc
      const { xl, ws, xb, rx, ry, cy, wh, wc } = pt;
      const outer = [[xl + ws * 0.5, cy - ry]].concat(ellPts(xb, cy, rx, ry, Math.PI / 2, -Math.PI / 2, 80)).concat([[xl + ws * 0.5, cy + ry]]);
      const inner = [[xl + ws * 0.5, cy - ry + wh]].concat(ellPts(xb, cy, Math.max(1, rx - wc), ry - wh, Math.PI / 2, -Math.PI / 2, 80)).concat([[xl + ws * 0.5, cy + ry - wh]]);
      const n = outer.length, m = Math.max(2, Math.round(u * (n - 1)) + 1);
      return outer.slice(0, m).concat(inner.slice(0, m).reverse());
    }
    return [];
  }
  function polyPath(ctx, pts) { ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); }

  // ---------------- drawing the lockup ----------------
  const WHITE = '#FFFFFF', RED = LK.red;
  function fillNib(ctx, color = WHITE) { ctx.fillStyle = color; ctx.fill(NIB); }
  function fillTri(ctx, color = RED) { ctx.fillStyle = color; ctx.fill(TRI); }
  function fillBar(ctx, i, color = WHITE) { ctx.fillStyle = color; ctx.fill(BARS[i]); }
  function fillAxi(ctx, i, color = WHITE) {
    const L = AXI[i]; ctx.fillStyle = color; ctx.fill(L.path, 'evenodd');
    ctx.strokeStyle = color; ctx.lineWidth = 2 * LK.axi.grow; ctx.lineJoin = 'miter'; ctx.stroke(L.path);
  }
  // ACADEMY letter i, every part revealed by u (array or number)
  function fillAcad(ctx, i, u = 1, color = WHITE) {
    const L = ACAD[i]; ctx.fillStyle = color;
    L.parts.forEach((pt, j) => {
      const uj = Array.isArray(u) ? u[j] : u; if (uj <= 0) return;
      ctx.beginPath(); polyPath(ctx, partPoly(pt, uj)); ctx.fill();
    });
  }
  // the finished lockup
  function lockup(ctx, o = {}) {
    const a = o.alpha == null ? 1 : o.alpha; if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    fillNib(ctx, o.white); BARS.forEach((_, i) => fillBar(ctx, i, o.white));
    AXI.forEach((_, i) => fillAxi(ctx, i, o.white)); ACAD.forEach((_, i) => fillAcad(ctx, i, 1, o.white));
    fillTri(ctx, o.red || RED);
    ctx.restore();
  }
  function silhouette(ctx) {  // for shadows / masks (no colour)
    ctx.fill(NIB); BARS.forEach((b) => ctx.fill(b)); ctx.fill(TRI);
    AXI.forEach((L) => ctx.fill(L.path, 'evenodd')); ACAD.forEach((_, i) => fillAcad(ctx, i, 1, ctx.fillStyle));
  }

  // ---------------- clips ----------------
  function clipHalf(ctx, px, py, nx, ny, d) {  // keep points with (p - P)·n <= d  (n normalised)
    const L = 6000, tx = -ny, ty = nx, cx = px + nx * d, cy = py + ny * d;
    ctx.beginPath(); ctx.moveTo(cx + tx * L, cy + ty * L); ctx.lineTo(cx - tx * L, cy - ty * L);
    ctx.lineTo(cx - tx * L - nx * L, cy - ty * L - ny * L); ctx.lineTo(cx + tx * L - nx * L, cy + ty * L - ny * L); ctx.closePath(); ctx.clip();
  }
  function clipWedge(ctx, cx, cy, a0, a1, R = 3000) {  // canvas angles (y down), sweeping a0 → a1
    ctx.beginPath(); ctx.moveTo(cx, cy); const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 0.05));
    for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a)); }
    ctx.closePath(); ctx.clip();
  }
  function clipRect(ctx, x0, y0, x1, y1) { ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip(); }

  // ---------------- stage: background, grain, shadow ----------------
  const BGC = document.createElement('canvas'); BGC.width = W; BGC.height = H;
  (() => {
    const g = BGC.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, H);
    LK.bg.forEach(([pos, r, gg, b]) => gr.addColorStop(pos, `rgb(${r},${gg},${b})`));
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
  })();
  function bg(ctx, a = 1) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(BGC, 0, 0); ctx.restore(); }
  function vgrad(ctx, c0, c1, a = 1) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const GR = document.createElement('canvas'); GR.width = 512; GR.height = 512;
  (() => {
    const g = GR.getContext('2d'), id = g.createImageData(512, 512), r = rng(7);
    for (let i = 0; i < id.data.length; i += 4) { const v = Math.floor(r() * 256); id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
    g.putImageData(id, 0, 0);
  })();
  function grain(ctx, t, a = 0.035, frozen = false) {
    const f = frozen ? 7 : Math.floor(t * 60), ox = Math.floor(hash(f) * 512), oy = Math.floor(hash(f + 0.5) * 512);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'overlay';
    for (let y = -oy; y < H; y += 512) for (let x = -ox; x < W; x += 512) ctx.drawImage(GR, x, y);
    ctx.restore();
  }
  const SH1 = document.createElement('canvas'), SH2 = document.createElement('canvas');
  SH1.width = SH2.width = W / 4; SH1.height = SH2.height = H / 4;
  // soft drop shadow of whatever `draw` paints (in lockup space under the stage matrix m), as measured on the client image
  function shadow(ctx, m, draw, k = 1) {
    if (k <= 0) return;
    const s1 = SH1.getContext('2d'), s2 = SH2.getContext('2d');
    s1.setTransform(1, 0, 0, 1, 0, 0); s1.clearRect(0, 0, SH1.width, SH1.height);
    s1.setTransform(m.a / 4, m.b / 4, m.c / 4, m.d / 4, m.e / 4, m.f / 4); s1.fillStyle = '#000'; draw(s1);
    s2.setTransform(1, 0, 0, 1, 0, 0); s2.clearRect(0, 0, SH2.width, SH2.height);
    s2.filter = `blur(${(LK.shadow.sigma * SC / 4).toFixed(2)}px)`; s2.drawImage(SH1, 0, 0); s2.filter = 'none';
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(LK.shadow.k * k, 0, 1);
    ctx.drawImage(SH2, 0, LK.shadow.dy * SC * (m.d / SC), W, H); ctx.restore();
  }
  // additive glow of whatever `draw` paints (draw sets its own fill colours), blurred at quarter resolution
  function glow(ctx, m, draw, sigmaPx, alpha = 1, comp = 'lighter') {
    if (alpha <= 0) return;
    const s1 = SH1.getContext('2d'), s2 = SH2.getContext('2d');
    s1.setTransform(1, 0, 0, 1, 0, 0); s1.clearRect(0, 0, SH1.width, SH1.height);
    s1.setTransform(m.a / 4, m.b / 4, m.c / 4, m.d / 4, m.e / 4, m.f / 4); s1.globalAlpha = 1; s1.globalCompositeOperation = 'source-over'; draw(s1);
    s2.setTransform(1, 0, 0, 1, 0, 0); s2.clearRect(0, 0, SH2.width, SH2.height);
    s2.filter = `blur(${(sigmaPx / 4).toFixed(2)}px)`; s2.drawImage(SH1, 0, 0); s2.filter = 'none';
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = clamp(alpha); ctx.globalCompositeOperation = comp; ctx.drawImage(SH2, 0, 0, W, H); ctx.restore();
  }
  // stage matrix: lockup space → screen, with a camera (scale s about the lockup centre, then offset)
  const CX = 1000, CY = 562.5;
  function stage(ctx, cam = {}) {
    const s = (cam.s || 1) * SC, ox = cam.x || 0, oy = cam.y || 0, r = cam.r || 0;
    const fx = cam.fx == null ? CX : cam.fx, fy = cam.fy == null ? CY : cam.fy;  // focus point in lockup space
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(W / 2 + ox + (fx - CX) * SC, H / 2 + oy + (fy - CY) * SC);
    if (r) ctx.rotate(r);
    ctx.scale(s, s); ctx.translate(-fx, -fy);
    return ctx.getTransform();
  }

  // camera keyframes [t, s, fx, fy, ox, oy] → smooth (cubic Hermite, log-scale) camera object for stage()
  function track(t, keys) {
    const n = keys.length; if (t <= keys[0][0]) return camOf(keys[0]); if (t >= keys[n - 1][0]) return camOf(keys[n - 1]);
    let i = 0; while (i < n - 2 && t > keys[i + 1][0]) i++;
    const k0 = keys[i], k1 = keys[i + 1], d = k1[0] - k0[0], u = (t - k0[0]) / d;
    const h00 = 2 * u * u * u - 3 * u * u + 1, h10 = u * u * u - 2 * u * u + u, h01 = -2 * u * u * u + 3 * u * u, h11 = u * u * u - u * u;
    const val = (j, f) => {
      const g = (k) => (f ? f(k[j]) : k[j]);
      const tan = (a) => (a <= 0 || a >= n - 1 ? 0 : (g(keys[a + 1]) - g(keys[a - 1])) / (keys[a + 1][0] - keys[a - 1][0]));
      return h00 * g(k0) + h10 * d * tan(i) + h01 * g(k1) + h11 * d * tan(i + 1);
    };
    return { s: Math.exp(val(1, Math.log)), fx: val(2), fy: val(3), x: val(4) || 0, y: val(5) || 0 };
  }
  function camOf(k) { return { s: k[1], fx: k[2], fy: k[3], x: k[4] || 0, y: k[5] || 0 }; }

  G.K = {
    track,
    W, H, LK, SC, AX, YT, YB, HWT, TAU, WHITE, RED,
    clamp, lerp, inv, smooth, expoOut, expoIn, expoInOut, cubicOut, cubicIn, cubicInOut, quartOut, quintOut, quintInOut, sineInOut, backOut, spring,
    eo, ei, eio, co, cio, qo, qio, so, hash, noise, rng, shake, bz,
    NIB, NIB_OUTER, SLOT, TRI, BARS, RIGHT_PTS, SLOT_PTS, AXI, AXI_BOX, ACAD, ACAD_BOX, AT, AB,
    partPoly, polyPath, fillNib, fillTri, fillBar, fillAxi, fillAcad, lockup, silhouette,
    clipHalf, clipWedge, clipRect, bg, vgrad, grain, shadow, glow, stage, CX, CY,
  };
})(window);
