// UI pieces for the Axi × Claude videos: chat bubbles, data cards, the approval prompt, a cursor, and stylised
// mock-ups of Claude's connector screens and the Axi sign-in. They are generic dark-mode UI, not copies of either
// product. English UI labels are the ones in Axi's own setup guide ("Add", "Name", "Connect", …).
(function (G) {
  'use strict';
  const { W, H, C, clamp, lerp, inv, eo, co, cio, sp, ar, arW, lat, latW, mixLine, rr, disc, ring, glass, ripple, wheels } = G.K;
  const UI = {};
  const TXT = '#ECEDEF', SUB = '#9A9EA5', LINE = 'rgba(255,255,255,0.09)', PANEL = '#1B1C1F', FIELD = '#121316';
  UI.colors = { TXT, SUB, LINE, PANEL, FIELD };

  // characters typed by time t (code points), with a blinking caret flag
  UI.typed = (s, t, t0, cps = 18) => { const cs = [...s], n = Math.max(0, Math.min(cs.length, Math.floor((t - t0) * cps))); return { s: cs.slice(0, n).join(''), done: n >= cs.length, n }; };
  UI.caretOn = (t) => Math.floor(t * 2.6) % 2 === 0;

  // Latin UI text, left aligned by default
  UI.text = (ctx, s, x, y, o = {}) => lat(ctx, s, x, y, { w: o.w || 500, size: o.size || 28, color: o.color || TXT, align: o.align || 'left', alpha: o.alpha });

  // ---------------- containers ----------------
  // rounded app window; o.url shows a browser bar. Returns the content rect.
  UI.window = (ctx, x, y, w, h, o = {}) => {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24;
    rr(ctx, x, y, w, h, 30); ctx.fillStyle = PANEL; ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, x, y, w, h, 30); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.stroke(); ctx.restore();
    let top = y;
    if (o.url != null) {
      [0, 1, 2].forEach((i) => disc(ctx, x + 34 + i * 26, y + 38, 8, 'rgba(255,255,255,0.18)'));
      const bx = x + 120, bw = w - 150; rr(ctx, bx, y + 16, bw, 46, 23); ctx.fillStyle = FIELD; ctx.fill();
      UI.lock(ctx, bx + 26, y + 39, 0.9, SUB);
      const u = o.url; UI.text(ctx, u, bx + 48, y + 48, { size: 25, w: 500, color: o.urlColor || TXT });
      if (o.caret) { const tw = latW(ctx, u, { w: 500, size: 25 }); ctx.fillStyle = TXT; ctx.fillRect(bx + 50 + tw, y + 26, 3, 28); }
      ctx.fillStyle = LINE; ctx.fillRect(x, y + 78, w, 2); top = y + 80;
    }
    return { x, y: top, w, h: h - (top - y) };
  };
  UI.card = (ctx, x, y, w, h, o = {}) => glass(ctx, x, y, w, h, { r: o.r || 28, fill: o.fill || 'rgba(30,32,36,0.94)', stroke: o.stroke || 'rgba(255,255,255,0.12)', lw: 2 });

  // ---------------- controls ----------------
  // kind: 'primary' (light), 'ghost' (outline), 'red' (Axi CTA). press: 0..1 pressed amount
  UI.button = (ctx, cx, cy, w, h, label, o = {}) => {
    const k = o.kind || 'primary', p = o.press || 0, s = 1 - 0.06 * p;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    rr(ctx, -w / 2, -h / 2, w, h, o.r == null ? h / 2 : o.r);
    if (k === 'primary') { ctx.fillStyle = p > 0 ? '#D6D8DC' : '#F1F2F4'; ctx.fill(); }
    else if (k === 'red') { ctx.fillStyle = C.red; ctx.fill(); }
    else { ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.stroke(); }
    const col = k === 'primary' ? '#141518' : '#FFFFFF';
    if (o.arabic) ar(ctx, label, 0, (o.size || 28) * 0.36, { w: 600, size: o.size || 28, color: col, alpha: o.labelAlpha });
    else lat(ctx, label, 0, (o.size || 28) * 0.36, { w: 600, size: o.size || 28, color: col, alpha: o.labelAlpha });
    ctx.restore();
  };
  // input field with a label above; o.focus draws a ring, o.caret a caret after the value, o.flash a paste highlight
  UI.field = (ctx, x, y, w, label, value, o = {}) => {
    UI.text(ctx, label, x, y, { size: 24, w: 500, color: SUB });
    const fy = y + 16, fh = 72; rr(ctx, x, fy, w, fh, 16); ctx.fillStyle = FIELD; ctx.fill();
    ctx.lineWidth = o.focus ? 3 : 2; ctx.strokeStyle = o.focus ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.12)'; ctx.stroke();
    if (o.flash > 0) { ctx.save(); rr(ctx, x, fy, w, fh, 16); ctx.clip(); ctx.fillStyle = `rgba(255,255,255,${0.16 * o.flash})`; ctx.fillRect(x, fy, w, fh); ctx.restore(); }
    const tw = value ? UI.text(ctx, value, x + 22, fy + 47, { size: o.size || 30, w: 500, color: value ? TXT : SUB }) : 0;
    if (!value && o.placeholder) UI.text(ctx, o.placeholder, x + 22, fy + 47, { size: 28, w: 400, color: 'rgba(154,158,165,0.6)' });
    if (o.caret) { ctx.fillStyle = TXT; ctx.fillRect(x + 25 + tw, fy + 18, 3, 38); }
    return fy + fh;
  };
  // desktop arrow pointer; press 0..1
  UI.cursor = (ctx, x, y, o = {}) => {
    const s = (o.s || 1.25) * (1 - 0.12 * (o.press || 0));
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 34); ctx.lineTo(8.5, 26.5); ctx.lineTo(14.5, 40); ctx.lineTo(20.5, 37.5); ctx.lineTo(14.5, 24.5); ctx.lineTo(25.5, 24.5); ctx.closePath();
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3; ctx.fillStyle = '#FFFFFF'; ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.lineWidth = 2; ctx.strokeStyle = '#111215'; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.restore();
  };
  UI.tap = (ctx, x, y, t, t0) => ripple(ctx, x, y, t, t0, { r0: 6, r1: 70, w: 4, n: 2, dur: 0.45, a: 0.7 });
  // cursor path: list of [t, x, y, click?]; returns {x, y, press} at t (eases between keys; press pulses on clicks)
  UI.path = (keys, t) => {
    let i = 0; while (i < keys.length - 1 && t > keys[i + 1][0]) i++;
    const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)], u = b[0] > a[0] ? cio(t, a[0], b[0] - a[0]) : 1;
    let press = 0; keys.forEach((k) => { if (k[3]) { const d = t - k[0]; if (d > -0.04 && d < 0.2) press = Math.max(press, Math.sin(Math.PI * clamp((d + 0.04) / 0.24))); } });
    return { x: lerp(a[1], b[1], u), y: lerp(a[2], b[2], u), press };
  };

  // ---------------- chat ----------------
  // the person's message: Arabic text in a bubble on the right (xr = right edge). Returns the bubble height.
  UI.userBubble = (ctx, text, xr, y, o = {}) => {
    const size = o.size || 38, pad = 30, tw = text ? arW(ctx, text, { w: 400, size }) : 0, w = Math.max(90, tw + pad * 2), h = size * 1.9;
    ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    rr(ctx, xr - w, y, w, h, 30); ctx.fillStyle = 'rgba(255,255,255,0.11)'; ctx.fill();
    if (text) ar(ctx, text, xr - pad, y + h / 2 + size * 0.36, { w: 400, size, color: TXT, align: 'right' });
    if (o.caret) { ctx.fillStyle = TXT; ctx.fillRect(xr - pad - tw - 8, y + h / 2 - size * 0.55, 3, size * 1.1); }
    ctx.restore(); return h;
  };
  // the assistant's name, set as plain text (no logo), with optional thinking dots
  UI.assistant = (ctx, x, y, t, o = {}) => {
    lat(ctx, 'Claude', x, y, { w: 600, size: o.size || 28, color: SUB, align: o.align || 'right', alpha: o.alpha });
    if (o.thinking) { for (let i = 0; i < 3; i++) { const ph = (t * 3 - i * 0.22) % 1; disc(ctx, (o.align === 'left' ? x + 110 : x - 130) - i * 22, y - 10, 6, SUB, 0.35 + 0.65 * Math.max(0, Math.sin(Math.PI * ph))); } }
  };

  // ---------------- icons (stroke, centred at x,y; s = scale) ----------------
  const icon = (ctx, x, y, s, color, fn) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; fn(); ctx.restore(); };
  UI.check = (ctx, x, y, s = 1, color = TXT, a = 1) => icon(ctx, x, y, s, color, () => { ctx.globalAlpha *= a; ctx.lineWidth = 4.5; ctx.beginPath(); ctx.moveTo(-11, 1); ctx.lineTo(-3, 9); ctx.lineTo(12, -8); ctx.stroke(); });
  UI.lock = (ctx, x, y, s = 1, color = TXT) => icon(ctx, x, y, s, color, () => { ctx.lineWidth = 2.6; rr(ctx, -9, -3, 18, 14, 3); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -3, 6, Math.PI, 0); ctx.stroke(); });
  UI.shield = (ctx, x, y, s = 1, color = TXT) => icon(ctx, x, y, s, color, () => { ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(13, -10); ctx.lineTo(13, 1); ctx.quadraticCurveTo(12, 12, 0, 17); ctx.quadraticCurveTo(-12, 12, -13, 1); ctx.lineTo(-13, -10); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(-1, 5); ctx.lineTo(6, -4); ctx.stroke(); });
  UI.plug = (ctx, x, y, s = 1, color = TXT) => icon(ctx, x, y, s, color, () => { ctx.beginPath(); ctx.moveTo(-6, -16); ctx.lineTo(-6, -8); ctx.moveTo(6, -16); ctx.lineTo(6, -8); ctx.stroke(); rr(ctx, -12, -8, 24, 12, 4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 4); ctx.quadraticCurveTo(0, 16, -9, 17); ctx.stroke(); });
  UI.chart = (ctx, x, y, s = 1, color = TXT) => icon(ctx, x, y, s, color, () => { ctx.beginPath(); ctx.moveTo(-15, 10); ctx.lineTo(-6, 0); ctx.lineTo(1, 6); ctx.lineTo(14, -10); ctx.stroke(); ctx.beginPath(); ctx.moveTo(6, -10); ctx.lineTo(14, -10); ctx.lineTo(14, -2); ctx.stroke(); });
  UI.list = (ctx, x, y, s = 1, color = TXT) => icon(ctx, x, y, s, color, () => { [-9, 0, 9].forEach((yy) => { disc(ctx, -12, yy, 2.4, color); ctx.beginPath(); ctx.moveTo(-5, yy); ctx.lineTo(14, yy); ctx.stroke(); }); });
  UI.sliders = (ctx, x, y, s = 1, color = TXT) => icon(ctx, x, y, s, color, () => { [[-8, -4], [0, 6], [8, -2]].forEach(([xx, k]) => { ctx.beginPath(); ctx.moveTo(xx, -14); ctx.lineTo(xx, 14); ctx.stroke(); rr(ctx, xx - 4.5, k - 3.5, 9, 7, 2); ctx.fill(); }); });
  UI.clock = (ctx, x, y, s = 1, color = TXT) => icon(ctx, x, y, s, color, () => { ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(0, 0); ctx.lineTo(6, 4); ctx.stroke(); });
  UI.bolt = (ctx, x, y, s = 1, color = TXT) => icon(ctx, x, y, s, color, () => { ctx.beginPath(); ctx.moveTo(3, -16); ctx.lineTo(-9, 2); ctx.lineTo(0, 2); ctx.lineTo(-3, 16); ctx.lineTo(9, -2); ctx.lineTo(0, -2); ctx.closePath(); ctx.stroke(); });

  // draw fn(x, y, w) scaled by k around the card's top-right corner, so a card w px wide on screen gets k× bigger type
  UI.scaled = (ctx, x, y, w, k, fn) => { ctx.save(); ctx.translate(x + w, y); ctx.scale(k, k); const r = fn(-w / k, 0, w / k); ctx.restore(); return r; };

  // ---------------- data cards (illustrative numbers) ----------------
  const money = (v) => (v < 0 ? '−' : '+') + '$' + Math.abs(v).toFixed(2);
  const fmt = (v, d = 2) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  // a card that springs in from below; returns the eased appearance
  const pop = (t, t0) => sp(t, t0, 2.6, 0.62);
  UI.balanceCard = (ctx, x, y, w, t, t0, o = {}) => {
    const u = pop(t, t0); if (u <= 0) return 0; const h = 250;
    ctx.save(); ctx.globalAlpha *= clamp((t - t0) / 0.12); ctx.translate(0, (1 - u) * 60); UI.card(ctx, x, y, w, h);
    ar(ctx, 'رصيد الحساب', x + w - 40, y + 66, { w: 600, size: 32, color: SUB, align: 'right' });
    const v = (o.value || 12480.5) * co(t, t0 + 0.05, 0.7);
    lat(ctx, '$' + fmt(v), x + w - 40, y + 168, { w: 800, size: 84, color: TXT, align: 'right' });
    mixLine(ctx, [{ t: 'حساب' }, { t: 'MT5', lat: true }, { t: '· آكسي' }], x + w - 40, y + 218, { size: 26, lsize: 24, w: 400, lw: 600, color: SUB, align: 'right', gap: 8 });
    ctx.restore(); return h;
  };
  UI.positionsCard = (ctx, x, y, w, t, t0, rows) => {
    const u = pop(t, t0); if (u <= 0) return 0; const rh = 96, h = 92 + rows.length * rh;
    ctx.save(); ctx.globalAlpha *= clamp((t - t0) / 0.12); ctx.translate(0, (1 - u) * 60); UI.card(ctx, x, y, w, h);
    ar(ctx, 'صفقاتك المفتوحة', x + w - 40, y + 62, { w: 600, size: 32, color: SUB, align: 'right' });
    rows.forEach((r, i) => {
      const ry = y + 92 + i * rh, a = clamp((t - t0 - 0.12 - i * 0.08) / 0.15); if (a <= 0) return;
      ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = LINE; ctx.fillRect(x + 32, ry, w - 64, 2);
      lat(ctx, r.sym, x + w - 40, ry + 60, { w: 700, size: 34, color: TXT, align: 'right' });
      const sw = latW(ctx, r.sym, { w: 700, size: 34 });
      ar(ctx, r.side, x + w - 64 - sw, ry + 60, { w: 400, size: 30, color: SUB, align: 'right' });
      lat(ctx, r.vol, x + w * 0.38, ry + 60, { w: 500, size: 30, color: SUB, align: 'center' });
      lat(ctx, money(r.pl), x + 40, ry + 60, { w: 700, size: 34, color: r.pl >= 0 ? C.mint : C.red, align: 'left' });
      ctx.restore();
    });
    ctx.restore(); return h;
  };
  UI.priceCard = (ctx, x, y, w, t, t0, o) => {
    const u = pop(t, t0); if (u <= 0) return 0; const h = 300;
    ctx.save(); ctx.globalAlpha *= clamp((t - t0) / 0.12); ctx.translate(0, (1 - u) * 60); UI.card(ctx, x, y, w, h);
    lat(ctx, o.sym, x + w - 40, y + 70, { w: 700, size: 36, color: SUB, align: 'right' });
    lat(ctx, fmt(o.price, 4), x + w - 40, y + 168, { w: 800, size: 88, color: TXT, align: 'right' });
    lat(ctx, '▲ ' + o.chg, x + w - 40, y + 230, { w: 600, size: 32, color: C.mint, align: 'right' });
    // a live line drawing across the left part of the card
    const d = co(t, t0 + 0.1, 0.9), n = 40, X0 = x + 40, X1 = x + w * 0.5, Y0 = y + 230, Y1 = y + 90;
    ctx.beginPath(); for (let i = 0; i <= n * d; i++) { const f = i / n, yy = lerp(Y0, Y1, f) + Math.sin(i * 1.7) * 14 + Math.sin(i * 0.6) * 18 * (1 - f); i ? ctx.lineTo(lerp(X0, X1, f), yy) : ctx.moveTo(lerp(X0, X1, f), yy); }
    ctx.strokeStyle = C.mint; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.stroke();
    if (d > 0.02) { const f = Math.floor(n * d) / n, i = Math.floor(n * d); disc(ctx, lerp(X0, X1, f), lerp(Y0, Y1, f) + Math.sin(i * 1.7) * 14 + Math.sin(i * 0.6) * 18 * (1 - f), 8, C.mint); }
    ctx.restore(); return h;
  };
  UI.orderCard = (ctx, x, y, w, t, t0, o) => {
    const u = pop(t, t0); if (u <= 0) return 0; const h = 270;
    ctx.save(); ctx.globalAlpha *= clamp((t - t0) / 0.12); ctx.translate(0, (1 - u) * 60); UI.card(ctx, x, y, w, h);
    mixLine(ctx, [{ t: 'تعديل وقف الخسارة' }, { t: '·' }, { t: o.sym, lat: true }], x + w - 40, y + 66, { size: 32, lsize: 32, w: 600, lw: 700, color: SUB, align: 'right', gap: 12 });
    const k = co(t, t0 + 0.2, 0.4);
    lat(ctx, 'Stop Loss', x + w - 40, y + 140, { w: 500, size: 28, color: SUB, align: 'right' });
    rr(ctx, x + 40, y + 160, w - 80, 76, 16); ctx.fillStyle = FIELD; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = k > 0 && k < 1 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.14)'; ctx.stroke();
    lat(ctx, k < 0.5 ? (o.old || '—') : o.val, x + w - 66, y + 212, { w: 700, size: 38, color: k < 0.5 ? SUB : TXT, align: 'right', alpha: Math.abs(1 - 2 * k) * 0.5 + 0.5 });
    // the change is only proposed: it waits for the client's approval (shown in the next scene)
    const pa = clamp((t - t0 - 0.42) / 0.15);
    if (pa > 0) { ctx.save(); ctx.globalAlpha *= pa; UI.clock(ctx, x + 82, y + 198, 1.05, SUB); ar(ctx, 'بانتظار موافقتك', x + 110, y + 208, { w: 500, size: 28, color: SUB, align: 'left' }); ctx.restore(); }
    ctx.restore(); return h;
  };
  // Claude's approval prompt before an action; o.press time of the tap on "Allow once"
  UI.approvalCard = (ctx, x, y, w, t, t0, o = {}) => {
    const u = pop(t, t0); if (u <= 0) return 0; const h = 360;
    ctx.save(); ctx.globalAlpha *= clamp((t - t0) / 0.12); ctx.translate(0, (1 - u) * 60); UI.card(ctx, x, y, w, h, { stroke: 'rgba(255,255,255,0.22)' });
    UI.shield(ctx, x + w - 62, y + 64, 1.3, TXT);
    mixLine(ctx, [{ t: 'Claude', lat: true }, { t: 'يطلب موافقتك' }], x + w - 100, y + 76, { size: 38, lsize: 36, w: 600, lw: 700, color: TXT, align: 'right', gap: 12 });
    mixLine(ctx, o.action || [{ t: 'تعديل وقف الخسارة' }, { t: 'EUR/USD', lat: true }, { t: '←' }, { t: '1.0820', lat: true }], x + w - 40, y + 150, { size: 32, lsize: 30, w: 400, lw: 600, color: SUB, align: 'right', gap: 12 });
    ctx.fillStyle = LINE; ctx.fillRect(x + 32, y + 190, w - 64, 2);
    const pr = o.press != null ? clamp(1 - Math.abs(t - o.press) / 0.12) : 0, done = o.press != null && t > o.press + 0.12;
    UI.button(ctx, x + w - 40 - 150, y + 268, 300, 84, 'Allow once', { kind: 'primary', press: pr, size: 30 });
    UI.button(ctx, x + 40 + 110, y + 268, 220, 84, 'Deny', { kind: 'ghost', size: 30, alpha: done ? 0.35 : 1 });
    ctx.restore(); return h;
  };
  // a small success line: ✓ + Arabic text
  UI.done = (ctx, text, xr, y, t, t0, o = {}) => {
    const u = sp(t, t0, 3, 0.55); if (u <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp((t - t0) / 0.1);
    disc(ctx, xr - 26, y - 12, 26 * clamp(u), C.white); UI.check(ctx, xr - 26, y - 12, 1.05, '#0B0D0D', clamp(u * 2 - 1));
    ar(ctx, text, xr - 68, y, { w: 600, size: o.size || 34, color: TXT, align: 'right' });
    ctx.restore();
  };

  // ---------------- Claude connector screens (stylised) ----------------
  // the Connectors page inside a window rect R. o: {add: hover/press, axi: row state 0 none / 1 'Connect' / 2 connected, connectPress}
  UI.connectorsPage = (ctx, R, t, o = {}) => {
    const x = R.x + 44, w = R.w - 88;
    UI.text(ctx, 'Connectors', x, R.y + 92, { size: 46, w: 700 });
    UI.button(ctx, R.x + R.w - 44 - 80, R.y + 80, 160, 64, 'Add', { kind: 'ghost', size: 28, press: o.addPress || 0 });
    // list of existing connectors as quiet placeholders, then the Axi row once added
    const rows = o.axi ? 3 : 3;
    for (let i = 0; i < rows; i++) {
      const ry = R.y + 200 + i * 104; ctx.fillStyle = LINE; ctx.fillRect(x, ry, w, 2);
      rr(ctx, x, ry + 26, 52, 52, 14); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill();
      rr(ctx, x + 76, ry + 40, 180 + 60 * ((i * 37) % 3), 22, 11); ctx.fillStyle = 'rgba(255,255,255,0.10)'; ctx.fill();
    }
    if (o.axi) {
      const ry = R.y + 200 + 3 * 104, a = clamp(o.axiIn == null ? 1 : o.axiIn);
      ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = LINE; ctx.fillRect(x, ry, w, 2);
      rr(ctx, x - 14, ry + 10, w + 28, 92, 18); ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fill();
      rr(ctx, x, ry + 26, 60, 60, 14); ctx.fillStyle = '#0B0D0D'; ctx.fill(); G.K.logoIQ(ctx, x + 30, ry + 56, 44);
      UI.text(ctx, 'Axi', x + 82, ry + 66, { size: 32, w: 700 });
      rr(ctx, x + 150, ry + 38, 104, 38, 19); ctx.fillStyle = 'rgba(255,255,255,0.10)'; ctx.fill(); UI.text(ctx, 'Custom', x + 202, ry + 64, { size: 22, w: 600, color: SUB, align: 'center' });
      if (o.axi === 1) UI.button(ctx, x + w - 90, ry + 56, 180, 64, 'Connect', { kind: 'primary', size: 28, press: o.connectPress || 0 });
      else { disc(ctx, x + w - 150, ry + 56, 18, C.white); UI.check(ctx, x + w - 150, ry + 56, 0.75, '#0B0D0D'); UI.text(ctx, 'Connected', x + w - 122, ry + 66, { size: 26, w: 600, color: TXT }); }
      ctx.restore();
    }
  };
  // the small menu under "Add"
  UI.addMenu = (ctx, R, a, hover) => {
    if (a <= 0) return; const mx = R.x + R.w - 44 - 360, my = R.y + 122;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(0, (1 - a) * -12);
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; rr(ctx, mx, my, 360, 92, 18); ctx.fillStyle = '#26282C'; ctx.fill(); ctx.shadowColor = 'transparent';
    if (hover) { rr(ctx, mx + 8, my + 8, 344, 76, 12); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill(); }
    UI.text(ctx, 'Add custom connector', mx + 28, my + 56, { size: 27, w: 500 });
    ctx.restore();
  };
  // the "Add custom connector" dialog; o: {name, url, nameCaret, urlCaret, focus:'name'|'url', flash, addPress}
  UI.addDialog = (ctx, R, a, t, o = {}) => {
    if (a <= 0) return; const dw = R.w - 70, dx = R.x + 35, dy = R.y + 120, dh = 620;
    ctx.save(); ctx.globalAlpha *= clamp(a * 1.5); ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(R.x, R.y, R.w, R.h); ctx.restore();
    ctx.save(); ctx.globalAlpha *= clamp(a * 1.5); ctx.translate(R.x + R.w / 2, dy + dh / 2); const s = lerp(0.94, 1, a); ctx.scale(s, s); ctx.translate(-(R.x + R.w / 2), -(dy + dh / 2));
    ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 50; rr(ctx, dx, dy, dw, dh, 26); ctx.fillStyle = '#212226'; ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.stroke();
    const fx = dx + 40, fw = dw - 80;
    UI.text(ctx, 'Add custom connector', fx, dy + 76, { size: 38, w: 700 });
    UI.field(ctx, fx, dy + 150, fw, 'Name', o.name || '', { focus: o.focus === 'name', caret: o.nameCaret, placeholder: 'Connector name' });
    UI.field(ctx, fx, dy + 290, fw, 'Remote MCP server URL', o.url || '', { focus: o.focus === 'url', caret: o.urlCaret, flash: o.flash || 0, size: 27, placeholder: 'https://' });
    UI.text(ctx, 'Advanced settings  ›', fx, dy + 450, { size: 25, w: 500, color: SUB });
    UI.button(ctx, dx + dw - 40 - 80, dy + dh - 70, 160, 68, 'Add', { kind: 'primary', size: 28, press: o.addPress || 0, alpha: o.name && o.url ? 1 : 0.45 });
    UI.button(ctx, dx + dw - 40 - 80 - 200, dy + dh - 70, 180, 68, 'Cancel', { kind: 'ghost', size: 28 });
    ctx.restore();
    return { dx, dy, dw, dh };
  };
  // Axi sign-in card (stylised) and the approval screen. o.mix: 0 = sign in, 1 = approve; in between, the sign-in
  // content fades out and the approval content fades in under the same logo, and the red button keeps its fill
  // while its label changes.
  UI.axiLogin = (ctx, R, t, o = {}) => {
    const cx = R.x + R.w / 2, x = R.x + 60, w = R.w - 120, m = clamp(o.mix || 0), a0 = cio(1 - 2 * m, 0, 1), a1 = cio(2 * m - 1, 0, 1);
    G.K.logoIQ(ctx, cx, R.y + 150, 230);
    if (a0 > 0) {
      ctx.save(); ctx.globalAlpha *= a0; ctx.translate(0, -(1 - a0) * 24);
      UI.text(ctx, 'Log in to your Axi account', cx, R.y + 320, { size: 32, w: 600, align: 'center' });
      UI.field(ctx, x, R.y + 380, w, 'Email', o.email || '', { focus: o.focus === 'email' });
      UI.field(ctx, x, R.y + 520, w, 'Password', o.pass || '', { focus: o.focus === 'pass' });
      ctx.restore();
    }
    if (a1 > 0) {
      ctx.save(); ctx.globalAlpha *= a1; ctx.translate(0, (1 - a1) * 24);
      UI.text(ctx, 'Claude wants to connect', cx, R.y + 400, { size: 34, w: 600, align: 'center' });
      UI.text(ctx, 'to your Axi account', cx, R.y + 448, { size: 34, w: 600, align: 'center' });
      UI.plug(ctx, cx, R.y + 560, 2.2, TXT);
      ctx.restore();
    }
    if (m < 0.5) UI.button(ctx, cx, R.y + 720, w, 84, 'Log in', { kind: 'red', size: 30, press: o.pressLogin || 0, labelAlpha: a0 });
    else UI.button(ctx, cx, R.y + 720, w, 84, 'Approve', { kind: 'red', size: 30, press: o.pressApprove || 0, labelAlpha: a1 });
  };

  // ---------------- headings ----------------
  // step badge: big number + caption (RTL), progress segments above
  UI.stepHeader = (ctx, i, n, caption, t, t0, o = {}) => {
    const y = o.y || 300, u = eo(t, t0, 0.45);
    for (let k = 0; k < n; k++) { const sw = (W - 160 - (n - 1) * 12) / n, sx = W - 80 - (k + 1) * sw - k * 12; rr(ctx, sx, y - 120, sw, 8, 4); ctx.fillStyle = k < i ? 'rgba(255,255,255,0.85)' : k === i ? `rgba(255,255,255,${0.25 + 0.6 * u})` : 'rgba(255,255,255,0.16)'; ctx.fill(); }
    ctx.save(); ctx.globalAlpha *= u; ctx.translate(0, (1 - u) * 30);
    const num = String(i + 1).padStart(2, '0');
    lat(ctx, num, W - 80, y + 4, { w: 800, size: 92, color: TXT, align: 'right' });
    const nw = latW(ctx, num, { w: 800, size: 92 });
    const cy = o.sub ? y - 26 : y - 8;
    if (Array.isArray(caption)) mixLine(ctx, caption, W - 80 - nw - 30, cy, { size: o.size || 50, lsize: (o.size || 50) * 0.94, w: 600, lw: 700, color: TXT, align: 'right', gap: 14 });
    else ar(ctx, caption, W - 80 - nw - 30, cy, { w: 600, size: o.size || 50, color: TXT, align: 'right' });
    if (o.sub) { if (Array.isArray(o.sub)) mixLine(ctx, o.sub, W - 80 - nw - 30, y + 36, { size: 36, lsize: 34, w: 400, lw: 600, color: SUB, align: 'right', gap: 10 }); else ar(ctx, o.sub, W - 80 - nw - 30, y + 36, { w: 400, size: 36, color: SUB, align: 'right' }); }
    ctx.restore();
  };

  G.UI = UI;
})(window);
