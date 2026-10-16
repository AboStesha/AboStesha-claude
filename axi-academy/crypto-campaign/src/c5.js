// FILM 5 — «5 أسئلة قبل أن تشتري أول عملة رقمية» (5 questions). 40 s, 9:16, 100 bpm. Presenter-led Q&A.
// The presenter (filmed later) sits in a glass window that moves between fixed stations; each question lands as a
// glass card at the top and the answers stick on as glass stickers in the free column beside the window.
// ?mode=preview (studio-grey stand-in) · ?mode=green (key colour inside the window) · ?mode=matte (white window on
// black). The window only translates (fixed 640 × 880), so the editor keyframes position only — see SCRIPTS.md.
(function () {
  const { W, H, clamp, lerp, inv, smooth, eo, ei, co, cio, sp, expoOut, cubicInOut, ar, arW, lat, latW, mixLine, rr, disc } = K;
  const { AX, glass, snap, film, camera, popWords } = GL;
  const b = CC.grid(100), INK = CC.INK, MODE = window.MODE || 'preview';
  const WW = 640, WH = 880;
  const ST = { C: [220, 560], R: [380, 640], L: [60, 640], T: [220, 440] };
  // window keyframes: [time the move starts, station]; every move lasts MOVE seconds (cubic in-out)
  const MOVE = 0.6, Q0 = 3.0, QD = 6.0, T_CTA = Q0 + 5 * QD, T_OUT = 36.6, T_END = 36.8;
  const KEYS = [[0, 'C'], [Q0, 'R'], [Q0 + QD, 'L'], [Q0 + 2 * QD, 'R'], [Q0 + 3 * QD, 'L'], [Q0 + 4 * QD, 'R'], [T_CTA, 'T']];
  function win(t) {
    let p = ST[KEYS[0][1]];
    for (let i = 1; i < KEYS.length; i++) { const [tk, s] = KEYS[i]; const u = cio(t, tk, MOVE); if (u <= 0) break; p = [lerp(p[0], ST[s][0], u), lerp(p[1], ST[s][1], u)]; }
    return { x: p[0], y: p[1], a: 1 - smooth(inv(T_OUT, T_OUT + 0.4, t)) };
  }
  window.WINDOW_TRACK = win;   // exposed for the keyframe export

  const QS = [
    { q: 'هل أملك العملة فعلاً؟', side: 'L', a: [{ big: 'نعم', icon: 'check' }, { t: 'شراء فوري', lt: 'Spot' }, { t: 'ملكية', lt: '1:1' }] },
    { q: 'أين تُحفظ عملاتي؟', side: 'R', a: [{ icon: 'wallet', t: 'محفظة آكسي' }, { t: 'حساب منفصل', icon: 'lock' }, { t: 'عن حساب التداول' }] },
    { q: 'هل أحتاج إلى توثيق جديد؟', side: 'L', a: [{ big: 'لا', icon: 'shield' }, { t: 'لعملاء آكسي الحاليين' }, { t: 'بدون توثيق إضافي' }] },
    { q: 'كم العمولة؟', side: 'R', a: [{ bigL: '0.8%' }, { t: 'لكل عملية' }, { t: 'إيداع بدون عمولة', icon: 'check' }] },
    { q: 'متى أشتري؟ وكم عملة؟', side: 'L', a: [{ bigL: '24/7' }, { bigL: '200+', t: 'عملة رقمية' }, { t: 'الويب والجوال', icon: 'phone' }] },
  ];
  // answer column: the free side next to the window (window on R → column on the left, and the other way)
  const COL = { L: [56, 344], R: [680, 344] };

  function qCard(ctx, t, i) {
    const t0 = Q0 + i * QD, u = sp(t, t0 + 0.1, 2.2, 0.7), out = ei(t, t0 + QD - 0.35, 0.35); if (u <= 0 || out >= 1) return;
    ctx.save(); ctx.globalAlpha *= clamp(u * 2) * (1 - out); ctx.translate((1 - clamp(u)) * 300 - out * 300, 0);
    glass(ctx, 60, 290, W - 120, 300, { tone: 'white', r: 40, ch: 44, corner: 'tr', lift: 0.8, glint: clamp((t - t0 - 0.3) / 0.7) });
    rr(ctx, W - 60 - 40 - 190, 330, 190, 60, 30); ctx.fillStyle = INK; ctx.fill();
    mixLine(ctx, [{ t: 'سؤال' }, { t: `${i + 1}/5`, lat: true }], W - 60 - 40 - 95, 371, { size: 30, lsize: 28, w: 600, lw: 700, color: '#FFFFFF', gap: 10 });
    for (let k = 0; k < 5; k++) { rr(ctx, 100 + (4 - k) * 46, 352, 36, 10, 5); ctx.fillStyle = k === i ? AX.red : k < i ? INK : 'rgba(9,10,13,0.15)'; ctx.fill(); }
    ar(ctx, QS[i].q, W - 100, 520, { w: 700, size: QS[i].q.length > 18 ? 58 : 66, color: INK, align: 'right' });
    ctx.restore();
  }
  // answer stickers: glass cards in the free column (they overlap the window frame a little, like stickers)
  function stickers(ctx, t, i) {
    const t0 = Q0 + i * QD, [cx0, cw] = COL[QS[i].side], out = ei(t, t0 + QD - 0.35, 0.35); if (out >= 1) return;
    const lay = QS[i].a.map((s) => {
      if (s.big || s.bigL) return { h: s.bigL && s.t ? 270 : 250, lines: null };
      const size = 36, lines = s.lt ? null : K.wrapAr(ctx, s.t, cw - 56, { w: 700, size });
      return { h: (s.icon ? 96 : 40) + (lines ? lines.length : 1) * 54 + 34, lines, size };
    });
    let y = 690;
    QS[i].a.forEach((s, k) => {
      const L = lay[k], yy = y; y += L.h + 30;
      const st = t0 + 1.2 + k * 1.2, u = sp(t, st, 2.6, 0.55); if (u <= 0) return;
      const cx = cx0 + cw / 2, rot = [-0.035, 0.03, -0.02][k] * (QS[i].side === 'L' ? 1 : -1);
      ctx.save(); ctx.globalAlpha *= clamp(u * 2) * (1 - out); ctx.translate(cx, yy + L.h / 2); ctx.rotate(rot); ctx.scale(clamp(u, 0, 1.12), clamp(u, 0, 1.12)); ctx.translate(-cx, -(yy + L.h / 2));
      glass(ctx, cx0, yy, cw, L.h, { tone: 'white', r: 34, lift: 0.9, glint: clamp((t - st - 0.15) / 0.6) });
      if (s.big) {
        if (s.icon) { disc(ctx, cx, yy + 70, 34, INK); CC.icon(ctx, s.icon, cx, yy + 70, 38, '#FFFFFF', 3.8); }
        ar(ctx, s.big, cx, yy + 205, { w: 700, size: 100, color: INK });
      } else if (s.bigL) {
        lat(ctx, s.bigL, cx, yy + (s.t ? 150 : 165), { w: 800, size: s.t ? 96 : 104, color: INK });
        if (s.t) ar(ctx, s.t, cx, yy + 222, { w: 600, size: 36, color: '#393B40' });
      } else {
        let ty = yy + 40;
        if (s.icon) { disc(ctx, cx, yy + 58, 32, '#EEF0F1'); CC.icon(ctx, s.icon, cx, yy + 58, 36, INK, 3.6); ty = yy + 96; }
        if (s.lt) mixLine(ctx, [{ t: s.t }, { t: s.lt, lat: true }], cx, ty + 42, { size: 40, lsize: 40, w: 700, lw: 800, color: INK, gap: 12 });
        else L.lines.forEach((ln, j) => ar(ctx, ln, cx, ty + 40 + j * 54, { w: 700, size: L.size, color: INK }));
      }
      ctx.restore();
    });
  }

  const SA = { t0: 0, t1: T_END, render(ctx, t) {
    CC.steelStage(ctx, t, { dx: -t * 12 });
    // hook title
    const hu = 1 - ei(t, Q0 - 0.2, 0.3);
    if (hu > 0) {
      ctx.save(); ctx.globalAlpha *= hu;
      CC.slam(ctx, '', W / 2, 330, t, 0.0, { parts: [{ t: '5', lat: true, size: 150 }, { t: 'أسئلة' }], size: 110, lsize: 150, w: 700, lw: 800, color: INK, from: 1.6, gap: 24 });
      popWords(ctx, 'قبل أن تشتري أول عملة رقمية', W / 2, 460, t, { t0: 0.45, st: 0.08, size: 52, w: 600, color: '#393B40', from: 1.3, shadow: false });
      ctx.restore();
    }
    snap(ctx.canvas);   // frost source first, so the question cards frost the stage (not last frame's card)
    for (let i = 0; i < 5; i++) qCard(ctx, t, i);
    // the presenter window
    const P = win(t);
    if (P.a > 0) { ctx.save(); ctx.globalAlpha *= P.a; CC.presWin(ctx, P.x, P.y, WW, WH, t, { mode: MODE === 'green' ? 'green' : 'preview', glint: clamp((t - 0.3) / 1.0) }); ctx.restore(); }
    for (let i = 0; i < 5; i++) stickers(ctx, t, i);
    // CTA: ask the sixth question in the comments
    if (t > T_CTA) {
      const u = eo(t, T_CTA + 0.4, 0.5), out = 1 - smooth(inv(T_OUT, T_OUT + 0.3, t));
      ctx.save(); ctx.globalAlpha *= u * out;
      popWords(ctx, 'عندك سؤال سادس؟', W / 2, 300, t, { t0: T_CTA + 0.2, st: 0.12, size: 84, w: 700, color: INK, from: 1.4, shadow: false, alpha: out });
      snap(ctx.canvas);
      glass(ctx, 140, 1360, 800, 150, { tone: 'white', r: 75, lift: 0.8 });
      CC.icon(ctx, 'chat', 870, 1435, 56, INK, 3.6);
      ar(ctx, 'اكتبه في التعليقات', 820, 1452, { w: 700, size: 46, color: INK, align: 'right' });
      for (let k = 0; k < 3; k++) { const kk = 0.5 + 0.5 * Math.sin(t * 8 - k * 0.9); disc(ctx, 220 + k * 34, 1436 - kk * 6, 9, rgba(INK, 0.35 + 0.5 * kk)); }
      ctx.restore();
    }
  } };
  const rgba = GL.rgba;

  // ---------------- end card ----------------
  const SB = { t0: T_END, t1: 40.01, render(ctx, t) {
    CC.steelStage(ctx, t, { dx: -t * 12 });
    ctx.save(); camera(ctx, t, T_END, 40, { s0: 1.03, s1: 1.0, drift: 3 });
    CC.endCard(ctx, t, T_END + 0.15, { cy: 820, cta: 'اكتب سؤالك الآن', tb: b(63), subParts: [{ t: 'Buy Crypto', lat: true }, { t: '· شراء العملات الرقمية في آكسي' }], tagColor: '#242528' });
    ctx.restore();
  } };

  const SCENES = [SA, SB];
  const CUTS = [{ at: T_END, d: 0.4, kind: 'frost' }];
  window.FILM = {
    duration: 40,
    blur(t) {
      if (MODE === 'matte') return 4;
      for (const c of CUTS) if (Math.abs(t - c.at) < c.d / 2 + 0.05) return 8;
      for (const [tk] of KEYS) if (tk > 0 && t > tk - 0.05 && t < tk + MOVE + 0.05) return 6;
      return 2;
    },
    draw(ctx, t) {
      if (MODE === 'matte') {   // the window's shape, white on black, for compositing
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, W, H);
        const P = win(t); if (P.a > 0) { ctx.globalAlpha = P.a; rr(ctx, P.x, P.y, WW, WH, 40); ctx.fillStyle = '#FFFFFF'; ctx.fill(); }
        ctx.restore(); return;
      }
      film(ctx, t, SCENES, CUTS);
      if (t < T_END - 0.1) K.watermark(ctx, '#FFFFFF', 0.6 * smooth(inv(0.2, 0.6, t)) * (1 - smooth(inv(T_END - 0.4, T_END - 0.1, t))));
      K.grain(ctx, t, MODE === 'green' ? 0 : 0.02, t > 39.6);
    },
  };
})();
