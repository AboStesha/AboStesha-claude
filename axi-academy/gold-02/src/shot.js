// Gold series · Lesson 02 — «شنو يحرّك سعر الذهب» — ONE unbroken take tied together by ONE gold thread.
// Shot engine: paper, camera, the thread layer, chapter panels that open out of the thread and fold back into it,
// Lism-style section label (top-left), source captions, brand marks re-inked over dark panels.
(function (G) {
  const A = G.AX, F = G.FILM, FX = G.FX, K = G.KIT, GL = G.GL, TH = G.TH;
  const { W, H, C, clamp, lerp, hexA, txt, lat, mixHex } = A;
  const cio = (t, t0, d) => GL.cio(clamp((t - t0) / d));
  const sp = (t, t0, wv = 14, z = 0.55) => FX.springU(t - t0, wv, z);

  const SH = G.SHOT = { st: [], cam: [[0, 1, 960, 540]], divs: [], labels: [], src: [], util: {} };
  G.HUD_STYLE = 'none';
  F.chapters.push({ t: F.OFF, label: 'شنو يحرّك سعر الذهب' });
  const Y0 = SH.Y0 = 600; // the thread's resting height (agenda line, chapter panels)

  // ---------------------------------------------------------------- camera
  let camSorted = false;
  const camAt = (t) => { if (!camSorted) { SH.cam.sort((a, b) => a[0] - b[0]); camSorted = true; } return GL.camAt(SH.cam, t); };
  const toScreen = (cam, x, y) => [(x - cam[1]) * cam[0] + W / 2, (y - cam[2]) * cam[0] + H / 2];

  // ---------------------------------------------------------------- text helpers
  const rise = (ctx, words, y, t, o = {}) => { const oo = Object.assign({ mode: 'rise', stagger: 0.018 }, o); if (o.cx != null) oo.x = o.cx + K.wordsWidth(words, { size: o.size || 56, w: o.w || 'R' }) / 2; return K.cap(ctx, words, y, t, oo); };
  const head = (ctx, words, y, t, o = {}) => { const oo = Object.assign({ mode: 'rise', stagger: 0.03 }, o); if (o.cx != null) oo.x = o.cx + K.wordsWidth(words, { size: o.size || 150, w: o.w || 'X' }) / 2; return K.head(ctx, words, y, t, oo); };
  // words rising out of a line: clipped above y (or below when o.below)
  function fromLine(ctx, yLine, fn, o = {}) { ctx.save(); ctx.beginPath(); if (o.below) ctx.rect(-4000, yLine + (o.gap || 6), 12000, 4000); else ctx.rect(-4000, -4000, 12000, yLine - (o.gap || 6) + 4000); ctx.clip(); fn(); ctx.restore(); }
  // Lism-style token: ink rounded rect, white Inter (or Arabic) text. x = centre unless o.align
  function tok(ctx, s, x, y, o = {}) {
    const p = o.p == null ? 1 : o.p; if (p <= 0) return 0; const size = o.size || 24; const latin = o.latin !== false && /^[\x20-\x7E·×−→←≈%$€]+$/.test(s);
    const tw = latin ? (() => { ctx.save(); ctx.font = `600 ${size}px IN`; const m = ctx.measureText(s).width; ctx.restore(); return m; })() : A.measure(ctx, s, size, 'S');
    const w = tw + size * 1.2, h = size * 1.75; const cx = o.align === 'right' ? x - w / 2 : o.align === 'left' ? x + w / 2 : x;
    ctx.save(); ctx.translate(cx, y); const k = lerp(0.7, 1, Math.min(1, p)); ctx.scale(k, k); ctx.globalAlpha *= clamp(p * 2.5) * (o.alpha == null ? 1 : o.alpha);
    A.roundRect(ctx, -w / 2, -h / 2, w, h, o.r == null ? 8 : o.r); ctx.fillStyle = o.fill || C.ink; ctx.fill();
    if (o.stroke) { ctx.strokeStyle = o.stroke; ctx.lineWidth = 2; ctx.stroke(); }
    if (latin) lat(ctx, s, 0, size * 0.36, { size, w: 600, color: o.color || '#FFFFFF', align: 'center' }); else txt(ctx, s, 0, size * 0.36, { size, w: 'S', color: o.color || '#FFFFFF', align: 'center' });
    ctx.restore(); return w;
  }
  // outline chip (paper fill, ink hairline) — Arabic labels on diagrams
  function chip(ctx, s, x, y, o = {}) {
    const p = o.p == null ? 1 : o.p; if (p <= 0) return 0; const size = o.size || 26; const tw = A.measure(ctx, s, size, o.w || 'S'); const w = tw + size * 1.5 + (o.dot ? size * 0.84 : 0), h = size * 2.0;
    ctx.save(); ctx.translate(x, y); const k = Math.min(1.05, p); ctx.scale(k, k); ctx.globalAlpha *= clamp(p * 3) * (o.alpha == null ? 1 : o.alpha);
    A.roundRect(ctx, -w / 2, -h / 2, w, h, o.r == null ? h / 2 : o.r); ctx.fillStyle = o.fill || 'rgba(255,255,255,0.9)'; ctx.fill(); ctx.strokeStyle = o.line || hexA(C.ink, 0.85); ctx.lineWidth = o.lw || 2; ctx.stroke();
    // RTL: [pad][dot][gap][text][pad] from the right
    const right = w / 2 - size * 0.75; const tr = o.dot ? right - size * 0.84 : right; txt(ctx, s, tr, size * 0.36, { size, w: o.w || 'S', color: o.color || C.ink });
    if (o.dot) { ctx.fillStyle = o.dot; ctx.beginPath(); ctx.arc(right - size * 0.22, 0, size * 0.22, 0, 6.283); ctx.fill(); }
    ctx.restore(); return w;
  }
  // a dashed guide line
  function dash(ctx, x0, y0, x1, y1, o = {}) { ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha; ctx.setLineDash(o.d || [10, 9]); ctx.lineDashOffset = o.off || 0; ctx.strokeStyle = o.color || hexA(C.ink, 0.45); ctx.lineWidth = o.w || 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + (x1 - x0) * clamp(o.p == null ? 1 : o.p), y0 + (y1 - y0) * clamp(o.p == null ? 1 : o.p)); ctx.stroke(); ctx.restore(); }
  // rolling number (frame-quantised so motion blur never smears digits)
  const roll = (t, t0, d, a, b) => { const tq = Math.ceil(t * 60 - 1e-6) / 60; return lerp(a, b, A.eo(tq, t0, d)); };
  SH.util = { cio, sp, camAt, toScreen, rise, head, fromLine, tok, chip, dash, roll };

  // ---------------------------------------------------------------- chapter panels (open out of the thread, fold back into it)
  // { t0 open, t1 fold, y (thread height), sw swatch, idx '01', words [{s,t}], dur }
  const OPEN = 0.5, FOLD = 0.48;
  function panelSpan(dv, t) {
    const po = cio(t, dv.t0, OPEN), pc = cio(t, dv.t1, FOLD); const k = po * (1 - pc);
    return { top: lerp(dv.y, -30, k), bot: lerp(dv.y, H + 30, k), k };
  }
  const activeDiv = (t) => SH.divs.find((d) => t >= d.t0 && t < d.t1 + FOLD);
  function panel(ctx, dv, t) {
    const { top, bot } = panelSpan(dv, t); if (bot - top < 0.5) return;
    ctx.save(); ctx.beginPath(); ctx.rect(-10, top, W + 20, bot - top); ctx.clip();
    if (dv.sw === 'ink') { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1B1C20'); g.addColorStop(1, '#08090B'); ctx.fillStyle = g; } else ctx.fillStyle = GL.swatch(ctx, dv.sw);
    ctx.fillRect(-10, -10, W + 20, H + 20);
    // fine grid (Lism layout lines), very faint
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1.5; ctx.beginPath(); for (let x = 160; x < W; x += 320) { ctx.moveTo(x, 0); ctx.lineTo(x, H); } ctx.stroke();
    ctx.restore();
  }
  function panelTitle(ctx, dv, t) {
    const y = dv.y; const out = cio(t, dv.t1 - 0.05, 0.4);
    fromLine(ctx, y, () => {
      const dy = out * 230;
      ctx.save(); ctx.translate(0, dy);
      const pi = sp(t, dv.t0 + 0.18, 13, 0.6); if (pi > 0) lat(ctx, dv.idx, 960, y - 236 + (1 - Math.min(1, pi)) * 60, { size: 40, w: 600, color: hexA('#FFFFFF', 0.62), align: 'center', track: 2 });
      if (pi > 0) { ctx.fillStyle = hexA('#F1C75B', 0.9); ctx.fillRect(960 - 18, y - 214 + (1 - Math.min(1, pi)) * 60, 36, 4); }
      rise(ctx, dv.words, y - 70, t, { size: 124, w: 'S', color: '#FFFFFF', stagger: 0.03 });
      ctx.restore();
    }, { gap: 10 });
  }

  // ---------------------------------------------------------------- section label (top-left, Lism)
  function labelAt(t) { let cur = null, prev = null; for (const l of SH.labels) { if (l[0] <= t) { prev = cur; cur = l; } } return { cur, prev }; }
  function sectionLabel(ctx, t, ink) {
    const { cur, prev } = labelAt(t); if (!cur) return;
    const draw1 = (l, k, dy) => {
      if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; const x = 96, y = 104 + dy;
      const iw = lat(ctx, l[1], x, y, { size: 26, w: 600, color: mixHex('#939699', '#FFFFFF', ink * 0.6) });
      txt(ctx, l[2], x + iw + 16, y, { size: 30, w: 'S', color: mixHex(C.ink, '#FFFFFF', ink), align: 'left' });
      ctx.restore();
    };
    const pin = cio(t, cur[0], 0.35);
    if (prev && pin < 1) draw1(prev, 1 - pin, -pin * 26);
    draw1(cur, pin, (1 - pin) * 26);
  }

  // ---------------------------------------------------------------- source captions (bottom-right)
  function sources(ctx, t, ink) {
    for (const s of SH.src) {
      if (t < s.t0 - 0.05 || t > s.t1 + 0.4) continue; const k = cio(t, s.t0, 0.3) * (1 - cio(t, s.t1, 0.35)); if (k <= 0) continue;
      ctx.save(); ctx.globalAlpha *= k; const x = 1824, y = 1016 + (1 - k) * 14;
      const tw = txt(ctx, s.s, x, y, { size: 22, w: 'R', color: mixHex(C.slate, '#FFFFFF', ink) });
      ctx.fillStyle = '#C49A3A'; ctx.fillRect(x - tw - 22, y - 13, 10, 10);
      ctx.restore();
    }
  }

  // ---------------------------------------------------------------- the one shot
  // darkness of the frame under each brand mark (0 paper → 1 dark panel)
  function inkAt(t, yMark) { const dv = activeDiv(t); if (!dv) return 0; const { top, bot } = panelSpan(dv, t); return clamp((yMark - top) / 40) * clamp((bot - yMark) / 40); }
  F.scene({ name: 'shot', t0: 2.05, t1: F.CLOSE, ink: 'light', enter: { type: 'cut' },
    marksFn(ctx, t) { A.logo(ctx, 1843 - A.logoWidth(80), 50, 80, mixHex(C.ink, '#FFFFFF', inkAt(t, 90))); A.xmark(ctx, 115, 984, 69, mixHex(C.ink, '#FFFFFF', inkAt(t, 984)), 0.6); },
    draw(ctx, t) {
      const cam = camAt(t);
      GL.bg(ctx, 'paper');
      const act = SH.st.filter((s) => t >= s.t0 && t < s.t1);
      for (const s of act) if (s.screenBack) s.screenBack(ctx, t);
      ctx.save(); GL.applyCam(ctx, cam);
      const P = TH.at(t);
      const dv = activeDiv(t);
      for (const s of act) if (s.back) s.back(ctx, t, P);
      if (!dv) { TH.draw(ctx, P, { width: SH.width ? SH.width(t) : 6.5 }); for (const s of act) if (s.front) s.front(ctx, t, P); }
      else {
        for (const s of act) if (s.front) s.front(ctx, t, P);
        ctx.restore(); panel(ctx, dv, t); ctx.save(); GL.applyCam(ctx, cam);
        TH.draw(ctx, P, { width: SH.width ? SH.width(t) : 6.5, dark: true });
        for (const s of act) if (s.over) s.over(ctx, t, P);
        ctx.restore(); panelTitle(ctx, dv, t); ctx.save(); GL.applyCam(ctx, cam);
      }
      for (const s of act) if (s.top) s.top(ctx, t, P);
      ctx.restore();
      for (const s of act) if (s.screen) s.screen(ctx, t);
      sectionLabel(ctx, t, inkAt(t, 104));
      sources(ctx, t, inkAt(t, 1010));
    } });
})(typeof window !== 'undefined' ? window : globalThis);
// shared drawing bits used by every scene file
(function (G) {
  const A = G.AX, SH = G.SHOT; const { C, clamp, lerp, hexA } = A;
  // arrow from (x0,y0) toward (x1,y1), drawn to fraction p; o.dash for a dashed shaft
  SH.util.arrow = function (ctx, x0, y0, x1, y1, p, o = {}) {
    if (p <= 0) return; const x = lerp(x0, x1, clamp(p)), y = lerp(y0, y1, clamp(p)); const ang = Math.atan2(y1 - y0, x1 - x0); const s = o.head || 14;
    ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha; ctx.strokeStyle = o.color || C.ink; ctx.fillStyle = o.color || C.ink; ctx.lineWidth = o.w || 3; ctx.lineCap = 'round';
    if (o.dash) ctx.setLineDash(o.dash); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x - Math.cos(ang) * s * 0.6, y - Math.sin(ang) * s * 0.6); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(ang - 0.45) * s, y - Math.sin(ang - 0.45) * s); ctx.lineTo(x - Math.cos(ang + 0.45) * s, y - Math.sin(ang + 0.45) * s); ctx.closePath(); ctx.fill();
    ctx.restore();
  };
  // small chevron (up/down) — gains/losses markers
  SH.util.chev = function (ctx, x, y, s, dir, color, a = 1) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = color; ctx.lineWidth = Math.max(2.5, s * 0.22); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x - s * 0.55, y - dir * s * 0.28); ctx.lineTo(x, y + dir * s * 0.32); ctx.lineTo(x + s * 0.55, y - dir * s * 0.28); ctx.stroke(); ctx.restore(); };
  // Lism white card: paper-white fill, hairline, soft drop
  SH.util.card = function (ctx, x, y, w, h, o = {}) {
    const a = o.alpha == null ? 1 : o.alpha; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
    ctx.save(); ctx.shadowColor = 'rgba(30,36,44,0.10)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12; A.roundRect(ctx, x, y, w, h, o.r || 18); ctx.fillStyle = o.fill || '#FFFFFF'; ctx.fill(); ctx.restore();
    A.roundRect(ctx, x + 0.75, y + 0.75, w - 1.5, h - 1.5, (o.r || 18) - 0.75); ctx.strokeStyle = o.line || 'rgba(9,10,13,0.12)'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
  };
  // latin text width
  SH.util.latW = (ctx, s, size, wgt = 600) => { ctx.save(); ctx.font = `${wgt} ${size}px IN`; const m = ctx.measureText(s).width; ctx.restore(); return m; };
  // smooth window 0..1 on [a,b] with soft edges e
  SH.util.win = (x, a, b, e = 40) => clamp((x - a + e) / (2 * e)) * clamp((b - x + e) / (2 * e));
})(typeof window !== 'undefined' ? window : globalThis);
