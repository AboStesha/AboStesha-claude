
  // ================================================================== GROUP «accounts» (prefix ac_): beats O P Q R S T U
  // Layouts follow sel/mg_final.json. Times are VO seconds. The spec's ≈ onsets are raw-VO whisper starts; every hit here is
  // snapped to work/words_v4.json and to the speech onsets of the final voice (vo1_clean_v4), which run up to 0.4 s later
  // after pauses: «بالإضافة» 72.93, «مقدم» 75.75, «شركة» 76.78, «Axi» 77.60, «ملاحظة» 78.20, «لا» 80.50, «وإنما» 82.85,
  // «بمعامل» 88.95, «احفظ» 91.47, «في (الفيديوهات)» 94.77, «وأهمها» 101.74, «عشرة» 104.90.
  // O  VO 68.10-77.96   VC HOME -> WIDE (pull 69.22): trading card (candles, live chart, BUY marks), metallic '+',
  //                     allocation card (vault, '$ 5,000', 'Seed'), the axi wordmark, its ◢ pour and its «Axi» accent.
  // P  VO 78.04-78.92   L2 corner slot: red NOTE TAG '!' + «ملاحظة مهمّة», two rocks.
  // Q  VO 79.02-84.60   L3 (x <= 790): allocation card, greyed «تداول» pill: click, shake, padlock snaps, slash,
  //                     «لا تداول مباشر»; trading card below; dotted link + chain «ربط تلقائي»; two red pulses up.
  // R  VO 84.70-90.96   VC WIDE (drop 2): COPY x10 — two trade lists, the red dotted arc over his head, the apex node
  //                     (copy -> x10, «نسخ تلقائي» -> «معامل الضرب»), four trades ride the arc and land multiplied.
  // S  VO 91.04-95.86   L2 corner slot: tag «معامل الضرب» + metallic x10, red flag bookmark, dark pill «في الفيديوهات القادمة».
  // T  VO 95.95-102.08  L1 (x >= 1220): rule-sheet card (no flag), six stage symbols light 01-06, three abstract rule
  //                     rows tick red, row 4 in focus (shield, «حدّ الانعكاس»).
  // U  VO 102.15-108.00 VC WIDE: limit ring on the floor, headline, −10% chart, metallic 10% and footnote in the right
  //                     third. Ring, pool and headline exit 105.20-105.50; the chart, '10%' and footnote hold still in
  //                     screen space through the push to HOME (zones free at both framings) and exit at V's times:
  //                     chart 106.30-106.60, '10%' + footnote 107.70-108.00.

  // ------------------------------------------------------------------ timing (VO s)
  const ac_K = {
    // O: «حساب تداول» 70.16, «تتداول» 71.00, «عليه» 71.42, «بالإضافة» 72.93, «حساب تخصيص» 73.58, «ممول» 74.60,
    //    «مقدم» 75.75, «شركة» 76.78, pause 77.18-77.58, «Axi» 77.58-78.02 (O->P cut 78.04: everything gone by 77.96)
    O_tc: 70.12, O_chart: 70.50, O_buy1: 71.00, O_live: 71.42, O_buy2: 71.62, O_plus: 72.85, O_ac: 73.48, O_count: 74.55,
    O_seed: 74.70, O_mark: 75.66, O_pour: 76.66, O_axi: 77.56, O_out: 77.66, O_markOut: 77.72,
    // P (cut in at 78.04): «ملاحظة» 78.20, «مهمة» 78.54 (cut 79.00: gone by 78.92)
    P_tag: 78.12, P_txt: 78.18, P_rock: 78.44, P_out: 78.64,
    // Q: «حساب التخصيص» 79.45, «لا» 80.50, «التداول» 80.84 (stress 81.06), «بشكل مباشر» 81.52, «وإنما» 82.85,
    //    «مربوط» 83.40, «تلقائيا» 83.92 (cut 84.68: gone by 84.60)
    Q_ac: 79.40, Q_cur: 80.12, Q_click: 80.42, Q_shake: 80.46, Q_lock: 80.82, Q_snap: 81.04, Q_slash: 81.46,
    Q_tc: 82.74, Q_link: 83.10, Q_chain: 83.40, Q_p1: 83.84, Q_p2: 84.06, Q_out: 84.30,
    // R: «التداول» 85.40, «ويقوم» 85.96, «بنسخ» 86.60, «الصفقات» 87.34, «المنفذة» 87.88, pause 88.62-88.95, «بمعامل» 88.95,
    //    «لكل» 90.02 (cut 91.04: gone by 90.96). Apex flashes sit in the pauses 87.05-87.13, 87.65-87.72, 88.29-88.42, 90.13-90.20
    R_rip: 84.70, R_tc: 85.10, R_ac: 85.20, R_arc: 85.55, R_node: 86.00, R_x10: 88.62, R_cap: 89.40, R_out: 90.62,
    // S: «احفظ» 91.47, «كلمة» 91.64, «الضرب» 92.38, «في الفيديوهات القادمة» 94.77 (cut 95.96: gone by 95.88)
    S_tag: 91.32, S_flag: 91.40, S_sheen: 92.38, S_pill: 94.64, S_out: 95.50,
    // T: «مرحلة من هذه المراحل» 96.76, «مجموعة من القواعد» 98.60, row 4 in the pause 101.40-101.74 before «وأهمها»
    //    (cut 102.16: gone by 102.08)
    T_card: 96.40, T_sym: 96.80, T_rows: 98.60, T_row4: 101.40, T_out: 101.92,
    // U: «ألّا يصل» 102.67, «انعكاس حساب التخصيص» 103.14-104.60, pause 104.60-104.86, «عشرة» 104.90 (push 105.58)
    U_ring: 102.55, U_head: 102.60, U_chart: 102.75, U_lim: 103.00, U_down: 103.20, U_pulse: 104.05, U_rec: 104.30,
    U_ten: 104.64, U_foot: 104.90, U_sheen: 104.98, U_out: 105.20, U_chartOut: 106.30, U_tenOut: 107.70,
  };
  // R: the four copied trades (appear in the trading list, ride the arc s..s+d, land multiplied in the allocation list)
  const ac_TR = [
    { a: 86.67, s: 86.77, d: 0.60, buy: true, lot: "0.01", x10: "0.10" },
    { a: 87.28, s: 87.38, d: 0.60, buy: false, lot: "0.02", x10: "0.20" },
    { a: 87.95, s: 88.05, d: 0.60, buy: true, lot: "0.01", x10: "0.10" },
    { a: 89.90, s: 90.00, d: 0.45, buy: true, lot: "0.03", x10: "0.30" },
  ];
  const ac_MUL = "x10";

  // ------------------------------------------------------------------ small helpers
  const ac_in = (q, t0, d = 0.45) => expo(pr(q, t0, t0 + d));
  // group transform from an ent() envelope: alpha, rise / exit drift, exit scale about (cx, cy). Pair with x.restore().
  function ac_push(x, e, cx, cy) {
    x.save(); x.globalAlpha *= e.a; x.translate(0, e.dy);
    if (e.sc !== 1) { x.translate(cx, cy); x.scale(e.sc, e.sc); x.translate(-cx, -cy); }
  }
  // exit-only envelope (inOutCubic, as the kit's ent() exits: alpha -> 0, y -10, scale .985)
  function ac_out(q, t1, d) { const u = eio(pr(q, t1, t1 + d)); return { a: 1 - u, dy: -10 * u, sc: 1 - 0.015 * u, uo: u }; }
  // clip to the part of [X0, X1] revealed from its right edge (RTL), u 0..1 (already eased)
  function ac_clipR(x, X0, X1, Y0, Y1, u) { const w = (X1 - X0) * cl(u); x.beginPath(); x.rect(X1 - w, Y0, w, Y1 - Y0); x.clip(); }
  // the same from the left edge, for Latin (left to right). Every text clip reaches baseline + 0.6 em (final-ي dots hang
  // 0.45-0.55 em below the baseline)
  function ac_clipL(x, X0, X1, Y0, Y1, u) { x.beginPath(); x.rect(X0, Y0, (X1 - X0) * cl(u), Y1 - Y0); x.clip(); }
  // glint for metallic numerals: what draw(c) paints into the box is copied to a scratch canvas; a red slanted edge
  // (0.82 px of x per px of y, the logo build's edge) crosses the glyphs left to right at constant speed, from the first
  // glyph pixel it touches to the last (the ink's extent along the slant is read once per box), trailing a 60 px bright
  // band that is ADDED (lighter, peak alpha 1, 0.9 plateau) through the glyph mask; band and edge are drawn in the
  // skewed frame x' = x + 0.82 y so the band stays parallel to the edge down the whole glyph; the band fades over the
  // sweep's last 25 %
  const ac_glInk = {};
  function ac_glint(x, X, Y, w, h, u, draw) {
    if (!(u > 0 && u < 1)) { draw(x); return; }
    const pad = 4, sl = 0.82, ew = 7, bw = 60, key = Math.round(w) + "x" + Math.round(h);
    const c = tmp("ac_gl" + key, w + 2 * pad, h + 2 * pad), W2 = c.width, H2 = c.height, b = tmp("ac_glb" + key, W2, H2);
    c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalAlpha = 1; c.x.globalCompositeOperation = "source-over"; c.x.clearRect(0, 0, W2, H2);
    c.x.save(); c.x.translate(pad - X, pad - Y); draw(c.x); c.x.restore();
    let ink = ac_glInk[key];
    if (!ink) { // range of x + sl*y over the glyph pixels (alpha > 25 %): the edge positions that touch ink
      const d = c.x.getImageData(0, 0, W2, H2).data; let mn = Infinity, mx = -Infinity;
      for (let py = 0; py < H2; py++) for (let px = 0; px < W2; px++) {
        if (d[(py * W2 + px) * 4 + 3] > 64) { const v = px + sl * py; if (v < mn) mn = v; if (v > mx) mx = v; }
      }
      ink = ac_glInk[key] = mn < mx ? [mn, mx] : [0, W2 + sl * H2];
    }
    const ex = lerp(ink[0] - ew, ink[1], u); // the edge spans x' in [ex, ex + ew]: on the first ink at u 0, the last at u 1
    // the band, masked by the glyphs, then added onto them
    b.x.setTransform(1, 0, 0, 1, 0, 0); b.x.globalAlpha = 1; b.x.globalCompositeOperation = "source-over"; b.x.clearRect(0, 0, W2, H2);
    b.x.setTransform(1, 0, -sl, 1, 0, 0); b.x.globalAlpha = 1 - pr(u, 0.75, 1);
    const g = b.x.createLinearGradient(ex - bw, 0, ex, 0);
    g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.45, "rgba(255,255,255,0.9)"); g.addColorStop(1, "rgba(255,255,255,1)");
    b.x.fillStyle = g; b.x.fillRect(ex - bw, 0, bw, H2);
    b.x.setTransform(1, 0, 0, 1, 0, 0); b.x.globalAlpha = 1; b.x.globalCompositeOperation = "destination-in"; b.x.drawImage(c, 0, 0);
    b.x.globalCompositeOperation = "source-over";
    c.x.globalCompositeOperation = "lighter"; c.x.drawImage(b, 0, 0);
    // the red edge on the glyphs
    c.x.globalCompositeOperation = "source-atop"; c.x.fillStyle = RED; c.x.setTransform(1, 0, -sl, 1, 0, 0); c.x.fillRect(ex, 0, ew, H2);
    c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalCompositeOperation = "source-over";
    x.drawImage(c, X - pad, Y - pad);
  }
  // the brand ▲ / ▼ (round-joined), fill + stroke in the current styles
  function ac_tri(x, cx, cy, w, h, up) {
    x.beginPath();
    if (up) { x.moveTo(cx, cy - h / 2); x.lineTo(cx + w / 2, cy + h / 2); x.lineTo(cx - w / 2, cy + h / 2); }
    else { x.moveTo(cx, cy + h / 2); x.lineTo(cx + w / 2, cy - h / 2); x.lineTo(cx - w / 2, cy - h / 2); }
    x.closePath(); x.lineJoin = "round"; x.lineWidth = 2; x.fill(); x.stroke();
  }
  // mixed RTL line from the right edge Xr (reading order); Arabic parts drawn RTL so their punctuation stays put
  function ac_runs(x, parts, Xr, Y, o = {}) {
    let xx = Xr;
    parts.forEach((p, i) => {
      const size = p.size ?? o.size ?? 34, w = p.w ?? o.w ?? 400, fam = p.fam || (isAr(p.s) ? AR : LAT);
      T(x, p.s, xx, Y, { w, size, fam, align: "right", color: p.color || o.color, a: (p.a ?? 1) * (o.a ?? 1) });
      xx -= measure(x, p.s, w, size, fam) + (i < parts.length - 1 ? p.gap ?? size * 0.28 : 0);
    });
    return Xr - xx;
  }
  const ac_runsW = (x, parts, o = {}) => parts.reduce((s, p, i) => {
    const size = p.size ?? o.size ?? 34, w = p.w ?? o.w ?? 400, fam = p.fam || (isAr(p.s) ? AR : LAT);
    return s + measure(x, p.s, w, size, fam) + (i < parts.length - 1 ? p.gap ?? size * 0.28 : 0);
  }, 0);
  // small chamfered box (checkbox), top-right cut c
  function ac_box(x, X, Y, s, c) {
    x.beginPath(); x.moveTo(X + 4, Y); x.lineTo(X + s - c, Y); x.lineTo(X + s, Y + c); x.lineTo(X + s, Y + s - 4);
    x.arcTo(X + s, Y + s, X + s - 4, Y + s, 4); x.lineTo(X + 4, Y + s); x.arcTo(X, Y + s, X, Y + s - 4, 4);
    x.lineTo(X, Y + 4); x.arcTo(X, Y, X + 4, Y, 4); x.closePath();
  }
  // white tick drawn on by k (0..1) inside a box centred (cx, cy), half size q
  function ac_tick(x, cx, cy, q, k, lw = 3) {
    if (k <= 0) return;
    x.save(); x.strokeStyle = WHITE; x.lineWidth = lw; x.lineCap = "round"; x.lineJoin = "round"; x.beginPath();
    const a = [cx - q, cy + q * 0.05], b = [cx - q * 0.3, cy + q * 0.7], c = [cx + q, cy - q * 0.65];
    x.moveTo(a[0], a[1]);
    const k1 = cl(k * 2), k2 = cl(k * 2 - 1);
    x.lineTo(lerp(a[0], b[0], k1), lerp(a[1], b[1], k1));
    if (k2 > 0) x.lineTo(lerp(b[0], c[0], k2), lerp(b[1], c[1], k2));
    x.stroke(); x.restore();
  }
  // ------------------------------------------------------------------ candles (your trading account: one seeded series)
  const ac_OD = series(22, 26, 0.25, 0.06, 0.35);
  const ac_QD = ac_OD.slice(14, 20); // the same account, six candles (beat Q)
  function ac_rng(D, i0, n) {
    let lo = 1, hi = 0;
    for (let i = Math.max(0, i0); i < Math.min(D.length, i0 + n); i++) { lo = Math.min(lo, D[i].l); hi = Math.max(hi, D[i].h); }
    const pad = (hi - lo) * 0.16; return [lo - pad, hi + pad];
  }
  // live chart (time runs left to right): C {X, Y, w, h, n slots, body}; st(i) = print time of candle i (the first n
  // build, later ones scroll in one pitch each, 0.2 s e4); the newest breathes ±6 px; marks [{i, t}] = BUY markers.
  // Returns the last close y.
  function ac_live(x, q, C, D, st, marks) {
    const n = C.n, pitch = C.w / n;
    let last = -1, from = 0;
    for (let i = 0; i < D.length; i++) { if (st(i) <= q) last = i; if (i >= n) from += e4(pr(q, st(i), st(i) + 0.2)); }
    const i0 = Math.floor(from), fr = from - i0;
    const ra = ac_rng(D, i0, n), rb = ac_rng(D, i0 + 1, n), lo = lerp(ra[0], rb[0], fr), hi = lerp(ra[1], rb[1], fr);
    const yOf = (p) => C.Y + C.h - ((p - lo) / (hi - lo)) * C.h;
    let lastY = null; const mk = [];
    x.save(); x.beginPath(); x.rect(C.X, C.Y - 30, C.w, C.h + 60); x.clip();
    for (let i = i0; i <= Math.min(D.length - 1, i0 + n); i++) {
      const g = pr(q, st(i), st(i) + 0.3); if (g <= 0) continue;
      const d = D[i], cx = C.X + (i - from + 0.5) * pitch;
      let yO = yOf(d.o), yC = yOf(d.c), yH = yOf(d.h), yL = yOf(d.l);
      if (i === last && g >= 1) { // breathe
        const lt = q - st(i) - 0.3, b = 6 * Math.sin((2 * Math.PI * lt) / 1.0) * cl(lt / 0.25);
        yC = yC <= yO ? Math.min(yO - 3, yC + b) : Math.max(yO + 3, yC + b);
        yH = Math.min(yH, yC); yL = Math.max(yL, yC);
      }
      const ea = cl((cx - C.X) / (pitch * 0.7));
      candle(x, cx, yO, yC, yH, yL, C.body, { grow: g, newest: i === last, a: ea });
      if (i === last) lastY = yC;
      for (const m of marks || []) if (m.i === i) mk.push([m.t, cx, (yO + yC) / 2, yL, cl((cx - C.X - 13) / (pitch * 0.6))]);
    }
    x.restore();
    // BUY markers after the clip, so a ring near the chart's edge is never cut
    for (const [tb, cx, cy, yL, a] of mk) ac_buy(x, q, tb, cx, cy, yL, a);
    return lastY;
  }
  // BUY marker: a white ring on the candle body plus a red ▲ under its low wick (pop, back 1.4)
  function ac_buy(x, q, tb, cx, cyB, yL, a) {
    const k = pr(q, tb, tb + 0.3); if (k <= 0) return;
    const sc = back(k, 1.4);
    x.save(); x.globalAlpha *= a * cl(k * 3);
    x.strokeStyle = WHITE; x.lineWidth = 2;
    x.beginPath(); x.arc(cx, cyB, 13 * sc, 0, Math.PI * 2); x.stroke();
    const kp = pr(q, tb, tb + 0.45);
    if (kp < 1) { x.save(); x.globalAlpha *= 0.7 * (1 - kp); x.beginPath(); x.arc(cx, cyB, lerp(13, 32, e3(kp)), 0, Math.PI * 2); x.stroke(); x.restore(); }
    x.fillStyle = RED; x.strokeStyle = RED;
    x.save(); x.translate(cx, yL + 13); x.scale(sc, sc); ac_tri(x, 0, 0, 14, 10, true); x.restore();
    x.restore();
  }

  // ================================================================== O · VO 68.10-77.96 · the simple picture
  const ac_Ost = (i) => (i < 12 ? ac_K.O_chart + 0.05 + i * 0.0345 : ac_K.O_live + (i - 12) * 0.6);
  async function ac_O(x, q) {
    const K = ac_K, dout = 0.3;
    const eT = ent(q, K.O_tc, K.O_out, { din: 0.5, dout, rise: 24 });
    const eA = ent(q, K.O_ac, K.O_out, { din: 0.5, dout, rise: 24 });
    // card reflections on the floor (plate space, additive), entering and leaving with their cards
    const sl = [];
    if (eA) sl.push({ u: -2.75, v: -0.6, rx: 1.1, color: RED, a: 0.12 * eA.a });
    if (eT) sl.push({ u: 2.75, v: -0.6, rx: 1.1, color: WHITE, a: 0.1 * eT.a });
    spill(x, sl);
    // ---- trading card (right)
    if (eT) {
      const X = 1260, Y = 250, w = 480, h = 300, tc = K.O_tc + 0.12;
      ac_push(x, eT, X + w / 2, Y + h / 2);
      card(x, X, Y, w, h, { u: pr(q, K.O_tc, K.O_tc + 0.5) });
      const kc = ac_in(q, tc);
      x.save(); x.globalAlpha *= cl(kc * 1.3); x.translate(0, (1 - kc) * 10);
      sym(x, "candles", 1320, 306, 56, { u: pr(q, tc, tc + 0.5) });
      T(x, "حساب التداول", 1708, 322, { w: 500, size: 42 });
      T(x, "حسابك · تداول اعتيادي", 1708, 372, { w: 400, size: 34, color: GREY });
      x.restore();
      // mini chart in corner marks, live
      const C = { X: 1292, Y: 405, w: 416, h: 125, n: 12, body: 18 };
      const ly = ac_live(x, q, C, ac_OD, ac_Ost, [{ i: 5, t: K.O_buy1 }, { i: 12, t: K.O_buy2 }]);
      corners(x, C.X, C.Y, C.w, C.h, { L: 18, u: pr(q, K.O_chart - 0.05, K.O_chart + 0.4), u2: pr(q, K.O_chart + 0.35, K.O_chart + 0.65), mid: ly ?? undefined });
      x.restore();
    }
    // ---- metallic '+' between the cards, above Rabee
    if (q >= K.O_plus && q <= K.O_out + dout) {
      const k = pr(q, K.O_plus, K.O_plus + 0.35), xp = ac_out(q, K.O_out, dout), sc = lerp(0.8, 1, back(k, 1.4)) * xp.sc;
      x.save(); x.globalAlpha *= cl(k * 4) * xp.a; x.translate(946, 330 + xp.dy); x.scale(sc, sc); x.translate(-946, -330);
      metal(x, "+", 946, 380, 140, { align: "center" });
      x.restore();
    }
    // ---- allocation card (left)
    if (eA) {
      const X = 180, Y = 250, w = 480, h = 300, tc = K.O_ac + 0.12;
      ac_push(x, eA, X + w / 2, Y + h / 2);
      card(x, X, Y, w, h, { u: pr(q, K.O_ac, K.O_ac + 0.5) });
      // pour: a 4 x 4 lattice of ◢ marks cascades from below the wordmark's clear space into the card, fading under its
      // top edge (columns 0.03 s apart, rows 0.07 s apart)
      for (let i = 0; i < 16; i++) {
        const col = i % 4, row = Math.floor(i / 4), ts = K.O_pour + col * 0.03 + row * 0.07, k = pr(q, ts, ts + 0.28);
        if (k <= 0 || k >= 1) continue;
        const px = 392 + col * 16, py = lerp(222, 276, in2(k)), s = 8;
        x.save(); x.globalAlpha *= 0.95 * cl((py - 222) / 8) * (1 - cl((py - Y) / (276 - Y))); x.fillStyle = RED;
        x.beginPath(); x.moveTo(px + s, py); x.lineTo(px + s, py + s); x.lineTo(px, py + s); x.closePath(); x.fill();
        x.restore();
      }
      const kc = ac_in(q, tc);
      x.save(); x.globalAlpha *= cl(kc * 1.3); x.translate(0, (1 - kc) * 10);
      const hub = pr(q, K.O_pour + 0.32, K.O_pour + 0.72);
      sym(x, "vault", 244, 314, 64, { u: pr(q, tc, tc + 0.5), k: { rot: (Math.PI / 3) * e3(pr(q, K.O_count, K.O_count + 0.6)), pulse: hub > 0 && hub < 1 ? hub : 0 } });
      T(x, "حساب التخصيص", 628, 322, { w: 500, size: 42 });
      T(x, "مموَّل", 628, 372, { w: 400, size: 34, color: GREY });
      // '$ 5,000' counts in fixed cells, relaxes to natural advances on landing, then one sheen; the 'Seed' chip
      if (q >= K.O_count) {
        const dc = 0.55, kn = e4(pr(q, K.O_count, K.O_count + dc)), n = kn >= 1 ? 5000 : Math.round((5000 * kn) / 10) * 10;
        metal(x, fmtMoney(n), 212, 525, 88, { tab: true, relax: pr(q, K.O_count + dc, K.O_count + dc + 0.15), a: cl(pr(q, K.O_count, K.O_count + 0.12)), sheen: pr(q, K.O_count + dc + 0.05, K.O_count + dc + 0.5) });
      }
      const kd = pr(q, K.O_seed, K.O_seed + 0.35);
      if (kd > 0) {
        x.save(); ac_clipL(x, 528, 632, 480, 532, expo(kd)); // Latin: left to right
        tag(x, 532, 486, 96, 40, {});
        T(x, "Seed", 580, 514.5, { w: 400, size: 24, fam: LAT, align: "center" });
        x.restore();
      }
      x.restore();
      x.restore();
    }
    // ---- the axi wordmark rises above the allocation card (the provider) and pours its ◢ into it (above); on «Axi» it
    //      pops 4 % (back) while a red underline wipes in left to right under its clear space; it exits last, by 77.96
    const kw = pr(q, K.O_mark, K.O_mark + 0.45), xm = ac_out(q, K.O_markOut, 0.24);
    if (kw > 0 && xm.a > 0) {
      const ax = await im("axi_part_white.png");
      const mh = 44, mw = (mh * LOGO.axiW) / LOGO.h, MX = 420 - mw / 2, MY = 174 + (1 - expo(kw)) * 16 + xm.dy;
      const p1 = pr(q, K.O_axi, K.O_axi + 0.12), p2 = pr(q, K.O_axi + 0.12, K.O_axi + 0.34);
      const ps = (p2 > 0 ? lerp(1.04, 1, e3(p2)) : lerp(1, 1.04, back(p1, 1.6))) * xm.sc;
      x.save(); x.globalAlpha *= cl(kw * 1.4) * xm.a;
      x.translate(420, MY + mh / 2); x.scale(ps, ps); x.translate(-420, -(MY + mh / 2));
      x.drawImage(ax, MX, MY, mw, mh);
      x.restore();
      const ku = expo(pr(q, K.O_axi + 0.04, K.O_axi + 0.26));
      if (ku > 0) { x.save(); x.globalAlpha *= xm.a; x.fillStyle = RED; x.fillRect(MX, 231.5 + xm.dy, mw * ku, 3); x.restore(); }
    }
  }

  // ================================================================== P · VO 78.04-78.92 · NOTE TAG (L2 corner slot)
  function ac_P(x, q) {
    const K = ac_K, dout = 0.28;
    if (q < K.P_tag || q > K.P_out + dout) return;
    const xo = ac_out(q, K.P_out, dout);
    x.save(); x.globalAlpha *= xo.a; x.translate(0, xo.dy); x.translate(380, 296); x.scale(xo.sc, xo.sc); x.translate(-380, -296);
    // red TAG '!': scaleX 0 -> 1 from its right edge (0.2 s expo), then rocks ±4° twice
    const ks = expo(pr(q, K.P_tag, K.P_tag + 0.2)), kr = pr(q, K.P_rock, K.P_rock + 0.2);
    const rot = kr > 0 && kr < 1 ? ((4 * Math.PI) / 180) * Math.sin(kr * 4 * Math.PI) * (1 - 0.35 * kr) : 0;
    x.save(); x.translate(636, 296); x.scale(Math.max(0.001, ks), 1); x.translate(-636, -296);
    x.translate(588, 296); x.rotate(rot); x.translate(-588, -296);
    tag(x, 540, 260, 96, 72, { fill: "red" });
    T(x, "!", 588, 313.5, { w: 600, size: 48, fam: LAT, align: "center" });
    x.restore();
    // «ملاحظة مهمّة» reveals right to left beside it
    const kt = e4(pr(q, K.P_txt, K.P_txt + 0.34));
    if (kt > 0) { x.save(); ac_clipR(x, 120, 530, 220, 390, kt); T(x, "ملاحظة مهمّة", 520, 318 + (1 - kt) * 12, { w: 500, size: 56 }); x.restore(); }
    x.restore();
  }

  // ================================================================== Q · VO 79.02-84.60 · locked, but linked (L3, x <= 790)
  function ac_Q(x, q) {
    const K = ac_K, dout = 0.3;
    const eA = ent(q, K.Q_ac, K.Q_out, { din: 0.5, dout, rise: 24 });
    if (!eA) return;
    const eB = ent(q, K.Q_tc, K.Q_out, { din: 0.5, dout, rise: 40 });
    // ---- allocation card
    {
      const X = 160, Y = 180, w = 600, h = 250, tc = K.Q_ac + 0.12;
      ac_push(x, eA, X + w / 2, Y + h / 2);
      card(x, X, Y, w, h, { u: pr(q, K.Q_ac, K.Q_ac + 0.5) });
      const kc = ac_in(q, tc);
      x.save(); x.globalAlpha *= cl(kc * 1.3); x.translate(0, (1 - kc) * 10);
      sym(x, "vault", 232, 252, 72, { u: pr(q, tc, tc + 0.5) });
      T(x, "حساب التخصيص", 720, 262, { w: 500, size: 48 });
      // greyed DARK pill «تداول»: click, shake ±8 px three times
      const ksh = pr(q, K.Q_shake, K.Q_shake + 0.3), dx = ksh > 0 && ksh < 1 ? 8 * Math.sin(ksh * 6 * Math.PI) * (1 - 0.4 * ksh) : 0;
      pill(x, 550 + dx, 296, 170, 60, "تداول", { kind: "dark", fill: TRACK, color: DIM, w: 500, size: 34, press: q >= K.Q_click ? q - K.Q_click : null });
      // slash across the pill
      const kl = e3(pr(q, K.Q_slash, K.Q_slash + 0.14));
      if (kl > 0) {
        x.save(); x.strokeStyle = RED; x.lineWidth = 3; x.lineCap = "round";
        x.beginPath(); x.moveTo(548, 356); x.lineTo(lerp(548, 722, kl), lerp(356, 296, kl)); x.stroke(); x.restore();
      }
      // padlock drops onto the pill's left end; the shackle snaps down 10 px (2-frame 4 px shake, red ring r 30 -> 70)
      const kd = pr(q, K.Q_lock, K.Q_lock + 0.22);
      if (kd > 0) {
        const ds = q - K.Q_snap, shk = ds >= 0 && ds < 0.08 ? (Math.floor(ds / 0.04) % 2 ? -4 : 4) : 0;
        // a short drop (14 px, clear of the title) with a scale-in, then a 3 px settle
        const py = 322 - 14 * (1 - in2(kd)) + (kd >= 1 ? 3 * Math.sin(Math.PI * pr(q, K.Q_lock + 0.22, K.Q_lock + 0.34)) : 0);
        const op = 1 - pr(q, K.Q_snap, K.Q_snap + 0.08), s = 0.64, ps = lerp(1.2, 1, in2(kd));
        x.save(); x.globalAlpha *= cl(kd * 3); x.translate(550 + shk, py); x.scale(ps, ps);
        x.fillStyle = "#131417"; x.beginPath(); x.roundRect(-30 * s, -4 * s, 60 * s, 46 * s, 8 * s); x.fill();
        sym(x, "padlock", 0, 0, 64, { k: { open: op } });
        x.restore();
        const kr = pr(q, K.Q_snap, K.Q_snap + 0.4);
        if (kr > 0 && kr < 1) { x.save(); x.globalAlpha *= 0.8 * (1 - kr); x.strokeStyle = RED; x.lineWidth = 2; x.beginPath(); x.arc(550, 324, lerp(30, 70, e3(kr)), 0, Math.PI * 2); x.stroke(); x.restore(); }
      }
      // «لا تداول مباشر»
      const kt = e4(pr(q, K.Q_slash, K.Q_slash + 0.35));
      if (kt > 0) { x.save(); ac_clipR(x, 470, 724, 360, 432, kt); T(x, "لا تداول مباشر", 720, 404, { w: 400, size: 36 }); x.restore(); }
      x.restore();
      // the rim flashes red as each pulse arrives
      for (const tp of [K.Q_p1, K.Q_p2]) {
        const kf = pr(q, tp + 0.25, tp + 0.6);
        if (kf > 0 && kf < 1) { x.save(); x.globalAlpha *= 0.9 * (1 - kf); chamferPath(x, X, Y, w, h, cutOf(w, h)); x.strokeStyle = RED; x.lineWidth = 2; x.stroke(); x.restore(); }
      }
      x.restore();
    }
    // ---- cursor: glides to the pill and clicks (tip path inside x 520-790)
    {
      const k = pr(q, K.Q_cur, K.Q_click - 0.02), ko = pr(q, K.Q_shake + 0.32, K.Q_shake + 0.5);
      if (k > 0 && ko < 1) {
        const u = eio(k), cx = lerp(756, 642, u), cy = lerp(478, 330, u);
        const pz = q >= K.Q_click && q < K.Q_click + 0.08 ? 0.9 : 1;
        x.save(); x.globalAlpha *= eA.a * cl(k * 5) * (1 - eio(ko)); x.translate(cx, cy); x.scale(pz, pz); cursor(x, 0, 0); x.restore();
      }
    }
    if (!eB) return;
    // ---- trading card rises in below
    {
      const X = 160, Y = 640, w = 600, h = 200, tc = K.Q_tc + 0.12;
      ac_push(x, eB, X + w / 2, Y + h / 2);
      card(x, X, Y, w, h, { u: pr(q, K.Q_tc, K.Q_tc + 0.5) });
      const kc = ac_in(q, tc);
      x.save(); x.globalAlpha *= cl(kc * 1.3); x.translate(0, (1 - kc) * 10);
      T(x, "حساب التداول", 720, 708, { w: 500, size: 42 });
      T(x, "حسابك", 720, 762, { w: 400, size: 34, color: GREY });
      x.restore();
      const C = { X: 196, Y: 672, w: 224, h: 140, n: 6, body: 18 };
      const ly = ac_live(x, q, C, ac_QD, (i) => tc + 0.1 + i * 0.05, []);
      corners(x, C.X, C.Y, C.w, C.h, { L: 18, u: pr(q, tc - 0.05, tc + 0.4), u2: pr(q, tc + 0.3, tc + 0.6), mid: ly ?? undefined });
      x.restore();
    }
    // ---- dotted link (draws bottom to top), chain on an INK disc, «ربط تلقائي», two red pulses up the link
    {
      const xo = ac_out(q, K.Q_out, dout);
      x.save(); x.globalAlpha *= xo.a; x.translate(0, xo.dy);
      const kl = e3(pr(q, K.Q_link, K.Q_link + 0.3));
      if (kl > 0) {
        x.fillStyle = "rgba(255,255,255,0.35)"; x.beginPath();
        for (let y = 634; y >= 436; y -= 12) if (640 - y <= kl * 210) { x.moveTo(461.5, y); x.arc(460, y, 1.5, 0, Math.PI * 2); }
        x.fill();
      }
      const kd = pr(q, K.Q_chain - 0.2, K.Q_chain + 0.12);
      if (kd > 0) {
        const sc = lerp(0.85, 1, expo(kd));
        x.save(); x.globalAlpha *= cl(kd * 3); x.translate(460, 535); x.scale(sc, sc);
        x.fillStyle = INK; x.beginPath(); x.arc(0, 0, 38, 0, Math.PI * 2); x.fill();
        x.lineWidth = 1.5; x.strokeStyle = "rgba(255,255,255,0.14)"; x.stroke();
        sym(x, "chain", 0, 0, 56, { k: { join: pr(q, K.Q_chain - 0.18, K.Q_chain) } });
        x.restore();
        const kr = pr(q, K.Q_chain, K.Q_chain + 0.35);
        if (kr > 0 && kr < 1) { x.save(); x.globalAlpha *= 0.5 * (1 - kr); x.strokeStyle = WHITE; x.lineWidth = 2; x.beginPath(); x.arc(460, 535, lerp(38, 58, e3(kr)), 0, Math.PI * 2); x.stroke(); x.restore(); }
      }
      const kt = e4(pr(q, K.Q_chain, K.Q_chain + 0.35));
      if (kt > 0) { x.save(); ac_clipR(x, 530, 724, 500, 580, kt); T(x, "ربط تلقائي", 720, 547, { w: 400, size: 36, color: GREY }); x.restore(); }
      for (const tp of [K.Q_p1, K.Q_p2]) {
        const k = pr(q, tp, tp + 0.25); if (k <= 0 || k >= 1) continue;
        const y = lerp(640, 430, eio(k));
        glow(x, 460, y, 24, RED, 0.6); x.fillStyle = RED; x.beginPath(); x.arc(460, y, 6, 0, Math.PI * 2); x.fill();
      }
      x.restore();
    }
  }

  // ================================================================== R · VO 84.70-90.96 · COPY x10 (VC WIDE)
  const ac_ARC = (() => { // quadratic (1260,320) via (960,40) to (660,320): arc-length table
    const P0 = [1260, 320], Cc = [960, 40], P2 = [660, 320], N = 360, pts = [], len = [0];
    for (let i = 0; i <= N; i++) {
      const u = i / N, a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u;
      pts.push([a * P0[0] + b * Cc[0] + c * P2[0], a * P0[1] + b * Cc[1] + c * P2[1]]);
      if (i) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    }
    const L = len[N], d0 = [pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]], d1 = [pts[N][0] - pts[N - 1][0], pts[N][1] - pts[N - 1][1]];
    const n0 = Math.hypot(d0[0], d0[1]), n1 = Math.hypot(d1[0], d1[1]);
    // position at arc length s (extended along the end tangents beyond 0 and L)
    function at(s) {
      if (s <= 0) return [P0[0] + (d0[0] / n0) * s, P0[1] + (d0[1] / n0) * s];
      if (s >= L) return [P2[0] + (d1[0] / n1) * (s - L), P2[1] + (d1[1] / n1) * (s - L)];
      let lo = 0, hi = N;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (len[m] < s) lo = m; else hi = m; }
      const f = (s - len[lo]) / (len[hi] - len[lo] || 1);
      return [lerp(pts[lo][0], pts[hi][0], f), lerp(pts[lo][1], pts[hi][1], f)];
    }
    const dots = []; for (let s = 7; s < L; s += 14) dots.push([s, at(s)]);
    return { L, at, dots };
  })();
  const ac_AL = { X: 180, Y: 240, w: 480, h: 340 }, ac_TC = { X: 1260, Y: 240, w: 480, h: 340 };
  // trade ticket: TAG 220x50, ▲ RED (buy) / ▼ WHITE (sell) at the right end, «شراء|بيع» + lot (Inter). o: ghost, redEdge,
  // rim, flip (0..1 vertical flip of the lot), a
  function ac_chip(x, X, Y, tr, lot, o = {}) {
    const w = 220, h = 50, a = o.a ?? 1; if (a <= 0.003) return;
    x.save(); x.globalAlpha *= a;
    tagPath(x, X, Y, w, h);
    if (o.ghost) { x.fillStyle = INK; x.fill(); x.lineWidth = 1.5; x.strokeStyle = "rgba(255,255,255,0.62)"; x.stroke(); }
    else { x.fillStyle = "#1C1D20"; x.fill(); x.lineWidth = 1.5; x.strokeStyle = o.rim ? rgba(RED, o.rim) : "rgba(255,255,255,0.13)"; x.stroke(); }
    if (o.redEdge) { x.save(); tagPath(x, X, Y, w, h); x.clip(); x.fillStyle = RED; x.fillRect(X + w - 4, Y, 4, h); x.restore(); }
    x.fillStyle = tr.buy ? RED : WHITE; x.strokeStyle = x.fillStyle;
    ac_tri(x, X + w - 30, Y + h / 2, 16, 11, tr.buy);
    const wd = tr.buy ? "شراء" : "بيع";
    T(x, wd, X + w - 50, Y + 36, { w: 400, size: 34 });
    const lx = X + w - 50 - measure(x, wd, 400, 34, AR) - 14;
    const fy = o.flip != null ? Math.abs(Math.cos(Math.PI * o.flip)) : 1;
    x.save(); x.translate(0, Y + 25); x.scale(1, Math.max(0.02, fy)); x.translate(0, -(Y + 25));
    T(x, lot, lx, Y + 36.5, { w: 400, size: 32, fam: LAT, align: "right" });
    x.restore();
    x.restore();
  }
  // cached chip sprites (text shaping is the costly part): one per trade x lot x style, drawn 1:1 at (X - 6, Y - 6)
  const ac_CHIP = {};
  function ac_chipC(x, X, Y, tr, lot, o = {}) {
    const live = (o.flip != null && o.flip > 0 && o.flip < 1);
    if (live) return ac_chip(x, X, Y, tr, lot, o);
    const k = [tr.buy ? 1 : 0, lot, o.ghost ? 1 : 0, o.redEdge ? 1 : 0].join("|");
    let c = ac_CHIP[k];
    if (!c) { // ghosts ride at up to 1.25x, so their sprite is drawn at 1.25x resolution
      const ss = o.ghost ? 1.25 : 1;
      c = ac_CHIP[k] = U.mk(Math.ceil(232 * ss), Math.ceil(74 * ss)); c.x.scale(ss, ss); // room for descenders
      ac_chip(c.x, 6, 6, tr, lot, { ghost: o.ghost, redEdge: o.redEdge });
    }
    const a = o.a ?? 1; if (a <= 0.003) return;
    x.save(); x.globalAlpha *= a; x.drawImage(c, X - 6, Y - 6, 232, 74);
    if (o.rim > 0) { tagPath(x, X, Y, 220, 50); x.lineWidth = 1.5; x.strokeStyle = rgba(RED, o.rim); x.stroke(); }
    x.restore();
  }
  // positions of a list: newest at slot 0 (top y 376); the older chips move down 60 px over [t - 0.05, t + 0.2] (expo) while
  // the new chip reveals (RTL clip) from t - 0.05 too, so the top slot never sits empty (ac_R clips each chip above the
  // next older one, so they never overlap while it moves away); 3 visible
  function ac_list(q, times) {
    return times.map((t0, j) => {
      if (q < t0 - 0.05) return null;
      let pos = 0; for (let k = j + 1; k < times.length; k++) pos += expo(pr(q, times[k] - 0.05, times[k] + 0.2));
      return { y: 376 + 60 * pos, a: cl(3 - pos), kin: expo(pr(q, t0 - 0.05, t0 + 0.25)) };
    });
  }
  // ghost path: centre arc length for trade progress u (0..1), from the arc's start to its end: into the apex node
  // (decelerating), then out of it
  function ac_ghostS(u) {
    const L = ac_ARC.L, S0 = 0, Sa = L / 2, S1 = L;
    return u < 0.5 ? lerp(S0, Sa, eio(u / 0.5)) : lerp(Sa, S1, eio((u - 0.5) / 0.5));
  }
  function ac_R(x, q) {
    const K = ac_K, dout = 0.34, R = ac_TR, xo = ac_out(q, K.R_out, dout);
    const eT = ent(q, K.R_tc, K.R_out, { din: 0.5, dout, rise: 24 }), eA = ent(q, K.R_ac, K.R_out, { din: 0.5, dout, rise: 24 });
    // floor spill under both cards (with their cards); a pulse under the allocation card on every landing
    const sl = [];
    if (eA) {
      let p = 0; for (const tr of R) { const k = pr(q, tr.s + tr.d, tr.s + tr.d + 0.6); if (k > 0 && k < 1) p += 0.22 * (1 - k); }
      sl.push({ u: -2.75, v: -0.6, rx: 1.1, color: RED, a: (0.12 + p) * eA.a });
    }
    if (eT) sl.push({ u: 2.75, v: -0.6, rx: 1.1, color: WHITE, a: 0.1 * eT.a });
    spill(x, sl);
    // ---- the red dotted arc, drawn right to left (the direction of copying)
    const ka = e2(pr(q, K.R_arc, K.R_arc + 0.5));
    if (ka > 0 && xo.a > 0) {
      x.save(); x.globalAlpha *= 0.55 * xo.a; x.translate(0, xo.dy); x.fillStyle = RED; x.beginPath();
      for (const [s, p] of ac_ARC.dots) if (s <= ka * ac_ARC.L) { x.moveTo(p[0] + 1.5, p[1]); x.arc(p[0], p[1], 1.5, 0, Math.PI * 2); }
      x.fill(); x.restore();
    }
    // ---- cards + lists (right first)
    const lists = [
      { e: eT, C: ac_TC, t0: K.R_tc, icon: "candles", title: "حساب التداول", chips: ac_list(q, R.map((r) => r.a)), x10: false },
      { e: eA, C: ac_AL, t0: K.R_ac, icon: "vault", title: "حساب التخصيص", chips: ac_list(q, R.map((r) => r.s + r.d - 0.15)), x10: true }, // the chip reveals from s+d-0.20, as the ghost fades
    ];
    for (const Lc of lists) {
      if (!Lc.e) continue;
      const { X, Y, w, h } = Lc.C, tc = Lc.t0 + 0.12, Xr = X + w - 32;
      ac_push(x, Lc.e, X + w / 2, Y + h / 2);
      card(x, X, Y, w, h, { u: pr(q, Lc.t0, Lc.t0 + 0.5) });
      const kc = ac_in(q, tc);
      x.save(); x.globalAlpha *= cl(kc * 1.3); x.translate(0, (1 - kc) * 10);
      sym(x, Lc.icon, X + 60, 286, 56, { u: pr(q, tc, tc + 0.5) });
      T(x, Lc.title, Xr, 300, { w: 500, size: 42 });
      T(x, "الصفقات", Xr, 350, { w: 400, size: 34, color: GREY });
      x.restore();
      x.save(); x.beginPath(); x.rect(X, 364, w, Y + h - 364 - 8); x.clip();
      Lc.chips.forEach((c, j) => {
        if (!c || c.a <= 0) return;
        const tr = R[j], dxi = (1 - c.kin) * 30, rim = Lc.x10 ? 0.9 * (1 - pr(q, tr.s + tr.d, tr.s + tr.d + 0.5)) : 0;
        // clipped 3 px above the next older chip's top: the new chip opens with the slot instead of overlapping
        const pv = j > 0 ? Lc.chips[j - 1] : null, yb = pv ? Math.max(c.y - 6, Math.min(c.y + 64, pv.y - 3)) : c.y + 64;
        x.save(); x.globalAlpha *= cl(c.kin * 1.4); ac_clipR(x, Xr - 224, Xr + 4, c.y - 6, yb, c.kin);
        ac_chipC(x, Xr - 220 + dxi, c.y, tr, Lc.x10 ? tr.x10 : tr.lot, { a: c.a, redEdge: Lc.x10, rim });
        x.restore();
      });
      x.restore();
      x.restore();
    }
    // ---- apex node: TAG with COPY -> metallic x10; label «نسخ تلقائي» -> «معامل الضرب»
    const kn = pr(q, K.R_node, K.R_node + 0.35);
    if (kn > 0 && xo.a > 0) {
      let fl = 0;
      for (const tr of R) { const tA = tr.s + tr.d / 2, k = pr(q, tA - 0.04, tA + 0.36); if (k > 0 && k < 1) fl = Math.max(fl, 1 - k); }
      const km = pr(q, K.R_x10, K.R_x10 + 0.4), puls = q > K.R_x10 + 0.4 ? 0.5 + 0.5 * Math.sin((2 * Math.PI * (q - K.R_x10 - 0.4)) / 0.9 - Math.PI / 2) : 0;
      const sc = lerp(0.9, 1, expo(kn)) * (1 + 0.05 * fl) * xo.sc;
      x.save(); x.globalAlpha *= cl(kn * 3) * xo.a; x.translate(960, 180 + xo.dy); x.scale(sc, sc); x.translate(-960, -180);
      tag(x, 870, 144, 180, 72, { rim: Math.max(0.95 * fl, 0.35 * puls) });
      const kcopy = 1 - e3(pr(km, 0, 0.45)), kx = e3(pr(km, 0.25, 1));
      if (kcopy > 0) { x.save(); x.translate(960, 180); x.scale(lerp(0.7, 1, kcopy), lerp(0.7, 1, kcopy)); sym(x, "copy", 0, 0, 46, { u: pr(q, K.R_node + 0.05, K.R_node + 0.5), a: kcopy }); x.restore(); }
      if (kx > 0) { const s2 = lerp(1.15, 1, kx); x.save(); x.translate(960, 180); x.scale(s2, s2); x.translate(-960, -180); metal(x, ac_MUL, 960, 203, 64, { align: "center", a: kx }); x.restore(); }
      x.restore();
      // label above the node
      const kl = e3(pr(q, K.R_x10, K.R_x10 + 0.3)), la = cl(kn * 2) * xo.a;
      if (kl < 1) T(x, "نسخ تلقائي", 960, 114 + xo.dy, { w: 400, size: 36, align: "center", a: la * (1 - kl) });
      if (kl > 0) T(x, "معامل الضرب", 960, 114 + xo.dy + (1 - kl) * 8, { w: 400, size: 36, align: "center", a: la * kl });
    }
    // ---- ghosts ride the arc (outside the cards), led by a red comet; drawn over the node so the lot flip
    // reads at the apex, where the ghost is slowest
    x.save(); x.translate(0, xo.dy); x.globalAlpha *= xo.a;
    x.beginPath(); x.rect(0, 0, W, H); x.rect(ac_AL.X, ac_AL.Y - 30, ac_AL.w, ac_AL.h + 60); x.rect(ac_TC.X, ac_TC.Y - 30, ac_TC.w, ac_TC.h + 60); x.clip("evenodd");
    for (const tr of R) {
      const u = pr(q, tr.s, tr.s + tr.d); if (u <= 0 || u >= 1) continue;
      const sg = ac_ghostS(u), sc = lerp(1, 1.25, e3(pr(u, 0.5, 0.64))), [gx, gy] = ac_ARC.at(sg);
      const flip = pr(u, 0.44, 0.56), lot = flip < 0.5 ? tr.lot : tr.x10;
      // the ghost fades in off the trading card's edge and cross-dissolves into its list chip over its last 0.16 s (e3,
      // fast start), so the part cut at the allocation card's edge is at <= .5 alpha once its chip shows
      const gin = eio(pr(q, tr.s, tr.s + 0.08)), ga = gin * (1 - e3(pr(q, tr.s + tr.d - 0.16, tr.s + tr.d)));
      x.save(); x.globalAlpha *= ga; x.translate(gx, gy); x.scale(sc, sc);
      ac_chipC(x, -110, -25, tr, lot, { ghost: true, flip });
      x.restore();
      // comet ahead of the ghost: head r 8, glow r 28, 6 trailing dots (the tail shrinks as it slows into the node); it
      // stops at the arc's end and fades over its last 90 px
      const sp = Math.abs(ac_ghostS(cl(u + 0.01)) - ac_ghostS(cl(u - 0.01))) / (0.02 * tr.d), gap = cl(sp / 160, 0, 9);
      const lead = sg + 110 * sc + 74, sc0 = Math.min(ac_ARC.L, lead), [hx, hy] = ac_ARC.at(sc0);
      const ca = gin * (1 - eio(cl((lead - (ac_ARC.L - 90)) / 90)));
      if (ca > 0.003) {
        x.save(); x.globalAlpha *= ca;
        glow(x, hx, hy, 28, RED, 0.55);
        x.fillStyle = RED; x.beginPath(); x.arc(hx, hy, 8, 0, Math.PI * 2); x.fill();
        for (let k = 1; k <= 6; k++) {
          const [tx, ty] = ac_ARC.at(sc0 - k * gap - 6);
          x.save(); x.globalAlpha *= 0.75 * (1 - k / 7); x.beginPath(); x.arc(tx, ty, lerp(5, 1.6, k / 6), 0, Math.PI * 2); x.fill(); x.restore();
        }
        x.restore();
      }
    }
    x.restore();
    // ---- caption «مثال: مرحلة Seed», centred at the cards' label line, clear of the ghosts' path and above his head
    const kcap = ac_in(q, K.R_cap, 0.4);
    if (kcap > 0 && xo.a > 0) {
      const parts = [{ s: "مثال:" }, { s: "مرحلة" }, { s: "Seed", fam: LAT, size: 32 }], wd = ac_runsW(x, parts, { size: 34 });
      ac_runs(x, parts, 960 + wd / 2, 345 + (1 - kcap) * 14 + xo.dy, { size: 34, color: GREY, a: cl(kcap * 1.3) * xo.a });
    }
  }

  // ================================================================== S · VO 91.04-95.86 · bookmark the word (L2 corner slot)
  function ac_S(x, q) {
    const K = ac_K, e = ent(q, K.S_tag, K.S_out, { din: 0.45, dout: 0.36, rise: 20 });
    if (!e) return;
    ac_push(x, e, 375, 335);
    x.save(); ac_clipR(x, 111, 639, 200, 380, expo(pr(q, K.S_tag, K.S_tag + 0.45))); tag(x, 115, 236, 520, 130, {}); x.restore();
    const kc = ac_in(q, K.S_tag + 0.12);
    x.save(); x.globalAlpha *= cl(kc * 1.3);
    T(x, "معامل الضرب", 595, 318 + (1 - kc) * 12, { w: 500, size: 46 });
    // x10 on «الضرب»: a 4 % pop (back) and a red-edged glint sweeping left to right
    const pg = pr(q, K.S_sheen, K.S_sheen + 0.12), pg2 = pr(q, K.S_sheen + 0.12, K.S_sheen + 0.34);
    const gs = pg2 > 0 ? lerp(1.04, 1, e3(pg2)) : lerp(1, 1.04, back(pg, 1.6));
    const gy0 = 324 + (1 - kc) * 12, gw = metalWidth(ac_MUL, 68);
    x.save(); x.translate(160 + gw / 2, gy0 - 25); x.scale(gs, gs); x.translate(-(160 + gw / 2), -(gy0 - 25));
    ac_glint(x, 156, gy0 - 72, gw + 8, 86, pr(q, K.S_sheen, K.S_sheen + 0.4), (c) => metal(c, ac_MUL, 160, gy0, 68));
    x.restore();
    x.restore();
    // the red flag (bookmark variant, h 56) drops from above and clips onto the tag's top edge (expo, 4 px settle)
    const kf = pr(q, K.S_flag, K.S_flag + 0.32);
    if (kf > 0) {
      const y = lerp(204 - 100, 204, expo(kf)) + 4 * Math.sin(Math.PI * pr(q, K.S_flag + 0.2, K.S_flag + 0.4));
      flag(x, 534, y, 56, { mirror: true, a: cl(kf * 4) });
    }
    // dark pill with a red circle ← under the tag
    const kp = expo(pr(q, K.S_pill, K.S_pill + 0.4));
    if (kp > 0) {
      x.save(); ac_clipR(x, 111, 599, 386, 500, kp); x.translate(0, (1 - kp) * 14);
      pill(x, 115, 400, 480, 70, "في الفيديوهات القادمة", { kind: "dark", circle: true, a: cl(kp * 1.3) });
      x.restore();
    }
    x.restore();
  }

  // ================================================================== T · VO 95.95-102.08 · rule sheet (L1, x >= 1220)
  const ac_ROWS = [440, 510, 580, 650], ac_BARS = [320, 260, 360];
  function ac_Tsheet(x, q) {
    const K = ac_K, e = ent(q, K.T_card, K.T_out, { din: 0.5, dout: 0.16, rise: 24 }); // short exit: row 4 holds 0.5 s
    if (!e) return;
    const X = 1240, Y = 230, w = 580, h = 470, tc = K.T_card + 0.12;
    ac_push(x, e, X + w / 2, Y + h / 2);
    card(x, X, Y, w, h, { u: pr(q, K.T_card, K.T_card + 0.5) });
    // two-tone header (a card header: no flag)
    headline(x, [["قواعد", "g"], ["كل", "w"], ["مرحلة", "w"]], 1780, 300, 46, q, tc, { w: 400 });
    // six stage symbols, DIM, light 01 -> 06 (white + red) with a pop, then settle into their normal library look. Their
    // red element stays: an all-white settle erased the '500' of the Pro 500 tag and turned ▲▲▲ into a tree shape.
    const kc = ac_in(q, tc + 0.1);
    STAGES.forEach((st, i) => {
      const cx = 1760 - 80 * i, cy = 350, tl = K.T_sym + 0.15 * i, kl = pr(q, tl, tl + 0.3);
      const kD = { t: 0, ignite: 1, flagU: 1, grow: 1 };
      if (kl <= 0) { sym(x, st.sym, cx, cy, 40, { dim: true, a: kc, k: kD }); return; }
      const kL = { t: q - tl, ignite: kl, flagU: kl, grow: kl };
      const sc = lerp(1.18, 1, e3(pr(q, tl, tl + 0.25)));
      x.save(); x.translate(cx, cy); x.scale(sc, sc); x.translate(-cx, -cy);
      if (kl < 1) sym(x, st.sym, cx, cy, 40, { dim: true, a: 1 - kl, k: kD });
      sym(x, st.sym, cx, cy, 40, { u: kl, k: kL });
      x.restore();
    });
    // three abstract rule rows (no invented text): slide in 30 px from the right, checks tick red
    const kdim = 1 - 0.6 * e3(pr(q, K.T_row4, K.T_row4 + 0.3));
    for (let r = 0; r < 3; r++) {
      const t0 = K.T_rows + 0.4 * r, ki = expo(pr(q, t0, t0 + 0.35)); if (ki <= 0) continue;
      const cy = ac_ROWS[r], dx = (1 - ki) * 30, tk = t0 + 0.1;
      x.save(); x.globalAlpha *= cl(ki * 1.3) * kdim; x.translate(dx, 0);
      const kt = pr(q, tk, tk + 0.12), sc = kt > 0 ? back(pr(q, tk, tk + 0.25), 1.4) : 1;
      x.save(); x.translate(1769, cy); x.scale(sc, sc); x.translate(-1769, -cy);
      ac_box(x, 1752, cy - 17, 34, 9);
      if (kt > 0) { x.save(); x.globalAlpha *= e3(kt); x.fillStyle = RED; x.fill(); x.restore(); }
      x.lineWidth = 1.5; x.strokeStyle = kt > 0 ? RED : "rgba(255,255,255,0.35)"; x.stroke();
      x.restore();
      ac_tick(x, 1769, cy, 8.5, pr(q, tk + 0.05, tk + 0.3));
      rr(x, 1730 - ac_BARS[r], cy - 7, ac_BARS[r], 14, 7); x.fillStyle = TRACK; x.fill();
      x.restore();
    }
    // row 4 in focus: red '!' box, shield, «حدّ الانعكاس», importance bar at the card's left edge
    const k4 = expo(pr(q, K.T_row4, K.T_row4 + 0.3));
    if (k4 > 0) {
      const cy = ac_ROWS[3];
      x.save(); x.globalAlpha *= cl(k4 * 1.4); x.translate((1 - k4) * 30, 0);
      const sc = back(pr(q, K.T_row4, K.T_row4 + 0.22), 1.4);
      x.save(); x.translate(1769, cy); x.scale(sc, sc); x.translate(-1769, -cy);
      ac_box(x, 1752, cy - 17, 34, 9); x.fillStyle = RED; x.fill();
      x.fillStyle = WHITE; rr(x, 1767.5, cy - 10, 3, 13, 1.5); x.fill(); x.beginPath(); x.arc(1769, cy + 8, 2, 0, Math.PI * 2); x.fill();
      x.restore();
      sym(x, "shield", 1300, cy, 40, { u: pr(q, K.T_row4, K.T_row4 + 0.4) });
      T(x, "حدّ الانعكاس", 1730, 663, { w: 500, size: 38 });
      x.restore();
      const kb = e3(pr(q, K.T_row4 + 0.04, K.T_row4 + 0.26));
      x.fillStyle = RED; x.fillRect(1244, cy - 20 * kb, 4, 40 * kb);
    }
    x.restore();
  }

  // ================================================================== U · VO 102.15-108.00 · don't cross the line (VC WIDE)
  // candles in screen px [open, close, high, low] (pitch 40, body 20, x 200..640): six steady, five stepping down to the
  // limit (the last red wick stops 8 px above the line at y 600), then the white recovery candle
  const ac_UC = [
    [410, 392, 380, 420], [392, 404, 386, 412], [404, 386, 376, 410], [386, 398, 380, 404], [398, 384, 374, 404],
    [384, 392, 378, 398], [392, 440, 386, 448], [440, 476, 434, 484], [476, 462, 452, 486], [462, 528, 458, 536],
    [528, 582, 522, 592], [582, 534, 528, 590],
  ];
  const ac_Ust = (i) => (i < 6 ? ac_K.U_chart + 0.12 + i * 0.05 : i < 11 ? ac_K.U_down + (i - 6) * 0.15 : ac_K.U_rec);
  function ac_U(x, q) {
    const K = ac_K;
    if (q < K.U_head) return;
    const xA = ac_out(q, K.U_out, 0.3), xC = ac_out(q, K.U_chartOut, 0.3), xN = ac_out(q, K.U_tenOut, 0.3);
    // two-tone headline, centred in the top band (no flag)
    if (xA.a > 0) {
      const words = [["ألّا", "g"], ["يصل", "g"], ["انعكاس", "w"], ["حساب", "w"], ["التخصيص", "w"]];
      const tw = words.reduce((s, [wd]) => s + measure(x, wd, 300, 52, AR), 0) + 0.28 * 52 * (words.length - 1);
      x.save(); x.translate(0, xA.dy);
      headline(x, words, 960 + tw / 2, 170, 52, q, K.U_head, { w: 300, a: xA.a });
      x.restore();
    }
    // left chart: corner marks + dotted sides, dashed red −10% limit line, candles stepping down, recovery
    if (q >= K.U_chart && xC.a > 0) {
      const CX = 150, CY = 330, CW = 540, CH = 320;
      x.save(); x.globalAlpha *= xC.a; x.translate(420, 490 + xC.dy); x.scale(xC.sc, xC.sc); x.translate(-420, -490);
      corners(x, CX, CY, CW, CH, { L: 22, u: pr(q, K.U_chart, K.U_chart + 0.45), u2: pr(q, K.U_chart + 0.35, K.U_chart + 0.65), mid: 400 });
      const kl = e3(pr(q, K.U_lim, K.U_lim + 0.35));
      if (kl > 0) {
        let la = 0.75;
        for (let p = 0; p < 3; p++) { const k = pr(q, K.U_pulse + 0.15 * p, K.U_pulse + 0.15 * (p + 1)); if (k > 0 && k < 1) la = 0.5 + 0.5 * Math.sin(Math.PI * k); }
        x.save(); x.globalAlpha *= la; x.strokeStyle = RED; x.lineWidth = 2; x.setLineDash([8, 6]);
        x.beginPath(); x.moveTo(CX + CW - 6, 600); x.lineTo(lerp(CX + CW - 6, CX + 6, kl), 600); x.stroke(); x.restore();
        T(x, "−10%", 160, 590, { w: 500, size: 30, fam: LAT, color: RED, a: e3(pr(q, K.U_lim + 0.15, K.U_lim + 0.4)) });
      }
      ac_UC.forEach((c, i) => {
        const g = pr(q, ac_Ust(i), ac_Ust(i) + 0.3); if (g <= 0) return;
        candle(x, 200 + 40 * i, c[0], c[1], c[2], c[3], 20, { grow: g, newest: i === 11 });
      });
      x.restore();
    }
    // metallic 10% in the right third (scale 1.04 -> 1, bottom fade), one sheen; the footnote under it in two lines
    if (xN.a > 0) {
      x.save(); x.globalAlpha *= xN.a; x.translate(1615, 400 + xN.dy); x.scale(xN.sc, xN.sc); x.translate(-1615, -400);
      const kt = pr(q, K.U_ten, K.U_ten + 0.45);
      if (kt > 0) {
        const s = lerp(1.04, 1, expo(kt));
        x.save(); x.globalAlpha *= cl(kt * 2.2); x.translate(1615, 345); x.scale(s, s); x.translate(-1615, -345);
        metal(x, "10%", 1800, 430, 240, { align: "right", fade: true, sheen: pr(q, K.U_sheen, K.U_sheen + 0.45) });
        x.restore();
      }
      const kf = e2(pr(q, K.U_foot, K.U_foot + 0.3));
      if (kf > 0) {
        T(x, "* قد تختلف النسبة حسب المرحلة", 1800, 494, { w: 300, size: 34, color: GREY, a: 0.85 * kf });
        T(x, "وفق شروط البرنامج", 1800, 540, { w: 300, size: 34, color: GREY, a: 0.85 * kf });
      }
      x.restore();
    }
  }
  // floor: the dashed red limit ring (24 floorP arcs of 10° with 5° gaps, R 1.15 m, 0.05 m wide), drawn clockwise from
  // the front, with a soft white pool inside; both exit 105.20-105.50, before the push
  function ac_floorU(q, sh) {
    const K = ac_K, xo = ac_out(q, K.U_out, 0.3).a;
    if (q < K.U_ring || xo <= 0) return;
    sh.push(fPool(0.12 * e2(pr(q, K.U_ring, K.U_ring + 0.5)) * xo, "#ffffff", 1.15));
    const u = e2(pr(q, K.U_ring, K.U_ring + 0.7)) * 360, R = 1.15, hw = 0.025;
    const P = (deg, r) => { const th = (deg * Math.PI) / 180; return floorP(-r * Math.sin(th), -r * Math.cos(th)); };
    for (let i = 0; i < 24; i++) {
      const a0 = i * 15; if (u <= a0) break;
      const a1 = Math.min(a0 + 10, u), pts = [];
      for (let j = 0; j <= 4; j++) pts.push(P(lerp(a0, a1, j / 4), R + hw));
      for (let j = 4; j >= 0; j--) pts.push(P(lerp(a0, a1, j / 4), R - hw));
      sh.push({ type: "poly", pts, color: RED, a: 0.8 * xo });
    }
  }

  // ================================================================== register
  GROUPS.push({
    name: "accounts",
    floor(t, sh, S) {
      const q = t - P;
      if (q >= 84.6 && q < 86.0) fRipple(sh, t, v(ac_K.R_rip));
      if (q >= 102.1 && q < 105.6) ac_floorU(q, sh);
    },
    async draw(x, t, S) {
      const q = t - P;
      if (q < 68.0 || q > 108.1) return;
      const sh = S.shot || {}, vc = !!sh.k_vcam, clip = sh.clip;
      if (q < 78.04) { if (vc) { if (q < 70) await im("axi_part_white.png"); await ac_O(x, q); } } // preload the wordmark while HOME is clean
      else if (q < 79.0) { if (clip === "L2") ac_P(x, q); }
      else if (q < 84.68) { if (clip === "L3") ac_Q(x, q); }
      else if (q < 91.04) { if (vc) ac_R(x, q); }
      else if (q < 95.96) { if (clip === "L2") ac_S(x, q); }
      else if (q < 102.16) { if (clip === "L1") ac_Tsheet(x, q); }
      else if (vc) ac_U(x, q);
    },
  });
