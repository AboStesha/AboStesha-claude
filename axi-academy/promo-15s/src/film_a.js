// Version A — kinetic typography «من الصفر». 1080x1920, 60 fps, 15 s. Music: Mixkit 726 from 12.88 s (drop at 1.40 s, 134 BPM).
(function (G) {
  const K = G.K;
  const { W, H, C, clamp, lerp, inv, eo, ei, eio, co, cio, spring, sp, expoOut, expoIn, cubicOut, cubicIn, backOut, hexA, mix, shake,
    ar, arW, lat, mixLine, arUnits, logo, logoW, xmark, disc, ring, vgrad, fill, ripple, sparks, wheels, riskStrip, watermark, rr } = K;
  const SPB = 60 / 134, B = (k) => 1.40 + k * SPB;
  const CX = W / 2, CY = H / 2;
  const T = { open: 0, drop: B(0), p2: B(4), line: B(8), name: B(12), offer: B(16), seat: B(20), sting: 11.25, end: 12.15 };
  const pulse = (t, k0, k1, d = 0.09) => { let v = 0; for (let k = k0; k <= k1; k++) { const x = t - B(k); if (x >= 0 && x < 0.4) v = Math.max(v, Math.exp(-x / d)); } return v; };
  const flash = (ctx, t, t0, color, d = 0.05) => { const x = t - t0; if (x >= 0 && x < d) fill(ctx, color, 1 - x / d); };

  // a word that lands with a real width stretch (HEXP 100 -> 0) and squash
  function slam(ctx, s, x, y, t, t0, o) {
    const d = t - t0; if (d < 0) return;
    const k = spring(d, o.f || 3.4, o.z || 0.36);
    const hexp = Math.min(100, 100 * clamp(1 - d / (o.hd || 0.16)) + (o.hx || 0));
    const sy = lerp(o.sy0 == null ? 0.62 : o.sy0, 1, k), sx = lerp(o.sx0 == null ? 0.92 : o.sx0, 1, k);
    const dy = (1 - k) * (o.dy || 0), dx = (1 - k) * (o.dx || 0);
    ctx.save(); ctx.translate(x + dx, y + dy - o.size * 0.33); ctx.scale(sx * (o.sc || 1), sy * (o.sc || 1));
    ar(ctx, s, 0, o.size * 0.33, { ...o, hexp }); ctx.restore();
  }
  function cam(ctx, s, fx = CX, fy = CY, dx = 0, dy = 0, rot = 0) { ctx.translate(fx + dx, fy + dy); if (rot) ctx.rotate(rot); ctx.scale(s, s); ctx.translate(-fx, -fy); }
  const offBg = (ctx) => vgrad(ctx, '#FBFBFB', '#F1F2F3');
  const inkBg = (ctx) => vgrad(ctx, '#111215', '#08090B');

  // ---------------------------------------------------------------- o01 brand open
  function s01(ctx, t) {
    fill(ctx, C.ink);
    const ir = 1150 * eio(t, 0.16, 0.40) * (1 - eio(t, 0.98, 0.30));
    if (ir > 0.5) {
      ctx.save(); ctx.beginPath(); ctx.arc(CX, CY, ir, 0, Math.PI * 2); ctx.clip();
      vgrad(ctx, '#EEF0F1', '#607880');
      const pa = sp(t, 0.40, 2.4, 0.6), pb = sp(t, 0.58, 2.4, 0.6);
      const s = (0.9 + 0.1 * sp(t, 0.36, 1.6, 0.8)) * (1 + 0.04 * inv(0.4, 0.95, t)) * (1 - eio(t, 0.93, 0.30));
      if (s > 0.01) { ctx.save(); cam(ctx, s, CX, CY + 40); const h = 330; logo(ctx, CX - logoW(h) / 2, CY + 40 - h / 2, h, C.white, { axi: pa, iraq: pb }); ctx.restore(); }
      ctx.restore();
    }
    // the red dot: pops, hides under the logo, returns as the iris closes, then anticipates the drop
    let r = 20 * sp(t, 0.06, 4.2, 0.36) * (1 - eio(t, 0.36, 0.16)) + 20 * sp(t, 1.10, 4.0, 0.4) * (t > 1.0 ? 1 : 0);
    const ant = eio(t, 1.28, 0.10); const sq = 1 - 0.18 * ant;
    ctx.save(); ctx.translate(CX, CY); ctx.scale(1 / sq, sq); disc(ctx, 0, 0, r, C.red); ctx.restore();
    ripple(ctx, CX, CY, t, 0.07, { r0: 22, r1: 230, n: 2, w: 3, color: C.white, a: 0.7, dur: 0.6 });
    ripple(ctx, CX, CY, t, 1.12, { r0: 22, r1: 170, n: 1, w: 2, color: C.white, a: 0.5, dur: 0.5 });
  }

  // ---------------------------------------------------------------- o02 تعلّم التداول
  function s02(ctx, t) {
    inkBg(ctx);
    const sh = shake(t, [B(0), B(1)], 9, 0.16, 3), sh2 = shake(t, [B(2), B(3)], 15, 0.11, 7);
    const out = eio(t, B(3.45), B(4) - B(3.45));
    ctx.save(); ctx.translate(sh.x + sh2.x, sh.y + sh2.y);
    // burst of the dot on the drop
    ripple(ctx, CX, 860, t, B(0), { r0: 20, r1: 520, n: 2, w: 6, color: C.red, c2: C.white, a: 0.9, dur: 0.55 });
    sparks(ctx, CX, 860, t, B(0), { n: 14, len: 300, r0: 30, w: 5, color: C.white, seed: 11 });
    const p2 = pulse(t, 2, 2, 0.1), p3 = pulse(t, 3, 3, 0.1); const br = 1 + 0.06 * Math.max(p2, p3);
    ctx.save(); ctx.translate(CX, 1000); ctx.scale(br * (1 + 0.5 * out), br * (1 - 0.96 * out)); ctx.translate(-CX, -1000 - 1300 * ei(t, B(3.75), B(4) - B(3.75)));
    slam(ctx, 'تعلّم', CX, 900, t, B(0), { size: 330, w: 700, color: C.white, dy: -40, hx: 45 * p2 });
    slam(ctx, 'التداول', CX, 1200, t, B(1), { size: 250, w: 700, color: C.white, dy: 60, hx: 22 * p3 });
    ctx.restore(); ctx.restore();
    flash(ctx, t, B(0), C.white, 0.06);
  }

  // ---------------------------------------------------------------- o03 من الصفر -> إلى الاحتراف
  function s03(ctx, t) {
    offBg(ctx);
    const t0 = B(4), t1 = B(6);
    const push = 1 + 0.05 * inv(t0, B(8), t);
    const whip = eio(t, B(7.55), B(8) - B(7.55));
    const sh = shake(t, [t1, B(6.5)], 13, 0.13, 5);
    ctx.save(); cam(ctx, push, CX, 980, -1300 * whip + sh.x, sh.y);
    // zero symbol: hairline ring + red dot
    const zr = sp(t, t0, 2.8, 0.5) * (1 - eio(t, t1, 0.18));
    ring(ctx, CX, 700, 86 * zr, 2.5, C.ink, zr);
    const dotFly = eio(t, t1 + 0.02, 0.2);
    const wPro = arW(ctx, 'إلى الاحتراف', { w: 700, size: 150 });
    const dx = lerp(CX, CX - wPro / 2 - 34, dotFly), dy = lerp(700, 1000 - 18, dotFly);
    const dr = 22 * sp(t, t0 + 0.05, 3.5, 0.4) * (1 + 0.25 * pulse(t, 5, 5)) * (1 - 0.35 * dotFly);
    disc(ctx, dx, dy, dr, C.red);
    ripple(ctx, CX - wPro / 2 - 34, 982, t, B(6.5), { r0: 10, r1: 90, n: 1, w: 3, color: C.red, a: 0.8, dur: 0.4 });
    // من الصفر: hairline, wipes in right->left, thickens toward the beat
    if (t < t1 + 0.12) {
      const wv = lerp(160, 430, eio(t, B(4.6), t1 - B(4.6)));
      const rev = eo(t, t0 + 0.02, 0.32); const pop = eo(t, t1, 0.12);
      const m = arW(ctx, 'من الصفر', { w: wv, size: 150 });
      ctx.save(); ctx.beginPath(); ctx.rect(CX + m / 2 - m * rev - 6, 760, m * rev + 12, 320); ctx.clip();
      ctx.translate(CX, 980); ctx.scale(1 + 0.25 * pop, 1 + 0.25 * pop); ar(ctx, 'من الصفر', 0, 0, { w: wv, size: 150, color: C.ink, alpha: 1 - pop }); ctx.restore();
    }
    slam(ctx, 'إلى الاحتراف', CX, 1000, t, t1, { size: 150, w: 700, color: C.ink, dy: 30 });
    ctx.restore();
    flash(ctx, t, t0, C.ink, 0.04);
  }

  // ---------------------------------------------------------------- o04 تعلّم · ثم تعلّم · ثم تدرّب · ثم تداول.
  function s04(ctx, t) {
    const k = t < B(9) ? 0 : t < B(10) ? 1 : t < B(11) ? 2 : 3; const tb = B(8 + k);
    if (k === 0) { // the word writes itself, the red dot is the pen tip
      offBg(ctx);
      const o = { size: 290, w: 600, color: C.ink };
      const L = K.layoutUnits(ctx, 'تعلّم', o); const n = L.us.length;
      const prog = eo(t, tb + 0.02, 0.30) * n;
      arUnits(ctx, 'تعلّم', CX, 1050, o, (i) => { const u = clamp(prog - i); return { alpha: clamp(u * 2), sy: 0.6 + 0.4 * backOut(u), sx: 0.9 + 0.1 * backOut(u), dy: (1 - u) * 30 }; });
      const right = CX + L.total / 2; const px = right - L.total * clamp(prog / n);
      disc(ctx, px - 8, 1072, 14 * (1 - eo(t, tb + 0.34, 0.08)), C.red);
    } else if (k === 1) { // repetition rows on the slate gradient
      vgrad(ctx, '#EEF0F1', '#607880');
      const d = t - tb; const rows = 9; const gap = 205;
      for (let r = 0; r < rows; r++) {
        const y = CY - (rows - 1) / 2 * gap + r * gap + 70; const dir = r % 2 ? 1 : -1; const center = r === (rows - 1) / 2;
        const sx = dir * (d * 900 + 140) ;
        const col = y < CY ? C.ink : C.white;
        ctx.save(); ctx.translate(sx, 0);
        for (let j = -2; j <= 2; j++) ar(ctx, center ? 'ثم تعلّم' : 'تعلّم', CX + j * 620, y, center ? { size: 170, w: 700, color: C.ink } : { size: 170, w: 700, color: hexA(col, 0.9), stroke: 2.2 });
        ctx.restore();
      }
    } else if (k === 2) { // practice reps: three stepping copies
      inkBg(ctx);
      const step = SPB / 4;
      for (let c = 0; c < 3; c++) {
        const tc = tb + c * step; if (t < tc) continue;
        const final = c === 2; const a = final ? 1 : 0.28 + 0.2 * c;
        const kk = spring(t - tc, 4, 0.45);
        ctx.save(); ctx.translate(CX + (2 - c) * 70, 1060); ctx.scale(0.86 + 0.14 * kk, 0.86 + 0.14 * kk);
        ar(ctx, 'تدرّب', 0, 0, { size: 290, w: 700, color: C.white, alpha: final ? 1 : a * (1 - eo(t, tb + 3 * step, 0.1)) });
        ctx.restore();
      }
      ar(ctx, 'ثم', CX, 760, { size: 96, w: 300, color: hexA(C.white, 0.7), alpha: eo(t, tb, 0.15) });
    } else { // constant-speed slide, the red full stop lands
      offBg(ctx);
      const d = t - tb; const x = CX + 420 - 460 * clamp(d / (SPB * 0.62));
      const wv = arW(ctx, 'تداول', { size: 290, w: 700 });
      ar(ctx, 'تداول', x, 1060, { size: 290, w: 700, color: C.ink });
      ar(ctx, 'ثم', CX, 760, { size: 96, w: 300, color: C.charcoal, alpha: eo(t, tb, 0.15) });
      const land = B(11.5); const lx = CX - 40 - wv / 2 - 30;
      if (t >= land - 0.06) { const u = eo(t, land - 0.06, 0.08); disc(ctx, lerp(lx - 160, lx, u), 1046, 22 * sp(t, land - 0.06, 4, 0.4), C.red); }
      ripple(ctx, lx, 1046, t, land, { r0: 14, r1: 120, n: 2, w: 3, color: C.red, a: 0.7, dur: 0.4 });
    }
    flash(ctx, t, tb, k === 2 ? C.white : C.ink, 0.045);
  }

  // ---------------------------------------------------------------- o05 أكاديمية آكسي · قريباً
  function s05(ctx, t) {
    inkBg(ctx);
    const t0 = B(12), tq = B(14);
    ctx.save(); cam(ctx, 1 + 0.045 * inv(t0, B(16), t), CX, 980);
    const o = { size: 150, w: 700, color: C.white };
    const n = K.layoutUnits(ctx, 'أكاديمية آكسي', o).us.length;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 700, W, 310); ctx.clip();
    const wave = (i, n) => { let v = 0; for (const k of [13, 15]) { const x = t - B(k); if (x < 0 || x > 0.5) continue; v = Math.max(v, Math.exp(-x / 0.3) * Math.max(0, 1 - Math.abs(i / Math.max(1, n - 1) - x / 0.3) * 3)); } return v; };
    arUnits(ctx, 'أكاديمية آكسي', CX, 900, o, (i, n) => { const u = eo(t, t0 + 0.02 + i * 0.03, 0.42); const v = wave(i, n); return { dy: (1 - u) * 320 - 30 * v, sy: 1 + 0.12 * v }; });
    ctx.restore();
    // قريباً + live dot + loading line (RTL)
    const qw = arW(ctx, 'قريباً', { size: 96, w: 300 });
    ctx.save(); ctx.beginPath(); ctx.rect(0, 990, W, 200); ctx.clip();
    const uq = eo(t, tq, 0.35); ar(ctx, 'قريباً', CX - 20, 1100 + (1 - uq) * 200, { size: 96, w: 300, color: hexA(C.white, 0.86) });
    ctx.restore();
    const blink = t < tq ? 0 : (Math.floor((t - tq) / (SPB / 2)) % 2 ? 0.25 : 1);
    disc(ctx, CX - 20 + qw / 2 + 34, 1070, 13 * eo(t, tq + 0.05, 0.2), C.red, blink);
    const lw = 520, ly = 1180; const fillp = eio(t, tq + 0.1, B(16) - tq - 0.1);
    ctx.save(); ctx.globalAlpha = eo(t, tq, 0.2); ctx.fillStyle = hexA(C.white, 0.16); ctx.fillRect(CX - lw / 2, ly, lw, 4); ctx.fillStyle = C.white; ctx.fillRect(CX + lw / 2 - lw * fillp, ly, lw * fillp, 4); ctx.restore();
    ctx.restore();
    flash(ctx, t, t0, C.white, 0.045);
  }

  // ---------------------------------------------------------------- o06/o07 مجانية · لأول 1000 طالب · فقط · احجز مقعدك الآن
  const GRID = (() => {
    const cols = 40, rows = 25, sx = 22; const x0 = CX - (cols - 1) * sx / 2, y0 = 760; const pts = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) pts.push({ x: x0 + (cols - 1 - c) * sx, y: y0 + r * sx, key: c * 0.9 + r * 1.15 + K.hash(r * 57 + c) * 3 });
    const order = pts.slice().sort((a, b) => a.key - b.key); order.forEach((p, i) => (p.rank = i));
    return { pts, cols, rows, sx, x0, y0, seat: pts[11 * cols + 27] };
  })();
  function s06(ctx, t) {
    offBg(ctx);
    const t0 = B(16), tg = B(17), tf = B(19), ts = B(20);
    const sh = shake(t, [t0, tf, ts], 14, 0.13, 9);
    const dive = ei(t, 10.86, T.sting - 10.86);
    const seat = GRID.seat;
    ctx.save();
    const zs = 1 + 40 * dive * dive;
    cam(ctx, zs, seat.x, seat.y, sh.x + (CX - seat.x) * dive, sh.y + (CY - seat.y) * dive);
    // مجانية: slams centre, then rises to the top
    const up = eio(t, tg, 0.34);
    ctx.save(); const sc = lerp(1, 0.6, up); ctx.translate(CX, lerp(1010, 470, up)); ctx.scale(sc, sc); ctx.translate(-CX, -1010);
    slam(ctx, 'مجانية', CX, 1010, t, t0, { size: 300, w: 700, color: C.ink, dy: -30 });
    ctx.restore();
    // counter line: لأول 1000 طالب
    const cnt = 1000 * K.cubicOut(inv(tg + 0.05, tf - 0.06, t));
    const la = eo(t, tg, 0.2);
    if (la > 0) {
      const y = 660;
      ctx.save(); ctx.globalAlpha = la * (1 - eo(t, ts + 0.05, 0.2));
      const ww = 350; ar(ctx, 'لأول', CX + ww / 2 + 30, y, { size: 84, w: 500, color: C.ink, align: 'left' });
      wheels(ctx, cnt, CX, y + 8, { digits: 4, size: 130, w: 800, color: C.ink, dim: 0.14 });
      ar(ctx, 'طالب', CX - ww / 2 - 30, y, { size: 84, w: 500, color: C.ink, align: 'right' });
      ctx.restore();
    }
    // the seat grid: one dot per seat, lit as the counter counts
    const lit = cnt * 1.04; const pick = eo(t, ts, 0.25);
    for (const p of GRID.pts) {
      if (p.rank >= lit + 40) continue;
      const u = clamp((lit - p.rank) / 40); const r = 6.5 * K.backOut(u);
      if (r <= 0) continue; const isSeat = p === seat;
      ctx.fillStyle = isSeat && pick > 0 ? C.red : hexA(C.ink, lerp(0.85, 0.32, pick));
      ctx.beginPath(); ctx.arc(p.x, p.y, isSeat ? lerp(r, 15, pick) : r, 0, Math.PI * 2); ctx.fill();
    }
    if (pick > 0) {
      ripple(ctx, seat.x, seat.y, t, ts + 0.02, { r0: 16, r1: 120, n: 3, w: 3, color: C.red, a: 0.8, dur: 0.7 });
      // pin label مقعدك
      const pu = sp(t, ts + 0.08, 3.2, 0.45); const lw = 190, lh = 76;
      ctx.save(); ctx.translate(seat.x, seat.y - 34); ctx.scale(pu, pu); ctx.globalAlpha *= clamp(pu);
      rr(ctx, -lw / 2, -lh - 14, lw, lh, 38); ctx.fillStyle = C.ink; ctx.fill();
      ctx.beginPath(); ctx.moveTo(-12, -15); ctx.lineTo(0, 0); ctx.lineTo(12, -15); ctx.closePath(); ctx.fill();
      ar(ctx, 'مقعدك', 0, -lh / 2 - 14 + 16, { size: 42, w: 600, color: C.white }); ctx.restore();
    }
    // فقط stamp, then احجز مقعدك الآن
    const fo = eo(t, ts, 0.18);
    if (t >= tf && fo < 1) {
      const d = t - tf; const s = lerp(1.9, 1, eo(t, tf, 0.14)); ctx.save(); ctx.translate(CX, 1480); ctx.rotate(-0.07); ctx.scale(s, s); ctx.globalAlpha *= clamp(d / 0.04) * (1 - fo);
      ctx.lineWidth = 6; ctx.strokeStyle = C.ink; rr(ctx, -150, -105, 300, 150, 18); ctx.stroke();
      ar(ctx, 'فقط', 0, 18, { size: 120, w: 700, color: C.ink }); ctx.restore();
    }
    if (t >= ts) {
      const o = { size: 104, w: 700, color: C.ink };
      ctx.save(); ctx.beginPath(); ctx.rect(0, 1370, W, 230); ctx.clip();
      arUnits(ctx, 'احجز مقعدك الآن', CX, 1500, o, (i) => { const u = eo(t, ts + 0.06 + i * 0.022, 0.34); return { dy: (1 - u) * 240 }; });
      ctx.restore();
    }
    ctx.restore();
    // portal: as we dive into the red seat it opens to white
    if (dive > 0.25) { const a = inv(0.25, 0.9, dive); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = C.off; ctx.beginPath(); ctx.arc(CX, CY, 15 * zs * 0.82, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    flash(ctx, t, t0, C.ink, 0.045);
  }

  // ---------------------------------------------------------------- o08 X sting
  function s08(ctx, t) {
    offBg(ctx);
    const t0 = T.sting; const drop = spring(t - (t0 + 0.06), 2.3, 0.34);
    const y = lerp(-260, CY - 20, clamp(drop * 1.0)); const land = t0 + 0.24;
    const sq = 1 - 0.08 * Math.exp(-Math.max(0, t - land) / 0.06) * (t > land ? 1 : 0);
    const out = eio(t, T.end - 0.12, 0.2);
    // soft shadow
    ctx.save(); ctx.globalAlpha = 0.12 * clamp(drop) * (1 - out); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.ellipse(CX, CY + 175, 150 * clamp(drop), 22, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    const shx = shake(t, [land], 14, 0.12, 13);
    ctx.save(); ctx.translate(CX + shx.x, y + shx.y); ctx.scale((1 / sq) * (1 - out), sq * (1 - out)); xmark(ctx, 0, 0, 300, C.red); ctx.restore();
    ripple(ctx, CX, CY + 150, t, land, { r0: 40, r1: 420, n: 2, w: 3, color: C.ink, a: 0.25, dur: 0.6 });
    flash(ctx, t, t0, C.white, 0.06);
  }

  // ---------------------------------------------------------------- o09 end card
  function s09(ctx, t) {
    vgrad(ctx, '#FAFAFA', '#EEF0F1');
    const t0 = T.end; const up = (dt, d = 0.4) => eo(t, t0 + dt, d);
    const mq = up(0.5, 0.6);
    if (mq > 0) {
      const mo = { size: 150, w: 700, hexp: 100, color: C.ink, stroke: 2.4, alpha: 0.2 * mq };
      K.marquee(ctx, 'من الصفر · إلى الاحتراف · ', 420, t, 240, mo);
      K.marquee(ctx, 'تعلّم · تدرّب · تداول · ', 1728, t, -240, mo, 300);
    }
    const lh = 100; const lw = logoW(lh); const ul = up(0.0);
    logo(ctx, W - 72 - lw, 150 + (1 - ul) * 20, lh, C.ink, { alpha: ul });
    const o = { size: 140, w: 700, color: C.ink };
    ctx.save(); ctx.beginPath(); ctx.rect(0, 470, W, 245); ctx.clip();
    arUnits(ctx, 'أكاديمية آكسي', CX, 640, o, (i) => ({ dy: (1 - eo(t, t0 + 0.04 + i * 0.025, 0.4)) * 250 }));
    ctx.restore();
    // chip قريباً
    const uc = up(0.22); const cw = 220, ch = 70;
    ctx.save(); ctx.globalAlpha = uc; ctx.translate(0, (1 - uc) * 16);
    rr(ctx, CX - cw / 2, 700, cw, ch, 35); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = hexA(C.ink, 0.12); ctx.stroke();
    ar(ctx, 'قريباً', CX - 14, 749, { size: 40, w: 500, color: C.ink }); disc(ctx, CX + 62, 735, 9, C.red, t > t0 + 0.4 ? (Math.floor((t - t0) / SPB) % 2 ? 0.3 : 1) : 1);
    ctx.restore();
    ar(ctx, 'تعلّم التداول من الصفر إلى الاحتراف', CX, 870 + (1 - up(0.3)) * 18, { size: 56, w: 400, color: C.graphite, alpha: up(0.3) });
    const ua = up(0.38);
    ctx.save(); ctx.globalAlpha = ua; ctx.translate(0, (1 - ua) * 18);
    mixLine(ctx, [{ t: 'مجانية لأول' }, { t: '1000', lat: true }, { t: 'طالب فقط' }], CX, 985, { size: 66, w: 700, lsize: 68, lw: 800, color: C.ink });
    ctx.restore();
    // CTA pill
    const pu = sp(t, t0 + 0.5, 2.8, 0.5); const pw = 680, ph = 136; const beat = 1 + 0.045 * Math.exp(-((t - 1.40) % SPB) / 0.1) * (t > t0 + 0.95 ? 1 : 0);
    ctx.save(); ctx.translate(CX, 1140); ctx.scale(pu * beat, pu * beat); ctx.globalAlpha *= clamp(pu * 1.4);
    rr(ctx, -pw / 2, -ph / 2, pw, ph, ph / 2); ctx.fillStyle = C.red; ctx.fill(); K.shimmer(ctx, t, t0 + 0.95, pw, ph, 2 * SPB);
    ar(ctx, 'احجز مقعدك الآن', 0, 20, { size: 58, w: 700, color: C.white }); ctx.restore();
    lat(ctx, 'axi.com/ar', CX, 1290 + (1 - up(0.62)) * 14, { size: 48, w: 600, color: C.ink, alpha: up(0.62) });
  }

  // ---------------------------------------------------------------- composition
  function draw(ctx, t) {
    ctx.save();
    if (t < T.drop) s01(ctx, t);
    else if (t < T.p2) s02(ctx, t);
    else if (t < T.line) s03(ctx, t);
    else if (t < T.name) s04(ctx, t);
    else if (t < T.offer) s05(ctx, t);
    else if (t < T.sting) s06(ctx, t);
    else if (t < T.end) s08(ctx, t);
    else s09(ctx, t);
    ctx.restore();
    // overlays: small logo top-right, X watermark bottom-left, risk strip
    const dark = (t >= T.drop && t < T.p2) || (t >= B(10) && t < B(11)) || (t >= T.name && t < T.offer);
    if (t >= T.drop && t < T.sting) { const h = 62; logo(ctx, W - 72 - logoW(h), 132, h, dark ? C.white : C.ink, { alpha: 0.92 * eo(t, T.drop, 0.25) }); }
    if (t >= T.drop && (t < T.sting || t >= T.end)) watermark(ctx, dark ? C.white : C.ink, dark ? 0.6 : 0.42);
    riskStrip(ctx, t, 12.0, 1350, { size: 27 });
  }
  const FAST = [[0.25, 0.46], [1.0, 1.23], [1.83, 2.0], [2.95, 3.2], [4.07, 4.22], [4.78, 4.99], [9.0, 9.36], [10.86, 11.5]];
  function blur(t) { for (const [a, b] of FAST) if (t >= a && t <= b) return 16; return t > 13.3 ? 1 : 6; }
  G.FILM = { draw, blur, T, B };
})(window);
