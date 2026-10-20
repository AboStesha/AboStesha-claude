
  // ================================================================== GROUP "join": beats D, E, F1, F2, G (VO 14.88-33.40)
  // D  VC WIDE        VO 14.88-18.52  Edge Score halo over Rabee's head: 41-tick arc, metallic 0 -> 50, apex notch, '+', ▲▲▲
  // E  L5 medium      VO 18.52-22.60  the two conditions as CARDs (gauge 50+ | coins $ 500), each met with a red CHECK tab
  // F1 L3 profile     VO 22.60-27.00  the trading card, then Axi's NEW allocation card (wordmark, vault, skeleton -> title)
  // F2 VC HOME->WIDE  VO 27.00-31.92  allocation card (left) + live trading card (right), funding pour, dotted link, spills
  // G  L2 close-up    VO 31.92-33.40  «مبروك!» + flag + brand particle burst, then the stage pill '01' «المرحلة الأولى»
  // Layouts follow sel/mg_final.json. Times are VO seconds: the spec's ≈ onsets (raw-VO whisper, ~0.1 s late) are snapped
  // to work/words_v4.json and to the pauses of the final voice (14.76-15.00, 18.65-18.96, 22.61-22.96, 25.41-25.60,
  // 26.94-27.14, 31.96-32.06, 32.52-32.95). Every element is gone >= 2 frames before each cut (D 18.52, E 22.60, F1 27.00,
  // F2 31.92, G 33.40) and nothing enters while the F2 camera pulls (27.08-27.70). One flag in the whole group: G's word.
  // (The engine samples frame f at t = (f + 0.5) / 25: the last frames before the cuts are VO 18.46/18.50, 22.54/22.58,
  // 26.94/26.98, 31.86/31.90 and 33.34/33.38, all clean.)
  const jn_K = {
    D: { rip: 14.88, pool: 15.20, arc: 15.35, zero: 15.62, edge: 16.04, cap: 16.30, c0: 17.05, c1: 17.96, o0: 18.18, o1: 18.42 },
    E: { R: 18.92, sw0: 19.10, sw1: 19.45, chkR: 19.45, L: 19.32, coins: [19.42, 19.57, 19.72], n0: 19.37, n1: 19.90, lab: 20.30, chkL: 21.40, oR: [22.15, 22.43], oL: [22.22, 22.50] },
    F1: { back: 23.10, mark: 23.66, front: 23.98, tab: 24.30, vault: 24.55, title: 25.55, sub: 25.85, turn: 26.14, o0: 26.58, o1: 26.90 },
    F2: { alloc: 28.04, spR: 28.24, trade: 28.45, chart: 28.60, spW: 28.70, track: 28.95, mark: 29.70, live: 29.70, pour: 30.02, fill0: 30.08, fill1: 31.40, link: 31.00, sheen: 31.06, o0: 31.55, o1: 31.84 },
    G: { word: 32.00, burst: 32.02, pill: 32.62, o0: 33.02, o1: 33.32 },
  };
  // exit envelope (inOutCubic, as kit ent(): alpha -> 0, y -10, scale .985; the last visible frame keeps < 2 % alpha) and
  // its transform about a pivot
  function jn_x(tv, a, b) { const u = eio(pr(tv, a, b)); return { a: 1 - u, dy: -10 * u, sc: 1 - 0.015 * u }; }
  function jn_piv(x, ex, cx, cy) { x.translate(cx, cy + ex.dy); x.scale(ex.sc, ex.sc); x.translate(-cx, -cy); }
  // CARD entry of the spec: clip width grows from the right edge, 24 px rise + alpha, 0.5 s expo; content 0.12 s later
  function jn_cin(tv, t0) { const u = pr(tv, t0, t0 + 0.5); return { u, ui: expo(u), uc: expo(pr(tv, t0 + 0.12, t0 + 0.62)) }; }
  // measured string widths / fitted sizes, computed once (fit-check against the spec's boxes)
  const jn_M = {};
  function jn_fit(x, key, s, w, size, maxW, min) { if (!(key in jn_M)) jn_M[key] = fit(x, s, w, size, maxW, min, isAr(s) ? AR : LAT); return jn_M[key]; }
  function jn_w(x, key, s, w, size) { if (!(key in jn_M)) jn_M[key] = measure(x, s, w, size, isAr(s) ? AR : LAT); return jn_M[key]; }

  // per-word reveal from the right (kit headline() motion: clip + 18 px rise, 0.42 s e4, 0.07 s stagger), no flag; the clip
  // reaches baseline + 0.7 em so Arabic descenders and final-ي dots are never cut
  function jn_head(x, words, X, Y, size, tv, t0, o = {}) {
    if (tv < t0) return;
    const wgt = o.w ?? 500; let xx = X;
    words.forEach((s, i) => {
      const mw = measure(x, s, wgt, size, AR), k = e4(pr(tv, t0 + 0.05 + i * 0.07, t0 + 0.47 + i * 0.07));
      if (k > 0) {
        x.save(); x.beginPath(); x.rect(xx - mw - 6, Y - size * 1.2, mw + 12, size * 1.9); x.clip();
        T(x, s, xx - mw, Y + (1 - k) * 18, { w: wgt, size, fam: AR, ltr: true, align: "left", color: o.color || WHITE, a: k });
        x.restore();
      }
      xx -= mw + size * 0.28;
    });
  }

  // ---------------------------------------------------------------- D · Edge Score halo (VC WIDE, screen space)
  const jn_tickT = (i, c0, c1) => c0 + (c1 - c0) * (1 - Math.sqrt(1 - i / 20)); // when the quadOut counter passes 2.5 i
  function jn_D(x, tv) {
    const K = jn_K.D, cx = 946, cy = 430;
    if (tv < K.arc) return;
    const ex = jn_x(tv, K.o0, K.o1); if (ex.a <= 0.003) return;
    x.save(); jn_piv(x, ex, cx, 300); x.globalAlpha = ex.a;
    const uc = pr(tv, K.c0, K.c1), val = 50 * e2(uc); // quadOut: a soft tail, so 49 holds 3 frames, not 9
    // 41 radial ticks (one per 2.5 points), r 312 -> 330 and 5 px wide; majors to 342 at both ends, the quarters and the
    // apex. Power on left -> right (0.012 s stagger); light with the counter (white 2 frames, then RED). The fill holds at
    // 50 through the exit and fades with '50+' (no drain: draining while the number is up read as the score collapsing)
    for (let i = 0; i <= 40; i++) {
      const ua = pr(tv, K.arc + i * 0.012, K.arc + i * 0.012 + 0.1); if (ua <= 0) continue;
      let col = TRACK;
      if (i <= 20) {
        const tl = jn_tickT(i, K.c0, K.c1);
        if (tv >= tl) col = tv - tl < 0.08 ? WHITE : RED;
      }
      const r1 = i % 10 === 0 ? 342 : 330, g = e3(ua);
      x.save(); x.translate(cx, cy); x.rotate(Math.PI + (Math.PI * i) / 40); x.globalAlpha = ex.a * g; x.fillStyle = col;
      x.fillRect(312, -2.5, (r1 - 312) * (0.35 + 0.65 * g), 5); x.restore();
    }
    // red glow sprite (r 24) riding the leading tick while the counter runs
    if (uc > 0 && tv < K.c1 + 0.2) {
      const an = Math.PI + (Math.PI * val) / 100, ga = uc < 1 ? cl(uc * 8) : 1 - eio(pr(tv, K.c1, K.c1 + 0.2));
      glow(x, cx + Math.cos(an) * 321, cy + Math.sin(an) * 321, 24, RED, 0.85 * ga);
    }
    // white threshold notch outside the apex (r 350 -> 370); RED with a red glow (r 40, 0.3 s) on the landing
    const tn = K.arc + 20 * 0.012, un = e3(pr(tv, tn, tn + 0.25));
    if (un > 0) {
      const lit = tv >= K.c1, ny = cy - 350 - (1 - un) * 6;
      if (lit) { const k = pr(tv, K.c1, K.c1 + 0.3); if (k < 1) glow(x, cx, cy - 360, 40, RED, Math.pow(Math.sin(Math.PI * k), 3)); } // smooth tail
      x.save(); x.globalAlpha = ex.a * un; x.fillStyle = lit ? RED : WHITE; x.strokeStyle = x.fillStyle; x.lineWidth = 2; x.lineJoin = "round";
      x.beginPath(); x.moveTo(cx - 9, ny - 19); x.lineTo(cx + 9, ny - 19); x.lineTo(cx, ny - 1); x.closePath(); x.fill(); x.stroke();
      x.restore();
    }
    // metallic readout, Inter 200 150 centred on x 946, baseline 305, hero fade: fixed cells while counting, relaxing to the
    // natural advances over 0.15 s on the landing; floor() so '50' lands with the word
    const uz = pr(tv, K.zero, K.zero + 0.3);
    if (uz > 0) {
      const counting = tv < K.c1 + 0.15, relax = pr(tv, K.c1, K.c1 + 0.15);
      metal(x, String(Math.floor(val + 1e-6)), cx, 305, 150, { align: "center", fade: true, a: e3(uz), tab: counting, relax, sheen: pr(tv, K.c1 + 0.04, K.c1 + 0.54) });
    }
    // the RED '+' lands (rise 12 px) at x 1045-1105, baseline 290; ▲▲▲ pop to the left of the numeral, in its lower half
    const up = expo(pr(tv, K.c1, K.c1 + 0.3));
    if (up > 0) T(x, "+", 1045, 290 + (1 - up) * 12, { fam: LAT, w: 200, size: 100, color: RED, a: cl(up * 1.5) });
    chev3(x, 818, 245, tv, K.c1, { a: ex.a });
    // labels
    const ue = expo(pr(tv, K.edge, K.edge + 0.4));
    if (ue > 0) T(x, "Edge Score", cx, 362 + (1 - ue) * 12, { fam: LAT, w: 300, size: 40, align: "center", a: cl(ue * 1.4) });
    const uk = expo(pr(tv, K.cap, K.cap + 0.4));
    if (uk > 0) T(x, "الحدّ الأدنى للانضمام", cx, 412 + (1 - uk) * 12, { w: 300, size: 36, align: "center", color: GREY, a: cl(uk * 1.4) });
    x.restore();
  }

  // ---------------------------------------------------------------- E · the two conditions (L5, screen space)
  // red sweep of the gauge symbol (the kit's gauge shows its red arc only once the draw-on is done)
  function jn_gaugeRed(x, cx, cy, size, val) {
    if (val <= 0) return;
    const k = size / 100, lw = Math.max(2.5, 0.032 * size) * 2.2;
    x.save(); x.strokeStyle = RED; x.lineWidth = lw; x.lineCap = "round";
    x.beginPath(); x.arc(cx, cy + 18 * k, 40 * k, Math.PI, Math.PI + Math.PI * val); x.stroke(); x.restore();
  }
  // a condition CARD 440x320 at X,320 (cut 38): entry, check tab, exit; fill(R) draws the content with R = right edge
  function jn_Ecard(x, tv, ex, X, t0, tChk, fill) {
    const Y = 320, w = 440, h = 320, ci = jn_cin(tv, t0); if (ci.u <= 0 || ex.a <= 0.003) return;
    x.save(); jn_piv(x, ex, X + w / 2, Y + h / 2); x.translate(0, (1 - ci.ui) * 24);
    card(x, X, Y, w, h, { u: ci.u, a: cl(ci.ui * 1.25) * ex.a, c: 38, tab: "check", tabU: pr(tv, tChk, tChk + 0.25) });
    if (ci.uc > 0) {
      cardClip(x, X, Y, w, h, ci.u);
      x.globalAlpha = ex.a * cl(ci.uc * 1.3); x.translate(0, (1 - ci.uc) * 10);
      fill(X + w - 40);
    }
    x.restore();
  }
  function jn_E(x, tv) {
    const K = jn_K.E;
    if (tv < Math.min(K.R, K.L)) return;
    // RIGHT · «الشرط الأول»: gauge sweeping to the apex, '50+' (metallic, the RED '+' carried over from D), 'Edge Score'
    jn_Ecard(x, tv, jn_x(tv, K.oR[0], K.oR[1]), 1380, K.R, K.chkR, (R) => {
      T(x, "الشرط الأول", R, 392, { w: 400, size: 36, color: GREY });
      sym(x, "gauge", 1454, 394, 84, { u: pr(tv, K.R + 0.12, K.sw0), k: { val: 0 } });
      jn_gaugeRed(x, 1454, 394, 84, 0.5 * e3(pr(tv, K.sw0, K.sw1)));
      const pw = jn_w(x, "plus110", "+", 200, 110);
      T(x, "+", R - pw, 530, { fam: LAT, w: 200, size: 110, color: RED });
      metal(x, "50", R - pw, 530, 110, { align: "right" });
      T(x, "Edge Score", R, 584, { fam: LAT, w: 300, size: 34, align: "right" });
    });
    // LEFT · «الشرط الثاني»: coins dropping, '$ 500' counting (full-size '$'), «في حساب التداول» rising
    jn_Ecard(x, tv, jn_x(tv, K.oL[0], K.oL[1]), 100, K.L, K.chkL, (R) => {
      T(x, "الشرط الثاني", R, 392, { w: 400, size: 36, color: GREY });
      sym(x, "coins", 174, 394, 84, { k: { drops: K.coins.map((c) => pr(tv, c, c + 0.3)) } });
      const un = pr(tv, K.n0, K.n1);
      if (un > 0) metal(x, "$" + Math.floor(500 * e4(un) + 1e-6), R, 530, 110, { align: "right", tab: tv < K.n1 + 0.15, relax: pr(tv, K.n1, K.n1 + 0.15) });
      const ul = expo(pr(tv, K.lab, K.lab + 0.42));
      if (ul > 0) T(x, "في حساب التداول", R, 584 + (1 - ul) * 18, { w: 400, size: 34, a: cl(ul * 1.4) });
    });
  }

  // ---------------------------------------------------------------- mini candle chart (fixed price range, scroll, breathing)
  // time runs left to right (also in RTL); o: data, n, from (fractional while scrolling), lo/hi, grow(i), newest, breathe
  function jn_chart(x, X, Y, w, h, o) {
    const D = o.data, n = o.n, pitch = w / n, bw = o.body ?? pitch * 0.5, from = o.from ?? 0, lo = o.lo, hi = o.hi;
    const yOf = (p) => Y + h - ((p - lo) / (hi - lo)) * h;
    x.save(); x.beginPath(); x.rect(X, Y - 30, w, h + 60); x.clip();
    for (let i = Math.max(0, Math.floor(from) - 1); i < Math.min(D.length, Math.floor(from) + n + 1); i++) {
      const cx = X + (i - from + 0.5) * pitch; if (cx < X - pitch || cx > X + w + pitch) continue;
      const g = o.grow ? o.grow(i) : 1; if (g <= 0) continue;
      const q = D[i], yc = yOf(q.c) + (i === o.newest ? o.breathe || 0 : 0);
      candle(x, cx, yOf(q.o), yc, Math.min(yOf(q.h), yc), Math.max(yOf(q.l), yc), bw, { grow: g, newest: i === o.newest });
    }
    x.restore();
    return yOf;
  }
  function jn_range(D, i0, i1) { let lo = 1, hi = 0; for (let i = i0; i <= Math.min(D.length - 1, i1); i++) { lo = Math.min(lo, D[i].l); hi = Math.max(hi, D[i].h); } const p = (hi - lo) * 0.1; return [lo - p, hi + p]; }
  // a framed chart: candles in page-7 corner triangles, the dotted price line at the last close
  function jn_frame(x, tv, X, Y, w, h, o) {
    const yOf = jn_chart(x, X, Y, w, h, o);
    corners(x, X, Y, w, h, { L: 18, u: pr(tv, o.t0, o.t0 + 0.45), u2: pr(tv, o.t0 + 0.45, o.t0 + 0.75), mid: yOf(o.data[Math.min(o.newest, o.data.length - 1)].c) });
  }

  // ---------------------------------------------------------------- F1 · Axi opens a second account (L3: x <= 780 only)
  // seeds picked offline for a clear rise with a few RED down candles (8: 2 down; 14: 4 down)
  const jn_SER1 = () => series(86, 12, 0.5, 0.09, 0.3), jn_SER2 = () => series(249, 24, 0.45, 0.09, 0.3);
  // during the exit the whole card stack is drawn opaque into one layer (x 100-820, y 200-800) and faded once, so the
  // trading card's top edge never shows through the allocation card
  const jn_EX0 = { a: 1, dy: 0, sc: 1 };
  async function jn_F1(x, tv) {
    const K = jn_K.F1;
    if (tv < K.back) return;
    const ex = jn_x(tv, K.o0, K.o1); if (ex.a <= 0.003) return;
    if (ex.a >= 1) return jn_F1s(x, tv, ex);
    const c = tmp("jn_f1", 720, 600);
    c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalAlpha = 1; c.x.globalCompositeOperation = "source-over"; c.x.clearRect(0, 0, 720, 600);
    c.x.save(); c.x.translate(-100, -200); await jn_F1s(c.x, tv, jn_EX0); c.x.restore();
    x.save(); jn_piv(x, ex, 460, 505); x.globalAlpha *= ex.a; x.drawImage(c, 100, 200); x.restore();
  }
  async function jn_F1s(x, tv, ex) {
    const K = jn_K.F1;
    // back: the user's TRADING card at alpha .7 (480x290 at 300,470; visible below the front card from y 560):
    // «حساب التداول» in grey over a live mini chart (8 candles in corner triangles, x 330-500, y 590-730)
    const ub = expo(pr(tv, K.back, K.back + 0.4)), ba = 0.7 * cl(ub * 1.3) * ex.a;
    x.save(); jn_piv(x, ex, 540, 615); x.translate(0, (1 - ub) * 16);
    card(x, 300, 470, 480, 290, { a: ba });
    x.globalAlpha = ba;
    T(x, "حساب التداول", 740, 615, { w: 400, size: 36, color: GREY });
    const D = jn_SER1(), [lo, hi] = jn_range(D, 0, 7);
    jn_frame(x, tv, 330, 590, 170, 140, { data: D, n: 8, lo, hi, newest: 7, t0: K.back + 0.1, breathe: 6 * Math.sin((tv - K.back) * 2 * Math.PI),
      grow: (i) => pr(tv, K.back + 0.2 + i * 0.04, K.back + 0.42 + i * 0.04) });
    x.restore();
    // front: the NEW allocation CARD slides out from behind the trading card (offset +40,+60 -> place, 0.5 s expo) and
    // grows under the wordmark, which rose 12 px into its top-left at «Axi» (h 40 at 176,286) and stays on top; NEW tab '+'
    const uf = pr(tv, K.front, K.front + 0.5), ef = expo(uf), FX = 140, FY = 250, FW = 560, FH = 310, fa = cl(ef * 1.6) * ex.a;
    x.save(); jn_piv(x, ex, FX + FW / 2, FY + FH / 2);
    if (uf > 0) {
      x.save(); x.translate((1 - ef) * 40, (1 - ef) * 60);
      card(x, FX, FY, FW, FH, { a: fa, tab: "new", tabU: pr(tv, K.tab, K.tab + 0.3) });
      x.restore();
    }
    const um = expo(pr(tv, K.mark, K.mark + 0.4));
    if (um > 0) { x.globalAlpha = ex.a; await axiMark(x, 176, 286 + (1 - um) * 12, 40, cl(um * 1.4)); }
    if (uf <= 0) { x.restore(); return; }
    x.translate((1 - ef) * 40, (1 - ef) * 60); x.globalAlpha = fa;
    // VAULT 88 px at x 176-264, y 446-534; spokes turn 90 degrees (0.6 s e4) and the hub pulses once, in the micro-pause
    // between «حساب» and «التخصيص» (26.13-26.21) so the click-turn cue sits in a word gap
    const ut = pr(tv, K.turn, K.turn + 0.6);
    sym(x, "vault", 220, 490, 88, { u: pr(tv, K.vault, K.vault + 0.5), k: { rot: (Math.PI / 2) * e4(ut), pulse: pr(tv, K.turn, K.turn + 0.4) } });
    // title: skeleton 372x44 at x 288-660, y 384-428 (#2A2B2F, r 8, shimmer band right -> left every 0.9 s), then
    // «حساب التخصيص» Alexandria 500 48 right-aligned at x 660, baseline 420
    const tz = jn_fit(x, "f1title", "حساب التخصيص", 500, 48, 372, 42);
    const sk = 1 - eio(pr(tv, K.title - 0.05, K.title + 0.25));
    if (sk > 0) {
      x.save(); x.globalAlpha = fa * sk * pr(tv, K.front + 0.2, K.front + 0.5);
      rr(x, 288, 384, 372, 44, 8); x.fillStyle = TRACK; x.fill(); x.clip();
      const ph = ((tv - K.front) / 0.9) % 1, bx = 660 + 60 - ph * (372 + 120);
      const g = x.createLinearGradient(bx - 60, 0, bx + 60, 0);
      g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, "rgba(255,255,255,0.10)"); g.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g; x.fillRect(bx - 60, 384, 120, 44); x.restore();
    }
    jn_head(x, ["حساب", "التخصيص"], 660, 420, tz, tv, K.title);
    const us = expo(pr(tv, K.sub, K.sub + 0.42));
    if (us > 0) T(x, "Allocation Account", 660, 470 + (1 - us) * 14, { fam: LAT, w: 300, size: 30, color: GREY, align: "right", a: cl(us * 1.4) });
    x.restore();
  }

  // ---------------------------------------------------------------- F2 · Axi funds the allocation account (VC WIDE)
  async function jn_F2(x, tv) {
    const K = jn_K.F2;
    if (tv < K.alloc) return;
    const ex = jn_x(tv, K.o0, K.o1); if (ex.a <= 0.003) return;
    // floor: card reflections outside the pool (additive, plate space), entering with their cards and leaving with the exit
    spill(x, [
      { u: -2.75, v: -0.6, rx: 1.1, color: RED, a: 0.12 * e2(pr(tv, K.spR, K.spR + 0.5)) * ex.a },
      { u: 2.75, v: -0.6, rx: 1.1, color: WHITE, a: 0.1 * e2(pr(tv, K.spW, K.spW + 0.5)) * ex.a },
    ]);
    // static dotted link above his head, drawn right -> left from the trading card's inner edge (1260,400) to the
    // allocation card's (660,400); 3 px dots every 10 px, white .25 (70 px above the WIDE keep-out)
    const ul = expo(pr(tv, K.link, K.link + 0.45));
    if (ul > 0) {
      x.save(); x.globalAlpha = ex.a; x.strokeStyle = "rgba(255,255,255,0.25)"; x.lineWidth = 3; x.lineCap = "round"; x.setLineDash([0, 10]);
      x.beginPath(); x.moveTo(1260, 400); x.lineTo(lerp(1260, 660, ul), 400); x.stroke(); x.restore();
    }
    // LEFT · ALLOCATION card 480x300 at 180,250 (it leads: the VO names it)
    const ca = jn_cin(tv, K.alloc);
    x.save(); jn_piv(x, ex, 420, 400); x.translate(0, (1 - ca.ui) * 24);
    card(x, 180, 250, 480, 300, { u: ca.u, a: cl(ca.ui * 1.25) * ex.a });
    if (ca.uc > 0) {
      x.save(); cardClip(x, 180, 250, 480, 300, ca.u); x.globalAlpha = ex.a * cl(ca.uc * 1.3);
      const uf = e4(pr(tv, K.fill0, K.fill1));
      sym(x, "vault", 244, 314, 64, { u: pr(tv, K.alloc + 0.12, K.alloc + 0.62), k: { rot: ((2 * Math.PI) / 3) * uf } });
      jn_head(x, ["حساب", "التخصيص"], 628, 322, jn_fit(x, "f2title", "حساب التخصيص", 500, 42, 325, 38), tv, K.alloc + 0.12);
      const us = expo(pr(tv, K.alloc + 0.3, K.alloc + 0.72));
      if (us > 0) T(x, "مخصّص للمبلغ التمويلي", 628, 396 + (1 - us) * 14, { w: 400, size: jn_fit(x, "f2sub", "مخصّص للمبلغ التمويلي", 400, 34, 380, 34), color: GREY, a: cl(us * 1.4) });
      // TAG-shaped funding track 416x22 at 212,470: draws in right -> left, then fills right -> left (metallic, quartOut)
      const uk = pr(tv, K.track, K.track + 0.45);
      if (uk > 0) {
        x.save(); x.beginPath(); x.rect(628 - 418 * expo(uk), 460, 420, 42); x.clip();
        tagPath(x, 212, 470, 416, 22); x.fillStyle = TRACK; x.fill(); x.lineWidth = 1.5; x.strokeStyle = "rgba(255,255,255,0.16)"; x.stroke();
        if (uf > 0) {
          x.save(); tagPath(x, 212, 470, 416, 22); x.clip();
          const g = x.createLinearGradient(212, 0, 628, 0); // the brand's metallic ramp, brightest at the far (full) end
          g.addColorStop(0, "#F0F0F1"); g.addColorStop(0.5, "#B4B5B9"); g.addColorStop(1, "#4C4E54");
          x.fillStyle = g; x.fillRect(628 - 416 * uf, 470, 416 * uf, 22); x.restore();
        }
        x.restore();
      }
      x.restore();
    }
    x.restore();
    // RIGHT · TRADING card 480x300 at 1260,250, alpha .8: candles icon, title, «حسابك», 10 candles in corner triangles, live
    const ct = jn_cin(tv, K.trade);
    if (ct.u > 0) {
      x.save(); jn_piv(x, ex, 1500, 400); x.translate(0, (1 - ct.ui) * 24);
      const ta = 0.8 * ex.a;
      card(x, 1260, 250, 480, 300, { u: ct.u, a: cl(ct.ui * 1.25) * ta });
      if (ct.uc > 0) {
        x.save(); cardClip(x, 1260, 250, 480, 300, ct.u); x.globalAlpha = ta * cl(ct.uc * 1.3);
        sym(x, "candles", 1320, 310, 56, { u: pr(tv, K.trade + 0.12, K.trade + 0.62) });
        T(x, "حساب التداول", 1708, 322, { w: 500, size: jn_fit(x, "f2title", "حساب التخصيص", 500, 42, 325, 38) });
        T(x, "حسابك", 1708, 372, { w: 400, size: 34, color: GREY });
        const D = jn_SER2(), [lo, hi] = jn_range(D, 0, 14), s = (tv - K.live) / 0.6;
        let from = 0, newest = 9, gN = 1;
        if (s >= 0) { const k = Math.floor(s), lt = (s - k) * 0.6; from = k + e4(pr(lt, 0, 0.2)); newest = 10 + k; gN = pr(lt, 0, 0.22); }
        jn_frame(x, tv, 1292, 405, 416, 120, {
          data: D, n: 10, from, lo, hi, newest, t0: K.chart - 0.05, breathe: tv > K.chart + 0.5 ? 6 * Math.sin((tv - K.chart - 0.5) * 2 * Math.PI) : 0,
          grow: (i) => (i < 10 ? pr(tv, K.chart + i * 0.03, K.chart + 0.22 + i * 0.03) : i === newest ? gN : 1),
        });
        x.restore();
      }
      x.restore();
    }
    // the axi wordmark rises above the allocation card (h 52, x 370-470, y 170-222); one sheen on «شركة»
    const um = expo(pr(tv, K.mark, K.mark + 0.42));
    if (um > 0) {
      const img = await im("axi_part_white.png"), mh = 52, mw = (mh * LOGO.axiW) / LOGO.h, MX = 420 - mw / 2, MY = 170 + (1 - um) * 16;
      x.save(); jn_piv(x, ex, 420, 196); x.globalAlpha = ex.a * cl(um * 1.4);
      const us = pr(tv, K.sheen, K.sheen + 0.5);
      if (us > 0 && us < 1) withSheen(x, MX, MY, mw, mh, us, (c) => c.drawImage(img, MX, MY, mw, mh));
      else x.drawImage(img, MX, MY, mw, mh);
      x.restore();
    }
    // FUNDING POUR: 36 red ◢ (9 px) fall from under the wordmark (y 222) into the card top (y 250), 0.03 s stagger, in2
    // 0.35 s each, vanishing on contact
    if (tv >= K.pour) {
      x.save(); x.fillStyle = RED;
      for (let i = 0; i < 36; i++) {
        const k = pr(tv, K.pour + i * 0.03, K.pour + i * 0.03 + 0.35); if (k <= 0 || k >= 1) continue;
        const px = 420 + (hash(i, 7, 31) - 0.5) * 84 - 4.5, py = 222 + (250 - 9 - 222) * in2(k);
        x.globalAlpha = ex.a * (1 - e2(pr(k, 0.7, 1)));
        x.beginPath(); x.moveTo(px + 9, py); x.lineTo(px + 9, py + 9); x.lineTo(px, py + 9); x.closePath(); x.fill();
      }
      x.restore();
    }
  }

  // ---------------------------------------------------------------- G · «مبروك!» in the L2 corner slot (x 100-650, y 140-500)
  function jn_G(x, tv) {
    const K = jn_K.G;
    if (tv < K.word) return;
    const ex = jn_x(tv, K.o0, K.o1); if (ex.a <= 0.003) return;
    x.save(); x.beginPath(); x.rect(100, 140, 550, 360); x.clip(); // safety only: the burst radius keeps inside the slot
    jn_piv(x, ex, 440, 340); x.globalAlpha = ex.a;
    // burst: 16 brand particles (10 red ◢ 10 px, 6 white ▲ 12 px, alpha .6) radiating from behind the word to r 150
    const kb = pr(tv, K.burst, K.burst + 0.6);
    if (kb > 0 && kb < 1) {
      for (let i = 0; i < 16; i++) {
        const white = [1, 4, 6].includes(i % 8), an = (i / 16) * Math.PI * 2 + (hash(i, 3, 5) - 0.5) * 0.35;
        const r = 150 * (0.6 + 0.4 * hash(i, 4, 6)) * e4(kb), px = 430 + Math.cos(an) * r, py = 300 + Math.sin(an) * r;
        x.save(); x.translate(px, py); x.rotate((hash(i, 5, 7) < 0.5 ? -1 : 1) * (2 + 3 * hash(i, 8, 9)) * e2(kb) + an);
        x.globalAlpha = ex.a * 0.6 * (1 - e2(pr(kb, 0.3, 1))); x.fillStyle = white ? WHITE : RED; x.beginPath();
        if (white) { x.moveTo(0, -6); x.lineTo(6, 6); x.lineTo(-6, 6); } else { x.moveTo(5, -5); x.lineTo(5, 5); x.lineTo(-5, 5); }
        x.closePath(); x.fill(); x.restore();
      }
    }
    // «مبروك!» Alexandria 600 84, right-aligned at x 580, baseline 330 (16 px rise); the scene's one flag (h 29 = .35 em,
    // gap .5 em, top on the alef line: x 622-644, y 262-291) unfurls at its right
    const uw = expo(pr(tv, K.word, K.word + 0.32));
    T(x, "مبروك!", 580, 330 + (1 - uw) * 16, { w: 600, size: 84, a: cl(uw * 1.4) });
    flag(x, 622, 262, 29, { mirror: true, u: pr(tv, K.word + 0.05, K.word + 0.27) });
    // DARK stage pill 360x64 at 260,372 (#303133): a RED circle (d 50, centre 589,404) holding '01', then «المرحلة الأولى»
    const up = expo(pr(tv, K.pill, K.pill + 0.36));
    if (up > 0) {
      const PX = 260, PY = 372;
      x.save(); x.beginPath(); x.rect(620 - 362 * up, PY - 4, 366, 72); x.clip();
      pill(x, PX, PY, 360, 64, null, { kind: "dark", a: cl(up * 1.3) });
      x.restore();
      const uc = pr(tv, K.pill + 0.04, K.pill + 0.34), ul = expo(pr(tv, K.pill + 0.1, K.pill + 0.46));
      if (uc > 0) {
        x.save(); x.translate(589, 404); x.scale(back(uc, 1.4), back(uc, 1.4));
        x.fillStyle = RED; x.beginPath(); x.arc(0, 0, 25, 0, Math.PI * 2); x.fill();
        T(x, "01", 0, 8.7, { fam: LAT, w: 500, size: 24, align: "center", a: cl(uc * 2) });
        x.restore();
      }
      if (ul > 0) {
        x.save(); x.beginPath(); x.rect(552 - (552 - 270) * ul, 342, (552 - 270) * ul + 6, 124); x.clip(); // to baseline + 1.5 em
        T(x, "المرحلة الأولى", 552, 416, { w: 400, size: 34, a: cl(ul * 1.4) });
        x.restore();
      }
    }
    x.restore();
  }

  GROUPS.push({
    name: "join",
    floor(t, sh, S) {
      const s = S.shot; if (!s || !s.k_vcam) return;
      const tv = t - P, K = jn_K.D;
      if (tv < 14.88 || tv >= 18.5) return;
      fRipple(sh, t, v(K.rip));
      // steady red pool (R 1.2 m, .14) under the stool, a small boost on the landing; both leave with the exit
      const out = 1 - eio(pr(tv, K.o0, K.o1));
      const a = (0.14 * e2(pr(tv, K.pool, K.pool + 0.4)) + 0.08 * Math.sin(Math.PI * pr(tv, K.c1, K.c1 + 0.35))) * out;
      if (a > 0.003) sh.push(fPool(a, RED, 1.2));
    },
    async draw(x, t, S) {
      const tv = t - P;
      if (tv < 14.88 || tv >= 33.4) return;
      const s = S.shot || {}, vc = !!s.k_vcam, clip = s.clip;
      if (vc && tv < 18.5) jn_D(x, tv);
      else if (clip === "L5" && tv < 22.62) jn_E(x, tv);
      else if (clip === "L3" && tv < 27.0) await jn_F1(x, tv);
      else if (vc && tv >= 27.0 && tv < 31.92) await jn_F2(x, tv);
      else if (clip === "L2" && tv >= 31.92) jn_G(x, tv);
    },
  });
