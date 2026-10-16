// Axi Academy social ads (9:16) — shared kit. Every frame is a pure function of t.
// Fonts: Readex Pro (Arabic, AR) + Inter (Latin & digits, IN). Logo: the measured academy lockup (assets/lockup.js),
// arranged as the stacked mark (nib · axi · ACADEMY) for the vertical format.
(function (G) {
  'use strict';
  const W = 1080, H = 1920;
  const C = {
    red: '#E4002E', tip: G.LOCKUP.red, mint: '#5EE0BB', off: '#F9F9F9', white: '#FFFFFF', frost: '#EEF0F1', silver: '#C4C8CC',
    concrete: '#939699', charcoal: '#626466', graphite: '#393B40', carbon: '#242528', ink: '#090A0D', night: '#101114', gold: '#D9B45A',
  };
  // ---------------- math / easing ----------------
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
  const quintOut = (u) => 1 - Math.pow(1 - clamp(u), 5);
  const backOut = (u, s = 1.70158) => { u = clamp(u) - 1; return u * u * ((s + 1) * u + s) + 1; };
  const eo = (t, t0, d) => expoOut(inv(t0, t0 + d, t));
  const ei = (t, t0, d) => expoIn(inv(t0, t0 + d, t));
  const eio = (t, t0, d) => expoInOut(inv(t0, t0 + d, t));
  const co = (t, t0, d) => cubicOut(inv(t0, t0 + d, t));
  const cio = (t, t0, d) => cubicInOut(inv(t0, t0 + d, t));
  const qo = (t, t0, d) => quintOut(inv(t0, t0 + d, t));
  function spring(t, f = 3.2, z = 0.42) {
    if (t <= 0) return 0; const w = 2 * Math.PI * f;
    if (z < 1) { const wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t)); }
    return 1 - (1 + w * t) * Math.exp(-w * t);
  }
  const sp = (t, t0, f, z) => spring(t - t0, f, z);
  function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const noise = (x, seed = 0) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i + seed * 97), hash(i + 1 + seed * 97), u) * 2 - 1; };
  const hexA = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };
  function shake(t, hits, amp = 8, decay = 0.2, seed = 1) {
    let x = 0, y = 0, r = 0;
    for (const h of hits) {
      const d = t - h; if (d < 0 || d > decay * 4) continue; const k = Math.exp(-d / decay) * amp;
      x += noise(d * 38, seed + h * 7) * k; y += noise(d * 41 + 9, seed + h * 3) * k; r += noise(d * 30 + 4, seed + h) * k * 0.0012;
    }
    return { x, y, r };
  }
  // 128 bpm grid shared with the score: beat b → seconds
  const BPM = 128, BEAT = 60 / BPM, B = (b) => b * BEAT;

  // ---------------- type ----------------
  const AW = [200, 300, 400, 600, 700], IW = [300, 400, 600, 700, 800];
  const snapW = (w, arr) => arr.reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a));
  const arFont = (w, size) => `${snapW(w, AW)} ${size}px AR, IN`;
  const latFont = (w, size) => `${snapW(w, IW)} ${size}px IN`;
  function ar(ctx, s, x, y, o = {}) {
    ctx.save(); ctx.font = arFont(o.w || 400, o.size || 60); ctx.direction = 'rtl';
    ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.base || 'alphabetic'; ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha);
    ctx.fillStyle = o.color || C.white; ctx.fillText(s, x, y);
    const m = ctx.measureText(s).width; ctx.restore(); return m;
  }
  function arW(ctx, s, o = {}) { ctx.save(); ctx.font = arFont(o.w || 400, o.size || 60); ctx.direction = 'rtl'; const m = ctx.measureText(s).width; ctx.restore(); return m; }
  function lat(ctx, s, x, y, o = {}) {
    ctx.save(); ctx.font = latFont(o.w || 600, o.size || 40); ctx.direction = 'ltr'; ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.base || 'alphabetic';
    if (o.track) ctx.letterSpacing = o.track + 'px';
    ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha); ctx.fillStyle = o.color || C.white; ctx.fillText(s, x, y); const m = ctx.measureText(s).width; ctx.restore(); return m;
  }
  function latW(ctx, s, o = {}) { ctx.save(); ctx.font = latFont(o.w || 600, o.size || 40); if (o.track) ctx.letterSpacing = o.track + 'px'; const m = ctx.measureText(s).width; ctx.restore(); return m; }
  // a right-to-left line of mixed parts, rightmost first: [{t:'بونص إيداع'}, {t:'$50', lat:true}, …] — Latin tokens keep their own order
  function mixLine(ctx, parts, cx, y, o = {}) {
    const size = o.size || 60, gap = o.gap == null ? size * 0.28 : o.gap;
    const ws = parts.map((p) => (p.lat ? latW(ctx, p.t, { w: o.lw || 700, size: p.size || o.lsize || size }) : arW(ctx, p.t, { w: o.w, size: p.size || size })));
    const total = ws.reduce((a, b) => a + b, 0) + gap * (parts.length - 1);
    let xr = o.align === 'right' ? cx : o.align === 'left' ? cx + total : cx + total / 2;
    parts.forEach((p, i) => {
      const x = xr - ws[i] / 2, a = (o.alpha == null ? 1 : o.alpha);
      if (p.lat) lat(ctx, p.t, x, y, { w: o.lw || 700, size: p.size || o.lsize || size, color: p.color || o.color, alpha: a });
      else ar(ctx, p.t, x, y, { w: o.w, size: p.size || size, color: p.color || o.color, alpha: a });
      xr -= ws[i] + gap;
    });
    return total;
  }
  // Arabic letter units: ZWJ keeps the joined forms when letters move separately
  const ZWJ = '‍', RJOIN = 'اأإآٱدذرزوؤة', NOJOIN = ' ءـ.،؟!:0123456789$';
  const isMark = (ch) => /[ً-ٰٟ]/.test(ch);
  function units(s) {
    const out = []; const ch = [...s];
    for (let i = 0; i < ch.length; i++) {
      const c = ch[i]; if (isMark(c) && out.length) { out[out.length - 1].s += c; continue; }
      if (c === 'ل' && i + 1 < ch.length && 'اأإآ'.includes(ch[i + 1])) { out.push({ s: c + ch[i + 1], base: 'لا' }); i++; continue; }
      out.push({ s: c, base: c });
    }
    out.forEach((u, i) => {
      const p = out[i - 1], n = out[i + 1];
      const joinsNext = (b) => !(RJOIN.includes(b) || NOJOIN.includes(b) || b === 'لا' || /[A-Za-z0-9]/.test(b));
      const joining = (b) => !NOJOIN.includes(b) && !/[A-Za-z0-9]/.test(b);
      u.jp = !!(p && joinsNext(p.base) && joining(u.base)); u.jn = !!(n && joinsNext(u.base) && joining(n.base));
      u.draw = (u.jp ? ZWJ : '') + u.s + (u.jn ? ZWJ : ''); u.space = u.base === ' ';
    });
    return out;
  }
  const UCACHE = new Map();
  function layoutUnits(ctx, s, o) {
    const key = s + '|' + arFont(o.w || 400, o.size || 60); if (UCACHE.has(key)) return UCACHE.get(key);
    ctx.save(); ctx.font = arFont(o.w || 400, o.size || 60); ctx.direction = 'rtl';
    const us = units(s); let x = 0; us.forEach((u) => { u.w = ctx.measureText(u.draw).width; u.xr = -x; x += u.w; });
    ctx.restore(); const res = { us, total: x }; UCACHE.set(key, res); return res;
  }
  // per-letter animated Arabic: fn(i, n, u) → {dx, dy, sx, sy, rot, alpha, color}; returns width
  function arUnits(ctx, s, cx, y, o, fn) {
    const L = layoutUnits(ctx, s, o); const n = L.us.length;
    const right = o.align === 'right' ? cx : o.align === 'left' ? cx + L.total : cx + L.total / 2;
    ctx.save(); ctx.font = arFont(o.w || 400, o.size || 60); ctx.direction = 'rtl'; ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = o.color || C.white;
    L.us.forEach((u, i) => {
      if (u.space) return; const a = fn ? fn(i, n, u) : {}; const al = (o.alpha == null ? 1 : o.alpha) * (a.alpha == null ? 1 : a.alpha); if (al <= 0.001) return;
      const xr = right + u.xr; ctx.save(); ctx.globalAlpha *= al;
      const px = xr - u.w / 2, py = y - (o.size || 60) * 0.35;
      ctx.translate(px + (a.dx || 0), py + (a.dy || 0)); if (a.rot) ctx.rotate(a.rot); ctx.scale(a.sx == null ? 1 : a.sx, a.sy == null ? 1 : a.sy);
      if (a.color) ctx.fillStyle = a.color; ctx.fillText(u.draw, xr - px, y - py); ctx.restore();
    });
    ctx.restore(); return L.total;
  }
  function wrapAr(ctx, s, maxW, o) {
    const words = s.split(' '); const lines = []; let cur = '';
    for (const w of words) { const t = cur ? cur + ' ' + w : w; if (arW(ctx, t, o) > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
    if (cur) lines.push(cur); return lines;
  }
  // a line that appears word by word (RTL), each word rising out of a mask: o.t0 start, o.st stagger, o.d duration
  function arWords(ctx, s, cx, y, t, o) {
    const ws = s.split(' '); const sz = o.size || 60; const gap = arW(ctx, ' ', o);
    const wid = ws.map((w) => arW(ctx, w, o)); const total = wid.reduce((a, b) => a + b, 0) + gap * (ws.length - 1);
    let xr = (o.align === 'right' ? cx : o.align === 'left' ? cx + total : cx + total / 2);
    ws.forEach((w, i) => {
      const u = eo(t, o.t0 + i * (o.st || 0.08), o.d || 0.5);
      if (u > 0) {
        ctx.save(); ctx.beginPath(); ctx.rect(xr - wid[i] - 20, y - sz * 1.25, wid[i] + 40, sz * 1.7); ctx.clip();
        ar(ctx, w, xr - wid[i] / 2, y + (1 - u) * sz * 1.1, { ...o, align: 'center', color: (o.colors && o.colors[i]) || o.color, alpha: (o.alpha == null ? 1 : o.alpha) * clamp(u * 1.6) });
        ctx.restore();
      }
      xr -= wid[i] + gap;
    });
    return total;
  }

  // ---------------- brand marks ----------------
  const BP = {};
  (() => { const src = G.BRAND_PATHS; for (const k in src) BP[k] = { vb: src[k].vb, fills: (src[k].fills || []).map((f) => new Path2D(f.d)) }; })();
  function xmark(ctx, cx, cy, h, color, alpha = 1) {
    const m = BP.x_mark, [vx, vy, vw, vh] = m.vb, s = h / vh;
    ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(cx - vw * s / 2, cy - h / 2); ctx.scale(s, s); ctx.translate(-vx, -vy); ctx.fillStyle = color; m.fills.forEach((p) => ctx.fill(p)); ctx.restore();
  }
  function watermark(ctx, color, a = 0.6) { const h = W * 0.04 * 0.89; xmark(ctx, 54 + W * 0.02, H - 96 - h / 2, h, color, a); }

  // ---------------- academy logo (lockup space = the client's 2000x1125 image) ----------------
  const LK = G.LOCKUP, AX = LK.axis, YT = LK.nib.top_y, YB = LK.nib.bot_y, HWT = LK.tri.hw, UP = LK.nib.upper, LO = LK.nib.lower, S = LK.slot;
  function slotInto(p) {
    const hw = S.hw, y0 = S.body_y0, y1 = S.body_y1, bh = S.body_hw, r = S.body_r, cy = S.cap_cy;
    p.moveTo(AX - hw, YT); p.lineTo(AX - hw, y0); p.lineTo(AX - bh + r, y0); p.arcTo(AX - bh, y0, AX - bh, y0 + r, r);
    p.lineTo(AX - bh, y1 - r); p.arcTo(AX - bh, y1, AX - bh + r, y1, r); p.lineTo(AX - hw, y1); p.lineTo(AX - hw, cy);
    p.arc(AX, cy, hw, Math.PI, 0, true);
    p.lineTo(AX + hw, y1); p.lineTo(AX + bh - r, y1); p.arcTo(AX + bh, y1, AX + bh, y1 - r, r);
    p.lineTo(AX + bh, y0 + r); p.arcTo(AX + bh, y0, AX + bh - r, y0, r); p.lineTo(AX + hw, y0); p.lineTo(AX + hw, YT);
  }
  function outer(p) {
    p.lineTo(AX + UP[0][0], UP[0][1]); p.bezierCurveTo(AX + UP[1][0], UP[1][1], AX + UP[2][0], UP[2][1], AX + UP[3][0], UP[3][1]);
    p.bezierCurveTo(AX + LO[1][0], LO[1][1], AX + LO[2][0], LO[2][1], AX + LO[3][0], LO[3][1]);
    p.lineTo(AX - LO[3][0], LO[3][1]); p.bezierCurveTo(AX - LO[2][0], LO[2][1], AX - LO[1][0], LO[1][1], AX - LO[0][0], LO[0][1]);
    p.bezierCurveTo(AX - UP[2][0], UP[2][1], AX - UP[1][0], UP[1][1], AX - UP[0][0], UP[0][1]);
  }
  const NIB = (() => { const p = new Path2D(); slotInto(p); outer(p); p.closePath(); return p; })();
  const NIB_OUTER = (() => { const p = new Path2D(); p.moveTo(AX - HWT, YT); p.lineTo(AX + HWT, YT); outer(p); p.closePath(); return p; })();
  const SLOT = (() => { const p = new Path2D(); slotInto(p); p.closePath(); return p; })();
  const TRI = (() => { const p = new Path2D(); p.moveTo(AX - HWT, YT); p.lineTo(AX, LK.tri.apex_y); p.lineTo(AX + HWT, YT); p.closePath(); return p; })();
  const BARS = LK.bars.map((b) => { const p = new Path2D(); p.roundRect(AX - b.hl, b.cy - b.h / 2, b.hl * 2, b.h, b.h / 2); return p; });
  const AXI = LK.axi.letters.map((L) => {
    const p = new Path2D(); let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    L.polys.forEach((poly) => { poly.pts.forEach(([x, y], i) => { (i ? p.lineTo(x, y) : p.moveTo(x, y)); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }); p.closePath(); });
    return { path: p, box: [x0, y0, x1, y1] };
  });
  const AXI_BOX = [Math.min(...AXI.map((l) => l.box[0])), Math.min(...AXI.map((l) => l.box[1])), Math.max(...AXI.map((l) => l.box[2])), Math.max(...AXI.map((l) => l.box[3]))];
  const AT = LK.academy.T, AB = LK.academy.B, TAU = Math.PI * 2;
  function ellPts(cx, cy, rx, ry, a0, a1, n) { const o = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; o.push([cx + rx * Math.cos(a), cy - ry * Math.sin(a)]); } return o; }
  function acadPolys(k, p) {
    const t = AT, b = AB;
    if (k === 'A') { const [cx, hb, wl, ft, yc, wh] = p, y1 = yc - wh / 2, y2 = yc + wh / 2, xo = (y, s) => cx + s * (ft / 2 + (hb - ft / 2) * (y - t) / (b - t));
      return [[[cx - ft / 2, t], [cx - ft / 2 + wl, t], [cx - hb + wl, b], [cx - hb, b]], [[cx + ft / 2 - wl, t], [cx + ft / 2, t], [cx + hb, b], [cx + hb - wl, b]], [[xo(y1, -1), y1], [xo(y2, -1), y2], [xo(y2, 1), y2], [xo(y1, 1), y1]]]; }
    if (k === 'C') { const [cx, cy, rx, ry, w, a1, a2] = p; return [ellPts(cx, cy, rx, ry, a1, TAU - a2, 120).concat(ellPts(cx, cy, rx - w, ry - w, TAU - a2, a1, 120))]; }
    if (k === 'D') { const [xl, ws, xb, rx, wh, wc] = p, cy = (t + b) / 2, ry = (b - t) / 2;
      return [{ eo: true, outer: [[xl, b], [xl, t]].concat(ellPts(xb, cy, rx, ry, Math.PI / 2, -Math.PI / 2, 90)), inner: [[xl + ws, b - wh], [xl + ws, t + wh]].concat(ellPts(xb, cy, Math.max(1, rx - wc), ry - wh, Math.PI / 2, -Math.PI / 2, 90)) }]; }
    if (k === 'E') { const [xl, ws, wt, wm, wb, Lt, Lm, Lb, ym] = p, R = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
      return [R(xl, xl + ws, t, b), R(xl, xl + Lt, t, t + wt), R(xl, xl + Lm, ym - wm / 2, ym + wm / 2), R(xl, xl + Lb, b - wb, b)]; }
    if (k === 'M') { const [xl, xr, ws, wd, yv, fv, ds] = p, cx = (xl + xr) / 2, R = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
      return [R(xl, xl + ws, t, b), R(xr - ws, xr, t, b), [[xl + ds, t], [xl + ds + wd, t], [cx + fv / 2, yv], [cx - fv / 2, yv]], [[xr - ds, t], [xr - ds - wd, t], [cx - fv / 2, yv], [cx + fv / 2, yv]]]; }
    if (k === 'Y') { const [cx, hw, wd, yj, ws] = p;
      return [[[cx - hw, t], [cx - hw + wd, t], [cx + ws / 2, yj], [cx - ws / 2, yj]], [[cx + hw, t], [cx + hw - wd, t], [cx - ws / 2, yj], [cx + ws / 2, yj]], [[cx - ws / 2, yj], [cx + ws / 2, yj], [cx + ws / 2, b], [cx - ws / 2, b]]]; }
    return [];
  }
  const ACAD = LK.academy.letters.map((L) => {
    const p = new Path2D(); let x0 = 1e9, x1 = -1e9;
    const add = (pts) => { pts.forEach(([x, y], i) => { (i ? p.lineTo(x, y) : p.moveTo(x, y)); x0 = Math.min(x0, x); x1 = Math.max(x1, x); }); p.closePath(); };
    let eoRule = false;
    acadPolys(L.k, L.p).forEach((q) => { if (q.eo) { add(q.outer); add(q.inner); eoRule = true; } else add(q); });
    return { path: p, eo: eoRule, box: [x0, AT, x1, AB] };
  });
  const ACAD_BOX = [Math.min(...ACAD.map((l) => l.box[0])), AT, Math.max(...ACAD.map((l) => l.box[2])), AB];
  // stacked layout (from the client's stacked logo): nib group on top, axi, then ACADEMY; units = lockup units, origin at the apex
  const NIB_TOP = LK.tri.apex_y, NIB_BOT = LK.bars[1].cy + LK.bars[1].h / 2, NIB_H = NIB_BOT - NIB_TOP;
  const SA = 0.777, SC_ = 0.714, GAP1 = 0.0528 * NIB_H, GAP2 = 0.0599 * NIB_H;
  const AXI_TOP = NIB_H + GAP1, AXI_H = (AXI_BOX[3] - AXI_BOX[1]) * SA, AC_TOP = AXI_TOP + AXI_H + GAP2, STACK_H = AC_TOP + (AB - AT) * SC_;
  // draw the nib group (nib + tip + bars) with apex at (x, y) and scale s; o.nib/o.tip/o.bars alphas, o.white/o.red colours
  function nibGroup(ctx, x, y, s, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-AX, -NIB_TOP);
    const wc = o.white || C.white;
    if ((o.nib == null ? 1 : o.nib) > 0) { ctx.save(); ctx.globalAlpha *= o.nib == null ? 1 : o.nib; ctx.fillStyle = wc; ctx.fill(NIB); ctx.restore(); }
    BARS.forEach((bp, i) => { const a = o.bars == null ? 1 : Array.isArray(o.bars) ? o.bars[i] : o.bars; if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = wc; ctx.fill(bp); ctx.restore(); } });
    if ((o.tip == null ? 1 : o.tip) > 0) { ctx.save(); ctx.globalAlpha *= o.tip == null ? 1 : o.tip; ctx.fillStyle = o.red || C.tip; ctx.fill(TRI); ctx.restore(); }
    ctx.restore();
  }
  function axiWord(ctx, cx, top, s, color = C.white, alpha = 1, per) {  // per(i) → {dx,dy,alpha,s}
    ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(cx, top); ctx.scale(s, s); ctx.translate(-(AXI_BOX[0] + AXI_BOX[2]) / 2, -AXI_BOX[1]);
    AXI.forEach((L, i) => {
      const a = per ? per(i) : {}; if ((a.alpha == null ? 1 : a.alpha) <= 0) return;
      ctx.save(); ctx.globalAlpha *= a.alpha == null ? 1 : a.alpha; ctx.translate(a.dx || 0, a.dy || 0);
      ctx.fillStyle = color; ctx.fill(L.path, 'evenodd'); ctx.strokeStyle = color; ctx.lineWidth = 2 * LK.axi.grow; ctx.lineJoin = 'miter'; ctx.stroke(L.path); ctx.restore();
    });
    ctx.restore();
  }
  function academyWord(ctx, cx, top, s, color = C.white, alpha = 1, per) {
    ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(cx, top); ctx.scale(s, s); ctx.translate(-(ACAD_BOX[0] + ACAD_BOX[2]) / 2, -AT);
    ACAD.forEach((L, i) => {
      const a = per ? per(i) : {}; if ((a.alpha == null ? 1 : a.alpha) <= 0) return;
      ctx.save(); ctx.globalAlpha *= a.alpha == null ? 1 : a.alpha; ctx.translate(a.dx || 0, a.dy || 0); ctx.fillStyle = color; ctx.fill(L.path, L.eo ? 'evenodd' : 'nonzero'); ctx.restore();
    });
    ctx.restore();
  }
  // full stacked lockup: apex at (cx, top), scale s (px per lockup unit). o: {nib, tip, bars, axi, acad, axiPer, acadPer, color}
  function stacked(ctx, cx, top, s, o = {}) {
    nibGroup(ctx, cx, top, s, o);
    const pa = o.axi == null ? 1 : o.axi, pc = o.acad == null ? 1 : o.acad;
    if (pa > 0) axiWord(ctx, cx - 6.4 * s, top + AXI_TOP * s + (1 - pa) * 30 * s, SA * s, o.color, clamp(pa * 1.4), o.axiPer);
    if (pc > 0) academyWord(ctx, cx, top + AC_TOP * s + (1 - pc) * 20 * s, SC_ * s, o.color, clamp(pc * 1.4), o.acadPer);
    return STACK_H * s;
  }

  // ---------------- backgrounds ----------------
  const BGL = document.createElement('canvas'); BGL.width = W; BGL.height = H;
  (() => { const g = BGL.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, H); LK.bg.forEach(([p, r, gg, b]) => gr.addColorStop(p, `rgb(${r},${gg},${b})`)); g.fillStyle = gr; g.fillRect(0, 0, W, H); })();
  const BGD = document.createElement('canvas'); BGD.width = W; BGD.height = H;
  (() => { const g = BGD.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#1C1E22'); gr.addColorStop(1, '#0B0D0D'); g.fillStyle = gr; g.fillRect(0, 0, W, H); })();
  function bgLight(ctx, a = 1) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(BGL, 0, 0); ctx.restore(); }
  function bgDark(ctx, a = 1) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(BGD, 0, 0); ctx.restore(); }
  // rising wipe from dark to light (the light rises from the bottom), u 0..1
  function riseWipe(ctx, u, line = true) {
    if (u <= 0) return; const e = lerp(H + 40, -60, u);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(0, e, W, H - e + 10); ctx.clip(); ctx.drawImage(BGL, 0, 0); ctx.restore();
    if (line && u < 1) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 0.85 * (1 - u); ctx.fillStyle = C.white; ctx.fillRect(0, e - 2, W, 4); ctx.restore(); }
  }
  const GR = document.createElement('canvas'); GR.width = GR.height = 512;
  (() => { const g = GR.getContext('2d'), id = g.createImageData(512, 512), r = rng(7); for (let i = 0; i < id.data.length; i += 4) { const v = Math.floor(r() * 256); id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } g.putImageData(id, 0, 0); })();
  function grain(ctx, t, a = 0.035, frozen = false) {
    const f = frozen ? 7 : Math.floor(t * 60), ox = Math.floor(hash(f) * 512), oy = Math.floor(hash(f + 0.5) * 512);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'overlay';
    for (let y = -oy; y < H; y += 512) for (let x = -ox; x < W; x += 512) ctx.drawImage(GR, x, y); ctx.restore();
  }

  // ---------------- components ----------------
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
  function disc(ctx, x, y, r, color, a = 1) { if (r <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  function ring(ctx, x, y, r, w, color, a = 1) { if (r <= 0 || a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = color; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
  // dark glass card (brand spec: rgba(20,22,26,.72), white 25% border, radius 18 → 26 at this size)
  function glass(ctx, x, y, w, h, o = {}) {
    ctx.save(); rr(ctx, x, y, w, h, o.r || 26); ctx.fillStyle = o.fill || 'rgba(20,22,26,0.74)'; ctx.fill();
    ctx.lineWidth = o.lw || 2; ctx.strokeStyle = o.stroke || 'rgba(255,255,255,0.22)'; ctx.stroke(); ctx.restore();
  }
  function ripple(ctx, x, y, t, t0, o = {}) {
    const d = t - t0; if (d < 0 || d > 1.2) return;
    for (let k = 0; k < (o.n || 3); k++) { const dk = d - k * 0.09; if (dk <= 0) continue; const u = clamp(dk / (o.dur || 0.8)); ring(ctx, x, y, lerp(o.r0 || 10, o.r1 || 260, expoOut(u)), (o.w || 3) * (1 - u) + 0.5, o.color || C.white, (1 - u) * (o.a || 0.9)); }
  }
  function sparks(ctx, x, y, t, t0, o = {}) {
    const d = t - t0; if (d < 0 || d > 0.6) return; const r = rng(o.seed || 5); const n = o.n || 10;
    ctx.save(); ctx.strokeStyle = o.color || C.white; ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2 + r() * 0.4, sp0 = (o.len || 120) * (0.7 + r() * 0.6), u = expoOut(clamp(d / 0.45)), r0 = (o.r0 || 20) + sp0 * u * 0.55, r1 = (o.r0 || 20) + sp0 * u;
      ctx.globalAlpha = (1 - clamp(d / 0.5)) * (o.a || 1); ctx.lineWidth = (o.w || 4) * (1 - u * 0.6);
      ctx.beginPath(); ctx.moveTo(x + Math.cos(ang) * r0, y + Math.sin(ang) * r0); ctx.lineTo(x + Math.cos(ang) * r1, y + Math.sin(ang) * r1); ctx.stroke();
    }
    ctx.restore();
  }
  // light sweep across a pill centred at the current origin
  function shimmer(ctx, t, t0, w, h, period = 1.0, dur = 0.42) {
    if (t < t0) return; const u = ((t - t0) % period) / dur; if (u >= 1) return;
    ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.clip(); ctx.transform(1, 0, -0.35, 1, 0, 0);
    const bx = lerp(w / 2 + 200, -w / 2 - 200, cubicInOut(u)), g = ctx.createLinearGradient(bx - 110, 0, bx + 110, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(bx - 110, -h, 220, h * 2); ctx.restore();
  }
  // red CTA pill with label, pumping on beats from tb
  function ctaPill(ctx, cx, cy, t, t0, label, o = {}) {
    const u = sp(t, t0, 2.6, 0.5); if (u <= 0) return;
    const w = o.w || 560, h = o.h || 116;
    const tb = o.tb == null ? t0 + 0.4 : o.tb, ph = t > tb ? (t - tb) % (2 * BEAT) : 99, pump = 1 + 0.035 * Math.exp(-ph / 0.12);
    ctx.save(); ctx.translate(cx, cy); ctx.scale(u * pump, u * pump);
    rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = C.red; ctx.fill();
    ar(ctx, label, 0, h * 0.17, { w: 700, size: o.size || 52, color: C.white });
    shimmer(ctx, t, t0 + 0.5, w, h, 1.6, 0.5);
    ctx.restore();
  }
  // odometer digits
  function wheels(ctx, value, cx, y, o = {}) {
    const nd = o.digits || 2, size = o.size || 120, lh = size * 1.12;
    ctx.save(); ctx.font = latFont(o.w || 800, size); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.direction = 'ltr';
    const dw = ctx.measureText('0').width, gap = o.gap == null ? size * 0.02 : o.gap, total = nd * dw + (nd - 1) * gap; let x = cx - total / 2 + dw / 2; const v = Math.max(0, value);
    for (let k = nd - 1; k >= 0; k--) {
      const p = Math.pow(10, k), dval = Math.floor(v / p) % 10; let frac = k === 0 ? v - Math.floor(v) : clamp((v % p) - (p - 1));
      ctx.save(); ctx.beginPath(); ctx.rect(x - dw, y - size * 1.0, dw * 2, size * 1.22); ctx.clip(); ctx.fillStyle = o.color || C.white;
      ctx.fillText(String(dval), x, y - frac * lh); ctx.fillText(String((dval + 1) % 10), x, y - frac * lh + lh); ctx.restore(); x += dw + gap;
    }
    ctx.restore(); return total;
  }
  const RISK = 'تنطوي عقود الفروقات والمنتجات المشتقة خارج البورصة على مخاطر عالية قد تؤدي إلى خسارة رأس المال. المحتوى التعليمي والتحليلي لا يُعدّ نصيحة استثمارية. قد لا يكون هذا المحتوى متاحاً في منطقتك. يُرجى الرجوع إلى شروط الخدمة.';
  function riskStrip(ctx, t, t0, y, o = {}) {
    const u = eo(t, t0, 0.5); if (u <= 0) return 0; const dark = !!o.dark;
    const pad = 32, x = 72, w = W - 144, so = { w: 400, size: o.size || 26 };
    const lines = wrapAr(ctx, RISK, w - pad * 2, so), lh = so.size * 1.6, h = lines.length * lh + pad * 1.3;
    ctx.save(); ctx.translate(0, (1 - u) * 60); ctx.globalAlpha *= u;
    rr(ctx, x, y, w, h, 22); ctx.fillStyle = dark ? 'rgba(9,10,13,0.78)' : 'rgba(255,255,255,0.92)'; ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = dark ? 'rgba(255,255,255,0.18)' : 'rgba(9,10,13,0.10)'; ctx.stroke();
    lines.forEach((ln, i) => ar(ctx, ln, x + w - pad, y + pad * 0.7 + lh * (i + 0.72), { ...so, align: 'right', color: dark ? 'rgba(255,255,255,0.9)' : C.graphite }));
    ctx.restore(); return h;
  }
  // X sting: the official X drops onto charcoal, lands with ripple + shake (returns shake offsets)
  function xSting(ctx, t, t0, dur = 0.75) {
    const d = t - t0; if (d < 0 || d > dur + 0.05) return;
    bgDark(ctx);
    const land = t0 + 0.2, u = ei(t, t0, 0.2), s = d < 0.2 ? lerp(2.6, 1, u) : 1 + 0.08 * Math.exp(-(t - land) / 0.08) * Math.cos((t - land) * 40);
    ripple(ctx, W / 2, H / 2, t, land, { r0: 60, r1: 560, w: 6, n: 2, a: 0.6 });
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(s, s); xmark(ctx, 0, 0, 230, C.white, clamp(d / 0.08)); ctx.restore();
  }

  G.K = {
    W, H, C, BPM, BEAT, B, clamp, lerp, inv, smooth, expoOut, expoIn, expoInOut, cubicOut, cubicIn, cubicInOut, quintOut, backOut, eo, ei, eio, co, cio, qo, spring, sp, rng, hash, noise, hexA, shake,
    arFont, latFont, ar, arW, lat, latW, mixLine, units, layoutUnits, arUnits, wrapAr, arWords, xmark, watermark,
    NIB, NIB_OUTER, SLOT, TRI, BARS, AXI, ACAD, AX, NIB_TOP, NIB_H, STACK_H, AXI_TOP, AC_TOP, nibGroup, axiWord, academyWord, stacked,
    bgLight, bgDark, riseWipe, grain, rr, disc, ring, glass, ripple, sparks, shimmer, ctaPill, wheels, RISK, riskStrip, xSting,
  };
})(window);
