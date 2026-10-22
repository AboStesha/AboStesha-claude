
  // ================================================================== GROUP "edge" (prefix eg_): B-ROLL 3 (beat E, k_broll 3)
  // «علامة Edge Score»: the minimum Edge Score of every stage as a bar chart (5 px per point on a y 790 baseline, read
  // right to left: Seed 50 DONE, Incubation 60 GHOST -> LIT, Acceleration 70, Pro / Pro 500 / Pro M 90 DIM); Incubation
  // lights, the chart pushes in on it, a meter fills it while the '60' counter runs and lands on the /s/ of «ستّين».
  // Spec: scratchpad/ep2/broll3_spec.json. VO 21.85-28.05 (output 22.48-28.68, f 562-717). Times are VO s (tv = t - P).
  // Hard cut in from D on the lit world (brScene, cz0 14, bokehY 366) and a hard cut out to F at full opacity (no exit).
  const eg_X = [1600, 1350, 1100, 850, 600, 350]; // column centres, k 0..5 = Seed .. Pro M (RTL: Seed on the right)
  const eg_SC = [50, 60, 70, 90, 90, 90];          // minimum Edge Score per stage (axi.com Axi Select table)
  const eg_BASE = 790, eg_PX = 5, eg_BW = 112, eg_CW = 220, eg_CY = 806, eg_CH = 60;
  const eg_top = (k) => eg_BASE - eg_PX * eg_SC[k];
  const eg_K = {
    base0: 21.85, base1: 22.30, bar0: 21.92, chip0: 21.96, num0: 22.22, stag: 0.07, seedDone: 22.42,
    skel: 22.29, h1: 21.98, h2: 22.50,
    lit: 22.88, dome0: 22.90, dome1: 23.40, grow0: 23.06, grow1: 23.46,
    push0: 22.94, push1: 23.74, dim0: 22.94, dim1: 23.34, cor0: 22.94, cor1: 23.34,
    line0: 23.70, line1: 24.00, und: 25.17, well: 25.78, dis0: 26.34, dis1: 26.46,
    c0: 26.46, land: 27.48, plus: 27.50, sh0: 27.62, sh1: 27.97,
  };
  // a metalCount driven by n * e4(pr(tv, t0, t1)) shows n at the fraction 1 - (0.5 / n)^0.25 of its window (ru_t1)
  const eg_t1 = (t0, tl, n) => t0 + (tl - t0) / (1 - Math.pow(0.5 / n, 0.25));
  const eg_M = {};
  function eg_w(x, s, w, size) { const k = s + "|" + w + "|" + size; if (!(k in eg_M)) eg_M[k] = measure(x, s, w, size, isAr(s) ? AR : LAT); return eg_M[k]; }
  const eg_mW = (s, size, w) => { const k = "m|" + s + "|" + size + "|" + w; if (!(k in eg_M)) eg_M[k] = metalWidth(s, size, w); return eg_M[k]; };
  const eg_bump = (tv, t0, d) => { const u = pr(tv, t0, t0 + d); return u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0; };
  // one fading layer (copy of 31_rule.js ru_layer): draw(c) paints in the caller's coordinates into a device-space
  // buffer over the bbox X, Y, w, h, which lands once at alpha a; at a = 1 it draws straight through
  const eg_BUF = {};
  function eg_layer(x, X, Y, w, h, a, draw) {
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
    let c = eg_BUF.c;
    if (!c || c.width < cw || c.height < ch) c = eg_BUF.c = U.mk(Math.max(cw, c ? c.width : 0), Math.max(ch, c ? c.height : 0));
    const cx = c.x;
    cx.setTransform(1, 0, 0, 1, 0, 0); cx.globalAlpha = 1; cx.globalCompositeOperation = "source-over"; cx.filter = "none";
    cx.clearRect(0, 0, cw, ch);
    cx.save(); cx.beginPath(); cx.rect(0, 0, cw, ch); cx.clip();
    cx.setTransform(M.a, M.b, M.c, M.d, M.e - x0, M.f - y0);
    draw(cx);
    cx.restore(); cx.setTransform(1, 0, 0, 1, 0, 0);
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha *= a; x.drawImage(c, 0, 0, cw, ch, x0, y0, cw, ch); x.restore();
  }
  function eg_symK(k, lt) {
    switch (STAGES[k].sym) {
      case "sprout": return { grow: 1 };
      case "chev": return { ignite: 1, t: lt };
      case "summit": return { flagU: 1 };
      default: return {};
    }
  }
  const eg_barPath = (x, k, dy) => chamferPath(x, eg_X[k] - eg_BW / 2, eg_top(k) + dy, eg_BW, eg_PX * eg_SC[k], 16, 4);
  const eg_barU = (tv, k) => expo(pr(tv, eg_K.bar0 + eg_K.stag * k, eg_K.bar0 + eg_K.stag * k + 0.4));
  const eg_chipU = (tv, k) => expo(pr(tv, eg_K.chip0 + eg_K.stag * k, eg_K.chip0 + eg_K.stag * k + 0.4));
  // a column's bar rising through the baseline slot (clip y < BASE), 0.40 s expo, its chamfered top leading
  function eg_rise(x, k, tv, paint) {
    const u = eg_barU(tv, k); if (u <= 0) return;
    const dy = (1 - u) * (eg_PX * eg_SC[k] + 6);
    x.save(); x.beginPath(); x.rect(eg_X[k] - 80, 0, 160, eg_BASE); x.clip();
    paint(dy);
    x.restore();
  }
  // a stage chip: TAG 220x60 at y 806-866, revealed from its right edge with a 12 px rise (0.40 s expo); symbol 36 px
  // centred at (X + 190, Y + 30), drawn on over chip start + 0.05 .. + 0.45; name Inter 400 26 right-aligned at X + 164
  function eg_chip(x, k, tv, st, lt) {
    const t0 = eg_K.chip0 + eg_K.stag * k, us = eg_chipU(tv, k); if (us <= 0) return;
    const X = eg_X[k] - eg_CW / 2, Y = eg_CY + 12 * (1 - us), ST = STAGES[k];
    x.save(); x.beginPath(); x.rect(X + eg_CW + 4 - (eg_CW + 8) * us, Y - 10, (eg_CW + 8) * us + 4, eg_CH + 20); x.clip();
    x.globalAlpha *= cl(us * 1.3);
    const lit = st.lit ?? 0, rim = st.rim ?? 0;
    tag(x, X, Y, eg_CW, eg_CH, { outline: lerp(0.25, 0.10, lit), rim, done: st.done ?? 0 });
    const su = pr(tv, t0 + 0.05, t0 + 0.45);
    if (st.mode === "dim") sym(x, ST.sym, X + 190, Y + 30, 36, { dim: true, u: su, k: eg_symK(k, lt) });
    else if (st.mode === "done") sym(x, ST.sym, X + 190, Y + 30, 36, { u: su, k: eg_symK(k, lt) });
    else { // focus: DIM until lit, then the dome draws white + red and its sapling grows
      if (lit < 1) sym(x, ST.sym, X + 190, Y + 30, 36, { dim: true, u: su, a: 1 - lit, k: { grow: 1 } });
      if (lit > 0 && tv >= eg_K.dome0) sym(x, ST.sym, X + 190, Y + 30, 36, { u: pr(tv, eg_K.dome0, eg_K.dome1), a: lit, k: { grow: pr(tv, eg_K.grow0, eg_K.grow1) } });
    }
    T(x, ST.en, X + 164, Y + 39, { fam: LAT, w: 400, size: 26, align: "right", a: st.nameA ?? 1 });
    x.restore();
  }
  // a static score above bar k (not spoken, so never a counter): metal I300 52 centred, 12 px rise + alpha, 0.30 s expo
  function eg_num(x, k, tv, a) {
    const t0 = eg_K.num0 + eg_K.stag * k, u = expo(pr(tv, t0, t0 + 0.3)); if (u <= 0) return;
    metal(x, String(eg_SC[k]), eg_X[k], eg_top(k) - 18 + 12 * (1 - u), 52, { w: 300, align: "center", a: a * cl(u * 1.3) });
  }
  // the opaque backing of the dimmed layer: #000 under every fully risen bar and chip of the five other columns, so the
  // layer's .7 alpha darkens them without letting the bokeh band or the floor show through (no glass)
  function eg_back(x, tv) {
    x.save(); x.fillStyle = "#000000";
    for (const k of [0, 2, 3, 4, 5]) {
      if (eg_barU(tv, k) >= 1) { eg_barPath(x, k, 0); x.fill(); }
      if (eg_chipU(tv, k) >= 1) { tagPath(x, eg_X[k] - eg_CW / 2, eg_CY, eg_CW, eg_CH); x.fill(); }
    }
    x.restore();
  }
  // a RED Inter 200 '+' landing (copy of ru_plus): scale .6 -> 1 about its centre, 6 px rise, alpha cl(1.5 k); X = left
  function eg_plus(x, X, Y, size, k) {
    if (k <= 0) return;
    const pw = eg_w(x, "+", 200, size), cx = X + pw / 2, cy = Y - 0.36 * size, s = lerp(0.6, 1, k);
    x.save(); x.translate(cx, cy + (1 - k) * 6); x.scale(s, s); x.translate(-cx, -cy);
    T(x, "+", X, Y, { fam: LAT, w: 200, size, color: RED, a: cl(k * 1.5) });
    x.restore();
  }

  function eg_E(x, tv, pu, lt) {
    const K = eg_K;
    // ---- HEADLINE (outside the push; it drifts only): «علامة Edge Score» A300 / I300 64 white + the scene's one flag,
    // line 2 «الحدّ الأدنى للتأهّل لكل مرحلة» A300 44 grey at baseline 252; the RED underline under 'Edge Score' on «Edge»
    headline(x, [["علامة", "w"], ["Edge Score", "w"]], 1720, 176, 64, tv, K.h1, { w: 300, flag: true });
    headline(x, [["الحدّ", "g"], ["الأدنى", "g"], ["للتأهّل", "g"], ["لكل", "g"], ["مرحلة", "g"]], 1720, 252, 44, tv, K.h2, { w: 300 });
    const ku = e3(pr(tv, K.und, K.und + 0.25));
    if (ku > 0) {
      const wE = eg_w(x, "Edge Score", 300, 64), wA = eg_w(x, "علامة", 300, 64), xr = 1720 - wA - 64 * 0.28; // 'Edge Score' x 1220-1535
      x.fillStyle = RED; x.fillRect(xr - wE * ku, 197, wE * ku, 3);
    }

    // ---- the CHART, pushed in 1 -> 1.08 about Incubation's foot (1350, 790)
    const s = 1 + 0.08 * pu;
    x.save(); x.translate(1350, eg_BASE); x.scale(s, s); x.translate(-1350, -eg_BASE);
    // the five other stages as ONE layer, dimming 1 -> .7 when Incubation takes focus (over an opaque backing)
    const aD = 1 - 0.3 * pr(tv, K.dim0, K.dim1);
    if (aD < 0.999) eg_back(x, tv);
    eg_layer(x, 180, 240, 1560, 650, aD, (c) => {
      for (const k of [0, 2, 3, 4, 5]) {
        const done = k === 0;
        eg_rise(c, k, tv, (dy) => {
          eg_barPath(c, k, dy); c.fillStyle = PANEL; c.fill();
          c.lineWidth = 1.5; c.strokeStyle = `rgba(255,255,255,${k === 2 ? 0.45 : 0.25})`; c.stroke();
        });
        eg_num(c, k, tv, done ? 0.9 : 0.8);
        eg_chip(c, k, tv, done ? { mode: "done", done: pr(tv, K.seedDone, K.seedDone + 0.3), nameA: 1 } : { mode: "dim", nameA: 0.55 }, lt);
      }
    });
    // ---- INCUBATION: the dashed ghost until «Incubation», then LIT (PANEL + 2 px RED rim)
    const lit = e2(pr(tv, K.lit, K.lit + 0.3));
    const t1 = eg_t1(K.c0, K.land, 60), val = tv >= K.c0 ? 60 * e4(pr(tv, K.c0, t1)) : 0, fk = Math.min(1, val / 59.5);
    eg_rise(x, 1, tv, (dy) => {
      if (lit < 1) { x.save(); eg_barPath(x, 1, dy); x.setLineDash([6, 5]); x.lineWidth = 1.5; x.strokeStyle = `rgba(255,255,255,${0.4 * (1 - lit)})`; x.stroke(); x.restore(); }
      if (lit > 0) { x.save(); x.globalAlpha *= lit; eg_barPath(x, 1, dy); x.fillStyle = PANEL; x.fill(); x.lineWidth = 2; x.strokeStyle = RED; x.stroke(); x.restore(); }
    });
    // ---- the METER on «الخاصة بك»: a TRACK well inset 12 px (x 1306-1394), clipped to the bar; the RED fill rises with
    // the counter to 300 * min(1, value / 59.5) px (it touches the line on the frame that shows '60'), a 2 px white
    // leading edge while counting; 5 ticks at 10..50 points, flashing white for 2 frames as the fill passes them
    const uw = e2(pr(tv, K.well, K.well + 0.3));
    if (uw > 0) {
      x.save(); eg_barPath(x, 1, 0); x.clip();
      x.globalAlpha *= uw; x.fillStyle = TRACK; x.fillRect(1306, 490, 88, 300);
      x.restore();
      if (fk > 0) {
        const yT = eg_BASE - 300 * fk;
        x.save(); eg_barPath(x, 1, 0); x.clip(); x.fillStyle = RED; x.fillRect(1306, yT, 88, eg_BASE - yT);
        if (tv < K.land + 0.08) { x.globalAlpha *= 1 - pr(tv, K.land, K.land + 0.08); x.fillStyle = WHITE; x.fillRect(1306, yT, 88, 2); }
        x.restore();
      }
      for (let i = 0; i < 5; i++) {
        const ka = e3(pr(tv, K.well + 0.06 + 0.04 * i, K.well + 0.21 + 0.04 * i)); if (ka <= 0) continue;
        const yy = 740 - 50 * i, passed = eg_BASE - 300 * fk <= yy;
        let al = 0.25;
        if (passed) { const tp = K.c0 + (t1 - K.c0) * (1 - Math.pow(1 - ((i + 1) * 59.5) / 360, 0.25)); al = tv - tp < 0.08 ? 1 : 0.55; }
        x.save(); x.globalAlpha *= ka * al; x.fillStyle = WHITE; x.fillRect(1306, yy - 1, 14, 2); x.restore();
      }
    }
    // ---- the THRESHOLD LINE at the 60 level (y 490), x 1270-1430, drawn right to left in the pause before «يجب»;
    // RED with a 3 -> 7 -> 3 px pop on the /s/ of «ستّين»
    const ul = e3(pr(tv, K.line0, K.line1));
    if (ul > 0) {
      const landed = tv >= K.land, th = 3 + 4 * eg_bump(tv, K.land, 0.25);
      x.fillStyle = landed ? RED : WHITE; x.fillRect(1430 - 160 * ul, 490 - th / 2, 160 * ul, th);
    }
    // ---- the BASELINE: 3 px white .7 at y 790, x 1720 -> 220 (right to left), over the bars' feet
    const ub = e4(pr(tv, K.base0, K.base1));
    if (ub > 0) { x.fillStyle = "rgba(255,255,255,0.7)"; x.fillRect(1720 - 1500 * ub, eg_BASE - 1.5, 1500 * ub, 3); }
    // ---- Incubation's chip (DIM -> LIT on «Incubation»)
    eg_chip(x, 1, tv, { mode: "focus", lit, rim: lit, nameA: lerp(0.55, 1, lit) }, lt);
    // ---- the NUMBER: the skeleton (shimmer) until the pause before «لا», then '60' (I200 128) counts from '0' onto
    // «ستّين» (27.48) and the RED '+' (I200 90, baseline 446) lands 9 px after it: '60+' as one 205 px group on x 1350
    const w60 = eg_mW("60", 128, 200), wp = eg_w(x, "+", 200, 90), X0 = 1350 - (w60 + 9 + wp) / 2;
    if (tv >= K.skel && tv < K.dis1) skeleton(x, 1275, 398, 150, 44, tv, e2(pr(tv, K.skel, K.skel + 0.2)), { dissolve: pr(tv, K.dis0, K.dis1) });
    const ua0 = e3(pr(tv, K.dis0 + 0.04, K.dis1 + 0.04));
    if (ua0 > 0) metalCount(x, val, "60", X0, 466, 128, { w: 200, a: ua0, sheen: pr(tv, K.sh0, K.sh1) });
    eg_plus(x, X0 + w60 + 9, 446, 90, expo(pr(tv, K.plus, K.plus + 0.12)));
    // ---- the focus BRACKET: red corner triangles (legs 18) fly out to x 1222-1478, y 336-878; 6 px snap on the landing
    if (tv >= K.cor0) { const d = 6 * eg_bump(tv, K.land, 0.15); corners(x, 1222 - d, 336 - d, 256 + 2 * d, 542 + 2 * d, { L: 18, u: pr(tv, K.cor0, K.cor1), u2: 0 }); }
    x.restore();
  }

  GROUPS.push({
    name: "edge",
    async broll(x, t, S, id) {
      if (id !== 3) return;
      const lt = Math.max(0, t - S.shot.f0 / 25), tv = t - P;
      const pu = eio(pr(tv, eg_K.push0, eg_K.push1));
      await brScene(x, t, lt, { cz0: 14, bokehY: 366, dz: 0.8 * pu }, async (c) => eg_E(c, tv, pu, lt));
    },
  });
