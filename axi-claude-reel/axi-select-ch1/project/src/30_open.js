
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
