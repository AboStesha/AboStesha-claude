# Axi Iraq — 4-second logo ident (intro = outro), three styles

These are three versions of one 4-second logo ident for **Axi Iraq**. Each one opens and closes a video.

All three are vertical, 1080×1920 at 60 fps (240 frames), with motion graphics and sound effects and no voice. Each builds the official **axi / العراق** logo by about 2.5–2.8 s and keeps it on screen to the end. A finishes with a slow push-in that lands exactly on the final placement.

| File | Style | Idea | Final frame |
|---|---|---|---|
| `AxiIraq_Ident_A_Ascend.mp4` | **Ascend** — kinetic, market | A live price line rides up a dark trading screen with the camera on its head and a ticking price tag. It irons out into one straight rising line, the exact axis of the x, and inflates into the x's long stroke. The leading tick leaps up and becomes the dot of the i. The i rises under it like a candle, then the arm of the x and the a snap in. The market rises into the brand gradient and «العراق» writes in right to left. | White logo on the primary gradient (the brand's video-open spec) |
| `AxiIraq_Ident_B_Blueprint.mp4` | **Blueprint** — precise, premium | Construction guides shoot across a black drafting grid: the baseline, the x-height, the a's circle and the 51.7° axis of the x. Plotter heads trace every outline, then each letter floods solid white and the guides retract. «العراق» is traced and filled right to left while the camera pulls back from the a to the full mark. | White logo on the tertiary dark gradient |
| `AxiIraq_Ident_C_Drop.mp4` | **Drop** — tactile, 3D | Seen from above, the letters are thick matte slabs. They drop out of the camera onto a light tabletop in true perspective, one after another, each landing with a bounce, a sliding shadow and a nudge of the camera. «العراق» taps in right to left; the camera sits to the right while the pieces land, so a falling piece never hides one already down, then it dollies back to centre. The slabs then press flat into the table like a stamp, and the logo is printed in ink. | Ink logo on the light gradient |

`stills/preview.jpg` shows key moments of all three.

### Outro for A

`AxiIraq_Outro_A_Ascend.mp4` is «Ascend» in reverse, 4 s, 1080×1920 at 60 fps.
- **Opening.** It opens on the intro's exact last frame: the white logo over the primary gradient, with a passing halo.
- **The logo comes apart.**
  - «العراق» un-writes left to right, last part first, and the dark trading screen falls over the gradient from the top.
  - The a slides away, the arm of the x lifts off and the i sinks like a candle.
  - The i's dot turns mint and leaps back onto the top of the x, where it becomes the live price head.
  - The x deflates into one straight rising line.
- **The market rides on.** The line comes alive and keeps rising through monochrome Japanese candles: hollow candles are up and filled candles are down. The price tag ticks up as the camera follows.
- **Ending.** The chart fades to black, the mint head goes out last, and the final 0.35 s is pure black.

The line keeps rising rather than reversing down, so the outro never ends on a falling market. `stills/preview_outro.jpg` shows key moments.

## Brand rules followed

From `../BRAND.md`:
- **Logo.** Only the official Axi Iraq logo is used, never the X on its own (see the client rule there).
- **Colours.**
  - Gradients are vertical only.
  - Red is used only as a tiny accent: B's angle arc and plotter node.
  - A's rising chart uses mint, the brand's colour for gains.
- **Numbers.** They use Inter.
- **Placement.** The logo is centred, as on an opener.

## The logo

The logo was traced from the client's file, `ref/logo.webp`, which is `../brand/AxiIraq_Logo_Stacked_Ink.webp`, by `tools/vectorize.py` into nine separately animatable parts:
- a,
- the x's body and arm,
- the i's stem and dot,
- the four connected pieces of «العراق».

The source file is itself an old polygon trace: the bowl of the a is made of straight facets, and there are small pixel notches. The tracer therefore applies a corner-preserving smoothing. Real corners, those that turn by more than 28°, stay sharp, and only the facets and jaggies are smoothed out.

## Audio

Every sound is synthesised in `audio/ident.py` and synced to each film's events, so there are no third-party licences. Each mix is mastered to −14 LUFS with a true peak at or below −1 dBTP.

| Version | Sounds |
|---|---|
| A outro | The intro's chord rings on. Descending notes play as «العراق» un-writes, a falling whoosh brings in the dark screen, whooshes carry the parts away, and a descending blip leaps onto the x. The stroke sucks in, then market ticks ride on over a soft pulse and fade out with the picture. |
| A | Price ticks that speed up and a filtered riser. A snap and sub hit as the line locks. A rising blip and a ting as the tick becomes the i's dot. A zip, snaps and an airy rise into a warm D-major chord, then four mallet notes for «العراق». |
| B | A low drone and laser-like guide sweeps with ticks. Plotter-pen scratches. Fills that swell into a deep hit with a minor-7 chord, then a resolving C-major chord and a bell when «العراق» completes. |
| C | Air before each drop. Heavy slab landings with marimba notes rising through D-major pentatonic, and lighter taps for «العراق». A rising press into a deep stamp with a chord bloom. |

## QA

QA was run on each delivered file. The checks:
- **Streams** with `ffprobe`. Video is H.264 High, 1080×1920, yuv420p, BT.709, CFR. Audio is AAC 48 kHz stereo at 320 kb/s.
- **Loudness** with `ffmpeg ebur128`.
- **Every frame** on per-second sheets in `qa/*_sheet_s0…s3.jpg`; all were viewed.
- **Last frame vs the official logo.** The logo in the last frame is compared with the official file placed at the final position. The IoU of the logo shapes is in the table, and the full results are in `qa/*_qa.json`.

| File | Size | Frames · fps | Loudness | Logo IoU vs official | Final hold from |
|---|---|---|---|---|---|
| A · Ascend | 4.2 MB | 240 · 60/1 | -14.3 LUFS, -1.4 dBTP | 0.990 | 3.92 s |
| B · Blueprint | 3.1 MB | 240 · 60/1 | -14.1 LUFS, -1.4 dBTP | 0.991 | 3.32 s |
| C · Drop | 2.9 MB | 240 · 60/1 | -14.1 LUFS, -1.1 dBTP | 0.991 | 3.47 s |
| A · Outro | 4.4 MB | 240 · 60/1 | -14.2 LUFS, -1.4 dBTP | 0.991 (first frame) | black from 3.64 s (last frame luma 0) |

The audio was measured, not listened to.

## Files

| Path | Contents |
|---|---|
| `assets/logo.js` | The traced logo: SVG path data per part in the 2000×1453 space of the official file. |
| `src/kit.js` | Easing, brand colours, the logo as paths, outline tracing, backgrounds, grain and light effects. |
| `src/film_a.js`, `film_b.js`, `film_c.js`, `film_ao.js` | The three films and A's outro (`?film=ao`). Each is `draw(ctx, t)` with motion-blur sub-samples. |
| `src/index.html` | Renders a film: open `src/index.html?film=a&play` to preview live, or add `?t=2.5` for one frame. |
| `tools/render.mjs` | Renders lossless PNG frames in parallel Chromium workers, encodes H.264 (BT.709, CRF 14) and muxes AAC 320k: `node tools/render.mjs --film a --audio audio/ident_a.wav --out out.mp4` |
| `tools/still.mjs`, `tools/sheet.py`, `tools/qa.py` | Stills, contact sheets, and the QA script: streams, loudness, every frame on per-second sheets, and the last frame's logo against the official file. |
| `tools/vectorize.py` | The tracer that produced `assets/logo.js`. |
| `audio/ident.py`, `audio/synthkit.py` | The sound design and the shared synth kit. |
