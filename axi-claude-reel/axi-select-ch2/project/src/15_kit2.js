
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
