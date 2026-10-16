// Shared kit for the three Axi Iraq idents (9:16, 1080x1920, 4 s): math and easing, brand colours,
// the official logo as per-part paths, outlines, backgrounds, grain and light effects.
// Logo drawing works in the 2000x1453 space of the official file. LOGO maps it to the final placement.
(function (G) {
  'use strict';
  const W = 1080, H = 1920, TAU = Math.PI * 2;

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
  const eo = E(expoOut), ei = E(expoIn), eio = E(expoInOut), co = E(cubicOut), ci = E(cubicIn), cio = E(cubicInOut), qo = E(quintOut), qio = E(quintInOut), so = E(sineInOut), q4 = E(quartOut);
  const sp = (t, t0, f, z) => spring(t - t0, f, z);
  const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const noise = (x, seed = 0) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i + seed * 97.3), hash(i + 1 + seed * 97.3), u) * 2 - 1; };
  function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  // decaying noise offsets after each hit time → [x, y]
  function shake(t, hits, amp, decay = 0.12, seed = 1) {
    let x = 0, y = 0;
    hits.forEach((h, i) => {
      const d = t - h; if (d < 0 || d > decay * 5) return;
      const k = amp * Math.exp(-d / decay);
      x += noise(d * 40 + i * 13, seed) * k; y += noise(d * 43 + i * 7, seed + 3) * k;
    });
    return [x, y];
  }
  const mixHex = (a, b, u) => {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), f = (s) => [(s >> 16) & 255, (s >> 8) & 255, s & 255];
    const A = f(pa), B = f(pb); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp(u)))).join(',')})`;
  };

  // ---------------- brand colours (BRAND.md) ----------------
  const C = {
    red: '#E4002E', white: '#FFFFFF', off: '#F9F9F9', steel: '#EEF0F1', mist: '#C4C8CC', concrete: '#939699',
    slate: '#626466', graphite: '#393B40', carbon: '#242528', ink: '#090A0D',
    g0: '#5E7680', g1: '#7D919A', g2: '#E9EDEF',          // primary gradient, dark end on top for openers
    d0: '#171819', d1: '#0B0D0D',                          // tertiary dark gradient
  };

  // ---------------- the logo ----------------
  const L = G.AXIQ, LW = L.bbox[2], LH = L.bbox[3];
  const S = 0.34, OX = W / 2 - (LW / 2) * S, OY = 910 - (LH / 2) * S;
  const AXI = ['a', 'x_body', 'x_arm', 'i_stem', 'i_dot'], AR = ['ar_alef1', 'ar_lam_ain_ra', 'ar_alef2', 'ar_qaf'], ALL = AXI.concat(AR);
  const PART = {}, CONT = {}, BB = {};
  for (const k of ALL) {
    PART[k] = new Path2D(L.parts[k].d);
    const b = L.parts[k].bbox; BB[k] = { x0: b[0], y0: b[1], x1: b[2], y1: b[3], cx: (b[0] + b[2]) / 2, cy: (b[1] + b[3]) / 2, w: b[2] - b[0], h: b[3] - b[1] };
    // contours as point arrays with cumulative length (for outlines and pen heads)
    CONT[k] = L.parts[k].d.split('Z').map((s) => s.replace('M', '').trim()).filter(Boolean).map((s) => {
      const p = s.split(' L ').map((q) => q.trim().split(/\s+/).map(Number)); p.push(p[0]);
      const cum = [0]; for (let i = 1; i < p.length; i++) cum.push(cum[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
      return { p, cum, len: cum[cum.length - 1] };
    });
  }
  const LOGO_ALL = new Path2D(); ALL.forEach((k) => LOGO_ALL.addPath(PART[k]));
  const AXI_ALL = new Path2D(); AXI.forEach((k) => AXI_ALL.addPath(PART[k]));
  const toLogo = (ctx) => { ctx.translate(OX, OY); ctx.scale(S, S); };
  const scr = (x, y) => [OX + x * S, OY + y * S];
  function fillPart(ctx, k, color, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = color; ctx.fill(PART[k], 'evenodd'); ctx.restore(); }
  // point at arc fraction u along contour c of part k → [x, y, tangent angle]
  function contourAt(k, c, u) {
    const C0 = CONT[k][c], s = clamp(u) * C0.len, cum = C0.cum; let lo = 0, hi = cum.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] < s) lo = m; else hi = m; }
    const a = C0.p[lo], b = C0.p[hi], f = (s - cum[lo]) / Math.max(1e-6, cum[hi] - cum[lo]);
    return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), Math.atan2(b[1] - a[1], b[0] - a[0])];
  }
  // stroke the first fraction u of every contour of part k (logo space; lw in screen px)
  function strokePart(ctx, k, u, lw, color, a = 1) {
    if (u <= 0 || a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = color; ctx.lineWidth = lw / S; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    CONT[k].forEach((C0) => {
      const s1 = clamp(u) * C0.len; ctx.beginPath(); ctx.moveTo(C0.p[0][0], C0.p[0][1]);
      for (let i = 1; i < C0.p.length && C0.cum[i] <= s1; i++) ctx.lineTo(C0.p[i][0], C0.p[i][1]);
      if (u >= 1) ctx.closePath(); else { const e = contourAt(k, CONT[k].indexOf(C0), u); ctx.lineTo(e[0], e[1]); }
      ctx.stroke();
    });
    ctx.restore();
  }

  // ---------------- backgrounds ----------------
  function vgrad(ctx, stops, a = 1) {
    if (a <= 0) return; const g = ctx.createLinearGradient(0, 0, 0, H); stops.forEach(([o, c]) => g.addColorStop(o, c));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
  const bgPrimary = (ctx, a = 1) => vgrad(ctx, [[0, C.g0], [0.55, C.g1], [1, C.g2]], a);
  const bgDark = (ctx, a = 1) => vgrad(ctx, [[0, C.d0], [1, C.d1]], a);
  const bgLight = (ctx, a = 1) => vgrad(ctx, [[0, C.off], [1, C.steel]], a);

  // ---------------- grain (frozen noise tiles, overlay) ----------------
  const GRAIN = [];
  for (let i = 0; i < 6; i++) {
    const c = document.createElement('canvas'); c.width = 540; c.height = 960; const x = c.getContext('2d'), im = x.createImageData(540, 960), r = rng(31 + i * 7);
    for (let p = 0; p < im.data.length; p += 4) { const v = 128 + (r() + r() + r() - 1.5) * 85; im.data[p] = im.data[p + 1] = im.data[p + 2] = v; im.data[p + 3] = 255; }
    x.putImageData(im, 0, 0); GRAIN.push(c);
  }
  function grain(ctx, t, a = 0.05, freeze = false) {
    const i = freeze ? 0 : ((Math.floor(t * 24) % GRAIN.length) + GRAIN.length) % GRAIN.length;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = a; ctx.drawImage(GRAIN[i], 0, 0, W, H); ctx.restore();
  }

  // ---------------- light ----------------
  // a halo that travels across a white logo: blurred copy of the logo masked by a moving diagonal band
  function edgeGlint(ctx, t, t0, dur, o = {}) {
    const u = (t - t0) / dur; if (u <= 0 || u >= 1) return;
    const bx = lerp(-500, LW + 500, cubicInOut(u)), bw = o.width || 420, a = (o.a == null ? 0.75 : o.a) * Math.sin(Math.PI * u);
    ctx.save(); toLogo(ctx);
    ctx.beginPath(); ctx.moveTo(bx - bw / 2 + 300, -200); ctx.lineTo(bx + bw / 2 + 300, -200); ctx.lineTo(bx + bw / 2 - 300, LH + 200); ctx.lineTo(bx - bw / 2 - 300, LH + 200); ctx.closePath(); ctx.clip();
    ctx.globalCompositeOperation = o.op || 'lighter'; ctx.globalAlpha = a; ctx.filter = `blur(${o.blur || 9}px)`; ctx.fillStyle = o.color || '#ffffff'; ctx.fill(o.path || LOGO_ALL, 'evenodd');
    ctx.restore();
  }
  // a sheen band inside the logo (for an ink logo on light)
  function sheen(ctx, t, t0, dur, o = {}) {
    const u = (t - t0) / dur; if (u <= 0 || u >= 1) return;
    const bx = lerp(-600, LW + 600, cubicInOut(u)), bw = o.width || 360;
    ctx.save(); toLogo(ctx); ctx.clip(o.path || LOGO_ALL, 'evenodd');
    const g = ctx.createLinearGradient(bx - bw / 2, 0, bx + bw / 2, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, o.color || 'rgba(170,180,188,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.setTransform(ctx.getTransform().multiply(new DOMMatrix([1, 0, -0.45, 1, 0, 0])));
    ctx.fillStyle = g; ctx.fillRect(bx - bw, -400, bw * 2, LH + 800); ctx.restore();
  }
  // soft round glow
  function glow(ctx, x, y, r, color, a) {
    if (a <= 0 || r <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save(); ctx.globalAlpha *= a; ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
  }

  G.K = {
    W, H, TAU, clamp, lerp, inv, smooth, expoOut, expoIn, expoInOut, cubicOut, cubicIn, cubicInOut, quartOut, quintOut, quintInOut, sineInOut, backOut,
    spring, sp, eo, ei, eio, co, ci, cio, qo, qio, so, q4, hash, noise, rng, shake, mixHex, C,
    L, LW, LH, S, OX, OY, AXI, AR, ALL, PART, CONT, BB, LOGO_ALL, AXI_ALL, toLogo, scr, fillPart, contourAt, strokePart,
    vgrad, bgPrimary, bgDark, bgLight, grain, edgeGlint, sheen, glow,
  };
})(window);
