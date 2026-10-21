
  // ================================================================== GROUP «fund» (prefix fu_): beats G, H (B-roll 2), I
  // Spec: mg_ep2_final.json beats G, H, I and broll_2 (layouts in screen px, measured with the project fonts in the
  // canvas). Times are VO seconds (tv = t - P). Every hit sits on the measured onsets (word_onsets) and the pause map
  // (work/vo_pauses_vo.json). Shots are picked by S.shot.k_beat, never by times.
  // G  VC WIDE  VO 32.37-36.41  DROP 1 smash cut: floor ripple + pool flash; axi wordmark, «تمويلك حتى» + the scene's flag,
  //                             the page-8 metallic 'x10' over his head, ▲▲▲, the TAG chip CANDLES '$1,000'; one layer
  //                             out 36.05-36.33 with the pool back to .18
  // H  BR2      VO 36.41-47.41  B-ROLL 2 «x10»: your account (right) -> the RED-armed 'x10' gate (centre) -> Axi's funding
  //                             card (left): one $1,000 block -> ten blocks ($10,000); reset; $2,000 -> twenty blocks, the
  //                             total a skeleton (said in I); hard cuts in and out at full opacity
  // I  L3       VO 47.41-50.65  card-less: «قيمة التمويل», '$2,000 × 10 =', '$20,000' landing on «عشرين» (49.30), ▲▲▲,
  //                             the cap row DOME «سقف التمويل» 'Incubation'; one layer out 50.30-50.57
  // Frame f samples VO 0.04 f - 0.61: G's last frames are 36.35 / 36.39 (clean: out ends 36.33), I's 50.59 / 50.63 (clean:
  // out ends 50.57). B-roll 2 opens on f 926 (VO 36.43) and ends on f 1200 (VO 47.39) at full opacity.

  const fu_K = {
    // G: [31.97-32.40] (cut 32.37 = DROP 1) · ستقوم 32.40 · Axi 33.28 · بتمويلك 33.69 · لغاية 34.45 · عشرة 34.88 ·
    //    أضعاف 35.27 · هذا 35.67 · المبلغ 35.93-36.29 · [36.29-36.51] (cut 36.41)
    G: { cut: 32.37, fl0: 32.37, fl1: 32.47, fl2: 32.90, mark: 33.28, w1: 33.69, f0: 33.70, f1: 33.92, w2: 34.45,
      x10: 34.86, chev: 34.95, lift0: 34.88, lift1: 35.20, chip: 35.27, chip1: 35.62, sh0: 35.62, sh1: 35.97, o0: 36.05, o1: 36.33 },
    // H: [36.28-36.53] · يعني 36.51 · إذا 37.03 · كان 37.21 · [37.48-37.56] · حسابك 37.56 · [37.93-38.01] · ألف 38.01 · دولار 38.31 ·
    //    [38.55-38.75] · ستقوم 38.75 · Axi 39.25 · بتمويلك 39.51 · [40.01-40.15] · بمبلغ 40.13 · عشرة 40.75 · آلاف 41.15 ·
    //    [41.42-41.55] · دولار 41.54 · أمّا 41.93 · إذا 42.13 · حسابك 42.63 · [43.02-43.32] · ألفين 43.32 · دولار 43.68 ·
    //    [43.89-44.20] · ستقوم 44.18 · Axi 44.75 · بتمويلك 45.05 · [45.50-45.63] · أيضاً 45.63 · بعشرة 45.99 · أضعاف 46.45 ·
    //    هذا 46.76 · المبلغ 47.01-47.35 · [47.34-47.50] (cut 47.41)
    H: { cor0: 36.44, cor1: 36.89, kick: 36.52, kf0: 36.54, kf1: 36.76, rc: 37.05, hs: 37.48, n1: 37.51, n1L: 38.01, blk1: 38.00,
      sh1: 38.31, sh1b: 38.70, arm: 38.75, x0: 38.78, x1: 39.20, lc: 39.22, axi: 39.25, vlt: 39.34,
      g1: [39.55], gd: 0.50, fl1: 40.05, b1: 40.20, b1s: 0.05, n10L: 40.75, chev: 41.15, sh10: 41.15, sh10b: 41.55, hub: 41.54,
      akhar: 41.93, rst0: 42.15, rst1: 42.45, n2: 42.82, n2L: 43.32, blk2: 43.10, blk2b: 43.35, sh2: 43.68, sh2b: 44.08,
      rearm: 44.05, axiP: 44.75, g2: [45.05, 45.17], fl2: 45.66, skel: 45.66, b2: 45.99, b2s: 0.035, pop: [46.76, 46.91],
      und: 46.76 },
    // I: [47.34-47.50] (cut 47.41) · ليصل 47.48 · [47.85-48.03] · قيمة 48.03 · التمويل 48.35 · [48.79-49.00] · إلى 48.99 ·
    //    عشرين 49.30 · ألف 49.90-50.08 · [50.07-50.49] · دولار 50.49 (cut 50.65)
    I: { kick: 47.86, eq: 48.20, n0: 48.60, nL: 49.30, chev: 49.32, cap: 49.45, sh0: 49.90, sh1: 50.25, o0: 50.30, o1: 50.57 },
  };
  // a metalCount driven by fin * e4(pr(tv, t0, t1)) shows fin (Math.round reaches it) at the fraction fu_pLand(n) of its
  // window; t1 is chosen so that this landing falls exactly on the spoken number (the quartOut shape is kept). n is the
  // counted span (final - start).
  const fu_pLand = (n) => 1 - Math.pow(0.5 / n, 0.25);
  const fu_t1 = (t0, tLand, n) => t0 + (tLand - t0) / fu_pLand(n);

  // ------------------------------------------------------------------ helpers
  // measured widths, once
  const fu_M = {};
  function fu_w(x, s, w, size) { const k = s + "|" + w + "|" + size; if (!(k in fu_M)) fu_M[k] = measure(x, s, w, size, isAr(s) ? AR : LAT); return fu_M[k]; }
  // one fading layer: draw(c) paints in the caller's coordinates into a device-space buffer (the bbox X, Y, w, h under the
  // current transform), which lands once at alpha a. At a = 1 it draws straight through.
  const fu_BUF = {};
  async function fu_layer(x, X, Y, w, h, a, draw) {
    if (a <= 0.003) return;
    if (a >= 0.999) { await draw(x); return; }
    const M = x.getTransform(), px = [X, X + w, X, X + w], py = [Y, Y, Y + h, Y + h];
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let i = 0; i < 4; i++) {
      const dx = M.a * px[i] + M.c * py[i] + M.e, dy = M.b * px[i] + M.d * py[i] + M.f;
      x0 = Math.min(x0, dx); x1 = Math.max(x1, dx); y0 = Math.min(y0, dy); y1 = Math.max(y1, dy);
    }
    x0 = Math.max(0, Math.floor(x0) - 2); y0 = Math.max(0, Math.floor(y0) - 2);
    x1 = Math.min(x.canvas.width, Math.ceil(x1) + 2); y1 = Math.min(x.canvas.height, Math.ceil(y1) + 2);
    const cw = x1 - x0, ch = y1 - y0; if (cw <= 0 || ch <= 0) return;
    let c = fu_BUF.c;
    if (!c || c.width < cw || c.height < ch) c = fu_BUF.c = U.mk(Math.max(cw, c ? c.width : 0), Math.max(ch, c ? c.height : 0));
    const cx = c.x;
    cx.setTransform(1, 0, 0, 1, 0, 0); cx.globalAlpha = 1; cx.globalCompositeOperation = "source-over"; cx.filter = "none";
    cx.clearRect(0, 0, cw, ch);
    cx.save(); cx.beginPath(); cx.rect(0, 0, cw, ch); cx.clip();
    cx.setTransform(M.a, M.b, M.c, M.d, M.e - x0, M.f - y0);
    await draw(cx);
    cx.restore(); cx.setTransform(1, 0, 0, 1, 0, 0);
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha *= a; x.drawImage(c, 0, 0, cw, ch, x0, y0, cw, ch); x.restore();
  }
  // exit envelope (inOutCubic, as the kit's ent(): alpha -> 0, y -10, scale .985) applied about a pivot; returns the alpha
  function fu_exit(x, tv, a, b, cx, cy) {
    const u = eio(pr(tv, a, b));
    x.translate(cx, cy - 10 * u); x.scale(1 - 0.015 * u, 1 - 0.015 * u); x.translate(-cx, -cy);
    return 1 - u;
  }
  // one Arabic word rising out of its mask (the kit headline's motion: clip + rise, alpha k), right edge Xr; the clip runs
  // from baseline - 1.25 em to baseline + 0.70 em and 0.45 em past both ends (final ي dots and swashes)
  function fu_word(x, s, Xr, Y, size, wgt, color, k, rise = 18) {
    if (k <= 0) return;
    const mw = fu_w(x, s, wgt, size);
    x.save(); x.beginPath(); x.rect(Xr - mw - 0.45 * size, Y - size * 1.25, mw + 0.9 * size, size * 1.95); x.clip();
    T(x, s, Xr - mw, Y + (1 - k) * rise, { w: wgt, size, fam: AR, ltr: true, align: "left", color, a: k });
    x.restore();
  }
  const fu_bump = (tv, t0, d) => { const u = pr(tv, t0, t0 + d); return u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0; };
  // a scale about (cx, cy); pair with save/restore
  function fu_sc(x, cx, cy, s) { if (s !== 1) { x.translate(cx, cy); x.scale(s, s); x.translate(-cx, -cy); } }
  // polyline arc length helpers (the ghost rides the in-path at an arc length; the kit's comet keeps its own tables)
  function fu_cum(p) { const c = [0]; for (let i = 1; i < p.length; i++) c.push(c[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); return c; }
  function fu_at(p, c, d) {
    const n = p.length; if (d <= 0) return p[0]; if (d >= c[n - 1]) return p[n - 1];
    let lo = 0, hi = n - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (c[m] < d) lo = m; else hi = m; }
    const f = (d - c[lo]) / (c[hi] - c[lo] || 1);
    return [lerp(p[lo][0], p[hi][0], f), lerp(p[lo][1], p[hi][1], f)];
  }
  // dots every `step` px of arc (3 px dots), from `s0`
  function fu_dots(p, step = 12, s0 = 6) { const c = fu_cum(p), L = c[c.length - 1], out = []; for (let s = s0; s < L; s += step) out.push(fu_at(p, c, s)); return out; }

  // ================================================================== FLOOR (G): ripple on the cut, the white pool
  // pool .18 -> flash .26 on the drop (32.37-32.90) -> .18; lift to .26 as 'x10' lands (34.88-35.20); back to .18 with the
  // exit (36.05-36.33). The ripple is the kit's fRipple (red ring + white ring 0.1 s behind) from the stool on the cut.
  function fu_floorG(t, sh) {
    const tv = t - P, K = fu_K.G;
    const fl = e2(pr(tv, K.fl0, K.fl1)) * (1 - eio(pr(tv, K.fl1, K.fl2)));
    const lift = e2(pr(tv, K.lift0, K.lift1)) * (1 - eio(pr(tv, K.o0, K.o1)));
    sh.push(fPool(0.18 + 0.08 * Math.max(fl, lift)));
    fRipple(sh, t, v(K.cut));
  }

  // ================================================================== G · VO 32.37-36.41 · FUNDED UP TO x10 (VC WIDE, screen px)
  // WIDE keep-out x 845-1035, y 470-760: everything sits above y 452 ('x10' fades from y 405 to its baseline 450).
  async function fu_G(x, tv) {
    const K = fu_K.G;
    if (tv < K.mark || tv > K.o1) return;
    x.save();
    const a = fu_exit(x, tv, K.o0, K.o1, 1000, 270);
    await fu_layer(x, 730, 70, 700, 410, a, async (c) => {
      // the axi wordmark (axi_part_white) rises 12 px into the top centre, h 56 (108 px) at x 892-1000, y 92-148
      const km = expo(pr(tv, K.mark, K.mark + 0.4));
      await axiMark(c, 892, 92 + 12 * (1 - km), 56, cl(km * 1.25));
      // two-tone headline A300 56, baseline 230: «تمويلك» (white) x 916-1093, «حتى» (grey) x 800-900; the flag x 1121-1136
      flag(c, 1093 + 28, 230 - 56 * 0.81, 20, { mirror: true, u: pr(tv, K.f0, K.f1) });
      fu_word(c, "تمويلك", 1093, 230, 56, 300, WHITE, e4(pr(tv, K.w1, K.w1 + 0.42)));
      fu_word(c, "حتى", 1093 - fu_w(c, "تمويلك", 300, 56) - 56 * 0.28, 230, 56, 300, GREY, e4(pr(tv, K.w2, K.w2 + 0.42)));
      // 'x10' metallic I200 220, centred x 946, baseline 450: scale 1.04 -> 1 + 20 px rise (0.35 s expo); one sheen
      const kx = expo(pr(tv, K.x10, K.x10 + 0.35));
      if (tv >= K.x10) {
        c.save(); c.translate(0, 20 * (1 - kx)); fu_sc(c, 946, 370, lerp(1.04, 1, kx));
        metalCount(c, 10, "x10", 946, 450, 220, { align: "center", fade: true, a: cl(kx * 1.25), sheen: pr(tv, K.sh0, K.sh1) });
        c.restore();
      }
      chev3(c, 752, 380, tv, K.chev); // ▲▲▲ 24 px left of the 'x' (x 752-770, y 380 / 402 / 424)
      // the TAG chip 250x64 at x 1150-1400, y 362-426: the plate opens from its right edge (scaleX 0 -> 1) + 12 px rise,
      // 0.35 s expo; its content (CANDLES 36 + '$1,000' I300 34, static) is revealed by the plate, unsquashed
      if (tv >= K.chip) {
        const kc = expo(pr(tv, K.chip, K.chip1));
        c.save(); c.translate(0, 12 * (1 - kc)); c.globalAlpha *= cl(kc * 2);
        c.save(); c.translate(1400, 0); c.scale(Math.max(0.001, kc), 1); c.translate(-1400, 0); tag(c, 1150, 362, 250, 64, {}); c.restore();
        c.save(); c.beginPath(); c.rect(1400 - 250 * kc, 340, 250 * kc + 4, 110); c.clip();
        sym(c, "candles", 1366, 394, 36, {});
        metal(c, "$1,000", 1340, 407, 34, { w: 300, align: "right" });
        c.restore(); c.restore();
      }
    });
    x.restore();
  }

  // ================================================================== H · VO 36.41-47.41 · B-ROLL 2 «x10» (inside brScene's drift)
  // RTL flow: your account (RIGHT card) -> the gate (CENTRE) -> Axi's funding (LEFT card). Draw order, back to front:
  // kicker, the two cards (plates and type), the dotted paths, the unit blocks, the ghosts and comets, the gate's corner
  // triangles, the gate (blocks, ghosts and corners emerge from under it).
  const fu_INP = comet.quad([1665, 558], [1380, 445], [1094, 445], 64); // in-path: block 1's centre -> the gate's right edge
  const fu_INL = fu_cum(fu_INP)[fu_INP.length - 1];
  const fu_INX = fu_INP.concat([[880, 445]]); // the same, extended into the gate (the ghost and its comet slide in under it)
  const fu_INXC = fu_cum(fu_INX);
  const fu_INDOT = fu_dots(fu_INP);
  const fu_SLOT = (i) => [550 - 80 * (i % 5), 490 + 46 * Math.floor(i / 5)]; // grid slot top-left (slot 1 at x 550-620, y 490)
  // launch order (slot indices): the far slots first, i.e. the longest out-path first (column by column from the far left,
  // the bottom row first), so no block flies across a landed one and a later (slower, shorter) flight never overtakes an
  // earlier one; the landed grid is the same
  const fu_ORD10 = [9, 4, 8, 3, 7, 2, 6, 1, 5, 0], fu_ORD20 = [19, 14, 9, 4, 18, 13, 8, 3, 17, 12, 7, 2, 16, 11, 6, 1, 15, 10, 5, 0];
  const fu_OUT0 = [826, 445], fu_OUTC = [700, 445]; // out-path: the gate's left edge via (700,445) to each slot's centre
  const fu_OUTDOT = fu_dots(comet.quad(fu_OUT0, fu_OUTC, [585, 508], 32)); // the guide to slot 1
  const fu_quadAt = (P0, C, P2, u) => { const a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u; return [a * P0[0] + b * C[0] + c * P2[0], a * P0[1] + b * C[1] + c * P2[1]]; };
  // the white unit block (TAG 70x36) at top-left X, Y; o.rim (RED 2 px alpha), o.s (scale), o.a. The fill is the colour
  // of white .88 over the card (#E3E3E4), drawn opaque so the blocks in flight never add up where they overlap. A 1.5 px
  // PANEL ring OUTSIDE the plate (a 3 px stroke clipped to the outside) keeps a block that passes over another separate;
  // on the card's PANEL it is invisible, and it never overlaps the fill (no dark seam while a block fades)
  function fu_block(x, X, Y, o = {}) {
    const a = o.a ?? 1; if (a <= 0.003) return;
    x.save(); x.globalAlpha *= a; fu_sc(x, X + 35, Y + 18, o.s ?? 1);
    x.save(); x.beginPath(); x.rect(X - 8, Y - 8, 86, 52);
    [[X + 0.355 * 36, Y], [X + 70, Y], [X + 70, Y + 0.57 * 36], [X + 70 - 0.35 * 36, Y + 36], [X, Y + 36], [X, Y + 0.43 * 36]].forEach(([px, py], i) => (i ? x.lineTo(px, py) : x.moveTo(px, py)));
    x.closePath(); x.clip("evenodd");
    tagPath(x, X, Y, 70, 36); x.lineWidth = 3; x.strokeStyle = PANEL; x.stroke(); x.restore();
    tagPath(x, X, Y, 70, 36); x.fillStyle = "#E3E3E4"; x.fill();
    if (o.rim > 0) { x.lineWidth = 2; x.strokeStyle = rgba(RED, cl(o.rim)); x.stroke(); }
    x.restore();
  }
  // the dotted paths (3 px dots every 12 px) at alpha a
  function fu_paths(x, a) {
    if (a <= 0.003) return;
    x.save(); x.globalAlpha *= a; x.fillStyle = WHITE; x.beginPath();
    for (const D of [fu_INDOT, fu_OUTDOT]) for (const [px, py] of D) { x.moveTo(px + 1.5, py); x.arc(px, py, 1.5, 0, Math.PI * 2); }
    x.fill(); x.restore();
  }
  // the gate state: red rim (0..1), the paths' alpha, the white flash (2 frames), the 'x10' pulse, the corner snap
  function fu_gateState(tv) {
    const K = fu_K.H;
    const red = e2(pr(tv, K.arm, K.arm + 0.25)) * (1 - e2(pr(tv, K.rst0, K.rst1))) + e2(pr(tv, K.rearm, K.rearm + 0.25));
    const pa = 0.12 * e2(pr(tv, K.cor0, K.cor1)) + 0.18 * (e2(pr(tv, K.arm, K.arm + 0.25)) * (1 - e2(pr(tv, K.rst0, K.rst1))) + e2(pr(tv, K.rearm, K.rearm + 0.25)));
    const white = (tv >= K.fl1 && tv < K.fl1 + 0.08) || (tv >= K.fl2 && tv < K.fl2 + 0.08);
    const pulse = 0.08 * (fu_bump(tv, K.fl1, 0.25) + fu_bump(tv, K.fl2, 0.25));
    const snap = 6 * (fu_bump(tv, K.arm, 0.15) + fu_bump(tv, K.rearm, 0.15));
    return { red: cl(red), pa, white, pulse, snap };
  }
  // a ghost copy of block 1 (TAG outline, white .6) riding the in-path, led by the kit comet; run [t0, t0 + d] (eio). The
  // comet gets the kit's o.du (its eased step over the last frame): at the run's peak the head moves ~150 px a frame
  // against its 54 px tail, which strobed; with du the tail stretches over that step (same head, glow and 9 px spacing)
  function fu_ghost(x, tv, t0, d) {
    const u = pr(tv, t0, t0 + d); if (u <= 0 || u >= 1) return;
    const sgAt = (q) => (fu_INL + 40) * eio(q);
    const sg = sgAt(u), [gx, gy] = fu_at(fu_INX, fu_INXC, sg);
    const gin = eio(pr(tv, t0, t0 + 0.08));
    x.save(); x.globalAlpha *= 0.6 * gin;
    tagPath(x, gx - 35, gy - 18, 70, 36); x.lineWidth = 1.5; x.strokeStyle = WHITE; x.stroke();
    x.restore();
    const L = fu_INXC[fu_INXC.length - 1];
    comet(x, fu_INX, (sg + 109) / L, { a: gin, du: (sg - sgAt(pr(tv - 0.04, t0, t0 + d))) / L });
  }
  async function fu_H(x, tv) {
    const K = fu_K.H, G = fu_gateState(tv);
    // ---- 1. kicker «مثال» (+ «آخر» on «أمّا») A300 56, right-aligned x 1740, baseline 160; the scene's flag x 1768-1783
    flag(x, 1740 + 28, 160 - 56 * 0.81, 20, { mirror: true, u: pr(tv, K.kf0, K.kf1) });
    fu_word(x, "مثال", 1740, 160, 56, 300, WHITE, e4(pr(tv, K.kick, K.kick + 0.42)));
    fu_word(x, "آخر", 1740 - fu_w(x, "مثال", 300, 56) - 56 * 0.28, 160, 56, 300, GREY, e4(pr(tv, K.akhar, K.akhar + 0.42)));

    // ---- 2. RIGHT card «حسابك» 440x420 at x 1300-1740, y 240-660 (cut 44): clip from the right edge + 24 px rise (0.5 s expo)
    if (tv >= K.rc) {
      const u = pr(tv, K.rc, K.rc + 0.5), ui = expo(u), uc = expo(pr(tv, K.rc + 0.12, K.rc + 0.62));
      x.save(); x.translate(0, (1 - ui) * 24);
      card(x, 1300, 240, 440, 420, { u, a: cl(ui * 1.25), c: 44 });
      if (uc > 0) {
        x.save(); cardClip(x, 1300, 240, 440, 420, u); x.globalAlpha *= cl(uc * 1.3); x.translate(0, (1 - uc) * 10);
        sym(x, "candles", 1360, 300, 56, { u: pr(tv, K.rc + 0.12, K.rc + 0.62) });
        // «حسابك» rises out of its mask on its own, from the pause before it (37.48), landing on its onset (37.56)
        fu_word(x, "حسابك", 1700, 330, 44, 500, WHITE, e4(pr(tv, K.hs, K.hs + 0.42)), 16);
        // '$1,000' counts 0 -> 1,000 onto «ألف» (38.01); one sheen on «دولار». It fades in over 0.12 s around the count's
        // start (n1 - 0.08 .. n1 + 0.04), so its first visible frames read '$0' (E's '0' and video 1's counters)
        if (tv >= K.n1 - 0.08 && tv < K.n2)
          metalCount(x, 1000 * e4(pr(tv, K.n1, fu_t1(K.n1, K.n1L, 1000))), "$1,000", 1700, 450, 88, { align: "right", a: cl(pr(tv, K.n1 - 0.08, K.n1 + 0.04)), sheen: pr(tv, K.sh1, K.sh1b) });
        else if (tv >= K.n2) // 1,000 -> 2,000 onto «ألفين» (43.32), from the landed '$1,000'; one sheen on «دولار»
          metalCount(x, 1000 + 1000 * e4(pr(tv, K.n2, fu_t1(K.n2, K.n2L, 1000))), "$2,000", 1700, 450, 88, { align: "right", from: "$1,000", sheen: pr(tv, K.sh2, K.sh2b) });
        if (tv >= K.und) { const k = e3(pr(tv, K.und, K.und + 0.25)); x.fillStyle = RED; x.fillRect(1700 - 287 * k, 462, 287 * k, 3); } // «هذا المبلغ»
        x.restore();
      }
      x.restore();
    }

    // ---- 3. LEFT card «تمويل Axi» 480x520 at x 180-660, y 220-740 (cut 48)
    if (tv >= K.lc) {
      const u = pr(tv, K.lc, K.lc + 0.5), ui = expo(u), uc = expo(pr(tv, K.lc + 0.12, K.lc + 0.62));
      x.save(); x.translate(0, (1 - ui) * 24);
      card(x, 180, 220, 480, 520, { u, a: cl(ui * 1.25), c: 48 });
      if (uc > 0) {
        x.save(); cardClip(x, 180, 220, 480, 520, u); x.globalAlpha *= cl(uc * 1.3); x.translate(0, (1 - uc) * 10);
        sym(x, "vault", 240, 280, 56, { u: pr(tv, K.vlt, K.vlt + 0.5), k: { rot: ((2 * Math.PI) / 3) * e3(pr(tv, K.fl1, K.fl1 + 0.4)), pulse: pr(tv, K.hub, K.hub + 0.3) } });
        T(x, "تمويل", 620, 330, { w: 500, size: 44 });
        // the axi wordmark h 40 (77 px) at x 401-478, y 294-334, read after «تمويل»: rises 12 px on «Axi», pulses on «Axi» 44.75
        const ka = expo(pr(tv, K.axi, K.axi + 0.4));
        x.save(); fu_sc(x, 439.5, 314, 1 + 0.04 * fu_bump(tv, K.axiP, 0.25));
        await axiMark(x, 401, 294 + 12 * (1 - ka), 40, cl(ka * 1.25));
        x.restore();
        // the amount: '$10,000' counts onto «عشرة» (40.75), ▲▲▲ + one sheen on «آلاف»; both fade with the reset (smoothstep
        // 0.42 s, the B-roll exit rule); then the TOTAL SKELETON from «أيضاً» (said in the next shot)
        const ra = 1 - ss(pr(tv, K.rst0, K.rst0 + 0.42));
        // (the same 0.12 s alpha ramp around the count's start, so it opens on '$0')
        if (tv >= K.b1 - 0.08 && ra > 0.003) {
          metalCount(x, 10000 * e4(pr(tv, K.b1, fu_t1(K.b1, K.n10L, 10000))), "$10,000", 620, 450, 88, { align: "right", a: ra * cl(pr(tv, K.b1 - 0.08, K.b1 + 0.04)), sheen: pr(tv, K.sh10, K.sh10b) });
          chev3(x, 240, 400, tv, K.chev, { a: ra });
        }
        if (tv >= K.skel) skeleton(x, 280, 392, 340, 60, tv, e2(pr(tv, K.skel, K.skel + 0.2)), { r: 10 });
        x.restore();
      }
      x.restore();
    }

    // ---- 4. the dotted paths: white .12 idle, .30 armed
    fu_paths(x, G.pa);

    // ---- 5. the unit blocks
    // right card: block 1 pops into its place on «ألف» (scale .9 -> 1, back 1.4, 0.25 s); block 2 slides out from under it
    // to its left (43.10-43.35, e4); on «هذا المبلغ» both get a 2 px RED rim and pop twice (1 -> 1.08 -> 1, 0.15 s)
    const pop = 0.08 * (fu_bump(tv, K.pop[0], 0.15) + fu_bump(tv, K.pop[1], 0.15)), rim = e2(pr(tv, K.pop[0], K.pop[0] + 0.1));
    if (tv >= K.blk2) {
      const k2 = e4(pr(tv, K.blk2, K.blk2b));
      fu_block(x, lerp(1630, 1550, k2), 540, { a: cl(pr(tv, K.blk2, K.blk2b) * 4), s: 1 + pop, rim });
    }
    if (tv >= K.blk1) {
      const p = pr(tv, K.blk1, K.blk1 + 0.25);
      fu_block(x, 1630, 540, { a: cl(p * 3), s: lerp(0.9, 1, back(p, 1.4)) + pop, rim });
    }
    // the grid: example 1 = ten blocks (0.05 s stagger), example 2 = twenty (0.035 s), each 0.30 s e3 along the out-path from
    // the gate's left edge to its slot, landing with a 3 px settle; launched far slots first (fu_ORD10 / fu_ORD20); example 1's
    // leave with the reset (16 px drop + smoothstep fade, 0.02 s stagger in slot order, 0.42 s each)
    const fly = (i, t0, fade) => {
      const te = t0 + 0.3, p = pr(tv, t0, te); if (p <= 0) return;
      const [SX, SY] = fu_SLOT(i), cx0 = SX + 35, cy0 = SY + 18;
      let cx = cx0, cy = cy0;
      if (p < 1) [cx, cy] = fu_quadAt(fu_OUT0, fu_OUTC, [cx0, cy0], e3(p));
      else cy += 3 * fu_bump(tv, te, 0.12);
      const fo = fade ? ss(pr(tv, K.rst0 + 0.02 * i, K.rst0 + 0.02 * i + 0.42)) : 0;
      fu_block(x, cx - 35, cy - 18 + 16 * fo, { a: cl(p * 5) * (1 - fo) });
    };
    if (tv >= K.b1 && tv < K.rst0 + 0.7) for (let j = 0; j < 10; j++) fly(fu_ORD10[j], K.b1 + K.b1s * j, true);
    if (tv >= K.b2) for (let j = 0; j < 20; j++) fly(fu_ORD20[j], K.b2 + K.b2s * j, false);

    // ---- 6. ghosts + comets on the in-path, clipped out of the gate (they slide in under it)
    const ghosts = tv < K.fl1 + 0.05 ? K.g1 : K.g2;
    if (ghosts.some((t0) => tv > t0 && tv < t0 + K.gd)) {
      x.save(); x.beginPath(); x.rect(-200, -200, W + 400, H + 400); // the frame minus the gate's TAG (tagPath would reset the path)
      [[830 + 0.355 * 150, 370], [1090, 370], [1090, 370 + 0.57 * 150], [1090 - 0.35 * 150, 520], [830, 520], [830, 370 + 0.43 * 150]].forEach(([px, py], i) => (i ? x.lineTo(px, py) : x.moveTo(px, py)));
      x.closePath(); x.clip("evenodd");
      for (const t0 of ghosts) fu_ghost(x, tv, t0, K.gd);
      x.restore();
    }

    // ---- 7. the GATE: corner triangles (legs 18) at x 806-1114, y 346-544 fly out from under it and snap 6 px on arming;
    // TAG 260x150 at x 830-1090, y 370-520, PANEL, white .25 rim idle, RED 2 px armed, white for 2 frames on a flash;
    // 'x10' metallic I200 96 centred x 960, baseline 480: rises 16 px through a clip on arming, pulses 1.08 on a flash
    const d = G.snap;
    if (tv >= K.cor0) corners(x, 806 - d, 346 - d, 308 + 2 * d, 198 + 2 * d, { L: 18, u: pr(tv, K.cor0, K.cor1), u2: 0 });
    tag(x, 830, 370, 260, 150, { outline: 0.25, rim: G.white ? 0 : G.red });
    if (G.white) { x.save(); tagPath(x, 830, 370, 260, 150); x.lineWidth = 2; x.strokeStyle = WHITE; x.stroke(); x.restore(); }
    if (tv >= K.x0) {
      const kx = e4(pr(tv, K.x0, K.x1));
      x.save(); x.beginPath(); x.rect(836, 376, 248, 110); x.clip(); fu_sc(x, 960, 445, 1 + G.pulse);
      metal(x, "x10", 960, 480 + 16 * (1 - kx), 96, { align: "center", a: kx });
      x.restore();
    }
  }

  // ================================================================== I · VO 47.41-50.65 · $20,000, THE INCUBATION CAP (L3, x 80-800)
  async function fu_I(x, tv) {
    const K = fu_K.I;
    if (tv < K.kick || tv > K.o1) return;
    x.save();
    const a = fu_exit(x, tv, K.o0, K.o1, 410, 470);
    await fu_layer(x, 90, 270, 680, 410, a, (c) => {
      // kicker «قيمة التمويل» A500 44 white, right-aligned x 693, baseline 330: rises 16 px (0.42 s e4), landing on «قيمة»
      fu_word(c, "قيمة التمويل", 693, 330, 44, 500, WHITE, e4(pr(tv, K.kick, K.kick + 0.42)), 16);
      // the equation, LTR, baseline 420: '$2,000' (metallic I300 44) x 120, RED '×' x 282, '10' x 325, '=' (grey) x 377;
      // each rises 12 px (e4, 0.35 s), 0.06 s apart, left to right
      const ke = (i) => e4(pr(tv, K.eq + 0.06 * i, K.eq + 0.06 * i + 0.35));
      let k = ke(0); if (k > 0) metal(c, "$2,000", 120, 420 + 12 * (1 - k), 44, { w: 300, a: k });
      k = ke(1); if (k > 0) T(c, "×", 282, 420 + 12 * (1 - k), { fam: LAT, w: 300, size: 44, color: RED, a: k });
      k = ke(2); if (k > 0) T(c, "10", 325, 420 + 12 * (1 - k), { fam: LAT, w: 300, size: 44, color: WHITE, a: k });
      k = ke(3); if (k > 0) T(c, "=", 377, 420 + 12 * (1 - k), { fam: LAT, w: 300, size: 44, color: GREY, a: k });
      // '$20,000' metallic I200 150, left-aligned x 120 (x 120-693), baseline 560: counts 0 -> 20,000 in fixed cells and
      // lands on «عشرين» (49.30); bottom 28 % fade; one sheen 49.90-50.25
      if (tv >= K.n0) {
        const ui = expo(pr(tv, K.n0, K.n0 + 0.45));
        metalCount(c, 20000 * e4(pr(tv, K.n0, fu_t1(K.n0, K.nL, 20000))), "$20,000", 120, 560 + 16 * (1 - ui), 150,
          { fade: true, a: cl(ui * 1.25), sheen: pr(tv, K.sh0, K.sh1) });
      }
      chev3(c, 717, 490, tv, K.chev); // ▲▲▲ to its right (x 717-735, y 490 / 512 / 534)
      // the cap row, baseline 640, RTL from x 693: DOME 36 (675,628), «سقف التمويل» A300 34 grey (x 442-645), 'Incubation'
      // I400 30 white (x 291-430); rises 12 px (0.42 s e4)
      if (tv >= K.cap) {
        const kc = e4(pr(tv, K.cap, K.cap + 0.42)), dy = 12 * (1 - kc);
        c.save(); c.globalAlpha *= kc; c.translate(0, dy);
        sym(c, "dome", 675, 628, 36, { u: pr(tv, K.cap, K.cap + 0.42) });
        T(c, "سقف التمويل", 645, 640, { w: 300, size: 34, color: GREY });
        T(c, "Incubation", 430, 640, { fam: LAT, w: 400, size: 30, color: WHITE, align: "right" });
        c.restore();
      }
    });
    x.restore();
  }

  GROUPS.push({
    name: "fund",
    floor(t, sh, S) { if (S.shot && S.shot.k_beat === "G") fu_floorG(t, sh); },
    async draw(x, t, S) {
      const k = S.shot && S.shot.k_beat;
      if (k === "G") await fu_G(x, t - P);
      else if (k === "I") await fu_I(x, t - P);
    },
    async broll(x, t, S, id) {
      if (id !== 2) return;
      const lt = Math.max(0, t - S.shot.f0 / 25), tv = t - P;
      await brScene(x, t, lt, { cz0: 37, bokehY: 370 }, async (c) => fu_H(c, tv));
    },
  });
