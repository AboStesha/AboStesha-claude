// Gold series — glass layer: brand gradient swatches, drifting colour orbs, frosted-glass panels (real backdrop blur),
// the iridescent composer glow, metallic gold fills, typing with a caret trail, images, and a log-space camera.
(function (G) {
  const A = G.AX;
  const { W, H, C, clamp, lerp, hexA, mixHex } = A;

  // ---------- palette (Axi brand book «Combinations» swatches + the gold accent) ----------
  const P = {
    paper0: '#F7F7F4', paper1: '#ECEEEF',
    slate: ['#B5C7CC', '#EEF0F1'], lav: ['#C3C8DA', '#EEF0F1'], rose: ['#DCC8C7', '#EFEDED'], beige: ['#DCD8D1', '#EFEEEC'],
    slateD: ['#5B7077', '#8B9EA4'], lavD: ['#5F6380', '#989BB3'], roseD: ['#795C5D', '#A58B8A'], taupeD: ['#736754', '#A59A88'],
    gold0: '#F6E2A4', gold1: '#E2BE62', gold2: '#C49A3A', gold3: '#9C7426', goldInk: '#7A5A17',
    glowCols: ['#F1C75B', '#EFA9A4', '#B3B7EA', '#8FC3D2', '#F1C75B'],
  };
  const swatch = (ctx, name, o = {}) => {
    const s = P[name] || [P.paper0, P.paper1]; const g = ctx.createLinearGradient(0, o.y0 == null ? 0 : o.y0, 0, o.y1 == null ? H : o.y1);
    g.addColorStop(0, s[0]); g.addColorStop(1, s[1]); return g;
  };
  function bg(ctx, name, o = {}) { ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha; ctx.fillStyle = name === 'paper' ? swatch(ctx, 'x', {}) : swatch(ctx, name); ctx.fillRect(0, 0, W, H); ctx.restore(); }
  // vertical metallic gold (top-lit), used for floods, bars and the accent
  function goldGrad(ctx, y0, y1, o = {}) {
    const g = ctx.createLinearGradient(0, y0, 0, y1); const k = o.sheen == null ? 0.5 : o.sheen;
    g.addColorStop(0, P.gold0); g.addColorStop(0.18 + 0.1 * k, P.gold1); g.addColorStop(0.55, P.gold2); g.addColorStop(0.8, mixHex(P.gold2, P.gold1, 0.6)); g.addColorStop(1, P.gold3); return g;
  }
  function goldFlat(ctx, y0, y1) { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#EBCF82'); g.addColorStop(1, '#D3AE55'); return g; }

  // ---------- soft colour orbs (they give the glass something to refract) ----------
  function orbs(ctx, t, list, o = {}) {
    ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    for (const b of list) {
      const x = b.x + Math.sin(t * (b.sx || 0.21) + (b.p || 0)) * (b.ax || 60), y = b.y + Math.cos(t * (b.sy || 0.17) + (b.p || 0)) * (b.ay || 40);
      const g = ctx.createRadialGradient(x, y, 0, x, y, b.r); g.addColorStop(0, hexA(b.c, b.a == null ? 0.55 : b.a)); g.addColorStop(1, hexA(b.c, 0));
      ctx.fillStyle = g; ctx.fillRect(x - b.r, y - b.r, b.r * 2, b.r * 2);
    }
    ctx.restore();
  }

  // ---------- backdrop blur: snapshot what is already drawn (screen space), blurred at ¼ res ----------
  let BL = null, BLx = null, SM = null, SMx = null;
  function captureBlur(ctx, px = 9) {
    if (!BL) { SM = document.createElement('canvas'); SM.width = W / 4; SM.height = H / 4; SMx = SM.getContext('2d'); BL = document.createElement('canvas'); BL.width = W / 4; BL.height = H / 4; BLx = BL.getContext('2d'); }
    SMx.clearRect(0, 0, SM.width, SM.height); SMx.drawImage(ctx.canvas, 0, 0, SM.width, SM.height);
    BLx.clearRect(0, 0, BL.width, BL.height); BLx.filter = `blur(${px}px)`; BLx.drawImage(SM, 0, 0); BLx.filter = 'none';
    return BL;
  }
  // frosted glass panel. Path is built in the current (camera) transform; the blurred backdrop is laid in screen space.
  function panel(ctx, x, y, w, h, r, o = {}) {
    const a = o.alpha == null ? 1 : o.alpha; if (a <= 0 || w <= 0 || h <= 0) return;
    const ga = ctx.globalAlpha;
    ctx.save(); ctx.globalAlpha = ga * a;
    // shadow
    if (o.shadow !== false) { ctx.save(); ctx.shadowColor = `rgba(40,52,64,${0.16 * (o.shadow == null ? 1 : o.shadow)})`; ctx.shadowBlur = 50; ctx.shadowOffsetY = 18; A.roundRect(ctx, x, y, w, h, r); ctx.fillStyle = 'rgba(255,255,255,0.01)'; ctx.fill(); ctx.restore(); }
    ctx.save(); A.roundRect(ctx, x, y, w, h, r); ctx.clip();
    if (BL && o.frost !== false) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(BL, 0, 0, W, H); ctx.restore(); }
    ctx.fillStyle = o.tint || 'rgba(255,255,255,0.46)'; ctx.fillRect(x, y, w, h);
    const sh = ctx.createLinearGradient(0, y, 0, y + h); sh.addColorStop(0, 'rgba(255,255,255,0.55)'); sh.addColorStop(0.35, 'rgba(255,255,255,0.12)'); sh.addColorStop(1, 'rgba(255,255,255,0.04)');
    ctx.fillStyle = sh; ctx.fillRect(x, y, w, h);
    ctx.restore();
    A.roundRect(ctx, x + 0.75, y + 0.75, w - 1.5, h - 1.5, Math.max(0, r - 0.75)); ctx.strokeStyle = o.edge || 'rgba(255,255,255,0.85)'; ctx.lineWidth = o.edgeW || 1.6; ctx.stroke();
    ctx.restore();
  }
  // dark glass (eclipse) card, for photography
  function darkCard(ctx, x, y, w, h, r, o = {}) {
    const ga = ctx.globalAlpha; ctx.save(); ctx.globalAlpha = ga * (o.alpha == null ? 1 : o.alpha);
    ctx.save(); ctx.shadowColor = 'rgba(10,12,16,0.28)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24; A.roundRect(ctx, x, y, w, h, r); ctx.fillStyle = '#16171A'; ctx.fill(); ctx.restore();
    const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#1E2024'); g.addColorStop(1, '#0E0F12'); A.roundRect(ctx, x, y, w, h, r); ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
  }
  // Apple-Intelligence-style iridescent glow: a blurred conic gradient ring around a rounded rect, rotating with t
  function glow(ctx, x, y, w, h, r, t, o = {}) {
    const a = o.alpha == null ? 1 : o.alpha; if (a <= 0) return;
    const cx = x + w / 2, cy = y + h / 2; const g = ctx.createConicGradient(t * (o.speed || 0.9), cx, cy);
    const cols = o.cols || P.glowCols; cols.forEach((c, i) => g.addColorStop(i / (cols.length - 1), c));
    ctx.save(); ctx.globalAlpha *= a; ctx.filter = `blur(${o.blur || 26}px)`; A.roundRect(ctx, x, y, w, h, r); ctx.strokeStyle = g; ctx.lineWidth = o.width || 30; ctx.stroke(); ctx.filter = 'none';
    if (o.rim !== false) { A.roundRect(ctx, x, y, w, h, r); ctx.lineWidth = 2.2; ctx.globalAlpha *= 0.85; ctx.stroke(); }
    ctx.restore();
  }

  // ---------- images ----------
  const IMG = {}; const IMG_LIST = ['bars3d', 'bars_photo', 'silver', 'cocoa', 'cotton', 'forex3d', 'shares3d', 'crypto3d', 'indices3d', 'ipo3d'];
  function loadImages(base) {
    return Promise.all(IMG_LIST.map((n) => new Promise((res) => { const im = new Image(); im.onload = () => { IMG[n] = im; res(); }; im.onerror = () => res(); im.src = base + n + '.png'; })));
  }
  // draw an image to cover a box (object-fit: cover), optional focus (fx, fy in 0..1) and zoom
  function cover(ctx, name, x, y, w, h, o = {}) {
    const im = IMG[name]; if (!im) return; const z = o.zoom || 1; const s = Math.max(w / im.width, h / im.height) * z; const iw = im.width * s, ih = im.height * s;
    const fx = o.fx == null ? 0.5 : o.fx, fy = o.fy == null ? 0.5 : o.fy; ctx.drawImage(im, x + (w - iw) * fx, y + (h - ih) * fy, iw, ih);
  }

  // ---------- typing (RTL): reveal n characters, caret + gradient trail ----------
  // keys: [[t, n]] cumulative characters at times; returns the visible substring length
  function typed(s, t, t0, cps = 16, o = {}) {
    if (t < t0) return 0; const chars = Array.from(s); let n = 0, tt = t0;
    for (let i = 0; i < chars.length; i++) { const c = chars[i]; const d = (c === ' ' ? 1.6 : 1) / cps * (0.75 + 0.5 * ((i * 7919) % 13) / 13); tt += d; if (t >= tt) n = i + 1; else break; }
    return n;
  }
  function caret(ctx, x, y, size, t, o = {}) {
    const blink = o.solid ? 1 : (Math.sin(t * 9) > -0.2 ? 1 : 0.15); ctx.save(); ctx.globalAlpha *= blink; ctx.fillStyle = o.color || C.red; ctx.fillRect(x - 1.5, y - size * 0.95, 3, size * 1.25); ctx.restore();
  }
  function trail(ctx, x, y, size, len, o = {}) { // to the right of the caret (RTL text grows leftwards)
    const g = ctx.createLinearGradient(x, 0, x + len, 0); g.addColorStop(0, hexA(o.color || '#B3B7EA', 0.75)); g.addColorStop(1, hexA(o.color || '#B3B7EA', 0));
    ctx.save(); ctx.fillStyle = g; ctx.fillRect(x, y - size * 0.95, len, size * 1.25); ctx.restore();
  }

  // ---------- camera: keys [t, zoom, x, y] (x,y = world point at screen centre); cubic in-out per segment, zoom in log space ----------
  const cio = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  function camAt(keys, t) {
    if (t <= keys[0][0]) return keys[0].slice(1);
    for (let i = 1; i < keys.length; i++) {
      const a = keys[i - 1], b = keys[i];
      if (t <= b[0]) {
        if (b[4] === 'hold' || b[0] === a[0]) return a.slice(1);
        const p = cio(clamp((t - a[0]) / (b[0] - a[0]))); return [Math.exp(lerp(Math.log(a[1]), Math.log(b[1]), p)), lerp(a[2], b[2], p), lerp(a[3], b[3], p)];
      }
    }
    return keys[keys.length - 1].slice(1, 4);
  }
  function applyCam(ctx, cam) { const [z, x, y] = cam; ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-x, -y); }

  G.GL = { P, swatch, bg, goldGrad, goldFlat, orbs, captureBlur, panel, darkCard, glow, IMG, loadImages, cover, typed, caret, trail, camAt, applyCam, cio };
})(typeof window !== 'undefined' ? window : globalThis);
