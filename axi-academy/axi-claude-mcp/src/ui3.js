// ui3.js — the real connection screens from Axi's own walkthrough, rebuilt as simplified mock-ups for v2:
// Axi client portal (sign-in, Settings → MCP Management), Claude's Customize → Connectors, the two "Add custom
// connector" dialogs, the connector page (checking → expired → Reconnect → Connected with tool permissions),
// and the "Connect to Axi" consent. Claude-side screens use Claude's palette; Axi screens use Axi red with the
// portal's own yellow buttons. The Axi Iraq logo stands in for every Axi mark (never the X on its own) and
// Claude is written as text (no logo). Labels follow the walkthrough.
(function (G) {
  'use strict';
  const K = G.K, GL = G.GL;
  const { clamp, lerp, eo, sp, lat, rr, disc } = K;
  const { CL, AX, glass, PO, LO } = GL;
  const U3 = {};
  const YEL = '#F2D64B', INK = '#141413', GREY = '#73726C', LINE = 'rgba(20,20,19,0.10)', IVORY = '#FAF9F5', AXRED = '#C8102E';
  const T = (ctx, s, x, y, o = {}) => PO.draw(ctx, s, x, y, { w: o.w || 400, size: o.size || 26, color: o.color || INK, align: o.align || 'left', alpha: o.alpha });
  const TW = (ctx, s, o = {}) => PO.width(ctx, s, { w: o.w || 400, size: o.size || 26 });
  U3.colors = { YEL, INK, GREY, LINE, IVORY };

  // ---------------- small parts ----------------
  U3.btn = (ctx, x, y, w, h, label, o = {}) => {
    const p = o.press || 0, s = 1 - 0.06 * p, cx = x + w / 2, cy = y + h / 2;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    rr(ctx, x, y, w, h, o.r == null ? 12 : o.r);
    if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
    if (o.stroke) { ctx.lineWidth = 2; ctx.strokeStyle = o.stroke; ctx.stroke(); }
    T(ctx, label, cx, cy + (o.size || 26) * 0.36, { w: o.wt || 500, size: o.size || 26, color: o.color || '#FFFFFF', align: 'center' });
    if (o.glow > 0) { ctx.lineWidth = 4; ctx.strokeStyle = `rgba(217,119,87,${0.9 * o.glow})`; rr(ctx, x - 6, y - 6, w + 12, h + 12, (o.r == null ? 12 : o.r) + 6); ctx.stroke(); }
    ctx.restore();
  };
  U3.field = (ctx, x, y, w, label, value, o = {}) => {
    if (label) T(ctx, label, x, y, { size: o.ls || 22, color: GREY });
    const fy = y + (label ? 14 : 0), fh = o.h || 64;
    rr(ctx, x, fy, w, fh, 10); ctx.fillStyle = '#FFFFFF'; ctx.fill();
    ctx.lineWidth = o.focus ? 2.5 : 1.5; ctx.strokeStyle = o.focus ? (o.ring || INK) : 'rgba(20,20,19,0.18)'; ctx.stroke();
    if (o.flash > 0) { ctx.save(); rr(ctx, x, fy, w, fh, 10); ctx.clip(); ctx.fillStyle = `rgba(217,119,87,${0.22 * o.flash})`; ctx.fillRect(x, fy, w, fh); ctx.restore(); }
    const show = value || o.placeholder || '';
    const tw = show ? T(ctx, show, x + 18, fy + fh / 2 + 9, { size: o.size || 26, color: value ? INK : 'rgba(20,20,19,0.35)', w: o.mono ? 500 : 400 }) : 0;
    if (o.caret) { ctx.fillStyle = INK; ctx.fillRect(x + 20 + (value ? tw : 0), fy + 16, 2.5, fh - 32); }
    return fy + fh;
  };
  U3.radio = (ctx, x, y, on, o = {}) => {
    ctx.save(); ctx.lineWidth = 2.2; ctx.strokeStyle = on ? (o.color || CL.orange) : 'rgba(20,20,19,0.35)'; ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.stroke();
    if (on) disc(ctx, x, y, 6.5, o.color || CL.orange);
    if (o.glow > 0) { ctx.globalAlpha *= o.glow; ctx.lineWidth = 3; ctx.strokeStyle = CL.orange; ctx.beginPath(); ctx.arc(x, y, 20 + 6 * o.glow, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
  };
  U3.check = (ctx, x, y, s = 1, color = INK, lw = 4) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-11, 1); ctx.lineTo(-3, 9); ctx.lineTo(12, -8); ctx.stroke(); ctx.restore(); };
  U3.copyIcon = (ctx, x, y, o = {}) => { ctx.save(); ctx.strokeStyle = o.color || INK; ctx.lineWidth = 2.2; rr(ctx, x - 9, y - 12, 18, 22, 3); ctx.stroke(); rr(ctx, x - 3, y - 6, 18, 22, 3); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.stroke(); ctx.restore(); };
  U3.spinner = (ctx, x, y, t, r = 16, color = INK) => { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, r, t * 7, t * 7 + Math.PI * 1.4); ctx.stroke(); ctx.restore(); };
  // the Axi Iraq logo on a small tile (used wherever Axi's product shows its mark)
  U3.axiTile = (ctx, cx, cy, s, o = {}) => {
    ctx.save(); rr(ctx, cx - s / 2, cy - s / 2, s, s, s * 0.2); ctx.fillStyle = o.fill || AXRED; ctx.fill();
    K.logoIQ(ctx, cx, cy, s * 0.72, { color: o.ink || '#FFFFFF' }); ctx.restore();
  };
  U3.claudeTile = (ctx, cx, cy, s, o = {}) => {
    ctx.save(); rr(ctx, cx - s / 2, cy - s / 2, s, s, s * 0.2); ctx.fillStyle = o.fill || CL.orange; ctx.fill();
    PO.draw(ctx, o.label || 'CL', cx, cy + s * 0.13, { w: 500, size: s * 0.36, color: '#FFFFFF' }); ctx.restore();
  };

  // ---------------- window frame: a glass browser window; returns the content rect ----------------
  U3.win = (ctx, x, y, w, h, o = {}) => {
    glass(ctx, x, y, w, h, { tone: o.tone || 'white', r: 34, glint: o.glint, lift: 1 });
    const bar = 78;
    ctx.save();
    [0, 1, 2].forEach((i) => disc(ctx, x + 40 + i * 26, y + bar / 2, 8, 'rgba(20,20,19,0.18)'));
    rr(ctx, x + 132, y + 16, w - 172, bar - 32, (bar - 32) / 2); ctx.fillStyle = 'rgba(255,255,255,0.72)'; ctx.fill();
    ctx.globalAlpha *= o.urlAlpha == null ? 1 : o.urlAlpha; T(ctx, o.url || '', x + 162, y + bar / 2 + 9, { size: 24, color: GREY });
    ctx.restore();
    return { x: x + 14, y: y + bar, w: w - 28, h: h - bar - 14 };
  };
  // fill the content rect with the page colour (rounded at the bottom)
  const page = (ctx, R, color) => { ctx.save(); ctx.beginPath(); ctx.roundRect(R.x, R.y, R.w, R.h, [6, 6, 24, 24]); ctx.fillStyle = color; ctx.fill(); ctx.restore(); };

  // ---------------- Axi client portal ----------------
  U3.axiLogin = (ctx, R, t, o = {}) => {
    page(ctx, R, '#F6F6F4');
    const cw = Math.min(700, R.w - 120), cx = R.x + R.w / 2, x = cx - cw / 2, y = R.y + (o.top || 120);
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.12)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 12; rr(ctx, x, y, cw, 640, 22); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.restore();
    K.logoIQ(ctx, cx, y + 110, 220, { color: AXRED });
    T(ctx, 'Log in', cx, y + 230, { size: 34, align: 'center' });
    U3.field(ctx, x + 50, y + 290, cw - 100, 'Email address', o.email || '', { focus: o.focus === 'email', caret: o.focus === 'email' && o.caret, placeholder: 'Email address' });
    U3.field(ctx, x + 50, y + 405, cw - 100, 'Password', o.pass || '', { focus: o.focus === 'pass', caret: o.focus === 'pass' && o.caret, placeholder: 'Password' });
    U3.btn(ctx, x + 50, y + 530, cw - 100, 72, 'Login', { fill: YEL, color: INK, press: o.press, size: 28 });
    return { login: [cx, y + 566], email: [x + 260, y + 336], pass: [x + 260, y + 451] };
  };
  U3.axiSettings = (ctx, R, t, o = {}) => {
    page(ctx, R, '#FFFFFF');
    ctx.save(); ctx.beginPath(); ctx.roundRect(R.x, R.y, R.w, 96, [6, 6, 0, 0]); ctx.fillStyle = AXRED; ctx.fill(); ctx.restore();
    K.logoIQ(ctx, R.x + 110, R.y + 48, 120, { color: '#FFFFFF' });
    ctx.fillStyle = '#1C1C1E'; ctx.fillRect(R.x, R.y + 96, 92, R.h - 120);
    for (let i = 0; i < 6; i++) { rr(ctx, R.x + 28, R.y + 140 + i * 110, 36, 36, 8); ctx.fillStyle = i === 5 ? '#FFFFFF' : 'rgba(255,255,255,0.32)'; ctx.fill(); }
    const x = R.x + 132, w = R.w - 170;
    T(ctx, 'Settings', x, R.y + 186, { size: 46, w: 500 });
    const tabs = ['Profile', 'Statements', 'MCP Management']; let tx = x;
    tabs.forEach((s, i) => { const tw = TW(ctx, s, { size: 26, w: 500 }); T(ctx, s, tx, R.y + 262, { size: 26, w: 500, color: i === o.tab ? INK : GREY }); if (i === o.tab) { ctx.fillStyle = INK; ctx.fillRect(tx - 4, R.y + 280, tw + 8, 4); } if (o.tabHint > 0 && i === 2 && o.tab !== 2) { ctx.save(); ctx.globalAlpha *= o.tabHint; ctx.strokeStyle = CL.orange; ctx.lineWidth = 3; rr(ctx, tx - 14, R.y + 226, tw + 28, 52, 26); ctx.stroke(); ctx.restore(); } tx += tw + 54; });
    ctx.fillStyle = LINE; ctx.fillRect(x - 40, R.y + 284, w + 40, 2);
    const pos = { tab2: [x + TW(ctx, 'Profile', { size: 26, w: 500 }) + TW(ctx, 'Statements', { size: 26, w: 500 }) + 108 + 100, R.y + 252] };
    if (o.tab !== 2) { [0, 1, 2].forEach((i) => { rr(ctx, x, R.y + 340 + i * 90, w * (0.8 - i * 0.15), 28, 14); ctx.fillStyle = 'rgba(20,20,19,0.08)'; ctx.fill(); }); return pos; }
    const a = clamp(o.reveal == null ? 1 : o.reveal); ctx.save(); ctx.globalAlpha *= a;
    T(ctx, 'Connect MCP Client', x, R.y + 362, { size: 32, w: 600 });
    T(ctx, 'Paste your MCP server URL into', x, R.y + 408, { size: 25, color: GREY });
    T(ctx, "your Claude's settings.", x, R.y + 444, { size: 25, color: GREY });
    T(ctx, 'Your MCP server URL', x, R.y + 520, { size: 28, w: 600 });
    rr(ctx, x, R.y + 548, w, 84, 14); ctx.fillStyle = '#F7F7F5'; ctx.fill(); ctx.lineWidth = o.copied ? 2.5 : 1.5; ctx.strokeStyle = o.copied ? CL.orange : 'rgba(20,20,19,0.12)'; ctx.stroke();
    T(ctx, 'https://mcp.axi.com/mcp', x + 24, R.y + 600, { size: 30, w: 500 });
    U3.copyIcon(ctx, x + w - 46, R.y + 590, { color: o.copied ? CL.orange : INK });
    if (o.copied) { const ca = clamp(o.copied); ctx.save(); ctx.globalAlpha *= ca; rr(ctx, x + w - 190, R.y + 486, 150, 46, 23); ctx.fillStyle = INK; ctx.fill(); T(ctx, 'Copied', x + w - 115, R.y + 518, { size: 22, color: '#FFFFFF', align: 'center', w: 500 }); ctx.restore(); }
    T(ctx, 'Your MCP client', x, R.y + 720, { size: 28, w: 600 });
    rr(ctx, x, R.y + 748, w, 110, 16); ctx.fillStyle = '#F7F7F5'; ctx.fill();
    U3.claudeTile(ctx, x + 56, R.y + 803, 60, { label: 'C' });
    T(ctx, 'Claude', x + 104, R.y + 813, { size: 30, w: 500 });
    U3.btn(ctx, x + w - 200, R.y + 772, 176, 64, 'Connect', { stroke: INK, color: INK, press: o.connectPress, size: 26, glow: o.connectGlow });
    ctx.restore();
    pos.copy = [x + w - 40, R.y + 594]; pos.connect = [x + w - 112, R.y + 806];
    return pos;
  };

  // ---------------- Claude: Customize → Connectors ----------------
  U3.claudeCustomize = (ctx, R, t, o = {}) => {
    page(ctx, R, IVORY);
    const x = R.x + 48, w = R.w - 96;
    T(ctx, 'Customize', x, R.y + 118, { size: 46, w: 500 });
    const tabs = ['Skills', 'Connectors', 'Plugins']; let tx = x; const tabPos = [];
    tabs.forEach((s, i) => { const tw = TW(ctx, s, { size: 26, w: 500 }); if (i === o.tab) { rr(ctx, tx - 16, R.y + 162, tw + 32, 52, 12); ctx.fillStyle = '#ECEAE2'; ctx.fill(); } T(ctx, s, tx, R.y + 197, { size: 26, w: 500, color: i === o.tab ? INK : GREY }); tabPos.push([tx + tw / 2, R.y + 188]); tx += tw + 48; });
    if (o.tabHint > 0) { const p = tabPos[1]; ctx.save(); ctx.globalAlpha *= o.tabHint; ctx.strokeStyle = CL.orange; ctx.lineWidth = 3; rr(ctx, p[0] - 100, p[1] - 34, 200, 64, 16); ctx.stroke(); ctx.restore(); }
    // search + Add
    ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x + w - 168, R.y + 186, 13, 0, Math.PI * 2); ctx.moveTo(x + w - 158, R.y + 196); ctx.lineTo(x + w - 148, R.y + 206); ctx.stroke(); ctx.restore();
    U3.btn(ctx, x + w - 118, R.y + 158, 118, 58, 'Add', { fill: INK, color: '#FFFFFF', press: o.addPress, size: 26, glow: o.addGlow });
    T(ctx, 'Popular', x, R.y + 290, { size: 26, color: GREY });
    for (let i = 0; i < 2; i++) { rr(ctx, x + i * (w / 2 + 8), R.y + 316, w / 2 - 8, 104, 16); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = LINE; ctx.stroke(); rr(ctx, x + i * (w / 2 + 8) + 24, R.y + 356, 140, 24, 12); ctx.fillStyle = 'rgba(20,20,19,0.08)'; ctx.fill(); }
    let fx = x; ['All', 'Connected', 'Not Connected'].forEach((s) => { T(ctx, s, fx, R.y + 486, { size: 24, color: GREY }); fx += TW(ctx, s, { size: 24 }) + 34; });
    ctx.fillStyle = LINE; ctx.fillRect(x, R.y + 512, w, 2);
    T(ctx, 'Connector', x, R.y + 552, { size: 22, color: GREY }); T(ctx, 'Type', x + w * 0.58, R.y + 552, { size: 22, color: GREY }); T(ctx, 'Status', x + w * 0.8, R.y + 552, { size: 22, color: GREY });
    for (let i = 0; i < 3; i++) { const ry = R.y + 580 + i * 96; ctx.fillStyle = LINE; ctx.fillRect(x, ry, w, 2); rr(ctx, x, ry + 32, 200 + 60 * (i % 2), 24, 12); ctx.fillStyle = 'rgba(20,20,19,0.08)'; ctx.fill(); }
    return { add: [x + w - 59, R.y + 187], tab1: tabPos[1] };
  };
  // dialog shell over a dimmed page; returns the dialog rect
  const dialog = (ctx, R, a, w, h) => {
    ctx.save(); ctx.globalAlpha *= clamp(a * 1.5); ctx.fillStyle = 'rgba(20,20,19,0.35)'; ctx.fillRect(R.x, R.y, R.w, R.h); ctx.restore();
    const dw = Math.min(w, R.w - 40), dx = R.x + (R.w - dw) / 2, dy = R.y + 60, s = lerp(0.94, 1, a);
    ctx.save(); ctx.globalAlpha *= clamp(a * 1.5); ctx.translate(dx + dw / 2, dy + h / 2); ctx.scale(s, s); ctx.translate(-(dx + dw / 2), -(dy + h / 2));
    ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 18; rr(ctx, dx, dy, dw, h, 24); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.shadowColor = 'transparent';
    return { x: dx, y: dy, w: dw, h };
  };
  U3.addConnector1 = (ctx, R, a, t, o = {}) => {
    if (a <= 0) return null;
    const D = dialog(ctx, R, a, 900, 760), x = D.x + 44, w = D.w - 88;
    T(ctx, 'Add custom connector', x, D.y + 76, { size: 36, w: 600 });
    ctx.save(); ctx.strokeStyle = GREY; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(D.x + D.w - 62, D.y + 50); ctx.lineTo(D.x + D.w - 42, D.y + 70); ctx.moveTo(D.x + D.w - 42, D.y + 50); ctx.lineTo(D.x + D.w - 62, D.y + 70); ctx.stroke(); ctx.restore();
    T(ctx, 'Connect Claude to your data and tools.', x, D.y + 130, { size: 24, color: GREY });
    U3.field(ctx, x, D.y + 186, w, 'Name', o.name || '', { focus: o.focus === 'name', caret: o.focus === 'name' && o.caret, placeholder: 'Name', size: 28 });
    T(ctx, 'Shown in the connectors list.', x, D.y + 296, { size: 21, color: GREY });
    U3.field(ctx, x, D.y + 348, w, 'Remote MCP server URL', o.url || '', { focus: o.focus === 'url', caret: o.focus === 'url' && o.caret, placeholder: 'https://', size: 28, flash: o.flash });
    T(ctx, 'The HTTPS address where the server accepts', x, D.y + 470, { size: 21, color: GREY });
    T(ctx, 'MCP requests.', x, D.y + 500, { size: 21, color: GREY });
    U3.btn(ctx, D.x + D.w - 44 - 190, D.y + 640, 190, 70, 'Continue', { fill: INK, color: '#FFFFFF', press: o.press, size: 26, alpha: o.name && o.url ? 1 : 0.45, glow: o.glow });
    U3.btn(ctx, D.x + D.w - 44 - 190 - 170, D.y + 640, 150, 70, 'Cancel', { stroke: 'rgba(20,20,19,0.25)', color: INK, size: 26 });
    ctx.restore();
    return { name: [x + 240, D.y + 232], url: [x + 300, D.y + 394], cont: [D.x + D.w - 139, D.y + 675] };
  };
  U3.addConnector2 = (ctx, R, a, t, o = {}) => {
    if (a <= 0) return null;
    const D = dialog(ctx, R, a, 900, 840), x = D.x + 44, w = D.w - 88;
    T(ctx, 'Add custom connector', x, D.y + 72, { size: 36, w: 600 });
    T(ctx, 'Axi MCP', x, D.y + 128, { size: 28, w: 600 }); T(ctx, 'https://mcp.axi.com/mcp', x, D.y + 162, { size: 22, color: GREY });
    ctx.fillStyle = LINE; ctx.fillRect(x, D.y + 184, w, 2);
    T(ctx, 'Authentication', x, D.y + 234, { size: 28, w: 600 });
    const A = ['Always required — Detected', 'Required when the server asks', 'None'];
    A.forEach((s, i) => { U3.radio(ctx, x + 14, D.y + 278 + i * 56, i === 0, { glow: i === 0 ? o.hiAuth : 0 }); T(ctx, s, x + 46, D.y + 287 + i * 56, { size: 25, w: i === 0 ? 500 : 400, color: i === 0 ? INK : GREY }); });
    T(ctx, 'OAuth client', x, D.y + 470, { size: 28, w: 600 });
    const B = ["Use Anthropic's hosted client metadata", 'No client ID — register automatically', 'Use your own OAuth client'];
    B.forEach((s, i) => { const yy = D.y + 514 + i * 56 + (i ? 22 : 0); U3.radio(ctx, x + 14, yy, i === 0, { glow: i === 0 ? o.hiOauth : 0 }); T(ctx, s, x + 46, yy + 9, { size: 25, w: i === 0 ? 500 : 400, color: i === 0 ? INK : GREY }); });
    T(ctx, 'Recommended', x + 46, D.y + 556, { size: 21, color: CL.orange, w: 500 });
    U3.btn(ctx, D.x + D.w - 44 - 150, D.y + 730, 150, 70, 'Add', { fill: INK, color: '#FFFFFF', press: o.press, size: 26, glow: o.glow });
    U3.btn(ctx, D.x + D.w - 44 - 150 - 170, D.y + 730, 150, 70, 'Back', { stroke: 'rgba(20,20,19,0.25)', color: INK, size: 26 });
    ctx.restore();
    return { add: [D.x + D.w - 119, D.y + 765], auth: [x + 14, D.y + 278], oauth: [x + 14, D.y + 514] };
  };
  // the connector's own page: o.state 'checking' | 'expired' | 'connected'
  U3.connector = (ctx, R, t, o = {}) => {
    page(ctx, R, IVORY);
    const x = R.x + 48, w = R.w - 96;
    T(ctx, '←  Connectors', x, R.y + 74, { size: 24, color: GREY });
    if (o.state !== 'connected') {
      const cx = R.x + R.w / 2, cy = R.y + 330;
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.12)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 8; rr(ctx, cx - 70, cy - 70, 140, 140, 30); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.restore();
      K.logoIQ(ctx, cx, cy, 104, { color: AXRED });
      if (o.state === 'checking') { U3.spinner(ctx, cx, cy + 140, t); T(ctx, 'Checking connection…', cx, cy + 210, { size: 28, align: 'center' }); }
      else {
        T(ctx, 'https://mcp.axi.com/mcp', cx, cy + 150, { size: 26, color: GREY, align: 'center' });
        T(ctx, 'Connection issue', cx, cy + 204, { size: 32, w: 600, align: 'center' });
        T(ctx, 'Connection has expired. You can', cx, cy + 252, { size: 25, color: GREY, align: 'center' });
        T(ctx, 'reconnect to re-authenticate.', cx, cy + 288, { size: 25, color: GREY, align: 'center' });
        U3.btn(ctx, cx - 110, cy + 330, 220, 72, 'Reconnect', { fill: INK, color: '#FFFFFF', press: o.press, size: 27, glow: o.glow });
      }
      return { reconnect: [cx, cy + 366] };
    }
    // connected
    U3.axiTile(ctx, x + 30, R.y + 150, 60);
    T(ctx, 'Axi MCP', x + 78, R.y + 161, { size: 32, w: 600 });
    U3.btn(ctx, x + w - 190, R.y + 120, 190, 62, 'Disconnect', { stroke: 'rgba(20,20,19,0.25)', color: INK, size: 24 });
    T(ctx, 'https://mcp.axi.com/mcp', x, R.y + 222, { size: 22, color: GREY });
    const ta = clamp(o.toast || 0);
    if (ta > 0) {
      ctx.save(); ctx.globalAlpha *= ta; ctx.translate(0, (1 - ta) * -30);
      glass(ctx, x, R.y + 262, w, 104, { tone: 'white', r: 52, lift: 0.5 });
      ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x + 58, R.y + 314, 17, 0, Math.PI * 2); ctx.stroke(); T(ctx, 'i', x + 58, R.y + 323, { size: 22, w: 600, align: 'center' });
      T(ctx, 'Connected to Axi MCP', x + 96, R.y + 325, { size: 30, w: 500 });
      U3.check(ctx, x + w - 54, R.y + 312, 1.2, INK, 4);
      ctx.restore();
    }
    const ly = R.y + 430, la = clamp(o.tools == null ? 1 : o.tools);
    ctx.save(); ctx.globalAlpha *= la;
    T(ctx, 'Tool permission', x, ly, { size: 28, w: 600 });
    T(ctx, 'Choose when Claude is allowed to use these tools.', x, ly + 38, { size: 21, color: GREY });
    T(ctx, '⌄  Read-only tools', x, ly + 100, { size: 25, w: 500 });
    rr(ctx, x + w - 236, ly + 66, 236, 52, 12); ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(20,20,19,0.25)'; ctx.stroke(); T(ctx, 'Need approval  ⌄', x + w - 118, ly + 101, { size: 22, align: 'center' });
    const TOOLS = ['Get Axi Account', 'Get Axi Accounts', 'Get Axi MT5 Available Markets', 'Get Axi MT5 Candles', 'Get Axi MT5 Order History', 'Get Axi MT5 Positions', 'Get Axi MT5 Quote'];
    TOOLS.forEach((s, i) => {
      const ry = ly + 150 + i * 58, ra = clamp((o.tools == null ? 9 : o.toolsT || 9) - i * 0.06); if (ra <= 0) return;
      T(ctx, s, x + 24, ry + 30, { size: 23, alpha: ra });
      for (let k = 0; k < 3; k++) { ctx.save(); ctx.globalAlpha *= ra * (k === 1 ? 1 : 0.4); ctx.strokeStyle = k === 1 ? CL.orange : INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x + w - 120 + k * 44, ry + 22, 13, 0, Math.PI * 2); ctx.stroke(); if (k === 1) disc(ctx, x + w - 120 + k * 44, ry + 22, 6, CL.orange); ctx.restore(); }
    });
    ctx.restore();
    return {};
  };

  // ---------------- Axi consent ----------------
  U3.axiConsent = (ctx, R, t, o = {}) => {
    page(ctx, R, '#F6F6F4');
    const cw = Math.min(760, R.w - 80), cx = R.x + R.w / 2, x = cx - cw / 2, y = R.y + 40, h = 870;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.12)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 12; rr(ctx, x, y, cw, h, 22); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.restore();
    K.logoIQ(ctx, cx, y + 80, 170, { color: AXRED });
    T(ctx, 'Connect to Axi', cx, y + 178, { size: 38, align: 'center', w: 500 });
    U3.axiTile(ctx, cx - 110, y + 274, 116); U3.claudeTile(ctx, cx + 110, y + 274, 116, { label: 'CL' });
    ctx.save(); ctx.strokeStyle = 'rgba(20,20,19,0.3)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 30, y + 264); ctx.lineTo(cx + 30, y + 264); ctx.lineTo(cx + 20, y + 254); ctx.moveTo(cx + 30, y + 286); ctx.lineTo(cx - 30, y + 286); ctx.lineTo(cx - 20, y + 296); ctx.stroke(); ctx.restore();
    T(ctx, 'Hi John,', cx, y + 378, { size: 25, align: 'center' });
    T(ctx, 'Client MCP is requesting access', cx, y + 418, { size: 25, align: 'center' });
    T(ctx, 'to your axi account.', cx, y + 450, { size: 25, align: 'center' });
    rr(ctx, x + 50, y + 476, cw - 100, 240, 14); ctx.lineWidth = 1.5; ctx.strokeStyle = LINE; ctx.stroke();
    ['Trading: read your trading', 'Trading_orders: write your orders', 'Trading_orders.live: write live orders', 'Allow offline access'].forEach((s, i) => {
      const ra = clamp(o.scopes == null ? 1 : (o.scopes - i * 0.12) / 0.2); if (ra <= 0) return;
      disc(ctx, x + 84, y + 524 + i * 54, 5, INK, ra); T(ctx, s, x + 104, y + 533 + i * 54, { size: 24, alpha: ra });
    });
    U3.btn(ctx, x + 50, y + 750, (cw - 120) / 2, 80, 'Decline', { stroke: INK, color: INK, size: 27 });
    U3.btn(ctx, x + 70 + (cw - 120) / 2, y + 750, (cw - 120) / 2, 80, 'Accept', { fill: YEL, color: INK, press: o.press, size: 27, glow: o.glow });
    return { accept: [x + 70 + (cw - 120) * 0.75, y + 790] };
  };

  // ---------------- chips from the walkthrough ----------------
  // [Axi Iraq logo  MT5 ✓] and [Claude ✓] glass chips
  U3.reqChip = (ctx, cx, cy, kind, o = {}) => {
    const w = o.w || 400, h = o.h || 130;
    glass(ctx, cx - w / 2, cy - h / 2, w, h, { tone: 'white', r: 30, glint: o.glint, lift: 0.8, alpha: o.alpha });
    ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    if (kind === 'axi') { K.logoIQ(ctx, cx - 92, cy, 120, { color: AXRED }); lat(ctx, 'MT5', cx + 40, cy + 16, { w: 600, size: 46, color: INK }); }
    else { LO.draw(ctx, 'Claude', cx - 24, cy + 18, { w: 600, size: 54, color: INK }); }
    U3.check(ctx, cx + w / 2 - 58, cy, 1.5, kind === 'axi' ? AXRED : CL.orange, 4.5);
    ctx.restore();
  };
  // the end-card chip from Axi's campaign: Claude with a switch turned on
  // drawn at 116 px tall and scaled to h; the switch lights up in Claude's terracotta. Returns the switch centre.
  U3.toggleChip = (ctx, cx, cy, on, o = {}) => {
    const w = o.w || 380, h = o.h || 116, k = h / 116, w0 = w / k, u = clamp(on);
    glass(ctx, cx - w / 2, cy - h / 2, w, h, { tone: o.tone || 'white', r: 28 * k, lift: 0.7, alpha: o.alpha, glint: o.glint });
    ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha; ctx.translate(cx, cy); ctx.scale(k, k);
    LO.draw(ctx, 'Claude', -52, 18, { w: 600, size: 52, color: INK });
    const sx = w0 / 2 - 110, sw = 84, sh = 46;
    rr(ctx, sx, -sh / 2, sw, sh, sh / 2); ctx.fillStyle = 'rgba(20,20,19,0.25)'; ctx.fill();
    if (u > 0) { ctx.save(); ctx.globalAlpha *= u; rr(ctx, sx, -sh / 2, sw, sh, sh / 2); ctx.fillStyle = CL.orange; ctx.fill(); ctx.restore(); }
    disc(ctx, sx + lerp(sh / 2, sw - sh / 2, u), 0, sh / 2 - 6, '#FFFFFF');
    ctx.restore();
    return [cx + (sx + sw / 2) * k, cy];
  };

  G.U3 = U3;
})(window);
