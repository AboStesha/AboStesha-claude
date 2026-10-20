
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
