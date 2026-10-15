// Axi Academy promo kit (9:16) — every frame is a pure function of t. Shared by version A (kinetic type) and B (SaaS UI).
(function (G) {
  const W = 1080, H = 1920;
  const C = {
    red: '#E4002E', coral: '#FF3745', mint: '#5EE0BB', off: '#F9F9F9', white: '#FFFFFF', frost: '#EEF0F1', silver: '#C4C8CC',
    concrete: '#939699', charcoal: '#626466', graphite: '#393B40', carbon: '#242528', ink: '#090A0D', slate: '#607880', mist: '#B5C8CD', night: '#101114',
  };
  // ---------- math / easing ----------
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const inv = (a, b, x) => clamp((x - a) / (b - a));
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
  // damped spring 0 -> 1 (f = Hz, z = damping ratio; z < 1 overshoots)
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
  const mix = (h1, h2, t) => {
    const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16); t = clamp(t);
    const r = Math.round(lerp((a >> 16) & 255, (b >> 16) & 255, t)), g = Math.round(lerp((a >> 8) & 255, (b >> 8) & 255, t)), bl = Math.round(lerp(a & 255, b & 255, t));
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1);
  };
  // impact shake: sum of decaying noise kicks at the listed times
  function shake(t, hits, amp = 8, decay = 0.22, seed = 1) {
    let x = 0, y = 0, r = 0;
    for (const h of hits) {
      const d = t - h; if (d < 0 || d > decay * 4) continue;
      const k = Math.exp(-d / decay) * amp;
      x += noise(d * 38, seed + h * 7) * k; y += noise(d * 41 + 9, seed + h * 3) * k; r += noise(d * 30 + 4, seed + h) * k * 0.0012;
    }
    return { x, y, r };
  }

  // ---------- fonts ----------
  // Readex Pro variable: families RX0..RX100 (HEXP in steps of 5), weight 160..700 per call. Inter variable: IN.
  const arFont = (w, size, hexp = 0) => `${Math.round(clamp(w, 160, 700))} ${size}px RX${Math.round(clamp(hexp, 0, 100) / 5) * 5}`;
  const latFont = (w, size) => `${Math.round(clamp(w, 100, 900))} ${size}px IN`;
  function ar(ctx, s, x, y, o = {}) {
    ctx.save(); ctx.font = arFont(o.w || 400, o.size || 60, o.hexp || 0); ctx.direction = 'rtl';
    ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.base || 'alphabetic'; ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha);
    if (o.stroke) { ctx.lineWidth = o.stroke; ctx.strokeStyle = o.color || C.ink; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); }
    else { ctx.fillStyle = o.color || C.ink; ctx.fillText(s, x, y); }
    const m = ctx.measureText(s).width; ctx.restore(); return m;
  }
  function arW(ctx, s, o = {}) { ctx.save(); ctx.font = arFont(o.w || 400, o.size || 60, o.hexp || 0); ctx.direction = 'rtl'; const m = ctx.measureText(s).width; ctx.restore(); return m; }
  function lat(ctx, s, x, y, o = {}) {
    ctx.save(); ctx.font = latFont(o.w || 500, o.size || 40); ctx.direction = 'ltr'; ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.base || 'alphabetic';
    if (o.track) ctx.letterSpacing = o.track + 'px';
    ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha); ctx.fillStyle = o.color || C.ink; ctx.fillText(s, x, y); const m = ctx.measureText(s).width; ctx.restore(); return m;
  }
  function latW(ctx, s, o = {}) { ctx.save(); ctx.font = latFont(o.w || 500, o.size || 40); if (o.track) ctx.letterSpacing = o.track + 'px'; const m = ctx.measureText(s).width; ctx.restore(); return m; }
  // a right-to-left line of mixed parts: [{t:'لأول'}, {t:'1000', lat:true}, {t:'طالب'}]; first part is rightmost. returns total width
  function mixLine(ctx, parts, cx, y, o = {}) {
    const gap = o.gap == null ? (o.size || 60) * 0.28 : o.gap;
    const ws = parts.map((p) => (p.lat ? latW(ctx, p.t, { w: p.w || o.lw || 700, size: p.size || o.lsize || o.size || 60 }) : arW(ctx, p.t, { w: p.w || o.w, size: p.size || o.size, hexp: o.hexp })));
    const total = ws.reduce((a, b) => a + b, 0) + gap * (parts.length - 1);
    let xr = (o.align === 'right' ? cx : o.align === 'left' ? cx + total : cx + total / 2);
    parts.forEach((p, i) => {
      const x = xr - ws[i] / 2; const a = (o.alpha == null ? 1 : o.alpha) * (p.alpha == null ? 1 : p.alpha);
      if (p.lat) lat(ctx, p.t, x, y + (p.dy || 0), { w: p.w || o.lw || 700, size: p.size || o.lsize || o.size || 60, color: p.color || o.color, alpha: a });
      else ar(ctx, p.t, x, y + (p.dy || 0), { w: p.w || o.w, size: p.size || o.size, hexp: o.hexp, color: p.color || o.color, alpha: a });
      xr -= ws[i] + gap;
    });
    return total;
  }

  // ---------- Arabic letter units (ZWJ keeps the joined forms when letters move separately) ----------
  const ZWJ = '‍';
  const RJOIN = 'اأإآٱدذرزوؤة'; // join only to the previous letter
  const NOJOIN = ' ءـ.،؟!:0123456789';
  const isMark = (ch) => /[ً-ٰٟ]/.test(ch);
  function units(s) {
    const out = []; const ch = [...s];
    for (let i = 0; i < ch.length; i++) {
      const c = ch[i]; if (isMark(c) && out.length) { out[out.length - 1].s += c; continue; }
      if (c === 'ل' && i + 1 < ch.length && 'اأإآ'.includes(ch[i + 1])) { out.push({ s: c + ch[i + 1], base: 'لا' }); i++; continue; }
      out.push({ s: c, base: c });
    }
    out.forEach((u, i) => {
      const p = out[i - 1], n = out[i + 1];
      const joinsNext = (b) => !(RJOIN.includes(b) || NOJOIN.includes(b) || b === 'لا');
      const joining = (b) => !NOJOIN.includes(b);
      u.jp = !!(p && joinsNext(p.base) && joining(u.base));
      u.jn = !!(n && joinsNext(u.base) && joining(n.base));
      u.draw = (u.jp ? ZWJ : '') + u.s + (u.jn ? ZWJ : '');
      u.space = u.base === ' ';
    });
    return out;
  }
  const UCACHE = new Map();
  // layout units for (s, font) -> [{draw, w, xr}] with xr relative to the right edge (0 = right edge)
  function layoutUnits(ctx, s, o) {
    const key = s + '|' + arFont(o.w || 400, o.size || 60, o.hexp || 0);
    if (UCACHE.has(key)) return UCACHE.get(key);
    ctx.save(); ctx.font = arFont(o.w || 400, o.size || 60, o.hexp || 0); ctx.direction = 'rtl';
    const us = units(s); let x = 0;
    us.forEach((u) => { u.w = ctx.measureText(u.draw).width; u.xr = -x; x += u.w; });
    const total = x; ctx.restore();
    const res = { us, total }; UCACHE.set(key, res); return res;
  }
  // per-unit animated Arabic: fn(i, n, u) -> {dx, dy, sx, sy, rot, alpha} ; returns total width
  function arUnits(ctx, s, cx, y, o, fn) {
    const L = layoutUnits(ctx, s, o); const n = L.us.length;
    const right = o.align === 'right' ? cx : o.align === 'left' ? cx + L.total : cx + L.total / 2;
    ctx.save(); ctx.font = arFont(o.w || 400, o.size || 60, o.hexp || 0); ctx.direction = 'rtl'; ctx.textAlign = 'right'; ctx.textBaseline = o.base || 'alphabetic';
    ctx.fillStyle = o.color || C.ink;
    L.us.forEach((u, i) => {
      if (u.space) return; const a = fn ? fn(i, n, u) : {}; const al = (o.alpha == null ? 1 : o.alpha) * (a.alpha == null ? 1 : a.alpha); if (al <= 0.001) return;
      const xr = right + u.xr; ctx.save(); ctx.globalAlpha *= al;
      const pivx = xr - u.w / 2, pivy = y - (o.size || 60) * 0.35;
      ctx.translate(pivx + (a.dx || 0), pivy + (a.dy || 0)); if (a.rot) ctx.rotate(a.rot); ctx.scale(a.sx == null ? 1 : a.sx, a.sy == null ? 1 : a.sy);
      if (a.color) ctx.fillStyle = a.color;
      ctx.fillText(u.draw, xr - pivx, y - pivy); ctx.restore();
    });
    ctx.restore(); return L.total;
  }

  // ---------- brand marks (official paths) ----------
  let BP = null;
  function brandPaths() {
    if (BP) return BP; const src = G.BRAND_PATHS; BP = {};
    for (const k in src) BP[k] = { vb: src[k].vb, fills: (src[k].fills || []).map((f) => ({ p: new Path2D(f.d), rule: f.rule })), strokes: (src[k].strokes || []).map((s) => ({ p: new Path2D(s.d), w: s.w })) };
    return BP;
  }
  function drawMark(ctx, key, x, y, h, color, alpha = 1) {
    const m = brandPaths()[key]; const [vx, vy, vw, vh] = m.vb; const s = h / vh;
    ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-vx, -vy); ctx.fillStyle = color; ctx.strokeStyle = color; ctx.lineJoin = 'round';
    m.fills.forEach((f) => ctx.fill(f.p, f.rule)); m.strokes.forEach((st) => { ctx.lineWidth = st.w; ctx.stroke(st.p); }); ctx.restore();
    return vw * s;
  }
  // stacked Arabic logo (axi over العراق), (x,y) top-left, h = lockup height
  function logo(ctx, x, y, h, color, o = {}) {
    const m = brandPaths(); const a = m.logo_axi.vb, b = m.logo_iraq_ar.vb;
    const top = a[1], bottom = b[1] + b[3], left = Math.min(a[0], b[0]); const s = h / (bottom - top);
    const pa = o.axi == null ? 1 : o.axi, pb = o.iraq == null ? 1 : o.iraq, al = o.alpha == null ? 1 : o.alpha;
    if (pa > 0) drawMark(ctx, 'logo_axi', x + (a[0] - left) * s, y + (a[1] - top) * s + (1 - pa) * h * 0.06, a[3] * s, color, al * clamp(pa * 1.5));
    if (pb > 0) drawMark(ctx, 'logo_iraq_ar', x + (b[0] - left) * s, y + (b[1] - top) * s + (1 - pb) * h * 0.05, b[3] * s, color, al * clamp(pb * 1.5));
    return (Math.max(a[0] + a[2], b[0] + b[2]) - left) * s;
  }
  function logoW(h) { const m = brandPaths(); const a = m.logo_axi.vb, b = m.logo_iraq_ar.vb; const s = h / (b[1] + b[3] - a[1]); return (Math.max(a[0] + a[2], b[0] + b[2]) - Math.min(a[0], b[0])) * s; }
  function logoC(ctx, cx, cy, h, color, o) { const w = logoW(h); return logo(ctx, cx - w / 2, cy - h / 2, h, color, o); }
  function xmark(ctx, cx, cy, h, color, alpha = 1) { const m = brandPaths().x_mark; const w = m.vb[2] / m.vb[3] * h; drawMark(ctx, 'x_mark', cx - w / 2, cy - h / 2, h, color, alpha); }

  // ---------- primitives ----------
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
  function disc(ctx, x, y, r, color, a = 1) { if (r <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  function ring(ctx, x, y, r, w, color, a = 1) { if (r <= 0 || a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = color; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
  function vgrad(ctx, c0, c1, x = 0, y = 0, w = W, h = H) { const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.fillRect(x, y, w, h); }
  function fill(ctx, color, a = 1) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = color; ctx.fillRect(-W, -H, W * 3, H * 3); ctx.restore(); }
  // ripple rings from a click
  function ripple(ctx, x, y, t, t0, o = {}) {
    const d = t - t0; if (d < 0 || d > 1.2) return;
    for (let k = 0; k < (o.n || 3); k++) {
      const dk = d - k * 0.09; if (dk <= 0) continue; const u = clamp(dk / (o.dur || 0.8));
      ring(ctx, x, y, lerp(o.r0 || 10, o.r1 || 260, expoOut(u)), (o.w || 3) * (1 - u) + 0.5, k === 1 && o.c2 ? o.c2 : (o.color || C.white), (1 - u) * (o.a || 0.9));
    }
  }
  // spark burst
  function sparks(ctx, x, y, t, t0, o = {}) {
    const d = t - t0; if (d < 0 || d > 0.6) return; const r = rng(o.seed || 5); const n = o.n || 10;
    ctx.save(); ctx.strokeStyle = o.color || C.white; ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2 + r() * 0.4; const sp0 = (o.len || 120) * (0.7 + r() * 0.6);
      const u = expoOut(clamp(d / 0.45)); const r0 = (o.r0 || 20) + sp0 * u * 0.55, r1 = (o.r0 || 20) + sp0 * u;
      ctx.globalAlpha = (1 - clamp(d / 0.5)) * (o.a || 1); ctx.lineWidth = (o.w || 4) * (1 - u * 0.6);
      ctx.beginPath(); ctx.moveTo(x + Math.cos(ang) * r0, y + Math.sin(ang) * r0); ctx.lineTo(x + Math.cos(ang) * r1, y + Math.sin(ang) * r1); ctx.stroke();
    }
    ctx.restore();
  }
  // odometer digits; value float >= 0. o: {digits, size, w, color, dim (leading zero alpha), gap}
  function wheels(ctx, value, cx, y, o = {}) {
    const nd = o.digits || 4, size = o.size || 120, wgt = o.w || 700; const lh = size * 1.12;
    ctx.save(); ctx.font = latFont(wgt, size); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.direction = 'ltr';
    const dw = ctx.measureText('0').width * (o.adv || 1.0); const gap = o.gap == null ? size * 0.02 : o.gap;
    const total = nd * dw + (nd - 1) * gap; let x = cx - total / 2 + dw / 2; const v = Math.max(0, value);
    for (let k = nd - 1; k >= 0; k--) {
      const p = Math.pow(10, k); const dval = Math.floor(v / p) % 10;
      let frac = k === 0 ? v - Math.floor(v) : clamp((v % p) - (p - 1));
      if (o.snap) frac = o.snap(frac);
      const lead = v < p && k > 0 && !(dval > 0); const al = lead ? (o.dim == null ? 0.22 : o.dim) : 1;
      ctx.save(); ctx.beginPath(); ctx.rect(x - dw, y - size * 1.0, dw * 2, size * 1.22); ctx.clip();
      ctx.fillStyle = o.color || C.ink; ctx.globalAlpha *= al;
      ctx.fillText(String(dval), x, y - frac * lh); ctx.fillText(String((dval + 1) % 10), x, y - frac * lh + lh);
      ctx.restore(); x += dw + gap;
    }
    ctx.restore(); return total;
  }
  // wrap Arabic text to lines within maxW
  function wrapAr(ctx, s, maxW, o) {
    const words = s.split(' '); const lines = []; let cur = '';
    for (const w of words) { const t = cur ? cur + ' ' + w : w; if (arW(ctx, t, o) > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
    if (cur) lines.push(cur); return lines;
  }
  const RISK = 'تنطوي عقود الفروقات والمنتجات المشتقة خارج البورصة على مخاطر عالية قد تؤدي إلى خسارة رأس المال. المحتوى التعليمي والتحليلي لا يُعدّ نصيحة استثمارية. قد لا يكون هذا المحتوى متاحاً في منطقتك. يُرجى الرجوع إلى شروط الخدمة.';
  // risk strip card, slides up at t0; top y; light or dark
  function riskStrip(ctx, t, t0, y, o = {}) {
    const u = eo(t, t0, 0.5); if (u <= 0) return; const dark = !!o.dark;
    const pad = 34, x = 72, w = W - 144; const so = { w: 400, size: o.size || 27 };
    const lines = wrapAr(ctx, RISK, w - pad * 2, so); const lh = so.size * 1.62; const h = lines.length * lh + pad * 1.4;
    ctx.save(); ctx.translate(0, (1 - u) * 60); ctx.globalAlpha *= u;
    rr(ctx, x, y, w, h, 22); ctx.fillStyle = dark ? 'rgba(9,10,13,0.78)' : 'rgba(255,255,255,0.92)'; ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = dark ? 'rgba(255,255,255,0.18)' : 'rgba(9,10,13,0.10)'; ctx.stroke();
    lines.forEach((ln, i) => ar(ctx, ln, x + w - pad, y + pad * 0.7 + lh * (i + 0.72), { ...so, align: 'right', color: dark ? 'rgba(255,255,255,0.9)' : C.graphite }));
    ctx.restore(); return h;
  }
  // light sweep across a pill (RTL), every `period` s from t0; pill w x h centred at the current origin
  function shimmer(ctx, t, t0, w, h, period = 1.0, dur = 0.42) {
    if (t < t0) return; const u = ((t - t0) % period) / dur; if (u >= 1) return;
    ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.clip(); ctx.transform(1, 0, -0.35, 1, 0, 0);
    const bx = lerp(w / 2 + 200, -w / 2 - 200, cubicInOut(u)); const g = ctx.createLinearGradient(bx - 110, 0, bx + 110, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(bx - 110, -h, 220, h * 2); ctx.restore();
  }
  // endless row of RTL text; v px/s (+ moves right); copies every text width
  function marquee(ctx, s, y, t, v, o, ph = 0) {
    const tw = arW(ctx, s, o); if (tw <= 0) return; let x = (t * v + ph) % tw; if (x < 0) x += tw;
    for (let j = -1; j <= Math.ceil(W / tw) + 1; j++) ar(ctx, s, x + j * tw, y, o);
  }
  function watermark(ctx, color, a = 0.6) { const h = W * 0.04 * 0.89; xmark(ctx, 54 + W * 0.02, H - 96 - h / 2, h, color, a); }

  G.K = { W, H, C, clamp, lerp, inv, expoOut, expoIn, expoInOut, cubicOut, cubicIn, cubicInOut, quintOut, backOut, eo, ei, eio, co, cio, spring, sp, rng, hash, noise, hexA, mix, shake,
    arFont, latFont, ar, arW, lat, latW, mixLine, units, layoutUnits, arUnits, logo, logoW, logoC, xmark, drawMark, rr, disc, ring, vgrad, fill, ripple, sparks, wheels, wrapAr, RISK, riskStrip, watermark, shimmer, marquee };
})(window);
