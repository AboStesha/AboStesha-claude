/*
 * Neon Glass Motion — shot "type": a line types itself on, character by character.
 *
 * Every character lands white-hot and cools to the beat colour over ~0.35 s, so typing leaves a short
 * glowing trail; the final character flashes hardest. Typing is paced to finish by ~55% of the beat,
 * with a slight human rhythm (small pauses after spaces and punctuation), then the caret blinks through
 * the hold. With bar=true the line sits in a wide dark glass search/prompt bar with a leading icon; the
 * bar opens, a specular glint crosses it, and it pulses like "enter" when the line is complete. `sub`
 * rises in under it after typing. Arabic types right-to-left (icon on the right, caret on the left).
 *
 * Params: text (required, <= 5 words), bar (false), icon ('search'), sub (optional, <= 5 words).
 */
(function () {
  'use strict';

  var PUNCT = /[.,!?;:…،؛؟۔]/;

  // The safe box shrunk by this beat's camera move (k = its largest zoom), so text stays inside on every frame.
  function fitBox(g, s) {
    var cam = String((s.beat && s.beat.camera) || 'push');
    var k = 1, dx = 0, dy = 0;
    if (cam === 'push' || cam === 'pull') k = 1 + 0.05 * (0.5 + s.energy);
    else if (cam === 'drift') { k = 1 + 0.015 * (0.5 + s.energy); dx = 1.7 * g.u; dy = 1.2 * g.u; }
    return { w: (g.safe.w - 2 * dx) / k, h: (g.safe.h - 2 * dy) / k, k: k };
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

  function fitText(g, str, base, maxW, extra, grow) {
    var o = merge(extra, { size: base });
    var m = g.measure(str, o);
    if (m.lineCount === 1) {
      if (m.w <= maxW) {
        if (grow && m.w > 0 && m.w < maxW * 0.5) o.size = Math.min(base * grow, base * (maxW * 0.5) / m.w);
      } else if (maxW / m.w < 0.86) {
        o.wrap = 2;
      }
    }
    o.maxWidth = maxW;
    return o;
  }

  // On/off caret blink (period ~1.05 s) with short soft edges; starts "on" at x = 0.
  function blink(x) {
    return Math.max(0, Math.min(1, 0.5 + 2.4 * Math.cos(2 * Math.PI * x / 1.05)));
  }

  NGM.shot('type', {
    draw: function (g, s) {
      var E = g.ease, u = g.u, b = s.beat;
      var text = clean(b.text), sub = clean(b.sub);
      if (!text) return;
      var D = s.dur, t = s.t;
      var eK = 0.75 + 0.5 * s.energy;
      var box = fitBox(g, s);
      var land = g.aspect === 'landscape', sq = g.aspect === 'square';
      var bar = b.bar === true || b.bar === 'true';
      var exitK = 0.85 + 0.15 * s.out(0.25);

      // ── layout ──────────────────────────────────────────────────────────────
      var rtl = g.measure(text, { size: 10 }).rtl;
      var fs = bar ? (land ? 9.4 : sq ? 8.2 : 8.8) : (land ? 12 : sq ? 10.5 : 11.5);
      var base = {
        weight: bar ? 700 : 800,
        tracking: rtl ? 0 : bar ? -0.012 : -0.022,
        lineHeight: rtl ? 1.45 : bar ? 1.22 : 1.08
      };
      var fsPx = fs * u;
      var iconU = bar ? fs * 0.95 : 0, iconPx = iconU * u;
      var padL = bar ? fsPx * 0.62 : 0, gapI = bar ? fsPx * 0.5 : 0, padR = bar ? fsPx * 0.62 : 0;
      var chromeL = padL + iconPx + gapI;
      // The glass may reach past the title-safe box (it is a frame element); the words may not.
      var maxBarW = land ? Math.min(box.w, 140 * u) : Math.min(g.W * 0.93 / box.k, box.w + 2 * chromeL);
      var textMax = bar ? Math.min(maxBarW / 2 - padR, box.w / 2) + maxBarW / 2 - chromeL : box.w;
      var tOpt = fitText(g, text, fs, textMax, base, bar ? 0 : 1.2);
      var tm = g.measure(text, tOpt);
      var px = tm.size, S = px / u, lh = tm.lineHeight, asc = tm.ascent;
      var lines = tm.lines, nL = lines.length;

      var barW = 0, barH = 0;
      if (bar) {
        barW = Math.min(maxBarW, Math.max(maxBarW * 0.64, tm.w + chromeL + padR));
        barH = tm.h + 2 * Math.max(px * (rtl ? 0.95 : 0.8), 3.2 * u);
      }
      var sOpt = null, sm = null;
      if (sub) {
        sOpt = fitText(g, sub, land ? 4.8 : sq ? 4.8 : 5.3, box.w * 0.9, { weight: 600, tracking: 0, lineHeight: 1.22 }, 0);
        sm = g.measure(sub, sOpt);
      }
      var mainH = bar ? barH : tm.h;
      var subGap = !sub ? 0 : bar ? Math.max(5 * u, sm.size * 1.1) :
        tm.descent * (rtl ? 0.9 : 0.3) + Math.max(4.2 * u, px * 0.34);
      var blockH = mainH + (sub ? subGap + sm.h : 0);
      var top = g.cy - blockH / 2 - 0.6 * u;
      var mainCy = top + mainH / 2;
      var subY = sub ? top + mainH + subGap + sm.h / 2 : 0;
      var firstBase = mainCy - tm.h / 2 + asc;
      if (bar && rtl) firstBase -= tm.descent * 0.15;           // optical: Arabic tails sit low in the bar
      var barX = g.cx - barW / 2;

      // line anchors: left edge (LTR) or right edge (RTL) of each line
      var anchor = [];
      for (var li = 0; li < nL; li++) {
        if (bar) anchor.push(rtl ? barX + barW - chromeL : barX + chromeL);
        else anchor.push(rtl ? g.cx + tm.widths[li] / 2 : g.cx - tm.widths[li] / 2);
      }
      var dOpt = {
        size: S, weight: base.weight, tracking: base.tracking, baseline: 'alphabetic', align: rtl ? 'right' : 'left'
      };

      // ── typing schedule (deterministic, slightly human) ─────────────────────
      var lineG = lines.map(function (l) { return g.graphemes(l); });
      var steps = [];
      lineG.forEach(function (gs, l) {
        if (l > 0) steps.push({ line: l, j: -1, ch: ' ' });   // the wrap point: a space's worth of time
        gs.forEach(function (ch, j) { steps.push({ line: l, j: j, ch: ch }); });
      });
      var N = steps.length;
      var t0 = bar ? 0.4 : 0.14;
      var t1 = Math.min(0.55 * D, t0 + Math.max(0, N - 1) * 0.105);
      if (t1 < t0 + 0.15 && N > 1) t1 = t0 + 0.15;
      var seed = s.index * 101 + 7;
      var cum = [0], tot = 0;
      for (var i = 1; i < N; i++) {
        var prev = steps[i - 1].ch, w = 0.7 + 0.6 * g.rand(seed + i * 7.31);
        if (prev === ' ' || steps[i].j < 0) w *= 1.45;
        if (PUNCT.test(prev)) w *= 1.7;
        tot += w;
        cum.push(tot);
      }
      var times = steps.map(function (st, k) { return N > 1 ? t0 + (t1 - t0) * cum[k] / tot : t0; });
      var tEnd = times[N - 1];
      var k = 0;
      while (k < N && times[k] <= t) k++;
      var typed = lineG.map(function () { return 0; });
      for (i = 0; i < k; i++) if (steps[i].j >= 0) typed[steps[i].line] = steps[i].j + 1;
      var caretLine = 0, caretPos = 0;
      if (k > 0) {
        var last = steps[k - 1];
        caretLine = last.line;
        caretPos = last.j < 0 ? 0 : last.j + 1;
      }
      var done = k >= N;
      var pulse = t >= tEnd ? 1 - E.outCubic(s.seg(tEnd, tEnd + 0.7)) : 0;   // the "enter" moment

      // prefix widths, memoised per frame
      var memo = {};
      function pw(l, n) {
        var key = l + ':' + n;
        if (memo[key] === undefined) memo[key] = n <= 0 ? 0 : g.measure(lineG[l].slice(0, n).join(''), dOpt).w;
        return memo[key];
      }
      function baseY(l) { return firstBase + l * lh; }

      // ── light behind / dust ─────────────────────────────────────────────────
      var grow = bar ? E.outExpo(s.in(0.55)) : 1;
      // one frame ahead, so the cut lands on a dim bar rather than on a fully black frame
      var barIn = bar ? E.outCubic(s.in(0.22, -1 / (s.fps || 30))) : 1;
      var settleGlow = g.smooth(s.seg(tEnd, tEnd + 0.9));
      var poolR = bar ? Math.max(30, barW / u * 0.58) : Math.max(30, tm.w / u * 0.6);
      g.backlight(g.cx, mainCy, poolR, {
        color: s.color,
        alpha: ((bar ? 0.1 * barIn : 0.05) + 0.1 * settleGlow + 0.16 * pulse) * eK * exitK
      });
      var nDust = Math.round(4 + 36 * s.density);
      if (nDust > 0) {
        var dh = Math.max(46 * u, mainH * 3);
        g.particles(s.index * 17 + 5, nDust, {
          color: g.mix(s.color, s.color2, 0.3), area: { x: g.cx - box.w / 2, y: mainCy - dh / 2, w: box.w, h: dh },
          size: 0.2, alpha: 0.45 * g.smooth(s.seg(0.3, 1.5)), speed: 1.0
        });
      }

      // ── the glass bar and its icon ──────────────────────────────────────────
      if (bar) {
        var bw = barW * (0.86 + 0.14 * grow), bx = g.cx - bw / 2, by = mainCy - barH / 2 + (1 - grow) * 2 * u;
        var shine = -1;
        if (t >= 0.12 && t <= 1.25) shine = E.inOutCubic(s.seg(0.12, 1.25));
        else if (t >= tEnd + 0.05 && t <= tEnd + 1.0) shine = E.inOutCubic(s.seg(tEnd + 0.05, tEnd + 1.0));
        if (rtl && shine >= 0) shine = 1 - shine;
        g.glass(bx, by, bw, barH, {
          r: (nL > 1 ? Math.min(barH / 2, 6 * u) : barH / 2) / u,
          color: s.color, rim: Math.min(1, 0.5 + 0.38 * grow + 0.3 * pulse), glow: (0.28 + 0.18 * s.energy + 0.35 * pulse) * exitK,
          depth: 0.75, shine: shine, alpha: barIn
        });
        var ix = rtl ? bx + bw - padL - iconPx / 2 : bx + padL + iconPx / 2;
        var ia = E.outCubic(s.in(0.3, 0.1));
        if (ia > 0) {
          g.icon(String(b.icon || 'search'), ix, mainCy, iconU * (0.82 + 0.18 * E.outBack(s.in(0.45, 0.1), 2.2)), {
            color: g.lighten(s.color, 0.3), alpha: ia, glow: (0.5 + 0.5 * pulse) * eK, hot: 0.85 * pulse
          });
        }
      }

      // ── typed text ──────────────────────────────────────────────────────────
      var settled = g.lighten(s.color, bar ? 0.4 : 0.28);
      var gSet = (bar ? 0.42 : 0.58) * eK * exitK;
      for (var l = 0; l < nL; l++) {
        if (!typed[l]) continue;
        g.text(lineG[l].slice(0, typed[l]).join(''), anchor[l], baseY(l), merge(dOpt, {
          color: settled, glow: gSet * (1 + 0.25 * settleGlow), glowColor: s.color
        }));
      }
      // heat trail: each freshly typed character re-drawn white-hot inside its own slot, cooling off
      for (i = Math.max(0, k - 12); i < k; i++) {
        var st = steps[i];
        if (st.j < 0) continue;
        var isLast = i === N - 1;
        var hd = isLast ? 0.5 : 0.35;
        var age = t - times[i];
        if (age >= hd) continue;
        var h = Math.pow(1 - age / hd, 1.6);
        var L = st.line, xa = pw(L, st.j), xb = pw(L, st.j + 1), by0 = baseY(L);
        var e1 = px * 0.03, e2 = px * 0.08;
        var cx0 = rtl ? anchor[L] - xb - e2 : anchor[L] + xa - e1;
        var cx1 = rtl ? anchor[L] - xa + e1 : anchor[L] + xb + e2;
        var partial = lineG[L].slice(0, typed[L]).join('');
        var hotCol = g.mix(settled, '#FFFFFF', h);
        var hotGlow = gSet + (isLast ? 1.1 : 0.8) * h * eK;
        var hotGlowCol = g.mix(s.color, '#FFFFFF', 0.85 * h);
        (function (x0, x1, yb, str, col, gl, glc) {
          g.lit(function (c) {
            c.beginPath();
            c.rect(x0, yb - px * 1.25, x1 - x0, px * 1.9);
            c.clip();
            g.text(str, anchor[L], yb, merge(dOpt, { color: col, glow: gl, glowColor: glc }));
          });
        })(cx0, cx1, by0, partial, hotCol, hotGlow, hotGlowCol);
        g.backlight((cx0 + cx1) / 2, by0 - asc * 0.5, Math.max(6, S * (isLast ? 2.8 : 1.6)), {
          color: g.mix(s.color, '#FFFFFF', 0.35), alpha: (isLast ? 0.5 : 0.2) * h * eK
        });
      }

      // ── caret ───────────────────────────────────────────────────────────────
      var caretA;
      if (t < t0) caretA = bar && t < 0.16 ? 0 : blink(t - (bar ? 0.16 : 0)) * barIn;
      else if (!done || t < tEnd + 0.3) caretA = 1;
      else caretA = blink(t - tEnd - 0.3);
      if (caretA > 0.01) {
        var cw = Math.max(0.42 * u, px * 0.075);
        var cxp = pw(caretLine, caretPos) + px * 0.07;
        var cxx = rtl ? anchor[caretLine] - cxp - cw : anchor[caretLine] + cxp;
        var cb = baseY(caretLine);
        var ctop = cb - asc * (rtl ? 1.1 : 1.14), cbot = cb + (rtl ? tm.descent * 0.55 : px * 0.16);
        var ccol = g.lighten(s.color, 0.5);
        g.lit(function (c, bloom) {
          g.roundRect(cxx, ctop, cw, cbot - ctop, cw / u / 2, c);
          c.fillStyle = bloom ? g.rgba(s.color, 0.85 * caretA * eK) : g.rgba(ccol, caretA);
          c.fill();
        });
      }

      // ── sub line ──────────────────────────────────────────────────────────
      if (sub) {
        var ts0 = tEnd + 0.2;
        var sa = E.outCubic(s.in(0.45, ts0));
        if (sa > 0.001) {
          var rise = (1 - E.outExpo(s.in(0.7, ts0))) * 2 * u;
          g.text(sub, g.cx, subY + rise, merge(sOpt, {
            color: g.mix('#FFFFFF', s.color, 0.28), alpha: 0.9 * sa, glow: 0.3 * eK
          }));
        }
      }
    }
  });
})();
