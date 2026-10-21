
  // ================================================================== GROUP «conds» (prefix cd_): beats J, K, L, M
  // Spec: mg_ep2_final.json beats J, K, L, M (layouts in screen px, widths measured with the project fonts: they match).
  // Times are VO seconds (tv = t - P). Shots are picked by S.shot.k_beat ('J', 'K', 'L', 'M'), never by times.
  // J  L5  VO 50.65-54.65  CONDITION 1: card + pips (1 LIT -> DONE on «على الأقل»), 40 TAG tickets fill with the
  //                        counter '40' (lands on «أربعين» 52.68), «صفقة مستقلّة», the gaps open, RED '+' -> '40+'
  // K  L2  VO 54.65-57.01  CONDITION 2: «عائد», corner marks around a dotted TARGET line, five candles step up, kicker
  //                        «لا يقلّ عن», ▲▲▲, metallic '7%' on «سبعة» (56.20), the last high touches the line (RED flash)
  // L  VC  VO 57.01-61.49  CONDITION 3 (WIDE): pool .18, dashed RED limit ring drawn clockwise (+ inner pool .12), the
  //                        two-tone headline + flag, pips (1-2 DONE, 3 LIT), right chart: RED limit line '−10%', equity
  //                        line falling to 8 px above it, pulses, recovery, live scroll; left: RED '−' + metallic '10%'
  //                        (59.18) with one sheen and the footnote
  // M  L1  VO 61.49-67.53  CONDITION 4: card + pips (1-3 DONE, 4 LIT), calendar, day track with 12 ticks lit by the
  //                        counter '60' (63.31), «يوماً», the FIRST-TRADE chip (65.80), the RED fill to day 60, pip 4
  //                        DONE + the RTL recap pulses (66.43), RED check tab (66.95)
  // The engine samples frame f at VO 0.04 f - 0.61: the last frames before the cuts are J 54.59/54.63, K 56.95/56.99,
  // L 61.43/61.47, M 67.47/67.51, all clean (exits end 54.56, 56.92, 61.41, 67.45). Exits fade ONE layer (cd_layer).

  const cd_K = {
    // J: في 50.68 · هذه 50.79 · المرحلة 51.03 · [51.46-51.66] · يجب 51.66 · عليك 51.99 · إتمام 52.33 · أربعين 52.68 ·
    //    صفقة 53.09 · مستقلّة 53.38 · على 54.01 · الأقل 54.19-54.53 (cut 54.65)
    J: { card: 51.08, pulse: 51.66, c0: 51.99, land: 52.68, saf: 53.09, gap: 53.38, plus: 54.01, o0: 54.28, o1: 54.56 },
    // K: وتحقيق 54.70 · عائد 55.05 · [55.40-55.66] · لا 55.66 · يقلّ 55.81 · عن 56.13 · سبعة 56.23 · % 56.52-56.96 (cut 57.01)
    K: { aid: 55.06, cdl: 55.20, kick: 55.66, wick: 56.05, chev: 56.12, seven: 56.20, o0: 56.68, o1: 56.92 },
    // L: [56.94-57.08] · مع 57.08 · عدم 57.38 · الوصول 57.67 · إلى 58.15 · نسبة 58.35 · انعكاس 58.57 · عشرة 59.20 ·
    //    % 59.50-59.85 · [59.84-60.08] · في أي 60.08 · وقت 60.41 · من 60.65 · الأوقات 60.89-61.32 (cut 61.49)
    L: { ring: 57.42, ring1: 58.12, head: 57.44, pips: 57.60, chart: 57.80, lim: 58.12, eq0: 58.20, eq1: 58.57,
      pulses: [59.32, 59.60, 59.88], ten: 59.18, foot: 59.20, sheen: 59.45, rec: 60.08, steps: [60.48, 60.78, 61.08],
      o0: 61.13, o1: 61.41 },
    // M: وخلال 61.66 · فترة 62.23 · لا 62.65 · تقلّ 62.84 · عن 63.21 · ستّين 63.31 · يوماً 63.89 · من 64.38 · تاريخ 64.63 ·
    //    أول 65.42 · صفقة 65.80 · [65.93-66.11] · عند 66.22 · تحقيق 66.43 · هذه 66.81 · الشروط 66.95-67.47 (cut 67.53)
    M: { card: 61.92, cal: 62.25, tr0: 62.25, tr1: 62.65, kick: 62.30, c0: 62.70, land: 63.31, yawm: 63.89, chip: 65.80,
      fill0: 65.85, fill1: 66.30, done4: 66.43, pulse: [66.43, 66.51, 66.59, 66.67], tab: 66.95, o0: 67.17, o1: 67.45 },
  };
  // a metalCount driven by fin * e4(pr(tv, t0, t1)) shows fin (Math.round reaches it) at the fraction cd_pLand(fin) of
  // its window; t1 is chosen so that the landing falls exactly on the spoken number (the quartOut shape is kept)
  const cd_pLand = (fin) => 1 - Math.pow(0.5 / fin, 0.25);
  // (the landing is aimed 4 ms ahead of tLand, so the frame sampled at tLand shows the final number despite float error)
  const cd_t1 = (t0, tLand, fin) => t0 + (tLand - 0.004 - t0) / cd_pLand(fin);
  // the time the count passes v (displays >= v): the inverse of fin * e4(pr(tv, t0, t1)) at v - 0.5
  const cd_tPass = (v, fin, t0, t1) => t0 + (1 - Math.pow(1 - cl((v - 0.5) / fin), 0.25)) * (t1 - t0);

  // ------------------------------------------------------------------ helpers
  // exit envelope (inOutCubic, as the kit's ent(): alpha -> 0, y -10, scale .985) and its transform about a pivot
  function cd_out(tv, a, b) { const u = eio(pr(tv, a, b)); return { a: 1 - u, dy: -10 * u, sc: 1 - 0.015 * u }; }
  function cd_piv(x, ex, cx, cy) { x.translate(cx, cy + ex.dy); x.scale(ex.sc, ex.sc); x.translate(-cx, -cy); }
  // one fading layer: draw(c) paints in the caller's coordinates into a device-space buffer (the bbox X, Y, w, h under
  // the current transform), which lands once at alpha a. At a = 1 it draws straight through.
  const cd_BUF = {};
  function cd_layer(x, X, Y, w, h, a, draw) {
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
    let c = cd_BUF.c;
    if (!c || c.width < cw || c.height < ch) c = cd_BUF.c = U.mk(Math.max(cw, c ? c.width : 0), Math.max(ch, c ? c.height : 0));
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
  const cd_M = {};
  function cd_w(x, s, w, size) { const k = s + "|" + w + "|" + size; if (!(k in cd_M)) cd_M[k] = measure(x, s, w, size, isAr(s) ? AR : LAT); return cd_M[k]; }
  // a run of Arabic rising out of its mask (the kit headline's motion: clip + 18 px rise, alpha k), right edge Xr; the
  // clip runs from baseline - 1.25 em to baseline + 0.70 em and 0.45 em past both ends (final ي dots and swashes)
  function cd_rise(x, s, Xr, Y, size, wgt, color, k) {
    if (k <= 0) return;
    const mw = cd_w(x, s, wgt, size);
    x.save(); x.beginPath(); x.rect(Xr - mw - 0.45 * size, Y - size * 1.25, mw + 0.9 * size, size * 1.95); x.clip();
    T(x, s, Xr - mw, Y + (1 - k) * 18, { w: wgt, size, fam: AR, ltr: true, align: "left", color, a: k });
    x.restore();
  }
  // the RED '+' (Inter 200) landing at its left edge X, baseline Y: scale .6 -> 1 and a small rise, alpha
  function cd_plus(x, X, Y, size, k) {
    if (k <= 0) return;
    const pw = cd_w(x, "+", 200, size), cx = X + pw / 2, cy = Y - 0.36 * size, s = lerp(0.6, 1, k);
    x.save(); x.translate(cx, cy + (1 - k) * 6); x.scale(s, s); x.translate(-cx, -cy);
    T(x, "+", X, Y, { fam: LAT, w: 200, size, color: RED, a: cl(k * 1.5) });
    x.restore();
  }
  // CARD entry: the clip grows from the right edge with a 24 px rise and alpha (0.45 s expo); the content follows
  // 0.12 s later (10 px rise, alpha). tabU: the RED check tab (0..1)
  function cd_card(x, tv, X, Y, w, h, t0, tabU, fill) {
    const u = pr(tv, t0, t0 + 0.45), ui = expo(u), uc = expo(pr(tv, t0 + 0.12, t0 + 0.57));
    if (u <= 0) return;
    x.save(); x.translate(0, (1 - ui) * 24);
    card(x, X, Y, w, h, { u, a: cl(ui * 1.25), c: 48, tab: tabU > 0 ? "check" : null, tabU });
    if (uc > 0) {
      cardClip(x, X, Y, w, h, u);
      x.globalAlpha *= cl(uc * 1.3); x.translate(0, (1 - uc) * 10);
      fill();
    }
    x.restore();
  }
  // one-time fit check of the spec's measured widths (console only)
  let cd_FIT = false;
  function cd_fit(x) {
    if (cd_FIT) return; cd_FIT = true;
    const chk = [["صفقة مستقلّة", 400, 38, 260], ["عائد", 500, 48, 91], ["لا يقلّ عن", 300, 34, 144], ["* قد تختلف النسبة حسب المرحلة", 300, 34, 464],
      ["وفق شروط البرنامج", 300, 34, 276], ["فترة لا تقلّ عن", 300, 36, 229], ["يوماً", 400, 40, 76], ["أول صفقة", 400, 34, 161], ["−", 200, 240, 142], ["−10%", 500, 30, 76]];
    for (const [s, w, z, ref] of chk) { const m = cd_w(x, s, w, z); if (Math.abs(m - ref) > 2) console.warn(`conds fit: '${s}' ${w}/${z} = ${m.toFixed(1)} (spec ${ref})`); }
    for (const [s, z, ref] of [["40", 130, 152], ["7%", 160, 169], ["10%", 240, 346], ["60", 130, 146]]) {
      const m = metalWidth(s, z, 200); if (Math.abs(m - ref) > 2) console.warn(`conds fit: metal '${s}' ${z} = ${m.toFixed(1)} (spec ${ref})`);
    }
  }

  // ================================================================== J · VO 50.65-54.65 · condition 1: 40 trades (L5)
  // CARD 470x520 at x 1350-1820, y 240-760 (cut 48). Pips 72x48 pitch 84 right-aligned x 1750, y 262-310. Ticket grid
  // 8 x 5 TAG 40x22, pitch 52 x 34, x 1376-1780, rows 346 ... 482. Ticket n (right to left, row by row) pops when the
  // counter passes n + 1, so grid and counter stay in sync (0.017 s per ticket on average, quartOut like the count).
  function cd_J(x, tv) {
    const K = cd_K.J;
    if (tv < K.card || tv > K.o1 + 0.02) return;
    const ex = cd_out(tv, K.o0, K.o1), X = 1350, Y = 240, w = 470, h = 520;
    const t1 = cd_t1(K.c0, K.land, 40), val = 40 * e4(pr(tv, K.c0, t1));
    cd_layer(x, X - 30, Y - 30, w + 60, h + 60, ex.a, (c) => {
      c.save(); cd_piv(c, ex, X + w / 2, Y + h / 2);
      cd_card(c, tv, X, Y, w, h, K.card, 0, () => {
        // the pips: 1 LIT (one pulse on «يجب»), DONE on «على الأقل»; 2-4 DIM; staggered entry with the content
        pips(c, 1750, 262, 72, 48, 84, [{ s: tv < K.plus ? "lit" : "done", u: tv < K.plus ? 1 : pr(tv, K.plus, K.plus + 0.25),
          pulse: pr(tv, K.pulse, K.pulse + 0.3) }, {}, {}, {}], { enter: pr(tv, K.card + 0.12, K.card + 0.76) });
        // the ticket grid; its gaps open by 4 px on «مستقلّة» (tickets -2 px, pitch +2 px, about the grid's centre)
        if (tv >= K.c0) {
          const g = e4(pr(tv, K.gap, K.gap + 0.3)), tw = 40 - 2 * g, th = 22 - 2 * g, pX = 52 + 2 * g, pY = 34 + 2 * g;
          for (let n = 0; n < 40; n++) {
            const tp = cd_tPass(n + 1, 40, K.c0, t1), k = pr(tv, tp, tp + 0.16); if (k <= 0) continue;
            const r = Math.floor(n / 8), col = 7 - (n % 8);
            const TX = 1578 + (col - 3.5) * pX - tw / 2, TY = 425 + (r - 2) * pY - th / 2, s = back(k, 1.4);
            c.save(); c.globalAlpha *= cl(k * 4);
            c.translate(TX + tw / 2, TY + th / 2); c.scale(s, s); c.translate(-TX - tw / 2, -TY - th / 2);
            tagPath(c, TX, TY, tw, th); c.fillStyle = TRACK; c.fill();
            const fl = 1 - e2(pr(k, 0.15, 1)); // the white flash, then the TRACK fill
            if (fl > 0.003) { c.save(); c.globalAlpha *= 0.92 * fl; c.fillStyle = WHITE; c.fill(); c.restore(); }
            c.lineWidth = 1.5; c.strokeStyle = "rgba(255,255,255,0.55)"; c.stroke();
            c.restore();
          }
        }
        // '40' (metallic I200 130, right-aligned x 1715, baseline 650) counting in fixed slots, then the RED '+'
        const ua = e3(pr(tv, K.c0 - 0.08, K.c0 + 0.08));
        if (ua > 0) metalCount(c, val, "40", 1715, 650, 130, { w: 200, align: "right", a: ua });
        cd_plus(c, 1724, 630, 90, expo(pr(tv, K.plus, K.plus + 0.15)));
        // «صفقة مستقلّة» (A400 38 white, right-aligned x 1780, baseline 716)
        cd_rise(c, "صفقة مستقلّة", 1780, 716, 38, 400, WHITE, e4(pr(tv, K.saf, K.saf + 0.42)));
      });
      c.restore();
    });
  }

  // ================================================================== K · VO 54.65-57.01 · condition 2: +7% (L2 slot)
  // slot x 100-650, y 140-500. «عائد» A500 48 (x 620, baseline 212); «لا يقلّ عن» A300 34 grey (x 620, baseline 262);
  // '7%' metallic I200 160 right-aligned x 620, baseline 440 (x 451-620), bottom fade; ▲▲▲ x 415-433, y 370/392/414;
  // chart corners x 120-340, y 250-470, target line y 280 (white .30, dash 3/6) x 130-330; candles body 18, pitch 36,
  // centres x 150-294. Candles in screen px [open, close, high, low]: four up (white), one down (RED), stepping up.
  const cd_KC = [[452, 424, 416, 458], [424, 396, 388, 432], [396, 410, 390, 418], [410, 352, 344, 416], [352, 306, 296, 360]];
  function cd_Kc(x, tv) {
    const K = cd_K.K;
    if (tv < K.aid || tv > K.o1 + 0.02) return;
    const ex = cd_out(tv, K.o0, K.o1);
    cd_layer(x, 90, 130, 580, 380, ex.a, (c) => {
      c.save(); cd_piv(c, ex, 370, 320);
      cd_rise(c, "عائد", 620, 212, 48, 500, WHITE, e4(pr(tv, K.aid, K.aid + 0.42)));
      cd_rise(c, "لا يقلّ عن", 620, 262, 34, 300, GREY, e4(pr(tv, K.kick, K.kick + 0.42)));
      // the chart: corner marks fly out, dotted sides, the dotted TARGET line (flashes RED on the touch)
      // (the fly-out's clock starts 0.02 s ahead of «عائد» so the first frame it shows on, f 1392 at VO 55.07, already has the
      // four corners apart: from 55.06 that frame sampled expo(.02) = .14 and the four 18 px triangles tiled into a solid
      // red square for one frame)
      corners(c, 120, 250, 220, 220, { L: 18, u: pr(tv, K.aid - 0.02, K.aid + 0.43), u2: pr(tv, K.aid + 0.25, K.aid + 0.6) });
      const ul = e3(pr(tv, K.aid + 0.15, K.aid + 0.5));
      if (ul > 0) {
        c.save(); c.lineWidth = 1.5; c.setLineDash([3, 6]);
        c.strokeStyle = "rgba(255,255,255,0.30)"; c.beginPath(); c.moveTo(130, 280); c.lineTo(lerp(130, 330, ul), 280); c.stroke();
        const kf = pr(tv, K.seven, K.seven + 0.25);
        if (kf > 0 && kf < 1) { // full RED for 0.1 s, then back to white over 0.15 s
          c.globalAlpha *= 1 - e2(pr(kf, 0.4, 1)); c.lineWidth = 2.5; c.strokeStyle = RED;
          c.beginPath(); c.moveTo(130, 280); c.lineTo(330, 280); c.stroke();
        }
        c.restore();
      }
      cd_KC.forEach((q, i) => {
        const g = pr(tv, K.cdl + 0.1 * i, K.cdl + 0.1 * i + 0.22); if (g <= 0) return;
        const yH = i === 4 ? lerp(q[2], 280, e3(pr(tv, K.wick, K.seven))) : q[2]; // the last high reaches the line
        candle(c, 150 + 36 * i, q[0], q[1], yH, q[3], 18, { grow: g, upColor: UPC2 });
      });
      // ▲▲▲ 0.08 s ahead of the numeral; metallic '7%' lands on «سبعة» (scale 1.04 -> 1, 0.25 s)
      chev3(c, 415, 370, tv, K.chev);
      const kt = pr(tv, K.seven, K.seven + 0.25);
      if (kt > 0) {
        const s = lerp(1.04, 1, expo(kt));
        c.save(); c.globalAlpha *= cl(kt * 3); c.translate(535, 382); c.scale(s, s); c.translate(-535, -382);
        metal(c, "7%", 620, 440, 160, { w: 200, align: "right", fade: true });
        c.restore();
      }
      c.restore();
    });
  }

  // ================================================================== L · VO 57.01-61.49 · condition 3: never −10% (VC WIDE)
  // headline A300 52, baseline 170, right edge 1301 (+ the scene's flag at x 1327); pips centred on x 946 (pip1 x
  // 1036-1108), y 210-258; hero right-aligned x 690, baseline 430: RED '−' (x 202-344) + metallic '10%' (x 344-690);
  // footnote A300 34 grey .85 at baselines 494 / 540; chart frame x 1230-1770, y 330-650, limit line y 600 (x 1240-1760),
  // '−10%' label I500 30 RED at x 1240, baseline 590; equity plot clipped to x 1250-1750, pitch 40, from y 420, its low
  // (1600, 592), recovering 60 px to (1640, 532), then three live points (lows 30 and 16 px above the limit).
  const cd_EQ = [[1250, 420], [1280, 412], [1320, 438], [1360, 426], [1400, 468], [1440, 456], [1480, 510], [1520, 498],
    [1560, 552], [1600, 592], [1640, 532], [1680, 570], [1720, 546], [1760, 584]];
  function cd_eqHead(tv) { // the head as a fractional point index, and the plot's scroll offset (px)
    const K = cd_K.L;
    let h = 9 * e3(pr(tv, K.eq0, K.eq1)), off = 0;
    if (tv >= K.rec) h = 9 + e3(pr(tv, K.rec, K.rec + 0.4));
    K.steps.forEach((s, j) => { const k = e4(pr(tv, s, s + 0.2)); if (k > 0) { h = 10 + j + k; off -= 40 * k; } });
    return { h, off };
  }
  function cd_eqPath(c, h, off) {
    const n = Math.floor(h), f = h - n;
    c.moveTo(cd_EQ[0][0] + off, cd_EQ[0][1]);
    for (let i = 1; i <= n; i++) c.lineTo(cd_EQ[i][0] + off, cd_EQ[i][1]);
    let hx = cd_EQ[n][0] + off, hy = cd_EQ[n][1];
    if (f > 0 && n + 1 < cd_EQ.length) { hx = lerp(cd_EQ[n][0], cd_EQ[n + 1][0], f) + off; hy = lerp(cd_EQ[n][1], cd_EQ[n + 1][1], f); c.lineTo(hx, hy); }
    return [hx, hy];
  }
  const cd_HEAD = [["عدم", "g"], ["الوصول", "g"], ["إلى", "g"], ["نسبة", "w"], ["الانعكاس", "w"]];
  function cd_L(x, tv) {
    const K = cd_K.L;
    if (tv < K.head || tv > K.o1 + 0.02) return;
    const ex = cd_out(tv, K.o0, K.o1);
    cd_layer(x, 160, 100, 1640, 580, ex.a, (c) => {
      c.save(); cd_piv(c, ex, 960, 400);
      // the two-tone headline with the scene's one flag
      headline(c, cd_HEAD, 1301, 170, 52, tv, K.head, { w: 300, flag: true, gap: 13.5 });
      // the pips under it: 1-2 DONE, 3 (shield) LIT, 4 DIM
      if (tv >= K.pips) pips(c, 1108, 210, 72, 48, 84, [{ s: "done" }, { s: "done" }, { s: "lit" }, {}], { enter: pr(tv, K.pips, K.pips + 0.64) });
      // RIGHT CHART: corner marks + dotted sides
      if (tv >= K.chart) {
        corners(c, 1230, 330, 540, 320, { L: 18, u: pr(tv, K.chart, K.chart + 0.45), u2: pr(tv, K.chart + 0.3, K.chart + 0.6) });
        const E = cd_eqHead(tv);
        // the area under the equity line (white .08) down to the limit line: the room left above −10%, clipped to the plot
        if (E.h > 0) {
          c.save(); c.beginPath(); c.rect(1250, 330, 500, 320); c.clip();
          c.beginPath(); const [hx] = cd_eqPath(c, E.h, E.off); c.lineTo(hx, 600); c.lineTo(cd_EQ[0][0] + E.off, 600); c.closePath();
          c.fillStyle = "rgba(255,255,255,0.08)"; c.fill(); c.restore();
        }
        // the dashed RED limit line (2 px, 8/6) drawn left to right, its three pulses (alpha .5 -> 1, 0.15 s) and label
        const kl = e3(pr(tv, K.lim, K.lim + 0.35));
        if (kl > 0) {
          let la = 1;
          // each pulse dips to .5 and comes back to 1 on one smooth sine over its 0.15 s, so it spans 3 frames (about .70 / .50
          // / .63); the instant drop to .5 with an e3 return only ever showed as one frame at .74 (invisible under the hit)
          for (const p of K.pulses) { const k = pr(tv, p, p + 0.15); if (k > 0 && k < 1) la = 1 - 0.5 * Math.sin(Math.PI * k); }
          c.save(); c.globalAlpha *= la; c.strokeStyle = RED; c.lineWidth = 2; c.setLineDash([8, 6]);
          c.beginPath(); c.moveTo(1240, 600); c.lineTo(lerp(1240, 1760, kl), 600); c.stroke(); c.restore();
          T(c, "−10%", 1240, 590, { fam: LAT, w: 500, size: 30, color: RED, a: e3(pr(tv, K.lim + 0.15, K.lim + 0.4)) });
        }
        // the equity line (2.5 px white)
        if (E.h > 0) {
          c.save(); c.beginPath(); c.rect(1250, 330, 500, 320); c.clip();
          c.beginPath(); cd_eqPath(c, E.h, E.off);
          c.lineWidth = 2.5; c.strokeStyle = WHITE; c.lineJoin = "round"; c.lineCap = "round"; c.stroke(); c.restore();
        }
      }
      // LEFT THIRD: RED '−' + metallic '10%' land on «عشرة» (scale 1.04 -> 1, 0.25 s), one sheen on the metal only
      const kt = pr(tv, K.ten, K.ten + 0.25);
      if (kt > 0) {
        const s = lerp(1.04, 1, expo(kt));
        c.save(); c.globalAlpha *= cl(kt * 3); c.translate(446, 343); c.scale(s, s); c.translate(-446, -343);
        T(c, "−", 202, 430, { fam: LAT, w: 200, size: 240, color: RED, ltr: true, align: "left" });
        metalCount(c, 10, "10%", 690, 430, 240, { w: 200, align: "right", fade: true, sheen: pr(tv, K.sheen, K.sheen + 0.45) });
        c.restore();
      }
      const kf = e2(pr(tv, K.foot, K.foot + 0.3));
      if (kf > 0) {
        T(c, "* قد تختلف النسبة حسب المرحلة", 690, 494, { w: 300, size: 34, color: GREY, a: 0.85 * kf });
        T(c, "وفق شروط البرنامج", 690, 540, { w: 300, size: 34, color: GREY, a: 0.85 * kf });
      }
      c.restore();
    });
  }
  // floor: pool .18 from the cut; the dashed RED limit ring (24 floorP arcs of 10° with 5° gaps, R 1.15 m, 0.05 m wide,
  // RED decal .8) drawn clockwise from the front over 57.42-58.12, static once drawn, with a soft white pool .12 inside;
  // all exit with the overlay (61.13-61.41)
  function cd_floorL(tv, sh) {
    const K = cd_K.L, xo = 1 - eio(pr(tv, K.o0, K.o1));
    if (xo <= 0.003) return;
    sh.push(fPool(0.18 * xo));
    if (tv < K.ring) return;
    sh.push(fPool(0.12 * e2(pr(tv, K.ring, K.ring + 0.5)) * xo, "#ffffff", 1.15));
    const u = e2(pr(tv, K.ring, K.ring1)) * 360, R = 1.15, hw = 0.025;
    const Pt = (deg, r) => { const th = (deg * Math.PI) / 180; return floorP(-r * Math.sin(th), -r * Math.cos(th)); };
    for (let i = 0; i < 24; i++) {
      const a0 = i * 15; if (u <= a0) break;
      const a1 = Math.min(a0 + 10, u), pts = [];
      for (let j = 0; j <= 4; j++) pts.push(Pt(lerp(a0, a1, j / 4), R + hw));
      for (let j = 4; j >= 0; j--) pts.push(Pt(lerp(a0, a1, j / 4), R - hw));
      sh.push({ type: "poly", pts, color: RED, a: 0.8 * xo });
    }
  }

  // ================================================================== M · VO 61.49-67.53 · condition 4: 60 days (L1)
  // CARD 580x430 at x 1240-1820, y 170-600 (cut 48). Pips right-aligned x 1750, y 210-258. CALENDAR 110 px centred
  // (1715, 355). Kicker A300 36 grey right-aligned x 1630, baseline 318. '60' metallic I200 130 right-aligned x 1630,
  // baseline 440; «يوماً» A400 40 right-aligned x 1462. Day track TAG 500x24 at x 1280-1780, y 470-494 (TRACK): day d at
  // x 1296 + 7.8 d (day 60 at 1764, under its label), 12 ticks 2x8 every 5 days; '60' I400 26 centred x 1764, baseline
  // 462. FIRST-TRADE chip TAG 220x50 at x 1280-1500, y 508-558 (kit tradeChip).
  function cd_Mc(x, tv) {
    const K = cd_K.M;
    if (tv < K.card || tv > K.o1 + 0.02) return;
    const ex = cd_out(tv, K.o0, K.o1), X = 1240, Y = 170, w = 580, h = 430;
    const t1 = cd_t1(K.c0, K.land, 60), val = 60 * e4(pr(tv, K.c0, t1)), shown = Math.round(val);
    cd_layer(x, X - 30, Y - 30, w + 60, h + 60, ex.a, (c) => {
      c.save(); cd_piv(c, ex, X + w / 2, Y + h / 2);
      cd_card(c, tv, X, Y, w, h, K.card, pr(tv, K.tab, K.tab + 0.25), () => {
        // pips: 1-3 DONE, 4 LIT -> DONE on «تحقيق»; then the recap: the four pulse right to left
        const st = [0, 1, 2, 3].map((i) => ({ s: i < 3 || tv >= K.done4 ? "done" : "lit", u: i === 3 && tv >= K.done4 ? pr(tv, K.done4, K.done4 + 0.25) : 1,
          pulse: pr(tv, K.pulse[i], K.pulse[i] + 0.25) }));
        pips(c, 1750, 210, 72, 48, 84, st, { enter: pr(tv, K.card + 0.12, K.card + 0.76) });
        // the calendar (static once drawn: all its cells filled, the RED cell included)
        if (tv >= K.cal) sym(c, "calendar", 1715, 355, 110, { u: pr(tv, K.cal, K.cal + 0.5) });
        // kicker, counter, «يوماً»
        cd_rise(c, "فترة لا تقلّ عن", 1630, 318, 36, 300, GREY, e4(pr(tv, K.kick, K.kick + 0.42)));
        const ua = e3(pr(tv, K.c0 - 0.08, K.c0 + 0.08));
        if (ua > 0) metalCount(c, val, "60", 1630, 440, 130, { w: 200, align: "right", a: ua });
        cd_rise(c, "يوماً", 1462, 440, 40, 400, WHITE, e4(pr(tv, K.yawm, K.yawm + 0.42)));
        // the day track: drawn left to right (0.4 s e4), the RED fill from the chip to day 60 (quartOut)
        const ut = e4(pr(tv, K.tr0, K.tr1));
        if (ut > 0) {
          c.save(); c.beginPath(); c.rect(1270, 440, 10 + 510 * ut, 60); c.clip();
          tagPath(c, 1280, 470, 500, 24); c.fillStyle = TRACK; c.fill();
          const uf = e4(pr(tv, K.fill0, K.fill1));
          if (uf > 0) { c.save(); c.clip(); c.fillStyle = RED; c.fillRect(1280, 470, 500 * uf, 24); c.restore(); }
          for (let i = 1; i <= 12; i++) {
            const tx = 1296 + 39 * i;
            c.fillStyle = shown >= 5 * i && tv >= K.c0 ? WHITE : DIM; c.fillRect(tx - 1, 478, 2, 8);
          }
          // the '60' label at the day-60 end: grey, lit white on the landing
          const kl = e3(pr(tv, K.land - 0.02, K.land + 0.13));
          T(c, "60", 1764, 462, { fam: LAT, w: 400, size: 26, align: "center", color: GREY, a: 1 - kl });
          if (kl > 0) T(c, "60", 1764, 462, { fam: LAT, w: 400, size: 26, align: "center", color: WHITE, a: kl });
          c.restore();
        }
        // the FIRST-TRADE chip drops onto the track's left end (0.3 s expo + a 4 px settle)
        const kc = pr(tv, K.chip, K.chip + 0.3);
        if (kc > 0) {
          const dy = -20 * (1 - expo(kc)) + 4 * Math.sin(Math.PI * pr(tv, K.chip + 0.26, K.chip + 0.42));
          c.save(); c.translate(0, dy); tradeChip(c, 1280, 508, 220, 50, "أول صفقة", { a: cl(kc * 4) }); c.restore();
        }
      });
      c.restore();
    });
  }

  // ================================================================== register
  GROUPS.push({
    name: "conds",
    floor(t, sh, S) {
      const k = S && S.shot && S.shot.k_beat;
      if (k === "L") cd_floorL(t - P, sh);
    },
    draw(x, t, S) {
      const k = S && S.shot && S.shot.k_beat;
      if (k !== "J" && k !== "K" && k !== "L" && k !== "M") return;
      cd_fit(x);
      if (k === "J") cd_J(x, t - P);
      else if (k === "K") cd_Kc(x, t - P);
      else if (k === "L") cd_L(x, t - P);
      else cd_Mc(x, t - P);
    },
  });
