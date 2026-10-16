// FILM 4 — «مستثمر أم متداول؟» (Investor or trader?). 45 s, 9:16, 105 bpm. Explainer in dark glass infographics.
// The three ways to trade crypto at Axi, one card each, then side by side: Buy Crypto (own the coin, 1:1, 200+, 0.8%,
// kept in the Axi Wallet) · crypto CFDs (trade the price up or down, leverage that multiplies risk too, 30+, no
// commission) · crypto perpetuals (no expiry, 150+, short and long term). One account, one balance for all three.
// CTA «اختر طريقتك الآن». Voice-over windows: see SCRIPTS.md. Facts from Axi's Buy Crypto page.
(function () {
  const { W, H, clamp, lerp, inv, smooth, eo, ei, co, cio, sp, expoOut, cubicInOut, ar, arW, lat, latW, mixLine, rr, disc } = K;
  const { AX, glass, snap, film, camera, swing, popWords } = GL;
  const b = CC.grid(105), INK = CC.INK;
  const T_DEAL = b(3.5), C1 = b(7), C2 = b(22.75), C3 = b(38.5), T_CMP = b(54.25), T_ONE = b(61), T_END = b(67.4);

  const CARDS = [
    { ar: 'شراء العملات الرقمية', la: 'Buy Crypto', tag: 'تملك العملة نفسها', icon: 'coin', fit: 'المستثمر على المدى الطويل', rows: [
      ['الملكية', 'check', { t: 'تملك العملة' }], ['الرافعة', 'lock', { t: '1:1', lat: true, sub: 'بدون رافعة' }], ['العملات', 'coin', { t: '200+', lat: true }],
      ['العمولة', 'chart', { t: '0.8%', lat: true }], ['الحفظ', 'wallet', { t: 'محفظة آكسي' }]] },
    { ar: 'عقود الفروقات', la: 'Crypto CFDs', tag: 'تتداول على حركة السعر', icon: 'candles', fit: 'المتداول على المدى القصير', rows: [
      ['الملكية', 'user', { t: 'لا تملك العملة', dim: true }], ['الاتجاه', 'swap', { t: 'صعوداً أو هبوطاً' }], ['الرافعة', 'chart', { t: 'متاحة', sub: 'تضاعف المخاطر بالقدر نفسه' }],
      ['العملات', 'coin', { t: '30+', lat: true }], ['العمولة', 'check', { t: 'بدون عمولة' }]] },
    { ar: 'العقود الدائمة', la: 'Crypto Perpetuals', tag: 'عقود بلا تاريخ انتهاء', icon: 'infinity', fit: 'متداول المشتقات النشط', rows: [
      ['الملكية', 'user', { t: 'لا تملك العملة', dim: true }], ['الاتجاه', 'swap', { t: 'صعوداً أو هبوطاً' }], ['الرافعة', 'chart', { t: 'متاحة', sub: 'تضاعف المخاطر بالقدر نفسه' }],
      ['العقود', 'candles', { t: '150+', lat: true }], ['المدة', 'clock', { t: 'قصيرة وطويلة' }]] },
  ];
  const CX = 90, CY = 470, CWD = 900, CHT = 1150;

  // one card, full size, in card space (0,0)-(CWD,CHT); rows reveal from rt0
  function card(ctx, t, c, rt0, o = {}) {
    glass(ctx, 0, 0, CWD, CHT, { tone: 'light', r: 48, ch: 56, corner: 'tl', lift: 1, glint: o.glint });
    // header: icon, Arabic name, Latin name, tag
    if (c.icon === 'coin') CC.coin(ctx, CWD - 120, 130, 66, { ticker: 'BTC', a: Math.sin(t * 1.3) * 0.6 });
    else { disc(ctx, CWD - 120, 130, 66, 'rgba(255,255,255,0.12)'); ctx.save(); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(CWD - 120, 130, 66, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); CC.icon(ctx, c.icon, CWD - 120, 130, 72, '#FFFFFF', 3.6); }
    ar(ctx, c.ar, CWD - 220, 126, { w: 700, size: 62, color: '#FFFFFF', align: 'right' });
    lat(ctx, c.la, CWD - 220, 182, { w: 600, size: 34, color: 'rgba(255,255,255,0.6)', align: 'right' });
    const tu = eo(t, rt0 - 0.25, 0.4);
    if (tu > 0) { ctx.save(); ctx.globalAlpha *= tu; rr(ctx, 60, 230, CWD - 120, 96, 48); ctx.fillStyle = 'rgba(255,255,255,0.10)'; ctx.fill(); ar(ctx, c.tag, CWD / 2, 292, { w: 600, size: 44, color: '#FFFFFF' }); ctx.restore(); }
    c.rows.forEach(([lb, ic, v], i) => {
      const u = eo(t, rt0 + i * b(1.5), 0.45); if (u <= 0) return; const y = 380 + i * 126;
      ctx.save(); ctx.globalAlpha *= u; ctx.translate((1 - u) * 60, 0);
      ctx.fillStyle = 'rgba(255,255,255,0.10)'; ctx.fillRect(60, y + 110, CWD - 120, 2);
      disc(ctx, CWD - 100, y + 56, 34, 'rgba(255,255,255,0.10)'); CC.icon(ctx, ic, CWD - 100, y + 56, 36, '#FFFFFF', 3.2);
      ar(ctx, lb, CWD - 160, y + 70, { w: 400, size: 38, color: 'rgba(255,255,255,0.7)', align: 'right' });
      const col = v.dim ? 'rgba(255,255,255,0.55)' : '#FFFFFF', vy = v.sub ? y + 54 : y + 70;
      if (v.lat) lat(ctx, v.t, 70, vy + 4, { w: 800, size: 54, color: col, align: 'left' }); else ar(ctx, v.t, 70, vy, { w: 700, size: 44, color: col, align: 'left' });
      if (v.sub) ar(ctx, v.sub, 70, y + 100, { w: 400, size: 26, color: 'rgba(255,255,255,0.6)', align: 'left' });
      ctx.restore();
    });
    const fu = eo(t, rt0 + c.rows.length * b(1.5) + 0.1, 0.45);
    if (fu > 0) {
      ctx.save(); ctx.globalAlpha *= fu;
      ar(ctx, 'الأنسب لـ:', CWD - 64, CHT - 70, { w: 400, size: 36, color: 'rgba(255,255,255,0.7)', align: 'right' });
      const fw = arW(ctx, c.fit, { w: 700, size: 36 }) + 70; rr(ctx, CWD - 250 - fw, CHT - 126, fw, 84, 42); ctx.fillStyle = '#FFFFFF'; ctx.fill();
      ar(ctx, c.fit, CWD - 250 - fw / 2, CHT - 72, { w: 700, size: 36, color: INK });
      ctx.restore();
    }
  }
  // the section counter at the top: «1/3»
  function counter(ctx, t, i, a) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
    for (let k = 0; k < 3; k++) { rr(ctx, W - 90 - (k + 1) * 120 - k * 16 + 16, 330, 120, 10, 5); ctx.fillStyle = k === i ? AX.red : k < i ? '#FFFFFF' : 'rgba(255,255,255,0.22)'; ctx.fill(); }
    mixLine(ctx, [{ t: 'الطريقة' }, { t: `${i + 1}/3`, lat: true }], W - 90, 300, { size: 40, lsize: 38, w: 600, lw: 700, color: 'rgba(255,255,255,0.85)', align: 'right', gap: 12 });
    ctx.restore();
  }

  // ---------------- 1 · hook: investor or trader? then three cards dealt ----------------
  const S0 = { t0: 0, t1: C1, render(ctx, t) {
    CC.darkStage(ctx, t, { dx: -t * 20 });
    ctx.save(); camera(ctx, t, 0, C1, { s0: 1.0, s1: 1.04, drift: 5 });
    const q = 1 - ei(t, T_DEAL - 0.3, 0.3);
    if (q > 0) {
      ctx.save(); ctx.globalAlpha *= q;
      popWords(ctx, 'مستثمر…', W / 2, 520, t, { t0: 0.0, size: 120, w: 700, color: '#FFFFFF', from: 1.5 });
      popWords(ctx, 'أم متداول؟', W / 2, 680, t, { t0: 0.55, st: 0.14, size: 120, w: 700, colors: ['#FFFFFF', AX.red], from: 1.6 });
      snap(ctx.canvas);
      [['مستثمر', 'coin', 810, 0.2], ['متداول', 'candles', 270, 0.75]].forEach(([lb, ic, x, d]) => {
        const u = sp(t, d, 2.4, 0.6); if (u <= 0) return; const y = 1130 + Math.sin(t * 1.6 + x) * 10;
        ctx.save(); ctx.translate(x, y); ctx.scale(clamp(u, 0, 1.1), clamp(u, 0, 1.1)); ctx.translate(-x, -y);
        glass(ctx, x - 200, y - 230, 400, 460, { tone: 'light', r: 40, lift: 1, glint: clamp((t - d - 0.3) / 0.7) });
        if (ic === 'coin') CC.coin(ctx, x, y - 50, 90, { ticker: 'BTC', a: Math.sin(t * 1.5) * 0.6 }); else CC.icon(ctx, ic, x, y - 50, 120, '#FFFFFF', 3.6);
        ar(ctx, lb, x, y + 150, { w: 700, size: 54, color: '#FFFFFF' });
        ctx.restore();
      });
      ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(W / 2 - 1, 930, 2, 400 * co(t, 1.0, 0.6));
      ctx.restore();
    }
    // three face-down cards dealt in a fan, then the first one opens
    if (t > T_DEAL - 0.1) {
      popWords(ctx, 'الكريبتو في آكسي…', W / 2, 520, t, { t0: T_DEAL, st: 0.1, size: 84, w: 700, color: '#FFFFFF', from: 1.4 });
      popWords(ctx, 'بثلاث طرق', W / 2, 650, t, { t0: T_DEAL + 0.35, st: 0.12, size: 84, w: 700, colors: ['#FFFFFF', AX.red], from: 1.5 });
      snap(ctx.canvas);
      [2, 1, 0].forEach((i) => {
        const c = CARDS[i], u = sp(t, T_DEAL + 0.25 + (2 - i) * 0.18, 2.2, 0.62); if (u <= 0) return;
        const ang = (1 - i) * 0.16 * clamp(u), x = W / 2 + (1 - i) * 250 * clamp(u), y = 1150 + Math.abs(1 - i) * 40 * clamp(u) + (1 - clamp(u)) * 900;
        ctx.save(); ctx.translate(x, y); ctx.rotate(-ang); ctx.translate(-160, -230);
        glass(ctx, 0, 0, 320, 460, { tone: i === 0 ? 'light' : 'dark', r: 32, ch: 36, corner: 'tl', lift: 1 });
        if (c.icon === 'coin') CC.coin(ctx, 160, 170, 64, { ticker: 'BTC', a: Math.sin(t * 1.5) * 0.5 }); else CC.icon(ctx, c.icon, 160, 170, 96, '#FFFFFF', 3.6);
        lat(ctx, c.la.replace('Crypto ', ''), 160, 330, { w: 700, size: 40, color: '#FFFFFF' });
        ar(ctx, ['امتلك', 'تداول السعر', 'بلا انتهاء'][i], 160, 390, { w: 400, size: 30, color: 'rgba(255,255,255,0.7)' });
        ctx.restore();
      });
    }
    ctx.restore();
  } };

  // ---------------- 2 · the three cards, one by one ----------------
  function cardScene(i, t0, t1) {
    return { t0, t1, render(ctx, t) {
      CC.darkStage(ctx, t, { dx: -t * 20 - i * 120 });
      ctx.save(); camera(ctx, t, t0, t1, { s0: 1.0, s1: 1.03, drift: 4 });
      counter(ctx, t, i, eo(t, t0, 0.4));
      snap(ctx.canvas);
      const inU = sp(t, t0 - 0.05, 1.9, 0.72), out = ei(t, t1 - 0.45, 0.45), ang = (1 - clamp(inU)) * -0.9 + out * 0.9;
      ctx.save(); ctx.globalAlpha *= clamp((t - t0 + 0.05) / 0.12) * (1 - out);
      swing(ctx, W / 2, CY + CHT / 2, ang); ctx.translate(CX + (1 - clamp(inU)) * 260 - out * 300, CY);
      card(ctx, t, CARDS[i], t0 + 0.9, { glint: clamp((t - t0 - 0.2) / 0.8) });
      ctx.restore();
      ctx.restore();
    } };
  }
  const S1 = cardScene(0, C1, C2), S2 = cardScene(1, C2, C3), S3 = cardScene(2, C3, T_CMP);

  // ---------------- 3 · side by side, then one account ----------------
  const COLS = [{ la: 'Buy Crypto', own: true, lev: '1:1', n: '200+' }, { la: 'CFDs', own: false, lev: 'متاحة', n: '30+' }, { la: 'Perpetuals', own: false, lev: 'متاحة', n: '150+' }];
  const S4 = { t0: T_CMP, t1: T_END, render(ctx, t) {
    CC.darkStage(ctx, t, { dx: -t * 20 });
    ctx.save(); camera(ctx, t, T_CMP, T_END, { s0: 1.02, s1: 1.0, drift: 4 });
    const m = cio(t, T_ONE, 0.9);
    popWords(ctx, 'قارن بنظرة واحدة', W / 2, 400, t, { t0: T_CMP + 0.1, st: 0.1, size: 76, w: 700, color: '#FFFFFF', from: 1.4, alpha: 1 - smooth(inv(T_ONE - 0.2, T_ONE + 0.2, t)) });
    snap(ctx.canvas);
    const labels = ['تملك العملة', 'الرافعة', 'العدد'];
    COLS.forEach((c, i) => {
      const u = sp(t, T_CMP + 0.2 + i * 0.15, 2.3, 0.65); if (u <= 0) return;
      const w = 280, gap = 24, x0 = W - 60 - (i + 1) * w - i * gap, y0 = 520, h = 900;
      const x = lerp(x0, W / 2 - w / 2, m), y = lerp(y0, 760, m) + (1 - clamp(u)) * 300;
      ctx.save(); ctx.globalAlpha *= clamp(u * 2) * (1 - smooth(inv(T_ONE + 0.3, T_ONE + 0.8, t)));
      glass(ctx, x, y, w, h, { tone: i === 0 ? 'light' : 'dark', r: 36, lift: 0.8 });
      lat(ctx, c.la, x + w / 2, y + 90, { w: 800, size: c.la.length > 8 ? 38 : 44, color: '#FFFFFF' });
      labels.forEach((lb, k) => {
        const ry = y + 200 + k * 220, ru = eo(t, T_CMP + 0.9 + k * b(1.5), 0.4); if (ru <= 0) return;
        ctx.save(); ctx.globalAlpha *= ru;
        ar(ctx, lb, x + w / 2, ry, { w: 400, size: 30, color: 'rgba(255,255,255,0.6)' });
        if (k === 0) { if (c.own) { disc(ctx, x + w / 2, ry + 80, 40, '#FFFFFF'); CC.icon(ctx, 'check', x + w / 2, ry + 80, 48, INK, 5); } else { ctx.fillStyle = 'rgba(255,255,255,0.45)'; rr(ctx, x + w / 2 - 26, ry + 76, 52, 8, 4); ctx.fill(); } }
        else if (k === 1) { if (c.lev === '1:1') lat(ctx, c.lev, x + w / 2, ry + 104, { w: 800, size: 60, color: '#FFFFFF' }); else ar(ctx, c.lev, x + w / 2, ry + 100, { w: 700, size: 48, color: '#FFFFFF' }); }
        else lat(ctx, c.n, x + w / 2, ry + 104, { w: 800, size: 64, color: '#FFFFFF' });
        ctx.restore();
      });
      ctx.restore();
    });
    // one account for all three
    const ou = eo(t, T_ONE + 0.4, 0.6);
    if (ou > 0) {
      popWords(ctx, 'حساب واحد. رصيد واحد.', W / 2, 520, t, { t0: T_ONE + 0.3, st: 0.12, size: 84, w: 700, color: '#FFFFFF', from: 1.4 });
      popWords(ctx, 'ثلاث طرق.', W / 2, 650, t, { t0: T_ONE + 0.9, st: 0.12, size: 84, w: 700, color: AX.red, from: 1.5 });
      snap(ctx.canvas);
      const x = 120, y = 820, w = 840, h = 560;
      ctx.save(); ctx.globalAlpha *= ou; ctx.translate(0, (1 - ou) * 120);
      glass(ctx, x, y, w, h, { tone: 'light', r: 44, ch: 52, corner: 'tr', lift: 1, glint: clamp((t - T_ONE - 0.6) / 0.8) });
      K.logoIQ(ctx, x + w - 110, y + 92, 140, { color: '#FFFFFF' });
      ar(ctx, 'رصيدك في آكسي', x + 60, y + 104, { w: 600, size: 40, color: 'rgba(255,255,255,0.8)', align: 'left' });
      lat(ctx, '$2,450.00', x + w / 2, y + 290, { w: 700, size: 104, color: '#FFFFFF' });
      ['Buy Crypto', 'CFDs', 'Perpetuals'].forEach((s, i) => { const u = eo(t, T_ONE + 1.2 + i * 0.15, 0.4); if (u <= 0) return; const cx = x + w - 150 - i * 270; ctx.save(); ctx.globalAlpha *= u; rr(ctx, cx - 120, y + 380, 240, 84, 42); ctx.fillStyle = i === 0 ? '#FFFFFF' : 'rgba(255,255,255,0.14)'; ctx.fill(); lat(ctx, s, cx, y + 433, { w: 700, size: 30, color: i === 0 ? INK : '#FFFFFF' }); ctx.restore(); });
      ctx.restore();
      ar(ctx, 'أرقام توضيحية', W / 2, 1480, { w: 400, size: 26, color: 'rgba(255,255,255,0.45)', alpha: ou });
    }
    ctx.restore();
  } };

  // ---------------- 4 · end card ----------------
  const S5 = { t0: T_END, t1: 45.01, render(ctx, t) {
    CC.darkStage(ctx, t, { dx: -t * 20 });
    ctx.save(); camera(ctx, t, T_END, 45, { s0: 1.04, s1: 1.0, drift: 3 });
    CC.endCard(ctx, t, T_END + 0.2, { dark: true, cy: 860, cta: 'اختر طريقتك الآن', tb: b(69), subParts: [{ t: 'Buy Crypto · CFDs · Perpetuals', lat: true }] });
    ctx.restore();
  } };

  const SCENES = [S0, S1, S2, S3, S4, S5];
  const CUTS = [{ at: C1, d: 0.45, kind: 'zoom', cy: 1150 }, { at: C2, d: 0.42, kind: 'slab' }, { at: C3, d: 0.42, kind: 'slab' }, { at: T_CMP, d: 0.42, kind: 'slab' }, { at: T_END, d: 0.45, kind: 'frost' }];
  window.FILM = {
    duration: 45,
    blur(t) {
      for (const c of CUTS) if (Math.abs(t - c.at) < c.d / 2 + 0.05) return c.kind === 'slab' ? 14 : 8;
      if (Math.abs(t - T_ONE - 0.45) < 0.6 || Math.abs(t - T_DEAL - 0.4) < 0.5) return 6;
      return 2;
    },
    draw(ctx, t) {
      film(ctx, t, SCENES, CUTS);
      if (t < T_END - 0.1) K.watermark(ctx, '#FFFFFF', 0.6 * smooth(inv(0.2, 0.6, t)) * (1 - smooth(inv(T_END - 0.4, T_END - 0.1, t))));
      K.grain(ctx, t, 0.026, t > 44.6);
    },
  };
})();
