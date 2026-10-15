# Axi Academy — 5-second logo sting (intro = outro), three styles

These are three versions of the same 5-second logo sting. Each one opens and closes every Axi Academy video.

All three are 1920×1080 at 60 fps (300 frames), with motion graphics and sound effects and no voice. Each ends on the client's horizontal lockup (**axi · nib · ACADEMY** on the slate gradient) and holds it for the last second.

| File | Style | Idea |
|---|---|---|
| `AxiAcademy_Intro_A_Ink.mp4` | **Ink** — elegant, hand-drawn | A red ink drop falls in close-up and lands as the nib's tip. Two hairlines draw the nib, and it fills like ink. The bars are underlined, then «axi» and «ACADEMY» are handwritten stroke by stroke. The tip catches one glint. |
| `AxiAcademy_Intro_B_Market.mp4` | **Market** — kinetic, punchy | A live candlestick chart climbs on a dark trading screen. The camera whip-zooms into the newest candle, and the two halves of the nib slam shut around it, so the candle becomes the cut-out. The light background rises like the market. The red tip launches up like a price arrow, the bars lock in, and the words slide out from behind the nib. |
| `AxiAcademy_Intro_C_Light.mp4` | **Light** — cinematic | In the dark the red tip sparks and the candle, as the filament, flickers on. The nib glows like a light bulb, with light rays and floating dust. The room brightens into the brand gradient, then two beams of light spread from the nib to reveal the words. A final glint closes it. |

## The final frame

The lockup was rebuilt as vectors from the client's image `ref/final_frame.webp`, measured in its 2000×1125 space and drawn at ×0.96.

- **Nib:** two cubic Béziers per side, mirrored about one axis. The fit error is under 0.04 px.
- **Candle slot:** the slot and its rounded body.
- **Bars:** two pills.
- **Red tip:** `#DA252F`, measured from the client's image. Axi's primary red is `#E4002E`.
- **axi:** the official Axi wordmark polygons, fitted letter by letter to the image.
- **ACADEMY:** geometric letters fitted to the image. They stay sharp at any size and can be written stroke by stroke.
- **Background and shadow:** the image's vertical gradient and its very soft shadow, a Gaussian of σ≈90 px at about 5% strength.

Against the client image, the rendered last frame is off by about 2/255 on average, which is mostly webp noise. The QA figures are in `qa/`.

## Audio

Every sound is synthesised in `audio/sting.py` and synced to each film's timeline, so there are no third-party licences.

| Version | Sounds |
|---|---|
| A | A falling drop and a water plip. Nib-on-paper scribbles for each stroke, a liquid rise and pen taps. A warm D-major-9 pad and a mallet motif that resolves on the glint. |
| B | A 130 BPM 16th-note bass with ticking candles. A riser into the whip-zoom, then a short breath and a heavy slam when the nib shuts. A price-arrow zip, a metal ting, side swishes and a bright final stab. |
| C | Room tone and electric crackles. A filament buzz that flickers with the picture, a glass ring, and a reverse swell into a warm bloom. Airy beams with a rising bell arpeggio and a crystal glint. |

Each mix is mastered to −14 LUFS with a true peak at or below −1 dBTP.

## Files

| Path | Contents |
|---|---|
| `assets/lockup.js` | The measured lockup geometry: nib Béziers, slot, bars, tip, axi polygons, ACADEMY parameters, gradient and shadow. |
| `src/kit.js` | Easing and the camera track, the lockup as paths, pen-order reveals, background, grain, shadow and glow. |
| `src/film_a.js`, `film_b.js`, `film_c.js` | The three films. Each is `draw(ctx, t)` with motion-blur sub-samples. |
| `src/index.html` | Renders a film: open `src/index.html?film=a&play` to preview live, or add `?t=2.5` for one frame. |
| `tools/render.mjs` | Renders lossless PNG frames in parallel Chromium workers, encodes H.264 (BT.709, CRF 12) and muxes AAC 320k: `node tools/render.mjs --film a --audio audio/sting_a.wav --out out.mp4` |
| `tools/still.mjs`, `tools/sheet.py`, `tools/qa.py` | Stills, contact sheets, and the QA script: streams, loudness, every frame on per-second sheets, and the final frame compared with the client image. |
| `tools/vectorize/` | The measurement and fitting scripts that produced `assets/lockup.js`. |
