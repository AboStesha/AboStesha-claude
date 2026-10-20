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
