// Director, HUD and shared components for lesson 16.
(function (G) {
  const { W, H, C, INK, clamp, lerp, inv, sp, eo, ei, eio, hexA, txt, lat, measure, logo, logoWidth, xmark, tri, roundRect, line, hatch } = G.AX;

  // ---------- timing ----------
  const OFF = 2.0;                       // brand open before the narration
  const AUDIO_END = 245.16;
  const CLOSE = OFF + 245.25;            // X sting + CTA
  const TOTAL = CLOSE + 4.85;
  const BEAT = 0.6;                      // 100 BPM
  const byP = {};
  (G.WORDS || []).forEach((w) => { (byP[w.p] = byP[w.p] || []).push(w); });
  const w = (p, k = 0) => byP[p][k].s + OFF;              // word start, video time
  const we = (p, k = 0) => byP[p][k].e + OFF;             // word end
  const ph = (p) => G.PHRASES[p].a + OFF;                   // phrase start
  const phe = (p) => G.PHRASES[p].b + OFF;                  // phrase end

  // ---------- sound events (exported for the audio build) ----------
  const SFX = [];
  const sfx = (t, type, g = 0.3, extra = {}) => SFX.push(Object.assign({ t: +t.toFixed(3), type, g }, extra));

  // ---------- price ticker (one tick per beat) ----------
  const TICK = (() => {
    const r = G.AX.rng(1608); let p = 1.0842; const a = [];
    for (let i = 0; i < 600; i++) { const d = (r() - 0.48) * 0.0009; p = Math.max(1.075, Math.min(1.095, p + d)); a.push([p, d]); }
    return a;
  })();

  // ---------- HUD ----------
  function hud(ctx, t, ink, label, o = {}) {
    const k = INK[ink]; const a = o.alpha == null ? 1 : o.alpha;
    // top-left: figure label
    if (label && o.tl !== false) {
      ctx.save(); ctx.globalAlpha = a;
      const parts = label.split('|'); // "07|المؤشرات"
      lat(ctx, parts[0], 77, 82, { size: 22, w: 600, color: k.hud, track: 1 });
      const nw = measure(ctx, parts[0], 22, 600, 1);
      ctx.fillStyle = k.hud; ctx.fillRect(77 + nw + 12, 74, 22, 1.5);
      txt(ctx, parts[1], 77 + nw + 44, 83, { size: 23, w: 'R', color: k.hud, align: 'left' });
      ctx.restore();
    }
    // top-right: stacked logo (ink on light, white on dark)
    if (o.tr !== false) logo(ctx, 1843 - logoWidth(84), 52, 84, o.logoColor || (ink === 'paper' ? C.ink : C.white), { alpha: a });
    // bottom-left: X watermark, 60%, 4% of frame width
    if (o.bl !== false) xmark(ctx, 77 + 38, 1080 - 62 - 34, 69, ink === 'paper' ? C.ink : C.white, 0.6 * a);
    // bottom-right: live ticker — something moves on every beat
    if (o.br !== false) {
      const b = Math.max(0, Math.floor((t - OFF) / BEAT)); const [p, d] = TICK[b % TICK.length];
      const up = d >= 0; const s = p.toFixed(4);
      ctx.save(); ctx.globalAlpha = a;
      const x = 1843; const y = 1012;
      const pw = lat(ctx, s, x - 26, y, { size: 22, w: 600, color: k.hud, align: 'right', track: 1 });
      lat(ctx, 'EUR/USD', x - 26 - pw - 14, y, { size: 22, w: 400, color: k.hud, align: 'right', track: 1 });
      tri(ctx, x - 9, y - 8, 13, up ? 'u' : 'd', up ? C.mint : C.red);
      ctx.restore();
    }
  }

  // ---------- components ----------
  // rich RTL line: parts [{s, red, w}] drawn right-to-left starting at xr
  function rich(ctx, parts, xr, y, o = {}) {
    const size = o.size || 96; const sw = measure(ctx, ' ', size, o.w || 'L');
    let x = xr; const total = parts.reduce((s, p) => s + measure(ctx, p.s, size, p.w || o.w || 'L'), 0) + sw * (parts.length - 1);
    if (o.align === 'center') x = xr + total / 2;
    const p = o.p == null ? 1 : o.p;
    ctx.save();
    if (p < 1) { ctx.beginPath(); ctx.rect(x - total * p - 6, y - size * 1.5, total * p + 12, size * 2.4); ctx.clip(); }
    for (const part of parts) {
      const pw = measure(ctx, part.s, size, part.w || o.w || 'L');
      txt(ctx, part.s, x, y, { size, w: part.w || o.w || 'L', color: part.red ? C.red : part.color || o.color, alpha: o.alpha });
      x -= pw + sw;
    }
    ctx.restore();
    return total;
  }
  // eyebrow: small red label with a red ◀ triangle on its right (RTL)
  function eyebrow(ctx, s, xr, y, p = 1, color = C.red) {
    if (p <= 0) return;
    ctx.save(); ctx.globalAlpha = clamp(p * 2);
    tri(ctx, xr - 6, y - 9, 13, 'l', C.red);
    const m = measure(ctx, s, 26, 'R');
    ctx.beginPath(); ctx.rect(xr - 24 - m * p - 4, y - 40, m * p + 8, 60); ctx.clip();
    txt(ctx, s, xr - 24, y, { size: 26, w: 'R', color });
    ctx.restore();
  }
  // brand white card with red corner triangle
  function card(ctx, x, y, w, h, o = {}) {
    const p = o.p == null ? 1 : o.p; if (p <= 0) return;
    ctx.save();
    const dy = (1 - p) * 60; ctx.globalAlpha = clamp(p * 1.6);
    ctx.translate(0, dy);
    roundRect(ctx, x, y, w, h, 16);
    ctx.fillStyle = o.fill || C.white; ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = o.stroke || hexA(C.ink, 0.12); ctx.stroke();
    if (o.tri !== false) tri(ctx, x + w - 22, y + 22, 18, 'tr', C.red);
    ctx.restore();
  }
  // outlined tag (brand): red outline + red text
  function tag(ctx, s, xr, y, o = {}) {
    const size = o.size || 22; const m = measure(ctx, s, size, 'R');
    const p = o.p == null ? 1 : o.p; if (p <= 0) return 0;
    ctx.save(); ctx.globalAlpha = clamp(p * 2);
    const col = o.color || C.red; const padX = 16; const hh = size + 18;
    roundRect(ctx, xr - m - padX * 2, y - hh / 2, m + padX * 2, hh, 6); ctx.lineWidth = 1.5; ctx.strokeStyle = col;
    if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
    ctx.stroke();
    txt(ctx, s, xr - padX, y + size * 0.36, { size, w: 'R', color: o.text || col });
    ctx.restore(); return m + padX * 2;
  }
  // red pill CTA
  function pill(ctx, s, cx, cy, o = {}) {
    const size = o.size || 30; const m = measure(ctx, s, size, 'B'); const h = o.h || 72; const wv = m + 80;
    const p = o.p == null ? 1 : o.p; if (p <= 0) return;
    ctx.save(); ctx.globalAlpha = clamp(p * 1.5);
    const sc = 0.85 + 0.15 * p; ctx.translate(cx, cy); ctx.scale(sc, sc);
    roundRect(ctx, -wv / 2, -h / 2, wv, h, h / 2); ctx.fillStyle = o.fill || C.red; ctx.fill();
    txt(ctx, s, 0, size * 0.36, { size, w: 'B', color: o.color || C.white, align: 'center' });
    ctx.restore();
  }
  // hero number (Inter Light)
  function hero(ctx, s, x, y, o = {}) {
    return lat(ctx, s, x, y, { size: o.size || 260, w: 300, color: o.color || C.ink, align: o.align || 'center', alpha: o.alpha, track: -(o.size || 260) * 0.03 });
  }

  // ---------- chart helpers ----------
  function mapSeries(data, box, lo, hi) {
    const [x, y, w, h] = box; const n = data.length; const dx = w / n;
    const Y = (v) => y + h - (v - lo) / (hi - lo) * h;
    return { dx, X: (i) => x + dx * (i + 0.5), Y };
  }
  function range(data, pad = 0.08) {
    let lo = Infinity, hi = -Infinity; data.forEach((d) => { lo = Math.min(lo, d.l); hi = Math.max(hi, d.h); });
    const r = hi - lo; return [lo - r * pad, hi + r * pad];
  }
  // candles: style 'paper' | 'steel' | 'dark'
  function candles(ctx, ink, data, box, o = {}) {
    const [lo, hi] = o.range || range(data); const m = mapSeries(data, box, lo, hi);
    const shown = o.count == null ? data.length : o.count; const bw = Math.max(3, m.dx * (o.body || 0.56)); const t = o.t || 0;
    for (let i = 0; i < Math.min(shown, data.length); i++) {
      const d = data[i]; const x = m.X(i); const up = d.c >= d.o;
      const pi = o.grow ? clamp((shown - i) / 1.5) : 1;
      const mid = (d.o + d.c) / 2;
      const yH = m.Y(lerp(mid, d.h, pi)), yL = m.Y(lerp(mid, d.l, pi)), yO = m.Y(lerp(mid, d.o, pi)), yC = m.Y(lerp(mid, d.c, pi));
      const top = Math.min(yO, yC), bot = Math.max(yO, yC, top + 2);
      const col = ink === 'dark' ? (up ? C.mint : C.red) : INK[ink].line;
      ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
      ctx.strokeStyle = col; ctx.lineWidth = ink === 'dark' ? 2 : 2;
      ctx.beginPath(); ctx.moveTo(x, yH); ctx.lineTo(x, top); ctx.moveTo(x, bot); ctx.lineTo(x, yL); ctx.stroke();
      if (ink === 'dark') {
        ctx.strokeRect(x - bw / 2, top, bw, bot - top);
        ctx.fillStyle = col; for (let yy = Math.ceil(top / 6) * 6; yy < bot; yy += 6) ctx.fillRect(x - bw / 2, yy, bw, up ? 3 : 2.2);
      } else if (up) {
        ctx.strokeRect(x - bw / 2, top, bw, bot - top);
      } else {
        ctx.fillStyle = col; ctx.fillRect(x - bw / 2, top, bw, bot - top);
      }
      ctx.restore();
    }
    return m;
  }
  function closes(data) { return data.map((d) => d.c); }
  function linePts(vals, box, lo, hi) { const [x, y, w, h] = box; const n = vals.length; return vals.map((v, i) => [x + w * (i + 0.5) / n, y + h - (v - lo) / (hi - lo) * h]); }

  // ---------- director ----------
  const SCENES = [];
  function scene(def) { SCENES.push(def); return def; }
  function region(ctx, type, p, o = {}) {
    ctx.beginPath();
    if (type === 'scanDown') ctx.rect(0, 0, W, H * p);
    else if (type === 'scanUp') ctx.rect(0, H * (1 - p), W, H * p);
    else if (type === 'wipeLeft') ctx.rect(W * (1 - p), 0, W * p, H);    // new scene enters from the right edge moving left
    else if (type === 'wipeRight') ctx.rect(0, 0, W * p, H);
    else if (type === 'circle') ctx.arc(o.x || 960, o.y || 540, Math.hypot(W, H) * p, 0, Math.PI * 2);
    else if (type === 'rect') { const [x, y, w, h] = o.from; const x0 = lerp(x, 0, p), y0 = lerp(y, 0, p); ctx.rect(x0, y0, lerp(x + w, W, p) - x0, lerp(y + h, H, p) - y0); }
  }
  function drawScanLine(ctx, type, p, color) {
    if (p <= 0 || p >= 1) return;
    ctx.save(); ctx.fillStyle = color;
    if (type === 'scanDown') ctx.fillRect(0, H * p - 2, W, 4);
    else if (type === 'scanUp') ctx.fillRect(0, H * (1 - p) - 2, W, 4);
    else if (type === 'wipeLeft') ctx.fillRect(W * (1 - p) - 2, 0, 4, H);
    else if (type === 'wipeRight') ctx.fillRect(W * p - 2, 0, 4, H);
    ctx.restore();
  }
  function draw(ctx, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    let i = SCENES.findIndex((s) => t >= s.t0 && t < s.t1);
    if (i < 0) i = t < SCENES[0].t0 ? 0 : SCENES.length - 1;
    const s = SCENES[i];
    s.draw(ctx, t);
    const nx = SCENES[i + 1];
    if (nx && nx.enter && nx.enter.type !== 'cut') {
      const d = nx.enter.dur || 0.5; const t0 = nx.t0 - d;
      if (t >= t0) {
        const p = G.AX.expoInOut(inv(t0, nx.t0, t));
        ctx.save(); region(ctx, nx.enter.type, p, nx.enter); ctx.clip(); nx.draw(ctx, t); ctx.restore();
        if (nx.enter.line) drawScanLine(ctx, nx.enter.type, p, nx.enter.line);
      }
    }
    ctx.restore();
  }

  G.FILM = { OFF, TOTAL, CLOSE, BEAT, AUDIO_END, w, we, ph, phe, SFX, sfx, hud, rich, eyebrow, card, tag, pill, hero, mapSeries, range, candles, closes, linePts, scene, SCENES, draw };
})(typeof window !== 'undefined' ? window : globalThis);
