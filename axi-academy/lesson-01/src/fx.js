// Lesson 17 FX layer — kinetic type, hand annotations, trails, particles, rings, transitions, timeline.
(function (G) {
  const A = G.AX;
  const { W, H, C, clamp, lerp, inv, eo, ei, eio, hexA, txt, lat, measure, font, line, tri, roundRect, rng } = A;

  // ---------- springs ----------
  // underdamped step response (overshoots, then settles) — used for kinetic type landings
  function springU(t, w = 18, z = 0.42) {
    if (t <= 0) return 0; const wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z / Math.sqrt(1 - z * z)) * Math.sin(wd * t));
  }
  const su = (t, t0, w = 18, z = 0.42) => springU(t - t0 + 0.03, w, z);

  // ---------- backgrounds (vertical gradients only + dot grid) ----------
  function bg(ctx, ink, o = {}) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    if (ink === 'dark') { g.addColorStop(0, '#17181B'); g.addColorStop(1, '#0B0D0D'); }
    else if (ink === 'slate') { g.addColorStop(0, '#6B838A'); g.addColorStop(1, C.slate); }
    else { g.addColorStop(0, '#FBFBFB'); g.addColorStop(1, C.frost); }
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (o.dots === false) return;
    if (o.attract && o.attract.length) { dots(ctx, ink, o); return; }
    const key = ink + '|' + (o.gap || 48) + '|' + o.dotAlpha; let cv = dotCache.get(key);
    if (!cv) { cv = document.createElement('canvas'); cv.width = W; cv.height = H; dots(cv.getContext('2d'), ink, o); dotCache.set(key, cv); }
    ctx.drawImage(cv, 0, 0);
  }
  const dotCache = new Map();
  // dot grid; optional attractors make nearby dots swell and tint
  function dots(ctx, ink, o = {}) {
    const gap = o.gap || 48; const base = ink === 'dark' ? 'rgba(255,255,255,' : ink === 'slate' ? 'rgba(255,255,255,' : 'rgba(96,120,128,';
    const a0 = o.dotAlpha == null ? (ink === 'dark' ? 0.11 : ink === 'slate' ? 0.16 : 0.2) : o.dotAlpha;
    const att = o.attract || [];
    ctx.save();
    for (let y = gap / 2 + 6; y < H; y += gap) {
      for (let x = (W % gap) / 2; x < W; x += gap) {
        let r = 1.6, a = a0, col = null;
        for (const p of att) {
          const d = Math.hypot(x - p.x, y - p.y); const k = Math.max(0, 1 - d / p.r) * (p.s == null ? 1 : p.s);
          if (k > 0) { r += k * (p.grow || 3.2); a = Math.min(1, a + k * 0.8); if (p.color && k > 0.15) col = p.color; }
        }
        ctx.fillStyle = col ? hexA(col, a) : base + a + ')';
        ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
      }
    }
    ctx.restore();
  }

  // ---------- word sprites (Arabic-safe kinetic type) ----------
  const cache = new Map();
  function sprite(s, size, w = 'X', color = C.ink) {
    const key = [s, size, w, color].join('|'); if (cache.has(key)) return cache.get(key);
    const m = document.createElement('canvas').getContext('2d');
    m.font = font(size, w); m.direction = 'rtl';
    const tw = Math.ceil(m.measureText(s).width); const pad = Math.ceil(size * 0.35);
    const cw = tw + pad * 2, ch = Math.ceil(size * 1.9);
    const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
    const x = cv.getContext('2d'); x.font = font(size, w); x.direction = 'rtl'; x.textAlign = 'right'; x.textBaseline = 'alphabetic'; x.fillStyle = color;
    const base = Math.round(size * 1.28); x.fillText(s, cw - pad, base);
    // slice boundaries ≈ letter edges: measured from the right (reading start)
    const cuts = [0]; const chars = Array.from(s);
    for (let i = 1; i < chars.length; i++) {
      if (/[ً-ْٰ]/.test(chars[i])) continue; // keep marks with their letter
      const wv = m.measureText(chars.slice(0, i).join('')).width; if (wv - cuts[cuts.length - 1] > size * 0.22) cuts.push(wv);
    }
    cuts.push(tw);
    const sp = { cv, w: tw, h: ch, pad, base, size, cuts };
    cache.set(key, sp); return sp;
  }
  // kinetic word. (x,y) = anchor at the baseline; align: right|center|left. p is driven by the caller (seconds since cue).
  // mode: drop | bounce | stretch | spin | snap | rise | slam | slide
  function kword(ctx, s, x, y, o = {}) {
    const size = o.size || 200; const sp = sprite(s, size, o.w || 'X', o.color || C.ink);
    const lt = o.lt; if (lt == null || lt < -0.2) return 0;
    const align = o.align || 'right';
    const right = align === 'right' ? x : align === 'center' ? x + sp.w / 2 : x + sp.w; // visual right edge
    const left0 = right - sp.w - sp.pad; const top = y - sp.base;
    const n = sp.cuts.length - 1; const stg = o.stagger == null ? 0.045 : o.stagger; const mode = o.mode || 'drop';
    const alpha = o.alpha == null ? 1 : o.alpha;
    if (o.out != null && o.out >= 1) return sp.w;
    const ga = ctx.globalAlpha; ctx.save(); ctx.globalAlpha = ga * alpha;
    if (mode === 'stretch') {
      const k = Math.max(0.02, springU(lt, 13, 0.32)); const sy = clamp(1 / Math.sqrt(k), 0.7, 1.6);
      const cx = right - sp.w / 2;
      ctx.translate(cx, y); ctx.scale(k, sy * (lt < 0 ? 0 : 1)); ctx.translate(-cx, -y);
      ctx.drawImage(sp.cv, left0, top); ctx.restore(); return sp.w;
    }
    if (mode === 'slam') {
      const k = springU(lt, 16, 0.5); const sc = lerp(2.4, 1, k); const cx = right - sp.w / 2;
      ctx.globalAlpha = ga * alpha * clamp(lt * 8); ctx.translate(cx, y - size * 0.35); ctx.scale(sc, sc); ctx.translate(-cx, -(y - size * 0.35));
      ctx.drawImage(sp.cv, left0, top); ctx.restore(); return sp.w;
    }
    if (mode === 'snap') {
      if (lt >= 0) ctx.drawImage(sp.cv, left0, top);
      ctx.restore(); return sp.w;
    }
    const cw = sp.w + sp.pad * 2;
    for (let k = 0; k < n; k++) {
      // slice k spans distances [cuts[k], cuts[k+1]] from the right edge of the text
      const srcL = k === n - 1 ? 0 : sp.pad + sp.w - sp.cuts[k + 1];
      const srcR = k === 0 ? cw : sp.pad + sp.w - sp.cuts[k];
      const srcW = srcR - srcL; const dx = left0 + srcL;
      const tk = lt - k * stg;
      let oy = 0, rot = 0, sxk = 1, al = 1, ox = 0;
      if (mode === 'drop') { const e = springU(tk, 17, 0.5); oy = -(1 - e) * size * 1.5; rot = (1 - e) * (k % 2 ? 0.35 : -0.28); al = clamp(tk * 10); }
      else if (mode === 'bounce') { const T = Math.max(0, tk); oy = tk < 0 ? -size * 1.4 : -size * 0.9 * Math.exp(-4.2 * T) * Math.abs(Math.cos(T * 9.5)); al = clamp(tk * 12); }
      else if (mode === 'spin') { const e = springU(tk, o.turns ? 9 : 12, 0.6); sxk = Math.cos((1 - e) * Math.PI * 2 * (o.turns || 1.25)); al = clamp(tk * 10); }
      else if (mode === 'rise') { const e = springU(tk, 16, 0.62); oy = (1 - e) * size * 1.1; }
      else if (mode === 'slide') { const e = springU(tk, 15, 0.6); ox = (1 - e) * 500; al = clamp(tk * 8); }
      if (tk < -0.0001 && mode !== 'bounce') continue;
      if (o.out != null && o.out > 0) { const q = clamp(o.out * 1.6 - (n - 1 - k) * 0.04); oy += (o.outDir || -1) * ei(q, 0, 1) * size * 1.4; al *= 1 - q; }
      if (al <= 0) continue;
      ctx.save(); ctx.globalAlpha = ga * alpha * al;
      if (mode === 'rise') { ctx.beginPath(); ctx.rect(dx - 4, y - size * 2.2, srcW + 8, size * 2.65); ctx.clip(); }
      const pivX = dx + srcW / 2, pivY = y;
      ctx.translate(pivX + ox, pivY + oy); ctx.rotate(rot); ctx.scale(sxk, 1); ctx.translate(-pivX, -pivY);
      ctx.drawImage(sp.cv, srcL, 0, srcW, sp.h, dx, top, srcW, sp.h);
      ctx.restore();
    }
    ctx.restore(); return sp.w;
  }
  function kwidth(s, size, w = 'X') { return sprite(s, size, w, C.ink).w; }

  // ---------- hand annotations (brand type, hand-drawn strokes) ----------
  function arrow(ctx, from, to, o = {}) {
    const p = o.p == null ? 1 : o.p; if (p <= 0) return;
    const bend = o.bend == null ? 0.25 : o.bend; const mx = (from[0] + to[0]) / 2, my = (from[1] + to[1]) / 2;
    const nx = -(to[1] - from[1]), ny = to[0] - from[0]; const c = [mx + nx * bend, my + ny * bend];
    const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; pts.push([(1 - u) * (1 - u) * from[0] + 2 * (1 - u) * u * c[0] + u * u * to[0], (1 - u) * (1 - u) * from[1] + 2 * (1 - u) * u * c[1] + u * u * to[1]]); }
    const col = o.color || C.slate; const wd = o.width || 2.6;
    line(ctx, 'paper', pts, { t: o.t || 0, reveal: p, width: wd, color: col, amp: 0.5, alpha: o.alpha });
    if (p > 0.97) {
      const e = pts[pts.length - 1], b = pts[pts.length - 4]; const ang = Math.atan2(e[1] - b[1], e[0] - b[0]); const L = 16;
      line(ctx, 'paper', [[e[0] - Math.cos(ang - 0.5) * L, e[1] - Math.sin(ang - 0.5) * L], e, [e[0] - Math.cos(ang + 0.5) * L, e[1] - Math.sin(ang + 0.5) * L]], { t: o.t || 0, width: wd, color: col, amp: 0.4, alpha: o.alpha });
    }
  }
  // note: small rotated text written right→left, optional arrow to a target
  function note(ctx, s, x, y, o = {}) {
    const p = o.p == null ? 1 : o.p; if (p <= 0) return;
    const size = o.size || 30; const col = o.color || C.slate; const rot = o.rot == null ? -0.035 : o.rot;
    const m = measure(ctx, s, size, o.w || 'R'); const align = o.align || 'right';
    const xr = align === 'right' ? x : align === 'center' ? x + m / 2 : x + m;
    const pw = clamp(p * 1.35);
    ctx.save(); ctx.translate(xr, y); ctx.rotate(rot); ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha);
    ctx.beginPath(); ctx.rect(-m * pw - 6, -size * 1.6, m * pw + 12, size * 2.4); ctx.clip();
    txt(ctx, s, 0, 0, { size, w: o.w || 'R', color: col });
    ctx.restore();
    if (o.strike) { const ps = clamp((p - 0.75) * 4); if (ps > 0) line(ctx, 'paper', [[xr + 6, y - size * 0.32 + 4], [xr - m - 6, y - size * 0.32 - 2]], { reveal: ps, width: 3, color: o.strikeColor || C.red, t: o.t, amp: 0.6 }); }
    if (o.under) { const pu = clamp((p - 0.6) * 3); if (pu > 0) line(ctx, 'paper', [[xr + 4, y + 12], [xr - m * 0.55, y + 15], [xr - m - 6, y + 11]], { reveal: pu, width: 3, color: o.underColor || col, t: o.t, amp: 0.6 }); }
    if (o.to) arrow(ctx, o.from || [xr - m / 2, y + 16], o.to, { p: clamp((p - 0.55) * 2.2), color: col, t: o.t, bend: o.bend });
  }
  function check(ctx, x, y, s, p, col = C.mint, t = 0) { if (p <= 0) return; line(ctx, 'paper', [[x - s * 0.5, y], [x - s * 0.12, y + s * 0.4], [x + s * 0.55, y - s * 0.45]], { reveal: p, width: s * 0.13, color: col, t, amp: 0.4 }); }
  function cross(ctx, x, y, s, p, col = C.red, t = 0) { if (p <= 0) return; line(ctx, 'paper', [[x - s / 2, y - s / 2], [x + s / 2, y + s / 2]], { reveal: clamp(p * 2), width: s * 0.12, color: col, t, amp: 0.4 }); line(ctx, 'paper', [[x + s / 2, y - s / 2], [x - s / 2, y + s / 2]], { reveal: clamp(p * 2 - 1), width: s * 0.12, color: col, t, amp: 0.4 }); }
  function scribbleCircle(ctx, cx, cy, rx, ry, p, col = C.red, t = 0) {
    if (p <= 0) return; const pts = []; for (let i = 0; i <= 80; i++) { const a = -2.2 + i / 80 * Math.PI * 2.15; const r = 1 + Math.sin(i * 0.37) * 0.04; pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); }
    line(ctx, 'paper', pts, { reveal: p, width: 3, color: col, t, amp: 0.8 });
  }

  // ---------- onion-skin trail ----------
  function ghosts(ctx, n, dt, t, drawAt, o = {}) {
    for (let k = n; k >= 1; k--) { ctx.save(); ctx.globalAlpha *= (o.alpha || 0.5) * (1 - k / (n + 1)); drawAt(t - k * dt, k); ctx.restore(); }
    drawAt(t, 0);
  }

  // ---------- mouse cursor ----------
  function cursor(ctx, x, y, press = 0, col = C.ink) {
    ctx.save(); ctx.translate(x, y); const s = 1 - press * 0.15; ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 30); ctx.lineTo(8, 23); ctx.lineTo(14, 36); ctx.lineTo(19, 34); ctx.lineTo(13, 21); ctx.lineTo(23, 21); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = col === C.ink ? C.white : C.ink; ctx.lineWidth = 2; ctx.stroke();
    if (press > 0) { ctx.globalAlpha = press; ctx.strokeStyle = C.red; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 18 + 16 * (1 - press), 0, 6.283); ctx.stroke(); }
    ctx.restore();
  }

  // ---------- ring loader ----------
  function ring(ctx, cx, cy, R, p, t, o = {}) {
    const col = o.color || C.white; const dim = o.dim || hexA(C.white, 0.25);
    ctx.save(); ctx.lineCap = 'round';
    ctx.strokeStyle = dim; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
    ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + p * 6.283, false); ctx.stroke();
    for (let i = 0; i < 72; i++) { const a = i / 72 * 6.283 + t * 0.2; const r0 = R * 0.62, r1 = R * (i % 6 === 0 ? 0.7 : 0.67); ctx.strokeStyle = i / 72 < p ? hexA(col, 0.9) : dim; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.stroke(); }
    ctx.restore();
  }

  // ---------- particles (deterministic orbits) ----------
  function swarm(ctx, n, seed, t, posFn, o = {}) {
    const ga = ctx.globalAlpha; const r = rng(seed); for (let i = 0; i < n; i++) { const a = r(), b = r(), c = r(); const [x, y, s, col, al] = posFn(i, a, b, c, t); if (al <= 0) continue; ctx.globalAlpha = ga * al; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, s, 0, 6.283); ctx.fill(); }
    ctx.globalAlpha = ga;
  }

  // ---------- transitions (hard edges, no crossfades) ----------
  // stepped shutter bars rising from the bottom; returns clip path builder for the incoming scene
  function barsRegion(ctx, p, n = 9) {
    ctx.beginPath(); const bh = H / n;
    for (let k = 0; k < n; k++) { const q = clamp((p - (n - 1 - k) * 0.055) / 0.56); const y0 = k * bh; const hh = bh * eio(q, 0, 1); ctx.rect(0, y0 + bh - hh, W, hh + 0.5); }
  }
  function barsEdges(ctx, p, fromInk, toInk, n = 9) {
    const bh = H / n; const c0 = fromInk === 'dark' ? '#16171A' : '#F6F7F8', c1 = toInk === 'dark' ? '#16171A' : '#F6F7F8';
    for (let k = 0; k < n; k++) {
      const q = clamp((p - (n - 1 - k) * 0.055) / 0.56); if (q <= 0 || q >= 1) continue; const hh = bh * eio(q, 0, 1); const y = k * bh + bh - hh;
      for (let s = 0; s < 4; s++) { ctx.fillStyle = A.mixHex(c1, c0, 0.2 + s * 0.2); ctx.fillRect(0, y - (s + 1) * 6, W, 6); }
    }
  }
  function rippleRegion(ctx, p, cx, cy) { ctx.beginPath(); ctx.arc(cx, cy, Math.hypot(W, H) * eio(p, 0, 1) * 1.02, 0, 6.283); }
  function rippleRings(ctx, p, cx, cy, toInk) {
    const R = Math.hypot(W, H) * eio(p, 0, 1) * 1.02; if (p <= 0 || p >= 1) return; const c = toInk === 'dark' ? '#16171A' : '#F6F7F8';
    for (let s = 0; s < 6; s++) { ctx.strokeStyle = A.mixHex(c, toInk === 'dark' ? '#F6F7F8' : '#16171A', 0.15 + s * 0.12); ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(cx, cy, Math.max(1, R + 5 + s * 10), 0, 6.283); ctx.stroke(); }
  }

  // ---------- HUD: timecode + RTL chapter timeline (drawn after motion blur) ----------
  function timecode(ctx, t, total) {
    const tt = Math.max(0, t); const hh = 0, mm = Math.floor(tt / 60), ss = Math.floor(tt % 60), ff = Math.floor((tt * 30) % 30);
    const s = [hh, mm, ss, ff].map((v) => String(v).padStart(2, '0')).join(':');
    lat(ctx, s, 77, 82, { size: 20, w: 600, color: '#8C9094', track: 1.5 });
  }
  function timeline(ctx, t, chapters, t0, t1, o = {}) {
    const xR = 1843, xL = 200, y = 1014; const X = (tv) => xR - (clamp((tv - t0) / (t1 - t0))) * (xR - xL);
    const ph = X(t); const appear = o.appear == null ? 1 : o.appear; if (appear <= 0) return;
    ctx.save(); ctx.globalAlpha = appear;
    const grey = '#8C9094';
    // future (left of playhead) thin, past (right) thicker
    ctx.fillStyle = hexA('#8C9094', 0.55); ctx.fillRect(xL, y - 0.75, ph - xL, 1.5);
    ctx.fillStyle = grey; ctx.fillRect(ph, y - 1.25, xR - ph, 2.5);
    // minute ticks
    for (let m = 30; m < t1 - t0; m += 30) { const x = X(t0 + m); ctx.fillStyle = hexA(grey, 0.6); ctx.fillRect(x - 0.75, y - 5, 1.5, 10); }
    let cur = 0; chapters.forEach((c, i) => { if (t >= c.t) cur = i; });
    chapters.forEach((c, i) => {
      const x = X(c.t); const passed = t >= c.t; const isCur = i === cur; const s = isCur ? 9 : 7;
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4);
      if (isCur) { ctx.fillStyle = C.red; ctx.fillRect(-s / 2, -s / 2, s, s); }
      else if (passed) { ctx.fillStyle = grey; ctx.fillRect(-s / 2, -s / 2, s, s); }
      else { ctx.fillStyle = o.bgFill || 'rgba(0,0,0,0)'; ctx.strokeStyle = grey; ctx.lineWidth = 1.5; ctx.strokeRect(-s / 2, -s / 2, s, s); }
      ctx.restore();
    });
    // playhead: red T
    ctx.fillStyle = C.red; ctx.fillRect(ph - 1.25, y - 14, 2.5, 22); ctx.fillRect(ph - 6, y - 14, 12, 2.5);
    // current chapter label above the playhead, flips in on change
    const c = chapters[cur]; const pin = eo(t, c.t, 0.35);
    ctx.save(); ctx.beginPath(); ctx.rect(ph - 400, y - 60, 800, 40); ctx.clip();
    const lab = c.label; const nw = lat(ctx, String(cur + 1).padStart(2, '0'), ph + 8, y - 26 + (1 - pin) * 26, { size: 16, w: 600, color: C.red, align: 'left', track: 1 });
    txt(ctx, lab, ph - 6, y - 25 + (1 - pin) * 26, { size: 22, w: 'R', color: grey, align: 'right' });
    ctx.restore();
    ctx.restore();
  }

  G.FX = { springU, su, bg, dots, sprite, kword, kwidth, arrow, note, check, cross, scribbleCircle, ghosts, cursor, ring, swarm, barsRegion, barsEdges, rippleRegion, rippleRings, timecode, timeline };
})(typeof window !== 'undefined' ? window : globalThis);
