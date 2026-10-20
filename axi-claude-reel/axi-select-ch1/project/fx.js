// fx.js — axi-select-ch1 (Rabee, Axi Select explainer, chapter 1, 1920x1080, 25 fps)
// Black studio with a grey floor pool. Motion graphics live in the void around Rabee: glass tiles with red
// number badges, account cards, an Edge Score gauge, the six-stage row, floor light that only falls on the floor
// (glow multiplied by the plate, so his legs and the stool keep their shadow), the trade-copy arc, typographic
// beats with a brush underline, Arabic subtitles and the Axi Select end card.
// Every time is VO time; v(t) = t + E.k_t.P maps it onto the output timeline.
(function () {
  const U = RRC.util;
  const AR = '"AlexAr", "AlexLat", sans-serif';
  const LAT = '"InterV", "AlexLat", sans-serif';
  const RED = "#E4002E", MINT = "#76DFC3", WHITE = "#FFFFFF", GREY = "#8E979F";
  const W = 1920, H = 1080;
  const cl = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const e3 = (t) => 1 - Math.pow(1 - cl(t), 3);
  const e2 = (t) => 1 - Math.pow(1 - cl(t), 2);
  const in2 = (t) => cl(t) * cl(t);
  const eio = (t) => { t = cl(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const back = (t, k = 1.6) => { t = cl(t); const c3 = k + 1; return 1 + c3 * Math.pow(t - 1, 3) + k * Math.pow(t - 1, 2); };
  const pr = (t, a, b) => cl((t - a) / (b - a));
  const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

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
  const base = (x) => x.setTransform(U.px(1), 0, 0, U.px(1), 0, 0);

  // ------------------------------------------------------------------ envelope of an element: alpha, intro and outro progress
  function env(t, t0, t1, din = 0.4, dout = 0.3) {
    if (t < t0 || t > t1 + dout) return null;
    const ui = pr(t, t0, t0 + din), uo = pr(t, t1, t1 + dout);
    return { ui, uo, a: e3(ui) * (1 - e2(uo)), lt: t - t0 };
  }
  const bob = (t, s = 1, amp = 5) => Math.sin(t * 1.3 * s + s * 2.1) * amp;

  // ------------------------------------------------------------------ text
  function font(x, w, s, fam) { x.font = `${w} ${s}px ${fam || AR}`; }
  function shadowOn(x, a, b, dy, c) { x.shadowColor = c || `rgba(0,0,0,${a})`; x.shadowBlur = U.px(b); x.shadowOffsetX = 0; x.shadowOffsetY = U.px(dy || 0); }
  function shadowOff(x) { x.shadowColor = "rgba(0,0,0,0)"; x.shadowBlur = 0; x.shadowOffsetX = 0; x.shadowOffsetY = 0; }
  function txt(x, s, cx, cy, o = {}) {
    x.save();
    font(x, o.w || 500, o.size || 40, o.fam);
    x.direction = o.ltr ? "ltr" : "rtl";
    x.textAlign = o.align || "center";
    x.textBaseline = "middle";
    x.globalAlpha *= o.alpha ?? 1;
    if (o.ls) x.letterSpacing = o.ls + "px";
    if (o.shadow !== false) shadowOn(x, o.sa ?? 0.55, o.sb ?? 16, o.sdy ?? 3, o.sc);
    x.fillStyle = o.color || WHITE;
    x.fillText(s, cx, cy);
    x.restore();
  }
  function measure(x, s, w, size, fam, ls) { x.save(); font(x, w, size, fam); if (ls) x.letterSpacing = ls + "px"; const m = x.measureText(s).width; x.restore(); return m; }

  // ------------------------------------------------------------------ brush underline (tapered, slightly ragged ribbon)
  function brush(x, x0, y0, x1, y1, wdt, u, color, seed) {
    if (u <= 0) return;
    const n = 40, pts = [];
    for (let i = 0; i <= n; i++) {
      const k = i / n;
      if (k > u) break;
      const px = lerp(x0, x1, k), py = lerp(y0, y1, k) + Math.sin(k * 7 + seed) * 2.2;
      const taper = Math.sin(Math.PI * Math.min(1, k * 1.05)) * 0.75 + 0.25;
      const jit = (U.hash(seed, i, 3) - 0.5) * 0.25;
      pts.push([px, py, (wdt / 2) * (taper + jit)]);
    }
    if (pts.length < 2) return;
    x.save();
    x.fillStyle = color;
    x.beginPath();
    pts.forEach((p, i) => (i ? x.lineTo(p[0], p[1] - p[2]) : x.moveTo(p[0], p[1] - p[2])));
    for (let i = pts.length - 1; i >= 0; i--) x.lineTo(pts[i][0], pts[i][1] + pts[i][2] * 0.8);
    x.closePath();
    x.fill();
    // bristle streaks
    x.globalAlpha *= 0.5;
    for (let s = 0; s < 4; s++) {
      x.beginPath();
      const off = (s - 1.5) * wdt * 0.18;
      pts.forEach((p, i) => (i ? x.lineTo(p[0], p[1] + off) : x.moveTo(p[0], p[1] + off)));
      x.lineWidth = 1.2;
      x.strokeStyle = "rgba(0,0,0,0.35)";
      x.stroke();
    }
    x.restore();
  }

  // ------------------------------------------------------------------ glass tile
  function rr(x, X, Y, w, h, r) { x.beginPath(); x.roundRect(X, Y, w, h, r); }
  function glass(x, cx, cy, w, h, r, o = {}) {
    const a = o.a ?? 1, X = cx - w / 2, Y = cy - h / 2;
    x.save();
    if (o.glow) { x.shadowColor = o.glow; x.shadowBlur = U.px(o.gb ?? 46); }
    rr(x, X, Y, w, h, r);
    const g = x.createLinearGradient(X, Y, X, Y + h);
    g.addColorStop(0, `rgba(46,50,58,${0.82 * a})`);
    g.addColorStop(1, `rgba(13,15,19,${0.9 * a})`);
    x.fillStyle = g;
    x.fill();
    x.restore();
    x.save();
    rr(x, X, Y, w, h, r);
    x.clip();
    const s = x.createLinearGradient(X, Y, X + w * 0.7, Y + h);
    s.addColorStop(0, `rgba(255,255,255,${0.13 * a})`);
    s.addColorStop(0.42, "rgba(255,255,255,0)");
    x.fillStyle = s;
    x.fillRect(X, Y, w, h);
    if (o.tint) { x.fillStyle = rgba(o.tint, 0.1 * a * (o.tk ?? 1)); x.fillRect(X, Y, w, h); }
    x.restore();
    x.save();
    rr(x, X + 1, Y + 1, w - 2, h - 2, r - 1);
    x.lineWidth = o.lw ?? 2;
    const rg = x.createLinearGradient(X, Y, X + w, Y + h);
    rg.addColorStop(0, `rgba(255,255,255,${0.6 * a})`);
    rg.addColorStop(0.5, `rgba(255,255,255,${0.14 * a})`);
    rg.addColorStop(1, o.rim ? rgba(o.rim, 0.85 * a) : `rgba(255,255,255,${0.32 * a})`);
    x.strokeStyle = rg;
    x.stroke();
    x.restore();
  }
  function badge(x, cx, cy, r, s, color = RED, a = 1) {
    x.save();
    x.globalAlpha *= a;
    shadowOn(x, 0.5, 12, 2);
    x.fillStyle = color;
    x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill();
    shadowOff(x);
    txt(x, s, cx, cy + 1, { fam: LAT, w: 700, size: r * 1.1, ltr: true, shadow: false });
    x.restore();
  }

  // ------------------------------------------------------------------ line icons (unit size s, centred)
  function icon(x, name, cx, cy, s, color = WHITE, lw = 6, u = 1) {
    x.save();
    x.translate(cx, cy);
    x.strokeStyle = color; x.fillStyle = color;
    x.lineWidth = lw; x.lineCap = "round"; x.lineJoin = "round";
    const k = s / 100;
    x.scale(k, k);
    x.lineWidth = lw / k;
    const L = (pts, close) => { x.beginPath(); pts.forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]))); if (close) x.closePath(); x.stroke(); };
    const C = (X, Y, r, a0 = 0, a1 = Math.PI * 2) => { x.beginPath(); x.arc(X, Y, r, a0, a1); x.stroke(); };
    switch (name) {
      case "user": C(0, -18, 16); x.beginPath(); x.arc(0, 40, 34, Math.PI * 1.08, Math.PI * 1.92); x.stroke(); break;
      case "user_plus": C(-10, -18, 16); x.beginPath(); x.arc(-10, 40, 34, Math.PI * 1.08, Math.PI * 1.92); x.stroke(); L([[30, -22], [30, 2]]); L([[18, -10], [42, -10]]); break;
      case "steps": L([[-40, 36], [-40, 14], [-14, 14], [-14, -8], [12, -8], [12, -30], [40, -30], [40, 36]], true); break;
      case "chart": L([[-42, 36], [42, 36]]); L([[-34, 18], [-12, -4], [6, 10], [34, -26]]); L([[22, -28], [36, -28], [36, -14]]); break;
      case "account": { x.beginPath(); x.roundRect(-40, -30, 80, 60, 10); x.stroke(); L([[-40, -12], [40, -12]]); L([[-26, 12], [-6, 12]]); break; }
      case "dollar": C(0, 0, 38); x.font = "700 52px " + LAT; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("$", 0, 3); break;
      case "lock": { x.beginPath(); x.roundRect(-30, -6, 60, 46, 8); x.stroke(); x.beginPath(); x.arc(0, -6, 20, Math.PI, 0); x.stroke(); L([[0, 10], [0, 22]]); break; }
      case "link": { x.beginPath(); x.roundRect(-44, -12, 46, 24, 12); x.stroke(); x.beginPath(); x.roundRect(-2, -12, 46, 24, 12); x.stroke(); break; }
      case "check": L([[-30, 2], [-8, 24], [32, -22]].map((p) => [p[0], p[1]])); break;
      case "cross": L([[-26, -26], [26, 26]]); L([[26, -26], [-26, 26]]); break;
      case "seed": { L([[0, 40], [0, -4]]); x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(-6, -30, -34, -34, -40, -20); x.bezierCurveTo(-30, -2, -8, -2, 0, 0); x.stroke(); x.beginPath(); x.moveTo(0, -10); x.bezierCurveTo(8, -40, 36, -42, 42, -30); x.bezierCurveTo(32, -10, 10, -10, 0, -10); x.stroke(); L([[-26, 40], [26, 40]]); break; }
      case "egg": { x.beginPath(); x.ellipse(0, 4, 30, 38, 0, 0, Math.PI * 2); x.stroke(); L([[-28, 0], [-14, -10], [-2, 2], [12, -10], [28, 0]]); break; }
      case "rocket": { x.beginPath(); x.moveTo(0, -44); x.bezierCurveTo(22, -26, 20, 10, 14, 24); x.lineTo(-14, 24); x.bezierCurveTo(-20, 10, -22, -26, 0, -44); x.stroke(); C(0, -12, 8); L([[-14, 10], [-28, 30], [-12, 26]]); L([[14, 10], [28, 30], [12, 26]]); L([[-6, 32], [0, 44], [6, 32]]); break; }
      case "star": { const p = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? 18 : 42, a = -Math.PI / 2 + (i * Math.PI) / 5; p.push([Math.cos(a) * r, Math.sin(a) * r + 4]); } L(p, true); break; }
      case "p500": { const p = []; for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + (i * Math.PI) / 3; p.push([Math.cos(a) * 44, Math.sin(a) * 44]); } L(p, true); x.font = "800 30px " + LAT; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("500", 0, 2); break; }
      case "crown": L([[-42, 26], [-42, -18], [-20, 2], [0, -30], [20, 2], [42, -18], [42, 26]], true); L([[-42, 38], [42, 38]]); break;
      case "bank": L([[-44, -14], [0, -40], [44, -14]], true); L([[-30, -6], [-30, 26]]); L([[-10, -6], [-10, 26]]); L([[10, -6], [10, 26]]); L([[30, -6], [30, 26]]); L([[-46, 38], [46, 38]]); break;
      case "percent": C(-20, -20, 12); C(20, 20, 12); L([[28, -32], [-28, 32]]); break;
      case "list": for (let i = 0; i < 3; i++) { L([[-40, -26 + i * 26], [-30, -26 + i * 26]]); L([[-16, -26 + i * 26], [40, -26 + i * 26]]); } break;
      case "alert": { L([[0, -44], [44, 34], [-44, 34]], true); L([[0, -16], [0, 10]]); x.beginPath(); x.arc(0, 22, 3, 0, Math.PI * 2); x.fill(); break; }
      case "arrow": L([[40, 0], [-36, 0]]); L([[-16, -20], [-38, 0], [-16, 20]]); break;
      case "calendar": { x.beginPath(); x.roundRect(-38, -30, 76, 68, 8); x.stroke(); L([[-38, -10], [38, -10]]); L([[-18, -42], [-18, -22]]); L([[18, -42], [18, -22]]); break; }
      case "target": C(0, 0, 38); C(0, 0, 22); x.beginPath(); x.arc(0, 0, 6, 0, Math.PI * 2); x.fill(); break;
      case "trades": L([[-30, 30], [-30, -10]]); L([[-10, 30], [-10, -30]]); L([[10, 30], [10, 0]]); L([[30, 30], [30, -20]]); break;
      case "shield": { x.beginPath(); x.moveTo(0, -42); x.lineTo(36, -28); x.bezierCurveTo(36, 10, 22, 30, 0, 42); x.bezierCurveTo(-22, 30, -36, 10, -36, -28); x.closePath(); x.stroke(); break; }
      case "down": L([[-40, -28], [-10, 0], [8, -14], [40, 26]]); L([[22, 26], [40, 26], [40, 8]]); break;
    }
    x.restore();
  }

  // ------------------------------------------------------------------ floor light (multiplied by the plate so only the lit floor takes it)
  // shapes: [{type: "ellipse"|"quad"|"grid", ...plate coords}], drawn in source px through S.M
  function floorLight(x, S, shapes, gain) {
    const M = VM || S.M;
    if (!M || !shapes.length) return;
    const pw = x.canvas.width, ph = x.canvas.height;
    const sc = snap(x, "fl_src");
    const g = tmp("fl", pw, ph);
    g.x.setTransform(1, 0, 0, 1, 0, 0); g.x.globalAlpha = 1; g.x.filter = "none";
    g.x.globalCompositeOperation = "source-over"; g.x.fillStyle = "#000"; g.x.fillRect(0, 0, pw, ph);
    g.x.save();
    U.setM(g.x, M);
    for (const s of shapes) {
      g.x.globalAlpha = cl(s.a ?? 1);
      if (s.type === "ellipse") {
        const gr = g.x.createRadialGradient(s.cx, s.cy, 0, s.cx, s.cy, s.r);
        gr.addColorStop(0, s.color); gr.addColorStop(s.core ?? 0.55, s.color); gr.addColorStop(1, "rgba(0,0,0,0)");
        g.x.save(); g.x.translate(s.cx, s.cy); g.x.scale(1, s.ry ?? 0.26); g.x.translate(-s.cx, -s.cy);
        g.x.fillStyle = gr; g.x.beginPath(); g.x.arc(s.cx, s.cy, s.r, 0, Math.PI * 2); g.x.fill(); g.x.restore();
      } else if (s.type === "ring") {
        // soft annulus from a radial gradient (no canvas blur filter: that is the slow path in software raster)
        const w2 = (s.w ?? 30) * 0.5 + 14, r0 = Math.max(0, s.r - w2), r1 = s.r + w2;
        g.x.save(); g.x.translate(s.cx, s.cy); g.x.scale(1, s.ry ?? 0.26);
        const gr = g.x.createRadialGradient(0, 0, r0, 0, 0, r1);
        gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.5, s.color); gr.addColorStop(1, "rgba(0,0,0,0)");
        g.x.fillStyle = gr; g.x.beginPath(); g.x.arc(0, 0, r1, 0, Math.PI * 2); g.x.arc(0, 0, r0, 0, Math.PI * 2, true); g.x.fill(); g.x.restore();
      } else if (s.type === "grid") {
        // perspective grid of tiles around the stool: floor coords (i, j) -> plate px via a simple pinhole
        // pinhole: horizon at y=hz, the stool's tile centre at (cx, fy); one tile = cell px laterally at that depth,
        // each tile step changes the relative depth by kz (j < 0 is further away)
        const cx = s.cx ?? 960, fy = s.fy ?? 1004, hz = s.hz ?? 560, n = s.n ?? 5, m = s.m ?? 4, cell = s.cell ?? 170, kz = s.kz ?? 0.25;
        const proj = (a, b) => { const z = 1 - b * kz; return [cx + (cell * a) / z, hz + (fy - hz) / z]; };
        for (let i = -n; i <= n; i++) for (let j = -m; j <= 1; j++) {
          const on = s.on ? s.on(i, j) : 1;
          if (on <= 0.01) continue;
          const q = [[i - 0.45, j - 0.45], [i + 0.45, j - 0.45], [i + 0.45, j + 0.45], [i - 0.45, j + 0.45]].map(([a, b]) => proj(a, b));
          g.x.globalAlpha = cl((s.a ?? 1) * on);
          g.x.fillStyle = s.color;
          g.x.beginPath(); q.forEach((p, k) => (k ? g.x.lineTo(p[0], p[1]) : g.x.moveTo(p[0], p[1]))); g.x.closePath(); g.x.fill();
        }
      }
    }
    g.x.restore();
    g.x.setTransform(1, 0, 0, 1, 0, 0);
    g.x.globalAlpha = 1;
    g.x.globalCompositeOperation = "multiply";
    g.x.drawImage(sc, 0, 0);
    g.x.globalCompositeOperation = "source-over";
    x.save();
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.globalCompositeOperation = "lighter";
    let k = gain;
    while (k > 0.001) { x.globalAlpha = Math.min(1, k); x.drawImage(g, 0, 0); k -= 1; }
    x.restore();
  }

  // ------------------------------------------------------------------ virtual camera on L4 (2.5D dolly about the plate's horizon point)
  // L4 sits inside its extended studio (l4_ext.jpg, the plate's own floor continued outward) and the camera scales the
  // whole world about A = (0.49W, 0.58H): s 1.0 FULL, 0.66 HOME, 0.30 WIDE, 0.22 extreme wide; dy cranes (fraction of H).
  // Pull-outs: near-instant attack + expo ease-out; push-ins: S-curve; sub-frame samples give the move its motion blur.
  const AX = 0.49 * W, AY = 0.58 * H;
  let VM = null; // plate px -> screen for the current vcam frame
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
  RRC.hook("afterPlate", async (S) => {
    VM = null;
    const c = S.shot && S.shot.k_vcam;
    if (!c || !S.plate) return;
    const pc = S.plateCanvas.x;
    const ext = await im("l4_ext.jpg"), fea = await im("l4_feather.png");
    const m = tmp("xwm", 1920, 1080);
    m.x.setTransform(1, 0, 0, 1, 0, 0);
    m.x.globalCompositeOperation = "copy"; m.x.drawImage(S.plate, 0, 0, 1920, 1080);
    m.x.globalCompositeOperation = "destination-in"; m.x.drawImage(fea, 0, 0, 1920, 1080);
    m.x.globalCompositeOperation = "source-over";
    const tv = S.t - P, c0 = camAt(c, tv), ca = camAt(c, tv - 0.02), cb = camAt(c, tv + 0.02);
    const sp = Math.abs(Math.log(cb.s / ca.s)) + Math.abs(cb.dy - ca.dy) * 4;
    const N = sp > 0.004 ? Math.min(12, 3 + Math.round(sp * 160)) : 1;
    U.reset(pc);
    pc.fillStyle = "#000"; pc.fillRect(0, 0, W, H);
    for (let j = 0; j < N; j++) {
      const cc = N === 1 ? c0 : camAt(c, tv - 0.02 + (0.04 * j) / (N - 1));
      pc.save();
      pc.globalAlpha = 1 / (j + 1);
      U.setM(pc, camM(cc));
      pc.drawImage(ext, -1920, -1080, 5760, 3240);
      pc.drawImage(m, 0, 0, 1920, 1080);
      pc.restore();
    }
    VM = camM(c0);
  });

  // ------------------------------------------------------------------ components
  const FLOOR_C = [960, 1004]; // stool feet in L4 plate px

  const DOTS = {};
  function dotGrid(x, X, Y, w, h, a) { // cached halftone panel (3 px dots on an 11 px pitch)
    if (a <= 0.002) return;
    const k = w + "x" + h;
    let c = DOTS[k];
    if (!c) {
      c = DOTS[k] = U.mk(w, h);
      c.x.fillStyle = "#8a8a8a";
      for (let yy = 4; yy < h; yy += 11) for (let xx = 4; xx < w; xx += 11) c.x.fillRect(xx - 1.4, yy - 1.4, 2.8, 2.8);
    }
    x.save(); x.globalAlpha = a; x.drawImage(c, X, Y, w, h); x.restore();
  }
  function drawTitle(x, t) {
    // chapter card (after the reference's «(2) إدمان السوشال ميديا»): faint dot-grid panels, a white dry-brush stroke at
    // -15 deg, line 1 slides up out of the stroke, line 2 slides down out of it; then everything retracts into the stroke.
    const fadeG = e3(pr(t, 0.0, 0.5)) * (1 - e2(pr(t, 2.55, 2.95)));
    dotGrid(x, 560, 330, 520, 260, 0.09 * fadeG); dotGrid(x, 860, 470, 560, 280, 0.07 * fadeG); dotGrid(x, 700, 560, 420, 180, 0.06 * fadeG);
    x.save();
    x.translate(960, 540);
    x.rotate(-0.26);
    const sc = 1 + 0.025 * pr(t, 0, 3);
    x.scale(sc, sc);
    const wIn = e3(pr(t, 0.1, 0.55)), wOut = in2(pr(t, 2.62, 2.95));
    // stroke writes from the lower-left end, un-writes back toward it
    if (wIn - wOut > 0.001) brush(x, -390 + 780 * 0, 4, 390, -4, 15, wIn, WHITE, 5);
    if (wOut > 0) { x.save(); x.fillStyle = "#000"; x.fillRect(390 - 800 * wOut, -30, 800 * wOut + 20, 60); x.restore(); }
    const up = e3(pr(t, 0.55, 0.75)) * (1 - in2(pr(t, 2.5, 2.7)));   // line 1 rises out of the stroke
    const dn = e3(pr(t, 0.8, 1.04)) * (1 - in2(pr(t, 2.38, 2.6)));   // line 2 drops out of it
    x.save(); x.beginPath(); x.rect(-700, -300, 1400, 290); x.clip();
    txt(x, "(1) كيف تبدأ", 70, 46 - 112 * up, { w: 700, size: 70, shadow: false }); x.restore();
    x.save(); x.beginPath(); x.rect(-700, 12, 1400, 300); x.clip();
    txt(x, "مع Axi Select", -30, -62 + 150 * dn, { w: 800, size: 112, shadow: false }); x.restore();
    x.restore();
  }

  async function drawLockup(x, t, t0, t1, cx, cy, s) {
    const e = env(t, t0, t1, 0.7, 0.4); if (!e) return;
    const axi = await im("axi_white.png");
    const w = 300 * s, h = (702 / 1334) * w;
    x.save();
    x.globalAlpha = e.a;
    const sc = lerp(0.9, 1, e3(e.ui)) + 0.02 * e3(pr(t, t0, t1));
    x.translate(cx, cy + bob(t, 0.7, 3)); x.scale(sc, sc);
    // glow plate behind
    const gr = x.createRadialGradient(0, 0, 0, 0, 0, 420 * s);
    gr.addColorStop(0, rgba(MINT, 0.16)); gr.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = gr; x.fillRect(-500 * s, -300 * s, 1000 * s, 600 * s);
    const lw = measure(x, "Select", 300, 118 * s, LAT, 2);
    const tot = w + 34 * s + lw;
    shadowOn(x, 0.6, 30, 0, rgba(MINT, 0.35));
    x.drawImage(axi, -tot / 2, -h / 2 - 6 * s, w, h);
    shadowOff(x);
    txt(x, "Select", -tot / 2 + w + 34 * s, 4 * s, { fam: LAT, w: 300, size: 118 * s, ltr: true, align: "left", ls: 2, sc: rgba(MINT, 0.4), sb: 28, sdy: 0 });
    txt(x, "برنامج التمويل", 0, -h / 2 - 70 * s, { w: 500, size: 40 * s, color: "rgba(255,255,255,0.86)", alpha: e3(pr(t, t0 + 0.25, t0 + 0.7)) });
    // red slash accent under the wordmark
    x.fillStyle = RED;
    const ul = e3(pr(t, t0 + 0.35, t0 + 0.9));
    x.beginPath(); x.moveTo(-tot / 2, h / 2 + 22 * s); x.lineTo(-tot / 2 + tot * ul, h / 2 + 22 * s); x.lineTo(-tot / 2 + tot * ul - 10 * s, h / 2 + 30 * s); x.lineTo(-tot / 2 - 10 * s, h / 2 + 30 * s); x.closePath(); x.fill();
    x.restore();
  }

  // glass icon tile with label under it
  function tile(x, t, o) {
    const e = env(t, o.t0, o.t1, 0.45, 0.3); if (!e) return;
    const lit = o.lit != null ? e3(pr(t, o.lit, o.lit + 0.35)) : 1;
    const sc = lerp(0.55, 1, back(e.ui)) * (1 - 0.08 * e2(e.uo)) * (1 + 0.04 * lit * (o.litScale ?? 0));
    const s = o.s ?? 230;
    x.save();
    x.globalAlpha = e.a * (o.dim != null ? lerp(o.dim, 1, lit) : 1);
    x.translate(o.cx, o.cy + bob(t, o.seed ?? 1, o.bob ?? 4)); x.scale(sc, sc);
    glass(x, 0, 0, s, s, s * 0.2, { glow: lit > 0.01 && o.glow ? rgba(o.glow, 0.55 * lit) : null, rim: lit > 0.5 ? o.glow : null, tint: o.glow, tk: lit });
    icon(x, o.icon, 0, o.label2 ? -s * 0.06 : 0, s * 0.42, lit > 0.5 ? WHITE : "rgba(255,255,255,0.75)", Math.max(4, s * 0.028));
    if (o.badge) badge(x, s * 0.42, -s * 0.42, s * 0.12, o.badge, RED, 1);
    if (o.inner) txt(x, o.inner, 0, s * 0.3, { fam: LAT, w: 600, size: s * 0.12, ltr: true });
    x.restore();
    if (o.label) {
      const la = e.a * e3(pr(t, o.t0 + 0.2, o.t0 + 0.6));
      txt(x, o.label, o.cx, o.cy + s / 2 + 44, { w: 600, size: o.ls ?? 38, alpha: la });
      if (o.label2) txt(x, o.label2, o.cx, o.cy + s / 2 + 92, { w: 400, size: (o.ls ?? 38) * 0.72, color: "rgba(255,255,255,0.72)", alpha: la });
    }
  }

  // account card: kind "trading" | "alloc"
  async function card(x, t, o) {
    const e = env(t, o.t0, o.t1, 0.5, 0.3); if (!e) return;
    const w = o.w ?? 520, h = o.h ?? 300, s = o.s ?? 1;
    x.save();
    x.globalAlpha = e.a;
    const sc = lerp(0.82, 1, back(e.ui, 1.2)) * s;
    x.translate(o.cx, o.cy + bob(t, o.seed ?? 2, 3)); x.scale(sc, sc);
    const accent = o.kind === "alloc" ? MINT : WHITE;
    glass(x, 0, 0, w, h, 26, { glow: o.glow ? rgba(o.glow, 0.5 * (o.glowK ?? 1)) : null, rim: o.kind === "alloc" ? MINT : null, tint: o.kind === "alloc" ? MINT : null, tk: 0.6 });
    const L = w / 2 - 36, T = -h / 2 + 50;
    // header row (RTL): icon on the right, title next to it
    icon(x, o.kind === "alloc" ? "bank" : "account", L - 22, T, 42, accent, 4);
    txt(x, o.title, L - 64, T, { w: 600, size: 36, align: "right" });
    const free = (L - 64 - measure(x, o.title, 600, 36)) - -L; // px left of the title
    if (o.kind === "alloc") {
      const axi = await im("axi_white.png");
      const aw = 84, ah = (702 / 1334) * aw;
      if (free > aw + 24) x.drawImage(axi, -L, T - ah / 2 - 4, aw, ah);
    } else if (free > 150) {
      txt(x, "MT4 · MT5", -L, T, { fam: LAT, w: 500, size: 24, ltr: true, align: "left", color: "rgba(255,255,255,0.7)" });
    }
    x.fillStyle = "rgba(255,255,255,0.12)"; x.fillRect(-w / 2 + 30, T + 36, w - 60, 2);
    const lockK = o.lock != null ? 1 - 0.8 * e3(pr(t, o.lock, o.lock + 0.35)) : 1;
    if (o.big) txt(x, o.big, L, T + 96, { fam: o.bigLat ? LAT : AR, w: 700, size: 52, align: "right", ltr: !!o.bigLat, alpha: lockK });
    if (o.sub) txt(x, o.sub, L, T + 158, { w: 400, size: 28, align: "right", color: "rgba(255,255,255,0.72)", alpha: lockK });
    // balance counter
    if (o.bal) {
      const u = e3(pr(t, o.bal.t, o.bal.t + 0.9));
      const val = Math.round(o.bal.to * u);
      txt(x, "$" + val.toLocaleString("en-US"), -L, T + 100, { fam: LAT, w: 700, size: 54, ltr: true, align: "left", color: u > 0.98 ? MINT : WHITE, alpha: e3(pr(t, o.bal.t - 0.2, o.bal.t)) });
      if (o.bal.lab) txt(x, o.bal.lab, -L, T + 158, { w: 400, size: 24, ltr: false, align: "left", color: "rgba(255,255,255,0.65)", alpha: e3(pr(t, o.bal.t, o.bal.t + 0.3)) });
    }
    // mini live chart
    if (o.chart != null) {
      const u = e3(pr(t, o.chart, o.chart + 1.4));
      const X0 = -w / 2 + 40, X1 = w / 2 - 40, Y0 = h / 2 - 30, hh = Math.min(90, Math.max(40, h - 280));
      x.save();
      x.beginPath(); x.rect(X0, Y0 - hh - 10, (X1 - X0) * u, hh + 20); x.clip();
      x.strokeStyle = MINT; x.lineWidth = 4; x.lineJoin = "round";
      x.beginPath();
      for (let i = 0; i <= 60; i++) {
        const k = i / 60, yy = Y0 - hh * (0.25 + 0.55 * k + 0.12 * Math.sin(k * 17 + 1) + 0.08 * Math.sin(k * 41));
        i ? x.lineTo(lerp(X0, X1, k), yy) : x.moveTo(X0, yy);
      }
      x.stroke();
      const gg = x.createLinearGradient(0, Y0 - hh, 0, Y0); gg.addColorStop(0, rgba(MINT, 0.25)); gg.addColorStop(1, rgba(MINT, 0));
      x.lineTo(X1, Y0); x.lineTo(X0, Y0); x.closePath(); x.fillStyle = gg; x.fill();
      x.restore();
    }
    // lock + "no direct trading"
    if (o.lock != null) {
      const u = e3(pr(t, o.lock, o.lock + 0.35));
      x.save(); x.globalAlpha *= u;
      icon(x, "lock", 0, 20, 96 * lerp(1.4, 1, back(u)), WHITE, 8);
      x.restore();
    }
    if (o.cross != null) {
      const u = e3(pr(t, o.cross, o.cross + 0.3));
      x.save(); x.globalAlpha *= u;
      const yy = h / 2 - 52;
      x.fillStyle = rgba(RED, 0.9); rr(x, -150, yy - 26, 300, 52, 26); x.fill();
      icon(x, "cross", 112, yy, 26, WHITE, 5);
      txt(x, "تداول مباشر", -14, yy + 1, { w: 600, size: 28, shadow: false });
      x.restore();
    }
    x.restore();
  }

  function gauge(x, t, o) {
    const e = env(t, o.t0, o.t1, 0.45, 0.3); if (!e) return;
    const r = o.r ?? 150;
    x.save();
    x.globalAlpha = e.a;
    x.translate(o.cx, o.cy + bob(t, 3, 3));
    const sc = lerp(0.7, 1, back(e.ui)); x.scale(sc, sc);
    glass(x, 0, 20, r * 2.6, r * 2.35, 34, { glow: rgba(MINT, 0.35 * e3(pr(t, o.hit, o.hit + 0.3))) });
    const a0 = Math.PI, a1 = 2 * Math.PI;
    x.lineCap = "round";
    x.lineWidth = 22; x.strokeStyle = "rgba(255,255,255,0.12)";
    x.beginPath(); x.arc(0, 50, r, a0, a1); x.stroke();
    const u = eio(pr(t, o.sweep0, o.hit));
    const val = Math.round(o.val * u);
    x.strokeStyle = MINT; x.shadowColor = rgba(MINT, 0.7); x.shadowBlur = U.px(16);
    if (u > 0.002) { x.beginPath(); x.arc(0, 50, r, a0, a0 + Math.PI * (val / 100)); x.stroke(); }
    shadowOff(x);
    // threshold tick at 50
    x.strokeStyle = WHITE; x.lineWidth = 4;
    const ta = a0 + Math.PI * 0.5;
    x.beginPath(); x.moveTo(Math.cos(ta) * (r - 26), 50 + Math.sin(ta) * (r - 26)); x.lineTo(Math.cos(ta) * (r + 26), 50 + Math.sin(ta) * (r + 26)); x.stroke();
    txt(x, String(val), 0, 26, { fam: LAT, w: 800, size: 96, ltr: true, color: u > 0.99 ? MINT : WHITE });
    txt(x, "Edge Score", 0, 104, { fam: LAT, w: 500, size: 32, ltr: true, color: "rgba(255,255,255,0.8)" });
    if (o.check != null) {
      const k = e3(pr(t, o.check, o.check + 0.3));
      x.save(); x.globalAlpha *= k; x.translate(r * 1.02, -r * 0.62); x.scale(lerp(1.6, 1, back(k)), lerp(1.6, 1, back(k)));
      x.fillStyle = MINT; x.beginPath(); x.arc(0, 0, 30, 0, Math.PI * 2); x.fill();
      icon(x, "check", 0, 0, 40, "#0b0d10", 7);
      x.restore();
    }
    x.restore();
  }

  function bigNumber(x, t, o) {
    const e = env(t, o.t0, o.t1, 0.25, 0.35); if (!e) return;
    const u = o.count ? e3(pr(t, o.t0, o.t0 + (o.count.d ?? 1.0))) : 1;
    const val = o.count ? o.count.fmt(o.count.to * u) : o.text;
    x.save();
    x.globalAlpha = e.a;
    x.translate(o.cx, o.cy);
    const sc = lerp(1.35, 1, back(e.ui, 1.4)) * (1 + 0.025 * e3(pr(t, o.t0, o.t1)));
    x.scale(sc, sc);
    if (o.glow) { const gr = x.createRadialGradient(0, 0, 0, 0, 0, o.size * 2.4); gr.addColorStop(0, rgba(o.glow, 0.28)); gr.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = gr; x.fillRect(-o.size * 3, -o.size * 2, o.size * 6, o.size * 4); }
    txt(x, val, 0, 0, { fam: o.fam || LAT, w: o.w ?? 800, size: o.size, ltr: !o.fam, color: o.color || WHITE, sc: o.glow ? rgba(o.glow, 0.6) : null, sb: 34, sdy: 0 });
    if (o.label) txt(x, o.label, 0, o.size * 0.78, { w: 500, size: o.size * 0.3, color: "rgba(255,255,255,0.85)", alpha: e3(pr(t, o.t0 + 0.25, o.t0 + 0.6)) });
    if (o.label0) txt(x, o.label0, 0, -o.size * 0.8, { w: 500, size: o.size * 0.3, color: "rgba(255,255,255,0.85)", alpha: e3(pr(t, o.t0 + 0.1, o.t0 + 0.45)) });
    x.restore();
  }

  // six-stage row (RTL: stage 1 on the right)
  const STAGES = [
    { n: "1", en: "Seed", ar: "التأسيس", amt: "$5,000", icon: "seed" },
    { n: "2", en: "Incubation", ar: "الحضانة", amt: "$20,000", icon: "egg" },
    { n: "3", en: "Acceleration", ar: "التسارع", amt: "$100,000", icon: "rocket" },
    { n: "4", en: "Pro", ar: "برو", amt: "$200,000", icon: "star" },
    { n: "5", en: "Pro 500", ar: "برو 500", amt: "$500,000", icon: "p500" },
    { n: "6", en: "Pro M", ar: "برو مليون", amt: "$1,000,000", icon: "crown" },
  ];
  function stageTile(x, t, i, cx, cy, s, a, lit, appearU) {
    const st = STAGES[i];
    const sc = lerp(0.6, 1, back(appearU)) * (1 + 0.06 * lit);
    x.save();
    x.globalAlpha = a * lerp(0.62, 1, lit);
    x.translate(cx, cy + bob(t, i + 1, 3)); x.scale(sc, sc);
    glass(x, 0, 0, s, s * 1.18, s * 0.16, { glow: lit > 0.02 ? rgba(i === 5 ? WHITE : MINT, 0.6 * lit) : null, rim: lit > 0.5 ? (i === 5 ? WHITE : MINT) : null, tint: MINT, tk: lit });
    icon(x, st.icon, 0, -s * 0.28, s * 0.36, lit > 0.5 ? WHITE : "rgba(255,255,255,0.6)", Math.max(4, s * 0.026));
    txt(x, st.en, 0, s * 0.06, { fam: LAT, w: 700, size: s * (st.en.length > 9 ? 0.118 : 0.14), ltr: true, shadow: false });
    txt(x, st.ar, 0, s * 0.2, { w: 500, size: s * 0.105, color: "rgba(255,255,255,0.8)", shadow: false });
    x.fillStyle = "rgba(255,255,255,0.12)"; x.fillRect(-s * 0.36, s * 0.29, s * 0.72, 2);
    txt(x, "تمويل حتى", 0, s * 0.355, { w: 500, size: s * 0.082, color: "rgba(255,255,255,0.65)", shadow: false });
    txt(x, st.amt, 0, s * 0.45, { fam: LAT, w: 700, size: s * (st.amt.length > 8 ? 0.1 : 0.115), ltr: true, color: lit > 0.5 ? MINT : "rgba(255,255,255,0.8)", shadow: false });
    badge(x, s * 0.4, -s * 0.5, s * 0.115, st.n, RED, 1);
    x.restore();
  }
  function stageRow(x, t, o) {
    const e = env(t, o.t0, o.t1, 0.3, 0.3); if (!e) return;
    const s = o.s ?? 220, gap = o.gap ?? 34, n = 6;
    const total = n * s + (n - 1) * gap, xr = o.cx + total / 2 - s / 2;
    // connector line (behind), filling mint up to the latest lit stage
    const xs = STAGES.map((_, i) => xr - i * (s + gap));
    let litMax = -1;
    (o.lit || []).forEach((lt, i) => { if (lt != null && t >= lt) litMax = i; });
    x.save();
    x.globalAlpha = e.a * 0.9;
    x.strokeStyle = "rgba(255,255,255,0.16)"; x.lineWidth = 4;
    x.beginPath(); x.moveTo(xs[0], o.cy); x.lineTo(xs[5], o.cy); x.stroke();
    if (litMax >= 0) {
      const lt = o.lit[litMax];
      const k = litMax > 0 ? e3(pr(t, lt - 0.3, lt + 0.1)) : 1;
      const xe = litMax > 0 ? lerp(xs[litMax - 1], xs[litMax], k) : xs[0];
      x.strokeStyle = MINT; x.shadowColor = rgba(MINT, 0.8); x.shadowBlur = U.px(14);
      x.beginPath(); x.moveTo(xs[0], o.cy); x.lineTo(xe, o.cy); x.stroke();
    }
    x.restore();
    for (let i = 0; i < n; i++) {
      const ap = o.appear ? o.appear[i] : o.t0;
      if (t < ap) continue;
      const au = pr(t, ap, ap + 0.4);
      const lt = o.lit ? o.lit[i] : null;
      const lit = lt != null ? e3(pr(t, lt, lt + 0.3)) : 0;
      stageTile(x, t, i, xs[i], o.cy, s, e.a * e3(au), lit, au);
      if (lt != null && t >= lt && t < lt + 0.5) { // flash ring on light-up
        const k = pr(t, lt, lt + 0.5);
        x.save(); x.globalAlpha = e.a * (1 - k) * 0.8; x.strokeStyle = i === 5 ? WHITE : MINT; x.lineWidth = 3;
        x.beginPath(); x.roundRect(xs[i] - s / 2 - 20 * k - 6, o.cy - s * 0.59 - 20 * k - 6, s + 40 * k + 12, s * 1.18 + 40 * k + 12, s * 0.18); x.stroke(); x.restore();
      }
    }
  }

  function ring(x, t, o) {
    const e = env(t, o.t0, o.t1, 0.45, 0.3); if (!e) return;
    const r = o.r ?? 120;
    x.save();
    x.globalAlpha = e.a;
    x.translate(o.cx, o.cy + bob(t, 5, 3));
    x.scale(lerp(0.7, 1, back(e.ui)), lerp(0.7, 1, back(e.ui)));
    glass(x, 0, 20, r * 2.7, r * 3.0, 34, {});
    x.lineWidth = 20; x.lineCap = "round";
    x.strokeStyle = "rgba(255,255,255,0.12)"; x.beginPath(); x.arc(0, -10, r, 0, Math.PI * 2); x.stroke();
    const u = eio(pr(t, o.fill, o.fill + 1.2));
    x.strokeStyle = MINT; x.shadowColor = rgba(MINT, 0.7); x.shadowBlur = U.px(16);
    if (u > 0.002) { x.beginPath(); x.arc(0, -10, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.8 * u); x.stroke(); }
    shadowOff(x);
    txt(x, Math.round(80 * u) + "%", 0, -6, { fam: LAT, w: 800, size: 74, ltr: true });
    txt(x, "حتى", 0, -66, { w: 400, size: 26, color: "rgba(255,255,255,0.7)", shadow: false });
    txt(x, o.label, 0, r + 62, { w: 600, size: 34 });
    x.restore();
  }

  function checklist(x, t, o) {
    const e = env(t, o.t0, o.t1, 0.45, 0.3); if (!e) return;
    const w = o.w ?? 560, rowH = 74, h = 120 + rowH * o.items.length;
    x.save();
    x.globalAlpha = e.a;
    x.translate(o.cx, o.cy + bob(t, 6, 3));
    x.scale(lerp(0.85, 1, back(e.ui, 1.2)), lerp(0.85, 1, back(e.ui, 1.2)));
    glass(x, 0, 0, w, h, 28, {});
    const R0 = w / 2 - 40, T0 = -h / 2 + 56;
    icon(x, "list", R0 - 20, T0, 40, WHITE, 4);
    txt(x, o.title, R0 - 60, T0, { w: 700, size: 36, align: "right" });
    x.fillStyle = "rgba(255,255,255,0.12)"; x.fillRect(-w / 2 + 30, T0 + 34, w - 60, 2);
    o.items.forEach((it, i) => {
      if (t < it.t) return;
      const k = e3(pr(t, it.t, it.t + 0.3));
      const hl = it.hl != null ? e3(pr(t, it.hl, it.hl + 0.3)) : 0;
      const yy = T0 + 80 + i * rowH;
      x.save(); x.globalAlpha *= k; x.translate((1 - k) * 30, 0);
      if (hl > 0) { x.fillStyle = rgba(RED, 0.85 * hl); rr(x, -w / 2 + 24, yy - 30, w - 48, 60, 14); x.fill(); }
      x.fillStyle = hl > 0.5 ? WHITE : MINT; x.beginPath(); x.arc(R0 - 14, yy, 15, 0, Math.PI * 2); x.fill();
      icon(x, hl > 0.5 ? "alert" : "check", R0 - 14, yy, hl > 0.5 ? 18 : 20, hl > 0.5 ? RED : "#0b0d10", 4);
      txt(x, it.text, R0 - 48, yy + 1, { w: 500, size: 32, align: "right", shadow: false });
      if (it.icon) icon(x, it.icon, -w / 2 + 62, yy, 34, "rgba(255,255,255,0.55)", 3.5);
      x.restore();
    });
    x.restore();
  }

  function brushWord(x, t, o) {
    const e = env(t, o.t0, o.t1, 0.35, 0.3); if (!e) return;
    x.save();
    x.globalAlpha = e.a;
    x.translate(o.cx, o.cy);
    x.rotate(o.rot ?? -0.05);
    const tw = measure(x, o.text, o.w ?? 800, o.size, AR);
    const u = e3(pr(t, o.t0 + 0.15, o.t0 + 0.6));
    brush(x, tw / 2 + 30, o.size * 0.62, -tw / 2 - 30, o.size * 0.5, o.size * 0.3, u, o.ul || RED, 9);
    const k = e3(e.ui);
    x.translate(0, (1 - k) * 20);
    txt(x, o.text, 0, 0, { w: o.w ?? 800, size: o.size });
    if (o.badge) { badge(x, tw / 2 + 64, -o.size * 0.42, 34, o.badge, RED, e3(pr(t, o.t0 + 0.1, o.t0 + 0.4))); }
    x.restore();
  }

  function chip(x, cx, cy, label, val, a, glowC) {
    x.save();
    x.globalAlpha = a;
    const w = 300, h = 76;
    glass(x, cx, cy, w, h, 38, { glow: glowC ? rgba(glowC, 0.6) : null, rim: glowC });
    txt(x, label, cx + w / 2 - 28, cy + 1, { w: 600, size: 28, align: "right", shadow: false });
    txt(x, val, cx - w / 2 + 26, cy + 1, { fam: LAT, w: 700, size: 30, ltr: true, align: "left", color: glowC || WHITE, shadow: false });
    x.restore();
  }

  // arc link between two points with optional moving pulses
  function arcLink(x, t, o) {
    const e = env(t, o.t0, o.t1, 0.6, 0.3); if (!e) return null;
    const u = e3(e.ui);
    const [ax, ay] = o.a, [bx, by] = o.b, mx = (ax + bx) / 2, my = Math.min(ay, by) - (o.lift ?? 160);
    const pt = (k) => [(1 - k) * (1 - k) * ax + 2 * (1 - k) * k * mx + k * k * bx, (1 - k) * (1 - k) * ay + 2 * (1 - k) * k * my + k * k * by];
    x.save();
    x.globalAlpha = e.a;
    x.setLineDash([2, 14]); x.lineCap = "round";
    x.strokeStyle = rgba(MINT, 0.85); x.lineWidth = 5; x.shadowColor = rgba(MINT, 0.6); x.shadowBlur = U.px(10);
    x.beginPath();
    for (let i = 0; i <= 50; i++) { const k = (i / 50) * u; const p = pt(k); i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); }
    x.lineDashOffset = -t * 40;
    x.stroke();
    x.setLineDash([]);
    x.restore();
    if (o.label && u > 0.6) {
      const p = pt(0.5);
      x.save(); x.globalAlpha = e.a * e3(pr(t, o.t0 + 0.4, o.t0 + 0.8));
      const lw = measure(x, o.label, 600, 28) + 80;
      glass(x, p[0], p[1] - 4, lw, 56, 28, { rim: MINT });
      icon(x, "link", p[0] + lw / 2 - 34, p[1] - 4, 30, MINT, 4);
      txt(x, o.label, p[0] - 14, p[1] - 3, { w: 600, size: 28, shadow: false });
      x.restore();
    }
    return pt;
  }

  function sparkles(x, t, t0, d, cx, cy, R, n, seed, color) {
    const k = pr(t, t0, t0 + d); if (k <= 0 || k >= 1) return;
    x.save();
    for (let i = 0; i < n; i++) {
      const a = U.hash(seed, i, 1) * Math.PI * 2, sp = 0.4 + 0.6 * U.hash(seed, i, 2);
      const r = R * e2(k) * sp, sz = (2 + 5 * U.hash(seed, i, 3)) * (1 - k);
      x.globalAlpha = (1 - k) * 0.9;
      x.fillStyle = i % 3 === 0 ? (color || MINT) : WHITE;
      x.beginPath(); x.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.75 - 40 * k, sz, 0, Math.PI * 2); x.fill();
    }
    x.restore();
  }

  function flare(x, t, t0, d, cx, cy, color) {
    const k = pr(t, t0, t0 + d); if (k <= 0 || k >= 1) return;
    const a = Math.sin(Math.PI * k);
    x.save();
    x.globalCompositeOperation = "lighter";
    const gr = x.createRadialGradient(cx, cy, 0, cx, cy, 900);
    gr.addColorStop(0, rgba(color, 0.32 * a)); gr.addColorStop(0.4, rgba(color, 0.1 * a)); gr.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = gr; x.fillRect(0, 0, W, H);
    // short anamorphic streak through the flare centre only
    const sg = x.createLinearGradient(cx - 420, cy, cx + 420, cy);
    sg.addColorStop(0, "rgba(0,0,0,0)"); sg.addColorStop(0.5, rgba(color, 0.35 * a)); sg.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = sg; x.fillRect(cx - 420, cy - 2, 840, 4);
    x.restore();
  }

  function seriesCard(x, t, o) {
    const e = env(t, o.t0, o.t1, 0.5, 0.3); if (!e) return;
    const w = 560, h = 330;
    x.save();
    x.globalAlpha = e.a;
    x.translate(o.cx, o.cy + bob(t, 7, 3));
    x.scale(lerp(0.85, 1, back(e.ui, 1.2)), lerp(0.85, 1, back(e.ui, 1.2)));
    glass(x, 0, 0, w, h, 28, {});
    txt(x, "الحلقات القادمة", w / 2 - 40, -h / 2 + 56, { w: 700, size: 38, align: "right" });
    txt(x, "تفاصيل وقواعد كل مرحلة", w / 2 - 40, -h / 2 + 108, { w: 400, size: 28, align: "right", color: "rgba(255,255,255,0.72)" });
    const n = 5, gap = 18, sw = (w - 80 - gap * (n - 1)) / n, y0 = 40;
    for (let i = 0; i < n; i++) {
      const xr = w / 2 - 40 - sw / 2 - i * (sw + gap);
      const on = i === 0 ? 1 : i === 1 ? 0.5 + 0.5 * Math.sin(t * 5) : 0;
      x.fillStyle = i === 0 ? MINT : i === 1 ? rgba(WHITE, 0.35 + 0.4 * on) : "rgba(255,255,255,0.14)";
      rr(x, xr - sw / 2, y0 - 8, sw, 16, 8); x.fill();
      txt(x, String(i + 1), xr, y0 + 44, { fam: LAT, w: 700, size: 30, ltr: true, color: i < 2 ? WHITE : "rgba(255,255,255,0.4)", shadow: false });
    }
    const k = e3(pr(t, o.next, o.next + 0.4));
    x.save(); x.globalAlpha *= k;
    x.fillStyle = RED; rr(x, -w / 2 + 30, h / 2 - 78, 230, 54, 27); x.fill();
    txt(x, "الحلقة 2", -w / 2 + 165, h / 2 - 50, { w: 700, size: 28, shadow: false });
    icon(x, "arrow", -w / 2 + 64, h / 2 - 51, 30, WHITE, 5);
    x.restore();
    x.restore();
  }

  // axi slash wipe (white band with a red leading stroke) — full cover at fc
  function slashWipe(x, t, tc, d) {
    if (t < tc - d / 2 || t > tc + d / 2) return;
    const u = cl((t - tc + d / 2) / d);
    const th = (58 * Math.PI) / 180, nx = Math.sin(th), ny = Math.cos(th);
    const ext = W * nx + H * ny, bw = ext + 300;
    const c = lerp(-bw / 2 - 160, ext + bw / 2 + 160, u);
    const tx = Math.cos(th), ty = -Math.sin(th), L = 4000;
    const quad = (p0, p1) => { x.beginPath(); x.moveTo(nx * p0 - tx * L, ny * p0 - ty * L); x.lineTo(nx * p0 + tx * L, ny * p0 + ty * L); x.lineTo(nx * p1 + tx * L, ny * p1 + ty * L); x.lineTo(nx * p1 - tx * L, ny * p1 - ty * L); x.closePath(); };
    x.save();
    x.fillStyle = "#F4F5F6"; quad(c - bw / 2, c + bw / 2); x.fill();
    x.fillStyle = RED; quad(c + bw / 2 + 30, c + bw / 2 + 52); x.fill();
    x.restore();
  }

  async function endCard(x, t, t0) {
    if (t < t0) return;
    const lt = t - t0;
    x.save();
    x.fillStyle = "#050607"; x.fillRect(0, 0, W, H);
    const gr = x.createRadialGradient(960, 470, 0, 960, 470, 900);
    gr.addColorStop(0, rgba(MINT, 0.09)); gr.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = gr; x.fillRect(0, 0, W, H);
    const axi = await im("axi_white.png");
    const k = e3(pr(lt, 0.15, 0.75)), sc = lerp(1.18, 1, e3(pr(lt, 0.15, 1.2))) * (1 + 0.02 * pr(lt, 0, 6));
    const w = 380, h = (702 / 1334) * w;
    x.globalAlpha = k;
    x.save(); x.translate(960, 400); x.scale(sc, sc);
    const lw = measure(x, "Select", 300, 150, LAT, 3), tot = w + 40 + lw;
    shadowOn(x, 0.6, 40, 0, rgba(MINT, 0.3));
    x.drawImage(axi, -tot / 2, -h / 2 - 8, w, h);
    shadowOff(x);
    txt(x, "Select", -tot / 2 + w + 40, 4, { fam: LAT, w: 300, size: 150, ltr: true, align: "left", ls: 3, sb: 30, sdy: 0, sc: rgba(MINT, 0.3) });
    x.fillStyle = RED;
    const ul = e3(pr(lt, 0.5, 1.1));
    x.beginPath(); x.moveTo(-tot / 2, h / 2 + 30); x.lineTo(-tot / 2 + tot * ul, h / 2 + 30); x.lineTo(-tot / 2 + tot * ul - 12, h / 2 + 40); x.lineTo(-tot / 2 - 12, h / 2 + 40); x.closePath(); x.fill();
    x.restore();
    const k2 = e3(pr(lt, 0.8, 1.3));
    txt(x, "انضم إلى آكسي سيليكت", 960, 640 + (1 - k2) * 16, { w: 700, size: 58, alpha: k2 / Math.max(k, 0.001) });
    txt(x, "axi.com", 960, 716, { fam: LAT, w: 500, size: 32, ltr: true, color: "rgba(255,255,255,0.7)", alpha: e3(pr(lt, 1.1, 1.6)) / Math.max(k, 0.001) });
    txt(x, "تخضع عمليات تخصيص رأس المال في Axi Select لشروط وأحكام البرنامج.", 960, 1010, { w: 400, size: 22, color: "rgba(255,255,255,0.5)", alpha: e3(pr(lt, 1.3, 1.8)) / Math.max(k, 0.001), shadow: false });
    x.restore();
    // fade to black
    const fo = pr(t, t0 + 5.2, t0 + 6.05);
    if (fo > 0) { x.fillStyle = `rgba(0,0,0,${e2(fo)})`; x.fillRect(0, 0, W, H); }
  }

  function subtitles(x, t) {
    if (NO_SUBS) return;
    let ci = -1;
    for (let i = 0; i < SUBS.length; i++) if (v(SUBS[i][0]) - 0.05 <= t) ci = i;
    if (ci >= 0) {
      const c = SUBS[ci], a0 = v(c[0]), a1 = v(c[1]);
      const nx = ci + 1 < SUBS.length ? v(SUBS[ci + 1][0]) - 0.05 : 1e9;
      const end = Math.min(a1 + 0.12, nx);
      if (t > end) return;
      const a = e2(pr(t, a0 - 0.05, a0 + 0.06)) * (1 - e2(pr(t, end - 0.1, end)));
      x.save();
      font(x, 500, 36, AR);
      x.direction = "rtl";
      const w = x.measureText(c[2]).width + 56;
      x.globalAlpha = a;
      x.fillStyle = "rgba(6,7,9,0.55)";
      rr(x, 960 - w / 2, 1012 - 30, w, 60, 14); x.fill();
      x.restore();
      txt(x, c[2], 960, 1013, { w: 500, size: 36, alpha: a, sa: 0.8, sb: 8, sdy: 2 });
    }
  }

  async function watermark(x, t) {
    if (t < v(0) || t > v(110.9)) return;
    const axi = await im("axi_white.png");
    const w = 74, h = (702 / 1334) * w;
    x.save(); x.globalAlpha = 0.55 * e2(pr(t, v(0), v(0.4)));
    x.drawImage(axi, W - 64 - w, 46, w, h);
    x.restore();
  }

  // ------------------------------------------------------------------ the timeline (VO times)
  // shot framings (see work/edl_build.py): XW = L4 in the extended studio, L5 medium, L1 three-quarter (Rabee left),
  // L2 close-up, L3 profile (Rabee right), L4 wide.
  function floorShapes(t) {
    const sh = [];
    const C = FLOOR_C;
    // D: drop ripple + soft mint pad (VO 14.88-18.50)
    if (t >= v(14.8) && t < v(18.6)) {
      const k = pr(t, v(14.88), v(16.2));
      sh.push({ type: "ring", cx: C[0], cy: C[1], r: 120 + 900 * e2(k), w: 34, color: MINT, a: (1 - k) * 0.9, ry: 0.22 });
      sh.push({ type: "ellipse", cx: C[0], cy: C[1], r: 420, color: MINT, a: 0.35 * e3(pr(t, v(14.88), v(15.4))), ry: 0.24 });
    }
    // F2: allocation account appears (VO 27-31.92): white pool lift
    if (t >= v(27.7) && t < v(31.95)) sh.push({ type: "ellipse", cx: C[0], cy: C[1], r: 640, color: "#ffffff", a: 0.18, ry: 0.24 });
    // H: the Seed tile under him lights mint at «الأولى» (VO 33.9)
    if (t >= v(33.4) && t < v(40.15)) {
      const k = e3(pr(t, v(33.9), v(34.4)));
      sh.push({ type: "grid", cx: C[0], fy: C[1], n: 4, m: 3, color: MINT, a: 0.75 * k, on: (i, j) => (i === 0 && j === 0 ? 1 : Math.abs(i) + Math.abs(j) <= 2 ? 0.25 * U.hash(i + 9, j + 9, 4) : 0) });
      sh.push({ type: "ring", cx: C[0], cy: C[1], r: 160 + 700 * e2(pr(t, v(33.9), v(35))), w: 26, color: MINT, a: 0.8 * (1 - pr(t, v(33.9), v(35))), ry: 0.22 });
      if (t > v(38.6)) sh.push({ type: "ellipse", cx: C[0], cy: C[1], r: 520, color: MINT, a: 0.35 * e3(pr(t, v(38.62), v(39.1))) * (1 - pr(t, v(39.4), v(40.1)) * 0.5), ry: 0.24 });
    }
    // I / L / M2: soft mint pool under the stage row
    if ((t >= v(40.1) && t < v(44.72)) || (t >= v(50.36) && t < v(56.3)) || (t >= v(58.4) && t < v(60.3))) {
      sh.push({ type: "ellipse", cx: C[0], cy: C[1], r: 560, color: MINT, a: 0.22, ry: 0.24 });
      if (t >= v(59.24) && t < v(60.3)) sh.push({ type: "ring", cx: C[0], cy: C[1], r: 160 + 900 * e2(pr(t, v(59.24), v(60.3))), w: 34, color: "#ffffff", a: 0.8 * (1 - pr(t, v(59.24), v(60.3))), ry: 0.22 });
    }
    // O1: white pool (simplify)
    if (t >= v(69.5) && t < v(77.8)) sh.push({ type: "ellipse", cx: C[0], cy: C[1], r: 600, color: "#ffffff", a: 0.16 * e3(pr(t, v(69.6), v(70.2))), ry: 0.24 });
    // R: mint pulses on each copied trade
    if (t >= v(84.7) && t < v(91.05)) {
      sh.push({ type: "ellipse", cx: C[0], cy: C[1], r: 520, color: MINT, a: 0.2, ry: 0.24 });
      for (const tt of [84.7, 86.9, 87.6, 88.15, 88.9]) {
        const k = pr(t, v(tt), v(tt + 1.0));
        if (k > 0 && k < 1) sh.push({ type: "ring", cx: C[0], cy: C[1], r: 140 + 800 * e2(k), w: 26, color: MINT, a: 0.7 * (1 - k), ry: 0.22 });
      }
    }
    // U: red floor grid (the drawdown limit)
    if (t >= v(102.15) && t < v(105.6)) {
      const k = e3(pr(t, v(102.15), v(102.6)));
      sh.push({ type: "grid", cx: C[0], fy: C[1], n: 5, m: 3, color: RED, a: 0.9 * k, on: (i, j) => (Math.abs(i) <= 1 && j >= -1 ? 1 : 0.55 * (U.hash(i + 20, j + 20, 5) > 0.45 ? 1 : 0)) });
      sh.push({ type: "ring", cx: C[0], cy: C[1], r: 160 + 900 * e2(pr(t, v(102.15), v(103.3))), w: 34, color: RED, a: 0.85 * (1 - pr(t, v(102.15), v(103.3))), ry: 0.22 });
    }
    return sh;
  }

  async function drawAll(x, t, S) {
    const XWshot = S.shot && S.shot.k_vcam;
    if (XWshot) floorLight(x, S, floorShapes(t), 1.8);
    if (NO_TEXT) return;

    // A — XW: «Axi Select» lockup in the void (VO 1.66)
    await drawLockup(x, t, v(2.02), v(3.95), 960, 290, 1.0);

    // B — L5: what this video covers
    tile(x, t, { t0: v(4.54), t1: v(8.70), cx: 1560, cy: 400, icon: "user_plus", label: "الاشتراك", glow: MINT, seed: 1, s: 220 });
    tile(x, t, { t0: v(5.30), t1: v(8.70), cx: 360, cy: 400, icon: "steps", label: "التقدّم في المراحل", glow: MINT, seed: 2, s: 220 });

    // C — L1 (Rabee left): the Axi Select trading account
    await card(x, t, { t0: v(9.70), t1: v(14.55), cx: 1430, cy: 430, w: 600, h: 400, kind: "trading", title: "حساب تداول", big: "Axi Select", bigLat: true, sub: "مع شركة Axi", chart: v(12.9) });

    // D — XW drop: Edge Score gauge (left) — VO 16.04 «Edge Score», 18.02 «50»
    gauge(x, t, { t0: v(15.9), t1: v(18.18), cx: 480, cy: 330, r: 140, val: 50, sweep0: v(16.6), hit: v(18.02), check: v(18.1) });

    // E — L5: the two conditions
    tile(x, t, { t0: v(18.50), t1: v(22.30), cx: 360, cy: 420, icon: "target", inner: "50+", label: "Edge Score", label2: "علامة لا تقل عن 50", glow: MINT, seed: 3, s: 230, ls: 34 });
    await card(x, t, { t0: v(19.10), t1: v(22.30), cx: 1545, cy: 430, w: 500, h: 330, kind: "trading", title: "حساب التداول", bal: { t: v(19.30), to: 500, lab: "رصيد لا يقل عن" }, sub: "حسابك الخاص" });

    // F1 — L3 (Rabee right): Axi opens the allocation account (VO 25.92 «حساب التخصيص»)
    await card(x, t, { t0: v(22.70), t1: v(26.68), cx: 520, cy: 330, w: 520, h: 270, kind: "trading", title: "حساب التداول", big: "Axi Select", bigLat: true, s: 0.92 });
    await card(x, t, { t0: v(25.80), t1: v(26.68), cx: 560, cy: 690, w: 600, h: 300, kind: "alloc", title: "حساب التخصيص", big: "حساب آخر", sub: "تفتحه لك شركة Axi", glow: MINT });
    // F2 — XW: both accounts either side of him
    await card(x, t, { t0: v(27.78), t1: v(31.60), cx: 1520, cy: 330, w: 480, h: 260, kind: "trading", title: "حساب التداول", big: "Axi Select", bigLat: true, s: 0.9 });
    await card(x, t, { t0: v(28.05), t1: v(31.60), cx: 400, cy: 330, w: 520, h: 280, kind: "alloc", title: "حساب التخصيص", big: "مبلغ التمويل", sub: "تقدّمه لك شركة Axi", glow: MINT, s: 0.95 });
    arcLink(x, t, { t0: v(28.4), t1: v(31.60), a: [1290, 330], b: [650, 330], lift: 120 });

    // G — L2 «مبروك!»
    flare(x, t, v(31.92), 1.15, 420, 470, MINT);
    sparkles(x, t, v(31.95), 1.2, 420, 470, 460, 40, 11, MINT);
    brushWord(x, t, { t0: v(32.05), t1: v(33.08), cx: 420, cy: 480, text: "مبروك!", size: 110, ul: MINT, rot: -0.06 });

    // H — XW: first stage + $5,000
    stageSolo(x, t, 0, v(33.80), v(38.45), 960, 300, 230, v(33.90));
    bigNumber(x, t, { t0: v(38.62), t1: v(40.05), cx: 960, cy: 290, count: { to: 5000, d: 0.7, fmt: (n) => "$" + Math.round(n).toLocaleString("en-US") }, size: 150, glow: MINT, color: WHITE, label: "تمويل المرحلة الأولى" });
    sparkles(x, t, v(38.9), 1.2, 960, 290, 560, 46, 21, MINT);

    // I — XW: six stages; the row builds right to left, Seed lights at VO 44.18
    bigNumber(x, t, { t0: v(41.65), t1: v(42.40), cx: 960, cy: 330, text: "6", size: 220, glow: MINT, label: "مراحل" });
    stageRow(x, t, { t0: v(42.40), t1: v(44.38), cx: 960, cy: 330, s: 234, gap: 24, appear: [42.42, 42.62, 42.82, 43.02, 43.22, 43.42].map(v), lit: [v(44.18), null, null, null, null, null] });
    // J — L1: Incubation (VO 47.20)
    stageSolo(x, t, 1, v(44.85), v(47.68), 1450, 470, 300, v(47.20));
    // K — L5: Acceleration (VO 49.40)
    stageSolo(x, t, 2, v(48.10), v(50.05), 1610, 470, 290, v(49.40));
    // L — XW: Pro (52.20), Pro 500 (55.22)
    stageRow(x, t, { t0: v(50.36), t1: v(55.98), cx: 960, cy: 330, s: 234, gap: 24, lit: [v(50.36), v(50.36), v(50.36), v(52.20), v(55.22), null] });
    // M2 — XW: Pro M (59.24)
    stageRow(x, t, { t0: v(58.40), t1: v(60.0), cx: 960, cy: 330, s: 234, gap: 24, lit: [v(58.40), v(58.40), v(58.40), v(58.40), v(58.40), v(59.24)] });
    sparkles(x, t, v(59.3), 1.3, 960 - 2.5 * 258, 330, 420, 40, 31, WHITE);

    // N1 — L5: funding from Axi (VO 62.30)
    await card(x, t, { t0: v(62.30), t1: v(64.30), cx: 365, cy: 430, w: 520, h: 330, kind: "alloc", title: "تمويل من Axi", bal: { t: v(63.12), to: 5000, lab: "مثال: المرحلة الأولى" }, sub: "مبلغ تتداول به", glow: MINT });
    // N2 — L1: share of the profits (VO 66.06-67.62)
    ring(x, t, { t0: v(65.70), t1: v(67.78), cx: 1480, cy: 450, r: 120, fill: v(66.62), label: "حصتك من الأرباح" });

    // O — HOME, pull-out to WIDE (VO 69.22): your trading account (69.66), «بالإضافة إلى» (72.60), the funded allocation account (73.58)
    await card(x, t, { t0: v(69.84), t1: v(77.52), cx: 1500, cy: 345, w: 520, h: 350, kind: "trading", title: "حساب التداول", big: "حسابك", sub: "تتداول عليه بشكل اعتيادي", chart: v(70.9) });
    tilePlus(x, t, v(72.70), v(77.52), 960, 345);
    await card(x, t, { t0: v(73.58), t1: v(77.52), cx: 420, cy: 345, w: 520, h: 350, kind: "alloc", title: "حساب التخصيص", big: "مموَّل", sub: "مقدَّم من شركة Axi", glow: MINT });

    // P — L2 «ملاحظة مهمة»
    brushWord(x, t, { t0: v(77.88), t1: v(78.72), cx: 400, cy: 470, text: "ملاحظة مهمة", size: 84, ul: RED, badge: "!" });

    // Q — L3 (Rabee right): the allocation account cannot be traded directly; it is linked automatically
    await card(x, t, { t0: v(79.02), t1: v(84.40), cx: 560, cy: 330, w: 560, h: 300, kind: "alloc", title: "حساب التخصيص", big: "مموَّل من Axi", lock: v(80.14), cross: v(80.54), glow: MINT });
    await card(x, t, { t0: v(82.54), t1: v(84.40), cx: 560, cy: 760, w: 560, h: 240, kind: "trading", title: "حساب التداول", big: "حسابك", s: 0.95 });
    linkV(x, t, v(83.16), v(84.40), 560, 485, 640, "ربط تلقائي");

    // R — XW drop 2: every executed trade is copied with the multiplier
    await card(x, t, { t0: v(84.70), t1: v(90.70), cx: 1520, cy: 340, w: 480, h: 270, kind: "trading", title: "حساب التداول", big: "حسابك", s: 0.9 });
    await card(x, t, { t0: v(84.70), t1: v(90.70), cx: 400, cy: 340, w: 480, h: 270, kind: "alloc", title: "حساب التخصيص", big: "نسخ تلقائي", glow: MINT, s: 0.9 });
    const pt = arcLink(x, t, { t0: v(85.2), t1: v(90.70), a: [1300, 300], b: [620, 300], lift: 110 });
    if (pt) for (const [i, tt] of [86.66, 87.36, 87.88].entries()) {
      if (t < v(tt - 0.25) || t > v(91.0)) continue;
      const fade = 1 - e2(pr(t, v(90.70), v(91.0)));
      const k = pr(t, v(tt), v(tt + 1.15));
      if (t < v(tt)) { chip(x, 1520, 520 + i * 92, "شراء", "0.01 lot", e3(pr(t, v(tt - 0.25), v(tt))) * fade, null); continue; }
      if (k >= 1) { chip(x, 400, 520 + i * 92, "شراء", "0.1 lot", e3(pr(t, v(tt + 1.15), v(tt + 1.35))) * fade, MINT); continue; }
      const p = pt(eio(k));
      chip(x, p[0], p[1], "شراء", k < 0.5 ? "0.01 lot" : "0.1 lot", fade * (1 - e2(pr(k, 0.82, 1))), k < 0.5 ? null : MINT);
    }
    bigNumber(x, t, { t0: v(88.56), t1: v(90.66), cx: 960, cy: 100, text: "×10", size: 110, glow: MINT, label: "معامل الضرب · مثال: مرحلة Seed" });

    // S — L2: «احفظ كلمة معامل الضرب»
    brushWord(x, t, { t0: v(91.66), t1: v(95.62), cx: 410, cy: 440, text: "معامل الضرب", size: 104, ul: MINT, rot: -0.05 });
    timedChip(x, t, v(94.42), v(95.62), 410, 600, "في الحلقات القادمة");

    // T — L1: the rules of every stage (VO 98.12...), the drawdown row turns red at «وأهمها» (101.40)
    checklist(x, t, { t0: v(98.0), t1: v(101.84), cx: 1450, cy: 500, w: 580, title: "قواعد كل مرحلة", items: [
      { t: v(98.6), text: "درجة Edge", icon: "target" },
      { t: v(99.1), text: "هدف الربح", icon: "chart" },
      { t: v(99.6), text: "مدة المرحلة", icon: "calendar" },
      { t: v(100.1), text: "عدد الصفقات", icon: "trades" },
      { t: v(100.6), text: "الحد الأقصى للخسارة", icon: "shield", hl: v(101.40) },
    ] });

    // U — XW red: 10%
    drawdown(x, t, v(102.30), v(105.55));
    bigNumber(x, t, { t0: v(104.50), t1: v(105.55), cx: 960, cy: 290, text: "10%", size: 190, color: WHITE, glow: RED, label: "الحد الأقصى لانعكاس حساب التخصيص" });
    if (t >= v(104.7) && t <= v(105.6)) txt(x, "* قد تختلف النسبة حسب المرحلة وفق شروط البرنامج", 1880, 1050, { w: 400, size: 20, align: "right", color: "rgba(255,255,255,0.6)", alpha: e3(pr(t, v(104.7), v(105.0))) * (1 - e2(pr(t, v(105.55), v(105.75)))), shadow: false });

    // V — L5: upcoming chapters
    seriesCard(x, t, { t0: v(106.30), t1: v(110.55), cx: 1560, cy: 430, next: v(108.16) });
  }

  // single stage tile (medium shots)
  function stageSolo(x, t, i, t0, t1, cx, cy, s, litAt) {
    const e = env(t, t0, t1, 0.45, 0.3); if (!e) return;
    stageTile(x, t, i, cx, cy, s, e.a, e3(pr(t, litAt, litAt + 0.3)), e.ui);
    // 6-dot progress under it
    const n = 6, gap = 26, y = cy + s * 0.59 + 60;
    for (let k = 0; k < n; k++) {
      const xx = cx + (n / 2 - 0.5 - k) * gap;
      x.save(); x.globalAlpha = e.a;
      x.fillStyle = k < i ? MINT : k === i ? (t >= litAt ? MINT : WHITE) : "rgba(255,255,255,0.22)";
      x.beginPath(); x.arc(xx, y, k === i ? 8 : 6, 0, Math.PI * 2); x.fill(); x.restore();
    }
    if (t >= litAt && t < litAt + 0.6) sparkles(x, t, litAt, 0.6, cx, cy, 260, 22, 40 + i, MINT);
  }
  function tilePlus(x, t, t0, t1, cx, cy) {
    const e = env(t, t0, t1, 0.35, 0.3); if (!e) return;
    x.save(); x.globalAlpha = e.a; x.translate(cx, cy); const k = lerp(0.5, 1, back(e.ui)); x.scale(k, k);
    glass(x, 0, 0, 96, 96, 48, { rim: MINT });
    x.strokeStyle = WHITE; x.lineWidth = 7; x.lineCap = "round";
    x.beginPath(); x.moveTo(-22, 0); x.lineTo(22, 0); x.moveTo(0, -22); x.lineTo(0, 22); x.stroke();
    x.restore();
  }
  function linkV(x, t, t0, t1, cx, y0, y1, label) {
    const e = env(t, t0, t1, 0.5, 0.3); if (!e) return;
    const u = e3(e.ui);
    x.save(); x.globalAlpha = e.a;
    x.setLineDash([2, 14]); x.lineCap = "round"; x.lineDashOffset = t * 40;
    x.strokeStyle = MINT; x.lineWidth = 6; x.shadowColor = rgba(MINT, 0.6); x.shadowBlur = U.px(10);
    x.beginPath(); x.moveTo(cx, y1); x.lineTo(cx, lerp(y1, y0, u)); x.stroke(); x.setLineDash([]);
    x.restore();
    if (u > 0.5) {
      const my = (y0 + y1) / 2;
      x.save(); x.globalAlpha = e.a * e3(pr(t, t0 + 0.3, t0 + 0.7));
      glass(x, cx + 190, my, 250, 58, 29, { rim: MINT });
      icon(x, "link", cx + 190 + 90, my, 30, MINT, 4);
      txt(x, label, cx + 170, my + 1, { w: 600, size: 28, shadow: false });
      x.restore();
    }
  }
  function timedChip(x, t, t0, t1, cx, cy, label) {
    const e = env(t, t0, t1, 0.35, 0.3); if (!e) return;
    x.save(); x.globalAlpha = e.a;
    const w = measure(x, label, 600, 30) + 100;
    glass(x, cx, cy + (1 - e3(e.ui)) * 14, w, 62, 31, {});
    icon(x, "arrow", cx - w / 2 + 38, cy + (1 - e3(e.ui)) * 14, 30, WHITE, 5);
    txt(x, label, cx + 20, cy + 1 + (1 - e3(e.ui)) * 14, { w: 600, size: 30, shadow: false });
    x.restore();
  }
  function drawdown(x, t, t0, t1) {
    const e = env(t, t0, t1, 0.3, 0.3); if (!e) return;
    const u = e3(pr(t, t0, t0 + 1.6));
    const X0 = 520, X1 = 1400, Y0 = 170, Y1 = 470;
    x.save(); x.globalAlpha = e.a * 0.9;
    x.beginPath(); x.rect(X0 - 10, Y0 - 60, (X1 - X0 + 20) * u, Y1 - Y0 + 120); x.clip();
    x.strokeStyle = RED; x.lineWidth = 6; x.lineJoin = "round"; x.shadowColor = rgba(RED, 0.8); x.shadowBlur = U.px(18);
    x.beginPath();
    for (let i = 0; i <= 80; i++) {
      const k = i / 80, yy = lerp(Y0, Y1, Math.pow(k, 1.4)) + 26 * Math.sin(k * 23) * (1 - k * 0.5);
      i ? x.lineTo(lerp(X0, X1, k), yy) : x.moveTo(X0, yy);
    }
    x.stroke();
    x.restore();
    // limit line
    x.save(); x.globalAlpha = e.a * e3(pr(t, t0 + 0.8, t0 + 1.2));
    x.setLineDash([16, 12]); x.strokeStyle = "rgba(255,255,255,0.7)"; x.lineWidth = 3;
    x.beginPath(); x.moveTo(X0 - 40, Y1 + 10); x.lineTo(X1 + 40, Y1 + 10); x.stroke(); x.restore();
  }

  async function drawCover(x) { // thumbnail: Rabee close-up with the chapter title on the left
    const g = x.createLinearGradient(0, 0, 1100, 0);
    g.addColorStop(0, "rgba(0,0,0,0.78)"); g.addColorStop(0.75, "rgba(0,0,0,0.25)"); g.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const axi = await im("axi_white.png");
    x.drawImage(axi, 90, 80, 150, (702 / 1334) * 150);
    txt(x, "الحلقة 1 من 5", 810, 125, { w: 500, size: 40, align: "right", color: "rgba(255,255,255,0.8)" });
    x.save(); x.translate(500, 520); x.rotate(-0.08);
    txt(x, "(1) كيف تبدأ", 320, -110, { w: 700, size: 86, align: "right" });
    txt(x, "مع Axi Select", 340, 30, { w: 800, size: 112, align: "right" });
    brush(x, 350, 112, -360, 120, 30, 1, MINT, 9);
    x.restore();
    badge(x, 150, 900, 44, "6", RED);
    txt(x, "مراحل حتى مليون دولار", 220, 902, { w: 600, size: 48, align: "left" });
  }
  RRC.hook("after_post", async (S, x) => {
    U.reset(x);
    const t = S.t;
    if (COVER) { await drawCover(x); U.reset(x); return; }
    if (S.shot && S.shot.k_title) { drawTitle(x, t); U.reset(x); return; }
    if (S.shot && S.shot.k_end) { await endCard(x, t, v(110.88)); U.reset(x); slashWipe(x, t, v(110.88), 0.36); U.reset(x); return; }
    await drawAll(x, t, S);
    U.reset(x);
    if (!NO_TEXT) await watermark(x, t);
    subtitles(x, t);
    slashWipe(x, t, v(110.88), 0.36);
    U.reset(x);
  });

  RRC.register("SPECIALS", "k_card", {
    allow: [],
    draw(S, p, x) { x.fillStyle = "#050607"; x.fillRect(0, 0, S.W, S.H); },
  });
})();
