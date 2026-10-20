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
  const v = (t) => t + P;
  RRC.hook("ready", ({ E }) => {
    const k = (E && E.k_t) || {};
    P = k.P ?? 3.0;
    NO_TEXT = !!(E && E.k_no_text);
    NO_SUBS = !!(E && E.k_no_subs);
    SUBS = k.subs || [];
    COVER = !!(E && E.k_cover);
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
  // default, Latin runs LTR and left-aligned. No shadows or glows on type (brand rule).
  const isAr = (s) => /[؀-ۿ]/.test(s);
  function font(x, w, s, fam) { x.font = `${w} ${s}px ${fam || AR}`; }
  function famOf(s, o) { return o.fam || (isAr(s) ? AR : LAT); }
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
    x.fillText(s, X, Y);
    const m = x.measureText(s).width;
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
    x.fillText(s, cx, cy);
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
    x.save(); x.fillStyle = o.color || RED;
    for (let i = 0; i < 3; i++) { // i 0 = bottom
      const k = pr(t, t0 + i * 0.08, t0 + i * 0.08 + 0.3); if (k <= 0) continue;
      const sc = back(k, 1.4), per = o.period ?? 1.2, wave = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(((t - t0 - i * 0.15) * 2 * Math.PI) / per));
      const cy = Ytop + (2 - i) * pitch, cx = X + w / 2;
      x.globalAlpha = a * cl(k * 3) * (k >= 1 ? wave : 1);
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
      x.globalAlpha = a * e3(o.done);
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
      x.globalAlpha = a * k; x.fillStyle = RED;
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
        x.save(); x.globalAlpha *= cl(u * 1.5); x.font = `600 28px ${LAT}`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = o.dim ? INK : WHITE; x.fillText("500", 0, 2); x.restore();
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

  // ================================================================== GROUP "open" (prefix op_)
  // Title card (output 0-3.0) · A (VO 0-4.40, HOME -> WIDE pull at 1.50: the official lockup in the void, floor pool and
  // ◢ ripple) · B (VO 4.40-8.84, L5: the two agenda cards) · V (VO 105.58-110.88, push to HOME: six videos, one stage
  // each, and the next-video deck) · end card (output 113.88-120) · YouTube cover. Spec: work/mg_final.json.
  // t = OUTPUT seconds; tv = t - P = VO seconds. Word onsets and pauses of the final voice (work/words_v4.json and the
  // energy of audio/vo/vo1_clean_v4.wav): «اكسي» 1.66, «سيليكت» 1.92-1.98, pause 2.30-2.62, «الاشتراك» 4.54, pause
  // 5.24-5.34, pause 7.75-8.08 («Axi» 8.09), pause 105.72-106.15, «تفاصيل» 106.46, «وقواعد» 106.96, «كل مرحلة» 107.46,
  // pause 108.17-108.47 («انتقل» 108.48), gap 109.43-109.50 («القادمة»), silence from 110.0.
  const op_SPR = {};

  // ------------------------------------------------------------------ shared helpers
  // MG pages are pure #000 (the special's black; the engine grain is soft-light, so black stays 0). Light comes only from
  // the designed elements: ◢ texture, bokeh, logo and type. Every exit eases in and out (eio): no last-frame drop.
  function op_black(x, a) {
    if (a <= 0.003) return;
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = cl(a); x.fillStyle = "#000"; x.fillRect(0, 0, x.canvas.width, x.canvas.height); x.restore();
  }
  // candle bokeh band kept low: the kit layers (far 24 px / .30, near 10 px / .45) rise ~280 px across the frame; a slight
  // clockwise turn about the centre column flattens that to ~100 px, so the band (layer top `top`) spans about
  // top+280..top+560 at x 960, ~90 px lower on the left and ~90 px higher on the right (still a rising diagonal). The
  // turned layers are cached once per `top` (a rotated 2600 px drawImage costs ~150 ms a frame in software raster) and
  // drawn axis-aligned at integer offsets, drifting left 12 and 30 px/s; t is card-local, at most ~6 s, so no tiling.
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
  // per-word reveal from the right: clip + rise (e4), words [[text, color], ...] in reading order, RTL from X; baseline Y
  function op_words(x, words, X, Y, size, wgt, t, t0, o = {}) {
    const st = o.stagger ?? 0.1, dur = o.dur ?? 0.4, rise = o.rise ?? 18, gap = o.gap ?? size * 0.28, a = o.a ?? 1;
    let xx = X;
    words.forEach(([s, c], i) => {
      const fam = isAr(s) ? AR : LAT, mw = measure(x, s, wgt, size, fam);
      const k = e4(pr(t, t0 + i * st, t0 + i * st + dur));
      if (k > 0 && a > 0.003) {
        x.save(); x.beginPath(); x.rect(xx - mw - 10, Y - size * 1.3, mw + 20, size * 1.3 + size * 0.45); x.clip();
        T(x, s, xx - mw, Y + (1 - k) * rise, { w: wgt, size, fam, ltr: true, align: "left", color: c, a: a * cl(k * 1.3) });
        x.restore();
      }
      xx -= mw + gap;
    });
    return X - xx;
  }
  // logo exit: the SELECT tag wipes off right to left behind the red '/' edge, then the axi wordmark sinks into its
  // baseline clip (k 0..1). Same geometry as the kit's logoBuild (the kit only builds on).
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
  // RED / DARK pill with the arrow disc, built on the kit's pill(); arrowNudge moves the arrow alone (the kit's nudge
  // also moves the disc), so the disc stays put and the ← taps left inside it
  function op_pillArrow(x, X, Y, w, h, label, o = {}) {
    pill(x, X, Y, w, h, label, { ...o, circle: true, nudge: 0 });
    if (!o.arrowNudge) return;
    const red = o.kind === "red", d = h - 14, cxD = X + w - 7 - d / 2, cy = Y + h / 2, q = d * 0.22, sc = o.scale ?? 1;
    x.save(); x.globalAlpha *= o.a ?? 1;
    x.translate(X + w / 2, cy); x.scale(sc, sc); x.translate(-(X + w / 2), -cy);
    x.fillStyle = red ? WHITE : RED; x.beginPath(); x.arc(cxD, cy, d / 2 - 0.5, 0, Math.PI * 2); x.fill();
    const ax = cxD + o.arrowNudge;
    x.strokeStyle = red ? RED : WHITE; x.lineWidth = 3; x.lineCap = "round"; x.lineJoin = "round";
    x.beginPath(); x.moveTo(ax + q, cy); x.lineTo(ax - q, cy); x.moveTo(ax - q * 0.15, cy - q * 0.85); x.lineTo(ax - q, cy); x.lineTo(ax - q * 0.15, cy + q * 0.85); x.stroke();
    x.restore();
  }
  // small tick (check) centred at cx, cy, width s
  function op_tick(x, cx, cy, s, a = 1, color = RED, lw = 3) {
    if (a <= 0.003) return;
    x.save(); x.globalAlpha *= a; x.strokeStyle = color; x.lineWidth = lw; x.lineCap = "round"; x.lineJoin = "round";
    x.beginPath(); x.moveTo(cx - s * 0.5, cy); x.lineTo(cx - s * 0.15, cy + s * 0.34); x.lineTo(cx + s * 0.5, cy - s * 0.36); x.stroke(); x.restore();
  }

  // ------------------------------------------------------------------ TITLE CARD (output 0.00-3.00)
  // Line 1 (RTL, baseline 470, spans x 620-1301): mirrored flag h 40 at x 1271, y 373 (alef line) · metallic '(1)' right
  // edge 1215 · «كيف تبدأ» right edge 1054. Line 2 (baseline 650): «مع» right edge 1330 (40 px from the logo, outside its
  // 33 px clear space) · the official logo 600 x 131 at x 590-1190, y 560-691. No ▲▲▲ (nothing touches the logo).
  async function op_title(x, t) {
    const out = eio(pr(t, 2.62, 2.94)), keep = 1 - out; // on pure #000; the exit eases in and out
    op_bokeh(x, t, 0.35 * e2(pr(t, 0, 0.60)) * keep, 500); // drifting blur: drawn unscaled, outside the 2 % push
    x.save();
    const s = 1 + 0.02 * pr(t, 0, 2.6); // slow uniform push about the centre
    x.translate(960, 540); x.scale(s, s); x.translate(-960, -540);
    triTex(x, keep, { reveal: pr(t, 0, 0.80), dir: "rtl", dx: -4 * t });
    x.translate(0, -10 * out);
    const A = keep;
    flag(x, 1271, 373, 40, { mirror: true, u: pr(t, 0.25, 0.47), a: A });
    const k1 = e4(pr(t, 0.35, 0.80));
    if (k1 > 0) { // '(1)' rises 40 px through a clip, one sheen at 0.85
      x.save(); x.beginPath(); x.rect(1060, 470 - 130, 190, 130 + 34); x.clip();
      metal(x, "(1)", 1215, 470 + 40 * (1 - k1), 120, { w: 200, align: "right", a: A * cl(k1 * 1.4), sheen: pr(t, 0.85, 1.35) });
      x.restore();
    }
    op_words(x, [["كيف", WHITE], ["تبدأ", WHITE]], 1054, 470, 120, 300, t, 0.45, { stagger: 0.1, dur: 0.4, a: A });
    const km = e4(pr(t, 0.95, 1.30));
    if (km > 0) T(x, "مع", 1330, 650 + 16 * (1 - km), { w: 300, size: 72, color: GREY, a: A * cl(km * 1.3) });
    await logoBuild(x, t, 1.05, 890, 625.6, 600, { d: 0.9, sheen: false, a: A }); // no sheen: white on white is invisible
    x.restore();
    op_black(x, pr(t, 2.86, 2.94)); // 2.94-3.00 black (grain included), hard cut to HOME
  }

  // ------------------------------------------------------------------ A · VO 0-4.40 (HOME, pull-out to WIDE at 1.50)
  // Clean while Rabee greets (pool at base .18). 1.62-2.30 the pool lifts to .30; logo 760 x 166 centred (946,305) builds
  // from 1.78 (pull 96 % done) so the SELECT tag wipes on «سيليكت» (2.00); kicker «برنامج التمويل» right edge 1061,
  // baseline 162, flag h 18 at x 1083; the ◢ floor ripple 2.20-3.90; exit 4.00-4.30 (tag wipes off right to left, axi
  // sinks, kicker fades, pool back to base). No ▲▲▲ (nothing in the logo's clear space).
  const op_A = { t0: 1.78, d: 0.75, cx: 946, cy: 305, w: 760 };
  function op_floorA(t, sh) {
    const tv = t - P;
    if (tv < -0.05 || tv >= 4.40) return;
    let a = lerp(0.18, 0.30, e2(pr(tv, 1.62, 2.30)));
    a = lerp(a, 0.18, eio(pr(tv, 4.00, 4.30)));
    sh.push(fPool(a));
    if (tv >= 2.20 && tv < 3.90) { // ring wave through the ◢ field: r 0.3 + 7(t - 2.20) m, band 1.0 m, peak .55, trail .06
      const R = 0.3 + 7 * (tv - 2.20), dist = (u, w) => Math.hypot(u + 0.07, w + 0.07) - R;
      sh.push(floorTris((u, w) => { const d = dist(u, w); return Math.abs(d) < 0.5 ? 0.55 * Math.pow(1 - (d / 0.5) * (d / 0.5), 2) : 0; }));
      // the trail behind the band is its own shape: floorTris buckets alpha into 6 bands (a .06 mark always draws at
      // .083), so the trail fades through the shape alpha instead, 3.60-3.90 eio (no pop)
      const ta = (0.06 / (0.5 / 6)) * (1 - eio(pr(tv, 3.60, 3.90)));
      if (ta > 0.003) { const tr = floorTris((u, w) => (dist(u, w) <= -0.5 ? 0.06 : 0)); tr.a = ta; sh.push(tr); }
    }
  }
  async function op_drawA(x, t) {
    const tv = t - P, A = op_A;
    if (tv < A.t0 - 0.01 || tv >= 4.40) return;
    if (tv < 4.00) await logoBuild(x, t, v(A.t0), A.cx, A.cy, A.w, { d: A.d, sheen: false });
    else await op_logoOut(x, pr(tv, 4.00, 4.30), A.cx, A.cy, A.w);
    const ex = eio(pr(tv, 4.00, 4.30)), kk = e4(pr(tv, 2.10, 2.50));
    if (kk > 0 && ex < 1) {
      const dy = 16 * (1 - kk) - 10 * ex;
      T(x, "برنامج التمويل", 1061, 162 + dy, { w: 300, size: 44, color: GREY, a: cl(kk * 1.3) * (1 - ex) });
      flag(x, 1083, 162 - 0.81 * 44 + dy, 18, { mirror: true, u: pr(tv, 2.16, 2.38), a: 1 - ex });
    }
  }

  // ------------------------------------------------------------------ B · VO 4.40-8.84 (L5 medium): the chapter agenda
  // Two CARDs 440 x 300 (cut 36): right 01 enters on «الاشتراك», the cursor clicks the mini DARK pill in the pause 5.24;
  // left 02 enters on «والتقدّم», its stair draws and the flag MARKER (flag 20 on a 22 px pole) climbs one step every
  // 0.2 s 6.30-7.30; one sheen on «Axi» (8.09, the sheen starts 0.14 s ahead); exit right first 8.30 / 8.36.
  const op_B = {
    cards: [
      { X: 1380, Y: 330, t0: 4.80, t1: 8.30, num: "01", nx: 1412, label: "الاشتراك", ls: 48, lx: 1780 },
      { X: 100, Y: 330, t0: 5.32, t1: 8.36, num: "02", nx: 132, label: "التقدّم في المراحل", ls: 40, lx: 500 },
    ],
    w: 440, h: 300, numY: 420, labY: 490, sheen: 7.95,
    glide: 4.98, click: 5.24, curOut: 5.50,
    pill: { X: 1500, Y: 528, w: 280, h: 60 },
    stair: { x0: 480, y0: 614, sw: 40, sh: 14, t0: 5.80, t1: 6.25 }, // (480,614) up-left to (240,530): 10 px lower than
    // the spec so the marker on the top step (pole 20 + flag 18, top y 510) clears the label's descenders (y 500)
    plant: 6.12, hop0: 6.30, // the flag plants on step 1, then 5 expo hops one step every 0.2 s, on step 6 by 7.30
  };
  const op_STAIR = (() => {
    const S0 = op_B.stair, p = [[S0.x0, S0.y0]];
    for (let k = 1; k <= 6; k++) { const xr = S0.x0 - S0.sw * (k - 1), y = S0.y0 - S0.sh * k; p.push([xr, y], [xr - S0.sw, y]); }
    return p;
  })();
  function op_cardEnv(tv, t0, t1) {
    if (tv < t0 || tv > t1 + 0.30) return null;
    const u = pr(tv, t0, t0 + 0.5), ui = expo(u), uo = eio(pr(tv, t1, t1 + 0.30)), ci = expo(pr(tv, t0 + 0.12, t0 + 0.57));
    return { u, ui, uo, a: cl(ui * 1.4) * (1 - uo), dy: (1 - ui) * 24 - 10 * uo, sc: 1 - 0.015 * uo, ca: cl(ci * 1.3) * (1 - uo), cdy: (1 - ci) * 16 };
  }
  function op_stairB(x, tv, a) {
    const S0 = op_B.stair, u = pr(tv, S0.t0, S0.t1);
    if (u <= 0) return;
    const L = 6 * (S0.sw + S0.sh) + 2;
    x.save(); x.globalAlpha *= a; x.strokeStyle = WHITE; x.lineWidth = 3; x.lineCap = "round"; x.lineJoin = "round";
    if (u < 1) x.setLineDash([L * e2(u), L + 10]);
    x.beginPath(); op_STAIR.forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]))); x.stroke(); x.restore();
    if (tv < op_B.plant) return;
    const step = (k) => [S0.x0 - S0.sw * (k - 1) - S0.sw / 2, S0.y0 - S0.sh * k];
    let k = 1, hu = 1;
    for (let j = 0; j < 5; j++) { const h0 = op_B.hop0 + 0.2 * j; if (tv >= h0) { k = j + 1; hu = expo(pr(tv, h0, h0 + 0.2)); } }
    const hop = tv >= op_B.hop0, p0 = step(k), p1 = hop ? step(k + 1) : p0, e = hop ? hu : 1;
    const fx = lerp(p0[0], p1[0], e), fy = lerp(p0[1], p1[1], e) - (hop ? 7 * Math.sin(Math.PI * e) : 0);
    flagMarker(x, fx, fy, { ph: 20, h: 18, u: pr(tv, op_B.plant, op_B.plant + 0.22), a: a * cl(pr(tv, op_B.plant, op_B.plant + 0.1) * 1.2) });
  }
  async function op_drawB(x, t) {
    const tv = t - P;
    if (tv < 4.79 || tv > 8.70) return;
    const B = op_B;
    for (let i = 0; i < 2; i++) {
      const C = B.cards[i], e = op_cardEnv(tv, C.t0, C.t1);
      if (!e) continue;
      x.save();
      const cx = C.X + B.w / 2, cy = C.Y + B.h / 2;
      x.translate(cx, cy + e.dy); x.scale(e.sc, e.sc); x.translate(-cx, -cy);
      card(x, C.X, C.Y, B.w, B.h, { u: e.u, a: e.a });
      x.save(); cardClip(x, C.X, C.Y, B.w, B.h, e.u); x.translate(0, e.cdy);
      metal(x, C.num, C.nx, B.numY, 80, { w: 200, a: e.ca, sheen: pr(tv, B.sheen, B.sheen + 0.35) });
      T(x, C.label, C.lx, B.labY, { w: 500, size: C.ls, a: e.ca });
      if (i === 0) {
        const P0 = B.pill;
        pill(x, P0.X, P0.Y, P0.w, P0.h, "افتح حساب", { kind: "dark", circle: true, a: e.ca, press: tv >= B.click ? tv - B.click : null });
      } else op_stairB(x, tv, e.ca);
      x.restore();
      x.restore();
    }
    // cursor: glides in from (1840,700) to the arrow disc (expo), clicks in the pause, fades
    if (tv >= B.glide && tv < B.curOut + 0.16) {
      const P0 = B.pill, d = P0.h - 14, tx = P0.X + P0.w - 7 - d / 2 + 1, ty = P0.Y + P0.h / 2 + 1;
      const k = expo(pr(tv, B.glide, B.click)), a = cl(pr(tv, B.glide, B.glide + 0.08)) * (1 - e2(pr(tv, B.curOut, B.curOut + 0.15)));
      const pz = tv >= B.click && tv < B.click + 0.08 ? 0.9 : 1;
      x.save(); x.translate(lerp(1840, tx, k), lerp(700, ty, k)); x.scale(pz, pz); cursor(x, 0, 0, a); x.restore();
    }
  }

  // ------------------------------------------------------------------ V · VO 105.58-110.88: what's next
  // Push WIDE -> HOME 105.58-106.28 under U's held chart / '10%' / footnote (U's group, out by 108.00). Six videos, one
  // stage each: video 1 Seed (this one, done), 2 Incubation (next, also Rabee), 3-6 dim. No host names on screen.
  // Left: headline right edge 670, baselines 430 / 505, flag h 21 at x 700, y 381; symbols 44 px at x 330-670 (centres
  // 648 ... 352, Seed on the right) with the index 1-6 under each. Right: a deck of three CARDs (front 470 x 250 at x
  // 1250-1720, y 330-580; back cards offset (-22,-22) / (-44,-44) at .55), RED pill 500 x 84 at x 1220-1720, y 610-694.
  const op_V = {
    hx: 670, b1: 430, b2: 505, hs: 60, t0: 107.05,
    symT0: 107.30, sx0: 648, pitch: 59.2, sy: 567, ss: 44, iy: 626, tick1: 107.78, pulse2: 108.05,
    F: { X: 1250, Y: 330, w: 470, h: 250 }, off: [[-22, -22], [-44, -44]], dT0: 108.30,
    pill: { X: 1220, Y: 610, w: 500, h: 84, t0: 108.70 }, slide: 109.55, nudges: [109.42, 110.04],
  }; // no exit: V holds at full opacity to VO 110.88 and 90_main's chamfer wipe (VO 110.50-110.88) sweeps over it
  function op_symState(i, tv) { // per-symbol state for the six-video row: draw-on, then 3-6 settle to DIM
    const ts = op_V.symT0 + 0.05 * i;
    return { u: pr(tv, ts, ts + 0.40), dim: i >= 2 ? e2(pr(tv, ts + 0.45, ts + 0.75)) : 0, lt: tv - ts, ts };
  }
  function op_drawSym(x, i, cx, cy, size, st, a) {
    const name = STAGES[i].sym, k = { grow: st.u, ignite: st.u, flagU: st.u, t: Math.min(st.lt, 0.9) };
    if (st.dim < 1) sym(x, name, cx, cy, size, { u: st.u, a: a * (1 - st.dim), k });
    if (st.dim > 0) sym(x, name, cx, cy, size, { u: 1, a: a * st.dim, k: { grow: 1, ignite: 1, flagU: 1, t: 0.9 }, dim: true });
  }
  async function op_drawV(x, t) {
    const tv = t - P, V = op_V;
    if (tv < V.t0 - 0.01 || tv >= 110.88) return;
    // ---- left third: two-tone headline with the scene's flag + the six videos (held to the cut)
    const aL = 1;
    {
      x.save();
      flag(x, V.hx + 30, V.b1 - 0.81 * V.hs, 21, { mirror: true, u: pr(tv, V.t0, V.t0 + 0.22), a: aL });
      op_words(x, [["تفاصيل", WHITE], ["وقواعد", WHITE]], V.hx, V.b1, V.hs, 300, tv, V.t0 + 0.05, { stagger: 0.07, dur: 0.42, a: aL });
      op_words(x, [["كل", GREY], ["مرحلة", GREY]], V.hx, V.b2, V.hs, 300, tv, V.t0 + 0.19, { stagger: 0.07, dur: 0.42, a: aL });
      for (let i = 0; i < 6; i++) {
        const st = op_symState(i, tv); if (st.u <= 0) continue;
        const cx = V.sx0 - V.pitch * i, ia = e3(pr(tv, st.ts + 0.08, st.ts + 0.38));
        const sc = i === 1 ? 1 + 0.09 * Math.sin(Math.PI * pr(tv, V.pulse2, V.pulse2 + 0.5)) : 1; // next: one gentle pulse
        x.save(); x.translate(cx, V.sy); x.scale(sc, sc); x.translate(-cx, -V.sy);
        op_drawSym(x, i, cx, V.sy, V.ss, st, aL);
        x.restore();
        // index 1-6 under each symbol: 1 RED + tick (done), 2 WHITE (next), 3-6 DIM
        const s = String(i + 1), dyI = 8 * (1 - ia);
        if (i === 0) {
          const kr = e2(pr(tv, V.tick1, V.tick1 + 0.25));
          T(x, s, cx + 9, V.iy + dyI, { size: 26, w: 500, fam: LAT, align: "center", color: WHITE, a: aL * ia * (1 - kr) });
          T(x, s, cx + 9, V.iy + dyI, { size: 26, w: 500, fam: LAT, align: "center", color: RED, a: aL * ia * kr });
          op_tick(x, cx - 10, V.iy - 9 + dyI, 15, aL * kr, RED, 3);
        } else {
          if (st.dim < 1) T(x, s, cx, V.iy + dyI, { size: 26, w: 500, fam: LAT, align: "center", color: WHITE, a: aL * ia * (1 - st.dim) });
          if (st.dim > 0) T(x, s, cx, V.iy + dyI, { size: 26, w: 500, fam: LAT, align: "center", color: DIM, a: aL * ia * st.dim });
        }
      }
      x.restore();
    }
    // ---- right third: the next-video deck + pill (held to the cut)
    const aR = 1;
    if (tv < V.dT0) return;
    const F = V.F, uF = pr(tv, V.dT0, V.dT0 + 0.5), fi = expo(uF), ci = expo(pr(tv, V.dT0 + 0.12, V.dT0 + 0.57));
    x.save(); x.translate(0, (1 - fi) * 24);
    // back cards fan out from behind the front card (0.08 s stagger), clipped by the front card's reveal
    for (let j = 1; j >= 0; j--) {
      const [ox, oy] = V.off[j], kf = expo(pr(tv, V.dT0 + 0.08 * (j + 1), V.dT0 + 0.08 * (j + 1) + 0.45));
      const bx = F.X + ox * kf, by = F.Y + oy * kf, ba = 0.55 * aR * cl(fi * 1.4);
      x.save(); cardClip(x, bx, by, F.w, F.h, uF);
      card(x, bx, by, F.w, F.h, { a: ba });
      if (j === 0) metal(x, "(3)", bx + 26, by + 150, 60, { w: 200, a: ba * 0.9 });
      x.restore();
    }
    // front card: «الفيديو التالي», metallic '(2)', DOME, 'Incubation', «المرحلة الثانية». At 109.55 it slides 84 px right
    // and tilts -3 degrees, revealing the '(3)' of the card behind (the back cards sit up-left, so only a rightward slide
    // can uncover them)
    const ks = expo(pr(tv, V.slide, V.slide + 0.45)), fcx = F.X + F.w / 2, fcy = F.Y + F.h / 2;
    x.save(); x.translate(fcx + 84 * ks, fcy); x.rotate((-3 * Math.PI / 180) * ks); x.translate(-fcx, -fcy);
    card(x, F.X, F.Y, F.w, F.h, { u: uF, a: aR * cl(fi * 1.4), fillA: 1 }); // opaque: the back card's '(3)' never ghosts through
    x.save(); cardClip(x, F.X, F.Y, F.w, F.h, uF); x.translate(0, (1 - ci) * 16);
    const ca = aR * cl(ci * 1.3), R = F.X + F.w - 40;
    T(x, "الفيديو التالي", R, 392, { w: 300, size: 38, color: GREY, a: ca });
    metal(x, "(2)", F.X + 30, 540, 140, { w: 200, a: ca, sheen: pr(tv, V.dT0 + 0.75, V.dT0 + 1.25) });
    sym(x, "dome", R - 28, 448, 56, { u: pr(tv, V.dT0 + 0.20, V.dT0 + 0.70), a: ca, k: { grow: pr(tv, V.dT0 + 0.30, V.dT0 + 0.80) } });
    T(x, "Incubation", R, 516, { w: 300, size: 34, fam: LAT, color: WHITE, align: "right", a: ca });
    T(x, "المرحلة الثانية", R, 558, { w: 300, size: 34, color: GREY, a: ca });
    x.restore();
    x.restore();
    x.restore();
    // RED pill «انتقل إلى الفيديو التالي» with the white disc and a red ← that taps left twice
    const P0 = V.pill, pu = expo(pr(tv, P0.t0, P0.t0 + 0.40));
    if (pu > 0) {
      let nud = 0;
      for (const n0 of V.nudges) { const q = pr(tv, n0, n0 + 0.16); if (q > 0 && q < 1) nud = -7 * Math.sin(Math.PI * q); }
      x.save(); x.translate(0, (1 - pu) * 20);
      op_pillArrow(x, P0.X, P0.Y, P0.w, P0.h, "انتقل إلى الفيديو التالي", { kind: "red", a: aR * cl(pu * 1.3), size: 34, arrowNudge: nud || 0.0001 });
      x.restore();
    }
  }

  // ------------------------------------------------------------------ END CARD (output 113.88-120.00)
  // 90_main's chamfer wipe (#000 panel, VO 110.50-110.88) covers the frame at 113.88; the card starts and stays on pure
  // #000. Logo 720 x 157 at x 600-1320, y 270-427; RED pill 600 x 100 at x 660-1260, y 520-620 (no arrow, no ▲▲▲);
  // footer baseline 720; T&C baseline 968. Slow 1.5 % push; everything fades to black 119.10-119.85.
  function op_triRows(x, t, t0, t1, a, ex) { // the measured ◢ top band (5 rows, pitch 61) revealed row by row from the
    // top; ex = [x0, y0, x1, y1] keeps the marks out of the logo's clear space (row 5 sits at y 262-271)
    const rows = 5, u = pr(t, t0, t1) * rows;
    if (u <= 0) return;
    const full = Math.floor(u), fr = u - full, ry = (r) => 18 + 61 * r - 26;
    const band = (y0, h, aa) => {
      x.save();
      if (ex) { x.beginPath(); x.rect(-80, -80, W + 160, H + 160); x.rect(ex[2], ex[1], ex[0] - ex[2], ex[3] - ex[1]); x.clip("evenodd"); } // clear-space cut-out first
      x.beginPath(); x.rect(-80, y0, W + 160, h); x.clip(); // then the row-reveal mask
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
    runs(x, parts.map((p) => ({ ...p, gap: gap + 0.28 * p.size })), cx + total / 2, Y, { color: LEGAL, a });
  }
  async function op_end(x, t) {
    if (t >= 119.85) { op_black(x, 1); return; }
    op_bokeh(x, t - 113.88, 0.32 * e2(pr(t, 114.05, 114.60)), 420); // card-local time; unscaled, outside the push
    x.save();
    const s = 1 + 0.015 * pr(t, 114.0, 119.10);
    x.translate(960, 540); x.scale(s, s); x.translate(-960, -540);
    op_triRows(x, t, 114.00, 114.40, 1, [561, 231, 1359, 466]); // logo 600-1320 x 270-427 + 39 px clear space
    await logoBuild(x, t, 114.25, 960, 348.7, 720, { d: 0.85, sheen: false });
    const pu = expo(pr(t, 115.10, 115.50));
    if (pu > 0) {
      const draw = (c) => pill(c, 660, 520, 600, 100, "انضم إلى آكسي سيليكت", { kind: "red", a: cl(pu * 1.3), scale: lerp(0.92, 1, pu), size: 46 });
      const su = pr(t, 116.70, 117.20);
      if (su > 0 && su < 1) withSheen(x, 660, 520, 600, 100, su, draw); else draw(x);
    }
    const fu = e3(pr(t, 115.50, 115.90));
    op_footer(x, 960, 720, lerp(10, 4, fu), fu);
    op_tc(x, 960, 968, e2(pr(t, 115.80, 116.20)));
    x.restore();
    op_black(x, eio(pr(t, 119.10, 119.85)));
  }

  // ------------------------------------------------------------------ COVER (YouTube thumbnail, one L2 close-up frame)
  // Rabee's face sits at about x 990-1500; everything stays in the left half (x 80-930). Logo top-left with its clear
  // space; «الحلقة 1 من 6»; headline «(1) كيف تبدأ» / «مع Axi Select»; TAG chip '01 Seed' with the sprout; ▲▲▲.
  async function op_cover(x, S) {
    const g = x.createLinearGradient(0, 0, 980, 0);
    g.addColorStop(0, "rgba(0,0,0,0.88)"); g.addColorStop(0.6, "rgba(0,0,0,0.62)"); g.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = g; x.fillRect(0, 0, 980, H);
    x.save(); x.beginPath(); x.rect(0, 0, 940, 340); x.clip(); triTex(x, 1); x.restore();
    await logo(x, 80 + 150, 72 + 32.8, 300); // 300 x 66 at x 80-380, y 72-138
    const R = 880; // right edge of the text block, ~90 px clear of his hair
    runs(x, [{ s: "الحلقة", w: 400, size: 46, color: GREY }, { s: "1", w: 500, size: 44, fam: LAT, color: WHITE }, { s: "من", w: 400, size: 46, color: GREY }, { s: "6", w: 500, size: 44, fam: LAT, color: WHITE }], R, 300, {});
    const w1 = metalWidth("(1)", 150, 300);
    metal(x, "(1)", R, 470, 150, { w: 300, align: "right" });
    T(x, "كيف تبدأ", R - w1 - 38, 470, { w: 400, size: 150, color: WHITE });
    T(x, "مع", R, 630, { w: 400, size: 110, color: GREY });
    const wm = measure(x, "مع", 400, 110, AR);
    T(x, "Axi Select", R - wm - 34, 630, { w: 300, size: 104, fam: LAT, color: WHITE, align: "right" });
    // TAG chip (LIT: red rim) '01 Seed' with the sprout; ▲▲▲ to its left
    const cw = 340, ch = 100, cx0 = R - cw, cy0 = 690;
    tag(x, cx0, cy0, cw, ch, { rim: 1 });
    sym(x, "sprout", R - 56, cy0 + 50, 62, {});
    const sw = measure(x, "Seed", 400, 48, LAT);
    T(x, "Seed", R - 104, cy0 + 67, { w: 400, size: 48, fam: LAT, color: WHITE, align: "right" });
    T(x, "01", R - 104 - sw - 18, cy0 + 67, { w: 500, size: 40, fam: LAT, color: RED, align: "right" });
    // ▲▲▲ static at full alpha (the kit's chev3 idle wave keeps the middle one in anti-phase: 0.6 s, not 0.15 s, per step)
    const s3 = 1.3, w3 = 18 * s3, h3 = 12 * s3;
    x.save(); x.fillStyle = RED; x.strokeStyle = RED; x.lineJoin = "round"; x.lineWidth = 2 * s3;
    for (let i = 0; i < 3; i++) { const yy = cy0 + 26 + i * 22 * s3, xx = cx0 - 46 + w3 / 2; x.beginPath(); x.moveTo(xx, yy - h3 / 2); x.lineTo(xx + w3 / 2, yy + h3 / 2); x.lineTo(xx - w3 / 2, yy + h3 / 2); x.closePath(); x.fill(); x.stroke(); }
    x.restore();
  }

  GROUPS.push({
    name: "open",
    floor(t, sh) { op_floorA(t, sh); },
    async draw(x, t) {
      const tv = t - P;
      if (tv >= 1.70 && tv < 4.40) await op_drawA(x, t);
      else if (tv >= 4.78 && tv < 8.84) await op_drawB(x, t);
      else if (tv >= 107.0 && tv < 110.88) await op_drawV(x, t);
    },
    title(x, t) { return op_title(x, t); },
    end(x, t) { return op_end(x, t); },
    cover(x, S) { return op_cover(x, S); },
  });

  // ================================================================== GROUP "join": beats D, E, F1, F2, G (VO 14.88-33.40)
  // D  VC WIDE        VO 14.88-18.52  Edge Score halo over Rabee's head: 41-tick arc, metallic 0 -> 50, apex notch, '+', ▲▲▲
  // E  L5 medium      VO 18.52-22.60  the two conditions as CARDs (gauge 50+ | coins $ 500), each met with a red CHECK tab
  // F1 L3 profile     VO 22.60-27.00  the trading card, then Axi's NEW allocation card (wordmark, vault, skeleton -> title)
  // F2 VC HOME->WIDE  VO 27.00-31.92  allocation card (left) + live trading card (right), funding pour, dotted link, spills
  // G  L2 close-up    VO 31.92-33.40  «مبروك!» + flag + brand particle burst, then the stage pill '01' «المرحلة الأولى»
  // Layouts follow sel/mg_final.json. Times are VO seconds: the spec's ≈ onsets (raw-VO whisper, ~0.1 s late) are snapped
  // to work/words_v4.json and to the pauses of the final voice (14.76-15.00, 18.65-18.96, 22.61-22.96, 25.41-25.60,
  // 26.94-27.14, 31.96-32.06, 32.52-32.95). Every element is gone >= 2 frames before each cut (D 18.52, E 22.60, F1 27.00,
  // F2 31.92, G 33.40) and nothing enters while the F2 camera pulls (27.08-27.70). One flag in the whole group: G's word.
  // (The engine samples frame f at t = (f + 0.5) / 25: the last frames before the cuts are VO 18.46/18.50, 22.54/22.58,
  // 26.94/26.98, 31.86/31.90 and 33.34/33.38, all clean.)
  const jn_K = {
    D: { rip: 14.88, pool: 15.20, arc: 15.35, zero: 15.62, edge: 16.04, cap: 16.30, c0: 17.05, c1: 17.96, o0: 18.18, o1: 18.42 },
    E: { R: 18.92, sw0: 19.10, sw1: 19.45, chkR: 19.45, L: 19.32, coins: [19.42, 19.57, 19.72], n0: 19.37, n1: 19.90, lab: 20.30, chkL: 21.40, oR: [22.15, 22.43], oL: [22.22, 22.50] },
    F1: { back: 23.10, mark: 23.66, front: 23.98, tab: 24.30, vault: 24.55, title: 25.55, sub: 25.85, turn: 26.14, o0: 26.58, o1: 26.90 },
    F2: { alloc: 28.04, spR: 28.24, trade: 28.45, chart: 28.60, spW: 28.70, track: 28.95, mark: 29.70, live: 29.70, pour: 30.02, fill0: 30.08, fill1: 31.40, link: 31.00, sheen: 31.06, o0: 31.55, o1: 31.84 },
    G: { word: 32.00, burst: 32.02, pill: 32.62, o0: 33.02, o1: 33.32 },
  };
  // exit envelope (inOutCubic, as kit ent(): alpha -> 0, y -10, scale .985; the last visible frame keeps < 2 % alpha) and
  // its transform about a pivot
  function jn_x(tv, a, b) { const u = eio(pr(tv, a, b)); return { a: 1 - u, dy: -10 * u, sc: 1 - 0.015 * u }; }
  function jn_piv(x, ex, cx, cy) { x.translate(cx, cy + ex.dy); x.scale(ex.sc, ex.sc); x.translate(-cx, -cy); }
  // CARD entry of the spec: clip width grows from the right edge, 24 px rise + alpha, 0.5 s expo; content 0.12 s later
  function jn_cin(tv, t0) { const u = pr(tv, t0, t0 + 0.5); return { u, ui: expo(u), uc: expo(pr(tv, t0 + 0.12, t0 + 0.62)) }; }
  // measured string widths / fitted sizes, computed once (fit-check against the spec's boxes)
  const jn_M = {};
  function jn_fit(x, key, s, w, size, maxW, min) { if (!(key in jn_M)) jn_M[key] = fit(x, s, w, size, maxW, min, isAr(s) ? AR : LAT); return jn_M[key]; }
  function jn_w(x, key, s, w, size) { if (!(key in jn_M)) jn_M[key] = measure(x, s, w, size, isAr(s) ? AR : LAT); return jn_M[key]; }

  // per-word reveal from the right (kit headline() motion: clip + 18 px rise, 0.42 s e4, 0.07 s stagger), no flag; the clip
  // reaches baseline + 0.7 em so Arabic descenders and final-ي dots are never cut
  function jn_head(x, words, X, Y, size, tv, t0, o = {}) {
    if (tv < t0) return;
    const wgt = o.w ?? 500; let xx = X;
    words.forEach((s, i) => {
      const mw = measure(x, s, wgt, size, AR), k = e4(pr(tv, t0 + 0.05 + i * 0.07, t0 + 0.47 + i * 0.07));
      if (k > 0) {
        x.save(); x.beginPath(); x.rect(xx - mw - 6, Y - size * 1.2, mw + 12, size * 1.9); x.clip();
        T(x, s, xx - mw, Y + (1 - k) * 18, { w: wgt, size, fam: AR, ltr: true, align: "left", color: o.color || WHITE, a: k });
        x.restore();
      }
      xx -= mw + size * 0.28;
    });
  }

  // ---------------------------------------------------------------- D · Edge Score halo (VC WIDE, screen space)
  const jn_tickT = (i, c0, c1) => c0 + (c1 - c0) * (1 - Math.sqrt(1 - i / 20)); // when the quadOut counter passes 2.5 i
  function jn_D(x, tv) {
    const K = jn_K.D, cx = 946, cy = 430;
    if (tv < K.arc) return;
    const ex = jn_x(tv, K.o0, K.o1); if (ex.a <= 0.003) return;
    x.save(); jn_piv(x, ex, cx, 300); x.globalAlpha = ex.a;
    const uc = pr(tv, K.c0, K.c1), val = 50 * e2(uc); // quadOut: a soft tail, so 49 holds 3 frames, not 9
    // 41 radial ticks (one per 2.5 points), r 312 -> 330 and 5 px wide; majors to 342 at both ends, the quarters and the
    // apex. Power on left -> right (0.012 s stagger); light with the counter (white 2 frames, then RED). The fill holds at
    // 50 through the exit and fades with '50+' (no drain: draining while the number is up read as the score collapsing)
    for (let i = 0; i <= 40; i++) {
      const ua = pr(tv, K.arc + i * 0.012, K.arc + i * 0.012 + 0.1); if (ua <= 0) continue;
      let col = TRACK;
      if (i <= 20) {
        const tl = jn_tickT(i, K.c0, K.c1);
        if (tv >= tl) col = tv - tl < 0.08 ? WHITE : RED;
      }
      const r1 = i % 10 === 0 ? 342 : 330, g = e3(ua);
      x.save(); x.translate(cx, cy); x.rotate(Math.PI + (Math.PI * i) / 40); x.globalAlpha = ex.a * g; x.fillStyle = col;
      x.fillRect(312, -2.5, (r1 - 312) * (0.35 + 0.65 * g), 5); x.restore();
    }
    // red glow sprite (r 24) riding the leading tick while the counter runs
    if (uc > 0 && tv < K.c1 + 0.2) {
      const an = Math.PI + (Math.PI * val) / 100, ga = uc < 1 ? cl(uc * 8) : 1 - eio(pr(tv, K.c1, K.c1 + 0.2));
      glow(x, cx + Math.cos(an) * 321, cy + Math.sin(an) * 321, 24, RED, 0.85 * ga);
    }
    // white threshold notch outside the apex (r 350 -> 370); RED with a red glow (r 40, 0.3 s) on the landing
    const tn = K.arc + 20 * 0.012, un = e3(pr(tv, tn, tn + 0.25));
    if (un > 0) {
      const lit = tv >= K.c1, ny = cy - 350 - (1 - un) * 6;
      if (lit) { const k = pr(tv, K.c1, K.c1 + 0.3); if (k < 1) glow(x, cx, cy - 360, 40, RED, Math.pow(Math.sin(Math.PI * k), 3)); } // smooth tail
      x.save(); x.globalAlpha = ex.a * un; x.fillStyle = lit ? RED : WHITE; x.strokeStyle = x.fillStyle; x.lineWidth = 2; x.lineJoin = "round";
      x.beginPath(); x.moveTo(cx - 9, ny - 19); x.lineTo(cx + 9, ny - 19); x.lineTo(cx, ny - 1); x.closePath(); x.fill(); x.stroke();
      x.restore();
    }
    // metallic readout, Inter 200 150 centred on x 946, baseline 305, hero fade: fixed cells while counting, relaxing to the
    // natural advances over 0.15 s on the landing; floor() so '50' lands with the word
    const uz = pr(tv, K.zero, K.zero + 0.3);
    if (uz > 0) {
      const counting = tv < K.c1 + 0.15, relax = pr(tv, K.c1, K.c1 + 0.15);
      metal(x, String(Math.floor(val + 1e-6)), cx, 305, 150, { align: "center", fade: true, a: e3(uz), tab: counting, relax, sheen: pr(tv, K.c1 + 0.04, K.c1 + 0.54) });
    }
    // the RED '+' lands (rise 12 px) at x 1045-1105, baseline 290; ▲▲▲ pop to the left of the numeral, in its lower half
    const up = expo(pr(tv, K.c1, K.c1 + 0.3));
    if (up > 0) T(x, "+", 1045, 290 + (1 - up) * 12, { fam: LAT, w: 200, size: 100, color: RED, a: cl(up * 1.5) });
    chev3(x, 818, 245, tv, K.c1, { a: ex.a });
    // labels
    const ue = expo(pr(tv, K.edge, K.edge + 0.4));
    if (ue > 0) T(x, "Edge Score", cx, 362 + (1 - ue) * 12, { fam: LAT, w: 300, size: 40, align: "center", a: cl(ue * 1.4) });
    const uk = expo(pr(tv, K.cap, K.cap + 0.4));
    if (uk > 0) T(x, "الحدّ الأدنى للانضمام", cx, 412 + (1 - uk) * 12, { w: 300, size: 36, align: "center", color: GREY, a: cl(uk * 1.4) });
    x.restore();
  }

  // ---------------------------------------------------------------- E · the two conditions (L5, screen space)
  // red sweep of the gauge symbol (the kit's gauge shows its red arc only once the draw-on is done)
  function jn_gaugeRed(x, cx, cy, size, val) {
    if (val <= 0) return;
    const k = size / 100, lw = Math.max(2.5, 0.032 * size) * 2.2;
    x.save(); x.strokeStyle = RED; x.lineWidth = lw; x.lineCap = "round";
    x.beginPath(); x.arc(cx, cy + 18 * k, 40 * k, Math.PI, Math.PI + Math.PI * val); x.stroke(); x.restore();
  }
  // a condition CARD 440x320 at X,320 (cut 38): entry, check tab, exit; fill(R) draws the content with R = right edge
  function jn_Ecard(x, tv, ex, X, t0, tChk, fill) {
    const Y = 320, w = 440, h = 320, ci = jn_cin(tv, t0); if (ci.u <= 0 || ex.a <= 0.003) return;
    x.save(); jn_piv(x, ex, X + w / 2, Y + h / 2); x.translate(0, (1 - ci.ui) * 24);
    card(x, X, Y, w, h, { u: ci.u, a: cl(ci.ui * 1.25) * ex.a, c: 38, tab: "check", tabU: pr(tv, tChk, tChk + 0.25) });
    if (ci.uc > 0) {
      cardClip(x, X, Y, w, h, ci.u);
      x.globalAlpha = ex.a * cl(ci.uc * 1.3); x.translate(0, (1 - ci.uc) * 10);
      fill(X + w - 40);
    }
    x.restore();
  }
  function jn_E(x, tv) {
    const K = jn_K.E;
    if (tv < Math.min(K.R, K.L)) return;
    // RIGHT · «الشرط الأول»: gauge sweeping to the apex, '50+' (metallic, the RED '+' carried over from D), 'Edge Score'
    jn_Ecard(x, tv, jn_x(tv, K.oR[0], K.oR[1]), 1380, K.R, K.chkR, (R) => {
      T(x, "الشرط الأول", R, 392, { w: 400, size: 36, color: GREY });
      sym(x, "gauge", 1454, 394, 84, { u: pr(tv, K.R + 0.12, K.sw0), k: { val: 0 } });
      jn_gaugeRed(x, 1454, 394, 84, 0.5 * e3(pr(tv, K.sw0, K.sw1)));
      const pw = jn_w(x, "plus110", "+", 200, 110);
      T(x, "+", R - pw, 530, { fam: LAT, w: 200, size: 110, color: RED });
      metal(x, "50", R - pw, 530, 110, { align: "right" });
      T(x, "Edge Score", R, 584, { fam: LAT, w: 300, size: 34, align: "right" });
    });
    // LEFT · «الشرط الثاني»: coins dropping, '$ 500' counting (full-size '$'), «في حساب التداول» rising
    jn_Ecard(x, tv, jn_x(tv, K.oL[0], K.oL[1]), 100, K.L, K.chkL, (R) => {
      T(x, "الشرط الثاني", R, 392, { w: 400, size: 36, color: GREY });
      sym(x, "coins", 174, 394, 84, { k: { drops: K.coins.map((c) => pr(tv, c, c + 0.3)) } });
      const un = pr(tv, K.n0, K.n1);
      if (un > 0) metal(x, "$" + Math.floor(500 * e4(un) + 1e-6), R, 530, 110, { align: "right", tab: tv < K.n1 + 0.15, relax: pr(tv, K.n1, K.n1 + 0.15) });
      const ul = expo(pr(tv, K.lab, K.lab + 0.42));
      if (ul > 0) T(x, "في حساب التداول", R, 584 + (1 - ul) * 18, { w: 400, size: 34, a: cl(ul * 1.4) });
    });
  }

  // ---------------------------------------------------------------- mini candle chart (fixed price range, scroll, breathing)
  // time runs left to right (also in RTL); o: data, n, from (fractional while scrolling), lo/hi, grow(i), newest, breathe
  function jn_chart(x, X, Y, w, h, o) {
    const D = o.data, n = o.n, pitch = w / n, bw = o.body ?? pitch * 0.5, from = o.from ?? 0, lo = o.lo, hi = o.hi;
    const yOf = (p) => Y + h - ((p - lo) / (hi - lo)) * h;
    x.save(); x.beginPath(); x.rect(X, Y - 30, w, h + 60); x.clip();
    for (let i = Math.max(0, Math.floor(from) - 1); i < Math.min(D.length, Math.floor(from) + n + 1); i++) {
      const cx = X + (i - from + 0.5) * pitch; if (cx < X - pitch || cx > X + w + pitch) continue;
      const g = o.grow ? o.grow(i) : 1; if (g <= 0) continue;
      const q = D[i], yc = yOf(q.c) + (i === o.newest ? o.breathe || 0 : 0);
      candle(x, cx, yOf(q.o), yc, Math.min(yOf(q.h), yc), Math.max(yOf(q.l), yc), bw, { grow: g, newest: i === o.newest });
    }
    x.restore();
    return yOf;
  }
  function jn_range(D, i0, i1) { let lo = 1, hi = 0; for (let i = i0; i <= Math.min(D.length - 1, i1); i++) { lo = Math.min(lo, D[i].l); hi = Math.max(hi, D[i].h); } const p = (hi - lo) * 0.1; return [lo - p, hi + p]; }
  // a framed chart: candles in page-7 corner triangles, the dotted price line at the last close
  function jn_frame(x, tv, X, Y, w, h, o) {
    const yOf = jn_chart(x, X, Y, w, h, o);
    corners(x, X, Y, w, h, { L: 18, u: pr(tv, o.t0, o.t0 + 0.45), u2: pr(tv, o.t0 + 0.45, o.t0 + 0.75), mid: yOf(o.data[Math.min(o.newest, o.data.length - 1)].c) });
  }

  // ---------------------------------------------------------------- F1 · Axi opens a second account (L3: x <= 780 only)
  // seeds picked offline for a clear rise with a few RED down candles (8: 2 down; 14: 4 down)
  const jn_SER1 = () => series(86, 12, 0.5, 0.09, 0.3), jn_SER2 = () => series(249, 24, 0.45, 0.09, 0.3);
  // during the exit the whole card stack is drawn opaque into one layer (x 100-820, y 200-800) and faded once, so the
  // trading card's top edge never shows through the allocation card
  const jn_EX0 = { a: 1, dy: 0, sc: 1 };
  async function jn_F1(x, tv) {
    const K = jn_K.F1;
    if (tv < K.back) return;
    const ex = jn_x(tv, K.o0, K.o1); if (ex.a <= 0.003) return;
    if (ex.a >= 1) return jn_F1s(x, tv, ex);
    const c = tmp("jn_f1", 720, 600);
    c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalAlpha = 1; c.x.globalCompositeOperation = "source-over"; c.x.clearRect(0, 0, 720, 600);
    c.x.save(); c.x.translate(-100, -200); await jn_F1s(c.x, tv, jn_EX0); c.x.restore();
    x.save(); jn_piv(x, ex, 460, 505); x.globalAlpha *= ex.a; x.drawImage(c, 100, 200); x.restore();
  }
  async function jn_F1s(x, tv, ex) {
    const K = jn_K.F1;
    // back: the user's TRADING card at alpha .7 (480x290 at 300,470; visible below the front card from y 560):
    // «حساب التداول» in grey over a live mini chart (8 candles in corner triangles, x 330-500, y 590-730)
    const ub = expo(pr(tv, K.back, K.back + 0.4)), ba = 0.7 * cl(ub * 1.3) * ex.a;
    x.save(); jn_piv(x, ex, 540, 615); x.translate(0, (1 - ub) * 16);
    card(x, 300, 470, 480, 290, { a: ba });
    x.globalAlpha = ba;
    T(x, "حساب التداول", 740, 615, { w: 400, size: 36, color: GREY });
    const D = jn_SER1(), [lo, hi] = jn_range(D, 0, 7);
    jn_frame(x, tv, 330, 590, 170, 140, { data: D, n: 8, lo, hi, newest: 7, t0: K.back + 0.1, breathe: 6 * Math.sin((tv - K.back) * 2 * Math.PI),
      grow: (i) => pr(tv, K.back + 0.2 + i * 0.04, K.back + 0.42 + i * 0.04) });
    x.restore();
    // front: the NEW allocation CARD slides out from behind the trading card (offset +40,+60 -> place, 0.5 s expo) and
    // grows under the wordmark, which rose 12 px into its top-left at «Axi» (h 40 at 176,286) and stays on top; NEW tab '+'
    const uf = pr(tv, K.front, K.front + 0.5), ef = expo(uf), FX = 140, FY = 250, FW = 560, FH = 310, fa = cl(ef * 1.6) * ex.a;
    x.save(); jn_piv(x, ex, FX + FW / 2, FY + FH / 2);
    if (uf > 0) {
      x.save(); x.translate((1 - ef) * 40, (1 - ef) * 60);
      card(x, FX, FY, FW, FH, { a: fa, tab: "new", tabU: pr(tv, K.tab, K.tab + 0.3) });
      x.restore();
    }
    const um = expo(pr(tv, K.mark, K.mark + 0.4));
    if (um > 0) { x.globalAlpha = ex.a; await axiMark(x, 176, 286 + (1 - um) * 12, 40, cl(um * 1.4)); }
    if (uf <= 0) { x.restore(); return; }
    x.translate((1 - ef) * 40, (1 - ef) * 60); x.globalAlpha = fa;
    // VAULT 88 px at x 176-264, y 446-534; spokes turn 90 degrees (0.6 s e4) and the hub pulses once, in the micro-pause
    // between «حساب» and «التخصيص» (26.13-26.21) so the click-turn cue sits in a word gap
    const ut = pr(tv, K.turn, K.turn + 0.6);
    sym(x, "vault", 220, 490, 88, { u: pr(tv, K.vault, K.vault + 0.5), k: { rot: (Math.PI / 2) * e4(ut), pulse: pr(tv, K.turn, K.turn + 0.4) } });
    // title: skeleton 372x44 at x 288-660, y 384-428 (#2A2B2F, r 8, shimmer band right -> left every 0.9 s), then
    // «حساب التخصيص» Alexandria 500 48 right-aligned at x 660, baseline 420
    const tz = jn_fit(x, "f1title", "حساب التخصيص", 500, 48, 372, 42);
    const sk = 1 - eio(pr(tv, K.title - 0.05, K.title + 0.25));
    if (sk > 0) {
      x.save(); x.globalAlpha = fa * sk * pr(tv, K.front + 0.2, K.front + 0.5);
      rr(x, 288, 384, 372, 44, 8); x.fillStyle = TRACK; x.fill(); x.clip();
      const ph = ((tv - K.front) / 0.9) % 1, bx = 660 + 60 - ph * (372 + 120);
      const g = x.createLinearGradient(bx - 60, 0, bx + 60, 0);
      g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, "rgba(255,255,255,0.10)"); g.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g; x.fillRect(bx - 60, 384, 120, 44); x.restore();
    }
    jn_head(x, ["حساب", "التخصيص"], 660, 420, tz, tv, K.title);
    const us = expo(pr(tv, K.sub, K.sub + 0.42));
    if (us > 0) T(x, "Allocation Account", 660, 470 + (1 - us) * 14, { fam: LAT, w: 300, size: 30, color: GREY, align: "right", a: cl(us * 1.4) });
    x.restore();
  }

  // ---------------------------------------------------------------- F2 · Axi funds the allocation account (VC WIDE)
  async function jn_F2(x, tv) {
    const K = jn_K.F2;
    if (tv < K.alloc) return;
    const ex = jn_x(tv, K.o0, K.o1); if (ex.a <= 0.003) return;
    // floor: card reflections outside the pool (additive, plate space), entering with their cards and leaving with the exit
    spill(x, [
      { u: -2.75, v: -0.6, rx: 1.1, color: RED, a: 0.12 * e2(pr(tv, K.spR, K.spR + 0.5)) * ex.a },
      { u: 2.75, v: -0.6, rx: 1.1, color: WHITE, a: 0.1 * e2(pr(tv, K.spW, K.spW + 0.5)) * ex.a },
    ]);
    // static dotted link above his head, drawn right -> left from the trading card's inner edge (1260,400) to the
    // allocation card's (660,400); 3 px dots every 10 px, white .25 (70 px above the WIDE keep-out)
    const ul = expo(pr(tv, K.link, K.link + 0.45));
    if (ul > 0) {
      x.save(); x.globalAlpha = ex.a; x.strokeStyle = "rgba(255,255,255,0.25)"; x.lineWidth = 3; x.lineCap = "round"; x.setLineDash([0, 10]);
      x.beginPath(); x.moveTo(1260, 400); x.lineTo(lerp(1260, 660, ul), 400); x.stroke(); x.restore();
    }
    // LEFT · ALLOCATION card 480x300 at 180,250 (it leads: the VO names it)
    const ca = jn_cin(tv, K.alloc);
    x.save(); jn_piv(x, ex, 420, 400); x.translate(0, (1 - ca.ui) * 24);
    card(x, 180, 250, 480, 300, { u: ca.u, a: cl(ca.ui * 1.25) * ex.a });
    if (ca.uc > 0) {
      x.save(); cardClip(x, 180, 250, 480, 300, ca.u); x.globalAlpha = ex.a * cl(ca.uc * 1.3);
      const uf = e4(pr(tv, K.fill0, K.fill1));
      sym(x, "vault", 244, 314, 64, { u: pr(tv, K.alloc + 0.12, K.alloc + 0.62), k: { rot: ((2 * Math.PI) / 3) * uf } });
      jn_head(x, ["حساب", "التخصيص"], 628, 322, jn_fit(x, "f2title", "حساب التخصيص", 500, 42, 325, 38), tv, K.alloc + 0.12);
      const us = expo(pr(tv, K.alloc + 0.3, K.alloc + 0.72));
      if (us > 0) T(x, "مخصّص للمبلغ التمويلي", 628, 396 + (1 - us) * 14, { w: 400, size: jn_fit(x, "f2sub", "مخصّص للمبلغ التمويلي", 400, 34, 380, 34), color: GREY, a: cl(us * 1.4) });
      // TAG-shaped funding track 416x22 at 212,470: draws in right -> left, then fills right -> left (metallic, quartOut)
      const uk = pr(tv, K.track, K.track + 0.45);
      if (uk > 0) {
        x.save(); x.beginPath(); x.rect(628 - 418 * expo(uk), 460, 420, 42); x.clip();
        tagPath(x, 212, 470, 416, 22); x.fillStyle = TRACK; x.fill(); x.lineWidth = 1.5; x.strokeStyle = "rgba(255,255,255,0.16)"; x.stroke();
        if (uf > 0) {
          x.save(); tagPath(x, 212, 470, 416, 22); x.clip();
          const g = x.createLinearGradient(212, 0, 628, 0); // the brand's metallic ramp, brightest at the far (full) end
          g.addColorStop(0, "#F0F0F1"); g.addColorStop(0.5, "#B4B5B9"); g.addColorStop(1, "#4C4E54");
          x.fillStyle = g; x.fillRect(628 - 416 * uf, 470, 416 * uf, 22); x.restore();
        }
        x.restore();
      }
      x.restore();
    }
    x.restore();
    // RIGHT · TRADING card 480x300 at 1260,250, alpha .8: candles icon, title, «حسابك», 10 candles in corner triangles, live
    const ct = jn_cin(tv, K.trade);
    if (ct.u > 0) {
      x.save(); jn_piv(x, ex, 1500, 400); x.translate(0, (1 - ct.ui) * 24);
      const ta = 0.8 * ex.a;
      card(x, 1260, 250, 480, 300, { u: ct.u, a: cl(ct.ui * 1.25) * ta });
      if (ct.uc > 0) {
        x.save(); cardClip(x, 1260, 250, 480, 300, ct.u); x.globalAlpha = ta * cl(ct.uc * 1.3);
        sym(x, "candles", 1320, 310, 56, { u: pr(tv, K.trade + 0.12, K.trade + 0.62) });
        T(x, "حساب التداول", 1708, 322, { w: 500, size: jn_fit(x, "f2title", "حساب التخصيص", 500, 42, 325, 38) });
        T(x, "حسابك", 1708, 372, { w: 400, size: 34, color: GREY });
        const D = jn_SER2(), [lo, hi] = jn_range(D, 0, 14), s = (tv - K.live) / 0.6;
        let from = 0, newest = 9, gN = 1;
        if (s >= 0) { const k = Math.floor(s), lt = (s - k) * 0.6; from = k + e4(pr(lt, 0, 0.2)); newest = 10 + k; gN = pr(lt, 0, 0.22); }
        jn_frame(x, tv, 1292, 405, 416, 120, {
          data: D, n: 10, from, lo, hi, newest, t0: K.chart - 0.05, breathe: tv > K.chart + 0.5 ? 6 * Math.sin((tv - K.chart - 0.5) * 2 * Math.PI) : 0,
          grow: (i) => (i < 10 ? pr(tv, K.chart + i * 0.03, K.chart + 0.22 + i * 0.03) : i === newest ? gN : 1),
        });
        x.restore();
      }
      x.restore();
    }
    // the axi wordmark rises above the allocation card (h 52, x 370-470, y 170-222); one sheen on «شركة»
    const um = expo(pr(tv, K.mark, K.mark + 0.42));
    if (um > 0) {
      const img = await im("axi_part_white.png"), mh = 52, mw = (mh * LOGO.axiW) / LOGO.h, MX = 420 - mw / 2, MY = 170 + (1 - um) * 16;
      x.save(); jn_piv(x, ex, 420, 196); x.globalAlpha = ex.a * cl(um * 1.4);
      const us = pr(tv, K.sheen, K.sheen + 0.5);
      if (us > 0 && us < 1) withSheen(x, MX, MY, mw, mh, us, (c) => c.drawImage(img, MX, MY, mw, mh));
      else x.drawImage(img, MX, MY, mw, mh);
      x.restore();
    }
    // FUNDING POUR: 36 red ◢ (9 px) fall from under the wordmark (y 222) into the card top (y 250), 0.03 s stagger, in2
    // 0.35 s each, vanishing on contact
    if (tv >= K.pour) {
      x.save(); x.fillStyle = RED;
      for (let i = 0; i < 36; i++) {
        const k = pr(tv, K.pour + i * 0.03, K.pour + i * 0.03 + 0.35); if (k <= 0 || k >= 1) continue;
        const px = 420 + (hash(i, 7, 31) - 0.5) * 84 - 4.5, py = 222 + (250 - 9 - 222) * in2(k);
        x.globalAlpha = ex.a * (1 - e2(pr(k, 0.7, 1)));
        x.beginPath(); x.moveTo(px + 9, py); x.lineTo(px + 9, py + 9); x.lineTo(px, py + 9); x.closePath(); x.fill();
      }
      x.restore();
    }
  }

  // ---------------------------------------------------------------- G · «مبروك!» in the L2 corner slot (x 100-650, y 140-500)
  function jn_G(x, tv) {
    const K = jn_K.G;
    if (tv < K.word) return;
    const ex = jn_x(tv, K.o0, K.o1); if (ex.a <= 0.003) return;
    x.save(); x.beginPath(); x.rect(100, 140, 550, 360); x.clip(); // safety only: the burst radius keeps inside the slot
    jn_piv(x, ex, 440, 340); x.globalAlpha = ex.a;
    // burst: 16 brand particles (10 red ◢ 10 px, 6 white ▲ 12 px, alpha .6) radiating from behind the word to r 150
    const kb = pr(tv, K.burst, K.burst + 0.6);
    if (kb > 0 && kb < 1) {
      for (let i = 0; i < 16; i++) {
        const white = [1, 4, 6].includes(i % 8), an = (i / 16) * Math.PI * 2 + (hash(i, 3, 5) - 0.5) * 0.35;
        const r = 150 * (0.6 + 0.4 * hash(i, 4, 6)) * e4(kb), px = 430 + Math.cos(an) * r, py = 300 + Math.sin(an) * r;
        x.save(); x.translate(px, py); x.rotate((hash(i, 5, 7) < 0.5 ? -1 : 1) * (2 + 3 * hash(i, 8, 9)) * e2(kb) + an);
        x.globalAlpha = ex.a * 0.6 * (1 - e2(pr(kb, 0.3, 1))); x.fillStyle = white ? WHITE : RED; x.beginPath();
        if (white) { x.moveTo(0, -6); x.lineTo(6, 6); x.lineTo(-6, 6); } else { x.moveTo(5, -5); x.lineTo(5, 5); x.lineTo(-5, 5); }
        x.closePath(); x.fill(); x.restore();
      }
    }
    // «مبروك!» Alexandria 600 84, right-aligned at x 580, baseline 330 (16 px rise); the scene's one flag (h 29 = .35 em,
    // gap .5 em, top on the alef line: x 622-644, y 262-291) unfurls at its right
    const uw = expo(pr(tv, K.word, K.word + 0.32));
    T(x, "مبروك!", 580, 330 + (1 - uw) * 16, { w: 600, size: 84, a: cl(uw * 1.4) });
    flag(x, 622, 262, 29, { mirror: true, u: pr(tv, K.word + 0.05, K.word + 0.27) });
    // DARK stage pill 360x64 at 260,372 (#303133): a RED circle (d 50, centre 589,404) holding '01', then «المرحلة الأولى»
    const up = expo(pr(tv, K.pill, K.pill + 0.36));
    if (up > 0) {
      const PX = 260, PY = 372;
      x.save(); x.beginPath(); x.rect(620 - 362 * up, PY - 4, 366, 72); x.clip();
      pill(x, PX, PY, 360, 64, null, { kind: "dark", a: cl(up * 1.3) });
      x.restore();
      const uc = pr(tv, K.pill + 0.04, K.pill + 0.34), ul = expo(pr(tv, K.pill + 0.1, K.pill + 0.46));
      if (uc > 0) {
        x.save(); x.translate(589, 404); x.scale(back(uc, 1.4), back(uc, 1.4));
        x.fillStyle = RED; x.beginPath(); x.arc(0, 0, 25, 0, Math.PI * 2); x.fill();
        T(x, "01", 0, 8.7, { fam: LAT, w: 500, size: 24, align: "center", a: cl(uc * 2) });
        x.restore();
      }
      if (ul > 0) {
        x.save(); x.beginPath(); x.rect(552 - (552 - 270) * ul, 342, (552 - 270) * ul + 6, 124); x.clip(); // to baseline + 1.5 em
        T(x, "المرحلة الأولى", 552, 416, { w: 400, size: 34, a: cl(ul * 1.4) });
        x.restore();
      }
    }
    x.restore();
  }

  GROUPS.push({
    name: "join",
    floor(t, sh, S) {
      const s = S.shot; if (!s || !s.k_vcam) return;
      const tv = t - P, K = jn_K.D;
      if (tv < 14.88 || tv >= 18.5) return;
      fRipple(sh, t, v(K.rip));
      // steady red pool (R 1.2 m, .14) under the stool, a small boost on the landing; both leave with the exit
      const out = 1 - eio(pr(tv, K.o0, K.o1));
      const a = (0.14 * e2(pr(tv, K.pool, K.pool + 0.4)) + 0.08 * Math.sin(Math.PI * pr(tv, K.c1, K.c1 + 0.35))) * out;
      if (a > 0.003) sh.push(fPool(a, RED, 1.2));
    },
    async draw(x, t, S) {
      const tv = t - P;
      if (tv < 14.88 || tv >= 33.4) return;
      const s = S.shot || {}, vc = !!s.k_vcam, clip = s.clip;
      if (vc && tv < 18.5) jn_D(x, tv);
      else if (clip === "L5" && tv < 22.62) jn_E(x, tv);
      else if (clip === "L3" && tv < 27.0) await jn_F1(x, tv);
      else if (vc && tv >= 27.0 && tv < 31.92) await jn_F2(x, tv);
      else if (clip === "L2" && tv >= 31.92) jn_G(x, tv);
    },
  });

  // ================================================================== GROUP "stages" (prefix st_)
  // Beats (VO s, spec mg_final.json): H1 33.40-36.84 Seed pad + tag | H2 36.84-40.02 '$ 5,000' | I 40.02-44.70 the
  // staircase is built | J 44.70-48.00 stage 02 card | K 48.00-50.36 stage 03 card | L 50.36-56.30 staircase: Pro, Pro 500
  // | M 56.30-58.40 summit teaser | M2 58.40-60.30 the summit, then everything folds | N1 60.30-64.62 funding ladder.
  // The staircase (design system 14) is authored in EW screen px and drawn through VM x ewP, i.e. stored in plate space:
  // it rides the camera drift and stays welded to the floor pad (line widths stay in screen px). Floor light (pool, pad,
  // pulses) goes through floor(). Word hits are snapped to work/words_v4.json and the gaps of the final voice.
  const st_bump = (tv, t0, d) => { const u = pr(tv, t0, t0 + d); return u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0; };
  // exit envelope (inOutCubic alpha -> 0, y -10, scale .985; no frame drops more than ~15 %) and its transform about (cx, cy)
  function st_out(tv, t1, d = 0.3, up = 10) { const u = eio(pr(tv, t1, t1 + d)); return { a: 1 - u, dy: -up * u, sc: 1 - 0.015 * u }; }
  function st_xf(x, cx, cy, o) { x.translate(cx, cy + (o.dy || 0)); const s = o.sc ?? 1; x.scale(s, s); x.translate(-cx, -cy); }
  // metallic COUNTER in fixed FINAL slots: each digit (and comma) is centred on the slot its final glyph occupies, digits
  // right-aligned to the final string, so it never jitters while counting and nothing moves when it lands (the landed
  // frame is the static metal() layout). fin = final string, n = current value.
  function st_count(x, n, fin, X, Y, size, o = {}) {
    const w = o.w ?? 200, L = metalLayout(fin, size, w, false, 0), a = o.a ?? 1, fd = !!o.fade;
    const x0 = o.align === "right" ? X - L.width : o.align === "center" ? X - L.width / 2 : X;
    if (a <= 0.003) return L.width;
    const cur = fmtMoney(n);
    if (cur === fin) { metal(x, fin, x0, Y, size, { w, fade: fd, a, sheen: o.sheen }); return L.width; }
    const slots = L.glyphs.filter((g) => g.ch !== "$").map((g) => g.x + glyph(g.ch, g.gs, size, w, fd).m / 2);
    const body = cur.slice(1), d0 = L.glyphs[0], sd = glyph(d0.ch, d0.gs, size, w, fd);
    x.save(); x.globalAlpha *= a;
    x.drawImage(sd.c, x0 + d0.x - 2, Y - sd.base, sd.pw, sd.ph);
    for (let i = 1; i <= Math.min(body.length, slots.length); i++) {
      const sp = glyph(body[body.length - i], size, size, w, fd);
      x.drawImage(sp.c, x0 + slots[slots.length - i] - sp.m / 2 - 2, Y - sp.base, sp.pw, sp.ph);
    }
    x.restore();
    return L.width;
  }
  // which of my shots is on screen (by the shot itself, so nothing leaks into a neighbour's shot)
  function st_which(S) {
    const sh = S.shot || {}, c = sh.k_vcam;
    if (c) {
      const t0 = c.t0 ?? -1;
      if (Math.abs(t0 - 33.40) < 0.06) return "HI";
      if (Math.abs(t0 - 50.36) < 0.06) return "L";
      if (Math.abs(t0 - 58.40) < 0.06) return "M2";
      return null;
    }
    const v0 = (sh.f0 ?? -1e4) / 25 - P;
    if (sh.clip === "L1" && Math.abs(v0 - 44.70) < 0.08) return "J";
    if (sh.clip === "L5" && Math.abs(v0 - 48.00) < 0.08) return "K";
    if (sh.clip === "L2" && Math.abs(v0 - 56.30) < 0.08) return "M";
    if (sh.clip === "L5" && Math.abs(v0 - 60.30) < 0.08) return "N1";
    return null;
  }
  // polylines: length, point at arc length, partial stroke d0..d1
  function st_plen(p) { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; }
  function st_at(p, d) {
    for (let i = 1; i < p.length; i++) {
      const l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
      if (d <= l || i === p.length - 1) { const k = l ? cl(d / l) : 0; return [lerp(p[i - 1][0], p[i][0], k), lerp(p[i - 1][1], p[i][1], k)]; }
      d -= l;
    }
    return p[p.length - 1];
  }
  function st_poly(x, p, d0, d1) {
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
  // stage-card names as cached 2x sprites: under the drifting EW transform the text scale changes every frame, so live
  // text would re-rasterize its glyphs each frame; a cached sprite only scales (and stays crisp at 2x)
  const st_SPR = {};
  function st_name(x, s, X, Y, a) {
    if (a <= 0.003) return;
    let c = st_SPR[s];
    if (!c) {
      const w = Math.ceil(measure(x, s, 400, 26, LAT)) + 10;
      c = st_SPR[s] = U.mk(w * 2, 80); c.ww = w;
      c.x.scale(2, 2); T(c.x, s, 5, 30, { w: 400, size: 26, color: WHITE });
    }
    x.save(); x.globalAlpha *= a; x.drawImage(c, X - 5, Y - 30, c.ww, 40); x.restore();
  }
  // 'you are here' marker: 2 px white pole with a mirrored flag at its top (flies toward the climb, RTL)
  function st_marker(x, X, Yb, a, ph = 54, fh = 26, pw = 2) {
    if (a <= 0.003) return;
    x.save(); x.globalAlpha *= a;
    x.fillStyle = WHITE; x.fillRect(X - pw / 2, Yb - ph, pw, ph);
    flag(x, X - pw / 2 - 0.74 * fh, Yb - ph, fh, { mirror: true });
    x.restore();
  }

  // ---------------------------------------------------------------- FLOOR: base pool, stage-1 pad, pulses (plate px)
  const st_PAD = padPts();
  const st_PADLEN = st_plen(st_PAD.concat([st_PAD[0]]));
  const st_PADTRI = [[0.5, -0.55], [0.5, 0.42], [-0.08, -0.55], [-0.08, 0.42], [-0.65, -0.55], [-0.65, 0.42]]; // RTL blink order
  function st_floor(t, sh, S) {
    const tv = t - P, seg = st_which(S);
    if (seg !== "HI" && seg !== "L" && seg !== "M2") return;
    let pool = 0.18; // the base pool; H2 brightens it to .28 as '$ 5,000' lands, back to .18 with its exit
    if (seg === "HI") pool += 0.10 * e2(pr(tv, 38.62, 38.92)) * (1 - e2(pr(tv, 39.62, 39.92)));
    sh.push(fPool(pool));
    if (seg === "HI" && tv < 33.80) return;
    const rimU = seg === "HI" ? e2(pr(tv, 33.80, 34.25)) : 1, inner = seg === "HI" ? e2(pr(tv, 33.90, 34.25)) : 1;
    const off = seg === "M2" ? 1 - eio(pr(tv, 59.94, 60.16)) : 1; // M2: pad off with the fold
    if (off > 0.003) {
      sh.push({ type: "poly", pts: st_PAD, color: "#ffffff", a: 0.14 * inner * off });
      if (rimU >= 1) sh.push({ type: "line", pts: st_PAD, close: true, color: RED, a: 0.95 * off, lw: 0.04 * 525 }); // crisp RED = kit decal: reads #E4002E
      else if (rimU > 0) sh.push({ type: "line", pts: st_PAD, color: RED, a: 0.95, lw: 0.04 * 525, u: (rimU * st_PADLEN) / 20000 }); // kit dash is in px of 20000
    }
    if (seg === "HI" && tv > 33.98 && tv < 34.70) { // six ◢ marks inside the pad blink once, right to left
      const list = [], s = 0.16;
      st_PADTRI.forEach(([u0, v0], i) => {
        const a = 0.95 * st_bump(tv, 34.00 + Math.floor(i / 2) * 0.06 + (i % 2) * 0.03, 0.40); if (a <= 0.01) return;
        const p1 = floorP(u0, v0), p2 = floorP(u0 + s, v0), p3 = floorP(u0 + s, v0 + s);
        list.push([p1[0], p1[1], p2[0], p2[1], p3[0], p3[1], a]);
      });
      if (list.length) sh.push({ type: "tris", list, color: RED });
    }
    // STAGE PULSES from the pad (crisp floorP rings r 0.3 -> 2.1 m, 0.8 s; at 2.1 m the front edge stays above y ~960, clear of
    // the subtitle band) and the big summit pulse
    if (seg === "HI") fRipple(sh, t, v(42.55), { R: 2.1, d: 0.8 });
    if (seg === "L") { fRipple(sh, t, v(52.26), { R: 2.1, d: 0.8 }); fRipple(sh, t, v(55.05), { R: 2.1, d: 0.8 }); }
    if (seg === "M2") st_bigPulse(sh, tv, 59.45);
  }
  // the big summit pulse (M2): crisp floor ring 0.3 -> 4 m in 0.6 s (quartOut), alpha .9 -> 0 at 4 m, and a white ring
  // 0.1 s behind (.4); both gone by VO 60.15. The ring's front arc nearer than v -2.1 m (screen y > ~950, the subtitle
  // band) is cut away, its last 0.35 m at 45 % alpha so the cut reads as a fade.
  function st_bigPulse(sh, tv, t0) {
    for (const [dt, col, a0] of [[0, RED, 0.9], [0.1, "#ffffff", 0.4]]) {
      const k = pr(tv, t0 + dt, t0 + dt + 0.6); if (k <= 0 || k >= 1) continue;
      st_ringCut(sh, lerp(0.3, 4, e4(k)), 0.08, -2.1, col, a0 * (1 - k));
    }
  }
  function st_ringCut(sh, R, w, vmin, col, a) {
    const ro = R + w / 2, ri = Math.max(0.01, R - w / 2), vf = vmin + 0.35;
    if (ro <= -vf) { sh.push({ type: "annulus", R, w, color: col, a }); return; }
    const band = (th0, th1, al) => { // floorP band between angles th0..th1 (counterclockwise through the back, pi/2 = far)
      const pts = [], n = Math.max(4, Math.ceil(((th1 - th0) / (2 * Math.PI)) * 64));
      for (let i = 0; i <= n; i++) { const th = lerp(th0, th1, i / n); pts.push(floorP(Math.cos(th) * ro, Math.sin(th) * ro)); }
      for (let i = n; i >= 0; i--) { const th = lerp(th0, th1, i / n); pts.push(floorP(Math.cos(th) * ri, Math.sin(th) * ri)); }
      sh.push({ type: "poly", pts, color: col, a: al });
    };
    const thf = Math.asin(Math.max(-1, vf / ro)), thm = Math.asin(Math.max(-1, vmin / ro));
    band(thf, Math.PI - thf, a);
    band(thm, thf, 0.45 * a); band(Math.PI - thf, Math.PI - thm, 0.45 * a);
  }

  // ---------------------------------------------------------------- H1: the SEED tag 640x200 -> chip 280x60 (screen px, WIDE)
  function st_seed(x, tv) {
    if (tv < 34.00 || tv > 39.93) return;
    const ui = pr(tv, 34.00, 34.45), ei = expo(ui), uc = expo(pr(tv, 36.52, 36.90)), ox = st_out(tv, 39.62, 0.30);
    const X = lerp(626, 806, uc), Y = lerp(190, 74, uc) + (1 - ei) * 20, w = lerp(640, 280, uc), h = lerp(200, 60, uc);
    x.save();
    st_xf(x, 946, 104, ox); x.globalAlpha *= ox.a;
    if (ui < 1) { x.beginPath(); x.rect(X + w + 10 - (w + 40) * ei, Y - 40, w + 80, h + 80); x.clip(); } // RTL clip reveal
    x.globalAlpha *= cl(ei * 1.25);
    tag(x, X, Y, w, h, { rim: 0.95 * st_bump(tv, 36.05, 0.45) }); // one red flash of the rim on «Axi Select»
    const dyE = (1 - ei) * 20;
    // label + sprout fade while the plate compresses (they shrink toward the box centre)
    const bigA = 1 - cl(uc / 0.42);
    if (bigA > 0.003) {
      const k = h / 200;
      x.save(); x.globalAlpha *= bigA;
      x.translate(X + w / 2, Y + h / 2 - dyE); x.scale(k, k); x.translate(-946, -290 + dyE);
      const l1 = ent(tv, 34.08, 1e9, { rise: 16 });
      if (l1) T(x, "المرحلة الأولى", 1130, 252 + l1.dy, { w: 300, size: 40, color: GREY, a: l1.a });
      // SPROUT 90 px at (1195, 259): the seed drops, then the stem grows, the leaves open, red leaf last
      const us = pr(tv, 34.25, 34.40);
      if (us > 0 && tv < 34.52) {
        x.save(); x.translate(1195, 259); x.scale(0.9, 0.9);
        x.globalAlpha *= cl(us * 4) * (1 - pr(tv, 34.40, 34.50));
        x.fillStyle = WHITE; x.beginPath(); x.ellipse(0, lerp(-46, 33, in2(us)), 3.8, 4.6, 0, 0, Math.PI * 2); x.fill();
        x.restore();
      }
      const g = pr(tv, 34.36, 34.85);
      if (g > 0) sym(x, "sprout", 1195, 259, 90, { k: { grow: g } });
      x.restore();
    }
    // '01' (metallic -> RED Inter 500 30) and 'Seed' (Inter 300 96 -> 400 34) morph into the chip layout
    const e01 = ent(tv, 34.22, 1e9, { rise: 16 }), eS = ent(tv, 34.14, 1e9, { rise: 16 });
    if (e01) {
      const lx = lerp(690, 885.7, uc), ly = lerp(350 + e01.dy + dyE, 116, uc), sz = lerp(140, 30, uc);
      const am = 1 - pr(uc, 0.25, 0.7), ar = pr(uc, 0.35, 0.85);
      if (am > 0.003) { x.save(); x.translate(lx, ly); x.scale(sz / 140, sz / 140); metal(x, "01", 0, 0, 140, { w: 200, a: e01.a * am }); x.restore(); }
      if (ar > 0.003) T(x, "01", lx, ly, { w: Math.round(lerp(200, 500, uc)), size: sz, color: RED, a: ar });
    }
    if (eS) {
      const rx = lerp(1130, 1006.4, uc), ly = lerp(352 + eS.dy + dyE, 116, uc), sz = lerp(96, 34, uc), wg = Math.round(lerp(300, 400, uc));
      const shU = pr(tv, 36.05, 36.50);
      if (shU > 0 && shU < 1) {
        const ww = measure(x, "Seed", wg, sz, LAT);
        withSheen(x, rx - ww - 8, ly - sz * 0.95, ww + 16, sz * 1.2, shU, (c) => T(c, "Seed", rx, ly, { w: wg, size: sz, align: "right", a: eS.a }));
      } else T(x, "Seed", rx, ly, { w: wg, size: sz, color: WHITE, align: "right", a: eS.a });
    }
    x.restore();
  }

  // ---------------------------------------------------------------- H2: two-tone headline + the hero '$ 5,000' (screen px, WIDE)
  function st_five(x, tv) {
    if (tv < 36.95 || tv > 39.93) return;
    const ox = st_out(tv, 39.62, 0.30);
    const words = [["لديك", "g"], ["تمويل", "w"], ["بقيمة", "g"]];
    let Wd = 0; words.forEach(([s], i) => (Wd += measure(x, s, 300, 52, AR) + (i ? 52 * 0.28 : 0)));
    x.save(); st_xf(x, 946, 182, ox);
    headline(x, words, 946 + Wd / 2, 200, 52, tv, 36.95, { a: ox.a }); // centred; no flag (not one of the spec's flag scenes)
    x.restore();
    if (tv < 37.65) return;
    // counts 0 -> 5,000 (quartOut) in the final glyph slots, centred on x 946, and lands on the spoken «5,000» (onset
    // 38.62) without any jump
    const X0 = 946 - metalWidth("$5,000", 230, 200) / 2, ui = expo(pr(tv, 37.65, 38.10));
    x.save(); st_xf(x, 946, 370, ox);
    st_count(x, 5000 * e4(pr(tv, 37.65, 38.62)), "$5,000", X0, 455 + (1 - ui) * 16, 230, { w: 200, fade: true, a: cl(ui * 1.25) * ox.a, sheen: pr(tv, 38.80, 39.30) });
    chev3(x, X0 - 28 - 18, 383, tv, 37.75, { a: ox.a });
    x.restore();
  }

  // ---------------------------------------------------------------- THE STAIRCASE (I, L, M2): EW screen px through VM x ewP
  // Landings 240 wide (spec 260) and cards 230 (spec 250): the set's right end (ground line, S1 card) sits at EW x 1780,
  // which keeps it inside screen x 1825 at the widest drift (M2, 1.052 x about A); the S3/S4 riser stays at x 1060.
  const st_LX = [1540, 1300, 1060, 820, 580, 340], st_LY = [742, 642, 542, 442, 342, 242], st_CW = 230, st_GX = 1780;
  // main line from the pad's right edge floorP(1,0): ground to the first riser, then the stair up to S6's open end
  const st_MAIN = [[1060, 742], [1540, 742], [1540, 642], [1300, 642], [1300, 542], [1060, 542], [1060, 442], [820, 442], [820, 342], [580, 342], [580, 242], [340, 242]];
  const st_ML = st_plen(st_MAIN); // 2180 (ground part 0..480, stair 480..2180)
  const st_LD0 = (k) => 480 + 100 * k + 240 * (k - 1); // arc length where landing k (1..5) starts (its right end)
  function st_ewM() { // EW screen px -> current screen px (= VM x ewP as one affine map)
    const k = 1 / EW_S, ex = AX - AX * k, ey = AY - (AY + EW_DY) * k;
    return [VM[0] * k, 0, 0, VM[3] * k, VM[0] * ex + VM[4], VM[3] * ey + VM[5]];
  }
  function st_symK(k, u, lt) {
    switch (STAGES[k].sym) {
      case "sprout": return { grow: u };
      case "dome": return { grow: pr(u, 0.45, 1) };
      case "chev": return { ignite: u, t: lt };
      case "summit": return { flagU: pr(u, 0.55, 1) };
      default: return {};
    }
  }
  // card state k (0..5) at VO tv: pop (unfold), lit, done, pre (pre-highlight), flash (red outline), symU (draw-on)
  function st_cs(k, tv, seg) {
    const s = { pop: 1, lit: 0, done: 0, pre: 0, flash: 0, symU: 1, lt: 0 };
    if (seg === "I") {
      s.pop = expo(pr(tv, 41.45 + 0.08 * k, 41.80 + 0.08 * k));
      s.flash = st_bump(tv, 41.80 + 0.08 * k, 0.16); // the six outlines flash red in sequence on «ستّ مراحل»
      if (k === 0) { s.lit = e2(pr(tv, 42.55, 42.90)); s.symU = pr(tv, 42.58, 43.08); s.flash = Math.max(s.flash, st_bump(tv, 44.15, 0.21)); }
    } else if (seg === "L") {
      if (k <= 1) { s.lit = 1; s.done = 1; }
      if (k === 2) { s.lit = 1; s.done = pr(tv, 52.10, 52.40); s.lt = tv - 50.36; }
      if (k === 3) { s.pre = e2(pr(tv, 51.30, 51.55)); s.lit = e2(pr(tv, 52.26, 52.61)); s.symU = pr(tv, 52.28, 52.78); s.done = pr(tv, 54.90, 55.20); }
      if (k === 4) { s.pre = e2(pr(tv, 54.16, 54.41)); s.lit = e2(pr(tv, 55.05, 55.40)); s.symU = pr(tv, 55.07, 55.50); }
    } else if (seg === "M2") {
      if (k <= 3) { s.lit = 1; s.done = 1; }
      if (k === 4) { s.lit = 1; s.done = pr(tv, 59.05, 59.35); }
      if (k === 5) { s.pre = e2(pr(tv, 58.80, 59.05)); s.lit = e2(pr(tv, 59.22, 59.57)); s.symU = pr(tv, 59.24, 59.74); }
      if (tv >= st_cometPass[k]) s.flash = Math.max(s.flash, Math.exp(-(tv - st_cometPass[k]) / 0.12)); // rim flashes as the comet passes
      const f0 = 59.94 + (5 - k) * 0.008;
      s.pop = 1 - eio(pr(tv, f0, f0 + 0.2)); // fold into the landings (scaleY -> 0 toward the line), S6 first, gone by 60.18
    }
    return s;
  }
  // stage card k: TAG 230x88 at (x_left+5, y_k-96). DIM: outline white .25, symbol .35 (DIM grey), name .55, no amount.
  // LIT: PANEL fill, RED 1.5 px rim, symbol white + red, name white, amount. DONE: fill .7, rim white .25, red cut + tick.
  function st_card(x, k, s, lw) {
    if (s.pop <= 0.002) return;
    const X = st_LX[k] + 5, Y = st_LY[k] - 96, w = st_CW, h = 88, ST = STAGES[k], ly = st_LY[k];
    x.save();
    if (s.pop < 1) { x.translate(0, ly); x.scale(1, Math.max(0.002, s.pop)); x.translate(0, -ly); x.globalAlpha *= cl(s.pop * 1.25); }
    tagPath(x, X, Y, w, h);
    const fillA = 0.96 * s.lit * (1 - 0.27 * s.done);
    if (fillA > 0.003) { x.fillStyle = panelFill(x, Y, h, +fillA.toFixed(3)); x.fill(); }
    x.lineWidth = 1.5 * lw;
    const whiteA = (1 - s.lit) * lerp(0.25, 0.6, s.pre) + s.lit * s.done * 0.25, redA = s.lit * (1 - s.done);
    if (whiteA > 0.003) { x.strokeStyle = `rgba(255,255,255,${whiteA.toFixed(3)})`; x.stroke(); }
    if (redA > 0.003) { x.strokeStyle = rgba(RED, redA.toFixed(3)); x.stroke(); }
    if (s.flash > 0.003) { x.lineWidth = (1.5 + 1.5 * s.flash) * lw; x.strokeStyle = rgba(RED, cl(s.flash).toFixed(3)); x.stroke(); }
    if (s.done > 0) { // the TAG's top-left cut fills RED with a white tick
      const q = 0.355 * h, kk = e3(pr(s.done, 0.2, 1));
      x.save(); x.globalAlpha *= e3(s.done);
      x.fillStyle = RED; x.beginPath(); x.moveTo(X, Y); x.lineTo(X + q, Y); x.lineTo(X, Y + 0.43 * h); x.closePath(); x.fill();
      x.strokeStyle = WHITE; x.lineWidth = 2 * lw; x.lineCap = "round"; x.lineJoin = "round";
      x.beginPath(); x.moveTo(X + q * 0.16, Y + q * 0.42);
      if (kk > 0) x.lineTo(X + q * 0.16 + q * 0.14 * cl(kk * 2), Y + q * 0.42 + q * 0.14 * cl(kk * 2));
      if (kk > 0.5) x.lineTo(X + q * 0.3 + q * 0.26 * cl(kk * 2 - 1), Y + q * 0.56 - q * 0.36 * cl(kk * 2 - 1));
      x.stroke(); x.restore();
    }
    const cx = X + 38, cy = Y + 44; // symbol 40 px at (x+18, y+24)
    if (s.lit < 1) sym(x, ST.sym, cx, cy, 40, { dim: true, a: 1 - s.lit, k: st_symK(k, 1, 0) });
    if (s.lit > 0) sym(x, ST.sym, cx, cy, 40, { u: s.symU, a: s.lit, k: st_symK(k, s.symU, s.done > 0 ? 0.15 : s.lt) });
    st_name(x, ST.en, X + 68, Y + 40, lerp(0.55, 1, s.lit));
    if (s.lit > 0.3) metal(x, fmtMoney(ST.amt), X + 68, Y + 70, 24, { w: 300, a: e2(pr(s.lit, 0.3, 1)) });
    x.restore();
  }
  const st_MK = (k) => [st_LX[k] + 213, st_LY[k] - 96]; // marker foot on card k's top edge (x+208, 22 px from its right end)
  const st_MKP = (k) => { const [x0, y0] = st_MK(k), xr = st_LX[k]; return [[x0, y0], [xr, y0], [xr, y0 - 100], [xr - 27, y0 - 100]]; }; // k -> k+1
  // marker: drops 6 px onto card k0 at `drop`, slides [t, d] along the stair offset to the card tops, fades at out
  function st_mkAt(tv, M) {
    if (tv < M.drop) return null;
    let k = M.k0, pos = st_MK(k);
    for (const [ts, d] of M.slides) {
      if (tv < ts) break;
      const u = expo(pr(tv, ts, ts + d)), P4 = st_MKP(k);
      if (u >= 1) { k += 1; pos = st_MK(k); continue; }
      pos = st_at(P4, u * st_plen(P4)); break;
    }
    const ud = expo(pr(tv, M.drop, M.drop + 0.32));
    return { x: pos[0], y: pos[1] - 6 * (1 - ud), a: cl(ud * 1.6) * (1 - eio(pr(tv, M.out, M.out + M.od))) };
  }
  const st_MKS = {
    I: { drop: 42.55, k0: 0, slides: [], out: 44.30, od: 0.28 },
    L: { drop: 50.76, k0: 2, slides: [[52.10, 0.45], [54.90, 0.45]], out: 55.92, od: 0.26 },
    M2: { drop: 58.80, k0: 4, slides: [[59.05, 0.40]], out: 59.94, od: 0.17 },
  };
  // comet (M2): runs the whole line from the pad to S6 in 0.35 s
  const st_CT = [59.45, 0.35];
  const st_cometD = (tv) => st_ML * eio(pr(tv, st_CT[0], st_CT[0] + st_CT[1]));
  const st_cometPass = (() => { // VO time the comet passes each card (S1 at the first riser, Sk mid-landing)
    const out = [], dk = [480, ...[1, 2, 3, 4, 5].map((k) => st_LD0(k) + 120)];
    for (const d of dk) { let a = 0, b = 1; for (let i = 0; i < 30; i++) { const m = (a + b) / 2; if (st_ML * eio(m) < d) a = m; else b = m; } out.push(st_CT[0] + st_CT[1] * b); }
    return out;
  })();
  function st_stair(x, tv, seg) {
    if (!VM) return;
    if (seg === "I" && tv < 41.20) return;
    let ground = st_GX, stair = 1700, retract = 0;
    if (seg === "I") { ground = 1060 + 720 * expo(pr(tv, 41.20, 41.50)); stair = 1700 * e4(pr(tv, 41.35, 41.95)); }
    if (seg === "M2") retract = eio(pr(tv, 59.96, 60.16)); // the line retracts toward the pad
    const Lv = st_ML * (1 - retract), lw = EW_S / VM[0]; // lw keeps line widths in screen px under the drift
    x.save();
    U.setM(x, st_ewM());
    // soft white fill (alpha .05 -> 0 over 50 px) under each drawn landing
    for (let k = 0; k < 6; k++) {
      const f = k === 0 ? cl((Math.min(ground, 1540 + 240 * (1 - retract)) - 1540) / 240) : cl((Math.min(480 + stair, Lv) - st_LD0(k)) / 240);
      if (f <= 0) continue;
      const x1 = st_LX[k] + 240, x0 = k === 0 ? 1540 : x1 - 240 * f, xe = k === 0 ? 1540 + 240 * f : x1, y = st_LY[k];
      const g = x.createLinearGradient(0, y, 0, y + 50); g.addColorStop(0, "rgba(255,255,255,0.05)"); g.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g; x.fillRect(x0, y + 1.5 * lw, xe - x0, 50);
    }
    // the line: 3 px white .7 (ground line from the pad's right edge, then the stair)
    x.strokeStyle = "rgba(255,255,255,0.7)"; x.lineWidth = 3 * lw; x.lineJoin = "miter"; x.lineCap = "butt";
    if (seg === "I") { st_poly(x, [[1060, 742], [st_GX, 742]], 0, ground - 1060); st_poly(x, st_MAIN, 480, 480 + stair); }
    else { st_poly(x, st_MAIN, 0, Lv); if (Lv > 480) st_poly(x, [[1540, 742], [st_GX, 742]], 0, 240 * (1 - retract)); }
    for (let k = 0; k < 6; k++) st_card(x, k, st_cs(k, tv, seg), lw);
    const m = st_mkAt(tv, st_MKS[seg]);
    if (m) st_marker(x, m.x, m.y, m.a, 54, 26, 2 * lw);
    if (seg === "M2" && tv >= st_CT[0] && tv < st_CT[0] + st_CT[1] + 0.08) { // red comet: head r 8, glow r 30, 6-dot tail
      const d = st_cometD(tv), fa = 1 - pr(tv, st_CT[0] + st_CT[1], st_CT[0] + st_CT[1] + 0.08), [hx, hy] = st_at(st_MAIN, d);
      glow(x, hx, hy, 30, RED, 0.9 * fa);
      x.fillStyle = RED;
      for (let i = 6; i >= 1; i--) {
        const dd = d - i * 26; if (dd < 0) continue;
        const [px, py] = st_at(st_MAIN, dd);
        x.globalAlpha = fa * (1 - i / 7.5); x.beginPath(); x.arc(px, py, 8 * (1 - i / 8), 0, Math.PI * 2); x.fill();
      }
      x.globalAlpha = fa; x.beginPath(); x.arc(hx, hy, 8, 0, Math.PI * 2); x.fill();
      x.fillStyle = WHITE; x.beginPath(); x.arc(hx, hy, 3, 0, Math.PI * 2); x.fill();
    }
    x.restore();
  }

  // ---------------------------------------------------------------- READOUTS (screen px, right-aligned at x 1840, in x 1240-1840, y 70-400)
  // R: label (A300 36 grey, baseline 130), en (I300 52 white, 196), kick «تمويل حتى» (A300 34 grey, 250), numeral (I200 96
  // metallic, baseline `base`; counter cnt or static), chev (▲▲▲ left of the numeral); tl/tn entries, t1/d1 exit (lift + fade)
  function st_readout(x, tv, R) {
    if (tv < R.tl || tv > R.t1 + R.d1) return;
    const uo = eio(pr(tv, R.t1, R.t1 + R.d1)), oa = 1 - uo, ody = -(R.up ?? 10) * uo;
    const ln = (t0) => { if (tv < t0) return null; const ui = expo(pr(tv, t0, t0 + 0.45)); return { a: cl(ui * 1.25) * oa, dy: (1 - ui) * 20 + ody }; };
    const A = ln(R.tl);
    if (A) T(x, R.label, 1840, 130 + A.dy, { w: 300, size: 36, color: GREY, a: A.a });
    if (R.tn == null) return;
    const B = ln(R.tn);
    if (B) {
      const sh = R.sheen ? pr(tv, R.sheen[0], R.sheen[1]) : 0;
      if (sh > 0 && sh < 1) {
        const wn = measure(x, R.en, 300, 52, LAT);
        withSheen(x, 1840 - wn - 8, 196 + B.dy - 50, wn + 16, 66, sh, (c) => T(c, R.en, 1840, 196 + B.dy, { w: 300, size: 52, align: "right", a: B.a }));
      } else T(x, R.en, 1840, 196 + B.dy, { w: 300, size: 52, color: WHITE, align: "right", a: B.a });
    }
    if (R.n == null) return;
    if (R.kick) { const C = ln(R.tn + 0.05); if (C) T(x, "تمويل حتى", 1840, 250 + C.dy, { w: 300, size: 34, color: GREY, a: C.a }); }
    const D = ln(R.tn + (R.kick ? 0.1 : 0.06));
    if (D) {
      const wN = st_count(x, R.n * (R.cnt ? e4(pr(tv, R.cnt[0], R.cnt[1])) : 1), fmtMoney(R.n), 1840, R.base + D.dy, 96, { w: 200, align: "right", a: D.a });
      if (R.chev != null) chev3(x, 1840 - wN - 24 - 18, R.base - 54 + D.dy, tv, R.chev, { a: D.a }); // ▲▲▲ in the numeral's lower half
    }
  }
  function st_readI(x, tv) {
    if (tv >= 41.80 && tv < 42.62) { // '6' «مراحل» on «ستّ مراحل»; swaps out (up 24 px, eio) and is gone when the new lines start
      const ui = expo(pr(tv, 41.80, 42.25)), uo = eio(pr(tv, 42.40, 42.62));
      const a = cl(ui * 1.25) * (1 - uo), dy = (1 - ui) * 20 - 24 * uo;
      const w6 = metal(x, "6", 1840, 260 + dy, 200, { w: 200, fade: true, align: "right", a });
      T(x, "مراحل", 1840 - w6 - 32, 260 + dy, { w: 300, size: 60, color: WHITE, a });
    }
    st_readout(x, tv, { label: "المرحلة الأولى", en: "Seed", n: 5000, tl: 42.62, tn: 42.68, base: 300, t1: 44.30, d1: 0.28, sheen: [44.15, 44.45] });
  }
  function st_readL(x, tv) {
    st_readout(x, tv, { label: "المرحلة الرابعة", en: "Pro", n: 200000, tl: 51.30, tn: 52.26, cnt: [52.32, 52.92], kick: true, base: 350, t1: 53.75, d1: 0.30, up: 24 });
    st_readout(x, tv, { label: "المرحلة الخامسة", en: "Pro 500", n: 500000, tl: 54.16, tn: 55.05, cnt: [55.12, 55.62], kick: true, chev: 55.20, base: 350, t1: 55.92, d1: 0.26 });
  }
  function st_readM2(x, tv) {
    st_readout(x, tv, { label: "المرحلة الأخيرة", en: "Pro M", tl: 58.80, tn: 59.22, t1: 59.92, d1: 0.24 });
  }

  // ---------------------------------------------------------------- J / K: stage hero CARDs (screen px)
  const st_JC = {
    X: 1250, Y: 280, w: 560, h: 400, t0: 45.25, exit: 47.62, label: "المرحلة الثانية", lx: 1770, idx: "02", ix: 1282,
    en: "Incubation", nT: 46.88, nD: 0.34, ns: 72, ux: 1770, amt: 20000, as: 52, cnt: [47.10, 47.50],
    mini: { x0: 1282, from: 1, to: 2, hop: 46.10 },
  };
  const st_KC = {
    X: 100, Y: 280, w: 470, h: 400, t0: 48.40, exit: 50.00, label: "المرحلة الثالثة", lx: 530, idx: "03", ix: 132,
    en: "Acceleration", nT: 49.30, nD: 0.32, ns: 58, ux: 530, amt: 100000, as: 44, cnt: [49.50, 49.95],
    mini: { x0: 132, from: 2, to: 3, hop: 48.95 },
  };
  // mini stair at x0..x0+150, y 418-454: six steps 25x6 climbing to the left (step 1 at the right), each one step height
  // above the last, white .4, done steps white; a 22 px pole with a mirrored flag h 16 stands on the current step and hops
  function st_mini(x, tv, M, e) {
    if (!e) return;
    const sp = (i) => [M.x0 + 150 - 25 * i, 448 - 6 * (i - 1)];
    const u = e3(pr(tv, M.hop, M.hop + 0.28));
    x.save(); x.globalAlpha *= e.a; x.translate(0, e.dy);
    for (let i = 1; i <= 6; i++) {
      const [sx, sy] = sp(i), on = i <= M.from || (i === M.to && u >= 0.85);
      x.fillStyle = on ? WHITE : "rgba(255,255,255,0.4)"; x.fillRect(sx, sy, 25, 6);
    }
    const [ax, ay] = sp(M.from), [bx, by] = sp(M.to);
    st_marker(x, lerp(ax, bx, u) + 12.5, lerp(ay, by, u) - 12 * Math.sin(Math.PI * u), 1, 22, 16, 1.5);
    x.restore();
  }
  function st_hero(x, tv, C) {
    if (tv < C.t0 || tv > C.exit + 0.28) return;
    const u = pr(tv, C.t0, C.t0 + 0.5), ei = expo(u), ox = st_out(tv, C.exit, 0.28), c0 = C.t0 + 0.12;
    x.save();
    st_xf(x, C.X + C.w / 2, C.Y + C.h / 2, ox);
    x.globalAlpha *= cl(ei * 1.25) * ox.a;
    x.translate(0, (1 - ei) * 24);
    if (u < 1) { x.beginPath(); x.rect(C.X + C.w + 2 - C.w * ei, C.Y - 70, C.w * ei + 72, C.h + 140); x.clip(); } // grows from the right edge
    card(x, C.X, C.Y, C.w, C.h, { c: 48 });
    const e1 = ent(tv, c0, 1e9, { rise: 16 });
    if (e1) T(x, C.label, C.lx, 344 + e1.dy, { w: 300, size: 40, color: GREY, a: e1.a });
    const e2_ = ent(tv, c0 + 0.06, 1e9, { rise: 16 });
    if (e2_) metal(x, C.idx, C.ix, 400 + e2_.dy, 110, { w: 200, a: e2_.a });
    st_mini(x, tv, C.mini, ent(tv, c0 + 0.12, 1e9, { rise: 10 }));
    if (C.idx === "02") { // DOME 100 px at (1710, 422): base and dome draw, then the sapling grows, red top leaf last
      const ud = pr(tv, 45.70, 46.05);
      if (ud > 0) sym(x, "dome", 1710, 422, 100, { u: ud, k: { grow: pr(tv, 46.00, 46.40) } });
    } else { // CHEVRONS 96 px box at (472, 416): ignite bottom to top (back 1.4), then a fast wave + speed dashes
      const ig = pr(tv, 48.75, 49.00);
      if (ig > 0) sym(x, "chev", 472, 416, 96, { k: { ignite: ig, t: tv - 48.75 } });
    }
    const un = e4(pr(tv, C.nT, C.nT + C.nD)); // the stage name mask-reveals left to right (Latin)
    if (un > 0) {
      const wn = measure(x, C.en, 300, C.ns, LAT);
      x.save(); x.beginPath(); x.rect(C.ix - 6, 545 - C.ns * 1.05, (wn + 14) * un, C.ns * 1.4); x.clip();
      T(x, C.en, C.ix, 545, { w: 300, size: C.ns, color: WHITE }); x.restore();
    }
    const e3_ = ent(tv, C.cnt[0] - 0.06, 1e9, { rise: 12 });
    if (e3_) {
      T(x, "تمويل حتى", C.ux, 615 + e3_.dy, { w: 300, size: 34, color: GREY, a: e3_.a });
      st_count(x, C.amt * e4(pr(tv, C.cnt[0], C.cnt[1])), fmtMoney(C.amt), C.ix, 615 + e3_.dy, C.as, { w: 300, a: e3_.a });
    }
    x.restore();
  }

  // ---------------------------------------------------------------- M: SUMMIT teaser in the L2 corner slot (x 100-650, y 140-500)
  function st_summit(x, cx, cy, size, u, fU, settle) {
    if (u <= 0) return;
    const k = size / 100, M = [[-48, 40], [-20, -2], [-8, 10], [12, -28], [48, 40]], Lm = st_plen(M), d = (Lm + 22) * e2(u);
    x.save(); x.translate(cx, cy); x.scale(k, k);
    x.strokeStyle = WHITE; x.lineWidth = 5 / k; x.lineCap = "round"; x.lineJoin = "round";
    st_poly(x, M, 0, Math.min(d, Lm));
    if (d > Lm) st_poly(x, [[12, -28], [12, -50]], 0, d - Lm);
    if (fU > 0) { // the brand flag mark h 18 (measured polygon), climbing the pole (e4), then a 4 px settle
      const fh = 18, fw = 0.74 * fh, top = lerp(-28, -50, e4(fU)) + (4 / k) * settle;
      x.globalAlpha *= cl(fU * 4); x.fillStyle = RED;
      x.beginPath(); x.moveTo(12, top); x.lineTo(12 + fw, top); x.lineTo(12 + fw, top + 0.36 * fh); x.lineTo(12 + 0.15 * fw, top + fh); x.lineTo(12, top + fh); x.closePath(); x.fill();
    }
    x.restore();
  }
  function st_teaser(x, tv) {
    if (tv < 56.70 || tv > 58.32) return;
    const ox = st_out(tv, 58.02, 0.30);
    x.save(); st_xf(x, 375, 340, ox); x.globalAlpha *= ox.a;
    st_summit(x, 200, 337, 160, pr(tv, 56.70, 57.10), pr(tv, 57.10, 57.50), st_bump(tv, 57.50, 0.16));
    const ur = e4(pr(tv, 56.72, 57.10)); // «المرحلة الأخيرة» reveals right to left
    if (ur > 0) {
      x.save(); x.beginPath(); x.rect(638 - 333 * ur, 226, 333 * ur, 114); x.clip(); // to baseline + 0.83 em (final-ي dots)
      T(x, "المرحلة الأخيرة", 630, 300, { w: 500, size: 48, color: WHITE }); x.restore();
    }
    const e = ent(tv, 57.10, 1e9, { rise: 20 });
    if (e) metal(x, "06", 630, 430 + e.dy, 110, { w: 200, align: "right", a: e.a, sheen: pr(tv, 57.55, 58.00) });
    x.restore();
  }

  // ---------------------------------------------------------------- N1: funding ladder (right) + Axi funds you (left), L5
  function st_pour(x, tv) { // 30 red ◢ marks (9 px) fall from the wordmark into the vault
    if (tv < 62.70 || tv > 63.42) return;
    x.save(); x.fillStyle = RED;
    for (let i = 0; i < 30; i++) {
      const t0 = 62.70 + i * 0.0135, u = pr(tv, t0, t0 + 0.30); if (u <= 0 || u >= 1) continue;
      const x0 = 276 + 98 * hash(i, 5, 1), px = lerp(x0, 325 + (x0 - 325) * 0.22, e2(u)), py = lerp(330, 446, in2(u)), s = 9;
      x.globalAlpha = cl(u * 6) * (1 - pr(u, 0.7, 1));
      x.beginPath(); x.moveTo(px + s / 2, py - s / 2); x.lineTo(px + s / 2, py + s / 2); x.lineTo(px - s / 2, py + s / 2); x.closePath(); x.fill();
    }
    x.restore();
  }
  async function st_ladder(x, tv) {
    if (tv < 60.75 || tv > 64.52) return;
    const ox = st_out(tv, 64.18, 0.34);
    // RIGHT: the scene's headline with its flag (h 18), then six TAG rows (Seed at the bottom, 24 px rise, 0.09 s stagger)
    x.save(); st_xf(x, 1595, 520, ox); x.globalAlpha *= ox.a;
    headline(x, [["سقف", "w"], ["التمويل", "w"], ["لكل", "w"], ["مرحلة", "w"]], 1800, 322, 40, tv, 60.75, { w: 400, flag: true });
    for (let k = 0; k < 6; k++) {
      const er = ent(tv, 60.95 + 0.09 * k, 1e9, { rise: 24 }); if (!er) continue;
      const ST = STAGES[k], Y = 676 - 64 * k + er.dy;
      tag(x, 1360, Y, 470, 54, { a: er.a, rim: k === 5 ? 0.95 * e2(pr(tv, 61.45, 61.75)) : 0 });
      sym(x, ST.sym, 1788, Y + 27, 32, { a: er.a, k: { grow: 1, ignite: 1, flagU: 1, t: tv - 61.4 } });
      T(x, ST.en, 1756, Y + 38, { w: 300, size: 30, color: WHITE, align: "right", a: er.a });
      metal(x, fmtMoney(ST.amt), 1392, Y + 38, 30, { w: 300, a: er.a, sheen: pr(tv, 63.66 + 0.07 * k, 63.98 + 0.07 * k) });
    }
    x.restore();
    // LEFT: the axi wordmark rises, a ◢ pour falls into the vault, dark pill «تمويلك من Axi» with a red → at Rabee
    x.save(); st_xf(x, 325, 460, ox); x.globalAlpha *= ox.a;
    const ew = ent(tv, 62.32, 1e9, { rise: 20 });
    if (ew) await axiMark(x, 268, 262 + ew.dy, 60, ew.a);
    const uv = pr(tv, 62.45, 62.95);
    if (uv > 0) sym(x, "vault", 325, 455, 150, { u: uv, k: { rot: ((2 * Math.PI) / 3) * e3(pr(tv, 63.12, 63.52)), pulse: pr(tv, 63.36, 63.66) } });
    st_pour(x, tv);
    const ep = ent(tv, 63.14, 1e9, { rise: 16 });
    if (ep) {
      pill(x, 125, 590 + ep.dy, 400, 76, "", { kind: "dark", circle: true, dir: "right", a: ep.a, nudge: 6 * (st_bump(tv, 63.70, 0.22) + st_bump(tv, 64.00, 0.22)) });
      runs(x, [{ s: "تمويلك من", w: 500, size: 36 }, { s: "Axi", w: 500, size: 36, fam: LAT }], 450, 641 + ep.dy, { a: ep.a });
    }
    x.restore();
  }

  GROUPS.push({
    name: "stages",
    floor: st_floor,
    async draw(x, t, S) {
      const tv = t - P;
      if (tv < 33.3 || tv > 64.7) return;
      const seg = st_which(S);
      if (!seg) return;
      if (seg === "HI") {
        st_seed(x, tv); st_five(x, tv);
        if (tv >= 41.20) { st_stair(x, tv, "I"); st_readI(x, tv); }
      } else if (seg === "J") st_hero(x, tv, st_JC);
      else if (seg === "K") st_hero(x, tv, st_KC);
      else if (seg === "L") { st_stair(x, tv, "L"); st_readL(x, tv); }
      else if (seg === "M") st_teaser(x, tv);
      else if (seg === "M2") { st_stair(x, tv, "M2"); st_readM2(x, tv); }
      else if (seg === "N1") await st_ladder(x, tv);
    },
  });

  // ================================================================== GROUP «accounts» (prefix ac_): beats O P Q R S T U
  // Layouts follow sel/mg_final.json. Times are VO seconds. The spec's ≈ onsets are raw-VO whisper starts; every hit here is
  // snapped to work/words_v4.json and to the speech onsets of the final voice (vo1_clean_v4), which run up to 0.4 s later
  // after pauses: «بالإضافة» 72.93, «مقدم» 75.75, «شركة» 76.78, «Axi» 77.60, «ملاحظة» 78.20, «لا» 80.50, «وإنما» 82.85,
  // «بمعامل» 88.95, «احفظ» 91.47, «في (الفيديوهات)» 94.77, «وأهمها» 101.74, «عشرة» 104.90.
  // O  VO 68.10-77.96   VC HOME -> WIDE (pull 69.22): trading card (candles, live chart, BUY marks), metallic '+',
  //                     allocation card (vault, '$ 5,000', 'Seed'), the axi wordmark, its ◢ pour and its «Axi» accent.
  // P  VO 78.04-78.92   L2 corner slot: red NOTE TAG '!' + «ملاحظة مهمّة», two rocks.
  // Q  VO 79.02-84.60   L3 (x <= 790): allocation card, greyed «تداول» pill: click, shake, padlock snaps, slash,
  //                     «لا تداول مباشر»; trading card below; dotted link + chain «ربط تلقائي»; two red pulses up.
  // R  VO 84.70-90.96   VC WIDE (drop 2): COPY x10 — two trade lists, the red dotted arc over his head, the apex node
  //                     (copy -> x10, «نسخ تلقائي» -> «معامل الضرب»), four trades ride the arc and land multiplied.
  // S  VO 91.04-95.86   L2 corner slot: tag «معامل الضرب» + metallic x10, red flag bookmark, dark pill «في الفيديوهات القادمة».
  // T  VO 95.95-102.08  L1 (x >= 1220): rule-sheet card (no flag), six stage symbols light 01-06, three abstract rule
  //                     rows tick red, row 4 in focus (shield, «حدّ الانعكاس»).
  // U  VO 102.15-108.00 VC WIDE: limit ring on the floor, headline, −10% chart, metallic 10% and footnote in the right
  //                     third. Ring, pool and headline exit 105.20-105.50; the chart, '10%' and footnote hold still in
  //                     screen space through the push to HOME (zones free at both framings) and exit at V's times:
  //                     chart 106.30-106.60, '10%' + footnote 107.70-108.00.

  // ------------------------------------------------------------------ timing (VO s)
  const ac_K = {
    // O: «حساب تداول» 70.16, «تتداول» 71.00, «عليه» 71.42, «بالإضافة» 72.93, «حساب تخصيص» 73.58, «ممول» 74.60,
    //    «مقدم» 75.75, «شركة» 76.78, pause 77.18-77.58, «Axi» 77.58-78.02 (O->P cut 78.04: everything gone by 77.96)
    O_tc: 70.12, O_chart: 70.50, O_buy1: 71.00, O_live: 71.42, O_buy2: 71.62, O_plus: 72.85, O_ac: 73.48, O_count: 74.55,
    O_seed: 74.70, O_mark: 75.66, O_pour: 76.66, O_axi: 77.56, O_out: 77.66, O_markOut: 77.72,
    // P (cut in at 78.04): «ملاحظة» 78.20, «مهمة» 78.54 (cut 79.00: gone by 78.92)
    P_tag: 78.12, P_txt: 78.18, P_rock: 78.44, P_out: 78.64,
    // Q: «حساب التخصيص» 79.45, «لا» 80.50, «التداول» 80.84 (stress 81.06), «بشكل مباشر» 81.52, «وإنما» 82.85,
    //    «مربوط» 83.40, «تلقائيا» 83.92 (cut 84.68: gone by 84.60)
    Q_ac: 79.40, Q_cur: 80.12, Q_click: 80.42, Q_shake: 80.46, Q_lock: 80.82, Q_snap: 81.04, Q_slash: 81.46,
    Q_tc: 82.74, Q_link: 83.10, Q_chain: 83.40, Q_p1: 83.84, Q_p2: 84.06, Q_out: 84.30,
    // R: «التداول» 85.40, «ويقوم» 85.96, «بنسخ» 86.60, «الصفقات» 87.34, «المنفذة» 87.88, pause 88.62-88.95, «بمعامل» 88.95,
    //    «لكل» 90.02 (cut 91.04: gone by 90.96). Apex flashes sit in the pauses 87.05-87.13, 87.65-87.72, 88.29-88.42, 90.13-90.20
    R_rip: 84.70, R_tc: 85.10, R_ac: 85.20, R_arc: 85.55, R_node: 86.00, R_x10: 88.62, R_cap: 89.40, R_out: 90.62,
    // S: «احفظ» 91.47, «كلمة» 91.64, «الضرب» 92.38, «في الفيديوهات القادمة» 94.77 (cut 95.96: gone by 95.88)
    S_tag: 91.32, S_flag: 91.40, S_sheen: 92.38, S_pill: 94.64, S_out: 95.50,
    // T: «مرحلة من هذه المراحل» 96.76, «مجموعة من القواعد» 98.60, row 4 in the pause 101.40-101.74 before «وأهمها»
    //    (cut 102.16: gone by 102.08)
    T_card: 96.40, T_sym: 96.80, T_rows: 98.60, T_row4: 101.40, T_out: 101.92,
    // U: «ألّا يصل» 102.67, «انعكاس حساب التخصيص» 103.14-104.60, pause 104.60-104.86, «عشرة» 104.90 (push 105.58)
    U_ring: 102.55, U_head: 102.60, U_chart: 102.75, U_lim: 103.00, U_down: 103.20, U_pulse: 104.05, U_rec: 104.30,
    U_ten: 104.64, U_foot: 104.90, U_sheen: 104.98, U_out: 105.20, U_chartOut: 106.30, U_tenOut: 107.70,
  };
  // R: the four copied trades (appear in the trading list, ride the arc s..s+d, land multiplied in the allocation list)
  const ac_TR = [
    { a: 86.67, s: 86.77, d: 0.60, buy: true, lot: "0.01", x10: "0.10" },
    { a: 87.28, s: 87.38, d: 0.60, buy: false, lot: "0.02", x10: "0.20" },
    { a: 87.95, s: 88.05, d: 0.60, buy: true, lot: "0.01", x10: "0.10" },
    { a: 89.90, s: 90.00, d: 0.45, buy: true, lot: "0.03", x10: "0.30" },
  ];
  const ac_MUL = "x10";

  // ------------------------------------------------------------------ small helpers
  const ac_in = (q, t0, d = 0.45) => expo(pr(q, t0, t0 + d));
  // group transform from an ent() envelope: alpha, rise / exit drift, exit scale about (cx, cy). Pair with x.restore().
  function ac_push(x, e, cx, cy) {
    x.save(); x.globalAlpha *= e.a; x.translate(0, e.dy);
    if (e.sc !== 1) { x.translate(cx, cy); x.scale(e.sc, e.sc); x.translate(-cx, -cy); }
  }
  // exit-only envelope (inOutCubic, as the kit's ent() exits: alpha -> 0, y -10, scale .985)
  function ac_out(q, t1, d) { const u = eio(pr(q, t1, t1 + d)); return { a: 1 - u, dy: -10 * u, sc: 1 - 0.015 * u, uo: u }; }
  // clip to the part of [X0, X1] revealed from its right edge (RTL), u 0..1 (already eased)
  function ac_clipR(x, X0, X1, Y0, Y1, u) { const w = (X1 - X0) * cl(u); x.beginPath(); x.rect(X1 - w, Y0, w, Y1 - Y0); x.clip(); }
  // the same from the left edge, for Latin (left to right). Every text clip reaches baseline + 0.6 em (final-ي dots hang
  // 0.45-0.55 em below the baseline)
  function ac_clipL(x, X0, X1, Y0, Y1, u) { x.beginPath(); x.rect(X0, Y0, (X1 - X0) * cl(u), Y1 - Y0); x.clip(); }
  // glint for metallic numerals: what draw(c) paints into the box is copied to a scratch canvas; a red slanted edge
  // (0.82 px of x per px of y, the logo build's edge) crosses the glyphs left to right at constant speed, from the first
  // glyph pixel it touches to the last (the ink's extent along the slant is read once per box), trailing a 60 px bright
  // band that is ADDED (lighter, peak alpha 1, 0.9 plateau) through the glyph mask; band and edge are drawn in the
  // skewed frame x' = x + 0.82 y so the band stays parallel to the edge down the whole glyph; the band fades over the
  // sweep's last 25 %
  const ac_glInk = {};
  function ac_glint(x, X, Y, w, h, u, draw) {
    if (!(u > 0 && u < 1)) { draw(x); return; }
    const pad = 4, sl = 0.82, ew = 7, bw = 60, key = Math.round(w) + "x" + Math.round(h);
    const c = tmp("ac_gl" + key, w + 2 * pad, h + 2 * pad), W2 = c.width, H2 = c.height, b = tmp("ac_glb" + key, W2, H2);
    c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalAlpha = 1; c.x.globalCompositeOperation = "source-over"; c.x.clearRect(0, 0, W2, H2);
    c.x.save(); c.x.translate(pad - X, pad - Y); draw(c.x); c.x.restore();
    let ink = ac_glInk[key];
    if (!ink) { // range of x + sl*y over the glyph pixels (alpha > 25 %): the edge positions that touch ink
      const d = c.x.getImageData(0, 0, W2, H2).data; let mn = Infinity, mx = -Infinity;
      for (let py = 0; py < H2; py++) for (let px = 0; px < W2; px++) {
        if (d[(py * W2 + px) * 4 + 3] > 64) { const v = px + sl * py; if (v < mn) mn = v; if (v > mx) mx = v; }
      }
      ink = ac_glInk[key] = mn < mx ? [mn, mx] : [0, W2 + sl * H2];
    }
    const ex = lerp(ink[0] - ew, ink[1], u); // the edge spans x' in [ex, ex + ew]: on the first ink at u 0, the last at u 1
    // the band, masked by the glyphs, then added onto them
    b.x.setTransform(1, 0, 0, 1, 0, 0); b.x.globalAlpha = 1; b.x.globalCompositeOperation = "source-over"; b.x.clearRect(0, 0, W2, H2);
    b.x.setTransform(1, 0, -sl, 1, 0, 0); b.x.globalAlpha = 1 - pr(u, 0.75, 1);
    const g = b.x.createLinearGradient(ex - bw, 0, ex, 0);
    g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.45, "rgba(255,255,255,0.9)"); g.addColorStop(1, "rgba(255,255,255,1)");
    b.x.fillStyle = g; b.x.fillRect(ex - bw, 0, bw, H2);
    b.x.setTransform(1, 0, 0, 1, 0, 0); b.x.globalAlpha = 1; b.x.globalCompositeOperation = "destination-in"; b.x.drawImage(c, 0, 0);
    b.x.globalCompositeOperation = "source-over";
    c.x.globalCompositeOperation = "lighter"; c.x.drawImage(b, 0, 0);
    // the red edge on the glyphs
    c.x.globalCompositeOperation = "source-atop"; c.x.fillStyle = RED; c.x.setTransform(1, 0, -sl, 1, 0, 0); c.x.fillRect(ex, 0, ew, H2);
    c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalCompositeOperation = "source-over";
    x.drawImage(c, X - pad, Y - pad);
  }
  // the brand ▲ / ▼ (round-joined), fill + stroke in the current styles
  function ac_tri(x, cx, cy, w, h, up) {
    x.beginPath();
    if (up) { x.moveTo(cx, cy - h / 2); x.lineTo(cx + w / 2, cy + h / 2); x.lineTo(cx - w / 2, cy + h / 2); }
    else { x.moveTo(cx, cy + h / 2); x.lineTo(cx + w / 2, cy - h / 2); x.lineTo(cx - w / 2, cy - h / 2); }
    x.closePath(); x.lineJoin = "round"; x.lineWidth = 2; x.fill(); x.stroke();
  }
  // mixed RTL line from the right edge Xr (reading order); Arabic parts drawn RTL so their punctuation stays put
  function ac_runs(x, parts, Xr, Y, o = {}) {
    let xx = Xr;
    parts.forEach((p, i) => {
      const size = p.size ?? o.size ?? 34, w = p.w ?? o.w ?? 400, fam = p.fam || (isAr(p.s) ? AR : LAT);
      T(x, p.s, xx, Y, { w, size, fam, align: "right", color: p.color || o.color, a: (p.a ?? 1) * (o.a ?? 1) });
      xx -= measure(x, p.s, w, size, fam) + (i < parts.length - 1 ? p.gap ?? size * 0.28 : 0);
    });
    return Xr - xx;
  }
  const ac_runsW = (x, parts, o = {}) => parts.reduce((s, p, i) => {
    const size = p.size ?? o.size ?? 34, w = p.w ?? o.w ?? 400, fam = p.fam || (isAr(p.s) ? AR : LAT);
    return s + measure(x, p.s, w, size, fam) + (i < parts.length - 1 ? p.gap ?? size * 0.28 : 0);
  }, 0);
  // small chamfered box (checkbox), top-right cut c
  function ac_box(x, X, Y, s, c) {
    x.beginPath(); x.moveTo(X + 4, Y); x.lineTo(X + s - c, Y); x.lineTo(X + s, Y + c); x.lineTo(X + s, Y + s - 4);
    x.arcTo(X + s, Y + s, X + s - 4, Y + s, 4); x.lineTo(X + 4, Y + s); x.arcTo(X, Y + s, X, Y + s - 4, 4);
    x.lineTo(X, Y + 4); x.arcTo(X, Y, X + 4, Y, 4); x.closePath();
  }
  // white tick drawn on by k (0..1) inside a box centred (cx, cy), half size q
  function ac_tick(x, cx, cy, q, k, lw = 3) {
    if (k <= 0) return;
    x.save(); x.strokeStyle = WHITE; x.lineWidth = lw; x.lineCap = "round"; x.lineJoin = "round"; x.beginPath();
    const a = [cx - q, cy + q * 0.05], b = [cx - q * 0.3, cy + q * 0.7], c = [cx + q, cy - q * 0.65];
    x.moveTo(a[0], a[1]);
    const k1 = cl(k * 2), k2 = cl(k * 2 - 1);
    x.lineTo(lerp(a[0], b[0], k1), lerp(a[1], b[1], k1));
    if (k2 > 0) x.lineTo(lerp(b[0], c[0], k2), lerp(b[1], c[1], k2));
    x.stroke(); x.restore();
  }
  // ------------------------------------------------------------------ candles (your trading account: one seeded series)
  const ac_OD = series(22, 26, 0.25, 0.06, 0.35);
  const ac_QD = ac_OD.slice(14, 20); // the same account, six candles (beat Q)
  function ac_rng(D, i0, n) {
    let lo = 1, hi = 0;
    for (let i = Math.max(0, i0); i < Math.min(D.length, i0 + n); i++) { lo = Math.min(lo, D[i].l); hi = Math.max(hi, D[i].h); }
    const pad = (hi - lo) * 0.16; return [lo - pad, hi + pad];
  }
  // live chart (time runs left to right): C {X, Y, w, h, n slots, body}; st(i) = print time of candle i (the first n
  // build, later ones scroll in one pitch each, 0.2 s e4); the newest breathes ±6 px; marks [{i, t}] = BUY markers.
  // Returns the last close y.
  function ac_live(x, q, C, D, st, marks) {
    const n = C.n, pitch = C.w / n;
    let last = -1, from = 0;
    for (let i = 0; i < D.length; i++) { if (st(i) <= q) last = i; if (i >= n) from += e4(pr(q, st(i), st(i) + 0.2)); }
    const i0 = Math.floor(from), fr = from - i0;
    const ra = ac_rng(D, i0, n), rb = ac_rng(D, i0 + 1, n), lo = lerp(ra[0], rb[0], fr), hi = lerp(ra[1], rb[1], fr);
    const yOf = (p) => C.Y + C.h - ((p - lo) / (hi - lo)) * C.h;
    let lastY = null; const mk = [];
    x.save(); x.beginPath(); x.rect(C.X, C.Y - 30, C.w, C.h + 60); x.clip();
    for (let i = i0; i <= Math.min(D.length - 1, i0 + n); i++) {
      const g = pr(q, st(i), st(i) + 0.3); if (g <= 0) continue;
      const d = D[i], cx = C.X + (i - from + 0.5) * pitch;
      let yO = yOf(d.o), yC = yOf(d.c), yH = yOf(d.h), yL = yOf(d.l);
      if (i === last && g >= 1) { // breathe
        const lt = q - st(i) - 0.3, b = 6 * Math.sin((2 * Math.PI * lt) / 1.0) * cl(lt / 0.25);
        yC = yC <= yO ? Math.min(yO - 3, yC + b) : Math.max(yO + 3, yC + b);
        yH = Math.min(yH, yC); yL = Math.max(yL, yC);
      }
      const ea = cl((cx - C.X) / (pitch * 0.7));
      candle(x, cx, yO, yC, yH, yL, C.body, { grow: g, newest: i === last, a: ea });
      if (i === last) lastY = yC;
      for (const m of marks || []) if (m.i === i) mk.push([m.t, cx, (yO + yC) / 2, yL, cl((cx - C.X - 13) / (pitch * 0.6))]);
    }
    x.restore();
    // BUY markers after the clip, so a ring near the chart's edge is never cut
    for (const [tb, cx, cy, yL, a] of mk) ac_buy(x, q, tb, cx, cy, yL, a);
    return lastY;
  }
  // BUY marker: a white ring on the candle body plus a red ▲ under its low wick (pop, back 1.4)
  function ac_buy(x, q, tb, cx, cyB, yL, a) {
    const k = pr(q, tb, tb + 0.3); if (k <= 0) return;
    const sc = back(k, 1.4);
    x.save(); x.globalAlpha *= a * cl(k * 3);
    x.strokeStyle = WHITE; x.lineWidth = 2;
    x.beginPath(); x.arc(cx, cyB, 13 * sc, 0, Math.PI * 2); x.stroke();
    const kp = pr(q, tb, tb + 0.45);
    if (kp < 1) { x.save(); x.globalAlpha *= 0.7 * (1 - kp); x.beginPath(); x.arc(cx, cyB, lerp(13, 32, e3(kp)), 0, Math.PI * 2); x.stroke(); x.restore(); }
    x.fillStyle = RED; x.strokeStyle = RED;
    x.save(); x.translate(cx, yL + 13); x.scale(sc, sc); ac_tri(x, 0, 0, 14, 10, true); x.restore();
    x.restore();
  }

  // ================================================================== O · VO 68.10-77.96 · the simple picture
  const ac_Ost = (i) => (i < 12 ? ac_K.O_chart + 0.05 + i * 0.0345 : ac_K.O_live + (i - 12) * 0.6);
  async function ac_O(x, q) {
    const K = ac_K, dout = 0.3;
    const eT = ent(q, K.O_tc, K.O_out, { din: 0.5, dout, rise: 24 });
    const eA = ent(q, K.O_ac, K.O_out, { din: 0.5, dout, rise: 24 });
    // card reflections on the floor (plate space, additive), entering and leaving with their cards
    const sl = [];
    if (eA) sl.push({ u: -2.75, v: -0.6, rx: 1.1, color: RED, a: 0.12 * eA.a });
    if (eT) sl.push({ u: 2.75, v: -0.6, rx: 1.1, color: WHITE, a: 0.1 * eT.a });
    spill(x, sl);
    // ---- trading card (right)
    if (eT) {
      const X = 1260, Y = 250, w = 480, h = 300, tc = K.O_tc + 0.12;
      ac_push(x, eT, X + w / 2, Y + h / 2);
      card(x, X, Y, w, h, { u: pr(q, K.O_tc, K.O_tc + 0.5) });
      const kc = ac_in(q, tc);
      x.save(); x.globalAlpha *= cl(kc * 1.3); x.translate(0, (1 - kc) * 10);
      sym(x, "candles", 1320, 306, 56, { u: pr(q, tc, tc + 0.5) });
      T(x, "حساب التداول", 1708, 322, { w: 500, size: 42 });
      T(x, "حسابك · تداول اعتيادي", 1708, 372, { w: 400, size: 34, color: GREY });
      x.restore();
      // mini chart in corner marks, live
      const C = { X: 1292, Y: 405, w: 416, h: 125, n: 12, body: 18 };
      const ly = ac_live(x, q, C, ac_OD, ac_Ost, [{ i: 5, t: K.O_buy1 }, { i: 12, t: K.O_buy2 }]);
      corners(x, C.X, C.Y, C.w, C.h, { L: 18, u: pr(q, K.O_chart - 0.05, K.O_chart + 0.4), u2: pr(q, K.O_chart + 0.35, K.O_chart + 0.65), mid: ly ?? undefined });
      x.restore();
    }
    // ---- metallic '+' between the cards, above Rabee
    if (q >= K.O_plus && q <= K.O_out + dout) {
      const k = pr(q, K.O_plus, K.O_plus + 0.35), xp = ac_out(q, K.O_out, dout), sc = lerp(0.8, 1, back(k, 1.4)) * xp.sc;
      x.save(); x.globalAlpha *= cl(k * 4) * xp.a; x.translate(946, 330 + xp.dy); x.scale(sc, sc); x.translate(-946, -330);
      metal(x, "+", 946, 380, 140, { align: "center" });
      x.restore();
    }
    // ---- allocation card (left)
    if (eA) {
      const X = 180, Y = 250, w = 480, h = 300, tc = K.O_ac + 0.12;
      ac_push(x, eA, X + w / 2, Y + h / 2);
      card(x, X, Y, w, h, { u: pr(q, K.O_ac, K.O_ac + 0.5) });
      // pour: a 4 x 4 lattice of ◢ marks cascades from below the wordmark's clear space into the card, fading under its
      // top edge (columns 0.03 s apart, rows 0.07 s apart)
      for (let i = 0; i < 16; i++) {
        const col = i % 4, row = Math.floor(i / 4), ts = K.O_pour + col * 0.03 + row * 0.07, k = pr(q, ts, ts + 0.28);
        if (k <= 0 || k >= 1) continue;
        const px = 392 + col * 16, py = lerp(222, 276, in2(k)), s = 8;
        x.save(); x.globalAlpha *= 0.95 * cl((py - 222) / 8) * (1 - cl((py - Y) / (276 - Y))); x.fillStyle = RED;
        x.beginPath(); x.moveTo(px + s, py); x.lineTo(px + s, py + s); x.lineTo(px, py + s); x.closePath(); x.fill();
        x.restore();
      }
      const kc = ac_in(q, tc);
      x.save(); x.globalAlpha *= cl(kc * 1.3); x.translate(0, (1 - kc) * 10);
      const hub = pr(q, K.O_pour + 0.32, K.O_pour + 0.72);
      sym(x, "vault", 244, 314, 64, { u: pr(q, tc, tc + 0.5), k: { rot: (Math.PI / 3) * e3(pr(q, K.O_count, K.O_count + 0.6)), pulse: hub > 0 && hub < 1 ? hub : 0 } });
      T(x, "حساب التخصيص", 628, 322, { w: 500, size: 42 });
      T(x, "مموَّل", 628, 372, { w: 400, size: 34, color: GREY });
      // '$ 5,000' counts in fixed cells, relaxes to natural advances on landing, then one sheen; the 'Seed' chip
      if (q >= K.O_count) {
        const dc = 0.55, kn = e4(pr(q, K.O_count, K.O_count + dc)), n = kn >= 1 ? 5000 : Math.round((5000 * kn) / 10) * 10;
        metal(x, fmtMoney(n), 212, 525, 88, { tab: true, relax: pr(q, K.O_count + dc, K.O_count + dc + 0.15), a: cl(pr(q, K.O_count, K.O_count + 0.12)), sheen: pr(q, K.O_count + dc + 0.05, K.O_count + dc + 0.5) });
      }
      const kd = pr(q, K.O_seed, K.O_seed + 0.35);
      if (kd > 0) {
        x.save(); ac_clipL(x, 528, 632, 480, 532, expo(kd)); // Latin: left to right
        tag(x, 532, 486, 96, 40, {});
        T(x, "Seed", 580, 514.5, { w: 400, size: 24, fam: LAT, align: "center" });
        x.restore();
      }
      x.restore();
      x.restore();
    }
    // ---- the axi wordmark rises above the allocation card (the provider) and pours its ◢ into it (above); on «Axi» it
    //      pops 4 % (back) while a red underline wipes in left to right under its clear space; it exits last, by 77.96
    const kw = pr(q, K.O_mark, K.O_mark + 0.45), xm = ac_out(q, K.O_markOut, 0.24);
    if (kw > 0 && xm.a > 0) {
      const ax = await im("axi_part_white.png");
      const mh = 44, mw = (mh * LOGO.axiW) / LOGO.h, MX = 420 - mw / 2, MY = 174 + (1 - expo(kw)) * 16 + xm.dy;
      const p1 = pr(q, K.O_axi, K.O_axi + 0.12), p2 = pr(q, K.O_axi + 0.12, K.O_axi + 0.34);
      const ps = (p2 > 0 ? lerp(1.04, 1, e3(p2)) : lerp(1, 1.04, back(p1, 1.6))) * xm.sc;
      x.save(); x.globalAlpha *= cl(kw * 1.4) * xm.a;
      x.translate(420, MY + mh / 2); x.scale(ps, ps); x.translate(-420, -(MY + mh / 2));
      x.drawImage(ax, MX, MY, mw, mh);
      x.restore();
      const ku = expo(pr(q, K.O_axi + 0.04, K.O_axi + 0.26));
      if (ku > 0) { x.save(); x.globalAlpha *= xm.a; x.fillStyle = RED; x.fillRect(MX, 231.5 + xm.dy, mw * ku, 3); x.restore(); }
    }
  }

  // ================================================================== P · VO 78.04-78.92 · NOTE TAG (L2 corner slot)
  function ac_P(x, q) {
    const K = ac_K, dout = 0.28;
    if (q < K.P_tag || q > K.P_out + dout) return;
    const xo = ac_out(q, K.P_out, dout);
    x.save(); x.globalAlpha *= xo.a; x.translate(0, xo.dy); x.translate(380, 296); x.scale(xo.sc, xo.sc); x.translate(-380, -296);
    // red TAG '!': scaleX 0 -> 1 from its right edge (0.2 s expo), then rocks ±4° twice
    const ks = expo(pr(q, K.P_tag, K.P_tag + 0.2)), kr = pr(q, K.P_rock, K.P_rock + 0.2);
    const rot = kr > 0 && kr < 1 ? ((4 * Math.PI) / 180) * Math.sin(kr * 4 * Math.PI) * (1 - 0.35 * kr) : 0;
    x.save(); x.translate(636, 296); x.scale(Math.max(0.001, ks), 1); x.translate(-636, -296);
    x.translate(588, 296); x.rotate(rot); x.translate(-588, -296);
    tag(x, 540, 260, 96, 72, { fill: "red" });
    T(x, "!", 588, 313.5, { w: 600, size: 48, fam: LAT, align: "center" });
    x.restore();
    // «ملاحظة مهمّة» reveals right to left beside it
    const kt = e4(pr(q, K.P_txt, K.P_txt + 0.34));
    if (kt > 0) { x.save(); ac_clipR(x, 120, 530, 220, 390, kt); T(x, "ملاحظة مهمّة", 520, 318 + (1 - kt) * 12, { w: 500, size: 56 }); x.restore(); }
    x.restore();
  }

  // ================================================================== Q · VO 79.02-84.60 · locked, but linked (L3, x <= 790)
  function ac_Q(x, q) {
    const K = ac_K, dout = 0.3;
    const eA = ent(q, K.Q_ac, K.Q_out, { din: 0.5, dout, rise: 24 });
    if (!eA) return;
    const eB = ent(q, K.Q_tc, K.Q_out, { din: 0.5, dout, rise: 40 });
    // ---- allocation card
    {
      const X = 160, Y = 180, w = 600, h = 250, tc = K.Q_ac + 0.12;
      ac_push(x, eA, X + w / 2, Y + h / 2);
      card(x, X, Y, w, h, { u: pr(q, K.Q_ac, K.Q_ac + 0.5) });
      const kc = ac_in(q, tc);
      x.save(); x.globalAlpha *= cl(kc * 1.3); x.translate(0, (1 - kc) * 10);
      sym(x, "vault", 232, 252, 72, { u: pr(q, tc, tc + 0.5) });
      T(x, "حساب التخصيص", 720, 262, { w: 500, size: 48 });
      // greyed DARK pill «تداول»: click, shake ±8 px three times
      const ksh = pr(q, K.Q_shake, K.Q_shake + 0.3), dx = ksh > 0 && ksh < 1 ? 8 * Math.sin(ksh * 6 * Math.PI) * (1 - 0.4 * ksh) : 0;
      pill(x, 550 + dx, 296, 170, 60, "تداول", { kind: "dark", fill: TRACK, color: DIM, w: 500, size: 34, press: q >= K.Q_click ? q - K.Q_click : null });
      // slash across the pill
      const kl = e3(pr(q, K.Q_slash, K.Q_slash + 0.14));
      if (kl > 0) {
        x.save(); x.strokeStyle = RED; x.lineWidth = 3; x.lineCap = "round";
        x.beginPath(); x.moveTo(548, 356); x.lineTo(lerp(548, 722, kl), lerp(356, 296, kl)); x.stroke(); x.restore();
      }
      // padlock drops onto the pill's left end; the shackle snaps down 10 px (2-frame 4 px shake, red ring r 30 -> 70)
      const kd = pr(q, K.Q_lock, K.Q_lock + 0.22);
      if (kd > 0) {
        const ds = q - K.Q_snap, shk = ds >= 0 && ds < 0.08 ? (Math.floor(ds / 0.04) % 2 ? -4 : 4) : 0;
        // a short drop (14 px, clear of the title) with a scale-in, then a 3 px settle
        const py = 322 - 14 * (1 - in2(kd)) + (kd >= 1 ? 3 * Math.sin(Math.PI * pr(q, K.Q_lock + 0.22, K.Q_lock + 0.34)) : 0);
        const op = 1 - pr(q, K.Q_snap, K.Q_snap + 0.08), s = 0.64, ps = lerp(1.2, 1, in2(kd));
        x.save(); x.globalAlpha *= cl(kd * 3); x.translate(550 + shk, py); x.scale(ps, ps);
        x.fillStyle = "#131417"; x.beginPath(); x.roundRect(-30 * s, -4 * s, 60 * s, 46 * s, 8 * s); x.fill();
        sym(x, "padlock", 0, 0, 64, { k: { open: op } });
        x.restore();
        const kr = pr(q, K.Q_snap, K.Q_snap + 0.4);
        if (kr > 0 && kr < 1) { x.save(); x.globalAlpha *= 0.8 * (1 - kr); x.strokeStyle = RED; x.lineWidth = 2; x.beginPath(); x.arc(550, 324, lerp(30, 70, e3(kr)), 0, Math.PI * 2); x.stroke(); x.restore(); }
      }
      // «لا تداول مباشر»
      const kt = e4(pr(q, K.Q_slash, K.Q_slash + 0.35));
      if (kt > 0) { x.save(); ac_clipR(x, 470, 724, 360, 432, kt); T(x, "لا تداول مباشر", 720, 404, { w: 400, size: 36 }); x.restore(); }
      x.restore();
      // the rim flashes red as each pulse arrives
      for (const tp of [K.Q_p1, K.Q_p2]) {
        const kf = pr(q, tp + 0.25, tp + 0.6);
        if (kf > 0 && kf < 1) { x.save(); x.globalAlpha *= 0.9 * (1 - kf); chamferPath(x, X, Y, w, h, cutOf(w, h)); x.strokeStyle = RED; x.lineWidth = 2; x.stroke(); x.restore(); }
      }
      x.restore();
    }
    // ---- cursor: glides to the pill and clicks (tip path inside x 520-790)
    {
      const k = pr(q, K.Q_cur, K.Q_click - 0.02), ko = pr(q, K.Q_shake + 0.32, K.Q_shake + 0.5);
      if (k > 0 && ko < 1) {
        const u = eio(k), cx = lerp(756, 642, u), cy = lerp(478, 330, u);
        const pz = q >= K.Q_click && q < K.Q_click + 0.08 ? 0.9 : 1;
        x.save(); x.globalAlpha *= eA.a * cl(k * 5) * (1 - eio(ko)); x.translate(cx, cy); x.scale(pz, pz); cursor(x, 0, 0); x.restore();
      }
    }
    if (!eB) return;
    // ---- trading card rises in below
    {
      const X = 160, Y = 640, w = 600, h = 200, tc = K.Q_tc + 0.12;
      ac_push(x, eB, X + w / 2, Y + h / 2);
      card(x, X, Y, w, h, { u: pr(q, K.Q_tc, K.Q_tc + 0.5) });
      const kc = ac_in(q, tc);
      x.save(); x.globalAlpha *= cl(kc * 1.3); x.translate(0, (1 - kc) * 10);
      T(x, "حساب التداول", 720, 708, { w: 500, size: 42 });
      T(x, "حسابك", 720, 762, { w: 400, size: 34, color: GREY });
      x.restore();
      const C = { X: 196, Y: 672, w: 224, h: 140, n: 6, body: 18 };
      const ly = ac_live(x, q, C, ac_QD, (i) => tc + 0.1 + i * 0.05, []);
      corners(x, C.X, C.Y, C.w, C.h, { L: 18, u: pr(q, tc - 0.05, tc + 0.4), u2: pr(q, tc + 0.3, tc + 0.6), mid: ly ?? undefined });
      x.restore();
    }
    // ---- dotted link (draws bottom to top), chain on an INK disc, «ربط تلقائي», two red pulses up the link
    {
      const xo = ac_out(q, K.Q_out, dout);
      x.save(); x.globalAlpha *= xo.a; x.translate(0, xo.dy);
      const kl = e3(pr(q, K.Q_link, K.Q_link + 0.3));
      if (kl > 0) {
        x.fillStyle = "rgba(255,255,255,0.35)"; x.beginPath();
        for (let y = 634; y >= 436; y -= 12) if (640 - y <= kl * 210) { x.moveTo(461.5, y); x.arc(460, y, 1.5, 0, Math.PI * 2); }
        x.fill();
      }
      const kd = pr(q, K.Q_chain - 0.2, K.Q_chain + 0.12);
      if (kd > 0) {
        const sc = lerp(0.85, 1, expo(kd));
        x.save(); x.globalAlpha *= cl(kd * 3); x.translate(460, 535); x.scale(sc, sc);
        x.fillStyle = INK; x.beginPath(); x.arc(0, 0, 38, 0, Math.PI * 2); x.fill();
        x.lineWidth = 1.5; x.strokeStyle = "rgba(255,255,255,0.14)"; x.stroke();
        sym(x, "chain", 0, 0, 56, { k: { join: pr(q, K.Q_chain - 0.18, K.Q_chain) } });
        x.restore();
        const kr = pr(q, K.Q_chain, K.Q_chain + 0.35);
        if (kr > 0 && kr < 1) { x.save(); x.globalAlpha *= 0.5 * (1 - kr); x.strokeStyle = WHITE; x.lineWidth = 2; x.beginPath(); x.arc(460, 535, lerp(38, 58, e3(kr)), 0, Math.PI * 2); x.stroke(); x.restore(); }
      }
      const kt = e4(pr(q, K.Q_chain, K.Q_chain + 0.35));
      if (kt > 0) { x.save(); ac_clipR(x, 530, 724, 500, 580, kt); T(x, "ربط تلقائي", 720, 547, { w: 400, size: 36, color: GREY }); x.restore(); }
      for (const tp of [K.Q_p1, K.Q_p2]) {
        const k = pr(q, tp, tp + 0.25); if (k <= 0 || k >= 1) continue;
        const y = lerp(640, 430, eio(k));
        glow(x, 460, y, 24, RED, 0.6); x.fillStyle = RED; x.beginPath(); x.arc(460, y, 6, 0, Math.PI * 2); x.fill();
      }
      x.restore();
    }
  }

  // ================================================================== R · VO 84.70-90.96 · COPY x10 (VC WIDE)
  const ac_ARC = (() => { // quadratic (1260,320) via (960,40) to (660,320): arc-length table
    const P0 = [1260, 320], Cc = [960, 40], P2 = [660, 320], N = 360, pts = [], len = [0];
    for (let i = 0; i <= N; i++) {
      const u = i / N, a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u;
      pts.push([a * P0[0] + b * Cc[0] + c * P2[0], a * P0[1] + b * Cc[1] + c * P2[1]]);
      if (i) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    }
    const L = len[N], d0 = [pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]], d1 = [pts[N][0] - pts[N - 1][0], pts[N][1] - pts[N - 1][1]];
    const n0 = Math.hypot(d0[0], d0[1]), n1 = Math.hypot(d1[0], d1[1]);
    // position at arc length s (extended along the end tangents beyond 0 and L)
    function at(s) {
      if (s <= 0) return [P0[0] + (d0[0] / n0) * s, P0[1] + (d0[1] / n0) * s];
      if (s >= L) return [P2[0] + (d1[0] / n1) * (s - L), P2[1] + (d1[1] / n1) * (s - L)];
      let lo = 0, hi = N;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (len[m] < s) lo = m; else hi = m; }
      const f = (s - len[lo]) / (len[hi] - len[lo] || 1);
      return [lerp(pts[lo][0], pts[hi][0], f), lerp(pts[lo][1], pts[hi][1], f)];
    }
    const dots = []; for (let s = 7; s < L; s += 14) dots.push([s, at(s)]);
    return { L, at, dots };
  })();
  const ac_AL = { X: 180, Y: 240, w: 480, h: 340 }, ac_TC = { X: 1260, Y: 240, w: 480, h: 340 };
  // trade ticket: TAG 220x50, ▲ RED (buy) / ▼ WHITE (sell) at the right end, «شراء|بيع» + lot (Inter). o: ghost, redEdge,
  // rim, flip (0..1 vertical flip of the lot), a
  function ac_chip(x, X, Y, tr, lot, o = {}) {
    const w = 220, h = 50, a = o.a ?? 1; if (a <= 0.003) return;
    x.save(); x.globalAlpha *= a;
    tagPath(x, X, Y, w, h);
    if (o.ghost) { x.fillStyle = INK; x.fill(); x.lineWidth = 1.5; x.strokeStyle = "rgba(255,255,255,0.62)"; x.stroke(); }
    else { x.fillStyle = "#1C1D20"; x.fill(); x.lineWidth = 1.5; x.strokeStyle = o.rim ? rgba(RED, o.rim) : "rgba(255,255,255,0.13)"; x.stroke(); }
    if (o.redEdge) { x.save(); tagPath(x, X, Y, w, h); x.clip(); x.fillStyle = RED; x.fillRect(X + w - 4, Y, 4, h); x.restore(); }
    x.fillStyle = tr.buy ? RED : WHITE; x.strokeStyle = x.fillStyle;
    ac_tri(x, X + w - 30, Y + h / 2, 16, 11, tr.buy);
    const wd = tr.buy ? "شراء" : "بيع";
    T(x, wd, X + w - 50, Y + 36, { w: 400, size: 34 });
    const lx = X + w - 50 - measure(x, wd, 400, 34, AR) - 14;
    const fy = o.flip != null ? Math.abs(Math.cos(Math.PI * o.flip)) : 1;
    x.save(); x.translate(0, Y + 25); x.scale(1, Math.max(0.02, fy)); x.translate(0, -(Y + 25));
    T(x, lot, lx, Y + 36.5, { w: 400, size: 32, fam: LAT, align: "right" });
    x.restore();
    x.restore();
  }
  // cached chip sprites (text shaping is the costly part): one per trade x lot x style, drawn 1:1 at (X - 6, Y - 6)
  const ac_CHIP = {};
  function ac_chipC(x, X, Y, tr, lot, o = {}) {
    const live = (o.flip != null && o.flip > 0 && o.flip < 1);
    if (live) return ac_chip(x, X, Y, tr, lot, o);
    const k = [tr.buy ? 1 : 0, lot, o.ghost ? 1 : 0, o.redEdge ? 1 : 0].join("|");
    let c = ac_CHIP[k];
    if (!c) { // ghosts ride at up to 1.25x, so their sprite is drawn at 1.25x resolution
      const ss = o.ghost ? 1.25 : 1;
      c = ac_CHIP[k] = U.mk(Math.ceil(232 * ss), Math.ceil(74 * ss)); c.x.scale(ss, ss); // room for descenders
      ac_chip(c.x, 6, 6, tr, lot, { ghost: o.ghost, redEdge: o.redEdge });
    }
    const a = o.a ?? 1; if (a <= 0.003) return;
    x.save(); x.globalAlpha *= a; x.drawImage(c, X - 6, Y - 6, 232, 74);
    if (o.rim > 0) { tagPath(x, X, Y, 220, 50); x.lineWidth = 1.5; x.strokeStyle = rgba(RED, o.rim); x.stroke(); }
    x.restore();
  }
  // positions of a list: newest at slot 0 (top y 376); the older chips move down 60 px over [t - 0.05, t + 0.2] (expo) while
  // the new chip reveals (RTL clip) from t - 0.05 too, so the top slot never sits empty (ac_R clips each chip above the
  // next older one, so they never overlap while it moves away); 3 visible
  function ac_list(q, times) {
    return times.map((t0, j) => {
      if (q < t0 - 0.05) return null;
      let pos = 0; for (let k = j + 1; k < times.length; k++) pos += expo(pr(q, times[k] - 0.05, times[k] + 0.2));
      return { y: 376 + 60 * pos, a: cl(3 - pos), kin: expo(pr(q, t0 - 0.05, t0 + 0.25)) };
    });
  }
  // ghost path: centre arc length for trade progress u (0..1), from the arc's start to its end: into the apex node
  // (decelerating), then out of it
  function ac_ghostS(u) {
    const L = ac_ARC.L, S0 = 0, Sa = L / 2, S1 = L;
    return u < 0.5 ? lerp(S0, Sa, eio(u / 0.5)) : lerp(Sa, S1, eio((u - 0.5) / 0.5));
  }
  function ac_R(x, q) {
    const K = ac_K, dout = 0.34, R = ac_TR, xo = ac_out(q, K.R_out, dout);
    const eT = ent(q, K.R_tc, K.R_out, { din: 0.5, dout, rise: 24 }), eA = ent(q, K.R_ac, K.R_out, { din: 0.5, dout, rise: 24 });
    // floor spill under both cards (with their cards); a pulse under the allocation card on every landing
    const sl = [];
    if (eA) {
      let p = 0; for (const tr of R) { const k = pr(q, tr.s + tr.d, tr.s + tr.d + 0.6); if (k > 0 && k < 1) p += 0.22 * (1 - k); }
      sl.push({ u: -2.75, v: -0.6, rx: 1.1, color: RED, a: (0.12 + p) * eA.a });
    }
    if (eT) sl.push({ u: 2.75, v: -0.6, rx: 1.1, color: WHITE, a: 0.1 * eT.a });
    spill(x, sl);
    // ---- the red dotted arc, drawn right to left (the direction of copying)
    const ka = e2(pr(q, K.R_arc, K.R_arc + 0.5));
    if (ka > 0 && xo.a > 0) {
      x.save(); x.globalAlpha *= 0.55 * xo.a; x.translate(0, xo.dy); x.fillStyle = RED; x.beginPath();
      for (const [s, p] of ac_ARC.dots) if (s <= ka * ac_ARC.L) { x.moveTo(p[0] + 1.5, p[1]); x.arc(p[0], p[1], 1.5, 0, Math.PI * 2); }
      x.fill(); x.restore();
    }
    // ---- cards + lists (right first)
    const lists = [
      { e: eT, C: ac_TC, t0: K.R_tc, icon: "candles", title: "حساب التداول", chips: ac_list(q, R.map((r) => r.a)), x10: false },
      { e: eA, C: ac_AL, t0: K.R_ac, icon: "vault", title: "حساب التخصيص", chips: ac_list(q, R.map((r) => r.s + r.d - 0.15)), x10: true }, // the chip reveals from s+d-0.20, as the ghost fades
    ];
    for (const Lc of lists) {
      if (!Lc.e) continue;
      const { X, Y, w, h } = Lc.C, tc = Lc.t0 + 0.12, Xr = X + w - 32;
      ac_push(x, Lc.e, X + w / 2, Y + h / 2);
      card(x, X, Y, w, h, { u: pr(q, Lc.t0, Lc.t0 + 0.5) });
      const kc = ac_in(q, tc);
      x.save(); x.globalAlpha *= cl(kc * 1.3); x.translate(0, (1 - kc) * 10);
      sym(x, Lc.icon, X + 60, 286, 56, { u: pr(q, tc, tc + 0.5) });
      T(x, Lc.title, Xr, 300, { w: 500, size: 42 });
      T(x, "الصفقات", Xr, 350, { w: 400, size: 34, color: GREY });
      x.restore();
      x.save(); x.beginPath(); x.rect(X, 364, w, Y + h - 364 - 8); x.clip();
      Lc.chips.forEach((c, j) => {
        if (!c || c.a <= 0) return;
        const tr = R[j], dxi = (1 - c.kin) * 30, rim = Lc.x10 ? 0.9 * (1 - pr(q, tr.s + tr.d, tr.s + tr.d + 0.5)) : 0;
        // clipped 3 px above the next older chip's top: the new chip opens with the slot instead of overlapping
        const pv = j > 0 ? Lc.chips[j - 1] : null, yb = pv ? Math.max(c.y - 6, Math.min(c.y + 64, pv.y - 3)) : c.y + 64;
        x.save(); x.globalAlpha *= cl(c.kin * 1.4); ac_clipR(x, Xr - 224, Xr + 4, c.y - 6, yb, c.kin);
        ac_chipC(x, Xr - 220 + dxi, c.y, tr, Lc.x10 ? tr.x10 : tr.lot, { a: c.a, redEdge: Lc.x10, rim });
        x.restore();
      });
      x.restore();
      x.restore();
    }
    // ---- apex node: TAG with COPY -> metallic x10; label «نسخ تلقائي» -> «معامل الضرب»
    const kn = pr(q, K.R_node, K.R_node + 0.35);
    if (kn > 0 && xo.a > 0) {
      let fl = 0;
      for (const tr of R) { const tA = tr.s + tr.d / 2, k = pr(q, tA - 0.04, tA + 0.36); if (k > 0 && k < 1) fl = Math.max(fl, 1 - k); }
      const km = pr(q, K.R_x10, K.R_x10 + 0.4), puls = q > K.R_x10 + 0.4 ? 0.5 + 0.5 * Math.sin((2 * Math.PI * (q - K.R_x10 - 0.4)) / 0.9 - Math.PI / 2) : 0;
      const sc = lerp(0.9, 1, expo(kn)) * (1 + 0.05 * fl) * xo.sc;
      x.save(); x.globalAlpha *= cl(kn * 3) * xo.a; x.translate(960, 180 + xo.dy); x.scale(sc, sc); x.translate(-960, -180);
      tag(x, 870, 144, 180, 72, { rim: Math.max(0.95 * fl, 0.35 * puls) });
      const kcopy = 1 - e3(pr(km, 0, 0.45)), kx = e3(pr(km, 0.25, 1));
      if (kcopy > 0) { x.save(); x.translate(960, 180); x.scale(lerp(0.7, 1, kcopy), lerp(0.7, 1, kcopy)); sym(x, "copy", 0, 0, 46, { u: pr(q, K.R_node + 0.05, K.R_node + 0.5), a: kcopy }); x.restore(); }
      if (kx > 0) { const s2 = lerp(1.15, 1, kx); x.save(); x.translate(960, 180); x.scale(s2, s2); x.translate(-960, -180); metal(x, ac_MUL, 960, 203, 64, { align: "center", a: kx }); x.restore(); }
      x.restore();
      // label above the node
      const kl = e3(pr(q, K.R_x10, K.R_x10 + 0.3)), la = cl(kn * 2) * xo.a;
      if (kl < 1) T(x, "نسخ تلقائي", 960, 114 + xo.dy, { w: 400, size: 36, align: "center", a: la * (1 - kl) });
      if (kl > 0) T(x, "معامل الضرب", 960, 114 + xo.dy + (1 - kl) * 8, { w: 400, size: 36, align: "center", a: la * kl });
    }
    // ---- ghosts ride the arc (outside the cards), led by a red comet; drawn over the node so the lot flip
    // reads at the apex, where the ghost is slowest
    x.save(); x.translate(0, xo.dy); x.globalAlpha *= xo.a;
    x.beginPath(); x.rect(0, 0, W, H); x.rect(ac_AL.X, ac_AL.Y - 30, ac_AL.w, ac_AL.h + 60); x.rect(ac_TC.X, ac_TC.Y - 30, ac_TC.w, ac_TC.h + 60); x.clip("evenodd");
    for (const tr of R) {
      const u = pr(q, tr.s, tr.s + tr.d); if (u <= 0 || u >= 1) continue;
      const sg = ac_ghostS(u), sc = lerp(1, 1.25, e3(pr(u, 0.5, 0.64))), [gx, gy] = ac_ARC.at(sg);
      const flip = pr(u, 0.44, 0.56), lot = flip < 0.5 ? tr.lot : tr.x10;
      // the ghost fades in off the trading card's edge and cross-dissolves into its list chip over its last 0.16 s (e3,
      // fast start), so the part cut at the allocation card's edge is at <= .5 alpha once its chip shows
      const gin = eio(pr(q, tr.s, tr.s + 0.08)), ga = gin * (1 - e3(pr(q, tr.s + tr.d - 0.16, tr.s + tr.d)));
      x.save(); x.globalAlpha *= ga; x.translate(gx, gy); x.scale(sc, sc);
      ac_chipC(x, -110, -25, tr, lot, { ghost: true, flip });
      x.restore();
      // comet ahead of the ghost: head r 8, glow r 28, 6 trailing dots (the tail shrinks as it slows into the node); it
      // stops at the arc's end and fades over its last 90 px
      const sp = Math.abs(ac_ghostS(cl(u + 0.01)) - ac_ghostS(cl(u - 0.01))) / (0.02 * tr.d), gap = cl(sp / 160, 0, 9);
      const lead = sg + 110 * sc + 74, sc0 = Math.min(ac_ARC.L, lead), [hx, hy] = ac_ARC.at(sc0);
      const ca = gin * (1 - eio(cl((lead - (ac_ARC.L - 90)) / 90)));
      if (ca > 0.003) {
        x.save(); x.globalAlpha *= ca;
        glow(x, hx, hy, 28, RED, 0.55);
        x.fillStyle = RED; x.beginPath(); x.arc(hx, hy, 8, 0, Math.PI * 2); x.fill();
        for (let k = 1; k <= 6; k++) {
          const [tx, ty] = ac_ARC.at(sc0 - k * gap - 6);
          x.save(); x.globalAlpha *= 0.75 * (1 - k / 7); x.beginPath(); x.arc(tx, ty, lerp(5, 1.6, k / 6), 0, Math.PI * 2); x.fill(); x.restore();
        }
        x.restore();
      }
    }
    x.restore();
    // ---- caption «مثال: مرحلة Seed», centred at the cards' label line, clear of the ghosts' path and above his head
    const kcap = ac_in(q, K.R_cap, 0.4);
    if (kcap > 0 && xo.a > 0) {
      const parts = [{ s: "مثال:" }, { s: "مرحلة" }, { s: "Seed", fam: LAT, size: 32 }], wd = ac_runsW(x, parts, { size: 34 });
      ac_runs(x, parts, 960 + wd / 2, 345 + (1 - kcap) * 14 + xo.dy, { size: 34, color: GREY, a: cl(kcap * 1.3) * xo.a });
    }
  }

  // ================================================================== S · VO 91.04-95.86 · bookmark the word (L2 corner slot)
  function ac_S(x, q) {
    const K = ac_K, e = ent(q, K.S_tag, K.S_out, { din: 0.45, dout: 0.36, rise: 20 });
    if (!e) return;
    ac_push(x, e, 375, 335);
    x.save(); ac_clipR(x, 111, 639, 200, 380, expo(pr(q, K.S_tag, K.S_tag + 0.45))); tag(x, 115, 236, 520, 130, {}); x.restore();
    const kc = ac_in(q, K.S_tag + 0.12);
    x.save(); x.globalAlpha *= cl(kc * 1.3);
    T(x, "معامل الضرب", 595, 318 + (1 - kc) * 12, { w: 500, size: 46 });
    // x10 on «الضرب»: a 4 % pop (back) and a red-edged glint sweeping left to right
    const pg = pr(q, K.S_sheen, K.S_sheen + 0.12), pg2 = pr(q, K.S_sheen + 0.12, K.S_sheen + 0.34);
    const gs = pg2 > 0 ? lerp(1.04, 1, e3(pg2)) : lerp(1, 1.04, back(pg, 1.6));
    const gy0 = 324 + (1 - kc) * 12, gw = metalWidth(ac_MUL, 68);
    x.save(); x.translate(160 + gw / 2, gy0 - 25); x.scale(gs, gs); x.translate(-(160 + gw / 2), -(gy0 - 25));
    ac_glint(x, 156, gy0 - 72, gw + 8, 86, pr(q, K.S_sheen, K.S_sheen + 0.4), (c) => metal(c, ac_MUL, 160, gy0, 68));
    x.restore();
    x.restore();
    // the red flag (bookmark variant, h 56) drops from above and clips onto the tag's top edge (expo, 4 px settle)
    const kf = pr(q, K.S_flag, K.S_flag + 0.32);
    if (kf > 0) {
      const y = lerp(204 - 100, 204, expo(kf)) + 4 * Math.sin(Math.PI * pr(q, K.S_flag + 0.2, K.S_flag + 0.4));
      flag(x, 534, y, 56, { mirror: true, a: cl(kf * 4) });
    }
    // dark pill with a red circle ← under the tag
    const kp = expo(pr(q, K.S_pill, K.S_pill + 0.4));
    if (kp > 0) {
      x.save(); ac_clipR(x, 111, 599, 386, 500, kp); x.translate(0, (1 - kp) * 14);
      pill(x, 115, 400, 480, 70, "في الفيديوهات القادمة", { kind: "dark", circle: true, a: cl(kp * 1.3) });
      x.restore();
    }
    x.restore();
  }

  // ================================================================== T · VO 95.95-102.08 · rule sheet (L1, x >= 1220)
  const ac_ROWS = [440, 510, 580, 650], ac_BARS = [320, 260, 360];
  function ac_Tsheet(x, q) {
    const K = ac_K, e = ent(q, K.T_card, K.T_out, { din: 0.5, dout: 0.16, rise: 24 }); // short exit: row 4 holds 0.5 s
    if (!e) return;
    const X = 1240, Y = 230, w = 580, h = 470, tc = K.T_card + 0.12;
    ac_push(x, e, X + w / 2, Y + h / 2);
    card(x, X, Y, w, h, { u: pr(q, K.T_card, K.T_card + 0.5) });
    // two-tone header (a card header: no flag)
    headline(x, [["قواعد", "g"], ["كل", "w"], ["مرحلة", "w"]], 1780, 300, 46, q, tc, { w: 400 });
    // six stage symbols, DIM, light 01 -> 06 (white + red) with a pop, then settle into their normal library look. Their
    // red element stays: an all-white settle erased the '500' of the Pro 500 tag and turned ▲▲▲ into a tree shape.
    const kc = ac_in(q, tc + 0.1);
    STAGES.forEach((st, i) => {
      const cx = 1760 - 80 * i, cy = 350, tl = K.T_sym + 0.15 * i, kl = pr(q, tl, tl + 0.3);
      const kD = { t: 0, ignite: 1, flagU: 1, grow: 1 };
      if (kl <= 0) { sym(x, st.sym, cx, cy, 40, { dim: true, a: kc, k: kD }); return; }
      const kL = { t: q - tl, ignite: kl, flagU: kl, grow: kl };
      const sc = lerp(1.18, 1, e3(pr(q, tl, tl + 0.25)));
      x.save(); x.translate(cx, cy); x.scale(sc, sc); x.translate(-cx, -cy);
      if (kl < 1) sym(x, st.sym, cx, cy, 40, { dim: true, a: 1 - kl, k: kD });
      sym(x, st.sym, cx, cy, 40, { u: kl, k: kL });
      x.restore();
    });
    // three abstract rule rows (no invented text): slide in 30 px from the right, checks tick red
    const kdim = 1 - 0.6 * e3(pr(q, K.T_row4, K.T_row4 + 0.3));
    for (let r = 0; r < 3; r++) {
      const t0 = K.T_rows + 0.4 * r, ki = expo(pr(q, t0, t0 + 0.35)); if (ki <= 0) continue;
      const cy = ac_ROWS[r], dx = (1 - ki) * 30, tk = t0 + 0.1;
      x.save(); x.globalAlpha *= cl(ki * 1.3) * kdim; x.translate(dx, 0);
      const kt = pr(q, tk, tk + 0.12), sc = kt > 0 ? back(pr(q, tk, tk + 0.25), 1.4) : 1;
      x.save(); x.translate(1769, cy); x.scale(sc, sc); x.translate(-1769, -cy);
      ac_box(x, 1752, cy - 17, 34, 9);
      if (kt > 0) { x.save(); x.globalAlpha *= e3(kt); x.fillStyle = RED; x.fill(); x.restore(); }
      x.lineWidth = 1.5; x.strokeStyle = kt > 0 ? RED : "rgba(255,255,255,0.35)"; x.stroke();
      x.restore();
      ac_tick(x, 1769, cy, 8.5, pr(q, tk + 0.05, tk + 0.3));
      rr(x, 1730 - ac_BARS[r], cy - 7, ac_BARS[r], 14, 7); x.fillStyle = TRACK; x.fill();
      x.restore();
    }
    // row 4 in focus: red '!' box, shield, «حدّ الانعكاس», importance bar at the card's left edge
    const k4 = expo(pr(q, K.T_row4, K.T_row4 + 0.3));
    if (k4 > 0) {
      const cy = ac_ROWS[3];
      x.save(); x.globalAlpha *= cl(k4 * 1.4); x.translate((1 - k4) * 30, 0);
      const sc = back(pr(q, K.T_row4, K.T_row4 + 0.22), 1.4);
      x.save(); x.translate(1769, cy); x.scale(sc, sc); x.translate(-1769, -cy);
      ac_box(x, 1752, cy - 17, 34, 9); x.fillStyle = RED; x.fill();
      x.fillStyle = WHITE; rr(x, 1767.5, cy - 10, 3, 13, 1.5); x.fill(); x.beginPath(); x.arc(1769, cy + 8, 2, 0, Math.PI * 2); x.fill();
      x.restore();
      sym(x, "shield", 1300, cy, 40, { u: pr(q, K.T_row4, K.T_row4 + 0.4) });
      T(x, "حدّ الانعكاس", 1730, 663, { w: 500, size: 38 });
      x.restore();
      const kb = e3(pr(q, K.T_row4 + 0.04, K.T_row4 + 0.26));
      x.fillStyle = RED; x.fillRect(1244, cy - 20 * kb, 4, 40 * kb);
    }
    x.restore();
  }

  // ================================================================== U · VO 102.15-108.00 · don't cross the line (VC WIDE)
  // candles in screen px [open, close, high, low] (pitch 40, body 20, x 200..640): six steady, five stepping down to the
  // limit (the last red wick stops 8 px above the line at y 600), then the white recovery candle
  const ac_UC = [
    [410, 392, 380, 420], [392, 404, 386, 412], [404, 386, 376, 410], [386, 398, 380, 404], [398, 384, 374, 404],
    [384, 392, 378, 398], [392, 440, 386, 448], [440, 476, 434, 484], [476, 462, 452, 486], [462, 528, 458, 536],
    [528, 582, 522, 592], [582, 534, 528, 590],
  ];
  const ac_Ust = (i) => (i < 6 ? ac_K.U_chart + 0.12 + i * 0.05 : i < 11 ? ac_K.U_down + (i - 6) * 0.15 : ac_K.U_rec);
  function ac_U(x, q) {
    const K = ac_K;
    if (q < K.U_head) return;
    const xA = ac_out(q, K.U_out, 0.3), xC = ac_out(q, K.U_chartOut, 0.3), xN = ac_out(q, K.U_tenOut, 0.3);
    // two-tone headline, centred in the top band (no flag)
    if (xA.a > 0) {
      const words = [["ألّا", "g"], ["يصل", "g"], ["انعكاس", "w"], ["حساب", "w"], ["التخصيص", "w"]];
      const tw = words.reduce((s, [wd]) => s + measure(x, wd, 300, 52, AR), 0) + 0.28 * 52 * (words.length - 1);
      x.save(); x.translate(0, xA.dy);
      headline(x, words, 960 + tw / 2, 170, 52, q, K.U_head, { w: 300, a: xA.a });
      x.restore();
    }
    // left chart: corner marks + dotted sides, dashed red −10% limit line, candles stepping down, recovery
    if (q >= K.U_chart && xC.a > 0) {
      const CX = 150, CY = 330, CW = 540, CH = 320;
      x.save(); x.globalAlpha *= xC.a; x.translate(420, 490 + xC.dy); x.scale(xC.sc, xC.sc); x.translate(-420, -490);
      corners(x, CX, CY, CW, CH, { L: 22, u: pr(q, K.U_chart, K.U_chart + 0.45), u2: pr(q, K.U_chart + 0.35, K.U_chart + 0.65), mid: 400 });
      const kl = e3(pr(q, K.U_lim, K.U_lim + 0.35));
      if (kl > 0) {
        let la = 0.75;
        for (let p = 0; p < 3; p++) { const k = pr(q, K.U_pulse + 0.15 * p, K.U_pulse + 0.15 * (p + 1)); if (k > 0 && k < 1) la = 0.5 + 0.5 * Math.sin(Math.PI * k); }
        x.save(); x.globalAlpha *= la; x.strokeStyle = RED; x.lineWidth = 2; x.setLineDash([8, 6]);
        x.beginPath(); x.moveTo(CX + CW - 6, 600); x.lineTo(lerp(CX + CW - 6, CX + 6, kl), 600); x.stroke(); x.restore();
        T(x, "−10%", 160, 590, { w: 500, size: 30, fam: LAT, color: RED, a: e3(pr(q, K.U_lim + 0.15, K.U_lim + 0.4)) });
      }
      ac_UC.forEach((c, i) => {
        const g = pr(q, ac_Ust(i), ac_Ust(i) + 0.3); if (g <= 0) return;
        candle(x, 200 + 40 * i, c[0], c[1], c[2], c[3], 20, { grow: g, newest: i === 11 });
      });
      x.restore();
    }
    // metallic 10% in the right third (scale 1.04 -> 1, bottom fade), one sheen; the footnote under it in two lines
    if (xN.a > 0) {
      x.save(); x.globalAlpha *= xN.a; x.translate(1615, 400 + xN.dy); x.scale(xN.sc, xN.sc); x.translate(-1615, -400);
      const kt = pr(q, K.U_ten, K.U_ten + 0.45);
      if (kt > 0) {
        const s = lerp(1.04, 1, expo(kt));
        x.save(); x.globalAlpha *= cl(kt * 2.2); x.translate(1615, 345); x.scale(s, s); x.translate(-1615, -345);
        metal(x, "10%", 1800, 430, 240, { align: "right", fade: true, sheen: pr(q, K.U_sheen, K.U_sheen + 0.45) });
        x.restore();
      }
      const kf = e2(pr(q, K.U_foot, K.U_foot + 0.3));
      if (kf > 0) {
        T(x, "* قد تختلف النسبة حسب المرحلة", 1800, 494, { w: 300, size: 34, color: GREY, a: 0.85 * kf });
        T(x, "وفق شروط البرنامج", 1800, 540, { w: 300, size: 34, color: GREY, a: 0.85 * kf });
      }
      x.restore();
    }
  }
  // floor: the dashed red limit ring (24 floorP arcs of 10° with 5° gaps, R 1.15 m, 0.05 m wide), drawn clockwise from
  // the front, with a soft white pool inside; both exit 105.20-105.50, before the push
  function ac_floorU(q, sh) {
    const K = ac_K, xo = ac_out(q, K.U_out, 0.3).a;
    if (q < K.U_ring || xo <= 0) return;
    sh.push(fPool(0.12 * e2(pr(q, K.U_ring, K.U_ring + 0.5)) * xo, "#ffffff", 1.15));
    const u = e2(pr(q, K.U_ring, K.U_ring + 0.7)) * 360, R = 1.15, hw = 0.025;
    const P = (deg, r) => { const th = (deg * Math.PI) / 180; return floorP(-r * Math.sin(th), -r * Math.cos(th)); };
    for (let i = 0; i < 24; i++) {
      const a0 = i * 15; if (u <= a0) break;
      const a1 = Math.min(a0 + 10, u), pts = [];
      for (let j = 0; j <= 4; j++) pts.push(P(lerp(a0, a1, j / 4), R + hw));
      for (let j = 4; j >= 0; j--) pts.push(P(lerp(a0, a1, j / 4), R - hw));
      sh.push({ type: "poly", pts, color: RED, a: 0.8 * xo });
    }
  }

  // ================================================================== register
  GROUPS.push({
    name: "accounts",
    floor(t, sh, S) {
      const q = t - P;
      if (q >= 84.6 && q < 86.0) fRipple(sh, t, v(ac_K.R_rip));
      if (q >= 102.1 && q < 105.6) ac_floorU(q, sh);
    },
    async draw(x, t, S) {
      const q = t - P;
      if (q < 68.0 || q > 108.1) return;
      const sh = S.shot || {}, vc = !!sh.k_vcam, clip = sh.clip;
      if (q < 78.04) { if (vc) { if (q < 70) await im("axi_part_white.png"); await ac_O(x, q); } } // preload the wordmark while HOME is clean
      else if (q < 79.0) { if (clip === "L2") ac_P(x, q); }
      else if (q < 84.68) { if (clip === "L3") ac_Q(x, q); }
      else if (q < 91.04) { if (vc) ac_R(x, q); }
      else if (q < 95.96) { if (clip === "L2") ac_S(x, q); }
      else if (q < 102.16) { if (clip === "L1") ac_Tsheet(x, q); }
      else if (vc) ac_U(x, q);
    },
  });

  // ================================================================== B-ROLLS 1 + 2 (group "broll", prefix br_): full-screen motion graphics
  // B-roll 1, VO 8.84-14.88 (frames 296-446): the DARK pill «افتح حساب تداول» is clicked and morphs into the chamfered
  //   «حساب تداول» card, its red disc becoming the scene's one flag. The official logo builds in the name field, the axi
  //   wordmark in the company field and «نشط» in the status field. The view then dives into the card's chart: page 7's
  //   edge marker grows into the price tab, the flag travels to «تداول بالشكل الاعتيادي», BUY and SELL tickets ride their
  //   candles, and a tall white candle punches into the hard cut.
  // B-roll 2, VO 64.62-68.10 (frames 1690-1776): a live chart over the dotted funded-capital line builds a profit zone; on
  //   «وسحب» the zone lifts off and flies into «حصّتك من الأرباح» as a split bar that fills red to «حتى» 80% «لك» / Axi,
  //   the footnote keeps it accurate, and the RED pill «سحب الأرباح» is pressed into the hard cut.
  // World: pure #000 (the special's black: no INK base and no lift, so the black matches the studio shots at all four cuts),
  //   lit only by the designed elements: the ◢ floor world (horizon y 610, f 1000, camera 1.6 m, dolly 1.2 m/s), a horizon
  //   haze and candle bokeh on the horizon, plus a slow drift (+0.5 %/s about the centre). Both scenes open and close on hard
  //   cuts at full opacity. Every exit inside them is an in-out fade that loses at most 14.3 % opacity in any one frame:
  //   smoothstep over 0.42 s (eio's in-out shape at half its peak slope; eio itself peaks at 3x linear and would need
  //   0.8 s), or linear over 0.28 s where the beat is shorter. Nothing below y 950.
  const br_SPR = {};
  // the exit curve: smoothstep, an in-out like eio with half its peak slope (1.5x linear), so over 0.42 s no frame
  // moves more than 14.3 %
  const br_ss = (p) => { p = cl(p); return p * p * (3 - 2 * p); };
  // an up candle's colour from the newest white (UPC2, k 0) to the older grey (UPC, k 1)
  const br_upc = (k) => `rgb(${Math.round(lerp(230, 138, k))},${Math.round(lerp(231, 137, k))},${Math.round(lerp(233, 138, k))})`;

  // ------------------------------------------------------------------ word onsets (VO s)
  // Snapped to the final voice (audio/vo/vo1_clean_v4.wav). work/words_v4.json gives the order, but whisper opens each
  // word where the previous one ends and so swallows the pauses; every onset was re-read from a 10 ms phonetic view of
  // the voice (level, voicing, /s/ energy). Real gaps, where the hits and SFX sit, in [ ]:
  // B-roll 1: [8.81-8.90] ستقوم 8.91 · بفتح 9.32 · حساب 9.78 (after the /t/ closure 9.72-9.74) · تداول 10.17 · اسمه 10.60 ·
  //   Axi 11.06 · Select 11.36 · [11.71-11.76] مع 11.77 · شركة 11.91 · Axi 12.30 · [12.64-12.67] وبدء 12.68 · التداول 12.93 ·
  //   عليه 13.41 · بالشكل 13.75 · [14.04-14.10] الاعتيادي 14.11 · [14.79-15.01]
  // B-roll 2: [64.68-64.95] يمكنك 64.96 · التداول 65.40 · به 65.89 · [66.19-66.33] وسحب 66.35 · نسبة 66.60 · محدّدة 66.94 ·
  //   من 67.44 · الأرباح 67.62 (its /b/ closure 67.98-68.00) · [68.17-]
  const br_K1 = {
    circle: 8.86, arrow: 8.96, pill: 9.22, label: 9.30, cur: 9.28, click: 9.70, morph: 9.76,
    head: 10.10, div: 10.18, sub: 10.25, well: 10.14, cdl: 10.20, fld: 10.28,
    logo: 11.02, sk2: 12.04, mark: 12.12, sk3: 12.18, stat: 12.22,
    zoom: 12.64, tab: 12.84, head2: 13.00,
    live: [13.20, 13.50, 13.80, 14.10, 14.40, 14.70], buy: 13.35, chev: 13.90, sell: 14.05, snap: 14.76,
  };
  const br_K2 = {
    head: 64.66, prints: [64.75, 64.92, 65.09, 65.26, 65.43, 65.60, 65.77], plbl: 65.40,
    lift: 66.24, panel: 66.46, fly: 66.62, fill: 67.02, foot: 67.00, lbl: 67.18, pill: 67.42, press: 67.94,
  };
  const br_S = {
    open: "افتح حساب تداول", f1: "اسم الحساب", f2: "الشركة", f3: "الحالة", active: "نشط", buy: "شراء", sell: "بيع",
    acct: [["حساب", "w"], ["تداول", "w"]], h1: [["تداول", "w"], ["بالشكل", "g"], ["الاعتيادي", "g"]],
    h2: [["تداول", "w"], ["برأس", "g"], ["المال", "g"], ["المموَّل", "g"]], fund: "رأس المال المموَّل", profit: "الأرباح",
    share: [["حصّتك", "w"], ["من", "w"], ["الأرباح", "w"]], upto: "حتى", you: "لك", cta: "سحب الأرباح",
    foot: [{ s: "* حسب المرحلة،" }, { s: "0%", lat: true }, { s: "في مرحلة" }, { s: "Seed", lat: true }],
  };

  // ------------------------------------------------------------------ chart data (time runs left to right)
  function br_ser(c0, open0, seed, wv) {
    return c0.map((c, i) => {
      const o = i ? c0[i - 1] : open0;
      return { o, c, h: Math.max(o, c) + 0.008 + hash(seed, i, 2) * wv, l: Math.min(o, c) - 0.008 - hash(seed, i, 3) * wv };
    });
  }
  // B-roll 1: 0-11 enter from the left on the zoom, 12-27 fill the card's well, 28-32 print live (28 is the BUY dip, 30 the
  // SELL high), 33 is the final punch
  const br_D1 = br_ser([0.22, 0.25, 0.23, 0.27, 0.30, 0.28, 0.31, 0.34, 0.33, 0.37, 0.35, 0.38,
    0.41, 0.39, 0.43, 0.46, 0.44, 0.47, 0.51, 0.48, 0.45, 0.49, 0.53, 0.55, 0.58, 0.60, 0.58, 0.62,
    0.55, 0.60, 0.66, 0.63, 0.68, 0.86], 0.24, 31, 0.04);
  br_D1[33].h = 0.875; br_D1[33].l = 0.672;
  // B-roll 2: 0-17 trade sideways on the funding line (p .312 = y 640), 18-24 print and climb
  const br_D2 = br_ser([0.30, 0.35, 0.39, 0.33, 0.28, 0.31, 0.36, 0.40, 0.35, 0.30, 0.25, 0.29, 0.34, 0.38, 0.33, 0.27, 0.29, 0.32,
    0.38, 0.45, 0.43, 0.52, 0.60, 0.67, 0.74], 0.31, 37, 0.025);
  // the live candle breathes ±6 px: a new offset every 0.5 s, eased in over 0.25 s
  function br_breath(t, seed, amp = 6) {
    const n = Math.floor(t / 0.5), f = t / 0.5 - n;
    return lerp((hash(seed, n, 5) * 2 - 1) * amp, (hash(seed, n + 1, 5) * 2 - 1) * amp, e3(cl(f / 0.5)));
  }

  // ------------------------------------------------------------------ the world
  // ◢ floor world: marks every 1.2 m (X ±24 m, Z cz+3.2 .. cz+40), sx = 960 + 1000X/d, sy = 610 + 1600/d. The mark is the
  // page 4-5 texture's ◢ at its measured proportion (9 px on a 57 px pitch = 0.19 m on 1.2 m) and its alpha ladder
  // (.27 .23 .19 .16 .12, then nothing) runs from the near rows to 40 m. On a flat floor depth is a function of screen y,
  // so the ladder is one vertical gradient and the whole field is ONE path and ONE fill (no banding pops while the rows
  // stream in). It fades out over y 860-940 (<= 952 on screen at the 1.03 drift) so the subtitle band stays clean.
  const br_LAD = [[5, 0.27], [12, 0.23], [19, 0.19], [26, 0.16], [33, 0.12], [40, 0]];
  function br_ladder(d) {
    if (d <= br_LAD[0][0]) return br_LAD[0][1];
    for (let i = 1; i < br_LAD.length; i++) if (d <= br_LAD[i][0]) return lerp(br_LAD[i - 1][1], br_LAD[i][1], (d - br_LAD[i - 1][0]) / (br_LAD[i][0] - br_LAD[i - 1][0]));
    return 0;
  }
  function br_floorFill(x) {
    if (br_SPR.fg && br_SPR.fgx === x) return br_SPR.fg;
    const g = x.createLinearGradient(0, 610, 0, 1080);
    g.addColorStop(0, rgba(RED, 0));
    for (const sy of [640, 650, 655, 662, 670, 680, 692, 707, 726, 750, 780, 820, 860, 880, 900, 920, 940]) {
      const a = br_ladder(1600 / (sy - 610)) * cl((940 - sy) / 80);
      g.addColorStop((sy - 610) / 470, rgba(RED, a.toFixed(4)));
    }
    g.addColorStop(1, rgba(RED, 0));
    br_SPR.fgx = x;
    return (br_SPR.fg = g);
  }
  function br_floor(x, cz) {
    const st = 1.2, s = 0.19, k0 = Math.ceil((cz + 3.2) / st), k1 = Math.floor((cz + 40) / st);
    x.beginPath();
    for (let k = k0; k <= k1; k++) {
      const d1 = k * st - cz, d2 = d1 + s, y1 = 610 + 1600 / d1, y2 = 610 + 1600 / d2;
      if (y2 > 942) continue;
      const f1 = 1000 / d1, f2 = 1000 / d2;
      for (let j = -20; j < 20; j++) {
        const X0 = j * st + 0.6 - s / 2, xa = 960 + X0 * f1, xb = 960 + (X0 + s) * f1;
        if (xb < -8 || xa > W + 8) continue;
        x.moveTo(xa, y1); x.lineTo(xb, y1); x.lineTo(960 + (X0 + s) * f2, y2); x.closePath();
      }
    }
    x.fillStyle = br_floorFill(x); x.fill();
  }
  function br_haze(x) { // faint white horizon haze, cached ellipse 1800 x 120 at alpha .06
    let c = br_SPR.hz;
    if (!c) {
      c = br_SPR.hz = U.mk(512, 64);
      c.x.save(); c.x.scale(1, 0.125);
      const g = c.x.createRadialGradient(256, 256, 0, 256, 256, 256);
      g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.45, "rgba(255,255,255,0.4)"); g.addColorStop(1, "rgba(255,255,255,0)");
      c.x.fillStyle = g; c.x.fillRect(0, 0, 512, 512); c.x.restore();
    }
    x.save(); x.globalAlpha *= 0.06; x.drawImage(c, 60, 550, 1800, 120); x.restore();
  }
  // candle bokeh band on the horizon (pages 3/7): two layers blurred ONCE at init (far 24 px / .30, near 10 px / .45),
  // 70 % white, 10 % grey, 20 % red, candles standing on a gently rising diagonal; drifting left 12 and 30 px/s. The
  // layers are cropped to their content (layer y 70-300) and blitted 1:1 at whole-pixel offsets outside the drift
  // transform: in this software raster a filtered full-width draw costs ~25 ms, a plain blit a fraction of it
  function br_bokehLayer(k, blur, seed, n, wb) { // (blurred at 1/4 size, then scaled up once: a fast init)
    if (br_SPR[k]) return br_SPR[k];
    const bw = 2400, bh = 230, q = 4, c = (br_SPR[k] = U.mk(bw, bh)), s = U.mk(bw / q, bh / q);
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
  function br_bokeh(x, lt, y) {
    for (const [k, blur, al, sp, seed, n, wb] of [["bkF", 24, 0.3, 12, 81, 54, 18], ["bkN", 10, 0.45, 30, 83, 30, 13]]) {
      const c = br_bokehLayer(k, blur, seed, n, wb);
      x.save(); x.globalAlpha *= al; x.drawImage(c, Math.round(-140 - lt * sp), y + 70); x.restore();
    }
  }

  // ------------------------------------------------------------------ helpers
  const br_press = (x, pz, cx = 942, cy = 540) => { if (pz < 1) { x.translate(cx, cy); x.scale(pz, pz); x.translate(-cx, -cy); } };
  // polyline -> n points evenly spaced by arc length (both ends kept)
  function br_rs(P, n) {
    const L = [0];
    for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const tot = L[L.length - 1], out = [];
    let j = 1;
    for (let i = 0; i < n; i++) {
      const s = n === 1 ? 0 : (tot * i) / (n - 1);
      while (j < P.length - 1 && L[j] < s) j++;
      const u = tot > 0 ? cl((s - L[j - 1]) / (L[j] - L[j - 1] || 1)) : 0;
      out.push([lerp(P[j - 1][0], P[j][0], u), lerp(P[j - 1][1], P[j][1], u)]);
    }
    return out;
  }
  const br_poly = (x, P) => { x.beginPath(); P.forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]))); x.closePath(); };
  // the mirrored page-6 flag (vertical edge on the right) in a unit-height box, clockwise from its top-right corner
  const br_FLAG = br_rs([[0.74, 0], [0.74, 1], [0.629, 1], [0, 0.36], [0, 0], [0.74, 0]], 49).slice(0, 48);
  // the red disc (centre cx, cy, diameter d) morphing (fk) into the mirrored flag of height h at FX, FY
  function br_dotFlag(x, cx, cy, d, fk, FX, FY, h) {
    if (d <= 0.5 && fk <= 0) return;
    if (fk >= 1) { flag(x, FX, FY, h, { mirror: true }); return; }
    x.save(); x.fillStyle = RED;
    if (fk <= 0) { x.beginPath(); x.arc(cx, cy, d / 2, 0, Math.PI * 2); }
    else {
      x.beginPath();
      for (let i = 0; i < 48; i++) {
        const th = -Math.PI / 4 + (i / 48) * Math.PI * 2, ax = cx + (d / 2) * Math.cos(th), ay = cy + (d / 2) * Math.sin(th);
        const px = lerp(ax, FX + br_FLAG[i][0] * h, fk), py = lerp(ay, FY + br_FLAG[i][1] * h, fk);
        i ? x.lineTo(px, py) : x.moveTo(px, py);
      }
      x.closePath();
    }
    x.fill(); x.restore();
  }
  // ← centred at cx, cy (len px), 3 px round strokes, drawn on by u (shaft first, then the head)
  function br_arrow(x, cx, cy, len, u, color) {
    if (u <= 0) return;
    const hl = len * 0.34, x0 = cx + len / 2, x1 = cx - len / 2, us = e2(cl(u / 0.65)), uh = e2(cl((u - 0.5) / 0.5));
    x.save(); x.strokeStyle = color; x.lineWidth = 3; x.lineCap = "round"; x.lineJoin = "round";
    x.beginPath(); x.moveTo(x0, cy); x.lineTo(lerp(x0, x1, us), cy); x.stroke();
    if (uh > 0) { x.beginPath(); x.moveTo(x1 + hl * uh, cy - hl * uh); x.lineTo(x1, cy); x.lineTo(x1 + hl * uh, cy + hl * uh); x.stroke(); }
    x.restore();
  }
  // pill -> card: a rounded rect (radius r) whose top-right corner blends (k) from round into the 45° chamfer c
  function br_mpath(x, X, Y, w, h, r, c, k) {
    r = Math.min(r, w / 2, h / 2);
    x.beginPath(); x.moveTo(X + r, Y);
    for (let i = 0; i <= 12; i++) {
      const q = i / 12, th = -Math.PI / 2 + (q * Math.PI) / 2;
      const ax = X + w - r + r * Math.cos(th), ay = Y + r + r * Math.sin(th), bx = X + w - c + c * q, by = Y + c * q;
      x.lineTo(lerp(ax, bx, k), lerp(ay, by, k));
    }
    x.lineTo(X + w, Y + h - r); x.arcTo(X + w, Y + h, X + w - r, Y + h, r);
    x.lineTo(X + r, Y + h); x.arcTo(X, Y + h, X, Y + h - r, r);
    x.lineTo(X, Y + r); x.arcTo(X, Y, X + r, Y, r);
    x.closePath();
  }
  // its fill blends (f) from the DARK pill (#303133, 1 px .07 border) to the flat PANEL (#131417 .96, 1.5 px hairline)
  function br_body(x, X, Y, w, h, r, c, k, f) {
    br_mpath(x, X, Y, w, h, r, c, k);
    x.fillStyle = PANEL; x.fill();
    if (f < 1) { x.save(); x.globalAlpha *= 1 - f; x.fillStyle = DARKPILL; x.fill(); x.restore(); }
    x.lineWidth = lerp(1, 1.5, f); x.strokeStyle = `rgba(255,255,255,${lerp(0.07, 0.1, f).toFixed(3)})`; x.stroke();
  }
  // skeleton bar (#2A2B2F, r 8) with a shimmer band moving right to left every 0.9 s
  function br_skel(x, X, Y, w, h, t, a) {
    x.save(); x.globalAlpha *= a;
    rr(x, X, Y, w, h, 8); x.fillStyle = TRACK; x.fill(); x.clip();
    const bx = X + w + 90 - ((t % 0.9) / 0.9) * (w + 180), g = x.createLinearGradient(bx - 90, 0, bx + 90, 0);
    g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, "rgba(255,255,255,0.07)"); g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g; x.fillRect(bx - 90, Y, 180, h);
    x.restore();
  }
  // the status field: DARK pill 150 x 56 with «نشط» and a 10 px red dot pulsing on a 1.0 s period
  function br_status(x, X, Y, t, a) {
    const w = 150, h = 56, cy = Y + h / 2;
    x.save(); x.globalAlpha *= a;
    rr(x, X, Y, w, h, h / 2); x.fillStyle = DARKPILL; x.fill(); x.lineWidth = 1; x.strokeStyle = "rgba(255,255,255,0.07)"; x.stroke();
    const tw = measure(x, br_S.active, 400, 34, AR), x0 = X + (w - (tw + 22)) / 2, dx = x0 + tw + 17, ph = (t % 1) / 1;
    x.fillStyle = RED; x.beginPath(); x.arc(dx, cy, 5, 0, Math.PI * 2); x.fill();
    x.save(); x.globalAlpha *= 0.65 * (1 - ph); x.strokeStyle = RED; x.lineWidth = 1.5;
    x.beginPath(); x.arc(dx, cy, 5 + 9 * e3(ph), 0, Math.PI * 2); x.stroke(); x.restore();
    T(x, br_S.active, x0 + tw, cy + 12, { w: 400, size: 34 });
    x.restore();
  }
  // a ticking price in fixed cells (digit .62 em, '.' .28 em) centred at cx, so it never jitters
  function br_tnum(x, s, cx, Y, size, w, a) {
    const cw = (ch) => (ch === "." ? 0.28 : 0.62) * size;
    let tot = 0; for (const ch of s) tot += cw(ch);
    let xx = cx - tot / 2;
    x.save(); x.globalAlpha *= a; font(x, w, size, LAT); x.direction = "ltr"; x.textAlign = "center"; x.textBaseline = "alphabetic"; x.fillStyle = WHITE;
    for (const ch of s) { const c = cw(ch); x.fillText(ch, xx + c / 2, Y); xx += c; }
    x.restore();
  }
  // page 7's edge marker (a 6 px RED bar on the right edge at the last close) growing (ut) into the RED TAG price tab
  // (110 x 40, Inter 500 24 white), riding the close
  function br_edgeTab(x, ex, y, ub, ut, price) {
    if (ub <= 0) return;
    const w = lerp(6, 110, ut), h = lerp(24, 40, ut) * ub, X = lerp(ex - 3, ex + 8, ut), Y = y - h / 2, k = ut;
    x.save(); x.fillStyle = RED; x.beginPath();
    x.moveTo(X + 0.355 * h * k, Y); x.lineTo(X + w, Y); x.lineTo(X + w, Y + h - 0.43 * h * k); x.lineTo(X + w - 0.35 * h * k, Y + h);
    x.lineTo(X, Y + h); x.lineTo(X, Y + 0.43 * h * k); x.closePath(); x.fill();
    x.restore();
    const ta = pr(ut, 0.55, 1);
    if (ta > 0) br_tnum(x, price, X + w / 2 + 1, y + 8.7, 24, 500, ta);
  }
  // BUY / SELL ticket: a 14 px white ring on the candle's close (plus one echo) and a dark TAG chip 150 x 56 below (BUY,
  // RED ▲ pointing up at it) or above (SELL, white ▼ pointing down at it) its candle, riding it as the chart scrolls
  function br_ticket(x, vo, t0, cx, q, yOf, buy, ea) {
    if (vo < t0 || ea <= 0.003) return;
    const u = pr(vo, t0, t0 + 0.28), yc = yOf(q.c), ue = pr(vo, t0, t0 + 0.5);
    x.save(); x.globalAlpha *= ea; x.strokeStyle = WHITE; x.lineWidth = 2;
    x.save(); x.globalAlpha *= cl(u * 4); x.beginPath(); x.arc(cx, yc, 14 * back(u, 1.4), 0, Math.PI * 2); x.stroke(); x.restore();
    if (ue < 1) { x.save(); x.globalAlpha *= 0.5 * (1 - ue); x.beginPath(); x.arc(cx, yc, 14 + 24 * e3(ue), 0, Math.PI * 2); x.stroke(); x.restore(); }
    const uc = expo(pr(vo, t0 + 0.04, t0 + 0.44)), CW = 150, CH = 56, X = cx - 28 - CW / 2;
    const Y = (buy ? yOf(q.l) + 22 : yOf(q.h) - 22 - CH) + 12 * (1 - uc);
    x.globalAlpha *= cl(uc * 1.4);
    tag(x, X, Y, CW, CH, {});
    const s = buy ? br_S.buy : br_S.sell, tw = measure(x, s, 400, 34, AR), x0 = X + (CW - (tw + 30)) / 2 + 4, gx = x0 + tw + 22, gy = Y + CH / 2;
    x.fillStyle = buy ? RED : WHITE; x.strokeStyle = x.fillStyle; x.lineJoin = "round"; x.lineWidth = 2; x.beginPath();
    if (buy) { x.moveTo(gx, gy - 6); x.lineTo(gx + 8, gy + 5); x.lineTo(gx - 8, gy + 5); } else { x.moveTo(gx, gy + 6); x.lineTo(gx + 8, gy - 5); x.lineTo(gx - 8, gy - 5); }
    x.closePath(); x.fill(); x.stroke();
    T(x, s, x0 + tw, gy + 12, { w: 400, size: 34 });
    x.restore();
  }
  // two-tone headline (page 5) as the kit's headline(), except that each word's reveal mask reaches 0.45 em past its left
  // end and 0.62 em + the 18 px rise below the baseline, and is dropped once the word has landed: Alexandria's final yeh /
  // hah swash and dots overhang the advance box and the yeh's dots reach ~0.55 em down, so nothing is cut while rising
  function br_headline(x, words, X, Y, size, t, t0, o = {}) {
    if (t < t0) return 0;
    const wgt = o.w ?? 300, a = o.a ?? 1;
    let xx = X;
    if (o.flag) flag(x, X + size * 0.5, Y - size * 0.81, o.flagH ?? Math.max(18, Math.round(size * 0.35)), { mirror: true, u: pr(t, t0, t0 + 0.22), a });
    words.forEach(([s, c], i) => {
      const mw = measure(x, s, wgt, size, AR), k = e4(pr(t, t0 + 0.05 + i * 0.07, t0 + 0.47 + i * 0.07));
      if (k > 0) {
        x.save();
        if (k < 1) { x.beginPath(); x.rect(xx - mw - 0.45 * size, Y - size * 1.2, mw + 0.45 * size + 8, size * 1.82 + 18); x.clip(); }
        T(x, s, xx, Y + (1 - k) * 18, { w: wgt, size, color: c === "g" ? GREY : WHITE, a: a * k });
        x.restore();
      }
      xx -= mw + size * 0.28;
    });
    return X - xx;
  }
  // a mixed RTL line from the right edge X: Arabic runs RTL in Alexandria (so '*' and '،' sit on their side), Latin
  // runs LTR in Inter at 32 px, laid out right to left in reading order
  function br_runs(x, parts, X, Y, o) {
    let xx = X;
    for (const p of parts) {
      const fam = p.lat ? LAT : AR, size = p.lat ? 32 : 34, wgt = 300, mw = measure(x, p.s, wgt, size, fam);
      if (p.lat) T(x, p.s, xx - mw, Y, { w: wgt, size, fam, color: o.color, a: o.a, align: "left" });
      else T(x, p.s, xx, Y, { w: wgt, size, fam, color: o.color, a: o.a });
      xx -= mw + 10;
    }
    return X - xx;
  }

  // ================================================================== B-ROLL 1
  async function br_roll1(x, vo) {
    const K = br_K1, D = br_D1;
    const uP = expo(pr(vo, K.pill, K.pill + 0.35)), uM = expo(pr(vo, K.morph, K.morph + 0.5)), uZ = expo(pr(vo, K.zoom, K.zoom + 0.6));
    const out = br_ss(pr(vo, K.zoom, K.zoom + 0.42)), cA = 1 - out, cdx = 60 * out; // the card leaves: 60 px right + fade
    const occA = 1 - br_ss(pr(vo, K.zoom + 0.2, K.zoom + 0.62)); // the fields' occluder: its own later, soft tail
    const pt = vo - K.click, pz = pt >= 0 && pt < 0.08 ? 0.96 : 1; // click: .96 for 2 frames

    // ---- 1. the DARK pill extends leftward out of the disc on «بفتح», then morphs into the card on «حساب»
    if (cA > 0.003 && vo >= K.pill) {
      let X = lerp(1144, 640, uP), Y = lerp(492, 488, uP), w = lerp(96, 604, uP), h = lerp(96, 104, uP), r = h / 2;
      if (uM > 0) { X = lerp(X, 360, uM); Y = lerp(Y, 190, uM); w = lerp(w, 1200, uM); h = lerp(h, 640, uM); r = lerp(r, 12, uM); }
      x.save(); x.globalAlpha *= cA; x.translate(cdx, 0); br_press(x, pz);
      br_body(x, X, Y, w, h, r, 48 * uM, uM, uM);
      const lu = pr(vo, K.click, K.click + 0.28), la = 1 - lu, ul = e4(pr(vo, K.label, K.label + 0.42)); // leaves on the click
      if (la > 0 && ul > 0) { // «افتح حساب تداول» (358 px) reveals right to left; the mask is dropped once revealed
        x.save(); if (ul < 1) { x.beginPath(); x.rect(1124 - 392 * ul, 480, 392 * ul + 10, 124); x.clip(); }
        T(x, br_S.open, 1124, 556 + 10 * (1 - ul) - 10 * lu, { w: 400, size: 46, a: la * cl(ul * 1.5) });
        x.restore();
      }
      x.restore();
    }

    // ---- 2. the chart: the card's well (x 420-920, y 410-780) zooms into the full-screen frame (x 260-1660, y 250-880)
    let over = null; // brackets, edge marker / price tab and ▲▲▲: drawn over the card occluder below
    if (vo >= K.well) {
      const F = { x: lerp(420, 260, uZ), y: lerp(410, 250, uZ), w: lerp(500, 1400, uZ), h: lerp(370, 630, uZ) };
      const sn = 10 * e3(pr(vo, K.snap, K.snap + 0.1)), L = lerp(18, 28, uZ);
      const u1 = pr(vo, K.well, K.well + 0.45), u2 = pr(vo, K.well + 0.3, K.well + 0.6);
      let Hh = 27, last = 27;
      K.live.forEach((tk, j) => { if (vo >= tk) { Hh += br_ss(pr(vo, tk, tk + 0.28)); last = 28 + j; } }); // glides <= 10.3 px a frame
      const pitch = lerp(30, 48, uZ), bw = lerp(18, 26, uZ), xr = F.x + F.w - lerp(15, 48, uZ);
      const lo = lerp(0.31, 0.14, uZ), hi = lerp(0.70, 0.92, uZ), pad = lerp(18, 30, uZ), ih = F.h - 2 * pad;
      const yOf = (p) => F.y + pad + (1 - (p - lo) / (hi - lo)) * ih, xOf = (i) => xr - (Hh - i) * pitch;
      const cdl = (i) => K.cdl + (i - 12) * 0.035;
      const grow = (i) => (i >= 28 ? pr(vo, K.live[i - 28], K.live[i - 28] + 0.3) : i >= 12 ? pr(vo, cdl(i), cdl(i) + 0.3) : 1);
      // old candles enter / leave through a soft left edge 1.5 pitches wide, so a leaving candle loses <= 14.3 % a frame
      const edgeA = (cx) => cl((cx - bw / 2 - F.x - 4) / (1.5 * pitch));
      // from the zoom on, the card's fields column (x 990-1560 + its drift, y 384-844) keeps the chart out until the card
      // has gone: candles, price line and tab are MASKED there (soft 110 px left edge, 40 px right edge, released by occA)
      // rather than painted over, so no panel is left standing once the card has dissolved
      const occ = (X, Y) => {
        if (vo < K.zoom || occA <= 0.003 || Y < 384 || Y > 844) return 1;
        return 1 - occA * Math.min(cl((X - 990 - cdx) / 110), cl((1600 + cdx - X) / 40));
      };
      const qn = D[last], gn = grow(last), p0 = qn.o + (qn.c - qn.o) * e4(pr(gn, 0, 0.73));
      const brd = gn >= 1 && vo > cdl(27) + 0.3 ? br_breath(vo, 7) : 0, yLast = yOf(p0) + brd;
      x.save(); x.beginPath(); x.rect(F.x + 1, F.y - 80, F.w + 200, F.h + 160); x.clip();
      for (let i = 0; i <= last; i++) {
        const g = grow(i); if (g <= 0) continue;
        const cx = xOf(i), ea = edgeA(cx) * occ(cx, yOf(D[i].c)); if (ea <= 0.003) continue;
        const q = D[i]; let yc = yOf(q.c), yh = yOf(q.h), yl = yOf(q.l);
        if (i === last && brd) { yc += brd; yh = Math.min(yh, yc - 3); yl = Math.max(yl, yc + 3); }
        const pk = i < last && i >= 27 ? eio(pr(vo, K.live[i - 27], K.live[i - 27] + 0.4)) : 1; // the old newest greys over 0.4 s
        candle(x, cx, yOf(q.o), yc, yh, yl, bw, { grow: g, newest: i === last, a: ea, upColor: pk < 1 ? br_upc(pk) : undefined });
      }
      x.restore();
      // the dotted price line at the last close, over the candles (page 7)
      if (u2 > 0) {
        let ss = "rgba(255,255,255,0.30)";
        if (occ(1300 + cdx, yLast) < 1) { // masked across the fields column
          const m = (0.3 * (1 - occA)).toFixed(3); ss = x.createLinearGradient(990 + cdx, 0, 1600 + cdx, 0);
          ss.addColorStop(0, "rgba(255,255,255,0.30)"); ss.addColorStop(110 / 610, `rgba(255,255,255,${m})`);
          ss.addColorStop(570 / 610, `rgba(255,255,255,${m})`); ss.addColorStop(1, "rgba(255,255,255,0.30)");
        }
        x.save(); x.strokeStyle = ss; x.lineWidth = 1.5; x.setLineDash([3, 6]);
        x.beginPath(); x.moveTo(F.x + L + 6, yLast); x.lineTo(lerp(F.x + L + 6, F.x + F.w - 6, e3(u2)), yLast); x.stroke(); x.restore();
      }
      // BUY on «عليه», SELL in the gap before «الاعتيادي»
      if (last >= 28) br_ticket(x, vo, K.buy, xOf(28), D[28], yOf, true, edgeA(xOf(28)));
      if (last >= 30) br_ticket(x, vo, K.sell, xOf(30), D[30], yOf, false, edgeA(xOf(30)));
      // page 7's edge marker on the right edge at the last close, growing into the price tab on the zoom; ▲▲▲ beside it
      const ub = e3(pr(vo, K.well + 0.45, K.well + 0.7)), ut = expo(pr(vo, K.tab, K.tab + 0.4));
      const pLive = p0 - (brd * (hi - lo)) / ih, ex = F.x + F.w; // the tab rides the frame edge (the snap is the corners')
      const tcx = lerp(ex - 3, ex + 8, ut) + lerp(6, 110, ut) / 2; // masked by the fields column (logo clear space)
      x.save(); x.globalAlpha *= occ(tcx, yLast);
      br_edgeTab(x, ex, yLast, ub, ut, (21.314 + (pLive - 0.62) * 0.75).toFixed(3));
      x.restore();
      // the four brackets expand together on the zoom (the card header has gone by then, so the top-right one never
      // crosses «حساب تداول»)
      over = () => {
        corners(x, F.x - sn, F.y - sn, F.w + 2 * sn, F.h + 2 * sn, { L, u: u1, u2 });
        chev3(x, ex + 8 + 110 + 10, yLast - 22, vo, K.chev);
      };
    }

    // ---- 3. card content (header, divider, fields); it leaves with the card on the zoom (the chart is masked out of the
    // fields column until the card has gone, occA, so the expanding candles never cross the fading logo and fields)
    if (over) over();
    if (cA > 0.003 && vo >= K.head - 0.05) {
      x.save(); x.globalAlpha *= cA; x.translate(cdx, 0);
      // the header block leaves first (smoothstep VO 12.34-12.76, gone by f394), so the expanding top-right bracket never
      // crosses an opaque «حساب تداول»
      const hk = 1 - br_ss(pr(vo, K.zoom - 0.3, K.zoom + 0.12));
      if (hk > 0.003) {
        br_headline(x, br_S.acct, 1496, 292, 60, vo, K.head, { w: 500, a: hk });
        const us = expo(pr(vo, K.sub, K.sub + 0.45));
        if (us > 0) T(x, "Trading Account", 1496, 340 + 14 * (1 - us), { w: 300, size: 30, color: GREY, align: "right", a: cl(us * 1.4) * hk });
        const ud = e3(pr(vo, K.div, K.div + 0.4));
        if (ud > 0) { x.fillStyle = `rgba(255,255,255,${(0.1 * hk).toFixed(3)})`; x.fillRect(1520 - 1120 * ud, 369.5, 1120 * ud, 1); }
      }
      // fields: label + skeleton (shimmer); each skeleton dissolves (0.28 s, <= 14 %/frame) as its value arrives
      [[br_S.f1, 432, 466, 360, K.logo - 0.04], [br_S.f2, 590, 606, 220, K.sk2], [br_S.f3, 720, 736, 150, K.sk3]].forEach(([s, base, top, sw, dis], i) => {
        const t0 = K.fld + i * 0.06, u = expo(pr(vo, t0, t0 + 0.45)); if (u <= 0) return;
        T(x, s, 1496, base + 16 * (1 - u), { w: 300, size: 34, color: GREY, a: cl(u * 1.4) });
        const ka = cl(u * 1.4) * (1 - pr(vo, dis, dis + 0.28));
        if (ka > 0.003) br_skel(x, 1496 - sw, top + 16 * (1 - u), sw, 44, vo + i * 0.13, ka);
      });
      // the official logo builds in the name field (axi rises on «Axi», the tag wipes on «Select»; no sheen: white on white);
      // 360 x 79 at x 1136-1496, y 463-542: 20 px of clear space to the label above and to «الشركة» below
      // (clipped at x 1512: the kit sweeps the red '/' edge past the tag, across the card's edge)
      x.save(); x.beginPath(); x.rect(1100, 440, 412, 130); x.clip();
      await logoBuild(x, vo, K.logo, 1316, 502.5, 360, { d: 0.8, sheen: false });
      x.restore();
      const um = expo(pr(vo, K.mark, K.mark + 0.42)); // the axi wordmark (100 x 52) lands on «Axi»
      if (um > 0) await axiMark(x, 1396, 613 + 12 * (1 - um), 52, cl(um * 1.5)); // y 613-665: 13+ px clear of «الشركة»
      const ut = expo(pr(vo, K.stat, K.stat + 0.42)); // «نشط»
      if (ut > 0) br_status(x, 1346, 736 + 12 * (1 - ut), vo, cl(ut * 1.5));
      x.restore();
    }

    // ---- 4. the red disc: pops on «ستقوم», becomes the header's flag in the morph and travels to the headline on the zoom
    if (vo >= K.circle) {
      const pop = expo(pr(vo, K.circle, K.circle + 0.22)), uc = uM; // the disc rides the card's corner as it grows
      const fk = e4(pr(vo, K.morph + 0.26, K.morph + 0.5)), ug = expo(pr(vo, K.zoom, K.zoom + 0.4));
      const FX = lerp(1526, 1690, ug), FY = lerp(243, 151, ug);
      const cx = lerp(1192, FX + 7.8, uc), cy = lerp(540, FY + 10.5, uc), d = lerp(96, 21, uc) * pop;
      x.save(); br_press(x, pz);
      br_dotFlag(x, cx, cy, d, fk, FX, FY, 21);
      const aa = 1 - pr(vo, K.morph - 0.02, K.morph + 0.26); // gone before the disc turns into the flag
      if (aa > 0) {
        x.save(); x.globalAlpha *= aa;
        br_arrow(x, cx - 8 * Math.sin(Math.PI * pr(pt, 0, 0.26)), cy, 30 * (d / 96), pr(vo, K.arrow, K.arrow + 0.24), WHITE);
        x.restore();
      }
      x.restore();
    }

    // ---- 5. two-tone headline above the frame (the travelling flag is its flag)
    if (vo >= K.head2) br_headline(x, br_S.h1, 1660, 200, 60, vo, K.head2, {});

    // ---- 6. cursor: glides in on a slight arc, clicks just ahead of «حساب», fades in the morph; the click ring
    if (vo >= K.cur && vo < K.morph + 0.3) {
      const u = expo(pr(vo, K.cur, K.cur + 0.38)), bw2 = 36 * Math.sin(Math.PI * u);
      const px = lerp(1560, 1200, u) + 0.668 * bw2, py = lerp(880, 556, u) - 0.742 * bw2;
      const a = pr(vo, K.cur, K.cur + 0.08) * (1 - pr(vo, K.morph, K.morph + 0.28));
      x.save(); br_press(x, pz < 1 ? 0.9 : 1, px, py); cursor(x, px, py, a); x.restore();
    }
    if (pt >= 0 && pt < 0.4) {
      const k = pt / 0.4;
      x.save(); x.globalAlpha *= 0.8 * (1 - k); x.strokeStyle = RED; x.lineWidth = 2;
      x.beginPath(); x.arc(1192, 540, lerp(48, 125, e3(k)), 0, Math.PI * 2); x.stroke(); x.restore();
    }
  }

  // ================================================================== B-ROLL 2
  // the profit zone in chart coords: the funding line (y 640) up to the closes of candles 17..last
  function br_zone(D, last, gl, xOf, yOf) {
    if (last < 18) return null;
    const P = [[xOf(17), 640]];
    for (let i = 18; i <= last; i++) { const q = D[i], c = i === last ? q.o + (q.c - q.o) * gl : q.c; P.push([xOf(i), Math.min(640, yOf(c))]); }
    P.push([xOf(last), 640]);
    return P;
  }
  // outline sides (left, top, right, bottom; clockwise) resampled to 6 / 30 / 8 / 30 points, for the zone -> bar morph
  const br_NS = [6, 30, 8, 30];
  function br_outline(sides) { const out = []; sides.forEach((s, i) => out.push(...br_rs(s, br_NS[i]))); return out; }
  function br_zoneSides(P) {
    const n = P.length, top = P.slice(1, n - 1);
    return [[P[0], top[0]], top.length > 1 ? top : [top[0], top[0]], [top[top.length - 1], P[n - 1]], [P[n - 1], P[0]]];
  }
  const br_tagSides = (X, Y, w, h) => [[[X, Y + h], [X, Y + 0.43 * h], [X + 0.355 * h, Y]], [[X + 0.355 * h, Y], [X + w, Y]],
    [[X + w, Y], [X + w, Y + 0.57 * h], [X + w - 0.35 * h, Y + h]], [[X + w - 0.35 * h, Y + h], [X, Y + h]]];
  function br_zoneDraw(x, P, k, outline) { // white vertical gradient (.16 -> 0) fading (k) into the TRACK fill; RED outline
    let y0 = 1e9, y1 = -1e9; for (const p of P) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    x.save(); br_poly(x, P);
    if (k < 1) { const g = x.createLinearGradient(0, y0, 0, Math.max(y0 + 1, y1)); g.addColorStop(0, `rgba(255,255,255,${(0.16 * (1 - k)).toFixed(3)})`); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fill(); }
    if (k > 0) { x.save(); x.globalAlpha *= k; x.fillStyle = TRACK; x.fill(); x.restore(); }
    if (outline > 0.003) { x.globalAlpha *= outline; x.lineWidth = 2; x.lineJoin = "round"; x.strokeStyle = RED; x.stroke(); }
    x.restore();
  }
  async function br_roll2(x, vo) {
    const K = br_K2, D = br_D2;
    const gE = expo(pr(vo, K.lift, K.lift + 0.45)), s = lerp(1, 0.62, gE), ox = lerp(260, 120, gE), oy = lerp(250, 330, gE);
    const mx = (X) => ox + (X - 260) * s, my = (Y) => oy + (Y - 250) * s; // chart group: frame -> x 120-988, y 330-690
    const xOf = (i) => 1096 - (17 - i) * 48, yOf = (p) => 806 - p * 532;
    let last = 17; K.prints.forEach((tk, j) => { if (vo >= tk) last = 18 + j; });
    const grow = (i) => (i >= 18 ? pr(vo, K.prints[i - 18], K.prints[i - 18] + 0.3) : 1);
    const gn = grow(last), gbn = e4(pr(gn, 0, 0.73)), brd = gn >= 1 ? br_breath(vo, 11) : 0;
    const lifted = vo >= K.lift, uf = eio(pr(vo, K.fly, K.fly + 0.4)), landed = vo >= K.fly + 0.4;
    const hA = 1 - br_ss(pr(vo, K.lift, K.lift + 0.42)), lA = 1 - br_ss(pr(vo, K.lift - 0.3, K.lift + 0.12)); // labels ~gone as the group moves
    const tF = Math.max(K.fill, K.fly + 0.4); // the red fill and the counter start together, on the bar's landing

    // ---- 1. headline with the scene's one flag
    if (hA > 0.003) br_headline(x, br_S.h2, 1660, 190, 56, vo, K.head, { a: hA, flag: true });

    // ---- 2. the chart group: frame, funding line, profit zone, candles (time runs left to right)
    corners(x, mx(260), my(250), 1400 * s, 580 * s, { L: 28 * s });
    x.save(); x.strokeStyle = "rgba(255,255,255,0.6)"; x.lineWidth = 2; x.setLineDash([4, 8]);
    x.beginPath(); x.moveTo(mx(260) + 6, my(640)); x.lineTo(mx(1660) - 6, my(640)); x.stroke(); x.restore();
    const zone = br_zone(D, last, lifted ? 1 : gbn, xOf, yOf), zl = 30 * expo(pr(vo, K.lift, K.lift + 0.35));
    const zMap = (P) => P.map(([X, Y]) => [mx(X), my(Y) - zl]);
    if (zone && !lifted) br_zoneDraw(x, zMap(zone), 0, 0);
    for (let i = 0; i <= last; i++) {
      const q = D[i], g = grow(i); if (g <= 0) continue;
      let yc = yOf(q.c), yh = yOf(q.h), yl = yOf(q.l);
      if (i === last && brd) { yc += brd; yh = Math.min(yh, yc - 3); yl = Math.max(yl, yc + 3); }
      const pk = i < last && i >= 17 ? eio(pr(vo, K.prints[i - 17], K.prints[i - 17] + 0.4)) : 1; // the old newest greys over 0.4 s
      candle(x, mx(xOf(i)), my(yOf(q.o)), my(yc), my(yh), my(yl), 26 * s, { grow: g, newest: i === last, upColor: pk < 1 ? br_upc(pk) : undefined });
    }
    // chart labels at full size (never scaled under 34 px); they leave as the group starts to shrink
    if (lA > 0.003) {
      const fx = mx(1630), fy = my(628);
      T(x, br_S.fund, fx, fy, { w: 300, size: 34, color: GREY, a: lA });
      await axiMark(x, fx - 334, fy - 30, 30, lA); // x 1296-1354
      if (vo >= K.plbl) {
        const up = expo(pr(vo, K.plbl, K.plbl + 0.4)), lx = mx(1606), ly = my(482) + 12 * (1 - up);
        T(x, br_S.profit, lx, ly, { w: 400, size: 38, a: lA * cl(up * 1.4) });
        chev3(x, lx - 97 - 16 - 18, ly - 33, vo, K.plbl + 0.06, { a: lA });
      }
    }

    // ---- 3. the right panel «حصّتك من الأرباح» (600 x 620, cut 48) reveals right to left
    if (vo >= K.panel) {
      const u = pr(vo, K.panel, K.panel + 0.5), e = expo(u), uc = pr(vo, K.panel + 0.12, K.panel + 0.62);
      x.save(); x.translate(0, 24 * (1 - e));
      card(x, 1200, 220, 600, 620, { u, a: cl(e * 1.4), c: 48 });
      x.save(); cardClip(x, 1200, 220, 600, 620, uc);
      br_headline(x, br_S.share, 1760, 300, 44, vo, K.panel + 0.12, { w: 500 }); // a card header: no flag
      if (landed) { // the split bar: TAG track, filled RED from its right edge to 80 %
        tagPath(x, 1250, 560, 500, 44); x.fillStyle = TRACK; x.fill();
        const kf = e4(pr(vo, tF, tF + 0.45));
        if (kf > 0) {
          x.save(); tagPath(x, 1250, 560, 500, 44); x.clip();
          x.fillStyle = RED; x.fillRect(1750 - 400 * kf, 556, 400 * kf + 4, 52);
          x.fillStyle = INK; x.fillRect(1750 - 400 * kf - 1, 556, 2, 52);
          x.restore();
        }
      }
      if (vo >= tF - 0.04) { // «حتى» + '80%' (metallic Inter 200 170, counting in fixed cells, relaxing on landing)
        const ua = expo(pr(vo, tF - 0.04, tF + 0.36)), kc = e4(pr(vo, tF, tF + 0.45));
        T(x, br_S.upto, 1750, 500 + 14 * (1 - ua), { w: 300, size: 48, color: GREY, a: cl(ua * 1.4) });
        metal(x, Math.round(80 * kc) + "%", 1646, 500, 170, { w: 200, fade: true, align: "right", a: cl(ua * 1.4), tab: true,
          relax: pr(vo, tF + 0.45, tF + 0.6), sheen: pr(vo, tF + 0.62, tF + 1.12) });
        chev3(x, 1310, 432, vo, tF + 0.22);
      }
      if (vo >= K.lbl) {
        const ul = expo(pr(vo, K.lbl, K.lbl + 0.4)), dy = 12 * (1 - ul), a = cl(ul * 1.4);
        T(x, br_S.you, 1750, 652 + dy, { w: 400, size: 34, a });
        T(x, "Axi", 1250, 652 + dy, { w: 400, size: 30, color: GREY, align: "left", a });
      }
      if (vo >= K.pill) { // RED pill «سحب الأرباح» 380 x 84, white disc d 64 with a RED ←; pressed into the cut
        const up = expo(pr(vo, K.pill, K.pill + 0.35)), pp = vo - K.press, pz = pp >= 0 && pp < 0.08 ? 0.96 : 1;
        x.save(); x.translate(0, 16 * (1 - up)); x.globalAlpha *= cl(up * 1.4);
        x.save(); if (up < 1) { x.beginPath(); x.rect(1750 - 392 * up, 680, 392 * up + 12, 124); x.clip(); } br_press(x, pz, 1560, 742);
        rr(x, 1370, 700, 380, 84, 42); x.fillStyle = RED; x.fill();
        const dU = back(pr(vo, K.pill + 0.08, K.pill + 0.36), 1.4);
        x.fillStyle = WHITE; x.beginPath(); x.arc(1708, 742, 32 * dU, 0, Math.PI * 2); x.fill();
        br_arrow(x, 1708, 742, 26 * dU, pr(vo, K.pill + 0.16, K.pill + 0.4), RED);
        T(x, br_S.cta, 1523 + measure(x, br_S.cta, 500, 38, AR) / 2, 742 + 13.7, { w: 500, size: 38 });
        x.restore();
        if (pp >= 0 && pp < 0.4) {
          const k = pp / 0.4;
          x.save(); x.globalAlpha *= 0.8 * (1 - k); x.strokeStyle = RED; x.lineWidth = 2;
          x.beginPath(); x.arc(1708, 742, 32 * lerp(1, 2.6, e3(k)), 0, Math.PI * 2); x.stroke(); x.restore();
        }
        x.restore();
      }
      x.restore();
      x.restore();
    }

    // ---- 4. the lifted zone: detaches with a RED outline on «وسحب», flies on «نسبة» and lands as the split-bar track
    if (zone && lifted && !landed) {
      const A = zMap(zone), oa = e3(pr(vo, K.lift + 0.1, K.lift + 0.3));
      if (uf <= 0) br_zoneDraw(x, A, 0, oa);
      else {
        const PA = br_outline(br_zoneSides(A)), PB = br_outline(br_tagSides(1250, 560, 500, 44)), bump = 120 * Math.sin(Math.PI * uf);
        br_zoneDraw(x, PA.map((p, i) => [lerp(p[0], PB[i][0], uf), lerp(p[1], PB[i][1], uf) - bump]), uf, oa * (1 - pr(vo, K.fly + 0.12, K.fly + 0.4)));
      }
    }

    // ---- 5. footnote under the panel (keeps 'up to 80%' accurate)
    if (vo >= K.foot) {
      const u = expo(pr(vo, K.foot, K.foot + 0.45));
      br_runs(x, br_S.foot, 1800, 905 + 12 * (1 - u), { color: GREY, a: cl(u * 1.4) });
    }
  }

  GROUPS.push({
    name: "broll",
    async broll(x, t, S, id) {
      if (id !== 1 && id !== 2) return;
      const vo = t - P, lt = Math.max(0, vo - (S.shot.f0 / 25 - P));
      br_haze(x); // the bitmap layers sit on the horizon, where the 1.00-1.03 drift moves nothing by more than 2 px:
      br_bokeh(x, lt, id === 1 ? 362 : 370); // they are drawn 1:1, outside the drift (B-roll 2's band sits a little lower)
      x.save();
      const s = 1 + 0.005 * lt; x.translate(960, 540); x.scale(s, s); x.translate(-960, -540); // slow drift
      br_floor(x, (id === 1 ? 0 : 37) + 1.2 * lt + (id === 1 ? 1.8 * e3(pr(vo, br_K1.zoom, br_K1.zoom + 0.7)) : 0));
      if (id === 1) await br_roll1(x, vo); else await br_roll2(x, vo);
      x.restore();
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
  // presenter shot VO 4.40-110.88, switching with the cuts
  async function bug(x, t, S) {
    if (t < v(4.40) || t >= v(110.88)) return;
    await logo(x, 80 + 80, 60 + 17.5, 160, 0.85);
  }
  // chamfer wipe into the end card: a #000 panel enters from the right with a '/' edge (logo slant) and a 3 px red line
  // over VO 110.36-110.88 (inOutCubic, 13 frames) and covers the frame on the music change at VO 110.88 (output 113.88);
  // V's graphics hold at full opacity under it. The whole slanted edge starts off-screen right and clears the top-left
  // corner (the last part covered) at t1.
  function endWipe(x, t) {
    const t1 = v(110.88), t0 = v(110.36);
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
