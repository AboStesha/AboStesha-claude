
  // ================================================================== GROUP "stairs" (prefix sr_), video 2 (Incubation)
  // Beats (VO s, spec mg_ep2_final.json): D 17.09-21.85 (VC EW): the six-stage staircase is built and the RULE MARK is
  // stamped on every landing as a red comet climbs it · N 67.53-72.37 (VC EW): the set already stands, the flag climbs
  // S2 -> S3 and Acceleration lights · O 72.37-76.05 (L3): the six episode chips and the next-video deck.
  // Shots are picked by S.shot.k_beat ('D', 'N', 'O'), never by times. t = OUTPUT s, tv = t - P = VO s.
  // The staircase is video 1's (W1 32_stages.js): authored in EW screen px and drawn through VM x ewP (plate space), so it
  // rides the drift and stays welded to the floor pad; line widths stay in screen px. Floor light goes through floor().
  // Measured onsets (word_onsets, pause map work/vo_pauses_vo.json): «القاعدة» 17.52, pause 18.01-18.41, «يتم» 18.41,
  // «جميع» 19.62, pause 20.13-20.32, «مراحل» 20.30, pause 20.90-21.17, «Axi» 21.17, «Select» 21.53 · pause 67.47-67.64,
  // «مؤهّلاً» 68.07, «للانتقال» 68.57, «للمرحلة» 69.19, «الثالثة» 69.69, «Acceleration» 71.30-72.08, pause 72.08-72.45 ·
  // «سنتعرّف» 72.83, «بالتفصيل» 73.71, pause 74.39-74.58, «في» 74.57, «القادم» 75.55-76.08.
  const sr_bump = (tv, t0, d) => { const u = pr(tv, t0, t0 + d); return u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0; };
  function sr_xf(x, cx, cy, o) { x.translate(cx, cy + (o.dy || 0)); const s = o.sc ?? 1; x.scale(s, s); x.translate(-cx, -cy); }
  // polylines: length, point at arc length, partial stroke d0..d1 (one path, miter joins)
  function sr_plen(p) { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; }
  function sr_at(p, d) {
    for (let i = 1; i < p.length; i++) {
      const l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
      if (d <= l || i === p.length - 1) { const k = l ? cl(d / l) : 0; return [lerp(p[i - 1][0], p[i][0], k), lerp(p[i - 1][1], p[i][1], k)]; }
      d -= l;
    }
    return p[p.length - 1];
  }
  function sr_poly(x, p, d0, d1) {
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
  // one fading layer: draw() paints at full opacity into a frame-size scratch canvas (same base transform) that lands
  // once at alpha a, so nothing inside shows through anything else while it fades (used only during exits)
  function sr_fade(x, a, draw, nm = "sr_fade") {
    if (a <= 0.003) return;
    if (a >= 0.997) { draw(x); return; }
    const c = tmp(nm, x.canvas.width, x.canvas.height), ga = x.globalAlpha;
    c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalAlpha = 1; c.x.globalCompositeOperation = "source-over"; c.x.filter = "none";
    c.x.clearRect(0, 0, c.width, c.height);
    c.x.setTransform(x.getTransform());
    draw(c.x);
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = ga * a; x.drawImage(c, 0, 0); x.restore();
  }
  // a readout line's entry: rises 20 px, 0.45 s expo (video 1's st_readout)
  const sr_ln = (tv, t0) => { if (tv < t0) return null; const ui = expo(pr(tv, t0, t0 + 0.45)); return { a: cl(ui * 1.25), dy: (1 - ui) * 20 }; };
  // stage-card names as cached 2x sprites: under the drifting EW transform the text scale changes every frame, so live
  // text would re-rasterize its glyphs each frame; a cached sprite only scales (and stays crisp at 2x)
  const sr_SPR = {};
  function sr_name(x, s, X, Y, a) {
    if (a <= 0.003) return;
    let c = sr_SPR[s];
    if (!c) {
      const w = Math.ceil(measure(x, s, 400, 26, LAT)) + 10;
      c = sr_SPR[s] = U.mk(w * 2, 80); c.ww = w;
      c.x.scale(2, 2); T(c.x, s, 5, 30, { w: 400, size: 26, color: WHITE });
    }
    x.save(); x.globalAlpha *= a; x.drawImage(c, X - 5, Y - 30, c.ww, 40); x.restore();
  }
  // 'you are here' marker: 2 px white pole with a mirrored flag at its top (it flies toward the climb, RTL)
  function sr_marker(x, X, Yb, a, ph = 54, fh = 26, pw = 2) {
    if (a <= 0.003) return;
    x.save(); x.globalAlpha *= a;
    x.fillStyle = WHITE; x.fillRect(X - pw / 2, Yb - ph, pw, ph);
    flag(x, X - pw / 2 - 0.74 * fh, Yb - ph, fh, { mirror: true });
    x.restore();
  }
  // a TAG's DONE cut: the top-left cut fills RED with a white tick (tag()'s geometry, alpha multiplied), lw = line unit
  function sr_doneCut(x, X, Y, h, dn, lw = 1) {
    if (dn <= 0) return;
    const q = 0.355 * h, kk = e3(pr(dn, 0.2, 1));
    x.save(); x.globalAlpha *= e3(dn); x.setLineDash([]);
    x.fillStyle = RED; x.beginPath(); x.moveTo(X, Y); x.lineTo(X + q, Y); x.lineTo(X, Y + 0.43 * h); x.closePath(); x.fill();
    x.strokeStyle = WHITE; x.lineWidth = 2 * lw; x.lineCap = "round"; x.lineJoin = "round";
    x.beginPath(); x.moveTo(X + q * 0.16, Y + q * 0.42);
    if (kk > 0) x.lineTo(X + q * 0.16 + q * 0.14 * cl(kk * 2), Y + q * 0.42 + q * 0.14 * cl(kk * 2));
    if (kk > 0.5) x.lineTo(X + q * 0.3 + q * 0.26 * cl(kk * 2 - 1), Y + q * 0.56 - q * 0.36 * cl(kk * 2 - 1));
    x.stroke(); x.restore();
  }
  // a video-1 symbol all in white (its red element too) at alpha a: drawn into a small layer and recoloured source-in
  // (the kit's own helper for this is private, k2_)
  function sr_symMono(x, name, cx, cy, size, a, k) {
    if (a <= 0.003) return;
    const w = Math.ceil(size * 2.6), c = tmp("sr_mono" + w, w, w);
    c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalAlpha = 1; c.x.globalCompositeOperation = "source-over"; c.x.filter = "none";
    c.x.clearRect(0, 0, w, w);
    sym(c.x, name, w / 2, w / 2, size, { a: 1, k, color: WHITE });
    c.x.globalCompositeOperation = "source-in"; c.x.fillStyle = WHITE; c.x.fillRect(0, 0, w, w); c.x.globalCompositeOperation = "source-over";
    x.save(); x.globalAlpha *= a; x.drawImage(c, cx - w / 2, cy - w / 2, w, w); x.restore();
  }

  // ---------------------------------------------------------------- FLOOR (D, N): base pool .18, the pad, ripple, pulses
  // D's cut-in ripple is fRipple's ring (r 0.3 -> 6 m, e4, 0.9 s, 0.08 m wide, RED .9 -> 0, a white ring .4 0.1 s behind)
  // with its near side kept out of the subtitle band: where the ring would reach screen y 900-960 its floor shape is cut
  // in floor space (v rows under the current VM) and fades over 12 bands of 5 px (edges on whole pixel rows, so the bands
  // leave no seams); nothing of it lands below y 960. A frame that does not reach y 900 pushes fRipple's own annulus.
  const sr_RIP = { y0: 900, y1: 960, n: 12, w: 0.08 };
  const sr_vAtY = (y) => 1132.6 / ((y - VM[5]) / VM[3] - 626.4) - 3; // floor depth v (m) whose row lands on screen y
  function sr_clipV(P, c, above) { // Sutherland-Hodgman on floor (u, v) points: keep v >= c (above) or v <= c
    const out = [], n = P.length, ins = (p) => (above ? p[1] >= c : p[1] <= c);
    for (let i = 0; i < n; i++) {
      const p = P[i], q = P[(i + 1) % n], ip = ins(p);
      if (ip) out.push(p);
      if (ip !== ins(q)) { const k = (c - p[1]) / (q[1] - p[1]); out.push([p[0] + (q[0] - p[0]) * k, c]); }
    }
    return out;
  }
  function sr_ringPts(R, w, n = 64) { // the annulus as one keyhole outline (outer CCW, inner CW, bridged at the far side)
    const ro = R + w / 2, ri = Math.max(0.01, R - w / 2), P = [];
    for (let i = 0; i <= n; i++) { const a = Math.PI / 2 + (i / n) * 2 * Math.PI; P.push([Math.cos(a) * ro, Math.sin(a) * ro]); }
    for (let i = 0; i <= n; i++) { const a = Math.PI / 2 - (i / n) * 2 * Math.PI; P.push([Math.cos(a) * ri, Math.sin(a) * ri]); }
    return P;
  }
  function sr_ripple(sh, t, t0, R1, d) {
    const { y0, y1, n, w } = sr_RIP;
    for (const [dt, col, a0] of [[0, RED, 0.9], [0.1, "#ffffff", 0.4]]) {
      const k = pr(t, t0 + dt, t0 + dt + d); if (k <= 0 || k >= 1) continue;
      const R = lerp(0.3, R1, e4(k)), a = a0 * (1 - k), vTop = VM ? sr_vAtY(y0) : -99;
      if (R + w / 2 <= -vTop) { sh.push({ type: "annulus", R, w, color: col, a }); continue; }
      const ring = sr_ringPts(R, w), put = (Q, aa) => { if (Q.length > 2) sh.push({ type: "poly", pts: Q.map(([u, vv]) => floorP(u, vv)), color: col, a: aa }); };
      put(sr_clipV(ring, vTop, true), a);
      for (let i = 0; i < n; i++) {
        const vA = sr_vAtY(y0 + ((y1 - y0) * i) / n), vB = sr_vAtY(y0 + ((y1 - y0) * (i + 1)) / n); // vA > vB
        if (R + w / 2 <= -vA) break;
        put(sr_clipV(sr_clipV(ring, vB, true), vA, false), a * (1 - (i + 0.5) / n));
      }
    }
  }
  const sr_PAD = padPts();
  const sr_PADC = sr_PAD.concat([sr_PAD[0]]), sr_PADLEN = sr_plen(sr_PADC); // the traced rim runs the closed outline
  function sr_floor(t, sh, S) {
    const k = S.shot && S.shot.k_beat;
    if (k !== "D" && k !== "N") return;
    const tv = t - P, D = k === "D";
    const off = 1 - eio(D ? pr(tv, 21.44, 21.66) : pr(tv, 72.06, 72.26)); // the pad and the pool go out with the fold
    if (off <= 0.003) return;
    sh.push(fPool(0.18 * off)); // on at once on the cut
    if (D) sr_ripple(sh, t, v(17.09), 6, 0.9); // the floor ripple on the hard cut, kept out of the subtitle band
    const rimU = D ? e2(pr(tv, 17.11, 17.45)) : 1, inner = D ? e2(pr(tv, 17.21, 17.45)) : 1;
    if (inner > 0) sh.push({ type: "poly", pts: sr_PAD, color: "#ffffff", a: 0.14 * inner * off });
    if (rimU >= 1) sh.push({ type: "line", pts: sr_PAD, close: true, color: RED, a: 0.95 * off, lw: 0.04 * 525 }); // crisp RED decal
    else if (rimU > 0) sh.push({ type: "line", pts: sr_PADC, color: RED, a: 0.95, lw: 0.04 * 525, u: (rimU * sr_PADLEN) / 20000 }); // kit dash: px of 20000
    // STAGE PULSE from the pad (crisp ring r 0.3 -> 2.1 m, 0.8 s). It fires late in the shot, so its tail goes out with
    // the pad (o.a = off): nothing is left on the floor when the cut comes.
    fRipple(sh, t, v(D ? 21.17 : 71.30), { R: 2.1, d: 0.8, a: off });
  }

  // ---------------------------------------------------------------- THE STAIRCASE (D, N): EW screen px through VM x ewP
  // Landings 240 wide, cards 230 (video 1's code): S1 1540-1780 @742 ... S6 340-580 @242; risers at 1540 ... 580; the
  // ground line runs from the pad's right edge floorP(1,0) = (1060,742) to x 1780.
  const sr_LX = [1540, 1300, 1060, 820, 580, 340], sr_LY = [742, 642, 542, 442, 342, 242], sr_CW = 230, sr_GX = 1780;
  // main line: ground to the first riser, then the stair up to S6's open end
  const sr_MAIN = [[1060, 742], [1540, 742], [1540, 642], [1300, 642], [1300, 542], [1060, 542], [1060, 442], [820, 442], [820, 342], [580, 342], [580, 242], [340, 242]];
  const sr_EXT = [[1540, 742], [1780, 742]]; // S1's landing, right of the first riser
  const sr_ML = sr_plen(sr_MAIN); // 2180 (ground 0..480, stair 480..2180)
  const sr_LD0 = (k) => 480 + 100 * k + 240 * (k - 1); // arc length where landing k (1..5) starts (its right end)
  function sr_ewM() { // EW screen px -> current screen px (= VM x ewP as one affine map)
    const k = 1 / EW_S, ex = AX - AX * k, ey = AY - (AY + EW_DY) * k;
    return [VM[0] * k, 0, 0, VM[3] * k, VM[0] * ex + VM[4], VM[3] * ey + VM[5]];
  }
  function sr_symK(k, u, lt) {
    switch (STAGES[k].sym) {
      case "sprout": return { grow: u };
      case "dome": return { grow: pr(u, 0.45, 1) };
      case "chev": return { ignite: u, t: lt };
      case "summit": return { flagU: pr(u, 0.55, 1) };
      default: return {};
    }
  }
  // card state k (0..5) at VO tv: pop (unfold / fold), lit, done, pre (pre-highlight), symU (draw-on), lt (symbol clock),
  // direct (DIM straight to DONE: no red rim on the way)
  function sr_cs(k, tv, seg) {
    const s = { pop: 1, lit: 0, done: 0, pre: 0, symU: 1, lt: 0, direct: 0 };
    if (seg === "D") {
      s.pop = expo(pr(tv, 17.70 + 0.08 * k, 17.90 + 0.08 * k)); // pop in DIM, S1 -> S6, 17.70-18.30
      if (k === 0) { const u = pr(tv, 18.41, 18.71); s.lit = e2(u); s.done = u; s.direct = 1; } // video 1's stage, passed
      if (k === 1) { s.lit = e2(pr(tv, 18.41, 18.76)); s.symU = pr(tv, 18.45, 18.95); } // Incubation lights, the DOME draws
      const f0 = 21.42 + (5 - k) * 0.008; s.pop *= 1 - eio(pr(tv, f0, f0 + 0.16)); // fold, S6 first, gone by 21.62
    } else if (seg === "N") { // the standing set: S1 DONE, S2 LIT, S3-S6 DIM from the first frame
      if (k === 0) { s.lit = 1; s.done = 1; }
      if (k === 1) { s.lit = 1; s.done = pr(tv, 69.62, 69.92); } // S2 turns DONE as the marker leaves it
      if (k === 2) { s.pre = e2(pr(tv, 68.57, 68.82)); s.lit = e2(pr(tv, 71.30, 71.65)); s.symU = pr(tv, 71.30, 71.80); s.lt = tv - 71.30; }
      const f0 = 72.04 + (5 - k) * 0.008; s.pop = 1 - eio(pr(tv, f0, f0 + 0.18)); // fold, S6 first, gone by 72.26
    }
    return s;
  }
  // stage card k: TAG 230x88 at (x_left+5, y_k-96). DIM: outline white .25, symbol DIM, name .55, no amount. LIT: PANEL,
  // RED 1.5 px rim, symbol white + red, name white, amount. DONE: fill .7, rim white .25, red cut + tick.
  function sr_card(x, k, s, lw) {
    if (s.pop <= 0.002) return;
    const X = sr_LX[k] + 5, Y = sr_LY[k] - 96, w = sr_CW, h = 88, ST = STAGES[k], ly = sr_LY[k];
    x.save();
    if (s.pop < 1) { x.translate(0, ly); x.scale(1, Math.max(0.002, s.pop)); x.translate(0, -ly); x.globalAlpha *= cl(s.pop * 1.25); }
    tagPath(x, X, Y, w, h);
    const fillA = 0.96 * s.lit * (1 - 0.27 * s.done);
    if (fillA > 0.003) { x.fillStyle = panelFill(x, Y, h, +fillA.toFixed(3)); x.fill(); }
    x.lineWidth = 1.5 * lw;
    const whiteA = s.direct ? 0.25 : (1 - s.lit) * lerp(0.25, 0.6, s.pre) + s.lit * s.done * 0.25, redA = s.direct ? 0 : s.lit * (1 - s.done);
    if (whiteA > 0.003) { x.strokeStyle = `rgba(255,255,255,${whiteA.toFixed(3)})`; x.stroke(); }
    if (redA > 0.003) { x.strokeStyle = rgba(RED, redA.toFixed(3)); x.stroke(); }
    sr_doneCut(x, X, Y, h, s.done, lw);
    const cx = X + 38, cy = Y + 44; // symbol 40 px at (x+18, y+24)
    if (s.lit < 1) sym(x, ST.sym, cx, cy, 40, { dim: true, a: 1 - s.lit, k: sr_symK(k, 1, 0) });
    if (s.lit > 0) sym(x, ST.sym, cx, cy, 40, { u: s.symU, a: s.lit, k: sr_symK(k, s.symU, s.done > 0 ? 0.15 : s.lt) });
    sr_name(x, ST.en, X + 68, Y + 40, lerp(0.55, 1, s.lit));
    if (s.lit > 0.3) metal(x, fmtMoney(ST.amt), X + 68, Y + 70, 24, { w: 300, a: e2(pr(s.lit, 0.3, 1)) });
    x.restore();
  }
  const sr_MK = (k) => [sr_LX[k] + 213, sr_LY[k] - 96]; // marker foot on card k's top edge, 22 px from its right end
  // k -> k+1: along card k's top, up 24 px right of the riser (so the flag, flying 20 px left of its pole, passes clear of
  // card k+1's top-right corner), then along card k+1's top to its foot (same 340 px as the riser route)
  const sr_MKP = (k) => { const [x0, y0] = sr_MK(k), xr = sr_LX[k] + 24; return [[x0, y0], [xr, y0], [xr, y0 - 100], [sr_LX[k] - 27, y0 - 100]]; };
  // marker: drops 16 px onto card k0 at `drop` (0.32 s e2), its opacity easing in over the whole drop (e2), so it reads
  // as a drop, not a pop-in; slides [t, d] along the stair offset to the card tops (expo)
  function sr_mkAt(tv, M) {
    if (tv < M.drop) return null;
    let k = M.k0, pos = sr_MK(k);
    for (const [ts, d] of M.slides) {
      if (tv < ts) break;
      const u = expo(pr(tv, ts, ts + d)), P4 = sr_MKP(k);
      if (u >= 1) { k += 1; pos = sr_MK(k); continue; }
      pos = sr_at(P4, u * sr_plen(P4)); break;
    }
    const ud = pr(tv, M.drop, M.drop + 0.32);
    return { x: pos[0], y: pos[1] - 16 * (1 - e2(ud)), a: e2(ud) };
  }
  const sr_MKS = { D: { drop: 18.45, k0: 1, slides: [] }, N: { drop: 67.95, k0: 1, slides: [[69.62, 0.45]] } };

  // ---------------------------------------------------------------- D: the red comet and the RULE MARK (design_system 13)
  // The comet (kit K13) runs sr_MAIN from the pad to S6 in 0.90 s (eio) from «جميع» (19.62). When its head reaches landing
  // k's right end (S1: the first riser, x 1540), that landing takes the rule mark, read the way you walk it (you step on
  // at its right end): the OPEN WINDOW (a 5 px white segment xR-64..xR, drawn right to left in 0.10 s), then the FIRST
  // TRADE (a RED 3x22 tick at xR-64 dropping 10 px, 0.15 s e4) and, with it, LOCKED (the rest of the landing dims from
  // white .7 to .25 in 0.2 s). The head passes the six ends at VO 19.96, 19.99, 20.05, 20.10, 20.16 and 20.25.
  const sr_CT = [19.62, 0.90];
  const sr_cU = (tv) => eio(pr(tv, sr_CT[0], sr_CT[0] + sr_CT[1]));
  const sr_PASS = comet.passTimes(sr_MAIN, sr_CT[0], sr_CT[1], eio, [[1540, 742], [1540, 642], [1300, 542], [1060, 442], [820, 342], [580, 242]]);
  const sr_POP = 21.17; // «Axi»: the six marks pop once together (segments 5 -> 9 -> 5 px, ticks 1 -> 1.3 -> 1), 0.25 s
  function sr_rm(k, tv) { // rule-mark state of landing k
    const tp = sr_PASS[k];
    return { u1: e2(pr(tv, tp, tp + 0.10)), u2: e4(pr(tv, tp + 0.10, tp + 0.25)), lock: e2(pr(tv, tp + 0.10, tp + 0.30)), pop: sr_bump(tv, sr_POP, 0.25) };
  }
  function sr_ruleMark(x, k, m, lw) {
    const xR = sr_LX[k] + 240, y = sr_LY[k], xT = xR - 64, xE = xR + 1.5 * lw; // xE: over the riser's corner
    if (m.u1 > 0) { // open window: right to left
      const hh = (5 + 4 * m.pop) * lw, x0 = lerp(xE, xT, m.u1);
      x.fillStyle = WHITE; x.fillRect(x0, y - hh / 2, xE - x0, hh);
    }
    if (m.u2 > 0) { // first trade: RED 3x22 tick at xR-64 (y - 6 .. y + 16), dropping 10 px into place; pops about its top
      const s = 1 + 0.3 * m.pop, tw = 3 * lw * s, th = 22 * s, top = y - 6 - 10 * (1 - m.u2);
      x.save(); x.globalAlpha *= cl(m.u2 * 2.5); x.fillStyle = RED; x.fillRect(xT - 1.5 * lw - tw / 2, top, tw, th); x.restore();
    }
  }
  function sr_stair(x, tv, seg) {
    if (!VM) return;
    const D = seg === "D";
    if (D && (tv < 17.52 || tv > 21.70)) return;
    if (!D && tv > 72.30) return;
    const build = D && tv < 18.21, retract = eio(D ? pr(tv, 21.44, 21.64) : pr(tv, 72.06, 72.26));
    const ground = build ? 1060 + 720 * expo(pr(tv, 17.52, 17.82)) : sr_GX, stair = build ? 1700 * e4(pr(tv, 17.60, 18.20)) : 1700;
    // the line retracts toward the pad: the stair and S1's landing first (to the riser), then the ground line
    const Lv = build ? 480 + stair : sr_ML * (1 - retract), ext = build ? cl(ground - 1540, 0, 240) : 240 * cl((Lv - 480) / 1700);
    const gMain = build ? Math.min(ground - 1060, 480) : Math.min(Lv, 480);
    const lw = EW_S / VM[0]; // keeps line widths in screen px under the drift
    x.save();
    U.setM(x, sr_ewM());
    // soft white fill (alpha .05 -> 0 over 50 px) under each drawn landing
    for (let k = 0; k < 6; k++) {
      const f = k === 0 ? cl(ext / 240) : cl((Lv - sr_LD0(k)) / 240);
      if (f <= 0) continue;
      const x1 = sr_LX[k] + 240, x0 = k === 0 ? 1540 : x1 - 240 * f, xe = k === 0 ? 1540 + 240 * f : x1, y = sr_LY[k];
      const g = x.createLinearGradient(0, y, 0, y + 50); g.addColorStop(0, "rgba(255,255,255,0.05)"); g.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g; x.fillRect(x0, y + 1.5 * lw, xe - x0, 50);
    }
    // the line: 3 px white .7; in D a stamped landing's locked part dims to .25 (an exact clip split, so joins stay mitred)
    x.lineWidth = 3 * lw; x.lineJoin = "miter"; x.lineCap = "butt";
    const strokeAll = () => {
      if (build) sr_poly(x, sr_MAIN, 0, gMain); else sr_poly(x, sr_MAIN, 0, Lv);
      if (build && stair > 0) sr_poly(x, sr_MAIN, 480, 480 + stair);
      if (ext > 1.5 * lw) sr_poly(x, sr_EXT, 1.5 * lw, ext); // starts past MAIN's mitred corner (no double paint)
    };
    const dims = [], marks = [];
    if (D && tv >= sr_PASS[0]) for (let k = 0; k < 6; k++) {
      const m = sr_rm(k, tv); if (m.u1 <= 0) continue;
      marks.push([k, m]);
      if (m.lock > 0) dims.push({ x0: k === 0 ? 1540 : sr_LX[k] - 2 * lw, x1: sr_LX[k] + 240 - 64, y: sr_LY[k], a: lerp(0.7, 0.25, m.lock) });
    }
    x.strokeStyle = "rgba(255,255,255,0.7)";
    if (!dims.length) strokeAll();
    else {
      const rect = (d) => x.rect(d.x0, d.y - 3 * lw, d.x1 - d.x0, 6 * lw);
      x.save(); x.beginPath(); x.rect(-4000, -4000, 12000, 12000); dims.forEach(rect); x.clip("evenodd"); strokeAll(); x.restore();
      for (const d of dims) { x.save(); x.beginPath(); rect(d); x.clip(); x.strokeStyle = `rgba(255,255,255,${d.a.toFixed(3)})`; strokeAll(); x.restore(); }
    }
    // rule marks, clipped to what is left of their landing while the line retracts
    for (const [k, m] of marks) {
      const xR = sr_LX[k] + 240, y = sr_LY[k];
      x.save(); x.beginPath();
      if (k === 0) x.rect(1530, y - 60, ext + 10 + (ext >= 240 ? 4 * lw : 0), 120);
      else { const vis = cl(Lv - sr_LD0(k), 0, 240); if (vis <= 0) { x.restore(); continue; } x.rect(xR - vis, y - 60, vis + 4 * lw, 120); }
      x.clip(); sr_ruleMark(x, k, m, lw); x.restore();
    }
    for (let k = 0; k < 6; k++) sr_card(x, k, sr_cs(k, tv, seg), lw);
    // the red comet (kit K13, continuous du tail so its 145 px/frame head does not strobe); gone by 20.64
    if (D && tv >= sr_CT[0] && tv < 20.66) {
      const end = sr_CT[0] + sr_CT[1], u = sr_cU(tv);
      comet(x, sr_MAIN, u, { du: u - sr_cU(tv - 0.04), fade: pr(tv, end - 0.12, end + 0.02), a: 1 - e2(pr(tv, end - 0.02, end + 0.12)) });
    }
    x.restore();
  }

  // ---------------------------------------------------------------- D READOUT (screen px, x 1346-1840, y 98-228) + marker
  // line 1: WITHDRAW 44 px (1818,120) + «القاعدة» A300 36 GREY right edge 1780, baseline 130 · line 2: «في جميع المراحل»
  // A300 52 white right edge 1780, baseline 200 · the rule-mark glyph: white bar 24x5 at x 1349-1373, y 183-188, RED tick
  // 3x14 at x 1346-1349, y 179-193 (after its 6 px drop).
  function sr_readD(c, tv) {
    if (tv >= 17.52) {
      sym(c, "withdraw", 1818, 120, 44, { u: pr(tv, 17.52, 17.92) });
      const A = sr_ln(tv, 17.52); T(c, "القاعدة", 1780, 130 + A.dy, { w: 300, size: 36, color: GREY, a: A.a });
    }
    const B = sr_ln(tv, 20.30);
    if (B) T(c, "في جميع المراحل", 1780, 200 + B.dy, { w: 300, size: 52, color: WHITE, a: B.a });
    const ub = e2(pr(tv, 20.55, 20.65)), ut = e4(pr(tv, 20.65, 20.80));
    if (ub > 0) { c.fillStyle = WHITE; c.fillRect(1373 - 24 * ub, 183, 24 * ub, 5); }
    if (ut > 0) { c.save(); c.globalAlpha *= cl(ut * 2.5); c.fillStyle = RED; c.fillRect(1346, 179 - 6 * (1 - ut), 3, 14); c.restore(); }
  }
  // ---------------------------------------------------------------- N READOUT (screen px, right-aligned at x 1840)
  // pips 72x48 pitch 84 at y 96-144, all DONE (carried from M), one pulse on «مؤهّلاً» · «المرحلة الثالثة» A300 36 GREY
  // baseline 200 (69.19) · 'Acceleration' I300 52 white baseline 266 (71.30) + a 3 px RED underline (71.60-71.85) ·
  // «تمويل حتى» A300 34 GREY baseline 320 (71.36) · '$100,000' metallic I200 96 baseline 420 (71.42, static: he does not
  // say the cap).
  function sr_readN(c, tv) {
    const pu = pr(tv, 68.07, 68.32), st = [0, 1, 2, 3].map(() => ({ s: "done", pulse: pu }));
    pips(c, 1840, 96, 72, 48, 84, st);
    const A = sr_ln(tv, 69.19);
    if (A) T(c, "المرحلة الثالثة", 1840, 200 + A.dy, { w: 300, size: 36, color: GREY, a: A.a });
    const B = sr_ln(tv, 71.30);
    if (B) {
      T(c, "Acceleration", 1840, 266 + B.dy, { w: 300, size: 52, fam: LAT, color: WHITE, align: "right", a: B.a });
      const uu = e3(pr(tv, 71.60, 71.85));
      if (uu > 0) { const wA = measure(c, "Acceleration", 300, 52, LAT); c.fillStyle = RED; c.fillRect(1840 - wA, 276, wA * uu, 3); }
    }
    const C = sr_ln(tv, 71.36);
    if (C) T(c, "تمويل حتى", 1840, 320 + C.dy, { w: 300, size: 34, color: GREY, a: C.a });
    const E = sr_ln(tv, 71.42);
    if (E) metal(c, fmtMoney(STAGES[2].amt), 1840, 420 + E.dy, 96, { w: 200, align: "right", a: E.a });
  }
  // the readout and the marker: one layer, faded together on the exit (D 21.40-21.62, N 72.04-72.26, eio)
  function sr_over(x, tv, seg) {
    const D = seg === "D", a = 1 - eio(D ? pr(tv, 21.40, 21.62) : pr(tv, 72.04, 72.26));
    sr_fade(x, a, (c) => {
      if (D) sr_readD(c, tv); else sr_readN(c, tv);
      const m = sr_mkAt(tv, sr_MKS[seg]);
      if (m && VM) {
        c.save(); U.setM(c, sr_ewM());
        sr_marker(c, m.x, m.y, m.a, 54, 26, 2 * (EW_S / VM[0]));
        c.restore();
      }
    });
  }

  // ---------------------------------------------------------------- O · VO 72.37-76.05 (L3, free x 80-800)
  // SIX EPISODE CHIPS (one video per stage, in the title chip's grammar): TAG 88x48, pitch 96, y 168-216, right to left
  // 01 x 632-720 ... 06 x 152-240; index '0N' I500 24 at X+14, baseline 201; stage symbol 26 px at (X+64, 192).
  // 01 DONE · 02 = the title chip (PANEL, RED rim, RED '02', DOME) · 03 next (outline .6, CHEV white, '03' white) · 04-06 DIM.
  // The next-video DECK (video 1's V, mirrored into the left zone): front CARD 470x250 at x 250-720, y 330-580 (c 30),
  // back cards (-22,-22) and (-44,-44) at .55; RED pill 500x84 at x 220-720, y 610-694.
  const sr_O = { t0: 72.84, pulse: 73.71, dT0: 74.57, pill: 74.90, sheen: [75.25, 75.60], tap: [75.55, 75.71], out: [75.72, 75.96],
    F: { X: 250, Y: 330, w: 470, h: 250 }, off: [[-22, -22], [-44, -44]] };
  function sr_chip(x, i, tv) {
    const X = 632 - 96 * i, Y = 168, w = 88, h = 48, ST = STAGES[i], ix = X + 14, iy = 201, cx = X + 64, cy = 192;
    tagPath(x, X, Y, w, h); x.lineWidth = 1.5;
    if (i === 0) { // 01 Seed: DONE (fill .7, outline .25, the red cut + tick; symbol and index white .8)
      x.fillStyle = panelFill(x, Y, h, 0.7); x.fill(); x.strokeStyle = "rgba(255,255,255,0.25)"; x.stroke();
      sr_doneCut(x, X, Y, h, 1);
      T(x, ST.n, ix, iy, { w: 500, size: 24, fam: LAT, color: WHITE, a: 0.8 });
      sr_symMono(x, ST.sym, cx, cy, 26, 0.8, sr_symK(i, 1, 0));
    } else if (i === 1) { // 02 Incubation, this video: the title chip
      x.fillStyle = PANEL; x.fill(); x.strokeStyle = RED; x.stroke();
      T(x, ST.n, ix, iy, { w: 500, size: 24, fam: LAT, color: RED });
      sym(x, ST.sym, cx, cy, 26, { k: sr_symK(i, 1, 0) });
    } else if (i === 2) { // 03 Acceleration, next: outline .6 (RED on the pulse), CHEV and index white
      const b = sr_bump(tv, sr_O.pulse, 0.45);
      if (b < 1) { x.strokeStyle = `rgba(255,255,255,${(0.6 * (1 - b)).toFixed(3)})`; x.stroke(); }
      if (b > 0) { x.strokeStyle = rgba(RED, b.toFixed(3)); x.stroke(); }
      T(x, ST.n, ix, iy, { w: 500, size: 24, fam: LAT, color: WHITE });
      sr_symMono(x, ST.sym, cx, cy, 26, 1, { ignite: 1, t: Math.max(0, tv - sr_O.t0) });
    } else { // 04-06 DIM
      x.strokeStyle = "rgba(255,255,255,0.25)"; x.stroke();
      T(x, ST.n, ix, iy, { w: 500, size: 24, fam: LAT, color: DIM });
      sym(x, ST.sym, cx, cy, 26, { dim: true, k: sr_symK(i, 1, 0) });
    }
  }
  function sr_drawO(c, tv) {
    const O = sr_O;
    // the six chips: right to left, 01 first (0.05 s stagger), each scaleX 0 -> 1 from its right edge (0.3 s expo)
    for (let i = 0; i < 6; i++) {
      const k = expo(pr(tv, O.t0 + 0.05 * i, O.t0 + 0.05 * i + 0.3)); if (k <= 0) continue;
      const X = 632 - 96 * i, sc = i === 2 ? 1 + 0.08 * sr_bump(tv, O.pulse, 0.45) : 1;
      c.save();
      c.translate(X + 88, 192); c.scale(k, 1); c.translate(-(X + 88), -192);
      if (sc !== 1) { c.translate(X + 44, 192); c.scale(sc, sc); c.translate(-(X + 44), -192); }
      sr_fade(c, cl(k * 1.5), (cc) => sr_chip(cc, i, tv), "sr_fadeC");
      c.restore();
    }
    if (tv < O.dT0) return;
    // the deck fans in (front card reveal from the right 0.5 s; back cards 0.08 s apart, all landed by 75.07)
    const F = O.F, uF = pr(tv, O.dT0, O.dT0 + 0.5), fi = expo(uF), ci = expo(pr(tv, O.dT0 + 0.12, O.dT0 + 0.57));
    c.save(); c.translate(0, (1 - fi) * 24);
    for (let j = 1; j >= 0; j--) {
      const [ox, oy] = O.off[j], t1 = O.dT0 + 0.08 * (j + 1), kf = expo(pr(tv, t1, O.dT0 + 0.5));
      const bx = F.X + ox * kf, by = F.Y + oy * kf, ba = 0.55 * cl(fi * 1.4);
      c.save(); cardClip(c, bx, by, F.w, F.h, uF); card(c, bx, by, F.w, F.h, { a: ba }); c.restore();
    }
    card(c, F.X, F.Y, F.w, F.h, { u: uF, a: cl(fi * 1.4), fillA: 1 }); // opaque: the back cards never show through
    c.save(); cardClip(c, F.X, F.Y, F.w, F.h, uF); c.translate(0, (1 - ci) * 16);
    const ca = cl(ci * 1.3), R = F.X + F.w - 40; // R 680
    T(c, "الفيديو التالي", R, 392, { w: 300, size: 38, color: GREY, a: ca });
    metalCount(c, 3, "(3)", F.X + 30, 540, 140, { w: 200, a: ca, sheen: pr(tv, O.sheen[0], O.sheen[1]) });
    const ig = pr(tv, O.dT0 + 0.20, O.dT0 + 0.60);
    if (ig > 0) sym(c, "chev", R - 28, 448, 56, { a: ca, k: { ignite: ig, t: tv - (O.dT0 + 0.20) } });
    T(c, "Acceleration", R, 516, { w: 300, size: 34, fam: LAT, color: WHITE, align: "right", a: ca });
    T(c, "المرحلة الثالثة", R, 558, { w: 300, size: 34, color: GREY, a: ca });
    c.restore();
    c.restore();
    // RED pill «انتقل إلى الفيديو التالي», white disc with a red ←; the arrow taps left on «القادم»
    const pu = expo(pr(tv, O.pill, O.pill + 0.40));
    if (pu > 0) {
      const q = pr(tv, O.tap[0], O.tap[1]), nud = q > 0 && q < 1 ? -7 * Math.sin(Math.PI * q) : 0;
      c.save(); c.translate(0, (1 - pu) * 20);
      sr_fade(c, cl(pu * 1.3), (cc) => pill(cc, 220, 610, 500, 84, "انتقل إلى الفيديو التالي", { kind: "red", size: 34, circle: true, nudge: nud }), "sr_fadeP");
      c.restore();
    }
  }
  function sr_O_draw(x, tv) {
    const O = sr_O;
    if (tv < O.t0 || tv > O.out[1] + 0.02) return;
    const uo = eio(pr(tv, O.out[0], O.out[1]));
    sr_fade(x, 1 - uo, (c) => { c.save(); sr_xf(c, 450, 430, { dy: -10 * uo, sc: 1 - 0.015 * uo }); sr_drawO(c, tv); c.restore(); });
  }

  GROUPS.push({
    name: "stairs",
    floor: sr_floor,
    draw(x, t, S) {
      const k = S.shot && S.shot.k_beat;
      if (k !== "D" && k !== "N" && k !== "O") return;
      const tv = t - P;
      if (k === "O") { sr_O_draw(x, tv); return; }
      sr_stair(x, tv, k);
      U.reset(x);
      sr_over(x, tv, k);
    },
  });
