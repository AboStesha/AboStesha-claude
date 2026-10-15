// Version B — SaaS UI «مقعدك محجوز». 1080x1920, 60 fps, 15 s. Music: Mixkit 201 from 38.56 s (drop at 1.40 s, 120 BPM).
(function (G) {
  const K = G.K;
  const { W, H, C, clamp, lerp, inv, eo, ei, eio, co, cio, spring, sp, expoOut, cubicOut, backOut, hexA, mix, shake, rng, hash,
    ar, arW, lat, latW, mixLine, arUnits, logo, logoW, xmark, disc, ring, vgrad, fill, ripple, sparks, wheels, riskStrip, watermark, rr } = K;
  const SPB = 0.5, B = (k) => 1.40 + k * SPB;
  const CX = W / 2, CY = H / 2;
  const T = { drop: B(0), enter: B(3), bloom: B(4), click: B(5), count: B(6), card: B(10), words: B(14), seat: B(18), sting: 11.1, end: 12.0 };
  const flash = (ctx, t, t0, color, d = 0.05) => { const x = t - t0; if (x >= 0 && x < d) fill(ctx, color, 1 - x / d); };
  const night = (ctx) => vgrad(ctx, '#121317', '#07080A');
  const GLASS = 'rgba(20,22,26,0.78)';
  function glass(ctx, x, y, w, h, r, o = {}) {
    ctx.save(); rr(ctx, x, y, w, h, r); ctx.fillStyle = o.fill || GLASS; ctx.fill();
    ctx.lineWidth = o.lw || 1.5; ctx.strokeStyle = o.stroke || 'rgba(255,255,255,0.22)'; ctx.stroke();
    if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = o.blur || 40; ctx.strokeStyle = o.glow; ctx.lineWidth = 2.5; rr(ctx, x, y, w, h, r); ctx.stroke(); }
    ctx.restore();
  }
  function cursor(ctx, x, y, s = 1, press = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 - 0.12 * press), s * (1 - 0.12 * press));
    ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 46); ctx.lineTo(11, 35); ctx.lineTo(19, 53); ctx.lineTo(27, 49); ctx.lineTo(19, 32); ctx.lineTo(34, 32); ctx.closePath();
    ctx.fillStyle = C.white; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.lineWidth = 2.4; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore();
  }
  // dotted globe (fibonacci lattice), light-slate dots, front hemisphere only
  const GLOBE = (() => { const n = 1500, pts = []; const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) { const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = ga * i; pts.push([Math.cos(th) * r, y, Math.sin(th) * r]); } return pts; })();
  function globe(ctx, cx, cy, R, rot, a = 1) {
    const tilt = 0.42, ct = Math.cos(tilt), st = Math.sin(tilt), cr = Math.cos(rot), sr = Math.sin(rot);
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = C.mist;
    for (const [x, y, z] of GLOBE) {
      const x1 = x * cr + z * sr, z1 = -x * sr + z * cr; const y2 = y * ct - z1 * st, z2 = y * st + z1 * ct;
      if (z2 < 0) continue; const px = cx + x1 * R, py = cy - y2 * R; if (py > H + 10 || py < -10) continue;
      ctx.globalAlpha = a * (0.26 + 0.74 * z2); ctx.beginPath(); ctx.arc(px, py, 1.8 + 2.8 * z2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  // perspective-tilted card: draws `src` canvas (w x h) as a rotated plane in 40 strips
  function tilted(ctx, src, cx, cy, rx, ry, P = 1800, a = 1, sc = 1) {
    const w = src.width, h = src.height, N = 40; const cy_ = Math.cos(ry), sy_ = Math.sin(ry), cx_ = Math.cos(rx), sx_ = Math.sin(rx);
    const proj = (x, y) => { const X = x * cy_, Z = -x * sy_; const Y = y * cx_ - Z * sx_, Z2 = y * sx_ + Z * cx_; const s = P / (P + Z2) * sc; return [cx + X * s, cy + Y * s]; };
    ctx.save(); ctx.globalAlpha *= a;
    for (let i = 0; i < N; i++) {
      const sx0 = (i / N) * w, sw = w / N; const x0 = sx0 - w / 2;
      const tl = proj(x0, -h / 2), tr = proj(x0 + sw, -h / 2), bl = proj(x0, h / 2);
      ctx.setTransform((tr[0] - tl[0]) / sw, (tr[1] - tl[1]) / sw, (bl[0] - tl[0]) / h, (bl[1] - tl[1]) / h, tl[0], tl[1]);
      ctx.drawImage(src, sx0, 0, sw + 1, h, 0, 0, sw + 1, h);
    }
    ctx.restore();
  }
  let CARD = null; const cardCanvas = () => { if (!CARD) { CARD = document.createElement('canvas'); CARD.width = 900; CARD.height = 780; } return CARD; };

  // ---------------------------------------------------------------- o01 brand open -> red caret
  function s01(ctx, t) {
    vgrad(ctx, '#EEF0F1', '#607880');
    const pa = sp(t, 0.12, 2.4, 0.6), pb = sp(t, 0.30, 2.4, 0.6);
    const shrink = 1 - eio(t, 1.0, 0.26);
    if (shrink > 0.01) { ctx.save(); ctx.translate(CX, CY); ctx.scale((0.92 + 0.08 * pa) * shrink, (0.92 + 0.08 * pa) * shrink); ctx.translate(-CX, -CY); const h = 320; logo(ctx, CX - logoW(h) / 2, CY - h / 2, h, C.white, { axi: pa, iraq: pb }); ctx.restore(); }
    // night falls from the top
    const nf = eio(t, 0.92, 0.36); if (nf > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H * nf); ctx.clip(); night(ctx); ctx.restore(); }
    // the logo becomes the red caret
    const ca = eo(t, 1.16, 0.12); if (ca > 0) { ctx.save(); ctx.fillStyle = C.red; const hh = 74 * ca; ctx.fillRect(CX - 3, CY - hh / 2, 6, hh); ctx.restore(); }
  }

  // ---------------------------------------------------------------- o02 command bar, the question types, Enter -> streak -> bloom
  const Q = 'كيف أتعلّم التداول من الصفر؟';
  const QCH = [...Q];
  function bar(ctx, t, x, y, w, h, o = {}) {
    glass(ctx, x, y, w, h, h / 2, { glow: o.glow ? hexA(C.red, 0.55 * o.glow) : null });
    // magnifier at the right (RTL)
    ctx.save(); ctx.strokeStyle = hexA(C.mist, 0.9); ctx.lineWidth = 4; const mx = x + w - 66, my = y + h / 2 - 4;
    ctx.beginPath(); ctx.arc(mx, my, 15, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(mx - 11, my + 11); ctx.lineTo(mx - 22, my + 22); ctx.stroke(); ctx.restore();
  }
  function s02(ctx, t) {
    night(ctx);
    const t0 = T.drop, te = T.enter;
    const dolly = 1 + 0.09 * cio(t, t0 + 0.3, te - t0 - 0.3);
    ctx.save(); ctx.translate(CX, CY - 40); ctx.scale(dolly, dolly); ctx.translate(-CX, -(CY - 40));
    const grow = sp(t, t0 - 0.02, 2.6, 0.55);
    const bw = 920 * grow, bh = 140, bx = CX - bw / 2, by = CY - bh / 2 - 40;
    const squash = eio(t, te + 0.05, 0.3);
    if (bw > 10) {
      ctx.save(); ctx.globalAlpha *= 1 - squash; bar(ctx, t, bx, by, bw, bh, { glow: Math.exp(-Math.max(0, t - te) / 0.12) * (t >= te ? 1 : 0) }); ctx.restore();
    }
    // typed text
    const n = Math.floor(clamp(inv(t0 + 0.08, te - 0.12, t)) * QCH.length + 1e-6);
    const s = QCH.slice(0, n).join(''); const right = CX + 920 / 2 - 110; const size = 58;
    const tw = s ? arW(ctx, s, { size, w: 500 }) : 0;
    if (squash < 1) {
      ctx.save(); ctx.translate(right - tw / 2, by + bh / 2); ctx.scale(1 + 0.3 * squash, 1 - 0.97 * squash);
      if (!s && grow > 0.7) ar(ctx, 'اسأل أي سؤال…', 0 + tw / 2 - arW(ctx, 'اسأل أي سؤال…', { size, w: 300 }) / 2, 20, { size, w: 300, color: hexA(C.white, 0.35) });
      if (s) ar(ctx, s, 0, 20, { size, w: 500, color: mix(C.white, C.red, squash) });
      ctx.restore();
      const blink = t > te - 0.1 || t < t0 + 0.08 ? (Math.floor(t / 0.25) % 2 ? 0 : 1) : 1;
      if (grow > 0.5 && squash < 0.3) { ctx.save(); ctx.fillStyle = C.red; ctx.globalAlpha = blink * (1 - squash * 3); ctx.fillRect(right - tw - 12, by + bh / 2 - 32, 5, 64); ctx.restore(); }
    }
    // streak + bloom
    if (squash > 0) {
      const sw = lerp(tw, 980, eio(t, te + 0.2, 0.25)) * (1 - ei(t, T.bloom - 0.12, 0.12)); const sh = 6 + 10 * Math.exp(-Math.max(0, t - te - 0.3) / 0.1);
      ctx.save(); ctx.shadowColor = C.red; ctx.shadowBlur = 40; ctx.fillStyle = C.red; ctx.fillRect(CX - sw / 2, by + bh / 2 - sh / 2, sw, sh); ctx.restore();
    }
    // tiny UI labels
    ar(ctx, 'ابحث في أكاديمية آكسي', CX + 920 / 2 - 30, by - 36, { size: 30, w: 400, color: hexA(C.mist, 0.75), align: 'right', alpha: eo(t, t0 + 0.1, 0.3) * (1 - squash) });
    ctx.restore();
  }

  // ---------------------------------------------------------------- o03 + o04 the answer pill, click, globe, counter 0 -> 1000
  function pill(ctx, x, y, s, press, glow, t) {
    const w = 760, h = 132; ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 - 0.04 * press), s * (1 - 0.04 * press));
    glass(ctx, -w / 2, -h / 2, w, h, h / 2, { fill: 'rgba(24,26,31,0.92)', stroke: 'rgba(255,255,255,0.28)', glow: glow > 0.01 ? hexA(C.red, 0.7 * glow) : null, blur: 50 });
    const lh = 60; logo(ctx, w / 2 - 50 - logoW(lh), -lh / 2, lh, C.white);
    ar(ctx, 'أكاديمية آكسي', w / 2 - 70 - logoW(lh) - 18, 16, { size: 48, w: 700, color: C.white, align: 'right' });
    lat(ctx, '·', -40, 14, { size: 48, w: 700, color: hexA(C.white, 0.5) });
    ar(ctx, 'قريباً', -w / 2 + 160, 15, { size: 44, w: 500, color: C.mist, align: 'center' });
    disc(ctx, -w / 2 + 72, -1, 9, C.red, Math.floor(t / 0.25) % 2 ? 0.35 : 1);
    ctx.restore();
  }
  function s03(ctx, t) {
    night(ctx);
    const tb = T.bloom, tc = T.click, tn = T.count;
    // globe rises
    const gr = eio(t, tc + 0.05, 0.6);
    globe(ctx, CX, lerp(2700, 2150, gr), 860, t * 0.22, gr);
    // pings on the globe
    for (let i = 0; i < 6; i++) { const ph = (t * 0.9 + i * 0.37) % 1.6; const px = CX + (hash(i) - 0.5) * 900, py = 1500 + hash(i + 9) * 220; if (gr > 0.5) ring(ctx, px, py, 6 + ph * 40, 2, C.red, (1 - ph / 1.6) * 0.5 * gr); }
    // pill: from bloom to centre, then rises for the counter
    const ps = sp(t, tb, 2.8, 0.5); const rise = eio(t, tn, 0.45);
    const px = CX, py = lerp(CY - 40, 520, rise); const press = Math.exp(-Math.max(0, t - tc) / 0.07) * (t >= tc ? 1 : 0);
    const glow = t >= tc ? Math.exp(-(t - tc) / 0.35) : 0;
    pill(ctx, px, py, ps * lerp(1, 0.86, rise), press, glow, t);
    ripple(ctx, px - 40, py, t, tc, { r0: 30, r1: 420, n: 3, w: 4, color: C.white, c2: C.red, a: 0.85, dur: 0.75 });
    sparks(ctx, px - 40, py, t, tc, { n: 12, len: 160, r0: 40, w: 4, color: C.white, seed: 21 });
    // cursor glides in and clicks
    const ci = eio(t, tb + 0.12, 0.36); const co_ = ei(t, tc + 0.18, 0.3);
    if (t < tc + 0.5) cursor(ctx, lerp(260, px - 40, ci) + co_ * -200, lerp(1500, py + 14, ci) + co_ * 420, 1.25, press);
    // counter
    if (t >= tn - 0.05) {
      const ua = eo(t, tn, 0.3); const v = 1000 * cubicOut(inv(tn + 0.05, B(9), t));
      ar(ctx, 'مقعد مجاني', CX, 760 + (1 - ua) * 30, { size: 52, w: 400, color: hexA(C.white, 0.72), alpha: ua });
      ctx.save(); ctx.globalAlpha *= ua; wheels(ctx, v, CX, 1040, { digits: 4, size: 270, w: 800, color: C.white, dim: 0.16 }); ctx.restore();
      const ul = eo(t, B(8), 0.35);
      ctx.save(); ctx.globalAlpha *= ul; ctx.translate(0, (1 - ul) * 26);
      mixLine(ctx, [{ t: 'لأول' }, { t: '1000', lat: true }, { t: 'طالب فقط' }], CX, 1210, { size: 60, w: 600, lsize: 60, lw: 700, color: C.white });
      ctx.restore();
    }
    flash(ctx, t, tb, C.white, 0.1);
  }

  // ---------------------------------------------------------------- o05 tilted dashboard: learning path
  const STEPS = ['تعلّم', 'تعلّم', 'تدرّب', 'تداول'];
  function cardContent(c, t) {
    const w = c.canvas.width, h = c.canvas.height; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, w, h);
    rr(c, 2, 2, w - 4, h - 4, 34); c.fillStyle = 'rgba(22,24,29,0.97)'; c.fill(); c.lineWidth = 2; c.strokeStyle = 'rgba(255,255,255,0.22)'; c.stroke();
    ar(c, 'مسار التعلّم', w - 56, 112, { size: 58, w: 700, color: C.white, align: 'right' });
    ar(c, 'أكاديمية آكسي', 56, 108, { size: 34, w: 500, color: C.mist, align: 'left' });
    c.fillStyle = 'rgba(255,255,255,0.08)'; c.fillRect(56, 150, w - 112, 2);
    // stepper (RTL: step 1 at the right)
    const xs = [w - 140, w - 140 - 207, w - 140 - 414, w - 140 - 621], ys = 300;
    STEPS.forEach((s, i) => {
      const tk = B(10.5 + i * 0.5); const u = eo(t, tk, 0.22);
      if (i < 3) { const f = eio(t, tk, 0.4); c.fillStyle = 'rgba(255,255,255,0.12)'; c.fillRect(xs[i + 1] + 38, ys - 2, xs[i] - xs[i + 1] - 76, 4); c.fillStyle = C.mist; c.fillRect(xs[i] - 38 - (xs[i] - xs[i + 1] - 76) * f, ys - 2, (xs[i] - xs[i + 1] - 76) * f, 4); }
      c.beginPath(); c.arc(xs[i], ys, 36, 0, Math.PI * 2); c.fillStyle = u > 0 ? mix('#2A2D33', C.mist, u) : '#2A2D33'; c.fill();
      c.lineWidth = 2; c.strokeStyle = 'rgba(255,255,255,0.25)'; c.stroke();
      if (u > 0) { c.save(); c.strokeStyle = C.ink; c.lineWidth = 6; c.lineCap = 'round'; c.lineJoin = 'round'; const p = clamp(u * 1.3);
        c.beginPath(); c.moveTo(xs[i] - 15, ys + 1); c.lineTo(xs[i] - 15 + 11 * clamp(p * 2), ys + 1 + 11 * clamp(p * 2)); if (p > 0.5) c.lineTo(xs[i] - 4 + 21 * clamp((p - 0.5) * 2), ys + 12 - 25 * clamp((p - 0.5) * 2)); c.stroke(); c.restore(); }
      else lat(c, String(i + 1), xs[i], ys + 12, { size: 34, w: 700, color: hexA(C.white, 0.7) });
      ar(c, s, xs[i], ys + 96, { size: 40, w: 600, color: u > 0 ? C.white : hexA(C.white, 0.6) });
    });
    // progress bar from zero to pro (fills right -> left)
    const pr = cubicOut(inv(B(10.2), B(13), t)); const bx = 70, bw = w - 140, by = 520;
    ar(c, 'من الصفر', w - 70, 490, { size: 36, w: 500, color: hexA(C.white, 0.75), align: 'right' });
    ar(c, 'إلى الاحتراف', 70, 490, { size: 36, w: 700, color: C.white, align: 'left' });
    rr(c, bx, by, bw, 18, 9); c.fillStyle = 'rgba(255,255,255,0.10)'; c.fill();
    if (pr > 0) { rr(c, bx + bw * (1 - pr), by, bw * pr, 18, 9); c.fillStyle = C.mist; c.fill(); disc(c, bx + bw * (1 - pr), by + 9, 16, C.red); }
    lat(c, Math.round(pr * 100) + '%', w / 2, 600, { size: 44, w: 700, color: C.white });
    // toast
    const ut = sp(t, B(13), 3, 0.55);
    if (ut > 0.01) { c.save(); c.globalAlpha = clamp(ut); c.translate(0, (1 - ut) * 40); rr(c, 70, 650, 420, 84, 42); c.fillStyle = 'rgba(40,43,50,0.98)'; c.fill(); c.lineWidth = 1.5; c.strokeStyle = 'rgba(255,255,255,0.2)'; c.stroke();
      ar(c, 'اكتمل المسار', 420, 704, { size: 36, w: 600, color: C.white, align: 'right' }); disc(c, 452, 692, 16, C.mist); c.strokeStyle = C.ink; c.lineWidth = 4; c.beginPath(); c.moveTo(444, 692); c.lineTo(450, 698); c.lineTo(461, 685); c.stroke(); c.restore(); }
  }
  function s05(ctx, t) {
    night(ctx);
    const t0 = T.card, t1 = T.words;
    globe(ctx, CX, 2150, 860, t * 0.22, 1 - eo(t, t0, 0.4));
    const inn = eo(t, t0, 0.55), out = ei(t, t1 - 0.26, 0.26);
    const c = cardCanvas(); cardContent(c.getContext('2d'), t);
    const drift = cio(t, t0 + 0.35, t1 - t0 - 0.6); const fy = 14 * Math.sin((t - t0) * 2.6);
    const rx = lerp(0.55, 0.20, inn) - 0.08 * drift + 0.03 * Math.sin(t * 2.1) - 0.5 * out, ry = lerp(-0.7, -0.24, inn) + 0.36 * drift + 1.1 * out;
    tilted(ctx, c, lerp(CX + 260, CX, inn) - 700 * out, lerp(1500, 960, inn) + fy - 500 * out, rx, ry, 1700, clamp(inn * 1.5) * (1 - out), lerp(0.85, 1.0, inn) * (1 + 0.06 * drift));
  }

  // ---------------------------------------------------------------- o06 one word per beat, grey flashes
  const WORDS = [
    { s: 'قريباً', bg: 'light' }, { s: 'مجانية', bg: 'dark' }, { mix: true, bg: 'graphite' }, { s: 'فقط', bg: 'dark', stamp: true }];
  function s06(ctx, t) {
    const k = clamp(Math.floor((t - T.words) / SPB), 0, 3); const tb = T.words + k * SPB; const wd = WORDS[k]; const d = t - tb;
    if (wd.bg === 'light') vgrad(ctx, '#FAFAFA', '#EEF0F1'); else if (wd.bg === 'graphite') vgrad(ctx, '#3A3C41', '#26282C'); else night(ctx);
    const col = wd.bg === 'light' ? C.ink : C.white;
    const slide = eo(t, tb, 0.22); const x = CX + (1 - slide) * 260;
    ctx.save(); ctx.globalAlpha *= clamp(d / 0.06);
    let wEnd;
    if (wd.mix) { wEnd = mixLine(ctx, [{ t: 'لأول' }, { t: '1000', lat: true }, { t: 'طالب' }], x, 1010, { size: 104, w: 700, lsize: 112, lw: 800, color: col }); wEnd = x - wEnd / 2; }
    else {
      const sc = wd.stamp ? lerp(1.5, 1, eo(t, tb, 0.14)) : 1;
      ctx.save(); ctx.translate(x, 960); ctx.scale(sc, sc); ar(ctx, wd.s, 0, 70, { size: 210, w: 700, color: col }); ctx.restore();
      wEnd = x - arW(ctx, wd.s, { size: 210, w: 700 }) * sc / 2;
    }
    disc(ctx, wEnd - 34, 1000, 20 * sp(t, tb + 0.08, 4, 0.4), C.red);
    ctx.restore();
    flash(ctx, t, tb, '#8C8F94', 0.045);
  }

  // ---------------------------------------------------------------- o07 seat map, press the red button, toast
  const GRID = (() => { const cols = 40, rows = 25, sx = 22; const x0 = CX - (cols - 1) * sx / 2, y0 = 700; const pts = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) pts.push({ x: x0 + (cols - 1 - c) * sx, y: y0 + r * sx, h: hash(r * 31 + c * 7) });
    return { pts, seat: pts[12 * cols + 13] }; })();
  function s07(ctx, t) {
    night(ctx);
    const t0 = T.seat, tc = 10.62; const u0 = eo(t, t0, 0.3);
    ctx.save(); ctx.globalAlpha *= u0;
    ar(ctx, 'خريطة المقاعد', CX + 429, 650, { size: 40, w: 600, color: C.white, align: 'right' });
    mixLine(ctx, [{ t: 'مقعد مجاني', color: C.mist }, { t: '1000', lat: true, color: C.white }], CX - 330, 650, { size: 36, w: 500, lsize: 38, lw: 700, color: C.mist });
    for (const p of GRID.pts) { if (p === GRID.seat) continue; ctx.globalAlpha = u0 * (0.25 + 0.25 * p.h); ctx.fillStyle = C.mist; ctx.beginPath(); ctx.arc(p.x, p.y + (1 - u0) * 30 * p.h, 6, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    const s = GRID.seat; const sel = eo(t, t0 + 0.1, 0.2);
    disc(ctx, s.x, s.y, lerp(6, 14, sel), C.red, u0);
    ripple(ctx, s.x, s.y, t, t0 + 0.1, { r0: 14, r1: 90, n: 2, w: 3, color: C.red, a: 0.8, dur: 0.6 });
    // the button
    const press = t >= tc ? Math.exp(-(t - tc) / 0.08) : 0; const bu = sp(t, t0 + 0.05, 3, 0.5);
    ctx.save(); ctx.translate(CX, 1400); ctx.scale(bu * (1 - 0.05 * press), bu * (1 - 0.05 * press)); rr(ctx, -320, -64, 640, 128, 64); ctx.fillStyle = C.red; ctx.fill();
    ar(ctx, 'احجز مقعدك الآن', 0, 19, { size: 54, w: 700, color: C.white }); ctx.restore();
    ripple(ctx, CX + 60, 1400, t, tc, { r0: 30, r1: 360, n: 3, w: 4, color: C.white, a: 0.8, dur: 0.6 });
    const ci = eio(t, t0 + 0.08, tc - t0 - 0.12); cursor(ctx, lerp(900, CX + 60, ci), lerp(1760, 1410, ci), 1.25, press);
    // toast
    const ut = sp(t, tc + 0.08, 3, 0.55);
    if (ut > 0.01) { ctx.save(); ctx.globalAlpha *= clamp(ut); ctx.translate(0, (1 - ut) * -60); glass(ctx, CX - 300, 330, 600, 104, 52, { fill: 'rgba(30,32,38,0.96)' });
      ar(ctx, 'تم حجز مقعدك', CX + 150, 396, { size: 42, w: 600, color: C.white, align: 'right' }); disc(ctx, CX + 210, 382, 22, C.mist);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(CX + 199, 382); ctx.lineTo(CX + 207, 391); ctx.lineTo(CX + 222, 373); ctx.stroke(); ctx.restore(); }
    flash(ctx, t, t0, '#8C8F94', 0.045);
  }

  // ---------------------------------------------------------------- o08 X sting
  function s08(ctx, t) {
    vgrad(ctx, '#FAFAFA', '#EEF0F1');
    const t0 = T.sting; const drop = spring(t - (t0 + 0.04), 2.4, 0.34); const y = lerp(-260, CY - 20, clamp(drop)); const land = t0 + 0.2;
    const sq = 1 - 0.08 * Math.exp(-Math.max(0, t - land) / 0.06) * (t > land ? 1 : 0); const out = eio(t, T.end - 0.12, 0.18);
    ctx.save(); ctx.globalAlpha = 0.12 * clamp(drop) * (1 - out); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.ellipse(CX, CY + 175, 150 * clamp(drop), 22, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(CX, y); ctx.scale((1 / sq) * (1 - out), sq * (1 - out)); xmark(ctx, 0, 0, 300, C.red); ctx.restore();
    ripple(ctx, CX, CY + 150, t, land, { r0: 40, r1: 420, n: 2, w: 3, color: C.ink, a: 0.25, dur: 0.6 });
    flash(ctx, t, t0, C.white, 0.08);
  }

  // ---------------------------------------------------------------- o09 light end card, two pills
  function s09(ctx, t) {
    vgrad(ctx, '#FAFAFA', '#EEF0F1');
    const t0 = T.end; const up = (dt, d = 0.4) => eo(t, t0 + dt, d);
    const mq = up(0.6, 0.6);
    if (mq > 0) { ctx.save(); ctx.globalAlpha *= mq; chips(ctx, ['من الصفر', 'إلى الاحتراف', 'مجانية', 'قريباً', 'تعلّم', 'تدرّب', 'تداول'], 1585, t, 180, 0); chips(ctx, ['تداول', 'تدرّب', 'تعلّم', 'قريباً', 'مجانية', 'إلى الاحتراف', 'من الصفر'], 1695, t, -180, 260); ctx.restore(); }
    const lh = 100; logo(ctx, W - 72 - logoW(lh), 150 + (1 - up(0)) * 20, lh, C.ink, { alpha: up(0) });
    ctx.save(); ctx.beginPath(); ctx.rect(0, 400, W, 235); ctx.clip();
    arUnits(ctx, 'أكاديمية آكسي', CX, 530, { size: 124, w: 700, color: C.ink }, (i) => ({ dy: (1 - eo(t, t0 + 0.05 + i * 0.025, 0.4)) * 240 }));
    ctx.restore();
    // tagline types word by word
    const words = ['تعلّم', 'التداول', 'من', 'الصفر', 'إلى', 'الاحتراف']; const nw = Math.floor(clamp(inv(t0 + 0.25, t0 + 0.85, t)) * words.length + 1e-6);
    if (nw > 0) ar(ctx, words.slice(0, nw).join(' '), CX, 650, { size: 50, w: 400, color: C.graphite });
    const uc = up(0.5); ctx.save(); ctx.globalAlpha *= uc; rr(ctx, CX - 110, 700, 220, 70, 35); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = hexA(C.ink, 0.12); ctx.stroke();
    ar(ctx, 'قريباً', CX - 14, 749, { size: 40, w: 500, color: C.ink }); disc(ctx, CX + 62, 735, 9, C.red, Math.floor(t / 0.25) % 2 ? 0.3 : 1); ctx.restore();
    const ua = up(0.6); ctx.save(); ctx.globalAlpha *= ua; ctx.translate(0, (1 - ua) * 18);
    mixLine(ctx, [{ t: 'مجانية لأول' }, { t: '1000', lat: true }, { t: 'طالب فقط' }], CX, 880, { size: 60, w: 700, lsize: 62, lw: 800, color: C.ink }); ctx.restore();
    const p1 = sp(t, t0 + 0.7, 2.8, 0.5), p2 = sp(t, t0 + 0.82, 2.8, 0.5);
    const pump = t > t0 + 0.9 ? 1 + 0.045 * Math.exp(-((t - 1.40) % SPB) / 0.1) : 1;
    ctx.save(); ctx.translate(CX, 1020); ctx.scale(p1 * pump, p1 * pump); ctx.globalAlpha *= clamp(p1 * 1.4); rr(ctx, -320, -64, 640, 128, 64); ctx.fillStyle = C.red; ctx.fill(); K.shimmer(ctx, t, t0 + 0.9, 640, 128, 2 * SPB); ar(ctx, 'احجز مقعدك الآن', 0, 19, { size: 54, w: 700, color: C.white }); ctx.restore();
    ctx.save(); ctx.translate(CX, 1162); ctx.scale(p2, p2); ctx.globalAlpha *= clamp(p2 * 1.4); rr(ctx, -230, -50, 460, 100, 50); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = C.silver; ctx.stroke();
    lat(ctx, 'axi.com/ar', 0, 15, { size: 42, w: 600, color: C.ink }); ctx.restore();
  }

  // endless row of UI chips (SaaS marquee); v px/s
  function chips(ctx, items, y, t, v, ph) {
    const size = 36, padX = 34, h = 80, gap = 20; const ws = items.map((s) => arW(ctx, s, { size, w: 500 }) + padX * 2 + (s === 'قريباً' ? 30 : 0));
    const total = ws.reduce((a, b) => a + b, 0) + gap * items.length; let x0 = (t * v + ph) % total; if (x0 < 0) x0 += total;
    for (let j = -1; j <= Math.ceil(W / total) + 1; j++) {
      let x = x0 + (j - 1) * total;
      items.forEach((s, i) => { const w = ws[i]; rr(ctx, x, y - h / 2, w, h, h / 2); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = hexA(C.ink, 0.12); ctx.stroke();
        const live = s === 'قريباً'; ar(ctx, s, x + w / 2 - (live ? 14 : 0), y + 13, { size, w: 500, color: C.graphite }); if (live) disc(ctx, x + w - 34, y - 1, 8, C.red);
        x += w + gap; });
    }
  }
  function draw(ctx, t) {
    ctx.save();
    if (t < T.drop) s01(ctx, t);
    else if (t < T.bloom) s02(ctx, t);
    else if (t < T.card) s03(ctx, t);
    else if (t < T.words) s05(ctx, t);
    else if (t < T.seat) s06(ctx, t);
    else if (t < T.sting) s07(ctx, t);
    else if (t < T.end) s08(ctx, t);
    else s09(ctx, t);
    ctx.restore();
    const light = (t >= T.words && t < T.words + SPB) || t >= T.sting;
    if (t >= T.drop && t < T.sting) { const h = 62; logo(ctx, W - 72 - logoW(h), 132, h, light ? C.ink : C.white, { alpha: 0.92 * eo(t, T.drop, 0.25) }); }
    if (t >= T.drop && (t < T.sting || t >= T.end)) watermark(ctx, light ? C.ink : C.white, light ? 0.42 : 0.6);
    riskStrip(ctx, t, 12.0, 1262, { size: 27 });
  }
  const FAST = [[0.95, 1.27], [2.95, 3.3], [4.4, 4.86], [6.4, 6.62], [8.13, 8.5], [8.9, 9.0], [9.4, 9.5], [9.9, 10.0], [11.1, 11.36]];
  function blur(t) { for (const [a, b] of FAST) if (t >= a && t <= b) return 16; return t > 13.3 ? 1 : 6; }
  G.FILM = { draw, blur, T, B };
})(window);
