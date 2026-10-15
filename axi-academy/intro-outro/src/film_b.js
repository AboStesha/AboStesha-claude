// STYLE B — «Market»: the candle inside the nib is a real market candle.
// A live candlestick chart races up on a dark screen; the camera whip-zooms into the newest candle; the two halves
// of the nib slam shut around it and the candle becomes the cut-out; the market "rises" the light background,
// the red tip launches up like a price arrow, the bars lock in and the wordmark slides out from behind the nib.
(function () {
  const { clamp, lerp, inv, smooth, expoInOut, cubicInOut, backOut, spring, eo, co, cio, qo, rng, shake } = K;
  const { NIB, TRI, BARS, AXI, ACAD, AX, YT, YB, LK, SC, CX, CY } = K;
  const WHITE = K.WHITE, RED = K.RED;
  const S = LK.slot;

  // ---- timeline ----
  const T_C0 = 0.04, DT_C = 0.06, N = 25, PRE = 10, T_ZOOM = 0.94, T_SHUT = 1.50, T_TIP = 1.58, T_BAR = 1.84, T_WORD = 2.0, T_SWEEP = 3.0, T_END = 3.95;

  // ---- chart (lockup space): the last candle is exactly the slot candle ----
  const SP = 78, BW = S.body_hw * 2, WW = S.hw * 2;
  const C = (() => {
    const r = rng(5), out = [];
    out[N - 1] = { o: S.body_y1, c: S.body_y0, h: YT, l: S.cap_cy + S.hw, up: true };
    for (let i = N - 2; i >= 0; i--) {
      const nx = out[i + 1], up = r() < 0.7, body = 22 + r() * 64;
      const c = nx.o + (r() - 0.5) * 14, o = up ? c + body : c - body;
      out[i] = { o, c, h: Math.min(o, c) - 6 - r() * 26, l: Math.max(o, c) + 6 + r() * 26, up };
    }
    out.forEach((k, i) => { k.x = AX - (N - 1 - i) * SP; k.t = T_C0 + (i - PRE) * DT_C; });
    return out;
  })();
  const closeAt = (fi) => { const i = clamp(Math.floor(fi), 0, N - 1), j = Math.min(N - 1, i + 1), f = clamp(fi - i); return lerp((C[i].o + C[i].c) / 2, (C[j].o + C[j].c) / 2, f * f * (3 - 2 * f)); };
  function chartCam(t) {
    const fi = clamp(PRE + (t - T_C0) / DT_C, 0, N - 1);
    let fy = 0; const w = [0.15, 0.2, 0.3, 0.2, 0.15]; [-2, -1, 0, 1, 2].forEach((d, k) => { fy += w[k] * closeAt(fi - 1.5 + d * 0.8); });
    const fx = AX - (N - 1 - fi) * SP, s = lerp(0.62, 0.78, smooth(t / T_ZOOM));
    const sx = 1270, sy = 560;  // where the frontier sits on screen
    return { s, fx, fy, x: sx - ((fx - CX) * SC + 960), y: sy - ((fy - CY) * SC + 540), r: -0.07 + 0.03 * smooth(t / T_ZOOM) };
  }
  const FINAL = { s: 1, fx: AX, fy: (S.body_y0 + S.body_y1) / 2, x: 0, y: 0 };
  function camera(t) {
    if (t <= T_ZOOM) return chartCam(t);
    const a = chartCam(T_ZOOM), u = expoInOut(inv(T_ZOOM, T_ZOOM + 0.36, t));
    const s = Math.exp(lerp(Math.log(a.s), Math.log(FINAL.s), u));
    const cam = { s, fx: lerp(a.fx, FINAL.fx, u), fy: lerp(a.fy, FINAL.fy, u), x: lerp(a.x, 0, u), y: lerp(a.y, 0, u), r: lerp(a.r, 0, u) };
    const [hx, hy] = shake(t, [T_SHUT, T_TIP + 0.22], 11, 0.12, 4);
    cam.x += hx; cam.y += hy;
    if (t > T_SHUT) cam.s *= 1 + 0.035 * Math.exp(-(t - T_SHUT) / 0.09) * Math.sin((t - T_SHUT) * 40);  // punch
    return cam;
  }

  function candle(ctx, k, t, col, alpha) {
    const u = eo(t, k.t, 0.16); if (u <= 0) return;
    const top = Math.min(k.o, k.c), bot = Math.max(k.o, k.c), grow = lerp(k.o, k.c, u);
    const y0 = k.up ? grow : k.o, y1 = k.up ? k.o : grow;
    const w = co(t, k.t + 0.03, 0.14);
    ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = col;
    const mid = (top + bot) / 2, ht = lerp(mid, k.h, w), hb = lerp(mid, k.l, w), ww = WW * 0.55;
    if (w > 0) ctx.fillRect(k.x - ww / 2, ht, ww, hb - ht);
    ctx.beginPath(); ctx.roundRect(k.x - BW / 2, Math.min(y0, y1), BW, Math.max(2, Math.abs(y1 - y0)), 6); ctx.fill();
    ctx.restore();
  }
  function slotCandle(ctx, col) {  // the last candle in the logo's exact shape (body + wicks)
    ctx.fillStyle = col; ctx.fill(K.SLOT);
  }

  // ---- impact debris ----
  const BITS = (() => { const r = rng(21), o = []; for (let i = 0; i < 26; i++) { const a = r() * Math.PI * 2; o.push({ a, v: 500 + r() * 1100, w: 4 + r() * 10, h: 2 + r() * 3, life: 0.25 + r() * 0.3, red: r() < 0.25 }); } return o; })();

  // ---- word slide-outs from behind the nib ----
  const CLIP_L = AX - 116, CLIP_R = AX + 116;
  // each word slides out as one unit (small per-letter lag keeps the order, so letters never cross)
  const AXI_START = CLIP_L + 12 - AXI[0].box[0], ACAD_START = CLIP_R - 12 - ACAD[ACAD.length - 1].box[2];
  function axiOffset(i, t) { const t0 = T_WORD + i * 0.03, u = K.quintOut(inv(t0, t0 + 0.62, t)); return lerp(AXI_START, 0, u); }
  function acadOffset(i, t) { const t0 = T_WORD + 0.04 + (ACAD.length - 1 - i) * 0.025, u = K.quintOut(inv(t0, t0 + 0.62, t)); return lerp(ACAD_START, 0, u); }

  function scene(ctx, t, sil) {
    const col = (c) => (sil ? '#000' : c);
    const shut = t >= T_SHUT;
    // chart (before the shut)
    if (!sil && t < T_SHUT + 0.25) {
      const fade = 1 - inv(T_ZOOM + 0.1, T_SHUT, t);
      if (fade > 0) {
        // faint grid
        ctx.save(); ctx.globalAlpha *= 0.09 * fade; ctx.strokeStyle = WHITE; ctx.lineWidth = 1.4;
        for (let y = -400; y < 1700; y += 90) { ctx.beginPath(); ctx.moveTo(-2200, y); ctx.lineTo(1300, y); ctx.stroke(); }
        ctx.restore();
        for (let i = 0; i < N - 1; i++) candle(ctx, C[i], t, C[i].up ? WHITE : RED, 0.9 * fade);
        // trend line through the closes with a bright head
        const fi = clamp(PRE + (t - T_C0) / DT_C, 0, N - 1);
        ctx.save(); ctx.globalAlpha *= 0.55 * fade; ctx.strokeStyle = WHITE; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.beginPath();
        for (let x = 0; x <= fi; x += 0.25) { const px = AX - (N - 1 - x) * SP, py = closeAt(x) - 90; x ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
        ctx.stroke(); ctx.restore();
        const hx = AX - (N - 1 - fi) * SP, hy = closeAt(fi) - 90;
        ctx.save(); ctx.globalAlpha *= fade; ctx.fillStyle = WHITE; ctx.shadowColor = 'rgba(255,255,255,0.9)'; ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(hx, hy, 7, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    }
    // the hero candle (last) until the nib shuts around it
    if (!shut && t >= C[N - 1].t) {
      const u = eo(t, C[N - 1].t, 0.18);
      ctx.save(); ctx.translate(AX, S.body_y1); ctx.scale(1, Math.max(0.02, u)); ctx.translate(-AX, -S.body_y1); slotCandle(ctx, col(WHITE)); ctx.restore();
    }
    // nib halves slam in
    const uh = K.expoOut(inv(T_SHUT - 0.3, T_SHUT, t));
    if (uh > 0) {
      const off = lerp(1100, 0, uh);
      [[-1, -off], [1, off]].forEach(([side, dx]) => {
        ctx.save(); K.clipRect(ctx, side < 0 ? -3000 : AX, -3000, side < 0 ? AX : 5000, 5000);
        ctx.translate(dx, 0); ctx.fillStyle = col(WHITE); ctx.fill(NIB); ctx.restore();
      });
    }
    // tip launches up like a price arrow and lands on the nib
    if (t >= T_TIP) {
      const sp = spring(t - T_TIP, 2.4, 0.38), dy = lerp(560, 0, sp);
      const st = 1 + 0.9 * Math.max(0, 1 - (t - T_TIP) / 0.2);
      ctx.save(); ctx.translate(AX, YT + dy); ctx.scale(1 / Math.sqrt(st), st); ctx.translate(-AX, -YT); ctx.fillStyle = col(RED); ctx.fill(TRI); ctx.restore();
    }
    // bars lock in from the sides
    LK.bars.forEach((b, i) => {
      const t0 = T_BAR + i * 0.08, u = K.expoOut(inv(t0, t0 + 0.34, t)); if (u <= 0) return;
      const dx = lerp(i ? 900 : -900, 0, u);
      ctx.save(); ctx.translate(dx, 0); ctx.fillStyle = col(WHITE); ctx.fill(BARS[i]); ctx.restore();
    });
    // wordmark slides out from behind the nib
    ctx.save(); K.clipRect(ctx, -3000, -3000, CLIP_L, 5000);
    for (let i = 0; i < 3; i++) { if (t < T_WORD) continue; ctx.save(); ctx.translate(axiOffset(i, t), 0); K.fillAxi(ctx, i, col(WHITE)); ctx.restore(); }
    ctx.restore();
    ctx.save(); K.clipRect(ctx, CLIP_R, -3000, 5000, 5000);
    ACAD.forEach((L, i) => { if (t < T_WORD) return; ctx.save(); ctx.translate(acadOffset(i, t), 0); K.fillAcad(ctx, i, 1, col(WHITE)); ctx.restore(); });
    ctx.restore();
    // impact debris
    if (!sil && t >= T_SHUT && t < T_SHUT + 0.6) {
      const dt = t - T_SHUT, cy = (S.body_y0 + S.body_y1) / 2;
      BITS.forEach((b) => {
        if (dt > b.life) return; const d = b.v * dt * (1 - 0.45 * dt / b.life), x = AX + Math.cos(b.a) * (120 + d), y = cy + Math.sin(b.a) * (90 + d * 0.7);
        ctx.save(); ctx.globalAlpha *= 1 - dt / b.life; ctx.translate(x, y); ctx.rotate(b.a); ctx.fillStyle = b.red ? RED : WHITE; ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); ctx.restore();
      });
    }
  }

  window.FILM = {
    duration: 5,
    blur(t) {
      if (t < T_ZOOM) return 6;
      if (t < T_SHUT + 0.3) return 14;
      if (t < 2.0) return 10;
      if (t < 2.75) return 16;
      if (t < 3.3) return 4;
      if (t < T_END) return 2;
      return 1;
    },
    draw(ctx, t) {
      // background: dark trading screen → the brand gradient rises from the bottom at the shut
      K.vgrad(ctx, '#1B1D20', '#0B0D0D');
      const ub = K.expoOut(inv(T_SHUT, T_SHUT + 0.42, t));
      if (ub > 0) {
        const edge = lerp(K.H + 40, -60, ub);
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(0, edge, K.W, K.H - edge + 10); ctx.clip(); K.bg(ctx); ctx.restore();
        if (ub < 1) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 0.8 * (1 - ub); ctx.fillStyle = WHITE; ctx.fillRect(0, edge - 2, K.W, 3); ctx.restore(); }
      }
      // a soft light passes behind the finished lockup (background only)
      const us = inv(T_SWEEP, T_SWEEP + 0.85, t);
      if (us > 0 && us < 1) {
        const x = lerp(-300, K.W + 300, cubicInOut(us)), g = ctx.createLinearGradient(x - 320, 0, x + 320, 0);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 0.2 * Math.sin(Math.PI * us); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(0, 0, K.W, K.H); ctx.restore();
      }
      const cam = camera(t), m = K.stage(ctx, cam);
      const k = smooth(inv(T_SHUT, 3.0, t));
      if (k > 0) K.shadow(ctx, m, (c) => scene(c, t, true), k);
      K.stage(ctx, cam);
      scene(ctx, t, false);
      // flash at the shut
      const fl = Math.exp(-Math.max(0, t - T_SHUT) / 0.06) * (t >= T_SHUT ? 1 : 0);
      if (fl > 0.01) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 0.55 * fl; ctx.fillStyle = WHITE; ctx.fillRect(0, 0, K.W, K.H); ctx.restore(); }
      K.grain(ctx, t, t < T_SHUT ? 0.06 : 0.035, t >= T_END);
    },
  };
})();
