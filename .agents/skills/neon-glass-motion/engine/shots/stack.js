/*
 * Neon Glass Motion — shot "stack": two or three short lines, one hard light hit each.
 *
 * Every line lands on its own hit: a blade of light flares behind it, a hot beam snaps out to the
 * full width underneath, the words punch in white-hot at 108% and settle to size while the bloom
 * cools to the line's colour; the frame gives a tiny kick. The beam then contracts to a short
 * underline that marks the current line. When the next line hits, the earlier one dims a little
 * and the light (pool + underline) moves down to the new line. The last line keeps the light
 * through a long hold. Colours walk from the beat colour toward the next one, line by line.
 *
 * Params: lines (required, 2–3 strings, each <= 5 words; a 4th is tolerated).
 * Positions are pixels; sizes handed to g.* helpers are units (g.u = min(W, H) / 100).
 * Output depends only on (g, s).
 */
(function () {
  'use strict';

  var RTL = /[֐-ࣿיִ-﷿ﹰ-﻿]/;
  var WHITE = '#FFFFFF';
  var BASE = { portrait: [13, 12, 11, 9.6], square: [11.5, 10.5, 9.2, 8], landscape: [14, 13, 11.5, 10] };

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

  function merge(a, b) {
    var o = {}, k;
    for (k in a) o[k] = a[k];
    for (k in b) o[k] = b[k];
    return o;
  }

  // A flattened pool of light behind a line (mostly bloom, a faint trace on the picture).
  function blade(g, x, y, rx, ry, color, alpha) {
    if (alpha <= 0.003 || !(rx > 1 && ry > 1)) return;
    var hot = g.lighten(color, 0.45);
    g.lit(function (c, bloom) {
      var a = bloom ? Math.min(1, alpha) : Math.min(1, alpha) * 0.14;
      c.globalCompositeOperation = 'lighter';
      c.translate(x, y);
      c.scale(rx / ry, 1);
      var gr = c.createRadialGradient(0, 0, 0, 0, 0, ry);
      gr.addColorStop(0, g.rgba(hot, a));
      gr.addColorStop(0.3, g.rgba(color, a * 0.62));
      gr.addColorStop(0.68, g.rgba(color, a * 0.16));
      gr.addColorStop(1, g.rgba(color, 0));
      c.fillStyle = gr;
      c.fillRect(-ry, -ry, 2 * ry, 2 * ry);
    });
  }

  NGM.shot('stack', {
    draw: function (g, s) {
      var u = g.u, E = g.ease, b = s.beat, t = s.t, D = s.dur, asp = g.aspect;
      var gk = 0.6 + 0.8 * s.energy;
      var raw = Array.isArray(b.lines) ? b.lines : typeof b.lines === 'string' ? b.lines.split('\n') : [];
      var lines = raw.map(clean).filter(Boolean).slice(0, 4);
      if (!lines.length && clean(b.text)) lines = [clean(b.text)];
      if (!lines.length) return;
      var n = lines.length;
      var rtl = lines.map(function (l) { return RTL.test(l); });
      var anyAr = rtl.some(Boolean);
      var box = fitBox(g, s);
      var KICK = 0.012 * (0.5 + s.energy);
      var maxW = box.w / (1 + KICK);

      // ── layout: one shared size; a line that barely overflows shrinks, a long one wraps to two
      function opts(sz, i, wrap) {
        var o = { size: sz, weight: 800, tracking: rtl[i] ? 0 : -0.025, lineHeight: rtl[i] ? 1.3 : 1.04 };
        if (wrap) { o.maxWidth = maxW; o.wrap = 2; }
        return o;
      }
      var base = (BASE[asp] || BASE.square)[n - 1], size = base;
      lines.forEach(function (l, i) {
        var m = g.measure(l, opts(base, i, false));
        if (m.w > maxW && maxW / m.w >= 0.8) size = Math.min(size, base * maxW / m.w * 0.995);
      });
      var ms, gap, visH, total;
      function layout() {
        ms = lines.map(function (l, i) { return g.measure(l, opts(size, i, true)); });
        var minPx = Math.min.apply(null, ms.map(function (m) { return m.size; }));
        if (minPx < size * u * 0.995) {                 // something still overflowed: use its size for all
          size = minPx / u;
          ms = lines.map(function (l, i) { return g.measure(l, opts(size, i, true)); });
        }
        gap = size * u * (anyAr ? 0.5 : asp === 'portrait' ? 0.5 : 0.42);
        visH = ms.map(function (m, i) { return m.h + m.descent * (rtl[i] ? 0.85 : 0.3); });
        total = visH.reduce(function (a, v) { return a + v; }, 0) + gap * (n - 1);
      }
      layout();
      for (var pass = 0; pass < 2 && total > box.h * 0.94; pass++) {
        size *= box.h * 0.94 / total;
        layout();
      }
      var ys = [], bottoms = [], y = g.cy - total / 2;
      for (var i = 0; i < n; i++) {
        ys.push(y + ms[i].h / 2);
        bottoms.push(y + visH[i]);
        y += visH[i] + gap;
      }
      var cols = lines.map(function (l, i) { return n > 1 ? g.mix(s.color, s.color2, 0.65 * i / (n - 1)) : s.color; });

      // ── timing: one hit per line, then a long hold on the last
      var t0 = 0, hold = Math.min(1.3, D * 0.32);
      var step = n > 1 ? g.clamp((D - hold - t0 - 0.3) / (n - 1), 0.36, 0.95) : 0;
      var hits = lines.map(function (l, i) { return t0 + i * step; });
      var exitK = 0.85 + 0.15 * s.out(0.25);
      var act = -1;
      for (i = 0; i < n; i++) if (t >= hits[i]) act = i;
      if (act < 0) return;

      // the frame kicks a little on every hit
      var kick = 0;
      for (i = 0; i <= act; i++) kick = Math.max(kick, Math.exp(-(t - hits[i]) * 11));
      var ksc = 1 + KICK * kick;
      g.ctx.save(); g.bctx.save();
      try {
        [g.ctx, g.bctx].forEach(function (c) { c.translate(g.cx, g.cy); c.scale(ksc, ksc); c.translate(-g.cx, -g.cy); });

        // ── the pool of light follows the active line down
        var la = t - hits[act], fA = Math.exp(-la * 5.2);
        var mv = act > 0 ? E.outExpo(g.clamp(la / 0.32)) : 1;
        var py = act > 0 ? g.lerp(ys[act - 1], ys[act], mv) : ys[act];
        var pw = act > 0 ? g.lerp(ms[act - 1].w, ms[act].w, mv) : ms[act].w;
        g.backlight(g.cx, py, Math.max(30, pw / u * 0.55), {
          color: cols[act], alpha: (0.07 + 0.22 * fA) * gk * exitK * g.clamp(la / 0.06 + 0.3)
        });
        var dust = Math.round(38 * s.density);
        if (dust > 0) {
          g.particles(23 + s.index * 11, dust, {
            color: g.mix(s.color, s.color2, 0.4), size: 0.2, alpha: 0.45 * g.clamp(s.in(0.5, 0.1)),
            area: { x: g.cx - box.w / 2, y: g.cy - total / 2 - 14 * u, w: box.w, h: total + 28 * u }
          });
        }

        // ── the hits: blade of light behind, a beam snapping out underneath then settling to an underline
        for (i = 0; i <= act; i++) {
          var lp = t - hits[i], fl = Math.exp(-lp * 5.2);
          if (lp < 0.9) {
            var open = E.outExpo(g.clamp(lp / 0.3));
            blade(g, g.cx, ys[i], Math.max(maxW * 0.5 * (0.45 + 0.55 * open), 8 * u), Math.max(ms[i].h * 0.95, 7 * u),
              cols[i], 0.95 * fl * gk);
          }
          var uy = bottoms[i] + gap * (i < n - 1 ? 0.42 : 0.5);
          var full = maxW * 0.5, mark = Math.min(ms[i].w * 0.26, 11 * u);
          var ex = E.outExpo(g.clamp(lp / 0.14)), ct = E.inOutCubic(g.clamp((lp - 0.14) / 0.7));
          var half = g.lerp(full * ex, mark, ct);
          var gone = i < act ? E.outCubic(g.clamp((t - hits[i + 1]) / 0.18)) : 0;
          var ua = (ct < 1 ? 0.55 + 0.45 * fl : 0.55) * (1 - gone) * exitK;
          if (i === act || gone < 1) {
            if (s.density < 0.15) ua *= 1 - ct;           // sparse films: the hit only, no resting underline
            if (half > 0.5 && ua > 0.01) {
              g.beam(g.cx - half, uy, g.cx + half, uy, { color: cols[i], width: 0.28 + 0.45 * fl, alpha: ua });
            }
          }
        }

        // ── the words
        for (i = 0; i <= act; i++) {
          var p = t - hits[i], f = Math.exp(-p * 5.2);
          var settle = E.outExpo(g.clamp(p / 0.42)), sc = 1 + 0.085 * (1 - settle);
          var dimK = i < act ? E.outCubic(g.clamp((t - hits[i + 1]) / 0.3)) : 0;
          var a = g.clamp(0.55 + p / 0.05) * (1 - 0.3 * dimK);
          var o = merge(opts(size, i, true), {
            color: g.mix(WHITE, cols[i], 0.42 * dimK),      // earlier lines cool to a tint of their colour
            alpha: a,
            glow: Math.min(2, (0.42 + 1.25 * f) * gk * (1 - 0.5 * dimK) * exitK),
            glowColor: g.mix(cols[i], WHITE, 0.55 * f)
          });
          g.ctx.save(); g.bctx.save();
          try {
            [g.ctx, g.bctx].forEach(function (c) { c.translate(g.cx, ys[i]); c.scale(sc, sc); c.translate(-g.cx, -ys[i]); });
            g.text(lines[i], g.cx, ys[i], o);
          } finally { g.ctx.restore(); g.bctx.restore(); }
        }
      } finally { g.ctx.restore(); g.bctx.restore(); }
    }
  });
})();
