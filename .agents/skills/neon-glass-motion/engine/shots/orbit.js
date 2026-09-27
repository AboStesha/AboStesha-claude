/*
 * Neon Glass Motion — shot "orbit"
 *
 * A glowing glass core. A tilted elliptical orbit unfolds out of it (with a second, crossing path
 * for depth) and glass name chips fly out onto it, each one "connecting" with a short beam and a
 * light on the chip. The chips keep circling slowly, passing behind the core (dimmer, smaller) and
 * in front of it (brighter, larger). One line of text sits under the system.
 *
 *   items (required)  2–6 short names (integrations, platforms, partners); up to 8 are tolerated
 *   text  (optional)  the line under the system
 *   icon  (optional)  icon at the core
 *
 * The orbit is rolled per aspect so the chips have room: steep in 9:16, diagonal in 1:1, nearly flat
 * in 16:9. Its size is solved so every chip stays inside the safe box, and its phase is chosen (the
 * same way on every frame) to keep the chips clear of each other for as much of the beat as possible.
 *
 * Positions are pixels, sizes are units (g.u = min(W, H) / 100). Output depends only on (g, s).
 */
(function () {
  'use strict';

  var TAU = Math.PI * 2;
  var CFG = {
    //          chip text, caption, core radius, max orbit radius (units), ry/rx, roll (deg), second path roll
    portrait:  { chip: 5.2, cap: 10,  core: 11.5, rx: 50, ry: 0.44, roll: 64,  roll2: -62 },
    square:    { chip: 4.6, cap: 8.6, core: 9.5,  rx: 40, ry: 0.42, roll: 34,  roll2: -40 },
    landscape: { chip: 5.4, cap: 8.6, core: 10.5, rx: 58, ry: 0.34, roll: -9,  roll2: 14 }
  };

  function list(v) {
    if (typeof v === 'string') v = [v];
    return Array.isArray(v) ? v : [];
  }

  NGM.shot('orbit', {
    draw: function (g, s) {
      var u = g.u, S = g.safe, E = g.ease, b = s.beat, t = s.t, D = s.dur;
      var cfg = CFG[g.aspect] || CFG.square;
      var gk = 0.6 + 0.8 * s.energy;
      var hue = 0.3 + 0.35 * s.energy;
      var items = list(b.items).map(function (x) { return x == null ? '' : String(x).trim(); })
        .filter(Boolean).slice(0, 8);
      var n = items.length;
      var text = b.text != null ? String(b.text).trim() : '';
      var icon = typeof b.icon === 'string' && b.icon.trim() ? b.icon.trim() : '';
      var boxW = S.w * 0.93;                                   // headroom for the camera push

      // ── chips: measured once per frame (pure function of the beat)
      var chipSize = cfg.chip * (n >= 5 ? 0.9 : 1);
      var chipH = chipSize * 2.1 * u, padX = chipSize * 0.95 * u;
      var dotR = chipSize * 0.19 * u, dotGap = chipSize * 0.6 * u;
      var maxTextW = boxW * (g.aspect === 'landscape' ? 0.28 : 0.36);
      var chips = items.map(function (name, i) {
        var m = g.measure(name, { size: chipSize, weight: 700, maxWidth: maxTextW });
        return { name: name, i: i, tw: m.w, rtl: m.rtl, w: m.w + 2 * padX + 2 * dotR + dotGap };
      });
      var widest = chips.reduce(function (m, c) { return Math.max(m, c.w); }, 0);
      var meanW = n ? chips.reduce(function (m, c) { return m + c.w; }, 0) / n : 0;
      // size the orbit for a typical chip; a wider one is nudged inward at the far left/right
      var fitW = Math.max(meanW, widest * 0.72);

      // ── caption
      var capM = text ? g.measure(text, { size: cfg.cap, weight: 800, maxWidth: boxW, wrap: true }) : null;
      var capGap = text ? (g.aspect === 'portrait' ? 8 : 5) * u : 0;
      var capH = capM ? capM.h : 0;

      // ── orbit geometry: largest orbit whose chips stay in the safe box
      var ryK = cfg.ry + (n >= 5 ? 0.1 : 0);                            // rounder when crowded
      var roll = cfg.roll * Math.PI / 180, cr = Math.cos(roll), sr = Math.sin(roll);
      var ex1 = Math.sqrt(Math.pow(cr, 2) + Math.pow(ryK * sr, 2));      // x extent per unit of rx
      var ey1 = Math.sqrt(Math.pow(sr, 2) + Math.pow(ryK * cr, 2));      // y extent per unit of rx
      var availH = S.h * 0.95 - capH - capGap;
      var rx = Math.min(cfg.rx * u,
        (boxW / 2 - fitW / 2) / ex1,
        (availH / 2 - chipH / 2) / ey1);
      rx = Math.max(rx, cfg.core * 2.2 * u);
      var ry = rx * ryK;
      var halfH = rx * ey1 + chipH / 2;
      var blockH = 2 * halfH + capGap + capH;
      var cx = g.cx, cy = g.cy - blockH / 2 + halfH - (text ? 0.5 * u : 0);
      var capCY = cy + halfH + capGap + capH / 2;
      var R = cfg.core * u;

      var O1 = { rx: rx, ry: ry, a: roll, cos: cr, sin: sr, col: s.color };
      var roll2 = cfg.roll2 * Math.PI / 180;
      var O2 = { rx: rx * 0.84, ry: ry * 0.9, a: roll2, cos: Math.cos(roll2), sin: Math.sin(roll2), col: g.mix(s.color, s.color2, hue) };

      function point(o, th, scale) {
        var ex = o.rx * Math.cos(th) * scale, ey = o.ry * Math.sin(th) * scale;
        return { x: cx + ex * o.cos - ey * o.sin, y: cy + ex * o.sin + ey * o.cos, z: Math.sin(th) };
      }
      function keepIn(x, halfW) { return g.clamp(x, g.cx - boxW / 2 + halfW, g.cx + boxW / 2 - halfW); }

      // ── motion: chips travel at constant speed along the path (arc length), so they never bunch
      // up at the ends of the ellipse the way equal angles would.
      var ARC_N = 96, cum = [0], prevX = rx, prevY = 0;
      for (var ak = 1; ak <= ARC_N; ak++) {
        var ath = ak / ARC_N * TAU, axx = rx * Math.cos(ath), ayy = ry * Math.sin(ath);
        cum.push(cum[ak - 1] + Math.hypot(axx - prevX, ayy - prevY));
        prevX = axx; prevY = ayy;
      }
      var perim = cum[ARC_N];
      function thetaAt(f) {                                    // fraction of the perimeter -> angle
        f = ((f % 1) + 1) % 1;
        var target = f * perim, lo = 0, hi = ARC_N;
        while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (cum[mid] <= target) lo = mid; else hi = mid; }
        var seg = cum[lo + 1] - cum[lo];
        return (lo + (seg > 0 ? (target - cum[lo]) / seg : 0)) / ARC_N * TAU;
      }
      var speed = (n >= 5 ? 0.036 : 0.048) + 0.02 * s.energy;  // perimeters per second
      var spacing = 1 / Math.max(1, n);

      // Phase: evaluate candidate phases over the settled part of the beat and keep the one with the
      // largest worst-case clearance between chips and around the core. Deterministic per frame.
      var phase = 0.75 + spacing / 2;
      if (n >= 1) {
        var best = -1e9, samples = 10, tA = Math.min(1.1, D * 0.4);
        for (var pc = 0; pc < 24; pc++) {
          var ph = pc / 24 * spacing, worst = 1e9;
          for (var k = 0; k <= samples && worst > best; k++) {
            var tt = tA + (D - tA) * k / samples, pts = [];
            for (var i = 0; i < n; i++) {
              var p0 = point(O1, thetaAt(ph + i * spacing + speed * tt), 1), sc0 = 0.84 + 0.16 * (0.5 + 0.5 * p0.z);
              pts.push({ x: keepIn(p0.x, chips[i].w * sc0 / 2), y: p0.y, z: p0.z, hw: chips[i].w * sc0 / 2, hh: chipH * sc0 / 2 });
            }
            for (var a = 0; a < n; a++) {
              var A = pts[a];
              // behind the core a chip must clear the whole sphere; in front it may cover the rim, not the icon
              var dxc = Math.max(0, Math.abs(A.x - cx) - A.hw), dyc = Math.max(0, Math.abs(A.y - cy) - A.hh);
              worst = Math.min(worst, Math.hypot(dxc, dyc) - R * (A.z < 0 ? 0.9 : 0.55) + chipH * 0.5);
              for (var c2 = a + 1; c2 < n; c2++) {
                var B = pts[c2];
                var clear = Math.max(Math.abs(A.x - B.x) - A.hw - B.hw, Math.abs(A.y - B.y) - A.hh - B.hh);
                worst = Math.min(worst, clear);
              }
            }
          }
          if (worst > best + 0.5) { best = worst; phase = ph; }
        }
      }

      // entrance timing
      var ce = E.outBack(s.in(0.42), 1.7);                     // core arrives
      var unfold = 0.2 + 0.8 * E.outExpo(s.in(0.9, 0.1));      // orbits open out of the core
      var pathA = E.outCubic(s.in(0.6, 0.08));
      var breathe = 0.5 + 0.5 * Math.sin(t * 2.4);
      var stag = Math.min(0.09, 0.45 / Math.max(1, n));

      var arrivals = 0;
      var placed = chips.map(function (c) {
        var start = 0.24 + c.i * stag;
        var e = s.in(0.8, start), ee = E.outExpo(e);
        var th = thetaAt(phase + c.i * spacing + speed * t - (1 - ee) * 0.22);
        var pt = point(O1, th, 0.16 + 0.84 * ee);
        var ta = start + 0.3, fl = t >= ta ? Math.exp(-(t - ta) * 3.4) : 0;
        arrivals = Math.max(arrivals, fl);
        var dk = 0.5 + 0.5 * pt.z;
        return { c: c, e: e, x: keepIn(pt.x, c.w * (0.84 + 0.16 * dk) / 2), y: pt.y, z: pt.z, dk: dk, flash: fl };
      });

      // ── light behind the core + dust
      g.backlight(cx, cy, cfg.core * 3.8, { color: s.color, alpha: (0.3 + 0.08 * breathe + 0.2 * arrivals) * gk * g.clamp(ce * 1.4) });
      g.backlight(cx, cy, rx / u * 1.05, { color: O2.col, alpha: 0.05 * gk * pathA });
      var dust = Math.round(46 * s.density);
      if (dust > 0) g.particles(41 + s.index * 7, dust, { color: s.color2, size: 0.2, alpha: 0.45 });

      // ── orbit paths: back half behind the core, front half over it; motes travel the paths
      var ORBITS = s.density >= 0.25 ? [O1, O2] : [O1];
      var motes = s.density >= 0.4;
      function paths(front) {
        ORBITS.forEach(function (o, k) {
          var al = pathA * (front ? 0.6 : 0.22) * (k ? 0.6 : 1);
          if (al <= 0) return;
          g.lit(function (c, bloom) {
            c.beginPath();
            c.ellipse(cx, cy, o.rx * unfold, o.ry * unfold, o.a, front ? 0 : Math.PI, front ? Math.PI : TAU);
            c.strokeStyle = g.rgba(o.col, al * (bloom ? 0.8 * gk : 1));
            c.lineWidth = (bloom ? 0.75 : k ? 0.15 : 0.22) * u;
            c.stroke();
          });
          if (!motes) return;
          var mth = t * (0.85 + 0.3 * k) + 1.9 + k * 2.4, dots = [];
          for (var m = 0; m < 8; m++) {
            var pt = point(o, mth - m * 0.06, unfold);
            if ((pt.z >= 0) !== front) continue;
            dots.push([pt.x, pt.y, (1 - m / 11) * u, pathA * (1 - m / 8) * (0.3 + 0.7 * (0.5 + 0.5 * pt.z))]);
          }
          if (!dots.length) return;
          var hotCol = g.lighten(o.col, 0.6);
          g.lit(function (c, bloom) {                          // a short comet riding the path
            c.fillStyle = bloom ? o.col : hotCol;
            for (var d = 0; d < dots.length; d++) {
              c.globalAlpha = dots[d][3];
              c.beginPath();
              c.arc(dots[d][0], dots[d][1], (bloom ? 0.9 : 0.3) * dots[d][2], 0, TAU);
              c.fill();
            }
          });
        });
      }

      function drawChip(p) {
        if (p.e <= 0) return;
        var c = p.c, sc = 0.84 + 0.16 * p.dk;
        var al = g.clamp(p.e * 2.2) * (0.62 + 0.38 * p.dk);
        var col = O1.col;
        var w = c.w * sc, h = chipH * sc;
        if (p.flash > 0.02 && s.density >= 0.25) {             // connection beam as the chip arrives
          g.beam(cx, cy, p.x, p.y, { color: col, width: 0.4, alpha: p.flash * 0.7 * al });
        }
        g.backlight(p.x, p.y, w / u * 0.6, { color: col, alpha: (0.05 + 0.07 * p.dk + 0.45 * p.flash) * gk * al });
        g.glass(p.x - w / 2, p.y - h / 2, w, h, {
          r: h / 2 / u, color: col, alpha: al, depth: 0.6,
          rim: g.clamp(0.42 + 0.45 * p.dk + 0.3 * p.flash),
          glow: (0.08 + 0.3 * p.dk + 0.6 * p.flash) * gk,
          tint: 0.05 + 0.04 * p.dk,
          shine: p.flash > 0.04 ? 1 - p.flash : -1
        });
        // status light + name (mirrored for right-to-left names)
        var dx = padX + dotR;
        var dotX = c.rtl ? p.x + w / 2 - dx * sc : p.x - w / 2 + dx * sc;
        var textX = c.rtl ? p.x - w / 2 + (padX + c.tw / 2) * sc : p.x + w / 2 - (padX + c.tw / 2) * sc;
        var hot = p.flash;
        g.lit(function (ctx, bloom) {
          ctx.beginPath();
          ctx.arc(dotX, p.y, dotR * sc * (bloom ? 2.6 : 1), 0, TAU);
          ctx.fillStyle = g.rgba(bloom ? col : g.mix(g.lighten(col, 0.5), '#FFFFFF', hot), al * (bloom ? 0.9 : 1));
          ctx.fill();
        });
        // the name is laid out at one fixed size and scaled by transform (a new font size every
        // frame would make the browser re-shape the text each time)
        [g.ctx, g.bctx].forEach(function (cc) { cc.save(); cc.translate(textX, p.y); cc.scale(sc, sc); });
        try {
          g.text(c.name, 0, 0, {
            size: chipSize, weight: 700, tracking: -0.01, maxWidth: maxTextW,
            color: '#FFFFFF', alpha: al * (0.65 + 0.35 * p.dk),
            glow: (0.12 + 0.25 * p.dk) * gk, glowColor: col
          });
        } finally { g.ctx.restore(); g.bctx.restore(); }
      }

      // Draw order: back half of the paths, the core, the front half, then every chip back to front.
      // A chip rides on its path, so it always covers the line under it; chips behind the core are
      // clipped by the core's disc so the glass sphere still hides them.
      placed.sort(function (a2, b2) { return a2.z - b2.z; });
      var Rc = cfg.core * Math.max(0, ce) * u;
      function behindCore(fn) {
        if (Rc < 1) return fn();
        [g.ctx, g.bctx].forEach(function (c) {
          c.save();
          c.beginPath();
          c.rect(-g.W, -g.H, 3 * g.W, 3 * g.H);
          c.arc(cx, cy, Rc * 0.985, 0, TAU, true);
          c.clip('evenodd');
        });
        try { fn(); } finally { g.ctx.restore(); g.bctx.restore(); }
      }

      paths(false);

      // ── the core
      if (ce > 0.01) {
        var land = s.seg(0.3, 1.5);
        if (land > 0 && land < 1) g.shockwave(cx, cy, land, { maxR: cfg.core * 4.4, width: 1.6, color: s.color });
        var kick = t >= 0.3 ? Math.exp(-(t - 0.3) * 4) : 0;
        g.orb(cx, cy, Rc / u, { color: s.color, core: 0.55 + 0.12 * breathe + 0.5 * kick + 0.2 * arrivals, rim: 0.92 });
        if (icon) {
          g.icon(icon, cx, cy, Rc / u * 0.92, {
            color: g.mix(g.lighten(s.color, 0.55), '#FFFFFF', g.clamp(0.4 + kick)),
            glowColor: s.color, alpha: g.clamp(ce * 1.4),
            glow: (0.7 + 0.5 * kick) * gk, hot: g.clamp(kick + 0.12)
          });
        }
      }

      paths(true);
      placed.forEach(function (p) {
        var hw = p.c.w * (0.84 + 0.16 * p.dk) / 2 + 2 * u, hh = chipH / 2 + 2 * u;   // + beam/bloom margin
        var nearCore = Math.abs(p.x - cx) < hw + Rc && Math.abs(p.y - cy) < hh + Rc;
        if (p.z < 0 && (nearCore || p.flash > 0.02)) behindCore(function () { drawChip(p); }); else drawChip(p);
      });

      // ── the line
      if (text) {
        var te = s.in(0.5, 0.3);
        if (te > 0) {
          g.text(text, g.cx, capCY + (1 - E.outExpo(te)) * 4 * u, {
            size: cfg.cap, weight: 800, maxWidth: boxW, wrap: true,
            alpha: E.outCubic(g.clamp(te * 1.7)), glow: 0.34 * gk
          });
        }
      }
    }
  });
})();
