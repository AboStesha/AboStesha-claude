// Gold series · Lesson 02 — THE THREAD: one gold line that runs through every frame of the film.
// It is the price line, the ground, the roof, the bars, the strike-through… Shapes are point lists resampled to N points by
// arc length; the thread morphs between shapes with a travelling front (the change ripples along the line like a pulled string).
(function (G) {
  const A = G.AX, GL = G.GL;
  const { W, H, clamp, lerp, hexA } = A;
  const N = 900;
  const cio = (p) => GL.cio(clamp(p));

  // ---------- geometry ----------
  function resample(pts, n = N) {
    const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const tot = L[L.length - 1] || 1; const out = new Array(n); let j = 1;
    for (let k = 0; k < n; k++) {
      const s = tot * k / (n - 1); while (j < pts.length - 1 && L[j] < s) j++;
      const a = pts[j - 1], b = pts[j]; const seg = L[j] - L[j - 1] || 1; const u = clamp((s - L[j - 1]) / seg);
      out[k] = [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
    }
    return out;
  }
  // polyline helpers (all return plain point lists; resample() at the end)
  const lineP = (x0, y0, x1, y1, n = 2) => Array.from({ length: n }, (_, i) => [lerp(x0, x1, i / (n - 1)), lerp(y0, y1, i / (n - 1))]);
  const arcP = (cx, cy, r, a0, a1, n = 40) => Array.from({ length: n + 1 }, (_, i) => { const a = lerp(a0, a1, i / n); return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
  const join = (...parts) => { const out = []; for (const p of parts) for (const q of p) { const l = out[out.length - 1]; if (!l || Math.hypot(l[0] - q[0], l[1] - q[1]) > 0.01) out.push(q); } return out; };
  // smooth a coarse polyline (Catmull-Rom) — for organic curves
  function smooth(p, seg = 10) {
    const out = [];
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)];
      for (let k = 0; k < seg; k++) {
        const t = k / seg, t2 = t * t, t3 = t2 * t;
        out.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
      }
    }
    out.push(p[p.length - 1]); return out;
  }
  // a horizontal line across the whole frame (with long tails so camera moves never show an end)
  const XL = -900, XR = W + 900;
  const flat = (y) => lineP(XL, y, XR, y, 2);
  // a value series drawn between x0..x1 (vals already in px), with tails at both ends
  const series = (x0, x1, ys) => { const n = ys.length; const pts = ys.map((y, i) => [lerp(x0, x1, i / (n - 1)), y]); return join([[XL, ys[0]]], pts, [[XR, ys[n - 1]]]); };

  // ---------- timeline: keys {t, d, wave, dir, f(t) → pts (N)} ----------
  const KEYS = [];
  const memo = new Map();
  // f may return a raw list; we resample once per (key, quantised time) for static shapes
  function key(t, d, f, o = {}) { const k = Object.assign({ t, d, f, wave: 0.55, dir: 1, ease: cio }, o); KEYS.push(k); KEYS.sort((a, b) => a.t - b.t); return k; }
  const stat = (pts) => { const r = resample(pts); return () => r; }; // static shape
  const backE = (p) => { const c1 = 1.25, c3 = c1 + 1; const q = clamp(p); return 1 + c3 * Math.pow(q - 1, 3) + c1 * Math.pow(q - 1, 2); };
  // modes: 'rise' = the new shape grows straight up/down out of the flat line y0 (no sideways slide);
  //        'settle' = the current shape folds flat onto y (keeps its x positions)
  function shapeOf(i, t) {
    const k = KEYS[i]; let tgt = k.f(t);
    if (i === 0 || t >= k.t + k.d) return tgt;
    let src = k.from ? k.from(t) : shapeOf(i - 1, t); const p = clamp((t - k.t) / k.d); if (p <= 0 && !k.mode) return src;
    if (k.mode === 'rise') src = tgt.map(([x]) => [x, k.y0]);
    if (k.mode === 'settle') tgt = src.map(([x]) => [x, k.y]);
    if (p <= 0) return src;
    const out = new Array(N); const wv = k.wave;
    for (let j = 0; j < N; j++) {
      const s = k.sx ? clamp((tgt[j][0] - k.sx[0]) / (k.sx[1] - k.sx[0])) : k.dir > 0 ? j / (N - 1) : k.dir < 0 ? 1 - j / (N - 1) : Math.abs(j / (N - 1) - 0.5) * 2;
      const q = k.ease(clamp((p * (1 + wv) - wv * s) / 1));
      out[j] = [lerp(src[j][0], tgt[j][0], q), lerp(src[j][1], tgt[j][1], q)];
    }
    return out;
  }
  // when the travelling front of key k has finished shaping the point at x (keys with sx)
  const doneAt = (k, x) => { const sv = clamp((x - k.sx[0]) / (k.sx[1] - k.sx[0])); return k.t + k.d * (1 + k.wave * sv) / (1 + k.wave); };
  // x of the front (the pen) at time t
  const frontX = (k, t) => { const p = clamp((t - k.t) / k.d); const sv = clamp((p * (1 + k.wave) - 0.5) / k.wave); return lerp(k.sx[0], k.sx[1], sv); };
  function at(t) {
    let i = -1; for (let k = 0; k < KEYS.length; k++) if (KEYS[k].t <= t) i = k; else break;
    if (i < 0) i = 0; return shapeOf(i, t);
  }

  // ---------- queries for things riding on the thread ----------
  // y on the thread at screen-x x (first crossing from the left among points within the visible span)
  function yAt(pts, x) { for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; if ((a[0] - x) * (b[0] - x) <= 0 && a[0] !== b[0]) { const u = (x - a[0]) / (b[0] - a[0]); return lerp(a[1], b[1], u); } } return pts[0][1]; }
  const uAt = (pts, u) => pts[Math.round(clamp(u) * (pts.length - 1))];

  // ---------- drawing: metallic wire — soft halo, gold body (vertical gradient), top highlight ----------
  function strokePath(ctx, pts, a, b) {
    const i0 = Math.max(0, Math.floor(a * (pts.length - 1))), i1 = Math.min(pts.length - 1, Math.ceil(b * (pts.length - 1)));
    ctx.beginPath(); ctx.moveTo(pts[i0][0], pts[i0][1]); for (let i = i0 + 1; i <= i1; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  }
  function draw(ctx, pts, o = {}) {
    const w = o.width || 6.5, a = o.a == null ? 0 : o.a, b = o.b == null ? 1 : o.b; if (b <= a) return;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    strokePath(ctx, pts, a, b);
    ctx.strokeStyle = hexA(o.dark ? '#F1C75B' : '#E2BE62', o.dark ? 0.28 : 0.22); ctx.lineWidth = w * 3.2; ctx.stroke();       // halo
    const g = ctx.createLinearGradient(0, o.gy0 == null ? 0 : o.gy0, 0, o.gy1 == null ? H : o.gy1);
    g.addColorStop(0, '#E9C76E'); g.addColorStop(0.45, '#D2A746'); g.addColorStop(1, '#B4892F');
    ctx.strokeStyle = g; ctx.lineWidth = w; ctx.stroke();                                                                          // body
    ctx.translate(0, -w * 0.22); strokePath(ctx, pts, a, b); ctx.strokeStyle = 'rgba(255,244,205,0.75)'; ctx.lineWidth = w * 0.28; ctx.stroke(); // highlight
    ctx.restore();
  }
  // glowing head (the pen) at a point
  function head(ctx, x, y, t, o = {}) {
    const r = o.r || 9; const pulse = 1 + 0.18 * Math.sin(t * 9);
    ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4.2 * pulse); g.addColorStop(0, 'rgba(255,226,140,0.75)'); g.addColorStop(1, 'rgba(255,226,140,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 4.2 * pulse, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#FFF4D2'; ctx.beginPath(); ctx.arc(x, y, r * 0.62, 0, 6.283); ctx.fill();
    ctx.strokeStyle = '#C79A36'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.stroke();
    ctx.restore();
  }
  // a bead threaded on the line
  function bead(ctx, x, y, r, o = {}) {
    ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    const g = ctx.createLinearGradient(0, y - r, 0, y + r); g.addColorStop(0, '#F6E2A4'); g.addColorStop(0.5, '#D9B04F'); g.addColorStop(1, '#9C7426');
    ctx.fillStyle = o.fill || g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
    ctx.strokeStyle = o.ring || 'rgba(255,255,255,0.85)'; ctx.lineWidth = 2; ctx.stroke();
    if (o.label) A.lat(ctx, o.label, x, y + r * 0.36, { size: r * 0.95, w: 700, color: o.labelColor || '#4A3608', align: 'center' });
    ctx.restore();
  }

  // ---------- noise for an unpredictable thread ----------
  const nz = (x, t, s = 1) => Math.sin(x * 0.0071 * s + t * 2.3) * 0.55 + Math.sin(x * 0.0173 * s - t * 3.1 + 1.7) * 0.3 + Math.sin(x * 0.041 * s + t * 5.3 + 0.4) * 0.15;
  const wobble = (pts, t, amp, o = {}) => (amp <= 0 ? pts : pts.map(([x, y]) => [x, y + amp * nz(x + (o.seed || 0) * 300, t, o.s || 1) * (o.env ? o.env(x) : 1)]));

  // a plucked string: decaying standing wave across the frame (the «twang» when the thread snaps straight)
  const twang = (pts, t, t0, amp = 26, o = {}) => { const lt = t - t0; if (lt < 0 || lt > 2.2) return pts; const a = amp * Math.exp(-lt * (o.decay || 3.2)) * Math.cos(lt * (o.f || 26)); const n = o.n || 3; return pts.map(([x, y]) => [x, y + a * Math.sin(Math.PI * n * (x / W))]); };
  G.TH = { doneAt, frontX, N, XL, XR, resample, lineP, arcP, join, smooth, flat, series, KEYS, key, stat, at, yAt, uAt, draw, head, bead, nz, wobble, twang, backE, memo };
})(typeof window !== 'undefined' ? window : globalThis);
