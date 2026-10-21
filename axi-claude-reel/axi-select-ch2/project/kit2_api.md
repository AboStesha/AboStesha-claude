# Kit 2 API (comp/src/15_kit2.js) for the video 2 group builders

All functions live in the shared fx.js scope (00_head, 10_kit, 15_kit2, 20_studio, your 3N file, 90_main).
Coordinates are screen px unless you draw them inside a transform of your own. Times passed in are whatever
your group uses (output s or VO s), as long as you are consistent. Private helpers start with `k2_`: do not call
them and do not reuse the prefix. Costs are per call, measured in the page with the raster flushed (headless Chromium,
software raster), at the spec's sizes.

Where the code differs from the kit_additions text, this page says so: build from the numbers here, not from the spec
text, and do not re-anchor from the spec.

## sym() names (K1-K4)

`sym(x, name, cx, cy, size, o)` from 10_kit.js. The four new names go through its `SYM_EXT` hook and follow its
conventions exactly: 100-unit box centred on (cx, cy), y down; white strokes 3.2 % of size (min 2.5 px), round
caps and joins; draw-on by dash progress on `o.u`; red fills fade in over the last 12 % of `o.u`; one RED element.

| name | what | state `o.k` | cost |
|---|---|---|---|
| `tickets` | 3 stacked TAG tickets 58x28, back to front, transparent (no fill), RED dot in the front one (40 trades) | none | 0.12 ms at 44 px |
| `target` | dashed target line (fades in with e2(u); butt-capped dashes), rising line ending on the RED dot (+7 %) | none | 0.02 ms |
| `calendar` | body, header, 2 rings, 8 day cells filled RTL (top row, then bottom); cell 8 (bottom-left) RED (60 days) | `{ fill: 0..1 }`, default 1 | 0.05 ms at 110 px (0.57 at a .5) |
| `withdraw` | CARD outline + chip line, RED arrow leaving it downward (money out) | none | 0.03 ms |

Options `o` (as for every sym): `u` (draw-on 0..1, default 1), `a` (alpha; below 1 the symbol is drawn into a layer
once, so overlaps do not show through), `dim` (all DIM, red included), `color` (stroke colour), `k` (state).
New for these four: `mono` (the red element takes the stroke colour; pips use it for DONE). There is no `fill` option.

Where the geometry differs from K1-K4 (accepted in review):
- `tickets`: plates at (-43,-30), (-29,-14), (-15,2), i.e. the spec's moved +3 / +6 units so the stack is centred in
  its box (x -43..43, y -30..30). The plates are not filled #131417: the strokes behind a plate are clipped out, so
  the plates show whatever is under them (the DIM pip's #000, DONE's .7 panel). The RED dot is at (25, 16), r 5 but
  never below 1.9 px, clear of the front plate's stroke at 30 px.
- `target`: the target line's [7, 6] dashes are butt-capped, so they stay dashes at 30-44 px (round caps close them).
- `calendar`: columns x -33 / -15 / 3 / 21 (the spec's -30 / -12 / 6 / 24 sat 10 / 4 units off-centre), rows y -2 / 16.
  Empty-cell outlines (1.5 px, .35) fade out as their cell pops; cell fills appear over the last 12 % of `u`. Cell 8
  is RED at alpha 1; when it is not red (`dim`, or DONE's white) it takes the other cells' .9, so the grid stays even.
- `withdraw`: as specified.

```js
sym(x, "withdraw", 1818, 120, 44, { u: pr(tv, 17.52, 17.92) });             // D readout line 1
sym(x, "calendar", 1715, 355, 110, { u: pr(tv, 62.25, 62.75) });            // M (k.fill defaults to 1)
sym(x, "calendar", cx, cy, 60, { k: { fill: pr(tv, t0, t0 + 0.8) } });     // cells pop one by one
```

Cell i (1..8) pops with `p_i = cl(8 * fill - (i - 1))`: scale .6 to 1 and alpha e3(p_i).

## donut(x, cx, cy, r, w, frac, o = {})  (K6)

- Track: a full circle of radius `r`, lineWidth `w`, colour `o.restCol` (default TRACK #2A2B2F), drawn clockwise from
  12 o'clock over `o.u` (0..1, default 1). It is not drawn under the red arc.
- Red arc: lineWidth `w + (o.grow || 0)`, butt caps, from 12 o'clock clockwise to `frac`, or counter-clockwise with
  `o.ccw: true`. 2 px #000 radial separators at both ends when 0 < frac < 1.
- `o.a`: alpha (default 1).
- Returns `{ endAngle, midAngle, mid: [x, y], gmid: [x, y] }`: the red arc's midpoint at radius r (where Q's flow lands),
  and the grey arc's midpoint (its opposite).
- Cost 0.08 ms at r 170, w 34.

```js
const D = donut(x, 1480, 430, 170, 34, 0.4 * e4(pr(tv, 78.99, 79.44)), {
  ccw: true, u: e2(pr(tv, 78.16, 78.60)), grow: 4 * e3(pr(tv, 81.60, 81.98)),
  restCol: `rgb(${Math.round(lerp(42, 85, k))},${Math.round(lerp(43, 87, k))},${Math.round(lerp(47, 92, k))})`, // TRACK -> DIM
});
// D.mid = [1318.3, 377.5] and D.gmid = [1641.7, 482.5] at frac .4
```

## pips(x, Xr, Y, w, h, pitch, st = [], o = {})  (K7)

The four CONDITION PIPS: TAG plates right to left. Pip i (0..3) sits at `X = Xr - w - i * pitch`, size w x h. Its
symbol (tickets, target, shield, calendar) is 0.62h, centred. Sizes: A 112x72 pitch 128; J, L, M and N 72x48 pitch 84.
Below 72x48 it warns once in the console.

`st[i] = { s, u, pulse, from, k }`:
- `s`: `"dim"` (the default) | `"lit"` | `"done"`;
  - dim: no fill, outline white .25, symbol DIM;
  - lit: PANEL, RED rim 1.5 px, symbol white + red;
  - done: fill .7, outline white .25, symbol white .8 with its red element white too, and the top-left cut RED with a
    white tick.
- `u`: 0..1 progress into `s` from the previous state (default 1). It cross-fades on e3(u); run it over 0.25 s.
  The previous state is dim for lit and lit for done; `from` overrides it.
- `pulse`: 0..1, scale 1 + .08 sin(pi p), in any state (0.25-0.3 s).
- `k`: the symbol's state, e.g. `{ fill: 1 }` for the calendar.

`o`:
- `a`: group alpha. Whenever `a` times the context's alpha is below 1, the row is drawn once into a device-space layer
  and faded as ONE layer (so a fade through `ctx.globalAlpha` is fine too).
- `enter`: 0..1, linear over 0.64 s. Each pip takes 0.40 s expo with a 16 px rise, pip 1 first, 0.08 s apart (right to
  left).
- `shimmer`: 0..1, one white .12 band, 80 px, 20 deg, sweeping right to left (eio), CLIPPED to the plates: a skeleton
  band over placeholders (beat A), not a source-atop sheen (which on DIM pips would only tint the DIM strokes). A only.

Where it differs from K7 (accepted in review):
- Pip 3 draws a private variant of video 1's shield (same outline; its limit line in butt-capped [7, 6] dashes over
  -23.5..23.5, fading in with e2(u)), because video 1's round-capped [6, 5] dashes close into a solid line at 30-44 px.
  Keep `sym(x, "shield", ...)` everywhere else.
- The DONE cut and tick are drawn by pips itself (same geometry as `tag()`'s `done`).

Returns `[{ X, Y, w, h, cx, cy }]` x 4 (pip 1 first).
Cost: 0.36 ms (A, all DIM, with the shimmer), 0.59 ms (72x48, mixed states with cross-fades), 0.77 ms (o.a .5 + enter),
0.54 ms (ctx alpha .5).

```js
// A: land at 7.46, shimmer 8.08-8.58, exit 8.40-8.70 as one layer
pips(x, 1194, 232, 112, 72, 128, [{}, {}, {}, {}], {
  enter: pr(tv, 7.46, 7.46 + 0.64), shimmer: pr(tv, 8.08, 8.58), a: 1 - eio(pr(tv, 8.40, 8.70)) });
// J: pip 1 LIT, DONE on '40+' (54.01), one pulse at 51.66
pips(x, 1750, 262, 72, 48, 84, [{ s: tv < 54.01 ? "lit" : "done", u: tv < 54.01 ? 1 : pr(tv, 54.01, 54.26),
  pulse: pr(tv, 51.66, 51.96) }, {}, {}, {}]);
```

## metalCount(x, value, fin, X, Y, size, o = {})  (K8)

Video 1's st_count, generalized. `fin` is the final string, always WITHOUT a space after '$': `'$1,000'`,
`'$10,000'`, `'$2,000'`, `'$20,000'`, `'60'`, `'40'`, `'40%'` (a '$ ' is normalised to '$'). It splits into a prefix
(before the first digit), a body (the digits and commas) and a suffix (after the last digit).

The current body is `Math.round(value)`, with commas when `fin` has them. Its glyphs are drawn right-aligned into the
final body's glyph slots (from `metalLayout(fin, size, w)`), each centred on its slot. The prefix and suffix sit at their
final positions.

Landing (as K8 specifies): once `Math.round(value)` reaches the final number, it draws `metal(x, fin, ...)` statically,
so the landed frame never moves. With `value = final * e4(pr(tv, t0, tLand))` a small final lands where
final * e4 reaches final - 0.5 (for '40' at two thirds of the count, for '60' at 70 %) and holds until tLand; a large
one ('$20,000') lands on the last frame or two. It never stalls on final - 1.

`o`:
- `w`: weight, default 200;
- `align`: `"left"` (default) | `"center"` | `"right"`;
- `a`: alpha;
- `fade`: the bottom 28 % fades out (heroes of 150 px and up);
- `sheen`: 0..1, on the static numeral (landed, or `from` before the count). It is drawn source-atop in a layer at the
  numeral's own pixels, so the numeral does not shift or resample while the sheen passes. Use it instead of `metal()`'s
  sheen for any metallic numeral that has to hold still;
- `from`: the landed string a count starts from, for a count that does not start at 0 (B-roll 2's `'$1,000'` to
  `'$2,000'`). Up to from's number it draws `metal(from)` exactly; above it, the prefix, slots and suffix glide from
  from's layout to fin's with k = (value - fromN) / (final - fromN), so the first counting frame matches `metal(from)`
  and the landing matches `metal(fin)`. Without it the '$' jumps about 20 px (x 1433 to 1413) on the first counting
  frame.

Returns the final layout width (L.width). Cost 1.28 ms at '$20,000' 230 px fade (video 1's metal(): 1.10), 0.23 ms at
'40%' 120, 0.28 ms for the '$2,000' from-count at 88, 3.06 ms at '$20,000' 230 with a sheen (metal()'s own sheen at that
size: 3.59).

```js
// I: '$20,000' lands on 49.30, sheen after it
metalCount(x, 20000 * e4(pr(tv, 48.60, 49.30)), "$20,000", 960, 600, 230,
  { fade: true, align: "center", sheen: pr(tv, 49.40, 49.90) });
// B-roll 2: one call from the reset on; '$1,000' -> '$2,000' over 42.82-43.32, sheen on «دولار» 43.68
metalCount(x, 1000 + 1000 * e4(pr(tv, 42.82, 43.32)), "$2,000", 1700, 450, 88,
  { align: "right", from: "$1,000", sheen: pr(tv, 43.68, 44.18) });
```

## tradeChip(x, X, Y, w, h, label, o = {})  (K9)

The FIRST-TRADE chip, shared by B-roll 1 (230x60) and M (220x50). It is a TAG plate (PANEL + hairline). The Arabic
label is A400 34 white, right-aligned at X + w - 45, with its baseline at Y + h/2 + 12. A RED dot r 6 is centred at
(X + w - 26, Y + h/2).

`o`:
- `ghost`: no fill, a dashed outline white .4 (dash 6/5), the label at .4 and the dot white .4;
- `pop`: 0..1, the ghost TURNING SOLID (B-roll 1, 15.59). `pop: 0` IS the ghost (it draws the ghost by itself; do not
  pass `ghost` with it or draw a second ghost). For 0 < pop < 1 the solid chip pops on back(p, 1.4) about the chip's
  centre (scale 0 -> 1.07 at p .64 -> 1) with alpha cl(3p), over the ghost's dashed outline alone, which fades at
  1 - cl(3p); the ghost's label and dot go on the first pop frame, so the label is never drawn twice. At 25 fps over
  0.25 s: p .16 scale .57 (alpha .48), .32 .91, .48 1.05, .64 1.07, .80 1.04, 1 1. `pop` overrides `ghost`; leaving
  `pop` out means no pop;
- `ring`: 0..1, a white 2 px ring, r 12 to 30 (e3), fading out (1 - ring), at (`o.ringX`, `o.ringY`) (default: the chip's
  centre);
- `a`: alpha.

Returns nothing. Cost 0.05 ms (normal), 0.07 (ghost), 0.06 (mid-pop).

```js
// B-roll 1: ONE call: the ghost from its entry (your envelope a, from 14.68), solid on «صفقة» (15.59), ring on the line
tradeChip(x, 885, 748, 230, 60, "أول صفقة", { pop: pr(tv, 15.59, 15.84), a, ring: pr(tv, 15.59, 15.99), ringX: 1000, ringY: 720 });
// M: the solid chip
tradeChip(x, 1280, 508, 220, 50, "أول صفقة", { a });
```

## skeleton(x, X, Y, w, h, t, a = 1, o = {})  (K10)

A placeholder bar: a TRACK roundRect with r = min(8, h/2) (`o.r` overrides it, e.g. B-roll 2's 340x60 r 10). A
shimmer band (white .10, 80 px, 20 deg) moves right to left every 0.9 s, with phase (t % 0.9) / 0.9, clipped to the bar.

`o.dissolve`: 0..1, alpha 1 - e2(d) and scaleY 1 to .9 about the bar's centre line.

Returns nothing. Cost 0.05 ms.

```js
skeleton(x, 230, 478, 300, 44, tv, a, { dissolve: pr(tv, 31.00, 31.12) });      // F's amount
skeleton(x, 280, 392, 340, 60, tv, 1, { r: 10 });                           // B-roll 2 total
```

## brScene(x, t, lt, o = {}, draw)  (K12, async) and ss(p)

This is the shared B-roll world, video 1's 34_broll.js moved into the kit. It draws the horizon haze (.06) and the
candle bokeh band 1:1, outside the drift. It then applies the drift (scale 1 + 0.005 lt about (960,540)), draws the ◢
floor world at cz = `o.cz0` + 1.2 lt + `o.dz`, and awaits `draw(x, t, lt)` inside the same transform. The background
stays pure #000: there is no fill, because the k_card special is already black.

`o`:
- `cz0`: B-roll 1 0, B-roll 2 37;
- `bokehY`: the bokeh layer top, B-roll 1 362, B-roll 2 370;
- `dz`: extra dolly in m (default 0; video 1's B-roll 1 pushed 1.8 m on its chart dive).

`lt` is the number of seconds since the B-roll's first frame. Cost 2.9 ms with an empty draw: floor 2.1, bokeh 0.57,
haze 0.14. The output matches video 1's world.

The drift moves everything drawn in `draw()` with the floor, and far from the centre that is not small (group H,
B-roll 2, 11 s): at lt 11 the scale is 1.055, so a point 780 px from x 960 ends 43 px further out (the left card's
x 180 -> 137, the right card's edge 1740 -> 1783, the flag at 1826). The spec's screen positions are the lt 0
positions; the scene is meant to drift. Anything that must hold its screen position goes after `await brScene(...)`,
outside the drift. (Haze and bokeh stay put; the floor horizon moves 0.35 px per second under them, 3.9 px by lt 11.)

`ss(p)` is the B-roll exit curve: smoothstep, 0.42 s, at most 14.3 % lost in any one frame.

```js
async broll(x, t, S, id) {
  if (id !== 1) return;
  const lt = Math.max(0, t - S.shot.f0 / 25);
  await brScene(x, t, lt, { cz0: 0, bokehY: 362 }, async (c) => { /* the scene, drifting with the world */ });
}
```

## comet(x, pts, u, o = {})  (K13), comet.passTimes, comet.quad

The red comet, shared by D (stairs) and B-roll 2. `pts` is a polyline in your space: a list of [x, y], or a sampled
quadratic from `comet.quad`. The head sits at arc length `u * L(pts)`; u is already eased by you and is clamped to 0..1.

The head is a RED disc of radius `o.r` (default 7) with a white core r 3, over one cached glow sprite of radius `o.glow`
(default 26), RED .35. The tail is `o.tail` dots (6) behind the head, every `o.gap` px of arc (9), radius falling
linearly to 30 %. The tail's alpha is ONE ramp, 30 % at its end to 100 % at the head (the dots overlap, so fading each
dot on its own beaded the tail). The ramp is a straight gradient from the tail's end to the head: exact on straight
runs; within one tail length after a corner it can sit up to .06 above a per-dot ramp (.08 with a `du` tail), which
does not show. The whole comet is built in one small device-space layer and blitted once at `o.a`, so the tail never
shows through the head.

`o`:
- `a`: alpha;
- `fade`: 0..1, fades the tail only, at the end of the run;
- `du`: the eased u step over the last frame, `u(t) - u(t - 0.04)` (default 0: the spec's comet). When the head moves
  further in one frame than the tail is long, the tail grows to that step, keeping its 9 px spacing (more dots), so
  successive frames join up instead of strobing. D needs it: its 0.90 s eio run over st_MAIN (2,180 px) moves the head
  up to about 290 px per frame against a 54 px tail, which strobes (visual review). With `du` D's tail peaks at about
  33 dots. B-roll 2's in-path runs are slow enough for the defaults.

Returns `{ x, y, d, L }` (the head, its arc length and the total length). Arc-length tables are cached per `pts` array:
build it once and never mutate it in place. Cost 0.22 ms (64-point curve), 0.64 ms with a 33-dot `du` tail.

`comet.passTimes(pts, t0, d, ease = eio, marks)` returns, for each mark, the time the head reaches it, for a run of
d seconds from t0 with the head at `ease(lt / d) * L`. It bisects on the ease, as video 1's st_cometPass did. A mark is
a point [x, y], projected onto the polyline, or an arc length in px.

`comet.quad(P0, C, P2, n = 64)` returns a quadratic Bézier sampled into n + 1 points.

```js
const tA = 19.62, tD = 0.90, uS = (tt) => eio(pr(tt, tA, tA + tD));
comet(x, st_MAIN, uS(tv), { du: uS(tv) - uS(tv - 0.04), fade: pr(tv, tA + tD, tA + tD + 0.15) });
const pass = comet.passTimes(st_MAIN, tA, tD, eio, [[1540, 742], [1540, 642], [1300, 542], [1060, 442], [820, 342], [580, 242]]);
// -> the VO time the head reaches S1's first riser and each landing's right end (19.9624 ... 20.2483 on st_MAIN)
const PATH = comet.quad(P0, C, P2); // a curved path: build it once, at file scope
```

## Notes for the groups

- `tag(..., { done })`, `card(..., { tab })` and `chev3()` in 10_kit.js now MULTIPLY the context's alpha for the red
  cut, tick, tab and ▲▲▲ (they used to overwrite it). A fade through `ctx.globalAlpha` and a fade through `o.a` give the
  same pixels; at alpha 1 the output is video 1's.
- metal strings: never put a space after '$' (metalLayout already adds 0.2 em).
- brScene is async: `await` it.
- `ss` is a kit name now. Video 1's 33_accounts.js and 34_broll.js use `ss` as a local variable (a scale, a stroke
  style): legal, but it hides the kit's `ss` inside those functions, so rename it there if you need the curve. Do not
  copy video 1's `br_*` world code: brScene is that world.
