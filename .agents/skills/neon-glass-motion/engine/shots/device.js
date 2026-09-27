/*
 * Neon Glass Motion — shot "device": how it works, shown rather than told.
 *
 * A dark matte glass device (a phone in 9:16, a window in 16:9, a floating card in 1:1) rises in
 * while its rim light ignites and a specular sweep crosses the glass. Inside, a simple UI builds
 * itself in light:
 *   calendar  a week read by a scan line, the team's events landing as it passes; one free slot
 *             is found (marching outline), then fills with light and a check
 *   list      rows slide in and are ticked off top to bottom, the last tick is the big one
 *   chart     bars grow, a trend line draws over them, the top bar lights up with a tooltip
 *   chat      a thread builds from the bottom, the reply is typed (three dots) then glows
 *   code      code types itself behind a caret; a "passed" toast pops in with a light sweep
 * Halfway through the beat that one element is the answer: it flashes white-hot, fires a small
 * shockwave and settles in the beat colour. The caption sits outside the device: under it in
 * 9:16 and 1:1, beside it in 16:9 (device left, text right; mirrored for right-to-left text).
 *
 * Params: kind ('phone' | 'window' | 'card', default auto by ratio), ui ('calendar' | 'list' |
 *         'chart' | 'chat' | 'code', default 'list'), text (optional caption, <= 5 words).
 * Positions are pixels; sizes handed to g.* helpers are units (g.u = min(W, H) / 100).
 * Output depends only on (g, s).
 */
(function () {
  'use strict';

  var RTL = /[֐-ࣿיִ-﷿ﹰ-﻿]/;
  var KINDS = { phone: 1, window: 1, card: 1 };
  var UIS = { calendar: 1, list: 1, chart: 1, chat: 1, code: 1 };
  var UI_ICON = { calendar: 'calendar', list: 'check', chart: 'chart', chat: 'chat', code: 'code' };
  var WHITE = '#FFFFFF';

  // ───────────────────────────────────────────────────────────── helpers

  // The safe box shrunk by this beat's camera move, so nothing leaves it on the last frame either.
  function fitBox(g, s) {
    var cam = String((s.beat && s.beat.camera) || 'push');
    var k = 1, dx = 0, dy = 0;
    if (cam === 'push' || cam === 'pull') k = 1 + 0.05 * (0.5 + s.energy);
    else if (cam === 'drift') { k = 1 + 0.015 * (0.5 + s.energy); dx = 1.7 * g.u; dy = 1.2 * g.u; }
    return { w: (g.safe.w - 2 * dx) / k, h: (g.safe.h - 2 * dy) / k };
  }

  function clean(v) {
    return String(v == null ? '' : v).replace(/\r/g, '').replace(/[ \t ]+/g, ' ').replace(/ *\n */g, '\n').trim();
  }

  // Rounded-rect path in pixels; r is one radius or [topLeft, topRight, bottomRight, bottomLeft].
  function rr(c, x, y, w, h, r) {
    if (w < 0) { x += w; w = -w; }
    if (h < 0) { y += h; h = -h; }
    var m = Math.min(w, h) / 2;
    var a = Array.isArray(r) ? r : [r, r, r, r];
    var tl = Math.max(0, Math.min(a[0], m)), tr = Math.max(0, Math.min(a[1], m));
    var br = Math.max(0, Math.min(a[2], m)), bl = Math.max(0, Math.min(a[3], m));
    c.beginPath();
    c.moveTo(x + tl, y);
    c.lineTo(x + w - tr, y);
    if (tr) c.arcTo(x + w, y, x + w, y + tr, tr);
    c.lineTo(x + w, y + h - br);
    if (br) c.arcTo(x + w, y + h, x + w - br, y + h, br);
    c.lineTo(x + bl, y + h);
    if (bl) c.arcTo(x, y + h, x, y + h - bl, bl);
    c.lineTo(x, y + tl);
    if (tl) c.arcTo(x, y, x + tl, y, tl);
    c.closePath();
  }

  // Run draw() with the same extra transform / clip / alpha on the main and the bloom layer.
  function layer(g, setup, draw) {
    g.ctx.save(); g.bctx.save();
    try { setup(g.ctx); setup(g.bctx); draw(); } finally { g.ctx.restore(); g.bctx.restore(); }
  }
  function about(x, y, k, dx, dy) {
    return function (c) { c.translate(x + (dx || 0), y + (dy || 0)); c.scale(k, k); c.translate(-x, -y); };
  }
  function clipTo(x, y, w, h, r) {
    return function (c) { rr(c, x, y, w, h, r || 0); c.clip(); };
  }

  // Matte shapes on the main layer only: UI copy and chrome carry no light of their own.
  function fillRR(c, x, y, w, h, r, fill) {
    if (!(w > 0.5 && h > 0.5)) return;
    rr(c, x, y, w, h, r);
    c.fillStyle = fill;
    c.fill();
  }
  function pill(c, x, y, w, h, fill) { fillRR(c, x, y, w, h, h / 2, fill); }
  function hair(c, x1, y1, x2, y2, col, lw) {
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.strokeStyle = col;
    c.lineWidth = lw;
    c.stroke();
  }

  // Lit shapes: `main` fill on the picture, `glow` fill on the bloom layer (either may be null).
  function litRR(g, x, y, w, h, r, main, glow) {
    if (!(w > 0.5 && h > 0.5)) return;
    g.lit(function (c, bloom) {
      var f = bloom ? glow : main;
      if (!f) return;
      rr(c, x, y, w, h, r);
      c.fillStyle = f;
      c.fill();
    });
  }
  function litDot(g, x, y, r, main, glow) {
    if (!(r > 0.2)) return;
    g.lit(function (c, bloom) {
      var f = bloom ? glow : main;
      if (!f) return;
      c.beginPath();
      c.arc(x, y, bloom ? r * 1.6 : r, 0, Math.PI * 2);
      c.fillStyle = f;
      c.fill();
    });
  }

  // A glass avatar: dark disc with the person's colour inside and a lit ring.
  function avatar(g, x, y, r, col, a) {
    if (!(r > 0.5) || a <= 0) return;
    g.lit(function (c, bloom) {
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      if (bloom) {
        c.fillStyle = '#000';
        c.fill();
      } else {
        c.fillStyle = '#0B0C11';
        c.fill();
        var gr = c.createRadialGradient(x - r * 0.3, y - r * 0.4, 0, x, y, r);
        gr.addColorStop(0, g.rgba(g.lighten(col, 0.3), 0.6 * a));
        gr.addColorStop(1, g.rgba(col, 0.12 * a));
        c.fillStyle = gr;
        c.fill();
      }
      c.lineWidth = Math.max(1, r * (bloom ? 0.36 : 0.13));
      c.strokeStyle = g.rgba(bloom ? col : g.lighten(col, 0.2), (bloom ? 0.55 : 0.95) * a);
      c.stroke();
    });
  }

  // ───────────────────────────────────────────────────────────── device bodies

  // Every body returns the screen S (drawn dark) and the content rect R the UI is laid into.
  function screenFill(K, S) {
    var c = K.g.ctx;
    rr(c, S.x, S.y, S.w, S.h, S.r);
    var gr = c.createLinearGradient(0, S.y, 0, S.y + S.h);
    gr.addColorStop(0, '#05060A');
    gr.addColorStop(1, '#010102');
    c.fillStyle = gr;
    c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.06)';
    c.lineWidth = Math.max(1, 0.1 * K.u);
    c.stroke();
  }

  // Glass glare over the screen: a static diagonal reflection plus the moving specular band.
  function glare(K, S) {
    var g = K.g, c = g.ctx;
    c.save();
    rr(c, S.x, S.y, S.w, S.h, S.r);
    c.clip();
    c.globalCompositeOperation = 'lighter';
    var gr = c.createLinearGradient(S.x, S.y, S.x + S.w * 0.75, S.y + S.h * 0.55);
    gr.addColorStop(0, 'rgba(255,255,255,0.04)');
    gr.addColorStop(0.46, 'rgba(255,255,255,0.01)');
    gr.addColorStop(0.47, 'rgba(255,255,255,0)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = gr;
    c.fillRect(S.x, S.y, S.w, S.h);
    if (K.shine >= 0 && K.shine <= 1) {
      var bw = Math.min(S.w, S.h) * 0.6, px = g.lerp(S.x - bw, S.x + S.w + bw, K.shine);
      c.translate(px, S.y + S.h / 2);
      c.rotate(0.35);
      var sc = g.lighten(K.c1, 0.75);
      var gs = c.createLinearGradient(-bw / 2, 0, bw / 2, 0);
      gs.addColorStop(0, g.rgba(sc, 0));
      gs.addColorStop(0.42, g.rgba(sc, 0.03));
      gs.addColorStop(0.5, g.rgba(sc, 0.085));
      gs.addColorStop(0.58, g.rgba(sc, 0.03));
      gs.addColorStop(1, g.rgba(sc, 0));
      c.fillStyle = gs;
      c.fillRect(-bw / 2, -(S.w + S.h), bw, 2 * (S.w + S.h));
    }
    c.restore();
  }

  function phoneBody(K, d, ui) {
    var g = K.g, c = g.ctx, u = K.u, W = d.w, H = d.h;
    var r = W * 0.155, bez = W * 0.034, bt = W * 0.013;
    // side buttons, half tucked behind the body
    var BTN = [[-1, 0.18, 0.045], [-1, 0.255, 0.075], [-1, 0.345, 0.075], [1, 0.265, 0.11]];
    g.lit(function (cc, bloom) {
      for (var i = 0; i < BTN.length; i++) {
        var bx = BTN[i][0] < 0 ? d.x - bt : d.x + W - bt;
        rr(cc, bx, d.y + H * BTN[i][1], bt * 2, H * BTN[i][2], bt);
        cc.fillStyle = bloom ? g.rgba(K.c1, 0.22 * K.rim) : '#111319';
        cc.fill();
        if (!bloom) {
          cc.strokeStyle = g.rgba(K.c1, 0.4 * K.rim);
          cc.lineWidth = Math.max(1, 0.12 * u);
          cc.stroke();
        }
      }
    });
    g.glass(d.x, d.y, W, H, {
      r: r / u, color: K.c1, rim: K.rim, shine: K.shine, depth: 0.75, tint: 0.06,
      glow: (0.3 + 0.4 * K.hi) * K.gk, alpha: K.bodyA
    });
    var S = { x: d.x + bez, y: d.y + bez, w: W - 2 * bez, h: H - 2 * bez, r: r - bez * 0.9 };
    screenFill(K, S);
    // dynamic island with a lens glint, status bar
    var iw = W * 0.3, ih = W * 0.088, iy = S.y + W * 0.03, icy = iy + ih / 2;
    fillRR(c, d.x + W / 2 - iw / 2, iy, iw, ih, ih / 2, '#000');
    litDot(g, d.x + W / 2 + iw / 2 - ih / 2, icy, ih * 0.2, g.rgba(g.mix('#15171F', K.c1, 0.35), 1), g.rgba(K.c1, 0.25));
    var ca = K.chromeA;
    pill(c, S.x + W * 0.085, icy - W * 0.014, W * 0.1, W * 0.028, g.rgba(WHITE, 0.78 * ca));
    for (var i = 0; i < 3; i++) {
      var sh = W * (0.012 + 0.006 * i);
      fillRR(c, S.x + S.w - W * 0.245 + i * W * 0.02, icy + W * 0.014 - sh, W * 0.012, sh, W * 0.004, g.rgba(WHITE, 0.7 * ca));
    }
    c.save();
    rr(c, S.x + S.w - W * 0.16, icy - W * 0.015, W * 0.062, W * 0.03, W * 0.008);
    c.strokeStyle = g.rgba(WHITE, 0.55 * ca);
    c.lineWidth = Math.max(1, W * 0.003);
    c.stroke();
    c.restore();
    fillRR(c, S.x + S.w - W * 0.154, icy - W * 0.009, W * 0.04, W * 0.018, W * 0.004, g.rgba(WHITE, 0.7 * ca));
    // home indicator
    pill(c, d.x + W / 2 - W * 0.17, S.y + S.h - W * 0.045, W * 0.34, W * 0.013, g.rgba(WHITE, 0.32 * ca));

    var R = { x: S.x + W * 0.065, y: iy + ih + W * 0.085, w: S.w - W * 0.13, h: 0 };
    R.h = S.y + S.h - W * 0.1 - R.y;
    if (ui !== 'chat') {
      // a tab bar: the UI's own tab is lit
      var tabH = W * 0.155, ty = S.y + S.h - W * 0.085 - tabH;
      hair(c, S.x + W * 0.04, ty, S.x + S.w - W * 0.04, ty, g.rgba(WHITE, 0.07 * ca), Math.max(1, 0.1 * u));
      var TABS = ['home', 'search', UI_ICON[ui], 'gear'];
      for (var k = 0; k < TABS.length; k++) {
        var tx = S.x + S.w * (k + 0.5) / TABS.length, on = k === 2;
        g.icon(TABS[k], tx, ty + tabH * 0.46, W * 0.062 / u, {
          color: on ? g.lighten(K.c1, 0.25) : WHITE, glowColor: K.c1,
          alpha: (on ? 1 : 0.34) * ca, glow: on ? 0.55 * K.gk : 0
        });
      }
      R.h = ty - W * 0.03 - R.y;
    }
    return { S: S, R: R, header: true };
  }

  function windowBody(K, d) {
    var g = K.g, c = g.ctx, u = K.u, W = d.w, H = d.h, m = Math.min(W, H);
    var r = m * 0.05, ins = Math.max(1, 0.35 * u);
    g.glass(d.x, d.y, W, H, {
      r: r / u, color: K.c1, rim: K.rim, shine: K.shine, depth: 0.7, tint: 0.06,
      glow: (0.3 + 0.4 * K.hi) * K.gk, alpha: K.bodyA
    });
    var th = Math.max(H * 0.085, 3.6 * u), ca = K.chromeA;
    var S = { x: d.x + ins, y: d.y + th, w: W - 2 * ins, h: H - th - ins, r: [0, 0, r - ins, r - ins] };
    screenFill(K, S);
    // title bar: three quiet dots and an address pill
    for (var i = 0; i < 3; i++) {
      c.beginPath();
      c.arc(d.x + th * 0.52 + i * th * 0.4, d.y + th / 2, th * 0.115, 0, Math.PI * 2);
      c.fillStyle = g.rgba(WHITE, (0.24 - 0.05 * i) * ca);
      c.fill();
    }
    var pw = Math.min(W * 0.34, 44 * u), ph = th * 0.46;
    c.save();
    rr(c, d.x + W / 2 - pw / 2, d.y + th / 2 - ph / 2, pw, ph, ph / 2);
    c.fillStyle = g.rgba(WHITE, 0.045 * ca);
    c.fill();
    c.strokeStyle = g.rgba(WHITE, 0.07 * ca);
    c.lineWidth = Math.max(1, 0.1 * u);
    c.stroke();
    c.restore();
    pill(c, d.x + W / 2 - pw * 0.2, d.y + th / 2 - th * 0.055, pw * 0.4, th * 0.11, g.rgba(WHITE, 0.3 * ca));
    litDot(g, d.x + W / 2 - pw * 0.28, d.y + th / 2, th * 0.07, g.rgba(K.c1, 0.9 * ca), g.rgba(K.c1, 0.5 * ca));

    var pad = m * 0.055;
    var R = { x: S.x + pad, y: S.y + pad, w: S.w - 2 * pad, h: S.h - 2 * pad };
    if (W > 58 * u && K.dens >= 0.3) {
      // a quiet sidebar; the active item is lit
      var sw = W * 0.2;
      fillRR(c, S.x, S.y, sw, S.h, [0, 0, 0, r - ins], g.rgba(WHITE, 0.018 * ca));
      hair(c, S.x + sw, S.y, S.x + sw, S.y + S.h, g.rgba(WHITE, 0.05 * ca), Math.max(1, 0.1 * u));
      var ih = Math.min(th * 0.95, S.h / 8);
      for (var k = 0; k < 6; k++) {
        var iy = S.y + pad * 0.6 + ih * (k + 0.5), on = k === 1;
        if (iy + ih / 2 > S.y + S.h - pad * 0.5) break;
        if (on) fillRR(c, S.x + th * 0.22, iy - ih * 0.36, sw - th * 0.44, ih * 0.72, ih * 0.2, g.rgba(K.c1, 0.14 * ca));
        if (on) litDot(g, S.x + th * 0.55, iy, th * 0.085, g.rgba(g.lighten(K.c1, 0.2), ca), g.rgba(K.c1, 0.6 * ca));
        else {
          c.beginPath();
          c.arc(S.x + th * 0.55, iy, th * 0.085, 0, Math.PI * 2);
          c.fillStyle = g.rgba(WHITE, 0.2 * ca);
          c.fill();
        }
        pill(c, S.x + th * 0.85, iy - th * 0.06, (sw - th * 1.2) * (0.72 - 0.14 * (k % 3)), th * 0.12, g.rgba(WHITE, (on ? 0.72 : 0.24) * ca));
      }
      R.x += sw;
      R.w -= sw;
    }
    return { S: S, R: R, header: true };
  }

  function cardBody(K, d, ui) {
    var g = K.g, c = g.ctx, u = K.u, W = d.w, H = d.h, m = Math.min(W, H);
    var r = m * 0.085, pad = m * 0.075, hs = m * 0.14, ca = K.chromeA;
    g.glass(d.x, d.y, W, H, {
      r: r / u, color: K.c1, rim: K.rim, shine: K.shine, depth: 0.7, tint: 0.07,
      glow: (0.3 + 0.4 * K.hi) * K.gk, alpha: K.bodyA
    });
    // header: a small glass icon tile, a title and a subtitle
    var hx = d.x + pad, hy = d.y + pad;
    g.glass(hx, hy, hs, hs, { r: hs * 0.28 / u, color: K.c1, rim: 0.85 * K.rim, depth: 0.6, glow: 0.22 * K.gk * ca, tint: 0.12, alpha: K.bodyA });
    g.icon(UI_ICON[ui], hx + hs / 2, hy + hs / 2, hs * 0.54 / u, {
      color: g.lighten(K.c1, 0.35), glowColor: K.c1, glow: 0.6 * K.gk, alpha: ca
    });
    var tx = hx + hs + pad * 0.55, tw = W - (tx - d.x) - pad;
    pill(c, tx, hy + hs * 0.17, tw * 0.46, hs * 0.23, g.rgba(WHITE, 0.86 * ca));
    pill(c, tx, hy + hs * 0.6, tw * 0.28, hs * 0.16, g.rgba(WHITE, 0.28 * ca));
    for (var i = 0; i < 3; i++) {
      c.beginPath();
      c.arc(d.x + W - pad - hs * 0.1 - i * hs * 0.17, hy + hs * 0.3, hs * 0.045, 0, Math.PI * 2);
      c.fillStyle = g.rgba(WHITE, 0.4 * ca);
      c.fill();
    }
    var ly = hy + hs + pad * 0.5;
    hair(c, d.x + pad, ly, d.x + W - pad, ly, g.rgba(WHITE, 0.06 * ca), Math.max(1, 0.1 * u));
    var S = { x: d.x, y: d.y, w: W, h: H, r: r };
    var R = { x: d.x + pad, y: ly + pad * 0.6, w: W - 2 * pad, h: 0 };
    R.h = d.y + H - pad - R.y;
    return { S: S, R: R, header: false };
  }

  // ───────────────────────────────────────────────────────────── UIs

  // Calendar: day columns, the team's events land as a scan line reads down; one free slot is found.
  var PAT = [
    [[0.04, 0.15, 0], [0.36, 0.22, 1], [0.74, 0.16, 2]],
    [[0.12, 0.2, 1], [0.5, 0.13, 0], [0.8, 0.14, 1]],
    [[0.02, 0.13, 2], [0.24, 0.16, 0], [0.7, 0.2, 2]],
    [[0.07, 0.25, 0], [0.47, 0.16, 2], [0.77, 0.17, 0]],
    [[0.17, 0.15, 2], [0.39, 0.24, 1], [0.84, 0.1, 1]],
    [[0.05, 0.12, 1], [0.3, 0.18, 2], [0.62, 0.22, 0]],
    [[0.14, 0.2, 0], [0.52, 0.12, 1], [0.73, 0.18, 2]]
  ];
  var FREE_COL = [[0.03, 0.14, 1], [0.2, 0.15, 2], [0.72, 0.19, 0]];
  var SLOT = [0.41, 0.22];

  function calEvent(K, x, y, w, h, col, pe, fl, dim, q) {
    var g = K.g, c = g.ctx, E = K.E;
    var a = Math.min(1, pe * 3) * dim;
    var ww = w * (0.3 + 0.7 * E.outExpo(pe));
    var r = Math.min(1.2 * q, h / 2);
    fillRR(c, x, y, ww, h, r, g.rgba(col, (0.17 + 0.25 * fl) * a));
    var bw = Math.min(0.8 * q, ww);
    g.lit(function (cc, bloom) {
      rr(cc, x, y, bw, h, bw / 2);
      cc.fillStyle = g.rgba(bloom ? col : g.lighten(col, 0.12), (bloom ? 0.5 + 0.9 * fl : 1) * a);
      cc.fill();
      if (bloom && fl > 0.03) {
        rr(cc, x, y, ww, h, r);
        cc.fillStyle = g.rgba(col, 0.4 * fl * a);
        cc.fill();
      }
    });
    if (h > 5.5 * q && ww > 6 * q) {
      pill(c, x + 2 * q, y + 1.6 * q, Math.max(0, Math.min(ww - 3.5 * q, w * 0.6)), 1.2 * q, g.rgba(WHITE, 0.62 * a));
      if (h > 8.5 * q) pill(c, x + 2 * q, y + 3.9 * q, Math.max(0, Math.min(ww - 3.5 * q, w * 0.36)), 1 * q, g.rgba(WHITE, 0.26 * a));
    }
  }

  function uiCalendar(K, R, q, hdr) {
    var g = K.g, c = g.ctx, E = K.E, s = K.s, t = K.t, u = K.u;
    var ncols = R.w / R.h > 1.15 ? 7 : 5, T = Math.floor(ncols / 2);
    var ha = K.uiA, y = R.y;
    if (hdr) {
      pill(c, R.x, y + 0.4 * q, 24 * q, 3.6 * q, g.rgba(WHITE, 0.88 * ha));
      pill(c, R.x, y + 5.4 * q, 15 * q, 1.9 * q, g.rgba(WHITE, 0.3 * ha));
      for (var i = 2; i >= 0; i--) {              // the team: three people's calendars
        var pa = E.outBack(s.in(0.4, K.b0 + 0.06 * (2 - i)), 2);
        avatar(g, R.x + R.w - 3.4 * q - i * 4.8 * q, y + 3.2 * q, 3.3 * q * Math.max(0, pa), K.pal[i], ha);
      }
      y += 10.5 * q;
    }
    var gut = 6 * q, gx0 = R.x + gut, gw = R.x + R.w - gx0, colW = gw / ncols;
    for (var j = 0; j < ncols; j++) {             // day pills; today is lit
      var pw = Math.min(colW * 0.44, 6 * q), px = gx0 + (j + 0.5) * colW - pw / 2;
      if (j === T) litRR(g, px, y + 1.2 * q, pw, 1.8 * q, 0.9 * q, g.rgba(K.c1, 0.95 * ha), g.rgba(K.c1, 0.55 * ha));
      else pill(c, px, y + 1.2 * q, pw, 1.8 * q, g.rgba(WHITE, 0.22 * ha));
    }
    var gy0 = y + 5.4 * q, gh = R.y + R.h - gy0;
    if (gh < 10 * q) return;
    var nrows = g.clamp(Math.round(gh / (8.5 * q)), 4, 11), rowH = gh / nrows, lw = Math.max(1, 0.12 * q);
    for (var rI = 0; rI <= nrows; rI++) {
      hair(c, gx0, gy0 + rI * rowH, gx0 + gw, gy0 + rI * rowH, g.rgba(WHITE, 0.055 * ha), lw);
      if (rI < nrows) pill(c, R.x, gy0 + rI * rowH - 0.55 * q, 3.4 * q, 1.1 * q, g.rgba(WHITE, 0.2 * ha));
    }
    for (j = 1; j < ncols; j++) hair(c, gx0 + j * colW, gy0, gx0 + j * colW, gy0 + gh, g.rgba(WHITE, 0.035 * ha), lw);

    // the scan reads top to bottom; events land as it passes them
    var bS0 = K.b0 + 0.05, bS1 = Math.max(bS0 + 0.5, K.b1 - 0.05);
    var scanP = g.clamp((t - bS0) / (bS1 - bS0)), scanY = gy0 + gh * scanP;
    var dim = 1 - 0.42 * K.hiOn;
    var pad = Math.max(1.5, colW * 0.07), ew = colW - 2 * pad;
    for (j = 0; j < ncols; j++) {
      var evs = j === T ? FREE_COL : PAT[j % PAT.length];
      for (var k = 0; k < evs.length; k++) {
        var ev = evs[k], ta = bS0 + ev[0] * (bS1 - bS0);
        if (t < ta) continue;
        calEvent(K, gx0 + j * colW + pad, gy0 + ev[0] * gh + 0.3 * q, ew, ev[1] * gh - 0.6 * q,
          K.pal[ev[2]], g.clamp((t - ta) / 0.24), Math.exp(-(t - ta) * 6), dim, q);
      }
    }

    // the free slot: searched (marching outline), then found (fills with light, check, shockwave)
    var sx = gx0 + T * colW + pad, sy = gy0 + SLOT[0] * gh + 0.3 * q, sw = ew, sh = SLOT[1] * gh - 0.6 * q;
    var scx = sx + sw / 2, scy = sy + sh / 2, taS = bS0 + SLOT[0] * (bS1 - bS0);
    if (K.hiOn > 0) fillRR(c, gx0 + T * colW, gy0, colW, gh, 0, g.rgba(K.c1, 0.06 * K.hiOn));
    var ca = g.clamp((t - taS) / 0.3) * (1 - K.hiOn);
    if (ca > 0.01) {
      g.lit(function (cc, bloom) {
        if (cc.setLineDash) { cc.setLineDash([1.3 * q, 1.1 * q]); cc.lineDashOffset = -t * 9 * q; }
        rr(cc, sx, sy, sw, sh, 1.2 * q);
        cc.strokeStyle = g.rgba(K.c1, (bloom ? 0.3 : 0.75) * ca);
        cc.lineWidth = (bloom ? 0.7 : 0.28) * q;
        cc.stroke();
      });
    }
    if (t >= K.tH) {
      var pop = E.outBack(s.seg(K.tH, K.tH + 0.42), 2.2);
      layer(g, about(scx, scy, 0.55 + 0.45 * pop), function () {
        g.lit(function (cc, bloom) {
          rr(cc, sx, sy, sw, sh, 1.3 * q);
          if (bloom) {
            cc.fillStyle = g.rgba(K.c1, Math.min(1, 0.5 + 0.9 * K.hi));
            cc.fill();
            return;
          }
          var gr = cc.createLinearGradient(0, sy, 0, sy + sh);
          gr.addColorStop(0, g.rgba(g.lighten(K.c1, 0.1 + 0.7 * K.hi), 0.62 + 0.38 * K.hi));
          gr.addColorStop(1, g.rgba(g.mix(K.c1, K.c2, 0.35), 0.36 + 0.5 * K.hi));
          cc.fillStyle = gr;
          cc.fill();
          cc.strokeStyle = g.rgba(g.lighten(K.c1, 0.55), 0.95);
          cc.lineWidth = 0.28 * q;
          cc.stroke();
        });
        var ic = Math.min(sw, sh * 0.8);
        g.icon('check', scx, scy, ic * 0.62 / u, { color: WHITE, glowColor: K.c1, glow: 0.7 * K.gk, width: ic * 0.085 / u });
      });
      g.shockwave(scx, scy, s.seg(K.tH, K.tH + 0.9), { maxR: Math.max(sw, sh) * 1.3 / u, width: 0.8, color: K.c1 });
    }
    // the scan line and the light it trails
    var sa = s.seg(bS0 - 0.02, bS0 + 0.1) * (1 - s.seg(bS1 - 0.1, bS1 + 0.02));
    if (sa > 0.01) {
      c.save();
      rr(c, gx0, gy0, gw, gh, 0);
      c.clip();
      c.globalCompositeOperation = 'lighter';
      var band = 11 * q, gr2 = c.createLinearGradient(0, scanY - band, 0, scanY);
      gr2.addColorStop(0, g.rgba(K.c1, 0));
      gr2.addColorStop(1, g.rgba(K.c1, 0.11 * sa));
      c.fillStyle = gr2;
      c.fillRect(gx0, scanY - band, gw, band);
      c.restore();
      g.beam(gx0 - 1.5 * q, scanY, gx0 + gw + 1.5 * q, scanY, { color: K.c1, width: 0.3, alpha: 0.9 * sa });
    }
  }

  // List: rows slide in, then get ticked off top to bottom; the last tick is the answer.
  var WF = [0.72, 0.55, 0.8, 0.6, 0.68, 0.5, 0.76, 0.58];
  var WF2 = [0.42, 0.56, 0.32, 0.48, 0.36, 0.52, 0.44, 0.3];

  function uiList(K, R, q, hdr) {
    var g = K.g, c = g.ctx, E = K.E, s = K.s, t = K.t, u = K.u;
    var ha = K.uiA, top = R.y;
    if (hdr) {
      pill(c, R.x, R.y + 0.4 * q, 28 * q, 3.8 * q, g.rgba(WHITE, 0.88 * ha));
      pill(c, R.x, R.y + 5.6 * q, 17 * q, 1.9 * q, g.rgba(WHITE, 0.3 * ha));
      g.icon('search', R.x + R.w - 2.6 * q, R.y + 2.6 * q, 5.2 * q / u, { color: WHITE, alpha: 0.5 * ha, glow: 0 });
      top = R.y + 11 * q;
    }
    var avail = R.y + R.h - top;
    var n = g.clamp(Math.round(avail / (15.5 * q)), 3, 8), rowH = avail / n;
    var ap = 0.06, tk0 = K.b0 + ap * n + 0.25;
    var step = n > 1 ? g.clamp((K.tH - tk0) / (n - 1), 0.1, 0.32) : 0;
    var cr = Math.min(2.9 * q, rowH * 0.22);
    var tagW = Math.min(12 * q, R.w * 0.2), tagH = Math.min(3.8 * q, rowH * 0.3);
    for (var i = 0; i < n; i++) {
      var e = s.in(0.42, K.b0 + ap * i);
      if (e <= 0) continue;
      var a = g.clamp(e * 2.2), dy = (1 - E.outExpo(e)) * 3.5 * q;
      var ry = top + i * rowH + dy, cy = ry + rowH / 2;
      var col = K.pal[i % 3], hero = i === n - 1;
      var tk = Math.max(K.tH - (n - 1 - i) * step, K.b0 + ap * i + 0.3), tp = t - tk;
      var done = tp >= 0, fl = done ? Math.exp(-tp * 6.5) : 0, dn = done ? E.outCubic(g.clamp(tp / 0.18)) : 0;
      if (fl > 0.01) {
        litRR(g, R.x - 1.4 * q, ry + 0.9 * q, R.w + 2.8 * q, rowH - 1.8 * q, 2 * q,
          g.rgba(col, 0.13 * fl * a * (hero ? 1.5 : 1)), g.rgba(col, 0.45 * fl * a * (hero ? 1.6 : 1)));
      }
      var bx = R.x + cr + 0.3 * q;
      g.lit(function (cc, bloom) {
        cc.beginPath();
        cc.arc(bx, cy, cr, 0, Math.PI * 2);
        if (dn > 0) {
          cc.fillStyle = g.rgba(col, (bloom ? 0.55 + 0.8 * fl : 0.92) * dn * a);
          cc.fill();
        }
        if (bloom && !dn) return;
        cc.strokeStyle = bloom ? g.rgba(col, 0.6 * dn * a) : g.rgba(dn ? g.lighten(col, 0.3) : WHITE, (dn ? 0.95 : 0.34) * a);
        cc.lineWidth = (bloom ? 0.8 : 0.3) * q;
        cc.stroke();
      });
      if (dn > 0) {
        g.icon('check', bx, cy, cr * 1.35 / u, { color: WHITE, alpha: dn * a, glow: 0.25 * K.gk, glowColor: col, width: cr * 0.24 / u });
        if (hero) g.shockwave(bx, cy, s.seg(tk, tk + 0.85), { maxR: cr * 4.2 / u, width: 0.7, color: col });
      }
      var tx0 = bx + cr + 3.2 * q, textMax = R.x + R.w - tagW - 3 * q - tx0;
      pill(c, tx0, cy - 2.4 * q, textMax * WF[i % WF.length], 2.2 * q, g.rgba(WHITE, (0.88 - 0.24 * dn) * a));
      pill(c, tx0, cy + 1.1 * q, textMax * WF2[i % WF2.length], 1.5 * q, g.rgba(WHITE, 0.24 * a));
      var tgx = R.x + R.w - tagW, tgy = cy - tagH / 2;
      fillRR(c, tgx, tgy, tagW, tagH, tagH / 2, g.rgba(col, 0.17 * a));
      litRR(g, tgx + tagW * 0.22, cy - tagH * 0.15, tagW * 0.56, tagH * 0.3, tagH * 0.15, g.rgba(g.lighten(col, 0.2), 0.9 * a), g.rgba(col, 0.3 * a));
      if (i < n - 1) hair(c, tx0, ry + rowH, R.x + R.w, ry + rowH, g.rgba(WHITE, 0.06 * a), Math.max(1, 0.1 * q));
    }
  }

  // Chart: bars grow in, a trend line draws over them, the top bar lights with a tooltip.
  var VALS = [0.3, 0.46, 0.38, 0.58, 0.5, 0.72, 0.64, 0.95];

  function uiChart(K, R, q, hdr) {
    var g = K.g, c = g.ctx, E = K.E, s = K.s, t = K.t, u = K.u;
    var ha = K.uiA, top = R.y;
    if (hdr) {
      pill(c, R.x, R.y + 0.4 * q, 20 * q, 2.4 * q, g.rgba(WHITE, 0.45 * ha));
      top = R.y + 4.4 * q;
    }
    // KPI: a big value bar and a trend pill with an up-right arrow
    var kg = c.createLinearGradient(R.x, 0, R.x + 30 * q, 0);
    kg.addColorStop(0, g.rgba(WHITE, 0.86 * ha));
    kg.addColorStop(1, g.rgba(WHITE, 0.5 * ha));
    fillRR(c, R.x, top + 0.5 * q, 30 * q, 5.4 * q, 2.7 * q, kg);
    var tpx = R.x + 33 * q, tpy = top + 0.7 * q, tpw = 12.5 * q, tph = 5 * q;
    fillRR(c, tpx, tpy, tpw, tph, tph / 2, g.rgba(K.c1, 0.16 * ha));
    layer(g, function (cc) { cc.translate(tpx + tph * 0.55, tpy + tph / 2); cc.rotate(-Math.PI / 4); cc.translate(-(tpx + tph * 0.55), -(tpy + tph / 2)); }, function () {
      g.icon('arrow', tpx + tph * 0.55, tpy + tph / 2, tph * 0.62 / u, { color: g.lighten(K.c1, 0.3), glowColor: K.c1, glow: 0.5 * K.gk, alpha: ha });
    });
    litRR(g, tpx + tph * 1.05, tpy + tph * 0.38, tpw - tph * 1.45, tph * 0.24, tph * 0.12, g.rgba(g.lighten(K.c1, 0.3), 0.95 * ha), g.rgba(K.c1, 0.35 * ha));

    var py0 = top + 14 * q, py1 = R.y + R.h - 3.6 * q, ph = py1 - py0;
    if (ph < 8 * q) return;
    var lw = Math.max(1, 0.12 * q);
    for (var k = 0; k < 4; k++) hair(c, R.x, py0 + k * ph / 4, R.x + R.w, py0 + k * ph / 4, g.rgba(WHITE, 0.05 * ha), lw);
    hair(c, R.x, py1, R.x + R.w, py1, g.rgba(WHITE, 0.14 * ha), lw);
    var nb = R.w / R.h > 1.15 ? 8 : 6, slot = R.w / nb, bw = slot * 0.54;
    var v = VALS.slice(VALS.length - nb);
    var stg = g.clamp((K.tH - 0.6 - K.b0) / nb, 0.04, 0.12);
    var pts = [];
    for (var i = 0; i < nb; i++) {
      var hero = i === nb - 1;
      var gp = E.outExpo(s.in(0.75, K.b0 + 0.1 + i * stg));
      var bh = v[i] * ph * 0.86 * gp, bx = R.x + (i + 0.5) * slot - bw / 2, by = py1 - bh;
      pts.push([bx + bw / 2, by]);
      pill(c, bx + bw * 0.2, py1 + 1.3 * q, bw * 0.6, 1.1 * q, g.rgba(WHITE, 0.2 * ha));
      if (bh < 0.5) continue;
      var col = hero ? K.c1 : g.mix(K.c2, K.c1, 0.3 + 0.5 * i / (nb - 1));
      var fl = hero ? K.hi : 0, on = hero ? K.hiOn : 0;
      var br = Math.min(bw / 2, 1.3 * q);
      g.lit(function (cc, bloom) {
        rr(cc, bx, by, bw, bh, [br, br, 0, 0]);
        if (bloom) {
          cc.fillStyle = g.rgba(col, g.clamp(0.14 + 0.3 * on + 0.8 * fl));
          cc.fill();
          rr(cc, bx, by, bw, Math.min(bh, 1.2 * q), [br, br, 0, 0]);
          cc.fillStyle = g.rgba(col, 0.9);
          cc.fill();
          return;
        }
        var gr = cc.createLinearGradient(0, by, 0, py1);
        gr.addColorStop(0, g.rgba(g.lighten(col, 0.1 + 0.6 * fl), 0.82 + 0.18 * on));
        gr.addColorStop(1, g.rgba(col, 0.08 + 0.1 * on));
        cc.fillStyle = gr;
        cc.fill();
        rr(cc, bx, by, bw, Math.min(bh, 0.9 * q), [br, br, 0, 0]);
        cc.fillStyle = g.rgba(g.lighten(col, 0.5), 0.95);
        cc.fill();
      });
    }
    // trend line over the bars (a secondary element: skipped when density is low)
    if (K.dens >= 0.3) {
      var lp = E.inOutCubic(s.seg(K.b0 + 0.45, K.tH)) * (nb - 1);
      if (lp > 0.01) {
        var lift = 3.4 * q, lc = g.lighten(K.c2, 0.3), n1 = Math.floor(lp), f = lp - n1;
        var ex = n1 < nb - 1 ? g.lerp(pts[n1][0], pts[n1 + 1][0], f) : pts[nb - 1][0];
        var ey = (n1 < nb - 1 ? g.lerp(pts[n1][1], pts[n1 + 1][1], f) : pts[nb - 1][1]) - lift;
        g.lit(function (cc, bloom) {
          cc.beginPath();
          cc.moveTo(pts[0][0], pts[0][1] - lift);
          for (var j = 1; j <= n1 && j < nb; j++) cc.lineTo(pts[j][0], pts[j][1] - lift);
          cc.lineTo(ex, ey);
          cc.lineJoin = 'round';
          cc.lineCap = 'round';
          cc.strokeStyle = g.rgba(bloom ? K.c2 : lc, bloom ? 0.7 : 0.95);
          cc.lineWidth = (bloom ? 1.3 : 0.45) * q;
          cc.stroke();
        });
        for (var j = 0; j <= Math.min(n1, nb - 1); j++) {
          if (j === nb - 1) continue;
          litDot(g, pts[j][0], pts[j][1] - lift, 0.85 * q, lc, g.rgba(K.c2, 0.5));
        }
        litDot(g, ex, ey, 1.25 * q, WHITE, g.rgba(lc, 0.9));
        if (t >= K.tH) g.ring(ex, ey, (1.3 * q + 5 * q * E.outCubic(s.seg(K.tH, K.tH + 0.8))) / u,
          { width: 0.25, color: lc, alpha: 1 - s.seg(K.tH, K.tH + 0.8), glow: 0.8 });
      }
    }
    // tooltip over the top bar
    if (t >= K.tH) {
      var tw = Math.min(15 * q, R.w * 0.36), tht = 6.2 * q;
      var hb = pts[nb - 1], tcx = Math.min(hb[0], R.x + R.w - tw / 2);
      var tty = Math.max(R.y, hb[1] - 3.4 * q - tht - 5.2 * q);
      var tpop = E.outBack(s.seg(K.tH + 0.05, K.tH + 0.45), 1.8);
      if (tpop > 0) {
        layer(g, about(tcx, tty + tht, 0.6 + 0.4 * tpop), function () {
          g.lit(function (cc, bloom) {
            rr(cc, tcx - tw / 2, tty, tw, tht, 1.5 * q);
            if (bloom) {
              cc.fillStyle = '#000';
              cc.fill();
              cc.strokeStyle = g.rgba(K.c1, 0.6 + 0.4 * K.hi);
              cc.lineWidth = 0.9 * q;
              cc.stroke();
              return;
            }
            cc.fillStyle = '#0C0D12';
            cc.fill();
            cc.strokeStyle = g.rgba(g.lighten(K.c1, 0.35), 0.95);
            cc.lineWidth = 0.25 * q;
            cc.stroke();
          });
          pill(c, tcx - tw * 0.36, tty + 1.5 * q, tw * 0.5, 1.7 * q, g.rgba(WHITE, 0.9));
          litRR(g, tcx - tw * 0.36, tty + 3.9 * q, tw * 0.32, 1.1 * q, 0.55 * q, g.rgba(g.lighten(K.c1, 0.3), 0.95), g.rgba(K.c1, 0.4));
        });
      }
    }
  }

  // Chat: a thread builds from the bottom up; the reply is typed (three dots), then glows.
  // An existing thread (as many as fit, oldest dropped) and the last three, which arrive.
  var MSGS = [
    { me: false, l: [0.6, 0.34] },
    { me: true, l: [0.5] },
    { me: false, l: [0.76, 0.5] },
    { me: true, l: [0.64, 0.42] },
    { me: false, l: [0.44] },
    { me: true, l: [0.46] },
    { me: false, l: [0.7, 0.44] },
    { me: true, l: [0.58, 0.3] },
    { me: false, l: [0.52] },
    { me: false, l: [0.8, 0.62] },
    { me: true, l: [0.4] },
    { me: false, l: [0.66, 0.84, 0.38] },
    { me: true, l: [0.62, 0.36] },
    { me: false, l: [0.8, 0.9, 0.5] }
  ];
  var ARRIVE = 3;

  function bubble(K, b, x, y, w, h, pop, a, heroK, morph, q) {
    var g = K.g, c = g.ctx, E = K.E;
    var P = K.bub, r = Math.min(P.pad * 1.15, h / 2), tail = 0.25 * P.pad;
    var radii = b.me ? [r, r, tail, r] : [r, r, r, tail];
    var ax = b.me ? x + w : x, ay = y + h;
    layer(g, about(ax, ay, 0.5 + 0.5 * E.outBack(pop, 1.7)), function () {
      g.lit(function (cc, bloom) {
        rr(cc, x, y, w, h, radii);
        if (b.me) {
          if (bloom) { cc.fillStyle = g.rgba(K.c1, 0.3 * a); cc.fill(); return; }
          var gr = cc.createLinearGradient(x, y, x + w, y + h);
          gr.addColorStop(0, g.rgba(g.lighten(K.c1, 0.08), 0.95 * a));
          gr.addColorStop(1, g.rgba(g.mix(K.c1, K.c2, 0.45), 0.9 * a));
          cc.fillStyle = gr;
          cc.fill();
          return;
        }
        if (bloom) {
          if (heroK > 0) {
            cc.fillStyle = g.rgba(K.c1, 0.3 * K.hi * a);
            cc.fill();
            cc.strokeStyle = g.rgba(K.c1, (0.55 + 0.45 * K.hi) * heroK * a);
            cc.lineWidth = 0.9 * q;
            cc.stroke();
          }
          return;
        }
        var gi = cc.createLinearGradient(0, y, 0, y + h);
        gi.addColorStop(0, g.rgba('#191B24', a));
        gi.addColorStop(1, g.rgba('#0F1016', a));
        cc.fillStyle = gi;
        cc.fill();
        cc.strokeStyle = heroK > 0 ? g.rgba(g.lighten(K.c1, 0.35), (0.12 + 0.83 * heroK) * a) : g.rgba(WHITE, 0.08 * a);
        cc.lineWidth = (heroK > 0 ? 0.25 : 0.12) * q;
        cc.stroke();
      });
      if (b.typing) {
        for (var i = 0; i < 3; i++) {
          var da = 0.3 + 0.7 * Math.max(0, Math.sin(K.t * 7.5 - i * 0.9));
          c.beginPath();
          c.arc(x + P.pad + P.lh * (0.5 + 1.4 * i), y + h / 2 - 0.15 * P.lh * da, P.lh * 0.5, 0, Math.PI * 2);
          c.fillStyle = g.rgba(WHITE, da * 0.8 * a);
          c.fill();
        }
        return;
      }
      var pad = K.bub.pad, lh = K.bub.lh, lg = K.bub.lg, ba = a * g.clamp(morph * 2 - 0.6);
      for (var li = 0; li < b.l.length; li++) {
        var bwid = b.l[li] * (w - 2 * pad);
        pill(c, x + pad, y + pad + li * (lh + lg), bwid, lh,
          g.rgba(WHITE, (b.me ? 0.88 : li === 0 ? (heroK > 0 ? 0.9 : 0.66) : (heroK > 0 ? 0.62 : 0.4)) * ba));
      }
    });
  }

  function uiChat(K, R, q, hdr) {
    var g = K.g, c = g.ctx, E = K.E, s = K.s, t = K.t, u = K.u;
    var ha = K.uiA, top = R.y, bottom = R.y + R.h;
    if (hdr) {
      var ar = 3.3 * q, acx = R.x + ar, acy = R.y + ar;
      g.lit(function (cc, bloom) {
        cc.beginPath();
        cc.arc(acx, acy, ar, 0, Math.PI * 2);
        if (bloom) { cc.fillStyle = g.rgba(K.c1, 0.35 * ha); cc.fill(); return; }
        var gr = cc.createLinearGradient(acx - ar, acy - ar, acx + ar, acy + ar);
        gr.addColorStop(0, g.rgba(g.lighten(K.c1, 0.2), ha));
        gr.addColorStop(1, g.rgba(K.c2, ha));
        cc.fillStyle = gr;
        cc.fill();
      });
      g.icon('sparkle', acx, acy, ar * 1.15 / u, { color: WHITE, alpha: 0.95 * ha, glow: 0 });
      pill(c, acx + ar + 2.4 * q, R.y + 1.1 * q, 19 * q, 2.4 * q, g.rgba(WHITE, 0.88 * ha));
      litDot(g, acx + ar + 3 * q, R.y + 5.5 * q, 0.65 * q, g.rgba(g.lighten(K.c1, 0.3), ha), g.rgba(K.c1, 0.6 * ha));
      pill(c, acx + ar + 4.4 * q, R.y + 4.85 * q, 11 * q, 1.3 * q, g.rgba(WHITE, 0.3 * ha));
      hair(c, R.x, R.y + 9.2 * q, R.x + R.w, R.y + 9.2 * q, g.rgba(WHITE, 0.07 * ha), Math.max(1, 0.1 * q));
      top = R.y + 11 * q;
    }
    // input bar with a lit send button
    var ib = 7 * q, iy = bottom - ib;
    c.save();
    rr(c, R.x, iy, R.w, ib, ib / 2);
    c.fillStyle = g.rgba('#0B0C11', ha);
    c.fill();
    c.strokeStyle = g.rgba(WHITE, 0.09 * ha);
    c.lineWidth = Math.max(1, 0.12 * q);
    c.stroke();
    c.restore();
    pill(c, R.x + 3 * q, iy + ib / 2 - 0.7 * q, R.w * 0.34, 1.4 * q, g.rgba(WHITE, 0.18 * ha));
    var sbx = R.x + R.w - ib / 2, sby = iy + ib / 2;
    litDot(g, sbx, sby, ib * 0.36, g.rgba(K.c1, 0.95 * ha), g.rgba(K.c1, 0.45 * ha));
    g.icon('arrow', sbx, sby, ib * 0.42 / u, { color: WHITE, alpha: ha, glow: 0, width: ib * 0.06 / u });

    // bubbles, bottom-anchored: arrivals push the thread up and out of the top
    var mTop = top, mBot = iy - 2.6 * q;
    var wide = R.w / R.h > 1;
    var maxBW = R.w * (wide ? 0.62 : 0.8);
    var bq = wide ? q : q * 1.45;                   // phone-sized bubbles read bigger
    var pad = 2.8 * bq, lh = 1.7 * bq, lg = 1.5 * bq, gap = 2.4 * bq;
    K.bub = { pad: pad, lh: lh, lg: lg };
    function dims(m) {
      var n = m.l.length;
      return { w: 2 * pad + Math.max.apply(null, m.l) * (maxBW - 2 * pad), h: 2 * pad + n * lh + (n - 1) * lg };
    }
    var all = MSGS.map(function (m) { var d = dims(m); return { me: m.me, l: m.l, w: d.w, h: d.h }; });
    var N = all.length, A = Math.min(ARRIVE, N);
    var tEnd = K.tH, t0 = K.b0 + 0.05;
    var stp = A > 1 ? g.clamp((tEnd - 0.6 - t0) / Math.max(1, A - 1), 0.15, 0.6) : 0;
    var typing = { me: false, l: [], typing: true, w: 2 * pad + 6.6 * bq, h: 2 * pad + lh + 0.6 * bq };
    var hero = all[N - 1];
    var pT = E.outExpo(g.clamp((t - (tEnd - 0.5)) / 0.25));
    var pm = E.outExpo(g.clamp((t - tEnd) / 0.4));
    var heroCur = { me: false, l: hero.l, typing: t < tEnd, w: g.lerp(typing.w, hero.w, pm), h: g.lerp(typing.h, hero.h, pm) };
    var slots = [], k;
    for (k = 0; k < N - 1; k++) {
      var ai = k - (N - A);                          // >= 0 for the ones that arrive during the beat
      var e = ai < 0 ? 1 : g.clamp((t - (t0 + ai * stp)) / 0.3);
      slots.push({ b: all[k], e: e, a: ai < 0 ? ha : 1, slot: E.outExpo(e) * (all[k].h + gap) });
    }
    slots.push({ b: heroCur, e: g.clamp((t - (tEnd - 0.5)) / 0.25), a: 1, slot: pT * (heroCur.h + gap), hero: true });

    layer(g, clipTo(R.x - 2 * q, mTop, R.w + 4 * q, mBot - mTop + 1.5 * q, 0), function () {
      var yb = mBot;
      for (var j = slots.length - 1; j >= 0 && yb > mTop; j--) {
        var sl = slots[j];
        if (sl.e > 0) {
          var bb = sl.b, by = yb - bb.h;
          var bxp = bb.me ? R.x + R.w - bb.w : R.x;
          var fade = g.clamp((by - mTop) / (7 * q));
          if (fade > 0) {
            bubble(K, bb, bxp, by, bb.w, bb.h, sl.e, g.clamp(sl.e * 2.5) * fade * sl.a,
              sl.hero ? E.outCubic(pm) : 0, sl.hero ? pm : 1, q);
          }
        }
        yb -= sl.slot;
      }
    });
  }

  // Code: tokens type themselves behind a caret; at the answer a "passed" toast pops in.
  var CODE = [
    [0, [['c', 18]]],
    [0, [['k', 6], ['i', 6], ['p', 1], ['s', 12], ['p', 1]]],
    [0, []],
    [0, [['k', 5], ['f', 9], ['p', 2], ['i', 4], ['p', 3]]],
    [1, [['k', 5], ['i', 5], ['p', 2], ['f', 7], ['p', 1], ['i', 4], ['p', 2]]],
    [1, [['k', 3], ['p', 1], ['k', 5], ['i', 4], ['k', 2], ['i', 5], ['p', 3]]],
    [2, [['k', 2], ['p', 1], ['f', 6], ['p', 1], ['i', 4], ['p', 3]]],
    [3, [['k', 5], ['i', 4], ['p', 1]]],
    [2, [['p', 1]]],
    [2, [['i', 4], ['p', 1], ['f', 4], ['p', 1], ['s', 9], ['p', 2]]],
    [1, [['p', 1]]],
    [1, [['c', 16]]],
    [1, [['k', 6], ['f', 5], ['p', 1], ['i', 5], ['p', 2]]],
    [0, [['p', 1]]],
    [0, []],
    [0, [['k', 6], ['k', 7], ['f', 9], ['p', 1]]],
    [0, []],
    [0, [['f', 9], ['p', 1], ['i', 5], ['p', 2]]],
    [1, [['p', 1], ['i', 3], ['p', 1], ['s', 7], ['p', 1]]],
    [0, [['p', 2]]]
  ];

  function uiCode(K, R, q, hdr) {
    var g = K.g, c = g.ctx, E = K.E, s = K.s, t = K.t, u = K.u;
    var ha = K.uiA, top = R.y;
    if (hdr) {
      fillRR(c, R.x, R.y, 17 * q, 4.4 * q, 1.2 * q, g.rgba(WHITE, 0.06 * ha));
      litDot(g, R.x + 2.2 * q, R.y + 2.2 * q, 0.6 * q, g.rgba(K.c1, ha), g.rgba(K.c1, 0.5 * ha));
      pill(c, R.x + 3.8 * q, R.y + 1.6 * q, 10.5 * q, 1.2 * q, g.rgba(WHITE, 0.72 * ha));
      pill(c, R.x + 20 * q, R.y + 1.6 * q, 9 * q, 1.2 * q, g.rgba(WHITE, 0.24 * ha));
      hair(c, R.x, R.y + 5.6 * q, R.x + R.w, R.y + 5.6 * q, g.rgba(WHITE, 0.07 * ha), Math.max(1, 0.1 * q));
      top = R.y + 7.4 * q;
    }
    var toastH = 8.4 * q, la = R.y + R.h - top - toastH - 3 * q;
    var lh = g.clamp(la / CODE.length, 3.4 * q, 7 * q);
    var nL = Math.max(1, Math.min(CODE.length, Math.floor(la / lh)));
    var gut = 6.5 * q, maxC = 0, total = 0, li, k;
    for (li = 0; li < nL; li++) {
      var cc0 = CODE[li][0] * 2;
      for (k = 0; k < CODE[li][1].length; k++) cc0 += CODE[li][1][k][1] + 1;
      maxC = Math.max(maxC, cc0);
    }
    var cw = Math.min(lh * 0.72, (R.w - gut - 1 * q) / Math.max(1, maxC));
    var bh = Math.min(lh * 0.34, 2.1 * q);
    for (li = 0; li < nL; li++) for (k = 0; k < CODE[li][1].length; k++) total += CODE[li][1][k][1];
    var tType1 = Math.max(K.b0 + 0.4, K.tH - 0.2);
    var typed = total * g.clamp((t - K.b0) / (tType1 - K.b0));
    var COL = {
      k: [K.c1, 0.95, 0.35], f: [g.lighten(K.c2, 0.25), 0.9, 0.25], s: [K.c2, 0.85, 0.25],
      i: [WHITE, 0.74, 0], p: [WHITE, 0.34, 0], c: [WHITE, 0.2, 0]
    };
    var count = 0, caretX = R.x + gut, caretY = top + lh / 2, caretLine = 0;
    for (li = 0; li < nL; li++) {
      var ly = top + li * lh, lcy = ly + lh / 2;
      var lineStart = count;
      if (typed >= lineStart || li === 0) {
        g.text(String(li + 1), R.x + gut - 2.2 * q, lcy, {
          size: Math.min(lh * 0.36, 2.4 * q) / u, font: 'mono', weight: 400, align: 'right', color: WHITE, alpha: 0.28 * ha, tracking: 0
        });
      }
      var x = R.x + gut + CODE[li][0] * 2 * cw;
      if (typed >= lineStart) { caretX = x; caretY = lcy; caretLine = li; }
      for (k = 0; k < CODE[li][1].length; k++) {
        var tok = CODE[li][1][k], len = tok[1], st = COL[tok[0]];
        var vis = g.clamp(typed - count, 0, len);
        if (vis > 0) {
          var w = vis * cw - (vis >= len ? cw * 0.35 : 0);
          if (st[2] > 0) litRR(g, x, lcy - bh / 2, w, bh, bh / 2, g.rgba(st[0], st[1]), g.rgba(st[0], st[2]));
          else pill(c, x, lcy - bh / 2, w, bh, g.rgba(st[0], st[1]));
          if (typed < count + len + 0.001 && typed > count) { caretX = x + vis * cw; caretY = lcy; caretLine = li; }
          else if (vis >= len) { caretX = x + (len + 1) * cw; caretY = lcy; caretLine = li; }
        }
        count += len;
        x += (len + 1) * cw;
      }
    }
    // current-line band and caret (blinks once typing is done)
    var done = t >= tType1;
    fillRR(c, R.x - 0.6 * q, top + caretLine * lh + lh * 0.1, R.w + 1.2 * q, lh * 0.8, 0.8 * q, g.rgba(K.c1, 0.07 * ha * (1 - 0.6 * K.hiOn)));
    var blinkOn = !done || Math.floor((t - tType1) * 2.4) % 2 === 0;
    if (blinkOn && t >= K.b0 - 0.1) {
      litRR(g, caretX - 0.15 * q, caretY - lh * 0.3, 0.42 * q, lh * 0.6, 0.2 * q, g.rgba(g.lighten(K.c1, 0.4), ha), g.rgba(K.c1, 0.8 * ha));
    }
    // "passed": a sweep over the code, and a toast with a check
    if (t >= K.tH) {
      g.sweep(s.seg(K.tH, K.tH + 0.9), { x: R.x, y: top, w: R.w, h: nL * lh, color: K.c1, angle: 20, width: 14, alpha: 0.42 });
      var tw = Math.min(R.w * 0.72, 40 * q), tx = R.x + R.w - tw, ty = R.y + R.h - toastH;
      var tpop = E.outBack(s.seg(K.tH, K.tH + 0.45), 1.8);
      layer(g, about(tx + tw / 2, ty + toastH, 0.6 + 0.4 * tpop, 0, (1 - E.outExpo(s.seg(K.tH, K.tH + 0.5))) * 2 * q), function () {
        g.lit(function (cc, bloom) {
          rr(cc, tx, ty, tw, toastH, toastH / 2);
          if (bloom) {
            cc.fillStyle = '#000';
            cc.fill();
            cc.strokeStyle = g.rgba(K.c1, 0.55 + 0.45 * K.hi);
            cc.lineWidth = 0.9 * q;
            cc.stroke();
            return;
          }
          cc.fillStyle = '#0C0D12';
          cc.fill();
          cc.strokeStyle = g.rgba(g.lighten(K.c1, 0.35), 0.9);
          cc.lineWidth = 0.25 * q;
          cc.stroke();
        });
        var ccx = tx + toastH / 2, ccy = ty + toastH / 2;
        litDot(g, ccx, ccy, toastH * 0.3, g.rgba(g.lighten(K.c1, 0.6 * K.hi), 0.95), g.rgba(K.c1, 0.6 + 0.4 * K.hi));
        g.icon('check', ccx, ccy, toastH * 0.36 / u, { color: WHITE, glow: 0, width: toastH * 0.055 / u });
        pill(c, tx + toastH * 1.05, ty + toastH * 0.3, tw * 0.44, toastH * 0.17, g.rgba(WHITE, 0.88));
        pill(c, tx + toastH * 1.05, ty + toastH * 0.58, tw * 0.26, toastH * 0.12, g.rgba(WHITE, 0.3));
      });
    }
  }

  var UI_FN = { calendar: uiCalendar, list: uiList, chart: uiChart, chat: uiChat, code: uiCode };

  // ───────────────────────────────────────────────────────────── the shot

  NGM.shot('device', {
    draw: function (g, s) {
      var u = g.u, E = g.ease, b = s.beat, t = s.t, D = s.dur, asp = g.aspect;
      var gk = 0.6 + 0.8 * s.energy;
      var kindP = String(b.kind || 'auto').toLowerCase(), uiP = String(b.ui || 'list').toLowerCase();
      var kind = KINDS[kindP] ? kindP : (asp === 'portrait' ? 'phone' : asp === 'landscape' ? 'window' : 'card');
      var ui = UIS[uiP] ? uiP : 'list';
      var caption = clean(b.text);
      var rtl = RTL.test(caption);
      var box = fitBox(g, s);
      var side = !!caption && asp === 'landscape';
      if (side) {
        // beside the device only while the caption stays big; a long one goes under it instead
        var probe = g.measure(caption, { size: 9.6, weight: 800, tracking: -0.02, maxWidth: box.w * (kind === 'window' ? 0.4 : 0.46), wrap: true });
        if (probe.size < 7 * u) side = false;
      }

      // ── timing: the device lands, the UI builds, the answer lights at tH, then a long hold
      var tH = g.clamp(Math.min(D * 0.5, 2.6), Math.min(1.5, D - 0.9), D - 0.9);
      var b0 = Math.min(0.38, tH * 0.3);
      var hi = t >= tH ? Math.exp(-(t - tH) * 4.2) : 0;
      var hiOn = E.outCubic(s.seg(tH, tH + 0.35));
      var enter = E.outExpo(s.in(0.8));
      var exitK = 0.85 + 0.15 * s.out(0.25);
      var shine = -1, s1 = s.seg(0.08, 0.95);
      if (s1 > 0 && s1 < 1) shine = E.inOutQuad(s1);
      var h0 = Math.max(tH + 0.7, D * 0.64), s2 = s.seg(h0, h0 + 1);
      if (h0 + 1 < D - 0.05 && s2 > 0 && s2 < 1) shine = E.inOutQuad(s2);

      // ── layout
      var AR = kind === 'phone' ? 0.485
        : kind === 'window' ? (side ? 1.4 : asp === 'portrait' ? 1.0 : 1.55)
        : (side ? 1.12 : asp === 'portrait' ? 0.86 : 1.3);
      var capO = null, capM = null, dev, capX = g.cx, capY = 0, dh, dw;
      if (side) {
        var gap = 7 * u;
        var colMax = box.w * (kind === 'window' ? 0.4 : 0.46);
        capO = { size: 9.6, weight: 800, tracking: -0.02, lineHeight: rtl ? 1.3 : 1.04, maxWidth: colMax, wrap: true, align: rtl ? 'right' : 'left' };
        capM = g.measure(caption, capO);
        dh = Math.min(box.h * (kind === 'phone' ? 0.98 : 0.9), (box.w - gap - capM.w) / AR);
        if (kind !== 'phone') dh = Math.min(dh, box.w * 0.58 / AR);
        dw = dh * AR;
        var left = g.cx - (dw + gap + capM.w) / 2;
        dev = { x: rtl ? left + capM.w + gap : left, y: g.cy - dh / 2, w: dw, h: dh };
        capX = rtl ? left + capM.w : left + dw + gap;
        capY = g.cy;
      } else {
        var capVis = 0, capGap = 0;
        if (caption) {
          capO = { size: asp === 'portrait' ? 9.6 : asp === 'square' ? 8 : 8.4, weight: 800, tracking: -0.02, lineHeight: rtl ? 1.3 : 1.04, maxWidth: box.w, wrap: true };
          capM = g.measure(caption, capO);
          capVis = capM.h + capM.descent * (rtl ? 0.9 : 0.35);
          capGap = (asp === 'portrait' ? 7 : 5) * u;
        }
        var maxW = box.w * (kind === 'card' ? 0.86 : kind === 'window' ? 0.98 : 1);
        var capDev = kind === 'phone' && asp === 'portrait' ? 102 * u : Infinity;
        dh = Math.min(box.h - capVis - capGap, maxW / AR, capDev);
        dw = dh * AR;
        var top = g.cy - (dh + capGap + capVis) / 2;
        dev = { x: g.cx - dw / 2, y: top, w: dw, h: dh };
        capY = top + dh + capGap + (capM ? capM.h / 2 : 0);
      }

      var K = {
        g: g, s: s, E: E, t: t, D: D, u: u, gk: gk, dens: s.density,
        c1: s.color, c2: s.color2,
        pal: [s.color, g.mix(s.color, s.color2, 0.55), g.lighten(g.mix(s.color, s.color2, 0.25), 0.3)],
        b0: b0, b1: tH - 0.12, tH: tH, hi: hi, hiOn: hiOn, shine: shine,
        rim: (0.2 + 0.72 * E.outCubic(s.in(0.6, 0.04))) * (0.9 + 0.1 * exitK),
        bodyA: g.clamp(s.in(0.16)), chromeA: E.outCubic(s.in(0.5, 0.12)),
        uiA: E.outCubic(s.in(0.45, Math.max(0, b0 - 0.1)))
      };

      // ── light behind the device, dust
      var dcx = dev.x + dev.w / 2, dcy = dev.y + dev.h / 2;
      g.backlight(dcx, dcy, Math.max(dev.w, dev.h) / u * 0.62, {
        color: s.color, alpha: (0.07 + 0.13 * enter + 0.16 * hi + 0.05 * hiOn) * gk * exitK
      });
      var nd = Math.round(44 * s.density);
      if (nd > 0) {
        g.particles(41 + s.index * 7, nd, {
          color: s.color2, size: 0.2, alpha: 0.45 * g.clamp(s.in(0.6, 0.2)),
          area: { x: g.safe.x, y: Math.max(0, dev.y - 10 * u), w: g.safe.w, h: Math.min(g.H, dev.h + 20 * u) }
        });
      }

      // ── the device: rises in as its rim ignites, then floats
      var bob = g.noise(t * 0.4, 5 + s.index) * 0.45 * u * enter;
      var devXf = about(dcx, dcy, 0.9 + 0.1 * enter, 0, (1 - enter) * 9 * u + bob);
      layer(g, function (c) { devXf(c); c.globalAlpha = K.bodyA; }, function () {
        var body = kind === 'phone' ? phoneBody(K, dev, ui) : kind === 'window' ? windowBody(K, dev) : cardBody(K, dev, ui);
        var R = body.R;
        if (R.w > 4 && R.h > 4) {
          var q = Math.min(R.w, R.h * 1.35) / 100;
          layer(g, clipTo(body.S.x, body.S.y, body.S.w, body.S.h, body.S.r), function () {
            UI_FN[ui](K, R, q, body.header);
          });
        }
        if (kind !== 'card') glare(K, body.S);
      });

      // ── caption, outside the device
      if (caption) {
        var ce = s.in(0.55, 0.28);
        if (ce > 0) {
          var o = {};
          for (var key in capO) o[key] = capO[key];
          o.alpha = E.outCubic(g.clamp(ce * 1.6));
          o.glow = (0.3 + 0.12 * hiOn) * gk * exitK;
          o.color = WHITE;
          g.text(caption, capX, capY + (1 - E.outExpo(ce)) * 3.5 * u, o);
        }
      }
    }
  });
})();
