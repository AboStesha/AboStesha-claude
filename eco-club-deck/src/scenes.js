/* Code-built scenes: no photos, no video. Every frame is drawn live in the browser.
   Vortex      a CSS-3D hall whose LED walls and ceiling are live canvases, with a canvas layer
               in front for the stage, beams and crowd. Modes: concert · show · match.
   Pac-Man     a hand-projected 3D neon maze; players walk inside it and ghosts chase them.
   Usage: Scenes.vortex(el) / Scenes.pacman(el) → { set(mode) }. Logical size 1600×900, cover-fit. */
(function () {
  'use strict';
  const TAU = Math.PI * 2, W = 1600, H = 900;
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rnd = seed => { let s = seed >>> 0 || 1; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296); };
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const smooth = t => t * t * (3 - 2 * t);
  const mod = (a, n) => ((a % n) + n) % n;
  const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  const cv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const beatAt = t => Math.pow(0.5 + 0.5 * Math.cos(t * TAU * 124 / 60), 6);

  /* ---------- host: cover-fit a 1600×900 box, ~30fps only while on screen ---------- */
  function host(el, build) {
    el.classList.add('sc');
    const box = document.createElement('div');
    box.className = 'sc-k';
    el.appendChild(box);
    const s = build(box);
    let t = REDUCE ? 9 : 0, last = 0, raf = 0, running = false, inView = false;
    const fit = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      const k = Math.max(w / W, h / H);
      box.style.transform = `translate(${(w - W * k) / 2}px,${(h - H * k) / 2}px) scale(${k})`;
      s.resize(k);
      s.frame(t, 0);
    };
    const loop = now => {
      raf = requestAnimationFrame(loop);
      const dt = (now - last) / 1000;
      if (dt < 1 / 36) return;
      last = now;
      t += Math.min(dt, 0.1);
      s.frame(t, Math.min(dt, 0.1));
    };
    const sync = () => {
      const want = inView && !document.hidden && !REDUCE;
      if (want && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
      else if (!want && running) { running = false; cancelAnimationFrame(raf); }
    };
    new ResizeObserver(fit).observe(el);
    new IntersectionObserver(es => { inView = es[es.length - 1].isIntersecting; sync(); }).observe(el);
    document.addEventListener('visibilitychange', sync);
    return {
      set(m) { s.set(m, !running); if (!running) s.frame(t, 0); },
      get mode() { return s.mode; },
    };
  }

  /* =====================================================================================
     VORTEX
     ===================================================================================== */
  const VX_COL = { concert: [93, 149, 255], show: [244, 184, 80], match: [105, 224, 142] };

  function vortex(box) {
    box.innerHTML = '<div class="vx-zoom"><div class="vx-cam"><div class="vx-room">' +
      ['back', 'left', 'right', 'ceil'].map(n => `<div class="vx-w vx-${n}"></div>`).join('') +
      '<div class="vx-w vx-floor"></div></div></div><canvas class="vx-fx"></canvas></div>';
    const zoom = box.querySelector('.vx-zoom');
    const floor = box.querySelector('.vx-floor');
    const dims = { back: [960, 440], left: [640, 440], right: [640, 440], ceil: [720, 480] };
    const walls = Object.keys(dims).map((n, i) => {
      const [w, h] = dims[n], c = cv(w, h);
      box.querySelector('.vx-' + n).appendChild(c);
      return { n, w, h, c, x: c.getContext('2d'), side: n === 'left' ? 1 : n === 'right' ? -1 : 0, seed: i * 1.7 };
    });
    const fx = box.querySelector('.vx-fx'), g = fx.getContext('2d');
    const art = showArt();
    const stands = { left: standsTex(640, 300, 3), right: standsTex(640, 300, 4), back: standsTex(960, 196, 5) };
    const sim = matchSim();
    const crowdStand = standing(7), crowdSeat = seated(11);
    const dust = Array.from({ length: 70 }, (_, i) => { const r = rnd(500 + i); return { x: 520 + r() * 560, y: r() * 420, s: 0.6 + r() * 1.8, sp: 6 + r() * 14, ph: r() * TAU }; });
    let mode = 'concert', prev = null, tr = 1;

    const PAINT = {
      concert: { back: concertBack, left: concertSide, right: concertSide, ceil: concertCeil },
      show: { back: (x, o, t) => showBack(x, o, t, art), left: (x, o, t) => showSide(x, o, t, art), right: (x, o, t) => showSide(x, o, t, art), ceil: (x, o, t) => showCeil(x, o, t, art) },
      match: { back: (x, o, t) => matchBack(x, o, t, sim, stands), left: (x, o, t) => matchSide(x, o, t, sim, stands), right: (x, o, t) => matchSide(x, o, t, sim, stands), ceil: (x, o, t) => matchCeil(x, o, t, sim) },
    };

    function paintWall(o, t) {
      const x = o.x;
      x.globalCompositeOperation = 'source-over';
      x.globalAlpha = 1;
      if (prev && tr < 1) {
        // the new content sweeps out from the stage across every surface
        const p = smooth(clamp(o.n === 'back' ? tr * 1.7 : (tr - 0.22) * 1.6, 0, 1));
        PAINT[prev][o.n](x, o, sim.t);
        x.save();
        x.beginPath();
        if (o.n === 'back') x.arc(o.w / 2, o.h * 0.9, p * o.w * 0.75, 0, TAU);
        else if (o.n === 'left') x.rect(o.w * (1 - p), 0, o.w * p, o.h);
        else if (o.n === 'right') x.rect(0, 0, o.w * p, o.h);
        else x.rect(0, o.h * (1 - p), o.w, o.h * p);
        x.clip();
        PAINT[mode][o.n](x, o, t);
        x.restore();
        if (p > 0 && p < 1) {
          x.globalCompositeOperation = 'lighter';
          x.strokeStyle = 'rgba(255,255,255,.85)';
          x.lineWidth = 3;
          x.beginPath();
          if (o.n === 'back') x.arc(o.w / 2, o.h * 0.9, p * o.w * 0.75, 0, TAU);
          else if (o.n === 'left') { x.moveTo(o.w * (1 - p), 0); x.lineTo(o.w * (1 - p), o.h); }
          else if (o.n === 'right') { x.moveTo(o.w * p, 0); x.lineTo(o.w * p, o.h); }
          else { x.moveTo(0, o.h * (1 - p)); x.lineTo(o.w, o.h * (1 - p)); }
          x.stroke();
          x.globalCompositeOperation = 'source-over';
        }
      } else PAINT[mode][o.n](x, o, t);
    }

    function frame(t, dt) {
      sim.t = t;
      sim.step(dt, t);
      if (tr < 1) { tr = Math.min(1, tr + dt / 1.4); if (tr >= 1) prev = null; }
      zoom.style.transform = `scale(${1.015 + 0.015 * Math.sin(t * 0.09)})`;
      for (const o of walls) paintWall(o, t);
      drawFx(t);
    }

    function weights() {
      const a = prev ? smooth(tr) : 1, w = { concert: 0, show: 0, match: 0 };
      w[mode] += a;
      if (prev) w[prev] += 1 - a;
      return w;
    }

    function drawFx(t) {
      g.setTransform(fx.width / W, 0, 0, fx.height / H, 0, 0);
      g.clearRect(0, 0, W, H);
      const w = weights();
      const col = mix(mix(VX_COL.concert, VX_COL.show, w.show / Math.max(0.001, w.concert + w.show)), VX_COL.match, w.match);
      floor.style.setProperty('--vxc', `${col[0] | 0} ${col[1] | 0} ${col[2] | 0}`);
      // light spilling from the screens into the room
      const sp = g.createRadialGradient(800, 470, 40, 800, 470, 760);
      sp.addColorStop(0, rgba(col, 0.16));
      sp.addColorStop(1, rgba(col, 0));
      g.fillStyle = sp;
      g.fillRect(0, 0, W, H);
      truss(g, col);
      stage(g, t, w, col);
      if (w.concert > 0) beams(g, t, w.concert);
      if (w.show > 0) goldLight(g, t, w.show, dust);
      const standW = w.concert + w.show;
      if (standW > 0) drawStanding(g, crowdStand, t, col, standW, w.concert);
      if (w.match > 0) drawSeated(g, crowdSeat, t, col, w.match, sim.cheer > 0);
      // haze and vignette
      const hz = g.createLinearGradient(0, 520, 0, 900);
      hz.addColorStop(0, rgba(col, 0.07));
      hz.addColorStop(1, 'rgba(2,3,6,.55)');
      g.fillStyle = hz;
      g.fillRect(0, 520, W, 380);
      const vg = g.createRadialGradient(800, 420, 420, 800, 420, 1050);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,.6)');
      g.fillStyle = vg;
      g.fillRect(0, 0, W, H);
    }

    return {
      resize(k) {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        let pw = W * k * dpr, ph = H * k * dpr;
        const cap = 2400 * 1350;
        if (pw * ph > cap) { const f = Math.sqrt(cap / (pw * ph)); pw *= f; ph *= f; }
        fx.width = Math.round(pw);
        fx.height = Math.round(ph);
      },
      frame,
      set(m, instant) {
        if (m === mode || !PAINT[m]) return;
        prev = instant ? null : mode;
        mode = m;
        tr = instant ? 1 : 0;
      },
      get mode() { return mode; },
    };
  }

  /* ---------- concert screens ---------- */
  function concertBase(x, o, t) {
    const { w, h } = o;
    const bg = x.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#02050f');
    bg.addColorStop(1, '#06163c');
    x.fillStyle = bg;
    x.fillRect(0, 0, w, h);
    x.globalCompositeOperation = 'lighter';
    const cols = ['40,105,255', '115,70,255', '0,185,255', '70,150,255'], R = Math.max(w, h);
    for (let i = 0; i < 4; i++) {
      const cx = w * (0.5 + 0.48 * Math.sin(t * 0.11 * (i + 1) + i * 1.7 + o.seed));
      const cy = h * (0.5 + 0.42 * Math.cos(t * 0.083 * (i + 2) + i * 2.3 + o.seed));
      const r = R * (0.42 + 0.12 * Math.sin(t * 0.31 + i));
      const rg = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      rg.addColorStop(0, `rgba(${cols[i]},.42)`);
      rg.addColorStop(1, `rgba(${cols[i]},0)`);
      x.fillStyle = rg;
      x.fillRect(0, 0, w, h);
    }
  }
  function concertFlash(x, o, b) {
    x.fillStyle = `rgba(90,150,255,${0.16 * b})`;
    x.fillRect(0, 0, o.w, o.h);
    x.globalCompositeOperation = 'source-over';
  }
  function concertBack(x, o, t) {
    const { w, h } = o, b = beatAt(t);
    concertBase(x, o, t);
    const rg = x.createRadialGradient(w / 2, h * 0.92, 0, w / 2, h * 0.92, h);
    rg.addColorStop(0, `rgba(150,200,255,${0.3 + 0.35 * b})`);
    rg.addColorStop(1, 'rgba(60,120,255,0)');
    x.fillStyle = rg;
    x.fillRect(0, 0, w, h);
    const n = 16, gap = w * 0.05, colW = (w / 2 - gap) / n;
    for (let i = 0; i < n; i++) {
      const v = (0.16 + 0.5 * Math.abs(Math.sin(t * (1.1 + i * 0.23) + i * 1.3))) * (1 - (i / n) * 0.55) + b * 0.2;
      const bh = h * v;
      const lg = x.createLinearGradient(0, h, 0, h - bh);
      lg.addColorStop(0, 'rgba(110,175,255,.85)');
      lg.addColorStop(1, 'rgba(170,215,255,0)');
      x.fillStyle = lg;
      for (const sd of [-1, 1]) x.fillRect(w / 2 + sd * (gap + (i + 0.5) * colW) - colW * 0.3, h - bh, colW * 0.6, bh);
    }
    const pw = w * 0.045, pg = x.createLinearGradient(w / 2 - pw, 0, w / 2 + pw, 0);
    pg.addColorStop(0, 'rgba(120,180,255,0)');
    pg.addColorStop(0.5, `rgba(235,245,255,${0.7 + 0.3 * b})`);
    pg.addColorStop(1, 'rgba(120,180,255,0)');
    x.fillStyle = pg;
    x.fillRect(w / 2 - pw, 0, pw * 2, h);
    concertFlash(x, o, b);
  }
  function concertSide(x, o, t) {
    const { w, h, side } = o, b = beatAt(t);
    concertBase(x, o, t);
    for (let i = 0; i < 6; i++) {
      const p = mod(t * 0.32 + i / 6, 1), cx = (side > 0 ? p : 1 - p) * w, bw = 40 + 80 * (1 - p);
      const a = (0.25 + 0.45 * b) * Math.sin(p * Math.PI);
      const lg = x.createLinearGradient(cx - bw, 0, cx + bw, 0);
      lg.addColorStop(0, 'rgba(120,180,255,0)');
      lg.addColorStop(0.5, `rgba(170,210,255,${a})`);
      lg.addColorStop(1, 'rgba(120,180,255,0)');
      x.fillStyle = lg;
      x.fillRect(cx - bw, 0, bw * 2, h);
    }
    x.lineCap = 'round';
    for (let i = 0; i < 14; i++) {
      const y = h * ((i * 0.618 + 0.1) % 1), len = w * (0.15 + 0.2 * ((i * 0.37) % 1));
      const p = mod(t * (0.25 + (i % 4) * 0.08) + i * 0.21, 1.4) - 0.2;
      const x0 = (side > 0 ? p : 1 - p) * w;
      x.strokeStyle = `rgba(190,220,255,${0.35 * Math.sin(clamp(p, 0, 1) * Math.PI)})`;
      x.lineWidth = 2 + (i % 3);
      x.beginPath();
      x.moveTo(x0, y);
      x.lineTo(x0 - side * len, y);
      x.stroke();
    }
    concertFlash(x, o, b);
  }
  function concertCeil(x, o, t) {
    const { w, h } = o, b = beatAt(t);
    concertBase(x, o, t);
    for (let i = 0; i < 7; i++) {
      const p = mod(t * 0.2 + i / 7, 1);
      x.strokeStyle = `rgba(140,195,255,${(1 - p) * (0.35 + 0.3 * b)})`;
      x.lineWidth = 2 + 14 * (1 - p);
      x.beginPath();
      x.arc(w / 2, h * 1.05, p * h * 1.7, Math.PI, TAU);
      x.stroke();
    }
    concertFlash(x, o, b);
  }

  /* ---------- Mesopotamian show: Ishtar-blue brick, rosettes, lions & aurochs, ziggurat, cuneiform ---------- */
  function bricks(w, h, seed, bh) {
    const c = cv(w, h), x = c.getContext('2d'), r = rnd(seed), bw = bh * 2.3;
    x.fillStyle = '#061641';
    x.fillRect(0, 0, w, h);
    for (let row = 0, y = 0; y < h; row++, y += bh) {
      for (let xx = (row % 2) * -bw / 2; xx < w; xx += bw) {
        x.fillStyle = `hsl(${219 + r() * 8},70%,${21 + r() * 10}%)`;
        x.fillRect(xx + 1, y + 1, bw - 2, bh - 2);
        x.fillStyle = 'rgba(255,255,255,.07)';
        x.fillRect(xx + 1, y + 1, bw - 2, (bh - 2) * 0.35);
      }
    }
    return c;
  }
  function rosette(x, cx, cy, r) {
    x.save();
    x.translate(cx, cy);
    x.fillStyle = '#f3ead2';
    for (let i = 0; i < 10; i++) { x.rotate(TAU / 10); x.beginPath(); x.ellipse(r * 0.52, 0, r * 0.45, r * 0.16, 0, 0, TAU); x.fill(); }
    x.fillStyle = '#e8a93a';
    x.beginPath(); x.arc(0, 0, r * 0.27, 0, TAU); x.fill();
    x.strokeStyle = '#e8a93a';
    x.lineWidth = Math.max(1, r * 0.08);
    x.beginPath(); x.arc(0, 0, r * 1.02, 0, TAU); x.stroke();
    x.restore();
  }
  function band(x, y, w, bh) {
    x.fillStyle = '#081a4e';
    x.fillRect(0, y, w, bh);
    x.fillStyle = '#e8b04a';
    x.fillRect(0, y, w, bh * 0.09);
    x.fillRect(0, y + bh * 0.91, w, bh * 0.09);
    for (let cx = bh * 0.7; cx < w; cx += bh * 1.25) rosette(x, cx, y + bh / 2, bh * 0.34);
  }
  // Ishtar-gate animal in profile. (cx, gy) = point on the ground under the body, s = body length.
  function beast(x, kind, cx, gy, s, ph, f, moving) {
    const lion = kind === 'lion';
    const body = lion ? '#f1e2b6' : '#e7b24a', shade = lion ? '#bfa36c' : '#a9761f', line = '#5a3a10';
    const L = 0.3, amp = moving ? 0.42 : 0.1;
    x.save();
    x.translate(cx, gy);
    x.scale(f * s, s);
    x.lineJoin = 'round';
    x.lineCap = 'round';
    const leg = (hx, off, far) => {
      const a = Math.sin(ph + off * TAU) * amp, lift = moving ? Math.max(0, Math.sin(ph + off * TAU + 1.2)) * 0.04 : 0;
      x.strokeStyle = far ? shade : body;
      x.lineWidth = lion ? 0.07 : 0.085;
      x.beginPath();
      x.moveTo(hx, -L - 0.04);
      x.lineTo(hx + Math.sin(a) * L * 0.55, -L * 0.5);
      x.lineTo(hx + Math.sin(a) * L, -lift);
      x.stroke();
    };
    leg(-0.32, 0, 1);
    leg(0.2, 0.5, 1);
    x.strokeStyle = body;
    x.lineWidth = 0.035;
    x.beginPath();
    x.moveTo(-0.43, -0.36);
    if (lion) x.bezierCurveTo(-0.62, -0.38, -0.56, -0.62, -0.68, -0.6);
    else x.bezierCurveTo(-0.5, -0.3, -0.5, -0.18, -0.52, -0.12);
    x.stroke();
    x.fillStyle = lion ? '#e3a13a' : '#3d2a10';
    x.beginPath();
    x.ellipse(lion ? -0.69 : -0.52, lion ? -0.61 : -0.1, 0.045, 0.03, 0.4, 0, TAU);
    x.fill();
    const gr = x.createLinearGradient(0, -0.55, 0, -0.2);
    gr.addColorStop(0, '#fff6dc');
    gr.addColorStop(0.35, body);
    gr.addColorStop(1, shade);
    x.fillStyle = gr;
    x.strokeStyle = line;
    x.lineWidth = 0.012;
    x.beginPath();
    if (lion) {
      x.moveTo(-0.45, -0.35); x.bezierCurveTo(-0.42, -0.47, -0.1, -0.46, 0.12, -0.45);
      x.lineTo(0.24, -0.36); x.bezierCurveTo(0.22, -0.27, 0.2, -0.24, 0.16, -0.24);
      x.bezierCurveTo(0, -0.21, -0.26, -0.22, -0.4, -0.25); x.bezierCurveTo(-0.47, -0.27, -0.48, -0.32, -0.45, -0.35);
    } else {
      x.moveTo(-0.46, -0.33); x.bezierCurveTo(-0.44, -0.48, -0.1, -0.47, 0.1, -0.5);
      x.bezierCurveTo(0.22, -0.52, 0.3, -0.46, 0.34, -0.4);
      x.lineTo(0.3, -0.24); x.bezierCurveTo(0.1, -0.2, -0.25, -0.2, -0.42, -0.24);
      x.bezierCurveTo(-0.48, -0.26, -0.48, -0.3, -0.46, -0.33);
    }
    x.closePath();
    x.fill();
    x.stroke();
    leg(-0.24, 0.25, 0);
    leg(0.28, 0.75, 0);
    x.strokeStyle = line;
    x.lineWidth = 0.012;
    if (lion) {
      x.fillStyle = '#e09a32';
      x.beginPath();
      for (let i = 0; i <= 18; i++) { const a = (i / 18) * TAU, rr = i % 2 ? 0.2 : 0.155; x.lineTo(0.27 + Math.cos(a) * rr, -0.44 + Math.sin(a) * rr * 1.1); }
      x.closePath(); x.fill(); x.stroke();
      x.fillStyle = gr;
      x.beginPath(); x.ellipse(0.39, -0.45, 0.095, 0.08, 0, 0, TAU); x.fill(); x.stroke();
      x.beginPath(); x.ellipse(0.47, -0.415, 0.055, 0.042, 0, 0, TAU); x.fill(); x.stroke();
      x.fillStyle = '#2a1a08';
      x.beginPath(); x.arc(0.41, -0.47, 0.013, 0, TAU); x.fill();
    } else {
      x.fillStyle = gr;
      x.beginPath();
      x.moveTo(0.3, -0.46); x.bezierCurveTo(0.4, -0.48, 0.47, -0.42, 0.5, -0.33);
      x.lineTo(0.47, -0.28); x.bezierCurveTo(0.42, -0.29, 0.34, -0.32, 0.3, -0.36);
      x.closePath(); x.fill(); x.stroke();
      x.strokeStyle = '#f6efdc';
      x.lineWidth = 0.028;
      x.beginPath(); x.moveTo(0.4, -0.46); x.bezierCurveTo(0.46, -0.56, 0.55, -0.58, 0.58, -0.52); x.stroke();
      x.fillStyle = '#2a1a08';
      x.beginPath(); x.arc(0.43, -0.41, 0.013, 0, TAU); x.fill();
    }
    x.restore();
  }
  function archPath(x, cx, top, bot, hw) {
    x.moveTo(cx - hw, bot);
    x.lineTo(cx - hw, top + hw);
    x.arc(cx, top + hw, hw, Math.PI, 0);
    x.lineTo(cx + hw, bot);
    x.closePath();
  }
  function wedge(x, cx, cy, s, a) {
    x.save();
    x.translate(cx, cy);
    x.rotate(a);
    x.beginPath(); x.moveTo(0, -s * 0.34); x.lineTo(s * 0.42, 0); x.lineTo(0, s * 0.34); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(s * 0.3, -s * 0.07); x.lineTo(s * 1.3, 0); x.lineTo(s * 0.3, s * 0.07); x.closePath(); x.fill();
    x.restore();
  }
  function showArt() {
    const GATE = { cx: 480, hw: 118, top: 70, bot: 440 };
    // back wall: the Ishtar Gate, its opening left transparent for the live sky behind
    const back = cv(960, 440), b = back.getContext('2d');
    b.drawImage(bricks(960, 440, 21, 19), 0, 0);
    b.fillStyle = '#050b22';
    b.fillRect(0, 0, 960, 34);
    b.fillStyle = '#0d2a6e';
    for (let xx = 0; xx < 960; xx += 48) { b.fillRect(xx + 6, 14, 36, 22); b.fillRect(xx + 14, 4, 20, 12); }
    band(b, 36, 960, 26);
    band(b, 210, 960, 24);
    band(b, 414, 960, 26);
    for (const [gy, kind, s] of [[200, 'bull', 118], [404, 'lion', 128]]) {
      for (const [cx, f, ph] of [[96, 1, 0.3], [262, 1, 1.9], [864, -1, 1.1], [698, -1, 2.6]]) beast(b, kind, cx, gy, s, ph, f, false);
    }
    b.save();
    b.beginPath();
    archPath(b, GATE.cx, GATE.top - 22, GATE.bot, GATE.hw + 22);
    b.fillStyle = '#0a2160';
    b.fill();
    b.lineWidth = 6; b.strokeStyle = '#e8b04a'; b.stroke();
    b.beginPath();
    archPath(b, GATE.cx, GATE.top - 8, GATE.bot, GATE.hw + 8);
    b.lineWidth = 5; b.strokeStyle = '#f3ead2'; b.stroke();
    b.restore();
    b.globalCompositeOperation = 'destination-out';
    b.beginPath();
    archPath(b, GATE.cx, GATE.top, GATE.bot, GATE.hw);
    b.fill();
    b.globalCompositeOperation = 'source-over';
    // side walls: brick with rosette bands; the procession is drawn live
    const side = cv(640, 440), s = side.getContext('2d');
    s.drawImage(bricks(640, 440, 33, 19), 0, 0);
    band(s, 0, 640, 40);
    band(s, 392, 640, 48);
    // cuneiform strip for the ceiling (tiles vertically)
    const glyphs = cv(720, 480), q = glyphs.getContext('2d'), r = rnd(77);
    q.fillStyle = '#e9b95a';
    for (let y = 26; y < 480; y += 40) {
      for (let xx = 18 + r() * 20; xx < 700; xx += 34 + r() * 22) {
        const sz = 9 + r() * 6, n = 2 + ((r() * 4) | 0);
        q.globalAlpha = 0.45 + r() * 0.45;
        for (let k = 0; k < n; k++) {
          const a = [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4][(r() * 4) | 0];
          wedge(q, xx + (k % 2) * sz * 0.9, y + ((k / 2) | 0) * sz * 0.8 - sz * 0.4, sz, a);
        }
      }
    }
    q.globalAlpha = 1;
    const stars = Array.from({ length: 46 }, (_, i) => { const rr = rnd(900 + i); return { x: rr(), y: rr() * 0.6, r: 1 + rr() * 1.8, sp: 0.6 + rr() * 2, ph: rr() * TAU }; });
    return { back, side, glyphs, stars, GATE };
  }
  function shimmer(x, o, t, sp) {
    const span = o.w + o.h, cx = (mod(t * sp + o.seed * 0.3, 1.5) - 0.25) * span;
    const lg = x.createLinearGradient(cx - 160, 0, cx + 40, 200);
    lg.addColorStop(0, 'rgba(255,215,140,0)');
    lg.addColorStop(0.5, 'rgba(255,215,140,.16)');
    lg.addColorStop(1, 'rgba(255,215,140,0)');
    x.globalCompositeOperation = 'lighter';
    x.fillStyle = lg;
    x.fillRect(0, 0, o.w, o.h);
    x.globalCompositeOperation = 'source-over';
  }
  function showBack(x, o, t, art) {
    const { cx, hw, top, bot } = art.GATE;
    x.fillStyle = '#050b22';
    x.fillRect(0, 0, o.w, o.h);
    // the sky beyond the gate: dusk, stars, a breathing sun and the Ziggurat of Ur
    const sky = x.createLinearGradient(0, top, 0, bot);
    sky.addColorStop(0, '#0a1440'); sky.addColorStop(0.5, '#33276a'); sky.addColorStop(0.78, '#c46f3a'); sky.addColorStop(1, '#f0b05a');
    x.fillStyle = sky;
    x.fillRect(cx - hw, top, hw * 2, bot - top);
    for (const s of art.stars) {
      x.fillStyle = `rgba(255,240,210,${(0.35 + 0.65 * Math.abs(Math.sin(t * s.sp + s.ph))) * 0.9})`;
      x.fillRect(cx - hw + s.x * hw * 2, top + s.y * (bot - top) * 0.55, s.r, s.r);
    }
    const sy = 318, sr = 52 * (1 + 0.05 * Math.sin(t * 1.2));
    const sg = x.createRadialGradient(cx, sy, 0, cx, sy, sr * 2.6);
    sg.addColorStop(0, 'rgba(255,236,170,1)'); sg.addColorStop(0.28, 'rgba(255,200,100,.95)'); sg.addColorStop(0.4, 'rgba(255,170,80,.45)'); sg.addColorStop(1, 'rgba(255,150,60,0)');
    x.fillStyle = sg;
    x.fillRect(cx - hw, top, hw * 2, bot - top);
    x.save();
    x.translate(cx, sy);
    x.rotate(t * 0.05);
    x.strokeStyle = 'rgba(255,220,150,.18)';
    x.lineWidth = 3;
    for (let i = 0; i < 16; i++) { x.rotate(TAU / 16); x.beginPath(); x.moveTo(sr * 1.3, 0); x.lineTo(sr * 3.4, 0); x.stroke(); }
    x.restore();
    const tiers = [[380, 440, 104], [338, 380, 76], [304, 338, 50], [286, 304, 22]];
    for (const [y0, y1, half] of tiers) {
      const tg = x.createLinearGradient(0, y0, 0, y1);
      tg.addColorStop(0, '#5a2f14'); tg.addColorStop(1, '#1c0d05');
      x.fillStyle = tg;
      x.beginPath(); x.moveTo(cx - half, y1); x.lineTo(cx - half + 6, y0); x.lineTo(cx + half - 6, y0); x.lineTo(cx + half, y1); x.closePath(); x.fill();
      x.strokeStyle = 'rgba(255,200,120,.75)';
      x.lineWidth = 1.6;
      x.beginPath(); x.moveTo(cx - half + 6, y0); x.lineTo(cx + half - 6, y0); x.stroke();
    }
    x.fillStyle = 'rgba(255,190,110,.28)';
    x.beginPath(); x.moveTo(cx - 13, 440); x.lineTo(cx + 13, 440); x.lineTo(cx + 5, 304); x.lineTo(cx - 5, 304); x.closePath(); x.fill();
    x.strokeStyle = 'rgba(255,200,130,.35)';
    x.lineWidth = 1;
    for (let y = 300; y < 440; y += 7) { const k = (y - 300) / 140; x.beginPath(); x.moveTo(cx - 5 - 8 * k, y); x.lineTo(cx + 5 + 8 * k, y); x.stroke(); }
    for (const px of [cx - 92, cx + 92]) palm(x, px, 440, 58);
    x.drawImage(art.back, 0, 0);
    shimmer(x, o, t, 0.07);
  }
  function palm(x, px, gy, hgt) {
    x.fillStyle = '#120804';
    x.strokeStyle = '#120804';
    x.lineWidth = 4;
    x.beginPath(); x.moveTo(px, gy); x.quadraticCurveTo(px + 6, gy - hgt * 0.5, px + 2, gy - hgt); x.stroke();
    x.lineWidth = 3;
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * 0.45;
      x.beginPath();
      x.moveTo(px + 2, gy - hgt);
      x.quadraticCurveTo(px + 2 + Math.cos(a) * hgt * 0.35, gy - hgt + Math.sin(a) * hgt * 0.3 - 6, px + 2 + Math.cos(a) * hgt * 0.55, gy - hgt + Math.sin(a) * hgt * 0.2 + 10);
      x.stroke();
    }
  }
  function showSide(x, o, t, art) {
    x.drawImage(art.side, 0, 0);
    const d = o.side, gap = 300, n = Math.ceil(o.w / gap) + 2;
    for (let i = 0; i < n; i++) {
      const cx = mod(i * gap + t * 26 * d, n * gap) - gap;
      beast(x, i % 2 ? 'bull' : 'lion', cx, 372, 200, t * 3.2 + i, d, true);
    }
    shimmer(x, o, t, 0.06);
  }
  function showCeil(x, o, t, art) {
    const { w, h } = o;
    const bg = x.createRadialGradient(w / 2, h * 0.62, 20, w / 2, h * 0.62, w * 0.7);
    bg.addColorStop(0, '#173a8f'); bg.addColorStop(1, '#050e2e');
    x.fillStyle = bg;
    x.fillRect(0, 0, w, h);
    const off = mod(t * 18, h);
    x.globalAlpha = 0.8;
    x.drawImage(art.glyphs, 0, off - h);
    x.drawImage(art.glyphs, 0, off);
    x.globalAlpha = 1;
    const cx = w / 2, cy = h * 0.62;
    x.save();
    x.translate(cx, cy);
    x.rotate(-t * 0.05);
    for (let i = 0; i < 12; i++) { x.rotate(TAU / 12); rosette(x, 160, 0, 15); }
    x.restore();
    ishtarStar(x, cx, cy, 78, t * 0.08);
    shimmer(x, o, t, 0.05);
  }
  function ishtarStar(x, cx, cy, r, rot) {
    x.save();
    x.translate(cx, cy);
    x.rotate(rot);
    const gl = x.createRadialGradient(0, 0, 0, 0, 0, r * 2.2);
    gl.addColorStop(0, 'rgba(255,200,90,.55)'); gl.addColorStop(1, 'rgba(255,200,90,0)');
    x.fillStyle = gl;
    x.beginPath(); x.arc(0, 0, r * 2.2, 0, TAU); x.fill();
    x.beginPath();
    for (let i = 0; i < 16; i++) { const a = (i / 16) * TAU, rr = i % 2 ? r * 0.42 : r; x.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    x.closePath();
    const g2 = x.createRadialGradient(0, 0, 0, 0, 0, r);
    g2.addColorStop(0, '#fff3c8'); g2.addColorStop(0.5, '#f0b648'); g2.addColorStop(1, '#a8701c');
    x.fillStyle = g2;
    x.fill();
    x.strokeStyle = '#6b440f';
    x.lineWidth = 1.5;
    x.stroke();
    x.fillStyle = '#fff3c8';
    x.beginPath(); x.arc(0, 0, r * 0.16, 0, TAU); x.fill();
    x.restore();
  }

  /* ---------- match night: one simulated game feeds the broadcast wall and the tactical ceiling ---------- */
  const dist = (a, b) => Math.hypot(a.u - b.u, (a.v - b.v) * 0.65);
  function matchSim() {
    const r = rnd(99);
    const base = [[0.05, 0.5], [0.2, 0.14], [0.18, 0.38], [0.18, 0.62], [0.2, 0.86], [0.38, 0.24], [0.35, 0.5], [0.38, 0.76], [0.56, 0.17], [0.6, 0.5], [0.56, 0.83]];
    const P = [];
    for (let tm = 0; tm < 2; tm++) base.forEach(([u, v], i) => {
      const bu = tm ? 1 - u : u, bv = tm ? 1 - v : v;
      P.push({ tm, i, bu, bv, u: bu, v: bv, ph: r() * TAU, run: 0 });
    });
    const S = { P, holder: P[9], ball: { u: 0.5, v: 0.5, z: 0 }, pass: null, hold: 0.8, clock: 67 * 60 + 12, cheer: 0, nextCheer: 8, t: 0 };
    S.step = (dt, t) => {
      if (!dt) return;
      S.clock += dt;
      if (S.pass) {
        S.pass.k += dt / S.pass.d;
        const k = Math.min(1, S.pass.k), e = smooth(k);
        S.ball.u = lerp(S.pass.u0, S.pass.to.u, e);
        S.ball.v = lerp(S.pass.v0, S.pass.to.v, e);
        S.ball.z = Math.sin(k * Math.PI) * S.pass.hgt;
        if (k >= 1) { S.holder = S.pass.to; S.pass = null; S.hold = 0.5 + r() * 0.9; }
      } else {
        const h = S.holder, dir = h.tm ? -1 : 1;
        S.ball.u = h.u + dir * 0.008; S.ball.v = h.v; S.ball.z = 0;
        S.hold -= dt;
        if (S.hold <= 0) {
          let to;
          if (r() < 0.14) to = P.filter(p => p.tm !== h.tm).reduce((a, b) => (dist(a, h) < dist(b, h) ? a : b));
          else {
            const mates = P.filter(p => p.tm === h.tm && p !== h && p.i !== 0);
            const ahead = mates.filter(p => (p.u - h.u) * dir > -0.05);
            const pool = ahead.length && r() < 0.75 ? ahead : mates;
            let best = null, bs = 9;
            for (const p of pool) { const sc = Math.abs(dist(p, h) - 0.2) + r() * 0.15; if (sc < bs) { bs = sc; best = p; } }
            to = best;
          }
          const d = dist(to, h);
          S.pass = { u0: S.ball.u, v0: S.ball.v, to, k: 0, d: 0.45 + d * 2.2, hgt: d > 0.25 ? 0.05 : 0.01 };
        }
      }
      const bu = S.ball.u, bv = S.ball.v, att = S.holder.tm;
      for (const p of P) {
        const dir = p.tm ? -1 : 1;
        let tu = p.bu + (bu - 0.5) * 0.5 + (p.tm === att ? 0.08 : -0.04) * dir, tv = p.bv + (bv - p.bv) * 0.25;
        if (p.i === 0) { tu = p.tm ? 0.95 : 0.05; tv = 0.5 + (bv - 0.5) * 0.2; }
        if (S.pass && p === S.pass.to) { tu = bu; tv = bv; }
        tu += Math.sin(t * 0.7 + p.ph) * 0.015;
        tv += Math.cos(t * 0.6 + p.ph * 1.3) * 0.02;
        const du = tu - p.u, dv = tv - p.v, d = Math.hypot(du, dv * 0.65), sp = 0.075 * dt;
        if (d > 0.002) { const m = Math.min(sp, d) / d; p.u += du * m; p.v += dv * m; }
        p.run = d > 0.012 ? Math.min(1, p.run + dt * 3) : Math.max(0, p.run - dt * 3);
        p.ph += dt * (4 + p.run * 7);
        p.u = clamp(p.u, 0.02, 0.98);
        p.v = clamp(p.v, 0.03, 0.97);
      }
      S.cheer = Math.max(0, S.cheer - dt);
      if (t > S.nextCheer) { S.cheer = 3; S.nextCheer = t + 15; }
    };
    return S;
  }
  function standsTex(w, h, seed) {
    const c = cv(w, h), x = c.getContext('2d'), r = rnd(seed);
    const bg = x.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#05070d'); bg.addColorStop(1, '#141a26');
    x.fillStyle = bg;
    x.fillRect(0, 0, w, h);
    const rows = 16;
    for (let i = 0; i < rows; i++) {
      const y = h * 0.06 + (i / rows) * h * 0.92, rh = (h * 0.92) / rows;
      x.fillStyle = i % 2 ? '#0d121c' : '#111725';
      x.fillRect(0, y, w, rh);
      for (let xx = r() * 4; xx < w; xx += 3 + r() * 3) {
        const k = r();
        const col = k < 0.5 ? [40 + r() * 40, 150 + r() * 70, 80 + r() * 40] : k < 0.8 ? [210, 215, 220] : k < 0.92 ? [210, 50, 45] : [25, 25, 30];
        const l = 0.45 + r() * 0.55;
        x.fillStyle = rgba(col.map(v => v * l), 1);
        x.beginPath(); x.arc(xx, y + rh * 0.45 + (r() - 0.5) * 2, 1.2 + (i / rows) * 1.6, 0, TAU); x.fill();
      }
      if (r() < 0.6) { // a few Iraqi flags held up
        const fx = r() * w, fy = y - 2, fw = 10 + r() * 6;
        x.fillStyle = '#ce1126'; x.fillRect(fx, fy, fw, 2.4);
        x.fillStyle = '#ffffff'; x.fillRect(fx, fy + 2.4, fw, 2.4);
        x.fillStyle = '#111111'; x.fillRect(fx, fy + 4.8, fw, 2.4);
      }
    }
    for (let i = 0; i < 7; i++) { // floodlight glare along the roof edge
      const lx = (i + 0.5) * (w / 7);
      const rg = x.createRadialGradient(lx, 4, 0, lx, 4, 40);
      rg.addColorStop(0, 'rgba(255,255,240,.9)'); rg.addColorStop(1, 'rgba(255,255,240,0)');
      x.fillStyle = rg;
      x.fillRect(lx - 40, 0, 80, 44);
    }
    return c;
  }
  function footballer(x, px, py, sc, shirt, shorts, ph, run) {
    x.fillStyle = 'rgba(0,0,0,.35)';
    x.beginPath(); x.ellipse(px + sc * 0.08, py, sc * 0.22, sc * 0.06, 0, 0, TAU); x.fill();
    const sw = Math.sin(ph) * 0.24 * run;
    x.strokeStyle = '#1a1410';
    x.lineWidth = sc * 0.09;
    x.lineCap = 'round';
    x.beginPath();
    x.moveTo(px - sc * 0.05, py - sc * 0.42); x.lineTo(px - sc * 0.05 + sw * sc, py);
    x.moveTo(px + sc * 0.05, py - sc * 0.42); x.lineTo(px + sc * 0.05 - sw * sc, py);
    x.stroke();
    x.fillStyle = shorts;
    x.fillRect(px - sc * 0.12, py - sc * 0.52, sc * 0.24, sc * 0.13);
    x.fillStyle = shirt;
    x.fillRect(px - sc * 0.14, py - sc * 0.84, sc * 0.28, sc * 0.34);
    x.fillStyle = '#c99a72';
    x.beginPath(); x.arc(px, py - sc * 0.94, sc * 0.1, 0, TAU); x.fill();
  }
  const KIT = [['#1f9d55', '#f2f2f2'], ['#e04b3c', '#1d2433']];
  function pitchLines(x, P) {
    const seg = pts => { x.beginPath(); pts.forEach(([u, v], i) => { const [px, py] = P(u, v); i ? x.lineTo(px, py) : x.moveTo(px, py); }); x.stroke(); };
    seg([[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]);
    seg([[0.5, 0], [0.5, 1]]);
    const circ = [];
    for (let i = 0; i <= 40; i++) { const a = (i / 40) * TAU; circ.push([0.5 + 0.087 * Math.cos(a), 0.5 + 0.135 * Math.sin(a)]); }
    seg(circ);
    for (const e of [0, 1]) {
      const d = e ? -1 : 1;
      seg([[e, 0.2035], [e + d * 0.157, 0.2035], [e + d * 0.157, 0.7965], [e, 0.7965]]);
      seg([[e, 0.3655], [e + d * 0.052, 0.3655], [e + d * 0.052, 0.6345], [e, 0.6345]]);
    }
  }
  function matchBack(x, o, t, S, stands) {
    const { w, h } = o;
    x.drawImage(stands.back, 0, 0, w, h * 0.42);
    // LED boards along the far touchline
    for (let i = 0; i < 12; i++) {
      const k = mod(i + t * 0.6, 12) / 12;
      x.fillStyle = `hsl(${lerp(140, 160, k)},70%,${30 + 18 * Math.sin(k * TAU + t)}%)`;
      x.fillRect((i / 12) * w, h * 0.4, w / 12 - 2, h * 0.035);
    }
    const camU = lerp(0.5, S.ball.u, 0.55);
    const zOf = v => lerp(2.1, 1, v);
    const P = (u, v) => { const z = zOf(v); return [w / 2 + ((u - camU) * w * 1.5) / z, -h * 0.088 + (h * 1.088) / z]; };
    x.fillStyle = '#1f6b2c';
    x.fillRect(0, h * 0.435, w, h);
    for (let i = -2; i < 18; i++) {
      const u0 = i / 16, u1 = (i + 1) / 16;
      const a = P(u0, 0), b = P(u1, 0), c = P(u1, 1.2), d = P(u0, 1.2);
      x.fillStyle = i % 2 ? '#2c8a3c' : '#33974a';
      x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.lineTo(c[0], c[1]); x.lineTo(d[0], d[1]); x.closePath(); x.fill();
    }
    const sh = x.createLinearGradient(0, h * 0.43, 0, h);
    sh.addColorStop(0, 'rgba(0,0,0,.28)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = sh;
    x.fillRect(0, h * 0.43, w, h);
    x.strokeStyle = 'rgba(255,255,255,.82)';
    x.lineWidth = 2;
    pitchLines(x, P);
    const order = S.P.slice().sort((a, b) => a.v - b.v);
    const ballDrawn = { v: false };
    const drawBall = () => {
      const [bx, by] = P(S.ball.u, S.ball.v), z = zOf(S.ball.v), br = (h * 0.013) / z;
      x.fillStyle = 'rgba(0,0,0,.4)';
      x.beginPath(); x.ellipse(bx, by, br * 1.2, br * 0.4, 0, 0, TAU); x.fill();
      x.fillStyle = '#ffffff';
      x.beginPath(); x.arc(bx, by - br - (S.ball.z * h * 1.4) / z, br, 0, TAU); x.fill();
      ballDrawn.v = true;
    };
    for (const p of order) {
      if (!ballDrawn.v && S.ball.v < p.v) drawBall();
      const [px, py] = P(p.u, p.v);
      footballer(x, px, py, (h * 0.1) / zOf(p.v), KIT[p.tm][0], KIT[p.tm][1], p.ph, p.run);
    }
    if (!ballDrawn.v) drawBall();
    // score bug
    x.fillStyle = 'rgba(4,8,16,.78)';
    x.fillRect(22, 18, 214, 34);
    x.fillStyle = '#1f9d55'; x.fillRect(22, 18, 8, 34);
    x.fillStyle = '#e04b3c'; x.fillRect(228, 18, 8, 34);
    x.fillStyle = '#fff';
    x.font = '600 17px "Readex Pro", system-ui, sans-serif';
    x.textBaseline = 'middle';
    x.direction = 'ltr';
    x.textAlign = 'left';
    x.fillText('IRQ  1 – 0', 40, 36);
    const m = Math.floor(S.clock / 60), s = Math.floor(S.clock % 60);
    x.fillStyle = 'rgba(255,255,255,.7)';
    x.fillText(`${m}:${String(s).padStart(2, '0')}`, 160, 36);
    if (S.cheer > 0) { x.fillStyle = `rgba(255,255,255,${0.2 * Math.max(0, Math.sin(S.cheer * 6))})`; x.fillRect(0, 0, w, h); }
  }
  function matchSide(x, o, t, S, stands) {
    const { w, h } = o;
    x.drawImage(stands[o.n], 0, 0, w, h * 0.68);
    const cx = mod(t * 160 * o.side, w + 400) - 200;
    const lg = x.createLinearGradient(cx - 90, 0, cx + 90, 0);
    lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(0.5, 'rgba(255,255,255,.22)'); lg.addColorStop(1, 'rgba(255,255,255,0)');
    x.globalCompositeOperation = 'lighter';
    x.fillStyle = lg;
    x.fillRect(cx - 90, 0, 180, h * 0.68);
    x.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 8; i++) {
      const k = mod(i - t * 0.8 * o.side, 8) / 8;
      x.fillStyle = `hsl(${k < 0.5 ? 145 : 0},${k < 0.5 ? 70 : 0}%,${k < 0.5 ? 38 : 88}%)`;
      x.fillRect((i / 8) * w, h * 0.68, w / 8 - 2, h * 0.05);
    }
    for (let i = 0; i < 10; i++) {
      x.fillStyle = i % 2 ? '#2c8a3c' : '#33974a';
      const x0 = (i / 10) * w;
      x.beginPath(); x.moveTo(x0, h * 0.73); x.lineTo(x0 + w / 10, h * 0.73); x.lineTo(x0 + w / 10 + 30 * o.side, h); x.lineTo(x0 + 30 * o.side, h); x.closePath(); x.fill();
    }
    x.strokeStyle = 'rgba(255,255,255,.8)';
    x.lineWidth = 2;
    x.beginPath(); x.moveTo(0, h * 0.79); x.lineTo(w, h * 0.79); x.stroke();
    if (S.cheer > 0) { x.fillStyle = `rgba(255,255,255,${0.2 * Math.max(0, Math.sin(S.cheer * 6))})`; x.fillRect(0, 0, w, h); }
  }
  function matchCeil(x, o, t, S) {
    const { w, h } = o;
    x.fillStyle = '#04120a';
    x.fillRect(0, 0, w, h);
    const x0 = w * 0.07, y0 = h * 0.1, pw = w * 0.86, ph = h * 0.8;
    const P = (u, v) => [x0 + u * pw, y0 + v * ph];
    for (let i = 0; i < 16; i++) { x.fillStyle = i % 2 ? '#2c8a3c' : '#33974a'; x.fillRect(x0 + (i / 16) * pw, y0, pw / 16 + 0.5, ph); }
    x.strokeStyle = 'rgba(255,255,255,.75)';
    x.lineWidth = 2;
    pitchLines(x, P);
    if (S.pass) {
      const [ax, ay] = P(S.ball.u, S.ball.v), [bx, by] = P(S.pass.to.u, S.pass.to.v);
      x.setLineDash([6, 6]);
      x.strokeStyle = 'rgba(255,255,255,.55)';
      x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.stroke();
      x.setLineDash([]);
    }
    for (const p of S.P) {
      const [px, py] = P(p.u, p.v);
      x.fillStyle = KIT[p.tm][0];
      x.beginPath(); x.arc(px, py, 8, 0, TAU); x.fill();
      x.strokeStyle = '#fff'; x.lineWidth = 1.5; x.stroke();
    }
    const [bx, by] = P(S.ball.u, S.ball.v);
    const bg = x.createRadialGradient(bx, by, 0, bx, by, 14);
    bg.addColorStop(0, 'rgba(255,255,255,.9)'); bg.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = bg;
    x.beginPath(); x.arc(bx, by, 14, 0, TAU); x.fill();
  }

  /* ---------- the room in front of the screens ---------- */
  function truss(g, col) {
    g.fillStyle = '#05070b';
    g.fillRect(360, 176, 880, 9);
    for (let i = 0; i < 9; i++) {
      const x = 400 + i * 100;
      g.fillStyle = '#0b0e15';
      g.fillRect(x - 7, 184, 14, 9);
      g.fillStyle = rgba(col, 0.9);
      g.fillRect(x - 3, 192, 6, 2);
    }
  }
  function stage(g, t, w, col) {
    g.fillStyle = '#080a10';
    g.beginPath(); g.moveTo(600, 579); g.lineTo(1000, 579); g.lineTo(1050, 600); g.lineTo(550, 600); g.closePath(); g.fill();
    g.fillStyle = '#040508';
    g.fillRect(550, 600, 500, 12);
    g.strokeStyle = rgba(col, 0.28); g.lineWidth = 9;
    g.beginPath(); g.moveTo(550, 601); g.lineTo(1050, 601); g.stroke();
    g.strokeStyle = rgba(col, 0.95); g.lineWidth = 2;
    g.beginPath(); g.moveTo(550, 601); g.lineTo(1050, 601); g.stroke();
    const b = beatAt(t);
    if (w.concert > 0) {
      g.globalAlpha = w.concert;
      // DJ behind the booth
      const up = Math.sin(t * 0.9) > 0.55;
      g.fillStyle = '#020306';
      g.beginPath(); g.ellipse(800, 541 - b * 1.5, 5.2, 6, 0, 0, TAU); g.fill();
      g.beginPath(); g.moveTo(786, 562); g.quadraticCurveTo(788, 548 - b, 800, 548 - b); g.quadraticCurveTo(812, 548 - b, 814, 562); g.fill();
      g.strokeStyle = '#020306'; g.lineWidth = 3.4; g.lineCap = 'round';
      g.beginPath(); g.moveTo(812, 552); g.lineTo(up ? 822 : 818, up ? 526 + b * 3 : 560); g.stroke();
      g.fillStyle = '#0b0e16';
      g.fillRect(756, 558, 88, 26);
      g.fillStyle = rgba(col, 0.95);
      g.fillRect(756, 558, 88, 2.5);
      g.globalAlpha = 1;
    }
    if (w.show > 0) {
      g.globalAlpha = w.show;
      for (let i = 0; i < 5; i++) {
        const px = 690 + i * 55, a = Math.sin(t * 1.1 + i * 0.7);
        g.fillStyle = '#060402';
        g.beginPath(); g.moveTo(px - 9, 594); g.lineTo(px - 4, 556); g.lineTo(px + 4, 556); g.lineTo(px + 9, 594); g.closePath(); g.fill();
        g.beginPath(); g.arc(px, 550, 4.5, 0, TAU); g.fill();
        g.strokeStyle = '#060402'; g.lineWidth = 2.6; g.lineCap = 'round';
        g.beginPath(); g.moveTo(px - 3, 560); g.lineTo(px - 10 - a * 4, 546 - a * 8); g.moveTo(px + 3, 560); g.lineTo(px + 10 + a * 4, 546 + a * 6); g.stroke();
        g.strokeStyle = 'rgba(255,200,110,.75)'; g.lineWidth = 1.2;
        g.beginPath(); g.arc(px, 550, 4.6, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
        g.beginPath(); g.moveTo(px - 4, 557); g.lineTo(px - 9, 594); g.stroke();
      }
      g.globalAlpha = 1;
    }
  }
  function beam(g, ox, oy, ang, len, spread, c, a) {
    const lg = g.createLinearGradient(ox, oy, ox + Math.cos(ang) * len, oy + Math.sin(ang) * len);
    lg.addColorStop(0, rgba(c, a)); lg.addColorStop(1, rgba(c, 0));
    g.fillStyle = lg;
    g.beginPath();
    g.moveTo(ox, oy);
    g.lineTo(ox + Math.cos(ang - spread) * len, oy + Math.sin(ang - spread) * len);
    g.lineTo(ox + Math.cos(ang + spread) * len, oy + Math.sin(ang + spread) * len);
    g.closePath();
    g.fill();
    const rg = g.createRadialGradient(ox, oy, 0, ox, oy, 12);
    rg.addColorStop(0, rgba(c, Math.min(1, a * 4))); rg.addColorStop(1, rgba(c, 0));
    g.fillStyle = rg;
    g.fillRect(ox - 12, oy - 12, 24, 24);
  }
  function beams(g, t, wgt) {
    const b = beatAt(t);
    g.save();
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 9; i++) {
      const ang = Math.PI / 2 + Math.sin(t * 0.55 + i * 0.9) * 0.55 * (i % 2 ? 1 : -1);
      beam(g, 400 + i * 100, 194, ang, 1100, 0.04, [140, 190, 255], (0.13 + 0.1 * b) * wgt);
    }
    for (let i = 0; i < 6; i++) {
      const ang = -Math.PI / 2 + Math.sin(t * 0.4 + i * 1.3) * 0.35;
      beam(g, 585 + i * 86, 586, ang, 640, 0.022, [225, 238, 255], (0.16 + 0.22 * b) * wgt);
    }
    g.restore();
  }
  function goldLight(g, t, wgt, dust) {
    g.save();
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 5; i++) {
      const sx = 690 + i * 55, ox = 600 + i * 100;
      const lg = g.createLinearGradient(ox, 194, sx, 594);
      lg.addColorStop(0, `rgba(255,205,120,${0.22 * wgt})`); lg.addColorStop(1, `rgba(255,190,100,${0.05 * wgt})`);
      g.fillStyle = lg;
      g.beginPath(); g.moveTo(ox - 3, 194); g.lineTo(ox + 3, 194); g.lineTo(sx + 22, 596); g.lineTo(sx - 22, 596); g.closePath(); g.fill();
    }
    for (const d of dust) {
      const y = 600 - mod(d.y + t * d.sp, 420), x = d.x + Math.sin(t * 0.7 + d.ph) * 12;
      g.fillStyle = `rgba(255,215,140,${0.55 * wgt * Math.sin(((600 - y) / 420) * Math.PI)})`;
      g.fillRect(x, y, d.s, d.s);
    }
    g.restore();
  }
  function standing(seed) {
    const r = rnd(seed), rows = [], R = 15;
    for (let i = 0; i < R; i++) {
      const p = Math.pow(i / (R - 1), 1.8), y = lerp(612, 975, p), rad = lerp(4.4, 50, p), ppl = [];
      for (let x = -rad * 2 + r() * rad; x < W + rad * 2; x += rad * (1.6 + r() * 1.3))
        ppl.push({ x, dy: (r() - 0.5) * rad * 1.6, s: 0.8 + r() * 0.42, arm: r(), ph: r() * TAU, phone: r() < 0.3 });
      rows.push({ y, rad, ppl, p });
    }
    return rows;
  }
  function drawStanding(g, rows, t, col, wgt, jump) {
    g.save();
    g.globalAlpha = wgt;
    const share = 0.04 + 0.14 * jump, hop = t * TAU * 124 / 120;
    for (const row of rows) {
      const { y, rad, ppl, p } = row;
      const dark = mix(mix([4, 5, 9], col, 0.06), [2, 3, 5], p);
      g.fillStyle = rgba(dark, 1);
      g.beginPath();
      const arms = [];
      for (const q of ppl) {
        const r = rad * q.s;
        const bob = -jump * Math.pow(Math.max(0, Math.sin(hop + q.ph * 0.4)), 2) * r * 0.45 + Math.sin(t * 1.3 + q.ph) * r * 0.05;
        const cx = q.x + Math.sin(t * 0.6 + q.ph) * r * 0.08, cy = y + q.dy + bob;
        g.moveTo(cx - r * 1.6, cy + r * 3.4);
        g.bezierCurveTo(cx - r * 1.65, cy + r, cx - r * 1.35, cy + r * 0.4, cx - r * 0.5, cy + r * 0.3);
        g.lineTo(cx + r * 0.5, cy + r * 0.3);
        g.bezierCurveTo(cx + r * 1.35, cy + r * 0.4, cx + r * 1.65, cy + r, cx + r * 1.6, cy + r * 3.4);
        g.closePath();
        g.moveTo(cx + r * 0.8, cy - r * 0.9);
        g.ellipse(cx, cy - r * 0.9, r * 0.8, r, 0, 0, TAU);
        q.cx = cx; q.cy = cy; q.r = r;
        if (q.arm < share) arms.push(q);
      }
      g.fill();
      if (arms.length) {
        g.strokeStyle = rgba(dark, 1);
        g.lineWidth = rad * 0.5;
        g.lineCap = 'round';
        g.beginPath();
        for (const q of arms) {
          const sd = q.arm < share / 2 ? -1 : 1, sw = Math.sin(t * 2 + q.ph) * q.r * 0.5;
          q.hx = q.cx + sd * q.r * 1.5 + sw; q.hy = q.cy - q.r * 2.7;
          g.moveTo(q.cx + sd * q.r * 1.1, q.cy + q.r * 0.6);
          g.lineTo(q.hx, q.hy);
        }
        g.stroke();
      }
      g.strokeStyle = rgba(col, lerp(0.42, 0.1, p));
      g.lineWidth = Math.max(0.7, rad * 0.08);
      g.beginPath();
      for (const q of ppl) {
        const a0 = Math.PI * 1.25, a1 = Math.PI * 1.75, ey = q.cy - q.r * 0.9;
        g.moveTo(q.cx + q.r * 0.8 * Math.cos(a0), ey + q.r * Math.sin(a0));
        g.ellipse(q.cx, ey, q.r * 0.8, q.r, 0, a0, a1);
      }
      g.stroke();
      if (jump > 0) {
        g.globalCompositeOperation = 'lighter';
        for (const q of arms) {
          if (!q.phone) continue;
          const pr = Math.max(1.4, q.r * 0.26);
          const rg = g.createRadialGradient(q.hx, q.hy, 0, q.hx, q.hy, pr * 2.4);
          rg.addColorStop(0, `rgba(235,245,255,${0.85 * jump})`); rg.addColorStop(0.35, `rgba(200,225,255,${0.35 * jump})`); rg.addColorStop(1, 'rgba(200,225,255,0)');
          g.fillStyle = rg;
          g.fillRect(q.hx - pr * 2.4, q.hy - pr * 2.4, pr * 4.8, pr * 4.8);
        }
        g.globalCompositeOperation = 'source-over';
      }
    }
    g.restore();
  }
  function seated(seed) {
    const r = rnd(seed), rows = [], R = 9;
    for (let i = 0; i < R; i++) {
      const p = Math.pow(i / (R - 1), 1.6), y = lerp(622, 985, p), rad = lerp(5.5, 46, p), ppl = [];
      for (let x = -rad * 3 + r() * rad * 2; x < W + rad * 3; x += rad * (2.8 + r() * 1.3)) if (r() > 0.1) ppl.push({ x, s: 0.9 + r() * 0.2, ph: r() * TAU, arm: r() });
      rows.push({ y, rad, ppl, p, curve: lerp(0.00011, 0.00003, p) });
    }
    return rows;
  }
  function drawSeated(g, rows, t, col, wgt, cheer) {
    g.save();
    g.globalAlpha = wgt;
    for (const row of rows) {
      const { y, rad, ppl, p, curve } = row, Y = x => y - curve * (x - 800) * (x - 800);
      const dark = mix(mix([4, 5, 9], col, 0.06), [2, 3, 5], p);
      g.fillStyle = rgba(dark, 1);
      g.beginPath();
      const arms = [];
      for (const q of ppl) {
        const r = rad * q.s, cx = q.x + Math.sin(t * 0.5 + q.ph) * r * 0.06, cy = Y(q.x) - rad * 0.4 + Math.sin(t * 0.8 + q.ph) * r * 0.04;
        g.moveTo(cx - r * 1.5, cy + r * 2.2);
        g.bezierCurveTo(cx - r * 1.55, cy + r, cx - r * 1.3, cy + r * 0.4, cx - r * 0.5, cy + r * 0.3);
        g.lineTo(cx + r * 0.5, cy + r * 0.3);
        g.bezierCurveTo(cx + r * 1.3, cy + r * 0.4, cx + r * 1.55, cy + r, cx + r * 1.5, cy + r * 2.2);
        g.closePath();
        g.moveTo(cx + r * 0.8, cy - r * 0.9);
        g.ellipse(cx, cy - r * 0.9, r * 0.8, r, 0, 0, TAU);
        q.cx = cx; q.cy = cy; q.r = r;
        if (cheer && q.arm < 0.55) arms.push(q);
      }
      g.fill();
      if (arms.length) {
        g.strokeStyle = rgba(dark, 1);
        g.lineWidth = rad * 0.45;
        g.lineCap = 'round';
        g.beginPath();
        for (const q of arms) for (const sd of [-1, 1]) { g.moveTo(q.cx + sd * q.r * 1.05, q.cy + q.r * 0.6); g.lineTo(q.cx + sd * q.r * 1.7, q.cy - q.r * 2.5 + Math.sin(t * 9 + q.ph) * q.r * 0.3); }
        g.stroke();
      }
      g.strokeStyle = rgba(col, lerp(0.4, 0.12, p));
      g.lineWidth = Math.max(0.7, rad * 0.08);
      g.beginPath();
      for (const q of ppl) { const a0 = Math.PI * 1.15, ey = q.cy - q.r * 0.9; g.moveTo(q.cx + q.r * 0.8 * Math.cos(a0), ey + q.r * Math.sin(a0)); g.ellipse(q.cx, ey, q.r * 0.8, q.r, 0, a0, Math.PI * 1.85); }
      g.stroke();
      // the sofa backs in front of them
      const top = x => Y(x) + rad * 1.25, th = rad * 1.6;
      const sg = g.createLinearGradient(0, y + rad, 0, y + rad + th);
      sg.addColorStop(0, 'rgb(58,64,76)'); sg.addColorStop(1, 'rgb(14,16,21)');
      g.fillStyle = sg;
      g.beginPath();
      g.moveTo(-40, top(-40));
      for (let x = -40; x <= W + 40; x += 40) g.lineTo(x, top(x));
      for (let x = W + 40; x >= -40; x -= 40) g.lineTo(x, top(x) + th);
      g.closePath();
      g.fill();
      g.strokeStyle = rgba(col, 0.45);
      g.lineWidth = Math.max(1, rad * 0.08);
      g.beginPath();
      g.moveTo(-40, top(-40));
      for (let x = -40; x <= W + 40; x += 40) g.lineTo(x, top(x));
      g.stroke();
      g.fillStyle = 'rgba(0,0,0,.55)';
      for (let x = mod(rad * 4, rad * 11); x < W; x += rad * 11) g.fillRect(x, top(x) - 1, Math.max(2, rad * 0.35), th + 2);
    }
    g.restore();
  }

  /* =====================================================================================
     PAC-MAN LIVE
     ===================================================================================== */
  const MAZE = [
    '###############',
    '#o.....#.....o#',
    '#.##.#.#.#.##.#',
    '#.#..#...#..#.#',
    '#...###.###...#',
    '#.#.........#.#',
    '#...##.#.##...#',
    '#.#....#....#.#',
    '#.##.#####.##.#',
    '#o...........o#',
    '###############',
  ];
  const ROWS = MAZE.length, COLS = MAZE[0].length, WALL_H = 0.55;
  const GHOSTS = [[255, 48, 64], [255, 140, 214], [56, 228, 255], [255, 176, 66]];

  function pacman(box) {
    box.innerHTML = '<canvas class="pm-c"></canvas>';
    const c = box.querySelector('canvas'), g = c.getContext('2d');
    const open = (cc, r) => r >= 0 && r < ROWS && cc >= 0 && cc < COLS && MAZE[r][cc] !== '#';
    const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const R = rnd(5);
    const pellets = new Map();
    for (let r = 0; r < ROWS; r++) for (let cc = 0; cc < COLS; cc++) if (open(cc, r)) pellets.set(r * COLS + cc, { power: MAZE[r][cc] === 'o', back: 0 });
    const bfs = (sc, sr) => {
      const d = new Int16Array(ROWS * COLS).fill(-1), q = [sr * COLS + sc];
      d[q[0]] = 0;
      for (let i = 0; i < q.length; i++) {
        const cc = q[i] % COLS, r = (q[i] / COLS) | 0;
        for (const [dx, dy] of DIRS) { const n = (r + dy) * COLS + cc + dx; if (open(cc + dx, r + dy) && d[n] < 0) { d[n] = d[q[i]] + 1; q.push(n); } }
      }
      return d;
    };
    const mk = (kind, cc, r, sp, col) => ({ kind, c: cc, r, nc: cc, nr: r, k: 1, sp, col, ph: R() * TAU, dir: [0, -1], flash: 0 });
    const players = [mk('p', 1, 9, 1.55), mk('p', 13, 1, 1.55)];
    const ghosts = GHOSTS.map((col, i) => mk('g', [6, 8, 7, 10][i], [5, 5, 3, 5][i], 1.35, col));
    let fright = 0;

    function choose(a, t) {
      const opts = DIRS.filter(([dx, dy]) => open(a.c + dx, a.r + dy));
      const fwd = opts.filter(([dx, dy]) => !(dx === -a.dir[0] && dy === -a.dir[1]));
      const pool = fwd.length ? fwd : opts;
      let pick;
      if (a.kind === 'p') {
        // walk on, but prefer the way that puts distance between you and the nearest ghost
        let best = -Infinity;
        for (const d of pool) {
          const nc = a.c + d[0], nr = a.r + d[1];
          let near = 99;
          for (const gh of ghosts) near = Math.min(near, Math.abs(gh.c - nc) + Math.abs(gh.r - nr));
          const sc = (fright > 0 ? -near * 0.3 : near) + R() * 2.2 + (pellets.get(nr * COLS + nc)?.back === 0 ? 0.8 : 0);
          if (sc > best) { best = sc; pick = d; }
        }
      } else {
        const tgt = players.reduce((p, q) => (Math.abs(q.c - a.c) + Math.abs(q.r - a.r) < Math.abs(p.c - a.c) + Math.abs(p.r - a.r) ? q : p));
        const d = bfs(tgt.c, tgt.r);
        let best = 1e9;
        for (const dd of pool) {
          const v = d[(a.r + dd[1]) * COLS + a.c + dd[0]];
          const sc = (fright > 0 ? -v : v) + R() * (fright > 0 ? 1 : 0.9);
          if (sc < best) { best = sc; pick = dd; }
        }
        if (R() < 0.15) pick = pool[(R() * pool.length) | 0];
      }
      pick = pick || pool[0];
      a.dir = pick;
      a.nc = a.c + pick[0];
      a.nr = a.r + pick[1];
    }
    const pos = a => [lerp(a.c, a.nc, a.k) + 0.5, ROWS - 1 - lerp(a.r, a.nr, a.k) + 0.5];

    function step(dt, t) {
      fright = Math.max(0, fright - dt);
      for (const a of [...players, ...ghosts]) {
        const sp = a.kind === 'g' && fright > 0 ? a.sp * 0.6 : a.sp;
        a.k += sp * dt;
        a.ph += dt * 8;
        a.flash = Math.max(0, a.flash - dt);
        while (a.k >= 1) {
          a.k -= 1;
          a.c = a.nc;
          a.r = a.nr;
          if (a.kind === 'p') {
            const pe = pellets.get(a.r * COLS + a.c);
            if (pe && pe.back === 0) { pe.back = t + (pe.power ? 14 : 7); if (pe.power) fright = 6; }
          }
          choose(a, t);
        }
      }
      for (const pe of pellets.values()) if (pe.back && t > pe.back) pe.back = 0;
      for (const p of players) for (const gh of ghosts) {
        const [ax, ay] = pos(p), [bx, by] = pos(gh);
        if (Math.hypot(ax - bx, ay - by) < 0.55 && p.flash === 0 && gh.flash === 0) {
          if (fright > 0) gh.flash = 2.5; else p.flash = 1.6;
        }
      }
    }

    // camera
    let cam, f, rt, up;
    const F = 1300;
    function setCam(t) {
      const sx = Math.sin(t * 0.16) * 1.3;
      cam = [7.5 + sx, -8.5, 10.5];
      const tg = [7.5 + sx * 0.35, 4.6, 0];
      const d = [tg[0] - cam[0], tg[1] - cam[1], tg[2] - cam[2]], l = Math.hypot(...d);
      f = d.map(v => v / l);
      const rx = [f[1], -f[0], 0], rl = Math.hypot(...rx);
      rt = rx.map(v => v / rl);
      up = [rt[1] * f[2] - rt[2] * f[1], rt[2] * f[0] - rt[0] * f[2], rt[0] * f[1] - rt[1] * f[0]];
    }
    function P(x, y, z) {
      const dx = x - cam[0], dy = y - cam[1], dz = z - cam[2];
      const zc = dx * f[0] + dy * f[1] + dz * f[2];
      return [W / 2 + ((dx * rt[0] + dy * rt[1] + dz * rt[2]) / zc) * F, H / 2 - ((dx * up[0] + dy * up[1] + dz * up[2]) / zc) * F, zc];
    }
    const poly = pts => { g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); };

    function venue(t) {
      const bg = g.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#060818'); bg.addColorStop(0.45, '#0a0f2a'); bg.addColorStop(1, '#03040a');
      g.fillStyle = bg;
      g.fillRect(0, 0, W, H);
      // the far wall: a neon Pac-Man chasing a ghost
      const [sx, sy, sz] = P(7.5, ROWS + 1.5, 1.7), s = (F / sz) * 0.0125;
      g.save();
      g.translate(sx, sy);
      g.scale(s, s);
      const mouth = 0.25 + 0.2 * Math.abs(Math.sin(t * 5));
      g.shadowColor = '#ffe14d'; g.shadowBlur = 30;
      g.strokeStyle = '#ffe14d'; g.lineWidth = 9;
      g.beginPath(); g.arc(-150, 0, 70, mouth * Math.PI, (2 - mouth) * Math.PI); g.lineTo(-150, 0); g.closePath(); g.stroke();
      g.fillStyle = '#ffe14d';
      for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(-40 + i * 50, 0, 9, 0, TAU); g.fill(); }
      g.shadowColor = '#ff3040'; g.strokeStyle = '#ff3040';
      g.beginPath(); g.moveTo(130, 60); g.lineTo(130, -10); g.arc(190, -10, 60, Math.PI, 0); g.lineTo(250, 60);
      for (let i = 0; i < 4; i++) g.lineTo(250 - (i + 0.5) * 30, 60 - (i % 2 ? 0 : 18));
      g.closePath(); g.stroke();
      g.restore();
      g.shadowBlur = 0;
      for (let i = 0; i < 7; i++) {
        const [lx, ly] = P(1.5 + i * 2, ROWS + 3, 3.4);
        const rg = g.createRadialGradient(lx, ly, 0, lx, ly, 60);
        rg.addColorStop(0, 'rgba(160,190,255,.5)'); rg.addColorStop(1, 'rgba(160,190,255,0)');
        g.fillStyle = rg;
        g.fillRect(lx - 60, ly - 60, 120, 120);
      }
    }

    function frame(t, dt) {
      step(dt, t);
      setCam(t);
      g.setTransform(c.width / W, 0, 0, c.height / H, 0, 0);
      venue(t);
      // floor
      poly([P(-1, -1, 0), P(COLS + 1, -1, 0), P(COLS + 1, ROWS + 1, 0), P(-1, ROWS + 1, 0)]);
      const fl = g.createLinearGradient(0, 200, 0, H);
      fl.addColorStop(0, '#070a1c'); fl.addColorStop(1, '#03040b');
      g.fillStyle = fl;
      g.fill();
      g.strokeStyle = 'rgba(70,110,255,.07)';
      g.lineWidth = 1;
      g.beginPath();
      for (let i = 0; i <= COLS; i++) { const a = P(i, 0, 0), b = P(i, ROWS, 0); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
      for (let j = 0; j <= ROWS; j++) { const a = P(0, j, 0), b = P(COLS, j, 0); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
      g.stroke();
      // pellets and the light pools under everyone, on the floor
      g.globalCompositeOperation = 'lighter';
      for (const [key, pe] of pellets) {
        if (pe.back) continue;
        const cc = key % COLS, r = (key / COLS) | 0, [px, py, z] = P(cc + 0.5, ROWS - 1 - r + 0.5, 0.06);
        const rr = (pe.power ? 0.16 : 0.06) * F / z * (pe.power ? 1 + 0.2 * Math.sin(t * 6) : 1);
        const rg = g.createRadialGradient(px, py, 0, px, py, rr * 3);
        rg.addColorStop(0, 'rgba(255,240,180,1)'); rg.addColorStop(0.3, 'rgba(255,220,120,.6)'); rg.addColorStop(1, 'rgba(255,200,80,0)');
        g.fillStyle = rg;
        g.fillRect(px - rr * 3, py - rr * 3, rr * 6, rr * 6);
      }
      for (const a of [...players, ...ghosts]) {
        const [wx, wy] = pos(a), [px, py, z] = P(wx, wy, 0), rr = 0.75 * F / z;
        const colr = a.kind === 'p' ? (a.flash ? [255, 60, 60] : [255, 225, 77]) : fright > 0 ? [70, 90, 255] : a.col;
        g.fillStyle = rgba(colr, 0.22);
        g.beginPath(); g.ellipse(px, py, rr, rr * 0.45, 0, 0, TAU); g.fill();
      }
      g.globalCompositeOperation = 'source-over';
      // walls and sprites, far to near
      const items = [];
      for (let r = 0; r < ROWS; r++) for (let cc = 0; cc < COLS; cc++) {
        if (MAZE[r][cc] !== '#') continue;
        const y0 = ROWS - 1 - r, ctr = P(cc + 0.5, y0 + 0.5, WALL_H / 2);
        items.push({ z: ctr[2], lat: Math.abs(cc + 0.5 - cam[0]), wall: [cc, r, y0] });
      }
      for (const a of [...players, ...ghosts]) { const [wx, wy] = pos(a); items.push({ z: P(wx, wy, 0)[2] - 0.35, lat: 0, a, wx, wy }); }
      items.sort((p, q) => q.z - p.z || q.lat - p.lat);
      for (const it of items) it.wall ? wall(...it.wall) : sprite(it.a, it.wx, it.wy, t);
      // haze
      const hz = g.createLinearGradient(0, 0, 0, H);
      hz.addColorStop(0, 'rgba(40,60,160,.18)'); hz.addColorStop(0.4, 'rgba(0,0,0,0)'); hz.addColorStop(1, 'rgba(0,0,0,.45)');
      g.fillStyle = hz;
      g.fillRect(0, 0, W, H);
    }

    function wall(cc, r, y0) {
      const x0 = cc, x1 = cc + 1, y1 = y0 + 1, h = WALL_H;
      const wl = (dc, dr) => !open(cc + dc, r + dr) && r + dr >= 0 && r + dr < ROWS && cc + dc >= 0 && cc + dc < COLS;
      const frontOpen = !wl(0, 1), leftOpen = !wl(-1, 0), rightOpen = !wl(1, 0), backOpen = !wl(0, -1);
      const T = [P(x0, y0, h), P(x1, y0, h), P(x1, y1, h), P(x0, y1, h)], B0 = P(x0, y0, 0), B1 = P(x1, y0, 0);
      if (leftOpen && cam[0] < x0) { poly([P(x0, y1, 0), B0, T[0], T[3]]); g.fillStyle = '#070d22'; g.fill(); }
      if (rightOpen && cam[0] > x1) { poly([B1, P(x1, y1, 0), T[2], T[1]]); g.fillStyle = '#070d22'; g.fill(); }
      if (frontOpen) {
        poly([B0, B1, T[1], T[0]]);
        const fg = g.createLinearGradient(0, T[0][1], 0, B0[1]);
        fg.addColorStop(0, '#13235a'); fg.addColorStop(1, '#060b1e');
        g.fillStyle = fg;
        g.fill();
      }
      poly(T);
      g.fillStyle = '#0c1430';
      g.fill();
      // neon tubes on the exposed top edges
      const lw = (0.05 * F) / T[0][2];
      const edges = [];
      if (frontOpen) edges.push([T[0], T[1]]);
      if (backOpen) edges.push([T[3], T[2]]);
      if (leftOpen) edges.push([T[0], T[3]]);
      if (rightOpen) edges.push([T[1], T[2]]);
      if (!edges.length) return;
      g.lineCap = 'round';
      for (const [w, a] of [[lw * 5, 'rgba(60,140,255,.22)'], [lw * 2.2, 'rgba(90,190,255,.55)'], [lw * 0.8, 'rgba(210,245,255,1)']]) {
        g.strokeStyle = a;
        g.lineWidth = w;
        g.beginPath();
        for (const [p, q] of edges) { g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); }
        g.stroke();
      }
      if (frontOpen) { g.strokeStyle = 'rgba(80,150,255,.35)'; g.lineWidth = lw; g.beginPath(); g.moveTo(B0[0], B0[1]); g.lineTo(B1[0], B1[1]); g.stroke(); }
    }

    function sprite(a, wx, wy, t) {
      const [px, py, z] = P(wx, wy, 0), s = F / z;
      if (a.kind === 'g') {
        const hgt = 1.15 * s, bob = Math.sin(t * 3 + a.ph) * 0.04 * s, w = hgt * 0.78, rw = w / 2;
        const top = py - hgt + bob, bot = py - 0.08 * s + bob;
        const scared = fright > 0 && a.flash === 0, gone = a.flash > 0;
        const col = scared ? (fright < 1.5 && Math.sin(t * 20) > 0 ? [240, 240, 255] : [60, 80, 255]) : a.col;
        g.save();
        if (gone) g.globalAlpha = 0.25;
        g.globalCompositeOperation = 'lighter';
        const hg = g.createRadialGradient(px, top + hgt * 0.5, 0, px, top + hgt * 0.5, hgt);
        hg.addColorStop(0, rgba(col, 0.35)); hg.addColorStop(1, rgba(col, 0));
        g.fillStyle = hg;
        g.fillRect(px - hgt, top - hgt * 0.5, hgt * 2, hgt * 2);
        g.globalCompositeOperation = 'source-over';
        g.beginPath();
        g.moveTo(px - rw, bot);
        g.lineTo(px - rw, top + rw);
        g.arc(px, top + rw, rw, Math.PI, 0);
        g.lineTo(px + rw, bot);
        const n = 4;
        for (let i = 0; i < n; i++) {
          const x0 = px + rw - (i / n) * w, x1 = px + rw - ((i + 1) / n) * w, wob = Math.sin(t * 9 + i + a.ph) * 0.05 * s;
          g.quadraticCurveTo((x0 + x1) / 2, bot - 0.12 * s + wob, x1, bot);
        }
        g.closePath();
        const bg = g.createLinearGradient(0, top, 0, bot);
        bg.addColorStop(0, rgba(mix(col, [255, 255, 255], 0.35), 1)); bg.addColorStop(1, rgba(mix(col, [0, 0, 0], 0.25), 1));
        g.fillStyle = bg;
        g.fill();
        const ex = a.dir[0] * rw * 0.12, ey = -a.dir[1] * rw * 0.06;
        for (const sd of [-1, 1]) {
          const cx = px + sd * rw * 0.38, cy = top + rw * 1.0;
          g.fillStyle = scared ? 'rgba(255,220,220,.9)' : '#fff';
          g.beginPath(); g.ellipse(cx, cy, rw * 0.24, rw * 0.3, 0, 0, TAU); g.fill();
          if (!scared) { g.fillStyle = '#1b3cff'; g.beginPath(); g.arc(cx + ex, cy + ey, rw * 0.12, 0, TAU); g.fill(); }
        }
        g.restore();
      } else {
        const hgt = 1.3 * s, sw = Math.sin(a.ph) * 0.22, hipY = py - hgt * 0.47;
        const red = a.flash > 0 && Math.sin(t * 25) > 0;
        g.lineCap = 'round';
        g.strokeStyle = '#141824';
        g.lineWidth = hgt * 0.085;
        g.beginPath();
        g.moveTo(px - hgt * 0.04, hipY); g.lineTo(px - hgt * 0.04 + sw * hgt * 0.35, py);
        g.moveTo(px + hgt * 0.04, hipY); g.lineTo(px + hgt * 0.04 - sw * hgt * 0.35, py);
        g.stroke();
        g.strokeStyle = '#1d2333';
        g.lineWidth = hgt * 0.06;
        g.beginPath();
        g.moveTo(px - hgt * 0.1, hipY - hgt * 0.3); g.lineTo(px - hgt * 0.14 - sw * hgt * 0.2, hipY - hgt * 0.02);
        g.moveTo(px + hgt * 0.1, hipY - hgt * 0.3); g.lineTo(px + hgt * 0.14 + sw * hgt * 0.2, hipY - hgt * 0.02);
        g.stroke();
        g.fillStyle = '#1a1f2e';
        g.fillRect(px - hgt * 0.11, hipY - hgt * 0.36, hgt * 0.22, hgt * 0.4);
        const vest = red ? '#ff3b3b' : '#ffe14d';
        g.shadowColor = vest;
        g.shadowBlur = hgt * 0.25;
        g.fillStyle = vest;
        g.fillRect(px - hgt * 0.1, hipY - hgt * 0.33, hgt * 0.2, hgt * 0.26);
        g.shadowBlur = 0;
        g.fillStyle = '#c8956b';
        g.beginPath(); g.arc(px, hipY - hgt * 0.43, hgt * 0.075, 0, TAU); g.fill();
        g.fillStyle = '#16110c';
        g.beginPath(); g.arc(px, hipY - hgt * 0.45, hgt * 0.075, Math.PI, TAU); g.fill();
      }
    }

    return {
      resize(k) {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        let pw = W * k * dpr, ph = H * k * dpr;
        const cap = 2400 * 1350;
        if (pw * ph > cap) { const s = Math.sqrt(cap / (pw * ph)); pw *= s; ph *= s; }
        c.width = Math.round(pw);
        c.height = Math.round(ph);
      },
      frame,
      set() {},
      get mode() { return 'play'; },
    };
  }

  window.Scenes = {
    vortex: el => host(el, vortex),
    pacman: el => host(el, pacman),
  };
})();
