/*
 * Neon Glass Motion — shot "number": a concrete figure slams in.
 *
 * The value flies at the camera from 2.3x and slams down with an overshoot (a short zoom trail on the
 * way in). On impact: a white-hot bloom flash, a shockwave ring (plus a wider echo in the next colour)
 * and a burst of light streaks. The numeric part counts up while the prefix/suffix stay put
 * ('40%', '$0', '10x', '1M+', '2.5x', '1,200', Arabic-Indic digits too). A thin neon gauge ring sits
 * behind the figure: it fills to the percentage for % values, otherwise it closes to a full circle and
 * a comet of light orbits it through the hold. A short label rises in under the figure, inside the ring.
 *
 * Params: value (required, <= 6 characters), label (optional, <= 5 words), countUp (true).
 */
(function () {
  'use strict';

  var DIGIT = '0-9٠-٩۰-۹';
  var NUM_RE = new RegExp('^(.*?)([' + DIGIT + ']+(?:[.,٫٬][' + DIGIT + ']+)*)(.*)$');
  var HAS_DIGIT = new RegExp('[' + DIGIT + ']');

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

  // Split a value into prefix / number / suffix and build a formatter that keeps its separators,
  // decimal places and digit script. '1,200' groups, '2.5' and '2,5' are decimals, '1.234,5' both.
  function parseValue(str, countUp) {
    var out = { str: str, count: false, frac: 1, pre: '', suf: '' };
    var m = str.match(NUM_RE);
    if (!m) return out;
    var pre = m[1], num = m[2], suf = m[3];
    var zero = /[٠-٩]/.test(num) ? 0x660 : /[۰-۹]/.test(num) ? 0x6F0 : 0;
    var lat = num.replace(/[٠-٩۰-۹]/g, function (d) {
      var c = d.charCodeAt(0);
      return String(c - (c >= 0x6F0 ? 0x6F0 : 0x660));
    });
    var seps = lat.replace(/[0-9]/g, '');
    var dec = '', grp = '', intD = lat, decD = '';
    if (seps.length) {
      var lastSep = seps.charAt(seps.length - 1), lastIdx = lat.lastIndexOf(lastSep);
      var tail = lat.length - lastIdx - 1;
      var same = seps.split('').every(function (c) { return c === seps.charAt(0); });
      var groupOnly = same && (seps.length > 1 || ((lastSep === ',' || lastSep === '٬') && tail === 3));
      if (groupOnly) {
        grp = seps.charAt(0);
        intD = lat.split(grp).join('');
      } else {
        dec = lastSep;
        intD = lat.slice(0, lastIdx);
        decD = lat.slice(lastIdx + 1);
        var gs = intD.replace(/[0-9]/g, '');
        if (gs) { grp = gs.charAt(0); intD = intD.split(grp).join(''); }
      }
    }
    var value = parseFloat(intD + (decD ? '.' + decD : ''));
    if (!isFinite(value)) return out;
    var decimals = decD.length;
    function fmt(n) {
      var sN = Math.abs(n).toFixed(decimals), parts = sN.split('.');
      var ip = parts[0];
      if (grp) ip = ip.replace(/\B(?=(\d{3})+(?!\d))/g, grp);
      var r = ip + (decimals ? dec + parts[1] : '');
      if (zero) r = r.replace(/[0-9]/g, function (d) { return String.fromCharCode(zero + +d); });
      return r;
    }
    var isYear = !pre && !suf && !decimals && /^(1[89]|20|21)\d\d$/.test(intD);
    out.pre = pre;
    out.suf = suf;
    out.value = value;
    out.fmt = fmt;
    out.count = countUp !== false && !isYear && !HAS_DIGIT.test(suf) && !HAS_DIGIT.test(pre) &&
      (value >= 5 || (decimals > 0 && value >= 1));
    if (/^\s*[%٪]/.test(suf)) out.frac = Math.max(0, Math.min(1, value / 100));
    return out;
  }

  // An arc of the gauge that may wrap past 12 o'clock.
  function arc(g, x, y, r, from, len, o) {
    from = ((from % 1) + 1) % 1;
    if (len <= 0) return;
    if (from + len <= 1) { g.ring(x, y, r, merge(o, { from: from, to: from + len })); return; }
    g.ring(x, y, r, merge(o, { from: from, to: 1 }));
    g.ring(x, y, r, merge(o, { from: 0, to: from + len - 1 }));
  }

  NGM.shot('number', {
    draw: function (g, s) {
      var E = g.ease, u = g.u, b = s.beat;
      var raw = clean(b.value), label = clean(b.label);
      if (!raw) { raw = label; label = ''; }
      if (!raw) return;
      var D = s.dur, t = s.t;
      var eK = 0.75 + 0.5 * s.energy;
      var dens = s.density;
      var box = fitBox(g, s);
      var land = g.aspect === 'landscape', sq = g.aspect === 'square';
      var pv = parseValue(raw, !(b.countUp === false || b.countUp === 'false'));
      var exitK = 0.85 + 0.15 * s.out(0.25);

      // ── layout ──────────────────────────────────────────────────────────────
      var Rr = (land ? 0.44 * box.h : sq ? 0.43 * Math.min(box.w, box.h) : 0.46 * box.w);
      var base = land ? 28 : sq ? 27 : 30;
      var nBase = { weight: 900, tracking: -0.04, lineHeight: 1 };
      var natural = g.measure(raw, merge(nBase, { size: base }));
      Rr = Math.max(Rr, Math.min(natural.w / 2 + 6 * u, Math.min(box.w, box.h) / 2 - 0.5 * u));
      var nOpt = merge(nBase, { size: base, maxWidth: Math.min(box.w, 2 * (Rr - 3.5 * u)) });
      var nm = g.measure(raw, nOpt);
      var npx = nm.size, rtl = nm.rtl;
      var dOpt = merge(nBase, { size: npx / u });                    // fixed size for count-up frames
      var lOpt = null, lm = null;
      if (label) {
        lOpt = merge({ weight: 700, tracking: -0.01, lineHeight: 1.12, wrap: 2 },
          { size: land ? 6.2 : sq ? 6 : 6.6, maxWidth: Math.min(box.w, Rr * 1.5) });
        lm = g.measure(label, lOpt);
      }
      var ringCy = g.cy - 0.5 * u;
      // clear the figure's descenders (',' in '1,200'; Arabic-Indic digits sit low) and tall Arabic label letters
      var gap = !label ? 0 : Math.max(3.2 * u, npx * 0.12) + nm.descent * (rtl ? 0.75 : 0.55) + (lm.rtl ? lm.size * 0.3 : 0);
      var groupH = nm.h + (label ? gap + lm.h : 0);
      var ny = ringCy - groupH / 2 + nm.h / 2;
      var ly = label ? ny + nm.h / 2 + gap + lm.h / 2 : 0;
      var RrU = Rr / u;

      // ── timing ──────────────────────────────────────────────────────────────
      var TS = 0.34, K = 1.9;
      var q = s.seg(0, TS);
      var tI = TS / (K + 1);                    // impact: outBack(q, K) first reaches 1 at q = 1 / (K + 1)
      var scale = 2.3 + (1 - 2.3) * E.outBack(q, K);
      var alphaN = E.outCubic(s.in(0.09));
      var flash = t >= tI ? 1 - E.outCubic(s.seg(tI, tI + 0.6)) : 0;
      var tC = Math.min(1.15, Math.max(0.75, 0.3 * D));
      var cp = E.outCubic(s.seg(0.02, tC));
      var landP = pv.count && t >= tC ? 1 - E.outCubic(s.seg(tC, tC + 0.5)) : 0;
      var ringIn = g.smooth(s.seg(tI + 0.04, tI + 0.4));
      var fill = pv.count && pv.frac < 1 ? pv.frac * cp : pv.frac * E.outCubic(s.seg(tI, Math.max(tI + 0.8, tC)));
      var swell = g.smooth(s.seg(tI, tI + 1.4));

      // ── light behind ──────────────────────────────────────────────────────
      g.backlight(g.cx, ringCy, RrU * 1.35, {
        color: s.color, alpha: (0.1 + 0.1 * swell + 0.75 * flash) * eK * exitK
      });
      if (flash > 0) {
        g.backlight(g.cx, ny, RrU * 0.85, { color: g.mix(s.color, '#FFFFFF', 0.5), alpha: 0.6 * flash * flash * eK });
      }
      var nDust = Math.round(4 + 40 * dens);
      if (nDust > 0) {
        g.particles(s.index * 23 + 11, nDust, {
          color: g.mix(s.color, s.color2, 0.4),
          area: { x: g.cx - box.w / 2, y: ringCy - Math.min(box.h / 2, Rr * 1.6), w: box.w, h: Math.min(box.h, Rr * 3.2) },
          size: 0.2, alpha: 0.5 * g.smooth(s.seg(tI, tI + 1.2)), speed: 1.1
        });
      }

      // ── gauge ring ──────────────────────────────────────────────────────────
      if (ringIn > 0) {
        g.ring(g.cx, ringCy, RrU, { width: 0.26, color: g.mix(s.color, '#FFFFFF', 0.25), alpha: 0.14 * ringIn, glow: 0.1 });
        if (dens >= 0.3) {
          var tickA = ringIn * g.smooth((dens - 0.3) / 0.35);
          var r0 = Rr + 1.7 * u, nT = 60;
          g.lit(function (c, bloom) {
            c.lineCap = 'round';
            for (var i = 0; i < nT; i++) {
              var on = i / nT < fill - 1e-6;
              if (bloom && !on) continue;
              var major = i % 5 === 0, a = -Math.PI / 2 + i / nT * Math.PI * 2;
              var r1 = r0 + (major ? 1.7 : 0.9) * u, ca = Math.cos(a), sa = Math.sin(a);
              c.beginPath();
              c.moveTo(g.cx + ca * r0, ringCy + sa * r0);
              c.lineTo(g.cx + ca * r1, ringCy + sa * r1);
              c.strokeStyle = on ? g.rgba(bloom ? s.color : g.lighten(s.color, 0.35), (bloom ? 0.55 : 0.9) * tickA)
                : g.rgba('#FFFFFF', (major ? 0.2 : 0.11) * tickA);
              c.lineWidth = (major ? 0.32 : 0.22) * u * (bloom ? 2.5 : 1);
              c.stroke();
            }
          });
        }
        if (fill > 0.002) {
          g.ring(g.cx, ringCy, RrU, { from: 0, to: fill, width: 0.62, color: s.color, alpha: ringIn, glow: 0.95 * eK * exitK });
          if (fill < 0.999) {
            var ha = -Math.PI / 2 + fill * Math.PI * 2;
            var hx = g.cx + Math.cos(ha) * Rr, hy = ringCy + Math.sin(ha) * Rr;
            g.backlight(hx, hy, 5 + 3 * landP, { color: g.lighten(s.color, 0.4), alpha: (0.55 + 0.4 * landP) * ringIn * eK });
            g.lit(function (c, bloom) {
              c.beginPath();
              c.arc(hx, hy, (bloom ? 1.6 : 0.62) * u, 0, Math.PI * 2);
              c.fillStyle = bloom ? g.rgba(s.color, ringIn) : g.rgba('#FFFFFF', ringIn);
              c.fill();
            });
          } else if (dens > 0.15) {
            // closed ring: a comet of light orbits it through the hold
            var tFull = Math.max(tI + 0.8, tC);
            var ca0 = E.outCubic(s.seg(tFull, tFull + 0.5));
            if (ca0 > 0) {
              var head = (t - tFull) * 0.2;
              for (var sg = 0; sg < 4; sg++) {
                arc(g, g.cx, ringCy, RrU, head - 0.03 * (sg + 1), 0.03, {
                  width: 0.62 + 0.25 * (3 - sg) / 3, color: g.lighten(s.color, 0.5 - sg * 0.12),
                  alpha: ca0 * (0.85 - sg * 0.2), glow: 0.8 * eK
                });
              }
            }
          }
        }
      }

      // ── impact: shockwaves + streaks ────────────────────────────────────────
      if (t >= tI) {
        g.shockwave(g.cx, ringCy, s.seg(tI, tI + 0.9), { maxR: RrU * 2.3, width: 1.8, color: s.color });
        if (dens >= 0.2) {
          g.shockwave(g.cx, ringCy, s.seg(tI + 0.09, tI + 1.2), { maxR: RrU * 3.2, width: 0.9, color: s.color2, alpha: 0.75 });
        }
        var nS = Math.round(4 + 22 * dens);
        var streaks = [];
        for (var i = 0; i < nS; i++) {
          var ps = s.seg(tI, tI + 0.5 + 0.35 * g.rand(s.index * 7 + i * 3.1));
          if (ps <= 0 || ps >= 1) continue;
          var an = Math.PI * 2 * (i + 0.8 * g.rand(i * 5.7 + 1)) / nS;
          var reach = Rr * (0.95 + 0.85 * g.rand(i * 9.1 + 2));
          var d0 = Rr * 0.45 + reach * E.outCubic(ps);
          var len = Math.max(1.2 * u, (1 - ps) * Rr * 0.32);
          streaks.push([Math.cos(an), Math.sin(an), d0, len, Math.pow(1 - ps, 1.3)]);
        }
        if (streaks.length) {
          var hot = g.lighten(s.color, 0.55);
          g.lit(function (c, bloom) {
            c.lineCap = 'round';
            c.globalCompositeOperation = 'lighter';
            streaks.forEach(function (k) {
              c.beginPath();
              c.moveTo(g.cx + k[0] * k[2], ringCy + k[1] * k[2]);
              c.lineTo(g.cx + k[0] * (k[2] - k[3]), ringCy + k[1] * (k[2] - k[3]));
              c.strokeStyle = g.rgba(bloom ? s.color : hot, k[4] * (bloom ? 0.9 : 0.85));
              c.lineWidth = (bloom ? 1.2 : 0.3) * u;
              c.stroke();
            });
          });
        }
      }

      // ── the figure ──────────────────────────────────────────────────────────
      var shown = pv.count ? pv.pre + pv.fmt(pv.value * cp) + pv.suf : raw;
      var mode = rtl ? 'center' : pv.count && pv.suf && !pv.pre ? 'right' : pv.count && pv.pre && !pv.suf ? 'left' : 'center';
      var ax = mode === 'right' ? g.cx + nm.w / 2 : mode === 'left' ? g.cx - nm.w / 2 : g.cx;
      // zoom about the centre of what is on screen now, so a counting figure flies in centred
      var pivot = mode === 'center' ? g.cx : ax + (mode === 'right' ? -1 : 1) * g.measure(shown, dOpt).w / 2;
      var glowN = (0.72 + 0.8 * flash + 0.35 * landP) * eK * exitK;
      var glowC = g.mix(s.color, '#FFFFFF', 0.65 * flash);
      function figure(k, alpha, glow) {
        g.lit(function (c) {
          c.translate(pivot, ny);
          c.scale(k, k);
          c.translate(-pivot, -ny);
          g.text(shown, ax, ny, merge(dOpt, { align: mode, color: '#FFFFFF', alpha: alpha, glow: glow, glowColor: glowC }));
        });
      }
      if (q < 0.45) {                                                  // zoom trail on the way in
        var trail = 1 - q / 0.45;
        figure(scale * 1.14, alphaN * 0.24 * trail, 0.6 * trail);
        figure(scale * 1.32, alphaN * 0.1 * trail, 0.4 * trail);
      }
      figure(scale, alphaN, glowN);

      // ── label ─────────────────────────────────────────────────────────────
      if (label) {
        var la = E.outCubic(s.in(0.45, tI + 0.2));
        if (la > 0.001) {
          var rise = (1 - E.outExpo(s.in(0.7, tI + 0.2))) * 2.5 * u;
          g.text(label, g.cx, ly + rise, merge(lOpt, {
            color: g.mix('#FFFFFF', s.color, 0.2), alpha: 0.94 * la, glow: 0.32 * eK * exitK
          }));
        }
      }
    }
  });
})();
