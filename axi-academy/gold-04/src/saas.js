// Gold series · Lesson 04 (finale) — «أوقات الذهب» — SaaS launch-film grammar (reference: Prompt Motion 7) in Axi's dark palette:
// a typed request that collapses into a pill, radar rings, a dotted globe with live pings, odometer counters, a tilted
// dashboard card with tabs and an area chart, notification toasts, an orbit network, a one-word-per-screen montage.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX;
  const { W, H, C, clamp, lerp, hexA, txt, lat, mixHex } = A;

  // ---------------------------------------------------------------- palette (Axi dark: eclipse / carbon / graphite + gold accent, red action, mint gains)
  const P = { bg0: '#101114', bg1: '#08090B', card: '#141518', card2: '#1B1C20', line: 'rgba(255,255,255,0.09)', grid: 'rgba(255,255,255,0.035)',
    white: '#FFFFFF', dim: '#8E9399', faint: '#5A5F66', gold: '#E2B04A', gold2: '#C9952E', red: '#E4002E', coral: '#FF3745', mint: '#5EE0BB', slate: '#607880', paper: '#F3F2EE' };
  const BPM = 124, BEAT = 60 / 124, GRID0 = F.OFF - 2 * BEAT;
  const q8 = (t) => GRID0 + Math.ceil((t - GRID0) / (BEAT / 2) - 1e-6) * (BEAT / 2);
  const beatAt = (t) => Math.floor((t - GRID0) / BEAT + 1e-6);
  const xo = (p) => (p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));
  const xi = (p) => (p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, 10 * (p - 1)));
  const xio = (p) => (p <= 0 ? 0 : p >= 1 ? 1 : p < 0.5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2);
  const E = (t, t0, d = 0.45) => xo(clamp((t - t0) / d));
  const EI = (t, t0, d = 0.35) => xi(clamp((t - t0) / d));
  const EIO = (t, t0, d = 0.6) => xio(clamp((t - t0) / d));
  const sp = (t, t0, w = 14, z = 0.62) => FX.springU(t - t0, w, z);    // soft spring for UI pops (the reference's UI springs)
  const outP = (t, t0, d = 0.3) => 1 - EI(t, t0, d);
  const tq = (t, fps = 60) => Math.ceil(t * fps - 1e-6) / fps;

  // ---------------------------------------------------------------- background: night grid
  function bg(ctx, o = {}) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, o.top || P.bg0); g.addColorStop(1, o.bot || P.bg1); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (o.grid !== false) { ctx.strokeStyle = P.grid; ctx.lineWidth = 1; ctx.beginPath(); for (let x = 0; x <= W; x += 80) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); } for (let y = 0; y <= H; y += 80) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); } ctx.stroke(); }
  }
  // small caps label (Latin/number tokens in Inter with tracking; Arabic in Readex)
  function cap(ctx, s, x, y, o = {}) {
    const ar = /[؀-ۿ]/.test(s);
    if (ar) return txt(ctx, s, x, y, { size: o.size || 20, w: o.w || 'S', color: o.color || P.dim, align: o.align || 'center', alpha: o.alpha });
    return lat(ctx, s, x, y, { size: o.size || 16, w: 700, color: o.color || P.dim, align: o.align || 'center', track: o.track == null ? 3 : o.track, alpha: o.alpha });
  }
  // glow line / glow stroke helpers (soft halo by stacking a wide translucent stroke under a crisp one)
  function glowStroke(ctx, col, wdt, alpha = 1) { ctx.save(); ctx.globalAlpha *= alpha * 0.25; ctx.lineWidth = wdt * 5; ctx.strokeStyle = col; ctx.stroke(); ctx.globalAlpha /= 0.25; ctx.globalAlpha *= 0.35; ctx.lineWidth = wdt * 2.4; ctx.stroke(); ctx.restore(); ctx.lineWidth = wdt; ctx.strokeStyle = col; ctx.stroke(); }

  // ---------------------------------------------------------------- the pill (short-link chip)
  function pill(ctx, cx, cy, s1, s2, o = {}) {
    const k = o.k == null ? 1 : o.k; if (k <= 0) return null; const size = o.size || 44;
    const w1 = A.measure(ctx, s1, size, 'S'), w2 = s2 ? A.measure(ctx, s2, size, 'S') : 0; const icon = size * 1.05; const pad = size * 0.55; const gap = s2 ? size * 0.26 : 0; const w = w1 + w2 + gap + icon + pad * 2.6, h = size * 1.9;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k);
    if (o.glow) { ctx.save(); ctx.globalAlpha *= o.glow; ctx.shadowColor = hexA(P.gold, 0.6); ctx.shadowBlur = 40; A.roundRect(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = 'rgba(0,0,0,0.01)'; ctx.fill(); ctx.restore(); }
    A.roundRect(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = o.fill || '#17181B'; ctx.fill(); ctx.strokeStyle = o.stroke || 'rgba(255,255,255,0.14)'; ctx.lineWidth = 2; ctx.stroke();
    // RTL: icon at the right, then s1 (white), then s2 (gold)
    const xr = w / 2 - pad; ctx.beginPath(); ctx.arc(xr - icon / 2, 0, icon * 0.36, 0, 6.283); ctx.strokeStyle = P.gold; ctx.lineWidth = size * 0.12; ctx.stroke(); ctx.beginPath(); ctx.arc(xr - icon / 2, 0, icon * 0.12, 0, 6.283); ctx.fillStyle = P.gold; ctx.fill();
    txt(ctx, s1, xr - icon - size * 0.3, size * 0.36, { size, w: 'S', color: P.white }); if (s2) txt(ctx, s2, xr - icon - size * 0.3 - w1 - gap, size * 0.36, { size, w: 'S', color: P.gold });
    ctx.restore(); return { w: w * k, h: h * k };
  }

  // ---------------------------------------------------------------- dotted globe (orthographic), continents from soft lat/long blobs
  const LAND = [ // [lon, lat, rLon, rLat] rough continental masses
    [20, 50, 22, 12], [10, 15, 18, 22], [25, -10, 14, 16], [45, 28, 16, 10], [80, 25, 14, 10], [105, 45, 40, 16], [100, 15, 14, 10], [135, 38, 6, 8], [120, -3, 16, 7], [134, -25, 18, 11],
    [-100, 45, 28, 14], [-90, 25, 10, 8], [-60, -15, 14, 22], [-70, -40, 6, 10], [-40, 70, 14, 7], [60, 60, 30, 10], [-120, 60, 18, 8], [45, 10, 6, 6]];
  const isLand = (lon, lat) => LAND.some(([lo, la, rlo, rla]) => { let d = lon - lo; d = ((d + 540) % 360) - 180; return (d * d) / (rlo * rlo) + ((lat - la) * (lat - la)) / (rla * rla) < 1; });
  const DOTS = (() => { const out = []; for (let la = -82; la <= 82; la += 1.7) { const n = Math.max(6, Math.round(360 * Math.cos(la * Math.PI / 180) / 1.7)); for (let i = 0; i < n; i++) { const lo = -180 + i * 360 / n; out.push([lo, la, isLand(lo, la)]); } } return out; })();
  // project lon/lat → screen for a globe at (cx, cy, R) with view centre (lon0, lat0); returns [x, y, z] (z > 0 front)
  function proj(lon, lat, lon0, lat0, cx, cy, R) {
    const l = (lon - lon0) * Math.PI / 180, p = lat * Math.PI / 180, p0 = lat0 * Math.PI / 180;
    const x = Math.cos(p) * Math.sin(l), y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l), z = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
    return [cx + R * x, cy - R * y, z];
  }
  function globe(ctx, cx, cy, R, lon0, lat0, o = {}) {
    const a = o.alpha == null ? 1 : o.alpha; if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    // body + atmosphere along the limb (a soft accent halo) + the rim line
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.fillStyle = '#0A0A0B'; ctx.fill();
    { const g = ctx.createRadialGradient(cx, cy, R * 0.72, cx, cy, R); g.addColorStop(0, hexA(o.rim || P.gold, 0)); g.addColorStop(1, hexA(o.rim || P.gold, 0.16)); ctx.fillStyle = g; ctx.fill(); }
    ctx.save(); ctx.shadowColor = hexA(o.rim || P.gold, 0.85); ctx.shadowBlur = 60; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.strokeStyle = hexA(o.rim || P.gold, 0.55); ctx.lineWidth = 6; ctx.stroke(); ctx.restore();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.strokeStyle = hexA(o.rim || P.gold, 0.95); ctx.lineWidth = 2.5; ctx.stroke();
    // dots: land bright, ocean faint; limb-darkened (bucketed by brightness → one path per bucket)
    const NB = 8, land = Array.from({ length: NB }, () => []), sea = Array.from({ length: NB }, () => []);
    for (const [lo, la, isL] of DOTS) {
      const [x, y, z] = proj(lo, la, lon0, lat0, cx, cy, R); if (z <= 0.03 || y < -10 || y > H + 10 || x < -10 || x > W + 10) continue;
      const b = Math.min(NB - 1, Math.floor(z * NB)); (isL ? land : sea)[b].push(x, y);
    }
    const dotC = o.dot || '#F0CF84';
    for (let b = 0; b < NB; b++) {
      const z = (b + 0.5) / NB;
      if (land[b].length) { ctx.fillStyle = hexA(dotC, (0.22 + 0.75 * z) * (o.landA == null ? 1 : o.landA)); ctx.beginPath(); const L = land[b]; for (let i = 0; i < L.length; i += 2) ctx.rect(L[i] - 1.5, L[i + 1] - 1.5, 3, 3); ctx.fill(); }
      if (sea[b].length) { ctx.fillStyle = hexA('#FFFFFF', 0.04 + 0.07 * z); ctx.beginPath(); const S2 = sea[b]; for (let i = 0; i < S2.length; i += 2) ctx.rect(S2[i] - 0.7, S2[i + 1] - 0.7, 1.4, 1.4); ctx.fill(); }
    }
    ctx.restore();
  }
  // a ping on the globe: an expanding ring + dot
  function ping(ctx, x, y, t, t0, col = P.red, o = {}) {
    const lt = t - t0; if (lt < 0) return; const k = Math.min(1, sp(t, t0, 16, 0.7));
    ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, (o.r || 6) * k, 0, 6.283); ctx.fill();
    for (let i = 0; i < 2; i++) { const q = ((lt * 0.9 + i * 0.5) % 1); ctx.globalAlpha = (1 - q) * 0.9; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, (o.r || 6) + q * (o.R || 40), 0, 6.283); ctx.stroke(); }
    ctx.restore();
  }

  // ---------------------------------------------------------------- odometer: each digit rolls on its own wheel (frame-quantised)
  function odo(ctx, value, x, y, size, t, o = {}) { // value as string (digits, separators); x = centre
    const s = String(value); ctx.save(); ctx.font = `${o.w || 600} ${size}px IN`; const dw = ctx.measureText('0').width; const total = Array.from(s).reduce((acc, ch) => acc + (/[0-9]/.test(ch) ? dw : ctx.measureText(ch).width), 0);
    let xx = (o.align === 'left' ? x : o.align === 'right' ? x - total : x - total / 2);
    for (const ch of s) {
      if (/[0-9]/.test(ch)) {
        const d = +ch; const roll = o.roll ? o.roll(ch) : 0; // fractional offset 0..1 into the next digit
        ctx.save(); ctx.beginPath(); ctx.rect(xx - 2, y - size * 0.92, dw + 4, size * 1.12); ctx.clip();
        for (let k = -1; k <= 1; k++) { const dd = (d + k + 10) % 10; lat(ctx, String(dd), xx, y - (k - roll) * size * 1.05 * -1, { size, w: o.w || 600, color: o.color || P.white }); }
        ctx.restore(); xx += dw;
      } else { lat(ctx, ch, xx, y, { size, w: o.w || 600, color: o.color || P.white }); xx += ctx.measureText(ch).width; }
    }
    ctx.restore(); return total;
  }
  // a rolling integer: shows floor(v) with the last digit wheel moving continuously
  function rollNum(ctx, v, x, y, size, o = {}) {
    const n = Math.floor(v), frac = v - n; const s = n.toLocaleString('en-US'); let i = 0; const digits = s.replace(/[^0-9]/g, '').length;
    return odo(ctx, (o.prefix || '') + s + (o.suffix || ''), x, y, size, 0, Object.assign({}, o, { roll: () => { i++; return i === digits ? frac : 0; } }));
  }

  // ---------------------------------------------------------------- tilted card: draw content into an offscreen canvas, then warp it with
  // perspective (rotateX / rotateY approximation by strips)
  const CARDS = new Map();
  function tiltCard(ctx, id, cw, ch, cx, cy, rx, ry, drawFn, o = {}) {
    let cv = CARDS.get(id); if (!cv || cv.width !== cw || cv.height !== ch) { cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; CARDS.set(id, cv); }
    const c = cv.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cw, ch); drawFn(c);
    const n = 48; const sc = o.scale || 1; const persp = 1600;
    ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    if (o.shadow !== false) { ctx.save(); ctx.globalAlpha *= 0.55; ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.filter = 'blur(30px)'; ctx.fillRect(cx - cw * sc / 2 + 30, cy - ch * sc / 2 + 50, cw * sc, ch * sc); ctx.filter = 'none'; ctx.restore(); }
    for (let i = 0; i < n; i++) {
      const v0 = i / n, v1 = (i + 1) / n; const yy0 = (v0 - 0.5) * ch * sc, yy1 = (v1 - 0.5) * ch * sc;
      // rotateX: rows further back shrink; rotateY: horizontal skew via per-row offset
      const z0 = yy0 * Math.sin(rx), z1 = yy1 * Math.sin(rx); const s0 = persp / (persp + z0), s1 = persp / (persp + z1);
      const y0 = cy + yy0 * Math.cos(rx) * s0, y1 = cy + yy1 * Math.cos(rx) * s1; const s = (s0 + s1) / 2; const wr = cw * sc * s;
      const shear = Math.sin(ry) * (v0 - 0.5) * 120;
      ctx.drawImage(cv, 0, Math.floor(v0 * ch), cw, Math.ceil((v1 - v0) * ch) + 1, cx - wr / 2 + shear, y0, wr, Math.max(1, y1 - y0) + 0.6);
    }
    ctx.restore();
  }
  // area chart into a box (vertical gradient fill), values 0..1, reveal 0..1
  function area(c, xs, ys, x, y, w, h, col, reveal = 1, o = {}) {
    const n = ys.length; const pts = ys.map((v, i) => [x + w * i / (n - 1), y + h - v * h]); const m = Math.max(2, Math.ceil(n * clamp(reveal)));
    c.save(); c.beginPath(); c.moveTo(pts[0][0], y + h); for (let i = 0; i < m; i++) c.lineTo(pts[i][0], pts[i][1]); c.lineTo(pts[m - 1][0], y + h); c.closePath();
    const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, hexA(col, 0.45)); g.addColorStop(1, hexA(col, 0)); c.fillStyle = g; c.fill();
    c.beginPath(); for (let i = 0; i < m; i++) i ? c.lineTo(pts[i][0], pts[i][1]) : c.moveTo(pts[i][0], pts[i][1]); c.strokeStyle = col; c.lineWidth = o.lw || 3; c.lineJoin = 'round'; c.stroke();
    const e = pts[m - 1]; c.fillStyle = '#FFFFFF'; c.beginPath(); c.arc(e[0], e[1], 5, 0, 6.283); c.fill(); c.restore();
    return pts;
  }

  // ---------------------------------------------------------------- toast (notification) — RTL
  function toast(ctx, x, y, w, title, sub, t, t0, o = {}) {
    const k = sp(t, t0, 15, 0.7); if (k <= 0) return; const h = 88; const dx = (1 - Math.min(1, k)) * 260;
    ctx.save(); ctx.globalAlpha *= clamp(k * 2) * (o.alpha == null ? 1 : o.alpha); ctx.translate(dx, 0);
    A.roundRect(ctx, x - w, y, w, h, 16); ctx.fillStyle = 'rgba(28,29,33,0.96)'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = o.dot || P.gold; ctx.beginPath(); ctx.arc(x - 32, y + h / 2, 9, 0, 6.283); ctx.fill();
    txt(ctx, title, x - 60, y + (sub ? 38 : 54), { size: 28, w: 'S', color: P.white }); if (sub) txt(ctx, sub, x - 60, y + 72, { size: 22, w: 'R', color: P.dim });
    if (o.time) { if (o.timeFn) o.timeFn(ctx, x - w + 24, y + 56); else lat(ctx, o.time, x - w + 24, y + 56, { size: 26, w: 700, color: o.tcol || P.gold }); }
    ctx.restore();
  }


  // ---------------------------------------------------------------- montage card frame (one word per screen): small logo top-left, «0n / 0N» top-right,
  // a bracket label bottom-left, a progress line bottom-right
  function frameUI(ctx, idx, total, label, ink, prog) { // RTL + brand-safe: counter and label top-left (the Axi logo owns top-right, the X bottom-left)
    lat(ctx, String(idx).padStart(2, '0') + ' / ' + String(total).padStart(2, '0'), 64, 72, { size: 20, w: 700, color: ink, track: 3 });
    txt(ctx, '[ ' + label + ' ]', 196, 72, { size: 22, w: 'S', color: ink, align: 'left' });
    ctx.fillStyle = hexA(ink, 0.25); ctx.fillRect(64, 94, 180, 3); ctx.fillStyle = ink; ctx.fillRect(64, 94, 180 * clamp(prog), 3);
  }


  // ---------------------------------------------------------------- the close in the film's language: X sting on the night grid → a light end card
  // (Axi logo, the line, a red pill + an outlined pill) → risk strip for the last 3 s
  F.addCloseSaaS = function (o = {}) {
    const CL = { t0: F.CLOSE, t1: F.TOTAL + 1 };
    F.sfx(CL.t0 - 0.4, 'whoosh', 0.18, { d: 0.45 }); F.sfx(CL.t0 + 0.02, 'sting', 0.6); F.sfx(CL.t0 + 1.0, 'whoosh', 0.16, { d: 0.45 }); F.sfx(CL.t0 + 1.45, 'pop', 0.22, { f: 820 }); F.sfx(CL.t0 + 1.65, 'pop', 0.16, { f: 640 });
    const x3d = (ctx, cx, cy, h, depth) => { for (let d = depth; d > 0; d -= 1.5) A.xmark(ctx, cx + d * 0.55, cy + d, h, C.slate, 1); A.xmark(ctx, cx, cy, h, C.white, 1); };
    F.scene({ name: 'close', t0: CL.t0, t1: CL.t1, ink: 'slate', noMarks: true, enter: { type: 'cut' }, draw(ctx, t) {
      const lt = t - CL.t0; const light = EIO(t, CL.t0 + 0.95, 0.5);
      bg(ctx);
      // the X sting out of the red caret
      const seal = EI(t, CL.t0 + 0.9, 0.25);
      if (seal < 1) { const gs = FX.springU(lt, 11, 0.62) * (1 - seal); ctx.save(); ctx.translate(960, 540); ctx.scale(gs, gs); x3d(ctx, 0, 0, 300, 26); ctx.restore(); if (lt < 0.25) { ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(960, 540, 12 * (1 - lt / 0.25), 0, 6.283); ctx.fill(); } }
      // light end card rises from the bottom (a vertical brand band, slate → paper)
      if (light > 0) {
        const top = lerp(H, 0, light); ctx.save(); ctx.beginPath(); ctx.rect(0, top, W, H - top); ctx.clip();
        const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#F7F7F4'); g.addColorStop(0.62, '#EEF0F1'); g.addColorStop(1, '#B5C8CD'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        const k1 = sp(t, CL.t0 + 1.2, 13, 0.7), k2 = sp(t, CL.t0 + 1.35, 13, 0.7), k3 = sp(t, CL.t0 + 1.45, 14, 0.7), k4 = sp(t, CL.t0 + 1.65, 14, 0.7);
        const lh = 96, lw = A.logoWidth(lh); if (k1 > 0) { ctx.save(); ctx.translate(960, 330); ctx.scale(Math.min(1, k1), Math.min(1, k1)); A.logo(ctx, -lw / 2, -lh / 2, lh, C.ink); ctx.restore(); }
        if (k2 > 0) { ctx.save(); ctx.globalAlpha *= clamp(k2 * 2); txt(ctx, o.line || 'تعلّم ثم تعلّم ثم تدرّب ثم', 1010, 560 + (1 - Math.min(1, k2)) * 30, { size: 64, w: 'S', color: C.ink, align: 'center' }); txt(ctx, o.word || 'تداول.', 1010 - A.measure(ctx, o.line || 'تعلّم ثم تعلّم ثم تدرّب ثم', 64, 'S') / 2 - 14, 560 + (1 - Math.min(1, k2)) * 30, { size: 64, w: 'S', color: C.red, align: 'right' }); ctx.restore(); }
        G.KIT.pill(ctx, 'تعلّم مع Axi', 1060, 700, { p: clamp(k3, 0, 1.05), size: 30, h: 72 });
        if (k4 > 0) { ctx.save(); const s = Math.min(1, k4); ctx.translate(800, 700); ctx.scale(lerp(0.6, 1, s), lerp(0.6, 1, s)); ctx.globalAlpha *= clamp(k4 * 2); A.roundRect(ctx, -110, -36, 220, 72, 36); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.strokeStyle = '#C4C8CC'; ctx.lineWidth = 2; ctx.stroke(); lat(ctx, 'axi.com/ar', 0, 9, { size: 26, w: 600, color: C.ink, align: 'center' }); ctx.restore(); }
        ctx.restore();
      }
      const pr = E(t, F.TOTAL - 3.0, 0.3);
      if (pr > 0) {
        ctx.save(); ctx.globalAlpha = pr; ctx.fillStyle = 'rgba(9,10,13,0.75)'; ctx.fillRect(0, 930, W, 150);
        txt(ctx, 'تنطوي عقود الفروقات والمنتجات المشتقة خارج البورصة على مخاطر عالية قد تؤدي إلى خسارة رأس المال. المحتوى التعليمي والتحليلي لا يُعدّ نصيحة استثمارية.', 960, 990, { size: 22, w: 'R', color: C.white, align: 'center' });
        txt(ctx, 'قد لا يكون هذا المحتوى متاحاً في منطقتك. يُرجى الرجوع إلى شروط الخدمة.', 960, 1032, { size: 22, w: 'R', color: hexA(C.white, 0.8), align: 'center' });
        ctx.restore();
      }
    } });
  };

  // ---------------------------------------------------------------- the one shot
  const SCN = [];   // { t0, t1, draw(ctx, t) } in time order; each paints its own background
  const scn = (d) => { SCN.push(d); SCN.sort((a, b) => a.t0 - b.t0); return d; };
  G.HUD_STYLE = 'none'; F.chapters.push({ t: F.OFF, label: 'أوقات الذهب' });
  F.scene({ name: 'saas', t0: 2.05, t1: F.CLOSE, ink: 'dark', enter: { type: 'cut' },
    marksFn(ctx, t) { const lightBg = SCN.some((s) => t >= s.t0 && t < s.t1 && s.light && (!s.lightAt || s.lightAt(t))); const col = lightBg ? C.ink : C.white; A.logo(ctx, 1843 - A.logoWidth(80), 50, 80, col); A.xmark(ctx, 115, 984, 69, col, 0.6); },
    draw(ctx, t) { bg(ctx); for (const s of SCN) if (t >= s.t0 && t < s.t1) s.draw(ctx, t); } });


  // ---------------------------------------------------------------- digit wheels: each digit of `from` rolls forward to the digit of `to`
  // (through the digits in between), other characters swap with a short slide. Starts at t0 (+ stagger per char), lasts d.
  function wheels(ctx, from, to, t, t0, x, y, size, o = {}) {
    const n = Math.max(from.length, to.length); const a = from.padStart(n, ' '), b = to.padStart(n, ' ');
    const wgt = o.w || 600; ctx.save(); ctx.font = `${wgt} ${size}px IN`; const dw = ctx.measureText('0').width;
    const cw = []; for (let i = 0; i < n; i++) { const ca = a[i], cb = b[i]; cw.push(/[0-9]/.test(ca) && /[0-9]/.test(cb) ? dw : Math.max(ctx.measureText(ca).width, ctx.measureText(cb).width)); }
    ctx.restore();
    const total = cw.reduce((s, v) => s + v, 0); let xx = o.align === 'left' ? x : o.align === 'right' ? x - total : x - total / 2;
    const d = o.d || 0.55, st = o.stagger == null ? 0.05 : o.stagger, col = o.color || P.white, lh = size * 1.12;
    for (let i = 0; i < n; i++) {
      const ca = a[i], cb = b[i]; const ti = t0 + st * i; const e = o.snap ? (t >= ti ? 1 : 0) : xio(clamp((t - ti) / d));
      ctx.save(); ctx.beginPath(); ctx.rect(xx - 3, y - size * 0.98, cw[i] + 6, size * 1.22); ctx.clip();
      if (/[0-9]/.test(ca) && /[0-9]/.test(cb)) {
        const da = +ca, fwd = ((+cb - da) % 10 + 10) % 10; const steps = o.dir === -1 ? -(((da - +cb) % 10 + 10) % 10) : fwd + (o.loops && ca !== cb ? 10 * o.loops : 0); const v = da + steps * e; const d0 = Math.floor(v + 1e-6), fr = v - d0;
        lat(ctx, String(((d0 % 10) + 10) % 10), xx + cw[i] / 2, y - fr * lh, { size, w: wgt, color: col, align: 'center' });
        if (fr > 0.001) lat(ctx, String((((d0 + 1) % 10) + 10) % 10), xx + cw[i] / 2, y + (1 - fr) * lh, { size, w: wgt, color: col, align: 'center' });
      } else if (ca === cb) lat(ctx, ca, xx + cw[i] / 2, y, { size, w: wgt, color: col, align: 'center' });
      else { if (e < 1) lat(ctx, ca, xx + cw[i] / 2, y - e * lh, { size, w: wgt, color: col, align: 'center' }); if (e > 0) lat(ctx, cb, xx + cw[i] / 2, y + (1 - e) * lh, { size, w: wgt, color: col, align: 'center' }); }
      ctx.restore(); xx += cw[i];
    }
    return total;
  }
  // a chain of states: [[t, 'str'], ...] → wheels between consecutive states
  function wheelSeq(ctx, seq, t, x, y, size, o = {}) {
    let k = 0; for (let i = 1; i < seq.length; i++) if (t >= seq[i][0]) k = i;
    if (k === 0) return wheels(ctx, seq[0][1], seq[0][1], t, 0, x, y, size, o);
    return wheels(ctx, seq[k - 1][1], seq[k][1], t, seq[k][0], x, y, size, o);
  }
  // typed line (RTL) with the red caret; words [{s, t, col}] appear at their spoken time, letter by letter
  function typeLine(ctx, words, xc, y, size, t, o = {}) {
    const wgt = o.w || 'S', sp = A.measure(ctx, ' ', size, wgt);
    const ws = words.map((x) => A.measure(ctx, x.s, size, wgt)); const fw = ws.reduce((s, v) => s + v, 0) + sp * (words.length - 1);
    const parts = []; let typing = false, vw = 0;
    for (let i = 0; i < words.length; i++) {
      const wd = words[i]; if (t < wd.t) break; const n = Math.min(wd.s.length, Math.floor((t - wd.t) / (o.cps || 0.035)) + 1); if (n < wd.s.length) typing = true;
      const part = wd.s.slice(0, n); const pw = n < wd.s.length ? A.measure(ctx, part, size, wgt) : ws[i]; parts.push([part, pw, wd.col]); vw += pw + (i ? sp : 0);
    }
    const xr = o.xr != null ? o.xr : o.center ? xc + vw / 2 : xc + fw / 2; let x = xr;
    parts.forEach(([part, pw, col], i) => { txt(ctx, part, x, y, { size, w: wgt, color: col || o.color || P.white, alpha: o.alpha }); x -= pw + sp; });
    if (o.caret !== false) { const on = typing || ((t - (o.blink0 || 0)) % 1.0 < 0.55); if (on) { ctx.save(); ctx.fillStyle = P.red; ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha; ctx.fillRect((parts.length ? x + sp - 14 : xr) - 3, y - size * 0.86, 6, size * 1.08); ctx.restore(); } }
    return { fw, vw, xr, x };
  }

  // dark glass panel
  function panel(c, x, y, w, h, o = {}) { A.roundRect(c, x, y, w, h, o.r == null ? 18 : o.r); c.fillStyle = o.fill || P.card; c.fill(); c.strokeStyle = o.stroke || 'rgba(255,255,255,0.09)'; c.lineWidth = o.lw || 1.5; c.stroke(); }
  // great-circle arc between two places, lifted off the surface; p reveals it
  function gcArc(ctx, A1, B1, lon0, lat0, cx, cy, R, p, col, o = {}) {
    if (p <= 0) return null; const r = Math.PI / 180; const v = (lo, la) => [Math.cos(la * r) * Math.cos(lo * r), Math.cos(la * r) * Math.sin(lo * r), Math.sin(la * r)];
    const a = v(A1[0], A1[1]), b = v(B1[0], B1[1]); const om = Math.acos(clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1)); const n = 48, m = Math.max(2, Math.ceil(n * p)); const pts = [];
    for (let i = 0; i <= m; i++) {
      const u = (i / n), s1 = Math.sin((1 - u) * om) / Math.sin(om), s2 = Math.sin(u * om) / Math.sin(om); const q = [a[0] * s1 + b[0] * s2, a[1] * s1 + b[1] * s2, a[2] * s1 + b[2] * s2];
      const lo = Math.atan2(q[1], q[0]) / r, la = Math.asin(clamp(q[2], -1, 1)) / r; const lift = 1 + (o.lift || 0.12) * Math.sin(Math.PI * u);
      const [x, y] = proj(lo, la, lon0, lat0, cx, cy, R * lift); const [xs, ys] = proj(lo, la, lon0, lat0, cx, cy, R); pts.push([cx + (x - cx), cy + (y - cy)]);
    }
    ctx.save(); ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.lineCap = 'round'; glowStroke(ctx, col, o.lw || 3); ctx.restore();
    return pts;
  }
  // 24-hour dial (Baghdad time): 00 at the top, clockwise
  const hAng = (h) => -Math.PI / 2 + h * Math.PI / 12;
  function dialArc(ctx, cx, cy, r, h0, h1, col, wdt, p = 1, o = {}) {
    if (p <= 0) return; const a0 = hAng(h0), a1 = hAng(h0 + (h1 - h0) * clamp(p)); ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, a0, a1); ctx.lineCap = o.cap || 'butt';
    if (o.glow) { ctx.globalAlpha *= 0.18; ctx.lineWidth = wdt * 1.8; ctx.strokeStyle = col; ctx.stroke(); ctx.globalAlpha /= 0.18; }
    ctx.lineWidth = wdt; ctx.strokeStyle = col; ctx.stroke(); ctx.restore();
  }
  // a toggle switch (two labels, a knob that slides to the active side; k 0 = right/first, 1 = left/second)
  function toggle(ctx, cx, cy, k, l1, l2, o = {}) {
    const w = o.w || 120, h = o.h || 56; ctx.save(); A.roundRect(ctx, cx - w / 2, cy - h / 2, w, h, h / 2); ctx.fillStyle = mixHex(o.c1 || P.gold, o.c2 || '#C4C8CC', clamp(k)); ctx.globalAlpha *= 0.25; ctx.fill(); ctx.globalAlpha /= 0.25; ctx.strokeStyle = mixHex(o.c1 || P.gold, o.c2 || '#C4C8CC', clamp(k)); ctx.lineWidth = 2; ctx.stroke();
    const kx = lerp(cx + w / 2 - h / 2, cx - w / 2 + h / 2, k); ctx.beginPath(); ctx.arc(kx, cy, h / 2 - 7, 0, 6.283); ctx.fillStyle = mixHex(o.c1 || P.gold, o.c2 || '#C4C8CC', clamp(k)); ctx.fill();
    txt(ctx, l1, cx + w / 2 + 22, cy + 11, { size: o.size || 30, w: 'S', color: hexA('#FFFFFF', lerp(1, 0.4, clamp(k))), align: 'left' }); txt(ctx, l2, cx - w / 2 - 22, cy + 11, { size: o.size || 30, w: 'S', color: hexA('#FFFFFF', lerp(0.4, 1, clamp(k))), align: 'right' });
    ctx.restore();
  }

  G.SAAS = { wheels, wheelSeq, typeLine, panel, gcArc, hAng, dialArc, toggle, frameUI, P, BPM, BEAT, GRID0, q8, beatAt, xo, xi, xio, E, EI, EIO, sp, outP, tq, bg, cap, glowStroke, pill, globe, proj, ping, odo, rollNum, tiltCard, area, toast, scn, SCN };
})(typeof window !== 'undefined' ? window : globalThis);
