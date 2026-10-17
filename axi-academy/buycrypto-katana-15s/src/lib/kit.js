// Axi Iraq 9:16 films — shared kit (from axi-claude-mcp, used here for the Buy Crypto campaign). Every frame is a pure function of t.
// Fonts: Readex Pro (Arabic, AR) + Inter (Latin & digits, IN). Logo: the official Axi Iraq logo (axi / العراق),
// traced from the client file into per-part paths (assets/logo.js). Never the X on its own (see ../BRAND.md).
(function (G) {
  'use strict';
  const W = 1080, H = 1920;
  const C = {
    red: '#E4002E', mint: '#5EE0BB', off: '#F9F9F9', white: '#FFFFFF', frost: '#EEF0F1', silver: '#C4C8CC',
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

  // ---------------- the Axi Iraq logo (official file space 2000 x 1453) ----------------
  const LQ = G.AXIQ, LQW = LQ.bbox[2], LQH = LQ.bbox[3];
  const Q_AXI = ['a', 'x_body', 'x_arm', 'i_stem', 'i_dot'], Q_AR = ['ar_alef1', 'ar_lam_ain_ra', 'ar_alef2', 'ar_qaf'], Q_ALL = Q_AXI.concat(Q_AR);
  const QP = {}; Q_ALL.forEach((k) => { QP[k] = new Path2D(LQ.parts[k].d); });
  // centred at (cx, cy), w px wide; o.color, o.alpha, o.per(k) → {alpha, dx, dy, s} per part (in logo units)
  function logoIQ(ctx, cx, cy, w, o = {}) {
    const s = w / LQW; ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    ctx.translate(cx - w / 2, cy - (LQH * s) / 2); ctx.scale(s, s); ctx.fillStyle = o.color || C.white;
    Q_ALL.forEach((k) => {
      const a = o.per ? o.per(k) : null;
      if (!a) { ctx.fill(QP[k], 'evenodd'); return; }
      if ((a.alpha == null ? 1 : a.alpha) <= 0) return;
      const b = LQ.parts[k].bbox, px = (b[0] + b[2]) / 2, py = (b[1] + b[3]) / 2;
      ctx.save(); ctx.globalAlpha *= a.alpha == null ? 1 : a.alpha; ctx.translate(px + (a.dx || 0), py + (a.dy || 0)); ctx.scale(a.s == null ? 1 : a.s, a.s == null ? 1 : a.s); ctx.translate(-px, -py);
      ctx.fill(QP[k], 'evenodd'); ctx.restore();
    });
    ctx.restore(); return (LQH * s);
  }
  // a timed reveal: «axi» letters spring up one by one, then «العراق» rises in right to left
  function logoReveal(ctx, cx, cy, w, t, t0, o = {}) {
    return logoIQ(ctx, cx, cy, w, { ...o, per: (k) => {
      const i = Q_AXI.indexOf(k), j = Q_AR.indexOf(k), st = i >= 0 ? t0 + i * 0.06 : t0 + 0.32 + j * 0.06;
      const u = sp(t, st, 2.8, 0.55); if (u <= 0) return { alpha: 0 };
      return { alpha: clamp((t - st) / 0.08), dy: (1 - u) * (i >= 0 ? 260 : 160), s: lerp(0.85, 1, clamp(u)) };
    } });
  }
  // brand rule: white Axi Iraq logo (not the X), 60% opacity, bottom-left, at least 120 px wide
  function watermark(ctx, color = C.white, a = 0.6) { logoIQ(ctx, 54 + 74, H - 196, 148, { color, alpha: a }); }

  // ---------------- backgrounds ----------------
  // primary gradient (dark end on top for openers / brand moments) and the tertiary dark gradient — vertical only
  const BGL = document.createElement('canvas'); BGL.width = W; BGL.height = H;
  (() => { const g = BGL.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#5E7680'); gr.addColorStop(0.55, '#7D919A'); gr.addColorStop(1, '#E9EDEF'); g.fillStyle = gr; g.fillRect(0, 0, W, H); })();
  const BGD = document.createElement('canvas'); BGD.width = W; BGD.height = H;
  (() => { const g = BGD.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#171819'); gr.addColorStop(1, '#0B0D0D'); g.fillStyle = gr; g.fillRect(0, 0, W, H); })();
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
    const bt = o.beat || BEAT, tb = o.tb == null ? t0 + 0.4 : o.tb, ph = t > tb ? (t - tb) % (2 * bt) : 99, pump = 1 + 0.035 * Math.exp(-ph / 0.12);   // pumps every 2 beats of o.beat
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
  G.K = {
    W, H, C, BPM, BEAT, B, clamp, lerp, inv, smooth, expoOut, expoIn, expoInOut, cubicOut, cubicIn, cubicInOut, quintOut, backOut, eo, ei, eio, co, cio, qo, spring, sp, rng, hash, noise, hexA, shake,
    arFont, latFont, ar, arW, lat, latW, mixLine, units, layoutUnits, arUnits, wrapAr, arWords,
    LQ, QP, Q_AXI, Q_AR, Q_ALL, logoIQ, logoReveal, watermark,
    bgLight, bgDark, riseWipe, grain, rr, disc, ring, glass, ripple, sparks, shimmer, ctaPill, wheels, RISK, riskStrip,
  };
})(window);
