/*
 * Neon Glass Motion — shot "title": the hero line reveal.
 *
 * A band of light sweeps across the frame BEHIND big centred text. Ahead of the band the letters are
 * dark glass silhouettes; where the band passes they ignite white (a white-hot front with a cooling
 * colour tail), then the light settles into a pool behind the words and the glow swells through the
 * hold. A thin horizon line opens under the title, the optional `sub` rises in, and a slow specular
 * glint crosses the letters mid-hold. Arabic lines sweep right-to-left.
 *
 * Params: text (required, <= 5 words), sub (optional, <= 5 words).
 */
(function () {
  'use strict';

  var DARK_GLASS = '#090A0F';

  // The safe box shrunk by the camera move of this beat, so text stays inside it on the last frame too.
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

  // Size a line so it reads huge: one line when it fits (or needs only a small shrink), otherwise two
  // balanced lines; core shrinks whatever still overflows. Very short lines may grow a little.
  function fitText(g, str, base, maxW, extra, grow) {
    var o = {};
    Object.keys(extra).forEach(function (k) { o[k] = extra[k]; });
    o.size = base;
    var m = g.measure(str, o);
    if (m.lineCount === 1) {
      if (m.w <= maxW) {
        if (grow && m.w > 0 && m.w < maxW * 0.55) o.size = Math.min(base * grow, base * (maxW * 0.55) / m.w);
      } else if (maxW / m.w < 0.86) {
        o.wrap = 2;
      }
    }
    o.maxWidth = maxW;
    return o;
  }

  function merge(a, b) {
    var o = {}, k;
    for (k in a) o[k] = a[k];
    for (k in b) o[k] = b[k];
    return o;
  }

  // Colour stops along a gradient; positions are clamped to 0..1 and kept non-decreasing.
  function stops(gr, list) {
    var last = 0;
    for (var i = 0; i < list.length; i++) {
      var p = Math.min(1, Math.max(last, list[i][0]));
      gr.addColorStop(p, list[i][1]);
      last = p;
    }
    return gr;
  }

  // Elliptical light pool stretched along the band direction (axis angle `ang`): hot core, coloured falloff.
  // Mostly bloom (light behind), with a faint crisp core on the main layer so silhouettes read against it.
  function blade(g, x, y, ang, len, wid, color, alpha) {
    var hot = g.lighten(color, 0.45);
    g.lit(function (c, bloom) {
      var a = bloom ? alpha : alpha * 0.2;
      c.globalCompositeOperation = 'lighter';
      c.translate(x, y);
      c.rotate(ang);
      c.scale(wid / len, 1);
      var gr = c.createRadialGradient(0, 0, 0, 0, 0, len);
      gr.addColorStop(0, g.rgba(hot, a));
      gr.addColorStop(0.25, g.rgba(color, a * 0.75));
      gr.addColorStop(0.6, g.rgba(color, a * 0.22));
      gr.addColorStop(1, g.rgba(color, 0));
      c.fillStyle = gr;
      c.fillRect(-len, -len, 2 * len, 2 * len);
    });
  }

  NGM.shot('title', {
    draw: function (g, s) {
      var E = g.ease, u = g.u, b = s.beat;
      var text = clean(b.text), sub = clean(b.sub);
      if (!text && !sub) return;
      if (!text) { text = sub; sub = ''; }
      var D = s.dur, t = s.t;
      var eK = 0.75 + 0.5 * s.energy;
      var dens = s.density;
      var box = fitBox(g, s);
      var land = g.aspect === 'landscape', sq = g.aspect === 'square';

      // ── layout ──────────────────────────────────────────────────────────────
      var rtl = g.measure(text, { size: 10 }).rtl;
      var base = land ? 14 : sq ? 11.5 : 12.5;
      var tOpt = fitText(g, text, base, box.w,
        { weight: 800, tracking: -0.025, lineHeight: rtl ? 1.32 : 1.04 }, 1.6);
      var tm = g.measure(text, tOpt);
      var sOpt = null, sm = null;
      if (sub) {
        sOpt = fitText(g, sub, land ? 4.4 : sq ? 4.5 : 4.9, box.w * 0.92,
          { weight: 600, tracking: rtl ? 0 : 0.005, lineHeight: 1.22 }, 0);
        sm = g.measure(sub, sOpt);
      }
      // title → horizon line, clearing descenders (Arabic tails such as ي and ر reach far below the baseline)
      var lineGap = rtl ? Math.max(tm.descent * 1.1, tm.size * 0.46) + Math.max(2.2 * u, tm.size * 0.16)
        : tm.descent * 0.35 + Math.max(2.6 * u, tm.size * 0.26);
      var subGap = sub ? Math.max(3.2 * u, sm.size * 0.7) : 0;  // horizon line → sub
      var blockH = tm.h + (sub ? lineGap + subGap + sm.h : 0);
      var top = g.cy - blockH / 2 - 0.6 * u;
      var ty = top + tm.h / 2;                                   // title centre (cap block)
      var lineY = ty + tm.h / 2 + lineGap;
      var sy = sub ? lineY + subGap + sm.h / 2 : 0;

      // ── timing ──────────────────────────────────────────────────────────────
      var T0 = 0.03;
      var TS = Math.min(0.8, Math.max(0.5, 0.24 * D));          // how long the band takes to cross the words
      var pr = s.seg(T0, T0 + TS);
      var eSweep = E.outCubic(pr);
      var swell = g.smooth(s.seg(T0 + TS * 0.5, T0 + TS + 1.2));
      var exitK = 0.82 + 0.18 * s.out(0.25);
      var breathe = 1 + 0.035 * Math.sin(t * 2.3);

      // ── sweep geometry: axis tilted 20° (mirrored for right-to-left text) ──
      var angDeg = rtl ? 160 : 20, ang = angDeg * Math.PI / 180;
      var ax = Math.cos(ang), ay = Math.sin(ang);
      function along(x, y) { return (x - g.cx) * ax + (y - g.cy) * ay; }
      var bx0 = g.cx - tm.w / 2, bx1 = g.cx + tm.w / 2;
      var by0 = ty - tm.h / 2 - tm.size * 0.3, by1 = ty + tm.h / 2 + tm.size * 0.3;
      var dmin = Math.min(along(bx0, by0), along(bx1, by0), along(bx0, by1), along(bx1, by1));
      var dmax = Math.max(along(bx0, by0), along(bx1, by0), along(bx0, by1), along(bx1, by1));
      var bandU = Math.min(34, Math.max(18, tm.size / u * 2.3));
      var bandPx = bandU * u;
      var softF = tm.size * 0.42, softB = tm.size * 1.5;
      var dA = dmin - softF - bandPx * 0.15, dB = dmax + softF + 2;
      var front = dA + (dB - dA) * eSweep;
      var lit = pr >= 1;
      var travel = Math.hypot(g.W, g.H) / 2 + bandPx;
      var bandA = 0.95 * eK * g.smooth(s.seg(0, 0.07)) * (1 - g.smooth(s.seg(T0 + TS * 0.7, T0 + TS + 0.3)));

      // ── light behind ──────────────────────────────────────────────────────
      var poolR = Math.min(75, Math.max(34, tm.w / u * 0.62));
      g.backlight(g.cx, ty, poolR, { color: s.color, alpha: (0.06 + 0.2 * swell) * eK * exitK * breathe });
      if (bandA > 0.01) {
        // a faint sheen crossing the whole frame, and a soft blade of light right behind the words
        g.sweep((front + travel) / (2 * travel), { angle: angDeg, width: bandU * 1.7, color: s.color, alpha: 0.3 * bandA });
        var fx = g.cx + ax * (front - along(g.cx, ty)), fy = ty + ay * (front - along(g.cx, ty));
        blade(g, fx, fy, ang, Math.max(tm.h * 1.25 + 16 * u, 34 * u), bandPx * 0.42, s.color, bandA);
      }
      var nDust = Math.round(6 + 44 * dens);
      if (nDust > 0) {
        g.particles(s.index * 13 + 3, nDust, {
          color: g.mix(s.color, s.color2, 0.35),
          area: { x: g.cx - box.w / 2, y: ty - Math.max(26 * u, tm.h * 1.6), w: box.w, h: Math.max(52 * u, tm.h * 3.2) },
          size: 0.2, alpha: 0.5 * g.smooth(s.seg(0.25, 1.4)), speed: 1.0
        });
      }

      // ── the words ─────────────────────────────────────────────────────────
      var glowNow = (0.5 + 0.42 * swell) * eK * exitK * breathe;
      if (!lit) {
        // dark glass letters: visible only where there is light behind them; they also block that light
        g.lit(function (c, bloom) {
          g.text(text, g.cx, ty, merge(tOpt, bloom ? { color: '#000', glow: 1, glowColor: '#000' } : { color: DARK_GLASS, glow: 0 }));
        });
        var gA = dA - softB - 8, gB = dB + softF + 8, span = gB - gA;
        var pos = function (d) { return (d - gA) / span; };
        var p0x = g.cx + ax * gA, p0y = g.cy + ay * gA, p1x = g.cx + ax * gB, p1y = g.cy + ay * gB;
        var hot = g.lighten(s.color, 0.55);
        var fill = stops(g.ctx.createLinearGradient(p0x, p0y, p1x, p1y), [
          [0, '#FFFFFF'], [pos(front - softF * 0.2), '#FFFFFF'],
          [pos(front + softF * 0.45), g.rgba(hot, 0.75)], [pos(front + softF), g.rgba(s.color, 0)], [1, g.rgba(s.color, 0)]
        ]);
        var glowGr = stops(g.ctx.createLinearGradient(p0x, p0y, p1x, p1y), [
          [0, g.rgba(s.color, Math.min(1, glowNow))], [pos(front - softB), g.rgba(s.color, Math.min(1, glowNow))],
          [pos(front - softB * 0.3), g.rgba(hot, 1)], [pos(front), 'rgba(255,255,255,1)'],
          [pos(front + softF), 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,0)']
        ]);
        g.text(text, g.cx, ty, merge(tOpt, { color: fill, glow: 1, glowColor: glowGr }));
      } else {
        g.text(text, g.cx, ty, merge(tOpt, { color: '#FFFFFF', glow: glowNow, glowColor: s.color }));
      }

      // ── glint: a slow specular pass across the lit letters mid-hold (bloom only) ──
      var tg0 = Math.max(T0 + TS + 0.5, D * 0.48), tg1 = Math.min(tg0 + 0.95, D - 0.15);
      if (lit && tg1 - tg0 > 0.4 && t > tg0 && t < tg1) {
        var pg = E.inOutCubic(s.seg(tg0, tg1));
        var gw = tm.size * 0.9;
        var gc = dmin - gw + (dmax - dmin + 2 * gw) * pg;
        var hA = gc - gw * 2, hB = gc + gw * 2;
        var gl = stops(g.ctx.createLinearGradient(g.cx + ax * hA, g.cy + ay * hA, g.cx + ax * hB, g.cy + ay * hB), [
          [0, 'rgba(255,255,255,0)'], [0.3, g.rgba(g.lighten(s.color2, 0.35), 0)],
          [0.5, g.rgba(g.lighten(s.color2, 0.45), 0.85 * eK)], [0.7, g.rgba(g.lighten(s.color2, 0.35), 0)], [1, 'rgba(255,255,255,0)']
        ]);
        g.lit(function (c, bloom) {
          if (bloom) g.text(text, g.cx, ty, merge(tOpt, { glow: 1, glowColor: gl }));
        });
      }

      // ── horizon line (the synthwave touch) ──────────────────────────────────
      if (dens > 0.12) {
        var lp = E.outExpo(s.seg(T0 + TS * 0.75, T0 + TS * 0.75 + 0.9));
        if (lp > 0.002) {
          var half = Math.min(box.w * 0.46, Math.max(10 * u, tm.w * 0.36)) * lp;
          g.beam(g.cx - half, lineY, g.cx + half, lineY, {
            color: s.color2, width: 0.3, alpha: (0.45 + 0.4 * dens) * exitK
          });
        }
      }

      // ── sub line ──────────────────────────────────────────────────────────
      if (sub) {
        var ts0 = T0 + TS * 0.85;
        var sa = E.outCubic(s.in(0.45, ts0));
        if (sa > 0.001) {
          var rise = (1 - E.outExpo(s.in(0.7, ts0))) * 2.2 * u;
          g.text(sub, g.cx, sy + rise, merge(sOpt, {
            color: g.mix('#FFFFFF', s.color, 0.28), alpha: 0.92 * sa, glow: 0.3 * eK
          }));
        }
      }
    }
  });
})();
