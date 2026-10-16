// glass.js — shared glass kit (from axi-claude-mcp, used here for the Buy Crypto campaign): dynamic glassmorphism with both brands side by side.
//  • Axi moments use Axi's own glass cards (BRAND.md): light glass (white tint, bright rim, one 44 px chamfered corner)
//    and dark glass (rgba(20,22,26,.72), white 25% rim) on the vertical eclipse gradient; red stays a flat accent.
//  • Claude moments use Claude's palette: ivory #FAF9F5, near-black #141413 and terracotta #D97757, with "Claude"
//    set as text in a serif. No Claude or Anthropic logo.
//  • Behind the glass: tall light pillars that drift and breathe. Each panel frosts what is behind it, using a
//    blurred quarter-size copy of the frame drawn so far (snap()).
(function (G) {
  'use strict';
  const K = G.K;
  const { W, H, clamp, lerp, inv, smooth, hash, noise, rng, rr, expoOut, expoInOut, cubicInOut } = K;
  const AX = { red: '#E4002E', coral: '#FF3745', mint: '#5EE0BB', white: '#FFFFFF', off: '#F9F9F9', frost: '#EEF0F1', silver: '#C4C8CC', steel: '#607880', steel2: '#95A8B1', slate: '#5E7680', graphite: '#393B40', carbon: '#242528', ink: '#090A0D', top: '#171819', bottom: '#0B0D0D' };
  const CL = { dark: '#141413', dark2: '#262624', light: '#FAF9F5', mid: '#B0AEA5', pale: '#E8E6DC', orange: '#D97757', orange2: '#E8A285', blue: '#6A9BCC', green: '#788C5D' };
  const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

  // ---------------- type: Lora for the Claude name and Claude's voice, Poppins for Claude-side Latin UI ----------------
  const near = (w, arr) => arr.reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a));
  function face(fam, ws) {
    const font = (w, size) => `${near(w, ws)} ${size}px ${fam}`;
    const draw = (ctx, s, x, y, o = {}) => {
      ctx.save(); ctx.font = font(o.w || 500, o.size || 48); ctx.direction = 'ltr'; ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.base || 'alphabetic';
      if (o.track) ctx.letterSpacing = o.track + 'px';
      ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha; ctx.fillStyle = o.color || CL.light; ctx.fillText(s, x, y);
      const m = ctx.measureText(s).width; ctx.restore(); return m;
    };
    const width = (ctx, s, o = {}) => { ctx.save(); ctx.font = font(o.w || 500, o.size || 48); if (o.track) ctx.letterSpacing = o.track + 'px'; const m = ctx.measureText(s).width; ctx.restore(); return m; };
    return { font, draw, width };
  }
  const LO = face('LO', [500, 600, 700]), PO = face('PO', [300, 400, 500, 600, 700]);

  // ---------------- frost source ----------------
  const FW = 270, FH = 480, SM = mk(FW, FH), smx = SM.getContext('2d'), FR = mk(FW, FH), frx = FR.getContext('2d');
  // copy the frame drawn so far into the frost buffer (quarter size, blurred ≈ 24 px at full size: Axi's "blur 22")
  function snap(src, amt = 6) {
    smx.setTransform(1, 0, 0, 1, 0, 0); smx.globalAlpha = 1; smx.globalCompositeOperation = 'copy'; smx.drawImage(src, 0, 0, FW, FH); smx.globalCompositeOperation = 'source-over';
    frx.setTransform(1, 0, 0, 1, 0, 0); frx.globalAlpha = 1; frx.globalCompositeOperation = 'copy'; frx.drawImage(SM, 0, 0); frx.globalCompositeOperation = 'source-over';
    frx.filter = `blur(${amt}px)`; frx.drawImage(SM, 0, 0); frx.filter = 'none';
  }
  const NZ = mk(256, 256);
  (() => { const g = NZ.getContext('2d'), id = g.createImageData(256, 256), r = rng(3); for (let i = 0; i < id.data.length; i += 4) { const v = r() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } g.putImageData(id, 0, 0); })();
  const PATS = new WeakMap();
  const nzPat = (ctx) => { let p = PATS.get(ctx); if (!p) { p = ctx.createPattern(NZ, 'repeat'); PATS.set(ctx, p); } return p; };

  // ---------------- panels ----------------
  // rounded panel; ch > 0 cuts one corner at 45° (Axi's chamfer); corner 'tl' | 'tr' | 'bl' | 'br'
  function shape(ctx, x, y, w, h, r = 30, ch = 0, corner = 'tr', fresh = true) {
    if (fresh) ctx.beginPath();
    r = Math.max(0, Math.min(r, w / 2, h / 2)); ch = Math.min(ch, w / 2, h / 2);
    const cut = (k) => ch > 0 && corner === k;
    ctx.moveTo(x + (cut('tl') ? ch : r), y);
    if (cut('tr')) { ctx.lineTo(x + w - ch, y); ctx.lineTo(x + w, y + ch); } else { ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r); }
    if (cut('br')) { ctx.lineTo(x + w, y + h - ch); ctx.lineTo(x + w - ch, y + h); } else { ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r); }
    if (cut('bl')) { ctx.lineTo(x + ch, y + h); ctx.lineTo(x, y + h - ch); } else { ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r); }
    if (cut('tl')) { ctx.lineTo(x, y + ch); } else { ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); }
    ctx.closePath();
  }
  const TONE = {
    light: { fill: 'rgba(255,255,255,0.10)', rim: [0.78, 0.16], sheen: 0.20, shadow: 0.40, edge: 0.22 },   // Axi light glass, on dark
    dark: { fill: 'rgba(20,22,26,0.56)', rim: [0.38, 0.08], sheen: 0.07, shadow: 0.50, edge: 0.10 },       // Axi dark glass
    ivory: { fill: 'rgba(250,249,245,0.70)', rim: [1.0, 0.45], sheen: 0.34, shadow: 0.32, edge: 0.35 },    // Claude
    clay: { fill: 'rgba(217,119,87,0.26)', rim: [0.80, 0.18], sheen: 0.22, shadow: 0.36, edge: 0.22 },     // Claude terracotta glass
    red: { fill: 'rgba(228,0,46,0.34)', rim: [0.75, 0.18], sheen: 0.22, shadow: 0.36, edge: 0.2 },         // Axi red glass (small chips only)
    white: { fill: 'rgba(255,255,255,0.56)', rim: [1.0, 0.6], sheen: 0.42, shadow: 0.20, edge: 0.65 },     // frosted white, for light scenes
  };
  // a glass panel: o.tone, r, ch + corner, alpha, lift (shadow depth), glint (0..1 sweep), refract (px), lw
  function glass(ctx, x, y, w, h, o = {}) {
    const T = typeof o.tone === 'object' ? o.tone : TONE[o.tone || 'light'], a = o.alpha == null ? 1 : o.alpha;
    if (a <= 0.002 || w <= 2 || h <= 2) return;
    const r = o.r == null ? 30 : o.r, ch = o.ch || 0, cn = o.corner || 'tr', lift = o.lift == null ? 1 : o.lift;
    ctx.save(); ctx.globalAlpha *= a;
    if (lift > 0) {   // soft shadow, outside the panel only
      ctx.save(); ctx.beginPath(); ctx.rect(x - 500, y - 500, w + 1000, h + 1000); shape(ctx, x, y, w, h, r, ch, cn, false); ctx.clip('evenodd');
      ctx.filter = `blur(${Math.round(22 * lift + 10)}px)`; ctx.fillStyle = `rgba(0,0,0,${T.shadow})`;
      shape(ctx, x + 4 * lift, y + 24 * lift, w, h, r, ch, cn); ctx.fill(); ctx.filter = 'none'; ctx.restore();
    }
    ctx.save(); shape(ctx, x, y, w, h, r, ch, cn); ctx.clip();
    const m = ctx.getTransform(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(FR, o.refract || 0, (o.refract || 0) * 0.4, W, H);
    ctx.setTransform(m);
    ctx.fillStyle = T.fill; ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
    if (o.tint) { ctx.fillStyle = o.tint; ctx.fillRect(x - 2, y - 2, w + 4, h + 4); }
    ctx.save(); ctx.globalAlpha *= 0.05; ctx.globalCompositeOperation = 'overlay'; ctx.fillStyle = nzPat(ctx); ctx.fillRect(x, y, w, h); ctx.restore();
    const sh = ctx.createLinearGradient(0, y, 0, y + h * 0.6); sh.addColorStop(0, `rgba(255,255,255,${T.sheen})`); sh.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sh; ctx.fillRect(x, y, w, h);
    if (o.glint > 0 && o.glint < 1) {
      const bw = Math.max(140, w * 0.38), bx = lerp(x + w + bw, x - bw, o.glint), g = ctx.createLinearGradient(bx - bw / 2, 0, bx + bw / 2, 0);
      g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, `rgba(255,255,255,${o.glintA || 0.32})`); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.fillRect(bx - bw / 2, y, bw, h);
    }
    ctx.restore();
    const rg = ctx.createLinearGradient(0, y, 0, y + h); rg.addColorStop(0, `rgba(255,255,255,${T.rim[0]})`); rg.addColorStop(1, `rgba(255,255,255,${T.rim[1]})`);
    shape(ctx, x + 0.75, y + 0.75, w - 1.5, h - 1.5, r, ch, cn); ctx.lineWidth = o.lw || 2; ctx.strokeStyle = rg; ctx.stroke();
    // thickness: a faint inner edge that catches the light along the top
    const eg = ctx.createLinearGradient(0, y, 0, y + Math.min(h, 220)); eg.addColorStop(0, `rgba(255,255,255,${T.edge || 0.15})`); eg.addColorStop(1, 'rgba(255,255,255,0)');
    shape(ctx, x + 5, y + 5, w - 10, h - 10, Math.max(0, r - 5), Math.max(0, ch - 3), cn); ctx.lineWidth = 1.5; ctx.strokeStyle = eg; ctx.stroke();
    ctx.restore();
  }

  // ---------------- stage ----------------
  const LF = mk(FW, FH), lfx = LF.getContext('2d');
  // the vertical gradient, then light pillars — tall soft columns that drift and breathe — screened on top.
  // pillar: {x, y, w, h, c, a, sp, amp, ph, depth}; o.dx shifts pillars for parallax camera moves
  function stage(ctx, t, o = {}) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    const g = ctx.createLinearGradient(0, 0, 0, H); (o.grad || [[0, AX.top], [1, AX.bottom]]).forEach(([s, c]) => g.addColorStop(s, c));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    lfx.setTransform(1, 0, 0, 1, 0, 0); lfx.clearRect(0, 0, FW, FH); lfx.filter = `blur(${o.soft || 16}px)`;
    (o.pillars || []).forEach((p) => {
      const x = p.x + Math.sin(t * (p.sp || 0.3) + (p.ph || 0)) * (p.amp || 0) + (o.dx || 0) * (p.depth == null ? 1 : p.depth);
      const y = (p.y || 0) + (o.dy || 0) * (p.depth == null ? 1 : p.depth), b = 0.85 + 0.15 * Math.sin(t * 1.1 + (p.ph || 0) * 2);
      lfx.globalAlpha = clamp((p.a == null ? 0.5 : p.a) * b * (o.alpha == null ? 1 : o.alpha)); lfx.fillStyle = p.c;
      rr(lfx, (x - p.w / 2) / 4, y / 4, p.w / 4, (p.h || H) / 4, p.w / 8); lfx.fill();
    });
    lfx.filter = 'none'; lfx.globalAlpha = 1;
    ctx.globalCompositeOperation = o.blend || 'screen'; ctx.drawImage(LF, 0, 0, W, H); ctx.restore();
  }
  // drifting specks of light for depth (screen space), a few in focus and most soft
  const DUST = (() => { const r = rng(11), o = []; for (let i = 0; i < 46; i++) o.push({ x: r() * W, y: r() * H, z: 0.3 + r() * 0.9, s: 1.5 + r() * 3.5, ph: r() * 6.28 }); return o; })();
  function dust(ctx, t, o = {}) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'screen';
    DUST.forEach((d) => {
      const y = ((d.y - t * 40 * d.z + (o.dy || 0) * d.z) % (H + 40) + H + 40) % (H + 40) - 20, x = d.x + Math.sin(t * 0.6 + d.ph) * 18 * d.z + (o.dx || 0) * d.z;
      ctx.globalAlpha = (o.a == null ? 0.5 : o.a) * (0.4 + 0.6 * Math.abs(Math.sin(t * 0.9 + d.ph))) * d.z;
      ctx.fillStyle = o.color || '#FFFFFF'; ctx.beginPath(); ctx.arc(x, y, d.s * d.z, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }
  // the brand's background candles: white, no colour, low opacity, only behind text (BRAND.md)
  const CANDLES = (() => { const r = rng(21), o = []; let y = 0; for (let x = -30; x < W + 60; x += 54) { const d = (r() - 0.62) * 70; o.push({ x, o: y, c: y + d, hi: Math.min(y, y + d) - 10 - r() * 34, lo: Math.max(y, y + d) + 10 + r() * 34 }); y += d - 14 * (r() * 0.7 + 0.5); } return o; })();
  function candles(ctx, t, o = {}) {
    const a = o.a == null ? 0.16 : o.a; if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(o.x || 0, (o.y || 1500) - t * (o.speed || 24)); ctx.strokeStyle = '#FFFFFF'; ctx.fillStyle = '#FFFFFF'; ctx.lineWidth = 2;
    CANDLES.forEach((c) => { const top = Math.min(c.o, c.c), h = Math.max(3, Math.abs(c.c - c.o)); ctx.beginPath(); ctx.moveTo(c.x, c.hi); ctx.lineTo(c.x, c.lo); ctx.stroke(); if (c.c < c.o) ctx.strokeRect(c.x - 10, top, 20, h); else ctx.fillRect(c.x - 10, top, 20, h); });
    ctx.restore();
  }

  // ---------------- transitions between whole frames ----------------
  const BA = mk(W, H), bax = BA.getContext('2d'), BB = mk(W, H), bbx = BB.getContext('2d');
  // a tall glass slab travels right → left (the reading direction) and leaves the next frame behind it
  function slabWipe(ctx, u, o = {}) {
    const sw = o.w || 420, e = cubicInOut(clamp(u)), xc = lerp(W + sw, -sw, e);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(BA, 0, 0); ctx.save(); ctx.beginPath(); ctx.rect(xc, 0, W - xc + 2, H); ctx.clip(); ctx.drawImage(BB, 0, 0); ctx.restore();
    snap(ctx.canvas, 9);
    glass(ctx, xc - sw / 2, -60, sw, H + 120, { tone: o.tone || 'light', r: 0, lift: 0.6, refract: 14, lw: 1.5 });
    ctx.restore();
  }
  // the frame frosts over, the next one dissolves in under the frost and clears (no hard swap mid-cut)
  function frostCut(ctx, u, o = {}) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const fa = smooth(clamp(u * 2)), fb = smooth(clamp((1 - u) * 2)), mix = smooth(inv(0.3, 0.7, u));
    ctx.drawImage(BA, 0, 0); snap(BA, 10); ctx.globalAlpha = fa; ctx.drawImage(FR, 0, 0, W, H);
    bbx.save(); bbx.setTransform(1, 0, 0, 1, 0, 0); snap(BB, 10); bbx.globalAlpha = fb; bbx.drawImage(FR, 0, 0, W, H); bbx.restore();
    ctx.globalAlpha = mix; ctx.drawImage(BB, 0, 0);
    ctx.globalAlpha = lerp(fa, fb, mix) * 0.18; ctx.fillStyle = o.tint || '#FFFFFF'; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
  // zoom through: the outgoing frame scales up and frosts, the incoming one settles from slightly larger
  function zoomCut(ctx, u, o = {}) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const e = expoInOut(clamp(u));
    const sA = lerp(1, 1.5, e), sB = lerp(0.82, 1, e);
    ctx.save(); ctx.translate(W / 2, (o.cy || H / 2)); ctx.scale(sB, sB); ctx.translate(-W / 2, -(o.cy || H / 2)); ctx.drawImage(BB, 0, 0); ctx.restore();
    ctx.globalAlpha = 1 - smooth(inv(0.35, 0.8, u));
    ctx.save(); ctx.translate(W / 2, (o.cy || H / 2)); ctx.scale(sA, sA); ctx.translate(-W / 2, -(o.cy || H / 2)); ctx.drawImage(BA, 0, 0); ctx.restore();
    ctx.restore();
  }
  const CUTS = { slab: slabWipe, frost: frostCut, zoom: zoomCut };
  // scenes: [{t0, t1, render(ctx, t)}]; cuts: [{at, d, kind}] — a cut blends the scene ending at `at` with the next
  function film(ctx, t, scenes, cuts) {
    const c = cuts.find((k) => t >= k.at - k.d / 2 && t < k.at + k.d / 2);
    if (!c) { const s = scenes.find((k) => t >= k.t0 && t < k.t1) || scenes[t < scenes[0].t0 ? 0 : scenes.length - 1]; s.render(ctx, t); return; }
    const i = scenes.findIndex((k) => Math.abs(k.t1 - c.at) < 1e-6);
    bax.setTransform(1, 0, 0, 1, 0, 0); bax.globalAlpha = 1; bax.globalCompositeOperation = 'source-over'; scenes[i].render(bax, t);
    bbx.setTransform(1, 0, 0, 1, 0, 0); bbx.globalAlpha = 1; bbx.globalCompositeOperation = 'source-over'; scenes[i + 1].render(bbx, t);
    CUTS[c.kind](ctx, (t - (c.at - c.d / 2)) / c.d, c);
  }

  // ---------------- camera ----------------
  // a slow push with a breathing drift; returns the scale so callers can compensate
  function camera(ctx, t, t0, t1, o = {}) {
    const u = clamp((t - t0) / Math.max(0.01, t1 - t0)), s = lerp(o.s0 || 1, o.s1 || 1.06, smooth(u)) * (o.k || 1);
    const cx = o.cx || W / 2, cy = o.cy || H / 2, dx = noise(t * 0.35, 3) * (o.drift || 10) + (o.dx || 0), dy = noise(t * 0.3, 9) * (o.drift || 10) + (o.dy || 0);
    ctx.translate(cx + dx, cy + dy); ctx.rotate((o.rot || 0) + noise(t * 0.25, 5) * (o.wob || 0.004)); ctx.scale(s, s); ctx.translate(-cx, -cy);
    return s;
  }
  // a card's 3D swing about its vertical axis (fake perspective): ang in radians, around (cx, cy)
  function swing(ctx, cx, cy, ang, o = {}) {
    const c = Math.cos(ang), s = Math.sin(ang);
    ctx.translate(cx, cy); ctx.transform(Math.max(0.02, c), s * (o.persp || 0.18), 0, 1, 0, 0); ctx.translate(-cx, -cy);
  }

  // ---------------- type in motion ----------------
  // words pop in one by one (RTL): scale down from o.from, fade, settle; o.colors per word
  function popWords(ctx, s, cx, y, t, o) {
    const ws = s.split(' '), sz = o.size || 100, gap = K.arW(ctx, ' ', o) * (o.gapK || 1);
    const wid = ws.map((w) => K.arW(ctx, w, o)), total = wid.reduce((a, b) => a + b, 0) + gap * (ws.length - 1);
    let xr = o.align === 'right' ? cx : o.align === 'left' ? cx + total : cx + total / 2;
    ws.forEach((w, i) => {
      const t0 = o.t0 + i * (o.st || 0.07), u = expoOut(clamp((t - t0) / (o.d || 0.45)));
      if (u > 0) {
        const k = lerp(o.from || 1.35, 1, u), wx = xr - wid[i] / 2;
        ctx.save(); ctx.translate(wx, y - sz * 0.35); ctx.scale(k, k); ctx.translate(-wx, -(y - sz * 0.35));
        if (o.shadow !== false) { ctx.shadowColor = 'rgba(0,0,0,0.42)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 6; }
        K.ar(ctx, w, wx, y + (1 - u) * (o.rise || 0), { ...o, align: 'center', color: (o.colors && o.colors[i]) || o.color, alpha: (o.alpha == null ? 1 : o.alpha) * clamp(u * 1.4) });
        ctx.restore();
      }
      xr -= wid[i] + gap;
    });
    return total;
  }
  // a Latin word whose tracking collapses as it arrives (used for "Claude")
  function trackIn(ctx, F, s, x, y, t, t0, o = {}) {
    const u = expoOut(clamp((t - t0) / (o.d || 0.7))); if (u <= 0) return 0;
    return F.draw(ctx, s, x, y, { ...o, track: lerp(o.from == null ? 60 : o.from, o.track || 0, u), alpha: (o.alpha == null ? 1 : o.alpha) * clamp(u * 1.5) });
  }

  // ---------------- co-brand lockup ----------------
  // [Axi Iraq logo on dark glass] × [Claude on ivory glass]; u 0..1 brings the tiles together
  function lockup(ctx, cx, cy, t, t0, o = {}) {
    const u = expoOut(clamp((t - t0) / (o.d || 0.6))); if (u <= 0) return;
    const tw = o.tw || 400, th = o.th || 300, gap = o.gap || 34, off = (1 - u) * (o.spread || 420);
    const xr = cx + gap / 2 + off, xl = cx - gap / 2 - tw - off;   // RTL: Axi on the right, Claude on the left
    ctx.save(); ctx.globalAlpha *= clamp(u * 1.4);
    glass(ctx, xr, cy - th / 2, tw, th, { tone: 'dark', r: 34, ch: 44, corner: 'tr', glint: o.glint, refract: 6 });
    K.logoIQ(ctx, xr + tw / 2, cy, tw * 0.62, { color: '#FFFFFF' });
    glass(ctx, xl, cy - th / 2, tw, th, { tone: 'ivory', r: 34, glint: o.glint, refract: 6 });
    LO.draw(ctx, 'Claude', xl + tw / 2, cy + (o.cs || 92) * 0.34, { w: 600, size: o.cs || 92, color: CL.dark });
    ctx.restore();
    // the link between them: a short bridge with a pulse running Axi → Claude (no "×": the client keeps X shapes for the logo)
    const lu = expoOut(clamp((t - t0 - 0.2) / 0.4));
    if (lu > 0) {
      const x0 = xr + 6, x1 = xl + tw - 6;
      ctx.save(); ctx.globalAlpha *= lu; ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillRect(lerp(cx, x1, lu), cy - 2, (x0 - x1) * lu, 4);
      [x0, x1].forEach((x) => { ctx.beginPath(); ctx.arc(lerp(cx, x, lu), cy, 7, 0, Math.PI * 2); ctx.fill(); });
      const f = ((t - t0) * 1.4) % 1, px = lerp(x0, x1, f);
      ctx.globalAlpha *= Math.sin(Math.PI * f); ctx.fillStyle = CL.orange; ctx.beginPath(); ctx.arc(px, cy, 9, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  // Axi's primary gradient as used in its own campaign film (darker steel on top, near-white below; vertical)
  const STEEL = [[0, '#5B727C'], [0.55, '#8FA2AA'], [1, '#EEF1F2']];
  G.GL = { AX, CL, rgba, mk, LO, PO, snap, shape, glass, TONE, stage, dust, candles, film, camera, swing, popWords, trackIn, lockup, CUTS, FR, STEEL };
})(window);
