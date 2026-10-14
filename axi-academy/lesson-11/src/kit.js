// Lesson 17 scene kit — layout helpers shared by the scenes: headlines, the red dot, charts, tilted map plane, cards, pills.
(function (G) {
  const A = G.AX, FX = G.FX;
  const { W, H, C, clamp, lerp, inv, eo, ei, eio, hexA, txt, lat, measure, line, roundRect, rng } = A;
  const K = {};

  // ---------- bouncing ball (height above ground, with contact times for squash) ----------
  // h0 drop height (px), t1 fall time, k restitution (height ratio per bounce)
  K.bounce = function (T, h0 = 300, t1 = 0.32, k = 0.32, n = 3) {
    if (T < 0) return { y: h0, sq: 0, air: true };
    if (T < t1) { const u = T / t1; return { y: h0 * (1 - u * u), sq: 0, v: u }; }
    let t = T - t1, h = h0 * k, d = 2 * t1 * Math.sqrt(k); const contacts = [0];
    for (let i = 0; i < n; i++) {
      if (t < d) { const u = t / d; const sq = Math.exp(-Math.pow(t / 0.045, 2)) * Math.pow(k, i); return { y: 4 * h * u * (1 - u), sq }; }
      t -= d; h *= k; d *= Math.sqrt(k);
    }
    return { y: 0, sq: Math.exp(-Math.pow(t / 0.05, 2)) * Math.pow(k, n) };
  };
  // the red "period" dot: drops from above, squashes on each contact, settles at (x,y) = resting centre
  K.dot = function (ctx, x, y, r, lt, o = {}) {
    if (lt == null || lt < 0) return;
    const b = K.bounce(lt, o.h0 == null ? 320 : o.h0, o.t1 || 0.3, o.k || 0.3);
    const sq = b.sq * (o.squash == null ? 0.55 : o.squash); const sx = 1 + sq, sy = 1 - sq * 0.8;
    ctx.save(); ctx.fillStyle = o.color || C.red; ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    ctx.translate(x, y + r - b.y); ctx.scale(sx, sy); ctx.beginPath(); ctx.arc(0, -r, r, 0, 6.283); ctx.fill(); ctx.restore();
  };

  // ---------- headline: words laid right→left, each with its own cue + mode ----------
  // words: [{s, t, mode, color, size, w, gap}] ; returns {left, right, xs:[[xr, xl]...]}
  K.words = function (ctx, words, xRight, y, t, o = {}) {
    let x = xRight; const xs = [];
    for (const wd of words) {
      const size = wd.size || o.size || 160; const ww = FX.kwidth(wd.s, size, wd.w || o.w || 'X');
      if (wd.t != null) FX.kword(ctx, wd.s, x, y, { size, w: wd.w || o.w || 'X', color: wd.color || o.color || C.ink, lt: t - wd.t, mode: wd.mode || o.mode || 'drop', stagger: wd.stagger == null ? o.stagger : wd.stagger, out: wd.out == null ? o.out : wd.out, outDir: o.outDir, alpha: wd.alpha == null ? o.alpha : wd.alpha });
      xs.push([x, x - ww]); x -= ww + (wd.gap == null ? size * 0.28 : wd.gap);
    }
    return { right: xRight, left: x, xs };
  };
  K.wordsWidth = function (words, o = {}) {
    let s = 0; words.forEach((wd, i) => { const size = wd.size || o.size || 160; s += FX.kwidth(wd.s, size, wd.w || o.w || 'X') + (i < words.length - 1 ? (wd.gap == null ? size * 0.28 : wd.gap) : 0); });
    return s;
  };

  // hand-drawn underline (slate), right→left
  K.under = function (ctx, xr, xl, y, p, o = {}) {
    if (p <= 0) return; line(ctx, 'paper', [[xr, y], [lerp(xr, xl, 0.5), y + 4], [xl, y - 1]], { reveal: clamp(p), width: o.width || 4, color: o.color || C.slate, t: o.t || 0, amp: 0.7 });
  };

  // ---------- small UI ----------
  K.pill = function (ctx, s, cx, cy, o = {}) {
    const p = o.p == null ? 1 : o.p; if (p <= 0) return;
    const size = o.size || 30; const h = o.h || 72; const tw = measure(ctx, s, size, 'B'); const w = tw + h * 1.1;
    const sc = lerp(0.6, 1, p);
    ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc); ctx.globalAlpha = clamp(p * 1.6) * (o.alpha == null ? 1 : o.alpha);
    roundRect(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = o.fill || C.red; ctx.fill();
    if (o.stroke) { ctx.strokeStyle = o.stroke; ctx.lineWidth = 2; ctx.stroke(); }
    txt(ctx, s, 0, size * 0.36, { size, w: 'B', color: o.color || C.white, align: 'center' });
    ctx.restore(); return w;
  };
  // tag chip: small rounded rect with text
  K.chip = function (ctx, s, x, y, o = {}) {
    const p = o.p == null ? 1 : o.p; if (p <= 0) return 0;
    const size = o.size || 24; const latn = /^[\x00-\x7F]+$/.test(s);
    const tw = latn ? (ctx.save(), ctx.font = `${o.w || 600} ${size}px IN`, ctx.measureText(s).width + (ctx.restore(), 0)) : measure(ctx, s, size, o.w || 'S');
    const h = size * 1.8, w = tw + size * 1.3; const align = o.align || 'right';
    const xr = align === 'right' ? x : align === 'center' ? x + w / 2 : x + w;
    ctx.save(); ctx.globalAlpha = clamp(p * 2) * (o.alpha == null ? 1 : o.alpha);
    const sc = lerp(0.7, 1, eo(p, 0, 1)); ctx.translate(xr - w / 2, y); ctx.scale(sc, sc);
    roundRect(ctx, -w / 2, -h / 2, w, h, o.r == null ? h / 2 : o.r);
    if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
    ctx.strokeStyle = o.stroke || (o.fill ? o.fill : C.slate); ctx.lineWidth = 1.6; ctx.stroke();
    if (latn) lat(ctx, s, 0, size * 0.36, { size, w: o.w || 600, color: o.color || C.ink, align: 'center' });
    else txt(ctx, s, 0, size * 0.36, { size, w: o.w || 'S', color: o.color || C.ink, align: 'center' });
    ctx.restore(); return w;
  };

  // light glass card with one chamfered corner (brand component)
  K.card = function (ctx, x, y, w, h, o = {}) {
    const p = o.p == null ? 1 : o.p; if (p <= 0) return;
    const ch = o.chamfer == null ? 44 : o.chamfer; const dark = o.dark;
    ctx.save(); ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * clamp(p * 1.5);
    const yy = y + (1 - eo(p, 0, 1)) * 40;
    ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w - ch, yy); ctx.lineTo(x + w, yy + ch); ctx.lineTo(x + w, yy + h); ctx.lineTo(x, yy + h); ctx.closePath();
    ctx.fillStyle = dark ? 'rgba(20,22,26,0.78)' : 'rgba(255,255,255,0.72)'; ctx.fill();
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.22)' : 'rgba(96,120,128,0.35)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore(); return yy;
  };

  // ---------- price paths ----------
  // smooth random path through anchors [[u, v], ...] (u 0..1 along time, v price units); n samples
  K.path = function (anchors, n, seed, vol = 1, o = {}) {
    const r = rng(seed); const out = [];
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1); let j = 0; while (j < anchors.length - 2 && u > anchors[j + 1][0]) j++;
      const a = anchors[j], b = anchors[j + 1]; const q = clamp((u - a[0]) / (b[0] - a[0] || 1));
      const qs = o.linear ? q : q * q * (3 - 2 * q);
      out.push(lerp(a[1], b[1], qs));
    }
    // brownian bridge noise per segment (zero at anchors)
    let walk = 0; const noise = out.map(() => (walk += (r() - 0.5) * vol));
    const idxA = anchors.map((a) => Math.round(a[0] * (n - 1)));
    for (let s = 0; s < idxA.length - 1; s++) {
      const i0 = idxA[s], i1 = idxA[s + 1]; const n0 = noise[i0], n1 = noise[i1];
      for (let i = i0; i <= i1; i++) { const q = (i - i0) / Math.max(1, i1 - i0); out[i] += noise[i] - lerp(n0, n1, q); }
    }
    return out;
  };
  // OHLC candles from a close series
  K.candles = function (closes, seed, wick = 0.6) {
    const r = rng(seed); return closes.map((c, i) => { const o = i ? closes[i - 1] : c + (r() - 0.5) * wick; const hi = Math.max(o, c) + r() * wick; const lo = Math.min(o, c) - r() * wick; return { o, c, h: hi, l: lo }; });
  };
  // chart frame mapping: box [x, y, w, h], value range [lo, hi]; RTL time: index 0 at the RIGHT? No — charts read left→right (universal).
  K.frame = function (box, lo, hi, n) {
    const [x, y, w, h] = box; return { X: (i) => x + (i / (n - 1)) * w, Y: (v) => y + h - ((v - lo) / (hi - lo)) * h, box, lo, hi, n };
  };
  // draw a price line with reveal (0..1 of samples), ink colour, optional head dot
  K.priceLine = function (ctx, fr, vals, p, o = {}) {
    const m = Math.max(2, Math.floor(vals.length * clamp(p))); const pts = []; for (let i = 0; i < m; i++) pts.push([fr.X(i), fr.Y(vals[i])]);
    if (p < 1 && m < vals.length) { const f = vals.length * clamp(p) - m; const i = m - 1; if (i + 1 < vals.length) pts.push([fr.X(i + f), fr.Y(lerp(vals[i], vals[i + 1], f))]); }
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = o.color || C.ink; ctx.lineWidth = o.width || 3.2; ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
    if (o.fill) { ctx.lineTo(pts[pts.length - 1][0], fr.box[1] + fr.box[3]); ctx.lineTo(pts[0][0], fr.box[1] + fr.box[3]); ctx.closePath(); ctx.fillStyle = o.fill; ctx.fill(); }
    ctx.restore();
    const hd = pts[pts.length - 1];
    if (o.head) { ctx.save(); ctx.fillStyle = o.headColor || C.red; ctx.beginPath(); ctx.arc(hd[0], hd[1], o.head, 0, 6.283); ctx.fill(); ctx.restore(); }
    return hd;
  };
  K.drawCandles = function (ctx, fr, cs, p, o = {}) {
    const n = Math.floor(cs.length * clamp(p)); const bw = Math.max(3, (fr.box[2] / cs.length) * (o.body || 0.62));
    const up = o.up || C.mint, dn = o.down || C.red;
    for (let i = 0; i < n; i++) {
      const c = cs[i]; const x = fr.X(i); const k = i === n - 1 ? clamp((cs.length * clamp(p) - n) * 3 + 0.3) : 1;
      const col = c.c >= c.o ? up : dn; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = o.wick || 2; ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      const yo = fr.Y(c.o), yc = fr.Y(lerp(c.o, c.c, k));
      ctx.beginPath(); ctx.moveTo(x, fr.Y(lerp(Math.max(c.o, c.c), c.h, k))); ctx.lineTo(x, fr.Y(lerp(Math.min(c.o, c.c), c.l, k))); ctx.stroke();
      ctx.fillRect(x - bw / 2, Math.min(yo, yc), bw, Math.max(2, Math.abs(yc - yo)));
    }
    ctx.globalAlpha = 1;
  };
  // dashed horizontal level with label (label right-aligned at the right end, Arabic + optional latin)
  K.level = function (ctx, fr, v, p, o = {}) {
    if (p <= 0) return; const y = fr.Y(v); const x0 = fr.box[0], x1 = fr.box[0] + fr.box[2];
    ctx.save(); ctx.setLineDash(o.dash || [14, 10]); ctx.lineWidth = o.width || 2.2; ctx.strokeStyle = o.color || C.slate; ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(lerp(x1, x0, eo(p, 0, 1)), y); ctx.stroke(); ctx.restore();
    if (o.label) txt(ctx, o.label, x1 + (o.labelDx == null ? -6 : o.labelDx), y - 14, { size: o.size || 26, w: o.lw || 'S', color: o.labelColor || o.color || C.slate, alpha: clamp((p - 0.3) * 2) });
    if (o.latin) lat(ctx, o.latin, x0 + 6, y - 14, { size: (o.size || 26) * 0.8, w: 600, color: o.labelColor || o.color || C.slate, alpha: clamp((p - 0.4) * 2) });
  };
  // axes like the reference graph (thin, ink, small labels)
  K.axes = function (ctx, box, p, o = {}) {
    if (p <= 0) return; const [x, y, w, h] = box; const col = o.color || hexA(C.ink, 0.7);
    line(ctx, 'paper', [[x, y], [x, y + h], [x + w, y + h]].map((q) => q), { reveal: clamp(p), width: 2, color: col, t: o.t || 0, amp: 0.25 });
    if (o.yl) txt(ctx, o.yl, x - 12, y + 8, { size: 20, w: 'R', color: hexA(C.ink, 0.6), alpha: clamp(p * 2 - 1) });
    if (o.xl) txt(ctx, o.xl, x + w, y + h + 34, { size: 20, w: 'R', color: hexA(C.ink, 0.6), alpha: clamp(p * 2 - 1) });
  };

  // ---------- tilted plane (map / dot grid in perspective) ----------
  // returns P(u, v, z=0) -> [x, y, scale]; u,v plane coords (px), tilt around X (rad), rotation around plane normal (rad)
  K.plane = function (o = {}) {
    const cx = o.cx || 960, cy = o.cy || 540, f = o.f || 1400, tilt = o.tilt || 0, rot = o.rot || 0, s = o.scale || 1, ox = o.ox || 0, oy = o.oy || 0;
    const ct = Math.cos(tilt), st = Math.sin(tilt), cr = Math.cos(rot), sr = Math.sin(rot);
    // far edge (v < 0) recedes; h = height above the plane (rises on screen as the plane tilts)
    return (u, v, h = 0) => {
      const uu = (u - ox) * s, vv = (v - oy) * s; const x1 = uu * cr - vv * sr, y1 = uu * sr + vv * cr;
      const y2 = y1 * ct - h * s * st, z2 = -y1 * st - h * s * ct; const k = f / (f + z2);
      return [cx + x1 * k, cy + y2 * k, k];
    };
  };
  // perspective dot grid; dotFn(u, v) -> [radiusMul, color|null, alpha]
  K.planeDots = function (ctx, P, range, gap, o = {}) {
    const [u0, u1, v0, v1] = range; const base = o.color || 'rgba(255,255,255,'; const a0 = o.alpha == null ? 0.16 : o.alpha;
    for (let v = v0; v <= v1; v += gap) for (let u = u0; u <= u1; u += gap) {
      const [x, y, k] = P(u, v); if (x < -20 || x > W + 20 || y < -20 || y > H + 20) continue;
      let rm = 1, col = null, al = a0; if (o.dotFn) { const d = o.dotFn(u, v); if (d) { rm = d[0]; col = d[1]; al = d[2] == null ? al : d[2]; } }
      if (al <= 0) continue; ctx.fillStyle = col ? hexA(col, al) : base + al + ')'; ctx.beginPath(); ctx.arc(x, y, Math.max(0.4, (o.r || 1.8) * rm * k), 0, 6.283); ctx.fill();
    }
  };
  // polyline through plane points (projects then strokes)
  K.planeLine = function (ctx, P, pts, o = {}) { const q = pts.map(([u, v]) => { const [x, y] = P(u, v); return [x, y]; }); line(ctx, o.ink || 'paper', q, o); return q; };

  // follow-through snake: leader position fn(t) -> [x,y]; n dots lagging dt each, shrinking
  K.snake = function (ctx, fn, t, n, dt, o = {}) {
    for (let k = n - 1; k >= 0; k--) {
      const [x, y] = fn(t - k * dt); const q = 1 - k / n; const r = (o.r || 12) * (0.35 + 0.65 * q);
      ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * (0.25 + 0.75 * q); ctx.fillStyle = o.color || C.red; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  // ---------- word → particles (disintegrate right→left, drifting up-left) ----------
  K.dissolve = function (ctx, s, xr, y, o = {}) {
    const size = o.size || 200; const col = o.color || C.ink; const sp = FX.sprite(s, size, o.w || 'X', col);
    const left0 = xr - sp.w - sp.pad, top = y - sp.base; const p = o.p || 0;
    if (p <= 0) { ctx.drawImage(sp.cv, left0, top); return; }
    if (!sp.parts) {
      const cw = sp.cv.width, d = sp.cv.getContext('2d').getImageData(0, 0, cw, sp.cv.height).data; const st = Math.max(3, Math.round(size / 45)); const parts = [];
      for (let yy = 0; yy < sp.cv.height; yy += st) for (let xx = 0; xx < cw; xx += st) if (d[(yy * cw + xx) * 4 + 3] > 110) parts.push([xx, yy]);
      sp.parts = parts; sp.st = st;
    }
    const r = rng(o.seed || 3); const cw = sp.cv.width; const st = sp.st;
    ctx.save(); ctx.fillStyle = col;
    for (const [px, py] of sp.parts) {
      const a = r(), b = r(), c = r();
      const delay = (1 - px / cw) * 0.5 + c * 0.12; const q = clamp((p - delay) / 0.5);
      if (q >= 1) continue;
      const e = q * q; const dx = -e * (160 + 520 * a), dy = -e * (60 + 300 * b) + Math.sin(q * 6 + a * 9) * 14 * q;
      ctx.globalAlpha = (o.alpha == null ? 1 : o.alpha) * (1 - q); const z = st * (1 - 0.55 * q) + 0.6;
      ctx.fillRect(left0 + px + dx, top + py + dy, z, z);
    }
    ctx.restore();
  };

  // ---------- numbers ----------
  K.count = (t, t0, d, a, b) => Math.round(lerp(a, b, eo(t, t0, d)));
  K.hero = function (ctx, s, x, y, o = {}) { return lat(ctx, s, x, y, { size: o.size || 260, w: o.w || 300, color: o.color || C.ink, align: o.align || 'right', track: o.track == null ? -4 : o.track, alpha: o.alpha }); };

  // ---------- jitter (anxious shake) ----------
  K.shake = (t, amp = 4, f = 31) => [Math.sin(t * f) * amp + Math.sin(t * f * 1.7 + 1) * amp * 0.5, Math.cos(t * f * 1.3) * amp * 0.7];


  // ---------- scene-writing helpers (shared by every lesson) ----------
  K.outAt = (t, t0, d = 0.45) => clamp((t - t0) / d);
  // centred caption row of timed words
  K.cap = (ctx, words, y, t, o = {}) => {
    const sz = o.size || 56, wt = o.w || 'R'; const cw = K.wordsWidth(words, { size: sz, w: wt });
    return K.words(ctx, words, o.x == null ? 960 + cw / 2 : o.x, y, t, { size: sz, w: wt, color: o.color || C.slate, mode: o.mode || 'rise', stagger: o.stagger == null ? 0.02 : o.stagger, out: o.out });
  };
  // big centred headline of timed words
  K.head = (ctx, words, y, t, o = {}) => {
    const sz = o.size || 150; const cw = K.wordsWidth(words, { size: sz, w: o.w || 'X' });
    return K.words(ctx, words, o.x == null ? 960 + cw / 2 : o.x, y, t, { size: sz, w: o.w || 'X', color: o.color || C.ink, mode: o.mode || 'drop', stagger: o.stagger == null ? 0.04 : o.stagger, out: o.out });
  };
  // cursor path through waypoints [[t, x, y]]
  K.cursorAt = (t, pts) => {
    if (t <= pts[0][0]) return [pts[0][1], pts[0][2]];
    for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; if (t <= b[0]) { const e = eio(t, a[0], b[0] - a[0]); return [lerp(a[1], b[1], e), lerp(a[2], b[2], e)]; } }
    const l = pts[pts.length - 1]; return [l[1], l[2]];
  };
  K.press = (t, clicks) => clicks.reduce((m, c) => Math.max(m, Math.exp(-Math.pow((t - c) / 0.07, 2))), 0);
  // superposed springs: value starts at v0 and moves to each keyframe [t, v]
  K.springs = (t, v0, keys, wv = 13, z = 0.5) => { let v = v0, prev = v0; for (const [tk, vk] of keys) { v += (vk - prev) * FX.springU(t - tk, wv, z); prev = vk; } return v; };
  K.metal = (ctx, y0, y1) => { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#C4C8CC'); return g; };
  // ring burst at a point (click / touch feedback)
  K.burst = (ctx, x, y, t, t0, col = C.red, r0 = 10, r1 = 80, d = 0.6) => { const q = clamp((t - t0) / d); if (q <= 0 || q >= 1) return; ctx.save(); ctx.strokeStyle = hexA(col, 1 - q); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r0 + (r1 - r0) * eo(q, 0, 1), 0, 6.283); ctx.stroke(); ctx.restore(); };
  // a horizontal arrow (right→left reading direction by default)
  K.arrowH = (ctx, x0, x1, y, p, o = {}) => { if (p <= 0) return; const x = lerp(x0, x1, clamp(p)); ctx.save(); ctx.strokeStyle = o.color || C.ink; ctx.fillStyle = o.color || C.ink; ctx.lineWidth = o.width || 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x, y); ctx.stroke(); const dir = Math.sign(x1 - x0) || -1; const s = o.head || 18; ctx.beginPath(); ctx.moveTo(x + dir * 4, y); ctx.lineTo(x - dir * s, y - s * 0.65); ctx.lineTo(x - dir * s, y + s * 0.65); ctx.closePath(); ctx.fill(); ctx.restore(); };

  G.KIT = K;
})(typeof window !== 'undefined' ? window : globalThis);
