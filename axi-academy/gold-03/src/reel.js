// Gold series · Lesson 03 — «أرقام الذهب» — showreel grammar: flat colour fields, one bold typeface family, a hit on every
// field change, something on every beat, every shot made out of the previous one (slats, shape morphs, a 2D→3D stack).
// This file: palette, easing (no overshoot), the field/act system with mask transitions, slat type, shapes, the disc
// stack, the beat clock, brand marks.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX;
  const { W, H, C, clamp, lerp, hexA, txt, lat, mixHex } = A;

  // ---------------------------------------------------------------- palette: 3 colours + black & white
  const P = { paper: '#EEF0F1', gold: '#D9A43B', slate: '#607880', ink: '#090A0D', white: '#FFFFFF', red: '#E4002E', mint: '#5EE0BB' };
  const DARK = { slate: true, ink: true };
  // ---------------------------------------------------------------- tempo: 120 BPM, music grid starts 2 beats before the voice offset
  const BPM = 120, BEAT = 0.5, BAR = 2.0, GRID0 = F.OFF - 2 * BEAT;
  const q8 = (t) => GRID0 + Math.ceil((t - GRID0) / 0.25 - 1e-6) * 0.25;   // the next 8th note on or after t
  const beatAt = (t) => Math.floor((t - GRID0) / BEAT + 1e-6);
  // ---------------------------------------------------------------- easing: exponential + critically damped (no bounce anywhere)
  const xo = (p) => (p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));
  const xi = (p) => (p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, 10 * (p - 1)));
  const xio = (p) => (p <= 0 ? 0 : p >= 1 ? 1 : p < 0.5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2);
  const E = (t, t0, d = 0.45) => xo(clamp((t - t0) / d));
  const EI = (t, t0, d = 0.35) => xi(clamp((t - t0) / d));
  const EIO = (t, t0, d = 0.6) => xio(clamp((t - t0) / d));
  const crit = (t, t0, w = 16) => { const x = t - t0; return x <= 0 ? 0 : 1 - (1 + w * x) * Math.exp(-w * x); };
  const outP = (t, t0, d = 0.35) => 1 - EI(t, t0, d);

  // ---------------------------------------------------------------- acts: each owns a field colour and enters through a mask
  // { name, t0 (enter start), din, t1 (last frame drawn), field, enter: 'slats'|'iris'|'contract'|'bars'|'hex'|'none', ex, ey, r0, r1, draw(ctx,t) }
  const ACTS = [];
  const RMAX = Math.hypot(W, H);
  function maskPath(ctx, a, p) {
    ctx.beginPath();
    if (a.enter === 'slats') { const n = a.n || 8, h = H / n; for (let k = 0; k < n; k++) { const e = xo(clamp((p - k * 0.05) / 0.62)); const wv = W * e; ctx.rect(k % 2 ? 0 : W - wv, k * h - 0.5, wv, h + 1); } }
    else if (a.enter === 'bars') { const n = a.n || 12, bw = W / n; for (let k = 0; k < n; k++) { const e = xio(clamp((p - k * 0.03) / 0.6)); ctx.rect(k * bw - 0.5, 0, bw * e + 1, H); } }
    else if (a.enter === 'iris') ctx.arc(a.ex, a.ey, Math.max(0.5, lerp(a.r0 || 0, RMAX, xio(p))), 0, 6.283);
    else if (a.enter === 'hex') { const r = Math.max(0.5, lerp(a.r0 || 0, RMAX * 1.2, xio(p))); for (let k = 0; k < 6; k++) { const an = -Math.PI / 2 + k * Math.PI / 3; k ? ctx.lineTo(a.ex + r * Math.cos(an), a.ey + r * Math.sin(an)) : ctx.moveTo(a.ex + r * Math.cos(an), a.ey + r * Math.sin(an)); } ctx.closePath(); }
    else if (a.enter === 'contract') { ctx.rect(0, 0, W, H); const r = lerp(RMAX, a.r1 || 0, xio(p)); ctx.moveTo(a.ex + r, a.ey); ctx.arc(a.ex, a.ey, Math.max(0.5, r), 0, 6.283, true); }
    else ctx.rect(0, 0, W, H);
  }
  function inMask(a, p, x, y) {
    if (p >= 1 || a.enter === 'none') return true;
    if (a.enter === 'slats') { const n = a.n || 8, k = Math.min(n - 1, Math.floor(y / (H / n))); const e = xo(clamp((p - k * 0.05) / 0.62)); return k % 2 ? x < W * e : x > W - W * e; }
    if (a.enter === 'bars') { const n = a.n || 12, bw = W / n, k = Math.floor(x / bw); const e = xio(clamp((p - k * 0.03) / 0.6)); return x - k * bw < bw * e; }
    if (a.enter === 'iris' || a.enter === 'hex') return Math.hypot(x - a.ex, y - a.ey) < lerp(a.r0 || 0, RMAX, xio(p)) * 0.9;
    if (a.enter === 'contract') return Math.hypot(x - a.ex, y - a.ey) > lerp(RMAX, a.r1 || 0, xio(p));
    return true;
  }
  const act = (def) => { ACTS.push(Object.assign({ din: 0.5, enter: 'slats', field: 'paper' }, def)); ACTS.sort((a, b) => a.t0 - b.t0); return def; };
  function fieldAt(t, x, y) { let f = 'paper'; for (const a of ACTS) { if (t < a.t0 || t >= a.t1) continue; const p = a.din ? clamp((t - a.t0) / a.din) : 1; if (inMask(a, p, x, y)) f = a.field || f; } return f; }
  const inkOn = (f) => (DARK[f] ? P.white : P.ink);

  // ---------------------------------------------------------------- slat type: a word assembled from horizontal slices that slide in
  // from alternate sides (motion blur comes from the sub-frame shutter); o.out = time the slices leave
  const LCACHE = new Map();
  function spriteL(s, size, wgt, color) { // left-to-right sprite for Latin/number strings (same layout fields as FX.sprite)
    const key = [s, size, wgt, color].join('|'); if (LCACHE.has(key)) return LCACHE.get(key);
    const wv = { L: 200, M: 300, R: 400, S: 600, B: 600, X: 700 }[wgt] || wgt; const f = `${wv} ${size}px IN, AR`;
    const m = document.createElement('canvas').getContext('2d'); m.font = f; const tw = Math.ceil(m.measureText(s).width); const pad = Math.ceil(size * 0.35);
    const cv = document.createElement('canvas'); cv.width = tw + pad * 2; cv.height = Math.ceil(size * 1.9); const x = cv.getContext('2d'); x.font = f; x.direction = 'ltr'; x.textAlign = 'left'; x.fillStyle = color;
    const base = Math.round(size * 1.28); x.fillText(s, pad, base); const sp = { cv, w: tw, h: cv.height, pad, base, size }; LCACHE.set(key, sp); return sp;
  }
  const hasAr = (s) => /[\u0600-\u06FF]/.test(s);
  function slat(ctx, s, x, y, size, t, t0, o = {}) {
    if (t < t0 - 0.02) return 0; const col = o.color || P.ink; const sp = hasAr(s) ? FX.sprite(s, size, o.w || 'X', col) : spriteL(s, size, o.w || 'X', col);
    const n = o.n || 6, d = o.dur || 0.4, st = o.stagger == null ? 0.025 : o.stagger, dist = o.dist || 520;
    const align = o.align || 'center'; const right = align === 'center' ? x + sp.w / 2 : align === 'left' ? x + sp.w : x;
    const left0 = right - sp.w - sp.pad, top = y - sp.base;
    const ga = ctx.globalAlpha; let drawn = false;
    for (let k = 0; k < n; k++) {
      const sy = Math.floor(sp.h * k / n), sh = Math.ceil(sp.h * (k + 1) / n) - sy; const dir = (k % 2 ? 1 : -1) * (o.dir || 1);
      const e = xo(clamp((t - t0 - k * st) / d)); if (e <= 0) continue;
      let off = (1 - e) * dist * dir;
      if (o.out != null && t > o.out) { const q = xi(clamp((t - o.out - k * st) / (o.outDur || 0.3))); if (q >= 1) continue; off -= q * dist * dir; }
      ctx.drawImage(sp.cv, 0, sy, sp.cv.width, sh, left0 + off, top + sy, sp.cv.width, sh); drawn = true;
    }
    ctx.globalAlpha = ga; return sp.w;
  }
  const textW = (s, size, w = 'X') => FX.sprite(s, size, w, P.ink).w;
  // a row of timed words (RTL), each slatting in on its own 8th note
  function slatRow(ctx, words, xr, y, size, t, o = {}) {
    let x = o.align === 'center' ? xr + words.reduce((s, wd, i) => s + textW(wd.s, size, o.w) + (i ? size * 0.3 : 0), 0) / 2 : xr;
    for (const wd of words) { const ww = slat(ctx, wd.s, x, y, size, t, wd.t, Object.assign({}, o, { align: 'right', color: wd.color || o.color })); x -= (ww || textW(wd.s, size, o.w)) + size * 0.3; }
  }

  // ---------------------------------------------------------------- shapes: every shape is 96 points sampled at the same angles, so any
  // shape morphs into any other by plain interpolation
  const NS = 360;
  function polar(kind, th, o = {}) {
    const c = Math.cos(th), s = Math.sin(th);
    if (kind === 'circle') return 1;
    if (kind === 'square') return 1 / Math.max(Math.abs(c), Math.abs(s));
    if (kind === 'hex') { const a = ((th + Math.PI / 2) % (Math.PI / 3) + Math.PI / 3) % (Math.PI / 3) - Math.PI / 6; return Math.cos(Math.PI / 6) / Math.cos(a); }
    if (kind === 'tri') { const a = ((th + Math.PI / 2) % (2 * Math.PI / 3) + 2 * Math.PI / 3) % (2 * Math.PI / 3) - Math.PI / 3; return 0.5 / Math.cos(a); }
    if (kind === 'rect') { const ax = o.ax || 1, ay = o.ay || 0.5; return Math.min(ax / Math.max(1e-6, Math.abs(c)), ay / Math.max(1e-6, Math.abs(s))); }
    return 1;
  }
  function shape(kind, cx, cy, r, o = {}) { const rot = o.rot || 0; return Array.from({ length: NS }, (_, i) => { const th = -Math.PI / 2 + i / NS * Math.PI * 2; const k = polar(kind, th - rot, o) * r; return [cx + Math.cos(th) * k, cy + Math.sin(th) * k]; }); }
  const mixPts = (a, b, p) => a.map((q, i) => [lerp(q[0], b[i][0], p), lerp(q[1], b[i][1], p)]);
  function fillPts(ctx, pts, col) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); }
  // morph through a list of keys [[t, kind, cx, cy, r, colour, o]]; returns {pts, col}
  function morphAt(keys, t, d = 0.45) {
    let i = 0; while (i + 1 < keys.length && t >= keys[i + 1][0]) i++;
    const k = keys[i]; const ptsOf = (q) => shape(q[1], q[2], q[3], q[4], q[6] || {});
    if (i + 1 < keys.length) { /* still on key i */ }
    if (i > 0) { const pk = keys[i - 1]; const p = xio(clamp((t - k[0]) / (k[7] || d))); if (p < 1) return { pts: mixPts(ptsOf(pk), ptsOf(k), p), col: mixHex(pk[5], k[5], p) }; }
    return { pts: ptsOf(k), col: k[5] };
  }

  // ---------------------------------------------------------------- the disc stack (2D slices → 3D): discs [{r, h, top, side}] bottom→top
  // tilt = ry/rx (0 = side view: flat slices, 1 = top view: concentric rings)
  function discs(ctx, cx, by, list, tilt, o = {}) {
    let y = by; const gap = o.gap || 0;
    for (const d of list) {
      if (d.r <= 0.3) { y -= d.h + gap; continue; }
      const rx = d.r, ry = Math.max(0.01, d.r * tilt);
      ctx.beginPath(); ctx.moveTo(cx - rx, y - d.h); ctx.lineTo(cx - rx, y); ctx.ellipse(cx, y, rx, ry, 0, Math.PI, 0, true); ctx.lineTo(cx + rx, y - d.h); ctx.closePath(); ctx.fillStyle = d.side || P.ink; ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx, y - d.h, rx, ry, 0, 0, 6.283); ctx.fillStyle = d.top; ctx.fill();
      y -= d.h + gap;
    }
    return y;
  }

  // ---------------------------------------------------------------- small UI bits (flat, no shadows, no gradients)
  function chipF(ctx, s, x, y, o = {}) { // flat pill chip, x = centre
    const p = o.p == null ? 1 : o.p; if (p <= 0) return 0; const size = o.size || 28; const tw = A.measure(ctx, s, size, o.w || 'S'); const w = tw + size * 1.4, h = size * 1.9;
    ctx.save(); ctx.translate(x, y); ctx.scale(lerp(0.6, 1, p), lerp(0.6, 1, p)); ctx.globalAlpha *= clamp(p * 2.5);
    A.roundRect(ctx, -w / 2, -h / 2, w, h, h / 2); if (o.line) { ctx.strokeStyle = o.line; ctx.lineWidth = 3; ctx.stroke(); } else { ctx.fillStyle = o.fill || P.ink; ctx.fill(); }
    txt(ctx, s, 0, size * 0.36, { size, w: o.w || 'S', color: o.color || P.white, align: 'center' }); ctx.restore(); return w;
  }
  function tokF(ctx, s, x, y, o = {}) { // latin token, flat rect
    const p = o.p == null ? 1 : o.p; if (p <= 0) return 0; const size = o.size || 26; ctx.save(); ctx.font = `700 ${size}px IN`; const tw = ctx.measureText(s).width; ctx.restore(); const w = tw + size * 1.0, h = size * 1.6;
    ctx.save(); ctx.translate(x, y); ctx.scale(lerp(0.6, 1, p), lerp(0.6, 1, p)); ctx.globalAlpha *= clamp(p * 2.5);
    ctx.fillStyle = o.fill || P.ink; ctx.fillRect(-w / 2, -h / 2, w, h); lat(ctx, s, 0, size * 0.36, { size, w: 700, color: o.color || P.white, align: 'center' }); ctx.restore(); return w;
  }
  const popE = (t, t0) => E(t, t0, 0.32);
  function arrowF(ctx, x0, y0, x1, y1, p, o = {}) {
    if (p <= 0) return; const x = lerp(x0, x1, clamp(p)), y = lerp(y0, y1, clamp(p)); const an = Math.atan2(y1 - y0, x1 - x0), s = o.head || 18;
    ctx.save(); ctx.strokeStyle = o.color || P.ink; ctx.fillStyle = o.color || P.ink; ctx.lineWidth = o.w || 5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x - Math.cos(an) * s * 0.7, y - Math.sin(an) * s * 0.7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(an - 0.5) * s, y - Math.sin(an - 0.5) * s); ctx.lineTo(x - Math.cos(an + 0.5) * s, y - Math.sin(an + 0.5) * s); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  // frame-quantised roll (no smeared digits under motion blur)
  const roll = (t, t0, d, a, b) => { const tq = Math.ceil(t * 60 - 1e-6) / 60; return lerp(a, b, E(tq, t0, d)); };

  // ---------------------------------------------------------------- beat clock + section label (top-left): something on every beat
  const LABELS = [];
  function clock(ctx, t) {
    if (t < F.OFF - 0.05 || t > F.CLOSE) return; const a = E(t, F.OFF - 0.05, 0.3) * outP(t, F.CLOSE - 0.35, 0.3); if (a <= 0) return;
    const col = inkOn(fieldAt(t, 140, 96)); const b = beatAt(t); const ph = (t - GRID0) / BEAT - b;
    ctx.save(); ctx.globalAlpha *= a;
    for (let k = 0; k < 4; k++) { const x = 96 + k * 22, y = 86; const on = ((b % 4) + 4) % 4 === k; ctx.fillStyle = col; if (on) { const s = lerp(16, 12, xo(clamp(ph * 3))); ctx.fillRect(x + 6 - s / 2, y + 6 - s / 2, s, s); } else { ctx.strokeStyle = hexA(col, 0.5); ctx.lineWidth = 2; ctx.strokeRect(x + 1, y + 1, 10, 10); } }
    let cur = null, prev = null; for (const l of LABELS) if (l[0] <= t) { prev = cur; cur = l; }
    if (cur) { const k = E(t, cur[0], 0.3); const draw1 = (l, al, dy) => { if (al > 0) txt(ctx, l[1], 196, 101 + dy, { size: 28, w: 'S', color: col, align: 'left', alpha: al }); }; if (prev && k < 1) draw1(prev, 1 - k, -k * 24); draw1(cur, k, (1 - k) * 24); }
    ctx.restore();
  }

  // ---------------------------------------------------------------- the one shot
  G.HUD_STYLE = 'none'; F.chapters.push({ t: F.OFF, label: 'أرقام الذهب' });
  F.scene({ name: 'reel', t0: 2.05, t1: F.CLOSE, ink: 'light', enter: { type: 'cut' },
    marksFn(ctx, t) { A.logo(ctx, 1843 - A.logoWidth(80), 50, 80, inkOn(fieldAt(t, 1780, 90))); A.xmark(ctx, 115, 984, 69, inkOn(fieldAt(t, 115, 984)), 0.6); },
    draw(ctx, t) {
      ctx.fillStyle = P.paper; ctx.fillRect(0, 0, W, H);
      for (const a of ACTS) {
        if (t < a.t0 || t >= a.t1) continue; const p = a.din ? clamp((t - a.t0) / a.din) : 1;
        ctx.save(); if (p < 1 && a.enter !== 'none') { maskPath(ctx, a, p); ctx.clip(a.enter === 'contract' ? 'evenodd' : 'nonzero'); }
        if (a.field) { ctx.fillStyle = P[a.field]; ctx.fillRect(0, 0, W, H); }
        a.draw(ctx, t); ctx.restore();
      }
      clock(ctx, t);
    } });

  G.REEL = { P, DARK, BPM, BEAT, BAR, GRID0, q8, beatAt, xo, xi, xio, E, EI, EIO, crit, outP, ACTS, act, fieldAt, inkOn, slat, slatRow, textW, NS, shape, mixPts, fillPts, morphAt, discs, chipF, tokF, popE, arrowF, roll, LABELS };
})(typeof window !== 'undefined' ? window : globalThis);
