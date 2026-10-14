// Axi Academy motion engine (lesson 17 build) — deterministic: every frame is a pure function of time t (seconds).
(function (G) {
  const W = 1920, H = 1080;
  const C = {
    red: '#E4002E', coral: '#FF3745', mint: '#5EE0BB',
    off: '#F9F9F9', white: '#FFFFFF', frost: '#EEF0F1', silver: '#C4C8CC', concrete: '#939699',
    charcoal: '#626466', graphite: '#393B40', carbon: '#242528', ink: '#090A0D', slate: '#607880',
  };

  // ---------- math / easing ----------
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const inv = (a, b, x) => clamp((x - a) / (b - a));
  const spring = (t, w = 22) => (t <= 0 ? 0 : 1 - (1 + w * t) * Math.exp(-w * t));
  // move that starts 0.05 s before its cue so it lands on it
  const sp = (t, t0, w = 22) => spring(t - t0 + 0.05, w);
  const expoOut = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const expoIn = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, 10 * (t - 1)));
  const expoInOut = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2);
  const eo = (t, t0, d) => expoOut(inv(t0, t0 + d, t));
  const ei = (t, t0, d) => expoIn(inv(t0, t0 + d, t));
  const eio = (t, t0, d) => expoInOut(inv(t0, t0 + d, t));
  const hexA = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  };
  const mixHex = (h1, h2, t) => {
    const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16);
    const r = Math.round(lerp((a >> 16) & 255, (b >> 16) & 255, t));
    const g = Math.round(lerp((a >> 8) & 255, (b >> 8) & 255, t));
    const bl = Math.round(lerp(a & 255, b & 255, t));
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1);
  };
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  // ---------- inks ----------
  const INK = {
    paper: { bg: C.off, grid: C.slate, gA: 0.11, gB: 0.22, line: C.ink, text: C.ink, sub: C.charcoal, muted: C.concrete, hud: hexA(C.ink, 0.62), fill: C.ink },
    steel: { bg: C.slate, grid: C.white, gA: 0.10, gB: 0.20, line: C.white, text: C.white, sub: hexA(C.white, 0.78), muted: hexA(C.white, 0.55), hud: hexA(C.white, 0.78), fill: C.white },
    dark: { bg: C.ink, grid: C.white, gA: 0.045, gB: 0.09, line: C.white, text: C.white, sub: hexA(C.white, 0.72), muted: hexA(C.white, 0.45), hud: hexA(C.white, 0.6), fill: C.white },
  };

  let grainCanvas = null;
  function grain() {
    if (grainCanvas) return grainCanvas;
    const c = document.createElement('canvas'); c.width = c.height = 512;
    const x = c.getContext('2d'); const img = x.createImageData(512, 512); const r = rng(7);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = r(); img.data[i] = img.data[i + 1] = img.data[i + 2] = v > 0.5 ? 255 : 0; img.data[i + 3] = Math.floor(Math.pow(Math.abs(v - 0.5) * 2, 3) * 40);
    }
    x.putImageData(img, 0, 0); grainCanvas = c; return c;
  }

  function background(ctx, ink, opt = {}) {
    const k = INK[ink];
    if (opt.gradient) {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, opt.gradient[0]); g.addColorStop(1, opt.gradient[1]);
      ctx.fillStyle = g;
    } else ctx.fillStyle = k.bg;
    ctx.fillRect(0, 0, W, H);
    if (opt.grid !== false) grid(ctx, k, opt.gridAlpha == null ? 1 : opt.gridAlpha);
    if (ink === 'paper') { ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = ctx.createPattern(grain(), 'repeat'); ctx.fillRect(0, 0, W, H); ctx.restore(); }
  }
  function grid(ctx, k, a = 1) {
    if (a <= 0) return;
    ctx.save(); ctx.lineWidth = 1;
    for (let i = -16; i <= 16; i++) {
      const x = 960 + i * 60 + 0.5; const major = i % 5 === 0;
      ctx.strokeStyle = hexA(k.grid, (major ? k.gB : k.gA) * a);
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let j = -9; j <= 9; j++) {
      const y = 540 + j * 60 + 0.5; const major = j % 5 === 0;
      ctx.strokeStyle = hexA(k.grid, (major ? k.gB : k.gA) * a);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.restore();
  }

  // ---------- polylines ----------
  function polyLen(p) { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; }
  function resample(p, step = 6) {
    const out = [p[0]]; let carry = 0;
    for (let i = 1; i < p.length; i++) {
      const [x0, y0] = p[i - 1], [x1, y1] = p[i]; const d = Math.hypot(x1 - x0, y1 - y0); if (d === 0) continue;
      let s = step - carry;
      while (s <= d) { out.push([x0 + (x1 - x0) * s / d, y0 + (y1 - y0) * s / d]); s += step; }
      carry = d - (s - step);
    }
    out.push(p[p.length - 1]); return out;
  }
  function subPath(p, a, b) {
    if (b <= a) return [];
    const L = polyLen(p), A = a * L, B = b * L; const out = []; let acc = 0;
    for (let i = 1; i < p.length; i++) {
      const [x0, y0] = p[i - 1], [x1, y1] = p[i]; const d = Math.hypot(x1 - x0, y1 - y0);
      const s0 = acc, s1 = acc + d;
      if (s1 >= A && s0 <= B) {
        const u0 = d ? clamp((A - s0) / d) : 0, u1 = d ? clamp((B - s0) / d) : 1;
        if (!out.length) out.push([lerp(x0, x1, u0), lerp(y0, y1, u0)]);
        out.push([lerp(x0, x1, u1), lerp(y0, y1, u1)]);
      }
      acc = s1;
    }
    return out;
  }
  // boiling pencil: offsets follow slow sines whose phase steps 8 times a second
  function boil(p, t, amp = 1.1, seed = 1) {
    if (amp <= 0) return p;
    const q = resample(p, 7); const ph = Math.floor(t * 8) * 1.7 + seed * 3.1;
    return q.map(([x, y], i) => [
      x + amp * (Math.sin(i * 0.21 + ph) * 0.7 + Math.sin(i * 0.053 + ph * 1.3) * 0.6),
      y + amp * (Math.cos(i * 0.17 + ph * 0.9) * 0.7 + Math.sin(i * 0.071 + ph * 0.6) * 0.6),
    ]);
  }
  function tracePts(ctx, p) { ctx.beginPath(); p.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); }

  // stroke a polyline in the current ink
  function line(ctx, ink, p, o = {}) {
    if (!p || p.length < 2) return;
    let q = p; if (o.reveal != null) q = subPath(p, o.from || 0, o.reveal); if (q.length < 2) return;
    const w = o.width || (ink === 'paper' ? 3 : ink === 'steel' ? 3.5 : 3.5);
    const col = o.color || INK[ink].line; const a = o.alpha == null ? 1 : o.alpha;
    ctx.save(); ctx.lineCap = o.cap || 'round'; ctx.lineJoin = 'round';
    if (o.dash) ctx.setLineDash(o.dash);
    if (ink === 'paper' && !o.clean) {
      const t = o.t || 0;
      ctx.strokeStyle = col; ctx.globalAlpha = 0.9 * a; ctx.lineWidth = w; tracePts(ctx, boil(q, t, o.amp == null ? 0.9 : o.amp, o.seed || 1)); ctx.stroke();
      ctx.globalAlpha = 0.4 * a; ctx.lineWidth = w * 0.5; tracePts(ctx, boil(q, t + 0.37, (o.amp == null ? 0.9 : o.amp) * 1.8, (o.seed || 1) + 5)); ctx.stroke();
    } else if (ink === 'dark' && !o.clean) {
      ctx.strokeStyle = col; ctx.globalAlpha = a; ctx.lineWidth = w; tracePts(ctx, q); ctx.stroke();
      ctx.strokeStyle = C.white; ctx.lineWidth = Math.max(1, w * 0.3); tracePts(ctx, q); ctx.stroke();
    } else {
      ctx.strokeStyle = col; ctx.globalAlpha = a; ctx.lineWidth = w; tracePts(ctx, q); ctx.stroke();
    }
    ctx.restore();
  }
  const rectPts = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
  const circPts = (cx, cy, r, n = 96, a0 = -Math.PI / 2) => Array.from({ length: n + 1 }, (_, i) => [cx + r * Math.cos(a0 + i / n * Math.PI * 2), cy + r * Math.sin(a0 + i / n * Math.PI * 2)]);
  const polyPts = (cx, cy, r, n, a0 = -Math.PI / 2) => Array.from({ length: n + 1 }, (_, i) => [cx + r * Math.cos(a0 + i / n * Math.PI * 2), cy + r * Math.sin(a0 + i / n * Math.PI * 2)]);

  // hatching (paper / steel fills): diagonal lines clipped to a region, drawn one line at a time with progress
  function hatch(ctx, ink, clip, o = {}) {
    const [bx, by, bw, bh] = o.box || [0, 0, W, H]; const gap = o.gap || 11; const ang = (o.angle == null ? 45 : o.angle) * Math.PI / 180;
    const prog = o.progress == null ? 1 : o.progress; if (prog <= 0) return;
    ctx.save(); clip(ctx); ctx.clip(o.rule || 'nonzero');
    ctx.strokeStyle = o.color || INK[ink].line; ctx.lineWidth = o.width || 1.4; ctx.globalAlpha = o.alpha == null ? (ink === 'paper' ? 0.5 : 0.45) : o.alpha;
    const cx = bx + bw / 2, cy = by + bh / 2, R = Math.hypot(bw, bh) / 2 + 4; const n = Math.ceil(2 * R / gap); const shown = Math.floor(n * prog);
    const dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx; const t = o.t || 0;
    for (let i = 0; i < shown; i++) {
      const s = -R + i * gap; const jx = ink === 'paper' ? Math.sin(i * 1.3 + Math.floor(t * 8)) * 0.8 : 0;
      ctx.beginPath(); ctx.moveTo(cx + nx * s - dx * R + jx, cy + ny * s - dy * R); ctx.lineTo(cx + nx * s + dx * R + jx, cy + ny * s + dy * R); ctx.stroke();
    }
    ctx.restore();
  }
  // scan-line fill (dark ink): horizontal lines on an 8 px pitch, thickness = how lit the surface is
  function scanFill(ctx, clip, o = {}) {
    const [bx, by, bw, bh] = o.box; const pitch = o.pitch || 8; const lit = o.lit == null ? 0.5 : o.lit;
    ctx.save(); clip(ctx); ctx.clip(); ctx.fillStyle = o.color || C.white; ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    const th = Math.max(0.6, pitch * lit * 0.8); const prog = o.progress == null ? 1 : o.progress;
    for (let y = Math.floor(by / pitch) * pitch; y < by + bh; y += pitch) { if ((y - by) / bh > prog) break; ctx.fillRect(bx, y + (pitch - th) / 2, bw, th); }
    ctx.restore();
  }

  // ---------- text ----------
  const WEIGHT = { L: 200, M: 300, R: 400, S: 600, B: 600, X: 700 };
  function font(size, w = 'R') { return `${WEIGHT[w] || w} ${size}px AR, IN`; }
  function txt(ctx, s, x, y, o = {}) {
    ctx.save(); ctx.font = font(o.size || 32, o.w || 'R'); ctx.direction = o.dir || 'rtl';
    ctx.textAlign = o.align || 'right'; ctx.textBaseline = o.base || 'alphabetic';
    if (o.track) ctx.letterSpacing = o.track + 'px';
    ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.fillStyle = o.color || C.ink;
    ctx.fillText(s, x, y); const m = ctx.measureText(s).width; ctx.restore(); return m;
  }
  function measure(ctx, s, size, w = 'R', track = 0) { ctx.save(); ctx.font = font(size, w); if (track) ctx.letterSpacing = track + 'px'; const m = ctx.measureText(s).width; ctx.restore(); return m; }
  // Latin tokens (pairs, numbers, codes) — Inter
  function lat(ctx, s, x, y, o = {}) {
    ctx.save(); ctx.font = `${o.w || 400} ${o.size || 28}px IN`; ctx.direction = 'ltr'; ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'alphabetic';
    if (o.track) ctx.letterSpacing = o.track + 'px';
    ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.fillStyle = o.color || C.ink; ctx.fillText(s, x, y); const m = ctx.measureText(s).width; ctx.restore(); return m;
  }
  // text rising through a slot (clip between y0..y1)
  function slotText(ctx, s, x, y, o, clipY0, clipY1) {
    ctx.save(); ctx.beginPath(); ctx.rect(0, clipY0, W, clipY1 - clipY0); ctx.clip(); txt(ctx, s, x, y, o); ctx.restore();
  }
  // wipe-reveal text right-to-left (reading direction)
  function wipeText(ctx, s, x, y, o, p) {
    if (p <= 0) return; const m = measure(ctx, s, o.size, o.w, o.track);
    const align = o.align || 'right'; const left = align === 'right' ? x - m : align === 'center' ? x - m / 2 : x;
    ctx.save(); ctx.beginPath(); ctx.rect(left + m * (1 - p) - 4, y - o.size * 1.6, m * p + 8, o.size * 2.4); ctx.clip(); txt(ctx, s, x, y, o); ctx.restore();
  }

  // ---------- brand marks ----------
  let BP = null;
  function brandPaths() {
    if (BP) return BP; const src = G.BRAND_PATHS; BP = {};
    for (const k in src) BP[k] = { vb: src[k].vb, fills: src[k].fills.map((f) => ({ p: new Path2D(f.d), rule: f.rule })), strokes: src[k].strokes.map((s) => ({ p: new Path2D(s.d), w: s.w })) };
    return BP;
  }
  function drawMark(ctx, key, x, y, h, color, alpha = 1) { // x,y = top-left; h = height in px
    const m = brandPaths()[key]; const [vx, vy, vw, vh] = m.vb; const s = h / vh;
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-vx, -vy); ctx.fillStyle = color; ctx.strokeStyle = color; ctx.lineJoin = 'round';
    m.fills.forEach((f) => ctx.fill(f.p, f.rule)); m.strokes.forEach((st) => { ctx.lineWidth = st.w; ctx.stroke(st.p); }); ctx.restore();
    return vw * s;
  }
  // stacked Arabic logo: axi over العراق, keeps official geometry. (x,y)= top-left of the lockup, h = total height
  function logo(ctx, x, y, h, color, o = {}) {
    const m = brandPaths(); const a = m.logo_axi.vb, b = m.logo_iraq_ar.vb;
    const top = a[1], bottom = b[1] + b[3], left = Math.min(a[0], b[0]); const s = h / (bottom - top);
    const pa = o.axi == null ? 1 : o.axi, pb = o.iraq == null ? 1 : o.iraq;
    if (pa > 0) drawMark(ctx, 'logo_axi', x + (a[0] - left) * s, y + (a[1] - top) * s + (1 - pa) * 12, a[3] * s, color, (o.alpha == null ? 1 : o.alpha) * clamp(pa * 1.5));
    if (pb > 0) drawMark(ctx, 'logo_iraq_ar', x + (b[0] - left) * s, y + (b[1] - top) * s + (1 - pb) * 10, b[3] * s, color, (o.alpha == null ? 1 : o.alpha) * clamp(pb * 1.5));
    return (Math.max(a[0] + a[2], b[0] + b[2]) - left) * s;
  }
  function logoWidth(h) { const m = brandPaths(); const a = m.logo_axi.vb, b = m.logo_iraq_ar.vb; const s = h / (b[1] + b[3] - a[1]); return (Math.max(a[0] + a[2], b[0] + b[2]) - Math.min(a[0], b[0])) * s; }
  function xmark(ctx, cx, cy, h, color, alpha = 1) { const m = brandPaths().x_mark; const w = m.vb[2] / m.vb[3] * h; drawMark(ctx, 'x_mark', cx - w / 2, cy - h / 2, h, color, alpha); }

  // red focus triangles (brand device)
  function tri(ctx, x, y, s, dir, color = C.red, alpha = 1) { // dir: 'r','l','u','d','br','bl'
    ctx.save(); ctx.fillStyle = color; ctx.globalAlpha = alpha; ctx.beginPath();
    if (dir === 'r') { ctx.moveTo(x - s / 2, y - s * 0.6); ctx.lineTo(x + s / 2, y); ctx.lineTo(x - s / 2, y + s * 0.6); }
    else if (dir === 'l') { ctx.moveTo(x + s / 2, y - s * 0.6); ctx.lineTo(x - s / 2, y); ctx.lineTo(x + s / 2, y + s * 0.6); }
    else if (dir === 'u') { ctx.moveTo(x - s * 0.6, y + s / 2); ctx.lineTo(x, y - s / 2); ctx.lineTo(x + s * 0.6, y + s / 2); }
    else if (dir === 'd') { ctx.moveTo(x - s * 0.6, y - s / 2); ctx.lineTo(x, y + s / 2); ctx.lineTo(x + s * 0.6, y - s / 2); }
    else if (dir === 'tr') { ctx.moveTo(x - s, y); ctx.lineTo(x, y); ctx.lineTo(x, y + s); }
    else if (dir === 'br') { ctx.moveTo(x, y - s); ctx.lineTo(x, y); ctx.lineTo(x - s, y); }
    else if (dir === 'bl') { ctx.moveTo(x, y - s); ctx.lineTo(x, y); ctx.lineTo(x + s, y); }
    ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

  // ---------- market data ----------
  // deterministic OHLC series with a drift profile
  function series(n, seed, o = {}) {
    const r = rng(seed); let p = o.start || 100; const out = []; const drift = o.drift || (() => 0); const vol = o.vol || 1;
    for (let i = 0; i < n; i++) {
      const open = p; const d = drift(i / n) + (r() - 0.5) * 2 * vol; let close = open + d;
      const high = Math.max(open, close) + r() * vol * 0.9; const low = Math.min(open, close) - r() * vol * 0.9;
      out.push({ o: open, c: close, h: high, l: low }); p = close;
    }
    return out;
  }
  function sma(arr, n) { return arr.map((_, i) => { const a = arr.slice(Math.max(0, i - n + 1), i + 1); return a.reduce((s, v) => s + v, 0) / a.length; }); }

  G.AX = { W, H, C, INK, clamp, lerp, inv, spring, sp, expoOut, expoIn, expoInOut, eo, ei, eio, hexA, mixHex, rng,
    background, grid, polyLen, resample, subPath, boil, tracePts, line, rectPts, circPts, polyPts, hatch, scanFill,
    font, txt, lat, measure, slotText, wipeText, drawMark, logo, logoWidth, xmark, tri, roundRect, series, sma };
})(typeof window !== 'undefined' ? window : globalThis);
