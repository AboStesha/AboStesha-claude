
  // ================================================================== B-ROLLS 1 + 2 (group "broll", prefix br_): full-screen motion graphics
  // B-roll 1, VO 8.84-14.88 (frames 296-446): the DARK pill «افتح حساب تداول» is clicked and morphs into the chamfered
  //   «حساب تداول» card, its red disc becoming the scene's one flag. The official logo builds in the name field, the axi
  //   wordmark in the company field and «نشط» in the status field. The view then dives into the card's chart: page 7's
  //   edge marker grows into the price tab, the flag travels to «تداول بالشكل الاعتيادي», BUY and SELL tickets ride their
  //   candles, and a tall white candle punches into the hard cut.
  // B-roll 2, VO 64.62-68.10 (frames 1690-1776): a live chart over the dotted funded-capital line builds a profit zone; on
  //   «وسحب» the zone lifts off and flies into «حصّتك من الأرباح» as a split bar that fills red to «حتى» 80% «لك» / Axi,
  //   the footnote keeps it accurate, and the RED pill «سحب الأرباح» is pressed into the hard cut.
  // World: pure #000 (the special's black: no INK base and no lift, so the black matches the studio shots at all four cuts),
  //   lit only by the designed elements: the ◢ floor world (horizon y 610, f 1000, camera 1.6 m, dolly 1.2 m/s), a horizon
  //   haze and candle bokeh on the horizon, plus a slow drift (+0.5 %/s about the centre). Both scenes open and close on hard
  //   cuts at full opacity. Every exit inside them is an in-out fade that loses at most 14.3 % opacity in any one frame:
  //   smoothstep over 0.42 s (eio's in-out shape at half its peak slope; eio itself peaks at 3x linear and would need
  //   0.8 s), or linear over 0.28 s where the beat is shorter. Nothing below y 950.
  const br_SPR = {};
  // the exit curve: smoothstep, an in-out like eio with half its peak slope (1.5x linear), so over 0.42 s no frame
  // moves more than 14.3 %
  const br_ss = (p) => { p = cl(p); return p * p * (3 - 2 * p); };
  // an up candle's colour from the newest white (UPC2, k 0) to the older grey (UPC, k 1)
  const br_upc = (k) => `rgb(${Math.round(lerp(230, 138, k))},${Math.round(lerp(231, 137, k))},${Math.round(lerp(233, 138, k))})`;

  // ------------------------------------------------------------------ word onsets (VO s)
  // Snapped to the final voice (audio/vo/vo1_clean_v4.wav). work/words_v4.json gives the order, but whisper opens each
  // word where the previous one ends and so swallows the pauses; every onset was re-read from a 10 ms phonetic view of
  // the voice (level, voicing, /s/ energy). Real gaps, where the hits and SFX sit, in [ ]:
  // B-roll 1: [8.81-8.90] ستقوم 8.91 · بفتح 9.32 · حساب 9.78 (after the /t/ closure 9.72-9.74) · تداول 10.17 · اسمه 10.60 ·
  //   Axi 11.06 · Select 11.36 · [11.71-11.76] مع 11.77 · شركة 11.91 · Axi 12.30 · [12.64-12.67] وبدء 12.68 · التداول 12.93 ·
  //   عليه 13.41 · بالشكل 13.75 · [14.04-14.10] الاعتيادي 14.11 · [14.79-15.01]
  // B-roll 2: [64.68-64.95] يمكنك 64.96 · التداول 65.40 · به 65.89 · [66.19-66.33] وسحب 66.35 · نسبة 66.60 · محدّدة 66.94 ·
  //   من 67.44 · الأرباح 67.62 (its /b/ closure 67.98-68.00) · [68.17-]
  const br_K1 = {
    circle: 8.86, arrow: 8.96, pill: 9.22, label: 9.30, cur: 9.28, click: 9.70, morph: 9.76,
    head: 10.10, div: 10.18, sub: 10.25, well: 10.14, cdl: 10.20, fld: 10.28,
    logo: 11.02, sk2: 12.04, mark: 12.12, sk3: 12.18, stat: 12.22,
    zoom: 12.64, tab: 12.84, head2: 13.00,
    live: [13.20, 13.50, 13.80, 14.10, 14.40, 14.70], buy: 13.35, chev: 13.90, sell: 14.05, snap: 14.76,
  };
  const br_K2 = {
    head: 64.66, prints: [64.75, 64.92, 65.09, 65.26, 65.43, 65.60, 65.77], plbl: 65.40,
    lift: 66.24, panel: 66.46, fly: 66.62, fill: 67.02, foot: 67.00, lbl: 67.18, pill: 67.42, press: 67.94,
  };
  const br_S = {
    open: "افتح حساب تداول", f1: "اسم الحساب", f2: "الشركة", f3: "الحالة", active: "نشط", buy: "شراء", sell: "بيع",
    acct: [["حساب", "w"], ["تداول", "w"]], h1: [["تداول", "w"], ["بالشكل", "g"], ["الاعتيادي", "g"]],
    h2: [["تداول", "w"], ["برأس", "g"], ["المال", "g"], ["المموَّل", "g"]], fund: "رأس المال المموَّل", profit: "الأرباح",
    share: [["حصّتك", "w"], ["من", "w"], ["الأرباح", "w"]], upto: "حتى", you: "لك", cta: "سحب الأرباح",
    foot: [{ s: "* حسب المرحلة،" }, { s: "0%", lat: true }, { s: "في مرحلة" }, { s: "Seed", lat: true }],
  };

  // ------------------------------------------------------------------ chart data (time runs left to right)
  function br_ser(c0, open0, seed, wv) {
    return c0.map((c, i) => {
      const o = i ? c0[i - 1] : open0;
      return { o, c, h: Math.max(o, c) + 0.008 + hash(seed, i, 2) * wv, l: Math.min(o, c) - 0.008 - hash(seed, i, 3) * wv };
    });
  }
  // B-roll 1: 0-11 enter from the left on the zoom, 12-27 fill the card's well, 28-32 print live (28 is the BUY dip, 30 the
  // SELL high), 33 is the final punch
  const br_D1 = br_ser([0.22, 0.25, 0.23, 0.27, 0.30, 0.28, 0.31, 0.34, 0.33, 0.37, 0.35, 0.38,
    0.41, 0.39, 0.43, 0.46, 0.44, 0.47, 0.51, 0.48, 0.45, 0.49, 0.53, 0.55, 0.58, 0.60, 0.58, 0.62,
    0.55, 0.60, 0.66, 0.63, 0.68, 0.86], 0.24, 31, 0.04);
  br_D1[33].h = 0.875; br_D1[33].l = 0.672;
  // B-roll 2: 0-17 trade sideways on the funding line (p .312 = y 640), 18-24 print and climb
  const br_D2 = br_ser([0.30, 0.35, 0.39, 0.33, 0.28, 0.31, 0.36, 0.40, 0.35, 0.30, 0.25, 0.29, 0.34, 0.38, 0.33, 0.27, 0.29, 0.32,
    0.38, 0.45, 0.43, 0.52, 0.60, 0.67, 0.74], 0.31, 37, 0.025);
  // the live candle breathes ±6 px: a new offset every 0.5 s, eased in over 0.25 s
  function br_breath(t, seed, amp = 6) {
    const n = Math.floor(t / 0.5), f = t / 0.5 - n;
    return lerp((hash(seed, n, 5) * 2 - 1) * amp, (hash(seed, n + 1, 5) * 2 - 1) * amp, e3(cl(f / 0.5)));
  }

  // ------------------------------------------------------------------ the world
  // ◢ floor world: marks every 1.2 m (X ±24 m, Z cz+3.2 .. cz+40), sx = 960 + 1000X/d, sy = 610 + 1600/d. The mark is the
  // page 4-5 texture's ◢ at its measured proportion (9 px on a 57 px pitch = 0.19 m on 1.2 m) and its alpha ladder
  // (.27 .23 .19 .16 .12, then nothing) runs from the near rows to 40 m. On a flat floor depth is a function of screen y,
  // so the ladder is one vertical gradient and the whole field is ONE path and ONE fill (no banding pops while the rows
  // stream in). It fades out over y 860-940 (<= 952 on screen at the 1.03 drift) so the subtitle band stays clean.
  const br_LAD = [[5, 0.27], [12, 0.23], [19, 0.19], [26, 0.16], [33, 0.12], [40, 0]];
  function br_ladder(d) {
    if (d <= br_LAD[0][0]) return br_LAD[0][1];
    for (let i = 1; i < br_LAD.length; i++) if (d <= br_LAD[i][0]) return lerp(br_LAD[i - 1][1], br_LAD[i][1], (d - br_LAD[i - 1][0]) / (br_LAD[i][0] - br_LAD[i - 1][0]));
    return 0;
  }
  function br_floorFill(x) {
    if (br_SPR.fg && br_SPR.fgx === x) return br_SPR.fg;
    const g = x.createLinearGradient(0, 610, 0, 1080);
    g.addColorStop(0, rgba(RED, 0));
    for (const sy of [640, 650, 655, 662, 670, 680, 692, 707, 726, 750, 780, 820, 860, 880, 900, 920, 940]) {
      const a = br_ladder(1600 / (sy - 610)) * cl((940 - sy) / 80);
      g.addColorStop((sy - 610) / 470, rgba(RED, a.toFixed(4)));
    }
    g.addColorStop(1, rgba(RED, 0));
    br_SPR.fgx = x;
    return (br_SPR.fg = g);
  }
  function br_floor(x, cz) {
    const st = 1.2, s = 0.19, k0 = Math.ceil((cz + 3.2) / st), k1 = Math.floor((cz + 40) / st);
    x.beginPath();
    for (let k = k0; k <= k1; k++) {
      const d1 = k * st - cz, d2 = d1 + s, y1 = 610 + 1600 / d1, y2 = 610 + 1600 / d2;
      if (y2 > 942) continue;
      const f1 = 1000 / d1, f2 = 1000 / d2;
      for (let j = -20; j < 20; j++) {
        const X0 = j * st + 0.6 - s / 2, xa = 960 + X0 * f1, xb = 960 + (X0 + s) * f1;
        if (xb < -8 || xa > W + 8) continue;
        x.moveTo(xa, y1); x.lineTo(xb, y1); x.lineTo(960 + (X0 + s) * f2, y2); x.closePath();
      }
    }
    x.fillStyle = br_floorFill(x); x.fill();
  }
  function br_haze(x) { // faint white horizon haze, cached ellipse 1800 x 120 at alpha .06
    let c = br_SPR.hz;
    if (!c) {
      c = br_SPR.hz = U.mk(512, 64);
      c.x.save(); c.x.scale(1, 0.125);
      const g = c.x.createRadialGradient(256, 256, 0, 256, 256, 256);
      g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.45, "rgba(255,255,255,0.4)"); g.addColorStop(1, "rgba(255,255,255,0)");
      c.x.fillStyle = g; c.x.fillRect(0, 0, 512, 512); c.x.restore();
    }
    x.save(); x.globalAlpha *= 0.06; x.drawImage(c, 60, 550, 1800, 120); x.restore();
  }
  // candle bokeh band on the horizon (pages 3/7): two layers blurred ONCE at init (far 24 px / .30, near 10 px / .45),
  // 70 % white, 10 % grey, 20 % red, candles standing on a gently rising diagonal; drifting left 12 and 30 px/s. The
  // layers are cropped to their content (layer y 70-300) and blitted 1:1 at whole-pixel offsets outside the drift
  // transform: in this software raster a filtered full-width draw costs ~25 ms, a plain blit a fraction of it
  function br_bokehLayer(k, blur, seed, n, wb) { // (blurred at 1/4 size, then scaled up once: a fast init)
    if (br_SPR[k]) return br_SPR[k];
    const bw = 2400, bh = 230, q = 4, c = (br_SPR[k] = U.mk(bw, bh)), s = U.mk(bw / q, bh / q);
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
  function br_bokeh(x, lt, y) {
    for (const [k, blur, al, sp, seed, n, wb] of [["bkF", 24, 0.3, 12, 81, 54, 18], ["bkN", 10, 0.45, 30, 83, 30, 13]]) {
      const c = br_bokehLayer(k, blur, seed, n, wb);
      x.save(); x.globalAlpha *= al; x.drawImage(c, Math.round(-140 - lt * sp), y + 70); x.restore();
    }
  }

  // ------------------------------------------------------------------ helpers
  const br_press = (x, pz, cx = 942, cy = 540) => { if (pz < 1) { x.translate(cx, cy); x.scale(pz, pz); x.translate(-cx, -cy); } };
  // polyline -> n points evenly spaced by arc length (both ends kept)
  function br_rs(P, n) {
    const L = [0];
    for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const tot = L[L.length - 1], out = [];
    let j = 1;
    for (let i = 0; i < n; i++) {
      const s = n === 1 ? 0 : (tot * i) / (n - 1);
      while (j < P.length - 1 && L[j] < s) j++;
      const u = tot > 0 ? cl((s - L[j - 1]) / (L[j] - L[j - 1] || 1)) : 0;
      out.push([lerp(P[j - 1][0], P[j][0], u), lerp(P[j - 1][1], P[j][1], u)]);
    }
    return out;
  }
  const br_poly = (x, P) => { x.beginPath(); P.forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]))); x.closePath(); };
  // the mirrored page-6 flag (vertical edge on the right) in a unit-height box, clockwise from its top-right corner
  const br_FLAG = br_rs([[0.74, 0], [0.74, 1], [0.629, 1], [0, 0.36], [0, 0], [0.74, 0]], 49).slice(0, 48);
  // the red disc (centre cx, cy, diameter d) morphing (fk) into the mirrored flag of height h at FX, FY
  function br_dotFlag(x, cx, cy, d, fk, FX, FY, h) {
    if (d <= 0.5 && fk <= 0) return;
    if (fk >= 1) { flag(x, FX, FY, h, { mirror: true }); return; }
    x.save(); x.fillStyle = RED;
    if (fk <= 0) { x.beginPath(); x.arc(cx, cy, d / 2, 0, Math.PI * 2); }
    else {
      x.beginPath();
      for (let i = 0; i < 48; i++) {
        const th = -Math.PI / 4 + (i / 48) * Math.PI * 2, ax = cx + (d / 2) * Math.cos(th), ay = cy + (d / 2) * Math.sin(th);
        const px = lerp(ax, FX + br_FLAG[i][0] * h, fk), py = lerp(ay, FY + br_FLAG[i][1] * h, fk);
        i ? x.lineTo(px, py) : x.moveTo(px, py);
      }
      x.closePath();
    }
    x.fill(); x.restore();
  }
  // ← centred at cx, cy (len px), 3 px round strokes, drawn on by u (shaft first, then the head)
  function br_arrow(x, cx, cy, len, u, color) {
    if (u <= 0) return;
    const hl = len * 0.34, x0 = cx + len / 2, x1 = cx - len / 2, us = e2(cl(u / 0.65)), uh = e2(cl((u - 0.5) / 0.5));
    x.save(); x.strokeStyle = color; x.lineWidth = 3; x.lineCap = "round"; x.lineJoin = "round";
    x.beginPath(); x.moveTo(x0, cy); x.lineTo(lerp(x0, x1, us), cy); x.stroke();
    if (uh > 0) { x.beginPath(); x.moveTo(x1 + hl * uh, cy - hl * uh); x.lineTo(x1, cy); x.lineTo(x1 + hl * uh, cy + hl * uh); x.stroke(); }
    x.restore();
  }
  // pill -> card: a rounded rect (radius r) whose top-right corner blends (k) from round into the 45° chamfer c
  function br_mpath(x, X, Y, w, h, r, c, k) {
    r = Math.min(r, w / 2, h / 2);
    x.beginPath(); x.moveTo(X + r, Y);
    for (let i = 0; i <= 12; i++) {
      const q = i / 12, th = -Math.PI / 2 + (q * Math.PI) / 2;
      const ax = X + w - r + r * Math.cos(th), ay = Y + r + r * Math.sin(th), bx = X + w - c + c * q, by = Y + c * q;
      x.lineTo(lerp(ax, bx, k), lerp(ay, by, k));
    }
    x.lineTo(X + w, Y + h - r); x.arcTo(X + w, Y + h, X + w - r, Y + h, r);
    x.lineTo(X + r, Y + h); x.arcTo(X, Y + h, X, Y + h - r, r);
    x.lineTo(X, Y + r); x.arcTo(X, Y, X + r, Y, r);
    x.closePath();
  }
  // its fill blends (f) from the DARK pill (#303133, 1 px .07 border) to the flat PANEL (#131417 .96, 1.5 px hairline)
  function br_body(x, X, Y, w, h, r, c, k, f) {
    br_mpath(x, X, Y, w, h, r, c, k);
    x.fillStyle = PANEL; x.fill();
    if (f < 1) { x.save(); x.globalAlpha *= 1 - f; x.fillStyle = DARKPILL; x.fill(); x.restore(); }
    x.lineWidth = lerp(1, 1.5, f); x.strokeStyle = `rgba(255,255,255,${lerp(0.07, 0.1, f).toFixed(3)})`; x.stroke();
  }
  // skeleton bar (#2A2B2F, r 8) with a shimmer band moving right to left every 0.9 s
  function br_skel(x, X, Y, w, h, t, a) {
    x.save(); x.globalAlpha *= a;
    rr(x, X, Y, w, h, 8); x.fillStyle = TRACK; x.fill(); x.clip();
    const bx = X + w + 90 - ((t % 0.9) / 0.9) * (w + 180), g = x.createLinearGradient(bx - 90, 0, bx + 90, 0);
    g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, "rgba(255,255,255,0.07)"); g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g; x.fillRect(bx - 90, Y, 180, h);
    x.restore();
  }
  // the status field: DARK pill 150 x 56 with «نشط» and a 10 px red dot pulsing on a 1.0 s period
  function br_status(x, X, Y, t, a) {
    const w = 150, h = 56, cy = Y + h / 2;
    x.save(); x.globalAlpha *= a;
    rr(x, X, Y, w, h, h / 2); x.fillStyle = DARKPILL; x.fill(); x.lineWidth = 1; x.strokeStyle = "rgba(255,255,255,0.07)"; x.stroke();
    const tw = measure(x, br_S.active, 400, 34, AR), x0 = X + (w - (tw + 22)) / 2, dx = x0 + tw + 17, ph = (t % 1) / 1;
    x.fillStyle = RED; x.beginPath(); x.arc(dx, cy, 5, 0, Math.PI * 2); x.fill();
    x.save(); x.globalAlpha *= 0.65 * (1 - ph); x.strokeStyle = RED; x.lineWidth = 1.5;
    x.beginPath(); x.arc(dx, cy, 5 + 9 * e3(ph), 0, Math.PI * 2); x.stroke(); x.restore();
    T(x, br_S.active, x0 + tw, cy + 12, { w: 400, size: 34 });
    x.restore();
  }
  // a ticking price in fixed cells (digit .62 em, '.' .28 em) centred at cx, so it never jitters
  function br_tnum(x, s, cx, Y, size, w, a) {
    const cw = (ch) => (ch === "." ? 0.28 : 0.62) * size;
    let tot = 0; for (const ch of s) tot += cw(ch);
    let xx = cx - tot / 2;
    x.save(); x.globalAlpha *= a; font(x, w, size, LAT); x.direction = "ltr"; x.textAlign = "center"; x.textBaseline = "alphabetic"; x.fillStyle = WHITE;
    for (const ch of s) { const c = cw(ch); x.fillText(ch, xx + c / 2, Y); xx += c; }
    x.restore();
  }
  // page 7's edge marker (a 6 px RED bar on the right edge at the last close) growing (ut) into the RED TAG price tab
  // (110 x 40, Inter 500 24 white), riding the close
  function br_edgeTab(x, ex, y, ub, ut, price) {
    if (ub <= 0) return;
    const w = lerp(6, 110, ut), h = lerp(24, 40, ut) * ub, X = lerp(ex - 3, ex + 8, ut), Y = y - h / 2, k = ut;
    x.save(); x.fillStyle = RED; x.beginPath();
    x.moveTo(X + 0.355 * h * k, Y); x.lineTo(X + w, Y); x.lineTo(X + w, Y + h - 0.43 * h * k); x.lineTo(X + w - 0.35 * h * k, Y + h);
    x.lineTo(X, Y + h); x.lineTo(X, Y + 0.43 * h * k); x.closePath(); x.fill();
    x.restore();
    const ta = pr(ut, 0.55, 1);
    if (ta > 0) br_tnum(x, price, X + w / 2 + 1, y + 8.7, 24, 500, ta);
  }
  // BUY / SELL ticket: a 14 px white ring on the candle's close (plus one echo) and a dark TAG chip 150 x 56 below (BUY,
  // RED ▲ pointing up at it) or above (SELL, white ▼ pointing down at it) its candle, riding it as the chart scrolls
  function br_ticket(x, vo, t0, cx, q, yOf, buy, ea) {
    if (vo < t0 || ea <= 0.003) return;
    const u = pr(vo, t0, t0 + 0.28), yc = yOf(q.c), ue = pr(vo, t0, t0 + 0.5);
    x.save(); x.globalAlpha *= ea; x.strokeStyle = WHITE; x.lineWidth = 2;
    x.save(); x.globalAlpha *= cl(u * 4); x.beginPath(); x.arc(cx, yc, 14 * back(u, 1.4), 0, Math.PI * 2); x.stroke(); x.restore();
    if (ue < 1) { x.save(); x.globalAlpha *= 0.5 * (1 - ue); x.beginPath(); x.arc(cx, yc, 14 + 24 * e3(ue), 0, Math.PI * 2); x.stroke(); x.restore(); }
    const uc = expo(pr(vo, t0 + 0.04, t0 + 0.44)), CW = 150, CH = 56, X = cx - 28 - CW / 2;
    const Y = (buy ? yOf(q.l) + 22 : yOf(q.h) - 22 - CH) + 12 * (1 - uc);
    x.globalAlpha *= cl(uc * 1.4);
    tag(x, X, Y, CW, CH, {});
    const s = buy ? br_S.buy : br_S.sell, tw = measure(x, s, 400, 34, AR), x0 = X + (CW - (tw + 30)) / 2 + 4, gx = x0 + tw + 22, gy = Y + CH / 2;
    x.fillStyle = buy ? RED : WHITE; x.strokeStyle = x.fillStyle; x.lineJoin = "round"; x.lineWidth = 2; x.beginPath();
    if (buy) { x.moveTo(gx, gy - 6); x.lineTo(gx + 8, gy + 5); x.lineTo(gx - 8, gy + 5); } else { x.moveTo(gx, gy + 6); x.lineTo(gx + 8, gy - 5); x.lineTo(gx - 8, gy - 5); }
    x.closePath(); x.fill(); x.stroke();
    T(x, s, x0 + tw, gy + 12, { w: 400, size: 34 });
    x.restore();
  }
  // two-tone headline (page 5) as the kit's headline(), except that each word's reveal mask reaches 0.45 em past its left
  // end and 0.62 em + the 18 px rise below the baseline, and is dropped once the word has landed: Alexandria's final yeh /
  // hah swash and dots overhang the advance box and the yeh's dots reach ~0.55 em down, so nothing is cut while rising
  function br_headline(x, words, X, Y, size, t, t0, o = {}) {
    if (t < t0) return 0;
    const wgt = o.w ?? 300, a = o.a ?? 1;
    let xx = X;
    if (o.flag) flag(x, X + size * 0.5, Y - size * 0.81, o.flagH ?? Math.max(18, Math.round(size * 0.35)), { mirror: true, u: pr(t, t0, t0 + 0.22), a });
    words.forEach(([s, c], i) => {
      const mw = measure(x, s, wgt, size, AR), k = e4(pr(t, t0 + 0.05 + i * 0.07, t0 + 0.47 + i * 0.07));
      if (k > 0) {
        x.save();
        if (k < 1) { x.beginPath(); x.rect(xx - mw - 0.45 * size, Y - size * 1.2, mw + 0.45 * size + 8, size * 1.82 + 18); x.clip(); }
        T(x, s, xx, Y + (1 - k) * 18, { w: wgt, size, color: c === "g" ? GREY : WHITE, a: a * k });
        x.restore();
      }
      xx -= mw + size * 0.28;
    });
    return X - xx;
  }
  // a mixed RTL line from the right edge X: Arabic runs RTL in Alexandria (so '*' and '،' sit on their side), Latin
  // runs LTR in Inter at 32 px, laid out right to left in reading order
  function br_runs(x, parts, X, Y, o) {
    let xx = X;
    for (const p of parts) {
      const fam = p.lat ? LAT : AR, size = p.lat ? 32 : 34, wgt = 300, mw = measure(x, p.s, wgt, size, fam);
      if (p.lat) T(x, p.s, xx - mw, Y, { w: wgt, size, fam, color: o.color, a: o.a, align: "left" });
      else T(x, p.s, xx, Y, { w: wgt, size, fam, color: o.color, a: o.a });
      xx -= mw + 10;
    }
    return X - xx;
  }

  // ================================================================== B-ROLL 1
  async function br_roll1(x, vo) {
    const K = br_K1, D = br_D1;
    const uP = expo(pr(vo, K.pill, K.pill + 0.35)), uM = expo(pr(vo, K.morph, K.morph + 0.5)), uZ = expo(pr(vo, K.zoom, K.zoom + 0.6));
    const out = br_ss(pr(vo, K.zoom, K.zoom + 0.42)), cA = 1 - out, cdx = 60 * out; // the card leaves: 60 px right + fade
    const occA = 1 - br_ss(pr(vo, K.zoom + 0.2, K.zoom + 0.62)); // the fields' occluder: its own later, soft tail
    const pt = vo - K.click, pz = pt >= 0 && pt < 0.08 ? 0.96 : 1; // click: .96 for 2 frames

    // ---- 1. the DARK pill extends leftward out of the disc on «بفتح», then morphs into the card on «حساب»
    if (cA > 0.003 && vo >= K.pill) {
      let X = lerp(1144, 640, uP), Y = lerp(492, 488, uP), w = lerp(96, 604, uP), h = lerp(96, 104, uP), r = h / 2;
      if (uM > 0) { X = lerp(X, 360, uM); Y = lerp(Y, 190, uM); w = lerp(w, 1200, uM); h = lerp(h, 640, uM); r = lerp(r, 12, uM); }
      x.save(); x.globalAlpha *= cA; x.translate(cdx, 0); br_press(x, pz);
      br_body(x, X, Y, w, h, r, 48 * uM, uM, uM);
      const lu = pr(vo, K.click, K.click + 0.28), la = 1 - lu, ul = e4(pr(vo, K.label, K.label + 0.42)); // leaves on the click
      if (la > 0 && ul > 0) { // «افتح حساب تداول» (358 px) reveals right to left; the mask is dropped once revealed
        x.save(); if (ul < 1) { x.beginPath(); x.rect(1124 - 392 * ul, 480, 392 * ul + 10, 124); x.clip(); }
        T(x, br_S.open, 1124, 556 + 10 * (1 - ul) - 10 * lu, { w: 400, size: 46, a: la * cl(ul * 1.5) });
        x.restore();
      }
      x.restore();
    }

    // ---- 2. the chart: the card's well (x 420-920, y 410-780) zooms into the full-screen frame (x 260-1660, y 250-880)
    let over = null; // brackets, edge marker / price tab and ▲▲▲: drawn over the card occluder below
    if (vo >= K.well) {
      const F = { x: lerp(420, 260, uZ), y: lerp(410, 250, uZ), w: lerp(500, 1400, uZ), h: lerp(370, 630, uZ) };
      const sn = 10 * e3(pr(vo, K.snap, K.snap + 0.1)), L = lerp(18, 28, uZ);
      const u1 = pr(vo, K.well, K.well + 0.45), u2 = pr(vo, K.well + 0.3, K.well + 0.6);
      let Hh = 27, last = 27;
      K.live.forEach((tk, j) => { if (vo >= tk) { Hh += br_ss(pr(vo, tk, tk + 0.28)); last = 28 + j; } }); // glides <= 10.3 px a frame
      const pitch = lerp(30, 48, uZ), bw = lerp(18, 26, uZ), xr = F.x + F.w - lerp(15, 48, uZ);
      const lo = lerp(0.31, 0.14, uZ), hi = lerp(0.70, 0.92, uZ), pad = lerp(18, 30, uZ), ih = F.h - 2 * pad;
      const yOf = (p) => F.y + pad + (1 - (p - lo) / (hi - lo)) * ih, xOf = (i) => xr - (Hh - i) * pitch;
      const cdl = (i) => K.cdl + (i - 12) * 0.035;
      const grow = (i) => (i >= 28 ? pr(vo, K.live[i - 28], K.live[i - 28] + 0.3) : i >= 12 ? pr(vo, cdl(i), cdl(i) + 0.3) : 1);
      // old candles enter / leave through a soft left edge 1.5 pitches wide, so a leaving candle loses <= 14.3 % a frame
      const edgeA = (cx) => cl((cx - bw / 2 - F.x - 4) / (1.5 * pitch));
      // from the zoom on, the card's fields column (x 990-1560 + its drift, y 384-844) keeps the chart out until the card
      // has gone: candles, price line and tab are MASKED there (soft 110 px left edge, 40 px right edge, released by occA)
      // rather than painted over, so no panel is left standing once the card has dissolved
      const occ = (X, Y) => {
        if (vo < K.zoom || occA <= 0.003 || Y < 384 || Y > 844) return 1;
        return 1 - occA * Math.min(cl((X - 990 - cdx) / 110), cl((1600 + cdx - X) / 40));
      };
      const qn = D[last], gn = grow(last), p0 = qn.o + (qn.c - qn.o) * e4(pr(gn, 0, 0.73));
      const brd = gn >= 1 && vo > cdl(27) + 0.3 ? br_breath(vo, 7) : 0, yLast = yOf(p0) + brd;
      x.save(); x.beginPath(); x.rect(F.x + 1, F.y - 80, F.w + 200, F.h + 160); x.clip();
      for (let i = 0; i <= last; i++) {
        const g = grow(i); if (g <= 0) continue;
        const cx = xOf(i), ea = edgeA(cx) * occ(cx, yOf(D[i].c)); if (ea <= 0.003) continue;
        const q = D[i]; let yc = yOf(q.c), yh = yOf(q.h), yl = yOf(q.l);
        if (i === last && brd) { yc += brd; yh = Math.min(yh, yc - 3); yl = Math.max(yl, yc + 3); }
        const pk = i < last && i >= 27 ? eio(pr(vo, K.live[i - 27], K.live[i - 27] + 0.4)) : 1; // the old newest greys over 0.4 s
        candle(x, cx, yOf(q.o), yc, yh, yl, bw, { grow: g, newest: i === last, a: ea, upColor: pk < 1 ? br_upc(pk) : undefined });
      }
      x.restore();
      // the dotted price line at the last close, over the candles (page 7)
      if (u2 > 0) {
        let ss = "rgba(255,255,255,0.30)";
        if (occ(1300 + cdx, yLast) < 1) { // masked across the fields column
          const m = (0.3 * (1 - occA)).toFixed(3); ss = x.createLinearGradient(990 + cdx, 0, 1600 + cdx, 0);
          ss.addColorStop(0, "rgba(255,255,255,0.30)"); ss.addColorStop(110 / 610, `rgba(255,255,255,${m})`);
          ss.addColorStop(570 / 610, `rgba(255,255,255,${m})`); ss.addColorStop(1, "rgba(255,255,255,0.30)");
        }
        x.save(); x.strokeStyle = ss; x.lineWidth = 1.5; x.setLineDash([3, 6]);
        x.beginPath(); x.moveTo(F.x + L + 6, yLast); x.lineTo(lerp(F.x + L + 6, F.x + F.w - 6, e3(u2)), yLast); x.stroke(); x.restore();
      }
      // BUY on «عليه», SELL in the gap before «الاعتيادي»
      if (last >= 28) br_ticket(x, vo, K.buy, xOf(28), D[28], yOf, true, edgeA(xOf(28)));
      if (last >= 30) br_ticket(x, vo, K.sell, xOf(30), D[30], yOf, false, edgeA(xOf(30)));
      // page 7's edge marker on the right edge at the last close, growing into the price tab on the zoom; ▲▲▲ beside it
      const ub = e3(pr(vo, K.well + 0.45, K.well + 0.7)), ut = expo(pr(vo, K.tab, K.tab + 0.4));
      const pLive = p0 - (brd * (hi - lo)) / ih, ex = F.x + F.w; // the tab rides the frame edge (the snap is the corners')
      const tcx = lerp(ex - 3, ex + 8, ut) + lerp(6, 110, ut) / 2; // masked by the fields column (logo clear space)
      x.save(); x.globalAlpha *= occ(tcx, yLast);
      br_edgeTab(x, ex, yLast, ub, ut, (21.314 + (pLive - 0.62) * 0.75).toFixed(3));
      x.restore();
      // the four brackets expand together on the zoom (the card header has gone by then, so the top-right one never
      // crosses «حساب تداول»)
      over = () => {
        corners(x, F.x - sn, F.y - sn, F.w + 2 * sn, F.h + 2 * sn, { L, u: u1, u2 });
        chev3(x, ex + 8 + 110 + 10, yLast - 22, vo, K.chev);
      };
    }

    // ---- 3. card content (header, divider, fields); it leaves with the card on the zoom (the chart is masked out of the
    // fields column until the card has gone, occA, so the expanding candles never cross the fading logo and fields)
    if (over) over();
    if (cA > 0.003 && vo >= K.head - 0.05) {
      x.save(); x.globalAlpha *= cA; x.translate(cdx, 0);
      // the header block leaves first (smoothstep VO 12.34-12.76, gone by f394), so the expanding top-right bracket never
      // crosses an opaque «حساب تداول»
      const hk = 1 - br_ss(pr(vo, K.zoom - 0.3, K.zoom + 0.12));
      if (hk > 0.003) {
        br_headline(x, br_S.acct, 1496, 292, 60, vo, K.head, { w: 500, a: hk });
        const us = expo(pr(vo, K.sub, K.sub + 0.45));
        if (us > 0) T(x, "Trading Account", 1496, 340 + 14 * (1 - us), { w: 300, size: 30, color: GREY, align: "right", a: cl(us * 1.4) * hk });
        const ud = e3(pr(vo, K.div, K.div + 0.4));
        if (ud > 0) { x.fillStyle = `rgba(255,255,255,${(0.1 * hk).toFixed(3)})`; x.fillRect(1520 - 1120 * ud, 369.5, 1120 * ud, 1); }
      }
      // fields: label + skeleton (shimmer); each skeleton dissolves (0.28 s, <= 14 %/frame) as its value arrives
      [[br_S.f1, 432, 466, 360, K.logo - 0.04], [br_S.f2, 590, 606, 220, K.sk2], [br_S.f3, 720, 736, 150, K.sk3]].forEach(([s, base, top, sw, dis], i) => {
        const t0 = K.fld + i * 0.06, u = expo(pr(vo, t0, t0 + 0.45)); if (u <= 0) return;
        T(x, s, 1496, base + 16 * (1 - u), { w: 300, size: 34, color: GREY, a: cl(u * 1.4) });
        const ka = cl(u * 1.4) * (1 - pr(vo, dis, dis + 0.28));
        if (ka > 0.003) br_skel(x, 1496 - sw, top + 16 * (1 - u), sw, 44, vo + i * 0.13, ka);
      });
      // the official logo builds in the name field (axi rises on «Axi», the tag wipes on «Select»; no sheen: white on white);
      // 360 x 79 at x 1136-1496, y 463-542: 20 px of clear space to the label above and to «الشركة» below
      // (clipped at x 1512: the kit sweeps the red '/' edge past the tag, across the card's edge)
      x.save(); x.beginPath(); x.rect(1100, 440, 412, 130); x.clip();
      await logoBuild(x, vo, K.logo, 1316, 502.5, 360, { d: 0.8, sheen: false });
      x.restore();
      const um = expo(pr(vo, K.mark, K.mark + 0.42)); // the axi wordmark (100 x 52) lands on «Axi»
      if (um > 0) await axiMark(x, 1396, 613 + 12 * (1 - um), 52, cl(um * 1.5)); // y 613-665: 13+ px clear of «الشركة»
      const ut = expo(pr(vo, K.stat, K.stat + 0.42)); // «نشط»
      if (ut > 0) br_status(x, 1346, 736 + 12 * (1 - ut), vo, cl(ut * 1.5));
      x.restore();
    }

    // ---- 4. the red disc: pops on «ستقوم», becomes the header's flag in the morph and travels to the headline on the zoom
    if (vo >= K.circle) {
      const pop = expo(pr(vo, K.circle, K.circle + 0.22)), uc = uM; // the disc rides the card's corner as it grows
      const fk = e4(pr(vo, K.morph + 0.26, K.morph + 0.5)), ug = expo(pr(vo, K.zoom, K.zoom + 0.4));
      const FX = lerp(1526, 1690, ug), FY = lerp(243, 151, ug);
      const cx = lerp(1192, FX + 7.8, uc), cy = lerp(540, FY + 10.5, uc), d = lerp(96, 21, uc) * pop;
      x.save(); br_press(x, pz);
      br_dotFlag(x, cx, cy, d, fk, FX, FY, 21);
      const aa = 1 - pr(vo, K.morph - 0.02, K.morph + 0.26); // gone before the disc turns into the flag
      if (aa > 0) {
        x.save(); x.globalAlpha *= aa;
        br_arrow(x, cx - 8 * Math.sin(Math.PI * pr(pt, 0, 0.26)), cy, 30 * (d / 96), pr(vo, K.arrow, K.arrow + 0.24), WHITE);
        x.restore();
      }
      x.restore();
    }

    // ---- 5. two-tone headline above the frame (the travelling flag is its flag)
    if (vo >= K.head2) br_headline(x, br_S.h1, 1660, 200, 60, vo, K.head2, {});

    // ---- 6. cursor: glides in on a slight arc, clicks just ahead of «حساب», fades in the morph; the click ring
    if (vo >= K.cur && vo < K.morph + 0.3) {
      const u = expo(pr(vo, K.cur, K.cur + 0.38)), bw2 = 36 * Math.sin(Math.PI * u);
      const px = lerp(1560, 1200, u) + 0.668 * bw2, py = lerp(880, 556, u) - 0.742 * bw2;
      const a = pr(vo, K.cur, K.cur + 0.08) * (1 - pr(vo, K.morph, K.morph + 0.28));
      x.save(); br_press(x, pz < 1 ? 0.9 : 1, px, py); cursor(x, px, py, a); x.restore();
    }
    if (pt >= 0 && pt < 0.4) {
      const k = pt / 0.4;
      x.save(); x.globalAlpha *= 0.8 * (1 - k); x.strokeStyle = RED; x.lineWidth = 2;
      x.beginPath(); x.arc(1192, 540, lerp(48, 125, e3(k)), 0, Math.PI * 2); x.stroke(); x.restore();
    }
  }

  // ================================================================== B-ROLL 2
  // the profit zone in chart coords: the funding line (y 640) up to the closes of candles 17..last
  function br_zone(D, last, gl, xOf, yOf) {
    if (last < 18) return null;
    const P = [[xOf(17), 640]];
    for (let i = 18; i <= last; i++) { const q = D[i], c = i === last ? q.o + (q.c - q.o) * gl : q.c; P.push([xOf(i), Math.min(640, yOf(c))]); }
    P.push([xOf(last), 640]);
    return P;
  }
  // outline sides (left, top, right, bottom; clockwise) resampled to 6 / 30 / 8 / 30 points, for the zone -> bar morph
  const br_NS = [6, 30, 8, 30];
  function br_outline(sides) { const out = []; sides.forEach((s, i) => out.push(...br_rs(s, br_NS[i]))); return out; }
  function br_zoneSides(P) {
    const n = P.length, top = P.slice(1, n - 1);
    return [[P[0], top[0]], top.length > 1 ? top : [top[0], top[0]], [top[top.length - 1], P[n - 1]], [P[n - 1], P[0]]];
  }
  const br_tagSides = (X, Y, w, h) => [[[X, Y + h], [X, Y + 0.43 * h], [X + 0.355 * h, Y]], [[X + 0.355 * h, Y], [X + w, Y]],
    [[X + w, Y], [X + w, Y + 0.57 * h], [X + w - 0.35 * h, Y + h]], [[X + w - 0.35 * h, Y + h], [X, Y + h]]];
  function br_zoneDraw(x, P, k, outline) { // white vertical gradient (.16 -> 0) fading (k) into the TRACK fill; RED outline
    let y0 = 1e9, y1 = -1e9; for (const p of P) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    x.save(); br_poly(x, P);
    if (k < 1) { const g = x.createLinearGradient(0, y0, 0, Math.max(y0 + 1, y1)); g.addColorStop(0, `rgba(255,255,255,${(0.16 * (1 - k)).toFixed(3)})`); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fill(); }
    if (k > 0) { x.save(); x.globalAlpha *= k; x.fillStyle = TRACK; x.fill(); x.restore(); }
    if (outline > 0.003) { x.globalAlpha *= outline; x.lineWidth = 2; x.lineJoin = "round"; x.strokeStyle = RED; x.stroke(); }
    x.restore();
  }
  async function br_roll2(x, vo) {
    const K = br_K2, D = br_D2;
    const gE = expo(pr(vo, K.lift, K.lift + 0.45)), s = lerp(1, 0.62, gE), ox = lerp(260, 120, gE), oy = lerp(250, 330, gE);
    const mx = (X) => ox + (X - 260) * s, my = (Y) => oy + (Y - 250) * s; // chart group: frame -> x 120-988, y 330-690
    const xOf = (i) => 1096 - (17 - i) * 48, yOf = (p) => 806 - p * 532;
    let last = 17; K.prints.forEach((tk, j) => { if (vo >= tk) last = 18 + j; });
    const grow = (i) => (i >= 18 ? pr(vo, K.prints[i - 18], K.prints[i - 18] + 0.3) : 1);
    const gn = grow(last), gbn = e4(pr(gn, 0, 0.73)), brd = gn >= 1 ? br_breath(vo, 11) : 0;
    const lifted = vo >= K.lift, uf = eio(pr(vo, K.fly, K.fly + 0.4)), landed = vo >= K.fly + 0.4;
    const hA = 1 - br_ss(pr(vo, K.lift, K.lift + 0.42)), lA = 1 - br_ss(pr(vo, K.lift - 0.3, K.lift + 0.12)); // labels ~gone as the group moves
    const tF = Math.max(K.fill, K.fly + 0.4); // the red fill and the counter start together, on the bar's landing

    // ---- 1. headline with the scene's one flag
    if (hA > 0.003) br_headline(x, br_S.h2, 1660, 190, 56, vo, K.head, { a: hA, flag: true });

    // ---- 2. the chart group: frame, funding line, profit zone, candles (time runs left to right)
    corners(x, mx(260), my(250), 1400 * s, 580 * s, { L: 28 * s });
    x.save(); x.strokeStyle = "rgba(255,255,255,0.6)"; x.lineWidth = 2; x.setLineDash([4, 8]);
    x.beginPath(); x.moveTo(mx(260) + 6, my(640)); x.lineTo(mx(1660) - 6, my(640)); x.stroke(); x.restore();
    const zone = br_zone(D, last, lifted ? 1 : gbn, xOf, yOf), zl = 30 * expo(pr(vo, K.lift, K.lift + 0.35));
    const zMap = (P) => P.map(([X, Y]) => [mx(X), my(Y) - zl]);
    if (zone && !lifted) br_zoneDraw(x, zMap(zone), 0, 0);
    for (let i = 0; i <= last; i++) {
      const q = D[i], g = grow(i); if (g <= 0) continue;
      let yc = yOf(q.c), yh = yOf(q.h), yl = yOf(q.l);
      if (i === last && brd) { yc += brd; yh = Math.min(yh, yc - 3); yl = Math.max(yl, yc + 3); }
      const pk = i < last && i >= 17 ? eio(pr(vo, K.prints[i - 17], K.prints[i - 17] + 0.4)) : 1; // the old newest greys over 0.4 s
      candle(x, mx(xOf(i)), my(yOf(q.o)), my(yc), my(yh), my(yl), 26 * s, { grow: g, newest: i === last, upColor: pk < 1 ? br_upc(pk) : undefined });
    }
    // chart labels at full size (never scaled under 34 px); they leave as the group starts to shrink
    if (lA > 0.003) {
      const fx = mx(1630), fy = my(628);
      T(x, br_S.fund, fx, fy, { w: 300, size: 34, color: GREY, a: lA });
      await axiMark(x, fx - 334, fy - 30, 30, lA); // x 1296-1354
      if (vo >= K.plbl) {
        const up = expo(pr(vo, K.plbl, K.plbl + 0.4)), lx = mx(1606), ly = my(482) + 12 * (1 - up);
        T(x, br_S.profit, lx, ly, { w: 400, size: 38, a: lA * cl(up * 1.4) });
        chev3(x, lx - 97 - 16 - 18, ly - 33, vo, K.plbl + 0.06, { a: lA });
      }
    }

    // ---- 3. the right panel «حصّتك من الأرباح» (600 x 620, cut 48) reveals right to left
    if (vo >= K.panel) {
      const u = pr(vo, K.panel, K.panel + 0.5), e = expo(u), uc = pr(vo, K.panel + 0.12, K.panel + 0.62);
      x.save(); x.translate(0, 24 * (1 - e));
      card(x, 1200, 220, 600, 620, { u, a: cl(e * 1.4), c: 48 });
      x.save(); cardClip(x, 1200, 220, 600, 620, uc);
      br_headline(x, br_S.share, 1760, 300, 44, vo, K.panel + 0.12, { w: 500 }); // a card header: no flag
      if (landed) { // the split bar: TAG track, filled RED from its right edge to 80 %
        tagPath(x, 1250, 560, 500, 44); x.fillStyle = TRACK; x.fill();
        const kf = e4(pr(vo, tF, tF + 0.45));
        if (kf > 0) {
          x.save(); tagPath(x, 1250, 560, 500, 44); x.clip();
          x.fillStyle = RED; x.fillRect(1750 - 400 * kf, 556, 400 * kf + 4, 52);
          x.fillStyle = INK; x.fillRect(1750 - 400 * kf - 1, 556, 2, 52);
          x.restore();
        }
      }
      if (vo >= tF - 0.04) { // «حتى» + '80%' (metallic Inter 200 170, counting in fixed cells, relaxing on landing)
        const ua = expo(pr(vo, tF - 0.04, tF + 0.36)), kc = e4(pr(vo, tF, tF + 0.45));
        T(x, br_S.upto, 1750, 500 + 14 * (1 - ua), { w: 300, size: 48, color: GREY, a: cl(ua * 1.4) });
        metal(x, Math.round(80 * kc) + "%", 1646, 500, 170, { w: 200, fade: true, align: "right", a: cl(ua * 1.4), tab: true,
          relax: pr(vo, tF + 0.45, tF + 0.6), sheen: pr(vo, tF + 0.62, tF + 1.12) });
        chev3(x, 1310, 432, vo, tF + 0.22);
      }
      if (vo >= K.lbl) {
        const ul = expo(pr(vo, K.lbl, K.lbl + 0.4)), dy = 12 * (1 - ul), a = cl(ul * 1.4);
        T(x, br_S.you, 1750, 652 + dy, { w: 400, size: 34, a });
        T(x, "Axi", 1250, 652 + dy, { w: 400, size: 30, color: GREY, align: "left", a });
      }
      if (vo >= K.pill) { // RED pill «سحب الأرباح» 380 x 84, white disc d 64 with a RED ←; pressed into the cut
        const up = expo(pr(vo, K.pill, K.pill + 0.35)), pp = vo - K.press, pz = pp >= 0 && pp < 0.08 ? 0.96 : 1;
        x.save(); x.translate(0, 16 * (1 - up)); x.globalAlpha *= cl(up * 1.4);
        x.save(); if (up < 1) { x.beginPath(); x.rect(1750 - 392 * up, 680, 392 * up + 12, 124); x.clip(); } br_press(x, pz, 1560, 742);
        rr(x, 1370, 700, 380, 84, 42); x.fillStyle = RED; x.fill();
        const dU = back(pr(vo, K.pill + 0.08, K.pill + 0.36), 1.4);
        x.fillStyle = WHITE; x.beginPath(); x.arc(1708, 742, 32 * dU, 0, Math.PI * 2); x.fill();
        br_arrow(x, 1708, 742, 26 * dU, pr(vo, K.pill + 0.16, K.pill + 0.4), RED);
        T(x, br_S.cta, 1523 + measure(x, br_S.cta, 500, 38, AR) / 2, 742 + 13.7, { w: 500, size: 38 });
        x.restore();
        if (pp >= 0 && pp < 0.4) {
          const k = pp / 0.4;
          x.save(); x.globalAlpha *= 0.8 * (1 - k); x.strokeStyle = RED; x.lineWidth = 2;
          x.beginPath(); x.arc(1708, 742, 32 * lerp(1, 2.6, e3(k)), 0, Math.PI * 2); x.stroke(); x.restore();
        }
        x.restore();
      }
      x.restore();
      x.restore();
    }

    // ---- 4. the lifted zone: detaches with a RED outline on «وسحب», flies on «نسبة» and lands as the split-bar track
    if (zone && lifted && !landed) {
      const A = zMap(zone), oa = e3(pr(vo, K.lift + 0.1, K.lift + 0.3));
      if (uf <= 0) br_zoneDraw(x, A, 0, oa);
      else {
        const PA = br_outline(br_zoneSides(A)), PB = br_outline(br_tagSides(1250, 560, 500, 44)), bump = 120 * Math.sin(Math.PI * uf);
        br_zoneDraw(x, PA.map((p, i) => [lerp(p[0], PB[i][0], uf), lerp(p[1], PB[i][1], uf) - bump]), uf, oa * (1 - pr(vo, K.fly + 0.12, K.fly + 0.4)));
      }
    }

    // ---- 5. footnote under the panel (keeps 'up to 80%' accurate)
    if (vo >= K.foot) {
      const u = expo(pr(vo, K.foot, K.foot + 0.45));
      br_runs(x, br_S.foot, 1800, 905 + 12 * (1 - u), { color: GREY, a: cl(u * 1.4) });
    }
  }

  GROUPS.push({
    name: "broll",
    async broll(x, t, S, id) {
      if (id !== 1 && id !== 2) return;
      const vo = t - P, lt = Math.max(0, vo - (S.shot.f0 / 25 - P));
      br_haze(x); // the bitmap layers sit on the horizon, where the 1.00-1.03 drift moves nothing by more than 2 px:
      br_bokeh(x, lt, id === 1 ? 362 : 370); // they are drawn 1:1, outside the drift (B-roll 2's band sits a little lower)
      x.save();
      const s = 1 + 0.005 * lt; x.translate(960, 540); x.scale(s, s); x.translate(-960, -540); // slow drift
      br_floor(x, (id === 1 ? 0 : 37) + 1.2 * lt + (id === 1 ? 1.8 * e3(pr(vo, br_K1.zoom, br_K1.zoom + 0.7)) : 0));
      if (id === 1) await br_roll1(x, vo); else await br_roll2(x, vo);
      x.restore();
    },
  });
