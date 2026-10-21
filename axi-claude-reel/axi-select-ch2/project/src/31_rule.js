
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
