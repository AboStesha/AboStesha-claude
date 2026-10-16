// ui2.js — glass UI pieces for the v2 videos. Claude-side pieces use Claude's palette (ivory glass, near-black
// text, terracotta accents; "Claude" in a serif, no logo). Axi-side pieces use Axi's dark glass with red actions
// and mint only for gains. All are generic mock-ups, not copies of either product.
(function (G) {
  'use strict';
  const K = G.K, GL = G.GL;
  const { W, H, clamp, lerp, inv, eo, co, sp, expoOut, ar, arW, lat, latW, mixLine, rr, disc } = K;
  const { CL, AX, glass, LO, PO } = GL;
  const U2 = {};
  const fmt = (v, d = 2) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

  // typing helper: the first n characters of s at cps from t0
  U2.typed = (s, t, t0, cps = 22) => { const ch = [...s], n = clamp(Math.floor((t - t0) * cps), 0, ch.length); return { s: ch.slice(0, n).join(''), done: n >= ch.length, n }; };
  U2.caret = (t) => Math.floor(t * 2.4) % 2 === 0;

  // the Claude name with a small terracotta mark beside it (a plain dot, not Claude's logo)
  U2.claudeName = (ctx, x, y, o = {}) => {
    const size = o.size || 40, wd = LO.width(ctx, 'Claude', { w: 600, size });
    LO.draw(ctx, 'Claude', x, y, { w: 600, size, color: o.color || CL.dark, align: o.align || 'left', alpha: o.alpha });
    return wd;
  };
  // three terracotta dots: Claude is thinking
  U2.thinking = (ctx, x, y, t, o = {}) => {
    for (let i = 0; i < 3; i++) { const k = 0.5 + 0.5 * Math.sin(t * 9 - i * 0.9); disc(ctx, x + i * (o.gap || 22), y - k * 6, (o.r || 7) * (0.8 + 0.25 * k), CL.orange, (o.alpha == null ? 1 : o.alpha) * (0.45 + 0.55 * k)); }
  };
  // the person's message: Arabic in a Claude light-grey bubble, right-aligned at xr
  U2.userBubble = (ctx, text, xr, y, o = {}) => {
    const size = o.size || 40, padX = size * 0.62, padY = size * 0.44, tw = Math.max(arW(ctx, text || ' ', { w: 400, size }), size), bw = tw + padX * 2, bh = size * 1.25 + padY * 2;
    ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    rr(ctx, xr - bw, y, bw, bh, Math.min(28, bh / 2)); ctx.fillStyle = o.fill || CL.pale; ctx.fill();
    ar(ctx, text, xr - padX, y + padY + size * 0.98, { w: 400, size, color: CL.dark, align: 'right' });
    if (o.caret) { ctx.fillStyle = CL.orange; ctx.fillRect(xr - padX - tw - 6, y + padY + size * 0.12, 3, size * 1.05); }
    ctx.restore(); return bh;
  };
  // Claude's reply: Arabic lines that appear one after another, right-aligned at xr
  U2.reply = (ctx, lines, xr, y, t, t0, o = {}) => {
    const size = o.size || 36, lh = size * 1.6;
    lines.forEach((ln, i) => {
      const u = eo(t, t0 + i * (o.st || 0.16), 0.4); if (u <= 0) return;
      const parts = typeof ln === 'string' ? [{ t: ln }] : ln;
      mixLine(ctx, parts, xr, y + i * lh + (1 - u) * 14, { size, lsize: size * 0.94, w: 400, lw: 500, color: o.color || CL.dark, align: 'right', alpha: u, gap: size * 0.26 });
    });
    return lines.length * lh;
  };
  // Claude's permission prompt on ivory glass: "Claude wants to …" + Allow once / Deny; o.press = tap time
  U2.permission = (ctx, x, y, w, t, t0, o = {}) => {
    const u = sp(t, t0, 2.6, 0.62); if (u <= 0) return 0; const h = o.h || 330;
    ctx.save(); ctx.globalAlpha *= clamp((t - t0) / 0.12); ctx.translate(0, (1 - u) * 70);
    glass(ctx, x, y, w, h, { tone: 'ivory', r: 34, glint: o.glint });
    mixLine(ctx, o.title || [{ t: 'Claude', lat: true, color: CL.dark }, { t: 'يطلب موافقتك' }], x + w - 44, y + 78, { size: 40, lsize: 38, w: 600, lw: 700, color: CL.dark, align: 'right', gap: 12 });
    mixLine(ctx, o.action || [{ t: 'تعديل وقف الخسارة' }, { t: 'EUR/USD', lat: true }, { t: '←' }, { t: '1.0820', lat: true }], x + w - 44, y + 146, { size: 32, lsize: 30, w: 400, lw: 500, color: CL.dark2, align: 'right', gap: 12 });
    ctx.fillStyle = 'rgba(20,20,19,0.10)'; ctx.fillRect(x + 36, y + 186, w - 72, 2);
    const pr = o.press != null ? clamp(1 - Math.abs(t - o.press) / 0.12) : 0, done = o.press != null && t > o.press + 0.1;
    U2.button(ctx, x + w - 44 - 160, y + 262, 320, 92, 'Allow once', { fill: CL.dark, color: CL.light, press: pr });
    U2.button(ctx, x + 44 + 110, y + 262, 220, 92, 'Deny', { stroke: 'rgba(20,20,19,0.28)', color: CL.dark, alpha: done ? 0.35 : 1 });
    ctx.restore(); return h;
  };
  // a pill button with a Poppins label (Claude side)
  U2.button = (ctx, cx, cy, w, h, label, o = {}) => {
    const p = o.press || 0, s = 1 - 0.07 * p;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    rr(ctx, -w / 2, -h / 2, w, h, h / 2);
    if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
    if (o.stroke) { ctx.lineWidth = 2.5; ctx.strokeStyle = o.stroke; ctx.stroke(); }
    PO.draw(ctx, label, 0, (o.size || 32) * 0.36, { w: 500, size: o.size || 32, color: o.color || CL.light });
    ctx.restore();
  };
  // cursor (white arrow) and a tap ripple
  U2.cursor = (ctx, x, y, o = {}) => {
    const s = (o.s || 1.3) * (1 - 0.12 * (o.press || 0));
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 34); ctx.lineTo(8.5, 26.5); ctx.lineTo(14.5, 40); ctx.lineTo(20.5, 37.5); ctx.lineTo(14.5, 24.5); ctx.lineTo(25.5, 24.5); ctx.closePath();
    ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3; ctx.fillStyle = '#FFFFFF'; ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.lineWidth = 2; ctx.strokeStyle = '#141413'; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
  };
  U2.tap = (ctx, x, y, t, t0, color = '#FFFFFF') => K.ripple(ctx, x, y, t, t0, { r0: 8, r1: 90, w: 4, n: 2, dur: 0.5, a: 0.8, color });

  // ---------------- Axi-side data cards (dark glass) ----------------
  U2.balance = (ctx, x, y, w, t, t0, o = {}) => {
    const u = sp(t, t0, 2.6, 0.6); if (u <= 0) return 0; const h = 250;
    ctx.save(); ctx.globalAlpha *= clamp((t - t0) / 0.12); ctx.translate(0, (1 - u) * 60);
    glass(ctx, x, y, w, h, { tone: 'dark', r: 30, ch: 40, corner: 'tl', glint: o.glint });
    ar(ctx, 'رصيد الحساب', x + w - 40, y + 66, { w: 400, size: 32, color: 'rgba(255,255,255,0.7)', align: 'right' });
    lat(ctx, '$' + fmt((o.value || 12480.5) * K.co(t, t0 + 0.05, 0.75)), x + w - 40, y + 170, { w: 800, size: 88, color: '#FFFFFF', align: 'right' });
    mixLine(ctx, [{ t: 'حساب' }, { t: 'MT5', lat: true }, { t: '· آكسي' }], x + w - 40, y + 220, { size: 26, lsize: 24, w: 400, lw: 600, color: 'rgba(255,255,255,0.6)', align: 'right', gap: 8 });
    ctx.restore(); return h;
  };
  U2.positions = (ctx, x, y, w, t, t0, rows, o = {}) => {
    const u = sp(t, t0, 2.6, 0.6); if (u <= 0) return 0; const rh = 92, h = 96 + rows.length * rh;
    ctx.save(); ctx.globalAlpha *= clamp((t - t0) / 0.12); ctx.translate(0, (1 - u) * 60);
    glass(ctx, x, y, w, h, { tone: 'dark', r: 30, ch: 40, corner: 'tl', glint: o.glint });
    ar(ctx, 'صفقاتك المفتوحة', x + w - 40, y + 64, { w: 400, size: 32, color: 'rgba(255,255,255,0.7)', align: 'right' });
    rows.forEach((r, i) => {
      const ry = y + 96 + i * rh, a = clamp((t - t0 - 0.12 - i * 0.08) / 0.15); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(255,255,255,0.10)'; ctx.fillRect(x + 32, ry, w - 64, 2);
      lat(ctx, r.sym, x + w - 40, ry + 58, { w: 700, size: 34, color: '#FFFFFF', align: 'right' });
      const sw = latW(ctx, r.sym, { w: 700, size: 34 });
      ar(ctx, r.side, x + w - 64 - sw, ry + 58, { w: 400, size: 30, color: 'rgba(255,255,255,0.6)', align: 'right' });
      lat(ctx, (r.pl >= 0 ? '+$' : '−$') + fmt(Math.abs(r.pl)), x + 40, ry + 58, { w: 700, size: 34, color: r.pl >= 0 ? AX.mint : AX.red, align: 'left' });
      ctx.restore();
    });
    ctx.restore(); return h;
  };
  // a live price with a rising line (mint = gain)
  U2.price = (ctx, x, y, w, t, t0, o = {}) => {
    const u = sp(t, t0, 2.6, 0.6); if (u <= 0) return 0; const h = 300;
    ctx.save(); ctx.globalAlpha *= clamp((t - t0) / 0.12); ctx.translate(0, (1 - u) * 60);
    glass(ctx, x, y, w, h, { tone: 'dark', r: 30, ch: 40, corner: 'tl', glint: o.glint });
    lat(ctx, o.sym || 'EUR/USD', x + w - 40, y + 70, { w: 700, size: 34, color: 'rgba(255,255,255,0.7)', align: 'right' });
    lat(ctx, fmt(o.price || 1.0874, 4), x + w - 40, y + 170, { w: 800, size: 88, color: '#FFFFFF', align: 'right' });
    lat(ctx, '▲ ' + (o.chg || '+0.12%'), x + w - 40, y + 234, { w: 600, size: 30, color: AX.mint, align: 'right' });
    const d = K.co(t, t0 + 0.1, 0.9), n = 40, X0 = x + 40, X1 = x + w * 0.5, Y0 = y + 236, Y1 = y + 90;
    ctx.beginPath(); for (let i = 0; i <= n * d; i++) { const f = i / n, yy = lerp(Y0, Y1, f) + Math.sin(i * 1.7) * 14 + Math.sin(i * 0.6) * 18 * (1 - f); i ? ctx.lineTo(lerp(X0, X1, f), yy) : ctx.moveTo(lerp(X0, X1, f), yy); }
    ctx.strokeStyle = AX.mint; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.restore(); return h;
  };

  G.U2 = U2;
})(window);
