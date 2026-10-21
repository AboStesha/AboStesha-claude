// fx.js — axi-select-ch1 v2 (Rabee, Axi Select explainer, video 1 of 6, 1920x1080, 25 fps)
// Built by work/build_fx.sh from comp/src/*.js (00_head, 10_kit, 20_studio, 3x_<group>, 90_main): edit the parts.
// The look follows the Axi Select brand guide (Properly Studio, 2026): near-black, Axi red #E4002E as the only accent,
// white and greys, metallic numerals, the red ◢ texture, ▲▲▲, red corner marks, the red flag, SELECT-tag and
// chamfered-card silhouettes, candlesticks, red pills, the official axi SELECT logo.
// Times passed around are OUTPUT seconds; v(t) maps a VO time onto the output timeline (output = VO + P).
(function () {
  const U = RRC.util;
  const AR = '"AlexAr", "AlexLat", sans-serif';
  const LAT = '"InterV", "AlexLat", sans-serif';
  const W = 1920, H = 1080;
  // palette
  const RED = "#E4002E", WHITE = "#FFFFFF", INK = "#0B0C0E", INK2 = "#16171A";
  const GREY = "#8E9095", DIM = "#55575C", TRACK = "#2A2B2F", LEGAL = "#6E7075", UPC = "#8A898A", UPC2 = "#E6E7E9";
  const PANEL = "rgba(19,20,23,0.96)", DARKPILL = "#303133"; // flat panel #131417 (pages 4, 6); dark pill (page 5)
  const HAIR = "rgba(255,255,255,0.10)", HILITE = "rgba(255,255,255,0.18)";
  // easing
  const cl = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const pr = (t, a, b) => (b === a ? (t >= b ? 1 : 0) : cl((t - a) / (b - a)));
  const e2 = (t) => 1 - Math.pow(1 - cl(t), 2);
  const e3 = (t) => 1 - Math.pow(1 - cl(t), 3);
  const e4 = (t) => 1 - Math.pow(1 - cl(t), 4); // quartOut
  const in2 = (t) => cl(t) * cl(t);
  const inC = (t) => Math.pow(cl(t), 3); // inCubic (exits)
  const eio = (t) => { t = cl(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }; // inOutCubic
  const expo = (t) => { t = cl(t); return t >= 1 ? 1 : (1 - Math.pow(2, -10 * t)) / (1 - Math.pow(2, -10)); }; // expoOut
  const back = (t, k = 1.4) => { t = cl(t); const c3 = k + 1; return 1 + c3 * Math.pow(t - 1, 3) + k * Math.pow(t - 1, 2); };
  const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
  const hash = (a, b, c) => U.hash(a, b, c); // deterministic 0..1

  let P = 3.0, NO_TEXT = false, NO_SUBS = false, SUBS = [], COVER = false;
  let BUG = [4.40, 110.88], WIPE = [110.36, 110.88]; // VO s: logo-bug window on presenter shots, end-wipe span (k_t.bug / k_t.wipe)
  const v = (t) => t + P;
  RRC.hook("ready", ({ E }) => {
    const k = (E && E.k_t) || {};
    P = k.P ?? 3.0;
    NO_TEXT = !!(E && E.k_no_text);
    NO_SUBS = !!(E && E.k_no_subs);
    SUBS = k.subs || [];
    COVER = !!(E && E.k_cover);
    if (k.bug) BUG = k.bug;
    if (k.wipe) WIPE = k.wipe;
  });

  // ------------------------------------------------------------------ assets and scratch canvases
  const IMG = {};
  async function im(n) { if (!(n in IMG)) IMG[n] = await U.img("comp/assets/" + n, true); return IMG[n]; }
  const TMP = {};
  function tmp(name, w, h) {
    let c = TMP[name];
    if (!c || c.width !== Math.round(w) || c.height !== Math.round(h)) c = TMP[name] = U.mk(w, h);
    return c;
  }
  function snap(x, name) {
    const c = tmp(name || "snap", x.canvas.width, x.canvas.height);
    c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalAlpha = 1; c.x.filter = "none";
    c.x.globalCompositeOperation = "copy"; c.x.drawImage(x.canvas, 0, 0); c.x.globalCompositeOperation = "source-over";
    return c;
  }

  // ------------------------------------------------------------------ envelopes (motion rules of the spec)
  // ent(): entry t0 (expo, din s, rise px) ... exit t1 (inOutCubic, dout s, alpha->0, y -10, scale .985; inCubic ended
  // on a 35-60 % one-frame drop). null when off.
  function ent(t, t0, t1, o = {}) {
    const din = o.din ?? 0.45, dout = o.dout ?? 0.3;
    if (t < t0 || t > t1 + dout) return null;
    const ui = expo(pr(t, t0, t0 + din)), uo = eio(pr(t, t1, t1 + dout));
    return { ui, uo, a: cl(ui * 1.25) * (1 - uo), dy: (1 - ui) * (o.rise ?? 20) - 10 * uo, sc: 1 - 0.015 * uo, lt: t - t0 };
  }
  // legacy envelope (kept for the subtitles)
  function env(t, t0, t1, din = 0.4, dout = 0.3) {
    if (t < t0 || t > t1 + dout) return null;
    const ui = pr(t, t0, t0 + din), uo = pr(t, t1, t1 + dout);
    return { ui, uo, a: e3(ui) * (1 - e2(uo)), lt: t - t0 };
  }

  // ------------------------------------------------------------------ text
  // T(): one run of text at an anchor X and a BASELINE Y (alphabetic). Arabic runs are RTL and right-aligned by
  // default, Latin runs LTR and left-aligned. No shadows or glows on type (brand rule). A run at alpha < 1 (o.a times
  // the context's globalAlpha) lands as one layer through inkText(), so T, runs, headline, pill and txt fade seam-free.
  const isAr = (s) => /[؀-ۿ]/.test(s);
  function font(x, w, s, fam) { x.font = `${w} ${s}px ${fam || AR}`; }
  function famOf(s, o) { return o.fam || (isAr(s) ? AR : LAT); }
  // inkText(): fillText(s, X, Y) with x's current text state (font, direction, align, baseline, letter/word spacing,
  // fill, shadow) that lands as ONE layer. Canvas composites every glyph of a run on its own, so where the glyphs of a
  // joined Arabic word overlap (the joins, kashida, dots) a run drawn at alpha < 1 gets double alpha: bright 2-3 px seams.
  // When the effective alpha (x.globalAlpha) is < INKB.max the run is painted at full opacity into a reusable buffer in
  // DEVICE space (x's transform with the offset moved by whole pixels, so no resampling and identical glyph
  // rasterisation) over only its ink box (+ shadow), and that box lands once at the alpha with the identity transform:
  // x's clip, composite op and filter still apply. At alpha >= INKB.max it fills straight through (held frames unchanged).
  // Buffers come from a small LRU pool by size class (64 x 32 px steps): Chrome copies a whole source canvas on the next
  // write while a drawImage of it is still pending, so one big shared buffer costs 1-4 ms per call, a fitted one ~0.1-0.3.
  // Returns the TextMetrics when it measured (buffered path), else null.
  const INKB = { max: 0.999, pool: new Map() };
  function inkBuf(cw, ch) {
    const bw = (cw + 63) & ~63, bh = (ch + 31) & ~31, k = bw * 8192 + bh;
    let c = INKB.pool.get(k);
    if (c) INKB.pool.delete(k);
    else { c = U.mk(bw, bh); if (INKB.pool.size >= 24) INKB.pool.delete(INKB.pool.keys().next().value); }
    INKB.pool.set(k, c); // most recently used last
    return c;
  }
  function inkText(x, s, X, Y) {
    const a = x.globalAlpha;
    if (a >= INKB.max) { x.fillText(s, X, Y); return null; }
    if (!(a > 0)) return null;
    const m = x.measureText(s), M = x.getTransform();
    const L = X - m.actualBoundingBoxLeft, R = X + m.actualBoundingBoxRight;
    const T0 = Y - m.actualBoundingBoxAscent, B = Y + m.actualBoundingBoxDescent;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i < 4; i++) {
      const px = i & 1 ? R : L, py = i & 2 ? B : T0, dx = M.a * px + M.c * py + M.e, dy = M.b * px + M.d * py + M.f;
      if (dx < x0) x0 = dx; if (dx > x1) x1 = dx; if (dy < y0) y0 = dy; if (dy > y1) y1 = dy;
    }
    if (!(x1 >= x0 && y1 >= y0)) { x.fillText(s, X, Y); return m; } // no ink box: plain fill
    const shc = x.shadowColor, sh = shc !== "rgba(0, 0, 0, 0)" && (x.shadowBlur > 0 || x.shadowOffsetX || x.shadowOffsetY);
    if (sh) { // shadow extent in device px (blur and offsets ignore the transform)
      const e = 2 * x.shadowBlur + 2, ox = x.shadowOffsetX, oy = x.shadowOffsetY;
      x0 = Math.min(x0, x0 + ox) - e; x1 = Math.max(x1, x1 + ox) + e; y0 = Math.min(y0, y0 + oy) - e; y1 = Math.max(y1, y1 + oy) + e;
    }
    const cw0 = x.canvas.width, ch0 = x.canvas.height;
    const bx = Math.max(0, Math.floor(x0) - 3), by = Math.max(0, Math.floor(y0) - 3);
    const cw = Math.min(cw0, Math.ceil(x1) + 3) - bx, ch = Math.min(ch0, Math.ceil(y1) + 3) - by;
    if (cw <= 0 || ch <= 0) return m; // all of it off the canvas
    if (cw > 4096 || ch > 4096) { x.fillText(s, X, Y); return m; }
    const c = inkBuf(cw, ch), b = c.x;
    b.setTransform(1, 0, 0, 1, 0, 0); b.globalAlpha = 1; b.globalCompositeOperation = "source-over"; b.filter = "none";
    b.clearRect(0, 0, cw, ch);
    // Chrome reads letterSpacing / wordSpacing back as "" after font is set inside a save() (the run then uses the
    // spacing in force, which is 0 everywhere in this kit: T and measure set o.ls inside their own save); a width check
    // catches any other mismatch and falls back to a plain fill rather than draw a different layout
    b.font = x.font; b.direction = x.direction; b.textAlign = x.textAlign; b.textBaseline = x.textBaseline;
    b.letterSpacing = x.letterSpacing || "0px"; b.wordSpacing = x.wordSpacing || "0px"; b.fontKerning = x.fontKerning;
    b.fontStretch = x.fontStretch; b.fontVariantCaps = x.fontVariantCaps; b.textRendering = x.textRendering;
    if (Math.abs(b.measureText(s).width - m.width) > 0.01) { x.fillText(s, X, Y); return m; }
    b.fillStyle = x.fillStyle;
    b.shadowColor = sh ? shc : "rgba(0,0,0,0)"; b.shadowBlur = sh ? x.shadowBlur : 0;
    b.shadowOffsetX = sh ? x.shadowOffsetX : 0; b.shadowOffsetY = sh ? x.shadowOffsetY : 0;
    b.setTransform(M.a, M.b, M.c, M.d, M.e - bx, M.f - by);
    b.fillText(s, X, Y);
    x.save();
    x.setTransform(1, 0, 0, 1, 0, 0); x.shadowColor = "rgba(0,0,0,0)"; // the buffer already holds the shadow
    x.drawImage(c, 0, 0, cw, ch, bx, by, cw, ch);
    x.restore();
    return m;
  }
  function T(x, s, X, Y, o = {}) {
    if (!s) return 0;
    const fam = famOf(s, o), ar = fam === AR && o.ltr !== true;
    x.save();
    font(x, o.w ?? (ar ? 400 : 300), o.size ?? 40, fam);
    x.direction = ar ? "rtl" : "ltr";
    x.textAlign = o.align || (ar ? "right" : "left");
    x.textBaseline = "alphabetic";
    if (o.ls) x.letterSpacing = o.ls + "px";
    x.globalAlpha *= o.a ?? 1;
    x.fillStyle = o.color || WHITE;
    const mm = inkText(x, s, X, Y); // one layer when faded (no seams at the Arabic joins)
    const m = (mm || x.measureText(s)).width;
    x.restore();
    return m;
  }
  function measure(x, s, w, size, fam, ls) {
    x.save(); font(x, w, size, fam || (isAr(s) ? AR : LAT)); if (ls) x.letterSpacing = ls + "px";
    const m = x.measureText(s).width; x.restore(); return m;
  }
  // shrink a size until the string fits maxW (never below min)
  function fit(x, s, w, size, maxW, min = 34, fam) {
    let z = size;
    while (z > min && measure(x, s, w, z, fam) > maxW) z -= 1;
    return z;
  }
  // runs(): mixed Arabic/Latin line laid out right to left from X (RTL reading order). parts: [{s, w, size, color, fam,
  // gap}] in reading order; returns the total width. Each run keeps its own font (Alexandria / Inter).
  function runs(x, parts, X, Y, o = {}) {
    let xx = X;
    for (const p of parts) {
      const size = p.size ?? o.size ?? 40, w = p.w ?? o.w ?? 400;
      const fam = p.fam || (isAr(p.s) ? AR : LAT);
      const mw = measure(x, p.s, w, size, fam, p.ls);
      T(x, p.s, xx - mw, Y, { w, size, fam, ltr: true, align: "left", color: p.color || o.color, a: (p.a ?? 1) * (o.a ?? 1), ls: p.ls });
      xx -= mw + (p.gap ?? size * 0.28);
    }
    return X - xx;
  }
  // legacy centred text (subtitles)
  function txt(x, s, cx, cy, o = {}) {
    x.save();
    font(x, o.w || 500, o.size || 40, o.fam);
    x.direction = o.ltr ? "ltr" : "rtl";
    x.textAlign = o.align || "center";
    x.textBaseline = "middle";
    x.globalAlpha *= o.alpha ?? 1;
    if (o.shadow !== false) { x.shadowColor = `rgba(0,0,0,${o.sa ?? 0.55})`; x.shadowBlur = U.px(o.sb ?? 16); x.shadowOffsetY = U.px(o.sdy ?? 3); }
    x.fillStyle = o.color || WHITE;
    inkText(x, s, cx, cy); // one layer when faded (no seams at the Arabic joins)
    x.restore();
  }
  function rr(x, X, Y, w, h, r) { x.beginPath(); x.roundRect(X, Y, w, h, r); }

  // ================================================================== BRAND KIT (shared by every group)
  // ------------------------------------------------------------------ cached sprites
  const SPR = {};
  // radial glow sprite (RED / WHITE), drawn scaled; the brand allows soft light, never glows on type
  function glow(x, cx, cy, r, color, a) {
    if (a <= 0.003 || r <= 0) return;
    const k = "glow" + color;
    let c = SPR[k];
    if (!c) {
      c = SPR[k] = U.mk(256, 256);
      const g = c.x.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0, rgba(color, 1)); g.addColorStop(0.35, rgba(color, 0.45)); g.addColorStop(1, rgba(color, 0));
      c.x.fillStyle = g; c.x.fillRect(0, 0, 256, 256);
    }
    x.save(); x.globalAlpha *= a; x.drawImage(c, cx - r, cy - r, 2 * r, 2 * r); x.restore();
  }
  // sheen: a 120 px band at 20 deg (white 0 -> .55 -> 0) swept over whatever draw(cx) paints into a w x h box at X, Y
  function withSheen(x, X, Y, w, h, u, draw) {
    const pad = 4, c = tmp("sheen" + Math.round(w) + "x" + Math.round(h), w + 2 * pad, h + 2 * pad);
    c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalAlpha = 1; c.x.globalCompositeOperation = "source-over";
    c.x.clearRect(0, 0, w + 2 * pad, h + 2 * pad);
    c.x.save(); c.x.translate(pad - X, pad - Y); draw(c.x); c.x.restore();
    if (u > 0 && u < 1) {
      c.x.globalCompositeOperation = "source-atop";
      const span = w + h * 0.36 + 240, bx = -120 + span * eio(u) - h * 0.18;
      c.x.save(); c.x.translate(pad + bx, pad + h / 2); c.x.rotate((-20 * Math.PI) / 180);
      const g = c.x.createLinearGradient(-60, 0, 60, 0);
      g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, "rgba(255,255,255,0.55)"); g.addColorStop(1, "rgba(255,255,255,0)");
      c.x.fillStyle = g; c.x.fillRect(-60, -h * 1.5, 120, h * 3); c.x.restore();
      c.x.globalCompositeOperation = "source-over";
    }
    x.drawImage(c, X - pad, Y - pad, w + 2 * pad, h + 2 * pad);
  }

  // ------------------------------------------------------------------ official logo (PNG only, white, never recoloured)
  // lockup width w: height .2186w; "axi" x0..x0+.4198w; SELECT tag x0+.4752w..x0+w; tag ink y .259h..982h
  const LOGO = { w: 2580, h: 564, axiW: 1083, tagX: 1226, inkTop: 0.259, inkBot: 0.982 };
  async function logo(x, cx, cy, w, a = 1) {
    const img = await im("axiselect_white.png"), h = (w * LOGO.h) / LOGO.w;
    x.save(); x.globalAlpha *= a; x.drawImage(img, cx - w / 2, cy - h / 2, w, h); x.restore();
  }
  // the axi wordmark alone (the company), height h at top-left X, Y
  async function axiMark(x, X, Y, h, a = 1) {
    const img = await im("axi_part_white.png"), w = (h * LOGO.axiW) / LOGO.h;
    x.save(); x.globalAlpha *= a; x.drawImage(img, X, Y, w, h); x.restore();
    return w;
  }
  // build (duration d): the wordmark rises out of its baseline; the SELECT tag wipes on left->right behind a '/' edge
  // parallel to the tag's own cuts (0.82 px of x per px of y) that carries a red band. o.sheen: true adds a sheen (off by
  // default: white on the white logo does not read).
  async function logoBuild(x, t, t0, cx, cy, w, o = {}) {
    const lt = t - t0; if (lt < 0) return;
    const ax = await im("axi_part_white.png"), tg = await im("select_tag_white.png"), full = await im("axiselect_white.png");
    const d = o.d ?? 0.8, h = (w * LOGO.h) / LOGO.w, X0 = cx - w / 2, Y0 = cy - h / 2, a = o.a ?? 1;
    const uA = e4(pr(lt, 0, 0.5 * d)), uT = pr(lt, 0.3 * d, 0.85 * d);
    const shT = o.sheenAt ?? d + 0.08, us = pr(lt, shT, shT + 0.5);
    x.save(); x.globalAlpha *= a;
    if (uA >= 1 && uT >= 1) {
      if (us > 0 && us < 1 && o.sheen === true) withSheen(x, X0, Y0, w, h, us, (c) => c.drawImage(full, X0, Y0, w, h));
      else x.drawImage(full, X0, Y0, w, h);
      x.restore(); return;
    }
    const aw = (LOGO.axiW / LOGO.w) * w;
    x.save(); x.beginPath(); x.rect(X0 - 40, Y0 - h, aw + 80, 2 * h); x.clip();
    x.globalAlpha *= cl(uA * 1.5); x.drawImage(ax, X0, Y0 + (1 - uA) * h * 0.7, aw, h); x.restore();
    const tx = X0 + (LOGO.tagX / LOGO.w) * w, tw = w - (LOGO.tagX / LOGO.w) * w;
    if (uT > 0) {
      const ym = Y0 + h * 0.62, sl = 0.82, ext = sl * h * 0.6 + 20;
      const ex = lerp(tx - ext, tx + tw + ext, e4(uT));
      const xe = (yy) => ex + sl * (ym - yy);
      x.save(); x.beginPath();
      x.moveTo(tx - 10, Y0 - 10); x.lineTo(xe(Y0 - 10), Y0 - 10); x.lineTo(xe(Y0 + h + 10), Y0 + h + 10); x.lineTo(tx - 10, Y0 + h + 10); x.closePath(); x.clip();
      x.drawImage(tg, tx, Y0, tw, h); x.restore();
      if (uT < 1) { // the red band rides the edge, clipped to the tag, fading on the edge's own (e4) progress
        const bw = 0.07 * h, y1 = Y0 + LOGO.inkTop * h, y2 = Y0 + LOGO.inkBot * h;
        x.save(); x.beginPath(); x.rect(tx, Y0 - 10, tw, h + 20); x.clip();
        x.globalAlpha *= 1 - pr(e4(uT), 0.85, 1); x.fillStyle = RED;
        x.beginPath(); x.moveTo(xe(y1), y1); x.lineTo(xe(y1) + bw, y1); x.lineTo(xe(y2) + bw, y2); x.lineTo(xe(y2), y2); x.closePath(); x.fill();
        x.restore();
      }
    }
    x.restore();
  }

  // ------------------------------------------------------------------ ◢ texture (brand pages 4-5): 9 px right triangles
  // (right angle bottom-right) on a 57 x 61 px lattice; RED .27 / .23 / .19 / .16 / .12 on the top five rows, nothing below.
  // Cached once. o: dx, dy (drift <= 6 px/s), a, top (alpha of the top row), fade (<.55 = fewer rows), y, reveal, dir
  function triSprite(top, fade) { // measured at 1920 scale: s 9, pitch 57 x 61, uniform (no vignette, no jitter)
    const k = "tri" + top + ":" + fade;
    if (SPR[k]) return SPR[k];
    const w = 2040, h = 1200, c = (SPR[k] = U.mk(w, h));
    const s = 9, PX = 57, PY = 61, ROWS = [0.27, 0.23, 0.19, 0.16, 0.12].map((r) => (r * top) / 0.27);
    const nRows = fade >= 0.55 ? ROWS.length : Math.max(1, Math.round(ROWS.length * fade / 0.55));
    for (let r = 0; r < nRows; r++) {
      const yy = 30 + r * PY;
      c.x.beginPath();
      for (let xx = 18; xx < w; xx += PX) { c.x.moveTo(xx + s, yy); c.x.lineTo(xx + s, yy + s); c.x.lineTo(xx, yy + s); c.x.closePath(); }
      c.x.fillStyle = rgba(RED, ROWS[r].toFixed(3));
      c.x.fill();
    }
    return c;
  }
  function triTex(x, a, o = {}) {
    if (a <= 0.003) return;
    const c = triSprite(o.top ?? 0.27, o.fade ?? 0.55);
    x.save(); x.globalAlpha *= a;
    if (o.reveal != null && o.reveal < 1) slantClip(x, o.reveal, o.dir ?? "rtl");
    x.drawImage(c, -60 + (o.dx ?? 0), (o.y ?? -12) + (o.dy ?? 0), 2040, 1200);
    x.restore();
  }
  // clip to the part of the frame already swept by a slanted edge (0.82 px of x per px of y); dir "rtl" sweeps from
  // the right edge to the left, "ltr" the other way
  function slantClip(x, u, dir = "rtl") {
    const sl = 0.82, span = W + sl * H + 40, e = expo(u) * span;
    x.beginPath();
    if (dir === "rtl") { const x0 = W + 20 - e; x.moveTo(W + 40, -20); x.lineTo(x0 + sl * H, -20); x.lineTo(x0, H + 20); x.lineTo(W + 40, H + 20); }
    else { const x1 = -20 + e; x.moveTo(-40, -20); x.lineTo(x1, -20); x.lineTo(x1 - sl * H, H + 20); x.lineTo(-40, H + 20); }
    x.closePath(); x.clip();
  }

  // ------------------------------------------------------------------ ▲▲▲ (page 8): rounded up-triangles 18 x 12, pitch 22
  // X = left edge, Ytop = centre of the top triangle; pops bottom -> top (0.08 s stagger, back 1.4) from t0, then waves
  function chev3(x, X, Ytop, t, t0, o = {}) {
    if (t < t0) return;
    const s = o.s ?? 1, w = 18 * s, h = 12 * s, pitch = (o.pitch ?? 22) * s, a = o.a ?? 1;
    x.save(); x.fillStyle = o.color || RED; const ga = x.globalAlpha; // the caller's alpha (a layer fade) is kept
    for (let i = 0; i < 3; i++) { // i 0 = bottom
      const k = pr(t, t0 + i * 0.08, t0 + i * 0.08 + 0.3); if (k <= 0) continue;
      const sc = back(k, 1.4), per = o.period ?? 1.2, wave = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(((t - t0 - i * 0.15) * 2 * Math.PI) / per));
      const cy = Ytop + (2 - i) * pitch, cx = X + w / 2;
      x.globalAlpha = ga * a * cl(k * 3) * (k >= 1 ? wave : 1);
      x.save(); x.translate(cx, cy); x.scale(sc, sc);
      x.beginPath(); x.moveTo(0, -h / 2); x.lineTo(w / 2, h / 2); x.lineTo(-w / 2, h / 2); x.closePath();
      x.lineJoin = "round"; x.lineWidth = 2 * s; x.strokeStyle = o.color || RED; x.fill(); x.stroke();
      x.restore();
    }
    x.restore();
  }

  // ------------------------------------------------------------------ red flag mark (pages 6, 9) and the flag marker
  // box h, w = .74h at X, Y (top-left of the box). mirror = for RTL (vertical edge on the right). u = unfurl (scaleY)
  function flag(x, X, Y, h, o = {}) {
    const u = o.u ?? 1; if (u <= 0) return;
    const w = 0.74 * h;
    x.save(); x.globalAlpha *= o.a ?? 1; x.fillStyle = o.color || RED;
    x.translate(X, Y); x.scale(1, e4(u));
    const P0 = [[0, 0], [w, 0], [w, 0.36 * h], [0.15 * w, h], [0, h]];
    x.beginPath();
    P0.forEach(([px, py], i) => { const qx = o.mirror ? w - px : px; i ? x.lineTo(qx, py) : x.moveTo(qx, py); });
    x.closePath(); x.fill(); x.restore();
    return w;
  }
  // "you are here": 2 px white pole (ph tall) with a flag of h at its top; (X, Ybase) = foot of the pole
  function flagMarker(x, X, Ybase, o = {}) {
    const ph = o.ph ?? 54, h = o.h ?? 26, a = o.a ?? 1;
    x.save(); x.globalAlpha *= a;
    x.fillStyle = WHITE; x.fillRect(X - 1, Ybase - ph, 2, ph);
    flag(x, X + 1, Ybase - ph, h, { u: o.u ?? 1 });
    x.restore();
  }

  // ------------------------------------------------------------------ red corner marks (page 7) + dotted frame lines
  // o: L legs (18 cards / 28 full-screen), u corners fly-in (0..1), u2 dotted lines (0..1), mid (y of the dotted price
  // line), a
  function corners(x, X, Y, w, h, o = {}) {
    const L = o.L ?? 18, u = expo(o.u ?? 1), a = o.a ?? 1, cx = X + w / 2, cy = Y + h / 2;
    x.save(); x.globalAlpha *= a;
    if (u > 0) {
      x.fillStyle = RED;
      for (const [px, py, sx, sy] of [[X, Y, 1, 1], [X + w, Y, -1, 1], [X, Y + h, 1, -1], [X + w, Y + h, -1, -1]]) {
        const qx = lerp(cx, px, u), qy = lerp(cy, py, u);
        x.beginPath(); x.moveTo(qx, qy); x.lineTo(qx + sx * L, qy); x.lineTo(qx, qy + sy * L); x.closePath(); x.fill();
      }
    }
    const u2 = o.u2 ?? 1;
    if (u2 > 0) {
      x.lineWidth = 1.5; x.strokeStyle = "rgba(255,255,255,0.22)"; x.setLineDash([2, 6]);
      const yy = lerp(Y + L + 6, Y + h - L - 6, e3(u2));
      x.beginPath(); x.moveTo(X, Y + L + 6); x.lineTo(X, yy); x.moveTo(X + w, Y + L + 6); x.lineTo(X + w, yy); x.stroke();
      if (o.mid != null) {
        x.strokeStyle = "rgba(255,255,255,0.30)"; x.setLineDash([3, 6]);
        x.beginPath(); x.moveTo(X + L + 6, o.mid); x.lineTo(lerp(X + L + 6, X + w - 6, e3(u2)), o.mid); x.stroke();
      }
      x.setLineDash([]);
    }
    x.restore();
  }

  // ------------------------------------------------------------------ SELECT-tag plate (cuts at top-left and bottom-right)
  function tagPath(x, X, Y, w, h) {
    x.beginPath();
    x.moveTo(X + 0.355 * h, Y); x.lineTo(X + w, Y); x.lineTo(X + w, Y + 0.57 * h); x.lineTo(X + w - 0.35 * h, Y + h);
    x.lineTo(X, Y + h); x.lineTo(X, Y + 0.43 * h); x.closePath();
  }
  function panelFill(x, Y, h, a = 0.96) { return a === 0.96 ? PANEL : `rgba(19,20,23,${a})`; } // flat (pages 4, 6)
  // o: fill "panel" | "red" | "none", outline (alpha of a white outline, DIM state), rim (red rim alpha), done (0..1:
  // the top-left cut fills red with a white tick), a
  function tag(x, X, Y, w, h, o = {}) {
    const a = o.a ?? 1; if (a <= 0.003) return;
    x.save(); x.globalAlpha *= a;
    tagPath(x, X, Y, w, h);
    if (o.fill !== "none") { x.fillStyle = o.fill === "red" ? RED : panelFill(x, Y, h); x.fill(); }
    if (o.fill !== "red") { x.lineWidth = 1.5; x.strokeStyle = o.outline != null ? `rgba(255,255,255,${o.outline})` : HAIR; x.stroke(); }
    if (o.rim) { x.lineWidth = 2; x.strokeStyle = rgba(RED, o.rim); x.stroke(); }
    if (o.done > 0) {
      x.globalAlpha *= e3(o.done); // multiplies (keeps the caller's alpha)
      x.fillStyle = RED; x.beginPath(); x.moveTo(X, Y); x.lineTo(X + 0.355 * h, Y); x.lineTo(X, Y + 0.43 * h); x.closePath(); x.fill();
      const q = 0.355 * h, k = e3(pr(o.done, 0.2, 1));
      x.strokeStyle = WHITE; x.lineWidth = 2; x.lineCap = "round"; x.lineJoin = "round";
      x.beginPath(); x.moveTo(X + q * 0.16, Y + q * 0.42);
      if (k > 0) x.lineTo(X + q * 0.16 + q * 0.14 * cl(k * 2), Y + q * 0.42 + q * 0.14 * cl(k * 2));
      if (k > 0.5) x.lineTo(X + q * 0.3 + q * 0.26 * cl(k * 2 - 1), Y + q * 0.56 - q * 0.36 * cl(k * 2 - 1));
      x.stroke();
    }
    x.restore();
  }

  // ------------------------------------------------------------------ chamfered card (page 4): top-right corner cut 45 deg
  function chamferPath(x, X, Y, w, h, c, r = 12) {
    x.beginPath();
    x.moveTo(X + r, Y); x.lineTo(X + w - c, Y); x.lineTo(X + w, Y + c); x.lineTo(X + w, Y + h - r);
    x.arcTo(X + w, Y + h, X + w - r, Y + h, r); x.lineTo(X + r, Y + h); x.arcTo(X, Y + h, X, Y + h - r, r);
    x.lineTo(X, Y + r); x.arcTo(X, Y, X + r, Y, r); x.closePath();
  }
  const cutOf = (w, h) => cl(0.12 * Math.min(w, h), 18, 48);
  // clip to the revealed part of a card (the reveal grows from the right edge, RTL)
  function cardClip(x, X, Y, w, h, u = 1) {
    if (u >= 1) return;
    x.beginPath(); x.rect(X + w - w * expo(u) - 2, Y - 40, w * expo(u) + 44, h + 80); x.clip();
  }
  // o: u (reveal from the right, 0..1), a, c (cut), tab "check"|"new", tabU (0..1), redEdge (importance bar 0..1),
  // fillA, rim. Flat PANEL + 1.5 px hairline only (no shadow, no highlight). Keep content out of the top-right (c+8) square.
  function card(x, X, Y, w, h, o = {}) {
    const a = o.a ?? 1; if (a <= 0.003) return;
    const c = o.c ?? cutOf(w, h);
    x.save(); x.globalAlpha *= a;
    cardClip(x, X, Y, w, h, o.u ?? 1);
    chamferPath(x, X, Y, w, h, c); x.fillStyle = panelFill(x, Y, h, o.fillA ?? 0.96); x.fill(); // flat: no shadow, no highlight
    x.lineWidth = 1.5; x.strokeStyle = o.rim || HAIR; x.stroke();
    if (o.redEdge > 0) { x.save(); chamferPath(x, X, Y, w, h, c); x.clip(); x.fillStyle = RED; x.fillRect(X, Y + h * (1 - e3(o.redEdge)) / 2, 4, h * e3(o.redEdge)); x.restore(); }
    if (o.tab && o.tabU > 0) {
      const k = e3(o.tabU);
      x.globalAlpha *= k; x.fillStyle = RED; // multiplies (keeps the caller's alpha)
      x.beginPath(); x.moveTo(X + w - c, Y); x.lineTo(X + w, Y); x.lineTo(X + w, Y + c); x.closePath(); x.fill();
      const cx = X + w - c * 0.3, cy = Y + c * 0.3, q = c * 0.22, kk = e3(pr(o.tabU, 0.25, 1));
      x.strokeStyle = WHITE; x.lineWidth = 3; x.lineCap = "round"; x.lineJoin = "round"; x.beginPath();
      if (o.tab === "check") {
        x.moveTo(cx - q, cy);
        if (kk > 0) x.lineTo(cx - q + q * 0.7 * cl(kk * 2), cy + q * 0.7 * cl(kk * 2));
        if (kk > 0.5) x.lineTo(cx - 0.3 * q + 1.3 * q * cl(kk * 2 - 1), cy + 0.7 * q - 1.4 * q * cl(kk * 2 - 1));
      } else { x.moveTo(cx - q * kk, cy); x.lineTo(cx + q * kk, cy); x.moveTo(cx, cy - q * kk); x.lineTo(cx, cy + q * kk); }
      x.stroke();
    }
    x.restore();
  }

  // ------------------------------------------------------------------ pills (pages 5, 8)
  // kind "red" (white label) or "dark" (#303133, 1 px border). circle: an arrow disc at the RIGHT end (d = h - 14):
  // red disc + white arrow on dark, white disc + red arrow on red. dir "left" (←, default) or "right" (→, only when it
  // points at Rabee). press = seconds since the click (scale .96 for 2 frames + a red ring r -> 2.6r over 0.4 s).
  // label: Alexandria 500 at .45h (red) / 400 34 (dark), right-aligned left of the disc, or centred without a disc.
  function pill(x, X, Y, w, h, label, o = {}) {
    const a = o.a ?? 1; if (a <= 0.003) return;
    const red = o.kind === "red", d = h - 14, cxD = X + w - 7 - d / 2, cy = Y + h / 2;
    const pz = o.press != null && o.press >= 0 && o.press < 0.08 ? 0.96 : 1;
    x.save(); x.globalAlpha *= a;
    x.translate(X + w / 2, cy); x.scale(pz * (o.scale ?? 1), pz * (o.scale ?? 1)); x.translate(-(X + w / 2), -cy);
    rr(x, X, Y, w, h, h / 2);
    x.fillStyle = red ? RED : o.fill || DARKPILL; x.fill();
    if (!red) { x.lineWidth = 1; x.strokeStyle = "rgba(255,255,255,0.07)"; x.stroke(); }
    if (o.circle) {
      x.fillStyle = red ? WHITE : RED; x.beginPath(); x.arc(cxD, cy, d / 2, 0, Math.PI * 2); x.fill();
      const q = d * 0.22, s = o.dir === "right" ? -1 : 1, ax = cxD + (o.nudge ?? 0);
      x.strokeStyle = red ? RED : WHITE; x.lineWidth = 3; x.lineCap = "round"; x.lineJoin = "round";
      x.beginPath(); x.moveTo(ax + s * q, cy); x.lineTo(ax - s * q, cy); x.moveTo(ax - s * q * 0.15, cy - q * 0.85); x.lineTo(ax - s * q, cy); x.lineTo(ax - s * q * 0.15, cy + q * 0.85); x.stroke();
    }
    if (label) {
      const wgt = o.w ?? (red ? 500 : 400), fam = isAr(label) ? AR : LAT;
      const room = o.circle ? w - d - 14 - 18 - h * 0.45 : w - h * 0.8;
      const size = fit(x, label, wgt, o.size ?? (red ? Math.round(0.45 * h) : 34), room, fam === AR ? 34 : 24, fam), base = cy + size * 0.36;
      if (o.circle) T(x, label, cxD - d / 2 - 18, base, { w: wgt, size, fam, color: o.color || (o.muted ? DIM : WHITE), align: "right", ltr: fam === LAT ? false : undefined });
      else T(x, label, X + w / 2, base, { w: wgt, size, fam, color: o.color || (o.muted ? DIM : WHITE), align: "center" });
    }
    x.restore();
    if (o.press != null && o.press >= 0 && o.press < 0.4) {
      const k = o.press / 0.4, r0 = o.circle ? d / 2 : h / 2;
      x.save(); x.globalAlpha *= a * 0.8 * (1 - k); x.strokeStyle = RED; x.lineWidth = 2;
      x.beginPath(); x.arc(o.circle ? cxD : X + w / 2, cy, r0 * lerp(1, 2.6, e3(k)), 0, Math.PI * 2); x.stroke(); x.restore();
    }
  }

  // ------------------------------------------------------------------ metallic numerals (page 8 "$ 500K")
  // Inter (200 hero / 300), each glyph a cached sprite: white text, then a vertical gradient over the cap box
  // (#F0F0F1 .5 #B4B5B9 1 #4C4E54); fade = the bottom 28 % of the cap box fades out (dunes, hero only).
  // Static numerals use natural advances; counters pass o.tab (fixed cells: digit .62 em, comma/period .28 em) and o.relax
  // (0..1, cells relax to natural advances over 0.15 s on landing). '$' is full size + a thin space; '%' at .62 size.
  const CAP = 0.727;
  function glyph(ch, gs, size, w, fade) {
    const k = ["g", ch, gs, size, w, fade ? 1 : 0].join("|");
    if (SPR[k]) return SPR[k];
    if (!glyph._c) glyph._c = U.mk(8, 8);
    glyph._c.x.font = `${w} ${gs}px ${LAT}`;
    const m = glyph._c.x.measureText(ch).width;
    const pw = Math.ceil(m + gs * 0.2) + 4, ph = Math.ceil(size * 1.25) + 4, base = Math.ceil(size * 1.02);
    const c = U.mk(pw, ph);
    c.x.font = `${w} ${gs}px ${LAT}`; c.x.textBaseline = "alphabetic"; c.x.textAlign = "left"; c.x.fillStyle = WHITE;
    c.x.fillText(ch, 2, base);
    c.x.globalCompositeOperation = "source-in";
    const top = base - CAP * size, g = c.x.createLinearGradient(0, top, 0, base);
    g.addColorStop(0, "#F0F0F1"); g.addColorStop(0.5, "#B4B5B9"); g.addColorStop(1, "#4C4E54"); // page 8 ramp, one step brighter
    c.x.fillStyle = g; c.x.fillRect(0, 0, pw, ph);
    if (fade) {
      c.x.globalCompositeOperation = "destination-out";
      const f = c.x.createLinearGradient(0, top + 0.72 * CAP * size, 0, base + size * 0.05);
      f.addColorStop(0, "rgba(0,0,0,0)"); f.addColorStop(1, "rgba(0,0,0,1)");
      c.x.fillStyle = f; c.x.fillRect(0, 0, pw, ph);
    }
    c.x.globalCompositeOperation = "source-over";
    return (SPR[k] = { c, pw, ph, base, m });
  }
  glyph._c = null;
  function cellOf(ch, size, w) {
    if (ch >= "0" && ch <= "9") return { gs: size, cw: 0.62 * size, tab: true };
    if (ch === "," || ch === ".") return { gs: size, cw: 0.28 * size, tab: true };
    if (ch === "$") return { gs: size, cw: null, after: 0.2 * size };
    if (ch === "%") return { gs: 0.62 * size, cw: null, before: 0.04 * size };
    if (ch === " ") return { gs: size, cw: 0.28 * size, skip: true };
    return { gs: size, cw: null };
  }
  // metal(): string s at anchor X (o.align left|center|right), baseline Y. o: w (200), fade, a, sheen (0..1), plus
  // (append a RED "+"), color glyphs other than digits are drawn the same way.
  function metalLayout(s, size, w, tab = false, relax = 0) {
    if (!glyph._c) glyph._c = U.mk(8, 8);
    const out = []; let xx = 0;
    for (const ch of s) {
      const c = cellOf(ch, size, w);
      if (c.before) xx += c.before;
      glyph._c.x.font = `${w} ${c.gs}px ${LAT}`;
      const gw = glyph._c.x.measureText(ch).width, cw = c.tab && tab ? lerp(c.cw, gw, e3(relax)) : c.cw && !c.tab ? c.cw : gw;
      if (!c.skip) out.push({ ch, gs: c.gs, x: xx + (cw - gw) / 2 });
      xx += cw + (c.after ?? 0);
    }
    return { glyphs: out, width: xx };
  }
  function metalWidth(s, size, w = 200, tab = false) { return metalLayout(s, size, w, tab).width; }
  function metal(x, s, X, Y, size, o = {}) {
    const w = o.w ?? 200, L = metalLayout(s, size, w, !!o.tab, o.relax ?? 0), a = o.a ?? 1;
    if (a <= 0.003) return L.width;
    const x0 = o.align === "right" ? X - L.width : o.align === "center" ? X - L.width / 2 : X;
    const paint = (c) => {
      for (const gq of L.glyphs) {
        const sp = glyph(gq.ch, gq.gs, size, w, !!o.fade);
        c.drawImage(sp.c, x0 + gq.x - 2, Y - sp.base, sp.pw, sp.ph);
      }
    };
    x.save(); x.globalAlpha *= a;
    if (o.sheen > 0 && o.sheen < 1) withSheen(x, x0 - 4, Y - size * 1.02, L.width + 8, size * 1.25, o.sheen, paint);
    else paint(x);
    x.restore();
    return L.width;
  }
  // money string: fmtMoney(5000) -> "$5,000" (metal() adds the thin space after a full-size "$")
  const fmtMoney = (n) => "$" + Math.round(n).toLocaleString("en-US");

  // ------------------------------------------------------------------ two-tone headline (page 5), per-word reveal from the right
  // words: [[text, "w"|"g"], ...] in reading order, laid out RTL from the right edge X; baseline Y. Each word: clip +
  // 18 px rise, 0.42 s e4, 0.07 s stagger from t0. o: w (300), a (exit alpha), flag (true: the scene's one flag, h .35 em,
  // gap .5 em, top on the alef line; flagH overrides), gap
  function headline(x, words, X, Y, size, t, t0, o = {}) {
    if (t < t0) return 0;
    const wgt = o.w ?? 300, a = o.a ?? 1;
    let xx = X;
    if (o.flag) { // one flag per scene, on its main headline only: h .35 em (min 18), gap .5 em, top on the alef line
      const fh = o.flagH ?? Math.max(18, Math.round(size * 0.35));
      flag(x, X + size * 0.5, Y - size * 0.81, fh, { mirror: true, u: pr(t, t0, t0 + 0.22), a });
    }
    words.forEach(([s, c], i) => {
      const fam = isAr(s) ? AR : LAT, mw = measure(x, s, wgt, size, fam);
      const k = e4(pr(t, t0 + 0.05 + i * 0.07, t0 + 0.05 + i * 0.07 + 0.42));
      if (k > 0) {
        x.save(); x.beginPath(); x.rect(xx - mw - 0.45 * size, Y - size * 1.25, mw + 0.9 * size, size * 1.95); x.clip(); // wide margin: final ي/ح swashes and dots overhang the advance (dots reach .55 em below the baseline)
        T(x, s, xx - mw, Y + (1 - k) * 18, { w: wgt, size, fam, ltr: true, align: "left", color: c === "g" ? GREY : WHITE, a: a * k });
        x.restore();
      }
      xx -= mw + (o.gap ?? size * 0.28);
    });
    return X - xx;
  }

  // ------------------------------------------------------------------ candlesticks (page 7)
  // deterministic series in 0..1 price units: [{o, c, h, l}]
  const SER = {};
  function series(seed, n, trend = 0.5, vol = 0.08, start = 0.3) {
    const k = [seed, n, trend, vol, start].join(":");
    if (SER[k]) return SER[k];
    const out = []; let p = start;
    for (let i = 0; i < n; i++) {
      const o = p, c = cl(o + (hash(seed, i, 1) - 0.5 + trend * 0.35) * vol * 2, 0.03, 0.97);
      const hi = Math.max(o, c) + hash(seed, i, 2) * vol * 0.8, lo = Math.min(o, c) - hash(seed, i, 3) * vol * 0.8;
      out.push({ o, c, h: Math.min(1, hi), l: Math.max(0, lo) }); p = c;
    }
    return (SER[k] = out);
  }
  // one candle at centre cx; prices already mapped to y (yO, yC, yH, yL); bw body width. o: grow (0..1, open -> close
  // 0.22 s e4 then the wick), newest (brighter up body), a, colors: up #8A898A / newest #E6E7E9 / down RED (page 7); wicks
  // white for up, DIM for down
  function candle(x, cx, yO, yC, yH, yL, bw, o = {}) {
    const g = o.grow ?? 1; if (g <= 0) return;
    const up = yC <= yO, gb = e4(pr(g, 0, 0.73)), gw = e4(pr(g, 0.27, 1));
    const mid = (yO + yC) / 2, top = Math.min(yO, yC), bot = Math.max(yO, yC);
    x.save(); x.globalAlpha *= o.a ?? 1;
    if (gw > 0) {
      x.fillStyle = up ? "rgba(255,255,255,0.85)" : DIM;
      const wt = lerp(top, yH, gw), wb = lerp(bot, yL, gw), ww = up ? 1.5 : 2;
      x.fillRect(cx - ww / 2, wt, ww, Math.max(0, top - wt)); x.fillRect(cx - ww / 2, bot, ww, Math.max(0, wb - bot));
    }
    const t2 = lerp(mid, top, gb), b2 = lerp(mid, bot, gb);
    x.fillStyle = up ? (o.newest ? UPC2 : o.upColor || UPC) : RED;
    rr(x, cx - bw / 2, t2, bw, Math.max(2, b2 - t2), Math.min(2, bw / 6)); x.fill();
    x.restore();
  }
  // chart(): draws a slice of a series into a box. o: data, from (first index, may be fractional for scrolling), n
  // (slots), pitch, body, lo, hi (price range; auto from the visible slice), grow(i) -> 0..1 per candle (default 1),
  // newest (index highlighted), a. Returns { yOf, xOf, lastY }.
  function chart(x, X, Y, w, h, o) {
    const D = o.data, from = o.from ?? 0, n = o.n ?? Math.floor(w / (o.pitch ?? 30)), pitch = o.pitch ?? w / n, bw = o.body ?? pitch * 0.55;
    const i0 = Math.floor(from), fr = from - i0;
    let lo = o.lo, hi = o.hi;
    if (lo == null || hi == null) {
      lo = 1; hi = 0;
      for (let i = i0; i < Math.min(D.length, i0 + n + 1); i++) { lo = Math.min(lo, D[i].l); hi = Math.max(hi, D[i].h); }
      const pad = (hi - lo) * 0.12; lo -= pad; hi += pad;
    }
    const yOf = (p) => Y + h - ((p - lo) / (hi - lo || 1)) * h;
    const xOf = (i) => X + (i - from + 0.5) * pitch;
    let lastY = null;
    x.save(); x.beginPath(); x.rect(X, Y - 40, w, h + 80); x.clip();
    for (let i = i0; i < Math.min(D.length, i0 + n + 2); i++) {
      const q = D[i], cx = xOf(i); if (cx < X - pitch || cx > X + w + pitch) continue;
      const g = o.grow ? o.grow(i) : 1; if (g <= 0) continue;
      candle(x, cx, yOf(q.o), yOf(q.c), yOf(q.h), yOf(q.l), bw, { grow: g, newest: i === o.newest, a: o.a });
      lastY = yOf(q.c);
    }
    x.restore();
    return { yOf, xOf, lastY, lo, hi };
  }

  // ------------------------------------------------------------------ candle bokeh (pages 3/7): two cached layers blurred once
  // (far 24 px / alpha .30, near 10 px / alpha .45), 70 % white, 10 % grey, 20 % red, on a rising diagonal; drifting
  // left 12 and 30 px/s. o: y (top of the 700 px band), a
  function bokehLayer(k, blur, seed) {
    if (SPR[k]) return SPR[k];
    const bw = 2600, bh = 700, c = (SPR[k] = U.mk(bw, bh));
    c.x.filter = `blur(${blur}px)`;
    for (let i = 0; i < 58; i++) {
      const r = hash(seed, i, 1), X = 30 + i * 45 + hash(seed, i, 2) * 12, base = 560 - i * 6.5 + (hash(seed, i, 3) - 0.5) * 120;
      const hb = 30 + hash(seed, i, 4) * 120, wb = blur > 15 ? 26 : 20;
      c.x.fillStyle = r < 0.2 ? "rgba(228,0,46,1)" : r < 0.3 ? "rgba(154,156,161,1)" : "rgba(236,237,240,1)";
      c.x.fillRect(X, base - hb, wb, hb);
      c.x.fillRect(X + wb / 2 - 2, base - hb - 40 * hash(seed, i, 5), 4, hb + 70 * hash(seed, i, 6));
    }
    c.x.filter = "none";
    return c;
  }
  function bokeh(x, t, a, o = {}) {
    if (a <= 0.003) return;
    const Y = o.y ?? 360;
    for (const [k, blur, al, sp, seed] of [["bkF", 24, 0.3, 12, 71], ["bkN", 10, 0.45, 30, 73]]) {
      const c = bokehLayer(k, blur, seed), off = ((t * sp) % 5200 + 5200) % 5200;
      x.save(); x.globalAlpha *= a * al;
      for (let j = 0; j < 3; j++) { // period 5200 = layer + its mirror image, so the tiling never jumps
        const X0 = j * 2600 - off; if (X0 > W || X0 + 2600 < 0) continue;
        if (j % 2 === 0) x.drawImage(c, X0, Y, 2600, 700);
        else { x.save(); x.translate(X0 + 2600, Y); x.scale(-1, 1); x.drawImage(c, 0, 0, 2600, 700); x.restore(); }
      }
      x.restore();
    }
  }

  // ------------------------------------------------------------------ symbol library (100-unit box, y down, centred)
  // white strokes 3.2 % of the drawn size (>= 2.5 px), round caps/joins, exactly one RED element each.
  // o: u (draw-on 0..1 via dash progress; red fills fade in over the last 12 %), a, k (state: rot / step / val / open /
  // join / flagU / drops / t), dim (draw in DIM grey without red, for inactive states)
  const SYM_EXT = {}; // name -> fn(x, cx, cy, size, o, H): symbols added by later kit files (15_kit2.js), drawn in sym()'s box with its helpers H
  function sym(x, name, cx, cy, size, o = {}) {
    const u = o.u ?? 1, a = o.a ?? 1; if (u <= 0 || a <= 0.003) return;
    if (x.globalAlpha * a < 0.995 && !o._layer) { // fading: draw at full opacity into a layer, then apply the alpha once,
      // so overlapping parts (the coins behind the top coin, crossing strokes) never show through each other
      const w = Math.ceil(size * 2.6), c = tmp("symL" + w, w, w);
      c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalAlpha = 1; c.x.globalCompositeOperation = "source-over"; c.x.filter = "none";
      c.x.clearRect(0, 0, w, w);
      sym(c.x, name, w / 2, w / 2, size, { ...o, a: 1, _layer: true });
      x.save(); x.globalAlpha *= a; x.drawImage(c, cx - w / 2, cy - w / 2); x.restore();
      return;
    }
    const k = size / 100, lwPx = Math.max(2.5, 0.032 * size);
    x.save(); x.globalAlpha *= a; x.translate(cx, cy); x.scale(k, k);
    const SW = o.dim ? DIM : o.color || WHITE, RD = o.dim ? DIM : RED;
    x.strokeStyle = SW; x.fillStyle = SW; x.lineWidth = lwPx / k; x.lineCap = "round"; x.lineJoin = "round";
    if (u < 1) x.setLineDash([600 * e2(u), 600]);
    const ra = pr(u, 0.88, 1); // red fill alpha
    const dash = (len) => { if (u < 1) x.setLineDash([len * e2(u), len + 1]); }; // per-subpath draw-on
    const L = (pts, close) => {
      let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (close) len += Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]);
      dash(len); x.beginPath(); pts.forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]))); if (close) x.closePath(); x.stroke();
    };
    const Cc = (X, Y, r, a0 = 0, a1 = Math.PI * 2) => { dash(r * Math.abs(a1 - a0)); x.beginPath(); x.arc(X, Y, r, a0, a1); x.stroke(); };
    const redFill = (fn) => { x.save(); x.setLineDash([]); x.globalAlpha *= ra; x.fillStyle = RD; fn(); x.fill(); x.restore(); };
    const redStroke = (fn) => { x.save(); x.strokeStyle = RD; fn(); x.stroke(); x.restore(); };
    const st = o.k ?? {};
    switch (name) {
      case "candles":
        L([[-26, -20], [-26, 34]]); x.strokeRect(-34, -8, 16, 30);
        L([[0, -38], [0, 18]]); redFill(() => { x.beginPath(); x.rect(-8, -26, 16, 32); });
        L([[26, -46], [26, 10]]); x.strokeRect(18, -36, 16, 34);
        break;
      case "vault": {
        Cc(0, 0, 44); Cc(0, 0, 28);
        const rot = st.rot ?? 0;
        for (let i = 0; i < 6; i++) { const an = rot + (i * Math.PI) / 3; L([[Math.cos(an) * 10, Math.sin(an) * 10], [Math.cos(an) * 26, Math.sin(an) * 26]]); }
        L([[-30, 46], [-18, 46]]); L([[18, 46], [30, 46]]);
        redFill(() => { x.beginPath(); x.arc(0, 0, 8 * (st.pulse ? 1 + 0.3 * Math.sin(Math.PI * cl(st.pulse)) : 1), 0, Math.PI * 2); });
        break;
      }
      case "cardplus":
        chamferPath(x, -40, -27, 80, 54, 14, 6); x.stroke(); L([[-28, -4], [-6, -4]]);
        redStroke(() => { x.lineWidth = 5; x.beginPath(); x.moveTo(18, -20); x.lineTo(38, -20); x.moveTo(28, -30); x.lineTo(28, -10); });
        break;
      case "stair": {
        L([[48, 44], [48, 30], [32, 30], [32, 16], [16, 16], [16, 2], [0, 2], [0, -12], [-16, -12], [-16, -26], [-32, -26], [-32, -40], [-48, -40]]);
        const s = cl(Math.round(st.step ?? 1), 1, 6), lx = 40 - (s - 1) * 16, ly = 30 - (s - 1) * 14;
        x.save(); x.setLineDash([]); x.lineWidth = 2.5 / k; L([[lx, ly], [lx, ly - 16]]); x.restore();
        redFill(() => { x.beginPath(); x.moveTo(lx, ly - 16); x.lineTo(lx + 9, ly - 16); x.lineTo(lx + 9, ly - 12); x.lineTo(lx + 1, ly - 8); x.lineTo(lx, ly - 8); x.closePath(); });
        break;
      }
      case "gauge": {
        Cc(0, 18, 40, Math.PI, Math.PI * 2);
        for (let i = 0; i <= 8; i++) { const an = Math.PI + (i * Math.PI) / 8; L([[Math.cos(an) * 46, 18 + Math.sin(an) * 46], [Math.cos(an) * 52, 18 + Math.sin(an) * 52]]); }
        const vv = st.val ?? 0.5;
        if (vv > 0) redStroke(() => { x.setLineDash([]); x.globalAlpha *= Math.max(ra, u >= 1 ? 1 : 0); x.lineWidth = (lwPx / k) * 2.2; x.beginPath(); x.arc(0, 18, 40, Math.PI, Math.PI + Math.PI * vv); });
        break;
      }
      case "coins": {
        const dr = st.drops || [1, 1, 1];
        [26, 12, -2].forEach((yy, i) => {
          const q = dr[i] ?? 1; if (q <= 0) return;
          const off = -60 * (1 - in2(cl(q / 0.85))) + (q > 0.85 ? -4 * Math.sin(Math.PI * pr(q, 0.85, 1)) : 0);
          x.save(); x.translate(0, off); x.globalAlpha *= cl(q * 3);
          // solid coin body (opaque PANEL) so each coin hides the back arcs of the coins under it
          x.save(); x.setLineDash([]); x.fillStyle = o.fill || "#131417"; x.beginPath(); x.ellipse(0, yy + 8, 30, 9, 0, 0, Math.PI);
          x.lineTo(-30, yy); x.ellipse(0, yy, 30, 9, 0, Math.PI, Math.PI * 2); x.closePath(); x.fill(); x.restore();
          x.beginPath(); x.ellipse(0, yy, 30, 9, 0, 0, Math.PI * 2);
          if (i === 2) { x.save(); x.strokeStyle = RD; x.stroke(); x.restore(); } else x.stroke();
          L([[-30, yy], [-30, yy + 8]]); L([[30, yy], [30, yy + 8]]);
          x.beginPath(); x.ellipse(0, yy + 8, 30, 9, 0, 0, Math.PI); x.stroke();
          x.restore();
        });
        break;
      }
      case "sprout": {
        const g = st.grow ?? u; x.setLineDash([]);
        const g1 = pr(g, 0, 0.25), g2 = pr(g, 0.25, 0.6), g3 = pr(g, 0.6, 0.8), g4 = pr(g, 0.8, 1);
        if (g1 > 0) L([[-40 * e3(g1), 38], [40 * e3(g1), 38]]);
        if (g2 > 0) { x.save(); x.beginPath(); x.rect(-20, 38 - 44 * e3(g2), 40, 46); x.clip(); x.beginPath(); x.moveTo(0, 38); x.quadraticCurveTo(6, 16, 0, -4); x.stroke(); x.restore(); }
        if (g3 > 0) { x.save(); x.translate(0, 6); x.scale(e3(g3), e3(g3)); x.translate(0, -6); x.beginPath(); x.moveTo(0, 6); x.quadraticCurveTo(-26, 4, -32, -18); x.quadraticCurveTo(-10, -14, 0, 6); x.stroke(); x.restore(); }
        if (g4 > 0) { x.save(); x.translate(0, -4); x.scale(back(g4, 1.2), back(g4, 1.2)); x.translate(0, 4); x.fillStyle = RD; x.beginPath(); x.moveTo(0, -4); x.quadraticCurveTo(24, -8, 30, -32); x.quadraticCurveTo(8, -28, 0, -4); x.fill(); x.restore(); }
        break;
      }
      case "dome": {
        L([[-46, 40], [46, 40]]); Cc(0, 40, 42, Math.PI, Math.PI * 2);
        const g = st.grow ?? 1;
        if (g > 0) {
          x.save(); x.setLineDash([]);
          x.beginPath(); x.rect(-30, 40 - 40 * e3(pr(g, 0, 0.5)), 60, 42); x.clip();
          L([[0, 40], [0, 4]]);
          x.beginPath(); x.moveTo(0, 24); x.quadraticCurveTo(-14, 22, -18, 12); x.quadraticCurveTo(-6, 14, 0, 24); x.stroke();
          x.beginPath(); x.moveTo(0, 16); x.quadraticCurveTo(14, 14, 18, 4); x.quadraticCurveTo(6, 6, 0, 16); x.stroke();
          x.restore();
          if (g > 0.7) { x.save(); x.setLineDash([]); x.globalAlpha *= e3(pr(g, 0.7, 1)); x.fillStyle = RD; x.beginPath(); x.moveTo(0, 17); x.quadraticCurveTo(-7, 10, 0, 5); x.quadraticCurveTo(7, 10, 0, 17); x.fill(); x.restore(); } // bud stays inside the dome, clear of its stroke at small sizes (apex y -2)
        }
        break;
      }
      case "chev": { // Acceleration: the brand ▲▲▲ (three separated red triangles, gap .4 of their height) rising, plus two
        // white speed dashes falling beside the stack (off-axis, so it never reads as a tree); 0.5 s loop
        x.setLineDash([]);
        const lt = st.t ?? 0, ig = st.ignite ?? 1;
        for (let i = 0; i < 3; i++) {
          const kk = pr(ig, i * 0.2, i * 0.2 + 0.4); if (kk <= 0) continue;
          const yy = 31 - i * 31, sc = back(kk, 1.4);
          x.save(); x.translate(0, yy); x.scale(sc, sc);
          x.fillStyle = RD; x.globalAlpha *= cl(kk * 2) * (0.6 + 0.4 * (0.5 + 0.5 * Math.sin(lt * 2 * Math.PI / 0.6 - i * 1.2)));
          x.beginPath(); x.moveTo(0, -11); x.lineTo(22, 11); x.lineTo(-22, 11); x.closePath(); x.lineWidth = 4; x.strokeStyle = RD; x.fill(); x.stroke();
          x.restore();
        }
        if (ig >= 1) for (let j = 0; j < 2; j++) {
          const ph = ((lt / 0.5 + j / 2) % 1), xx = j ? 36 : -36, len = 9 + 4 * hash(j, 3, 9);
          x.save(); x.globalAlpha *= (1 - ph) * 0.9; L([[xx, 6 + ph * 26], [xx, 6 + ph * 26 + len]]); x.restore();
        }
        break;
      }
      case "bars": {
        const hs = [22, 34, 48, 66];
        [-40, -16, 8, 32].forEach((bx, i) => {
          const top = 40 - hs[i];
          L([[bx + 7, top - 6], [bx + 7, top]]);
          if (i === 3) redFill(() => { x.beginPath(); x.rect(bx, top, 14, hs[i]); }); else x.strokeRect(bx, top, 14, hs[i]);
        });
        break;
      }
      case "tag500": {
        x.setLineDash([]);
        x.save(); x.globalAlpha *= cl(u * 1.5); tagPath(x, -46, -22, 92, 44); x.fillStyle = RD; x.fill(); x.restore();
        x.save(); x.globalAlpha *= cl(u * 1.5); x.font = `600 28px ${LAT}`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = o.dim ? INK : WHITE; inkText(x, "500", 0, 2); x.restore();
        break;
      }
      case "summit": {
        L([[-48, 40], [-20, -2], [-8, 10], [12, -28], [48, 40]]); L([[12, -28], [12, -52]]);
        const f = st.flagU ?? 1;
        if (f > 0) { const fy = lerp(-30, -52, e4(f)); x.save(); x.setLineDash([]); x.fillStyle = RD; x.beginPath(); x.moveTo(12, fy); x.lineTo(26, fy); x.lineTo(26, fy + 6); x.lineTo(14, fy + 13); x.lineTo(12, fy + 13); x.closePath(); x.fill(); x.restore(); }
        break;
      }
      case "padlock": {
        const op = st.open ?? 0, ly = -10 * op;
        x.beginPath(); x.roundRect(-30, -4, 60, 46, 8); x.stroke();
        x.beginPath(); x.moveTo(-18, -4 + ly); x.lineTo(-18, -20 + ly); x.arc(0, -20 + ly, 18, Math.PI, Math.PI * 2); x.lineTo(18, -4 + ly * (op > 0 ? 1 : 1)); x.stroke();
        redFill(() => { x.beginPath(); x.arc(0, 14, 6, 0, Math.PI * 2); x.rect(-2.5, 14, 5, 14); });
        break;
      }
      case "chain": {
        const j = st.join ?? 1, d = 20 * (1 - e3(j));
        x.save(); x.translate(-14 - d, 6); x.rotate((-30 * Math.PI) / 180); x.beginPath(); x.roundRect(-26, -13, 52, 26, 13); x.stroke(); x.restore();
        x.save(); x.translate(14 + d, -6); x.rotate((-30 * Math.PI) / 180); x.strokeStyle = RD; x.beginPath(); x.roundRect(-26, -13, 52, 26, 13); x.stroke(); x.restore();
        break;
      }
      case "copy":
        chamferPath(x, -33, -10, 50, 36, 10, 5); x.stroke();
        redStroke(() => { chamferPath(x, -17, -26, 50, 36, 10, 5); });
        break;
      case "shield":
        x.beginPath(); x.moveTo(-34, -40); x.lineTo(22, -40); x.lineTo(34, -28); x.lineTo(34, 4); x.quadraticCurveTo(34, 30, 0, 46); x.quadraticCurveTo(-34, 30, -34, 4); x.closePath(); x.stroke();
        redStroke(() => { x.setLineDash([6, 5]); x.beginPath(); x.moveTo(-24, 0); x.lineTo(24, 0); });
        break;
      case "check":
        L([[-30, 2], [-8, 24], [32, -22]]);
        break;
      case "plus":
        L([[-30, 0], [30, 0]]); L([[0, -30], [0, 30]]);
        break;
      case "phone":
        x.beginPath(); x.roundRect(-27, -46, 54, 92, 11); x.stroke(); L([[-8, -36], [8, -36]]);
        redFill(() => { x.beginPath(); x.arc(0, 32, 5, 0, Math.PI * 2); });
        break;
      default:
        if (SYM_EXT[name]) SYM_EXT[name](x, cx, cy, size, o, { u, k, lwPx, SW, RD, ra, dash, L, Cc, redFill, redStroke, st });
    }
    x.restore();
  }
  // pointer cursor, absolute px (34 px tall), tip at X, Y; white fill with a 1.5 px INK outline
  function cursor(x, X, Y, a = 1) {
    if (a <= 0.003) return;
    x.save(); x.globalAlpha *= a; x.translate(X, Y);
    x.beginPath(); [[0, 0], [0, 34], [9, 26], [15, 39], [21, 36], [15, 24], [26, 24]].forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])));
    x.closePath(); x.fillStyle = WHITE; x.fill(); x.lineWidth = 1.5; x.strokeStyle = INK; x.stroke(); x.restore();
  }
  // small helpers for groups
  const STAGES = [
    { n: "01", en: "Seed", ar: "المرحلة الأولى", amt: 5000, sym: "sprout" },
    { n: "02", en: "Incubation", ar: "المرحلة الثانية", amt: 20000, sym: "dome" },
    { n: "03", en: "Acceleration", ar: "المرحلة الثالثة", amt: 100000, sym: "chev" },
    { n: "04", en: "Pro", ar: "المرحلة الرابعة", amt: 200000, sym: "bars" },
    { n: "05", en: "Pro 500", ar: "المرحلة الخامسة", amt: 500000, sym: "tag500" },
    { n: "06", en: "Pro M", ar: "المرحلة الأخيرة", amt: 1000000, sym: "summit" },
  ];

  // ================================================================== KIT 2: video 2 additions (spec ep2 mg_ep2_final.json kit_additions)
  // K1-K4 sym() names tickets / target / calendar / withdraw (registered in SYM_EXT, drawn in sym()'s own 100-unit box with
  // its stroke, dash and DIM conventions; plus the pips' private variant "k2_shield") | K6 donut | K7 pips | K8 metalCount |
  // K9 tradeChip | K10 skeleton | K12 brScene + ss (W1 34_broll.js world) | K13 comet + comet.passTimes (+ comet.quad).
  // K5 is withdrawn; K11 lives in 90_main.
  // Public names are the spec's; private helpers carry the k2_ prefix. Reference: work/kit2_api.md.
  const k2_SPR = {};
  const k2_TAU = Math.PI * 2;

  // ------------------------------------------------------------------ shared private helpers
  // the TAG polygon as points (tagPath's six corners), for dash lengths and clip unions
  const k2_tagPts = (X, Y, w, h) => [[X + 0.355 * h, Y], [X + w, Y], [X + w, Y + 0.57 * h], [X + w - 0.35 * h, Y + h], [X, Y + h], [X, Y + 0.43 * h]];
  // a symbol's red element: red (or, with o.mono, the stroke colour) fading in over the last 12 % of u, like sym's redFill
  function k2_red(x, o, H, fn) { x.save(); x.setLineDash([]); x.globalAlpha *= H.ra; x.fillStyle = o.mono ? H.SW : H.RD; fn(); x.fill(); x.restore(); }
  // offscreen layer in DEVICE space for a local rect under the current transform (crisp under scale, no full-frame buffer):
  // draw(c) paints in the caller's coordinates; the result lands once at alpha a. Sizes snap to 64 px and the scratch
  // canvas only ever grows (only the used sub-rect is cleared and blitted), so a moving or resizing layer never
  // reallocates.
  function k2_buf(name, w, h) {
    let c = k2_SPR[name];
    if (!c || c.width < w || c.height < h) c = k2_SPR[name] = U.mk(Math.max(w, c ? c.width : 0), Math.max(h, c ? c.height : 0));
    return c;
  }
  function k2_layer(x, X, Y, w, h, a, draw, name = "k2_L") {
    const M = x.getTransform();
    const px = [X, X + w, X, X + w], py = [Y, Y, Y + h, Y + h];
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let i = 0; i < 4; i++) {
      const dx = M.a * px[i] + M.c * py[i] + M.e, dy = M.b * px[i] + M.d * py[i] + M.f;
      x0 = Math.min(x0, dx); x1 = Math.max(x1, dx); y0 = Math.min(y0, dy); y1 = Math.max(y1, dy);
    }
    x0 = Math.floor(x0) - 2; y0 = Math.floor(y0) - 2;
    const cw = Math.ceil((Math.ceil(x1) + 2 - x0) / 64) * 64, ch = Math.ceil((Math.ceil(y1) + 2 - y0) / 64) * 64;
    if (cw <= 0 || ch <= 0 || cw > 4096 || ch > 4096) return;
    const c = k2_buf("buf_" + name, cw, ch);
    c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalAlpha = 1; c.x.globalCompositeOperation = "source-over"; c.x.filter = "none";
    c.x.clearRect(0, 0, cw, ch);
    c.x.save(); c.x.beginPath(); c.x.rect(0, 0, cw, ch); c.x.clip(); // nothing lands outside the sub-rect
    c.x.setTransform(M.a, M.b, M.c, M.d, M.e - x0, M.f - y0);
    draw(c.x);
    c.x.restore(); c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalCompositeOperation = "source-over";
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha *= a; x.drawImage(c, 0, 0, cw, ch, x0, y0, cw, ch); x.restore();
  }

  // ================================================================== K1-K4: new sym() names (100-unit box, y down)
  // Each receives sym()'s state: H = { u, k, lwPx, SW, RD, ra, dash, L, Cc, redFill, redStroke, st }, the context already
  // translated/scaled to the box, white (or DIM) round-capped strokes of 3.2 % (>= 2.5 px) and the draw-on dash set.
  // Extra option for these four: o.mono (the red element takes the stroke colour; pips' DONE state).
  // K1 TICKETS (40 trades): three TAG plates 58 x 28 back to front, each stroked by dash progress (closed-polygon
  // perimeter). The strokes behind a plate are hidden by CLIPPING each plate's outline out of the plates in front of it,
  // not by an opaque fill, so the plates stay as transparent as the pip under them (pure #000 in A's DIM pips, the .7
  // fill of DONE). The stack is the spec's moved +3 / +6 units, so its ink is centred in the box (x -43..43, y -30..30;
  // the spec's x -46..40, y -36..24 sat 3 px high and 1-2 px left in a 44 px pip). RED dot in the front ticket (the one
  // red element) at (25, 16): 7 units left of the spec's spot (29, 10) before the same shift, r 5 but never under 1.9 px
  // (at the spec's spot and the 30 px pip size it was a 1.5 px dot touching the front plate's stroke).
  const k2_TK = [[-43, -30], [-29, -14], [-15, 2]];
  SYM_EXT.tickets = (x, cx, cy, size, o, H) => {
    k2_TK.forEach(([X, Y], j) => {
      x.save();
      for (const [X2, Y2] of k2_TK.slice(j + 1)) { // the box minus each plate in front (even-odd)
        x.beginPath(); x.rect(-60, -60, 120, 120);
        k2_tagPts(X2, Y2, 58, 28).forEach(([px, py], i) => (i ? x.lineTo(px, py) : x.moveTo(px, py))); x.closePath();
        x.clip("evenodd");
      }
      H.L(k2_tagPts(X, Y, 58, 28), true);
      x.restore();
    });
    k2_red(x, o, H, () => { x.beginPath(); x.arc(25, 16, Math.max(5, 1.9 / H.k), 0, k2_TAU); });
  };
  // K2 TARGET (profit target +7%): dashed target line (fades in, e2(u)), a rising polyline drawn on by dash progress that
  // ends ON the RED dot r 7 sitting on the line. The dashes use butt caps so they stay dashes at pip sizes.
  SYM_EXT.target = (x, cx, cy, size, o, H) => {
    x.save(); x.setLineDash([7, 6]); x.lineCap = "butt"; x.globalAlpha *= e2(H.u);
    x.beginPath(); x.moveTo(-46, -30); x.lineTo(46, -30); x.stroke(); x.restore();
    H.L([[-46, 36], [-22, 14], [-6, 22], [16, -4], [32, -30]]);
    k2_red(x, o, H, () => { x.beginPath(); x.arc(32, -30, 7, 0, k2_TAU); });
  };
  // K3 CALENDAR (60 days), state k.fill 0..1 (default 1): body, header line and binder rings drawn on per subpath; 8 day
  // cells 12 x 12 filled right to left, top row then bottom row; cell i pops by p_i = cl(8 fill - (i - 1)) (scale .6 -> 1,
  // alpha e3); cells 1-7 white .9, cell 8 (bottom-left) RED. Unfilled cells: a 1.5 px outline at .35. Fills fade in over
  // the last 12 % of u (sym's fill convention). Columns: the spec's x -30 / -12 / 6 / 24 shifted -3 units so the grid sits
  // centred in the body (margins 7 / 7 instead of 10 / 4; visible at 110 px). Cell 8 is RED at alpha 1; when it is not
  // red (o.dim: DIM; o.mono: DONE's white) it takes the other cells' .9, so the DIM and DONE grids read as one even grid.
  const k2_CAL_X = [21, 3, -15, -33], k2_CAL_Y = [-2, 16];
  SYM_EXT.calendar = (x, cx, cy, size, o, H) => {
    const fill = cl(H.st.fill ?? 1);
    H.dash(2 * (80 + 72) - 8 * 8 + k2_TAU * 8);
    x.beginPath(); x.roundRect(-40, -32, 80, 72, 8); x.stroke();
    H.L([[-40, -12], [40, -12]]); H.L([[-20, -42], [-20, -24]]); H.L([[20, -42], [20, -24]]);
    for (let i = 1; i <= 8; i++) {
      const X = k2_CAL_X[(i - 1) % 4], Y = k2_CAL_Y[i > 4 ? 1 : 0], p = cl(8 * fill - (i - 1)), q = e3(p);
      if (q < 1) { // the empty cell, fading out as the cell pops
        x.save(); x.globalAlpha *= 0.35 * (1 - q); x.lineWidth = 1.5 / H.k; H.dash(48);
        x.beginPath(); x.rect(X, Y, 12, 12); x.stroke(); x.restore();
      }
      if (p > 0 && H.ra > 0) {
        const s = 0.6 + 0.4 * q, red = i === 8 && !o.mono && !o.dim;
        x.save(); x.setLineDash([]); x.globalAlpha *= H.ra * q * (red ? 1 : 0.9);
        x.fillStyle = red ? H.RD : H.SW;
        x.beginPath(); x.rect(X + 6 - 6 * s, Y + 6 - 6 * s, 12 * s, 12 * s); x.fill(); x.restore();
      }
    }
  };
  // K4 WITHDRAW (money out of the account): CARD outline (chamferPath, perimeter computed for the draw-on) and its chip
  // line; RED arrow (stroke x1.4, round caps) leaving the card downward.
  SYM_EXT.withdraw = (x, cx, cy, size, o, H) => {
    const w = 64, h = 44, c = 12, r = 6;
    H.dash(w - c - r + c * Math.SQRT2 + (h - c - r) + (w - 2 * r) + (h - 2 * r) + 1.5 * Math.PI * r);
    chamferPath(x, -38, -30, w, h, c, r); x.stroke();
    H.L([[-28, -10], [-8, -10]]);
    x.save(); x.strokeStyle = o.mono ? H.SW : H.RD; x.lineWidth *= 1.4; x.lineCap = "round"; x.lineJoin = "round";
    H.L([[12, 0], [12, 40]]); H.L([[2, 30], [12, 42], [22, 30]]);
    x.restore();
  };
  // pip 3 SHIELD (K7): video 1's shield outline with its limit line in butt-capped [7, 6] dashes like the target's (video
  // 1's round-capped [6, 5] closes into a solid line at 30-45 px), centred (offset .5), fading in with e2(u). A SYM_EXT key,
  // not a top-level name: groups keep sym("shield") for every other use.
  const k2_SHP = 56 + 12 * Math.SQRT2 + 32 + 2 * 57.27 + 44; // perimeter (the two quadratics 57.27 each)
  SYM_EXT.k2_shield = (x, cx, cy, size, o, H) => {
    H.dash(k2_SHP);
    x.beginPath(); x.moveTo(-34, -40); x.lineTo(22, -40); x.lineTo(34, -28); x.lineTo(34, 4);
    x.quadraticCurveTo(34, 30, 0, 46); x.quadraticCurveTo(-34, 30, -34, 4); x.closePath(); x.stroke();
    x.save(); x.strokeStyle = o.mono ? H.SW : H.RD; x.lineCap = "butt"; x.setLineDash([7, 6]); x.lineDashOffset = -0.5;
    x.globalAlpha *= e2(H.u); x.beginPath(); x.moveTo(-23.5, 0); x.lineTo(23.5, 0); x.stroke(); x.restore();
  };
  // a symbol drawn all in white (its red element too) at alpha a: the K1-K4 symbols take o.mono; video 1's symbols are
  // drawn into a small layer and recoloured source-in (none of the pip symbols has an opaque fill)
  function k2_symMono(x, name, cx, cy, size, a, o = {}) {
    if (SYM_EXT[name]) { sym(x, name, cx, cy, size, { ...o, mono: true, dim: false, color: WHITE, a }); return; }
    const w = Math.ceil(size * 2.6), c = tmp("k2_mono" + w, w, w);
    c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalAlpha = 1; c.x.globalCompositeOperation = "source-over"; c.x.clearRect(0, 0, w, w);
    sym(c.x, name, w / 2, w / 2, size, { ...o, a: 1, dim: false, color: WHITE });
    c.x.globalCompositeOperation = "source-in"; c.x.fillStyle = WHITE; c.x.fillRect(0, 0, w, w); c.x.globalCompositeOperation = "source-over";
    x.save(); x.globalAlpha *= a; x.drawImage(c, cx - w / 2, cy - w / 2); x.restore();
  }

  // ================================================================== K6 DONUT
  // track: full circle r, lineWidth w, o.restCol (TRACK), drawn clockwise from 12 o'clock over o.u; red arc (w + o.grow,
  // butt caps) from 12 o'clock clockwise to frac, or counter-clockwise with o.ccw; 2 px #000 radial separators at both
  // ends when 0 < frac < 1. The track is not drawn under the red arc (clean edges, clean fades). o.a alpha.
  // Returns { endAngle, midAngle, mid: [x, y] (red arc midpoint on radius r), gmid: [x, y] (the grey arc's midpoint) }.
  function donut(x, cx, cy, r, w, frac, o = {}) {
    const a = o.a ?? 1, u = cl(o.u ?? 1), f = cl(frac), A0 = -Math.PI / 2, s = o.ccw ? -1 : 1;
    const endAngle = A0 + s * k2_TAU * f, midAngle = A0 + s * Math.PI * f, cm = Math.cos(midAngle), sm = Math.sin(midAngle);
    const out = { endAngle, midAngle, mid: [cx + r * cm, cy + r * sm], gmid: [cx - r * cm, cy - r * sm] };
    if (a <= 0.003) return out;
    x.save(); x.globalAlpha *= a; x.setLineDash([]); x.lineCap = "butt";
    // track, minus the red arc's span (cw red covers [0, f] of the turn, ccw red covers [1 - f, 1])
    let t0 = 0, t1 = u;
    if (f > 0) { if (o.ccw) t1 = Math.min(u, 1 - f); else t0 = f; }
    if (t1 > t0) { x.strokeStyle = o.restCol || TRACK; x.lineWidth = w; x.beginPath(); x.arc(cx, cy, r, A0 + k2_TAU * t0, A0 + k2_TAU * t1); x.stroke(); }
    if (f > 0) {
      const lw = w + (o.grow || 0);
      x.strokeStyle = RED; x.lineWidth = lw; x.beginPath(); x.arc(cx, cy, r, A0, endAngle, !!o.ccw); x.stroke();
      if (f < 1) {
        const r0 = r - lw / 2 - 1, r1 = r + lw / 2 + 1;
        x.strokeStyle = "#000000"; x.lineWidth = 2; x.beginPath();
        for (const an of [A0, endAngle]) { const c = Math.cos(an), sn = Math.sin(an); x.moveTo(cx + c * r0, cy + sn * r0); x.lineTo(cx + c * r1, cy + sn * r1); }
        x.stroke();
      }
    }
    x.restore();
    return out;
  }

  // ================================================================== K7 PIPS: the four CONDITION PIPS
  // TAG plates right to left: pip i (0..3) at X = Xr - w - i pitch, size w x h; symbols tickets / target / shield / calendar
  // at 0.62h, centred. st[i] = { s: 'dim'|'lit'|'done', u (0..1 into s, from the previous state; default 1), pulse (0..1),
  // from (optional: the state u starts from; default dim -> lit -> done), k (symbol state, e.g. { fill } for calendar) }.
  //   dim: no fill, outline white .25, symbol DIM | lit: PANEL, RED rim 1.5 px, symbol white + red | done: fill .7, outline
  //   white .25, symbol white .8 (red element too), top-left cut RED + white tick (as tag() o.done = u).
  //   Transitions cross-fade on e3(u) (the caller runs u over 0.25 s); pulse = scale 1 + .08 sin(pi p) in any state.
  // o: a (group alpha; whenever a x the context's alpha is below 1 the row is drawn into one layer and faded as ONE
  // layer), shimmer (0..1: one white .12 band, 80 px, 20 deg, sweeping right to left, eio; A only; CLIPPED to the plates
  // rather than source-atop, which on DIM pips would only catch the .25 outlines and DIM strokes), enter (0..1 linear over
  // 0.64 s: each pip 0.40 s expo + 16 px rise, 0.08 s RTL stagger). Below 72 x 48 (the spec minimum) it warns once.
  // Pip 3 draws "k2_shield" (limit dashes that stay dashes at pip sizes), not video 1's "shield".
  // Returns the four boxes [{ X, Y, w, h, cx, cy }] (pip 1 first).
  const k2_PIPSYM = ["tickets", "target", "k2_shield", "calendar"];
  const k2_PST = { dim: { f: 0, w: 0.25, r: 0 }, lit: { f: 0.96, w: 0, r: 1 }, done: { f: 0.7, w: 0.25, r: 0 } };
  const k2_PREV = { dim: "dim", lit: "dim", done: "lit" };
  function k2_doneCut(x, X, Y, h, dn) { // tag()'s DONE cut + tick, with the alpha multiplied (tag() sets it absolutely)
    const q = 0.355 * h, kk = e3(pr(dn, 0.2, 1));
    x.save(); x.globalAlpha *= e3(dn); x.setLineDash([]);
    x.fillStyle = RED; x.beginPath(); x.moveTo(X, Y); x.lineTo(X + q, Y); x.lineTo(X, Y + 0.43 * h); x.closePath(); x.fill();
    x.strokeStyle = WHITE; x.lineWidth = 2; x.lineCap = "round"; x.lineJoin = "round";
    x.beginPath(); x.moveTo(X + q * 0.16, Y + q * 0.42);
    if (kk > 0) x.lineTo(X + q * 0.16 + q * 0.14 * cl(kk * 2), Y + q * 0.42 + q * 0.14 * cl(kk * 2));
    if (kk > 0.5) x.lineTo(X + q * 0.3 + q * 0.26 * cl(kk * 2 - 1), Y + q * 0.56 - q * 0.36 * cl(kk * 2 - 1));
    x.stroke(); x.restore();
  }
  function k2_pipSym(x, name, s, cx, cy, size, a, k) { // one state's symbol at alpha a
    if (a <= 0.003) return;
    if (s === "dim") sym(x, name, cx, cy, size, { dim: true, a, k });
    else if (s === "lit") sym(x, name, cx, cy, size, { a, k });
    else k2_symMono(x, name, cx, cy, size, 0.8 * a, { k });
  }
  function k2_pip(x, X, Y, w, h, name, p) {
    const s = k2_PST[p.s] ? p.s : "dim", from = k2_PST[p.from] ? p.from : k2_PREV[s], uu = cl(p.u ?? 1), k = from === s ? 1 : e3(uu);
    const A = k2_PST[from], B = k2_PST[s];
    const fillA = lerp(A.f, B.f, k), whiteA = lerp(A.w, B.w, k), redA = lerp(A.r, B.r, k);
    x.setLineDash([]);
    tagPath(x, X, Y, w, h);
    if (fillA > 0.003) { x.fillStyle = panelFill(x, Y, h, +fillA.toFixed(3)); x.fill(); }
    x.lineWidth = 1.5;
    if (whiteA > 0.003) { x.strokeStyle = `rgba(255,255,255,${whiteA.toFixed(3)})`; x.stroke(); }
    if (redA > 0.003) { x.strokeStyle = rgba(RED, redA.toFixed(3)); x.stroke(); }
    const dn = lerp(from === "done" ? 1 : 0, s === "done" ? 1 : 0, from === s ? 1 : uu);
    if (dn > 0) k2_doneCut(x, X, Y, h, dn);
    const cx = X + w / 2, cy = Y + h / 2, size = 0.62 * h;
    if (k >= 1) k2_pipSym(x, name, s, cx, cy, size, 1, p.k);
    else if (from === "dim" && s === "lit") { k2_pipSym(x, name, "dim", cx, cy, size, 1, p.k); k2_pipSym(x, name, "lit", cx, cy, size, k, p.k); }
    else if (from === "lit" && s === "done") { k2_symMono(x, name, cx, cy, size, lerp(1, 0.8, k), { k: p.k }); k2_pipSym(x, name, "lit", cx, cy, size, 1 - k, p.k); }
    else { k2_pipSym(x, name, from, cx, cy, size, 1 - k, p.k); k2_pipSym(x, name, s, cx, cy, size, k, p.k); }
  }
  const k2_WARN = {};
  function pips(x, Xr, Y, w, h, pitch, st = [], o = {}) {
    const a = o.a ?? 1, enter = o.enter ?? 1, sh = o.shimmer ?? 0, boxes = [];
    if ((w < 72 || h < 48) && !k2_WARN.pips) { k2_WARN.pips = 1; console.warn(`pips(): ${w}x${h} is below the 72x48 minimum (30 px symbols)`); }
    for (let i = 0; i < 4; i++) {
      const X = Xr - w - i * pitch, p = st[i] || {}, ki = expo(pr(enter, i * 0.125, i * 0.125 + 0.625));
      const sc = p.pulse > 0 && p.pulse < 1 ? 1 + 0.08 * Math.sin(Math.PI * p.pulse) : 1;
      boxes.push({ X, Y, w, h, cx: X + w / 2, cy: Y + h / 2, sc, dy: (1 - ki) * 16, ia: cl(ki * 1.25), p });
    }
    if (a <= 0.003) return boxes.map(({ X, Y, w, h, cx, cy }) => ({ X, Y, w, h, cx, cy }));
    const paint = (c) => {
      for (let i = 0; i < 4; i++) {
        const b = boxes[i]; if (b.ia <= 0.003) continue;
        c.save(); c.globalAlpha *= b.ia;
        c.translate(b.cx, b.cy + b.dy); if (b.sc !== 1) c.scale(b.sc, b.sc); c.translate(-b.cx, -b.cy);
        k2_pip(c, b.X, b.Y, w, h, k2_PIPSYM[i], b.p);
        c.restore();
      }
      if (sh > 0 && sh < 1) { // skeleton band over the plates (clipped to their union)
        c.save(); c.beginPath();
        for (const b of boxes) {
          if (b.ia <= 0.003) continue;
          k2_tagPts(b.X, b.Y, w, h).forEach(([px, py], j) => { const qx = b.cx + (px - b.cx) * b.sc, qy = b.cy + b.dy + (py - b.cy) * b.sc; j ? c.lineTo(qx, qy) : c.moveTo(qx, qy); });
          c.closePath();
        }
        c.clip();
        const x0 = Xr - w - 3 * pitch, sl = h * 0.364, span = Xr - x0 + 80 + sl, bx = Xr + 40 + sl / 2 - span * eio(sh);
        c.translate(bx, Y + h / 2); c.rotate((-20 * Math.PI) / 180);
        const g = c.createLinearGradient(-40, 0, 40, 0);
        g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, "rgba(255,255,255,0.12)"); g.addColorStop(1, "rgba(255,255,255,0)");
        c.fillStyle = g; c.fillRect(-40, -h * 1.5, 80, h * 3);
        c.restore();
      }
    };
    if (x.globalAlpha * a < 0.995) { // fading (o.a or the caller's alpha): plates, cuts, symbols and band as ONE layer
      const m = 0.06 * Math.max(w, h) + 6;
      k2_layer(x, Xr - w - 3 * pitch - m, Y - m, 3 * pitch + w + 2 * m, h + 2 * m + 16, a, paint, "k2_pipL");
    } else { x.save(); paint(x); x.restore(); }
    return boxes.map(({ X, Y, w, h, cx, cy }) => ({ X, Y, w, h, cx, cy }));
  }

  // ================================================================== K8 METALCOUNT: video 1's st_count, generalized
  // fin = the final string ('$1,000', '$10,000', '60', '40%'): a space after '$' is removed (metalLayout already adds
  // 0.2 em after it). It splits into a prefix (before the first digit), a body (digits and commas) and a suffix (after the
  // last digit). L = metalLayout(fin, size, w) (natural advances); the current body (Math.round(value), with commas if fin
  // has them) is drawn right-aligned into the final body's glyph slots, each glyph centred on its slot; prefix and suffix
  // sit at their final positions. As K8 specifies, once Math.round(value) reaches the final number it draws the static
  // numeral (metal(): natural advances), so the landed frame never moves. With value = final e4(pr(tv, t0, tLand)) a small
  // final ('40', '60') therefore lands a few frames before tLand and holds there; the count never stalls on final - 1.
  // o: w (200), align (left|center|right), a, fade (hero bottom 28 %), sheen (0..1, on the static numeral; drawn in a
  // device-space layer at the numeral's own pixel phase, so it is not resampled the way metal()'s withSheen box is: use
  // metalCount(x, final, s, ...) for any sheen on a metallic numeral), from (the landed string a count starts from, e.g.
  // '$1,000' -> '$2,000': up to from's number it draws metal(from); above it the prefix, slots and suffix glide from
  // from's layout to fin's with k = (value - fromN) / (final - fromN), so the first counting frame matches metal(from) and
  // the landing matches metal(fin)). Returns L.width (the final width).
  // Value curve (caller): value = final * e4(pr(tv, t0, tLand)), or fromN + (final - fromN) * e4(...) with o.from.
  const k2_noSp = (s) => String(s).replace(/\$\s+/g, () => "$");
  function k2_parts(s) { // the digit span of a metal string, indexed like metalLayout's glyphs (spaces skipped)
    const ch = [...s].filter((c) => c !== " ");
    let dI = -1, lI = -1;
    ch.forEach((c, i) => { if (c >= "0" && c <= "9") { if (dI < 0) dI = i; lI = i; } });
    if (dI < 0) return null;
    const body = ch.slice(dI, lI + 1).join("");
    return { dI, lI, nG: ch.length, body, n: parseInt(body.replace(/[^0-9]/g, ""), 10) };
  }
  // the static numeral, with an optional sheen (withSheen's 120 px, -20 deg band, white 0 -> .55 -> 0, eio), source-atop
  // inside a k2_layer: the numeral keeps its exact pixels from the first sheen frame to the last
  function k2_metalS(x, s, x0, Y, size, w, fd, a, sh) {
    if (!(sh > 0 && sh < 1)) { metal(x, s, x0, Y, size, { w, fade: fd, a }); return; }
    const bx0 = x0 - 4, by0 = Y - size * 1.02, bw = metalLayout(s, size, w, false, 0).width + 8, bh = size * 1.25;
    k2_layer(x, bx0 - 6, by0 - 6, bw + 12, bh + 12, a, (c) => {
      metal(c, s, x0, Y, size, { w, fade: fd });
      c.globalCompositeOperation = "source-atop";
      const span = bw + bh * 0.36 + 240, bx = bx0 - 120 + span * eio(sh) - bh * 0.18;
      c.save(); c.translate(bx, by0 + bh / 2); c.rotate((-20 * Math.PI) / 180);
      const g = c.createLinearGradient(-60, 0, 60, 0);
      g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, "rgba(255,255,255,0.55)"); g.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = g; c.fillRect(-60, -bh * 1.5, 120, bh * 3); c.restore();
      c.globalCompositeOperation = "source-over";
    }, "k2_mcS");
  }
  function metalCount(x, value, fin, X, Y, size, o = {}) {
    fin = k2_noSp(fin);
    const w = o.w ?? 200, fd = !!o.fade, a = o.a ?? 1, L = metalLayout(fin, size, w, false, 0);
    const ax = (Lw) => (o.align === "right" ? X - Lw : o.align === "center" ? X - Lw / 2 : X), x0 = ax(L.width);
    if (a <= 0.003) return L.width;
    const P = k2_parts(fin);
    const n = Math.max(0, Math.round(value) || 0);
    if (!P || n >= P.n) { k2_metalS(x, fin, x0, Y, size, w, fd, a, o.sheen); return L.width; }
    const body = (j) => j >= P.dI && j <= P.lI;
    // anchors: a body glyph's slot centre, a prefix / suffix glyph's left edge
    const anc = L.glyphs.map((g, j) => x0 + g.x + (body(j) ? glyph(g.ch, g.gs, size, w, fd).m / 2 : 0));
    if (o.from) {
      const from = k2_noSp(o.from), PF = k2_parts(from);
      if (PF && PF.n < P.n) {
        const LF = metalLayout(from, size, w, false, 0), xf = ax(LF.width);
        if (n <= PF.n) { k2_metalS(x, from, xf, Y, size, w, fd, a, o.sheen); return L.width; }
        const k = cl((value - PF.n) / (P.n - PF.n));
        const off = L.glyphs.map((g, j) => { // from's anchor minus fin's, for the matching glyph (null when none)
          const jf = j < P.dI ? (j < PF.dI ? j : -1) : body(j) ? PF.lI - (P.lI - j) : PF.lI + (j - P.lI);
          const ok = j < P.dI ? jf >= 0 : body(j) ? jf >= PF.dI : jf > PF.lI && jf < PF.nG;
          if (!ok) return null;
          const gf = LF.glyphs[jf];
          return xf + gf.x + (body(j) ? glyph(gf.ch, gf.gs, size, w, fd).m / 2 : 0) - anc[j];
        });
        for (let j = off.length - 2; j >= 0; j--) if (off[j] == null) off[j] = off[j + 1]; // unmatched: move with a neighbour
        for (let j = 1; j < off.length; j++) if (off[j] == null) off[j] = off[j - 1];
        off.forEach((d, j) => { anc[j] += (1 - k) * (d ?? 0); });
      }
    }
    const cur = P.body.includes(",") ? n.toLocaleString("en-US") : String(n);
    x.save(); x.globalAlpha *= a;
    const slots = [];
    L.glyphs.forEach((g, j) => {
      if (body(j)) { slots.push(anc[j]); return; }
      const sp = glyph(g.ch, g.gs, size, w, fd);
      x.drawImage(sp.c, anc[j] - 2, Y - sp.base, sp.pw, sp.ph); // prefix / suffix
    });
    for (let i = 1; i <= Math.min(cur.length, slots.length); i++) {
      const sp = glyph(cur[cur.length - i], size, size, w, fd);
      x.drawImage(sp.c, slots[slots.length - i] - sp.m / 2 - 2, Y - sp.base, sp.pw, sp.ph);
    }
    x.restore();
    return L.width;
  }

  // ================================================================== K9 TRADECHIP: the FIRST-TRADE chip (B-roll 1 and M)
  // TAG plate (PANEL + hairline); Arabic label A400 34 white right-aligned at X + w - 45, baseline Y + h/2 + 12; RED dot
  // r 6 at (X + w - 26, Y + h/2). o: ghost (no fill, dashed outline white .4 (6/5), label .4, dot white .4), pop (0..1:
  // the ghost TURNING SOLID, B-roll 1 15.59: 0 is the ghost, 1 the solid chip; in between the solid chip pops on
  // back(p, 1.4) about its centre (0 -> 1.07 at p .64 -> 1) at alpha cl(3p), over the ghost's dashed outline alone, which
  // fades at 1 - cl(3p): the ghost's label and dot go on the first pop frame, so the label is never drawn twice; pop
  // overrides ghost), ring (0..1: white 2 px ring r 12 -> 30 (e3), fading, at (o.ringX, o.ringY), default the chip
  // centre), a.
  function k2_chip(x, X, Y, w, h, label, ghost, al, sc, bare = false) { // bare: the outline only (no label, no dot)
    if (al <= 0.003) return;
    const cxm = X + w / 2, cym = Y + h / 2;
    x.save(); x.globalAlpha *= al;
    if (sc !== 1) { x.translate(cxm, cym); x.scale(sc, sc); x.translate(-cxm, -cym); }
    if (ghost) { tagPath(x, X, Y, w, h); x.setLineDash([6, 5]); x.lineWidth = 1.5; x.strokeStyle = "rgba(255,255,255,0.4)"; x.stroke(); x.setLineDash([]); }
    else tag(x, X, Y, w, h, {});
    if (!bare) {
      if (label) T(x, label, X + w - 45, cym + 12, { w: 400, size: 34, color: WHITE, a: ghost ? 0.4 : 1 });
      x.fillStyle = ghost ? "rgba(255,255,255,0.4)" : RED; x.beginPath(); x.arc(X + w - 26, cym, 6, 0, k2_TAU); x.fill();
    }
    x.restore();
  }
  function tradeChip(x, X, Y, w, h, label, o = {}) {
    const a = o.a ?? 1; if (a <= 0.003) return;
    x.save(); x.globalAlpha *= a;
    if (o.pop != null && o.pop < 1) {
      const p = cl(o.pop), k = cl(3 * p);
      k2_chip(x, X, Y, w, h, label, true, 1 - k, 1, p > 0);
      if (p > 0) k2_chip(x, X, Y, w, h, label, false, k, back(p, 1.4));
    } else k2_chip(x, X, Y, w, h, label, !!o.ghost && o.pop == null, 1, 1);
    const rg = o.ring ?? 0;
    if (rg > 0 && rg < 1) {
      x.globalAlpha *= 1 - rg; x.strokeStyle = WHITE; x.lineWidth = 2; x.setLineDash([]);
      x.beginPath(); x.arc(o.ringX ?? X + w / 2, o.ringY ?? Y + h / 2, lerp(12, 30, e3(rg)), 0, k2_TAU); x.stroke();
    }
    x.restore();
  }

  // ================================================================== K10 SKELETON: placeholder bar
  // TRACK roundRect (r = min(8, h/2); o.r overrides, e.g. B-roll 2's 340x60 r 10) with a shimmer band (white .10, 80 px,
  // 20 deg) moving right to left every 0.9 s (phase = (t % 0.9) / 0.9), clipped to the bar. o.dissolve 0..1: alpha
  // 1 - e2(dissolve) and scaleY 1 -> .9 about the bar's centre line.
  function skeleton(x, X, Y, w, h, t, a = 1, o = {}) {
    const dv = cl(o.dissolve ?? 0), aa = (a ?? 1) * (1 - e2(dv)); if (aa <= 0.003) return;
    const r = o.r ?? Math.min(8, h / 2), cyy = Y + h / 2, sy = lerp(1, 0.9, dv);
    x.save(); x.globalAlpha *= aa; x.setLineDash([]);
    if (sy !== 1) { x.translate(0, cyy); x.scale(1, sy); x.translate(0, -cyy); }
    rr(x, X, Y, w, h, r); x.fillStyle = TRACK; x.fill(); x.clip();
    const ph = (((t % 0.9) + 0.9) % 0.9) / 0.9, sl = h * 0.364, span = w + 80 + sl, bx = X + w + 40 + sl / 2 - ph * span;
    x.translate(bx, cyy); x.rotate((-20 * Math.PI) / 180);
    const g = x.createLinearGradient(-40, 0, 40, 0);
    g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, "rgba(255,255,255,0.10)"); g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g; x.fillRect(-40, -h * 1.5, 80, h * 3);
    x.restore();
  }

  // ================================================================== K12 BRSCENE: the shared B-roll world (W1 34_broll.js)
  // Pure #000 (the k_card special's black; no fill here), lit only by the ◢ floor world below a horizon at y 610 (f 1000,
  // camera 1.6 m, dolly 1.2 m/s), a horizon haze (.06) and the candle bokeh band, plus a slow drift (+0.5 %/s about the
  // centre). Haze and bokeh are bitmaps on the horizon, drawn 1:1 outside the drift: the floor's horizon (70 px below the
  // drift centre) moves 0.35 px per second of lt under them (2.5 px by B-roll 1's end at lt 7, 3.9 px by B-roll 2's at
  // lt 11), which does not show. Everything drawn in draw() drifts with the floor, and far from the centre that is not
  // small: at lt 11 the scale is 1.055, so a point 780 px left of x 960 sits 43 px further out (B-roll 2's left card
  // x 180 -> 137, its right card's edge 1740 -> 1783). The spec's screen positions are the lt 0 positions.
  // ss = the B-roll exit curve (smoothstep: an in-out like eio with half its peak slope, so a 0.42 s exit never loses
  // more than 14.3 % in one frame).
  const ss = (p) => { p = cl(p); return p * p * (3 - 2 * p); };
  // page 4-5 texture's ◢ at its measured proportion (9 px on a 57 px pitch = 0.19 m on 1.2 m) and its alpha ladder
  // (.27 .23 .19 .16 .12, then nothing) from the near rows to 40 m. On a flat floor depth is a function of screen y, so the
  // ladder is one vertical gradient and the whole field ONE path and ONE fill (no banding pops while rows stream in). It
  // fades out over y 860-940 (<= 952 on screen at the 1.03 drift) so the subtitle band stays clean.
  const k2_LAD = [[5, 0.27], [12, 0.23], [19, 0.19], [26, 0.16], [33, 0.12], [40, 0]];
  function k2_ladder(d) {
    if (d <= k2_LAD[0][0]) return k2_LAD[0][1];
    for (let i = 1; i < k2_LAD.length; i++) if (d <= k2_LAD[i][0]) return lerp(k2_LAD[i - 1][1], k2_LAD[i][1], (d - k2_LAD[i - 1][0]) / (k2_LAD[i][0] - k2_LAD[i - 1][0]));
    return 0;
  }
  function k2_floorFill(x) {
    if (k2_SPR.fg && k2_SPR.fgx === x) return k2_SPR.fg;
    const g = x.createLinearGradient(0, 610, 0, 1080);
    g.addColorStop(0, rgba(RED, 0));
    for (const sy of [640, 650, 655, 662, 670, 680, 692, 707, 726, 750, 780, 820, 860, 880, 900, 920, 940]) {
      const a = k2_ladder(1600 / (sy - 610)) * cl((940 - sy) / 80);
      g.addColorStop((sy - 610) / 470, rgba(RED, a.toFixed(4)));
    }
    g.addColorStop(1, rgba(RED, 0));
    k2_SPR.fgx = x;
    return (k2_SPR.fg = g);
  }
  // (the ~900 marks go into one Path2D built from an SVG path string, 0.01 px precision: the same geometry as W1's
  // moveTo/lineTo path at well under half the cost of ~3,600 canvas calls)
  const k2_r2 = (v) => Math.round(v * 100) / 100;
  function k2_floor(x, cz) {
    const st = 1.2, s = 0.19, k0 = Math.ceil((cz + 3.2) / st), k1 = Math.floor((cz + 40) / st), P = [];
    for (let k = k0; k <= k1; k++) {
      const d1 = k * st - cz, d2 = d1 + s, y1 = 610 + 1600 / d1, y2 = 610 + 1600 / d2;
      if (y2 > 942) continue;
      const f1 = 1000 / d1, f2 = 1000 / d2, Y1 = " " + k2_r2(y1), Y2 = " " + k2_r2(y2);
      for (let j = -20; j < 20; j++) {
        const X0 = j * st + 0.6 - s / 2, xa = 960 + X0 * f1, xb = 960 + (X0 + s) * f1;
        if (xb < -8 || xa > W + 8) continue;
        P.push("M" + k2_r2(xa) + Y1 + "L" + k2_r2(xb) + Y1 + "L" + k2_r2(960 + (X0 + s) * f2) + Y2 + "Z");
      }
    }
    if (!P.length) return;
    x.fillStyle = k2_floorFill(x); x.fill(new Path2D(P.join("")));
  }
  function k2_haze(x) { // faint white horizon haze, cached ellipse 1800 x 120 at alpha .06 (scaled up once, then blitted 1:1)
    let c = k2_SPR.hz;
    if (!c) {
      const e = U.mk(512, 64);
      e.x.save(); e.x.scale(1, 0.125);
      const g = e.x.createRadialGradient(256, 256, 0, 256, 256, 256);
      g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.45, "rgba(255,255,255,0.4)"); g.addColorStop(1, "rgba(255,255,255,0)");
      e.x.fillStyle = g; e.x.fillRect(0, 0, 512, 512); e.x.restore();
      c = k2_SPR.hz = U.mk(1800, 120); c.x.drawImage(e, 0, 0, 1800, 120);
    }
    x.save(); x.globalAlpha *= 0.06; x.drawImage(c, 60, 550); x.restore();
  }
  // candle bokeh band on the horizon (pages 3/7): two layers blurred ONCE at init (far 24 px / .30, near 10 px / .45), 70 %
  // white, 10 % grey, 20 % red, candles on a gently rising diagonal, drifting left 12 and 30 px/s. Cropped to their content
  // (layer y 70-300) and blitted 1:1 at whole-pixel offsets outside the drift (a filtered full-width draw costs ~25 ms in
  // this software raster, a plain blit a fraction of it); blurred at 1/4 size, then scaled up once (a fast init).
  function k2_bokehLayer(k, blur, seed, n, wb) {
    if (k2_SPR[k]) return k2_SPR[k];
    const bw = 2400, bh = 230, q = 4, c = (k2_SPR[k] = U.mk(bw, bh)), s = U.mk(bw / q, bh / q);
    s.x.filter = `blur(${blur / q}px)`; s.x.scale(1 / q, 1 / q); s.x.translate(0, -70);
    for (let i = 0; i < n; i++) {
      const r = hash(seed, i, 1), X = 30 + ((i + 0.2 + 0.6 * hash(seed, i, 2)) * (bw - 60)) / n;
      const base = 252 - (X / bw) * 42 + (hash(seed, i, 3) - 0.5) * 24, hb = 14 + hash(seed, i, 4) * 46;
      s.x.fillStyle = r < 0.2 ? RED : r < 0.3 ? "#9A9CA1" : "#ECEDF0";
      s.x.fillRect(X, base - hb, wb, hb);
      s.x.fillRect(X + wb / 2 - 1.5, base - hb - 24 * hash(seed, i, 5), 3, hb + 14 + 18 * hash(seed, i, 6));
    }
    s.x.filter = "none";
    c.x.imageSmoothingQuality = "high"; c.x.drawImage(s, 0, 0, bw, bh);
    return c;
  }
  function k2_bokeh(x, lt, y) {
    for (const [k, blur, al, sp, seed, n, wb] of [["k2_bkF", 24, 0.3, 12, 81, 54, 18], ["k2_bkN", 10, 0.45, 30, 83, 30, 13]]) {
      const c = k2_bokehLayer(k, blur, seed, n, wb);
      x.save(); x.globalAlpha *= al; x.drawImage(c, Math.round(-140 - lt * sp), y + 70); x.restore();
    }
  }
  // brScene(x, t, lt, o, draw): haze + bokeh (1:1), then the drift (scale 1 + 0.005 lt about (960,540)), the floor at
  // cz = o.cz0 + 1.2 lt + o.dz, and await draw(x, t, lt) inside the same transform. o: cz0 (B-roll 1: 0, B-roll 2: 37),
  // bokehY (layer top; B-roll 1: 362, B-roll 2: 370), dz (extra dolly in m, default 0: W1 B-roll 1 pushed 1.8 m on its
  // chart dive). lt = seconds since the B-roll's first frame.
  async function brScene(x, t, lt, o = {}, draw) {
    k2_haze(x);
    k2_bokeh(x, lt, o.bokehY ?? 362);
    x.save();
    const s = 1 + 0.005 * lt; x.translate(960, 540); x.scale(s, s); x.translate(-960, -540);
    k2_floor(x, (o.cz0 ?? 0) + 1.2 * lt + (o.dz ?? 0));
    if (draw) await draw(x, t, lt);
    x.restore();
  }

  // ================================================================== K13 COMET: the red comet (D stairs, B-roll 2 fund)
  // pts: a polyline (or a sampled quadratic: comet.quad) in the caller's space; the head sits at arc length u L(pts) (u
  // already eased by the caller, clamped 0..1). Head: RED disc o.r (7) with a white core r 3, over one cached glow sprite
  // r o.glow (26), RED .35. Tail: o.tail dots (6) behind the head every o.gap px of arc (9), radius falling linearly to
  // 30 %, and ONE alpha ramp over the whole tail (30 % at its end -> 100 % at the head): the dots overlap (9 px apart, up
  // to 12 px wide), so fading each dot on its own beaded the tail. The comet is built in one small device-space layer and
  // blitted once at o.a, so the tail never shows through the head. o.fade (0..1) fades the tail only (its end).
  // o.du (default 0): the eased u step over the last frame (u(t) - u(t - 1/25)). When the head moves further in a frame
  // than the tail is long (D: up to ~290 px per frame against 54 px), the tail grows to that distance, keeping its dot
  // spacing (more dots), so successive frames join up instead of strobing; the radius and alpha ramps stretch over it.
  // Off (du 0) it is exactly the spec's comet.
  // The tail's alpha ramp is one linear gradient from the tail's end to the head: exact on straight runs; within one
  // tail length after a corner it can sit up to ~.06 (.08 with a du tail) above the per-dot arc-length ramp.
  // Returns { x, y, d, L } (head, arc, length).
  // Arc-length tables are cached per pts array (build pts once; do not mutate it in place).
  const k2_CUM = new WeakMap();
  function k2_cum(pts) {
    let c = k2_CUM.get(pts);
    if (!c) { c = [0]; for (let i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); k2_CUM.set(pts, c); }
    return c;
  }
  function k2_at(pts, c, d) {
    const n = pts.length; if (n < 2 || d <= 0) return pts[0];
    if (d >= c[n - 1]) return pts[n - 1];
    let lo = 0, hi = n - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (c[m] < d) lo = m; else hi = m; }
    const f = (d - c[lo]) / (c[hi] - c[lo] || 1);
    return [lerp(pts[lo][0], pts[hi][0], f), lerp(pts[lo][1], pts[hi][1], f)];
  }
  function k2_proj(pts, c, P) { // arc length of the polyline point nearest to P (the first one on ties)
    let best = 1e18, s = 0;
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
      const f = l2 ? cl(((P[0] - ax) * dx + (P[1] - ay) * dy) / l2) : 0, qx = ax + dx * f, qy = ay + dy * f, d2 = (P[0] - qx) ** 2 + (P[1] - qy) ** 2;
      if (d2 < best - 1e-6) { best = d2; s = c[i - 1] + f * (c[i] - c[i - 1]); }
    }
    return s;
  }
  function k2_atX(pts, c, d) { // k2_at, extrapolated back along the first segment for d < 0
    if (d >= 0 || pts.length < 2) return k2_at(pts, c, d);
    const [ax, ay] = pts[0], [bx, by] = pts[1], l = Math.hypot(bx - ax, by - ay) || 1;
    return [ax - ((bx - ax) / l) * -d, ay - ((by - ay) / l) * -d];
  }
  function comet(x, pts, u, o = {}) {
    const c = k2_cum(pts), L = c[c.length - 1], d = cl(u) * L, [hx, hy] = k2_at(pts, c, d), a = o.a ?? 1;
    const out = { x: hx, y: hy, d, L };
    if (a <= 0.003) return out;
    const r = o.r ?? 7, gap = o.gap ?? 9, G = o.glow ?? 26, ta = 1 - cl(o.fade ?? 0);
    const n = Math.max(o.tail ?? 6, Math.min(64, Math.ceil((Math.abs(o.du ?? 0) * L) / gap)));
    const dots = []; // the tail, back to front: [x, y, radius]
    if (ta > 0.003 && d > 0) for (let i = n; i >= 1; i--) { const dd = d - i * gap; if (dd >= 0) dots.push([...k2_at(pts, c, dd), r * (1 - (0.7 * i) / n)]); }
    const hr = Math.max(G, r); // the layer = the bounding box of the glow, the head and the tail dots (+2 px)
    let bx0 = hx - hr, by0 = hy - hr, bx1 = hx + hr, by1 = hy + hr;
    for (const [px, py, pr_] of dots) { bx0 = Math.min(bx0, px - pr_); by0 = Math.min(by0, py - pr_); bx1 = Math.max(bx1, px + pr_); by1 = Math.max(by1, py + pr_); }
    bx0 -= 2; by0 -= 2; bx1 += 2; by1 += 2;
    k2_layer(x, bx0, by0, bx1 - bx0, by1 - by0, a, (cc) => {
      cc.setLineDash([]);
      if (dots.length) {
        cc.fillStyle = RED;
        for (const [px, py, pr_] of dots) { cc.beginPath(); cc.arc(px, py, pr_, 0, k2_TAU); cc.fill(); }
        const [ex, ey] = k2_atX(pts, c, d - n * gap); // the tail's end (30 %), on the path or before its start
        cc.globalCompositeOperation = "destination-in";
        const g = cc.createLinearGradient(ex, ey, hx, hy);
        g.addColorStop(0, `rgba(0,0,0,${(0.3 * ta).toFixed(3)})`); g.addColorStop(1, `rgba(0,0,0,${ta.toFixed(3)})`);
        cc.fillStyle = g; cc.fillRect(bx0, by0, bx1 - bx0, by1 - by0);
      }
      cc.globalCompositeOperation = "destination-over"; glow(cc, hx, hy, G, RED, 0.35); // under the tail
      cc.globalCompositeOperation = "source-over";
      cc.fillStyle = RED; cc.beginPath(); cc.arc(hx, hy, r, 0, k2_TAU); cc.fill();
      cc.fillStyle = WHITE; cc.beginPath(); cc.arc(hx, hy, 3, 0, k2_TAU); cc.fill();
    }, "k2_comet");
    return out;
  }
  // comet.passTimes(pts, t0, d, ease, marks): the time the head reaches each mark, for a run of d s from t0 with the head
  // at ease(lt / d) L (bisection on the ease, as W1 st_cometPass). A mark is a point [x, y] (projected onto the polyline:
  // D passes each landing's right end, S1 the first riser (1540,742)) or an arc length in px.
  comet.passTimes = (pts, t0, d, ease = eio, marks = []) => {
    const c = k2_cum(pts), L = c[c.length - 1];
    return marks.map((m) => {
      const s = typeof m === "number" ? m : k2_proj(pts, c, m);
      if (s <= 0) return t0;
      if (s >= L) return t0 + d;
      let lo = 0, hi = 1;
      for (let i = 0; i < 30; i++) { const mm = (lo + hi) / 2; if (L * ease(mm) < s) lo = mm; else hi = mm; }
      return t0 + d * hi;
    });
  };
  // comet.quad(P0, C, P2, n = 64): a quadratic Bezier sampled into n + 1 points (a polyline for comet)
  comet.quad = (P0, C, P2, n = 64) => {
    const out = [];
    for (let i = 0; i <= n; i++) {
      const u = i / n, a = (1 - u) * (1 - u), b = 2 * u * (1 - u), cc = u * u;
      out.push([a * P0[0] + b * C[0] + cc * P2[0], a * P0[1] + b * C[1] + cc * P2[1]]);
    }
    return out;
  };

  // ================================================================== STUDIO SPACE: virtual camera, floor projection, floor light
  // ------------------------------------------------------------------ virtual camera on L4 (2.5D dolly about the plate's horizon point)
  // L4 sits inside its extended studio (l4_ext2.jpg: the plate's own floor quilted out to every frame edge, even at extreme
  // wide; work/build_ext2.py) and the camera scales the whole world about A = (0.49W, 0.58H): s 1.0 FULL, 0.66 HOME,
  // 0.30 WIDE, 0.22 extreme wide; dy cranes (fraction of H). Pull-outs: near-instant attack + expo ease-out; push-ins:
  // S-curve; sub-frame samples give the move its motion blur. The void is pure black (void masks, work/build_void.py).
  const AX = 0.49 * W, AY = 0.58 * H;
  let VM = null, VMS = []; // plate px -> screen for the current vcam frame (null on other shots); its motion-blur samples
  const EASE = { pull: (u) => (u >= 1 ? 1 : (1 - Math.pow(2, -10 * u)) / (1 - Math.pow(2, -10))), push: eio, lin: (u) => cl(u) };
  function camAt(c, tv) {
    let s = c.s0, dy = c.dy0 || 0, tl = c.t0 ?? 0;
    for (const m of c.moves || []) {
      const [mt, md, ms, mdy, me] = m;
      if (tv >= mt + md) { s = ms; dy = mdy ?? dy; tl = mt + md; continue; }
      if (tv >= mt) {
        const s1 = s * (1 + (c.drift || 0) * (mt - tl));
        const e = EASE[me || "push"](cl((tv - mt) / md));
        return { s: s1 * Math.pow(ms / s1, e), dy: lerp(dy, mdy ?? dy, e) };
      }
      break;
    }
    return { s: s * (1 + (c.drift || 0) * (tv - tl)), dy };
  }
  const camM = (c) => [c.s, 0, 0, c.s, AX - AX * c.s, AY - AY * c.s + c.dy * H];
  // the world under the camera: the extended studio, the feathered live plate, then the void made pure black: the
  // backdrop light left in the plate (void mask, work/build_void.py) and everything above the plate's top edge
  // (l4_ext2 continues the plate's top-centre glow upward)
  function vcWorld(X, M, ext, m, vm) {
    X.save(); U.setM(X, M);
    X.drawImage(ext, -3600, -2560, 9280, 5360);
    X.drawImage(m, 0, 0, 1920, 1080);
    if (vm) X.drawImage(vm, 0, 0, 1920, 1080);
    X.fillStyle = "#000"; X.fillRect(-3600, -2560, 9280, 2561);
    X.restore();
  }
  // crushDark(): X = X x (1 - B x (1 - K)): K keys the plate's luma (<= 12/255 -> 0, >= 22/255 -> 1), B is the band mask
  // drawn by band(ctx) (its alpha), so the backdrop glow left around his silhouette goes black and his own pixels stay.
  // X must be opaque and cw x ch device px.
  function crushDark(X, cw, ch, band) {
    const src = snap(X, "cr_src"), k = tmp("cr_k", cw, ch), g = tmp("cr_g", cw, ch);
    k.x.setTransform(1, 0, 0, 1, 0, 0); k.x.globalAlpha = 1; k.x.globalCompositeOperation = "copy";
    k.x.filter = "grayscale(1) brightness(7.5) contrast(3.4)"; k.x.drawImage(src, 0, 0); k.x.filter = "none";
    k.x.globalCompositeOperation = "difference"; k.x.fillStyle = "#ffffff"; k.x.fillRect(0, 0, cw, ch); // 1 - K
    k.x.globalCompositeOperation = "destination-in"; band(k.x); k.x.globalCompositeOperation = "source-over"; // alpha B
    g.x.setTransform(1, 0, 0, 1, 0, 0); g.x.globalAlpha = 1; g.x.filter = "none";
    g.x.globalCompositeOperation = "copy"; g.x.fillStyle = "#ffffff"; g.x.fillRect(0, 0, cw, ch);
    g.x.globalCompositeOperation = "difference"; g.x.drawImage(k, 0, 0); g.x.globalCompositeOperation = "source-over"; // 1 - B(1 - K)
    X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.filter = "none";
    X.globalCompositeOperation = "multiply"; X.drawImage(g, 0, 0); X.restore();
  }
  let ACC = null;
  RRC.hook("afterPlate", async (S) => {
    VM = null; VMS = [];
    if (!S.plate) return;
    const c = S.shot && S.shot.k_vcam;
    if (!c) { // L5 (medium) keeps a lit backdrop right of his head: band crush + void mask, through the shot's own camera
      if (S.shot && S.shot.clip === "L5" && S.M) {
        const vm = await im("l5_void.png"), bd = await im("l5_void_band.png"), pc = S.plateCanvas.x;
        crushDark(pc, pc.canvas.width, pc.canvas.height, (X) => { X.save(); U.setM(X, S.M); X.drawImage(bd, 0, 0, 1920, 1080); X.restore(); });
        pc.save(); U.setM(pc, S.M); pc.drawImage(vm, 0, 0, 1920, 1080); pc.restore();
      }
      return;
    }
    const pc = S.plateCanvas.x, cw = pc.canvas.width, ch = pc.canvas.height;
    const ext = await im("l4_ext2.jpg"), fea = await im("l4_feather2.png"), vm = await im("l4_void.png"), bd = await im("l4_void_band.png"); // l4_ext2: plate units x [-3600, 5680), y [-2560, 2800)
    const m = tmp("xwm", 1920, 1080);
    m.x.setTransform(1, 0, 0, 1, 0, 0);
    m.x.globalCompositeOperation = "copy"; m.x.drawImage(S.plate, 0, 0, 1920, 1080);
    crushDark(m.x, 1920, 1080, (X) => X.drawImage(bd, 0, 0, 1920, 1080));
    m.x.setTransform(1, 0, 0, 1, 0, 0);
    m.x.globalCompositeOperation = "destination-in"; m.x.drawImage(fea, 0, 0, 1920, 1080);
    m.x.globalCompositeOperation = "source-over";
    // motion blur: a 180-degree shutter (+-0.01 s), one sample per <= 1.5 px of frame-corner travel (3..48), averaged
    // exactly in float (8-bit running averages drift over many samples)
    const tv = S.t - P, c0 = camAt(c, tv), ca = camAt(c, tv - 0.01), cb = camAt(c, tv + 0.01);
    const disp = Math.abs(Math.log(cb.s / ca.s)) * 1160 + Math.abs(cb.dy - ca.dy) * H;
    const N = disp > 0.75 ? Math.min(48, Math.max(3, Math.ceil(disp / 1.5))) : 1;
    U.reset(pc);
    pc.fillStyle = "#000"; pc.fillRect(0, 0, W, H);
    if (N === 1) { vcWorld(pc, camM(c0), ext, m, vm); VMS = [camM(c0)]; }
    else {
      const sub = tmp("vcs", cw, ch), n4 = cw * ch * 4;
      if (!ACC || ACC.length !== n4) ACC = new Float32Array(n4);
      ACC.fill(0);
      for (let j = 0; j < N; j++) {
        const M = camM(camAt(c, tv - 0.01 + (0.02 * j) / (N - 1)));
        sub.x.setTransform(1, 0, 0, 1, 0, 0); sub.x.globalAlpha = 1; sub.x.globalCompositeOperation = "source-over";
        sub.x.fillStyle = "#000"; sub.x.fillRect(0, 0, cw, ch);
        vcWorld(sub.x, M, ext, m, vm);
        const d = sub.x.getImageData(0, 0, cw, ch).data;
        for (let i = 0; i < n4; i++) ACC[i] += d[i];
        VMS.push(M);
      }
      const out = pc.createImageData(cw, ch), od = out.data, k = 1 / N;
      for (let i = 0; i < n4; i++) od[i] = ACC[i] * k + 0.5;
      pc.putImageData(out, 0, 0);
    }
    VM = camM(c0);
  });
  // plate px -> screen px on the current vcam frame (identity when no vcam)
  const toScreen = (px, py) => (VM ? [VM[0] * px + VM[4], VM[3] * py + VM[5]] : [px, py]);
  // a point authored in SCREEN px at the extreme-wide framing (s .22, dy .03) -> plate px (so it rides any drift/move)
  const EW_S = 0.22, EW_DY = 0.03 * H;
  const ewP = (sx, sy) => [AX + (sx - AX) / EW_S, AY + (sy - AY - EW_DY) / EW_S];

  // ------------------------------------------------------------------ floor projection (from the L4 plate)
  // horizon A.y 626.4; stool feet at (960, 1004); 525 px/m at the stool. u = metres lateral (+ right), v = metres beyond
  // the stool (+ away). floorP(u, v) -> plate px.
  const floorP = (u, v) => { const z = Math.max(0.55, 3 + v); return [940.8 + (1575 * u + 57.6) / z, 626.4 + 1132.6 / z]; }; // near plane 3+v >= 0.55
  const FLOOR_C = [960, 1004]; // stool feet in L4 plate px
  // polygon of a floor circle of R metres around (cu, cv)
  function floorCircle(R, n = 64, cu = 0, cv = 0) {
    const out = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; out.push(floorP(cu + Math.cos(a) * R, cv + Math.sin(a) * R)); }
    return out;
  }
  // the stage pad: SELECT-tag silhouette on the floor, u -1..1, v -0.8..0.8, back-left and front-right corners cut 0.4 m
  function padPts(sc = 1) {
    const q = [[-0.6, 0.8], [1, 0.8], [1, -0.4], [0.6, -0.8], [-1, -0.8], [-1, 0.4]];
    return q.map(([u, v]) => floorP(u * sc, v * sc));
  }
  // ◢ marks on the floor: 0.14 m right triangles on a 0.6 m lattice (u -6..6, v -1.5..9); alpha(u, v) -> 0..1
  function floorTris(alpha, o = {}) {
    const list = [], s = o.s ?? 0.14, step = o.step ?? 0.6;
    for (let v0 = o.v0 ?? -1.5; v0 <= (o.v1 ?? 9); v0 += step) for (let u0 = o.u0 ?? -6; u0 <= (o.u1 ?? 6); u0 += step) {
      const a = alpha(u0, v0); if (a <= 0.01) continue;
      const p1 = floorP(u0, v0), p2 = floorP(u0 + s, v0), p3 = floorP(u0 + s, v0 + s);
      list.push([p1[0], p1[1], p2[0], p2[1], p3[0], p3[1], a]);
    }
    return { type: "tris", list, color: o.color || RED };
  }

  // ------------------------------------------------------------------ floor light
  // ONE call per frame. shapes (plate px, drawn through VM): ellipse {cx, cy, r, ry, color, a, core}, ring {cx, cy, r, w,
  // ry, color, a}, poly {pts, color, a}, line {pts, color, a, lw, u (dash progress), close}, tris {list, color},
  // ringq {R, w (m), color, a, segs, duty, u}, annulus {R, w (m), cu, cv, color, a} (crisp floorP ring).
  // Soft light (ellipse, ring and every non-red shape): glow x frame, added `gain` times. Crisp RED marks (annulus, poly,
  // line, tris, ringq) are decals, frame x (1 - a O) + RED x a O, with O the floor's own light (0 on the dark stool,
  // shoes and void, 1 on the lit floor): they read #E4002E (red added over the grey floor read pink) and stay occluded.
  // During camera moves every shape is drawn at the plate's motion-blur samples, so the marks blur with the floor.
  const CRISP = { annulus: 1, poly: 1, line: 1, tris: 1, ringq: 1 };
  const isRed = (c) => typeof c === "string" && c.toUpperCase() === RED;
  function flShapes(X, shapes, wN, white) {
    for (const s of shapes) {
      const colr = white ? "#ffffff" : s.color;
      X.globalAlpha = cl(s.a ?? 1) * wN;
      if (s.type === "ellipse") {
        const gr = X.createRadialGradient(s.cx, s.cy, 0, s.cx, s.cy, s.r);
        gr.addColorStop(0, colr); gr.addColorStop(s.core ?? 0.55, colr); gr.addColorStop(1, "rgba(0,0,0,0)");
        X.save(); X.translate(s.cx, s.cy); X.scale(1, s.ry ?? 0.24); X.translate(-s.cx, -s.cy);
        X.fillStyle = gr; X.beginPath(); X.arc(s.cx, s.cy, s.r, 0, Math.PI * 2); X.fill(); X.restore();
      } else if (s.type === "ring") {
        const w2 = (s.w ?? 30) * 0.5 + 14, r0 = Math.max(0, s.r - w2), r1 = s.r + w2;
        X.save(); X.translate(s.cx, s.cy); X.scale(1, s.ry ?? 0.24);
        const gr = X.createRadialGradient(0, 0, r0, 0, 0, r1);
        gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.5, colr); gr.addColorStop(1, "rgba(0,0,0,0)");
        X.fillStyle = gr; X.beginPath(); X.arc(0, 0, r1, 0, Math.PI * 2); X.arc(0, 0, r0, 0, Math.PI * 2, true); X.fill(); X.restore();
      } else if (s.type === "annulus") { // crisp floor ring: floorP polygons (64 pts), R +- w/2 metres around (cu, cv)
        const o1 = floorCircle(s.R + (s.w ?? 0.08) / 2, 64, s.cu ?? 0, s.cv ?? 0), i1 = floorCircle(Math.max(0.01, s.R - (s.w ?? 0.08) / 2), 64, s.cu ?? 0, s.cv ?? 0);
        X.fillStyle = colr; X.beginPath();
        o1.forEach((p, i) => (i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1]))); X.closePath();
        i1.forEach((p, i) => (i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1]))); X.closePath();
        X.fill("evenodd");
      } else if (s.type === "poly") {
        X.fillStyle = colr; X.beginPath(); s.pts.forEach((p, i) => (i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1]))); X.closePath(); X.fill();
      } else if (s.type === "line") {
        X.save(); X.strokeStyle = colr; X.lineWidth = s.lw ?? 18; X.lineJoin = "round"; X.lineCap = "round";
        if (s.u != null && s.u < 1) X.setLineDash([20000 * cl(s.u), 20000]);
        X.beginPath(); s.pts.forEach((p, i) => (i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1]))); if (s.close) X.closePath(); X.stroke(); X.restore();
      } else if (s.type === "tris") {
        // batch by alpha bucket (6 bands)
        const B = [[], [], [], [], [], []];
        for (const q of s.list) B[Math.min(5, Math.floor(cl(q[6]) * 6))].push(q);
        X.fillStyle = colr;
        B.forEach((bk, bi) => {
          if (!bk.length) return;
          X.globalAlpha = cl((s.a ?? 1) * ((bi + 0.5) / 6)) * wN;
          X.beginPath(); for (const q of bk) { X.moveTo(q[0], q[1]); X.lineTo(q[2], q[3]); X.lineTo(q[4], q[5]); X.closePath(); }
          X.fill();
        });
      } else if (s.type === "ringq") {
        const n = s.segs ?? 24, duty = s.duty ?? 2 / 3, R = s.R, w = s.w ?? 0.05, u = s.u ?? 1;
        X.fillStyle = colr; X.beginPath();
        for (let i = 0; i < n; i++) {
          const a0 = (i / n) * Math.PI * 2 - Math.PI / 2, a1 = a0 + ((Math.PI * 2) / n) * duty;
          if (i / n >= u) break;
          const pts = [];
          for (let j = 0; j <= 4; j++) { const a = lerp(a0, a1, j / 4); pts.push(floorP(Math.cos(a) * (R + w / 2), Math.sin(a) * (R + w / 2))); }
          for (let j = 4; j >= 0; j--) { const a = lerp(a0, a1, j / 4); pts.push(floorP(Math.cos(a) * (R - w / 2), Math.sin(a) * (R - w / 2))); }
          pts.forEach((p, k2) => (k2 ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1]))); X.closePath();
        }
        X.fill();
      }
    }
  }
  // draw shapes once per sample matrix (equal weights, accumulated with "lighter" when there are several)
  function flSamples(X, Ms, shapes, white) {
    X.globalCompositeOperation = Ms.length > 1 ? "lighter" : "source-over";
    for (const M of Ms) { X.save(); U.setM(X, M); flShapes(X, shapes, 1 / Ms.length, white); X.restore(); }
    X.globalCompositeOperation = "source-over"; X.globalAlpha = 1;
  }
  function floorLight(x, S, shapes, gain) {
    const M0 = VM || S.M;
    if (!M0 || !shapes.length) return;
    const Ms = VM && VMS.length > 1 ? (VMS.length > 24 ? VMS.filter((_, i) => i % Math.ceil(VMS.length / 24) === 0) : VMS) : [M0];
    const soft = [], dec = [];
    for (const s of shapes) (CRISP[s.type] && isRed(s.color) ? dec : soft).push(s);
    const pw = x.canvas.width, ph = x.canvas.height;
    const sc = snap(x, "fl_src");
    if (soft.length) {
      const g = tmp("fl", pw, ph);
      g.x.setTransform(1, 0, 0, 1, 0, 0); g.x.globalAlpha = 1; g.x.filter = "none";
      g.x.globalCompositeOperation = "source-over"; g.x.fillStyle = "#000"; g.x.fillRect(0, 0, pw, ph);
      flSamples(g.x, Ms, soft, false);
      g.x.setTransform(1, 0, 0, 1, 0, 0);
      g.x.globalCompositeOperation = "multiply"; g.x.drawImage(sc, 0, 0);
      g.x.globalCompositeOperation = "source-over";
      x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = "lighter";
      let k = gain;
      while (k > 0.001) { x.globalAlpha = Math.min(1, k); x.drawImage(g, 0, 0); k -= 1; }
      x.restore();
    }
    if (dec.length) {
      // O = floor light from the frame's luma: 0 at <= 0.03, 1 at >= 0.12 (one affine filter, clamped)
      const o = tmp("fl_o", pw, ph);
      o.x.setTransform(1, 0, 0, 1, 0, 0); o.x.globalAlpha = 1; o.x.globalCompositeOperation = "copy";
      o.x.filter = "grayscale(1) brightness(6.6) contrast(1.67)"; o.x.drawImage(sc, 0, 0); o.x.filter = "none";
      // D = mark coverage (white, alpha a); C = a x O on black
      const d = tmp("fl_d", pw, ph);
      d.x.setTransform(1, 0, 0, 1, 0, 0); d.x.globalAlpha = 1; d.x.globalCompositeOperation = "source-over"; d.x.filter = "none";
      d.x.clearRect(0, 0, pw, ph);
      flSamples(d.x, Ms, dec, true);
      d.x.setTransform(1, 0, 0, 1, 0, 0);
      o.x.globalCompositeOperation = "destination-in"; o.x.drawImage(d, 0, 0); o.x.globalCompositeOperation = "source-over";
      const c = tmp("fl_c", pw, ph);
      c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalAlpha = 1; c.x.filter = "none";
      c.x.globalCompositeOperation = "copy"; c.x.fillStyle = "#000"; c.x.fillRect(0, 0, pw, ph);
      c.x.globalCompositeOperation = "source-over"; c.x.drawImage(o, 0, 0);
      // K = 1 - C; frame x K, then + RED x C
      const k = tmp("fl_k", pw, ph);
      k.x.setTransform(1, 0, 0, 1, 0, 0); k.x.globalAlpha = 1; k.x.filter = "none";
      k.x.globalCompositeOperation = "copy"; k.x.fillStyle = "#ffffff"; k.x.fillRect(0, 0, pw, ph);
      k.x.globalCompositeOperation = "difference"; k.x.drawImage(c, 0, 0); k.x.globalCompositeOperation = "source-over";
      c.x.globalCompositeOperation = "multiply"; c.x.fillStyle = RED; c.x.fillRect(0, 0, pw, ph); c.x.globalCompositeOperation = "source-over";
      x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1;
      x.globalCompositeOperation = "multiply"; x.drawImage(k, 0, 0);
      x.globalCompositeOperation = "lighter"; x.drawImage(c, 0, 0);
      x.restore();
    }
  }
  // spill: card reflections outside the lit pool, additive WITHOUT the multiply. list: [{u, v, rx (m), color, a}]
  function spill(x, list) {
    if (!VM || !list.length) return;
    x.save(); U.setM(x, VM); x.globalCompositeOperation = "lighter";
    for (const s of list) {
      if ((s.a ?? 0) <= 0.003) continue;
      const [px, py] = floorP(s.u, s.v), r = (s.rx ?? 1.1) * 525 * (3 / (3 + s.v));
      const gr = x.createRadialGradient(px, py, 0, px, py, r);
      gr.addColorStop(0, rgba(s.color, s.a)); gr.addColorStop(1, rgba(s.color, 0));
      x.save(); x.translate(px, py); x.scale(1, 0.24); x.translate(-px, -py);
      x.fillStyle = gr; x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill(); x.restore();
    }
    x.restore();
  }
  // standard floor shapes
  const fPool = (a, color = "#ffffff", R = 2.2) => ({ type: "ellipse", cx: FLOOR_C[0], cy: FLOOR_C[1], r: 525 * R, ry: 0.24, color, a, core: 0.35 });
  // ripple: crisp floor ring r 0.3 -> R1 m over d s (quartOut), width 0.08 m, RED alpha .9 -> 0, plus a white ring 0.1 s
  // behind (.4). Stage pulse = fRipple(sh, t, t0, { R: 2.2, d: 0.8 }).
  function fRipple(sh, t, t0, o = {}) {
    const d = o.d ?? 0.9, R1 = o.R ?? 6;
    for (const [dt, col, a0] of [[0, o.color || RED, 0.9], [0.1, "#ffffff", 0.4]]) {
      const k = pr(t, t0 + dt, t0 + dt + d); if (k <= 0 || k >= 1) continue;
      const R = lerp(0.3, R1, e4(k));
      sh.push({ type: "annulus", R, w: o.w ?? 0.08, color: col, a: a0 * (1 - k) * (o.a ?? 1) });
    }
  }

  // ------------------------------------------------------------------ scene groups register here (see 90_main.js)
  const GROUPS = [];

  // ================================================================== GROUP "open" (prefix op_), video 2 (Incubation)
  // Title card (output 0-3.00) · A (VO 2.37-8.81, VC HOME -> WIDE pull at 3.05: kicker, official lockup in the void, the
  // stage line, floor pool / ◢ ripple / stage-2 pad, four DIM condition pips) · P (VO 76.05-77.21, L2: «مبروك!» burst) ·
  // Q (VO 77.21-84.61, VC WIDE, push to HOME at 82.13: the 40 % share donut and the Axi Select account card, held into the
  // end wipe) · end card (output 85.24-91.00). Spec: scratchpad ep2/mg_ep2_final.json (beats TITLE, A, P, Q, END).
  // t = OUTPUT seconds; tv = t - P = VO seconds. Shots are picked by S.shot.k_beat. Measured onsets (word_onsets, pause
  // map work/vo_pauses_vo.json): «مرحباً» 2.43, «الثانية» 3.78, «Axi» 5.01, «Select» 5.24, pause 5.53-5.68, «مرحلة» 5.68,
  // «Incubation» 6.18, «لتفاصيل» 7.46, «هذه» 8.08, pause 8.70-8.98 · «مبروك» 76.29, pause 76.68-77.33 · «أصبح» 77.33,
  // «حصّة» 78.15, «بنسبة» 78.99, «40» 79.44, «من» 80.81, «الأرباح» 81.01, pause 82.05-82.37, «Axi» 83.00, «Select» 83.27,
  // last syllable ends 84.02.
  const op_SPR = {};

  // ------------------------------------------------------------------ shared helpers
  // MG pages are pure #000 (the k_card special's black). Light comes only from the designed elements.
  function op_black(x, a) {
    if (a <= 0.003) return;
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = cl(a); x.fillStyle = "#000"; x.fillRect(0, 0, x.canvas.width, x.canvas.height); x.restore();
  }
  // one fading layer: draw() paints at full opacity into a frame-size scratch canvas (same base transform), which lands
  // once at alpha a, so nothing inside shows through anything else while it fades
  async function op_fade(x, a, draw) {
    if (a <= 0.003) return;
    if (a >= 0.997) { await draw(x); return; }
    const c = tmp("op_fade", x.canvas.width, x.canvas.height);
    c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalAlpha = 1; c.x.globalCompositeOperation = "source-over"; c.x.filter = "none";
    c.x.clearRect(0, 0, c.width, c.height);
    c.x.setTransform(x.getTransform());
    await draw(c.x);
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = a; x.drawImage(c, 0, 0); x.restore();
  }
  // candle bokeh band kept low (video 1's op_bokeh): the kit layers turned slightly clockwise about the centre column,
  // cached once per `top`, drawn axis-aligned at integer offsets, drifting left 12 and 30 px/s; t is card-local (<= 7 s)
  function op_bokeh(x, t, a, top, rot = 0.092) {
    if (a <= 0.003) return;
    const L = [["bkF", 24, 0.30, 12, 71], ["bkN", 10, 0.45, 30, 73]];
    for (const [k, blur, al, sp, seed] of L) {
      const key = "bk" + k + top;
      let c = op_SPR[key];
      if (!c) { // cache covers screen x -40..2160, y top-50..top+850
        c = op_SPR[key] = U.mk(2200, 900);
        c.x.translate(40, 50 - top); c.x.translate(960, top + 430); c.x.rotate(rot); c.x.translate(-960, -(top + 430));
        c.x.drawImage(bokehLayer(k, blur, seed), -300, top, 2600, 700);
      }
      x.save(); x.globalAlpha *= a * al;
      x.drawImage(c, -40 - Math.round(cl(t, 0, 7) * sp), top - 50);
      x.restore();
    }
  }
  // faded type lands as ONE layer: canvas composites every glyph of a run on its own, so where the glyphs of a joined
  // Arabic word overlap (the joins, kashida, dots) a run drawn at alpha < 1 shows bright 2-3 px seams («مبروك!» on its exit,
  // every headline word while it reveals). op_ink() paints draw(c) at full opacity into a cached device-space buffer that
  // covers the box (X, Y, w, h in the caller's coordinates, under any transform) and lands it once at alpha a; at full
  // opacity it draws straight through
  function op_ink(x, a, X, Y, w, h, draw) {
    if (a <= 0.003) return;
    if (a * x.globalAlpha >= 0.997) { draw(x); return; }
    const M = x.getTransform();
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const [px, py] of [[X, Y], [X + w, Y], [X, Y + h], [X + w, Y + h]]) {
      const dx = M.a * px + M.c * py + M.e, dy = M.b * px + M.d * py + M.f;
      x0 = Math.min(x0, dx); x1 = Math.max(x1, dx); y0 = Math.min(y0, dy); y1 = Math.max(y1, dy);
    }
    x0 = Math.floor(x0) - 2; y0 = Math.floor(y0) - 2;
    const cw = Math.ceil(x1) + 2 - x0, ch = Math.ceil(y1) + 2 - y0;
    if (cw <= 0 || ch <= 0 || cw > 4096 || ch > 4096) return;
    let c = op_SPR.ink;
    if (!c || c.width < cw || c.height < ch) c = op_SPR.ink = U.mk(Math.max(cw, c ? c.width : 0), Math.max(ch, c ? c.height : 0));
    c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalAlpha = 1; c.x.globalCompositeOperation = "source-over"; c.x.filter = "none";
    c.x.clearRect(0, 0, cw, ch);
    c.x.save(); c.x.beginPath(); c.x.rect(0, 0, cw, ch); c.x.clip();
    c.x.setTransform(M.a, M.b, M.c, M.d, M.e - x0, M.f - y0);
    draw(c.x);
    c.x.restore();
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha *= a; x.drawImage(c, 0, 0, cw, ch, x0, y0, cw, ch); x.restore();
  }
  // T() whose alpha (o.a, times the context's) fades the run as one layer
  function op_T(x, s, X, Y, o = {}) {
    const a = o.a ?? 1;
    if (a <= 0.003 || !s) return;
    if (a * x.globalAlpha >= 0.997) { T(x, s, X, Y, o); return; }
    const fam = famOf(s, o), ar = fam === AR && o.ltr !== true, size = o.size ?? 40, w = o.w ?? (ar ? 400 : 300);
    const mw = measure(x, s, w, size, fam, o.ls), al = o.align || (ar ? "right" : "left");
    const L = al === "right" ? X - mw : al === "center" ? X - mw / 2 : X;
    op_ink(x, a, L - 0.5 * size, Y - 1.3 * size, mw + size, 2.0 * size, (c) => T(c, s, X, Y, { ...o, a: 1 }));
  }
  // the kit's headline() (same layout, timing, clip and flag), each word faded as one layer through op_T
  function op_head(x, words, X, Y, size, t, t0, o = {}) {
    if (t < t0) return 0;
    const wgt = o.w ?? 300, a = o.a ?? 1;
    let xx = X;
    if (o.flag) { // the scene's one flag: h .35 em (min 18), gap .5 em, top on the alef line
      const fh = o.flagH ?? Math.max(18, Math.round(size * 0.35));
      flag(x, X + size * 0.5, Y - size * 0.81, fh, { mirror: true, u: pr(t, t0, t0 + 0.22), a });
    }
    words.forEach(([s, c], i) => {
      const fam = isAr(s) ? AR : LAT, mw = measure(x, s, wgt, size, fam);
      const k = e4(pr(t, t0 + 0.05 + i * 0.07, t0 + 0.05 + i * 0.07 + 0.42));
      if (k > 0) {
        x.save(); x.beginPath(); x.rect(xx - mw - 0.45 * size, Y - size * 1.25, mw + 0.9 * size, size * 1.95); x.clip();
        op_T(x, s, xx - mw, Y + (1 - k) * 18, { w: wgt, size, fam, ltr: true, align: "left", color: c === "g" ? GREY : WHITE, a: a * k });
        x.restore();
      }
      xx -= mw + (o.gap ?? size * 0.28);
    });
    return X - xx;
  }
  // one Arabic word (or run) revealed from the right: the clip opens right to left (e4) while the text rises `rise` px;
  // right-aligned at X, baseline Y; the clip spans baseline - 1.25 em .. baseline + 0.70 em (final ي dots, swashes)
  function op_wordR(x, s, X, Y, size, wgt, k, o = {}) {
    if (k <= 0) return;
    const fam = isAr(s) ? AR : LAT, mw = measure(x, s, wgt, size, fam), pad = 0.45 * size;
    const L = X + pad - (mw + 2 * pad) * k;
    x.save(); x.beginPath(); x.rect(L, Y - size * 1.25, X + pad - L, size * 1.95); x.clip();
    op_T(x, s, X, Y + (1 - k) * (o.rise ?? 18), { w: wgt, size, fam, color: o.color || WHITE, a: (o.a ?? 1) * cl(k * 1.3) });
    x.restore();
  }
  // a Latin word right-aligned at X, mask-revealed left to right (Latin builds L -> R); k 0..1
  function op_latLR(x, s, X, Y, size, wgt, k, o = {}) {
    if (k <= 0) return;
    const mw = measure(x, s, wgt, size, LAT), L0 = X - mw - 0.2 * size;
    x.save();
    if (k < 1) { x.beginPath(); x.rect(L0, Y - size * 1.25, (mw + 0.4 * size) * k, size * 1.95); x.clip(); }
    T(x, s, X, Y, { w: wgt, size, fam: LAT, color: o.color || WHITE, align: "right", a: o.a ?? 1 });
    x.restore();
  }
  // logo exit (video 1's op_logoOut): the SELECT tag wipes off right to left behind the red '/' edge, then the axi
  // wordmark sinks into its baseline clip (k 0..1). Same geometry as the kit's logoBuild.
  async function op_logoOut(x, k, cx, cy, w) {
    if (k >= 1) return;
    const ax = await im("axi_part_white.png"), tg = await im("select_tag_white.png");
    const h = (w * LOGO.h) / LOGO.w, X0 = cx - w / 2, Y0 = cy - h / 2, aw = (LOGO.axiW / LOGO.w) * w;
    const tx = X0 + (LOGO.tagX / LOGO.w) * w, tw = w - (LOGO.tagX / LOGO.w) * w;
    const kT = pr(k, 0, 0.62), kA = eio(pr(k, 0.38, 1));
    if (kT < 1) {
      const ym = Y0 + h * 0.62, sl = 0.82, ext = sl * h * 0.6 + 20;
      const ex = lerp(tx + tw + ext, tx - ext, eio(kT)), xe = (yy) => ex + sl * (ym - yy);
      x.save(); x.beginPath();
      x.moveTo(tx - 10, Y0 - 10); x.lineTo(xe(Y0 - 10), Y0 - 10); x.lineTo(xe(Y0 + h + 10), Y0 + h + 10); x.lineTo(tx - 10, Y0 + h + 10); x.closePath(); x.clip();
      x.drawImage(tg, tx, Y0, tw, h); x.restore();
      const bw = 0.07 * h, y1 = Y0 + LOGO.inkTop * h, y2 = Y0 + LOGO.inkBot * h, ba = pr(kT, 0, 0.12) * (1 - pr(kT, 0.8, 1));
      if (ba > 0) {
        x.save(); x.beginPath(); x.rect(tx, Y0, tw, h); x.clip(); x.globalAlpha *= ba; x.fillStyle = RED;
        x.beginPath(); x.moveTo(xe(y1), y1); x.lineTo(xe(y1) + bw, y1); x.lineTo(xe(y2) + bw, y2); x.lineTo(xe(y2), y2); x.closePath(); x.fill();
        x.restore();
      }
    }
    x.save(); x.beginPath(); x.rect(X0 - 40, Y0 - h, aw + 80, 2 * h); x.clip();
    x.globalAlpha *= 1 - kA; x.drawImage(ax, X0, Y0 + kA * h * 0.7, aw, h); x.restore();
  }
  // the stage chip's LIT plate: PANEL + RED rim 1.5 px (the pips' LIT state; tag()'s rim is 2 px)
  function op_litTag(x, X, Y, w, h) {
    tagPath(x, X, Y, w, h); x.fillStyle = PANEL; x.fill();
    x.lineWidth = 1.5; x.strokeStyle = RED; x.stroke();
  }

  // ------------------------------------------------------------------ TITLE CARD (output 0.00-3.00, frames 0-75)
  // Stage chip: TAG 200x64 at x 860-1060, y 284-348 (LIT), DOME 40 px at (985,316), '02' I500 30 RED at x 915, baseline
  // 327. Line 1 (RTL, baseline 470, x 422-1498): mirrored flag h 40 at x 1468, y 373 · metallic '(2)' right edge 1412 ·
  // «مرحلة» A300 120 right edge 1249 · 'Incubation' I300 110 right edge 910. Line 2 (baseline 650): «مع» A300 72 GREY
  // right edge 1330 · the official logo 600x131 at x 590-1190, y 560-691. Exit 2.62-2.94: y -10 px and a black veil over
  // the whole page (one layer: texture, bokeh and type dim together); black from 2.94, hard cut to HOME at 3.00.
  async function op_title(x, t) {
    const out = eio(pr(t, 2.62, 2.94));
    op_bokeh(x, t, 0.35 * e2(pr(t, 0, 0.60)), 500); // unscaled, outside the 2 % push
    x.save();
    const s = 1 + 0.02 * pr(t, 0, 2.6);
    x.translate(960, 540); x.scale(s, s); x.translate(-960, -540);
    triTex(x, 1, { reveal: pr(t, 0, 0.80), dir: "rtl", dx: -4 * t });
    x.translate(0, -10 * out);
    // stage chip: reveals from its right edge with a 20 px rise (expo), 0.20-0.60
    const uc = pr(t, 0.20, 0.60);
    if (uc > 0) {
      const kc = expo(uc), CX = 860, CY = 284, CW = 200, CH = 64;
      x.save(); x.translate(0, (1 - kc) * 20);
      x.beginPath(); x.rect(CX + CW - (CW + 4) * kc - 2, CY - 30, (CW + 4) * kc + 4, CH + 60); x.clip();
      x.globalAlpha *= cl(kc * 1.4);
      op_litTag(x, CX, CY, CW, CH);
      T(x, "02", 915, 327, { w: 500, size: 30, fam: LAT, color: RED });
      sym(x, "dome", 985, 316, 40, { u: pr(t, 0.30, 0.80), k: { grow: pr(t, 0.55, 0.95) } });
      x.restore();
    }
    flag(x, 1468, 373, 40, { mirror: true, u: pr(t, 0.25, 0.47) });
    const k1 = e4(pr(t, 0.35, 0.80));
    if (k1 > 0) { // '(2)' rises 40 px through a clip; one sheen 0.85-1.35 (kit metalCount: the numeral holds its pixels)
      x.save(); x.beginPath(); x.rect(1262, 470 - 132, 172, 132 + 36); x.clip();
      metalCount(x, 2, "(2)", 1412, 470 + 40 * (1 - k1), 120, { w: 200, align: "right", a: cl(k1 * 1.4), sheen: pr(t, 0.85, 1.35) });
      x.restore();
    }
    op_wordR(x, "مرحلة", 1249, 470, 120, 300, e4(pr(t, 0.45, 0.95)));
    op_latLR(x, "Incubation", 910, 470, 110, 300, e4(pr(t, 0.62, 1.02)));
    const km = e4(pr(t, 0.95, 1.30));
    if (km > 0) op_T(x, "مع", 1330, 650 + 16 * (1 - km), { w: 300, size: 72, color: GREY, a: cl(km * 1.3) });
    await logoBuild(x, t, 1.05, 890, 625.6, 600, { d: 0.9, sheen: false });
    x.restore();
    op_black(x, out); // the whole page dims as one layer
  }

  // ------------------------------------------------------------------ A · VO 2.37-8.81 (VC: HOME, pull to WIDE at 3.05)
  // HOME clean while he greets (pool .18). Nothing during the pull (3.05-3.67). Void graphics in screen px at WIDE, all
  // above the keep-out (y 470): kicker «المرحلة الثانية» A300 40 GREY centred 946, baseline 118 + the scene's flag (h 18
  // at x 1081, y 85) · logo 680x149 centred (946,252) · stage line baseline 436 (DOME 60 at (1176,410), «مرحلة» A300 56
  // GREY right edge 1126, 'Incubation' I300 64 right edge 968) · pips 112x72 at y 232, right edge 1194, pitch 128.
  const op_A = { logoT0: 4.84, d: 0.75, cx: 946, cy: 252, w: 680, out0: 6.80, out1: 7.10, x0: 8.40, x1: 8.70 };
  const op_PAD = padPts();
  const op_PADC = op_PAD.concat([op_PAD[0]]);
  const op_PADLEN = (() => { let L = 0; for (let i = 1; i < op_PADC.length; i++) L += Math.hypot(op_PADC[i][0] - op_PADC[i - 1][0], op_PADC[i][1] - op_PADC[i - 1][1]); return L; })();
  function op_floorA(t, sh) {
    const tv = t - P, ex = eio(pr(tv, op_A.x0, op_A.x1));
    // white pool: base .18, lifted to .26 with the ripple, back to .18 with the exit
    sh.push(fPool(lerp(lerp(0.18, 0.26, e2(pr(tv, 5.02, 5.60))), 0.18, ex)));
    if (tv >= 5.02 && tv < 6.70) { // ◢ ring wave through the floorTris field: R = 0.3 + 7(t - 5.02) m, band 1.0 m, peak .55
      const R = 0.3 + 7 * (tv - 5.02), dist = (u, w) => Math.hypot(u + 0.07, w + 0.07) - R;
      sh.push(floorTris((u, w) => { const d = dist(u, w); return Math.abs(d) < 0.5 ? 0.55 * Math.pow(1 - (d / 0.5) * (d / 0.5), 2) : 0; }));
      // the trail (.06) is its own shape, faded through the shape alpha 6.40-6.70 (floorTris buckets alpha into sixths)
      const ta = (0.06 / (0.5 / 6)) * (1 - eio(pr(tv, 6.40, 6.70)));
      if (ta > 0.003) { const tr = floorTris((u, w) => (dist(u, w) <= -0.5 ? 0.06 : 0)); tr.a = ta; sh.push(tr); }
    }
    // stage-2 pad: the RED rim traces by dash progress 6.18-6.58 (0.04 m decal), inner white .14 from 6.30; off with the exit
    if (tv >= 6.18) {
      const rimU = e2(pr(tv, 6.18, 6.58)), inner = e2(pr(tv, 6.30, 6.58)), off = 1 - ex;
      if (off > 0.003) {
        if (inner > 0) sh.push({ type: "poly", pts: op_PAD, color: "#ffffff", a: 0.14 * inner * off });
        if (rimU >= 1) sh.push({ type: "line", pts: op_PAD, close: true, color: RED, a: 0.95 * off, lw: 0.04 * 525 });
        else if (rimU > 0) sh.push({ type: "line", pts: op_PADC, color: RED, a: 0.95, lw: 0.04 * 525, u: (rimU * op_PADLEN) / 20000 });
      }
      // the RED stage pulse from the pad (gone by 6.98 + 0.1). R 1.9 m, not the spec's 2.1: at WIDE the 2.1 m ring's near
      // edge (v -2.14, z .86) lands at screen y 1000-1029, inside the subtitle band (975-1050); at 1.9 m it stays above y 955
      fRipple(sh, t, v(6.18), { R: 1.9, d: 0.8 });
    }
  }
  async function op_drawA(x, t) {
    const tv = t - P, A = op_A;
    if (tv < 3.79 || tv >= A.x1 + 0.02) return;
    // kicker + flag (3.80 / 3.84), fading with the logo 6.80-7.10
    const kk = e4(pr(tv, 3.80, 4.22)), ko = eio(pr(tv, A.out0, A.out1));
    if (kk > 0 && ko < 1) {
      const dy = 16 * (1 - kk);
      op_T(x, "المرحلة الثانية", 946, 118 + dy, { w: 300, size: 40, color: GREY, align: "center", a: cl(kk * 1.3) * (1 - ko) });
      flag(x, 1081, 85 + dy, 18, { mirror: true, u: pr(tv, 3.84, 4.06), a: 1 - ko });
    }
    // the lockup: logoBuild 4.84 (axi 4.84-5.22, tag 5.07-5.48), op_logoOut 6.80-7.10
    if (tv >= A.logoT0 && tv < A.out1) {
      if (tv < A.out0) await logoBuild(x, t, v(A.logoT0), A.cx, A.cy, A.w, { d: A.d, sheen: false });
      else await op_logoOut(x, pr(tv, A.out0, A.out1), A.cx, A.cy, A.w);
    }
    // stage line + pips: one layer for the exit 8.40-8.70
    if (tv < 5.72) return;
    await op_fade(x, 1 - eio(pr(tv, A.x0, A.x1)), async (c) => {
      sym(c, "dome", 1176, 410, 60, { u: pr(tv, 5.72, 6.20), k: { grow: pr(tv, 5.95, 6.40) } });
      op_wordR(c, "مرحلة", 1126, 436, 56, 300, e4(pr(tv, 5.80, 6.22)), { rise: 16, color: GREY });
      op_latLR(c, "Incubation", 968, 436, 64, 300, e4(pr(tv, 6.08, 6.40)));
      if (tv >= 7.46) pips(c, 1194, 232, 112, 72, 128, [{}, {}, {}, {}], { enter: pr(tv, 7.46, 7.46 + 0.64), shimmer: pr(tv, 8.08, 8.58) });
    });
  }

  // ------------------------------------------------------------------ P · VO 76.05-77.21 (L2 close-up, slot x 100-650, y 140-500)
  // «مبروك!» A600 84 right edge 580, baseline 330 (16 px rise, 0.3 s expo, 76.31) + the scene's flag h 29 at x 622, y 262
  // (76.33-76.55); burst of 16 brand particles (10 RED ◢ 10 px, 6 white ▲ 12 px, alpha .6) from (444,300) to r 150
  // (quartOut) 76.31-76.91 (video 1's jn_G); exit 76.92-77.12 (eio, alpha -> 0, y -10, scale .985). The cut is at 77.21.
  const op_P = { word: 76.31, burst: 76.31, o0: 76.92, o1: 77.12, cx: 444, cy: 300 };
  function op_drawP(x, t) {
    const tv = t - P, K = op_P;
    if (tv < K.word || tv > K.o1 + 0.02) return;
    const u = eio(pr(tv, K.o0, K.o1)), ea = 1 - u; if (ea <= 0.003) return;
    x.save(); x.beginPath(); x.rect(100, 140, 550, 360); x.clip(); // safety: the burst radius keeps inside the slot
    x.translate(K.cx, K.cy - 10 * u); x.scale(1 - 0.015 * u, 1 - 0.015 * u); x.translate(-K.cx, -K.cy);
    const kb = pr(tv, K.burst, K.burst + 0.6);
    if (kb > 0 && kb < 1) {
      for (let i = 0; i < 16; i++) {
        const white = [1, 4, 6].includes(i % 8), an = (i / 16) * Math.PI * 2 + (hash(i, 3, 5) - 0.5) * 0.35;
        const r = 150 * (0.6 + 0.4 * hash(i, 4, 6)) * e4(kb), px = K.cx + Math.cos(an) * r, py = K.cy + Math.sin(an) * r;
        x.save(); x.translate(px, py); x.rotate((hash(i, 5, 7) < 0.5 ? -1 : 1) * (2 + 3 * hash(i, 8, 9)) * e2(kb) + an);
        x.globalAlpha = ea * 0.6 * (1 - e2(pr(kb, 0.3, 1))); x.fillStyle = white ? WHITE : RED; x.beginPath();
        if (white) { x.moveTo(0, -6); x.lineTo(6, 6); x.lineTo(-6, 6); } else { x.moveTo(5, -5); x.lineTo(5, 5); x.lineTo(-5, 5); }
        x.closePath(); x.fill(); x.restore();
      }
    }
    const uw = expo(pr(tv, K.word, K.word + 0.30));
    op_T(x, "مبروك!", 580, 330 + (1 - uw) * 16, { w: 600, size: 84, a: ea * cl(uw * 1.4) });
    flag(x, 622, 262, 29, { mirror: true, u: pr(tv, 76.33, 76.55), a: ea });
    x.restore();
  }

  // ------------------------------------------------------------------ Q · VO 77.21-84.61 (VC WIDE, push to HOME 82.13-82.83)
  // Screen-space set, free at both WIDE and HOME, static from 81.98 through the push (the ▲▲▲ idle wave and the skeleton
  // shimmer are held still 81.90 / 82.13-82.83). Headline A300 56 baseline 160 («أصبح لك» GREY right edge 1215 + the
  // scene's flag, «حصّة مشاركة» WHITE right edge 994) · DONUT (1480,430) r 170 w 34, the RED 40 % counter-clockwise from
  // 12 o'clock · metallic '40%' I200 120 centred 1480, baseline 474 · ▲▲▲ at x 1344, y 420 · «لك» A400 36 centred 1250,
  // baseline 455 · 'Axi' I400 30 GREY centred 1706, baseline 506 · «من الأرباح المحقّقة» A300 36 GREY centred 1480,
  // baseline 682 · CARD 520x300 at x 160-680, y 300-600 (cut 36): VAULT 64, «حساب», skeleton 300x44 -> the official logo
  // 300x66 at x 330-630, y 402-468, mini profit chart in corner marks x 192-630, y 490-580 · PROFIT FLOW 10 RED ◢ from
  // (520,488) via (930,190) into the red arc's midpoint (1318,377). No exit: held at full opacity under the end wipe.
  const op_Q = {
    h1: 77.59, h2: 78.05, trk: [78.16, 78.60], arc: [78.99, 79.44], cnt: 79.47, tri: 79.46, lab: 79.50, card: 80.84, sub: 80.79,
    chart: 81.01, flow: 81.30, grow: [81.60, 81.98], push: [82.13, 82.83], dis: [82.86, 82.98], logo: 83.00,
    C: { X: 160, Y: 300, w: 520, h: 300, c: 36 },
    ch: { X: 192, Y: 490, w: 438, h: 90, pitch: 41, x0: 226, body: 20, yb: 576, py: 76 },
  };
  // 10 rising candles [open, close, high, low] in price 0..1 over the chart's 76 px, two RED (down) bodies, the newest brighter
  const op_QC = [[0.04, 0.24, 0.28, 0.01], [0.24, 0.14, 0.27, 0.10], [0.14, 0.36, 0.40, 0.11], [0.36, 0.48, 0.53, 0.33], [0.48, 0.36, 0.51, 0.32],
    [0.36, 0.56, 0.60, 0.33], [0.56, 0.66, 0.71, 0.52], [0.66, 0.74, 0.79, 0.62], [0.74, 0.82, 0.86, 0.70], [0.82, 0.98, 1.00, 0.79]];
  function op_quadAt(k) { const P0 = [520, 488], C = [930, 190], P2 = [1318, 377], m = 1 - k; return [m * m * P0[0] + 2 * m * k * C[0] + k * k * P2[0], m * m * P0[1] + 2 * m * k * C[1] + k * k * P2[1]]; }
  function op_chartQ(x, tv, a) {
    const Q = op_Q, G = Q.ch, t0 = Q.chart, yOf = (p) => G.yb - p * G.py;
    corners(x, G.X, G.Y, G.w, G.h, { L: 18, u: pr(tv, t0 - 0.05, t0 + 0.40), u2: pr(tv, t0 + 0.30, t0 + 0.60), mid: yOf(op_QC[0][0]), a });
    // grown candles and the profit zone (closes above the dotted base line, white .16 -> 0)
    let last = -1, gl = 1;
    op_QC.forEach((q, i) => { const g = pr(tv, t0 + 0.04 * i, t0 + 0.04 * i + 0.25); if (g > 0) { last = i; gl = g; } });
    if (last < 0) return;
    const xOf = (i) => G.x0 + i * G.pitch, base = yOf(op_QC[0][0]);
    if (last >= 1) {
      x.save(); x.globalAlpha *= a;
      const pts = [[xOf(0), base]];
      for (let i = 0; i <= last; i++) { const q = op_QC[i], c = i === last ? lerp(q[0], q[1], e4(pr(gl, 0, 0.73))) : q[1]; pts.push([xOf(i), Math.min(base, yOf(c))]); }
      pts.push([xOf(last), base]);
      let y0 = 1e9; for (const p of pts) y0 = Math.min(y0, p[1]);
      const g = x.createLinearGradient(0, y0, 0, base); g.addColorStop(0, "rgba(255,255,255,0.16)"); g.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g; x.beginPath(); pts.forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]))); x.closePath(); x.fill();
      x.restore();
    }
    for (let i = 0; i <= last; i++) {
      const q = op_QC[i], g = pr(tv, t0 + 0.04 * i, t0 + 0.04 * i + 0.25);
      candle(x, xOf(i), yOf(q[0]), yOf(q[1]), yOf(q[2]), yOf(q[3]), G.body, { grow: g, newest: i === op_QC.length - 1, a });
    }
  }
  async function op_drawQ(x, t) {
    const tv = t - P, Q = op_Q;
    if (tv < Q.h1) return;
    // held still through the push: the ▲▲▲ idle wave pauses 82.13-82.83, the skeleton shimmer stops off-bar at 81.90
    const tW = tv < Q.push[0] ? tv : tv < Q.push[1] ? Q.push[0] : tv - (Q.push[1] - Q.push[0]);
    const tS = Math.min(tv, 81.90);
    // ---- headline (the scene's one flag on its first word group)
    const r1 = op_head(x, [["أصبح", "g"], ["لك", "g"]], 1215, 160, 56, tv, Q.h1, { flag: true });
    if (r1 > 0) op_head(x, [["حصّة", "w"], ["مشاركة", "w"]], 1215 - r1, 160, 56, tv, Q.h2); // r1 includes the word gap
    // ---- donut + '40%' + ▲▲▲ + labels
    if (tv >= Q.trk[0]) {
      const ka = e2(pr(tv, Q.arc[0], Q.arc[1])), kr = e2(pr(tv, Q.lab, Q.lab + 0.30));
      const rest = `rgb(${Math.round(lerp(42, 85, kr))},${Math.round(lerp(43, 87, kr))},${Math.round(lerp(47, 92, kr))})`; // TRACK -> DIM
      const fr = 0.4 * ka < 0.003 ? 0 : 0.4 * ka; // under 3 px of arc the kit's two #000 separators would show alone at 12 o'clock
      donut(x, 1480, 430, 170, 34, fr, { ccw: true, u: e2(pr(tv, Q.trk[0], Q.trk[1])), grow: 4 * e3(pr(tv, Q.grow[0], Q.grow[1])), restCol: rest });
      // the count lands on «40» (79.44): its own e2 curve to 79.47 rounds to 40 first on frame 2001 (sampled at VO 79.43, on
      // screen 79.41-79.45); on the arc's curve it landed on frame 2000 (79.39), one frame before the word
      const kn = e2(pr(tv, Q.arc[0], Q.cnt));
      if (tv >= Q.arc[0]) metalCount(x, 40 * kn, "40%", 1480, 474, 120, { w: 200, align: "center", a: cl(pr(tv, Q.arc[0], Q.arc[0] + 0.12)) });
      chev3(x, 1344, 420, tW, Q.tri);
      const kl = expo(pr(tv, Q.lab, Q.lab + 0.35));
      if (kl > 0) {
        op_T(x, "لك", 1250, 455 + 10 * (1 - kl), { w: 400, size: 36, align: "center", a: cl(kl * 1.3) });
        T(x, "Axi", 1706, 506 + 10 * (1 - kl), { w: 400, size: 30, fam: LAT, color: GREY, align: "center", a: cl(kl * 1.3) });
      }
    }
    op_head(x, [["من", "g"], ["الأرباح", "g"], ["المحقّقة", "g"]], 1480 + op_subW(x) / 2, 682, 36, tv, Q.sub);
    // ---- the Axi Select account card (left third)
    if (tv >= Q.card) {
      const C = Q.C, u = pr(tv, Q.card, Q.card + 0.5), ui = expo(u), uc = expo(pr(tv, Q.card + 0.12, Q.card + 0.62)), ca = cl(uc * 1.3);
      x.save(); x.translate(0, (1 - ui) * 24);
      card(x, C.X, C.Y, C.w, C.h, { u, a: cl(ui * 1.4), c: C.c });
      x.save(); cardClip(x, C.X, C.Y, C.w, C.h, u); x.translate(0, (1 - uc) * 16);
      sym(x, "vault", 224, 364, 64, { u: pr(tv, Q.card + 0.12, Q.card + 0.62), a: ca });
      op_T(x, "حساب", 630, 372, { w: 500, size: 42, a: ca });
      if (tv < Q.dis[1]) skeleton(x, 330, 413, 300, 44, tS, ca, { dissolve: pr(tv, Q.dis[0], Q.dis[1]) });
      x.restore();
      x.save(); cardClip(x, C.X, C.Y, C.w, C.h, u); op_chartQ(x, tv, 1); x.restore(); // inside the card's reveal, no content rise
      x.restore();
      if (tv >= Q.logo) await logoBuild(x, t, v(Q.logo), 480, 435, 300, { d: 0.7, sheen: false });
    }
    // ---- PROFIT FLOW: 10 RED ◢ (12 px), 0.025 s stagger, 0.30 s each (eio), vanishing on contact with the red arc
    if (tv >= Q.flow && tv < Q.flow + 0.225 + 0.30) {
      x.save(); x.fillStyle = RED;
      for (let i = 0; i < 10; i++) {
        const s0 = Q.flow + 0.025 * i, k = pr(tv, s0, s0 + 0.30); if (k <= 0 || k >= 1) continue;
        const e = eio(k), p = op_quadAt(e), sp = (hash(i, 17, 3) - 0.5) * 2;
        const px = p[0] + sp * 26 * (1 - e) * (1 - e), py = p[1] + (hash(i, 19, 5) - 0.5) * 10 * (1 - e);
        x.globalAlpha = cl(k * 8);
        x.beginPath(); x.moveTo(px + 6, py - 6); x.lineTo(px + 6, py + 6); x.lineTo(px - 6, py + 6); x.closePath(); x.fill();
      }
      x.restore();
    }
  }
  function op_subW(x) { // «من الأرباح المحقّقة» as headline() lays it out (word gaps .28 em)
    if (op_SPR.subW == null) op_SPR.subW = measure(x, "من", 300, 36, AR) + measure(x, "الأرباح", 300, 36, AR) + measure(x, "المحقّقة", 300, 36, AR) + 2 * 36 * 0.28;
    return op_SPR.subW;
  }
  function op_floorQ(t, sh) {
    const tv = t - P;
    sh.push(fPool(lerp(0.18, 0.26, e2(pr(tv, 79.44, 79.80))))); // base .18, lifted as '40%' lands; held into the wipe
  }

  // ------------------------------------------------------------------ END CARD (output 85.24-91.00, frames 2131-2275)
  // 90_main's chamfer wipe (VO 84.09-84.61) covers Q; black 85.24-85.36; on the music's ending hit (85.36) the ◢ rows and
  // the logo build start. Logo 720x157 at x 600-1320, y 270-427; RED pill 600x100 at x 660-1260, y 520-620; footer baseline
  // 720; T&C baseline 968. Slow 1.5 % push 85.36-90.20; everything fades to black together 90.20-90.88; black to 91.00.
  function op_triRows(x, t, t0, t1, a, ex) { // the measured ◢ top band (5 rows, pitch 61) revealed row by row from the
    // top; ex = [x0, y0, x1, y1] keeps the marks out of the logo's clear space
    const rows = 5, u = pr(t, t0, t1) * rows;
    if (u <= 0) return;
    const full = Math.floor(u), fr = u - full, ry = (r) => 18 + 61 * r - 26;
    const band = (y0, h, aa) => {
      x.save();
      if (ex) { x.beginPath(); x.rect(-80, -80, W + 160, H + 160); x.rect(ex[2], ex[1], ex[0] - ex[2], ex[3] - ex[1]); x.clip("evenodd"); }
      x.beginPath(); x.rect(-80, y0, W + 160, h); x.clip();
      triTex(x, aa); x.restore();
    };
    if (full > 0) band(-40, ry(full) + 40, a);
    if (full < rows && fr > 0) band(ry(full), 61, a * fr);
  }
  function op_footer(x, cx, Y, ls, a) {
    if (a <= 0.003) return;
    const sz = 30, wg = 500, gap = 60, tr = ls; // Latin runs, left -> right
    const parts = [["TRADE YOUR EDGE.", GREY], ["///", GREY], ["LEARN MORE ON", GREY], ["AXI.COM", RED]];
    const ws = parts.map(([s]) => measure(x, s, wg, sz, LAT, tr) - tr);
    const sp = measure(x, " ", wg, sz, LAT) + tr;
    const total = ws[0] + gap + ws[1] + gap + ws[2] + sp + ws[3];
    let xx = cx - total / 2;
    parts.forEach(([s, c], i) => {
      T(x, s, xx, Y, { size: sz, w: wg, fam: LAT, ltr: true, align: "left", color: c, a, ls: tr });
      xx += ws[i] + (i === 2 ? sp : gap);
    });
  }
  function op_tc(x, cx, Y, a) {
    if (a <= 0.003) return;
    const parts = [{ s: "تخضع عمليات تخصيص رأس المال في", w: 300, size: 34 }, { s: "Axi Select", w: 300, size: 31, fam: LAT }, { s: "لشروط وأحكام البرنامج", w: 300, size: 34 }];
    const gap = 10;
    let total = 0;
    parts.forEach((p, i) => { total += measure(x, p.s, p.w, p.size, p.fam || AR) + (i < parts.length - 1 ? gap + 0.28 * p.size : 0); });
    op_ink(x, a, cx - total / 2 - 24, Y - 1.3 * 34, total + 48, 2.0 * 34, (c) => runs(c, parts.map((p) => ({ ...p, gap: gap + 0.28 * p.size })), cx + total / 2, Y, { color: LEGAL, a: 1 }));
  }
  const op_E = { t0: 85.24, hit: 85.36, pill: 86.21, foot: 86.61, tc: 86.91, sheen: 87.81, push1: 90.20, fade1: 90.88 };
  async function op_end(x, t) {
    const E = op_E;
    if (t >= E.fade1) { op_black(x, 1); return; }
    op_bokeh(x, t - E.t0, 0.32 * e2(pr(t, 85.41, 85.96)), 420); // card-local time; unscaled, outside the push
    x.save();
    const s = 1 + 0.015 * pr(t, E.hit, E.push1);
    x.translate(960, 540); x.scale(s, s); x.translate(-960, -540);
    op_triRows(x, t, E.hit, E.hit + 0.40, 1, [561, 231, 1359, 466]); // logo 600-1320 x 270-427 + 39 px clear space
    await logoBuild(x, t, E.hit, 960, 348.7, 720, { d: 0.85, sheen: false });
    const pu = expo(pr(t, E.pill, E.pill + 0.40));
    if (pu > 0) {
      // the pill and its label fade in as one layer (the label's glyphs, and the red under them, do not show through)
      const draw = (c) => pill(c, 660, 520, 600, 100, "انضم إلى آكسي سيليكت", { kind: "red", scale: lerp(0.92, 1, pu), size: 46 });
      const su = pr(t, E.sheen, E.sheen + 0.50);
      if (su > 0 && su < 1) withSheen(x, 660, 520, 600, 100, su, draw); else op_ink(x, cl(pu * 1.3), 640, 500, 640, 140, draw);
    }
    const fu = e3(pr(t, E.foot, E.foot + 0.40));
    op_footer(x, 960, 720, lerp(10, 4, fu), fu);
    op_tc(x, 960, 968, e2(pr(t, E.tc, E.tc + 0.40)));
    x.restore();
    op_black(x, eio(pr(t, E.push1, E.fade1)));
  }

  // ------------------------------------------------------------------ COVER (YouTube thumbnail, one L2 close-up frame)
  // As video 1's cover: Rabee's face sits at about x 950-1430 (L2 VO 55.84); everything stays in the left half
  // (x 80-900). Logo top-left with its clear space; «الحلقة 2 من 6»; «(2) مرحلة» / «Incubation»; a LIT TAG chip with
  // the dome, «تمويل حتى» and '$20,000' (the Incubation cap); ▲▲▲.
  async function op_cover(x, S) {
    const g = x.createLinearGradient(0, 0, 980, 0);
    g.addColorStop(0, "rgba(0,0,0,0.88)"); g.addColorStop(0.6, "rgba(0,0,0,0.62)"); g.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = g; x.fillRect(0, 0, 980, H);
    x.save(); x.beginPath(); x.rect(0, 0, 940, 340); x.clip(); triTex(x, 1); x.restore();
    await logo(x, 80 + 150, 72 + 32.8, 300); // 300 x 66 at x 80-380, y 72-138
    const R = 880; // right edge of the text block, ~70 px clear of his hair
    runs(x, [{ s: "الحلقة", w: 400, size: 46, color: GREY }, { s: "2", w: 500, size: 44, fam: LAT, color: WHITE }, { s: "من", w: 400, size: 46, color: GREY }, { s: "6", w: 500, size: 44, fam: LAT, color: WHITE }], R, 300, {});
    const w1 = metalWidth("(2)", 150, 300);
    metal(x, "(2)", R, 470, 150, { w: 300, align: "right" });
    T(x, "مرحلة", R - w1 - 38, 470, { w: 400, size: 150, color: WHITE });
    T(x, "Incubation", R, 616, { w: 300, size: 112, fam: LAT, color: WHITE, align: "right" });
    // TAG chip (LIT: red rim): the dome, «تمويل حتى» and '$20,000'; ▲▲▲ to its left
    const sAr = measure(x, "تمويل حتى", 400, 40, AR), sAmt = measure(x, "$20,000", 500, 46, LAT);
    const cw = Math.ceil(104 + sAr + 18 + sAmt + 34), ch = 100, cx0 = R - cw, cy0 = 676;
    tag(x, cx0, cy0, cw, ch, { rim: 1 });
    sym(x, "dome", R - 56, cy0 + 50, 62, {});
    T(x, "تمويل حتى", R - 104, cy0 + 64, { w: 400, size: 40, color: GREY });
    T(x, "$20,000", R - 104 - sAr - 18, cy0 + 66, { w: 500, size: 46, fam: LAT, color: WHITE, align: "right" });
    // ▲▲▲ static at full alpha
    const s3 = 1.3, w3 = 18 * s3, h3 = 12 * s3;
    x.save(); x.fillStyle = RED; x.strokeStyle = RED; x.lineJoin = "round"; x.lineWidth = 2 * s3;
    for (let i = 0; i < 3; i++) { const yy = cy0 + 26 + i * 22 * s3, xx = cx0 - 46 + w3 / 2; x.beginPath(); x.moveTo(xx, yy - h3 / 2); x.lineTo(xx + w3 / 2, yy + h3 / 2); x.lineTo(xx - w3 / 2, yy + h3 / 2); x.closePath(); x.fill(); x.stroke(); }
    x.restore();
  }

  GROUPS.push({
    name: "open",
    floor(t, sh, S) {
      const b = S && S.shot && S.shot.k_beat;
      if (b === "A") op_floorA(t, sh);
      else if (b === "Q") op_floorQ(t, sh);
    },
    async draw(x, t, S) {
      const b = S && S.shot && S.shot.k_beat;
      if (b === "A") await op_drawA(x, t);
      else if (b === "P") op_drawP(x, t);
      else if (b === "Q") await op_drawQ(x, t);
    },
    title(x, t, S) { if (S && S.shot && S.shot.k_beat === "TITLE") return op_title(x, t); },
    end(x, t, S) { if (S && S.shot && S.shot.k_beat === "END") return op_end(x, t); },
    cover(x, S) { return op_cover(x, S); },
  });

  // ================================================================== GROUP «rule» (prefix ru_): beats B, C (B-roll 1), E, F
  // Spec: mg_ep2_final.json beats B, C, E, F and broll_1 (layouts in screen px, measured with the project fonts).
  // Times are VO seconds (tv = t - P). Every hit sits on the measured onsets (word_onsets, work/vo_pauses_vo.json).
  // Shots are picked by S.shot.k_beat, never by times.
  // B  L2   VO  8.81-10.09  red NOTE TAG '!' + «ملاحظة مهمّة»; on «مهمّة» a red underline and one tag pop (no rock)
  // C  BR1  VO 10.09-17.09  B-ROLL 1 «نافذة السحب»: a stage timeline; the DARK pill «سحب الأموال» is clicked and works
  //                         while the window is open; the playhead runs to the FIRST-TRADE chip, a red shutter closes the
  //                         window, the padlock snaps on the pill, the trades print after the cutoff, «هذه المرحلة»
  // E  L1   VO 21.85-28.05  card «للتأهّل لمرحلة» 'Incubation' + dome; 41-tick gauge, threshold notch at 60 %, metallic
  //                         0 -> 60 landing on the /s/ of «ستّين» (27.48), RED '+' (no ▲▲▲: a threshold)
  // F  L5   VO 28.05-32.37  two condition cards: '60+' Edge Score (check 28.96) | '$1,000' counting onto «ألف» (31.71), '+',
  //                         check 31.84; out 32.06-32.28 (the cut at 32.37 is DROP 1)
  // Frame f samples VO 0.04 f - 0.61, so the last frames before the cuts are B 10.03/10.07, E 27.99/28.03, F 32.31/32.35:
  // all clean (exits end 10.01, 27.96, 32.28). B-roll 1 opens and closes on hard cuts at full opacity.
  // Exits fade ONE layer (ru_layer: card + content drawn once into a device-space buffer, then faded).

  const ru_K = {
    // B: «ملاحظة» 8.95, «مهمّة» 9.48-9.87, pause 9.87-10.20 (cut 10.09)
    B: { tag: 8.97, txt: 8.97, acc: 9.48, o0: 9.75, o1: 10.01 },
    // C: إذا 10.20 · أردت 10.48 · القيام 10.70 · بأي 11.16 · عملية 11.46 · سحب 11.82 · للأموال 12.20 · عليك 12.96 ·
    //    القيام 13.28 · بذلك 13.68 · [13.99-14.29] · قبل 14.29 · تنفيذ 14.68 · [15.12-15.31] · أي 15.31 · صفقة 15.59 ·
    //    تداول 16.04 · في 16.38 · هذه 16.46 · المرحلة 16.60-17.07
    C: {
      fr0: 10.12, fr1: 10.57, sd0: 10.42, sd1: 10.72, tl0: 10.20, tl1: 10.70,
      st: 10.48, dome0: 10.55, dome1: 11.05, stLab: 10.60,
      circ: 11.16, zone: 11.16, ext0: 11.30, ext1: 11.65, lab0: 11.62, lab1: 11.95,
      cur0: 11.50, cur1: 11.80, click: 11.84, curOut: 12.10, head1: 11.81, burst: 12.00, allow: 12.30,
      ph: 12.96, pulse: 13.68, mv0: 14.29, mv1: 15.59, words: [14.29, 14.68, 15.31, 15.59], ghost: 14.68,
      allowOut: 15.40, trade: 15.59, shut: 15.66, lock0: 15.70, lock1: 15.88, snap: 15.96, mute0: 15.72, mute1: 15.95,
      cdl: 16.04, br: 16.42,
    },
    // E: للتأهّل 21.96 · لمرحلة 22.50 · Incubation 22.94 · [23.61-23.79] · يجب 23.79 · Edge 25.18 · [26.31-26.46] ·
    //    لا 26.46 · تقلّ 26.80 · عن 27.30 · ستّين /s/ 27.48-27.98 · [27.99-28.12] (cut 28.05)
    E: { card: 22.30, inc0: 22.84, inc1: 23.20, dome0: 22.94, dome1: 23.44, grow0: 23.10, grow1: 23.50, arc: 23.80,
      edge: 25.18, cap: 26.46, c0: 26.80, land: 27.48, plus: 27.50, un0: 27.68, un1: 27.78, o0: 27.74, o1: 27.96 },
    // F: وأقلّ 28.12 · مبلغ 28.60 · [28.95-29.15] · حساب 29.36 · ... · ألف 31.71-31.97 · [31.97-32.40] (cut 32.37 = DROP 1)
    F: { R: 28.46, g0: 28.56, g1: 28.80, sw0: 28.62, sw1: 28.95, chkR: 28.96, L: 28.62, cd0: 28.80, cd1: 29.30, lab: 29.38,
      dis: 31.00, n0: 31.00, land: 31.71, plus: 31.78, chkL: 31.84, o0: 32.06, o1: 32.28 },
  };
  // a metalCount driven by fin * e4(pr(tv, t0, t1)) shows fin (Math.round reaches it) at the fraction ru_pLand(fin) of its
  // window; t1 is chosen so that this landing falls exactly on the spoken number (the quartOut shape is kept)
  const ru_pLand = (fin) => 1 - Math.pow(0.5 / fin, 0.25);
  const ru_t1 = (t0, tLand, fin) => t0 + (tLand - t0) / ru_pLand(fin);

  // ------------------------------------------------------------------ helpers
  // exit envelope (inOutCubic, as the kit's ent(): alpha -> 0, y -10, scale .985) and its transform about a pivot
  function ru_out(tv, a, b) { const u = eio(pr(tv, a, b)); return { a: 1 - u, dy: -10 * u, sc: 1 - 0.015 * u }; }
  function ru_piv(x, ex, cx, cy) { x.translate(cx, cy + ex.dy); x.scale(ex.sc, ex.sc); x.translate(-cx, -cy); }
  // CARD entry: the clip grows from the right edge, 24 px rise + alpha, 0.5 s expo; content 0.12 s later
  function ru_cin(tv, t0) { const u = pr(tv, t0, t0 + 0.5); return { u, ui: expo(u), uc: expo(pr(tv, t0 + 0.12, t0 + 0.62)) }; }
  // one fading layer: draw(c) paints in the caller's coordinates into a device-space buffer (the bbox X, Y, w, h under
  // the current transform), which lands once at alpha a. At a = 1 it draws straight through.
  const ru_BUF = {};
  function ru_layer(x, X, Y, w, h, a, draw) {
    if (a <= 0.003) return;
    if (a >= 0.999) { draw(x); return; }
    const M = x.getTransform(), px = [X, X + w, X, X + w], py = [Y, Y, Y + h, Y + h];
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let i = 0; i < 4; i++) {
      const dx = M.a * px[i] + M.c * py[i] + M.e, dy = M.b * px[i] + M.d * py[i] + M.f;
      x0 = Math.min(x0, dx); x1 = Math.max(x1, dx); y0 = Math.min(y0, dy); y1 = Math.max(y1, dy);
    }
    x0 = Math.max(0, Math.floor(x0) - 2); y0 = Math.max(0, Math.floor(y0) - 2);
    x1 = Math.min(x.canvas.width, Math.ceil(x1) + 2); y1 = Math.min(x.canvas.height, Math.ceil(y1) + 2);
    const cw = x1 - x0, ch = y1 - y0; if (cw <= 0 || ch <= 0) return;
    let c = ru_BUF.c;
    if (!c || c.width < cw || c.height < ch) c = ru_BUF.c = U.mk(Math.max(cw, c ? c.width : 0), Math.max(ch, c ? c.height : 0));
    const cx = c.x;
    cx.setTransform(1, 0, 0, 1, 0, 0); cx.globalAlpha = 1; cx.globalCompositeOperation = "source-over"; cx.filter = "none";
    cx.clearRect(0, 0, cw, ch);
    cx.save(); cx.beginPath(); cx.rect(0, 0, cw, ch); cx.clip();
    cx.setTransform(M.a, M.b, M.c, M.d, M.e - x0, M.f - y0);
    draw(cx);
    cx.restore(); cx.setTransform(1, 0, 0, 1, 0, 0);
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha *= a; x.drawImage(c, 0, 0, cw, ch, x0, y0, cw, ch); x.restore();
  }
  // measured widths, once
  const ru_M = {};
  function ru_w(x, s, w, size) { const k = s + "|" + w + "|" + size; if (!(k in ru_M)) ru_M[k] = measure(x, s, w, size, isAr(s) ? AR : LAT); return ru_M[k]; }
  const ru_mW = (s, size, w = 200) => { const k = "m|" + s + "|" + size + "|" + w; if (!(k in ru_M)) ru_M[k] = metalWidth(s, size, w); return ru_M[k]; };
  // one Arabic word rising out of its mask (the kit headline's motion: clip + 18 px rise, alpha k), right edge Xr; the
  // clip runs from baseline - 1.25 em to baseline + 0.70 em and 0.45 em past both ends (final ي dots and swashes)
  function ru_word(x, s, Xr, Y, size, wgt, color, k) {
    if (k <= 0) return;
    const mw = ru_w(x, s, wgt, size);
    x.save(); x.beginPath(); x.rect(Xr - mw - 0.45 * size, Y - size * 1.25, mw + 0.9 * size, size * 1.95); x.clip();
    T(x, s, Xr - mw, Y + (1 - k) * 18, { w: wgt, size, fam: AR, ltr: true, align: "left", color, a: k });
    x.restore();
  }
  // white tick drawn on by k inside a box centred (cx, cy), half size q
  function ru_tick(x, cx, cy, q, k, lw = 3) {
    if (k <= 0) return;
    x.save(); x.strokeStyle = WHITE; x.lineWidth = lw; x.lineCap = "round"; x.lineJoin = "round"; x.setLineDash([]); x.beginPath();
    const a = [cx - q, cy + q * 0.05], b = [cx - q * 0.3, cy + q * 0.7], c = [cx + q, cy - q * 0.65], k1 = cl(k * 2), k2 = cl(k * 2 - 1);
    x.moveTo(a[0], a[1]); x.lineTo(lerp(a[0], b[0], k1), lerp(a[1], b[1], k1));
    if (k2 > 0) x.lineTo(lerp(b[0], c[0], k2), lerp(b[1], c[1], k2));
    x.stroke(); x.restore();
  }
  // colour mix of two #RRGGBB
  const ru_rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  function ru_mix(a, b, k) {
    if (k <= 0) return a; if (k >= 1) return b;
    const A = ru_rgb(a), B = ru_rgb(b);
    return `rgb(${Math.round(lerp(A[0], B[0], k))},${Math.round(lerp(A[1], B[1], k))},${Math.round(lerp(A[2], B[2], k))})`;
  }
  // a RED metallic-weight '+' (Inter 200) landing: scale .6 -> 1 about its centre + rise, alpha; X = left edge
  function ru_plus(x, X, Y, size, k, rise = 6) {
    if (k <= 0) return;
    const pw = ru_w(x, "+", 200, size), cx = X + pw / 2, cy = Y - 0.36 * size, s = lerp(0.6, 1, k);
    x.save(); x.translate(cx, cy + (1 - k) * rise); x.scale(s, s); x.translate(-cx, -cy);
    T(x, "+", X, Y, { fam: LAT, w: 200, size, color: RED, a: cl(k * 1.5) });
    x.restore();
  }
  // the gauge symbol's red sweep (the kit's gauge shows its red arc only once drawn; W1 jn_gaugeRed)
  function ru_gaugeRed(x, cx, cy, size, val) {
    if (val <= 0) return;
    const k = size / 100, lw = Math.max(2.5, 0.032 * size) * 2.2;
    x.save(); x.strokeStyle = RED; x.lineWidth = lw; x.lineCap = "round"; x.setLineDash([]);
    x.beginPath(); x.arc(cx, cy + 18 * k, 40 * k, Math.PI, Math.PI + Math.PI * val); x.stroke(); x.restore();
  }
  // a condition CARD: entry (ru_cin), check tab, content fill(R) with R = the content's right edge (X + w - 40)
  function ru_card(x, tv, X, Y, w, h, c, t0, tChk, dChk, fill) {
    const ci = ru_cin(tv, t0); if (ci.u <= 0) return;
    x.save(); x.translate(0, (1 - ci.ui) * 24);
    card(x, X, Y, w, h, { u: ci.u, a: cl(ci.ui * 1.25), c, tab: tChk != null ? "check" : null, tabU: tChk != null ? pr(tv, tChk, tChk + dChk) : 0 });
    if (ci.uc > 0) {
      cardClip(x, X, Y, w, h, ci.u);
      x.globalAlpha *= cl(ci.uc * 1.3); x.translate(0, (1 - ci.uc) * 10);
      fill(X + w - 40);
    }
    x.restore();
  }

  // ================================================================== B · VO 8.81-10.09 · NOTE TAG (L2 slot x 100-650, y 140-500)
  function ru_B(x, tv) {
    const K = ru_K.B;
    if (tv < K.tag || tv > K.o1 + 0.02) return;
    const ex = ru_out(tv, K.o0, K.o1);
    ru_layer(x, 100, 220, 560, 160, ex.a, (c) => {
      c.save(); ru_piv(c, ex, 380, 296);
      // RED TAG 96x72 (cuts 26x31) with a white '!': scaleX 0 -> 1 from its right edge (0.2 s expo); on «مهمّة» one pop
      // 1 -> 1.06 -> 1 about its centre (0.2 s), the visible accent (panels never rock)
      const ks = expo(pr(tv, K.tag, K.tag + 0.2)), kp = pr(tv, K.acc, K.acc + 0.2), sp = 1 + 0.06 * Math.sin(Math.PI * kp);
      c.save(); c.translate(636, 296); c.scale(Math.max(0.001, ks), 1); c.translate(-636, -296);
      c.translate(588, 296); c.scale(sp, sp); c.translate(-588, -296);
      tag(c, 540, 260, 96, 72, { fill: "red" });
      T(c, "!", 588, 313.5, { w: 600, size: 48, fam: LAT, align: "center" });
      c.restore();
      // «ملاحظة مهمّة» A500 56, right edge x 520, baseline 318: per word from the right (kit headline motion; its clip
      // reaches baseline + 0.70 em), 9.02 / 9.09
      headline(c, [["ملاحظة", "w"], ["مهمّة", "w"]], 520, 318, 56, tv, K.txt, { w: 500 });
      // 3 px RED underline under «مهمّة» (the left word), drawn right to left (0.25 s e3) at y 338-341
      const ku = e3(pr(tv, K.acc, K.acc + 0.25));
      if (ku > 0) {
        const xr = 520 - ru_w(c, "ملاحظة", 500, 56) - 56 * 0.28, w2 = ru_w(c, "مهمّة", 500, 56);
        c.fillStyle = RED; c.fillRect(xr - w2 * ku, 338, w2 * ku, 3);
      }
      c.restore();
    });
  }

  // ================================================================== C · VO 10.09-17.09 · B-ROLL 1 «نافذة السحب»
  // seeded mulberry32 (the trades: 8 candles right of the cutoff, mostly up, in the price band y 560-700)
  function ru_mb32(a) {
    return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  // the first trade's candle (white when it prints), at x 1014: 14 px right of the cutoff, so the 3 px red line at x 1000
  // runs clear of its body (5 px gap) instead of through it
  const ru_FT = { x: 1014, o: 694, c: 660, h: 646, l: 702 };
  const ru_TR = (() => {
    const r = ru_mb32(159), out = []; let p = ru_FT.c;
    for (let i = 0; i < 8; i++) {
      const up = i === 0 || i === 7 ? true : r() < 0.66, d = up ? -(20 + 16 * r()) : 13 + 10 * r();
      const o = p, c = cl(o + d, 566, 694), h = Math.max(562, Math.min(o, c) - 5 - 11 * r()), l = Math.min(700, Math.max(o, c) + 5 + 10 * r());
      out.push({ o, c, h, l }); p = c;
    }
    return out;
  })();
  const ru_L2 = ["قبل", "تنفيذ", "أي", "صفقة"];
  function ru_C(x, tv) {
    const K = ru_K.C;
    if (tv < 10.0) return;
    // ---- FRAME: red corner triangles (legs 28) fly out from the centre, then the dotted sides draw
    if (tv >= K.fr0) corners(x, 200, 300, 1520, 580, { L: 28, u: pr(tv, K.fr0, K.fr1), u2: pr(tv, K.sd0, K.sd1) });

    // ---- BRACKET «هذه المرحلة» (16.42): 1.5 px white .45 at y 462, x 300-1660, from the centre outward, 8 px end ticks
    if (tv >= K.br) {
      const ub = e3(pr(tv, K.br, K.br + 0.35)), hw = 680 * ub;
      x.save(); x.fillStyle = "rgba(255,255,255,0.45)"; x.fillRect(980 - hw, 461.25, 2 * hw, 1.5);
      if (ub > 0.97) { const ka = pr(ub, 0.97, 1); x.globalAlpha *= ka; x.fillRect(300, 461.25, 1.5, 8 * ka); x.fillRect(1658.5, 461.25, 1.5, 8 * ka); }
      x.restore();
      // the label rises 8 px; while it rises it is clipped at y 458, above the line (461.25), so its descender (ink
      // bottom 455 at rest: the clip never touches the landed label) cannot cross it
      const ul = expo(pr(tv, K.br, K.br + 0.4));
      if (ul > 0) {
        x.save(); if (ul < 1) { x.beginPath(); x.rect(700, 380, 560, 78); x.clip(); }
        T(x, "هذه المرحلة", 980, 446 + 8 * (1 - ul), { w: 300, size: 34, color: GREY, align: "center", a: cl(ul * 1.4) });
        x.restore();
      }
    }

    // ---- WINDOW zone x 300 -> playhead, y 520-718: white .06 with a 2 px white .45 top edge, open from «بأي»; the red
    // shutter ('/' edge, logo slant .82) closes it right to left (15.66-15.96 expo): the zone it passes turns TRACK .5
    const phX = 760 + 240 * eio(pr(tv, K.mv0, K.mv1));
    const za = pr(tv, K.zone, K.zone + 0.28);
    if (za > 0) {
      const us = pr(tv, K.shut, K.shut + 0.3), ue = expo(us), sl = 0.82, Ht = 198;
      const xb = us > 0 ? lerp(1000, 300 - sl * Ht - 4, ue) : 1e4, xt = xb + sl * Ht; // the edge's x at y 718 / at y 520
      x.save(); x.globalAlpha *= za;
      x.beginPath(); x.rect(300, 518, phX - 300, 200); x.clip();
      // open part (left of the edge)
      x.save(); x.beginPath(); x.moveTo(296, 516); x.lineTo(xt + 2 * 0.82, 516); x.lineTo(xb, 718); x.lineTo(296, 718); x.closePath(); x.clip();
      x.fillStyle = "rgba(255,255,255,0.06)"; x.fillRect(300, 520, phX - 300, Ht);
      x.fillStyle = "rgba(255,255,255,0.45)"; x.fillRect(300, 519, phX - 300, 2);
      x.restore();
      if (us > 0) { // closed part, then the red edge on it
        x.save(); x.beginPath(); x.moveTo(xt + 2 * 0.82, 516); x.lineTo(phX + 4, 516); x.lineTo(phX + 4, 718); x.lineTo(xb, 718); x.closePath(); x.clip();
        x.fillStyle = rgba(TRACK, 0.5); x.fillRect(300, 520, phX - 300, Ht);
        x.fillStyle = DIM; x.fillRect(300, 519, phX - 300, 2);
        x.restore();
        if (us < 1) { x.strokeStyle = RED; x.lineWidth = 3; x.beginPath(); x.moveTo(xt + 1.64, 516); x.lineTo(xb, 718); x.stroke(); }
      }
      x.restore();
    }

    // ---- TIMELINE (time runs left to right): 3 px white .7 at y 720, x 260 -> 1660 (arrowhead 12x14), ticks every 70 px
    if (tv >= K.tl0) {
      const ut = e4(pr(tv, K.tl0, K.tl1)), tip = lerp(268, 1660, ut);
      x.save();
      x.fillStyle = "rgba(255,255,255,0.7)"; x.fillRect(260, 718.5, Math.max(0, tip - 10 - 260), 3);
      x.beginPath(); x.moveTo(tip, 720); x.lineTo(tip - 12, 713); x.lineTo(tip - 12, 727); x.closePath(); x.fill();
      x.fillStyle = "rgba(255,255,255,0.25)";
      for (let tx = 370; tx <= 1630; tx += 70) { const ka = cl((tip - 12 - tx) / 30); if (ka > 0) { x.globalAlpha = ka; x.fillRect(tx - 0.75, 721.5, 1.5, 8); } }
      x.restore();
    }

    // ---- START node: 3 px white tick at x 300 (y 700-740); chip TAG 210x60 (DOME + 'Incubation'), «بداية المرحلة»
    if (tv >= K.st) {
      const us = expo(pr(tv, K.st, K.st + 0.4)), dy = 20 * (1 - us);
      x.save(); x.fillStyle = WHITE; const th = 20 * e3(pr(tv, K.st, K.st + 0.3)); x.fillRect(298.5, 720 - th, 3, 2 * th); x.restore();
      x.save(); x.beginPath(); x.rect(510 - 214 * us, 700, 214 * us + 6, 130); x.clip(); x.translate(0, dy);
      x.globalAlpha *= cl(us * 1.3);
      tag(x, 300, 748, 210, 60, {});
      const kp = pr(tv, K.br, K.br + 0.3), sp = 1 + 0.06 * Math.sin(Math.PI * kp); // the dome pulses once on «هذه المرحلة»
      x.save(); x.translate(480, 778); x.scale(sp, sp); x.translate(-480, -778);
      sym(x, "dome", 480, 778, 36, { u: pr(tv, K.dome0, K.dome1), k: { grow: pr(tv, K.dome0 + 0.2, K.dome1) } });
      x.restore();
      T(x, "Incubation", 456, 787, { fam: LAT, w: 400, size: 26, align: "right" });
      x.restore();
      const ul = expo(pr(tv, K.stLab, K.stLab + 0.42));
      if (ul > 0) T(x, "بداية المرحلة", 510, 852 + 16 * (1 - ul), { w: 300, size: 34, color: GREY, a: cl(ul * 1.4) });
    }

    // ---- PLAYHEAD ('now'): 2 px white y 500-718 under a ▼ head (16x12, y 488-500); appears on «عليك», travels 760 -> 1000
    if (tv >= K.ph) {
      const uh = expo(pr(tv, K.ph, K.ph + 0.2)), ul = e3(pr(tv, K.ph, K.ph + 0.3));
      x.save(); x.fillStyle = WHITE; x.globalAlpha *= cl(uh * 1.4);
      x.fillRect(phX - 1, 500, 2, 218 * ul);
      x.beginPath(); x.moveTo(phX - 8, 488 - 6 * (1 - uh)); x.lineTo(phX + 8, 488 - 6 * (1 - uh)); x.lineTo(phX, 500 - 6 * (1 - uh)); x.closePath(); x.fill();
      x.restore();
    }

    // ---- the FIRST TRADE (15.59): the CUTOFF, a 3 px RED line at x 1000 rising 718 -> 500 (0.2 s e4), the white ring on
    // the line, a white candle above it; then the 8 trades print right of the cutoff on «تداول» (one every 0.09 s, so the
    // last has landed by 16.97 and breathes into the cut)
    if (tv >= K.trade) {
      const top = lerp(718, 500, e4(pr(tv, K.trade, K.trade + 0.2)));
      x.fillStyle = RED; x.fillRect(998.5, top, 3, 718 - top);
      const kc = pr(tv, K.trade, K.trade + 0.3), gk = eio(pr(tv, K.cdl, K.cdl + 0.4)); // the first trade's candle greys as the trades print
      candle(x, ru_FT.x, ru_FT.o, ru_FT.c, ru_FT.h, ru_FT.l, 18, { grow: kc, newest: gk <= 0, upColor: gk > 0 && gk < 1 ? ru_mix("#E6E7E9", "#8A898A", gk) : undefined });
      const kr = back(pr(tv, K.trade, K.trade + 0.25), 1.4);
      x.save(); x.fillStyle = "#000000"; x.strokeStyle = WHITE; x.lineWidth = 2; x.globalAlpha *= cl(kr * 3);
      x.beginPath(); x.arc(1000, 720, 12 * kr, 0, Math.PI * 2); x.fill(); x.stroke(); x.restore();
    }
    if (tv >= K.cdl) {
      ru_TR.forEach((q, i) => {
        const t0 = K.cdl + i * 0.09, g = pr(tv, t0, t0 + 0.3); if (g <= 0) return;
        const last = i === ru_TR.length - 1, br = last && g >= 1 ? 6 * Math.sin(((tv - t0 - 0.3) * 2 * Math.PI) / 1.4) : 0;
        const yc = q.c + br;
        candle(x, 1064 + 64 * i, q.o, yc, Math.min(q.h, yc - 3), Math.max(q.l, yc + 3), 18, { grow: g, newest: last });
      });
    }

    // ---- FIRST-TRADE chip (kit tradeChip): the ghost on «تنفيذ», solid on «صفقة» (pop 0.25 s) with its ring on the line.
    // The pop is composed here from the kit's ghost and solid chips (the kit's pop drops the ghost's label at once and its
    // outline within 2 frames): the whole ghost fades linearly over the pop's first 2 frames (.67, .33, gone), and the
    // solid chip pops over it exactly as the kit's (back(p, 1.4) about the chip's centre, alpha cl(3p)); the ring is the kit's, drawn unscaled
    if (tv >= K.ghost) {
      const ug = e3(pr(tv, K.ghost, K.ghost + 0.3)), Yc = 748 + 10 * (1 - ug), p = pr(tv, K.trade, K.trade + 0.25);
      const ga = 1 - pr(tv, K.trade, K.trade + 0.12);
      if (p <= 0) tradeChip(x, 885, Yc, 230, 60, "أول صفقة", { ghost: true, a: ug });
      else if (ga > 0.003) { // the ghost's dashed outline alone (the kit's ghost stroke), fading
        x.save(); x.globalAlpha *= ug * ga; tagPath(x, 885, Yc, 230, 60); x.setLineDash([6, 5]); x.lineWidth = 1.5;
        x.strokeStyle = "rgba(255,255,255,0.4)"; x.stroke(); x.setLineDash([]); x.restore();
      }
      if (p > 0) {
        const sc = p < 1 ? back(p, 1.4) : 1;
        x.save(); x.translate(1000, Yc + 30); x.scale(sc, sc); x.translate(-1000, -(Yc + 30));
        tradeChip(x, 885, Yc, 230, 60, "أول صفقة", { a: ug * cl(3 * p) });
        x.restore();
      }
      const rg = pr(tv, K.trade, K.trade + 0.4);
      if (rg > 0 && rg < 1) {
        x.save(); x.globalAlpha *= ug * (1 - rg); x.strokeStyle = WHITE; x.lineWidth = 2; x.setLineDash([]);
        x.beginPath(); x.arc(1000, 720 - 10 * (1 - ug), lerp(12, 30, e3(rg)), 0, Math.PI * 2); x.stroke(); x.restore();
      }
    }

    // ---- WITHDRAW PILL (DARK 340x76 at x 320-660, y 560-636): the RED circle pops on «بأي», the pill extends leftward out
    // of it, its label reveals onto «سحب»; the click (11.84); one pulse on «بذلك»; muted as the window closes
    if (tv >= K.circ) {
      const pc = expo(pr(tv, K.circ, K.circ + 0.22)), pe = expo(pr(tv, K.ext0, K.ext1)), pm = e3(pr(tv, K.mute0, K.mute1));
      const pt = tv - K.click, pz = pt >= 0 && pt < 0.08 ? 0.96 : 1, kp = pr(tv, K.pulse, K.pulse + 0.3);
      const s = pz * (1 + 0.03 * Math.sin(Math.PI * kp)), cy = 598, cxD = 622;
      x.save(); x.translate(490, cy); x.scale(s, s); x.translate(-490, -cy);
      if (pe > 0) {
        const Xl = lerp(584, 320, pe);
        x.save(); x.globalAlpha *= cl(pe * 3);
        rr(x, Xl, 560, 660 - Xl, 76, 38); x.fillStyle = ru_mix(DARKPILL, TRACK, pm); x.fill();
        x.lineWidth = 1; x.strokeStyle = "rgba(255,255,255,0.07)"; x.stroke();
        x.restore();
      }
      const ul = e4(pr(tv, K.lab0, K.lab1));
      if (ul > 0) {
        x.save(); x.beginPath(); x.rect(573 - 216 * ul, 556, 216 * ul + 8, 84); x.clip();
        T(x, "سحب الأموال", 573, cy + 34 * 0.36, { w: 400, size: 34, color: ru_mix(WHITE, DIM, pm) });
        x.restore();
      }
      // the disc (d 62) with its white ←, scaling 0 -> 1 about its centre
      x.save(); x.translate(cxD, cy); x.scale(pc, pc);
      x.fillStyle = ru_mix(RED, DIM, pm); x.beginPath(); x.arc(0, 0, 31, 0, Math.PI * 2); x.fill();
      const q = 62 * 0.22;
      x.strokeStyle = ru_mix(WHITE, TRACK, pm); x.lineWidth = 3; x.lineCap = "round"; x.lineJoin = "round";
      x.beginPath(); x.moveTo(q, 0); x.lineTo(-q, 0); x.moveTo(-q * 0.15, -q * 0.85); x.lineTo(-q, 0); x.lineTo(-q * 0.15, q * 0.85); x.stroke();
      x.restore();
      x.restore();
      if (pt >= 0 && pt < 0.4) { // the click ring: 2 px RED, r 31 -> 2.6 r (0.4 s)
        const k = pt / 0.4;
        x.save(); x.globalAlpha *= 0.8 * (1 - k); x.strokeStyle = RED; x.lineWidth = 2;
        x.beginPath(); x.arc(cxD, cy, 31 * lerp(1, 2.6, e3(k)), 0, Math.PI * 2); x.stroke(); x.restore();
      }
    }

    // ---- MONEY OUT (12.00-12.60, «للأموال»): 10 RED ◢ marks (14 px) burst from the disc up-left out of the pill, spinning
    if (tv >= K.burst && tv < K.burst + 0.7) {
      x.save(); x.fillStyle = RED;
      for (let j = 0; j < 10; j++) {
        const t0 = K.burst + j * 0.012, k = pr(tv, t0, t0 + 0.48); if (k <= 0 || k >= 1) continue;
        const ex = 300 + 220 * hash(31, j, 1), ey = 330 + 130 * hash(31, j, 2), m = e4(k);
        const px = lerp(622, ex, m), py = lerp(598, ey, m) - 40 * Math.sin(Math.PI * m) * hash(31, j, 3);
        const rot = (hash(31, j, 4) - 0.5) * 5 * m, a = 1 - ss(k), s = 14;
        x.save(); x.globalAlpha = a; x.translate(px, py); x.rotate(rot);
        x.beginPath(); x.moveTo(s / 2, -s / 2); x.lineTo(s / 2, s / 2); x.lineTo(-s / 2, s / 2); x.closePath(); x.fill();
        x.restore();
      }
      x.restore();
    }

    // ---- 'ALLOWED' chip: a RED TAG 52x36 with a white tick, 16 px right of the pill, inside the open window (12.30, back
    // 1.4); fades 15.40-15.68 (linear), before the padlock moves
    if (tv >= K.allow && tv < K.allowOut + 0.3) {
      const k = pr(tv, K.allow, K.allow + 0.25), s = back(k, 1.4), a = cl(k * 3) * (1 - pr(tv, K.allowOut, K.allowOut + 0.28));
      if (a > 0.003) {
        x.save(); x.globalAlpha *= a; x.translate(702, 598); x.scale(s, s); x.translate(-702, -598);
        tag(x, 676, 580, 52, 36, { fill: "red" });
        ru_tick(x, 703, 598, 8, e3(pr(tv, K.allow + 0.12, K.allow + 0.36)), 2.5);
        x.restore();
      }
    }

    // ---- PADLOCK (72 px) drops from y 540 onto the pill's left end (330, 598), the shackle closes and snaps (15.96): a
    // 2-frame 4 px shake and a red ring r 30 -> 70
    if (tv >= K.lock0) {
      const kd = e4(pr(tv, K.lock0, K.lock1)), cyL = lerp(540, 598, kd), open = 1 - e3(pr(tv, K.lock1, K.snap));
      const dx = tv >= K.snap && tv < K.snap + 0.04 ? 4 : tv >= K.snap + 0.04 && tv < K.snap + 0.08 ? -4 : 0;
      const la = e3(pr(tv, K.lock0, K.lock0 + 0.12));
      // its body is solid (the muting pill's colour), so the pill's rim does not show through it
      x.save(); x.globalAlpha *= la; x.fillStyle = ru_mix(DARKPILL, TRACK, e3(pr(tv, K.mute0, K.mute1)));
      rr(x, 330 + dx - 21.6, cyL - 2.9, 43.2, 33.1, 5.8); x.fill(); x.restore();
      sym(x, "padlock", 330 + dx, cyL, 72, { k: { open }, a: la });
      const kr = pr(tv, K.snap, K.snap + 0.4);
      if (kr > 0 && kr < 1) {
        x.save(); x.globalAlpha *= 0.8 * (1 - kr); x.strokeStyle = RED; x.lineWidth = 2;
        x.beginPath(); x.arc(330, 598, lerp(30, 70, e3(kr)), 0, Math.PI * 2); x.stroke(); x.restore();
      }
    }

    // ---- HEADLINE: «سحب الأموال» A300 64 white (baseline 176, the scene's one flag at its right end) on «سحب»; line 2
    // «قبل تنفيذ أي صفقة» A300 48 grey (baseline 244) word by word on the spoken words
    if (tv >= K.head1) headline(x, [["سحب", "w"], ["الأموال", "w"]], 1720, 176, 64, tv, K.head1, { w: 300, flag: true });
    if (tv >= K.words[0]) {
      let xr = 1720;
      ru_L2.forEach((s, i) => {
        ru_word(x, s, xr, 244, 48, 300, GREY, e4(pr(tv, K.words[i] - 0.02, K.words[i] + 0.40)));
        xr -= ru_w(x, s, 300, 48) + 48 * 0.28;
      });
    }

    // ---- CURSOR (34 px): glides from (760,900) to the disc (expo), clicks at 11.84 (.9 for 2 frames), fades 12.10-12.38
    if (tv >= K.cur0 && tv < K.curOut + 0.3) {
      const k = expo(pr(tv, K.cur0, K.cur1)), a = pr(tv, K.cur0, K.cur0 + 0.08) * (1 - pr(tv, K.curOut, K.curOut + 0.28));
      const pt = tv - K.click, pz = pt >= 0 && pt < 0.08 ? 0.9 : 1, cx = lerp(760, 630, k), cy = lerp(900, 606, k);
      x.save(); x.translate(cx, cy); x.scale(pz, pz); cursor(x, 0, 0, a); x.restore();
    }
  }

  // ================================================================== E · VO 21.85-28.05 · QUALIFY: THE GAUGE TO 60 (L1, x >= 1240)
  function ru_E(x, tv) {
    const K = ru_K.E;
    if (tv < K.card || tv > K.o1 + 0.02) return;
    const ex = ru_out(tv, K.o0, K.o1), X = 1240, Y = 200, w = 580, h = 560;
    const t1 = ru_t1(K.c0, K.land, 60), uc = pr(tv, K.c0, t1), val = 60 * e4(uc); // lands on 27.48 (quartOut)
    ru_layer(x, X - 30, Y - 30, w + 60, h + 60, ex.a, (c) => {
      c.save(); ru_piv(c, ex, X + w / 2, Y + h / 2);
      ru_card(c, tv, X, Y, w, h, 48, K.card, null, 0, () => {
        // header + 'Incubation' (mask-reveal left to right, leading the word by 0.1 s) + DOME 64 px (sapling after it)
        T(c, "للتأهّل لمرحلة", 1780, 292, { w: 300, size: 40, color: GREY });
        const ui = e3(pr(tv, K.inc0, K.inc1));
        if (ui > 0) {
          const mw = ru_w(c, "Incubation", 300, 52);
          c.save(); c.beginPath(); c.rect(1780 - mw - 4, 300, (mw + 10) * ui, 80); c.clip();
          T(c, "Incubation", 1780, 356, { fam: LAT, w: 300, size: 52, align: "right" }); c.restore();
        }
        if (tv >= K.dome0) sym(c, "dome", 1304, 292, 64, { u: pr(tv, K.dome0, K.dome1), k: { grow: pr(tv, K.grow0, K.grow1) } });
        // the gauge, centre (1530,640): 41 radial ticks (TRACK, 4 px, r 176-194; majors r 176-204) power on left to right
        // on «يجب»; ticks 0-24 light with the counter (white for 2 frames, then RED) and unlight right to left in the exit
        const cx = 1530, cy = 640;
        for (let i = 0; i <= 40; i++) {
          const ua = pr(tv, K.arc + i * 0.012, K.arc + i * 0.012 + 0.1); if (ua <= 0) continue;
          let col = TRACK;
          if (i <= 24 && uc > 0) {
            const th = Math.min(2.5 * i, 59.5), pl = 1 - Math.pow(1 - th / 60, 0.25), tl = K.c0 + pl * (t1 - K.c0);
            const tu = K.un0 + ((24 - i) / 24) * (K.un1 - K.un0);
            if (tv >= tl && tv < tu) col = tv - tl < 0.08 ? WHITE : RED;
          }
          const r1 = i % 10 === 0 ? 204 : 194, g = e3(ua);
          c.save(); c.translate(cx, cy); c.rotate(Math.PI + (Math.PI * i) / 40); c.globalAlpha *= g; c.fillStyle = col;
          c.fillRect(176, -2, (r1 - 176) * (0.35 + 0.65 * g), 4); c.restore();
        }
        // red glow sprite (r 22) riding the leading tick while the counter runs
        if (uc > 0 && tv < K.land + 0.2) {
          const an = Math.PI + (Math.PI * Math.min(val, 60)) / 100, ga = tv < K.land ? cl(uc * 8) : 1 - eio(pr(tv, K.land, K.land + 0.2));
          glow(c, cx + Math.cos(an) * 186, cy + Math.sin(an) * 186, 22, RED, 0.85 * ga);
        }
        // DIM reference notch at the apex (r 212-226, unlabelled) and the white threshold notch at 60 % (r 212-230,
        // 3 px), RED with a glow (r 36, 0.3 s) on the landing
        const n20 = e3(pr(tv, K.arc + 20 * 0.012, K.arc + 20 * 0.012 + 0.25)), n24 = e3(pr(tv, K.arc + 24 * 0.012, K.arc + 24 * 0.012 + 0.25));
        if (n20 > 0) { c.save(); c.translate(cx, cy); c.rotate(1.5 * Math.PI); c.globalAlpha *= n20; c.fillStyle = DIM; c.fillRect(212, -1.5, 14 * n20, 3); c.restore(); }
        if (n24 > 0) {
          const lit = tv >= K.land, an = 1.6 * Math.PI;
          if (lit) { const k = pr(tv, K.land, K.land + 0.3); if (k < 1) glow(c, cx + Math.cos(an) * 221, cy + Math.sin(an) * 221, 36, RED, Math.pow(Math.sin(Math.PI * k), 3)); }
          c.save(); c.translate(cx, cy); c.rotate(an); c.globalAlpha *= n24; c.fillStyle = lit ? RED : WHITE; c.fillRect(212, -1.5, 18 * n24, 3); c.restore();
        }
        // '60+' as one group (179 px) centred on x 1530: metallic '60' I200 112 (baseline 590) + RED '+' I200 78 (baseline
        // 572), 8 px apart; the counter starts as '0' in the last slot
        const w60 = ru_mW("60", 112), wp = ru_w(c, "+", 200, 78), X0 = cx - (w60 + 8 + wp) / 2;
        const ua0 = e3(pr(tv, K.c0 - 0.08, K.c0 + 0.08));
        if (ua0 > 0) metalCount(c, val, "60", X0, 590, 112, { w: 200, a: ua0 });
        ru_plus(c, X0 + w60 + 8, 572, 78, expo(pr(tv, K.plus, K.plus + 0.12)));
        // labels
        const ue = expo(pr(tv, K.edge, K.edge + 0.4));
        if (ue > 0) T(c, "Edge Score", cx, 636 + 12 * (1 - ue), { fam: LAT, w: 300, size: 36, align: "center", a: cl(ue * 1.4) });
        const uk = expo(pr(tv, K.cap, K.cap + 0.4));
        if (uk > 0) T(c, "الحدّ الأدنى للتأهّل", cx, 700 + 12 * (1 - uk), { w: 300, size: 34, align: "center", color: GREY, a: cl(uk * 1.4) });
      });
      c.restore();
    });
  }

  // ================================================================== F · VO 28.05-32.37 · THE TWO CONDITIONS (L5: cards x 100-570 | 1350-1820)
  function ru_F(x, tv) {
    const K = ru_K.F;
    if (tv < K.R || tv > K.o1 + 0.02) return;
    const ex = ru_out(tv, K.o0, K.o1);
    ru_layer(x, 70, 290, 1780, 380, ex.a, (c) => {
      c.save(); ru_piv(c, ex, 960, 480);
      // RIGHT · «الشرط الأول»: mini gauge sweeping to 60 %, '60' + RED '+', 'Edge Score'; its check tab on 28.96
      ru_card(c, tv, 1350, 320, 470, 320, 38, K.R, K.chkR, 0.25, (R) => {
        T(c, "الشرط الأول", R, 392, { w: 400, size: 36, color: GREY });
        sym(c, "gauge", 1424, 394, 84, { u: pr(tv, K.g0, K.g1), k: { val: 0 } });
        ru_gaugeRed(c, 1424, 394, 84, 0.6 * e3(pr(tv, K.sw0, K.sw1)));
        const pw = ru_w(c, "+", 200, 100);
        T(c, "+", R - pw, 530, { fam: LAT, w: 200, size: 100, color: RED });
        metal(c, "60", R - pw - 6, 530, 100, { align: "right" });
        T(c, "Edge Score", R, 584, { fam: LAT, w: 300, size: 34, align: "right" });
      });
      // LEFT · «الشرط الثاني»: CANDLES (your trading account), the amount's skeleton, '$1,000' counting onto «ألف», '+'
      ru_card(c, tv, 100, 320, 470, 320, 38, K.L, K.chkL, 0.20, (R) => {
        T(c, "الشرط الثاني", R, 392, { w: 400, size: 36, color: GREY });
        if (tv >= K.cd0) sym(c, "candles", 174, 394, 84, { u: pr(tv, K.cd0, K.cd1) });
        if (tv < K.dis + 0.12) skeleton(c, 230, 478, 300, 44, tv, 1, { dissolve: pr(tv, K.dis, K.dis + 0.12) });
        if (tv >= K.n0) metalCount(c, 1000 * e4(pr(tv, K.n0, ru_t1(K.n0, K.land, 1000))), "$1,000", 465, 530, 100, { w: 200, align: "right" });
        ru_plus(c, 471, 530, 100, expo(pr(tv, K.plus, K.plus + 0.18)), 8);
        const ul = expo(pr(tv, K.lab, K.lab + 0.42));
        if (ul > 0) T(c, "في حساب التداول", R, 584 + 18 * (1 - ul), { w: 400, size: 34, a: cl(ul * 1.4) });
      });
      c.restore();
    });
  }

  // ================================================================== register
  GROUPS.push({
    name: "rule",
    async broll(x, t, S, id) {
      if (id !== 1) return;
      const lt = Math.max(0, t - S.shot.f0 / 25), tv = t - P;
      await brScene(x, t, lt, { cz0: 0, bokehY: 362 }, async (c) => ru_C(c, tv));
    },
    draw(x, t, S) {
      const k = S.shot && S.shot.k_beat;
      if (k === "B") ru_B(x, t - P);
      else if (k === "E") ru_E(x, t - P);
      else if (k === "F") ru_F(x, t - P);
    },
  });

  // ================================================================== GROUP "stairs" (prefix sr_), video 2 (Incubation)
  // Beats (VO s, spec mg_ep2_final.json): D 17.09-21.85 (VC EW): the six-stage staircase is built and the RULE MARK is
  // stamped on every landing as a red comet climbs it · N 67.53-72.37 (VC EW): the set already stands, the flag climbs
  // S2 -> S3 and Acceleration lights · O 72.37-76.05 (L3): the six episode chips and the next-video deck.
  // Shots are picked by S.shot.k_beat ('D', 'N', 'O'), never by times. t = OUTPUT s, tv = t - P = VO s.
  // The staircase is video 1's (W1 32_stages.js): authored in EW screen px and drawn through VM x ewP (plate space), so it
  // rides the drift and stays welded to the floor pad; line widths stay in screen px. Floor light goes through floor().
  // Measured onsets (word_onsets, pause map work/vo_pauses_vo.json): «القاعدة» 17.52, pause 18.01-18.41, «يتم» 18.41,
  // «جميع» 19.62, pause 20.13-20.32, «مراحل» 20.30, pause 20.90-21.17, «Axi» 21.17, «Select» 21.53 · pause 67.47-67.64,
  // «مؤهّلاً» 68.07, «للانتقال» 68.57, «للمرحلة» 69.19, «الثالثة» 69.69, «Acceleration» 71.30-72.08, pause 72.08-72.45 ·
  // «سنتعرّف» 72.83, «بالتفصيل» 73.71, pause 74.39-74.58, «في» 74.57, «القادم» 75.55-76.08.
  const sr_bump = (tv, t0, d) => { const u = pr(tv, t0, t0 + d); return u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0; };
  function sr_xf(x, cx, cy, o) { x.translate(cx, cy + (o.dy || 0)); const s = o.sc ?? 1; x.scale(s, s); x.translate(-cx, -cy); }
  // polylines: length, point at arc length, partial stroke d0..d1 (one path, miter joins)
  function sr_plen(p) { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; }
  function sr_at(p, d) {
    for (let i = 1; i < p.length; i++) {
      const l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
      if (d <= l || i === p.length - 1) { const k = l ? cl(d / l) : 0; return [lerp(p[i - 1][0], p[i][0], k), lerp(p[i - 1][1], p[i][1], k)]; }
      d -= l;
    }
    return p[p.length - 1];
  }
  function sr_poly(x, p, d0, d1) {
    if (d1 <= d0) return;
    let acc = 0, on = false;
    x.beginPath();
    for (let i = 1; i < p.length; i++) {
      const [ax, ay] = p[i - 1], [bx, by] = p[i], l = Math.hypot(bx - ax, by - ay);
      const s0 = Math.max(d0, acc), s1 = Math.min(d1, acc + l);
      if (s1 > s0 && l > 0) {
        if (!on) { x.moveTo(ax + ((bx - ax) * (s0 - acc)) / l, ay + ((by - ay) * (s0 - acc)) / l); on = true; }
        x.lineTo(ax + ((bx - ax) * (s1 - acc)) / l, ay + ((by - ay) * (s1 - acc)) / l);
      }
      acc += l;
    }
    if (on) x.stroke();
  }
  // one fading layer: draw() paints at full opacity into a frame-size scratch canvas (same base transform) that lands
  // once at alpha a, so nothing inside shows through anything else while it fades (used only during exits)
  function sr_fade(x, a, draw, nm = "sr_fade") {
    if (a <= 0.003) return;
    if (a >= 0.997) { draw(x); return; }
    const c = tmp(nm, x.canvas.width, x.canvas.height), ga = x.globalAlpha;
    c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalAlpha = 1; c.x.globalCompositeOperation = "source-over"; c.x.filter = "none";
    c.x.clearRect(0, 0, c.width, c.height);
    c.x.setTransform(x.getTransform());
    draw(c.x);
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = ga * a; x.drawImage(c, 0, 0); x.restore();
  }
  // a readout line's entry: rises 20 px, 0.45 s expo (video 1's st_readout)
  const sr_ln = (tv, t0) => { if (tv < t0) return null; const ui = expo(pr(tv, t0, t0 + 0.45)); return { a: cl(ui * 1.25), dy: (1 - ui) * 20 }; };
  // stage-card names as cached 2x sprites: under the drifting EW transform the text scale changes every frame, so live
  // text would re-rasterize its glyphs each frame; a cached sprite only scales (and stays crisp at 2x)
  const sr_SPR = {};
  function sr_name(x, s, X, Y, a) {
    if (a <= 0.003) return;
    let c = sr_SPR[s];
    if (!c) {
      const w = Math.ceil(measure(x, s, 400, 26, LAT)) + 10;
      c = sr_SPR[s] = U.mk(w * 2, 80); c.ww = w;
      c.x.scale(2, 2); T(c.x, s, 5, 30, { w: 400, size: 26, color: WHITE });
    }
    x.save(); x.globalAlpha *= a; x.drawImage(c, X - 5, Y - 30, c.ww, 40); x.restore();
  }
  // 'you are here' marker: 2 px white pole with a mirrored flag at its top (it flies toward the climb, RTL)
  function sr_marker(x, X, Yb, a, ph = 54, fh = 26, pw = 2) {
    if (a <= 0.003) return;
    x.save(); x.globalAlpha *= a;
    x.fillStyle = WHITE; x.fillRect(X - pw / 2, Yb - ph, pw, ph);
    flag(x, X - pw / 2 - 0.74 * fh, Yb - ph, fh, { mirror: true });
    x.restore();
  }
  // a TAG's DONE cut: the top-left cut fills RED with a white tick (tag()'s geometry, alpha multiplied), lw = line unit
  function sr_doneCut(x, X, Y, h, dn, lw = 1) {
    if (dn <= 0) return;
    const q = 0.355 * h, kk = e3(pr(dn, 0.2, 1));
    x.save(); x.globalAlpha *= e3(dn); x.setLineDash([]);
    x.fillStyle = RED; x.beginPath(); x.moveTo(X, Y); x.lineTo(X + q, Y); x.lineTo(X, Y + 0.43 * h); x.closePath(); x.fill();
    x.strokeStyle = WHITE; x.lineWidth = 2 * lw; x.lineCap = "round"; x.lineJoin = "round";
    x.beginPath(); x.moveTo(X + q * 0.16, Y + q * 0.42);
    if (kk > 0) x.lineTo(X + q * 0.16 + q * 0.14 * cl(kk * 2), Y + q * 0.42 + q * 0.14 * cl(kk * 2));
    if (kk > 0.5) x.lineTo(X + q * 0.3 + q * 0.26 * cl(kk * 2 - 1), Y + q * 0.56 - q * 0.36 * cl(kk * 2 - 1));
    x.stroke(); x.restore();
  }
  // a video-1 symbol all in white (its red element too) at alpha a: drawn into a small layer and recoloured source-in
  // (the kit's own helper for this is private, k2_)
  function sr_symMono(x, name, cx, cy, size, a, k) {
    if (a <= 0.003) return;
    const w = Math.ceil(size * 2.6), c = tmp("sr_mono" + w, w, w);
    c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalAlpha = 1; c.x.globalCompositeOperation = "source-over"; c.x.filter = "none";
    c.x.clearRect(0, 0, w, w);
    sym(c.x, name, w / 2, w / 2, size, { a: 1, k, color: WHITE });
    c.x.globalCompositeOperation = "source-in"; c.x.fillStyle = WHITE; c.x.fillRect(0, 0, w, w); c.x.globalCompositeOperation = "source-over";
    x.save(); x.globalAlpha *= a; x.drawImage(c, cx - w / 2, cy - w / 2, w, w); x.restore();
  }

  // ---------------------------------------------------------------- FLOOR (D, N): base pool .18, the pad, ripple, pulses
  // D's cut-in ripple is fRipple's ring (r 0.3 -> 6 m, e4, 0.9 s, 0.08 m wide, RED .9 -> 0, a white ring .4 0.1 s behind)
  // with its near side kept out of the subtitle band: where the ring would reach screen y 900-960 its floor shape is cut
  // in floor space (v rows under the current VM) and fades over 12 bands of 5 px (edges on whole pixel rows, so the bands
  // leave no seams); nothing of it lands below y 960. A frame that does not reach y 900 pushes fRipple's own annulus.
  const sr_RIP = { y0: 900, y1: 960, n: 12, w: 0.08 };
  const sr_vAtY = (y) => 1132.6 / ((y - VM[5]) / VM[3] - 626.4) - 3; // floor depth v (m) whose row lands on screen y
  function sr_clipV(P, c, above) { // Sutherland-Hodgman on floor (u, v) points: keep v >= c (above) or v <= c
    const out = [], n = P.length, ins = (p) => (above ? p[1] >= c : p[1] <= c);
    for (let i = 0; i < n; i++) {
      const p = P[i], q = P[(i + 1) % n], ip = ins(p);
      if (ip) out.push(p);
      if (ip !== ins(q)) { const k = (c - p[1]) / (q[1] - p[1]); out.push([p[0] + (q[0] - p[0]) * k, c]); }
    }
    return out;
  }
  function sr_ringPts(R, w, n = 64) { // the annulus as one keyhole outline (outer CCW, inner CW, bridged at the far side)
    const ro = R + w / 2, ri = Math.max(0.01, R - w / 2), P = [];
    for (let i = 0; i <= n; i++) { const a = Math.PI / 2 + (i / n) * 2 * Math.PI; P.push([Math.cos(a) * ro, Math.sin(a) * ro]); }
    for (let i = 0; i <= n; i++) { const a = Math.PI / 2 - (i / n) * 2 * Math.PI; P.push([Math.cos(a) * ri, Math.sin(a) * ri]); }
    return P;
  }
  function sr_ripple(sh, t, t0, R1, d) {
    const { y0, y1, n, w } = sr_RIP;
    for (const [dt, col, a0] of [[0, RED, 0.9], [0.1, "#ffffff", 0.4]]) {
      const k = pr(t, t0 + dt, t0 + dt + d); if (k <= 0 || k >= 1) continue;
      const R = lerp(0.3, R1, e4(k)), a = a0 * (1 - k), vTop = VM ? sr_vAtY(y0) : -99;
      if (R + w / 2 <= -vTop) { sh.push({ type: "annulus", R, w, color: col, a }); continue; }
      const ring = sr_ringPts(R, w), put = (Q, aa) => { if (Q.length > 2) sh.push({ type: "poly", pts: Q.map(([u, vv]) => floorP(u, vv)), color: col, a: aa }); };
      put(sr_clipV(ring, vTop, true), a);
      for (let i = 0; i < n; i++) {
        const vA = sr_vAtY(y0 + ((y1 - y0) * i) / n), vB = sr_vAtY(y0 + ((y1 - y0) * (i + 1)) / n); // vA > vB
        if (R + w / 2 <= -vA) break;
        put(sr_clipV(sr_clipV(ring, vB, true), vA, false), a * (1 - (i + 0.5) / n));
      }
    }
  }
  const sr_PAD = padPts();
  const sr_PADC = sr_PAD.concat([sr_PAD[0]]), sr_PADLEN = sr_plen(sr_PADC); // the traced rim runs the closed outline
  function sr_floor(t, sh, S) {
    const k = S.shot && S.shot.k_beat;
    if (k !== "D" && k !== "N") return;
    const tv = t - P, D = k === "D";
    const off = 1 - eio(D ? pr(tv, 21.44, 21.66) : pr(tv, 72.06, 72.26)); // the pad and the pool go out with the fold
    if (off <= 0.003) return;
    sh.push(fPool(0.18 * off)); // on at once on the cut
    if (D) sr_ripple(sh, t, v(17.09), 6, 0.9); // the floor ripple on the hard cut, kept out of the subtitle band
    const rimU = D ? e2(pr(tv, 17.11, 17.45)) : 1, inner = D ? e2(pr(tv, 17.21, 17.45)) : 1;
    if (inner > 0) sh.push({ type: "poly", pts: sr_PAD, color: "#ffffff", a: 0.14 * inner * off });
    if (rimU >= 1) sh.push({ type: "line", pts: sr_PAD, close: true, color: RED, a: 0.95 * off, lw: 0.04 * 525 }); // crisp RED decal
    else if (rimU > 0) sh.push({ type: "line", pts: sr_PADC, color: RED, a: 0.95, lw: 0.04 * 525, u: (rimU * sr_PADLEN) / 20000 }); // kit dash: px of 20000
    // STAGE PULSE from the pad (crisp ring r 0.3 -> 2.1 m, 0.8 s). It fires late in the shot, so its tail goes out with
    // the pad (o.a = off): nothing is left on the floor when the cut comes.
    fRipple(sh, t, v(D ? 21.17 : 71.30), { R: 2.1, d: 0.8, a: off });
  }

  // ---------------------------------------------------------------- THE STAIRCASE (D, N): EW screen px through VM x ewP
  // Landings 240 wide, cards 230 (video 1's code): S1 1540-1780 @742 ... S6 340-580 @242; risers at 1540 ... 580; the
  // ground line runs from the pad's right edge floorP(1,0) = (1060,742) to x 1780.
  const sr_LX = [1540, 1300, 1060, 820, 580, 340], sr_LY = [742, 642, 542, 442, 342, 242], sr_CW = 230, sr_GX = 1780;
  // main line: ground to the first riser, then the stair up to S6's open end
  const sr_MAIN = [[1060, 742], [1540, 742], [1540, 642], [1300, 642], [1300, 542], [1060, 542], [1060, 442], [820, 442], [820, 342], [580, 342], [580, 242], [340, 242]];
  const sr_EXT = [[1540, 742], [1780, 742]]; // S1's landing, right of the first riser
  const sr_ML = sr_plen(sr_MAIN); // 2180 (ground 0..480, stair 480..2180)
  const sr_LD0 = (k) => 480 + 100 * k + 240 * (k - 1); // arc length where landing k (1..5) starts (its right end)
  function sr_ewM() { // EW screen px -> current screen px (= VM x ewP as one affine map)
    const k = 1 / EW_S, ex = AX - AX * k, ey = AY - (AY + EW_DY) * k;
    return [VM[0] * k, 0, 0, VM[3] * k, VM[0] * ex + VM[4], VM[3] * ey + VM[5]];
  }
  function sr_symK(k, u, lt) {
    switch (STAGES[k].sym) {
      case "sprout": return { grow: u };
      case "dome": return { grow: pr(u, 0.45, 1) };
      case "chev": return { ignite: u, t: lt };
      case "summit": return { flagU: pr(u, 0.55, 1) };
      default: return {};
    }
  }
  // card state k (0..5) at VO tv: pop (unfold / fold), lit, done, pre (pre-highlight), symU (draw-on), lt (symbol clock),
  // direct (DIM straight to DONE: no red rim on the way)
  function sr_cs(k, tv, seg) {
    const s = { pop: 1, lit: 0, done: 0, pre: 0, symU: 1, lt: 0, direct: 0 };
    if (seg === "D") {
      s.pop = expo(pr(tv, 17.70 + 0.08 * k, 17.90 + 0.08 * k)); // pop in DIM, S1 -> S6, 17.70-18.30
      if (k === 0) { const u = pr(tv, 18.41, 18.71); s.lit = e2(u); s.done = u; s.direct = 1; } // video 1's stage, passed
      if (k === 1) { s.lit = e2(pr(tv, 18.41, 18.76)); s.symU = pr(tv, 18.45, 18.95); } // Incubation lights, the DOME draws
      const f0 = 21.42 + (5 - k) * 0.008; s.pop *= 1 - eio(pr(tv, f0, f0 + 0.16)); // fold, S6 first, gone by 21.62
    } else if (seg === "N") { // the standing set: S1 DONE, S2 LIT, S3-S6 DIM from the first frame
      if (k === 0) { s.lit = 1; s.done = 1; }
      if (k === 1) { s.lit = 1; s.done = pr(tv, 69.62, 69.92); } // S2 turns DONE as the marker leaves it
      if (k === 2) { s.pre = e2(pr(tv, 68.57, 68.82)); s.lit = e2(pr(tv, 71.30, 71.65)); s.symU = pr(tv, 71.30, 71.80); s.lt = tv - 71.30; }
      const f0 = 72.04 + (5 - k) * 0.008; s.pop = 1 - eio(pr(tv, f0, f0 + 0.18)); // fold, S6 first, gone by 72.26
    }
    return s;
  }
  // stage card k: TAG 230x88 at (x_left+5, y_k-96). DIM: outline white .25, symbol DIM, name .55, no amount. LIT: PANEL,
  // RED 1.5 px rim, symbol white + red, name white, amount. DONE: fill .7, rim white .25, red cut + tick.
  function sr_card(x, k, s, lw) {
    if (s.pop <= 0.002) return;
    const X = sr_LX[k] + 5, Y = sr_LY[k] - 96, w = sr_CW, h = 88, ST = STAGES[k], ly = sr_LY[k];
    x.save();
    if (s.pop < 1) { x.translate(0, ly); x.scale(1, Math.max(0.002, s.pop)); x.translate(0, -ly); x.globalAlpha *= cl(s.pop * 1.25); }
    tagPath(x, X, Y, w, h);
    const fillA = 0.96 * s.lit * (1 - 0.27 * s.done);
    if (fillA > 0.003) { x.fillStyle = panelFill(x, Y, h, +fillA.toFixed(3)); x.fill(); }
    x.lineWidth = 1.5 * lw;
    const whiteA = s.direct ? 0.25 : (1 - s.lit) * lerp(0.25, 0.6, s.pre) + s.lit * s.done * 0.25, redA = s.direct ? 0 : s.lit * (1 - s.done);
    if (whiteA > 0.003) { x.strokeStyle = `rgba(255,255,255,${whiteA.toFixed(3)})`; x.stroke(); }
    if (redA > 0.003) { x.strokeStyle = rgba(RED, redA.toFixed(3)); x.stroke(); }
    sr_doneCut(x, X, Y, h, s.done, lw);
    const cx = X + 38, cy = Y + 44; // symbol 40 px at (x+18, y+24)
    if (s.lit < 1) sym(x, ST.sym, cx, cy, 40, { dim: true, a: 1 - s.lit, k: sr_symK(k, 1, 0) });
    if (s.lit > 0) sym(x, ST.sym, cx, cy, 40, { u: s.symU, a: s.lit, k: sr_symK(k, s.symU, s.done > 0 ? 0.15 : s.lt) });
    sr_name(x, ST.en, X + 68, Y + 40, lerp(0.55, 1, s.lit));
    if (s.lit > 0.3) metal(x, fmtMoney(ST.amt), X + 68, Y + 70, 24, { w: 300, a: e2(pr(s.lit, 0.3, 1)) });
    x.restore();
  }
  const sr_MK = (k) => [sr_LX[k] + 213, sr_LY[k] - 96]; // marker foot on card k's top edge, 22 px from its right end
  // k -> k+1: along card k's top, up 24 px right of the riser (so the flag, flying 20 px left of its pole, passes clear of
  // card k+1's top-right corner), then along card k+1's top to its foot (same 340 px as the riser route)
  const sr_MKP = (k) => { const [x0, y0] = sr_MK(k), xr = sr_LX[k] + 24; return [[x0, y0], [xr, y0], [xr, y0 - 100], [sr_LX[k] - 27, y0 - 100]]; };
  // marker: drops 16 px onto card k0 at `drop` (0.32 s e2), its opacity easing in over the whole drop (e2), so it reads
  // as a drop, not a pop-in; slides [t, d] along the stair offset to the card tops (expo)
  function sr_mkAt(tv, M) {
    if (tv < M.drop) return null;
    let k = M.k0, pos = sr_MK(k);
    for (const [ts, d] of M.slides) {
      if (tv < ts) break;
      const u = expo(pr(tv, ts, ts + d)), P4 = sr_MKP(k);
      if (u >= 1) { k += 1; pos = sr_MK(k); continue; }
      pos = sr_at(P4, u * sr_plen(P4)); break;
    }
    const ud = pr(tv, M.drop, M.drop + 0.32);
    return { x: pos[0], y: pos[1] - 16 * (1 - e2(ud)), a: e2(ud) };
  }
  const sr_MKS = { D: { drop: 18.45, k0: 1, slides: [] }, N: { drop: 67.95, k0: 1, slides: [[69.62, 0.45]] } };

  // ---------------------------------------------------------------- D: the red comet and the RULE MARK (design_system 13)
  // The comet (kit K13) runs sr_MAIN from the pad to S6 in 0.90 s (eio) from «جميع» (19.62). When its head reaches landing
  // k's right end (S1: the first riser, x 1540), that landing takes the rule mark, read the way you walk it (you step on
  // at its right end): the OPEN WINDOW (a 5 px white segment xR-64..xR, drawn right to left in 0.10 s), then the FIRST
  // TRADE (a RED 3x22 tick at xR-64 dropping 10 px, 0.15 s e4) and, with it, LOCKED (the rest of the landing dims from
  // white .7 to .25 in 0.2 s). The head passes the six ends at VO 19.96, 19.99, 20.05, 20.10, 20.16 and 20.25.
  const sr_CT = [19.62, 0.90];
  const sr_cU = (tv) => eio(pr(tv, sr_CT[0], sr_CT[0] + sr_CT[1]));
  const sr_PASS = comet.passTimes(sr_MAIN, sr_CT[0], sr_CT[1], eio, [[1540, 742], [1540, 642], [1300, 542], [1060, 442], [820, 342], [580, 242]]);
  const sr_POP = 21.17; // «Axi»: the six marks pop once together (segments 5 -> 9 -> 5 px, ticks 1 -> 1.3 -> 1), 0.25 s
  function sr_rm(k, tv) { // rule-mark state of landing k
    const tp = sr_PASS[k];
    return { u1: e2(pr(tv, tp, tp + 0.10)), u2: e4(pr(tv, tp + 0.10, tp + 0.25)), lock: e2(pr(tv, tp + 0.10, tp + 0.30)), pop: sr_bump(tv, sr_POP, 0.25) };
  }
  function sr_ruleMark(x, k, m, lw) {
    const xR = sr_LX[k] + 240, y = sr_LY[k], xT = xR - 64, xE = xR + 1.5 * lw; // xE: over the riser's corner
    if (m.u1 > 0) { // open window: right to left
      const hh = (5 + 4 * m.pop) * lw, x0 = lerp(xE, xT, m.u1);
      x.fillStyle = WHITE; x.fillRect(x0, y - hh / 2, xE - x0, hh);
    }
    if (m.u2 > 0) { // first trade: RED 3x22 tick at xR-64 (y - 6 .. y + 16), dropping 10 px into place; pops about its top
      const s = 1 + 0.3 * m.pop, tw = 3 * lw * s, th = 22 * s, top = y - 6 - 10 * (1 - m.u2);
      x.save(); x.globalAlpha *= cl(m.u2 * 2.5); x.fillStyle = RED; x.fillRect(xT - 1.5 * lw - tw / 2, top, tw, th); x.restore();
    }
  }
  function sr_stair(x, tv, seg) {
    if (!VM) return;
    const D = seg === "D";
    if (D && (tv < 17.52 || tv > 21.70)) return;
    if (!D && tv > 72.30) return;
    const build = D && tv < 18.21, retract = eio(D ? pr(tv, 21.44, 21.64) : pr(tv, 72.06, 72.26));
    const ground = build ? 1060 + 720 * expo(pr(tv, 17.52, 17.82)) : sr_GX, stair = build ? 1700 * e4(pr(tv, 17.60, 18.20)) : 1700;
    // the line retracts toward the pad: the stair and S1's landing first (to the riser), then the ground line
    const Lv = build ? 480 + stair : sr_ML * (1 - retract), ext = build ? cl(ground - 1540, 0, 240) : 240 * cl((Lv - 480) / 1700);
    const gMain = build ? Math.min(ground - 1060, 480) : Math.min(Lv, 480);
    const lw = EW_S / VM[0]; // keeps line widths in screen px under the drift
    x.save();
    U.setM(x, sr_ewM());
    // soft white fill (alpha .05 -> 0 over 50 px) under each drawn landing
    for (let k = 0; k < 6; k++) {
      const f = k === 0 ? cl(ext / 240) : cl((Lv - sr_LD0(k)) / 240);
      if (f <= 0) continue;
      const x1 = sr_LX[k] + 240, x0 = k === 0 ? 1540 : x1 - 240 * f, xe = k === 0 ? 1540 + 240 * f : x1, y = sr_LY[k];
      const g = x.createLinearGradient(0, y, 0, y + 50); g.addColorStop(0, "rgba(255,255,255,0.05)"); g.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g; x.fillRect(x0, y + 1.5 * lw, xe - x0, 50);
    }
    // the line: 3 px white .7; in D a stamped landing's locked part dims to .25 (an exact clip split, so joins stay mitred)
    x.lineWidth = 3 * lw; x.lineJoin = "miter"; x.lineCap = "butt";
    const strokeAll = () => {
      if (build) sr_poly(x, sr_MAIN, 0, gMain); else sr_poly(x, sr_MAIN, 0, Lv);
      if (build && stair > 0) sr_poly(x, sr_MAIN, 480, 480 + stair);
      if (ext > 1.5 * lw) sr_poly(x, sr_EXT, 1.5 * lw, ext); // starts past MAIN's mitred corner (no double paint)
    };
    const dims = [], marks = [];
    if (D && tv >= sr_PASS[0]) for (let k = 0; k < 6; k++) {
      const m = sr_rm(k, tv); if (m.u1 <= 0) continue;
      marks.push([k, m]);
      if (m.lock > 0) dims.push({ x0: k === 0 ? 1540 : sr_LX[k] - 2 * lw, x1: sr_LX[k] + 240 - 64, y: sr_LY[k], a: lerp(0.7, 0.25, m.lock) });
    }
    x.strokeStyle = "rgba(255,255,255,0.7)";
    if (!dims.length) strokeAll();
    else {
      const rect = (d) => x.rect(d.x0, d.y - 3 * lw, d.x1 - d.x0, 6 * lw);
      x.save(); x.beginPath(); x.rect(-4000, -4000, 12000, 12000); dims.forEach(rect); x.clip("evenodd"); strokeAll(); x.restore();
      for (const d of dims) { x.save(); x.beginPath(); rect(d); x.clip(); x.strokeStyle = `rgba(255,255,255,${d.a.toFixed(3)})`; strokeAll(); x.restore(); }
    }
    // rule marks, clipped to what is left of their landing while the line retracts
    for (const [k, m] of marks) {
      const xR = sr_LX[k] + 240, y = sr_LY[k];
      x.save(); x.beginPath();
      if (k === 0) x.rect(1530, y - 60, ext + 10 + (ext >= 240 ? 4 * lw : 0), 120);
      else { const vis = cl(Lv - sr_LD0(k), 0, 240); if (vis <= 0) { x.restore(); continue; } x.rect(xR - vis, y - 60, vis + 4 * lw, 120); }
      x.clip(); sr_ruleMark(x, k, m, lw); x.restore();
    }
    for (let k = 0; k < 6; k++) sr_card(x, k, sr_cs(k, tv, seg), lw);
    // the red comet (kit K13, continuous du tail so its 145 px/frame head does not strobe); gone by 20.64
    if (D && tv >= sr_CT[0] && tv < 20.66) {
      const end = sr_CT[0] + sr_CT[1], u = sr_cU(tv);
      comet(x, sr_MAIN, u, { du: u - sr_cU(tv - 0.04), fade: pr(tv, end - 0.12, end + 0.02), a: 1 - e2(pr(tv, end - 0.02, end + 0.12)) });
    }
    x.restore();
  }

  // ---------------------------------------------------------------- D READOUT (screen px, x 1346-1840, y 98-228) + marker
  // line 1: WITHDRAW 44 px (1818,120) + «القاعدة» A300 36 GREY right edge 1780, baseline 130 · line 2: «في جميع المراحل»
  // A300 52 white right edge 1780, baseline 200 · the rule-mark glyph: white bar 24x5 at x 1349-1373, y 183-188, RED tick
  // 3x14 at x 1346-1349, y 179-193 (after its 6 px drop).
  function sr_readD(c, tv) {
    if (tv >= 17.52) {
      sym(c, "withdraw", 1818, 120, 44, { u: pr(tv, 17.52, 17.92) });
      const A = sr_ln(tv, 17.52); T(c, "القاعدة", 1780, 130 + A.dy, { w: 300, size: 36, color: GREY, a: A.a });
    }
    const B = sr_ln(tv, 20.30);
    if (B) T(c, "في جميع المراحل", 1780, 200 + B.dy, { w: 300, size: 52, color: WHITE, a: B.a });
    const ub = e2(pr(tv, 20.55, 20.65)), ut = e4(pr(tv, 20.65, 20.80));
    if (ub > 0) { c.fillStyle = WHITE; c.fillRect(1373 - 24 * ub, 183, 24 * ub, 5); }
    if (ut > 0) { c.save(); c.globalAlpha *= cl(ut * 2.5); c.fillStyle = RED; c.fillRect(1346, 179 - 6 * (1 - ut), 3, 14); c.restore(); }
  }
  // ---------------------------------------------------------------- N READOUT (screen px, right-aligned at x 1840)
  // pips 72x48 pitch 84 at y 96-144, all DONE (carried from M), one pulse on «مؤهّلاً» · «المرحلة الثالثة» A300 36 GREY
  // baseline 200 (69.19) · 'Acceleration' I300 52 white baseline 266 (71.30) + a 3 px RED underline (71.60-71.85) ·
  // «تمويل حتى» A300 34 GREY baseline 320 (71.36) · '$100,000' metallic I200 96 baseline 420 (71.42, static: he does not
  // say the cap).
  function sr_readN(c, tv) {
    const pu = pr(tv, 68.07, 68.32), st = [0, 1, 2, 3].map(() => ({ s: "done", pulse: pu }));
    pips(c, 1840, 96, 72, 48, 84, st);
    const A = sr_ln(tv, 69.19);
    if (A) T(c, "المرحلة الثالثة", 1840, 200 + A.dy, { w: 300, size: 36, color: GREY, a: A.a });
    const B = sr_ln(tv, 71.30);
    if (B) {
      T(c, "Acceleration", 1840, 266 + B.dy, { w: 300, size: 52, fam: LAT, color: WHITE, align: "right", a: B.a });
      const uu = e3(pr(tv, 71.60, 71.85));
      if (uu > 0) { const wA = measure(c, "Acceleration", 300, 52, LAT); c.fillStyle = RED; c.fillRect(1840 - wA, 276, wA * uu, 3); }
    }
    const C = sr_ln(tv, 71.36);
    if (C) T(c, "تمويل حتى", 1840, 320 + C.dy, { w: 300, size: 34, color: GREY, a: C.a });
    const E = sr_ln(tv, 71.42);
    if (E) metal(c, fmtMoney(STAGES[2].amt), 1840, 420 + E.dy, 96, { w: 200, align: "right", a: E.a });
  }
  // the readout and the marker: one layer, faded together on the exit (D 21.40-21.62, N 72.04-72.26, eio)
  function sr_over(x, tv, seg) {
    const D = seg === "D", a = 1 - eio(D ? pr(tv, 21.40, 21.62) : pr(tv, 72.04, 72.26));
    sr_fade(x, a, (c) => {
      if (D) sr_readD(c, tv); else sr_readN(c, tv);
      const m = sr_mkAt(tv, sr_MKS[seg]);
      if (m && VM) {
        c.save(); U.setM(c, sr_ewM());
        sr_marker(c, m.x, m.y, m.a, 54, 26, 2 * (EW_S / VM[0]));
        c.restore();
      }
    });
  }

  // ---------------------------------------------------------------- O · VO 72.37-76.05 (L3, free x 80-800)
  // SIX EPISODE CHIPS (one video per stage, in the title chip's grammar): TAG 88x48, pitch 96, y 168-216, right to left
  // 01 x 632-720 ... 06 x 152-240; index '0N' I500 24 at X+14, baseline 201; stage symbol 26 px at (X+64, 192).
  // 01 DONE · 02 = the title chip (PANEL, RED rim, RED '02', DOME) · 03 next (outline .6, CHEV white, '03' white) · 04-06 DIM.
  // The next-video DECK (video 1's V, mirrored into the left zone): front CARD 470x250 at x 250-720, y 330-580 (c 30),
  // back cards (-22,-22) and (-44,-44) at .55; RED pill 500x84 at x 220-720, y 610-694.
  const sr_O = { t0: 72.84, pulse: 73.71, dT0: 74.57, pill: 74.90, sheen: [75.25, 75.60], tap: [75.55, 75.71], out: [75.72, 75.96],
    F: { X: 250, Y: 330, w: 470, h: 250 }, off: [[-22, -22], [-44, -44]] };
  function sr_chip(x, i, tv) {
    const X = 632 - 96 * i, Y = 168, w = 88, h = 48, ST = STAGES[i], ix = X + 14, iy = 201, cx = X + 64, cy = 192;
    tagPath(x, X, Y, w, h); x.lineWidth = 1.5;
    if (i === 0) { // 01 Seed: DONE (fill .7, outline .25, the red cut + tick; symbol and index white .8)
      x.fillStyle = panelFill(x, Y, h, 0.7); x.fill(); x.strokeStyle = "rgba(255,255,255,0.25)"; x.stroke();
      sr_doneCut(x, X, Y, h, 1);
      T(x, ST.n, ix, iy, { w: 500, size: 24, fam: LAT, color: WHITE, a: 0.8 });
      sr_symMono(x, ST.sym, cx, cy, 26, 0.8, sr_symK(i, 1, 0));
    } else if (i === 1) { // 02 Incubation, this video: the title chip
      x.fillStyle = PANEL; x.fill(); x.strokeStyle = RED; x.stroke();
      T(x, ST.n, ix, iy, { w: 500, size: 24, fam: LAT, color: RED });
      sym(x, ST.sym, cx, cy, 26, { k: sr_symK(i, 1, 0) });
    } else if (i === 2) { // 03 Acceleration, next: outline .6 (RED on the pulse), CHEV and index white
      const b = sr_bump(tv, sr_O.pulse, 0.45);
      if (b < 1) { x.strokeStyle = `rgba(255,255,255,${(0.6 * (1 - b)).toFixed(3)})`; x.stroke(); }
      if (b > 0) { x.strokeStyle = rgba(RED, b.toFixed(3)); x.stroke(); }
      T(x, ST.n, ix, iy, { w: 500, size: 24, fam: LAT, color: WHITE });
      sr_symMono(x, ST.sym, cx, cy, 26, 1, { ignite: 1, t: Math.max(0, tv - sr_O.t0) });
    } else { // 04-06 DIM
      x.strokeStyle = "rgba(255,255,255,0.25)"; x.stroke();
      T(x, ST.n, ix, iy, { w: 500, size: 24, fam: LAT, color: DIM });
      sym(x, ST.sym, cx, cy, 26, { dim: true, k: sr_symK(i, 1, 0) });
    }
  }
  function sr_drawO(c, tv) {
    const O = sr_O;
    // the six chips: right to left, 01 first (0.05 s stagger), each scaleX 0 -> 1 from its right edge (0.3 s expo)
    for (let i = 0; i < 6; i++) {
      const k = expo(pr(tv, O.t0 + 0.05 * i, O.t0 + 0.05 * i + 0.3)); if (k <= 0) continue;
      const X = 632 - 96 * i, sc = i === 2 ? 1 + 0.08 * sr_bump(tv, O.pulse, 0.45) : 1;
      c.save();
      c.translate(X + 88, 192); c.scale(k, 1); c.translate(-(X + 88), -192);
      if (sc !== 1) { c.translate(X + 44, 192); c.scale(sc, sc); c.translate(-(X + 44), -192); }
      sr_fade(c, cl(k * 1.5), (cc) => sr_chip(cc, i, tv), "sr_fadeC");
      c.restore();
    }
    if (tv < O.dT0) return;
    // the deck fans in (front card reveal from the right 0.5 s; back cards 0.08 s apart, all landed by 75.07)
    const F = O.F, uF = pr(tv, O.dT0, O.dT0 + 0.5), fi = expo(uF), ci = expo(pr(tv, O.dT0 + 0.12, O.dT0 + 0.57));
    c.save(); c.translate(0, (1 - fi) * 24);
    for (let j = 1; j >= 0; j--) {
      const [ox, oy] = O.off[j], t1 = O.dT0 + 0.08 * (j + 1), kf = expo(pr(tv, t1, O.dT0 + 0.5));
      const bx = F.X + ox * kf, by = F.Y + oy * kf, ba = 0.55 * cl(fi * 1.4);
      c.save(); cardClip(c, bx, by, F.w, F.h, uF); card(c, bx, by, F.w, F.h, { a: ba }); c.restore();
    }
    card(c, F.X, F.Y, F.w, F.h, { u: uF, a: cl(fi * 1.4), fillA: 1 }); // opaque: the back cards never show through
    c.save(); cardClip(c, F.X, F.Y, F.w, F.h, uF); c.translate(0, (1 - ci) * 16);
    const ca = cl(ci * 1.3), R = F.X + F.w - 40; // R 680
    T(c, "الفيديو التالي", R, 392, { w: 300, size: 38, color: GREY, a: ca });
    metalCount(c, 3, "(3)", F.X + 30, 540, 140, { w: 200, a: ca, sheen: pr(tv, O.sheen[0], O.sheen[1]) });
    const ig = pr(tv, O.dT0 + 0.20, O.dT0 + 0.60);
    if (ig > 0) sym(c, "chev", R - 28, 448, 56, { a: ca, k: { ignite: ig, t: tv - (O.dT0 + 0.20) } });
    T(c, "Acceleration", R, 516, { w: 300, size: 34, fam: LAT, color: WHITE, align: "right", a: ca });
    T(c, "المرحلة الثالثة", R, 558, { w: 300, size: 34, color: GREY, a: ca });
    c.restore();
    c.restore();
    // RED pill «انتقل إلى الفيديو التالي», white disc with a red ←; the arrow taps left on «القادم»
    const pu = expo(pr(tv, O.pill, O.pill + 0.40));
    if (pu > 0) {
      const q = pr(tv, O.tap[0], O.tap[1]), nud = q > 0 && q < 1 ? -7 * Math.sin(Math.PI * q) : 0;
      c.save(); c.translate(0, (1 - pu) * 20);
      sr_fade(c, cl(pu * 1.3), (cc) => pill(cc, 220, 610, 500, 84, "انتقل إلى الفيديو التالي", { kind: "red", size: 34, circle: true, nudge: nud }), "sr_fadeP");
      c.restore();
    }
  }
  function sr_O_draw(x, tv) {
    const O = sr_O;
    if (tv < O.t0 || tv > O.out[1] + 0.02) return;
    const uo = eio(pr(tv, O.out[0], O.out[1]));
    sr_fade(x, 1 - uo, (c) => { c.save(); sr_xf(c, 450, 430, { dy: -10 * uo, sc: 1 - 0.015 * uo }); sr_drawO(c, tv); c.restore(); });
  }

  GROUPS.push({
    name: "stairs",
    floor: sr_floor,
    draw(x, t, S) {
      const k = S.shot && S.shot.k_beat;
      if (k !== "D" && k !== "N" && k !== "O") return;
      const tv = t - P;
      if (k === "O") { sr_O_draw(x, tv); return; }
      sr_stair(x, tv, k);
      U.reset(x);
      sr_over(x, tv, k);
    },
  });

  // ================================================================== GROUP «fund» (prefix fu_): beats G, H (B-roll 2), I
  // Spec: mg_ep2_final.json beats G, H, I and broll_2 (layouts in screen px, measured with the project fonts in the
  // canvas). Times are VO seconds (tv = t - P). Every hit sits on the measured onsets (word_onsets) and the pause map
  // (work/vo_pauses_vo.json). Shots are picked by S.shot.k_beat, never by times.
  // G  VC WIDE  VO 32.37-36.41  DROP 1 smash cut: floor ripple + pool flash; axi wordmark, «تمويلك حتى» + the scene's flag,
  //                             the page-8 metallic 'x10' over his head, ▲▲▲, the TAG chip CANDLES '$1,000'; one layer
  //                             out 36.05-36.33 with the pool back to .18
  // H  BR2      VO 36.41-47.41  B-ROLL 2 «x10»: your account (right) -> the RED-armed 'x10' gate (centre) -> Axi's funding
  //                             card (left): one $1,000 block -> ten blocks ($10,000); reset; $2,000 -> twenty blocks, the
  //                             total a skeleton (said in I); hard cuts in and out at full opacity
  // I  L3       VO 47.41-50.65  card-less: «قيمة التمويل», '$2,000 × 10 =', '$20,000' landing on «عشرين» (49.30), ▲▲▲,
  //                             the cap row DOME «سقف التمويل» 'Incubation'; one layer out 50.30-50.57
  // Frame f samples VO 0.04 f - 0.61: G's last frames are 36.35 / 36.39 (clean: out ends 36.33), I's 50.59 / 50.63 (clean:
  // out ends 50.57). B-roll 2 opens on f 926 (VO 36.43) and ends on f 1200 (VO 47.39) at full opacity.

  const fu_K = {
    // G: [31.97-32.40] (cut 32.37 = DROP 1) · ستقوم 32.40 · Axi 33.28 · بتمويلك 33.69 · لغاية 34.45 · عشرة 34.88 ·
    //    أضعاف 35.27 · هذا 35.67 · المبلغ 35.93-36.29 · [36.29-36.51] (cut 36.41)
    G: { cut: 32.37, fl0: 32.37, fl1: 32.47, fl2: 32.90, mark: 33.28, w1: 33.69, f0: 33.70, f1: 33.92, w2: 34.45,
      x10: 34.86, chev: 34.95, lift0: 34.88, lift1: 35.20, chip: 35.27, chip1: 35.62, sh0: 35.62, sh1: 35.97, o0: 36.05, o1: 36.33 },
    // H: [36.28-36.53] · يعني 36.51 · إذا 37.03 · كان 37.21 · [37.48-37.56] · حسابك 37.56 · [37.93-38.01] · ألف 38.01 · دولار 38.31 ·
    //    [38.55-38.75] · ستقوم 38.75 · Axi 39.25 · بتمويلك 39.51 · [40.01-40.15] · بمبلغ 40.13 · عشرة 40.75 · آلاف 41.15 ·
    //    [41.42-41.55] · دولار 41.54 · أمّا 41.93 · إذا 42.13 · حسابك 42.63 · [43.02-43.32] · ألفين 43.32 · دولار 43.68 ·
    //    [43.89-44.20] · ستقوم 44.18 · Axi 44.75 · بتمويلك 45.05 · [45.50-45.63] · أيضاً 45.63 · بعشرة 45.99 · أضعاف 46.45 ·
    //    هذا 46.76 · المبلغ 47.01-47.35 · [47.34-47.50] (cut 47.41)
    H: { cor0: 36.44, cor1: 36.89, kick: 36.52, kf0: 36.54, kf1: 36.76, rc: 37.05, hs: 37.48, n1: 37.51, n1L: 38.01, blk1: 38.00,
      sh1: 38.31, sh1b: 38.70, arm: 38.75, x0: 38.78, x1: 39.20, lc: 39.22, axi: 39.25, vlt: 39.34,
      g1: [39.55], gd: 0.50, fl1: 40.05, b1: 40.20, b1s: 0.05, n10L: 40.75, chev: 41.15, sh10: 41.15, sh10b: 41.55, hub: 41.54,
      akhar: 41.93, rst0: 42.15, rst1: 42.45, n2: 42.82, n2L: 43.32, blk2: 43.10, blk2b: 43.35, sh2: 43.68, sh2b: 44.08,
      rearm: 44.05, axiP: 44.75, g2: [45.05, 45.17], fl2: 45.66, skel: 45.66, b2: 45.99, b2s: 0.035, pop: [46.76, 46.91],
      und: 46.76 },
    // I: [47.34-47.50] (cut 47.41) · ليصل 47.48 · [47.85-48.03] · قيمة 48.03 · التمويل 48.35 · [48.79-49.00] · إلى 48.99 ·
    //    عشرين 49.30 · ألف 49.90-50.08 · [50.07-50.49] · دولار 50.49 (cut 50.65)
    I: { kick: 47.86, eq: 48.20, n0: 48.60, nL: 49.30, chev: 49.32, cap: 49.45, sh0: 49.90, sh1: 50.25, o0: 50.30, o1: 50.57 },
  };
  // a metalCount driven by fin * e4(pr(tv, t0, t1)) shows fin (Math.round reaches it) at the fraction fu_pLand(n) of its
  // window; t1 is chosen so that this landing falls exactly on the spoken number (the quartOut shape is kept). n is the
  // counted span (final - start).
  const fu_pLand = (n) => 1 - Math.pow(0.5 / n, 0.25);
  const fu_t1 = (t0, tLand, n) => t0 + (tLand - t0) / fu_pLand(n);

  // ------------------------------------------------------------------ helpers
  // measured widths, once
  const fu_M = {};
  function fu_w(x, s, w, size) { const k = s + "|" + w + "|" + size; if (!(k in fu_M)) fu_M[k] = measure(x, s, w, size, isAr(s) ? AR : LAT); return fu_M[k]; }
  // one fading layer: draw(c) paints in the caller's coordinates into a device-space buffer (the bbox X, Y, w, h under the
  // current transform), which lands once at alpha a. At a = 1 it draws straight through.
  const fu_BUF = {};
  async function fu_layer(x, X, Y, w, h, a, draw) {
    if (a <= 0.003) return;
    if (a >= 0.999) { await draw(x); return; }
    const M = x.getTransform(), px = [X, X + w, X, X + w], py = [Y, Y, Y + h, Y + h];
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let i = 0; i < 4; i++) {
      const dx = M.a * px[i] + M.c * py[i] + M.e, dy = M.b * px[i] + M.d * py[i] + M.f;
      x0 = Math.min(x0, dx); x1 = Math.max(x1, dx); y0 = Math.min(y0, dy); y1 = Math.max(y1, dy);
    }
    x0 = Math.max(0, Math.floor(x0) - 2); y0 = Math.max(0, Math.floor(y0) - 2);
    x1 = Math.min(x.canvas.width, Math.ceil(x1) + 2); y1 = Math.min(x.canvas.height, Math.ceil(y1) + 2);
    const cw = x1 - x0, ch = y1 - y0; if (cw <= 0 || ch <= 0) return;
    let c = fu_BUF.c;
    if (!c || c.width < cw || c.height < ch) c = fu_BUF.c = U.mk(Math.max(cw, c ? c.width : 0), Math.max(ch, c ? c.height : 0));
    const cx = c.x;
    cx.setTransform(1, 0, 0, 1, 0, 0); cx.globalAlpha = 1; cx.globalCompositeOperation = "source-over"; cx.filter = "none";
    cx.clearRect(0, 0, cw, ch);
    cx.save(); cx.beginPath(); cx.rect(0, 0, cw, ch); cx.clip();
    cx.setTransform(M.a, M.b, M.c, M.d, M.e - x0, M.f - y0);
    await draw(cx);
    cx.restore(); cx.setTransform(1, 0, 0, 1, 0, 0);
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha *= a; x.drawImage(c, 0, 0, cw, ch, x0, y0, cw, ch); x.restore();
  }
  // exit envelope (inOutCubic, as the kit's ent(): alpha -> 0, y -10, scale .985) applied about a pivot; returns the alpha
  function fu_exit(x, tv, a, b, cx, cy) {
    const u = eio(pr(tv, a, b));
    x.translate(cx, cy - 10 * u); x.scale(1 - 0.015 * u, 1 - 0.015 * u); x.translate(-cx, -cy);
    return 1 - u;
  }
  // one Arabic word rising out of its mask (the kit headline's motion: clip + rise, alpha k), right edge Xr; the clip runs
  // from baseline - 1.25 em to baseline + 0.70 em and 0.45 em past both ends (final ي dots and swashes)
  function fu_word(x, s, Xr, Y, size, wgt, color, k, rise = 18) {
    if (k <= 0) return;
    const mw = fu_w(x, s, wgt, size);
    x.save(); x.beginPath(); x.rect(Xr - mw - 0.45 * size, Y - size * 1.25, mw + 0.9 * size, size * 1.95); x.clip();
    T(x, s, Xr - mw, Y + (1 - k) * rise, { w: wgt, size, fam: AR, ltr: true, align: "left", color, a: k });
    x.restore();
  }
  const fu_bump = (tv, t0, d) => { const u = pr(tv, t0, t0 + d); return u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0; };
  // a scale about (cx, cy); pair with save/restore
  function fu_sc(x, cx, cy, s) { if (s !== 1) { x.translate(cx, cy); x.scale(s, s); x.translate(-cx, -cy); } }
  // polyline arc length helpers (the ghost rides the in-path at an arc length; the kit's comet keeps its own tables)
  function fu_cum(p) { const c = [0]; for (let i = 1; i < p.length; i++) c.push(c[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); return c; }
  function fu_at(p, c, d) {
    const n = p.length; if (d <= 0) return p[0]; if (d >= c[n - 1]) return p[n - 1];
    let lo = 0, hi = n - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (c[m] < d) lo = m; else hi = m; }
    const f = (d - c[lo]) / (c[hi] - c[lo] || 1);
    return [lerp(p[lo][0], p[hi][0], f), lerp(p[lo][1], p[hi][1], f)];
  }
  // dots every `step` px of arc (3 px dots), from `s0`
  function fu_dots(p, step = 12, s0 = 6) { const c = fu_cum(p), L = c[c.length - 1], out = []; for (let s = s0; s < L; s += step) out.push(fu_at(p, c, s)); return out; }

  // ================================================================== FLOOR (G): ripple on the cut, the white pool
  // pool .18 -> flash .26 on the drop (32.37-32.90) -> .18; lift to .26 as 'x10' lands (34.88-35.20); back to .18 with the
  // exit (36.05-36.33). The ripple is the kit's fRipple (red ring + white ring 0.1 s behind) from the stool on the cut.
  function fu_floorG(t, sh) {
    const tv = t - P, K = fu_K.G;
    const fl = e2(pr(tv, K.fl0, K.fl1)) * (1 - eio(pr(tv, K.fl1, K.fl2)));
    const lift = e2(pr(tv, K.lift0, K.lift1)) * (1 - eio(pr(tv, K.o0, K.o1)));
    sh.push(fPool(0.18 + 0.08 * Math.max(fl, lift)));
    fRipple(sh, t, v(K.cut));
  }

  // ================================================================== G · VO 32.37-36.41 · FUNDED UP TO x10 (VC WIDE, screen px)
  // WIDE keep-out x 845-1035, y 470-760: everything sits above y 452 ('x10' fades from y 405 to its baseline 450).
  async function fu_G(x, tv) {
    const K = fu_K.G;
    if (tv < K.mark || tv > K.o1) return;
    x.save();
    const a = fu_exit(x, tv, K.o0, K.o1, 1000, 270);
    await fu_layer(x, 730, 70, 700, 410, a, async (c) => {
      // the axi wordmark (axi_part_white) rises 12 px into the top centre, h 56 (108 px) at x 892-1000, y 92-148
      const km = expo(pr(tv, K.mark, K.mark + 0.4));
      await axiMark(c, 892, 92 + 12 * (1 - km), 56, cl(km * 1.25));
      // two-tone headline A300 56, baseline 230: «تمويلك» (white) x 916-1093, «حتى» (grey) x 800-900; the flag x 1121-1136
      flag(c, 1093 + 28, 230 - 56 * 0.81, 20, { mirror: true, u: pr(tv, K.f0, K.f1) });
      fu_word(c, "تمويلك", 1093, 230, 56, 300, WHITE, e4(pr(tv, K.w1, K.w1 + 0.42)));
      fu_word(c, "حتى", 1093 - fu_w(c, "تمويلك", 300, 56) - 56 * 0.28, 230, 56, 300, GREY, e4(pr(tv, K.w2, K.w2 + 0.42)));
      // 'x10' metallic I200 220, centred x 946, baseline 450: scale 1.04 -> 1 + 20 px rise (0.35 s expo); one sheen
      const kx = expo(pr(tv, K.x10, K.x10 + 0.35));
      if (tv >= K.x10) {
        c.save(); c.translate(0, 20 * (1 - kx)); fu_sc(c, 946, 370, lerp(1.04, 1, kx));
        metalCount(c, 10, "x10", 946, 450, 220, { align: "center", fade: true, a: cl(kx * 1.25), sheen: pr(tv, K.sh0, K.sh1) });
        c.restore();
      }
      chev3(c, 752, 380, tv, K.chev); // ▲▲▲ 24 px left of the 'x' (x 752-770, y 380 / 402 / 424)
      // the TAG chip 250x64 at x 1150-1400, y 362-426: the plate opens from its right edge (scaleX 0 -> 1) + 12 px rise,
      // 0.35 s expo; its content (CANDLES 36 + '$1,000' I300 34, static) is revealed by the plate, unsquashed
      if (tv >= K.chip) {
        const kc = expo(pr(tv, K.chip, K.chip1));
        c.save(); c.translate(0, 12 * (1 - kc)); c.globalAlpha *= cl(kc * 2);
        c.save(); c.translate(1400, 0); c.scale(Math.max(0.001, kc), 1); c.translate(-1400, 0); tag(c, 1150, 362, 250, 64, {}); c.restore();
        c.save(); c.beginPath(); c.rect(1400 - 250 * kc, 340, 250 * kc + 4, 110); c.clip();
        sym(c, "candles", 1366, 394, 36, {});
        metal(c, "$1,000", 1340, 407, 34, { w: 300, align: "right" });
        c.restore(); c.restore();
      }
    });
    x.restore();
  }

  // ================================================================== H · VO 36.41-47.41 · B-ROLL 2 «x10» (inside brScene's drift)
  // RTL flow: your account (RIGHT card) -> the gate (CENTRE) -> Axi's funding (LEFT card). Draw order, back to front:
  // kicker, the two cards (plates and type), the dotted paths, the unit blocks, the ghosts and comets, the gate's corner
  // triangles, the gate (blocks, ghosts and corners emerge from under it).
  const fu_INP = comet.quad([1665, 558], [1380, 445], [1094, 445], 64); // in-path: block 1's centre -> the gate's right edge
  const fu_INL = fu_cum(fu_INP)[fu_INP.length - 1];
  const fu_INX = fu_INP.concat([[880, 445]]); // the same, extended into the gate (the ghost and its comet slide in under it)
  const fu_INXC = fu_cum(fu_INX);
  const fu_INDOT = fu_dots(fu_INP);
  const fu_SLOT = (i) => [550 - 80 * (i % 5), 490 + 46 * Math.floor(i / 5)]; // grid slot top-left (slot 1 at x 550-620, y 490)
  // launch order (slot indices): the far slots first, i.e. the longest out-path first (column by column from the far left,
  // the bottom row first), so no block flies across a landed one and a later (slower, shorter) flight never overtakes an
  // earlier one; the landed grid is the same
  const fu_ORD10 = [9, 4, 8, 3, 7, 2, 6, 1, 5, 0], fu_ORD20 = [19, 14, 9, 4, 18, 13, 8, 3, 17, 12, 7, 2, 16, 11, 6, 1, 15, 10, 5, 0];
  const fu_OUT0 = [826, 445], fu_OUTC = [700, 445]; // out-path: the gate's left edge via (700,445) to each slot's centre
  const fu_OUTDOT = fu_dots(comet.quad(fu_OUT0, fu_OUTC, [585, 508], 32)); // the guide to slot 1
  const fu_quadAt = (P0, C, P2, u) => { const a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u; return [a * P0[0] + b * C[0] + c * P2[0], a * P0[1] + b * C[1] + c * P2[1]]; };
  // the white unit block (TAG 70x36) at top-left X, Y; o.rim (RED 2 px alpha), o.s (scale), o.a. The fill is the colour
  // of white .88 over the card (#E3E3E4), drawn opaque so the blocks in flight never add up where they overlap. A 1.5 px
  // PANEL ring OUTSIDE the plate (a 3 px stroke clipped to the outside) keeps a block that passes over another separate;
  // on the card's PANEL it is invisible, and it never overlaps the fill (no dark seam while a block fades)
  function fu_block(x, X, Y, o = {}) {
    const a = o.a ?? 1; if (a <= 0.003) return;
    x.save(); x.globalAlpha *= a; fu_sc(x, X + 35, Y + 18, o.s ?? 1);
    x.save(); x.beginPath(); x.rect(X - 8, Y - 8, 86, 52);
    [[X + 0.355 * 36, Y], [X + 70, Y], [X + 70, Y + 0.57 * 36], [X + 70 - 0.35 * 36, Y + 36], [X, Y + 36], [X, Y + 0.43 * 36]].forEach(([px, py], i) => (i ? x.lineTo(px, py) : x.moveTo(px, py)));
    x.closePath(); x.clip("evenodd");
    tagPath(x, X, Y, 70, 36); x.lineWidth = 3; x.strokeStyle = PANEL; x.stroke(); x.restore();
    tagPath(x, X, Y, 70, 36); x.fillStyle = "#E3E3E4"; x.fill();
    if (o.rim > 0) { x.lineWidth = 2; x.strokeStyle = rgba(RED, cl(o.rim)); x.stroke(); }
    x.restore();
  }
  // the dotted paths (3 px dots every 12 px) at alpha a
  function fu_paths(x, a) {
    if (a <= 0.003) return;
    x.save(); x.globalAlpha *= a; x.fillStyle = WHITE; x.beginPath();
    for (const D of [fu_INDOT, fu_OUTDOT]) for (const [px, py] of D) { x.moveTo(px + 1.5, py); x.arc(px, py, 1.5, 0, Math.PI * 2); }
    x.fill(); x.restore();
  }
  // the gate state: red rim (0..1), the paths' alpha, the white flash (2 frames), the 'x10' pulse, the corner snap
  function fu_gateState(tv) {
    const K = fu_K.H;
    const red = e2(pr(tv, K.arm, K.arm + 0.25)) * (1 - e2(pr(tv, K.rst0, K.rst1))) + e2(pr(tv, K.rearm, K.rearm + 0.25));
    const pa = 0.12 * e2(pr(tv, K.cor0, K.cor1)) + 0.18 * (e2(pr(tv, K.arm, K.arm + 0.25)) * (1 - e2(pr(tv, K.rst0, K.rst1))) + e2(pr(tv, K.rearm, K.rearm + 0.25)));
    const white = (tv >= K.fl1 && tv < K.fl1 + 0.08) || (tv >= K.fl2 && tv < K.fl2 + 0.08);
    const pulse = 0.08 * (fu_bump(tv, K.fl1, 0.25) + fu_bump(tv, K.fl2, 0.25));
    const snap = 6 * (fu_bump(tv, K.arm, 0.15) + fu_bump(tv, K.rearm, 0.15));
    return { red: cl(red), pa, white, pulse, snap };
  }
  // a ghost copy of block 1 (TAG outline, white .6) riding the in-path, led by the kit comet; run [t0, t0 + d] (eio). The
  // comet gets the kit's o.du (its eased step over the last frame): at the run's peak the head moves ~150 px a frame
  // against its 54 px tail, which strobed; with du the tail stretches over that step (same head, glow and 9 px spacing)
  function fu_ghost(x, tv, t0, d) {
    const u = pr(tv, t0, t0 + d); if (u <= 0 || u >= 1) return;
    const sgAt = (q) => (fu_INL + 40) * eio(q);
    const sg = sgAt(u), [gx, gy] = fu_at(fu_INX, fu_INXC, sg);
    const gin = eio(pr(tv, t0, t0 + 0.08));
    x.save(); x.globalAlpha *= 0.6 * gin;
    tagPath(x, gx - 35, gy - 18, 70, 36); x.lineWidth = 1.5; x.strokeStyle = WHITE; x.stroke();
    x.restore();
    const L = fu_INXC[fu_INXC.length - 1];
    comet(x, fu_INX, (sg + 109) / L, { a: gin, du: (sg - sgAt(pr(tv - 0.04, t0, t0 + d))) / L });
  }
  async function fu_H(x, tv) {
    const K = fu_K.H, G = fu_gateState(tv);
    // ---- 1. kicker «مثال» (+ «آخر» on «أمّا») A300 56, right-aligned x 1740, baseline 160; the scene's flag x 1768-1783
    flag(x, 1740 + 28, 160 - 56 * 0.81, 20, { mirror: true, u: pr(tv, K.kf0, K.kf1) });
    fu_word(x, "مثال", 1740, 160, 56, 300, WHITE, e4(pr(tv, K.kick, K.kick + 0.42)));
    fu_word(x, "آخر", 1740 - fu_w(x, "مثال", 300, 56) - 56 * 0.28, 160, 56, 300, GREY, e4(pr(tv, K.akhar, K.akhar + 0.42)));

    // ---- 2. RIGHT card «حسابك» 440x420 at x 1300-1740, y 240-660 (cut 44): clip from the right edge + 24 px rise (0.5 s expo)
    if (tv >= K.rc) {
      const u = pr(tv, K.rc, K.rc + 0.5), ui = expo(u), uc = expo(pr(tv, K.rc + 0.12, K.rc + 0.62));
      x.save(); x.translate(0, (1 - ui) * 24);
      card(x, 1300, 240, 440, 420, { u, a: cl(ui * 1.25), c: 44 });
      if (uc > 0) {
        x.save(); cardClip(x, 1300, 240, 440, 420, u); x.globalAlpha *= cl(uc * 1.3); x.translate(0, (1 - uc) * 10);
        sym(x, "candles", 1360, 300, 56, { u: pr(tv, K.rc + 0.12, K.rc + 0.62) });
        // «حسابك» rises out of its mask on its own, from the pause before it (37.48), landing on its onset (37.56)
        fu_word(x, "حسابك", 1700, 330, 44, 500, WHITE, e4(pr(tv, K.hs, K.hs + 0.42)), 16);
        // '$1,000' counts 0 -> 1,000 onto «ألف» (38.01); one sheen on «دولار». It fades in over 0.12 s around the count's
        // start (n1 - 0.08 .. n1 + 0.04), so its first visible frames read '$0' (E's '0' and video 1's counters)
        if (tv >= K.n1 - 0.08 && tv < K.n2)
          metalCount(x, 1000 * e4(pr(tv, K.n1, fu_t1(K.n1, K.n1L, 1000))), "$1,000", 1700, 450, 88, { align: "right", a: cl(pr(tv, K.n1 - 0.08, K.n1 + 0.04)), sheen: pr(tv, K.sh1, K.sh1b) });
        else if (tv >= K.n2) // 1,000 -> 2,000 onto «ألفين» (43.32), from the landed '$1,000'; one sheen on «دولار»
          metalCount(x, 1000 + 1000 * e4(pr(tv, K.n2, fu_t1(K.n2, K.n2L, 1000))), "$2,000", 1700, 450, 88, { align: "right", from: "$1,000", sheen: pr(tv, K.sh2, K.sh2b) });
        if (tv >= K.und) { const k = e3(pr(tv, K.und, K.und + 0.25)); x.fillStyle = RED; x.fillRect(1700 - 287 * k, 462, 287 * k, 3); } // «هذا المبلغ»
        x.restore();
      }
      x.restore();
    }

    // ---- 3. LEFT card «تمويل Axi» 480x520 at x 180-660, y 220-740 (cut 48)
    if (tv >= K.lc) {
      const u = pr(tv, K.lc, K.lc + 0.5), ui = expo(u), uc = expo(pr(tv, K.lc + 0.12, K.lc + 0.62));
      x.save(); x.translate(0, (1 - ui) * 24);
      card(x, 180, 220, 480, 520, { u, a: cl(ui * 1.25), c: 48 });
      if (uc > 0) {
        x.save(); cardClip(x, 180, 220, 480, 520, u); x.globalAlpha *= cl(uc * 1.3); x.translate(0, (1 - uc) * 10);
        sym(x, "vault", 240, 280, 56, { u: pr(tv, K.vlt, K.vlt + 0.5), k: { rot: ((2 * Math.PI) / 3) * e3(pr(tv, K.fl1, K.fl1 + 0.4)), pulse: pr(tv, K.hub, K.hub + 0.3) } });
        T(x, "تمويل", 620, 330, { w: 500, size: 44 });
        // the axi wordmark h 40 (77 px) at x 401-478, y 294-334, read after «تمويل»: rises 12 px on «Axi», pulses on «Axi» 44.75
        const ka = expo(pr(tv, K.axi, K.axi + 0.4));
        x.save(); fu_sc(x, 439.5, 314, 1 + 0.04 * fu_bump(tv, K.axiP, 0.25));
        await axiMark(x, 401, 294 + 12 * (1 - ka), 40, cl(ka * 1.25));
        x.restore();
        // the amount: '$10,000' counts onto «عشرة» (40.75), ▲▲▲ + one sheen on «آلاف»; both fade with the reset (smoothstep
        // 0.42 s, the B-roll exit rule); then the TOTAL SKELETON from «أيضاً» (said in the next shot)
        const ra = 1 - ss(pr(tv, K.rst0, K.rst0 + 0.42));
        // (the same 0.12 s alpha ramp around the count's start, so it opens on '$0')
        if (tv >= K.b1 - 0.08 && ra > 0.003) {
          metalCount(x, 10000 * e4(pr(tv, K.b1, fu_t1(K.b1, K.n10L, 10000))), "$10,000", 620, 450, 88, { align: "right", a: ra * cl(pr(tv, K.b1 - 0.08, K.b1 + 0.04)), sheen: pr(tv, K.sh10, K.sh10b) });
          chev3(x, 240, 400, tv, K.chev, { a: ra });
        }
        if (tv >= K.skel) skeleton(x, 280, 392, 340, 60, tv, e2(pr(tv, K.skel, K.skel + 0.2)), { r: 10 });
        x.restore();
      }
      x.restore();
    }

    // ---- 4. the dotted paths: white .12 idle, .30 armed
    fu_paths(x, G.pa);

    // ---- 5. the unit blocks
    // right card: block 1 pops into its place on «ألف» (scale .9 -> 1, back 1.4, 0.25 s); block 2 slides out from under it
    // to its left (43.10-43.35, e4); on «هذا المبلغ» both get a 2 px RED rim and pop twice (1 -> 1.08 -> 1, 0.15 s)
    const pop = 0.08 * (fu_bump(tv, K.pop[0], 0.15) + fu_bump(tv, K.pop[1], 0.15)), rim = e2(pr(tv, K.pop[0], K.pop[0] + 0.1));
    if (tv >= K.blk2) {
      const k2 = e4(pr(tv, K.blk2, K.blk2b));
      fu_block(x, lerp(1630, 1550, k2), 540, { a: cl(pr(tv, K.blk2, K.blk2b) * 4), s: 1 + pop, rim });
    }
    if (tv >= K.blk1) {
      const p = pr(tv, K.blk1, K.blk1 + 0.25);
      fu_block(x, 1630, 540, { a: cl(p * 3), s: lerp(0.9, 1, back(p, 1.4)) + pop, rim });
    }
    // the grid: example 1 = ten blocks (0.05 s stagger), example 2 = twenty (0.035 s), each 0.30 s e3 along the out-path from
    // the gate's left edge to its slot, landing with a 3 px settle; launched far slots first (fu_ORD10 / fu_ORD20); example 1's
    // leave with the reset (16 px drop + smoothstep fade, 0.02 s stagger in slot order, 0.42 s each)
    const fly = (i, t0, fade) => {
      const te = t0 + 0.3, p = pr(tv, t0, te); if (p <= 0) return;
      const [SX, SY] = fu_SLOT(i), cx0 = SX + 35, cy0 = SY + 18;
      let cx = cx0, cy = cy0;
      if (p < 1) [cx, cy] = fu_quadAt(fu_OUT0, fu_OUTC, [cx0, cy0], e3(p));
      else cy += 3 * fu_bump(tv, te, 0.12);
      const fo = fade ? ss(pr(tv, K.rst0 + 0.02 * i, K.rst0 + 0.02 * i + 0.42)) : 0;
      fu_block(x, cx - 35, cy - 18 + 16 * fo, { a: cl(p * 5) * (1 - fo) });
    };
    if (tv >= K.b1 && tv < K.rst0 + 0.7) for (let j = 0; j < 10; j++) fly(fu_ORD10[j], K.b1 + K.b1s * j, true);
    if (tv >= K.b2) for (let j = 0; j < 20; j++) fly(fu_ORD20[j], K.b2 + K.b2s * j, false);

    // ---- 6. ghosts + comets on the in-path, clipped out of the gate (they slide in under it)
    const ghosts = tv < K.fl1 + 0.05 ? K.g1 : K.g2;
    if (ghosts.some((t0) => tv > t0 && tv < t0 + K.gd)) {
      x.save(); x.beginPath(); x.rect(-200, -200, W + 400, H + 400); // the frame minus the gate's TAG (tagPath would reset the path)
      [[830 + 0.355 * 150, 370], [1090, 370], [1090, 370 + 0.57 * 150], [1090 - 0.35 * 150, 520], [830, 520], [830, 370 + 0.43 * 150]].forEach(([px, py], i) => (i ? x.lineTo(px, py) : x.moveTo(px, py)));
      x.closePath(); x.clip("evenodd");
      for (const t0 of ghosts) fu_ghost(x, tv, t0, K.gd);
      x.restore();
    }

    // ---- 7. the GATE: corner triangles (legs 18) at x 806-1114, y 346-544 fly out from under it and snap 6 px on arming;
    // TAG 260x150 at x 830-1090, y 370-520, PANEL, white .25 rim idle, RED 2 px armed, white for 2 frames on a flash;
    // 'x10' metallic I200 96 centred x 960, baseline 480: rises 16 px through a clip on arming, pulses 1.08 on a flash
    const d = G.snap;
    if (tv >= K.cor0) corners(x, 806 - d, 346 - d, 308 + 2 * d, 198 + 2 * d, { L: 18, u: pr(tv, K.cor0, K.cor1), u2: 0 });
    tag(x, 830, 370, 260, 150, { outline: 0.25, rim: G.white ? 0 : G.red });
    if (G.white) { x.save(); tagPath(x, 830, 370, 260, 150); x.lineWidth = 2; x.strokeStyle = WHITE; x.stroke(); x.restore(); }
    if (tv >= K.x0) {
      const kx = e4(pr(tv, K.x0, K.x1));
      x.save(); x.beginPath(); x.rect(836, 376, 248, 110); x.clip(); fu_sc(x, 960, 445, 1 + G.pulse);
      metal(x, "x10", 960, 480 + 16 * (1 - kx), 96, { align: "center", a: kx });
      x.restore();
    }
  }

  // ================================================================== I · VO 47.41-50.65 · $20,000, THE INCUBATION CAP (L3, x 80-800)
  async function fu_I(x, tv) {
    const K = fu_K.I;
    if (tv < K.kick || tv > K.o1) return;
    x.save();
    const a = fu_exit(x, tv, K.o0, K.o1, 410, 470);
    await fu_layer(x, 90, 270, 680, 410, a, (c) => {
      // kicker «قيمة التمويل» A500 44 white, right-aligned x 693, baseline 330: rises 16 px (0.42 s e4), landing on «قيمة»
      fu_word(c, "قيمة التمويل", 693, 330, 44, 500, WHITE, e4(pr(tv, K.kick, K.kick + 0.42)), 16);
      // the equation, LTR, baseline 420: '$2,000' (metallic I300 44) x 120, RED '×' x 282, '10' x 325, '=' (grey) x 377;
      // each rises 12 px (e4, 0.35 s), 0.06 s apart, left to right
      const ke = (i) => e4(pr(tv, K.eq + 0.06 * i, K.eq + 0.06 * i + 0.35));
      let k = ke(0); if (k > 0) metal(c, "$2,000", 120, 420 + 12 * (1 - k), 44, { w: 300, a: k });
      k = ke(1); if (k > 0) T(c, "×", 282, 420 + 12 * (1 - k), { fam: LAT, w: 300, size: 44, color: RED, a: k });
      k = ke(2); if (k > 0) T(c, "10", 325, 420 + 12 * (1 - k), { fam: LAT, w: 300, size: 44, color: WHITE, a: k });
      k = ke(3); if (k > 0) T(c, "=", 377, 420 + 12 * (1 - k), { fam: LAT, w: 300, size: 44, color: GREY, a: k });
      // '$20,000' metallic I200 150, left-aligned x 120 (x 120-693), baseline 560: counts 0 -> 20,000 in fixed cells and
      // lands on «عشرين» (49.30); bottom 28 % fade; one sheen 49.90-50.25
      if (tv >= K.n0) {
        const ui = expo(pr(tv, K.n0, K.n0 + 0.45));
        metalCount(c, 20000 * e4(pr(tv, K.n0, fu_t1(K.n0, K.nL, 20000))), "$20,000", 120, 560 + 16 * (1 - ui), 150,
          { fade: true, a: cl(ui * 1.25), sheen: pr(tv, K.sh0, K.sh1) });
      }
      chev3(c, 717, 490, tv, K.chev); // ▲▲▲ to its right (x 717-735, y 490 / 512 / 534)
      // the cap row, baseline 640, RTL from x 693: DOME 36 (675,628), «سقف التمويل» A300 34 grey (x 442-645), 'Incubation'
      // I400 30 white (x 291-430); rises 12 px (0.42 s e4)
      if (tv >= K.cap) {
        const kc = e4(pr(tv, K.cap, K.cap + 0.42)), dy = 12 * (1 - kc);
        c.save(); c.globalAlpha *= kc; c.translate(0, dy);
        sym(c, "dome", 675, 628, 36, { u: pr(tv, K.cap, K.cap + 0.42) });
        T(c, "سقف التمويل", 645, 640, { w: 300, size: 34, color: GREY });
        T(c, "Incubation", 430, 640, { fam: LAT, w: 400, size: 30, color: WHITE, align: "right" });
        c.restore();
      }
    });
    x.restore();
  }

  GROUPS.push({
    name: "fund",
    floor(t, sh, S) { if (S.shot && S.shot.k_beat === "G") fu_floorG(t, sh); },
    async draw(x, t, S) {
      const k = S.shot && S.shot.k_beat;
      if (k === "G") await fu_G(x, t - P);
      else if (k === "I") await fu_I(x, t - P);
    },
    async broll(x, t, S, id) {
      if (id !== 2) return;
      const lt = Math.max(0, t - S.shot.f0 / 25), tv = t - P;
      await brScene(x, t, lt, { cz0: 37, bokehY: 370 }, async (c) => fu_H(c, tv));
    },
  });

  // ================================================================== GROUP «conds» (prefix cd_): beats J, K, L, M
  // Spec: mg_ep2_final.json beats J, K, L, M (layouts in screen px, widths measured with the project fonts: they match).
  // Times are VO seconds (tv = t - P). Shots are picked by S.shot.k_beat ('J', 'K', 'L', 'M'), never by times.
  // J  L5  VO 50.65-54.65  CONDITION 1: card + pips (1 LIT -> DONE on «على الأقل»), 40 TAG tickets fill with the
  //                        counter '40' (lands on «أربعين» 52.68), «صفقة مستقلّة», the gaps open, RED '+' -> '40+'
  // K  L2  VO 54.65-57.01  CONDITION 2: «عائد», corner marks around a dotted TARGET line, five candles step up, kicker
  //                        «لا يقلّ عن», ▲▲▲, metallic '7%' on «سبعة» (56.20), the last high touches the line (RED flash)
  // L  VC  VO 57.01-61.49  CONDITION 3 (WIDE): pool .18, dashed RED limit ring drawn clockwise (+ inner pool .12), the
  //                        two-tone headline + flag, pips (1-2 DONE, 3 LIT), right chart: RED limit line '−10%', equity
  //                        line falling to 8 px above it, pulses, recovery, live scroll; left: RED '−' + metallic '10%'
  //                        (59.18) with one sheen and the footnote
  // M  L1  VO 61.49-67.53  CONDITION 4: card + pips (1-3 DONE, 4 LIT), calendar, day track with 12 ticks lit by the
  //                        counter '60' (63.31), «يوماً», the FIRST-TRADE chip (65.80), the RED fill to day 60, pip 4
  //                        DONE + the RTL recap pulses (66.43), RED check tab (66.95)
  // The engine samples frame f at VO 0.04 f - 0.61: the last frames before the cuts are J 54.59/54.63, K 56.95/56.99,
  // L 61.43/61.47, M 67.47/67.51, all clean (exits end 54.56, 56.92, 61.41, 67.45). Exits fade ONE layer (cd_layer).

  const cd_K = {
    // J: في 50.68 · هذه 50.79 · المرحلة 51.03 · [51.46-51.66] · يجب 51.66 · عليك 51.99 · إتمام 52.33 · أربعين 52.68 ·
    //    صفقة 53.09 · مستقلّة 53.38 · على 54.01 · الأقل 54.19-54.53 (cut 54.65)
    J: { card: 51.08, pulse: 51.66, c0: 51.99, land: 52.68, saf: 53.09, gap: 53.38, plus: 54.01, o0: 54.28, o1: 54.56 },
    // K: وتحقيق 54.70 · عائد 55.05 · [55.40-55.66] · لا 55.66 · يقلّ 55.81 · عن 56.13 · سبعة 56.23 · % 56.52-56.96 (cut 57.01)
    K: { aid: 55.06, cdl: 55.20, kick: 55.66, wick: 56.05, chev: 56.12, seven: 56.20, o0: 56.68, o1: 56.92 },
    // L: [56.94-57.08] · مع 57.08 · عدم 57.38 · الوصول 57.67 · إلى 58.15 · نسبة 58.35 · انعكاس 58.57 · عشرة 59.20 ·
    //    % 59.50-59.85 · [59.84-60.08] · في أي 60.08 · وقت 60.41 · من 60.65 · الأوقات 60.89-61.32 (cut 61.49)
    L: { ring: 57.42, ring1: 58.12, head: 57.44, pips: 57.60, chart: 57.80, lim: 58.12, eq0: 58.20, eq1: 58.57,
      pulses: [59.32, 59.60, 59.88], ten: 59.18, foot: 59.20, sheen: 59.45, rec: 60.08, steps: [60.48, 60.78, 61.08],
      o0: 61.13, o1: 61.41 },
    // M: وخلال 61.66 · فترة 62.23 · لا 62.65 · تقلّ 62.84 · عن 63.21 · ستّين 63.31 · يوماً 63.89 · من 64.38 · تاريخ 64.63 ·
    //    أول 65.42 · صفقة 65.80 · [65.93-66.11] · عند 66.22 · تحقيق 66.43 · هذه 66.81 · الشروط 66.95-67.47 (cut 67.53)
    M: { card: 61.92, cal: 62.25, tr0: 62.25, tr1: 62.65, kick: 62.30, c0: 62.70, land: 63.31, yawm: 63.89, chip: 65.80,
      fill0: 65.85, fill1: 66.30, done4: 66.43, pulse: [66.43, 66.51, 66.59, 66.67], tab: 66.95, o0: 67.17, o1: 67.45 },
  };
  // a metalCount driven by fin * e4(pr(tv, t0, t1)) shows fin (Math.round reaches it) at the fraction cd_pLand(fin) of
  // its window; t1 is chosen so that the landing falls exactly on the spoken number (the quartOut shape is kept)
  const cd_pLand = (fin) => 1 - Math.pow(0.5 / fin, 0.25);
  // (the landing is aimed 4 ms ahead of tLand, so the frame sampled at tLand shows the final number despite float error)
  const cd_t1 = (t0, tLand, fin) => t0 + (tLand - 0.004 - t0) / cd_pLand(fin);
  // the time the count passes v (displays >= v): the inverse of fin * e4(pr(tv, t0, t1)) at v - 0.5
  const cd_tPass = (v, fin, t0, t1) => t0 + (1 - Math.pow(1 - cl((v - 0.5) / fin), 0.25)) * (t1 - t0);

  // ------------------------------------------------------------------ helpers
  // exit envelope (inOutCubic, as the kit's ent(): alpha -> 0, y -10, scale .985) and its transform about a pivot
  function cd_out(tv, a, b) { const u = eio(pr(tv, a, b)); return { a: 1 - u, dy: -10 * u, sc: 1 - 0.015 * u }; }
  function cd_piv(x, ex, cx, cy) { x.translate(cx, cy + ex.dy); x.scale(ex.sc, ex.sc); x.translate(-cx, -cy); }
  // one fading layer: draw(c) paints in the caller's coordinates into a device-space buffer (the bbox X, Y, w, h under
  // the current transform), which lands once at alpha a. At a = 1 it draws straight through.
  const cd_BUF = {};
  function cd_layer(x, X, Y, w, h, a, draw) {
    if (a <= 0.003) return;
    if (a >= 0.999) { draw(x); return; }
    const M = x.getTransform(), px = [X, X + w, X, X + w], py = [Y, Y, Y + h, Y + h];
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let i = 0; i < 4; i++) {
      const dx = M.a * px[i] + M.c * py[i] + M.e, dy = M.b * px[i] + M.d * py[i] + M.f;
      x0 = Math.min(x0, dx); x1 = Math.max(x1, dx); y0 = Math.min(y0, dy); y1 = Math.max(y1, dy);
    }
    x0 = Math.max(0, Math.floor(x0) - 2); y0 = Math.max(0, Math.floor(y0) - 2);
    x1 = Math.min(x.canvas.width, Math.ceil(x1) + 2); y1 = Math.min(x.canvas.height, Math.ceil(y1) + 2);
    const cw = x1 - x0, ch = y1 - y0; if (cw <= 0 || ch <= 0) return;
    let c = cd_BUF.c;
    if (!c || c.width < cw || c.height < ch) c = cd_BUF.c = U.mk(Math.max(cw, c ? c.width : 0), Math.max(ch, c ? c.height : 0));
    const cx = c.x;
    cx.setTransform(1, 0, 0, 1, 0, 0); cx.globalAlpha = 1; cx.globalCompositeOperation = "source-over"; cx.filter = "none";
    cx.clearRect(0, 0, cw, ch);
    cx.save(); cx.beginPath(); cx.rect(0, 0, cw, ch); cx.clip();
    cx.setTransform(M.a, M.b, M.c, M.d, M.e - x0, M.f - y0);
    draw(cx);
    cx.restore(); cx.setTransform(1, 0, 0, 1, 0, 0);
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha *= a; x.drawImage(c, 0, 0, cw, ch, x0, y0, cw, ch); x.restore();
  }
  // measured widths, once
  const cd_M = {};
  function cd_w(x, s, w, size) { const k = s + "|" + w + "|" + size; if (!(k in cd_M)) cd_M[k] = measure(x, s, w, size, isAr(s) ? AR : LAT); return cd_M[k]; }
  // a run of Arabic rising out of its mask (the kit headline's motion: clip + 18 px rise, alpha k), right edge Xr; the
  // clip runs from baseline - 1.25 em to baseline + 0.70 em and 0.45 em past both ends (final ي dots and swashes)
  function cd_rise(x, s, Xr, Y, size, wgt, color, k) {
    if (k <= 0) return;
    const mw = cd_w(x, s, wgt, size);
    x.save(); x.beginPath(); x.rect(Xr - mw - 0.45 * size, Y - size * 1.25, mw + 0.9 * size, size * 1.95); x.clip();
    T(x, s, Xr - mw, Y + (1 - k) * 18, { w: wgt, size, fam: AR, ltr: true, align: "left", color, a: k });
    x.restore();
  }
  // the RED '+' (Inter 200) landing at its left edge X, baseline Y: scale .6 -> 1 and a small rise, alpha
  function cd_plus(x, X, Y, size, k) {
    if (k <= 0) return;
    const pw = cd_w(x, "+", 200, size), cx = X + pw / 2, cy = Y - 0.36 * size, s = lerp(0.6, 1, k);
    x.save(); x.translate(cx, cy + (1 - k) * 6); x.scale(s, s); x.translate(-cx, -cy);
    T(x, "+", X, Y, { fam: LAT, w: 200, size, color: RED, a: cl(k * 1.5) });
    x.restore();
  }
  // CARD entry: the clip grows from the right edge with a 24 px rise and alpha (0.45 s expo); the content follows
  // 0.12 s later (10 px rise, alpha). tabU: the RED check tab (0..1)
  function cd_card(x, tv, X, Y, w, h, t0, tabU, fill) {
    const u = pr(tv, t0, t0 + 0.45), ui = expo(u), uc = expo(pr(tv, t0 + 0.12, t0 + 0.57));
    if (u <= 0) return;
    x.save(); x.translate(0, (1 - ui) * 24);
    card(x, X, Y, w, h, { u, a: cl(ui * 1.25), c: 48, tab: tabU > 0 ? "check" : null, tabU });
    if (uc > 0) {
      cardClip(x, X, Y, w, h, u);
      x.globalAlpha *= cl(uc * 1.3); x.translate(0, (1 - uc) * 10);
      fill();
    }
    x.restore();
  }
  // one-time fit check of the spec's measured widths (console only)
  let cd_FIT = false;
  function cd_fit(x) {
    if (cd_FIT) return; cd_FIT = true;
    const chk = [["صفقة مستقلّة", 400, 38, 260], ["عائد", 500, 48, 91], ["لا يقلّ عن", 300, 34, 144], ["* قد تختلف النسبة حسب المرحلة", 300, 34, 464],
      ["وفق شروط البرنامج", 300, 34, 276], ["فترة لا تقلّ عن", 300, 36, 229], ["يوماً", 400, 40, 76], ["أول صفقة", 400, 34, 161], ["−", 200, 240, 142], ["−10%", 500, 30, 76]];
    for (const [s, w, z, ref] of chk) { const m = cd_w(x, s, w, z); if (Math.abs(m - ref) > 2) console.warn(`conds fit: '${s}' ${w}/${z} = ${m.toFixed(1)} (spec ${ref})`); }
    for (const [s, z, ref] of [["40", 130, 152], ["7%", 160, 169], ["10%", 240, 346], ["60", 130, 146]]) {
      const m = metalWidth(s, z, 200); if (Math.abs(m - ref) > 2) console.warn(`conds fit: metal '${s}' ${z} = ${m.toFixed(1)} (spec ${ref})`);
    }
  }

  // ================================================================== J · VO 50.65-54.65 · condition 1: 40 trades (L5)
  // CARD 470x520 at x 1350-1820, y 240-760 (cut 48). Pips 72x48 pitch 84 right-aligned x 1750, y 262-310. Ticket grid
  // 8 x 5 TAG 40x22, pitch 52 x 34, x 1376-1780, rows 346 ... 482. Ticket n (right to left, row by row) pops when the
  // counter passes n + 1, so grid and counter stay in sync (0.017 s per ticket on average, quartOut like the count).
  function cd_J(x, tv) {
    const K = cd_K.J;
    if (tv < K.card || tv > K.o1 + 0.02) return;
    const ex = cd_out(tv, K.o0, K.o1), X = 1350, Y = 240, w = 470, h = 520;
    const t1 = cd_t1(K.c0, K.land, 40), val = 40 * e4(pr(tv, K.c0, t1));
    cd_layer(x, X - 30, Y - 30, w + 60, h + 60, ex.a, (c) => {
      c.save(); cd_piv(c, ex, X + w / 2, Y + h / 2);
      cd_card(c, tv, X, Y, w, h, K.card, 0, () => {
        // the pips: 1 LIT (one pulse on «يجب»), DONE on «على الأقل»; 2-4 DIM; staggered entry with the content
        pips(c, 1750, 262, 72, 48, 84, [{ s: tv < K.plus ? "lit" : "done", u: tv < K.plus ? 1 : pr(tv, K.plus, K.plus + 0.25),
          pulse: pr(tv, K.pulse, K.pulse + 0.3) }, {}, {}, {}], { enter: pr(tv, K.card + 0.12, K.card + 0.76) });
        // the ticket grid; its gaps open by 4 px on «مستقلّة» (tickets -2 px, pitch +2 px, about the grid's centre)
        if (tv >= K.c0) {
          const g = e4(pr(tv, K.gap, K.gap + 0.3)), tw = 40 - 2 * g, th = 22 - 2 * g, pX = 52 + 2 * g, pY = 34 + 2 * g;
          for (let n = 0; n < 40; n++) {
            const tp = cd_tPass(n + 1, 40, K.c0, t1), k = pr(tv, tp, tp + 0.16); if (k <= 0) continue;
            const r = Math.floor(n / 8), col = 7 - (n % 8);
            const TX = 1578 + (col - 3.5) * pX - tw / 2, TY = 425 + (r - 2) * pY - th / 2, s = back(k, 1.4);
            c.save(); c.globalAlpha *= cl(k * 4);
            c.translate(TX + tw / 2, TY + th / 2); c.scale(s, s); c.translate(-TX - tw / 2, -TY - th / 2);
            tagPath(c, TX, TY, tw, th); c.fillStyle = TRACK; c.fill();
            const fl = 1 - e2(pr(k, 0.15, 1)); // the white flash, then the TRACK fill
            if (fl > 0.003) { c.save(); c.globalAlpha *= 0.92 * fl; c.fillStyle = WHITE; c.fill(); c.restore(); }
            c.lineWidth = 1.5; c.strokeStyle = "rgba(255,255,255,0.55)"; c.stroke();
            c.restore();
          }
        }
        // '40' (metallic I200 130, right-aligned x 1715, baseline 650) counting in fixed slots, then the RED '+'
        const ua = e3(pr(tv, K.c0 - 0.08, K.c0 + 0.08));
        if (ua > 0) metalCount(c, val, "40", 1715, 650, 130, { w: 200, align: "right", a: ua });
        cd_plus(c, 1724, 630, 90, expo(pr(tv, K.plus, K.plus + 0.15)));
        // «صفقة مستقلّة» (A400 38 white, right-aligned x 1780, baseline 716)
        cd_rise(c, "صفقة مستقلّة", 1780, 716, 38, 400, WHITE, e4(pr(tv, K.saf, K.saf + 0.42)));
      });
      c.restore();
    });
  }

  // ================================================================== K · VO 54.65-57.01 · condition 2: +7% (L2 slot)
  // slot x 100-650, y 140-500. «عائد» A500 48 (x 620, baseline 212); «لا يقلّ عن» A300 34 grey (x 620, baseline 262);
  // '7%' metallic I200 160 right-aligned x 620, baseline 440 (x 451-620), bottom fade; ▲▲▲ x 415-433, y 370/392/414;
  // chart corners x 120-340, y 250-470, target line y 280 (white .30, dash 3/6) x 130-330; candles body 18, pitch 36,
  // centres x 150-294. Candles in screen px [open, close, high, low]: four up (white), one down (RED), stepping up.
  const cd_KC = [[452, 424, 416, 458], [424, 396, 388, 432], [396, 410, 390, 418], [410, 352, 344, 416], [352, 306, 296, 360]];
  function cd_Kc(x, tv) {
    const K = cd_K.K;
    if (tv < K.aid || tv > K.o1 + 0.02) return;
    const ex = cd_out(tv, K.o0, K.o1);
    cd_layer(x, 90, 130, 580, 380, ex.a, (c) => {
      c.save(); cd_piv(c, ex, 370, 320);
      cd_rise(c, "عائد", 620, 212, 48, 500, WHITE, e4(pr(tv, K.aid, K.aid + 0.42)));
      cd_rise(c, "لا يقلّ عن", 620, 262, 34, 300, GREY, e4(pr(tv, K.kick, K.kick + 0.42)));
      // the chart: corner marks fly out, dotted sides, the dotted TARGET line (flashes RED on the touch)
      // (the fly-out's clock starts 0.02 s ahead of «عائد» so the first frame it shows on, f 1392 at VO 55.07, already has the
      // four corners apart: from 55.06 that frame sampled expo(.02) = .14 and the four 18 px triangles tiled into a solid
      // red square for one frame)
      corners(c, 120, 250, 220, 220, { L: 18, u: pr(tv, K.aid - 0.02, K.aid + 0.43), u2: pr(tv, K.aid + 0.25, K.aid + 0.6) });
      const ul = e3(pr(tv, K.aid + 0.15, K.aid + 0.5));
      if (ul > 0) {
        c.save(); c.lineWidth = 1.5; c.setLineDash([3, 6]);
        c.strokeStyle = "rgba(255,255,255,0.30)"; c.beginPath(); c.moveTo(130, 280); c.lineTo(lerp(130, 330, ul), 280); c.stroke();
        const kf = pr(tv, K.seven, K.seven + 0.25);
        if (kf > 0 && kf < 1) { // full RED for 0.1 s, then back to white over 0.15 s
          c.globalAlpha *= 1 - e2(pr(kf, 0.4, 1)); c.lineWidth = 2.5; c.strokeStyle = RED;
          c.beginPath(); c.moveTo(130, 280); c.lineTo(330, 280); c.stroke();
        }
        c.restore();
      }
      cd_KC.forEach((q, i) => {
        const g = pr(tv, K.cdl + 0.1 * i, K.cdl + 0.1 * i + 0.22); if (g <= 0) return;
        const yH = i === 4 ? lerp(q[2], 280, e3(pr(tv, K.wick, K.seven))) : q[2]; // the last high reaches the line
        candle(c, 150 + 36 * i, q[0], q[1], yH, q[3], 18, { grow: g, upColor: UPC2 });
      });
      // ▲▲▲ 0.08 s ahead of the numeral; metallic '7%' lands on «سبعة» (scale 1.04 -> 1, 0.25 s)
      chev3(c, 415, 370, tv, K.chev);
      const kt = pr(tv, K.seven, K.seven + 0.25);
      if (kt > 0) {
        const s = lerp(1.04, 1, expo(kt));
        c.save(); c.globalAlpha *= cl(kt * 3); c.translate(535, 382); c.scale(s, s); c.translate(-535, -382);
        metal(c, "7%", 620, 440, 160, { w: 200, align: "right", fade: true });
        c.restore();
      }
      c.restore();
    });
  }

  // ================================================================== L · VO 57.01-61.49 · condition 3: never −10% (VC WIDE)
  // headline A300 52, baseline 170, right edge 1301 (+ the scene's flag at x 1327); pips centred on x 946 (pip1 x
  // 1036-1108), y 210-258; hero right-aligned x 690, baseline 430: RED '−' (x 202-344) + metallic '10%' (x 344-690);
  // footnote A300 34 grey .85 at baselines 494 / 540; chart frame x 1230-1770, y 330-650, limit line y 600 (x 1240-1760),
  // '−10%' label I500 30 RED at x 1240, baseline 590; equity plot clipped to x 1250-1750, pitch 40, from y 420, its low
  // (1600, 592), recovering 60 px to (1640, 532), then three live points (lows 30 and 16 px above the limit).
  const cd_EQ = [[1250, 420], [1280, 412], [1320, 438], [1360, 426], [1400, 468], [1440, 456], [1480, 510], [1520, 498],
    [1560, 552], [1600, 592], [1640, 532], [1680, 570], [1720, 546], [1760, 584]];
  function cd_eqHead(tv) { // the head as a fractional point index, and the plot's scroll offset (px)
    const K = cd_K.L;
    let h = 9 * e3(pr(tv, K.eq0, K.eq1)), off = 0;
    if (tv >= K.rec) h = 9 + e3(pr(tv, K.rec, K.rec + 0.4));
    K.steps.forEach((s, j) => { const k = e4(pr(tv, s, s + 0.2)); if (k > 0) { h = 10 + j + k; off -= 40 * k; } });
    return { h, off };
  }
  function cd_eqPath(c, h, off) {
    const n = Math.floor(h), f = h - n;
    c.moveTo(cd_EQ[0][0] + off, cd_EQ[0][1]);
    for (let i = 1; i <= n; i++) c.lineTo(cd_EQ[i][0] + off, cd_EQ[i][1]);
    let hx = cd_EQ[n][0] + off, hy = cd_EQ[n][1];
    if (f > 0 && n + 1 < cd_EQ.length) { hx = lerp(cd_EQ[n][0], cd_EQ[n + 1][0], f) + off; hy = lerp(cd_EQ[n][1], cd_EQ[n + 1][1], f); c.lineTo(hx, hy); }
    return [hx, hy];
  }
  const cd_HEAD = [["عدم", "g"], ["الوصول", "g"], ["إلى", "g"], ["نسبة", "w"], ["الانعكاس", "w"]];
  function cd_L(x, tv) {
    const K = cd_K.L;
    if (tv < K.head || tv > K.o1 + 0.02) return;
    const ex = cd_out(tv, K.o0, K.o1);
    cd_layer(x, 160, 100, 1640, 580, ex.a, (c) => {
      c.save(); cd_piv(c, ex, 960, 400);
      // the two-tone headline with the scene's one flag
      headline(c, cd_HEAD, 1301, 170, 52, tv, K.head, { w: 300, flag: true, gap: 13.5 });
      // the pips under it: 1-2 DONE, 3 (shield) LIT, 4 DIM
      if (tv >= K.pips) pips(c, 1108, 210, 72, 48, 84, [{ s: "done" }, { s: "done" }, { s: "lit" }, {}], { enter: pr(tv, K.pips, K.pips + 0.64) });
      // RIGHT CHART: corner marks + dotted sides
      if (tv >= K.chart) {
        corners(c, 1230, 330, 540, 320, { L: 18, u: pr(tv, K.chart, K.chart + 0.45), u2: pr(tv, K.chart + 0.3, K.chart + 0.6) });
        const E = cd_eqHead(tv);
        // the area under the equity line (white .08) down to the limit line: the room left above −10%, clipped to the plot
        if (E.h > 0) {
          c.save(); c.beginPath(); c.rect(1250, 330, 500, 320); c.clip();
          c.beginPath(); const [hx] = cd_eqPath(c, E.h, E.off); c.lineTo(hx, 600); c.lineTo(cd_EQ[0][0] + E.off, 600); c.closePath();
          c.fillStyle = "rgba(255,255,255,0.08)"; c.fill(); c.restore();
        }
        // the dashed RED limit line (2 px, 8/6) drawn left to right, its three pulses (alpha .5 -> 1, 0.15 s) and label
        const kl = e3(pr(tv, K.lim, K.lim + 0.35));
        if (kl > 0) {
          let la = 1;
          // each pulse dips to .5 and comes back to 1 on one smooth sine over its 0.15 s, so it spans 3 frames (about .70 / .50
          // / .63); the instant drop to .5 with an e3 return only ever showed as one frame at .74 (invisible under the hit)
          for (const p of K.pulses) { const k = pr(tv, p, p + 0.15); if (k > 0 && k < 1) la = 1 - 0.5 * Math.sin(Math.PI * k); }
          c.save(); c.globalAlpha *= la; c.strokeStyle = RED; c.lineWidth = 2; c.setLineDash([8, 6]);
          c.beginPath(); c.moveTo(1240, 600); c.lineTo(lerp(1240, 1760, kl), 600); c.stroke(); c.restore();
          T(c, "−10%", 1240, 590, { fam: LAT, w: 500, size: 30, color: RED, a: e3(pr(tv, K.lim + 0.15, K.lim + 0.4)) });
        }
        // the equity line (2.5 px white)
        if (E.h > 0) {
          c.save(); c.beginPath(); c.rect(1250, 330, 500, 320); c.clip();
          c.beginPath(); cd_eqPath(c, E.h, E.off);
          c.lineWidth = 2.5; c.strokeStyle = WHITE; c.lineJoin = "round"; c.lineCap = "round"; c.stroke(); c.restore();
        }
      }
      // LEFT THIRD: RED '−' + metallic '10%' land on «عشرة» (scale 1.04 -> 1, 0.25 s), one sheen on the metal only
      const kt = pr(tv, K.ten, K.ten + 0.25);
      if (kt > 0) {
        const s = lerp(1.04, 1, expo(kt));
        c.save(); c.globalAlpha *= cl(kt * 3); c.translate(446, 343); c.scale(s, s); c.translate(-446, -343);
        T(c, "−", 202, 430, { fam: LAT, w: 200, size: 240, color: RED, ltr: true, align: "left" });
        metalCount(c, 10, "10%", 690, 430, 240, { w: 200, align: "right", fade: true, sheen: pr(tv, K.sheen, K.sheen + 0.45) });
        c.restore();
      }
      const kf = e2(pr(tv, K.foot, K.foot + 0.3));
      if (kf > 0) {
        T(c, "* قد تختلف النسبة حسب المرحلة", 690, 494, { w: 300, size: 34, color: GREY, a: 0.85 * kf });
        T(c, "وفق شروط البرنامج", 690, 540, { w: 300, size: 34, color: GREY, a: 0.85 * kf });
      }
      c.restore();
    });
  }
  // floor: pool .18 from the cut; the dashed RED limit ring (24 floorP arcs of 10° with 5° gaps, R 1.15 m, 0.05 m wide,
  // RED decal .8) drawn clockwise from the front over 57.42-58.12, static once drawn, with a soft white pool .12 inside;
  // all exit with the overlay (61.13-61.41)
  function cd_floorL(tv, sh) {
    const K = cd_K.L, xo = 1 - eio(pr(tv, K.o0, K.o1));
    if (xo <= 0.003) return;
    sh.push(fPool(0.18 * xo));
    if (tv < K.ring) return;
    sh.push(fPool(0.12 * e2(pr(tv, K.ring, K.ring + 0.5)) * xo, "#ffffff", 1.15));
    const u = e2(pr(tv, K.ring, K.ring1)) * 360, R = 1.15, hw = 0.025;
    const Pt = (deg, r) => { const th = (deg * Math.PI) / 180; return floorP(-r * Math.sin(th), -r * Math.cos(th)); };
    for (let i = 0; i < 24; i++) {
      const a0 = i * 15; if (u <= a0) break;
      const a1 = Math.min(a0 + 10, u), pts = [];
      for (let j = 0; j <= 4; j++) pts.push(Pt(lerp(a0, a1, j / 4), R + hw));
      for (let j = 4; j >= 0; j--) pts.push(Pt(lerp(a0, a1, j / 4), R - hw));
      sh.push({ type: "poly", pts, color: RED, a: 0.8 * xo });
    }
  }

  // ================================================================== M · VO 61.49-67.53 · condition 4: 60 days (L1)
  // CARD 580x430 at x 1240-1820, y 170-600 (cut 48). Pips right-aligned x 1750, y 210-258. CALENDAR 110 px centred
  // (1715, 355). Kicker A300 36 grey right-aligned x 1630, baseline 318. '60' metallic I200 130 right-aligned x 1630,
  // baseline 440; «يوماً» A400 40 right-aligned x 1462. Day track TAG 500x24 at x 1280-1780, y 470-494 (TRACK): day d at
  // x 1296 + 7.8 d (day 60 at 1764, under its label), 12 ticks 2x8 every 5 days; '60' I400 26 centred x 1764, baseline
  // 462. FIRST-TRADE chip TAG 220x50 at x 1280-1500, y 508-558 (kit tradeChip).
  function cd_Mc(x, tv) {
    const K = cd_K.M;
    if (tv < K.card || tv > K.o1 + 0.02) return;
    const ex = cd_out(tv, K.o0, K.o1), X = 1240, Y = 170, w = 580, h = 430;
    const t1 = cd_t1(K.c0, K.land, 60), val = 60 * e4(pr(tv, K.c0, t1)), shown = Math.round(val);
    cd_layer(x, X - 30, Y - 30, w + 60, h + 60, ex.a, (c) => {
      c.save(); cd_piv(c, ex, X + w / 2, Y + h / 2);
      cd_card(c, tv, X, Y, w, h, K.card, pr(tv, K.tab, K.tab + 0.25), () => {
        // pips: 1-3 DONE, 4 LIT -> DONE on «تحقيق»; then the recap: the four pulse right to left
        const st = [0, 1, 2, 3].map((i) => ({ s: i < 3 || tv >= K.done4 ? "done" : "lit", u: i === 3 && tv >= K.done4 ? pr(tv, K.done4, K.done4 + 0.25) : 1,
          pulse: pr(tv, K.pulse[i], K.pulse[i] + 0.25) }));
        pips(c, 1750, 210, 72, 48, 84, st, { enter: pr(tv, K.card + 0.12, K.card + 0.76) });
        // the calendar (static once drawn: all its cells filled, the RED cell included)
        if (tv >= K.cal) sym(c, "calendar", 1715, 355, 110, { u: pr(tv, K.cal, K.cal + 0.5) });
        // kicker, counter, «يوماً»
        cd_rise(c, "فترة لا تقلّ عن", 1630, 318, 36, 300, GREY, e4(pr(tv, K.kick, K.kick + 0.42)));
        const ua = e3(pr(tv, K.c0 - 0.08, K.c0 + 0.08));
        if (ua > 0) metalCount(c, val, "60", 1630, 440, 130, { w: 200, align: "right", a: ua });
        cd_rise(c, "يوماً", 1462, 440, 40, 400, WHITE, e4(pr(tv, K.yawm, K.yawm + 0.42)));
        // the day track: drawn left to right (0.4 s e4), the RED fill from the chip to day 60 (quartOut)
        const ut = e4(pr(tv, K.tr0, K.tr1));
        if (ut > 0) {
          c.save(); c.beginPath(); c.rect(1270, 440, 10 + 510 * ut, 60); c.clip();
          tagPath(c, 1280, 470, 500, 24); c.fillStyle = TRACK; c.fill();
          const uf = e4(pr(tv, K.fill0, K.fill1));
          if (uf > 0) { c.save(); c.clip(); c.fillStyle = RED; c.fillRect(1280, 470, 500 * uf, 24); c.restore(); }
          for (let i = 1; i <= 12; i++) {
            const tx = 1296 + 39 * i;
            c.fillStyle = shown >= 5 * i && tv >= K.c0 ? WHITE : DIM; c.fillRect(tx - 1, 478, 2, 8);
          }
          // the '60' label at the day-60 end: grey, lit white on the landing
          const kl = e3(pr(tv, K.land - 0.02, K.land + 0.13));
          T(c, "60", 1764, 462, { fam: LAT, w: 400, size: 26, align: "center", color: GREY, a: 1 - kl });
          if (kl > 0) T(c, "60", 1764, 462, { fam: LAT, w: 400, size: 26, align: "center", color: WHITE, a: kl });
          c.restore();
        }
        // the FIRST-TRADE chip drops onto the track's left end (0.3 s expo + a 4 px settle)
        const kc = pr(tv, K.chip, K.chip + 0.3);
        if (kc > 0) {
          const dy = -20 * (1 - expo(kc)) + 4 * Math.sin(Math.PI * pr(tv, K.chip + 0.26, K.chip + 0.42));
          c.save(); c.translate(0, dy); tradeChip(c, 1280, 508, 220, 50, "أول صفقة", { a: cl(kc * 4) }); c.restore();
        }
      });
      c.restore();
    });
  }

  // ================================================================== register
  GROUPS.push({
    name: "conds",
    floor(t, sh, S) {
      const k = S && S.shot && S.shot.k_beat;
      if (k === "L") cd_floorL(t - P, sh);
    },
    draw(x, t, S) {
      const k = S && S.shot && S.shot.k_beat;
      if (k !== "J" && k !== "K" && k !== "L" && k !== "M") return;
      cd_fit(x);
      if (k === "J") cd_J(x, t - P);
      else if (k === "K") cd_Kc(x, t - P);
      else if (k === "L") cd_L(x, t - P);
      else cd_Mc(x, t - P);
    },
  });

  // ================================================================== MAIN: routing, subtitles, bug, wipe, specials
  // Each group file pushes { name, floor(t, sh, S), draw(x, t, S), title(x, t, S), broll(x, t, S, id), end(x, t, S),
  // cover(x, S) } into GROUPS; only the members a group needs are present.
  // SUBS (k_t.subs, from edl_build.py): [start, end, text, hardIn, hardOut] in OUTPUT seconds. A boundary within
  // 0.12-0.16 s of a picture cut is snapped onto it and switches hard on the cut (nothing half-faded across a cut);
  // otherwise 0.11 s fade in (from start - 0.05) and 0.1 s fade out (ending at end).
  function subtitles(x, t) {
    if (NO_SUBS) return;
    let c = null;
    for (const sp of SUBS) if (t >= (sp[3] ? sp[0] : sp[0] - 0.05) && t < sp[1]) { c = sp; break; }
    if (!c) return;
    const [s, end, text, hin, hout] = c;
    const a = (hin ? 1 : e2(pr(t, s - 0.05, s + 0.06))) * (hout ? 1 : 1 - e2(pr(t, end - 0.1, end)));
    if (a <= 0.003) return;
    x.save();
    font(x, 500, 36, AR);
    x.direction = "rtl";
    const w = x.measureText(text).width + 56;
    x.globalAlpha = a;
    x.fillStyle = "rgba(6,7,9,0.62)";
    rr(x, 960 - w / 2, 1012 - 30, w, 60, 14); x.fill();
    x.restore();
    txt(x, text, 960, 1013, { w: 500, size: 36, alpha: a, shadow: false }); // no shadows on type (brand); the pill carries the contrast
  }
  // bug: the official lockup 160 px wide at x 80-240, y 60-95 (inside the safe area, as on pages 4-5), alpha .85, on every
  // presenter shot inside BUG (VO s, k_t.bug), switching with the cuts
  async function bug(x, t, S) {
    if (t < v(BUG[0]) || t >= v(BUG[1])) return;
    await logo(x, 80 + 80, 60 + 17.5, 160, 0.85);
  }
  // chamfer wipe into the end card: a #000 panel enters from the right with a '/' edge (logo slant) and a 3 px red line
  // over WIPE (VO s, k_t.wipe; inOutCubic, about 13 frames) and covers the frame at its end, where the end card cuts in;
  // V's graphics hold at full opacity under it. The whole slanted edge starts off-screen right and clears the top-left
  // corner (the last part covered) at t1.
  function endWipe(x, t) {
    const t1 = v(WIPE[1]), t0 = v(WIPE[0]);
    if (t < t0 || t > t1 + 0.04) return;
    const u = eio(pr(t, t0, t1)), sl = 0.82, x0 = W + 30 + sl * (H + 20), xe = x0 - u * (x0 + 10); // x of the edge at the top
    x.save();
    x.fillStyle = "#000000"; x.beginPath(); x.moveTo(xe, -10); x.lineTo(W + 20, -10); x.lineTo(W + 20, H + 10); x.lineTo(xe - sl * (H + 20), H + 10); x.closePath(); x.fill();
    x.strokeStyle = RED; x.lineWidth = 3; x.beginPath(); x.moveTo(xe, -10); x.lineTo(xe - sl * (H + 20), H + 10); x.stroke();
    x.restore();
  }
  async function drawAll(x, t, S) {
    const vc = S.shot && S.shot.k_vcam;
    if (vc) {
      const sh = [];
      for (const g of GROUPS) if (g.floor) g.floor(t, sh, S);
      if (sh.length) floorLight(x, S, sh, 1.8);
    }
    if (NO_TEXT) return;
    for (const g of GROUPS) if (g.draw) { await g.draw(x, t, S); U.reset(x); x.direction = "ltr"; } // U.reset() keeps ctx.direction
  }
  RRC.hook("after_post", async (S, x) => {
    U.reset(x);
    const t = S.t, sh = S.shot || {};
    if (COVER) { for (const g of GROUPS) if (g.cover) await g.cover(x, S); U.reset(x); return; }
    if (sh.k_title) { for (const g of GROUPS) if (g.title) await g.title(x, t, S); U.reset(x); return; }
    if (sh.k_end) { for (const g of GROUPS) if (g.end) await g.end(x, t, S); U.reset(x); return; }
    if (sh.k_broll) {
      for (const g of GROUPS) if (g.broll) await g.broll(x, t, S, sh.k_broll);
      U.reset(x); subtitles(x, t); U.reset(x); return;
    }
    await drawAll(x, t, S);
    U.reset(x);
    if (!NO_TEXT) await bug(x, t, S);
    U.reset(x);
    subtitles(x, t);
    U.reset(x);
    endWipe(x, t);
    U.reset(x);
  });
  RRC.register("SPECIALS", "k_card", {
    allow: [],
    draw(S, p, x) { x.fillStyle = "#000000"; x.fillRect(0, 0, S.W, S.H); }, // = the graded studio void after the look
  });
})();
