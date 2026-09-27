/*
 * Neon Glass Motion — shot "endcard": the logo lockup that closes the film.
 *
 * A dark glass glyph (an app-icon squircle) slams in at the centre of the frame with a white-hot
 * bloom and a shockwave; inside it the brand's monogram (or its logo mark) burns white and cools
 * to the brand colour. The glyph then glides to its place in the lockup while the wordmark arrives:
 *   9:16 and 1:1  glyph above, wordmark below, the letters closing in from wide tracking;
 *   16:9          glyph beside the wordmark, which slides out from behind the glyph's edge
 *                 (mirrored for right-to-left names).
 * A horizon line opens under the lockup, the call to action rises in, and the URL arrives in a
 * glass pill with a specular pass. Then a long, breathing hold: this is the last image of the film.
 *
 * Logo handling (film.brand.logo, embedded by build.py): a square-ish logo (aspect <= 1.6) becomes
 * the mark inside the glass glyph, next to the name; a wide logo (a wordmark) replaces the typed
 * name and is revealed by a sweep of light, without a glyph. No logo: the monogram is the mark.
 *
 * Params: cta (optional, <= 5 words), url (optional, defaults to film.brand.url).
 * Positions are pixels; sizes handed to g.* helpers are units (g.u = min(W, H) / 100).
 * Output depends only on (g, s).
 */
(function () {
  'use strict';

  var RTL = /[֐-ࣿיִ-﷿ﹰ-﻿]/;
  var WHITE = '#FFFFFF';

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
  function cleanUrl(v) {
    return clean(v).replace(/^[a-z][a-z0-9+.-]*:\/\//i, '').replace(/\/+$/, '');
  }
  function merge(a, b) {
    var o = {}, k;
    for (k in a) o[k] = a[k];
    for (k in b) o[k] = b[k];
    return o;
  }

  // Run draw() with the same extra transform / clip on the main and the bloom layer.
  function layer(g, setup, draw) {
    g.ctx.save(); g.bctx.save();
    try { setup(g.ctx); setup(g.bctx); draw(); } finally { g.ctx.restore(); g.bctx.restore(); }
  }
  function about(x, y, k) {
    return function (c) { c.translate(x, y); c.scale(k, k); c.translate(-x, -y); };
  }

  function rr(c, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.arcTo(x + w, y, x + w, y + r, r);
    c.lineTo(x + w, y + h - r);
    c.arcTo(x + w, y + h, x + w - r, y + h, r);
    c.lineTo(x + r, y + h);
    c.arcTo(x, y + h, x, y + h - r, r);
    c.lineTo(x, y + r);
    c.arcTo(x, y, x + r, y, r);
    c.closePath();
  }

  // First user-perceived character of the name, upper-cased where the script has case.
  function monogram(g, name) {
    var ch = g.graphemes(name.replace(/^[^\p{L}\p{N}]+/u, ''))[0] || g.graphemes(name)[0] || '';
    var up = ch.toUpperCase();
    return up.length === ch.length ? up : ch;
  }

  NGM.shot('endcard', {
    draw: function (g, s) {
      var u = g.u, E = g.ease, b = s.beat, t = s.t, D = s.dur, asp = g.aspect;
      var gk = 0.6 + 0.8 * s.energy;
      var brand = (s.film && s.film.brand) || {};
      var name = clean(brand.name);
      var cta = clean(b.cta);
      var url = cleanUrl(b.url != null && clean(b.url) ? b.url : brand.url);
      var L = s.logoInfo && s.logoInfo.img && s.logoInfo.aspect > 0 ? s.logoInfo : null;
      var mode = L ? (L.aspect > 1.6 ? 'wide' : 'mark') : (name ? 'mono' : 'icon');
      var hasWord = !!name && mode !== 'wide';
      var rtl = RTL.test(name);
      var C = s.color, C2 = s.color2;
      var box = fitBox(g, s);
      var P = asp === 'portrait', SQ = asp === 'square', LAND = asp === 'landscape';
      var horiz = LAND && hasWord && mode !== 'icon';
      var k = g.clamp(D / 3.4, 0.68, 1);              // short endcards run the same moves faster

      // ── measure every piece
      var wordO = null, wordM = null, T = 0;
      if (hasWord) {
        var wsz = horiz ? 19 : P ? 15 : 12.5;
        wordO = { size: wsz, weight: 800, tracking: rtl ? 0 : -0.03, lineHeight: rtl ? 1.3 : 1.04 };
        for (var pass = 0; pass < 3; pass++) {
          wordM = g.measure(name, wordO);
          T = horiz ? wordM.size * 0.727 * 1.7 : (P ? 30 : SQ ? 22 : 24) * u;
          var room = horiz ? box.w * 0.96 - T * 1.3 : box.w * 0.96;
          if (wordM.w <= room) break;
          var f = room / wordM.w;
          if (!horiz && f < 0.62 && /\s/.test(name) && !wordO.wrap) {
            wordO.wrap = 2;
            wordO.maxWidth = room;
            wordO.size = wsz * 0.8;
          } else {
            wordO.size *= f * 0.995;
          }
        }
        wordM = g.measure(name, wordO);
      } else {
        T = mode === 'wide' ? 0 : (P ? 36 : SQ ? 28 : 30) * u;
      }
      var logoH = 0, logoW = 0;
      if (mode === 'wide') {
        logoH = (P ? 15 : SQ ? 13 : 18) * u;
        logoW = logoH * L.aspect;
        var lmax = box.w * (P ? 0.9 : SQ ? 0.84 : 0.7);
        if (logoW > lmax) { logoW = lmax; logoH = logoW / L.aspect; }
      }
      var ctaO = null, ctaM = null;
      var ctaAr = RTL.test(cta);
      if (cta) {
        ctaO = { size: LAND ? 6.8 : P ? 6.6 : 5.6, weight: 700, tracking: ctaAr ? 0 : -0.01, lineHeight: ctaAr ? 1.4 : 1.12, maxWidth: box.w * 0.92, wrap: true };
        ctaM = g.measure(cta, ctaO);
      }
      var urlO = null, urlM = null, pillH = 0, pillW = 0, arrowS = 0;
      if (url) {
        urlO = { size: LAND ? 4.8 : P ? 4.6 : 4.1, weight: 600, tracking: 0, maxWidth: box.w * 0.72 };
        urlM = g.measure(url, urlO);
        pillH = urlM.size * 2.5;
        arrowS = urlM.size * 0.95;
        pillW = urlM.w + pillH * 0.95 + arrowS + urlM.size * 0.55;
      }

      // ── stack the pieces, centred as one block
      var g1 = (P ? 7.5 : 5.5) * u, g2 = (P ? 7 : 5.5) * u, g3 = (P ? 5 : 4) * u;
      var rows = [];
      // descenders (and Arabic tails) hang below the cap block: keep them clear of what follows
      var wordDesc = wordM ? wordM.descent * (rtl ? 0.85 : 0.3) : 0;
      if (horiz) rows.push({ id: 'lock', h: Math.max(T, wordM.h + 2 * wordDesc) });
      else {
        if (mode !== 'wide') rows.push({ id: 'glyph', h: T });
        if (hasWord) rows.push({ id: 'word', h: wordM.h + wordDesc, gapBefore: g1 });
        if (mode === 'wide') rows.push({ id: 'logo', h: logoH });
      }
      if (cta) rows.push({ id: 'cta', h: ctaM.h + ctaM.descent * (ctaAr ? 0.85 : 0.3), gapBefore: horiz ? 7 * u : g2 });
      if (url) rows.push({ id: 'url', h: pillH, gapBefore: cta ? g3 : (horiz ? 7 * u : g2) });
      var total = 0;
      rows.forEach(function (r, i) { total += r.h + (i ? r.gapBefore || g1 : 0); });
      var y = g.cy - total / 2, pos = {};
      rows.forEach(function (r, i) {
        if (i) y += r.gapBefore || g1;
        pos[r.id] = { top: y, cy: y + r.h / 2, bottom: y + r.h };
        y += r.h;
      });

      // glyph and wordmark final places
      var gxF = g.cx, gyF = pos.glyph ? pos.glyph.cy : 0, wordX = g.cx, wordY = 0, lockW = 0, dir = rtl ? -1 : 1;
      if (horiz) {
        var gapGW = T * 0.3;
        lockW = T + gapGW + wordM.w;
        var left0 = g.cx - lockW / 2;
        gyF = pos.lock.cy;
        gxF = rtl ? left0 + lockW - T / 2 : left0 + T / 2;
        wordX = rtl ? left0 + wordM.w : left0 + T + gapGW;
        wordY = pos.lock.cy - (rtl ? wordDesc * 0.5 : 0);   // centre what the eye sees, tails included
      } else if (hasWord) {
        wordY = pos.word.top + wordM.h / 2;
      }

      // ── timing
      var flash = Math.exp(-t * 4.2);
      var land = s.in(0.55 * k);
      var slide = mode === 'wide' ? 1 : E.outExpo(s.seg(0.42 * k, 1.2 * k));
      var settle = E.outCubic(s.seg(0.6 * k, 1.6 * k));
      var breathe = 1 + 0.06 * Math.sin(t * 2.2);
      var exitK = 0.9 + 0.1 * s.out(0.25);
      var gx = g.lerp(g.cx, gxF, slide), gy = g.lerp(g.cy, gyF, slide);
      if (!rows.length) return;

      // ── light behind everything, dust
      g.backlight(g.cx, g.cy, 62, { color: C, alpha: (0.04 + 0.07 * settle) * gk * breathe * exitK });
      var dust = Math.round(50 * s.density);
      if (dust > 0) {
        g.particles(61 + s.index * 5, dust, {
          color: g.mix(C, C2, 0.35), size: 0.2, alpha: 0.5 * g.clamp(s.in(0.8, 0.3)),
          area: { x: g.safe.x, y: g.cy - total / 2 - 18 * u, w: g.safe.w, h: total + 36 * u }
        });
      }

      // ── the glass glyph
      if (mode !== 'wide' && T > 0) {
        var gsc = 0.55 + 0.45 * E.outBack(land, 1.6);
        var ga = g.clamp(s.in(0.1));
        g.backlight(gx, gy, T / u * 1.5, { color: C, alpha: (0.12 + 0.9 * flash + 0.05 * breathe) * gk * exitK });
        g.shockwave(gx, gy, s.seg(0.05, 0.05 + 1.1 * k), { maxR: T / u * 2.6, width: 1.6, color: C });
        var shine = -1, sh1 = s.seg(0.05, 0.75 * k), h0 = Math.max(1.8 * k, D * 0.56), sh2 = s.seg(h0, h0 + 1);
        if (sh1 > 0 && sh1 < 1) shine = E.inOutQuad(sh1);
        else if (h0 + 1 < D - 0.05 && sh2 > 0 && sh2 < 1) shine = E.inOutQuad(sh2);
        layer(g, about(gx, gy, gsc), function () {
          var gxl = gx - T / 2, gyl = gy - T / 2, r = T * 0.25;
          g.glass(gxl, gyl, T, T, {
            r: r / u, color: C, rim: 0.95, depth: 0.75, tint: 0.1, shine: shine, alpha: ga,
            glow: (0.35 + 0.7 * flash) * gk * breathe * exitK
          });
          // light living inside the glass
          g.ctx.save();
          rr(g.ctx, gxl, gyl, T, T, r);
          g.ctx.clip();
          g.ctx.globalCompositeOperation = 'lighter';
          var ig = g.ctx.createRadialGradient(gx, gy + T * 0.08, 0, gx, gy + T * 0.08, T * 0.62);
          ig.addColorStop(0, g.rgba(C, (0.2 + 0.4 * flash) * ga));
          ig.addColorStop(1, g.rgba(C, 0));
          g.ctx.fillStyle = ig;
          g.ctx.fillRect(gxl, gyl, T, T);
          g.ctx.restore();
          g.backlight(gx, gy, T / u * 0.42, { color: C, alpha: 0.32 * gk * ga });
          var heat = g.clamp(flash * 1.2);
          if (mode === 'mark') {
            g.logo(gx, gy, T * 0.56 / u, { maxWidth: T * 0.64, alpha: ga, glow: Math.min(1, 0.3 + 0.6 * flash) });
          } else if (mode === 'icon') {
            g.icon('sparkle', gx, gy, T * 0.52 / u, {
              color: g.mix(g.lighten(C, 0.35), WHITE, heat), glowColor: C, alpha: ga,
              glow: (0.8 + 0.8 * flash) * gk, hot: heat
            });
          } else {
            g.text(monogram(g, name), gx, gy - (rtl ? T * 0.07 : 0), {
              size: T * 0.56 / u, weight: 800, tracking: 0, color: g.mix(g.lighten(C, 0.4), WHITE, heat),
              alpha: ga, glow: Math.min(2, (0.75 + 1.1 * flash) * gk * breathe), glowColor: g.mix(C, WHITE, 0.5 * flash)
            });
          }
        });
      }

      // ── the wordmark
      var wordBottom = 0, wordW = 0;
      if (hasWord) {
        wordW = wordM.w;
        var w0 = horiz ? 0.4 * k : 0.5 * k;
        var wf = t > w0 ? Math.exp(-(t - w0) * 3.2) : 0;
        var wa = E.outCubic(s.seg(w0, w0 + 0.4 * k));
        var wglow = Math.min(2, (0.45 + 1.1 * wf) * gk * breathe * exitK);
        var wo = merge(wordO, { color: WHITE, alpha: wa, glow: wglow, glowColor: g.mix(C, WHITE, 0.5 * wf) });
        if (wa > 0.001) {
          if (horiz) {
            // slides out from behind the glyph's edge: hidden behind it at first, travelling
            // the other way as the glyph moves over to make room
            var sl = lockW / 2 - T / 2 + T * 0.1;
            var edge = gx + dir * (T / 2 + T * 0.3 * 0.25);
            layer(g, function (c) {
              c.beginPath();
              if (dir > 0) c.rect(edge, 0, g.W * 2, g.H);
              else c.rect(-g.W, 0, edge + g.W, g.H);
              c.clip();
            }, function () {
              g.text(name, wordX - dir * (1 - slide) * sl, wordY, merge(wo, { align: rtl ? 'right' : 'left' }));
            });
          } else if (rtl) {
            var ws = 1 + 0.06 * (1 - E.outExpo(s.seg(w0, w0 + 0.9 * k)));
            layer(g, about(wordX, wordY, ws), function () {
              g.text(name, wordX, wordY + (1 - E.outExpo(s.seg(w0, w0 + 0.8 * k))) * 2 * u, wo);
            });
          } else {
            // letters close in from wide tracking
            var tr = E.outExpo(s.seg(w0, w0 + 1.0 * k));
            var trk = g.lerp(0.14, wordO.tracking, tr);
            var tw = merge(wo, { tracking: trk });
            delete tw.maxWidth;
            if (!wordO.wrap) g.text(name, wordX, wordY, tw);
            else g.text(name, wordX, wordY, merge(wo, {}));
          }
        }
        wordBottom = horiz ? pos.lock.bottom : pos.word.bottom;
      }

      // ── a wide logo instead of the typed name
      if (mode === 'wide') {
        var la = E.outCubic(s.seg(0, 0.5 * k));
        var lsc = 0.92 + 0.08 * E.outExpo(s.in(0.9 * k));
        var lcy = pos.logo.cy;
        g.backlight(g.cx, lcy, Math.max(logoW, logoH) / u * 0.7, { color: C, alpha: (0.1 + 0.6 * flash + 0.05 * breathe) * gk * exitK });
        g.shockwave(g.cx, lcy, s.seg(0.05, 0.05 + 1.1 * k), { maxR: logoW / u * 0.9, width: 1.4, color: C });
        layer(g, about(g.cx, lcy, lsc), function () {
          g.logo(g.cx, lcy, logoH / u, { maxWidth: logoW, alpha: la, glow: Math.min(1, (0.3 + 0.7 * flash) * breathe) });
        });
        var lsw = s.seg(0.25 * k, 1.1 * k);
        if (lsw > 0 && lsw < 1) {
          g.sweep(E.inOutQuad(lsw), { x: g.cx - logoW / 2 - 4 * u, y: lcy - logoH / 2 - 4 * u, w: logoW + 8 * u, h: logoH + 8 * u,
            color: g.lighten(C, 0.2), angle: 20, width: 14, alpha: 0.8 });
        }
        wordW = logoW;
        wordBottom = pos.logo.bottom;
      }

      // ── horizon line under the lockup
      var anchorBottom = wordBottom || (pos.glyph ? pos.glyph.bottom : 0);
      var nextTop = pos.cta ? pos.cta.top : pos.url ? pos.url.top : 0;
      if (anchorBottom && nextTop > anchorBottom) {
        var hb = E.outExpo(s.seg(0.8 * k, 1.6 * k));
        if (hb > 0.002) {
          var hy = anchorBottom + (nextTop - anchorBottom) * 0.48;
          var half = Math.min(box.w * 0.42, Math.max(horiz ? lockW : wordW, T) * 0.62) * hb;
          g.beam(g.cx - half, hy, g.cx + half, hy, { color: C2, width: 0.26, alpha: 0.5 * (0.4 + 0.6 * s.density) * exitK });
        }
      }

      // ── call to action
      if (cta) {
        var ce = s.in(0.55 * k, 1.0 * k);
        if (ce > 0) {
          g.text(cta, g.cx, pos.cta.top + ctaM.h / 2 + (1 - E.outExpo(ce)) * 3 * u, merge(ctaO, {
            color: g.mix(WHITE, C, 0.12), alpha: E.outCubic(g.clamp(ce * 1.6)), glow: 0.3 * gk * exitK
          }));
        }
      }

      // ── URL in a glass pill with an arrow
      if (url) {
        var pe = s.in(0.55 * k, 1.2 * k);
        if (pe > 0) {
          var pcy = pos.url.cy, psc = 0.9 + 0.1 * E.outBack(pe, 1.6), pa = E.outCubic(g.clamp(pe * 1.8));
          var psh = s.seg(1.35 * k, 2.2 * k);
          layer(g, about(g.cx, pcy, psc), function () {
            var px = g.cx - pillW / 2;
            g.glass(px, pcy - pillH / 2, pillW, pillH, {
              r: pillH / 2 / u, color: C, rim: 0.8, depth: 0.6, tint: 0.1, alpha: pa,
              shine: psh > 0 && psh < 1 ? E.inOutQuad(psh) : -1, glow: 0.3 * gk * exitK
            });
            var tx = px + pillH * 0.48;
            g.text(url, tx, pcy, merge(urlO, { align: 'left', color: WHITE, alpha: 0.95 * pa, glow: 0.2 * gk }));
            g.icon('arrow', px + pillW - pillH * 0.48 - arrowS / 2, pcy, arrowS / u, {
              color: g.lighten(C, 0.35), glowColor: C, alpha: pa, glow: 0.6 * gk, width: arrowS * 0.11 / u
            });
          });
        }
      }
    }
  });
})();
