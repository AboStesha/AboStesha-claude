/*
 * Neon Glass Motion — shot "rings"
 *
 * The signal moment. Two rings converge on an empty point, a dark glass orb lands there with a
 * white-hot core flash and a shockwave (the downbeat), then the orb keeps pulsing: every beat of
 * the pulse sends a ring of light outward in a wave. Thin instrument arcs turn slowly around it.
 * One line of text sits under the orb.
 *
 *   text (optional)  the line under the orb
 *   icon (optional)  icon drawn inside the orb
 *
 * Positions are pixels, sizes are units (g.u = min(W, H) / 100). Output depends only on (g, s).
 */
(function () {
  'use strict';

  var DOWNBEAT = 0.4;     // s: the orb lands and the shockwave fires
  var PERIOD = 0.92;      // s between pulses
  var LIFE = 2.7;         // s a wave takes to travel out and fade

  NGM.shot('rings', {
    draw: function (g, s) {
      var u = g.u, S = g.safe, E = g.ease, b = s.beat, t = s.t;
      var asp = g.aspect, portrait = asp === 'portrait';
      var gk = 0.6 + 0.8 * s.energy;
      var hue = 0.25 + 0.4 * s.energy;               // colour movement between alternate waves
      var text = b.text != null ? String(b.text).trim() : '';
      var icon = typeof b.icon === 'string' && b.icon.trim() ? b.icon.trim() : '';

      // ── layout: orb, then the line under it; the block is centred in the safe box
      var boxW = S.w * 0.93;
      var R = text ? (portrait ? 17 : 13.5) : (portrait ? 21 : 17);        // orb radius, units
      var capSize = portrait ? 10 : 8.6;
      var capM = text ? g.measure(text, { size: capSize, weight: 800, maxWidth: boxW, wrap: true }) : null;
      var capGap = text ? (R * 1.05 + (portrait ? 4 : 2.5)) * u : 0;     // orb edge → text top
      var capH = capM ? capM.h : 0;
      var blockH = 2 * R * u + capGap + capH;
      var oy = g.cy - blockH / 2 + R * u - (text ? 0.5 * u : 0);
      var ox = g.cx;
      var capCY = oy + R * u + capGap + capH / 2;
      var reach = Math.hypot(g.W, g.H) / 2 / u * 0.95;                    // waves travel this far (units)

      // ── pulse clock
      var tb = t - DOWNBEAT;                                              // time since the downbeat
      var landed = tb >= 0;
      var kNow = landed ? Math.floor(tb / PERIOD) : -1;                   // index of the latest pulse
      var sincePulse = landed ? tb - kNow * PERIOD : 99;
      var pulse = landed ? Math.exp(-sincePulse * 6) : 0;
      var impact = landed ? Math.exp(-tb * 4.2) : 0;                      // the downbeat flash, decays
      // the orb charges up small while the rings converge, then pops to full size on the downbeat
      var oe = landed ? 0.62 + 0.38 * E.outBack(g.clamp(tb / 0.32), 2.4)
        : 0.62 * E.outCubic(g.clamp(t / DOWNBEAT));
      var Rd = R * Math.max(0, oe) * (1 + 0.035 * pulse);

      // ── light pool behind the orb
      g.backlight(ox, oy, R * 3.3, {
        color: s.color,
        alpha: (0.2 + 0.22 * pulse + 0.55 * impact) * gk * g.clamp(oe * 1.5)
      });

      // ── dust
      var dust = Math.round(55 * s.density);
      if (dust > 0) g.particles(29 + s.index * 5, dust, { color: s.color2, size: 0.22, alpha: 0.5 });

      // ── anticipation: two rings converge on the point where the orb will land
      if (t < DOWNBEAT) {
        var a = t / DOWNBEAT, ci = E.inQuad(a);
        g.ring(ox, oy, R * (3.4 - 2.4 * ci), { width: 0.3, color: s.color, alpha: 0.2 + 0.7 * a, glow: 0.9 * gk });
        g.ring(ox, oy, R * (2.4 - 1.5 * ci), { width: 0.2, color: s.color2, alpha: 0.15 + 0.6 * a, glow: 0.7 * gk });
      }

      // ── waves: one per pulse, travelling outward and thinning
      if (landed) {
        var follower = s.density >= 0.4;
        for (var k = Math.max(0, kNow - Math.ceil(LIFE / PERIOD)); k <= kNow; k++) {
          var age = tb - k * PERIOD;
          if (age < 0 || age >= LIFE) continue;
          var p = age / LIFE;
          var rr = R * 1.02 + (reach - R) * (0.72 * p + 0.28 * E.outCubic(p));
          var wa = Math.pow(1 - p, 1.8) * (k === 0 ? 1 : 0.8);
          var wc = k % 2 ? g.mix(s.color, s.color2, hue) : s.color;
          g.ring(ox, oy, rr, { width: 0.55 * (1 - 0.55 * p), color: wc, alpha: wa, glow: 0.85 * gk });
          if (follower && age > 0.1) g.ring(ox, oy, rr * 0.93, { width: 0.22 * (1 - 0.5 * p), color: wc, alpha: wa * 0.45, glow: 0.4 * gk });
        }
        // the downbeat shockwave
        g.shockwave(ox, oy, g.clamp(tb / 1.25), { maxR: R * 4.4, width: 2.3, color: s.color, alpha: Math.min(1, 0.7 + 0.3 * gk) });
      }

      // ── instrument arcs turning slowly around the orb (fewer when density is low)
      var arcs = s.density < 0.3 ? 0 : s.density < 0.62 ? 1 : 2;
      var SEGS = [[0.02, 0.2], [0.29, 0.1], [0.46, 0.27], [0.8, 0.08]];
      for (var j = 0; j < arcs; j++) {
        var ar = R * (1.4 + 0.34 * j);
        var draw = E.outExpo(s.in(0.8, DOWNBEAT + 0.05 + j * 0.12));
        if (draw <= 0) continue;
        var rot = (j % 2 ? -1 : 1) * t * 0.035 + j * 0.13;
        for (var q = 0; q < SEGS.length; q++) {
          var from = rot + SEGS[q][0];
          g.ring(ox, oy, ar, {
            from: from, to: from + SEGS[q][1] * draw,
            width: j ? 0.14 : 0.18, color: j ? s.color2 : s.color,
            alpha: (0.38 + 0.25 * pulse) * (j ? 0.75 : 1), glow: 0.35 * gk
          });
        }
      }

      // ── the orb
      if (Rd > 0.2) {
        var charge = landed ? 0 : E.inQuad(g.clamp(t / DOWNBEAT));        // light building before the hit
        g.orb(ox, oy, Rd, { color: s.color, core: 0.45 + 0.35 * pulse + 0.7 * impact + 0.45 * charge, rim: 0.92 });
        if (icon) {
          g.icon(icon, ox, oy, Rd * 0.92, {
            color: g.mix(g.lighten(s.color, 0.55), '#FFFFFF', g.clamp(0.4 + impact)),
            glowColor: s.color, alpha: g.clamp(oe * 1.4),
            glow: (0.65 + 0.3 * pulse + 0.6 * impact) * gk,
            hot: g.clamp(impact * 1.1 + 0.15 * pulse)
          });
        }
      }

      // ── the line
      if (text) {
        var ce = s.in(0.5, DOWNBEAT - 0.08);
        if (ce > 0) {
          g.text(text, g.cx, capCY + (1 - E.outExpo(ce)) * 4 * u, {
            size: capSize, weight: 800, maxWidth: boxW, wrap: true,
            alpha: E.outCubic(g.clamp(ce * 1.7)),
            glow: (0.34 + 0.12 * pulse) * gk
          });
        }
      }
    }
  });
})();
