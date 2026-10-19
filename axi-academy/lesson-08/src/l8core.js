// Lesson 08 core — the one-take camera, the day/night worlds, and the props of the shot:
// the glass account tank (liquid = equity, dark band = used margin), the trade card, the broker vault ↔ house,
// the leverage slider, the notional block, coins, the pair tile, the lot bar, the order ticket, the platform panel,
// the price chart, the call card, the margin-level ruler and the recap cards.
(function (G) {
  const A = G.AX, FX = G.FX, K = G.KIT;
  const { W, H, C, clamp, lerp, inv, eo, ei, eio, hexA, mixHex, txt, lat, measure, roundRect } = A;
  const L8 = G.L8 = {};
  // house curves
  const cio = (t, t0, d) => { const p = clamp((t - t0) / d); return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  const spr = (t, t0, w = 14, z = 0.5) => FX.springU(t - t0, w, z);
  const pulse = (t, t0, s = 0.12) => Math.exp(-Math.pow((t - t0) / s, 2));
  L8.cio = cio; L8.spr = spr; L8.pulse = pulse;

  // ================================================================ camera
  // keys {t: arrival, d: move duration, x, y, z, r(deg)}; the pose at t starts from key 0 and adds every move in progress
  L8.CAM = []; L8.PUSH = [];
  L8.cam = function (t) {
    const ks = L8.CAM; let x = ks[0].x, y = ks[0].y, lz = Math.log(ks[0].z), r = ks[0].r || 0;
    for (let i = 1; i < ks.length; i++) {
      const k = ks[i], pk = ks[i - 1]; const p = (k.ease || cio)(t, k.t - k.d, k.d); if (p <= 0) continue;
      x += (k.x - pk.x) * p; y += (k.y - pk.y) * p; lz += (Math.log(k.z) - Math.log(pk.z)) * p; r += ((k.r || 0) - (pk.r || 0)) * p;
    }
    // hand-held float + a small push on every chapter change
    x += 6 * Math.sin(t * 0.23) + 3 * Math.sin(t * 0.61 + 1); y += 4 * Math.sin(t * 0.17 + 2) + 2 * Math.sin(t * 0.53);
    r += 0.18 * Math.sin(t * 0.11 + 0.5);
    let z = Math.exp(lz) * (1 + 0.008 * Math.sin(t * 0.19));
    for (const tc of L8.PUSH) z *= 1 + 0.028 * pulse(t, tc, 0.35);
    return { x, y, z, r };
  };
  L8.apply = function (ctx, cam) { ctx.translate(960, 540); ctx.rotate(cam.r * Math.PI / 180); ctx.scale(cam.z, cam.z); ctx.translate(-cam.x, -cam.y); };
  // world → screen (for screen-space overlays that follow a world point)
  L8.toScreen = function (cam, x, y) {
    const a = cam.r * Math.PI / 180, dx = (x - cam.x) * cam.z, dy = (y - cam.y) * cam.z;
    return [960 + dx * Math.cos(a) - dy * Math.sin(a), 540 + dx * Math.sin(a) + dy * Math.cos(a)];
  };

  // ================================================================ worlds: day paper and night carbon, as discs that grow from a point
  L8.DISCS = []; // {t0, d, cx, cy (screen), to: 1 night | 0 day}
  const RMAX = 1350;
  L8.baseDark = (t) => { let dk = 0; for (const D of L8.DISCS) if (t >= D.t0 + D.d) dk = D.to; return dk; };
  L8.discAt = (t) => { for (const D of L8.DISCS) if (t >= D.t0 && t < D.t0 + D.d) return { D, r: RMAX * cio(t, D.t0, D.d) }; return null; };
  L8.DK = 0;
  L8.twoWorlds = function (ctx, t, fn) {
    const d = L8.discAt(t);
    if (!d) { L8.DK = L8.baseDark(t); fn(); return; }
    const { D, r } = d;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.moveTo(D.cx + r, D.cy); ctx.arc(D.cx, D.cy, r, 0, 6.283); ctx.clip('evenodd'); L8.DK = 1 - D.to; fn(); ctx.restore();
    if (r > 0.5) { ctx.save(); ctx.beginPath(); ctx.arc(D.cx, D.cy, r, 0, 6.283); ctx.clip(); L8.DK = D.to; fn(); ctx.restore(); }
    L8.DK = L8.baseDark(t);
  };
  L8.rim = function (ctx, t) { const d = L8.discAt(t); if (d && d.r > 1) { ctx.save(); ctx.strokeStyle = hexA(C.red, 0.85 * (1 - d.r / RMAX)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(d.D.cx, d.D.cy, d.r, 0, 6.283); ctx.stroke(); ctx.restore(); } };
  L8.ink = () => (L8.DK ? C.white : C.ink);
  L8.sub = () => (L8.DK ? C.silver : C.slate);
  L8.muted = () => (L8.DK ? hexA(C.white, 0.45) : hexA(C.slate, 0.55));

  // background (screen) + world dot grid (drawn under the camera so it carries parallax)
  L8.background = function (ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    if (L8.DK) { g.addColorStop(0, '#17181B'); g.addColorStop(1, '#0B0D0D'); } else { g.addColorStop(0, '#FBFBFB'); g.addColorStop(1, C.frost); }
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  };
  L8.dots = function (ctx, cam) {
    let gap = 48; while (gap * cam.z < 22) gap *= 2;
    const hw = 1150 / cam.z, hh = 760 / cam.z; // a little more than half the screen (covers the rotation)
    const x0 = Math.floor((cam.x - hw) / gap) * gap, x1 = cam.x + hw, y0 = Math.floor((cam.y - hh) / gap) * gap, y1 = cam.y + hh;
    const r = clamp(1.7, 0.9 / cam.z, 3.4 / cam.z);
    ctx.save(); ctx.fillStyle = L8.DK ? 'rgba(255,255,255,0.10)' : 'rgba(96,120,128,0.19)';
    ctx.beginPath();
    for (let y = y0; y <= y1; y += gap) for (let x = x0; x <= x1; x += gap) { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, 6.283); }
    ctx.fill(); ctx.restore();
  };

  // ================================================================ the glass account tank
  // o: {x (centre), y (base), w, h, glass 0..1, fill 0..1 (equity height / h), band 0..1 (used margin height / h),
  //     lock 0..1, hatch 0..1, wave px, t, bubbles 0..1, sheen, alpha, ticks 0..1, bandGlow 0..1}
  const LIQ = { day: ['#93A8AE', '#5A7077'], night: ['#A8BEC4', '#4D646B'] };
  L8.tankGeo = (o) => ({ x0: o.x - o.w / 2, x1: o.x + o.w / 2, yb: o.y, yt: o.y - o.h, rb: Math.min(34, o.w * 0.12) });
  function wallPath(g) { // open-top vessel: left wall down, rounded bottom, right wall up
    const { x0, x1, yb, yt, rb } = g; const p = [];
    p.push([x0, yt]); p.push([x0, yb - rb]);
    for (let i = 1; i <= 8; i++) { const a = Math.PI - i / 8 * Math.PI / 2; p.push([x0 + rb + Math.cos(a) * rb, yb - rb + Math.sin(a) * rb]); }
    p.push([x1 - rb, yb]);
    for (let i = 1; i <= 8; i++) { const a = Math.PI / 2 - i / 8 * Math.PI / 2; p.push([x1 - rb + Math.cos(a) * rb, yb - rb + Math.sin(a) * rb]); }
    p.push([x1, yt]); return p;
  }
  function innerClip(ctx, g, inset = 5) {
    const { x0, x1, yb, yt, rb } = g; ctx.beginPath();
    ctx.moveTo(x0 + inset, yt - 400); ctx.lineTo(x0 + inset, yb - rb); ctx.arcTo(x0 + inset, yb - inset, x0 + rb, yb - inset, rb - inset);
    ctx.lineTo(x1 - rb, yb - inset); ctx.arcTo(x1 - inset, yb - inset, x1 - inset, yb - rb, rb - inset); ctx.lineTo(x1 - inset, yt - 400); ctx.closePath();
  }
  L8.surfaceY = (o, x) => {
    const g = L8.tankGeo(o); const ys = g.yb - o.fill * o.h; const u = (x - g.x0) / o.w; const t = o.t || 0; const a = o.wave == null ? 5 : o.wave;
    return ys + a * (0.6 * Math.sin(u * 7.5 + t * 2.1) + 0.4 * Math.sin(u * 17 - t * 2.9)) + (o.tilt || 0) * (u - 0.5) * o.w;
  };
  L8.tank = function (ctx, o) {
    const g = L8.tankGeo(o); const gl = o.glass == null ? 1 : o.glass; if (gl <= 0) return g;
    const dk = L8.DK; const al = o.alpha == null ? 1 : o.alpha;
    ctx.save(); ctx.globalAlpha *= al;
    // glass body (frosted back panel)
    const body = clamp(gl * 1.4 - 0.4);
    if (body > 0) {
      ctx.save(); ctx.globalAlpha *= body; innerClip(ctx, g, 0); ctx.save(); ctx.clip();
      const bg = ctx.createLinearGradient(0, g.yt, 0, g.yb); // vertical only (brand)
      bg.addColorStop(0, dk ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)'); bg.addColorStop(1, dk ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.3)');
      ctx.fillStyle = bg; ctx.fillRect(g.x0, g.yt, o.w, o.h + 2); ctx.restore(); ctx.restore();
    }
    // liquid (equity) with a live surface
    const fill = o.fill || 0;
    if (fill > 0.001 && body > 0) {
      ctx.save(); innerClip(ctx, g, 5); ctx.clip();
      const n = 48; const pts = []; for (let i = 0; i <= n; i++) { const x = g.x0 + i / n * o.w; pts.push([x, L8.surfaceY(o, x)]); }
      const lc = dk ? LIQ.night : LIQ.day; const ysurf = g.yb - fill * o.h;
      const lg = ctx.createLinearGradient(0, ysurf, 0, g.yb); lg.addColorStop(0, lc[0]); lg.addColorStop(1, lc[1]);
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.lineTo(g.x1, g.yb + 2); ctx.lineTo(g.x0, g.yb + 2); ctx.closePath();
      ctx.fillStyle = lg; ctx.fill();
      // caustic light bands inside the liquid
      ctx.globalAlpha *= 0.12; ctx.strokeStyle = C.white; ctx.lineWidth = 2;
      for (let k = 0; k < 3; k++) { ctx.beginPath(); for (let i = 0; i <= n; i++) { const x = g.x0 + i / n * o.w; const y = L8.surfaceY(o, x) + 26 + k * 34 + 6 * Math.sin(i * 0.5 + (o.t || 0) * (1.2 + k * 0.3)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
      ctx.restore();
      // used-margin band: the reserved bottom of the liquid
      const band = o.band || 0;
      if (band > 0.002) {
        ctx.save(); innerClip(ctx, g, 5); ctx.clip();
        const yTop = g.yb - band * o.h; const bandSurf = Math.max(yTop, g.yb - fill * o.h - 1);
        const bgr = ctx.createLinearGradient(0, bandSurf, 0, g.yb); bgr.addColorStop(0, dk ? '#2B3238' : '#2A3036'); bgr.addColorStop(1, dk ? '#111417' : '#14171A');
        ctx.globalAlpha *= o.bandAlpha == null ? 1 : o.bandAlpha;
        ctx.fillStyle = bgr; ctx.fillRect(g.x0, bandSurf, o.w, g.yb - bandSurf + 2);
        const hp = o.hatch == null ? 1 : o.hatch;
        if (hp > 0) { ctx.save(); ctx.beginPath(); ctx.rect(g.x0, bandSurf, o.w, g.yb - bandSurf); ctx.clip(); ctx.strokeStyle = 'rgba(255,255,255,0.09)'; ctx.lineWidth = 1.4; const n2 = Math.ceil((o.w + 400) / 12 * hp); for (let i = 0; i < n2; i++) { const x = g.x0 - 200 + i * 12; ctx.beginPath(); ctx.moveTo(x, g.yb + 4); ctx.lineTo(x + 200, g.yb - 196); ctx.stroke(); } ctx.restore(); }
        if (bandSurf <= yTop + 0.5) { ctx.fillStyle = o.bandEdge || (dk ? C.white : C.ink); ctx.globalAlpha *= 0.85; ctx.fillRect(g.x0, yTop - 1.5, o.w, 3); }
        if (o.bandGlow) { ctx.globalAlpha = (ctx.globalAlpha || 1) * o.bandGlow; ctx.fillStyle = hexA(C.red, 0.25); ctx.fillRect(g.x0, bandSurf, o.w, g.yb - bandSurf); }
        ctx.restore();
        const lk = o.lock || 0;
        if (lk > 0 && g.yb - yTop > 26) L8.padlock(ctx, o.x, (yTop + g.yb) / 2 + 2, Math.min(1, (g.yb - yTop) / 66) * 34, lk, o.unlock || 0);
      }
      // surface highlight
      ctx.save(); innerClip(ctx, g, 5); ctx.clip(); ctx.strokeStyle = dk ? 'rgba(220,235,240,0.9)' : 'rgba(205,220,225,0.95)'; ctx.lineWidth = 3;
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      // bubbles
      const bb = o.bubbles || 0;
      if (bb > 0) { const rr = A.rng(11); ctx.fillStyle = 'rgba(255,255,255,0.55)'; for (let i = 0; i < 26; i++) { const a = rr(), b = rr(), c = rr(); const ph = ((o.t || 0) * (0.25 + b * 0.35) + c) % 1; const y = g.yb - 10 - ph * (fill * o.h - 16); const x = g.x0 + 18 + a * (o.w - 36) + Math.sin(ph * 12 + a * 9) * 4; ctx.globalAlpha = bb * 0.7 * Math.sin(Math.PI * ph); ctx.beginPath(); ctx.arc(x, y, 2 + b * 3.5, 0, 6.283); ctx.fill(); } }
      ctx.restore();
    }
    // the wall (drawn last, on top): glass stroke + highlights + ticks
    const wp = wallPath(g); const rev = clamp(gl * 1.25);
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const q = A.subPath(wp, 0.5 - rev / 2, 0.5 + rev / 2); // draws from the bottom centre outwards
    if (q.length > 1) {
      ctx.strokeStyle = dk ? 'rgba(255,255,255,0.75)' : hexA(C.slate, 0.95); ctx.lineWidth = 4; A.tracePts(ctx, q); ctx.stroke();
      ctx.strokeStyle = dk ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.95)'; ctx.lineWidth = 1.5; ctx.save(); ctx.translate(3, -1); A.tracePts(ctx, q); ctx.stroke(); ctx.restore();
    }
    if (body > 0) {
      ctx.globalAlpha *= body;
      ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillRect(g.x0 + 12, g.yt + 18, 7, o.h * 0.7); ctx.fillRect(g.x0 + 24, g.yt + 18, 2.5, o.h * 0.5);
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(g.x1 - 20, g.yt + o.h * 0.25, 4, o.h * 0.55);
      const tk = o.ticks == null ? 1 : o.ticks;
      if (tk > 0) { ctx.strokeStyle = dk ? 'rgba(255,255,255,0.5)' : hexA(C.slate, 0.7); ctx.lineWidth = 2; for (let i = 1; i < 10; i++) { if (i / 10 > tk) break; const y = g.yb - i / 10 * o.h; ctx.beginPath(); ctx.moveTo(g.x1, y); ctx.lineTo(g.x1 - (i % 5 ? 12 : 22), y); ctx.stroke(); } }
    }
    ctx.restore(); ctx.restore();
    return g;
  };
  // padlock: p appears, u opens (shackle lifts and swings)
  L8.padlock = function (ctx, x, y, s, p, u = 0) {
    if (p <= 0 || s < 6) return; const k = Math.min(1.08, p);
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.strokeStyle = C.white; ctx.lineWidth = s * 0.16; ctx.lineCap = 'round';
    ctx.save(); ctx.translate(s * 0.3, -s * 0.15 - u * s * 0.25); ctx.rotate(-u * 0.6); ctx.translate(-s * 0.3, 0);
    ctx.beginPath(); ctx.arc(0, -s * 0.15, s * 0.3, Math.PI, 0); ctx.lineTo(s * 0.3, s * 0.05); ctx.moveTo(-s * 0.3, -s * 0.15); ctx.lineTo(-s * 0.3, s * 0.05); ctx.stroke(); ctx.restore();
    ctx.fillStyle = C.red; roundRect(ctx, -s * 0.48, -s * 0.05, s * 0.96, s * 0.72, s * 0.14); ctx.fill();
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(0, s * 0.27, s * 0.09, 0, 6.283); ctx.fill();
    ctx.restore();
  };

  // ================================================================ cards & small UI
  // glass panel with one chamfered corner (brand component); returns the panel's top y
  L8.glass = function (ctx, x, y, w, h, o = {}) {
    const p = o.p == null ? 1 : o.p; if (p <= 0) return;
    const ch = o.chamfer == null ? 28 : o.chamfer; const dk = o.dark == null ? L8.DK : o.dark;
    ctx.save(); ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha) * clamp(p * 1.6);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w - ch, y); ctx.lineTo(x + w, y + ch); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath();
    if (o.shadow !== false) { ctx.save(); ctx.shadowColor = dk ? 'rgba(0,0,0,0.5)' : 'rgba(40,55,60,0.16)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12; ctx.fillStyle = dk ? 'rgba(28,31,36,0.9)' : 'rgba(255,255,255,0.86)'; ctx.fill(); ctx.restore(); }
    else { ctx.fillStyle = dk ? 'rgba(28,31,36,0.9)' : 'rgba(255,255,255,0.86)'; ctx.fill(); }
    ctx.strokeStyle = o.stroke || (dk ? 'rgba(255,255,255,0.22)' : 'rgba(96,120,128,0.32)'); ctx.lineWidth = o.lw || 1.6; ctx.stroke();
    ctx.restore();
  };
  // label with a leader line from a point (x0,y0) to the label anchor (x1,y1); label right-aligned at x1 (RTL)
  L8.leader = function (ctx, x0, y0, x1, y1, s, p, o = {}) {
    if (p <= 0) return; const col = o.color || L8.sub();
    ctx.save(); ctx.globalAlpha *= clamp(p * 2); ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.setLineDash(o.dash || []);
    const q = eo(p, 0, 1); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, q), lerp(y0, y1, q)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x0, y0, 4, 0, 6.283); ctx.fill(); ctx.restore();
    const a = clamp((p - 0.45) * 2.2); if (a <= 0) return;
    const al = o.align || (x1 < x0 ? 'right' : 'left'); const dx = al === 'right' ? -10 : 10;
    txt(ctx, s, x1 + dx, y1 + (o.size || 28) * 0.35, { size: o.size || 28, w: o.w || 'S', color: o.textColor || L8.ink(), align: al, alpha: a });
    if (o.value) lat(ctx, o.value, x1 + dx, y1 + (o.size || 28) * 0.35 + (o.vsize || 34) + 6, { size: o.vsize || 34, w: o.vw || 600, color: o.valueColor || L8.ink(), align: al, alpha: a });
  };
  // coin with a face that flips (flip: 0 shows a, 1 shows b); x,y centre
  L8.coin = function (ctx, x, y, r, a, b, flip = 0, o = {}) {
    const p = o.p == null ? 1 : o.p; if (p <= 0) return;
    const ang = flip * Math.PI; const sx = Math.cos(ang); const face = sx >= 0 ? a : b; const k = Math.min(1.1, p);
    ctx.save(); ctx.translate(x, y); ctx.scale(k * Math.max(0.04, Math.abs(sx)), k);
    const gr = ctx.createLinearGradient(0, -r, 0, r); gr.addColorStop(0, o.top || '#FFFFFF'); gr.addColorStop(1, o.bot || '#C4C8CC');
    ctx.fillStyle = '#8E9AA0'; ctx.beginPath(); ctx.arc(0, 5, r, 0, 6.283); ctx.fill();
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fill();
    ctx.strokeStyle = hexA(C.slate, 0.6); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, r * 0.82, 0, 6.283); ctx.stroke();
    lat(ctx, face, 0, r * 0.36, { size: r * 1.0, w: 600, color: o.color || C.ink, align: 'center' });
    ctx.restore();
  };
  // horizontal leverage slider (RTL: low leverage on the right, high on the left); v in stop-index units (0..n-1)
  L8.STOPS = ['1:10', '1:30', '1:50', '1:100', '1:200', '1:500'];
  L8.slider = function (ctx, xr, xl, y, v, p, o = {}) {
    if (p <= 0) return; const n = L8.STOPS.length; const X = (i) => lerp(xr, xl, i / (n - 1)); const q = eo(p, 0, 1);
    ctx.save(); ctx.globalAlpha *= clamp(p * 2);
    ctx.strokeStyle = L8.muted(); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(xr, y); ctx.lineTo(lerp(xr, xl, q), y); ctx.stroke();
    ctx.strokeStyle = L8.ink(); ctx.beginPath(); ctx.moveTo(xr, y); ctx.lineTo(X(v), y); ctx.stroke();
    for (let i = 0; i < n; i++) {
      const x = X(i); const a = clamp(q * n - i); if (a <= 0) continue; const on = Math.max(0, 1 - Math.abs(v - i));
      ctx.fillStyle = L8.DK ? '#1B1D21' : '#FFFFFF'; ctx.strokeStyle = L8.ink(); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.283); ctx.fill(); ctx.stroke();
      lat(ctx, L8.STOPS[i], x, y + 52, { size: 26 + on * 8, w: on > 0.5 ? 700 : 500, color: on > 0.5 ? L8.ink() : L8.sub(), align: 'center', alpha: a });
    }
    // knob
    const kx = X(v); ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(kx, y, 20, 0, 6.283); ctx.fill(); ctx.strokeStyle = C.white; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(kx, y, 12, 0, 6.283); ctx.stroke();
    ctx.restore();
    if (o.label) txt(ctx, o.label, xr + 34, y + 10, { size: 30, w: 'S', color: L8.ink(), align: 'left', alpha: clamp(p * 2 - 0.5) });
  };
  // notional block: outlined box (dashed) that compresses into the margin band
  L8.block = function (ctx, x, y, w, h, o = {}) {
    const p = o.p == null ? 1 : o.p; if (p <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp(p * 2) * (o.alpha == null ? 1 : o.alpha);
    if (o.fill) { ctx.fillStyle = o.fill; ctx.fillRect(x, y, w, h); }
    ctx.strokeStyle = o.color || L8.ink(); ctx.lineWidth = o.lw || 3; ctx.setLineDash(o.dash || [14, 10]); ctx.lineDashOffset = -(o.t || 0) * 30;
    const q = eo(p, 0, 1); ctx.strokeRect(x + w / 2 * (1 - q), y + h * (1 - q), w * q, h * q); ctx.setLineDash([]);
    ctx.restore();
  };
  // EUR/USD pair tile
  L8.pair = function (ctx, x, y, p, o = {}) {
    if (p <= 0) return; const size = o.size || 200; const hb = o.base || 0, hq = o.quote || 0;
    ctx.save(); ctx.globalAlpha *= clamp(p * 2);
    const wE = (ctx.font = `300 ${size}px IN`, ctx.measureText('EUR').width), wS = ctx.measureText('/').width, wU = ctx.measureText('USD').width;
    const tot = wE + wS + wU; const left = x - tot / 2;
    const k = Math.min(1.06, p); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-x, -y);
    lat(ctx, 'EUR', left, y, { size, w: 300, color: mixHex(L8.ink(), C.red, hb), align: 'left' });
    lat(ctx, '/', left + wE, y, { size, w: 300, color: L8.muted(), align: 'left' });
    lat(ctx, 'USD', left + wE + wS, y, { size, w: 300, color: mixHex(L8.ink(), C.slate, hq * 0.0), align: 'left' });
    ctx.restore();
    return { eur: [left + wE / 2, y], usd: [left + wE + wS + wU / 2, y], left, right: left + tot, wE, wU };
  };
  // lot bar: 10 segments = 1 standard lot (100,000 units); lit = how many segments are lit (0..10)
  L8.lotBar = function (ctx, xr, y, w, h, p, lit, o = {}) {
    if (p <= 0) return; const n = 10; const gap = 8; const sw = (w - gap * (n - 1)) / n;
    ctx.save(); ctx.globalAlpha *= clamp(p * 2);
    for (let i = 0; i < n; i++) {
      const a = clamp(p * n * 1.2 - i); if (a <= 0) continue; const x = xr - (i + 1) * sw - i * gap; const on = clamp(lit - i);
      ctx.fillStyle = on > 0 ? mixHex(L8.DK ? '#2A2D33' : '#E4E8EA', C.ink, on) : (L8.DK ? '#2A2D33' : '#E4E8EA'); ctx.globalAlpha = clamp(p * 2) * a;
      roundRect(ctx, x, y + (1 - a) * 20, sw, h, 8); ctx.fill();
      if (on > 0 && o.label) lat(ctx, o.label, x + sw / 2, y + h / 2 + 9, { size: 24, w: 700, color: C.white, align: 'center', alpha: on });
    }
    ctx.restore();
  };
  // order ticket (generic platform window): fields [label, value] RTL; typing per field
  L8.ticket = function (ctx, x, y, w, rows, p, o = {}) {
    if (p <= 0) return; const rh = 74, h = 86 + rows.length * rh;
    L8.glass(ctx, x, y, w, h, { p, dark: true });
    ctx.save(); ctx.globalAlpha *= clamp(p * 1.6);
    txt(ctx, o.title || 'أمر جديد', x + w - 30, y + 54, { size: 30, w: 'B', color: C.white, align: 'right' });
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(x + 34, y + 44, 7, 0, 6.283); ctx.fill();
    rows.forEach((r, i) => {
      const yy = y + 86 + i * rh; const a = r.a == null ? 1 : r.a; if (a <= 0) return;
      ctx.globalAlpha = clamp(p * 1.6) * a;
      ctx.fillStyle = 'rgba(255,255,255,0.06)'; roundRect(ctx, x + 24, yy + 8, w - 48, rh - 16, 10); ctx.fill();
      if (r.hi) { ctx.strokeStyle = hexA(C.red, r.hi); ctx.lineWidth = 2.5; roundRect(ctx, x + 24, yy + 8, w - 48, rh - 16, 10); ctx.stroke(); }
      txt(ctx, r.k, x + w - 44, yy + rh / 2 + 9, { size: 26, w: 'R', color: hexA(C.white, 0.66), align: 'right' });
      if (r.v) { const latin = /^[\x00-\x7F€$]+$/.test(r.v); if (latin) lat(ctx, r.v, x + 44, yy + rh / 2 + 11, { size: 30, w: 600, color: r.vc || C.white, align: 'left' }); else txt(ctx, r.v, x + 44 + measure(ctx, r.v, 28, 'B'), yy + rh / 2 + 10, { size: 28, w: 'B', color: r.vc || C.white, align: 'right' }); }
      if (r.caret) { const cw = (ctx.font = '600 30px IN', ctx.measureText(r.v || '').width); if (Math.floor((o.t || 0) * 2.4) % 2 === 0) { ctx.fillStyle = C.red; ctx.fillRect(x + 48 + cw, yy + rh / 2 - 15, 3, 32); } }
    });
    ctx.restore(); return h;
  };
  // price chart (paper or night): vals in price units, p reveal, box [x, y, w, h]
  L8.chart = function (ctx, box, vals, lo, hi, p, o = {}) {
    if (p <= 0) return; const fr = K.frame(box, lo, hi, vals.length);
    ctx.save(); ctx.globalAlpha *= clamp(p * 3) * (o.alpha == null ? 1 : o.alpha);
    ctx.strokeStyle = L8.DK ? 'rgba(255,255,255,0.12)' : 'rgba(96,120,128,0.18)'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) { const yy = box[1] + i / 4 * box[3]; ctx.beginPath(); ctx.moveTo(box[0], yy); ctx.lineTo(box[0] + box[2], yy); ctx.stroke(); }
    ctx.restore();
    if (o.entry != null) K.level(ctx, fr, o.entry, clamp(p * 3), { color: L8.sub(), label: o.entryLabel, size: 22 });
    const hd = K.priceLine(ctx, fr, vals, p, { color: o.color || L8.ink(), width: 3.4, head: 7, headColor: o.headColor || C.red, alpha: o.alpha });
    return { fr, hd };
  };
  // incoming call card (the "margin call")
  L8.call = function (ctx, x, y, p, t, o = {}) {
    if (p <= 0) return; const w = 470, h = 136; const shake = o.ring ? Math.sin(t * 60) * 5 * o.ring : 0;
    ctx.save(); ctx.translate(shake, 0);
    L8.glass(ctx, x, y, w, h, { p, dark: true, stroke: hexA(C.red, 0.7) });
    ctx.globalAlpha *= clamp(p * 1.6);
    const cx = x + w - 70, cy = y + h / 2; const pr = (t * 1.6) % 1;
    ctx.strokeStyle = hexA(C.red, 1 - pr); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 34 + pr * 30, 0, 6.283); ctx.stroke();
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(cx, cy, 34, 0, 6.283); ctx.fill();
    L8.bell(ctx, cx, cy + 2, 21, o.ring ? Math.sin(t * 40) * 0.3 * o.ring : 0, C.white);
    txt(ctx, 'نداء الهامش', x + w - 128, y + 60, { size: 34, w: 'B', color: C.white, align: 'right' });
    lat(ctx, 'Margin Call', x + w - 128, y + 100, { size: 24, w: 600, color: hexA(C.white, 0.6), align: 'right' });
    ctx.restore();
  };
  // alert bell (x,y centre, s half-size, rot swing)
  L8.bell = function (ctx, x, y, s, rot = 0, col = C.white) {
    ctx.save(); ctx.translate(x, y - s * 0.9); ctx.rotate(rot); ctx.translate(0, s * 0.9); ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(-s, s * 0.55); ctx.quadraticCurveTo(-s * 0.82, s * 0.38, -s * 0.78, -s * 0.15); ctx.quadraticCurveTo(-s * 0.72, -s * 0.95, 0, -s * 0.98);
    ctx.quadraticCurveTo(s * 0.72, -s * 0.95, s * 0.78, -s * 0.15); ctx.quadraticCurveTo(s * 0.82, s * 0.38, s, s * 0.55); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(0, s * 0.78, s * 0.2, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.arc(0, -s * 1.08, s * 0.14, 0, 6.283); ctx.fill(); ctx.restore();
  };
  // margin-level ruler beside the tank: ticks at % levels (level = fill / band × 100%)
  L8.ruler = function (ctx, o, p, levels, t) {
    if (p <= 0 || !o.band) return; const g = L8.tankGeo(o); const xr = g.x1 + 46;
    ctx.save(); ctx.globalAlpha *= clamp(p * 2);
    const yOf = (pct) => g.yb - (pct / 100) * o.band * o.h;
    const top = Math.max(g.yt - 40, yOf(levels[levels.length - 1]));
    ctx.strokeStyle = L8.sub(); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xr, g.yb); ctx.lineTo(xr, lerp(g.yb, top, eo(p, 0, 1))); ctx.stroke();
    levels.forEach((pct, i) => {
      const y = yOf(pct); if (y < top - 1) return; const a = clamp(p * levels.length - i); if (a <= 0) return;
      const danger = pct <= 100; const col = danger ? C.red : L8.ink();
      ctx.globalAlpha = clamp(p * 2) * a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xr - 10, y); ctx.lineTo(xr + 14, y); ctx.stroke();
      lat(ctx, pct + '%', xr + 24, y + 10, { size: 28, w: 700, color: col, align: 'left' });
    });
    ctx.restore();
  };
  // a dashed level line across the tank (margin call / stop out), with a label outside on the left (RTL reads right→left)
  L8.tankLine = function (ctx, o, frac, p, label, col = C.red, o2 = {}) {
    if (p <= 0) return; const g = L8.tankGeo(o); const y = g.yb - frac * o.h; const q = eo(p, 0, 1);
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = o2.lw || 3; ctx.setLineDash(o2.dash || [12, 8]); ctx.globalAlpha *= clamp(p * 2);
    ctx.beginPath(); ctx.moveTo(g.x1 + 10, y); ctx.lineTo(lerp(g.x1 + 10, g.x0 - (o2.ext || 40), q), y); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    if (label) txt(ctx, label, g.x0 - (o2.ext || 40) - 14, y + 11, { size: o2.size || 30, w: 'B', color: col, align: 'right', alpha: clamp((p - 0.4) * 2) });
    if (o2.sub) txt(ctx, o2.sub, g.x0 - (o2.ext || 40) - 14, y + 48, { size: 22, w: 'R', color: L8.sub(), align: 'right', alpha: clamp((p - 0.5) * 2) });
  };
  // big kinetic equation row: items [{s, t, kind:'ar'|'lat'|'op', color, size}] laid right→left, centred on cx
  L8.eq = function (ctx, items, cx, y, t, o = {}) {
    const size = o.size || 96; const gap = o.gap || size * 0.32; const ws = items.map((it) => (it.kind === 'ar' ? FX.kwidth(it.s, it.size || size, it.w || 'B') : (ctx.font = `${it.lw || 300} ${it.size || size}px IN`, ctx.measureText(it.s).width)));
    const tot = ws.reduce((a, b) => a + b, 0) + gap * (items.length - 1); let x = cx + tot / 2; const pos = [];
    items.forEach((it, i) => {
      const w = ws[i]; const lt = t - it.t; const sz = it.size || size; pos.push([x - w / 2, y - sz * 0.35, x, x - w]);
      if (it.t != null && lt > -0.2) {
        const outA = 1 - clamp(o.out || 0);
        if (it.kind === 'ar') FX.kword(ctx, it.s, x, y, { size: sz, w: it.w || 'B', color: it.color || L8.ink(), lt, mode: it.mode || 'drop', alpha: outA * (it.alpha == null ? 1 : it.alpha) });
        else { const k = spr(t, it.t, 15, 0.5); if (k > 0) { ctx.save(); ctx.globalAlpha *= outA * clamp(lt * 8) * (it.alpha == null ? 1 : it.alpha); ctx.translate(x - w / 2, y - sz * 0.35); const s = Math.min(1.12, k); ctx.scale(s, s); lat(ctx, it.s, 0, sz * 0.35, { size: sz, w: it.lw || 300, color: it.color || (it.kind === 'op' ? C.red : L8.ink()), align: 'center' }); ctx.restore(); } }
      }
      x -= w + gap;
    });
    return pos;
  };
  // check mark / cross in a circle (stamp)
  L8.stamp = function (ctx, x, y, r, p, ok = true) {
    if (p <= 0) return; const k = Math.min(1.12, p); ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
    ctx.fillStyle = ok ? C.mint : C.red; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fill();
    ctx.strokeStyle = ok ? C.ink : C.white; ctx.lineWidth = r * 0.18; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    if (ok) { ctx.moveTo(-r * 0.42, r * 0.02); ctx.lineTo(-r * 0.1, r * 0.34); ctx.lineTo(r * 0.45, -r * 0.3); } else { ctx.moveTo(-r * 0.32, -r * 0.32); ctx.lineTo(r * 0.32, r * 0.32); ctx.moveTo(r * 0.32, -r * 0.32); ctx.lineTo(-r * 0.32, r * 0.32); }
    ctx.stroke(); ctx.restore();
  };
  // house ↔ vault: m = 0 vault (safe box with dial), 1 house (roof, door, window); x,y = base centre, s = body size
  L8.vaultHouse = function (ctx, x, y, s, m, p, t, o = {}) {
    if (p <= 0) return; const k = Math.min(1.06, p); const col = o.color || L8.ink();
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.globalAlpha *= clamp(p * 2);
    const bw = lerp(s, s * 1.1, m), bh = lerp(s, s * 0.78, m);
    ctx.fillStyle = L8.DK ? 'rgba(30,33,38,0.9)' : 'rgba(255,255,255,0.88)'; ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineJoin = 'round';
    roundRect(ctx, -bw / 2, -bh, bw, bh, lerp(18, 4, m)); ctx.fill(); ctx.stroke();
    // roof grows out of the top edge
    if (m > 0.01) { const rh = s * 0.55 * eo(m, 0, 1); ctx.beginPath(); ctx.moveTo(-bw / 2 - 26 * m, -bh); ctx.lineTo(0, -bh - rh); ctx.lineTo(bw / 2 + 26 * m, -bh); ctx.closePath(); ctx.fill(); ctx.stroke();
      // chimney
      ctx.fillRect(bw * 0.22, -bh - rh * 0.72, 22, rh * 0.36 * m); ctx.strokeRect(bw * 0.22, -bh - rh * 0.72, 22, rh * 0.36 * m); }
    // dial (vault) → window (house)
    const dx = lerp(0, -bw * 0.22, m), dy = lerp(-bh / 2, -bh * 0.58, m), dr = lerp(s * 0.22, s * 0.14, m);
    ctx.save(); ctx.translate(dx, dy);
    if (m < 0.5) { ctx.rotate(t * 0.8 * (1 - m)); ctx.beginPath(); ctx.arc(0, 0, dr, 0, 6.283); ctx.stroke(); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; ctx.beginPath(); ctx.moveTo(Math.cos(a) * dr * 0.62, Math.sin(a) * dr * 0.62); ctx.lineTo(Math.cos(a) * dr * 0.9, Math.sin(a) * dr * 0.9); ctx.stroke(); } }
    else { ctx.strokeRect(-dr, -dr, dr * 2, dr * 2); ctx.beginPath(); ctx.moveTo(-dr, 0); ctx.lineTo(dr, 0); ctx.moveTo(0, -dr); ctx.lineTo(0, dr); ctx.stroke(); }
    ctx.restore();
    // vault hardware: bolts, hinges, handle, feet (fades as it becomes a house)
    if (m < 0.5) {
      const va = 1 - m * 2; ctx.save(); ctx.globalAlpha *= va; ctx.fillStyle = col;
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { ctx.beginPath(); ctx.arc(sx * (bw / 2 - 20), sy > 0 ? -22 : -bh + 22, 5, 0, 6.283); ctx.fill(); });
      ctx.fillRect(-bw / 2 - 9, -bh * 0.8, 9, bh * 0.16); ctx.fillRect(-bw / 2 - 9, -bh * 0.36, 9, bh * 0.16);
      ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(dr + 26, -bh / 2); ctx.lineTo(dr + 62, -bh / 2); ctx.stroke();
      ctx.fillRect(-bw / 2 + 18, 0, 26, 14); ctx.fillRect(bw / 2 - 44, 0, 26, 14);
      ctx.restore();
    }
    // door (house)
    if (m > 0.3) { const a = clamp((m - 0.3) / 0.7); ctx.globalAlpha *= a; roundRect(ctx, bw * 0.06, -bh * 0.62, bw * 0.26, bh * 0.62, 6); ctx.stroke(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(bw * 0.27, -bh * 0.3, 4, 0, 6.283); ctx.fill(); }
    ctx.restore();
  };
  // envelope (the rent deposit): x,y centre
  L8.envelope = function (ctx, x, y, w, p, o = {}) {
    if (p <= 0) return; const h = w * 0.64; const k = Math.min(1.1, p);
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(k, k);
    ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = C.ink; ctx.lineWidth = 3; roundRect(ctx, -w / 2, -h / 2, w, h, 6); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(0, h * 0.08); ctx.lineTo(w / 2, -h / 2); ctx.stroke();
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, h * 0.08, w * 0.09, 0, 6.283); ctx.fill();
    if (o.label) txt(ctx, o.label, 0, h / 2 + 36, { size: o.size || 26, w: 'B', color: L8.ink(), align: 'center' });
    ctx.restore();
  };
  // key icon
  L8.key = function (ctx, x, y, s, p, rot = 0) {
    if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const k = Math.min(1.1, p); ctx.scale(k, k);
    ctx.strokeStyle = L8.ink(); ctx.lineWidth = s * 0.14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(-s * 0.45, 0, s * 0.28, 0, 6.283); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.17, 0); ctx.lineTo(s * 0.6, 0); ctx.moveTo(s * 0.42, 0); ctx.lineTo(s * 0.42, s * 0.2); ctx.moveTo(s * 0.58, 0); ctx.lineTo(s * 0.58, s * 0.26); ctx.stroke(); ctx.restore();
  };
  // platform panel (generic account summary) — rows [{k, v, hi}]
  L8.panel = function (ctx, x, y, w, rows, p, o = {}) {
    if (p <= 0) return; const rh = 64, h = 96 + rows.length * rh;
    L8.glass(ctx, x, y, w, h, { p, dark: true });
    ctx.save(); ctx.globalAlpha *= clamp(p * 1.6);
    txt(ctx, o.title || 'حسابك على المنصة', x + w - 30, y + 58, { size: 30, w: 'B', color: C.white, align: 'right' });
    for (let i = 0; i < 3; i++) { ctx.fillStyle = i === 0 ? C.red : 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.arc(x + 34 + i * 22, y + 48, 6, 0, 6.283); ctx.fill(); }
    rows.forEach((r, i) => {
      const yy = y + 96 + i * rh; const a = r.a == null ? 1 : r.a; if (a <= 0) return; ctx.globalAlpha = clamp(p * 1.6) * a;
      ctx.fillStyle = r.hi ? hexA(C.red, 0.16 * r.hi) : 'rgba(255,255,255,0.04)'; roundRect(ctx, x + 20, yy + 4, w - 40, rh - 8, 10); ctx.fill();
      if (r.hi) { ctx.strokeStyle = hexA(C.red, 0.8 * r.hi); ctx.lineWidth = 2; roundRect(ctx, x + 20, yy + 4, w - 40, rh - 8, 10); ctx.stroke(); }
      txt(ctx, r.k, x + w - 40, yy + rh / 2 + 9, { size: 26, w: 'R', color: hexA(C.white, 0.72), align: 'right' });
      lat(ctx, r.v, x + 40, yy + rh / 2 + 11, { size: 30, w: 600, color: r.vc || C.white, align: 'left' });
    });
    ctx.restore(); return h;
  };
  // gear icon (auto-calculation)
  L8.gear = function (ctx, x, y, r, rot, p) {
    if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const k = Math.min(1.1, p); ctx.scale(k, k);
    ctx.fillStyle = C.red; ctx.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283; const rr = i % 2 ? r : r * 1.28; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(0, 0, r * 0.42, 0, 6.283); ctx.fill(); ctx.restore();
  };

  // ================================================================ captions (screen space): a timed phrase row at the top
  L8.caption = function (ctx, words, t, o = {}) {
    if (!words.length) return; const sz = o.size || 44; const y = o.y || 158;
    K.cap(ctx, words, y, t, { size: sz, w: o.w || 'R', color: o.color || L8.sub(), out: o.out, mode: o.mode || 'rise', stagger: 0.02 });
  };
})(typeof window !== 'undefined' ? window : globalThis);
