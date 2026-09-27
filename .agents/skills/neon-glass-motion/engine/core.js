/*!
 * Neon Glass Motion — engine core (window.NGM)
 *
 * Paints a film frame by frame onto one <canvas>: pure black, light as the subject, dark matte glass,
 * a neon spectrum that travels from cool to warm across the beats, soft bloom, hard cuts.
 *
 * Shots register with NGM.shot(name, { draw(g, s) { ... } }) and draw ONE frame from (g, s) only:
 * no Math.random, no Date, no state kept between frames. Core owns clearing, camera, bloom and cuts.
 *
 * Units: g.u = min(W, H) / 100. Positions (x, y) and rectangles (x, y, w, h, g.safe, maxWidth, area) are
 * in PIXELS. Every size-like value — radii (r, maxR), icon/text size, stroke widths, corner radius o.r,
 * particle size, beam/sweep width, logo height — is in UNITS.
 *
 * Quick reference (full contract in the skill's build notes):
 *   s: t dur p frame index count beat color color2 brand accent energy density temperature film fps
 *      isFirst isLast id hash logo camera · in(sec, delay) out(sec) seg(a, b)
 *   g: ctx bctx W H cx cy u min max aspect safe color color2 cam fonts t
 *      lit(fn(ctx, isBloom))    draw on main + bloom; helpers called inside lit draw only the current target
 *      screen(fn)               draw ignoring the camera move
 *      text(str, x, y, o) -> {w, h, size, lines[], lineCount, widths[], x, top, bottom, baseline, lineHeight, rtl}
 *          o: size weight font('display'|'mono') align baseline('middle'|'top'|'bottom'|'alphabetic') color alpha
 *             tracking(em) maxWidth(px, shrinks) wrap(true|n lines, needs maxWidth) glow(0..2) glowColor lineHeight
 *          white text glows in the beat colour; Arabic switches font + RTL automatically
 *      measure(str, o)          same layout, no drawing
 *      graphemes(str)           user-perceived characters (for typing effects)
 *      roundRect(x, y, w, h, r, [ctx])   path only, r in units
 *      glass(x, y, w, h, o)     o: r rim shine(0..1 | -1) depth glow color tint alpha
 *      orb(x, y, r, o)          o: color core rim alpha
 *      ring(x, y, r, o)         o: width color alpha glow from to (0..1 arc, starts at 12 o'clock)
 *      shockwave(x, y, p, o)    o: maxR width color alpha
 *      backlight(x, y, r, o)    o: color alpha         (bloom only: light behind things)
 *      beam(x1, y1, x2, y2, o)  o: color width alpha fade(true)
 *      sweep(p, o)              o: x y w h color angle(deg) width alpha
 *      particles(seed, n, o)    o: color area{x,y,w,h} size alpha t speed
 *      icon(name, x, y, size, o) o: color width alpha glow glowColor hot(0..1 white core)   names: NGM.icons
 *      logo(x, y, h, o)         brand logo image if the film has one, else null. o: alpha glow align maxWidth
 *      rgba mix lighten hsl clamp lerp map smooth ease rand noise
 */
(function ngmCore() {
  'use strict';

  var VERSION = '1.0.0';
  var root = typeof window !== 'undefined' ? window : this;
  var NGM = root.NGM = root.NGM || {};
  var doc = root.document;

  // Code is part of every beat hash, so cached frames never go stale after an engine edit.
  // Core hashes its own <script> (which, in a single-script build, also holds every shot);
  // each shot hashes the <script> it was registered from (build.py gives every file its own).
  var CORE_SCRIPT = null, ENGINE_TEXT = '';
  try {
    CORE_SCRIPT = (doc && doc.currentScript) || null;
    ENGINE_TEXT = (CORE_SCRIPT && CORE_SCRIPT.textContent) || '';
  } catch (e) { ENGINE_TEXT = ''; }
  if (!ENGINE_TEXT) ENGINE_TEXT = String(ngmCore);

  // ───────────────────────────────────────────────────────────── math & hashing

  function clamp(v, a, b) {
    if (a === undefined) a = 0;
    if (b === undefined) b = 1;
    return v < a ? a : v > b ? b : v;
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function mapRange(v, a, b, c, d, doClamp) {
    if (b === a) return v >= b ? d : c;
    var t = (v - a) / (b - a);
    if (doClamp !== false) t = clamp(t, 0, 1);
    return c + (d - c) * t;
  }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }

  function cyrb(str, seed) {
    var h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (var i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return [h1 >>> 0, h2 >>> 0];
  }
  function hex8(n) { return ('00000000' + (n >>> 0).toString(16)).slice(-8); }
  function hashHex(str) { var h = cyrb(String(str), 0); return hex8(h[0]) + hex8(h[1]); }

  function fmix(h) {
    h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return h >>> 0;
  }
  // Deterministic 0..1 from any number or string.
  function rand(seed) {
    var x = +seed;
    if (x !== x || !isFinite(x)) x = cyrb(String(seed), 7)[0];
    var i = Math.floor(x), f = x - i;
    var h = fmix((i | 0) ^ 0x9e3779b9);
    h = fmix(h ^ ((f * 4294967296) >>> 0) ^ (Math.floor(i / 4294967296) | 0));
    return h / 4294967296;
  }
  // Smooth 1-D value noise, -1..1.
  function noise(x, seed) {
    seed = seed === undefined ? 0 : seed;
    var so = rand(seed) * 1000;
    var i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    var a = rand(i + so * 1.0001), b = rand(i + 1 + so * 1.0001);
    var i2 = Math.floor(x * 2.13 + 17.3), f2 = x * 2.13 + 17.3 - i2, u2 = f2 * f2 * (3 - 2 * f2);
    var c = rand(i2 + so * 1.7), d = rand(i2 + 1 + so * 1.7);
    return clamp(((lerp(a, b, u) * 2 - 1) * 0.72 + (lerp(c, d, u2) * 2 - 1) * 0.28) * 1.15, -1, 1);
  }

  function stableStringify(v) {
    if (v === null || typeof v !== 'object') {
      if (typeof v === 'number' && !isFinite(v)) return 'null';
      if (v === undefined || typeof v === 'function') return 'null';
      return JSON.stringify(v);
    }
    if (Array.isArray(v)) return '[' + v.map(stableStringify).join(',') + ']';
    var keys = Object.keys(v).sort(), out = [];
    for (var i = 0; i < keys.length; i++) {
      var val = v[keys[i]];
      if (val === undefined || typeof val === 'function') continue;
      out.push(JSON.stringify(keys[i]) + ':' + stableStringify(val));
    }
    return '{' + out.join(',') + '}';
  }
  function deepClone(v) {
    if (v === null || typeof v !== 'object') return v;
    if (Array.isArray(v)) return v.map(deepClone);
    var o = {};
    for (var k in v) if (Object.prototype.hasOwnProperty.call(v, k)) o[k] = deepClone(v[k]);
    return o;
  }

  // ───────────────────────────────────────────────────────────── easing

  var ease = {
    linear: function (t) { return t; },
    inQuad: function (t) { return t * t; },
    outQuad: function (t) { return t * (2 - t); },
    inOutQuad: function (t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
    outCubic: function (t) { var u = 1 - t; return 1 - u * u * u; },
    inOutCubic: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    outQuart: function (t) { var u = 1 - t; return 1 - u * u * u * u; },
    outQuint: function (t) { var u = 1 - t; return 1 - u * u * u * u * u; },
    outExpo: function (t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); },
    inExpo: function (t) { return t <= 0 ? 0 : Math.pow(2, 10 * t - 10); },
    inOutExpo: function (t) {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
    },
    // outBack(t, k): overshoot amount k (default 1.70158).
    outBack: function (t, k) {
      k = k === undefined ? 1.70158 : k;
      var u = t - 1;
      return 1 + (k + 1) * u * u * u + k * u * u;
    },
    outElastic: function (t) {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1;
    },
    outCirc: function (t) { return Math.sqrt(1 - Math.pow(t - 1, 2)); }
  };
  // Every easing clamps t to 0..1 so shots can pass raw progress.
  Object.keys(ease).forEach(function (k) {
    var f = ease[k];
    ease[k] = function (t, a) { return f(clamp(+t || 0, 0, 1), a); };
  });

  // ───────────────────────────────────────────────────────────── colour

  var COLOR_CACHE = Object.create(null);
  var NAMED = { white: [255, 255, 255, 1], black: [0, 0, 0, 1], transparent: [0, 0, 0, 0] };

  function parseColor(c) {
    if (Array.isArray(c)) return [c[0], c[1], c[2], c[3] === undefined ? 1 : c[3]];
    var key = String(c == null ? '' : c).trim().toLowerCase();
    var hit = COLOR_CACHE[key];
    if (hit) return hit;
    var out = null, m;
    if (key.charAt(0) === '#') {
      var h = key.slice(1);
      if (/^[0-9a-f]{3,4}$/.test(h)) {
        out = [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16),
          h.length === 4 ? parseInt(h[3] + h[3], 16) / 255 : 1];
      } else if (/^[0-9a-f]{6}([0-9a-f]{2})?$/.test(h)) {
        out = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16),
          h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
      }
    } else if ((m = key.match(/^rgba?\(([^)]+)\)$/))) {
      var p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat);
      if (p.length >= 3) out = [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
    } else if (NAMED[key]) {
      out = NAMED[key];
    }
    if (!out || out.some(function (v) { return v !== v; })) out = [255, 255, 255, 1];
    COLOR_CACHE[key] = out;
    return out;
  }
  function isHexColor(c) { return typeof c === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c.trim()); }
  function toHex(rgb) {
    function h2(v) { v = Math.round(clamp(v, 0, 255)); return (v < 16 ? '0' : '') + v.toString(16); }
    return ('#' + h2(rgb[0]) + h2(rgb[1]) + h2(rgb[2])).toUpperCase();
  }
  function rgba(c, a) {
    var p = parseColor(c);
    var al = clamp((a === undefined || a === null ? 1 : +a) * p[3], 0, 1);
    return 'rgba(' + Math.round(p[0]) + ',' + Math.round(p[1]) + ',' + Math.round(p[2]) + ',' + (Math.round(al * 1000) / 1000) + ')';
  }

  function srgbToLin(c) { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function linToSrgb(c) { c = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; return c * 255; }
  function rgbToOklab(rgb) {
    var r = srgbToLin(rgb[0]), g = srgbToLin(rgb[1]), b = srgbToLin(rgb[2]);
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    var m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    var s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
      1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
      0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
  }
  function oklabToLinear(lab) {
    var l = lab[0] + 0.3963377774 * lab[1] + 0.2158037573 * lab[2];
    var m = lab[0] - 0.1055613458 * lab[1] - 0.0638541728 * lab[2];
    var s = lab[0] - 0.0894841775 * lab[1] - 1.2914855480 * lab[2];
    l = l * l * l; m = m * m * m; s = s * s * s;
    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
  }
  function inGamut(lin) { var e = 1e-4; return lin[0] >= -e && lin[0] <= 1 + e && lin[1] >= -e && lin[1] <= 1 + e && lin[2] >= -e && lin[2] <= 1 + e; }
  function oklchToRgb(L, C, H) {
    var hr = H * Math.PI / 180;
    var lin = oklabToLinear([L, C * Math.cos(hr), C * Math.sin(hr)]);
    if (!inGamut(lin)) {               // gamut map: keep hue & lightness, reduce chroma
      var lo = 0, hi = C;
      for (var i = 0; i < 22; i++) {
        var mid = (lo + hi) / 2;
        var t = oklabToLinear([L, mid * Math.cos(hr), mid * Math.sin(hr)]);
        if (inGamut(t)) lo = mid; else hi = mid;
      }
      lin = oklabToLinear([L, lo * Math.cos(hr), lo * Math.sin(hr)]);
    }
    return [linToSrgb(clamp(lin[0])), linToSrgb(clamp(lin[1])), linToSrgb(clamp(lin[2]))];
  }
  function toOklch(c) {
    var lab = rgbToOklab(parseColor(c));
    var H = Math.atan2(lab[2], lab[1]) * 180 / Math.PI;
    if (H < 0) H += 360;
    return { L: lab[0], C: Math.sqrt(lab[1] * lab[1] + lab[2] * lab[2]), H: H };
  }
  function rgbToHsl(rgb) {
    var r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, h = 0, s = 0, d = mx - mn;
    if (d > 1e-9) {
      s = d / (1 - Math.abs(2 * l - 1));
      if (mx === r) h = ((g - b) / d) % 6;
      else if (mx === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return [h, clamp(s), l];
  }
  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    var c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; } else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; } else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
    return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
  }
  // Keep a colour saturated and bright against black (HSL S >= 0.7, L 55–70%). Unchanged if already there.
  function neonize(c) {
    var p = parseColor(c), hsl = rgbToHsl(p);
    if (hsl[1] >= 0.7 && hsl[2] >= 0.55 && hsl[2] <= 0.70) return toHex(p);
    return toHex(hslToRgb(hsl[0], Math.max(hsl[1], 0.72), clamp(hsl[2], 0.55, 0.70)));
  }
  function mixHex(a, b, t) {                         // perceptual mix (OKLab)
    var A = rgbToOklab(parseColor(a)), B = rgbToOklab(parseColor(b));
    t = clamp(+t || 0);
    var lin = oklabToLinear([lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)]);
    return toHex([linToSrgb(clamp(lin[0])), linToSrgb(clamp(lin[1])), linToSrgb(clamp(lin[2]))]);
  }
  function mixRgb(a, b, t) {                         // plain sRGB mix, cheap
    var A = parseColor(a), B = parseColor(b);
    t = clamp(+t || 0);
    return toHex([lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)]);
  }
  function lighten(c, t) { return mixRgb(c, '#FFFFFF', t); }
  function isNearWhite(c) { var p = parseColor(c); return Math.min(p[0], p[1], p[2]) > 222; }
  function hsl(h, s, l, a) {
    if (s <= 1) s *= 100;
    if (l <= 1) l *= 100;
    return 'hsla(' + (+h || 0) + ',' + clamp(s, 0, 100) + '%,' + clamp(l, 0, 100) + '%,' + (a === undefined ? 1 : clamp(a)) + ')';
  }

  // ───────────────────────────────────────────────────────────── palette (spectrum arc)

  var ARC_HEX = ['#22D3EE', '#3B82F6', '#8B5CF6', '#EC4899', '#FB923C'];   // cool → warm, the short way through violet
  var ARC = ARC_HEX.map(toOklch);
  for (var ai = 1; ai < ARC.length; ai++) while (ARC[ai].H < ARC[ai - 1].H) ARC[ai].H += 360;
  var ARC_H0 = ARC[0].H, ARC_H1 = ARC[ARC.length - 1].H;

  function arcAt(a) {
    a = clamp(a) * (ARC.length - 1);
    var i = Math.min(ARC.length - 2, Math.floor(a)), f = a - i, A = ARC[i], B = ARC[i + 1];
    return { L: lerp(A.L, B.L, f), C: lerp(A.C, B.C, f), H: lerp(A.H, B.H, f) };
  }
  function arcPosOfHue(H) {                          // inverse of arcAt(..).H on the unwrapped arc
    if (H <= ARC_H0) return 0;
    if (H >= ARC_H1) return 1;
    for (var i = 0; i < ARC.length - 1; i++) {
      if (H <= ARC[i + 1].H) return (i + (H - ARC[i].H) / (ARC[i + 1].H - ARC[i].H)) / (ARC.length - 1);
    }
    return 1;
  }
  // Arc colour at position a (0..1); temperature rotates the hue along the arc by up to ±30°.
  // Past the ends the hue may go a little further (cyan-teal / amber) but never to mint or yellow.
  function arcColor(a, temperature) {
    var base = arcAt(a);
    var H = clamp(base.H + 30 * clamp(temperature || 0, -1, 1), ARC_H0 - 10, ARC_H1 + 16);
    var lc = arcAt(arcPosOfHue(H));
    return neonize(toHex(oklchToRgb(lc.L, lc.C, H)));
  }
  // Where a hue sits naturally on the arc, or null if it is off the arc (e.g. green).
  function naturalPos(hex) {
    var H = toOklch(hex).H, best = null, bestD = 1e9;
    [-360, 0, 360].forEach(function (k) {
      var h = H + k, d = h < ARC_H0 ? ARC_H0 - h : h > ARC_H1 ? h - ARC_H1 : 0;
      if (d < bestD) { bestD = d; best = h; }
    });
    return bestD <= 40 ? arcPosOfHue(best) : null;
  }

  function buildPalette(film) {
    var beats = film.beats, n = beats.length, temp = film.look.temperature;
    var brand = film.brand.colorResolved, accent = film.brand.accentResolved;
    var pos = beats.map(function (b, i) { return n > 1 ? i / (n - 1) : 0.5; });
    var isBrand = beats.map(function (b) { return !!brand && (b.hero === true || b.shot === 'endcard'); });

    // Re-centre the arc so hero beats land where the brand hue naturally sits (piecewise-linear warp).
    if (brand) {
      var nat = naturalPos(brand);
      var anchors = [];
      beats.forEach(function (b, i) { if (b.hero === true && i < n - 1) anchors.push(pos[i]); });
      if (nat !== null && anchors.length) {
        var A = anchors.reduce(function (s, v) { return s + v; }, 0) / anchors.length;
        var T = clamp(clamp(nat, A - 0.3, A + 0.3), 0.06, 0.94);
        pos = pos.map(function (a) {
          if (A <= 1e-6) return lerp(T, 1, a);
          if (a <= A) return A > 0 ? a / A * T : T;
          return T + (a - A) / (1 - A) * (1 - T);
        });
      }
    }
    var colors = pos.map(function (a, i) { return isBrand[i] ? brand : arcColor(a, temp); });
    // Weave: neighbours of brand beats lean 25% toward the brand colour.
    if (brand) {
      colors = colors.map(function (c, i) {
        if (isBrand[i]) return c;
        if ((i > 0 && isBrand[i - 1]) || (i < n - 1 && isBrand[i + 1])) return neonize(mixHex(c, brand, 0.25));
        return c;
      });
    }
    return beats.map(function (b, i) {
      var color = colors[i], color2;
      if (i < n - 1) color2 = colors[i + 1];
      else if (accent) color2 = accent;
      else if (n > 1) color2 = colors[i - 1] === color ? arcColor(Math.max(0, pos[i] - 0.25), temp) : colors[i - 1];
      else color2 = arcColor(0.75, temp);
      return {
        color: color,
        color2: color2,
        brand: brand || color,
        accent: accent || color2,
        arcPos: pos[i]
      };
    });
  }

  // ───────────────────────────────────────────────────────────── manifest & film normalisation

  var FALLBACK_MANIFEST = {
    shots: {
      title: { minDur: 1.8, maxDur: 6, defaults: {} },
      type: { minDur: 2.0, maxDur: 7, defaults: { bar: false, icon: 'search' } },
      number: { minDur: 1.8, maxDur: 5, defaults: { countUp: true } },
      tiles: { minDur: 2.2, maxDur: 6, defaults: {} },
      rings: { minDur: 1.8, maxDur: 6, defaults: {} },
      device: { minDur: 2.5, maxDur: 7, defaults: { kind: 'auto', ui: 'list' } },
      orbit: { minDur: 2.5, maxDur: 7, defaults: {} },
      stack: { minDur: 2.4, maxDur: 6, defaults: {} },
      endcard: { minDur: 2.2, maxDur: 6, defaults: {} }
    },
    common: { camera: 'push', cut: 'hard', hero: false }
  };

  function manifestInfo() {
    var m = root.NGM_MANIFEST;
    NGM.manifest = m && typeof m === 'object' ? m : null;
    if (!NGM.manifest || !m.shots) return FALLBACK_MANIFEST;
    var shots = {}, common = {};
    Object.keys(m.shots).forEach(function (name) {
      var sd = m.shots[name] || {}, d = {};
      Object.keys(sd.params || {}).forEach(function (p) {
        if (sd.params[p] && Object.prototype.hasOwnProperty.call(sd.params[p], 'default')) d[p] = deepClone(sd.params[p]['default']);
      });
      shots[name] = { minDur: +sd.minDur || 2, maxDur: +sd.maxDur || 6, defaults: d };
    });
    Object.keys(m.commonBeatFields || {}).forEach(function (p) {
      var f = m.commonBeatFields[p];
      if (f && Object.prototype.hasOwnProperty.call(f, 'default')) common[p] = deepClone(f['default']);
    });
    if (!common.camera) common.camera = 'push';
    if (!common.cut) common.cut = 'hard';
    if (common.hero === undefined) common.hero = false;
    return { shots: shots, common: common };
  }

  var RATIOS = { '9:16': [1080, 1920], '1:1': [1080, 1080], '16:9': [1920, 1080], '4:5': [1080, 1350], '4:3': [1440, 1080], '3:4': [1080, 1440] };
  function sizeForRatio(r) {
    var key = String(r || '9:16').replace(/\s+/g, '').replace(/[x×\/]/i, ':');
    if (RATIOS[key]) return { ratio: key, w: RATIOS[key][0], h: RATIOS[key][1] };
    var m = key.match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
    if (m && +m[1] > 0 && +m[2] > 0) {
      var a = +m[1] / +m[2], w, h;
      if (a >= 1) { h = 1080; w = Math.round(1080 * a / 2) * 2; } else { w = 1080; h = Math.round(1080 / a / 2) * 2; }
      return { ratio: key, w: Math.min(w, 3840), h: Math.min(h, 3840) };
    }
    return { ratio: '9:16', w: 1080, h: 1920 };
  }

  function num(v, d) { v = +v; return isFinite(v) ? v : d; }

  function normalizeFilm(input, mi) {
    var f = deepClone(input || {});
    var size = sizeForRatio(f.ratio);
    var fps = Math.round(num(f.fps, 30));
    if (!(fps >= 1 && fps <= 120)) fps = 30;
    var brand = f.brand && typeof f.brand === 'object' ? f.brand : {};
    var look = f.look && typeof f.look === 'object' ? f.look : {};
    var fonts = f.fonts && typeof f.fonts === 'object' ? f.fonts : {};
    var out = {
      title: f.title != null ? String(f.title) : (brand.name ? brand.name + ' film' : 'Neon Glass Motion'),
      ratio: size.ratio, w: size.w, h: size.h, fps: fps,
      brand: {
        name: brand.name != null ? String(brand.name) : '',
        color: isHexColor(brand.color) ? brand.color.trim() : null,
        accent: isHexColor(brand.accent) ? brand.accent.trim() : null,
        url: brand.url != null ? String(brand.url) : '',
        logo: typeof brand.logo === 'string' && brand.logo ? brand.logo : null
      },
      look: {
        temperature: clamp(num(look.temperature, 0), -1, 1),
        energy: clamp(num(look.energy, 0.6), 0, 1),
        density: clamp(num(look.density, 0.6), 0, 1)
      },
      fonts: {
        display: typeof fonts.display === 'string' && fonts.display.trim() ? fonts.display.trim() : 'Inter',
        mono: typeof fonts.mono === 'string' && fonts.mono.trim() ? fonts.mono.trim() : 'JetBrains Mono',
        arabic: typeof fonts.arabic === 'string' && fonts.arabic.trim() ? fonts.arabic.trim() : 'Noto Kufi Arabic'
      },
      audio: f.audio || null,
      beats: []
    };
    // Brand colours must glow on black: neutral colours are ignored, dark/pale ones lifted.
    function resolveBrandColor(c) {
      if (!c) return null;
      var s = rgbToHsl(parseColor(c))[1];
      if (s < 0.12) return null;
      return neonize(c);
    }
    out.brand.colorResolved = resolveBrandColor(out.brand.color);
    out.brand.accentResolved = resolveBrandColor(out.brand.accent);

    var beats = Array.isArray(f.beats) ? f.beats : [];
    beats.forEach(function (b, i) {
      if (!b || typeof b !== 'object') return;
      var shot = String(b.shot || '').trim();
      var info = mi.shots[shot] || { minDur: 2, maxDur: 6 };
      var dur = num(b.dur, NaN);
      if (!(dur > 0)) dur = clamp(3, info.minDur || 2, info.maxDur || 6);
      var nb = {};
      Object.keys(b).forEach(function (k) { if (b[k] !== null && b[k] !== undefined) nb[k] = b[k]; });
      nb.shot = shot;
      nb.dur = dur;
      nb.id = b.id != null && String(b.id).trim() ? String(b.id).trim() : 'beat' + (i + 1);
      out.beats.push(nb);
    });
    return out;
  }

  // ───────────────────────────────────────────────────────────── fonts

  var GENERIC = { 'serif': 1, 'sans-serif': 1, 'monospace': 1, 'cursive': 1, 'fantasy': 1, 'system-ui': 1, 'ui-monospace': 1, 'ui-sans-serif': 1 };
  var DEFAULT_FAMILIES = { 'inter': 1, 'jetbrains mono': 1, 'noto kufi arabic': 1 };
  function q(name) { name = String(name).replace(/["\\;{}]/g, '').trim(); return GENERIC[name] ? name : '"' + name + '"'; }
  function uniq(list) {
    var seen = {}, out = [];
    list.forEach(function (x) { if (x && !seen[x.toLowerCase()]) { seen[x.toLowerCase()] = 1; out.push(x); } });
    return out;
  }
  // exclude: family names to leave out (render mode pins stacks to the fonts that actually loaded).
  function fontStacks(fonts, exclude) {
    exclude = exclude || {};
    function keep(list) { return uniq(list).filter(function (f) { return !exclude[f.toLowerCase()]; }); }
    var dList = keep([fonts.display, 'Inter']), mList = keep([fonts.mono, 'JetBrains Mono']), aList = keep([fonts.arabic, 'Noto Kufi Arabic']);
    var display = dList.map(q).concat(['"Helvetica Neue"', 'Arial', '"DejaVu Sans"', 'sans-serif']).join(', ');
    var mono = mList.map(q).concat(['ui-monospace', '"DejaVu Sans Mono"', 'monospace']).join(', ');
    var arabic = aList.map(q).concat(['"Noto Sans Arabic"', '"Geeza Pro"', '"Segoe UI"']).concat(dList.map(q))
      .concat(['"DejaVu Sans"', 'sans-serif']).join(', ');   // Latin letters inside an Arabic line use the display face
    return { display: display, mono: mono, arabic: arabic, names: { display: fonts.display, mono: fonts.mono, arabic: fonts.arabic }, excluded: Object.keys(exclude) };
  }
  // Custom (non-default) families get a Google Fonts stylesheet; offline this simply fails and we fall back.
  function ensureFontLinks(fonts) {
    if (!doc || !doc.head) return;
    [fonts.display, fonts.mono, fonts.arabic].forEach(function (name) {
      if (!name || DEFAULT_FAMILIES[name.toLowerCase()] || GENERIC[name]) return;
      var id = 'ngm-font-' + hashHex(name);
      if (doc.getElementById(id)) return;
      var l = doc.createElement('link');
      l.id = id;
      l.rel = 'stylesheet';
      l.setAttribute('data-ngm-font', '');
      l.onload = function () { l.setAttribute('data-state', 'ok'); };
      l.onerror = function () { l.setAttribute('data-state', 'error'); };
      l.href = 'https://fonts.googleapis.com/css?family=' + encodeURIComponent(name).replace(/%20/g, '+') +
        ':400,500,600,700,800,900&display=block';
      doc.head.appendChild(l);
    });
  }
  var AR_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

  function filmText(film) {
    var parts = [film.title, film.brand.name, film.brand.url];
    film.beats.forEach(function (b) {
      Object.keys(b).forEach(function (k) {
        var v = b[k];
        if (typeof v === 'string') parts.push(v);
        else if (Array.isArray(v)) v.forEach(function (x) { if (typeof x === 'string') parts.push(x); });
      });
    });
    return parts.join(' ');
  }
  function uniqueChars(s) {
    var seen = {}, out = '';
    Array.from(s).forEach(function (ch) { if (!seen[ch]) { seen[ch] = 1; out += ch; } });
    return out;
  }
  function delay(ms, v) { return new Promise(function (res) { setTimeout(function () { res(v); }, ms); }); }
  function waitLink(l) {
    return new Promise(function (res) {
      var st = l.getAttribute('data-state');
      if (st === 'ok' || st === 'error') return res(st);
      if (l.sheet && l.media === 'all') return res('ok');
      function done(v) { return function () { res(v); }; }
      l.addEventListener('load', done('ok'), { once: true });
      l.addEventListener('error', done('error'), { once: true });
    });
  }
  function withTimeout(p, ms, fallback) { return Promise.race([p, delay(ms, fallback)]); }
  function fontSamples(film) {
    var text = filmText(film);
    return {
      latin: uniqueChars('AaBbGgHhQqWwXxYy0123456789%$+.,!?—' + text.replace(new RegExp(AR_RE.source, 'g'), '')),
      arabic: AR_RE.test(text) ? uniqueChars('ابجدهوزحطيكلمنسعفصقرشتثخذضظغ٠١٢٣٤٥٦٧٨٩' + text) : ''
    };
  }
  // Stylesheets (<= 6 s), then document.fonts.load for each family (<= 6 s). Never rejects.
  function loadFonts(film) {
    if (!doc || !doc.fonts || !doc.fonts.load) return Promise.resolve({ list: [], timedOut: false });
    var sm = fontSamples(film);
    var links = Array.prototype.slice.call(doc.querySelectorAll('link[data-ngm-font]'));
    return withTimeout(Promise.all(links.map(waitLink)), 6000, 'timeout').then(function (linkState) {
      var jobs = [];
      function add(fam, weights, sample) {
        weights.forEach(function (w) {
          jobs.push(doc.fonts.load(w + ' 48px ' + q(fam), sample).then(function (r) {
            return { family: fam, weight: w, ok: !!(r && r.length) };
          }, function () { return { family: fam, weight: w, ok: false }; }));
        });
      }
      add(film.fonts.display, [400, 600, 700, 800, 900], sm.latin);
      add(film.fonts.mono, [400, 700], sm.latin);
      if (sm.arabic) add(film.fonts.arabic, [400, 700, 800, 900], sm.arabic);
      return withTimeout(Promise.all(jobs), 6000, null).then(function (res) {
        return { list: res || [], timedOut: linkState === 'timeout' || !res };
      });
    }, function () { return { list: [], timedOut: false }; });
  }
  // Is a family actually usable right now (loaded web font or installed locally)?
  function fontAvailable(fam, sample, weight) {
    ensureMeasure();
    if (HAS_LS) MCTX.letterSpacing = '0px';
    sample = sample || 'mmmmmmmmmmlli10OQW@';
    var bases = ['monospace', 'serif'];
    for (var i = 0; i < bases.length; i++) {
      MCTX.font = weight + ' 48px ' + bases[i];
      var w0 = MCTX.measureText(sample).width;
      MCTX.font = weight + ' 48px ' + q(fam) + ', ' + bases[i];
      if (Math.abs(MCTX.measureText(sample).width - w0) > 0.05) return true;
    }
    return false;
  }

  // ───────────────────────────────────────────────────────────── engine state

  var STATE = null;
  var SHOT_SRC = Object.create(null);
  var CUR = null;           // per-frame drawing context used by g.* helpers
  var LIT_DEPTH = 0;
  var MCTX = null;          // measuring context
  var HAS_LS = false;
  var SEGMENTER = null;
  var TEXT_CACHE = Object.create(null);
  var ENGINE_HASH = hashHex(ENGINE_TEXT);
  var PLAYER = null;
  var BLOOM_SCALE = 0.25;

  NGM.version = VERSION;
  NGM.shots = NGM.shots || {};
  NGM.ease = ease;
  NGM.manifest = null;
  NGM.renderMode = !!(root.__NGM_RENDER === true || (root.location && /[?&]render(=|&|$)/.test(root.location.search || '')));
  NGM.ready = Promise.resolve({ fonts: [], logo: false, timedOut: false });
  NGM.error = null;

  NGM.shot = function (name, def) {
    if (!name || !def || typeof def.draw !== 'function') throw new Error('NGM.shot(name, { draw(g, s) }) needs a draw function');
    NGM.shots[name] = def;
    var src = '';
    Object.keys(def).forEach(function (k) {
      var v = def[k];
      src += k + ':' + (typeof v === 'function' ? String(v) : stableStringify(v)) + ';';
    });
    var script = null;
    try { script = doc && doc.currentScript; } catch (e) { script = null; }
    if (script && script !== CORE_SCRIPT && script.textContent) src += '\n#file:' + script.textContent;
    SHOT_SRC[name] = hashHex(src);
    if (STATE) STATE.dirty = true;
    return def;
  };

  function ensureMeasure() {
    if (MCTX || !doc) return;
    var c = doc.createElement('canvas');
    c.width = c.height = 8;
    MCTX = c.getContext('2d');
    HAS_LS = 'letterSpacing' in MCTX;
    try { SEGMENTER = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null; } catch (e) { SEGMENTER = null; }
  }

  function makeCanvas(w, h, opaque) {
    var c = doc.createElement('canvas');
    c.width = w; c.height = h;
    var ctx = c.getContext('2d', { alpha: !opaque });
    return { canvas: c, ctx: ctx };
  }

  NGM.load = function (film) {
    if (!doc) throw new Error('NGM needs a browser document');
    ensureMeasure();
    var mi = manifestInfo();
    var nf = normalizeFilm(film, mi);
    var W = nf.w, H = nf.h;
    var prev = STATE;

    var canvas = prev ? prev.canvas : (NGM.canvas || doc.createElement('canvas'));
    if (!canvas.id) canvas.id = 'ngm-canvas';
    if (canvas.width !== W) canvas.width = W;
    if (canvas.height !== H) canvas.height = H;
    var ctx = canvas.getContext('2d', { alpha: false });
    var bw = Math.ceil(W * BLOOM_SCALE), bh = Math.ceil(H * BLOOM_SCALE);
    var bloom = prev && prev.bloom.canvas.width === bw && prev.bloom.canvas.height === bh ? prev.bloom : makeCanvas(bw, bh, true);
    var tmp = prev && prev.tmp.canvas.width === bw && prev.tmp.canvas.height === bh ? prev.tmp : makeCanvas(bw, bh, true);

    STATE = {
      film: nf, mi: mi, w: W, h: H, u: Math.min(W, H) / 100, bloomScale: BLOOM_SCALE, fps: nf.fps, canvas: canvas, ctx: ctx, bloom: bloom, tmp: tmp,
      fonts: fontStacks(nf.fonts), frame: 0, dirty: true, logo: null, timeline: [], frameCount: 1, beatsMerged: [],
      palette: []
    };
    NGM.canvas = canvas;
    NGM.film = nf;
    NGM.fonts = STATE.fonts;
    TEXT_CACHE = Object.create(null);
    ensureFontLinks(nf.fonts);
    rebuild();

    if (NGM.renderMode) {
      doc.documentElement.style.cssText += ';margin:0;padding:0;overflow:hidden;background:#000';
      if (doc.body) doc.body.style.cssText += ';margin:0;padding:0;overflow:hidden;background:#000';
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      canvas.style.display = 'block';
    }
    if (!canvas.parentNode) {
      if (doc.body) doc.body.appendChild(canvas);
      else doc.addEventListener('DOMContentLoaded', function () { if (!canvas.parentNode) doc.body.appendChild(canvas); });
    }

    // Ready = web fonts (stylesheet <= 6 s, then files <= 6 s) + logo decoded (<= 6 s). Never rejects.
    // In render mode the font stacks are then pinned to what is actually available, so a font that
    // arrives late can never change the look halfway through a render.
    var st = STATE;
    var fontsP = withTimeout(loadFonts(nf), 13000, { list: [], timedOut: true });
    var logoP = withTimeout(loadLogo(nf.brand.logo), 6000, null);
    NGM.ready = Promise.all([fontsP, logoP]).then(function (r) {
      var info = { fonts: {}, loaded: r[0].list, logo: !!r[1], timedOut: !!r[0].timedOut };
      if (STATE !== st) return info;
      var sm = fontSamples(nf), exclude = {};
      var latin = sm.latin.slice(0, 40) || null;
      function check(list, sample, weight) {
        var first = false;
        uniq(list).forEach(function (f) {
          if (fontAvailable(f, sample, weight)) { if (!first) first = f; } else exclude[f.toLowerCase()] = 1;
        });
        return first;
      }
      info.fonts.display = check([nf.fonts.display, 'Inter'], latin, 800);
      info.fonts.mono = check([nf.fonts.mono, 'JetBrains Mono'], latin, 400);
      info.fonts.arabic = sm.arabic ? check([nf.fonts.arabic, 'Noto Kufi Arabic'], sm.arabic.slice(0, 30), 800) : null;
      if (NGM.renderMode && Object.keys(exclude).length) {
        st.fonts = fontStacks(nf.fonts, exclude);
        NGM.fonts = st.fonts;
        if (root.console) console.warn('[NGM] fonts not available, rendering with fallbacks instead of: ' + Object.keys(exclude).join(', '));
      }
      st.logo = r[1];
      NGM.logo = r[1] ? r[1].img : null;
      TEXT_CACHE = Object.create(null);
      st.dirty = true;
      rebuild();
      renderFrame(st.frame);
      if (PLAYER) PLAYER.onReady();
      return info;
    }, function () { return { fonts: {}, loaded: [], logo: false, timedOut: false }; });
    if (!st.fontListener && doc.fonts && doc.fonts.addEventListener) {
      st.fontListener = true;
      doc.fonts.addEventListener('loadingdone', function () {
        if (STATE !== st) return;
        TEXT_CACHE = Object.create(null);      // metrics of a newly arrived face differ from the fallback's
        if (PLAYER && !PLAYER.playing) renderFrame(st.frame);
      });
    }

    renderFrame(0);
    if (PLAYER) PLAYER.refresh();
    return NGM;
  };

  function loadLogo(src) {
    if (!src) return Promise.resolve(null);
    return new Promise(function (res) {
      var img = new Image();
      img.decoding = 'sync';
      var finished = false;
      function done() {
        if (finished) return;
        finished = true;
        var w = img.naturalWidth, h = img.naturalHeight;
        if (!(w > 0 && h > 0)) {                       // SVG without intrinsic size: read the viewBox
          var vb = null;
          try {
            var txt = /^data:image\/svg\+xml;base64,/i.test(src) ? atob(src.split(',')[1]) :
              /^data:image\/svg\+xml/i.test(src) ? decodeURIComponent(src.split(',').slice(1).join(',')) : '';
            vb = txt.match(/viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
          } catch (e) { vb = null; }
          if (vb) { w = +vb[1]; h = +vb[2]; }
        }
        if (!(w > 0 && h > 0)) return res(null);
        res({ img: img, w: w, h: h, aspect: w / h });
      }
      img.onload = function () {
        if (img.decode) img.decode().then(done, done); else done();
      };
      img.onerror = function () { finished = true; res(null); };
      img.src = src;
    });
  }

  // Merge each beat over manifest defaults + shot defaults, compute frames, palette and hashes.
  function rebuild() {
    var st = STATE;
    if (!st || !st.dirty) return;
    st.dirty = false;
    var nf = st.film, fps = st.fps, mi = st.mi;
    var palette = buildPalette(nf);
    var start = 0, n = nf.beats.length;
    var logoHash = nf.brand.logo ? hashHex(nf.brand.logo) : '';
    st.palette = palette;
    st.beatsMerged = [];
    st.timeline = nf.beats.map(function (b, i) {
      var def = NGM.shots[b.shot];
      var merged = {};
      Object.keys(mi.common || {}).forEach(function (k) { merged[k] = deepClone(mi.common[k]); });
      var sd = mi.shots[b.shot];
      if (sd && sd.defaults) Object.keys(sd.defaults).forEach(function (k) { merged[k] = deepClone(sd.defaults[k]); });
      if (def && def.defaults && typeof def.defaults === 'object') Object.keys(def.defaults).forEach(function (k) { merged[k] = deepClone(def.defaults[k]); });
      Object.keys(b).forEach(function (k) { merged[k] = deepClone(b[k]); });
      st.beatsMerged.push(merged);

      var frames = Math.max(1, Math.round(b.dur * fps));
      var pal = palette[i];
      var hashed = {};
      Object.keys(merged).forEach(function (k) { if (k !== 'note') hashed[k] = merged[k]; });
      delete hashed.dur;
      var hash = hashHex(stableStringify({
        v: VERSION, engine: ENGINE_HASH, shot: SHOT_SRC[b.shot] || 'missing', beat: hashed,
        frames: frames, fps: fps, w: st.w, h: st.h,
        colors: [pal.color, pal.color2, pal.brand, pal.accent],
        look: nf.look, fonts: st.fonts,
        brand: { name: nf.brand.name, url: nf.brand.url, color: nf.brand.color, accent: nf.brand.accent, logo: logoHash, logoReady: !!st.logo },
        index: i, count: n
      }));
      var row = {
        index: i, id: b.id, shot: b.shot,
        startFrame: start, endFrame: start + frames, frames: frames,
        t0: start / fps, t1: (start + frames) / fps,
        hash: hash, color: pal.color
      };
      start += frames;
      return row;
    });
    st.frameCount = Math.max(1, start);
  }

  function beatIndexAt(f) {
    var tl = STATE.timeline;
    for (var i = 0; i < tl.length; i++) if (f < tl[i].endFrame) return i;
    return tl.length - 1;
  }

  // ───────────────────────────────────────────────────────────── text

  function refMetrics(weight, fam, isAr) {
    var key = 'm|' + weight + '|' + fam + '|' + isAr;
    var hit = TEXT_CACHE[key];
    if (hit) return hit;
    MCTX.font = weight + ' 100px ' + fam;
    if (HAS_LS) MCTX.letterSpacing = '0px';
    MCTX.direction = isAr ? 'rtl' : 'ltr';
    var m = MCTX.measureText(isAr ? 'أبحث' : 'H');
    var asc = m.actualBoundingBoxAscent, desc = isAr ? m.actualBoundingBoxDescent : 0;
    if (!(asc > 0)) { asc = isAr ? 78 : 72; desc = isAr ? 30 : 0; }
    var gm = MCTX.measureText(isAr ? 'جيم' : 'gjpy');
    hit = { asc: asc / 100, desc: desc / 100, descender: Math.max(desc, gm.actualBoundingBoxDescent || 22) / 100 };
    TEXT_CACHE[key] = hit;
    return hit;
  }

  function textLayout(str, o) {
    o = o || {};
    str = str == null ? '' : String(str);
    var isAr = AR_RE.test(str);
    var fam = isAr ? STATE.fonts.arabic : (o.font === 'mono' ? STATE.fonts.mono : STATE.fonts.display);
    var weight = o.weight != null ? o.weight : 800;
    var u = STATE.u;
    var px = Math.max(1, (o.size != null ? +o.size : 8) * u);
    var trackEm = isAr ? 0 : (o.tracking != null ? +o.tracking : -0.02);
    var maxW = +o.maxWidth > 0 ? +o.maxWidth : 0;
    var maxLines = o.wrap ? (o.wrap === true ? 2 : Math.max(1, o.wrap | 0)) : 0;

    function setFont(p) {
      MCTX.font = weight + ' ' + p.toFixed(2) + 'px ' + fam;
      if (HAS_LS) MCTX.letterSpacing = (trackEm * p).toFixed(2) + 'px';
      MCTX.direction = isAr ? 'rtl' : 'ltr';
    }
    function width(s) { return MCTX.measureText(s).width; }
    setFont(px);
    var lines = str.split('\n');
    if (maxW && maxLines > 1 && lines.length === 1 && width(lines[0]) > maxW) lines = wrapLine(lines[0], maxLines, width);
    var widths = lines.map(width);
    var widest = Math.max.apply(null, widths.concat([0]));
    for (var pass = 0; pass < 3 && maxW && widest > maxW; pass++) {
      px = Math.max(1, px * (maxW / widest) * 0.995);
      setFont(px);
      widths = lines.map(width);
      widest = Math.max.apply(null, widths.concat([0]));
    }
    var rm = refMetrics(weight, fam, isAr);
    var lh = (o.lineHeight != null ? +o.lineHeight : 1.12) * px;
    return {
      str: str, lines: lines, widths: widths, px: px, fam: fam, weight: weight, trackEm: trackEm, isAr: isAr,
      widest: widest, lh: lh, asc: rm.asc * px, desc: rm.desc * px, descender: rm.descender * px
    };
  }
  // Balanced split into up to maxLines lines (greedy after the first balanced cut).
  function wrapLine(line, maxLines, width) {
    var words = line.split(/\s+/).filter(Boolean);
    if (words.length < 2) return [line];
    var best = null, bestCost = Infinity;
    for (var k = 1; k < words.length; k++) {
      var a = words.slice(0, k).join(' '), b = words.slice(k).join(' ');
      var cost = Math.max(width(a), width(b));
      if (cost < bestCost) { bestCost = cost; best = [a, b]; }
    }
    if (maxLines > 2 && best) {
      var tail = wrapLine(best[1], maxLines - 1, width);
      if (tail.length > 1 && Math.max.apply(null, tail.map(width)) < width(best[1])) return [best[0]].concat(tail);
    }
    return best || [line];
  }
  function blockMetrics(L, y, baseline) {
    var n = L.lines.length, firstBase;
    var capBlock = (n - 1) * L.lh + L.asc - L.desc;
    baseline = baseline || 'middle';
    if (baseline === 'top' || baseline === 'hanging') firstBase = y + L.asc;
    else if (baseline === 'bottom' || baseline === 'ideographic') firstBase = y - L.descender - (n - 1) * L.lh;
    else if (baseline === 'alphabetic') firstBase = y;
    else firstBase = y - capBlock / 2 + L.asc;
    return { firstBase: firstBase, top: firstBase - L.asc, bottom: firstBase + (n - 1) * L.lh + L.descender, capBlock: capBlock };
  }
  function drawTextLines(c, L, x, firstBase, align, fill, alpha) {
    c.font = L.weight + ' ' + L.px.toFixed(2) + 'px ' + L.fam;
    if (HAS_LS) c.letterSpacing = (L.trackEm * L.px).toFixed(2) + 'px';
    c.direction = L.isAr ? 'rtl' : 'ltr';
    c.textAlign = align;
    c.textBaseline = 'alphabetic';
    c.fillStyle = fill;
    c.globalAlpha *= alpha;
    // letterSpacing adds trailing space after the last glyph; shift so the ink is truly centred/right-aligned
    var trail = HAS_LS && !L.isAr ? L.trackEm * L.px : 0;
    var dx = align === 'center' ? -trail / 2 : align === 'right' ? -trail : 0;
    for (var i = 0; i < L.lines.length; i++) c.fillText(L.lines[i], x + dx, firstBase + i * L.lh);
  }

  // ───────────────────────────────────────────────────────────── icons (24-unit grid, stroke only)

  function circ(cx, cy, r) {
    return 'M' + (cx + r) + ' ' + cy + 'A' + r + ' ' + r + ' 0 1 1 ' + (cx - r) + ' ' + cy + 'A' + r + ' ' + r + ' 0 1 1 ' + (cx + r) + ' ' + cy + 'Z';
  }
  function rrect(x, y, w, h, r) {
    return 'M' + (x + r) + ' ' + y + 'H' + (x + w - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (x + w) + ' ' + (y + r) +
      'V' + (y + h - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (x + w - r) + ' ' + (y + h) +
      'H' + (x + r) + 'A' + r + ' ' + r + ' 0 0 1 ' + x + ' ' + (y + h - r) +
      'V' + (y + r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (x + r) + ' ' + y + 'Z';
  }
  function starPath() {
    var d = '', cx = 12, cy = 12.7, R = 9.6, r = 4.1;
    for (var k = 0; k < 10; k++) {
      var a = -Math.PI / 2 + k * Math.PI / 5, rad = k % 2 ? r : R;
      d += (k ? 'L' : 'M') + (cx + rad * Math.cos(a)).toFixed(3) + ' ' + (cy + rad * Math.sin(a)).toFixed(3);
    }
    return d + 'Z';
  }
  function gearPath() {
    var d = '', teeth = 8, Rt = 9.5, Rr = 7.3, tipHalf = 0.17, baseHalf = 0.26, step = 2 * Math.PI / teeth;
    function pt(a, r) { return (12 + r * Math.cos(a)).toFixed(3) + ' ' + (12 + r * Math.sin(a)).toFixed(3); }
    for (var k = 0; k < teeth; k++) {
      var a = -Math.PI / 2 + k * step;
      d += (k ? 'L' : 'M') + pt(a - baseHalf, Rr) + 'L' + pt(a - tipHalf, Rt) + 'L' + pt(a + tipHalf, Rt) + 'L' + pt(a + baseHalf, Rr);
      d += 'A' + Rr + ' ' + Rr + ' 0 0 1 ' + pt(a + step - baseHalf, Rr);
    }
    return d + 'Z' + circ(12, 12, 3.1);
  }
  var ICON_D = {
    calendar: rrect(3.5, 4.5, 17, 16, 2.4) + 'M3.5 9.5h17M8 2.8v3.4M16 2.8v3.4M8 13.5h.01M12 13.5h.01M16 13.5h.01M8 17h.01M12 17h.01',
    clock: circ(12, 12, 9) + 'M12 7.2V12l3.3 2.1',
    check: 'M4.5 12.6l5 5L19.5 7',
    bolt: 'M13.5 2.5L4.5 13.5h7l-1 8 9-11h-7l1-8Z',
    lock: rrect(4.5, 10.5, 15, 10.5, 2.2) + 'M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.6v2.4',
    chart: 'M3.5 3.5v17h17M8.5 16.5v-4M13 16.5V8M17.5 16.5v-6.5',
    globe: circ(12, 12, 9) + 'M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3ZM3.2 12h17.6',
    chat: 'M5.5 4.5h13a2.5 2.5 0 0 1 2.5 2.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 3.5v-3.5h-1A2.5 2.5 0 0 1 3 15V7a2.5 2.5 0 0 1 2.5-2.5ZM7.5 9.3h9M7.5 12.8h5.5',
    star: starPath(),
    users: circ(9, 7.8, 3.6) + 'M2.5 20.5v-1.2a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v1.2M15.8 4.4a3.6 3.6 0 0 1 0 6.8M18.3 14.5a5 5 0 0 1 3.2 4.7v1.3',
    code: 'M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5M13.6 4.5l-3.2 15',
    search: circ(10.5, 10.5, 6.8) + 'M15.4 15.4l5.1 5.1',
    mail: rrect(3, 5, 18, 14, 2.4) + 'M3.8 6.8l8.2 6 8.2-6',
    bell: 'M6 16.8V11a6 6 0 0 1 12 0v5.8l1.6 2.2H4.4Z' + 'M10.2 21.3a2 2 0 0 0 3.6 0M12 2.8V5',
    heart: 'M12 20.3c-.5 0-8.6-4.6-8.6-10.6a4.7 4.7 0 0 1 8.6-2.7a4.7 4.7 0 0 1 8.6 2.7c0 6-8.1 10.6-8.6 10.6Z',
    cart: 'M2.5 3.5h2.4l2.5 11.5h10.4l2.3-8.2H5.8' + circ(9, 19.2, 1.5) + circ(16.6, 19.2, 1.5),
    card: rrect(2.5, 5, 19, 14, 2.4) + 'M2.5 10h19M6.5 15h3.5',
    cloud: 'M7.2 19h10.3a4.3 4.3 0 0 0 .9-8.5a6.3 6.3 0 0 0-12.2 1.1A3.8 3.8 0 0 0 7.2 19Z',
    shield: 'M12 2.8l7.5 2.9v5.6c0 4.8-3.1 8.6-7.5 9.9c-4.4-1.3-7.5-5.1-7.5-9.9V5.7Z' + 'M8.8 12.2l2.2 2.2 4.2-4.4',
    sparkle: 'M10.5 4.5Q11.4 12.1 18.5 13Q11.4 13.9 10.5 21.5Q9.6 13.9 2.5 13Q9.6 12.1 10.5 4.5Z' + 'M18.5 2.5v4.5M16.25 4.75h4.5',
    play: 'M8.5 5.3v13.4a.6.6 0 0 0 .9.5l10.3-6.7a.6.6 0 0 0 0-1L9.4 4.8a.6.6 0 0 0-.9.5Z',
    arrow: 'M3.5 12h16.5M13.5 5.5l6.5 6.5-6.5 6.5',
    plus: 'M12 4.5v15M4.5 12h15',
    home: 'M3 11.2L12 3.8l9 7.4M5.5 9.5v10.5h13V9.5M10 20v-5.5h4V20',
    camera: 'M3 8.8a1.8 1.8 0 0 1 1.8-1.8h2.9l1.8-2.5h5l1.8 2.5h2.9A1.8 1.8 0 0 1 21 8.8v9.4a1.8 1.8 0 0 1-1.8 1.8H4.8A1.8 1.8 0 0 1 3 18.2Z' + circ(12, 13.3, 3.6),
    music: 'M9 17.5V6l11-2.5v12' + circ(6.5, 17.5, 2.5) + circ(17.5, 15.5, 2.5),
    doc: 'M6.5 2.8h7.8l4.7 4.7V19a2.2 2.2 0 0 1-2.2 2.2H6.5A2.2 2.2 0 0 1 4.3 19V5a2.2 2.2 0 0 1 2.2-2.2ZM14 3v4.8h4.8M8 12.8h8M8 16.4h5.5',
    gear: gearPath(),
    pin: 'M12 21.5c-3.6-3.7-7-7.6-7-11.5a7 7 0 0 1 14 0c0 3.9-3.4 7.8-7 11.5Z' + circ(12, 10, 2.6),
    phone: rrect(6, 2.5, 12, 19, 2.4) + 'M10.8 18.2h2.4'
  };
  var ICON_NAMES = Object.keys(ICON_D);
  var ICON_PATHS = null;
  function iconPath(name) {
    if (!ICON_PATHS) {
      ICON_PATHS = {};
      ICON_NAMES.forEach(function (k) { ICON_PATHS[k] = new Path2D(ICON_D[k]); });
    }
    return ICON_PATHS[name] || null;
  }

  // ───────────────────────────────────────────────────────────── graphics helpers (g)

  // Run fn on main (and bloom) respecting nesting inside g.lit: inside lit only the current target is drawn.
  function dual(mainFn, bloomFn) {
    if (LIT_DEPTH > 0) {
      var c = CUR.target;
      c.save();
      try { if (CUR.targetIsBloom) { if (bloomFn) bloomFn(c); } else if (mainFn) mainFn(c); } finally { c.restore(); }
      return;
    }
    if (mainFn) { CUR.ctx.save(); try { mainFn(CUR.ctx); } finally { CUR.ctx.restore(); } }
    if (bloomFn) { CUR.bctx.save(); try { bloomFn(CUR.bctx); } finally { CUR.bctx.restore(); } }
  }
  function curCtx() { return LIT_DEPTH > 0 ? CUR.target : CUR.ctx; }
  function U(v, d) { v = v === undefined || v === null ? d : +v; return (isFinite(v) ? v : d) * CUR.u; }

  function rrPath(c, x, y, w, h, r) {
    if (w < 0) { x += w; w = -w; }
    if (h < 0) { y += h; h = -h; }
    r = clamp(r, 0, Math.min(w, h) / 2);
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

  var G = {};

  G.lit = function (fn) {
    if (typeof fn !== 'function') return;
    if (LIT_DEPTH > 0) { fn(CUR.target, CUR.targetIsBloom); return; }
    LIT_DEPTH++;
    try {
      CUR.target = CUR.ctx; CUR.targetIsBloom = false;
      CUR.ctx.save();
      try { fn(CUR.ctx, false); } finally { CUR.ctx.restore(); }
      CUR.target = CUR.bctx; CUR.targetIsBloom = true;
      CUR.bctx.save();
      try { fn(CUR.bctx, true); } finally { CUR.bctx.restore(); }
    } finally {
      LIT_DEPTH--;
      CUR.target = CUR.ctx; CUR.targetIsBloom = false;
    }
  };
  // Draw in screen space (ignores the camera move) — for HUD-like elements.
  G.screen = function (fn) {
    var bs = STATE.bloomScale;
    CUR.ctx.save(); CUR.bctx.save();
    CUR.ctx.setTransform(1, 0, 0, 1, 0, 0);
    CUR.bctx.setTransform(bs, 0, 0, bs, 0, 0);
    try { fn(); } finally { CUR.ctx.restore(); CUR.bctx.restore(); }
  };
  G.rgba = rgba;
  G.mix = mixHex;
  G.lighten = lighten;
  G.hsl = hsl;
  G.clamp = clamp;
  G.lerp = lerp;
  G.map = mapRange;
  G.ease = ease;
  G.rand = rand;
  G.noise = noise;
  G.smooth = smooth;

  G.graphemes = function (str) {
    str = str == null ? '' : String(str);
    ensureMeasure();
    if (SEGMENTER) { var out = []; for (var it = SEGMENTER.segment(str)[Symbol.iterator](), s = it.next(); !s.done; s = it.next()) out.push(s.value.segment); return out; }
    return Array.from(str);
  };

  G.measure = function (str, o) {
    var L = textLayout(str, o || {});
    var bm = blockMetrics(L, 0, (o && o.baseline) || 'middle');
    return { w: L.widest, h: bm.capBlock, size: L.px, lines: L.lines.slice(), lineCount: L.lines.length, widths: L.widths.slice(), lineHeight: L.lh, ascent: L.asc, descent: L.descender, rtl: L.isAr };
  };

  G.text = function (str, x, y, o) {
    o = o || {};
    var L = textLayout(str, o);
    var align = o.align === 'left' || o.align === 'right' ? o.align : 'center';
    var bm = blockMetrics(L, y, o.baseline);
    var color = o.color || '#FFFFFF';
    var alpha = o.alpha == null ? 1 : clamp(+o.alpha);
    var glow = o.glow == null ? 0 : clamp(+o.glow, 0, 2);
    var glowColor = o.glowColor || (isNearWhite(color) ? CUR.color : color);   // white text glows in the beat colour
    if (alpha > 0 && L.str) {
      dual(function (c) { drawTextLines(c, L, x, bm.firstBase, align, color, alpha); },
        glow > 0 ? function (c) { drawTextLines(c, L, x, bm.firstBase, align, glowColor, alpha * clamp(glow, 0, 1)); if (glow > 1) drawTextLines(c, L, x, bm.firstBase, align, glowColor, alpha * (glow - 1)); } : null);
    }
    var left = align === 'center' ? x - L.widest / 2 : align === 'right' ? x - L.widest : x;
    return { w: L.widest, h: bm.capBlock, size: L.px, lines: L.lines.slice(), lineCount: L.lines.length, widths: L.widths.slice(), x: left, top: bm.top, bottom: bm.bottom, baseline: bm.firstBase, lineHeight: L.lh, rtl: L.isAr };
  };

  G.roundRect = function (x, y, w, h, r, c) {
    rrPath(c || curCtx(), x, y, w, h, U(r, 2));
  };

  var GLASS_TOP = [15, 17, 23], GLASS_FLAT = [9, 10, 14], GLASS_BOT = [3, 4, 6];
  function mid3(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
  G.glass = function (x, y, w, h, o) {
    o = o || {};
    if (!(w > 0 && h > 0)) return;
    var u = CUR.u;
    var r = clamp(U(o.r, 2.4), 0, Math.min(w, h) / 2);
    var col = o.color || CUR.color;
    var rim = o.rim == null ? 0.85 : clamp(+o.rim);
    var depth = o.depth == null ? 0.6 : clamp(+o.depth);
    var glow = o.glow == null ? 0.45 : clamp(+o.glow, 0, 2);
    var shine = o.shine == null ? -1 : +o.shine;
    var alpha = o.alpha == null ? 1 : clamp(+o.alpha);
    var tint = o.tint == null ? 0.07 : clamp(+o.tint);
    if (alpha <= 0) return;
    var cp = parseColor(col);
    var top = [lerp(GLASS_FLAT[0], GLASS_TOP[0], depth), lerp(GLASS_FLAT[1], GLASS_TOP[1], depth), lerp(GLASS_FLAT[2], GLASS_TOP[2], depth)];
    var bot = [lerp(GLASS_FLAT[0], GLASS_BOT[0], depth), lerp(GLASS_FLAT[1], GLASS_BOT[1], depth), lerp(GLASS_FLAT[2], GLASS_BOT[2], depth)];
    function tintRgb(base, k) { return 'rgb(' + Math.round(lerp(base[0], cp[0], k)) + ',' + Math.round(lerp(base[1], cp[1], k)) + ',' + Math.round(lerp(base[2], cp[2], k)) + ')'; }
    var hot = lighten(col, 0.45);
    var lw = Math.max(1.5, 0.2 * u);

    dual(function (c) {
      c.globalAlpha = alpha;
      // body: near-black matte with a faint vertical falloff and light caught at the top/bottom edges
      rrPath(c, x, y, w, h, r);
      var gb = c.createLinearGradient(0, y, 0, y + h);
      gb.addColorStop(0, tintRgb(top, tint * 1.3));
      gb.addColorStop(clamp((r * 2 + 3 * u) / h, 0.06, 0.45), tintRgb(mid3(top, bot, 0.35), tint * 0.35));
      gb.addColorStop(0.72, tintRgb(mid3(top, bot, 0.75), tint * 0.2));
      gb.addColorStop(1, tintRgb(bot, tint * 0.9));
      c.fillStyle = gb;
      c.fill();
      // specular sweep across the face
      if (shine >= 0 && shine <= 1) {
        c.save();
        c.clip();
        var bw = Math.min(w, h) * 0.55, px = lerp(x - bw, x + w + bw, shine);
        c.translate(px, y + h / 2);
        c.rotate(0.35);
        var sc = lighten(col, 0.75);
        var gs = c.createLinearGradient(-bw / 2, 0, bw / 2, 0);
        gs.addColorStop(0, rgba(sc, 0));
        gs.addColorStop(0.3, rgba(sc, 0.025));
        gs.addColorStop(0.47, rgba(sc, 0.075));
        gs.addColorStop(0.5, rgba(sc, 0.11));
        gs.addColorStop(0.53, rgba(sc, 0.075));
        gs.addColorStop(0.7, rgba(sc, 0.025));
        gs.addColorStop(1, rgba(sc, 0));
        c.fillStyle = gs;
        c.fillRect(-bw / 2, -(w + h), bw, 2 * (w + h));
        c.restore();
      }
      // 1px inner top highlight
      var ins = Math.max(1, 0.12 * u);
      rrPath(c, x + ins, y + ins, w - 2 * ins, h - 2 * ins, Math.max(0, r - ins));
      var gh = c.createLinearGradient(0, y, 0, y + Math.min(h, r * 1.6 + 2 * u));
      gh.addColorStop(0, 'rgba(255,255,255,0.20)');
      gh.addColorStop(1, 'rgba(255,255,255,0)');
      c.strokeStyle = gh;
      c.lineWidth = Math.max(1, 0.1 * u);
      c.stroke();
      // neon rim light: bright top-left, dimmer sides, catching again bottom-right
      rrPath(c, x, y, w, h, r);
      var gr = c.createLinearGradient(x, y, x + w * 0.55, y + h);
      gr.addColorStop(0, rgba(hot, rim));
      gr.addColorStop(0.3, rgba(col, rim * 0.62));
      gr.addColorStop(0.68, rgba(col, rim * 0.28));
      gr.addColorStop(1, rgba(col, rim * 0.85));
      c.strokeStyle = gr;
      c.lineWidth = lw;
      c.stroke();
    }, function (c) {
      if (glow > 0) {                                  // light spilling from behind the panel
        var sp = 1.4 * u;
        rrPath(c, x - sp, y - sp, w + 2 * sp, h + 2 * sp, r + sp);
        c.fillStyle = rgba(col, clamp(glow * 0.55) * alpha);
        c.fill();
      }
      rrPath(c, x, y, w, h, r);                        // the panel occludes light behind it
      c.globalAlpha = alpha;
      c.fillStyle = '#000';
      c.fill();
      var gr = c.createLinearGradient(x, y, x + w * 0.55, y + h);
      gr.addColorStop(0, rgba(hot, rim));
      gr.addColorStop(0.35, rgba(col, rim * 0.55));
      gr.addColorStop(0.68, rgba(col, rim * 0.3));
      gr.addColorStop(1, rgba(col, rim * 0.8));
      c.strokeStyle = gr;
      c.lineWidth = Math.max(lw, 0.55 * u);
      c.stroke();
    });
  };

  G.orb = function (x, y, r, o) {
    o = o || {};
    var R = U(r, 10);
    if (!(R > 0)) return;
    var col = o.color || CUR.color;
    var core = o.core == null ? 0.6 : clamp(+o.core, 0, 1.5);
    var rim = o.rim == null ? 0.9 : clamp(+o.rim);
    var alpha = o.alpha == null ? 1 : clamp(+o.alpha);
    if (alpha <= 0) return;
    var hot = lighten(col, 0.5);
    function crescent(c) {
      c.beginPath();
      c.arc(x, y, R, 0, Math.PI * 2);
      c.moveTo(x + R * 0.985, y - R * 0.1);
      c.arc(x, y - R * 0.1, R * 0.985, 0, Math.PI * 2, true);
    }
    dual(function (c) {
      c.globalAlpha = alpha;
      c.beginPath();
      c.arc(x, y, R, 0, Math.PI * 2);
      var gb = c.createRadialGradient(x - R * 0.35, y - R * 0.45, R * 0.05, x, y, R * 1.05);
      gb.addColorStop(0, '#1a1c24');
      gb.addColorStop(0.55, '#0a0b0f');
      gb.addColorStop(1, '#030304');
      c.fillStyle = gb;
      c.fill();
      if (core > 0) {                                  // light living inside the glass
        c.globalCompositeOperation = 'lighter';
        var gc = c.createRadialGradient(x, y + R * 0.08, 0, x, y + R * 0.08, R * 0.8);
        gc.addColorStop(0, rgba(hot, 0.9 * clamp(core)));
        gc.addColorStop(0.18, rgba(col, 0.55 * clamp(core)));
        gc.addColorStop(0.55, rgba(col, 0.14 * clamp(core)));
        gc.addColorStop(1, rgba(col, 0));
        c.fillStyle = gc;
        c.fillRect(x - R, y - R, 2 * R, 2 * R);
        c.globalCompositeOperation = 'source-over';
      }
      // rim-light crescent (light wrapping from behind, strongest at the bottom)
      crescent(c);
      var gcr = c.createLinearGradient(0, y - R, 0, y + R);
      gcr.addColorStop(0, rgba(col, rim * 0.25));
      gcr.addColorStop(0.6, rgba(col, rim * 0.7));
      gcr.addColorStop(1, rgba(hot, rim));
      c.fillStyle = gcr;
      c.fill('evenodd');
      // thin full rim
      c.beginPath();
      c.arc(x, y, Math.max(0, R - 0.5), 0, Math.PI * 2);
      var grim = c.createLinearGradient(x - R, y - R, x + R * 0.4, y + R);
      grim.addColorStop(0, rgba(hot, rim * 0.55));
      grim.addColorStop(0.5, rgba(col, rim * 0.18));
      grim.addColorStop(1, rgba(col, rim * 0.7));
      c.strokeStyle = grim;
      c.lineWidth = Math.max(1, R * 0.018);
      c.stroke();
      // soft specular highlight, top-left
      c.save();
      c.translate(x - R * 0.36, y - R * 0.5);
      c.rotate(-0.6);
      c.scale(1, 0.55);
      var gsp = c.createRadialGradient(0, 0, 0, 0, 0, R * 0.34);
      gsp.addColorStop(0, 'rgba(255,255,255,0.22)');
      gsp.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = gsp;
      c.beginPath();
      c.arc(0, 0, R * 0.34, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }, function (c) {
      c.beginPath();
      c.arc(x, y, R, 0, Math.PI * 2);
      c.globalAlpha = alpha;
      c.fillStyle = '#000';
      c.fill();
      if (core > 0) {
        var gc = c.createRadialGradient(x, y + R * 0.08, 0, x, y + R * 0.08, R * 0.7);
        gc.addColorStop(0, rgba(hot, clamp(core)));
        gc.addColorStop(0.3, rgba(col, 0.5 * clamp(core)));
        gc.addColorStop(1, rgba(col, 0));
        c.fillStyle = gc;
        c.fill();
      }
      crescent(c);
      c.fillStyle = rgba(col, rim);
      c.fill('evenodd');
      c.beginPath();
      c.arc(x, y, R, 0, Math.PI * 2);
      c.strokeStyle = rgba(col, rim * 0.6);
      c.lineWidth = Math.max(2, R * 0.05);
      c.stroke();
    });
  };

  G.ring = function (x, y, r, o) {
    o = o || {};
    var R = U(r, 10);
    if (!(R > 0)) return;
    var lw = U(o.width, 0.35);
    var col = o.color || CUR.color;
    var alpha = o.alpha == null ? 1 : clamp(+o.alpha);
    var glow = o.glow == null ? 0.7 : clamp(+o.glow, 0, 2);
    var from = o.from == null ? 0 : +o.from, to = o.to == null ? 1 : +o.to;
    if (alpha <= 0 || to <= from) return;
    var a0 = -Math.PI / 2 + from * Math.PI * 2, a1 = -Math.PI / 2 + to * Math.PI * 2;
    function path(c) { c.beginPath(); c.arc(x, y, R, a0, a1); }
    dual(function (c) {
      path(c);
      c.lineCap = 'round';
      c.strokeStyle = rgba(col, alpha);
      c.lineWidth = lw;
      c.stroke();
    }, glow > 0 ? function (c) {
      path(c);
      c.lineCap = 'round';
      c.strokeStyle = rgba(col, alpha * clamp(glow));
      c.lineWidth = Math.max(lw * 3, 0.6 * CUR.u);
      c.stroke();
    } : null);
  };

  G.shockwave = function (x, y, p, o) {
    o = o || {};
    p = +p;
    if (!(p > 0 && p < 1)) return;
    var maxR = U(o.maxR, 45);
    var col = o.color || CUR.color;
    var wid = U(o.width, 1.4);
    var alpha = o.alpha == null ? 1 : clamp(+o.alpha);
    var R = maxR * ease.outCubic(p);
    var fade = Math.pow(1 - p, 1.5) * alpha;
    var th = wid * (0.3 + 0.7 * (1 - p));
    var hot = lighten(col, 0.4);
    dual(function (c) {
      c.beginPath();
      c.arc(x, y, R, 0, Math.PI * 2);
      c.strokeStyle = rgba(hot, fade);
      c.lineWidth = th;
      c.stroke();
      if (p < 0.5) {
        c.strokeStyle = rgba('#FFFFFF', fade * (1 - p * 2) * 0.9);
        c.lineWidth = th * 0.35;
        c.stroke();
      }
    }, function (c) {
      c.beginPath();
      c.arc(x, y, R, 0, Math.PI * 2);
      c.strokeStyle = rgba(col, fade);
      c.lineWidth = th * 3.5;
      c.stroke();
      if (R > th) {
        c.beginPath();
        c.arc(x, y, R * 0.82, 0, Math.PI * 2);
        c.strokeStyle = rgba(col, fade * 0.35);
        c.lineWidth = th * 5;
        c.stroke();
      }
    });
  };

  G.backlight = function (x, y, r, o) {
    o = o || {};
    var R = U(r, 30);
    if (!(R > 0)) return;
    var col = o.color || CUR.color;
    var alpha = o.alpha == null ? 0.6 : clamp(+o.alpha, 0, 2);
    if (alpha <= 0) return;
    dual(null, function (c) {
      c.globalCompositeOperation = 'lighter';
      var gr = c.createRadialGradient(x, y, 0, x, y, R);
      gr.addColorStop(0, rgba(col, clamp(alpha)));
      gr.addColorStop(0.3, rgba(col, clamp(alpha * 0.5)));
      gr.addColorStop(0.65, rgba(col, clamp(alpha * 0.14)));
      gr.addColorStop(1, rgba(col, 0));
      c.fillStyle = gr;
      c.fillRect(x - R, y - R, 2 * R, 2 * R);
      if (alpha > 1) { c.globalAlpha = alpha - 1; c.fillRect(x - R, y - R, 2 * R, 2 * R); }
    });
  };

  G.beam = function (x1, y1, x2, y2, o) {
    o = o || {};
    var len = Math.hypot(x2 - x1, y2 - y1);
    if (!(len > 0.5)) return;
    var col = o.color || CUR.color;
    var wid = U(o.width, 0.5);
    var alpha = o.alpha == null ? 1 : clamp(+o.alpha);
    var fadeEnds = o.fade !== false;
    if (alpha <= 0) return;
    var hot = lighten(col, 0.6);
    function grad(c, cA, cB, a) {
      var g = c.createLinearGradient(x1, y1, x2, y2);
      if (fadeEnds) {
        g.addColorStop(0, rgba(cA, 0));
        g.addColorStop(0.2, rgba(cA, a * 0.8));
        g.addColorStop(0.5, rgba(cB, a));
        g.addColorStop(0.8, rgba(cA, a * 0.8));
        g.addColorStop(1, rgba(cA, 0));
      } else {
        g.addColorStop(0, rgba(cA, a));
        g.addColorStop(1, rgba(cA, a));
      }
      return g;
    }
    function line(c) { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.lineCap = fadeEnds ? 'butt' : 'round'; }
    dual(function (c) {
      c.globalCompositeOperation = 'lighter';
      line(c);
      c.strokeStyle = grad(c, col, hot, alpha);
      c.lineWidth = wid;
      c.stroke();
      c.strokeStyle = grad(c, hot, '#FFFFFF', alpha * 0.85);
      c.lineWidth = Math.max(1, wid * 0.32);
      c.stroke();
    }, function (c) {
      c.globalCompositeOperation = 'lighter';
      line(c);
      c.strokeStyle = grad(c, col, hot, alpha);
      c.lineWidth = Math.max(wid * 3, 0.8 * CUR.u);
      c.stroke();
    });
  };

  G.sweep = function (p, o) {
    o = o || {};
    p = +p || 0;
    var rx = o.x == null ? 0 : +o.x, ry = o.y == null ? 0 : +o.y;
    var rw = o.w == null ? CUR.W : +o.w, rh = o.h == null ? CUR.H : +o.h;
    var col = o.color || CUR.color;
    var ang = (o.angle == null ? 20 : +o.angle) * Math.PI / 180;
    var bw = U(o.width, 20);
    var alpha = o.alpha == null ? 0.9 : clamp(+o.alpha, 0, 2);
    if (alpha <= 0 || !(rw > 0 && rh > 0)) return;
    var cx = rx + rw / 2, cy = ry + rh / 2, diag = Math.hypot(rw, rh);
    var travel = diag / 2 + bw;
    var pos = lerp(-travel, travel, clamp(p, 0, 1));
    function draw(c, a) {
      c.beginPath();
      c.rect(rx, ry, rw, rh);
      c.clip();
      c.translate(cx, cy);
      c.rotate(ang);
      var g = c.createLinearGradient(pos - bw / 2, 0, pos + bw / 2, 0);
      g.addColorStop(0, rgba(col, 0));
      g.addColorStop(0.38, rgba(col, clamp(a * 0.55)));
      g.addColorStop(0.5, rgba(lighten(col, 0.35), clamp(a)));
      g.addColorStop(0.62, rgba(col, clamp(a * 0.55)));
      g.addColorStop(1, rgba(col, 0));
      c.globalCompositeOperation = 'lighter';
      c.fillStyle = g;
      c.fillRect(pos - bw / 2, -diag / 2, bw, diag);
    }
    dual(function (c) { draw(c, alpha * 0.28); }, function (c) { draw(c, alpha); });
  };

  G.particles = function (seed, n, o) {
    o = o || {};
    n = Math.max(0, Math.min(2000, Math.floor(+n || 0)));
    if (!n) return;
    var area = o.area || { x: 0, y: 0, w: CUR.W, h: CUR.H };
    var ax = +area.x || 0, ay = +area.y || 0, aw = +area.w || CUR.W, ah = +area.h || CUR.H;
    var col = o.color || CUR.color;
    var size = U(o.size, 0.22);
    var alpha = o.alpha == null ? 0.55 : clamp(+o.alpha);
    var t = o.t == null ? CUR.t : +o.t;
    var speed = U(o.speed, 1.2);
    var edge = Math.min(aw, ah) * 0.08;
    var hot = lighten(col, 0.35);
    var pts = [];
    for (var i = 0; i < n; i++) {
      var k = seed * 7919.123 + i * 13.37;
      var z = 0.35 + 0.65 * rand(k + 0.1);
      var vx = (rand(k + 0.2) - 0.5) * speed * z * 0.8;
      var vy = -(0.25 + 0.75 * rand(k + 0.3)) * speed * z;
      var px = ax + ((rand(k + 0.4) * aw + vx * t) % aw + aw) % aw;
      var py = ay + ((rand(k + 0.5) * ah + vy * t) % ah + ah) % ah;
      var tw = 0.55 + 0.45 * Math.sin(t * (0.8 + 1.8 * rand(k + 0.6)) + rand(k + 0.7) * 6.283);
      var fe = o.area ? smooth(Math.min(px - ax, ax + aw - px, py - ay, ay + ah - py) / edge) : 1;
      var a = alpha * z * tw * fe;
      if (a > 0.004) pts.push([px, py, size * (0.5 + z), a]);
    }
    dual(function (c) {
      c.fillStyle = hot;
      for (var i = 0; i < pts.length; i++) {
        c.globalAlpha = pts[i][3];
        c.beginPath();
        c.arc(pts[i][0], pts[i][1], pts[i][2], 0, Math.PI * 2);
        c.fill();
      }
    }, function (c) {
      c.fillStyle = col;
      for (var i = 0; i < pts.length; i++) {
        c.globalAlpha = clamp(pts[i][3] * 1.2);
        c.beginPath();
        c.arc(pts[i][0], pts[i][1], Math.max(pts[i][2] * 2.6, 2 / STATE.bloomScale * 0.5), 0, Math.PI * 2);
        c.fill();
      }
    });
  };

  G.icon = function (name, x, y, size, o) {
    o = o || {};
    var path = iconPath(name) || iconPath('sparkle');
    var S = U(size, 8);
    if (!(S > 0)) return;
    var sc = S / 24;
    var col = o.color || CUR.color;
    var glowCol = o.glowColor || (isNearWhite(col) ? CUR.color : col);
    var lw = o.width == null ? S * 1.75 / 24 : U(o.width, 0.5);
    var alpha = o.alpha == null ? 1 : clamp(+o.alpha);
    var glow = o.glow == null ? 0.5 : clamp(+o.glow, 0, 2);
    if (alpha <= 0) return;
    function prep(c) {
      c.translate(x - S / 2, y - S / 2);
      c.scale(sc, sc);
      c.lineCap = 'round';
      c.lineJoin = 'round';
    }
    dual(function (c) {
      prep(c);
      c.strokeStyle = rgba(col, alpha);
      c.lineWidth = lw / sc;
      c.stroke(path);
      if (o.hot) {
        c.strokeStyle = rgba('#FFFFFF', alpha * clamp(+o.hot));
        c.lineWidth = lw * 0.45 / sc;
        c.stroke(path);
      }
    }, glow > 0 ? function (c) {
      prep(c);
      c.strokeStyle = rgba(glowCol, alpha * clamp(glow));
      c.lineWidth = Math.max(lw * 2.4, 0.5 * CUR.u) / sc;
      c.stroke(path);
    } : null);
  };

  // Draw the brand logo image (if the film has one and it decoded), centred at (x, y), height h in units.
  G.logo = function (x, y, h, o) {
    o = o || {};
    var lg = STATE.logo;
    if (!lg) return null;
    var hh = U(h, 12), ww = hh * lg.aspect;
    if (o.maxWidth > 0 && ww > o.maxWidth) { ww = +o.maxWidth; hh = ww / lg.aspect; }
    var alpha = o.alpha == null ? 1 : clamp(+o.alpha);
    var glow = o.glow == null ? 0.5 : clamp(+o.glow);
    var align = o.align || 'center';
    var lx = align === 'left' ? x : align === 'right' ? x - ww : x - ww / 2;
    if (alpha > 0) {
      dual(function (c) { c.globalAlpha = alpha; c.drawImage(lg.img, lx, y - hh / 2, ww, hh); },
        glow > 0 ? function (c) { c.globalAlpha = alpha * glow; c.drawImage(lg.img, lx, y - hh / 2, ww, hh); } : null);
    }
    return { w: ww, h: hh, x: lx, y: y - hh / 2 };
  };

  // ───────────────────────────────────────────────────────────── frame pipeline

  function cameraFor(beat, s, W, H, u) {
    var mode = beat.camera || 'push';
    var k = 0.05 * (0.5 + s.energy);
    var p = clamp(s.p);
    var ep = 0.35 * p + 0.65 * ease.outCubic(p);
    var sc = 1, dx = 0, dy = 0;
    if (mode === 'push') sc = 1 + k * ep;
    else if (mode === 'pull') sc = 1 + k * (1 - ep);
    else if (mode === 'drift') {
      var seed = s.index * 31 + 7;
      sc = 1 + 0.015 * (0.5 + s.energy) * ep;
      dx = noise(s.t * 0.32, seed) * 1.6 * u;
      dy = noise(s.t * 0.27, seed + 11) * 1.1 * u;
    }
    return { scale: sc, x: dx, y: dy, tx: W / 2 * (1 - sc) + dx, ty: H / 2 * (1 - sc) + dy, mode: mode };
  }

  // Undo whatever state a shot left behind (unbalanced save(), transforms, filters...) WITHOUT clearing pixels.
  function unwind(c) {
    for (var i = 0; i < 64; i++) c.restore();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = 1;
    c.globalCompositeOperation = 'source-over';
    c.filter = 'none';
    c.shadowBlur = 0;
    c.shadowOffsetX = c.shadowOffsetY = 0;
    c.shadowColor = 'rgba(0,0,0,0)';
    if (c.setLineDash) c.setLineDash([]);
    if (HAS_LS) c.letterSpacing = '0px';
    c.direction = 'ltr';
    c.imageSmoothingEnabled = true;
  }
  // Start of a frame: fresh state (reset() also empties the save stack) and a pure black bitmap.
  function clearCtx(c, w, h) {
    if (typeof c.reset === 'function') c.reset(); else unwind(c);
    c.imageSmoothingEnabled = true;
    c.fillStyle = '#000';
    c.fillRect(0, 0, w, h);
  }

  function renderFrame(f) {
    var st = STATE;
    if (!st) return -1;
    if (st.dirty) rebuild();
    f = Math.max(0, Math.min(st.frameCount - 1, Math.floor(+f || 0)));
    st.frame = f;
    var W = st.w, H = st.h, u = Math.min(W, H) / 100;
    st.u = u;
    var bs = BLOOM_SCALE;
    st.bloomScale = bs;
    var ctx = st.ctx, bctx = st.bloom.ctx;
    clearCtx(ctx, W, H);
    clearCtx(bctx, st.bloom.canvas.width, st.bloom.canvas.height);

    var tl = st.timeline;
    if (!tl.length) { NGM.frame = f; return f; }
    var bi = beatIndexAt(f), row = tl[bi];
    var beat = deepClone(st.beatsMerged[bi]);
    var pal = st.palette[bi];
    var local = f - row.startFrame, fps = st.fps;
    var t = local / fps, dur = row.frames / fps;
    var film = st.film;
    var s = {
      t: t, dur: dur, p: t / dur, frame: local, index: bi, count: tl.length, beat: beat,
      color: pal.color, color2: pal.color2, brand: pal.brand, accent: pal.accent,
      energy: film.look.energy, density: film.look.density, temperature: film.look.temperature,
      film: film, fps: fps, isFirst: bi === 0, isLast: bi === tl.length - 1,
      id: row.id, hash: row.hash, logo: st.logo ? st.logo.img : null, logoInfo: st.logo,
      in: function (sec, d) { d = d || 0; if (!(sec > 0)) return t >= d ? 1 : 0; return clamp((t - d) / sec); },
      out: function (sec) { if (!(sec > 0)) return 1; return clamp((dur - t) / sec); },
      seg: function (a, b) { if (b <= a) return t >= b ? 1 : 0; return clamp((t - a) / (b - a)); }
    };
    var cam = cameraFor(beat, s, W, H, u);
    s.camera = cam;
    var aspect = W / H < 0.9 ? 'portrait' : W / H > 1.1 ? 'landscape' : 'square';
    var g = Object.create(G);
    g.ctx = ctx; g.bctx = bctx; g.W = W; g.H = H; g.cx = W / 2; g.cy = H / 2; g.u = u; g.min = Math.min(W, H); g.max = Math.max(W, H);
    g.aspect = aspect;
    g.safe = { x: Math.round(W * 0.08), y: Math.round(H * 0.08), w: Math.round(W * 0.84), h: Math.round(H * 0.84) };
    g.color = pal.color; g.color2 = pal.color2;
    g.cam = cam; g.fonts = st.fonts; g.t = t;
    CUR = { ctx: ctx, bctx: bctx, W: W, H: H, u: u, t: t, color: pal.color, target: ctx, targetIsBloom: false };
    LIT_DEPTH = 0;

    ctx.setTransform(cam.scale, 0, 0, cam.scale, cam.tx, cam.ty);
    bctx.setTransform(cam.scale * bs, 0, 0, cam.scale * bs, cam.tx * bs, cam.ty * bs);
    var def = NGM.shots[beat.shot], err = null;
    ctx.save(); bctx.save();
    try {
      if (!def) throw new Error('unknown shot "' + beat.shot + '"');
      def.draw(g, s);
    } catch (e) {
      err = e;
    }
    LIT_DEPTH = 0;
    unwind(ctx);
    unwind(bctx);
    compositeBloom(st, film.look.energy);

    if (beat.cut === 'flash' && local < 2) {
      var k = local === 0 ? 1 : 0.38;
      ctx.globalCompositeOperation = 'lighter';
      var gr = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.hypot(W, H) * 0.55);
      gr.addColorStop(0, rgba('#FFFFFF', 0.95 * k));
      gr.addColorStop(0.35, rgba(lighten(pal.color, 0.55), 0.7 * k));
      gr.addColorStop(1, rgba(pal.color, 0.3 * k));
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
    }
    if (err) {
      var msg = 'beat ' + (bi + 1) + ' "' + row.id + '" (' + beat.shot + '): ' + (err && err.message ? err.message : String(err));
      if (st.lastErr !== msg) { st.lastErr = msg; if (root.console) console.error('[NGM] ' + msg, err); }
      NGM.error = msg;
      ctx.font = '600 ' + Math.round(1.6 * u) + 'px ui-monospace, "DejaVu Sans Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = '#FF3355';
      ctx.fillText(msg.slice(0, 160), 2 * u, H - 2 * u);
    }
    CUR = null;
    NGM.frame = f;
    return f;
  }

  function compositeBloom(st, energy) {
    var b = st.bloom, tp = st.tmp, tctx = tp.ctx, bw = b.canvas.width, bh = b.canvas.height;
    var ub = st.u * BLOOM_SCALE;
    var r1 = ub * 1.2 * (0.8 + 0.4 * energy);
    var r2 = ub * 4.0 * (0.7 + 0.6 * energy);
    var a1 = 0.75 + 0.45 * energy;
    var a2 = 0.55 + 0.6 * energy;
    tctx.fillStyle = '#000';
    tctx.fillRect(0, 0, bw, bh);
    tctx.globalCompositeOperation = 'lighter';
    tctx.filter = 'blur(' + r1.toFixed(2) + 'px)';
    tctx.globalAlpha = clamp(a1);
    tctx.drawImage(b.canvas, 0, 0);
    if (a1 > 1) { tctx.globalAlpha = a1 - 1; tctx.drawImage(b.canvas, 0, 0); }
    tctx.filter = 'blur(' + r2.toFixed(2) + 'px)';
    tctx.globalAlpha = clamp(a2);
    tctx.drawImage(b.canvas, 0, 0);
    if (a2 > 1) { tctx.globalAlpha = a2 - 1; tctx.drawImage(b.canvas, 0, 0); }
    tctx.filter = 'none';
    tctx.globalAlpha = 1;
    tctx.globalCompositeOperation = 'source-over';
    var ctx = st.ctx;
    ctx.globalCompositeOperation = 'lighter';
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
    ctx.drawImage(tp.canvas, 0, 0, bw, bh, 0, 0, bw / BLOOM_SCALE, bh / BLOOM_SCALE);
    ctx.globalCompositeOperation = 'source-over';
  }

  // ───────────────────────────────────────────────────────────── public API

  NGM.seekFrame = function (f) { return renderFrame(f); };
  NGM.seek = function (t) {
    if (!STATE) return -1;
    return renderFrame(Math.floor((+t || 0) * STATE.fps + 1e-6));
  };
  NGM.draw = function () { return STATE ? renderFrame(STATE.frame) : -1; };
  NGM.fps = function () { return STATE ? STATE.fps : 30; };
  NGM.frameCount = function () { if (!STATE) return 0; if (STATE.dirty) rebuild(); return STATE.frameCount; };
  NGM.duration = function () { if (!STATE) return 0; if (STATE.dirty) rebuild(); return STATE.frameCount / STATE.fps; };
  NGM.size = function () { return STATE ? { w: STATE.w, h: STATE.h } : { w: 0, h: 0 }; };
  NGM.currentFrame = function () { return STATE ? STATE.frame : 0; };
  NGM.timeline = function () {
    if (!STATE) return [];
    if (STATE.dirty) rebuild();
    return STATE.timeline.map(function (r) {
      return { index: r.index, id: r.id, shot: r.shot, startFrame: r.startFrame, endFrame: r.endFrame, frames: r.frames, t0: r.t0, t1: r.t1, hash: r.hash, color: r.color };
    });
  };
  NGM.palette = function () {
    if (!STATE) return [];
    if (STATE.dirty) rebuild();
    return STATE.palette.map(function (p) { return { color: p.color, color2: p.color2, brand: p.brand, accent: p.accent }; });
  };
  NGM.beatAt = function (f) { return STATE && STATE.timeline.length ? beatIndexAt(Math.max(0, Math.min(STATE.frameCount - 1, f | 0))) : -1; };
  NGM.capture = function (type, quality) {
    var t = String(type || 'png').toLowerCase();
    var mime = t === 'jpg' || t === 'jpeg' ? 'image/jpeg' : t === 'webp' ? 'image/webp' : 'image/png';
    return new Promise(function (res) {
      if (!STATE) return res('');
      var c = STATE.canvas;
      function viaDataUrl() { var u = c.toDataURL(mime, quality); res(u.slice(u.indexOf(',') + 1)); }
      if (!c.toBlob || typeof FileReader === 'undefined') return viaDataUrl();
      c.toBlob(function (blob) {                      // bitmap is snapshotted synchronously; encoding happens off-thread
        if (!blob) return viaDataUrl();
        var fr = new FileReader();
        fr.onload = function () { var s = String(fr.result); res(s.slice(s.indexOf(',') + 1)); };
        fr.onerror = viaDataUrl;
        fr.readAsDataURL(blob);
      }, mime, quality);
    });
  };
  NGM.icons = ICON_NAMES.slice();
  NGM.util = {
    clamp: clamp, lerp: lerp, map: mapRange, rand: rand, noise: noise, hash: hashHex, rgba: rgba, mix: mixHex,
    lighten: lighten, neonize: neonize, arcColor: arcColor, stableStringify: stableStringify
  };
  NGM.fatal = function (msg) {
    msg = String(msg && msg.message ? msg.message : msg);
    NGM.error = msg;
    if (!doc || !doc.body) return;
    var d = doc.createElement('div');
    d.className = 'ngm-fatal';
    d.innerHTML = '<div><b>This film could not start</b><code></code></div>';
    d.querySelector('code').textContent = msg;
    doc.body.appendChild(d);
  };

  // ───────────────────────────────────────────────────────────── player UI

  var PLAYER_CSS = [
    '.ngm-app{position:fixed;inset:0;display:flex;flex-direction:column;background:#000;color:#e8eaf0;',
    'font:500 13px/1.2 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;-webkit-font-smoothing:antialiased;',
    '-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent}',
    '.ngm-stage{position:relative;flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:pointer}',
    '.ngm-stage canvas{display:block;outline:1px solid rgba(255,255,255,.07);outline-offset:0}',
    '.ngm-big{position:absolute;left:50%;top:50%;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;display:grid;place-items:center;',
    'background:rgba(10,11,15,.55);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);',
    'color:#fff;opacity:0;transform:scale(.9);transition:opacity .18s ease,transform .18s ease;pointer-events:none}',
    '.ngm-big svg{width:24px;height:24px;margin-left:3px}',
    '.ngm-app.is-paused .ngm-big{opacity:1;transform:scale(1)}',
    '.ngm-bar{flex:0 0 auto;padding:12px 18px calc(12px + env(safe-area-inset-bottom));background:linear-gradient(180deg,#0b0c10,#07080a);',
    'border-top:1px solid rgba(255,255,255,.07)}',
    '.ngm-track{position:relative;height:34px;display:flex;gap:3px;cursor:pointer;touch-action:none;outline:none;margin:2px 0 10px}',
    '.ngm-track:focus-visible{box-shadow:0 0 0 2px rgba(255,255,255,.35);border-radius:7px}',
    '.ngm-seg{position:relative;flex:1 1 0;min-width:3px;border-radius:6px;overflow:hidden;background:var(--dim);transition:box-shadow .15s}',
    '.ngm-seg i{position:absolute;left:0;top:0;bottom:0;width:0;background:var(--mid)}',
    '.ngm-seg:before{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:var(--c);opacity:.95;z-index:1}',
    '.ngm-seg span{position:absolute;left:9px;right:6px;top:50%;transform:translateY(-40%);z-index:1;',
    'font:600 10.5px/1 "JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.01em;color:rgba(255,255,255,.92);',
    'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none}',
    '.ngm-seg span em{font-style:normal;color:rgba(255,255,255,.46);margin-left:6px}',
    '.ngm-seg.on{box-shadow:inset 0 0 0 1px var(--c)}',
    '.ngm-head{position:absolute;top:-6px;bottom:-6px;left:0;width:2px;margin-left:-1px;background:#fff;border-radius:2px;pointer-events:none;z-index:3;',
    'box-shadow:0 0 10px rgba(255,255,255,.55)}',
    '.ngm-head:before{content:"";position:absolute;top:-4px;left:-4px;width:10px;height:10px;border-radius:50%;background:#fff}',
    '.ngm-tip{position:absolute;bottom:calc(100% + 12px);left:0;transform:translateX(-50%);padding:5px 8px;border-radius:7px;background:#16181f;',
    'border:1px solid rgba(255,255,255,.1);color:#fff;font:600 11px/1 "JetBrains Mono",ui-monospace,monospace;white-space:nowrap;',
    'opacity:0;transition:opacity .12s;pointer-events:none;z-index:4;box-shadow:0 6px 20px rgba(0,0,0,.5)}',
    '.ngm-tip b{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:6px;vertical-align:0}',
    '.ngm-track:hover .ngm-tip,.ngm-track.drag .ngm-tip{opacity:1}',
    '.ngm-row{display:flex;align-items:center;gap:14px;min-height:42px}',
    '.ngm-grp{display:flex;align-items:center;gap:4px;flex:0 0 auto}',
    '.ngm-btn{-webkit-appearance:none;appearance:none;border:0;margin:0;background:transparent;color:#b9bdc9;width:36px;height:36px;border-radius:9px;',
    'display:inline-flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;padding:0;transition:background .12s,color .12s,transform .12s;',
    'font:600 12px/1 Inter,-apple-system,system-ui,sans-serif}',
    '.ngm-btn:hover{background:rgba(255,255,255,.07);color:#fff}',
    '.ngm-btn:active{transform:scale(.94)}',
    '.ngm-btn:focus-visible{outline:2px solid rgba(255,255,255,.55);outline-offset:1px}',
    '.ngm-btn svg{width:18px;height:18px;flex:0 0 auto}',
    '.ngm-play{width:42px;height:42px;border-radius:50%;background:#fff;color:#000;margin:0 4px}',
    '.ngm-play:hover{background:#fff;color:#000;transform:scale(1.05)}',
    '.ngm-play svg{width:18px;height:18px}',
    '.ngm-btn[aria-pressed="true"]{color:#fff;background:rgba(255,255,255,.1)}',
    '.ngm-png{width:auto;padding:0 12px;border:1px solid rgba(255,255,255,.12);color:#e8eaf0}',
    '.ngm-read{display:flex;flex-direction:column;justify-content:center;gap:5px;margin-left:8px;min-width:0}',
    '.ngm-time{font:600 13px/1 "JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;font-variant-numeric:tabular-nums;color:#fff;white-space:nowrap}',
    '.ngm-fsm{display:none;font:500 10.5px/1 "JetBrains Mono",ui-monospace,monospace;font-variant-numeric:tabular-nums;color:rgba(255,255,255,.45);white-space:nowrap}',
    '.ngm-time em{font-style:normal;color:rgba(255,255,255,.38)}',
    '.ngm-mid{flex:1 1 auto;min-width:0;display:flex;align-items:center;justify-content:center;gap:10px;overflow:hidden;white-space:nowrap}',
    '.ngm-title{font-weight:600;color:rgba(255,255,255,.82);overflow:hidden;text-overflow:ellipsis;min-width:0}',
    '.ngm-meta{font:500 11px/1 "JetBrains Mono",ui-monospace,monospace;color:rgba(255,255,255,.38);flex:0 0 auto}',
    '.ngm-frame{font:600 12px/1 "JetBrains Mono",ui-monospace,monospace;font-variant-numeric:tabular-nums;color:rgba(255,255,255,.55);white-space:nowrap;margin-right:6px}',
    '.ngm-frame b{color:#fff;font-weight:600}',
    '.ngm-kbd{position:absolute;right:16px;top:14px;font:500 11px/1.6 "JetBrains Mono",ui-monospace,monospace;color:rgba(255,255,255,.34);text-align:right;pointer-events:none}',
    '@media (max-width:760px){.ngm-mid{display:none}.ngm-row{justify-content:space-between}.ngm-kbd{display:none}}',
    '@media (max-width:520px){.ngm-bar{padding:10px 12px calc(10px + env(safe-area-inset-bottom))}.ngm-hide-sm{display:none}',
    '.ngm-seg span em{display:none}.ngm-seg span{left:6px;font-size:10px}.ngm-row{gap:6px}.ngm-grp{gap:2px}.ngm-time{font-size:12px}',
    '.ngm-read{margin-left:4px}.ngm-frame{display:none}.ngm-fsm{display:block}',
    '.ngm-png{width:36px;padding:0}.ngm-png span{display:none}.ngm-btn{width:34px;height:34px}.ngm-play{width:40px;height:40px;margin:0 2px}',
    '.ngm-big{width:52px;height:52px;margin:-26px 0 0 -26px}.ngm-big svg{width:20px;height:20px}}',
    '@media (hover:none){.ngm-kbd{display:none}}'
  ].join('');

  var SVG = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.8v14.4a1 1 0 0 0 1.5.86l12-7.2a1 1 0 0 0 0-1.72l-12-7.2A1 1 0 0 0 7 4.8Z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5.5" y="4" width="4.5" height="16" rx="1.2"/><rect x="14" y="4" width="4.5" height="16" rx="1.2"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 6.5 9 12l5.5 5.5"/></svg>',
    fwd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 6.5 15 12l-5.5 5.5"/></svg>',
    start: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 5.5v13M17.5 6.5 12 12l5.5 5.5"/></svg>',
    end: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 5.5v13M6.5 6.5 12 12l-5.5 5.5"/></svg>',
    loop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2.5 20.5 6 17 9.5"/><path d="M3.5 11.5V10a4 4 0 0 1 4-4h13"/><path d="M7 21.5 3.5 18 7 14.5"/><path d="M20.5 12.5V14a4 4 0 0 1-4 4h-13"/></svg>',
    png: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5v11M7.5 10l4.5 4.5 4.5-4.5M4.5 19.5h15"/></svg>'
  };

  function fmtTime(t) {
    t = Math.max(0, t);
    var m = Math.floor(t / 60), s = t - m * 60;
    var ss = s.toFixed(2);
    if (s < 10) ss = '0' + ss;
    return m + ':' + ss;
  }
  function pad(n, w) { n = String(n); while (n.length < w) n = '0' + n; return n; }
  function slug(s) { return String(s || 'film').toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'film'; }
  function el(tag, cls, html) { var e = doc.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  NGM.player = function () {
    if (NGM.renderMode || !doc) return null;
    if (!STATE) throw new Error('Call NGM.load(film) before NGM.player()');
    if (PLAYER) { PLAYER.refresh(); return PLAYER.api; }

    var style = el('style');
    style.id = 'ngm-player-css';
    style.textContent = PLAYER_CSS;
    doc.head.appendChild(style);

    var app = el('div', 'ngm-app is-paused');
    var stage = el('div', 'ngm-stage');
    var big = el('div', 'ngm-big', SVG.play);
    var kbd = el('div', 'ngm-kbd', 'Space play · ←/→ frame · ⇧ 1s · L loop');
    var bar = el('div', 'ngm-bar');
    var track = el('div', 'ngm-track');
    track.setAttribute('role', 'slider');
    track.setAttribute('tabindex', '0');
    track.setAttribute('aria-label', 'Timeline');
    var segWrap = track;
    var head = el('div', 'ngm-head');
    var tip = el('div', 'ngm-tip');
    var row = el('div', 'ngm-row');
    var left = el('div', 'ngm-grp');
    function btn(name, title, cls) {
      var b = el('button', 'ngm-btn' + (cls ? ' ' + cls : ''), SVG[name]);
      b.type = 'button';
      b.title = title;
      b.setAttribute('aria-label', title);
      b.setAttribute('data-a', name);
      return b;
    }
    var bStart = btn('start', 'Go to start (Home)', 'ngm-hide-sm');
    var bBack = btn('back', 'Back one frame (←, Shift = 1 s)');
    var bPlay = btn('play', 'Play / pause (Space)', 'ngm-play');
    var bFwd = btn('fwd', 'Forward one frame (→, Shift = 1 s)');
    var bEnd = btn('end', 'Go to end (End)', 'ngm-hide-sm');
    var read = el('div', 'ngm-read');
    var time = el('div', 'ngm-time');
    var frameSm = el('div', 'ngm-fsm');
    read.appendChild(time); read.appendChild(frameSm);
    left.appendChild(bStart); left.appendChild(bBack); left.appendChild(bPlay); left.appendChild(bFwd); left.appendChild(bEnd); left.appendChild(read);
    var mid = el('div', 'ngm-mid');
    var titleEl = el('div', 'ngm-title');
    var metaEl = el('div', 'ngm-meta');
    mid.appendChild(titleEl); mid.appendChild(metaEl);
    var right = el('div', 'ngm-grp');
    var frameEl = el('div', 'ngm-frame');
    var bLoop = btn('loop', 'Loop (L)');
    var bPng = btn('png', 'Export PNG of this frame', 'ngm-png');
    bPng.insertAdjacentHTML('beforeend', '<span>PNG</span>');
    right.appendChild(frameEl); right.appendChild(bLoop); right.appendChild(bPng);
    row.appendChild(left); row.appendChild(mid); row.appendChild(right);
    bar.appendChild(track); bar.appendChild(row);
    stage.appendChild(STATE.canvas);
    stage.appendChild(big);
    stage.appendChild(kbd);
    app.appendChild(stage); app.appendChild(bar);
    doc.body.appendChild(app);

    var P = {
      playing: false, loop: true, t0: 0, wall0: 0, raf: 0, segs: [], lastSeg: -1, dragging: false, wasPlaying: false, ready: false, autoplay: true
    };

    function fit() {
      var sw = stage.clientWidth, sh = stage.clientHeight;
      var padPx = sw < 520 ? 10 : 24;
      var sc = Math.min((sw - 2 * padPx) / STATE.w, (sh - 2 * padPx) / STATE.h);
      if (!(sc > 0)) sc = 0.01;
      STATE.canvas.style.width = Math.floor(STATE.w * sc) + 'px';
      STATE.canvas.style.height = Math.floor(STATE.h * sc) + 'px';
    }

    function buildSegs() {
      P.segs.forEach(function (s) { s.remove(); });
      P.segs = [];
      var tl = NGM.timeline();
      tl.forEach(function (r) {
        var sg = el('div', 'ngm-seg');
        sg.style.flexGrow = String(r.frames);
        sg.style.setProperty('--c', r.color);
        sg.style.setProperty('--dim', rgba(r.color, 0.16));
        sg.style.setProperty('--mid', rgba(r.color, 0.42));
        var sp = el('span');
        sp.textContent = r.id;
        var em = el('em');
        em.textContent = r.shot;
        sp.appendChild(em);
        sg.appendChild(sp);
        sg.appendChild(el('i'));
        sg.title = (r.index + 1) + '. ' + r.id + ' · ' + r.shot + ' · ' + fmtTime(r.t0) + '–' + fmtTime(r.t1);
        segWrap.insertBefore(sg, head);
        P.segs.push(sg);
      });
      P.lastSeg = -1;
      var film = STATE.film;
      titleEl.textContent = film.title;
      metaEl.textContent = film.ratio + ' · ' + STATE.w + '×' + STATE.h + ' · ' + STATE.fps + ' fps · ' + NGM.duration().toFixed(1) + ' s';
      track.setAttribute('aria-valuemin', '0');
      track.setAttribute('aria-valuemax', String(NGM.frameCount() - 1));
    }
    track.appendChild(head);
    track.appendChild(tip);

    function segRectLocal(i) {
      var s = P.segs[i];
      return { left: s.offsetLeft, width: s.offsetWidth };
    }
    function updateUI() {
      var f = STATE.frame, fc = STATE.frameCount, fps = STATE.fps;
      var tl = STATE.timeline;
      if (!tl.length) return;
      var bi = beatIndexAt(f), r = tl[bi];
      if (bi !== P.lastSeg) {
        P.segs.forEach(function (s, i) {
          s.classList.toggle('on', i === bi);
          s.firstChild.nextSibling.style.width = i < bi ? '100%' : '0%';
        });
        P.lastSeg = bi;
      }
      var frac = (f - r.startFrame + 1) / r.frames;
      if (P.segs[bi]) {
        P.segs[bi].lastChild.style.width = (frac * 100).toFixed(2) + '%';
        var rr = segRectLocal(bi);
        head.style.transform = 'translateX(' + (rr.left + rr.width * ((f - r.startFrame) / r.frames)).toFixed(1) + 'px)';
      }
      time.innerHTML = fmtTime(f / fps) + ' <em>/ ' + fmtTime(fc / fps) + '</em>';
      frameEl.innerHTML = 'F <b>' + pad(f, String(fc - 1).length) + '</b> / ' + (fc - 1);
      frameSm.textContent = 'frame ' + f + ' / ' + (fc - 1) + ' · ' + r.id;
      track.setAttribute('aria-valuenow', String(f));
      track.setAttribute('aria-valuetext', fmtTime(f / fps) + ', beat ' + r.id);
    }
    function show(f) { renderFrame(f); updateUI(); }
    function setPlaying(v) {
      P.playing = v;
      bPlay.innerHTML = v ? SVG.pause : SVG.play;
      app.classList.toggle('is-paused', !v);
      if (v) {
        P.t0 = STATE.frame / STATE.fps;
        P.wall0 = performance.now();
        cancelAnimationFrame(P.raf);
        P.raf = requestAnimationFrame(tick);
      } else cancelAnimationFrame(P.raf);
    }
    function tick(now) {
      if (!P.playing) return;
      var fc = STATE.frameCount, fps = STATE.fps;
      var t = P.t0 + (now - P.wall0) / 1000;
      var f = Math.floor(t * fps + 1e-6);
      if (f >= fc) {
        if (P.loop) { P.t0 = 0; P.wall0 = now; f = 0; }
        else { show(fc - 1); setPlaying(false); return; }
      }
      if (f !== STATE.frame) show(f);
      P.raf = requestAnimationFrame(tick);
    }
    function play() {
      if (STATE.frame >= STATE.frameCount - 1) show(0);
      setPlaying(true);
    }
    function pause() { setPlaying(false); }
    function toggle() { if (P.playing) pause(); else play(); }
    function step(n) { pause(); show(STATE.frame + n); }
    function seekFrame(f) { var was = P.playing; show(f); if (was) setPlaying(true); }
    function setLoop(v) { P.loop = !!v; bLoop.setAttribute('aria-pressed', String(P.loop)); }
    function exportPng() {
      var f = STATE.frame, name = slug(STATE.film.title) + '-frame-' + pad(f, 4) + '.png';
      STATE.canvas.toBlob(function (blob) {
        if (!blob) return;
        var a = doc.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        doc.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
      }, 'image/png');
    }

    function frameFromX(clientX) {
      var tl = STATE.timeline;
      for (var i = 0; i < P.segs.length; i++) {
        var rc = P.segs[i].getBoundingClientRect();
        if (clientX < rc.left) return tl[i].startFrame;
        if (clientX <= rc.right) {
          var fr = clamp((clientX - rc.left) / Math.max(1, rc.width));
          return Math.min(tl[i].endFrame - 1, tl[i].startFrame + Math.floor(fr * tl[i].frames));
        }
      }
      return STATE.frameCount - 1;
    }
    function showTip(clientX) {
      var f = frameFromX(clientX), bi = beatIndexAt(f), r = STATE.timeline[bi];
      var tr = track.getBoundingClientRect();
      var x = clamp(clientX - tr.left, 40, tr.width - 40);
      tip.style.left = x + 'px';
      tip.innerHTML = '<b style="background:' + r.color + '"></b>';
      tip.appendChild(doc.createTextNode(fmtTime(f / STATE.fps) + '  ' + r.id));
    }

    track.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      P.dragging = true;
      P.wasPlaying = P.playing;
      pause();
      track.classList.add('drag');
      try { track.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      show(frameFromX(e.clientX));
      showTip(e.clientX);
      e.preventDefault();
    });
    track.addEventListener('pointermove', function (e) {
      showTip(e.clientX);
      if (P.dragging) show(frameFromX(e.clientX));
    });
    function endDrag() {
      if (!P.dragging) return;
      P.dragging = false;
      track.classList.remove('drag');
      if (P.wasPlaying) setPlaying(true);
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowUp' || e.key === 'PageUp') { step(STATE.fps); e.preventDefault(); }
      else if (e.key === 'ArrowDown' || e.key === 'PageDown') { step(-STATE.fps); e.preventDefault(); }
    });

    bStart.onclick = function () { seekFrame(0); };
    bEnd.onclick = function () { pause(); show(STATE.frameCount - 1); };
    bBack.onclick = function (e) { step(e.shiftKey ? -STATE.fps : -1); };
    bFwd.onclick = function (e) { step(e.shiftKey ? STATE.fps : 1); };
    bPlay.onclick = toggle;
    bLoop.onclick = function () { setLoop(!P.loop); };
    bPng.onclick = exportPng;
    stage.addEventListener('click', function (e) { if (e.target === STATE.canvas || e.target === stage) toggle(); });

    doc.addEventListener('keydown', function (e) {
      var tg = e.target, tn = tg && tg.tagName;
      if (tn === 'INPUT' || tn === 'TEXTAREA' || tn === 'SELECT' || (tg && tg.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var k = e.key;
      if (k === ' ' || k === 'Spacebar' || k === 'k' || k === 'K') {
        e.preventDefault();
        if (!e.repeat) toggle();
      } else if (k === 'ArrowLeft' || k === ',') { e.preventDefault(); step(e.shiftKey ? -STATE.fps : -1); }
      else if (k === 'ArrowRight' || k === '.') { e.preventDefault(); step(e.shiftKey ? STATE.fps : 1); }
      else if (k === 'Home') { e.preventDefault(); seekFrame(0); }
      else if (k === 'End') { e.preventDefault(); pause(); show(STATE.frameCount - 1); }
      else if (k === 'l' || k === 'L') { e.preventDefault(); setLoop(!P.loop); }
    });
    // Space on a focused button must not also "click" it (its native activation fires on keyup).
    doc.addEventListener('keyup', function (e) {
      if ((e.key === ' ' || e.key === 'Spacebar') && e.target && e.target.tagName === 'BUTTON') e.preventDefault();
    });
    doc.addEventListener('visibilitychange', function () {
      if (!doc.hidden && P.playing) { P.t0 = STATE.frame / STATE.fps; P.wall0 = performance.now(); }
    });
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(function () { fit(); updateUI(); }).observe(stage);
    root.addEventListener('resize', function () { fit(); updateUI(); });

    P.refresh = function () {
      pause();
      buildSegs();
      fit();
      show(Math.min(STATE.frame, STATE.frameCount - 1));
    };
    function autoplay() { if (P.autoplay) { P.autoplay = false; show(0); setPlaying(true); } }
    P.onReady = function () {
      P.ready = true;
      buildSegs();
      if (!P.playing) show(STATE.frame);
      autoplay();
    };
    P.api = {
      play: play, pause: pause, toggle: toggle, step: step, seekFrame: seekFrame, setLoop: setLoop, exportPng: exportPng,
      isPlaying: function () { return P.playing; }, element: app
    };
    PLAYER = P;
    NGM.ui = P.api;
    setLoop(true);
    buildSegs();
    fit();
    show(0);
    NGM.ready.then(function () { if (PLAYER === P && !P.ready) P.onReady(); });
    setTimeout(autoplay, 2500);                     // slow font CDN: start anyway, fonts swap in when they land
    return P.api;
  };
})();
