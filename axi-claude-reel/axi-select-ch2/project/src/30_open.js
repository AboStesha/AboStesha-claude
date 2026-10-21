
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
