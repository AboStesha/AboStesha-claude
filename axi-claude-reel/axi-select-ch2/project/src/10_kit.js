
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
