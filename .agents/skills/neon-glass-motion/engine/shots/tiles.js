/*
 * Neon Glass Motion — shot "tiles"
 *
 * A grid of dark matte glass icon tiles. They arrive fast and dark, then light up one after another:
 * the icon flashes white-hot and cools to its colour, the rim catches light, a squircle shockwave
 * leaves the tile and a pool of light swells behind it. When every tile is lit, a specular sweep
 * crosses the set and the whole grid glows together. Optional caption under the grid.
 *
 *   icons  (required)  3–6 icon names from NGM.icons (up to 8 are tolerated)
 *   labels (optional)  one short label per tile, drawn inside the tile
 *   text   (optional)  caption under the grid
 *
 * Positions are pixels, sizes are units (g.u = min(W, H) / 100). Output depends only on (g, s).
 */
(function () {
  'use strict';

  // Row lengths (top to bottom) per aspect and tile count.
  var LAYOUT = {
    portrait:  { 1: [1], 2: [2], 3: [3], 4: [2, 2], 5: [2, 1, 2], 6: [2, 2, 2], 7: [3, 1, 3], 8: [3, 2, 3] },
    square:    { 1: [1], 2: [2], 3: [3], 4: [2, 2], 5: [3, 2], 6: [3, 3], 7: [4, 3], 8: [4, 4] },
    landscape: { 1: [1], 2: [2], 3: [3], 4: [4], 5: [3, 2], 6: [3, 3], 7: [4, 3], 8: [4, 4] }
  };
  var MAX_TILE = { portrait: 31, square: 25, landscape: 30 };      // units, one or two rows
  var MAX_TILE3 = { portrait: 26, square: 20, landscape: 21 };     // units, three rows
  var CAPTION = { portrait: 10, square: 8.4, landscape: 8.4 };     // units
  var GAP = 0.17;                                                  // tile gap, fraction of tile size
  var RTL = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;           // Hebrew / Arabic scripts

  function list(v) {
    if (typeof v === 'string') v = [v];
    return Array.isArray(v) ? v : [];
  }

  NGM.shot('tiles', {
    draw: function (g, s) {
      var u = g.u, S = g.safe, E = g.ease, b = s.beat, t = s.t, D = s.dur;
      var asp = g.aspect;
      var gk = 0.6 + 0.8 * s.energy;                 // glow strength follows energy
      var hue = 0.22 + 0.33 * s.energy;              // how far the tiles travel toward the next colour

      var icons = list(b.icons).map(function (x) { return x == null ? '' : String(x).trim(); })
        .filter(Boolean).slice(0, 8);
      if (!icons.length) icons = ['sparkle', 'bolt', 'check'];
      var n = icons.length;
      var labels = list(b.labels).map(function (x) { return x == null ? '' : String(x).trim(); });
      var hasLabels = labels.slice(0, n).some(Boolean);
      var caption = b.text != null ? String(b.text).trim() : '';
      // right-to-left copy reads (and lights) from the top-right tile
      var dir = RTL.test(caption + ' ' + labels.join(' ')) ? -1 : 1;

      // ── layout: caption under a centred grid, the whole block centred in the safe box
      var boxW = S.w * 0.94;                         // headroom for the camera push
      var capSize = CAPTION[asp] || 8.4;
      var capM = caption ? g.measure(caption, { size: capSize, weight: 800, maxWidth: boxW, wrap: true }) : null;
      var capGap = caption ? (asp === 'portrait' ? 10 : 7.5) * u : 0;
      var capH = capM ? capM.h : 0;

      var rows = (LAYOUT[asp] || LAYOUT.square)[n] || [Math.ceil(n / 2), n - Math.ceil(n / 2)];
      var cols = Math.max.apply(null, rows), nr = rows.length;
      var availH = S.h * 0.94 - capH - capGap;
      var T = Math.min(((nr > 2 ? MAX_TILE3 : MAX_TILE)[asp] || 24) * u,
        boxW / (cols + (cols - 1) * GAP),
        availH / (nr + (nr - 1) * GAP));
      var gap = T * GAP;
      var gridW = cols * T + (cols - 1) * gap;
      var gridH = nr * T + (nr - 1) * gap;
      var blockH = gridH + capGap + capH;
      var top = g.cy - blockH / 2 - 0.8 * u;
      var gridCY = top + gridH / 2;
      var capCY = top + gridH + capGap + capH / 2;

      // ── timing
      var stag = Math.min(0.055, 0.3 / n);           // entrance stagger
      var lightStart = 0.34;
      var step = g.clamp((D * 0.56 - lightStart) / n, 0.15, 0.42);
      var tLast = lightStart + (n - 1) * step;        // the last tile lights here
      var tSweep = tLast + 0.32;
      var allLit = E.outCubic(s.seg(tLast, tLast + 0.7));

      // ── light behind the set + dust
      // one pool behind the set, kept compact so the black around it stays black
      var poolR = Math.min(Math.max(gridW, gridH) / u * 0.62, 52);
      g.backlight(g.cx, gridCY, poolR, { color: s.color, alpha: (0.09 + 0.17 * allLit) * gk * E.outCubic(s.in(0.5)) });
      var dust = Math.round(42 * s.density);
      if (dust > 0) {
        g.particles(17 + s.index * 3, dust, {
          color: s.color2, size: 0.2, alpha: 0.5,
          area: { x: S.x, y: gridCY - gridH / 2 - 14 * u, w: S.w, h: gridH + 28 * u }
        });
      }

      // ── tiles
      var i = 0;
      for (var r = 0; r < nr; r++) {
        for (var j = 0; j < rows[r]; j++, i++) {
          var x = g.cx + dir * (j - (rows[r] - 1) / 2) * (T + gap);
          var y = gridCY - gridH / 2 + r * (T + gap) + T / 2;
          var col = n > 1 ? g.mix(s.color, s.color2, hue * i / (n - 1)) : s.color;

          var ein = s.in(0.5, 0.04 + i * stag);
          if (ein <= 0) continue;
          var alpha = g.clamp(ein * 2.4);
          var sc = 0.84 + 0.16 * E.outBack(ein, 1.25);
          y += (1 - E.outExpo(ein)) * 6 * u;

          var lp = t - (lightStart + i * step);        // seconds since this tile lit
          var lit = lp >= 0 ? E.outCubic(g.clamp(lp / 0.08)) : 0;
          var flash = lp >= 0 ? Math.exp(-lp * 4.6) : 0;
          var TS = T * sc, tx = x - TS / 2, ty = y - TS / 2;
          var rU = TS / u * 0.235;

          // specular: a quick one as the tile lights, then the collective sweep once all are lit
          var shine = -1;
          if (lp >= 0 && lp < 0.6) shine = lp / 0.6;
          var sw0 = Math.max(tSweep + j * 0.07 + r * 0.05, lightStart + i * step + 0.6);   // never cut the first shine short
          var sw = s.seg(sw0, sw0 + 0.85);
          if (sw > 0 && sw < 1) shine = sw;

          g.backlight(x, y, TS / u * 0.95, { color: col, alpha: (0.05 + 0.13 * lit + 0.55 * flash + 0.08 * allLit) * gk * alpha });
          g.glass(tx, ty, TS, TS, {
            r: rU, color: col, alpha: alpha, depth: 0.65, shine: shine,
            rim: g.clamp(0.2 + 0.6 * lit + 0.2 * flash + 0.08 * allLit),
            glow: (0.03 + 0.3 * lit + 0.65 * flash + 0.12 * allLit) * gk,
            tint: 0.045 + 0.07 * lit
          });

          // squircle shockwave leaving the tile as it lights
          if (lp > 0 && lp < 0.75) {
            var q = lp / 0.75, grow = E.outCubic(q) * 5 * u, wa = Math.pow(1 - q, 1.7) * 0.9 * alpha * Math.min(1, gk);
            g.lit(function (c, bloom) {
              g.roundRect(tx - grow, ty - grow, TS + 2 * grow, TS + 2 * grow, rU + grow / u, c);
              c.strokeStyle = g.rgba(bloom ? col : g.lighten(col, 0.35), wa);
              c.lineWidth = (bloom ? 0.8 : 0.24) * u * (1 - 0.5 * q);
              c.stroke();
            });
          }

          // icon (+ label inside the tile)
          var label = hasLabels ? (labels[i] || '') : '';
          var iconSize = (hasLabels ? 0.4 : 0.47) * TS / u;
          var iy = hasLabels ? y - TS * 0.085 : y;
          var iconCol = lit > 0 ? g.mix(g.lighten(col, 0.3), '#FFFFFF', g.clamp(0.25 + flash)) : col;
          g.icon(icons[i], x, iy, iconSize, {
            color: iconCol, glowColor: col,
            alpha: alpha * (0.32 + 0.68 * lit),
            glow: (0.12 + 0.5 * lit + 0.9 * flash) * gk,
            hot: flash * 0.9
          });
          if (label) {
            // laid out at the settled size and scaled by transform, so the entrance does not
            // re-shape the text at a new font size every frame
            var ly = y + TS * 0.305;
            [g.ctx, g.bctx].forEach(function (cc) { cc.save(); cc.translate(x, ly); cc.scale(sc, sc); });
            try {
              g.text(label, 0, 0, {
                size: g.clamp(T / u * 0.135, 2.6, 4.4), weight: 700, tracking: -0.01, lineHeight: 1.05,
                color: '#FFFFFF', alpha: alpha * (0.34 + 0.6 * lit), maxWidth: T * 0.84, wrap: true,
                glow: 0.22 * lit * gk, glowColor: col
              });
            } finally { g.ctx.restore(); g.bctx.restore(); }
          }
        }
      }

      // ── caption
      if (caption) {
        var ce = s.in(0.5, 0.2);
        if (ce > 0) {
          g.text(caption, g.cx, capCY + (1 - E.outExpo(ce)) * 4 * u, {
            size: capSize, weight: 800, maxWidth: boxW, wrap: true,
            alpha: E.outCubic(g.clamp(ce * 1.7)),
            glow: (0.3 + 0.25 * allLit) * gk
          });
        }
      }
    }
  });
})();
